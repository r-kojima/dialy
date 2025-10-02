import Link from "next/link"
import type { Metadata } from "next"
import { getPosts } from "./actions/posts"
import { getUser } from "./actions/user"

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser()
  return {
    title: `${user?.name || "個人"}の日記`,
  }
}

export default async function Home() {
  const posts = await getPosts()
  const user = await getUser()

  return (
    <div className="min-h-screen py-12 px-6 max-w-[680px] mx-auto">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          {user?.name || "個人"}の日記
        </h1>
      </header>

      <main>
        {posts.length === 0 ? (
          <p className="text-foreground-secondary">まだ日記がありません。</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-background-card border border-border rounded-lg p-8 hover:shadow-xl transition-all duration-200"
              >
                <Link
                  href={`/posts/${post.diaryDate.getFullYear()}/${String(post.diaryDate.getMonth() + 1).padStart(2, "0")}/${String(post.diaryDate.getDate()).padStart(2, "0")}`}
                >
                  <time
                    dateTime={post.diaryDate.toISOString()}
                    className="text-2xl font-semibold mb-4 block text-accent-dark hover:text-accent transition-colors"
                  >
                    {new Date(post.diaryDate).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <p className="text-foreground-secondary line-clamp-3 leading-relaxed">
                    {post.content.substring(0, 150)}...
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
