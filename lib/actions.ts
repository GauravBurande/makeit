"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "./db";

export async function revalidateStudioPath() {
  console.log("revalidating studio path");
  revalidatePath("/studio");
  const user = await getUser();
  if (!user) {
    revalidatePath("/signin");
  }
  return { user };
}
