"use client"

import { X, Home, MessageSquare, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-card/95 backdrop-blur-lg border-r border-primary/20 z-[70] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary/20">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                >
                  <Home className="w-5 h-5 text-primary" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>Chat</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                >
                  <LogIn className="w-5 h-5 text-primary" />
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-foreground transition-colors"
                >
                  <UserPlus className="w-5 h-5 text-primary" />
                  <span>Sign Up</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer in sidebar */}
          <div className="p-6 border-t border-primary/20">
            <p className="text-sm text-muted-foreground text-center">Jenkins AI Assistant</p>
            <p className="text-xs text-muted-foreground/60 text-center mt-1">Powered by RAG Technology</p>
          </div>
        </div>
      </div>
    </>
  )
}
