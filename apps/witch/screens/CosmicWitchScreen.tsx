import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { useLocks } from '../LocksContext';
import { WitchLockOverlay } from '../components/WitchLockOverlay';
import PurchaseService from '../PurchaseService';
import { FIRE_CRYSTALS } from '../data/fireCrystalsDatabase';
import { ASTRAL_FUNDAMENTALS, TRAVEL_TECHNIQUES } from '../data/astralTravelDatabase';
import { TRANCE_INDUCTION, TRANCE_APPLICATIONS } from '../data/tranceMagicDatabase';
import { SPACE_FUNDAMENTALS, SPACE_APPLICATIONS } from '../data/spaceMagicDatabase';
import { CONSTELLATIONS, CONSTELLATION_KNOWLEDGE, CONSTELLATION_PRACTICES } from '../data/constellationSymbolismDatabase';
import { SEASONAL_FOUNDATIONS, SEASONAL_PRACTICES } from '../data/seasonalRitesDatabase';

const COSMIC_PRACTICES = [
  {
    name: 'Astral Travel',
    emoji: '👁️',
    description: 'Journey through non-physical realms',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Astral Fundamentals', emoji: '✨', recipes: ASTRAL_FUNDAMENTALS },
          { name: 'Travel Techniques', emoji: '🚀', recipes: TRAVEL_TECHNIQUES },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Understanding the Astral Plane', content: 'The astral plane is the bridge between physical and spiritual dimensions. Unlike the physical world governed by physics, the astral plane is governed by consciousness—thoughts become reality instantly, intention shapes experience.' },
          { heading: 'Why Cosmic Witches Practice Astral Travel', content: 'Through astral travel you meet your cosmic guides and teachers directly, explore higher dimensional consciousness, receive cosmic downloads and teachings, align with planetary and stellar energies on the astral plane.' },
          { heading: 'Astral Travel & Dreams', content: 'Every night you travel the astral plane—most people do so unconsciously. Dreams are your astral experiences translated into symbolic imagery your brain can process. Vivid dreams indicate strong astral activity.' },
          { heading: 'Astral Body & Energy', content: 'Your astral body is composed of subtle energy organized in the shape of your physical body. Connected to your physical body by a silver cord—a luminous energetic thread that keeps you connected.' },
          { heading: 'Astral Realms & Dimensions', content: 'Lower astral (dreamlike, less stable), Middle astral (more stable, contains thought-form temples), Upper astral (crystalline, luminous, high-vibrational). As you raise your vibration, you naturally access higher realms.' },
          { heading: 'Astral Relationships & Soul Family', content: 'Many practitioners discover astral relationships—connections with souls they consistently encounter on the astral plane. Soul family often gathers for learning circles and spiritual advancement.' },
          { heading: 'Challenges & Common Issues', content: 'Sleep paralysis (frightening but harmless), false awakenings (you wake in a dream, not physically), difficulty remembering journeys (keep a journal). Solutions: practice consistently, maintain protective intention, call upon guides.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Before attempting astral travel: ground yourself, set protective intention, invoke your guides',
          'Establish a sleep schedule—astral travel happens most naturally during REM sleep cycles',
          'Keep a journal on your nightstand—record dreams and astral experiences immediately upon waking',
          'Practice the body scan relaxation technique daily to develop the deep relaxation astral travel requires',
          'Choose one astral travel technique and practice nightly for 2 weeks',
          'Set a clear, simple intention before sleep: "Tonight I will travel the astral plane consciously"',
          'Begin with short, safe journeys—explore your astral home, meet a guide, or visit a light-filled temple',
          'If you achieve astral separation, remain calm, call your guides, and explore with curiosity',
          'Return to your physical body consciously by mentally commanding your astral body to return',
          'Upon waking, immediately record your experience in detail before the memory fades',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Never Travel With Fear', text: 'Fear attracts fearful astral experiences. Maintain protective intention and remember you\'re infinitely more powerful than any astral entity.' },
          { title: 'Sleep Paralysis Is Not Dangerous', text: 'Sleep paralysis (awareness while physically paralyzed) is the gateway to astral travel. Stay calm and command your astral body to rise.' },
          { title: 'Keep A Dream Journal', text: 'Write down dreams immediately upon waking. This trains your unconscious to remember astral journeys.' },
          { title: 'Consistency Matters Most', text: 'Nightly practice for weeks often yields first conscious astral travel. Sporadic attempts rarely succeed.' },
          { title: 'You Cannot Be Lost Or Harmed', text: 'You control your astral reality. You can return to your body instantly. No astral entity can harm your eternal soul.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Astral Dynamics by Robert Bruce',
          'The Art and Practice of Astral Projection by Ophiel',
          'Astral travel meditation recordings (binaural beats, theta wave frequencies)',
          'Lucid dreaming apps and dream journaling templates',
          'Astral travel communities and forums for sharing experiences',
        ],
      },
    },
  },
  {
    name: 'Trance Magic',
    emoji: '🌀',
    description: 'Deep meditative states for transformation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Trance Induction', emoji: '💤', recipes: TRANCE_INDUCTION },
          { name: 'Trance Applications', emoji: '✨', recipes: TRANCE_APPLICATIONS },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Trance vs. Regular Meditation', content: 'Meditation: you maintain conscious control. Trance: conscious control releases. Meditation: you direct your mind. Trance: your mind quiets. Both have benefits—meditation develops discipline, trance facilitates healing.' },
          { heading: 'Brainwave States & Trance Depth', content: 'Beta (14-30 Hz, waking). Alpha (8-14 Hz, relaxed awareness). Theta (4-8 Hz, deep meditation, trance). Delta (0.5-4 Hz, sleep). Trance primarily occurs in alpha and theta states.' },
          { heading: 'Trance As Preparation For Other Practices', content: 'Trance is foundational: channeling requires trance connection. Astral travel uses trance as entry point. Healing work deepens in trance. Manifestation amplifies through trance programming.' },
          { heading: 'Safety & Grounding In Trance', content: 'Always ground and protect before entering trance. Call upon guides. Establish a return anchor. Never trance while driving. If disturbed, visualize white light and return to waking consciousness.' },
          { heading: 'Common Trance Experiences', content: 'Profound relaxation, time seeming to stop, unexpected insights, vivid internal visions, sensing presences, emotional release. All experiences are valid. Repeated trance deepens naturally.' },
          { heading: 'Integrating Trance Insights', content: 'Trance insights are precious—integrate them consciously. Journal insights immediately. Look for patterns. Apply insights to your life. Take inspired action based on guidance.' },
          { heading: 'Advanced Trance Techniques', content: 'Explore specific intention trances, practice co-trance with trusted partners, extended trances (45-60+ minutes), combine with sound (singing bowls, gongs), study shamanic drumming for trance induction.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Find a quiet, safe, comfortable space where you won\'t be disturbed for 20-30 minutes',
          'Lie down in a comfortable position (reclining or lying flat on your back)',
          'Ground yourself: visualize roots anchoring you to Earth\'s center',
          'Invoke protection: call upon your guides and angels',
          'Set your intention: "I enter a healing, peaceful trance state. I receive guidance of highest good"',
          'Begin slow, deep breathing: inhale 4 counts, hold 4, exhale 4, hold 4',
          'Do progressive relaxation: mentally scan from toes to crown, releasing tension',
          'Visualize descending deeper: imagine walking down stairs or through layers of clouds',
          'Surrender to the trance state: let go of control and remain open',
          'Upon returning, immediately journal any insights, messages, or experiences',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Always Ground & Protect First', text: 'Never enter trance ungrounded or unprotected. Ground yourself in Earth energy and call upon guides.' },
          { title: 'Stay Aware Of Time', text: 'Trance time feels timeless. Set an alarm if needed so you don\'t lose track. Most sessions should be 15-45 minutes.' },
          { title: 'Hydrate After Trance', text: 'Trance accesses deep relaxation. Drink water afterward to reground and rehydrate.' },
          { title: 'Consistency Amplifies Results', text: 'Regular trance (2-3 times weekly) creates cumulative healing. Occasional trance provides relaxation; consistent practice yields profound shifts.' },
          { title: 'Journal Everything', text: 'Trance memories fade quickly. Write immediately upon waking. Over time, patterns emerge.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Trance induction guided meditations and recordings',
          'Meditation music: singing bowls, theta waves, ambient soundscapes',
          'The Inner Sky by Steven Forrest',
          'Books on shamanic journeying and trance techniques',
          'Theta wave binaural beat recordings',
        ],
      },
    },
  },
  {
    name: 'Space Magic',
    emoji: '💫',
    description: 'Harnessing infinite cosmic potential',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Space Fundamentals', emoji: '🌌', recipes: SPACE_FUNDAMENTALS },
          { name: 'Space Applications', emoji: '✨', recipes: SPACE_APPLICATIONS },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Quantum Physics & Space Magic', content: 'Observer effect (consciousness affects reality), quantum entanglement (particles connected across distance), vacuum energy (potential energy in empty space), superposition (all possibilities existing simultaneously). Space magic harnesses these quantum principles.' },
          { heading: 'Chakras As Space Organizers', content: 'Your chakras are vortexes of energy—spaces organizing your physical, emotional, mental, and spiritual experience. Open chakras create space for energy flow. Clear chakras allow purer expression. Spinning chakras open portals.' },
          { heading: 'Personal Space & Energetic Boundaries', content: 'Your personal space extends beyond your physical body. Your aura or energetic field defines your space. Protecting your space: define healthy boundaries, visualize shields of light, cleanse regularly.' },
          { heading: 'Ley Lines & Earth\'s Energetic Grid', content: 'Earth contains ley lines—energetic pathways carrying vital force. Sacred sites sit on ley line intersections. Learning Earth\'s energetic grid allows cosmic witches to draw on ley line energy for amplification.' },
          { heading: 'Manifestation & Space Magic', content: 'Manifestation works through space: visualize your goal existing in space as if already accomplished. The key is feeling as if you already have your goal—this feeling creates resonance in the quantum field.' },
          { heading: 'Collective Field Work & Group Magic', content: 'Multiple consciousnesses create stronger fields. Group meditations create powerful morphic fields. Collective rituals amplify exponentially. Participate in global meditations for planetary healing.' },
          { heading: 'Challenges & Refinement', content: 'Doubt (belief is key), difficulty visualizing space (practice gets easier), becoming spacey or ungrounded (balance with earthing). Solutions: study confirming science, practice consistently, combine with physical action.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin with void meditation: sit quietly, let your mind become empty and spacious',
          'Practice clearing physical space: declutter a room, organize items, create space for energy to flow',
          'Try distance healing: hold someone\'s name or photo, visualize healing light flowing to them',
          'Experiment with spatial visualization: close eyes, visualize an empty room or space',
          'Create a sacred geometry drawing or mandala; meditate on its patterns',
          'Work with chakras: visualize each as a glowing vortex of space and light, spinning clockwise',
          'Try manifestation in space: visualize your goal existing in empty space as if already accomplished',
          'Cleanse your space with intention: walk around while setting intention for clarity',
          'Study sacred geometry—how it appears in nature, architecture, and the cosmos',
          'Keep a manifestation journal: record intentions and note when they materialize',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Space Work Requires Grounding', text: 'Working with spaciousness can feel ungrounding. Always ground yourself before and after space magic.' },
          { title: 'Respect Others\' Space & Consent', text: 'Never send unsolicited energy to others. Ask permission before space work for someone.' },
          { title: 'Combine With Action', text: 'Space magic plants seeds; action waters them. Manifest in space, then take inspired action.' },
          { title: 'Clear Before Creating', text: 'Always clear old energy from space before creating new. Start with a blank canvas.' },
          { title: 'Trust The Void', text: 'The void feels empty but contains infinite potential. Trust that your intentions are held in spaciousness.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Holographic Universe by Michael Talbot',
          'Sacred Geometry by Robert Lawlor',
          'The Kybalion—hermetic principles underlying space and manifestation',
          'Quantum physics books for understanding vacuum energy and entanglement',
          'Meditation recordings focused on void and spaciousness',
        ],
      },
    },
  },
  {
    name: 'Constellation Symbolism',
    emoji: '⭐',
    description: 'Working with star wisdom and cosmic patterns',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Constellations', emoji: '✨', recipes: CONSTELLATIONS },
          { name: 'Constellation Knowledge', emoji: '⭐', recipes: CONSTELLATION_KNOWLEDGE },
          { name: 'Constellation Practices', emoji: '🔭', recipes: CONSTELLATION_PRACTICES },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Mythology & Archetypal Wisdom', content: 'Constellation myths encode archetypal wisdom: Andromeda\'s myth teaches about destiny and trust. Perseus\'s myth teaches about courage. These myths aren\'t literally true—they\'re containers of wisdom.' },
          { heading: 'Constellation Meditation & Activation', content: 'Meditate on constellation energy: find the constellation in the night sky. Gaze at it, absorbing its pattern. Close your eyes, visualize it in your third eye. Invoke its wisdom and power.' },
          { heading: 'Astrological House & Constellation Work', content: 'Astrology and constellation work complement each other. Your birth chart shows constellation positions reflecting your soul\'s cosmic blueprint.' },
          { heading: 'Constellation Healing & Transformation', content: 'Each constellation offers specific healing: Phoenix for transformation and rebirth, Draco for protection, Lyra for healing through beauty, Centaurus for balance.' },
          { heading: 'Walking The Celestial Path', content: 'Walk the zodiac—learning each constellation\'s wisdom. Follow the ecliptic as a metaphorical spiritual path. Connect with fixed stars beyond zodiac. Discover your personal star connection.' },
          { heading: 'Constellation Community & Soul Groups', content: 'Souls are organized by constellation—you share soul group with others born under your constellations. Meeting someone with similar constellation placements might reveal shared soul family.' },
          { heading: 'Challenges & Shadow Work', content: 'Each constellation carries shadow. Orion\'s courage can become recklessness. Scorpio\'s transformation can become obsession. Understand shadow aspects and integrate them consciously.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn your sun, moon, and rising sign constellations from your birth chart',
          'Research the mythology and symbolic meaning of your constellation signs',
          'Download a stargazing app (Stellarium, SkySafari, Star Walk)',
          'Find your sun constellation in the night sky and meditate on its energy',
          'Draw your constellation\'s sigil (connecting the stars) while setting intention',
          'Create a constellation meditation: visualize your constellation, invoke its energy',
          'Research which constellations are visible this season—practice stargazing',
          'Choose a constellation (besides your sun/moon/rising) that calls to you',
          'Meditate on that constellation, asking for its wisdom with a current challenge',
          'Wear constellation jewelry or create a constellation altar',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Learn The Real Sky', text: 'Learning the actual night sky—where constellations appear, when visible—grounds your practice in cosmic reality.' },
          { title: 'Study Multiple Mythology Traditions', text: 'Research Egyptian, Babylonian, Chinese, and indigenous constellation meanings—discover diverse wisdom.' },
          { title: 'Balance Constellation Work With Earthing', text: 'Constellation work can feel ethereal. Balance with earthing: put feet on Earth, work with plants, stay embodied.' },
          { title: 'Constellation Rituals Amplify Power', text: 'Doing magic when your personal constellation is visible amplifies power. Research when your constellation rises.' },
          { title: 'Trust Your Connection', text: 'Your connection will deepen over months and years. Trust the process.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'NightSky.com and SkyandTelescope.org for constellation information',
          'Stargazing apps: Stellarium, SkySafari, Star Walk',
          'Constellation mythology: Greek, Egyptian, indigenous traditions',
          'The Cosmic Perspective textbooks',
          'Astrology books connecting birth chart constellations to life purpose',
        ],
      },
    },
  },
  {
    name: 'Seasonal Rites',
    emoji: '🍂',
    description: 'Honoring Earth\'s cycles and cosmic seasons',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Seasonal Foundations', emoji: '🌍', recipes: SEASONAL_FOUNDATIONS },
          { name: 'Seasonal Practices', emoji: '🎉', recipes: SEASONAL_PRACTICES },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Wheel Of The Year', content: 'Eight seasonal festivals form the Wheel of the Year—an annual cycle of death, birth, growth, and rest. Moving through the wheel teaches: nothing is permanent, cycles always turn, what dies is reborn, what grows must rest.' },
          { heading: 'Lunar Cycles Within Seasonal Cycles', content: 'While the Wheel marks solar cycles, the moon marks lunar cycles. New moons during growing seasons for manifestation, full moons for completion/release. Both cycles work together.' },
          { heading: 'Personal Seasonal Cycles', content: 'Beyond Earth\'s seasons, you have personal seasonal cycles. Pay attention: when do you have energy? When do you rest? When do you create? Honoring personal seasons allows sustainable magical work.' },
          { heading: 'Seasonal Foods & Herbal Practices', content: 'Each season offers different foods and herbs. Eating seasonally attunes your body to natural cycles. Growing your own herbs deepens practice further.' },
          { heading: 'Community & Celebration', content: 'Seasonal rituals are traditionally communal. Gathering with others to celebrate amplifies power. If no local community, online ritual circles connect practitioners globally.' },
          { heading: 'Seasonal Magic & Manifestation', content: 'Spring magic (new beginnings, growth), Summer magic (peak power, expansion), Autumn magic (completion, gratitude), Winter magic (introspection, shadow work). Align spells with seasonal energies.' },
          { heading: 'Challenges & Shadow Of Seasonal Practice', content: 'If you resist natural seasons, seasonal practice reveals dysfunction. Start slowly, honor one season deeply, gradually integrate others.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Research the eight seasonal festivals and mark them on your calendar',
          'Learn the meaning and traditional practices for each festival',
          'Celebrate the next upcoming seasonal festival: light a candle, create an altar, set aligned intention',
          'Research what foods, herbs, and natural elements are abundant in your current season',
          'Create a simple seasonal altar in your home or sacred space',
          'Prepare for the upcoming seasonal transition: what is ending? What is beginning? Journal.',
          'If possible, gather with others or join an online community for a seasonal ritual',
          'Pay attention to your personal energy cycles: when do you have energy? When do you rest?',
          'Create seasonal herbal tea or remedy aligned with current season',
          'Plan one piece of seasonal magic aligned with current season: growth in spring, harvest in fall',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Honor Your Actual Location\'s Seasons', text: 'Adjust for your hemisphere. If in southern hemisphere, spring begins Sept 21. Honor your actual seasons.' },
          { title: 'Balance Community & Solitude', text: 'Seasonal rituals can be done alone or in community—both are valid.' },
          { title: 'Seasonal Magic Supports Natural Rhythms', text: 'Honoring seasons teaches working with nature, not against it. This creates sustainability and power.' },
          { title: 'Use Seasonal Produce & Materials', text: 'Using seasonal foods, herbs, and natural materials deepens connection and supports local ecosystems.' },
          { title: 'Start Simple', text: 'Start with simple seasonal awareness. Celebrate the season, set intention. Complexity comes over time.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Wheel of the Year—guide to all eight festivals',
          'Seasonal living books: natural living aligned with seasons',
          'Herbal almanacs: Moon Gardening, Rosemary Gladstar',
          'Local seasonal farmers markets and seed catalogs',
          'Online seasonal ritual communities and groups',
        ],
      },
    },
  },
  {
    name: 'Crystal Magic (Fire-Aligned)',
    emoji: '🔥',
    description: 'Fire crystals for manifestation and transformation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        crystals: FIRE_CRYSTALS,
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Fire Crystals & Manifestation Power', content: 'Fire-aligned crystals resonate with passion, manifestation, courage, and transformative power. They accelerate manifestation, ignite creative passion, amplify personal power, and fuel bold action.' },
          { heading: 'Fire Crystal Magic Correspondences', content: 'Ruby: Passion ignition, manifestation at highest level. Carnelian: Creative momentum, confidence boost. Citrine: Abundance attraction, prosperity. Garnet: Grounded passion, physical vitality. Pyrite: Luck attraction, will strengthening.' },
          { heading: 'Manifestation Acceleration With Fire Crystals', content: 'Create a manifestation grid with citrine at center radiating outward, surrounded by ruby points facing your goals. Fire crystal manifestation requires: crystal-clear intention, written goals, daily visualization, consistent action.' },
          { heading: 'Power & Confidence Amplification', content: 'Wear carnelian before presentations. Carry ruby when claiming authority. Place garnet in workspace. Meditate with citrine daily. Fire crystal power work shifts your energetic signature.' },
          { heading: 'Creative Fire & Artistic Passion', content: 'Place carnelian in creative space. Hold ruby while connecting with deepest desires. Wear citrine when sharing work publicly. Fire crystals demand authenticity.' },
          { heading: 'Courage & Bold Transformation', content: 'Carry carnelian during change. Meditate with ruby for courage. Use pyrite for willpower. Sleep with garnet. Fire crystal work creates rapid change.' },
          { heading: 'Daily Fire Crystal Practice', content: 'Wear carnelian for creative energy. Carry citrine to attract opportunity. Place ruby on altar. Keep garnet in workspace. Meditate 5-10 minutes daily.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Start with carnelian or citrine for foundational fire energy',
          'Write down your deepest desires—not what you think you should want',
          'Create a vision board or written goals and place fire crystals on them',
          'Meditate with ruby while connecting with your deepest passions',
          'Wear carnelian as jewelry for constant creative and confident energy',
          'Carry citrine throughout your day to attract luck and opportunity',
          'Take daily action toward your goals while holding or carrying fire crystals',
          'Track synchronicities and opportunities that appear',
          'Place fire crystals in your workspace or wealth corner',
          'Monthly, review progress and notice increases in power, confidence, and success',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Authentic Desire Required', text: 'Fire crystals manifest what you truly desire. Connect with genuine passion. Ego-driven desires may manifest but bring dissatisfaction.' },
          { title: 'Action Accelerates Results', text: 'Fire crystals amplify action and momentum. Meditate with them, then take immediate action.' },
          { title: 'Sunlight Brief Only', text: 'Avoid extended sunlight on carnelian, citrine, and ruby as colors fade. Use brief charging or moonlight.' },
          { title: 'Grounding Essential', text: 'Fire crystal work is intense. Ground yourself daily with black tourmaline or smoky quartz.' },
          { title: 'Expect Rapid Change', text: 'Fire crystals work FAST. Be prepared for opportunities, challenges, and rapid manifestation.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Crystal Bible by Judy Hall',
          'Love is in the Earth by Melody',
          'Manifestation guides and law of attraction practices',
          'Vision board and goal-setting resources',
          'Personal power and leadership development programs',
        ],
      },
    },
  },
];

