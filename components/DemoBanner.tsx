import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';

const REPO_URL = 'https://github.com/seppam/motocare-astrapay';
const STORAGE_KEY = 'demo_banner_dismissed';

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'true') setVisible(false);
    });
  }, []);

  const handleDismiss = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const handleOpenRepo = () => {
    if (Platform.OS === 'web') {
      window.open(REPO_URL, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(REPO_URL);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.banner} role="banner" accessibilityLabel="Demo notice">
      <View style={styles.textRow}>
        <Ionicons name="code-slash" size={14} color="#0a1128" style={styles.icon} />
        <Text style={styles.text}>
          Demo Preview
        </Text>
        <Text style={styles.dot}>·</Text>
        <TouchableOpacity onPress={handleOpenRepo} style={styles.linkBtn}>
          <Text style={styles.linkText}>View full source code &amp; README →</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleDismiss} accessibilityLabel="Dismiss banner">
        <Ionicons name="close-circle" size={16} color="#0a1128" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 8,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 4,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    color: '#0a1128',
    fontSize: 12,
    fontWeight: '700',
  },
  dot: {
    color: '#0a1128',
    fontSize: 12,
    marginHorizontal: 2,
  },
  linkBtn: {
    // Wraps the link text touchably
  },
  linkText: {
    color: '#0a1128',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
