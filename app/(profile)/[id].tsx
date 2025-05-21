import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

import { selectCurrentUser } from '@/redux/slices/authSlice';
import ProfileButton from '@/components/profile/ProfileButton';
import { useColorTheme } from '@/hooks/useColorTheme';
import ImageButton from '@/components/ui/ImageButton';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import {
  useUpdateProfilePictureMutation,
  useGetCurrentUserQuery,
} from '@/redux/api/userApi';
import { PickedImage } from '@/components/form/ImagePickerButton';

export default function UserProfileScreen() {
  const colors = useColorTheme();
  const { id: routeId } = useLocalSearchParams<{ id: string }>();

  // Add state to force image refresh
  const [imageKey, setImageKey] = useState(Date.now());

  // Use the query to get the most up-to-date user data
  const {
    data: userData,
    refetch: refetchUser,
    isLoading: isLoadingUser,
  } = useGetCurrentUserQuery();

  // Fallback to Redux store if query hasn't loaded yet
  const loggedInUser = useSelector(selectCurrentUser);
  const user = userData?.data?.data || loggedInUser;

  const [updateProfilePicture, { isLoading: isUpdatingPicture }] =
    useUpdateProfilePictureMutation();

  // Effect to refresh the image when the profile picture changes
  useEffect(() => {
    if (user?.profile_picture) {
      setImageKey(Date.now());
    }
  }, [user?.profile_picture]);

  if (isLoadingUser || !user) {
    return <LoadingIndicator message='Loading user data...' />;
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

  // Add cache-busting parameter to prevent image caching
  const currentProfileImageUrl = useTransformImageUrl({
    imageUrl: profile_picture ? `${profile_picture}?t=${imageKey}` : undefined,
  });

  const handleUpdateProfilePicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'You need to grant permission to access the photo library.'
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square for profile pictures
      quality: 0.7,
    });

    console.log('Picker result:', pickerResult);

    if (
      pickerResult.canceled ||
      !pickerResult.assets ||
      pickerResult.assets.length === 0
    ) {
      return; // User cancelled or no asset selected
    }

    const selectedAsset = pickerResult.assets[0];
    const pickedImage: PickedImage = {
      uri: selectedAsset.uri,
      type: selectedAsset.mimeType || 'image/jpeg',
      name:
        selectedAsset.fileName ||
        `profile_${id}.${selectedAsset.uri.split('.').pop()}`,
    };

    console.log('Prepared image data:', pickedImage);

    try {
      Toast.show({
        type: 'info',
        text1: 'Uploading...',
        text2: 'Updating profile picture.',
      });

      // Call the mutation with the correct field name (profile_picture)
      const result = await updateProfilePicture({
        profile_picture: pickedImage,
      }).unwrap();

      console.log('Profile update result:', result);

      // Force a refetch of the current user data to get the latest profile picture
      await refetchUser();

      // Force image refresh by updating the key
      setImageKey(Date.now());

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Profile picture updated.',
      });
    } catch (err: any) {
      console.error('Failed to update profile picture:', err);
      const message = err?.data?.message || 'Could not update profile picture.';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: message,
      });
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: `Your Profile` }} />
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <ImageButton
            imageUrl={currentProfileImageUrl || undefined}
            onPress={handleUpdateProfilePicture}
            imageStyle={styles.profileImage}
            isLoading={isUpdatingPicture}
            // Add a key prop to force re-render when the image changes
            key={`profile-image-${imageKey}`}
          />

          {first_name && last_name && (
            <Text style={[styles.fullName, { color: colors['gray-900'] }]}>
              {first_name} {last_name}
            </Text>
          )}
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
            value={`${first_name || 'Not set'} ${last_name || ''}`}
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
});
