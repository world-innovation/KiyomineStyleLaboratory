#!/bin/bash
set -e

# ============================================================
# Chromebook / Linux 用: Google Play Store 向け Android アプリビルド
# ============================================================
#
# 前提条件:
#   - Node.js 18+ がインストール済み
#   - サーバーがデプロイ済み (URL が必要)
#
# 使い方:
#   chmod +x scripts/build-twa.sh
#   ./scripts/build-twa.sh https://your-app.railway.app
#
# ============================================================

DEPLOY_URL="${1}"

if [ -z "$DEPLOY_URL" ]; then
  echo ""
  echo "使い方: ./scripts/build-twa.sh <デプロイ済みURL>"
  echo ""
  echo "例: ./scripts/build-twa.sh https://my-chat.railway.app"
  echo ""
  exit 1
fi

HOST=$(echo "$DEPLOY_URL" | sed 's|https://||' | sed 's|http://||' | sed 's|/.*||')

echo ""
echo "=== Experimental Garden — Android (TWA) ビルド ==="
echo ""
echo "  デプロイURL: $DEPLOY_URL"
echo "  ホスト名:    $HOST"
echo ""

# --- Bubblewrap のインストール確認 ---
if ! command -v bubblewrap &> /dev/null; then
  echo "[1/4] @bubblewrap/cli をインストール中..."
  npm install -g @bubblewrap/cli
else
  echo "[1/4] @bubblewrap/cli は既にインストール済み"
fi

# --- ビルドディレクトリ ---
BUILD_DIR="./twa-build"
if [ -d "$BUILD_DIR" ]; then
  echo "[2/4] 既存のビルドディレクトリを削除中..."
  rm -rf "$BUILD_DIR"
fi
mkdir -p "$BUILD_DIR"

# --- Bubblewrap の初期化 ---
echo "[3/4] TWA プロジェクトを初期化中..."
echo ""
echo "  bubblewrap init --manifest ${DEPLOY_URL}/manifest.json"
echo ""
echo "  ※ JDK と Android SDK のパスを聞かれた場合は"
echo "    Enter を押してデフォルトを使用してください。"
echo "    初回は自動ダウンロードされます (数分かかります)。"
echo ""

cd "$BUILD_DIR"
bubblewrap init --manifest "${DEPLOY_URL}/manifest.json"

# --- ビルド ---
echo ""
echo "[4/4] APK / AAB をビルド中..."
bubblewrap build

echo ""
echo "=== ビルド完了 ==="
echo ""

if [ -f "app-release-signed.apk" ]; then
  echo "  APK: $(pwd)/app-release-signed.apk"
  echo "       → Android 端末に直接インストール可能"
fi
if [ -f "app-release-bundle.aab" ]; then
  echo "  AAB: $(pwd)/app-release-bundle.aab"
  echo "       → Google Play Console にアップロード"
fi

echo ""
echo "=== 次のステップ ==="
echo ""
echo "  1. https://play.google.com/console にログイン"
echo "  2. 「アプリを作成」→ AAB ファイルをアップロード"
echo "  3. ストア情報を入力して審査に提出"
echo ""
echo "  ※ 限定公開するなら「内部テスト」トラック (審査不要、最大100人)"
echo ""
