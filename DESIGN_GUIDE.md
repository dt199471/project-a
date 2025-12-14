# URUCAMOデザインガイドライン

このドキュメントは、URUCAMOプラットフォームの統一されたデザインと意匠を維持するためのガイドラインです。
新しいページやコンポーネントを作成する際は、このガイドラインに従ってください。

## デザインコンセプト

**Modern Standard風 - シンプル、洗練、高級感**

- モノトーンを基調としたミニマルなデザイン
- 余白を活かしたレイアウト
- 軽やかで読みやすいタイポグラフィ
- 控えめなアニメーション・トランジション

---

## カラーパレット

### 主要カラー（グレースケール）

```css
/* 背景色 */
bg-white           /* #FFFFFF - 白背景（フォーム、カードなど） */
bg-gray-50         /* #F9FAFB - 薄いグレー背景（セクション区切り） */
bg-gray-900        /* #111827 - 濃いグレー背景（ヒーロー、CTAセクション） */

/* テキストカラー */
text-gray-900      /* #111827 - メイン見出し、重要テキスト */
text-gray-700      /* #374151 - 通常テキスト、サブ見出し */
text-gray-600      /* #4B5563 - 説明文 */
text-gray-500      /* #6B7280 - ラベル、キャプション */
text-gray-400      /* #9CA3AF - 補足テキスト */
text-gray-300      /* #D1D5DB - プレースホルダー */

/* ボーダー・区切り線 */
border-gray-200    /* #E5E7EB - 通常のボーダー */
border-gray-300    /* #D1D5DB - フォーム入力欄のボーダー */
```

### アクセントカラー（控えめに使用）

```css
/* エラー・削除 */
text-red-500       /* #EF4444 */
bg-red-500         /* #EF4444 */

/* 必須マーク */
text-red-500       /* #EF4444 */
```

### 使用禁止カラー

- 鮮やかなブルー（`bg-blue-600`など）は使用しない
- 鮮やかなグリーン、イエロー、パープルなどは使用しない
- グラデーションは控えめに、または使用しない

---

## タイポグラフィ

### フォントウェイト

```css
font-light         /* 300 - 大見出し、キャッチコピー */
font-medium        /* 500 - 小見出し、ボタン */
font-semibold      /* 使用しない */
font-bold          /* 使用しない */
```

### 文字間隔

```css
tracking-wide      /* 0.025em - ラベル、カテゴリー表示 */
tracking-widest    /* 0.1em - 大文字の小見出し（例: BUY, SELL） */
```

### 見出しサイズ

```css
/* 大見出し（ヒーローセクション） */
text-4xl lg:text-6xl    /* 36px → 60px */

/* 中見出し（セクションタイトル） */
text-3xl lg:text-4xl    /* 30px → 36px */

/* 小見出し（カードタイトル） */
text-xl                 /* 20px */
text-lg                 /* 18px */

/* 本文 */
text-sm                 /* 14px - 通常のテキスト */
text-xs                 /* 12px - キャプション、補足 */
```

### 見出しスタイルの例

```tsx
{/* 大見出し - ページトップ */}
<h1 className="text-4xl lg:text-6xl font-light leading-tight text-gray-900">
  高級中古マンションを<br />買う
</h1>

{/* セクションタイトル */}
<h2 className="text-3xl lg:text-4xl font-light text-gray-900">
  URUCAMOが選ばれる理由
</h2>

{/* カードタイトル */}
<h3 className="text-xl font-medium text-gray-900">
  AI価格査定
</h3>

{/* ラベル（大文字） */}
<p className="text-sm tracking-widest uppercase text-gray-500">
  BUY
</p>
```

---

## レイアウト

### コンテナ幅

```tsx
{/* 標準コンテナ */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* コンテンツ */}
</div>

{/* 狭いコンテナ（フォームなど） */}
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* コンテンツ */}
</div>

{/* さらに狭いコンテナ（テキスト中心） */}
<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* コンテンツ */}
</div>
```

### パディング・マージン

