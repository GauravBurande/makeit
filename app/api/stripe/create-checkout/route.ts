import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import { createCheckout } from "@/lib/stripe";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.priceId) {
    console.error("Error: Price ID is missing");
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    console.error("Error: Success or cancel URL is missing");
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
    console.error("Error: Mode is missing");
    return NextResponse.json(
      {
        error:
          "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
      },
      { status: 400 }
    );
  }

  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (session) {
      await connectMongo();

      // @ts-ignore
      const user = await User.findById(session?.user?.id);
      console.log("User found:", user);

      const { priceId, mode, successUrl, cancelUrl } = body;

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

      return NextResponse.json({ url: stripeSessionURL });
    } else {
      console.error("Error: User not authenticated");
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
