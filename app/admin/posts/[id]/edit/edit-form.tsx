"use client"

import type { Post } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { updatePost } from "@/app/actions/posts"
import { MarkdownRenderer } from "@/app/components/markdown-renderer"

export function EditPostForm({ post }: { post: Post }) {
  const router = useRouter()
  const [content, setContent] = useState(post.content)
  const [published, setPublished] = useState(post.published)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updatePost(post.id, {
        content,
        published,
      })

      router.push("/admin")
    } catch (error) {
      console.error("Failed to update post:", error)
      alert("日記の更新に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  const date = post.diaryDate
  const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">日記を編集</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{formattedDate}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="content" className="block text-sm font-medium">
              本文 (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showPreview ? "編集に戻る" : "プレビュー"}
            </button>
          </div>

          {showPreview ? (
            <div className="w-full min-h-[400px] px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              <MarkdownRenderer content={content} />
            </div>
          ) : (
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="# 見出し

ここに本文を書く..."
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="published" className="text-sm">
            公開する
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "更新中..." : "更新"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}
