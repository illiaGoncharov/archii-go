// Slide-in sidebar с информацией об архитектурном элементе
// Появляется при тапе на bounding box

import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
  ActivityIndicator,
  Image
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Detection, WikidataInfo } from '../../types/detection';
import { ARCHITECTURAL_ELEMENTS } from '../../constants/architecturalElements';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/design';

interface ElementSidebarProps {
  isOpen: boolean;
  detection: Detection | null;
  wikidataInfo: WikidataInfo | null;
  isLoading: boolean;
  onClose: () => void;
}

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.85;
const DRAG_THRESHOLD = 50;

export const ElementSidebar: React.FC<ElementSidebarProps> = ({
  isOpen,
  detection,
  wikidataInfo,
  isLoading,
  onClose
}) => {
  const translateX = useSharedValue(SIDEBAR_WIDTH);
  const overlayOpacity = useSharedValue(0);
  
  // Получаем локальную информацию об элементе
  const localInfo = detection ? ARCHITECTURAL_ELEMENTS[detection.classId] : null;
  
  // Анимация открытия/закрытия
  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      overlayOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateX.value = withSpring(SIDEBAR_WIDTH, { damping: 20, stiffness: 200 });
      overlayOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen]);
  
  // Жест свайпа для закрытия
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX > DRAG_THRESHOLD) {
        runOnJS(onClose)();
      } else {
        translateX.value = withSpring(0);
      }
    });
  
  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));
  
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value > 0 ? 'auto' : 'none'
  }));
  
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Ошибка открытия ссылки:', err);
    });
  };
  
  if (!detection) return null;
  
  return (
    <>
      {/* Затемнение фона */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      {/* Sidebar */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sidebar, sidebarStyle]}>
          {/* Ручка для свайпа */}
          <View style={styles.dragHandle} />
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View 
                style={[
                  styles.styleBadge, 
                  { backgroundColor: localInfo?.colorPrimary || Colors.primary }
                ]}
              >
                <Text style={styles.styleBadgeText}>
                  {localInfo?.style?.toUpperCase() || 'ЭЛЕМЕНТ'}
                </Text>
              </View>
              <Text style={styles.epoch}>{localInfo?.epoch}</Text>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Название */}
            <Text style={styles.title}>
              {wikidataInfo?.nameRu || localInfo?.nameRu || detection.className}
            </Text>
            
            {/* Confidence */}
            <View style={styles.confidenceRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.confidenceText}>
                Уверенность: {Math.round(detection.confidence * 100)}%
              </Text>
            </View>
            
            {/* Изображение из Wikidata */}
            {wikidataInfo?.imageUrl && (
              <Image
                source={{ uri: wikidataInfo.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            
            {/* Описание */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Описание</Text>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.description}>
                  {wikidataInfo?.descriptionRu || localInfo?.description || 'Описание загружается...'}
                </Text>
              )}
            </View>
            
            {/* Ссылки */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Узнать больше</Text>
              
              {wikidataInfo?.wikipediaUrl && (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => openLink(wikidataInfo.wikipediaUrl!)}
                >
                  <Ionicons name="book-outline" size={20} color={Colors.primary} />
                  <Text style={styles.linkText}>Википедия</Text>
                  <Ionicons name="open-outline" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>
              )}
              
              {wikidataInfo?.wikidataUrl && (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => openLink(wikidataInfo.wikidataUrl)}
                >
                  <Ionicons name="globe-outline" size={20} color={Colors.primary} />
                  <Text style={styles.linkText}>Wikidata</Text>
                  <Ionicons name="open-outline" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>
              )}
              
              {localInfo?.wikidataQid && (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => openLink(`https://www.google.com/search?q=${encodeURIComponent(localInfo.nameRu + ' архитектура')}&tbm=isch`)}
                >
                  <Ionicons name="images-outline" size={20} color={Colors.primary} />
                  <Text style={styles.linkText}>Примеры в Google</Text>
                  <Ionicons name="open-outline" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Кнопка добавления в коллекцию */}
            <TouchableOpacity style={styles.collectButton}>
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.collectButtonText}>Добавить в коллекцию</Text>
            </TouchableOpacity>
            
            <View style={styles.bottomPadding} />
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.surface,
    zIndex: 101,
    ...Shadows.large,
    borderTopLeftRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xl
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.borderMuted,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md
  },
  headerContent: {
    flex: 1
  },
  styleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm
  },
  styleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1
  },
  epoch: {
    marginTop: Spacing.xs,
    fontSize: Typography.caption.fontSize,
    color: Colors.textTertiary
  },
  closeButton: {
    padding: Spacing.xs
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg
  },
  title: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg
  },
  confidenceText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.background
  },
  section: {
    marginBottom: Spacing.lg
  },
  sectionTitle: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  description: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    color: Colors.textSecondary
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.md
  },
  linkText: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    color: Colors.textPrimary
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.base,
    gap: Spacing.sm,
    marginTop: Spacing.md
  },
  collectButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight
  },
  bottomPadding: {
    height: 40
  }
});

export default ElementSidebar;
