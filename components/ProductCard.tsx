import { useColorTheme } from '@/hooks/useColorTheme';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: any;
  };
  style?: ViewStyle;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, style }) => {
  const colors = useColorTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: 150,
          height: 180,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 5,
          marginRight: 10,
          borderRadius: 15,
          overflow: 'hidden',
          borderColor: colors['gray-500'],
          borderWidth: 1,
          shadowColor: colors['gray-900'],
          shadowOffset: {
            width: 0,
            height: 50,
          },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 5,
        },
        image: {
          width: '100%',
          height: '50%',
          objectFit: 'cover',
          borderRadius: 10,
        },
        title: {
          color: colors['gray-800'],
          fontSize: 16,
          fontFamily: 'Inter',
          fontWeight: '700',
          paddingLeft: 5,
        },
        subContainer: {
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          marginTop: 15,
        },
        price: {
          fontFamily: 'Inter',
          fontSize: 16,
          fontWeight: '700',
          color: colors['gray-800'],
        },
        button: {
          backgroundColor: colors['primary'],
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 10,
        },
        buttonIcon: {
          fontSize: 20,
          fontWeight: '600',
          color: colors['white'],
        },
      }),
    [colors]
  );

  return (
    <View style={[styles.container, style]}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <View style={styles.subContainer}>
        <Text style={styles.price}>{product.price}/kg</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;
