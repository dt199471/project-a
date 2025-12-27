"use client"

import { useState } from "react"
import Link from "next/link"

interface Property {
  id: string
  title: string
  price: number
  status: string
  createdAt: string
  favoriteCount?: number
  messageCount?: number
  images: string
}

interface ActionSupportCardProps {
  properties: Property[]
}

interface ActionItem {
  id: string
  priority: "high" | "medium" | "low"
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export default function ActionSupportCard({ properties }: ActionSupportCardProps) {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [priceSuggestion, setPriceSuggestion] = useState<{ [key: string]: string }>({})

  // 物件ごとのアクションを生成
  const getActionsForProperty = (property: Property): ActionItem[] => {
    const actions: ActionItem[] = []
    const daysSinceListing = Math.floor(
      (Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    const images = property.images ? JSON.parse(property.images) : []

    // 画像が少ない
    if (images.length < 5) {
      actions.push({
        id: "photos",
        priority: "high",
        title: "写真を追加しましょう",
        description: `現在${images.length}枚の写真があります。5枚以上あると問い合わせ率がアップします。`,
        action: {
          label: "写真を追加",
          href: `/properties/${property.id}/edit`,
        },
      })
    }

    // 問い合わせがない（7日以上経過）
    if (daysSinceListing >= 7 && (property.messageCount || 0) === 0) {
      actions.push({
        id: "no-inquiry",
        priority: "high",
        title: "問い合わせを増やしましょう",
        description: "掲載から1週間経過しましたが問い合わせがありません。価格の見直しや説明文の改善を検討してください。",
        action: {
          label: "価格診断を受ける",
          onClick: () => handlePriceSuggestion(property),
        },
      })
    }

    // お気に入りはあるが問い合わせがない
    if ((property.favoriteCount || 0) >= 3 && (property.messageCount || 0) === 0) {
      actions.push({
        id: "favorites-no-inquiry",
        priority: "medium",
        title: "興味を持たれています",
        description: `${property.favoriteCount}人がお気に入り登録しています。物件説明を充実させて問い合わせにつなげましょう。`,
        action: {
          label: "説明文を編集",
          href: `/properties/${property.id}/edit`,
        },
      })
    }

    // 30日経過で価格見直し提案
    if (daysSinceListing >= 30 && property.status === "ACTIVE") {
      actions.push({
        id: "price-review",
        priority: "medium",
        title: "価格の見直しを検討",
        description: "掲載から1ヶ月経過しました。市場動向に合わせた価格調整で成約率が上がる可能性があります。",
        action: {
          label: "AI価格診断",
          onClick: () => handlePriceSuggestion(property),
        },
      })
    }

    // 未返信のメッセージがある場合
    if ((property.messageCount || 0) > 0) {
      actions.push({
        id: "reply-messages",
        priority: "high",
        title: "メッセージに返信",
        description: `${property.messageCount}件の問い合わせがあります。早めの返信が成約につながります。`,
        action: {
          label: "メッセージを確認",
          href: `/messages?propertyId=${property.id}`,
        },
      })
    }

    // ステータスがDRAFTの場合
    if (property.status === "DRAFT") {
      actions.push({
        id: "publish",
        priority: "high",
        title: "物件を公開しましょう",
        description: "下書き状態の物件があります。準備ができたら公開して購入希望者を募りましょう。",
        action: {
          label: "公開設定へ",
          href: `/properties/${property.id}/edit`,
        },
      })
    }

    // アクションがない場合
    if (actions.length === 0) {
      actions.push({
        id: "all-good",
        priority: "low",
        title: "順調です！",
        description: "現在特に必要なアクションはありません。問い合わせを待ちましょう。",
      })
    }

    return actions
  }

  // AI価格提案を取得
  const handlePriceSuggestion = async (property: Property) => {
    setAiLoading(property.id)
    try {
      const response = await fetch("/api/ai/price-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          currentPrice: property.price,
          title: property.title,
          daysSinceListing: Math.floor(
            (Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          ),
          favoriteCount: property.favoriteCount || 0,
          messageCount: property.messageCount || 0,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setPriceSuggestion(prev => ({
          ...prev,
          [property.id]: result.suggestion,
        }))
      }
    } catch (error) {
      console.error("Price suggestion error:", error)
    } finally {
      setAiLoading(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "優先"
      case "medium":
        return "推奨"
      default:
        return "良好"
    }
  }

  // 売却スケジュール
  const getSchedulePhase = (property: Property) => {
    const daysSinceListing = Math.floor(
      (Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )

    const phases = [
      { name: "掲載開始", days: 0, completed: true },
      { name: "問い合わせ対応", days: 7, completed: daysSinceListing >= 7 },
      { name: "内覧・交渉", days: 30, completed: property.status === "NEGOTIATING" || property.status === "SOLD" },
      { name: "契約手続き", days: 60, completed: property.status === "SOLD" },
      { name: "引渡し", days: 90, completed: false },
    ]

    return phases
  }

  if (properties.length === 0) return null

  const activeProperties = properties.filter(p => p.status !== "SOLD")

  if (activeProperties.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h3 className="text-base font-medium text-gray-900">やることサポート</h3>
      </div>

      <div className="space-y-4">
        {activeProperties.map((property) => {
          const actions = getActionsForProperty(property)
          const isExpanded = expandedProperty === property.id
          const phases = getSchedulePhase(property)

          return (
            <div key={property.id} className="border border-gray-100 rounded-lg">
              <button
                onClick={() => setExpandedProperty(isExpanded ? null : property.id)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(actions[0]?.priority || "low")}`}>
                    {getPriorityLabel(actions[0]?.priority || "low")}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {property.title}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="p-4 pt-0 space-y-4">
                  {/* スケジュール表示 */}
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs font-medium text-gray-600 mb-2">売却スケジュール</p>
                    <div className="flex items-center justify-between">
                      {phases.map((phase, index) => (
                        <div key={phase.name} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                phase.completed
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                            >
                              {phase.completed ? "✓" : index + 1}
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">
                              {phase.name}
                            </span>
                          </div>
                          {index < phases.length - 1 && (
                            <div
                              className={`w-8 h-0.5 mx-1 ${
                                phase.completed ? "bg-green-500" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* アクションリスト */}
                  <div className="space-y-2">
                    {actions.map((action) => (
                      <div
                        key={action.id}
                        className={`p-3 rounded border ${getPriorityColor(action.priority)}`}
                      >
                        <p className="text-sm font-medium mb-1">{action.title}</p>
                        <p className="text-xs opacity-80 mb-2">{action.description}</p>
                        {action.action && (
                          action.action.href ? (
                            <Link
                              href={action.action.href}
                              className="inline-block text-xs px-3 py-1 bg-white rounded border border-current hover:bg-gray-50 transition-colors"
                            >
                              {action.action.label}
                            </Link>
                          ) : (
                            <button
                              onClick={action.action.onClick}
                              disabled={aiLoading === property.id}
                              className="text-xs px-3 py-1 bg-white rounded border border-current hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {aiLoading === property.id ? "分析中..." : action.action.label}
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>

                  {/* AI価格提案 */}
                  {priceSuggestion[property.id] && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-xs font-medium text-blue-800 mb-1">AI価格分析</p>
                      <p className="text-sm text-blue-700">{priceSuggestion[property.id]}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
