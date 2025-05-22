// components/address/AddressForm.tsx
import React from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useColorTheme } from '@/hooks/useColorTheme';
import LabeledInput from '@/components/form/LabeledInput'; // Import the new LabeledInput
import Button from '@/components/ui/Button';
import { AddressFormData, AddressSchema } from '@/utils/validators'; // Correct schema import path

interface AddressFormProps {
  initialValues?: AddressFormData;
  onSubmit: SubmitHandler<AddressFormData>;
  isLoading?: boolean;
  submitButtonText?: string;
}

export default function AddressForm({
  initialValues,
  onSubmit,
  isLoading,
  submitButtonText = 'Save Address',
}: AddressFormProps) {
  const colors = useColorTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(AddressSchema),
    defaultValues: initialValues || {
      country: '',
      city: '',
      sub_city: '',
      street: '',
      zip_code: '',
      latitude: undefined,
      longitude: undefined,
    },
  });

  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name='country'
        render={({ field, fieldState: { error } }) => (
          <LabeledInput // Use LabeledInput
            label='Country'
            placeholder='e.g. Ethiopia'
            icon='flag-outline' // Example icon
            field={field}
            error={error}
            keyboardType='default'
            autoCapitalize='words'
          />
        )}
      />
      <Controller
        control={control}
        name='city'
        render={({ field, fieldState: { error } }) => (
          <LabeledInput // Use LabeledInput
            label='City'
            placeholder='e.g. Addis Ababa'
            icon='city' // Example icon
            field={field}
            error={error}
            keyboardType='default'
            autoCapitalize='words'
          />
        )}
      />
      <Controller
        control={control}
        name='sub_city'
        render={({ field, fieldState: { error } }) => (
          <LabeledInput // Use LabeledInput
            label='Sub City'
            placeholder='e.g. Bole'
            icon='domain' // Example icon
            field={field}
            error={error}
            keyboardType='default'
            autoCapitalize='words'
          />
        )}
      />
      <Controller
        control={control}
        name='street'
        render={({ field, fieldState: { error } }) => (
          <LabeledInput // Use LabeledInput
            label='Street Address'
            placeholder='e.g. Bole Road'
            icon='map-marker-outline' // Example icon
            field={field}
            error={error}
            keyboardType='default'
            autoCapitalize='words'
          />
        )}
      />
      <Controller
        control={control}
        name='zip_code'
        render={({ field, fieldState: { error } }) => (
          <LabeledInput // Use LabeledInput
            label='Zip Code'
            placeholder='e.g. 1000'
            icon='zip-box-outline' // Example icon
            field={field}
            error={error}
            keyboardType='number-pad'
          />
        )}
      />

      {/* Add a switch for is_default */}
      {/* <Controller
        control={control}
        name='is_default'
        render={({ field: { onChange, value } }) => (
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: colors['gray-700'] }]}>
              Set as Default Address
            </Text>
            <Switch
              onValueChange={onChange}
              value={!!value}
              trackColor={{ false: colors['gray-300'], true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        )}
      /> */}

      <Button
        title={submitButtonText}
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 15,
    paddingBottom: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
