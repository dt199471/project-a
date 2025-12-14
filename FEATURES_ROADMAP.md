# 不動産個人間売買プラットフォーム 機能ロードマップ

## 現在の実装状況

### ✅ 実装済み機能

#### 物件管理
- 物件の登録・編集・削除
- 物件一覧表示
- 検索・フィルタリング（価格、エリア、最寄り駅）
- 画像アップロード（base64形式）
- ソート機能（作成日、価格、住所）

#### メッセージング
- 売主と買主の直接メッセージ
- メッセージ一覧表示
- 物件ごとの会話管理

#### お気に入り
- 物件をお気に入りに追加・削除
- お気に入り一覧表示
- お気に入り状態の確認

#### UI/UX
- レスポンシブデザイン
- ナビゲーションバー
- 物件カード表示
- ローディング状態の表示

---

## 実装予定機能（優先度順）

### 🎯 フェーズ1: 物件情報の充実

#### 1-1. 物件詳細情報の追加
**目的**: より詳細な物件情報を提供し、ユーザーの意思決定をサポート

**実装内容**:
- [ ] 間取り（1K, 1LDK, 2LDK等）
- [ ] 専有面積（㎡）
- [ ] 築年数
- [ ] 建物構造（木造、鉄筋コンクリート等）
- [ ] 階数/総階数
- [ ] 向き（南向き、東向き等）
- [ ] 駐車場の有無
- [ ] ペット可/不可
- [ ] リフォーム・リノベーション履歴
- [ ] 管理費・修繕積立金

**データベース変更**:
```prisma
model Property {
  // 既存フィールド
  id          String   @id @default(cuid())
  title       String
  description String
  price       Int
  address     String
  city        String
  prefecture  String
  nearestStation String?
  images      String

  // 追加フィールド
  layout      String?  // 間取り
  area        Float?   // 専有面積（㎡）
  buildYear   Int?     // 建築年
  structure   String?  // 建物構造
  floor       Int?     // 階数
  totalFloors Int?     // 総階数
  direction   String?  // 向き
  parking     Boolean  @default(false)
  petAllowed  Boolean  @default(false)
  managementFee Int?   // 管理費
  repairReserve Int?   // 修繕積立金
  renovationHistory String? // リフォーム履歴

  // リレーション
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  messages    Message[]
  favorites   Favorite[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 1-2. 画像・メディア機能の強化
**目的**: 物件の魅力をより伝えやすくする

**実装内容**:
- [ ] 画像の並び替え機能
- [ ] メイン画像の指定
- [ ] 間取り図専用のアップロード欄
- [ ] 画像の圧縮・最適化
- [ ] 画像プレビュー機能の改善
- [ ] 画像削除機能（編集時）

#### 1-3. 周辺情報の表示
**目的**: 生活環境の情報を提供

**実装内容**:
- [ ] Google Maps API統合
- [ ] 最寄り駅までの距離・時間
- [ ] 周辺施設情報（コンビニ、スーパー、病院、学校等）
- [ ] 地図上での物件位置表示

---

### 🎯 フェーズ2: UX改善・利便性向上

#### 2-1. 検索・フィルター機能の強化
**目的**: ユーザーが求める物件を見つけやすくする

**実装内容**:
- [ ] 間取りでのフィルタリング
- [ ] 専有面積での範囲指定
- [ ] 築年数での範囲指定
- [ ] 駅からの距離でのフィルタリング
- [ ] 複数条件の組み合わせ検索
- [ ] 検索条件の保存機能
- [ ] 検索履歴

#### 2-2. ソート・表示オプション
**実装内容**:
- [ ] 価格の安い順・高い順
- [ ] 新着順・更新順
- [ ] 面積の広い順・狭い順
- [ ] 駅からの近い順
- [ ] 表示件数の変更（12件/24件/48件）
- [ ] リスト表示/グリッド表示の切り替え

#### 2-3. ページネーション
**目的**: パフォーマンス向上とUX改善

**実装内容**:
- [ ] ページネーション実装（20件ずつ表示）
- [ ] 無限スクロール対応（オプション）
- [ ] ページ番号の表示
- [ ] 前へ/次へボタン

---

### 🎯 フェーズ3: メッセージング機能の強化

#### 3-1. メッセージ機能の改善
**目的**: コミュニケーションの質を向上

**実装内容**:
- [ ] 未読/既読ステータス
- [ ] 未読件数バッジ表示
- [ ] メッセージの日時表示改善
- [ ] メッセージの編集・削除機能
- [ ] 画像添付機能
- [ ] メッセージ検索機能
- [ ] メッセージのピン留め

**データベース変更**:
```prisma
model Message {
  id         String   @id @default(cuid())
  content    String
  isRead     Boolean  @default(false)  // 追加
  readAt     DateTime? // 追加
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  senderId   String
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiverId String
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt // 追加
}
```

#### 3-2. リアルタイム通信
**目的**: よりスムーズなコミュニケーション

**実装内容**:
- [ ] WebSocket/Server-Sent Events導入
- [ ] メッセージのリアルタイム受信
- [ ] タイピングインジケーター
- [ ] オンラインステータス表示

---

### 🎯 フェーズ4: 通知機能

#### 4-1. アプリ内通知
**目的**: ユーザーの見逃しを防ぐ

**実装内容**:
- [ ] 新規メッセージ通知
- [ ] お気に入り物件の価格変更通知
- [ ] 通知一覧ページ
- [ ] 通知バッジ表示
- [ ] 通知の既読管理

**データベース追加**:
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // MESSAGE, PRICE_CHANGE, etc
  title     String
  content   String
  isRead    Boolean  @default(false)
  link      String?  // 通知をクリックした時の遷移先
  createdAt DateTime @default(now())
}
```

