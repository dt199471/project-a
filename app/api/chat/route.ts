import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { prisma } from "@/lib/db"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
- 簡潔に回答する（長すぎない）
`

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatSettings {
  chatModel: string
  systemPrompt: string
  reasoningEffort: string
  webSearchEnabled: boolean
}

async function getSettings(): Promise<ChatSettings> {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    })

    if (settings) {
      return {
        chatModel: settings.chatModel,
        systemPrompt: settings.systemPrompt,
        reasoningEffort: settings.reasoningEffort,
        webSearchEnabled: settings.webSearchEnabled,
      }
    }
  } catch (error) {
    console.error("Error fetching settings:", error)
  }

  // デフォルト設定を返す
  return {
    chatModel: "gpt-5-mini",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    reasoningEffort: "low",
    webSearchEnabled: true,
  }
}

export async function POST(request: NextRequest) {
  try {
    // APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      )
    }

    // 設定を取得
    const settings = await getSettings()

    // 会話履歴を構築
    const lastUserMessage = messages[messages.length - 1]?.content || ""
    const conversationContext = messages.length > 1
      ? messages.slice(0, -1).map((m) => `${m.role === "user" ? "ユーザー" : "アシスタント"}: ${m.content}`).join("\n")
      : ""

    const inputPrompt = conversationContext
      ? `${settings.systemPrompt}\n\n## 会話履歴\n${conversationContext}\n\n## 現在の質問\n${lastUserMessage}`
      : `${settings.systemPrompt}\n\n## 質問\n${lastUserMessage}`

    // OpenAI Responses APIにリクエスト
    const requestParams: any = {
      model: settings.chatModel,
      input: inputPrompt,
    }

    // Web検索が有効な場合のみtoolsを追加
    if (settings.webSearchEnabled) {
      requestParams.tools = [{ type: "web_search" }]
    }

    // 推論レベルを設定
    if (settings.reasoningEffort) {
      requestParams.reasoning = { effort: settings.reasoningEffort }
    }

    const response = await openai.responses.create(requestParams)

    const assistantMessage = response.output_text

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "AIからの応答がありませんでした" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: assistantMessage,
    })
  } catch (error: any) {
    console.error("Chat API error:", error)
    console.error("Error details:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      type: error?.type,
      response: error?.response,
    })

    // OpenAI APIエラーの詳細を返す
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "OpenAI APIキーが無効です" },
        { status: 401 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "APIの利用制限に達しました。しばらくしてから再度お試しください" },
        { status: 429 }
      )
    }

    // モデルが見つからない場合（404）
    if (error?.status === 404 || error?.code === "model_not_found") {
      return NextResponse.json(
        { error: `指定されたモデルが見つかりません。管理画面でモデル設定を確認してください。` },
        { status: 404 }
      )
    }

    // その他のエラー（詳細を返す）
    const errorMessage = error?.message || "チャットの処理に失敗しました"
    return NextResponse.json(
      {
        error: errorMessage,
        details: error?.code ? `エラーコード: ${error.code}` : undefined
      },
      { status: error?.status || 500 }
    )
  }
}
