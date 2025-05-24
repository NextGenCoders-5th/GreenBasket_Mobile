// app/(profile)/update-user.tsx
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Stack, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import LabeledInput from '@/components/form/LabeledInput'; // Import LabeledInput
import DatePickerButton from '@/components/form/DatePickerButton'; // Import DatePickerButton
import GenderPicker from '@/components/form/GenderPicker'; // Import GenderPicker
import {
  updateUserDataSchema,
  UpdateUserDataFormData,
} from '@/utils/validators'; // Import schema and type
import { useUpdateCurrentUserDataMutation } from '@/redux/api/userApi'; // Import the mutation hook
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Import useCurrentUser
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import { Gender } from '@/config/enums'; // Import Gender enum

export default function UpdateUserDataScreen() {
  const colors = useColorTheme();

  // Use useCurrentUser to get the currently logged-in user data
  const {
    user,
    isLoading: isUserLoading,
    error: userError,
    refetchCurrentUser,
  } = useCurrentUser();

  // Mutation hook for updating user data
  const [updateUserData, { isLoading: isUpdatingData }] =
    useUpdateCurrentUserDataMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, // Add reset function to pre-populate form
  } = useForm<UpdateUserDataFormData>({
    resolver: yupResolver(updateUserDataSchema),
    // Set default values from the fetched user data
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phoneNumber: user?.phone_number || '',
      date_of_birth: user?.date_of_birth || '', // Use the ISO string or null
      gender: (user?.gender as Gender) || Gender.MALE, // Cast and handle null
    },
    // Revalidate the form whenever the user data changes (e.g., after refetch)
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Reset the form with user data when it's loaded or changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        gender: (user.gender as Gender) || Gender.MALE,
      });
    }
  }, [user, reset]); // Depend on user object and reset function

  const onSubmit: SubmitHandler<UpdateUserDataFormData> = async (data) => {
    try {
      Toast.show({
        type: 'info',
        text1: 'Updating Profile...',
      });

      // Call the mutation with the form data
      await updateUserData(data).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your profile has been updated.',
      });
      router.back(); // Navigate back after successful update

      // No need to manually reset the form here as the user data refetch
      // will cause the useEffect above to reset the form with new data.
      // Optionally navigate back
      // router.back();
    } catch (err: any) {
      console.error('Failed to update user data:', err);
      const message = err?.data?.message || 'Could not update profile.';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: message,
      });
    }
  };

  // Handle initial user loading state
  if (isUserLoading) {
    return <LoadingIndicator message='Loading user data...' />;
  }

  // Handle user data error state
  if (userError) {
    const errorMessage =
      (userError as any)?.data?.message ||
      'Failed to load user data. Check your connection.';
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <LoadingError message={errorMessage} onRetry={refetchCurrentUser} />
      </View>
    );
  }

  // If user is null after loading/error (should be rare with AuthStateGate)
  if (!user) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.noDataText, { color: colors['gray-700'] }]}>
          User data not available.
        </Text>
        <Button
          title='Retry Loading User'
          onPress={refetchCurrentUser}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ title: 'Update Profile' }} />
      <View style={styles.formContainer}>
        {/* First Name Input */}
        <Controller
          control={control}
          name='firstName'
          render={({ field, fieldState: { error } }) => (
            <LabeledInput
              label='First Name'
              placeholder='Enter first name'
              field={field}
              error={error}
              keyboardType='default'
              autoCapitalize='words'
              icon='account-outline'
            />
          )}
        />
        {/* Last Name Input */}
        <Controller
          control={control}
          name='lastName'
          render={({ field, fieldState: { error } }) => (
            <LabeledInput
              label='Last Name'
              placeholder='Enter last name'
              field={field}
              error={error}
              keyboardType='default'
              autoCapitalize='words'
              icon='account-outline'
            />
          )}
        />
        {/* Email Input */}
        <Controller
          control={control}
          name='email'
          render={({ field, fieldState: { error } }) => (
            <LabeledInput
              label='Email'
              placeholder='Enter email'
              field={field}
              error={error}
              keyboardType='email-address'
              autoCapitalize='none'
              icon='email-outline'
            />
          )}
        />
        {/* Phone Number Input */}
        <Controller
          control={control}
          name='phoneNumber'
          render={({ field, fieldState: { error } }) => (
            <LabeledInput
              label='Phone Number'
              placeholder='e.g., +251912345678'
              field={field}
              error={error}
              keyboardType='phone-pad'
              icon='phone-outline'
            />
          )}
        />
        {/* Date of Birth Picker */}
        <Controller
          control={control}
          name='date_of_birth'
          render={({ field, fieldState: { error } }) => (
            <DatePickerButton
              label='Date of Birth'
              onDatePicked={field.onChange} // DatePickerButton sends ISO string
              currentIsoDateString={field.value} // Pass current ISO string value
              // Optional: Add error display if your DatePickerButton supports it
              // error={error}
            />
          )}
        />
        {/* Gender Picker */}
        <Controller
          control={control}
          name='gender'
          render={({ field, fieldState: { error } }) => (
            <GenderPicker
              label='Gender'
              onGenderSelect={field.onChange} // GenderPicker sends 'male' or 'female'
              selectedGender={field.value || undefined} // Pass current value (nullable)
              // Optional: Add error display if your GenderPicker supports it
              // error={error}
            />
          )}
        />

        <Button
          title='Update Profile'
          onPress={handleSubmit(onSubmit)}
          isLoading={isUpdatingData}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  formContainer: {
    gap: 15,
    paddingBottom: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  centered: {
    // Style for centered loading/error/no data
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    // Style for no data message
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
