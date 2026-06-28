import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, TextInput } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

const ROYAL_BLUE = '#1D4ED8';
const WHITE = '#FFFFFF';

// Helper to determine if we have a wide screen (tablet)
const isTablet = Dimensions.get('window').width > 600;

export default function VendorApp() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [mode, setMode] = useState<'POS' | 'SCANNER'>('POS');
  
  // Scanner State
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  // POS State
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    if (mode === 'SCANNER') {
      const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      };
      getCameraPermissions();
    }
  }, [mode]);

  if (!fontsLoaded) return null;

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setLastScanned(data);
    alert(`Scanned: ${data}. Sent to inventory!`);
  };

  const handlePosScan = () => {
    setCart(prev => [...prev, { id: Math.random().toString(), name: 'Scanned Item', price: 15, qty: 1 }]);
  };

  const posTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Universal Header */}
      <View style={styles.header}>
        <Text style={[styles.logo, { fontFamily: 'PlayfairDisplay_700Bold' }]}>Basko Store OS</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'POS' && styles.toggleBtnActive]} 
            onPress={() => setMode('POS')}
          >
            <Text style={[styles.toggleText, mode === 'POS' && styles.toggleTextActive, { fontFamily: 'Inter_600SemiBold' }]}>POS Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, mode === 'SCANNER' && styles.toggleBtnActive]} 
            onPress={() => setMode('SCANNER')}
          >
            <Text style={[styles.toggleText, mode === 'SCANNER' && styles.toggleTextActive, { fontFamily: 'Inter_600SemiBold' }]}>Inventory Scanner</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode: POS */}
      {mode === 'POS' && (
        <View style={isTablet ? styles.posTablet : styles.posMobile}>
          {/* Cart List */}
          <View style={styles.posLeft}>
            <View style={styles.scanInputArea}>
              <TextInput style={styles.searchInput} placeholder="Type barcode or scan..." />
              <TouchableOpacity style={styles.scanBtn} onPress={handlePosScan}>
                <Text style={styles.scanBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.cartList}>
              {cart.map((item, idx) => (
                <View key={idx} style={styles.cartItem}>
                  <Text style={[styles.cartItemName, { fontFamily: 'Inter_600SemiBold' }]}>{item.name}</Text>
                  <Text style={[styles.cartItemPrice, { fontFamily: 'Inter_700Bold' }]}>₹{item.price}</Text>
                </View>
              ))}
              {cart.length === 0 && <Text style={styles.emptyCart}>No items scanned</Text>}
            </ScrollView>
          </View>

          {/* Checkout Panel */}
          <View style={styles.posRight}>
            <View style={styles.summaryBox}>
              <Text style={[styles.summaryTitle, { fontFamily: 'PlayfairDisplay_700Bold' }]}>Payment</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{posTotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>GST (5%)</Text>
                <Text style={styles.summaryValue}>₹{posTotal * 0.05}</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>₹{posTotal * 1.05}</Text>
              </View>
            </View>

            <View style={styles.paymentMethods}>
              <TouchableOpacity style={styles.paymentBtn}><Text style={styles.paymentBtnText}>💳 Card / UPI</Text></TouchableOpacity>
              <TouchableOpacity style={styles.paymentBtn}><Text style={styles.paymentBtnText}>💵 Cash</Text></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={() => { alert('Paid!'); setCart([]); }}>
              <Text style={[styles.checkoutBtnText, { fontFamily: 'Inter_700Bold' }]}>Complete Billing</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mode: SCANNER */}
      {mode === 'SCANNER' && (
        <View style={styles.scannerMode}>
          {hasPermission ? (
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39", "upc_a", "upc_e"],
              }}
              style={styles.camera}
            />
          ) : (
            <Text style={{textAlign: 'center', marginTop: 50}}>No Camera Access</Text>
          )}

          {scanned && (
            <View style={styles.scannedOverlay}>
              <Text style={styles.scannedText}>Last Scanned: {lastScanned}</Text>
              <TouchableOpacity style={styles.scanAgainBtn} onPress={() => setScanned(false)}>
                <Text style={styles.scanAgainText}>Tap to Scan Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: ROYAL_BLUE,
    padding: 20,
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    color: WHITE,
    fontSize: 28,
    marginBottom: isTablet ? 0 : 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 4,
  },
  toggleBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: WHITE,
  },
  toggleText: {
    color: WHITE,
    fontSize: 16,
  },
  toggleTextActive: {
    color: ROYAL_BLUE,
  },
  posTablet: {
    flex: 1,
    flexDirection: 'row',
  },
  posMobile: {
    flex: 1,
    flexDirection: 'column',
  },
  posLeft: {
    flex: 2,
    backgroundColor: WHITE,
    borderRightWidth: isTablet ? 1 : 0,
    borderRightColor: '#e2e8f0',
  },
  scanInputArea: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  scanBtn: {
    backgroundColor: ROYAL_BLUE,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanBtnText: {
    color: WHITE,
    fontWeight: 'bold',
  },
  cartList: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  cartItemName: {
    fontSize: 18,
    color: '#1e293b'
  },
  cartItemPrice: {
    fontSize: 18,
    color: ROYAL_BLUE
  },
  emptyCart: {
    textAlign: 'center',
    marginTop: 50,
    color: '#94a3b8',
    fontSize: 16,
  },
  posRight: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'space-between',
  },
  summaryBox: {
    backgroundColor: WHITE,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 22,
    marginBottom: 20,
    color: '#1e293b'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b'
  },
  summaryValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600'
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
    marginTop: 10,
  },
  summaryTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  summaryTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ROYAL_BLUE
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  paymentBtn: {
    flex: 1,
    backgroundColor: WHITE,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  paymentBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutBtn: {
    backgroundColor: ROYAL_BLUE,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: WHITE,
    fontSize: 18,
  },
  scannerMode: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  scannedOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: WHITE,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scanAgainBtn: {
    backgroundColor: ROYAL_BLUE,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
  scanAgainText: {
    color: WHITE,
    fontWeight: 'bold'
  }
});
