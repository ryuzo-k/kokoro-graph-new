# Vercel デプロイガイド

## 1. 基本デプロイ（環境変数なしでもOK）

### GitHubからデプロイ
1. Vercelアカウント作成・ログイン
2. "New Project" → GitHub接続
3. リポジトリを選択
4. **そのままデプロイ** → アプリは起動するが、データベース接続エラーが出る

これでも **フロントエンドは正常動作** します。

## 2. 環境変数を後から追加

### データベース接続のために必要
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Vercelダッシュボードで設定
1. Project Settings → Environment Variables
2. `DATABASE_URL` を追加
3. **Redeploy** → 完全に動作

## 3. 推奨される段階的デプロイ

### ステップ1: まず基本デプロイ
```bash
git add .
git commit -m "Initial Kokoro Graph deployment"
git push origin main
```
↓
Vercel: GitHub接続 → 自動デプロイ

### ステップ2: 環境変数追加
- Vercelダッシュボードで `DATABASE_URL` 設定
- 自動再デプロイ

### ステップ3: カスタムドメイン（オプション）
- `your-app.vercel.app` → カスタムドメイン

## 4. 現在のReplitデータベースをVercelで使用

### DATABASE_URL取得方法
現在のReplitのDATABASE_URLをそのままVercelで使用可能：

```bash
# Replitで実行（値は表示されません）
echo $DATABASE_URL
```

この値をVercelの環境変数に設定すれば、**同じデータベースを共有**できます。

## 5. トラブルシューティング

### よくある問題と解決法
- **ビルドエラー** → `vercel.json`の設定確認
- **データベース接続エラー** → `DATABASE_URL`の設定確認
- **APIエラー** → Vercel Functionsの制限確認

### 動作確認手順
1. フロントエンドの表示確認
2. グラフの表示確認
3. クイックエントリー機能のテスト
4. データベース接続の確認

## 6. セキュリティ注意事項

- 環境変数は **絶対にGitにコミットしない**
- DATABASE_URLは機密情報として扱う
- 本番環境とReplitで同じDBを使う場合は注意

## まとめ

**最も簡単な方法：**
1. GitHubプッシュ
2. Vercel接続
3. 環境変数は後から追加

環境変数なしでも **フロントエンドは動作** するので、まず基本デプロイから始めることができます。