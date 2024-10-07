// todo:
//     9.[IMPORTANT] after done with basic image generation send the image then to the clarity upscaler if needed

import { NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImageFileAndReturnUrl } from "@/lib/r2";
import User from "@/models/User";
import InteriorImage from "@/models/InteriorImage";
import connectMongo from "@/lib/mongoose";
import configs from "@/config";
import crypto from "crypto";
import { env } from "@/env";

// convert Buffer to File
function bufferToFile(
  buffer: Buffer,
  filename: string,
  mimetype: string
): File {
  return new File([buffer], filename, { type: mimetype });
}

const TOLERANCE = 5 * 60; // 5 minutes tolerance for timestamp verification
const WEBHOOK_SECRET = env.REPLICATE_WEBHOOK_SECRET;
async function verifyWebhook(req: Request, body: string) {
  console.log("Verifying webhook...");
  const webhookId = req.headers.get("webhook-id");
  const webhookTimestamp = req.headers.get("webhook-timestamp");
  const webhookSignature = req.headers.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    throw new Error("Missing required webhook headers");
  }

  // Verify timestamp
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTimestamp - parseInt(webhookTimestamp)) > TOLERANCE) {
    throw new Error("Webhook timestamp is outside of the tolerance window");
  }

  // Construct signed content
  const signedContent = `${webhookId}.${webhookTimestamp}.${body}`;

  const secretBytes = Buffer.from(WEBHOOK_SECRET.split("_")[1], "base64");
  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  // Compare signatures
  const receivedSignatures = webhookSignature
    .split(" ")
    .map((sig) => sig.split(",")[1]);
  const isValid = receivedSignatures.some((sig) => sig === expectedSignature);

  if (!isValid) {
    throw new Error("Invalid webhook signature");
  }

  return JSON.parse(body);
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    console.log("Raw body:", bodyText);
    const verifiedPayload = await verifyWebhook(req, bodyText);
    console.log("Verified webhook payload:", verifiedPayload);

    // Use the verified payload for further processing
    const body = verifiedPayload;
    console.log("Prediction body:", body);

    await connectMongo();

    const existingImage = await InteriorImage.findOne({
      predictionId: body.id,
      status: { $in: ["completed", "failed"] },
    });
    if (existingImage) {
      console.log("This prediction has already been processed");
      return NextResponse.json({ message: "Prediction already processed" });
    }

    if (body.status === "succeeded") {
      const imageUrl = body.output;

      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      const fileSizeInKB = imageBuffer.byteLength / 1024;
      console.log("Original image size:", fileSizeInKB.toFixed(2), "KB");

      let quality = 90;
      if (fileSizeInKB > 15000) {
        quality = 70;
      } else if (fileSizeInKB > 10000) {
        quality = 80;
      }

      const compressedImage = await sharp(Buffer.from(imageBuffer))
        .png({ quality: quality })
        .toBuffer();

      const compressedSizeInKB = compressedImage.length / 1024;
      console.log(
        "Compressed image size:",
        compressedSizeInKB.toFixed(2),
        "KB"
      );

      // Convert Buffer to File and upload to R2
      const filename = `${Date.now()}-${body.id}.png`;
      const fileToUpload = bufferToFile(compressedImage, filename, "image/png");
      const uploadedUrl = await uploadImageFileAndReturnUrl(
        fileToUpload,
        filename
      );

      const interiorImage = await InteriorImage.findOneAndUpdate(
        { predictionId: body.id },
        {
          $set: {
            afterImage: uploadedUrl,
            status: "completed",
            afterImageSize: Math.round(compressedSizeInKB),
          },
        },
        { new: true }
      );

      if (!interiorImage) {
        console.log("InteriorImage not found");
        return NextResponse.json(
          { error: "InteriorImage not found" },
          { status: 404 }
        );
      }

      const user = await User.findOneAndUpdate(
        {
          _id: interiorImage.userId,
          "interiorImages.imageId": interiorImage._id,
        },
        {
          $inc: {
            storageUsed: Math.round(compressedSizeInKB),
            usedImages: 1,
          },
          $set: {
            "interiorImages.$.imageUrl": uploadedUrl,
          },
        },
        { new: true }
      );

      if (!user) {
        console.log("User not found or interiorImage not in user's array");
        return NextResponse.json(
          { error: "User not found or interiorImage not in user's array" },
          { status: 404 }
        );
      }

      console.log("Webhook processing completed successfully");
    } else if (body.status === "failed") {
      // Process failed prediction
      const failedImage = `${configs.r2.bucketUrl}/public/failed.png`;
      const interiorImage = await InteriorImage.findOneAndUpdate(
        { predictionId: body.id },
        {
          $set: {
            afterImage: failedImage,
            status: "failed",
          },
        },
        { new: true }
      );

      if (!interiorImage) {
        console.log("InteriorImage not found");
        return NextResponse.json(
          { error: "InteriorImage not found" },
          { status: 404 }
        );
      }

      const user = await User.findOneAndUpdate(
        {
          _id: interiorImage.userId,
          "interiorImages.imageId": interiorImage.id,
        },
        {
          $set: {
            "interiorImages.$.imageUrl": failedImage,
          },
        },
        { new: true }
      );

      if (!user) {
        console.log("User not found or interiorImage not in user's array");
        return NextResponse.json(
          { error: "User not found or interiorImage not in user's array" },
          { status: 404 }
        );
      }

      console.log("Failed prediction processed");
    } else {
      console.log("Prediction not yet completed");
      return NextResponse.json({ message: "Prediction not yet completed" });
    }

    return NextResponse.json({ message: "Processed successfully" });
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
