import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppodealService from '../AppodealService';
import { useTheme } from '../ThemeContext';
import { useLocks } from '../LocksContext';
import { useBanner } from '../BannerContext';
// import PurchaseService from '../PurchaseService';  // TODO: Re-enable after configuring Google Play/App Store

interface LockedScreenProps {
  featureName: string;
  featureKey: 'seth' | 'logos' | 'christos';
  emoji: string;
  description: string;
}

export function LockedScreen({
  featureName,
  featureKey,
  emoji,
  description,
}: LockedScreenProps) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { setLockState } = useLocks();
  const { bannerTop } = useBanner();
  const bottomPadding = insets.bottom + 76;
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const handleUnlockTrial = async () => {
    setIsLoadingAd(true);

    try {
      // Show rewarded video ad using Appodeal Service
      const adCompleted = await AppodealService.showRewardedVideo();

      if (adCompleted) {
        // Ad was successfully shown, grant trial access
        setLockState(featureKey, 'test');
      } else {
        Alert.alert('Ad Cancelled', 'Please watch the full ad to unlock trial access.');
      }
    } catch (error) {
      console.warn('Error showing ad:', error);
      Alert.alert('Error', 'Failed to load ad. Please try again.');
    } finally {
      setIsLoadingAd(false);
    }
  };

  const isPurchaseButton = featureKey === 'seth' || featureKey === 'christos';
  const primaryButtonText = isPurchaseButton ? 'Purchase to Unlock' : 'Subscribe to Unlock';

  const getProductSku = () => {
    switch (featureKey) {
      case 'seth':
        return 'com.prch.pesoterica.seth';
      case 'logos':
        return 'com.prch.pesoterica.logos';
      case 'christos':
        return 'com.prch.pesoterica.christos';
      default:
        return null;
    }
  };

  const handlePurchase = async () => {
    setIsLoadingPurchase(true);
    try {
      await PurchaseService.initialize();
      const productSku = getProductSku();

      if (!productSku) {
        Alert.alert('Error', 'Product not found');
        return;
      }

      const success = await PurchaseService.purchaseProduct(productSku);

      if (success) {
        // Purchase successful, unlock the feature
        setLockState(featureKey, 'unlocked');
        Alert.alert('Success', `${featureName} has been unlocked!`);
      } else {
        Alert.alert('Purchase Cancelled', 'Your purchase was cancelled.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Purchase Failed', `Error: ${error}`);
    } finally {
      setIsLoadingPurchase(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>{featureName}</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>Feature Locked</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: containerBg }]}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bannerTop ? 60 : 0 }]}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.lockIconContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        <Text style={[styles.featureName, { color: textColor }]}>
          {emoji} {featureName}
        </Text>

        <Text style={[styles.description, { color: mutedColor }]}>
          {description}
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: '#8b5cf6' },
            isLoadingPurchase && { opacity: 0.6 },
          ]}
          onPress={handlePurchase}
          disabled={isLoadingPurchase}
        >
          {isLoadingPurchase ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>{primaryButtonText}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { backgroundColor: cardBg, borderColor: '#8b5cf6' },
            isLoadingAd && { opacity: 0.6 },
          ]}
          onPress={handleUnlockTrial}
          disabled={isLoadingAd}
        >
          {isLoadingAd ? (
            <ActivityIndicator color="#8b5cf6" size="small" />
          ) : (
            <Text style={[styles.secondaryButtonText, { color: '#8b5cf6' }]}>
              Try Free (Watch Ad)
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  lockIconContainer: {
    marginBottom: 24,
  },
  lockIcon: {
    fontSize: 80,
  },
  featureName: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  infoBox: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
