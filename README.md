# Experimental Garden Chat

少人数向けプライベートチャットアプリ。  
招待コードを共有するだけで、すぐにリアルタイムチャットが始められます。

## 機能

- 招待コード制のプライベートルーム
- リアルタイムメッセージング (WebSocket / Socket.IO)
- タイピングインジケーター
- メンバー一覧
- モバイル対応レスポンシブUI (ダークテーマ)
- PWA対応 (ホーム画面に追加可能)
- Capacitor対応 (iOS / App Storeリリース可能)

## クイックスタート (Web版)

```bash
npm install
npm run dev       # 開発サーバー (自動リロード)
# → http://localhost:3000
```

## App Store リリース手順

### 前提条件

| 必要なもの | 説明 |
|---|---|
| Mac (macOS 14+) | Xcodeが必要 |
| Xcode 16+ | iOS ビルド用 |
| Apple Developer Program | 年額 ¥15,800 ($99) — [developer.apple.com](https://developer.apple.com/programs/) |
| サーバー | チャットサーバーのデプロイ先 (後述) |

### Step 1: サーバーをデプロイする

ネイティブアプリはローカルHTMLを表示するため、チャットサーバーをインターネットに公開する必要があります。

**おすすめのホスティング先:**

| サービス | 特徴 | 料金 |
|---|---|---|
| [Railway](https://railway.app) | Git push でデプロイ、WebSocket対応 | 無料枠あり |
| [Render](https://render.com) | Node.js対応、自動デプロイ | 無料枠あり |
| [Fly.io](https://fly.io) | エッジ配信、WebSocket対応 | 無料枠あり |

デプロイ後、`capacitor.config.ts` の `server.url` にURLを設定:

```ts
server: {
  url: "https://your-chat-server.railway.app",
}
```

### Step 2: アプリアイコンを作成する

App Store には **1024 x 1024 px の PNG** が必要です。

1. `public/icons/icon.svg` をベースにデザインツールで作成
2. [App Icon Generator](https://www.appicon.co/) で全サイズを一括生成
3. 生成されたファイルを `ios/App/App/Assets.xcassets/AppIcon.appiconset/` に配置

### Step 3: iOS プロジェクトを初期化する (Mac上で実行)

```bash
# 依存インストール
npm install

# Web アセットをビルド
npm run build:web

# iOS プロジェクトを追加 (初回のみ)
npm run cap:init

# Web → iOS に同期
npm run cap:sync

# Xcode で開く
npm run cap:open
```

### Step 4: Xcode で設定する

1. **Signing & Capabilities** → 自分の Apple Developer Team を選択
2. **Bundle Identifier** → `com.experimentalgarden.chat` (必要に応じ変更)
3. **Display Name** → `Experimental Garden`
4. **Deployment Target** → iOS 16.0 以上推奨

### Step 5: 限定公開の方法を選ぶ

少人数に限定公開するには、以下の3つの方法があります:

#### 方法 A: TestFlight (おすすめ — 最も簡単)

| 項目 | 詳細 |
|---|---|
| 対象人数 | 最大 10,000人 |
| 審査 | 初回のみ簡易審査 |
| 配布方法 | メールで招待 or 公開リンク |
| 有効期間 | ビルドごとに 90日 |
| 費用 | Apple Developer Program のみ |

```
Xcode → Product → Archive → Distribute App → App Store Connect
→ App Store Connect で TestFlight → 外部テスター招待
```

**少人数チャットにはこれが最適です。** 審査も軽く、招待制で配布できます。

#### 方法 B: App Store 非公開リンク配布

App Store に公開するが、**検索に表示させない**方法:

1. App Store Connect → アプリ → 価格と配信状況
2. 「App Storeで検索可能」を**オフ**
3. 直接リンクを共有した人だけがダウンロード可能

#### 方法 C: Apple Business Manager / カスタムApp

法人向け。社内限定配布に最適:

1. [Apple Business Manager](https://business.apple.com) に組織を登録
2. App Store Connect → カスタムApp として配布
3. 指定した組織のみ利用可能

### Step 6: App Store Connect にアップロード

```
1. Xcode → Product → Archive
2. Archive 完了 → Distribute App → App Store Connect
3. App Store Connect (https://appstoreconnect.apple.com) にログイン
4. アプリ情報を入力:
   - アプリ名: Experimental Garden
   - カテゴリ: ソーシャルネットワーキング
   - スクリーンショット (6.7インチ, 6.1インチ 各3枚以上)
   - プライバシーポリシーURL
   - 説明文
5. 審査に提出
```

### Step 7: 審査のポイント

App Store 審査でリジェクトされないためのチェックリスト:

- [ ] プライバシーポリシーページを用意 (サーバーに `/privacy` 等で配置)
- [ ] アプリ内にログイン不要、または Apple Sign In を実装
- [ ] 最低限のコンテンツモデレーション方針を記載
- [ ] スパム・不適切コンテンツの報告機能 (チャットアプリの場合ほぼ必須)
- [ ] 最低限のUI品質 (クラッシュしない、主要機能が動く)
- [ ] スクリーンショットが実際のアプリと一致

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
├── server.js              # Express + Socket.IO サーバー
├── capacitor.config.ts    # Capacitor (iOS) 設定
├── public/                # Web フロントエンド
│   ├── index.html         # ロビー画面
│   ├── chat.html          # チャット画面
│   ├── manifest.json      # PWA マニフェスト
│   ├── css/style.css      # スタイル
│   ├── js/lobby.js        # ロビーロジック
│   ├── js/chat.js         # チャットロジック
│   └── icons/             # アプリアイコン
├── test/                  # テスト
└── scripts/               # ユーティリティスクリプト
```

## ライセンス

MIT
