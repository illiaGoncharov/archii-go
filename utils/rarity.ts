// Утилиты для работы с редкостью элементов

import { Rarity } from '../types/element';

// Получить цвет для редкости
export const getRarityColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'common':
      return '#9CA3AF'; // Серый
    case 'rare':
      return '#3B82F6'; // Синий
    case 'epic':
      return '#8B5CF6'; // Фиолетовый
    case 'legendary':
      return '#F59E0B'; // Золотой
    default:
      return '#9CA3AF';
  }
};

// Получить название редкости на русском
export const getRarityLabel = (rarity: Rarity): string => {
  switch (rarity) {
    case 'common':
      return 'Обычный';
    case 'rare':
      return 'Редкий';
    case 'epic':
      return 'Эпический';
    case 'legendary':
      return 'Легендарный';
    default:
      return 'Обычный';
  }
};

// Вычислить редкость на основе количества находок
export const calculateRarity = (totalFound: number): Rarity => {
  if (totalFound > 100) return 'common';
  if (totalFound > 50) return 'rare';
  if (totalFound > 10) return 'epic';
  return 'legendary';
};

