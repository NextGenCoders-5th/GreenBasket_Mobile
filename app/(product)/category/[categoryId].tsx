import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useColorTheme } from '@/hooks/useColorTheme';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import { useGetProductsByCategoryQuery } from '@/redux/api/productApi';
import { Product } from '@/types/product';
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

  const category = categoryProductsResponse?.data?.data;
  const products = category?.products || [];

  useEffect(() => {
    if (!categoryId) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Category',
        text2: 'Category ID is missing.',
      });
      router.replace('/(tabs)/home');
    }
  }, [categoryId, router]);

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductWithVendorCard product={item} />
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
        <Button
          title='Back Home'
          onPress={() => router.replace('/(tabs)/home')}
          style={{ marginTop: 20 }}
          titleStyle={{ color: colors['gray-100'] }}
        />
      </View>
    );
  };

  // Handle loading state for the entire screen
  if (
    isCategoryProductsLoading &&
    !isCategoryProductsFetching &&
    products.length === 0
  ) {
    return <LoadingIndicator message='Loading products in a category...' />;
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
          title='Back Home'
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
      <Stack.Screen options={{ title: category?.name || 'Products' }} />

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
});
