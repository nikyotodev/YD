"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  BookOpen,
  Headphones,
  PenTool,
  MessageSquare,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";
interface ExamTip {
  skill: string;
  icon: typeof BookOpen;
  tips: string[];
  strategies: string[];
  commonMistakes: string[];
  timeManagement: string;
}
const examTips: ExamTip[] = [
  {
    skill: "Чтение (Lesen)",
    icon: BookOpen,
    tips: [
      "Читайте вопрос перед текстом, чтобы знать, что искать",
      "Используйте технику skimming для общего понимания",
      "Ищите ключевые слова и синонимы в тексте",
      "Не застревайте на незнакомых словах - понимайте из контекста",
      "Обращайте внимание на связующие слова (aber, jedoch, außerdem)",
      "В последнем задании читайте все варианты ответов внимательно"
    ],
    strategies: [
      "Первый проход: общее понимание текста",
      "Второй проход: поиск конкретной информации",
      "Подчёркивайте важные части в тексте",
      "Исключайте явно неправильные ответы",
      "Оставляйте сложные вопросы на конец"
    ],
    commonMistakes: [
      "Чтение всего текста слишком внимательно",
      "Попытка понять каждое незнакомое слово",
      "Невнимательное чтение вопросов",
      "Выбор ответа по одному ключевому слову",
      "Игнорирование отрицаний в тексте"
    ],
    timeManagement: "65 минут: 15 мин на задание 1, 20 мин на задание 2, 20 мин на задание 3, 10 мин на проверку"
  },
  {
    skill: "Аудирование (Hören)",
    icon: Headphones,
    tips: [
      "Читайте вопросы перед прослушиванием аудио",
      "Сосредоточьтесь на ключевой информации, а не на каждом слове",
      "Записывайте краткие заметки во время прослушивания",
      "Используйте паузы между заданиями для подготовки",
      "Не паникуйте, если пропустили что-то - слушайте дальше",
      "Обращайте внимание на интонацию и эмоции говорящих"
    ],
    strategies: [
      "Предугадывайте содержание по контексту",
      "Концентрируйтесь на числах, именах, датах",
      "Используйте сокращения для быстрых заметок",
      "Следите за сигнальными словами (erstens, außerdem, jedoch)",
      "Доверяйте первому впечатлению при выборе ответа"
    ],
    commonMistakes: [
      "Попытка понять каждое слово",
      "Остановка на одном пропущенном моменте",
      "Игнорирование вопросов перед прослушиванием",
      "Неиспользование пауз для подготовки",
      "Изменение правильного ответа без веской причины"
    ],
    timeManagement: "40 минут: используйте каждую паузу, не тратьте время на сомнения"
  },
  {
    skill: "Письмо (Schreiben)",
    icon: PenTool,
    tips: [
      "Всегда планируйте структуру текста перед написанием",
      "Используйте формальный стиль в официальных письмах",
      "Включайте все пункты из задания в свой ответ",
      "Используйте разнообразную лексику и грамматические структуры",
      "Следите за длиной текста (150-200 слов каждое задание)",
      "Оставляйте время на проверку орфографии и грамматики"
    ],
    strategies: [
      "Формальное письмо: обращение → введение → основная часть → заключение → подпись",
      "Эссе: введение с тезисом → аргументы за → аргументы против → заключение",
      "Используйте связующие слова для логичности",
      "Приводите конкретные примеры для поддержки аргументов",
      "Варьируйте длину предложений для лучшего стиля"
    ],
    commonMistakes: [
      "Неправильное обращение в формальных письмах",
      "Смешивание формального и неформального стиля",
      "Игнорирование всех пунктов задания",
      "Слишком короткие или длинные тексты",
      "Отсутствие проверки на ошибки"
    ],
    timeManagement: "75 минут: 5 мин планирование, 30 мин первое задание, 30 мин второе задание, 10 мин проверка"
  },
  {
    skill: "Говорение (Sprechen)",
    icon: MessageSquare,
    tips: [
      "Говорите чётко и не торопитесь",
      "Используйте паузы для обдумывания ответа",
      "Поддерживайте зрительный контакт с экзаменатором",
      "Не бойтесь исправлять свои ошибки",
      "Используйте жесты для поддержки речи",
      "Будьте вежливы и проявляйте интерес к собеседнику"
    ],
    strategies: [
      "Задание 1: активно участвуйте в планировании, предлагайте идеи",
      "Задание 2: структурируйте презентацию (введение → основная часть → заключение)",
      "Задание 3: высказывайте своё мнение и аргументируйте его",
      "Используйте фразы для выражения мнения (Meiner Meinung nach...)",
      "Задавайте уточняющие вопросы партнёру"
    ],
    commonMistakes: [
      "Молчание при незнании ответа",
      "Монополизация разговора",
      "Игнорирование партнёра по экзамену",
      "Слишком быстрая или медленная речь",
      "Использование только простых предложений"
    ],
    timeManagement: "15 минут: 4 мин задание 1, 6 мин задание 2, 5 мин задание 3"
  }
];
const generalTips = [
  {
    icon: Clock,
    title: "Управление временем",
    description: "Распределяйте время равномерно между заданиями и оставляйте минуты на проверку"
  },
  {
    icon: Target,
    title: "Стратегический подход",
    description: "Сначала делайте лёгкие задания, затем возвращайтесь к сложным"
  },
  {
    icon: Zap,
    title: "Уверенность",
    description: "Доверяйте своим знаниям и первому впечатлению при выборе ответов"
  },
  {
    icon: CheckCircle,
    title: "Подготовка к дню X",
    description: "Приходите отдохнувшими, приносите все документы и не забудьте водy"
  }
];
export function GoetheExamTips() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <Lightbulb className="h-4 w-4 mr-2" />
              Экспертные советы
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-6 gradient-text">
              Секреты успешной сдачи экзамена
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Проверенные стратегии и лайфхаки от экспертов, которые помогут вам максимально
              эффективно подойти к каждому модулю экзамена Гёте.
            </p>
          </motion.div>
        </div>
        {/* Tips for Each Skill */}
        <div className="space-y-12 mb-16">
          {examTips.map((skillTips, index) => (
            <motion.div
              key={skillTips.skill}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all group border-2 hover:border-german-red/30 dark:hover:border-dark-theme-pink/30">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-german-red/10 to-german-gold/10 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20">
                      <skillTips.icon className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl group-hover:text-german-red dark:group-hover:text-dark-theme-pink transition-colors">
                        {skillTips.skill}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {skillTips.timeManagement}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Practical Tips */}
                    <div>
                      <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Практические советы
                      </h4>
                      <ul className="space-y-3">
                        {skillTips.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-3">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Strategies */}
                    <div>
                      <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        Стратегии выполнения
                      </h4>
                      <ul className="space-y-3">
                        {skillTips.strategies.map((strategy, strategyIndex) => (
                          <li key={strategyIndex} className="text-sm text-muted-foreground flex items-start gap-3">
                            <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Common Mistakes */}
                    <div>
                      <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Типичные ошибки
                      </h4>
                      <ul className="space-y-3">
                        {skillTips.commonMistakes.map((mistake, mistakeIndex) => (
                          <li key={mistakeIndex} className="text-sm text-muted-foreground flex items-start gap-3">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* General Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-german-red/5 to-german-gold/5 dark:from-dark-theme-purple/10 dark:to-dark-theme-pink/10 rounded-2xl p-8 border border-german-red/20 dark:border-dark-theme-pink/20">
            <h3 className="text-2xl font-bold text-center mb-8">
              Общие рекомендации для экзамена
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {generalTips.map((tip, index) => (
                <div key={index} className="text-center group">
                  <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-4 mx-auto w-fit group-hover:scale-110 transition-transform">
                    <tip.icon className="h-8 w-8 text-german-red dark:text-dark-theme-pink" />
                  </div>
                  <h4 className="font-semibold mb-2">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
            {/* Pro Tips */}
            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                Pro-советы от экспертов:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">📚 За неделю до экзамена:</p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Повторите только основные правила</li>
                    <li>• Сделайте 1-2 полных пробных теста</li>
                    <li>• Подготовьте документы и маршрут</li>
                    <li>• Настройтесь психологически</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">🎯 В день экзамена:</p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Приходите за 30 минут до начала</li>
                    <li>• Принесите воду и лёгкий перекус</li>
                    <li>• Читайте инструкции внимательно</li>
                    <li>• Сохраняйте спокойствие</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
