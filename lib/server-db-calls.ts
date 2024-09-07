import { getServerSession } from "next-auth";
import connectMongo from "./mongoose";
import User from "@/models/User";
import { authOptions } from "./next-auth";

const getUser = async () => {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session) {
      return;
    } else {
      // @ts-ignore
      const { id } = session.user;
      await connectMongo();

      const user = await User.findById(id);

      return user;
    }
  } catch (error) {
    console.log(error);
  }
};

export { getUser };
