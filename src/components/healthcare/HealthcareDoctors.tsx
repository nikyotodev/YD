"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Search,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Eye,
  Smile,
  Brain,
  Star,
  Globe
} from "lucide-react";
import Image from "next/image";
const doctorTypes = [
  {
    type: "Hausarzt",
    title: "Семейный врач",
    description: "Врач общей практики - первая точка контакта в системе здравоохранения",
    icon: Stethoscope,
    services: [
      "Общие медицинские консультации",
      "Профилактические осмотры",
      "Вакцинация",
      "Направления к специалистам",
      "Больничные листы"
    ],
    urgent: false
  },
  {
    type: "Facharzt",
    title: "Врач-специалист",
    description: "Специализированная медицинская помощь по различным направлениям",
    icon: Heart,
    services: [
      "Кардиология",
      "Дерматология",
      "Неврология",
      "Гинекология",
      "Ортопедия"
    ],
    urgent: false
  },
  {
    type: "Notarzt",
    title: "Экстренная помощь",
    description: "Скорая медицинская помощь в критических ситуациях",
    icon: Phone,
    services: [
      "Реанимация",
      "Травмы",
      "Сердечные приступы",
      "Инсульты",
      "Передозировки"
    ],
    urgent: true
  }
];
const searchMethods = [
  {
    method: "Online-Portale",
    title: "Онлайн-порталы",
    description: "Поиск и запись к врачам через интернет-платформы",
    platforms: ["Doctolib", "Jameda", "TeleClinic", "Arzttermine.de"],
    icon: Globe,
    pros: ["Удобный поиск", "Онлайн запись", "Отзывы пациентов"]
  },
  {
    method: "Terminservicestelle",
    title: "Служба записи",
    description: "Федеральная служба помощи в поиске врачей и записи на приём",
    platforms: ["116 117 (телефон)", "116117.de"],
    icon: Phone,
    pros: ["Бесплатно", "Быстрый поиск", "Помощь в сложных случаях"]
  },
  {
    method: "Direkter Kontakt",
    title: "Прямой контакт",
    description: "Звонок непосредственно в медицинскую практику",
    platforms: ["Телефон практики", "Личное посещение"],
    icon: Calendar,
    pros: ["Прямое общение", "Индивидуальный подход", "Быстрое решение"]
  }
];
const specialistTypes = [
  {
    name: "Кардиолог",
    german: "Kardiologe",
    icon: Heart,
    when: "Боли в груди, проблемы с сердцем"
  },
  {
    name: "Дерматолог",
    german: "Dermatologe",
    icon: Smile,
    when: "Проблемы с кожей, родинки"
  },
  {
    name: "Офтальмолог",
    german: "Augenarzt",
    icon: Eye,
    when: "Проблемы со зрением, боли в глазах"
  },
  {
    name: "Невролог",
    german: "Neurologe",
    icon: Brain,
    when: "Головные боли, проблемы с нервной системой"
  }
];
export function HealthcareDoctors() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float dark:bg-accent/10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float animation-delay-2000 dark:bg-primary/10" />
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
              <Stethoscope className="h-4 w-4 mr-2" />
              Поиск врачей и запись
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Найдите нужного{" "}
            <span className="text-primary">врача легко и быстро</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Узнайте, как записаться к врачу в Германии, какие специалисты доступны
            и как работает система направлений в немецком здравоохранении.
          </motion.p>
        </div>
        {/* Doctor types */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Типы врачей в Германии
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctorTypes.map((doctor, index) => (
              <motion.div
                key={doctor.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full border-2 transition-all duration-300 group hover:shadow-lg ${
                  doctor.urgent
                    ? 'border-red-200 hover:border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                    : 'hover:border-primary/20 bg-card'
                }`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`inline-flex p-4 rounded-full mb-4 ${
                        doctor.urgent
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        <doctor.icon className="h-8 w-8" />
                      </div>
                      <h4 className="text-xl font-bold mb-1">{doctor.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium">{doctor.type}</p>
                      <p className="text-muted-foreground mt-2">{doctor.description}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-3">Услуги:</h5>
                      <ul className="space-y-2">
                        {doctor.services.map((service, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                              doctor.urgent ? 'bg-red-500' : 'bg-primary'
                            }`} />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {doctor.urgent && (
                      <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                          ⚡ Звоните 112 в экстренных случаях
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        {/* How to find doctors */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Как найти и записаться к врачу
          </motion.h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {searchMethods.map((method, index) => (
              <motion.div
                key={method.method}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 group hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                        <method.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">{method.title}</h4>
                      <p className="text-muted-foreground">{method.description}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">Платформы:</h5>
                        <ul className="space-y-1">
                          {method.platforms.map((platform, idx) => (
                            <li key={idx} className="text-sm bg-muted/50 rounded px-3 py-1">
                              {platform}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Преимущества:</h5>
                        <ul className="space-y-1">
                          {method.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <Star className="h-3 w-3 mr-2 text-yellow-500" />
                              {pro}
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
        </div>
        {/* Specialists */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-8 text-center"
          >
            Популярные врачи-специалисты
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialistTypes.map((specialist, index) => (
              <motion.div
                key={specialist.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg border hover:border-primary/20 transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm"
              >
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <specialist.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-1">{specialist.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{specialist.german}</p>
                <p className="text-xs text-muted-foreground">{specialist.when}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-muted/30 rounded-2xl p-8 md:p-12 dark:bg-muted/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                💡 Полезные советы для записи к врачу
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <strong>Планируйте заранее:</strong> Запись к специалистам может занять несколько недель
                  </div>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <strong>Выбирайте ближайших врачей:</strong> Это удобнее для регулярных визитов
                  </div>
                </li>
                <li className="flex items-start">
                  <Search className="h-5 w-5 mr-3 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <strong>Читайте отзывы:</strong> Jameda и другие платформы содержат отзывы пациентов
                  </div>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <Image
                src="https://ugc.same-assets.com/JsIX8srBGsPLCM6xYGOUwZB1bWbiVC9U.jpeg"
                alt="German doctor consultation"
                width={400}
                height={300}
                className="rounded-lg shadow-lg mx-auto"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
