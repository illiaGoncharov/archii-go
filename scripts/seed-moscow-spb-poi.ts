// Скрипт для заполнения Firestore точками интереса Москвы и Санкт-Петербурга
// Запустить: npx ts-node scripts/seed-moscow-spb-poi.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase-config';
import { moscowSpbPOIs, DetailedPOI } from '../constants/poi-moscow-spb';

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Конвертация DetailedPOI в формат для Firestore
function convertPOIForFirestore(poi: DetailedPOI) {
  return {
    // Базовые поля (совместимость с существующим типом POI)
    title: poi.name,
    description: poi.descriptionShort,
    location: {
      latitude: poi.coordinates.latitude,
      longitude: poi.coordinates.longitude
    },
    elementsNearby: poi.elements,
    difficulty: poi.difficulty,
    
    // Расширенные поля
    name: poi.name,
    address: poi.address,
    city: poi.city,
    descriptionShort: poi.descriptionShort,
    descriptionFull: poi.descriptionFull,
    style: poi.style,
    elements: poi.elements,
    funFact: poi.funFact,
    coordinates: poi.coordinates
  };
}

async function seedMoscowSpbPOI() {
  console.log('🏛️  Начинаем загрузку точек интереса Москвы и Санкт-Петербурга...\n');
  
  try {
    const moscowPOIs = moscowSpbPOIs.filter(poi => poi.city === 'Москва');
    const spbPOIs = moscowSpbPOIs.filter(poi => poi.city === 'Санкт-Петербург');
    
    console.log(`📍 Москва: ${moscowPOIs.length} точек`);
    console.log(`📍 Санкт-Петербург: ${spbPOIs.length} точек`);
    console.log(`📍 Всего: ${moscowSpbPOIs.length} точек\n`);
    
    // Загружаем московские точки
    console.log('🏛️  Загружаем московские точки...');
    for (const poi of moscowPOIs) {
      const poiData = convertPOIForFirestore(poi);
      await setDoc(doc(db, 'poi', poi.id), poiData);
      console.log(`  ✓ ${poi.name} (${poi.style})`);
    }
    
    console.log('\n🏛️  Загружаем петербургские точки...');
    for (const poi of spbPOIs) {
      const poiData = convertPOIForFirestore(poi);
      await setDoc(doc(db, 'poi', poi.id), poiData);
      console.log(`  ✓ ${poi.name} (${poi.style})`);
    }
    
    console.log('\n✅ Успешно загружено!');
    console.log(`   📦 Москва: ${moscowPOIs.length} точек`);
    console.log(`   📦 Санкт-Петербург: ${spbPOIs.length} точек`);
    console.log(`   📦 Всего: ${moscowSpbPOIs.length} точек`);
    
    // Статистика по стилям
    console.log('\n📊 Статистика по стилям:');
    const styleStats = moscowSpbPOIs.reduce((acc, poi) => {
      acc[poi.style] = (acc[poi.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(styleStats).forEach(([style, count]) => {
      console.log(`   ${style}: ${count}`);
    });
    
    // Статистика по сложности
    console.log('\n📊 Статистика по сложности:');
    const difficultyStats = moscowSpbPOIs.reduce((acc, poi) => {
      acc[poi.difficulty] = (acc[poi.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(difficultyStats).forEach(([difficulty, count]) => {
      console.log(`   ${difficulty}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при загрузке:', error);
    throw error;
  }
}

// Запускаем скрипт
seedMoscowSpbPOI()
  .then(() => {
    console.log('\n🎉 Готово!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Произошла ошибка:', error);
    process.exit(1);
  });
