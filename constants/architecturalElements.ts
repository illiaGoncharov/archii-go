// Справочник архитектурных элементов для детекции
// Содержит Wikidata Q-ID, цвета по стилям и описания

import { ArchitecturalElementInfo, ArchitecturalStyle } from '../types/detection';

// Цветовая схема по архитектурным эпохам
export const STYLE_COLORS: Record<ArchitecturalStyle, { primary: string; secondary: string; glow: string }> = {
  baroque: {
    primary: '#8250DF',     // Аметист
    secondary: '#B794F4',
    glow: 'rgba(130, 80, 223, 0.4)'
  },
  classicism: {
    primary: '#0969DA',     // Синий сланец
    secondary: '#54A3FF',
    glow: 'rgba(9, 105, 218, 0.4)'
  },
  modern: {
    primary: '#1A7F37',     // Зелёный
    secondary: '#3FB950',
    glow: 'rgba(26, 127, 55, 0.4)'
  },
  empire: {
    primary: '#BF8700',     // Золото
    secondary: '#D4A72C',
    glow: 'rgba(191, 135, 0, 0.4)'
  },
  gothic: {
    primary: '#CF222E',     // Красный
    secondary: '#FF6B6B',
    glow: 'rgba(207, 34, 46, 0.4)'
  },
  eclectic: {
    primary: '#6E7781',     // Серый
    secondary: '#8C959F',
    glow: 'rgba(110, 119, 129, 0.4)'
  }
};

