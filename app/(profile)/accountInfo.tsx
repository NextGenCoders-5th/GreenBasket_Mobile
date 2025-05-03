import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useColorTheme } from '@/hooks/useColorTheme';

export default function AccountInfo() {
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
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors['gray-100'],
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Member ID
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '300',
            color: colors.text,
          }}
        >
          e45972345sdioa
        </Text>
      </View>
      <Pressable
        onPress={() => {
          alert('Edit Email');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors['gray-100'],
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Email Address
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
          alert('Edit Mobile Number');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors['gray-100'],
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Mobile Number
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '300',
            color: colors.text,
          }}
        >
          +251 911 234 567
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          alert('Edit Password');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 15,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors['gray-100'],
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Password
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: '300',
            color: colors.text,
          }}
        >
          ********
        </Text>
      </Pressable>
    </View>
  );
}
