// import { useColorTheme } from '@/hooks/useColorTheme';
// import { shadows } from '@/styles/shadows';
// import { Link } from 'expo-router';
// import React, { useMemo } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ViewStyle,
//   Platform,
// } from 'react-native';

// interface ProductCardProps {
//   product: {
//     id: string;
//     title: string;
//     price: string;
//     image: any;
//   };
//   style?: ViewStyle;
// }

// const ProductCardV1: React.FC<ProductCardProps> = ({ product, style }) => {
//   const colors = useColorTheme();

//   return (
//     <View
//       style={{
//         ...styles.container,
//         borderColor: colors['gray-500'],
//         shadowColor: colors['gray-900'],
//         backgroundColor: colors['gray-50'],
//         ...style,
//       }}
//     >
//       <View
//         style={{
//           width: '100%',
//           height: '50%',
//         }}
//       >
//         <Image source={product.image} style={styles.image} />
//         <Link href={'/(product)/33'} asChild>
//           <Text style={{ ...styles.title, color: colors['gray-800'] }}>
//             {product.title}
//           </Text>
//         </Link>
//       </View>
//       <View style={styles.subContainer}>
//         <Text style={{ ...styles.price, color: colors['gray-800'] }}>
//           {product.price}/kg
//         </Text>
//         <TouchableOpacity
//           style={{ ...styles.button, backgroundColor: colors['primary'] }}
//         >
//           <Text style={{ ...styles.buttonIcon, color: colors['white'] }}>
//             +
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default ProductCardV1;

// const styles = StyleSheet.create({
//   container: {
//     width: 150,
//     height: 180,
//     display: 'flex',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     paddingBottom: 5,
//     gap: 5,
//     marginRight: 10,
//     borderRadius: 10,
//     borderWidth: 1,

//     ...Platform.select({
//       android: {
//         // elevation: 5,
//         boxShadow: shadows['shadow-2'],
//       },
//       ios: {
//         shadowOffset: {
//           width: 0,
//           height: 5,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 5,
//       },
//     }),
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover',
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 16,
//     fontFamily: 'Inter',
//     fontWeight: '700',
//     paddingLeft: 5,
//   },
//   subContainer: {
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 5,
//   },
//   price: {
//     fontFamily: 'Inter',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   button: {
//     width: 30,
//     height: 30,
//     borderRadius: 10,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonIcon: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
// });
