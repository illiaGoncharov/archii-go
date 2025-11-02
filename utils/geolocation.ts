// Утилиты для работы с геолокацией

import * as Location from 'expo-location';
import { Location as LocationType } from '../types/finding';

// Получить текущую геолокацию пользователя
export const getCurrentLocation = async (): Promise<LocationType | null> => {
  try {
    // Запросить разрешение
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Доступ к геолокации отклонён');
      return null;
    }
    
    // Получить текущую позицию
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  } catch (error) {
    console.error('Ошибка получения геолокации:', error);
    return null;
  }
};

// Получить адрес по координатам (обратное геокодирование)
export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    
    if (results.length > 0) {
      const address = results[0];
      return `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''}`.trim();
    }
    
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Ошибка получения адреса:', error);
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};

// Вычислить расстояние между двумя точками (в метрах)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Расстояние в метрах
};

// Форматировать расстояние для отображения
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} м`;
  }
  return `${(meters / 1000).toFixed(1)} км`;
};