```css
/* セクション間の縦方向スペース */
py-16 lg:py-24      /* 64px → 96px */

/* セクション内の縦方向スペース */
py-12               /* 48px */

/* 要素間のスペース */
mb-16               /* 64px - セクション内の大きな区切り */
mb-12               /* 48px - 中程度の区切り */
mb-8                /* 32px - 小さめの区切り */
mb-6                /* 24px - 通常の要素間 */
mb-4                /* 16px - 密な要素間 */
mb-2                /* 8px - ラベルとフォーム入力の間など */

/* グリッドギャップ */
gap-8 lg:gap-12     /* 32px → 48px */
gap-6               /* 24px */
gap-4               /* 16px */
```

---

## ページ構造

### 典型的なページ構造

```tsx
export default function SamplePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 黒背景 */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-400">
              CATEGORY
            </p>
            <h1 className="text-4xl lg:text-6xl font-light leading-tight mb-6">
              ページタイトル
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              ページの説明文
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* CTAボタン */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 白背景 */}
      <div className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">
              SECTION LABEL
            </p>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              セクションタイトル
            </h2>
          </div>
          {/* セクション内容 */}
        </div>
      </div>

      {/* Alternate Section - グレー背景 */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* セクション内容 */}
        </div>
      </div>

      {/* CTA Section - 黒背景 */}
      <div className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            CTAタイトル
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            CTAの説明
          </p>
          {/* CTAボタン */}
        </div>
      </div>
    </div>
  )
}
```

---

## コンポーネント

### ボタン

#### プライマリボタン（黒背景）

```tsx
<button className="px-8 py-4 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors">
  ボタンテキスト
</button>

{/* または黒背景ページでの白抜きボタン */}
<button className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 font-medium transition-colors">
  ボタンテキスト
</button>
```

#### セカンダリボタン（枠線のみ）

```tsx
<button className="px-8 py-4 border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors">
  ボタンテキスト
</button>

{/* または白背景での枠線ボタン */}
<button className="px-8 py-3 border border-gray-300 text-gray-900 hover:bg-gray-50 font-medium transition-colors">
  ボタンテキスト
</button>
```

### フォーム入力

```tsx
{/* テキスト入力 */}
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
  placeholder="プレースホルダー"
/>

{/* テキストエリア */}
<textarea
  rows={8}
  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
  placeholder="プレースホルダー"
/>

{/* セレクトボックス */}
<select className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white">
  <option value="">選択してください</option>
</select>

{/* ラベル */}
<label className="block text-sm font-medium text-gray-900 mb-2">
  ラベル <span className="text-red-500">*</span>
</label>
```

### カード

#### シンプルなカード（ホバー効果あり）

```tsx
<div className="group p-6 border border-gray-200 hover:border-gray-900 transition-colors">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-900">カード内容</span>
    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors">
      {/* アイコン */}
    </svg>
  </div>
</div>
```

#### 検索カテゴリーカード

```tsx
<Link
  href="/path"
  className="group bg-white p-6 hover:shadow-md transition-shadow border border-gray-200"
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
        SEARCH BY
      </p>
      <h3 className="text-lg font-medium text-gray-900">
        カテゴリー名
      </h3>
    </div>
    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors">
      {/* 矢印アイコン */}
    </svg>
  </div>
</Link>
```

### アイコン付き特徴セクション

```tsx
<div className="text-center">
  <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
    <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {/* アイコンパス */}
    </svg>
  </div>
  <h3 className="text-xl font-medium text-gray-900 mb-3">
    タイトル
  </h3>
  <p className="text-sm text-gray-600 leading-relaxed">
    説明文
  </p>
</div>
```

---

## セクションパターン

### ヒーローセクション（黒背景）

```tsx
<div className="bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
    <div className="max-w-3xl">
      <p className="text-sm tracking-widest uppercase mb-4 text-gray-400">
        BUY / SELL / CATEGORY
      </p>
      <h1 className="text-4xl lg:text-6xl font-light leading-tight mb-6">
        ページのメイン<br />タイトル
      </h1>
      <p className="text-lg text-gray-300 leading-relaxed mb-8">
        ページの説明文。簡潔に魅力を伝える。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/path"
          className="px-8 py-4 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors text-center"
        >
          主要なアクション
        </Link>
        <Link
          href="/path"
          className="px-8 py-4 border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors text-center"
        >
          副次的なアクション
        </Link>
      </div>
    </div>
  </div>
</div>
```

