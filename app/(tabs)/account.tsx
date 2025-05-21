import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/ui/IconButton';
import TextButton from '@/components/ui/TextButton';
import { router, Stack } from 'expo-router';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import AccountButton from '@/components/account/AccountButton';
import { useAuth } from '@/hooks/useAuth';
import SignIn from '@/components/account/SignIn';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';
import { useGetCurrentUserQuery } from '@/redux/api/userApi';

export default function AccountScreen() {
  const colors = useColorTheme();

  const { logout, isLoading: isInitialAuthLoading } = useAuth();
  const userFromAuthSlice = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // OPTION A: Use RTK Query for the most up-to-date user profile data
  const {
    data: currentUserResponse,
    isLoading: isUserQueryLoading,
    refetch: refetchCurrentUser,
  } = useGetCurrentUserQuery(undefined, { skip: !isAuthenticated });
  const user = currentUserResponse?.data?.data || userFromAuthSlice;
  const isLoading =
    isInitialAuthLoading || (isAuthenticated && isUserQueryLoading);

  // // OPTION B: Rely on userFromAuthSlice (simpler if useAuth updates it sufficiently)
  // const user = userFromAuthSlice;
  // const isLoading = isInitialAuthLoading;

  if (isLoading) {
    return <LoadingIndicator message='Loading account...' />;
  }

  if (!isAuthenticated || !user) {
    // Check isAuthenticated first, then user
    return <SignIn message='Please sign in to access your account.' />;
  }

  // User is authenticated and user object exists
  const {
    email,
    first_name,
    profile_picture,
    is_onboarding,
    id: userId,
  } = user;
  const profileImageUrl = useTransformImageUrl({ imageUrl: profile_picture });

  const handleSignOut = async () => {
    await logout();
    // Navigation will happen automatically when `user` becomes null due to re-render
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <Stack.Screen options={{ title: 'My Account' }} />
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Header */}
        <View style={styles.userInfoHeader}>
          <View style={styles.avatarContainer}>
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View
                style={[
                  styles.initialsCircle,
                  { backgroundColor: colors['primary-200'] },
                ]}
              >
                <Text
                  style={[
                    styles.initialsText,
                    { color: colors['primary-700'] },
                  ]}
                >
                  {email ? email[0].toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            <Text
              style={[styles.userName, { color: colors['gray-900'] }]}
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>

          <View style={styles.headerIcons}>
            <IconButton
              icon='moon'
              onPress={() => {}}
              color={colors['gray-700']}
              size={24}
            />
            <IconButton
              icon='notifications-outline'
              onPress={() => {}}
              color={colors['gray-700']}
              size={24}
            />
          </View>
        </View>

        {/* Quick Actions - Conditionally render or adjust if in onboarding */}
        {!is_onboarding && (
          <View
            style={[
              styles.quickActionsContainer,
              { borderBottomColor: colors['gray-200'] },
            ]}
          >
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.push('/wishlist')}
            >
              <Ionicons
                name='heart-outline'
                size={22}
                color={colors['gray-700']}
              />
              <Text
                style={[styles.quickActionText, { color: colors['gray-700'] }]}
              >
                Wishlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.push('/(tabs)/cart')}
            >
              <Ionicons
                name='cart-outline'
                size={22}
                color={colors['gray-700']}
              />
              <Text
                style={[styles.quickActionText, { color: colors['gray-700'] }]}
              >
                Cart
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account Options */}
        <View style={styles.accountOptionsContainer}>
          {is_onboarding && (
            <View style={styles.onboardingPromptHeader}>
              <Text
                style={[
                  styles.onboardingPromptText,
                  { color: colors['gray-900'] },
                ]}
              >
                Welcome!
              </Text>
            </View>
          )}
          {is_onboarding && (
            <AccountButton
              label='Complete Your Profile'
              labelStyle={{
                color: colors.primary,
                fontFamily: 'Inter-SemiBold',
              }}
              onPress={() => router.push('/(profile)/complete-onboarding')}
              style={styles.completeOnboardingButton}
              icon='checkmark-done-circle-outline'
              iconColor={colors.primary}
            />
          )}

          <AccountButton
            label='Edit Profile'
            icon='person-circle-outline'
            onPress={() => router.navigate(`/(profile)/${user.id}`)} // Assuming an edit screen
          />
          <AccountButton
            label='Shipping Addresses'
            icon='location-outline'
            onPress={() => router.navigate('/(profile)/addresses')} // Example route
          />
          <AccountButton
            label='Order History'
            icon='receipt-outline'
            onPress={() => router.navigate('/(order)')} // Navigate to order history group
          />
          <AccountButton
            label='Change Password'
            icon='lock-closed-outline'
            onPress={() => router.navigate('/(profile)/change-password')} // Example route
          />
          <AccountButton
            label='Language'
            icon='language-outline'
            onPress={() => alert('Language Settings (To be implemented)')}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TextButton
            style={[
              styles.actionButtonBase,
              {
                backgroundColor: colors.background,
                borderColor: colors.red,
                borderWidth: 1,
              },
            ]}
            titleStyle={{ color: colors.red }}
            title='Delete Account'
            onPress={() => alert('Delete Account (To be implemented)')}
          />
          <TextButton
            style={[styles.actionButtonBase, { backgroundColor: colors.red }]}
            titleStyle={{ color: colors.white }}
            title='Sign Out'
            onPress={handleSignOut}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexGrow: 1,
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  onboardingPromptHeader: {
    flex: 1,
    marginVertical: 10,
  },
  onboardingPromptText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  initialsCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    flexShrink: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10, // Add some padding for touchability
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  accountOptionsContainer: {
    marginBottom: 'auto',
    flexGrow: 1,
  },
  completeOnboardingButton: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    paddingVertical: 5,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    gap: 15,
    paddingTop: 20,
    marginBottom: 10,
  },
  actionButtonBase: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
