import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prisma"
import fetch from 'node-fetch';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/check-credentials`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })

        if (res.status === 400) 
            return null

        const user = await res.json()

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      },
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (!session) return;

      const userData = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        }
      });

      let selectedResto = null;

      if (userData.selectedRestoId) {
        selectedResto = await prisma.resto.findUnique({
          where: {
            id: userData.selectedRestoId,
          },
          select: {
            id: true, name: true
          }
        });

        const role = await prisma.userResto.findFirst({
          where: {
            userId: userData.id, 
            restoId: userData.selectedRestoId
          }
        })

        selectedResto.role = role.role
      }

      return {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image,
          selectedResto,
        }
      }  
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  session: { 
    strategy: "jwt", 
    maxAge: 60 * 24 * 60 * 60 
  },
}

export default NextAuth(authOptions)