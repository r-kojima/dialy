import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPasswordHash = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPasswordHash) {
          return null
        }

        if (
          credentials?.email === adminEmail &&
          credentials?.password &&
          (await bcrypt.compare(
            credentials.password as string,
            adminPasswordHash,
          ))
        ) {
          return {
            id: "admin",
            email: adminEmail,
            name: "Admin",
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
})
