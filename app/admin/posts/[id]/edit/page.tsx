import { notFound } from "next/navigation"
import { getPostById } from "@/app/actions/posts"
import { EditPostForm } from "./edit-form"

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return <EditPostForm post={post} />
}
