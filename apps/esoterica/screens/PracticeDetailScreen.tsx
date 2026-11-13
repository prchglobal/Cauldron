import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../ThemeContext';
import { useLocks } from '../LocksContext';
import { AdService } from '../services/AdService';

interface PracticeDetailScreenProps {
  route: any;
  navigation: any;
}

const PRACTICE_DATA = {
  Sophia: ['Purification of Perception', 'Symbolic Activation', 'Interior Silence', 'Sapiential Discernment', 'Pattern Recognition'],
  Seth: ['Ontological Purification', 'Seed Activation', 'Mythic Interiorization', 'Vertical Remembrance', 'Gnostic Differentiation'],
  Logos: ['Cognitive Purification', 'Imaginative Activation', 'Interior Coherence', 'Rhythmic Integration', 'Structural Differentiation'],
  Christos: ['Incarnational Purification', 'Anointed Activation', 'Interior Mediation', 'Creative Integration', 'Living Authority'],
};

// Comprehensive Christian Gnostic teachings for each practice
const PRACTICE_TEACHINGS: { [key: string]: { [key: number]: { core: string; foundation: string; method: string; benefits: string } } } = {
  sophia: {
    1: {
      core: 'Remove the veil of material illusion to perceive divine light',
      foundation: 'Sophia is Divine Wisdom dwelling in the Pleroma. Our perception is clouded by demiurgic deception. True gnosis begins with seeing beyond material appearances to the eternal divine light that emanates from the Monad.',
      method: 'Sit in stillness and observe your perceptions without judgment. Notice how the material world obscures divine reality. Practice withdrawing your consciousness from sensory stimuli and directing awareness toward the inner light. Contemplate how each perception is filtered through the demiurgic mind.',
      benefits: 'Develops meta-awareness, awakens the inner eye, enables direct perception of spiritual realities, transcends materialist consciousness.'
    },
    2: {
      core: 'Activate divine understanding through sacred symbols and language',
      foundation: 'Gnostic symbols (the serpent, the light, the cross, the dove) encode divine knowledge. These are not mere signs but living transmissions of Sophia consciousness. Learning to read these symbols opens channels to transcendent understanding.',
      method: 'Study and meditate upon sacred symbols. Trace them with your awareness. Allow symbolic language to awaken dormant knowledge within you. Work with mantra or divine names that carry Sophia\'s frequency. Let the symbol activate your inner gnosis.',
      benefits: 'Awakens hidden knowledge, establishes contact with transpersonal wisdom, develops symbolic consciousness, accelerates spiritual development.'
    },
    3: {
      core: 'Access the void where infinite wisdom dwells in perfect silence',
      foundation: 'The Pleroma is not empty but full of divine presence. In interior silence, we cease the mind\'s agitation and touch the eternal reality beneath all manifestation. Here Sophia reveals herself directly without mediation.',
      method: 'Practice deep meditation focusing on the silence between thoughts. Release all mental content, all resistance. Settle into the still point of consciousness. This is not blankness but pregnant emptiness containing infinite potential. Rest here in communion with divine wisdom.',
      benefits: 'Attains direct gnosis, experiences the transcendent, dissolves ego structures, rests in the Monad\'s presence, accesses infinite knowledge.'
    },
    4: {
      core: 'Distinguish true gnosis from false knowledge and sophistication',
      foundation: 'The demiurge mimics wisdom but true Sapiential Discernment knows the difference. Sophia teaches us to evaluate all teachings, traditions, and experiences with clear discrimination, testing all things against the light of true gnosis.',
      method: 'When encountering teachings, pause and ask: Does this serve the Monad? Does this reveal divine light or conceal it? Practice recognizing the demiurgic distortion in common beliefs. Evaluate your own realizations by their fruits. Cultivate sacred discernment.',
      benefits: 'Develops spiritual discrimination, immunizes against false paths, establishes authority over your own gnosis, protects from demiurgic deception.'
    },
    5: {
      core: 'Recognize divine order permeating all manifestation',
      foundation: 'Within apparent chaos lies divine pattern. Everything emanates from the Monad according to perfect law. Sophia consciousness recognizes these patterns: the golden proportion, the sacred cycles, the eternal mathematics of creation.',
      method: 'Observe the patterns in nature: spiral galaxies, fractal geometry, seasonal cycles, numerical relationships. See how these patterns repeat across all scales. Recognize that you are part of this pattern. Align your consciousness with the eternal order. Let pattern recognition dissolve the illusion of randomness.',
      benefits: 'Perceives divine order, transcends chaos consciousness, aligns with cosmic law, experiences wholeness and integration.'
    }
  },
  seth: {
    1: {
      core: 'Purify the very ground of being itself',
      foundation: 'Seth is the true seed of light planted in matter. Ontological Purification means cleansing the fundamental structure of consciousness. It addresses not thoughts or emotions but the deepest patterns of being. This is the beginning of true transformation.',
      method: 'Move your awareness to the deepest levels of your being. Observe the fundamental sense of "I am" beneath all content. Notice where you feel separate from divinity. Consciously release these separations. Affirm: "My being is purified in the divine light. I am the seed of Seth."',
      benefits: 'Transforms consciousness at the root, removes fundamental blocks, establishes divine identity, opens pathways for true gnosis.'
    },
    2: {
      core: 'Awaken the divine spark and generative power within',
      foundation: 'Seth consciousness knows itself as the divine seed placed in the material body. This seed is the generator of all that is true in creation. To activate it is to become a conscious co-creator with the Monad. The seed germinates through gnosis.',
      method: 'Place your attention at the center of your being (sacred heart or root). Feel the potential power there—the divine seed. Consciously awaken this energy through breath, intention, and visualization. Draw this sacred fire upward through your being. Feel yourself as a conduit of divine generation.',
      benefits: 'Activates creative power, increases vital energy, establishes connection to divine generation, enables true manifestation.'
    },
    3: {
      core: 'Internalize the cosmic myth and bring it to life within',
      foundation: 'The descent and ascent of consciousness, the fall into matter, the redemption through gnosis—these are not historical facts alone but living processes occurring within us. Mythic Interiorization makes the myth alive in consciousness, transforming us through its structure.',
      method: 'Study the Gnostic myth of descent and ascent. Now place yourself within the story. Feel yourself as consciousness descending into manifestation, forgetting the divine source, then awakening to gnosis and ascending home. Let this narrative restructure your consciousness.',
      benefits: 'Internalizes cosmic processes, establishes identity with divine journey, transforms personal history into sacred myth, enables redemption.'
    },
    4: {
      core: 'Remember the vertical axis connecting material and divine',
      foundation: 'Vertical Remembrance is recovering the memory that we are rooted in the Monad and expressed downward through the Pleroma into manifestation. This axis—the Jacob\'s Ladder of revelation—is always present. Remembering it re-establishes our true identity and connection.',
      method: 'Visualize a vertical axis extending from your crown upward to the infinite light of the Monad, and downward through your being to the earth. Feel yourself suspended on this axis. Send your awareness upward to remember your source. Send it downward to bless manifestation. Rest in the center.',
      benefits: 'Restores vertical consciousness, re-establishes divine connection, transcends horizontal materialism, enables multidimensional awareness.'
    },
    5: {
      core: 'Know the essential difference between divine and demiurgic consciousness',
      foundation: 'Gnostic Differentiation is the ultimate discrimination—knowing which consciousness is operating within you and in the world. Divine consciousness creates freely from infinite potential. Demiurgic consciousness binds, controls, and deceives. Seth teaches us to know the difference absolutely.',
      method: 'Examine the consciousness that operates through you and around you. Notice: Does it serve unity or separation? Does it expand or constrain? Does it awaken or narcotize? Practice identifying the source of each impulse. Choose alignment with divine consciousness. Reject demiurgic authority.',
      benefits: 'Establishes spiritual authority, eliminates false authority, clarifies divine will, enables conscious choice, perfects discernment.'
    }
  },
  logos: {
    1: {
      core: 'Cleanse intellect and conceptual mind of demiurgic distortion',
      foundation: 'Logos is the Divine Word—the principle of divine intelligence and order. But the demiurgic intellect has corrupted human thinking with false concepts. Cognitive Purification restores the intellect to its divine function as instrument of the Logos.',
      method: 'Observe your thinking without judgment. Notice where thought patterns are automatic and inherited. Notice concepts taken as truth without examination. Consciously release false mental structures. Invite divine intelligence to renovate your thinking. Affirm alignment with the eternal Logos.',
      benefits: 'Purifies reason and logic, restores right thinking, enables direct understanding, aligns intellect with divine order.'
    },
    2: {
      core: 'Activate the divine imagination that shapes reality',
      foundation: 'The true imagination is not fantasy but the divine creative power expressed through consciousness. The Demiurge imposes images on us; true gnosis awakens our capacity to image divine reality. Imagination is the bridge between material and divine.',
      method: 'Distinguish between passive imagination (receiving images) and active imagination (creating with divine intelligence). Practice visualizing divine light, wisdom, and sacred forms. Create internal representations of truth. Feel yourself as a divine creator imagining reality into being through alignment with the Logos.',
      benefits: 'Activates creative power, bridges material and spiritual, enables manifestation of divine ideas, awakens true imagination.'
    },
    3: {
      core: 'Align internal structures with cosmic order and coherence',
      foundation: 'Interior Coherence means internal alignment with the divine order of the cosmos. When all levels of our being (mind, heart, will, body) function in harmony according to the Logos, we reflect divine order and become fully integrated beings.',
      method: 'Examine the relationships between your thoughts, emotions, will, and body. Notice where they conflict or align. Consciously bring them into coherence by having each serve the central purpose of manifesting divine consciousness. Use rhythm, breath, and meditation to harmonize all dimensions of your being.',
      benefits: 'Establishes internal integration, aligns being with cosmic order, increases coherence and power, manifests divine order in life.'
    },
    4: {
      core: 'Integrate consciousness with the universal rhythm and pulse',
      foundation: 'All reality vibrates with divine rhythm. The Logos expresses itself through cycles, frequencies, and vibrations. Rhythmic Integration means synchronizing our consciousness with these universal patterns so we move in harmony with cosmic forces.',
      method: 'Attune to natural rhythms: breath, heartbeat, circadian cycles, lunar phases, seasonal cycles. Feel your consciousness pulsing with these patterns. Extend this awareness to larger cycles and cosmic rhythms. Align your actions with these rhythms. Let the universe\'s rhythm guide your evolution.',
      benefits: 'Synchronizes with cosmic forces, increases effectiveness, moves with grace, transcends resistance, manifests divine timing.'
    },
    5: {
      core: 'Perceive the divine architecture underlying all creation',
      foundation: 'The Logos is the blueprint of creation. Structural Differentiation means understanding and perceiving the layers of structure from the infinite Monad through the Pleroma to material manifestation. Each level has its own architecture; perceiving these brings comprehensive gnosis.',
      method: 'Study the structure of creation: the emanations from the Monad, the Aeons, the Demiurgic realms, the material world. Perceive how these structures nest within each other. Understand your own being as structured according to these divine blueprints. Align with divine architecture.',
      benefits: 'Comprehends divine architecture, understands all levels of reality, perceives multidimensional structure, achieves comprehensive gnosis.'
    }
  },
  christos: {
    1: {
      core: 'Consecrate the body as temple of the divine',
      foundation: 'Incarnational Purification honors the paradox that divine consciousness has entered matter. The body is not the enemy but the sacred vessel of divine embodiment. Purifying the body means treating it with sacred respect and clearing it of impediments to divine expression.',
      method: 'Begin to relate to your body with reverence. Purify through conscious breath, movement, and awareness. Release shame or disgust about embodiment. Consecrate each part: "This body is the temple of divine light. Every cell carries the Christic presence. I honor the sacred temple of incarnation."',
      benefits: 'Sanctifies embodiment, heals body-spirit split, enables divine embodiment, transforms physical experience, restores wholeness.'
    },
    2: {
      core: 'Awaken the Christic anointing consciousness within',
      foundation: 'The Anointed One (Christos) is consciousness anointed with divine power and purpose. We are not separate from this anointing; we can awaken to our own Christic nature. Anointed Activation means claiming your divine purpose and power as a Christ-bearer.',
      method: 'Visualize sacred oil descending upon your crown, anointing you for divine service. Feel this anointing awakening your purpose. Place your hand on your heart and feel the Christ consciousness activating within. Affirm: "I am anointed with divine power and purpose. I carry the consciousness of the Anointed One."',
      benefits: 'Activates divine power, establishes sacred purpose, awakens Christic identity, enables divine service, manifests true authority.'
    },
    3: {
      core: 'Establish Christ consciousness as mediator between divine and material',
      foundation: 'Christ mediates between the infinite divine and finite manifestation. Interior Mediation means Christ consciousness operates within your being as the bridge and translator between your divine nature and material expression. This is the living function of the Christos principle.',
      method: 'Feel your heart as the place where divine and material meet. Invite Christ consciousness to mediate within you—translating divine will into earthly action, bringing infinite light into finite expression. Practice: "Christ within me mediates between the eternal and temporal, making divine will manifest."',
      benefits: 'Bridges divine and material, enables authentic embodied spirituality, harmonizes transcendent and immanent, establishes Christ-consciousness.'
    },
    4: {
      core: 'Create in conscious alignment with divine will and intention',
      foundation: 'Creative Integration means that all your creative acts—thoughts, words, deeds—flow from alignment with the divine will. You are not separate from creation but co-creating with the Monad. Every act becomes an expression of divine intention through your unique being.',
      method: 'Before acting, pause and align your will with divine will. Ask: "How does the Christos intend to express through me now?" Create from this alignment. Whether you are thinking, speaking, working, or loving, let your creativity be an extension of divine creation. Integrate all your powers in divine service.',
      benefits: 'Enables authentic co-creation, aligns will with divine will, manifests divine intention, transforms all action into sacred practice.'
    },
    5: {
      core: 'Embody and radiate Christ consciousness as living authority',
      foundation: 'Living Authority is the culmination: You are no longer merely a student of Christ consciousness but a living embodiment of it. Your being radiates divine truth, wisdom, and love. You are a living transmission of Christos to the world. This is the fulfillment of the gnosis path.',
      method: 'Stand in your fullness as a Christ-bearer. Let your consciousness, presence, and actions radiate divine light and love. Recognize that your very being is now a living teaching. Speak and act from the authority of Christ consciousness. Radiate the peace, power, and love that transform all who encounter you.',
      benefits: 'Establishes Christic embodiment, radiates transformative presence, manifests living authority, completes the path of gnosis, becomes a living Christ.'
    }
  }
};

