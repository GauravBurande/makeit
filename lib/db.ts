import { getServerSession } from "next-auth";
import connectMongo from "./mongoose";
import User from "@/models/User";
import { authOptions } from "./next-auth";
import { cache } from "react";
import Subscription from "@/models/Subscriptions";
import { PlainUser } from "@/helpers/types";
import mongoose from "mongoose";

export const getUser = cache(async (): Promise<PlainUser | null> => {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
      return null;
    } else {
      // @ts-ignore
      const { id } = session.user;
      await connectMongo();

      const user = await User.findById(id, {
        interiorImages: { $slice: -12 },
      });
      if (!user) {
        console.error("userId: ", id);
        return null;
      }

      // Convert the Mongoose document to a plain JavaScript object
      const plainUser: PlainUser = user.toObject();

      // Ensure interiorImages are properly formatted
      if (plainUser.interiorImages) {
        plainUser.interiorImages = plainUser.interiorImages.map((img) => ({
          imageId: img.imageId.toString(),
          imageUrl: img.imageUrl,
        }));
      }

      // Convert any remaining ObjectId to string
      const stringifyObjectIds = (obj: Record<string, any>): void => {
        Object.keys(obj).forEach((key) => {
          if (obj[key] && typeof obj[key] === "object") {
            if (obj[key] instanceof mongoose.Types.ObjectId) {
              obj[key] = obj[key].toString();
            } else {
              stringifyObjectIds(obj[key]);
            }
          }
        });
      };

      stringifyObjectIds(plainUser);
      return plainUser;
    }
  } catch (error) {
    console.error(error);
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
