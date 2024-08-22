import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  // todo: compress image only if the size is more than 512kb
  try {
    // Path to the image in the public folder
    const imagePath = path.join(process.cwd(), "public/designs", "10.png");
    console.log("Image path:", imagePath);

    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    const fileSizeInMB = imageBuffer.length / (1024 * 1024);
    console.log("Image read, size:", fileSizeInMB.toFixed(2), "MB");

    // Determine quality based on file size
    let quality = 90; // Default quality
    if (fileSizeInMB > 15) {
      quality = 70;
    } else if (fileSizeInMB > 10) {
      quality = 80;
    }
    console.log("Selected quality:", quality);

    // Compress the image using Sharp
    console.log("Compressing image with Sharp");
    const compressedImage = await sharp(imageBuffer)
      .webp({ quality: quality })
      .toBuffer();

    const compressedSizeInMB = compressedImage.length / (1024 * 1024);
    console.log(
      "Image compressed, new size:",
      compressedSizeInMB.toFixed(2),
      "MB"
    );

    // Convert the compressed image to base64
    const base64Image = `data:image/png;base64,${compressedImage.toString(
      "base64"
    )}`;
    console.log("Image converted to base64");

    // Create a prediction object with the compressed image
    const prediction = {
      compressedSize: compressedSizeInMB.toFixed(2) + " MB",
      originalSize: fileSizeInMB.toFixed(2) + " MB",
      status: "succeeded",
      output: base64Image,
      metadata: {
        quality: quality,
      },
    };

    console.log("Returning prediction object with compressed image");
    return new Response(JSON.stringify(prediction), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process image: " + (error as Error).message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
