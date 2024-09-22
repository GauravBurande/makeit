import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import { NextRequest } from "next/server";

// todo: delete this api if not needed
export async function GET(req: NextRequest) {
  await connectMongo();

  console.log("received the galleryupate event request");
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await User.findById(userId).select({
      interiorImages: { $slice: -1 },
    });

    if (!user || !user.interiorImages || !user.interiorImages.length) {
      return new Response(
        JSON.stringify({ error: "No images found in your gallery!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the latest image
    return new Response(JSON.stringify(user.interiorImages[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching latest image:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
