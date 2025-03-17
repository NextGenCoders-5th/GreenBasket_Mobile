import { View, Text } from 'react-native';
import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // tabBarActiveBackgroundColor: 'blue',
        // tabBarActiveTintColor: 'white',
        // tabBarInactiveTintColor: 'red',
        // tabBarInactiveBackgroundColor: 'yellow',
        // tabBarPosition: 'top',
        // tabBarStyle: {
        //   backgroundColor: 'green',
        //   padding: 10,
        // },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='compass' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
