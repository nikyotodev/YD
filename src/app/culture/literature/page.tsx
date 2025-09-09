"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Pen,
  Quote,
  Scroll,
  Crown,
  Star,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  User,
  Heart,
  Eye,
  Volume2,
  FileText,
  Lightbulb,
  Glasses,
  Coffee,
  Feather,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSpeech } from "@/hooks/useSpeech";
export default function LiteraturePage() {
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const literaryPeriods = [
    {
      id: "classical",
      title: "Классицизм",
      description: "Гёте, Шиллер",
      color: "bg-blue-500/20 text-blue-300",
      count: 15,
      icon: <Crown className="h-6 w-6" />,
    },
    {
      id: "romantic",
      title: "Романтизм",
      description: "Новалис, Гейне",
      color: "bg-purple-500/20 text-purple-300",
      count: 12,
      icon: <Heart className="h-6 w-6" />,
    },
    {
      id: "modern",
      title: "Модернизм",
      description: "Кафка, Манн",
      color: "bg-green-500/20 text-green-300",
      count: 18,
      icon: <Lightbulb className="h-6 w-6" />,
    },
    {
      id: "contemporary",
      title: "Современность",
      description: "Грасс, Хандке",
      color: "bg-orange-500/20 text-orange-300",
      count: 10,
      icon: <Feather className="h-6 w-6" />,
    },
  ];
  const featuredTexts = [
    {
      id: "faust",
      title: "Faust I",
      subtitle: "Фауст (часть первая)",
      author: "Johann Wolfgang von Goethe",
      year: "1808",
      period: "Классицизм",
      level: "C1-C2",
      description:
        "Величайшее произведение немецкой литературы. История ученого, заключившего сделку с дьяволом.",
      culturalContext:
        "Фауст - символ западной цивилизации, стремящейся к познанию. Влияние на мировую культуру огромно.",
      excerpt: {
        german: `Habe nun, ach! Philosophie,
Juristerei und Medizin,
Und leider auch Theologie
Durchaus studiert, mit heißem Bemühn.
Da steh ich nun, ich armer Tor!
Und bin so klug als wie zuvor;`,
        russian: `Изучил я, увы! философию,
Юриспруденцию и медицину,
И, к сожалению, теологию
Основательно, с горячим рвением.
Вот стою я, бедный дурак!
И так же мудр, как был и так;`,
        context:
          "Фауст размышляет о бесполезности своих знаний в начале трагедии.",
      },
      vocabulary: [
        {
          word: "durchaus",
          translation: "основательно, совершенно",
          type: "наречие",
          explanation: "Усиливает глагол studiert",
        },
        {
          word: "das Bemühn",
          translation: "усилие, старание",
          type: "существительное",
          explanation: "Архаичная форма от Bemühung",
        },
        {
          word: "der Tor",
          translation: "дурак, глупец",
          type: "существительное",
          explanation: "Устаревшее слово, сейчас Narr",
        },
        {
          word: "klug",
          translation: "умный, мудрый",
          type: "прилагательное",
          explanation: "Основное значение - сообразительный",
        },
      ],
      analysis: {
        theme: "Стремление к знанию и его ограниченность",
        style: "Книттельферс (четырехстопный ямб с парной рифмой)",
        symbols: "Ученый как символ западного человека",
        language: "Высокий стиль с архаизмами",
      },
      quotes: [
        {
          german: "Grau, teurer Freund, ist alle Theorie",
          russian: "Суха, мой друг, теория седая",
        },
        {
          german: "Es irrt der Mensch, solang er strebt",
          russian: "Лишь тот, кто жаждет, может заблуждаться",
        },
      ],
      fullText: `Zwei Seelen wohnen, ach! in meiner Brust,
Die eine will sich von der andern trennen;
Die eine hält, in derber Liebeslust,
Sich an der Welt mit klammernden Organen;
Die andere hebt gewaltsam sich vom Dust
Zu den Gefilden hoher Ahnen.`,
      fullTextTranslation: `Две души живут, ах, в моей груди,
Одна хочет отделиться от другой;
Одна держится, в грубой любовной страсти,
За мир цепляющимися органами;
Другая насильно поднимается от праха
К просторам высоких предков.`,
      interpretation:
        "Этот отрывок описывает внутренний конфликт человека между материальным и духовным, между земными удовольствиями и стремлением к высшему. Это центральная тема всего произведения.",
      historicalContext:
        "Фауст был написан на переломе эпох - от Просвещения к Романтизму. Гёте работал над произведением более 60 лет. Первая часть вышла в 1808 году, вторая была опубликована посмертно в 1832.",
      literaryInfluence:
        "Фауст считается величайшим произведением немецкой литературы и входит в мировой литературный канон. Он повлиял на множество произведений, от оперы Гуно до романов Томаса Манна.",
      lesson: {
        title: "Урок 1: Пролог в театре и на небесах",
        objectives: [
          "Понять структуру произведения и его рамочную композицию",
          "Изучить мотив сделки с дьяволом в немецкой культуре",
          "Разобрать ключевые темы произведения",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              'Переведите на русский: "der Streben", "die Erkenntnis", "die Wette"',
              'Объясните разницу между "wissen" и "erkennen"',
              'Составьте предложения с словами "der Gelehrte", "die Wissenschaft", "die Magie"',
            ],
          },
          {
            type: "comprehension",
            title: "Понимание текста",
            tasks: [
              "Почему Фауст заключает сделку с Мефистофелем?",
              "Какую цель преследует Мефистофель?",
              "Опишите отношение Фауста к традиционным наукам",
            ],
          },
          {
            type: "discussion",
            title: "Темы для обсуждения",
            tasks: [
              "Что символизирует образ Фауста в европейской культуре?",
              "Как в произведении отражена проблема границ человеческого познания?",
              "Сравните образ Фауста с другими литературными персонажами, ищущими высшее знание",
            ],
          },
        ],
        homework: {
          title: "Домашнее задание",
          tasks: [
            'Прочитайте "Пролог на небесах" и выпишите ключевые цитаты',
            "Сравните перевод Пастернака с оригиналом (найдите 3-4 примера переводческих решений)",
            'Напишите эссе на тему "Проблема познания в трагедии Гёте Фауст"',
          ],
        },
      },
    },
    {
      id: "verwandlung",
      title: "Die Verwandlung",
      subtitle: "Превращение",
      author: "Franz Kafka",
      year: "1915",
      period: "Модернизм",
      level: "B2-C1",
      description:
        "Абсурдистская новелла о человеке, превратившемся в насекомое. Классика экзистенциальной литературы.",
      culturalContext:
        "Отражает отчуждение человека в современном мире. Влияние на философию и психологию XX века.",
      excerpt: {
        german:
          "Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt. Er lag auf seinem panzerartig harten Rücken und sah, wenn er den Kopf ein wenig hob, seinen gewölbten, braunen, von bogenförmigen Versteifungen geteilten Bauch.",
        russian:
          "Проснувшись однажды утром после беспокойного сна, Грегор Замза обнаружил, что он у себя в постели превратился в страшное насекомое. Лежа на твердой, как панцирь, спине, он видел, стоило ему приподнять голову, свой выпуклый, коричневый, разделенный дугообразными чешуйками живот.",
        context:
          "Знаменитое начало новеллы - внезапное превращение как данность.",
      },
      vocabulary: [
        {
          word: "unruhig",
          translation: "беспокойный",
          type: "прилагательное",
          explanation: "Указывает на тревожное состояние",
        },
        {
          word: "ungeheuer",
          translation: "чудовищный, огромный",
          type: "прилагательное",
          explanation: "Усиливает слово Ungeziefer",
        },
        {
          word: "das Ungeziefer",
          translation: "насекомое, гад",
          type: "существительное",
          explanation: "Собирательное название вредителей",
        },
        {
          word: "panzerartig",
          translation: "как панцирь",
          type: "прилагательное",
          explanation: "Сравнение с броней",
        },
        {
          word: "gewölbt",
          translation: "выпуклый",
          type: "прилагательное",
          explanation: "От глагола wölben - изгибать",
        },
        {
          word: "bogenförmig",
          translation: "дугообразный",
          type: "прилагательное",
          explanation: "В форме дуги, арки",
        },
      ],
      analysis: {
        theme: "Отчуждение, абсурд существования",
        style: "Простой, документальный язык для описания невозможного",
        symbols: "Насекомое как метафора социального изгоя",
        language: "Точность деталей при фантастическом сюжете",
      },
      quotes: [
        {
          german: "War er ein Tier, da ihn Musik so ergriff?",
          russian: "Неужели он зверь, если музыка так волновала его?",
        },
        { german: "Ich kann nicht anders", russian: "Я не могу иначе" },
      ],
      fullText:
        "Die Tür wurde noch mit dem Stock aufgestoßen, dann erschien der Vater. Er war in seiner schmutzigen weißen Uniform; es war ein erbarmungswürdiger Anblick. Aber jetzt richtete er sich auf, die Hände in den Hosentaschen, die Rockschöße zurückgeschlagen; er sah Gregor an.",
      fullTextTranslation:
        "Дверь еще была открыта палкой, затем появился отец. Он был в своей грязной белой форме; это было жалкое зрелище. Но теперь он выпрямился, руки в карманах брюк, полы пиджака отвернуты; он смотрел на Грегора.",
      interpretation:
        "Данный отрывок демонстрирует изменившиеся отношения между Грегором и его отцом после превращения. Отец, ранее зависевший от сына, теперь принимает позицию власти и угрозы.",
      historicalContext:
        "Новелла написана в 1912 году и опубликована в 1915. Это было время, когда Кафка работал в страховой компании и испытывал глубокое чувство отчуждения от своего тела, работы и семьи.",
      literaryInfluence:
        "Произведение стало одним из ключевых текстов экзистенциализма и модернизма. Его влияние простирается от литературы до кино и изобразительного искусства.",
      lesson: {
        title: "Урок 2: Метаморфоза и отчуждение в новелле Кафки",
        objectives: [
          "Понять экзистенциальную проблематику произведения",
          "Разобрать символику превращения",
          "Изучить специфику языка Кафки",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Найдите в тексте 5 существительных, относящихся к телу",
              "Выпишите слова, описывающие эмоциональное состояние Грегора",
              "Сравните немецкие слова, описывающие насекомое, с их русскими эквивалентами",
            ],
          },
          {
            type: "comprehension",
            title: "Понимание текста",
            tasks: [
              "Как меняется отношение семьи к Грегору после превращения?",
              "Какие детали указывают на сохранение человеческого сознания у Грегора?",
              "Опишите финансовую ситуацию семьи Замза до и после превращения",
            ],
          },
          {
            type: "discussion",
            title: "Темы для обсуждения",
            tasks: [
              "Какие интерпретации превращения Грегора существуют?",
              "Как в произведении отражена тема отчуждения человека в современном обществе?",
              'Сравните "Превращение" с другими произведениями Кафки',
            ],
          },
        ],
        homework: {
          title: "Домашнее задание",
          tasks: [
            'Прочитайте "Пролог на небесах" и выпишите ключевые цитаты',
            "Сравните перевод Пастернака с оригиналом (найдите 3-4 примера переводческих решений)",
            'Напишите эссе на тему "Проблема познания в трагедии Гёте Фауст"',
          ],
        },
      },
    },
    {
      id: "lorelei",
      title: "Die Lorelei",
      subtitle: "Лорелея",
      author: "Heinrich Heine",
      year: "1824",
      period: "Романтизм",
      level: "A2-B1",
      description:
        "Знаменитая баллада о мифической деве, завлекающей моряков на скалы Рейна.",
      culturalContext:
        "Одно из самых известных немецких стихотворений. Стало народной песней и символом Рейна.",
      excerpt: {
        german: `Ich weiß nicht, was soll es bedeuten,
Dass ich so traurig bin;
Ein Märchen aus alten Zeiten,
Das kommt mir nicht aus dem Sinn.
Die Luft ist kühl und es dunkelt,
Und ruhig fließt der Rhein;
Der Gipfel des Berges funkelt
Im Abendsonnenschein.`,
        russian: `Не знаю, что значит такое,
Что скорбью полна душа,
Давно позабытое, старое
Мне памяти не дает покоя.
Прохладен воздух, сумерки,
И Рейн течет в тиши;
Вершина горы в лучах заката
Горит в вечерней тиши.`,
        context:
          "Поэт рассказывает о старинной легенде, которая не выходит у него из головы.",
      },
      vocabulary: [
        {
          word: "bedeuten",
          translation: "означать",
          type: "глагол",
          explanation: "Базовый глагол для выражения значения",
        },
        {
          word: "traurig",
          translation: "грустный",
          type: "прилагательное",
          explanation: "Основное слово для печали",
        },
        {
          word: "das Märchen",
          translation: "сказка",
          type: "существительное",
          explanation: "Народная сказка или легенда",
        },
        {
          word: "der Sinn",
          translation: "ум, разум",
          type: "существительное",
          explanation: 'В выражении "aus dem Sinn" - из головы',
        },
        {
          word: "dunkeln",
          translation: "темнеть",
          type: "глагол",
          explanation: "Поэтическая форма от dunkeln",
        },
        {
          word: "funkeln",
          translation: "сверкать",
          type: "глагол",
          explanation: "Ярко блестеть, мерцать",
        },
      ],
      analysis: {
        theme: "Роковая красота, судьба",
        style: "Народная балладная форма",
        symbols: "Рейн как граница между мирами",
        language: "Простой, мелодичный язык",
      },
      quotes: [
        {
          german: "Die schönste Jungfrau sitzet",
          russian: "Сидит там дева чудной красоты",
        },
        {
          german:
            "Ich glaube, die Wellen verschlingen am Ende Schiffer und Kahn",
          russian: "Думаю, волны поглотят в конце и лодку, и гребца",
        },
      ],
      fullText: `Die schönste Jungfrau sitzet
Dort oben wunderbar,
Ihr goldnes Geschmeide blitzet,
Sie kämmt ihr goldenes Haar.
Sie kämmt es mit goldenem Kamme
Und singt ein Lied dabei;
Das hat eine wundersame,
Gewaltige Melodei.`,
      fullTextTranslation: `Прекраснейшая дева сидит
Там наверху чудесная,
Её золотые украшения сверкают,
Она расчёсывает свои золотые волосы.
Она расчёсывает их золотым гребнем
И поёт при этом песню;
В ней дивная,
Могучая мелодия.`,
      interpretation:
        "Этот отрывок описывает саму Лорелею – прекрасную деву на скале. Образ сочетает красоту и опасность, типичное для романтической литературы противоречие.",
      historicalContext:
        "Стихотворение написано в 1824 году и основано на рейнской легенде, популяризированной Клеменсом Брентано. Гейне написал его в период своего увлечения немецким фольклором.",
      literaryInfluence:
        "Стихотворение стало одним из самых известных в немецкой литературе, было положено на музыку более 40 раз и вошло в народную культуру как песня.",
      lesson: {
        title: "Урок 3: Рейнские легенды в поэзии немецкого романтизма",
        objectives: [
          "Изучить музыкальность немецкой поэзии",
          "Понять влияние фольклора на литературу романтизма",
          "Разобрать образ роковой женщины в европейской культуре",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Выпишите из текста все слова, связанные с природой",
              "Найдите прилагательные, описывающие красоту и опасность",
              "Сравните слова, описывающие эмоции в стихотворении, с современными эквивалентами",
            ],
          },
          {
            type: "comprehension",
            title: "Понимание текста",
            tasks: [
              "Почему лирический герой испытывает грусть?",
              "Какими средствами создается образ Лорелеи?",
              "Опишите структуру стихотворения и его ритмический рисунок",
            ],
          },
          {
            type: "discussion",
            title: "Темы для обсуждения",
            tasks: [
              "Как образ Лорелеи соотносится с другими мифологическими существами, привлекающими мужчин?",
              "Сравните рейнские легенды с русскими народными сказаниями",
              "Обсудите влияние географии на немецкую мифологию и литературу",
            ],
          },
        ],
        homework: {
          title: "Домашнее задание",
          tasks: [
            "Выучите наизусть первые две строфы стихотворения",
            "Найдите и проанализируйте другое стихотворение Гейне на ваш выбор",
            "Напишите небольшое эссе о роли Рейна в немецкой культуре",
          ],
        },
      },
    },
    {
      id: "prozess",
      title: "Der Prozess",
      subtitle: "Процесс",
      author: "Franz Kafka",
      year: "1925",
      period: "Модернизм",
      level: "C1",
      description:
        "Абсурдистский роман о человеке, арестованном и вовлеченном в непостижимый судебный процесс.",
      culturalContext:
        "Одно из ключевых произведений модернизма, отражающее тревожность современного мира и бюрократическую абсурдность.",
      excerpt: {
        german:
          "Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. Die Köchin der Frau Grubach, seiner Zimmervermieterin, die ihm jeden Tag gegen acht Uhr früh das Frühstück brachte, kam diesmal nicht.",
        russian:
          "Кто-то, по-видимому, оклеветал Йозефа К., потому что, не сделав ничего дурного, он попал под арест в одно прекрасное утро. Кухарка его квартирной хозяйки, фрау Грубах, ежедневно приносившая ему завтрак около восьми, на этот раз не явилась.",
        context:
          "Знаменитое начало романа - внезапный арест главного героя без видимой причины.",
      },
      vocabulary: [
        {
          word: "verleumden",
          translation: "клеветать",
          type: "глагол",
          explanation: "Ложно обвинять кого-то",
        },
        {
          word: "verhaften",
          translation: "арестовывать",
          type: "глагол",
          explanation: "Заключать под стражу",
        },
        {
          word: "die Zimmervermieterin",
          translation: "квартирная хозяйка",
          type: "существительное",
          explanation: "Женщина, сдающая комнаты",
        },
        {
          word: "das Frühstück",
          translation: "завтрак",
          type: "существительное",
          explanation: "Утренний прием пищи",
        },
        {
          word: "böse",
          translation: "злой, дурной",
          type: "прилагательное",
          explanation: "Негативная характеристика действия",
        },
      ],
      analysis: {
        theme: "Абсурдность бюрократии, отчуждение, вина",
        style: "Отстраненное повествование с элементами абсурда",
        symbols: "Суд как метафора высшего, непостижимого порядка",
        language:
          "Точные, бюрократические формулировки для описания иррациональных событий",
      },
      quotes: [
        {
          german: "Vor dem Gesetz steht ein Türhüter",
          russian: "Перед законом стоит привратник",
        },
        {
          german:
            "Es ist nicht notwendig, dass du alles für wahr hältst, du musst es nur für notwendig halten",
          russian:
            "Не обязательно считать все истинным, достаточно считать необходимым",
        },
      ],
      fullText:
        "In der Kathedrale war es fast leer, nur eine alte Frau kniete vorn bei einem Marienbild und betete. Von weitem sah K. noch, wie ein lahmer Kirchendiener auf der rechten Seitenwand dahinging. K. hielt seinen Mantel fest, der im Winde flatterte, und setzte sich in eine Bank.",
      fullTextTranslation:
        "В соборе было почти пусто, только одна старая женщина стояла на коленях перед образом Богоматери и молилась. Издали К. увидел, как хромой служитель церкви шел вдоль правой стены. К. крепко держал своё пальто, которое развевалось на ветру, и сел на скамью.",
      interpretation:
        'Сцена в соборе - один из ключевых моментов романа, где К. встречает тюремного капеллана, который рассказывает ему притчу "Перед Законом". Собор символизирует пространство высшего суда над человеком.',
      historicalContext:
        "Роман был написан в 1914-1915 годах, но опубликован посмертно в 1925 году. Это было время распада Австро-Венгерской империи, бюрократизация которой отразилась в произведении.",
      literaryInfluence:
        'Роман оказал огромное влияние на мировую литературу и философию. Термин "кафкианский" вошел в обиход для описания абсурдных, тревожных и бюрократически запутанных ситуаций.',
      lesson: {
        title: 'Урок 4: Бюрократический абсурд в романе "Процесс"',
        objectives: [
          "Понять концепцию абсурда в литературе модернизма",
          "Изучить роль бюрократической лексики в создании художественного эффекта",
          "Разобрать притчевую природу прозы Кафки",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Выпишите из текста юридические и бюрократические термины",
              "Найдите прилагательные, описывающие абстрактные существительные",
              "Сравните немецкие и русские юридические термины в переводе",
            ],
          },
          {
            type: "comprehension",
            title: "Понимание текста",
            tasks: [
              "Как меняется отношение К. к своему аресту на протяжении романа?",
              "Проанализируйте роль второстепенных персонажей в структуре произведения",
              'Объясните значение притчи "Перед Законом" в контексте романа',
            ],
          },
          {
            type: "discussion",
            title: "Темы для обсуждения",
            tasks: [
              "Как в романе отражена тема вины без преступления?",
              "Сравните бюрократические системы, описанные Кафкой, с современной бюрократией",
              "Обсудите различные интерпретации финала романа",
            ],
          },
        ],
        homework: {
          title: "Домашнее задание",
          tasks: [
            'Прочитайте притчу "Перед Законом" и напишите её анализ',
            'Сравните начальные сцены "Процесса" и "Превращения"',
            "Напишите короткий рассказ в стиле Кафки",
          ],
        },
      },
    },
    {
      id: "rilke-panther",
      title: "Der Panther",
      subtitle: "Пантера",
      author: "Rainer Maria Rilke",
      year: "1902",
      period: "Модернизм",
      level: "B2",
      description:
        "Знаменитое стихотворение о пантере в клетке, символизирующее замкнутость существования.",
      culturalContext:
        "Написано после посещения Рильке зоопарка в Париже. Стало одним из самых известных стихотворений поэта.",
      excerpt: {
        german: `Sein Blick ist vom Vorübergehen der Stäbe
so müd geworden, dass er nichts mehr hält.
Ihm ist, als ob es tausend Stäbe gäbe
und hinter tausend Stäben keine Welt.`,
        russian: `Его взгляд от мелькания прутьев
так устал, что уже ничего не удерживает.
Ему кажется, будто существует тысяча прутьев,
а за тысячей прутьев - нет мира.`,
        context: "Начало стихотворения, описывающее взгляд пантеры в клетке.",
      },
      vocabulary: [
        {
          word: "der Blick",
          translation: "взгляд",
          type: "существительное",
          explanation: "Направленное зрение",
        },
        {
          word: "das Vorübergehen",
          translation: "мелькание, прохождение",
          type: "существительное",
          explanation: "От глагола vorübergehen - проходить мимо",
        },
        {
          word: "der Stab",
          translation: "прут, палка",
          type: "существительное",
          explanation: "Здесь - прутья клетки",
        },
        {
          word: "müde",
          translation: "усталый",
          type: "прилагательное",
          explanation: "Состояние физической или душевной истощенности",
        },
        {
          word: "halten",
          translation: "держать, удерживать",
          type: "глагол",
          explanation: "В данном контексте - удерживать внимание",
        },
      ],
      analysis: {
        theme: "Несвобода, отчуждение, ограниченность существования",
        style: "Конкретные образы для выражения абстрактных идей",
        symbols: "Клетка как символ ограничений человеческого существования",
        language: "Точные, визуально насыщенные описания",
      },
      quotes: [
        {
          german: "Der weiche Gang geschmeidig starker Schritte",
          russian: "Мягкая походка гибко-сильных шагов",
        },
        {
          german: "Ein Tanz von Kraft um eine Mitte",
          russian: "Танец силы вокруг центра",
        },
      ],
      fullText: `Der weiche Gang geschmeidig starker Schritte,
der sich im allerkleinsten Kreise dreht,
ist wie ein Tanz von Kraft um eine Mitte,
in der betäubt ein großer Wille steht.`,
      fullTextTranslation: `Мягкая походка гибко-сильных шагов,
что вращается в совсем маленьком кругу,
подобна танцу силы вокруг центра,
в котором оглушенная стоит большая воля.`,
      interpretation:
        "Вторая строфа стихотворения описывает движение пантеры в клетке. Это не просто описание животного, но метафора экзистенциальной ситуации - мощная воля и сила, скованная ограничениями.",
      historicalContext:
        'Стихотворение написано в 1902 году, в период, когда Рильке работал секретарем у Родена в Париже. Это было время формирования его концепции "вещной поэзии".',
      literaryInfluence:
        'Стихотворение считается образцом "вещной поэзии" Рильке и оказало влияние на развитие поэтического модернизма. Его техника точного описания для передачи философской идеи стала образцом для многих поэтов.',
      lesson: {
        title: "Урок 5: Поэтика вещи в лирике Рильке",
        objectives: [
          'Понять концепцию "вещной поэзии" Рильке',
          "Изучить использование конкретных образов для выражения абстрактных идей",
          "Разобрать метрическую структуру немецкого стихотворения",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Выпишите из текста все слова, описывающие движение",
              "Найдите примеры составных существительных и их структуру",
              "Проанализируйте глаголы, использованные в стихотворении",
            ],
          },
          {
            type: "comprehension",
            title: "Понимание текста",
            tasks: [
              "Как в стихотворении раскрывается тема несвободы?",
              "Проанализируйте роль взгляда пантеры в стихотворении",
              "Объясните, как последняя строфа завершает образ",
            ],
          },
          {
            type: "discussion",
            title: "Темы для обсуждения",
            tasks: [
              "Как образ пантеры соотносится с человеческим существованием?",
              "Сравните образ зверя у Рильке с другими литературными образами животных",
              "Обсудите влияние визуальных искусств (скульптуры Родена) на поэзию Рильке",
            ],
          },
        ],
        homework: {
          title: "Домашнее задание",
          tasks: [
            "Переведите третью строфу стихотворения как можно ближе к оригиналу",
            'Найдите и проанализируйте другое стихотворение Рильке из цикла "Новые стихотворения"',
            'Напишите стихотворение-подражание в стиле "вещной поэзии"',
          ],
        },
      },
    },
  ];
  const toggleAnalysis = (textId: string) => {
    setShowAnalysis((prev) => ({
      ...prev,
      [textId]: !prev[textId],
    }));
  };
  // Инициализируем хук для работы с речью
  const { speakGerman } = useSpeech();
  // Проверяем поддержку синтеза речи на клиенте
  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" && "speechSynthesis" in window,
    );
  }, []);
  // Модифицируем функцию handleSpeak в компоненте LiteraturePage
  const handleSpeak = async (word: string, id?: string) => {
    if (!speechSupported) return;
    // Установить ID говорящего элемента (слово или фрагмент текста)
    setSpeakingWord(id || word);
    try {
      // Разные параметры в зависимости от типа текста
      // Для более длинных текстов используем меньшую скорость и меньшую высоту тона
      const isLongText = word.length > 50;
      // Если есть знаки препинания, добавляем задержку, чтобы речь звучала естественнее
      const hasPunctuation = /[.,:;!?]/.test(word);
      await speakGerman(word, {
        rate: isLongText ? 0.78 : 0.82, // Немного медленнее для всех текстов
        volume: 1,
        pitch: isLongText ? 1.0 : 1.05, // Более нейтральный тон для длинных текстов
      });
      // Больше задержка для текстов с пунктуацией, чтобы пользователь успел послушать интонацию
      const delay = isLongText ? 1000 : hasPunctuation ? 1800 : 1500;
      // Сбросить состояние после завершения речи
      setTimeout(() => setSpeakingWord(null), delay);
    } catch (error) {
      console.error("Ошибка при произношении:", error);
      setSpeakingWord(null);
      // Попробуем еще раз после короткой задержки, если произошла ошибка
      // Это может помочь в случае проблем с инициализацией синтеза речи
      setTimeout(() => {
        try {
          speakGerman(word, {
            rate: 0.8,
            volume: 1,
            pitch: 1.0,
          });
        } catch (retryError) {
          console.error("Повторная ошибка при произношении:", retryError);
        }
      }, 300);
    }
  };
  // Улучшенный компонент для произношения слов
  const SpeechButton = ({ word }: { word: string }) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 ${
          speakingWord === word
            ? "text-german-red animate-pulse dark:text-dark-theme-pink"
            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
        }`}
        onClick={() => handleSpeak(word)}
        disabled={speakingWord !== null}
        title="Произнести слово"
      >
        <Volume2 className="h-3 w-3" />
      </Button>
    );
  };
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-6">
              <Link href="/culture">
                <Button variant="ghost" className="glass glass-hover">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад к культуре
                </Button>
              </Link>
            </div>
            <div className="text-center mb-16">
              <div className="glass-nav inline-flex items-center mb-8">
                <Scroll className="h-4 w-4 mr-2 text-emerald-400" />
                <span className="gradient-text font-medium">
                  Deutsche Literatur
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black gradient-text mb-6">
                Немецкая литература
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Читайте великих немецких авторов в оригинале. Изучайте язык
                через классические тексты с подробным анализом и современными
                комментариями.
              </p>
              {/* Literary Periods */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
                {literaryPeriods.map((period, index) => (
                  <div
                    key={period.id}
                    className="glass-card text-center group cursor-pointer"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div className={`p-3 rounded-full ${period.color}`}>
                        {period.icon}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-foreground mb-1 group-hover:gradient-text transition-all">
                      {period.title}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {period.description}
                    </div>
                    <Badge className="glass-nav text-xs">
                      {period.count} текстов
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Featured Texts */}
        <section className="py-16 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black gradient-text mb-4">
                Классические тексты
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Читайте в оригинале с подробным анализом и комментариями
              </p>
            </div>
            <div className="space-y-12 max-w-6xl mx-auto">
              {featuredTexts.map((text, index) => (
                <Card
                  key={text.id}
                  className="border border-white/20 shadow-md"
                >
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Text Info */}
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold gradient-text mb-2">
                              {text.title}
                            </h3>
                            <p className="text-lg text-muted-foreground mb-1">
                              {text.subtitle}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {text.author}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {text.year}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className="bg-emerald-500/20 text-[#000000]">
                              {text.period}
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {text.level}
                            </Badge>
                          </div>
                        </div>
                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          {text.description}
                        </p>
                        {/* Cultural Context */}
                        <div className="bg-white/5 dark:bg-white/5 rounded-xl p-5 border border-white/10">
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 text-yellow-400 mr-2" />
                            <span className="text-sm font-medium text-foreground">
                              Культурное значение:
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {text.culturalContext}
                          </p>
                        </div>
                        {/* Controls */}
                        <div className="flex items-center">
                          <Button
                            onClick={() => toggleAnalysis(text.id)}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30"
                          >
                            <Glasses className="h-4 w-4 mr-2" />
                            {showAnalysis[text.id]
                              ? "Скрыть анализ"
                              : "Показать анализ"}
                          </Button>
                        </div>
                        {/* Literary Analysis - Improved styling for better readability */}
                        {showAnalysis[text.id] && (
                          <div className="bg-white/5 dark:bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
                            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
                              <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                              Литературный анализ
                            </h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10">
                                  <div className="text-sm font-medium text-foreground mb-2">
                                    Тема
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {text.analysis.theme}
                                  </div>
                                </div>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10">
                                  <div className="text-sm font-medium text-foreground mb-2">
                                    Стиль
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {text.analysis.style}
                                  </div>
                                </div>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10">
                                  <div className="text-sm font-medium text-foreground mb-2">
                                    Символы
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {text.analysis.symbols}
                                  </div>
                                </div>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10">
                                  <div className="text-sm font-medium text-foreground mb-2">
                                    Язык
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {text.analysis.language}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Famous Quotes */}
                            <div className="mt-6">
                              <h5 className="text-sm font-medium text-foreground mb-3">
                                Знаменитые цитаты:
                              </h5>
                              <div className="space-y-3">
                                {text.quotes.map((quote, quoteIndex) => (
                                  <div
                                    key={`quote-${text.id}-${quoteIndex}-${quote.german}`}
                                    className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10"
                                  >
                                    <div className="text-sm font-medium text-foreground mb-2 flex items-center justify-between">
                                      <span>"{quote.german}"</span>
                                      {speechSupported && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`h-7 w-7 p-0 ${
                                            speakingWord ===
                                            `quote-${text.id}-${quoteIndex}`
                                              ? "text-german-red animate-pulse dark:text-dark-theme-pink"
                                              : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                                          }`}
                                          onClick={() =>
                                            handleSpeak(
                                              quote.german,
                                              `quote-${text.id}-${quoteIndex}`,
                                            )
                                          }
                                          disabled={speakingWord !== null}
                                          title="Прослушать цитату"
                                        >
                                          <Volume2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground italic">
                                      "{quote.russian}"
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Full text analysis */}
                            {text.fullText && (
                              <div className="mt-6">
                                <h5 className="text-sm font-medium text-foreground mb-3">
                                  Полный текст и интерпретация:
                                </h5>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 mb-3 border border-white/10">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium text-foreground">
                                      Оригинал:
                                    </div>
                                    {speechSupported && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-7 w-7 p-0 ${
                                          speakingWord === `fulltext-${text.id}`
                                            ? "text-german-red animate-pulse dark:text-dark-theme-pink"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                                        }`}
                                        onClick={() =>
                                          handleSpeak(
                                            text.fullText,
                                            `fulltext-${text.id}`,
                                          )
                                        }
                                        disabled={speakingWord !== null}
                                        title="Прослушать отрывок"
                                      >
                                        <Volume2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground leading-relaxed font-mono whitespace-pre-line">
                                    {text.fullText}
                                  </div>
                                </div>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 mb-3 border border-white/10">
                                  <div className="text-sm font-medium text-foreground mb-2">
                                    Перевод:
                                  </div>
                                  <div className="text-sm text-muted-foreground leading-relaxed italic whitespace-pre-line">
                                    {text.fullTextTranslation}
                                  </div>
                                </div>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 mb-3 border border-white/10">
                                  <div className="text-sm font-medium text-foreground mb-2">
                                    Интерпретация:
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {text.interpretation}
                                  </div>
                                </div>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10">
                                  <div className="text-sm font-medium text-foreground mb-2">
                                    Исторический контекст:
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {text.historicalContext}
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Lesson section - улучшенный стиль для учебных материалов */}
                            {text.lesson && (
                              <div className="mt-8">
                                <h5 className="text-lg font-bold text-foreground mb-4 flex items-center">
                                  <BookOpen className="h-5 w-5 mr-2 text-emerald-400" />
                                  Учебные материалы
                                </h5>
                                <div className="bg-white/5 dark:bg-white/5 rounded-lg p-5 border border-white/10">
                                  <div className="text-md font-medium gradient-text mb-4">
                                    {text.lesson.title}
                                  </div>
                                  <div className="mb-4">
                                    <div className="text-sm font-medium text-foreground mb-2">
                                      Цели урока:
                                    </div>
                                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                      {text.lesson.objectives.map(
                                        (objective, i) => (
                                          <li
                                            key={`objective-${text.id}-${i}-${objective.substring(0, 10)}`}
                                          >
                                            {objective}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                  {text.lesson.exercises.map((exercise, i) => (
                                    <div
                                      key={`exercise-${text.id}-${i}-${exercise.title}`}
                                      className="mb-4 bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10"
                                    >
                                      <div className="text-sm font-medium text-foreground mb-2">
                                        {exercise.title}:
                                      </div>
                                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                        {exercise.tasks.map((task, j) => (
                                          <li
                                            key={`task-${text.id}-${i}-${j}-${task.substring(0, 10)}`}
                                          >
                                            {task}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                  <div className="mt-6">
                                    <div className="text-sm font-medium text-foreground mb-2">
                                      {text.lesson.homework.title}:
                                    </div>
                                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                      {text.lesson.homework.tasks.map(
                                        (task, i) => (
                                          <li
                                            key={`homework-${text.id}-${i}-${task.substring(0, 10)}`}
                                          >
                                            {task}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Text Details */}
                      <div className="space-y-6">
                        {/* Text Excerpt */}
                        <div className="bg-white/5 dark:bg-white/5 rounded-xl p-6 border border-white/10">
                          <h4 className="text-lg font-bold text-foreground mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <Quote className="h-5 w-5 mr-2 text-blue-400" />
                              Отрывок
                            </div>
                            {speechSupported && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-8 w-8 p-0 ${
                                  speakingWord === `excerpt-${text.id}`
                                    ? "text-german-red animate-pulse dark:text-dark-theme-pink"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/10"
                                }`}
                                onClick={() =>
                                  handleSpeak(
                                    text.excerpt.german,
                                    `excerpt-${text.id}`,
                                  )
                                }
                                disabled={speakingWord !== null}
                                title="Прослушать отрывок"
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            )}
                          </h4>
                          <div className="space-y-4">
                            <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10">
                              <div className="text-sm font-medium text-foreground mb-2">
                                Оригинал:
                              </div>
                              <div className="text-sm text-muted-foreground leading-relaxed font-mono whitespace-pre-line">
                                {text.excerpt.german}
                              </div>
                            </div>
                            <div className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10">
                              <div className="text-sm font-medium text-foreground mb-2">
                                Перевод:
                              </div>
                              <div className="text-sm text-muted-foreground leading-relaxed italic whitespace-pre-line">
                                {text.excerpt.russian}
                              </div>
                            </div>
                            <div className="bg-white/5 dark:bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="text-sm font-medium text-foreground mb-1">
                                Контекст:
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {text.excerpt.context}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Vocabulary */}
                        <div className="bg-white/5 dark:bg-white/5 rounded-xl p-6 border border-white/10">
                          <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-emerald-400" />
                            Ключевые слова
                          </h4>
                          <div className="space-y-3">
                            {text.vocabulary.map((word, wordIndex) => (
                              <div
                                key={`${text.id}-vocab-${word.word}`}
                                className="bg-white/5 dark:bg-white/5 rounded-lg p-4 border border-white/10"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold text-foreground text-sm mb-1">
                                    {word.word}
                                  </div>
                                  {speechSupported && (
                                    <SpeechButton word={word.word} />
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground mb-1">
                                  {word.translation}
                                </div>
                                <div className="text-xs text-muted-foreground/70 mb-2">
                                  {word.explanation}
                                </div>
                                <Badge className="text-xs text-[#000000] bg-[#a22525]">
                                  {word.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-white/5 dark:bg-white/5 border border-white/20 rounded-xl p-8 max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-emerald-400 mr-3" />
                <Pen className="h-6 w-6 text-teal-400" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Читайте и изучайте немецкий
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Погрузитесь в богатство немецкой литературы и изучайте язык
                через великие произведения
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/culture/holidays">
                  <Button variant="german" size="lg" className="group">
                    <Calendar className="h-5 w-5 mr-2" />
                    Изучить праздники
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/dictionary">
                  <Button variant="outline" size="lg" className="border-border">
                    <FileText className="h-5 w-5 mr-2" />
                    Открыть словарь
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
