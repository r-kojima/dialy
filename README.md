# 個人日記アプリケーション

個人日記Webアプリケーションです。
マークダウン形式の記事をデータベースに保存して公開します。Next.js 15、Prisma、PostgreSQLで構築されています。

## アプリケーション概要

- **フロントエンド**: Next.js 15 (App Router)、React、Tailwind CSS v4
- **バックエンド**: Next.js Server Actions、Prisma ORM
- **データベース**: PostgreSQL
- **認証**: NextAuth
- **マークダウン**: react-markdown (GFM、シンタックスハイライト対応)

### 主な機能

- マークダウン形式での記事作成・編集
- 記事の公開/非公開設定
- タグによる記事分類
- 管理者認証機能

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、データベース接続情報を設定:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/diary"
```

### 3. データベースのマイグレーション

```bash
npx prisma migrate dev
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

### 5. 管理者アカウントの作成

初回起動時、[http://localhost:3000/admin/register](http://localhost:3000/admin/register) にアクセスして管理者アカウントを作成します。

- 名前、メールアドレス、パスワード（8文字以上）を入力
- 管理者アカウントは1つのみ作成可能
- アカウント作成後は自動的に記事作成画面にリダイレクトされます

## 主要コマンド

```bash
# 開発
npm run dev              # 開発サーバー起動 (Turbopack使用)
npm run build            # 本番ビルド
npm start                # 本番サーバー起動

# コード品質
npm run lint             # Biomeでリント
npm run format           # Biomeでフォーマット

# データベース
npx prisma migrate dev   # マイグレーション作成・適用
npx prisma studio        # Prisma Studio GUI起動
npx prisma generate      # Prisma Clientの再生成
```

## 認証・管理者機能

### 管理者アカウントの作成

初回起動時のみ、[http://localhost:3000/admin/register](http://localhost:3000/admin/register) から管理者アカウントを作成できます。

- **制限**: 管理者アカウントは1つのみ作成可能
- **要件**:
  - 名前（任意の文字列）
  - メールアドレス（一意）
  - パスワード（8文字以上）
- **セキュリティ**: パスワードはPBKDF2（10万イテレーション、SHA-256）でハッシュ化して保存

管理者アカウントが既に存在する場合、`/admin/register` にアクセスすると自動的にログインページにリダイレクトされます。

### ログイン

[http://localhost:3000/admin/login](http://localhost:3000/admin/login) から、作成したメールアドレスとパスワードでログインできます。

ログイン後は以下の機能が利用可能:
- 記事の作成・編集・削除
- 記事の公開/非公開設定
- タグの管理
