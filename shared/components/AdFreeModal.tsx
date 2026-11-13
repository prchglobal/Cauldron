import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useBanner } from '../BannerContext';
import { useTheme } from '../ThemeContext';
import { PurchaseManager } from '../PurchaseService';
import { SKUS } from '../monetization';

interface AdFreeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AdFreeModal({ visible, onClose }: AdFreeModalProps) {
  const { isDarkMode } = useTheme();
  const { isAdFree, setAdFree, checkAdFreeStatus } = useBanner();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const cardBg = isDarkMode ? '#1e1b29' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const accent = '#8b5cf6';
  const borderColor = isDarkMode ? '#2d283e' : '#e5e7eb';

  const handleBuyAdFree = async () => {
    setIsPurchasing(true);
    try {
      if (Platform.OS === 'web') {
        // On web, grant and persist ad-free status immediately
        await setAdFree(true);
        Alert.alert('Success 🎉', 'Ad-Free mode is now active! All banner and interstitial ads are hidden.');
        onClose();
        return;
      }

      // Native IAP flow (iOS / Android)
      await PurchaseManager.initialize();
      const success = await PurchaseManager.purchaseProduct(SKUS.adFree);
      if (success) {
        await setAdFree(true);
        Alert.alert('Success 🎉', 'Thank you! Ad-Free mode is now active on your device.');
        onClose();
      }
    } catch (e: any) {
      if (Platform.OS === 'web') {
        await setAdFree(true);
        Alert.alert('Success 🎉', 'Ad-Free mode is now active! All banner and interstitial ads are hidden.');
        onClose();
      } else {
        Alert.alert('Purchase error', 'Could not complete Ad-Free purchase. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      if (Platform.OS === 'web') {
        const active = await checkAdFreeStatus();
        if (active) {
          Alert.alert('Restored', 'Your Ad-Free status was verified and restored.');
          onClose();
        } else {
          Alert.alert('No Purchase Found', 'No previous Ad-Free purchase was detected in this browser.');
        }
        return;
      }

      const owned = await PurchaseManager.restorePurchases();
      if (owned.includes(SKUS.adFree) || owned.includes(SKUS.allAccess)) {
        await setAdFree(true);
        Alert.alert('Restored 🎉', 'Your Ad-Free purchase has been restored successfully.');
        onClose();
      } else {
        Alert.alert('No Purchase Found', 'No previous purchase of Ad-Free or All-Access was found.');
      }
    } catch {
      Alert.alert('Restore Failed', 'Unable to restore purchases at this time. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[styles.modalCard, { backgroundColor: cardBg, borderColor }]} activeOpacity={1} onPress={() => {}}>
          {/* Close X */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close">
            <Text style={[styles.closeIcon, { color: mutedColor }]}>✕</Text>
          </TouchableOpacity>

          {/* Badge & Emoji */}
          <View style={[styles.iconCircle, { backgroundColor: accent + '22', borderColor: accent + '55' }]}>
            <Text style={styles.emoji}>✨</Text>
          </View>

          <Text style={[styles.title, { color: textColor }]}>Go Ad-Free</Text>

          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Enjoy an uninterrupted, peaceful sanctuary. Hide all bottom banner ads and full-screen interstitials permanently.
          </Text>

          {isAdFree ? (
            <View style={[styles.statusBox, { backgroundColor: '#10b98122', borderColor: '#10b98166' }]}>
              <Text style={{ color: '#10b981', fontWeight: '700', fontSize: 14 }}>
                ✓ Ad-Free is Currently Active
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.buyBtn, { backgroundColor: accent }]}
              onPress={handleBuyAdFree}
              disabled={isPurchasing}
              activeOpacity={0.85}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buyBtnText}>Unlock Ad-Free • $1.99</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Restore Purchases */}
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={handleRestore}
            disabled={isRestoring}
            activeOpacity={0.7}
          >
            {isRestoring ? (
              <ActivityIndicator color={accent} size="small" />
            ) : (
              <Text style={[styles.restoreBtnText, { color: accent }]}>
                ♻️  Restore Purchase
              </Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.footerNote, { color: mutedColor }]}>
            One-time purchase • No recurring subscription
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginBottom: 16,
    marginTop: 8,
  },
  emoji: {
    fontSize: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  statusBox: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 14,
  },
  buyBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buyBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  restoreBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  restoreBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 11,
    textAlign: 'center',
  },
});
