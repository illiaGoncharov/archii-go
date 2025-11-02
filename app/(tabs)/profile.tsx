// Экран профиля пользователя

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../stores/userStore';
import { useCollectionStore } from '../../stores/collectionStore';
import { signOut } from '../../services/auth';
import { getUserFacades } from '../../services/firestore';
import { calculateLevelProgress, getPointsToNextLevel } from '../../utils/points';
import { Facade } from '../../types/facade';

export default function ProfileScreen() {
  const user = useUserStore(state => state.user);
  const clearUser = useUserStore(state => state.clearUser);
  const { userElements } = useCollectionStore();
  const [facades, setFacades] = useState<Facade[]>([]);

  useEffect(() => {
    if (user) {
      loadFacades();
    }
  }, [user]);

  const loadFacades = async () => {
    if (!user) return;
    
    try {
      const userFacades = await getUserFacades(user.id);
      setFacades(userFacades);
    } catch (error) {
      console.error('Ошибка загрузки фасадов:', error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            clearUser();
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Войдите в аккаунт</Text>
      </View>
    );
  }

  const foundElements = userElements.filter(e => e.isFound);
  const levelProgress = calculateLevelProgress(user.totalPoints);
  const pointsToNext = getPointsToNextLevel(user.totalPoints);
  
  // Находим редчайший элемент
  const rarestElement = foundElements.length > 0
    ? foundElements.reduce((rarest, current) => {
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        return rarityOrder[current.rarity] > rarityOrder[rarest.rarity] ? current : rarest;
      })
    : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color="#3B82F6" />
        </View>
        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelLabel}>Уровень {user.level}</Text>
          <Text style={styles.pointsLabel}>{user.totalPoints} очков</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${levelProgress}%` }]} />
        </View>
        
        <Text style={styles.progressText}>
          До следующего уровня: {pointsToNext} очков
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Ionicons name="grid" size={32} color="#3B82F6" />
          <Text style={styles.statValue}>{foundElements.length}</Text>
          <Text style={styles.statLabel}>Найдено элементов</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="star" size={32} color="#F59E0B" />
          <Text style={styles.statValue}>
            {rarestElement?.name || '—'}
          </Text>
          <Text style={styles.statLabel}>Редчайший элемент</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="home" size={32} color="#8B5CF6" />
          <Text style={styles.statValue}>{facades.length}</Text>
          <Text style={styles.statLabel}>Создано фасадов</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/builder')}
        >
          <Ionicons name="construct-outline" size={24} color="#3B82F6" />
          <Text style={styles.actionText}>Конструктор фасадов</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={[styles.actionText, styles.signOutText]}>Выйти</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  message: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#6B7280'
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center'
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5
  },
  email: {
    fontSize: 14,
    color: '#6B7280'
  },
  levelCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  pointsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6'
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 10,
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center'
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827'
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#FEE2E2'
  },
  signOutText: {
    color: '#EF4444'
  }
});

