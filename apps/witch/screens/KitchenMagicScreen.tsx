import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { KITCHEN_MAGIC_RECIPES } from '../data/kitchenMagicDatabase';

const KITCHEN_MAGIC_PRACTICE = {
  name: 'Kitchen Magic',
  emoji: '🫖',
  description: 'Infuse everyday cooking with magical intention',
  tabs: {
    overview: {
      title: 'Overview',
      content: 'Kitchen magic is the practice of infusing everyday cooking and food preparation with magical intention. These recipes combine culinary knowledge with herbal wisdom and magical correspondence to support your wellness and spiritual practice. By cooking with awareness and intention, you transform mundane meals into powerful spells and potions.',
      recipes: KITCHEN_MAGIC_RECIPES,
    },
    gettingStarted: {
      title: 'Getting Started',
      steps: [
        'Set clear intentions before you begin cooking—know what energy you want to create',
        'Choose ingredients based on their magical correspondences and your magical goals',
        'Work with the moon phases: waxing moon for growth and attraction, waning moon for banishing',
        'Stir clockwise for attraction and growth, counterclockwise for banishing and removal',
        'Visualize your intention while preparing the food',
        'Taste as you go, blessing each ingredient with your intention',
        'Serve and consume with awareness, knowing you\'re taking the magic into yourself',
        'Keep a journal of your kitchen magic experiments and results',
      ],
    },
    deepDive: {
      title: 'Deep Knowledge',
      sections: [
        {
          heading: 'Stirring & Mixing Magic',
          content: 'The direction you stir matters. Clockwise (deosil) stirring draws energy toward you—use for love, attraction, prosperity, healing, and growth. Counterclockwise (widdershins) stirring banishes energy away—use for removing illness, negativity, bad habits, and obstacles. The number of stirrings amplifies intention: 3 for manifestation, 7 for spiritual power, 9 for completion and wholeness. Stir with intention and visualization, imagining the energy you want flowing into the food.',
        },
        {
          heading: 'Ingredient Correspondences',
          content: 'Salt: protection, preservation, grounding. Garlic: protection, banishing, strength. Cinnamon: prosperity, attraction, spirituality. Honey: love, sweetness, attraction, binding. Ginger: boost, amplification, warmth. Black pepper: banishing, protection, strength. Herbs: each carries unique properties. Red ingredients: passion, energy, courage. Green: healing, growth, protection. White: purification, peace, clarity.',
        },
        {
          heading: 'Timing & Moon Phases',
          content: 'Waxing moon (new to full): brew for growth, attraction, manifestation, healing. Full moon: maximum power for any intention. Waning moon (full to new): brew for banishing, releasing, removal, completion. Days of the week amplify certain energies: Monday (Moon/intuition), Tuesday (Mars/courage), Wednesday (Mercury/communication), Thursday (Jupiter/expansion), Friday (Venus/love), Saturday (Saturn/boundaries), Sunday (Sun/success). Combine lunar and day-of-week timing for powerful results.',
        },
        {
          heading: 'Creating Sacred Space',
          content: 'Your kitchen is your altar. Before cooking, cleanse the space with intention. You might light a candle, ring a bell, or simply state your intention aloud. Arrange your ingredients mindfully. Some practitioners create a small altar corner in their kitchen. Playing soft music or nature sounds raises the vibration. Work during times when you won\'t be interrupted or rushed. Your energy affects the food—cook with love, focus, and positive energy.',
        },
        {
          heading: 'Charging & Blessing Food',
          content: 'After preparing your food, hold your hands over it and visualize golden light or your chosen color flowing from your hands into the food. State your intention clearly: "I bless this food with healing energy" or "I infuse this tea with clarity and focus." You might trace a sigil over the pot or plate. Some practitioners pass food through smoke (incense) or sprinkle it with blessed water. The key is conscious intention—the more you believe in what you\'re doing, the more powerful the magic.',
        },
      ],
    },
    tips: {
      title: 'Tips & Safety',
      items: [
        { title: 'Work with Intention', text: 'Clear intention is the foundation of all kitchen magic. Know exactly what energy you\'re creating.' },
        { title: 'Respect Ingredients', text: 'Thank each ingredient for its contribution to your spell. Work with what\'s available and fresh.' },
        { title: 'Flavor & Magic', text: 'Choose ingredients that taste good AND carry the magical correspondences you need. Magic should never taste bad.' },
        { title: 'Food Allergies Matter', text: 'Always consider who will consume the food. Never use ingredients someone is allergic to, no matter how magical.' },
        { title: 'Freshness First', text: 'Fresh ingredients are more potent than stale. Use herbs at their peak potency for stronger results.' },
        { title: 'Trust Your Intuition', text: 'Sometimes your gut tells you to add something not in the recipe. Trust those impulses—they\'re part of the magic.' },
      ],
    },
  },
};

const TAB_KEYS = ['overview', 'gettingStarted', 'deepDive', 'tips'] as const;

