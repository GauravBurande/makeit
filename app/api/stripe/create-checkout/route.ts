import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import { createCheckout } from "@/lib/stripe";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
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

    await connectMongo();

    // @ts-ignore
    const user = await User.findById(session?.user?.id);

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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
