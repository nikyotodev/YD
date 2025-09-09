import { AnimatedAIChat } from "@/components/AnimatedAIChat";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <AnimatedAIChat />
      </main>
      <Footer />
    </div>
  );
}
