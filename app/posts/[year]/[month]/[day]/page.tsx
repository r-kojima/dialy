import Link from "next/link"
import { notFound } from "next/navigation"
import { getAdjacentPosts, getPostByDate } from "@/app/actions/posts"
import { MarkdownRenderer } from "@/app/components/markdown-renderer"

interface PageProps {
  params: Promise<{ year: string; month: string; day: string }>
}

import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { year, month, day } = await params
  const dateStr = `${Number.parseInt(month, 10)}月${Number.parseInt(day, 10)}日`
  const url = `https://diary-murex-psi.vercel.app/posts/${year}/${month}/${day}`

  return {
    title: dateStr,
    openGraph: {
      title: dateStr,
      description: "日記",
      url: url,
      siteName: "日記",
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: dateStr,
      description: "日記",
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { year, month, day } = await params
  const post = await getPostByDate(year, month, day)

  if (!post || !post.published) {
    notFound()
  }

  const { prevPost, nextPost } = await getAdjacentPosts(post.diaryDate)

  const formatPostUrl = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `/posts/${y}/${m}/${d}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

        <nav className="mt-16 pt-8 border-t border-border flex justify-between items-center">
          <div>
            {prevPost ? (
              <Link
                href={formatPostUrl(prevPost.diaryDate)}
                className="text-accent-dark hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                <span>←</span>
                <span className="text-sm">
                  {formatDate(prevPost.diaryDate)}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
          <div>
            {nextPost ? (
              <Link
                href={formatPostUrl(nextPost.diaryDate)}
                className="text-accent-dark hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                <span className="text-sm">
                  {formatDate(nextPost.diaryDate)}
                </span>
                <span>→</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      </article>
    </div>
  )
}
