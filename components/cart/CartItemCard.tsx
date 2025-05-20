// components/cart/CartItemCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CartItem } from '@/types/cart'; // Assuming Product is nested or fetched separately
import { Product } from '@/types/product'; // If product details are directly available
import { useColorTheme } from '@/hooks/useColorTheme';
import { formatPrice } from '@/utils/formatters';
import { IconButton } from '@/components/ui/IconButton';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';

interface CartItemCardProps {
  item: CartItem;
  onIncreaseQuantity: (itemId: string) => void;
  onDecreaseQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) => {
  const colors = useColorTheme();
  // Assuming 'product' details are populated in the CartItem type from your backend
  // If not, you might need to fetch product details separately using item.productId

  const productDetails = item.Product as Product; // Assuming product details are directly available in the item
  // console.log('Product Details:', productDetails);

  const imageUrl = useTransformImageUrl({
    imageUrl: productDetails?.image_url,
  });

  if (!productDetails) {
    // Handle case where product details might be missing or still loading
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors['gray-50'], padding: 10 },
        ]}
      >
        <Text
          style={{ fontFamily: 'Inter-Regular', color: colors['gray-600'] }}
        >
          Loading product details...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: imageUrl || 'https://via.placeholder.com/80' }}
        style={styles.image}
        resizeMode='cover'
      />
      <View style={styles.infoContainer}>
        <Text
          style={[styles.productName, { color: colors['gray-800'] }]}
          numberOfLines={2}
        >
          {productDetails.name}
        </Text>
        <Text style={[styles.itemPrice, { color: colors.primary }]}>
          {formatPrice(item.price)}
        </Text>
        <Text style={[styles.subTotal, { color: colors['gray-700'] }]}>
          Subtotal: {formatPrice(item.sub_total)}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <View style={styles.quantityControls}>
          <IconButton
            icon='remove-circle-outline'
            size={26}
            color={colors.primary}
            onPress={() => onDecreaseQuantity(item.id)}
            disabled={item.quantity <= 1} // Disable if quantity is 1
          />
          <Text style={[styles.quantityText, { color: colors['gray-900'] }]}>
            {item.quantity}
          </Text>
          <IconButton
            icon='add-circle-outline'
            size={26}
            color={colors.primary}
            onPress={() => onIncreaseQuantity(item.id)}
            // Optional: disable if quantity reaches product stock
            // disabled={productDetails.stock <= item.quantity}
          />
        </View>
        <TouchableOpacity
          onPress={() => onRemoveItem(item.id)}
          style={styles.removeButton}
        >
          <IconButton icon='trash-outline' size={22} color={colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  subTotal: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Align remove button to the right
    marginLeft: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space between quantity and remove button
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 5, // Make it easier to tap
  },
});

export default CartItemCard;
