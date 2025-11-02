// Утилиты для расчёта очков

import { Rarity } from '../types/element';

// Получить количество очков за элемент по редкости
export const getPointsForRarity = (rarity: Rarity): number => {
  switch (rarity) {
    case 'common':
      return 10;
    case 'rare':
      return 25;
    case 'epic':
      return 50;
    case 'legendary':
      return 100;
    default:
      return 10;
  }
};

// Вычислить уровень по количеству очков
export const calculateLevel = (totalPoints: number): number => {
  return Math.floor(totalPoints / 100) + 1;
};

// Вычислить прогресс до следующего уровня (в процентах)
export const calculateLevelProgress = (totalPoints: number): number => {
  const pointsForCurrentLevel = (calculateLevel(totalPoints) - 1) * 100;
  const progressInCurrentLevel = totalPoints - pointsForCurrentLevel;
  return (progressInCurrentLevel / 100) * 100;
};

// Получить количество очков до следующего уровня
export const getPointsToNextLevel = (totalPoints: number): number => {
  const currentLevel = calculateLevel(totalPoints);
  const pointsForNextLevel = currentLevel * 100;
  return pointsForNextLevel - totalPoints;
};

