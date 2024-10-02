"use server";

import { getBeforeImages, getUser } from "@/lib/db";
import connectMongo from "@/lib/mongoose";
import InteriorImage from "@/models/InteriorImage";

// import { revalidatePath } from "next/cache";

export async function getUserForPolling() {
  console.log("revalidating studio path");
  try {
    // revalidatePath("/studio");
    const user = await getUser();
    if (!user) {
      // revalidatePath("/signin");
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
    const imageInfo = await InteriorImage.findOne({ imageId });
    if (!imageInfo) {
      return null;
    }
    return imageInfo;
  } catch (error) {
    console.error(error);
  }
}
