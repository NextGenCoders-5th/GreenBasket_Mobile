// components/product/ProductWithVendorCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Product } from '@/types/product'; // Assuming this type includes Vendor and is what GetProductsByCategoryResponse returns
import { useColorTheme } from '@/hooks/useColorTheme';
import { formatPrice } from '@/utils/formatters';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl'; // Assuming this hook
import { router } from 'expo-router';

interface ProductWithVendorCardProps {
  product: Product;
}

export default function ProductWithVendorCard({
  product,
}: ProductWithVendorCardProps) {
  const colors = useColorTheme();
  const imageUrl = useTransformImageUrl({ imageUrl: product.image_url });

  const { id } = product;

  const displayPrice =
    product.discount_price !== null && product.discount_price > 0
      ? product.discount_price
      : product.price;

  // Determine if there's a discount to show the original price crossed out
  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price > 0 &&
    product.discount_price < product.price;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors['gray-200'] },
      ]}
      onPress={() => router.push(`/(product)/${id}`)} // Navigate to product details
      // disabled={!onPress}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode='cover'
        />
      ) : (
        // Placeholder if no image
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
        <Text
          style={[styles.vendorName, { color: colors['gray-600'] }]}
          numberOfLines={1}
        >
          by {product.Vendor?.business_name || 'Unknown Vendor'}{' '}
          {/* Access Vendor name */}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatPrice(displayPrice)}
          </Text>
          {hasDiscount && (
            <Text
              style={[
                styles.originalPrice,
                {
                  color: colors['gray-500'],
                  textDecorationLine: 'line-through',
                },
              ]}
            >
              {formatPrice(product.price)}
            </Text>
          )}
        </View>
        {/* Optional: Stock status */}
        {product.stock <= 0 && (
          <Text style={[styles.stockStatus, { color: colors.red }]}>
            Out of Stock
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 15,
    marginHorizontal: 5,
    flex: 1,
    minWidth: 150,
    maxWidth: 200,
  },
  productImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  detailsContainer: {
    paddingHorizontal: 10, // Padding inside the card below the image
    paddingBottom: 10,
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Space between prices
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  stockStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 5,
  },
});
