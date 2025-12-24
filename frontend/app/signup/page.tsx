import { SignupForm } from "@/components/signup-form"
import { PageTransition } from "@/components/page-transition"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle grid pattern matching hero */}
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

          {/* Teal gradient - more visible */}
          <div className="absolute top-[15%] left-[20%] w-[60%] aspect-square">
            <div className="absolute inset-0 opacity-[0.25] blur-[140px] bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.6)_0%,transparent_70%)]" />
          </div>

          {/* Orange warm accent - right side */}
          <div className="absolute top-[30%] right-[15%] w-[50%] aspect-square">
            <div className="absolute inset-0 opacity-[0.28] blur-[120px] bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.65)_0%,transparent_68%)]" />
          </div>

          {/* Green accent - bottom left */}
          <div className="absolute bottom-[10%] left-[10%] w-[45%] aspect-square">
            <div className="absolute inset-0 opacity-[0.22] blur-[130px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.55)_0%,transparent_72%)]" />
          </div>

          {/* Additional teal wave for depth */}
          <div className="absolute bottom-[30%] right-[25%] w-[48%] aspect-square">
            <div className="absolute inset-0 opacity-[0.19] blur-[135px] bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.52)_0%,transparent_73%)]" />
          </div>
        </div>

        {/* Back to home link */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        <SignupForm />
      </div>
    </PageTransition>
  )
}
