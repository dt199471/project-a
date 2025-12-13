# 不動産個人間売買プラットフォーム

個人間で不動産を売買できるプラットフォームです。

## 機能

- ユーザー認証（OAuth: Google、GitHub）
- 物件の登録・編集・削除
- 物件検索・フィルタリング（キーワード、価格、エリア、並び替え）
- 売主・買主間のメッセージング
- お気に入り機能
- 画像アップロード

## 技術スタック

- **フロントエンド/バックエンド**: Next.js 14 (App Router) + TypeScript
- **データベース**: SQLite (Prisma ORM)
- **認証**: NextAuth.js
- **スタイリング**: Tailwind CSS

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、必要な環境変数を設定してください：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、以下を設定：
- `DATABASE_URL`: SQLiteデータベースのパス（デフォルト: `file:./dev.db`）
- `NEXTAUTH_URL`: アプリケーションのURL（開発環境: `http://localhost:3000`）
- `NEXTAUTH_SECRET`: NextAuthのシークレットキー（ランダムな文字列）
- OAuthプロバイダーのクライアントIDとシークレット

### 3. データベースの初期化

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## OAuth認証の設定

### Google認証

1. [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
2. OAuth 2.0 クライアントIDを作成
3. 承認済みのリダイレクトURIに `http://localhost:3000/api/auth/callback/google` を追加
4. クライアントIDとシークレットを`.env`に設定

## プロジェクト構造

```
project-a/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   ├── (main)/            # メインページ
│   ├── api/               # API Routes
│   └── layout.tsx
├── components/            # Reactコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── property/         # 物件関連コンポーネント
│   └── messaging/        # メッセージングコンポーネント
├── lib/                  # ユーティリティ
│   ├── db.ts            # Prismaクライアント
│   └── auth.ts          # 認証設定
├── prisma/              # Prismaスキーマ
│   └── schema.prisma
└── public/              # 静的ファイル
```

## データベーススキーマ

- **User**: ユーザー情報
- **Property**: 物件情報
- **Message**: メッセージ
- **Favorite**: お気に入り

詳細は`prisma/schema.prisma`を参照してください。

## ビルド

```bash
npm run build
npm start
```
