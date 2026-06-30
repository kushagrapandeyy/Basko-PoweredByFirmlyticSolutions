import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, CURRENT_STORE_ID } from '@/constants/api';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function CreatePOScreen() {
  const router = useRouter();
  const { supplierId } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch supplier-specific products.
      // Here we fetch all store products as a mock catalog.
      const res = await fetch(`${API_BASE_URL}/inventory/products?storeId=${CURRENT_STORE_ID}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data.slice(0, 5)); // Just take a few for MVP
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const submitPO = async () => {
    const items = products
      .filter(p => quantities[p.id] > 0)
      .map(p => ({
        productId: p.id,
        quantity: quantities[p.id],
        purchasePrice: p.purchaseCost || p.sellingPrice * 0.8 // Mock purchase price
      }));

    if (items.length === 0) return alert('Add items to order');

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: CURRENT_STORE_ID,
          supplierId,
          expectedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          items,
          notes: 'Standard replenishment'
        })
      });
      if (res.ok) {
        alert('Purchase Order created!');
        router.back();
      } else {
        alert('Failed to create PO');
      }
    } catch (err) {
      alert('Error creating PO');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>New Purchase Order</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? <ActivityIndicator size="large" color={ROYAL_BLUE} /> : products.map(product => {
          const qty = quantities[product.id] || 0;
          return (
            <View key={product.id} style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>Cost: ₹{product.purchaseCost || (product.sellingPrice * 0.8).toFixed(2)}</Text>
              </View>
              <View style={styles.controls}>
                <TouchableOpacity style={styles.btn} onPress={() => updateQuantity(product.id, -1)}>
                  <Ionicons name="remove" size={20} color="#64748b" />
                </TouchableOpacity>
                <Text style={styles.qty}>{qty}</Text>
                <TouchableOpacity style={styles.btn} onPress={() => updateQuantity(product.id, 1)}>
                  <Ionicons name="add" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={submitPO} disabled={submitting}>
          {submitting ? <ActivityIndicator color={WHITE} /> : <Text style={styles.submitText}>Send Order</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: WHITE },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  scroll: { padding: 20 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: WHITE, padding: 15, borderRadius: 12, marginBottom: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#1e293b' },
  price: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#64748b', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  qty: { fontSize: 16, fontFamily: 'Inter_600SemiBold', minWidth: 20, textAlign: 'center' },
  footer: { padding: 20, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  submitBtn: { backgroundColor: ROYAL_BLUE, padding: 16, borderRadius: 12, alignItems: 'center' },
  submitText: { color: WHITE, fontSize: 16, fontFamily: 'Inter_700Bold' }
});
