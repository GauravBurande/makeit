"use server";

import { revalidatePath } from "next/cache";

export async function revalidateStudioPath() {
  revalidatePath("/studio");
  return { revalidated: true, now: Date.now() };
}
