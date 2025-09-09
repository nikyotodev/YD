"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Gift,
  PartyPopper,
  TreePine,
  Heart,
  Music,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MapPin,
  Clock,
  Users,
  Star,
  Sparkles,
  Crown,
  Flame,
  Wine,
  Snowflake,
  Sun,
  Moon,
  Coffee,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HolidayCalendar } from "@/components/HolidayCalendar";
// Holiday images mapping with fallback gradients
const getHolidayStyle = (holidayId: string) => {
  const styles = {
    weihnachten: {
      background: `linear-gradient(135deg, #1e3a8a, #dc2626, #b91c1c), url('https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=600&fit=crop&q=80')`,
      fallback: "linear-gradient(135deg, #1e3a8a, #dc2626, #b91c1c)"
    },
    oktoberfest: {
      background: `linear-gradient(135deg, #92400e, #f59e0b, #d97706), url('https://images.unsplash.com/photo-1566417109281-0039b46d5b99?w=800&h=600&fit=crop&q=80')`,
      fallback: "linear-gradient(135deg, #92400e, #f59e0b, #d97706)"
    },
    karneval: {
      background: `linear-gradient(135deg, #be185d, #ec4899, #db2777), url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&q=80')`,
      fallback: "linear-gradient(135deg, #be185d, #ec4899, #db2777)"
    },
    ostern: {
      background: `linear-gradient(135deg, #047857, #10b981, #059669), url('https://images.unsplash.com/photo-1489533119213-66a5cd877091?w=800&h=600&fit=crop&q=80')`,
      fallback: "linear-gradient(135deg, #047857, #10b981, #059669)"
    },
    "tag-der-deutschen-einheit": {
      background: `linear-gradient(135deg, #000000, #dc2626, #f59e0b), url('https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=800&h=600&fit=crop&q=80')`,
      fallback: "linear-gradient(135deg, #000000, #dc2626, #f59e0b)"
    }
  };
  return styles[holidayId as keyof typeof styles] || styles.weihnachten;
};
export default function HolidaysPage() {
  const [selectedHoliday, setSelectedHoliday] = useState<string | null>(null);
  const [showVocabulary, setShowVocabulary] = useState<{
    [key: string]: boolean;
  }>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const holidaySeasons = [
    {
      id: "winter",
      title: "Зимние праздники",
      description: "Рождество и Новый год",
      color: "bg-blue-500/20 text-blue-300",
      count: 8,
      icon: <Snowflake className="h-6 w-6" />,
    },
    {
      id: "spring",
      title: "Весенние праздники",
      description: "Пасха и майские торжества",
      color: "bg-green-500/20 text-green-300",
      count: 6,
      icon: <Sun className="h-6 w-6" />,
    },
    {
      id: "summer",
      title: "Летние фестивали",
      description: "Пивные фесты и народные гуляния",
      color: "bg-yellow-500/20 text-yellow-300",
      count: 5,
      icon: <Wine className="h-6 w-6" />,
    },
    {
      id: "autumn",
      title: "Осенние традиции",
      description: "Октоберфест и День единства",
      color: "bg-orange-500/20 text-orange-300",
      count: 6,
      icon: <Crown className="h-6 w-6" />,
    },
  ];
  const featuredHolidays = [
    {
      id: "weihnachten",
      title: "Weihnachten",
      subtitle: "Рождество",
      date: "24-26 декабря",
      region: "Вся Германия",
      type: "Религиозный",
      description:
        "Самый важный семейный праздник в Германии. Время адвента, рождественских ярмарок и семейных традиций.",
      culturalContext:
        "Немецкое Рождество славится своими традициями: адвент-календари, рождественские ярмарки (Weihnachtsmärkte), пряники (Lebkuchen) и глинтвейн (Glühwein).",
      traditions: [
        {
          german: "der Adventskalender",
          russian: "адвент-календарь",
          description: "Календарь с 24 окошками до Рождества",
          pronunciation: "[deːɐ̯ atˈvɛntskalɛndɐ]",
        },
        {
          german: "der Weihnachtsmarkt",
          russian: "рождественская ярмарка",
          description: "Традиционные рынки с подарками и едой",
          pronunciation: "[deːɐ̯ ˈvaɪnaxtsmaʁkt]",
        },
        {
          german: "der Glühwein",
          russian: "глинтвейн",
          description: "Горячее вино со специями",
          pronunciation: "[deːɐ̯ ˈɡlyːvaɪn]",
        },
        {
          german: "die Lebkuchen",
          russian: "пряники",
          description: "Традиционные рождественские печенья",
          pronunciation: "[diː ˈleːpkuːxn̩]",
        },
        {
          german: "der Tannenbaum",
          russian: "рождественская елка",
          description: "Украшенная ель - символ Рождества",
          pronunciation: "[deːɐ̯ ˈtanənbaʊm]",
        },
        {
          german: "das Christkind",
          russian: "младенец Христос",
          description: "Приносит подарки детям",
          pronunciation: "[das ˈkʁɪstkɪnt]",
        },
        {
          german: "der Weihnachtsmann",
          russian: "Дед Мороз",
          description: "Санта-Клаус в немецкой традиции",
          pronunciation: "[deːɐ̯ ˈvaɪnaxtsˌman]",
        },
        {
          german: "die Heiligabend",
          russian: "Сочельник",
          description: "Вечер перед Рождеством, 24 декабря",
          pronunciation: "[diː ˈhaɪlɪkˌaːbənt]",
        },
        {
          german: "die Bescherung",
          russian: "Вручение подарков",
          description: "Традиционная церемония дарения подарков",
          pronunciation: "[diː bəˈʃeːʁʊŋ]",
        },
      ],
      activities: [
        {
          german: "Plätzchen backen",
          russian: "печь печенье",
          time: "весь декабрь",
        },
        {
          german: "Weihnachtsmärkte besuchen",
          russian: "посещать рождественские ярмарки",
          time: "с конца ноября",
        },
        {
          german: "Geschenke verpacken",
          russian: "упаковывать подарки",
          time: "23-24 декабря",
        },
        {
          german: "Weihnachtslieder singen",
          russian: "петь рождественские песни",
          time: "весь сезон",
        },
        {
          german: "den Weihnachtsbaum schmücken",
          russian: "украшать рождественскую ёлку",
          time: "24 декабря",
        },
        {
          german: "die Weihnachtsmesse besuchen",
          russian: "посещать рождественскую службу",
          time: "24 декабря вечером",
        },
        {
          german: "Weihnachtsgeschichten vorlesen",
          russian: "читать рождественские истории",
          time: "вечер 24 декабря",
        },
      ],
      vocabulary: [
        {
          word: "bescheren",
          translation: "дарить подарки",
          type: "глагол",
          example: "Am Heiligabend wird beschert.",
        },
        {
          word: "schmücken",
          translation: "украшать",
          type: "глагол",
          example: "Wir schmücken den Tannenbaum.",
        },
        {
          word: "feiern",
          translation: "праздновать",
          type: "глагол",
          example: "Die Familie feiert zusammen.",
        },
        {
          word: "gemütlich",
          translation: "уютно",
          type: "прилагательное",
          example: "Es ist sehr gemütlich zu Hause.",
        },
        {
          word: "festlich",
          translation: "праздничный",
          type: "прилагательное",
          example: "Eine festliche Stimmung herrscht überall.",
        },
        {
          word: "heilig",
          translation: "святой",
          type: "прилагательное",
          example: "Die heilige Nacht wird gefeiert.",
        },
        {
          word: "besinnlich",
          translation: "созерцательный, задумчивый",
          type: "прилагательное",
          example: "Es ist eine besinnliche Zeit.",
        },
      ],
      history:
        "Традиция празднования Рождества в Германии имеет глубокие корни. Многие современные рождественские обычаи, такие как наряженная ёлка, рождественские венки и адвент-календари, пришли именно из Германии. Первая задокументированная рождественская ёлка была установлена в Страсбурге в 1539 году.",
      food: "Традиционное рождественское угощение включает штоллен (Stollen) - сладкий рождественский хлеб с сухофруктами, рождественское печенье (Weihnachtsplätzchen), жареного гуся или карпа. В каждом регионе есть свои особенные блюда.",
      popularSongs: [
        {
          german: "Stille Nacht, heilige Nacht",
          russian: "Тихая ночь, святая ночь",
        },
        { german: "O Tannenbaum", russian: "О, ёлочка" },
        { german: "Ihr Kinderlein, kommet", russian: "Придите, детки" },
      ],
      lesson: {
        title: "Урок немецкого: Рождество в Германии",
        objectives: [
          "Изучить лексику, связанную с Рождеством",
          "Познакомиться с рождественскими традициями в Германии",
          "Научиться использовать праздничные фразы и поздравления",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Соедините немецкие слова с их русскими эквивалентами",
              "Напишите 5 предложений, используя глаголы, связанные с празднованием Рождества",
              'Переведите поздравление "Frohe Weihnachten und ein glückliches neues Jahr!"',
            ],
          },
          {
            type: "listening",
            title: "Аудирование",
            tasks: [
              'Прослушайте рождественскую песню "Stille Nacht" и заполните пропуски в тексте',
              "Посмотрите видео о немецких рождественских традициях и ответьте на вопросы",
              "Прослушайте диалоги о планах на Рождество и определите, что каждый человек собирается делать",
            ],
          },
          {
            type: "speaking",
            title: "Разговорная практика",
            tasks: [
              "Опишите свои рождественские традиции на немецком языке",
              'Разыграйте диалог "Покупка подарков на рождественской ярмарке"',
              "Расскажите о различиях между празднованием Рождества в России и Германии",
            ],
          },
          {
            type: "cultural",
            title: "Культурные аспекты",
            tasks: [
              "Сравните роль Weihnachtsmann и Christkind в разных регионах Германии",
              "Изучите историю адвент-календаря и его значение",
              "Исследуйте разнообразие рождественских рынков в различных немецких городах",
            ],
          },
        ],
      },
    },
    {
      id: "oktoberfest",
      title: "Oktoberfest",
      subtitle: "Октоберфест",
      date: "Сентябрь-Октябрь",
      region: "Мюнхен, Бавария",
      type: "Народный",
      description:
        "Крупнейший пивной фестиваль в мире. Традиции, музыка, баварская кухня и, конечно, пиво.",
      culturalContext:
        "Октоберфест начался как королевская свадьба в 1810 году и превратился в символ баварской культуры. Более 6 миллионов посетителей ежегодно.",
      traditions: [
        {
          german: "die Maß",
          russian: "литровая кружка пива",
          description: "Традиционная мера пива",
          pronunciation: "[diː maːs]",
        },
        {
          german: "die Lederhose",
          russian: "кожаные штаны",
          description: "Традиционная баварская одежда для мужчин",
          pronunciation: "[diː ˈleːdɐhoːzə]",
        },
        {
          german: "das Dirndl",
          russian: "дирндль",
          description: "Традиционное баварское платье",
          pronunciation: "[das ˈdɪʁndl̩]",
        },
        {
          german: "die Blaskapelle",
          russian: "духовой оркестр",
          description: "Играет традиционную баварскую музыку",
          pronunciation: "[diː ˈblaːskapɛlə]",
        },
        {
          german: "das Bierzelt",
          russian: "пивная палатка",
          description: "Большие шатры для празднования",
          pronunciation: "[das ˈbiːɐ̯tsɛlt]",
        },
        {
          german: "die Brezel",
          russian: "крендель",
          description: "Традиционная баварская выпечка",
          pronunciation: "[diː ˈbreːtsl̩]",
        },
        {
          german: "der Anzapfen",
          russian: "церемония открытия бочки",
          description: "Официальное начало фестиваля",
          pronunciation: "[deːɐ̯ ˈantsapfən]",
        },
        {
          german: "die Wiesn",
          russian: "луг, местное название фестиваля",
          description: "Разговорное название Октоберфеста",
          pronunciation: "[diː ˈviːzn̩]",
        },
        {
          german: "die Festzug",
          russian: "праздничное шествие",
          description: "Парад в традиционных костюмах",
          pronunciation: "[diː ˈfɛsttsuːk]",
        },
      ],
      activities: [
        { german: "Bier trinken", russian: "пить пиво", time: "весь день" },
        {
          german: "Schuhplattler tanzen",
          russian: "танцевать шухплатлер",
          time: "вечером",
        },
        {
          german: "Schweinebraten essen",
          russian: "есть жареную свинину",
          time: "на обед",
        },
        {
          german: "Volksmusik hören",
          russian: "слушать народную музыку",
          time: "постоянно",
        },
        {
          german: "an Fahrgeschäften teilnehmen",
          russian: "кататься на аттракционах",
          time: "в течение дня",
        },
        {
          german: "traditionelle Trachten tragen",
          russian: "носить традиционные костюмы",
          time: "весь фестиваль",
        },
        {
          german: "am Festzug teilnehmen",
          russian: "участвовать в праздничном шествии",
          time: "в первый день",
        },
      ],
      vocabulary: [
        {
          word: "anzapfen",
          translation: "открывать бочку",
          type: "глагол",
          example: "Der Bürgermeister zapft das erste Fass an.",
        },
        {
          word: "prosit",
          translation: "за здоровье!",
          type: "междометие",
          example: "Prosit! Auf ein gutes Fest!",
        },
        {
          word: "zünftig",
          translation: "основательный, добротный",
          type: "прилагательное",
          example: "Das ist ein zünftiges Fest.",
        },
        {
          word: "g'suffa",
          translation: "выпито (баварский диалект)",
          type: "междометие",
          example: "Oans, zwoa, drei - g'suffa!",
        },
        {
          word: "trinkfest",
          translation: "выносливый к алкоголю",
          type: "прилагательное",
          example: "Er ist sehr trinkfest.",
        },
        {
          word: "feuchtfröhlich",
          translation: "весело с выпивкой",
          type: "прилагательное",
          example: "Eine feuchtfröhliche Feier.",
        },
        {
          word: "die Gaudi",
          translation: "веселье, развлечение",
          type: "существительное",
          example: "Wir haben eine große Gaudi.",
        },
      ],
      history:
        "Октоберфест берет начало 12 октября 1810 года, когда праздновали свадьбу кронпринца Людвига I и принцессы Терезы Саксонской-Хильдбургхаузской. Все жители Мюнхена были приглашены на празднование на лугах, которые с тех пор называют Терезиным лугом (Theresienwiese). С тех пор фестиваль проводится ежегодно, за исключением периодов войн и эпидемий.",
      food: "Традиционная еда на Октоберфесте включает жареную курицу (Hendl), жареную свинину (Schweinebraten), колбаски (Würstl), баварский сыр (Obatzda), крендели (Brezeln) и другие баварские специалитеты. Все блюда отлично сочетаются с пивом, специально сваренным для фестиваля.",
      beerTents:
        "На Октоберфесте устанавливают около 14 больших и 20 малых пивных палаток. Самые известные - Hofbräu-Festzelt, Paulaner и Löwenbräu. В каждой палатке может разместиться от 5000 до 10000 человек. Каждая пивоварня представляет свой особый сорт пива, сваренный специально для фестиваля.",
      lesson: {
        title: "Урок немецкого: Октоберфест и баварская культура",
        objectives: [
          "Изучить лексику, связанную с пивной культурой",
          "Познакомиться с баварскими традициями и диалектом",
          "Научиться использовать праздничные тосты и выражения",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Соедините названия традиционных блюд с их описаниями",
              "Переведите баварские диалектные выражения на литературный немецкий",
              "Составьте 5 предложений с словами, связанными с пивной культурой",
            ],
          },
          {
            type: "listening",
            title: "Аудирование",
            tasks: [
              "Прослушайте традиционные баварские песни и выпишите незнакомые слова",
              "Посмотрите видео об Октоберфесте и ответьте на вопросы",
              "Прослушайте диалоги в пивной палатке и определите, что заказывает каждый человек",
            ],
          },
          {
            type: "speaking",
            title: "Разговорная практика",
            tasks: [
              'Разыграйте диалог "Заказ пива и еды на Октоберфесте"',
              "Опишите традиционные баварские костюмы",
              "Подготовьте небольшой рассказ о традициях Октоберфеста",
            ],
          },
          {
            type: "cultural",
            title: "Культурные аспекты",
            tasks: [
              "Сравните баварскую кухню с кухней других регионов Германии",
              "Изучите историю баварского костюма и его символику",
              "Исследуйте различия между разными сортами баварского пива",
            ],
          },
        ],
      },
    },
    {
      id: "karneval",
      title: "Karneval",
      subtitle: "Карнавал",
      date: "Февраль-Март",
      region: "Рейнская область",
      type: "Народный",
      description:
        "Веселое время перед Великим постом. Костюмы, парады, музыка и веселье на улицах.",
      culturalContext:
        "Карнавал особенно популярен в Кёльне, Дюссельдорфе и Майнце. Это время, когда можно забыть о социальных условностях и повеселиться.",
      traditions: [
        {
          german: "der Rosenmontag",
          russian: "Розовый понедельник",
          description: "Главный день карнавала с парадами",
          pronunciation: "[deːɐ̯ ˈʁoːzn̩moːntaːk]",
        },
        {
          german: "das Kostüm",
          russian: "костюм",
          description: "Обязательный элемент карнавала",
          pronunciation: "[das kɔsˈtyːm]",
        },
        {
          german: "der Umzug",
          russian: "парад",
          description: "Красочное шествие по городу",
          pronunciation: "[deːɐ̯ ˈʊmtsuːk]",
        },
        {
          german: "die Kamelle",
          russian: "конфеты",
          description: "Сладости, которые бросают с повозок",
          pronunciation: "[diː kaˈmɛlə]",
        },
        {
          german: "das Dreigestirn",
          russian: "триумвират",
          description: "Принц, Крестьянин и Дева - символы карнавала",
          pronunciation: "[das ˈdʁaɪɡəʃtɪʁn]",
        },
        {
          german: "die Büttenrede",
          russian: "карнавальная речь",
          description: "Юмористические выступления в рифму",
          pronunciation: "[diː ˈbʏtn̩ʁeːdə]",
        },
        {
          german: "der Weiberfastnacht",
          russian: "женский карнавальный четверг",
          description: "День, когда женщины могут отрезать галстуки мужчинам",
          pronunciation: "[deːɐ̯ ˈvaɪbɐfastˌnaxt]",
        },
        {
          german: "die Karnevalssitzung",
          russian: "карнавальное заседание",
          description: "Официальные праздничные мероприятия",
          pronunciation: "[diː kaʁnəˈvalszɪtsʊŋ]",
        },
        {
          german: "der Aschermittwoch",
          russian: "пепельная среда",
          description: "Конец карнавала и начало поста",
          pronunciation: "[deːɐ̯ ˈaʃɐmɪtvɔx]",
        },
      ],
      activities: [
        {
          german: "sich verkleiden",
          russian: "переодеваться",
          time: "всю неделю",
        },
        {
          german: "Kamelle fangen",
          russian: "ловить конфеты",
          time: "во время парада",
        },
        {
          german: "schunkeln",
          russian: "покачиваться в ритм",
          time: "на вечеринках",
        },
        { german: "Kölsch trinken", russian: "пить кёльш", time: "постоянно" },
        {
          german: "an Umzügen teilnehmen",
          russian: "участвовать в парадах",
          time: "в течение фестиваля",
        },
        {
          german: "Büttenreden hören",
          russian: "слушать карнавальные речи",
          time: "на карнавальных заседаниях",
        },
        {
          german: "Karnevalslieder singen",
          russian: "петь карнавальные песни",
          time: "весь карнавал",
        },
      ],
      vocabulary: [
        {
          word: "helau",
          translation: "карнавальный возглас",
          type: "междометие",
          example: "Helau! - кричат в Дюссельдорфе",
        },
        {
          word: "alaaf",
          translation: "карнавальный возглас",
          type: "междометие",
          example: "Kölle Alaaf! - кричат в Кёльне",
        },
        {
          word: "jeck",
          translation: "сумасшедший (позитивно)",
          type: "прилагательное",
          example: "Die Jecken feiern auf der Straße.",
        },
        {
          word: "bunt",
          translation: "пестрый, яркий",
          type: "прилагательное",
          example: "Die Kostüme sind sehr bunt.",
        },
        {
          word: "verkleiden",
          translation: "переодеваться",
          type: "глагол",
          example: "Wir verkleiden uns als Piraten.",
        },
        {
          word: "feiern",
          translation: "праздновать",
          type: "глагол",
          example: "Die ganze Stadt feiert Karneval.",
        },
        {
          word: "die Narrenkappe",
          translation: "шутовской колпак",
          type: "существительное",
          example: "Er trägt eine bunte Narrenkappe.",
        },
      ],
      history:
        "Карнавальные традиции в Рейнской области восходят к дохристианским временам, когда люди изгоняли злых духов зимы шумными празднествами. В христианскую эпоху карнавал стал последним праздником перед строгим 40-дневным постом. Современный карнавал особенно развился в 19 веке, когда появились организованные карнавальные общества и парады.",
      food: "Традиционная еда карнавала включает пончики (Krapfen или Berliner), которые символизируют изобилие перед периодом поста. Также популярны крендели (Brezeln) и колбаски. В Кёльне часто подают местное пиво Kölsch, а в Дюссельдорфе - Altbier.",
      popularSongs: [
        { german: "Kölle Alaaf", russian: "Да здравствует Кёльн" },
        {
          german: "Am Aschermittwoch ist alles vorbei",
          russian: "В пепельную среду всё заканчивается",
        },
        { german: "Das Narrenschiff", russian: "Корабль дураков" },
      ],
      lesson: {
        title: "Урок немецкого: Карнавал в Рейнской области",
        objectives: [
          "Изучить лексику, связанную с карнавалом",
          "Познакомиться с региональными различиями в праздновании",
          "Научиться использовать карнавальные выражения и тосты",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Соедините названия карнавальных персонажей с их описаниями",
              "Переведите карнавальные лозунги и возгласы",
              "Составьте предложения с карнавальными терминами",
            ],
          },
          {
            type: "listening",
            title: "Аудирование",
            tasks: [
              "Прослушайте карнавальную песню и заполните пропуски в тексте",
              "Посмотрите видео с карнавального парада и опишите костюмы",
              "Прослушайте карнавальную речь (Büttenrede) и определите её тему",
            ],
          },
          {
            type: "speaking",
            title: "Разговорная практика",
            tasks: [
              "Опишите свой идеальный карнавальный костюм",
              'Разыграйте диалог "Приглашение на карнавальную вечеринку"',
              "Расскажите о различиях между карнавалами в разных городах Германии",
            ],
          },
          {
            type: "cultural",
            title: "Культурные аспекты",
            tasks: [
              "Сравните карнавальные традиции Кёльна и Дюссельдорфа",
              "Изучите историю карнавального триумвирата (Dreigestirn)",
              "Исследуйте социальную и политическую сатиру в карнавальных парадах",
            ],
          },
        ],
      },
    },
    {
      id: "ostern",
      title: "Ostern",
      subtitle: "Пасха",
      date: "Март-Апрель",
      region: "Вся Германия",
      type: "Религиозный",
      description:
        "Важный христианский праздник, символизирующий начало весны. Праздник включает множество традиций, связанных с яйцами и зайцами.",
      culturalContext:
        "Немецкая Пасха сочетает христианские обряды с древними языческими традициями, связанными с весенним возрождением природы.",
      traditions: [
        {
          german: "der Osterhase",
          russian: "пасхальный заяц",
          description: "Приносит детям пасхальные яйца",
          pronunciation: "[deːɐ̯ ˈoːstɐhaːzə]",
        },
        {
          german: "das Osterei",
          russian: "пасхальное яйцо",
          description: "Символ новой жизни и плодородия",
          pronunciation: "[das ˈoːstɐaɪ]",
        },
        {
          german: "das Osterfeuer",
          russian: "пасхальный костер",
          description: "Традиционный костер, зажигаемый в пасхальную ночь",
          pronunciation: "[das ˈoːstɐfɔʏɐ]",
        },
        {
          german: "der Osterstrauß",
          russian: "пасхальный букет",
          description: "Ветви с украшенными яйцами",
          pronunciation: "[deːɐ̯ ˈoːstɐʃtʁaʊs]",
        },
        {
          german: "das Osternest",
          russian: "пасхальное гнездо",
          description: "Гнездо с яйцами и сладостями для детей",
          pronunciation: "[das ˈoːstɐnɛst]",
        },
        {
          german: "der Gründonnerstag",
          russian: "Чистый четверг",
          description: "Четверг перед Пасхой",
          pronunciation: "[deːɐ̯ ˈɡʁyːnˌdɔnɐstaːk]",
        },
        {
          german: "der Karfreitag",
          russian: "Страстная пятница",
          description: "Пятница перед Пасхой, день распятия Христа",
          pronunciation: "[deːɐ̯ ˈkaːɐ̯fʁaɪtaːk]",
        },
        {
          german: "der Ostersonntag",
          russian: "Пасхальное воскресенье",
          description: "Главный день праздника",
          pronunciation: "[deːɐ̯ ˈoːstɐzɔntaːk]",
        },
        {
          german: "der Ostermontag",
          russian: "Пасхальный понедельник",
          description: "Второй день Пасхи, выходной в Германии",
          pronunciation: "[deːɐ̯ ˈoːstɐmoːntaːk]",
        },
      ],
      activities: [
        {
          german: "Ostereier bemalen",
          russian: "раскрашивать пасхальные яйца",
          time: "перед Пасхой",
        },
        {
          german: "Ostereier suchen",
          russian: "искать пасхальные яйца",
          time: "утром в воскресенье",
        },
        {
          german: "Osterfeuer besuchen",
          russian: "посещать пасхальный костер",
          time: "в субботу вечером",
        },
        {
          german: "Osterlamm backen",
          russian: "печь пасхального ягненка",
          time: "перед праздником",
        },
        {
          german: "die Osternacht feiern",
          russian: "праздновать пасхальную ночь",
          time: "суббота-воскресенье",
        },
        {
          german: "Osterspaziergang machen",
          russian: "совершать пасхальную прогулку",
          time: "в воскресенье",
        },
        {
          german: "Osterbrunch genießen",
          russian: "наслаждаться пасхальным бранчем",
          time: "в воскресенье днем",
        },
      ],
      vocabulary: [
        {
          word: "feiern",
          translation: "праздновать",
          type: "глагол",
          example: "Wir feiern Ostern mit der Familie.",
        },
        {
          word: "bemalen",
          translation: "разрисовывать",
          type: "глагол",
          example: "Die Kinder bemalen die Ostereier.",
        },
        {
          word: "verstecken",
          translation: "прятать",
          type: "глагол",
          example: "Der Osterhase versteckt die Eier im Garten.",
        },
        {
          word: "suchen",
          translation: "искать",
          type: "глагол",
          example: "Am Morgen suchen wir die Ostereier.",
        },
        {
          word: "bunt",
          translation: "разноцветный",
          type: "прилагательное",
          example: "Die Ostereier sind sehr bunt.",
        },
        {
          word: "auferstehen",
          translation: "воскресать",
          type: "глагол",
          example: "Jesus ist an Ostern auferstanden.",
        },
        {
          word: "der Frühling",
          translation: "весна",
          type: "существительное",
          example: "Ostern ist ein Frühlingsfest.",
        },
      ],
      history:
        'Немецкое слово "Ostern" происходит от имени германской богини весны Остары (Ostara). После христианизации Германии языческий праздник весны был объединен с христианским празднованием воскрешения Христа. Традиция пасхального зайца, приносящего яйца, возникла в Германии в 16 веке.',
      food: "Традиционные пасхальные блюда включают пасхального ягненка (Osterlamm) - выпечку в форме ягненка, символизирующую жертву Христа; пасхальный хлеб (Osterbrot) с изюмом и миндалем; зеленый соус (Grüne Soße) - франкфуртское блюдо из семи трав, которое традиционно едят в Чистый четверг.",
      symbols:
        "Основные символы немецкой Пасхи: яйца (символ новой жизни), заяц (символ плодородия), ягненок (символ Христа), огонь (символ очищения и воскрешения) и вода (символ крещения и очищения). В некоторых регионах Германии есть также пасхальные колеса (Osterräder) - горящие колеса, которые катят с холма.",
      lesson: {
        title: "Урок немецкого: Пасха и весенние традиции",
        objectives: [
          "Изучить лексику, связанную с Пасхой и весной",
          "Познакомиться с пасхальными традициями в разных регионах Германии",
          "Научиться использовать праздничные пасхальные пожелания",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Соедините пасхальные термины с их изображениями",
              "Заполните пропуски в тексте о пасхальных традициях",
              "Выучите названия пасхальных блюд и опишите их",
            ],
          },
          {
            type: "listening",
            title: "Аудирование",
            tasks: [
              "Прослушайте рассказ о пасхальных традициях и ответьте на вопросы",
              "Посмотрите видео о приготовлении пасхального ягненка и запишите рецепт",
              "Прослушайте диалоги о планах на Пасху и определите, кто что будет делать",
            ],
          },
          {
            type: "speaking",
            title: "Разговорная практика",
            tasks: [
              "Опишите пасхальные традиции вашей семьи",
              'Разыграйте диалог "Приглашение на пасхальный бранч"',
              "Сравните пасхальные традиции в России и Германии",
            ],
          },
          {
            type: "cultural",
            title: "Культурные аспекты",
            tasks: [
              "Исследуйте региональные различия в праздновании Пасхи в Германии",
              "Изучите символику пасхальных яиц и их украшения",
              "Узнайте о языческих корнях пасхальных традиций",
            ],
          },
        ],
      },
    },
    {
      id: "tag-der-deutschen-einheit",
      title: "Tag der Deutschen Einheit",
      subtitle: "День немецкого единства",
      date: "3 октября",
      region: "Вся Германия",
      type: "Государственный",
      description:
        "Национальный праздник Германии, отмечающий воссоединение страны в 1990 году после падения Берлинской стены.",
      culturalContext:
        "Этот день напоминает о важном историческом событии - объединении Восточной и Западной Германии и окончании холодной войны в Европе.",
      traditions: [
        {
          german: "die Einheitsfeier",
          russian: "празднование единства",
          description: "Официальные торжества",
          pronunciation: "[diː ˈaɪnhaɪtsˌfaɪɐ]",
        },
        {
          german: "die Bürgerfest",
          russian: "гражданский праздник",
          description: "Народные гуляния",
          pronunciation: "[diː ˈbʏʁɡɐfɛst]",
        },
        {
          german: "die Deutschlandfahne",
          russian: "немецкий флаг",
          description: "Черно-красно-золотой флаг",
          pronunciation: "[diː ˈdɔytʃlantˌfaːnə]",
        },
        {
          german: "die Rede des Bundespräsidenten",
          russian: "речь федерального президента",
          description: "Традиционное обращение",
          pronunciation: "[diː ˈʁeːdə dɛs ˈbʊndəspʁɛziˌdɛntn̩]",
        },
        {
          german: "die Gaststadt",
          russian: "город-хозяин",
          description: "Город, проводящий основные торжества",
          pronunciation: "[diː ˈɡastʃtat]",
        },
        {
          german: "das Feuerwerk",
          russian: "фейерверк",
          description: "Праздничный салют",
          pronunciation: "[das ˈfɔʏɐvɛʁk]",
        },
      ],
      activities: [
        {
          german: "an offiziellen Feierlichkeiten teilnehmen",
          russian: "участвовать в официальных торжествах",
          time: "днем",
        },
        {
          german: "die Nationalhymne singen",
          russian: "петь национальный гимн",
          time: "во время церемоний",
        },
        {
          german: "das Bürgerfest besuchen",
          russian: "посещать народные гуляния",
          time: "весь день",
        },
        {
          german: "die Rede des Bundespräsidenten hören",
          russian: "слушать речь федерального президента",
          time: "утром",
        },
        {
          german: "Ausstellungen zur deutschen Geschichte besuchen",
          russian: "посещать выставки по истории Германии",
          time: "в течение дня",
        },
      ],
      vocabulary: [
        {
          word: "die Einheit",
          translation: "единство",
          type: "существительное",
          example: "Die deutsche Einheit wurde am 3. Oktober 1990 vollzogen.",
        },
        {
          word: "die Wiedervereinigung",
          translation: "воссоединение",
          type: "существительное",
          example: "Die Wiedervereinigung war ein historisches Ereignis.",
        },
        {
          word: "feiern",
          translation: "праздновать",
          type: "глагол",
          example: "Wir feiern den Tag der Deutschen Einheit.",
        },
        {
          word: "national",
          translation: "национальный",
          type: "прилагательное",
          example: "Es ist ein nationaler Feiertag.",
        },
        {
          word: "die Freiheit",
          translation: "свобода",
          type: "существительное",
          example: "Die Freiheit ist ein wichtiger Wert.",
        },
        {
          word: "die Mauer",
          translation: "стена",
          type: "существительное",
          example: "Der Fall der Berliner Mauer im Jahr 1989.",
        },
        {
          word: "friedlich",
          translation: "мирный",
          type: "прилагательное",
          example: "Die friedliche Revolution führte zur Einheit.",
        },
      ],
      history:
        'День немецкого единства отмечает официальное воссоединение Германии 3 октября 1990 года. После падения Берлинской стены 9 ноября 1989 года начался процесс объединения. Была выбрана дата 3 октября, а не 9 ноября, чтобы избежать ассоциации с "Хрустальной ночью" 1938 года и провозглашением Веймарской республики в 1918 году.',
      celebration:
        "Празднование проходит во всей Германии, но основные мероприятия организуются в городе, который в данный год председательствует в Бундesratе (федеральном совете). Программа обычно включает официальные церемонии, концерты, выставки, народные гуляния и фейерверки.",
      symbols:
        "Основные символы праздника - национальный флаг Германии (черно-красно-золотой), герб (орел) и цвета национального флага в праздничном оформлении. Важным символом также является изображение Бранденбургских ворот - символа разделения и последующего воссоединения Берлина и всей Германии.",
      lesson: {
        title: "Урок немецкого: День немецкого единства и новейшая история",
        objectives: [
          "Изучить лексику, связанную с политической историей Германии",
          "Познакомиться с событиями, приведшими к воссоединению Германии",
          "Научиться обсуждать исторические и политические темы на немецком",
        ],
        exercises: [
          {
            type: "vocabulary",
            title: "Словарный запас",
            tasks: [
              "Соедините исторические термины с их определениями",
              "Заполните пропуски в тексте о падении Берлинской стены",
              "Переведите новостные заголовки о Дне немецкого единства",
            ],
          },
          {
            type: "listening",
            title: "Аудирование",
            tasks: [
              "Прослушайте речь политика о значении объединения и выделите ключевые моменты",
              "Посмотрите документальный фильм о воссоединении Германии и ответьте на вопросы",
              "Прослушайте интервью с очевидцами падения Берлинской стены",
            ],
          },
          {
            type: "speaking",
            title: "Разговорная практика",
            tasks: [
              "Обсудите значение национальных праздников для сохранения исторической памяти",
              "Разыграйте интервью с очевидцем событий 1989-1990 годов",
              "Подготовьте краткое сообщение о различиях между бывшей ГДР и ФРГ",
            ],
          },
          {
            type: "cultural",
            title: "Культурные аспекты",
            tasks: [
              "Изучите влияние разделения и воссоединения на культуру Германии",
              "Сравните праздники и символы бывшей ГДР и ФРГ",
              "Исследуйте экономические и социальные последствия объединения Германии",
            ],
          },
        ],
      },
    },
  ];
  const toggleVocabulary = (holidayId: string) => {
    setShowVocabulary((prev) => ({
      ...prev,
      [holidayId]: !prev[holidayId],
    }));
  };
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-german-red/10 to-german-gold/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-german-gold/10 to-german-red/10 rounded-full blur-3xl animate-float animation-delay-2000" />
          </div>
          <div className="relative container mx-auto px-4">
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
                <PartyPopper className="h-4 w-4 mr-2 text-german-red" />
                <span className="gradient-text font-medium">
                  Deutsche Feste
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black gradient-text mb-6">
                Немецкие праздники
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Изучайте немецкий через традиции и праздники. Погружайтесь в
                культуру, изучайте праздничную лексику и понимайте немецкие
                традиции.
              </p>
              {/* Holiday Seasons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
                {holidaySeasons.map((season, index) => (
                  <div
                    key={season.id}
                    className="glass-card text-center group cursor-pointer"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div className={`glass p-3 rounded-full ${season.color}`}>
                        {season.icon}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-foreground mb-1 group-hover:gradient-text transition-all">
                      {season.title}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {season.description}
                    </div>
                    <Badge className="glass-nav text-xs">
                      {season.count} праздников
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Interactive Calendar */}
        <section className="py-8 bg-gradient-to-r from-german-red/5 to-german-gold/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Button
                onClick={() => setShowCalendar(!showCalendar)}
                variant="outline"
                size="lg"
                className="glass glass-hover"
              >
                <CalendarDays className="h-5 w-5 mr-2" />
                {showCalendar
                  ? "Скрыть календарь"
                  : "Показать календарь праздников"}
              </Button>
            </div>
            {showCalendar && (
              <div className="max-w-4xl mx-auto">
                <HolidayCalendar
                  onHolidaySelect={(holiday) => {
                  }}
                />
              </div>
            )}
          </div>
        </section>
        {/* Featured Holidays */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black gradient-text mb-4">
                Главные праздники
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Изучайте язык через немецкие традиции и праздничную культуру
              </p>
            </div>
            <div className="space-y-8 max-w-6xl mx-auto">
              {featuredHolidays.map((holiday, index) => (
                <Card
                  key={holiday.id}
                  className="glass-card bg-gradient-to-r from-white/5 to-white/10 border border-white/20 overflow-hidden"
                >
                  {/* Hero Image Section */}
                  <div className="relative h-64 md:h-80">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${getHolidayImage(holiday.id)})`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-german-red/20 to-german-gold/20 dark:from-dark-theme-purple/20 dark:to-dark-theme-pink/20" />
                    {/* Holiday Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
                            {holiday.title}
                          </h3>
                          <p className="text-xl text-white/90 mb-3 drop-shadow">
                            {holiday.subtitle}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-white/80">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {holiday.date}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {holiday.region}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          {holiday.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
                    {/* Holiday Info */}
                    <div className="space-y-6">
                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {holiday.description}
                      </p>
                      {/* Cultural Context */}
                      <div className="glass bg-white/5 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm font-medium text-foreground">
                            Культурный контекст:
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {holiday.culturalContext}
                        </p>
                      </div>
                      {/* Controls */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <GradientButton
                            variant="german"
                            onClick={() => toggleVocabulary(holiday.id)}
                            className="h-10 px-6 text-sm font-semibold"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            {showVocabulary[holiday.id]
                              ? "Скрыть словарь"
                              : "Показать словарь"}
                          </GradientButton>
                          <Button variant="ghost" className="glass glass-hover">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Vocabulary - moved right under the button */}
                        {showVocabulary[holiday.id] && (
                          <div className="glass bg-white/5 rounded-xl p-6 animate-slide-up">
                            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
                              <BookOpen className="h-5 w-5 mr-2" />
                              Праздничный словарь
                            </h4>
                            <div className="space-y-3">
                              {holiday.vocabulary.map((word, wordIndex) => (
                                <div
                                  key={`vocab-${holiday.id}-${wordIndex}-${word.word}`}
                                  className="glass-nav p-3 hover-lift"
                                >
                                  <div className="font-semibold text-foreground text-sm">
                                    {word.word}
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    {word.translation}
                                  </div>
                                  <div className="text-xs text-muted-foreground/70 mb-2">
                                    {word.example}
                                  </div>
                                  <Badge className="text-xs bg-german-red/20 text-german-red border-german-red/30">
                                    {word.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Holiday Details */}
                    <div className="space-y-6">
                      {/* Traditions */}
                      <div className="glass bg-white/5 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
                          <Gift className="h-5 w-5 mr-2" />
                          Традиции
                        </h4>
                        <div className="space-y-3">
                          {holiday.traditions.map(
                            (tradition, traditionIndex) => (
                              <div
                                key={`tradition-${holiday.id}-${traditionIndex}-${tradition.german}`}
                                className="glass-nav p-3"
                              >
                                <div className="font-semibold text-foreground text-sm mb-1">
                                  {tradition.german}
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  {tradition.russian}
                                </div>
                                <div className="text-xs text-muted-foreground/70 mb-2">
                                  {tradition.description}
                                </div>
                                {showVocabulary[holiday.id] && (
                                  <div className="text-xs text-muted-foreground/70 font-mono">
                                    {tradition.pronunciation}
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      {/* Activities */}
                      <div className="glass bg-white/5 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
                          <PartyPopper className="h-5 w-5 mr-2" />
                          Праздничные активности
                        </h4>
                        <div className="space-y-4">
                          {holiday.activities.map((activity, activityIndex) => (
                            <div
                              key={`activity-${holiday.id}-${activityIndex}-${activity.german}`}
                              className="flex items-start space-x-4"
                            >
                              <div className="glass-nav w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {activityIndex + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-foreground text-sm">
                                  {activity.german}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {activity.russian}
                                </div>
                                <Badge className="text-xs mt-1 bg-german-gold/20 text-german-gold border-german-gold/30">
                                  {activity.time}
                                </Badge>
                              </div>
                            </div>
                          ))}
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
            <div className="glass-card max-w-4xl mx-auto text-center bg-gradient-to-br from-german-red/10 to-german-gold/10 border border-white/20">
              <div className="flex items-center justify-center mb-6">
                <PartyPopper className="h-8 w-8 text-german-red mr-3" />
                <Sparkles className="h-6 w-6 text-german-gold animate-pulse" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                Празднуйте и изучайте немецкий
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Погрузитесь в немецкую праздничную культуру и изучайте язык
                через традиции и веселье
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/culture/literature">
                  <Button variant="german" size="lg" className="group">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Изучить литературу
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button
                    variant="outline"
                    size="lg"
                    className="glass glass-hover border-border"
                  >
                    <Coffee className="h-5 w-5 mr-2" />
                    Спросить у Эмилии
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
