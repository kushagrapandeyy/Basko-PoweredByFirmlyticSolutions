import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function OrderConfirmationScreen() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you might trigger a celebration animation here
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✓</Text>
        </View>
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Your groceries are being packed and will arrive in 10-15 minutes.</Text>
        
        <View style={styles.detailsCard}>
          <Text style={styles.detailsLabel}>Order ID</Text>
          <Text style={styles.detailsValue}>#ORD-8924</Text>
          <View style={styles.divider} />
          <Text style={styles.detailsLabel}>Total Amount</Text>
          <Text style={styles.detailsValue}>₹235.00</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.trackBtn} onPress={() => router.replace('/delivery-tracking')}>
          <Text style={styles.trackBtnText}>Track Delivery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  iconText: { fontSize: 40, color: '#16a34a', fontWeight: 'bold' },
  title: { fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold', color: '#111827', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular', color: '#6b7280', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  detailsCard: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 20, width: '100%', alignItems: 'center' },
  detailsLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6b7280', marginBottom: 5 },
  detailsValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#111827' },
  divider: { height: 1, backgroundColor: '#e5e7eb', width: '100%', marginVertical: 15 },
  footer: { padding: 20, paddingBottom: 40 },
  trackBtn: { backgroundColor: ROYAL_BLUE, padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  trackBtnText: { color: WHITE, fontSize: 16, fontFamily: 'Inter_700Bold' },
  homeBtn: { backgroundColor: '#f3f4f6', padding: 18, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: '#4b5563', fontSize: 16, fontFamily: 'Inter_700Bold' }
});
