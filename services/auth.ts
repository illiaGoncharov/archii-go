// Сервис авторизации

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types/user';

// Регистрация нового пользователя
export const signUp = async (email: string, password: string, displayName: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Обновляем профиль
  await updateProfile(firebaseUser, { displayName });

  // Создаём документ пользователя в Firestore
  const newUser: User = {
    id: firebaseUser.uid,
    email,
    displayName,
    level: 1,
    totalPoints: 0,
    createdAt: new Date()
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...newUser,
    createdAt: newUser.createdAt.toISOString()
  });

  return newUser;
};

// Вход
export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Получаем данные пользователя из Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  
  if (!userDoc.exists()) {
    throw new Error('Пользователь не найден в базе данных');
  }

  const userData = userDoc.data();
  
  return {
    id: firebaseUser.uid,
    email: userData.email,
    displayName: userData.displayName,
    level: userData.level,
    totalPoints: userData.totalPoints,
    createdAt: new Date(userData.createdAt)
  };
};

// Выход
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// Подписка на изменение статуса авторизации
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Получить текущего пользователя
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

