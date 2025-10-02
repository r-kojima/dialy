import bcrypt from "bcryptjs"

const password = process.argv[2]

if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>")
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 10)
console.log("\nHashed password:")
console.log(hash)
console.log("\nUpdate your .env file:")
console.log(`ADMIN_PASSWORD="${hash}"`)
