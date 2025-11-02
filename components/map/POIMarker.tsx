// Компонент маркера точки интереса на карте

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { POI } from '../../types/poi';

interface POIMarkerProps {
  poi: POI;
}

export default function POIMarker({ poi }: POIMarkerProps) {
  const getDifficultyColor = () => {
    switch (poi.difficulty) {
      case 'easy':
        return '#10B981'; // Зелёный
      case 'medium':
        return '#F59E0B'; // Оранжевый
      case 'hard':
        return '#EF4444'; // Красный
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getDifficultyColor() }]}>
      <Ionicons name="location" size={24} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});

