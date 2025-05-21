import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';

export interface PickedImage {
  uri: string;
  type?: string;
  name?: string;
}

interface ImagePickerButtonProps {
  onImagePicked: (pickedImage: PickedImage | null) => void;
  label: string;
  currentImageUri?: string | null;
  aspectRatio?: [number, number];
}

const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  onImagePicked,
  label,
  currentImageUri,
  aspectRatio = [4, 3],
}) => {
  const colors = useColorTheme();
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImage = async () => {
    if (!status?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        alert('Permission to access the photo library is required.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      onImagePicked({
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name:
          asset.fileName || `photo_${Date.now()}.${asset.uri.split('.').pop()}`,
      });
    } else {
      // Optionally clear if canceled, or do nothing to keep existing
      // onImagePicked(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.labelStyle, { color: colors['gray-700'] }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderColor: colors['gray-300'],
            backgroundColor: colors['gray-50'],
          },
        ]}
        onPress={pickImage}
      >
        {currentImageUri ? (
          <Image
            source={{ uri: currentImageUri }}
            style={styles.imagePreview}
            resizeMode='contain'
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name='camera-outline'
              size={30}
              color={colors['gray-500']}
            />
            <Text
              style={[styles.placeholderText, { color: colors['gray-500'] }]}
            >
              Select Image
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {/* Display the selected image URI below the button if needed for confirmation,
          but the main preview is inside the button. This is optional. */}
      {/* {currentImageUri && (
        <Text style={{fontSize: 10, color: colors['gray-500'], marginTop: 5}} numberOfLines={1}>
          Selected: {currentImageUri.split('/').pop()}
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20, // Increased margin
  },
  labelStyle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  button: {
    height: 150, // Increased height for better preview
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed', // Dashed border for picker
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
});

export default ImagePickerButton;
