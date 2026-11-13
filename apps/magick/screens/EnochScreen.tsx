import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { useLocks } from '../LocksContext';
import { WitchLockOverlay } from '../components/WitchLockOverlay';
import PurchaseService from '../PurchaseService';
import AppodealService from '../AppodealService';
import { FORAGING_PLANTS } from '../data/plantForagingDatabase';
import { KITCHEN_MAGIC_RECIPES } from '../data/kitchenMagicDatabase';
import { HOME_BLESSING_SPELLS } from '../data/homeBlendingDatabase';
import { ANIMAL_GUIDES } from '../data/animalSymbolismDatabase';
import { FAE_SPIRITS } from '../data/faeSpiritDatabase';
import { EARTH_CRYSTALS } from '../data/earthCrystalsDatabase';

const GREEN_WITCH_PRACTICES = [
  {
    name: '✨ Theurgy Magick ✨',
    isSpacer: true,
  },
  {
    name: 'Invocation & Meditation',
    subName: 'God',
    emoji: '🙏',
    description: 'Theurgic Union - Mystical ascent toward divine presence and theosis',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Purification',
            tabs: [
              {
                name: 'Mental Purification',
                categories: [
                  { name: 'Mental Purification', emoji: '💧', content: [
                    { attribute: 'Foundation & Purpose', value: '🔑 FOUNDATION\nConsciousness must be purified of limitation, attachment, and separation to receive divine presence\n\n❌ OBSTACLES TO RELEASE\nWorldly concerns, ego desires, attachments, false thoughts, fear, anger, resentment block divine reception' },
                    { attribute: 'Daily Practice Protocol', value: '📋 PRACTICE (Daily)\n(1) Meditation: 20-30 minutes daily sitting in silence\n(2) Clearing: Notice thoughts, release them without engagement\n(3) Study: Read spiritual philosophy, contemplate meaning\n(4) Examination: Observe thoughts - what concerns consume you? Release them' },
                    { attribute: 'Focus Areas for Release', value: '🎯 SPECIFIC PATTERNS TO RELEASE\n• Release worldly concerns (money, status, approval)\n• Release ego desires (superiority, control, recognition)\n• Release false thoughts (limitation beliefs, separation thoughts)\n• Release fear patterns (vulnerability, inadequacy)\n• Release anger patterns (judgment, resentment)' },
                    { attribute: 'Timeline & Progression', value: '⏱️ PROGRESSION\nWeek 1-2: Mind quiets slightly\nWeek 3-4: Gaps between thoughts increase\nMonth 2: Sustained quiet accessible\nMonth 3+: Mental clarity becomes baseline\n\n✨ INDICATION\nClarity increases. Decisions become easier. Peace emerges.' },
                    { attribute: 'Integration Guidance', value: '💫 HOW TO INTEGRATE\nDo not force silence—allow it to emerge naturally\nDo not judge thoughts—observe them with compassion\nDo not seek experiences—focus on clearing obstacles\nMind will quiet on its own as obstacles dissolve' },
                  ]},
                ],
              },
              {
                name: 'Emotional Purification',
                categories: [
                  { name: 'Emotional Purification', emoji: '❤️', content: [
                    { attribute: 'Foundation & Purpose', value: '❤️ EMOTIONAL GATEWAY\nEmotional purification transforms reactive emotions into divine emotions\nLove and devotion are the fastest gateway to divine presence' },
                    { attribute: 'Daily Practice Protocol', value: '📋 PRACTICE (Daily)\n(1) Prayer: Speak to divine presence with sincere emotion\n(2) Devotion: Cultivate love and longing for divine\n(3) Transmutation: Fear → courage, Anger → compassion, Desire → longing for divine\n(4) Surrender: "Not my will but thy will"' },
                    { attribute: 'Emotional Patterns to Transform', value: '🔄 TRANSMUTATION PATHWAYS\n• Fear → Trust in divine providence\n• Anger → Compassion for all suffering\n• Resentment → Forgiveness and peace\n• Desire (personal) → Desire for divine union\n• Separation → Recognition of underlying unity' },
                    { attribute: 'Timeline & Progression', value: '⏱️ PROGRESSION\nWeek 1-4: Notice emotional patterns clearly\nMonth 2-3: Begin actively transmuting patterns\nMonth 4-6: Emotional baseline shifts\nMonth 6+: Natural compassion and peace\n\n✨ INDICATION\nEmotional reactivity decreases. Peace increases even amid difficulty.' },
                    { attribute: 'Heart-Opening Practices', value: '💚 SPECIFIC TECHNIQUES\n• Meditation on divine love\n• Prayer with full emotional sincerity\n• Loving-kindness practice for all beings\n• Gratitude practice for divine gifts\n• Surrender of personal will in daily actions' },
                  ]},
                ],
              },
              {
                name: 'Ethical Purification',
                categories: [
                  { name: 'Ethical Purification', emoji: '⚖️', content: [
                    { attribute: 'Foundation & Principles', value: '⚖️ ETHICAL FOUNDATION\nVirtue is not imposed morality but natural expression of divine alignment\nEthical purity clears the field for divine reception' },
                    { attribute: 'Five Pillars of Practice', value: '📋 DAILY ETHICAL PRACTICE\n(1) Truthfulness: Speak truth in all situations\n(2) Justice: Act fairly, honor others\' rights\n(3) Virtue: Cultivate qualities divine would embody\n(4) Integrity: Align action with values\n(5) Service: Serve others and divine will' },
                    { attribute: 'Daily Ethical Choices', value: '📋 SPECIFIC CHOICES TO MAKE\n• Speak truth even when comfortable lie available\n• Honor others\' dignity and autonomy\n• Act with integrity even when unobserved\n• Serve without expectation of reward\n• Release judgment; practice compassion\n• Keep promises and commitments' },
                    { attribute: 'Timeline & Integration', value: '⏱️ PROGRESSION\nWeek 1-2: Awareness of ethical failures\nWeek 3-8: Deliberate ethical choice\nMonth 3+: Virtue becomes natural baseline\n\n✨ INDICATION\nSelf-respect increases. Peace increases. Divine presence begins to be recognizable.' },
                    { attribute: 'Signs of Ethical Maturity', value: '✨ ADVANCED INDICATORS\nVirtue flows naturally without effort\nCompassion becomes automatic response\nIntegrity no longer feels like sacrifice\nService feels like natural expression\nPeace becomes stable baseline' },
                  ]},
                ],
              },
              {
                name: 'Ritual Purification',
                categories: [
                  { name: 'Ritual Purification', emoji: '🛁', content: [
                    { attribute: 'Sacred Bathing Practice', value: '🚿 BATHING (Daily)\nWash with intention: water cleanses physical and energetic\nProtocol: Visualize light washing away all heaviness, all obstacles\nDuration: 5-10 minutes\nFrequency: Daily, preferably before spiritual practice\nIntention: "Let all heaviness dissolve. Let consciousness become clear and pure."' },
                    { attribute: 'Sacred Space Creation', value: '🕯️ SACRED SPACE (Daily)\nDesignate corner/room for practice. Keep it clean, quiet, sacred\nLight candle. Burn incense. Remove worldly distractions\nMaintain: Clean, organized, energetically pure\nPurpose: Sanctuary for consciousness to turn toward divine' },
                    { attribute: 'Fasting Practice', value: '🚫 FASTING (1-2x per week)\nAbstain from food 12-24 hours to practice surrender\nFocus consciousness upward rather than on bodily needs\nPractice: Begin with 12 hours, extend gradually\nPurpose: Release physical grasping, strengthen will\nTiming: End with gentle foods, not heavy meals' },
                    { attribute: 'Silence Practice', value: '🤐 SILENCE (Regular)\nMaintain periods of silence - no speaking, no music, no noise\nDuration: 1-3 hours daily if possible\nEffect: Consciousness becomes increasingly clear\nBenefit: Internal noise quiets, divine presence becomes audible\nProgression: Extend duration as capacity increases' },
                    { attribute: 'Integrated Daily Protocol', value: '⏱️ COMPLETE PROTOCOL\nMorning: Bath with intention + meditation + silence\nDay: Ethical practice + mindful actions\nEvening: Fasting period + prayer + sacred space\nOverall: Maintain ethical purity throughout day\n\n⏱️ TIMELINE\nWeek 1-4: Physical purification feels clarifying\nMonth 2-3: Energetic shift noticeable\nMonth 3+: Regular practice opens to divine presence' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Illumination',
            tabs: [
              {
                name: 'Divine Light',
                categories: [
                  { name: 'Divine Light Experience', emoji: '💡', content: [
                    { attribute: 'Nature of Experience', value: '💡 WHAT IT IS\nA shift in consciousness toward transcendent knowing\nDivine presence descending into awareness\nBrightness beyond physical light' },
                    { attribute: 'Sensory Characteristics', value: '🌟 WHAT IT FEELS LIKE\nBrightness beyond physical light\nWarmth flooding through being\nOverwhelming sense of love and presence\nTime stops. All concerns dissolve\nCertainty of divine reality\nAbsolute peace and acceptance' },
                    { attribute: 'Progression & Accessibility', value: '🔄 PROGRESSION\nDay 1-30: Rare glimpses, easily dismissed\nMonth 2-3: Increasingly recognizable experiences\nMonth 4+: Access becomes more reliable\nYear 1+: Can be accessed at will' },
                    { attribute: 'Integration After Experience', value: '⚠️ IMPORTANT GUIDANCE\nDon\'t cling to experiences\nDivine presence is more important than mystical feelings\nThe light comes and goes—permanence is the goal, not peak experiences\nLet experience transform you naturally' },
                    { attribute: 'Lasting Effects', value: '✨ PERMANENT CHANGES\nAfter illumination: Peace, clarity, love increase permanently\nEven when experience fades, its effects remain\nConsciousness permanently shifted toward recognition\nBaseline awareness becomes more aligned' },
                  ]},
                ],
              },
              {
                name: 'Mystical Vision',
                categories: [
                  { name: 'Mystical Vision', emoji: '👁️', content: [
                    { attribute: 'Nature of Vision', value: '👁️ PERCEPTION SHIFT\nPerceiving divine reality: inner light, celestial beings, divine beauty, truth beyond rational mind\nDirect perception of what is always present but normally hidden' },
                    { attribute: 'Common Vision Types', value: '🎨 WHAT YOU MAY SEE\n• Inner light (white, gold, or colored radiance)\n• Celestial beings (angels, archangels, higher intelligences)\n• Divine landscapes (gardens of light, celestial cities)\n• Divine symbols (mandalas, sacred geometry)\n• Divine faces (seeing divine beauty, your own true face)\n• Pure colors and geometric patterns\n• Light beings and luminous forms' },
                    { attribute: 'During Vision Protocol', value: '📋 HOW TO RECEIVE\n(1) Don\'t analyze - this breaks the state\n(2) Receive - let vision unfold naturally\n(3) Feel - notice emotional/energetic response\n(4) Remember - commit to memory afterward\n(5) Don\'t force - visions come spontaneously\n(6) Remain open - stay receptive without grasping' },
                    { attribute: 'Progression & Clarity', value: '🔄 PROGRESSION\nWeek 1-4: Images faint, easily forgotten\nWeek 5-8: Clearer, more memorable visions\nMonth 3+: Rich, detailed, vivid visions\nMonth 6+: Can access visionary states at will\n\n📝 RECORD VISIONS\nJournal immediately after: What did you see? What did it mean? How did it feel?' },
                    { attribute: 'Distinguishing Divine Visions', value: '⚠️ DISCERNMENT\nDivine visions bring: peace, clarity, love, unity, truth\nEgo/astral visions bring: confusion, aggrandizement, attachment, complexity\n\nTest: After vision, does peace and clarity increase?\nIf yes: divine vision\nIf no: astral/ego vision\n\nTrust divine visions. Question others.' },
                  ]},
                ],
              },
              {
                name: 'Ecstatic Union',
                categories: [
                  { name: 'Ecstatic Union', emoji: '🌈', content: [
                    { attribute: 'Nature of Union', value: '🌈 THE EXPERIENCE\nThe soul recognizes its essential unity with the divine\nSeparation dissolves into oneness\nIndividual self merges with infinite consciousness' },
                    { attribute: 'What Happens in Union', value: '💫 CHARACTERISTICS\n• Sense of individual self vanishes\n• "I" becomes "We"\n• All boundaries dissolve\n• Experience of being everywhere at once\n• All beings recognized as divine\n• Love that contains all love possible\n• Certainty beyond any doubt\n• Reality recognized as divine expression' },
                    { attribute: 'Duration & Frequency', value: '⏱️ TIMELINE\nOften seconds to minutes\nOccasionally hours\nRarely extends longer\n\n🔄 ACCESSIBILITY PROGRESSION\nMonth 1-3: Brief tastes, easily lost\nMonth 4-6: Increasingly accessible\nMonth 6+: Can be accessed through deepened practice' },
                    { attribute: 'Integration After Union', value: '📋 INTEGRATION PROTOCOL\nAfter union: Sit quietly for extended time\nDon\'t immediately analyze\nLet the realization settle into your being\nAllow gradual integration over days and weeks\nNotice how consciousness gradually reorganizes' },
                    { attribute: 'Permanence & Deepening', value: '✨ DEVELOPING STABILITY\nSingle union = temporary experience\nRepeated unions = permanent realization\nGoal is not the experience but permanent recognition of what the experience revealed:\nYour true nature IS divine\nThis recognition becomes your ground, not aspiration' },
                  ]},
                ],
              },
              {
                name: 'Knowledge Beyond Words',
                categories: [
                  { name: 'Direct Knowing', emoji: '🧠', content: [
                    { attribute: 'Nature of Direct Knowing', value: '🧠 DIRECT KNOWING\nDirect knowing of divine reality that cannot be captured in language\nSelf-evident truth that needs no proof\nCertainty that transcends rational understanding' },
                    { attribute: 'What You Directly Know', value: '🎯 SPECIFIC GNOSIS\n• The nature of your true self (not body/mind/ego)\n• The nature of divine reality (beyond concepts)\n• Why you were born, your unique purpose\n• The meaning of existence\n• What\'s truly important (not what you thought)\n• The reality underlying all appearances\n• Unity underlying apparent multiplicity' },
                    { attribute: 'The Paradox of Expression', value: '⚠️ THE PARADOX\nYou know with absolute certainty things that can\'t be explained\nReturn to ordinary mind and language fails\nThe knowing remains but articulation becomes impossible\nWords seem to distort what you know\nEverything you say feels inadequate' },
                    { attribute: 'Expression Attempts & Integration', value: '📝 WORKING WITH DIRECT KNOWING\nAfter union, attempt to write/speak what you know:\n• Use metaphors and poetry (more accurate than literal language)\n• Accept that words fail\n• The knowing persists beyond expression\n• Over time, integration into daily consciousness happens (no words needed)\n• Stop trying to explain; simply live from the knowing' },
                    { attribute: 'Living from Direct Knowing', value: '💫 PERMANENT INTEGRATION\nThe direct knowing gradually transforms how you live, decide, speak\nNot through conscious application but through natural alignment with what you know\nYou become living expression of the knowledge\nNo explanation needed\nOthers feel the truth in your presence' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Union (Theosis)',
            tabs: [
              {
                name: 'Divine Participation',
                categories: [
                  { name: 'Divine Participation', emoji: '🤝', content: [
                    { attribute: 'What Divine Participation Is', value: '🤝 DEFINITION\nNOT merger (losing individuality) but conscious participation in divine activity and nature\nYou remain "you" but fully conscious of being expression of divine\nPartnership with divine, not absorption into it' },
                    { attribute: 'How Participation Works', value: '🔄 THE MECHANISM\n• You remain "you" but fully conscious of being expression of divine\n• Personal will aligns with divine will (no longer separate)\n• Actions flow from divine will naturally\n• Individual perspective expands to cosmic perspective\n• You and divine work together (not separately)\n• Surrender and empowerment merge' },
                    { attribute: 'Consciousness Shift', value: '📊 CONSCIOUSNESS BEFORE & AFTER\nBefore: "I act toward divine goal"\nAfter: "Divine acts through me toward its expression"\n\nBefore: Personal will trying to align\nAfter: Divine will naturally expressing\n\nBefore: Effort required\nAfter: Action flows effortlessly' },
                    { attribute: 'Development Timeline', value: '⏱️ PROGRESSION\nMonth 1-3: Occasional alignment\nMonth 4-6: Increasing moments of divine participation\nMonth 6+: Baseline state becomes divine participation\nYear 1+: Permanent ground of consciousness' },
                    { attribute: 'Signs of Participation', value: '✨ INDICATION\nActions flow effortlessly\nDecisions align with divine will\nLife becomes increasingly synchronistic\nSeems to work out with minimal effort\nOthers notice you\'ve changed\nRight action happens naturally' },
                  ]},
                ],
              },
              {
                name: 'Transformation',
                categories: [
                  { name: 'Gradual Deification', emoji: '✨', content: [
                    { attribute: 'What Transformation Is', value: '✨ GRADUAL DEIFICATION\nBecoming divine not by replacing humanity but by manifesting divine essence through human form\nHuman transformed by divine presence, not erased\nHumanity and divinity merge' },
                    { attribute: 'How Transformation Works', value: '🔄 THE PROCESS\n• Your humanity doesn\'t disappear—it\'s TRANSFIGURED\n• Your emotions become divine emotions (love instead of attachment)\n• Your will becomes divine will (surrender instead of force)\n• Your mind becomes divine mind (wisdom instead of thinking)\n• Your actions become divine actions (service instead of self-interest)\n• Personality becomes more fully itself, illuminated by divine' },
                    { attribute: 'Transformation Timeline', value: '📈 PROGRESSION\nMonth 1-3: First glimpses of divine nature emerging\nMonth 4-6: Noticeable personality shifts\nMonth 6-12: Friends notice you\'ve changed\nYear 1-2: Significant integration\nYear 2+: Ongoing deepening transformation' },
                    { attribute: 'Nature of Transformation', value: '⚠️ IMPORTANT\nYou don\'t become "super-human" or lose humanity\nYou become FULLY human—expressing divine nature in human form\nMore compassionate, wiser, more loving, more capable\nStill human. Still here. But increasingly transparent to divine\nYour unique gifts shine more clearly' },
                    { attribute: 'Signs of Transformation', value: '✨ INDICATION\nVirtue becomes natural\nCompassion flows effortlessly\nFear diminishes\nPeace becomes baseline\nPresence becomes magnetic\nOthers feel healed in your presence\nYour very being serves' },
                  ]},
                ],
              },
              {
                name: 'Permanent Integration',
                categories: [
                  { name: 'Integration as Stability', emoji: '🏠', content: [
                    { attribute: 'What Integration Means', value: '🏠 PERMANENT STABILITY\nUnion is not temporary experience but integration into consciousness\nLiving as divine human thereafter\nDivine union becomes your ground' },
                    { attribute: 'The Shift from Experience to State', value: '🔄 TRANSFORMATION\nBefore: Union = rare peak experience, difficult to access\nAfter: Union = permanent baseline, easy to access deeper levels\n\nBefore: Special state\nAfter: Normal consciousness\n\nBefore: Seeking\nAfter: Living' },
                    { attribute: 'Integration Process', value: '📋 HOW INTEGRATION HAPPENS\nMonth 1-2: Integration occurs beneath awareness\nMonth 3-6: Realization becomes more conscious\nMonth 6+: Permanence is recognizable\n\nIntegration is gradual, subtle, natural\nNo effort required—consciousness reorganizes itself' },
                    { attribute: 'Integration Challenges', value: '⚠️ WHAT TO EXPECT\n• Return to ordinary people/situations can feel jarring\n• Ordinary concerns seem trivial (need to re-engage compassionately)\n• Identity shifts require adjustment\n• Life may reorganize around new consciousness\n• Others may not understand your transformation\n• Feeling "between worlds" temporarily\n\nAll normal and temporary' },
                    { attribute: 'Maintaining Integration', value: '💪 ONGOING PRACTICE\n• Regular meditation practice (now easier)\n• Ethical living (now natural)\n• Service to others (now natural expression)\n• Continued divine invocation (deepens further)\n• Gratitude practice (deepens recognition)\n• Compassionate action (flows naturally)\n\n✨ RESULT\nAfter integration: You are permanently changed\nYou cannot unsee what you\'ve seen\nYou cannot unknow what you\'ve known\nDivine union becomes your ground, not your aspiration' },
                  ]},
                ],
              },
              {
                name: 'Service to Divine',
                categories: [
                  { name: 'Natural Service', emoji: '❤️', content: [
                    { attribute: 'What Divine Service Is', value: '❤️ NATURAL EXPRESSION\nThe deified soul naturally serves divine will\nNot from obligation but from having become expressions of divine love\nService flows from recognition of unity' },
                    { attribute: 'The Transformation in Service', value: '🔄 FROM OBLIGATION TO EXPRESSION\nBefore service: "I should serve. I ought to help. I need to be good."\nAfter integration: "Service flows naturally. I cannot help but serve. Love naturally seeks to express."\n\nService becomes natural as breathing' },
                    { attribute: 'Forms of Divine Service', value: '📋 HOW SERVICE MANIFESTS\n• Teaching others toward divine union\n• Healing (physical, emotional, spiritual)\n• Compassionate action in daily interactions\n• Carrying divine presence into world\n• Simply being transparent to divine love\n• Serving with presence, not effort\n• Helping others recognize their own divinity' },
                    { attribute: 'Development of Service', value: '⏱️ PROGRESSION\nMonth 1-3: Service requires effort\nMonth 4-6: Service becomes increasingly natural\nMonth 6+: Service is natural baseline expression\nYear 1+: Service is how you naturally function' },
                    { attribute: 'The Paradox of Service', value: '🌟 MASTERY INSIGHT\nYou serve the divine most fully by becoming transparent to it\nNot trying harder or doing more\nBut simply allowing divine nature to express through you naturally\n\nYour mere presence serves\nYour very being helps\nOthers feel healed in your presence\nHelp manifests where you go' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Divine Names & Invocation',
            tabs: [
              {
                name: 'Sacred Sound',
                categories: [
                  { name: 'Sacred Sound Practice', emoji: '🔊', content: [
                    { attribute: 'Nature of Divine Names', value: '🔊 WHAT NAMES ARE\nDivine Names are not labels but living frequencies\nVibrations that attune consciousness to divine reality\nActive principles encoded in sacred sound' },
                    { attribute: 'How Sacred Sound Works', value: '⚡ MECHANISM\nSound itself is sacred\nWhen invoked with full presence, the Name vibrates consciousness toward divine attunement\nThe sound carries the principle encoded within it\nResonance naturally aligns consciousness' },
                    { attribute: 'Basic Practice', value: '🎯 FOUNDATIONAL TECHNIQUE\nRepeat the Name slowly\nFeel its resonance in your entire being\nLet sound become your entire awareness\nContinue until the Name begins to embody within consciousness\nAllow the vibration to transform you' },
                    { attribute: 'Deepening Invocation', value: '🔄 ADVANCED PRACTICE\nAs comfort increases, deepen the practice:\n• Extend duration from 10 to 30+ minutes\n• Feel the Name resonating in all chakras\n• Allow the principle to activate in consciousness\n• Notice shifts in awareness and perception\n• Feel the frequency transforming your being' },
                    { attribute: 'Integration of Sound', value: '✨ BEYOND TECHNIQUE\nInitially practice with focused intention\nGradually sound becomes natural baseline\nName resonates through all activities\nConsciousness continually attuned to principle\nSound becomes your natural mode of prayer' },
                  ]},
                ],
              },
              {
                name: 'Archetypal Powers',
                categories: [
                  { name: 'Four Primary Divine Names', emoji: '⚡', content: [
                    { attribute: 'ADONAI - Lordship Power', value: '🔥 ADONAI (Lord)\nActivates: Transcendence, sovereignty, lordship\nEffect: Consciousness recognizes divine authority and superiority to individual will\n\nWhat it does: Shifts perspective to see divine as supreme\nPrinciple: Surrender to higher authority\nResult: Personal will submits to divine will' },
                    { attribute: 'YHVH - Being Itself', value: '💧 YHVH (Being/Existence)\nActivates: Existence itself, being-consciousness\nEffect: Consciousness touches existence before manifestation\n\nWhat it does: Attunes to pure being\nPrinciple: Merge with existence itself\nResult: Experience of "I Am" prior to identity' },
                    { attribute: 'ELOHIM - Creative Intelligence', value: '🌍 ELOHIM (Godhead)\nActivates: Creative force, plural unity\nEffect: Consciousness recognizes all-creative divine intelligence\n\nWhat it does: Perceive divine as creator\nPrinciple: All creation as divine expression\nResult: See divine intelligence in all manifestation' },
                    { attribute: 'EHEIYEH - Pure Awareness', value: '✨ EHEIYEH (I Am)\nActivates: Pure existence-awareness\nEffect: Consciousness rests in pure "I am" prior to identity\n\nWhat it does: Touch pure consciousness\nPrinciple: Identity transcendence\nResult: Rest as pure awareness beyond self' },
                    { attribute: 'Working with the Names', value: '📋 PRACTICE APPROACH\nChoose one Name to work with deeply\nRepeat with breath 20 min daily\nFeel each principle activating\nAllow understanding to deepen naturally\nWhen ready, explore next Name\nEventually work with all four' },
                  ]},
                ],
              },
              {
                name: 'Invocation Practice',
                categories: [
                  { name: 'Complete Invocation Protocol', emoji: '📿', content: [
                    { attribute: 'Preparation & Setup', value: '🕯️ CREATING CONDITIONS\nSit in quiet sacred space\nGround yourself completely\nLight candle if possible\nBurn incense if available\nRemove distractions\nOpen heart to divine presence' },
                    { attribute: 'Core Invocation Protocol', value: '📋 STEP-BY-STEP (20-30 minutes)\n(1) Sit in quiet sacred space. Ground yourself\n(2) Choose one Divine Name\n(3) Breathe slowly: Inhale (4 count), Hold (4 count), Exhale (4 count)\n(4) With each exhalation, speak or intone the Name\n(5) Feel the Name vibrating through entire being\n(6) Continue 20-30 minutes\n(7) Sit in silence 5 minutes, absorbing attunement' },
                    { attribute: 'Progression & Deepening', value: '📈 PROGRESSION\nWeek 1-2: Feel Name as sound and vibration\nWeek 3-4: Feel principle beginning to embody\nWeek 5-8: Notice consciousness shifting toward principle\nMonth 3+: Name creates permanent attunement\nMonth 6+: Can access principle at will' },
                    { attribute: 'Frequency & Commitment', value: '⏱️ PRACTICE SCHEDULE\nDaily. 20-30 minutes minimum\nConsistency more important than duration\nSame Name for 40 days before switching\nEarly morning optimal (after purification)\nBefore bed also powerful\nDone with sincere intention' },
                    { attribute: 'Deepening the Practice', value: '🔄 ADVANCED INVOCATION\nAs comfort increases:\n• Extend to 45-60 minutes\n• Multiple Names in sequence\n• Feel principles merging\n• Allow Name to consume awareness\n• Surrender completely to principle\n• Rest in presence Name reveals' },
                  ]},
                ],
              },
              {
                name: 'Beyond Words',
                categories: [
                  { name: 'Transcendence of Form', emoji: '✨', content: [
                    { attribute: 'The Name as Gateway', value: '✨ THE GATEWAY\nThe Name is not destination but gateway\nInitially focus on sound, word, principle\nThrough sustained invocation, the Name becomes transparent\nWhat emerges: consciousness merged with divine principle' },
                    { attribute: 'Three Phases of Invocation', value: '🔄 PROGRESSION THROUGH PHASES\nPhase 1 (Weeks 1-4): Name = vibration and meaning\n• Focus on sound and word\n• Feel the principle activating\n• Consciousness engages actively\n\nPhase 2 (Weeks 5-12): Name dissolves into principle\n• Sound becomes less important\n• Principle becomes primary focus\n• Consciousness merges with principle\n\nPhase 3 (Month 4+): Consciousness rests in the presence\n• Name has served its purpose\n• No need for sound or word\n• Rest as pure awareness in divine presence' },
                    { attribute: 'The Fulfillment of Invocation', value: '💫 COMPLETION\nEventually the Name vanishes\nWhat remains: consciousness merged with divine principle\nThis is invocation\'s fulfillment\nTranscendence of word into presence\nYou have become the Name\nYou have merged with the principle' },
                    { attribute: 'Living Beyond the Name', value: '🏠 PERMANENT ATTUNEMENT\nAfter transcending the Name:\nPrinciple becomes your baseline consciousness\nNo need to invoke—you ARE invocation\nDivine presence permanent and natural\nOthers feel the principle in your presence\nYour very being is living invocation' },
                    { attribute: 'Continuing the Journey', value: '🌟 THE ETERNAL SPIRAL\nCompleting one Name reveals doorway to next\nEach principle unveils deeper mysteries\nEventually all Names merge in unity\nWhen all principles are integrated:\nConsciousness rests as pure divinity\nYou have become what you invoked' },
                  ]},
                ],
              },
            ],
          },
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Invocation as Divine Communion',
            content: 'Theurgic invocation is not commanding or compelling divine forces but attunement and communion with divine presence. The practitioner prepares consciousness through purification (mental, emotional, ethical, ritual) to become a fit vessel for divine presence. Through sacred sound, divine names, and focused attention, consciousness is raised toward divine reality. The Names are not abstract labels but living frequencies that vibrate consciousness toward attunement. As practice deepens, the invocation becomes less about seeking and more about resting in the divine presence that is always already present. The ultimate goal is permanence: consciousness that continuously rests in divine presence as its normal baseline.',
          },
          {
            heading: 'Purification as Foundation',
            content: 'All effective invocation rests on purification. Mental purification quiets the endless thought-stream, creating space for divine presence to be felt. Emotional purification transforms reactivity into love and devotion, opening the heart to receive. Ethical purification clears the conscience and aligns action with truth. Ritual purification (bathing, fasting, sacred space) creates a container for the work. Without purification, invocation becomes an exercise in imagination rather than genuine communion. The paradox: we cannot force purification, but we can create conditions for it to happen naturally. Consistent practice in all four areas gradually transforms consciousness.',
          },
          {
            heading: 'The Theurgic Path: Preparation, Invocation, Integration',
            content: 'The complete theurgic path has three phases: Preparation (purification and readiness), Invocation (communion with divine), and Integration (bringing presence into embodied life). Preparation can take months or years but is essential. Invocation then opens access to divine presence. Integration is the most important and most overlooked phase—the realized consciousness must be brought down into daily life and maintained there. The goal is not temporary peak experiences but permanent transformation. Living as a human made divine, with presence and power radiating naturally from daily actions. This integration phase is the work of a lifetime.',
          },
          {
            heading: 'The Divine Names as Frequencies',
            content: 'In theurgic practice, divine Names are not concepts but living frequencies. Each Name carries a specific principle and resonance. ADONAI carries lordship and transcendence. YHVH carries pure being. ELOHIM carries creative intelligence. EHEIYEH carries pure awareness. When vibrated with presence and intention, each Name attunes consciousness to that frequency. Regular practice with a Name gradually rewires consciousness toward that principle. After months of work, the principle becomes integrated: you no longer have to invoke it—you ARE that principle. The Names are gateways that, once fully traversed, transform the practitioner into the very principle the Name represents.',
          },
          {
            heading: 'The Paradox of Union',
            content: 'Theurgic union appears paradoxical: you remain yourself, yet you become one with divine. The individual does not vanish but becomes transparent to divine expression. Personal will does not disappear but aligns so completely with divine will that they function as one. You remain human—thinking, speaking, acting—but increasingly conscious of being an expression of divine. This is not ego-inflation but ego-dissolution; not being "special" but being increasingly ordinary as a vehicle for divine will. The ultimate realization: you have always been divine, always have been one with the source. The work is simply becoming conscious of what has always been true.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin daily meditation practice: 20 minutes sitting in silence with heart open',
          'Establish ethical practice: commit to truthfulness, justice, virtue, integrity, service in daily life',
          'Create sacred space: dedicate area for practice, keep it clean and energetically pure',
          'Develop purification ritual: daily bathing with intention, regular fasting, periods of silence',
          'Choose one Divine Name to work with: study its meaning and principle deeply',
          'Begin invocation practice: spend 20-30 minutes daily vibrating the Name with breath and presence',
          'Keep invocation journal: record experiences, shifts in awareness, integration of principles',
          'Read spiritual philosophy: deepen understanding of divine union and mystical states',
          'Notice effects: observe how principles begin manifesting in daily consciousness and action',
          'Deepen commitment: as practice bears fruit, increase dedication to continuous attunement',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Purification Precedes Union', text: 'No amount of technique bypasses the need for purification. Consistent ethical living, honesty, and service create the foundation. Union comes naturally when consciousness is sufficiently purified.' },
          { title: 'Consistency Over Intensity', text: 'Daily gentle practice surpasses occasional intense sessions. The Names work through consistent resonance. Daily 20-minute practice produces transformation; occasional intense work produces only temporary states.' },
          { title: 'Surrender Over Control', text: 'Invocation is not about controlling divine but about opening to it. Release expectations, soften effort, and allow divine presence to work through you.' },
          { title: 'Integration is the Goal', text: 'Mystical experiences are not the goal; permanent transformation is. Every experience should deepen integration into daily consciousness, not remain a separate spiritual state.' },
          { title: 'Service as Confirmation', text: 'True union manifests as natural service and compassion. If your practice increases ego, intensity, or spiritual pride, you are moving away from genuine theosis. True union becomes invisible—quiet, humble, naturally serving.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Practice of the Presence of God by Brother Lawrence (continuous union)',
          'Theologia Mystica by Pseudo-Dionysius (apophatic union)',
          'Interior Castle by Teresa of Avila (stages of mystical union)',
          'Dark Night of the Soul by John of the Cross (purification required for union)',
          'The Autobiography of a Yogi by Paramahansa Yogananda (practical union)',
        ],
      },
    },
  },
  {
    name: 'Hierarchical Visualization',
    subName: 'Angels',
    emoji: '👁️',
    description: 'Theurgic Ascent - Inner ascent through celestial realms toward divine source',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
              { name: 'Ascent Levels', emoji: '⬆️', content: [
            { attribute: 'Physical Realm', value: '🌍 LEVEL 1\nEarth sphere—consciousness identified with body, material concerns, survival instinct, sensory perception\n\n📋 CHARACTERISTICS\n• Reality = physical body and material world\n• Concerns: survival, safety, physical comfort, possessions\n• Perception: Five senses only\n• Consciousness: Densest, most limited\n\n⏱️ DURATION AT THIS LEVEL\nMost people: Entire life (never ascend)\nBeginning practitioners: First meditation attempts\n\n🔄 NEXT STEP\nBecoming aware of emotions beyond physical response. Noticing internal subjective experience.' },
            { attribute: 'Lunar Sphere', value: '🌙 LEVEL 2\nMoon sphere—emotional consciousness, imagination, dreams, desires, personal will and emotion\n\n📋 CHARACTERISTICS\n• Reality = emotions, imagination, dreams\n• Concerns: Personal desires, emotional experiences, relationships\n• Perception: Feeling, imagination, subjective experience\n• Consciousness: More fluid than physical, personal perspective\n\n🎭 WHAT YOU DISCOVER\nEmotions are real and powerful. Imagination creates internal reality. Dreams carry meaning. Personal will exists separate from body\n\n⏱️ DURATION AT THIS LEVEL\nFirst meditation: Weeks to months (noticing feeling and imagination)\nDeveloped practice: Becomes fluid and integrated\n\n🔄 NEXT STEP\nDeveloping intellect. Moving beyond pure emotion to understanding.' },
            { attribute: 'Planetary Spheres', value: '🪐 LEVELS 3-7\nProgressive integration of divine principles through the planetary spheres\n\n📍 MERCURY (Intellect)\nClearness, communication, understanding. Thoughts become refined and clear.\n\n📍 VENUS (Love)\nDivine love, harmony, beauty. Personal affection becomes transpersonal love.\n\n📍 MARS (Will)\nDivine will, courage, transformation. Personal desire becomes aligned will.\n\n📍 JUPITER (Wisdom)\nExpansion, benevolence, cosmic perspective. Knowledge becomes wisdom.\n\n📍 SATURN (Boundaries)\nStructure, manifestation, responsibility. Principles become grounded in form.\n\n⏱️ ASCENT TIMELINE\nEach sphere: 1-3 months of focused practice\nAll planetary spheres: 6-12 months\n\n🔄 PROGRESSION PATTERN\nAscend one sphere, integrate, then ascend next. Each builds on previous. Can also work with multiple simultaneously as practice deepens.' },
            { attribute: 'Solar Sphere', value: '☀️ LEVEL 8\nSun sphere—integrated divine consciousness, unified will aligned with divine will, illumination, divine power\n\n📋 CHARACTERISTICS\n• All planetary principles integrated\n• Consciousness unified and coherent\n• Will perfectly aligned with divine will\n• Illumination becomes constant baseline\n• Divine power accessible and active\n\n⏱️ ACHIEVEMENT TIMELINE\nBeginner: Rare glimpses after months of practice\nIntermediate: Accessible after 1-2 years dedicated work\nAdvanced: Baseline state after 2-3 years continuous practice\n\n✨ EFFECTS\n• Radiant presence others feel\n• Clarity about life purpose\n• Power manifests naturally\n• Wisdom accessible in all situations\n\n🔄 NEXT STEP\nSupernal realms. Transcendence beyond form.' },
            { attribute: 'Supernal Realms', value: '👁️ LEVEL 9\nUnity with divine source—consciousness dissolves into divine undifferentiation, beyond form and principle\n\n📋 CHARACTERISTICS\n• Individual identity dissolves\n• Consciousness merges with divine source\n• Beyond all form and principle\n• Beyond all duality\n• Pure undifferentiated being\n\n⏱️ ACHIEVEMENT TIMELINE\nRare even for advanced practitioners. Occasional glimpses after years of practice. Full integration increasingly rare.\n\n⚠️ PARADOX\nFull union seems like the goal, but the goal is actually integrating each level into embodied consciousness. Supernal union is the peak, but permanent integration at Solar and Planetary levels is the real achievement.\n\n✨ INTEGRATION CHALLENGE\nCannot remain at Supernal. Must return to form. Goal: Bring realization down through all levels. Ascent without return = escape fantasy. Return without ascent = limitation.' },
          ]},
          { name: 'Archetypal Integration', emoji: '👼', content: [
            { attribute: 'Definition', value: 'Inner recognition of divine principles—Each angel/archangel represents an archetypal divine principle to be integrated within consciousness' },
            { attribute: 'Michael Integration', value: 'Divine Will—recognizing and aligning personal will with divine will; embodying protection and clarity' },
            { attribute: 'Gabriel Integration', value: 'Divine Communication—opening to receive divine messages; manifesting truth in communication and action' },
            { attribute: 'Raphael Integration', value: 'Divine Healing & Wisdom—becoming channel for healing; wisdom flows through purified intellect' },
            { attribute: 'Uriel Integration', value: 'Divine Justice & Truth—embodying sacred responsibility; seeing divine intelligence in all consequences' },
          ]},
          { name: 'Mystical States', emoji: '✨', content: [
            { attribute: 'Preparation', value: 'Purification and meditative centering—consciousness quieted of thought and personal will' },
            { attribute: 'Invocation', value: 'Opening to receive archetypal presence—consciousness raised to meet the principle; heart opened in supplication' },
            { attribute: 'Communion', value: 'Direct knowing without word—consciousness directly experiences the divine principle; temporary union achieved' },
            { attribute: 'Integration', value: 'Bringing realization into embodied consciousness—maintaining the state permanently; becoming the principle in daily life' },
          ]},
          { name: 'Consciousness Expansion', emoji: '🌟', content: [
            { attribute: 'Limitation Release', value: 'Each sphere ascended releases identification with that sphere\'s limitations; consciousness expands beyond previous boundaries' },
            { attribute: 'Identity Shift', value: 'From "I am separate individual" to "I am expression of divine consciousness manifesting through this form"' },
            { attribute: 'Perception Transformation', value: 'Reality perceived as divine presence expressing itself; all beings recognized as divine consciousness in form' },
            { attribute: 'Wisdom Flowering', value: 'Successive ascents reveal deeper understanding—what seemed true becomes partial; larger reality continually reveals itself' },
          ]},
          { name: 'Divine Descent', emoji: '💫', content: [
            { attribute: 'Embodiment', value: 'Each ascent experienced must return to embodied consciousness—the realization must integrate and transform daily life' },
            { attribute: 'Service', value: 'Ascended consciousness naturally serves lower consciousnesses—wisdom manifests as compassion and teaching' },
            { attribute: 'Stability', value: 'Consciousness doesn\'t remain in blissful states but grounds in daily life, manifesting divine principles through action' },
            { attribute: 'Continuing Ascent', value: 'Each integration opens deeper ascent—the spiral continues throughout life as consciousness progressively awakens' },
          ]},
            ]
          },
          {
            name: 'Visualization Practices',
            tabs: [
              {
                name: 'Sphere Meditation & Ascent',
                categories: [
                  {
                    name: 'Sphere Meditation & Ascent',
                    emoji: '🌍',
                    content: [
                      { attribute: 'Practice Overview', value: '🌍 PRACTICE\nAscend through celestial hierarchy via sphere meditation.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Choose sphere to meditate with (Earth, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Sun).\n(2) Study sphere correspondence: color, deity, attribute, element.\n(3) Sit quietly. Visualize sphere in space before you.\n(4) Enter the sphere. Perceive its color, light, inhabitants, principle.\n(5) Commune with presiding intelligence. Receive wisdom.\n(6) Ascend to next sphere when ready.\n(7) Journal experience and insights.' },
                      { attribute: 'Frequency & Timeline', value: '⏱️ FREQUENCY\nDaily meditation, 20-30 minutes per sphere.\n\n📅 TIMELINE\nEach sphere: 1-3 months minimum.\nFull ascent (8 spheres): 8-24 months.' },
                      { attribute: 'Effects & Progression', value: '💥 EFFECTS\nEach sphere integration brings corresponding consciousness development.\nEarth grounding strengthens. Emotions become balanced (Moon). Intellect clarifies (Mercury).\n\n✨ SIGNS\nPerception shifts. Attributes embody naturally. Power accumulates with each ascent.' },
                      { attribute: 'Integration & Deepening', value: '💫 INTEGRATION\nAfter each sphere, notice how that principle manifests in daily life.\nYour consciousness progressively aligns with each sphere\'s principle.\nEventually can access any sphere\'s wisdom at will.' },
                    ]
                  }
                ]
              },
              {
                name: 'Archangel Visualization & Invocation',
                categories: [
                  {
                    name: 'Archangel Visualization & Invocation',
                    emoji: '👼',
                    content: [
                      { attribute: 'Practice Overview', value: '👼 PRACTICE\nVisualize and invoke archangels to integrate divine principles.' },
                      { attribute: 'Preparation', value: '🕯️ SETUP\n(1) Choose archangel: Michael (South/Fire/Will), Gabriel (West/Water/Communication), Raphael (East/Air/Healing), Uriel (North/Earth/Truth).\n(2) Study archangel\'s form, light, color, domain, presence.\n(3) Create sacred space. Ground yourself.\n(4) Open heart in reverence for the principle.' },
                      { attribute: 'Invocation Protocol', value: '📋 PROTOCOL\n(1) Face direction of archangel (South/East/West/North).\n(2) Speak invocation: "[Name] Archangel of [Principle], I invoke your presence."\n(3) Visualize archangel descending before you—robed in light, wings extended.\n(4) Feel the presence. It is real, not imagination.\n(5) Dialogue: Ask for wisdom, blessing, integration of the principle.\n(6) Receive: Allow the principle to embody within you.\n(7) Gratitude: Thank the archangel. Feel their blessing.' },
                      { attribute: 'Frequency & Effects', value: '⏱️ FREQUENCY\nDaily or 3-5x weekly, 20-30 minutes.\n\n💥 EFFECTS\nArchangel\'s principle progressively embodies in consciousness.\nMichael: Clear will, courage emerge. Gabriel: Clear communication, truth flow.\nRaphael: Healing, wisdom increase. Uriel: Justice, discernment sharpen.' },
                      { attribute: 'Development & Relationship', value: '🔄 RELATIONSHIP BUILDING\nInitially invocation requires effort\nWith repeated practice, archangel becomes familiar, accessible\nEventually, presence can be felt at will\nDeep friendship with archangelic intelligence develops\nYou become conduit for their principle in the world' },
                    ]
                  }
                ]
              },
              {
                name: 'Pathworking Through Consciousness Levels',
                categories: [
                  {
                    name: 'Pathworking Through Consciousness Levels',
                    emoji: '🛤️',
                    content: [
                      { attribute: 'Practice Overview', value: '🛤️ PRACTICE\nVisualize ascending pathways connecting consciousness levels.' },
                      { attribute: 'Pathworking Protocol', value: '📋 PROTOCOL\n(1) Visualize yourself standing in current sphere.\n(2) Perceive pathway ascending to next sphere above.\n(3) Walk the path, noticing landscape, beings, symbols.\n(4) Ascend through levels, experiencing transition at each.\n(5) Reach highest sphere you can access.\n(6) Sit in divine presence for communion.\n(7) Descend back through spheres, grounding each level in your being.\n(8) Return to ordinary consciousness.' },
                      { attribute: 'Duration & Frequency', value: '⏱️ FREQUENCY\nWeekly minimum, best 2-3x weekly.\n\n⏱️ DURATION\n45 minutes to 2 hours per pathworking session.\nAllow deep integration after each.' },
                      { attribute: 'Effects & Mastery', value: '💥 EFFECTS\nConsciousness progressively expands\nPathways become increasingly vivid and real\nBoundaries between levels become permeable\nYou can move fluidly through consciousness hierarchies\n\n✨ MASTERY INDICATOR\nCan access any level at will. Principles fully integrated. Consciousness permanently expanded.' },
                      { attribute: 'Integration into Daily Life', value: '💫 EMBODIMENT\nAs pathworking deepens, the hierarchical consciousness becomes your baseline.\nYou naturally perceive and embody the principles.\nDaily life becomes expression of expanded awareness.\nOthers feel the expanded consciousness in your presence.' },
                    ]
                  }
                ]
              },
              {
                name: 'Divine Light Absorption',
                categories: [
                  {
                    name: 'Divine Light Absorption',
                    emoji: '💡',
                    content: [
                      { attribute: 'Practice Overview', value: '💡 PRACTICE\nAbsorb divine light from celestial realms into your being.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Sit in meditation, spine straight, heart open.\n(2) Visualize divine light descending from highest realms.\n(3) Light touches crown of your head.\n(4) With each breath, pull light down through you.\n(5) Crown → heart → solar plexus → root.\n(6) Fill entire being with light.\n(7) Breathe light out into world, blessing all beings.\n(8) Continue 20-30 minutes.' },
                      { attribute: 'Frequency & Progressive Deepening', value: '⏱️ FREQUENCY\nDaily, preferably morning or evening.\n\n📈 PROGRESSION\nWeek 1: Feel warmth, light entering\nWeek 2-3: Light more vivid, tangible\nWeek 4+: Entire being glows with light\nMonth 3+: Can feel light radiating from you permanently' },
                      { attribute: 'Effects & Radiation', value: '💥 EFFECTS\nYour consciousness brightens. Peace increases. Presence becomes luminous.\n\n🌟 RADIATION\nLight absorbed eventually radiates outward naturally.\nOthers feel touched by your presence.\nYour mere presence brings light to dark places.\nYou become beacon of divine light.' },
                      { attribute: 'Permanence & Mastery', value: '✨ INTEGRATION\nInitially light must be invoked and absorbed\nWith time, light becomes your natural state\nNo effort needed—you ARE light\nLight naturally radiates wherever you go\nYou have become transparent to divine luminosity' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'The Celestial Hierarchy as Inner Consciousness',
            content: 'The celestial hierarchy is not external—it is the structure of consciousness itself from densest to most refined. Earth represents bodily consciousness; Moon represents emotional-imaginative consciousness; Mercury represents intellectual consciousness; Venus represents loving consciousness; Mars represents willful consciousness; Jupiter represents expansive wisdom-consciousness; Saturn represents boundary-consciousness that stabilizes form; Sun represents unified consciousness aligned with divine will; Supernal realms represent undifferentiated divine consciousness. The ascent through the hierarchy is the progressive awakening and integration of consciousness at each level until the soul recognizes its unity with divine source.',
          },
          {
            heading: 'Invocation as Consciousness Raising',
            content: 'Theurgic invocation is the practice of raising consciousness through the celestial hierarchy toward higher principles. The practitioner begins in personal, limited consciousness and through invocation progressively expands awareness to recognize and embody divine principles. Invoking Michael means raising consciousness to recognize divine will within yourself—not calling an external being but awakening that principle in your own consciousness. The "angel" is not separate but the divine principle calling to its embodiment within you. Through invocation, consciousness ascends the ladder of principles until achieving temporary union with divine source.',
          },
          {
            heading: 'The Four Archangels as Foundational Principles',
            content: 'The four Archangels represent foundational divine principles: Michael (Fire, South)—divine will, protection, discernment, alignment; Gabriel (Water, West)—divine communication, reception, transformation, surrender; Raphael (Air, East)—divine wisdom, healing, clarity, understanding; Uriel (Earth, North)—divine justice, manifestation, grounding, responsibility. Invoking these four establishes consciousness in the primary divine principles. Practitioners often begin with invoking the four in four directions: Michael at South (will aligned), Gabriel at West (heart open to receive), Raphael at East (mind clear), Uriel at North (rooted in manifestation). This creates a balanced, integrated divine consciousness.',
          },
          {
            heading: 'The Planets as Archetypal Consciousness Levels',
            content: 'Each planet represents a level of consciousness and corresponding divine principle: Moon (emotions, dreams, imagination), Mercury (intellect, communication, clarity), Venus (love, harmony, beauty), Mars (will, courage, transformation), Jupiter (wisdom, expansion, benevolence), Saturn (boundaries, structure, limitation). Ascending through the planetary spheres means integrating each principle—emotional consciousness becomes clear and balanced; intellectual consciousness becomes wisdom rather than mere thinking; love becomes divine love rather than personal attachment; will becomes divine will rather than personal desire; expansion becomes wisdom rather than inflation. The ascent is progressive integration of divine principles until reaching the unified Solar consciousness.',
          },
          {
            heading: 'The Path of Return: Bringing Ascent Into Embodiment',
            content: 'Theurgic ascent is not escape from embodiment but transformation of embodiment. After ascending through celestial realms and touching divine unity, consciousness must return and ground in the body. The realization is not held as spiritual experience separate from life but integrated into daily consciousness. The practitioner becomes increasingly transparent to divine expression—still thinking, speaking, acting, but as a channel through which divine will naturally flows. The path of return is more difficult than ascent: maintaining the realization while dealing with mundane concerns, continuing to serve divine will in practical circumstances, allowing the transformation to deepen through action.',
          },
          {
            heading: 'The Holy Guardian Angel as Higher Self',
            content: 'Theurgic tradition speaks of a personal "Holy Guardian Angel"—not external being but one\'s own higher self, the divine consciousness aligned with your unique destiny. This is the aspect of yourself that is already divine, already perfected, already aligned with cosmic will. Theurgic practice involves gradually raising consciousness to recognize and merge with this higher self. As consciousness ascends through the hierarchy, it meets its own higher nature—the self that you will become, the self you already are in divine consciousness. Union with the Holy Guardian Angel is union with your own highest truth.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin daily meditation practice, sitting in silence with awareness on the space of the heart',
          'Learn the symbolism and meaning of each archangel—not as external beings but as divine principles within you',
          'Practice the basic four-archangel invocation: visualize each archangel in turn, opening to the principle they represent',
          'Study the planetary spheres and their corresponding consciousness levels and divine principles',
          'Practice invoking a single archangel deeply over a week—such as Michael for divine will and protection',
          'Learn visualizations of each sphere as you ascend through them—clarity, light, and the specific quality of each level',
          'Practice guiding consciousness upward through the hierarchy in meditation, sensing the principle at each level',
          'When you sense the presence of a principle, commune with it—receive its wisdom, feel its support, understand its expression in your life',
          'Ground the experience by returning consciousness to your heart and body, integrating the realization into daily consciousness',
          'Keep a journal of ascending experiences, insights, and how the principles are manifesting in your embodied life',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Internal Not External', text: 'Remember the hierarchy is within consciousness. Don\'t imagine external beings above you—recognize divine principles within your own being calling to be awakened.' },
          { title: 'Purification Precedes Ascent', text: 'Without purification, ascent is fantasy or ego inflation. Prepare through ethical living, meditation, and honest self-examination before attempting to raise consciousness.' },
          { title: 'Integration Over Experience', text: 'Don\'t pursue mystical experiences for their own sake. The goal is integrating principles into daily consciousness—becoming increasingly aligned with divine will in practical life.' },
          { title: 'Return Is Essential', text: 'Ascent is incomplete without return to embodiment. Ground every meditation in your body and heart. The transformation lives in daily action, not in blissful states.' },
          { title: 'Consistency Over Intensity', text: 'Daily gentle practice is more effective than occasional intense sessions. The hierarchy ascends gradually through steady devotion, not force or ambition.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Kybalion (Hermetic principles of consciousness levels)',
          'Iamblichus Theurgia (classical theurgic cosmology)',
          'Plotinus Enneads (mystical union and consciousness)',
          'Tarot as system for climbing the Tree of Life (consciousness hierarchy)',
          'Meister Eckhart writings on divine union in embodied form',
        ],
      },
    },
  },
  {
    name: 'Alignment & Offering',
    subName: 'Creation',
    emoji: '🌹',
    description: 'Theurgic Reciprocity - Divine co-creation through sacrifice, offering, and sacred exchange',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          { name: 'Understanding', categories: [
            { name: 'Reciprocity', emoji: '🔄', content: [
              { attribute: 'Definition', value: 'Sacred exchange—Theurgy is not command but mutual relationship with divine forces through gift and counter-gift' },
              { attribute: 'Not Extraction', value: 'Unlike magic which extracts favor, theurgy participates in cosmic exchange—you give that you may receive' },
              { attribute: 'Cosmic Law', value: 'The universe operates through reciprocal giving; all creation flows from divine gift; gratitude and offering maintain the flow' },
              { attribute: 'Balance', value: 'Taking without giving creates debt and disconnection; giving with open hand aligns consciousness with divine generosity' },
            ]},
            { name: 'Sacrifice', emoji: '⚡', content: [
              { attribute: 'Definition', value: 'Offering of value—Sacrifice (sacrum+facere, to make sacred) is the intentional offering of what you cherish to divine' },
              { attribute: 'Not Harm', value: 'Theurgic sacrifice is not destruction or killing but offering something precious: time, attention, comfort, will, attachments' },
              { attribute: 'Self-Sacrifice', value: 'The deepest sacrifice is releasing your personal will into divine will; becoming transparent to divine expression' },
              { attribute: 'Transformation', value: 'Sacrifice transforms both giver and receiver; what is offered becomes sacred and returns abundantly through divine channels' },
            ]},
            { name: 'Alignment', emoji: '🎯', content: [
              { attribute: 'Definition', value: 'Harmony with divine will—True offering aligns personal intention with divine purpose' },
              { attribute: 'Testing', value: 'What you offer to divine reveals your true intention; selfish offerings expose where ego still dominates' },
              { attribute: 'Purification', value: 'Regular offering practice purifies motive; as you release attachment to outcomes, egoic barriers dissolve' },
              { attribute: 'Union', value: 'Perfect alignment occurs when personal will dissolves into divine will; offering becomes automatic expression of unified consciousness' },
            ]},
            { name: 'Blessing & Return', emoji: '🌟', content: [
              { attribute: 'Definition', value: 'Divine response to aligned offering—When offering is pure, divine blessing flows naturally' },
              { attribute: 'Not Bargain', value: 'The return is not negotiated or expected but emerges from cosmic law: purified consciousness attracts divine abundance' },
              { attribute: 'Multiplied Return', value: 'What you offer in love returns multiplied; divine generosity exceeds all measure' },
              { attribute: 'Unexpected Forms', value: 'Blessing arrives through unexpected channels; trust the divine intelligence directing manifestation' },
            ]},
            { name: 'Service', emoji: '❤️', content: [
              { attribute: 'Definition', value: 'Expression of alignment—The ultimate offering is service: channeling divine will for the benefit of all' },
              { attribute: 'Selfless Action', value: 'Service means acting for others\' benefit without attachment to recognition or reward' },
              { attribute: 'Divine Instrument', value: 'Offering oneself completely as instrument through which divine love expresses creates permanent theurgic union' },
              { attribute: 'Continuous Offering', value: 'Life becomes the offering; every action becomes sacred exchange; all experience becomes divine communion' },
            ]},
          ]
          },
          {
            name: 'Practices',
            tabs: [
              {
                name: 'Daily Gratitude & Receiving',
                categories: [
                  {
                    name: 'Daily Gratitude & Receiving',
                    emoji: '🙏',
                    content: [
                      { attribute: 'Practice Overview', value: '🙏 PRACTICE\nBegin each day consciously receiving divine gifts and acknowledging them with gratitude.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Upon waking, sit quietly for 5 minutes.\n(2) Bring to mind three gifts you received yesterday: a kind word, food, safety, beauty, laughter, breath itself.\n(3) For each, speak aloud or mentally: "I receive this gift. I am grateful. I acknowledge the divine generosity expressed through this."\n(4) Feel the gratitude physically—in your heart, your body.\n(5) Throughout the day, pause when noticing a gift: "I receive and honor this."' },
                      { attribute: 'Frequency & Duration', value: '⏱️ FREQUENCY\nDaily, 5 minutes morning practice.\n\n📅 DURATION\n30-90 days minimum to establish the consciousness of gratitude.' },
                      { attribute: 'Effects & Signs', value: '💥 EFFECTS\nConsciousness shifts toward recognition of divine abundance. Gratitude becomes baseline attitude. Receiving becomes easier. Energy of abundance increases.\n\n✨ SIGNS OF PROGRESS\nIncreased synchronicity. More gifts appearing. Deeper peace. Sense of being supported by invisible forces.' },
                      { attribute: 'Integration', value: 'Gratitude practice opens consciousness to recognize divine presence in all things. Over time, this becomes your constant baseline—you move through life recognizing yourself as perpetually blessed.' },
                    ]
                  }
                ]
              },
              {
                name: 'Conscious Giving Practice',
                categories: [
                  {
                    name: 'Conscious Giving Practice',
                    emoji: '💝',
                    content: [
                      { attribute: 'Practice Overview', value: '💝 PRACTICE\nOften, consciously give something without expecting return, recognition, or reward.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Daily or multiple times weekly, give something.\n(2) Choose what to give: money, time, attention, skills, kindness, hospitality.\n(3) Give with full attention and love—not grudgingly or hastily.\n(4) Do NOT expect recognition or return. The gift is complete in itself.\n(5) Notice and release any expectation: "I give this freely. What comes next is divine business."\n(6) Journal: Notice unexpected benefits arising from pure giving.' },
                      { attribute: 'Frequency & Types', value: '⏱️ FREQUENCY\nDaily or near-daily small givings.\n\n💝 TYPES OF GIVING\n• Money: Leave a generous tip, contribute to charity, give to someone in need\n• Time: Listen fully, volunteer, help without being asked\n• Skills: Share knowledge, teach, create something for others\n• Kindness: Compliment someone, forgive, perform hidden service\n• Presence: Show up fully, give undivided attention, be genuinely interested' },
                      { attribute: 'Effects & Transformation', value: '💥 EFFECTS\nEnergy shifts from scarcity to abundance. Generosity becomes natural. Receiving becomes easier. Life feels less like survival, more like participation in divine flow.\n\n🔄 TRANSFORMATION MARKERS\nLess worry about resources. More ease in relationships. Unexpected blessings appearing. Sense of abundance increasing.' },
                      { attribute: 'Deep Work', value: 'As you practice, notice: Do you give out of genuine love or obligation? Can you give without hoping for return? What fears arise when you give without expectation? These observations reveal where ego still conditions your offering.' },
                    ]
                  }
                ]
              },
              {
                name: 'Motive Purification Through Journaling',
                categories: [
                  {
                    name: 'Motive Purification Through Journaling',
                    emoji: '📖',
                    content: [
                      { attribute: 'Practice Overview', value: '📖 PRACTICE\nRegularly examine your motives for offering to reveal hidden attachments and expectations.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Set aside 20 minutes. Write without censoring.\n(2) Prompt 1: "What did I offer this week? To whom? Why?"\n(3) Prompt 2: "What did I secretly hope would happen as a result?"\n(4) Prompt 3: "If the opposite happened, would I still feel good about the offering?"\n(5) Prompt 4: "What am I afraid of not getting back?"\n(6) Prompt 5: "What would pure offering look like? How does mine compare?"\n(7) Review: Notice patterns of expectations, attachments, conditions on your giving.' },
                      { attribute: 'Frequency & Depth', value: '⏱️ FREQUENCY\nWeekly for 8 weeks minimum.\n\n🔍 DEPTH\nBe ruthlessly honest. The goal is seeing where ego still conditions your giving.' },
                      { attribute: 'Effects & Integration', value: '💥 EFFECTS\nMixed motives become visible. Shame dissolves (replaced with compassion). Offerings gradually purify. Alignment with divine will deepens.\n\n⚙️ INTEGRATION\nAs motives purify through observation and honesty, the offering naturally becomes purer. This is not willful forcing but organic development.' },
                      { attribute: 'Progression', value: 'Early practice reveals obvious mixed motives (expecting recognition, hoping for favor). Deeper practice reveals subtle attachments (wanting to be seen as generous, fearing you are selfish). Mature practice reveals the offering itself becoming transparent—you no longer think about it, it simply happens.' },
                    ]
                  }
                ]
              },
              {
                name: 'Sacred Offering Ritual',
                categories: [
                  {
                    name: 'Sacred Offering Ritual',
                    emoji: '🕯️',
                    content: [
                      { attribute: 'Ritual Overview', value: '🕯️ RITUAL\nCreate formal ceremony to consciously present offerings to divine and request alignment.' },
                      { attribute: 'Preparation', value: '🕯️ SETUP\n(1) Create small altar or sacred space.\n(2) Gather offerings: flowers, incense, candles, spring water, bread, wine, or something personal.\n(3) Optional: write intention on paper.\n(4) Create circle with salt or mark sacred boundary.\n(5) Light candle—representing divine presence.' },
                      { attribute: 'Ritual Protocol', value: '📋 CEREMONY\n(1) INVOCATION: Speak to divine (however you understand it): "I open to your presence. Guide me toward pure offering."\n(2) ACKNOWLEDGMENT: "I receive life, breath, love, and abundance. I am grateful."\n(3) OFFERING: Present each offering with words: "I offer this [object/time/will] as expression of my gratitude and my desire to serve."\n(4) REQUEST: "Purify my motive. Align my will with yours. Make me transparent to your expression."\n(5) SILENCE: Sit for 5-10 minutes in silent communion.\n(6) CLOSING: "I receive your blessing. I go forth to serve." Blow out candle.' },
                      { attribute: 'Frequency & Variations', value: '⏱️ FREQUENCY\nWeekly or monthly.\n\n🔄 VARIATIONS\n• Seasonal: Adjust offerings to seasonal principle (spring renewal, summer fullness, autumn harvest, winter rebirth)\n• Daily: Simplified 5-minute version at morning or evening\n• Personal crisis: When facing fear or selfishness, intensify practice for several days' },
                      { attribute: 'Power & Witness', value: 'Ritual creates formal witness to your intention. By consciously presenting offerings before divine, you establish a sacred contract. This formal witnessing has real power—consciousness shifts when you move from private thought to public ritual action.' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Theurgy as Sacred Exchange',
            content: 'Theurgic practice is fundamentally about relationship and exchange with divine reality. Unlike magic which commands and extracts, theurgy participates in the cosmic dance of giving and receiving. The universe itself is the continuous overflow of divine creativity—divine gift cascades through all levels of existence. Humans participate in this exchange through gratitude and counter-offering: we receive the gift of existence and respond with conscious gratitude, intentional serving, and offerings that acknowledge divine generosity. This reciprocal relationship aligns the practitioner with cosmic law and opens endless channels for blessing to flow.',
          },
          {
            heading: 'The Power of Sacrifice',
            content: 'Sacrifice is not destruction but transformation. The act of offering something you cherish—time, comfort, pleasure, your personal will—creates a sacred vessel through which divine power flows. The sacrifice becomes a bridge between personal consciousness and divine consciousness. Iamblichus taught that the quality of sacrifice matters: a heartfelt offering of humble work exceeds elaborate ritual performed without sincerity. The deepest sacrifice is the continuous offering of personal will into divine will, becoming so transparent to divine expression that your actions become direct manifestations of divine purpose. This sacrifice paradoxically brings total freedom.',
          },
          {
            heading: 'Alignment Through Purification of Intention',
            content: 'True theurgic offering requires honest examination of motive. What are you really offering? If you give expecting reward, you offer self-interest not surrender. If you serve expecting gratitude, you offer ego not divine love. Theurgic practice involves progressively refining intention until offering becomes pure—given because divine love flows through you, served because it is the expression of your awakened nature. Regular examination of motive, honest confession of mixed intention, and gradual refinement of desire transforms the practitioner\'s offerings from selfish to pure. Perfect alignment occurs when you no longer decide what to offer—the offering arises naturally from a consciousness dissolved into divine will.',
          },
          {
            heading: 'The Law of Reciprocal Return',
            content: 'Cosmic law operates through reciprocity: what you give returns to you in kind and measure. Not as punishment or reward but as law of resonance. A consciousness that gives with open hand and grateful heart resonates with divine generosity and attracts abundance from divine sources. This return is not magical—it is the natural flowering of alignment. A purified heart offering to divine automatically becomes a channel through which divine blessing flows. The return exceeds the offering in measure and generosity because divine abundance is infinite. Trust in this law without demanding or expecting—simply give with pure heart and allow divine wisdom to manifest return in whatever form serves your highest awakening.',
          },
          {
            heading: 'Service as Continuous Offering',
            content: 'The ultimate theurgic practice is continuous service: offering your talents, time, attention, and heart for the benefit of others and the expression of divine will in the world. Service without expectation of reward, recognition, or return becomes the greatest offering and the fastest path to theurgic union. A life dedicated to service transforms existence into continuous prayer, making every action a sacred exchange with divine reality. The practitioner becomes a transparent channel through which divine love serves all creation. This is the perfection of theurgy: not having experiences of divine union but becoming a permanent expression of divine union through dedicated service.',
          },
          {
            heading: 'The Sacred Calendar and Seasonal Offerings',
            content: 'Theurgic tradition honors sacred times—solstices, equinoxes, holy days—as moments when the boundaries between earthly and divine consciousness thin. These times call for special offerings and deeper practice. Seasonal rituals of gratitude, purification, and recommitment to divine alignment strengthen the practitioner\'s connection to cosmic forces. Each season can honor a different principle: spring offerings for renewal, summer for fullness and joy, autumn for harvest and gratitude, winter for death and rebirth of consciousness. Aligning personal practice with cosmic seasons deepens theurgic realization.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin each day with simple gratitude: acknowledge three gifts received and consciously receive them as divine offering to you',
          'Practice conscious giving: make a habit of offering something daily—time, money, attention, comfort—without expecting return or recognition',
          'Create a small altar or sacred space dedicated to offering—a place where you consciously present gifts to divine',
          'Choose one precious thing to offer: perhaps a cherished possession, a commitment to service, or your dedication to spiritual practice',
          'Examine your motive honestly: notice when offering is mixed with expectation; practice releasing attachment to outcomes',
          'Begin a practice of service: commit to one regular way of serving others without expectation of reward—volunteering, hidden kindness, genuine listening',
          'Develop an offering ritual: perhaps at sunset or before meals, consciously acknowledge what you receive and what you offer in return',
          'Study a theurgic text on sacrifice and offering—reading deepens intellectual understanding which supports practice',
          'Notice synchronicities and blessings arising in response to pure giving—journal how return flows naturally from aligned offering',
          'Gradually expand the offering: from specific acts to continuous offering—making your entire life an expression of gratitude and service',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Purity of Motive Matters Most', text: 'A humble offering from pure heart exceeds elaborate ritual from mixed motive. Examine honestly: are you offering or performing? Simplicity with sincerity is most powerful.' },
          { title: 'Release the Expectation of Return', text: 'Offering with hidden expectation of reward still carries selfish energy. The greatest blessing comes from giving that expects nothing. Trust divine wisdom to provide what serves your evolution.' },
          { title: 'Sacrifice Creates Freedom', text: 'Surrendering what you cling to paradoxically liberates consciousness. Each genuine sacrifice loosens ego\'s grip and opens more space for divine will to express.' },
          { title: 'Service is the Gateway', text: 'If mystical experience eludes you, focus on service. Selfless action purifies consciousness more surely than technique. The universe responds to sincere service with blessings.' },
          { title: 'Gratitude Precedes Manifestation', text: 'Begin by being grateful for what you already have, before asking for more. A grateful consciousness aligns with divine abundance; it becomes a vessel through which divine generosity flows abundantly.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Iamblichus on Theurgia (sacrifice and divine reciprocity)',
          'The Bhagavad Gita (Karma Yoga and selfless offering)',
          'Meister Eckhart (God\'s generosity and detachment)',
          'Rumi (divine love and ecstatic offering)',
          'Thomas Kempis The Imitation of Christ (humble service)',
        ],
      },
    },
  },
  {
    name: '⚜️ Thelemic Magick ⚜️',
    isSpacer: true,
  },
  {
    name: 'Ritual Practice',
    subName: 'Will & Law',
    emoji: '⚡',
    description: 'Manifest True Will through ceremonial magick aligned with cosmic law',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
          { name: 'True Will', emoji: '🎯', content: [
            { attribute: 'Definition', value: 'Authentic cosmic purpose—Not personal desire but the essential nature of your being expressing itself in perfect alignment with universal law' },
            { attribute: 'vs. Personality Desire', value: 'Ego desires change and conflict; True Will is unchanging, unified, and naturally harmonious with all existence' },
            { attribute: 'Discovery', value: 'Finding True Will requires stripping away conditioning, trauma, and false self to reveal what naturally wants to express through you' },
            { attribute: 'Expression', value: 'Once recognized, True Will manifests effortlessly—you become an instrument through which cosmic will naturally expresses' },
          ]},
          { name: 'The Law', emoji: '📜', content: [
            { attribute: '"Do what thou wilt"', value: 'The central law of Thelema—not chaos but the highest expression of aligned will in perfect freedom' },
            { attribute: 'Shall be the whole', value: 'This is not selfish but cosmic: when all beings express True Will, perfect harmony results' },
            { attribute: 'Of the Law', value: 'Thelemic law supersedes all conventional morality; ethics flow naturally from True Will alignment' },
            { attribute: 'Love under will', value: 'Love is the expression of True Will; compassion, service, joy flow naturally from alignment' },
          ]},
          { name: 'Ritual', emoji: '🕯️', content: [
            { attribute: 'Definition', value: 'Will made manifest—Ritual is the practical expression of intention through structured action, symbol, and ceremony' },
            { attribute: 'Not Superstition', value: 'Ritual is psychology applied: structured action focuses consciousness, emotion, and will into unified manifestation' },
            { attribute: 'Theater of Consciousness', value: 'Ritual creates a sacred space where consciousness can operate under different rules and perceive expanded reality' },
            { attribute: 'Personal Design', value: 'In Thelemic practice, rituals are personalized expressions of individual will, not rigid traditional forms' },
          ]},
          { name: 'Magick', emoji: '✨', content: [
            { attribute: 'Definition', value: 'Will + Imagination + Action = Change in consciousness and manifestation of aligned intention' },
            { attribute: 'Consciousness Work', value: 'Magick begins as consciousness transformation—shifting perception, belief, identity to align with True Will' },
            { attribute: 'Manifestation', value: 'Aligned consciousness naturally manifests corresponding external results through synchronicity and inspired action' },
            { attribute: 'Unified Practice', value: 'Sexual magick, ceremonial magick, chaos magick—all are expressions of True Will working through different modalities' },
          ]},
          { name: 'Integration', emoji: '🔄', content: [
            { attribute: 'Daily Life', value: 'True magick is not separate from life—every action becomes a ritual when performed with full consciousness and will' },
            { attribute: 'Continuous Practice', value: 'The Great Work is lifelong—progressively refining consciousness, releasing limitations, expressing fuller True Will' },
            { attribute: 'Service & Power', value: 'The most powerful magician serves others; True Will naturally includes compassion and the benefit of all' },
            { attribute: 'Becoming', value: 'Thelemic practice is becoming—shedding false self, evolving consciousness, manifesting your highest potential' },
          ]},
        ],
          },
          {
            name: 'Rituals & Ceremonies',
            tabs: [
              {
                name: 'Simple Daily Intention Ritual',
                categories: [
                  {
                    name: 'Simple Daily Intention Ritual',
                    emoji: '🕯️',
                    content: [
                      { attribute: 'Ritual Overview', value: '🕯️ RITUAL\nCreate a brief morning or evening ritual to set intention and align with True Will.' },
                      { attribute: 'Preparation', value: '🕯️ SETUP\n(1) Quiet space, free from interruptions.\n(2) Optional: light a candle.\n(3) Optional: hold an object representing your intention (crystal, stone, personal item).' },
                      { attribute: 'Ritual Protocol', value: '📋 CEREMONY\n(1) CENTERING: Take 3 deep breaths. Feel yourself present.\n(2) STATEMENT: Speak aloud or mentally: "I align my will with [principle/intention]. I manifest this from authentic truth."\n(3) VISUALIZATION: See yourself already expressing this will in your life. Feel what it feels like.\n(4) COMMITMENT: "I commit to speaking and acting from this truth today."\n(5) CLOSING: Blow out candle if used. Carry the intention forward.' },
                      { attribute: 'Frequency & Duration', value: '⏱️ FREQUENCY\nDaily, morning or evening (or both).\n\n⏱️ DURATION\n5-10 minutes total.' },
                      { attribute: 'Effects & Integration', value: '💥 EFFECTS\nConsciousness becomes aligned. Action flows from intention naturally. Day unfolds with coherence. Power accumulates.\n\n⚙️ INTEGRATION\nThe brief daily alignment creates a powerful container. Over time, you move through life aligned rather than conflicted.' },
                    ]
                  }
                ]
              },
              {
                name: 'Full Circle Ritual for Manifestation',
                categories: [
                  {
                    name: 'Full Circle Ritual for Manifestation',
                    emoji: '🔵',
                    content: [
                      { attribute: 'Ritual Overview', value: '🔵 RITUAL\nCreate formal ceremony to declare intention and direct will toward specific manifestation.' },
                      { attribute: 'Preparation & Elements', value: '🕯️ SETUP\n(1) Cleanse space: open windows, burn incense, ring bell to clear energy.\n(2) Gather items: candles (white, or color corresponding to intention), paper, pen, representation of intention.\n(3) Draw or visualize circle: mark boundary with salt, cord, or gesture.\n(4) Invoke elemental protection: "East/Air for clarity. South/Fire for will. West/Water for flow. North/Earth for grounding."' },
                      { attribute: 'Ritual Protocol', value: '📋 CEREMONY\n(1) OPENING: "I open this sacred space. I stand at the center of my power."\n(2) STATEMENT OF WILL: Write or speak your intention with absolute clarity. Example: "I manifest [specific outcome] aligned with my True Will."\n(3) EMOTION: Feel the feeling of already having achieved it. Let emotion rise. Channel it into the intention.\n(4) VISUALIZATION: See it vividly. Add sensory details: what do you see, hear, feel, smell?\n(5) AFFIRMATION: Speak: "This is mine. I claim it. It is done."\n(6) SEALING: Burn the paper (safely) if appropriate, or keep it as focus object.\n(7) GRATITUDE: "I give thanks for this manifestation already flowing to me."\n(8) CLOSING: "I release this intention to the universe. My will is done. This circle closes." Ground yourself.' },
                      { attribute: 'Frequency & Timing', value: '⏱️ FREQUENCY\nMonthly or as needed for major manifestations.\n\n🌙 TIMING\nWaning moon for releasing, waxing moon for manifesting (optional).' },
                      { attribute: 'Power & Results', value: '💥 POWER\nThis ritual is potent because it brings full consciousness, emotion, and will to bear on manifestation. The emotional intensity amplifies the effect.\n\n✅ RESULTS\nResults often appear within lunar cycle. Watch for synchronicities, opportunities, unexpected help.' },
                    ]
                  }
                ]
              },
              {
                name: 'True Will Discovery Meditation',
                categories: [
                  {
                    name: 'True Will Discovery Meditation',
                    emoji: '🧘',
                    content: [
                      { attribute: 'Ritual Overview', value: '🧘 MEDITATION\nDeep meditation to access your deeper nature and discover authentic True Will.' },
                      { attribute: 'Preparation', value: '🕯️ SETUP\n(1) Quiet, comfortable space where you can sit for 30 minutes.\n(2) Optional: meditation cushion or chair.\n(3) Optional: soft background sound (silence, gentle music, or binaural beats).\n(4) Journal nearby for afterward.' },
                      { attribute: 'Meditation Protocol', value: '📋 MEDITATION\n(1) SETTLING: Sit comfortably. Close eyes. Take 10 deep breaths, becoming present.\n(2) INQUIRY: Ask internally: "What is my True Will? What wants to express through me?"\n(3) RECEIVING: Don\'t force answers. Simply hold the question gently. Notice what arises.\n(4) DIALOGUE: If something appears, engage it: "Tell me more. What is the truth here?"\n(5) FEELING: Move beyond words to feeling. What does True Will feel like in your body?\n(6) INTEGRATION: Rest in the knowing for several minutes.\n(7) RETURN: Gradually bring awareness back to your body. Open eyes.' },
                      { attribute: 'Frequency & Duration', value: '⏱️ FREQUENCY\nWeekly for 8 weeks to develop clarity.\n\n⏱️ DURATION\n20-30 minutes.' },
                      { attribute: 'Effects & Integration', value: '💥 EFFECTS\nClarity progressively deepens. You begin recognizing your True Will in daily life. Authentic desires emerge. Confusion dissolves.\n\n📖 JOURNALING AFTERWARD\nWrite immediately after meditation: What did you perceive? What questions arose? What feels true? Over weeks, patterns emerge revealing your authentic direction.' },
                    ]
                  }
                ]
              },
              {
                name: 'Breaking Ego Patterns Through Transgression',
                categories: [
                  {
                    name: 'Breaking Ego Patterns Through Transgression',
                    emoji: '⚡',
                    content: [
                      { attribute: 'Ritual Overview', value: '⚡ RITUAL\nBoundary-breaking ceremony to shatter limiting beliefs and reclaim power from internalized constraints.' },
                      { attribute: 'Preparation & Safety', value: '🛡️ SETUP\n(1) Safe, private space where you can express fully without fear of judgment.\n(2) Optional: trusted witness (partner or friend who understands the work).\n(3) Identify one limiting belief: "I am not worthy." "I am not powerful." "I don\'t deserve success."\n(4) Identify the prohibition it creates: What have you not done because of this belief?\n(5) Plan the transgression: What is the smallest, safest way to break this pattern?' },
                      { attribute: 'Ritual Protocol', value: '📋 CEREMONY\n(1) INVOCATION: "I invoke my own power. I call forth my True Will."\n(2) NAMING: Speak the limiting belief aloud: "I have believed: [belief]. This belief is not truth."\n(3) DECLARATION: "I release this belief. I claim my authentic power."\n(4) ACTION: Perform the transgression: Speak hidden truths. Ask for what you want. Do the thing that breaks the pattern.\n(5) SENSATION: Notice how your body feels. Discomfort? Exhilaration? Both are integration.\n(6) INTEGRATION: "I have crossed this threshold. I cannot return to unconsciousness. I am free."\n(7) GROUNDING: Return to normal consciousness. Feel the shift.' },
                      { attribute: 'Frequency & Progression', value: '⏱️ FREQUENCY\nAs needed when confronting limiting beliefs.\n\n📈 PROGRESSION\nStart small: speak one truth. Progress larger: ask for what you want, claim your power, live authentically.' },
                      { attribute: 'Caution & Power', value: '⚠️ CAUTION\nThe transgression should be safe but real. Goal is breaking internal patterns, not harming others.\n\n💥 POWER\nBreaking one limiting belief liberates energy. Suddenly choices become available. Life shifts. This is high-magic work.' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Thelema: The Law of Individual Will',
            content: 'Thelema (Greek: "will") is a magickal philosophy centered on the principle that the highest calling of human existence is discovering and expressing one\'s True Will—one\'s authentic nature and cosmic purpose. Revealed through Aleister Crowley\'s The Book of the Law, Thelema teaches that "Do what thou wilt shall be the whole of the Law; Love is the law, love under will." This is not anarchy or selfishness but the ultimate expression of individual consciousness aligning with cosmic will. When each being expresses their True Will authentically, perfect harmony results. Thelemic magick is the practice of discovering True Will and using conscious will + imagination + action to manifest it.',
          },
          {
            heading: 'The Great Work: Individual Evolution Through Magick',
            content: 'The Great Work in Thelemic practice is the progressive evolution and enlightenment of individual consciousness through magickal practice. It involves: recognizing your divine nature and cosmic purpose (knowing True Will), removing limitations and false conditioning that prevent expression (purification and shadow work), developing magickal power and consciousness (ritual practice, meditation, study), manifesting your highest potential in the world (action and manifestation), serving the evolution of all consciousness (love under will). The Great Work is not completed—it is lifelong deepening of consciousness and expression. Each stage brings clarity about True Will and increases capacity to manifest it.',
          },
          {
            heading: 'Ritual as Consciousness Technology',
            content: 'In Thelemic practice, ritual is a sophisticated technology for shifting consciousness and manifesting change. A ritual creates: psychological preparation (focusing mind and emotion), symbolic context (engaging the unconscious mind), energetic activation (raising and directing subtle forces), intentional direction (clarity of will and purpose). The ritual form does not matter—traditional ceremony, spontaneous performance, or daily action all work equally if infused with conscious will. The operative power is not in external forms but in the consciousness engaged through them. A perfectly performed meaningless ritual creates nothing; a spontaneous action infused with True Will and full consciousness manifests powerfully.',
          },
          {
            heading: 'Sexual Magick: Union of Polarities & Will',
            content: 'Thelemic practice includes sexual magick—the use of sexual energy, union of masculine and feminine principles, and ecstatic consciousness as vehicles for manifestation. Sexual magick is not perversion but recognition that sexual force is one of the most powerful generators of consciousness and manifestation available to humans. The union of polarities (masculine active will, feminine receptive creativity) creates a fertile field for manifestation. Sexual magick requires: complete consciousness and will from all participants, clear intention and imaginal focus, ethical integrity (no harm, no violation of consent), integration and grounding of the experience. When practiced responsibly, sexual magick accelerates spiritual development and manifestation.',
          },
          {
            heading: 'The Tree of Life & Path Working: Consciousness Ascent',
            content: 'Thelemic practice often uses the Tree of Life—a map of consciousness with 10 spheres and 22 paths. Path working involves visualizing and experiencing yourself moving through these realms, integrating the consciousness and power of each. Ascending the Tree means progressively developing consciousness: from material embodiment through emotional, intellectual, and spiritual realms toward ultimate unity. Each sphere represents a stage of consciousness development; each path represents a transformation. Unlike Theurgic ascent which emphasizes union with divine, Thelemic path working emphasizes integrating power and consciousness at each level. The practitioner becomes increasingly whole and empowered as they ascend.',
          },
          {
            heading: 'Love Under Will: Thelemic Ethics & Compassion',
            content: 'A common misunderstanding is that Thelemic freedom is selfish. In reality, "Love is the law, love under will" means that authentic True Will naturally includes compassion, service, and benefit to others. A consciousness evolved enough to recognize its True Will inevitably recognizes the True Will of all beings and acts in harmony with all. The most powerful Thelemic magician is the one who serves others\' evolution while manifesting their own. Genuine True Will is never in conflict with others\' True Will. This requires mature discernment: distinguishing between ego desires (which conflict) and True Will (which harmonizes).',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Identify your core values and authentic desires—begin discerning True Will from personality desires by examining what brings genuine joy versus fleeting satisfaction',
          'Practice daily meditation focused on self-knowledge—sit in silence and listen to your deepest nature without judgment',
          'Study The Book of the Law and understand the basic Thelemic principles: True Will, Love under will, individual freedom, cosmic harmony',
          'Design a personal ritual aligned with your True Will—it can be simple: lighting a candle, speaking intention, visualizing manifestation with full consciousness',
          'Practice the ritual regularly with full attention, emotion, and will—the form matters less than your consciousness infused into it',
          'Keep a practice journal tracking insights about your True Will, shifts in consciousness, and manifestations appearing in your life',
          'Begin integrating magick into daily life—perform simple actions (eating, working, communicating) with full consciousness as rituals of True Will',
          'Study the Tree of Life and begin exploring which sphere most calls to you for deeper work',
          'Connect with others practicing Thelemia—community supports individual will expression and mutual evolution',
          'Continuously refine understanding of True Will as consciousness develops—clarity deepens progressively through practice and experience',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'True Will Over Desire', text: 'The greatest magickal mistake is confusing personal desire with True Will. Take time to discern—True Will brings harmony; ego desire creates conflict.' },
          { title: 'Consciousness Precedes Effect', text: 'Don\'t focus on external results. Focus on shifting consciousness, aligning with True Will, and manifesting full authenticity. External manifestations follow naturally.' },
          { title: 'Ritual Form is Flexible', text: 'Elaborate ceremony is not required. Any action performed with full consciousness, will, and love becomes a powerful ritual.' },
          { title: 'Consistency Compounds Power', text: 'Regular practice—even simple 5-minute rituals daily—builds power far more than occasional intense ceremonies.' },
          { title: 'Service Amplifies Power', text: 'The most powerful magick serves others\' evolution along with your own. True Will naturally seeks the benefit of all.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Book of the Law by Aleister Crowley (foundational Thelemic text)',
          'Liber O vel Manus et Sagittae by Crowley (practical ritual instruction)',
          'The Tree of Life: A Path-Working Journey by Israel Regardie',
          'Condensed Chaos by Phil Hine (chaos magick and personal ritual)',
          'Urban Primitive Magick by Katie Pyne (modern Thelemic practice)',
        ],
      },
    },
  },
  {
    name: 'Reflection & Journaling',
    subName: 'Self-Knowledge',
    emoji: '📖',
    description: 'Shadow work and integration toward self-knowledge and authentic will',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
          { name: 'Shadow Aspects', emoji: '🌑', content: [
            { attribute: 'Definition', value: 'Disowned parts of self—What you deny, repress, or refuse to see in yourself operates you unconsciously' },
            { attribute: 'Rejection', value: 'Shadow forms from parts rejected in childhood, traumatized, or incompatible with identity you adopted' },
            { attribute: 'Projection', value: 'What you hate most in others is usually your own shadow—recognizing this breaks the projection' },
            { attribute: 'Integration', value: 'Bringing shadow into consciousness neutralizes its power and recovers energy it consumed in repression' },
          ]},
          { name: 'False Self', emoji: '🎭', content: [
            { attribute: 'Definition', value: 'Persona—The identity constructed to please others, survive trauma, or fit in; not your authentic nature' },
            { attribute: 'Adaptation', value: 'Useful for navigating society but imprisons True Will when confused with your actual self' },
            { attribute: 'Recognition', value: 'Noticing when you perform instead of express reveals where false self operates' },
            { attribute: 'Liberation', value: 'Releasing false self requires grief for what you\'ve sacrificed and courage to be authentic' },
          ]},
          { name: 'Authentic Self', emoji: '💎', content: [
            { attribute: 'Definition', value: 'True nature beneath conditioning—The self that was before socialization, trauma, and adaptation' },
            { attribute: 'Recognition', value: 'Found in moments of unselfconscious joy, natural gifts, and what you loved before being told what to want' },
            { attribute: 'Expression', value: 'As false self dissolves, authentic self emerges and naturally expresses True Will' },
            { attribute: 'Power', value: 'Authentic self is infinitely more powerful than false self because it\'s aligned with cosmic nature' },
          ]},
          { name: 'Integration', emoji: '🔄', content: [
            { attribute: 'Definition', value: 'Wholeness—Bringing shadow, false self, authentic self, and all experience into unified consciousness' },
            { attribute: 'Not Acceptance', value: 'Integration doesn\'t mean accepting everything you do; it means owning everything, conscious and unconscious' },
            { attribute: 'Embodiment', value: 'As parts integrate, consciousness expands and you become increasingly whole and functional' },
            { attribute: 'Continuous', value: 'Integration is lifelong—deeper layers of shadow emerge, more subtle false selves dissolve, more of True Will manifests' },
          ]},
          { name: 'Truth-Telling', emoji: '✨', content: [
            { attribute: 'Definition', value: 'Honest self-examination without judgment—Seeing what is true about yourself without defense' },
            { attribute: 'Ruthless', value: 'Spiritual bypass is easy—genuine work requires brutal honesty about your motivations and limitations' },
            { attribute: 'Non-Judgment', text: 'Honesty without judgment is crucial: observe without shaming, understand without defending' },
            { attribute: 'Liberation', value: 'Truth tolerated liberates; truth denied enslaves—this is why journaling toward truth is profoundly transformative' },
          ]},
            ]
          },
          {
            name: 'Shadow Work Practices',
            tabs: [
              {
                name: 'Daily Shadow Journaling',
                categories: [
                  {
                    name: 'Daily Shadow Journaling',
                    emoji: '📝',
                    content: [
                      { attribute: 'Practice Overview', value: '📝 PRACTICE\nWrite uncensored truths about yourself daily to bring shadow into consciousness.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Set 15-20 minutes daily, ideally morning or evening.\n(2) Write without editing or judgment. Unfiltered honesty is the goal.\n(3) Prompts: "What did I judge harshly today? What triggered me? What am I ashamed of? What do I secretly want? What did I pretend to feel?"\n(4) Write about: desires you suppress, feelings you deny, traits you hate in others, needs you are ashamed of, anger you hold.\n(5) Don\'t censor. If shameful thoughts arise, write them. The page is safe.\n(6) Review weekly: notice patterns in what appears.' },
                      { attribute: 'Frequency & Safety', value: '⏱️ FREQUENCY\nDaily, 15-20 minutes minimum.\n\n🛡️ SAFETY\nKeep journal in private, secure place. This is your safe space to be completely honest. The journal is for you only.' },
                      { attribute: 'Effects & Signs', value: '💥 EFFECTS\nShame dissolves. Authenticity emerges. Energy tied up in denial becomes available. Self-knowledge deepens.\n\n✨ SIGNS OF PROGRESS\nReccurring themes become visible. You recognize shadow patterns in daily life. Triggers decrease as shadow integrates.' },
                      { attribute: 'Integration', value: 'Over time, the journal becomes a mirror of your consciousness. What you read reveals what you think, feel, hide. As you write, unconscious becomes conscious. This awareness itself is transformative. The journal is not judgment—it\'s witnessing your own truth.' },
                    ]
                  }
                ]
              },
              {
                name: 'Shadow Dialogue & Voice Work',
                categories: [
                  {
                    name: 'Shadow Dialogue & Voice Work',
                    emoji: '🎭',
                    content: [
                      { attribute: 'Practice Overview', value: '🎭 PRACTICE\nDialogue with disowned aspects of yourself to understand and integrate them.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Identify one shadow quality: anger, selfishness, sadness, neediness, pride, desire.\n(2) Invite it to speak: "Angry part, I want to hear you. What do you need? What is your message?"\n(3) Write its response without censoring. Let it speak through your hand.\n(4) Dialogue: You ask questions, it answers. You respond. This is real communication with a disowned part.\n(5) Key questions: "What are you protecting me from? Why did I reject you? What would happen if I embraced you?"\n(6) Listen with compassion, not judgment. Honor its protective function.\n(7) End by thanking it and acknowledging its validity.' },
                      { attribute: 'Frequency & Duration', value: '⏱️ FREQUENCY\nWeekly for 6-8 weeks minimum, rotating through different shadow aspects.\n\n⏱️ DURATION\n20-30 minutes per dialogue.' },
                      { attribute: 'Effects & Integration', value: '💥 EFFECTS\nShadow aspects become less unconscious. They cannot control you if acknowledged. They become allies instead of enemies. Power previously scattered in internal conflict becomes available.\n\n🔄 TRANSFORMATION\nWhat seemed like character flaws reveals itself as misplaced power. Anger becomes protective strength. Selfishness becomes healthy self-care. Sadness becomes sensitivity.' },
                      { attribute: 'Relationship Building', value: 'Shadow dialogue is relationship building. As you establish conscious relationship with disowned parts, they stop running you unconsciously. You move from being possessed by shadow to consciously directing it. This is mature shadow integration.' },
                    ]
                  }
                ]
              },
              {
                name: 'False Self Recognition & Release',
                categories: [
                  {
                    name: 'False Self Recognition & Release',
                    emoji: '🎭',
                    content: [
                      { attribute: 'Practice Overview', value: '🎭 PRACTICE\nIdentify where you perform instead of express, and begin releasing the false self.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) AWARENESS: Notice moments when you\'re performing vs. authentic. What changes? Your voice? Your posture? Your words?\n(2) JOURNALING: Write about your false self: "I adopted this identity to... I play the role of... People expect me to be..."\n(3) ANALYSIS: What parts of this false self were necessary for survival? Which parts still serve? Which imprison you?\n(4) TESTING: Small acts of authentic expression. If your persona is "nice," practice one honest "no." If it\'s "strong," allow one vulnerability.\n(5) GRIEF WORK: As you recognize the persona, let yourself grieve: the time lost, the authentic self sacrificed, the suffering it caused.\n(6) INTEGRATION: The false self has served you. Honor it. Thank it. Consciously choose what to keep and what to release.' },
                      { attribute: 'Frequency & Progression', value: '⏱️ FREQUENCY\nWeekly awareness practice + daily integration.\n\n📈 PROGRESSION\nWeek 1-2: Recognize the false self in detail.\nWeek 3-4: Test small authentic expressions.\nWeek 5-8: Progressively release the persona as authentic self gains strength.' },
                      { attribute: 'Challenges & Support', value: '💢 CHALLENGES\nReleasing false self creates anxiety—you\'ve lived behind this mask for decades. It feels like death. Fear of rejection intensifies.\n\n🛡️ SUPPORT\nRemember: people who matter love your authentic self. Those who only love the persona weren\'t loving you anyway. As you release the mask, real connection becomes possible.' },
                      { attribute: 'Freedom Emerging', value: 'The false self feels normal because you\'ve inhabited it so long. But beneath it is your authentic nature—more creative, more powerful, infinitely freer. The terror of exposure gradually becomes relief. You stop working so hard. Life becomes easier as you express authentically.' },
                    ]
                  }
                ]
              },
              {
                name: 'Authentic Self Cultivation',
                categories: [
                  {
                    name: 'Authentic Self Cultivation',
                    emoji: '💎',
                    content: [
                      { attribute: 'Practice Overview', value: '💎 PRACTICE\nCultivate connection to your authentic nature before socialization and conditioning.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) REGRESSION: Recall moments of complete unselfconsciousness—with close friends, in nature, doing what you love, in childhood before shame.\n(2) ESSENCE QUESTIONS: What were your natural gifts before being told to be practical? What did you love before being told you should? What was naturally you?\n(3) MEDITATION: Sit quietly. Ask internally: "What is my authentic nature? Before all conditioning, what is true about me?"\n(4) LISTEN: Not with thinking mind but with feeling sense. What arises? What feels true? Trust subtle knowing.\n(5) EXPRESSION: Begin expressing what you discover. Small ways at first. Genuine interests, real preferences, honest feelings.\n(6) STRENGTHENING: The more you express authentically, the stronger authentic self becomes. Feed it with expression.' },
                      { attribute: 'Frequency & Deepening', value: '⏱️ FREQUENCY\nDaily 10-minute meditation + consistent authentic expression throughout day.\n\n🌱 DEEPENING\nAs authentic self strengthens, you recognize it in dreams, synchronicities, body sensations. It has its own wisdom and direction.' },
                      { attribute: 'Effects & Power', value: '💥 EFFECTS\nConfidence grows naturally. Power manifests effortlessly. Manifestation accelerates because you\'re no longer working against your own nature.\n\n⚡ TRUE POWER\nAuthentic self is aligned with cosmic nature. Its power is real—not performance, not persona. It is the power of your actual being.' },
                      { attribute: 'Wholeness Path', value: 'Cultivating authentic self is the path to wholeness. As authentic self strengthens, false self naturally relaxes. Shadow integrates. You become increasingly whole. And wholeness is power.' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Shadow Work: Reclaiming Disowned Power',
            content: 'Shadow work is the practice of becoming conscious of the disowned, repressed, and denied parts of yourself. In childhood, you learned which parts of yourself were acceptable and which were dangerous, shameful, or unlovable. Those unacceptable parts didn\'t disappear—they went underground, forming your psychological shadow. The shadow contains both negative qualities (rage, greed, cruelty) and positive qualities you didn\'t develop (power, sensuality, selfishness). These shadow aspects operate you unconsciously until brought to light. Shadow work begins with noticing what triggers you in others, what you judge harshly, what you\'re ashamed of. These are usually shadow manifestations. The practice involves: observing without judgment, dialoguing with shadow aspects, understanding their protective function, integrating their energy into consciousness. As shadow integrates, vast quantities of psychological energy previously bound in repression become available for True Will expression.',
          },
          {
            heading: 'The False Self & The Persona Trap',
            content: 'As children adapt to family systems, we construct a false self—a carefully crafted persona designed to earn love and avoid danger. This false self worked: it helped you survive. But as an adult, it becomes a prison. Many people live entire lives expressing this false self, never discovering their authentic nature. The persona feels normal because you\'ve inhabited it so long. Shadow work reveals how much of your behavior is programmed response rather than authentic expression. Thelemic practice demands you identify and dismantle the false self. This is frightening—it feels like death to the ego that spent decades constructing this identity. But beneath the persona lies your authentic nature—radically freer, far more powerful, and infinitely more creative. The journey from false self to authentic self is the heart of true magical transformation.',
          },
          {
            heading: 'Authentic Self: Your True Nature',
            content: 'Beneath conditioning and trauma lies your authentic nature—the self that existed before you learned to be acceptable. This self is not the false persona but your genuine being. Finding your authentic self requires regression beneath layers of conditioning: What did you love before being told you should? What were your natural gifts before being told to be practical? What parts of yourself were you taught were shameful? Your authentic nature is found in these disowned territories. It\'s also found in moments when you\'re utterly unselfconscious—with close friends, engaged in activities you love, in dreams and imagination. Authentic self is naturally aligned with True Will. When you discover and express your authentic self, manifestation becomes effortless because you\'ve stopped fighting against your own nature. The Great Work involves progressively shedding false self and revealing authentic self.',
          },
          {
            heading: 'Journaling as Consciousness Technology',
            content: 'Writing is one of the most powerful tools for consciousness transformation. Journaling bypasses the rational mind and accesses unconscious material. The practice is simple: write regularly about your experience, your feelings, your inner processes. Write without editing or judgment—allow what wants to emerge. Over time, patterns become visible: recurring themes, shadow manifestations, places where false self operates. Writing also integrates experience: the act of writing creates distance and perspective, turning raw emotion into understood experience. Committed journaling practitioners report: increased self-knowledge, greater clarity about True Will, spontaneous insights and intuitions, emotional release and healing, deepening capacity for authentic expression. The journal becomes a mirror reflecting your consciousness. What you write reveals what you think and feel. As you write, you become increasingly aware and conscious. This awareness itself is transformative.',
          },
          {
            heading: 'Dialogue with Shadow: Meeting Your Disowned Self',
            content: 'Advanced shadow work involves dialoguing with disowned aspects. The technique: identify a quality you dislike in yourself or others, invite that quality to speak through you, and write its perspective. The rage you deny, the selfishness you despise, the weakness you hide—each has a voice and viewpoint. Dialoguing doesn\'t mean accepting its dictates but understanding its function and perspective. A shadow dialogue might reveal: "Your rage protects you from being harmed again" or "Your selfishness saved you when no one else would." As you understand shadow\'s protective function, you can honor it while regaining choice. This is integration—not repressing shadow or being possessed by it, but conscious relationship. The most powerful magicians have excellent shadow relationships: they know their darkness intimately and direct it consciously rather than being unconsciously driven by it.',
          },
          {
            heading: 'Integration: Wholeness as Power',
            content: 'Integration is the culmination of shadow work and self-knowledge. It means gathering all the disowned, rejected, and dissociated parts of yourself back into unified consciousness. This doesn\'t happen overnight—it\'s gradual as layer after layer of shadow integrates, as false self relaxes its defensive grip, as authentic self gains strength. As integration occurs, you become increasingly whole: conflicted parts stop warring, wasted energy from repression becomes available, consciousness expands, and power consolidates. An integrated person has remarkable coherence—their words, actions, and intentions align. They don\'t work against themselves. They have access to their full spectrum of human capacity. Integration also increases compassion: understanding your own shadow makes you far less judgmental of others\' darkness. The integrated practitioner becomes simultaneously more powerful and more compassionate.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin daily journaling: write for 10-15 minutes about your experience, emotions, and inner processes—no editing, just honest expression',
          'Notice your triggers: observe what angers, disturbs, or repels you in others; write about these reactions and what they might reveal about your shadow',
          'Identify your false self: journal about the identity you adopted to survive; notice where you perform instead of express',
          'Interview your authentic self: meditate or write from the perspective of your deepest nature before socialization—what does it want?',
          'Shadow dialogue: choose a disowned quality and allow it to speak through you in writing—listen without judgment to its perspective and protective function',
          'Grieve false self: as you recognize the persona, allow yourself to grieve the sacrifice it required and the authentic self it replaced',
          'Track patterns: review journal entries regularly to identify recurring themes, beliefs, and shadow manifestations',
          'Practice honesty without judgment: observe your motivations, limitations, and shadow aspects with curiosity rather than shame',
          'Integrate insights: as you gain self-knowledge, notice how it changes your choices, relationships, and magical practice',
          'Continue deepening: integration is lifelong—each shadow layer revealed opens access to deeper layers and fuller expression of True Will',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Write Without Editing', text: 'Journaling power comes from unfiltered expression. Don\'t try to write well—write truthfully. Edit later if you like.' },
          { title: 'What You Judge is Your Shadow', text: 'Notice: people who enrage you often carry your disowned qualities. This is a gift—they show you what to integrate.' },
          { title: 'Honesty Without Shame', text: 'Truthful observation of your darkness is spiritual practice. Shame shuts down the process—observe with curiosity instead.' },
          { title: 'Integration Takes Time', text: 'Don\'t expect instant transformation. Shadow work is gradual—trust the process even when change seems invisible.' },
          { title: 'Shadow Dialogue Reveals Truth', text: 'Allow disowned parts to speak. Their perspective is usually more honest and protective than your conscious self-image.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Body Keeps the Score by Bessel van der Kolk (on trauma and integration)',
          'Meeting the Shadow by Connie Zweig (shadow work anthology)',
          'Women Who Run with the Wolves by Clarissa Pinkola Estés (on authentic self)',
          'The Gifts of Imperfection by Brené Brown (on wholeness and vulnerability)',
          'Owning Your Own Shadow by Robert Johnson (Jungian shadow work)',
        ],
      },
    },
  },
  {
    name: 'Symbolic Fluency',
    subName: 'Language of Consciousness',
    emoji: '🔮',
    description: 'Learn the symbolic language through which consciousness communicates',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
              { name: 'Symbol as Frequency', emoji: '📡', content: [
                { attribute: 'Definition', value: 'Vibrational encoding—Symbols are not arbitrary but frequencies of consciousness that activate corresponding states when encountered' },
                { attribute: 'Language', value: 'Symbols are the language the unconscious mind and higher consciousness speak; they bypass rational thought to activate direct knowing' },
                { attribute: 'Activation', value: 'Meditating on symbols, drawing them, wearing them, visualizing them all activate their frequency within consciousness' },
                { attribute: 'Power', value: 'A symbol\'s power is not in its appearance but in the consciousness it embodies and the states it activates' },
              ]},
              { name: 'Personal Symbols', emoji: '🎨', content: [
                { attribute: 'Definition', value: 'Custom meaning—Symbols acquire personal significance through lived experience and meditation' },
                { attribute: 'Creation', value: 'Creating personal symbols concentrates intention and encodes it into visual form that activates that intention when viewed' },
                { attribute: 'Sigils', value: 'Sigils are personalized magical symbols created by the practitioner to encode specific intentions into form' },
                { attribute: 'Talismans', value: 'Empowered objects carrying symbolic meaning that radiate that meaning\'s frequency into the environment' },
              ]},
              { name: 'Archetypal Symbols', emoji: '👑', content: [
                { attribute: 'Definition', value: 'Collective consciousness—Archetypal symbols carry meaning across all humans; they are recognized at the level of collective unconscious' },
                { attribute: 'Tarot', value: 'The 22 Major Arcana are archetypal symbols representing universal stages of consciousness evolution' },
                { attribute: 'Sacred Geometry', value: 'Geometric forms (circle, triangle, pentagram, hexagram) are archetypal symbols with universal meanings' },
                { attribute: 'Elements & Planets', value: 'The four elements and seven planets are archetypal principles that symbols can activate' },
              ]},
              { name: 'Active Symbolism', emoji: '⚡', content: [
                { attribute: 'Definition', value: 'Living engagement—Symbols are not static but dynamic; they speak to you and respond to your attention' },
                { attribute: 'Meditation', value: 'Meditating on symbols reveals layers of meaning; the symbol unfolds as consciousness deepens' },
                { attribute: 'Communication', value: 'Symbols speak to you through dreams, synchronicity, and intuitive knowing when you\'re attuned to their frequency' },
                { attribute: 'Integration', value: 'As you absorb symbols, their meaning integrates into consciousness and transforms how you perceive reality' },
              ]},
              { name: 'Symbolic Literacy', emoji: '📚', content: [
                { attribute: 'Definition', value: 'Reading meaning—Developing ability to recognize and interpret symbols in life, dreams, and synchronicity' },
                { attribute: 'Dreams', value: 'Dreams speak in symbols; learning to decode dream symbols reveals unconscious processes and emerging consciousness' },
                { attribute: 'Synchronicity', value: 'Meaningful coincidences carry symbolic messages; developing symbolic literacy reveals cosmic communication' },
                { attribute: 'Life Patterns', value: 'Life events, repeated themes, and patterns in your experience are symbolic language showing your consciousness evolution' },
              ]},
            ]
          },
          {
            name: 'Symbolic Practice',
            tabs: [
              {
                name: 'Sigil Creation & Activation',
                categories: [
                  {
                    name: 'Sigil Creation & Activation',
                    emoji: '✨',
                    content: [
                      { attribute: 'Practice Overview', value: '✨ PRACTICE\nCreate personalized magical symbols to encode intentions into visual form.' },
                      { attribute: 'Sigil Creation Protocol', value: '📋 PROTOCOL\n(1) INTENTION: Write your intention clearly, e.g., "I manifest financial abundance." Use present tense.\n(2) EXTRACTION: Extract unique letters from your intention (eliminate duplicates).\n(3) COMBINATION: Combine these letters into one abstract unified form, creating a symbol.\n(4) REFINEMENT: Redraw it multiple times, simplifying and perfecting the shape.\n(5) CHARGING: Meditate on it, charge it with emotion and will, or use ritual to empower it.\n(6) RELEASE: Stop consciously thinking about it. The unconscious mind carries the work.' },
                      { attribute: 'Activation Methods', value: '⚡ METHODS\n• Meditation: Gaze at sigil daily for 5-10 minutes\n• Wearing: Draw on body, carry, or wear as jewelry\n• Visualization: Visualize it glowing with power\n• Ritual: Burn it ceremonially or fold it into personal altar\n• Dream work: Focus on it before sleep\n• Sexual energy: Advanced activation through ecstatic states' },
                      { attribute: 'Effects & Timeline', value: '💥 EFFECTS\nSigils work by aligning unconscious with intention. Results appear as synchronicities, opportunities, inspired action.\n\n⏰ TIMELINE\nResults often appear within lunar cycle (28 days). Some immediate, some take months. Patience required.' },
                      { attribute: 'Multiple Sigils & Combinations', value: 'Once skilled, you can work with multiple sigils simultaneously. Some traditions create sigil combinations (multiple intentions woven into one complex symbol). Personal power grows as practice deepens. Sigils become primary magical tool for manifestation.' },
                    ]
                  }
                ]
              },
              {
                name: 'Tarot Meditation & Path Work',
                categories: [
                  {
                    name: 'Tarot Meditation & Path Work',
                    emoji: '🃏',
                    content: [
                      { attribute: 'Practice Overview', value: '🃏 PRACTICE\nWork with Tarot arcana as consciousness map and teaching tool.' },
                      { attribute: 'Card Selection & Meditation', value: '📋 PROTOCOL\n(1) SELECTION: Choose one Major Arcana card to work with (start with The Fool, The Magician, or The Priestess).\n(2) STUDY: Research the card\'s meaning, numerology, symbols, keywords, astrological correspondence.\n(3) MEDITATION: Gaze at the card for 5-10 minutes. Notice what draws you, what symbols speak to you.\n(4) JOURNALING: Write what the card reveals about that stage of consciousness.\n(5) LIVING WITH IT: Carry the card, meditate on it daily for 7-14 days. Let it teach you.\n(6) PROGRESSION: Move to next card when the previous feels integrated.' },
                      { attribute: 'Path Working Technique', value: '🛤️ ADVANCED\nPath working involves visualizing yourself entering the card, meeting guides, receiving teachings, embodying the principle. This deeper practice:  Sit quietly. Visualize yourself inside the Tarot card landscape. Meet the arcane entities. Receive transmission. Return, integrate.\n\nPath working is used for: consciousness development, receiving guidance, integrating specific principles, accelerating spiritual evolution.' },
                      { attribute: 'Timeline & Depth', value: '⏰ FREQUENCY\nDaily meditation: 5-10 minutes per card.\n\n📚 DEPTH\nCan spend 1-4 weeks per card. Full major arcana journey: 6-12 months. Many practitioners work with Tarot their entire lives.' },
                      { attribute: 'Transformation & Wisdom', value: '💎 TRANSFORMATION\nWorking with Tarot arcana is a complete curriculum in consciousness. You internalize archetypal wisdom. Your consciousness becomes aligned with universal principles. The Tarot becomes both teacher and mirror of your evolution. By the time you complete the major arcana, you have transformed.' },
                    ]
                  }
                ]
              },
              {
                name: 'Dream Symbol Recording & Interpretation',
                categories: [
                  {
                    name: 'Dream Symbol Recording & Interpretation',
                    emoji: '💤',
                    content: [
                      { attribute: 'Practice Overview', value: '💤 PRACTICE\nRecord and decode your dreams to access unconscious wisdom.' },
                      { attribute: 'Dream Recording Protocol', value: '📋 PROTOCOL\n(1) PREPARATION: Keep journal by bed. Intend before sleep: "I remember my dreams."\n(2) RECORDING: Upon waking, immediately write dreams in detail—colors, feelings, people, actions.\n(3) DON\'T ANALYZE YET: Just capture what you remember while fresh.\n(4) SYMBOLS: Circle or highlight repeated symbols.\n(5) FEELINGS: Note the emotional tone of each dream.\n(6) PATTERNS: Review weekly for recurring symbols, themes, messages.\n(7) INTERPRETATION: Research symbols, but also ask: What does this mean to me personally?' },
                      { attribute: 'Symbol Interpretation Methods', value: '🔍 METHODS\n• Association: What does this symbol mean in your life?\n• Archetype: What universal principle does it represent?\n• Context: How did the dream situation feel?\n• Body: Where do you feel the dream in your body?\n• Synchronicity: What\'s happening in your life that correlates?\n• Dialogue: Ask the dream: "What are you trying to show me?"' },
                      { attribute: 'Frequency & Effects', value: '⏰ FREQUENCY\nDaily dream recording for 30-90 days minimum.\n\n💥 EFFECTS\nDream recall improves. Symbols become increasingly clear. Dreams reveal unconscious beliefs, upcoming shifts, hidden guidance. Dream wisdom integrates into waking consciousness.' },
                      { attribute: 'Personal Guidance System', value: 'Over time, your dreams become a personal guidance system. The unconscious communicates through symbols. Synchronicities between dreams and life events increase. You develop trust in inner wisdom. Dreams become as important as waking reality—often more honest.' },
                    ]
                  }
                ]
              },
              {
                name: 'Personal Symbol System Development',
                categories: [
                  {
                    name: 'Personal Symbol System Development',
                    emoji: '🎨',
                    content: [
                      { attribute: 'Practice Overview', value: '🎨 PRACTICE\nCreate your own symbol system aligned with your unique consciousness.' },
                      { attribute: 'System Creation Protocol', value: '📋 PROTOCOL\n(1) VALUES: Identify your core values, principles, and goals.\n(2) SYMBOLS: Create visual symbols representing each value. Draw them, find images, or combine elements.\n(3) CORRESPONDENCES: Define what each symbol means to you—colors, elements, numbers, feelings.\n(4) DOCUMENTATION: Create a personal grimoire (book) of your symbols and their meanings.\n(5) ORACLE DECK: Consider creating a personal oracle—cards with your symbols and meanings.\n(6) RITUALS: Use these symbols in personal rituals, meditations, altars, spellwork.\n(7) EVOLUTION: Your symbol system evolves as you evolve. Update it regularly.' },
                      { attribute: 'System Types', value: '🎭 TYPES\n• Elemental: Personal symbols for Air, Fire, Water, Earth\n• Chakra: Symbols representing each energy center\n• Goal-based: Symbols for specific life intentions\n• Mythic: Personal mythology with guardian symbols\n• Hybrid: Combination of personal and traditional symbols\n\nYour system is unique to you. It\'s more powerful than traditional systems because it\'s aligned with your consciousness.' },
                      { attribute: 'Frequency & Integration', value: '⏰ DEVELOPMENT TIME\n2-4 weeks initial creation, ongoing refinement.\n\n🔄 INTEGRATION\nUse symbols daily—meditate on them, visualize them, draw them, wear them. The more you engage, the deeper they integrate and the more they communicate with your unconscious.' },
                      { attribute: 'Personal Power Through Symbols', value: 'Personal symbol systems are some of the most powerful tools available. They align your entire being—conscious and unconscious—with your intentions. As you work with them, they become living forces in your consciousness. They become your personal language of power.' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Symbols as Language of the Unconscious',
            content: 'The rational mind speaks in words and logic; the unconscious mind and higher consciousness speak in symbols and metaphor. Dreams are pure symbol. Intuitions arrive as images before being translated to words. Spiritual insight manifests as symbolic knowing before rational understanding. Thelemic practice involves developing fluency in symbolic language so you can receive communications from your deeper consciousness and the transpersonal realms. This fluency develops through: studying traditional symbolism, working with personal symbols, meditating on symbolic systems (Tarot, astrology, sacred geometry), tracking symbols in dreams and synchronicity, allowing symbols to teach you by living with them.',
          },
          {
            heading: 'Sigils: Intention Encoded in Form',
            content: 'A sigil is a personalized magical symbol created to encode a specific intention into visual form. Sigil creation involves: writing your intention clearly, extracting unique letters, combining them into a unified abstract form, empowering the sigil through meditation or ritual, then releasing it to work. The power of a sigil lies in encoding intention into a form that your unconscious mind recognizes and responds to. When you see your sigil, your unconscious activates the intention encoded within it. Sigils are particularly valuable for: clarifying intentions, removing rational obstruction (the abstract form bypasses conscious doubt), encoding intentions in daily life (you can wear a sigil, carry it, meditate on it), manifesting specific outcomes. Creating personal sigils is one of the most practical Thelemic techniques.',
          },
          {
            heading: 'Tarot as Symbolic Map of Consciousness',
            content: 'The Tarot, especially the 22 Major Arcana, is a complete symbolic map of consciousness and its evolution. The Fool begins as unaware potential; through 22 cards representing archetypal stages, consciousness awakens and integrates until becoming the World—complete, whole, evolved. Working with Tarot symbols through meditation, divination, and path working engages these archetypal stages and facilitates consciousness development. Each card contains layers of meaning: numerological, astrological, elemental, alchemical. Meditating deeply on a single Tarot card for days or weeks reveals increasingly subtle meanings. As you internalize Tarot symbolism, you absorb the wisdom encoded within these archetypal images. Tarot becomes simultaneously a divination tool, a consciousness map, and a training program for magical development.',
          },
          {
            heading: 'Sacred Geometry: The Symbolic Language of Creation',
            content: 'Geometric forms are archetypal symbols expressing universal principles: the circle (unity, wholeness, protection), the square (matter, manifestation, stability), the triangle (spirit, ascent, dynamic will), the spiral (evolution, expansion, integration), the pentagram (human consciousness, elemental mastery), the hexagram (balance of opposites). These symbols are not arbitrary—they express fundamental principles of existence. Meditating on these forms activates the principles they represent. Drawing them focuses intention. Wearing them radiates their frequency. Sacred geometry connects with numerology—the numerical proportions of geometric forms carry meaning. A symbol that incorporates the golden ratio is more powerful than one using arbitrary proportions because the golden ratio occurs throughout nature. Learning sacred geometry means understanding the symbolic language of creation itself.',
          },
          {
            heading: 'Dreams & Synchronicity: The Universe Speaking in Symbols',
            content: 'Your dreams and the synchronicities in your life are the universe speaking to you in symbolic language. As you develop symbolic fluency, you recognize these communications: a dream image recurring—paying attention to its meaning; a sequence of coincidences pointing toward a lesson; a symbol appearing repeatedly in different contexts. Developing symbolic literacy means: keeping dream journals and learning to interpret dream symbolism; noticing synchronicities and asking what they\'re communicating; trusting that coincidences are meaningful; allowing symbols to teach you through patient attention. The more you engage with symbols, the more the universe communicates with you symbolically. What seemed like chance becomes conversation.',
          },
          {
            heading: 'Personal Symbol Systems & Custom Magic',
            content: 'While working with traditional symbols (Tarot, astrology, sacred geometry) is valuable, Thelemic practice emphasizes personal symbol systems. You can create your own symbol system that resonates with your unique consciousness. This might involve: developing personal correspondences (what symbols represent your values, goals, principles), creating a personal oracle system drawing on images and symbols that speak to you, developing personal rituals using symbols meaningful to you, building your own system of meaning rather than purely adopting traditional systems. Personal symbols are often more powerful than impersonal ones because they\'re aligned with your unique consciousness. The goal is symbolic fluency in your own language—able to express and understand your authentic being through symbols that resonate with your deepest truth.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin a dream journal: record dreams daily and research what dream symbols might mean; notice recurring symbols and their evolution',
          'Study basic sacred geometry: meditate on circle, square, triangle, pentagram, hexagram; feel what each symbol activates within you',
          'Explore Tarot: choose one Major Arcana card and meditate on it daily for a week; notice what the symbol reveals about stages of consciousness',
          'Create a personal sigil: write an intention clearly, extract unique letters, combine into an abstract form, meditate on it daily',
          'Track synchronicity: notice meaningful coincidences and symbols appearing in your life; journal about possible meanings',
          'Learn basic correspondences: study how elements, planets, numbers, and colors correspond to symbolic meaning',
          'Create personal symbols: design your own symbols representing your values, goals, and principles; meditate on them regularly',
          'Develop symbolic awareness: when you see symbols in nature, art, or life, pause and ask what they might be communicating',
          'Study symbolic systems: choose one tradition (astrology, Tarot, numerology, sacred geometry) and develop deeper knowledge',
          'Build personal mythology: create stories and symbols that represent your consciousness journey and True Will expression',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Symbols Speak to Deeper Self', text: 'Rational mind may not "get" why a symbol matters. Trust the feeling—symbols speak to wisdom beyond rational mind.' },
          { title: 'Meditation Reveals Layers', text: 'A symbol\'s meaning deepens with continued meditation. What a symbol means on day one differs from day thirty—allow it to teach you.' },
          { title: 'Personal Symbols Are Powerful', text: 'A symbol meaningful to you is more powerful than any famous symbol. Work with what resonates with your unique consciousness.' },
          { title: 'Symbols Connect You to Flow', text: 'The more fluent you become in symbolic language, the more you recognize the universe communicating with you—synchronicity increases.' },
          { title: 'Carry Symbols with You', text: 'Wear, carry, or meditate on symbols daily. The more you engage with them, the more their frequency integrates into your consciousness.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Tarot Bible by Sarah Bartlett (comprehensive Tarot symbolism)',
          'Sacred Geometry by Robert Lawlor (geometric principles and meaning)',
          'Tarot and the Archetypal Journey by Sallie Nichols (Tarot and consciousness)',
          'The Book of Symbols by Taschen (comprehensive symbol dictionary)',
          'Sigil Magic by David Rankine (sigil creation and practice)',
          'The Dream Interpretation Handbook by Catherine Wikholm (dream symbol work)',
        ],
      },
    },
  },
  {
    name: '📜 Enochian Magick 📜',
    isSpacer: true,
  },
  {
    name: 'Tablet & Sigil Work',
    subName: 'Celestial Grammar',
    emoji: '📜',
    description: 'Learn the Enochian system and extract celestial sigils from divine tablets',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
              { name: 'Enochian Alphabet', emoji: '🔤', content: [
                { attribute: 'Definition', value: 'Divine language—21 letters composing the speech of angels and celestial beings' },
                { attribute: 'Structure', value: 'Each letter has a name, form, numerical value, and elemental/planetary correspondence' },
                { attribute: 'Power', value: 'Speaking Enochian letters activates celestial frequencies; writing them encodes divine intention' },
                { attribute: 'Pronunciation', value: 'Each letter has specific pronunciation; correct vibration matters for activation' },
              ]},
              { name: 'The Four Watchtowers', emoji: '🌍', content: [
                { attribute: 'East/Air', value: 'Communication, intellect, clarity, wind, new beginnings' },
                { attribute: 'South/Fire', value: 'Will, passion, transformation, heat, manifestation' },
                { attribute: 'West/Water', value: 'Emotion, intuition, flow, cleansing, mystery' },
                { attribute: 'North/Earth', value: 'Grounding, material manifestation, stability, darkness' },
              ]},
              { name: 'Enochian Tablets', emoji: '📋', content: [
                { attribute: 'Structure', value: 'Four main tablets (East, South, West, North) each containing divine names and letters' },
                { attribute: 'Sub-Elements', value: 'Each tablet divided into regions governing specific celestial powers and beings' },
                { attribute: 'Extraction', value: 'Sigils extracted from letter arrangements on tablets; precise copying essential' },
                { attribute: 'Power', value: 'Tablets are maps of celestial realms; they contain the grammar of creation' },
              ]},
              { name: 'Sigil Extraction', emoji: '✨', content: [
                { attribute: 'Definition', value: 'Drawing sigils from tablet letter patterns—each sigil is a celestial being\'s name in geometric form' },
                { attribute: 'Method', value: 'Connect letters of the name with straight lines; the resulting pattern is the sigil' },
                { attribute: 'Activation', value: 'Once extracted and drawn, sigil is activated through invoking the being\'s name' },
                { attribute: 'Power', value: 'Sigil serves as key for communication and visualization with that celestial being' },
              ]},
              { name: 'Divine Names', emoji: '📿', content: [
                { attribute: 'Definition', value: 'Sacred names of celestial beings and archetypal forces; each contains specific power' },
                { attribute: 'Tetragrammaton', value: 'IHVH—the supreme divine name; source of all power in Enochian system' },
                { attribute: 'Watchtower Names', value: 'Each watchtower has supreme name, three governors, and multiple servant spirits' },
                { attribute: 'Power of Utterance', value: 'Speaking or writing divine names in Enochian activates the being\'s presence and power' },
              ]},
            ]
          },
          {
            name: 'Enochian Techniques',
            tabs: [
              {
                name: 'Alphabet Study & Mastery',
                categories: [
                  {
                    name: 'Alphabet Study & Mastery',
                    emoji: '🔤',
                    content: [
                      { attribute: 'Practice Overview', value: '🔤 PRACTICE\nMaster the Enochian alphabet as foundation for all work.' },
                      { attribute: 'Study Protocol', value: '📋 PROTOCOL\n(1) OBTAIN: Get accurate alphabet charts from reliable source (Golden Dawn system, Tyson, DuQuette).\n(2) STUDY EACH LETTER: Name, form, pronunciation, numerical value, elemental correspondence, spiritual meaning.\n(3) WRITING PRACTICE: Copy each letter repeatedly until the form becomes natural to your hand.\n(4) PRONUNCIATION: Practice speaking each letter until you can vibrate it with power.\n(5) MEDITATE: Each day, work with one letter. Visualize it glowing, speak it, feel its essence.\n(6) COMBINATIONS: Begin combining letters into simple words or names.\n(7) MASTERY: 3-6 months of daily practice develops true mastery.' },
                      { attribute: 'Frequency & Duration', value: '⏱️ FREQUENCY\nDaily practice, 15-20 minutes minimum.\n\n📚 DEPTH\n1-2 weeks per letter for deep learning. Total alphabet: 3-6 months.' },
                      { attribute: 'Effects & Integration', value: '💥 EFFECTS\nThe alphabet becomes living energy in your consciousness. You can speak Enochian words with power. Each letter activates specific celestial frequencies.\n\n✨ SIGNS OF MASTERY\nLetters feel natural when writing. Pronunciation becomes automatic. You feel the power in each letter.' },
                      { attribute: 'Foundation for Everything', value: 'The Enochian alphabet is the foundation of all Enochian work. Sigils cannot be properly extracted without knowing the letters. Names cannot be properly vibrated without understanding their composition. All advanced work builds on this foundation. Mastery here opens all further work.' },
                    ]
                  }
                ]
              },
              {
                name: 'Tablet Study & Copying',
                categories: [
                  {
                    name: 'Tablet Study & Copying',
                    emoji: '📋',
                    content: [
                      { attribute: 'Practice Overview', value: '📋 PRACTICE\nStudy and copy Enochian tablets to internalize celestial maps.' },
                      { attribute: 'Tablet Protocol', value: '📋 PROTOCOL\n(1) OBTAIN TABLETS: Get high-quality reproductions of the four tablets (East, South, West, North).\n(2) BASIC STUDY: Learn the structure of each tablet—its regions, rulers, names.\n(3) DETAILED STUDY: Understand what each region governs and which beings rule it.\n(4) COPYING: Carefully copy an entire tablet by hand. This embeds its structure in consciousness.\n(5) MEDITATION: Gaze at each tablet for 10-15 minutes daily. Let its meaning progressively reveal.\n(6) DEEP DIVE: Choose one tablet to work with deeply for months. Study every detail.\n(7) VISUALIZATION: Visualize entering each tablet\'s space. What do you perceive?' },
                      { attribute: 'Frequency & Timeline', value: '⏱️ FREQUENCY\nDaily or near-daily study.\n\n📅 TIMELINE\n1-2 weeks per tablet for basic learning. 6-12 months for deep understanding. Many practitioners spend years with tablets.' },
                      { attribute: 'Effects & Deepening', value: '💥 EFFECTS\nTablets become internalized maps. You understand celestial realms\' structure. Knowledge becomes embodied wisdom.\n\n🌌 DEEPENING\nThe longer you work with tablets, the more their meaning reveals. Each meditation brings new insights. Tablets are infinite—there is always more to learn.' },
                      { attribute: 'Maps of Reality', value: 'The Enochian tablets are maps of celestial reality. As you study them, you are learning the structure of creation itself. Each letter, each name, each region represents actual celestial powers and principles. The tablets encode the grammar of the universe. Understanding them means understanding reality at the deepest level.' },
                    ]
                  }
                ]
              },
              {
                name: 'Sigil Extraction & Drawing',
                categories: [
                  {
                    name: 'Sigil Extraction & Drawing',
                    emoji: '✨',
                    content: [
                      { attribute: 'Practice Overview', value: '✨ PRACTICE\nExtract celestial sigils from tablets by connecting letters of divine names.' },
                      { attribute: 'Extraction Protocol', value: '📋 PROTOCOL\n(1) CHOOSE BEING: Select a celestial being to work with (start with planetary intelligences).\n(2) FIND NAME: Locate the being\'s Enochian name on the appropriate tablet.\n(3) IDENTIFY LETTERS: Note the exact sequence of letters in the name.\n(4) DRAW CONNECTIONS: Connect each letter to the next with straight lines, creating a continuous pattern.\n(5) RESULTING SIGIL: The pattern created is the sigil—the being\'s name in geometric form.\n(6) REFINE: Redraw the sigil multiple times, refining and perfecting it.\n(7) EMPOWER: Meditate on it. This is the key to contacting that being.' },
                      { attribute: 'Precision & Care', value: '⚠️ CARE REQUIRED\nPrecision matters greatly. Sigils must be drawn accurately. A small error may prevent activation.\n\n✅ VERIFICATION\nDouble-check tablet placements. Verify letter sequences. Practice with simple names first.' },
                      { attribute: 'Timeline & Progression', value: '⏱️ TIMELINE\nEach sigil: 1-2 hours to extract, verify, and refine.\n\n📈 PROGRESSION\nStart: Planetary intelligences (simple names)\nIntermediate: Archangels and governors (longer names)\nAdvanced: Complex multi-letter names, combinations' },
                      { attribute: 'Gateway to Contact', value: 'Once extracted, a sigil becomes your gateway to that being. The sigil is not decoration—it is a functional key. Visualizing, meditating on, or drawing the sigil opens communication. The more precise the extraction, the clearer the contact. Sigil mastery is the gateway to Enochian work.' },
                    ]
                  }
                ]
              },
              {
                name: 'Name Vibration & Invocation',
                categories: [
                  {
                    name: 'Name Vibration & Invocation',
                    emoji: '🎵',
                    content: [
                      { attribute: 'Practice Overview', value: '🎵 PRACTICE\nVibrate Enochian names to activate celestial beings and principles.' },
                      { attribute: 'Vibration Protocol', value: '📋 PROTOCOL\n(1) LEARN PRONUNCIATION: Study the correct pronunciation of the being\'s Enochian name.\n(2) PRACTICE SPEAKING: Speak the name aloud repeatedly, feeling how it sounds.\n(3) TONE FINDING: Find the tone that resonates—some names vibrate at specific pitches.\n(4) INVOCATION: Light a candle. Focus consciousness. Display or visualize the sigil.\n(5) VIBRATION: Speak the name with full power and intention. Feel it resonating through your body and consciousness.\n(6) OPENING: Maintain silence. Listen. Be receptive. The being may respond.\n(7) GROUNDING: Return to normal consciousness. Note any impressions.' },
                      { attribute: 'Frequency & Timing', value: '⏱️ FREQUENCY\nDaily or as needed for contact.\n\n🌙 TIMING\nMany traditions recommend lunar timing (waxing/full for invocation, waning for banishing).' },
                      { attribute: 'Effects & Contact', value: '💥 EFFECTS\nWhen name is vibrated correctly, presence is felt. Consciousness shifts. Being becomes present in the space.\n\n👼 SIGNS OF CONTACT\nTemperature changes, subtle presences, images arising, knowing without words, downloads of information.' },
                      { attribute: 'Power Through Vibration', value: 'Enochian words carry power. The sound itself is not human language—it is celestial language. When pronounced correctly, the name literally calls that being. Vibration is invocation. The more powerful your vibration, the more direct the contact. Mastery of vibration is mastery of contact.' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Enochian Magick: The System of John Dee',
            content: 'Enochian magick is the system recorded by John Dee and Edward Kelley based on angelic communication in the 16th century. It provides a complete symbolic and linguistic system for communication with celestial beings. The Enochian language, alphabet, and tablets form a unified whole: the language is the speech of angels, the alphabet encodes divine principles, the tablets map celestial realms. Unlike other systems that borrow from various traditions, Enochian is internally consistent and complete. It emphasizes clarity of communication with celestial beings and structured ascent through celestial realms toward divine illumination.',
          },
          {
            heading: 'The Enochian Alphabet: Letters as Divine Principles',
            content: 'The Enochian alphabet contains 21 letters, each with multiple correspondences: a form, a name, a numerical value, elemental associations, planetary associations, and spiritual meaning. Each letter encodes a divine principle. When written or spoken, they activate the consciousness associated with that principle. For example, the letter "A" (Aleph in Hebrew) corresponds to Air, intellect, and new beginnings. The letter "D" corresponds to Fire, will, and manifestation. Learning the alphabet means memorizing these correspondences and understanding how to combine letters into words and names. The alphabet is the foundation of all Enochian work.',
          },
          {
            heading: 'The Four Watchtowers: Cosmic Governance',
            content: 'The four Watchtowers divide creation into four elemental and directional domains: East (Air) governs intellect and communication; South (Fire) governs will and transformation; West (Water) governs emotion and intuition; North (Earth) governs material manifestation. Each Watchtower contains multiple regions, each governed by celestial beings. The tablets associated with each Watchtower contain the divine names and sigils of the beings governing those realms. Understanding the Watchtowers means understanding the structure of creation and the powers that govern it. Work with the Watchtowers aligns the practitioner with cosmic forces.',
          },
          {
            heading: 'Extracting Sigils from the Enochian Tablets',
            content: 'Each celestial being\'s name appears in letter form on the Enochian tablets. To extract a sigil: 1) Find the being\'s name on the appropriate tablet, 2) Identify the sequence of letters, 3) Draw a line connecting each letter in sequence, 4) The resulting pattern is the sigil—the being\'s name in geometric form. The sigil serves as a key: when drawn or visualized, it opens communication with that being. The process requires precision—a carelessly drawn sigil may not activate properly. Once extracted, the sigil can be worn, meditated upon, or used in scrying. The sigil acts as a tuning fork: it resonates at the frequency of the being it represents.',
          },
          {
            heading: 'Activating Sigils Through Enochian Invocation',
            content: 'A sigil alone is a map; invocation makes it alive. To activate a sigil: 1) Draw or display it, 2) Speak or vibrate the being\'s name in Enochian, 3) Visualize the sigil glowing with celestial light, 4) Open your consciousness to receive the being\'s presence. The being\'s Enochian name carries its essential frequency. When spoken with focused attention and intention, the name opens a channel of communication. The sigil serves as the focal point for your visualization. As you combine the sigil, the name, and focused awareness, the being becomes present in your consciousness. This is not imagination but a real connection made possible by the Enochian system\'s structure.',
          },
          {
            heading: 'The Tablets as Maps of Reality',
            content: 'The Enochian tablets are not arbitrary arrangements but maps of celestial creation. They encode the structure of reality itself. Each letter placement corresponds to a celestial principle or being. The four main tablets map the four elemental realms at the foundation of manifestation. Above them lies the Tabula Rectilinearum—the Supreme Tablet governing all realms. Understanding the tablets deeply reveals the architecture of creation. Many advanced practitioners spend years studying a single tablet, allowing its meaning to progressively unfold. The tablets bridge the gap between human consciousness and celestial realms—they are the grammar through which we communicate with creation itself.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the Enochian alphabet: learn each letter\'s form, name, and basic correspondence' ,
          'Obtain accurate copies of the four Enochian tablets (from reliable grimoire sources)',
          'Practice writing Enochian letters repeatedly until they become natural to your hand',
          'Choose one simple sigil (such as a planetary intelligence) and practice extracting it from its tablet',
          'Draw the sigil on parchment and study it—meditate on its form and what it represents',
          'Learn the Enochian name of the being whose sigil you\'ve extracted (with correct pronunciation)',
          'Practice speaking or vibrating the Enochian name with focused intention',
          'Experiment with combining sigil visualization with name invocation—notice the felt sense of activation',
          'Keep a journal tracking which sigils you\'ve worked with and what response you experienced',
          'Gradually expand to more complex sigils and names as confidence and sensitivity develop',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Accuracy Matters', text: 'Enochian is precise. One mispronounced letter or misdrawn sigil weakens the work. Take time to get it right.' },
          { title: 'Learn the Alphabet First', text: 'Trying to work with Enochian names without knowing the alphabet is like trying to speak a language without learning letters. Master the foundation first.' },
          { title: 'Pronunciation Affects Power', text: 'Different sources sometimes show different pronunciations. Choose one authoritative source and stick with it consistently.' },
          { title: 'Meditation Deepens Understanding', text: 'Spend time simply meditating on sigils and tablets. Understanding unfolds through contemplation, not intellectual study alone.' },
          { title: 'Respect the System', text: 'The Enochian system is complete and sophisticated. Approach it with reverence and patience. Mastery comes through years of dedicated practice.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Monas Hieroglyphica by John Dee (original Enochian teaching)',
          'A True & Faithful Relation by Meric Casaubon (Dee & Kelley\'s records)',
          'The Golden Dawn Material on Enochian Magick',
          'Enochian Magic: A Practical Manual by Gerald Schueler',
          'The Chicken Qabalah of Rabbi Lamed Ben Clifford (humorous but accurate introduction)',
        ],
      },
    },
  },
  {
    name: 'Scrying & Visioning',
    subName: 'Celestial Vision',
    emoji: '🌌',
    description: 'Use Enochian sigils to scry into celestial realms and meet angelic beings',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
              { name: 'The Aethyrs', emoji: '✨', content: [
                { attribute: 'Definition', value: 'Thirty celestial realms corresponding to Enochian cosmology; each is a distinct plane of consciousness' },
                { attribute: 'Ascending Realms', value: '1st Aethyr (PAZ) is closest to earthly consciousness; 30th Aethyr (TEA/BABALON) is closest to divine source' },
                { attribute: 'Gatekeepers', value: 'Each Aethyr has guardian beings and inhabitants; they grant access to those properly prepared' },
                { attribute: 'Vision', value: 'Scrying into an Aethyr reveals its specific character, being present within that realm\'s consciousness' },
              ]},
              { name: 'Scrying Methods', emoji: '🔮', content: [
                { attribute: 'Crystal Gazing', value: 'Clear quartz sphere focuses astral vision; gaze unfocused into its center to perceive non-physical realms' },
                { attribute: 'Mirror Scrying', value: 'Black mirror (or water bowl) serves as gateway; images arise in the reflective surface' },
                { attribute: 'Sigil Gazing', value: 'Staring at Enochian sigil opens perception of the being it represents; vision naturally arises' },
                { attribute: 'Tablet Gazing', value: 'Focusing on Enochian tablet opens vision of that celestial realm and its inhabitants' },
              ]},
              { name: 'Visioning States', emoji: '👁️', content: [
                { attribute: 'Hypnagogic State', value: 'Consciousness between waking and sleep; visions arise naturally when this state is held' },
                { attribute: 'Meditative Trance', value: 'Deep meditation opens non-physical perception; visions arise spontaneously' },
                { attribute: 'Focused Visualization', value: 'Intentionally creating detailed mental images; consciousness deepens and perceives non-physical reality' },
                { attribute: 'Spontaneous Vision', value: 'Images arise unprompted once proper invocation and sigil work opens channels; deepest form of scrying' },
              ]},
              { name: 'Celestial Encounters', emoji: '👼', content: [
                { attribute: 'Definition', value: 'Meeting angelic beings during scrying; communication becomes possible in non-ordinary states' },
                { attribute: 'Recognition', value: 'Beings reveal themselves through characteristic appearance, light, or felt sense of presence' },
                { attribute: 'Communication', value: 'Contact occurs through telepathy, symbolic imagery, or words heard internally' },
                { attribute: 'Grounding', value: 'Experience remains integrated in consciousness after scrying ends; wisdom becomes accessible' },
              ]},
              { name: 'Safety & Protection', emoji: '🛡️', content: [
                { attribute: 'Invocation First', value: 'Always invoke Enochian protection (Four Archangels, Tetragrammaton) before scrying work' },
                { attribute: 'Clarity of Intention', value: 'Know what realm or being you\'re contacting; vague scrying may attract unclear influences' },
                { attribute: 'Grounding After', value: 'After scrying, consciously return awareness to body; drink water, touch earth, reconnect to physical' },
                { attribute: 'Record Experiences', value: 'Journal all visions immediately; distinguishes genuine contact from imagination or wishful thinking' },
              ]},
            ]
          },
          {
            name: 'Scrying Methods',
            tabs: [
              {
                name: 'Crystal Gazing Practice',
                categories: [
                  {
                    name: 'Crystal Gazing Practice',
                    emoji: '🔮',
                    content: [
                      { attribute: 'Practice Overview', value: '🔮 PRACTICE\nUse clear quartz crystal sphere as gateway to non-physical perception.' },
                      { attribute: 'Preparation & Setup', value: '🕯️ SETUP\n(1) Obtain clear quartz sphere, 2-4 inches in diameter.\n(2) Prepare sacred space: quiet, candlelit, undisturbed for 30 minutes.\n(3) Place crystal where candlelight enters it but does not create reflections in your eyes.\n(4) Establish protection: invoke four archangels and Tetragrammaton.\n(5) Set intention: "I gaze into the crystal for clear vision of [being/realm]."' },
                      { attribute: 'Gazing Protocol', value: '📋 PROTOCOL\n(1) SETTLING: Sit comfortably. Close eyes briefly, then open soft, unfocused gaze into crystal center.\n(2) PATIENCE: Don\'t strain to see anything. Simply gaze with soft attention.\n(3) WAITING: The crystal will begin to cloud, shift, or swirl as consciousness adjusts.\n(4) RECEPTIVITY: Images may arise gradually. Allow them without forcing.\n(5) DEPTH: As practice deepens, you see into crystal center as if looking through tunnel.\n(6) VISIONS: Images of beings, realms, symbols, colors appear spontaneously.\n(7) RETURN: When visions fade, slowly bring consciousness back to room. Close eyes. Ground.' },
                      { attribute: 'Frequency & Timeline', value: '⏱️ FREQUENCY\nDaily or near-daily, 15-30 minutes.\n\n⏰ TIMELINE\nWeek 1-2: Cloud and shimmer appear.\nWeek 3-4: Colors and shapes form.\nWeek 5-8: Recognizable visions arise.\nWeek 8+: Clear contact and communication possible.' },
                      { attribute: 'Effects & Mastery', value: '💥 EFFECTS\nCrystal becomes familiar ally. Vision deepens. Celestial realms become accessible.\n\n👁️ MASTERY\nWith time, gazing at crystal opens perception immediately. You can scry at will. The crystal becomes a window between worlds.' },
                    ]
                  }
                ]
              },
              {
                name: 'Sigil Gazing for Direct Contact',
                categories: [
                  {
                    name: 'Sigil Gazing for Direct Contact',
                    emoji: '✨',
                    content: [
                      { attribute: 'Practice Overview', value: '✨ PRACTICE\nUse Enochian sigils to establish direct contact with celestial beings.' },
                      { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) PREPARATION: Extract or obtain sigil of being you wish to contact.\n(2) SETUP: Place sigil where you can gaze at it comfortably. Establish protection and intention.\n(3) GAZING: Gaze at sigil with soft unfocused attention. Don\'t try to see anything—simply look.\n(4) INVOCATION: Speak or vibrate the being\'s Enochian name with full power and presence.\n(5) WAITING: Maintain attention on sigil. The being\'s presence gradually manifests.\n(6) CONTACT: You may feel presence, subtle shifts in consciousness, or direct perception of the being.\n(7) COMMUNICATION: Ask what you wish to know. Receive information telepathically or symbolically.\n(8) CLOSING: Thank the being. Ground consciousness.' },
                      { attribute: 'Frequency & Progression', value: '⏱️ FREQUENCY\nDaily for deepest work with one being.\n\n📈 PROGRESSION\nWeek 1-2: Presence felt but not clearly seen.\nWeek 3-4: Clear visualization of being.\nWeek 5-8: Communication becomes clear.\nWeek 8+: Being appears at will when sigil is gazed upon.' },
                      { attribute: 'Effects & Relationship', value: '💥 EFFECTS\nDirect relationship with being established. Guidance becomes available. Trust develops.\n\n🤝 RELATIONSHIP\nSigil gazing is relationship building. The more you contact a being, the clearer the communication becomes. Some practitioners work with same being for years, developing deep knowing.' },
                      { attribute: 'Direct Gateway', value: 'Sigil gazing is the most direct form of scrying. You are not exploring abstract realms but establishing relationship with specific intelligence. This is practical Enochian magic at its most effective.' },
                    ]
                  }
                ]
              },
              {
                name: 'Mirror Scrying Technique',
                categories: [
                  {
                    name: 'Mirror Scrying Technique',
                    emoji: '🪞',
                    content: [
                      { attribute: 'Practice Overview', value: '🪞 PRACTICE\nUse black mirror or water bowl as gateway to celestial realms.' },
                      { attribute: 'Preparation', value: '🕯️ SETUP\n(1) Obtain black mirror (commercially available) or use water bowl.\n(2) Place in candlelit space. Position so candlelight illuminates surface without creating reflections.\n(3) Establish sacred space, protection, and clear intention.\n(4) Optional: place sigil or tablet beneath mirror to direct energy.' },
                      { attribute: 'Scrying Protocol', value: '📋 PROTOCOL\n(1) SETTLING: Sit comfortably. Let eyes relax and gaze soften.\n(2) FOCUS: Direct soft gaze into mirror center. Don\'t strain.\n(3) DARKNESS: Allow your awareness to sink into the darkness of the mirror.\n(4) CHANGES: The mirror surface may cloud, shift, or ripple.\n(5) VISION: Images gradually form—beings, realms, symbols, colors.\n(6) IMMERSION: You may feel drawn into the mirror, seeing as if inside another world.\n(7) RECEPTION: Allow visions to unfold. Record them mentally.\n(8) RETURN: Gradually bring awareness back to room and present moment.' },
                      { attribute: 'Frequency & Depth', value: '⏱️ FREQUENCY\nDaily or multiple times weekly, 20-40 minutes.\n\n📊 DEPTH\nMirror scrying can produce detailed, complex visions. Some practitioners prefer it to crystal work.' },
                      { attribute: 'Effects & Visions', value: '💥 EFFECTS\nMirror becomes gateway to non-physical realms. Deep visions become possible.\n\n🌌 VISION TYPES\nCelestial realms, beings, past events, future possibilities, symbolic teachings, personal messages.' },
                    ]
                  }
                ]
              },
              {
                name: 'Aethyr Vision Ascent',
                categories: [
                  {
                    name: 'Aethyr Vision Ascent',
                    emoji: '⬆️',
                    content: [
                      { attribute: 'Practice Overview', value: '⬆️ PRACTICE\nAscend through thirty celestial realms (Aethyrs) via scrying and vision.' },
                      { attribute: 'Preparation', value: '🕯️ PREPARATION\n(1) Master basic scrying (crystal, mirror, or sigil work) first.\n(2) Study the 30 Aethyrs: their correspondences, inhabitants, characteristics.\n(3) Obtain or create sigils for Aethyr rulers (Kerubim of each Aethyr).\n(4) Dedicate time: each Aethyr typically requires 1-4 months of work.\n(5) Journal: keep detailed records of all visions and experiences.' },
                      { attribute: 'Aethyr Ascent Protocol', value: '📋 PROTOCOL\n(1) BEGINNING: Start with 1st Aethyr (PAZ)—closest to earthly consciousness.\n(2) INVOCATION: Call the Aethyr using its sigil and Enochian names.\n(3) VISIONING: Enter scrying state. Allow vision of that Aethyr to unfold.\n(4) EXPERIENCE: Be present in the realm. Notice inhabitants, teachings, lessons.\n(5) INTEGRATION: Spend days or weeks integrating the realm\'s consciousness.\n(6) ASCENT: When ready, move to next Aethyr.\n(7) PROGRESSION: Gradually ascend through all 30 toward final union.' },
                      { attribute: 'Timeline & Progression', value: '⏱️ FREQUENCY\nDaily work with each Aethyr.\n\n📅 TIMELINE\n1 Aethyr per month = 2.5 years for complete ascent.\n1 Aethyr per season = 7.5 years.\nMany practitioners work with Aethyrs entire lives.' },
                      { attribute: 'Transformation & Union', value: '⭐ TRANSFORMATION\nAethyr work is complete curriculum in consciousness evolution. Each realm teaches specific lessons and activates specific capacities. By 30th Aethyr, consciousness approaches divine union. Practitioners report profound transformation, expanded awareness, direct contact with celestial hierarchies. This is the ultimate expression of Enochian scrying work.' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Enochian Scrying: Vision of Celestial Realms',
            content: 'Enochian scrying is the practice of using sigils, tablets, and invocation to open non-ordinary perception and perceive celestial realms. Unlike imagination, genuine scrying reveals information unknown to the scrying consciousness—the details, symbols, and beings that appear are autonomous and often surprising. Scrying requires: proper invocation (establishing protection and creating resonance with the realm), a focal point (crystal, mirror, or sigil), receptive consciousness (entering a state between waking and trance), and patience (allowing visions to arise rather than forcing them). As practice develops, the practitioner perceives increasingly subtle realms and encounters celestial beings directly.',
          },
          {
            heading: 'The Thirty Aethyrs: The Celestial Stairway',
            content: 'The Enochian system maps 30 celestial realms called Aethyrs. The first (PAZ) is immediately above earthly consciousness; each successive Aethyr is increasingly refined and transcendent. The 30th (TEA/BABALON) approaches divine source. Each Aethyr has distinct characteristics, inhabitants, and lessons. Scrying the Aethyrs in ascending order is a complete mystical curriculum: beginning in PAZ where Earth\'s energy still pertains, progressively ascending through realms of increasing subtlety and illumination, ultimately approaching transcendent unity at the 30th. Many practitioners spend years scrying the Aethyrs in sequence, recording visions and integrating the wisdom revealed.',
          },
          {
            heading: 'Crystal Gazing & Scrying Focal Points',
            content: 'A scrying crystal (clear quartz sphere typically 2-4 inches in diameter) serves as a focal point and gateway. The technique: place the crystal where candlelight enters it but does not reflect in your eyes directly. Gaze into the center of the crystal with soft unfocused eyes; do not strain to see anything. As you relax into gazing, the crystal begins to cloud or shift—visions arise from within the crystal itself. Black mirrors work similarly: focus your soft gaze into the black surface without demanding results. Visions naturally arise when consciousness enters receptive states. The focal point anchors consciousness between waking and vision states, allowing both to be perceived simultaneously.',
          },
          {
            heading: 'Sigil Gazing for Direct Contact',
            content: 'Drawing an Enochian sigil and gazing into it becomes a form of contact with that being. The technique: draw the sigil on paper, invoke the being\'s Enochian name, gaze at the sigil with soft unfocused attention. As you maintain attention, the sigil may appear to glow, shift, or expand. The being\'s presence may be felt as a shift in consciousness, a subtle energy, or direct perception. Sigil gazing is more direct than crystal gazing—you are entering direct relationship with a specific being. Over time, sigil gazing becomes a primary scrying method: the practitioner learns to perceive any being by gazing at its sigil. This is one of the most practical Enochian skills.',
          },
          {
            heading: 'Entering Scrying States Through Meditation',
            content: 'The scrying consciousness is not a forced trance but a natural state that arises when normal thinking relaxes. Meditation opens this state: Sit comfortably, establish protection through invoking Enochian names, focus on the sigil or tablet, allow thoughts to quiet naturally. As thinking relaxes, subtle perceptions arise—you may see colors, sense presences, hear words, or perceive a shift to non-physical reality. These are signs the scrying state is opening. Maintain this state without grasping or forcing—allow visions to arise naturally. Some practitioners enter the scrying state quickly; others require weeks of practice. Patience and consistent practice develop skill reliably.',
          },
          {
            heading: 'Meeting Celestial Beings in Vision',
            content: 'Once the scrying state deepens, angelic and celestial beings may reveal themselves. They typically appear: with characteristic form and light, with a sense of vast intelligence and benevolence, with clear communication (telepathic, symbolic, or through words heard internally). Genuine contact is characterized by: autonomy (the being says and does things contrary to your expectations), wisdom (information revealed exceeds your previous knowledge), and transformation (the encounter shifts your consciousness). Not all visions are from celestial beings; some are the mind\'s own imagery. With time, the difference becomes obvious: genuine contact carries a distinct quality, while imagination remains under your control. Learning to distinguish is a fundamental skill.',
          },
          {
            heading: 'Grounding & Integration After Scrying',
            content: 'Scrying work opens consciousness to non-physical perception. Returning to ordinary consciousness must be intentional: Begin by becoming aware of your physical body, your breath, the surface you\'re sitting on. Wiggle your fingers and toes, stretch, feel your weight returning to your seat. Open your eyes fully and look around your normal environment. Drink water or eat a small amount of grounding food. Touch the earth (go outside, hold plants, or press your feet to the ground). These actions anchor consciousness back in the physical body. Record your visions immediately—details fade quickly if not written. The more thoroughly you ground and record, the clearer and more detailed future visions become.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Establish daily meditation practice to develop the receptive consciousness required for scrying',
          'Obtain a clear quartz crystal or black mirror for focal point work',
          'Learn the Enochian alphabet and basic protective invocations in Enochian',
          'Extract sigils of 3-5 celestial beings you wish to contact and practice drawing them',
          'Create sacred scrying space: quiet, candlelit, with protection established through invocation',
          'Practice gazing at your crystal without expectation—notice any subtle shifts in perception',
          'Begin sigil gazing: focus on a sigil, invoke the being\'s Enochian name, observe what arises',
          'When visions begin occurring, record them immediately in detail—descriptions, colors, symbols, words',
          'Research the Aethyrs and begin ascending them in sequence if called to that deeper work',
          'Develop relationship with particular celestial beings through repeated contact and scrying',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Never Force Visions', text: 'Forcing produces only imagination. Relax, trust the process, allow visions to arise naturally. Genuine scrying has a distinct quality different from imagination.' },
          { title: 'Protect Before Scrying', text: 'Always invoke Enochian protection and clarity before any scrying work. Clear intention about which realm/being you\'re contacting prevents random influences.' },
          { title: 'Record Everything', text: 'Journal all visions immediately and in detail. Over time, patterns emerge revealing authentic contact. Details also fade quickly if not recorded.' },
          { title: 'Consistency Over Intensity', text: 'Regular daily practice (even 15 minutes) develops scrying ability more than occasional intense sessions. The consciousness gradually accustoms to non-physical perception.' },
          { title: 'Test the Visions', text: 'Information received can be tested: Does it align with established Enochian knowledge? Is it wisdom that serves evolution? Genuine contact generally passes these tests.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Complete Golden Dawn System of Magic by Israel Regardie (Enochian scrying)',
          'The Enochian Evocation of Dr. John Dee by Geoffrey James',
          'Enochian Magic for Beginners by Donald Tyson',
          'Tarot and the Tree of Life (visualizing celestial realms)',
          'Scrying practices from various mystical traditions (complementary techniques)',
        ],
      },
    },
  },
  {
    name: 'Structured Invocations',
    subName: 'The Aethyr Calls',
    emoji: '📯',
    description: 'Make the Enochian Calls to ascend through celestial realms toward divine source',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
              { name: 'The Four Elemental Calls', emoji: '🔥', content: [
                { attribute: 'First Call', value: 'Invokes the highest powers of Air element (East); establishes clarity and intellectual principle' },
                { attribute: 'Second Call', value: 'Invokes the highest powers of Water element (West); establishes emotional and intuitive principle' },
                { attribute: 'Third Call', value: 'Invokes the highest powers of Fire element (South); establishes will and manifestation principle' },
                { attribute: 'Fourth Call', value: 'Invokes the highest powers of Earth element (North); establishes grounding and material principle' },
              ]},
              { name: 'The Call Formula', emoji: '📣', content: [
                { attribute: 'Address', value: 'Speaks to the being or Aethyr by Enochian name and title' },
                { attribute: 'Acknowledgment', value: 'Recognizes the being\'s power, domain, and characteristics' },
                { attribute: 'Invocation', value: 'Requests the being\'s presence, guidance, and blessing' },
                { attribute: 'Assertion', value: 'States the operator\'s intention and the work to be done' },
              ]},
              { name: 'The Aethyr Sequence', emoji: '⬆️', content: [
                { attribute: 'Sequential Ascent', value: 'The 30 Aethyrs are traditionally worked in ascending order over extended period' },
                { attribute: '1st-10th Aethyrs', value: 'Earth and material consciousness realms; foundation of celestial ascent' },
                { attribute: '11th-20th Aethyrs', value: 'Higher consciousness realms; transcendence of material limitation begins' },
                { attribute: '21st-30th Aethyrs', value: 'Divine and transcendent realms; direct communion with angelic powers approaching source' },
              ]},
              { name: 'Call Vibration', emoji: '🎵', content: [
                { attribute: 'Definition', value: 'Speaking Enochian names and calls with vibrational power; sound carries frequency into non-physical realms' },
                { attribute: 'Pronunciation', value: 'Each Enochian letter and word has specific pronunciation carrying that letter\'s celestial frequency' },
                { attribute: 'Resonance', value: 'Proper vibration opens channels to celestial realms; improper pronunciation weakens the work' },
                { attribute: 'Practice', value: 'Learning correct pronunciation of Enochian is foundational to all call work' },
              ]},
              { name: 'Integration & Descent', emoji: '💫', content: [
                { attribute: 'Definition', value: 'Bringing celestial contact and wisdom back into embodied consciousness and daily life' },
                { attribute: 'Grounding', value: 'After ascending in consciousness, deliberately return to body and earthly awareness' },
                { attribute: 'Expression', value: 'Wisdom received is expressed through action, creativity, and service to others' },
                { attribute: 'Cyclical Path', value: 'Ascent and descent are cyclical—each descent prepares for deeper ascent' },
              ]},
            ]
          },
          {
            name: 'Call Practice',
            tabs: [
              {
                name: 'Four Elemental Calls Foundation',
                categories: [
                  {
                    name: 'Four Elemental Calls Foundation',
                    emoji: '🔥',
                    content: [
                      { attribute: 'Practice Overview', value: '🔥 PRACTICE\nMaster the four elemental Calls as foundation for all Enochian invocation.' },
                      { attribute: 'Preparation', value: '🕯️ PREPARATION\n(1) Obtain Four Elemental Calls from authoritative source (Golden Dawn, Tyson, Crowley).\n(2) Study their Enochian text and English translation.\n(3) Learn correct pronunciation from recordings or trained practitioner.\n(4) Prepare sacred space: elemental correspondences if possible (incense for Air, candles for Fire, water bowl for Water, salt for Earth).\n(5) Establish protection: brief invocation of Four Archangels.' },
                      { attribute: 'Call Protocol', value: '📋 PROTOCOL\n(1) CENTER: Close eyes. Take 3 deep breaths. Feel yourself centered and present.\n(2) INVOCATION: "I call upon the powers of [Element]..."\n(3) FIRST CALL: Speak the First Call (Air) with full vibrational power. Feel it resonate through your being.\n(4) PAUSE: Hold silence for 1-2 minutes. Be receptive. Feel the elemental presence.\n(5) SECOND CALL: Speak the Second Call (Water). Open emotionally and intuitively.\n(6) THIRD CALL: Speak the Third Call (Fire). Feel your will activated.\n(7) FOURTH CALL: Speak the Fourth Call (Earth). Feel grounded and manifest.\n(8) CLOSING: "I give thanks and ground this work." Feel yourself back in physical body.' },
                      { attribute: 'Frequency & Timeline', value: '⏱️ FREQUENCY\nDaily or 3-5 times weekly minimum.\n\n📅 MASTERY TIMELINE\nWeek 1-2: Pronunciation becomes natural.\nWeek 3-4: Calls feel powerful.\nWeek 5-8: Elemental presences clearly felt.\nMonth 2-3: Can perform all four with full power.\nMonth 3+: Foundation established. Ready for Aethyr work.' },
                      { attribute: 'Effects & Integration', value: '💥 EFFECTS\nElemental powers align. Consciousness becomes balanced across four elements. Foundation for all higher work established.\n\n✨ SIGNS OF MASTERY\nCalls become natural. Elemental presences obvious. Day becomes aligned with elemental work. Power accumulates.' },
                    ]
                  }
                ]
              },
              {
                name: 'Aethyr Call Preparation',
                categories: [
                  {
                    name: 'Aethyr Call Preparation',
                    emoji: '📚',
                    content: [
                      { attribute: 'Practice Overview', value: '📚 PRACTICE\nPrepare consciousness for ascending through 30 Aethyrs via structured calls.' },
                      { attribute: 'Foundational Work', value: '📋 PREPARATION\n(1) Master Four Elemental Calls completely (minimum 3 months daily practice).\n(2) Study all 30 Aethyrs: their names, numbers, characteristics, governors.\n(3) Obtain copies of 30 Aethyr Calls in Enochian with translations.\n(4) Learn correct pronunciation of Enochian names and calls.\n(5) Engage in purification: meditation, ethical discipline, honest self-examination.\n(6) Create journal for recording all experiences, visions, teachings.\n(7) Establish sacred space dedicated to Aethyr work.' },
                      { attribute: 'Purification Protocol', value: '🙏 PURIFICATION\nBefore beginning Aethyr work:\n• Daily meditation: 20+ minutes\n• Ethical living: honesty, compassion, non-harm\n• Shadow work: address your limitations and darkness\n• Study: deep understanding of Enochian system and cosmology\n• Intention: clarity about purpose—not ego gratification but spiritual evolution\n\nHigher Aethyrs require higher consciousness. Shortcutting purification produces no results.' },
                      { attribute: 'Timeline & Commitment', value: '⏱️ PREPARATION TIME\n3-6 months of preparatory work before beginning Aethyr calls.\n\n📅 COMMITMENT\nFull Aethyr work: 2.5-10 years depending on frequency and pace. This is serious, lifelong practice.' },
                      { attribute: 'Wisdom & Approach', value: 'Aethyr work is not hobby or casual practice. It is sacred commitment to consciousness evolution. The Aethyrs are real celestial realms with real inhabitants. Approaching with humility, respect, and sincerity opens genuine contact. Approaching with ego or curiosity produces nothing. Approach with your whole being.' },
                    ]
                  }
                ]
              },
              {
                name: 'Call Vibration Technique',
                categories: [
                  {
                    name: 'Call Vibration Technique',
                    emoji: '🎵',
                    content: [
                      { attribute: 'Practice Overview', value: '🎵 PRACTICE\nMaster the art of vibrating Enochian calls with celestial power.' },
                      { attribute: 'Vibration Protocol', value: '📋 PROTOCOL\n(1) GROUNDING: Stand or sit. Feel your connection to earth.\n(2) BREATHING: Take deep breaths. Feel energy moving through your body.\n(3) INTENTION: Focus consciousness on the Call\'s meaning and power.\n(4) TONE: Begin speaking the Call slowly and deliberately.\n(5) POWER: Feel the words resonating through your body—throat, chest, abdomen.\n(6) VIBRATION: Let the words vibrate. They are not sung, not spoken normally—they are vibrated with power.\n(7) TONE FINDING: Some practitioners find the pitch that resonates with the Call.\n(8) FULL EXPRESSION: Gradually increase power until the Call fills the space.\n(9) SILENCE: When complete, hold silence. Let the vibrational echo settle.' },
                      { attribute: 'Progression & Power', value: '📈 PROGRESSION\nWeek 1: Calls sound human, ordinary.\nWeek 2-3: Words begin resonating in body.\nWeek 4+: Vibrational power becomes obvious. Space shifts when you speak.\n\n💪 POWER DEVELOPMENT\nPower increases with practice. Each week, calls become more potent. After months, speaking a call creates measurable shift in consciousness and environment.' },
                      { attribute: 'Frequency & Effects', value: '⏱️ FREQUENCY\nDaily practice, 15-30 minutes.\n\n💥 EFFECTS\nVibrational mastery develops. You learn to project consciousness into non-physical realms through sound. The call becomes living power, not mere words.' },
                      { attribute: 'Gateway to Contact', value: 'Proper vibration is gateway to authentic Enochian work. Without power vibration, calls are empty words. With vibration mastery, you have direct access to celestial realms. This is why the Hermetic traditions emphasize sound, names, and correct pronunciation. Vibration is the medium through which consciousness travels between worlds.' },
                    ]
                  }
                ]
              },
              {
                name: 'Sequential Aethyr Ascent',
                categories: [
                  {
                    name: 'Sequential Aethyr Ascent',
                    emoji: '⬆️',
                    content: [
                      { attribute: 'Practice Overview', value: '⬆️ PRACTICE\nAscend through 30 celestial Aethyrs via structured invocations.' },
                      { attribute: 'Ascent Protocol', value: '📋 PROTOCOL\n(1) BEGIN LOW: Start with 1st Aethyr (PAZ)—closest to earthly consciousness.\n(2) PROTECTION: Invoke Four Archangels and Tetragrammaton.\n(3) INTENTION: Declare your intention to ascend to that Aethyr.\n(4) CALL: Speak the Aethyr Call with full power and vibration.\n(5) WAITING: Hold silence. Remain receptive. The realm\'s presence manifests.\n(6) VISION: As consciousness shifts, scry or visually perceive the Aethyr.\n(7) EXPERIENCE: Be present in the realm. Receive teachings. Meet inhabitants.\n(8) INTEGRATION: Spend days or weeks integrating that Aethyr\'s consciousness.\n(9) ASCENT: When ready, move to next Aethyr.\n(10) CYCLICAL: Upon completing 30th, can return to 1st for deeper work.' },
                      { attribute: 'Pacing & Timeline', value: '⏱️ FREQUENCY\nMinimum: 1 Aethyr per month = 2.5 years total\nModerate: 1 Aethyr per 3 months = 7.5 years total\nDeep: 1 Aethyr per season = 7.5 years total\nIntensive: Multiple Aethyrs weekly = 6-12 months (rare, requires exceptional skill)\n\n👁️ MOST COMMON: 1 per month minimum, often progressing naturally.' },
                      { attribute: 'Effects & Transformation', value: '⭐ EFFECTS\nProfound transformation occurs through Aethyr ascent. Each realm teaches specific lessons and activates specific consciousness faculties.\n\n🔄 TRANSFORMATION MARKERS\n1st Aethyr: Earthly connection purified\nMid Aethyrs: Ego limitations transcended\nHigh Aethyrs (20-30): Direct divine contact\n30th Aethyr: Approaches divine union\n\nMany practitioners report complete restructuring of consciousness and reality understanding.' },
                      { attribute: 'Ultimate Path', value: 'Sequential Aethyr ascent is the ultimate expression of Enochian practice. It is complete curriculum in consciousness evolution. The 30 Aethyrs are like degrees of initiation—each ascending brings deeper illumination. Completing the full sequence results in transformation at the deepest levels. This is the work of lifetimes.' },
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Enochian Calls: The Language of Celestial Communication',
            content: 'Enochian Calls are invocations in Enochian language spoken to celestial beings and realms. They function as both invocation (drawing in divine presence) and as keys that open specific celestial doorways. The Calls are not arbitrary words but precise formulas: each word carries specific frequency, each phrase activates corresponding consciousness, the entire Call aligns human consciousness with celestial reality. The Calls were recorded by John Dee and Edward Kelley and form the foundation of Enochian magick. Practitioners who master the Calls can commune with celestial realms, receive guidance, and participate in their own spiritual transformation.',
          },
          {
            heading: 'The Four Elemental Calls: Foundation of Practice',
            content: 'The first four Calls invoke the four elemental powers in their highest Enochian expressions. Each Call addresses supreme powers of each element: First Call (Air/East) establishes clarity and intellectual illumination. Second Call (Water/West) establishes emotional and mystical opening. Third Call (Fire/South) establishes will and transformative power. Fourth Call (Earth/North) establishes grounding and manifestation. Most practitioners begin with the four elemental Calls before attempting work with specific Aethyrs. These four establish foundation and balance. Many practitioners work with these four regularly as a complete practice, invoking them daily or weekly to maintain alignment and relationship with elemental forces.',
          },
          {
            heading: 'The Thirty Aethyrs: Ascent Through Celestial Realms',
            content: 'Beyond the four elemental Calls lie the Calls to the 30 Aethyrs. These are invocations to ascend through progressively higher celestial realms toward divine source. The 1st Aethyr (PAZ) is closest to earthly consciousness; the 30th Aethyr (TEA/BABALON) approaches supreme divinity. Each Aethyr has specific characteristics and lessons. Working the Aethyrs in sequence (typically over several years—one per month or season) provides a complete curriculum of spiritual development. Many serious Enochian practitioners spend their entire magical career working the Aethyrs, going deeper into each successive realm and receiving increasingly profound wisdom. The journey through the Aethyrs is the ultimate expression of Enochian practice.',
          },
          {
            heading: 'The Mechanics of Calling: How Invocation Works',
            content: 'Invocation works through precise resonance: 1) The operator\'s consciousness aligns with the being/realm through study and intention, 2) The Enochian Call is spoken with proper pronunciation and vibration, 3) The vibrational frequency of the words opens a channel to that realm\'s frequency, 4) The being or realm responds by manifesting its presence and power, 5) Communication or transmission occurs—guidance, blessing, or activation is received. The Call is not commanding (as in Solomonic evocation) but inviting and attuning. The being\'s presence is not compelled but attracted by resonance. This makes Enochian work fundamentally different from commanding spirits—it is communion rather than domination.',
          },
          {
            heading: 'Preparation & Purification for Aethyr Work',
            content: 'Ascending into higher Aethyrs requires increasing purification and consciousness development. Higher realms cannot be perceived while consciousness carries lower frequencies (fear, greed, attachment, confusion). Practitioners preparing for high Aethyr work typically engage in: extended meditation practice to deepen consciousness, ethical discipline to purify intention, study of spiritual philosophy to develop wisdom, regular invocation of lower Aethyrs to build capacity progressively. Some traditions recommend specific diets, fasting, or sexual continence during intensive Aethyr work. The principle: consciousness must match the frequency of the realm being contacted. Attempting to access high Aethyrs without preparation typically produces no results or distorted perceptions.',
          },
          {
            heading: 'The Path of Return: Embodying Celestial Wisdom',
            content: 'As consciousness ascends through the Aethyrs and approaches divine source, eventually descent becomes necessary. The wisdom received in high states must integrate into embodied consciousness. The path of return means: bringing awareness back to the body consciously, grounding the experience in daily consciousness, expressing received wisdom through action and creativity, serving others through what has been learned. Practitioners report that the most profound experiences in highest Aethyrs produce not escape from embodiment but enhanced desire to serve and create. The mystical ascent perfects the human being; wisdom becomes compassion, power becomes service. This is the ultimate purpose of Aethyr work: not transcendence away from the world but transformation within the world.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn the Enochian alphabet and basic pronunciation thoroughly',
          'Study the four elemental Calls and their meanings (from authoritative source)',
          'Record the four Calls in Enochian so you can read them while invoking',
          'Prepare sacred space: clean, quiet, with elemental correspondences if possible',
          'Establish protection through brief invocation of the four Archangels',
          'Begin with the First Call (Air/East) spoken with respect and vibrational awareness',
          'After speaking the Call, maintain silence and open consciousness to any response',
          'Record the date, your experience, and any insights received in a journal',
          'Repeat the four Calls regularly (daily or weekly) until they become natural to you',
          'Once comfortable with the four Calls, begin studying the 30 Aethyr Calls',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Pronunciation Matters Greatly', text: 'Enochian is a precise language. Mispronunciation weakens the Call significantly. Spend time learning correct sounds before invoking.' },
          { title: 'Vibration Over Words', text: 'The power comes from speaking the words as living vibration, not merely reciting them. Feel the words resonating through your body and consciousness.' },
          { title: 'Begin with Foundation', text: 'Master the four elemental Calls completely before attempting the Aethyr Calls. The foundation must be solid.' },
          { title: 'Space After Calling', text: 'After speaking a Call, create silent space to listen and perceive. Celestial response often arrives as subtle shifts in consciousness.' },
          { title: 'Record Everything', text: 'Journal all Calls made and all experiences, no matter how subtle. Over time, patterns emerge showing progression and response.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Golden Dawn: The Complete Curriculum of the Adeptus Minor (Enochian Calls)',
          'Enochian Magic for Beginners by Donald Tyson (modern presentation of the Calls)',
          'A True & Faithful Relation by Meric Casaubon (original Dee and Kelley records)',
          'The Enochian World of Aleister Crowley by Lon Milo DuQuette (advanced interpretation)',
          'Audio recordings of Enochian Calls pronounced correctly for reference',
        ],
      },
    },
  },
];

export default function EnochScreen() {
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
    const witchUnlocked = isUnlocked('witchEnoch') || isTest('witchEnoch');
    const isLocked = !hasSubscription && !witchUnlocked;
    setIsWitchLocked(isLocked);

    if (!isLocked) {
      // If unlocked and no subscription, 5% chance to show an ad
      if (!hasSubscription && Math.random() < 0.05) {
        try {
          await AppodealService.cacheAds();
          await AppodealService.showRewardedAd();
        } catch (error) {
          console.error('[GreenWitchScreen] Error showing ad:', error);
        }
      }
      // Navigate to PracticeDetail at root level
      try {
        console.log('Navigating to PracticeDetail');
        navigation.navigate('EnochPracticeDetail', { practice });
      } catch (error) {
        console.error('Navigation error:', error);
        console.log('Current navigation state:', navigation.getState?.());
      }
    } else {
      setShowLockModal(true);
    }
  };

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';

  const handlePracticePress = useCallback(async (practice: any) => {
    await checkSubscriptionAndNavigate(practice);
  }, [navigation, isUnlocked]);

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>😇 Enoch</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Divine Wisdom & Celestial Communion
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {GREEN_WITCH_PRACTICES.map((practice) => (
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
                  <Text style={[styles.practiceLabel, { color: mutedColor, fontSize: 12, fontStyle: 'italic' }]}>
                    {practice.subName} - {practice.description}
                  </Text>
                </View>
                </TouchableOpacity>
              )
            ))}
          </View>
        </View>
      </ScrollView>

      <WitchLockOverlay
        witchType="Enoch"
        lockKey="witchEnoch"
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  practiceStack: {
    marginBottom: 20,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  practiceLabel: {
    fontSize: 13,
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
