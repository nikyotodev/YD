import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoetheExam } from "@/components/GoetheExam";
import { getExamConfig } from "@/types/exams";
export default function GoetheA2AdultsPage() {
  const examConfig = getExamConfig("a2-adults");
  if (!examConfig) {
    return <div>Экзамен не найден</div>;
  }
  return (
    <div className="min-h-screen">
      <Header />
      <GoetheExam examConfig={examConfig} />
      <Footer />
    </div>
  );
}
