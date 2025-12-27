import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { images, action } = await request.json()

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "画像がありません" },
        { status: 400 }
      )
    }

    if (action === "sort") {
      // 画像を分析して最適な順序を提案
      const imageDescriptions = await Promise.all(
        images.slice(0, 10).map(async (img: string, index: number) => {
          try {
            const response = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "この不動産物件の写真を簡潔に分類してください。次のいずれかで回答: 外観/リビング/キッチン/寝室/浴室/トイレ/玄関/バルコニー/収納/その他",
                    },
                    {
                      type: "image_url",
                      image_url: { url: img },
                    },
                  ],
                },
              ],
              max_tokens: 20,
            })
            return {
              index,
              category: response.choices[0].message.content || "その他",
            }
          } catch {
            return { index, category: "その他" }
          }
        })
      )

      // 推奨順序: 外観→リビング→キッチン→寝室→浴室→トイレ→玄関→バルコニー→収納→その他
      const order = ["外観", "リビング", "キッチン", "寝室", "浴室", "トイレ", "玄関", "バルコニー", "収納", "その他"]
      const sorted = imageDescriptions.sort((a, b) => {
        const aOrder = order.findIndex((o) => a.category.includes(o))
        const bOrder = order.findIndex((o) => b.category.includes(o))
        return (aOrder === -1 ? 999 : aOrder) - (bOrder === -1 ? 999 : bOrder)
      })

      return NextResponse.json({
        success: true,
        sortedIndices: sorted.map((s) => s.index),
        categories: imageDescriptions,
      })
    }

    if (action === "comment") {
      // 画像からコメントを生成
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `この不動産物件の写真を見て、物件説明文を作成してください。
以下の観点を含めて、購入検討者に魅力が伝わる文章を200文字程度で作成してください：
- 部屋の特徴や雰囲気
- 日当たりや眺望
- 設備や収納
- おすすめポイント`,
              },
              ...images.slice(0, 5).map((img: string) => ({
                type: "image_url" as const,
                image_url: { url: img },
              })),
            ],
          },
        ],
        max_tokens: 400,
      })

      return NextResponse.json({
        success: true,
        comment: response.choices[0].message.content,
      })
    }

    return NextResponse.json({ error: "不明なアクション" }, { status: 400 })
  } catch (error) {
    console.error("Photo assist error:", error)
    return NextResponse.json(
      { error: "画像処理中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
