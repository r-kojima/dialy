"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getPosts(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { diaryDate: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({
      where: { published: true },
    }),
  ])

  return {
    posts,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  }
}

export async function getAllPosts() {
  return await prisma.post.findMany({
    orderBy: { diaryDate: "desc" },
  })
}

export async function getPostByDate(year: string, month: string, day: string) {
  const date = new Date(
    `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
  )
  return await prisma.post.findUnique({
    where: { diaryDate: date },
  })
}

export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id },
  })
}

export async function createPost(data: {
  content: string
  diaryDate: Date
  published?: boolean
}) {
  const post = await prisma.post.create({
    data,
  })

  revalidatePath("/")
  revalidatePath("/posts")

  return post
}

export async function updatePost(
  id: string,
  data: {
    content?: string
    diaryDate?: Date
    published?: boolean
  },
) {
  const post = await prisma.post.update({
    where: { id },
    data,
  })

  const date = post.diaryDate
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath(`/posts/${year}/${month}/${day}`)

  return post
}

export async function deletePost(id: string) {
  await prisma.post.delete({
    where: { id },
  })

  revalidatePath("/")
  revalidatePath("/posts")
}

export async function togglePublished(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    throw new Error("Post not found")
  }

  const updated = await prisma.post.update({
    where: { id },
    data: { published: !post.published },
  })

  const date = updated.diaryDate
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath(`/posts/${year}/${month}/${day}`)

  return updated
}
