import Link from "next/link"
import { getAllPosts } from "../actions/posts"
import { getUser } from "../actions/user"

export default async function AdminPage() {
  const posts = await getAllPosts()
  const user = await getUser()

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">管理画面</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.name}の日記管理
        </p>
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
                <div className="flex items-start justify-between">
                  <Link
                    href={`/posts/${post.diaryDate.getFullYear()}/${String(post.diaryDate.getMonth() + 1).padStart(2, "0")}/${String(post.diaryDate.getDate()).padStart(2, "0")}`}
                    className="flex-1"
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
                  <span
                    className={`ml-4 px-3 py-1 text-sm rounded ${
                      post.published
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
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
