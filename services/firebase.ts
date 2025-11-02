// Инициализация Firebase

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../firebase-config';

// Инициализируем Firebase
export const app = initializeApp(firebaseConfig);

// Инициализируем сервисы
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

