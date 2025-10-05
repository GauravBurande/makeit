import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadImageFileAndReturnUrl } from "@/lib/r2";
import InteriorImage from "@/models/InteriorImage";
import User from "@/models/User";
import connectMongo from "@/lib/mongoose";
import { authOptions } from "@/lib/next-auth";
import { getServerSession } from "next-auth";
import { env } from "@/env";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || env.GEMINI_API_KEY
);

function fileToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function POST(req: Request) {
  try {
    // @ts-ignore
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json(
        { code: "unauthorized", message: "You must be logged in!" },
        { status: 401 }
      );
    }
    await connectMongo();
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { code: "invalid_request", message: "Invalid or missing form data." },
        { status: 400 }
      );
    }
    const prompt = formData.get("prompt") as string;
    const style = formData.get("style") as string;
    const roomType = formData.get("roomType") as string;
    const color = formData.get("color") as string;
    const material = formData.get("material") as string;
    const userId = formData.get("userId") as string;
    const file = formData.get("image") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { code: "missing_user_id", message: "User ID is required." },
        { status: 400 }
      );
    }
    if (!file && !imageUrl) {
      return NextResponse.json(
        {
          code: "no_image_provided",
          message:
            "No image provided. Please upload a file or provide an image URL.",
        },
        { status: 400 }
      );
    }
    let buffer: Buffer | null = null;
    let mimeType: string = "image/png";
    let fileName: string = "upload.png";
    if (file) {
      // Only allow certain file types
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            code: "unsupported_file_type",
            message: `Unsupported file type: ${file.type}`,
          },
          { status: 415 }
        );
      }
      try {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } catch {
        return NextResponse.json(
          { code: "file_read_error", message: "Failed to read uploaded file." },
          { status: 400 }
        );
      }
      mimeType = file.type || getMimeType(file.name);
      fileName = file.name;
    } else if (imageUrl) {
      // Fetch the image from the URL
      let imgRes: Response;
      try {
        imgRes = await fetch(imageUrl);
      } catch {
        return NextResponse.json(
          {
            code: "image_fetch_failed",
            message: "Failed to fetch image from URL.",
          },
          { status: 400 }
        );
      }
      if (!imgRes.ok) {
        return NextResponse.json(
          {
            code: "image_fetch_failed",
            message: `Failed to fetch image from URL. Status: ${imgRes.status}`,
          },
          { status: 400 }
        );
      }
      try {
        const arrayBuffer = await imgRes.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } catch {
        return NextResponse.json(
          {
            code: "image_buffer_error",
            message: "Failed to process image from URL.",
          },
          { status: 400 }
        );
      }
      // Try to get mime type from headers or fallback
      mimeType = imgRes.headers.get("content-type") || getMimeType(imageUrl);
      fileName = imageUrl.split("/").pop() || "upload.png";
      // Only allow certain mime types
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(mimeType)) {
        return NextResponse.json(
          {
            code: "unsupported_file_type",
            message: `Unsupported image type from URL: ${mimeType}`,
          },
          { status: 415 }
        );
      }
    }
    if (!buffer) {
      return NextResponse.json(
        {
          code: "image_buffer_error",
          message: "Failed to process image data.",
        },
        { status: 400 }
      );
    }
    const imageBase64 = fileToBase64(buffer);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview",
    });
    const imagePart = { inlineData: { data: imageBase64, mimeType } };
    // Compose prompt
    let interiorPrompt = `Create an interior room design`;
    if (style) interiorPrompt += ` that embodies the essence of ${style} style`;
    if (roomType)
      interiorPrompt += `. The design should be tailored for a ${roomType}`;
    if (color) interiorPrompt += `. Utilize ${color} as the primary color`;
    if (material) interiorPrompt += `. Highlight ${material} as a key material`;
    if (prompt) interiorPrompt += `. ${prompt}`;
    // Generate image
    let result: any;
    try {
      result = await model.generateContent([interiorPrompt, imagePart]);
    } catch (err) {
      // Let the catch block below handle Gemini API errors
      throw err;
    }
    if (!result || !result.response) {
      return NextResponse.json(
        { code: "model_error", message: "No response from AI model." },
        { status: 502 }
      );
    }
    const response = result.response;
    const candidates = response.candidates;
    let generatedImageBuffer: Buffer | null = null;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.inlineData) {
          generatedImageBuffer = Buffer.from(part.inlineData.data, "base64");
          break;
        }
      }
    }
    if (!generatedImageBuffer) {
      return NextResponse.json(
        {
          code: "no_image_generated",
          message: "AI model did not return a generated image.",
        },
        { status: 502 }
      );
    }
    // Upload to R2
    const filename = `${Date.now()}-${userId}.png`;
    let fileToUpload: File;
    try {
      fileToUpload = new File(
        [new Uint8Array(generatedImageBuffer)],
        filename,
        {
          type: "image/png",
        }
      );
    } catch {
      return NextResponse.json(
        {
          code: "file_creation_error",
          message: "Failed to create file for upload.",
        },
        { status: 500 }
      );
    }
    let uploadedUrl: string;
    try {
      uploadedUrl = await uploadImageFileAndReturnUrl(fileToUpload, filename);
    } catch {
      return NextResponse.json(
        { code: "upload_failed", message: "Failed to upload generated image." },
        { status: 500 }
      );
    }
    // Save to DB
    let interiorImage: any;
    try {
      interiorImage = await InteriorImage.create([
        {
          userId,
          prompt,
          beforeImage: file ? file.name : imageUrl || "",
          afterImage: uploadedUrl,
          negativePrompt: "",
          style,
          roomType,
          color,
          material,
          status: "completed",
        },
      ]);
    } catch {
      return NextResponse.json(
        {
          code: "db_error",
          message: "Failed to save generated image to database.",
        },
        { status: 500 }
      );
    }
    // Update user
    try {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            interiorImages: {
              imageId: interiorImage[0]._id,
              imageUrl: uploadedUrl,
            },
          },
        },
        { new: true }
      );
    } catch {
      // Not critical, but log and continue
      console.warn("Failed to update user with new image.");
    }
    return NextResponse.json(
      { imageUrl: uploadedUrl, id: interiorImage[0]._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in Gemini POST handler:", error);
    // Default error response
    let status = 500;
    let code = "internal_error";
    let message = "An unexpected error occurred. Please try again later.";
    let details: any = undefined;

    // Handle Gemini API quota/rate limit errors
    if (typeof error === "object" && error && "message" in error) {
      const errMsg = (error as any).message as string;
      if (
        errMsg.includes("429 Too Many Requests") ||
        errMsg.includes("quota")
      ) {
        status = 429;
        code = "quota_exceeded";
        message =
          "You have exceeded your usage quota for AI image generation. Please try again later or check your plan/billing.";
        // Try to extract retry time if present
        const retryMatch = errMsg.match(/Please retry in ([0-9.]+)s/);
        if (retryMatch) {
          details = { retryAfterSeconds: parseFloat(retryMatch[1]) };
        }
      } else {
        // Other known Gemini errors
        message = errMsg;
      }
    }

    return NextResponse.json(
      details ? { code, message, details } : { code, message },
      { status }
    );
  }
}
