import mongoose, { Model, Schema } from "mongoose";
import toJSON from "./plugins/toJSON";

export interface IBeforeImage {
  userId: mongoose.Schema.Types.ObjectId;
  imageUrl: string;
}

const beforeImageSchema = new Schema<IBeforeImage>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

beforeImageSchema.plugin(toJSON);

const BeforeImage: Model<IBeforeImage> =
  mongoose.models.BeforeImage ||
  mongoose.model<IBeforeImage>("BeforeImage", beforeImageSchema);

export default BeforeImage;
