// app/(profile)/complete-onboarding.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform, // For platform-specific styling if needed
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { yupResolver } from '@hookform/resolvers/yup';

import { useColorTheme } from '@/hooks/useColorTheme';
import FloatingLabelInput from '@/components/form/FloatingLableInput'; // Corrected path
import Button from '@/components/ui/Button'; // Using a more generic Button for submit
import ErrorMessage from '@/components/ui/ErrorMessage';
import ImagePickerButton, {
  PickedImage,
} from '@/components/form/ImagePickerButton';
import DatePickerButton from '@/components/form/DatePickerButton';
import GenderPicker from '@/components/form/GenderPicker';
import { shadows } from '@/styles/shadows'; // Assuming you have this for consistent styling

import { OnboardingSchema } from '@/utils/validators';
import { CompleteOnboardingDto } from '@/types/user';
import { useCompleteOnboardingMutation } from '@/redux/api/userApi';
import { useAuth } from '@/hooks/useAuth'; // To prefill data if available
import { Gender } from '@/config/enums';

export default function CompleteOnboardingScreen() {
  const colors = useColorTheme();
  const { user } = useAuth(); // Get current user to prefill data

  const [completeOnboarding, { isLoading: isOnboardingLoading }] =
    useCompleteOnboardingMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CompleteOnboardingDto>({
    resolver: yupResolver(OnboardingSchema),
    mode: 'onTouched', // Validate on blur
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      date_of_birth: user?.date_of_birth || '',
      gender: Gender.MALE,
      profile_picture: undefined,
      idPhoto_front: undefined,
      idPhoto_back: undefined,
    },
  });

  // Watch image URI fields to update previews in ImagePickerButton
  const profilePictureValue = watch('profile_picture');
  const idPhotoFrontValue = watch('idPhoto_front');
  const idPhotoBackValue = watch('idPhoto_back');
  const dobIsoString = watch('date_of_birth');

  const handleImagePick = (
    field: keyof Pick<
      CompleteOnboardingDto,
      'profile_picture' | 'idPhoto_front' | 'idPhoto_back'
    >,
    pickedImage: PickedImage | null
  ) => {
    // If user cancels, pickedImage will be null.
    // We set to 'undefined' so Yup's .required() catches it if not picked.
    setValue(field, pickedImage!, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (data: CompleteOnboardingDto) => {
    // The Yup schema (OnboardingSchema) should ensure all required fields,
    // including images (as PickedImage objects), are present.
    console.log('Submitting Onboarding Data:', data);

    try {
      const result = await completeOnboarding(data).unwrap();
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Profile Updated!',
        text2: result.data.message || 'Your onboarding is complete.',
        // ... (your toast styles)
      });
      // The useCompleteOnboardingMutation should invalidate 'User'/'ME' tag,
      // which will cause useGetCurrentUserQuery to refetch, updating user.is_onboarding.
      router.replace('/(tabs)/account'); // Navigate to account or home
    } catch (err: any) {
      console.error('Onboarding submission failed:', err);
      const message =
        err?.data?.message ||
        'Failed to complete onboarding. Please try again.';
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Onboarding Error',
        text2: message,
        // ... (your toast styles)
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors['primary-50'] }}>
      <Stack.Screen options={{ title: 'Complete Your Profile' }} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled' // Good for forms
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* You can add a logo or header image here if desired */}
          {/* <Image source={require('@/assets/images/react-logo.png')} style={styles.logo} /> */}

          <View
            style={[
              styles.formContainer,
              {
                borderColor: colors['gray-300'],
                backgroundColor: colors.background,
              },
            ]}
          >
            <Text style={[styles.formTitle, { color: colors['gray-800'] }]}>
              Complete your profile
            </Text>
            <Text style={[styles.formSubtitle, { color: colors['gray-600'] }]}>
              Provide a few more details to complete your profile.
            </Text>

            <View style={styles.inputGroup}>
              <FloatingLabelInput
                control={control}
                name='first_name'
                label='First Name'
                placeholder='Enter your first name'
                icon='person-outline' // Ionicons
              />
            </View>

            <View style={styles.inputGroup}>
              <FloatingLabelInput
                control={control}
                name='last_name'
                label='Last Name'
                placeholder='Enter your last name'
                icon='person-outline' // Ionicons
              />
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name='date_of_birth'
                render={(
                  { field: { onChange, value } } // value here is the ISO string
                ) => (
                  <DatePickerButton
                    label='Date of Birth'
                    currentIsoDateString={value} // Pass the ISO string
                    onDatePicked={(isoDateStr) => onChange(isoDateStr)} // onChange receives ISO string
                  />
                )}
              />
              {errors.date_of_birth && (
                <ErrorMessage message={errors.date_of_birth.message!} />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name='gender'
                render={({ field: { onChange, value } }) => (
                  <GenderPicker
                    label='Gender'
                    selectedGender={value as Gender}
                    onGenderSelect={(genderValue) => onChange(genderValue)}
                  />
                )}
              />
              {errors.gender && (
                <ErrorMessage message={errors.gender.message!} />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name='profile_picture'
                render={(
                  { field } // field.value will be PickedImage | undefined
                ) => (
                  <ImagePickerButton
                    label='Profile Picture'
                    currentImageUri={field.value?.uri}
                    onImagePicked={(pickedImg) =>
                      handleImagePick('profile_picture', pickedImg)
                    }
                    aspectRatio={[1, 1]} // Square for profile pics
                  />
                )}
              />
              {errors.profile_picture && (
                <ErrorMessage
                  message={
                    (errors.profile_picture as any)?.message ||
                    (errors.profile_picture as any)?.uri?.message
                  }
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name='idPhoto_front'
                render={({ field }) => (
                  <ImagePickerButton
                    label='ID Photo (Front)'
                    currentImageUri={field.value?.uri}
                    onImagePicked={(pickedImg) =>
                      handleImagePick('idPhoto_front', pickedImg)
                    }
                  />
                )}
              />
              {errors.idPhoto_front && (
                <ErrorMessage
                  message={
                    (errors.idPhoto_front as any)?.message ||
                    (errors.idPhoto_front as any)?.uri?.message
                  }
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name='idPhoto_back'
                render={({ field }) => (
                  <ImagePickerButton
                    label='ID Photo (Back)'
                    currentImageUri={field.value?.uri}
                    onImagePicked={(pickedImg) =>
                      handleImagePick('idPhoto_back', pickedImg)
                    }
                  />
                )}
              />
              {errors.idPhoto_back && (
                <ErrorMessage
                  message={
                    (errors.idPhoto_back as any)?.message ||
                    (errors.idPhoto_back as any)?.uri?.message
                  }
                />
              )}
            </View>

            <Button
              title={
                isOnboardingLoading
                  ? 'Submitting...'
                  : 'Complete Profile & Continue'
              }
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
              // titleStyle={{ color: colors.white }} // Assuming Button component handles this
              disabled={!isValid || isOnboardingLoading} // Disable if form isn't valid or submitting
              isLoading={isOnboardingLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures content can scroll if it overflows
    justifyContent: 'center', // Center content if it's less than screen height
  },
  container: {
    flex: 1, // Takes available space from ScrollView
    alignItems: 'center',
    padding: 20,
    // Removed gap here, manage spacing with margins on elements
  },
  logo: {
    // Optional logo style
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 500, // Max width for larger screens if applicable
    // borderWidth: 1,
    borderRadius: 12, // Slightly more rounded
    padding: 20, // More padding inside the form box
    // boxShadow: shadows['shadow-1'], // Apply shadow if defined
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 22, // Slightly smaller than SignIn
    fontFamily: 'Inter-Bold', // Use bold variant
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 5, // Space below each input group (FloatingLabelInput has its own internal gap for error)
  },
  submitButton: {
    width: '100%',
    marginTop: 20, // Space above the button
    paddingVertical: 14, // Make button taller
  },
});
