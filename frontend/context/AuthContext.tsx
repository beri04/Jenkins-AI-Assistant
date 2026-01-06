"use client"

import React, { createContext, useEffect, useState } from "react"

export interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔹 Check auth on app load (Bearer token)
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setLoading(false)
      return
    }

    hydrateUser(token)
  }, [])

  const hydrateUser = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) throw new Error()

      const data = await res.json()
      setUser(data)
    } catch {
      localStorage.removeItem("access_token")
      setUser(null)
    } finally {
      setLoading(false)
    } 
  }

  // 🔹 Login after receiving token from /auth/login
  const login = async (token: string) => {
    localStorage.setItem("access_token", token)
    await hydrateUser(token)
  }


  const logout = () => {
    localStorage.removeItem("access_token")
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
