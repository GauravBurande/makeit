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

      // Detect file type
      const fileType = await sharp(buffer)
        .metadata()
        .then((info) => info.format);

      // Compress image
      let quality = 90;
      let compressedImage;
      let outputFormat;

      switch (fileType) {
        case "jpeg":
        case "jpg":
          compressedImage = await sharp(buffer).jpeg({ quality }).toBuffer();
          outputFormat = "jpeg";
          break;
        case "png":
          compressedImage = await sharp(buffer).png({ quality }).toBuffer();
          outputFormat = "png";
          break;
        case "webp":
          compressedImage = await sharp(buffer).webp({ quality }).toBuffer();
          outputFormat = "webp";
          break;
        default:
          // For unsupported formats, we'll convert to PNG
          compressedImage = await sharp(buffer).png({ quality }).toBuffer();
          outputFormat = "png";
      }

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
      )}.${outputFormat}`;
      const compressedFile = new File([compressedImage], fileName, {
        type: `image/${outputFormat}`,
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

      const addedBeforeImage = await BeforeImage.create({
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
