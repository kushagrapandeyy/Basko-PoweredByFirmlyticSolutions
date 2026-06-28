import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function CartScreen() {
  const router = useRouter();
  const { cart, cartTotal, addToCart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.backBtn}>Close</Text></TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.back()}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={{width: 40}} />
      </View>
      
      <ScrollView style={styles.scroll}>
        <Text style={styles.deliveryInfo}>Delivery to Tower A in 10-15 mins</Text>
        
        {cart.map(item => (
          <View key={item.product.id} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>₹{item.product.price}</Text>
            </View>
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.product.id)}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.product)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Bill Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Total</Text>
            <Text style={styles.summaryValue}>₹{cartTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹20</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>To Pay</Text>
            <Text style={styles.summaryTotalValue}>₹{cartTotal + 20}</Text>
          </View>
        </View>
        <View style={{height: 100}} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { color: ROYAL_BLUE, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  headerTitle: { fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold', color: '#111827' },
  scroll: { padding: 20 },
  deliveryInfo: { backgroundColor: '#eff6ff', padding: 15, borderRadius: 12, color: ROYAL_BLUE, fontFamily: 'Inter_600SemiBold', marginBottom: 20, textAlign: 'center' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, color: '#111827', fontFamily: 'Inter_600SemiBold', marginBottom: 5 },
  itemPrice: { fontSize: 16, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, padding: 5 },
  qtyBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, color: ROYAL_BLUE, fontFamily: 'Inter_700Bold' },
  qtyValue: { width: 30, textAlign: 'center', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  summaryBox: { marginTop: 30, backgroundColor: '#f9fafb', padding: 20, borderRadius: 12 },
  summaryTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 15, color: '#111827' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#6b7280', fontFamily: 'Inter_400Regular' },
  summaryValue: { fontSize: 14, color: '#111827', fontFamily: 'Inter_600SemiBold' },
  summaryTotalRow: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 15, marginTop: 5 },
  summaryTotalLabel: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#111827' },
  summaryTotalValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: ROYAL_BLUE },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  checkoutBtn: { backgroundColor: ROYAL_BLUE, padding: 18, borderRadius: 12, alignItems: 'center' },
  checkoutBtnText: { color: WHITE, fontSize: 16, fontFamily: 'Inter_700Bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#6b7280', fontFamily: 'Inter_600SemiBold', marginBottom: 20 },
  shopBtn: { backgroundColor: ROYAL_BLUE, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  shopBtnText: { color: WHITE, fontSize: 16, fontFamily: 'Inter_700Bold' }
});
