import { IUser } from "@/models/User";

export interface PlainUser extends Omit<IUser, "interiorImages"> {
  uploadedImage?: number;
  interiorImages?: Array<{
    imageId: string;
    imageUrl: string;
  }>;
}
