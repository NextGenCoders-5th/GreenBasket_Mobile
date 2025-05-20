// components/ui/ErrorMessage.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme'; // Assuming you have this

interface LoadingErrorProps {
  message: string;
  onRetry?: () => void;
  style?: object;
  textStyle?: object;
  iconSize?: number;
  retryText?: string;
}

const LoadingError: React.FC<LoadingErrorProps> = ({
  message,
  onRetry,
  style,
  textStyle,
  iconSize = 24,
  retryText = 'Try Again',
}) => {
  const colors = useColorTheme();

  return (
    <View
      style={[
        styles.container,
        style,
        { borderColor: colors.red, backgroundColor: colors['primary-50'] },
      ]}
    >
      <Ionicons
        name='alert-circle-outline'
        size={iconSize}
        color={colors.red}
        style={styles.icon}
      />
      <Text style={[styles.messageText, { color: colors.red }, textStyle]}>
        {message || 'An unexpected error occurred.'}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.red }]}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Ionicons
            name='refresh-outline'
            size={16}
            color={colors.white}
            style={styles.retryIcon}
          />
          <Text style={[styles.retryButtonText, { color: colors.white }]}>
            {retryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20, // Give some horizontal margin if used full-width
  },
  icon: {
    marginBottom: 8,
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-Regular', // Assuming you have this font
    marginBottom: 15,
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium', // Assuming you have this font
    fontWeight: '500',
  },
});

export default LoadingError;
