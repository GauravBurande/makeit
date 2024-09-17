import mongoose, { Schema, Document, Model } from "mongoose";
import toJSON from "./plugins/toJSON";

export interface IInteriorImage extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to the User model
  beforeImage: string; // URL to the before image stored in Cloudflare R2
  afterImage: string; // URL to the after image stored in Cloudflare R2
  prompt: string; // AI-generated prompt used to create the image
  negativePrompt: string; // Negative prompt for AI generation
  beforeImageSize: string; // Image size of the before image in KBs
  afterImageSize: string; // Image size of the after image in KBs
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
    beforeImage: {
      type: String,
      required: true,
    },
    afterImage: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    negativePrompt: {
      type: String,
    },
    beforeImageSize: {
      type: String,
      required: true,
    },
    afterImageSize: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      // todo: app more types in this and move this array constants in a single file to to used from
      enum: [
        "Modern",
        "Rustic",
        "Minimalist",
        "Traditional",
        "Industrial",
        "Scandinavian",
        "Bohemian",
      ],
      required: true,
    },
    roomType: {
      type: String,
      // todo: app more types in this and move this array constants in a single file to to used from
      enum: [
        "Bedroom",
        "Kitchen",
        "Hall",
        "Bathroom",
        "Dining Room",
        "Living Room",
        "Office",
        "Outdoor",
      ],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
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
  mongoose.models.InteriorImage ||
  mongoose.model<IInteriorImage>("InteriorImage", interiorImageSchema);

export default InteriorImage;
