"use server";

// import { revalidatePath } from "next/cache";
import { getBeforeImages, getUser } from "./db";

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
