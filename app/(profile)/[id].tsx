import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';
import ImageButton from '@/components/ui/ImageButton';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/slices/authSlice';
import ProfileButton from '@/components/profile/ProfileButton';

export default function Profile() {
  const colors = useColorTheme();

  const user = useSelector(selectCurrentUser);
  const {
    id,
    first_name,
    last_name,
    email,
    phone_number,
    profile_picture: profileUrl,
  } = user!;

  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          marginVertical: 15,
        }}
      >
        <ImageButton
          imageUrl={profileUrl!}
          onPress={() => {
            alert('update photo');
          }}
          imageStyle={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        />
      </View>

      <ProfileButton
        label='Name'
        onPress={() => {}}
        value={`${first_name} ${last_name}`}
      />

      {/* 
      <ProfileButton 
      label='Gender' 
      onPress={() => {}} 
      value='Male'
       />
      <ProfileButton
        label='Date of Birth'
        onPress={() => {}}
        value='jan 12, 1990'
      /> */}

      <Text
        style={{
          fontSize: 24,
          fontFamily: 'Inter',
          fontWeight: '700',
          marginBottom: 20,
        }}
      >
        Account Details
      </Text>

      <ProfileButton
        style={{ borderBottomWidth: 1, borderBottomColor: colors['gray-100'] }}
        label='Member ID'
        onPress={() => {}}
        value={`${id}`}
      />
      <ProfileButton
        style={{ borderBottomWidth: 1, borderBottomColor: colors['gray-100'] }}
        label='Email Address'
        onPress={() => {}}
        value={`${email}`}
      />

      <ProfileButton
        style={{ borderBottomWidth: 1, borderBottomColor: colors['gray-100'] }}
        label='Mobile number'
        onPress={() => {}}
        value={`${phone_number}`}
      />

      <ProfileButton
        style={{ borderBottomWidth: 1, borderBottomColor: colors['gray-100'] }}
        label='Password'
        onPress={() => {}}
        value={`*******************`}
      />
    </View>
  );
}
