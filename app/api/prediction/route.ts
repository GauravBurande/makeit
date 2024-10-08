import { colorSchemes } from "@/helpers/constants";
import { createReplicatePrediction } from "@/helpers/createPrediction";
import connectMongo from "@/lib/mongoose";
import { authOptions } from "@/lib/next-auth";
import InteriorImage from "@/models/InteriorImage";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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

function getColors(name: string): string[] | null {
  const scheme = colorSchemes.find(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  return scheme ? scheme.colors : null;
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
    interiorPrompt += `. Utilize ${getColors(
      color
    )} and highlight ${color} as the primary colors, weaving it throughout the design in various shades and tones to create depth and visual interest`;
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
      let prediction = await createReplicatePrediction(
        {
          prompt: interiorPrompt,
          image,
          negative_prompt: negativePrompt,
        },
        REPLICATE_MODEL_VERSION
      );

      const interiorImage = await InteriorImage.create([
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
      ]);

      // Update the user document

      prediction.interiorImageId = interiorImage[0]._id;
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
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return new Response(JSON.stringify(prediction), { status: 201 });
    } else {
      return new Response(JSON.stringify({ error: "You must be logged in!" }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    console.error("Error creating interior image and updating user:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      { status: 500 }
    );
  }
}
