import type { Metadata } from "next"
import Link from "next/link"
import { getPosts } from "./actions/posts"
import { getUser } from "./actions/user"

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUser()
  return {
    title: `${user?.name || "個人"}の日記`,
  }
}

type HomeProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const { posts, totalPages, currentPage } = await getPosts(page)
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
          <>
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

            {totalPages > 1 && (
              <nav className="mt-12 flex justify-center items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-lg bg-background-card border border-border hover:bg-accent-light transition-colors"
                  >
                    前へ
                  </Link>
                )}

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/?page=${pageNum}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pageNum === currentPage
                            ? "bg-accent text-white font-semibold"
                            : "bg-background-card border border-border hover:bg-accent-light"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ),
                  )}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-lg bg-background-card border border-border hover:bg-accent-light transition-colors"
                  >
                    次へ
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  )
}
