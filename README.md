# Experimental Garden Chat

少人数向けプライベートチャットアプリ。  
招待コードを共有するだけで、すぐにリアルタイムチャットが始められます。

## 機能

- 招待コード制のプライベートルーム
- リアルタイムメッセージング (WebSocket / Socket.IO)
- タイピングインジケーター、メンバー一覧
- モバイル対応レスポンシブUI (ダークテーマ)
- PWA対応 (ホーム画面に追加可能)
- Capacitor対応 (iOS App Store)
- TWA対応 (Google Play Store)

## クイックスタート

```bash
npm install
npm run dev       # → http://localhost:3000
```

---

## リリース方法の比較

| 方法 | Mac必要? | 費用 | 審査 | おすすめ度 |
|---|---|---|---|---|
| **A. PWA配布** | 不要 | サーバー代のみ | なし | ★★★★★ |
| **B. PWABuilder** | 不要 | $25 (Play) / $99/年 (iOS) | あり | ★★★★☆ |
| **C. GitHub Actions** | 不要 | 無料 (CI) + ストア費用 | あり | ★★★☆☆ |
| **D. Mac + Xcode** | 必要 | $99/年 | あり | ★★☆☆☆ |

**Chromebookユーザーは方法 A または B がおすすめです。**

---

## 方法 A: PWAとして配布 (最も簡単・Mac不要)

アプリストアを経由せずに、**URLを共有するだけ**で配布できます。  
ユーザーはブラウザの「ホーム画面に追加」でネイティブアプリのように使えます。

### Step 1: サーバーをデプロイする

