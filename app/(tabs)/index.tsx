import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SERVICES } from '../../constants/services';
import { COLORS } from '../../constants/theme';
import ServiceCard from '../../components/ServiceCard';

export default function HomeScreen() {
  const router = useRouter();

  const handleSelectService = (id: string) => {
    // Navigate to the dynamic service detail route
    router.push({
      pathname: '/service/[id]',
      params: { id },
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Profile Greeting Section */}
      <View style={styles.profileRow}>
        <View>
          <Text variant="bodyMedium" style={styles.greetingText}>
            Selamat malam,
          </Text>
          <Text variant="headlineSmall" style={styles.profileName}>
            Bro Septian 🏍️
          </Text>
        </View>
        <View style={styles.notificationBadge}>
          <Ionicons name="notifications-outline" size={24} color="#ffffff" />
        </View>
      </View>

      {/* AstraPay & Points Wallet Card */}
      <Card style={styles.walletCard} mode="contained">
        <Card.Content style={styles.walletContent}>
          {/* AstraPay Balance Column */}
          <View style={styles.walletCol}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletBrand}>AstraPay</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text variant="titleLarge" style={styles.walletBalance}>
              Rp 185.000
            </Text>
          </View>

          <View style={styles.divider} />

          {/* MotoCare Points Column */}
          <View style={styles.walletCol}>
            <Text style={styles.pointsLabel}>Poin MotoCare</Text>
            <View style={styles.pointsRow}>
              <Ionicons name="star" size={16} color="#f59e0b" style={styles.pointsIcon} />
              <Text variant="titleMedium" style={styles.pointsValue}>
                350 pts
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Services Section Header */}
      <View style={styles.sectionHeader}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Layanan Service Motor
        </Text>
        <Text variant="bodyMedium" style={styles.sectionSubtitle}>
          Pilih jenis perawatan terbaik untuk kenyamanan berkendara Anda.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceCard service={item} onSelect={handleSelectService} />
        )}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greetingText: {
    color: COLORS.textMuted,
  },
  profileName: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  notificationBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 24,
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  walletCol: {
    flex: 1,
    justifyContent: 'center',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  walletBrand: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: 'bold',
  },
  walletBalance: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  pointsLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    marginRight: 4,
  },
  pointsValue: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: COLORS.textMuted,
    lineHeight: 20,
  },
});
