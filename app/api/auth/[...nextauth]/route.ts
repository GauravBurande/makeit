import NextAuth from "next-auth";
import { authOptions } from "@/lib/next-auth";

// todo: fix this
// @ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
