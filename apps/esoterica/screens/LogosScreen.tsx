import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '../ThemeContext';
import { useLocks } from '../LocksContext';
import { ToastService } from '../services/ToastService';
import { AdService } from '../services/AdService';

const LOGOS_PRACTICES = [
  'Cognitive Purification',
  'Imaginative Activation',
  'Interior Coherence',
  'Rhythmic Integration',
  'Structural Differentiation',
];

export function LogosScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const { isPracticeLocked, setMultipleLockStates } = useLocks();
  const [unlocking, setUnlocking] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const buttonColors = ['#FF99B9', '#FF69B4', '#FF1493', '#DC143C', '#8B0000'];

  // Check if any practices are locked
  const anyLocked = LOGOS_PRACTICES.some((_, index) => isPracticeLocked('logos', index));

  // Check if all practices are locked
  const allLocked = LOGOS_PRACTICES.every((_, index) => isPracticeLocked('logos', index));

  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected ?? false;
    } catch (error) {
      console.warn('[LogosScreen] Error checking internet connection:', error);
      return false;
    }
  };

  const handleUnlockAll = async () => {
    // Check internet connection first
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Please establish an internet connection before proceeding', [{ text: 'OK' }]);
      return;
    }

    Alert.alert(
      'Unlock All Practices?',
      'Are you sure you want to unlock this entire section?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Unlock',
          onPress: async () => {
            setUnlocking(true);
            try {
              // Show 100% video ad and wait for completion
              await AdService.showRewardedVideoAd(100);

              // Ad completed, now unlock all practices
              const updates: Record<string, 'unlocked'> = {};
              for (let i = 0; i < LOGOS_PRACTICES.length; i++) {
                updates[`logos_practice_${i + 1}`] = 'unlocked';
              }
              await setMultipleLockStates(updates);
              ToastService.show('All practices unlocked!');
            } catch (error) {
              console.error('[LogosScreen] Error unlocking practices:', error);
              ToastService.show('Failed to unlock practices', 'short');
            } finally {
              setUnlocking(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleStartSectionAnyway = async () => {
    // Check internet connection first
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Please establish an internet connection before proceeding', [{ text: 'OK' }]);
      return;
    }

    Alert.alert(
      'Start This Section?',
      'Are you sure you want to start this section?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            setUnlocking(true);
            try {
              // Show 40% chance video ad before unlocking
              await AdService.showRewardedVideoAd(40);

              // Unlock only practice #1
              await setMultipleLockStates({ 'logos_practice_1': 'unlocked' });
              ToastService.show('Practice 1 unlocked!');
            } catch (error) {
              console.error('[LogosScreen] Error unlocking practice 1:', error);
              ToastService.show('Failed to unlock practice', 'short');
            } finally {
              setUnlocking(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handlePracticePress = async (practice: string, index: number, color: string) => {
    const locked = isPracticeLocked('logos', index);

    if (locked) {
      if (index === 0) {
        ToastService.show('Finish Seth first.');
      } else {
        ToastService.show(`Finish ${LOGOS_PRACTICES[index - 1]} first.`);
      }
      return;
    }

    // Show 15% chance video ad before opening practice
    await AdService.showRewardedVideoAd(15);

    navigation.navigate('PracticeDetail' as never, {
      practiceName: practice,
      practiceNumber: index + 1,
      screenName: 'Logos',
      buttonColor: color,
    } as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBg, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#fff' }]}>Logos ☀️</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>Consciousness Ordering</Text>
        </View>

        <View style={[styles.practicesContainer, { paddingHorizontal: 16 }]}>
          {allLocked ? (
            <View style={[styles.recommendationCard, { backgroundColor: '#ccc', opacity: 0.8 }]}>
              <Text style={[styles.recommendationText, { color: '#fff' }]}>
                We recommend finishing Seth first
              </Text>
            </View>
          ) : (
            LOGOS_PRACTICES.map((practice, index) => {
              const locked = isPracticeLocked('logos', index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.practiceButton,
                    {
                      backgroundColor: buttonColors[index],
                      opacity: locked ? 0.4 : 1,
                    }
                  ]}
                  onPress={() => handlePracticePress(practice, index, buttonColors[index])}
                >
                  <Text style={[styles.practiceText, { color: '#fff' }]}>
                    {index + 1}. {practice}{locked ? ' 🔒' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}

          {allLocked && (
            <TouchableOpacity
              style={[styles.startSectionButton, { marginTop: 20 }]}
              onPress={handleStartSectionAnyway}
              disabled={unlocking}
            >
              <Text style={[styles.startSectionText]}>
                {unlocking ? 'Starting...' : 'Start This Section Anyway'}
              </Text>
            </TouchableOpacity>
          )}

          {anyLocked && !allLocked && (
            <TouchableOpacity
              style={[styles.unlockAllButton, { marginTop: 20 }]}
              onPress={handleUnlockAll}
              disabled={unlocking}
            >
              <Text style={[styles.unlockAllText]}>
                {unlocking ? 'Unlocking...' : 'Unlock All Now'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  practicesContainer: {
    paddingBottom: 24,
    gap: 12,
  },
  practiceButton: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceText: {
    fontSize: 18,
    fontWeight: '600',
  },
  unlockAllButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationCard: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  startSectionButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  startSectionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
