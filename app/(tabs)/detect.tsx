// Экран детекции архитектурных элементов
// MVP: Камера + overlay bounding boxes + sidebar с информацией

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useDetectionStore } from '../../stores/detectionStore';
import { Detection } from '../../types/detection';
import { DetectionOverlay } from '../../components/detection/DetectionOverlay';
import { ElementSidebar } from '../../components/detection/ElementSidebar';
import { 
  MockDetectionGenerator, 
  generateMockDetections,
  generateRandomDetections 
} from '../../components/detection/MockDetectionGenerator';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/design';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DetectScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  // Zustand store
  const {
    detections,
    selectedDetection,
    isSidebarOpen,
    wikidataInfo,
    isLoadingWikidata,
    setDetections,
    selectDetection,
    closeSidebar,
    clearDetections
  } = useDetectionStore();
  
  // Обработка тапа на bounding box
  const handleDetectionPress = useCallback((detection: Detection) => {
    selectDetection(detection);
  }, [selectDetection]);
  
  // Сделать фото
  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhotoUri(photo.uri);
        
        // Для MVP: генерируем моковые детекции
        // В production здесь будет вызов TFLite модели
        setTimeout(() => {
          const mockDetections = generateMockDetections('baroque_facade');
          setDetections(mockDetections);
        }, 500);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сделать снимок');
      console.error(error);
    }
  };
  
  // Переснять
  const retake = () => {
    setPhotoUri(null);
    clearDetections();
    closeSidebar();
  };
  
  // Загрузить тестовый набор детекций
  const handleSelectMockSet = (newDetections: Detection[]) => {
    setDetections(newDetections);
  };
  
  // Запрос разрешения
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }
  
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.textTertiary} />
        <Text style={styles.permissionTitle}>Нужен доступ к камере</Text>
        <Text style={styles.permissionText}>
          Для распознавания архитектурных элементов приложению нужен доступ к камере
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Разрешить</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* Режим превью фото */}
        {photoUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: photoUri }} style={styles.preview} />
            
            {/* Overlay с bounding boxes */}
            <DetectionOverlay
              detections={detections}
              selectedDetectionId={selectedDetection?.id || null}
              onDetectionPress={handleDetectionPress}
            />
            
            {/* Header */}
            <View style={styles.previewHeader}>
              <TouchableOpacity style={styles.backButton} onPress={retake}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.detectionCounter}>
                <Ionicons name="layers-outline" size={16} color="#FFFFFF" />
                <Text style={styles.counterText}>
                  {detections.length} элементов
                </Text>
              </View>
            </View>
            
            {/* Тестовые наборы (dev mode) */}
            {isTestMode && (
              <View style={styles.testModePanel}>
                <MockDetectionGenerator onSelectSet={handleSelectMockSet} />
              </View>
            )}
            
            {/* Footer actions */}
            <View style={styles.previewFooter}>
              <TouchableOpacity 
                style={styles.testModeToggle}
                onPress={() => setIsTestMode(!isTestMode)}
              >
                <Ionicons 
                  name={isTestMode ? 'flask' : 'flask-outline'} 
                  size={20} 
                  color={isTestMode ? Colors.primary : '#FFFFFF'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.retakeButton} onPress={retake}>
                <Ionicons name="refresh" size={24} color="#FFFFFF" />
                <Text style={styles.retakeText}>Переснять</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Режим камеры */
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
              {/* Header hint */}
              <View style={styles.cameraHeader}>
                <View style={styles.hintBadge}>
                  <Ionicons name="scan-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.hintText}>
                    Наведи на фасад и сфотографируй
                  </Text>
                </View>
              </View>
              
              {/* Центральный прицел */}
              <View style={styles.crosshair}>
                <View style={[styles.crosshairCorner, styles.topLeft]} />
                <View style={[styles.crosshairCorner, styles.topRight]} />
                <View style={[styles.crosshairCorner, styles.bottomLeft]} />
                <View style={[styles.crosshairCorner, styles.bottomRight]} />
              </View>
              
              {/* Camera controls */}
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
                >
                  <Ionicons name="camera-reverse-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => {
                    // Для тестирования без камеры
                    setPhotoUri('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Winter_Palace_SPB_from_Palace_Square.jpg/1280px-Winter_Palace_SPB_from_Palace_Square.jpg');
                    setTimeout(() => {
                      setDetections(generateMockDetections('baroque_facade'));
                    }, 500);
                  }}
                >
                  <Ionicons name="image-outline" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        )}
        
        {/* Sidebar с информацией об элементе */}
        <ElementSidebar
          isOpen={isSidebarOpen}
          detection={selectedDetection}
          wikidataInfo={wikidataInfo}
          isLoading={isLoadingWikidata}
          onClose={closeSidebar}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100
  },
  
  // Permission screen
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl
  },
  permissionTitle: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm
  },
  permissionText: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.base
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight
  },
  
  // Camera
  cameraContainer: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  cameraHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  hintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: Typography.body.fontSize
  },
  
  // Crosshair
  crosshair: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    right: '15%',
    bottom: '30%'
  },
  crosshairCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'rgba(255, 255, 255, 0.6)'
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2
  },
  
  // Camera controls
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.medium
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary
  },
  
  // Preview
  previewContainer: {
    flex: 1
  },
  preview: {
    flex: 1,
    width: '100%'
  },
  previewHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  detectionCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: Typography.body.fontSize,
    fontWeight: '500'
  },
  
  // Test mode panel
  testModePanel: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: Spacing.sm
  },
  
  // Preview footer
  previewFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg
  },
  testModeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm
  },
  retakeText: {
    color: '#FFFFFF',
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight
  }
});
