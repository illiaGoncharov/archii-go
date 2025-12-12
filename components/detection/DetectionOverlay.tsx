// Overlay с bounding boxes поверх камеры/изображения
// Отображает все детекции и обрабатывает тапы

import React from 'react';
import { StyleSheet, View, Dimensions, LayoutChangeEvent } from 'react-native';
import { Detection } from '../../types/detection';
import BoundingBox from './BoundingBox';

interface DetectionOverlayProps {
  detections: Detection[];
  selectedDetectionId: string | null;
  onDetectionPress: (detection: Detection) => void;
  // Размеры области (по умолчанию — весь экран)
  width?: number;
  height?: number;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  detections,
  selectedDetectionId,
  onDetectionPress,
  width,
  height
}) => {
  const [dimensions, setDimensions] = React.useState({
    width: width || Dimensions.get('window').width,
    height: height || Dimensions.get('window').height
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
    setDimensions({ width: layoutWidth, height: layoutHeight });
  };

  return (
    <View style={styles.container} onLayout={handleLayout} pointerEvents="box-none">
      {detections.map((detection) => (
        <BoundingBox
          key={detection.id}
          detection={detection}
          frameWidth={dimensions.width}
          frameHeight={dimensions.height}
          onPress={onDetectionPress}
          isSelected={detection.id === selectedDetectionId}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10
  }
});

export default DetectionOverlay;
