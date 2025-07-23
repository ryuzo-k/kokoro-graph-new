# Vercel デプロイ設定

## 必要な環境変数

Vercelのダッシュボードで以下の環境変数を設定してください：

### 必須（データベース用）
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### オプション（Supabase使用時）
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### GitHub連携用（オプション）
```
GITHUB_TOKEN=ghp_your_token_here
```

### 本番環境設定
```
NODE_ENV=production
```

## データベース設定

現在のPostgreSQLデータベースを本番環境でも使用する場合：

1. **既存のNeon/Supabase PostgreSQL**を使用
2. `DATABASE_URL`を本番データベースのURLに設定
3. データベースマイグレーション：`npm run db:push`

## Vercelデプロイ手順

1. GitHubにコードをプッシュ
2. Vercelで新しいプロジェクトを作成
3. 環境変数を設定（上記参照）
4. デプロイ実行

## ファイル構成
- `vercel.json`: Vercel設定ファイル（作成済み）
- `.env.example`: 環境変数のテンプレート（作成済み）

## 注意事項
- 機密情報（パスワード、APIキー）は環境変数で管理
- データベースURLは本番用に更新が必要
- GitHub連携は後から追加可能

## データベース初期化
アプリ初回起動時に自動で「自分」ユーザーが作成されます。