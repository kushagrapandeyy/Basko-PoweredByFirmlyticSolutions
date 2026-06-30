import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

import { API_BASE_URL, CURRENT_STORE_ID } from '../../constants/api';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

const CATEGORIES = ['Offers', 'Dairy & Eggs', 'Bakery', 'Snacks', 'Beverages', 'Cleaning'];

export default function HomeFeed() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, cartItemsCount, cartTotal } = useCart();
  
  const [products, setProducts] = useState<any[]>([]);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Animation value for the cart badge bounce
  const cartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fetch products
    fetch(`${API_BASE_URL}/inventory/products?storeId=${CURRENT_STORE_ID}`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.sellingPrice,
          time: '10 MINS',
          image: p.imageUrl || 'https://via.placeholder.com/300/f3f4f6/374151?text=Product',
          description: p.description
        }));
        setProducts(mapped);
      })
      .catch(err => console.error(err));

    // Fetch store details
    fetch(`${API_BASE_URL}/stores/${CURRENT_STORE_ID}`)
      .then(res => res.json())
      .then(data => {
        setStore(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    
    // Bounce Animation
    Animated.sequence([
      Animated.timing(cartScale, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.spring(cartScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
    ]).start();
  };

  const renderProduct = ({ item }: { item: any }) => {
    const cartItem = cart.find(c => c.product.id === item.id);
    const qty = cartItem ? cartItem.qty : 0;

    return (
      <TouchableOpacity style={styles.productCard} activeOpacity={0.9} onPress={() => router.push(`/product/${item.id}`)}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productTime}>{item.time}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          {qty > 0 ? (
            <View style={styles.qtyControls}>
              <TouchableOpacity style={styles.qtyBtn} onPress={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={(e) => { e.stopPropagation(); handleAddToCart(item); }}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={(e) => { e.stopPropagation(); handleAddToCart(item); }}>
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.deliveryTo}>Ordering from</Text>
          <Text style={styles.deliveryTime}>{store ? store.name : 'Local Store'}</Text>
        </View>
        <TouchableOpacity style={styles.cartIconContainer} onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={28} color="#111827" />
          {cartItemsCount > 0 && (
            <Animated.View style={[styles.cartBadge, { transform: [{ scale: cartScale }] }]}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.mainTitle}>Basko Store</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES.map((cat, idx) => (
          <TouchableOpacity key={idx} style={[styles.categoryBadge, idx === 0 && styles.categoryBadgeActive]}>
            <Text style={[styles.categoryText, idx === 0 && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Featured Items</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  listContent: { paddingBottom: 160 }, // Extra padding for the floating tab bar + sticky cart
  topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  deliveryTo: { fontSize: 16, color: ROYAL_BLUE, fontFamily: 'Inter_700Bold' },
  deliveryTime: { fontSize: 13, color: '#6b7280', marginTop: 2, fontFamily: 'Inter_400Regular' },
  cartIconContainer: { position: 'relative', padding: 5 },
  cartBadge: { position: 'absolute', top: -2, right: -5, backgroundColor: ROYAL_BLUE, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: WHITE },
  cartBadgeText: { color: WHITE, fontSize: 10, fontFamily: 'Inter_700Bold' },
  mainTitle: { fontSize: 36, paddingHorizontal: 20, color: '#111827', marginBottom: 20, fontFamily: 'PlayfairDisplay_700Bold' },
  categoryScroll: { paddingHorizontal: 20, marginBottom: 30 },
  categoryBadge: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f3f4f6', marginRight: 10 },
  categoryBadgeActive: { backgroundColor: ROYAL_BLUE },
  categoryText: { color: '#4b5563', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  categoryTextActive: { color: WHITE },
  sectionTitle: { fontSize: 20, paddingHorizontal: 20, marginBottom: 15, color: '#111827', fontFamily: 'Inter_700Bold' },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 15 },
  productCard: { width: '47%', marginBottom: 25 },
  productImage: { width: '100%', height: 160, borderRadius: 16, marginBottom: 12, backgroundColor: '#f3f4f6' },
  productTime: { fontSize: 11, color: ROYAL_BLUE, marginBottom: 4, fontFamily: 'Inter_700Bold' },
  productName: { fontSize: 14, color: '#111827', height: 40, marginBottom: 8, fontFamily: 'Inter_600SemiBold', lineHeight: 20 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, color: '#111827', fontFamily: 'Inter_700Bold' },
  addBtn: { backgroundColor: '#f3f4f6', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: ROYAL_BLUE, fontSize: 20, marginTop: -2, fontFamily: 'Inter_700Bold' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 18, paddingHorizontal: 4, height: 36 },
  qtyBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderRadius: 14, backgroundColor: WHITE },
  qtyBtnText: { color: ROYAL_BLUE, fontSize: 18, marginTop: -2, fontFamily: 'Inter_700Bold' },
  qtyText: { marginHorizontal: 8, fontSize: 14, fontFamily: 'Inter_700Bold', color: '#111827' },
});
