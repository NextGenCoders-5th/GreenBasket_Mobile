// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   SafeAreaView,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import React, { useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';

// import { useColorTheme } from '@/hooks/useColorTheme';
// import { IconButton } from '@/components/ui/IconButton';
// import { useLocalSearchParams } from 'expo-router';
// import { useGetProductByIdQuery } from '@/redux/api/productApi';
// import ErrorMessage from '@/components/ui/ErrorMessage';
// import { Stack } from 'expo-router';
// import Button from '@/components/ui/Button';
// import { useTransformImageUrl } from '@/hooks/useTransformImageUrl';

// export default function ProductDetailScreenV1() {
//   const colors = useColorTheme();

//   const [showDetail, setShowDetail] = useState(true);
//   const [showReview, setShowReview] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const { id } = useLocalSearchParams<{ id: string }>();

//   // Fetch product details
//   const {
//     data: productDetailResponse,
//     error,
//     isLoading,
//   } = useGetProductByIdQuery(id!, {
//     skip: !id, // Skip query if id is not yet available
//   });

//   const product = productDetailResponse?.data?.data;

//   const handleShowDetail = () => {
//     setShowDetail(!showDetail);
//   };

//   const handleShowReview = () => {
//     setShowReview(!showReview);
//   };

//   if (isLoading || !id) {
//     return (
//       <View style={[styles.centered, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size='large' color={colors.primary} />
//       </View>
//     );
//   }

//   const { name, image_url, price, unit, description, discount_price } =
//     product!;

//   const imageUrl = useTransformImageUrl({ imageUrl: image_url });
//   console.log('imageUrl', imageUrl);

//   if (error) {
//     const errorMessage =
//       (error as any)?.data?.message || 'Failed to load product details.';
//     return (
//       <View style={[styles.centered, { backgroundColor: colors.background }]}>
//         <ErrorMessage message={errorMessage} />
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={[styles.centered, { backgroundColor: colors.background }]}>
//         <Text style={{ color: colors['gray-700'] }}>Product not found.</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//       }}
//     >
//       <Stack.Screen options={{ title: name, headerBackTitle: 'Back' }} />
//       <ScrollView
//         style={{
//           display: 'flex',
//           flex: 1,
//           gap: 10,
//           paddingHorizontal: 10,
//           paddingVertical: 5,
//           backgroundColor: colors.background,
//         }}
//       >
//         <Image
//           source={{ uri: imageUrl }}
//           style={{
//             alignSelf: 'center',
//             borderRadius: 10,
//             width: '100%',
//             height: 300,
//             marginBottom: 20,
//             objectFit: 'cover',
//           }}
//         />
//         <View
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}
//         >
//           <Text
//             style={{
//               fontFamily: 'Inter',
//               display: 'flex',
//               flexDirection: 'column',
//               fontSize: 20,
//               fontWeight: '700',
//               color: colors['gray-900'],
//               marginVertical: 10,
//             }}
//           >
//             {name}
//           </Text>
//           <IconButton
//             onPress={() => {
//               setIsFavorite(!isFavorite);
//             }}
//             color={isFavorite ? colors.notification : colors['gray-900']}
//             icon={isFavorite ? 'heart' : 'heart-outline'}
//             size={28}
//           />
//         </View>
//         <View
//           style={{
//             gap: 15,
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginBottom: 15,
//           }}
//         >
//           <Text
//             style={{
//               fontWeight: '800',
//               fontSize: 18,
//               paddingVertical: 5,
//               color: colors['primary'],
//             }}
//           >
//             {price} ETB / {unit}
//           </Text>
//           {discount_price ? (
//             <Text
//               style={{
//                 fontSize: 16,
//                 textDecorationLine: 'line-through',
//                 color: colors['gray-700'],
//               }}
//             >
//               {discount_price} ETB /{unit}
//             </Text>
//           ) : null}
//         </View>
//         <View
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: 10,
//           }}
//         >
//           <View
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 20,
//               marginBottom: 20,
//             }}
//           >
//             <IconButton
//               icon='remove'
//               size={24}
//               onPress={() => {}}
//               style={{
//                 borderWidth: 2,
//                 borderColor: colors['primary-500'],
//               }}
//             />
//             <Text
//               style={{
//                 fontSize: 18,
//                 fontWeight: '700',
//                 color: colors['gray-900'],
//               }}
//             >
//               1
//             </Text>
//             <IconButton
//               icon='add'
//               onPress={() => {}}
//               style={{
//                 borderWidth: 2,
//                 borderColor: colors['primary-500'],
//               }}
//             />
//           </View>
//           <Text
//             style={{
//               fontSize: 20,
//               fontWeight: '700',
//               color: colors['gray-900'],
//             }}
//           >
//             $45.6
//           </Text>
//         </View>
//         <View
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             paddingHorizontal: 5,
//             // marginBottom: 25,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 18,
//               fontWeight: '700',
//               color: colors['gray-800'],
//             }}
//           >
//             Description
//           </Text>
//           {/* <Ionicons name='chevron-down' size={24} color='black' /> */}
//           <IconButton
//             icon={showDetail ? 'chevron-up' : 'chevron-down'}
//             onPress={handleShowDetail}
//             color={colors['gray-900']}
//           />
//         </View>
//         {showDetail && (
//           <Text
//             style={{
//               fontSize: 16,
//               padding: 5,
//               textAlign: 'justify',
//               color: colors['gray-800'],
//               marginBottom: 30,
//             }}
//           >
//             {description}
//           </Text>
//         )}
//         <View
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             padding: 5,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 18,
//               fontWeight: '700',
//               color: colors['gray-800'],
//             }}
//           >
//             Reviews
//           </Text>
//           <View
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 5,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 16,
//                 fontWeight: '600',
//                 color: colors['gray-900'],
//               }}
//             >
//               5.0
//             </Text>
//             {[1, 2, 3, 4, 5].map((i) => (
//               <Ionicons key={i} name='star' size={20} color='yellow' />
//             ))}
//             <IconButton
//               icon={showReview ? 'chevron-up' : 'chevron-down'}
//               onPress={handleShowReview}
//               color={colors['gray-900']}
//             />
//           </View>
//         </View>
//         {showReview && (
//           <View
//             style={{
//               marginBottom: 30,
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 16,
//                 paddingHorizontal: 5,
//                 textAlign: 'justify',
//                 color: colors['gray-800'],
//                 marginBottom: 20,
//               }}
//             >
//               absolutely good product with good price
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//       <View style={{ padding: 10, marginBottom: 5 }}>
//         <Button
//           icon='cart-outline'
//           title='Add to Cart'
//           style={{}}
//           onPress={() => {}}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   centered: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//   },
// });
