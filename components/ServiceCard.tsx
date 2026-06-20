import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ServiceItem } from '../constants/services';
import { COLORS } from '../constants/theme';

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (id: string) => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  // Map simple names to correct outline style icons
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

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        {/* Header section with Icon & Title */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={getIconName(service.icon)} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.name}>
              {service.name}
            </Text>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
              <Text variant="bodySmall" style={styles.timeText}>
                {service.estimatedTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text variant="bodyMedium" style={styles.description}>
          {service.description}
        </Text>

        {/* Pricing & Call to Action */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text variant="bodySmall" style={styles.priceLabel}>
              Estimasi Biaya
            </Text>
            <Text variant="titleMedium" style={styles.priceValue}>
              {service.estimatedPrice}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => onSelect(service.id)}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            buttonColor={COLORS.primary}
            contentStyle={styles.buttonContent}
          >
            Pilih
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Translucent emerald green
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  description: {
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: COLORS.textMuted,
  },
  priceValue: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingHorizontal: 8,
    height: 36,
  },
  buttonLabel: {
    color: '#0a1128', // Dark background for button text contrast
    fontWeight: 'bold',
    fontSize: 14,
  },
});
