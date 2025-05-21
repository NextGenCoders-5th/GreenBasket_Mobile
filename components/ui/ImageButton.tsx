import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  ImageStyle,
} from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';

interface ImageButtonProps {
  imageUrl: string;
  onPress: () => void;
  label?: string;
  buttonStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  labelStyle?: TextStyle;
}

const ImageButton: React.FC<ImageButtonProps> = ({
  imageUrl,
  onPress,
  label,
  buttonStyle,
  imageStyle,
  labelStyle,
}) => {
  const colors = useColorTheme();
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, imageStyle && (imageStyle as any)]}
      />

      {label && (
        <Text
          style={[{ ...styles.label, color: colors['gray-500'] }, labelStyle]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 40,
    marginVertical: 10,
    gap: 4,
  },
  label: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
});

export default ImageButton;
