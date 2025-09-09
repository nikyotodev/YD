import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PersonalizedScenarioLesson } from "@/components/PersonalizedScenarioLesson";
export default function AIScenarios() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <PersonalizedScenarioLesson />
      </main>
      <Footer />
    </div>
  );
}
