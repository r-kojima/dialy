import { webcrypto } from "node:crypto"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>")
  process.exit(1)
}

async function hashPassword(password: string): Promise<string> {
  const saltArray = webcrypto.getRandomValues(new Uint8Array(16))
  const salt = Array.from(saltArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)

  const keyMaterial = await webcrypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  )

  const derivedBits = await webcrypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltArray,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  )

  const derivedHash = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return `${salt}:${derivedHash}`
}

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: "Admin",
      },
    })

    console.log("\n✓ Admin user created successfully:")
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  ID: ${user.id}`)
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      console.error("\n✗ Error: User with this email already exists")
    } else {
      console.error("\n✗ Error creating admin user:", error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