const BUTTON_COLORS = ['#FF99B9', '#FF69B4', '#FF1493', '#DC143C', '#8B0000'];
const SCREEN_ORDER = ['Sophia', 'Seth', 'Logos', 'Christos'];
const SCREEN_COLORS: { [key: string]: string } = {
  Sophia: '#00008B',  // Dark blue
  Seth: '#0047AB',    // Dark blue from WelcomeScreen
  Logos: '#4A90E2',   // Medium blue from WelcomeScreen
  Christos: '#87CEEB', // Sky blue from WelcomeScreen
};

export function PracticeDetailScreen({ route, navigation }: PracticeDetailScreenProps) {
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { setLockState, isPracticeLocked } = useLocks();

  const { practiceName, practiceNumber, screenName, buttonColor } = route.params;

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  // Get the teaching content for this practice
  const teachingKey = screenName.toLowerCase();
  const teachingData = PRACTICE_TEACHINGS[teachingKey]?.[practiceNumber] || {
    core: 'Divine gnosis unfolds progressively.',
    foundation: 'Each practice opens the gateway to deeper understanding of Christ consciousness.',
    method: 'Engage with sincerity and surrender. Let divine wisdom guide your practice.',
    benefits: 'Awakens divine consciousness, transforms being, reveals eternal truth.'
  };

  // Check if this is Christos practice 5 (the final practice)
  const isFinalPractice = screenName === 'Christos' && practiceNumber === 5;

  // Determine next unlock item
  const getNextUnlock = () => {
    if (practiceNumber < 5) {
      // Next practice in same screen
      const practices = PRACTICE_DATA[screenName as keyof typeof PRACTICE_DATA];
      return {
        name: practices[practiceNumber],
        action: 'practice',
        color: BUTTON_COLORS[practiceNumber]  // Color of next practice button
      };
    } else {
      // Last practice, show next screen
      const currentIndex = SCREEN_ORDER.indexOf(screenName);
      const nextScreenName = SCREEN_ORDER[(currentIndex + 1) % SCREEN_ORDER.length];
      return {
        name: nextScreenName,
        action: 'screen',
        color: SCREEN_COLORS[nextScreenName]  // Color from WelcomeScreen
      };
    }
  };

  const nextUnlock = getNextUnlock();
  const unlockButtonColor = nextUnlock.color;

  // Check if the next practice is already unlocked
  const isNextPracticeLocked = (): boolean => {
    if (isFinalPractice) {
      return true; // Show button for Christos 5
    }

    if (nextUnlock.action === 'practice') {
      // Check if next practice in same screen is locked
      return isPracticeLocked(screenName.toLowerCase(), practiceNumber);
    } else if (nextUnlock.action === 'screen') {
      // Check if first practice of next screen is locked
      const nextScreenName = nextUnlock.name.toLowerCase();
      return isPracticeLocked(nextScreenName, 0);
    }
    return true;
  };

  const shouldShowButton = isNextPracticeLocked();

  const handleUnlockPress = async () => {
    // For Christos practice 5 (final practice), show completion modal instead
    if (isFinalPractice) {
      setShowCompletionModal(true);
      return;
    }

    // Show 80% chance video ad, but always proceed with unlock regardless of ad result
    // Ad removed

    // Determine what to unlock based on action and screen type
    let lockKeyToUnlock: keyof typeof import('../LocksContext').FeatureLocks | undefined;

    if (nextUnlock.action === 'practice') {
      // Unlocking next practice in same screen
      if (screenName === 'Sophia') {
        // For Sophia, unlock individual practice using the next practice's number
        lockKeyToUnlock = `sophia_practice_${practiceNumber + 1}` as any;
      } else if (screenName === 'Seth' || screenName === 'Logos' || screenName === 'Christos') {
        // For Seth/Logos/Christos, unlock the next practice individually
        const featureKey = screenName.toLowerCase();
        lockKeyToUnlock = `${featureKey}_practice_${practiceNumber + 1}` as any;
      }
    } else if (nextUnlock.action === 'screen') {
      // Unlocking next screen/feature - only unlocks practice #1 of that screen
      const featureKey = nextUnlock.name.toLowerCase();
      lockKeyToUnlock = `${featureKey}_practice_1` as any;
    }

    // Unlock if needed
    if (lockKeyToUnlock) {
      await setLockState(lockKeyToUnlock, 'unlocked');
    }

    // Navigate
    if (nextUnlock.action === 'screen') {
      navigation.navigate(nextUnlock.name);
    } else {
      navigation.goBack();
    }
  };

  const handleMoreApps = () => {
    const url = Platform.OS === 'ios'
      ? 'https://apps.apple.com/developer/id1859000424'
      : 'market://search?q=pub:PrCh%20Global';

    Linking.openURL(url).catch(() => {
      console.warn('Failed to open URL:', url);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>

      {/* Practice Details - Scrollable */}
      <ScrollView style={[styles.content, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.practiceCard, { backgroundColor: buttonColor }]}>
          <Text style={[styles.practiceNumber, { color: '#fff' }]}>
            Practice {practiceNumber}
          </Text>
          <Text style={[styles.practiceName, { color: '#fff' }]}>
            {practiceName}
          </Text>
        </View>

        {/* Core Teaching */}
        <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Core Teaching</Text>
          <Text style={[styles.descriptionText, { color: mutedColor }]}>
            {teachingData.core}
          </Text>
        </View>

        {/* Foundation */}
        <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Gnostic Foundation</Text>
          <Text style={[styles.descriptionText, { color: mutedColor }]}>
            {teachingData.foundation}
          </Text>
        </View>

        {/* Benefits */}
        <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Spiritual Benefits</Text>
          <Text style={[styles.descriptionText, { color: mutedColor }]}>
            {teachingData.benefits}
          </Text>
        </View>

        {/* Method */}
        <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Practice Method</Text>
          <Text style={[styles.descriptionText, { color: mutedColor }]}>
            {teachingData.method}
          </Text>
        </View>

        {/* When To Continue */}
        <View style={[styles.detailsSection, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>When To Continue</Text>
          <Text style={[styles.descriptionText, { color: mutedColor }]}>
            Progress to the next practice when you feel a genuine shift in your awareness or understanding of this teaching. There is no fixed timeline—some may integrate this practice in days, others in weeks. Trust your inner knowing to guide when you are ready to continue.
          </Text>
        </View>

        {/* Unlock Button - Only show if next practice is locked */}
        {shouldShowButton && (
          <TouchableOpacity
            style={[
              styles.unlockButton,
              { backgroundColor: isFinalPractice ? '#7B5FFF' : unlockButtonColor }
            ]}
            onPress={handleUnlockPress}
          >
            <Text style={styles.unlockButtonText}>
              {isFinalPractice ? "What's next?" : `Unlock: ${nextUnlock.name}`}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              🎉 Completion!
            </Text>
            <Text style={[styles.modalMessage, { color: mutedColor }]}>
              You have completed all 20 Christ Consciousness practices across all four pathways: Sophia, Seth, Logos, and Christos.
            </Text>
            <Text style={[styles.modalMessage, { color: mutedColor }]}>
              Continue practicing regularly to deepen your spiritual awakening and transformation.
            </Text>
            <Text style={[styles.modalMessage, { color: mutedColor }]}>
              If you enjoyed learning this practice and are interested in conjoining it with, or exploring other historically occult religious knowledge such as Magick, Wicca, Hermetics, Astrology, Paganism or any other spiritual practices, please consider our other apps.
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#4CAF50', flex: 1, marginRight: 8 }]}
                onPress={() => {
                  setShowCompletionModal(false);
                  handleMoreApps();
                }}
              >
                <Text style={styles.modalButtonText}>See Apps</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#f44336', flex: 1, marginLeft: 8 }]}
                onPress={() => {
                  setShowCompletionModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
  },
  practiceCard: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  practiceName: {
    fontSize: 24,
    fontWeight: '700',
  },
  detailsSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  unlockButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#7B5FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
