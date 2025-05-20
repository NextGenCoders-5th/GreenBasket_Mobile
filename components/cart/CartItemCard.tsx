import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { useColorTheme } from '@/hooks/useColorTheme';
import { formatPrice } from '@/utils/formatters';
import { IconButton } from '@/components/ui/IconButton';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';

interface CartItemCardProps {
  item: CartItem;
  onIncreaseQuantity: (itemId: string) => void;
  onDecreaseQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  isUpdating?: boolean; // Optional: to show loading on specific item
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
  isUpdating,
}) => {
  const colors = useColorTheme();
  const productDetails = item.Product as Product | undefined; // Changed from item.product

  const imageUrl = useTransformImageUrl({
    imageUrl: productDetails?.image_url,
  });

  if (!productDetails) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors['gray-50'],
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text
          style={{ fontFamily: 'Inter-Regular', color: colors['gray-600'] }}
        >
          Product details unavailable
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background, opacity: isUpdating ? 0.6 : 1 },
      ]}
    >
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
            disabled={item.quantity <= 1 || isUpdating}
          />
          <Text style={[styles.quantityText, { color: colors['gray-900'] }]}>
            {item.quantity}
          </Text>
          <IconButton
            icon='add-circle-outline'
            size={26}
            color={colors.primary}
            onPress={() => onIncreaseQuantity(item.id)}
            disabled={
              isUpdating ||
              (productDetails.stock !== undefined &&
                item.quantity >= productDetails.stock)
            }
          />
        </View>

        <IconButton
          icon='trash-outline'
          size={22}
          color={colors.red}
          onPress={() => onRemoveItem(item.id)}
          style={styles.removeButton}
          disabled={isUpdating}
        />
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
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    padding: 5,
  },
});

export default CartItemCard;
