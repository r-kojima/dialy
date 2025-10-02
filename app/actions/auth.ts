"use server"

import { webcrypto } from "node:crypto"
import { prisma } from "@/lib/prisma"

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

export async function createAdminUser(formData: FormData) {
  try {
    // 既存のユーザーが存在するか確認
    const existingUserCount = await prisma.user.count()
    if (existingUserCount > 0) {
      return {
        success: false,
        error: "管理者アカウントは既に存在します",
      }
    }

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password || !name) {
      return {
        success: false,
        error: "すべてのフィールドを入力してください",
      }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return {
        success: false,
        error: "このメールアドレスは既に使用されています",
      }
    }
    return {
      success: false,
      error: "管理者アカウントの作成に失敗しました",
    }
  }
}

export async function checkAdminExists() {
  const count = await prisma.user.count()
  return count > 0
}
