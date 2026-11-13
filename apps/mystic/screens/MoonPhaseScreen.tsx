import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import {
  calculateMoonPhase,
  getNextPhaseDates,
  getMonthCalendar,
  formatDateFull,
  type MoonPhaseInfo,
  type NextPhaseDate,
} from '../utils/MoonPhaseCalculator';

export function MoonPhaseScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const bottomPadding = insets.bottom + 76;

  const current: MoonPhaseInfo = useMemo(() => calculateMoonPhase(selectedDate), [selectedDate]);
  const nextPhases: NextPhaseDate[] = useMemo(() => getNextPhaseDates(selectedDate, 4), [selectedDate]);
  const calendar: MoonPhaseInfo[] = useMemo(() => getMonthCalendar(selectedDate, 14), [selectedDate]);

  return (
    <View style={[styles.screen, { backgroundColor: containerBg }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: bottomPadding }}>
        <Text style={[styles.title, { color: textColor }]}>🌙 Moon Phases</Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>Track the lunar cycle</Text>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: cardBg }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={[styles.dateLabel, { color: mutedColor }]}>Date</Text>
          <Text style={[styles.dateValue, { color: textColor }]}>{formatDateFull(selectedDate)}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event, date) => {
              setShowPicker(Platform.OS === 'ios');
              if (date) setSelectedDate(date);
            }}
          />
        )}

        <View style={[styles.card, styles.currentCard, { backgroundColor: cardBg }]}>
          <Text style={styles.currentEmoji}>{current.phaseEmoji}</Text>
          <Text style={[styles.currentName, { color: textColor }]}>{current.phaseName}</Text>
          <Text style={[styles.currentIllum, { color: mutedColor }]}>
            {Math.round(current.illumination)}% illuminated · {current.zodiacEmoji} {current.zodiacSign}
          </Text>
        </View>

        <Text style={[styles.sectionHeader, { color: textColor }]}>Upcoming phases</Text>
        {nextPhases.map((p, i) => (
          <View key={i} style={[styles.row, { backgroundColor: cardBg }]}>
            <Text style={styles.rowEmoji}>{p.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowName, { color: textColor }]}>{p.phaseName}</Text>
              <Text style={[styles.rowDate, { color: mutedColor }]}>{formatDateFull(p.date)}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionHeader, { color: textColor }]}>Next 14 days</Text>
        {calendar.map((d, i) => {
          const dayDate = new Date(selectedDate);
          dayDate.setDate(dayDate.getDate() + i);
          return (
            <View key={i} style={[styles.row, { backgroundColor: cardBg }]}>
              <Text style={styles.rowEmoji}>{d.phaseEmoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowName, { color: textColor }]}>{d.phaseName}</Text>
                <Text style={[styles.rowDate, { color: mutedColor }]}>
                  {formatDateFull(dayDate)} · {Math.round(d.illumination)}%
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 4, marginBottom: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  dateLabel: { fontSize: 12 },
  dateValue: { fontSize: 18, fontWeight: '600', marginTop: 2 },
  currentCard: { alignItems: 'center', paddingVertical: 24 },
  currentEmoji: { fontSize: 56 },
  currentName: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  currentIllum: { fontSize: 14, marginTop: 4 },
  sectionHeader: { fontSize: 16, fontWeight: '600', marginTop: 8, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  rowEmoji: { fontSize: 26, marginRight: 12 },
  rowName: { fontSize: 15, fontWeight: '500' },
  rowDate: { fontSize: 12, marginTop: 2 },
});
