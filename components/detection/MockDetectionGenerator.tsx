// Генератор моковых детекций для тестирования UI
// Используется до интеграции реальной ML-модели

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Detection, ArchitecturalStyle, BoundingBox } from '../../types/detection';
import { ARCHITECTURAL_ELEMENTS } from '../../constants/architecturalElements';
import { Colors, Spacing, BorderRadius, Typography } from '../../constants/design';

// Упрощённый тип для определения моков (classId + boundingBox + confidence)
interface MockDetectionInput {
  classId: string;
  confidence: number;
  boundingBox: BoundingBox;
}

interface MockDetectionSet {
  name: string;
  description: string;
  detections: MockDetectionInput[];
}

// Функция генерации уникального ID
const generateId = () => `det_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Создаёт полный Detection из упрощённого input
const createDetectionFromInput = (input: MockDetectionInput): Detection => {
  const elementInfo = ARCHITECTURAL_ELEMENTS[input.classId];
  
  return {
    id: generateId(),
    classId: input.classId,
    className: elementInfo?.nameRu || input.classId,
    confidence: input.confidence,
    boundingBox: input.boundingBox,
    style: elementInfo?.style || 'eclectic',
    wikidataQid: elementInfo?.wikidataQid || 'Q0'
  };
};

// Тестовые наборы детекций для разных типов фасадов
export const MOCK_DETECTION_SETS: Record<string, MockDetectionSet> = {
  baroque_facade: {
    name: 'Барочный фасад',
    description: 'Типичный барочный фасад с волютами, картушами и пилястрами',
    detections: [
      { classId: 'cornice', confidence: 0.95, boundingBox: { x: 0.05, y: 0.08, width: 0.9, height: 0.06 } },
      { classId: 'pediment', confidence: 0.88, boundingBox: { x: 0.3, y: 0.02, width: 0.4, height: 0.12 } },
      { classId: 'volute', confidence: 0.82, boundingBox: { x: 0.12, y: 0.15, width: 0.08, height: 0.1 } },
      { classId: 'volute', confidence: 0.79, boundingBox: { x: 0.8, y: 0.15, width: 0.08, height: 0.1 } },
      { classId: 'pilaster', confidence: 0.91, boundingBox: { x: 0.08, y: 0.2, width: 0.06, height: 0.5 } },
      { classId: 'pilaster', confidence: 0.89, boundingBox: { x: 0.86, y: 0.2, width: 0.06, height: 0.5 } },
      { classId: 'window', confidence: 0.94, boundingBox: { x: 0.35, y: 0.3, width: 0.12, height: 0.2 } },
      { classId: 'sandrik', confidence: 0.85, boundingBox: { x: 0.33, y: 0.26, width: 0.16, height: 0.05 } },
      { classId: 'cartouche', confidence: 0.76, boundingBox: { x: 0.42, y: 0.55, width: 0.16, height: 0.12 } },
      { classId: 'mascaron', confidence: 0.72, boundingBox: { x: 0.45, y: 0.68, width: 0.1, height: 0.08 } }
    ]
  },
  
  classical_facade: {
    name: 'Классический фасад',
    description: 'Классицизм с колоннами, фронтоном и рустом',
    detections: [
      { classId: 'pediment', confidence: 0.93, boundingBox: { x: 0.2, y: 0.02, width: 0.6, height: 0.15 } },
      { classId: 'column', confidence: 0.96, boundingBox: { x: 0.15, y: 0.15, width: 0.08, height: 0.55 } },
      { classId: 'column', confidence: 0.95, boundingBox: { x: 0.35, y: 0.15, width: 0.08, height: 0.55 } },
      { classId: 'column', confidence: 0.94, boundingBox: { x: 0.57, y: 0.15, width: 0.08, height: 0.55 } },
      { classId: 'column', confidence: 0.93, boundingBox: { x: 0.77, y: 0.15, width: 0.08, height: 0.55 } },
      { classId: 'capital', confidence: 0.88, boundingBox: { x: 0.14, y: 0.13, width: 0.1, height: 0.06 } },
      { classId: 'capital', confidence: 0.87, boundingBox: { x: 0.34, y: 0.13, width: 0.1, height: 0.06 } },
      { classId: 'rustication', confidence: 0.82, boundingBox: { x: 0.05, y: 0.7, width: 0.9, height: 0.2 } },
      { classId: 'cornice', confidence: 0.91, boundingBox: { x: 0.05, y: 0.68, width: 0.9, height: 0.04 } }
    ]
  },
  
  modern_facade: {
    name: 'Модерн',
    description: 'Фасад в стиле модерн с характерными элементами',
    detections: [
      { classId: 'window', confidence: 0.92, boundingBox: { x: 0.2, y: 0.25, width: 0.15, height: 0.25 } },
      { classId: 'window', confidence: 0.90, boundingBox: { x: 0.65, y: 0.25, width: 0.15, height: 0.25 } },
      { classId: 'balcony', confidence: 0.88, boundingBox: { x: 0.38, y: 0.35, width: 0.24, height: 0.15 } },
      { classId: 'mascaron', confidence: 0.75, boundingBox: { x: 0.45, y: 0.15, width: 0.1, height: 0.08 } },
      { classId: 'festoon', confidence: 0.71, boundingBox: { x: 0.3, y: 0.52, width: 0.4, height: 0.06 } },
      { classId: 'cornice', confidence: 0.89, boundingBox: { x: 0.1, y: 0.08, width: 0.8, height: 0.05 } }
    ]
  },
  
  simple_test: {
    name: 'Простой тест',
    description: '3 элемента для быстрой проверки UI',
    detections: [
      { classId: 'cornice', confidence: 0.92, boundingBox: { x: 0.1, y: 0.1, width: 0.8, height: 0.08 } },
      { classId: 'window', confidence: 0.88, boundingBox: { x: 0.35, y: 0.35, width: 0.3, height: 0.25 } },
      { classId: 'pilaster', confidence: 0.85, boundingBox: { x: 0.1, y: 0.2, width: 0.1, height: 0.6 } }
    ]
  }
};

// Генерирует массив Detection из заданного набора
export const generateMockDetections = (setId: string): Detection[] => {
  const set = MOCK_DETECTION_SETS[setId];
  if (!set) return [];
  
  return set.detections.map(createDetectionFromInput);
};

// Генерирует случайные детекции (для тестирования анимаций)
export const generateRandomDetections = (count: number = 5): Detection[] => {
  const detections: Detection[] = [];
  const availableClasses = Object.keys(ARCHITECTURAL_ELEMENTS);
  
  for (let i = 0; i < count; i++) {
    const classId = availableClasses[Math.floor(Math.random() * availableClasses.length)];
    const elementInfo = ARCHITECTURAL_ELEMENTS[classId];
    
    detections.push({
      id: generateId(),
      classId,
      className: elementInfo.nameRu,
      confidence: 0.6 + Math.random() * 0.35, // 0.6-0.95
      boundingBox: {
        x: Math.random() * 0.6,           // 0-0.6
        y: Math.random() * 0.5,           // 0-0.5
        width: 0.1 + Math.random() * 0.3, // 0.1-0.4
        height: 0.1 + Math.random() * 0.3 // 0.1-0.4
      },
      style: elementInfo.style,
      wikidataQid: elementInfo.wikidataQid
    });
  }
  
  return detections;
};

// Компонент-хелпер для выбора тестового набора
interface MockDetectionGeneratorProps {
  onSelectSet: (detections: Detection[]) => void;
}

export const MockDetectionGenerator: React.FC<MockDetectionGeneratorProps> = ({
  onSelectSet
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {Object.entries(MOCK_DETECTION_SETS).map(([key, set]) => (
        <TouchableOpacity
          key={key}
          style={styles.button}
          onPress={() => onSelectSet(generateMockDetections(key))}
        >
          <Text style={styles.buttonTitle}>{set.name}</Text>
          <Text style={styles.buttonCount}>{set.detections.length} элементов</Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={[styles.button, styles.randomButton]}
        onPress={() => onSelectSet(generateRandomDetections(5))}
      >
        <Text style={styles.buttonTitle}>🎲 Случайно</Text>
        <Text style={styles.buttonCount}>5 элементов</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 80
  },
  content: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm
  },
  randomButton: {
    borderColor: Colors.primary,
    borderStyle: 'dashed'
  },
  buttonTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  buttonCount: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginTop: 2
  }
});

export default MockDetectionGenerator;
