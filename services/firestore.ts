// Сервис для работы с Firestore

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Element } from '../types/element';
import { Finding, Location } from '../types/finding';
import { POI } from '../types/poi';
import { Facade } from '../types/facade';
import { User } from '../types/user';

// ============= ПОЛЬЗОВАТЕЛИ =============

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data.email,
    displayName: data.displayName,
    level: data.level,
    totalPoints: data.totalPoints,
    createdAt: new Date(data.createdAt)
  };
};

export const updateUserPoints = async (userId: string, points: number): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return;
  
  const currentPoints = userDoc.data().totalPoints || 0;
  const newPoints = currentPoints + points;
  const newLevel = Math.floor(newPoints / 100) + 1; // Каждые 100 очков = новый уровень
  
  await updateDoc(userRef, {
    totalPoints: newPoints,
    level: newLevel
  });
};

// ============= ЭЛЕМЕНТЫ =============

export const getAllElements = async (): Promise<Element[]> => {
  const elementsSnapshot = await getDocs(collection(db, 'elements'));
  
  return elementsSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    description: doc.data().description,
    style: doc.data().style,
    rarity: doc.data().rarity,
    points: doc.data().points,
    imageUrl: doc.data().imageUrl,
    totalFound: doc.data().totalFound || 0
  }));
};

export const getElement = async (elementId: string): Promise<Element | null> => {
  const elementDoc = await getDoc(doc(db, 'elements', elementId));
  
  if (!elementDoc.exists()) return null;
  
  const data = elementDoc.data();
  return {
    id: elementDoc.id,
    name: data.name,
    description: data.description,
    style: data.style,
    rarity: data.rarity,
    points: data.points,
    imageUrl: data.imageUrl,
    totalFound: data.totalFound || 0
  };
};

// ============= НАХОДКИ =============

export const createFinding = async (
  userId: string,
  elementId: string,
  photoUrl: string,
  location: Location,
  address: string
): Promise<string> => {
  const finding = {
    userId,
    elementId,
    photoUrl,
    location,
    address,
    status: 'pending',
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'findings'), finding);
  return docRef.id;
};

export const getUserFindings = async (userId: string): Promise<Finding[]> => {
  const q = query(
    collection(db, 'findings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      elementId: data.elementId,
      photoUrl: data.photoUrl,
      location: data.location,
      address: data.address,
      status: data.status,
      createdAt: data.createdAt.toDate()
    };
  });
};

export const getApprovedFindings = async (userId: string): Promise<Finding[]> => {
  const q = query(
    collection(db, 'findings'),
    where('userId', '==', userId),
    where('status', '==', 'approved')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      elementId: data.elementId,
      photoUrl: data.photoUrl,
      location: data.location,
      address: data.address,
      status: data.status,
      createdAt: data.createdAt.toDate()
    };
  });
};

// ============= ТОЧКИ ИНТЕРЕСА (POI) =============

export const getAllPOI = async (): Promise<POI[]> => {
  const poiSnapshot = await getDocs(collection(db, 'poi'));
  
  return poiSnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    description: doc.data().description,
    location: doc.data().location,
    elementsNearby: doc.data().elementsNearby || [],
    difficulty: doc.data().difficulty
  }));
};

// ============= ФАСАДЫ =============

export const createFacade = async (facade: Omit<Facade, 'id'>): Promise<string> => {
  const facadeData = {
    ...facade,
    createdAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'facades'), facadeData);
  return docRef.id;
};

export const getUserFacades = async (userId: string): Promise<Facade[]> => {
  const q = query(
    collection(db, 'facades'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      elementsUsed: data.elementsUsed,
      likes: data.likes || 0,
      createdAt: data.createdAt.toDate()
    };
  });
};

export const updateFacadeLikes = async (facadeId: string, increment: number): Promise<void> => {
  const facadeRef = doc(db, 'facades', facadeId);
  const facadeDoc = await getDoc(facadeRef);
  
  if (!facadeDoc.exists()) return;
  
  const currentLikes = facadeDoc.data().likes || 0;
  await updateDoc(facadeRef, {
    likes: currentLikes + increment
  });
};

