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
import { AIR_CRYSTALS } from '../data/airCrystalsDatabase';
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
    name: 'Spirit Communication',
    emoji: '👻',
    description: 'Connect with spirits and receive their guidance and wisdom',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Communication Methods', emoji: '🔮', recipes: COMMUNICATION_METHODS },
          { name: 'Spirit Types', emoji: '👻', recipes: SPIRIT_TYPES },
          { name: 'Protection & Setup', emoji: '🛡️', recipes: PROTECTION_SETUP },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Overview', content: 'Spirit communication is direct conversation with non-physical beings across the veil separating material and spiritual realms. Spirit witches understand that reality includes both physical and spiritual dimensions, and that communication with spirits is not fantasy—it\'s genuine relationship with beings from other dimensions. Spirits can teach, guide, warn, and support. They offer perspectives beyond human limitation and access to wisdom from other realms. This practice requires strong protection magic, clear boundaries, discernment about spirit identity, and respect for spirits as sovereign beings. Spirit communication deepens spiritual understanding, provides guidance, and creates profound sense of connection to greater whole. For some, it\'s calling; for others, it\'s supplement to regular practice. Either way, it\'s serious work deserving proper training and care.' },
          { heading: 'Establishing Spirit Communication Setup', content: 'Create dedicated space for spirit work: a room, altar, or corner where you consistently communicate. Cleanse space regularly with salt, smoke, or water to maintain clarity. Protect with: banishing circle before each session, protective symbols or sigils, calling only aligned spirits, expressing clear boundaries (\'only benevolent spirits\'), establishing intention (\'I welcome guidance and protection\'). Tools aid communication: journal for recording messages, candles for creating sacred space, oracle cards, crystals for amplifying perception, singing bowl for raising vibration. Some practitioners work better in complete silence, others with soft music. Establish routine—regular communication at specific times strengthens connection. Consistency matters more than elaborate setup.' },
          { heading: 'Discernment: Knowing Your Spirits', content: 'Not all spirits are benevolent—discernment is critical. Trustworthy spirits: bring clarity and peace, offer guidance aligned with your highest good, respect your boundaries and free will, feel light and loving, require no unhealthy sacrifice, communicate clearly without confusion. Problematic spirits: demand increasingly uncomfortable things, create confusion or conflict, make you feel drained or anxious, are evasive about identity, require offerings/energy you can\'t easily give, push you toward harmful actions. Test spirits by: asking their name and intention clearly, checking if messages feel aligned with your values, noticing your emotional response (peace vs. unease), inviting higher guides to verify identity, ignoring any spirit that fails these tests. Trustworthy spirits prove themselves through consistent, loving behavior over time.' },
          { heading: 'Protection & Boundary Setting', content: 'Spirit work without protection is dangerous—unwanted entities can attach and cause problems. Always: create sacred circle before communication (visualize protective ring of light), call on your guides and higher self for protection, specify that only aligned spirits may communicate, use protective symbols or words. Protection methods: iron (ancient protectant against harmful spirits), salt (creates barriers), black tourmaline (shields from unwanted energy), prayers or affirmations (\'Only light-filled spirits in this space\'), visualization of protective light, calling on Archangel Michael or your tradition\'s protective beings. After sessions: close circle formally, ground yourself into body, eat something grounding, wash hands. Never leave yourself open to spirit contact—proper closing is essential.' },
          { heading: 'Automatic Writing & Spirit Messages', content: 'Automatic writing allows spirits to communicate through your hand. Prepare: cleanse space, protect, set intention. Hold pen loosely over paper, clear your mind, invite specific spirit or guide to communicate. Let hand move without conscious direction—message will flow. Trust the process; don\'t question while writing. Afterward, read what\'s written. Some information is immediate wisdom, some requires contemplation. Practice regularly to develop clarity and strength of connection. Start with trusted guides or ancestors before attempting with unknown spirits. Quality improves with practice. Keep all automatic writing for patterns and later understanding. Some profound spiritual teachings come through automatic writing.' },
          { heading: 'Ancestral Veneration & Guidance', content: 'Ancestors are the most accessible and safest spirits to work with—they are invested in your wellbeing and success. Create ancestor altar with: photos of deceased family members, candles, offerings (food, drink, flowers, incense). Light candles and invite ancestors to communicate. Ask for guidance on family patterns, healing, or specific situations. Many ancestors are eager to help—they\'ve been waiting for invitation. Ancestor work strengthens you spiritually and heals generational patterns. Honor ancestors even if you didn\'t know them personally—their blood runs through your veins. Regular ancestor communication deepens sense of belonging and provides powerful guidance rooted in love.' },
          { heading: 'Channeling Wisdom Beyond Self', content: 'Spirits can offer perspectives beyond your individual knowledge and experience. Ask spirits for guidance on challenges you\'re facing, seek creative inspiration, request protection for loved ones, ask for healing energy, request validation or reassurance. Spirits often provide surprising wisdom—the perspective that solves your problem rarely comes from your conscious mind alone. Open yourself to receive without judgment: write down what comes even if it doesn\'t make sense immediately. Often, weeks later, you understand the message. Building relationship with guides creates ongoing conversation where wisdom comes naturally. Over time, you internalize their guidance—their wisdom becomes available to you directly.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Cleanse and protect your body with intention—you\'re opening to subtle realms and need strong boundaries',
          'Create dedicated space for spirit communication with altar or corner you keep clean and intentional',
          'Establish protection ritual: visualize circle of light around you, call on guides and higher self',
          'Journal or automatic writing: set intention, calm your mind, invite a trusted guide to communicate',
          'Ask a simple question and listen for answer—may come as thought, feeling, visual, or knowing',
          'Record all messages immediately—they fade quickly and reviewing later reveals patterns',
          'Thank the spirit for communicating, formally close your communication session and ground yourself',
          'Work with trusted guides/ancestors first before attempting communication with unfamiliar spirits',
          'Establish regular communication schedule—weekly or monthly sessions create stronger connections',
          'Develop discernment by noticing which spirits bring peace and clarity versus confusion and unease'
      ],
      },
      tips: { title: 'Tips & Safety', items: [
          { title: 'Protection is Non-Negotiable', text: 'Always create protection before spirit work. Establish clear boundaries about which spirits are welcome. Never leave yourself open to astral contact.' },
          { title: 'Start with Ancestors', text: 'Begin spirit communication with ancestors or assigned guides—they\'re invested in your wellbeing and safest to work with before advancing practice.' },
          { title: 'Test Spirit Identity', text: 'Always ask spirits their name, intention, and source. If they can\'t or won\'t answer clearly, send them away. Trust your intuitive unease.' },
          { title: 'Ground After Work', text: 'Spirit communication raises your vibration and opens subtle perception. Ground thoroughly afterward: eat, drink water, touch earth, move your body.' },
          { title: 'Record Everything', text: 'Document all spirit communications—messages, dates, circumstances. Patterns emerge over time revealing spirit identities and reliability of guidance.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Spirits Speak by Rachel Bea',
          'Psychic Self-Defense by William W. Atkinson',
          'Ancestral Veneration guides and ancestor altar resources',
          'Spirit communication oracle decks and divination tools',
          'Books on protective magic and working with guides'
        ],
      },
    },
  },
  {
    name: 'Angels & Demons',
    emoji: '😇',
    description: 'Work with divine and dark forces with wisdom and discernment',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Angels', emoji: '👼', recipes: ANGELS },
          { name: 'Demons', emoji: '👹', recipes: DEMONS },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Overview', content: 'Angels and demons represent the spectrum of forces beyond human dimension: divine beings aligned with creation, growth, and goodness versus chaotic forces aligned with destruction, chaos, and self-interest. Spirit witches work with both to understand duality and maintain balance. Calling angels for protection, healing, guidance, and divine will alignment strengthens connection to highest good. Recognizing and respecting dark forces (without inviting harm) provides understanding of universal forces. Most importantly, shadow work—integrating your own darkness—is essential spiritual maturity. Many practitioners focus exclusively on light work; advanced practitioners understand that darkness itself isn\'t evil—it\'s power, mystery, and transformation. Working wisely with both light and dark creates complete spiritual development.' },
          { heading: 'Calling Angels & Divine Beings', content: 'Archangels respond to sincere requests for protection and guidance. Call Michael for strength and protection from harm: \'Archangel Michael, I ask for your powerful protection. Shield me from all negativity. Surround me with divine light.\' Gabriel brings messages and creativity: \'Archangel Gabriel, I ask for clear divine communication and creative inspiration.\' Raphael brings healing: \'Archangel Raphael, I ask for healing for this situation. Bring wholeness and restoration.\' Call with respect, specific intention, and open heart. Angels respond to genuine need and sincere request. Many people report feeling warmth, peace, or light presence after calling angels. Build relationship through consistent calling and gratitude.' },
          { heading: 'Shadow Work: Integrating Darkness', content: 'Shadow self contains everything you\'ve rejected about yourself: anger you suppress, sadness you won\'t feel, fear you deny, destructive impulses you disown. Unintegrated shadow creates projection—you see your darkness in others and judge them harshly. Integration involves: acknowledging your shadow aspects with compassion (\'I have anger, selfishness, and fear; that\'s part of being human\'), understanding how these arise from survival needs, expressing them safely (journaling, boxing, screaming into pillow), using shadow qualities constructively (anger becomes passionate advocacy, selfishness becomes healthy boundaries, fear becomes wise caution). Integrated shadow is powerful—you own all your qualities and channel them wisely. Shadow integration is ongoing spiritual work, not one-time event.' },
          { heading: 'Discernment Between Light & Dark', content: 'How to distinguish divine beings from deceptive forces: Divine beings bring clarity, peace, alignment with your highest good, respect your free will, require no inappropriate sacrifice, offer guidance without coercion. Deceptive forces create confusion, cause anxiety, push toward self-harm or harm to others, demand increasingly problematic things, impersonate divine beings, appeal to ego or destructive impulses. If you\'re unsure about a being: call on Archangel Michael (\'Michael, reveal truth of this being\'), trust your intuition (unease = danger), ask the being direct questions about its nature and intentions, notice your emotional response (peace vs. unease). Divine beings prove themselves through consistency and loving alignment. Deceptive forces reveal themselves through increasingly troubling demands.' },
          { heading: 'Protection from Negative Forces', content: 'Protections against unwanted dark forces: Create sacred space with intention and blessing, call protective angels/guides before work, wear protective symbols or stones, establish boundaries (\'Only divine light in this space; all harm is denied entry\'), use salt, iron, or protective herbs, invoke your faith tradition\'s protective powers, pray or affirm protection regularly. If you feel attacked or threatened by dark forces: call immediately for protection (archangel Michael is powerful), cease any work that seems to invite harm, strengthen spiritual practice, work with healer or experienced practitioner if needed. Most dark forces avoid practitioners with strong protection and sincere spiritual commitment. Dark forces prey on unprotected, afraid, or complicit practitioners.' },
          { heading: 'Ethical Working with Power', content: 'All magical work, whether light or dark, should serve your highest good and harm none. Avoid: curses, hexes, or magic designed to harm even if you\'re angry; manipulation through magic; controlling others with spells; revenge magic. These attract karmic return and dark entity attachment. Instead: work for your own healing and growth, support others\' free will, use power for protection and justice, resolve anger before magical work. Advanced practitioners understand that truly dark magic (meant to harm) backfires—both karmic consequence and because you attract darker entities by engaging in darkness. Work with light beings by maintaining integrity and alignment with highest good.' },
          { heading: 'Relationships with Guide Beings', content: 'Over time, particular divine beings may form ongoing relationships with you—these are your guides. They choose to work with you based on your alignment and spiritual growth. Nurture these relationships through: regular prayer or conversation, gratitude for their support, aligning your actions with their teachings, asking for guidance, trusting their wisdom. Some practitioners develop lifelong relationships with particular angels or ascended masters. Others work with different guides at different life phases. Be open to which divine beings call to you. Respect your guides\' authority while maintaining your free will—they guide; you choose. Divine beings respect your autonomy and won\'t force anything.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Learn about archangels and their specific purposes—Michael, Gabriel, Raphael as starting points',
          'Create simple protection prayer or affirmation you can use before spiritual work',
          'Call on Archangel Michael for protection using sincere, respectful request',
          'Keep journal of responses—many people notice peace, warmth, or synchronicities after calling angels',
          'Begin shadow work: journal about your anger, fear, and selfishness with compassionate acceptance',
          'Notice where you project shadow onto others—this reveals what you haven\'t integrated in yourself',
          'Practice distinguishing between divine and deceptive beings: notice your emotional response to each',
          'Establish regular practice of calling divine beings for protection and guidance',
          'Work with one archangel deeply before expanding to others',
          'Record all angel encounters and guidance for later understanding and pattern recognition'
      ],
      },
      tips: { title: 'Tips & Safety', items: [
          { title: 'Angels Respect Free Will', text: 'Divine beings will guide but never force. They respect your autonomy and decisions. If feeling coerced, the being isn\'t divine.' },
          { title: 'Shadow Integration First', text: 'Do shadow work before attempting to work with dark forces. Unintegrated shadow makes you vulnerable to manipulation by darker entities.' },
          { title: 'Protect Before Opening', text: 'Always invoke protection before opening to spiritual beings. Never open to astral contact without strong boundaries in place.' },
          { title: 'Archangel Michael Always', text: 'When in doubt, call on Archangel Michael. His protection is powerful and immediately effective. Build relationship with him as your primary protector.' },
          { title: 'Integrity Matters', text: 'Divine beings are drawn to integrity, honesty, and sincere commitment to growth. Maintain these qualities and divine assistance flows naturally.' }
      ]},
      resources: { title: 'Resources', items: [
          'The Encyclopedia of Archangels by Marta Stansfield',
          'Psychic Self-Defense by William W. Atkinson',
          'Shadow Work guides and integration resources',
          'Books on your tradition\'s angelic hierarchy and protection practices',
          'Divine being oracle decks and communication tools'
      ],
      },
    },
  },
  {
    name: 'Shadow Work',
    emoji: '👤',
    description: 'Heal and integrate your repressed aspects for wholeness',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Emotional Integration', emoji: '💔', recipes: EMOTIONAL_INTEGRATION },
          { name: 'Shadow Practices', emoji: '📔', recipes: SHADOW_PRACTICES },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Overview', content: 'Shadow work is psychological and spiritual practice of facing the aspects of yourself you\'ve rejected, denied, or repressed. Everyone has shadow—it\'s not abnormal or broken. Shadow develops because certain qualities weren\'t safe or acceptable in your original environment. To survive, you learned to suppress them. Now, as an adult, keeping shadow repressed costs energy and prevents wholeness. Shadow work involves: recognizing disowned aspects, understanding why you rejected them, expressing them safely, integrating them as acceptable parts of yourself, developing mature ways to express them. This work is uncomfortable—it requires facing shame, anger, and pain you\'ve avoided. But it\'s essential for spiritual maturity, healthy relationships, and powerful magic. Witches with integrated shadow are significantly more effective than those with extensive repression.' },
          { heading: 'Anger & Rage Integration', content: 'Many people, especially women and people taught to be \'good,\' suppress anger. Unintegrated anger becomes: passive aggression, resentment, health problems, depression, or explosive outbursts. Integration means: acknowledging you have valid anger, understanding what triggered it (boundary violation, injustice, disrespect), expressing anger safely (boxing, screaming into pillow, heavy exercise, journaling), using anger constructively (taking action against injustice, setting boundaries, passionate advocacy). Angry people aren\'t bad—they\'re awake to injustice. Mature anger channels into powerful action. Suppressed anger creates illness and ineffectiveness. Witches who\'ve integrated their anger become formidable practitioners—their power is uncompromised by internal conflict.' },
          { heading: 'Shame & Guilt Integration', content: 'Shame is feeling wrong as a person. Guilt is feeling wrong about an action. Both are common shadow components. Explore shame by: naming specific shame-creating beliefs (\'I\'m selfish,\' \'I\'m unworthy,\' \'I\'m broken\'), tracing origins (who taught you this?), examining if it\'s true or internalized judgment, grieving what you couldn\'t be for others, forgiving yourself for being human. Guilt similarly: name the action you feel guilty about, explore if genuine harm occurred, make amends if possible and ethical, learn the lesson, forgive yourself. Shadow often contains shame about your sexuality, desires, anger, or needs. Recovering from shame is profound healing that transforms life.' },
          { heading: 'Fear Integration', content: 'Fear is often deeply buried shadow. Integrate fear by: acknowledging specific fears without judgment, understanding when they developed (trauma, modeling, environment), distinguishing real danger from old programming, consciously moving toward feared situations slowly, noticing that surviving fear strengthens you. Fear of your own power is especially common in witches—explore if you\'re afraid of being \'too much,\' too powerful, too visible, too sexual, too angry, too ambitious. These fears often come from witnessing others punished for power. Integration means deciding consciously that your power is acceptable and necessary. Witches who\'ve integrated fear of power are unstoppable.' },
          { heading: 'Shadow Journal Work', content: 'Dedicated shadow work journaling: write \'My shadow contains...\' and free-write everything that comes—don\'t edit or judge. Write about qualities that trigger intense judgment in others. Write about things you\'re ashamed of. Write letters to people you resent (never send). Write dialogue between you and your shadow, asking what it needs and what gifts it offers. Burn or destroy shadow journals when complete—the act of writing releases the pattern. Regular shadow journaling brings unconscious material to consciousness where it can be addressed. Many witches report profound shifts through consistent shadow work.' },
          { heading: 'Dreams & Shadow Healing', content: 'Dreams often reveal shadow—nightmares especially show what you\'re refusing to see. Nightmares show shadow material trying to get your attention. Journal dreams immediately upon waking, especially disturbing ones. Ask what the nightmare is teaching or showing. Notice recurring themes—these indicate ongoing shadow material. Have dialogue with nightmare characters: what do they represent? What are they angry about? What do they need from you? Some nightmare characters are genuinely your shadow demanding integration. Others represent genuine dangers—discern carefully. Lucid dreaming in nightmares allows you to face shadow directly and negotiate peace.' },
          { heading: 'Shadow as Power Source', content: 'Integrated shadow becomes your greatest power source. Accepting your anger makes you formidable. Accepting your selfishness creates healthy boundaries. Accepting your ambition allows you to achieve goals. Accepting your sexuality expresses it authentically. Accepting your destructive impulses means you can channel them into clearing away what no longer serves. Shadow integration is the difference between powerful witches and ineffective ones. Witches who\'ve done this work are real force in the world—their magic is uncompromised by internal conflict. Shadow work is uncomfortable but transformative. This is essential witchcraft foundation.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Notice what you judge harshly in others—anger, selfishness, neediness, ambition, sexuality',
          'Journal: Does that quality exist in me that I\'ve rejected or suppressed?',
          'Write about when you first learned that quality was \'bad\' or \'wrong\'',
          'Write about what gifts or strengths that quality might offer if integrated',
          'Identify one shadow aspect—anger, fear, selfishness, shame—to focus on',
          'Create safe expression outlet: boxing bag for anger, journal for shame, dance for sexuality',
          'Journal dialogue with your shadow: \'Shadow, what do you need from me?\'',
          'Notice dreams, especially nightmares, as shadow communication',
          'Consciously practice expressing the shadow quality constructively in small ways',
          'Celebrate integration milestones—first time expressing anger appropriately, first time asking for your needs'
      ],
    },
      tips: { title: 'Tips & Safety', items: [
          { title: 'Shadow Work is Uncomfortable', text: 'Expect to feel shame, anger, fear, and sadness during shadow work. This is normal and necessary. The discomfort means growth is happening.' },
          { title: 'Don\'t Suppress Again', text: 'Once you see shadow, you can\'t unsee it. The work is integrating it, not pushing it back down. Integration takes time—weeks or years for deep shadow.' },
          { title: 'Projection Awareness', text: 'Strong reactions to others\' behavior are gold for shadow work. Use intense judgments as information about your own disowned qualities.' },
          { title: 'Professional Support Helps', text: 'Shadow work done with therapist or counselor alongside witchcraft accelerates healing. Some shadow stems from trauma and benefits from professional support.' },
          { title: 'Shadow is Not Evil', text: 'Your shadow isn\'t bad or wrong—it\'s human. Every person has shadow. Integration doesn\'t make you perfect; it makes you whole and real.' }
      ]},
      resources: { title: 'Resources', items: [
          'Shadow Work Made Simple by Teal Swan',
          'Reclaiming Your Shadow Self by Linda J. Hall',
          'Own Your Shadow by William A. Miller',
          'The Body Keeps the Score by Bessel van der Kolk (trauma understanding)',
          'Therapy or counseling for deep shadow work support'
      ],
      },
    },
  },
  {
    name: 'Dream Magic',
    emoji: '🌙',
    description: 'Work with dreams for healing, guidance, and spiritual growth',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Dream Types', emoji: '💭', recipes: DREAM_TYPES },
          { name: 'Dream Practices', emoji: '📖', recipes: DREAM_PRACTICES },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Overview', content: 'Dreams are communication from your subconscious, spirits, guides, and higher self. Every night in dream states, you\'re actively engaging in other realms and processing emotional/spiritual material. Spirit witches recognize dreams as crucial to magical practice. Working consciously with dreams means: remembering them clearly, understanding their messages, using them for healing and guidance, developing lucid dreaming ability, consciously visiting other realms, receiving spirit communication. Dreams are where much spiritual growth happens—often more than in waking practice. Many important magical knowledge and guidance comes through dreams. Treating dreams seriously, journaling consistently, and working with them intentionally creates access to deeper wisdom.' },
          { heading: 'Symbolic Dream Work', content: 'Dreams speak in symbols—your personal symbols, collective symbols, and archetypal symbols. Water represents emotions, houses represent self, being chased represents avoidance, falling represents loss of control. But symbols are personal—your water might mean peace while someone else\'s means fear. Develop personal dream symbol dictionary: when water appears, note what you felt and what was happening. Over time, patterns emerge showing what specific symbols mean for you. Research archetypal symbols (Joseph Campbell, Carl Jung) for collective meanings. Combine personal and archetypal interpretation for full understanding. Dreams are poetry, not literal—look beneath surface meanings.' },
          { heading: 'Lucid Dreaming Training', content: 'Lucid dreaming is consciously directing dreams while dreaming. Benefits: facing fears in safe environment, testing spells, meeting guides intentionally, exploring other realms, practicing skills. Train by: reality checking throughout day (Is this a dream? Look at hands or text—in dreams they look strange), setting dream intention before sleep (\'Tonight I will realize I\'m dreaming\'), keeping dream journal (lucid dreams occur more when you track dreams), meditating before sleep. Lucid dreaming takes practice—start small (gaining awareness you\'re dreaming), then gradually practice control. Regular practice creates reliable lucid dreaming. Many witches do serious magical work in lucid dreams.' },
          { heading: 'Meeting Guides in Dreams', content: 'Guides often meet you in dreams when you\'ve given permission. Create formal invitation: \'My guides, I invite you to visit me in dreams. Show me your names, forms, and the guidance you bring.\' Sleep with clear intention. Record dreams faithfully. Guides in dreams often appear as: people (loved ones, wise beings, robed figures), animals, light/energy, symbols. When you recognize a guide in dreams, you can request specific guidance: healing, career decisions, creative inspiration, protection. Guides respect your request and often send more vivid, clear communication once you\'ve acknowledged them. Dream relationships with guides deepen over months or years of consistent attention.' },
          { heading: 'Healing Trauma in Dreams', content: 'Dreams process trauma naturally—working consciously with this accelerates healing. Traumatic dreams are nightmares replaying or symbolically representing trauma. Instead of avoiding them: become lucid in nightmare, change the outcome to healing (you win the fight, you escape safely, the person apologizes), confront the nightmare character to learn what it represents. This reprocessing creates new neural pathways of safety. Many trauma survivors report dreams becoming less frequent and less disturbing as they heal. Dream work alongside trauma therapy is particularly effective. Never force trauma work in dreams—let it unfold naturally. Trust your subconscious timing.' },
          { heading: 'Receiving Prophetic Dreams', content: 'Some dreams show probable futures, warn of danger, or provide prophetic information. These feel distinctly different—exceptionally clear, coherent, emotional resonance, lingering after waking. Trust prophetic dreams but don\'t become fatalistic—they show probabilities, not certainties. If a dream warns of danger, take reasonable precautions. If a dream shows positive future, it\'s encouragement to move toward it. Record prophetic dreams carefully with dates—later you can verify accuracy. Guides sometimes give prophetic information to prepare or warn you. Some witches develop reputation as seers because they work consciously with prophetic dreams.' },
          { heading: 'Nightmare Navigation & Protection', content: 'Nightmares are shadow material demanding attention or occasionally psychic attack. For shadow nightmares: journal about symbolism, acknowledge what you\'re refusing to see, work with it until you understand. For psychic attack: strengthen protections in waking life (protective spells, psychological boundaries), call for guard guides before sleep, lucid dream to confront the attacker, cleanse your sleep space. Create protective sleep ritual: blessing bed, protective prayer, talisman under pillow, protective crystal. Most nightmares decrease significantly as shadow work progresses. If nightmares persist after months of shadow work, consider professional support or examine if waking boundaries need strengthening.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Place dream journal and pen by your bed immediately',
          'Before sleep, state clear intention: \'I remember my dreams clearly and vividly\'',
          'Upon waking, write down everything you remember before getting up',
          'Drink mugwort tea or sleep with mugwort sachet to enhance dream recall',
          'Track dreams for a full lunar cycle to notice patterns',
          'Research symbolic meanings of recurring symbols in your dreams',
          'Create personal dream symbol dictionary noting what symbols mean for you',
          'Set formal invitation for guides: ask them to visit your dreams with clear guidance',
          'Practice reality checking (Is this a dream? Count fingers, read text) during day to train lucid dreaming',
          'Work with one recurring nightmare by becoming lucid and consciously changing the outcome'
      ],
    },
      tips: { title: 'Tips & Safety', items: [
          { title: 'Record Immediately', text: 'Dreams fade rapidly after waking. Record before doing anything else—within seconds of opening eyes, your dream memory begins fading.' },
          { title: 'No Dream Interpretation is Wrong', text: 'Your personal interpretation is always valid, even if it differs from \'official\' meanings. Your psyche is communicating—listen to your interpretation first.' },
          { title: 'Nightmares are Teachers', text: 'Instead of fearing nightmares, see them as shadow or guides trying urgently to get your attention. Listen to what they\'re showing you.' },
          { title: 'Lucid Dreams Take Practice', text: 'Don\'t expect immediate results. Lucid dreaming is trainable skill that develops over months. Be patient and consistent with reality checking.' },
          { title: 'Protect Your Sleep', text: 'Create protective sleep environment: blessing bed, protective symbol, grounding crystal. Sleep is when you\'re most vulnerable to psychic interference.' }
      ]},
      resources: { title: 'Resources', items: [
          'The Dream Book by Betty Bethards',
          'Exploring the World of Lucid Dreaming by Stephen LaBerge',
          'The Interpretation of Dreams by Carl Jung',
          'Mugwort and dream-enhancing herb information',
          'Dream oracle decks and symbolic interpretation guides'
      ],
      },
    },
  },
  {
    name: 'Binds & Hexes',
    emoji: '🔗',
    description: 'Create protective bindings and justice magic with ethical consideration',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Protective Binds', emoji: '🎳', recipes: PROTECTIVE_BINDS },
          { name: 'Justice & Banishing', emoji: '⚖️', recipes: JUSTICE_BANISHING },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Overview', content: 'Binds are protective magic designed to restrict specific harmful actions or prevent contact. Hexes are harm magic designed to cause suffering or punishment. Advanced spirit witches understand the difference and use binding for protection while generally avoiding hexing. Binding is legitimate defensive magic; hexing is ethically problematic. This practice requires mature discernment about when magic is appropriate, deep understanding of consequences, and commitment to \'harm none\' principles. Some traditions accept hexing; most modern witches reject it. This section covers protective binding (legitimate) and why ethical considerations matter for all magic. Master binding magic first before even considering hex work.' },
          { heading: 'Creating Protective Binds', content: 'Simple binding: state person\'s name clearly, state the specific action you\'re binding them from (\'I bind you from harmful contact with me,\' \'I bind you from lying about me,\' \'I bind you from entering my home\'). Visualize binding them: wrap rope around them, visualize chains, imagine barrier between you. Speak binding three times for power. Binding spell: write name on paper, write what you\'re binding them from, tie paper with cord/string (binding them), state intention aloud. Keep bound paper on altar or bury it (binding roots them in place). Knot magic: tie knots in cord while binding each knot with intention—untie when binding is no longer needed. Binding is temporary magic—regularly reassess if binding is no longer needed.' },
          { heading: 'Justice Magic vs. Vengeance', content: 'Justice magic works toward correct outcome—someone receives consequence for harmful behavior, truth is revealed, situation is resolved fairly. Vengeance magic is desire to make them suffer in return—this creates energetic cord of harm binding you together and attracts dark consequences. Distinguish by intention: \'I work toward justice and truth being revealed\' vs. \'I want them to suffer.\' Justice magic actually works better because it aligns with universal principles; vengeance magic backfires through karma. If someone harmed you, work for justice: reveal truth, remove their power, stop their harmful actions, protect others from them. Let universe handle punishment—your job is stopping harm and creating justice.' },
          { heading: 'Mirror Work & Reflection Spells', content: 'Mirror work reflects harmful intent back to its source without the witch sending harm. Create mirror: visualize mirror between you and harmful person, imagine their harmful intent reflecting back to them, use actual mirror in spell (person sees their reflection). This magic is protective, not punishing—it simply ensures harmful actions have natural consequence. Work by: setting mirror on altar with person\'s name, light candle, speak intention (\'All harmful intent is reflected back. You receive what you send.\'), leave mirror in place until situation resolves. Mirror work is ethical because it doesn\'t introduce harm—it simply refuses to accept it. Harmful intentions naturally have consequences without witch\'s intervention.' },
          { heading: 'Banishing Magic', content: 'Banishing removes someone from your life without binding them. Differs from binding: binding restricts action; banishing removes presence. Banishing works by: writing person\'s name on paper, visualizing them moving away, burning paper (\'You are removed from my life\'), speaking banishment three times. Sweeping banishment: sweep person from your space starting inside and moving outward (toward door/window). Flush banishment: write name on toilet paper, state banishment, flush away. Black salt banishing: create black salt line at thresholds, speak banishment, salt prevents their return. Banishing is appropriate when you need to end relationship, remove toxic person, or clear someone from your space. It doesn\'t harm them—it simply disconnects you energetically.' },
          { heading: 'Protection Spells & Warding', content: 'Protective magic prevents harm without targeting specific person. Ward your home: visualize protective light around it, place protective symbols at thresholds, use salt at entry points, call protective spirits. Ward yourself: visualize protective shield around your body, wear protective symbols, carry protective stones, affirm daily protection. Ward specific people: cast protection for loved ones daily, visualize them surrounded by protective light, give them protective amulets. Protection magic is non-specific—it protects from all harm, not directed at particular person. This makes it purely defensive and ethically clear. Layer protections: physical (locks, safety precautions), energetic (shields, wards), spiritual (guides, protective spells).' },
          { heading: 'Binding Your Own Shadows', content: 'Some of the most powerful binding work involves binding your own harmful impulses or patterns. Bind your anger when it arises: \'I bind my rage from harming others. I direct this power toward justice and protection.\' Bind your destructive impulses: \'I bind my urge toward self-harm. I direct this energy toward healing.\' Bind limiting patterns: \'I bind this belief about my unworthiness. I am worthy and capable.\' Self-binding is protective work preventing your own shadow from causing harm. This is constantly-needed magic that supports spiritual maturity. Binding yourself builds spiritual discipline and prevents destructive actions.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Identify someone who is actively harming you and decide if binding is necessary (usually last resort)',
          'Clearly define what specific action you\'re binding them from',
          'Consider if direct communication, boundary-setting, or physical removal is more appropriate first',
          'Create simple binding: write person\'s name and action you\'re binding on paper',
          'Tie paper with cord/string while visualizing binding them from that action',
          'Keep binding on altar while it\'s active, regularly assess if still needed',
          'Remove binding by untying knot and burning paper when situation resolves',
          'Practice justice magic instead of revenge magic—work toward truth and fair consequence',
          'Create personal protection spells for yourself and loved ones',
          'Bind your own harmful impulses and patterns as regular spiritual practice'
      ],
    },
      tips: { title: 'Tips & Safety', items: [
          { title: 'Binding Binds Both Parties', text: 'Binding creates energetic connection between you and person bound. Avoid unnecessary binding—once bound, you\'re connected until you unbind.' },
          { title: 'Never Hex Out of Anger', text: 'Hexing while emotionally reactive creates backfiring and dark entity attraction. Wait weeks until emotions calm before considering any hex work.' },
          { title: 'Ethics Clear the Outcome', text: 'Protective binding works reliably because it\'s ethically clear. Punishing hexes often backfire through karma and don\'t work well. Ethics = effectiveness.' },
          { title: 'Justice Not Punishment', text: 'Work toward justice (truth, fair consequence, protection) rather than punishment (making them suffer). Justice magic aligns with universal law and works better.' },
          { title: 'Remove When No Longer Needed', text: 'Don\'t leave bindings in place indefinitely. Regularly reassess if binding is still necessary and remove it when situation resolves. Leaving old bindings wastes energy.' }
      ],
    },
      resources: { title: 'Resources', items: [
          'The Ethical Witch by Jamie Della',
          'Protection & Banishing Magic books and guides',
          'Justice Spell collections and ethical magical practices',
          'Community discussions on binding ethics in modern witchcraft',
          'Protective amulet and ward creation guides'
      ],
      },
    },
  },
  {
    name: 'Crystal Magic (Air-Aligned)',
    emoji: '💨',
    description: 'Use air-aligned stones for clarity, communication, and spiritual connection',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        crystals: AIR_CRYSTALS,
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Overview', content: 'Air-aligned crystals carry the energetic frequency of clarity, communication, thought, perspective, and spiritual connection. These stones support clear thinking, enhanced communication, accessing higher wisdom, removing mental confusion, and facilitating connection with guides and spirit beings. Unlike earth crystals that ground and stabilize, or water crystals that soothe and deepen, air crystals clarify and elevate. They work in the realm of intellect, communication, perspective, and subtle perception. Air crystals are essential for spirit communication work, mental clarity, decision-making, and developing psychic abilities. These powerful allies teach that thought creates reality, communication is powerful magic, and perspective shift transforms experience.' },
          { heading: 'Air Crystal Properties & Correspondences', content: 'Clear Quartz: master healer and amplifier—amplifies any intention, cleanses energy, enhances clarity. Amethyst: spiritual stone—enhances intuition and psychic abilities, supports spiritual connection, soothes mental anxiety. Fluorite: focus stone—organizes scattered thoughts, clarifies mental confusion, protects psychic work. Black Tourmaline: protective stone—shields against negative influences and psychic attack. Tourmalinated Quartz: combines clear quartz and tourmaline—clarity with protection. Tourmaline (blue/watermelon): bridges earth and air, grounds intuitive work, protects sensitive people. Lepidolite: calming stone—soothes racing thoughts, supports mental peace. Selenite: clearing stone—highest vibrational clarity, connects to higher realms, clears energy fields.' },
          { heading: 'Air Crystal Cleansing & Charging', content: 'Air crystals are generally hardy and respond well to: running water cleansing, moonlight charging (especially full moon), sound cleansing (singing bowls, bells, chanting), sunlight charging (brief, as some fade with excessive sun). Charge by visualizing light filling the crystal, speaking your intention into it, placing it in sunlight briefly for bright clarity or moonlight for mystical clarity. Meditate with crystal to charge with your intention. Store near windows where air and light flow naturally. Air crystals appreciate being \'aired out\'—leave them in fresh air periodically. Cleanse and charge regularly to maintain clarity and potency.' },
          { heading: 'Working with Air Crystals for Communication', content: 'Enhance communication with air crystals: carry aquamarine or clear quartz when speaking publicly or in difficult conversations, meditate with air stones before important discussions, sleep with under pillow to process thoughts and find clarity. Create communication grid using clear quartz center with communicative stones arranged around it. Drink crystal water (if stone is safe) with intention to improve communication. Write intentions on paper, place stone on top, leave overnight for the stone to amplify your intention into the world. Air crystals amplify thoughts into reality—use them consciously to speak your truth clearly.' },
          { heading: 'Air Crystals for Psychic Development', content: 'Develop psychic abilities with air-aligned stones: Amethyst opens third eye and intuition—sleep with under pillow or meditate with daily. Clear Quartz amplifies any psychic work—meditate to clarify visions and messages. Fluorite organizes scattered psychic information—essential if your psychic work feels chaotic. Tourmaline protects psychic development—prevents overwhelm and unwanted contact. Create psychic development crystal set combining all four: clear quartz (amplification), amethyst (intuition), fluorite (organization), tourmaline (protection). Meditate with set regularly. Air crystals accelerate psychic development when worked with consistently—many practitioners report dramatic shifts in ability within weeks.' },
          { heading: 'Thought-Form Amplification', content: 'Air crystals amplify your thoughts into manifestation—they\'re powerful for turning thought into reality. State your intention clearly while holding air crystal, visualize it strongly, the crystal amplifies and projects it. This works for creating thought-forms (energetic beings created by intention), manifesting ideas into material reality, sending messages telepathically, influencing situations through focused thought. Remember: whatever you amplify with air crystals grows. Only amplify thoughts aligned with your highest good—don\'t amplify anger, fear, or destructive thoughts. Air crystal amplification is potent—use responsibly. This is why clear quartz is sometimes called \'the witch\'s best friend\'—it makes all your work more powerful.' },
          { heading: 'Air Crystal Collections & Personal Selection', content: 'Build air crystal collection based on your practice needs: clear quartz (foundational), amethyst (psychic work), fluorite (mental clarity), tourmaline (protection). Choose by intuition—let stones call to you rather than buying haphazardly. Quality matters: natural crystals have stronger energy than synthetics. Develop personal relationships with crystals—they become more powerful as you work with them consistently. Some practitioners carry one air crystal as power stone. Others maintain collection of specialized stones for different work. Trust your intuition about what you\'re drawn to—your needs naturally guide your collection.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Research air-aligned crystals and notice which ones appeal to you intuitively',
          'Select one air crystal that strongly calls to you—clear quartz or amethyst are excellent starting stones',
          'Cleanse your new crystal with running water, moonlight, or sound',
          'Hold the stone and set intention for its purpose—communication clarity, psychic development, or mental focus',
          'Carry the stone in your pocket or wear as jewelry for daily connection',
          'Sleep with the stone under your pillow to enhance clarity in dreams and messages',
          'Meditate daily with your stone, visualizing clarity flowing through you',
          'Charge the stone under moonlight monthly to maintain its clarity and potency',
          'Use clear quartz to amplify your other magical work—hold while casting spells',
          'Build relationship with your crystal—notice how it supports your clarity and communication'
      ],
    },
      tips: { title: 'Tips & Safety', items: [
          { title: 'Clear Quartz is Universal', text: 'Clear quartz is safe for all uses and works with all practices. When in doubt, choose clear quartz as your foundational air crystal.' },
          { title: 'Amplification Works Both Ways', text: 'Clear quartz amplifies whatever you program into it. Only charge with positive intentions—amplifying negativity backfires.' },
          { title: 'Amethyst for Sensitivity', text: 'If air crystal work feels overwhelming, use amethyst for gentle opening rather than harsh clarity stones. Start soft and build.' },
          { title: 'Tourmaline for Protection', text: 'If doing psychic or spirit work, pair with tourmaline to prevent overwhelm and ensure only beneficial contact gets through.' },
          { title: 'Regular Charging Matters', text: 'Air crystals lose clarity over time. Regular moonlight charging (monthly minimum) keeps them sharp and potent for your work.' }
      ],
    },
      resources: { title: 'Resources', items: [
          'The Crystal Bible by Judy Hall (air crystal section)',
          'Love is in the Earth by Melody (air stone properties)',
          'Clear Quartz uses and programming guides',
          'Amethyst psychic development resources',
          'Crystal amplification and manifestation working guides'
      ],
      },
    },
  },
];

export function SpiritWitchScreen() {
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
    const witchUnlocked = isUnlocked('witchS') || isTest('witchS');
    const isLocked = !hasSubscription && !witchUnlocked;
    setIsWitchLocked(isLocked);

    if (!isLocked) {
      // If unlocked and no subscription, 5% chance to show an ad
      // Legacy ad chance removed
      navigation.navigate('PracticeDetail', { practice, witchType: 'Spirit', witchColor: '#ff69b4' });
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
          <Text style={[styles.title, { color: textColor }]}>🌬️ Spirit Witch</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Spirituality, Magic, Clarity
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {SPIRIT_PRACTICES.map((practice) => (
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
        witchType="Spirit Witch"
        lockKey="witchS"
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
