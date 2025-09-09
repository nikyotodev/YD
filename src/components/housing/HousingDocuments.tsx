"use client";
import { memo, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Users,
  Home,
  Shield,
  Calculator,
  Briefcase
} from "lucide-react";
const HousingDocuments = memo(function HousingDocuments() {
  const [activeTab, setActiveTab] = useState('documents');
  const documents = useMemo(() => [
    {
      category: "Основные документы",
      items: [
        {
          name: "Паспорт или ID",
          description: "Действующий документ, удостоверяющий личность",
          required: true,
          icon: FileText
        },
        {
          name: "Справка о доходах (Einkommensnachweise)",
          description: "Справки о зарплате за последние 3 месяца или трудовой договор",
          required: true,
          icon: CreditCard
        },
        {
          name: "Справка из Schufa",
          description: "Справка о кредитной истории (не старше 3 месяцев)",
          required: true,
          icon: Shield
        },
        {
          name: "Справка о регистрации (Meldebescheinigung)",
          description: "Подтверждение текущего места жительства",
          required: true,
          icon: Home
        }
      ]
    },
    {
      category: "Дополнительные документы",
      items: [
        {
          name: "Справка от предыдущего арендодателя",
          description: "Подтверждение об отсутствии задолженностей",
          required: false,
          icon: CheckCircle
        },
        {
          name: "Автобиография (CV)",
          description: "Краткая информация о себе, работе и увлечениях",
          required: false,
          icon: Briefcase
        },
        {
          name: "Банковские выписки",
          description: "Выписки за последние 3 месяца",
          required: false,
          icon: Calculator
        },
        {
          name: "Поручители",
          description: "Информация о людях, готовых выступить поручителями",
          required: false,
          icon: Users
        }
      ]
    }
  ], []);
  const searchProcess = useMemo(() => [
    {
      step: 1,
      title: "Подготовка документов",
      description: "Соберите все необходимые документы заранее",
      duration: "1-2 недели",
      tips: [
        "Закажите справку Schufa онлайн",
        "Подготовьте папку с документами",
        "Сделайте переводы на немецкий язык",
        "Подготовьте мотивационное письмо"
      ]
    },
    {
      step: 2,
      title: "Поиск и фильтрация",
      description: "Активный поиск подходящих вариантов",
      duration: "2-8 недель",
      tips: [
        "Используйте несколько платформ одновременно",
        "Настройте оповещения о новых объявлениях",
        "Расширьте географию поиска",
        "Рассмотрите временные варианты"
      ]
    },
    {
      step: 3,
      title: "Подача заявок",
      description: "Быстрое реагирование на интересные предложения",
      duration: "В день объявления",
      tips: [
        "Отвечайте в течение 2-3 часов",
        "Приложите все документы сразу",
        "Напишите персональное сообщение",
        "Предложите встретиться в удобное время"
      ]
    },
    {
      step: 4,
      title: "Просмотры и собеседования",
      description: "Встречи с арендодателями и осмотр квартир",
      duration: "1-2 недели",
      tips: [
        "Приходите точно в назначенное время",
        "Задавайте правильные вопросы",
        "Демонстрируйте надежность и ответственность",
        "Будьте готовы принять решение сразу"
      ]
    },
    {
      step: 5,
      title: "Заключение договора",
      description: "Подписание договора аренды и передача ключей",
      duration: "1-2 дня",
      tips: [
        "Внимательно прочитайте договор",
        "Уточните все условия",
        "Подготовьте залог (Kaution)",
        "Оформите страховку квартиры"
      ]
    }
  ], []);
  const commonMistakes = useMemo(() => [
    {
      mistake: "Неполный пакет документов",
      consequence: "Заявка будет отклонена или рассмотрена в последнюю очередь",
      solution: "Подготовьте все документы заранее и держите их в цифровом виде"
    },
    {
      mistake: "Медленная реакция на объявления",
      consequence: "Упускаете хорошие варианты из-за высокой конкуренции",
      solution: "Настройте уведомления и отвечайте в течение 2-3 часов"
    },
    {
      mistake: "Слишком узкие критерии поиска",
      consequence: "Ограниченное количество подходящих вариантов",
      solution: "Будьте гибкими в требованиях, особенно на первое время"
    },
    {
      mistake: "Игнорирование WG и временных вариантов",
      consequence: "Длительный поиск без результата",
      solution: "Рассмотрите временное жилье как промежуточный вариант"
    }
  ], []);
  const budgetTips = useMemo(() => [
    {
      category: "Основные расходы",
      items: [
        { name: "Аренда (Kaltmiete)", amount: "500-1500€", description: "Основная арендная плата без коммунальных услуг" },
        { name: "Коммунальные услуги (Nebenkosten)", amount: "100-300€", description: "Отопление, вода, уборка, интернет" },
        { name: "Залог (Kaution)", amount: "1-3 месячные аренды", description: "Возвращается при выезде" },
        { name: "Комиссия агентству", amount: "1-2 месячные аренды", description: "Если используете услуги агентства" }
      ]
    },
    {
      category: "Дополнительные расходы",
      items: [
        { name: "Страховка квартиры", amount: "50-100€/год", description: "Обязательная страховка ответственности" },
        { name: "Интернет", amount: "20-50€/месяц", description: "Если не включен в коммунальные услуги" },
        { name: "GEZ (медиа взнос)", amount: "18,36€/месяц", description: "Обязательный взнос за телерадиовещание" },
        { name: "Переезд", amount: "200-800€", description: "Стоимость переезда и первоначального обустройства" }
      ]
    }
  ], []);
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Документы и процесс поиска
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Подробное руководство по подготовке документов и этапам поиска жилья в Германии
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="documents">Документы</TabsTrigger>
            <TabsTrigger value="process">Процесс</TabsTrigger>
            <TabsTrigger value="mistakes">Ошибки</TabsTrigger>
            <TabsTrigger value="budget">Бюджет</TabsTrigger>
          </TabsList>
          <TabsContent value="documents" className="space-y-6">
            {documents.map((section) => (
              <Card key={section.category} className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
                    <span>{section.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((doc) => (
                      <div key={doc.name} className="flex space-x-4 p-4 glass rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/30 dark:to-dark-theme-pink/30 rounded-lg flex items-center justify-center">
                            <doc.icon className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-foreground">{doc.name}</h4>
                            <Badge variant={doc.required ? "destructive" : "secondary"} className="text-xs">
                              {doc.required ? "Обязательно" : "Желательно"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="process" className="space-y-6">
            <div className="space-y-6">
              {searchProcess.map((step) => (
                <Card key={step.step} className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-german-red to-german-gold dark:from-dark-theme-purple dark:to-dark-theme-pink rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{step.duration}</span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{step.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {step.tips.map((tip, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="mistakes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commonMistakes.map((item, index) => (
                <Card key={index} className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                      <h3 className="font-semibold text-foreground">{item.mistake}</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Последствия:</h4>
                        <p className="text-sm text-muted-foreground">{item.consequence}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Решение:</h4>
                        <p className="text-sm text-muted-foreground">{item.solution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="budget" className="space-y-6">
            {budgetTips.map((section) => (
              <Card key={section.category} className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-german-red dark:text-dark-theme-pink" />
                    <span>{section.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-german-red dark:text-dark-theme-pink">{item.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
});
export { HousingDocuments };
