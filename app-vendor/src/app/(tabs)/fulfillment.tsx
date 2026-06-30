import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, CURRENT_STORE_ID } from '@/constants/api';
import Toast from 'react-native-toast-message';

const MINT_GREEN = '#10b981';
const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';
const ORANGE = '#f59e0b';

export default function FulfillmentScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const router = useRouter();
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders?storeId=${CURRENT_STORE_ID}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling for new orders
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fulfillment Hub</Text>
        <Text style={styles.subtitle}>Pick & Deliver hybrid workflow</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'ACTIVE' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('ACTIVE')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'ACTIVE' && styles.tabBtnTextActive]}>Active Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'COMPLETED' && styles.tabBtnActive]} 
            onPress={() => setActiveTab('COMPLETED')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'COMPLETED' && styles.tabBtnTextActive]}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
      >
        {orders.filter(o => activeTab === 'ACTIVE' ? !['DELIVERED', 'CANCELLED'].includes(o.status) : ['DELIVERED', 'CANCELLED'].includes(o.status)).length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#e2e8f0" />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} orders.</Text>
          </View>
        ) : (
          orders
            .filter(o => activeTab === 'ACTIVE' ? !['DELIVERED', 'CANCELLED'].includes(o.status) : ['DELIVERED', 'CANCELLED'].includes(o.status))
            .map(order => {
            return (
            <TouchableOpacity 
              key={order.id} 
              style={styles.card}
              onPress={() => router.push(`/order/${order.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>#{order.id.split('-')[0].toUpperCase()}</Text>
                  <Text style={styles.orderTime}>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                </View>
                <View style={styles.badgeContainer}>
                   {getStatusBadge(order.status)}
                   <Ionicons name="chevron-forward" size={20} color="#cbd5e1" style={{marginLeft: 10}} />
                </View>
              </View>
            </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const getStatusBadge = (status: string) => {
  let color = '#64748b';
  let bg = '#f1f5f9';
  let label = status;

  if (status === 'PAYMENT_PENDING') { color = '#f59e0b'; bg = '#fef3c7'; label = 'Pending'; }
  if (status === 'PAID') { color = ROYAL_BLUE; bg = '#dbeafe'; label = 'New Order'; }
  if (status === 'READY_FOR_PICKUP') { color = MINT_GREEN; bg = '#dcfce7'; label = 'Picked & Ready'; }
  if (status === 'OUT_FOR_DELIVERY') { color = ORANGE; bg = '#ffedd5'; label = 'Out for Delivery'; }
  if (status === 'DELIVERED') { color = '#16a34a'; bg = '#dcfce7'; label = 'Delivered'; }
  if (status === 'CANCELLED') { color = '#ef4444'; bg = '#fee2e2'; label = 'Cancelled'; }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, paddingTop: 40, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  title: { fontSize: 28, color: '#0f172a', fontFamily: 'PlayfairDisplay_700Bold' },
  subtitle: { fontSize: 14, color: '#64748b', fontFamily: 'Inter_400Regular', marginTop: 5 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginTop: 15 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: WHITE, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  tabBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#64748b' },
  tabBtnTextActive: { color: ROYAL_BLUE },
  list: { padding: 20 },
  emptyState: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#94a3b8', fontSize: 16, fontFamily: 'Inter_500Medium', marginTop: 15 },
  card: { backgroundColor: WHITE, padding: 20, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1e293b' },
  orderTime: { fontSize: 13, color: '#64748b', marginTop: 2 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  badgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' }
});
