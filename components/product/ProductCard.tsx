import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { Product } from '@/types/product';
import { useColorTheme } from '@/hooks/useColorTheme';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const colors = useColorTheme();
  const { id, price, name, discount_price, unit, is_featured, image_url } =
    product;

  // console.log('product', product);

  const imageUrl = useTransformImageUrl({ imageUrl: image_url });
  // console.log('imageUrl', imageUrl);

  const handlePress = () => {
    router.push(`/(product)/${id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={handlePress}
    >
      <Image
        source={{ uri: imageUrl }}
        // src={imageUrl}
        style={styles.image}
        resizeMode='cover'
      />
      <View style={styles.infoContainer}>
        <Text
          style={[styles.name, { color: colors['gray-800'] }]}
          numberOfLines={2}
        >
          {name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {price} ETB/{unit}
          </Text>
          {discount_price ? (
            <Text style={[styles.originalPrice, { color: colors['gray-500'] }]}>
              {discount_price} ETB/{unit}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 4, // For spacing in a 2-column layout
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden', // Ensures image corners are rounded if image is first child
    flex: 1, // For 2-column layout
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold', // Assuming you have these fonts
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  unit: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});

export default ProductCard;
