"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  })
}

export async function getAllPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  })
}

export async function getPostBySlug(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  })
}

export async function createPost(data: {
  title: string
  content: string
  slug: string
  published?: boolean
  tags?: string[]
}) {
  const { tags, ...postData } = data

  const post = await prisma.post.create({
    data: {
      ...postData,
      tags: tags
        ? {
            connectOrCreate: tags.map((name) => ({
              where: { name },
              create: { name },
            })),
          }
        : undefined,
    },
    include: { tags: true },
  })

  revalidatePath("/")
  revalidatePath("/posts")

  return post
}

export async function updatePost(
  id: string,
  data: {
    title?: string
    content?: string
    slug?: string
    published?: boolean
    tags?: string[]
  },
) {
  const { tags, ...postData } = data

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...postData,
      tags: tags
        ? {
            set: [],
            connectOrCreate: tags.map((name) => ({
              where: { name },
              create: { name },
            })),
          }
        : undefined,
    },
    include: { tags: true },
  })

  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath(`/posts/${post.slug}`)

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

  revalidatePath("/")
  revalidatePath("/posts")
  revalidatePath(`/posts/${updated.slug}`)

  return updated
}
