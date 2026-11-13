import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { useLocks } from '../LocksContext';
import { WitchLockOverlay } from '../components/WitchLockOverlay';
import PurchaseService from '../PurchaseService';
import AppodealService from '../AppodealService';
import { WATER_CRYSTALS } from '../data/waterCrystalsDatabase';
import { WEATHER_PHENOMENA } from '../data/weatherMagicDatabase';
import { CLEANSING_RITUALS } from '../data/cleansingRitualsDatabase';
import { INVOCATION_TYPES } from '../data/invocationDatabase';
import { PLATONIC_SOLIDS, SACRED_RATIOS, SACRED_PATTERNS } from '../data/sacredGeometryDatabase';
import {
  CANDLE_FIRE_MAGIC,
  ENERGY_VISUALIZATION,
  SYMBOLIC_MATERIAL,
  LUNAR_ELEMENTAL,
  RITUAL_SPELLWORK,
  HERBAL_NATURAL,
} from '../data/manifestationTechniquesDatabase';

const FLOW_PRACTICES = [
  {
    name: 'Ontology',
    isSpacer: true,
  },
  {
    name: 'Sulfur',
    emoji: '🔥',
    description: 'Motile - Work with atmospheric forces and elemental motion',
    category: {
      level1: 'Essentials',
      level2: 'Sulfur - Motile',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Identity',
            emoji: '👤',
            description: 'Core self-definition. Your essence beyond persona.',
            content: 'Core self-definition is the fixed point of your being—your essence beyond persona, the immutable self that persists through all transformation. In Sulfur work, you distinguish between the personality constructed by society and the essential self that burns beneath. Identity asks: Who am I when everything else is stripped away? What is the core of my being?\n\nThis is not egoic identity but your soul\'s signature, your fundamental nature, the "I AM" beneath all "I do." In Hermetic philosophy, Identity is your True Will—the authentic vector of your being that differs from personality. The Greeks called this daimon (inner divine force). In Taoist alchemy, Identity is your original nature before conditioning.\n\nDiscover your Identity through: examining what remains constant across contexts, noticing what brings genuine aliveness (not just pleasure), identifying activities where ego dissolves and flow occurs. Your Identity is revealed in crisis—what values do you actually defend when tested? What cannot be compromised without destroying your integrity? The Kabbalistic teaching is that Identity corresponds to Chokmah (primal will) reflected through Yesod (personal psyche). This Identity is not changeable; it is the point that persists through all transformations.',
          },
          {
            name: 'Will',
            emoji: '⚡',
            description: 'Directional force. Where you direct your power.',
            content: 'Will is the vector of your being—where you consciously choose to direct your power and attention. Will is not mere desire but intentional commitment. It is the Red King\'s noble direction toward transformation and union.\n\nWill asks: What am I consciously choosing? Toward what end do I direct my power? Is my will aligned with my deepest truth or am I being driven by conditioning? Developing will means distinguishing between what you authentically want and what you think you should want.\n\nIn ceremonial magic, Will is invoked through the Wand (represents will and fire). In Kabbalah, Will corresponds to Chokmah (pure creative force). The Hermetic maxim states: "Willpower is not force but direction of force."\n\nWill is cultivated through: daily intention-setting with precision (vague intentions produce vague results), maintaining commitments even when difficult (discipline builds will), noticing where you give power away to others\' agendas, reclaiming sovereignty over your choices.\n\nThe strongest will is not demanding but clear—like water finding its course inevitably downhill. In the grimoires, the magician\'s will is the primary tool—all other tools amplify the will but cannot replace it. A weak will produces weak results regardless of technique.',
          },
          {
            name: 'Drive',
            emoji: '🔥',
            description: 'Motivational intensity. The force that compels you.',
            content: 'Drive is the combustive force behind your actions—your passion, ambition, and hunger for transformation. Drive is raw Sulfuric energy: the internal pressure that compels you forward.\n\nDrive asks: What truly energizes you? What makes you burn? Where do you feel most alive and engaged? Drive is essential but can become obsessive if unchecked. The goal is conscious direction of your drive toward authentic goals rather than unconscious reactivity to external pressure.\n\nIn alchemy, Drive is the prima materia of personal work—the raw material you transmute through practice. Paracelsus taught that personal power comes from recognizing and harnessing your fundamental drives rather than suppressing them. The tantric paths teach that sexual drive (Kundalini) is sacred fire—not to be repressed but consciously elevated through practice.\n\nDrive can be: sublimated (transformed into higher expressions), redirected (channeled toward different goals), mastered (directed consciously rather than reactive), or integrated (owned rather than projected).\n\nThe medieval alchemists understood Drive as the vital force animating the Work. Without Drive, nothing happens. Excessive drive without wisdom creates burnout; insufficient drive creates stagnation. The balance point is sustainable passion directed toward authentic transformation.',
          },
          {
            name: 'Volatility',
            emoji: '💨',
            description: 'Instability source. Sulfur\'s reactivity.',
            content: 'Volatility is Sulfur\'s inherent reactivity and tendency to explosive transformation. Volatility is not weakness but Sulfur\'s nature—quick to ignite, swift to transform, responsive to catalysts.\n\nVolatility asks: Where are you reactive rather than responsive? What triggers explosive emotion or behavior? How do you use your sensitivity as advantage rather than liability? Working with volatility means embracing your responsiveness while developing the wisdom (Mercury) and grounding (Salt) to direct it consciously.\n\nIn alchemical texts, volatility is literally the property of Sulfur—it vaporizes under heat, transforms rapidly, refuses to be contained. The mystical teaching is that this mirrors human nature: some individuals are naturally volatile (high emotional reactivity, rapid shifts, catalytic presence).\n\nAncient texts describe volatile individuals as "touched by heaven"—more responsive to subtle influences, more easily inspired, but also more easily disrupted. The practice is not deadening volatility but mastering it through: recognizing your reactivity triggers, developing pause between stimulus and response (developing Mercury\'s consciousness), grounding practice (developing Salt\'s stability), directing your volatility toward transformation rather than destruction.\n\nThe volatile person who develops mastery becomes a powerful catalyst for change. In the qabalah, volatility is the lightning flash of Chokmah—pure creative fire that needs to be grounded through the Tree of Life to manifest.',
          },
          {
            name: 'Combustion',
            emoji: '🌟',
            description: 'Catalyst for change. The burning transformation.',
            content: 'Combustion is the alchemical burning that transforms matter from one state to another. Combustion is Sulfur\'s primary action—the intense heat that breaks old structures and enables new formations.\n\nCombustion asks: What needs to burn away? What old patterns, beliefs, or identities are ready for transformation? Combustion is calcination—destruction that clears space for rebirth. This can be literal (burning ritual objects) or symbolic (conscious release of limiting patterns).\n\nCombustion is frightening because it means death of the old self. The classical alchemical Calcination is the first operation: matter is burned to ash. Psychologically, this is Nigredo work—burning away false identity.\n\nHermetic texts teach that Combustion is the fundamental operation that all other transformations depend on: you cannot refine gold that is mixed with base metals; you must burn away the base first. The Chinese alchemical tradition teaches that internal combustion (inner fire cultivated through practice) is the catalyst for spiritual transformation. Tantric practices work directly with inner combustion through breath and visualization to ignite Kundalini.\n\nCombustion requires courage: you must consent to the burning, accept the dissolution, trust that ash will transform into new form. The goal is not endless destruction but intelligent use of fire to transform matter toward your goal. In the Western grimoires, Combustion is invoked during eclipse or at Mars-ruled hours to maximize transformative power.',
          },
          {
            name: 'Refinement',
            emoji: '✨',
            description: 'Purified through discipline. Power elevated.',
            content: 'Refinement is Sulfur elevated and refined through conscious practice and ethical direction. Raw Sulfuric power becomes sacred fire when tempered by wisdom and focused toward truth.\n\nRefinement asks: How do I elevate my base drives into higher expressions? How do I transform rage into righteous will? How do I sublimate lust into sacred desire? Refinement is not suppression but transmutation—taking raw Sulfuric energy and transforming it through discipline into spiritual fuel. This is the Red King becoming noble.\n\nIn alchemical progression, after Calcination comes Dissolution, then Separation, then Conjunction, then Fermentation, then Distillation, and finally Coagulation. Refinement corresponds to the distillation operations: separating pure from impure, refining gold to higher purity, elevating essence through repeated heating and cooling cycles.\n\nIn human terms, this is the repeated practice of: igniting intention, burning away what doesn\'t serve, clarifying what remains, integrating the refined result. The Taoist texts teach that repeated small refinements of your personal energy create exponential spiritual development. Each cycle of practice purifies you further.\n\nRefinement through discipline transforms base metals (raw drives, destructive habits, egoic patterns) into gold (spiritual power, authentic desire, noble will). The crucible of discipline is where this transformation occurs. Medieval texts describe this as the "Great Whitening"—when the raw red Sulfur is elevated to the white Sulfur of higher consciousness.',
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Sulfur is the active alchemical principle—the volatile essence of transformation, will, and creative fire. In the Great Work, Sulfur represents the Red King, the active masculine principle that seeks unity with Mercury (the White Queen). Sulfur is not literal sulfur but the principle of combustion, passion, and transmutation through intensity. Working with Sulfur means embracing your will, your desire, your burning need for transformation. Sulfur is the spark that ignites change—without Sulfur, nothing would burn, nothing would transform, nothing would move. This practice teaches you to work with the volatile energies within yourself: your passion, your ambition, your drive toward spiritual transformation. Sulfur work requires courage and clarity because it activates deep personal power.',
          },
          {
            heading: 'The Three Principles: Sulfur, Mercury & Salt',
            content: 'Classical alchemy recognizes three fundamental principles: Sulfur (active, volatile, masculine), Mercury (mediating, dual-natured, fluid), and Salt (fixed, passive, feminine). These aren\'t chemical but alchemical principles that exist in all matter and in human consciousness. Sulfur is will and desire—it seeks, it burns, it transforms. Mercury is consciousness and communication—it enables connection between Sulfur and Salt. Salt is the fixed body—it anchors spirit in matter. Within you: Sulfur is your active will and personal power, Mercury is your conscious awareness and intuition, Salt is your physical body and grounded presence. Understanding the three principles reveals how transformation works: Sulfur\'s passion must be mediated by Mercury\'s wisdom and anchored by Salt\'s grounding. Imbalance in any principle creates problems.',
          },
          {
            heading: 'Sulfur\'s Combustion: Working with Personal Fire',
            content: 'Sulfur represents your personal fire—your passion, ambition, creative drive, and will toward transformation. This fire is essential: it powers your spiritual work, drives your growth, and fuels your magical effectiveness. However, uncontrolled Sulfur burns destructively: obsession, manipulation, burnout, overwhelming others. Working with Sulfur means: recognizing your fire honestly (what truly drives you?), tending it consciously (how do you feed your passion without letting it consume you?), directing it wisely (toward what goals?), and tempering it with Mercury\'s wisdom and Salt\'s grounding. Notice when your Sulfur is ignited: you feel energized, passionate, capable. Notice when it\'s excessive: you feel burned out, obsessive, disconnected from others. The goal is conscious mastery of your personal fire.',
          },
          {
            heading: 'Sublimation & Volatility',
            content: 'Sulfur naturally sublimates—it vaporizes under heat, becoming invisible yet powerful, transforming from one state to another. This is the essence of Sulfur\'s alchemical action: transformation through intensity. In your practice, sublimation means elevating your personal power from lower expressions (rage, lust, greed) to higher expressions (will for truth, sacred desire, generosity). What appears as raw passion can be sublimated into spiritual dedication. Lower desires can be transformed into higher aspirations. Volatility is Sulfur\'s nature—it\'s quick, responsive, alive. Working with volatility means embracing change rather than fearing it, moving swiftly toward opportunity, and using your inherent reactivity as advantage rather than liability.',
          },
          {
            heading: 'Red King Symbolism',
            content: 'In alchemical symbolism, Sulfur is the Red King—the fiery masculine principle that must unite with Mercury\'s White Queen to create the Philosopher\'s Stone. The Red King burns with desire for transformation and union. Within your own work, the Red King is your highest aspiration expressed as active will. It\'s not about dominance or control but about the fierce clarity of purpose and the burning determination to transform. The Red King seeks the White Queen (Mercury) for union—seeks to balance passion with wisdom, will with intuition, action with reflection. Working with Red King energy means accessing your noble will: your dedication to your own evolution, your fierce commitment to truth, your passionate pursuit of wisdom.',
          },
          {
            heading: 'The Calcination: Ashes of the Old Self',
            content: 'Sulfur creates calcination—burning matter down to ash. Spiritually, calcination is the burning away of ego, illusions, and outdated identities. Before true transformation can occur, the old self must burn away. Calcination work means: identifying what needs to be released (old patterns, false identities, limiting beliefs), consciously allowing these to burn (through meditation, ritual, or life circumstances), and accepting the resulting ash and emptiness as necessary. This is frightening work—losing identity feels like death. But calcination is essential: you cannot build new identity on the old structures. After calcination comes the silence and emptiness necessary for real transformation. Sulfur teaches that destruction is not always negative; sometimes burning away is the greatest gift.',
          },
          {
            heading: 'Ethical Use of Will & Personal Power',
            content: 'Sulfur\'s power can be misused for domination, manipulation, or harm. Ethical Sulfur work means: developing your will toward truth and wisdom, not control; using your power to elevate others, not diminish them; burning away your limitations, not imposing them on others; pursuing transformation within yourself, not forcing it on others. Ask: what am I burning this fire toward? Is this for genuine transformation or ego gratification? Will my actions elevate both myself and others, or just myself? Ethical Sulfur practitioners are their harshest critics, constantly examining their motivations. The difference between sacred fire and destructive fire is consciousness: sacred fire burns only what\'s yours to burn.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Sit in quiet meditation and observe your personal fire: what ignites your passion? What makes you burn?',
          'Identify one area where your Sulfur is excessive (obsession, driving too hard, burnout) and one area where it\'s deficient (lack of motivation, no drive)',
          'Journal about what true transformation would look like for you—not external change but internal evolution',
          'Begin a practice of observing your emotional heat without acting on it—notice the burn without letting it consume you',
          'Use a candle flame as focal point for meditation—observe how fire transforms, consumes, creates ash, and rises as smoke',
          'Identify one limiting pattern or false identity you\'re ready to consciously release',
          'Create a simple ritual: write what you\'re releasing on paper and safely burn it (in fireplace, candle, or outdoors), witnessing the calcination',
          'Meditate on the concept of the Red King—your highest will expressed with fierce clarity and noble purpose',
          'Begin noticing when your will serves genuine transformation versus when it serves ego',
          'Establish a daily practice: 5 minutes observing your personal fire and consciously directing it toward authentic transformation',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Fire Safety', text: 'When working with actual fire (candles, burning), practice basic fire safety. Use fireproof containers, keep water nearby, never leave flames unattended. Work responsibly with this powerful element.' },
          { title: 'Emotional Intensity', text: 'Sulfur work can activate intense emotions. If you feel overwhelmed, ground yourself: eat, rest, spend time in nature. Intensity is normal; overwhelm signals need for Salt\'s grounding.' },
          { title: 'Examine Your Motivations', text: 'Regularly ask: what\'s driving this? Is it ego or genuine spiritual will? Is this for my transformation or someone else\'s control? Honest self-examination prevents misuse.' },
          { title: 'Balance Sulfur with Mercury & Salt', text: 'Don\'t work with Sulfur in isolation. Balance passion (Sulfur) with wisdom (Mercury) and grounding (Salt). Imbalance creates destructive fire instead of transformative fire.' },
          { title: 'The Calcination is Frightening', text: 'Burning away the old self feels like death because it is a kind of death. This is normal and necessary. Trust the process. What rises from the ashes is stronger and truer.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Kybalion (Three Principles section)',
          'The Alchemists: Mystics of the Golden Elixir by Titus Burckhardt',
          'Jung\'s Psychology and Alchemy (Sulfur symbolism)',
          'Medieval alchemical texts on calcination and the Great Work',
          'Meditation guides for working with personal power and transformation',
        ],
      },
    },
  },
  {
    name: 'Mercury',
    emoji: '🌊',
    description: 'Fluid - Flow with the currents and transform through fluidity',
    category: {
      level1: 'Essentials',
      level2: 'Fluid - Mercury',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Mind',
            emoji: '🧠',
            description: 'Cognition and perception. Consciousness itself.',
            content: 'Mind is cognition and perception—the faculty of consciousness itself. Your ability to know, understand, and perceive reality. Mind is Mercury\'s primary domain.\n\nIn Hermetic philosophy, mind is not limited to brain but is a universal principle that exists in all matter and consciousness. Developing Mind means: sharpening perception, questioning assumptions, learning to see multiple perspectives, recognizing patterns beneath surfaces.\n\nMind asks: What am I truly perceiving versus what I assume? Can I hold paradox without collapsing it into false certainty?\n\nMind is the capacity to know thyself—the examined life that leads to wisdom. The Emerald Tablet teaches: "As above, so below; as below, so above"—meaning the mind perceives through this principle of correspondence.\n\nIn Qabalah, Mind corresponds to Binah (understanding) mediated through Mercury (Hod—intellect). The Kabbalistic teaching distinguishes between Yesod (imagination) and Hod (reason)—Mercury must balance both.\n\nThe Taoist sage cultivates "no-mind"—not absence of thought but freedom from being controlled by thought. True Mind is fluid, responsive, capable of holding multiple perspectives simultaneously without requiring resolution into single truth.',
          },
          {
            name: 'Adaptation',
            emoji: '🔄',
            description: 'Responsiveness to change. Flow with circumstance.',
            content: 'Adaptation is Mercury\'s defining characteristic—the ability to flow with circumstance rather than rigidly resisting. Adaptation is not weakness or abandonment of principle but intelligent response to new conditions.\n\nAdaptation asks: Where are you rigid when flexibility serves better? Where do you cling to old methods that no longer work? How can you remain true to your essence while transforming your expression?\n\nTrue adaptation maintains core integrity while shifting surface form—like water that holds its essential nature whether ice, liquid, or vapor.\n\nIn the Daodejing, water is taught as the supreme example: it flows around all obstacles, conforms to its container, yet wears away stone. Mercury is the mediator in alchemy—adapting between extremes, translating between realms, connecting that which seems separate.\n\nIn ceremonial magic, Mercury rules all communication and adaptation through planetary hours. The Hermetic teaching states: "That which can adapt endures; that which cannot adapt perishes."\n\nThe practice involves: releasing attachment to specific methods, maintaining flexibility in approach while staying committed to your goal, observing where you\'re holding patterns that no longer serve, consciously experimenting with new approaches. Adaptation is not indecision but intelligent responsiveness.',
          },
          {
            name: 'Flow',
            emoji: '💧',
            description: 'Movement between states. Dynamic transformation.',
            content: 'Flow is Mercury\'s dynamic action—the continuous transformation from one condition to another. Flow is not stagnation or aimless movement but purposeful progression through states toward refinement.\n\nFlow asks: Are you moving toward your transformation or stuck in resistance? Can you navigate between inner and outer worlds, between spirit and matter, between knowing and unknowing?\n\nFlow teaches that stagnation is death while movement is life. The goal is conscious flow: not being swept away by currents but navigating them with intention.\n\nIn Taoist alchemy, the principle of Wu Wei (effortless action) teaches perfect Flow—action that aligns with natural currents so completely that it appears to happen without effort. The river teaches: it flows downhill following gravity, shapes itself to the landscape, wears down mountains through patient persistence, always finds the lowest point. Mercury\'s flow is like this: natural, responsive, inevitably reaching its destination.\n\nThe practice involves: noticing where you\'re fighting current versus flowing with it, distinguishing between being carried away versus navigating consciously, developing sensitivity to subtle shifts in conditions, adjusting course fluidly based on feedback.\n\nMasters of Flow appear to accomplish much with little effort—they\'ve learned to align with natural patterns rather than forcing against them.',
          },
          {
            name: 'Mediation',
            emoji: '🌉',
            description: 'Connects opposites. Bridges aparities.',
            content: 'Mediation is Mercury\'s role as messenger and go-between—the principle that bridges apparent opposites and connects disparate processes into wholeness.\n\nMediation asks: What opposites within you need connection? How can you bridge the gap between your will (Sulfur) and your grounding (Salt)? Mercury is the mediating force that prevents polarization.\n\nIn consciousness, mediation means holding multiple truths simultaneously without collapsing into one perspective. Mercury teaches that connection often matters more than purity.\n\nIn alchemy, Mercury is the serpent that swallows its tail—it joins opposites (red and white, Sulfur and mercury metal, spirit and matter). The Hermetic Caduceus shows Mercury\'s staff with two serpents entwined—this is the symbol of mediation between polarities.\n\nIn Qabalah, Hod (Mercury\'s sphere) sits at the center of the middle pillar, mediating between Chokmah and Binah, between will and understanding.\n\nThe practice involves: finding the middle ground between extremes without losing integrity, connecting seemingly separate parts into working whole, communicating between different perspectives, serving as bridge rather than judge.\n\nThe mediator\'s skill is invaluable: people who can hold opposing viewpoints without losing equilibrium can solve conflicts that seem impossible to others.',
          },
          {
            name: 'Plasticity',
            emoji: '✨',
            description: 'Capacity to reform. Inherent malleability.',
            content: 'Plasticity is Mercury\'s fundamental malleability—its ability to be shaped, reformed, and transformed without losing essence. Plasticity is not about losing yourself but about the inherent flexibility of consciousness.\n\nPlasticity asks: How much have you become rigidly fixed in identity? Can you imagine yourself differently? What would it take to reform your understanding of who you are?\n\nPlasticity is the alchemical principle of transformation itself—matter that can be worked, shaped, refined toward the Philosopher\'s Stone. Your consciousness has this same quality: it can be reformed through practice, insight, and intention.\n\nMercury is called the "quicksilver" precisely because it cannot be pinned down—it flows, reforms, adapts, remains fluid. In Buddhist philosophy, this is taught as "emptiness"—consciousness has no fixed form, which is why it can take any form. In Chinese alchemy, consciousness is seen as fundamentally plastic—capable of infinite reformation.\n\nThe practice involves: experimenting with new identity expressions, not defending outdated self-concepts, remaining open to radical change in your understanding, recognizing that who you are is always reforming.\n\nThe rigid person becomes brittle and breaks; the plastic person adapts infinitely. Advanced practitioners consciously reform their consciousness through: meditation on emptiness, active imagination, symbolic work, deliberate experimentation with new behaviors, and the willingness to become something completely different.',
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Mercury is the mediating alchemical principle—the bridge between Sulfur\'s fire and Salt\'s earth, between spirit and matter, between the known and unknown. Mercury is not literal mercury but the principle of consciousness, communication, transformation, and adaptability. Mercury is the divine messenger, the trickster, the shapeshifter. In the Great Work, Mercury is the White Queen seeking union with Sulfur\'s Red King. Working with Mercury means developing your consciousness, refining your perception, learning to see clearly, and communicating truth. Mercury teaches sublimation: the transformation of gross matter into subtle spirit. Mercury is your capacity to understand, adapt, bridge opposites, and transmute experience into wisdom. This practice develops your intuitive intelligence and mental clarity.',
          },
          {
            heading: 'Mercury\'s Duality & Transmutation',
            content: 'Mercury is fundamentally dual: liquid and gas, visible and invisible, male and female, fixed and volatile. This duality is its power—Mercury holds opposites together without resolving them. In your work, this means developing comfort with paradox: truth and illusion both exist, multiple perspectives are simultaneously valid, nothing is purely good or evil. Transmutation is Mercury\'s primary action: transforming lead into gold, ignorance into wisdom, fear into understanding. Notice how Mercury transforms: it distills, refines, separates pure from impure, elevates the subtle from the gross. In your practice, transmutation means taking your experiences (especially difficult ones) and extracting wisdom from them. What was painful becomes knowledge. What was confusing becomes clarity. Transmutation is alchemy\'s central operation.',
          },
          {
            heading: 'Consciousness & Inner Vision',
            content: 'Mercury governs consciousness itself—your awareness, your ability to perceive clearly, your inner vision. Developing Mercury means sharpening perception: what are you truly seeing versus what you assume you see? Mercury practitioners develop the capacity to see beneath surfaces, to recognize hidden patterns, to perceive truth even when it contradicts expectations. Inner vision is the ability to perceive non-physical reality: intuitive knowing, symbolic messages, energetic signatures, spiritual guidance. Mercury enhances inner vision through: meditation on symbols, working with mirrors for self-reflection, studying your dreams carefully, learning to interpret signs and synchronicities. As Mercury develops, your intuition becomes increasingly reliable. You begin to perceive the world on multiple levels simultaneously.',
          },
          {
            heading: 'Communication & Expression',
            content: 'Mercury rules communication in all its forms: speaking truth clearly, listening deeply, understanding others, expressing yourself authentically. As Mercury develops, your words become more powerful because they express clearer understanding. You learn to communicate across differences, to translate between perspectives, to speak in ways that bridge gaps. Mercury teaches that words shape reality—clarity of speech creates clarity of thought which creates clarity in external life. Developing Mercury means: speaking with intention and awareness, listening without judgment, asking clarifying questions, refusing to spread misinformation, using words to heal rather than harm. Mercury practitioners are truth-tellers, but tactful ones. They understand that truth and compassion are not opposing but complementary.',
          },
          {
            heading: 'Sublimation: Elevation of Consciousness',
            content: 'Mercury naturally sublimates—it vaporizes, becoming invisible yet everywhere, transforming from visible to subtle. Spiritually, sublimation is elevation of consciousness: raising your awareness from material concerns to spiritual understanding, transforming personal will into spiritual will, elevating fear into courage. Sublimation work means consciously elevating your perspective: instead of reacting to circumstances, you step back and see the larger pattern. Instead of being caught in emotions, you observe them with clarity. Instead of being limited by beliefs, you examine them. Each level of elevation reveals new understanding. The goal of Mercury work is eventually to sublimate entirely into pure consciousness—to achieve gnosis (direct knowing) of spiritual truth.',
          },
          {
            heading: 'The White Queen & Sacred Marriage',
            content: 'Mercury is symbolized as the White Queen, the feminine principle of consciousness seeking union with Sulfur\'s Red King. This union—the Chemical Wedding—creates the Philosopher\'s Stone. Within your own work, this means balancing active Sulfur (will, passion, drive) with receptive Mercury (intuition, perception, adaptation). It means letting your will be guided by wisdom, letting your passion be directed by clarity, letting your ambition serve truth. The White Queen is not passive but actively seeking union: she demands honesty, refuses manipulation, insists on authentic partnership. Mercury asks: are you willing to truly see? To perceive what\'s actually there rather than what you wish? To transform based on what you discover?',
          },
          {
            heading: 'Mercury\'s Danger: Illusion & Deception',
            content: 'Mercury\'s power can be misused for illusion, deception, manipulation, and sophistry. Mercury is the trickster—capable of making false seem true, distorting perception, leading astray. Be alert to Mercury\'s shadow: using words to confuse rather than clarify, perceiving what you expect rather than what\'s real, adapting your truth to please others. Ethical Mercury work means: using clarity to illuminate, not obscure; perceiving truth even when uncomfortable; allowing your understanding to change based on new information; never using communication to manipulate. Ask regularly: am I perceiving accurately or selectively? Am I adapting healthily or abandoning my truth? Am I refining my understanding or simply changing my story?',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin a meditation practice focusing on your breath—Mercury\'s primary symbol—noticing how awareness follows breath',
          'Study a symbol (pentagram, hexagram, spiral) for 10 minutes daily, allowing its meaning to deepen',
          'Start journaling your observations of daily life: patterns, synchronicities, hidden meanings',
          'Practice deep listening in conversations: truly hear what others say without planning your response',
          'Work with a mirror daily: look into your eyes and ask what truth you\'re not seeing about yourself',
          'Record your dreams in detail each morning, looking for symbols and messages',
          'Learn basic tarot or oracle—Mercury systems for interpreting hidden patterns',
          'Meditate on paradox: hold two opposite truths simultaneously without trying to resolve them',
          'Practice speaking only truth for one day, noticing how challenging this is',
          'Study how something you feared transformed into wisdom—experience your own transmutation',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Trust Perception Carefully', text: 'Mercury develops clarity, but perception can still deceive. Verify intuitive knowing through multiple sources. Check your assumptions regularly. Perception is a tool to sharpen, not a guarantee of truth.' },
          { title: 'Don\'t Get Lost in Subtlety', text: 'Mercury\'s tendency is to refine endlessly, exploring ever-finer details. Balance with Salt\'s grounding and Sulfur\'s action. Mercury without grounding becomes disconnected; without fire becomes paralyzed.' },
          { title: 'Speak Truth with Compassion', text: 'Mercury\'s clarity must be tempered by heart. Truth spoken harshly causes harm. Develop the skill of communicating difficult truths with care and respect.' },
          { title: 'Recognize Illusion\'s Appeal', text: 'Illusion is often more comfortable than truth. Notice when you\'re creating explanations that soothe rather than perceive accurately. Truth sometimes hurts initially but ultimately heals.' },
          { title: 'Mercury Work is Ongoing', text: 'Mercury development never completes. There\'s always deeper clarity to achieve, more refined perception to develop, subtler truth to discover. Embrace the lifelong refinement.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Kybalion (Mercury and Correspondence)',
          'Tarot as spiritual development tool',
          'Dream interpretation guides and symbolism',
          'The Emerald Tablet (Mercury philosophy)',
          'Books on Hermes/Mercury mythology and symbolism',
        ],
      },
    },
  },
  {
    name: 'Salt',
    emoji: '🧂',
    description: 'Fixed - Ground intentions and anchor spiritual connections',
    category: {
      level1: 'Essentials',
      level2: 'Fixed - Salt',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Body',
            emoji: '💪',
            description: 'Embodiment of change. The vessel of transformation.',
            content: 'Body is Salt\'s primary expression—your physical body as the vessel through which transformation manifests. Body is not separate from spirit but its direct expression in matter. Embodiment asks: Are you bringing your spiritual work into your physical reality? Is your practice changing how you live, move, eat, and exist?\n\nThe body is not obstacle to transcendence but the very medium through which transcendence expresses. Salt teaches that neglecting the body—through abuse, starvation, or dissociation—is spiritually destructive. True practice means caring for your body: nourishing it well, moving it consciously, treating it as sacred.\n\nIn Tantra, the body is seen as the temple of consciousness—every cell is conscious, capable of enlightenment. The body is not to be transcended but transformed into a vehicle of divine presence.\n\nIn alchemy, the physical body corresponds to Salt—the fixed principle that anchors spirit in matter. Paracelsus taught that the body is the "living text of the cosmos"—every organ, every system mirrors cosmic principles.\n\nThe practice involves: treating your body with genuine respect and care, noticing how physical state affects consciousness (hunger clouds thinking, fatigue prevents insight, exercise improves mood), using physical practices (yoga, tai chi, dance) to develop consciousness, recognizing that your body is not separate from your spiritual development but integral to it.\n\nThe most advanced practitioners inhabit their bodies fully—they are grounded, present, embodied presence.',
          },
          {
            name: 'Structure',
            emoji: '🏛️',
            description: 'The crystalline form. The vessel that holds and contains transformation.',
            content: 'Structure is Salt\'s crystalline principle—it takes the formless and gives it durable shape. Structure prevents Sulfur\'s fire from burning destructively and Mercury\'s vision from evaporating into fantasy. Without structure, insight vanishes, intention dissipates, and transformation cannot crystallize.\n\nThe teaching is simple but profound: "The form holds the content." A profound meditation experienced once is forgotten by tomorrow. But a modest daily practice, performed with consistency over years, creates permanent transformation. Structure creates the repetition that crystallizes consciousness into new neural pathways, new habits, new being.\n\nIn Chinese alchemy, Structure corresponds to the crucible—the vessel in which transformation occurs. Without proper container, the Work cannot proceed. In Western alchemy, the Hermetic Seal and Round Flask represent the containing structure. The vessel must be neither too weak (it shatters) nor too rigid (transformation cannot occur), but precisely calibrated to hold the Work.\n\nStructure provides: containment (prevents dissipation into scattered effort), consistency (creates accumulation of effects over time), integrity (holds the whole together coherently), and intentionality (distinguishes real work from random activity).\n\nDevelop Structure through: establishing daily non-negotiable practice time, creating a dedicated physical space for your work, organizing your practice into clear stages and progressions, maintaining written records of your practice, building rituals that anchor your intention. The masters emphasize: consistency beats intensity. Five minutes daily is infinitely more powerful than occasional marathon sessions. With proper structure, even modest daily effort accumulates into genuine transformation.'
          },
          {
            name: 'Retention',
            emoji: '💎',
            description: 'Preserves what is gained. The sealed vessel that prevents regression.',
            content: 'Retention is Salt\'s capacity to preserve and maintain—to keep what has been gained and prevent regression. Many practitioners fail not because they lack insight but because they fail to retain what they discover. A moment of genuine realization can evaporate by tomorrow if not reinforced, recorded, and repeatedly returned to.\n\nThe alchemical tradition represents Retention as the sealed vessel—what is gained must be sealed, protected, prevented from escaping. The Work is not a one-time experience but a process of accumulation through repeated reinforcement.\n\nSalt teaches a radical truth: transformation requires repetition. One meditation does not create transformation; thousands of meditations create change. One conscious choice does not change your nature; years of conscious choices rewire your being. Retention is the discipline of showing up consistently, even when results aren\'t immediately visible, trusting that each repetition adds weight and substance.\n\nThe Hermetic principle states: "What is not used is lost; what is used is strengthened." Your insights are like muscles—they atrophy without use, strengthen with consistent use.\n\nPractices for developing Retention: Keep detailed journals of insights and experiences (writing crystallizes understanding), revisit your notes regularly to reinforce learning, establish annual reviews of your progress to recognize accumulation, practice the same meditation daily until it becomes automatic, record the shifts you notice from your practice, share your learnings with trusted practitioners to solidify them through speech, teach what you\'ve learned to others (teaching is the deepest retention because you must embody what you teach). Each practice cements the previous one until transformation becomes stable, crystalline, permanent.'
          },
          {
            name: 'Boundary',
            emoji: '🛡️',
            description: 'Maintains coherence. The container that holds integrity against dissolving forces.',
            content: 'Boundary is Salt\'s protective function—the intelligent container that prevents dissolution. Without boundaries, you dissolve into others\' needs, your energy scatters into a thousand directions, your spiritual work evaporates into service to others\' agendas.\n\nBoundaries are not walls or selfishness; they are the vessel that holds coherence. Mercury wants to flow everywhere; Salt says: you may flow here, but not there. Boundaries ask: What am I protecting? What requires a clear limit? What is mine and not mine?\n\nIn alchemy, the boundary is the vessel wall—it must be strong enough to contain the transformative pressures within. Too weak and the Work escapes; too rigid and no transformation occurs. Balance is essential: permeable enough to allow growth but firm enough to maintain integrity.\n\nIn the qabalah, boundaries are represented by the Pillars—they hold structure while allowing flow within their bounds. In shamanic practice, boundaries are called "power lines"—invisible containers that protect your sovereignty.\n\nThe deep teaching is: "A boundary is a form of love." It says: "I value myself enough to protect my integrity, therefore I can show up genuinely for others rather than resentfully or depleted." Without boundaries, you cannot be truly present for anyone because you are fragmented and defending.\n\nDevelop Boundary work through: learning to say no without guilt or excessive explanation, noticing where you over-give and under-receive, identifying relationships where you lose yourself, recognizing that protecting yourself is not selfish but essential, creating physical spaces that are yours alone, establishing time non-negotiable for your practice, using protective visualization to reinforce energetic boundaries. The masters teach: strong boundaries are prerequisite to genuine spiritual work and genuine service.',
          },
          {
            name: 'Integration',
            emoji: '🔗',
            description: 'Final crystallization. Spirit embodied fully in matter and daily life.',
            content: 'Integration is Salt\'s final work—bringing all aspects into unified coherence, creating the Philosopher\'s Stone itself. Integration asks: Have you made your spiritual work part of your daily identity? Does your practice show in how you live, relate, and act in the world?\n\nIntegration means that spirit is not separate from matter but fully expressed through it. The goal is not transcendence away from body but full embodiment of spirit in body. You are not trying to become pure spirit but to become fully human—embodied, grounded, integrated consciousness expressing through form.\n\nIn alchemy, Integration is the final coagulation—when the Philosopher\'s Stone stabilizes and all work crystallizes into permanent transformation. In the qabalah, Integration is the descent of consciousness through all the spheres until it reaches Malkuth (the material world), where it becomes actual lived reality—not vision, but manifestation.\n\nThe supreme teaching: "What is not integrated into life is not real transformation." You can have profound meditation experiences, powerful visions, profound understanding, but if your daily behavior hasn\'t changed, the Work hasn\'t occurred. The test is not how much you know but how much you\'ve become what you know.\n\nTrue integration means: your relationships reflect your growth, your choices align with your values, your presence affects others, your body expresses your consciousness, your work in the world reflects your spiritual understanding. Those around you recognize the transformation—not from your words but from your presence.\n\nPractices for Integration: bring mindfulness into all daily activities, notice where your practice and your life diverge (this gap is where real work occurs), make conscious choices to align behavior with understanding, seek honest feedback about your actual impact on others, regularly examine whether your life reflects your teachings, commit to embodying your practice in practical ways. The proof is in the living: how you move through the world is the ultimate test.'
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Salt is the fixed alchemical principle—the anchor, the crystallization, the body. In the Great Work, Salt represents the Green Lion, the stabilizing earth principle that must be united with Sulfur and Mercury. Salt is not literal salt but the principle of grounding, preservation, crystallization, and matter itself. Salt is the container, the body, the material anchoring place where spirit manifests. Working with Salt means: grounding your spiritual work in physical reality, embodying your understanding in action, anchoring intention through matter, and caring for your body as sacred vessel. Salt work requires discipline, consistency, and acceptance that spirit must express through matter to have lasting effect. Without Salt, Sulfur\'s fire burns out and Mercury\'s vision remains fantasy. Salt makes the work real.',
          },
          {
            heading: 'Salt as Foundation & Crystallization',
            content: 'Salt crystallizes: it takes the formless and gives it structure, takes the liquid and gives it solidity. In your work, crystallization means taking spiritual insight and forming it into concrete practice, taking intention and manifesting it physically, taking understanding and embodying it as habit. Salt teaches that nothing meaningful manifests without time, repetition, and consistency. Spiritual experiences fade—practice makes them permanent. Spiritual insights vanish—regular work crystallizes them into stable understanding. Salt\'s seemingly boring work of daily practice is actually the most powerful magic because it creates permanent change. The goal of Salt work is creating new structures in your life, new habits that support your spiritual evolution, new physical reality that reflects your inner transformation.',
          },
          {
            heading: 'Grounding & Embodiment',
            content: 'Salt grounds: it connects spirit to body, vision to action, intention to reality. Grounding means: bringing spiritual concepts down into your physical life (how does this practice affect my daily choices?), connecting to your body (not ignoring it as impediment but honoring it as home), placing your feet on earth and feeling supported, recognizing that your body is not separate from spirit but its temple. Embodiment means living what you understand: if you understand love, do you treat others lovingly? If you understand transformation, are you actively transforming? If you understand unity, do you act from unity consciousness? Salt asks: what does your practice look like in real life? Not in meditation or ritual, but in how you live daily? Salt practitioners are grounded, present, and practical. They don\'t just dream of transformation; they build it.',
          },
          {
            heading: 'The Three Principles in Balance',
            content: 'Sulfur, Mercury, and Salt must balance: Sulfur without Mercury and Salt becomes destructive fire; Mercury without Sulfur and Salt becomes disconnected fantasy; Salt without Sulfur and Mercury becomes dead routine. In you: Sulfur provides drive and passion, Mercury provides clarity and consciousness, Salt provides grounding and manifestation. Imbalance is common: some people are all Sulfur (driven but unfocused), all Mercury (intuitive but ineffective), or all Salt (practical but uninspired). The Great Work is developing all three in balance. Notice your imbalance: Do you burn out (excess Sulfur, insufficient Salt/Mercury)? Do you dream without acting (excess Mercury, insufficient Salt/Sulfur)? Do you go through motions without purpose (excess Salt, insufficient Sulfur/Mercury)? Real transformation requires balance.',
          },
          {
            heading: 'The Green Lion & Earth Power',
            content: 'Salt is symbolized as the Green Lion, the lion of the earth, representing the power of grounded presence. While the Red King (Sulfur) burns with passion and the White Queen (Mercury) shines with consciousness, the Green Lion stands rooted, steady, dignified. The Green Lion represents: the power of presence, the strength of consistency, the dignity of incarnation, the noble power of earth itself. Working with Green Lion energy means: standing firm in your truth, maintaining consistency even when it\'s boring, honoring your physical existence, recognizing that incarnation is not punishment but privilege. The Green Lion is sometimes overlooked—less flashy than Red King, less mysterious than White Queen—but without the Green Lion, the Stone cannot be created.',
          },
          {
            heading: 'Creating Structures & Sacred Space',
            content: 'Salt creates structures: crystalline patterns, boundaries, sacred space that separates the profane from the sacred. Working with Salt means: creating physical structures that support your practice (altar, meditation space, sacred area), establishing rituals and routines that anchor your intention, drawing boundaries that protect your energy, creating containers that hold meaning. Sacred space is not merely symbolic; when you consecrate a space, you\'re actually changing it energetically through repeated intention and use. Building altar, creating regular practice space, establishing daily rituals—this is Salt work. These physical structures become increasingly powerful through consistent use. The space itself becomes charged and will support your work even without conscious effort once it\'s sufficiently established.',
          },
          {
            heading: 'Preservation & Continuation',
            content: 'Salt preserves: it protects meat from decay, preserves food through time, maintains integrity and prevents dissolution. Spiritually, preservation means maintaining what you\'ve gained—spiritual insights fade if not practiced, transformations regress if not continually renewed, understanding dissolves if not regularly embodied. Continuation means showing up consistently even when not inspired, maintaining practice even when results aren\'t visible, honoring commitment even when enthusiasm wanes. Salt teaches that consistency beats intensity—daily small practice is far more powerful than occasional grand rituals. Preservation also means protecting yourself: creating boundaries, protecting your energy, maintaining your integrity even when pressured to compromise.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Ground yourself physically: barefoot on earth, feeling connection, for 5 minutes',
          'Identify your most important spiritual practice and commit to daily consistency',
          'Create a dedicated altar or practice space in your home, even if small',
          'Establish a daily grounding ritual: tea, meditation, or simple acknowledgment of your body',
          'Identify one area of your life needing better structure or boundary',
          'Begin creating that structure: write it down, set a repeating reminder, tell someone for accountability',
          'Notice where you\'re imbalanced: Are you all fire? All dreams? All routine? Name it.',
          'Create a physical journal tracking your practice consistency—see the pattern crystallizing',
          'Cook or prepare a meal with intention, treating food preparation as sacred act',
          'Establish one weekly ritual: same time, same place, same practice—observe how power accumulates',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Consistency Over Intensity', text: 'Five minutes daily is far more powerful than occasional three-hour sessions. Build consistent habit. Consistency creates the crystalline structure where real change occurs.' },
          { title: 'Honor Your Body', text: 'Your body isn\'t an impediment to spirituality; it\'s spirituality\'s home. Eat well, sleep well, move regularly. Your body is your first sacred container.' },
          { title: 'Build Real Structures', text: 'Salt requires actual physical structures, not just intentions. Create an altar. Set up a meditation space. Establish routines. Make it real.' },
          { title: 'Protect Your Energy', text: 'Salt maintains boundaries. Learn to say no. Create physical boundaries. Establish energetic boundaries. Preservation includes protecting what\'s yours.' },
          { title: 'Boring Work Matters Most', text: 'Salt work is often unsexy: daily practice, regular grounding, consistent routine. But this boring work creates permanent transformation. Don\'t despise it.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Kybalion (Salt and Foundation)',
          'Books on establishing daily spiritual practice',
          'Guides to creating and consecrating sacred space',
          'Embodiment and somatic practice resources',
          'Plant spirit and earth-based spiritual work books',
        ],
      },
    },
  },
  {
    name: 'Process',
    isSpacer: true,
  },
  {
    name: 'Nigredo',
    emoji: '☠️',
    description: 'Dissolution - Dissolve illusions and embrace the darkness within',
    category: {
      level1: 'Stages',
      level2: 'Dissolution - Nigredo',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Disintegration',
            emoji: '💔',
            description: 'Collapse of structures. What seemed solid crumbles away.',
            content: 'Disintegration is alchemical necessity—the breaking apart of false identity built on illusion. Disintegration asks: What is crumbling in your life? What persona can no longer hold? This is not random destruction but the furnace that burns away what cannot survive truth. False identity, inherited beliefs, constructed certainties—all must disintegrate before authentic self can emerge.\n\nDisintegration feels terrifying because it feels like losing yourself, but you\'re actually losing what was never truly you. What remains after disintegration is more real than what was lost.\n\nIn alchemical texts, Disintegration is putrefactio—the rotting, the breaking apart of structure into component elements. This rotting is not failure but essential preparation. In nature, decomposition returns nutrients to soil and enables new growth. In your psyche, disintegration of false structures returns energy to your authentic self.\n\nThe Jungian teaching describes this as encountering the shadow—what you\'ve built identity around crumbles when the shadow emerges. The initiatory tradition teaches that every genuine initiation involves symbolic death—disintegration of the old identity is the price of admission to higher consciousness.\n\nPractices during disintegration: don\'t resist the breakdown, record what\'s crumbling, notice what remains unchanged, observe what you defend most fiercely (often what needs to go most), seek support from those who understand initiation, document your process, discover what core values persist. The teaching is: "What truly matters persists through all disintegrations. What disappears was never essential." This is how you discover your authentic identity.'
          },
          {
            name: 'Opacity',
            emoji: '🌑',
            description: 'Loss of clarity. The darkness where vision becomes murky.',
            content: 'Opacity is the loss of clear meaning. What once was obvious becomes confusing; certainty dissolves into doubt. Opacity asks: What no longer makes sense? Where has clarity disappeared? In Nigredo, the usual maps stop working—rational understanding fails, spiritual practice feels empty, nothing guides you anymore.\n\nThis darkness is not punishment but initiation. Only by losing the false light of ego can true light be perceived. Opacity creates the void where new vision can form. Resist the urge to force meaning too quickly; let the opacity teach through its mystery.\n\nIn mystical traditions, this is called the "cloud of unknowing"—the necessary darkness that must be traversed. The medieval text teaches that beyond all concepts, words, and visions lies pure consciousness—but to reach it you must pass through absolute darkness where nothing you thought you knew applies.\n\nIn Kabbalah, Opacity corresponds to the Abyss—the chasm between the supernal triad and the rest of consciousness. Crossing the Abyss requires surrendering all known reference points. The teaching emphasizes: "The darkness is not enemy but gateway. The void is not emptiness but pregnant potential."\n\nPractices in Opacity: stop trying to force clarity, journal the confusion without trying to resolve it, sit in meditation with unknowing, study how mystics describe the dark night, recognize patterns of meaning-making that are ready to release, trust that new vision will emerge without forcing it. The paradox is: the moment you stop fighting the darkness, it begins transforming into light.'
          },
          {
            name: 'Shadow',
            emoji: '👁️',
            description: 'Emergence of the denied self. What you\'ve refused to see rises into consciousness.',
            content: 'Shadow is the emergence of repressed content—the parts of yourself you\'ve denied, rejected, or hidden. Shadow asks: What are you refusing to see? What qualities do you despise in others that actually exist within you? In Nigredo, your shadow confronts you directly—your rage, greed, cruelty, shame—all the human aspects you\'ve tried to transcend.\n\nThis is essential work. What you deny controls you; what you acknowledge, you can integrate. The shadow is not evil but disowned energy. Integration of shadow is not becoming destructive but becoming whole. Jung taught that the shadow contains not only negative qualities but positive power that was rejected because it threatened your self-image. The rejected artist, the silenced rebel, the denied sexuality—all these live in shadow and must be reclaimed.\n\nIn the alchemical tradition, the nigredo descent specifically involves confronting the shadow. Medieval alchemists described this as encountering the Dragon or the Devouring Serpent—the raw, destructive, uncontrolled aspect of your own nature.\n\nPractices for shadow work: notice what triggers you most intensely in others (often shadow projection), notice what qualities you judge most harshly (often disowned parts), deliberately spend time with those opposite to you (they mirror your shadow), examine your dreams for shadow figures, work with a skilled therapist on deep shadow material, engage in active imagination dialogues with shadow aspects, recognize and reclaim the power in your shadow. The teaching is: "The shadow is not your enemy but your lost power asking to be recognized." Shadow integration transforms self-destructive rage into protective power, transforms repressed sexuality into creative fire, transforms denied greed into healthy self-care.'
          },
          {
            name: 'Chaos',
            emoji: '⚡',
            description: 'Necessary disorder. The breakdown of all structure and form.',
            content: 'Chaos is necessary disorder—the breakdown of all organizing principles until nothing holds predictable form. Chaos asks: Can you survive without structure? Can you exist in pure potential? Chaos is not failure but prima materia—the raw unformed substance from which new creation emerges.\n\nIn chaos, old categories collapse: good/evil blur, certainties become relative, identity becomes fluid. This disorder is terrifying but necessary. You cannot rebuild on the old foundation; chaos clears the ground entirely. Chaos is the gestation period where new forms slowly organize from formlessness.\n\nIn creation mythologies worldwide, chaos precedes creation. The Egyptian Nun, the Greek Chaos, the Norse Ginnungagap—all describe the formless potential from which order emerges. In alchemy, the prima materia is described as chaotic, undifferentiated, resistant to classification—exactly because from it all forms emerge. The Taoist teaching describes returning to chaos as the way to genuine creativity.\n\nOnce you\'ve experienced complete dissolution of all structure, you discover your true nature beneath all structures.\n\nPractices in Chaos: allow routines to break down without immediately rebuilding, practice tolerance for ambiguity, engage in free-form creative activities without trying to structure them, study chaos theory and fractals, meditate on formlessness, notice how nature creates order from chaos (weather patterns, ecosystems), recognize that you\'ve survived chaos before even if you\'ve forgotten. The teaching is: "Chaos is not the opposite of order—it\'s order at a level of complexity too great to perceive. In chaos, infinite possibilities exist. From these possibilities, new order will crystallize."'
          },
          {
            name: 'Resistance',
            emoji: '🚫',
            description: 'Instinct to escape. The powerful urge to abort the dissolution.',
            content: 'Resistance is the powerful impulse to escape the dissolution, to rebuild too quickly, to numb the pain, to deny what\'s happening. Resistance asks: What am I trying to fix rather than allow? Where am I fighting transformation?\n\nThe instinct to resist is natural—it\'s survival instinct protecting the old self. But survival of the false self requires death of authentic self. Resistance must be felt, acknowledged, and consciously released. The greatest spiritual practice in Nigredo is not forcing change but allowing it while staying present to the terror and pain.\n\nResistance manifests as: refusing to acknowledge the breakdown, trying to restore order prematurely, numbing with addictions or distractions, rationalizing away what\'s happening, seeking false solutions, blaming others instead of acknowledging your role.\n\nIn esoteric traditions, Resistance is understood as the ego\'s last stand—its final defense against annihilation. The ego senses that genuine transformation means its death (which is true—the false self must die). The teaching is: "Resistance is not failure—it\'s proof that genuine transformation is occurring. If nothing resists, nothing real is changing."\n\nPractices with Resistance: observe your resistance without judgment, notice the specific forms it takes for you, feel the fear beneath it without acting on it, name what you\'re afraid of losing, meditate on the paradox that growth requires death of the old form, connect with others also resisting their dissolution, remind yourself that previous challenges also felt permanent. The paradox is: acceptance of Resistance is how you move through it. Fighting it only strengthens it.'
          },
          {
            name: 'Threshold',
            emoji: '🌅',
            description: 'Point of no return. The moment when going back becomes impossible.',
            content: 'Threshold is the moment when the dissolution has gone so far that rebuilding on the old foundation becomes impossible. Threshold asks: Have you reached the point of genuine transformation? Threshold is recognizable—there\'s a quality of finality, a knowledge that the old way cannot continue. This is both terrifying and liberating. You cannot go back; only forward exists.\n\nThreshold is where panic often peaks because you realize there\'s no escape. Yet threshold is also where surrender becomes possible—where fighting stops and real transformation begins.\n\nIn initiatory traditions, the Threshold is the sacred boundary between the old life and the new. In ancient mystery schools, there were specific threshold moments—times when initiates could not step back. The Roman poet Virgil describes Aeneas at the river Styx: the Threshold where the old life ends and the underworld journey begins—there\'s no return.\n\nIn shamanic practice, the shamanic death often occurs at a specific moment of threshold—the moment you completely surrender and die into a new reality. The teaching emphasizes: "The Threshold is not as frightening when you stop fighting it. The moment of surrender is the moment of grace. At the Threshold, you discover your capacity for trust."\n\nPractices approaching Threshold: notice when old defenses are completely exhausted, recognize when going back has become impossible, stop expecting rescue or return to the old way, consciously choose surrender rather than remaining in liminal terror, document the moment you cross the Threshold so you can recognize it as transformation point later, prepare yourself mentally to live in a new way. The paradox is: the Threshold you fear most becomes the liberation you sought.',
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Nigredo is the blackening, the first stage of the Great Work, the necessary death before rebirth. In Nigredo, all structures dissolve—your certainties crumble, your identity breaks down, your carefully constructed world fragments. This is not failure; it is the alchemical prerequisite. Nothing can be transmuted until it is completely dissolved. Nigredo is the dark night of the soul, the crucifixion, the journey into the underworld. It feels like death because it IS a kind of death—the death of the false self, the ego structures, the illusions that seemed solid. Yet within this darkness lies hidden gold: beneath the illusions lies truth, beneath the fragments lies wholeness, beneath death lies rebirth. Nigredo work requires courage to face the abyss, faith that dissolution is not destruction, and understanding that you must descend into darkness to ultimately ascend to light.',
          },
          {
            heading: 'The Necessary Breakdown',
            content: 'Life circumstances often force Nigredo: loss, trauma, failure, betrayal, illness, or simply the collapse of what you built. Don\'t resist these breakdowns as mistakes—they are the alchemical furnace. In Nigredo, the heat of life\'s difficulties burns away false identity. What cannot survive is not worth keeping. The breakdown reveals what\'s authentic beneath the persona. Often this is terrifying: what am I without my career, my relationship, my status, my beliefs? Yet beneath every persona lies your essential self, unshakable and true. Nigredo work means: welcoming breakdowns as invitations to go deeper, facing what surfaces when structures dissolve, discovering the truth beneath illusions, allowing the old to completely decompose before rebuilding.',
          },
          {
            heading: 'Putrefaction & Fermentation',
            content: 'In literal alchemy, putrefaction is matter decomposing into its constituent parts. Spiritually, putrefaction is everything you\'ve built breaking down, your known reality becoming unrecognizable, meaning dissolving into chaos. This period feels like drowning in black mud. Yet fermentation—the process of decomposition—is how transformation happens. Food ferments in darkness, broken down into new forms more nourishing than the original. Your psyche also ferments in Nigredo\'s darkness. What felt meaningless is composting into new meaning. What felt solid is rotting into gold. This process cannot be rushed. Fermentation requires darkness and time. Trying to force light before the work is complete creates infection instead of transformation. Trust the darkness. Trust the rotting. Trust that from this compost, new life grows.',
          },
          {
            heading: 'Facing Shadow & Darkness',
            content: 'Nigredo brings you face-to-face with shadow—the parts of yourself you\'ve denied, rejected, or refused to see. Your rage, your greed, your fear, your shame, your cruelty—all come to light in Nigredo. This is essential work. What you deny controls you. What you acknowledge, you can integrate. Facing shadow doesn\'t mean becoming your shadow; it means consciously acknowledging these energies as part of yourself, understanding them, and choosing how to express them. In Nigredo, you cannot hide from yourself. The darkness is you confronting you. This self-confrontation is the furnace that burns away illusion. You emerge knowing yourself truly: not the idealized self you present to the world, but the real, complicated, contradictory human being you actually are.',
          },
          {
            heading: 'The Dark Womb & Incubation',
            content: 'Nigredo is the return to the womb, the void, the prima materia—the raw, undifferentiated substance from which new creation emerges. In this darkness, nothing is formed yet. You exist in pure potential. This uncertainty is frightening—there\'s no structure to cling to, no identity to hide behind, no future you can see. Yet this undifferentiated state is the necessary foundation. Everything must return to the void before transformation can occur. The dark womb is not punishment; it is incubation. Just as an embryo develops in darkness before emerging into light, your transformed self develops in Nigredo\'s darkness. Don\'t fight the formlessness. Rest in it. Trust it. Allow yourself to be unmade completely so you can be remade truthfully.',
          },
          {
            heading: 'Ego Death & The Katabasis',
            content: 'Ego death—the dissolution of the separate self—is Nigredo\'s deepest work. The katabasis (descent) is the shamanic journey into the underworld, the psychological descent into the unconscious, the alchemical journey into blackness. Every mythology contains this descent: Persephone\'s abduction, Orpheus entering the underworld, Jesus descending into hell, Inanna\'s descent. These aren\'t metaphors—they describe the actual spiritual crisis that transforms. In your descent, you may experience: profound meaninglessness, loss of identity, dissolution of all certainty, existential terror, the void. These are not pathology; they are initiation. The shamans call the underworld the root of the world tree. To truly live, you must journey to the roots. The descent teaches that identity is not fixed but fluid, that the self is vastly larger than the ego, that you can survive ego death because your essence is deeper than ego.',
          },
          {
            heading: 'Bearing Witness & Holding Space',
            content: 'Nigredo is loneliest when faced alone. While the journey is ultimately solitary, having witnesses—those who trust the process, who won\'t try to rescue you from the darkness, who trust that you\'ll emerge—sustains you. This might be a therapist, a spiritual teacher, a trusted friend, or a group who\'s also traveling this path. Witnesses don\'t fix your situation; they hold space for your transformation. They reflect back that you are not your breakdown, that dissolution is temporary, that this darkness has purpose. As you develop, you become witness for others in their Nigredo. You\'ve been to the underworld and returned—this gives you authority and compassion to stand with others descending. Witnessing is sacred work. It says: your suffering has meaning; your dissolution has purpose; you will emerge transformed.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Journal about any life breakdown you\'ve experienced: what dissolved? What remained?',
          'Acknowledge one illusion you\'ve held about yourself and consciously release it',
          'Spend time in actual darkness: turn off lights, sit in night, feel the dark without fear',
          'Research underworld journeys in mythology: read about shamanic descent, Inanna, Orpheus',
          'Identify one shadow aspect you\'ve been denying and write honestly about it',
          'Create a ritual acknowledging what\'s currently dissolving in your life',
          'Spend time with earth: press your hands into soil, lie on ground, feel the dark fertile soil',
          'Journal: What would remain if everything external was stripped away?',
          'Fast or simplify for a period: reduce external input to focus on inner emptiness',
          'Sit with the void: meditate on emptiness, not-knowing, the absence of meaning for 10 minutes',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Nigredo is Temporary', text: 'The blackening feels permanent but isn\'t. This stage will pass. Dissolution always leads to Albedo. Remember: this darkness has an end.' },
          { title: 'Don\'t Force Meaning Yet', text: 'Resist the urge to create new meaning or rebuild structure immediately. Let the void remain void until it\'s ready to transform. Premature meaning-making prevents real transformation.' },
          { title: 'Seek Support', text: 'Don\'t travel this alone if possible. Find witnesses, therapists, teachers, friends who understand that dissolution is necessary. Professional mental health support is valid. Nigredo is not failure; it\'s initiation.' },
          { title: 'Trust the Process', text: 'Everything dissolving is not wrong—it\'s necessary. What cannot survive doesn\'t deserve keeping. What emerges afterward is truer. Trust that transformation requires this death.' },
          { title: 'Physical Grounding Matters', text: 'While experiencing inner dissolution, ground yourself physically: eat well, sleep regularly, move your body, spend time on earth. Your body is your anchor in the void.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Dark Night of the Soul by St. John of the Cross',
          'Descent mythology: Inanna, Orpheus, Persephone, Jesus',
          'Books on shamanic underworld journeys',
          'Psychology of Jung: shadow work and the descent',
          'Spiritual crisis support and grounding practices',
        ],
      },
    },
  },
  {
    name: 'Albedo',
    emoji: '💎',
    description: 'Purification - Purify intention and bring clarity to manifestation',
    category: {
      level1: 'Stages',
      level2: 'Purification - Albedo',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Clarification',
            emoji: '👁️',
            description: 'Restored perception. The return of clear vision after Nigredo\'s opacity.',
            content: 'After Nigredo\'s dissolution dissolves all false identity, Albedo brings the return of vision—but transformed. This is not the confused perception of Nigredo\'s darkness but the clear sight of illumination. Clarification asks: What can you now see that was invisible in darkness? What truth was hidden beneath illusions?\n\nClarification is not new knowledge but accurate perception. The veil lifts. You see what was always present but obscured. In the Hermetic philosophy, this corresponds to the removal of veils between consciousness and reality—you perceive directly rather than through the distorting filters of ego, fear, and conditioning.\n\nIn Kabbalah, Clarification corresponds to the ascent from Hod (reason clouded by illusion) to Netzach (intuitive clarity) to Tiferet (clear self-knowing). The lightning flash of consciousness strikes downward through obscurity into clarity.\n\nIn Taoist alchemy, Clarification is the emergence from Darkness (Yin exhausted) into the return of Light (Yang beginning). The cave of meditation gives way to mountain vision—expansive sight from high place.\n\nPractically, Clarification means:\n- Seeing your patterns clearly: not in abstract but viscerally understanding how you sabotage yourself\n- Recognizing your true desires beneath social conditioning: what do you authentically want when no one is watching?\n- Understanding your authentic gifts and limitations: not inflated view but accurate assessment\n- Perceiving others clearly: seeing people as they are, not as your projections\n- Distinguishing between wisdom and delusion in your thoughts: which insights are true versus which are mental loops?\n\nClarification work includes:\n- Meditation on clear sight: sit with open eyes in good light, soften focus, allow vision to settle\n- Mirror work: look at your face and truly see who looks back—not judging but observing\n- Writing your observations without interpretation: what do you see when you strip away narrative?\n- Seeking feedback from trusted others: their reflection helps clarify your blind spots\n- Studying your own patterns: journaling, reviewing your life story, understanding the threads\n\nThe paradox of Clarification is that the more honestly you see your delusions, the clearer your true perception becomes. Clarity is not cheerful but liberating—you trade comfortable illusion for uncomfortable truth, and find that truth is lighter, freer, more real than any fantasy.',
          },
          {
            name: 'Purification',
            emoji: '✨',
            description: 'Removal of distortion. The washing away of the ash covering what remains after dissolution.',
            content: 'Purification is the great cleansing that follows Nigredo\'s dissolution. You have been broken down to ash; now you are washed clean. Purification asks: What needs to be cleansed? What layers of false identity, trauma, and distortion cloud your authentic nature?\n\nPurification is not about becoming spotless or perfect. It is about removing the distorting agents that prevent accurate self-perception: self-judgments, internalized criticism, false beliefs, adopted wounds, inherited shame, projected darkness from others.\n\nIn Hermetic philosophy, Purification corresponds to the washing that prepares the stone—removing all dross so that only pure essence remains. The prima materia must be purified before transmutation can occur. You cannot make gold from ore mixed with impurities; you must remove what does not belong.\n\nIn Kabbalistic work, Purification is the work of Hod (discernment and analysis) applied to the psyche—you examine every belief, every pattern, every identity claim and ask: Is this true or false? Is this mine or inherited? This removes the corruption of unexamined assumptions.\n\nIn Taoist alchemy, Purification is the washing of the organs of the microcosm—cleansing the energy channels so that qi flows freely without obstruction. Trapped trauma, unprocessed emotion, and frozen pattern create stagnation; purification clears these.\n\nPractically, Purification means:\n- Rigorous honesty with yourself: acknowledging your complicity, your role in creating your suffering, where you have been fooled\n- Releasing blame of others while also releasing excessive self-blame: seeing clearly where responsibility actually lies\n- Identifying false identities and consciously releasing them: the identity society gave you, the identity trauma created, the identity you constructed defensively\n- Processing trapped emotion: grief, rage, fear, shame that never found expression\n- Examining your beliefs: which are true? Which are conditioning? Which serve you? Which limit you?\n\nPurification work includes:\n- Ritual bathing or water work with intention to cleanse\n- Emotional release through crying, sound, movement (safely expressing what was frozen)\n- Systematic belief examination: write your core beliefs and question each one\n- Forgiveness work: releasing judgment of self and others\n- Energy clearing: removing cords, attachments, and influences that aren\'t yours\n- Confession or witness: speaking your truth aloud to be heard and acknowledged\n\nThe deepest Purification is accepting what happened while releasing the distortion created around it. You stop carrying the shame of events not your fault. You stop protecting the identity that trauma created. You become increasingly yourself—simpler, clearer, less defended.\n\nPurification is fundamentally an act of love—loving yourself enough to be honest, to feel what needs feeling, to release what no longer serves. The water of purification is both gentle and powerful, washing away the ash without destroying the essence beneath.',
          },
          {
            name: 'Ordering',
            emoji: '📐',
            description: 'Restructuring psyche. The reorganization of your inner world along lines of truth rather than conditioning.',
            content: 'After Nigredo\'s chaos and Clarification\'s vision, Ordering is the restructuring—the reorganization of your inner world along lines of truth. Ordering asks: What new structure serves your authentic nature? What hierarchy of values actually matters? How do you build a life aligned with truth?\n\nOrdering is not imposed from outside but discovered from within. You do not impose order arbitrarily but uncover the natural order that has always been there beneath conditioning. A musician discovers the music inherent in the instrument; a sculptor discovers the form within the stone. So you discover the natural order within your authentic nature.\n\nIn Hermetic philosophy, Ordering corresponds to the principle of Correspondence—as above, so below. The ordered cosmos reflects the ordered psyche; disorder within reflects disorder without. Creating inner order creates outer order naturally.\n\nIn Kabbalah, Ordering is the work of imposing the Tree of Life pattern onto the psyche—understanding how your consciousness naturally organizes when not distorted. You map your inner landscape according to sacred geometry: what is root? What is trunk? What are branches? What is crown?\n\nIn Taoist alchemy, Ordering is restoring the natural flow of the Five Elements and Five Organs—each in proper relationship with the others. Health is natural ordering; disease is disorder. You restore harmonic relationship through aligned practice.\n\nPractically, Ordering means:\n- Reorganizing your priorities around your authentic values (not inherited values)\n- Restructuring your daily life to support what matters most\n- Realigning your relationships to truth (releasing connections built on false identity)\n- Creating new rituals and routines that reflect your genuine nature\n- Rebuilding your worldview according to what you\'ve learned about reality\n- Establishing boundaries that protect what\'s essential\n- Creating new meaning and narrative based on clarity instead of delusion\n\nOrdering work includes:\n- Creating a personal mandala or map of your inner world\n- Reorganizing your physical space to reflect your values\n- Restructuring your schedule to prioritize what\'s authentic\n- Writing a new personal narrative aligned with clarity\n- Creating a values hierarchy: what matters most to least?\n- Performing rituals of intention to anchor new order\n- Building habits and practices that reinforce alignment\n\nOrdering is not perfectionism—you don\'t need perfect order. You need functional order: priorities clear enough to guide action, structure stable enough to support growth, hierarchy aligned enough to feel right. You build a life that reflects your truth.\n\nThe deepest Ordering is understanding that true order is not rigid but fluid—it\'s the order of a river flowing around rocks, not the order of a prison. Your reorganized life should feel more natural and free, not more constrained. When true order is established, you function effortlessly according to your nature.',
          },
          {
            name: 'Lightness',
            emoji: '☁️',
            description: 'Reduced friction. The experience of moving through life with less effort after purification.',
            content: 'After purification and ordering, Lightness emerges. The world feels lighter. Your body feels lighter. Your spirit feels lighter. This is not euphoria or disconnection but the specific relief that comes from releasing burden.\n\nLightness asks: What weight have you been carrying that you can finally set down? The weight of false identity. The weight of defending illusions. The weight of maintaining contradictions. The weight of unexpressed emotion. The weight of others\' expectations lived as your own.\n\nWhen you release these, you become lighter. This is not external change—the world is still difficult, other people still have expectations, life still has challenges. What has changed is internal friction. You are no longer fighting yourself. You are no longer contradicting yourself. You are no longer exhausted by maintaining illusions.\n\nIn Hermetic philosophy, Lightness is the elevation of gross to subtle, material to spiritual. What was heavy becomes light. What was dense becomes ethereal. The philosopher\'s stone itself is described as light despite being formed from heavy matter—it has been so refined that it floats rather than sinks.\n\nIn Kabbalah, Lightness corresponds to the ascent from material Malkuth through the purified spheres to the lightness of spiritual realms. As you ascend the Tree, you leave behind density and heaviness and experience increasing subtlety and light.\n\nIn Taoist alchemy, Lightness is the result of qi flowing freely without blockage—your energy becomes lighter, more mobile, less burdened. Internal friction dissolves; movement becomes effortless as the internal channels clear.\n\nPractically, Lightness means:\n- Moving through decisions with ease rather than second-guessing\n- Speaking your truth without exhausting explanation\n- Taking action aligned with your values without doubt\n- Feeling at home in your body rather than at war with it\n- Experiencing joy not as guilty indulgence but as natural state\n- Moving through relationships without defensive armor\n- Feeling genuinely capable rather than perpetually doubtful\n\nLightness work includes:\n- Practices that elevate energy: dance, song, breath work\n- Movement that feels natural rather than forced\n- Releasing what you\'ve been holding: old resentments, old stories, old protective patterns\n- Allowing joy without feeling it must be earned\n- Grieving what must be released to become lighter\n- Trusting your body\'s natural wisdom about what is light and what is heavy\n- Noticing what makes you feel heavier and consciously avoiding those patterns\n\nThe paradox of Lightness is that you become heavier first—in Nigredo, you feel the full weight of reality. Only after acknowledging that weight can you release it and discover what remains is lighter than you could have imagined.\n\nLightness is not frivolity or escape. It is not pretending difficulties don\'t exist. It is the specific freedom that comes when you stop struggling against your own nature. You move with grace rather than against resistance. You become increasingly yourself, and this is always lighter than being anyone else.',
          },
          {
            name: 'Coherence',
            emoji: '🔗',
            description: 'Emerging stability. The reorganization settling into sustainable pattern.',
            content: 'As Purification, Ordering, and Lightness settle into their work, Coherence emerges. This is the integration of Albedo—the point where scattered pieces finally fit together into coherent whole. Coherence asks: Does your inner world hold together? Are you internally consistent? Do your values align with your actions? Can you trust yourself?\n\nCoherence is not rigidity. It is not the false coherence of inflexible identity or dogmatic certainty. It is the flexible stability of authentic integration—like a healthy body that maintains coherence while moving fluidly, or a healthy mind that holds clear values while adapting to circumstances.\n\nAfter Nigredo\'s fragmentation, you have been holding pieces together through sheer effort. Albedo\'s coherence means the pieces naturally fit. You no longer need to suppress contradictions or hold conflicting truths in impossible tension. Your authentic nature is not contradictory—seeming contradictions resolve when you see from the perspective of truth.\n\nIn Hermetic philosophy, Coherence is the return of harmony after discord. The Hermetic principle of Vibration teaches that everything vibrates at its own frequency; coherence is when all your frequencies harmonize rather than interfere with each other.\n\nIn Kabbalah, Coherence corresponds to Tiferet (the Heart, center of integration). When all parts of the psyche are balanced and aligned, Tiferet is coherent and radiant. This is not higher than other spheres but central—the organizing principle that makes the whole system functional.\n\nIn Taoist alchemy, Coherence is the return to wholeness—the integration of yin and yang, the five elements in harmony, the flow of qi without blockage or leakage. Health is coherence; disease is incoherence.\n\nPractically, Coherence means:\n- Your words align with your actions\n- Your stated values guide your actual choices\n- Your inner world reflects your outer expression\n- You trust your own perceptions and decision-making\n- You move without constant second-guessing\n- Your relationships are authentic rather than performative\n- You experience yourself as unified rather than fragmented\n\nCoherence work includes:\n- Examining areas of dissonance: where do you say one thing and do another?\n- Aligning your life with your values: making the changes needed for coherence\n- Releasing performative identities: stop playing roles that don\'t fit your truth\n- Building trust in yourself: keeping promises to yourself, following your values consistently\n- Noticing the peace that comes from integration\n- Creating practices that support coherence: meditation, journaling, truth-telling\n- Choosing integrity even when difficult\n\nCoherence is recognizable by a quality of rightness. You know when you\'ve found it—there\'s a click of pieces fitting together, a sigh of relief, a sense of coming home to yourself. This coherence is the culmination of Albedo and the preparation for Rubedo.\n\nThe deepest Coherence is knowing yourself truly and living that truth consistently. You become trustworthy—to others and to yourself. This coherence is not achieved by force but discovered through honest self-inquiry and alignment. You don\'t create coherence; you reveal it by removing the obstacles that obscure it.',
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Albedo is the whitening, the second stage of the Great Work that follows Nigredo\'s darkness. In Albedo, you emerge from the void washed clean, illuminated, and purified. Albedo is not the final transformation—that comes in Rubedo—but the essential cleansing that makes transformation possible. In Albedo, you see clearly what remained after the darkness burned away your illusions. Albedo is washing, purification, separation of the pure from the impure, the enlightenment that follows despair. It\'s not the brightness of success but the clarity of truth. You see yourself without illusion, your path without delusion, your purpose without pretense. Albedo work means: washing away false identity, clarifying true intention, separating what\'s essential from what\'s excess, seeing yourself and life with ruthless clarity. This clarity is both beautiful and sometimes heartbreaking—you see the beauty in what remains and the loss of what doesn\'t.',
          },
          {
            heading: 'Washing & Cleansing',
            content: 'Albedo is literally and spiritually washing. After Nigredo\'s darkness, you are covered in the ash of dissolution—old beliefs, old identities, old understanding. Albedo washes these away. This is why water imagery dominates Albedo—water cleanses, reveals clarity beneath dirt, washes away excess. Washing is both physical and spiritual: ritual bathing to cleanse energy, meditation to clarify mind, journaling to process emotion, ritual to acknowledge release. The washing is thorough—nothing half-measures. You wash until the water runs clear. Physically, this might mean sacred bathing. Spiritually, it means repeatedly returning to clarity until illusion no longer clouds your vision. Albedo teaches that cleansing is not punishment but gift—you emerge lighter, freer, clearer after washing away what no longer serves.',
          },
          {
            heading: 'Separation & Discernment',
            content: 'Albedo is the stage of separation (known as solving in alchemy): dividing gross from subtle, essential from excess, true from false, sacred from mundane. After the dissolution of Nigredo, everything is mixed together—you don\'t yet know what to keep. Albedo\'s work is discernment: What is truly you versus what was conditioning? What matters versus what was distraction? What\'s worth keeping versus what\'s excess baggage? This requires ruthless honesty and clarity. You look at every belief, every relationship, every commitment and ask: is this mine or did I inherit it? Does this serve my truth or does it limit me? This separation is sometimes painful—you release relationships, beliefs, identities that don\'t align with your clarity. But what remains is purified, intentional, truly yours.',
          },
          {
            heading: 'Illumination & Clear Seeing',
            content: 'Albedo brings illumination—you see yourself and reality without illusion\'s filter. This seeing is sometimes disturbing: you notice flaws you couldn\'t before, see limitations you denied, recognize patterns you couldn\'t perceive. Yet this clarity is gift. You cannot change what you refuse to see. Illumination means: seeing your shadow clearly, understanding your patterns honestly, recognizing your complicity in your suffering, acknowledging your responsibility in your life. This isn\'t blame—it\'s power. When you acknowledge your role, you can change it. Albedo practitioners see clearly and therefore act wisely. They don\'t live in fantasy or denial. They live in truth, and from truth, authentic change emerges.',
          },
          {
            heading: 'The White Queen\'s Clarity',
            content: 'Albedo is associated with the White Queen in her clarity and refined consciousness. After Nigredo\'s descent and decomposition, the White Queen emerges washed clean and luminous. She represents: clarity of consciousness, the ability to perceive truth, refined wisdom, the capacity to see beneath surfaces. The White Queen is not naive innocence but innocence earned—she has seen the darkness and chosen light anyway. She is wise precisely because she\'s not ignorant of shadow. The White Queen seeks the Red King (Sulfur) for sacred marriage not from desperation but from clarity: she knows exactly what she wants and why. Working with White Queen energy means: developing refined consciousness, choosing clarity deliberately, seeking truth consistently, maintaining wisdom gained through difficulty.',
          },
          {
            heading: 'Sublimation to Higher Purpose',
            content: 'Albedo is the stage of sublimation—elevation from gross to subtle. What was heavy becomes light. What was obsessive becomes purposeful. What was reactive becomes intentional. Sublimation means taking your experience—especially difficult experience—and elevating it into wisdom you can share. Your pain becomes compassion. Your failure becomes teaching. Your confusion becomes understanding. This is not suppression; it is transformation. You don\'t deny the pain but refine it into something precious. Albedo work means asking: How can I sublimate this into higher purpose? How can my suffering serve others? What wisdom was purchased by my difficulty? From clarity comes capacity to serve.',
          },
          {
            heading: 'Readiness for Union',
            content: 'Albedo prepares you for Rubedo\'s sacred marriage. You cannot unite with the Red King (Sulfur) while covered in Nigredo\'s ash. The White Queen must be washed clean and ready. This washing and clarification takes time—you cannot rush it. Premature union produces corruption instead of the Stone. Albedo\'s work is rigorous self-examination and purification until you reach clarity. Then you are ready: ready to unite your will (Sulfur) with your wisdom (Mercury), ready to manifest in matter (Salt), ready to create the Stone. The readiness is recognizable—you know when you\'ve reached Albedo\'s clarity. There\'s a quality of peace, acceptance, and purpose that indicates you\'ve completed the washing.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Create a cleansing ritual: ritual bath with salt and intention, or shower with conscious awareness',
          'Journal: After Nigredo\'s darkness, what remains? What is essentially you? What was conditioning?',
          'Perform honest self-examination: identify beliefs that aren\'t yours, relationships that don\'t serve you',
          'Wash your hands consciously and repeatedly, visualizing washing away false identity',
          'Meditate on clarity: not understanding but the ability to see what\'s actually true',
          'Write down what you are now committing to keep versus releasing',
          'Spend time in natural light: sunlight, moonlight—invite illumination',
          'Practice discernment: with each choice, ask \'Is this mine or inherited? Does this serve truth?\'',
          'Create an altar representing clarity: white candles, clear quartz, flowing water',
          'Establish daily practice of clarity: 5 minutes sitting with the question \'What is true?\'',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Don\'t Rush Purification', text: 'Albedo cannot be forced. Trying to skip the washing produces false clarity. Trust the process of gradually becoming clearer until you know you\'ve reached true illumination.' },
          { title: 'Clarity Can be Painful', text: 'Clear seeing sometimes reveals uncomfortable truths. Sit with the discomfort rather than numbing it. This is how you truly learn.' },
          { title: 'Distinguish From Arrogance', text: 'Albedo clarity is humble—knowing that your perception is limited and that truth is vast. Certainty that you have absolute truth is usually not Albedo but ego. Stay humble.' },
          { title: 'Balance Clarity with Compassion', text: 'Seeing clearly doesn\'t mean judging harshly. The White Queen sees clearly but acts with grace. Use your clarity to serve, not to condemn.' },
          { title: 'Prepare for Union', text: 'As Albedo completes, you\'ll feel readiness for deeper union of your inner forces (Sulfur and Mercury). Don\'t rush this—let readiness emerge naturally.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The White Queen and Hermetic symbolism',
          'Books on alchemical purification and washing',
          'Discernment practices and spiritual clarity work',
          'Ritual bathing and cleansing ceremonies',
          'Philosophy of clear seeing and truth perception',
        ],
      },
    },
  },
  {
    name: 'Rubedo',
    emoji: '🧩',
    description: 'Collate - Collect all aspects and achieve harmonious wholeness',
    category: {
      level1: 'Stages',
      level2: 'Integration - Rubedo',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Unity',
            emoji: '💫',
            description: 'Recombined identity. The return to wholeness after dissolution and purification.',
            content: 'Unity is Rubedo\'s primary work: the return to wholeness after Nigredo\'s shattering and Albedo\'s washing. Unity asks: Who are you when all the separated parts are brought back together? What does wholeness feel like when it\'s authentic rather than defensive?\n\nUnity is not uniformity. It is not making all parts the same or dominant parts overwhelming others. Unity is harmony—all aspects of yourself recognized and valued, all polarities held in creative tension. Like an orchestra where every instrument has its voice but all play together in symphony.\n\nIn the Nigredo, you were fragmented: different identities for different contexts, conflicting desires pulling simultaneously, contradictory beliefs held in compartments. In Albedo, you clarified and ordered but may still have kept parts separate. In Rubedo, the real work is bringing the fragments back together—not into the old neurotic unity that would negate the Work, but into new wholeness that honors what was broken and what was learned.\n\nIn Hermetic philosophy, Unity corresponds to the return of the Monad (the One) expressing through the Many in harmony. The Stone is described as the return to original Unity through conscious integration. You are fragments of the One learning to recognize your fundamental wholeness.\n\nIn Kabbalah, Unity corresponds to Kether (the Crown) reflected through Tiferet (the Heart). In this integration, all opposites meet at the center: Chokmah and Binah (Will and Understanding), Geburah and Chesed (Force and Mercy), all finding balance in the integrated Heart.\n\nIn Taoist practice, Unity is the return to Wu Wei (actionless action)—when all aspects of yourself work together so seamlessly that effort disappears. The five elements function in harmony; yin and yang dance rather than fight.\n\nPractically, Unity means:\n- Your different contexts no longer require different identities: you are consistently yourself\n- Your seemingly contradictory desires resolve into higher purpose: you no longer fight yourself\n- Your conflicting beliefs integrate into nuanced wisdom: you hold paradox without needing resolution\n- Your body and spirit work together: not transcending the physical but fully inhabiting it\n- Your masculine and feminine energies dance together: neither dominant but both essential\n- Your personal will and higher purpose align: no longer experiencing conflict between them\n\nUnity work includes:\n- Meditation on integration: sit with the experience of all parts of yourself in harmony\n- Shadow integration: consciously embracing what you wanted to reject\n- Dialogue practice: having parts of yourself communicate and find common ground\n- Ritual of reconciliation: formally reuniting what was fragmented\n- Creating art that expresses your wholeness\n- Practices that unite seeming opposites: martial arts, partner dancing, sacred sexuality\n- Living from your center: making choices from integrated wholeness rather than fragmented reaction\n\nThe paradox of Unity is that you become more capable of differentiation, not less. When fragments are integrated, each can be clear and distinct without threatening the whole. The integrated self can be multiple while remaining One. This is mature consciousness: capable of holding complexity without fragmenting.',
          },
          {
            name: 'Embodiment',
            emoji: '🔥',
            description: 'Lived transformation. The expression of all your inner work in how you live day to day.',
            content: 'Embodiment is where the Work becomes real: not an internal process or philosophical understanding but lived reality visible in how you move through the world. Embodiment asks: Is your practice visible in your life? Do others recognize your work in how you move through the world? Are you the same person in private and public?\n\nEmbodiment is the ultimate test of the Great Work. Anyone can speak wisdom; anyone can have moments of clarity or integration. Embodied wisdom is different—it changes how you actually live. The embodied practitioner is recognizable: there is consistency, authenticity, presence. They are not performing spirituality; they are living it.\n\nEmbodiment means:\n- Your values visible in your choices: people see what matters to you by how you spend time, money, attention\n- Your growth evident in your presence: you carry yourself with dignity without arrogance\n- Your transformation affecting those around you: your peace supports others\' peace; your clarity invites others toward clarity\n- Your practice supporting your relationships: not isolating but connecting more authentically\n- Your spiritual work making you more human: more compassionate, more capable, more real\n\nIn Hermetic philosophy, Embodiment is the principle of Vibration made manifest: your inner frequency visibly affects your outer world. When you are integrated, others feel the coherence. When you are fractured, they sense the dissonance. There is no hiding embodiment.\n\nIn Kabbalah, Embodiment is the descent of Tiferet (the integrated heart) into Malkuth (manifestation). What is integrated internally must manifest externally or the Work is incomplete. Embodiment is the bridge between spiritual and material.\n\nIn Taoist practice, Embodiment is De (virtue)—not moral virtue but the natural expression of aligned being. De is recognizable not as trying to be good but as the inevitable radiation of inner wholeness.\n\nPractically, Embodiment means:\n- Speaking your truth consistently without performing righteousness\n- Taking ethical action without needing external validation\n- Serving others naturally from integrated wholeness rather than from guilt or obligation\n- Maintaining integrity under pressure (the real test)\n- Your sexual/creative energy expressed authentically (not repressed or excessive)\n- Your power expressed in service rather than domination\n- Your vulnerability genuine rather than performative\n\nEmbodiment work includes:\n- Embodied practices: dance, martial arts, breathwork—developing presence in the body\n- Living your values: make one choice today that expresses your authentic commitment\n- Receiving feedback: let others tell you what they see in your presence\n- Shadow embodiment: integrate not just the light but the dark too, honestly\n- Creating community: embodied practitioners find each other and support one another\'s manifestation\n- Regular audit: Am I living what I understand? Where is there gap between my knowledge and my life?\n\nThe paradox of Embodiment is that it requires both paradoxical authenticity: you must be genuinely yourself while also being responsible to others. You must live your truth while respecting others\' right to their own. You must express your power while not using it to dominate. This is the razor\'s edge of mature embodiment.\n\nEmbodiment is how you know the Work is real. When others feel your presence and find themselves becoming clearer, calmer, more whole—that is embodiment. When your life reflects your values without strain—that is embodiment. When you are the same person whether anyone is watching or not—that is embodiment.',
          },
          {
            name: 'Vitality',
            emoji: '⚡',
            description: 'Energized coherence. The aliveness that comes from integrated wholeness.',
            content: 'Vitality is the direct experience of wholeness as energy. After the Work of integration, there is not just psychological peace but actual energetic vitality—an aliveness that comes from integrated systems working in harmony. Vitality asks: Where does your energy come from? Are you drawing on willpower and discipline or on inherent life force?\n\nIn the earlier stages, you may have relied on discipline: forcing yourself to practice, maintaining intention through willpower, keeping yourself on track through effort. In Rubedo, discipline transforms into flow. You\'re not drawing on depleting willpower anymore; you\'re channeling the inherent energy of a system in harmony with itself.\n\nThis is a crucial shift: Integrated wholeness generates vitality naturally. You don\'t need to pump yourself up or force yourself forward. When all parts of you agree on direction, when your will and wisdom align, when your body and spirit work together, energy flows without depletion. This is sustainable aliveness—not manic intensity but genuine, ongoing fuel.\n\nIn Hermetic philosophy, Vitality corresponds to the principle of Polarity: when polarities balance and integrate, the creative force flows optimally. The Stone is described as intensely alive, capable of transmuting everything it touches. Your integrated self shares this aliveness.\n\nIn Kabbalah, Vitality corresponds to the flow of Shekhinah (the Divine Presence) through all the spheres. When the channels are clear and integration is achieved, Divine energy flows freely, and you experience yourself as a channel for life itself rather than a struggling individual.\n\nIn Taoist practice, Vitality is the free flow of Qi (life force) through the microcosmic orbit and macrocosmic circulation. When blockages clear and integration occurs, Qi flows powerfully and naturally. You become a vortex of energy rather than a static object.\n\nPractically, Vitality means:\n- You feel more energized after helping others rather than depleted\n- Your work feels like play rather than obligation\n- You wake with interest in the day rather than dread\n- Your creativity flows naturally rather than requiring forcing\n- Your body feels alive and responsive rather than heavy or tired\n- Your presence energizes others rather than draining them\n- You can sustain effort without burning out\n\nVitality work includes:\n- Practices that increase energy flow: qigong, pranayama, dynamic movement\n- Energy clearing: removing blockages, cords, and attachments\n- Nourishment practices: eating consciously, sleeping well, spending time in nature\n- Creative expression: allowing energy to move through art, music, dance\n- Generosity: genuine service depletes false generosity but energizes true service\n- Play and joy: these are not indulgences but essential fuel for sustainable vitality\n- Discernment: noticing what drains vitality and what increases it\n\nThe paradox of Vitality is that it increases through giving rather than hoarding. When you hold energy selfishly, it stagnates and drains. When you allow energy to flow through you toward others, it regenerates. The Stone\'s power increases through use, not through protection.\n\nVitality is contagious: others feel it in your presence, and it invites their own vitality to emerge. An integrated, vital person in a room shifts the energy—people naturally relax, breathe more deeply, feel more alive. This is not your responsibility; it is simply the inevitable radiation of integrated wholeness. Vitality indicates that integration is succeeding; if you are becoming increasingly alive, you are on the path of Rubedo.',
          },
          {
            name: 'Stability',
            emoji: '🏔️',
            description: 'Durable change. The permanence of transformation achieved through authentic integration.',
            content: 'Stability in Rubedo is the test of genuine transformation: Can the Work endure? Will you maintain integration under pressure? Or will you regress when challenges arise? Stability asks: Is this change durable or temporary? Have you truly transformed or have you merely had a profound experience?\n\nMost people experience moments of integration, clarity, or peak consciousness. The question that separates authentic Rubedo from passing experience is: Can you maintain this? The answer reveals the truth of your Work.\n\nIn Rubedo, Stability is not the rigid stability of fixed identity or dogmatic certainty. It is the stability of a dynamic system—like a gyroscope that maintains orientation while spinning, or a tree that bends in wind while remaining rooted. True stability is tested:\n- You remain integrated even under pressure\n- You maintain wholeness even when challenged\n- You continue the work even when external support disappears\n- Old patterns no longer pull at you with the old force\n- You no longer identify with the limitations you transcended\n- You trust your transformation to continue without constant vigilance\n\nIn Hermetic philosophy, Stability corresponds to the principle of Cause and Effect. Your transformation is not random or lucky but the inevitable result of consistent, authentic Work. The Stone is stable not because you protect it but because it has been truly created.\n\nIn Kabbalah, Stability corresponds to Malkhuth (the material world of manifestation). Integration that cannot manifest in durable material reality is incomplete. The proof is not internal experience but external reality.\n\nIn Taoist practice, Stability is the result of regular practice establishing new neural pathways and energy patterns. Years of work create genuine changes in the body, energy, and consciousness. These changes do not disappear when you stop practice; they become part of who you are.\n\nPractically, Stability means:\n- You return to old patterns less frequently and recover more quickly when you do\n- Your baseline (normal operating state) has shifted permanently upward\n- Your relationships are more stable because you are more stable\n- Your work is more effective because your presence is clearer\n- Your body knows the new way so deeply that the old way feels foreign\n- You maintain practice not from discipline but from knowing its necessity\n- Your values remain steady even when circumstances change\n\nStability work includes:\n- Consistent practice: integration maintained through regularity, not intensity\n- Testing: intentionally placing yourself in situations that previously destabilized you\n- Witnessing: noticing how far you have come; not taking stability for granted\n- Community: surrounding yourself with others who maintain similar work\n- Continued refinement: never assuming you have completed the Work\n- Shadow watching: remaining alert to ways old patterns might subtly return\n- Deepening: from maintenance into increasingly subtle integration\n\nThe paradox of Stability is that it requires constant readiness for change. The Stone does not rest; it continues transforming. Stability is not stasis but dynamic equilibrium—the ability to adapt to any circumstance while maintaining integrity.\n\nStability is recognizable: you know when you have achieved it. There is a quality of ease that was not present when integration was fresh. The Work no longer feels like work but like being. You can be tested and not break. You can face loss and not fragment. You can encounter failure and not lose faith. This stability is the fruit of genuine Rubedo.',
          },
          {
            name: 'Completion',
            emoji: '🌟',
            description: 'Cycle fulfillment. The accomplishment of the Great Work\'s primary goal—the creation of the Philosopher\'s Stone and your emergence as integrated whole.',
            content: 'Completion is Rubedo\'s culmination: the moment when the Stone is made, when the Work achieves its primary goal. Completion asks: Have you truly arrived? But Rubedo teaches a paradoxical truth: Completion is not ending. The Stone is not a destination where you rest but a living principle that continues transforming. Completion is both arrival and beginning.\n\nCompletion means:\n- The cycle of Nigredo-Albedo-Rubedo is fulfilled: you have descended into dissolution, ascended through purification, and integrated into wholeness\n- You have created something eternal within yourself: a center that cannot be shaken\n- You have transmuted your essential lead into gold: your suffering has become wisdom, your fragmentation has become integration, your confusion has become clarity\n- You stand as the Philosopher\'s Stone: capable of transmuting everything you touch, bringing clarity to confusion, offering healing to suffering\n- You recognize yourself as complete while knowing completion is not completion: the Work continues at higher levels\n\nIn Hermetic philosophy, Completion corresponds to the return of the Monad to itself—the circle completed. The ouroboros (serpent eating its tail) represents completion: the end is the beginning; when the Work is completed at one level, it immediately begins again at the next.\n\nIn Kabbalah, Completion is the return to Kether (the Crown) while maintaining consciousness in Malkuth (the material world). You have completed the journey down the Tree of Life and back up while remaining present in manifestation.\n\nIn Taoist philosophy, Completion is the achievement of Immortality (not physical but the recognition of your eternal nature). The Immortal in Taoist tradition continues living and working in the world but from complete freedom from fear and attachment.\n\nPractically, Completion means:\n- You recognize moments when you have accessed the Stone: timeless, whole, capable of transmuting suffering into wisdom\n- You understand that this is not a permanent state to maintain but a principle you have activated\n- You move through life as the Stone: not trying to be perfect but being genuinely yourself\n- You become transmuting presence for others: your wholeness invites their integration\n- Your work shifts from personal Work to Greater Work: serving not just your own transformation but the world\'s evolution\n- You no longer need to prove anything: your presence speaks\n- You continue practicing not from lack but from joy in the Work itself\n\nCompletion work includes:\n- Celebration: acknowledgment of what you have accomplished; gratitude for the journey\n- Integration of achievement: integrating this completion into your identity without inflating\n- Reflection: understanding what the Work has taught you\n- Transmission: beginning to transmit what you have learned\n- Deepening: moving from completion of this cycle into the next spiral\n- Service: dedicating your accomplished work to the healing of the world\n- Humility: recognizing that you have completed one cycle while infinite work remains\n\nThe paradox of Completion is that it destroys the question "Are we there yet?" You have arrived only to discover that arrival means departure. The Stone does not rest but moves. Having completed the Work, you understand that the Work is endless—not as burden but as eternal opportunity.\n\nCompletion is recognizable by the peace that accompanies it. You have achieved what you set out to achieve. Whether you continue—and you will, because the Work is its own reward—matters less than the fact of having truly reached Rubedo. You are complete and incomplete simultaneously. You have arrived and are just beginning. This paradox is not confusion but the highest wisdom that Alchemy offers: that transformation is eternal, that the Work is never finished because the Work itself IS the point, that completion and continuation are the same thing seen from different angles.\n\nYou are the Philosopher\'s Stone. The Work has transformed not just your consciousness but your very being. And having completed this cycle, you turn toward the Greater Work with the fullness of integrated wholeness, ready to transmute the world around you simply by being fully, authentically, completely yourself.',
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Rubedo is the reddening, the third and final stage of the Great Work, the completion and consummation of the alchemical transformation. After Nigredo\'s dissolution and Albedo\'s purification, Rubedo is integration: the union of the Red King (Sulfur) and White Queen (Mercury) in the sacred marriage that produces the Philosopher\'s Stone. Rubedo is not the end of the Work—the Stone is itself a living principle that continues transforming—but it is the achievement of the primary goal: the creation of something eternal, incorruptible, and supremely powerful. Rubedo is red not just as color but as meaning: the redness of gold, the redness of love, the redness of the heart\'s deepest truth. In Rubedo, all polarities integrate: masculine and feminine, fire and water, will and wisdom, action and reception. This is the union that creates the Stone.',
          },
          {
            heading: 'The Chemical Wedding',
            content: 'The Chemical Wedding (Chymische Hochzeit) is the symbolic marriage of Red King and White Queen—Sulfur and Mercury, Masculine and Feminine, Will and Wisdom. This is not violent union but sacred marriage: both partners bring equal value and power. The Red King brings passion, will, creative fire, and action. The White Queen brings consciousness, clarity, intuition, and reception. Neither is superior; both are necessary. Their union creates something neither could create alone. In your own work, this means: integrating your will with your wisdom, balancing action with reflection, uniting your masculine and feminine energies (regardless of your physical gender), creating wholeness through integration of seeming opposites. The Chemical Wedding is consummation, but it\'s also the beginning of something new—the birth of the Stone as living principle.',
          },
          {
            heading: 'The Philosopher\'s Stone',
            content: 'The Philosopher\'s Stone is alchemy\'s supreme achievement: matter that is simultaneously perfectly purified, completely whole, absolutely incorruptible, and infinitely transformative. Legends describe the Stone as: capable of transmuting base metal into gold, capable of healing any illness, capable of conferring immortality, capable of revealing all truth. In spiritual terms, the Stone is your integrated self: the part of you that has transmuted all lead (limitation, suffering, illusion) into gold (wisdom, wholeness, authentic power). The Stone is not a destination you arrive at and then maintain; it is a living principle that continues evolving. Creating the Stone means: developing unshakeable centeredness, achieving freedom from suffering through wisdom, becoming capable of transmuting darkness into light, maintaining integrity in all circumstances.',
          },
          {
            heading: 'Integration & Wholeness',
            content: 'Rubedo\'s central work is integration: bringing all aspects of yourself into harmonious wholeness. This includes: integrating shadow with light (you cannot deny darkness and achieve wholeness), integrating body with spirit (you cannot transcend the body; you must honor it), integrating individual will with cosmic will (you are both separate and part of everything), integrating joy with sorrow (wholeness includes both), integrating solitude with relationship (you need both). Integration is not homogenizing—making everything the same. It is harmonizing—allowing differences to exist while serving the greater whole. You don\'t lose your complexity in Rubedo; you organize it into unity. The Red Dragon (another symbol of Rubedo) represents this: fierce, powerful, possessing all fire and passion but integrated into wisdom and purpose.',
          },
          {
            heading: 'The Red Dragon & Transformation Mastery',
            content: 'Rubedo is symbolized as the Red Dragon—the culmination and master of all transformative power. The Dragon possesses: fire (Sulfur\'s passion), flight (Mercury\'s elevation), scale armor (Salt\'s grounding), and ancient wisdom. The Dragon is capable of profound transformation because it synthesizes all principles. Working with Red Dragon energy means: mastering your capacity to transform, becoming a source of wisdom and power for others, developing the fierce compassion that knows how to burn away illusion even as it holds space for healing. The Dragon is not merely powerful; it is wise. It does not use power carelessly. Rubedo practitioners become sources of transformation—their presence, their consciousness, their integrated wholeness catalyzes change in others.',
          },
          {
            heading: 'Immortality & Continuity',
            content: 'The Stone is described as conferring immortality. This doesn\'t mean physical immortality but continuity: the part of you that is eternal, unchanging, incorruptible. In Rubedo, you recognize and activate your eternal nature—the consciousness that witnesses life\'s changes without being shaken by them, the wisdom that persists through all circumstances, the love that continues regardless of suffering. Rubedo practitioners know themselves as both temporary (the body dies, circumstances change, emotions shift) and eternal (the consciousness beneath all change, the wisdom that persists, the love that transforms). This dual consciousness is the greatest gift of the Work: you live fully in time while knowing yourself as timeless. You care deeply about manifestation while not being attached to outcome.',
          },
          {
            heading: 'Transmission & The Greater Work',
            content: 'Once the Stone is created, it begins transmuting everything it touches. Your integrated wholeness transmutes not just your own lead into gold but influences everyone you encounter. This is why alchemists speak of the Work as having two phases: the Personal Great Work (creating your own Stone) and the Greater Work (transmuting the world). In Rubedo, you become a transmuting force: your presence brings clarity to confusion, your wholeness invites others toward integration, your peace supports others\' peace. You don\'t teach what to think but how to be. Your living example is your greatest transmission. As you mature in Rubedo, you naturally become a teacher, healer, and guide—not through effort but through being.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Reflect on where Sulfur (will, passion, drive) and Mercury (wisdom, clarity, intuition) are integrated in you',
          'Identify one way you can better marry your masculine and feminine energies (action and receptivity)',
          'Meditate on the image of the Chemical Wedding: two complementary forces uniting in love',
          'Create a ritual honoring your own integration: name what opposites you have unified',
          'Work with red: red candles, red stones, red clothing—activate the reddening in your energy',
          'Journal: What becomes possible when you integrate rather than fragment?',
          'Practice wholeness: in one relationship or situation, integrate opposing values or approaches',
          'Visualize yourself as the Red Dragon: wise, powerful, integrated, transforming all you touch',
          'Begin becoming transmuting presence: notice how your integrated wholeness affects others',
          'Study alchemy\'s goal: understand that your integration serves both personal and collective transformation',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Rubedo is Lifelong', text: 'Creating the Stone isn\'t an endpoint but an activation. The work of integration and refinement continues throughout life. The Stone doesn\'t need creating once and then ignoring; it needs tending.' },
          { title: 'Don\'t Skip the Earlier Stages', text: 'You cannot fake Rubedo. If you haven\'t truly descended in Nigredo or clarified in Albedo, premature claims of Rubedo create corruption instead of the Stone. Be honest about where you are.' },
          { title: 'Integration Isn\'t Perfection', text: 'Rubedo doesn\'t mean becoming perfect or never struggling. It means maintaining wholeness and wisdom even through difficulty. Integration includes shadow, limitation, and growth edges.' },
          { title: 'Be Careful with Power', text: 'As you access Rubedo consciousness, you naturally become more influential. Use this wisely. The power to transform others is also the power to harm them. Ethical use is essential.' },
          { title: 'The Work Continues', text: 'Reaching Rubedo reveals new frontiers: you might serve others\' transformation, work on collective healing, explore deeper mysteries. The Great Work is genuinely infinite.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Philosopher\'s Stone symbolism and mythology',
          'The Chemical Wedding of Christian Rosenkreutz',
          'Tantric principles of masculine/feminine integration',
          'Dragon mythology and symbolism across cultures',
          'Books on alchemical completion and the Red Work',
        ],
      },
    },
  },
  {
    name: 'Transformation',
    isSpacer: true,
  },
  {
    name: 'Observation',
    emoji: '🎯',
    description: 'Awareness - Perceive subtle energies and patterns of consciousness',
    category: {
      level1: 'Methods',
      level2: 'Awareness - Observation',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Emotion',
            emoji: '💫',
            description: 'Affective signals. The messages your feeling nature sends about what matters to you.',
            content: 'Emotion is the language of your authentic values. In observation, you learn to read emotions clearly—not as obstacles to bypass but as valuable data. Emotion asks: What are you feeling right now? What is this feeling telling you about what matters to your system?\n\nEmotions are not random reactions or primitive impulses to transcend. They are precise instruments of perception and communication. Fear signals threat to what you value. Anger signals boundary violation or injustice. Joy signals alignment with truth or authentic expression. Sadness signals meaningful loss. Shame signals violation of values. Each emotion carries specific information.\n\nThe alchemical challenge with emotion is not elimination but integration. In Nigredo, emotions are often overwhelming—unprocessed anger, frozen grief, paralyzing fear. In Albedo, you develop the capacity to feel emotions without being controlled by them. In Rubedo, emotions become direct expressions of your authentic nature—pure, clear, responsive.\n\nIn Hermetic philosophy, Emotion corresponds to Water—the fluid element that flows, adapts, holds everything, and reveals through reflection. Water (emotion) connects the upper worlds (spirit) with the lower worlds (matter). Without water/emotion, there is no bridge between dimensions.\n\nIn Kabbalah, Emotion maps to Netzach (passion, desire, imagination). Netzach is not lower or less spiritual than intellectual Hod; it is different—direct knowing through feeling and desire. Full consciousness includes both Hod (intellect) and Netzach (emotion) balanced through Tiferet (the heart center).\n\nIn Taoist alchemy, Emotion is correlated with the organs: Kidney fear, Liver anger, Heart joy, Spleen worry, Lungs grief. Emotions that become stuck or repressed create disease in the corresponding organs. Healthy emotion is dynamic, flowing, responsive.\n\nPractically, Observation of Emotion means:\n- Noticing what you feel in the moment without analyzing why\n- Asking what the emotion is communicating about your values\n- Allowing emotions to complete their natural cycle rather than suppressing\n- Recognizing that emotions arise and pass—you are larger than any emotion\n- Understanding that emotions reveal what matters: what triggers you reveals what you care about\n- Using emotional signals to guide authentic choices\n- Processing blocked emotion through safe expression (journaling, movement, talk)\n\nEmotional Observation work includes:\n- Body awareness: where in your body do you feel different emotions?\n- Journaling: write what you are feeling and what it communicates\n- Emotional release: safely express emotions that are frozen through tears, sound, movement\n- Sit with emotion: instead of acting on or suppressing an emotion, simply allow it to be present\n- Track emotions: notice your emotional patterns across days—what emerges? What cycles?\n- Name emotions precisely: instead of "bad," is it afraid? angry? sad? ashamed? Each has different information\n- Investigate triggers: when strong emotion arises, what specifically triggered it? What did it activate?\n\nThe paradox of Emotion in Observation practice is that emotions become clearer when you stop trying to manage them. The moment you stop suppressing or amplifying emotion and simply allow it to be exactly as it is, it begins communicating clearly. The most overwhelming emotions are usually the most blocked emotions. When you create space for them, they move through naturally.\n\nEmotional literacy is alchemical work. As you develop it, emotions become your greatest teachers. They show you what you truly value, what your boundaries are, what you need to heal, what needs attention. An emotionally aware practitioner moves through life with a sophisticated inner compass—guided not by mental concepts but by genuine emotional wisdom. This is heart intelligence: the fusion of emotion\'s depth with consciousness\'s awareness.',
          },
          {
            name: 'Reaction',
            emoji: '⚡',
            description: 'Habitual responses. The automatic patterns triggered by stimuli.',
            content: 'Reaction is what happens before consciousness engages. It is the automatic program running beneath awareness. Reaction asks: What do you do without thinking? What are your habitual responses to threat, rejection, criticism, or success?\n\nReactions are mostly unconscious—formed through repetition until they fire automatically. You perceive a threat and attack before thinking. You receive criticism and defend before considering. You experience success and diminish before celebrating. These patterns are so fast, so automatic, that you often don\'t notice them until after they have shaped your behavior and consequences.\n\nObservation of Reaction means slowing this process down enough to see it happening. Instead of the reaction completing automatically, you insert a moment of awareness between stimulus and response. Viktor Frankl called this "the last human freedom"—the space between what happens to us and how we respond to it. In this space lies our power.\n\nIn Hermetic philosophy, Reaction corresponds to mechanical causation—cause and effect at the material level. Reactions are mechanical: the same stimulus produces the same response reliably. Until you introduce consciousness into the equation. Then choice becomes possible.\n\nIn Kabbalah, Reaction is the work of Hod (intellect) becoming aware of its own programs. Hod creates patterns and runs them automatically. But consciousness can step outside Hod and observe these programs running. Then choice becomes possible.\n\nIn Taoist practice, Reaction is Wei (action), while Response is Wu Wei (non-action or spontaneous right action). Most people live in Wei—mechanical reaction. Taoists develop the capacity for Wu Wei—responding appropriately to each unique moment rather than running programs.\n\nPractically, Observation of Reaction means:\n- Noticing your automatic responses in real-time if possible, or at least recognizing them shortly after\n- Identifying your core reaction patterns (fight, flight, freeze, fawn are common)\n- Understanding the childhood origins of your patterns (what adaptation did you need then?)\n- Recognizing that reactions kept you safe once; they are now often counterproductive\n- Creating pause space: between stimulus and response, introducing awareness\n- Observing: what triggers you most? These are your deepest patterns\n- Developing choice: you cannot choose differently until you are aware you are choosing\n\nReaction Observation work includes:\n- Slow-motion review: After reacting, review what happened step by step\n- Trigger mapping: list situations that trigger you, notice your pattern of response\n- Body awareness: where do you first feel the reaction starting? Chest tightness? Heat? Freeze?\n- Meditation on pause: practice noticing the moment between stimulus and response\n- Inquiry: What would responding (not reacting) look like in this situation?\n- Rehearsal: imagine a triggering situation and consciously choose a different response\n- Real-world practice: when triggered, use your pause point to choose consciously\n\nThe paradox of Reaction is that observing it without judgment allows it to transform. The moment you become aware you are reacting habitually, that reaction loses some of its power. Continuous observation over time creates neural rewiring—your default response gradually shifts from automatic reaction to conscious response.\n\nReaction observation is foundational alchemical work because transformation cannot occur where reactions run unconsciously. You cannot transmute a pattern you cannot see. As awareness grows, reactions slow down. What was blinding speed becomes observable process. And in that space of observation, true choice—and therefore true transformation—becomes possible. This is how Nigredo\'s chaos becomes Albedo\'s clarity becomes Rubedo\'s mastery: through painstaking observation of how we automatically respond, and gradual conscious rewiring toward response.',
          },
          {
            name: 'Pattern',
            emoji: '🔄',
            description: 'Recurring dynamics. The themes that repeat across your life.',
            content: 'Patterns are the meta-level of observation: not individual reactions but the recurring themes across your life. Pattern asks: What keeps happening? What cycles repeat in relationships, work, spirituality, creativity? What situations feel familiar in ways you cannot fully explain?\n\nPatterns reveal deep conditioning—beliefs so fundamental you don\'t notice them because they shape the framework through which you perceive. You might believe "relationships never last" so deeply that you unconsciously sabotage them when they get close. You might believe "I always fail at this type of thing" so that you never fully attempt it. These are not facts but conditioned programs so old and familiar that they feel like truth.\n\nThe power of Pattern observation is that it reveals invisible frameworks. You think you are making individual choices, but Pattern work shows: you are actually choosing from a limited menu of habitual options. Different contexts, same underlying pattern. Different people, same dynamic recurring. This is where real transformation becomes possible—when you see you have been running the same program hundreds of times.\n\nIn Hermetic philosophy, Pattern corresponds to the principle of Vibration—each situation vibrates at a frequency that resonates with your core beliefs. Until the belief changes, the pattern frequency remains and attracts the same situations.\n\nIn Kabbalah, Pattern is the work of Binah (Understanding), the great mother who creates all forms. Once a pattern-form is created, it reproduces itself persistently. Breaking patterns requires going to the level of Binah to create new form-patterns.\n\nIn Taoist practice, Pattern is Shen (spirit form or character). Your character/patterns are visible in how circumstances arrange themselves around you. Changing Shen requires deep work, not surface behavior modification.\n\nPractically, Observation of Pattern means:\n- Looking back at your life history and noting recurring themes\n- Recognizing the same pattern appearing in different contexts with different people\n- Identifying the core belief underlying the pattern (often formed in childhood)\n- Understanding what the pattern protected or achieved originally\n- Recognizing that the pattern once served you but may no longer\n- Investigating what would have to change for the pattern to stop repeating\n- Understanding that breaking patterns requires both awareness and often support\n\nPattern Observation work includes:\n- Life review: map your relationships, jobs, conflicts across time—notice the pattern\n- Family systems work: identify patterns inherited from your family of origin\n- Archetype mapping: are you repeatedly embodying the same archetypal role?\n- Belief investigation: what core belief drives this pattern? Where did it originate?\n- Enactment awareness: notice when you are actively creating the pattern through unconscious choice\n- Alternative inquiry: what would need to be true for a different pattern to emerge?\n- Ritual or ceremony: mark the conscious release of the old pattern\n\nThe paradox of Pattern observation is that it requires simultaneously holding both personal responsibility and compassion. You chose/created these patterns, and they made perfect sense given your circumstances. You are creating them repeatedly, and they are deeply conditioned. Both true simultaneously. This dual awareness—agency and compassion—allows transformation without blame.\n\nPattern work is where individual Nigredo-Albedo-Rubedo cycles cascade into collective transformation. As you recognize and release major patterns, you free not just yourself but ancestral lines, family systems, and collective conditioning that was running through you. This is deep alchemical work—not just transforming your lead into gold but recognizing you carry generational patterns that transformation can release. Pattern observation is gateway to both personal and collective healing.',
          },
          {
            name: 'Feedback',
            emoji: '📡',
            description: 'Internal indicators. The subtle signals your body and psyche send about alignment and integrity.',
            content: 'Feedback is the language your whole system speaks when you learn to listen. Your body holds wisdom. Your emotions convey messages. Your dreams communicate from the depths. Synchronicities whisper about larger patterns. Your energy level indicates alignment or misalignment. Feedback asks: What is your system telling you? Are you listening?\n\nMost people operate in feedback-deaf mode. They override their body\'s signals, suppress emotions that seem inconvenient, ignore dreams, dismiss synchronicities as coincidence, push through energy depletion. This creates disconnection from the system\'s wisdom and leads to repeated crises before attention is paid.\n\nObservation of Feedback means developing sensitivity to subtle signals and honoring them before they need to become loud. When you feel slight tension in your body, pause and investigate instead of waiting for pain. When something feels "off" emotionally, explore instead of numbing. When a dream repeats, pay attention instead of forgetting. When you notice something happening three times that seems like coincidence, investigate the pattern instead of dismissing it.\n\nIn Hermetic philosophy, Feedback corresponds to the principle of Correspondence—as above, so below. Your inner alignment reflects in your outer circumstances; your thoughts and feelings shape your reality. Your system is constantly providing feedback about alignment.\n\nIn Kabbalah, Feedback flows through all the spheres: when you are aligned, energy flows smoothly; when misaligned, blockages and problems emerge. The system is constantly communicating about the state of alignment.\n\nIn Taoist practice, Feedback is the practice of listening to the body\'s signals. The body knows before the mind understands. A skilled practitioner learns to read the body\'s feedback and adjust before problems arise.\n\nPractically, Observation of Feedback means:\n- Noticing body signals: tension, ease, temperature changes, energy shifts\n- Honoring emotional signals: what triggers you, what delights you, what concerns you\n- Recording dreams: noting recurring symbols, emotional themes, messages\n- Investigating synchronicities: when the same symbol appears multiple times, what is it communicating?\n- Energy tracking: noticing activities and people that deplete versus energize\n- Intuitive knowing: paying attention to gut feelings and non-rational knowing\n- Listening to reactions: extreme reactions often signal deep pattern or core value\n- Physical symptoms: noticing when stress creates specific physical patterns\n\nFeedback Observation work includes:\n- Daily body scan: systematically attend to different parts of your body and their messages\n- Dream journaling: write dreams immediately upon waking, note emotions and themes\n- Synchronicity log: record meaningful coincidences and investigate their message\n- Energy audit: list activities and people, note whether they energize or deplete you\n- Intuitive development: practice following gut feelings to develop trust\n- Somatic tracking: when strong emotion arises, feel where in the body it lives\n- System honoring: make choices based on feedback signals, not just mental analysis\n- Integration check-in: regularly ask "Is my life aligned with what my system is telling me?"\n\nThe paradox of Feedback is that the more you listen to subtle signals, the less intense they need to become. When you honor a slight discomfort, you don\'t develop pain. When you listen to early emotional signals, you don\'t face crisis. Your system actually wants to communicate gently if you will listen. Crisis only becomes necessary when gentle feedback has been ignored repeatedly.\n\nFeedback observation is where Observation practice becomes practical. It is not just meditation or philosophical understanding but moment-to-moment information about whether your choices are aligned with your authentic nature. As you develop this skill, your life becomes increasingly responsive. You make choices aligned with who you actually are rather than who you think you should be. You take care of problems early rather than waiting for crisis. You become increasingly trusting of your system\'s wisdom. This is mastery of the feedback loop: the system constantly tells you what it needs; you listen and respond; wellbeing naturally follows.',
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Awareness is the alchemical faculty of direct perception—gnosis, knowing through direct experience rather than belief. Observation is not passive watching but active, engaged investigation of consciousness itself. In alchemy, awareness develops through witnessing your own transformation: noticing how you change through the stages of the Work, perceiving subtle shifts in consciousness, recognizing how inner transformation reflects externally. This practice is both investigation and meditation: you become witness to your own processes, observer of your mind, aware of awareness itself. Awareness reveals how consciousness shapes reality—that your perception creates your experience, that your beliefs filter what you notice, that you are not separate observer but active participant in creating the world you inhabit. This practice requires courage: seeing clearly means seeing all, including what you\'d prefer not to know about yourself.',
          },
          {
            heading: 'Witnessing Your Own Transformation',
            content: 'The Great Work transforms you. Awareness means consciously witnessing this transformation rather than sleepwalking through it. Notice: how your consciousness shifts as you progress through Nigredo, Albedo, and Rubedo. How your perceptions change. How what once seemed absolutely true now seems limited. How you can hold perspectives you previously thought mutually exclusive. Witnessing your own transformation teaches profound lessons: identity is fluid not fixed, truth is multifaceted not singular, you are capable of change more radical than you imagined. Keep detailed journals of your transformation. Recording how you see before and after reveals the extent of the change. Over time, you become skilled at noticing your own transformation as it occurs rather than only recognizing it retrospectively.',
          },
          {
            heading: 'Perception & Reality Co-creation',
            content: 'Awareness reveals that you are not observing an objective reality but co-creating reality through perception. What you focus on expands. What you notice becomes more present. What you ignore diminishes. This isn\'t mystical thinking—neuroscience confirms that consciousness shapes perception. Your brain filters millions of stimuli and presents you only with what it deems important based on your beliefs and attention patterns. In alchemy, this means: your observational practice literally reshapes what you perceive. As you develop awareness, you see differently, and therefore you experience differently. Different people experience the same situation as completely different realities based on their perceptual filtering. Awareness means recognizing this mechanism and consciously choosing what you focus on rather than being unconsciously driven by habit.',
          },
          {
            heading: 'The Observer & The Observed',
            content: 'Meditation reveals a paradox: the observer and the observed are not separate. When you sit quietly and observe your thoughts, the observer is also a thought. When you observe your breath, you are breathing—not separate from the breath. This points to a deeper truth: all observing consciousness is unified. There\'s not multiple separate observers but one consciousness experiencing through many perspectives. In advanced awareness, this becomes experiential: you directly know yourself as not the observer looking out, but the consciousness itself that temporarily identifies as observer. This realization—that you are the consciousness, not the observer-within-consciousness—is profoundly liberating. It means there\'s no ultimate separation between yourself and others, between observer and observed, between inside and outside.',
          },
          {
            heading: 'The Space Between',
            content: 'Meditation develops ability to perceive the space between: the gap between thoughts, the silence between sounds, the emptiness between forms. This space is not nothing—it is pregnant with potential. Mystics call it the void, the gap, the silence. Physicists call it quantum potential. In meditation, the more you rest in this space, the clearer it becomes. You notice the space between breath cycles, the pause between heartbeats, the silence under all sound. This space is where transformation occurs—in the silence between the old and the new, in the gap where old structures collapse before new ones form. Awareness develops by deliberately spending time in this space, getting comfortable with it, learning to hear the profound wisdom that lives in silence.',
          },
          {
            heading: 'The Observer Outside Time',
            content: 'Consciousness is not bound by time. In awareness, you can perceive the eternal aspect of yourself—the part that was present when you were born and will be present when you die, that witnesses all your changes while remaining unchanged. This is not personality (which is temporal) but the witnessing consciousness beneath personality. Sometimes called the Higher Self or the True Self, it is your continuity. Connecting with the observer outside time gives profound peace. You begin to recognize that while your personality, body, and circumstances are constantly changing, something in you persists. This realization dissolves fear of death and provides stability even through chaos.',
          },
          {
            heading: 'Awareness as Alchemical Catalyst',
            content: 'In alchemy, awareness is the great catalyst. You cannot change what you don\'t see. As soon as you become aware of a pattern, it begins changing. Awareness itself is transformative. This is why honest self-observation is so powerful: simply noticing your patterns without judgment begins transmuting them. You don\'t have to force change; consciousness itself is the transmuting agent. The more you develop awareness—the capacity to witness clearly what is actually occurring—the more automatically transformation happens. This is why all genuine spiritual paths emphasize awareness, meditation, and careful observation. These aren\'t separate from transformation; they are the primary means of transformation.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin daily meditation practice: sit for 10 minutes observing breath, thoughts, sensations without judgment',
          'Keep a journal: record what you notice about your consciousness, patterns, and shifts',
          'Practice the space between: deliberately rest attention in the gaps (between thoughts, between breaths)',
          'Observe your perceptions: choose an object and notice how your attention shapes what you perceive',
          'Investigate the observer: who is noticing the thoughts? Can you find the observer?',
          'Notice transformation: record how you perceive situations now versus six months ago',
          'Practice self-witnessing: during one day, consciously witness your patterns, reactions, and choices',
          'Meditate on continuity: notice the part of you that has remained constant throughout your life',
          'Investigate time: in meditation, enter the space between moments where time seems to pause',
          'Deepen awareness: observe how the act of observation itself changes what is being observed',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Awareness Without Judgment', text: 'Observe clearly but don\'t judge. Judgment halts observation and prevents genuine seeing. Just notice what is.' },
          { title: 'Consistency Creates Depth', text: 'Daily practice develops awareness far more than occasional deep sessions. Regular small practice accumulates profound change.' },
          { title: 'You Cannot Force Awareness', text: 'Trying to force enlightenment or awareness creates tension that prevents it. Relax and allow awareness to develop naturally.' },
          { title: 'Awareness Includes Shadow', text: 'Real awareness notices everything: your cruelty, your selfishness, your fear. Don\'t avoid seeing shadow. Include it in awareness.' },
          { title: 'Awareness is the Goal', text: 'Meditation\'s goal is not specific experiences or enlightenment states but simply the capacity to be aware. All genuine development proceeds from awareness.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Vipassana (insight meditation) teachings and practices',
          'Advaita Vedanta on the witness consciousness',
          'Zen koans on the nature of observation',
          'Books on consciousness and neuroscience',
          'Meditation instruction for developing stable awareness',
        ],
      },
    },
  },
  {
    name: 'Correspondence',
    emoji: '🗝️',
    description: 'Symbolism - Unlock meaning through symbols and sacred language',
    category: {
      level1: 'Methods',
      level2: 'Symbolism - Correspondence',
    },
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            name: 'Dreams',
            emoji: '😴',
            description: 'Unconscious messaging. The language your deeper self uses to communicate what conscious mind cannot or will not see.',
            content: 'Dreams are your psyche\'s primary language when the conscious mind relaxes control. In dreams, the boundary between inner and outer dissolves. Symbols appear with clarity impossible in waking. Truths suppressed in daylight emerge at night. Dreams ask: What is your psyche trying to tell you? What cannot be heard while awake and defended?\n\nIn alchemy, dream work is serious practice because dreams are direct pipeline to the unconscious mind where real transformation happens. The conscious mind might deny fear, but the dream reveals it clearly. The conscious mind might rationalize unhealthy patterns, but the dream depicts them vividly. The conscious mind might resist transformation, but the dream shows necessary death and rebirth.\n\nDreams bypass rational filters and resistances. This is their power and their challenge: they show truth but in symbolic language that requires interpretation. A dream of being chased is not literally about chase but about something pursued in your psyche—what you are running from. A dream of drowning is not literal but psychological—what are you going under in? A dream of flying is not physical but consciousness—where are you soaring toward or trying to escape?\n\nIn Hermetic philosophy, Dreams correspond to the threshold between worlds. In sleep, consciousness relaxes its fixation on the material and becomes permeable to subtler dimensions. Dreams are literally messages from the Other Side—whether you understand that as your unconscious or as actual non-physical realms.\n\nIn Kabbalah, Dreams are the work of Yesod (the unconscious, the dreaming psyche). Yesod is gateway to the higher spheres; mastering Yesod through dream work opens access to higher consciousness.\n\nIn Taoist practice, Dreams are how the Hun (ethereal soul) travels while the Po (corporeal soul) rests in the body. Dream travel is actual movement in subtle realms, not merely psychological. Dreams can be developed and directed through practice.\n\nPractically, Dream work means:\n- Recording dreams immediately upon waking before they fade\n- Noting the emotions from the dream, not just the plot\n- Recognizing recurring symbols and what they mean personally to you\n- Asking dreams specific questions before sleep and receiving answers\n- Noticing which dreams feel prophetic or carry archetypal power\n- Integrating dream wisdom into waking life\n- Allowing dreams to heal what conscious mind could not address\n- Exploring lucid dreaming: becoming conscious while dreaming\n\nDream work includes:\n- Dream journal: write immediately upon waking\n- Symbol tracking: notice recurring images and their evolution\n- Active imagination: take a dream character or scene and dialogue with it while awake\n- Dream circle: sharing dreams with others amplifies their work\n- Intentional dreaming: set clear questions before sleep\n- Dream reentry: in meditation, return to a dream for further insight\n- Ritual honoring: acknowledge the work dreams are doing\n- Life application: let dream wisdom guide your waking choices\n\nThe paradox of Dreams is that the more you honor them, the more vivid and memorable they become. Ignored dreams fade instantly. Attended dreams deepen. When you keep dream journal, dreams become increasingly rich, detailed, and meaningful. You are training your consciousness to remember and value what the unconscious is communicating.\n\nDream mastery is where psychology and mysticism meet. Through dreams, you access the full power of your psyche\'s wisdom, your unconscious memories, ancestral inheritance, and contact with realms beyond ordinary reality. Dreams are not escape from reality but deepest reality—the truth of consciousness unbounded by personality and logic. When you learn to listen to dreams, you gain access to authentic guidance that no one else can provide.',
          },
          {
            name: 'Metaphor',
            emoji: '✨',
            description: 'Compressed meaning. The way symbols hold multiple meanings simultaneously in compact form.',
            content: 'Metaphor is the language of alchemy, poetry, and myth. It compresses profound truths into images that work on multiple levels simultaneously. Metaphor asks: What does this image mean? And then: What else does it mean? And then: What else?\n\nA single metaphor can carry layers of meaning that would require pages of literal explanation. The image of a chrysalis simultaneously means: containment, transformation, death, incubation, protection, emergence, metamorphosis, surrender. You can\'t reduce a true metaphor to one meaning without losing its power. Its power comes precisely from capacity to hold multiple truths at once.\n\nIn alchemy, metaphor is not decorative but structural. The entire Great Work is described in metaphor: the Red King and White Queen (will and wisdom), the Philosopher\'s Stone (integrated wholeness), the nigredo-albedo-rubedo stages (darkness-light-redness). These metaphors are not just poetic—they are the actual framework through which consciousness reorganizes itself. Work with a metaphor deeply and it begins to reshape your understanding and your being.\n\nIn Hermetic philosophy, Metaphor is how macrocosmic knowledge descends into microcosmic understanding. A story about the gods is simultaneously a description of cosmic process and of individual psychological transformation.\n\nIn Kabbalah, Metaphor works through the Tarot—each card is a metaphor that simultaneously describes: cosmic principle, psychological state, alchemical operation, and personal transformation.\n\nIn Taoist practice, Metaphor conveys Wu Wei (non-action) and Tao that cannot be named. When the master points at the moon, don\'t focus on the finger—Taoist wisdom is often conveyed through metaphor because literal language cannot capture non-rational understanding.\n\nPractically, working with Metaphor means:\n- Resisting reduction: allow symbols to hold multiple meanings without forcing them to choose\n- Following associations: start with one meaning of an image and follow where associations lead\n- Feeling the metaphor: not just intellectually understanding but feeling the truth the metaphor carries\n- Noticing metaphor in your speech: what metaphors do you habitually use? What do they reveal?\n- Working creatively: create your own metaphors for your experience; original metaphors are powerful\n- Honoring contradictions: in metaphorical thinking, something can be simultaneously a death and a birth\n- Deepening through art: paint, write, dance the metaphor—embodied work with metaphor deepens it\n\nMetaphor work includes:\n- Meditation on metaphor: sit with an image and let its meanings reveal themselves\n- Personal mythology: create metaphors for your transformation journey\n- Myth study: immerse yourself in mythological stories as living metaphors\n- Symbol journeys: follow metaphorical images through active imagination\n- Metaphor journal: collect metaphors that resonate; return to them regularly\n- Creative expression: paint, sculpt, write your experience through metaphor\n- Conversation about metaphor: dialogue with others about what symbols mean\n- Living the metaphor: let your life become shaped by the metaphors you work with\n\nThe paradox of Metaphor is that it is simultaneously more true and more false than literal language. False because it is not literally accurate—you are not literally a chrysalis. True because the chrysalis perfectly captures something essential about your transformation that cannot be literally expressed. The metaphor is the truth; literal language is the limitation.\n\nMetaphor mastery allows you to perceive reality as polyvalent—multiple truths simultaneously true, contradictions all valid, paradoxes containing wisdom. This is how integrated consciousness operates. As you develop fluency with metaphor, you become fluent with reality itself. You understand that the apparent contradictions in your experience are not problems but the very texture of transformation. Like the chrysalis, you contain death and birth, dissolution and formation, ending and beginning—all simultaneously real, all necessary, all captured perfectly in metaphor.',
          },
          {
            name: 'Image',
            emoji: '👁️',
            description: 'Psychic representation. The visual form that communicates across the boundary between conscious and unconscious.',
            content: 'Image is how consciousness communicates with itself at levels beyond words. An image bypasses intellectual analysis and speaks directly to the deeper mind. Images work psychically, not just symbolically. Image asks: What does your psyche show you? What is appearing in your inner vision?\n\nThe image of gold simultaneously means: transformation, preciousness, incorruptibility, wholeness, the goal of alchemy, the sun, consciousness itself, the achieved Stone. But it also works through form—the visual appearance of gold activates something in your being that the word "gold" cannot. The image is what carries the power.\n\nThe psyche speaks primarily in images: your dreams appear as pictures, your imagination works through visual forms, your deepest knowing comes through symbols that appear to your inner sight. When you sit in meditation and an image appears (spontaneously, not through effort), pay attention. Your psyche is communicating something it could not say in words.\n\nIn Hermetic philosophy, Images are forms in the Astral Plane—the intermediate realm between spirit and matter. Working with images means developing capacity to perceive the astral and to shape it through focused imagination.\n\nIn Kabbalah, Images are the work of Yesod (the Astral Plane, the sphere of image-making). Mastering Yesod means developing control over what images appear, both in dream and meditation, and understanding their meaning.\n\nIn Taoist alchemy, Images work through the subtle body and the energy channels. Visualizing specific images activates specific energy flows. An image of light in the lower dantian activates Qi; an image of a flowering lotus in the heart activates compassion.\n\nPractically, working with Image means:\n- Paying attention to spontaneous images that appear in meditation or dream\n- Developing inner sight: practicing visualization until images become clear\n- Allowing images to teach: instead of imposing meaning, let images reveal their message\n- Working with archetypal images: dragons, phoenix, serpent, sacred geometry\n- Creating visual altars: surrounding yourself with images corresponding to your intention\n- Understanding that images are not subjective: they carry objective psychic force\n- Trusting visual knowing: developing the capacity to know through seeing, not just thinking\n- Charging images: investing images with intention and attention until they become powerful\n\nImage work includes:\n- Visualization practice: daily practice training imagination to produce clear images\n- Active imagination: consciously engaging with images that appear in meditation\n- Mandala work: meditating on sacred geometric images\n- Tarot meditation: using Tarot images as gateways to deeper consciousness\n- Symbol gazing: staring at a symbol until it becomes luminous and alive\n- Dream reenactment: recreating dream images while awake for deeper understanding\n- Creating personal mandalas: paint or draw images that represent your journey\n- Image journaling: drawing what you perceive rather than writing about it\n\nThe paradox of Image is that it is simultaneously inner and outer, subjective and objective, personal and transpersonal. Your inner image is unique to you, yet it taps into collective patterns that every human recognizes—the dragon appears across cultures because the dragon is psychically real. Your personal vision is also universal.\n\nImage mastery is where you develop the capacity to see non-physical reality. As your inner sight clears, you perceive subtle dimensions directly. You begin seeing auras, perceiving beings of light, recognizing the imaginal realm as real as material reality. Your imagination becomes not fantasy but accurate perception of subtler dimensions. This is not special skill but natural development when barriers to perception are removed. The psychic world has been speaking in images since your birth; image work simply develops the capacity to hear.',
          },
          {
            name: 'Language',
            emoji: '📖',
            description: 'Symbolic translation. The process of converting between symbolic and literal language, between psychic and verbal expression.',
            content: 'Language is not neutral. Words carry power beyond their definitions. Language asks: How do you translate inner experience into outer words? What language can capture what transcends language?\n\nLiteral language operates at one level—descriptive, precise, but limited. You can say "I am tired" literally. But symbolic language operates at another dimension entirely. When you say "I am tired" with intention and understanding, you are activating fatigue-principle energy. When you speak a sacred word in a ritual context with full consciousness, that word carries actual power to transform reality.\n\nThis is not magic in the sense of supernatural manipulation. It is magic in the sense that vibration, intention, and meaning shape reality. Words are vibrations. Vibrations are frequency. Frequency corresponds to actual states of consciousness and material reality. Speak carelessly and you broadcast low-frequency thoughts. Speak with precision and consciousness and you broadcast high-frequency energy. Your reality responds accordingly.\n\nIn Hermetic philosophy, Language work means understanding that words themselves carry Logos (divine reason, creative principle). The word is literally how creation happened: "Let there be light" is the fundamental utterance. Language is creative principle.\n\nIn Kabbalah, Language work means studying the sacred languages (Hebrew, Arabic, Latin). These languages are considered more powerful than modern languages because ancient practitioners charged them with enormous intentionality across centuries of use. Hebrew is particularly significant—each letter carries geometric and numerical significance; each word is a formula containing cosmic secrets.\n\nIn Taoist practice, Language is understood as arising from primordial silence. Before language is the soundless sound. Language is the manifestation of that primordial silence. True language points back toward silence.\n\nPractically, Language work means:\n- Speaking with precision: using exact words that carry specific vibration\n- Understanding sacred languages: studying Hebrew, Sanskrit, or other languages considered sacred\n- Learning symbolic systems: Tarot, astrology, numerology—these are symbolic languages encoding wisdom\n- Recognizing how myths teach: stories carry deep knowledge encoded in narrative\n- Understanding fairy tales as teaching: recognizing how fairy tales encode alchemical transformation\n- Charging words: investing ordinary words with intention until they become powerful\n- Ritual language: understanding how ceremonial speech works differently than casual speech\n- Silence: understanding that language is most powerful when it points toward what cannot be said\n\nLanguage work includes:\n- Sacred language study: learn Hebrew letters and their meanings\n- Tarot study: understand how Tarot is a symbolic book of wisdom\n- Myth study: immerse in mythologies and understand their deep meanings\n- Poetry work: both reading and writing poetry develops fluency with symbolic language\n- Mantra practice: repeating sacred words or phrases charges them with power\n- Affirmation work: crafting precise affirmations and speaking them with consciousness\n- Ritual writing: creating your own ceremonies using powerful symbolic language\n- Listening: developing capacity to hear what language points toward beyond words\n\nThe paradox of Language work is that the deepest communication is often wordless. The most powerful magic is often silent. Words are tremendous but they point toward something beyond themselves. The truly conscious speaker knows when to speak and when to silence, when language serves and when it obscures.\n\nLanguage mastery is where you become a conscious creator through words. You understand that your speech literally shapes your reality. You use words not casually but consciously, understanding their power. You recognize that different languages carry different consciousness—speaking in Hebrew feels different than speaking in English because Hebrew carries different frequency. You become fluent in multiple languages: literal, symbolic, energetic, silent. Your communication becomes increasingly effective because it operates on multiple levels simultaneously. This is the power of Alchemy encoding knowledge in Language—words that simultaneously teach at beginner\'s level and advanced level, for different consciousness states. The deepest meaning cannot be spoken but can be pointed toward through language that ignites recognition in the listener.',
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Correspondence is the hermetic principle that reveals the hidden unity underlying apparent diversity: "As above, so below; as below, so above." This principle means that patterns repeat at every level of existence—what happens in the stars mirrors what happens in atoms, what happens in the cosmos reflects what happens in your psyche, what happens in the macrocosm reflects what happens in the microcosm. Correspondence is the foundation of sympathetic magic: because all is connected through pattern, working with a symbol, image, or substance connected to your goal actually influences that goal. Symbols work through correspondence—they carry pattern that resonates with what they represent. Understanding and working with correspondences reveals the hidden architecture of reality and provides access to vast power. Correspondence is not metaphorical; it describes literal patterns of energy and consciousness.',
          },
          {
            heading: 'The Hermetic Principles',
            content: 'Hermetic philosophy identifies universal principles that govern reality: Mentalism (All is Mind—consciousness is fundamental), Correspondence (patterns repeat), Vibration (all is vibration at different frequencies), Polarity (all contains opposites), Rhythm (cycles occur), Cause and Effect (nothing happens by chance), and Gender (masculine and feminine principles pervade all). Understanding these principles reveals how reality actually works. Correspondence specifically teaches that by understanding the pattern at one level, you understand all levels. If you understand the pattern of your personal transformation (Nigredo-Albedo-Rubedo), you understand planetary cycles, chemical processes, and collective evolution—all follow the same pattern. Studying correspondence opens your perception to see these patterns everywhere.',
          },
          {
            heading: 'Microcosm & Macrocosm',
            content: 'The microcosm (small scale) mirrors the macrocosm (large scale). Your body is a universe—your cells are stars, your blood is rivers, your breath is wind, your thoughts are lightning. Conversely, the large cosmos is reflected in the small: atoms mirror solar systems, galaxies organize like neural networks, the fabric of space resembles spider webs. Working with this correspondence means: when you heal your body, you heal the macrocosm; when you transform your mind, you shift collective consciousness; when you study the stars, you study yourself. Many alchemical practices work with microcosm/macrocosm correspondence: yoga postures mirror cosmic structures, herbal medicines work through correspondence between plant and body, astrological transits mirror inner psychological movements.',
          },
          {
            heading: 'Working with Correspondences',
            content: 'Practical correspondence work means identifying what aspect of the macrocosm your goal corresponds to, then working with that aspect to influence your goal. Want to influence courage? Work with Mars (warrior energy), red (power color), iron (metal), the south (fire direction), Tuesday (Mars day), rooster (Mars animal). Work with all corresponding symbols and substances simultaneously to create maximum resonance. The more correspondences you align, the stronger the effect. This is why authentic magical ritual is so specific: every detail—timing, color, material, word, gesture—activates corresponding patterns. Sympathetic magic works because of correspondence: you don\'t have to influence your goal directly; you influence something it corresponds to, and the goal responds.',
          },
          {
            heading: 'Planetary Correspondences & Timing',
            content: 'Planets are cosmic forces that correspond to psychological and physical principles. Saturn (limitation, structure, time), Jupiter (expansion, abundance, wisdom), Mars (will, courage, conflict), Venus (love, attraction, harmony), Mercury (communication, intellect, travel), Moon (emotion, intuition, home), Sun (identity, power, consciousness). Working with planetary hours magnifies effect: perform work aligned with a planet during that planet\'s hour. Monday is Moon day—ideal for emotional, intuitive, home work. Friday is Venus day—ideal for love and harmony work. Mars day is for courage and will. Understanding planetary correspondences lets you work WITH cosmic timing rather than against it. Astrology is the study of macrocosmic correspondences; using astrological timing in your work aligns you with cosmic patterns.',
          },
          {
            heading: 'Elemental & Directional Correspondences',
            content: 'Elements carry correspondences: Fire (south, summer, passion, will), Water (west, autumn, emotion, intuition), Air (east, spring, intellect, communication), Earth (north, winter, body, grounding). Work with corresponding element for your goal: use fire for will work, water for emotional work, air for mental work, earth for manifestation. Directions carry corresponding associations: east (new beginnings, air, spring), south (power, fire, summer), west (completion, water, autumn), north (grounding, earth, winter). Arrange your altar or workspace with elements and directions corresponding to your goal. Sacred geometry corresponds to elements: triangles to fire, circles to wholeness, squares to earth. These aren\'t arbitrary—they reflect deep patterns in how energy organizes.',
          },
          {
            heading: 'Sacred Language & Words of Power',
            content: 'Language works through correspondence. Words activate the reality they describe because of resonance between symbol (the word), sound (the vibration), and meaning (what it corresponds to). Sacred languages (Hebrew, Sanskrit, Latin) are considered particularly powerful because ancient practitioners charged them with enormous intentionality. Chanting sacred words activates their correspondences. Even in modern languages, words work through correspondence if invested with intention and consciousness. This is why precise language matters in spellwork: the right words activate the right correspondences. Speaking your goal into reality is powerful because words correspond to reality—say it clearly and you begin manifesting it. Silence also corresponds to power: the silence before speech, the void before creation.',
          },
          {
            heading: 'Personal Correspondences & Custom Associations',
            content: 'While traditional correspondences are powerful, your personal associations are also valid. If blue means strength to you (even though traditionally it means communication), work with blue for strength. Your personal correspondences have power because you\'ve charged them with meaning through repeated use and emotional association. Over time, you can build a complete personal correspondence system: your colors, your plants, your animals, your numbers all correspond to your values and intentions. Honor both traditional and personal correspondences. Traditional correspondences provide access to vast power already charged by countless practitioners. Personal correspondences provide intimacy and custom power aligned specifically with you.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the Hermetic Principles—understand the hidden architecture of reality',
          'Learn basic planetary correspondences and notice their patterns',
          'Choose one goal and identify all its macrocosmic correspondences (planet, element, direction, day, color)',
          'Meditate on the principle of "As above, so below"—feel into the unity underlying diversity',
          'Create a simple ritual using correspondences: work with all corresponding elements/colors/materials simultaneously',
          'Study your birth chart: notice how cosmic patterns correspond to your psyche',
          'Work with a planetary day: perform work aligned with a specific planet on that planet\'s day',
          'Experiment with sympathetic magic: work with something corresponding to your goal rather than the goal itself',
          'Build personal correspondences: develop a system of symbols, colors, animals meaningful to you',
          'Notice correspondence everywhere: in nature, in cycles, in your own transformation—perception opens to pattern',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Correspondence is Literal', text: 'Don\'t treat correspondence as merely symbolic. These are real patterns of energy. Work with them precisely and respectfully.' },
          { title: 'Precision Matters', text: 'The more accurately you identify correspondences, the more powerful your work. Research carefully. Get details right.' },
          { title: 'Multiple Correspondences Amplify', text: 'Working with one correspondence has power. Working with many aligned correspondences multiplies the effect exponentially.' },
          { title: 'Don\'t Force Correspondence', text: 'If something doesn\'t correspond to your goal, forcing it creates confusion in energy. Use only genuine correspondences.' },
          { title: 'Study Widely', text: 'Different traditions assign different correspondences. Study multiple sources, understand the reasoning, and build coherent understanding.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Kybalion (Hermetic Principles)',
          'Golden Dawn correspondence tables',
          'Planetary magic and astrological timing guides',
          'Sacred geometry and elemental correspondences',
          'Books on sympathetic magic and practical correspondences',
        ],
      },
    },
  },
];

