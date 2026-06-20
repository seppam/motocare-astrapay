import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVICES } from '../../constants/services';
import { COLORS } from '../../constants/theme';

const WORKSHOPS = [
  { id: 'ws-1', name: 'AHASS MotoCare Kebon Jeruk', distance: '1.2 km', address: 'Jl. Raya Kebon Jeruk No. 24, Jakarta Barat' },
  { id: 'ws-2', name: 'AHASS MotoCare Palmerah', distance: '3.5 km', address: 'Jl. Palmerah Barat No. 8, Jakarta Pusat' },
  { id: 'ws-3', name: 'MotoCare Sudirman Hub', distance: '5.8 km', address: 'Sudirman Tower Lt. B1, Jakarta Selatan' },
];

const DATE_OPTIONS = [
  { id: 'd-1', label: 'Hari Ini', date: 'Jumat, 19 Jun' },
  { id: 'd-2', label: 'Besok', date: 'Sabtu, 20 Jun' },
  { id: 'd-3', label: 'Lusa', date: 'Minggu, 21 Jun' },
];

const TIME_OPTIONS = ['09:00', '11:00', '13:00', '15:00'];

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the requested service
  const service = SERVICES.find((s) => s.id === id);

  // Form states
  const [selectedWorkshop, setSelectedWorkshop] = useState(WORKSHOPS[0]);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>Layanan tidak ditemukan</Text>
        <Button mode="contained" onPress={() => router.back()} buttonColor={COLORS.primary}>
          Kembali
        </Button>
      </View>
    );
  }

  // Get matching icon name helper
  const getIconName = (icon: string): any => {
    switch (icon) {
      case 'water':
        return 'water-outline';
      case 'construct':
        return 'construct-outline';
      case 'build':
        return 'build-outline';
      case 'flash':
        return 'flash-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const handleBookNow = async () => {
    setLoading(true);
    try {
      const bookingId = `BKG-${Date.now()}`;
      
      const newBooking = {
        bookingId,
        serviceId: service.id,
        serviceName: service.name,
        price: service.priceValue,
        priceRange: service.estimatedPrice,
        workshopName: selectedWorkshop.name,
        workshopAddress: selectedWorkshop.address,
        scheduleDate: selectedDate.date,
        scheduleTime: selectedTime,
        status: 'Menunggu Pembayaran',
        createdAt: new Date().toISOString(),
      };

      // 1. Save specific booking details for the payment screen to access
      await AsyncStorage.setItem(`booking_${bookingId}`, JSON.stringify(newBooking));

      // 2. Load existing bookings and append this new booking to history
      const existingHistoryStr = await AsyncStorage.getItem('booking_history');
      const history = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      history.unshift(newBooking); // Put newest booking at the top
      await AsyncStorage.setItem('booking_history', JSON.stringify(history));

      console.log(`[MotoCare] Booking created successfully: ${bookingId}`);

      // 3. Navigate to checkout/payment
      router.push({
        pathname: '/payment/[bookingId]',
        params: { bookingId },
      });
    } catch (e) {
      console.error('Failed to save booking details:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Service Title Card */}
        <Card style={styles.serviceHeaderCard} mode="contained">
          <Card.Content>
            <View style={styles.serviceRow}>
              <View style={styles.iconContainer}>
                <Ionicons name={getIconName(service.icon)} size={28} color={COLORS.primary} />
              </View>
              <View style={styles.serviceMeta}>
                <Text variant="headlineSmall" style={styles.serviceTitle}>
                  {service.name}
                </Text>
                <View style={styles.durationRow}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.durationText}>Durasi: {service.estimatedTime}</Text>
                </View>
              </View>
            </View>
            <Text variant="bodyMedium" style={styles.serviceDesc}>
              {service.description}
            </Text>
          </Card.Content>
        </Card>

        {/* Workshop Selection */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Pilih Bengkel Mitra
        </Text>
        {WORKSHOPS.map((ws) => {
          const isSelected = selectedWorkshop.id === ws.id;
          return (
            <TouchableOpacity
              key={ws.id}
              activeOpacity={0.8}
              onPress={() => setSelectedWorkshop(ws)}
            >
              <Card
                style={[styles.workshopCard, isSelected && styles.selectedCardBorder]}
                mode="outlined"
              >
                <Card.Content style={styles.workshopContent}>
                  <View style={styles.workshopLeft}>
                    <Text variant="titleMedium" style={[styles.workshopName, isSelected && styles.textGreen]}>
                      {ws.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.workshopAddress}>
                      {ws.address}
                    </Text>
                  </View>
                  <View style={styles.workshopRight}>
                    <Ionicons name="navigate-circle-outline" size={18} color={COLORS.primary} />
                    <Text variant="bodySmall" style={styles.workshopDistance}>
                      {ws.distance}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Date Selection */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Pilih Tanggal Servis
        </Text>
        <View style={styles.dateRow}>
          {DATE_OPTIONS.map((d) => {
            const isSelected = selectedDate.id === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                style={[styles.dateButton, isSelected && styles.selectedDateButton]}
                onPress={() => setSelectedDate(d)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateLabel, isSelected && styles.textDark]}>
                  {d.label}
                </Text>
                <Text style={[styles.dateText, isSelected && styles.textDarkBold]}>
                  {d.date.split(', ')[1]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time Selection */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Pilih Jam Servis
        </Text>
        <View style={styles.timeRow}>
          {TIME_OPTIONS.map((t) => {
            const isSelected = selectedTime === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.timeButton, isSelected && styles.selectedTimeButton]}
                onPress={() => setSelectedTime(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timeLabel, isSelected && styles.textDarkBold]}>
                  {t} WIB
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Summary Bar */}
      <View style={styles.footerContainer}>
        <View style={styles.priceContainer}>
          <Text variant="bodySmall" style={styles.footerPriceLabel}>
            Total Estimasi
          </Text>
          <Text variant="titleLarge" style={styles.footerPriceValue}>
            {service.estimatedPrice}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleBookNow}
          loading={loading}
          disabled={loading}
          style={styles.bookButton}
          labelStyle={styles.bookButtonLabel}
          buttonColor={COLORS.primary}
        >
          Lanjut Pembayaran
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120, // Leave room for sticky footer
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.text,
    fontSize: 18,
    marginVertical: 16,
  },
  serviceHeaderCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 24,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceMeta: {
    flex: 1,
  },
  serviceTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  durationText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  serviceDesc: {
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  sectionTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  workshopCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedCardBorder: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  workshopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workshopLeft: {
    flex: 1,
    marginRight: 12,
  },
  workshopName: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  workshopAddress: {
    color: COLORS.textMuted,
  },
  workshopRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  workshopDistance: {
    color: COLORS.textMuted,
    marginTop: 2,
  },
  textGreen: {
    color: COLORS.primary,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedDateButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  dateText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  textDark: {
    color: '#0a1128',
  },
  textDarkBold: {
    color: '#0a1128',
    fontWeight: 'bold',
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  timeButton: {
    width: '46%', // Renders 2 per row
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: '2%',
    marginBottom: 12,
  },
  selectedTimeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeLabel: {
    color: COLORS.text,
    fontSize: 14,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  footerPriceLabel: {
    color: COLORS.textMuted,
  },
  footerPriceValue: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  bookButton: {
    borderRadius: 10,
    flex: 1.2,
  },
  bookButtonLabel: {
    color: '#0a1128',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
