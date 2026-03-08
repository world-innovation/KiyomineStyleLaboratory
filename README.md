# Experimental Garden Chat

少人数向けプライベートチャットアプリ。  
招待コードを共有するだけで、すぐにリアルタイムチャットが始められます。

## 機能

- 招待コード制のプライベートルーム
- リアルタイムメッセージング (WebSocket / Socket.IO)
- タイピングインジケーター、メンバー一覧
- モバイル対応レスポンシブUI (ダークテーマ)
- PWA対応 (iPhone / Android のホーム画面に追加可能)
- TWA対応 (Google Play Store — Chromebookからビルド可能)
- Capacitor対応 (iOS App Store)

## クイックスタート

```bash
npm install
npm run dev       # → http://localhost:3000
```

---

## リリース全体像

```
サーバーをデプロイ (Step 0 — 全方法共通)
    │
    ├─→ URLを共有するだけ        → iPhone / Android どちらも使える (PWA)
    │
    ├─→ Google Play に公開       → Chromebook から可能 (TWA)
    │
    └─→ App Store に公開         → クラウドCI or Mac が必要 (Capacitor)
```

| 方法 | iPhone | Android | Mac必要? | ストア費用 |
|---|---|---|---|---|
| **PWA (URLのみ)** | ✅ Safari | ✅ Chrome | 不要 | 無料 |
| **Google Play (TWA)** | ❌ | ✅ | **不要** | $25 一回 |
| **App Store (Capacitor)** | ✅ | ❌ | CI利用で不要 | $99/年 |

---

## Step 0: サーバーをデプロイする (全方法共通)

どの方法でも、まずサーバーをインターネットに公開します。

