"use client"
import { PageTransition } from "@/components/page-transition"
import { ChatInterface } from "@/components/chat-interface"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState("professional")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const existingSession = localStorage.getItem("session_id")
    if (existingSession) {
      setReady(true)
      return
    }

    // create session lazily
    fetch("http://localhost:8000/ai/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("session_id", data.session_id)
        localStorage.setItem("mode", data.mode)
        setMode(data.mode)
        setReady(true)
      })
      .catch(() => {
        console.error("Failed to create session")
        router.push("/login")
      })
  }, [router])

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Initializing chat…
      </div>
    )
  }
  return (
    <PageTransition>
      <ChatInterface />
    </PageTransition>
  )
}
