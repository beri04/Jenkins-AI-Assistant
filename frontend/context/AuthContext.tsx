"use client"

import React, { createContext, useEffect, useState } from "react"

export interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      setLoading(false)
      return
    }

    hydrateUser(storedToken)
  }, [])

  const hydrateUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Invalid token")

      const data = await res.json()
      setUser(data)
      setToken(token)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (token: string) => {
    localStorage.setItem("token", token)
    setLoading(true)
    await hydrateUser(token)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
