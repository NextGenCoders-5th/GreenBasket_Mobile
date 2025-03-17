import React from 'react';
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
  return (
    <View style={[styles.container, style]}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <View style={styles.subContainer}>
        <Text style={styles.price}>{product.price}/kg</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 180,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 5,
    marginRight: 10,
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: 'gray',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '50%',
    objectFit: 'cover',
    borderRadius: 10,
  },
  title: {
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
    fontWeight: '600',
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});
