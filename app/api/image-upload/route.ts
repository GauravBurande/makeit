import { NextRequest, NextResponse } from "next/server";
import { uploadImageFileAndReturnUrl } from "@/lib/r2";
import User from "@/models/User";
import connectMongo from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import sharp from "sharp";
import BeforeImage from "@/models/BeforeImages";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    //@ts-ignore
    const session = await getServerSession(authOptions);
    if (session) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const userId = formData.get("userId") as string;

      console.log("formData: ", formData);
      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File is too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Compress image
      let quality = 90;

      const compressedImage = await sharp(buffer)
        .png({ quality: quality })
        .toBuffer();

      const compressedSizeInKB = compressedImage.byteLength / 1024;
      console.log(
        "Compressed image size:",
        compressedSizeInKB.toFixed(2),
        "KB"
      );

      // Create a new File object from the compressed buffer
      const fileName = `${Date.now()}-${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}.png`;
      const compressedFile = new File([compressedImage], fileName, {
        type: "image/png",
      });

      // Upload the compressed file
      const fileUrl = await uploadImageFileAndReturnUrl(
        compressedFile,
        fileName
      );

      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { storageUsed: compressedSizeInKB } },
        { new: true }
      );

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const addedBeforeImage = BeforeImage.create({
        userId,
        imageUrl: fileUrl,
      });

      if (!addedBeforeImage) {
        return NextResponse.json(
          { error: "Failed to add image" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        fileUrl,
        updatedStorageUsed: user.storageUsed,
      });
    } else {
      return NextResponse.json(
        { error: "You must be logged in!" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
