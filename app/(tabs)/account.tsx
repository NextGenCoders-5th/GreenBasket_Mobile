import { Dimensions, SafeAreaView } from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';

// export default function Account() {
//   const colors = useColorTheme();
//   return (
// <SafeAreaView
//   style={{
//     backgroundColor: colors.background,
//     minHeight: Dimensions.get('window').height,
//   }}
// >
//   <AccountScreen />
// </SafeAreaView>
//   );
// }

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/ui/IconButton';
import TextButton from '@/components/ui/TextButton';
import { router } from 'expo-router';

export default function AccountScreen() {
  const profileUrl = require('@/assets/images/profile-2.png');
  const colors = useColorTheme();

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        minHeight: Dimensions.get('window').height,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          // flex: 1,
          paddingHorizontal: 5,
          paddingVertical: 5,
          width: '100%',
          backgroundColor: colors.background,
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
            marginTop: 10,
            borderBottomWidth: 1,
            borderColor: colors['gray-100'],
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <View
            style={{
              display: 'flex',
              // width: 60,
              alignSelf: 'flex-start',
              padding: 5,
              alignItems: 'center',
            }}
          >
            <Ionicons
              style={{}}
              name='heart-outline'
              size={20}
              color={colors['gray-600']}
            />
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: '500',
              }}
            >
              Wishlists
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              // width: 60,
              alignSelf: 'flex-start',
              padding: 5,
              alignItems: 'center',
            }}
          >
            <Ionicons
              style={{}}
              name='cart'
              size={20}
              color={colors['gray-600']}
            />
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: '500',
              }}
            >
              Cart
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 10,
            // gap: 15,
            paddingVertical: 10,
            backgroundColor: colors.background,
            borderRadius: 10,
          }}
        >
          <Pressable
            style={{ ...styles.btn, backgroundColor: colors['gray-50'] }}
            onPress={() => {
              router.navigate('/(profile)/12');
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: '700',
                color: colors['gray-900'],
              }}
            >
              Profile
            </Text>
            <Ionicons
              name='chevron-forward-outline'
              size={20}
              color={colors['gray-600']}
            />
          </Pressable>

          <Pressable
            style={{ ...styles.btn, backgroundColor: colors['gray-50'] }}
            onPress={() => {}}
          >
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: '700',
                color: colors['gray-900'],
              }}
            >
              Shipping Address
            </Text>
            <Ionicons
              name='chevron-forward-outline'
              size={20}
              color={colors['gray-600']}
            />
          </Pressable>

          <Pressable
            style={{ ...styles.btn, backgroundColor: colors['gray-50'] }}
            onPress={() => {}}
          >
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: '700',
                color: colors['gray-900'],
              }}
            >
              Order History
            </Text>
            <Ionicons
              name='chevron-forward-outline'
              size={20}
              color={colors['gray-600']}
            />
          </Pressable>

          <Pressable
            style={{ ...styles.btn, backgroundColor: colors['gray-50'] }}
            onPress={() => {}}
          >
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: '700',
                color: colors['gray-900'],
              }}
            >
              Currency
            </Text>
            <Ionicons
              name='chevron-forward-outline'
              size={20}
              color={colors['gray-600']}
            />
          </Pressable>

          <Pressable
            style={{ ...styles.btn, backgroundColor: colors['gray-50'] }}
            onPress={() => {}}
          >
            <Text
              style={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: '700',
                color: colors['gray-900'],
              }}
            >
              Language
            </Text>
            <Ionicons
              name='chevron-forward-outline'
              size={20}
              color={colors['gray-600']}
            />
          </Pressable>
          <TextButton
            style={{
              ...styles.btn,
              backgroundColor: colors['gray-50'],
              marginBottom: 20,
            }}
            titleStyle={{ color: colors.red }}
            title='Delete Account'
            onPress={() => {}}
          />

          <TextButton
            style={{
              backgroundColor: colors.red,
            }}
            titleStyle={{ color: colors['gray-50'] }}
            title='Sign Out'
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderBottomWidth: 0,
    borderRadius: 10,
  },
});
