import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';
import { IconButton } from '@/components/IconButton';
import TextButton from '@/components/TextButton';
import { router } from 'expo-router';

export default function AccountScreen() {
  const profileUrl = require('@/assets/images/profile-2.png');
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
            gap: 10,
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
            {profileUrl ? (
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
      {/* <View
        style={{
          width: '90%',
          paddingTop: 10,
          marginTop: 10,
          gap: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 24,
            fontWeight: '600',
            color: colors['gray-900'],
          }}
        >
          Welcome to <Text style={{ fontWeight: '900' }}>MiniExpress</Text>
        </Text>
        <TextButton
          style={{
            width: 170,
          }}
          title='Sign in / Register'
          onPress={() => {
            router.navigate('/(auth)/signin');
          }}
        />
      </View> */}
      <View
        style={{
          width: '100%',
          paddingTop: 10,
          marginTop: 10,
          gap: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: colors.background,
          borderRadius: 10,
        }}
      >
        <View style={styles.btnContainer}>
          <TextButton
            style={styles.btn}
            titleStyle={{ color: colors['gray-900'] }}
            title='Profile'
            onPress={() => {}}
          />
          <Ionicons
            name='chevron-forward-outline'
            size={20}
            color={colors['gray-600']}
          />
        </View>
        <View style={styles.btnContainer}>
          <TextButton
            style={styles.btn}
            titleStyle={{ color: colors['gray-900'] }}
            title='Shipping Address'
            onPress={() => {}}
          />
          <Ionicons
            name='chevron-forward-outline'
            size={20}
            color={colors['gray-600']}
          />
        </View>
        <View style={styles.btnContainer}>
          <TextButton
            style={styles.btn}
            titleStyle={{ color: colors['gray-900'] }}
            title='Payment Methods'
            onPress={() => {}}
          />
          <Ionicons
            name='chevron-forward-outline'
            size={20}
            color={colors['gray-600']}
          />
        </View>
        <View style={styles.btnContainer}>
          <TextButton
            style={styles.btn}
            titleStyle={{ color: colors['gray-900'] }}
            title='Order History'
            onPress={() => {}}
          />
          <Ionicons
            name='chevron-forward-outline'
            size={20}
            color={colors['gray-600']}
          />
        </View>
        <View style={styles.btnContainer}>
          <TextButton
            style={styles.btn}
            titleStyle={{ color: colors['gray-900'] }}
            title='Currency'
            onPress={() => {}}
          />
          <Ionicons
            name='chevron-forward-outline'
            size={20}
            color={colors['gray-600']}
          />
        </View>
        <View style={styles.btnContainer}>
          <TextButton
            style={styles.btn}
            titleStyle={{ color: colors['gray-900'] }}
            title='Language'
            onPress={() => {}}
          />
          <Ionicons
            name='chevron-forward-outline'
            size={20}
            color={colors['gray-600']}
          />
        </View>

        <View style={styles.btnContainer}>
          <TextButton
            style={styles.btn}
            titleStyle={{ color: colors.notification }}
            title='Delete Account'
            onPress={() => {}}
          />
        </View>

        <TextButton
          style={{
            backgroundColor: colors.notification,
          }}
          titleStyle={{ color: colors['gray-100'] }}
          title='Sign Out'
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    width: 180,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },
});
