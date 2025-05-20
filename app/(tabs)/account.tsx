import { ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/ui/IconButton';
import TextButton from '@/components/ui/TextButton';
import { router } from 'expo-router';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import AccountButton from '@/components/account/AccountButton';
import { useAuth } from '@/hooks/useAuth';
import SignIn from '@/components/account/SignIn';

export default function AccountScreen() {
  const colors = useColorTheme();
  const { logout, isLoading } = useAuth();
  const user = useSelector(selectCurrentUser);

  if (isLoading) {
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <ActivityIndicator size='large' color={colors['primary']} />;
      </View>
    );
  }

  if (!user) return <SignIn />;

  const { first_name, profile_picture, is_onboarding } = user;

  const handleSignOut = () => {
    logout();
  };

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
          {!is_onboarding && (
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
                {profile_picture ? (
                  <Image
                    src={profile_picture}
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
                    {first_name![0]}
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
                {first_name}
              </Text>
            </View>
          )}

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
          {is_onboarding && (
            <AccountButton
              label='Complete Onboarding'
              onPress={() => {}}
              style={{
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: colors['gray-100'],
                paddingVertical: 5,
                width: '50%',
                alignSelf: 'center',
                borderRadius: 20,
              }}
              icon='checkmark-done-circle-outline'
            />
          )}
          <AccountButton
            label='Profile'
            onPress={() => router.navigate('/(profile)/12')}
          />

          <AccountButton label='Shipping Address' onPress={() => {}} />
          <AccountButton label='Order History' onPress={() => {}} />
          <AccountButton label='Currency' onPress={() => {}} />
          <AccountButton label='Language' onPress={() => {}} />

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
            onPress={handleSignOut}
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
