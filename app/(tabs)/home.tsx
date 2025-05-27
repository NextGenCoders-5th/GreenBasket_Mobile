// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native'; // Removed Dimensions
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorTheme } from '@/hooks/useColorTheme';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import CategoryList from '@/components/category/CategoryList';
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi';
import { Category } from '@/types/category';
// Import the new BannerSlider component and Slide type
import BannerSlider, { Slide } from '@/components/home/BannerSlider';

// Data for the slider slides (defined here, passed to the component)
const motivationalSlides: Slide[] = [
  {
    id: 'slide1',
    backgroundColor: '#a0e0a0',
    title: 'Welcome Back!',
    subtitle: 'Find your favorite products with ease.',
    textColor: '#306030',
  },
  {
    id: 'slide2',
    backgroundColor: '#b0c4de',
    title: 'Shop Smart, Shop Local',
    subtitle: 'Support local vendors and find unique items.',
    textColor: '#304080',
  },
  {
    id: 'slide3',
    backgroundColor: '#f0e68c',
    title: 'New Arrivals',
    subtitle: 'Explore the latest products added to our store!',
    textColor: '#807020',
  },
  {
    id: 'slide4',
    backgroundColor: '#e6e6fa',
    title: 'Great Deals Await',
    subtitle: "Don't miss out on our special offers!",
    textColor: '#503080',
  },
];

export default function HomeScreen() {
  const colors = useColorTheme();

  // Fetch all categories
  const {
    data: categoriesResponse,
    error: categoriesError,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
    refetch: refetchCategories,
  } = useGetAllCategoriesQuery();

  const categories = categoriesResponse?.data?.data || [];

  // Handle the press on a category card
  const handleCategoryPress = (category: Category) => {
    console.log('Category pressed:', category.name);
    router.push(`/(product)/category/${category.id}`);
  };

  // Primary loading state for categories
  if (isCategoriesLoading && !isCategoriesFetching && categories.length === 0) {
    return <LoadingIndicator message='Loading categories...' />;
  }

  // Primary error state for categories
  if (categoriesError && categories.length === 0) {
    const errorMessage =
      (categoriesError as any)?.data?.message ||
      'Failed to load categories. Check your connection.';
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
        {/* Banner Slider Section - Use the new component */}
        <BannerSlider slides={motivationalSlides} height={150} />
        {/* Pass the data and optional height */}
        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Shop by Category
          </Text>

          <CategoryList
            categories={categories}
            onCategoryPress={handleCategoryPress}
            isLoading={isCategoriesLoading || isCategoriesFetching}
            error={categoriesError}
          />
        </View>
        {/* ... other sections ... */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  // --- Swiper Styles (These are now in BannerSlider.tsx) ---
  // Remove swiperContainer, wrapper, slide, slideTitle, slideSubtitle, paginationStyle from here
  // Unless you have specific styles that need to apply to the Swiper itself from the parent

  // --- Existing Styles ---
  heroSection: {
    // Kept if you still need this for something else, or remove
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
    paddingHorizontal: 15,
  },
});
