import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useLocks } from '../LocksContext';
import AppodealService from '../AppodealService';
import PurchaseService from '../PurchaseService';

interface PracticeLockOverlayProps {
  practiceType: 'Tethering' | 'Intercession' | 'Continuity' | 'Regeneration';
  lockKey: 'practiceTethering' | 'practiceIntercession' | 'practiceContinuity' | 'practiceRegeneration';
  isLocked: boolean;
  onUnlock: () => void;
  onSubscribe: () => void;
}

export function PracticeLockOverlay({
  practiceType,
  lockKey,
  isLocked,
  onUnlock,
  onSubscribe,
}: PracticeLockOverlayProps) {
  const { isDarkMode } = useTheme();
  const { setMultipleLockStates, unlockAllPractices } = useLocks();
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
      console.log(`[PracticeLockOverlay:${lockKey}] Render rate: ${rendersPerSecond.toFixed(2)} renders/sec`);

      if (rendersPerSecond > 5) {
        console.warn(
          `[PracticeLockOverlay:${lockKey}] WARNING: High render rate (${rendersPerSecond.toFixed(2)}/sec)! ` +
          `Props: isLocked=${isLocked}, practiceType=${practiceType}`
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
    console.log('[PracticeLockOverlay] handleWatchAd called for:', lockKey);
    setIsShowingAd(true);
    try {
      // Pre-cache the rewarded video
      console.log('[PracticeLockOverlay] Pre-caching rewarded video...');
      AppodealService.precacheRewardedVideo();

      // Show the rewarded video
      console.log('[PracticeLockOverlay] Showing rewarded video...');
      const watched = await AppodealService.showRewardedVideo();
      console.log('[PracticeLockOverlay] Ad completion result:', watched);

      if (watched) {
        console.log('[PracticeLockOverlay] User watched ad successfully, unlocking practice:', lockKey);
        // Unlock this practice and lock all others
        const updates: Record<string, 'unlocked' | 'locked'> = {
          [lockKey]: 'unlocked',
          practiceTethering: lockKey === 'practiceTethering' ? 'unlocked' : 'locked',
          practiceIntercession: lockKey === 'practiceIntercession' ? 'unlocked' : 'locked',
          practiceContinuity: lockKey === 'practiceContinuity' ? 'unlocked' : 'locked',
          practiceRegeneration: lockKey === 'practiceRegeneration' ? 'unlocked' : 'locked',
        };
        console.log('[PracticeLockOverlay] Lock updates:', updates);

        await setMultipleLockStates(updates as any);
        console.log('[PracticeLockOverlay] Lock state updated, calling onUnlock callback');

        onUnlock();
      } else {
        console.warn('[PracticeLockOverlay] User did not watch the complete ad');
      }
    } catch (error) {
      console.error('[PracticeLockOverlay] Error showing rewarded video:', error);
    } finally {
      console.log('[PracticeLockOverlay] Hiding ad loading indicator');
      setIsShowingAd(false);
    }
  };

  const handleSubscribe = async () => {
    console.log('[PracticeLockOverlay] handleSubscribe called');
    setIsShowingAd(true);
    try {
      console.log('[PracticeLockOverlay] Attempting subscription purchase...');
      const success = await PurchaseService.purchaseSubscription();

      if (success) {
        console.log('[PracticeLockOverlay] Subscription purchase successful, unlocking all practices');
        await unlockAllPractices();
        console.log('[PracticeLockOverlay] All practices unlocked, calling onUnlock callback');
        onUnlock();
      } else {
        console.warn('[PracticeLockOverlay] Subscription purchase failed or cancelled');
      }
    } catch (error) {
      console.error('[PracticeLockOverlay] Error purchasing subscription:', error);
    } finally {
      console.log('[PracticeLockOverlay] Hiding subscription loading indicator');
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
            Unlock {practiceType}
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

          <Text style={[styles.note, { color: mutedColor }]}
          >
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
  adButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  adButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
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
