import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../constants/api';
import { Ionicons } from '@expo/vector-icons';

const CURRENT_CUSTOMER_ID = 'de283b71-1972-47b7-996f-6633d0f7b7f5'; // Mock User
const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // In a real app we'd fetch by customerId, but here we can just fetch all orders and filter or assume this is their view
      // Let's assume the endpoint /orders?customerId=... exists or just /orders
      const res = await fetch(`${API_BASE_URL}/orders`);
      const data = await res.json();
      const myOrders = Array.isArray(data) ? data.filter(o => o.customerId === CURRENT_CUSTOMER_ID) : [];
      setOrders(myOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'DELIVERED') return '#10b981';
    if (status === 'CANCELLED') return '#ef4444';
    return ROYAL_BLUE;
  };

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      onPress={() => router.push(`/tracking/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Order #{item.id.split('-')[0].toUpperCase()}</Text>
        <Text style={[styles.statusBadge, { color: getStatusColor(item.status), backgroundColor: getStatusColor(item.status) + '1A' }]}>
          {item.status.replace(/_/g, ' ')}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.itemCount}>{item.items?.length || 0} items</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.total}>₹{item.totalAmount}</Text>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No orders found.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, paddingTop: 40, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  title: { fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold', color: '#111827' },
  list: { padding: 20 },
  orderCard: { backgroundColor: WHITE, borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  orderId: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#111827' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontFamily: 'Inter_700Bold' },
  cardBody: { marginBottom: 15 },
  itemCount: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#4b5563', marginBottom: 4 },
  date: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6b7280' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 15 },
  total: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#111827' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_500Medium', color: '#9ca3af', marginTop: 15 }
});
