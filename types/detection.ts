// Типы для системы детекции архитектурных элементов

export type ArchitecturalStyle = 'baroque' | 'classicism' | 'modern' | 'empire' | 'gothic' | 'eclectic';

// Bounding box в нормализованных координатах (0-1)
export interface BoundingBox {
  x: number;      // Левый верхний угол X (0-1)
  y: number;      // Левый верхний угол Y (0-1)
  width: number;  // Ширина (0-1)
  height: number; // Высота (0-1)
}

// Результат детекции одного элемента
export interface Detection {
  id: string;
  classId: string;           // ID класса (cornice, sandrik, etc.)
  className: string;         // Русское название
  confidence: number;        // 0-1
  boundingBox: BoundingBox;
  style: ArchitecturalStyle; // Архитектурный стиль
  wikidataQid: string;       // Q-ID для Wikidata (Q185090)
}

// Информация об архитектурном элементе из справочника
export interface ArchitecturalElementInfo {
  classId: string;
  nameRu: string;
  nameEn: string;
  description: string;
  wikidataQid: string;
  style: ArchitecturalStyle;
  epoch: string;           // "XVII-XVIII век"
  colorPrimary: string;    // Основной цвет для box
  colorGlow: string;       // Цвет свечения
}

// Данные из Wikidata API
export interface WikidataInfo {
  qid: string;
  nameRu: string;
  nameEn?: string;
  descriptionRu: string;
  descriptionEn?: string;
  wikipediaUrl?: string;
  wikidataUrl: string;
  imageUrl?: string;
}

// Состояние экрана детекции
export interface DetectionState {
  isDetecting: boolean;
  detections: Detection[];
  selectedDetection: Detection | null;
  isSidebarOpen: boolean;
  wikidataInfo: WikidataInfo | null;
  isLoadingWikidata: boolean;
  error: string | null;
}

// Конфигурация детекции
export interface DetectionConfig {
  confidenceThreshold: number;  // Минимальный confidence (0.5)
  maxDetections: number;        // Макс. количество boxes (10)
  throttleMs: number;           // Задержка между детекциями (100ms)
  enableRealtime: boolean;      // Realtime или только по кнопке
}

// Результат работы ML модели (raw output)
export interface TFLiteDetectionResult {
  classIndex: number;
  score: number;
  rect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

// Размеры экрана/камеры для конвертации координат
export interface FrameDimensions {
  width: number;
  height: number;
}
