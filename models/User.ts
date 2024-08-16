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
}

// USER SCHEMA
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
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts Mongoose to JSON
userSchema.plugin(toJSON);

// Export the model or an existing model if already declared
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
