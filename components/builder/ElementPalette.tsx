// Палитра элементов для конструктора

import { FlatList, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ElementWithStatus } from '../../types/element';
import { getRarityColor } from '../../utils/rarity';

interface ElementPaletteProps {
  elements: ElementWithStatus[];
  onSelect: (element: ElementWithStatus) => void;
}

export default function ElementPalette({ elements, onSelect }: ElementPaletteProps) {
  if (elements.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          Найдите элементы во время прогулок, чтобы использовать их в конструкторе
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={elements}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.item,
            { borderColor: getRarityColor(item.rarity) }
          ]}
          onPress={() => onSelect(item)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10
  },
  item: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    minWidth: 100,
    maxWidth: 120
  },
  image: {
    width: '100%',
    height: 80,
    backgroundColor: '#E5E7EB'
  },
  name: {
    padding: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center'
  },
  emptyState: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20
  }
});

