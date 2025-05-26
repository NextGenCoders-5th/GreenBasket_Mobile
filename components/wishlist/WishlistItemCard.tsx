// components/wishlist/WishlistItemCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WishlistWithProduct } from '@/types/wishlist'; // Import WishlistWithProduct
import { useColorTheme } from '@/hooks/useColorTheme';
import { formatPrice } from '@/utils/formatters';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';
import { Ionicons } from '@expo/vector-icons'; // For the remove icon
import { IconButton } from '../ui/IconButton'; // Assuming you have an IconButton component
import Button from '../ui/Button';
import { router } from 'expo-router';

interface WishlistItemCardProps {
  item: WishlistWithProduct; // The wishlist item with product details
  onRemovePress?: (wishlistItemId: string) => void; // Handler for removing the item
  onAddToCartPress?: (productId: string) => void; // Optional: Handler for adding to cart
  isRemoving?: boolean; // Optional: To show a loading state on the remove button
}

export default function WishlistItemCard({
  item,
  onRemovePress,
  onAddToCartPress,
  isRemoving = false,
}: WishlistItemCardProps) {
  const colors = useColorTheme();
  const product = item.Product; // Access the nested Product object
  const imageUrl = useTransformImageUrl({ imageUrl: product.image_url });

  return (
    <View
      style={[
        styles.card,
        { borderColor: colors['gray-200'], backgroundColor: colors.background },
      ]}
    >
      {imageUrl ? (
        <TouchableOpacity
          onPress={() => router.push(`/(product)/${product.id}`)}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            resizeMode='cover'
          />
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.productImagePlaceholder,
            { backgroundColor: colors['gray-100'] },
          ]}
        >
          <Text style={[styles.placeholderText, { color: colors['gray-500'] }]}>
            No Image
          </Text>
        </View>
      )}

      <View style={styles.detailsContainer}>
        <Text
          style={[styles.productName, { color: colors['gray-900'] }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        {/* Optional: Show vendor name if Product type included it */}
        {/* <Text style={[styles.vendorName, { color: colors['gray-600'] }]} numberOfLines={1}>
           by {product.Vendor?.business_name || 'Unknown Vendor'}
         </Text> */}
        <Text style={[styles.price, { color: colors.primary }]}>
          {formatPrice(
            product.discount_price !== null
              ? product.discount_price
              : product.price
          )}{' '}
          {/* Show discounted or original price */}
        </Text>
        {/* Optional: Stock status */}
        {product.stock <= 0 && (
          <Text style={[styles.stockStatus, { color: colors.red }]}>
            Out of Stock
          </Text>
        )}
        {/* Optional: "Add to Cart" button */}
        {onAddToCartPress && product.stock > 0 && (
          <Button // Assuming your Button component is suitable or create a smaller one
            title='Add to Cart'
            onPress={() => onAddToCartPress(product.id)}
            style={[
              styles.addToCartButton,
              { backgroundColor: colors.primary },
            ]}
            titleStyle={{
              ...styles.addToCartButtonText,
              color: colors['gray-100'],
            }}
            size={18} // Adjust icon size
            icon='cart-outline' // Example icon
            iconColor={colors['gray-100']} // Adjust icon color
          />
        )}
      </View>

      {/* Remove Button */}
      {onRemovePress && (
        <IconButton
          icon='close-circle' // Example remove icon
          size={30} // Adjust size
          color={colors['primary-500']} // Adjust color
          onPress={() => onRemovePress(item.id)} // Call handler with wishlist item ID
          style={styles.removeButton}
          disabled={isRemoving} // Show loading state
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    gap: 10, // Space between image and details
  },
  productImage: {
    width: 80, // Adjust size
    height: 80, // Adjust size
    borderRadius: 4,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  detailsContainer: {
    flex: 1, // Allow details to take available space
    // Remove padding from here, add to card if needed
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 5, // Space below price
  },
  stockStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 5,
  },
  removeButton: {
    // Position the remove button if needed, or rely on flex layout
    padding: 5, // Add some padding to make it easier to tap
  },
  addToCartButton: {
    // Styles for the add to cart button if implemented
    marginTop: 10,
    paddingVertical: 6, // Smaller padding
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start', // Align to the left
    backgroundColor: '#eee', // Example background
    borderColor: '#ccc', // Example border
    borderWidth: 1,
  },
  addToCartButtonText: {
    fontSize: 12, // Smaller font size
    fontWeight: 'normal',
    color: '#333', // Example color
  },
});
