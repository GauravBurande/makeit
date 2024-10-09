"use server";

import { PlainUser } from "@/helpers/types";
import { getBeforeImages, getUser } from "@/lib/db";
import connectMongo from "@/lib/mongoose";
import { authOptions } from "@/lib/next-auth";
import InteriorImage from "@/models/InteriorImage";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function getUserForPolling() {
  console.log("revalidating studio path");
  try {
    const user = await getUser();
    if (!user) {
      return { user: null };
    }
    return { user };
  } catch (error) {
    console.error(error);
  }
}

export async function getPreviousImages() {
  try {
    const images = await getBeforeImages();
    if (!images) {
      return [];
    }
    return images;
  } catch (error) {
    console.error(error);
  }
}

export async function getImageInfo(imageId: string) {
  try {
    await connectMongo();
    const imageInfo = await InteriorImage.findOne({ _id: imageId });
    const plainImageInfo = await JSON.parse(JSON.stringify(imageInfo));
    if (!imageInfo) {
      return null;
    }
    return plainImageInfo;
  } catch (error) {
    console.error(error);
  }
}

export async function GetMoreImages(sliceValue: number) {
  try {
    await connectMongo();
    // @ts-ignore
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const { id } = session?.user;
    const user = await User.findById(id).select({
      interiorImages: {
        $slice: [-sliceValue, 12],
      },
    });

    const plainUser = JSON.parse(JSON.stringify(user)) as PlainUser;

    if (plainUser.interiorImages) {
      plainUser.interiorImages = plainUser.interiorImages.map((img) => ({
        imageId: img.imageId.toString(),
        imageUrl: img.imageUrl,
      }));
    }

    if (
      !plainUser ||
      !plainUser.interiorImages ||
      plainUser.interiorImages.length === 0
    ) {
      return null; // No more images to load
    }

    return plainUser.interiorImages;
  } catch (error) {
    console.error(error);
  }
}
