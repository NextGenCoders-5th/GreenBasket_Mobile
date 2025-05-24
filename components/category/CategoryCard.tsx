// components/category/CategoryCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Category } from '@/types/category'; // Import Category type
import { useColorTheme } from '@/hooks/useColorTheme';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl'; // Assuming you have this hook

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void; // Pass the category to the handler
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const colors = useColorTheme();
  const imageUrl = useTransformImageUrl({ imageUrl: category.image_url });

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors['gray-200'] },
      ]}
      onPress={() => onPress?.(category)} // Call onPress with the category
      disabled={!onPress}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.categoryImage}
          resizeMode='cover' // or 'contain' depending on desired look
        />
      ) : (
        // Placeholder if no image
        <View
          style={[
            styles.categoryImagePlaceholder,
            { backgroundColor: colors['gray-100'] },
          ]}
        >
          <Text style={[styles.placeholderText, { color: colors['gray-500'] }]}>
            No Image
          </Text>
        </View>
      )}
      <Text
        style={[styles.categoryName, { color: colors['gray-900'] }]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden', // Ensures image respects border radius
    alignItems: 'center', // Center content horizontally
    width: 100, // Fixed width for grid layout example
    marginRight: 10, // Space between cards in a horizontal list
    marginBottom: 10, // Space below cards in a grid layout
    paddingBottom: 10, // Padding below the name
  },
  categoryImage: {
    width: '100%', // Image takes full width of card
    height: 80, // Fixed height for the image
    marginBottom: 8, // Space between image and text
  },
  categoryImagePlaceholder: {
    width: '100%',
    height: 80,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center', // Center the text
    paddingHorizontal: 5, // Add slight horizontal padding
  },
});
