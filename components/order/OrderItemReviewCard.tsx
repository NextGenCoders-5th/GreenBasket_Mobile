// components/order/OrderItemReviewCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useColorTheme } from '@/hooks/useColorTheme';
import { OrderItem } from '@/types/order'; // Import your OrderItem type
import { formatPrice } from '@/utils/formatters'; // Import your formatter
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl'; // Assuming you have this hook
import { Product } from '@/types/product'; // Import Product type if needed for image hook

interface OrderItemReviewCardProps {
  item: OrderItem;
}

export default function OrderItemReviewCard({
  item,
}: OrderItemReviewCardProps) {
  const colors = useColorTheme();
  // Use the Product data nested within the OrderItem
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
          resizeMode='contain'
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
          Qty: {item.quantity}
        </Text>
        {/* Display price for the order item, which should be item.price * item.quantity */}
        {/* Your OrderItem already has sub_total, which is good */}
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
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 4,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
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
