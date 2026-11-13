import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, TextInput, Modal
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { AIR_CRYSTALS } from '../data/airCrystalsDatabase';
import { FIRE_CRYSTALS } from '../data/fireCrystalsDatabase';
import { WATER_CRYSTALS } from '../data/waterCrystalsDatabase';
import { EARTH_CRYSTALS } from '../data/earthCrystalsDatabase';

// Combine all crystals with element tags
const ALL_CRYSTALS = [
  ...AIR_CRYSTALS.map(c => ({ ...c, element: 'Air' })),
  ...FIRE_CRYSTALS.map(c => ({ ...c, element: 'Fire' })),
  ...WATER_CRYSTALS.map(c => ({ ...c, element: 'Water' })),
  ...EARTH_CRYSTALS.map(c => ({ ...c, element: 'Earth' })),
];

export default function CrystalReferenceScreen() {
  const { themeMode } = useTheme();
  const { bannerTop } = useBanner();

  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedCrystal, setSelectedCrystal] = useState<any>(null);
  const [selectedCrystalIndex, setSelectedCrystalIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Theme colors
  const bgColor = themeMode === 'dark' ? '#1a1a2e' : '#f5f3ff';
  const cardBg = themeMode === 'dark' ? '#16213e' : '#fff';
  const textColor = themeMode === 'dark' ? '#e0e0e0' : '#333';
  const mutedColor = themeMode === 'dark' ? '#9ca3af' : '#6b7280';
  const accentColor = themeMode === 'dark' ? '#ef4444' : '#3b82f6';

  // Filter crystals
  const filteredCrystals = useMemo(() => {
    let crystals = ALL_CRYSTALS;

    if (selectedElement) {
      crystals = crystals.filter(c => c.element === selectedElement);
    }

    if (searchQuery) {
      crystals = crystals.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.properties.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return crystals;
  }, [searchQuery, selectedElement]);

  // Element filter buttons
  const elementColors = {
    Air: '#60a5fa',
    Fire: '#f97316',
    Water: '#06b6d4',
    Earth: '#84cc16',
  };

  // Navigation handlers
  const handleCrystalPress = (crystal: any, index: number) => {
    setSelectedCrystal(crystal);
    setSelectedCrystalIndex(index);
    setCurrentView('detail');
  };

  const handlePrevious = () => {
    if (selectedCrystalIndex > 0) {
      const newIndex = selectedCrystalIndex - 1;
      setSelectedCrystalIndex(newIndex);
      setSelectedCrystal(filteredCrystals[newIndex]);
    }
  };

  const handleNext = () => {
    if (selectedCrystalIndex < filteredCrystals.length - 1) {
      const newIndex = selectedCrystalIndex + 1;
      setSelectedCrystalIndex(newIndex);
      setSelectedCrystal(filteredCrystals[newIndex]);
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedCrystal(null);
  };

  // Render list view
  if (currentView === 'list') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>Crystal Reference</Text>
          <TextInput
            style={[styles.searchInput, { backgroundColor: bgColor, color: textColor }]}
            placeholder="Search crystals..."
            placeholderTextColor={mutedColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Element Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, !selectedElement && { backgroundColor: accentColor }]}
              onPress={() => setSelectedElement(null)}
            >
              <Text style={styles.filterText}>All</Text>
            </TouchableOpacity>
            {Object.keys(elementColors).map(element => (
              <TouchableOpacity
                key={element}
                style={[
                  styles.filterButton,
                  selectedElement === element && { backgroundColor: elementColors[element] }
                ]}
                onPress={() => setSelectedElement(element)}
              >
                <Text style={styles.filterText}>{element}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView}>
          {filteredCrystals.map((crystal, index) => (
            <TouchableOpacity
              key={`${crystal.element}-${crystal.id}`}
              style={[styles.crystalCard, { backgroundColor: cardBg }]}
              onPress={() => handleCrystalPress(crystal, index)}
            >
              <View style={styles.crystalInfo}>
                <Text style={[styles.crystalName, { color: textColor }]}>
                  {crystal.emoji} {crystal.name}
                </Text>
                <Text style={[styles.crystalPurpose, { color: mutedColor }]}>
                  {crystal.purpose}
                </Text>
                <View style={[styles.elementBadge, { backgroundColor: elementColors[crystal.element] }]}>
                  <Text style={styles.elementText}>{crystal.element}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render detail view
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.detailHeader, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={[styles.backText, { color: accentColor }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={selectedCrystalIndex === 0}
            style={[styles.navButton, selectedCrystalIndex === 0 && styles.navButtonDisabled]}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={selectedCrystalIndex === filteredCrystals.length - 1}
            style={[styles.navButton, selectedCrystalIndex === filteredCrystals.length - 1 && styles.navButtonDisabled]}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.detailContent}>
        {selectedCrystal && (
          <View style={[styles.detailCard, { backgroundColor: cardBg }]}>
            {/* Crystal Header with Image Button */}
            <View style={styles.crystalHeader}>
              <Text style={styles.crystalEmoji}>{selectedCrystal.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailCrystalName, { color: textColor }]}>
                  {selectedCrystal.name}
                </Text>
                <Text style={[styles.crystalColor, { color: mutedColor }]}>
                  {selectedCrystal.color}
                </Text>
              </View>
            </View>

            {/* Crystal Details */}
            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Purpose</Text>
              <Text style={[styles.sectionText, { color: mutedColor }]}>{selectedCrystal.purpose}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Properties</Text>
              <View style={styles.propertiesList}>
                {selectedCrystal.properties.map((prop: string, i: number) => (
                  <View key={i} style={[styles.propertyBadge, { backgroundColor: accentColor }]}>
                    <Text style={styles.propertyText}>{prop}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Benefits</Text>
              <Text style={[styles.sectionText, { color: mutedColor }]}>{selectedCrystal.benefits}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Chakra</Text>
              <Text style={[styles.sectionText, { color: mutedColor }]}>{selectedCrystal.chakra}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>How to Use</Text>
              {selectedCrystal.howToUse.map((use: string, i: number) => (
                <Text key={i} style={[styles.listItem, { color: mutedColor }]}>• {use}</Text>
              ))}
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Cleansing</Text>
              <Text style={[styles.sectionText, { color: mutedColor }]}>{selectedCrystal.cleansing}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Placement</Text>
              <Text style={[styles.sectionText, { color: mutedColor }]}>{selectedCrystal.placement}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Zodiac Sign</Text>
              <Text style={[styles.sectionText, { color: mutedColor }]}>{selectedCrystal.zodiacSign}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Affirmation</Text>
              <Text style={[styles.affirmationText, { color: accentColor }]}>"{selectedCrystal.affirmation}"</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Safety Notes</Text>
              <Text style={[styles.sectionText, { color: mutedColor }]}>{selectedCrystal.safetyNotes}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#4b5563',
    marginRight: 8,
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  crystalCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crystalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  crystalInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  crystalName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  crystalPurpose: {
    fontSize: 14,
    marginBottom: 8,
  },
  elementBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  elementText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#8b5cf6',
  },
  navButtonDisabled: {
    backgroundColor: '#6b7280',
    opacity: 0.5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailContent: {
    flex: 1,
  },
  detailCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crystalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  crystalEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  detailCrystalName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  crystalColor: {
    fontSize: 14,
    marginTop: 4,
  },
  photoButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  photoButtonIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  photoButtonText: {
    fontSize: 10,
    fontWeight: '500',
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  propertiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  propertyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  affirmationText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoModalContent: {
    borderRadius: 16,
    padding: 20,
    maxWidth: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  photoModalImage: {
    width: 300,
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
  },
  photoCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  photoCloseText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  photoCaption: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  imageErrorContainer: {
    width: 300,
    height: 400,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  imageErrorText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
