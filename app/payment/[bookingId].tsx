import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../../constants/theme';
import { generateToken, generateQRIS } from '../../lib/astrapay';

interface BookingDetails {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  price: number;
  priceRange: string;
  workshopName: string;
  workshopAddress: string;
  scheduleDate: string;
  scheduleTime: string;
  status: string;
  createdAt: string;
}

export default function PaymentScreen() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();

  // Screen states
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Mengambil detail booking...');
  const [qrisPayload, setQrisPayload] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const timerRef = useRef<any>(null);

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format countdown helper
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const initPayment = async () => {
      try {
        // 1. Fetch booking details from local storage
        const bookingStr = await AsyncStorage.getItem(`booking_${bookingId}`);
        if (!bookingStr) {
          throw new Error('Booking details not found');
        }
        
        const bookingData: BookingDetails = JSON.parse(bookingStr);
        setBooking(bookingData);

        // Check if already paid (in case user went back)
        if (bookingData.status === 'Lunas') {
          setPaymentSuccess(true);
          setLoading(false);
          return;
        }

        // 2. Simulate AstraPay Auth Token request
        setLoadingText('Autentikasi Secure Gateway AstraPay...');
        const tokenResponse = await generateToken();

        // 3. Simulate AstraPay QRIS generation request
        setLoadingText('Membuat Kode QRIS Pembayaran...');
        const qrisResponse = await generateQRIS(
          tokenResponse.accessToken,
          bookingData.price,
          bookingData.bookingId
        );

        setQrisPayload(qrisResponse.qrisData);
        setTransactionId(qrisResponse.transactionId);
        setLoading(false);

        // 4. Start session countdown timer
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } catch (err) {
        console.error('Payment initialization error:', err);
        setLoading(false);
      }
    };

    initPayment();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [bookingId]);

  const handleSimulatePaymentSuccess = async () => {
    if (!booking) return;

    setProcessingPayment(true);
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(async () => {
      try {
        const updatedBooking = { ...booking, status: 'Lunas' };
        setBooking(updatedBooking);

        // 1. Update the booking item details
        await AsyncStorage.setItem(`booking_${bookingId}`, JSON.stringify(updatedBooking));

        // 2. Update status in booking history
        const existingHistoryStr = await AsyncStorage.getItem('booking_history');
        if (existingHistoryStr) {
          const history: BookingDetails[] = JSON.parse(existingHistoryStr);
          const itemIndex = history.findIndex((b) => b.bookingId === bookingId);
          if (itemIndex > -1) {
            history[itemIndex].status = 'Lunas';
            await AsyncStorage.setItem('booking_history', JSON.stringify(history));
          }
        }

        setPaymentSuccess(true);
      } catch (e) {
        console.error('Failed to update payment status:', e);
      } finally {
        setProcessingPayment(false);
      }
    }, 1500); // Simulate processing time
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  // RENDER LOADING STATE
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
        <Text style={styles.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  // RENDER TRANSACTION EXPIRED
  if (countdown === 0 && !paymentSuccess) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="time-outline" size={64} color={COLORS.danger} />
        <Text variant="headlineSmall" style={styles.errorTitle}>
          Sesi Pembayaran Berakhir
        </Text>
        <Text variant="bodyMedium" style={styles.errorDesc}>
          Waktu pembayaran Anda telah habis. Silakan buat booking ulang dari halaman beranda.
        </Text>
        <Button
          mode="contained"
          onPress={handleGoHome}
          style={styles.homeBtn}
          buttonColor={COLORS.primary}
        >
          Kembali ke Beranda
        </Button>
      </View>
    );
  }

  // RENDER PAYMENT SUCCESS RECEIPT
  if (paymentSuccess && booking) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Card style={styles.receiptCard} mode="contained">
          <Card.Content style={styles.receiptContent}>
            {/* Success Header */}
            <View style={styles.successHeader}>
              <Ionicons name="checkmark-circle" size={72} color={COLORS.primary} />
              <Text variant="headlineSmall" style={styles.successTitle}>
                Pembayaran Berhasil!
              </Text>
              <Text variant="bodySmall" style={styles.successDesc}>
                Terima kasih, pembayaran Anda telah kami terima.
              </Text>
            </View>

            <Divider style={styles.receiptDivider} />

            {/* Receipt Details Table */}
            <View style={styles.receiptTable}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Status</Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidBadgeText}>Lunas</Text>
                </View>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Nominal Pembayaran</Text>
                <Text style={styles.receiptValueBold}>{formatCurrency(booking.price)}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Metode Pembayaran</Text>
                <Text style={styles.receiptValue}>AstraPay QRIS</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Merchant</Text>
                <Text style={styles.receiptValue}>MotoCare Service Hub</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>ID Booking</Text>
                <Text style={styles.receiptValueCode}>{booking.bookingId}</Text>
              </View>

              {transactionId ? (
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>ID Transaksi AstraPay</Text>
                  <Text style={styles.receiptValueCode}>{transactionId}</Text>
                </View>
              ) : null}

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Waktu Pembayaran</Text>
                <Text style={styles.receiptValue}>
                  {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  {new Date().toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  WIB
                </Text>
              </View>
            </View>

            <Divider style={styles.receiptDivider} />

            {/* Booking Details Card */}
            <View style={styles.bookingSummaryBox}>
              <Text variant="titleSmall" style={styles.summaryBoxTitle}>
                Rincian Jadwal Servis
              </Text>
              <Text variant="bodyMedium" style={styles.summaryBoxText}>
                {booking.serviceName}
              </Text>
              <Text variant="bodySmall" style={styles.summaryBoxSubtext}>
                📍 {booking.workshopName}
              </Text>
              <Text variant="bodySmall" style={styles.summaryBoxSubtext}>
                📅 {booking.scheduleDate} - {booking.scheduleTime} WIB
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleGoHome}
          style={styles.doneButton}
          labelStyle={styles.doneButtonLabel}
          buttonColor={COLORS.primary}
        >
          Kembali ke Beranda
        </Button>
      </ScrollView>
    );
  }

  // RENDER QRIS DISPLAY & COUNTDOWN
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {booking && (
        <Card style={styles.invoiceCard} mode="contained">
          <Card.Content>
            {/* Price Header */}
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceTitle}>Total Pembayaran</Text>
              <Text variant="headlineMedium" style={styles.invoicePrice}>
                {formatCurrency(booking.price)}
              </Text>
              <Text style={styles.invoiceBookingId}>Booking ID: {booking.bookingId}</Text>
            </View>

            <Divider style={styles.cardDivider} />

            {/* QRIS Code */}
            <View style={styles.qrisContainer}>
              <View style={styles.qrisLogoRow}>
                <Text style={styles.qrisLogoText}>QRIS</Text>
                <Text style={styles.qrisSubText}>GPN</Text>
              </View>

              <View style={styles.qrCodeBox}>
                {qrisPayload ? (
                  <QRCode value={qrisPayload} size={200} color="#000000" backgroundColor="#ffffff" />
                ) : (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                )}
              </View>

              <View style={styles.countdownRow}>
                <Text style={styles.countdownLabel}>Sisa Waktu Pembayaran:</Text>
                <Text style={styles.countdownTime}>{formatTime(countdown)}</Text>
              </View>
            </View>

            <Divider style={styles.cardDivider} />

            {/* Instruction */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Pindai QRIS di atas dengan aplikasi AstraPay atau aplikasi e-wallet / mobile banking favorit Anda.
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Payment simulation trigger */}
      <Button
        mode="contained"
        onPress={handleSimulatePaymentSuccess}
        loading={processingPayment}
        disabled={processingPayment}
        style={styles.simulateButton}
        labelStyle={styles.simulateBtnLabel}
        buttonColor={COLORS.primary}
      >
        Simulasi Bayar Berhasil
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDesc: {
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  homeBtn: {
    borderRadius: 8,
    width: '100%',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  invoiceCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  invoiceHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  invoiceTitle: {
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  invoicePrice: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  invoiceBookingId: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  cardDivider: {
    backgroundColor: COLORS.border,
  },
  qrisContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrisLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrisLogoText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 6,
  },
  qrisSubText: {
    color: COLORS.danger,
    fontWeight: 'bold',
    fontSize: 12,
    borderColor: COLORS.danger,
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  qrCodeBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownLabel: {
    color: COLORS.textMuted,
    marginRight: 6,
  },
  countdownTime: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  simulateButton: {
    borderRadius: 10,
    paddingVertical: 4,
  },
  simulateBtnLabel: {
    color: '#0a1128',
    fontWeight: 'bold',
    fontSize: 15,
  },
  receiptCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  receiptContent: {
    paddingVertical: 12,
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  successDesc: {
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  receiptDivider: {
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  receiptTable: {
    paddingHorizontal: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  receiptValue: {
    color: COLORS.text,
    fontWeight: '500',
    fontSize: 14,
  },
  receiptValueBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  receiptValueCode: {
    color: COLORS.text,
    fontFamily: 'Courier',
    fontWeight: '600',
    fontSize: 13,
  },
  paidBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidBadgeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  bookingSummaryBox: {
    backgroundColor: 'rgba(30, 58, 95, 0.2)',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  summaryBoxTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  summaryBoxText: {
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryBoxSubtext: {
    color: COLORS.textMuted,
    marginTop: 2,
  },
  doneButton: {
    borderRadius: 10,
    paddingVertical: 4,
  },
  doneButtonLabel: {
    color: '#0a1128',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
