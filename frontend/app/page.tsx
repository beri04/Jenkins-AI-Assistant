import { HeroSection } from "@/components/hero-section"
import { PageTransition } from "@/components/page-transition"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col">
        <HeroSection />
        <Footer />
      </main>
    </PageTransition>
  )
}
