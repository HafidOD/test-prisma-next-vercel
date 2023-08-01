import prisma from "@/libs/prisma";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Correo",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.userName,
          role: user.role,
          randomKey: "escapetefate",
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      // console.log(session, token);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      // console.log(token, user);

      if (user) {
        // const u = user;
        return {
          ...token,
          id: user.id,
          role: user.role,
          randomKey: user.randomKey,
        };
      }
      return token;
    },
  },
};
