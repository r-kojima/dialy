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
    <div className="min-h-screen py-12 px-6 max-w-[680px] mx-auto">
      <Link
        href="/"
        className="text-accent-dark hover:text-accent mb-12 inline-block transition-colors"
      >
        ← 戻る
      </Link>

      <article>
        <header className="mb-12">
          <time
            dateTime={post.diaryDate.toISOString()}
            className="text-3xl font-bold text-foreground"
          >
            {new Date(post.diaryDate).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <div className="mt-12">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  )
}
