import Navbar from "@/components/Navbar"
import ChatBot from "@/components/ai/ChatBot"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <ChatBot />
    </>
  )
}





