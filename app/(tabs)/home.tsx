// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorTheme } from '@/hooks/useColorTheme';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import CategoryList from '@/components/category/CategoryList'; // Import the category list component
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi'; // Import the query hook
import { Category } from '@/types/category'; // Import Category type

export default function HomeScreen() {
  const colors = useColorTheme();

  // Fetch all categories
  const {
    data: categoriesResponse,
    error: categoriesError,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
    refetch: refetchCategories,
  } = useGetAllCategoriesQuery(); // No args needed for getAllCategories

  const categories = categoriesResponse?.data?.data || []; // Get the array of categories

  // Handle the press on a category card
  const handleCategoryPress = (category: Category) => {
    console.log('Category pressed:', category.name);
    // Navigate to a category-specific product list screen, passing the category ID
    // You'll need a route like /(product)/category/[categoryId].tsx
    router.push(`/(product)/category/${category.id}`);
  };

  // Primary loading state for the entire screen
  // If categories are loading initially and we have no data yet
  if (isCategoriesLoading && !isCategoriesFetching && categories.length === 0) {
    return <LoadingIndicator message='Loading home data...' />;
  }

  // Primary error state for the entire screen
  if (categoriesError && categories.length === 0) {
    const errorMessage =
      (categoriesError as any)?.data?.message || 'Failed to load categories.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingError message={errorMessage} onRetry={refetchCategories} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: 'Home' }} />
      <ScrollView style={styles.scrollView}>
        {/* Hero Section or Banners */}
        <View
          style={[
            styles.heroSection,
            { backgroundColor: colors['primary-100'] },
          ]}
        >
          {/* Add your hero content here */}
          <Text style={[styles.heroTitle, { color: colors['primary-800'] }]}>
            Welcome!
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors['primary-700'] }]}>
            Find the best products for you.
          </Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Shop by Category
          </Text>
          {/* Use the CategoryList component */}
          {/* Pass the actual loading/error state to the list component for inline feedback */}
          <CategoryList
            categories={categories}
            onCategoryPress={handleCategoryPress}
            isLoading={isCategoriesLoading || isCategoriesFetching} // Pass loading state
            error={categoriesError} // Pass error state
          />
        </View>

        {/* Recommended Products Section (Example) */}
        {/* You would likely fetch and display other product lists here */}
        {/* <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>Recommended for You</Text>
            </View> */}

        {/* Other Sections */}
        {/* ... */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    // For full screen loading/error
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
    paddingHorizontal: 15, // Add padding to align with list if list has inner padding
  },
});
