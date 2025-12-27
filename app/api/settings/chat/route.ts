import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// デフォルトのシステムプロンプト
const DEFAULT_SYSTEM_PROMPT = `あなたは「Selfie Home」という不動産個人間売買プラットフォームのAIアシスタントです。

## あなたの役割
- 不動産の購入・売却に関する質問に答える
- プラットフォームの使い方をサポートする
- 物件探しや価格査定についてアドバイスする

## Selfie Homeの特徴
- 仲介手数料0円（個人間売買）
- AI価格査定機能
- 売主と買主の直接メッセージ機能
- お気に入り物件の保存機能

## プラットフォームの主な機能
1. 物件検索（/properties）: エリア、価格、間取りなどで検索可能
2. AI価格査定（/ai-estimator）: 無料で物件の適正価格を査定
3. 物件登録（/properties/new）: 売却したい物件を登録
4. メッセージ機能: 売主と買主が直接やり取り
5. お気に入り機能: 気になる物件を保存

## 応答のルール
- 丁寧で親しみやすい日本語で応答する
- 具体的なアドバイスを心がける
- プラットフォームの機能を適切に案内する
- 法的なアドバイスは控え、専門家への相談を勧める
- 簡潔に回答する（長すぎない）`

export async function GET() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    })

    if (!settings) {
      // デフォルト設定を返す
      return NextResponse.json({
        chatModel: "gpt-5-mini",
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        reasoningEffort: "low",
        webSearchEnabled: true,
      })
    }

    return NextResponse.json({
      chatModel: settings.chatModel,
      systemPrompt: settings.systemPrompt,
      reasoningEffort: settings.reasoningEffort,
      webSearchEnabled: settings.webSearchEnabled,
    })
  } catch (error) {
    console.error("Error fetching chat settings:", error)
    // エラー時はデフォルト設定を返す
    return NextResponse.json({
      chatModel: "gpt-5-mini",
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      reasoningEffort: "low",
      webSearchEnabled: true,
    })
  }
}
