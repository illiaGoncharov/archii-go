// Типы для находок пользователя

export type FindingStatus = 'pending' | 'approved' | 'rejected';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Finding {
  id: string;
  userId: string;
  elementId: string;
  photoUrl: string;
  location: Location;
  address: string;
  status: FindingStatus;
  createdAt: Date;
}

