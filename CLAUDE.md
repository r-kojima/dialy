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
- **スキーマ**: `prisma/schema.prisma`でPostとTagモデルを定義、多対多のリレーション
- **クライアント**: `lib/prisma.ts`でPrisma Clientのシングルトン実装（ホットリロード時の接続問題を回避）

### アプリケーション層
- **Server Actions**: `app/actions/posts.ts`に全てのデータベース操作（記事のCRUD）を集約
  - 全ての変更操作で`revalidatePath()`を呼び出し、Next.jsのキャッシュを無効化
  - タグは`connectOrCreate`パターンで自動作成
- **データフロー**: ページ → Server Actions → Prisma → データベース

### プレゼンテーション層
- **ページ**:
  - `/` (app/page.tsx): 公開済み記事の一覧表示
  - `/posts/[slug]` (app/posts/[slug]/page.tsx): 個別記事の表示（マークダウンレンダリング）
  - `/posts/new` (app/posts/new/page.tsx): 記事作成フォーム（Clientコンポーネント）
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

### タグ管理
タグは`connectOrCreate`で存在しないタグを自動作成:
```typescript
tags: {
  connectOrCreate: tags.map(name => ({
    where: { name },
    create: { name }
  }))
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
  title: String
  slug: String (一意、URLに使用)
  content: String (マークダウン形式)
  published: Boolean (デフォルト: false)
  tags: Tag[]
  createdAt/updatedAt: DateTime
}

Tag {
  id: String (cuid)
  name: String (一意)
  posts: Post[]
}
```

## 開発時の注意事項

- ビルドと開発サーバーにTurbopackを使用
- PostgreSQLデータベース接続情報は`.env`ファイルのDATABASE_URLで設定
- 環境変数は`.env`ファイル (DATABASE_URL)
- リント・フォーマットにBiomeを使用（ESLint/Prettierではない）
- コード生成をする際は、`biome.json`の内容を考慮すること
