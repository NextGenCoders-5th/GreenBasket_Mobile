// app/(profile)/wishlist.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import Toast from 'react-native-toast-message';

import { useColorTheme } from '@/hooks/useColorTheme';
import Button from '@/components/ui/Button';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoadingError from '@/components/ui/LoadingError';
import WishlistItemCard from '@/components/wishlist/WishlistItemCard'; // Import the item card
import {
  useGetWishlistQuery,
  useDeleteWishlistMutation,
} from '@/redux/api/wishlistApi'; // Import the hooks
import { WishlistWithProduct } from '@/types/wishlist'; // Import the item type
import { useAuth } from '@/hooks/useAuth'; // For auth check
import SignIn from '@/components/account/SignIn'; // For auth check
import { useCreateCartItemMutation } from '@/redux/api/cartApi'; // Optional: for Add to Cart

export default function WishlistScreen() {
  const colors = useColorTheme();
  const { isLoading: isAuthLoading } = useAuth(); // Check initial auth loading
  const isAuthenticated = useAuth().isAuthenticated; // Check auth status

  const [removingItemId, setRemovingItemId] = useState<string | null>(null); // To show loading on specific item

  // Fetch the user's wishlist
  const {
    data: wishlistResponse,
    error: wishlistError,
    isLoading: isWishlistLoading,
    isFetching: isWishlistFetching,
    refetch: refetchWishlist,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if the user is not authenticated
  });

  // Mutation for removing a wishlist item
  const [deleteWishlist, { isLoading: isDeletingWishlistItem }] =
    useDeleteWishlistMutation();

  // Mutation for adding to cart (Optional)
  const [addToCart, { isLoading: isAddingToCart }] =
    useCreateCartItemMutation(); // Assuming you have this mutation

  const wishlistItems = wishlistResponse?.data || []; // Access the data directly based on your GetWishlistsResponse = ApiResponse<WishlistWithProduct[]>

  // Handle initial auth loading state
  if (isAuthLoading) {
    return <LoadingIndicator message='Checking authentication...' />;
  }

  // If not authenticated after auth loading is complete, show sign-in prompt
  if (!isAuthenticated) {
    return <SignIn message='Please sign in to view your wishlist.' />;
  }

  const handleRemoveItem = async (wishlistItemId: string) => {
    console.log('Attempting to remove wishlist item with ID:', wishlistItemId);
    setRemovingItemId(wishlistItemId); // Set loading state for the specific item
    try {
      // Call the mutation to delete the wishlist item
      await deleteWishlist(wishlistItemId).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Removed from Wishlist',
        text2: 'The item has been removed from your wishlist.',
      });
      // The invalidatesTags in wishlistApi.ts will trigger a refetch of getWishlist
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Remove Failed',
        text2: 'Could not remove item from wishlist.',
      });
      console.error('Remove wishlist item error:', err);
    } finally {
      setRemovingItemId(null); // Clear loading state
    }
  };

  // Optional: Handle adding item to cart from wishlist
  const handleAddToCart = async (productId: string) => {
    try {
      Toast.show({ type: 'info', text1: 'Adding to cart...' });
      await addToCart({ productId, quantity: 1 }).unwrap(); // Assuming addToCart mutation takes productId and quantity
      Toast.show({
        type: 'success',
        text1: 'Added to Cart!',
        text2: 'Item moved to cart.',
      });
      // Optionally, you might want to remove from wishlist after adding to cart
      // const itemToRemove = wishlistItems.find(item => item.productId === productId);
      // if (itemToRemove) handleRemoveItem(itemToRemove.id);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Add to Cart',
        text2: 'Could not add item.',
      });
      console.error('Add to cart error:', err);
    }
  };

  const renderWishlistItem = ({ item }: { item: WishlistWithProduct }) => (
    <WishlistItemCard
      item={item}
      onRemovePress={handleRemoveItem} // Pass the remove handler
      isRemoving={removingItemId === item.id} // Pass loading state for this item
      onAddToCartPress={handleAddToCart} // Pass add to cart handler if implemented
    />
  );

  const ListEmptyComponent = () => {
    // Only show empty state if not currently loading/fetching AND there are no items
    if (isWishlistLoading || isWishlistFetching) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors['gray-700'] }]}>
          Your wishlist is empty.
        </Text>
        <Button
          title='Start Shopping'
          onPress={() => router.push('/(tabs)/home')} // Navigate to home or explore
          style={{ marginTop: 20, width: '60%' }}
        />
      </View>
    );
  };

  // Handle loading state for wishlist (only if authenticated)
  // Check if isLoading is true AND it's the very first fetch AND no items are loaded yet
  if (
    isAuthenticated &&
    isWishlistLoading &&
    !isWishlistFetching &&
    wishlistItems.length === 0
  ) {
    return <LoadingIndicator message='Loading wishlist...' />;
  }

  // Handle error state for wishlist (only if authenticated)
  if (wishlistError) {
    const errorMessage =
      (wishlistError as any)?.data?.message || 'Failed to load your wishlist.';
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingError message={errorMessage} onRetry={refetchWishlist} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors['gray-50'] }]}
    >
      <Stack.Screen options={{ title: 'My Wishlist' }} />
      <FlatList
        data={wishlistItems}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isWishlistFetching && isAuthenticated} // Only show refreshing if authenticated
            onRefresh={refetchWishlist}
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
    // Style for centered content like error or auth required
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContentContainer: {
    paddingHorizontal: 15, // Adjust padding
    paddingVertical: 10,
    flexGrow: 1, // Allows ListEmptyComponent to center
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
    marginBottom: 20,
  },
});
