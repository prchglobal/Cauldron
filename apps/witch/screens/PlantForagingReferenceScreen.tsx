import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { FORAGING_PLANTS } from '../data/plantForagingDatabase';

export function PlantForagingReferenceScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const [selectedPlant, setSelectedPlant] = useState<typeof FORAGING_PLANTS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accentColor = '#8b5cf6';
  const borderColor = isDarkMode ? '#444' : '#e0e0e0';
  const inputBg = isDarkMode ? '#333' : '#f0f0f0';

  const filteredPlants = FORAGING_PLANTS.filter((plant) =>
    plant.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.latinName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedPlant) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
        <ScrollView
          style={[styles.container, { backgroundColor: containerBg }]}
          contentContainerStyle={{ paddingBottom: bannerTop ? 80 : 40 }}
        >
          {/* Header with back button */}
          <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedPlant(null)}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.plantEmoji, { marginTop: 12 }]}>
              {selectedPlant.emoji}
            </Text>
            <Text style={[styles.plantName, { color: textColor }]}>
              {selectedPlant.commonName}
            </Text>
            <Text style={[styles.latinName, { color: mutedColor }]}>
              {selectedPlant.latinName}
            </Text>
          </View>

          {/* Overview */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Overview</Text>
            <Text style={[styles.sectionText, { color: mutedColor }]}>
              {selectedPlant.description}
            </Text>
          </View>

          {/* Identification */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Identification</Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Leaf Shape:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.identification.leafShape}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Stem:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.identification.stem}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Flowers:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.identification.flowers}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Height:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.identification.height}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Scent:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.identification.scent}
              </Text>
            </View>
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Lookalikes:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.identification.lookalikes}
              </Text>
            </View>
          </View>

          {/* Harvesting Guide */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Harvesting Guide</Text>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Best Seasons</Text>
              {selectedPlant.harvestingGuide.bestSeasons.map((season, idx) => (
                <Text key={idx} style={[styles.bulletItem, { color: mutedColor }]}>
                  • {season}
                </Text>
              ))}
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Parts to Harvest</Text>
              {selectedPlant.harvestingGuide.partsToHarvest.map((part, idx) => (
                <Text key={idx} style={[styles.bulletItem, { color: mutedColor }]}>
                  • {part}
                </Text>
              ))}
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Tips</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.harvestingGuide.harvestingTips}
              </Text>
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Sustainable Practices</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.harvestingGuide.sustainablePractices}
              </Text>
            </View>
          </View>

          {/* Medicinal Uses */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Medicinal Uses</Text>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Properties</Text>
              {selectedPlant.medicinalUses.properties.map((prop, idx) => (
                <Text key={idx} style={[styles.bulletItem, { color: mutedColor }]}>
                  • {prop}
                </Text>
              ))}
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Preparation</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.medicinalUses.teas}
              </Text>
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Dosage</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.medicinalUses.dosage}
              </Text>
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Cautions</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.medicinalUses.cautions}
              </Text>
            </View>
          </View>

          {/* Magical Properties */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Magical Properties</Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Element:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.magicalProperties.element}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Planet:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.magicalProperties.planet}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: textColor }]}>Chakra:</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.magicalProperties.chakra}
              </Text>
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Correspondences</Text>
              {selectedPlant.magicalProperties.correspondences.map((corr, idx) => (
                <Text key={idx} style={[styles.bulletItem, { color: mutedColor }]}>
                  • {corr}
                </Text>
              ))}
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Magical Uses</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.magicalProperties.magicalUses}
              </Text>
            </View>
          </View>

          {/* Preservation */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Preservation Methods</Text>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Drying</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.preservation.drying}
              </Text>
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Storage</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.preservation.storage}
              </Text>
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Freezing</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.preservation.freezing}
              </Text>
            </View>
            <View style={styles.subsection}>
              <Text style={[styles.subheading, { color: accentColor }]}>Other Preservation</Text>
              <Text style={[styles.infoValue, { color: mutedColor }]}>
                {selectedPlant.preservation.preservation}
              </Text>
            </View>
          </View>

          {/* Recipes */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Recipes & Workings</Text>
            {selectedPlant.recipes.map((recipe, idx) => (
              <View key={idx} style={styles.recipe}>
                <Text style={[styles.recipeName, { color: textColor }]}>
                  {recipe.name}
                </Text>
                <View style={styles.subsection}>
                  <Text style={[styles.subheading, { color: accentColor }]}>Ingredients</Text>
                  {recipe.ingredients.map((ingredient, i) => (
                    <Text key={i} style={[styles.bulletItem, { color: mutedColor }]}>
                      • {ingredient}
                    </Text>
                  ))}
                </View>
                <View style={styles.subsection}>
                  <Text style={[styles.subheading, { color: accentColor }]}>Instructions</Text>
                  <Text style={[styles.infoValue, { color: mutedColor }]}>
                    {recipe.instructions}
                  </Text>
                </View>
                <View style={styles.subsection}>
                  <Text style={[styles.subheading, { color: accentColor }]}>Intent</Text>
                  <Text style={[styles.infoValue, { color: mutedColor }]}>
                    {recipe.intent}
                  </Text>
                </View>
                {idx < selectedPlant.recipes.length - 1 && (
                  <View style={[styles.divider, { borderBottomColor: borderColor }]} />
                )}
              </View>
            ))}
          </View>

          {/* Seasonal Notes */}
          <View style={[styles.section, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Seasonal Notes</Text>
            <Text style={[styles.sectionText, { color: mutedColor }]}>
              {selectedPlant.seasonalNotes}
            </Text>
          </View>

          {/* Moon Phase Harvesting */}
          <View style={[styles.section, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Moon Phase Harvesting</Text>
            <Text style={[styles.sectionText, { color: mutedColor }]}>
              {selectedPlant.moonPhaseHarvesting}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>🍄 Plant Foraging</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Reference guide to safe, edible & medicinal plants
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { paddingHorizontal: 16, paddingVertical: 16 }]}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: inputBg,
                borderColor: borderColor,
                color: textColor,
              },
            ]}
            placeholder="Search by common or Latin name..."
            placeholderTextColor={mutedColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Plant List */}
        <View style={[styles.listContainer, { paddingHorizontal: 16, paddingBottom: bannerTop ? 80 : 40 }]}>
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={[styles.plantItem, { backgroundColor: cardBg, borderColor: borderColor }]}
                onPress={() => setSelectedPlant(plant)}
              >
                <Text style={styles.plantItemEmoji}>{plant.emoji}</Text>
                <View style={styles.plantItemInfo}>
                  <Text style={[styles.plantItemName, { color: textColor }]}>
                    {plant.commonName}
                  </Text>
                  <Text style={[styles.plantItemLatin, { color: mutedColor }]}>
                    {plant.latinName}
                  </Text>
                </View>
                <Text style={[styles.chevron, { color: accentColor }]}>›</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: mutedColor }]}>
                No plants found matching "{searchQuery}"
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  plantEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  plantName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  latinName: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  plantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  plantItemEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  plantItemInfo: {
    flex: 1,
  },
  plantItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  plantItemLatin: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  subsection: {
    marginBottom: 16,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  lastInfoRow: {
    marginBottom: 0,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  recipe: {
    marginBottom: 20,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 16,
  },
});