export function CosmicWitchScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const { isUnlocked, isTest } = useLocks();
  const [showLockModal, setShowLockModal] = useState(false);
  const [isWitchLocked, setIsWitchLocked] = useState(true);

  // Check if witch is locked (no subscription and not individually unlocked)
  const checkSubscriptionAndNavigate = async (practice: any) => {
    const hasSubscription = await PurchaseService.isSubscriptionActive();
    const witchUnlocked = isUnlocked('witchC') || isTest('witchC');
    const isLocked = !hasSubscription && !witchUnlocked;
    setIsWitchLocked(isLocked);

    if (!isLocked) {
      // If unlocked and no subscription, 5% chance to show an ad
      // Legacy ad chance removed
      navigation.navigate('PracticeDetail', { practice, witchType: 'Cosmic', witchColor: '#ffc857' });
    } else {
      setShowLockModal(true);
    }
  };

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const handlePracticePress = useCallback((practice: any) => {
    checkSubscriptionAndNavigate(practice);
  }, [navigation, isUnlocked]);

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>☄️ Cosmic Witch</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Stars, Space, and Cosmic Power
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {COSMIC_PRACTICES.map((practice) => (
              <TouchableOpacity
                key={practice.name}
                style={[styles.practiceItem, { backgroundColor: cardBg }]}
                onPress={() => handlePracticePress(practice)}
              >
                <Text style={styles.practiceEmoji}>{practice.emoji}</Text>
                <View style={styles.practiceInfo}>
                  <Text style={[styles.practiceName, { color: textColor }]}>
                    {practice.name}
                  </Text>
                  <Text style={[styles.practiceLabel, { color: mutedColor }]}>
                    {practice.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <WitchLockOverlay
        witchType="Cosmic Witch"
        lockKey="witchC"
        isLocked={showLockModal && isWitchLocked}
        onUnlock={() => setShowLockModal(false)}
        onSubscribe={() => {
          console.log('Subscribe button pressed');
          setShowLockModal(false);
        }}
      />
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  practiceStack: {
    gap: 12,
  },
  practiceItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  practiceEmoji: {
    fontSize: 32,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  practiceLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
});
