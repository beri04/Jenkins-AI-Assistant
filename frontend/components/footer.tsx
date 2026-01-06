import Link from "next/link"
import { Terminal } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-primary/20 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Jenkins AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered assistant for understanding Jenkins pipelines and CI/CD workflows
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Try Assistant
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#documentation"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 Saksham. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="https://github.com/beri04" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </Link>
              <Link href="https://x.com/saksham573" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                X
              </Link>
              <Link href="https://www.linkedin.com/in/saksham-beri-32543b301" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
