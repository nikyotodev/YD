import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoetheExam } from "@/components/GoetheExam";
import { getExamConfig } from "@/types/exams";
export default function GoetheC1Page() {
  const examConfig = getExamConfig("c1-all");
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
