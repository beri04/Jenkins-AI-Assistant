"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const [mode, setMode] = useState("professional")

    useEffect(() => {
      const savedMode = localStorage.getItem("mode") 
      if (savedMode) setMode(savedMode)
    }, [])
    useEffect(() => {
      const token = localStorage.getItem("token")
      const sessionId = localStorage.getItem("session_id")
      if (!token || !sessionId) return

      fetch(`http://localhost:8000/ai/sessions/${sessionId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setMessages(
            data.map((m: any) => ({
              id: crypto.randomUUID(),
              role: m.role,
              content: m.content,
            }))
          )
        })
    }, [])


  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    // show user message immediately
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const sessionId = localStorage.getItem("session_id")
      const token = localStorage.getItem("token")

      if (!sessionId || !token) {
        throw new Error("Missing session or token")
      }

      const res = await fetch(
        `http://localhost:8000/ai/sessions/${sessionId}/chat`,
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
        content: data.content, // MUST match backend response
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Error connecting to backend",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex-1 overflow-y-auto">

        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-4 flex justify-end items-center gap-2">
            <span className="text-xs text-muted-foreground">Mode</span>
            <select
              value={mode}
              onChange={async (e) => {
                const newMode = e.target.value
                setMode(newMode)
                localStorage.setItem("mode", newMode)

                const sessionId = localStorage.getItem("session_id")
                const token = localStorage.getItem("token")

                if (!sessionId || !token) {
                  console.error("Missing session or token")
                  return
                }
                await fetch(
                  `http://localhost:8000/ai/sessions/${sessionId}/set-mode`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify
                    ({ 
                      mode: newMode
                     }),
                  }
                )
              }}
              className="rounded border px-2 py-1 text-sm bg-card"
            >

              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="teaching">Teaching</option>
              <option value="rude">Rude DevOps</option>
            </select>
          </div>

          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">Jenkins AI Assistant</h2>
                <p className="text-muted-foreground">Ask me anything about your Jenkinsfiles and CI/CD pipelines</p>
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
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-card-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your Jenkinsfile…"
              disabled={isLoading}
              className="flex-1 rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            {/* File upload */}
            <input
              type="file"
              id="file-upload"
              accept=".txt,.md,.log,.json,.yaml,.yml,.adoc,.groovy"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return

                const token = localStorage.getItem("token")
                if (!token) return

                const formData = new FormData()
                formData.append("file", file)

                const res = await fetch("http://localhost:8000/ai/sessions/${sessionId}/upload-pipeline", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                })
                if (!res.ok) {
                  alert("File uploaded successfully")
                }

                alert("File uploaded and indexed successfully")

              }}
            />



            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-green-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Upload
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              variant="outline"
              onClick={async () => {
                const token = localStorage.getItem("token")
                if (!token) return

                const res = await fetch("http://localhost:8000/ai/sessions", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })

                const data = await res.json()

                // reset chat state
                localStorage.setItem("session_id", data.session_id)
                localStorage.setItem("mode", data.mode)

                setMode(data.mode)
                setMessages([]) // 🔥 clear UI
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
              }}
            >
              New Chat
            </Button>

          </form>
        </div>
      </div>
    </div>
  )
}
