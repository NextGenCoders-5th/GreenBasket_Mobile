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

export default function Profile() {
  const colors = useColorTheme();
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
          imageUrl={require('@/assets/images/profile-2.png')}
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

      <Pressable
        onPress={() => {
          alert('Edit Profile');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          paddingVertical: 5,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Name
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '300',
            color: colors.text,
          }}
        >
          John Doe
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          router.navigate('/(profile)/accountInfo');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Account details
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '300',
            color: colors.text,
          }}
        >
          johndoe@gmail.com
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          alert('Update Gender');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Gender
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '300',
            color: colors.text,
          }}
        >
          Male
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          alert('Update Date of Birth');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Date of Birth
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '300',
            color: colors.text,
          }}
        >
          Jan 12, 1990
        </Text>
      </Pressable>
    </View>
  );
}
