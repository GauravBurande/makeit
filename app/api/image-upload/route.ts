import { NextRequest, NextResponse } from "next/server";
import { uploadImageFileAndReturnUrl } from "@/lib/r2";
import User from "@/models/User";
import connectMongo from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    //@ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const userId = formData.get("userId") as string;

      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File is too large. Maximum size is 10MB." },
          { status: 400 }
        );
      }

      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = await uploadImageFileAndReturnUrl(file, fileName);

      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { storageUsed: file.size } },
        { new: true }
      );

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
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
