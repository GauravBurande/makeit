import { IUser } from "@/models/User";

export type TUser = Omit<IUser, keyof Document>;