export default function AlchemicalScreen() {
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
    const witchUnlocked = isUnlocked('witchAlchemical') || isTest('witchAlchemical');
    const isLocked = !hasSubscription && !witchUnlocked;
    setIsWitchLocked(isLocked);

    if (!isLocked) {
      // If unlocked and no subscription, 5% chance to show an ad
      // Legacy ad chance removed
      navigation.navigate('PracticeDetail', { practice });
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
          <Text style={[styles.title, { color: textColor }]}>🌹 Alchemical</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Transmute your consciousness through the Great Work
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {FLOW_PRACTICES.map((practice) => (
              practice.isSpacer ? (
                <View key={practice.name} style={[styles.spacerContainer, { borderColor: mutedColor }]}>
                  <View style={[styles.spacerLine, { backgroundColor: mutedColor }]} />
                  <Text style={[styles.spacerText, { color: mutedColor }]}>{practice.name}</Text>
                  <View style={[styles.spacerLine, { backgroundColor: mutedColor }]} />
                </View>
              ) : (
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
              )
            ))}
          </View>
        </View>
      </ScrollView>

      <WitchLockOverlay
        witchType="Alchemical"
        lockKey="witchAlchemical"
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
  spacerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  spacerLine: {
    flex: 1,
    height: 2,
  },
  spacerText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 12,
    opacity: 0.6,
  },
});