// Справочник архитектурных элементов
export const ARCHITECTURAL_ELEMENTS: Record<string, ArchitecturalElementInfo> = {
  cornice: {
    classId: 'cornice',
    nameRu: 'Карниз',
    nameEn: 'Cornice',
    description: 'Горизонтальный выступ, завершающий стену или отделяющий этажи',
    wikidataQid: 'Q185090',
    style: 'baroque',
    epoch: 'XVII-XVIII век',
    colorPrimary: STYLE_COLORS.baroque.primary,
    colorGlow: STYLE_COLORS.baroque.glow
  },
  sandrik: {
    classId: 'sandrik',
    nameRu: 'Сандрик',
    nameEn: 'Sandricum',
    description: 'Декоративный карниз над оконным или дверным проёмом',
    wikidataQid: 'Q1368890',
    style: 'baroque',
    epoch: 'XVII-XVIII век',
    colorPrimary: '#9F7AEA',
    colorGlow: 'rgba(159, 122, 234, 0.4)'
  },
  pilaster: {
    classId: 'pilaster',
    nameRu: 'Пилястра',
    nameEn: 'Pilaster',
    description: 'Плоский вертикальный выступ стены, имитирующий колонну',
    wikidataQid: 'Q201817',
    style: 'classicism',
    epoch: 'XVIII-XIX век',
    colorPrimary: STYLE_COLORS.classicism.primary,
    colorGlow: STYLE_COLORS.classicism.glow
  },
  column: {
    classId: 'column',
    nameRu: 'Колонна',
    nameEn: 'Column',
    description: 'Вертикальный несущий элемент с круглым сечением',
    wikidataQid: 'Q83909',
    style: 'classicism',
    epoch: 'Античность — наши дни',
    colorPrimary: '#0550AE',
    colorGlow: 'rgba(5, 80, 174, 0.4)'
  },
  volute: {
    classId: 'volute',
    nameRu: 'Волюта',
    nameEn: 'Volute',
    description: 'Спиралевидный завиток, характерный для ионических капителей',
    wikidataQid: 'Q746298',
    style: 'baroque',
    epoch: 'Античность, Барокко',
    colorPrimary: '#805AD5',
    colorGlow: 'rgba(128, 90, 213, 0.4)'
  },
  cartouche: {
    classId: 'cartouche',
    nameRu: 'Картуш',
    nameEn: 'Cartouche',
    description: 'Декоративное обрамление в виде свитка или щита',
    wikidataQid: 'Q1324686',
    style: 'baroque',
    epoch: 'XVI-XVIII век',
    colorPrimary: '#6B46C1',
    colorGlow: 'rgba(107, 70, 193, 0.4)'
  },
  pediment: {
    classId: 'pediment',
    nameRu: 'Фронтон',
    nameEn: 'Pediment',
    description: 'Треугольное завершение фасада здания над колоннадой',
    wikidataQid: 'Q219409',
    style: 'classicism',
    epoch: 'Античность — наши дни',
    colorPrimary: STYLE_COLORS.classicism.primary,
    colorGlow: STYLE_COLORS.classicism.glow
  },
  festoon: {
    classId: 'festoon',
    nameRu: 'Фестон',
    nameEn: 'Festoon',
    description: 'Декоративная гирлянда из цветов, листьев или лент',
    wikidataQid: 'Q1375832',
    style: 'baroque',
    epoch: 'Античность, Барокко',
    colorPrimary: '#B794F4',
    colorGlow: 'rgba(183, 148, 244, 0.4)'
  },
  metope: {
    classId: 'metope',
    nameRu: 'Метопа',
    nameEn: 'Metope',
    description: 'Прямоугольная плита между триглифами дорического фриза',
    wikidataQid: 'Q192536',
    style: 'classicism',
    epoch: 'Античность',
    colorPrimary: '#54A3FF',
    colorGlow: 'rgba(84, 163, 255, 0.4)'
  },
  window: {
    classId: 'window',
    nameRu: 'Окно',
    nameEn: 'Window',
    description: 'Проём в стене для освещения и вентиляции',
    wikidataQid: 'Q35473',
    style: 'eclectic',
    epoch: 'Все эпохи',
    colorPrimary: STYLE_COLORS.eclectic.primary,
    colorGlow: STYLE_COLORS.eclectic.glow
  },
  balcony: {
    classId: 'balcony',
    nameRu: 'Балкон',
    nameEn: 'Balcony',
    description: 'Выступающая площадка на фасаде здания с ограждением',
    wikidataQid: 'Q170552',
    style: 'baroque',
    epoch: 'XVII-XIX век',
    colorPrimary: '#9F7AEA',
    colorGlow: 'rgba(159, 122, 234, 0.4)'
  },
  mascaron: {
    classId: 'mascaron',
    nameRu: 'Маскарон',
    nameEn: 'Mascaron',
    description: 'Декоративный рельеф в виде маски или головы',
    wikidataQid: 'Q1373986',
    style: 'baroque',
    epoch: 'XVII-XVIII век',
    colorPrimary: '#805AD5',
    colorGlow: 'rgba(128, 90, 213, 0.4)'
  },
  rustication: {
    classId: 'rustication',
    nameRu: 'Руст',
    nameEn: 'Rustication',
    description: 'Облицовка стен камнями с грубо отёсанной поверхностью',
    wikidataQid: 'Q1192098',
    style: 'classicism',
    epoch: 'Ренессанс — XIX век',
    colorPrimary: '#0550AE',
    colorGlow: 'rgba(5, 80, 174, 0.4)'
  },
  capital: {
    classId: 'capital',
    nameRu: 'Капитель',
    nameEn: 'Capital',
    description: 'Венчающая часть колонны или пилястры',
    wikidataQid: 'Q193893',
    style: 'classicism',
    epoch: 'Античность — наши дни',
    colorPrimary: STYLE_COLORS.classicism.primary,
    colorGlow: STYLE_COLORS.classicism.glow
  },
  balustrade: {
    classId: 'balustrade',
    nameRu: 'Балюстрада',
    nameEn: 'Balustrade',
    description: 'Ограждение из балясин (фигурных столбиков)',
    wikidataQid: 'Q297565',
    style: 'baroque',
    epoch: 'XVI-XIX век',
    colorPrimary: '#6B46C1',
    colorGlow: 'rgba(107, 70, 193, 0.4)'
  },
  atlant: {
    classId: 'atlant',
    nameRu: 'Атлант',
    nameEn: 'Atlas',
    description: 'Мужская фигура, поддерживающая балкон или карниз',
    wikidataQid: 'Q229390',
    style: 'baroque',
    epoch: 'XVII-XIX век',
    colorPrimary: '#8250DF',
    colorGlow: STYLE_COLORS.baroque.glow
  },
  caryatid: {
    classId: 'caryatid',
    nameRu: 'Кариатида',
    nameEn: 'Caryatid',
    description: 'Женская фигура, заменяющая колонну',
    wikidataQid: 'Q191013',
    style: 'classicism',
    epoch: 'Античность, Классицизм',
    colorPrimary: STYLE_COLORS.classicism.primary,
    colorGlow: STYLE_COLORS.classicism.glow
  },
  rosette: {
    classId: 'rosette',
    nameRu: 'Розетка',
    nameEn: 'Rosette',
    description: 'Круглый декоративный элемент в форме цветка',
    wikidataQid: 'Q1535096',
    style: 'eclectic',
    epoch: 'Все эпохи',
    colorPrimary: '#B794F4',
    colorGlow: 'rgba(183, 148, 244, 0.4)'
  },
  acroterion: {
    classId: 'acroterion',
    nameRu: 'Акротерий',
    nameEn: 'Acroterion',
    description: 'Украшение на углах и вершине фронтона',
    wikidataQid: 'Q230825',
    style: 'classicism',
    epoch: 'Античность, Классицизм',
    colorPrimary: '#0969DA',
    colorGlow: STYLE_COLORS.classicism.glow
  },
  dentil: {
    classId: 'dentil',
    nameRu: 'Дентикул',
    nameEn: 'Dentil',
    description: 'Зубчатый орнамент в виде ряда мелких прямоугольных выступов',
    wikidataQid: 'Q577828',
    style: 'classicism',
    epoch: 'Античность, Классицизм',
    colorPrimary: '#54A3FF',
    colorGlow: 'rgba(84, 163, 255, 0.4)'
  }
};

// Маппинг индексов TFLite модели на classId
// (порядок должен соответствовать labels.txt модели)
export const TFLITE_CLASS_MAP: string[] = [
  'cornice',
  'sandrik',
  'pilaster',
  'column',
  'volute',
  'cartouche',
  'pediment',
  'festoon',
  'metope',
  'window',
  'balcony',
  'mascaron',
  'rustication',
  'capital',
  'balustrade',
  'atlant',
  'caryatid',
  'rosette',
  'acroterion',
  'dentil'
];

// Получить информацию об элементе по classId
export const getElementInfo = (classId: string): ArchitecturalElementInfo | null => {
  return ARCHITECTURAL_ELEMENTS[classId] || null;
};

// Получить цвет по индексу класса TFLite
export const getColorForClassIndex = (index: number): { primary: string; glow: string } => {
  const classId = TFLITE_CLASS_MAP[index];
  const element = ARCHITECTURAL_ELEMENTS[classId];
  
  if (element) {
    return {
      primary: element.colorPrimary,
      glow: element.colorGlow
    };
  }
  
  return {
    primary: STYLE_COLORS.eclectic.primary,
    glow: STYLE_COLORS.eclectic.glow
  };
};
