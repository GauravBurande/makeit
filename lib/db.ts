import { getServerSession } from "next-auth";
import connectMongo from "./mongoose";
import User from "@/models/User";
import { authOptions } from "./next-auth";
import { cache } from "react";
import Subscription from "@/models/Subscriptions";
import { PlainUser } from "@/helpers/types";
import BeforeImage from "@/models/BeforeImages";

export const getUser = cache(async (): Promise<PlainUser | null> => {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
      return null;
    }

    //@ts-ignore
    const { id } = session.user;

    await connectMongo();

    const user = await User.findById(id, {
      interiorImages: { $slice: -12 },
    }).lean();

    if (!user) {
      console.error("userId not found: ", id);
      return null;
    }

    const plainUser = JSON.parse(JSON.stringify(user)) as PlainUser;

    if (plainUser.interiorImages) {
      plainUser.interiorImages = plainUser.interiorImages.map((img) => ({
        imageId: img.imageId.toString(),
        imageUrl: img.imageUrl,
      }));
    }

    return plainUser;
  } catch (error) {
    console.error("Error in getUser:", error);
    return null;
  }
});

export const getBilling = cache(async () => {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const { id } = session.user;
    await connectMongo();

    const billing = await Subscription.findOne({ userId: id });
    if (!billing) {
      console.error("userId: ", id);
      return null;
    }
    return billing.toJSON();
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getBeforeImages = async (): Promise<string[] | null> => {
  try {
    //@ts-ignore
    const session = await getServerSession(authOptions);

    //@ts-ignore
    const { id } = session?.user;
    if (!id) {
      console.error("No user session found");
      return null;
    }

    await connectMongo();

    const images = await BeforeImage.find({ userId: id }, "imageUrl")
      .sort({ createdAt: -1 })
      .limit(12);

    return images.map((img) => img.imageUrl);
  } catch (error) {
    console.error("Error in getBeforeImages:", error);
    return null;
  }
};
