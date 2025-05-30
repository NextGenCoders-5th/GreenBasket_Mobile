import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';
import CustomHeader from '@/components/ui/CustomHeader';

export default function TabsLayout() {
  const colors = useColorTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // header: () => <CustomHeader />,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors['primary-100'],
        },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name='home'
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
          headerTitle: '',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='shopping-search'
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          headerTitle: '',
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='cart' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='account'
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
