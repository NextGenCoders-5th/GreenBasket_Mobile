// components/cart/CartItemReviewCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';
import { CartItem } from '@/types/cart'; // Import your CartItem type
import { formatPrice } from '@/utils/formatters'; // Import your formatter
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl'; // Assuming you have this hook

interface CartItemReviewCardProps {
  item: CartItem;
}

export default function CartItemReviewCard({ item }: CartItemReviewCardProps) {
  const colors = useColorTheme();
  const imageUrl = useTransformImageUrl({ imageUrl: item.Product?.image_url }); // Adjust if product image path is different

  return (
    <View
      style={[
        styles.card,
        { borderColor: colors['gray-200'], backgroundColor: colors.background },
      ]}
    >
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode='cover'
        />
      )}
      <View style={styles.detailsContainer}>
        <Text
          style={[styles.productName, { color: colors['gray-900'] }]}
          numberOfLines={2}
        >
          {item.Product?.name || 'Unknown Product'}
        </Text>
        <Text style={[styles.quantityText, { color: colors['gray-600'] }]}>
          quantity: {item.quantity}
        </Text>
        <Text style={[styles.priceText, { color: colors.primary }]}>
          {formatPrice(item.sub_total)} {/* sub_total for this item */}
        </Text>
      </View>
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
  },
  productImage: {
    width: 80,
    height: 60,
    marginRight: 15,
    borderRadius: 4,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
});
