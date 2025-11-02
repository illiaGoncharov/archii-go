// Стартовая страница (перенаправление)

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '../stores/userStore';

export default function Index() {
  const user = useUserStore(state => state.user);

  useEffect(() => {
    // Перенаправляем на главный экран (tabs)
    // В будущем здесь можно добавить экран входа/регистрации
    router.replace('/(tabs)/map');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  }
});

