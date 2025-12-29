// Стартовая страница (перенаправление)

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '../stores/userStore';
import { getCurrentUser } from '../services/auth';
import { Colors } from '../constants/design';

export default function Index() {
  const user = useUserStore(state => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Проверяем статус авторизации
    const checkAuth = async () => {
      const currentUser = getCurrentUser();
      
      // Небольшая задержка для плавности
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentUser || user) {
        // Пользователь авторизован - на главный экран
        router.replace('/(tabs)');
      } else {
        // Не авторизован - на экран входа
        router.replace('/auth');
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [user]);

  if (!isChecking) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  }
});