export function KitchenMagicScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();

  const [activeTab, setActiveTab] = useState<typeof TAB_KEYS[number]>('overview');
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accentColor = '#d946ef';

  const tabs = TAB_KEYS;
  const currentTabIndex = tabs.indexOf(activeTab) + 1;

  const getTabContent = () => {
    const tabData = KITCHEN_MAGIC_PRACTICE.tabs[activeTab as keyof typeof KITCHEN_MAGIC_PRACTICE.tabs] as any;

    switch (activeTab) {
      case 'overview':
        return (
          <View>
            <Text style={[styles.tabContentText, { color: textColor }]}>
              {tabData.content}
            </Text>

            {/* Recipe Flip-Through Book */}
            <View style={{ marginTop: 24 }}>
              <Text style={[styles.recipeBookTitle, { color: textColor }]}>
                📖 Recipe Book
              </Text>

              {tabData.recipes && tabData.recipes.length > 0 && (
                <>
                  {/* Featured Recipe Card */}
                  <View
                    style={[
                      styles.recipeCard,
                      { backgroundColor: cardBg, borderColor: accentColor },
                    ]}
                  >
                    <View style={styles.recipeHeader}>
                      <Text style={styles.recipeEmoji}>
                        {tabData.recipes[currentRecipeIndex].emoji}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.recipeName, { color: textColor }]}>
                          {tabData.recipes[currentRecipeIndex].name}
                        </Text>
                        <Text style={[styles.recipeType, { color: mutedColor }]}>
                          {tabData.recipes[currentRecipeIndex].type} •{' '}
                          {tabData.recipes[currentRecipeIndex].element}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.intentBadge, { backgroundColor: `${accentColor}20` }]}>
                      <Text style={[styles.intentText, { color: accentColor }]}>
                        ✨ {tabData.recipes[currentRecipeIndex].intent}
                      </Text>
                    </View>

                    <View style={styles.quickInfo}>
                      <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: mutedColor }]}>
                          Servings
                        </Text>
                        <Text style={[styles.infoValue, { color: textColor }]}>
                          {tabData.recipes[currentRecipeIndex].servings}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={[styles.infoLabel, { color: mutedColor }]}>
                          Timing
                        </Text>
                        <Text style={[styles.infoValue, { color: textColor }]}>
                          {tabData.recipes[currentRecipeIndex].timing.split(' ')[0]}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.detailsButton, { backgroundColor: accentColor }]}
                      onPress={() => setShowRecipeDetails(true)}
                    >
                      <Text style={styles.detailsButtonText}>View Full Recipe</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Navigation */}
                  <View style={styles.navigation}>
                    <TouchableOpacity
                      style={[styles.navButton, { backgroundColor: accentColor }]}
                      onPress={() =>
                        setCurrentRecipeIndex(
                          currentRecipeIndex === 0
                            ? tabData.recipes.length - 1
                            : currentRecipeIndex - 1
                        )
                      }
                    >
                      <Text style={styles.navArrow}>◀</Text>
                    </TouchableOpacity>

                    <View style={styles.counter}>
                      <Text style={[styles.counterText, { color: textColor }]}>
                        {currentRecipeIndex + 1} / {tabData.recipes.length}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.navButton, { backgroundColor: accentColor }]}
                      onPress={() =>
                        setCurrentRecipeIndex(
                          currentRecipeIndex === tabData.recipes.length - 1
                            ? 0
                            : currentRecipeIndex + 1
                        )
                      }
                    >
                      <Text style={styles.navArrow}>▶</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Recipe Thumbnails */}
                  <View style={{ marginTop: 16 }}>
                    <Text style={[styles.listTitle, { color: textColor }]}>
                      Browse All Recipes
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {tabData.recipes.map((recipe: any, index: number) => (
                        <TouchableOpacity
                          key={recipe.id}
                          style={[
                            styles.recipeThumbnail,
                            {
                              backgroundColor:
                                index === currentRecipeIndex ? accentColor : cardBg,
                              borderColor:
                                index === currentRecipeIndex ? accentColor : '#ddd',
                            },
                          ]}
                          onPress={() => setCurrentRecipeIndex(index)}
                        >
                          <Text style={styles.thumbnailEmoji}>{recipe.emoji}</Text>
                          <Text
                            style={[
                              styles.thumbnailName,
                              {
                                color:
                                  index === currentRecipeIndex ? '#fff' : textColor,
                              },
                            ]}
                          >
                            {recipe.name.split(' ')[0]}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </>
              )}
            </View>
          </View>
        );

      case 'gettingStarted':
        return (
          <View>
            {tabData.steps &&
              tabData.steps.map((step: string, index: number) => (
                <View key={index} style={styles.stepContainer}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: accentColor },
                    ]}
                  >
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: textColor }]}>
                    {step}
                  </Text>
                </View>
              ))}
          </View>
        );

      case 'deepDive':
        return (
          <View>
            {tabData.sections &&
              tabData.sections.map((section: any, index: number) => (
                <View key={index} style={styles.sectionContainer}>
                  <Text style={[styles.sectionHeading, { color: accentColor }]}>
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
          <View>
            {tabData.items &&
              tabData.items.map((tip: any, index: number) => (
                <View key={index} style={styles.tipContainer}>
                  <Text style={[styles.tipTitle, { color: accentColor }]}>
                    {tip.title}
                  </Text>
                  <Text style={[styles.tipDescription, { color: mutedColor }]}>
                    {tip.text}
                  </Text>
                </View>
              ))}
          </View>
        );

      default:
        return null;
    }
  };

  const currentRecipe = KITCHEN_MAGIC_PRACTICE.tabs.overview.recipes[currentRecipeIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: containerBg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: 16, paddingTop: bannerTop ? 10 : 0 }]}>
          <Text style={[styles.title, { color: textColor }]}>
            {KITCHEN_MAGIC_PRACTICE.emoji} {KITCHEN_MAGIC_PRACTICE.name}
          </Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            {KITCHEN_MAGIC_PRACTICE.description}
          </Text>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { borderBottomColor: '#eee', paddingHorizontal: 0 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tab,
                  activeTab === tab && [styles.activeTab, { borderBottomColor: accentColor }],
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab ? accentColor : mutedColor },
                  ]}
                >
                  {KITCHEN_MAGIC_PRACTICE.tabs[tab as keyof typeof KITCHEN_MAGIC_PRACTICE.tabs]?.title || tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View
            style={[
              styles.tabCounter,
              { backgroundColor: cardBg, borderColor: accentColor },
            ]}
          >
            <Text style={[styles.tabCounterText, { color: textColor }]}>
              {currentTabIndex} / {tabs.length}
            </Text>
          </View>
        </View>

        {/* Tab Content */}
        <View style={[styles.content, { paddingHorizontal: 16 }]}>
          {getTabContent()}
        </View>
      </ScrollView>

      {/* Recipe Details Modal */}
      {currentRecipe && (
        <Modal
          visible={showRecipeDetails}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRecipeDetails(false)}
        >
          <SafeAreaView
            style={[styles.modalContainer, { backgroundColor: containerBg }]}
          >
            <ScrollView>
              {/* Close Button */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowRecipeDetails(false)}
                  style={styles.closeButton}
                >
                  <Text style={[styles.closeText, { color: textColor }]}>
                    ✕ Close
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Recipe Details */}
              <View style={[styles.modalContent, { paddingHorizontal: 16 }]}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailEmoji}>{currentRecipe.emoji}</Text>
                  <Text style={[styles.detailName, { color: textColor }]}>
                    {currentRecipe.name}
                  </Text>
                  <Text style={[styles.detailType, { color: mutedColor }]}>
                    {currentRecipe.type} • {currentRecipe.element}
                  </Text>
                </View>

                <View style={[styles.detailSection, { backgroundColor: `${accentColor}10` }]}>
                  <Text style={[styles.detailSectionTitle, { color: accentColor }]}>
                    ✨ Magical Intent
                  </Text>
                  <Text style={[styles.detailSectionText, { color: textColor }]}>
                    {currentRecipe.intent}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: textColor }]}>
                    🌿 Ingredients
                  </Text>
                  {currentRecipe.ingredients.map((ingredient: string, idx: number) => (
                    <Text
                      key={idx}
                      style={[styles.detailListItem, { color: mutedColor }]}
                    >
                      • {ingredient}
                    </Text>
                  ))}
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: textColor }]}>
                    📖 Instructions
                  </Text>
                  {currentRecipe.instructions.map((instruction: string, idx: number) => (
                    <Text
                      key={idx}
                      style={[styles.detailListItem, { color: mutedColor }]}
                    >
                      {instruction}
                    </Text>
                  ))}
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: textColor }]}>
                    💫 Benefits
                  </Text>
                  <Text style={[styles.detailSectionText, { color: mutedColor }]}>
                    {currentRecipe.benefits}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailSectionTitle, { color: textColor }]}>
                    🌙 Timing
                  </Text>
                  <Text style={[styles.detailSectionText, { color: mutedColor }]}>
                    {currentRecipe.timing}
                  </Text>
                </View>

                <View
                  style={[
                    styles.detailSection,
                    { backgroundColor: `#f5a62320`, borderLeftColor: '#f5a623', borderLeftWidth: 3 },
                  ]}
                >
                  <Text style={[styles.detailSectionTitle, { color: '#f5a623' }]}>
                    ⚠️ Safety Notes
                  </Text>
                  <Text style={[styles.detailSectionText, { color: mutedColor }]}>
                    {currentRecipe.safety}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabCounter: {
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  tabCounterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    marginTop: 20,
  },
  tabContentText: {
    fontSize: 14,
    lineHeight: 22,
  },
  recipeBookTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  recipeCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  recipeType: {
    fontSize: 12,
  },
  intentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  intentText: {
    fontSize: 13,
    fontWeight: '500',
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counter: {
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  recipeThumbnail: {
    width: 80,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
  },
  thumbnailEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  thumbnailName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  tipContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    paddingVertical: 20,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  detailEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailType: {
    fontSize: 14,
  },
  detailSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailSectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  detailListItem: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
});
