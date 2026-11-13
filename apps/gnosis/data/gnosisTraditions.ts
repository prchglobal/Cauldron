/**
 * Gnosis house content - the real intended categories from the design notes
 * (Gnosis.txt / pocketGnosis.txt): the Gnostic / dualist "Light vs Darkness"
 * traditions. Each practice carries the full sub-tab set used by the other
 * houses: referenceGuide, knowledgeBase, gettingStarted, tips, resources.
 * Content is grounded in the actual historical faiths (Mandaeism, Manichaeism,
 * Zoroastrianism); expand freely by adding categories/sections/items.
 * Shape matches the Occultist practice format consumed by PracticeDetailScreen.
 */

export interface GnosisPractice {
  name: string;
  emoji?: string;
  description?: string;
  isSpacer?: boolean;
  tabs?: any;
}

export const MANDAEISM_PRACTICES: GnosisPractice[] = [
  { name: 'The Dualist Path', isSpacer: true },
  {
    name: 'Principles of Light and Darkness',
    emoji: '🌗',
    description: 'The dualistic worldview: Light (divine, soul) vs Darkness (material, world)',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'The World of Light', emoji: '☀️', content: [
            { attribute: 'Nature', value: 'The realm of the Great Life (Hayyi Rabbi) - pure, luminous, and the source of all souls; the true home from which the soul has descended.' },
            { attribute: 'Inhabitants', value: 'Beings of Light (uthri) who guide and protect souls; messengers such as Manda d-Hayyi ("Knowledge of Life") who bring saving knowledge.' },
            { attribute: 'Access', value: 'Approached through purity, ethical living, and baptism; perceived inwardly through contemplation of the soul\'s luminous origin.' },
            { attribute: 'Aim', value: 'The soul\'s return and reunion with the World of Light after death, ascending past the material spheres.' },
          ]},
          { name: 'The World of Darkness', emoji: '🌑', content: [
            { attribute: 'Nature', value: 'The lower realm of matter, chaos, and turbid water; associated with the body and the confusions of worldly existence.' },
            { attribute: 'Danger', value: 'It binds and forgets - drawing the soul into attachment, harm, and loss of memory of its true origin.' },
            { attribute: 'Relation', value: 'The visible world is a mixture: Light trapped within Darkness, soul clothed in body, awaiting liberation.' },
            { attribute: 'Escape', value: 'Not conquest but disentanglement - loosening the soul through purity, knowledge, and rite so it can rise.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Two Worlds', content: 'Mandaean cosmology divides existence into the World of Light - the divine realm of the Great Life - and the World of Darkness, the domain of matter and confusion. The visible, material world is a mixture of the two, and the human being stands in the middle of that mixture.' },
          { heading: 'The Soul as a Spark of Light', content: 'The soul (nishimta) originates in the World of Light and has become clothed in a material body. Spiritual life is the work of remembering that origin and preparing the soul to ascend back to the Light after death, guided by beings of Light.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn the basic map: World of Light, World of Darkness, and the mixed world you live in',
          'Contemplate the idea that your innermost self ("soul") is a spark of the Light, not the body',
          'Notice throughout the day what pulls you toward Light (clarity, honesty, compassion) versus Darkness (confusion, harm)',
          'Read a passage from the Ginza Rabba and sit with one image of Light that stays with you',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Disentangle, Don\'t Fight', text: 'The path is not war against Darkness but freeing the Light. Aim to loosen attachments rather than to conquer.' },
          { title: 'Remember Your Origin', text: 'The core discipline is memory - repeatedly recalling that your soul comes from the Light. Forgetting is the real fall.' },
          { title: 'Purity Is Ongoing', text: 'Light and Darkness mix continually, so purification is a rhythm, not a one-time event.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Ginza Rabba (the Great Treasure) - the central Mandaean scripture',
          'The Mandaeans: Ancient Texts and Modern People by Jorunn J. Buckley',
          'The Canonical Prayerbook of the Mandaeans, trans. E. S. Drower',
        ],
      },
    },
  },
  {
    name: 'Ritual Purification (Baptism)',
    emoji: '💧',
    description: 'Immersive water rituals as spiritual cleansing',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'The Masbuta (Baptism)', emoji: '💧', content: [
            { attribute: 'Element', value: 'Flowing "living water" (yardna) - never still water; the river itself carries the sanctity.' },
            { attribute: 'Frequency', value: 'Repeated, not one-time - performed regularly (especially on Sundays and feast days) as ongoing renewal.' },
            { attribute: 'Officiant', value: 'Led by a priest; involves immersion, signing, a crown of myrtle, and a sacramental handshake (kushta).' },
            { attribute: 'Meaning', value: 'Reconnection to the World of Light and cleansing of the accumulation of the material world.' },
          ]},
          { name: 'Living Water (Yardna)', emoji: '🌊', content: [
            { attribute: 'Requirement', value: 'Must be moving, natural water - a symbol of the flowing life descending from the World of Light.' },
            { attribute: 'Symbolism', value: 'Water bridges the worlds; immersion re-enacts the soul being touched by its luminous source.' },
            { attribute: 'Practice', value: 'Immersion with intention and prayer, not mere washing; the body is signed and blessed.' },
            { attribute: 'Effect', value: 'Renews purity, restores alignment with the Light, and marks belonging to the community of the living.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Living Water', content: 'Baptism (masbuta) in flowing "living water" is the central Mandaean rite. Unlike a one-time initiation, it is repeated regularly as ongoing purification and reconnection to the World of Light.' },
          { heading: 'Meaning of Repetition', content: 'Repeated baptism expresses that purity is a practice, not a possession. Each immersion renews alignment with the Light and washes away the accumulation of the material world.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Treat contact with clean, flowing water as a moment of intention rather than routine',
          'Before washing, set a simple intention to release confusion and receive clarity',
          'Reflect afterward on what you want to leave behind and what you want to carry forward',
          'Learn why the water must be "living" (flowing) and what that symbolizes',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Intention Over Mechanics', text: 'The rite\'s power is in conscious reconnection, not the mechanics of washing. Bring presence to the water.' },
          { title: 'Return Regularly', text: 'Because purification is ongoing, build a rhythm of renewal rather than expecting a single cleansing to last.' },
          { title: 'Flowing, Not Still', text: 'Seek moving water where you can; its flow mirrors the life descending from the Light.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Canonical Prayerbook of the Mandaeans, trans. E. S. Drower',
          'The Secret Adam: A Study of Nasoraean Gnosis by E. S. Drower',
          'The Ginza Rabba - sections on baptism and the priesthood',
        ],
      },
    },
  },
  {
    name: 'Ethical Living and Spiritual Discipline',
    emoji: '⚖️',
    description: 'Conducting life in alignment with Light - honesty, compassion, restraint',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Virtues', emoji: '⚖️', content: [
            { attribute: 'Core', value: 'Honesty, compassion, generosity, and kushta (truth / right-dealing) - the honest handclasp that seals sincerity.' },
            { attribute: 'Practice', value: 'Charity to the poor, care for family and community, and truthful speech as daily obligations.' },
            { attribute: 'Speech', value: 'Guarding the tongue from lies and harm; words either strengthen the Light or feed Darkness.' },
            { attribute: 'Aim', value: 'To align conduct with the World of Light so the soul grows lighter and freer.' },
          ]},
          { name: 'Abstentions', emoji: '🚫', content: [
            { attribute: 'Avoid', value: 'Deceit, cruelty, theft, and excess - actions that bind the soul more tightly to matter.' },
            { attribute: 'Reason', value: 'Harmful acts increase Darkness within and around, obscuring the soul\'s luminous origin.' },
            { attribute: 'Discipline', value: 'Moderation and restraint; the Mandaean ideal is a sober, married, community-rooted life, not extreme asceticism.' },
            { attribute: 'Result', value: 'Freedom from entanglement and a clearer channel to the Light.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Living Toward the Light', content: 'Ethical conduct is understood as literally strengthening the Light within and around you. Honesty, compassion, and generosity align the soul with its divine source. Mandaeans prize kushta - truth and right-dealing - as a sacred principle.' },
          { heading: 'Abstinence from Harm', content: 'Discipline means abstaining from actions that increase Darkness - deceit, cruelty, and harm - because these bind the soul more tightly to the material world. The ideal is moderation and community life rather than harsh self-denial.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Choose one virtue (honesty, compassion, or generosity) to practice deliberately this week',
          'Identify one habit that "feeds Darkness" and consciously abstain from it',
          'Keep a short evening review: where did I move toward Light, where toward Darkness?',
          'Practice kushta - one act of scrupulous honesty or fair-dealing each day',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Moderation, Not Extremes', text: 'The tradition favors a balanced, rooted life over harsh asceticism. Sustainable discipline outlasts dramatic effort.' },
          { title: 'Truth Is Sacred', text: 'Kushta (truth/right-dealing) is treated as holy. Small honesties compound into a luminous life.' },
          { title: 'Conduct Is Cosmology', text: 'Ethics here is not just social - each act genuinely strengthens Light or Darkness. Let that raise the stakes gently.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Ginza Rabba - ethical and instructional sections',
          'The Mandaeans: Ancient Texts and Modern People by Jorunn J. Buckley',
          'The Thousand and Twelve Questions (Alf Trisar Suialia), trans. E. S. Drower',
        ],
      },
    },
  },
  {
    name: 'Initiation and Communal Practice',
    emoji: '🤝',
    description: 'Stages of spiritual development through guided rituals and community',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Stages of Ascent', emoji: '🪜', content: [
            { attribute: 'Structure', value: 'Spiritual growth proceeds through recognized stages, marked and supported by ritual rather than left to chance.' },
            { attribute: 'Guide', value: 'Each stage is accompanied by rites (baptism, blessings, the masiqta death-mass) that assist the soul.' },
            { attribute: 'Progression', value: 'From purification, through ethical maturity, to preparation of the soul for its ascent through the material spheres.' },
            { attribute: 'Marker', value: 'Feasts, baptisms, and priestly rites mark transitions and renew the community\'s alignment with the Light.' },
          ]},
          { name: 'Priest & Community', emoji: '🤝', content: [
            { attribute: 'Role', value: 'The priest (tarmida / ganzibra) transmits knowledge and performs the rites the soul needs.' },
            { attribute: 'Transmission', value: 'Sacred knowledge and rite pass from teacher to student and from generation to generation.' },
            { attribute: 'Support', value: 'The community sustains the individual; the soul\'s ascent is carried by shared practice, not solitary effort.' },
            { attribute: 'Continuity', value: 'Belonging to the community of the living keeps the tradition and its saving knowledge alive.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Guided Ascent', content: 'Spiritual development proceeds through stages marked by guided ritual. Progress is not purely individual - it is carried by the community and its priests, whose rites assist the soul at each threshold, including at death.' },
          { heading: 'Teacher and Community', content: 'The teacher transmits knowledge and rite; the community sustains the practice across generations. The soul\'s ascent is supported by both, which is why Mandaeism has always been strongly communal.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Recognize that spiritual growth has stages - be patient with the sequence',
          'Seek out or value a knowledgeable teacher or guide for the path you follow',
          'Participate in shared practice; community sustains what solitary effort cannot',
          'Mark your own thresholds with small rites of intention and gratitude',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Growth Has an Order', text: 'Honor the sequence of stages rather than rushing. Foundations make the later work possible.' },
          { title: 'You Are Carried', text: 'The soul\'s ascent is communal. Let teachers and community carry what you cannot do alone.' },
          { title: 'Mark Transitions', text: 'Use small rites to mark thresholds; ritual gives the psyche a way to register real change.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Mandaeans of Iraq and Iran by E. S. Drower',
          'The Great Treasure (Ginza Rabba) - priestly and initiatory material',
          'The Mandaeans: Ancient Texts and Modern People by Jorunn J. Buckley',
        ],
      },
    },
  },
  {
    name: 'Meditation and Inner Awareness',
    emoji: '🧘',
    description: "Contemplative focus on the soul's divine origin",
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Inner Light', emoji: '🕯️', content: [
            { attribute: 'Focus', value: 'Attention turned inward to the soul\'s luminous origin, beneath thought and sensation.' },
            { attribute: 'Origin', value: 'The soul is understood as a spark of the World of Light temporarily housed in the body.' },
            { attribute: 'Experience', value: 'The aim is experiential - a felt awareness of Light within, not merely a belief about it.' },
            { attribute: 'Deepening', value: 'Sustained daily practice lets the sense of inner light stabilize and inform ordinary life.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Awareness of the Light Within', content: 'Meditation turns attention inward to the soul\'s divine origin, cultivating an experiential - not merely intellectual - awareness of the Light within. It complements the outward rites of baptism with an inward reconnection.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Sit quietly and rest attention on the sense of being aware itself, behind thoughts',
          'Gently hold the intention: "this awareness is a spark of the Light"',
          'Begin with 5 minutes daily and let the sense of inner light deepen over time',
          'Pair the practice with a slow breath or a short prayer to settle the mind',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Experience Over Concept', text: 'Aim for a felt sense of inner light rather than a belief about it. Let insight be lived.' },
          { title: 'Small and Daily', text: 'A short consistent sit outperforms occasional long ones. Consistency stabilizes the inner light.' },
          { title: 'Pair Inner and Outer', text: 'Let meditation and baptismal purity support each other - inner reconnection and outer cleansing.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Secret Adam: A Study of Nasoraean Gnosis by E. S. Drower',
          'The Ginza Rabba - hymns of the soul\'s ascent',
          'The Gnostic Bible, ed. Barnstone & Meyer (Mandaean selections)',
        ],
      },
    },
  },
];

