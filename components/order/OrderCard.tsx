import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'; // Import Image
import { Order, OrderItem } from '@/types/order'; // Import OrderItem
import { useColorTheme } from '@/hooks/useColorTheme';
import { formatPrice } from '@/utils/formatters';
import { useTransformImageUrl } from '@/hooks/useTransformImageUrl'; // Assuming you have this hook
import { OrderStatus } from '@/config/enums';

interface OrderCardProps {
  order: Order;
  onPress?: () => void; // Optional press handler to view details
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const colors = useColorTheme();

  function getStatusColor(status: OrderStatus, colors: any) {
    switch (status) {
      case OrderStatus.PENDING:
        return colors.warning;
      case OrderStatus.CONFIRMED:
        return colors.info;
      case OrderStatus.SHIPPED:
        return colors.primary;
      case OrderStatus.DELIVERED:
        return colors.primary;
      case OrderStatus.CANCELLED:
      case OrderStatus.RETURNED:
        return colors.red;
      default:
        return colors['gray-500'];
    }
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: colors['gray-200'], backgroundColor: colors.background },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={[styles.orderNumber, { color: colors['gray-900'] }]}>
          Order #{order.id.substring(0, 8)}
        </Text>
        <Text style={[styles.orderDate, { color: colors['gray-600'] }]}>
          {formattedDate}
        </Text>
      </View>

      <View
        style={[
          styles.itemsContainer,
          { borderBottomColor: colors['gray-100'] },
        ]}
      >
        <Text style={[styles.itemsTitle, { color: colors['gray-800'] }]}>
          Items:
        </Text>
        {order.OrderItems.map((item: OrderItem) => (
          <View key={item.id} style={styles.itemRow}>
            {item.Product?.image_url && (
              <Image
                source={{
                  uri:
                    useTransformImageUrl({
                      imageUrl: item.Product.image_url,
                    }) || 'https://via.placeholder.com/40',
                }}
                style={styles.itemImage}
                resizeMode='contain'
              />
            )}
            <View style={styles.itemDetails}>
              <Text
                style={[styles.itemName, { color: colors['gray-800'] }]}
                numberOfLines={1}
              >
                {item.Product?.name || 'Unknown Product'}
              </Text>
              <Text
                style={[styles.itemPriceQty, { color: colors['gray-600'] }]}
              >
                {formatPrice(item.price)} x {item.quantity}
              </Text>
            </View>
            <Text style={[styles.itemSubtotal, { color: colors['gray-900'] }]}>
              {formatPrice(item.sub_total)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={[styles.footerLabel, { color: colors['gray-700'] }]}>
            Total:
          </Text>
          <Text style={[styles.footerTotalPrice, { color: colors.primary }]}>
            {formatPrice(order.total_price)}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.footerLabel,
              { color: colors['gray-700'], textAlign: 'right' },
            ]}
          >
            Status:
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status, colors) },
            ]}
          >
            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#eee',
  },
  orderNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  orderDate: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  itemsContainer: {
    // New style for the items list section
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  itemsTitle: {
    // New style for the "Items:" title
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 10,
  },
  itemRow: {
    // New style for each individual item row
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space between item rows
    gap: 10, // Space between image, details, subtotal
  },
  itemImage: {
    // New style for item image
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  itemDetails: {
    // New style for item name and price/qty
    flex: 1, // Allow details to take available space
  },
  itemName: {
    // New style for item name
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  itemPriceQty: {
    // New style for price x quantity
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  itemSubtotal: {
    // New style for item subtotal
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    // New style for Total/Status labels in footer
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  footerTotalPrice: {
    // New style for Total price in footer
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    // alignSelf: 'flex-start', // Not needed here as it's in flex row
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    textTransform: 'uppercase',
  },
});