| サービス | WebSocket対応 | 料金 | デプロイ方法 |
|---|---|---|---|
| [Railway](https://railway.app) | ✅ | 無料枠あり | Git push |
| [Render](https://render.com) | ✅ | 無料枠あり | Git push |
| [Fly.io](https://fly.io) | ✅ | 無料枠あり | CLI |

### Railway でのデプロイ (推奨・最も簡単)

```
1. https://railway.app に GitHub でログイン
2. 「New Project」→「Deploy from GitHub repo」
3. このリポジトリを選択
4. 自動でデプロイが始まる
5. 完了するとURLが発行される
   例: https://your-app-xxxx.railway.app
```

デプロイ後のURLを以下で使います。

---

## iPhone で使えるようにする

### 方法 1: PWA (おすすめ・最も簡単)

デプロイ後のURLをiPhoneユーザーに共有するだけ。

**iPhoneユーザーの操作:**

```
1. Safari でURLを開く
2. 共有ボタン (□↑) をタップ
3. 「ホーム画面に追加」をタップ
4. 「追加」をタップ
```

これでホーム画面にアプリアイコンが追加され、  
タップするとフルスクリーン (ブラウザUI非表示) で起動します。

**PWAの体験:**
- ✅ フルスクリーン表示
- ✅ ホーム画面にアイコン
- ✅ ネイティブアプリ風の見た目
- ✅ ストア審査不要
- ❌ App Storeからのインストールではない

### 方法 2: App Store に公開 (Mac不要)

2つの方法があります。**Codemagic が最も簡単です。**

| CI サービス | 証明書管理 | 難易度 | 費用 |
|---|---|---|---|
| **Codemagic** | 自動 (Apple IDでログインするだけ) | ★ 簡単 | 無料枠あり |
| **GitHub Actions** | 手動 (Secrets に登録) | ★★★ 上級 | 無料枠あり |

---

#### 方法 2a: Codemagic で App Store 提出 (おすすめ)

**前提条件:**
- Apple Developer Program ($99/年) — [developer.apple.com](https://developer.apple.com/programs/)
- Step 0 でサーバーがデプロイ済み

**手順:**

```
1. https://codemagic.io に GitHub アカウントでサインアップ
2. 「Add application」→ このリポジトリを選択
3. ワークフローを選択: codemagic.yaml を使用
```

```
4. Settings → Environment variables:
   - SERVER_URL = https://your-app.railway.app (デプロイ済みURL)
```

```
5. Settings → Code signing → iOS:
   - 「Automatic」を選択
   - Apple ID とパスワードを入力
   → 証明書とプロビジョニングプロファイルが自動生成される
```

```
6. Settings → Distribution → App Store Connect:
   - 「Connect」→ Apple ID でログイン
   - App Store Connect API キーが自動設定される
```

```
7. 「Start new build」→ ios-release ワークフローを選択
8. ビルド完了 → 自動で TestFlight にアップロードされる
9. App Store Connect → TestFlight → テスターを招待
```

**これだけです。** Codemagic が証明書の作成・管理・更新をすべて自動で行います。

---

#### 方法 2b: GitHub Actions で App Store 提出 (上級者向け)

自分で証明書を作成し、GitHub Secrets に登録する方法です。

**Step 1: Apple Developer で証明書を作成**

App Store Connect API キーの作成:
```
1. https://appstoreconnect.apple.com → ユーザとアクセス → 統合 → キー
2. 「+」→ 名前: "GitHub Actions"、役割: "App Manager"
3. キーをダウンロード (.p8 ファイル)
4. 「Issuer ID」と「キー ID」をメモ
```

iOS Distribution 証明書の作成:
```
※ Mac が必要な唯一の作業 (友人の Mac を借りるか、下記の代替方法を使用)

Mac の場合:
1. キーチェーンアクセス → 証明書アシスタント → 認証局に証明書を要求
2. developer.apple.com → Certificates → 「+」→ Apple Distribution
3. CSR をアップロード → 証明書をダウンロード
4. キーチェーンから .p12 でエクスポート

Mac がない場合:
→ Codemagic (方法 2a) を使うのが最も簡単
→ または https://appstoreconnect.apple.com の自動署名を利用
```

**Step 2: GitHub Secrets に登録**

```
GitHub → Settings → Secrets and variables → Actions → New repository secret

6つの Secret を登録:
```

| Secret 名 | 値 | 取得方法 |
|---|---|---|
| `IOS_CERTIFICATE_P12_BASE64` | .p12 を base64 エンコード | `base64 -i cert.p12` |
| `IOS_CERTIFICATE_PASSWORD` | .p12 のパスワード | 自分で設定したもの |
| `IOS_PROVISION_PROFILE_BASE64` | .mobileprovision を base64 | `base64 -i profile.mobileprovision` |
| `APPSTORE_ISSUER_ID` | App Store Connect Issuer ID | Step 1 でメモしたもの |
| `APPSTORE_API_KEY_ID` | API キー ID | Step 1 でメモしたもの |
| `APPSTORE_API_PRIVATE_KEY` | .p8 ファイルの中身 | テキストエディタで開く |

**Step 3: ワークフロー実行**

```
1. GitHub → Actions → 「Build & Deploy iOS」
2. 「Run workflow」:
   - server_url: デプロイ済みURL
   - submit_to_testflight: ✅ チェック
3. ビルド → 署名 → TestFlight アップロード が全自動で実行
4. App Store Connect → TestFlight → テスターを招待
```

**Secrets を設定しない場合:** 署名なしビルドが生成されます (テスト用)。

---

## Google Play で公開する (Chromebook から可能)

### 前提条件

| 必要なもの | 説明 |
|---|---|
| Google Developer アカウント | $25 一回払い — [play.google.com/console](https://play.google.com/console) |
| Node.js | Chromebook の Linux 環境にインストール |
| デプロイ済みURL | Step 0 で取得 |

### 方法 A: ビルドスクリプトで一発ビルド (おすすめ)

Chromebook のターミナル (Linux) で実行:

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-user/your-repo.git
cd your-repo
npm install

# 2. Android アプリをビルド (URLを自分のものに変更)
./scripts/build-twa.sh https://your-app.railway.app

# → twa-build/app-release-signed.apk  (テスト用)
# → twa-build/app-release-bundle.aab  (Play Store提出用)
```

初回は JDK と Android SDK が自動ダウンロードされます (10分程度)。

### 方法 B: PWABuilder (ブラウザだけで完結)

CLI を使いたくない場合:

```
1. https://www.pwabuilder.com にアクセス
2. デプロイ済みURLを入力
3. 「Package For Stores」→「Android」→「Generate」
4. APK / AAB がダウンロードされる
```

### 方法 C: GitHub Actions (全自動)

```
1. GitHub → Actions → 「Build Android (TWA)」
2. 「Run workflow」→ デプロイ済みURLを入力
3. ビルド完了 → Artifacts から APK/AAB をダウンロード
```

### Play Store に提出する

```
1. https://play.google.com/console にログイン
2. 「アプリを作成」
   - アプリ名: Experimental Garden
   - デフォルトの言語: 日本語
   - アプリ / ゲーム: アプリ
   - 無料 / 有料: 無料
3. 「リリース」→ トラックを選択:
```

| トラック | 審査 | 上限 | おすすめ |
|---|---|---|---|
| **内部テスト** | 不要 | 100人 | ★★★★★ 少人数ならこれ |
| クローズドテスト | あり | 無制限 | ★★★☆☆ |
| オープンテスト | あり | 無制限 | ★★☆☆☆ |
| 製品版 | あり | 無制限 | ★☆☆☆☆ |

```
4. AAB ファイルをアップロード
5. 「ストアの掲載情報」を入力:
   - スクリーンショット (スマホ2枚以上)
   - 簡単な説明 / 詳しい説明
   - アプリアイコン (512x512 — public/icons/icon-512x512.png を使用)
6. 「審査に送信」(内部テストなら即公開)
```

### TWA の追加設定: Digital Asset Links

Play Store に公開後、アプリがフルスクリーンで動作するには  
サーバーに署名証明書のフィンガープリントを登録する必要があります。

```bash
# ビルド時に表示される SHA-256 フィンガープリントを環境変数に設定
TWA_SHA256_FINGERPRINT="XX:XX:XX:..."

# デプロイ先の環境変数に追加 (Railway の場合: Settings → Variables)
```

確認: `https://your-app.railway.app/.well-known/assetlinks.json`

---

## 限定公開の方法まとめ

| 方法 | 対象OS | 審査 | 上限 | 手軽さ |
|---|---|---|---|---|
| **PWA (URL共有)** | 全OS | なし | 無制限 | ★★★★★ |
| **Play 内部テスト** | Android | なし | 100人 | ★★★★☆ |
| **TestFlight** | iOS | 簡易 | 10,000人 | ★★★☆☆ |
| **Play クローズドテスト** | Android | あり | 無制限 | ★★★☆☆ |

**おすすめの組み合わせ:**
- iPhone ユーザー → PWA (URL共有 + ホーム画面に追加)
- Android ユーザー → Play 内部テスト or PWA

---

## 審査チェックリスト (ストア公開時)

- [ ] プライバシーポリシーページ
- [ ] コンテンツモデレーション方針
- [ ] 不適切コンテンツの報告機能
- [ ] スクリーンショット (実際のアプリ画面)
- [ ] アプリアイコン (512x512 PNG)

---

## 開発コマンド

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー (ホットリロード) |
| `npm start` | 本番サーバー |
| `npm run lint` | ESLint |
| `npm test` | テスト |
| `npm run build:web` | Capacitor 用ビルド |
| `./scripts/build-twa.sh <URL>` | Android TWA ビルド |

## 環境変数

| 変数 | デフォルト | 説明 |
|---|---|---|
| `PORT` | `3000` | サーバーポート |
| `CORS_ORIGINS` | `capacitor://localhost,...` | CORS許可オリジン |
| `TWA_SHA256_FINGERPRINT` | (空) | Android TWA 署名フィンガープリント |
| `TWA_PACKAGE_NAME` | `com.experimentalgarden.chat` | Android パッケージ名 |

## ライセンス

MIT
