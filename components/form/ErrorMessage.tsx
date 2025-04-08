import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type ErrorMessageProp = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProp) {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5 }}
    >
      <MaterialIcons name='warning-amber' size={12} color='red' />
      <Text style={{ color: 'red', fontSize: 12, paddingLeft: 3 }}>
        {message}
      </Text>
    </View>
  );
}
