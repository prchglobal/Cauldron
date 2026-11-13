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
import AppodealService from '../AppodealService';
import {
  COMMUNICATION_METHODS,
  SPIRIT_TYPES,
  PROTECTION_SETUP,
} from '../data/spiritCommunicationDatabase';
import { ANGELS, DEMONS } from '../data/angelsAndDemonsDatabase';
import { EMOTIONAL_INTEGRATION, SHADOW_PRACTICES } from '../data/shadowWorkDatabase';
import { DREAM_TYPES, DREAM_PRACTICES } from '../data/dreamMagicDatabase';
import { PROTECTIVE_BINDS, JUSTICE_BANISHING } from '../data/bindsAndHexesDatabase';

const SPIRIT_PRACTICES = [
  {
    name: 'Ontology',
    isSpacer: true,
  },
  {
    name: 'Cosmic',
    emoji: '🪐',
    description: 'Alignment - Align with divine principle and universal consciousness',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Cosmic Alignment', emoji: '🔮', content: [
            { attribute: 'Function', value: 'Bridge between individual and universal consciousness; elevate awareness to perceive divine principles' },
            { attribute: 'Domain', value: 'Universal mind, divine principle, all-pervasive consciousness, transcendent and immanent realms' },
            { attribute: 'Quality', value: 'Unity consciousness, interconnection, correspondence, harmonic resonance with cosmic order' },
            { attribute: 'Interaction', value: 'Blends with all planets; operates through Mercury (communication), Jupiter (expansion), Neptune (dissolution of boundaries)' },
            { attribute: 'Timing', value: 'Full moon optimal for perception expansion; Jupiter hours for maximum resonance; year-round practice deepens connection' },
          ]},
          { name: 'Principles & Laws', emoji: '⚖️', content: [
            { attribute: 'Function', value: 'Teach universal laws governing all manifestation; reveal patterns underlying existence' },
            { attribute: 'Domain', value: 'Mental principle, law of correspondence, law of vibration, law of polarity, law of rhythm, law of cause and effect' },
            { attribute: 'Quality', value: 'Perfect order, divine wisdom, immutable truth, cosmic intelligence operating through all things' },
            { attribute: 'Interaction', value: 'Saturn teaches law and structure; Mercury reveals principles through study; Sun illuminates divine truth' },
            { attribute: 'Timing', value: 'Study during waxing moon for expanding understanding; Saturn return periods for deep principle integration' },
          ]},
          { name: 'Integration & Embodiment', emoji: '🧬', content: [
            { attribute: 'Function', value: 'Move cosmic principles from intellectual knowledge into lived embodiment and authentic transformation' },
            { attribute: 'Domain', value: 'Personal consciousness transformation, daily life application, authentic spiritual maturity' },
            { attribute: 'Quality', value: 'Integration, embodiment, authenticity, real transformation beyond conceptual understanding' },
            { attribute: 'Interaction', value: 'Venus governs integration through love and beauty; Mars through courage and action; Moon through emotional authenticity' },
            { attribute: 'Timing', value: 'Seasonal cycles support integration; personal yearly cycles identify integration readiness; full year minimum for foundation' },
          ]},
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'The Divine Principle & Unity', content: 'Hermetic philosophy teaches that all existence emanates from a singular Divine Principle—the Source, God, the All, or whatever name your tradition uses. This principle is both transcendent (beyond all forms) and immanent (pervading all existence). All manifestation—physical, mental, and spiritual—emerges from this single origin. Understanding Cosmic consciousness means recognizing your own consciousness as an expression of this universal principle. You are not separate from the Divine; you are the Divine experiencing itself through human form. This realization transforms practice from asking external powers for help to aligning yourself with the infinite consciousness that you already are. The Hermetic path involves progressively realizing this unity, not as intellectual knowledge but as lived experience.' },
          { heading: 'The Law of Correspondence', content: '\'As above, so below; as below, so above.\' This principle shows that patterns repeat at all scales—cosmic, planetary, psychological, cellular. The macrocosm (universe) and microcosm (individual) mirror each other. Understanding this principle means: patterns in the stars reflect patterns in your psychology, the structure of atoms mirrors the structure of solar systems, the cycles of the moon mirror menstrual and emotional cycles, the seasons reflect human life stages. Work with correspondence by: studying astrology to understand celestial influences, recognizing your inner planets (mental, emotional, spiritual aspects), aligning personal work with cosmic timing. This principle reveals that working on yourself IS working on the universe—they\'re not separate.' },
          { heading: 'Mental Principle: Reality as Mental', content: 'Hermetic teaching states that all reality is fundamentally mental—consciousness precedes matter. The universe is the thought of the Divine Mind manifesting as form. Your individual mind is a localized expression of this universal Mind. This means: your thoughts shape your reality, perception creates experience, consciousness is the fundamental substance of existence. Work with this principle by: observing how your thoughts create circumstances, taking responsibility for your mental patterns, deliberately directing thought toward desired outcomes, understanding that "real" includes both material and mental realms. The most powerful Hermetic practice is mental discipline—mastering your thoughts to master your reality.' },
          { heading: 'Vibrational Attunement', content: 'Everything vibrates at specific frequencies—thoughts, emotions, objects, beings. Higher vibrations are finer and faster (enlightenment, divine connection, love). Lower vibrations are denser and slower (matter, fear, hatred). Hermetic practice involves raising your vibration through: meditation and contemplation, ethical living, service to others, study of divine principles, artistic and creative expression. Higher vibration naturally aligns you with higher forces and principles. This is not moral judgment—lower vibrations aren\'t "bad," they\'re simply denser expressions of the divine. As you raise your vibration, you naturally attract higher-frequency experiences and guides. Cosmic consciousness practice involves progressively raising your vibration to perceive and align with higher principles.' },
          { heading: 'Perception of Divine Intelligence', content: 'Beyond individual consciousness exists Divine Intelligence—the universal mind operating through all existence. This intelligence: orders the cosmos perfectly, works through natural law, responds to alignment and invocation, expresses through all beings and forms. Developing perception of this intelligence means: noticing divine order in nature (how systems self-organize), recognizing synchronicities as expressions of intelligence, experiencing moments of knowing beyond rational thought, feeling connection to something infinitely greater than yourself. Hermetic practitioners cultivate this perception through: meditation on divine principles, contemplation of natural order, study of sacred geometry, recognition of unity underlying apparent diversity. As perception deepens, you experience direct contact with the intelligence animating all things.' },
          { heading: 'The Eternal Now', content: 'Hermetic understanding reveals that past, present, and future exist simultaneously in the eternal now from the divine perspective. Time is perception of sequence from within manifestation. From the perspective of cosmic consciousness, all moments exist at once. This understanding liberates you from: regret about past (it exists in a different frequency now), anxiety about future (it\'s already unfolding), limiting identification with personal history. Work with this principle by: healing past patterns through understanding they exist in a different vibrational frequency, trusting divine timing without anxiety about future, recognizing present moment as the only true power point. Advanced practice involves touching this eternal perspective through deep meditation and recognizing your true nature as consciousness existing outside time.' },
          { heading: 'Orientation: Elemental & Temporal Integration', content: 'The deepest Hermetic practice weaves together Elemental and Temporal work to create aligned action on all levels. Each element peaks during a specific season—this is not coincidence but divine correspondence. Fire Element peaks in Summer (June-September): This is the season for Fire invocations, bold action, initiating projects, and channeling will-based power. Work with Fire practices when Summer energy supports them. Water Element peaks in Winter (December-March): This is the season for Water depth, emotional processing, intuitive development, and receiving. Winter\'s darkness naturally supports Water\'s introspective, receptive work. Air Element peaks in Spring (March-June): This is the season for Air clarity, learning, communication, planning, and mental work. Spring\'s fresh growth naturally supports Air\'s expansive, discriminating energy. Earth Element peaks in Fall (September-December): This is the season for Earth grounding, manifestation, harvesting results, building foundations, and embodying stability. Fall\'s completion naturally supports Earth\'s work of form-taking. Integrated practice: Choose which element to develop based on current season (work with Water in winter, Fire in summer, etc.). This removes friction and maximizes effectiveness. Study the Temporal cycles (lunar, seasonal, personal) and align your elemental practice to peak times. Invoke Fire on Mars days during Summer for amplified power. Develop Water during Winter\'s full moon for deepened intuition. This integration of Elemental (what to work with) and Temporal (when to work with it) creates the master practice where small effort creates maximum results. This is working WITH cosmic order rather than against it.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Begin with study: read The Kybalion or similar Hermetic texts to understand foundational principles',
          'Start meditation practice—begin with 5-10 minutes daily, focusing on observing your thoughts without judging',
          'Contemplate "As above, so below"—observe how patterns repeat in your own life and natural world',
          'Keep thought journal for one week, noting how your thoughts create your circumstances',
          'Practice mental discipline: catch yourself during reactive thinking, choose your thought response consciously',
          'Study astrology basics—learn your birth chart to understand your inner cosmos',
          'Create altar reflecting cosmic principles—include representations of elements, planets, sacred geometry',
          'Practice raising vibration through service—spend time helping others or supporting nature',
          'Begin daily affirmation: "I align with divine consciousness. I am an expression of the infinite."',
          'Join community or study group—Hermetic practice benefits from shared inquiry and discussion'
      ],
      },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Intellectual Understanding ≠ Realization', text: 'Study and intellectual grasp of Hermetic principles differ from lived realization. Both matter—study provides map, practice provides experience. Don\'t get stuck in concepts.' },
          { title: 'Mental Discipline Takes Time', text: 'Mastering your mind through Hermetic practice is lifelong work. Be patient with yourself. Small consistent effort creates profound transformation over time.' },
          { title: 'Synchronicity is Communication', text: 'As you raise vibration and align with divine principles, synchronicities increase. These aren\'t coincidence—they\'re the universe responding to your alignment. Notice and trust them.' },
          { title: 'Service Raises Vibration Fastest', text: 'The quickest path to raising vibration isn\'t meditation—it\'s service and love toward others. Caring for people, animals, or nature naturally raises frequency and connects you to divine intelligence.' },
          { title: 'Integration Matters More Than Experience', text: 'Mystical experiences (visions, expanded consciousness, unity states) are signposts, not destinations. Integrate insights into daily life or they create inflation without transformation.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Kybalion: Hermetic Philosophy by Three Initiates',
          'The Hermetica: The Lost Wisdom of the Pharaohs by Timothy Freke & Peter Gandy',
          'As Above, So Below by Alan E. Rayner (correspondence principle)',
          'Sacred Geometry and Hermetic Cosmology study materials',
          'Meditations on Hermetic Principles and divine consciousness'
        ],
      },
    },
  },
  {
    name: 'Elemental',
    emoji: '🌍',
    description: 'Nature - Master the four elements to balance your consciousness',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Fire Element', emoji: '🔥', content: [
            { attribute: 'Quality', value: 'Experiential mode: Active, purposeful ignition; felt as warmth, inspiration, and catalytic urgency; manifests as will-driven momentum' },
            { attribute: 'Expression', value: 'Emotional tone: Passion, courage, intensity, divine wrath; moves toward action; builds energy through excitement and determination' },
            { attribute: 'Interaction', value: 'Blending: Transforms Water into steam (vision), animates Air into wind (momentum), energizes Earth into growth; Conflict: Consumed by Water (doubt), scattered by excessive Air (restlessness), dulled by Earth resistance' },
            { attribute: 'Dominance', value: 'Elemental bias: Excess creates aggression, burnout, recklessness; all-consuming drive without reflection; scorches relationships and resources; impatience overrides wisdom' },
            { attribute: 'Correction', value: 'Balancing practice: Meditate on cool water or ocean to temper intensity; practice listening and receptivity; work with Water element deliberately; journal on consequences before action' },
            { attribute: 'Stabilization', value: 'Sustained equilibrium: Develop consistent daily Fire practice (small intentions daily); use Mars energy purposefully in scheduled times; channel passion through creative outlets; build community with Air element for shared vision' },
          ]},
          { name: 'Water Element', emoji: '💧', content: [
            { attribute: 'Quality', value: 'Experiential mode: Receptive, flowing sensitivity; felt as openness, emotional texture, and subtle knowing; manifests as adaptability and intuitive response' },
            { attribute: 'Expression', value: 'Emotional tone: Compassion, empathy, tenderness, sorrow; moves toward connection; dissolves boundaries; seeks understanding and emotional harmony' },
            { attribute: 'Interaction', value: 'Blending: Softens Fire into warmth (balance), carries Air as breath on waves (communication), nourishes Earth into fertility (growth); Conflict: Overwhelmed by Fire (steam/loss), scattered by Air currents (confusion), stagnates without Earth movement' },
            { attribute: 'Dominance', value: 'Elemental bias: Excess creates victim mentality, emotional overwhelm, boundary dissolution; absorbed by others\' emotions; unable to take decisive action; lost in dreams without grounding' },
            { attribute: 'Correction', value: 'Balancing practice: Ground with Earth element (bare feet, gardening); practice clear Fire-based boundaries; journal feelings to clarify rather than drown; work with Moon cycles to process rather than suppress' },
            { attribute: 'Stabilization', value: 'Sustained equilibrium: Establish regular Water rituals (baths, tea ceremony); honor emotional cycles without being controlled by them; develop emotional literacy; balance receiving with discernment; create safety containers for depth' },
          ]},
          { name: 'Air Element', emoji: '💨', content: [
            { attribute: 'Quality', value: 'Experiential mode: Expansive, analytical clarity; felt as light, spaciousness, and rapid connection; manifests as discrimination and inspired thought' },
            { attribute: 'Expression', value: 'Emotional tone: Curiosity, joy in learning, intellectual excitement; moves toward understanding; detaches to see clearly; seeks truth and connection of ideas' },
            { attribute: 'Interaction', value: 'Blending: Clarifies Fire\'s direction (vision), carries Water\'s knowing (intuitive understanding), uplifts Earth perspective (new possibilities); Conflict: Ignited into storm by excess Fire (overwhelm), dissipates Water\'s depth (over-analysis), scatters Earth\'s focus (unrealistic fantasy)' },
            { attribute: 'Dominance', value: 'Elemental bias: Excess creates dissociation, paralysis through analysis, disconnection from body; endless theorizing without application; inability to commit; relationships seem surface-level' },
            { attribute: 'Correction', value: 'Balancing practice: Ground with Fire (focused intention); connect with Water (feel intuitive knowing); work with body awareness; practice silence and inner listening; journal on what must be applied not just understood' },
            { attribute: 'Stabilization', value: 'Sustained equilibrium: Balance study with embodiment; speak and teach intentionally; create regular silence/meditation practice; integrate learning into action; cultivate wisdom (Air + Earth + Water + Fire united)' },
          ]},
          { name: 'Earth Element', emoji: '🌍', content: [
            { attribute: 'Quality', value: 'Experiential mode: Stable, concrete, material presence; felt as density, substance, and reliability; manifests as slow build and manifestation into form' },
            { attribute: 'Expression', value: 'Emotional tone: Steady commitment, loyalty, groundedness, pragmatism; moves toward building; provides foundation; seeks security and lasting value' },
            { attribute: 'Interaction', value: 'Blending: Receives Fire\'s will into form (creation), holds Water\'s depth (stability), grounds Air\'s vision (practical reality); Conflict: Resists Fire\'s transformation (rigidity), absorbs Water stagnantly (density), blocks Air\'s movement (limitation)' },
            { attribute: 'Dominance', value: 'Elemental bias: Excess creates inertia, materialism, inability to change; over-attachment to physical form; spiritual disconnection; resistance to growth; rigid thinking' },
            { attribute: 'Correction', value: 'Balancing practice: Work with Fire element (intentional transformation); connect to Air perspective (new possibilities); practice flexibility; meditate on impermanence; engage in creative play alongside structure' },
            { attribute: 'Stabilization', value: 'Sustained equilibrium: Create regular grounding practice (nature, gardening, body work); balance structure with flexibility; build slowly with intention; tend what you\'ve created; remember Earth sustains all—honor its role without over-dependence' },
          ]},
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'The Four Elements in Hermetic Tradition', content: 'The four elements—Fire, Water, Air, and Earth—are the fundamental expressions of divine principle manifesting into form. Each element represents a level of consciousness and a quality of manifestation: Fire (will, initiation, transformation, spirit), Water (emotion, intuition, flow, soul), Air (intellect, communication, thought, mind), Earth (manifestation, physicality, grounding, body). The elements aren\'t just physical—they\'re principles of consciousness and action. Fire initiates, Water adapts, Air communicates, Earth grounds. Hermetic practice involves working consciously with these elements within yourself and in the world. Mastering each element represents development through stages of consciousness—from raw physical (Earth), through emotional (Water), mental (Air), to spiritual will (Fire).' },
          { heading: 'Fire: The Principle of Will & Transformation', content: 'Fire represents divine will, transformation, and initiation. It\'s the spark of consciousness, the driving force of creation, the purifying force. Work with Fire by: developing strong will toward your goals, taking decisive action, releasing what no longer serves (through ritual fire), facing fears that prevent transformation, channeling anger into purposeful power, connecting with your life purpose and passion. Fire is masculine, active, assertive energy. In the body, it represents metabolism, sexual energy, and personal power. Fire practice involves: lighting candles with intention, meditating on transformation, practicing courage, channeling creative passion. Fire energy without wisdom becomes destructive; Fire combined with consciousness becomes unstoppable manifestation power.' },
          { heading: 'Water: The Principle of Emotion & Intuition', content: 'Water represents emotion, intuition, psychic ability, and the flow of life. It\'s the principle of adaptation, receptivity, and emotional depth. Work with Water by: developing intuitive perception, flowing with change, allowing emotions to surface and integrate, developing psychic sensitivity, trusting inner knowing over logic, serving others with compassion. Water is feminine, receptive, flowing energy. In the body, it represents fluids, emotional processing, and sexual pleasure. Water practice involves: meditation with water, cleansing rituals, working with lunar cycles, developing dream work, practicing forgiveness and release. Water without wisdom becomes stagnation and emotional overwhelm; Water combined with consciousness becomes profound empathy and psychic mastery.' },
          { heading: 'Air: The Principle of Intellect & Communication', content: 'Air represents intellect, communication, thought, and clarity of mind. It\'s the principle of connection, discrimination, and understanding. Work with Air by: developing clear thinking and mental discipline, improving communication, studying and learning, discriminating between what\'s true and illusory, connecting ideas and people, speaking your truth powerfully. Air is masculine, active, expansive energy. It represents the rational mind and verbal expression. Air practice involves: meditation on clarity, study of sacred texts, journaling, speaking affirmations, practicing mindfulness of thought. Air without wisdom becomes confusion and excessive mental activity; Air combined with consciousness becomes penetrating wisdom and inspiring teaching.' },
          { heading: 'Earth: The Principle of Manifestation & Grounding', content: 'Earth represents physicality, manifestation, grounding, and material reality. It\'s the principle of form-taking, stability, and embodiment. Work with Earth by: grounding yourself in your body and physical reality, manifesting intentions into material form, building solid foundations, developing physical discipline and health, serving your community, caring for nature. Earth is feminine, receptive, stable energy. Earth practice involves: time in nature, gardening, working with stones and crystals, physical exercise and body awareness, creating prosperity consciousness. Earth without wisdom becomes materialism and rigidity; Earth combined with consciousness becomes stable mastery and genuine abundance.' },
          { heading: 'Balancing & Harmonizing Elements', content: 'Most people are naturally stronger in some elements and weaker in others (based on birth chart and conditioning). Hermetic practice involves developing all four elements to balance your consciousness. Too much Fire without Water becomes aggression; Water without Air becomes stagnation; Air without Earth becomes unrealistic fantasy; Earth without Fire becomes inertia. Working with weak elements develops your consciousness more than strengthening already-strong ones. Practice all elements: Fire gives you will, Water gives you intuition, Air gives you understanding, Earth gives you grounding. The goal is integrated mastery where all four elements work together harmoniously. This creates the complete human capable of manifesting anything on all levels of being.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Determine your elemental strengths by examining your birth chart or taking elemental assessment',
          'Practice feeling each element: sit with fire (flame), water (immerse hands or meditate by water), air (notice breath/wind), earth (bare feet on ground)',
          'Work first with your weakest element to develop balanced consciousness across all four',
          'Create altar space with representations of all four elements—candle (Fire), water (Water), incense (Air), salt/crystal (Earth)',
          'Practice element meditation—spend week focusing on each element, 10 minutes daily visualization and embodied feeling',
          'Journal about qualities of each element in your life: "My Fire shows as...", "My Water shows as..."',
          'Perform simple ritual with each element—light candle with intention (Fire), pour water consciously (Water), speak affirmation (Air), plant seed (Earth)',
          'Study elemental correspondences in your tradition—colors, directions, symbols, divine names, body parts',
          'Notice which element you naturally use in reactions and deliberately practice using other elements',
          'Create monthly practice rotating focus through the four elements over seasonal cycles'
      ],
      },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Elements Work Together', text: 'Don\'t develop only Fire (will without compassion becomes tyranny). Develop weakest elements first. Balanced elements create wisdom; imbalanced create problems.' },
          { title: 'Respect Element Nature', text: 'Each element has natural properties. Fire burns, Water dissolves, Air scatters, Earth grounds. Work WITH their nature, not against it. This is the Hermetic principle of working with natural law.' },
          { title: 'Seasonal Cycles Support Elements', text: 'Fire peaks in summer, Water in winter, Air in spring, Earth in fall. Work with elements during their seasons for amplified effect. Hermetic practice aligns with natural cycles.' },
          { title: 'Personal Elements in Birth Chart', text: 'Your birth chart shows your natural elemental distribution. This isn\'t destiny—it\'s where you start. Conscious work develops underdeveloped elements.' },
          { title: 'Balance Prevents Extremes', text: 'Excess Fire creates aggression, excess Water creates victim mentality, excess Air creates dissociation, excess Earth creates stagnation. Regular balancing prevents these imbalances from manifesting.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Kybalion: The Hermetic Principle of as Above, So Below',
          'Elements of the Qabala by Gareth Knight (Hermetic elemental correspondences)',
          'Golden Dawn elemental knowledge and attribution system',
          'Astrology books focusing on elemental balance in birth charts',
          'Ritual magic texts on invoking and balancing elemental forces'
      ],
      },
    },
  },
  {
    name: 'Temporal',
    emoji: '⏳',
    description: 'Timing - Work with cycles and rhythms to align with divine timing',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Lunar Cycles', emoji: '🌙', content: [
            { attribute: 'Cycles', value: 'Recurring patterns: 29.5-day lunar month (new→waxing→full→waning→new); repeats predictably every month; emotionally synchronized with menstrual cycles; connects individual to universal rhythm' },
            { attribute: 'Rhythms', value: 'Energetic flow: New moon—inward, introspective, planting intentions; Waxing—outward momentum, growth, building; Full moon—culmination, illumination, maximum visibility; Waning—release, banishing, completion' },
            { attribute: 'Moments', value: 'Peak windows: Full moon is strongest for manifestation rituals (48-72 hours); New moon strongest for intention-setting; Quarter moons for course correction; Eclipses create amplified transformation windows' },
            { attribute: 'Duration', value: 'Influence length: Each lunar phase affects ~7 days before showing obvious effect; full cycle takes 29.5 days for complete influence; personal sensitivity varies; water element carries lunar influence most strongly' },
            { attribute: 'Decay', value: 'Diminishing effect: Intentions set during waning moon lose power (release phase active); manifestations started after full moon diminish (cycle turning inward); effectiveness requires alignment with phase—fighting phase wastes energy' },
          ]},
          { name: 'Seasonal Rhythms', emoji: '🍂', content: [
            { attribute: 'Cycles', value: 'Recurring patterns: 4 seasons (~90 days each); annual solar year; life organized around seasonal return; Spring→Summer→Autumn→Winter in continuous renewal; connects personal projects to planetary cycles' },
            { attribute: 'Rhythms', value: 'Energetic flow: Spring (Air/Mercury)—initiation, new growth, planning; Summer (Fire/Mars)—manifestation, action, peak energy; Autumn (Water/Venus)—harvest, gratitude, completion; Winter (Earth/Saturn)—rest, integration, inner work' },
            { attribute: 'Moments', value: 'Peak windows: Equinoxes (Spring/Autumn) create balance points optimal for major decisions; Solstices (Summer/Winter) create extreme points—summer solstice for maximum visibility, winter for deep inner work' },
            { attribute: 'Duration', value: 'Influence length: Each season affects full 90 days; projects started in optimal season move effortlessly; starting against season adds resistance; effects cumulative—year of aligned seasons creates major life shift' },
            { attribute: 'Decay', value: 'Diminishing effect: Pushing hard during rest season (winter) exhausts without results; forcing growth in dormant season wastes energy; seasonal resistance increases difficulty exponentially; alignment removes all friction' },
          ]},
          { name: 'Personal & Life Cycles', emoji: '⏳', content: [
            { attribute: 'Cycles', value: 'Recurring patterns: 7-year cycles mark major life transitions; personal rhythms (daily, weekly, monthly specific to you); life stages (childhood, young adult, midlife, elder—each 7-9 years); Saturn return every 29 years signals major recalibration' },
            { attribute: 'Rhythms', value: 'Energetic flow: Birth chart shows natural elemental flow; progressed planets track evolution; personal cycles visible through journal tracking; life stage determines capacity for work vs integration; some years naturally productive, others introspective' },
            { attribute: 'Moments', value: 'Peak windows: Saturn return (age 29, 58, 87) creates transformation threshold; 7-year cycle endings mark completion points; personal birthday initiates new yearly cycle; progressions create timing readiness for specific life changes' },
            { attribute: 'Duration', value: 'Influence length: 7-year cycles shape entire era of life; life stage influences persist 7-9 years; Saturn return effects span 2-3 year transition period; personal rhythms discovered through 1-2 year tracking; long-term patterns reveal destiny timing' },
            { attribute: 'Decay', value: 'Diminishing effect: Resisting necessary 7-year transition creates stagnation and illness; ignoring life stage requirements creates mismatch (trying to manifest as if still in growth stage during integration stage); denial of personal cycle wastes decades of potential' },
          ]},
          { name: 'Correction', emoji: '🔄', content: [
            { attribute: 'Timing', value: 'Adjustment window: Correction operates through observation over time—patterns must be seen before they can be corrected; deviation from optimal rhythm must first be recognized before adjustment can begin; correction occurs at natural transition points (quarter moons, season shifts, cycle endings)' },
            { attribute: 'Cycles', value: 'Feedback loops: Every cycle contains built-in correction mechanisms; waning moon corrects excesses of waxing; autumn corrects summer\'s over-extension; the Law of Rhythm ensures swings compensate; resistance to natural correction creates compounded deviation' },
            { attribute: 'Adjustment', value: 'Course modification: Correction responds to rhythm—adjust pacing when moving too fast or slow; respond to duration—extend or contract effort based on results; attend to escalation—recognize when intensity serves or harms; apply withdrawal—strategic retreat when continuation damages' },
            { attribute: 'Correction', value: 'Enacted after deviation: Correction is not prevention but response—it follows observed misalignment; effective correction requires honest assessment of where you are versus where you intended; correction is enacted through changed behavior, not just changed intention; the sooner deviation is acknowledged, the smaller the correction required' },
          ]},
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'The Hermetic Law of Rhythm', content: 'Everything oscillates between extremes—this is the Law of Rhythm. Hermetic principle teaches that swings always compensate—high tide is followed by low tide, action by reaction, growth by contraction. Understanding rhythm means recognizing that your current circumstance will shift. During difficult times, knowing that rhythm will swing is hope. During good times, knowing that rhythm will compensate prevents excess and pride. Work with rhythm by: not resisting natural cycles, planting during growth phases and harvesting during contraction, understanding that all circumstances are temporary, preparing for transitions before they occur, maintaining equilibrium rather than pursuing extremes. Mastering rhythm is mastering life itself—it\'s the difference between being tossed by waves and surfing them consciously.' },
          { heading: 'Cycles: Lunar, Solar, Seasonal', content: 'Time flows in nested cycles: daily (sunrise to sunset), lunar (new moon to new moon, 29.5 days), seasonal (equinoxes and solstices, 90 days), yearly (one solar return), and longer cycles (7-year cycles, 12-year cycles, longer progressions). Hermetic practice means aligning work with appropriate cycles. Lunar cycle: New moon is seed planting (initiation), waxing moon is growth (action), full moon is culmination (illumination), waning moon is release (banishing). Seasonal cycle: Spring is initiation and beginning, Summer is full manifestation, Autumn is harvest and gratitude, Winter is rest and integration. Solar cycle: Each day has morning (birth), afternoon (growth), evening (culmination), night (rest). Work WITH these cycles rather than against them.' },
          { heading: 'Personal Cycles & Rhythms', content: 'Beyond universal cycles, you have personal rhythm patterns. Some people are morning people (Fire), some night owls (Water). Some are more productive in spring (Air), others in autumn (Earth). Women have menstrual cycles (if present) synchronizing naturally with lunar cycle—aligning work with menstrual phases magnifies effect. There are life cycles: childhood (learning), young adulthood (manifestation), midlife (integration and wisdom), elder years (transmission). Hermetic practitioners map their personal cycles and work consciously with them. Fight your natural rhythm and you exhaust yourself fighting against the divine pattern that animates you. Align with your rhythm and you flow effortlessly.' },
          { heading: 'Working with Seasons Consciously', content: 'Spring (Air, initiation, beginning, new growth): plant seeds, begin projects, cleanse and prepare. Summer (Fire, manifestation, action, full power): push forward on goals, take bold action, create visibility. Autumn (Water, harvest, gratitude, release): gather results, give thanks, complete cycles, prepare for rest. Winter (Earth, rest, integration, gestation): stop external activity, go inward, reflect on year, restore and heal. Many people work against seasons (pushing hard in winter, being lazy in spring). Hermetic practice means aligning effort with seasonal energy. Spring is easy time to start (momentum available). Winter is not the time to push—respect the season and go within. This isn\'t laziness—it\'s working with divine order.' },
          { heading: 'Death & Rebirth: The Eternal Rhythm', content: 'The greatest rhythm is death and rebirth. Everything dies and is reborn—physically, metaphorically, spiritually. Every ending is a beginning. Fears around endings (job loss, relationship ending, moving) often block necessary transformations. Hermetic wisdom recognizes that trying to hold onto a dying form prevents birth of what\'s emerging. Work with this rhythm by: accepting endings gracefully when their time comes, trusting the void between death and rebirth, maintaining faith that what\'s meant for you will emerge, using ritual to consciously mark and honor transitions. Understanding that all death leads to rebirth transforms your relationship with change—fear diminishes and courage increases.' },
          { heading: 'Reading Time: Discerning Cycles & Timing', content: 'Hermetic practitioners develop ability to read timing—understanding whether you\'re in planting phase, growing phase, harvest phase, or rest phase. This applies to personal goals, relationships, projects, and spiritual work. Signs of planting phase: uncertain energy, need for intention-setting, small visible progress but real foundation building. Growing phase: momentum increasing, visible progress, energy feels outward and expanding. Harvest phase: results manifest, completion visible, time to gather and give thanks. Rest phase: fatigue despite success, diminishing progress even with effort, internal focus, need for integration. Many mistakes come from wrong timing—pushing in rest phase or stopping during growth phase. Developing discernment about timing transforms effectiveness dramatically.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Track the lunar cycle for one full month: note new moon, first quarter, full moon, last quarter',
          'During each lunar phase, journal about the energy you feel and what phase you\'re in (personal cycle)',
          'Map your personal daily rhythm: note when you naturally have energy, focus, and creativity',
          'Attempt to start new project during growing moon phase and notice ease compared to other times',
          'Track the four seasons in your location: note equinoxes and solstices, how they affect your energy',
          'Align one intention with spring (new beginning) and one with winter (integration) and observe results',
          'Create calendar showing your personal rhythms, lunar cycles, and seasonal energy',
          'Practice reading timing: in current situation, are you planting (new project), growing (pushing forward), harvesting (gathering results), or resting (integrating)?',
          'Work consciously with appropriate phase rather than forcing against it—observe reduced resistance',
          'Over one year, experience all seasons and cycles consciously to internalize Hermetic rhythm principle'
      ],
    },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Rhythm is Constant', text: 'You can\'t prevent rhythm or skip phases. Working against rhythm exhausts and frustrates. Always better to align with cycle even if timing isn\'t what you wanted.' },
          { title: 'Know Your Personal Cycle', text: 'Universal cycles (lunar, seasonal) affect everyone, but personal cycles vary. Map yours. What feels impossible in winter might feel effortless in spring for you.' },
          { title: 'Discern Phase Accurately', text: 'Misreading your current phase is common. Pushing hard during harvest phase (when you should gather) prevents completion. Resting during growth phase prevents progress.' },
          { title: 'Trust the Process', text: 'Hermetic principle teaches that timing works perfectly when you trust rhythm. Resist urge to force outcomes in wrong season. What\'s meant for you will arrive in right season.' },
          { title: 'Record Cycle Patterns', text: 'Keep documentation of your cycles, projects, and outcomes. Over time, patterns become obvious and you can predict and work with them intentionally.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Kybalion: The Hermetic Principle of Rhythm',
          'Astrology and the Collective Unconscious by Carl Jung (cycles)',
          'Lunar gardening and farming by phase (application of principles)',
          'Women\'s Circles: Sacred Menstrual Cycle Practice',
          'Calendar apps tracking lunar and seasonal cycles'
      ],
      },
    },
  },
  {
    name: 'Engagement',
    isSpacer: true,
  },
  {
    name: 'Balance',
    emoji: '⚖️',
    description: 'Equilibrium - The governing principle that conditions all Hermetic engagement',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Universal Governance', emoji: '🌐', content: [
            { attribute: 'Scope', value: 'Balance governs all Hermetic engagement modes simultaneously—it is not nested within any single domain but conditions every operation; Cosmic, Elemental, Temporal, Invocation, Talismans, and Orientation all require balance to function' },
            { attribute: 'Principle', value: 'The Hermetic Law of Polarity teaches that everything exists in paired opposites; Balance is the conscious navigation between poles without collapsing into either extreme; mastery is maintaining equilibrium while allowing necessary swings' },
            { attribute: 'Necessity', value: 'Violating balance breaks every operation regardless of method—unbalanced Invocation attracts chaos, unbalanced Talismans manifest distortion, unbalanced Cosmic work produces inflation, unbalanced Elemental work produces instability' },
            { attribute: 'Practice', value: 'Balance is maintained through: continuous self-observation, regular assessment of all polarities in your work, willingness to compensate when you swing too far, and acceptance that perfect balance is dynamic process not static achievement' },
          ]},
          { name: 'Cosmic Conditioning', emoji: '🪐', content: [
            { attribute: 'Application', value: 'Balance conditions Cosmic forces by preventing inflation (over-identification with divine) and deflation (denial of connection); healthy Cosmic work requires grounded humility alongside expanded awareness' },
            { attribute: 'Warning', value: 'Unbalanced Cosmic engagement produces spiritual bypassing—using transcendent experience to avoid embodied responsibility; or materialism—denying the reality of consciousness beyond physical' },
            { attribute: 'Equilibrium', value: 'Balanced Cosmic practice: expand into universal consciousness while remaining present in your body; perceive divine principle while honoring human limitation; experience unity while maintaining functional ego' },
            { attribute: 'Signs', value: 'Imbalance shows as: grandiosity, messianic thinking, inability to function in ordinary life, dissociation, or conversely—cynicism, materialism, denial of spiritual experience, flatness' },
          ]},
          { name: 'Elemental Conditioning', emoji: '🌍', content: [
            { attribute: 'Application', value: 'Balance conditions Elemental forces by ensuring no single element dominates—Fire without Water becomes aggression, Water without Fire becomes passivity, Air without Earth becomes fantasy, Earth without Air becomes rigidity' },
            { attribute: 'Warning', value: 'Unbalanced Elemental work amplifies your existing imbalances rather than correcting them; working only with preferred elements deepens dysfunction; avoiding challenging elements prevents growth' },
            { attribute: 'Equilibrium', value: 'Balanced Elemental practice: develop all four elements, especially your weakest; blend elements appropriately for each working; recognize when one element has become excessive and compensate' },
            { attribute: 'Signs', value: 'Imbalance shows as: burnout (excess Fire), emotional flooding (excess Water), disconnection (excess Air), stagnation (excess Earth), or deficiency in any element produces its opposite as shadow' },
          ]},
          { name: 'Operational Conditioning', emoji: '⚡', content: [
            { attribute: 'Invocation Balance', value: 'Balanced Invocation: invoke with respect not demand, receive with discernment not naivety, maintain boundaries while remaining open, close operations cleanly; Imbalanced: obsessive calling, possession states, entity attachment, or conversely—no real contact, empty ritual' },
            { attribute: 'Talisman Balance', value: 'Balanced Talisman work: charge with clear intention, maintain without obsession, use without dependence, release when purpose is served; Imbalanced: magical thinking, superstitious attachment, loss of agency, or conversely—dead objects with no potency' },
            { attribute: 'Orientation Balance', value: 'Balanced Orientation: appropriate positioning for each working, flexible response to changing conditions, awareness of direction without rigidity; Imbalanced: compulsive directional behavior, anxiety when not aligned, or conversely—careless positioning that weakens work' },
            { attribute: 'Integration', value: 'All Hermetic operations require balance between active and receptive, forcing and allowing, precision and flow; the master practitioner maintains dynamic equilibrium across all methods simultaneously' },
          ]},
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Balance as Meta-Principle', content: 'Balance is not one principle among many—it is the meta-principle that conditions all others. The Kybalion teaches that polarity is universal: everything has its pair of opposites, and opposites are identical in nature but different in degree. Balance is the conscious navigation of this polarity. Without balance, every Hermetic operation distorts. Cosmic work without balance produces inflation or deflation. Elemental work without balance amplifies dysfunction. Invocation without balance creates attachment or emptiness. Talisman work without balance generates superstition or impotence. Orientation without balance becomes compulsion or carelessness. The master practitioner maintains balance across all operations simultaneously—this is why Balance cannot be nested within any single domain. It governs everything equally.' },
          { heading: 'The Law of Compensation', content: 'The Hermetic Law of Rhythm includes the principle of compensation: every swing in one direction is compensated by a swing in the other. This is automatic and universal—you cannot escape it. However, the master learns to use this law consciously: by recognizing when you have swung too far in one direction, you can consciously initiate compensation before the automatic swing becomes destructive. Balance work means: tracking your swings across all polarities, recognizing the early signs of excess, initiating correction before crisis forces it, accepting that dynamic movement between poles is healthy while extreme fixation at either pole is pathology. The balanced practitioner rides the rhythm consciously rather than being thrown by it unconsciously.' },
          { heading: 'Maintaining Balance Across Domains', content: 'Practical balance requires simultaneous attention to multiple polarities: expansion/contraction, activity/receptivity, precision/flow, force/surrender, individual/universal, spiritual/material, internal/external. Each Hermetic operation has its specific balance requirements. Cosmic work balances transcendence with embodiment. Elemental work balances the four elements with each other. Temporal work balances action phases with rest phases. Invocation balances calling with receiving. Talisman work balances charging with releasing. Orientation balances precision with flexibility. The advanced practitioner develops intuitive balance—sensing when any polarity is becoming extreme and adjusting automatically. This is cultivated through years of conscious attention to balance in all operations.' },
          { heading: 'Signs of Imbalance', content: 'Imbalance manifests predictably: Cosmic imbalance shows as grandiosity, spiritual bypassing, dissociation, or conversely materialism and spiritual deadness. Elemental imbalance shows as burnout, flooding, dissociation, or stagnation depending on which element is excessive or deficient. Temporal imbalance shows as burnout from ignoring rest cycles, stagnation from missing action windows, or chaos from fighting natural rhythms. Invocation imbalance shows as obsession, possession, entity problems, or conversely empty ritual with no contact. Talisman imbalance shows as magical thinking, object dependence, superstition, or dead talismans with no power. The honest practitioner regularly assesses all these domains for signs of imbalance and initiates correction before problems compound.' },
          { heading: 'Cultivating Dynamic Balance', content: 'Balance is not static equilibrium—it is dynamic responsiveness. The goal is not to eliminate swings but to ride them consciously. Perfect balance would be lifeless stasis; healthy balance is living movement within appropriate range. Cultivation practices: regular self-assessment across all polarities, tracking your tendencies toward specific imbalances, working consciously with your weak sides, accepting feedback from others about your blind spots, using ritual to invoke balance when you sense drift, maintaining practices that ground and center regardless of circumstances. The master of balance appears effortless—but this ease comes from decades of conscious attention to equilibrium in every aspect of practice. Balance is the foundation that makes all other Hermetic work effective.' },
        ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Map your elemental balance: which elements are naturally strong, which are weak in you?',
          'Track your polarities for one week: when do you swing toward excess in any direction?',
          'Identify your typical imbalance patterns: where do you tend to go too far?',
          'Practice compensation: when you notice excess, consciously initiate the opposite',
          'Assess balance across all your Hermetic work: Cosmic, Elemental, Temporal, Invocation, Talisman, Orientation',
          'Notice when you are most prone to imbalance: stress, success, transition periods?',
          'Develop a daily centering practice that restores equilibrium',
          'Seek feedback from others about your blind spots regarding balance',
          'Study the Hermetic Laws of Polarity, Rhythm, and Compensation in depth',
          'Integrate balance consciousness into every magical operation you perform',
      ]},
      tips: { title: 'Tips for Practice', items: [
          { title: 'Balance Is Dynamic, Not Static', text: 'Don\'t aim for perfect stillness—aim for responsive equilibrium. The goal is riding the rhythm consciously, not eliminating all movement between poles.' },
          { title: 'Work Your Weak Side', text: 'Your comfort zone often represents imbalance. Deliberately practice with elements, approaches, and polarities you naturally avoid. Growth happens at the edges of comfort.' },
          { title: 'Track Before Correcting', text: 'Spend time observing your patterns before trying to fix them. A week of honest tracking reveals more than years of blind correction attempts.' },
          { title: 'Small Corrections Early', text: 'The earlier you notice imbalance, the smaller the correction needed. Catching a 5% drift requires minimal effort; catching a 50% swing requires crisis management.' },
          { title: 'Balance Applies to Balance Work', text: 'Don\'t become obsessive about balance itself. Excessive focus on equilibrium is its own imbalance. Hold balance lightly while taking it seriously.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Kybalion: Hermetic Laws of Polarity, Rhythm, and Compensation',
          'The Middle Pillar by Israel Regardie (balancing work)',
          'Astrology texts on elemental balance in the birth chart',
          'Jungian texts on the union of opposites (coniunctio)',
          'Traditional Chinese Medicine: Five Element balance theory'
      ],
      },
    },
  },
  {
    name: 'Invocation',
    emoji: '📢',
    description: 'Engagement - Invoke divine principles to manifest alignment and change',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Divine Principles to Invoke', emoji: '✨', content: [
            { attribute: 'Attunement', value: 'Internal tuning: Clear your inner channels through meditation, cleansing, and mental discipline; quiet the mind to perceive divine frequency; raise your vibration through service, ethics, and conscious living; remove blocks and resistance in yourself first' },
            { attribute: 'Alignment', value: 'Macrocosmic matching: Study the principle you wish to invoke (research, contemplation, study); understand how this principle manifests in nature and cosmos; recognize how it already exists within you; align your will with divine will (surrender, not force)' },
            { attribute: 'Invitation', value: 'Non-coercive call: Invite the principle through sincere request, not demand; speak or chant with authentic desire and humility; invite with openness to whatever form the principle takes; avoid commanding—you cannot control divine, only align with it' },
            { attribute: 'Sustainment', value: 'Resonance holding: Maintain the frequency through consistent practice and attention; repeat invocation daily or during optimal planetary timing; feed the invocation through action aligned with the principle; hold the image/feeling in your consciousness' },
            { attribute: 'Release', value: 'Clean disengagement: Trust the principle to work after invocation—release attachment to specific outcome; stop forcing or controlling after you\'ve invited; allow natural manifestation to unfold; close the invocation consciously when work is complete' },
          ]},
          { name: 'Invocation Methods', emoji: '🕯️', content: [
            { attribute: 'Attunement', value: 'Internal tuning: Breathwork and pranayama to clear blocked channels; meditation to quiet mind chatter; body awareness to release tension; emotional clearing through journaling or ritual; fasting or dietary shifts to raise vibration' },
            { attribute: 'Alignment', value: 'Macrocosmic matching: Use planetary hours (invoke Love on Venus hour, Wisdom on Mercury hour); work during optimal lunar phases (waxing for growth, full for culmination); align ritual to seasonal energies; use divine names that resonate with principle' },
            { attribute: 'Invitation', value: 'Non-coercive call: Mantra/chant repeated with feeling (not mechanical); visualization held as clearly as possible with emotional authenticity; prayer spoken aloud with genuine desire; ritual actions (lighting candles, making offerings) as symbolic requests' },
            { attribute: 'Sustainment', value: 'Resonance holding: Daily practice of same invocation for 40+ days; altar maintenance with fresh flowers, clean candles, renewed intention; journaling synchronicities and signs the principle is responding; living from the principle\'s perspective in daily choices' },
            { attribute: 'Release', value: 'Clean disengagement: After 40 days or when results manifest, consciously thank the principle; remove or transform the altar; journal about what manifested; release attachment by shifting focus to next practice or gratitude rather than need' },
          ]},
          { name: 'Manifestation Bridge', emoji: '🌉', content: [
            { attribute: 'Attunement', value: 'Internal tuning: Align your emotions with the principle (embody it internally before expecting external results); notice any disbelief or resistance and resolve it; develop emotional authenticity—you cannot fake invocation' },
            { attribute: 'Alignment', value: 'Macrocosmic matching: Take aligned action (if invoking prosperity, create budget and business plan; if invoking love, be loving to others); notice synchronicities and opportunities—these are the universe confirming alignment; follow intuitive nudges' },
            { attribute: 'Invitation', value: 'Non-coercive call: Ask the universe for support without demanding timing; request specific outcomes without controlling how they arrive; stay open to better solutions than what you imagined; trust divine timing over your timeline' },
            { attribute: 'Sustainment', value: 'Resonance holding: Continue aligned action until manifestation appears; avoid doubt cycles (invoke then despair then invoke again creates confusion); maintain faith through the void between invocation and manifestation; persist without attachment' },
            { attribute: 'Release', value: 'Clean disengagement: When manifestation appears, acknowledge it and give gratitude; stop the specific invocation practice (continuing it dilutes the energy); integrate the result into your life naturally; prepare to invoke next principle' },
          ]},
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Invocation: Calling Divine Principles Into Manifestation', content: 'Invocation differs from evocation. Evocation calls external forces into your space. Invocation calls them into yourself. Hermetic invocation means aligning your consciousness with divine principles so thoroughly that they flow through you. Instead of "Archangel Michael, come protect me," true invocation is "I invoke the principle of divine protection. I am protected. I embody courage and strength." You become the channel for the principle rather than asking the principle to help you. This is more powerful because you\'re not separate from divine—you\'re expressing it. Invocation requires: clarity about which divine principle you need, aligning your thoughts with that principle, becoming that principle rather than appealing to it, trusting the manifestation as you embody it.' },
          { heading: 'Divine Names and Principles', content: 'Different traditions access divine principles through divine names. Christianity: Father, Son, Holy Spirit. Judaism: YHVH (four-letter name of God). Islam: Allah and 99 names. Hinduism: Brahman, Shakti, Shiva. Egyptian: Thoth, Isis, Horus. Each name carries specific frequency and principle. Working with divine names means: invoking the specific principle that name represents, feeling into the vibration of the name through repetition, allowing the principle to reorganize your consciousness. Chanting divine names (mantra practice) is invocation—repeatedly sounding the name attunes you to its frequency until you embody it. This isn\'t superstition—it\'s vibrational attunement to frequencies beyond your ordinary awareness.' },
          { heading: 'Mental Invocation & Thought-Form Creation', content: 'Hermetic principle: "The All is mind; the universe is mental." You create through thought-forms—focused thoughts held with clarity and emotion. Invocation through mental practice: clearly visualize what you\'re invoking, feel it as if it\'s present NOW, hold the image and feeling while repeating intention aloud, act as if what you\'ve invoked is already manifest. Thought-form creation requires: specific clear image, sustained focus (minutes to hours), emotional charge (belief, gratitude, joy), repeated reinforcement. Example: invoking prosperity by visualizing abundance, feeling gratitude for prosperity, acting from wealth-consciousness in your daily choices. Thought-forms fed by repeated attention grow stronger and begin manifesting in material reality.' },
          { heading: 'Vibrational Alignment Through Ritual', content: 'Ritual structures invocation by aligning multiple elements: spoken words (mental), physical movements (body), symbols (visual), timing (cycles), scent/sound (sensory). When all align, your whole being invokes the principle rather than just your mind. Example: invoking love principle—light candles (fire), wear pink (color), move gracefully (body), speak words of love (voice), burn rose incense (scent), do at Friday evening (timing). All elements together create resonance so strong that love principle flows through you and circumstances shift. This is why genuine ritual is more powerful than casual affirmation.' },
          { heading: 'Service as Invocation', content: 'The most powerful invocation is service. Serving others invokes compassion. Teaching invokes wisdom. Protecting invokes strength. Creating invokes beauty. Rather than trying to invoke principles through rituals alone, live them. A healer invoking healing through actually helping people is more powerful than someone reciting healing affirmations. Hermetic practice recognizes that genuine invocation means living the principle—becoming it through action and intention.' },
          { heading: 'Manifestation: From Invocation to Material Reality', content: 'Invocation creates alignment; manifestation bridges from inner to outer. After invoking a principle, material manifestation requires: aligned action (take steps toward what you\'ve invoked), patience with timing (Temporal principle—not all seasons support all manifestations), persistent attention (feed the thought-form regularly), faith that it\'s already manifesting (act as if it exists). Beginners often invoke then wait passively. True manifestation requires: inner alignment (invocation) PLUS outer action PLUS faith PLUS perfect timing. When all four align, material manifestation follows naturally.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Choose one divine principle to invoke: love, abundance, courage, wisdom, healing, protection',
          'Research how your tradition names and represents this principle (name, symbol, color, day)',
          'Create simple invocation: "I invoke [principle]. I am [principle]. This principle flows through me."',
          'Spend 5 minutes daily for one week visualizing yourself embodying this principle',
          'Notice where in your body you feel this principle—heart (love), solar plexus (power), etc.',
          'Create small ritual: light candle, speak invocation 3 times while feeling the principle in your body',
          'Live the principle: take actions consistent with it, make decisions from its perspective',
          'Create vision board or altar representing the principle to feed the thought-form',
          'Notice synchronicities and opportunities appearing that support what you\'ve invoked',
          'After manifesting what you invoked, acknowledge the principle\'s power and move to next principle'
      ],
    },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Become It, Don\'t Ask For It', text: 'The difference between prayer (asking externally) and true invocation (becoming the principle) is everything. Shift from "God, help me" to "I invoke divine help; I AM divine help."' },
          { title: 'Align With What You Invoke', text: 'If you invoke courage while acting cowardly, the invocation fails. Thought-form requires alignment between inner invocation and outer action.' },
          { title: 'Specificity Matters', text: 'Vague invocations (invoke "good luck") are weaker than specific ones (invoke "perfect job opportunity where I use my skills and feel valued"). Be precise.' },
          { title: 'Consistent Attention Feeds Manifestation', text: 'Invocation once creates intention. Repeated invocation over days/weeks feeds the thought-form until it manifests. Stay consistent.' },
          { title: 'Don\'t Force Timing', text: 'Manifestation happens on its own schedule. Your job is invocation and alignment. Trust the process and divine timing.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Kybalion: Mental Principle and manifestation teaching',
          'Neville Goddard teachings on visualization and assumption',
          'Sacred Geometry and divine name symbolism',
          'Mantras and divine name chanting practices',
          'Manifestation workbooks on thought-form creation and belief work'
      ],
      },
    },
  },
  {
    name: 'Talism',
    emoji: '📿',
    description: 'Imbuing - Create talismans as vessels for divine principle and energy',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Talismanic Materials', emoji: '✨', content: [
            { attribute: 'Encoding', value: 'Symbolic inscription: Material itself carries inherent frequency (gold=will, silver=intuition, copper=love); carving or inscribing symbols amplifies encoding; divine names or sigils embed specific vibrations; natural materials hold encoding longer than synthetic' },
            { attribute: 'Timing', value: 'Creation moment: Create during waxing moon for growth talismans; full moon for activation talismans; optimal planetary hours align with principle (Venus hour for love, Mercury for wisdom); personal readiness matters as much as cosmic timing' },
            { attribute: 'Fixation', value: 'Holds alignment: Material chosen acts as anchor for spiritual energy; inscription acts as key that locks the frequency in; quality materials (natural stone, genuine metal) hold fixation better; poor materials lose alignment quickly' },
            { attribute: 'Activation', value: 'Usage trigger: Talisman must be charged through invocation before use (otherwise it\'s just pretty object); touching talisman while stating intention activates its power; wearing or carrying it continuously maintains activation; monthly re-charging prevents deactivation' },
            { attribute: 'Exhaustion', value: 'Depletion over time: Talismans gradually lose potency through use and time; continuous stress/negativity depletes faster; neglected talismans go dormant; monthly cleansing and re-invocation refreshes them; after 1-2 years may need complete re-charging' },
          ]},
          { name: 'Talismanic Charging Process', emoji: '🔥', content: [
            { attribute: 'Encoding', value: 'Symbolic inscription: Inscribe symbol, divine name, or sacred geometry while holding clear intention; physical carving embeds the encoding into material structure; each stroke carries focused will into the object; the inscription itself becomes the frequency anchor' },
            { attribute: 'Timing', value: 'Creation moment: Perform charging ritual during waxing moon when energy is building; do ritual during optimal planetary hours (Sun for power talismans, Moon for intuitive, Venus for love, etc.); perform on auspicious days aligned with principle' },
            { attribute: 'Fixation', value: 'Holds alignment: Cleanse object first to clear any interference; invoke principle repeatedly while holding talisman (3, 7, 13, or 40 times); visualize energy locking into object; state: "This principle is fixed in this object; it holds this alignment permanently"' },
            { attribute: 'Activation', value: 'Usage trigger: Final activation ritual: hold talisman, state intention clearly, feel the energy activate; thank the object; carry it or place it with reverence; first use should be deliberate and conscious (not casual); activation can be renewed monthly' },
            { attribute: 'Exhaustion', value: 'Depletion over time: Track talisman\'s potency through results (stronger effects = fresh charge, weaker effects = depleting); monthly cleansing through salt, water, or moonlight prevents rapid exhaustion; re-invocation every 40 days maintains full potency; replace completely after 2 years if heavily used' },
          ]},
          { name: 'Talismanic Uses & Results', emoji: '⚔️', content: [
            { attribute: 'Encoding', value: 'Symbolic inscription: Protection talisman encoded with symbols of safety (pentagram, evil eye, protective name); love talisman with symbols of connection and attraction; prosperity talisman with symbols of abundance and flow; encoding determines what principle flows through the object' },
            { attribute: 'Timing', value: 'Creation moment: Results appear strongest during favorable planetary transits (use Mars talisman during Mars strong periods, Venus during Venus strong periods); daily use during optimal hours amplifies effect; wearing during personal power times (birthday, new year) accelerates results' },
            { attribute: 'Fixation', value: 'Holds alignment: Well-fixed talisman maintains alignment even through stress/negativity; poorly fixed talisman loses power quickly under pressure; fixation strength determines how well results hold over time; spiritual cleanliness of user affects fixation (aligned user keeps it active, unaligned user drains it)' },
            { attribute: 'Activation', value: 'Usage trigger: Results depend on user activation (touching talisman with intention before important event triggers its power); passive wearing provides background support; active engagement (holding, speaking intention, gratitude) triggers active results; forgotten talisman provides minimal effect' },
            { attribute: 'Exhaustion', value: 'Depletion over time: Results fade as talisman depletes (noticeable after 40+ days continuous heavy use); renewal through cleansing and re-invocation restores full power; if exhausted, talisman becomes inert (returns to being just object); timing of re-charging affects result consistency' },
          ]},
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Talismans: Vessels for Divine Force', content: 'A talisman is a physical object consecrated to hold concentrated divine principle or force. Unlike random objects, talismans are intentionally created to be vessels for specific spiritual energy. A blessed medallion carrying the energy of protection, a crystal grid holding manifestation energy, an amulet inscribed with divine names—all are talismans channeling invisible forces into material form. Hermetic understanding reveals that matter itself is crystallized thought/energy. A talisman takes focused intention and through sacred action embeds it into the object so thoroughly that it becomes a permanent vessel of that energy. Wearing, carrying, or placing a talisman in your space continuously broadcasts its energy, reminding you of the principle and reinforcing alignment with it.' },
          { heading: 'Creating Talismans: The Four-Step Process', content: 'Step 1 (Conception): Decide exactly what principle/force the talisman will carry—protection, love, prosperity, healing, courage. Choose material that resonates with this force (metal for will, stone for grounding, wood for growth, etc.). Inscribe symbol or divine name if appropriate. Step 2 (Charging): Consecrate the object through ritual: cleanse with salt/water, hold intention, invoke the principle repeatedly while holding the object, perhaps use ritual to charge it (moonlight, sunlight, incense, etc.). Step 3 (Activation): Perform activation ceremony calling the energy into the object. Feel the object come alive with the principle you\'ve invoked. Step 4 (Maintenance): Care for the talisman regularly—cleanse monthly, recharge with intention, thank it for its work. A well-maintained talisman grows more powerful over time as it absorbs your continued attention and alignment.' },
          { heading: 'Talismanic Correspondences & Elements', content: 'Different materials carry different resonances: Gold/Brass—solar energy, will, divine power. Silver—lunar energy, intuition, psychic ability. Copper—Venus energy, love, pleasure, magnetism. Iron—Mars energy, strength, protection, grounding. Stone—earth energy, stability, physical grounding. Wood—growth energy, life force, adaptability. Water—emotional, intuitive, flowing energy. Fire—transformative energy, courage, passion. Colors also carry force: White—purity, spiritual energy. Black—protection, banishing. Red—power, courage, passion. Green—healing, growth, abundance. Blue—communication, peace, healing. Purple—spiritual connection, transformation. Choose materials and colors that align with the principle you\'re talismaning. This Hermetic principle states that like attracts like—gold attracts divine power, silver attracts intuition, etc.' },
          { heading: 'Divine Names in Talismans', content: 'Inscribing divine names or sacred words into talismans is ancient Hermetic practice. Examples: YHVH (God), Allah, OM, Logos, etc. Each name carries vibrational frequency of the divine principle it represents. Carving or writing sacred names into talismanic objects embeds that frequency into the material. Wearing a talisman with your tradition\'s divine name connects you to that sacred frequency continuously. Jewish tradition uses Psalms and divine names in protective amulets. Islamic tradition uses Quranic verses. Christian tradition uses sacred monograms. Hindu tradition uses mantras and divine syllables. Every tradition recognizes this principle—sacred words/names embedded in talismans carry power.' },
          { heading: 'Personal Talismans & Amulets', content: 'You can create personal talismans for specific life purposes: Prosperity talisman (carries abundance principle)—touch before financial decisions or carry to attract opportunity. Protection talisman—wear to prevent harm and shield from negativity. Love talisman—carry to attract genuine love or enhance existing relationship. Healing talisman—hold during illness or place in healing space. Courage talisman—carry when facing fears. Each talisman, once charged and activated, becomes your personal ally—a physical object reminding you of and channeling a specific principle. Many people keep collection of talismans for different purposes, using whichever is needed in the moment.' },
          { heading: 'Group & Community Talismans', content: 'Talismans can be created for groups or communities rather than individuals. A community protection talisman placed at entrance to neighborhood. A group prosperity talisman kept in business space. A healing sanctuary talisman placed in healing center. Community talismans work similarly to personal ones but hold energy for collective benefit rather than individual. This Hermetic principle shows that consciousness is shared—energy infused into object for community benefit touches everyone in that community. Powerful community talismans can shift the energy of entire locations.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Choose one principle you want to carry: protection, prosperity, love, healing, or courage',
          'Select material for your talisman: stone, metal, wood, or even simple object from nature',
          'Design or inscribe symbol representing the principle (personal symbol, divine name, or sacred geometry)',
          'Cleanse the object through salt, water, smoke, or burying overnight in earth',
          'Perform charging ceremony: hold object, invoke the principle 3-13 times, visualize energy flowing into it',
          'Feel the object—does it feel alive, warm, energized? This indicates successful charging',
          'Carry or wear your talisman consistently, feeling its energy and remembering the principle',
          'Monthly, re-charge by cleansing and re-invoking the principle',
          'Notice shifts in your experience—synchronicities, opportunities, increased awareness of the principle',
          'Create multiple talismans for different purposes, building personal collection of energetic allies'
      ],
    },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Intention Must Be Clear', text: 'Vague or conflicted intentions create weak talismans. Before charging, be absolutely clear about what principle you\'re carrying. Conflicted feelings weaken the energetic vessel.' },
          { title: 'Material Quality Matters', text: 'Natural materials (real stone, genuine metal) hold charge better than synthetic ones. Invest in quality materials for talismans you\'ll use long-term.' },
          { title: 'Regular Cleansing Prevents Corruption', text: 'A talisman that\'s never cleansed can accumulate psychic debris. Monthly cleansing maintains clarity and prevents the talisman from becoming corrupted or weakened.' },
          { title: 'Gratitude Strengthens Bond', text: 'Thank your talisman regularly for its work. Gratitude strengthens the energetic bond between you and the object, making it more powerful. Treat it as living ally, not dead object.' },
          { title: 'Don\'t Share Talismans', text: 'Personal talismans should not be worn by others—they\'re imprinted with your specific energy. Sharing dilutes their power. Each person should create their own.' }
      ],
    },
      resources: { title: 'Resources', items: [
          'The Kybalion: Hermetic principles of manifestation and correspondence',
          'Sacred Geometry and Symbols in Talisman Creation',
          'Divine Names and Mantra Work: Power of Sacred Sound',
          'Crystal Grids and Talismanic Magic by Judy Hall',
          'Historical grimoires with talismanic designs and charging methods'
      ],
      },
    },
  },
  {
    name: 'Orientation',
    emoji: '🧭',
    description: 'Positioning - Align yourself spatially, temporally, and relationally in magical work',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Spatial Alignment', emoji: '🌐', content: [
            { attribute: 'Cardinal Directions', value: 'Physical orientation to compass points: East (air, intellect, dawn)—face east for mental clarity work. South (fire, will, noon)—south for transformation and power. West (water, emotion, dusk)—west for emotional healing. North (earth, grounding, midnight)—north for manifestation and stability. Each direction carries elemental frequency that conditions magical work' },
            { attribute: 'Placement in Space', value: 'Position within room/environment: Center—balance, neutrality, maximum resonance. Edge/Periphery—observation, receptivity, watching from outside. Corner—concentrated energy, amplification through convergence. Threshold (doorway)—transition, between-states work. Window—connection to outer world, sky/cosmic work. Your spatial position affects energetic access' },
            { attribute: 'Height & Verticality', value: 'Vertical positioning matters: Ground level—earth connection, grounding, manifestation. Elevated—celestial connection, spirit work, aspiration. Below ground (basement/cave)—underworld work, shadow, hidden knowledge. Rooftop—sky work, cosmic forces, broad vision. Vertical axis mirrors hermetic principle "as above, so below"—your height positions you on this spectrum' },
            { attribute: 'Proximity to Objects', value: 'Distance from altar/tools affects engagement: Close/touching—intimate connection, direct manipulation. Arm\'s length—working distance, engaged but not merged. Across room—distant observation, non-interference. Outside space—complete separation. Proximity determines degree of energetic involvement with magical objects and forces' },
            { attribute: 'Relationship to Boundaries', value: 'Position relative to circles/barriers: Inside circle—contained, protected, defined space. On circle boundary—liminal, gateway keeper. Outside circle—observer, director from beyond. No circle present—unbounded, open to all forces. Boundary relationship shapes what can enter your field and what you can project outward' },
          ]},
          { name: 'Situational Context', emoji: '🏛️', content: [
            { attribute: 'Location Type', value: 'Nature of place conditions magic: Sacred space (temple, church, shrine)—already consecrated, amplifies devotional work. Natural space (forest, mountain, water)—raw elemental forces available. Domestic space (home, bedroom)—personal energy, intimacy, privacy. Public space (park, street)—collective consciousness accessible. Threshold space (crossroads, bridge)—liminal magic, transition work' },
            { attribute: 'Environmental State', value: 'Conditions present shape work: Quiet/silent—meditation, introspection, subtle perception. Noisy/chaotic—grounding challenges, adaptation practice. Clean/ordered—clarity, precision work. Messy/disordered—chaos magic, creative disruption. Weather (rain, wind, sun)—elemental participation, natural amplification. Situation is not obstacle but participant in magical act' },
            { attribute: 'Social Configuration', value: 'Presence of others affects field: Solitary—personal power only, no interference or support. Pair work—polarity, partnership, shared resonance. Small group (3-7)—collective amplification, specialized roles. Large gathering—mass consciousness, collective ritual. Situation determines whether you work alone or harness group energy' },
            { attribute: 'Historical Resonance', value: 'Past events in location matter: Ancient site—accumulated spiritual charge over centuries. Recent trauma site—heavy/dark energy requiring clearing first. Previous ritual site—existing consecration or residual patterns. Neutral/new space—blank slate requiring full consecration. Historical resonance either supports or challenges your working' },
            { attribute: 'Astrological Alignment', value: 'Cosmic moment shapes available forces: Personal transits—planets affecting your natal chart condition personal power. Collective transits—major planetary alignments affect all practitioners. Void of course moon—intuitive/non-rational work favored, avoid concrete manifestation. Eclipse periods—heightened power, shadow integration. Cosmic situation provides energetic weather for magical work' },
          ]},
          { name: 'Temporal Positioning', emoji: '⏳', content: [
            { attribute: 'Time of Day', value: 'Daily cycle conditions consciousness: Dawn (4-7am)—awakening, fresh intention, intellectual clarity. Morning (7am-12pm)—active work, manifestation, building energy. Noon—peak power, will work, solar magic. Afternoon (12-5pm)—integration, practical application. Dusk (5-8pm)—transition, reflection, emotional work. Night (8pm-12am)—introspection, shadow, dream preparation. Midnight—void, deep mystery, spirit contact. Pre-dawn (12-4am)—trance, astral work, deepest silence' },
            { attribute: 'Lunar Phase', value: 'Moon position affects energetic flow: New Moon—planting seeds, new beginnings, void work. Waxing Crescent—building energy, growth, expansion. First Quarter—action, overcoming obstacles, momentum. Waxing Gibbous—refinement, adjustment, preparation. Full Moon—culmination, full power, revelation. Waning Gibbous—sharing, teaching, gratitude. Last Quarter—release, banishing, closure. Waning Crescent—rest, retreat, reflection. Lunar phase determines whether to build, manifest, release, or rest' },
            { attribute: 'Seasonal Rhythm', value: 'Annual cycle shapes magical work: Spring (Equinox-Solstice)—growth, new projects, air/fire work. Summer (Solstice-Equinox)—peak activity, harvest preparation, fire/earth work. Autumn (Equinox-Solstice)—harvest, gratitude, water/earth work. Winter (Solstice-Equinox)—rest, shadow work, water/air work. Cross-quarter days (Samhain, Imbolc, Beltane, Lammas)—transition points, liminal work. Season positions you in natural growth cycle' },
            { attribute: 'Planetary Hours', value: 'Each hour ruled by planetary force: Sun hour—power, authority, success magic. Moon hour—intuition, emotion, psychic work. Mars hour—courage, conflict, protection. Mercury hour—communication, learning, travel. Jupiter hour—prosperity, expansion, luck. Venus hour—love, beauty, pleasure. Saturn hour—binding, banishing, karmic work. Planetary hour determines which force is most accessible' },
            { attribute: 'Personal Cycle', value: 'Your biological/energetic rhythms matter: High energy periods—active magic, manifestation, outward work. Low energy periods—introspection, receptive work, rest. Menstrual cycle (if applicable)—creative power varies throughout month. Sleep cycle—morning person vs night person affects optimal practice time. Chronic conditions—pain/wellness cycles condition available energy. Personal timing overrides cosmic timing when energy is depleted' },
          ]},
          { name: 'Relational Stance', emoji: '⚖️', content: [
            { attribute: 'Approach vs Receptivity', value: 'Active or passive positioning: Approach—reaching out, invoking, drawing down, commanding, directing. Receptivity—opening, receiving, listening, allowing, being vessel. Balanced—neither forcing nor passive, responsive engagement. Approach works for manifestation and invocation; receptivity for divination and channeling; balance for alignment and attunement. Stance determines how force flows through you' },
            { attribute: 'Centrality vs Periphery', value: 'Position in energetic field: Central—primary operator, main channel, directing force. Peripheral—supporting role, observing, holding space. Rotating center—multiple practitioners take turns being central. No center—collective field, distributed agency. Centrality determines degree of responsibility and energetic load you carry' },
            { attribute: 'Above vs Below', value: 'Hierarchical positioning matters: Above—directing, commanding, authority stance toward spirits/forces. Equal—partnership, collaboration, peer relationship. Below—petition, humility, supplication, requesting aid. Horizontal—non-hierarchical, mutual respect. Hermetic work involves all positions: above when directing, below when petitioning higher powers, equal when working with elemental forces' },
            { attribute: 'Inside vs Outside', value: 'Boundary relationship shapes stance: Inside—identified with force, merged, embodying principle. Outside—observing force, separate, analytical witness. Threshold—partially merged, foot in both worlds. Oscillating—moving between inside and outside. Magical work requires all positions: outside for objectivity, inside for power, threshold for translation' },
            { attribute: 'Individual vs Collective', value: 'Scope of consciousness affects stance: Individual—working for personal benefit, private consciousness. Interpersonal—working for/with specific others, relational consciousness. Collective—working for group/community, shared consciousness. Universal—working with cosmic forces, transpersonal consciousness. Scope determines what level of reality you\'re engaging and what you can affect' },
          ]},
          { name: 'Bodily Posture', emoji: '🧘', content: [
            { attribute: 'Verticality', value: 'Spinal alignment conditions flow: Upright standing—full vertical axis, sky-earth connection, grounded aspiration. Seated—stability, sustained practice, balanced. Lying down—receptivity, trance, dream work, deep relaxation. Kneeling—supplication, humility, reverence. Each posture opens different energetic channels and affects consciousness state' },
            { attribute: 'Gesture & Mudra', value: 'Hand positions channel force: Open palms up—receiving, supplication, openness. Palms down—grounding, directing, releasing. Prayer position—centering, devotion, heart focus. Specific mudras—encoded symbolic gestures that activate particular frequencies. Hand over heart—emotional work, self-compassion. Hands raised—invocation, drawing down. Gesture is energetic vocabulary' },
            { attribute: 'Gaze Direction', value: 'Where eyes look matters: Upward—aspiration, celestial connection, inspiration. Downward—grounding, earth connection, introspection. Straight ahead—presence, witnessing, engagement. Closed eyes—internal focus, visualization, meditation. Soft/unfocused gaze—trance, between-worlds perception. Eye direction shapes consciousness and energetic flow' },
            { attribute: 'Breath Pattern', value: 'Breathing affects state: Deep slow breath—calming, grounding, parasympathetic. Rapid breath—activation, energizing, sympathetic. Rhythmic breath—entrainment, pattern-making. Held breath—building pressure, concentration. Natural breath—surrender, allowing, non-interference. Breath is bridge between body and spirit, physical and energetic' },
            { attribute: 'Dynamic vs Static', value: 'Movement shapes engagement: Static holding—containment, concentration, focused will. Slow movement—flow, adaptation, dance with forces. Rapid movement—ecstatic states, trance, possession. Cyclical movement (spinning, swaying)—altered states, between-worlds. Stillness vs motion determines whether you hold energy or circulate it' },
          ]},
          { name: 'Environmental Correspondence', emoji: '🌿', content: [
            { attribute: 'Natural Features', value: 'Environment participates in magic: Near water (ocean, river, lake)—emotional work, flow, cleansing, depth. In forest—growth, green magic, earth connection, hidden knowledge. On mountain—elevation, vision, aspiration, air. In desert—emptiness, trial, solar work, clarity. Each natural setting carries elemental signature that supports aligned work' },
            { attribute: 'Built Environments', value: 'Human structures shape energy: Temple/church—consecrated space, collective devotion, amplified spiritual force. Home—personal energy, intimacy, safety, private work. Urban space—dense human consciousness, collective patterns, social forces. Rural space—natural rhythms, simplicity, earth connection. Ancient site—historical accumulation, ancestral connection. Structure of space affects available forces' },
            { attribute: 'Elemental Presence', value: 'Active elements condition work: Fire present (candles, hearth)—transformation, will, passion. Water present (fountain, rain)—emotion, flow, cleansing. Air moving (wind, incense smoke)—thought, communication, change. Earth solid (stone, soil)—grounding, manifestation, stability. Absence of element—void, receptivity, potential. Environment provides elemental allies for magical operation' },
            { attribute: 'Symbolic Arrangement', value: 'Placement of objects creates field: Altar at center—sacred focus, concentrated power. Protective circle—boundary, containment, safety. Offerings placed—reciprocity, relationship, gratitude. Tools arranged geometrically—pattern, order, sacred structure. Empty space—receptivity, potential, void. Spatial symbolism communicates intention to unseen forces' },
            { attribute: 'Sensory Atmosphere', value: 'Sensory field affects consciousness: Incense/scent—olfactory trigger for altered states, specific scents align with forces. Sound (bells, singing, silence)—vibrational environment, consciousness entrainment. Light (candlelight, darkness, colored light)—visual conditioning, symbolic illumination. Temperature (warm, cool)—comfort or challenge, physical sensation affecting mental state. Sensory environment prepares consciousness for magical perception' },
          ]},
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Orientation: The Forgotten Foundation', content: 'In Hermetic practice, where you stand, when you work, and how you position yourself are not practical afterthoughts—they are fundamental magical operations. Ancient practitioners knew that space is not neutral container but living field of forces. Time is not empty sequence but rhythmic flow of available power. Body is not passive vessel but symbolic instrument. Orientation is the practice of consciously positioning yourself in all these dimensions so that your work aligns with cosmic structure rather than fighting against it. Modern practitioners often skip this, treating magic as mere mental exercise divorced from physical reality. But Hermetic teaching insists: "As above, so below"—meaning physical position mirrors metaphysical position. When you face East at dawn for mental clarity work, you\'re not just being symbolic; you\'re literally positioning yourself in alignment with solar emergence and intellectual awakening. This is why magical texts specify elaborate details about timing, direction, and posture—not as superstition but as precise positioning technology.' },
          { heading: 'The Four-Part Structure of Position', content: 'Hermetic orientation involves four simultaneous dimensions. First: Spatial—where physically are you? What direction do you face? What is your proximity to sacred objects, boundaries, and natural features? Second: Temporal—when are you working? What time of day, lunar phase, season? What planetary hour governs this moment? Third: Relational—what is your stance toward the forces you\'re engaging? Are you commanding, petitioning, or partnering? Are you central operator or supportive participant? Fourth: Bodily—how are you holding your physical form? Standing, sitting, kneeling? What gesture do your hands make? Where is your gaze? All four dimensions must be consciously chosen and aligned. Random positioning produces random results. Precise positioning produces precise results. The ancient grimoires filled with elaborate instructions about facing certain directions during certain hours while making specific gestures were not arbitrary—they were calibration protocols ensuring the practitioner positioned themselves optimally in all four dimensions simultaneously.' },
          { heading: 'Spatial Positioning: The Compass of Forces', content: 'Physical space is not uniform—it has grain, texture, and directional currents. The four cardinal directions each carry elemental frequency: East holds air (intellect, dawn, new beginnings), South holds fire (will, transformation, noon power), West holds water (emotion, intuition, dusk reflection), North holds earth (manifestation, stability, midnight depth). When you face East during mental work, you align with intellectual currents naturally present in that direction. When you face South for transformation work, you tap into solar fire. This is not metaphor—it\'s energetic geography. Similarly, your position within a space matters: center gives maximum resonance and balance; edges give observation and periphery perspective; corners concentrate energy through convergence; thresholds (doorways) facilitate transition work. Height also matters: ground level for earth connection and manifestation, elevated for spiritual work, below ground for shadow and underworld exploration. Every spatial choice positions you differently in the invisible field of forces that permeates physical reality.' },
          { heading: 'Temporal Positioning: Riding the Rhythms', content: 'Time is not neutral sequence but wave of available power. Daily cycle: dawn brings mental clarity and fresh intention, noon brings peak solar will, dusk brings emotional reflection, midnight brings deep mystery and spirit contact. These are not preferences—they are actual energetic conditions. Lunar cycle provides longer wave: new moon for beginnings and void work, waxing for growth, full moon for culmination and revelation, waning for release and closure. Seasonal cycle provides annual wave: spring for new projects, summer for peak activity, autumn for harvest and gratitude, winter for rest and shadow work. Planetary hours add another layer: each hour of day and night ruled by different planet (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) making specific forces more accessible during that period. Hermetic practitioners don\'t just "pick a time"—they position themselves in these intersecting temporal rhythms, choosing moments when desired forces are naturally strong rather than swimming against the current. Personal cycles (your energy, health, hormonal rhythms) add final layer: cosmic timing means nothing if you\'re exhausted.' },
          { heading: 'Relational Positioning: Your Stance Toward Forces', content: 'How you position yourself relative to magical forces determines how they flow through you. Active approach (invoking, commanding, directing) positions you as initiator and channel—appropriate for manifestation and willwork. Receptive stance (opening, receiving, listening) positions you as vessel—appropriate for divination and channeling. Hierarchical positioning matters: sometimes you petition higher powers with humility (below position), sometimes you command elemental forces with authority (above position), sometimes you partner with spirits as equals (horizontal position). Inside/outside positioning: sometimes you merge with force (inside—embodying a deity), sometimes you observe from outside (analytical magic), sometimes you straddle threshold (liminal work). Individual/collective positioning: are you working for personal benefit, for specific others, for community, or serving universal forces? Each positions you at different scale of consciousness and determines what you can affect. Mastery involves fluidly shifting between positions as work requires—not locked into one stance.' },
          { heading: 'Bodily Posture: The Physical Symbol', content: 'Your body is not passive container but active symbolic instrument. Every posture encodes meaning and channels specific energies. Standing upright activates full vertical axis (sky-earth connection), ideal for invocation and grounded aspiration. Sitting provides stability for sustained practice and meditation. Lying down facilitates receptivity, trance, and dream work. Kneeling expresses humility and reverence, positioning you as petitioner. Hand positions (mudras) are energetic vocabulary: palms up for receiving, palms down for grounding and releasing, prayer hands for centering, specific gestures for encoded frequencies. Gaze direction matters: eyes upward for celestial connection, downward for earth grounding, closed for internal focus, soft-unfocused for trance. Breath pattern bridges physical and spiritual: slow deep breathing for calming, rapid breathing for activation, rhythmic breathing for entrainment. Movement vs stillness: static holding for concentration, flowing movement for dance with forces, rapid movement for ecstatic trance. Ancient magical texts specify postures not as theater but as precise bodily positioning that opens channels and encodes intention.' },
          { heading: 'Environmental Correspondence: Space as Participant', content: 'The environment you work in is not backdrop but active participant. Natural features carry elemental signatures: working near water supports emotional and flow magic; forest supports growth and earth connection; mountains support vision and air work; desert supports solar and clarity work. Built environments shape available forces: temples amplify devotional work through accumulated spiritual charge; homes provide personal energy and privacy; urban spaces offer dense human consciousness; rural spaces offer natural rhythms. Elemental presence matters: fire (candles) present adds transformation and will; water (fountain, rain) adds flow and emotion; moving air (wind, incense) adds change and thought; solid earth (stone, soil) adds grounding. Symbolic arrangement creates energetic geometry: altar at center for sacred focus, protective circle for boundary, geometric placement of tools for sacred pattern. Sensory atmosphere prepares consciousness: incense triggers altered states, sound entrains vibration, light conditions visual field, temperature affects comfort. Hermetic practitioners don\'t just "find any quiet space"—they actively select and arrange environments so the space itself supports and amplifies the work. The environment corresponds to and reinforces intention.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Begin with cardinal directions: identify East (sunrise point) in your space. Practice facing each direction and noticing any subtle difference in feeling or mental state',
          'Track time-of-day effects: do same simple practice (candle meditation, visualization) at dawn, noon, dusk, and midnight. Notice how each time feels different',
          'Experiment with lunar phases: perform same practice during new moon and full moon. Observe difference in energy, ease, and results',
          'Practice bodily positioning: try same work standing, sitting, kneeling, and lying down. Notice how posture changes consciousness and available energy',
          'Explore relational stances: practice invoking with authority stance (commanding), then with receptive stance (allowing). Feel the difference in how forces respond',
          'Map your personal energy cycles: for one week, track your energy levels throughout day. Notice your natural high/low periods',
          'Create simple altar with directional awareness: place objects symbolizing each element in corresponding direction (air/East, fire/South, water/West, earth/North)',
          'Work with planetary hours: identify current planetary hour (use online calculator). Notice if your intention aligns with ruling planet',
          'Practice orientation before every magical act: pause, note your direction, time, posture, and stance before beginning. This builds orientation as automatic practice',
          'Keep orientation journal: record spatial, temporal, bodily, and relational positions for each practice session. Track patterns between positioning and results'
      ],
    },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Start With Natural Timing', text: 'Don\'t force work during energetically unfavorable times just because it fits your schedule. Wait for natural alignment when possible. Results come easier when riding the rhythm rather than fighting it.' },
          { title: 'Personal Cycles Override Cosmic Timing', text: 'If you\'re exhausted or ill, even the most auspicious cosmic moment won\'t produce good work. Honor your body\'s actual state—rest when needed, practice when energized. Personal readiness is foundation.' },
          { title: 'Cardinal Directions Are Not Symbolic—They\'re Real', text: 'Facing East actually aligns you with intellectual/solar currents. Facing North actually grounds you. These aren\'t just pretty ideas; they\'re energetic geography. Use them intentionally.' },
          { title: 'Consistency Builds Resonance', text: 'Working in same physical location, at same time, with same posture builds cumulative resonance. Space "learns" what you\'re doing. Regular positioning amplifies future work in that configuration.' },
          { title: 'Flexibility Matters Too', text: 'While consistency helps, rigid attachment to specific orientation can limit you. Sometimes you must work in non-ideal conditions. Practice adaptability—learning to orient effectively anywhere, anytime.' }
      ],
    },
      resources: { title: 'Resources', items: [
          'The Corpus Hermeticum: ancient Hermetic texts on cosmic structure and alignment',
          'The Sacred Magic of Abramelin: detailed instructions on spatial and temporal positioning in ritual',
          'Three Books of Occult Philosophy by Agrippa: comprehensive correspondences for orientation',
          'Planetary hours calculators and ephemeris for timing magical work',
          'Natural Magic by Giambattista della Porta: environmental correspondence and natural positioning'
      ],
      },
    },
  },
];

export function HermeticScreen() {
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
    const witchUnlocked = isUnlocked('witchHermetic') || isTest('witchHermetic');
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
  const accentColor = isDarkMode ? '#ef4444' : '#3b82f6';
  const borderColor = isDarkMode ? '#404040' : '#e0e0e0';

  const handlePracticePress = useCallback((practice: any) => {
    checkSubscriptionAndNavigate(practice);
  }, [navigation, isUnlocked]);

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>☀️ Hermetic</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Alignment-Based Influence
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {SPIRIT_PRACTICES.map((practice) => (
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
        witchType="Hermetic"
        lockKey="witchHermetic"
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
    paddingHorizontal: 8,
  },
  spacerLine: {
    flex: 1,
    height: 3,
    opacity: 1,
  },
  spacerText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginHorizontal: 12,
    opacity: 0.6,
  },
});
