import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';
import { IconButton } from '@/components/IconButton';

export default function AccountScreen() {
  const profileUrl = require('@/assets/images/profile.png');
  const colors = useColorTheme();

  return (
    <ScrollView
      contentContainerStyle={{
        // flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
        width: '100%',
      }}
    >
      <View
        style={{
          width: '100%',
          height: 40,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 5,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors['primary-200'],
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {false ? (
              <Image
                source={profileUrl}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <Text
                style={{
                  fontFamily: 'Inter',
                  fontSize: 24,
                  color: colors.text,
                  fontWeight: '700',
                }}
              >
                J
              </Text>
            )}
          </View>
          <Text
            style={{
              fontFamily: 'Inter',
              fontSize: 24,
              fontWeight: '700',
              color: colors['gray-900'],
            }}
          >
            John Doe
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 6,
            paddingRight: 5,
          }}
        >
          <IconButton
            icon='settings'
            onPress={() => {
              alert('settings');
            }}
            color={colors['gray-900']}
          />
          <IconButton
            icon='notifications-outline'
            onPress={() => {
              alert('notifications');
            }}
            color={colors['gray-900']}
          />
        </View>
      </View>
    </ScrollView>
  );
}
