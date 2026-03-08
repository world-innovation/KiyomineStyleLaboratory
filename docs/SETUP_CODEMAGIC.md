# Codemagic セットアップガイド

Chromebook / Windows / Linux から **Mac不要** で iOS アプリを App Store (TestFlight) に提出する手順です。

## 前提条件

| 必要なもの | 説明 | 費用 |
|---|---|---|
| Apple Developer Program | [developer.apple.com/programs](https://developer.apple.com/programs/) | $99/年 |
| Codemagic アカウント | [codemagic.io](https://codemagic.io) | 無料枠: 500分/月 |
| デプロイ済みサーバー | Railway, Render 等 | 無料枠あり |
| GitHub アカウント | リポジトリ管理 | 無料 |

> **所要時間:** 初回セットアップ 約20〜30分、以降のビルドは約10分

---

## Step 1: Apple Developer Program に登録

まだ登録していない場合:

```
1. https://developer.apple.com/programs/ にアクセス
2. 「Enroll」→ Apple ID でサインイン
3. 個人 or 法人を選択
4. $99/年 を支払い
5. 承認メールを待つ (通常48時間以内)
```

> 既に登録済みの場合は Step 2 へ進んでください。

---

## Step 2: App Store Connect でアプリを作成

```
1. https://appstoreconnect.apple.com にログイン
2. 「マイ App」→「+」→「新規 App」
3. 以下を入力:
   - プラットフォーム: iOS
   - 名前: Experimental Garden
   - プライマリ言語: 日本語
   - バンドル ID: 「Register a new Bundle ID」を選択
     → Identifiers で com.experimentalgarden.chat を登録
   - SKU: experimental-garden-chat
4. 「作成」
```

---

## Step 3: Codemagic にサインアップ

```
1. https://codemagic.io にアクセス
2. 「Start building」→「Sign up with GitHub」
3. GitHub の認証を許可
```

---

## Step 4: リポジトリを接続

```
1. Codemagic ダッシュボード → 「Add application」
2. 「GitHub」→ このリポジトリを選択
3. Project type: 「Other」を選択 (codemagic.yaml を使用)
4. 「Finish: Add application」
```

---

## Step 5: Apple Developer 連携 (コード署名)

これが最も重要なステップです。Codemagic が自動で証明書を管理してくれます。

### 5a: App Store Connect API キーを作成

```
1. https://appstoreconnect.apple.com
   → 「ユーザとアクセス」→「統合」→「App Store Connect API」→「キー」
2. 「+」(キーを生成)
   - 名前: Codemagic
   - アクセス: App Manager
3. 「生成」→ .p8 ファイルをダウンロード
4. 「Issuer ID」をメモ
5. 「キー ID」をメモ
```

### 5b: Codemagic に API キーを登録

```
1. Codemagic → Team settings → Integrations
   → 「App Store Connect」
2. 「Add key」:
   - Issuer ID: (5a でメモしたもの)
   - Key ID: (5a でメモしたもの)
   - API Key: (.p8 ファイルの中身を貼り付け)
3. 「Save」
```

### 5c: コード署名を設定

```
1. Codemagic → アプリ → 右の歯車 → 「Code signing identities」
   → 「iOS code signing」
2. 「Automatic」タブを選択
3. 先ほど追加した App Store Connect キーを選択
4. Bundle identifier: com.experimentalgarden.chat
5. 「Save」
```

> Codemagic が自動的に:
> - iOS Distribution 証明書を作成
> - App Store 用プロビジョニングプロファイルを作成
> - ビルド時に署名を適用

---

## Step 6: 環境変数を設定

```
1. Codemagic → アプリ → 右の歯車 → 「Environment variables」
2. 「Add variable」:
```

| 変数名 | 値 | グループ | Secure |
|---|---|---|---|
| `SERVER_URL` | `https://your-app.railway.app` | `app_store_connect` | No |

> `SERVER_URL` は Step 0 (README.md 参照) でデプロイしたサーバーのURLです。

---

## Step 7: ビルドを実行

```
1. Codemagic → アプリ → 「Start new build」
2. ワークフロー: 「iOS Release → TestFlight」を選択
3. ブランチ: main (または release/*)
4. 「Start new build」
```

### ビルドの進行

| ステップ | 所要時間 | 内容 |
|---|---|---|
| Install dependencies | ~30秒 | npm ci |
| Build web assets | ~5秒 | public/ → www/ |
| Add & sync iOS | ~10秒 | Capacitor iOS プロジェクト生成 |
| Code signing | ~15秒 | 証明書 + プロファイル適用 |
| Build IPA | ~3分 | Xcode ビルド |
| Upload to TestFlight | ~2分 | App Store Connect へ送信 |
| **合計** | **~5-8分** | |

---

## Step 8: TestFlight でテスターを招待

ビルド成功後:

```
1. https://appstoreconnect.apple.com → アプリ → TestFlight
2. 「内部テスト」または「外部テスト」を選択
3. 「テスターを追加」→ メールアドレスを入力
4. テスターに招待メールが届く
5. テスターは TestFlight アプリからインストール
```

| テストの種類 | 審査 | 上限 | おすすめ |
|---|---|---|---|
| 内部テスト | 不要 | 100人 (Apple Developer メンバーのみ) | 開発チーム向け |
| 外部テスト | 初回のみ簡易審査 | 10,000人 | ★おすすめ |

---

## 以降のアップデート

コードを更新して `main` または `release/*` ブランチに push すると、  
自動でビルド → TestFlight アップロードが実行されます。

```bash
# コードを変更後
git add .
git commit -m "新機能追加"
git push origin main
# → Codemagic が自動でビルド → TestFlight にアップロード
```

---

## トラブルシューティング

### ビルドが失敗する

| エラー | 原因 | 解決策 |
|---|---|---|
| `No signing certificate` | 証明書が未設定 | Step 5 をやり直す |
| `Could not find TypeScript` | typescript が未インストール | `package.json` に含まれているか確認 |
| `No such module 'Capacitor'` | cap sync が失敗 | ログを確認、`www/` にファイルがあるか確認 |
| `SERVER_URL is empty` | 環境変数が未設定 | Step 6 を確認 |

### 証明書の期限切れ

Codemagic の Automatic signing は証明書を自動更新します。  
手動で更新する必要はありません。

### ビルド番号の重複

`codemagic.yaml` に自動インクリメント処理が含まれているため、  
通常は発生しません。手動で変更する場合は `ios/App` 内の `Info.plist` を編集してください。

---

## 費用まとめ

| 項目 | 費用 | 頻度 |
|---|---|---|
| Apple Developer Program | $99 | 年額 |
| Codemagic | $0 | 月500分まで無料 (1ビルド約8分) |
| Railway / Render (サーバー) | $0〜 | 月額 (無料枠あり) |
| **合計** | **$99/年〜** | |
