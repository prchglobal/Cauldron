import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { PLANT_REGIONS } from '../data/plantForagingDatabase';

export function PracticeDetailScreen({ route, navigation }: any) {
  const { practice } = route.params;
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();

  // Determine available tabs based on practice structure
  const tabs = practice.tabs ? Object.keys(practice.tabs) : [];
  const firstTab = tabs.length > 0 ? tabs[0] : 'overview';

  const [activeTab, setActiveTab] = useState(firstTab);
  const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);
  const [currentSpellIndex, setCurrentSpellIndex] = useState(0);
  const [expandedSpellId, setExpandedSpellId] = useState<number | null>(null);
  const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
  const [expandedAnimalId, setExpandedAnimalId] = useState<number | null>(null);
  const [currentFaeIndex, setCurrentFaeIndex] = useState(0);
  const [expandedFaeId, setExpandedFaeId] = useState<number | null>(null);
  const [currentCrystalIndex, setCurrentCrystalIndex] = useState(0);
  const [expandedCrystalId, setExpandedCrystalId] = useState<number | null>(null);
  const [selectedRecipeCategory, setSelectedRecipeCategory] = useState(0);
  const [currentRecipeBookIndex, setCurrentRecipeBookIndex] = useState(0);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accentColor = isDarkMode ? '#ef4444' : '#3b82f6';

  // Filter plants based on selected region
  const filteredPlants = useMemo(() => {
    if (!practice.hasPlantReference || selectedRegion === 'All Regions') {
      return practice.tabs?.referenceGuide?.plants || [];
    }
    return (practice.tabs?.referenceGuide?.plants || []).filter((plant: any) =>
      plant.regions?.includes(selectedRegion)
    );
  }, [practice, selectedRegion]);

  // Get current tab index for counter
  const currentTabIndex = tabs.indexOf(activeTab) + 1;

  const renderTabContent = () => {
    if (!practice.tabs || !practice.tabs[activeTab as keyof typeof practice.tabs]) {
      return null;
    }

    const currentTab = practice.tabs[activeTab as keyof typeof practice.tabs] as any;

    switch (activeTab) {
      case 'referenceGuide':
        const currentPlant = practice.hasPlantReference && filteredPlants.length > 0 ? filteredPlants[currentPlantIndex] : null;

        return (
          <View style={styles.tabContent}>

            {practice.hasPlantReference && currentTab.plants && currentTab.plants.length > 0 && (
              <View style={[styles.plantReferenceContainer, { backgroundColor: cardBg, borderColor: accentColor }]}>
                <Text style={[styles.plantRefTitle, { color: textColor }]}>
                  🌿 Plant Reference Guide
                </Text>

                {/* Plant Navigation - Top */}
                {filteredPlants.length > 1 && (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[styles.navButton, currentPlantIndex === 0 && styles.disabledButton]}
                      onPress={() => setCurrentPlantIndex(Math.max(0, currentPlantIndex - 1))}
                      disabled={currentPlantIndex === 0}
                    >
                      <Text style={[styles.navButtonText, currentPlantIndex === 0 && { opacity: 0.5 }]}>
                        ← Previous
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.plantCounter, { color: textColor }]}>
                      {currentPlantIndex + 1} / {filteredPlants.length}
                    </Text>

                    <TouchableOpacity
                      style={[styles.navButton, currentPlantIndex === filteredPlants.length - 1 && styles.disabledButton]}
                      onPress={() => setCurrentPlantIndex(Math.min(filteredPlants.length - 1, currentPlantIndex + 1))}
                      disabled={currentPlantIndex === filteredPlants.length - 1}
                    >
                      <Text style={[styles.navButtonText, currentPlantIndex === filteredPlants.length - 1 && { opacity: 0.5 }]}>
                        Next →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Region Filter Tabs */}
                <View style={styles.regionTabsContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={PLANT_REGIONS.length > 3}
                    style={styles.regionTabsScroll}
                  >
                    {PLANT_REGIONS.map((region) => (
                      <TouchableOpacity
                        key={region}
                        style={[
                          styles.regionTab,
                          selectedRegion === region && [
                            styles.activeRegionTab,
                            { borderBottomColor: accentColor },
                          ],
                        ]}
                        onPress={() => {
                          setSelectedRegion(region);
                          setCurrentPlantIndex(0);
                        }}
                      >
                        <Text
                          style={[
                            styles.regionTabText,
                            {
                              color:
                                selectedRegion === region ? accentColor : mutedColor,
                              fontWeight:
                                selectedRegion === region ? '600' : '400',
                            },
                          ]}
                        >
                          {region}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  {PLANT_REGIONS.length > 1 && (
                    <Text style={[styles.regionTabCounter, { color: mutedColor }]}>
                      {PLANT_REGIONS.indexOf(selectedRegion) + 1} / {PLANT_REGIONS.length}
                    </Text>
                  )}
                </View>

                {currentPlant && (
                  <View style={styles.plantCard}>
                    <View style={styles.plantHeader}>
                      <Text style={styles.plantEmoji}>{currentPlant.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.plantName, { color: textColor }]}>
                          {currentPlant.commonName}
                        </Text>
                        <Text style={[styles.plantLatin, { color: mutedColor }]}>
                          {currentPlant.latinName}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.plantDescription, { color: mutedColor }]}>
                      {currentPlant.description}
                    </Text>

                    <View style={styles.plantDetailsGrid}>
                      <View style={styles.detailBox}>
                        <Text style={[styles.detailLabel, { color: mutedColor }]}>Identification</Text>
                        <Text style={[styles.detailValue, { color: textColor }]}>
                          {currentPlant.identification?.stem || 'N/A'}
                        </Text>
                      </View>

                      <View style={styles.detailBox}>
                        <Text style={[styles.detailLabel, { color: mutedColor }]}>Harvest</Text>
                        <Text style={[styles.detailValue, { color: textColor }]}>
                          {currentPlant.harvestingGuide?.bestSeasons?.[0] || 'N/A'}
                        </Text>
                      </View>

                      <View style={styles.detailBox}>
                        <Text style={[styles.detailLabel, { color: mutedColor }]}>Uses</Text>
                        <Text style={[styles.detailValue, { color: textColor }]}>
                          {currentPlant.medicinalUses?.properties?.[0] || 'N/A'}
                        </Text>
                      </View>

                      <View style={styles.detailBox}>
                        <Text style={[styles.detailLabel, { color: mutedColor }]}>Element</Text>
                        <Text style={[styles.detailValue, { color: textColor }]}>
                          {currentPlant.magicalProperties?.element || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}

            {currentTab.categories && currentTab.categories.length > 0 && (
              <View style={[styles.recipeContainer, { backgroundColor: cardBg, marginTop: 20, borderColor: accentColor }]}>
                <Text style={[styles.recipeTitle, { color: textColor }]}>
                  📖 Reference Guide
                </Text>

                {/* Category Tabs with Counter */}
                <View style={styles.regionTabsContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={currentTab.categories.length > 3}
                    style={styles.regionTabsScroll}
                  >
                    {currentTab.categories.map((category: any, idx: number) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setSelectedRecipeCategory(idx);
                          setCurrentRecipeBookIndex(0);
                        }}
                        style={[
                          styles.regionTab,
                          selectedRecipeCategory === idx && {
                            backgroundColor: accentColor,
                            borderBottomColor: accentColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.regionTabText,
                            {
                              color: selectedRecipeCategory === idx ? '#fff' : textColor,
                              fontWeight: selectedRecipeCategory === idx ? 'bold' : 'normal',
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {category.emoji} {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Category Counter */}
                <Text style={[styles.plantCounter, { color: mutedColor, textAlign: 'center' }]}>
                  {selectedRecipeCategory + 1} / {currentTab.categories.length}
                </Text>

                {/* Handle Attribute-Based Content (Hermetic style) */}
                {currentTab.categories[selectedRecipeCategory]?.content && (
                  <View style={[styles.recipeCard, { backgroundColor: cardBg, borderColor: accentColor, marginTop: 16 }]}>
                    <View style={styles.recipeHeader}>
                      <Text style={styles.recipeEmoji}>
                        {currentTab.categories[selectedRecipeCategory].emoji}
                      </Text>
                      <Text style={[styles.recipeName, { color: textColor }]}>
                        {currentTab.categories[selectedRecipeCategory].name}
                      </Text>
                    </View>

                    {typeof currentTab.categories[selectedRecipeCategory].content === 'string' ? (
                      <View style={styles.recipeSection}>
                        <Text style={[styles.recipeText, { color: mutedColor, lineHeight: 22 }]}>
                          {currentTab.categories[selectedRecipeCategory].content}
                        </Text>
                      </View>
                    ) : Array.isArray(currentTab.categories[selectedRecipeCategory].content) ? (
                      currentTab.categories[selectedRecipeCategory].content.map(
                        (item: any, idx: number) => (
                          <View key={idx} style={[styles.recipeSection, { borderTopColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)' }]}>
                            <Text style={[styles.recipeSectionTitle, { color: accentColor }]}>
                              {item.attribute}
                            </Text>
                            <Text style={[styles.recipeText, { color: mutedColor }]}>
                              {item.value}
                            </Text>
                          </View>
                        )
                      )
                    ) : null}
                  </View>
                )}

                {/* Handle Recipe-Based Content */}
                {currentTab.categories[selectedRecipeCategory]?.recipes && currentTab.categories[selectedRecipeCategory].recipes.length > 0 && (
                  <>
                    {/* Recipe Navigation */}
                    {currentTab.categories[selectedRecipeCategory]?.recipes?.length > 1 && (
                      <View style={styles.navigationButtons}>
                        <TouchableOpacity
                          style={[styles.navButton, currentRecipeBookIndex === 0 && styles.disabledButton]}
                          onPress={() => setCurrentRecipeBookIndex(Math.max(0, currentRecipeBookIndex - 1))}
                          disabled={currentRecipeBookIndex === 0}
                        >
                          <Text style={[styles.navButtonText, currentRecipeBookIndex === 0 && { opacity: 0.5 }]}>
                            ← Previous
                          </Text>
                        </TouchableOpacity>

                        <Text style={[styles.plantCounter, { color: textColor }]}>
                          {currentRecipeBookIndex + 1} / {currentTab.categories[selectedRecipeCategory]?.recipes?.length}
                        </Text>

                        <TouchableOpacity
                          style={[
                            styles.navButton,
                            currentRecipeBookIndex === (currentTab.categories[selectedRecipeCategory]?.recipes?.length - 1) &&
                              styles.disabledButton,
                          ]}
                          onPress={() =>
                            setCurrentRecipeBookIndex(
                              Math.min(
                                currentTab.categories[selectedRecipeCategory]?.recipes?.length - 1,
                                currentRecipeBookIndex + 1
                              )
                            )
                          }
                          disabled={
                            currentRecipeBookIndex ===
                            (currentTab.categories[selectedRecipeCategory]?.recipes?.length - 1)
                          }
                        >
                          <Text
                            style={[
                              styles.navButtonText,
                              currentRecipeBookIndex ===
                                (currentTab.categories[selectedRecipeCategory]?.recipes?.length - 1) && {
                                opacity: 0.5,
                              },
                            ]}
                          >
                            Next →
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Recipe Card */}
                    {currentTab.categories[selectedRecipeCategory]?.recipes?.[currentRecipeBookIndex] && (
                      <View style={[styles.recipeCard, { backgroundColor: cardBg, borderColor: accentColor }]}>
                        <View style={styles.recipeHeader}>
                          <Text style={styles.recipeEmoji}>
                            {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].emoji}
                          </Text>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.recipeName, { color: textColor }]}>
                              {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].name}
                            </Text>
                            <Text style={[styles.recipeType, { color: mutedColor }]}>
                              {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].type} •{' '}
                              {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].element}
                            </Text>
                          </View>
                        </View>

                        <Text style={[styles.recipeIntent, { color: accentColor }]}>
                          ✨ {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].intent}
                        </Text>

                        {/* Ingredients */}
                        <View style={styles.recipeSection}>
                          <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                            Ingredients
                          </Text>
                          {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].ingredients?.map(
                            (ingredient: string, idx: number) => (
                              <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                                • {ingredient}
                              </Text>
                            )
                          )}
                        </View>

                        {/* Instructions */}
                        <View style={styles.recipeSection}>
                          <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                            Instructions
                          </Text>
                          {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].instructions?.map(
                            (instruction: string, idx: number) => (
                              <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                                {instruction}
                              </Text>
                            )
                          )}
                        </View>

                        {/* Timing */}
                        {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].timing && (
                          <View style={styles.recipeSection}>
                            <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                              Timing
                            </Text>
                            <Text style={[styles.recipeText, { color: mutedColor }]}>
                              {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].timing}
                            </Text>
                          </View>
                        )}

                        {/* Safety */}
                        {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].safety && (
                          <View style={styles.recipeSection}>
                            <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                              Safety
                            </Text>
                            <Text style={[styles.recipeText, { color: mutedColor }]}>
                              {currentTab.categories[selectedRecipeCategory].recipes[currentRecipeBookIndex].safety}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </>
                )}
              </View>
            )}

            {currentTab.recipes && currentTab.recipes.length > 0 && (
              <View style={[styles.recipeContainer, { backgroundColor: cardBg, marginTop: 20, borderColor: accentColor }]}>
                <Text style={[styles.recipeTitle, { color: textColor }]}>
                  📖 Recipe Book
                </Text>

                {/* Recipe Navigation - Top */}
                {currentTab.recipes.length > 1 && (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[styles.navButton, currentRecipeIndex === 0 && styles.disabledButton]}
                      onPress={() => setCurrentRecipeIndex(Math.max(0, currentRecipeIndex - 1))}
                      disabled={currentRecipeIndex === 0}
                    >
                      <Text style={[styles.navButtonText, currentRecipeIndex === 0 && { opacity: 0.5 }]}>
                        ← Previous
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.plantCounter, { color: textColor }]}>
                      {currentRecipeIndex + 1} / {currentTab.recipes.length}
                    </Text>

                    <TouchableOpacity
                      style={[styles.navButton, currentRecipeIndex === currentTab.recipes.length - 1 && styles.disabledButton]}
                      onPress={() => setCurrentRecipeIndex(Math.min(currentTab.recipes.length - 1, currentRecipeIndex + 1))}
                      disabled={currentRecipeIndex === currentTab.recipes.length - 1}
                    >
                      <Text style={[styles.navButtonText, currentRecipeIndex === currentTab.recipes.length - 1 && { opacity: 0.5 }]}>
                        Next →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Recipe Card */}
                <View style={[styles.recipeCard, { backgroundColor: cardBg, borderColor: accentColor }]}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeEmoji}>{currentTab.recipes[currentRecipeIndex].emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recipeName, { color: textColor }]}>
                        {currentTab.recipes[currentRecipeIndex].name}
                      </Text>
                      <Text style={[styles.recipeType, { color: mutedColor }]}>
                        {currentTab.recipes[currentRecipeIndex].type} • {currentTab.recipes[currentRecipeIndex].element}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.recipeIntent, { color: accentColor }]}>
                    ✨ {currentTab.recipes[currentRecipeIndex].intent}
                  </Text>

                  {/* Ingredients */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Ingredients
                    </Text>
                    {currentTab.recipes[currentRecipeIndex].ingredients?.map((ingredient: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        • {ingredient}
                      </Text>
                    ))}
                  </View>

                  {/* Instructions */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Instructions
                    </Text>
                    {currentTab.recipes[currentRecipeIndex].instructions?.map((instruction: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        {instruction}
                      </Text>
                    ))}
                  </View>

                  {/* Benefits */}
                  {currentTab.recipes[currentRecipeIndex].benefits && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Benefits
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.recipes[currentRecipeIndex].benefits}
                      </Text>
                    </View>
                  )}

                  {/* Timing */}
                  {currentTab.recipes[currentRecipeIndex].timing && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Timing
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.recipes[currentRecipeIndex].timing}
                      </Text>
                    </View>
                  )}

                  {/* Servings */}
                  {currentTab.recipes[currentRecipeIndex].servings && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Servings
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.recipes[currentRecipeIndex].servings}
                      </Text>
                    </View>
                  )}

                  {/* Safety */}
                  {currentTab.recipes[currentRecipeIndex].safety && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Safety
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.recipes[currentRecipeIndex].safety}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {currentTab.spells && currentTab.spells.length > 0 && (
              <View style={[styles.recipeContainer, { backgroundColor: cardBg, marginTop: 20, borderColor: accentColor }]}>
                <Text style={[styles.recipeTitle, { color: textColor }]}>
                  ✨ Spell Grimoire
                </Text>

                {/* Spell Navigation - Top */}
                {currentTab.spells.length > 1 && (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[styles.navButton, currentSpellIndex === 0 && styles.disabledButton]}
                      onPress={() => setCurrentSpellIndex(Math.max(0, currentSpellIndex - 1))}
                      disabled={currentSpellIndex === 0}
                    >
                      <Text style={[styles.navButtonText, currentSpellIndex === 0 && { opacity: 0.5 }]}>
                        ← Previous
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.plantCounter, { color: textColor }]}>
                      {currentSpellIndex + 1} / {currentTab.spells.length}
                    </Text>

                    <TouchableOpacity
                      style={[styles.navButton, currentSpellIndex === currentTab.spells.length - 1 && styles.disabledButton]}
                      onPress={() => setCurrentSpellIndex(Math.min(currentTab.spells.length - 1, currentSpellIndex + 1))}
                      disabled={currentSpellIndex === currentTab.spells.length - 1}
                    >
                      <Text style={[styles.navButtonText, currentSpellIndex === currentTab.spells.length - 1 && { opacity: 0.5 }]}>
                        Next →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Spell Card */}
                <View style={[styles.recipeCard, { backgroundColor: cardBg, borderColor: accentColor }]}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeEmoji}>{currentTab.spells[currentSpellIndex].emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recipeName, { color: textColor }]}>
                        {currentTab.spells[currentSpellIndex].name}
                      </Text>
                      <Text style={[styles.recipeType, { color: mutedColor }]}>
                        {currentTab.spells[currentSpellIndex].type} • {currentTab.spells[currentSpellIndex].element}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.recipeIntent, { color: accentColor }]}>
                    ✨ {currentTab.spells[currentSpellIndex].intent}
                  </Text>

                  {/* Room-specific note */}
                  {currentTab.spells[currentSpellIndex].room && (
                    <Text style={[styles.recipeText, { color: mutedColor, marginTop: 8 }]}>
                      📍 Best cast in: {currentTab.spells[currentSpellIndex].room}
                    </Text>
                  )}

                  {/* Materials */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Materials Needed
                    </Text>
                    {currentTab.spells[currentSpellIndex].materials?.map((material: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        • {material}
                      </Text>
                    ))}
                  </View>

                  {/* Instructions */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Instructions
                    </Text>
                    {currentTab.spells[currentSpellIndex].instructions?.map((instruction: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        {instruction}
                      </Text>
                    ))}
                  </View>

                  {/* Benefits */}
                  {currentTab.spells[currentSpellIndex].benefits && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Benefits
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spells[currentSpellIndex].benefits}
                      </Text>
                    </View>
                  )}

                  {/* Duration */}
                  {currentTab.spells[currentSpellIndex].duration && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Duration
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spells[currentSpellIndex].duration}
                      </Text>
                    </View>
                  )}

                  {/* Moon Phase */}
                  {currentTab.spells[currentSpellIndex].moonPhase && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Moon Phase
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        🌙 {currentTab.spells[currentSpellIndex].moonPhase}
                      </Text>
                    </View>
                  )}

                  {/* Seasonal Timing */}
                  {currentTab.spells[currentSpellIndex].seasonalTiming && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Seasonal Timing
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spells[currentSpellIndex].seasonalTiming}
                      </Text>
                    </View>
                  )}

                  {/* Safety */}
                  {currentTab.spells[currentSpellIndex].safety && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Safety
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spells[currentSpellIndex].safety}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {currentTab.animals && currentTab.animals.length > 0 && (
              <View style={[styles.recipeContainer, { backgroundColor: cardBg, marginTop: 20, borderColor: accentColor }]}>
                <Text style={[styles.recipeTitle, { color: textColor }]}>
                  🦋 Animal Allies
                </Text>

                {/* Animal Navigation - Top */}
                {currentTab.animals.length > 1 && (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[styles.navButton, currentAnimalIndex === 0 && styles.disabledButton]}
                      onPress={() => setCurrentAnimalIndex(Math.max(0, currentAnimalIndex - 1))}
                      disabled={currentAnimalIndex === 0}
                    >
                      <Text style={[styles.navButtonText, currentAnimalIndex === 0 && { opacity: 0.5 }]}>
                        ← Previous
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.plantCounter, { color: textColor }]}>
                      {currentAnimalIndex + 1} / {currentTab.animals.length}
                    </Text>

                    <TouchableOpacity
                      style={[styles.navButton, currentAnimalIndex === currentTab.animals.length - 1 && styles.disabledButton]}
                      onPress={() => setCurrentAnimalIndex(Math.min(currentTab.animals.length - 1, currentAnimalIndex + 1))}
                      disabled={currentAnimalIndex === currentTab.animals.length - 1}
                    >
                      <Text style={[styles.navButtonText, currentAnimalIndex === currentTab.animals.length - 1 && { opacity: 0.5 }]}>
                        Next →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Animal Card */}
                <View style={[styles.recipeCard, { backgroundColor: cardBg, borderColor: accentColor }]}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeEmoji}>{currentTab.animals[currentAnimalIndex].emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recipeName, { color: textColor }]}>
                        {currentTab.animals[currentAnimalIndex].name}
                      </Text>
                      <Text style={[styles.recipeType, { color: mutedColor }]}>
                        {currentTab.animals[currentAnimalIndex].category} • {currentTab.animals[currentAnimalIndex].element}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.recipeIntent, { color: accentColor }]}>
                    ✨ {currentTab.animals[currentAnimalIndex].medicine}
                  </Text>

                  {/* Symbolism teaser */}
                  <Text style={[styles.recipeText, { color: mutedColor, marginTop: 8 }]}>
                    {currentTab.animals[currentAnimalIndex].symbolism}
                  </Text>

                  {/* Lessons */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Lessons & Medicine
                    </Text>
                    {currentTab.animals[currentAnimalIndex].lessons?.map((lesson: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        • {lesson}
                      </Text>
                    ))}
                  </View>

                  {/* Chakra Association */}
                  {currentTab.animals[currentAnimalIndex].chakra && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Chakra Connection
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.animals[currentAnimalIndex].chakra}
                      </Text>
                    </View>
                  )}

                  {/* Best Season */}
                  {currentTab.animals[currentAnimalIndex].bestSeason && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Best Season
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        🌿 {currentTab.animals[currentAnimalIndex].bestSeason}
                      </Text>
                    </View>
                  )}

                  {/* When to Work With */}
                  {currentTab.animals[currentAnimalIndex].whenToWorkWith && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        When to Connect
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.animals[currentAnimalIndex].whenToWorkWith}
                      </Text>
                    </View>
                  )}

                  {/* Affirmation */}
                  {currentTab.animals[currentAnimalIndex].affirmation && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Affirmation
                      </Text>
                      <Text style={[styles.recipeText, { color: accentColor, fontStyle: 'italic' }]}>
                        "{currentTab.animals[currentAnimalIndex].affirmation}"
                      </Text>
                    </View>
                  )}

                  {/* Correspondences */}
                  {currentTab.animals[currentAnimalIndex].correspondences && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Correspondences
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.animals[currentAnimalIndex].correspondences}
                      </Text>
                    </View>
                  )}

                  {/* Sacred Practice */}
                  {currentTab.animals[currentAnimalIndex].sacred && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Sacred Practice
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.animals[currentAnimalIndex].sacred}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {currentTab.spirits && currentTab.spirits.length > 0 && (
              <View style={[styles.recipeContainer, { backgroundColor: cardBg, marginTop: 20, borderColor: accentColor }]}>
                <Text style={[styles.recipeTitle, { color: textColor }]}>
                  🧚 Fae Encounters
                </Text>

                {/* Fae Navigation - Top */}
                {currentTab.spirits.length > 1 && (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[styles.navButton, currentFaeIndex === 0 && styles.disabledButton]}
                      onPress={() => setCurrentFaeIndex(Math.max(0, currentFaeIndex - 1))}
                      disabled={currentFaeIndex === 0}
                    >
                      <Text style={[styles.navButtonText, currentFaeIndex === 0 && { opacity: 0.5 }]}>
                        ← Previous
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.plantCounter, { color: textColor }]}>
                      {currentFaeIndex + 1} / {currentTab.spirits.length}
                    </Text>

                    <TouchableOpacity
                      style={[styles.navButton, currentFaeIndex === currentTab.spirits.length - 1 && styles.disabledButton]}
                      onPress={() => setCurrentFaeIndex(Math.min(currentTab.spirits.length - 1, currentFaeIndex + 1))}
                      disabled={currentFaeIndex === currentTab.spirits.length - 1}
                    >
                      <Text style={[styles.navButtonText, currentFaeIndex === currentTab.spirits.length - 1 && { opacity: 0.5 }]}>
                        Next →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Fae Spirit Card */}
                <View style={[styles.recipeCard, { backgroundColor: cardBg, borderColor: accentColor }]}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeEmoji}>{currentTab.spirits[currentFaeIndex].emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recipeName, { color: textColor }]}>
                        {currentTab.spirits[currentFaeIndex].name}
                      </Text>
                      <Text style={[styles.recipeType, { color: mutedColor }]}>
                        {currentTab.spirits[currentFaeIndex].type} • {currentTab.spirits[currentFaeIndex].element}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.recipeIntent, { color: accentColor }]}>
                    {currentTab.spirits[currentFaeIndex].personality}
                  </Text>

                  {/* Temperament */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Temperament
                    </Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>
                      {currentTab.spirits[currentFaeIndex].temperament}
                    </Text>
                  </View>

                  {/* Gifts Offered */}
                  {currentTab.spirits[currentFaeIndex].giftsOffered && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Gifts Offered
                      </Text>
                      {typeof currentTab.spirits[currentFaeIndex].giftsOffered === 'string' ? (
                        <Text style={[styles.recipeText, { color: mutedColor }]}>
                          {currentTab.spirits[currentFaeIndex].giftsOffered}
                        </Text>
                      ) : (
                        currentTab.spirits[currentFaeIndex].giftsOffered?.map((gift: string, idx: number) => (
                          <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                            ✨ {gift}
                          </Text>
                        ))
                      )}
                    </View>
                  )}

                  {/* Preferred Offerings */}
                  {currentTab.spirits[currentFaeIndex].prefersOfferings && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Preferred Offerings
                      </Text>
                      {currentTab.spirits[currentFaeIndex].prefersOfferings?.map((offering: string, idx: number) => (
                        <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                          • {offering}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* How to Communicate */}
                  {currentTab.spirits[currentFaeIndex].howToCommunicate && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        How to Communicate
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spirits[currentFaeIndex].howToCommunicate}
                      </Text>
                    </View>
                  )}

                  {/* Communication Signs */}
                  {currentTab.spirits[currentFaeIndex].communication && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Signs of Communication
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spirits[currentFaeIndex].communication}
                      </Text>
                    </View>
                  )}

                  {/* Etiquette Tips */}
                  {currentTab.spirits[currentFaeIndex].etiquetteTips && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Etiquette & Respect
                      </Text>
                      {currentTab.spirits[currentFaeIndex].etiquetteTips?.map((tip: string, idx: number) => (
                        <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                          • {tip}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* Warnings */}
                  {currentTab.spirits[currentFaeIndex].warnings && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: '#ff6b6b' }]}>
                        ⚠️ Warnings
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spirits[currentFaeIndex].warnings}
                      </Text>
                    </View>
                  )}

                  {/* Best Time to Work */}
                  {currentTab.spirits[currentFaeIndex].bestTimeToWork && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Best Time to Work
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spirits[currentFaeIndex].bestTimeToWork}
                      </Text>
                    </View>
                  )}

                  {/* Reciprocal Exchange */}
                  {currentTab.spirits[currentFaeIndex].reciprocalExchange && (
                    <View style={styles.recipeSection}>
                      <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                        Reciprocal Exchange
                      </Text>
                      <Text style={[styles.recipeText, { color: mutedColor }]}>
                        {currentTab.spirits[currentFaeIndex].reciprocalExchange}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {currentTab.crystals && currentTab.crystals.length > 0 && (
              <View style={[styles.recipeContainer, { backgroundColor: cardBg, marginTop: 20, borderColor: accentColor }]}>
                <Text style={[styles.recipeTitle, { color: textColor }]}>
                  💎 Crystal Reference
                </Text>

                {/* Crystal Navigation - Top */}
                {currentTab.crystals.length > 1 && (
                  <View style={styles.navigationButtons}>
                    <TouchableOpacity
                      style={[styles.navButton, currentCrystalIndex === 0 && styles.disabledButton]}
                      onPress={() => setCurrentCrystalIndex(Math.max(0, currentCrystalIndex - 1))}
                      disabled={currentCrystalIndex === 0}
                    >
                      <Text style={[styles.navButtonText, currentCrystalIndex === 0 && { opacity: 0.5 }]}>
                        ← Previous
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.plantCounter, { color: textColor }]}>
                      {currentCrystalIndex + 1} / {currentTab.crystals.length}
                    </Text>

                    <TouchableOpacity
                      style={[styles.navButton, currentCrystalIndex === currentTab.crystals.length - 1 && styles.disabledButton]}
                      onPress={() => setCurrentCrystalIndex(Math.min(currentTab.crystals.length - 1, currentCrystalIndex + 1))}
                      disabled={currentCrystalIndex === currentTab.crystals.length - 1}
                    >
                      <Text style={[styles.navButtonText, currentCrystalIndex === currentTab.crystals.length - 1 && { opacity: 0.5 }]}>
                        Next →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Crystal Card */}
                <View style={[styles.recipeCard, { backgroundColor: cardBg, borderColor: accentColor }]}>
                  <View style={styles.recipeHeader}>
                    <Text style={styles.recipeEmoji}>{currentTab.crystals[currentCrystalIndex].emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.recipeName, { color: textColor }]}>
                        {currentTab.crystals[currentCrystalIndex].name}
                      </Text>
                      <Text style={[styles.recipeType, { color: mutedColor }]}>
                        {currentTab.crystals[currentCrystalIndex].type} • {currentTab.crystals[currentCrystalIndex].color}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.recipeIntent, { color: accentColor }]}>
                    ✨ {currentTab.crystals[currentCrystalIndex].purpose}
                  </Text>

                  {/* Properties */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Properties
                    </Text>
                    {currentTab.crystals[currentCrystalIndex].properties?.map((prop: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        • {prop}
                      </Text>
                    ))}
                  </View>

                  {/* Benefits */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Benefits
                    </Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>
                      {currentTab.crystals[currentCrystalIndex].benefits}
                    </Text>
                  </View>

                  {/* How to Use */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      How to Use
                    </Text>
                    {currentTab.crystals[currentCrystalIndex].howToUse?.map((usage: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        • {usage}
                      </Text>
                    ))}
                  </View>

                  {/* Chakra & Zodiac */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Chakra & Zodiac
                    </Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>
                      <Text style={{ fontWeight: '600' }}>Chakra: </Text>
                      {currentTab.crystals[currentCrystalIndex].chakra}
                    </Text>
                    <Text style={[styles.recipeText, { color: mutedColor, marginTop: 8 }]}>
                      <Text style={{ fontWeight: '600' }}>Zodiac: </Text>
                      {currentTab.crystals[currentCrystalIndex].zodiacSign}
                    </Text>
                  </View>

                  {/* Cleansing & Placement */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Cleansing & Placement
                    </Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>
                      <Text style={{ fontWeight: '600' }}>Cleansing: </Text>
                      {currentTab.crystals[currentCrystalIndex].cleansing}
                    </Text>
                    <Text style={[styles.recipeText, { color: mutedColor, marginTop: 8 }]}>
                      <Text style={{ fontWeight: '600' }}>Placement: </Text>
                      {currentTab.crystals[currentCrystalIndex].placement}
                    </Text>
                  </View>

                  {/* Affirmation */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Affirmation
                    </Text>
                    <Text style={[styles.recipeText, { color: accentColor, fontStyle: 'italic' }]}>
                      "{currentTab.crystals[currentCrystalIndex].affirmation}"
                    </Text>
                  </View>

                  {/* Safety Notes */}
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: textColor }]}>
                      Safety Notes
                    </Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>
                      {currentTab.crystals[currentCrystalIndex].safetyNotes}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        );

      case 'recipeBook':
        const categories = currentTab.categories || [];
        const categoryNames = categories.map((cat: any) => cat.name);
        const defaultCategory = selectedRecipeCategory || (categoryNames.length > 0 ? categoryNames[0] : '');
        const currentCategory = categories.find((cat: any) => cat.name === (selectedRecipeCategory || defaultCategory));
        const currentRecipes = currentCategory?.recipes || [];
        const currentRecipe = currentRecipes.length > 0 ? currentRecipes[currentRecipeBookIndex] : null;

        return (
          <View style={styles.tabContent}>
            {/* Category Tabs */}
            {categoryNames.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
                {categoryNames.map((catName: string, index: number) => {
                  const cat = categories[index];
                  const isSelected = (selectedRecipeCategory || defaultCategory) === catName;
                  return (
                    <TouchableOpacity
                      key={catName}
                      style={[
                        styles.categoryTab,
                        { backgroundColor: cardBg, borderBottomColor: isSelected ? accentColor : 'transparent', borderBottomWidth: isSelected ? 2 : 0 },
                      ]}
                      onPress={() => {
                        setSelectedRecipeCategory(catName);
                        setCurrentRecipeBookIndex(0);
                      }}
                    >
                      <Text style={[styles.categoryTabText, { color: textColor }, isSelected && { color: accentColor, fontWeight: 'bold' }]}>
                        {cat.emoji} {catName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Recipe Navigation */}
            {currentRecipes.length > 1 && (
              <View style={styles.navigationButtons}>
                <TouchableOpacity
                  style={[styles.navButton, currentRecipeBookIndex === 0 && styles.disabledButton]}
                  onPress={() => setCurrentRecipeBookIndex(Math.max(0, currentRecipeBookIndex - 1))}
                  disabled={currentRecipeBookIndex === 0}
                >
                  <Text style={[styles.navButtonText, currentRecipeBookIndex === 0 && { opacity: 0.5 }]}>
                    ← Previous
                  </Text>
                </TouchableOpacity>

                <Text style={[styles.recipeCounter, { color: textColor }]}>
                  {currentRecipeBookIndex + 1} / {currentRecipes.length}
                </Text>

                <TouchableOpacity
                  style={[styles.navButton, currentRecipeBookIndex === currentRecipes.length - 1 && styles.disabledButton]}
                  onPress={() => setCurrentRecipeBookIndex(Math.min(currentRecipes.length - 1, currentRecipeBookIndex + 1))}
                  disabled={currentRecipeBookIndex === currentRecipes.length - 1}
                >
                  <Text style={[styles.navButtonText, currentRecipeBookIndex === currentRecipes.length - 1 && { opacity: 0.5 }]}>
                    Next →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Recipe Content */}
            {currentRecipe && (
              <View style={[styles.recipeCard, { backgroundColor: cardBg }]}>
                <View style={styles.recipeHeader}>
                  <Text style={styles.recipeEmoji}>{currentRecipe.emoji}</Text>
                  <View style={styles.recipeTitle}>
                    <Text style={[styles.recipeName, { color: textColor }]}>{currentRecipe.name}</Text>
                    <Text style={[styles.recipeType, { color: mutedColor }]}>{currentRecipe.type}</Text>
                  </View>
                </View>

                <View style={styles.recipeSection}>
                  <Text style={[styles.recipeSectionTitle, { color: accentColor }]}>Intent</Text>
                  <Text style={[styles.recipeText, { color: mutedColor }]}>{currentRecipe.intent}</Text>
                </View>

                {currentRecipe.element && (
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: accentColor }]}>Element</Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>{currentRecipe.element}</Text>
                  </View>
                )}

                {currentRecipe.ingredients && currentRecipe.ingredients.length > 0 && (
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: accentColor }]}>Ingredients</Text>
                    {currentRecipe.ingredients.map((ing: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        • {ing}
                      </Text>
                    ))}
                  </View>
                )}

                {currentRecipe.instructions && currentRecipe.instructions.length > 0 && (
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: accentColor }]}>Instructions</Text>
                    {currentRecipe.instructions.map((instr: string, idx: number) => (
                      <Text key={idx} style={[styles.recipeListItem, { color: mutedColor }]}>
                        {idx + 1}. {instr}
                      </Text>
                    ))}
                  </View>
                )}

                {currentRecipe.timing && (
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: accentColor }]}>Timing</Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>{currentRecipe.timing}</Text>
                  </View>
                )}

                {currentRecipe.safety && (
                  <View style={styles.recipeSection}>
                    <Text style={[styles.recipeSectionTitle, { color: accentColor }]}>Safety</Text>
                    <Text style={[styles.recipeText, { color: mutedColor }]}>{currentRecipe.safety}</Text>
                  </View>
                )}
              </View>
            )}

            {currentRecipes.length === 0 && (
              <Text style={[styles.emptyText, { color: mutedColor }]}>
                No recipes in this category
              </Text>
            )}
          </View>
        );

      case 'gettingStarted':
        return (
          <View style={styles.tabContent}>
            {currentTab.steps && currentTab.steps.map((step: string, index: number) => (
              <View key={index} style={styles.stepItem}>
                <Text style={[styles.stepNumber, { color: accentColor }]}>
                  {index + 1}.
                </Text>
                <Text style={[styles.stepText, { color: mutedColor }]}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'knowledgeBase':
        return (
          <View style={styles.tabContent}>
            {currentTab.sections && currentTab.sections.map((section: any, index: number) => (
              <View key={index} style={styles.sectionContainer}>
                <Text style={[styles.sectionHeading, { color: textColor }]}>
                  {section.heading}
                </Text>
                <Text style={[styles.sectionText, { color: mutedColor }]}>
                  {section.content}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'tips':
        return (
          <View style={styles.tabContent}>
            {currentTab.items && currentTab.items.map((tip: any, index: number) => (
              <View key={index} style={styles.tipItem}>
                <Text style={[styles.tipTitle, { color: textColor }]}>
                  💡 {tip.title}
                </Text>
                <Text style={[styles.tipText, { color: mutedColor }]}>
                  {tip.text}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'resources':
        return (
          <View style={styles.tabContent}>
            {currentTab.items && currentTab.items.map((resource: string, index: number) => (
              <View key={index} style={styles.resourceItem}>
                <Text style={[styles.resourceBullet, { color: textColor }]}>
                  •
                </Text>
                <Text style={[styles.resourceText, { color: mutedColor }]}>
                  {resource}
                </Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <Text style={styles.emoji}>{practice.emoji}</Text>
          <Text style={[styles.title, { color: textColor }]}>{practice.name}</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            {practice.description}
          </Text>
        </View>

        {/* Tab Navigation */}
        {tabs.length > 0 && (
          <View style={[styles.tabsContainer, { backgroundColor: cardBg }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabsScroll}
            >
              {tabs.map((tab) => {
                const tabData = practice.tabs[tab as keyof typeof practice.tabs] as any;
                const tabTitle = tabData.title || tab.charAt(0).toUpperCase() + tab.slice(1);
                const isActive = activeTab === tab;

                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tab,
                      isActive && [styles.activeTab, { borderBottomColor: accentColor }],
                    ]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color: isActive ? accentColor : mutedColor,
                          fontWeight: isActive ? '600' : '400',
                        },
                      ]}
                    >
                      {tabTitle}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {tabs.length > 1 && (
              <Text style={[styles.tabCounter, { color: mutedColor }]}>
                {currentTabIndex} / {tabs.length}
              </Text>
            )}
          </View>
        )}

        {/* Content Area */}
        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 20 }]}>
          {renderTabContent()}
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
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 0,
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginRight: 4,
  },
  activeTab: {
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabCounter: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  tabContent: {
    paddingVertical: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
    minWidth: 24,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  tipItem: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
  },
  resourceItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  resourceBullet: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  resourceText: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  plantReferenceContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  plantRefTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  plantCard: {
    marginBottom: 12,
  },
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  plantEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  plantLatin: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  plantDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  plantDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  detailBox: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    lineHeight: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  plantCounter: {
    fontSize: 14,
    fontWeight: '600',
  },
  regionTabsContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  regionTabsScroll: {
    paddingHorizontal: 0,
  },
  regionTab: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginRight: 4,
  },
  activeRegionTab: {
    borderBottomColor: '#8b5cf6',
  },
  regionTabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  regionTabCounter: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  // Photo Button Styles
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

  // Photo Modal Styles
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
  photoImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  navArrow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  leftArrow: {
    left: -60,
  },
  rightArrow: {
    right: -60,
  },
  arrowText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Recipe Styles
  recipeContainer: {
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  recipeCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  recipeHeaderWithButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  recipeEmoji: {
    fontSize: 32,
    marginRight: 12,
    marginTop: 4,
  },
  craftButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  craftButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recipeType: {
    fontSize: 12,
    fontWeight: '500',
  },
  recipeIntent: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    fontStyle: 'italic',
  },
  recipeSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.2)',
  },
  recipeSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  recipeListItem: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  recipeText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
