// Типы для архитектурных элементов

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Style = 'Барокко' | 'Классицизм' | 'Модерн' | 'Готика' | 'Ампир' | 'Эклектика';

export interface Element {
  id: string;
  name: string;
  description: string;
  style: Style;
  rarity: Rarity;
  points: number;
  imageUrl: string;
  totalFound: number; // Сколько раз найден всеми пользователями
}

export interface ElementWithStatus extends Element {
  isFound: boolean; // Найден ли пользователем
  foundAt?: Date;
}

