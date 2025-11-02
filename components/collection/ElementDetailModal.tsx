// Модальное окно с деталями элемента

import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ElementWithStatus } from '../../types/element';
import { getRarityColor, getRarityLabel } from '../../utils/rarity';

interface ElementDetailModalProps {
  element: ElementWithStatus | null;
  visible: boolean;
  onClose: () => void;
}

export default function ElementDetailModal({ element, visible, onClose }: ElementDetailModalProps) {
  if (!element) return null;

  const rarityColor = getRarityColor(element.rarity);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <ScrollView>
            {element.isFound && (
              <Image
                source={{ uri: element.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            {!element.isFound && (
              <View style={styles.lockedImage}>
                <Ionicons name="lock-closed" size={60} color="#9CA3AF" />
                <Text style={styles.lockedText}>Элемент ещё не найден</Text>
              </View>
            )}

            <View style={styles.content}>
              <Text style={styles.name}>{element.name}</Text>

              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: rarityColor }]}>
                  <Ionicons name="star" size={16} color="white" />
                  <Text style={styles.badgeText}>{getRarityLabel(element.rarity)}</Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{element.style}</Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{element.points} очков</Text>
                </View>
              </View>

              {element.isFound ? (
                <>
                  <Text style={styles.description}>{element.description}</Text>

                  {element.foundAt && (
                    <View style={styles.infoBox}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text style={styles.infoText}>
                        Найден {element.foundAt.toLocaleDateString('ru-RU')}
                      </Text>
                    </View>
                  )}

                  <View style={styles.infoBox}>
                    <Ionicons name="people" size={20} color="#6B7280" />
                    <Text style={styles.infoText}>
                      Найден {element.totalFound} раз
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.hintBox}>
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  <Text style={styles.hintText}>
                    Найдите этот элемент во время прогулки, чтобы узнать о нём больше
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 60
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB'
  },
  lockedImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lockedText: {
    marginTop: 15,
    fontSize: 16,
    color: '#9CA3AF'
  },
  content: {
    padding: 20
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white'
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 10
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280'
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    padding: 15,
    borderRadius: 8,
    gap: 10
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20
  }
});

