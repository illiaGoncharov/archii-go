// Store для управления пользователем

import { create } from 'zustand';
import { User, UserStats } from '../types/user';
import { getUser } from '../services/firestore';

interface UserStore {
  user: User | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  fetchUser: (userId: string) => Promise<void>;
  updateStats: (stats: UserStats) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  stats: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  
  fetchUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await getUser(userId);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: 'Не удалось загрузить пользователя', isLoading: false });
    }
  },
  
  updateStats: (stats) => set({ stats }),
  
  clearUser: () => set({ user: null, stats: null, error: null })
}));

