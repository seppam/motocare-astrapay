import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BookingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Booking</Text>
      <Text style={styles.subtitle}>Daftar booking servis sepeda motor Anda akan muncul di sini.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1128',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
