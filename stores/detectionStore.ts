// Store для управления состоянием детекции архитектурных элементов

import { create } from 'zustand';
import { Detection, WikidataInfo, DetectionConfig } from '../types/detection';
import { fetchWikidataInfo } from '../services/wikidata';
import { ARCHITECTURAL_ELEMENTS } from '../constants/architecturalElements';

interface DetectionStore {
  // Состояние детекции
  isDetecting: boolean;
  detections: Detection[];
  
  // Выбранный элемент и sidebar
  selectedDetection: Detection | null;
  isSidebarOpen: boolean;
  
  // Данные из Wikidata
  wikidataInfo: WikidataInfo | null;
  isLoadingWikidata: boolean;
  
  // Ошибки
  error: string | null;
  
  // Конфигурация
  config: DetectionConfig;
  
  // Actions
  setDetecting: (isDetecting: boolean) => void;
  setDetections: (detections: Detection[]) => void;
  addDetection: (detection: Detection) => void;
  clearDetections: () => void;
  
  selectDetection: (detection: Detection | null) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  
  loadWikidataInfo: (qid: string) => Promise<void>;
  clearWikidataInfo: () => void;
  
  setError: (error: string | null) => void;
  updateConfig: (config: Partial<DetectionConfig>) => void;
  
  reset: () => void;
}

const DEFAULT_CONFIG: DetectionConfig = {
  confidenceThreshold: 0.5,
  maxDetections: 10,
  throttleMs: 100,
  enableRealtime: false
};

export const useDetectionStore = create<DetectionStore>((set, get) => ({
  // Initial state
  isDetecting: false,
  detections: [],
  selectedDetection: null,
  isSidebarOpen: false,
  wikidataInfo: null,
  isLoadingWikidata: false,
  error: null,
  config: DEFAULT_CONFIG,
  
  // Detection actions
  setDetecting: (isDetecting) => set({ isDetecting }),
  
  setDetections: (detections) => {
    const { config } = get();
    // Фильтруем по confidence и ограничиваем количество
    const filtered = detections
      .filter(d => d.confidence >= config.confidenceThreshold)
      .slice(0, config.maxDetections);
    set({ detections: filtered });
  },
  
  addDetection: (detection) => {
    const { detections, config } = get();
    if (detections.length >= config.maxDetections) return;
    if (detection.confidence < config.confidenceThreshold) return;
    
    set({ detections: [...detections, detection] });
  },
  
  clearDetections: () => set({ detections: [] }),
  
  // Selection actions
  selectDetection: (detection) => {
    set({ selectedDetection: detection });
    
    if (detection) {
      // Автоматически загружаем данные из Wikidata
      get().loadWikidataInfo(detection.wikidataQid);
      get().openSidebar();
    } else {
      get().closeSidebar();
      get().clearWikidataInfo();
    }
  },
  
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false, selectedDetection: null }),
  
  // Wikidata actions
  loadWikidataInfo: async (qid) => {
    set({ isLoadingWikidata: true, error: null });
    
    try {
      const info = await fetchWikidataInfo(qid);
      set({ wikidataInfo: info, isLoadingWikidata: false });
    } catch (error) {
      console.error('Ошибка загрузки Wikidata:', error);
      set({ 
        error: 'Не удалось загрузить информацию',
        isLoadingWikidata: false 
      });
    }
  },
  
  clearWikidataInfo: () => set({ wikidataInfo: null }),
  
  // Error handling
  setError: (error) => set({ error }),
  
  // Config
  updateConfig: (newConfig) => {
    const { config } = get();
    set({ config: { ...config, ...newConfig } });
  },
  
  // Reset
  reset: () => set({
    isDetecting: false,
    detections: [],
    selectedDetection: null,
    isSidebarOpen: false,
    wikidataInfo: null,
    isLoadingWikidata: false,
    error: null
  })
}));

// Селекторы для оптимизации ререндеров
export const selectDetections = (state: DetectionStore) => state.detections;
export const selectSelectedDetection = (state: DetectionStore) => state.selectedDetection;
export const selectIsSidebarOpen = (state: DetectionStore) => state.isSidebarOpen;
export const selectWikidataInfo = (state: DetectionStore) => state.wikidataInfo;

// Хелпер: получить локальную информацию об элементе (без API)
export const getLocalElementInfo = (classId: string) => {
  return ARCHITECTURAL_ELEMENTS[classId] || null;
};
