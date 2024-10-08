import { env } from "@/env";

export async function createReplicatePrediction(input: any, version: string) {
  console.log("predicction: createReplicatePrediction", input);
  const REPLICATE_API_URL = "https://api.replicate.com/v1/predictions";
  const token = env.REPLICATE_API_KEY;
  if (!token) {
    throw new Error("REPLICATE_API_KEY is not set");
  }

  const webhookEndPoint = `${
    process.env.NODE_ENV === "production"
      ? "https://makeit-interior-deisgner.vercel.app"
      : // todo: use this when added custom domain
        // ? "https://makeit.ai"
        "https://open-deeply-coyote.ngrok-free.app"
  }/api/webhook/prediction`;

  const response = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      webhook: webhookEndPoint,
      webhook_events_filter: ["completed"],
      input,
    }),
  });

  console.log("upscale request response:", response);

  if (!response.ok) {
    throw new Error(`Failed to create prediction: ${response.statusText}`);
  }
  return response.json();
}
