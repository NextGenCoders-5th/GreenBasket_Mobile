import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import {
  passwordUpdateSchema,
  PasswordUpdateFormData,
} from '@/utils/validators';
import { useUpdateUserPasswordMutation } from '@/redux/api/userApi';
import LabeledInput from '@/components/form/LabeledInput';

export default function UpdatePasswordScreen() {
  const colors = useColorTheme();

  const [updatePassword, { isLoading }] = useUpdateUserPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordUpdateFormData>({
    resolver: yupResolver(passwordUpdateSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit: SubmitHandler<PasswordUpdateFormData> = async (data) => {
    try {
      Toast.show({
        type: 'info',
        text1: 'Updating Password...',
      });

      // Call the mutation with the form data
      await updatePassword(data).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your password has been updated.',
      });

      reset(); // Clear the form on success
      // Optionally navigate back or to another screen
      // router.back();
    } catch (err: any) {
      console.error('Failed to update password:', err);
      const message = err?.data?.message || 'Could not update password.';
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: message,
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ title: 'Change Password' }} />
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name='oldPassword'
          render={({ field, fieldState: { error } }) => (
            <LabeledInput
              label='Current Password'
              placeholder='Enter current password'
              field={field}
              error={error}
              secureTextEntry // Mark as secure text entry
              icon='lock-outline' // Example icon
            />
          )}
        />
        <Controller
          control={control}
          name='password'
          render={({ field, fieldState: { error } }) => (
            <LabeledInput
              label='New Password'
              placeholder='Enter new password'
              field={field}
              error={error}
              secureTextEntry // Mark as secure text entry
              icon='lock-outline' // Example icon
            />
          )}
        />
        <Controller
          control={control}
          name='passwordConfirm'
          render={({ field, fieldState: { error } }) => (
            <LabeledInput
              label='Confirm New Password'
              placeholder='Confirm new password'
              field={field}
              error={error}
              secureTextEntry // Mark as secure text entry
              icon='lock-outline' // Example icon
            />
          )}
        />

        <Button
          title='Update Password'
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
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
});
