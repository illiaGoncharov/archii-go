// Layout для tab navigation

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/design';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.divider
        }
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Карта',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="detect"
        options={{
          title: 'Детекция',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Камера',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Коллекция',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}

