import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
        gap: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
        }}
      >
        Welcome
      </Text>
      <Link
        href='/(tabs)'
        style={{ borderRadius: 10, padding: 10, backgroundColor: 'blue' }}
      >
        <Text
          style={{
            color: '#fff',
          }}
        >
          Let's Get Started
        </Text>
      </Link>
    </View>
  );
}
