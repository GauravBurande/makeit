import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import configs from "@/config";
import connectMongo from "./mongo";
import { env } from "@/env";
import { SessionStrategy } from "next-auth";

export const authOptions = {
  pages: {
    signIn: configs.auth.signinUrl,
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: configs.mailgun.fromNoReply,
    }),
  ],
  adapter: MongoDBAdapter(connectMongo),
  callbacks: {
    session: async ({ session, token }: { session: any; token: any }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  theme: {
    colorScheme: "light",
    brandColor: configs.colors.main,
    logo: `https://${configs.domain}/icon.png`,
  },
};
