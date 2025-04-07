import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { sampleProducts } from '@/data/sampleData';
import TextButton from '@/components/TextButton';
import { useColorTheme } from '@/hooks/useColorTheme';
import { IconButton } from '@/components/IconButton';

export default function ProductScreen() {
  const colors = useColorTheme();
  const product = sampleProducts[0];

  const [showDetail, setShowDetail] = useState(true);
  const [showReview, setShowReview] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShowDetail = () => {
    setShowDetail(!showDetail);
  };

  const handleShowReview = () => {
    setShowReview(!showReview);
  };

  return (
    <View
      style={{
        display: 'flex',
        flex: 1,
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          backgroundColor: colors['gray-50'],
        }}
      >
        <Image
          source={product.image}
          style={{
            alignSelf: 'center',
            borderRadius: 10,
            width: '100%',
            height: 200,
            objectFit: 'cover',
          }}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 5,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter',
            display: 'flex',
            flexDirection: 'column',
            fontSize: 20,
            fontWeight: '700',
            color: colors['gray-900'],
          }}
        >
          {product.title}
        </Text>
        <IconButton
          onPress={() => {
            setIsFavorite(!isFavorite);
          }}
          color={isFavorite ? colors.notification : colors['gray-900']}
          icon={isFavorite ? 'heart' : 'heart-outline'}
          size={28}
        />
      </View>
      <Text
        style={{
          fontWeight: '500',
          fontSize: 16,
          paddingHorizontal: 5,
          color: colors['gray-900'],
        }}
      >
        price -{' '}
        <Text style={{ color: colors['gray-900'], fontWeight: '700' }}>
          {product.price}/kg
        </Text>
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <IconButton
            icon="remove"
            size={24}
            onPress={() => {}}
            style={{
              borderWidth: 2,
              borderColor: colors['primary-500'],
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors['gray-900'],
            }}
          >
            1
          </Text>
          <IconButton
            icon="add"
            onPress={() => {}}
            style={{
              borderWidth: 2,
              borderColor: colors['primary-500'],
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: colors['gray-900'],
          }}
        >
          $45.6
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 5,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: colors['gray-800'],
          }}
        >
          Product Detail
        </Text>
        {/* <Ionicons name='chevron-down' size={24} color='black' /> */}
        <IconButton
          icon={showDetail ? 'chevron-up' : 'chevron-down'}
          onPress={handleShowDetail}
          color={colors['gray-900']}
        />
      </View>
      {showDetail && (
        <Text
          style={{
            fontSize: 16,
            padding: 5,
            textAlign: 'justify',
            color: colors['gray-800'],
          }}
        >
          {product.description}
        </Text>
      )}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 5,
        }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: '700', color: colors['gray-800'] }}
        >
          Reviews
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors['gray-900'],
            }}
          >
            5.0
          </Text>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons key={i} name="star" size={20} color="yellow" />
          ))}
          <IconButton
            icon={showReview ? 'chevron-up' : 'chevron-down'}
            onPress={handleShowReview}
            color={colors['gray-900']}
          />
        </View>
      </View>
      {showReview && (
        <View
          style={{
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              paddingHorizontal: 5,
              textAlign: 'justify',
              color: colors['gray-800'],
            }}
          >
            Reviews
          </Text>
        </View>
      )}
      <TextButton title="Add to Cart" style={{}} onPress={() => {}} />
    </View>
  );
}
