// Модальное окно с деталями точки интереса

import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { POI } from '../../types/poi';

interface POIDetailModalProps {
  poi: POI | null;
  visible: boolean;
  onClose: () => void;
}

export default function POIDetailModal({ poi, visible, onClose }: POIDetailModalProps) {
  if (!poi) return null;

  const getDifficultyLabel = () => {
    switch (poi.difficulty) {
      case 'easy':
        return 'Легко';
      case 'medium':
        return 'Средне';
      case 'hard':
        return 'Сложно';
      default:
        return '';
    }
  };

  const getDifficultyColor = () => {
    switch (poi.difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{poi.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.difficultyBadge}>
              <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor() }]} />
              <Text style={styles.difficultyText}>Сложность: {getDifficultyLabel()}</Text>
            </View>

            <Text style={styles.description}>{poi.description}</Text>

            <View style={styles.elementsSection}>
              <Text style={styles.sectionTitle}>Элементы рядом:</Text>
              <Text style={styles.elementsCount}>
                {poi.elementsNearby.length} элементов можно найти в этом месте
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Идти туда</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1
  },
  content: {
    padding: 20
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  difficultyText: {
    fontSize: 14,
    color: '#6B7280'
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20
  },
  elementsSection: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 5
  },
  elementsCount: {
    fontSize: 14,
    color: '#6B7280'
  },
  button: {
    margin: 20,
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

