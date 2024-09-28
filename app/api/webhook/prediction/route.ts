// todo: receive the prediction result and process
//     8. firt make sure the request is from replicate secure this webhook endpoint, but how? let's see
//     9.[IMPORTANT] after done with basic image generation send the image then to the clarity upscaler

import { NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImageFileAndReturnUrl } from "@/lib/r2";
import User from "@/models/User";
import InteriorImage from "@/models/InteriorImage";
import connectMongo from "@/lib/mongoose";
import configs from "@/config";

// convert Buffer to File
function bufferToFile(
  buffer: Buffer,
  filename: string,
  mimetype: string
): File {
  return new File([buffer], filename, { type: mimetype });
}

export async function POST(req: Request) {
  try {
    console.log("Request received from:", req.headers.get("User-Agent"));

    const body = await req.json();
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
      // Process successful prediction
      // Get the prediction result
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
