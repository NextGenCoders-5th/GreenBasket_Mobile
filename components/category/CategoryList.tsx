// components/category/CategoryList.tsx
import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Category } from '@/types/category';
import CategoryCard from './CategoryCard'; // Import the card component
import { useColorTheme } from '@/hooks/useColorTheme';
import LoadingIndicator from '../ui/LoadingIndicator';

interface CategoryListProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
  isLoading?: boolean; // To indicate loading state within the list
  error?: any; // To display error state within the list
}

export default function CategoryList({
  categories,
  onCategoryPress,
  isLoading,
  error,
}: CategoryListProps) {
  const colors = useColorTheme();

  // You can add simple inline loading or error display here if needed
  // Or let the parent handle full-screen loading/error
  if (isLoading && categories.length === 0) {
    return (
      //   <View style={[styles.centered, { minHeight: 150 }]}>
      //     {' '}
      //     {/* Min height to show spinner */}
      //     <ActivityIndicator size='small' color={colors.primary} />
      //     <Text style={[styles.loadingText, { color: colors['gray-600'] }]}>
      //       Loading categories...
      //     </Text>
      //   </View>
      <LoadingIndicator message='Loading categories...' />
    );
  }

  if (error && categories.length === 0) {
    // Display a simple error message if list is empty
    const errorMessage =
      (error as any)?.data?.message || 'Failed to load categories.';
    return (
      <View style={[styles.centered, { minHeight: 150 }]}>
        <Text style={[styles.errorText, { color: colors.red }]}>
          {errorMessage}
        </Text>
        {/* Consider adding a retry button if appropriate */}
      </View>
    );
  }

  // Use FlatList for better performance with long lists
  return (
    <FlatList
      data={categories}
      renderItem={({ item }) => (
        <CategoryCard category={item} onPress={onCategoryPress} />
      )}
      keyExtractor={(item) => item.id}
      horizontal={true} // Set to true for a horizontal list
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContentContainer}
      // Add ListEmptyComponent if you want specific text when list is truly empty after loading
      // ListEmptyComponent={() => <Text style={{ color: colors['gray-600'], textAlign: 'center' }}>No categories found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  listContentContainer: {
    paddingHorizontal: 10, // Padding around the list
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
