// Главный layout приложения

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthChange } from '../services/auth';
import { useUserStore } from '../stores/userStore';

export default function RootLayout() {
  const setUser = useUserStore(state => state.setUser);
  const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {
    // Подписываемся на изменения авторизации
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Пользователь авторизован — загружаем данные
        await fetchUser(firebaseUser.uid);
      } else {
        // Пользователь вышел
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="builder" />
      </Stack>
    </>
  );
}

