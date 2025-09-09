import type { GermanLevel } from "@/types/level-test";
export interface LevelSpecificQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: "grammar" | "vocabulary" | "reading" | "listening";
}
export interface LevelTestResult {
  level: GermanLevel;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passThreshold: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedAnswer: number;
    selectedAnswerText: string;
    isCorrect: boolean;
    question: string;
    correctAnswer: string;
    explanation: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  timeSpent: number;
}
// A1 Тест - Начальный уровень
const A1_QUESTIONS: LevelSpecificQuestion[] = [
  {
    id: "a1_01",
    question: "Как правильно поздороваться утром по-немецки?",
    options: ["Guten Abend", "Guten Morgen", "Gute Nacht", "Auf Wiedersehen"],
    correctAnswer: 1,
    explanation: "Guten Morgen означает 'доброе утро' и используется до полудня",
    category: "vocabulary"
  },
  {
    id: "a1_02",
    question: "Выберите правильную форму глагола: Ich ___ Peter.",
    options: ["bin", "heiße", "ist", "sind"],
    correctAnswer: 1,
    explanation: "Для представления себя используется глагол 'heißen' - ich heiße",
    category: "grammar"
  },
  {
    id: "a1_03",
    question: "Как сказать 'Меня зовут Анна' по-немецки?",
    options: ["Ich bin Anna", "Ich heiße Anna", "Mein Name Anna", "Ich komme Anna"],
    correctAnswer: 1,
    explanation: "Ich heiße Anna - стандартный способ представиться",
    category: "vocabulary"
  },
  {
    id: "a1_04",
    question: "Какой артикль у слова 'Frau' (женщина)?",
    options: ["der", "die", "das", "den"],
    correctAnswer: 1,
    explanation: "Die Frau - женский род, артикль 'die'",
    category: "grammar"
  },
  {
    id: "a1_05",
    question: "Как сказать 'Спасибо' по-немецки?",
    options: ["Bitte", "Danke", "Tschüss", "Hallo"],
    correctAnswer: 1,
    explanation: "Danke означает 'спасибо'",
    category: "vocabulary"
  },
  {
    id: "a1_06",
    question: "Выберите правильную форму: Du ___ aus Deutschland.",
    options: ["bin", "bist", "kommst", "komme"],
    correctAnswer: 2,
    explanation: "Du kommst - ты приходишь/происходишь. Для 'du' используется окончание -st",
    category: "grammar"
  },
  {
    id: "a1_07",
    question: "Что означает 'Entschuldigung'?",
    options: ["Спасибо", "Пожалуйста", "Извините", "До свидания"],
    correctAnswer: 2,
    explanation: "Entschuldigung означает 'извините' или 'простите'",
    category: "vocabulary"
  },
  {
    id: "a1_08",
    question: "Как правильно спросить 'Как дела?' по-немецки?",
    options: ["Wie alt bist du?", "Wie heißt du?", "Wie geht es dir?", "Wo wohnst du?"],
    correctAnswer: 2,
    explanation: "Wie geht es dir? - Как дела? (неформально)",
    category: "vocabulary"
  },
  {
    id: "a1_09",
    question: "Выберите правильную форму множественного числа от 'das Auto':",
    options: ["die Auto", "die Autos", "das Autos", "der Autos"],
    correctAnswer: 1,
    explanation: "Die Autos - множественное число, артикль всегда 'die'",
    category: "grammar"
  },
  {
    id: "a1_10",
    question: "Как сказать 'Я не понимаю' по-немецки?",
    options: ["Ich verstehe nicht", "Ich spreche nicht", "Ich weiß nicht", "Ich kann nicht"],
    correctAnswer: 0,
    explanation: "Ich verstehe nicht - я не понимаю",
    category: "vocabulary"
  },
  {
    id: "a1_11",
    question: "Какой артикль у слова 'Kind' (ребенок)?",
    options: ["der", "die", "das", "dem"],
    correctAnswer: 2,
    explanation: "Das Kind - средний род",
    category: "grammar"
  },
  {
    id: "a1_12",
    question: "Как сказать 'Пожалуйста' (в значении 'не за что') по-немецки?",
    options: ["Danke", "Bitte", "Gern geschehen", "Entschuldigung"],
    correctAnswer: 2,
    explanation: "Gern geschehen - пожалуйста (в ответ на спасибо)",
    category: "vocabulary"
  },
  {
    id: "a1_13",
    question: "Выберите правильную форму: Wir ___ in Berlin.",
    options: ["wohnt", "wohnen", "wohnst", "wohne"],
    correctAnswer: 1,
    explanation: "Wir wohnen - мы живем. Для 'wir' используется форма с окончанием -en",
    category: "grammar"
  },
  {
    id: "a1_14",
    question: "Что означает 'Auf Wiedersehen'?",
    options: ["Привет", "До свидания", "Добро пожаловать", "Извините"],
    correctAnswer: 1,
    explanation: "Auf Wiedersehen - до свидания (формально)",
    category: "vocabulary"
  },
  {
    id: "a1_15",
    question: "Как правильно сказать 'Мне 25 лет'?",
    options: ["Ich habe 25 Jahre", "Ich bin 25 Jahre alt", "Ich 25 Jahre", "Mein 25 Jahre"],
    correctAnswer: 1,
    explanation: "Ich bin 25 Jahre alt - мне 25 лет",
    category: "grammar"
  },
  {
    id: "a1_16",
    question: "Что означает 'Wie bitte?'",
    options: ["Как дела?", "Что, простите?", "Как зовут?", "Сколько стоит?"],
    correctAnswer: 1,
    explanation: "Wie bitte? - что, простите? (переспрос)",
    category: "vocabulary"
  },
  {
    id: "a1_17",
    question: "Выберите правильную форму: Er ___ Lehrer.",
    options: ["bin", "bist", "ist", "sind"],
    correctAnswer: 2,
    explanation: "Er ist Lehrer - он учитель. Для 'er' используется 'ist'",
    category: "grammar"
  },
  {
    id: "a1_18",
    question: "Как сказать 'Хорошего дня!' по-немецки?",
    options: ["Guten Tag!", "Schönen Tag!", "Gute Nacht!", "Bis morgen!"],
    correctAnswer: 1,
    explanation: "Schönen Tag! - хорошего дня!",
    category: "vocabulary"
  },
  {
    id: "a1_19",
    question: "Какой артикль у слова 'Buch' (книга)?",
    options: ["der", "die", "das", "den"],
    correctAnswer: 2,
    explanation: "Das Buch - средний род",
    category: "grammar"
  },
  {
    id: "a1_20",
    question: "Как спросить 'Сколько это стоит?' по-немецки?",
    options: ["Wie viel kostet das?", "Wie alt ist das?", "Wo ist das?", "Wann ist das?"],
    correctAnswer: 0,
    explanation: "Wie viel kostet das? - сколько это стоит?",
    category: "vocabulary"
  }
];
// A2 Тест - Элементарный уровень
const A2_QUESTIONS: LevelSpecificQuestion[] = [
  {
    id: "a2_01",
    question: "Выберите правильную форму прошедшего времени: Gestern ___ ich ins Kino gegangen.",
    options: ["habe", "bin", "hatte", "war"],
    correctAnswer: 1,
    explanation: "Глагол 'gehen' образует перфект с 'sein' - ich bin gegangen",
    category: "grammar"
  },
  {
    id: "a2_02",
    question: "Что означает 'trotzdem'?",
    options: ["поэтому", "несмотря на это", "например", "сначала"],
    correctAnswer: 1,
    explanation: "trotzdem - несмотря на это, тем не менее",
    category: "vocabulary"
  },
  {
    id: "a2_03",
    question: "Выберите правильный предлог: Ich fahre ___ dem Auto zur Arbeit.",
    options: ["mit", "von", "zu", "bei"],
    correctAnswer: 0,
    explanation: "mit dem Auto - на машине (инструмент передвижения)",
    category: "grammar"
  },
  {
    id: "a2_04",
    question: "Как сказать 'Мне нужно...' по-немецки?",
    options: ["Ich will...", "Ich muss...", "Ich kann...", "Ich soll..."],
    correctAnswer: 1,
    explanation: "Ich muss... - мне нужно/я должен",
    category: "vocabulary"
  },
  {
    id: "a2_05",
    question: "Выберите правильную форму дательного падежа: Ich gebe ___ Freund das Buch.",
    options: ["der", "dem", "den", "des"],
    correctAnswer: 1,
    explanation: "dem Freund - дательный падеж мужского рода",
    category: "grammar"
  },
  {
    id: "a2_06",
    question: "Что означает 'sich freuen auf'?",
    options: ["грустить о", "радоваться предстоящему", "сердиться на", "думать о"],
    correctAnswer: 1,
    explanation: "sich freuen auf - радоваться предстоящему событию",
    category: "vocabulary"
  },
  {
    id: "a2_07",
    question: "Выберите правильную форму: Wenn ich Zeit hätte, ___ ich reisen.",
    options: ["würde", "werde", "werde", "will"],
    correctAnswer: 0,
    explanation: "Conditional würde + инфинитив для выражения нереальных условий",
    category: "grammar"
  },
  {
    id: "a2_08",
    question: "Как сказать 'заказать столик' в ресторане?",
    options: ["einen Tisch bestellen", "einen Tisch reservieren", "einen Tisch kaufen", "einen Tisch nehmen"],
    correctAnswer: 1,
    explanation: "einen Tisch reservieren - забронировать столик",
    category: "vocabulary"
  },
  {
    id: "a2_09",
    question: "Выберите правильную форму сравнительной степени: Das Auto ist ___ als das Fahrrad.",
    options: ["schnell", "schneller", "am schnellsten", "mehr schnell"],
    correctAnswer: 1,
    explanation: "schneller - быстрее (сравнительная степень)",
    category: "grammar"
  },
  {
    id: "a2_10",
    question: "Что означает 'umziehen'?",
    options: ["переодеваться", "переезжать", "оба варианта", "покупать"],
    correctAnswer: 2,
    explanation: "umziehen может означать и 'переодеваться', и 'переезжать'",
    category: "vocabulary"
  },
  {
    id: "a2_11",
    question: "Выберите правильную форму: Ich ___ gern Pizza.",
    options: ["esse", "isst", "essen", "aß"],
    correctAnswer: 0,
    explanation: "ich esse - я ем (настоящее время, 1 лицо ед.ч.)",
    category: "grammar"
  },
  {
    id: "a2_12",
    question: "Как спросить дорогу по-немецки?",
    options: ["Wo ist der Weg?", "Können Sie mir den Weg zeigen?", "Wie ist der Weg?", "Wann ist der Weg?"],
    correctAnswer: 1,
    explanation: "Können Sie mir den Weg zeigen? - можете показать мне дорогу?",
    category: "vocabulary"
  },
  {
    id: "a2_13",
    question: "Выберите правильную форму возвратного местоимения: Er wäscht ___ die Hände.",
    options: ["sich", "ihm", "ihn", "sein"],
    correctAnswer: 0,
    explanation: "sich waschen - мыться (возвратный глагол)",
    category: "grammar"
  },
  {
    id: "a2_14",
    question: "Что означает 'Feierabend'?",
    options: ["праздник", "конец рабочего дня", "отпуск", "выходной"],
    correctAnswer: 1,
    explanation: "Feierabend - конец рабочего дня",
    category: "vocabulary"
  },
  {
    id: "a2_15",
    question: "Выберите правильную форму модального глагола: Du ___ hier nicht rauchen.",
    options: ["kannst", "darfst", "musst", "sollst"],
    correctAnswer: 1,
    explanation: "Du darfst nicht - тебе нельзя (запрет)",
    category: "grammar"
  },
  {
    id: "a2_16",
    question: "Как сказать 'делать покупки' по-немецки?",
    options: ["Einkaufen gehen", "Verkaufen gehen", "Kaufen machen", "Shopping machen"],
    correctAnswer: 0,
    explanation: "einkaufen gehen - идти за покупками",
    category: "vocabulary"
  },
  {
    id: "a2_17",
    question: "Выберите правильную форму притяжательного местоимения: Das ist ___ Schwester. (моя)",
    options: ["mein", "meine", "meiner", "meinem"],
    correctAnswer: 1,
    explanation: "meine Schwester - моя сестра (женский род, именительный падеж)",
    category: "grammar"
  },
  {
    id: "a2_18",
    question: "Что означает 'Stau'?",
    options: ["остановка", "пробка", "авария", "дорога"],
    correctAnswer: 1,
    explanation: "der Stau - пробка на дороге",
    category: "vocabulary"
  },
  {
    id: "a2_19",
    question: "Выберите правильную форму: ___ wir ins Kino gehen?",
    options: ["Sollen", "Wollen", "Können", "Müssen"],
    correctAnswer: 1,
    explanation: "Wollen wir...? - хотим ли мы...? (предложение)",
    category: "grammar"
  },
  {
    id: "a2_20",
    question: "Как сказать 'записаться на прием к врачу'?",
    options: ["zum Arzt schreiben", "einen Termin beim Arzt machen", "zum Arzt anrufen", "den Arzt besuchen"],
    correctAnswer: 1,
    explanation: "einen Termin beim Arzt machen - записаться на прием к врачу",
    category: "vocabulary"
  }
];
// B1 Тест - Средний уровень
const B1_QUESTIONS: LevelSpecificQuestion[] = [
  {
    id: "b1_01",
    question: "Выберите правильную форму конъюнктива II: Wenn ich reich wäre, ___ ich um die Welt reisen.",
    options: ["würde", "werde", "wurde", "will"],
    correctAnswer: 0,
    explanation: "würde + инфинитив для выражения нереальных желаний",
    category: "grammar"
  },
  {
    id: "b1_02",
    question: "Что означает 'sich durchsetzen'?",
    options: ["сесть", "добиться своего", "пройти через", "поставить"],
    correctAnswer: 1,
    explanation: "sich durchsetzen - добиться своего, утвердиться",
    category: "vocabulary"
  },
  {
    id: "b1_03",
    question: "Выберите правильный союз: Er arbeitet hart, ___ er Erfolg haben will.",
    options: ["weil", "obwohl", "damit", "wenn"],
    correctAnswer: 0,
    explanation: "'weil' выражает причину - он работает, потому что хочет успеха",
    category: "grammar"
  },
  {
    id: "b1_04",
    question: "Что означает 'Umweltschutz'?",
    options: ["защита животных", "охрана окружающей среды", "защита растений", "охрана природы"],
    correctAnswer: 1,
    explanation: "Umweltschutz - охрана окружающей среды",
    category: "vocabulary"
  },
  {
    id: "b1_05",
    question: "Выберите правильную форму пассива: Das Haus ___ gebaut.",
    options: ["wird", "wurde", "ist", "hat"],
    correctAnswer: 0,
    explanation: "wird + причастие II для пассива настоящего времени",
    category: "grammar"
  },
  {
    id: "b1_06",
    question: "Что означает 'sich Sorgen machen'?",
    options: ["заботиться", "беспокоиться", "злиться", "торопиться"],
    correctAnswer: 1,
    explanation: "sich Sorgen machen - беспокоиться, волноваться",
    category: "vocabulary"
  },
  {
    id: "b1_07",
    question: "Выберите правильную форму относительного местоимения: Der Mann, ___ dort steht, ist mein Vater.",
    options: ["der", "den", "dem", "dessen"],
    correctAnswer: 0,
    explanation: "'der' - подлежащее в относительном предложении",
    category: "grammar"
  },
  {
    id: "b1_08",
    question: "Что означает 'sich verlassen auf'?",
    options: ["покидать", "полагаться на", "уходить от", "забывать о"],
    correctAnswer: 1,
    explanation: "sich verlassen auf - полагаться на кого-то/что-то",
    category: "vocabulary"
  },
  {
    id: "b1_09",
    question: "Выберите правильную форму: Je mehr ich lerne, ___ besser verstehe ich.",
    options: ["desto", "umso", "so", "sehr"],
    correctAnswer: 0,
    explanation: "Je..., desto... - чем..., тем... (конструкция сравнения)",
    category: "grammar"
  },
  {
    id: "b1_10",
    question: "Что означает 'Nachhaltigkeit'?",
    options: ["скорость", "устойчивость", "новизна", "сложность"],
    correctAnswer: 1,
    explanation: "Nachhaltigkeit - устойчивость, экологичность",
    category: "vocabulary"
  },
  {
    id: "b1_11",
    question: "Выберите правильную форму: Statt ins Kino zu gehen, ___ er zu Hause.",
    options: ["bleibt", "blieb", "ist geblieben", "bleiben"],
    correctAnswer: 0,
    explanation: "Statt... zu + инфинитив, основное предложение в настоящем времени",
    category: "grammar"
  },
  {
    id: "b1_12",
    question: "Что означает 'sich eingewöhnen'?",
    options: ["переезжать", "привыкать", "изменяться", "развиваться"],
    correctAnswer: 1,
    explanation: "sich eingewöhnen - привыкать, осваиваться",
    category: "vocabulary"
  },
  {
    id: "b1_13",
    question: "Выберите правильную форму: Er tut so, ___ er alles wüsste.",
    options: ["als ob", "als wenn", "wie wenn", "dass"],
    correctAnswer: 0,
    explanation: "'als ob' + конъюнктив для выражения нереальности",
    category: "grammar"
  },
  {
    id: "b1_14",
    question: "Что означает 'Zeitgeist'?",
    options: ["время", "дух времени", "призрак", "история"],
    correctAnswer: 1,
    explanation: "Zeitgeist - дух времени, характерные черты эпохи",
    category: "vocabulary"
  },
  {
    id: "b1_15",
    question: "Выберите правильную форму: Um rechtzeitig anzukommen, ___ wir früher losfahren.",
    options: ["müssen", "können", "sollen", "dürfen"],
    correctAnswer: 0,
    explanation: "'müssen' выражает необходимость для достижения цели",
    category: "grammar"
  },
  {
    id: "b1_16",
    question: "Что означает 'sich auskennen'?",
    options: ["знакомиться", "разбираться в чем-то", "изучать", "понимать"],
    correctAnswer: 1,
    explanation: "sich auskennen - хорошо разбираться в чем-то",
    category: "vocabulary"
  },
  {
    id: "b1_17",
    question: "Выберите правильную форму: Ich wünschte, ich ___ mehr Zeit.",
    options: ["habe", "hätte", "hatte", "haben"],
    correctAnswer: 1,
    explanation: "Конъюнктив II 'hätte' для выражения нереальных желаний",
    category: "grammar"
  },
  {
    id: "b1_18",
    question: "Что означает 'Herausforderung'?",
    options: ["вызов", "возможность", "проблема", "решение"],
    correctAnswer: 0,
    explanation: "Herausforderung - вызов, сложная задача",
    category: "vocabulary"
  },
  {
    id: "b1_19",
    question: "Выберите правильную форму: Obwohl es regnet, ___ wir spazieren.",
    options: ["gehen", "gingen", "sind gegangen", "werden gehen"],
    correctAnswer: 0,
    explanation: "После 'obwohl' в настоящем времени используется презенс",
    category: "grammar"
  },
  {
    id: "b1_20",
    question: "Что означает 'sich weiterbilden'?",
    options: ["продолжать учебу", "изменяться", "развиваться", "повышать квалификацию"],
    correctAnswer: 3,
    explanation: "sich weiterbilden - повышать квалификацию, продолжать образование",
    category: "vocabulary"
  }
];
// B2 Тест - Продвинутый уровень
const B2_QUESTIONS: LevelSpecificQuestion[] = [
  {
    id: "b2_01",
    question: "Выберите правильную форму: Hätte ich das gewusst, ___ ich anders gehandelt.",
    options: ["hätte", "wäre", "würde haben", "hatte"],
    correctAnswer: 0,
    explanation: "Hätte + причастие II для ирреального прошедшего",
    category: "grammar"
  },
  {
    id: "b2_02",
    question: "Что означает 'nachhaltig'?",
    options: ["быстро", "устойчиво", "временно", "сложно"],
    correctAnswer: 1,
    explanation: "nachhaltig - устойчивый, долгосрочный",
    category: "vocabulary"
  },
  {
    id: "b2_03",
    question: "Выберите правильную форму: Die Verhandlungen verliefen ___.",
    options: ["erfolgreich", "erfolgsreich", "erfolgende", "erfolgen"],
    correctAnswer: 0,
    explanation: "erfolgreich - успешно (прилагательное)",
    category: "grammar"
  },
  {
    id: "b2_04",
    question: "Что означает 'sich abfinden mit'?",
    options: ["бороться с", "смириться с", "гордиться", "заниматься"],
    correctAnswer: 1,
    explanation: "sich abfinden mit - смириться с чем-то",
    category: "vocabulary"
  },
  {
    id: "b2_05",
    question: "Выберите правильную форму: Es ist wichtig, dass wir ___ vorbereitet sind.",
    options: ["gut", "gute", "guten", "guter"],
    correctAnswer: 0,
    explanation: "'gut' не склоняется как наречие",
    category: "grammar"
  },
  {
    id: "b2_06",
    question: "Что означает 'sich durchsetzen'?",
    options: ["сесть", "пройти через", "добиться своего", "установить"],
    correctAnswer: 2,
    explanation: "sich durchsetzen - добиться своего, утвердиться",
    category: "vocabulary"
  },
  {
    id: "b2_07",
    question: "Выберите правильную форму: Angenommen, ___ hätten mehr Zeit...",
    options: ["wir", "uns", "unser", "unsere"],
    correctAnswer: 0,
    explanation: "После 'angenommen' используется номинатив",
    category: "grammar"
  },
  {
    id: "b2_08",
    question: "Что означает 'Eigenverantwortung'?",
    options: ["общая ответственность", "личная ответственность", "государственная ответственность", "коллективная ответственность"],
    correctAnswer: 1,
    explanation: "Eigenverantwortung - личная ответственность",
    category: "vocabulary"
  },
  {
    id: "b2_09",
    question: "Выберите правильную форму: Je länger ich darüber nachdenke, ___ komplizierter wird es.",
    options: ["desto", "umso", "je", "so"],
    correctAnswer: 0,
    explanation: "Je..., desto... - чем..., тем...",
    category: "grammar"
  },
  {
    id: "b2_10",
    question: "Что означает 'vielfältig'?",
    options: ["простой", "разнообразный", "сложный", "единый"],
    correctAnswer: 1,
    explanation: "vielfältig - разнообразный, многообразный",
    category: "vocabulary"
  },
  {
    id: "b2_11",
    question: "Выберите правильную форму: Es sei denn, ___ ändert sich etwas.",
    options: ["es", "er", "sie", "das"],
    correctAnswer: 0,
    explanation: "'es sei denn' - если только, за исключением случая",
    category: "grammar"
  },
  {
    id: "b2_12",
    question: "Что означает 'sich bewähren'?",
    options: ["изменяться", "оправдать себя", "развиваться", "улучшаться"],
    correctAnswer: 1,
    explanation: "sich bewähren - оправдать себя, показать себя с лучшей стороны",
    category: "vocabulary"
  },
  {
    id: "b2_13",
    question: "Выберите правильную форму придаточного предложения: Er behauptet, er ___ nichts davon gewusst.",
    options: ["hat", "hätte", "haben", "habe"],
    correctAnswer: 3,
    explanation: "Конъюнктив I в косвенной речи - 'er habe'",
    category: "grammar"
  },
  {
    id: "b2_14",
    question: "Что означает 'aussagekräftig'?",
    options: ["красивый", "информативный", "громкий", "правдивый"],
    correctAnswer: 1,
    explanation: "aussagekräftig - информативный, содержательный",
    category: "vocabulary"
  },
  {
    id: "b2_15",
    question: "Выберите правильную форму: Vorausgesetzt, dass ___ einverstanden sind...",
    options: ["alle", "allen", "aller", "alles"],
    correctAnswer: 0,
    explanation: "'alle' - все (субъект предложения)",
    category: "grammar"
  },
  {
    id: "b2_16",
    question: "Что означает 'Wendepunkt'?",
    options: ["начало", "поворотный пункт", "конец", "середина"],
    correctAnswer: 1,
    explanation: "Wendepunkt - поворотный пункт, переломный момент",
    category: "vocabulary"
  },
  {
    id: "b2_17",
    question: "Выберите правильную форму: Sowohl die Theorie ___ auch die Praxis sind wichtig.",
    options: ["als", "wie", "und", "oder"],
    correctAnswer: 0,
    explanation: "sowohl... als auch... - как..., так и...",
    category: "grammar"
  },
  {
    id: "b2_18",
    question: "Что означает 'sich auseinandersetzen mit'?",
    options: ["расставаться", "заниматься чем-то", "ссориться", "встречаться"],
    correctAnswer: 1,
    explanation: "sich auseinandersetzen mit - заниматься, разбираться с чем-то",
    category: "vocabulary"
  },
  {
    id: "b2_19",
    question: "Выберите правильную форму: Es wäre besser gewesen, wenn wir ___ hätten.",
    options: ["gewarten", "gewartet", "warten", "warteten"],
    correctAnswer: 1,
    explanation: "Плюсквамперфект конъюнктива - 'gewartet hätten'",
    category: "grammar"
  },
  {
    id: "b2_20",
    question: "Что означает 'anspruchsvoll'?",
    options: ["простой", "требовательный", "дешевый", "быстрый"],
    correctAnswer: 1,
    explanation: "anspruchsvoll - требовательный, взыскательный",
    category: "vocabulary"
  }
];
// C1 Тест - Высокий уровень
const C1_QUESTIONS: LevelSpecificQuestion[] = [
  {
    id: "c1_01",
    question: "Выберите стилистически подходящий вариант: Die Ergebnisse ___ eine deutliche Verbesserung.",
    options: ["zeigen", "weisen auf", "deuten auf", "belegen"],
    correctAnswer: 3,
    explanation: "'belegen' - более формальный и точный термин для научного контекста",
    category: "vocabulary"
  },
  {
    id: "c1_02",
    question: "Что означает 'unumstößlich'?",
    options: ["изменчивый", "непоколебимый", "временный", "сомнительный"],
    correctAnswer: 1,
    explanation: "unumstößlich - непоколебимый, неопровержимый",
    category: "vocabulary"
  },
  {
    id: "c1_03",
    question: "Выберите правильную форму: Es handelt sich ___ ein komplexes Problem.",
    options: ["um", "bei", "von", "für"],
    correctAnswer: 0,
    explanation: "'sich handeln um' - речь идет о...",
    category: "grammar"
  },
  {
    id: "c1_04",
    question: "Что означает 'vielschichtig'?",
    options: ["простой", "многослойный", "однородный", "плоский"],
    correctAnswer: 1,
    explanation: "vielschichtig - многослойный, сложный",
    category: "vocabulary"
  },
  {
    id: "c1_05",
    question: "Выберите правильную форму: Die Angelegenheit, ___ sich niemand kümmern wollte...",
    options: ["um die", "für die", "über die", "zu der"],
    correctAnswer: 0,
    explanation: "'sich kümmern um' + аккузатив",
    category: "grammar"
  },
  {
    id: "c1_06",
    question: "Что означает 'geringschätzen'?",
    options: ["уважать", "недооценивать", "переоценивать", "изучать"],
    correctAnswer: 1,
    explanation: "geringschätzen - недооценивать, принижать",
    category: "vocabulary"
  },
  {
    id: "c1_07",
    question: "Выберите правильную форму: Unbeschadet ___ Rechte Dritter...",
    options: ["der", "die", "das", "den"],
    correctAnswer: 0,
    explanation: "'unbeschadet' + генитив - 'der Rechte'",
    category: "grammar"
  },
  {
    id: "c1_08",
    question: "Что означает 'sich etw. zunutze machen'?",
    options: ["игнорировать", "использовать в своих интересах", "изучать", "критиковать"],
    correctAnswer: 1,
    explanation: "sich etw. zunutze machen - использовать что-то в своих интересах",
    category: "vocabulary"
  },
  {
    id: "c1_09",
    question: "Выберите правильную форму: Mittlerweile ___ sich die Situation grundlegend geändert.",
    options: ["hat", "ist", "wird", "war"],
    correctAnswer: 0,
    explanation: "'sich ändern' образует перфект с 'haben'",
    category: "grammar"
  },
  {
    id: "c1_10",
    question: "Что означает 'unabdingbar'?",
    options: ["необязательный", "обязательный", "желательный", "возможный"],
    correctAnswer: 1,
    explanation: "unabdingbar - обязательный, необходимый",
    category: "vocabulary"
  },
  {
    id: "c1_11",
    question: "Выберите правильную форму: Er tat, ___ er nichts bemerkt hätte.",
    options: ["als ob", "wie wenn", "als wenn", "so dass"],
    correctAnswer: 0,
    explanation: "'als ob' + конъюнктив II для выражения притворства",
    category: "grammar"
  },
  {
    id: "c1_12",
    question: "Что означает 'hinterfragen'?",
    options: ["спрашивать", "подвергать сомнению", "отвечать", "игнорировать"],
    correctAnswer: 1,
    explanation: "hinterfragen - подвергать сомнению, критически анализировать",
    category: "vocabulary"
  },
  {
    id: "c1_13",
    question: "Выберите правильную форму: ___ auch die Kritik berechtigt sein mag...",
    options: ["So", "Wie", "Als", "Wenn"],
    correctAnswer: 0,
    explanation: "'So... auch' - как бы ни...",
    category: "grammar"
  },
  {
    id: "c1_14",
    question: "Что означает 'Tragweite'?",
    options: ["вес", "последствия", "расстояние", "размер"],
    correctAnswer: 1,
    explanation: "Tragweite - значимость, последствия",
    category: "vocabulary"
  },
  {
    id: "c1_15",
    question: "Выберите правильную форму: Es bedarf ___ gründlichen Analyse.",
    options: ["einer", "eine", "einen", "eines"],
    correctAnswer: 0,
    explanation: "'bedürfen' + генитив - 'einer Analyse'",
    category: "grammar"
  },
  {
    id: "c1_16",
    question: "Что означает 'sich niederschlagen in'?",
    options: ["падать", "отражаться в", "бить", "садиться"],
    correctAnswer: 1,
    explanation: "sich niederschlagen in - отражаться в, проявляться в",
    category: "vocabulary"
  },
  {
    id: "c1_17",
    question: "Выберите правильную форму: Gleichwohl ___ Bedenken bestehen...",
    options: ["können", "mögen", "sollen", "dürfen"],
    correctAnswer: 1,
    explanation: "'mögen' в значении 'могут' в формальном стиле",
    category: "grammar"
  },
  {
    id: "c1_18",
    question: "Что означает 'vorantreiben'?",
    options: ["тормозить", "продвигать", "останавливать", "изменять"],
    correctAnswer: 1,
    explanation: "vorantreiben - продвигать, развивать",
    category: "vocabulary"
  },
  {
    id: "c1_19",
    question: "Выберите правильную форму: Infolge ___ Ereignisse...",
    options: ["dieser", "diese", "diesen", "dieses"],
    correctAnswer: 0,
    explanation: "'infolge' + генитив - 'dieser Ereignisse'",
    category: "grammar"
  },
  {
    id: "c1_20",
    question: "Что означает 'differenziert'?",
    options: ["простой", "дифференцированный", "одинаковый", "общий"],
    correctAnswer: 1,
    explanation: "differenziert - дифференцированный, детальный",
    category: "vocabulary"
  }
];
// C2 Тест - Профессиональный уровень
const C2_QUESTIONS: LevelSpecificQuestion[] = [
  {
    id: "c2_01",
    question: "Выберите стилистически корректный вариант: Die Maßnahmen zeitigen bereits erste ___.",
    options: ["Resultate", "Ergebnisse", "Erfolge", "Früchte"],
    correctAnswer: 2,
    explanation: "'zeitigen Erfolge' - устойчивое выражение в официальном стиле",
    category: "vocabulary"
  },
  {
    id: "c2_02",
    question: "Что означает 'unwiderruflich'?",
    options: ["временно", "окончательно", "возможно", "сомнительно"],
    correctAnswer: 1,
    explanation: "unwiderruflich - окончательно, бесповоротно",
    category: "vocabulary"
  },
  {
    id: "c2_03",
    question: "Выберите правильную форму: Wären die Umstände andere gewesen, so ___ das Ergebnis völlig anders ausgefallen.",
    options: ["wäre", "hätte", "würde", "könnte"],
    correctAnswer: 0,
    explanation: "Ирреальное условное предложение прошедшего времени с 'wäre'",
    category: "grammar"
  },
  {
    id: "c2_04",
    question: "Что означает 'sinnfällig'?",
    options: ["бессмысленный", "очевидный", "сложный", "скрытый"],
    correctAnswer: 1,
    explanation: "sinnfällig - очевидный, наглядный",
    category: "vocabulary"
  },
  {
    id: "c2_05",
    question: "Выберите правильную форму: Es gilt ___ zu berücksichtigen, dass...",
    options: ["dabei", "hierbei", "daran", "hieran"],
    correctAnswer: 1,
    explanation: "'hierbei' указывает на конкретный процесс рассмотрения",
    category: "grammar"
  },
  {
    id: "c2_06",
    question: "Что означает 'konterkarieren'?",
    options: ["поддерживать", "противодействовать", "развивать", "игнорировать"],
    correctAnswer: 1,
    explanation: "konterkarieren - противодействовать, подрывать",
    category: "vocabulary"
  },
  {
    id: "c2_07",
    question: "Выберите правильную форму: Kraft ___ Gesetzes...",
    options: ["dieses", "diesem", "diesen", "dieser"],
    correctAnswer: 0,
    explanation: "'kraft' + генитив - 'dieses Gesetzes'",
    category: "grammar"
  },
  {
    id: "c2_08",
    question: "Что означает 'zielführend'?",
    options: ["направляющий", "ведущий к цели", "целенаправленный", "результативный"],
    correctAnswer: 1,
    explanation: "zielführend - ведущий к цели, эффективный",
    category: "vocabulary"
  },
  {
    id: "c2_09",
    question: "Выберите правильную форму: Sofern nicht ___ anderes vereinbart wird...",
    options: ["etwas", "nichts", "alles", "wenig"],
    correctAnswer: 0,
    explanation: "'sofern nicht etwas anderes' - если не будет договорено иное",
    category: "grammar"
  },
  {
    id: "c2_10",
    question: "Что означает 'stringent'?",
    options: ["мягкий", "последовательный", "противоречивый", "гибкий"],
    correctAnswer: 1,
    explanation: "stringent - последовательный, строгий",
    category: "vocabulary"
  },
  {
    id: "c2_11",
    question: "Выберите правильную форму: Mitnichten ___ das Problem gelöst.",
    options: ["ist", "wird", "war", "wäre"],
    correctAnswer: 0,
    explanation: "'Mitnichten ist...' - отнюдь не решена проблема",
    category: "grammar"
  },
  {
    id: "c2_12",
    question: "Что означает 'paradigmatisch'?",
    options: ["обычный", "образцовый", "случайный", "временный"],
    correctAnswer: 1,
    explanation: "paradigmatisch - образцовый, показательный",
    category: "vocabulary"
  },
  {
    id: "c2_13",
    question: "Выберите правильную форму: Es ist ___ zu erwarten, dass...",
    options: ["davon", "daran", "damit", "danach"],
    correctAnswer: 0,
    explanation: "'davon ausgehen/erwarten' - исходить из того",
    category: "grammar"
  },
  {
    id: "c2_14",
    question: "Что означает 'omnipräsent'?",
    options: ["редкий", "повсеместный", "временный", "локальный"],
    correctAnswer: 1,
    explanation: "omnipräsent - повсеместный, вездесущий",
    category: "vocabulary"
  },
  {
    id: "c2_15",
    question: "Выберите правильную форму: Dessen ungeachtet ___ weitere Schritte erforderlich.",
    options: ["sind", "ist", "werden", "waren"],
    correctAnswer: 0,
    explanation: "'weitere Schritte' - множественное число, 'sind'",
    category: "grammar"
  },
  {
    id: "c2_16",
    question: "Что означает 'ubiquitär'?",
    options: ["редкий", "повсеместный", "уникальный", "специфический"],
    correctAnswer: 1,
    explanation: "ubiquitär - повсеместный, вездесущий",
    category: "vocabulary"
  },
  {
    id: "c2_17",
    question: "Выберите правильную форму: Gleichwohl ___ Zweifel angebracht.",
    options: ["scheinen", "erscheinen", "sind", "werden"],
    correctAnswer: 2,
    explanation: "'Zweifel sind angebracht' - сомнения уместны",
    category: "grammar"
  },
  {
    id: "c2_18",
    question: "Что означает 'ambivalent'?",
    options: ["однозначный", "двойственный", "позитивный", "негативный"],
    correctAnswer: 1,
    explanation: "ambivalent - двойственный, противоречивый",
    category: "vocabulary"
  },
  {
    id: "c2_19",
    question: "Выберите правильную форму: Zumal ___ Umstände eine Rolle spielen.",
    options: ["weitere", "andere", "besondere", "alle"],
    correctAnswer: 2,
    explanation: "'zumal besondere Umstände' - тем более что особые обстоятельства",
    category: "grammar"
  },
  {
    id: "c2_20",
    question: "Что означает 'sui generis'?",
    options: ["обычный", "своеобразный", "типичный", "стандартный"],
    correctAnswer: 1,
    explanation: "sui generis - своеобразный, уникальный в своем роде",
    category: "vocabulary"
  }
];
export const LEVEL_TESTS: Record<GermanLevel, LevelSpecificQuestion[]> = {
  A1: A1_QUESTIONS,
  A2: A2_QUESTIONS,
  B1: B1_QUESTIONS,
  B2: B2_QUESTIONS,
  C1: C1_QUESTIONS,
  C2: C2_QUESTIONS,
};
export const LEVEL_DESCRIPTIONS: Record<GermanLevel, { title: string; description: string; passThreshold: number }> = {
  A1: {
    title: "Тест по немецкому языку на уровень A1",
    description: "Ответьте на 20 вопросов и узнайте, соответствуют ли Ваши знания уровню A1.",
    passThreshold: 70
  },
  A2: {
    title: "Тест по немецкому языку на уровень A2",
    description: "Ответьте на 20 вопросов и узнайте, соответствуют ли Ваши знания уровню A2.",
    passThreshold: 70
  },
  B1: {
    title: "Тест по немецкому языку на уровень B1",
    description: "Ответьте на 20 вопросов и узнайте, соответствуют ли Ваши знания уровню B1.",
    passThreshold: 75
  },
  B2: {
    title: "Тест по немецкому языку на уровень B2",
    description: "Ответьте на 20 вопросов и узнайте, соответствуют ли Ваши знания уровню B2.",
    passThreshold: 75
  },
  C1: {
    title: "Тест по немецкому языку на уровень C1",
    description: "Ответьте на 20 вопросов и узнайте, соответствуют ли Ваши знания уровню C1.",
    passThreshold: 80
  },
  C2: {
    title: "Тест по немецкому языку на уровень C2",
    description: "Ответьте на 20 вопросов и узнайте, соответствуют ли Ваши знания уровню C2.",
    passThreshold: 85
  }
};
class LevelSpecificTestService {
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  getQuestionsForLevel(level: GermanLevel): LevelSpecificQuestion[] {
    const questions = LEVEL_TESTS[level];
    if (!questions) {
      throw new Error(`Вопросы для уровня ${level} не найдены`);
    }
    // Перемешиваем вопросы для каждого теста
    return this.shuffleArray(questions);
  }
  // Alias для обратной совместимости
  generateQuestions(level: GermanLevel): Promise<LevelSpecificQuestion[]> {
    return Promise.resolve(this.getQuestionsForLevel(level));
  }
  calculateResult(
    level: GermanLevel,
    answers: Array<{
      questionId: string;
      selectedAnswer: number;
      timeSpent: number;
    }>,
    totalTimeSpent: number
  ): LevelTestResult {
    const questions = this.getQuestionsForLevel(level);
    const { passThreshold } = LEVEL_DESCRIPTIONS[level];
    let correctAnswers = 0;
    const detailedAnswers = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) {
        throw new Error(`Вопрос с ID ${answer.questionId} не найден`);
      }
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        selectedAnswerText: question.options[answer.selectedAnswer] || "Не выбрано",
        isCorrect,
        question: question.question,
        correctAnswer: question.options[question.correctAnswer],
        explanation: question.explanation
      };
    });
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= passThreshold;
    // Анализ сильных и слабых сторон
    const categoryPerformance: Record<string, { correct: number; total: number }> = {
      grammar: { correct: 0, total: 0 },
      vocabulary: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      listening: { correct: 0, total: 0 }
    };
    for (const answer of detailedAnswers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        categoryPerformance[question.category].total++;
        if (answer.isCorrect) {
          categoryPerformance[question.category].correct++;
        }
      }
    }
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    for (const [category, performance] of Object.entries(categoryPerformance)) {
      if (performance.total === 0) continue;
      const accuracy = performance.correct / performance.total;
      const categoryName = this.getCategoryName(category);
      if (accuracy >= 0.8) {
        strengths.push(categoryName);
      } else if (accuracy < 0.6) {
        weaknesses.push(categoryName);
      }
    }
    return {
      level,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      passThreshold,
      passed,
      answers: detailedAnswers,
      strengths,
      weaknesses,
      timeSpent: totalTimeSpent
    };
  }
  private getCategoryName(category: string): string {
    const categoryNames: Record<string, string> = {
      grammar: "Грамматика",
      vocabulary: "Лексика",
      reading: "Чтение",
      listening: "Аудирование"
    };
    return categoryNames[category] || category;
  }
}
export const levelSpecificTestService = new LevelSpecificTestService();
