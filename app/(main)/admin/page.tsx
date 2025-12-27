"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface Stats {
  totalUsers: number
  totalProperties: number
  totalMessages: number
  activeProperties: number
  soldProperties: number
  recentUsers: number
  recentProperties: number
}

interface User {
  id: string
  loginId: string
  name: string | null
  email: string | null
  phone: string | null
  isAdmin: boolean
  createdAt: string
  _count: {
    properties: number
    sentMessages: number
  }
}

interface Property {
  id: string
  title: string
  price: string
  address: string
  city: string
  prefecture: string
  status: string
  createdAt: string
  user: {
    id: string
    loginId: string
    name: string | null
  }
  _count: {
    messages: number
    favorites: number
  }
}

interface SystemSettings {
  id: string
  chatModel: string
  systemPrompt: string
  reasoningEffort: string
  webSearchEnabled: boolean
}

interface ModelOption {
  id: string
  name: string
  description: string
}

type Tab = "dashboard" | "users" | "properties" | "settings"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([])
  const [reasoningEfforts, setReasoningEfforts] = useState<ModelOption[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData()
    }
  }, [user, activeTab])

  const fetchData = async () => {
    if (!user) return

    setDataLoading(true)
    setError(null)

    try {
      const headers = { "x-user-id": user.id }

      if (activeTab === "dashboard") {
        const res = await fetch("/api/admin/stats", { headers })
        if (!res.ok) throw new Error("統計情報の取得に失敗しました")
        setStats(await res.json())
      } else if (activeTab === "users") {
        const res = await fetch("/api/admin/users", { headers })
        if (!res.ok) throw new Error("ユーザー一覧の取得に失敗しました")
        setUsers(await res.json())
      } else if (activeTab === "properties") {
        const res = await fetch("/api/admin/properties", { headers })
        if (!res.ok) throw new Error("物件一覧の取得に失敗しました")
        setProperties(await res.json())
      } else if (activeTab === "settings") {
        const res = await fetch("/api/admin/settings", { headers })
        if (!res.ok) throw new Error("設定の取得に失敗しました")
        const data = await res.json()
        setSettings(data.settings)
        setAvailableModels(data.availableModels)
        setReasoningEfforts(data.reasoningEfforts)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setDataLoading(false)
    }
  }

  const handleDeleteUser = async (targetUserId: string) => {
    if (!user || !confirm("このユーザーを削除しますか？関連するデータもすべて削除されます。")) return

    try {
      const res = await fetch(`/api/admin/users?id=${targetUserId}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setUsers(users.filter((u) => u.id !== targetUserId))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleToggleAdmin = async (targetUserId: string, currentIsAdmin: boolean) => {
    if (!user) return

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ targetUserId, isAdmin: !currentIsAdmin }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setUsers(users.map((u) =>
        u.id === targetUserId ? { ...u, isAdmin: !currentIsAdmin } : u
      ))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!user || !confirm("この物件を削除しますか？")) return

    try {
      const res = await fetch(`/api/admin/properties?id=${propertyId}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setProperties(properties.filter((p) => p.id !== propertyId))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleChangePropertyStatus = async (propertyId: string, newStatus: string) => {
    if (!user) return

    try {
      const res = await fetch("/api/admin/properties", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ propertyId, status: newStatus }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setProperties(properties.map((p) =>
        p.id === propertyId ? { ...p, status: newStatus } : p
      ))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSaveSettings = async () => {
    if (!user || !settings) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          chatModel: settings.chatModel,
          systemPrompt: settings.systemPrompt,
          reasoningEffort: settings.reasoningEffort,
          webSearchEnabled: settings.webSearchEnabled,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setSuccess("設定を保存しました")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("ja-JP").format(parseInt(price))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP")
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: "公開中",
      NEGOTIATING: "交渉中",
      SOLD: "売却済",
      DRAFT: "下書き",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      NEGOTIATING: "bg-yellow-100 text-yellow-800",
      SOLD: "bg-gray-100 text-gray-800",
      DRAFT: "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">アクセス権限がありません</h1>
          <p className="text-gray-500">このページは管理者のみアクセスできます。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">管理者ダッシュボード</h1>
          <p className="text-gray-500 mt-1">システムの管理と監視</p>
        </div>

        {/* タブ */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "dashboard" as Tab, label: "ダッシュボード" },
              { id: "users" as Tab, label: "ユーザー管理" },
              { id: "properties" as Tab, label: "物件管理" },
              { id: "settings" as Tab, label: "AI設定" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-6">
            {success}
          </div>
        )}

        {dataLoading ? (
          <div className="text-center py-12 text-gray-500">読み込み中...</div>
        ) : (
          <>
            {/* ダッシュボード */}
            {activeTab === "dashboard" && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 border border-gray-200">
                  <div className="text-sm text-gray-500">総ユーザー数</div>
                  <div className="text-3xl font-light text-gray-900 mt-2">{stats.totalUsers}</div>
                  <div className="text-xs text-green-600 mt-2">+{stats.recentUsers} (過去7日)</div>
                </div>
                <div className="bg-white p-6 border border-gray-200">
                  <div className="text-sm text-gray-500">総物件数</div>
                  <div className="text-3xl font-light text-gray-900 mt-2">{stats.totalProperties}</div>
                  <div className="text-xs text-green-600 mt-2">+{stats.recentProperties} (過去7日)</div>
                </div>
                <div className="bg-white p-6 border border-gray-200">
                  <div className="text-sm text-gray-500">公開中物件</div>
                  <div className="text-3xl font-light text-gray-900 mt-2">{stats.activeProperties}</div>
                  <div className="text-xs text-gray-400 mt-2">売却済: {stats.soldProperties}</div>
                </div>
                <div className="bg-white p-6 border border-gray-200">
                  <div className="text-sm text-gray-500">総メッセージ数</div>
                  <div className="text-3xl font-light text-gray-900 mt-2">{stats.totalMessages}</div>
                </div>
              </div>
            )}

            {/* ユーザー管理 */}
            {activeTab === "users" && (
              <div className="bg-white border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ユーザー
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          連絡先
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          物件数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          登録日
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          権限
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{u.name || u.loginId}</div>
                            <div className="text-sm text-gray-500">@{u.loginId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{u.email || "-"}</div>
                            <div className="text-sm text-gray-500">{u.phone || "-"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {u._count.properties}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                              className={`px-2 py-1 text-xs rounded ${
                                u.isAdmin
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {u.isAdmin ? "管理者" : "一般"}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={u.id === user?.id}
                            >
                              {u.id === user?.id ? "-" : "削除"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 物件管理 */}
            {activeTab === "properties" && (
              <div className="bg-white border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          物件
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          価格
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          所有者
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          統計
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties.map((p) => (
                        <tr key={p.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{p.title}</div>
                            <div className="text-sm text-gray-500">{p.prefecture} {p.city}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥{formatPrice(p.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{p.user.name || p.user.loginId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>お気に入り: {p._count.favorites}</div>
                            <div>メッセージ: {p._count.messages}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={p.status}
                              onChange={(e) => handleChangePropertyStatus(p.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded border-0 ${getStatusColor(p.status)}`}
                            >
                              <option value="ACTIVE">公開中</option>
                              <option value="NEGOTIATING">交渉中</option>
                              <option value="SOLD">売却済</option>
                              <option value="DRAFT">下書き</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteProperty(p.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              削除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* AI設定 */}
            {activeTab === "settings" && settings && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">AIチャット設定</h2>

                  <div className="space-y-6">
                    {/* モデル選択 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        使用モデル
                      </label>
                      <select
                        value={settings.chatModel}
                        onChange={(e) => setSettings({ ...settings, chatModel: e.target.value })}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        {availableModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} - {model.description}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 推論レベル */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        推論レベル
                      </label>
                      <select
                        value={settings.reasoningEffort}
                        onChange={(e) => setSettings({ ...settings, reasoningEffort: e.target.value })}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        {reasoningEfforts.map((effort) => (
                          <option key={effort.id} value={effort.id}>
                            {effort.name} - {effort.description}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        推論レベルが高いほど詳細な回答が得られますが、応答時間が長くなります。
                      </p>
                    </div>

                    {/* Web検索 */}
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={settings.webSearchEnabled}
                          onChange={(e) => setSettings({ ...settings, webSearchEnabled: e.target.checked })}
                          className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Web検索を有効にする
                        </span>
                      </label>
                      <p className="mt-1 text-sm text-gray-500 ml-8">
                        最新の情報を検索して回答に反映します。推論レベルが「低」以上で利用可能です。
                      </p>
                    </div>

                    {/* システムプロンプト */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        システムプロンプト
                      </label>
                      <textarea
                        value={settings.systemPrompt}
                        onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                        rows={15}
                        className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
                        placeholder="AIアシスタントの役割と応答ルールを記述..."
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        AIアシスタントの性格、役割、応答ルールを定義します。
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="px-6 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "保存中..." : "設定を保存"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
