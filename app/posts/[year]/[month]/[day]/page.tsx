import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostByDate } from "@/app/actions/posts"
import { MarkdownRenderer } from "@/app/components/markdown-renderer"

interface PageProps {
  params: Promise<{ year: string; month: string; day: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { year, month, day } = await params
  const post = await getPostByDate(year, month, day)

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
      >
        ← 戻る
      </Link>

      <article>
        <header className="mb-8">
          <time
            dateTime={post.diaryDate.toISOString()}
            className="text-2xl font-bold text-gray-700 dark:text-gray-300"
          >
            {new Date(post.diaryDate).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <div className="mt-8">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  )
}
