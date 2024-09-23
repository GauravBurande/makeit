import mongoose, { Schema, Document, Model } from "mongoose";
import toJSON from "./plugins/toJSON";
import { colors, materials, roomTypes, styles } from "@/helpers/constants";

export interface IInteriorImage extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  predictionId?: string;
  status?: string;
  beforeImage: string; // URL to the before image stored in Cloudflare R2
  afterImage?: string; // URL to the after image stored in Cloudflare R2
  prompt: string; // AI-generated prompt used to create the image
  negativePrompt: string; // Negative prompt for AI generation
  beforeImageSize?: number; // Image size of the before image in KBs
  afterImageSize?: number; // Image size of the after image in KBs
  style?: string; // Interior design style (e.g., Modern, Rustic, Minimalist)
  roomType?: string; // Room type (e.g., Bedroom, Kitchen, Hall, Bathroom, Dining Room)
  color?: string; // Main color used in the design
  material?: string; // Primary material used in the design (e.g., wood, marble, metal)
}

const interiorImageSchema = new Schema<IInteriorImage>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    predictionId: {
      type: String,
    },
    status: {
      type: String,
    },
    beforeImage: {
      type: String,
      required: true,
    },
    afterImage: {
      type: String,
      required: false,
    },
    prompt: {
      type: String,
      required: true,
    },
    negativePrompt: {
      type: String,
    },
    beforeImageSize: {
      type: Number,
      required: false,
    },
    afterImageSize: {
      type: Number,
      required: false,
    },
    style: {
      type: String,
    },
    roomType: {
      type: String,
    },
    color: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Add plugin that converts Mongoose to JSON
interiorImageSchema.plugin(toJSON);

const InteriorImage: Model<IInteriorImage> =
  (mongoose.models.InteriorImage as Model<IInteriorImage>) ||
  mongoose.model<IInteriorImage>("InteriorImage", interiorImageSchema);

export default InteriorImage;
