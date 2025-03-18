import React from 'react';
import { View, Text, TextInput, ScrollView, Image } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { sampleProducts } from '@/data/sampleData';
import ProductCard from '@/components/ProductCard';
import { useColorTheme } from '@/hooks/useColorTheme';

const HomeScreen = () => {
  const colors = useColorTheme();

  return (
    <ScrollView
      style={{
        display: 'flex',
        padding: 5,
        marginBottom: 10,
      }}
    >
      {/* Location and Search Bar */}
      <View
        style={{
          marginBottom: 10,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            gap: 5,
          }}
        >
          <MaterialCommunityIcons
            name='map-marker'
            size={24}
            color={colors.blue}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'SpaceMono',
              fontWeight: '500',
              color: colors['gray-600'],
            }}
          >
            Kebele 10, Poli
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
            gap: 5,
            borderRadius: 50,
            borderColor: colors['gray-600'],
            borderWidth: 2,
            backgroundColor: colors.white,
            margin: 5,
          }}
        >
          <AntDesign
            name='search1'
            size={22}
            color={colors['gray-600']}
            style={{ paddingLeft: 10 }}
          />
          <TextInput
            placeholder='Search...'
            style={{
              color: colors['gray-900'],
              flex: 1,
              padding: 15,
              borderRadius: 50,
              fontSize: 16,
            }}
          />
        </View>
      </View>

      {/* Banner */}
      {/* <View>
        <Image
          source={require('@/assets/images/products/vegetables.jpg')}
          style={{ width: 96, height: 96, borderRadius: 12 }}
        />
      </View> */}

      {/* Exclusive Offer */}
      <View
        style={{
          marginBottom: 15,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'Inter',
              fontSize: 22,
              fontWeight: '700',
              color: colors['gray-900'],
            }}
          >
            Exclusive Offer
          </Text>
          <Link href={'/explore'}>
            <Text
              style={{
                color: colors['primary-600'],
                textDecorationLine: 'underline',
                fontFamily: 'Inter',
                fontWeight: '500',
                fontSize: 16,
              }}
            >
              See all
            </Text>
          </Link>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollView>
      </View>

      {/* Best Selling */}
      <View
        style={{
          marginBottom: 15,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: 'Inter',
              fontSize: 22,
              fontWeight: '700',
              color: colors['gray-900'],
            }}
          >
            Best Selling
          </Text>
          <Link href={'/explore'}>
            <Text
              style={{
                color: colors['primary-500'],
                textDecorationLine: 'underline',
                fontFamily: 'Inter',
                fontWeight: '500',
                fontSize: 16,
              }}
            >
              See all
            </Text>
          </Link>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
