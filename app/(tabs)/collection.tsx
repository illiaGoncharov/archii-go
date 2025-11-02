// Экран коллекции элементов

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useCollectionStore } from '../../stores/collectionStore';
import { useUserStore } from '../../stores/userStore';
import ElementCard from '../../components/collection/ElementCard';
import ElementDetailModal from '../../components/collection/ElementDetailModal';
import { ElementWithStatus } from '../../types/element';

export default function CollectionScreen() {
  const user = useUserStore(state => state.user);
  const { userElements, isLoading, fetchUserCollection } = useCollectionStore();
  const [selectedElement, setSelectedElement] = useState<ElementWithStatus | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserCollection(user.id);
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Загрузка коллекции...</Text>
      </View>
    );
  }

  const foundElements = userElements.filter(e => e.isFound);
  const totalElements = userElements.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Моя коллекция</Text>
        <Text style={styles.subtitle}>
          Найдено: {foundElements.length} / {totalElements}
        </Text>
      </View>

      <FlatList
        data={userElements}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ElementCard
            element={item}
            onPress={() => setSelectedElement(item)}
          />
        )}
      />

      <ElementDetailModal
        element={selectedElement}
        visible={selectedElement !== null}
        onClose={() => setSelectedElement(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280'
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280'
  },
  grid: {
    padding: 10
  }
});