#### 4-2. メール通知（オプション）
**実装内容**:
- [ ] 新規メッセージのメール通知
- [ ] 重要な更新のメール通知
- [ ] 通知設定ページ（オン/オフ切り替え）

---

### 🎯 フェーズ5: ユーザープロフィール・マイページ

#### 5-1. プロフィール機能
**目的**: ユーザー情報の管理と信頼性向上

**実装内容**:
- [ ] プロフィール編集ページ
- [ ] プロフィール画像のアップロード
- [ ] 自己紹介文
- [ ] 連絡先情報（電話番号等）
- [ ] プロフィールの公開/非公開設定

**データベース変更**:
```prisma
model User {
  id          String   @id @default(cuid())
  name        String?
  email       String?  @unique
  image       String?
  bio         String?  // 自己紹介
  phone       String?  // 電話番号

  properties        Property[]
  sentMessages      Message[] @relation("SentMessages")
  receivedMessages  Message[] @relation("ReceivedMessages")
  favorites         Favorite[]
  notifications     Notification[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

#### 5-2. マイページダッシュボード
**実装内容**:
- [ ] 出品中の物件一覧
- [ ] 売却済み物件一覧
- [ ] お気に入り物件一覧
- [ ] メッセージ一覧
- [ ] 通知一覧
- [ ] アクティビティログ

---

### 🎯 フェーズ6: 信頼性・安全性の向上

#### 6-1. レビュー・評価システム
**目的**: ユーザー間の信頼を構築

**実装内容**:
- [ ] ユーザーへの評価（5段階）
- [ ] レビューコメント
- [ ] 評価の集計表示
- [ ] 取引完了後の評価リクエスト

**データベース追加**:
```prisma
model Review {
  id          String   @id @default(cuid())
  rating      Int      // 1-5
  comment     String?
  reviewerId  String
  reviewer    User     @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  revieweeId  String
  reviewee    User     @relation("ReviewsReceived", fields: [revieweeId], references: [id])
  propertyId  String?
  property    Property? @relation(fields: [propertyId], references: [id])
  createdAt   DateTime @default(now())

  @@unique([reviewerId, revieweeId, propertyId])
}
```

#### 6-2. 通報・ブロック機能
**実装内容**:
- [ ] 不適切な物件の通報
- [ ] 不適切なユーザーの通報
- [ ] ユーザーのブロック機能
- [ ] 通報理由の選択
- [ ] 管理者への通知

---

### 🎯 フェーズ7: 物件管理の高度化

#### 7-1. 物件ステータス管理
**目的**: 取引状況を明確化

**実装内容**:
- [ ] ステータス追加（公開中、交渉中、成約済み、非公開）
- [ ] ステータスによる表示制御
- [ ] ステータス変更履歴

**データベース変更**:
```prisma
model Property {
  // ...既存フィールド
  status    String   @default("ACTIVE") // ACTIVE, NEGOTIATING, SOLD, DRAFT
  soldAt    DateTime? // 成約日
  // ...
}
```

#### 7-2. 物件の下書き保存
**実装内容**:
- [ ] 下書きとして保存
- [ ] 下書き一覧表示
- [ ] 下書きから公開への変更

#### 7-3. 閲覧数・人気度表示
**実装内容**:
- [ ] 物件の閲覧数カウント
- [ ] お気に入り登録数の表示
- [ ] 人気順ソート

**データベース追加**:
```prisma
model PropertyView {
  id         String   @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
  viewedAt   DateTime @default(now())
}
```

---

### 🎯 フェーズ8: 分析・可視化機能

#### 8-1. 価格相場の可視化
**目的**: ユーザーの意思決定をサポート

**実装内容**:
- [ ] エリア別平均価格の表示
- [ ] 価格推移グラフ
- [ ] 類似物件との価格比較
- [ ] 相場情報ページ

#### 8-2. 統計情報
**実装内容**:
- [ ] 人気エリアランキング
- [ ] 間取り別平均価格
- [ ] 築年数と価格の関係
- [ ] 月別登録物件数

---

### 🎯 フェーズ9: パフォーマンス・インフラ改善

#### 9-1. 画像ストレージの最適化
**目的**: パフォーマンス向上とコスト削減

**実装内容**:
- [ ] クラウドストレージ導入（AWS S3 / Cloudflare R2等）
- [ ] 画像の自動圧縮
- [ ] WebP形式への変換
- [ ] CDN統合
- [ ] サムネイル自動生成

#### 9-2. データベース最適化
**実装内容**:
- [ ] SQLiteからPostgreSQLへ移行
- [ ] インデックスの最適化
- [ ] クエリの最適化
- [ ] コネクションプーリング

#### 9-3. キャッシング戦略
**実装内容**:
- [ ] Redis導入
- [ ] 物件一覧のキャッシュ
- [ ] 検索結果のキャッシュ
- [ ] APIレスポンスのキャッシュ

---

### 🎯 フェーズ10: SEO・マーケティング

#### 10-1. SEO最適化
**目的**: 検索エンジンからの流入増加

**実装内容**:
- [ ] メタタグの最適化
- [ ] OGP設定（SNSシェア対応）
- [ ] サイトマップ生成
- [ ] robots.txt設定
- [ ] 構造化データ（Schema.org）
- [ ] ページ表示速度の最適化

#### 10-2. SNS連携
**実装内容**:
- [ ] シェアボタン（Twitter, Facebook, LINE等）
- [ ] OGP画像の自動生成
- [ ] SNSでのログイン（フェーズ1の認証機能実装後）

---

### 🎯 フェーズ11: モバイル対応強化

#### 11-1. PWA対応
**目的**: モバイルユーザー体験の向上

**実装内容**:
- [ ] Service Worker実装
- [ ] オフライン対応
- [ ] ホーム画面への追加
- [ ] プッシュ通知対応
- [ ] manifest.json設定

#### 11-2. モバイルUX改善
**実装内容**:
- [ ] タッチ操作の最適化
- [ ] スワイプジェスチャー対応
- [ ] モバイル専用UIコンポーネント
- [ ] 画像の遅延読み込み

---

### 🎯 フェーズ12: ヘルプ・サポート

#### 12-1. ヘルプセンター
**目的**: ユーザーサポートの充実

**実装内容**:
- [ ] FAQ ページ
- [ ] 使い方ガイド
- [ ] よくある質問
- [ ] 用語集
- [ ] チュートリアル動画

#### 12-2. お問い合わせ機能
**実装内容**:
- [ ] お問い合わせフォーム
- [ ] カテゴリ別問い合わせ
- [ ] 自動返信メール
- [ ] 問い合わせ履歴

---

## 技術的負債・改善事項

### セキュリティ
- [ ] ユーザーIDをlocalStorageで管理している問題の解決
- [ ] APIエンドポイントの認可チェック強化
- [ ] CSRF対策
- [ ] XSS対策の徹底
- [ ] SQLインジェクション対策の確認
- [ ] レート制限（Rate Limiting）

### コード品質
- [ ] TypeScriptの型定義を厳格化
- [ ] ESLintルールの追加
- [ ] Prettierの統一設定
- [ ] ユニットテストの追加
- [ ] E2Eテストの追加
- [ ] コードレビュープロセスの確立

### エラーハンドリング
- [ ] グローバルエラーハンドリング
- [ ] エラーページのカスタマイズ（404, 500等）
- [ ] エラーログの収集（Sentry等）
- [ ] ユーザーフレンドリーなエラーメッセージ

---

## 後回し機能（将来的に検討）

### 認証・決済関連
- OAuth認証（Google, Facebook, LINE等）
- メール認証
- 二要素認証
- 決済機能（Stripe, PayPal等）
- エスクローサービス
- 契約書の電子署名
- 本人確認（KYC）

### 高度な機能
- AI価格査定
- AIチャットボット
- 物件推薦システム
- VR内見機能
- 動画対応

---

## 開発優先順位

### 高優先度
1. 物件詳細情報の追加（フェーズ1-1）
2. 検索・フィルター強化（フェーズ2-1）
3. ページネーション（フェーズ2-3）
4. 画像機能強化（フェーズ1-2）
5. セキュリティ改善

### 中優先度
1. メッセージ機能改善（フェーズ3-1）
2. 通知機能（フェーズ4）
3. プロフィール機能（フェーズ5-1）
4. 物件ステータス管理（フェーズ7-1）
5. 画像ストレージ最適化（フェーズ9-1）

### 低優先度
1. レビュー・評価システム（フェーズ6-1）
2. 統計情報（フェーズ8）
3. PWA対応（フェーズ11）
4. ヘルプセンター（フェーズ12）

---

## 参考リンク

- [プロジェクト構成](./README.md)
- [データベーススキーマ](./prisma/schema.prisma)
- [API仕様書](./API_DOCUMENTATION.md)（作成予定）
