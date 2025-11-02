// Экран камеры для съёмки элементов

import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useCameraStore } from '../../stores/cameraStore';
import { useUserStore } from '../../stores/userStore';
import { uploadFindingPhoto } from '../../services/storage';
import { createFinding } from '../../services/firestore';
import { getCurrentLocation, getAddressFromCoords } from '../../utils/geolocation';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);
  
  const { photoUri, isUploading, setPhoto, setUploading, setError, reset } = useCameraStore();
  const user = useUserStore(state => state.user);

  if (!permission) {
    return <View style={styles.container}><Text>Загрузка...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Нужен доступ к камере</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Разрешить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhoto(photo.uri);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сделать снимок');
    }
  };

  const handleSubmit = async () => {
    if (!photoUri || !user) return;

    setUploading(true);
    
    try {
      // Получаем текущую геолокацию
      const location = await getCurrentLocation();
      
      if (!location) {
        Alert.alert('Ошибка', 'Не удалось определить местоположение');
        setUploading(false);
        return;
      }

      // Получаем адрес
      const address = await getAddressFromCoords(location.latitude, location.longitude);

      // Загружаем фото в Firebase Storage
      const photoUrl = await uploadFindingPhoto(user.id, photoUri);

      // Создаём находку в Firestore (со статусом pending)
      await createFinding(user.id, '', photoUrl, location, address);

      Alert.alert(
        'Успех!',
        'Фотография отправлена на модерацию. После проверки элемент появится в вашей коллекции.',
        [{ text: 'ОК', onPress: reset }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось загрузить фотографию');
    } finally {
      setUploading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Если фото сделано — показываем превью
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        
        <View style={styles.previewControls}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setPhoto(null)}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>Переснять</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
            disabled={isUploading}
          >
            <Text style={styles.buttonText}>
              {isUploading ? 'Загрузка...' : 'Отправить'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Экран камеры
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.header}>
          <Text style={styles.hint}>
            Найди архитектурный элемент и сфотографируй его
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.iconButton} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  camera: {
    flex: 1
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
    fontSize: 16
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  hint: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6'
  },
  preview: {
    flex: 1,
    width: '100%'
  },
  previewControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#3B82F6'
  },
  secondaryButton: {
    backgroundColor: '#6B7280'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

