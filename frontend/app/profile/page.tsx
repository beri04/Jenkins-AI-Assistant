"use client"

import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // Clear login state
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    // Redirect to home
    router.push("/")
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradients matching hero section */}
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
          <div className="absolute top-[10%] right-[8%] w-[70%] aspect-square">
            <div className="absolute inset-0 opacity-[0.18] blur-[140px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.6)_0%,transparent_65%)]" />
          </div>
          <div className="absolute top-[5%] left-[10%] w-[55%] aspect-square">
            <div className="absolute inset-0 opacity-[0.2] blur-[130px] bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.65)_0%,transparent_68%)]" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            ← Back to home
          </Link>

          {/* Profile Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card/40 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
              {/* User Icon */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">Jenkins Dev</h1>
                  <p className="text-muted-foreground">Developer Account</p>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Username</p>
                    <p className="text-sm font-medium text-foreground">jenkinsdev</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">dev@jenkins.ai</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member since</p>
                    <p className="text-sm font-medium text-foreground">January 2026</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 hover:border-red-600/60 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-xl font-bold text-foreground mb-2">Confirm Logout</h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to logout? You'll need to login again to access the Jenkins AI Assistant.
              </p>

              <div className="flex gap-3">
                <Button onClick={() => setShowLogoutConfirm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleLogout} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
