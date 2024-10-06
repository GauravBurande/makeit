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
