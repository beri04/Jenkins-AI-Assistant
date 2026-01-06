"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { Home } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/useAuth"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}
type Session = {
  session_id: string
  created_at: string
  mode: string
}


export function ChatInterface() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [mode, setMode] = useState("professional")
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    content: string
  } | null>(null)

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/login")
      }
    }, [loading, user, router])


    useEffect(() => {
      const savedMode = localStorage.getItem("mode") 
      if (savedMode) setMode(savedMode)
    }, [])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const createNewSession = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error("Failed to create session")

    const data = await res.json()

    setSessions(prev => [
      {
        session_id: data.session_id,
        mode: data.mode,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ])

    setActiveSessionId(data.session_id)
    setMode(data.mode)
    setMessages([])

    return data.session_id
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  
  
  useEffect(() => {
  const fetchSessions = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) return

    const data = await res.json()
    setSessions(data)
    if (data.length > 0) {
      setActiveSessionId(data[0].session_id)
      loadSession(data[0].session_id)
    }

  }

  if (!loading && user) {
    fetchSessions()
  }
}, [loading, user])

  const loadSession = async (sessionId: string) => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    setActiveSessionId(sessionId)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/sessions/${sessionId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) return

    const data = await res.json()

    setMessages(
      data.map((m: any,idx: number) => ({
        id: `${sessionId}-${idx}-${Date.now()}`,
        role: m.role,
        content: m.content,
      }))
    )
  }
  const deleteSession = async (sessionId: string) => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Remove from UI
    setSessions((prev) => prev.filter((s) => s.session_id !== sessionId))

    // If deleted session was active → start fresh
    if (activeSessionId === sessionId) {
      createNewSession()
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      let sessionId = activeSessionId   // 👈 local variable

      if (!sessionId) {
        sessionId = await createNewSession()  // 👈 capture return
      }

      if (!sessionId) {
        throw new Error("Session creation failed")
      }

      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Missing token")
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/sessions/${sessionId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: userMessage.content,
          }),
        }
      )

      if (!res.ok) {
        throw new Error("Backend error")
      }

      const data = await res.json()

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Failed to send message. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }
  
  if (loading) {
    return null
  }
  
  return (
    <div className="flex h-screen bg-background">
      {/* ===== SIDEBAR ===== */}
      {showSidebar && (
        <div className="w-64 border-r border-border p-4 flex flex-col">
          <Button
            onClick={createNewSession}
            className="mb-4 w-full"
          >
            + New Chat
          </Button>

          <div className="flex-1 overflow-y-auto space-y-1">
            {sessions.map((s, index) => (
              <div
                key={s.session_id}
                className={`flex items-center justify-between px-3 py-2 rounded ${
                  activeSessionId === s.session_id
                    ? "bg-primary/20"
                    : "hover:bg-muted"
                }`}
              >
                <button
                  onClick={() => loadSession(s.session_id)}
                  className="flex-1 text-left text-sm"
                >
                  Chat {sessions.length - index}
                </button>

                <button
                  onClick={(e) =>{
                  e.stopPropagation()
                  if (confirm("Delete this chat?")) {
                    deleteSession(s.session_id)
                  }
                }}
                className="ml-2 text-muted-foreground hover:text-red-500"
                title="Delete chat"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {/* ===== CHAT AREA ===== */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-4 flex justify-between items-center">
          {/* LEFT: Home + Sidebar toggle */}
          <div className="flex items-center gap-4">
            {/* HOME BUTTON – BIG & LEFT */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Home className="h-6 w-6" />
              Home
            </button>

            {/* SHOW / HIDE CHATS – SMALLER */}
            <button
              onClick={() => setShowSidebar((prev) => !prev)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {showSidebar ? "Hide chats" : "Show chats"}
            </button>
          </div>

          {/* RIGHT: Mode selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Mode</span>
            <select
              value={mode}
              onChange={async (e) => {
                const newMode = e.target.value
                setMode(newMode)

                const token = localStorage.getItem("access_token")
                if (!activeSessionId || !token) return

                await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/ai/sessions/${activeSessionId}/set-mode`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ mode: newMode }),
                  }
                )
              }}
              className="rounded border px-2 py-1 text-sm bg-card"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="teaching">Teaching</option>
              <option value="rude">Rude DevOps</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>
        </div>
            {/* ===== FILE PREVIEW ===== */}
            {uploadedFile && (
              <div className="mx-auto max-w-3xl px-4 mb-4">
                <div className="rounded-lg border bg-card p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      📎 {uploadedFile.name}
                    </span>
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setUploadedFile(null)}
                    >
                      Remove
                    </button>
                  </div>

                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-muted-foreground text-xs">
                    {uploadedFile.content}
                  </pre>
                </div>
              </div>
            )}
    
            {/* Messages */}
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Jenkins AI Assistant
                  </h2>
                  <p className="text-muted-foreground">
                    Ask me anything about your Jenkinsfiles and CI/CD pipelines
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border text-card-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* ===== INPUT AREA ===== */}
        <div className="border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your Jenkinsfile…"
                disabled={isLoading}
                className="flex-1 rounded-lg border border-input bg-card px-4 py-3 text-sm"
              />

              <input
                type="file"
                id="file-upload"
                accept=".txt,.md,.log,.json,.yaml,.yml,.adoc,.groovy"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file || !activeSessionId) return

                  // 🔹 1. Read file for preview (CLIENT SIDE)
                  const reader = new FileReader()
                  reader.onload = () => {
                    const text = reader.result as string
                    setUploadedFile({
                      name: file.name,
                      content: text.slice(0, 1500), // limit preview
                    })
                  }
                  reader.readAsText(file)
                  
                  
                  // 🔹 2. Upload to backend (EXISTING LOGIC)
                  const token = localStorage.getItem("access_token")
                  if (!token) return

                  const formData = new FormData()
                  formData.append("file", file)

                  await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/ai/sessions/${activeSessionId}/upload-pipeline`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      body: formData,
                    }
                  )

                  alert("File uploaded and indexed successfully")
                }}
              />

              <Button type="submit" disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("file-upload")?.click()
                }
              >
                Upload
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}