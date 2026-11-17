/**
 * Cauldron main menu - accordion hub.
 * Each house is a Title that expands in place to reveal its sub-categories as a
 * list; tapping a sub-category opens it directly (the house stack uses the
 * category as its initial route, so the back button returns here). The Help
 * title has no sub-items and opens directly.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../shared/ThemeContext';
import { useBanner } from '../shared/BannerContext';
import { AdFreeModal } from '../shared/components/AdFreeModal';
import PwaService from '../shared/PwaService';
import { ToastService } from '../apps/help/services/ToastService';

interface Item {
  label: string;
  emoji: string;
  category: string; // route name inside the house stack
}

interface House {
  title: string;
  emoji: string;
  route: string; // root-stack screen name
  accentDark: string;
  accentLight: string;
  items: Item[];
  utility?: boolean;
  directRoute?: boolean; // tap the title to open the route (no sub-items)
  params?: any;
}

const HOUSES: House[] = [
  {
    title: 'Witchery',
    emoji: '🧙‍♀️',
    route: 'Witch',
    accentDark: '#8b5cf6',
    accentLight: '#8b5cf6',
    items: [
      { label: 'Green Witch', emoji: '🌿', category: 'GreenWitch' },
      { label: 'Flow Witch', emoji: '🌊', category: 'FlowWitch' },
      { label: 'Spirit Witch', emoji: '🌬️', category: 'SpiritWitch' },
      { label: 'Cosmic Witch', emoji: '☄️', category: 'CosmicWitch' },
    ],
  },
  {
    title: 'Occult',
    emoji: '🕯️',
    route: 'Occultist',
    accentDark: '#C41E3A',
    accentLight: '#0099CC',
    items: [
      { label: 'Hermetic', emoji: '☀️', category: 'Hermetic' },
      { label: 'Alchemical', emoji: '🌹', category: 'Alchemical' },
      { label: 'Qabalistic', emoji: '🌀', category: 'Qabalistic' },
      { label: 'Solomonic', emoji: '📐', category: 'Solomonic' },
    ],
  },
  {
    title: 'Gnosis',
    emoji: '📜',
    route: 'Gnosis',
    accentDark: '#ef4444',
    accentLight: '#3b82f6',
    items: [
      { label: 'Mandaeism', emoji: '🌙', category: 'Mandaeism' },
      { label: 'Manichaean', emoji: '☯️', category: 'Manichaean' },
      { label: 'Zoroastrianism', emoji: '🔥', category: 'Zoroastrianism' },
    ],
  },
  {
    title: 'Magick',
    emoji: '⚡',
    route: 'Magick',
    accentDark: '#C41E3A',
    accentLight: '#0099CC',
    items: [
      { label: 'Lucifer', emoji: '😈', category: 'Lucifer' },
      { label: 'Enoch', emoji: '😇', category: 'Enoch' },
    ],
  },
  {
    title: 'Esoterica',
    emoji: '✨',
    route: 'Esoterica',
    accentDark: '#FF99B9',
    accentLight: '#87CEEB',
    items: [
      { label: 'Sophia', emoji: '🕊️', category: 'Sophia' },
      { label: 'Seth', emoji: '🐍', category: 'Seth' },
      { label: 'Logos', emoji: '☀️', category: 'Logos' },
      { label: 'Christos', emoji: '👑', category: 'Christos' },
    ],
  },
  {
    title: 'Pegan',
    emoji: '🌳',
    route: 'Pegan',
    accentDark: '#2ea043',
    accentLight: '#0099CC',
    items: [
      { label: 'Tethering', emoji: '🦋', category: 'Tethering' },
      { label: 'Mediation', emoji: '🐋', category: 'Mediation' },
      { label: 'Continuity', emoji: '🐉', category: 'Continuity' },
      { label: 'Regeneration', emoji: '🐍', category: 'Regeneration' },
      { label: 'Ritual Book', emoji: '📖', category: 'RitualBook' },
    ],
  },
  {
    title: 'Tool Kit',
    emoji: '🧰',
    route: 'Tools',
    accentDark: '#8b5cf6',
    accentLight: '#8b5cf6',
    utility: true,
    items: [
      { label: 'Tarot Cards', emoji: '🔮', category: 'Tarot' },
      { label: 'Palmistry', emoji: '✋', category: 'Palmistry' },
      { label: 'Numerology', emoji: '🔢', category: 'Numerology' },
      { label: 'Gematria', emoji: '✡️', category: 'Gematria' },
      { label: 'Moon Phases', emoji: '🌙', category: 'MoonPhase' },
      { label: 'Horoscopes', emoji: '✨', category: 'Horoscopes' },
      { label: 'Astrology', emoji: '🌌', category: 'Astrology' },
      { label: 'Chakras', emoji: '⚡', category: 'Chakras' },
      { label: 'Crystals', emoji: '💎', category: 'Crystals' },
    ],
  },
  {
    title: 'Notifications',
    emoji: '🔔',
    route: 'Tools',
    params: { category: 'Notifications' },
    accentDark: '#a855f7',
    accentLight: '#a855f7',
    utility: true,
    directRoute: true,
    items: [],
  },
  {
    title: 'Help',
    emoji: '❓',
    route: 'Help',
    accentDark: '#64748b',
    accentLight: '#64748b',
    utility: true,
    directRoute: true,
    items: [],
  },
];

export function MainMenuScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode, themeMode, setThemeMode } = useTheme();
  const { bannerTop, isAdFree } = useBanner();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAdFreeModal, setShowAdFreeModal] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsPwaInstalled(PwaService.isStandalone());
      const unsub = PwaService.subscribe(() => {
        setIsPwaInstalled(PwaService.isStandalone());
      });
      return unsub;
    }
  }, []);

  const handleInstallWebApp = async () => {
    const { installed, notifications } = await PwaService.promptInstallAndEnableNotifications();
    if (notifications) {
      ToastService.show('Notifications enabled for desktop/mobile!', 'long');
    }
    if (installed) {
      setIsPwaInstalled(true);
      ToastService.show('Cauldron Web App installed!', 'long');
    }
  };

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const subBg = isDarkMode ? '#242424' : '#fafafa';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const borderColor = isDarkMode ? '#3a3a3a' : '#eee';

  const bottomPadding = insets.bottom + 76;

  const onTitlePress = (house: House) => {
    if (house.directRoute) {
      navigation.navigate(house.route, house.params);
      return;
    }
    setExpanded((prev) => ({ ...prev, [house.route]: !prev[house.route] }));
  };

  const openCategory = (house: House, item: Item) => {
    navigation.navigate(house.route, { category: item.category });
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1a1a1a' : '#fff'}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 24, paddingBottom: bottomPadding },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: textColor }]}>🫙 Cauldron</Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}>
              Choose a path, then a practice
            </Text>
          </View>
          {Platform.OS === 'web' && !isPwaInstalled && (
            <TouchableOpacity
              style={[
                styles.installButton,
                {
                  backgroundColor: isDarkMode ? '#2d2448' : '#ede9fe',
                  borderColor: '#8b5cf6',
                },
              ]}
              onPress={handleInstallWebApp}
              accessibilityLabel="Install Web App"
            >
              <Text style={[styles.installButtonText, { color: '#8b5cf6' }]}>
                📲 Install Web App
              </Text>
            </TouchableOpacity>
          )}
          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={[
                styles.adFreeButton,
                {
                  backgroundColor: isAdFree ? (isDarkMode ? '#064e3b' : '#d1fae5') : (isDarkMode ? '#2d2448' : '#ede9fe'),
                  borderColor: isAdFree ? '#10b981' : '#8b5cf6',
                },
              ]}
              onPress={() => setShowAdFreeModal(true)}
              accessibilityLabel="Ad Free Options"
            >
              <Text
                style={[
                  styles.adFreeButtonText,
                  { color: isAdFree ? '#10b981' : '#8b5cf6' },
                ]}
              >
                {isAdFree ? '🛡️ Ad-Free' : '✨ Ad-Free $1.99'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: cardBg, borderColor }]}
            onPress={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            accessibilityLabel="Toggle theme"
          >
            <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {HOUSES.map((house, i) => {
          const accent = isDarkMode ? house.accentDark : house.accentLight;
          const isOpen = !!expanded[house.route];
          const isToolKit = house.title === 'Tool Kit';
          const isHelp = house.title === 'Help';
          return (
            <React.Fragment key={house.title}>
              {isToolKit && (
                <Text style={[styles.groupLabel, { color: mutedColor }]}>TOOLS</Text>
              )}
              {isHelp && (
                <Text style={[styles.groupLabel, { color: mutedColor }]}>SUPPORT</Text>
              )}
              <TouchableOpacity
                style={[styles.titleRow, { backgroundColor: cardBg, borderLeftColor: accent }]}
                onPress={() => onTitlePress(house)}
                activeOpacity={0.7}
              >
                <Text style={styles.titleEmoji}>{house.emoji}</Text>
                <Text style={[styles.titleText, { color: textColor }]}>{house.title}</Text>
                {!house.directRoute && (
                  <Text style={[styles.chevron, { color: mutedColor }]}>{isOpen ? '▾' : '▸'}</Text>
                )}
                {house.directRoute && <Text style={[styles.chevron, { color: accent }]}>›</Text>}
              </TouchableOpacity>

              {isOpen && !house.directRoute && (
                <View style={[styles.itemsWrap, { backgroundColor: subBg, borderColor }]}>
                  {house.items.map((item) => (
                    <TouchableOpacity
                      key={item.category}
                      style={[styles.itemRow, { borderLeftColor: accent }]}
                      onPress={() => openCategory(house, item)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.itemEmoji}>{item.emoji}</Text>
                      <Text style={[styles.itemText, { color: textColor }]}>{item.label}</Text>
                      <Text style={[styles.itemChevron, { color: mutedColor }]}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>

      <AdFreeModal
        visible={showAdFreeModal}
        onClose={() => setShowAdFreeModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { flex: 1 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 4 },
  installButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  installButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  adFreeButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  adFreeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  titleEmoji: { fontSize: 24, marginRight: 12 },
  titleText: { flex: 1, fontSize: 18, fontWeight: '600' },
  chevron: { fontSize: 18, marginLeft: 8, width: 22, textAlign: 'center' },
  itemsWrap: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
  },
  itemEmoji: { fontSize: 18, marginRight: 12, width: 24, textAlign: 'center' },
  itemText: { flex: 1, fontSize: 15 },
  itemChevron: { fontSize: 20, fontWeight: '300', marginLeft: 8 },
});
