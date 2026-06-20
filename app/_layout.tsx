import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';

// Define the central theme matching the POS AstraPay dark aesthetic
const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#10b981',      // Emerald green
    background: '#0a1128',   // Dark navy background
    surface: '#111827',      // Card surface
    outline: '#1e3a5f',      // Border color
    error: '#ef4444',        // Danger state
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0a1128',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#0a1128',
            },
          }}
        >
          {/* Main Tab Navigator */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Service Details Route */}
          <Stack.Screen 
            name="service/[id]" 
            options={{ 
              title: 'Detail Layanan',
              headerBackTitle: 'Kembali',
            }} 
          />
          
          {/* Checkout / Payment Route */}
          <Stack.Screen 
            name="payment/[bookingId]" 
            options={{ 
              title: 'Pembayaran QRIS',
              headerBackTitle: 'Kembali',
            }} 
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
