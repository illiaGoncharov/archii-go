// Модальное окно с детальной информацией о точке интереса

import React from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { DetailedPOI } from '../../constants/poi-moscow-spb';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/design';

interface POIDetailModalProps {
  poi: DetailedPOI | null;
  visible: boolean;
  onClose: () => void;
}

export function POIDetailModal({ poi, visible, onClose }: POIDetailModalProps) {
  if (!poi) return null;

  const difficultyColors = {
    easy: Colors.success,
    medium: Colors.warning,
    hard: Colors.error
  };

  const difficultyLabels = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно'
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.container}>
          {/* Шапка */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.city}>{poi.city}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{poi.name}</Text>
            <Text style={styles.address}>{poi.address}</Text>
            
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{poi.style}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: difficultyColors[poi.difficulty] }]}>
                <Text style={styles.badgeText}>{difficultyLabels[poi.difficulty]}</Text>
              </View>
            </View>
          </View>

          {/* Контент */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Краткое описание */}
            <View style={styles.section}>
              <Text style={styles.descriptionShort}>{poi.descriptionShort}</Text>
            </View>

            {/* Полное описание */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>История</Text>
              <Text style={styles.descriptionFull}>{poi.descriptionFull}</Text>
            </View>

            {/* Элементы для поиска */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Что искать на фасаде</Text>
              <View style={styles.elements}>
                {poi.elements.map((element, index) => (
                  <View key={index} style={styles.elementChip}>
                    <Text style={styles.elementText}>{element}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Интересный факт */}
            <View style={[styles.section, styles.funFactSection]}>
              <Text style={styles.funFactLabel}>💡 Интересный факт</Text>
              <Text style={styles.funFact}>{poi.funFact}</Text>
            </View>

            {/* Координаты */}
            <View style={styles.section}>
              <Text style={styles.coordinates}>
                📍 {poi.coordinates.latitude.toFixed(4)}, {poi.coordinates.longitude.toFixed(4)}
              </Text>
            </View>
          </ScrollView>

          {/* Кнопка действия */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Начать поиск элементов</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Spacing.lg,
    borderTopRightRadius: Spacing.lg,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs
  },
  city: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  closeButton: {
    padding: Spacing.xs
  },
  closeIcon: {
    fontSize: 24,
    color: Colors.textSecondary
  },
  title: {
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs
  },
  address: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    marginBottom: Spacing.md
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full
  },
  badgeText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.surface
  },
  content: {
    flex: 1,
    padding: Spacing.lg
  },
  section: {
    marginBottom: Spacing.lg
  },
  sectionTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  descriptionShort: {
    fontSize: Typography.bodyLarge.fontSize,
    lineHeight: Typography.bodyLarge.lineHeight,
    color: Colors.textPrimary,
    fontWeight: Typography.bodyMedium.fontWeight
  },
  descriptionFull: {
    fontSize: Typography.bodyLarge.fontSize,
    lineHeight: Typography.bodyLarge.lineHeight,
    color: Colors.textSecondary
  },
  elements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm
  },
  elementChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  elementText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textPrimary
  },
  funFactSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning
  },
  funFactLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.label.fontWeight,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs
  },
  funFact: {
    fontSize: Typography.bodyLarge.fontSize,
    lineHeight: Typography.bodyLarge.lineHeight,
    color: Colors.textSecondary,
    fontStyle: 'italic'
  },
  coordinates: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center'
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.base,
    alignItems: 'center'
  },
  actionButtonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight,
    color: Colors.surface
  }
});
