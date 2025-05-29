import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react'; // Import useEffect
// Removed useSelector
import Toast from 'react-native-toast-message';

import { useColorTheme } from '@/hooks/useColorTheme';
import { IconButton } from '@/components/ui/IconButton';
import { useLocalSearchParams, Stack, router } from 'expo-router'; // Import router
import { useGetProductByIdQuery } from '@/redux/api/productApi';
import { useCreateCartItemMutation } from '@/redux/api/cartApi';
import {
  useGetWishlistQuery, // <-- Import wishlist query
  useAddToWishlistMutation, // <-- Import add mutation
  useDeleteWishlistMutation, // <-- Import delete mutation
} from '@/redux/api/wishlistApi';
// Removed ErrorMessage as LoadingError is used
import Button from '@/components/ui/Button';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';
import { formatPrice } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth'; // To check if user is logged in
import LoadingError from '@/components/ui/LoadingError'; // <-- Import LoadingError
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const colors = useColorTheme();
  const { id: productId } = useLocalSearchParams<{ id: string }>(); // Rename id to productId for clarity

  // Check if user is authenticated using the useAuth hook
  const { isAuthenticated } = useAuth();

  const [showDetail, setShowDetail] = useState(true);
  const [showReview, setShowReview] = useState(true);
  // isFavorite state will now be derived from the wishlist data
  // const [isFavorite, setIsFavorite] = useState(false); // Removed local state
  const [quantity, setQuantity] = useState(1);

  // --- Fetch Product Details ---
  const {
    data: productDetailResponse,
    error: productError,
    isLoading: isProductLoading,
    isFetching: isProductFetching, // Added isFetching for loading state control
    refetch: refetchProduct,
  } = useGetProductByIdQuery(productId!, {
    skip: !productId,
  });

  const product = productDetailResponse?.data?.data;

  // --- Fetch User's Wishlist ---
  // Skip fetching wishlist if the user is not authenticated
  const {
    data: wishlistResponse,
    isLoading: isWishlistLoading,
    error: wishlistError, // Keep error for potential display/logging
    // refetch: refetchWishlist, // refetch is automatic due to invalidation, but can be useful for retry
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated, // Only fetch if authenticated
    // Optional: refetchOnMountOrArgChange: true, // Refetch wishlist when component mounts or auth status changes
  });

  // Access the array of wishlist items
  const wishlistItems = wishlistResponse?.data || []; // Array of WishlistWithProduct

  // --- Determine if the current product is in the wishlist ---
  const isProductWishlisted = wishlistItems.some(
    (item) => item.productId === productId
  );
  // Find the specific wishlist item if it's wishlisted (needed for deletion)
  const wishlistItem = wishlistItems.find(
    (item) => item.productId === productId
  );
  const wishlistItemId = wishlistItem?.id;

  // --- Wishlist Mutations ---
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [deleteWishlist, { isLoading: isRemovingFromWishlist }] =
    useDeleteWishlistMutation();

  // Add to Cart Mutation
  const [createCartItem, { isLoading: isAddingToCart, error: addToCartError }] =
    useCreateCartItemMutation();

  const handleShowDetail = () => setShowDetail(!showDetail);
  const handleShowReview = () => setShowReview(!showReview);

  // --- Updated Wishlist Handlers ---
  const handleAddToWishlist = async () => {
    // Ensure product ID is available and user is authenticated before attempting to add
    if (!productId || !isAuthenticated || isAddingToWishlist) {
      // If not authenticated, prompt sign in
      if (!isAuthenticated) {
        Toast.show({
          type: 'info',
          text1: 'Sign In Required',
          text2: 'Please sign in to add items to your wishlist.',
        });
        router.push('/(auth)/signin'); // Navigate to sign-in
      }
      return;
    }

    try {
      Toast.show({
        type: 'info',
        text1: 'Adding to Wishlist...',
      });
      // Call the add mutation with the product ID
      await addToWishlist(productId).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Added to Wishlist',
        text2: `${product?.name} has been added to your wishlist.`,
      });
      // The invalidatesTags in wishlistApi should refetch the wishlist automatically
    } catch (err: any) {
      // console.error('Failed to add to wishlist:', err);
      const message = err?.data?.message || 'Could not add item to wishlist.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  };

  const handleRemoveFromWishlist = async () => {
    // Need the wishlist item ID to remove
    if (!wishlistItemId || !isAuthenticated || isRemovingFromWishlist) return;

    try {
      Toast.show({
        type: 'info',
        text1: 'Removing from Wishlist...',
      });
      // Call the delete mutation with the wishlist item ID
      await deleteWishlist(wishlistItemId).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Removed from Wishlist',
        text2: `${product?.name} has been removed from your wishlist.`,
      });
      // The invalidatesTags in wishlistApi should refetch the wishlist automatically
    } catch (err: any) {
      // console.error('Failed to remove from wishlist:', err);
      const message =
        err?.data?.message || 'Could not remove item from wishlist.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + amount;
      if (newQuantity < 1) return 1; // Minimum quantity is 1
      if (product && newQuantity > product.stock) return product.stock; // Max quantity is stock
      return newQuantity;
    });
  };

  const handleAddToCart = async () => {
    if (!product) return; // Ensure product data is loaded
    if (!isAuthenticated) {
      // Ensure user is logged in to add to cart
      Toast.show({
        type: 'info',
        text1: 'Sign In Required',
        text2: 'Please sign in to add items to your cart.',
      });
      router.push('/(auth)/signin'); // Navigate to sign-in
      return;
    }

    try {
      Toast.show({
        type: 'info',
        text1: 'Adding to Cart...',
      });
      const result = await createCartItem({
        productId: product.id,
        quantity: quantity,
      }).unwrap();

      // Assuming your CreateCartItemResponse has a structure like:
      // { apiVersion: "...", data: { status: "success", message: "...", data: CartItem } }
      if (result?.data?.status === 'success') {
        // Safely access status
        Toast.show({
          type: 'success',
          text1: 'Added to Cart!',
          text2: `${product.name} (${quantity}) has been added to your cart.`,
        });
        // Optionally reset quantity or navigate
        setQuantity(1);
      } else {
        Toast.show({
          type: 'info',
          text1: 'Notice',
          text2: result?.data?.message || 'Could not add item to cart.', // Safely access message
        });
      }
    } catch (err: any) {
      // console.error('Failed to add to cart:', err);
      const message =
        err?.data?.data?.message ||
        err?.data?.message ||
        'Failed to add item to cart. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    }
  };

  // Use transformed image URL
  const imageUrl = useTransformImageUrl({
    imageUrl: product?.image_url,
  });

  // --- Handle Loading and Error States for Product Details ---
  // Show loading spinner if product data is loading initially or refetching
  if (isProductLoading && !product) {
    // Only show full screen loading if no product data yet
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size='large' color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors['gray-600'] }]}>
          Loading product...
        </Text>
      </SafeAreaView>
    );
  }

  // Show error screen if product error occurs and no product data is available
  if (productError && !product) {
    const errorMessage =
      (productError as any)?.data?.message || 'Failed to load product details.';
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <LoadingError message={errorMessage} onRetry={refetchProduct} />
      </SafeAreaView>
    );
  }

  // Handle case where product is not found after loading
  if (!product && !isProductLoading && !isProductFetching) {
    // Ensure loading is false before concluding not found
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.emptyStateText, { color: colors['gray-700'] }]}>
          Product not found.
        </Text>
      </SafeAreaView>
    );
  }

  // --- Render Product Details (if product data is available) ---
  // Ensure product is not null before destructuring and rendering
  if (!product) {
    return null; // Should be handled by the loading/error states above, but safeguard
  }

  const { name, price, unit, description, discount_price, stock } = product;
  const hasDiscount =
    discount_price !== null &&
    discount_price !== undefined &&
    discount_price > 0 &&
    discount_price < price;

  // Determine the correct handler for the heart icon based on wishlist status
  const wishlistButtonHandler = isProductWishlisted
    ? handleRemoveFromWishlist
    : handleAddToWishlist;
  // Determine the icon based on wishlist status
  const wishlistButtonIcon = isProductWishlisted ? 'heart' : 'heart-outline';
  // Determine the color based on wishlist status
  const wishlistButtonColor = isProductWishlisted
    ? colors.notification
    : colors['gray-600']; // Use notification color for favorited

  // Combine loading states for the wishlist button
  // Only show wishlist button loading if authenticated and one of the wishlist mutations is loading
  const isWishlistButtonLoading =
    isAuthenticated && (isAddingToWishlist || isRemovingFromWishlist);

  return (
    <SafeAreaView style={styles.flexContainer}>
      <Stack.Screen options={{ title: name, headerBackTitle: 'Back' }} />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: imageUrl || 'https://via.placeholder.com/300' }}
          style={styles.productImage}
          resizeMode='cover'
        />

        {/* Product Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerSection}>
            <Text style={[styles.productName, { color: colors['gray-900'] }]}>
              {name}
            </Text>
            {/* Wishlist Icon Button */}
            <IconButton
              onPress={wishlistButtonHandler}
              color={wishlistButtonColor}
              icon={wishlistButtonIcon}
              size={28}
              // Disable button while adding/removing from wishlist
              // Disable if wishlist query is loading for authenticated user
              disabled={
                isWishlistButtonLoading ||
                (isAuthenticated && isWishlistLoading)
              }
              // isLoading={isWishlistButtonLoading}
            />
          </View>

          <View style={styles.priceAndUnitSection}>
            <Text
              style={[
                styles.currentPrice,
                { color: hasDiscount ? colors.red : colors.primary },
              ]}
            >
              {formatPrice(hasDiscount ? discount_price : price)}
            </Text>
            {hasDiscount && (
              <Text
                style={[styles.originalPrice, { color: colors['gray-500'] }]}
              >
                {formatPrice(price)}
              </Text>
            )}
            <Text style={[styles.unitText, { color: colors['gray-700'] }]}>
              / {unit}
            </Text>
          </View>

          {stock > 0 ? (
            <Text
              style={[
                styles.stockText,
                { color: colors.primary, borderColor: colors.primary },
              ]}
            >
              In Stock ({stock} available)
            </Text>
          ) : (
            <Text
              style={[
                styles.stockText,
                { color: colors.red, borderColor: colors.red },
              ]}
            >
              Out of Stock
            </Text>
          )}

          {/* Description Section */}
          <TouchableOpacity
            onPress={handleShowDetail}
            style={styles.collapsibleHeader}
          >
            <Text style={[styles.sectionTitle, { color: colors['gray-800'] }]}>
              Description
            </Text>
            <Ionicons
              name={showDetail ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={24}
              color={colors['gray-700']}
            />
          </TouchableOpacity>
          {showDetail && (
            <Text
              style={[styles.descriptionText, { color: colors['gray-700'] }]}
            >
              {description}
            </Text>
          )}

          {/* Reviews Section */}
          <TouchableOpacity
            onPress={handleShowReview}
            style={styles.collapsibleHeader}
          >
            <Text style={[styles.sectionTitle, { color: colors['gray-800'] }]}>
              Reviews (5.0) {/* Example static rating */}
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name='star' size={18} color='#FFC107' />
              ))}
              <Ionicons
                name={
                  showReview ? 'chevron-up-outline' : 'chevron-down-outline'
                }
                size={24}
                color={colors['gray-700']}
                style={{ marginLeft: 10 }}
              />
            </View>
          </TouchableOpacity>
          {showReview && (
            <View style={styles.reviewContent}>
              <Text
                style={[styles.descriptionText, { color: colors['gray-700'] }]}
              >
                This is an absolutely good product with a good price. Highly
                recommended!
              </Text>
              {/* Add more reviews or a list here */}
            </View>
          )}
        </View>

        {/* Quantity Section (only if in stock) */}
        {stock > 0 && (
          <View
            style={{
              ...styles.quantitySection,
              paddingHorizontal: 10,
              alignSelf: 'center',
            }}
          >
            <Text style={[styles.quantityLabel, { color: colors['gray-800'] }]}>
              Adjust quantity:
            </Text>
            <View style={styles.quantityControls}>
              <IconButton
                icon='remove-circle-outline'
                size={28}
                onPress={() => handleQuantityChange(-1)}
                color={colors['primary']}
                disabled={quantity <= 1 || isAddingToCart}
              />
              <Text
                style={[styles.quantityValue, { color: colors['gray-900'] }]}
              >
                {quantity}
              </Text>
              <IconButton
                icon='add-circle-outline'
                size={28}
                onPress={() => handleQuantityChange(1)}
                color={colors['primary']}
                disabled={quantity >= stock || isAddingToCart}
              />
            </View>
          </View>
        )}

        {/* Sticky Footer for Add to Cart Button */}
        {/* Only show footer if in stock */}
        {stock > 0 && (
          <View
            style={[
              styles.footer,
              {
                borderTopColor: colors['gray-200'],
                backgroundColor: colors.background,
              },
            ]}
          >
            <Button
              icon='cart-outline'
              title={isAddingToCart ? 'Adding...' : 'Add to Cart'}
              disabled={isAddingToCart} // Disable if adding to cart
              onPress={handleAddToCart}
              isLoading={isAddingToCart}
            />
            <Button
              icon='cart-outline'
              iconColor={colors.primary}
              title='View Your Cart'
              onPress={() => router.push('/(tabs)/cart')}
              style={{
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.primary,
              }}
              titleStyle={{ color: colors.primary }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 320,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    flex: 1,
    marginRight: 10,
  },
  priceAndUnitSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  originalPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  unitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  stockText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  quantitySection: {
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingVertical: 10,
  },
  quantityLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quantityValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    minWidth: 30,
    textAlign: 'center',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    paddingVertical: 10,
    textAlign: 'justify',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewContent: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    gap: 20,
  },
});
