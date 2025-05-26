import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react'; // Import useEffect
import { useColorTheme } from '@/hooks/useColorTheme';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '@/components/ui/IconButton';
import TextButton from '@/components/ui/TextButton';
import { router, Stack } from 'expo-router';
import {
  // selectCurrentUser, // Not directly used for data display here
  selectIsAuthenticated,
} from '@/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import AccountButton from '@/components/account/AccountButton';
import { useAuth } from '@/hooks/useAuth';
import SignIn from '@/components/account/SignIn';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';
// Use the useCurrentUser hook instead of direct RTK Query hook
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Import the color scheme context hook and preference type
import {
  useColorScheme,
  ColorSchemePreference,
} from '@/contexts/ColorSchmeContext';
import Button from '@/components/ui/Button';
import Toast from 'react-native-toast-message';
import LoadingError from '@/components/ui/LoadingError';

export default function AccountScreen() {
  const colors = useColorTheme(); // Use the colors from the active theme

  const { logout, isLoading: isInitialAuthLoading } = useAuth();
  // Removed direct useSelector for userFromAuthSlice
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Use the useCurrentUser hook to get user data and its loading/error states
  const {
    user,
    isLoading: isUserLoading,
    error: userError,
    refetchCurrentUser,
  } = useCurrentUser();

  // Use the color scheme context hook to get theme states and setter
  const {
    colorScheme: activeColorScheme, // The currently applied scheme (light/dark)
    preference, // The user's saved preference (system/light/dark)
    setColorScheme, // The function to change the preference
    isLoaded: isColorSchemeLoaded, // Check if preference is loaded
  } = useColorScheme(); // <-- Use the color scheme context hook

  // Combine all loading states: initial auth, user data, and color scheme preference loading
  const isLoading =
    isInitialAuthLoading || isUserLoading || !isColorSchemeLoaded;

  const profileImageUrl = useTransformImageUrl({
    imageUrl: user?.profile_picture,
  }); // Use user from hook

  const handleSignOut = async () => {
    await logout();
    // Navigation will happen automatically due to _layout.tsx reacting to isAuthenticated changing
  };

  // Function to handle theme preference change
  const handleThemeChange = async (newPreference: ColorSchemePreference) => {
    await setColorScheme(newPreference);
    // Optional: Show a toast or other feedback
    Toast.show({
      type: 'info',
      text1: 'Theme Updated',
      text2: `Preference set to ${newPreference}.`,
      visibilityTime: 2000,
    });
  };

  // Show combined loading state
  if (isLoading) {
    return <LoadingIndicator message='Loading account...' />;
  }

  // Show sign-in prompt if not authenticated after loading
  if (!isAuthenticated) {
    // This condition is also handled by the useEffect redirect, but kept here for clarity
    return <SignIn message='Please sign in to access your account.' />;
  }

  if (userError) {
    const errorMessage =
      (userError as any)?.data?.message ||
      'Failed to load user data. Check your connection.';
    console.log('userError', userError);
    if ((userError as any)?.status === '404') {
      console.log('status code', userError.data?.status);
    }
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        {/* <ErrorMessage message={errorMessage} onRetry={refetch} /> */}
        <LoadingError message={errorMessage} onRetry={refetchCurrentUser} />
      </SafeAreaView>
    );
  }

  // If authenticated but user data is still null or error after loading (should be rare)
  if (!user) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.userName, { color: colors['gray-700'] }]}>
          User data not available.
        </Text>
        {/* Add a retry button for user data fetch */}
        {userError && (
          <Button
            title='Retry Loading User'
            onPress={refetchCurrentUser}
            style={{ marginTop: 20 }}
          />
        )}
      </SafeAreaView>
    );
  }

  // User is authenticated and user object exists
  const {
    email,
    first_name,
    last_name,
    profile_picture,
    is_onboarding,
    id: userId,
  } = user;

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
                  // Use color from the current theme
                  { backgroundColor: colors['primary-200'] },
                ]}
              >
                <Text
                  style={[
                    styles.initialsText,
                    // Use color from the current theme
                    { color: colors['primary-700'] },
                  ]}
                >
                  {email ? email[0].toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            {/* Display first name if onboarding is complete, else email */}
            <Text
              style={[styles.userName, { color: colors['gray-900'] }]}
              numberOfLines={1}
            >
              {is_onboarding ? email : `${first_name} ${last_name}`}
              {/* Conditional display */}
            </Text>
          </View>

          {/* Header Icons */}
          {/* <View style={styles.headerIcons}>
            <IconButton
              icon='notifications-outline'
              onPress={() => {}}
              color={colors['gray-700']}
              size={24}
            />
          </View> */}
        </View>

        {/* Quick Actions */}
        {/* {!is_onboarding && ( */}
        <View
          style={[
            styles.quickActionsContainer,
            // Use color from the current theme
            { borderBottomColor: colors['gray-200'] },
          ]}
        >
          {/* ... Quick Action Buttons ... */}

          <Button
            icon='heart'
            onPress={() => {
              router.push('/(profile)/wishlist');
            }}
            title='Wishlists'
            style={{
              ...styles.quickActionItem,
              backgroundColor: colors['primary-100'],
              width: 90,
            }}
            iconColor={colors.notification}
            titleStyle={{ color: colors['gray-700'] }}
          />

          <Button
            icon='cart-outline'
            onPress={() => router.push('/(tabs)/cart')}
            title='Cart'
            style={{
              ...styles.quickActionItem,
              backgroundColor: colors['primary-100'],
              width: 90,
            }}
            iconColor={colors['gray-700']}
            titleStyle={{ color: colors['gray-700'] }}
          />
        </View>
        {/* )} */}

        {/* Account Options */}
        <View style={styles.accountOptionsContainer}>
          {is_onboarding ? (
            <View style={styles.onboardingPromptHeader}>
              <Text
                style={[
                  styles.onboardingPromptText,
                  // Use color from the current theme
                  { color: colors['gray-900'] },
                ]}
              >
                Welcome!
              </Text>
            </View>
          ) : null}
          {is_onboarding ? (
            <AccountButton
              label='Complete Your Profile'
              labelStyle={{
                color: colors.primary, // Use color from the current theme
                fontFamily: 'Inter-SemiBold',
              }}
              onPress={() => router.push('/(profile)/complete-onboarding')}
              // style={[
              //   styles.completeOnboardingButton,
              //   { borderBottomColor: colors['gray-200'] },
              // ]} // Add border color
              icon='checkmark-done-circle-outline'
              iconColor={colors.primary} // Use color from the current theme
            />
          ) : null}

          {/* Standard Account Buttons */}
          <AccountButton
            label='Profile'
            icon='person-circle-outline'
            // Navigate to the non-dynamic edit profile screen
            onPress={() => router.navigate(`/(profile)/${userId}`)}
          />
          <AccountButton
            label='Shipping Addresses'
            icon='location-outline'
            // Navigate to the non-dynamic address list screen
            onPress={() => router.navigate('/(address)/address')}
          />
          <AccountButton
            label='Order History'
            icon='receipt-outline'
            // Navigate to the order history index screen
            onPress={() => router.navigate('/(order)/order-history')}
          />
          <AccountButton
            label='Change Password'
            icon='lock-closed-outline'
            // Navigate to the update password screen
            onPress={() => router.navigate('/(auth)/update-password')}
          />
          {/* <AccountButton
            label='Language'
            icon='language-outline'
            onPress={() => alert('Language Settings (To be implemented)')}
          /> */}

          {/* Theme Settings Section */}
          <View style={[{ marginTop: 25 }]}>
            {/* Add margin top to separate */}
            <Text style={[styles.sectionTitle, { color: colors['gray-700'] }]}>
              Theme preference
            </Text>
            <View style={styles.themeButtonsContainer}>
              <Button
                icon='color-palette-outline'
                iconColor={
                  preference === 'system' ? colors.primary : colors['gray-700']
                }
                title='System'
                onPress={() => handleThemeChange('system')}
                style={[
                  styles.themeButton,
                  // Use theme colors for styling
                  {
                    backgroundColor: colors.background,
                    borderColor: colors['gray-300'],
                  },
                  preference === 'system' && {
                    borderColor: colors.primary,
                    borderWidth: 1.5,
                  },
                ]}
                titleStyle={{
                  ...styles.themeButtonText,
                  color:
                    preference === 'system'
                      ? colors.primary
                      : colors['gray-700'],
                }}
              />
              <Button
                icon='sunny-outline'
                iconColor={
                  preference === 'light' ? colors.primary : colors['gray-700']
                }
                title='Light'
                onPress={() => handleThemeChange('light')}
                style={[
                  styles.themeButton,
                  // Use theme colors for styling
                  {
                    backgroundColor: colors.background,
                    borderColor: colors['gray-300'],
                  },
                  preference === 'light' && {
                    borderColor: colors.primary,
                    borderWidth: 1.5,
                  },
                ]}
                titleStyle={{
                  ...styles.themeButtonText,
                  color:
                    preference === 'light'
                      ? colors.primary
                      : colors['gray-700'],
                }}
              />
              <Button
                icon='moon-outline'
                iconColor={
                  preference === 'dark' ? colors.primary : colors['gray-700']
                }
                title='Dark'
                onPress={() => handleThemeChange('dark')}
                style={[
                  styles.themeButton,
                  // Use theme colors for styling
                  {
                    backgroundColor: colors.background,
                    borderColor: colors['gray-300'],
                  },
                  preference === 'dark' && {
                    borderColor: colors.primary,
                    borderWidth: 1.5,
                  },
                ]}
                titleStyle={{
                  ...styles.themeButtonText,
                  color:
                    preference === 'dark' ? colors.primary : colors['gray-700'],
                }}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TextButton
            style={[
              styles.actionButtonBase,
              // Use theme colors
              {
                backgroundColor: colors.background,
                borderColor: colors.red,
                borderWidth: 1,
              },
            ]}
            // Use theme colors
            titleStyle={{ color: colors.red }}
            title='Delete Account'
            onPress={() => alert('Delete Account (To be implemented)')}
          />
          <TextButton
            style={[
              styles.actionButtonBase,
              // Use theme colors
              { backgroundColor: colors.red },
            ]}
            // Use theme colors
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
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
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
  // New styles for theme toggling UI
  themeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 15,
    gap: 10,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  currentThemeText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 10,
  },
  // Reused section style for theme settings
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