### 検索カテゴリーセクション（グレー背景）

```tsx
<div className="bg-gray-50 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 検索カテゴリーカードを3つ */}
    </div>
  </div>
</div>
```

### 特徴セクション（白背景）

```tsx
<div className="bg-white py-16 lg:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <p className="text-sm tracking-widest uppercase mb-4 text-gray-500">
        FEATURES
      </p>
      <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
        セクションタイトル
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        セクションの説明
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* アイコン付き特徴を4つ */}
    </div>
  </div>
</div>
```

### CTAセクション（黒背景）

```tsx
<div className="bg-gray-900 text-white py-16 lg:py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl lg:text-4xl font-light mb-6">
      CTAタイトル<br className="sm:hidden" />を入力
    </h2>
    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
      CTAの説明文
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
        href="/path"
        className="px-8 py-4 bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
      >
        アクション1
      </Link>
      <Link
        href="/path"
        className="px-8 py-4 border border-white text-white text-sm font-medium hover:bg-white hover:text-gray-900 transition-colors"
      >
        アクション2
      </Link>
    </div>
  </div>
</div>
```

### 電話番号表示セクション

```tsx
<div className="mt-8 pt-8 border-t border-gray-700">
  <p className="text-gray-400 mb-4">お電話でのご相談も受け付けております</p>
  <a
    href="tel:0120-962-658"
    className="flex items-center justify-center gap-3 text-2xl font-light"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
    0120-962-658
  </a>
</div>
```

---

## アニメーション・トランジション

### トランジション

すべてのインタラクティブ要素には`transition-colors`または`transition-all`を追加

```tsx
{/* ホバー効果のあるリンク */}
<a className="text-gray-700 hover:text-gray-900 transition-colors">
  リンクテキスト
</a>

{/* ボタン */}
<button className="bg-gray-900 hover:bg-gray-800 transition-colors">
  ボタン
</button>

{/* ボーダー変化 */}
<div className="border border-gray-200 hover:border-gray-900 transition-colors">
  カード
</div>
```

### アニメーション

基本的にアニメーションは控えめに。使用する場合：

```tsx
{/* フェードイン（必要な場合のみ） */}
<div className="animate-fadeIn">
  コンテンツ
</div>

{/* ローディングスピナー */}
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
```

---

## レスポンシブデザイン

### ブレークポイント

```css
sm:   640px  /* タブレット小 */
md:   768px  /* タブレット */
lg:   1024px /* デスクトップ */
xl:   1280px /* 大画面 */
```

### モバイルファースト

常にモバイルを基準にデザインし、大画面向けに拡張

```tsx
{/* モバイル: 1カラム、デスクトップ: 3カラム */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  {/* カード */}
</div>

{/* モバイル: 縦並び、デスクトップ: 横並び */}
<div className="flex flex-col sm:flex-row gap-4">
  {/* ボタン */}
</div>

{/* テキストサイズ */}
<h1 className="text-4xl lg:text-6xl">
  見出し
</h1>

{/* パディング */}
<div className="py-16 lg:py-24">
  セクション
</div>
```

---

## アイコン

### Heroicons使用

すべてのアイコンはHeroiconsのoutlineスタイルを使用

```tsx
{/* 基本的なアイコン */}
<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
</svg>

{/* 大きめのアイコン（特徴セクションなど） */}
<svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="..." />
</svg>
```

よく使うアイコン:
- 矢印（右）: `M9 5l7 7-7 7`
- 電話: `M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z`
- チェック: `M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z`
- AI/稲妻: `M13 10V3L4 14h7v7l9-11h-7z`
- メッセージ: `M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z`

---

## 禁止事項

### ❌ 使用しないパターン

1. **カラフルなグラデーション**
   ```tsx
   {/* 使用しない */}
   <div className="bg-gradient-to-r from-blue-600 to-purple-600">
   ```

