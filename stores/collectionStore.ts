// Store для управления коллекцией элементов

import { create } from 'zustand';
import { Element, ElementWithStatus } from '../types/element';
import { Finding } from '../types/finding';
import { getAllElements, getApprovedFindings } from '../services/firestore';

interface CollectionStore {
  elements: Element[];
  userElements: ElementWithStatus[];
  findings: Finding[];
  isLoading: boolean;
  error: string | null;
  
  fetchElements: () => Promise<void>;
  fetchUserCollection: (userId: string) => Promise<void>;
  getElementStatus: (elementId: string) => boolean;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  elements: [],
  userElements: [],
  findings: [],
  isLoading: false,
  error: null,
  
  // Загрузить все элементы из базы
  fetchElements: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const elements = await getAllElements();
      set({ elements, isLoading: false });
    } catch (error) {
      set({ error: 'Не удалось загрузить элементы', isLoading: false });
    }
  },
  
  // Загрузить коллекцию пользователя (найденные элементы)
  fetchUserCollection: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const [elements, findings] = await Promise.all([
        getAllElements(),
        getApprovedFindings(userId)
      ]);
      
      // Мапим элементы с информацией о том, найдены ли они
      const foundElementIds = new Set(findings.map(f => f.elementId));
      
      const userElements: ElementWithStatus[] = elements.map(element => ({
        ...element,
        isFound: foundElementIds.has(element.id),
        foundAt: findings.find(f => f.elementId === element.id)?.createdAt
      }));
      
      set({ 
        elements, 
        userElements, 
        findings,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Не удалось загрузить коллекцию', isLoading: false });
    }
  },
  
  // Проверить, найден ли элемент
  getElementStatus: (elementId: string) => {
    const { findings } = get();
    return findings.some(f => f.elementId === elementId && f.status === 'approved');
  }
}));

