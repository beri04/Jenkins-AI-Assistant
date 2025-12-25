"use client"

import { Button } from "@/components/ui/button"
import { Terminal, User } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"

export function HeroSection() {
  const [user, setUser] = useState<null | {
    username: string
    email: string
  }>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showUserTooltip, setShowUserTooltip] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetch("http://localhost:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized")
        return res.json()
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center bg-background"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Primary teal wave - large and prominent */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
          linear-gradient(to right, rgba(20,184,166,0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(20,184,166,0.15) 1px, transparent 1px)
        `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary teal wave - large and prominent */}
        <div
          className={`absolute top-[10%] right-[8%] w-[70%] aspect-square transition-all duration-[2000ms] ease-out ${isHovering ? "scale-110 opacity-100" : "scale-100 opacity-100"}`}
        >
          <div className="absolute inset-0 opacity-[0.25] blur-[140px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.6)_0%,transparent_65%)]" />
        </div>

        {/* Orange glow wave - top left, warm accent */}
        <div
          className={`absolute top-[5%] left-[10%] w-[55%] aspect-square transition-all duration-[2500ms] ease-out ${isHovering ? "scale-105 opacity-100" : "scale-100 opacity-100"}`}
        >
          <div className="absolute inset-0 opacity-[0.28] blur-[130px] bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.65)_0%,transparent_68%)]" />
        </div>

        {/* Secondary green wave - center left */}
        <div
          className={`absolute top-[40%] left-[5%] w-[60%] aspect-square transition-all duration-[2200ms] ease-out ${isHovering ? "scale-115 -translate-x-4" : "scale-100 translate-x-0"}`}
        >
          <div className="absolute inset-0 opacity-[0.22] blur-[150px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.55)_0%,transparent_70%)]" />
        </div>

        {/* Orange secondary wave - right side, warm glow */}
        <div
          className={`absolute top-[35%] right-[15%] w-[58%] aspect-square transition-all duration-[2800ms] ease-out ${isHovering ? "scale-108 translate-x-6" : "scale-100 translate-x-0"}`}
        >
          <div className="absolute inset-0 opacity-[0.24] blur-[125px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.6)_0%,transparent_67%)]" />
        </div>

        {/* Cyan accent wave - bottom right for color depth */}
        <div
          className={`absolute bottom-[12%] right-[8%] w-[52%] aspect-square transition-all duration-[2400ms] ease-out ${isHovering ? "scale-112 translate-y-4" : "scale-100 translate-y-0"}`}
        >
          <div className="absolute inset-0 opacity-[0.2] blur-[115px] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.5)_0%,transparent_72%)]" />
        </div>

        {/* Orange warm glow - bottom left, creates depth */}
        <div
          className={`absolute bottom-[5%] left-[12%] w-[50%] aspect-square transition-all duration-[2600ms] ease-out ${isHovering ? "scale-110 -translate-y-6" : "scale-100 translate-y-0"}`}
        >
          <div className="absolute inset-0 opacity-[0.26] blur-[110px] bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.62)_0%,transparent_70%)]" />
        </div>

        {/* Central warm amber glow - subtle layering */}
        <div
          className={`absolute top-[50%] left-[45%] w-[45%] aspect-square transition-all duration-[3000ms] ease-out ${isHovering ? "scale-115 opacity-90" : "scale-100 opacity-100"}`}
        >
          <div className="absolute inset-0 opacity-[0.18] blur-[160px] bg-[radial-gradient(circle_at_center,rgba(253,186,116,0.5)_0%,transparent_75%)]" />
        </div>

        {/* Additional teal wave for organic layering */}
        <div
          className={`absolute bottom-[30%] left-[35%] w-[48%] aspect-square transition-all duration-[2300ms] ease-out ${isHovering ? "scale-108 translate-x-8" : "scale-100 translate-x-0"}`}
        >
          <div className="absolute inset-0 opacity-[0.19] blur-[135px] bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.52)_0%,transparent_73%)]" />
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-8 left-8 z-50 flex flex-col gap-1.5 p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
        aria-label="Menu"
      >
        <span className="w-6 h-0.5 bg-primary/60 group-hover:bg-primary transition-colors duration-200"></span>
        <span className="w-6 h-0.5 bg-primary/60 group-hover:bg-primary transition-colors duration-200"></span>
        <span className="w-6 h-0.5 bg-primary/60 group-hover:bg-primary transition-colors duration-200"></span>
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-24">
        <div className="absolute top-8 right-8">
          {user ? (
            <div className="relative">
              <Link href="/profile">
                <div
                  className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-primary/30 hover:scale-110 hover:brightness-125 hover:border-primary/60"
                  onMouseEnter={() => setShowUserTooltip(true)}
                  onMouseLeave={() => setShowUserTooltip(false)}
                >
                  <User className="w-5 h-5 text-primary" />
                </div>
              </Link>
              {/* Tooltip with animation */}
              {showUserTooltip && (
                <div className="absolute top-12 right-0 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 whitespace-nowrap z-50">
                  <p className="text-sm font-medium text-foreground">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">View Profile</p>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="
                bg-transparent text-white
                border border-green-700/40
                hover:bg-[rgb(15,41,9)]
                hover:font-semibold
                hover:ring-1 hover:ring-green-700/50
                transition-all duration-200
              "
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        <div className="max-w-4xl lg:ml-16">
          {/* Badge - engineering-first styling */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-7">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-mono text-primary tracking-tight">Built for Jenkins Developers</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-7 text-balance leading-[1.08]">
            Parse and Understand <span className="text-primary">Jenkinsfiles</span>
            <span className="block mt-1">Without Context Switching</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-11 leading-relaxed">
            AI-powered assistant that uses{" "}
            <span className="text-foreground font-medium">retrieval-augmented generation</span> to analyze your CI/CD
            pipelines, explain Groovy syntax, and search Jenkins documentation instantly.
          </p>

          {/* CTA - single focused action */}
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <button className="text-base px-10 py-5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-semibold shadow-[0_8px_32px_rgba(34,211,238,0.4)] hover:shadow-[0_12px_40px_rgba(34,211,238,0.5)] transition-all duration-300">
                Try the Jenkins AI Assistant
              </button>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            <p className="text-sm text-muted-foreground font-mono">jenkins-ai explain --file pipeline.groovy</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
    </section>
  )
}
