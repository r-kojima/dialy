# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

マークダウン形式の記事をデータベースに保存し、公開する個人日記Webアプリケーション。Next.js 15で構築。

## コマンド

```bash
# 開発
npm run dev              # 開発サーバー起動 (Turbopack使用、http://localhost:3000)
npm run build            # 本番ビルド (Turbopack使用)
npm start                # 本番サーバー起動

# コード品質
npm run lint             # Biomeでリント
npm run format           # Biomeでフォーマット

# データベース
npx prisma migrate dev   # マイグレーション作成・適用
npx prisma studio        # Prisma Studio GUI起動
npx prisma generate      # Prisma Clientの再生成
```

## アーキテクチャ

### データ層
- **データベース**: PostgreSQL / Prisma ORM使用
- **スキーマ**: `prisma/schema.prisma`でPostとUserモデルを定義
- **クライアント**: `lib/prisma.ts`でPrisma Clientのシングルトン実装（ホットリロード時の接続問題を回避）

### アプリケーション層
- **Server Actions**:
  - `app/actions/posts.ts`: 記事のCRUD操作を集約
  - `app/actions/user.ts`: ユーザー情報の取得
  - 全ての変更操作で`revalidatePath()`を呼び出し、Next.jsのキャッシュを無効化
- **データフロー**: ページ → Server Actions → Prisma → データベース

### プレゼンテーション層
- **ページ**:
  - `/` (app/page.tsx): 公開済み記事の一覧表示
  - `/admin` (app/admin/page.tsx): 管理画面（全記事の一覧、公開/下書きステータス表示）
  - `/posts/[year]/[month]/[day]` (app/posts/[year]/[month]/[day]/page.tsx): 個別記事の表示（マークダウンレンダリング）
  - `/admin/posts/new` (app/admin/posts/new/page.tsx): 記事作成フォーム（Clientコンポーネント）
- **コンポーネント**:
  - `MarkdownRenderer` (app/components/markdown-renderer.tsx): react-markdownを使用、GFMとシンタックスハイライト対応

### スタイリング
- Tailwind CSS v4使用、`app/globals.css`で`@plugin`ディレクティブ構文
- マークダウンコンテンツのproseスタイリングに`@tailwindcss/typography`プラグインを使用

## 主要パターン

### Server Actionsパターン
全てのデータベース変更操作はServer Actionsとして実装し、`revalidatePath()`でUI整合性を確保:
```typescript
export async function createPost(data) {
  const post = await prisma.post.create({ data });
  revalidatePath("/");
  revalidatePath("/posts");
  return post;
}
```

### マークダウンワークフロー
1. 記事本文は`Post.content`にプレーンなマークダウンテキストとして保存
2. `MarkdownRenderer`コンポーネントがクライアント側でマークダウンを処理
3. GFM（テーブル、打ち消し線など）とコードハイライトに対応

## データベーススキーマ

```prisma
Post {
  id: String (cuid)
  diaryDate: DateTime (一意、日付型、URLに使用)
  content: String (マークダウン形式)
  published: Boolean (デフォルト: false)
  createdAt/updatedAt: DateTime
}

User {
  id: String (cuid)
  email: String (一意)
  password: String (PBKDF2ハッシュ、salt:hash形式)
  name: String
  createdAt/updatedAt: DateTime
}
```

### URL構造
- 記事のURLは日付ベース: `/posts/[year]/[month]/[day]`
- 例: `/posts/2024/01/15`（2024年1月15日の記事）
- 1日1記事の制約（`diaryDate`が一意）

## デプロイ（Vercel）

### ビルド設定
- **Build Command**: `prisma generate && prisma migrate deploy && next build --turbopack`
  - Prisma Clientの生成とマイグレーション適用を本番ビルド前に実行
- **Environment Variables**: Vercelダッシュボードで`DATABASE_URL`を設定

### 自動デプロイ
- **mainブランチへのpush** → 本番環境へ自動デプロイ
- **他のブランチへのpush** → プレビュー環境へ自動デプロイ
- Vercel DashboardのSettings → GitでGitHubリポジトリと連携

### Edge Function制限
- middlewareはEdge Runtimeで実行されるため、1MB以下に制限
- NextAuthの`auth()`関数は大きいため、セッションクッキーの存在チェックのみを実装
- 詳細な認証チェックはServer ComponentやServer Actionで実施

## 開発時の注意事項

- ビルドと開発サーバーにTurbopackを使用
- PostgreSQLデータベース接続情報は`.env`ファイルのDATABASE_URLで設定
- 環境変数は`.env`ファイル (DATABASE_URL)
- リント・フォーマットにBiomeを使用（ESLint/Prettierではない）
- コード生成をする際は、`biome.json`の内容を考慮すること
- 認証にはNextAuthを用いること