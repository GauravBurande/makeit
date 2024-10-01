import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import { createCheckout } from "@/lib/stripe";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  console.log("POST request received");

  const body = await req.json();
  console.log("Request body:", body);

  if (!body.priceId) {
    console.log("Error: Price ID is missing");
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    console.log("Error: Success or cancel URL is missing");
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
    console.log("Error: Mode is missing");
    return NextResponse.json(
      {
        error:
          "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
      },
      { status: 400 }
    );
  }

  try {
    console.log("Attempting to get server session");
    // @ts-ignore
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (session) {
      console.log("User is authenticated, connecting to MongoDB");
      await connectMongo();
      console.log("MongoDB connected");

      console.log("Fetching user from database");
      // @ts-ignore
      const user = await User.findById(session?.user?.id);
      console.log("User found:", user);

      const { priceId, mode, successUrl, cancelUrl } = body;

      console.log("Creating Stripe checkout session");
      const stripeSessionURL = await createCheckout({
        priceId,
        mode,
        successUrl,
        cancelUrl,
        // If user is logged in, it will pass the user ID to the Stripe Session so it can be retrieved in the webhook later
        // so the user is always logged in
        clientReferenceId: user?._id?.toString(),
        // If user is logged in, this will automatically prefill Checkout data like email and/or credit card for faster checkout
        //@ts-ignore
        user,
        // If you send coupons from the frontend, you can pass it here
        // couponId: body.couponId,
      });
      console.log("Stripe session URL created:", stripeSessionURL);

      return NextResponse.json({ url: stripeSessionURL });
    } else {
      console.log("Error: User not authenticated");
      return NextResponse.json(
        { error: "You must be logged in to create a checkout session" },
        { status: 401 }
      );
    }
  } catch (e) {
    console.error("Error in POST request:", e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
