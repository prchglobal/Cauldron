/**
 * Help & About Screen
 * Displays app information, build details, and support options
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { BUILD_INFO, APP_VERSION } from '../version.config';

export const HelpScreen = () => {
  const { colors } = useTheme();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* App Title */}
      <View style={styles.header}>
        <Text style={[styles.appName, { color: colors.text }]}>
          {APP_VERSION.displayName}
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Spirituality & Wellness
        </Text>
      </View>

      {/* Build Information Section */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Build Information
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Version:</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {BUILD_INFO.version}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Build Number:</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {BUILD_INFO.buildNumber}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Platform:</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {Platform.OS === 'android' ? 'Android' : 'iOS'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.text }]}>Build Date:</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {BUILD_INFO.fullInfo.buildDate}
          </Text>
        </View>

        <View style={[styles.buildString, { backgroundColor: colors.surface }]}>
          <Text style={[styles.buildStringText, { color: colors.textSecondary }]}>
            {BUILD_INFO.buildString}
          </Text>
        </View>
      </View>

      {/* About Section */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          About The App
        </Text>

        <Text style={[styles.description, { color: colors.text }]}>
          {APP_VERSION.displayName} is your pocket guide to spirituality and wellness. Explore
          tarot readings, horoscopes, numerology, astrology, chakras, and crystals to enhance
          your spiritual journey.
        </Text>
      </View>

      {/* Support Section */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Support & Feedback
        </Text>

        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.surface }]}
          onPress={() => handleOpenLink('https://pocketmystic.app')}
        >
          <Text style={[styles.linkButtonText, { color: colors.primary }]}>
            📱 Visit Website
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.surface }]}
          onPress={() =>
            handleOpenLink(
              'mailto:support@pocketmystic.app?subject=Support%20Request'
            )
          }
        >
          <Text style={[styles.linkButtonText, { color: colors.primary }]}>
            📧 Contact Support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.surface }]}
          onPress={() => handleOpenLink('https://play.google.com/store/apps/details?id=com.prch.pmystic')}
        >
          <Text style={[styles.linkButtonText, { color: colors.primary }]}>
            ⭐ Rate on Play Store
          </Text>
        </TouchableOpacity>
      </View>

      {/* Legal Section */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Legal
        </Text>

        <TouchableOpacity
          style={styles.legalLink}
          onPress={() => handleOpenLink('https://pocketmystic.app/privacy')}
        >
          <Text style={[styles.legalLinkText, { color: colors.primary }]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.legalLink}
          onPress={() => handleOpenLink('https://pocketmystic.app/terms')}
        >
          <Text style={[styles.legalLinkText, { color: colors.primary }]}>
            Terms of Service
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          © 2025 {APP_VERSION.displayName}. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  buildString: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buildStringText: {
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  linkButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  legalLink: {
    paddingVertical: 10,
    marginBottom: 8,
  },
  legalLinkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
