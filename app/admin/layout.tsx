import Link from "next/link"
import { getUser } from "@/app/actions/user"
import { auth, signOut } from "@/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = await getUser()

  return (
    <div>
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-lg font-semibold hover:text-blue-600"
            >
              {user?.name || "個人"}の日記
            </Link>
            <nav className="flex gap-4">
              <Link
                href="/admin/posts/new"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                新規作成
              </Link>
            </nav>
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  ログアウト
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
