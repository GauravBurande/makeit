import mongoose, { Schema, Document, Model } from "mongoose";
import toJSON from "./plugins/toJSON";

// Define the User interface extending the Mongoose Document
interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  customerId: string;
  priceId: string;
  hasAccess: boolean;
  plan: string; // New field for plan (e.g., Personal, Pro, Team)
  imageLimit: number;
  storageLimit: string;
  subscription: mongoose.Schema.Types.ObjectId;
  interiorImages: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true, // This custom option should be manually filtered by the toJSON plugin
    },
    image: {
      type: String,
    },
    customerId: {
      type: String,
      validate: {
        validator: (value: string) => value.includes("cus_"),
        message: (props) => `${props.value} is not a valid customer ID!`,
      },
    },
    priceId: {
      type: String,
      validate: {
        validator: (value: string) => value.includes("price_"),
        message: (props) => `${props.value} is not a valid price ID!`,
      },
    },
    hasAccess: {
      type: Boolean,
    },
    plan: {
      type: String,
      enum: ["Personal", "Pro", "Team"], // Enum to ensure valid plan types
      required: true,
    },
    imageLimit: {
      type: Number,
    },
    storageLimit: {
      type: String,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },
    interiorImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InteriorImage",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts Mongoose to JSON
userSchema.plugin(toJSON);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
