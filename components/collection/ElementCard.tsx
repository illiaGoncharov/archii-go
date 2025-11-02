// Карточка архитектурного элемента в коллекции

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ElementWithStatus } from '../../types/element';
import { getRarityColor, getRarityLabel } from '../../utils/rarity';

interface ElementCardProps {
  element: ElementWithStatus;
  onPress: () => void;
}

export default function ElementCard({ element, onPress }: ElementCardProps) {
  const rarityColor = getRarityColor(element.rarity);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !element.isFound && styles.locked,
        { borderColor: rarityColor }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {element.isFound ? (
        <>
          <Image
            source={{ uri: element.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {element.name}
            </Text>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
              <Text style={styles.rarityText}>
                {getRarityLabel(element.rarity)}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.lockedContent}>
          <Ionicons name="lock-closed" size={40} color="#9CA3AF" />
          <Text style={styles.lockedText}>Не найден</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  locked: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6'
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB'
  },
  info: {
    padding: 10
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 5
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white'
  },
  lockedContent: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  lockedText: {
    marginTop: 10,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500'
  }
});

