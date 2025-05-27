import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native'; // Import FlatList, ActivityIndicator
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorTheme } from '@/hooks/useColorTheme';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import CategoryList from '@/components/category/CategoryList';
import { useGetProductsQuery } from '@/redux/api/productApi'; // Import useGetProductsQuery
import { useGetAllCategoriesQuery } from '@/redux/api/categoryApi'; // Import useGetAllCategoriesQuery
import { Category, Product } from '@/types/product'; // Import Product type
import BannerSlider, { Slide } from '@/components/home/BannerSlider';
import ProductWithVendorCard from '@/components/product/ProductWithVendorCard'; // Import ProductWithVendorCard
import { useDispatch } from 'react-redux';
import { clearCredentials } from '@/redux/slices/authSlice';
import { apiSlice } from '@/redux/api/apiSlice';

// Data for the slider slides
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

const RECENT_PRODUCTS_LIMIT = 10;

export default function HomeScreen() {
  const colors = useColorTheme();
  const dispatch = useDispatch();

  // useEffec/

  // --- Fetch Categories ---
  const {
    data: categoriesResponse,
    error: categoriesError,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
    refetch: refetchCategories,
  } = useGetAllCategoriesQuery();

  const categories = categoriesResponse?.data?.data || [];

  // --- Fetch Recently Added Products ---
  // Use a separate query instance with parameters for recent products
  const {
    data: recentProductsResponse,
    error: recentProductsError,
    isLoading: isRecentProductsLoading,
    isFetching: isRecentProductsFetching,
    refetch: refetchRecentProducts,
  } = useGetProductsQuery({
    limit: RECENT_PRODUCTS_LIMIT,
    sortBy: 'createdAt',
  });

  // Ensure products array is extracted correctly
  const recentProducts = recentProductsResponse?.data?.data || [];

  // Handle the press on a category card
  const handleCategoryPress = (category: Category) => {
    console.log('Category pressed:', category.name);
    router.push(`/(product)/category/${category.id}`);
  };

  // Primary loading state for the entire screen - consider both queries
  const isLoadingInitialData =
    (isCategoriesLoading && !isCategoriesFetching && categories.length === 0) ||
    (isRecentProductsLoading &&
      !isRecentProductsFetching &&
      recentProducts.length === 0);

  // Primary error state for the entire screen - consider both queries
  const hasLoadingError =
    (categoriesError && categories.length === 0) ||
    (recentProductsError && recentProducts.length === 0);

  // If initial data for categories OR recent products is loading
  if (
    isLoadingInitialData ||
    ((isRecentProductsLoading || isRecentProductsFetching) &&
      recentProducts.length === 0)
  ) {
    return <LoadingIndicator message='Loading data...' />;
  }

  // If there's a primary error preventing display of either main section
  if (hasLoadingError) {
    const errorMessage =
      (categoriesError as any)?.data?.message ||
      (recentProductsError as any)?.data?.message ||
      'Failed to load home data.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingError
          message={errorMessage}
          onRetry={() => {
            refetchCategories();
            refetchRecentProducts();
          }}
        />{' '}
        {/* Retry both */}
      </SafeAreaView>
    );
  }

  // Render function for recent product items in the FlatList
  const renderRecentProductItem = ({ item }: { item: Product }) => (
    // Use ProductWithVendorCard if it correctly handles Product type with Vendor relation
    // Ensure your Product type includes Vendor if ProductWithVendorCard expects it
    <ProductWithVendorCard product={item} /> // Pass the product data
  );

  // Optional: Empty component for recent products list
  const RecentProductsEmptyComponent = () => {
    if (isRecentProductsLoading || isRecentProductsFetching) return null; // Don't show if loading/fetching

    return (
      <View style={styles.recentProductsEmptyContainer}>
        <Text
          style={[
            styles.recentProductsEmptyText,
            { color: colors['gray-600'] },
          ]}
        >
          No recent products found.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Stack.Screen options={{ title: 'Home' }} />
      <ScrollView style={styles.scrollView}>
        <BannerSlider slides={motivationalSlides} height={150} />

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Shop by Category
          </Text>
          {/* Pass loading/error states to CategoryList for inline feedback */}
          <CategoryList
            categories={categories}
            onCategoryPress={handleCategoryPress}
            isLoading={isCategoriesLoading || isCategoriesFetching}
            error={categoriesError}
          />
          {/* Optional: Show error message below category list if category list is empty but products loaded */}
          {categoriesError && categories.length === 0 && (
            <Text style={[styles.inlineErrorText, { color: colors.red }]}>
              Failed to load categories.
            </Text>
          )}
        </View>

        {/* Recently Added Products Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>
            Recently Added
          </Text>

          <FlatList
            data={recentProducts}
            renderItem={renderRecentProductItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentProductsListContent}
            ListEmptyComponent={RecentProductsEmptyComponent()} // Use empty component
          />
          {/* Optional: Show error message below product list if product list is empty but categories loaded */}
          {recentProductsError &&
            recentProducts.length === 0 &&
            !(isRecentProductsLoading || isRecentProductsFetching) && (
              <Text
                style={[
                  styles.inlineErrorText,
                  { color: colors.red, paddingHorizontal: 15 },
                ]}
              >
                Failed to load recent products.
              </Text>
            )}
        </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  // New styles for recent products list
  recentProductsListContent: {
    paddingHorizontal: 10, // Add padding
  },
  recentProductsEmptyContainer: {
    // Style for empty state
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  recentProductsEmptyText: {
    // Style for empty text
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  inlineLoadingContainer: {
    // Style for inline loading spinner
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  inlineLoadingText: {
    // Style for inline loading text
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  inlineErrorText: {
    // Style for inline error messages
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 10,
  },
});
