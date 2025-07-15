
//copy pasta this file kar jaldi ??
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth"
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { email, name, image } = user;
      if (!email) return false;
      // TODO: replace this to allow only vit.edu mails 
      // if (!allowedUsers.includes(email)) {
      //   console.log("User not allowed", user);
      //   return false;
      // }

      let userinfo = await prisma.user.findFirst({
        where: {
          email: user.email as string
        }
      })
      console.log("userinfo", userinfo)
      if (!userinfo) {
        userinfo = await prisma.user.create({
          data: {
            email: email,
            image: image,
            name: name || "no name",
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findFirst({
          where: { email: user.email }
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Expose the user ID from token to session
      if (session.user && token.id) {
        // @ts-ignore
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};


