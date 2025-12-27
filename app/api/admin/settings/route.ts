import { NextRequest, NextResponse } from "next/server"
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

// 利用可能なモデル一覧
export const AVAILABLE_MODELS = [
  { id: "gpt-5", name: "GPT-5", description: "最高性能、高コスト" },
  { id: "gpt-5-mini", name: "GPT-5 Mini", description: "バランス型（推奨）" },
  { id: "gpt-5-nano", name: "GPT-5 Nano", description: "高速・低コスト" },
  { id: "gpt-4o", name: "GPT-4o", description: "マルチモーダル対応" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "コスト効率重視" },
]

export const REASONING_EFFORTS = [
  { id: "low", name: "低（高速）", description: "Web検索と併用可能" },
  { id: "medium", name: "中", description: "バランス型" },
  { id: "high", name: "高（詳細）", description: "複雑な推論向け" },
]

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    // 設定を取得、なければデフォルト値で作成
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    })

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          id: "default",
          chatModel: "gpt-5-mini",
          systemPrompt: DEFAULT_SYSTEM_PROMPT,
          reasoningEffort: "low",
          webSearchEnabled: true,
        },
      })
    }

    return NextResponse.json({
      settings,
      availableModels: AVAILABLE_MODELS,
      reasoningEfforts: REASONING_EFFORTS,
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "設定の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!adminUser?.isAdmin) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 })
    }

    const body = await request.json()
    const { chatModel, systemPrompt, reasoningEffort, webSearchEnabled } = body

    // バリデーション
    if (chatModel && !AVAILABLE_MODELS.find((m) => m.id === chatModel)) {
      return NextResponse.json({ error: "無効なモデルです" }, { status: 400 })
    }

    if (reasoningEffort && !REASONING_EFFORTS.find((r) => r.id === reasoningEffort)) {
      return NextResponse.json({ error: "無効な推論レベルです" }, { status: 400 })
    }

    const settings = await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: {
        ...(chatModel && { chatModel }),
        ...(systemPrompt !== undefined && { systemPrompt }),
        ...(reasoningEffort && { reasoningEffort }),
        ...(webSearchEnabled !== undefined && { webSearchEnabled }),
      },
      create: {
        id: "default",
        chatModel: chatModel || "gpt-5-mini",
        systemPrompt: systemPrompt || DEFAULT_SYSTEM_PROMPT,
        reasoningEffort: reasoningEffort || "low",
        webSearchEnabled: webSearchEnabled ?? true,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "設定の更新に失敗しました" },
      { status: 500 }
    )
  }
}
