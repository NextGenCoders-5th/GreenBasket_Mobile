import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { useGetProductsQuery } from '@/redux/api/productApi';
import ProductCardWithVendor from '@/components/product/ProductWithVendorCard';
import { useColorTheme } from '@/hooks/useColorTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetProductsParams, Product } from '@/types/product';
import LoadingIndicator from '../ui/LoadingIndicator';
import LoadingError from '../ui/LoadingError';
import Button from '../ui/Button';

interface ProductsListProps {
  searchText?: string; // Accept the search text as a prop
  // Add other filtering/sorting props here if needed
}

export default function ProductsList({ searchText }: ProductsListProps) {
  // Accept searchText prop
  const colors = useColorTheme();
  const [queryParams, setQueryParams] = useState<GetProductsParams>({
    page: 1,
    limit: 10,
    search: '', // Initialize search parameter
    // Add other default parameters like sortBy if needed
  });

  // --- Effect to update queryParams when searchText prop changes ---
  useEffect(() => {
    // Only update if the search text has actually changed
    if (queryParams.search !== searchText) {
      // Reset to the first page when the search term changes
      setQueryParams((prevParams) => ({
        ...prevParams,
        page: 1, // Always go back to page 1 on new search
        search: searchText || '', // Use the new search text, default to empty string
      }));
    }
  }, [searchText, queryParams.search]); // Depend on searchText prop and current search queryParam

  const {
    data: productListResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(queryParams); // RTK Query will refetch when queryParams state changes

  // Data structure check: assuming data is an array of ProductWithVendor
  const products = (productListResponse?.data?.data as Product[]) || [];
  const metadata = productListResponse?.data?.metadata;

  const handleLoadMore = useCallback(() => {
    // Only load more if there are more pages AND not already fetching AND not currently searching (optional, depending on backend pagination with search)
    // A more robust pagination with search might require passing the search term with the load more request.
    if (metadata && metadata.currentPage < metadata.totalPages && !isFetching) {
      setQueryParams((prevParams) => ({
        ...prevParams,
        page: (prevParams.page || 1) + 1,
        // If your backend pagination needs search term on subsequent pages:
        // search: prevParams.search,
      }));
    }
  }, [metadata, isFetching, queryParams.search]); // Added queryParams.search to dependencies

  const onRefresh = useCallback(() => {
    // Reset to the first page, maintaining the current search term
    setQueryParams((prevParams) => ({
      ...prevParams,
      page: 1,
      // search: prevParams.search, // Maintain search term on refresh
    }));
    // RTK Query will refetch automatically when queryParams change
  }, []); // No need to depend on queryParams.search here if it's included in the reset

  // Show loading indicator only on the very first load for current queryParams
  if (isLoading && !isFetching) {
    // isLoading is true initially, isFetching is true for all fetches
    return <LoadingIndicator message='Loading products...' />;
  }

  // Handle error state
  if (error && products.length === 0) {
    // Only show full error screen if no products loaded
    const errorMessage =
      (error as any)?.data?.message ||
      'Failed to load products. Check your connection.';
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <LoadingError message={errorMessage} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Render footer for "Load More" spinner
  const renderFooter = () => {
    // Show spinner if fetching and it's not the first page (initial fetch handled above)
    if (isFetching && queryParams.page! > 1) {
      return (
        <ActivityIndicator
          style={{ marginVertical: 20 }}
          size='small'
          color={colors.primary}
        />
      );
    }
    return null;
  };

  // Render empty list component
  const renderEmptyComponent = () => {
    // Only show empty state if not currently loading/fetching AND there are no products
    if (!isLoading && !isFetching && products.length === 0) {
      // You might add different empty states for search results vs no products at all
      const emptyMessage = queryParams.search
        ? 'No products found for your search.'
        : 'No products available.';
      return (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              { color: colors['gray-700'], fontFamily: 'Inter-Regular' },
            ]}
          >
            {emptyMessage}
          </Text>
          {/* Optional: Add a retry button if error happened before showing empty state */}
          {error && (
            <Button
              title='Retry'
              onPress={refetch}
              style={{ marginTop: 10 }}
              // variant='outline'
            />
          )}
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      <FlatList
        data={products}
        // Use ProductCardWithVendor if that's the component that accepts this product structure
        renderItem={({ item }) => <ProductCardWithVendor product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        // Ensure columnWrapperStyle exists in your styles
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContentContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.7}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent()} // Use the new empty component renderer
        refreshControl={
          <RefreshControl
            // Only show refresh indicator if fetching the first page
            refreshing={isFetching && queryParams.page === 1}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        // Add padding around items if not handled by card margin and listContentContainer padding
        // ItemSeparatorComponent={() => <View style={{ height: 15 }} />} // Example vertical separator
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
    // Style for the centered empty state
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    // fontFamily: 'Inter-Regular', // Already in style
    textAlign: 'center',
  },
  listContentContainer: {
    paddingHorizontal: 6, // Adjust to match ProductCard margin
    // paddingVertical: 10,
    flexGrow: 1, // Allows ListEmptyComponent to center
  },
  row: {
    // Style for rows when numColumns > 1
    justifyContent: 'space-between', // Distribute items evenly
    gap: 8, // Space between items horizontally in a row (adjust as needed)
    marginBottom: 8, // Optional: space between rows (adjust as needed)
  },
});
