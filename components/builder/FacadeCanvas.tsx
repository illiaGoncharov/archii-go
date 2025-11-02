// Холст для конструктора фасадов

import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { FacadeElement } from '../../types/facade';
import { ElementWithStatus } from '../../types/element';

interface FacadeCanvasProps {
  elements: FacadeElement[];
  availableElements: ElementWithStatus[];
  onUpdateElement: (index: number, updates: Partial<FacadeElement>) => void;
  onRemoveElement: (index: number) => void;
}

export default function FacadeCanvas({
  elements,
  availableElements,
  onUpdateElement,
  onRemoveElement
}: FacadeCanvasProps) {
  const getElementData = (elementId: string) => {
    return availableElements.find(e => e.id === elementId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvas}>
        {/* Сетка для визуализации */}
        <View style={styles.grid} />

        {/* Элементы на холсте */}
        {elements.map((element, index) => {
          const elementData = getElementData(element.elementId);
          
          if (!elementData) return null;

          return (
            <View
              key={index}
              style={[
                styles.element,
                {
                  left: element.x,
                  top: element.y,
                  transform: [
                    { scale: element.scale },
                    { rotate: `${element.rotation || 0}deg` }
                  ]
                }
              ]}
            >
              <Image
                source={{ uri: elementData.imageUrl }}
                style={styles.elementImage}
                resizeMode="contain"
              />

              {/* Кнопки управления элементом */}
              <View style={styles.elementControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => onUpdateElement(index, { scale: element.scale + 0.1 })}
                >
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => onUpdateElement(index, { scale: Math.max(0.3, element.scale - 0.1) })}
                >
                  <Ionicons name="remove" size={16} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, styles.deleteButton]}
                  onPress={() => onRemoveElement(index)}
                >
                  <Ionicons name="trash" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {elements.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>Добавьте элементы на холст</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  canvas: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F9FAFB'
  },
  element: {
    position: 'absolute',
    width: 80,
    height: 80
  },
  elementImage: {
    width: '100%',
    height: '100%'
  },
  elementControls: {
    position: 'absolute',
    bottom: -35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5
  },
  controlButton: {
    backgroundColor: '#3B82F6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButton: {
    backgroundColor: '#EF4444'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#9CA3AF'
  }
});

