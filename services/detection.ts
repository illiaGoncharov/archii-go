// Сервис детекции архитектурных элементов
// MVP: заглушка с моковыми данными
// Production: интеграция с TFLite через react-native-fast-tflite

import { Detection, TFLiteDetectionResult, FrameDimensions } from '../types/detection';
import { ARCHITECTURAL_ELEMENTS, TFLITE_CLASS_MAP } from '../constants/architecturalElements';
import { generateMockDetections } from '../components/detection/MockDetectionGenerator';

// Конфигурация модели
const MODEL_CONFIG = {
  modelPath: 'architectural_elements.tflite',
  labelsPath: 'labels.txt',
  inputSize: 320,  // EfficientDet-Lite input size
  confidenceThreshold: 0.5,
  iouThreshold: 0.5,
  maxDetections: 10
};

// Генерация уникального ID
const generateId = () => `det_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Конвертирует raw output TFLite в Detection[]
 */
export const convertTFLiteResults = (
  results: TFLiteDetectionResult[],
  frameDimensions: FrameDimensions
): Detection[] => {
  return results
    .filter(r => r.score >= MODEL_CONFIG.confidenceThreshold)
    .slice(0, MODEL_CONFIG.maxDetections)
    .map(result => {
      const classId = TFLITE_CLASS_MAP[result.classIndex] || 'unknown';
      const elementInfo = ARCHITECTURAL_ELEMENTS[classId];
      
      // Конвертируем координаты из пикселей в нормализованные (0-1)
      const boundingBox = {
        x: result.rect.left / frameDimensions.width,
        y: result.rect.top / frameDimensions.height,
        width: (result.rect.right - result.rect.left) / frameDimensions.width,
        height: (result.rect.bottom - result.rect.top) / frameDimensions.height
      };
      
      return {
        id: generateId(),
        classId,
        className: elementInfo?.nameRu || classId,
        confidence: result.score,
        boundingBox,
        style: elementInfo?.style || 'eclectic',
        wikidataQid: elementInfo?.wikidataQid || 'Q0'
      };
    });
};

/**
 * MVP: Детекция на статичном изображении
 * В production заменить на реальный вызов TFLite
 */
export const detectFromImage = async (imageUri: string): Promise<Detection[]> => {
  // Симулируем задержку детекции
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Реальная интеграция с TFLite
  // const model = await loadTensorflowModel(require('../assets/models/architectural_elements.tflite'));
  // const image = await loadImage(imageUri);
  // const results = await model.detect(image);
  // return convertTFLiteResults(results, { width: image.width, height: image.height });
  
  // MVP: возвращаем моковые данные
  return generateMockDetections('baroque_facade');
};

/**
 * MVP: Realtime детекция (frame processor)
 * Для VisionCamera Frame Processor
 */
export const detectFromFrame = (
  frame: ArrayBuffer,
  frameDimensions: FrameDimensions
): Detection[] => {
  // TODO: Реальная интеграция с react-native-fast-tflite
  // Пример для VisionCamera Frame Processor:
  // 
  // const model = useTensorflowModel(require('../assets/models/architectural_elements.tflite'));
  // 
  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const results = model.runSync([frame]);
  //   const detections = convertTFLiteResults(results, frame);
  //   runOnJS(setDetections)(detections);
  // }, [model]);
  
  // MVP: пустой массив (realtime пока не реализован)
  return [];
};

/**
 * Загружает модель TFLite
 * Вызывать при старте приложения
 */
export const initializeDetectionModel = async (): Promise<boolean> => {
  try {
    // TODO: Загрузка реальной модели
    // const model = await TensorflowLite.loadModel({
    //   model: require('../assets/models/architectural_elements.tflite'),
    //   delegate: 'gpu'  // или 'nnapi' для Android
    // });
    
    console.log('Detection model initialized (mock)');
    return true;
  } catch (error) {
    console.error('Ошибка инициализации модели:', error);
    return false;
  }
};

/**
 * Применяет Non-Maximum Suppression к детекциям
 * Убирает перекрывающиеся boxes
 */
export const applyNMS = (
  detections: Detection[],
  iouThreshold: number = 0.5
): Detection[] => {
  if (detections.length === 0) return [];
  
  // Сортируем по confidence (от большего к меньшему)
  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const keep: Detection[] = [];
  
  while (sorted.length > 0) {
    const best = sorted.shift()!;
    keep.push(best);
    
    // Убираем все boxes с высоким IoU
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (calculateIoU(best.boundingBox, sorted[i].boundingBox) > iouThreshold) {
        sorted.splice(i, 1);
      }
    }
  }
  
  return keep;
};

/**
 * Вычисляет Intersection over Union двух bounding boxes
 */
const calculateIoU = (
  box1: Detection['boundingBox'],
  box2: Detection['boundingBox']
): number => {
  const x1 = Math.max(box1.x, box2.x);
  const y1 = Math.max(box1.y, box2.y);
  const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
  const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);
  
  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const area1 = box1.width * box1.height;
  const area2 = box2.width * box2.height;
  const union = area1 + area2 - intersection;
  
  return union > 0 ? intersection / union : 0;
};

/**
 * Сглаживает детекции между кадрами (для realtime)
 * Предотвращает "дрожание" boxes
 */
export const smoothDetections = (
  currentDetections: Detection[],
  previousDetections: Detection[],
  smoothingFactor: number = 0.3
): Detection[] => {
  if (previousDetections.length === 0) return currentDetections;
  
  return currentDetections.map(current => {
    // Ищем соответствующую детекцию в предыдущем кадре
    const previous = previousDetections.find(
      p => p.classId === current.classId && 
           calculateIoU(p.boundingBox, current.boundingBox) > 0.5
    );
    
    if (!previous) return current;
    
    // Сглаживаем координаты
    return {
      ...current,
      boundingBox: {
        x: lerp(previous.boundingBox.x, current.boundingBox.x, smoothingFactor),
        y: lerp(previous.boundingBox.y, current.boundingBox.y, smoothingFactor),
        width: lerp(previous.boundingBox.width, current.boundingBox.width, smoothingFactor),
        height: lerp(previous.boundingBox.height, current.boundingBox.height, smoothingFactor)
      }
    };
  });
};

// Linear interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
