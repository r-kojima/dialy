import { webcrypto } from "node:crypto"

const password = process.argv[2]

if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>")
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

hashPassword(password).then((hash) => {
  console.log("\nHashed password:")
  console.log(hash)
  console.log("\nUpdate your .env file:")
  console.log(`ADMIN_PASSWORD=${hash}`)
})
