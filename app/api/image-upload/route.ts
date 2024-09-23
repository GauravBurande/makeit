import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import { uploadImageFileAndReturnUrl } from "@/lib/r2";
import User from "@/models/User";
import connectMongo from "@/lib/mongoose";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Invalid content type" });
    }

    const { fields, file } = await parseMultipartForm(req);
    const { userId, fileName, fileType } = fields;
    const fileSize = parseInt(fields.fileSize, 10);

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (fileSize > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ error: "File is too large. Maximum size is 10MB." });
    }

    const filename = `${Date.now()}-${fileName}`;

    // Create a File-like object from the Buffer
    const fileLike: File = {
      name: fileName,
      lastModified: Date.now(),
      size: fileSize,
      type: fileType || "application/octet-stream",
      webkitRelativePath: "",
      slice: (start?: number, end?: number, contentType?: string) => {
        const slicedBuffer = Buffer.from(
          file.buffer,
          file.byteOffset + (start || 0),
          (end || file.length) - (start || 0)
        );
        return new Blob([slicedBuffer], {
          type: contentType || "application/octet-stream",
        });
      },
      stream: () =>
        new ReadableStream({
          start(controller) {
            controller.enqueue(file);
            controller.close();
          },
        }),
      text: () => Promise.resolve(file.toString("utf-8")),
      arrayBuffer: () =>
        Promise.resolve(
          file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)
        ),
    };

    const fileUrl = await uploadImageFileAndReturnUrl(fileLike, filename);

    const user = User.findById(userId, {
      $inc: { storageUsed: fileSize },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
}

async function parseMultipartForm(
  req: NextApiRequest
): Promise<{ fields: Record<string, string>; file: Buffer }> {
  return new Promise((resolve, reject) => {
    let body = "";
    let file: Buffer | null = null;
    const fields: Record<string, string> = {};

    (req as IncomingMessage).on("data", (chunk) => {
      body += chunk;
    });

    (req as IncomingMessage).on("end", () => {
      const parts = body.split("\r\n");
      let currentField = "";

      for (let i = 0; i < parts.length; i++) {
        if (parts[i].includes("Content-Disposition: form-data; name=")) {
          currentField = parts[i].split('"')[1];
          if (parts[i].includes("filename=")) {
            fields.fileName = parts[i].split("filename=")[1].replace(/"/g, "");
            file = Buffer.from(parts[i + 3], "binary");
          } else {
            fields[currentField] = parts[i + 2];
          }
        }
      }

      if (!file) {
        reject(new Error("No file found in the request"));
      } else {
        resolve({ fields, file });
      }
    });

    (req as IncomingMessage).on("error", reject);
  });
}
