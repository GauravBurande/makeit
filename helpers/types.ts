import { IUser } from "@/models/User";

export interface PlainUser extends Omit<IUser, "interiorImages"> {
  interiorImages?: Array<{
    imageId: string;
    imageUrl: string;
  }>;
}
