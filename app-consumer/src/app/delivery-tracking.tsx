import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Dimensions, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL, CURRENT_CUSTOMER_ID } from '@/constants/api';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing, withSequence } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const MINT_GREEN = '#10b981';
const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function DeliveryTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activeOrderId = params.orderId || "mock-order-123";

  const [order, setOrder] = useState<any>(null);
  const driverPosition = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const fetchChatMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${activeOrderId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${activeOrderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: CURRENT_CUSTOMER_ID, text: chatInput.trim() })
      });
      if (res.ok) {
        setChatInput('');
        fetchChatMessages();
      }
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Fetch order initially and start polling
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${activeOrderId}`);
        if (res.ok) setOrder(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);

    driverPosition.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (order?.status === 'DELIVERED') {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
      setTimeout(() => {
        setRatingModalVisible(true);
      }, 1500); // Small delay before rating pops up
    }
  }, [order?.status]);

  const animatedDriverStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: driverPosition.value * 150 },
        { translateY: driverPosition.value * -50 }
      ]
    };
  });

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
    opacity: pulseAnim.value === 1 ? 1 : 0.6
  }));

  return (
    <View style={styles.container}>
      {/* Background Map - Fixed Position */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://i.imgur.com/QkRIfHh.png' }} 
          style={styles.mockMap} 
          resizeMode="cover"
        />
        
        <View style={[styles.pin, styles.storePin]}>
          <Ionicons name="storefront" size={20} color={WHITE} />
        </View>

        <View style={[styles.pin, styles.customerPin]}>
          <Ionicons name="home" size={20} color={WHITE} />
        </View>

        {order?.status !== 'DELIVERED' && (
          <Animated.View style={[styles.driverPinContainer, animatedDriverStyle]}>
            <View style={styles.driverPin}>
              <Ionicons name="bicycle" size={24} color={WHITE} />
            </View>
          </Animated.View>
        )}

        {order?.status === 'DELIVERED' && (
          <Animated.View style={[styles.pin, styles.customerPin, pulseStyle]}>
            <Ionicons name="checkmark-done" size={24} color={WHITE} />
          </Animated.View>
        )}
      </View>

      {/* Header Overlay (Fixed) */}
      <SafeAreaView style={styles.headerOverlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        {order?.status !== 'DELIVERED' && (
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>12 min</Text>
          </View>
        )}
      </SafeAreaView>

      {/* Expandable Scroll View */}
      <ScrollView 
        style={StyleSheet.absoluteFill} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Transparent Spacer to show the map */}
        <View style={styles.scrollSpacer} pointerEvents="none" />
        
        {/* White Details Card that scrolls UP */}
        <View style={styles.detailsCard}>
          {/* Handle Bar */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>
              {order?.status === 'DELIVERED' ? 'Order Delivered!' : (order?.status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Preparing Order')}
            </Text>
            {order?.status !== 'DELIVERED' && <Text style={styles.statusTime}>Arriving at 10:45 AM</Text>}
          </View>
          
          <View style={styles.driverInfo}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=33' }} style={styles.driverAvatar} />
            <View style={styles.driverText}>
              <Text style={styles.driverName}>Vikram Singh</Text>
              <Text style={styles.driverRating}>★ 4.9 (120+ deliveries)</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color={WHITE} />
            </TouchableOpacity>
          </View>

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <TouchableOpacity style={styles.helpBtn} onPress={() => { setChatModalVisible(true); fetchChatMessages(); }}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1e293b" />
              <Text style={styles.helpBtnText}>Chat with Store / Driver</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Picked</Text>
              <Text style={styles.progressLabel}>On the way</Text>
              <Text style={styles.progressLabel}>Delivered</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.otpBanner}>
            <View style={{flex: 1}}>
              <Text style={styles.otpTitle}>Delivery OTP</Text>
              <Text style={styles.otpSub}>Share this code with the driver to receive your order.</Text>
            </View>
            <View style={styles.otpBox}>
              <Text style={styles.otpCode}>3210</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Order Details */}
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.orderItem}>
            <View style={styles.qtyBadge}><Text style={styles.qtyBadgeText}>1</Text></View>
            <Text style={styles.itemName}>Amul Taaza Milk 1L</Text>
            <Text style={styles.itemPrice}>₹68</Text>
          </View>
          <View style={styles.orderItem}>
            <View style={styles.qtyBadge}><Text style={styles.qtyBadgeText}>2</Text></View>
            <Text style={styles.itemName}>Maggi 2-Minute Noodles</Text>
            <Text style={styles.itemPrice}>₹28</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹96</Text>
          </View>

          <View style={styles.divider} />

          {/* Payment Method */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethod}>
            <Ionicons name="checkmark-circle" size={24} color={MINT_GREEN} style={{marginRight: 10}} />
            <Text style={styles.paymentText}>Paid via UPI</Text>
          </View>

          <View style={styles.divider} />

          {/* Ads & Deals Banner */}
          <Text style={styles.sectionTitle}>Special Offers for You</Text>
          <TouchableOpacity style={styles.adBanner} activeOpacity={0.9}>
            <View style={styles.adContent}>
              <Text style={styles.adTitle}>Get 50% OFF!</Text>
              <Text style={styles.adSubtitle}>On your next grocery order.</Text>
            </View>
            <Image source={{uri: 'https://via.placeholder.com/150/fbbf24/b45309?text=Deal'}} style={styles.adImage} />
          </TouchableOpacity>

          {/* Padding at the bottom for scroll clearance */}
          <View style={{height: 100}} />
        </View>
      </ScrollView>

      {/* Chat Modal */}
      <Modal visible={chatModalVisible} animationType="slide">
        <SafeAreaView style={styles.chatModalContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat with Store</Text>
            <TouchableOpacity onPress={() => setChatModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.chatArea}>
            {chatMessages.map(msg => {
              const isMe = msg.senderId === CURRENT_CUSTOMER_ID;
              return (
                <View key={msg.id} style={[styles.msgBubble, isMe ? styles.msgMe : styles.msgThem]}>
                  <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextThem]}>{msg.text}</Text>
                  <Text style={styles.msgTime}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.chatInputArea}>
            <TextInput 
              style={styles.chatInput} 
              placeholder="Type a message..." 
              value={chatInput} 
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.chatSendBtn} onPress={sendMessage}>
              <Ionicons name="send" size={20} color={WHITE} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Rating Modal */}
      <Modal visible={ratingModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.ratingIconCircle}>
              <Ionicons name="star" size={32} color="#f59e0b" />
            </View>
            <Text style={styles.modalTitle}>Rate Delivery</Text>
            <Text style={styles.modalSub}>How was your experience with Vikram?</Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                  <Ionicons 
                    name={star <= selectedRating ? "star" : "star-outline"} 
                    size={36} 
                    color={star <= selectedRating ? "#f59e0b" : "#cbd5e1"} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => {
                setRatingModalVisible(false);
                router.replace('/');
              }}>
                <Text style={styles.modalBtnCancelText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtnConfirm, selectedRating === 0 && { opacity: 0.5 }]} 
                disabled={selectedRating === 0}
                onPress={() => {
                  setRatingModalVisible(false);
                  router.replace('/');
                }}
              >
                <Text style={styles.modalBtnConfirmText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  mapContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.5 },
  mockMap: { width: '100%', height: '100%', opacity: 0.8 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 20, zIndex: 10 },
  backBtn: { backgroundColor: WHITE, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  etaBadge: { backgroundColor: '#1e293b', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, justifyContent: 'center' },
  etaText: { color: WHITE, fontFamily: 'Inter_700Bold', fontSize: 16 },
  pin: { position: 'absolute', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  storePin: { backgroundColor: ROYAL_BLUE, top: '40%', left: '20%' },
  customerPin: { backgroundColor: MINT_GREEN, top: '25%', right: '20%' },
  driverPinContainer: { position: 'absolute', top: '40%', left: '20%' },
  driverPin: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  
  scrollSpacer: { height: height * 0.4 }, // Expose the map
  detailsCard: { backgroundColor: WHITE, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 15, minHeight: height * 0.7 },
  handleBarContainer: { alignItems: 'center', marginBottom: 20, marginTop: -10 },
  handleBar: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#cbd5e1' },
  
  statusHeader: { marginBottom: 20 },
  statusTitle: { fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', color: '#0f172a' },
  statusTime: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#64748b', marginTop: 4 },
  
  driverInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 15, borderRadius: 16, marginBottom: 25 },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  driverText: { flex: 1 },
  driverName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#1e293b' },
  driverRating: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748b', marginTop: 2 },
  callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: MINT_GREEN, justifyContent: 'center', alignItems: 'center' },
  
  helpSection: { marginBottom: 25 },
  helpTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#64748b', marginBottom: 8 },
  helpBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12 },
  helpBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#1e293b' },

  progressContainer: { marginBottom: 20 },
  progressTrack: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: MINT_GREEN, borderRadius: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#64748b' },

  otpBanner: { flexDirection: 'row', backgroundColor: '#eff6ff', padding: 20, borderRadius: 16, alignItems: 'center' },
  otpTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: ROYAL_BLUE, marginBottom: 4 },
  otpSub: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#3b82f6', paddingRight: 20 },
  otpBox: { backgroundColor: WHITE, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, shadowColor: ROYAL_BLUE, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  otpCode: { fontSize: 22, fontFamily: 'Inter_700Bold', color: ROYAL_BLUE, letterSpacing: 2 },

  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 20 },
  
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#1e293b', marginBottom: 15 },
  
  orderItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  qtyBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  qtyBadgeText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#64748b' },
  itemName: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: '#334155' },
  itemPrice: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1e293b' },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  totalLabel: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#1e293b' },
  totalValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  
  paymentMethod: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 15, borderRadius: 12 },
  paymentText: { fontSize: 15, fontFamily: 'Inter_500Medium', color: '#334155' },

  adBanner: { flexDirection: 'row', backgroundColor: '#fef3c7', borderRadius: 16, padding: 20, alignItems: 'center', overflow: 'hidden' },
  adContent: { flex: 1, marginRight: 15 },
  adTitle: { fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold', color: '#b45309', marginBottom: 5 },
  adSubtitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#92400e', lineHeight: 18 },

  chatModalContainer: { flex: 1, backgroundColor: '#f8fafc' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  chatTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#0f172a' },
  chatArea: { flex: 1, padding: 15 },
  msgBubble: { padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 10 },
  msgMe: { backgroundColor: ROYAL_BLUE, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  msgThem: { backgroundColor: WHITE, alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  msgText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  msgTextMe: { color: WHITE },
  msgTextThem: { color: '#334155' },
  msgTime: { fontSize: 10, fontFamily: 'Inter_500Medium', color: '#94a3b8', marginTop: 4, alignSelf: 'flex-end' },
  chatInputArea: { flexDirection: 'row', padding: 15, backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center', gap: 10 },
  chatInput: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12, fontSize: 14, fontFamily: 'Inter_400Regular' },
  chatSendBtn: { backgroundColor: ROYAL_BLUE, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: WHITE, borderRadius: 24, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  ratingIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#0f172a', marginBottom: 10, textAlign: 'center' },
  modalSub: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#64748b', marginBottom: 25, textAlign: 'center' },
  starsContainer: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  modalActions: { flexDirection: 'row', gap: 15, width: '100%' },
  modalBtnCancel: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center' },
  modalBtnCancelText: { color: '#64748b', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  modalBtnConfirm: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: MINT_GREEN, alignItems: 'center' },
  modalBtnConfirmText: { color: WHITE, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
});
