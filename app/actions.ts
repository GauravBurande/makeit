"use server";

import { getBeforeImages, getUser } from "@/lib/db";
import connectMongo from "@/lib/mongoose";
import InteriorImage from "@/models/InteriorImage";

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
