import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
  Animated,
  ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  // Navigation / Vehicle state
  const [activeVehicle, setActiveVehicle] = useState('motor'); // 'motor' or 'mobil'

  // Saldo state
  const [balance, setBalance] = useState(1750000);
  const [showBalance, setShowBalance] = useState(true);

  // Chatbot state
  const [chatMotor, setChatMotor] = useState([
    { id: 1, sender: 'ai', text: 'Halo! Hasil diagnosa berkala mendeteksi V-Belt motor Vario 150 Anda telah menempuh 12.000 km dan mulai aus.', time: '22:50' },
    { id: 2, sender: 'ai', text: 'Saya merekomendasikan untuk melakukan penggantian CVT Kit di bengkel AHASS Astra Motor Karawang terdekat demi keselamatan berkendara.', time: '22:50' }
  ]);

  const [chatMobil, setChatMobil] = useState([
    { id: 1, sender: 'ai', text: 'Halo! Sistem onboard diagnostics (OBD) mendeteksi tegangan aki mobil Avanza Veloz Anda berada di bawah 11V (lemah).', time: '22:50' },
    { id: 2, sender: 'ai', text: 'Sangat disarankan melakukan penggantian aki dengan Aki Astra Otoparts MF Gold di Auto2000 Karawang terdekat agar kelistrikan tetap stabil.', time: '22:50' }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Service Booking state
  const [selectedDate, setSelectedDate] = useState('Kamis, 4 Jun');
  const [selectedTime, setSelectedTime] = useState('09:00 WIB');

  // Modal Checkout state
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Time for mock status bar
  const [currentTime, setCurrentTime] = useState('22:50');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollViewRef = useRef();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: currentTime
    };

    if (activeVehicle === 'motor') {
      setChatMotor(prev => [...prev, newMessage]);
    } else {
      setChatMobil(prev => [...prev, newMessage]);
    }

    const tempInput = inputText;
    setInputText('');

    // Trigger AI response after 1s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Tentu, keluhan/permintaan Anda tentang "${tempInput}" sudah saya catat. Silakan lanjutkan ke pemesanan jadwal servis di bawah dan lakukan pembayaran via AstraPay.`,
        time: currentTime
      };
      if (activeVehicle === 'motor') {
        setChatMotor(prev => [...prev, aiResponse]);
      } else {
        setChatMobil(prev => [...prev, aiResponse]);
      }
    }, 1500);
  };

  const getActiveChat = () => {
    return activeVehicle === 'motor' ? chatMotor : chatMobil;
  };

  // Pricing details
  const getProductDetails = () => {
    if (activeVehicle === 'motor') {
      return {
        name: 'V-Belt & Roller CVT Kit (AHM)',
        price: 220000,
        bengkel: 'AHASS Astra Motor Karawang',
        desc: 'Paket V-Belt original Honda (AHM) + Roller Weight untuk Vario 150. Termasuk jasa pasang & cek CVT menyeluruh.'
      };
    } else {
      return {
        name: 'Aki Astra Otoparts MF Gold',
        price: 925000,
        bengkel: 'Auto2000 Karawang',
        desc: 'Aki Maintenance Free (Bebas Perawatan) Astra Otoparts 12V 45Ah. Garansi 12 bulan + jasa pasang & cek dinamo.'
      };
    }
  };

  const product = getProductDetails();

  const handleTopUp = () => {
    setBalance(prev => prev + 100000);
    // Visual feedback could be added, but state update is direct
  };

  const formatRupiah = (val) => {
    return 'Rp' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleKeyPress = (num) => {
    setPinError('');
    if (pinInput.length < 6) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);

      // If it reaches 6 digits, check automatically
      if (nextPin.length === 6) {
        setIsProcessingPayment(true);
        setTimeout(() => {
          setIsProcessingPayment(false);
          if (nextPin === '123456') {
            // Success
            setBalance(prev => prev - product.price);
            setPaymentSuccess(true);
          } else {
            setPinError('PIN Salah! Silakan coba lagi (Petunjuk: 123456)');
            setPinInput('');
          }
        }, 1200);
      }
    }
  };

  const handleBackspace = () => {
    setPinError('');
    setPinInput(prev => prev.slice(0, -1));
  };

  const handleClearPin = () => {
    setPinError('');
    setPinInput('');
  };

  const resetAll = () => {
    setCheckoutVisible(false);
    setPinInput('');
    setPinError('');
    setPaymentSuccess(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070b16" />

      {/* Mock Status Bar */}
      <View style={styles.mockStatusBar}>
        <Text style={styles.mockStatusText}>{currentTime}</Text>
        <View style={styles.mockStatusIcons}>
          <Ionicons name="cellular" size={14} color="#ffffff" style={{ marginRight: 6 }} />
          <Ionicons name="wifi" size={14} color="#ffffff" style={{ marginRight: 6 }} />
          <Ionicons name="battery-full" size={16} color="#ffffff" />
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLogoContainer}>
          <Text style={styles.headerLogoAstra}>astra</Text>
          <Text style={styles.headerLogoPay}>pay</Text>
        </View>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>POWERED BY AI</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        
        {/* Saldo Widget */}
        <View style={styles.saldoCard}>
          <View style={styles.saldoInfo}>
            <View style={styles.saldoLabelContainer}>
              <MaterialCommunityIcons name="wallet-outline" size={18} color="#01b2a6" style={{ marginRight: 6 }} />
              <Text style={styles.saldoLabel}>Saldo AstraPay</Text>
            </View>
            <View style={styles.saldoValueRow}>
              <Text style={styles.saldoValue}>
                {showBalance ? formatRupiah(balance) : 'Rp ••••••••'}
              </Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeBtn}>
                <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.topUpBtn} onPress={handleTopUp}>
            <Ionicons name="add" size={18} color="#070b16" style={{ marginRight: 2 }} />
            <Text style={styles.topUpText}>Top Up</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Switcher */}
        <View style={styles.switcherContainer}>
          <TouchableOpacity
            style={[styles.switcherTab, activeVehicle === 'motor' && styles.switcherTabActive]}
            onPress={() => setActiveVehicle('motor')}
          >
            <MaterialCommunityIcons 
              name="motorbike" 
              size={20} 
              color={activeVehicle === 'motor' ? '#070b16' : '#94a3b8'} 
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.switcherText, activeVehicle === 'motor' && styles.switcherTextActive]}>
              Motor (Vario 150)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switcherTab, activeVehicle === 'mobil' && styles.switcherTabActive]}
            onPress={() => setActiveVehicle('mobil')}
          >
            <MaterialCommunityIcons 
              name="car-sports" 
              size={20} 
              color={activeVehicle === 'mobil' ? '#070b16' : '#94a3b8'} 
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.switcherText, activeVehicle === 'mobil' && styles.switcherTextActive]}>
              Mobil (Avanza Veloz)
            </Text>
          </TouchableOpacity>
        </View>

        {/* AI Chatbot Box */}
        <View style={styles.chatCard}>
          <View style={styles.chatHeader}>
            <View style={styles.greenDot} />
            <Text style={styles.chatTitle}>Astra AutoCare AI Assistant</Text>
          </View>

          <View style={styles.chatHistory}>
            {getActiveChat().map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.chatBubble,
                  msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAI
                ]}
              >
                <Text style={[
                  styles.chatText,
                  msg.sender === 'user' ? styles.textUser : styles.textAI
                ]}>
                  {msg.text}
                </Text>
                <Text style={styles.chatTime}>{msg.time}</Text>
              </View>
            ))}
            {isTyping && (
              <View style={[styles.chatBubble, styles.bubbleAI, { flexDirection: 'row', alignItems: 'center' }]}>
                <ActivityIndicator size="small" color="#01b2a6" style={{ marginRight: 6 }} />
                <Text style={[styles.chatText, styles.textAI, { fontStyle: 'italic', color: '#94a3b8' }]}>AI sedang mengetik...</Text>
              </View>
            )}
          </View>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Tanyakan sesuatu pada AI..."
              placeholderTextColor="#64748b"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendMessage}>
              <Ionicons name="send" size={16} color="#070b16" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Card */}
        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>REKOMENDASI AI</Text>
            </View>
            <View style={styles.ratingRow}>
              <FontAwesome name="star" size={12} color="#fbbf24" style={{ marginRight: 4 }} />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>
          
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDesc}>{product.desc}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.productMetaRow}>
            <View>
              <Text style={styles.metaLabel}>Lokasi Bengkel</Text>
              <Text style={styles.metaValue}>{product.bengkel}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.metaLabel}>Harga Paket</Text>
              <Text style={styles.metaPrice}>{formatRupiah(product.price)}</Text>
            </View>
          </View>
        </View>

        {/* Dropdown Jadwal Bengkel */}
        <View style={styles.bookingCard}>
          <Text style={styles.bookingCardTitle}>Jadwal Kedatangan & Bengkel</Text>
          
          <View style={styles.inputLabelRow}>
            <Ionicons name="location-sharp" size={14} color="#01b2a6" style={{ marginRight: 4 }} />
            <Text style={styles.bookingLabel}>Bengkel Terpilih</Text>
          </View>
          <View style={styles.staticInput}>
            <Text style={styles.staticInputText}>{product.bengkel}</Text>
            <Ionicons name="lock-closed" size={14} color="#475569" />
          </View>

          {/* Date Selector */}
          <Text style={styles.bookingLabel}>Pilih Tanggal</Text>
          <View style={styles.selectorRow}>
            {['Kamis, 4 Jun', 'Jumat, 5 Jun', 'Sabtu, 6 Jun'].map((date) => (
              <TouchableOpacity
                key={date}
                style={[styles.selectorItem, selectedDate === date && styles.selectorItemActive]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.selectorText, selectedDate === date && styles.selectorTextActive]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Time Selector */}
          <Text style={styles.bookingLabel}>Pilih Jam Kedatangan</Text>
          <View style={styles.selectorRow}>
            {['09:00 WIB', '11:00 WIB', '14:00 WIB', '16:00 WIB'].map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.selectorItem, selectedTime === time && styles.selectorItemActive]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.selectorText, selectedTime === time && styles.selectorTextActive]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom space to offset sticky button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Checkout */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.checkoutPriceContainer}>
          <Text style={styles.checkoutPriceLabel}>Total Pembayaran</Text>
          <Text style={styles.checkoutPriceValue}>{formatRupiah(product.price)}</Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => {
            setPinInput('');
            setPinError('');
            setCheckoutVisible(true);
          }}
        >
          <Text style={styles.payBtnText}>Bayar via AstraPay</Text>
          <Ionicons name="chevron-forward" size={16} color="#070b16" />
        </TouchableOpacity>
      </View>

      {/* SDK PIN Modal & Success Screen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={checkoutVisible}
        onRequestClose={resetAll}
      >
        <View style={styles.modalOverlay}>
          
          {/* Main SDK Card */}
          <View style={styles.sdkCard}>
            
            {/* If NOT payment success, show PIN verification keypad */}
            {!paymentSuccess ? (
              <View style={{ width: '100%' }}>
                {/* Header SDK */}
                <View style={styles.sdkHeader}>
                  <View style={styles.sdkHeaderLogo}>
                    <Text style={[styles.headerLogoAstra, { fontSize: 16 }]}>astra</Text>
                    <Text style={[styles.headerLogoPay, { fontSize: 16 }]}>pay</Text>
                    <Text style={styles.sdkText}> SDK</Text>
                  </View>
                  <TouchableOpacity onPress={resetAll} style={styles.sdkCloseBtn}>
                    <Ionicons name="close" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>

                {/* Subtitle / Details */}
                <View style={styles.sdkDetails}>
                  <Text style={styles.sdkInvoiceLabel}>BOOKING SERVICE</Text>
                  <Text style={styles.sdkInvoiceTitle}>{product.name}</Text>
                  <Text style={styles.sdkInvoiceBengkel}>{product.bengkel}</Text>
                  <Text style={styles.sdkAmount}>{formatRupiah(product.price)}</Text>
                </View>

                {/* Input PIN Display */}
                <View style={styles.pinDisplayContainer}>
                  <Text style={styles.pinTitle}>Masukkan PIN AstraPay Anda</Text>
                  <View style={styles.pinDotsRow}>
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.pinDot,
                          pinInput.length > idx && styles.pinDotFilled,
                          pinError ? styles.pinDotError : null
                        ]}
                      />
                    ))}
                  </View>
                  {isProcessingPayment ? (
                    <ActivityIndicator size="small" color="#01b2a6" style={{ marginTop: 8 }} />
                  ) : (
                    pinError ? (
                      <Text style={styles.errorText}>{pinError}</Text>
                    ) : (
                      <Text style={styles.helperText}>Masukkan PIN testing: 123456</Text>
                    )
                  )}
                </View>

                {/* Keypad */}
                <View style={styles.keypadContainer}>
                  <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('1')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('2')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('3')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>3</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('4')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('5')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('6')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>6</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('7')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('8')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('9')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>9</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.keypadBtn} onPress={handleClearPin} disabled={isProcessingPayment}>
                      <Text style={[styles.keypadBtnText, { fontSize: 14, color: '#ef4444' }]}>CLEAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeyPress('0')} disabled={isProcessingPayment}>
                      <Text style={styles.keypadBtnText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={handleBackspace} disabled={isProcessingPayment}>
                      <Ionicons name="backspace-outline" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              /* If Payment Successful, show Receipt */
              <ScrollView contentContainerStyle={styles.receiptContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={80} color="#10b981" />
                </View>
                <Text style={styles.successTitle}>Pembayaran & Booking Sukses!</Text>
                <Text style={styles.successSubtitle}>Booking Anda telah terdaftar secara real-time</Text>

                {/* Digital Receipt Card */}
                <View style={styles.receiptCard}>
                  <Text style={styles.receiptHeader}>STRUK DIGITAL</Text>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Status</Text>
                    <Text style={[styles.receiptVal, { color: '#10b981', fontWeight: 'bold' }]}>Lunas (AstraPay)</Text>
                  </View>
                  
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>No. Transaksi</Text>
                    <Text style={styles.receiptVal}>TX-AP-{Math.floor(Math.random() * 90000000) + 10000000}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Kendaraan</Text>
                    <Text style={styles.receiptVal}>
                      {activeVehicle === 'motor' ? 'Vario 150 (Motor)' : 'Avanza Veloz (Mobil)'}
                    </Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Item Layanan</Text>
                    <Text style={styles.receiptVal}>{product.name}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Bengkel Mitra</Text>
                    <Text style={styles.receiptVal}>{product.bengkel}</Text>
                  </View>

                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Jadwal</Text>
                    <Text style={styles.receiptVal}>{selectedDate} @ {selectedTime}</Text>
                  </View>

                  <View style={styles.receiptDivider} />

                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { fontWeight: 'bold', color: '#ffffff' }]}>Total Bayar</Text>
                    <Text style={[styles.receiptVal, { fontWeight: 'bold', color: '#01b2a6', fontSize: 16 }]}>
                      {formatRupiah(product.price)}
                    </Text>
                  </View>
                </View>

                {/* Confirmation Action Button */}
                <TouchableOpacity style={styles.closeReceiptBtn} onPress={resetAll}>
                  <Text style={styles.closeReceiptText}>Kembali ke Dashboard</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b16',
  },
  // Mock Status Bar
  mockStatusBar: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#070b16',
  },
  mockStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  mockStatusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Header
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#070b16',
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoAstra: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerLogoPay: {
    color: '#01b2a6',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  aiBadge: {
    backgroundColor: '#1e293b',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#01b2a6',
  },
  aiBadgeText: {
    color: '#01b2a6',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Scroll Content
  scrollContent: {
    padding: 16,
  },
  // Saldo Card
  saldoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  saldoInfo: {
    flex: 1,
  },
  saldoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  saldoLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  saldoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saldoValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  eyeBtn: {
    padding: 4,
  },
  topUpBtn: {
    backgroundColor: '#01b2a6',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  topUpText: {
    color: '#070b16',
    fontSize: 12,
    fontWeight: '700',
  },
  // Vehicle Switcher
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  switcherTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  switcherTabActive: {
    backgroundColor: '#01b2a6',
  },
  switcherText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  switcherTextActive: {
    color: '#070b16',
    fontWeight: '700',
  },
  // Chat Card
  chatCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 12,
    marginBottom: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 8,
    marginBottom: 12,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  chatTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  chatHistory: {
    maxHeight: 220,
    marginBottom: 12,
  },
  chatBubble: {
    maxWidth: '85%',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  bubbleAI: {
    backgroundColor: '#1e293b',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  bubbleUser: {
    backgroundColor: '#01b2a6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  chatText: {
    fontSize: 13,
    lineHeight: 18,
  },
  textAI: {
    color: '#ffffff',
  },
  textUser: {
    color: '#070b16',
    fontWeight: '500',
  },
  chatTime: {
    alignSelf: 'flex-end',
    fontSize: 9,
    color: '#64748b',
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070b16',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  chatInput: {
    flex: 1,
    height: 40,
    color: '#ffffff',
    fontSize: 13,
    paddingHorizontal: 8,
  },
  chatSendBtn: {
    backgroundColor: '#01b2a6',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Product Card
  productCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#01b2a622',
    borderWidth: 1,
    borderColor: '#01b2a6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    color: '#01b2a6',
    fontSize: 9,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '600',
  },
  productName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  productDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginBottom: 12,
  },
  productMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    color: '#64748b',
    fontSize: 10,
    marginBottom: 2,
  },
  metaValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  metaPrice: {
    color: '#01b2a6',
    fontSize: 15,
    fontWeight: '700',
  },
  // Booking Card
  bookingCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
  },
  bookingCardTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookingLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 6,
    marginTop: 8,
  },
  staticInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#070b16',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 8,
  },
  staticInputText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectorItem: {
    flex: 1,
    backgroundColor: '#070b16',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 6,
    paddingVertical: 10,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  selectorItemActive: {
    borderColor: '#01b2a6',
    backgroundColor: '#01b2a611',
  },
  selectorText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  selectorTextActive: {
    color: '#01b2a6',
    fontWeight: '700',
  },
  // Sticky Bottom Bar
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  checkoutPriceContainer: {
    flexDirection: 'column',
  },
  checkoutPriceLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  checkoutPriceValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  payBtn: {
    backgroundColor: '#01b2a6',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  payBtnText: {
    color: '#070b16',
    fontSize: 14,
    fontWeight: '800',
    marginRight: 4,
  },
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sdkCard: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
    minHeight: 520,
  },
  // SDK Header
  sdkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 12,
    marginBottom: 16,
  },
  sdkHeaderLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sdkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
  },
  sdkCloseBtn: {
    padding: 4,
  },
  // SDK Details
  sdkDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sdkInvoiceLabel: {
    color: '#01b2a6',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  sdkInvoiceTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  sdkInvoiceBengkel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 12,
  },
  sdkAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  // PIN Display
  pinDisplayContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pinTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  pinDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#475569',
    backgroundColor: '#070b16',
    marginHorizontal: 8,
  },
  pinDotFilled: {
    backgroundColor: '#01b2a6',
    borderColor: '#01b2a6',
  },
  pinDotError: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  helperText: {
    color: '#64748b',
    fontSize: 11,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600',
  },
  // Keypad
  keypadContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  keypadBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadBtnText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  // Success Receipt
  receiptContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  successIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#10b98122',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  successTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  successSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 20,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#070b16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 20,
  },
  receiptHeader: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  receiptLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  receiptVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  receiptDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginVertical: 10,
  },
  closeReceiptBtn: {
    backgroundColor: '#01b2a6',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeReceiptText: {
    color: '#070b16',
    fontSize: 14,
    fontWeight: '800',
  },
});
