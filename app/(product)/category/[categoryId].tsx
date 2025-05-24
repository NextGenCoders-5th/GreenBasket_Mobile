// app/(product)/category/[categoryId].tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useColorTheme } from '@/hooks/useColorTheme';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import ProductCard from '@/components/product/ProductCard'; // Import ProductCard
import { useGetProductsByCategoryQuery } from '@/redux/api/productApi'; // Import the query hook
import { ProductWithVendor } from '@/types/product'; // Import the specific product type
import Button from '@/components/ui/Button';
import { RefreshControl } from 'react-native';
import ProductWithVendorCard from '@/components/product/ProductWithVendorCard';

export default function CategoryProductsScreen() {
  const colors = useColorTheme();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  // Fetch category details and products using the RTK Query hook
  const {
    data: categoryProductsResponse,
    error: categoryProductsError,
    isLoading: isCategoryProductsLoading,
    isFetching: isCategoryProductsFetching, // Use isFetching for pull-to-refresh
    refetch: refetchCategoryProducts,
  } = useGetProductsByCategoryQuery(categoryId!, {
    skip: !categoryId, // Skip the query if categoryId is not available
  });

  // Access the category details and products from the response data structure
  const category = categoryProductsResponse?.data?.data; // This should be CategoryWithProductsAndVendors
  const products = category?.products || []; // Array of ProductWithVendor

  // Handle case where categoryId is missing (shouldn't happen with dynamic routes usually)
  useEffect(() => {
    if (!categoryId) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Category',
        text2: 'Category ID is missing.',
      });
      router.replace('/(tabs)/home'); // Redirect home if ID is missing
    }
  }, [categoryId, router]);

  const handleProductPress = (product: ProductWithVendor) => {
    console.log('Product pressed:', product.name);
    // Navigate to the single product detail screen, passing the product ID
    router.push(`/(product)/${product.id}`); // Assuming product detail route is /(product)/[id].tsx
  };

  const renderProductItem = ({ item }: { item: ProductWithVendor }) => (
    <ProductWithVendorCard product={item} onPress={handleProductPress} />
  );

  const ListEmptyComponent = () => {
    // Only show empty state if not loading/fetching and there are no products
    if (isCategoryProductsLoading || isCategoryProductsFetching)
      return <LoadingIndicator message='Loading products in category...' />;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors['gray-700'] }]}>
          No products found in this category.
        </Text>
        {/* Optional: Button to go back or shop other categories */}
      </View>
    );
  };

  // Handle loading state for the entire screen
  if (
    isCategoryProductsLoading &&
    !isCategoryProductsFetching &&
    products.length === 0
  ) {
    return (
      <LoadingIndicator message={`Loading products for ${categoryId}...`} />
    );
  }

  // Handle error state for the entire screen
  if (categoryProductsError && products.length === 0) {
    const errorMessage =
      (categoryProductsError as any)?.data?.message ||
      'Failed to load products for this category.';
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
          onRetry={refetchCategoryProducts}
        />
      </SafeAreaView>
    );
  }

  // Handle case where category is not found (e.g., 404 error) after loading
  if (!category && !isCategoryProductsLoading && !isCategoryProductsFetching) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.emptyText, { color: colors['gray-700'] }]}>
          Category not found.
        </Text>
        <Button
          title='Go Back Home'
          onPress={() => router.replace('/(tabs)/home')}
          style={{ marginTop: 20, width: '60%' }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      {/* Header title is set dynamically in useEffect */}
      {/* Ensure a default title while loading if needed in _layout.tsx */}
      <Stack.Screen
        options={{ title: category?.name || 'Category Products' }}
      />

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Example: display in a 2-column grid
        columnWrapperStyle={styles.row} // Style for rows in grid
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isCategoryProductsFetching}
            onRefresh={refetchCategoryProducts}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={() => (
          // Optional: Add a section header for products if needed
          // <Text style={[styles.sectionTitle, { color: colors['gray-900'] }]}>Products</Text>
          <></> // Empty fragment if no header needed
        )}
        // Optional: Add padding to the list if not handled by contentContainerStyle
        // ItemSeparatorComponent={() => <View style={{ height: 15 }} />} // Example separator for vertical space
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    // For full screen loading/error/not found
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    // For empty list state
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  listContentContainer: {
    paddingHorizontal: 10, // Padding around the list
    paddingVertical: 10,
    flexGrow: 1, // Allows ListEmptyComponent to center
  },
  row: {
    // Style for rows when numColumns > 1
    justifyContent: 'space-between', // Distribute items evenly
    gap: 10, // Space between items horizontally in a row
    marginBottom: 5, // Optional: space between rows
  },
  sectionTitle: {
    // Reused style if you add a list header title
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
    paddingHorizontal: 5, // Adjust padding
  },
});
