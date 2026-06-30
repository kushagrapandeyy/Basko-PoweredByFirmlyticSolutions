import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, CURRENT_STORE_ID } from '@/constants/api';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function PoDashboardScreen() {
  const router = useRouter();
  const [pos, setPos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-orders/store/${CURRENT_STORE_ID}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const receiveGoods = async (po: any) => {
    if (po.status !== 'ACCEPTED') return alert('PO must be ACCEPTED to receive goods');
    
    // In a real app, this goes to a GRN scanner/input screen.
    // Here we auto-receive full quantities as MVP
    const receivedItems = po.items.map((i: any) => ({
      poItemId: i.id,
      receivedQuantity: i.quantity // Receive all
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/purchase-orders/${po.id}/grn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: 'staff-1', receivedItems })
      });
      if (res.ok) {
        alert('Goods received successfully!');
        fetchPOs(); // refresh
      } else {
        alert('Failed to receive goods');
      }
    } catch (err) {
      alert('Error receiving goods');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Purchase Orders</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? <ActivityIndicator size="large" color={ROYAL_BLUE} /> : pos.map(po => (
          <View key={po.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.supplierName}>{po.supplier?.name || 'Unknown Supplier'}</Text>
              <View style={[styles.statusBadge, styles[`status${po.status}`] || styles.statusDefault]}>
                <Text style={styles.statusText}>{po.status}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.text}>Total: ₹{po.totalAmount}</Text>
              <Text style={styles.text}>Expected: {new Date(po.expectedDeliveryDate).toLocaleDateString()}</Text>
              <Text style={styles.text}>Items: {po.items?.length || 0}</Text>
            </View>
            
            {po.status === 'ACCEPTED' && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => receiveGoods(po)}>
                <Ionicons name="cube-outline" size={18} color={WHITE} />
                <Text style={styles.actionBtnText}>Receive Goods</Text>
              </TouchableOpacity>
            )}
            {po.status === 'CREATED' && (
              <View style={styles.waitingBtn}>
                <Text style={styles.waitingText}>Waiting for Supplier</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles: any = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: WHITE },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  scroll: { padding: 20 },
  card: { backgroundColor: WHITE, padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  supplierName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1e293b' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusCREATED: { backgroundColor: '#e2e8f0' },
  statusACCEPTED: { backgroundColor: '#dcfce7' },
  statusDELIVERED: { backgroundColor: '#dbeafe' },
  statusDefault: { backgroundColor: '#fef3c7' },
  statusText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#475569' },
  cardBody: { marginBottom: 15 },
  text: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#64748b', marginBottom: 2 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: ROYAL_BLUE, paddingVertical: 10, borderRadius: 8 },
  actionBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: WHITE },
  waitingBtn: { alignItems: 'center', paddingVertical: 10, borderRadius: 8, backgroundColor: '#f1f5f9' },
  waitingText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#64748b' }
});