| サービス | 特徴 | 料金 |
|---|---|---|
| [Railway](https://railway.app) | Git pushでデプロイ、WebSocket対応 | 無料枠あり |
| [Render](https://render.com) | Node.js対応、自動デプロイ | 無料枠あり |
| [Fly.io](https://fly.io) | エッジ配信、WebSocket対応 | 無料枠あり |

**Railway でのデプロイ例:**

```
1. https://railway.app にGitHubでログイン
2. 「New Project」 → 「Deploy from GitHub repo」
3. このリポジトリを選択
4. 環境変数: PORT = 3000
5. デプロイ完了 → URLが発行される (例: https://your-app.railway.app)
```

### Step 2: URLを仲間に共有

```
https://your-app.railway.app
```

共有されたURLを開くだけでチャットが使えます。  
Android/iOSのChromeで「ホーム画面に追加」すると、アプリアイコンで起動できます。

### PWAのユーザー体験

- フルスクリーン表示 (ブラウザのUI非表示)
- ホーム画面にアイコンが追加される
- オフラインでもUIが表示される (サーバー接続は必要)
- プッシュ通知も追加可能 (要実装)

---

## 方法 B: PWABuilder でストア公開 (Mac不要)

[PWABuilder](https://www.pwabuilder.com) はMicrosoftが提供する無料ツールで、  
デプロイ済みのPWAをAndroid/iOS/Windowsアプリに変換できます。  
**ブラウザだけで完結** — Chromebookから操作可能です。

### 前提条件

- 方法 A の Step 1 でサーバーがデプロイ済みであること
- Google Play: Google Developer アカウント ($25 一回払い)
- App Store: Apple Developer Program ($99/年)

### Step 1: PWABuilder でパッケージ生成

```
1. https://www.pwabuilder.com にアクセス
2. デプロイ済みURLを入力 (例: https://your-app.railway.app)
3. 「Start」→ PWAスコアが表示される
4. 「Package For Stores」をクリック
```

### Step 2a: Google Play Store 向け (Android)

```
1. PWABuilder → 「Android」を選択
2. 「Generate」→ APK/AAB ファイルがダウンロードされる
3. Google Play Console (https://play.google.com/console) にログイン
4. 「アプリを作成」→ AABファイルをアップロード
5. ストア情報を入力 → 審査に提出
```

**限定公開のコツ:**
- 内部テスト → 最大100人、審査不要、メール招待
- クローズドテスト → 審査あり、人数制限なし、URL共有可能
- リリース → 「非公開」に設定すれば検索に出ない

### Step 2b: App Store 向け (iOS)

```
1. PWABuilder → 「iOS」を選択
2. 「Generate」→ Xcodeプロジェクトがダウンロードされる
3. ⚠️ 署名にはMacまたはクラウドCI (方法C) が必要
   → 方法 C を参照
```

---

## 方法 C: GitHub Actions でクラウドビルド (Mac不要)

GitHub Actions の macOS ランナーを使えば、  
**Macを持っていなくてもiOSアプリをビルド**できます。

### Android ビルド

```
1. GitHub → Actions → 「Build Android (TWA)」
2. 「Run workflow」→ デプロイ先ホスト名を入力
3. ビルド完了 → Artifacts から APK をダウンロード
```

### iOS ビルド (署名なし)

```
1. GitHub → Actions → 「Build iOS (Capacitor)」
2. 「Run workflow」→ デプロイ先URLを入力
3. ビルド完了 → Artifacts からビルド成果物をダウンロード
```

> **注意:** App Store への提出には署名が必要です。  
> GitHub Secrets に証明書を追加するか、[Codemagic](https://codemagic.io)  
> などの専用CIサービスを使うことで、完全にMac不要で提出できます。

### Codemagic (Mac完全不要でApp Store提出)

```
1. https://codemagic.io にGitHubでログイン
2. このリポジトリを接続
3. Capacitor/Ionic アプリとして設定
4. Apple Developer アカウントを連携 (証明書を自動管理)
5. ビルド → App Store Connect に自動アップロード
```

---

## 方法 D: Mac + Xcode (従来の方法)

Mac をお持ちの場合の手順です。

```bash
npm install
npm run build:web
npm run cap:init        # 初回のみ
npm run cap:sync
npm run cap:open        # Xcode が開く
```

Xcode で Signing を設定 → Product → Archive → App Store Connect へアップロード。

詳細は [Apple Developer ドキュメント](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases) を参照。

---

## 限定公開の方法

少人数に限定して公開するための方法:

| 方法 | 対象 | 審査 | 上限人数 |
|---|---|---|---|
| **PWA (URLのみ)** | 全員 | なし | 無制限 |
| **TestFlight** | iOS | 簡易 | 10,000人 |
| **Play 内部テスト** | Android | なし | 100人 |
| **Play クローズドテスト** | Android | あり | 無制限 |
| **App Store 非公開リンク** | iOS | フル審査 | 無制限 |

**おすすめ:** まずPWA (方法A) で始めて、必要になったらストア公開に移行。

---

## 審査チェックリスト (ストア公開時)

- [ ] プライバシーポリシーページ (`/privacy`)
- [ ] コンテンツモデレーション方針の記載
- [ ] 不適切コンテンツの報告機能
- [ ] スクリーンショット (実際のアプリ画面)
- [ ] アプリアイコン (1024x1024 PNG)

---

## 開発コマンド一覧

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動 (ホットリロード) |
| `npm start` | 本番サーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm test` | テスト実行 |
| `npm run build:web` | Web アセットを `www/` にコピー |
| `npm run cap:sync` | Web → iOS 同期 |
| `npm run cap:open` | Xcode で iOS プロジェクトを開く |

## 環境変数

| 変数 | デフォルト | 説明 |
|---|---|---|
| `PORT` | `3000` | サーバーポート |
| `CORS_ORIGINS` | `capacitor://localhost,...` | CORS許可オリジン (カンマ区切り) |

## プロジェクト構成

```
├── server.js                       # Express + Socket.IO サーバー
├── capacitor.config.ts             # Capacitor (iOS) 設定
├── twa-manifest.json               # TWA (Android) 設定
├── public/                         # Web フロントエンド
│   ├── index.html                  # ロビー画面
│   ├── chat.html                   # チャット画面
│   ├── sw.js                       # Service Worker (PWA)
│   ├── manifest.json               # PWA マニフェスト
│   ├── css/style.css               # スタイル
│   ├── js/lobby.js                 # ロビーロジック
│   ├── js/chat.js                  # チャットロジック
│   └── icons/                      # アプリアイコン
├── .github/workflows/
│   ├── build-android.yml           # Android クラウドビルド
│   └── build-ios.yml               # iOS クラウドビルド
├── test/                           # テスト
└── scripts/                        # ユーティリティスクリプト
```

## ライセンス

MIT
