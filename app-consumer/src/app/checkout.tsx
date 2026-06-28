import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'CASH'>('UPI');

  const handlePayment = () => {
    // In a real app, this integrates with Razorpay/Stripe
    setTimeout(() => {
      clearCart();
      router.replace('/order-confirmation');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>← Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{width: 50}} />
      </View>
      
      <ScrollView style={styles.scroll}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.card}>
          <Text style={styles.addressTitle}>Tower A, Flat 402</Text>
          <Text style={styles.addressSub}>Sunshine Residences, Sector 45</Text>
          <Text style={styles.addressSub}>+91 98765 43210</Text>
        </View>

        <Text style={styles.sectionTitle}>Delivery Instructions</Text>
        <TextInput 
          style={styles.instructionInput} 
          placeholder="e.g., Leave at the door" 
          placeholderTextColor="#9ca3af"
          multiline
        />

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'UPI' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('UPI')}
          >
            <Text style={[styles.paymentText, paymentMethod === 'UPI' && styles.paymentTextActive]}>UPI (GPay, PhonePe)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'CARD' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('CARD')}
          >
            <Text style={[styles.paymentText, paymentMethod === 'CARD' && styles.paymentTextActive]}>Credit / Debit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'CASH' && styles.paymentOptionActive, { borderBottomWidth: 0 }]}
            onPress={() => setPaymentMethod('CASH')}
          >
            <Text style={[styles.paymentText, paymentMethod === 'CASH' && styles.paymentTextActive]}>Cash on Delivery</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 120}} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payBtnText}>Pay ₹{cartTotal + 20}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { color: ROYAL_BLUE, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  headerTitle: { fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold', color: '#111827' },
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#374151', marginBottom: 10, marginTop: 10 },
  card: { backgroundColor: WHITE, borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  addressTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#111827', marginBottom: 5 },
  addressSub: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6b7280', marginBottom: 2 },
  instructionInput: { backgroundColor: WHITE, borderRadius: 12, padding: 15, fontSize: 14, fontFamily: 'Inter_400Regular', color: '#111827', minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  paymentOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  paymentOptionActive: { backgroundColor: '#eff6ff', borderRadius: 8, paddingHorizontal: 10 },
  paymentText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#4b5563' },
  paymentTextActive: { color: ROYAL_BLUE },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  payBtn: { backgroundColor: ROYAL_BLUE, padding: 18, borderRadius: 12, alignItems: 'center' },
  payBtnText: { color: WHITE, fontSize: 18, fontFamily: 'Inter_700Bold' }
});
