// Store для управления картой и POI

import { create } from 'zustand';
import { POI } from '../types/poi';
import { Location } from '../types/finding';
import { getAllPOI } from '../services/firestore';

interface MapStore {
  pois: POI[];
  selectedPOI: POI | null;
  userLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  
  fetchPOI: () => Promise<void>;
  setSelectedPOI: (poi: POI | null) => void;
  setUserLocation: (location: Location) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  pois: [],
  selectedPOI: null,
  userLocation: null,
  isLoading: false,
  error: null,
  
  fetchPOI: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const pois = await getAllPOI();
      set({ pois, isLoading: false });
    } catch (error) {
      set({ error: 'Не удалось загрузить точки интереса', isLoading: false });
    }
  },
  
  setSelectedPOI: (poi) => set({ selectedPOI: poi }),
  setUserLocation: (location) => set({ userLocation: location })
}));

