import { NextResponse } from "next/server";
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
        { error: "You must be logged in!" },
        { status: 401 }
      );
    }
    await connectMongo();
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const style = formData.get("style") as string;
    const roomType = formData.get("roomType") as string;
    const color = formData.get("color") as string;
    const material = formData.get("material") as string;
    const userId = formData.get("userId") as string;
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageBase64 = fileToBase64(buffer);
    const mimeType = file.type || getMimeType(file.name);
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
    const result = await model.generateContent([interiorPrompt, imagePart]);
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
        { error: "No image generated" },
        { status: 500 }
      );
    }
    // Upload to R2
    const filename = `${Date.now()}-${userId}.png`;
    const fileToUpload = new File(
      [new Uint8Array(generatedImageBuffer)],
      filename,
      {
        type: "image/png",
      }
    );
    const uploadedUrl = await uploadImageFileAndReturnUrl(
      fileToUpload,
      filename
    );
    // Save to DB
    const interiorImage = await InteriorImage.create([
      {
        userId,
        prompt,
        beforeImage: file.name,
        afterImage: uploadedUrl,
        negativePrompt: "",
        style,
        roomType,
        color,
        material,
        status: "completed",
      },
    ]);
    // Update user
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
    return NextResponse.json(
      { imageUrl: uploadedUrl, id: interiorImage[0]._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in Gemini POST handler:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
