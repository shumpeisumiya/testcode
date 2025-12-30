# 建機レンタルECサイト - セットアップガイド

## 概要
ElevenLabs Conversational AIを使用した建設業向けの音声注文システムです。

### 主な機能
- 🎤 音声でAIアシスタントと対話して注文
- 📦 注文履歴の自動保存
- 👨‍💼 管理画面で注文状況を管理
- 🏗️ 建設業に特化したデザイン

## ファイル構成

1. **construction-rental.jsx** - Reactコンポーネント（独自プロジェクトに統合用）
2. **construction-rental-demo.html** - スタンドアロンHTMLデモ（即座に動作確認可能）

## クイックスタート（HTMLデモ版）

1. `construction-rental-demo.html` をブラウザで開く
2. 「音声注文を開始」ボタンをクリック
3. マイクの使用を許可
4. AIアシスタントと対話して建機を注文

**注意:** ブラウザのセキュリティ制限により、ローカルファイルではマイクアクセスが制限される場合があります。その場合は、ローカルサーバーを起動してください：

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx http-server
```

その後、`http://localhost:8000/construction-rental-demo.html` にアクセスしてください。

## エージェント設定（既に完了）

✅ エージェントID: `agent_8901kdnrdyhtfx7ahkhc3qy4xd1f`

### エージェントに実装すべき機能

ElevenLabsのエージェント設定で、以下の情報を収集するように設定してください：

1. **建機の種類** (equipment)
   - 例: ショベルカー、クレーン、ブルドーザー等

2. **レンタル期間** (duration)
   - 例: 1週間、2週間、1ヶ月

3. **配送先住所** (location)
   - 例: 工事現場の住所

4. **その他のオプション** (任意)
   - オペレーター派遣の有無
   - 保険オプション等

### メタデータの送信設定

エージェントが情報を収集したら、以下の形式でメタデータを送信するように設定してください：

```json
{
  "order": {
    "equipment": "ショベルカー（0.25m³）",
    "duration": "2週間",
    "location": "東京都渋谷区〇〇1-2-3 建設現場",
    "operator": "必要",
    "insurance": "基本プラン"
  }
}
```

このメタデータは `onMetadata` コールバックで受信され、自動的に注文として保存されます。

## React統合（既存プロジェクトへの組み込み）

### 1. 依存関係のインストール

```bash
npm install lucide-react
```

### 2. ElevenLabs SDKの追加

HTMLの `<head>` に以下を追加：

```html
<script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
```

または、npm経由でインストール：

```bash
npm install @11labs/client
```

### 3. コンポーネントのインポート

```jsx
import ConstructionRentalApp from './construction-rental';

function App() {
  return <ConstructionRentalApp />;
}
```

### 4. Tailwind CSSの設定（使用している場合）

`tailwind.config.js` に以下のフォントをインポート：

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      }
    }
  }
}
```

そして、CSSファイルに：

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
```

## データ永続化

このアプリケーションは、ブラウザの永続ストレージ（Claude Artifactsの場合は `window.storage` API）を使用して注文データを保存します。

### ストレージAPI

- `window.storage.set(key, value)` - データを保存
- `window.storage.get(key)` - データを取得
- `window.storage.list(prefix)` - キーのリストを取得

### データ構造

注文データは以下の形式で保存されます：

```json
{
  "id": "ORD-1234567890",
  "equipment": "ショベルカー",
  "duration": "2週間",
  "location": "東京都...",
  "status": "pending",
  "timestamp": 1234567890
}
```

## トラブルシューティング

### 音声が聞こえない

1. ブラウザのマイク権限を確認
2. HTTPSまたはlocalhostで実行されているか確認
3. ElevenLabs SDKが正しく読み込まれているか確認（コンソールでエラーを確認）

### エージェントに接続できない

1. エージェントIDが正しいか確認
2. ElevenLabsのダッシュボードでエージェントが有効になっているか確認
3. ネットワーク接続を確認

### 注文が保存されない

1. ブラウザのストレージ権限を確認
2. コンソールでエラーメッセージを確認
3. `window.storage` APIが利用可能か確認

## カスタマイズ

### デザインの変更

- カラースキーム: `amber-500`（オレンジ）を別の色に変更
- フォント: `Bebas Neue` と `Rajdhani` を別のフォントに変更
- レイアウト: Tailwind CSSクラスを編集

### 機能の追加

- 建機カタログの追加
- 価格計算機能
- 支払い処理
- メール通知
- PDF見積書の生成

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。

## サポート

質問や問題がある場合は、ElevenLabsのドキュメントを参照してください：
https://docs.elevenlabs.io/
