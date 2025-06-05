import { NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImageFileAndReturnUrl } from "@/lib/r2";
import User from "@/models/User";
import InteriorImage from "@/models/InteriorImage";
import connectMongo from "@/lib/mongoose";
import configs from "@/config";
import crypto from "crypto";
import { env } from "@/env";
import { Redis } from "@upstash/redis";
import { createReplicatePrediction } from "@/helpers/createPrediction";

// TODO: fix -> An error occurred with your deployment
// FUNCTION_INVOCATION_TIMEOUT
// polling max attempts 20 outs, and still shows loading state fix it, maybe on both sides later.

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
const SECONDS_IN_24_HOURS = 24 * 60 * 60; // 86400 seconds in 24 hours
async function verifyWebhook(req: Request, body: string) {
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
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    const bodyText = await req.text();
    const verifiedPayload = await verifyWebhook(req, bodyText);

    // Use the verified payload for further processing
    const body = verifiedPayload;

    await connectMongo();

    const redisStatus: string | null = await redis.get(
      `prediction:${body.id}:status`
    );

    if (
      redisStatus &&
      ["completed", "failed", "upscaling"].includes(redisStatus)
    ) {
      console.log("Found status in Redis:", redisStatus);
      return NextResponse.json({
        message: `Prediction already ${redisStatus}`,
      });
    }

    // If not found in Redis, check MongoDB
    if (!redisStatus) {
      console.log("no status in redis, checking mongodb");
      const existingImage = await InteriorImage.findOne({
        predictionId: body.id,
        status: { $in: ["completed", "failed"] },
      });

      if (existingImage) {
        console.log("Found status in MongoDB:", existingImage.status);
        // Update Redis with the status from MongoDB for future quick access
        await redis.set(`prediction:${body.id}:status`, existingImage.status);
        await redis.expire(`prediction:${body.id}:status`, SECONDS_IN_24_HOURS);

        return NextResponse.json({
          message: `Prediction already ${existingImage.status}`,
        });
      }
    }

    if (body.status === "succeeded") {
      const imageUrl = body.output[0];

      const initialModel = "adirik/interior-design";
      const initialModelVersion =
        "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

      if (initialModel == body.model && initialModelVersion == body.version) {
        const interiorImageUrl = body.output;
        console.log("Attempting to process and upscale the image");

        try {
          // Check if the prediction is already being processed
          const status = await redis.get(`prediction:${body.id}:status`);

          if (status === "processing" || status === "upscaling") {
            console.error("This prediction is already being processed");
            return NextResponse.json({
              message: "Prediction already being processed",
            });
          }

          // Set the initial status
          await redis.set(`prediction:${body.id}:status`, "processing");

          console.log("redis db state to processing");

          console.log("sending image to upscaler");
          const input = {
            prompt: `${body.input.prompt}, masterpiece, best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>`,
            image: interiorImageUrl,
            negative_prompt:
              "(worst quality, low quality, normal quality:2) JuggernautNegative-neg",
          };

          const upscaleModelVersion =
            "dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e";
          const response = await createReplicatePrediction(
            input,
            upscaleModelVersion
          );

          if (response.id) {
            console.log("Upscale request sent:", response.id);
            console.log("updating redis db state to upscaling");
            // Update Redis with the new prediction ID and status
            await redis.set(`prediction:${body.id}:status`, "upscaling");
            await redis.expire(
              `prediction:${body.id}:status`,
              SECONDS_IN_24_HOURS
            );
            await redis.set(`prediction:${response.id}:initial_id`, body.id);
            await redis.expire(
              `prediction:${body.id}:initial_id`,
              SECONDS_IN_24_HOURS
            );

            // update the id in interior docuemnt too
            const interiorImage = await InteriorImage.findOneAndUpdate(
              {
                predictionId: body.id,
              },
              {
                $set: {
                  predictionId: response.id,
                  status: "upscaling",
                },
              },
              {
                new: true,
              }
            );

            console.log("updated interior image id: ", interiorImage);

            if (!interiorImage) {
              throw new Error("Failed to update image in MongoDB");
            }

            console.log("Upscale request sent:", response.id);
            return NextResponse.json({ message: "Processed successfully" });
          } else {
            throw new Error("Failed to get prediction ID from Replicate");
          }
        } catch (error) {
          console.error(error);
          // In case of an error, reset the status
          await redis.del(`prediction:${body.id}:status`);
          return NextResponse.json(
            { message: "Failed to process image" },
            { status: 500 }
          );
        }
      }

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
        console.error("InteriorImage not found");
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
        console.error("User not found or interiorImage not in user's array");
        return NextResponse.json(
          { error: "User not found or interiorImage not in user's array" },
          { status: 404 }
        );
      }
      await redis.del(
        `prediction:${body.id}:status`,
        `prediction:${body.id}:initial_id`
      );
      console.log("Webhook processing completed successfully");
    } else if (body.status === "failed") {
      const failedImage = `/failed.png`;
      await redis.set(`prediction:${body.id}:status`, "failed");
      await redis.expire(`prediction:${body.id}:status`, SECONDS_IN_24_HOURS);
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
        console.error("InteriorImage not found");
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
        console.error("User not found or interiorImage not in user's array");
        return NextResponse.json(
          { error: "User not found or interiorImage not in user's array" },
          { status: 404 }
        );
      }

      console.log("Failed prediction processed");
    } else {
      console.error("Prediction not yet completed");
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
