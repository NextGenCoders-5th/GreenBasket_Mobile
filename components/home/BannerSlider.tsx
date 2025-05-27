// components/home/BannerSlider.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Swiper from 'react-native-swiper';

import { useColorTheme } from '@/hooks/useColorTheme';

const { width: screenWidth } = Dimensions.get('window');
const SWIPER_HEIGHT = 200;

export interface Slide {
  id: string;
  backgroundColor?: string;
  title: string;
  subtitle: string;
  textColor?: string;
  imageUrl?: string;
}

interface BannerSliderProps {
  slides: Slide[];
  height?: number;
  autoplay?: boolean;
  autoplayTimeout?: number;
  showsPagination?: boolean;
  dotColor?: string;
  activeDotColor?: string;
  loop?: boolean;
}

export default function BannerSlider({
  slides,
  height = SWIPER_HEIGHT,
  autoplay = true,
  autoplayTimeout = 5,
  showsPagination = true,
  dotColor,
  activeDotColor,
  loop = true,
}: BannerSliderProps) {
  const colors = useColorTheme();

  return (
    <View style={[styles.swiperContainer, { height: height }]}>
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        autoplay={autoplay}
        autoplayTimeout={autoplayTimeout}
        dotColor={dotColor || colors['gray-300']}
        activeDotColor={activeDotColor || colors.primary}
        paginationStyle={styles.paginationStyle}
        loop={loop}
      >
        {slides.map((slide) => (
          <View
            key={slide.id}
            style={[
              styles.slide,
              { backgroundColor: slide.backgroundColor || 'transparent' },
            ]}
          >
            {/* Render Image if imageUrl is provided */}
            {slide.imageUrl ? (
              <Image
                source={{ uri: slide.imageUrl }}
                style={styles.slideImage}
                resizeMode='cover'
              />
            ) : (
              <View style={styles.slideContent}>
                {/* Added inner view for text centering */}
                {slide.title && (
                  <Text
                    style={[
                      styles.slideTitle,
                      { color: slide.textColor || colors['gray-900'] },
                    ]}
                  >
                    {slide.title}
                  </Text>
                )}
                {slide.subtitle && (
                  <Text
                    style={[
                      styles.slideSubtitle,
                      { color: slide.textColor || colors['gray-700'] },
                    ]}
                  >
                    {slide.subtitle}
                  </Text>
                )}
              </View>
            )}
            {/* If you want text *over* an image, you'd need different absolute positioning */}
          </View>
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  swiperContainer: {
    // Height is set dynamically by prop
    marginBottom: 20, // Space below the swiper
  },
  wrapper: {
    // No specific style needed here usually
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 15,
  },
  slideContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    // Style for slide image
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  slideTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 10,
  },
  slideSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingHorizontal: 10,
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: -1, height: 1 },
    // textShadowRadius: 10,
  },
  paginationStyle: {
    bottom: 10,
  },
});