export const MANICHAEAN_PRACTICES: GnosisPractice[] = [
  { name: 'The Religion of Light', isSpacer: true },
  {
    name: 'Cosmic Dualism and the Nature of Reality',
    emoji: '☯️',
    description: 'Light vs Darkness as universal principles; the "trapped Light" in matter',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Two Eternal Principles', emoji: '☯️', content: [
            { attribute: 'Light', value: 'The Kingdom of Light - the good principle: spirit, goodness, and the divine Father of Greatness.' },
            { attribute: 'Darkness', value: 'The Kingdom of Darkness - the evil principle: matter, chaos, and destructive craving, eternal and uncreated.' },
            { attribute: 'Relation', value: 'The two are opposed and originally separate; evil is not a fall from good but a co-eternal principle.' },
            { attribute: 'Drama', value: 'Cosmic history is the story of their collision, mixing, and the eventual separation of Light from Darkness.' },
          ]},
          { name: 'The Mixture', emoji: '🌀', content: [
            { attribute: 'Cause', value: 'Darkness assaulted the realm of Light; in the struggle, particles of Light became trapped in matter.' },
            { attribute: 'The World', value: 'The material cosmos is a machinery built to filter and gradually liberate the imprisoned Light.' },
            { attribute: 'The Human', value: 'Each person contains trapped Light (the soul) mixed with the darkness of the body.' },
            { attribute: 'Task', value: 'Salvation is the liberation and return of the Light - cosmic and personal at once.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Two Eternal Principles', content: 'Manichaean teaching holds that Light and Darkness are two eternal, opposed principles. The cosmos as we know it results from their mixing. Evil is not a corruption of good but a co-eternal reality - a radical dualism taught by the prophet Mani.' },
          { heading: 'The Trapped Light', content: 'Particles of Light became trapped within the material world during the primordial assault of Darkness. The spiritual task of the cosmos - and of the practitioner - is the gradual liberation of that Light and its return to its source.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the core image: Light and Darkness mixed, with Light awaiting release',
          'Contemplate that fragments of Light are present everywhere, even in matter',
          'Frame your practice as helping to "free the Light" in yourself and the world',
          'Read of Mani, who framed his teaching as a universal "Religion of Light"',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Radical, Not Moralistic', text: 'Manichaean dualism is metaphysical - two eternal principles, not merely good and bad behavior. Hold the cosmic scale.' },
          { title: 'Light Is Everywhere', text: 'Even matter holds trapped Light. This turns the whole world into a field of liberation, not rejection.' },
          { title: 'Cosmic and Personal', text: 'Your inner work mirrors the cosmic drama - freeing your own Light participates in a universal process.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Gnostic Bible, ed. Willis Barnstone & Marvin Meyer (Manichaean texts)',
          'Manichaean Texts from the Roman Empire, ed. Iain Gardner & Samuel Lieu',
          'The Kephalaia of the Teacher - Mani\'s systematic teaching',
        ],
      },
    },
  },
  {
    name: 'Meditation and Contemplation',
    emoji: '🧘',
    description: 'Techniques for perceiving the Light within oneself and the world',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Perceiving Light', emoji: '🧘', content: [
            { attribute: 'Method', value: 'Quieting the material mind so the trapped Light within can be perceived and felt.' },
            { attribute: 'Object', value: 'The inner Light and its presence in the world - a contemplative seeing rather than reasoning.' },
            { attribute: 'Obstacle', value: 'The noise and craving of the body (Darkness) which obscures perception of the Light.' },
            { attribute: 'Fruit', value: 'Clarity, calm, and a growing sensitivity to the Light in oneself and in others.' },
          ]},
          { name: 'Awakening Gnosis', emoji: '💡', content: [
            { attribute: 'Aim', value: 'Direct insight (gnosis) into one\'s true nature as Light and into the structure of reality.' },
            { attribute: 'Means', value: 'Sustained contemplation, study of the teaching, and stillness that lets insight arise.' },
            { attribute: 'Quality', value: 'Knowledge that transforms - not information, but a lived recognition that reorders the self.' },
            { attribute: 'Sign', value: 'A felt loosening of identification with the body and a steadier orientation toward the Light.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Perceiving Inner Light', content: 'Contemplative practice trains the ability to perceive the Light within oneself and within the world, quieting the noise of the material mind so the trapped Light can be sensed.' },
          { heading: 'Awakening Gnosis', content: 'Meditation is aimed at awakening inner gnosis - direct, transforming insight into one\'s true nature and the structure of reality - rather than accumulating belief.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Practice a short daily stillness to quiet material distraction',
          'Look for the "inner light" - a felt sense of clarity or knowing - and rest in it',
          'Journal any insights ("gnosis") that arise, without forcing them',
          'Distinguish restless craving (Darkness) from calm clarity (Light) as they appear',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Quiet Before Seeing', text: 'The Light is perceived once the mind\'s noise settles. Prioritize stillness over effortful searching.' },
          { title: 'Gnosis Is Lived', text: 'Real insight reorders you; it is not more information. Let it change how you act, not just what you know.' },
          { title: 'Don\'t Force Insight', text: 'Gnosis arises; it cannot be manufactured. Create the conditions and allow it.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Kephalaia of the Teacher (Manichaean doctrinal dialogues)',
          'Manichaean Texts from the Roman Empire, ed. Gardner & Lieu',
          'The Gnostic Bible, ed. Barnstone & Meyer',
        ],
      },
    },
  },
  {
    name: 'Ethical Alignment with Light',
    emoji: '🕯️',
    description: 'Avoiding actions that strengthen Darkness; releasing and purifying the soul',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Releasing Light', emoji: '🕯️', content: [
            { attribute: 'Principle', value: 'Every act either releases Light or strengthens Darkness; ethics is therefore cosmological.' },
            { attribute: 'Release', value: 'Restraint, kindness, non-harm, and simplicity loosen the Light bound within the soul.' },
            { attribute: 'Bondage', value: 'Cruelty, greed, and excess bind more Light into matter and darken the soul.' },
            { attribute: 'Purity', value: 'Gradual purification frees the soul from entanglement with the body.' },
          ]},
          { name: 'The Elect & the Hearers', emoji: '👥', content: [
            { attribute: 'The Elect', value: 'A dedicated inner circle who kept strict rules (celibacy, non-harm to living things, a special diet) to liberate the most Light.' },
            { attribute: 'The Hearers', value: 'Lay followers who supported the Elect and lived a lighter ethical rule suited to ordinary life.' },
            { attribute: 'Meaning', value: 'Two levels of commitment let everyone participate in freeing the Light according to their capacity.' },
            { attribute: 'Application', value: 'Modern practice: choose sustainable disciplines and support others walking a stricter path.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Actions and the Two Principles', content: 'Every action is understood to either strengthen Darkness or release Light. Ethical living is therefore cosmological, not merely social - conduct participates in the liberation of the Light.' },
          { heading: 'Purifying the Soul', content: 'Choosing behaviors that release Light - restraint, kindness, non-harm - gradually purifies the soul and loosens its bondage to matter. Manichaeism organized this into the strict Elect and the supportive Hearers.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Before a choice, ask: does this release Light or strengthen Darkness?',
          'Practice restraint in one area that tends to bind you to harmful patterns',
          'Cultivate one Light-releasing behavior daily (kindness, honesty, non-harm)',
          'Decide which disciplines you can sustain, and support others in theirs',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Match Rule to Capacity', text: 'The Elect/Hearer structure shows discipline should fit your life. Choose what you can truly sustain.' },
          { title: 'Non-Harm Frees Light', text: 'Gentleness toward living things was central. Small kindnesses genuinely "release Light".' },
          { title: 'Support Counts', text: 'Hearers advanced by supporting the Elect. Helping others\' practice is itself a practice.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Manichaean Texts from the Roman Empire, ed. Gardner & Lieu',
          'The Religion of Light: An Introduction to Manichaeism (scholarly surveys)',
          'The Gnostic Bible, ed. Barnstone & Meyer',
        ],
      },
    },
  },
  {
    name: 'Personal Revelation and Insight',
    emoji: '💡',
    description: 'Direct knowledge of cosmic truths; recognizing Light in matter',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Direct Knowledge', emoji: '👁️', content: [
            { attribute: 'Nature', value: 'Gnosis experienced directly rather than received only as doctrine; Mani himself claimed a revealing "Twin" or divine counterpart.' },
            { attribute: 'Source', value: 'Insight understood as the Light within recognizing itself and its origin.' },
            { attribute: 'Cultivation', value: 'Contemplation, study, and openness create conditions in which revelation can arise.' },
            { attribute: 'Test', value: 'Genuine insight brings clarity and ethical fruit, not inflation or confusion.' },
          ]},
          { name: 'Light in Matter', emoji: '✨', content: [
            { attribute: 'Practice', value: 'Training perception to recognize the trapped Light present even within the material world.' },
            { attribute: 'Attitude', value: 'Reverence for the sparks of Light in things and beings, without attachment to matter itself.' },
            { attribute: 'Effect', value: 'The world becomes a field of hidden Light to be honored and freed, not merely rejected.' },
            { attribute: 'Caution', value: 'Avoid both worldly attachment and contempt; the aim is liberation, not disgust.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Direct Knowledge', content: 'Manichaeism prized personal revelation - the capacity to directly experience cosmic truths rather than only receive them second-hand. Mani described his own teaching as coming through a revealing divine "Twin".' },
          { heading: 'Recognizing Light in Matter', content: 'Contemplative exercises train the practitioner to recognize the presence of Light even within the material world, turning perception into an act of reverence and liberation.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Set aside contemplative time to seek direct understanding, not just belief',
          'Practice noticing the "spark of Light" in ordinary things and people',
          'Record moments of direct insight and revisit them',
          'Check insights against their fruit: clarity and kindness, not inflation',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Seek the Fruit', text: 'Trust insight that yields clarity and compassion; be wary of "revelations" that inflate the ego.' },
          { title: 'Honor, Don\'t Cling', text: 'Revere the Light in matter without becoming attached to matter. Liberation, not possession.' },
          { title: 'Revisit Insights', text: 'Record and return to genuine moments of knowing; they deepen with attention over time.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Kephalaia of the Teacher',
          'Mani and Manichaeism (introductory scholarly works)',
          'The Gnostic Bible, ed. Barnstone & Meyer',
        ],
      },
    },
  },
  {
    name: 'Visualization and Symbolic Understanding',
    emoji: '👁️',
    description: 'Imagery and symbolic reflection to deepen insight into cosmic duality',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Symbol as Bridge', emoji: '🔷', content: [
            { attribute: 'Purpose', value: 'Imagery gives the abstract principles of Light and Darkness a form the mind can hold and explore.' },
            { attribute: 'Heritage', value: 'Manichaeism was famous for luminous art and illustrated scripture used to teach the cosmic drama.' },
            { attribute: 'Method', value: 'Hold a simple image of Light (rising, gathering, radiant) and let it reveal the teaching experientially.' },
            { attribute: 'Aim', value: 'Insight into cosmic duality that is felt and seen, not only reasoned.' },
          ]},
          { name: 'Guided Vision', emoji: '🌈', content: [
            { attribute: 'Practice', value: 'Optional inner visionary exercises exploring the ascent and gathering of Light.' },
            { attribute: 'Structure', value: 'Move from image, to felt sense, to reflection on what the vision revealed about your state.' },
            { attribute: 'Safety', value: 'Keep vision anchored in ethical clarity; the aim is orientation toward Light, not escapism.' },
            { attribute: 'Integration', value: 'Translate what is seen into concrete acts that release Light in daily life.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Symbol as a Bridge', content: 'Imagery and symbol are used to deepen insight into cosmic duality, giving the abstract principles of Light and Darkness a form the mind can hold. Manichaeism was renowned for its luminous, illustrated books used precisely for this.' },
          { heading: 'Guided Vision', content: 'Optional guided visionary practices use inner imagery to explore the drama of Light and Darkness and one\'s place within it, then integrate the insight into action.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Choose a simple symbol of Light and hold it in the mind\'s eye during meditation',
          'Use imagery of Light gathering or ascending to explore the teaching experientially',
          'Reflect afterward on what the symbol revealed about your own state',
          'Translate one insight from the vision into a concrete, Light-releasing action',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Keep It Simple', text: 'One clear image outperforms elaborate scenes. Let a single symbol of Light do the work.' },
          { title: 'See, Then Integrate', text: 'Vision matters only if it lands in action. Always translate insight into a concrete deed.' },
          { title: 'Anchor in Ethics', text: 'Keep inner vision tied to clarity and kindness so it orients rather than escapes.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Manichaean Art and Calligraphy (studies of the illustrated tradition)',
          'The Gnostic Bible, ed. Barnstone & Meyer',
          'Manichaean Texts from the Roman Empire, ed. Gardner & Lieu',
        ],
      },
    },
  },
];

