import Link from "next/link"
import { getPosts } from "./actions/posts"
import { getUser } from "./actions/user"

export default async function Home() {
  const posts = await getPosts()
  const user = await getUser()

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{user?.name || "個人"}の日記</h1>
      </header>

      <main>
        {posts.length === 0 ? (
          <p className="text-gray-500">まだ日記がありません。</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <Link
                  href={`/posts/${post.diaryDate.getFullYear()}/${String(post.diaryDate.getMonth() + 1).padStart(2, "0")}/${String(post.diaryDate.getDate()).padStart(2, "0")}`}
                >
                  <time
                    dateTime={post.diaryDate.toISOString()}
                    className="text-2xl font-semibold mb-3 block hover:text-blue-600 transition-colors"
                  >
                    {new Date(post.diaryDate).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
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
