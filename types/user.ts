// Типы для пользователя

export interface User {
  id: string;
  email: string;
  displayName: string;
  level: number;
  totalPoints: number;
  createdAt: Date;
}

export interface UserStats {
  totalElements: number;
  uniqueElements: number;
  rarestElement: string | null;
  totalFacades: number;
}

