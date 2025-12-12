// Анимированный bounding box для детекции архитектурного элемента
// Поддерживает: появление (fade+scale), пульсация (glow), цвет по стилю

import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { Detection } from '../../types/detection';
import { ARCHITECTURAL_ELEMENTS } from '../../constants/architecturalElements';

interface BoundingBoxProps {
  detection: Detection;
  frameWidth: number;
  frameHeight: number;
  onPress: (detection: Detection) => void;
  isSelected: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const BoundingBox: React.FC<BoundingBoxProps> = ({
  detection,
  frameWidth,
  frameHeight,
  onPress,
  isSelected
}) => {
  // Получаем информацию об элементе для цвета
  const elementInfo = ARCHITECTURAL_ELEMENTS[detection.classId];
  const color = elementInfo?.colorPrimary || '#8250DF';
  const glowColor = elementInfo?.colorGlow || 'rgba(130, 80, 223, 0.4)';
  
  // Анимации
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0.5);
  const borderWidth = useSharedValue(2);
  
  // Появление при монтировании
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) });
    
    // Пульсация glow
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // Бесконечно
      true // Reverse
    );
  }, []);
  
  // Выделение при выборе
  useEffect(() => {
    borderWidth.value = withTiming(isSelected ? 4 : 2, { duration: 200 });
  }, [isSelected]);
  
  // Конвертируем нормализованные координаты в пиксели
  const { boundingBox } = detection;
  const left = boundingBox.x * frameWidth;
  const top = boundingBox.y * frameHeight;
  const width = boundingBox.width * frameWidth;
  const height = boundingBox.height * frameHeight;
  
  // Анимированные стили контейнера
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));
  
  // Анимированные стили рамки
  const boxStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    shadowOpacity: interpolate(glowOpacity.value, [0.3, 0.8], [0.3, 0.8])
  }));
  
  // Анимированный glow-эффект
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value
  }));
  
  return (
    <AnimatedTouchable
      style={[
        styles.container,
        containerStyle,
        {
          left,
          top,
          width,
          height
        }
      ]}
      onPress={() => onPress(detection)}
      activeOpacity={0.8}
    >
      {/* Glow-слой (под рамкой) */}
      <Animated.View
        style={[
          styles.glow,
          glowStyle,
          {
            backgroundColor: glowColor,
            shadowColor: color
          }
        ]}
      />
      
      {/* Основная рамка */}
      <Animated.View
        style={[
          styles.box,
          boxStyle,
          {
            borderColor: color,
            shadowColor: color
          }
        ]}
      />
      
      {/* Уголки (как в NFT-стиле) */}
      <View style={[styles.corner, styles.cornerTopLeft, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerTopRight, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerBottomRight, { borderColor: color }]} />
      
      {/* Лейбл с названием */}
      <View style={[styles.label, { backgroundColor: color }]}>
        <Text style={styles.labelText} numberOfLines={1}>
          {detection.className}
        </Text>
        <Text style={styles.confidenceText}>
          {Math.round(detection.confidence * 100)}%
        </Text>
      </View>
    </AnimatedTouchable>
  );
};

const CORNER_SIZE = 16;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0.8
  },
  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8
  },
  // Уголки NFT-стиля
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE
  },
  cornerTopLeft: {
    top: -1,
    left: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4
  },
  cornerTopRight: {
    top: -1,
    right: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4
  },
  cornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4
  },
  cornerBottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4
  },
  label: {
    position: 'absolute',
    top: -28,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  confidenceText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '500'
  }
});

export default BoundingBox;
