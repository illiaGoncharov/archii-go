// Сервис для работы с Firebase Storage

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// Загрузка фото находки
export const uploadFindingPhoto = async (
  userId: string,
  photoUri: string
): Promise<string> => {
  try {
    // Конвертируем URI в Blob
    const response = await fetch(photoUri);
    const blob = await response.blob();
    
    // Генерируем уникальное имя файла
    const filename = `findings/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    // Загружаем файл
    await uploadBytes(storageRef, blob);
    
    // Получаем URL загруженного файла
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Ошибка загрузки фото:', error);
    throw error;
  }
};

// Загрузка фото фасада (скриншот)
export const uploadFacadeImage = async (
  userId: string,
  imageUri: string
): Promise<string> => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const filename = `facades/${userId}/${Date.now()}.png`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Ошибка загрузки изображения фасада:', error);
    throw error;
  }
};

