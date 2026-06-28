import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

export default function DeliveryTrackingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Mock Map Area */}
      <View style={styles.mapArea}>
        <View style={styles.mapOverlay}>
          <Text style={styles.mapText}>Live Tracking Map</Text>
          <Text style={styles.mapSubText}>(Integration placeholder)</Text>
        </View>
        
        {/* Back button over map */}
        <TouchableOpacity style={styles.backBtnWrapper} onPress={() => router.replace('/')}>
          <View style={styles.backBtnCircle}>
            <Text style={styles.backBtnText}>×</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tracking Details */}
      <View style={styles.detailsSheet}>
        <Text style={styles.etaTitle}>Arriving in 12 mins</Text>
        <Text style={styles.etaSubtitle}>Your order is on the way</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressLine, styles.progressLineActive]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
        </View>
        
        <View style={styles.statusLabels}>
          <Text style={styles.statusTextActive}>Packed</Text>
          <Text style={[styles.statusTextActive, { textAlign: 'center' }]}>On the way</Text>
          <Text style={styles.statusText}>Delivered</Text>
        </View>

        <View style={styles.driverCard}>
          <View style={styles.driverAvatar} />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Ramesh Kumar</Text>
            <Text style={styles.driverVehicle}>MH 12 AB 1234 • Bike</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  mapArea: { flex: 1, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  mapOverlay: { backgroundColor: 'rgba(255,255,255,0.8)', padding: 20, borderRadius: 12, alignItems: 'center' },
  mapText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#374151' },
  mapSubText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6b7280', marginTop: 5 },
  backBtnWrapper: { position: 'absolute', top: 50, right: 20 },
  backBtnCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  backBtnText: { fontSize: 24, color: '#111827', marginTop: -2 },
  detailsSheet: { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10, marginTop: -20 },
  etaTitle: { fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', color: '#111827', marginBottom: 5 },
  etaSubtitle: { fontSize: 16, fontFamily: 'Inter_400Regular', color: '#6b7280', marginBottom: 30 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 10 },
  progressDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#e5e7eb' },
  progressDotActive: { backgroundColor: ROYAL_BLUE },
  progressLine: { flex: 1, height: 4, backgroundColor: '#e5e7eb', marginHorizontal: 5 },
  progressLineActive: { backgroundColor: ROYAL_BLUE },
  statusLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statusText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#9ca3af', width: 70 },
  statusTextActive: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: ROYAL_BLUE, width: 70 },
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', padding: 15, borderRadius: 12 },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#d1d5db', marginRight: 15 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#111827', marginBottom: 2 },
  driverVehicle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6b7280' },
  callBtn: { backgroundColor: '#eff6ff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  callBtnText: { color: ROYAL_BLUE, fontFamily: 'Inter_700Bold' }
});
