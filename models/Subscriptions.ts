import mongoose, { Schema, Document, Model } from "mongoose";
import toJSON from "./plugins/toJSON";

// Define the Subscription interface extending the Mongoose Document
interface ISubscription extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  stripeSubscriptionId: string; // Stripe subscription ID
  customerId: string; // Stripe customer ID
  plan: string; // Plan type (e.g., Personal, Pro, Team)
  priceId: string; // Stripe price ID
  status: string; // Subscription status (e.g., active, canceled)
  currentPeriodStart: Date; // Start of the current billing period
  currentPeriodEnd: Date; // End of the current billing period
  cancelAtPeriodEnd: boolean; // Indicates if the subscription will cancel at the end of the period
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
      enum: ["Personal", "Pro", "Team"],
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
