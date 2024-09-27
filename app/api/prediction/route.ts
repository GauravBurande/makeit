import connectMongo from "@/lib/mongoose";
import { authOptions } from "@/lib/next-auth";
import InteriorImage from "@/models/InteriorImage";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
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

  const webhookEndPoint = `${
    process.env.NODE_ENV === "production"
      ? "https://makeit-interior-deisgner.vercel.app/"
      : // todo: use this when added custom domain
        // ? "https://makeit.ai"
        "https://open-deeply-coyote.ngrok-free.app"
  }/api/webhook/prediction`;

  const response = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: REPLICATE_MODEL_VERSION,
      webhook: webhookEndPoint,
      webhook_events_filter: ["completed"],
      input: {
        prompt: input.prompt,
        image: input.image,
        negative_prompt: input.negativePrompt,
      },
    }),
  });

  if (!response.ok) {
    console.log(response);
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

export async function POST(req: Request) {
  let session: mongoose.ClientSession | null = null;
  try {
    // @ts-ignore
    const user = await getServerSession(authOptions);
    if (user) {
      const conn = await connectMongo();
      if (!conn) {
        throw new Error("Failed to connect to MongoDB");
      }

      const body: RequestBody = await req.json();
      console.info("body: ", body);
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

      const isTransactionSupported = await isTransactionEnabled(conn as any);

      if (isTransactionSupported) {
        session = await conn.startSession();
        session.startTransaction();
      }

      const interiorImage = await InteriorImage.create(
        [
          {
            predictionId: prediction.id,
            userId,
            prompt,
            beforeImage: image,
            afterImage: "",
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
        },
        session ? { new: true, session } : { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      if (session) {
        await session.commitTransaction();
      }

      // todo: if image gallery doesn't update on prod uncomment this
      // revalidatePath("/studio");

      return new Response(JSON.stringify(prediction), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: "You must be logged in!" }), {
        status: 401,
      });
    }
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
