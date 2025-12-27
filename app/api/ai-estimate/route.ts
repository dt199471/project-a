import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface EstimationRequest {
  mansionName?: string // マンション名（任意）
  area: number // 専有面積（㎡）
  buildYear?: number // 建築年（任意）
  prefecture: string // 都道府県
  city?: string // 市区町村（任意）
  layout?: string // 間取り（任意）
  structure?: string // 構造（任意）
  direction?: string // 向き（任意）
}

interface EstimationResponse {
  estimatedPrice: number
  priceRange: {
    min: number
    max: number
  }
  confidence: number
  reasoning: string
  marketInfo?: string
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
    const { mansionName, area, buildYear, prefecture, city, layout, structure, direction } = body as EstimationRequest

    // 必須パラメータの検証
    if (!area || !prefecture) {
      return NextResponse.json(
        { error: "専有面積と都道府県は必須です" },
        { status: 400 }
      )
    }

    // 築年数を計算
    const currentYear = new Date().getFullYear()
    const age = buildYear ? currentYear - buildYear : null

    // マンション名がある場合はWeb検索で市場情報を取得
    let marketInfo = ""
    let transactionHistory = "" // 成約事例
    let currentListings = "" // 売り出し中物件
    let dataSources: string[] = [] // 情報ソース

    if (mansionName) {
      try {
        // 成約事例と売り出し中物件を同時に検索
        const searchResponse = await openai.responses.create({
          model: "gpt-4o-mini",
          tools: [{ type: "web_search_preview" }],
          input: [
            {
              role: "user",
              content: `「${mansionName} 中古マンション 価格」で検索して、以下の情報を調べてJSON形式で返してください：

1. 過去に売れた価格（成約価格）の事例
2. 現在販売中の物件情報
3. 情報を取得したサイト名

以下のJSON形式で返してください：
{
  "soldHistory": [
    {"time": "2024年10月", "layout": "3LDK", "area": "72㎡", "floor": "15階", "price": "5,200万円"},
    {"time": "2024年8月", "layout": "2LDK", "area": "58㎡", "floor": "8階", "price": "3,800万円"}
  ],
  "forSale": [
    {"layout": "3LDK", "area": "75㎡", "floor": "12階", "price": "5,480万円"},
    {"layout": "2LDK", "area": "60㎡", "floor": "5階", "price": "4,180万円"}
  ],
  "sources": ["SUUMO", "HOME'S", "マンションレビュー", "at home"],
  "pricePerSqm": "㎡単価の目安（例: 70〜85万円/㎡）"
}

情報が見つからない項目は空配列または空文字にしてください。`,
            },
          ],
        })

        // レスポンスからテキストを抽出
        if (searchResponse.output) {
          for (const item of searchResponse.output) {
            if (item.type === "message" && item.content) {
              for (const content of item.content) {
                if (content.type === "output_text") {
                  try {
                    // JSONを抽出
                    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
                    if (jsonMatch) {
                      const parsed = JSON.parse(jsonMatch[0])

                      // 成約事例を整形
                      if (parsed.soldHistory && Array.isArray(parsed.soldHistory) && parsed.soldHistory.length > 0) {
                        transactionHistory = parsed.soldHistory
                          .slice(0, 5)
                          .map((item: any) => `${item.time || ""} ${item.layout || ""} ${item.area || ""} ${item.floor || ""} ${item.price || ""}`.trim())
                          .filter((s: string) => s)
                          .join("\n")
                      }

                      // 売り出し中物件を整形
                      if (parsed.forSale && Array.isArray(parsed.forSale) && parsed.forSale.length > 0) {
                        currentListings = parsed.forSale
                          .slice(0, 5)
                          .map((item: any) => `${item.layout || ""} ${item.area || ""} ${item.floor || ""} ${item.price || ""}`.trim())
                          .filter((s: string) => s)
                          .join("\n")
                      }

                      // ソースを保存
                      if (parsed.sources && Array.isArray(parsed.sources)) {
                        dataSources = parsed.sources.filter((s: string) => s)
                      }

                      marketInfo = parsed.pricePerSqm || ""
                    } else {
                      marketInfo = content.text
                    }
                  } catch {
                    marketInfo = content.text
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Web search error:", error)
        // 検索に失敗しても続行
      }
    }

    // 査定プロンプトを作成
    const estimationPrompt = `以下の物件情報と市場情報を基に、適正な市場価格を査定してください。

## 物件情報
${mansionName ? `- マンション名: ${mansionName}` : ""}
- 専有面積: ${area}㎡
${buildYear ? `- 建築年: ${buildYear}年（築${age}年）` : ""}
- 都道府県: ${prefecture}
${city ? `- 市区町村: ${city}` : ""}
${layout ? `- 間取り: ${layout}` : ""}
${structure ? `- 構造: ${structure}` : ""}
${direction ? `- 向き: ${direction}` : ""}

${marketInfo ? `## 相場情報\n${marketInfo}` : ""}
${transactionHistory ? `## 成約事例\n${transactionHistory}` : ""}
${currentListings ? `## 売り出し中の物件\n${currentListings}` : ""}

## 査定の注意点
1. 同じマンションまたは近隣の類似物件の取引事例を参考にする
2. 専有面積あたりの単価を算出し、面積で乗算する
3. 向き（南向きが高評価）や階数を考慮する
4. 築年数による減価を考慮する

以下のJSON形式で査定結果を返してください：
{
  "estimatedPrice": 数値（整数、円単位。例: 3500万円なら35000000）,
  "priceRange": {
    "min": 数値（整数、円単位）,
    "max": 数値（整数、円単位）
  },
  "confidence": 数値（0-100の整数、信頼度パーセンテージ）,
  "reasoning": "査定理由の説明（150文字程度）"
}

価格は必ず円単位の整数で返してください（例: 3500万円 → 35000000）。`

    // OpenAI APIにリクエスト
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは日本の不動産価格査定の専門家です。Web検索で得た市場情報と物件情報を基に、精度の高い査定を行ってください。`,
        },
        { role: "user", content: estimationPrompt },
      ],
      max_tokens: 600,
      temperature: 0.3,
      response_format: { type: "json_object" },
    })

    const assistantMessage = completion.choices[0]?.message?.content

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "AIからの応答がありませんでした" },
        { status: 500 }
      )
    }

    // JSONレスポンスをパース
    let estimationResult: EstimationResponse
    try {
      estimationResult = JSON.parse(assistantMessage)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      console.error("Response content:", assistantMessage)
      return NextResponse.json(
        { error: "AIからの応答の解析に失敗しました" },
        { status: 500 }
      )
    }

    // レスポンスの検証と正規化
    if (
      typeof estimationResult.estimatedPrice !== "number" ||
      !estimationResult.priceRange ||
      typeof estimationResult.priceRange.min !== "number" ||
      typeof estimationResult.priceRange.max !== "number" ||
      typeof estimationResult.confidence !== "number"
    ) {
      return NextResponse.json(
        { error: "AIからの応答形式が不正です" },
        { status: 500 }
      )
    }

    // 価格を10万円単位で丸める（円単位で返ってくるのでそのまま丸める）
    const estimatedPrice = Math.round(estimationResult.estimatedPrice / 100000) * 100000
    const minPrice = Math.round(estimationResult.priceRange.min / 100000) * 100000
    const maxPrice = Math.round(estimationResult.priceRange.max / 100000) * 100000

    // 信頼度を0-100の範囲に制限
    const confidence = Math.max(0, Math.min(100, Math.round(estimationResult.confidence)))

    return NextResponse.json({
      estimatedPrice,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      confidence,
      reasoning: estimationResult.reasoning || "物件情報を基に市場相場から算出しました",
      transactionHistory: transactionHistory || null,
      currentListings: currentListings || null,
      dataSources: dataSources.length > 0 ? dataSources : null,
    })
  } catch (error: any) {
    console.error("AI Estimate API error:", error)

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
      { error: "査定の処理に失敗しました" },
      { status: 500 }
    )
  }
}
