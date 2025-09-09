"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Phone,
  AlertTriangle,
  Clock,
  MapPin,
  Car,
  Building,
  Heart,
  PhoneCall,
  Ambulance,
  Siren,
  Calendar
} from "lucide-react";
const emergencyNumbers = [
  {
    number: "112",
    title: "Экстренные службы",
    subtitle: "Notrufdienst",
    description: "Пожарная служба, скорая помощь, полиция в критических ситуациях",
    when: "Угроза жизни, серьёзные травмы, пожар",
    coverage: "24/7 по всей Германии",
    languages: "Немецкий, английский",
    urgent: true
  },
  {
    number: "116 117",
    title: "Врачебная служба",
    subtitle: "Ärztlicher Bereitschaftsdienst",
    description: "Медицинская помощь в нерабочее время врачей",
    when: "Болезнь вне рабочих часов, не угрожающая жизни",
    coverage: "Вечером, выходные, праздники",
    languages: "Немецкий, часто английский",
    urgent: false
  },
  {
    number: "110",
    title: "Полиция",
    subtitle: "Polizei",
    description: "Полицейская служба для преступлений и происшествий",
    when: "Преступления, аварии, нарушения общественного порядка",
    coverage: "24/7 по всей Германии",
    languages: "Немецкий, английский",
    urgent: true
  }
];
const emergencyTypes = [
  {
    type: "Lebensbedrohlich",
    title: "Угроза жизни",
    icon: AlertTriangle,
    examples: [
      "Остановка сердца",
      "Тяжёлые травмы",
      "Инсульт",
      "Сердечный приступ",
      "Потеря сознания",
      "Сильное кровотечение"
    ],
    action: "Немедленно звоните 112",
    color: "red"
  },
  {
    type: "Dringend",
    title: "Срочно, но не критично",
    icon: Clock,
    examples: [
      "Высокая температура",
      "Сильная боль",
      "Рвота, диарея",
      "Подозрение на перелом",
      "Аллергическая реакция"
    ],
    action: "Звоните 116 117 или в больницу",
    color: "orange"
  },
  {
    type: "Planbar",
    title: "Можно планировать",
    icon: Calendar,
    examples: [
      "Обычная простуда",
      "Лёгкие боли",
      "Профилактические осмотры",
      "Хронические заболевания",
      "Консультации"
    ],
    action: "Запишитесь к семейному врачу",
    color: "green"
  }
];
const hospitalTypes = [
  {
    type: "Notaufnahme",
    title: "Приёмный покой",
    description: "Экстренная помощь при серьёзных проблемах",
    icon: Building,
    when: "Серьёзные травмы, острые боли",
    waitTime: "0-4 часа (зависит от тяжести)"
  },
  {
    type: "Krankenhaus",
    title: "Больница",
    description: "Стационарное лечение и сложные операции",
    icon: Heart,
    when: "Направление от врача, плановые операции",
    waitTime: "По записи"
  },
  {
    type: "Bereitschaftspraxis",
    title: "Дежурная практика",
    description: "Медпомощь в нерабочее время",
    icon: Clock,
    when: "Болезнь вечером, в выходные",
    waitTime: "30 минут - 2 часа"
  }
];
export function HealthcareEmergency() {
  return (
    <section className="py-20 bg-muted/30 dark:bg-muted/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <Badge variant="secondary" className="mb-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Экстренная медицинская помощь
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Экстренная помощь{" "}
            <span className="text-red-600">всегда доступна</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Знайте, куда обращаться в экстренных ситуациях в Германии.
            Правильные номера телефонов могут спасти жизнь.
          </motion.p>
        </div>
        {/* Emergency numbers */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Важные номера экстренных служб
          </motion.h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {emergencyNumbers.map((emergency, index) => (
              <motion.div
                key={emergency.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full border-2 transition-all duration-300 group hover:shadow-lg ${
                  emergency.urgent
                    ? 'border-red-200 hover:border-red-300 bg-red-50/50 dark:border-border dark:bg-card/50 hover:dark:bg-card/70'
                    : 'border-primary/20 hover:border-primary/30 bg-primary/5 dark:border-border dark:bg-card/50 hover:dark:bg-card/70'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-full mb-4 ${
                      emergency.urgent
                        ? 'bg-red-100 text-red-600 dark:bg-muted dark:text-muted-foreground'
                        : 'bg-primary/10 text-primary dark:bg-muted dark:text-muted-foreground'
                    }`}>
                      <Phone className="h-8 w-8" />
                    </div>
                    <div className={`text-4xl font-black mb-2 ${
                      emergency.urgent ? 'text-red-600 dark:text-foreground' : 'text-primary dark:text-foreground'
                    }`}>
                      {emergency.number}
                    </div>
                    <h4 className="text-xl font-bold mb-1">{emergency.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium mb-3">{emergency.subtitle}</p>
                    <p className="text-muted-foreground mb-4">{emergency.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Когда звонить:</strong> {emergency.when}
                      </div>
                      <div>
                        <strong>Доступность:</strong> {emergency.coverage}
                      </div>
                      <div>
                        <strong>Языки:</strong> {emergency.languages}
                      </div>
                    </div>
                    {emergency.urgent && (
                      <div className="mt-4 p-3 bg-red-100 dark:bg-muted rounded-lg">
                        <p className="text-sm text-red-700 dark:text-muted-foreground font-medium">
                          ⚡ Только для критических ситуаций!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Emergency types */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Как определить уровень срочности
          </motion.h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {emergencyTypes.map((type, index) => (
              <motion.div
                key={type.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full border-2 transition-all duration-300 group hover:shadow-lg ${
                  type.color === 'red'
                    ? 'border-red-200 hover:border-red-300 bg-red-50/30 dark:border-border dark:bg-card/50 hover:dark:bg-card/70'
                    : type.color === 'orange'
                    ? 'border-orange-200 hover:border-orange-300 bg-orange-50/30 dark:border-border dark:bg-card/50 hover:dark:bg-card/70'
                    : 'border-green-200 hover:border-green-300 bg-green-50/30 dark:border-border dark:bg-card/50 hover:dark:bg-card/70'
                }`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className={`inline-flex p-4 rounded-full mb-4 ${
                        type.color === 'red'
                          ? 'bg-red-100 text-red-600 dark:bg-muted dark:text-muted-foreground'
                          : type.color === 'orange'
                          ? 'bg-orange-100 text-orange-600 dark:bg-muted dark:text-muted-foreground'
                          : 'bg-green-100 text-green-600 dark:bg-muted dark:text-muted-foreground'
                      }`}>
                        <type.icon className="h-8 w-8" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">{type.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{type.type}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">Примеры:</h5>
                        <ul className="space-y-1">
                          {type.examples.map((example, idx) => (
                            <li key={idx} className="text-sm flex items-start">
                              <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                                type.color === 'red' ? 'bg-red-500 dark:bg-muted-foreground'
                                : type.color === 'orange' ? 'bg-orange-500 dark:bg-muted-foreground'
                                : 'bg-green-500 dark:bg-muted-foreground'
                              }`} />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={`p-3 rounded-lg ${
                        type.color === 'red'
                          ? 'bg-red-100 dark:bg-muted'
                          : type.color === 'orange'
                          ? 'bg-orange-100 dark:bg-muted'
                          : 'bg-green-100 dark:bg-muted'
                      }`}>
                        <p className={`text-sm font-medium ${
                          type.color === 'red'
                            ? 'text-red-700 dark:text-muted-foreground'
                            : type.color === 'orange'
                            ? 'text-orange-700 dark:text-muted-foreground'
                            : 'text-green-700 dark:text-muted-foreground'
                        }`}>
                          📞 {type.action}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Hospital types */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Куда обращаться за помощью
          </motion.h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {hospitalTypes.map((hospital, index) => (
              <motion.div
                key={hospital.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 group hover:shadow-lg bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      <hospital.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{hospital.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium mb-3">{hospital.type}</p>
                    <p className="text-muted-foreground mb-4">{hospital.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Когда обращаться:</strong> {hospital.when}
                      </div>
                      <div>
                        <strong>Время ожидания:</strong> {hospital.waitTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Emergency tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 border-2 border-red-200 dark:border-red-800"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-muted mb-6">
              <Siren className="h-8 w-8 text-red-600 dark:text-muted-foreground" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-red-600 dark:text-foreground">
              🚨 Экстренная ситуация
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Алгоритм действий при вызове экстренных служб в Германии
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-muted/50 dark:to-muted rounded-lg p-6">
              <h4 className="font-bold mb-6 text-xl text-red-700 dark:text-foreground flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                При звонке в 112 сообщите
              </h4>
              <div className="space-y-4">
                <div className="flex items-start p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                  <MapPin className="h-5 w-5 mr-3 text-red-600 dark:text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-700 dark:text-foreground">Где произошло</div>
                    <div className="text-sm text-muted-foreground">Точный адрес и ориентиры</div>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 mr-3 text-red-600 dark:text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-700 dark:text-foreground">Что случилось</div>
                    <div className="text-sm text-muted-foreground">Характер травм и состояние</div>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                  <Phone className="h-5 w-5 mr-3 text-red-600 dark:text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-700 dark:text-foreground">Ваши данные</div>
                    <div className="text-sm text-muted-foreground">Имя и номер телефона</div>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                  <Clock className="h-5 w-5 mr-3 text-red-600 dark:text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-red-700 dark:text-foreground">Когда произошло</div>
                    <div className="text-sm text-muted-foreground">Время происшествия</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-muted/50 dark:to-muted rounded-lg p-6">
              <h4 className="font-bold mb-6 text-xl text-blue-700 dark:text-foreground flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Важные рекомендации
              </h4>
              <div className="space-y-3">
                {[
                  { icon: "🧘", text: "Сохраняйте спокойствие", sub: "Чёткая речь поможет диспетчеру" },
                  { icon: "🗣️", text: "Говорите медленно", sub: "Повторите важную информацию" },
                  { icon: "📞", text: "Не кладите трубку", sub: "Ждите разрешения диспетчера" },
                  { icon: "🏥", text: "Ожидайте помощь", sub: "Оставайтесь на месте" },
                  { icon: "📄", text: "Документы при себе", sub: "Паспорт или ID карта" },
                  { icon: "🗺️", text: "Адрес на немецком", sub: "Выучите название улицы" }
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start p-3 bg-white/50 dark:bg-background/50 rounded-lg">
                    <span className="text-lg mr-3 mt-0.5">{tip.icon}</span>
                    <div>
                      <div className="font-semibold text-blue-700 dark:text-foreground">{tip.text}</div>
                      <div className="text-sm text-muted-foreground">{tip.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
