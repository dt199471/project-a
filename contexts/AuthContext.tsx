"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  loginId: string
  name: string | null
  email: string | null
  phone: string | null
  bio: string | null
  image: string | null
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (loginId: string) => Promise<{ success: boolean; error?: string }>
  register: (loginId: string, name?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ローカルストレージからユーザー情報を復元
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (loginId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch {
      return { success: false, error: "ログインに失敗しました" }
    }
  }

  const register = async (loginId: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, name }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch {
      return { success: false, error: "登録に失敗しました" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}