export const ZOROASTRIAN_PRACTICES: GnosisPractice[] = [
  { name: 'The Good Religion', isSpacer: true },
  {
    name: 'Dualism',
    emoji: '🔥',
    description: 'The cosmic struggle of good (Ahura Mazda) and evil (Angra Mainyu)',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Ahura Mazda', emoji: '☀️', content: [
            { attribute: 'Identity', value: 'The Wise Lord - the one uncreated creator, source of order, truth, and light.' },
            { attribute: 'Nature', value: 'Wholly good; associated with Spenta Mainyu, the bounteous/holy spirit.' },
            { attribute: 'Order (Asha)', value: 'Upholds Asha - truth and right cosmic order - against chaos and the Lie.' },
            { attribute: 'Helpers', value: 'The Amesha Spentas (Bounteous Immortals) - divine aspects such as Good Mind, Truth, and Devotion.' },
          ]},
          { name: 'Angra Mainyu & the Lie', emoji: '🌑', content: [
            { attribute: 'Identity', value: 'Angra Mainyu (Ahriman) - the destructive spirit that opposes Ahura Mazda.' },
            { attribute: 'Principle', value: 'Druj - the Lie, deceit, and chaos - the opposite of Asha.' },
            { attribute: 'Role', value: 'Introduces disorder, harm, and falsehood into creation.' },
            { attribute: 'Outcome', value: 'In the end, good is destined to prevail and the world to be renewed (frashokereti).' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Ahura Mazda and Angra Mainyu', content: 'Zoroastrian dualism sets the Wise Lord Ahura Mazda (order, truth, light) against the destructive spirit Angra Mainyu (the Lie, chaos). Human beings participate in this cosmic struggle through their choices, and the tradition teaches that good will ultimately triumph.' },
          { heading: 'Asha vs the Lie', content: 'The world runs on Asha - truth and right order. Evil is the "Lie" (Druj). To live well is to side with Asha against the Lie in thought, word, and deed, supported by the divine Amesha Spentas.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn the two principles: Ahura Mazda (truth/order) and the Lie (chaos)',
          'See daily choices as small moves for order and truth or against them',
          'Learn the idea of Asha (right order) as the pattern good actions uphold',
          'Reflect that in this dualism, individuals genuinely help decide the outcome',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'You Are a Participant', text: 'Unlike a spectator dualism, here your choices actually strengthen order or chaos. Choose with that weight.' },
          { title: 'Good Will Prevail', text: 'The tradition is ultimately hopeful - Darkness is not eternal victor. Practice from confidence, not fear.' },
          { title: 'Truth Over the Lie', text: 'Every stance for honesty is a stance for Asha. Let truthfulness be your basic alignment.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Gathas of Zarathushtra (the prophet\'s own hymns)',
          'Zoroastrians: Their Religious Beliefs and Practices by Mary Boyce',
          'The Zend-Avesta (primary scripture, trans. James Darmesteter)',
        ],
      },
    },
  },
  {
    name: 'Virtue',
    emoji: '🕊️',
    description: 'Good Thoughts, Good Words, Good Deeds',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'The Threefold Path', emoji: '🕊️', content: [
            { attribute: 'Good Thoughts', value: 'Humata - cultivating a good mind (Vohu Manah): honesty, benevolence, and clear intention.' },
            { attribute: 'Good Words', value: 'Hukhta - truthful, kind, and constructive speech that upholds Asha.' },
            { attribute: 'Good Deeds', value: 'Huvarshta - active good works: charity, honesty, and care for creation.' },
            { attribute: 'Character', value: 'Virtue is practical and active, not merely inner contemplation.' },
          ]},
          { name: 'Asha (Truth / Order)', emoji: '⚖️', content: [
            { attribute: 'Meaning', value: 'Asha is truth, righteousness, and the right order of the cosmos.' },
            { attribute: 'Alignment', value: 'Virtue means aligning thought, word, and deed with Asha and against the Lie.' },
            { attribute: 'Freedom', value: 'Zoroastrianism strongly emphasizes free will - each person chooses their side.' },
            { attribute: 'Fruit', value: 'A life that adds order, honesty, and good to the world.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Threefold Path', content: 'The heart of Zoroastrian ethics is the threefold ideal: Humata, Hukhta, Huvarshta - Good Thoughts, Good Words, and Good Deeds. Virtue is practical and active, expressed in how one thinks, speaks, and acts.' },
          { heading: 'Free Will and Asha', content: 'Zoroastrianism places great weight on free choice: each person freely aligns with Asha (truth/order) or the Lie. Virtue is the ongoing choice to uphold Asha in every domain of life.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Each morning, set an intention for good thoughts, good words, and good deeds',
          'Each evening, review the day against those three',
          'Pick one relationship and practice truthful, kind speech (Hukhta) deliberately',
          'Do one concrete good deed (Huvarshta) daily, however small',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Three, In Order', text: 'Thoughts shape words shape deeds. Tending the mind first makes the rest easier.' },
          { title: 'Active, Not Passive', text: 'Virtue here is doing good, not just avoiding harm. Add good to the world daily.' },
          { title: 'You Choose Freely', text: 'The tradition prizes free will - claim your choices rather than blaming circumstance.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Gathas of Zarathushtra',
          'Zoroastrians: Their Religious Beliefs and Practices by Mary Boyce',
          'The Teachings of Zarathushtra (introductory anthologies)',
        ],
      },
    },
  },
  {
    name: 'Purity',
    emoji: '✨',
    description: 'Moral and ritual purity; the sacred fire as its symbol',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Ritual & Moral Purity', emoji: '✨', content: [
            { attribute: 'Scope', value: 'Purity spans body, mind, speech, and surroundings - keeping each free of corruption and the Lie.' },
            { attribute: 'Moral Core', value: 'Inner purity (honest thought, truthful speech) matters as much as outward cleanliness.' },
            { attribute: 'Practice', value: 'Care for the elements and creation - avoiding pollution of fire, water, earth, and air.' },
            { attribute: 'Aim', value: 'To remain aligned with Asha and fit to approach the sacred.' },
          ]},
          { name: 'Sacred Fire', emoji: '🔥', content: [
            { attribute: 'Symbol', value: 'Fire (Atar) is the great symbol of Ahura Mazda\'s light, truth, and purity.' },
            { attribute: 'Not Worship Of', value: 'Zoroastrians revere fire as a symbol and focus, not as a god - they are not "fire-worshippers".' },
            { attribute: 'Tending', value: 'The temple fire is kept pure and continually tended by priests.' },
            { attribute: 'Focus', value: 'Fire serves as the direction and focus of prayer and purity.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Purity of Body and Mind', content: 'Purity is both moral and ritual - keeping thought, speech, and surroundings free of corruption. Care for the natural elements (fire, water, earth, air) reflects respect for Ahura Mazda\'s good creation.' },
          { heading: 'The Sacred Fire', content: 'Fire, kept clean and tended, is the great symbol of purity and of Ahura Mazda\'s light. Zoroastrians revere it as a focus of prayer and truth, not as a deity - a common misunderstanding.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Keep one space or practice deliberately clean as a discipline of purity',
          'Notice and clear "impure" thoughts or speech as they arise',
          'Show respect for the elements - reduce waste and pollution as a spiritual act',
          'Use a lit candle or flame as a clean focal point for a moment of prayer',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Inner and Outer Together', text: 'Cleanliness of mind and speech matters as much as of surroundings. Tend both.' },
          { title: 'Fire Is a Symbol', text: 'Revere fire as a focus of light and truth, not as a god. It points beyond itself.' },
          { title: 'Honor the Elements', text: 'Caring for fire, water, earth, and air is treated as reverence for good creation.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Zoroastrians: Their Religious Beliefs and Practices by Mary Boyce',
          'The Zend-Avesta - the Vendidad on purity',
          'Textual Sources for the Study of Zoroastrianism, ed. Boyce',
        ],
      },
    },
  },
  {
    name: 'Ritual',
    emoji: '🔥',
    description: 'Fire ceremonies and prayer that sustain order',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Fire Ceremony', emoji: '🔥', content: [
            { attribute: 'Center', value: 'The tended sacred fire is the focus of worship and the symbol of Ahura Mazda\'s presence.' },
            { attribute: 'Priesthood', value: 'Priests (mobeds) maintain the fire and perform the rites with purity.' },
            { attribute: 'Meaning', value: 'Ritual strengthens Asha (right order) in the world - participation in upholding creation.' },
            { attribute: 'Offering', value: 'Care, cleanliness, and reverence rather than sacrifice of the destructive kind.' },
          ]},
          { name: 'Prayer & the Avesta', emoji: '📖', content: [
            { attribute: 'Scripture', value: 'The Avesta - including the Gathas of Zarathushtra - provides sacred hymns and prayers.' },
            { attribute: 'Core Prayer', value: 'Foundational formulas such as the Ashem Vohu (praise of Asha) and Ahuna Vairya.' },
            { attribute: 'Practice', value: 'Recited prayer, often facing a light or fire, structures daily devotion.' },
            { attribute: 'Aim', value: 'To honor Ahura Mazda and align the day with truth and order.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Tending the Sacred Fire', content: 'Ritual centers on the tended fire and recited prayer, which honor Ahura Mazda and strengthen Asha (right order) in the world. Ritual is understood as participation in maintaining cosmic order, not appeasement.' },
          { heading: 'Prayer and Scripture', content: 'The Avesta - especially the Gathas attributed to Zarathushtra - supplies the hymns and prayers of the tradition. Short foundational prayers structure daily devotion, often before a flame.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Adopt a simple, repeated ritual (a lit candle, a spoken intention) as an anchor',
          'Treat the ritual as tending order, not superstition',
          'Learn one short traditional prayer or its meaning (e.g., the Ashem Vohu)',
          'Face a clean flame or light for a moment of daily devotion',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Ritual Upholds Order', text: 'Frame rite as participating in keeping the world in right order (Asha), not bargaining with powers.' },
          { title: 'Small and Repeated', text: 'A simple daily flame-and-prayer anchor outlasts elaborate but rare ceremony.' },
          { title: 'Keep It Pure', text: 'Cleanliness and reverence are the "offering" - tend the practice with care.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Zend-Avesta, trans. James Darmesteter',
          'The Gathas of Zarathushtra',
          'Zoroastrians: Their Religious Beliefs and Practices by Mary Boyce',
        ],
      },
    },
  },
  { name: 'Cosmology & the Soul', isSpacer: true },
  {
    name: 'The Amesha Spentas',
    emoji: '✨',
    description: 'The seven Bounteous Immortals - divine aspects of Ahura Mazda',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'The Seven Aspects', emoji: '✨', content: [
            { attribute: 'Spenta Mainyu', value: 'The Bounteous / Holy Spirit - Ahura Mazda\'s own creative, life-giving spirit.' },
            { attribute: 'Vohu Manah', value: 'Good Mind / Good Purpose - clear, benevolent thought; guardian of animals.' },
            { attribute: 'Asha Vahishta', value: 'Best Truth / Righteousness - the right order of things; guardian of fire.' },
            { attribute: 'Khshathra Vairya', value: 'Desirable Dominion - good power and just rule; guardian of the sky and metals.' },
            { attribute: 'Spenta Armaiti', value: 'Holy Devotion - serene faith and humility; guardian of the earth.' },
            { attribute: 'Haurvatat & Ameretat', value: 'Wholeness/Health and Immortality - guardians of the waters and plants; the reward of the good life.' },
          ]},
          { name: 'Working With Them', emoji: '🌿', content: [
            { attribute: 'Approach', value: 'Cultivate in yourself the quality each Immortal embodies - good mind, truth, just power, devotion, wholeness.' },
            { attribute: 'Creation Link', value: 'Each protects a part of the good creation, so caring for creation honors them.' },
            { attribute: 'Practice', value: 'Honor Good Mind by clear thinking, Truth by honesty, Devotion by humble service, and so on.' },
            { attribute: 'Aim', value: 'To become a living expression of Ahura Mazda\'s good attributes.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Bounteous Immortals', content: 'The Amesha Spentas ("Bounteous Immortals") are the great divine aspects or emanations of Ahura Mazda - Good Mind, Best Truth, Desirable Dominion, Holy Devotion, Wholeness, and Immortality, radiating from his own Holy Spirit. They are both attributes of God and ideals for human character.' },
          { heading: 'Guardians of Creation', content: 'Each Amesha Spenta is traditionally linked to a part of the good creation (fire, earth, waters, plants, animals, metals, and humanity). To honor them is to cultivate their virtue and to care for the creation each protects.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn the names and qualities of the seven Amesha Spentas',
          'Pick one aspect (e.g., Good Mind or Truth) to cultivate deliberately this week',
          'Connect each aspect to caring for its part of creation (e.g., water, plants)',
          'Notice where you already express one of these good attributes',
          'Let the seven together form a picture of the good character to grow toward',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Attributes and Ideals', text: 'The Immortals are both aspects of God and models for you. Growing their qualities is the practice.' },
          { title: 'Care Is Devotion', text: 'Tending the creation each guards (earth, water, plants) is a concrete way to honor them.' },
          { title: 'One at a Time', text: 'Cultivate one aspect deeply rather than all seven vaguely; they reinforce each other over time.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Gathas of Zarathushtra (where the Amesha Spentas appear)',
          'Zoroastrians: Their Religious Beliefs and Practices by Mary Boyce',
          'Textual Sources for the Study of Zoroastrianism, ed. Mary Boyce',
        ],
      },
    },
  },
  {
    name: "The Soul's Journey",
    emoji: '🌉',
    description: 'The Chinvat Bridge and the fate of the soul after death',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'The Chinvat Bridge', emoji: '🌉', content: [
            { attribute: 'Crossing', value: 'After death the soul comes to the Chinvat Bridge - the "Bridge of the Separator" between worlds.' },
            { attribute: 'The Bridge', value: 'It broadens to an easy road for the righteous, but narrows to a blade\'s edge for the wicked.' },
            { attribute: 'The Daena', value: 'The soul is met by its own conscience (daena) - as a radiant maiden for the good, a hag for the wicked.' },
            { attribute: 'Destination', value: 'The righteous pass to the House of Song (paradise); the wicked fall toward the House of the Lie.' },
          ]},
          { name: 'Accountability', emoji: '⚖️', content: [
            { attribute: 'Basis', value: 'The soul\'s path is decided by the balance of its good and evil thoughts, words, and deeds.' },
            { attribute: 'Free Will', value: 'The outcome reflects freely made choices in life - not arbitrary fate.' },
            { attribute: 'Not Final', value: 'Even heaven and hell are not the end; all awaits the final renovation (frashokereti).' },
            { attribute: 'Meaning', value: 'Awareness of the crossing gives present choices real weight.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Bridge of the Separator', content: 'Zoroastrianism teaches that after death the soul crosses the Chinvat Bridge. For the righteous it widens into an easy path leading to the House of Song; for the wicked it narrows to a blade\'s edge. The soul meets its own conscience (daena), personified as a beautiful maiden or a hag according to how it lived.' },
          { heading: 'Choices That Weigh', content: 'The crossing is decided by the balance of one\'s good and evil thoughts, words, and deeds - the fruit of free choice. Yet the tradition holds that this is not the ultimate end: all souls await the final renewal of the world.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn the image of the Chinvat Bridge and what it represents',
          'Reflect that your daily thoughts, words, and deeds shape your "conscience" (daena)',
          'Let awareness of accountability add weight - not fear - to your choices',
          'Balance the sobering image with the tradition\'s ultimate hope of renewal',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Weight, Not Dread', text: 'The bridge is meant to make choices matter, not to terrify. Let it steady your conduct.' },
          { title: 'You Meet Yourself', text: 'The daena is your own conscience made visible - you become the character you practice.' },
          { title: 'Hope Beyond Judgment', text: 'Remember the larger arc: even judgment gives way to the renewal of all things.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Gathas of Zarathushtra (the daena and the crossing)',
          'The Zend-Avesta - passages on the fate of the soul',
          'Zoroastrians: Their Religious Beliefs and Practices by Mary Boyce',
        ],
      },
    },
  },
  {
    name: 'Cosmic Renewal (Frashokereti)',
    emoji: '🌅',
    description: 'The final renovation and ultimate triumph of good',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Frashokereti', emoji: '🌅', content: [
            { attribute: 'Meaning', value: 'Frashokereti - "making wonderful/excellent" - the final renovation that perfects the world.' },
            { attribute: 'Event', value: 'Evil is at last defeated, the dead are raised, and creation is made whole and deathless.' },
            { attribute: 'Purification', value: 'A river of molten metal purifies all - felt as warm milk by the righteous, as fire by the wicked.' },
            { attribute: 'Result', value: 'A restored, immortal creation in complete harmony with Ahura Mazda.' },
          ]},
          { name: 'The Saoshyant', emoji: '⭐', content: [
            { attribute: 'Role', value: 'A world savior / renovator (Saoshyant) born at the end of time to lead the renewal.' },
            { attribute: 'Function', value: 'Presides over the resurrection and the final defeat of the Lie.' },
            { attribute: 'Legacy', value: 'One of the earliest visions of a redeemer and a good end of history.' },
            { attribute: 'Hope', value: 'Grounds the tradition\'s deep optimism: good is destined to win.' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'Making the World Wonderful', content: 'Frashokereti is the Zoroastrian doctrine of the final renovation: evil is ultimately defeated, the dead are resurrected, and the world is made perfect, whole, and immortal. A stream of molten metal purifies all creation, harmless to the righteous. It is the fulfillment of the long struggle between order and the Lie.' },
          { heading: 'The Saoshyant and Cosmic Hope', content: 'A world savior, the Saoshyant, is expected to arise at the end of time to bring about the renewal and resurrection. This makes Zoroastrianism one of the earliest traditions to teach a redeemer, judgment, and a good end of history - a fundamentally hopeful vision.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn what Frashokereti (the "renovation") means and why it matters',
          'Let the certainty that good ultimately prevails inform your outlook',
          'See your good thoughts, words, and deeds as contributions to that renewal',
          'Hold the sober and the hopeful together: struggle now, restoration promised',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Practice From Hope', text: 'The end is good. Let that confidence, not anxiety, power your effort against the Lie.' },
          { title: 'You Contribute', text: 'Every good deed is a small share in the world\'s renewal - your work is not in vain.' },
          { title: 'Optimistic Realism', text: 'Hold the struggle and the promised restoration together; neither denial nor despair.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Gathas of Zarathushtra',
          'Zoroastrians: Their Religious Beliefs and Practices by Mary Boyce',
          'The Zend-Avesta - eschatological passages',
        ],
      },
    },
  },
];
