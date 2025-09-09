// Типы для данных о праздниках
export interface HolidayStyle {
  background: string;
  fallback: string;
}

export interface HolidayData {
  id: string;
  name: string;
  germanName: string;
  date: string;
  description: string;
  traditions: string[];
  vocabulary: string[];
  facts: string[];
  type: 'religious' | 'cultural' | 'national' | 'regional';
  region?: string;
  style: HolidayStyle;
}

// Стили для праздников
export const getHolidayStyle = (holidayId: string): HolidayStyle => {
  const styles: Record<string, HolidayStyle> = {
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
      background: `linear-gradient(135deg, #16a34a, #22c55e, #15803d), url('https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=800&h=600&fit=crop&q=80')`,
      fallback: "linear-gradient(135deg, #16a34a, #22c55e, #15803d)"
    },
    silvester: {
      background: `linear-gradient(135deg, #1f2937, #374151, #6b7280), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&q=80')`,
      fallback: "linear-gradient(135deg, #1f2937, #374151, #6b7280)"
    }
  };

  return styles[holidayId] || {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)",
    fallback: "linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)"
  };
};

// Основные данные о праздниках
export const holidaysData: HolidayData[] = [
  {
    id: "weihnachten",
    name: "Christmas",
    germanName: "Weihnachten",
    date: "24-26 декабря",
    description: "Главный религиозный и семейный праздник в Германии",
    traditions: [
      "Рождественские рынки (Weihnachtsmärkte)",
      "Адвент-календарь (Adventskalender)",
      "Рождественское печенье (Weihnachtsplätzchen)",
      "Рождественская ёлка (Weihnachtsbaum)"
    ],
    vocabulary: [
      "das Weihnachten - Рождество",
      "der Weihnachtsmann - Дед Мороз",
      "das Geschenk - подарок",
      "der Weihnachtsbaum - рождественская ёлка",
      "das Weihnachtslied - рождественская песня"
    ],
    facts: [
      "Рождественские рынки работают с начала декабря",
      "Подарки дарят 24 декабря вечером",
      "25 и 26 декабря - выходные дни",
      "Традиция рождественской ёлки пришла из Германии"
    ],
    type: "religious",
    style: getHolidayStyle("weihnachten")
  },
  {
    id: "oktoberfest",
    name: "Oktoberfest",
    germanName: "Oktoberfest",
    date: "Сентябрь-октябрь",
    description: "Крупнейший пивной фестиваль в мире, проходящий в Мюнхене",
    traditions: [
      "Пиво в традиционных кружках (Maß)",
      "Баварские костюмы (Dirndl и Lederhosen)",
      "Традиционная баварская музыка",
      "Баварские блюда (сосиски, кренделя)"
    ],
    vocabulary: [
      "das Bier - пиво",
      "die Maß - литровая кружка пива",
      "das Dirndl - баварский женский костюм",
      "die Lederhose - кожаные штаны",
      "die Bratwurst - жареная колбаска"
    ],
    facts: [
      "Длится 16-18 дней",
      "Ежегодно посещают около 6 млн человек",
      "Первый Oktoberfest состоялся в 1810 году",
      "Выпивается около 7 млн литров пива"
    ],
    type: "cultural",
    region: "Бавария",
    style: getHolidayStyle("oktoberfest")
  }
  // Добавим больше праздников позже при необходимости
];

// Функции для работы с данными
export const getHolidayById = (id: string): HolidayData | undefined => {
  return holidaysData.find(holiday => holiday.id === id);
};

export const getHolidaysByType = (type: HolidayData['type']): HolidayData[] => {
  return holidaysData.filter(holiday => holiday.type === type);
};

export const getAllHolidayTypes = (): HolidayData['type'][] => {
  return Array.from(new Set(holidaysData.map(holiday => holiday.type)));
};
