"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Gift,
  PartyPopper,
  TreePine,
  Heart,
  Star,
  Clock,
  MapPin,
  Users,
  Volume2,
  BookOpen,
} from "lucide-react";
interface Holiday {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  month: number;
  day: number;
  region: string;
  type: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  vocabulary: string[];
}
interface HolidayCalendarProps {
  holidays?: Holiday[];
  onHolidaySelect?: (holiday: Holiday) => void;
  className?: string;
}
const germanHolidays: Holiday[] = [
  {
    id: "neujahr",
    title: "Neujahr",
    subtitle: "Новый год",
    date: "1 января",
    month: 1,
    day: 1,
    region: "Вся Германия",
    type: "Государственный",
    color: "bg-blue-500/20 text-blue-300",
    icon: <PartyPopper className="h-4 w-4" />,
    description: "Празднование Нового года с фейерверками и шампанским",
    vocabulary: [
      "das Feuerwerk",
      "der Sekt",
      "das Silvester",
      "prosit Neujahr",
    ],
  },
  {
    id: "karneval",
    title: "Karneval",
    subtitle: "Карнавал",
    date: "Февраль",
    month: 2,
    day: 15,
    region: "Рейнская область",
    type: "Народный",
    color: "bg-german-black/20 text-german-black",
    icon: <Gift className="h-4 w-4" />,
    description: "Веселое время с костюмами и парадами",
    vocabulary: ["das Kostüm", "der Umzug", "helau", "alaaf"],
  },
  {
    id: "ostern",
    title: "Ostern",
    subtitle: "Пасха",
    date: "Март-Апрель",
    month: 4,
    day: 15,
    region: "Вся Германия",
    type: "Религиозный",
    color: "bg-green-500/20 text-green-300",
    icon: <Star className="h-4 w-4" />,
    description: "Христианский праздник воскресения с пасхальными яйцами",
    vocabulary: ["das Osterei", "der Osterhase", "die Auferstehung", "suchen"],
  },
  {
    id: "tag-der-arbeit",
    title: "Tag der Arbeit",
    subtitle: "День труда",
    date: "1 мая",
    month: 5,
    day: 1,
    region: "Вся Германия",
    type: "Государственный",
    color: "bg-red-500/20 text-red-300",
    icon: <Users className="h-4 w-4" />,
    description: "Международный день трудящихся",
    vocabulary: ["die Arbeit", "der Arbeiter", "der Feiertag", "demonstrieren"],
  },
  {
    id: "oktoberfest",
    title: "Oktoberfest",
    subtitle: "Октоберфест",
    date: "Сентябрь-Октябрь",
    month: 9,
    day: 20,
    region: "Мюнхен, Бавария",
    type: "Народный",
    color: "bg-german-gold/20 text-german-gold dark:bg-purple-500/20 dark:text-purple-300",
    icon: <Gift className="h-4 w-4" />,
    description: "Крупнейший пивной фестиваль в мире",
    vocabulary: ["das Bier", "die Maß", "die Lederhose", "das Dirndl"],
  },
  {
    id: "tag-der-deutschen-einheit",
    title: "Tag der Deutschen Einheit",
    subtitle: "День немецкого единства",
    date: "3 октября",
    month: 10,
    day: 3,
    region: "Вся Германия",
    type: "Государственный",
    color: "bg-german-black/20 text-german-black",
    icon: <Star className="h-4 w-4" />,
    description: "Национальный праздник объединения Германии",
    vocabulary: [
      "die Einheit",
      "die Vereinigung",
      "der Nationalfeiertag",
      "Deutschland",
    ],
  },
  {
    id: "weihnachten",
    title: "Weihnachten",
    subtitle: "Рождество",
    date: "24-26 декабря",
    month: 12,
    day: 24,
    region: "Вся Германия",
    type: "Религиозный",
    color: "bg-emerald-500/20 text-emerald-300",
    icon: <TreePine className="h-4 w-4" />,
    description: "Самый важный семейный праздник в Германии",
    vocabulary: [
      "der Tannenbaum",
      "das Geschenk",
      "der Glühwein",
      "die Familie",
    ],
  },
  {
    id: "silvester",
    title: "Silvester",
    subtitle: "Канун Нового года",
    date: "31 декабря",
    month: 12,
    day: 31,
    region: "Вся Германия",
    type: "Народный",
    color: "bg-german-red/20 text-german-red dark:bg-pink-500/20 dark:text-pink-300",
    icon: <PartyPopper className="h-4 w-4" />,
    description: "Последний день года с фейерверками",
    vocabulary: ["das Feuerwerk", "Mitternacht", "das Bleigießen", "anstoßen"],
  },
];
const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const germanMonths = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
export function HolidayCalendar({
  holidays = germanHolidays,
  onHolidaySelect,
  className = "",
}: HolidayCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const speakText = (text: string, language: "de" | "ru" = "de") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "de" ? "de-DE" : "ru-RU";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Понедельник = 0
  };
  const getHolidaysForMonth = (month: number) => {
    return holidays.filter((holiday) => holiday.month === month + 1);
  };
  const getHolidayForDay = (day: number, month: number) => {
    return holidays.find(
      (holiday) => holiday.day === day && holiday.month === month + 1,
    );
  };
  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    setSelectedHoliday(null);
  };
  const handleHolidayClick = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    onHolidaySelect?.(holiday);
  };
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    // Пустые клетки в начале
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-12 border border-white/10 bg-white/5 rounded-lg"
        />,
      );
    }
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const holiday = getHolidayForDay(day, currentMonth);
      const isToday =
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear();
      days.push(
        <div
          key={day}
          className={`
            h-12 border border-white/10 rounded-lg flex items-center justify-center cursor-pointer
            transition-all duration-200 relative text-sm font-medium
            ${
              holiday
                ? "bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border-white/20"
                : "bg-white/5 hover:bg-white/10"
            }
            ${isToday ? "ring-2 ring-blue-400/50" : ""}
            ${selectedHoliday?.id === holiday?.id ? "ring-2 ring-german-red/50 bg-german-red/20" : ""}
          `}
          onClick={() => holiday && handleHolidayClick(holiday)}
        >
          <span
            className={`${holiday ? "text-foreground" : "text-muted-foreground"}`}
          >
            {day}
          </span>
          {holiday && (
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${holiday.color} border border-white/20`}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center text-[8px]">
                {holiday.icon}
              </div>
            </div>
          )}
        </div>,
      );
    }
    return days;
  };
  const monthHolidays = getHolidaysForMonth(currentMonth);
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Calendar Header */}
      <Card className="glass-card bg-gradient-to-r from-german-red/10 to-german-gold/10 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-1">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">
                {germanMonths[currentMonth]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakText(germanMonths[currentMonth], "de")}
                className="p-1 h-auto"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="glass glass-hover"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="glass glass-hover"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Calendar Grid */}
        <div className="space-y-4">
          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">{renderCalendarGrid()}</div>
        </div>
        {/* Month Holidays Summary */}
        {monthHolidays.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Праздники в этом месяце ({monthHolidays.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {monthHolidays.map((holiday) => (
                <Badge
                  key={holiday.id}
                  className={`cursor-pointer transition-all ${holiday.color} hover:scale-105`}
                  onClick={() => handleHolidayClick(holiday)}
                >
                  <span className="mr-1">{holiday.icon}</span>
                  {holiday.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
      {/* Selected Holiday Details */}
      {selectedHoliday && (
        <Card className="glass-card bg-gradient-to-br from-white/5 to-white/10 border border-white/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold gradient-text mb-1">
                  {selectedHoliday.title}
                </h4>
                <p className="text-muted-foreground">
                  {selectedHoliday.subtitle}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={selectedHoliday.color}>
                  {selectedHoliday.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(selectedHoliday.title, "de")}
                  className="glass glass-hover"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Дата:</span>
                <span className="ml-2 text-foreground">
                  {selectedHoliday.date}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Регион:</span>
                <span className="ml-2 text-foreground">
                  {selectedHoliday.region}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {selectedHoliday.description}
            </p>
            {/* Vocabulary Section */}
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVocabulary(!showVocabulary)}
                className={`glass glass-hover ${showVocabulary ? "text-german-red" : "text-muted-foreground"}`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {showVocabulary ? "Скрыть словарь" : "Показать словарь"}
              </Button>
              {showVocabulary && (
                <div className="glass bg-white/5 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-foreground mb-3">
                    Праздничная лексика:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedHoliday.vocabulary.map((word) => (
                      <div
                        key={word}
                        className="glass-nav p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                        onClick={() => speakText(word, "de")}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground text-sm">
                            {word}
                          </span>
                          <Volume2 className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
