import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Text,
  ScrollView,
} from 'react-native';
import { useGetProductsQuery } from '@/redux/api/productApi';
import ProductCard from '@/components/product/ProductCard';
import { useColorTheme } from '@/hooks/useColorTheme';
import ErrorMessage from '@/components/ui/ErrorMessage'; // Assuming you have this
import { SafeAreaView } from 'react-native-safe-area-context'; // For better screen edges
import { GetProductsParams } from '@/types/product';
import LoadingIndicator from '../ui/LoadingIndicator';
import LoadingError from '../ui/LoadingError';

export default function ProductsList() {
  const colors = useColorTheme();
  const [queryParams, setQueryParams] = useState<GetProductsParams>({
    page: 1,
    limit: 10,
  });

  const {
    data: productListResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(queryParams);

  const products = productListResponse?.data?.data || [];
  const metadata = productListResponse?.data?.metadata;

  // console.log('products', products);

  const handleLoadMore = useCallback(() => {
    if (metadata && metadata.currentPage < metadata.totalPages && !isFetching) {
      setQueryParams((prevParams) => ({
        ...prevParams,
        page: (prevParams.page || 1) + 1,
      }));
    }
  }, [metadata, isFetching]);

  const onRefresh = useCallback(() => {
    setQueryParams((prevParams) => ({ ...prevParams, page: 1 }));
    // refetch(); // RTK Query will refetch automatically if queryParams change
  }, []);

  const renderFooter = () => {
    if (!isFetching || queryParams.page === 1) return null;
    return (
      <ActivityIndicator
        style={{ marginVertical: 20 }}
        size='small'
        color={colors.primary}
      />
    );
  };

  if (isLoading && queryParams.page === 1) {
    return <LoadingIndicator message='Loading products...' />;
  }

  if (error) {
    const errorMessage =
      (error as any)?.data?.message ||
      'Failed to load products. Check your connection.';
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        {/* <ErrorMessage message={errorMessage} onRetry={refetch} /> */}
        <LoadingError message={errorMessage} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContentContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.7}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <View style={styles.centered}>
              <Text
                style={{
                  color: colors['gray-700'],
                  fontFamily: 'Inter-Regular',
                }}
              >
                No products found.
              </Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && queryParams.page === 1}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
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
  listContentContainer: {
    paddingHorizontal: 6, // Adjust to match ProductCard margin
    paddingVertical: 10,
  },
});
