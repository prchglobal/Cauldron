import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useLocks } from '../LocksContext';
import AppodealService from '../AppodealService';
import PurchaseService from '../PurchaseService';

interface WitchLockOverlayProps {
  witchType: 'Green Witch' | 'Flow Witch' | 'Cosmic Witch' | 'Spirit Witch';
  lockKey: 'witchG' | 'witchF' | 'witchC' | 'witchS';
  isLocked: boolean;
  onUnlock: () => void;
  onSubscribe: () => void;
}

export function WitchLockOverlay({
  witchType,
  lockKey,
  isLocked,
  onUnlock,
  onSubscribe,
}: WitchLockOverlayProps) {
  const { isDarkMode } = useTheme();
  const { setMultipleLockStates, unlockAllWitches } = useLocks();
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Performance monitoring - detect excessive re-renders
  const renderCountRef = useRef(0);
  const lastLogTimeRef = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current++;
    const now = Date.now();
    const timeSinceLastLog = now - lastLogTimeRef.current;

    if (timeSinceLastLog > 3000) {
      const rendersPerSecond = (renderCountRef.current / timeSinceLastLog) * 1000;
      console.log(`[WitchLockOverlay:${lockKey}] Render rate: ${rendersPerSecond.toFixed(2)} renders/sec`);

      if (rendersPerSecond > 5) {
        console.warn(
          `[WitchLockOverlay:${lockKey}] WARNING: High render rate (${rendersPerSecond.toFixed(2)}/sec)! ` +
          `Props: isLocked=${isLocked}, witchType=${witchType}`
        );
      }

      renderCountRef.current = 0;
      lastLogTimeRef.current = now;
    }
  });

  // Reset dismissed state when lock state changes
  useEffect(() => {
    setIsDismissed(false);
  }, [isLocked]);

  // Don't reset on every focus - useEffect handles it when isLocked changes
  // Removing useFocusEffect to prevent cascading re-renders

  const handleClose = () => {
    setIsDismissed(true);
    onUnlock();
  };

  const handleWatchAd = async () => {
    console.log('[WitchLockOverlay] handleWatchAd called for:', lockKey);
    setIsShowingAd(true);
    try {
      // Pre-cache the rewarded video
      console.log('[WitchLockOverlay] Pre-caching rewarded video...');
      AppodealService.precacheRewardedVideo();

      // Show the rewarded video
      console.log('[WitchLockOverlay] Showing rewarded video...');
      const watched = await AppodealService.showRewardedVideo();
      console.log('[WitchLockOverlay] Ad completion result:', watched);

      if (watched) {
        console.log('[WitchLockOverlay] User watched ad successfully, unlocking witch:', lockKey);
        // Unlock this witch and lock all others
        const updates: Record<string, 'unlocked' | 'locked'> = {
          [lockKey]: 'unlocked',
          witchG: lockKey === 'witchG' ? 'unlocked' : 'locked',
          witchF: lockKey === 'witchF' ? 'unlocked' : 'locked',
          witchC: lockKey === 'witchC' ? 'unlocked' : 'locked',
          witchS: lockKey === 'witchS' ? 'unlocked' : 'locked',
        };
        console.log('[WitchLockOverlay] Lock updates:', updates);

        await setMultipleLockStates(updates as any);
        console.log('[WitchLockOverlay] Lock state updated, calling onUnlock callback');

        onUnlock();
      } else {
        console.warn('[WitchLockOverlay] User did not watch the complete ad');
      }
    } catch (error) {
      console.error('[WitchLockOverlay] Error showing rewarded video:', error);
    } finally {
      console.log('[WitchLockOverlay] Hiding ad loading indicator');
      setIsShowingAd(false);
    }
  };

  const handleSubscribe = async () => {
    console.log('[WitchLockOverlay] handleSubscribe called');
    setIsShowingAd(true);
    try {
      console.log('[WitchLockOverlay] Attempting subscription purchase...');
      const success = await PurchaseService.purchaseSubscription();

      if (success) {
        console.log('[WitchLockOverlay] Subscription purchase successful, unlocking all witches');
        await unlockAllWitches();
        console.log('[WitchLockOverlay] All witches unlocked, calling onUnlock callback');
        onUnlock();
      } else {
        console.warn('[WitchLockOverlay] Subscription purchase failed or cancelled');
      }
    } catch (error) {
      console.error('[WitchLockOverlay] Error purchasing subscription:', error);
    } finally {
      console.log('[WitchLockOverlay] Hiding subscription loading indicator');
      setIsShowingAd(false);
    }
  };

  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  if (!isLocked) {
    return null;
  }

  return (
    <Modal visible={isLocked && !isDismissed} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity style={[styles.container, { backgroundColor: cardBg }]} activeOpacity={1} onPress={() => {}}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={[styles.closeIcon, { color: 'rgba(0,0,0,0.5)' }]}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.lockEmoji]}>🔒</Text>

          <Text style={[styles.title, { color: textColor }]}>
            Unlock {witchType}
          </Text>

          <Text style={[styles.description, { color: mutedColor }]}>
            Subscribe to unlock all practices and mystical paths.
          </Text>

          

          <TouchableOpacity
            style={[styles.subscribeButton, { backgroundColor: '#ef4444' }]}
            onPress={handleSubscribe}
            disabled={isShowingAd}
          >
            {isShowingAd ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.subscribeButtonText}>Subscribe Instead</Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.note, { color: mutedColor }]}>
            Subscribe to unlock all practices and mystical paths.</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  closeIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  lockEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
