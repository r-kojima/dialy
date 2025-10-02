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
                  <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <time dateTime={post.diaryDate.toISOString()}>
                    {new Date(post.diaryDate).toLocaleDateString("ja-JP")}
                  </time>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-3">
                  {post.content.substring(0, 150)}...
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
