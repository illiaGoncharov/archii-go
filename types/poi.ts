// Типы для точек интереса (Points of Interest)

import { Location } from './finding';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface POI {
  id: string;
  title: string;
  description: string;
  location: Location;
  elementsNearby: string[]; // ID элементов, которые можно найти рядом
  difficulty: Difficulty;
  // Расширенные поля для детальных POI
  name?: string;
  address?: string;
  city?: string;
  descriptionShort?: string;
  descriptionFull?: string;
  style?: string;
  elements?: string[];
  funFact?: string;
  coordinates?: Location;
}

