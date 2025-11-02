// Типы для конструктора фасадов

export interface FacadeElement {
  elementId: string;
  x: number;
  y: number;
  scale: number;
  rotation?: number; // В градусах
}

export interface Facade {
  id: string;
  userId: string;
  title: string;
  elementsUsed: FacadeElement[];
  likes: number;
  createdAt: Date;
}

