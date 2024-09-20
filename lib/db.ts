import { getServerSession } from "next-auth";
import connectMongo from "./mongoose";
import User from "@/models/User";
import { authOptions } from "./next-auth";
import { cache } from "react";
import Subscription from "@/models/Subscriptions";

export const getUser = cache(async () => {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session) {
      return null;
    } else {
      // @ts-ignore
      const { id } = session.user;
      await connectMongo();

      const user = await User.findById(id);

      if (!user) {
        console.error("userId: ", id);
        return null;
      }
      return user.toJSON();
    }
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const getBilling = cache(async () => {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const { id } = session.user;
    await connectMongo();

    const billing = await Subscription.findOne({ userId: id });
    if (!billing) {
      console.error("userId: ", id);
      return null;
    }
    return billing.toJSON();
  } catch (error) {
    console.error(error);
    return null;
  }
});
