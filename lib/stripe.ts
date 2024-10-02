import { env } from "@/env";
import Stripe from "stripe";

interface CreateCheckoutParams {
  priceId: string;
  mode: Stripe.Checkout.SessionCreateParams.Mode;
  successUrl: string;
  cancelUrl: string;
  isYearly: boolean;
  couponId?: string;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

export const createCheckout = async ({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  isYearly,
  couponId,
  clientReferenceId,
  user,
}: CreateCheckoutParams): Promise<string | null> => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });

  const extraParams: Partial<Stripe.Checkout.SessionCreateParams> = {};

  if (user?.customerId) {
    extraParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }

  let subscriptionData:
    | Stripe.Checkout.SessionCreateParams.SubscriptionData
    | undefined;

  if (isYearly && mode === "subscription") {
    // Create a subscription schedule for yearly subscriptions with monthly billing
    const now = Math.floor(Date.now() / 1000);
    const oneYearFromNow = now + 365 * 24 * 60 * 60;

    subscriptionData = {
      trial_end: now,
      billing_cycle_anchor: now,
      proration_behavior: "none",
    };

    extraParams.subscription_data = subscriptionData;

    // After checkout, we'll create a subscription schedule
    extraParams.expand = ["subscription"];
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode,
    allow_promotion_codes: true,
    client_reference_id: clientReferenceId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    discounts: couponId
      ? [
          {
            coupon: couponId,
          },
        ]
      : undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...extraParams,
  });

  if (isYearly && mode === "subscription" && stripeSession.subscription) {
    // Create a subscription schedule for the yearly subscription
    const subscriptionId =
      typeof stripeSession.subscription === "string"
        ? stripeSession.subscription
        : stripeSession.subscription.id;

    const subscriptionSchedule = await stripe.subscriptionSchedules.create({
      from_subscription: subscriptionId,
    });

    // Update the subscription schedule to bill monthly
    await stripe.subscriptionSchedules.update(subscriptionSchedule.id, {
      phases: [
        {
          start_date: "now",
          end_date: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
          items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          billing_cycle_anchor: "phase_start",
          billing_thresholds: null,
          proration_behavior: "none",
          collection_method: "charge_automatically",
          iterations: 12, // Bill 12 times over the year
        },
      ],
    });
  }

  return stripeSession.url;
};

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: CreateCustomerPortalParams): Promise<string | null> => {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const findCheckoutSession = async (
  sessionId: string
): Promise<Stripe.Checkout.Session | null> => {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
