import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const [salt, storedHash] = hash.split(":")
  const encoder = new TextEncoder()
  const saltBuffer = hexToUint8Array(salt)
  const passwordBuffer = encoder.encode(password)

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  )

  const derivedHash = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return derivedHash === storedHash
}

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
          (await verifyPassword(
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
