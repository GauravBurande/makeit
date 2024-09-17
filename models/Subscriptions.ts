import mongoose, { Schema, Document, Model } from "mongoose";
import toJSON from "./plugins/toJSON";

export interface ISubscription extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  stripeSubscriptionId: string;
  customerId: string;
  plan: string;
  priceId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => value.startsWith("sub_"),
        message: (props) =>
          `${props.value} is not a valid Stripe subscription ID!`,
      },
    },
    customerId: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => value.startsWith("cus_"),
        message: (props) => `${props.value} is not a valid Stripe customer ID!`,
      },
    },
    plan: {
      type: String,
      enum: ["Personal", "Pro", "Premium"],
      required: true,
    },
    priceId: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => value.startsWith("price_"),
        message: (props) => `${props.value} is not a valid Stripe price ID!`,
      },
    },
    status: {
      type: String,
      enum: ["active", "canceled", "incomplete", "past_due", "unpaid"],
      required: true,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts Mongoose to JSON
subscriptionSchema.plugin(toJSON);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default Subscription;
