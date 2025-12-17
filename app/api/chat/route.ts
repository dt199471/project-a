import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// システムプロンプト: 不動産アシスタントとしての役割を定義
const SYSTEM_PROMPT = `あなたは「Selfie Home」という不動産個人間売買プラットフォームのAIアシスタントです。

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

    // OpenAI APIにリクエスト
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // コスト効率の良いモデル
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const assistantMessage = completion.choices[0]?.message?.content

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

    return NextResponse.json(
      { error: "チャットの処理に失敗しました" },
      { status: 500 }
    )
  }
}

