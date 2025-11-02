// Экран конструктора фасадов

import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../stores/userStore';
import { useCollectionStore } from '../stores/collectionStore';
import { createFacade } from '../services/firestore';
import FacadeCanvas from '../components/builder/FacadeCanvas';
import ElementPalette from '../components/builder/ElementPalette';
import { FacadeElement } from '../types/facade';
import { ElementWithStatus } from '../types/element';

export default function BuilderScreen() {
  const user = useUserStore(state => state.user);
  const { userElements } = useCollectionStore();
  const [facadeElements, setFacadeElements] = useState<FacadeElement[]>([]);
  const [title, setTitle] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Только найденные элементы доступны в конструкторе
  const availableElements = userElements.filter(e => e.isFound);

  const handleAddElement = (element: ElementWithStatus) => {
    // Добавляем элемент в центр холста
    const newElement: FacadeElement = {
      elementId: element.id,
      x: 150,
      y: 200,
      scale: 1,
      rotation: 0
    };
    
    setFacadeElements([...facadeElements, newElement]);
    setShowPalette(false);
  };

  const handleUpdateElement = (index: number, updates: Partial<FacadeElement>) => {
    const updated = [...facadeElements];
    updated[index] = { ...updated[index], ...updates };
    setFacadeElements(updated);
  };

  const handleRemoveElement = (index: number) => {
    setFacadeElements(facadeElements.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Ошибка', 'Войдите в аккаунт');
      return;
    }

    if (facadeElements.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы один элемент');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название фасада');
      return;
    }

    setIsSaving(true);

    try {
      await createFacade({
        userId: user.id,
        title: title.trim(),
        elementsUsed: facadeElements,
        likes: 0,
        createdAt: new Date()
      });

      Alert.alert(
        'Успех!',
        'Фасад сохранён',
        [
          {
            text: 'ОК',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить фасад');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Конструктор фасадов</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          <Ionicons name="checkmark" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleInput}>
        <TextInput
          style={styles.input}
          placeholder="Название фасада"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <FacadeCanvas
        elements={facadeElements}
        availableElements={availableElements}
        onUpdateElement={handleUpdateElement}
        onRemoveElement={handleRemoveElement}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowPalette(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>Добавить элемент</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Элементов на фасаде: {facadeElements.length}
        </Text>
      </View>

      {/* Палитра элементов */}
      <Modal
        visible={showPalette}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPalette(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paletteContainer}>
            <View style={styles.paletteHeader}>
              <Text style={styles.paletteTitle}>Выберите элемент</Text>
              <TouchableOpacity onPress={() => setShowPalette(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ElementPalette
              elements={availableElements}
              onSelect={handleAddElement}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  titleInput: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 15
  },
  input: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16
  },
  controls: {
    padding: 20,
    backgroundColor: 'white'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  hint: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  paletteContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%'
  },
  paletteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  paletteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  }
});

