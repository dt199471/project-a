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

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'chat-post-initial',
        hypothesisId: 'H1',
        location: 'app/api/chat/route.ts:55',
        message: 'POST /api/chat received',
        data: { hasMessages: !!messages, messageCount: Array.isArray(messages) ? messages.length : null },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "メッセージが必要です" },
        { status: 400 }
      )
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'chat-post-initial',
        hypothesisId: 'H2',
        location: 'app/api/chat/route.ts:63',
        message: 'Calling OpenAI chat.completions.create',
        data: {},
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    // OpenAI APIにリクエスト（GPT-5ナノを使用）
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano", // GPT-5ナノモデル
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_completion_tokens: 2000, // GPT-5-nanoではmax_completion_tokensを使用（推論トークン+出力トークンの合計）
    })

    console.log("Chat completion raw response:", JSON.stringify(completion, null, 2))

    const assistantMessage = completion.choices[0]?.message?.content

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b24b0ddd-9846-4da6-bed5-1b28613f60cf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'chat-post-initial',
        hypothesisId: 'H3',
        location: 'app/api/chat/route.ts:77',
        message: 'Assistant message extracted',
        data: {
          hasAssistantMessage: !!assistantMessage,
          assistantMessagePreview: typeof assistantMessage === 'string' ? assistantMessage.slice(0, 50) : null,
          choiceCount: Array.isArray(completion.choices) ? completion.choices.length : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

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
        { error: `モデル "gpt-5-nano" が見つかりません。APIキーにこのモデルへのアクセス権限があるか確認してください。` },
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


