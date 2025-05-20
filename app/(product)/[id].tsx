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
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useColorTheme } from '@/hooks/useColorTheme';
import { IconButton } from '@/components/ui/IconButton';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useGetProductByIdQuery } from '@/redux/api/productApi';
import { useCreateCartItemMutation } from '@/redux/api/cartApi'; // Import cart mutation
import ErrorMessage from '@/components/ui/ErrorMessage';
import Button from '@/components/ui/Button';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';
import { formatPrice } from '@/utils/formatters'; // Assuming you have this

export default function ProductDetailScreen() {
  const colors = useColorTheme();

  const [showDetail, setShowDetail] = useState(true);
  const [showReview, setShowReview] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1); // State for quantity

  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch product details
  const {
    data: productDetailResponse,
    error: productError,
    isLoading: isProductLoading,
    refetch: refetchProduct,
  } = useGetProductByIdQuery(id!, {
    skip: !id,
  });

  const product = productDetailResponse?.data?.data;

  // Add to Cart Mutation
  const [createCartItem, { isLoading: isAddingToCart, error: addToCartError }] =
    useCreateCartItemMutation();

  const handleShowDetail = () => setShowDetail(!showDetail);
  const handleShowReview = () => setShowReview(!showReview);
  const handleToggleFavorite = () => setIsFavorite(!isFavorite);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + amount;
      if (newQuantity < 1) return 1; // Minimum quantity is 1
      if (product && newQuantity > product.stock) return product.stock; // Max quantity is stock
      return newQuantity;
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const result = await createCartItem({
        productId: product.id,
        quantity: quantity,
      }).unwrap(); // Use unwrap to get the actual response or throw an error

      // Assuming your CreateCartItemResponse has a structure like:
      // { apiVersion: "...", data: { status: "success", message: "...", data: CartItem } }
      if (result.data.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Added to Cart!',
          text2: `${product.name} (${quantity}) has been added to your cart.`,
        });
        // Optionally reset quantity or navigate
        setQuantity(1);
      } else {
        // Handle cases where API returns success status but with a non-ideal message
        Toast.show({
          type: 'info',
          text1: 'Notice',
          text2: result.data.message || 'Could not add item to cart.',
        });
      }
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      const message =
        err?.data?.data?.message || // Specific backend error message
        err?.data?.message || // General backend error message
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
    // Add transformation options if your hook supports them
  });

  if (isProductLoading || !id) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size='large' color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (productError) {
    const errorMessage =
      (productError as any)?.data?.message || 'Failed to load product details.';
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        {/* <ErrorMessage message={errorMessage} onRetry={refetchProduct} /> */}
        <ErrorMessage message={errorMessage} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <Text
          style={{ color: colors['gray-700'], fontFamily: 'Inter-Regular' }}
        >
          Product not found.
        </Text>
      </SafeAreaView>
    );
  }

  const { name, price, unit, description, discount_price, stock } = product;
  const hasDiscount = discount_price && discount_price < price;

  return (
    <SafeAreaView style={styles.flexContainer}>
      <Stack.Screen options={{ title: name, headerBackTitle: 'Back' }} />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: imageUrl || 'https://via.placeholder.com/300' }} // Fallback URI
          style={styles.productImage}
          resizeMode='cover'
        />
        <View style={styles.detailsContainer}>
          <View style={styles.headerSection}>
            <Text style={[styles.productName, { color: colors['gray-900'] }]}>
              {name}
            </Text>
            <IconButton
              onPress={handleToggleFavorite}
              color={isFavorite ? colors.notification : colors['gray-600']} // Adjusted non-favorite color
              icon={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
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

          <View style={styles.quantitySection}>
            <Text style={[styles.quantityLabel, { color: colors['gray-800'] }]}>
              Quantity:
            </Text>
            <View style={styles.quantityControls}>
              <IconButton
                icon='remove-circle-outline' // Changed icon
                size={28} // Adjusted size
                onPress={() => handleQuantityChange(-1)}
                color={colors['primary']}
                disabled={quantity <= 1}
              />
              <Text
                style={[styles.quantityValue, { color: colors['gray-900'] }]}
              >
                {quantity}
              </Text>
              <IconButton
                icon='add-circle-outline' // Changed icon
                size={28} // Adjusted size
                onPress={() => handleQuantityChange(1)}
                color={colors['primary']}
                disabled={quantity >= stock}
              />
            </View>
            {/* The total price display was removed as it's usually in the cart */}
          </View>

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
                <Ionicons key={i} name='star' size={18} color='#FFC107' /> // Example star color
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
      </ScrollView>

      {/* Sticky Footer for Add to Cart Button */}
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
          style={{ opacity: stock <= 0 ? 0.5 : 1 }} // Dim if out of stock
          onPress={handleAddToCart}
          disabled={isAddingToCart || stock <= 0} // Disable if adding or out of stock
          isLoading={isAddingToCart}
        />
      </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20, // Space for content before sticky footer
  },
  productImage: {
    width: '100%',
    height: 320,
    // borderRadius: 10, // Removed if image is full width at top
    // marginBottom: 20, // Handled by detailsContainer paddingTop
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20, // Add padding at the top of details
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to start for multi-line title
    marginBottom: 10,
  },
  productName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22, // Slightly reduced for balance
    fontWeight: '700',
    flex: 1, // Allow name to take available space
    marginRight: 10, // Space before favorite icon
  },
  priceAndUnitSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '800',
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
    marginLeft: 4, // Space after price
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
    // flexDirection: 'row', // Keep as column for label then controls
    // justifyContent: 'space-between',
    alignItems: 'flex-start', // Align label to start
    marginBottom: 25,
    paddingVertical: 10,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#E5E7EB', // Light border
  },
  quantityLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, // Space between buttons and value
  },
  quantityValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '700',
    minWidth: 30, // Ensure some space for the number
    textAlign: 'center',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12, // Add padding for touchability
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    fontWeight: '700',
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    paddingVertical: 10, // Add padding
    textAlign: 'justify',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewContent: {
    paddingVertical: 10,
    marginBottom: 20, // Space before footer
  },
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 20, // Match detailsContainer padding
    borderTopWidth: 1,
    // backgroundColor is set dynamically
  },
  // Button component will handle its own internal styling
});
