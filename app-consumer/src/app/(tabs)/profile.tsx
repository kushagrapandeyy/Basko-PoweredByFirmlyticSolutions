import { StyleSheet, Text, SafeAreaView } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your orders and addresses.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold', color: '#111827', marginBottom: 10 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular', color: '#6b7280' },
});
