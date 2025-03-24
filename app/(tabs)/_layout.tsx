import { View, Text } from 'react-native';
import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function TabsLayout() {
  const colors = useColorTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // headerStyle: {
        //   backgroundColor: colors['header'],
        // },
        // headerTitleStyle: {
        //   color: colors['white'],
        // },
        // tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerTitle: '',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          headerTitle: 'Explore',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='compass' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
