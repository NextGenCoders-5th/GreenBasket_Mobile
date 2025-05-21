import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';
import ImageButton from '@/components/ui/ImageButton';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import ProfileButton from '@/components/profile/ProfileButton';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

export default function UserProfileScreen() {
  const colors = useColorTheme();
  const { id: routeId } = useLocalSearchParams<{ id: string }>();

  const loggedInUser = useSelector(selectCurrentUser);
  const user = loggedInUser;

  if (!user) {
    return <LoadingIndicator message='User not found or not logged in.' />;
  }

  const {
    id,
    first_name,
    last_name,
    email,
    phone_number,
    profile_picture,
    gender,
    date_of_birth,
  } = user;

  const profileImageUrl = useTransformImageUrl({ imageUrl: profile_picture });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: `Your Profile` }} />
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <ImageButton
            imageUrl={profileImageUrl!}
            onPress={() => {
              router.navigate('/(profile)/update-profile');
              // alert('Update profile photo (To be implemented)');
            }}
            imageStyle={styles.profileImage}
          />
          <Text style={[styles.fullName, { color: colors['gray-900'] }]}>
            {first_name || ''} {last_name || ''}
          </Text>
          <Text style={[styles.email, { color: colors['gray-600'] }]}>
            {email}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-700'] }]}>
            Personal Information
          </Text>
          <ProfileButton
            label='Full Name'
            value={`${first_name || ''} ${last_name || ''}`}
            onPress={() => router.navigate('/(profile)/edit-name')}
          />
          <ProfileButton
            label='Date of Birth'
            value={
              date_of_birth
                ? new Date(date_of_birth).toLocaleDateString()
                : 'Not set'
            } // Format date
            onPress={() => router.navigate('/(profile)/edit-dob')}
          />
          <ProfileButton
            label='Gender'
            value={gender || 'Not set'}
            onPress={() => router.navigate('/(profile)/edit-gender')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-700'] }]}>
            Account Details
          </Text>
          <ProfileButton label='Member ID' value={id} onPress={() => {}} />
          <ProfileButton
            label='Email Address'
            value={email}
            onPress={() => router.navigate('/(profile)/edit-email')}
          />
          <ProfileButton
            label='Mobile Number'
            value={phone_number}
            onPress={() => router.navigate('/(profile)/edit-phone')}
          />
          <ProfileButton
            label='Password'
            value='*************'
            onPress={() => router.navigate('/(profile)/change-password')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20, // Consistent padding
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100, // Larger profile image
    height: 100,
    borderRadius: 50,
  },
  fullName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    fontWeight: '600',
    marginTop: 12,
  },
  email: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ProfileButton component will have its own internal styles
});
