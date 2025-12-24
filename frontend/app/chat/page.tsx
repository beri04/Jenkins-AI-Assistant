import { PageTransition } from "@/components/page-transition"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <PageTransition>
      <ChatInterface />
    </PageTransition>
  )
}
