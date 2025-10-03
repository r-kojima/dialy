import Link from "next/link"
import { getAllPosts } from "../actions/posts"
import { getUser } from "../actions/user"

export default async function AdminPage() {
  const posts = await getAllPosts()
  const user = await getUser()

  return (
    <div className="min-h-screen py-12 px-6 max-w-[680px] mx-auto">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-2 text-foreground">管理画面</h1>
        <p className="text-foreground-secondary">
          {user?.name}の日記管理
        </p>
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
                <div className="flex items-start justify-between gap-4">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="flex-1"
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
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-md whitespace-nowrap ${
                      post.published
                        ? "bg-accent/20 text-accent-dark"
                        : "bg-border text-foreground-secondary"
                    }`}
                  >
                    {post.published ? "公開" : "下書き"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
