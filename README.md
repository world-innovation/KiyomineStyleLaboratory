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

### 方法 2: App Store (クラウドCIで Mac不要)

GitHub Actions の macOS ランナーでビルドできます。

```
1. GitHub → Actions → 「Build iOS (Capacitor)」
2. 「Run workflow」→ デプロイ先URLを入力
3. ビルド成果物をダウンロード
```

署名付きビルドには [Codemagic](https://codemagic.io) がおすすめ:
- Apple Developer アカウントを連携するだけで証明書を自動管理
- App Store Connect に自動アップロード
- 完全に Mac 不要

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
