import connectMongo from "@/lib/mongoose";
import InteriorImage from "@/models/InteriorImage";
import User from "@/models/User";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { env } from "process";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";
const REPLICATE_MODEL_VERSION =
  "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

interface RequestBody {
  userId: string;
  prompt: string;
  image: string;
  negativePrompt: string;
  style: string;
  roomType: string;
  color: string;
  material: string;
}

async function createReplicatePrediction(input: any) {
  const token = env.REPLICATE_API_KEY;
  if (!token) {
    throw new Error("REPLICATE_API_KEY is not set");
  }

  const response = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: REPLICATE_MODEL_VERSION,
      input: {
        prompt: input.prompt,
        image: input.image,
        negative_prompt: input.negativePrompt,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create prediction: ${response.statusText}`);
  }
  return response.json();
}

const createInteriorPrompt = (
  style: any,
  roomType: any,
  color: any,
  material: any,
  prompt: any
) => {
  let interiorPrompt = "Create an interior room design";

  if (style) {
    interiorPrompt += ` that embodies the essence of ${style} style, incorporating its signature elements and aesthetic principles`;
  }

  if (roomType) {
    interiorPrompt += `. The design should be tailored for a ${roomType}, considering its specific functional needs and spatial characteristics`;
  }

  if (color) {
    interiorPrompt += `. Utilize ${color} as the primary color, weaving it throughout the design in various shades and tones to create depth and visual interest`;
  }

  if (material) {
    interiorPrompt += `. Highlight ${material} as a key material, showcasing its unique textures and properties in furniture, fixtures, or architectural elements`;
  }

  if (prompt) {
    interiorPrompt += ". " + prompt;
  }

  return interiorPrompt;
};

async function getImageSize(url: string): Promise<number> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    if (!contentLength) {
      throw new Error("Content-Length header is missing");
    }

    const sizeInBytes = parseInt(contentLength, 10);
    const sizeInKB = Number((sizeInBytes / 1024).toFixed(2));

    return sizeInKB;
  } catch (error) {
    console.error("Error fetching image size:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  let session: mongoose.ClientSession | null = null;
  try {
    const conn = await connectMongo();
    if (!conn) {
      throw new Error("Failed to connect to MongoDB");
    }

    const body: RequestBody = await req.json();
    console.log("body: ", body);
    const {
      userId,
      prompt,
      image,
      negativePrompt,
      style,
      roomType,
      color,
      material,
    } = body;

    const interiorPrompt = createInteriorPrompt(
      style,
      roomType,
      color,
      material,
      prompt
    );
    const prediction = await createReplicatePrediction({
      prompt: interiorPrompt,
      image,
      negativePrompt,
    });

    const beforeImageSize = await getImageSize(image);
    console.log("beoforeImageSize: ", beforeImageSize);

    const isTransactionSupported = await isTransactionEnabled(conn as any);

    if (isTransactionSupported) {
      session = await conn.startSession();
      session.startTransaction();
    }

    const interiorImage = await InteriorImage.create(
      [
        {
          prediction: prediction.id,
          userId,
          prompt,
          beforeImage: image,
          afterImage: "",
          beforeImageSize, // in KBs
          negativePrompt,
          style,
          roomType,
          color,
          material,
        },
      ],
      session ? { session } : undefined
    );

    // Update the user document

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          interiorImages: {
            imageId: interiorImage[0]._id,
            imageUrl: "",
          },
        },
        $inc: {
          storageUsed: beforeImageSize,
        },
      },
      session ? { new: true, session } : { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    if (session) {
      await session.commitTransaction();
    }

    revalidatePath("/studio");

    return new Response(JSON.stringify(prediction), { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    if (session) {
      await session.abortTransaction();
    }
    console.error("Error creating interior image and updating user:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      { status: 500 }
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
}

async function isTransactionEnabled(
  connection: mongoose.Connection
): Promise<boolean> {
  try {
    await connection.db.admin().command({ ping: 1 });
    return true;
  } catch (error) {
    console.warn("Transactions not supported:", error);
    return false;
  }
}