2. **角丸を多用**
   ```tsx
   {/* 使用しない */}
   <div className="rounded-2xl">

   {/* 控えめに使う */}
   <div className="rounded-lg">  {/* 必要な場合のみ */}
   ```

3. **シャドウの多用**
   ```tsx
   {/* 使用しない */}
   <div className="shadow-2xl">

   {/* ホバー時に控えめに */}
   <div className="hover:shadow-md transition-shadow">
   ```

4. **太字の多用**
   ```tsx
   {/* 使用しない */}
   <h1 className="font-bold">

   {/* 使用する */}
   <h1 className="font-light">
   ```

5. **鮮やかなカラー**
   ```tsx
   {/* 使用しない */}
   <button className="bg-blue-600">

   {/* 使用する */}
   <button className="bg-gray-900">
   ```

---

## 実装例

### ✅ デザイン完成済みページ（参照用）

以下のページが正しいModern Standard風デザインを実装しています：

1. **ホームページ** - `app/(main)/page.tsx`
   - ヒーローセクション（黒背景）
   - 検索カテゴリー（グレー背景）
   - 特徴セクション（4カラムグリッド）
   - CTAセクション（黒背景）
   - 人気エリアグリッド

2. **売却ページ** - `app/(main)/sell/page.tsx`
   - ヒーローセクション
   - メリットセクション（3カラムグリッド）
   - プロセスセクション（4ステップ）
   - FAQセクション
   - CTAセクション

3. **物件登録ページ** - `app/(main)/properties/new/page.tsx`
   - ページヘッダー（グレー背景）
   - フォームレイアウト
   - 登録のポイントセクション

4. **AI価格査定ページ** - `app/(main)/ai-estimator/page.tsx`
   - AI査定フォーム
   - 特徴セクション

5. **ナビゲーション** - `components/Navbar.tsx`
   - シンプルなヘッダー
   - モバイルメニュー
   - 電話番号表示

6. **PropertyForm** - `components/property/PropertyForm.tsx`
   - Modern Standard風フォームスタイル
   - シンプルなボーダー
   - 黒フォーカス

### 🚧 今後改善予定のページ

以下のページはまだ旧デザインのため、このガイドラインに従って改善する必要があります：

- [ ] **物件一覧ページ** - `app/(main)/properties/page.tsx`
- [ ] **物件詳細ページ** - `app/(main)/properties/[id]/page.tsx`
- [ ] **物件編集ページ** - `app/(main)/properties/[id]/edit/page.tsx`
- [ ] **メッセージ一覧ページ** - `app/(main)/messages/page.tsx`
- [ ] **メッセージ詳細ページ** - `app/(main)/messages/[propertyId]/[userId]/page.tsx`
- [ ] **お気に入りページ** - `app/(main)/favorites/page.tsx`
- [ ] **PropertyCard** - `components/property/PropertyCard.tsx`
- [ ] **PropertySearch** - `components/property/PropertySearch.tsx`

---

## チェックリスト

新しいページを作成する際は、以下を確認してください：

- [ ] カラーパレットはグレースケール中心か
- [ ] フォントウェイトは`font-light`または`font-medium`を使用しているか
- [ ] ボタンは黒ベース（`bg-gray-900`）または枠線のみか
- [ ] フォーカス時のボーダーは`focus:border-gray-900`か
- [ ] セクションは白・グレー50・グレー900で区切られているか
- [ ] 大文字ラベルに`tracking-widest uppercase`を使用しているか
- [ ] トランジション効果は`transition-colors`を使用しているか
- [ ] レスポンシブデザインは実装されているか
- [ ] コンテナ幅は`max-w-7xl`または`max-w-4xl`を使用しているか
- [ ] 余白は適切か（`py-16 lg:py-24`など）

---

## まとめ

**シンプル・洗練・高級感**

- グレースケールを基調としたミニマルなデザイン
- font-lightで軽やかな印象
- 控えめなトランジション
- 余白を活かしたレイアウト
- Modern Standard風の統一感

このガイドラインに従うことで、プラットフォーム全体で統一されたデザインと優れたユーザー体験を提供できます。
