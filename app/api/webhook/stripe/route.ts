import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/lib/mongoose";
import User from "@/models/User";
import Subscription from "@/models/Subscriptions";
import configs from "@/config";
import { env } from "process";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});
const webhookSecret = env.STRIPE_WEBHOOK_SECRET!;

const planLimits = {
  Personal: { imageLimit: 250, storageLimit: 1 * 1024 * 1024 }, // 1GB in KB
  Pro: { imageLimit: 1000, storageLimit: 5 * 1024 * 1024 }, // 5GB in KB
  Premium: { imageLimit: 5000, storageLimit: 25 * 1024 * 1024 }, // 25GB in KB
};

function getPlanFromPriceId(
  priceId: string
): keyof typeof planLimits | undefined {
  const plan = configs.pricing.find(
    (p) => p.priceId === priceId || p.yearlyPriceId === priceId
  );
  return plan?.name as keyof typeof planLimits | undefined;
}

export async function POST(req: Request) {
  await connectMongo();

  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error(
      `Webhook signature verification failed. ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      // Add other event types as needed
    }
  } catch (err) {
    console.error(
      `Error processing webhook: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const userId = session.client_reference_id;

  if (!userId) {
    throw new Error("No user ID found in the checkout session");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    throw new Error(`No plan found for price ID: ${priceId}`);
  }

  const { imageLimit, storageLimit } = planLimits[plan];

  // Determine the plan interval
  const planInterval =
    subscription.items.data[0].plan.interval === "year" ? "year" : "month";

  // Calculate the next reset date
  const currentPeriodStart = new Date(subscription.current_period_start * 1000);
  let nextResetDate = undefined;

  if (planInterval === "year") {
    nextResetDate = new Date(currentPeriodStart);
    nextResetDate.setFullYear(nextResetDate.getFullYear() + 1);
  }

  const newSubscription = await Subscription.create({
    userId,
    stripeSubscriptionId: subscriptionId,
    customerId,
    plan,
    priceId,
    status: subscription.status,
    currentPeriodStart,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    planInterval,
    nextResetDate,
  });

  await User.findByIdAndUpdate(
    userId,
    {
      customerId,
      priceId,
      hasAccess: true,
      plan,
      imageLimit,
      storageLimit,
      usedImages: 0,
      subscription: newSubscription._id,
    },
    { new: true }
  );
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const customerId = invoice.customer as string;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    throw new Error(`No plan found for price ID: ${priceId}`);
  }

  const { imageLimit, storageLimit } = planLimits[plan];

  const updatedSubscription = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscriptionId },
    {
      plan,
      priceId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    { new: true }
  );

  if (!updatedSubscription) {
    throw new Error(
      `No subscription found for subscription ID: ${subscriptionId}`
    );
  }

  const user = await User.findOneAndUpdate(
    { customerId },
    {
      priceId,
      hasAccess: true,
      plan,
      imageLimit,
      storageLimit,
      usedImages: 0, // Reset used images for the new billing period
      subscription: updatedSubscription._id,
    },
    { new: true }
  );

  if (!user) {
    throw new Error(`No user found for customer ID: ${customerId}`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer as string;

  // Update the subscription status in the database
  const updatedSubscription = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscriptionId },
    {
      status: subscription.status,
      cancelAtPeriodEnd: false, // The subscription is already canceled
      endedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedSubscription) {
    throw new Error(
      `No subscription found for subscription ID: ${subscriptionId}`
    );
  }

  const user = await User.findOneAndUpdate(
    { customerId },
    {
      hasAccess: false,
      plan: undefined,
      imageLimit: 0,
      storageLimit: 0,
    },
    { new: true }
  );

  if (!user) {
    throw new Error(`No user found for customer ID: ${customerId}`);
  }

  console.log(
    `Subscription ${subscriptionId} has been canceled for user ${user._id}`
  );
}
