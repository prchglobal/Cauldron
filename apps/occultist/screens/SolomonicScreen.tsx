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
import { FORAGING_PLANTS } from '../data/plantForagingDatabase';
import { KITCHEN_MAGIC_RECIPES } from '../data/kitchenMagicDatabase';
import { HOME_BLESSING_SPELLS } from '../data/homeBlendingDatabase';
import { ANIMAL_GUIDES } from '../data/animalSymbolismDatabase';
import { FAE_SPIRITS } from '../data/faeSpiritDatabase';
import { EARTH_CRYSTALS } from '../data/earthCrystalsDatabase';

const GREEN_WITCH_PRACTICES = [
  {
    name: 'Ontology',
    isSpacer: true,
  },
  {
    name: 'Source',
    subName: 'God',
    emoji: '⭐',
    description: 'Connect with divine authority and the celestial hierarchy',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Sovereignty', emoji: '👑', content: [
            { attribute: 'Definition', value: 'The absolute legal authority - Source possesses unrestricted power to command all creation without limitation' },
            { attribute: 'Nature', value: 'Divine sovereignty is inherent, not granted—it exists by nature of being the origin of all existence' },
            { attribute: 'Scope', value: 'Extends through all dimensions, worlds, and planes—physical, astral, spiritual, and beyond' },
            { attribute: 'Recognition', value: 'All beings recognize Source authority instinctively—rebellion is temporary illusion, not true freedom' },
          ]},
          { name: 'Mandate', emoji: '⚡', content: [
            { attribute: 'Definition', value: 'Origin of all command rights - All authority granted to operators flows from Source alone through delegated power' },
            { attribute: 'Chain of Command', value: 'Source → Archangels → Angels → Operators → Spirits—each level derives legitimacy from the one above' },
            { attribute: 'Operators Role', value: 'You command not through personal power but as channel for Source authority flowing through you' },
            { attribute: 'Maintenance', value: 'Authority remains active only through continued alignment with divine will and ethical conduct' },
          ]},
          { name: 'Immutability', emoji: '💎', content: [
            { attribute: 'Definition', value: 'Unaffected by ritual action - Source remains unchanged and unaffected by any magical work or invocation' },
            { attribute: 'Transcendence', value: 'Source exists beyond all dualities, changes, and manifestations—eternally perfect and complete' },
            { attribute: 'Humility', value: 'Operators do not "use" Source but humbly request alignment with divine will and purpose' },
            { attribute: 'Security', value: 'Source\'s unchanging nature ensures stability—the foundation of reality cannot be corrupted or destroyed' },
          ]},
          { name: 'Supremacy', emoji: '🌟', content: [
            { attribute: 'Definition', value: 'No peer or counterforce - No being or principle can rival or oppose divine authority effectively' },
            { attribute: 'Absolute Power', value: 'Source commands absolutely—spirits, demons, angels, all beings ultimately submit to divine will' },
            { attribute: 'Practical Meaning', value: 'When invoking Source authority properly, no spirit can resist—the binding is absolute and unbreakable' },
            { attribute: 'False Opposition', value: 'Perceived opposition from lower beings is permitted by Source, not genuine defiance of divine will' },
          ]},
          { name: 'Finality', emoji: '⚖️', content: [
            { attribute: 'Definition', value: 'Ultimate arbiter of law - Source determines all meaning, justice, and consequence without appeal' },
            { attribute: 'Cosmic Justice', value: 'All actions ultimately answer to Source—karmic consequence flows from divine judgment, not human morality' },
            { attribute: 'Right Conduct', value: 'Alignment with Source will determines success—ethical work receives support; harmful work receives resistance' },
            { attribute: 'Final Word', value: 'When you invoke Source authority, the matter is closed—there is no higher power to appeal to' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'The Divine Source & Authority',
            content: 'In Solomonic magic, all authority derives from the Divine Source—the transcendent God whose power flows through the celestial hierarchy down to earthly manifestation. King Solomon\'s wisdom and power came directly from divine connection; all his magical authority was granted through alignment with divine will. The Source practice means establishing your own direct connection to divine authority: recognizing that you act as a channel for divine power, not through personal ego but through alignment with higher will. Solomonic practitioners understand themselves as servants of divine purpose, not masters seeking power for its own sake.',
          },
          {
            heading: 'The Names of God in Solomonic Tradition',
            content: 'The Key of Solomon and Solomonic grimoires invoke specific Divine Names for authority: El (God), Elohim (Godhead), Adonai (Lord), YHVH (Tetragrammaton), and others. Each Name carries specific divine authority and is called upon to grant power to commands and summonings. The Names are not mere words but living forces—when invoked with proper understanding and reverence, they activate divine authority in your work. Speaking or writing the divine Names with proper intention connects you directly to Source power. This is why the Names must be treated with absolute respect and never invoked frivolously or for selfish purposes.',
          },
          {
            heading: 'Divine Authority & Right Conduct',
            content: 'Solomonic magic teaches that divine authority is granted only when the practitioner maintains ethical conduct and pure intention. King Solomon\'s power was contingent on his righteousness and wisdom. This is not merely moral philosophy—it is operational reality in Solomonic work. If you work with selfish, harmful, or deceptive intent, you lose access to divine authority and instead attract lower, deceptive spirits. Maintaining divine connection requires: living with integrity, speaking truth, acting justly, maintaining ritual purity, and never using the work to harm others. When conduct aligns with divine will, authority flows powerfully.',
          },
          {
            heading: 'Celestial Emanation & Divine Flow',
            content: 'The Source is conceived as the fountain of all power, emanating downward through the celestial hierarchy: God → Archangels → Angels → Planetary Intelligences → Elemental Spirits → Physical manifestation. Understanding this flow is essential: you are not commanding the Source directly but invoking Source authority through the appropriate hierarchy. When you need divine intervention, you invoke Source authority. When you need angelic assistance, you call upon Archangels. When you need planetary effects, you invoke planetary intelligences. Each level flows from the Source—accessing appropriate level ensures power flows correctly.',
          },
          {
            heading: 'Invocation vs. Evocation of Source Power',
            content: 'Invocation means drawing Source power into yourself and your space. You invoke divine authority to fill your being, your temple, your work. This is done through prayer, invocation formulas, and sacred names spoken with reverence and clear intention. Evocation means commanding spirits to appear—a different practice from Source connection. When working with Source, the emphasis is invocation: inviting divine presence, divine blessing, divine authority into your work. This distinction is critical: you do not evoke God; you invoke divine presence with humility and reverence.',
          },
          {
            heading: 'Sacred Geometry & Divine Order',
            content: 'The Source manifests through sacred geometry: perfect order underlying all creation. The pentagram represents divine humanity, the hexagram represents divine balance, the circle represents wholeness and protection. Understanding these geometric principles is understanding how Source creates and manifests. In Solomonic practice, you work with geometric precision—ritual circles, triangles for spirits, carefully drawn seals—because geometry is the language of divine creation. The more precisely you work with sacred geometry, the more directly you channel Source power.',
          },
          {
            heading: 'Preparation & Alignment with Source',
            content: 'Connecting consistently with Source requires discipline and preparation: regular spiritual practice (prayer, meditation, study), maintaining ritual purity (bathing, fasting at appropriate times), ethical living, and persistent alignment with divine will rather than personal desire. The more consistently you align with Source through daily practice, the more clearly you perceive divine guidance and the more powerfully Source flows through your work. Connection with Source is not granted once and maintained automatically—it requires ongoing commitment and renewal.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin a regular spiritual practice: daily meditation or prayer, connecting consciously with divine presence',
          'Study the Divine Names—learn their pronunciation and significance in Solomonic tradition',
          'Establish a sacred space for your work: a dedicated altar or corner where you address divine authority',
          'Practice invoking divine authority simply: speak with reverence, asking for divine blessing and guidance',
          'Maintain ethical conduct as the foundation of your practice: truth, justice, and integrity',
          'Study the hierarchy of celestial forces and understand how divine power flows through each level',
          'Learn basic sacred geometry and understand geometric principles in magical work',
          'Begin keeping a journal of your connection with Source: insights, synchronicities, and guidance',
          'Establish a practice of gratitude for divine presence and power received',
          'Deepen alignment: allow your life choices to reflect divine will rather than personal ego',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Reverence Over Demand', text: 'Approach divine authority with reverence and humility, not demand or entitlement. The Source flows to those who serve, not to those who seek to command.' },
          { title: 'Ethical Alignment is Essential', text: 'Unethical work blocks divine connection automatically. If your work is selfish or harmful, Source power simply won\'t flow. Alignment with divine will is non-negotiable.' },
          { title: 'Divine Names Deserve Respect', text: 'Never invoke divine Names carelessly or for entertainment. Treat them as sacred, powerful, and deserving of reverence. Careless use attracts low-level spirits.' },
          { title: 'Connection is Ongoing', text: 'Daily practice maintains alignment with Source. Sporadic work loses the connection. Consistency builds power and reliability.' },
          { title: 'Check Your Motivation', text: 'Regularly examine your motivation: are you seeking divine connection to serve higher will, or seeking power to serve ego? Honest self-examination is essential.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Key of Solomon the King by S. L. MacGregor Mathers',
          'The Three Books of Occult Philosophy by Agrippa (on divine hierarchy)',
          'Planetary Magic by Austin Coppock',
          'Western esotericism texts on divine names and emanation',
          'Books on Solomonic ceremonial practice and invocation',
        ],
      },
    },
  },
  {
    name: 'Executors',
    subName: 'Angels',
    emoji: '👼',
    description: 'Command celestial servants aligned with divine will',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Office', emoji: '❤️', content: [
            { attribute: 'Definition', value: 'Defined hierarchical role - Each Archangel/Angel holds a specific position and function in divine hierarchy' },
            { attribute: 'Four Chiefs', value: 'Michael (protection), Gabriel (messages), Raphael (healing), Uriel (justice) govern primary domains' },
            { attribute: 'Planetary Angels', value: 'Seven planetary intelligences govern Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn effects' },
            { attribute: 'Stability', value: 'Angels never deviate from their office or function—they are what they do' },
          ]},
          { name: 'Execution', emoji: '⚡', content: [
            { attribute: 'Definition', value: 'Carry out lawful commands - They manifest commands aligned with divine will through celestial authority' },
            { attribute: 'Response', value: 'Angels respond to proper invocation instantly and completely within their domain' },
            { attribute: 'Limitation', value: 'Cannot execute commands outside their jurisdiction or contrary to divine law' },
            { attribute: 'Reliability', value: 'Properly invoked angels execute with perfect precision—no deviation or personal agenda' },
          ]},
          { name: 'Enforcement', emoji: '🚫', content: [
            { attribute: 'Definition', value: 'Compel compliance - They ensure obedience from subordinate beings and forces beneath them' },
            { attribute: 'Authority Chain', value: 'Archangels command angels, who command planetary spirits, who command elemental forces' },
            { attribute: 'Function', value: 'When you invoke an Archangel, their authority flows through you to command lower beings' },
            { attribute: 'Protection', value: 'Archangelic authority shields operator from rebellious or deceptive lower spirits' },
          ]},
          { name: 'Verification', emoji: '✓', content: [
            { attribute: 'Definition', value: 'Confirm legitimacy - They verify that commands are genuinely authorized by divine Source' },
            { attribute: 'Alignment Test', value: 'Angels ensure your intention aligns with divine will before granting power to commands' },
            { attribute: 'Rejection', value: 'If work is unethical or selfish, true angels simply don\'t respond—lower spirits may impersonate them' },
            { attribute: 'Practice', value: 'Test spirits by asking them to affirm divine principles—true angels always honor God' },
          ]},
          { name: 'Transmission', emoji: '📡', content: [
            { attribute: 'Definition', value: 'Relay authority unchanged - They pass divine commands without distortion or personal agenda' },
            { attribute: 'Purity', value: 'Angels are pure transmitters—they add nothing, remove nothing, distort nothing' },
            { attribute: 'Channel', value: 'When properly invoked, you receive divine teaching or power exactly as intended' },
            { attribute: 'Clarity', value: 'Angelic communication is clear, coherent, and aligned with higher wisdom' },
          ]},
          { name: 'Stability', emoji: '🪚', content: [
            { attribute: 'Definition', value: 'Unaffected by emotion or ego - They execute with pure focus, untouched by human limitation' },
            { attribute: 'Consistency', value: 'Angels never waver, doubt, resist, or change—they are absolutely reliable' },
            { attribute: 'Contrast', value: 'Unlike humans or lower spirits, angels have no personal desires or agendas' },
            { attribute: 'Trust', value: 'This stability makes angels safe and trustworthy allies in Solomonic work' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'The Celestial Hierarchy & Angelic Orders',
            content: 'Solomonic magic operates through a precise celestial hierarchy: God → Archangels → Angels → Planetary Intelligences. Archangels (also called Executor Angels or Celestial Executors) are the commanders of divine will—they carry out God\'s purposes and govern the lower celestial orders. The four main Archangels in Western tradition (Michael, Gabriel, Raphael, Uriel) rule specific domains: Michael governs protection and divine will, Gabriel handles messages and divine announcements, Raphael oversees healing and wisdom, Uriel manages divine justice. In Solomonic work, these Archangels are not commanded but respectfully invoked to lend their authority to your work.',
          },
          {
            heading: 'Invocation vs. Evocation of Angels',
            content: 'Critical distinction: Archangels and High Angels are invoked (drawn in), never evoked (summoned/commanded). Invocation is humble and respectful—you call upon their presence and ask for their assistance aligned with divine will. Evocation is commanding spirits to appear—inappropriate for high celestial beings. When invoking an Archangel, you address them with reverence: "I call upon Archangel Michael, guardian of divine will and protector of the faithful, that you lend your strength and authority to this work." The Archangel grants assistance through their willingness, not through your command.',
          },
          {
            heading: 'The Four Archangels & Their Domains',
            content: 'Michael (Fire, South, Red) - Warrior angel of divine will and protection. Invoked for protection, courage, overcoming obstacles, dispelling darkness. Gabriel (Water, West, White) - Angel of messages and divine announcements. Invoked for clear communication, receiving guidance, major life transitions. Raphael (Air, East, Yellow) - Angel of healing and wisdom. Invoked for health, learning, journeys, clear thinking. Uriel (Earth, North, Green) - Angel of divine justice and consequences. Invoked for justice, truth, grounding, manifestation. Each Archangel represents a divine principle—when you invoke them, you align with that principle.',
          },
          {
            heading: 'Planetary Angels & Intelligences',
            content: 'Below the four chief Archangels exists a precise hierarchy of Planetary Angels (also called Intelligences) governing each planet: Sun (divine consciousness, leadership), Moon (emotions, intuition), Mercury (communication, intellect), Venus (love, harmony), Mars (will, courage), Jupiter (expansion, wisdom), Saturn (limitations, structure). Each planetary angel governs specific effects and manifestations. When you need planetary power (prosperity from Jupiter, courage from Mars), you invoke that planet\'s angel with clear intention and respect. The angels grant access to planetary forces when work is aligned with divine will.',
          },
          {
            heading: 'The Names & Seals of Angels',
            content: 'Each Archangel and Planetary Intelligence has specific Names and Seals (geometric symbols). These Names and Seals are not random—they contain the essence of the angel\'s power and serve as keys for invocation. Michael\'s seal, for instance, contains specific geometry that activates protection and divine will. When you write or speak an angel\'s Name with understanding and intention, you activate that angel\'s presence. The Seal drawn, written, or visualized during invocation amplifies the connection. Treating these Names and Seals with respect ensures powerful and reliable angelic response.',
          },
          {
            heading: 'Angelic Correspondence & Calling Upon Support',
            content: 'In Solomonic work, specific situations call upon specific angels: Needing protection? Call Michael with respect. Seeking truth and clarity? Invoke Raphael. Needing courage to speak? Call Gabriel. Seeking justice or grounding? Invoke Uriel. For more specific planetary work: wanting prosperity? Call Jupiter\'s intelligence. Seeking love and harmony? Call Venus\'s angel. The more precisely you understand what you need and which angel governs that domain, the more directly assistance flows. Match your need to the appropriate celestial being, then invoke with clear intention and pure heart.',
          },
          {
            heading: 'Protection & Purification Through Angelic Work',
            content: 'One of the primary Solomonic uses of angelic work is purification and protection. Beginning practitioners often call upon the four Archangels to establish protective barriers: Michael at the South (protection and will), Gabriel at the West (purity and intuition), Raphael at the East (wisdom and clarity), Uriel at the North (grounding and justice). This creates a protected sacred space where you can work safely. Regular invocation of the four Archangels maintains your personal protection and connection to Source through the celestial hierarchy. This is foundational protective magic that serves all further work.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the four chief Archangels—learn their names, domains, colors, and how they govern different aspects of life',
          'Research the Names and Seals of each Archangel—understand these are keys for invocation',
          'Create a sacred space: physically clean, quiet, oriented to directions if possible',
          'Begin with a simple four-Archangel protection invocation: speak to each in turn with respect, asking for their presence and protection',
          'Practice invoking Michael for protection, asking him to surround you with divine protection and courage',
          'Learn the Planetary Angels and their correspondences to the seven classical planets',
          'Practice planetary invocation: for a specific need, invoke the angel of the corresponding planet',
          'Begin keeping a journal of your angelic work: record invocations, results, and synchronicities',
          'Develop ongoing relationship with your patron Archangel through regular invocation and gratitude',
          'Study the hierarchy of angels and understand that invocation flows upward through respect and alignment',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Invoke, Never Evoke', text: 'High celestial beings are invoked with respect and humility, never commanded or evoked. Demanding summoning of Archangels results in no response or deceptive lower spirits.' },
          { title: 'Purity of Heart Matters', text: 'Angels respond to pure intention. If you invoke for selfish or harmful purposes, you won\'t connect with true celestial beings. Self-deceptive spirits may respond to impure calls.' },
          { title: 'Learn the Names', text: 'The Divine Names and Archangel Names are keys—learn to pronounce them correctly. Proper Names carry power; mispronounced names weaken connection.' },
          { title: 'Regular Practice Deepens Connection', text: 'Daily invocation of Archangels strengthens your connection to the celestial hierarchy. Sporadic calls receive sporadic response. Consistency builds relationship.' },
          { title: 'Test the Spirits', text: 'Always test spirits for divine alignment: Do they teach wisdom and virtue? Do they encourage ethical conduct? Do they honor divine will? True angels affirm these always.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Key of Solomon (Archangel sections)',
          'Three Books of Occult Philosophy by Agrippa (Angels and Intelligences)',
          'Summoning Spirits by Christopher Penczak',
          'The Sacred Magic of the Angels by David Rankine',
          'Planetary Magic resources covering each planet\'s Intelligence',
        ],
      },
    },
  },
  {
    name: 'Subjects',
    subName: 'Spirits',
    emoji: '👻',
    description: 'Command and bind elemental and planetary spirits',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Ontology', emoji: '🌌', content: [
            { attribute: 'Definition', value: 'Non-human intelligences - Spirits exist as distinct classes of consciousness separate from human awareness' },
            { attribute: 'Types', value: 'Elemental spirits (Fire, Water, Air, Earth) and planetary spirits serve specific natural forces' },
            { attribute: 'Nature', value: 'Not evil or demonic but subordinate intelligences with limited function and understanding' },
            { attribute: 'Consciousness', value: 'Possess agency and intelligence within their domain but lack human free will or moral capacity' },
          ]},
          { name: 'Functionality', emoji: '⚙️', content: [
            { attribute: 'Definition', value: 'Task-oriented existence - Each spirit type serves specific functions and elemental/planetary operations' },
            { attribute: 'Fire Spirits', value: 'Provide transformation, will, passion, and rapid change' },
            { attribute: 'Water Spirits', value: 'Govern emotions, intuition, flow, and healing' },
            { attribute: 'Air Spirits', value: 'Handle communication, intellect, travel, and swift movement' },
            { attribute: 'Earth Spirits', value: 'Manage material manifestation, grounding, and physical resources' },
          ]},
          { name: 'Constraint', emoji: '⛓️', content: [
            { attribute: 'Definition', value: 'Bound by law and names - True names and divine law hold spirits to their nature and compel obedience' },
            { attribute: 'Seals', value: 'Each spirit\'s geometric seal serves as binding mechanism and key of command' },
            { attribute: 'Names', value: 'Speaking the spirit\'s true name with divine authority compels them to manifest and obey' },
            { attribute: 'Hierarchy', value: 'All spirits are subject to divine authority flowing through proper Solomonic procedure' },
          ]},
          { name: 'Domain', emoji: '🗺️', content: [
            { attribute: 'Definition', value: 'Limited operational scope - Spirits cannot act outside their element, sphere, or delegated authority' },
            { attribute: 'Boundaries', value: 'Fire spirits cannot perform water work; Mercury spirits cannot do Saturn work' },
            { attribute: 'Jurisdiction', value: 'Attempting to command beyond a spirit\'s domain produces failure or chaotic results' },
            { attribute: 'Matching', value: 'Success requires matching the right spirit to the work\'s elemental or planetary nature' },
          ]},
          { name: 'Responsiveness', emoji: '📍', content: [
            { attribute: 'Definition', value: 'Appear only under jurisdiction - They manifest when properly invoked within legitimate authority' },
            { attribute: 'Requirements', value: 'Correct seal, correct name, divine authority, proper timing, and protective geometry' },
            { attribute: 'Failure', value: 'Incomplete procedure or impure operator results in non-manifestation or deceptive spirits' },
            { attribute: 'Speed', value: 'Properly summoned spirits respond immediately—hesitation indicates procedural errors' },
          ]},
          { name: 'Departure', emoji: '↩️', content: [
            { attribute: 'Definition', value: 'Must withdraw when licensed - They are bound to obey license and return to sphere when dismissed' },
            { attribute: 'Formula', value: 'Formal dismissal releases binding and commands spirit to return to their natural place' },
            { attribute: 'Completion', value: 'Never leave spirits unbound—improper dismissal creates energetic rifts and complications' },
            { attribute: 'Closure', value: 'Breaking the seal, closing the circle, and banishing ensures complete departure' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Elemental & Planetary Spirits',
            content: 'Below the Archangels and Planetary Intelligences exist lower-order spirits that serve elemental and planetary forces. These spirits are not evil or demonic but subordinate intelligences with specific functions and limitations. Each element (Fire, Water, Air, Earth) has associated spirits; each planet has assigned spirits serving its function. These are the "subjects" in the Solomonic hierarchy—they are bound by the authority that flows from the Source through the Archangels. Understanding their nature and limitations is essential: these spirits can be commanded through proper authority, but they are not allies—they are servants compelled by divine power.',
          },
          {
            heading: 'The Four Elemental Kings & Their Spirits',
            content: 'Each element is governed by a King/Lord of Spirits: Djinn (Fire) - fiery, passionate, swift, unpredictable. Mermaids/Naiads (Water) - emotional, flowing, intuitive, changeable. Sylphs/Zephyrs (Air) - intellectual, communicative, swift, capricious. Gnomes/Dwarves (Earth) - solid, grounded, slow, persistent. Each elemental king commands legions of spirits serving that element. Fire spirits are summoned for transformation and will; Water spirits for emotions and flow; Air spirits for communication and intellect; Earth spirits for grounding and manifestation. Understanding which element serves your work guides which spirits to summon.',
          },
          {
            heading: 'Planetary Spirits & Their Functions',
            content: 'Each of the seven classical planets has associated spirits serving that planet\'s function: Sun spirits serve power and consciousness; Moon spirits govern emotions and tides; Mercury spirits handle communication; Venus spirits manage love and harmony; Mars spirits provide courage and conflict; Jupiter spirits grant expansion and prosperity; Saturn spirits enforce limitations and structure. When you need planetary effect, you summon that planet\'s spirits through their proper seals and names. The spirits are bound by the Names and compelled by divine authority flowing through you as the magician.',
          },
          {
            heading: 'Summoning & Binding Spirits Through Evocation',
            content: 'Evocation is the process of summoning spirits into manifestation and binding them to service. The procedure: 1) Cast a protective circle with divine names, 2) Draw the spirit\'s seal (geometric signature), 3) Call the spirit\'s name with divine authority, 4) Present your binding command with clear purpose, 5) The spirit appears in the triangle or scrying surface, 6) Issue your command with authority (they have no choice—they are bound by the names and the hierarchy), 7) Dismiss the spirit when the work is complete. This is not negotiation or conversation but authoritative command based on divine power flowing through you.',
          },
          {
            heading: 'Seals, Names & Sigils as Keys of Command',
            content: 'Each spirit has a unique Seal (geometric signature) and Name (word of power). The Seal is drawn or written to establish connection and containment. The Name is called to activate the spirit\'s presence and bind them to your will. These are not arbitrary—they are the vibrational keys that activate specific spirits. When you draw the Seal correctly and call the Name with authority, the spirit is compelled to manifest. Incorrect Seals or Names won\'t work. Sloppy drawing weakens command. This is why precision matters in Solomonic work—the geometry and pronunciation are literally the mechanism of authority.',
          },
          {
            heading: 'The Triangle of Manifestation & Circle of Protection',
            content: 'In classical Solomonic summoning, the magician stands within a protective circle (sometimes hexagon) marked with divine names, while the spirit is commanded into a triangle outside the circle. This creates energetic containment: the circle protects the magician and ensures the spirit cannot harm them; the triangle limits the spirit to a specific manifestation point. The circles and triangles are drawn with geometric precision and filled with divine names (Tetragrammaton, names of angels, etc.). This is not mere symbolism—these geometric boundaries are actual energetic containers that bind spirits and protect the operator.',
          },
          {
            heading: 'Testing & Commanding Obedience',
            content: 'Once a spirit appears, you must establish authority through tested commands. Begin with small tasks to verify obedience: command the spirit to move visible items in the triangle, to speak clearly, to confirm their name and nature. Only when obedience is demonstrated do you issue your real work. Disobedience is rare (the binding is usually absolute) but indicates a false or deceptive spirit. If the spirit resists or refuses, immediately banish with divine names and try again with correct seals/names. True spirits compelled by proper Solomonic authority obey instantly—hesitation or refusal means something is wrong with your procedure.',
          },
          {
            heading: 'Dismissal & Closure of Spirit Work',
            content: 'Never leave spirits manifested or bound longer than necessary. After your work is complete, dismiss formally: command the spirit to return to their place, break the Seal, and close the circle with divine names. Improper dismissal leaves energetic rifts and can attract unwanted attention. Proper closure ensures: the spirit returns completely, no residual presence remains, the circle is sealed and the space returns to normal. Each evocation must be completed with ritual closure. Sloppy dismissal is dangerous—spirits, even when properly compelled, can cause problems if improperly released.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the hierarchy of spirits—understand that lower spirits are subjects compelled by divine authority',
          'Learn to draw the protective circle correctly with divine names written in sequence',
          'Research one elemental king\'s spirits (e.g., the Fire King and his subjects)',
          'Study the Seal and Name of one specific spirit—learn pronunciation and correct geometry',
          'Draw the spirit\'s Seal carefully and precisely—geometry is the key to authority',
          'In your practice space, draw a protective circle (can be symbolic, not physical)',
          'Practice calling the spirit\'s name three times with authority (not invitation, command)',
          'Learn the proper banishing formula using divine names',
          'Practice with lower spirits before attempting high conjurations',
          'Keep detailed records of all evocations—what spirits, what they did, how well they obeyed',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Precision in Seals', text: 'Draw the Seal exactly as shown. Sloppy geometry weakens authority. The spirit\'s response depends on precise construction of the binding geometry.' },
          { title: 'Divine Names are Absolute', text: 'The power comes from divine authority, not your personal power. The Names are what compel obedience. Mispronounced or carelessly invoked Names won\'t work.' },
          { title: 'Circle Protection First', text: 'Always cast the circle before summoning. Never stand unprotected when calling spirits. The circle is your absolute defense.' },
          { title: 'Clear Commands Only', text: 'Spirits obey literally and precisely. Be specific about what you want. Vague commands produce vague or chaotic results.' },
          { title: 'Dismiss Completely', text: 'Never skip dismissal. Always banish formally when done. Improper dismissal creates complications and attracts further unwanted contact.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Key of Solomon (complete text with Seals)',
          'The Goetia by S. L. MacGregor Mathers',
          'Lesser Key of Solomon (72 spirits and their Seals)',
          'Three Books of Occult Philosophy by Agrippa (spirits)',
          'Modern Grimoire texts by Joseph H. Peterson',
        ],
      },
    },
  },
  {
    name: 'Operator',
    subName: 'Intermediary',
    emoji: '🧙',
    description: 'Establish yourself as the priest-magician and channel between realms',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Delegation', emoji: '🤝', content: [
            { attribute: 'Definition', value: 'Authority is borrowed - The operator channels divine will through proper alignment, not personal power' },
            { attribute: 'Source', value: 'All power flows from God through the celestial hierarchy to the operator as temporary vessel' },
            { attribute: 'Humility', value: 'Recognizing yourself as channel, not source, keeps authority pure and effective' },
            { attribute: 'Ego Danger', value: 'Claiming personal power corrupts the channel and attracts deceptive spirits' },
          ]},
          { name: 'Legitimacy', emoji: '✨', content: [
            { attribute: 'Definition', value: 'Alignment over confidence - True authority comes from spiritual alignment, not personal belief' },
            { attribute: 'Ethical Purity', value: 'Right conduct, honest intention, and alignment with higher good establish legitimacy' },
            { attribute: 'Preparation', value: 'Fasting, meditation, prayer, and purification build genuine authority spirits recognize' },
            { attribute: 'Recognition', value: 'Spirits perceive legitimacy directly—they respond to alignment, not to pretense or force' },
          ]},
          { name: 'Conduct', emoji: '🕊️', content: [
            { attribute: 'Definition', value: 'Restraint preserves command - Discipline and ethical behavior strengthen the operator\'s authority' },
            { attribute: 'Consistency', value: 'Living with integrity daily maintains the purity required for powerful Solomonic work' },
            { attribute: 'Preparation Period', value: 'Traditional practice requires days or weeks of purification before major operations' },
            { attribute: 'Ongoing Work', value: 'Regular spiritual practice, ethical living, and self-examination maintain operator worthiness' },
          ]},
          { name: 'Tone', emoji: '🔱', content: [
            { attribute: 'Definition', value: 'Legal address, not force - The operator speaks with authority of divine law, never through coercion' },
            { attribute: 'Command', value: 'Speak clearly, firmly, with confidence in divine authority backing your words' },
            { attribute: 'Not Violence', value: 'Authority is calm declaration of divine will, not angry demands or desperate pleading' },
            { attribute: 'Balance', value: 'Neither timid uncertainty nor aggressive force—steady, clear, authoritative presence' },
          ]},
          { name: 'Liability', emoji: '⚖️', content: [
            { attribute: 'Definition', value: 'Responsibility for outcomes - The operator bears full responsibility for consequences of their work' },
            { attribute: 'Ethical Debt', value: 'Harmful or selfish operations create karmic consequence that falls on the operator' },
            { attribute: 'Accountability', value: 'You cannot blame spirits for results—you directed them, you own the outcome' },
            { attribute: 'Wisdom', value: 'This responsibility encourages thoughtful, ethical work rather than impulsive or harmful magic' },
          ]},
          { name: 'Continuity', emoji: '🔄', content: [
            { attribute: 'Definition', value: 'Maintains lawful order - The operator preserves the integrity of the hierarchical chain' },
            { attribute: 'Respect', value: 'Honor the hierarchy: invoke angels, command spirits, worship only God' },
            { attribute: 'Boundaries', value: 'Never blur levels—don\'t command angels or worship spirits' },
            { attribute: 'Preservation', value: 'Proper practice maintains sacred order; improper work corrupts the entire system' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'The Magician as Operator & Priest',
            content: 'In Solomonic magic, the operator is not a mere practitioner but a priest—a consecrated vessel through which divine authority flows into the material world. The operator establishes and maintains the connection between divine Source and manifesting intention. This role requires: spiritual development and discipline, ethical purity and right conduct, authority derived from alignment with divine will (not personal ego), capacity to command spirits through this divine authority, responsibility for the consequences of the work performed. The operator is simultaneously servant (of divine will) and master (of spirits and manifestation). This paradox—servant-master—is central to understanding the operator\'s true power.',
          },
          {
            heading: 'The Magician\'s Personal Development',
            content: 'Before commanding spirits or drawing divine power, the operator must develop themselves spiritually and psychologically. This includes: meditation and concentration (ability to hold focused attention), knowledge of the celestial hierarchy (understanding where authority comes from), self-discipline (controlling impulses and ego desires), emotional maturity (managing fear, greed, anger), spiritual awareness (perceiving beyond the physical), and ethical clarity (knowing right conduct in complex situations). The magician who commands outer spirits must first master inner chaos. Development is ongoing throughout life—there is always deeper work to undertake. Many practitioners spend years in study before attempting their first serious evocation.',
          },
          {
            heading: 'Ritual Purity & Preparation',
            content: 'Solomonic work demands ritual purity before engaging with spirits and divine authority. This includes: physical cleansing (bathing before rituals), fasting (abstaining from food/drink for the period before work), sexual continence (abstaining for specific periods), mental clarity (clearing worries and distractions), emotional balance (approaching work with calm resolve, not desperation), spiritual alignment (regular prayer/meditation leading up to the work). Proper preparation isn\'t punishment—it\'s tuning your instrument. Showing up unprepared to command spirits is like trying to perform surgery with dirty hands. The preparation period gives spirits time to recognize and respect your seriousness.',
          },
          {
            heading: 'Authority vs. Ego in the Operator',
            content: 'Critical distinction: The operator\'s power comes from divine authority flowing through them, not from personal strength or will. An ego-driven magician trying to command through personal power will fail or attract deceptive spirits. The operator must understand: "I am not commanding these spirits through my personal force—I command through divine authority I have invoked and earned through alignment with higher will. I am the channel, not the source." When the operator can truly surrender ego and align with divine will, their commands become irresistible to spirits. When ego remains in control, the operator appears weak and spirits may refuse or deceive.',
          },
          {
            heading: 'Ethical Responsibility & Accountability',
            content: 'Every operation has consequences that extend beyond the immediate result. Spirits commanded to cause harm will obey, but the ethical debt falls on the operator. Karmic consequence for unethical operations may manifest immediately or over years. The operator must understand: harmful magic rebounds; self-serving magic attracts deceptive entities; breaking oaths made to spirits invites their vengeance; commanding spirits beyond your authority corrupts your practice. Professional Solomonic practitioners maintain strict ethical codes not from niceness but from understanding spiritual mechanics. Results without ethics are hollow; ethics without willingness to act are cowardice. The balance is constant discernment.',
          },
          {
            heading: 'Consciousness Development & Inner Work',
            content: 'As the operator works with spirits and divine forces, their consciousness develops and expands. This is not automatic—it requires integration work: journaling about experiences, meditating on lessons learned, examining how contact with higher forces changes your perception. Over time, the operator perceives the world differently: seeing energetic flows, recognizing spirit presence, understanding symbolic communication, recognizing synchronicities. This expanded consciousness is itself a power—you begin to live naturally aligned with the work. The operator who truly develops becomes a beacon for higher forces and a channel for manifestation in daily life.',
          },
          {
            heading: 'Integration of Inner & Outer Work',
            content: 'The most powerful Solomonic practice integrates inner development (meditation, study, psychological work) with outer work (ritual, evocation, commanding manifestation). Inner work without outer manifestation becomes isolated spirituality disconnected from reality. Outer work without inner development becomes mechanical manipulation lacking true power. The mature operator works both dimensions: developing consciousness and wisdom internally while manifesting real effects externally. This integration creates a practitioner whose inner and outer worlds align—what they will internally manifests externally, creating coherence and power. The path of the operator is ultimately wholeness.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Establish a daily spiritual practice: meditation or prayer to develop connection with Source and inner discipline',
          'Study the complete celestial hierarchy: understand where each level of spirits fits and what authority governs them',
          'Begin a rigorous self-examination practice: journal about motivations, emotional reactions, ethical choices, and patterns',
          'Prepare your workspace: designate a clean, protected space where you will conduct your Solomonic work',
          'Learn ethical principles: study Solomonic texts to understand the ethical framework of the tradition',
          'Practice concentration meditation: develop ability to hold focused attention for extended periods',
          'Master protective practices: learn to draw protective circles and invoke protective beings reliably',
          'Keep a detailed practice journal: record all work, intentions, results, and lessons learned',
          'Develop relationship with your patron angel or guide through regular meditation and invocation',
          'Begin with preparatory work: spend weeks or months in study and preparation before attempting any evocations',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Never Rush Development', text: 'Attempting advanced operations before personal development is complete attracts low-level spirits and creates problems that take years to resolve.' },
          { title: 'Ego is Your Worst Enemy', text: 'The ego-driven operator fails or succeeds only in attracting deceptive entities. True power comes from ego-surrender and alignment.' },
          { title: 'Preparation Multiplies Power', text: 'The time you invest in preparation (study, fasting, meditation) directly multiplies the effectiveness of your operations.' },
          { title: 'Keep Your Word', text: 'Every oath, promise, or agreement you make—to spirits, to yourself, to divine beings—must be honored completely or your authority crumbles.' },
          { title: 'Integration is Continuous', text: 'After each operation, spend time journaling and reflecting. The lessons learned from one operation improve all future work.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Key of Solomon (complete version with operator instructions)',
          'Three Books of Occult Philosophy by Agrippa (on the magician\'s development)',
          'The Magician\'s Companion by Bill Whitcomb',
          'Condensed Chaos by Phil Hine (on operator integration)',
          'Advanced Solomonic Magic by Stephen William Skinner',
        ],
      },
    },
  },
  {
    name: 'Geometry',
    subName: 'Order',
    emoji: '✡️',
    description: 'Draw forth the sacred jurisdiction of the shapes',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Circle', emoji: '⭕', content: [
            { attribute: 'Jurisdiction', value: 'Defines where divine law is in force - The circle marks the boundary of the operator\'s legal authority' },
            { attribute: 'Authority', value: 'Establishes the operator\'s legal standing - The circle grants the operator power to command within its bounds' },
            { attribute: 'Separation', value: 'Isolates operator from subject - The circle creates a barrier between the operator and summoned spirits' },
            { attribute: 'Stability', value: 'Maintains lawful conditions - The circle preserves the sacred space and prevents chaos intrusion' },
            { attribute: 'Containment', value: 'Restricts spirit movement - Spirits cannot leave the designated area without permission' },
            { attribute: 'Closure', value: 'Opens and closes legal proceedings - The circle formally begins and ends the magical operation' },
          ]},
          { name: 'Triangle', emoji: '△', content: [
            { attribute: 'Manifestation', value: 'Designated appearance location - The triangle marks where the spirit must materialize or appear' },
            { attribute: 'Containment', value: 'Confines the spirit\'s presence - The triangle restricts the spirit to that specific location' },
            { attribute: 'Distance', value: 'Prevents direct interaction - The triangle creates separation between operator and spirit' },
            { attribute: 'Constraint', value: 'Limits movement and influence - The triangle restricts what the spirit can do or access' },
            { attribute: 'Designation', value: 'Marks the subject of command - The triangle identifies the specific spirit being summoned' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Sacred Geometry: The Language of Creation',
            content: 'Sacred geometry represents the mathematical principles underlying all creation and divine order. In Solomonic magic, geometric forms are not decorative but operative—they are the actual language through which divine authority manifests into physical reality. Each shape carries specific meaning and power: circles define boundaries and contain power, squares represent the four elements and material manifestation, triangles point toward the divine or infernal realms, pentagrams command the five elements, hexagrams unite spirit and matter. When you draw these forms with precision and intention, you are literally writing in the language that spirits understand and obey. The shapes themselves are invocations—they call forth the principles they represent. This is why geometry in Solomonic work must be precise: you are constructing legal jurisdictions where spiritual laws override normal physical reality.',
          },
          {
            heading: 'The Circle: Boundary, Protection & Authority',
            content: 'The circle is the fundamental geometric tool of all Solomonic practice. It serves three functions simultaneously: boundary (defining where your authority begins and ends), protection (creating an impenetrable barrier against spiritual harm), and authority (establishing the legal jurisdiction where your commands have force). In traditional practice, the circle is drawn with careful precision—usually nine feet in diameter—and inscribed with divine names around the perimeter: Tetragrammaton (YHVH), Adonai, El Shaddai, and names of protective archangels. The operator stands within the circle during all conjuration work; spirits are summoned outside or into the triangle placed at the circle\'s edge. The circle is not superstition but operational reality: it represents a shift in jurisdiction where spiritual laws override normal physical reality. When properly drawn and consecrated with divine names, the circle becomes absolutely impenetrable to spirits—they cannot cross it or harm anything within it. Drawing the circle with conscious intention, clear pronunciation of names, and geometric precision creates a real energetic container that both protects you and amplifies your authority.',
          },
          {
            heading: 'The Triangle of Manifestation & Spirit Containment',
            content: 'While the circle protects the operator, the Triangle of Manifestation serves as the designated appearance point for summoned spirits. The triangle is traditionally drawn outside the circle\'s perimeter, with its apex pointing away from the operator. This geometric form creates a bounded space where spirits are compelled to manifest and remain visible. The triangle typically contains the name "Michael" at its apex (invoking archangelic authority) and divine names at each corner. Some traditions place a mirror or scrying surface within the triangle to make spirit manifestation more visible. The triangle serves critical functions: it gives the spirit a specific location to manifest (rather than appearing unpredictably), it constrains the spirit\'s movement (preventing them from approaching the operator), it focuses the spirit\'s energy into concentrated manifestation. The geometric principle: triangles are stable, grounded forms that cannot be easily broken or disrupted. A spirit bound within a properly drawn triangle has limited options—they must manifest there, they cannot leave without permission, and they cannot resist the authority directing them from within the circle. This is why precision in drawing the triangle matters as much as precision in the circle.',
          },
          {
            heading: 'The Pentagram: Command of Elements & Forces',
            content: 'The pentagram—five-pointed star—represents the human form (head, two arms, two legs) and dominion over the five elements (Earth, Water, Air, Fire, and Spirit/Aether). In Solomonic practice, the pentagram is drawn with a single unbroken line to represent unity and wholeness. The orientation matters: point-up pentagram represents spiritual dominion over matter, connection with higher forces, and the magician\'s authority. Point-down pentagram (historically controversial) represents descent of spirit into matter or invocation of infernal forces—rarely used in traditional Solomonic work except for specific operations. The pentagram is used in multiple ways: drawn on talismans for protection, traced in the air during invocations to command elemental forces, inscribed on ritual tools (wands, swords, altar cloths), worn as protective jewelry or robes during rituals. When the operator traces a pentagram while invoking divine names, they are establishing elemental command—asserting their right to direct Earth, Water, Air, Fire, and Spirit through divine authority. The Lesser Banishing Ritual of the Pentagram, developed from Solomonic principles, uses pentagrams drawn in four directions to establish absolute protection and elemental balance before any magical work.',
          },
          {
            heading: 'The Hexagram: Union of Opposites & Planetary Authority',
            content: 'The hexagram—six-pointed star formed by two overlapping triangles—represents the union of opposing forces: upward-pointing triangle (fire, masculine, active, spirit ascending) and downward-pointing triangle (water, feminine, receptive, spirit descending). This geometric symbol represents the central Hermetic axiom: "As above, so below"—the perfect balance and interpenetration of spiritual and material realms. In Solomonic practice, the hexagram is associated with planetary magic and the invocation of planetary intelligences. Each planet has a corresponding hexagram form drawn according to specific geometric ratios and inscribed with planetary names and symbols. The hexagram also represents the Seal of Solomon itself—the legendary ring that gave Solomon authority over all spirits and demons. When properly constructed and consecrated, the hexagram becomes a powerful tool for: invoking planetary influences and spirits, creating talismans for specific planetary effects, balancing opposing forces in complex workings, establishing supreme authority over spirits (as Solomon himself possessed). Drawing hexagrams requires understanding geometric construction—the angles and proportions must be precise or the seal loses its power.',
          },
          {
            heading: 'Seals & Sigils: Geometric Keys to Spirit Identity',
            content: 'Each spirit, angel, or demon in Solomonic tradition has an associated seal—a unique geometric pattern that serves as their signature, true name rendered in visual form, and key of command. These seals are not arbitrary drawings but precise geometric constructs that encode the spirit\'s essential nature and authority. When you draw a spirit\'s seal during summoning, you are: identifying which specific being you are calling (preventing confusion or deception), establishing a vibrational link to that spirit (the seal is their geometric frequency), activating their presence (proper drawing compels their attention and manifestation), binding them to your authority (the seal combined with divine names creates absolute command). Seals must be drawn with geometric precision—incorrect angles, proportions, or missing elements weaken or nullify the binding. Many practitioners create permanent seals on parchment or metal talismans consecrated for repeated use. The great grimoires—Key of Solomon, Goetia, Grimorium Verum—contain hundreds of spirit seals with specific instructions for their use. Learning to draw seals accurately is one of the fundamental skills of Solomonic practice. Some seals are simple (basic geometric forms), others are extraordinarily complex (interlocking patterns with multiple symbols and names). The complexity of the seal often reflects the power and nature of the spirit it represents.',
          },
          {
            heading: 'The Square & the Four Directions',
            content: 'The square represents material manifestation, the four elements, and the four cardinal directions (North, South, East, West). In Solomonic practice, squares are used to ground and stabilize magical operations: altars are often square or rectangular to represent material stability, ritual spaces may be marked at four corners to establish elemental balance, talismans for material manifestation (wealth, health, physical protection) are often inscribed on square parchment or metal. The square also represents the "magic square" or kamea—numerical patterns arranged in grids where each row, column, and diagonal sum to the same number. Each planet has an associated magic square: the Saturn square (3×3), the Jupiter square (4×4), the Mars square (5×5), the Sun square (6×6), the Venus square (7×7), the Mercury square (8×8), and the Moon square (9×9). These magic squares are used to construct planetary seals and talismans with specific mathematical precision. Drawing the square and invoking the four directions creates stability—it anchors spiritual work in physical reality and ensures manifestation occurs in the material world rather than remaining purely energetic or psychological.',
          },
          {
            heading: 'Precision, Practice & Geometric Mastery',
            content: 'Geometric mastery in Solomonic work requires disciplined practice and attention to detail. The difference between effective and ineffective geometry is precision: angles must be accurate, proportions must be correct, lines must be clean and unbroken, divine names must be spelled perfectly and placed in proper positions. Many practitioners spend months practicing geometric drawing before attempting their first spirit summoning. Tools for precision include: compass and straightedge for circles and perfect angles, rulers for measuring exact distances and proportions, templates or stencils for commonly used symbols, pre-drawn ritual cloths for consistent accuracy. Some practitioners create permanent ritual spaces with geometry painted on floors or walls, eliminating the need to redraw for each operation. The principle: geometry is not decoration but mechanism. When you draw a circle, you are literally constructing an energetic barrier. When you draw a seal, you are literally activating a spirit\'s essence. Sloppy geometry produces weak or failed results because the mechanism itself is broken. Mastery comes through repetition—draw the same circle one hundred times until your hand knows the motion perfectly. Practice seals until you can reproduce them from memory with precision. This discipline transforms geometry from intellectual concept into embodied skill, and embodied skill produces reliable magical results.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study Sacred Geometry Principles: Understand what each shape represents (circle=protection, square=matter, triangle=spirit, etc.) and how they function in magical tradition',
          'Practice Drawing Circles: Begin by drawing circles with compass or hand. Make them as perfect as possible. Each circle is practice in focused intention',
          'Learn Spirit Seals: Study the seals of spirits you wish to work with. Understand the geometry of their seals before attempting summoning',
          'Draw Ritual Spaces: Before summoning work, draw the ritual space carefully. Include protective circles, squares for elements, and seals as needed',
          'Consecrate Your Tools: Create or purchase tools marked with sacred geometric patterns. Consecrate them to their purpose before use',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Precision Matters', text: 'Geometric shapes work through their mathematical perfection. Draw carefully and with intention.' },
          { title: 'Know Your Symbols', text: 'Before drawing a symbol, understand what it represents and why. Conscious knowledge amplifies effectiveness.' },
          { title: 'Use Proper Materials', text: 'Draw ritual spaces with salt, chalk, or tools made from natural materials aligned with the work.' },
          { title: 'Reconsecrate Spaces', text: 'If a ritual space is used multiple times, reconsecrate it regularly to maintain its power.' },
          { title: 'Geometry + Names', text: 'Combine geometric shapes with divine/spirit names for maximum authority.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Key of Solomon (with seal illustrations)',
          'Sacred Geometry by Robert Lawlor',
          'The Kybalion (on hermetic principles underlying geometry)',
          'Goetia: The Lesser Key of Solomon (complete seal catalogue)',
          'The Magician\'s Companion by Bill Whitcomb (on sigil construction)',
        ],
      },
    },
  },
  {
    name: 'Conditioning',
    isSpacer: true,
  },
  {
    name: 'Purity',
    subName: 'Vessel Worth',
    emoji: '💎',
    description: 'Purify yourself to become a worthy conduit for divine power',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Alignment', emoji: '🧿', content: [
            { attribute: 'Definition', value: 'Coherence with authority - Inner state resonates with divine source at all levels' },
            { attribute: 'Physical', value: 'Cleanliness, proper dress, and physical order create clean energetic container' },
            { attribute: 'Mental', value: 'Focused attention, clarity of purpose, and freedom from distraction' },
            { attribute: 'Spiritual', value: 'Connection with divine purpose through prayer, meditation, and reverent intention' },
          ]},
          { name: 'Preparation', emoji: '🚿', content: [
            { attribute: 'Definition', value: 'Fasting as calibration - Restraint from food/distractions attunes the vessel to higher frequencies' },
            { attribute: 'Bathing', value: 'Ritual bathing before work removes accumulated energy and represents shedding old states' },
            { attribute: 'Fasting', value: 'Abstaining from food for hours or days before major work sharpens spiritual sensitivity' },
            { attribute: 'Timing', value: 'Traditional preparation periods range from 3 days to 40 days for major operations' },
          ]},
          { name: 'Abstinence', emoji: '🙏', content: [
            { attribute: 'Definition', value: 'Removes conflicting claims - Purification eliminates opposing energetic claims on consciousness' },
            { attribute: 'Sexual', value: 'Abstaining from sexual activity before work conserves and redirects creative energy' },
            { attribute: 'Substance', value: 'Avoiding alcohol, drugs, and intoxicants maintains mental clarity and spiritual purity' },
            { attribute: 'Focus', value: 'Limiting distractions and entertainment concentrates attention on the sacred work' },
          ]},
          { name: 'Consistency', emoji: '⏳', content: [
            { attribute: 'Definition', value: 'Preserves legitimacy - Ongoing purity sustains authority and power over time' },
            { attribute: 'Daily Practice', value: 'Regular meditation, prayer, or spiritual discipline maintains baseline purity' },
            { attribute: 'Lifestyle', value: 'Ethical living, honest conduct, and integrity in all dealings preserve spiritual authority' },
            { attribute: 'Accumulation', value: 'Years of consistent practice create deep reserves of purity and power' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Purity as Worthiness',
            content: 'In Solomonic magic, purity is not moral judgment but operational necessity. The operator must become a worthy vessel through which divine authority can flow. Think of it like tuning an instrument: an out-of-tune instrument produces noise; a properly tuned instrument produces music. Similarly, an impure operator distorts divine power into chaos; a pure operator channels it clearly and powerfully. Purity has multiple dimensions: physical cleanliness (bathing, clean clothes), mental clarity (focused attention, freedom from distraction), emotional balance (peace rather than fear or greed), ethical alignment (right conduct and honest intention), spiritual attunement (connection with divine purpose). The more pure the vessel, the more powerful and reliable the work.',
          },
          {
            heading: 'Physical Purity & Cleanliness',
            content: 'Physical purification is the foundation: Bathe before ritual work—washing removes accumulated energy and represents shedding old states. Wear clean clothes dedicated to magical work—preferably white or colored according to the work (red for Mars work, yellow for Mercury, etc.). Clean your working space: remove clutter, sweep or vacuum, open windows for fresh air. Physical cleanliness isn\'t superficial—it creates a clean energetic container. Many Solomonic practitioners bathe with saltwater or herbal infusions before serious work. Some traditions require specific timing of bathing (before dawn, under moonlight). The key: physical cleanliness reflects and supports mental/spiritual clarity.',
          },
          {
            heading: 'Mental Clarity & Focused Intention',
            content: 'Mental purity means: absence of distraction (clear mind, not worrying about bills or relationships), singular focus (one clear intention, not scattered desires), honesty with yourself (acknowledging real motivations), freedom from confusion (understanding what you\'re doing and why). Before ritual work, many practitioners spend 30 minutes to several hours in meditation or prayer to settle the mind. This time clears mental clutter, grounds attention, and aligns intention. A scattered or confused operator produces scattered results. A focused operator produces clear results. Mental purity is developed through meditation practice, study, and honest self-examination.',
          },
          {
            heading: 'Emotional Balance & Inner Peace',
            content: 'Emotional purity doesn\'t mean suppression but balance: Don\'t work when consumed by strong emotion (intense fear, rage, desperation, lust). These emotions distort intention and attract lower, deceptive spirits. Approach work with calm resolve, inner peace, and emotional steadiness. If you\'re anxious about results, take time to meditate and align with acceptance. If you\'re angry, wait until the anger dissipates. If you\'re desperate, ground yourself in the knowledge that the work is powerful regardless. Emotional balance is developed through meditation, breathwork, and emotional processing. Some practitioners use grounding techniques (holding stones, walking barefoot, connecting with nature) to balance emotions before work.',
          },
          {
            heading: 'Ethical Alignment & Right Conduct',
            content: 'Ethical purity means: working only for purposes aligned with higher good, using honest methods (no manipulation or deception), maintaining integrity in all dealings, fulfilling all agreements and oaths. An operator conducting unethical work pollutes their own instrument—they become a corrupted vessel that attracts deceptive spirits and creates karmic debt. The paradox: the most effective way to get what you want is to work ethically and surrender the specifics to higher intelligence. Unethical work might produce short-term results but creates long-term complications. Ethical work might take longer but produces reliable, clean results without karmic consequence. True power comes from ethical alignment.',
          },
          {
            heading: 'Spiritual Attunement & Connection with Source',
            content: 'Spiritual purity is the deepest dimension: maintaining daily connection with Source through prayer, meditation, or contemplation; studying spiritual principles and wisdom traditions; recognizing yourself as a channel for divine power, not the power itself; approaching work with reverence for the forces you\'re engaging. The operator who maintains constant connection with Source becomes increasingly sensitive to divine guidance. They begin to perceive synchronicities, receive intuitive knowing, and work in alignment with higher purpose. This attunement develops over time through consistent practice and genuine spiritual commitment.',
          },
          {
            heading: 'Purification Practices & Maintenance',
            content: 'Sustained purity requires ongoing practice: Daily meditation or prayer maintains mental and spiritual clarity. Regular bathing (especially before important work) maintains physical purity. Journaling and self-examination maintain ethical alignment. Retreats or extended practice periods deepen all dimensions. Many Solomonic practitioners maintain regular fasts (one day per month, one week per year) to deepen purity and sensitivity. Some follow specific diets during periods of intensive work. The goal is not ascetic extremism but conscious attention to the body and mind as instruments of the work. As you maintain practices, purity becomes natural—less effort and more natural alignment.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Establish a daily meditation or prayer practice to develop mental clarity and spiritual connection',
          'Create a bathing ritual: before bed or before dawn, wash consciously with intention to purify',
          'Designate clean clothes or a specific outfit for magical work—wash and care for them consciously',
          'Clean and organize your workspace—remove clutter, arrange it with intention and care',
          'Begin keeping a journal of your inner state: emotions, thoughts, clarity, and alignment',
          'Practice emotional grounding: breathing techniques, cold water, contact with earth/nature',
          'Study ethical principles and examine your own conduct honestly—identify areas for improvement',
          'Establish a weekly practice time where you work with full attention and minimal distractions',
          'Consider occasional fasting: one meal per day, one day per month, or one week per year',
          'Track the correlation between purity practices and the quality of your magical work and results',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Purity Multiplies Power', text: 'The time invested in purification directly multiplies the effectiveness and reliability of your work. Skipping preparation is penny-wise and pound-foolish.' },
          { title: 'Emotional State Matters', text: 'Never work in strong emotion (desperation, rage, intense fear). Wait until you\'re calm and clear. Desperate work attracts deceptive results.' },
          { title: 'Ethical Work is Powerful Work', text: 'Unethical work might seem effective but creates complications. Ethical work is ultimately more powerful and produces clean results.' },
          { title: 'Purity is Ongoing', text: 'One ritual of purification doesn\'t last forever. Maintain practices regularly. Daily practice is better than sporadic intense work.' },
          { title: 'Listen to Intuition', text: 'If something feels wrong, don\'t proceed. Your intuition recognizes purity or contamination. Trust it.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Key of Solomon (on purification requirements)',
          'Meditation and mindfulness teachings (any tradition)',
          'Ethical philosophy texts (Marcus Aurelius, Stoic philosophy)',
          'Books on emotional intelligence and self-awareness',
          'Practical guides to fasting and spiritual discipline',
        ],
      },
    },
  },
  {
    name: 'Timing',
    subName: 'Celestial Connection',
    emoji: '⏰',
    description: 'Align work with celestial and natural cycles',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Hours', emoji: '⌚', content: [
            { attribute: 'Definition', value: 'Jurisdictional windows - Each planetary hour governs specific operations and spirits' },
            { attribute: 'Sequence', value: 'Seven planets rule hours in order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon' },
            { attribute: 'Matching', value: 'Work Jupiter hour for prosperity, Mars hour for courage, Venus hour for love' },
            { attribute: 'Calculation', value: 'Planetary hours divide day/night into 12 segments each based on sunrise and sunset' },
          ]},
          { name: 'Days', emoji: '📅', content: [
            { attribute: 'Definition', value: 'Hierarchical scheduling - Days correspond to planets and their associated authorities' },
            { attribute: 'Sunday', value: 'Sun day—power, success, leadership, consciousness work' },
            { attribute: 'Monday', value: 'Moon day—emotions, intuition, dreams, home and family' },
            { attribute: 'Tuesday', value: 'Mars day—courage, conflict, will, protection' },
            { attribute: 'Wednesday', value: 'Mercury day—communication, learning, travel, intellect' },
            { attribute: 'Thursday', value: 'Jupiter day—prosperity, growth, expansion, wisdom' },
            { attribute: 'Friday', value: 'Venus day—love, beauty, harmony, relationships' },
            { attribute: 'Saturday', value: 'Saturn day—limitations, discipline, structure, banishing' },
          ]},
          { name: 'Cycles', emoji: '🌙', content: [
            { attribute: 'Definition', value: 'Lawful recurrence - Lunar and seasonal patterns structure permissible operations' },
            { attribute: 'New Moon', value: 'Darkness, rest, intention setting, new beginnings, and planning phase' },
            { attribute: 'Waxing Moon', value: 'Light increasing—growth, building, accumulation, and manifestation work' },
            { attribute: 'Full Moon', value: 'Maximum power—culmination, revelation, strongest time for all work including banishing' },
            { attribute: 'Waning Moon', value: 'Light decreasing—banishing, release, completion, and decrease work' },
            { attribute: 'Seasons', value: 'Spring (growth), Summer (manifestation), Autumn (harvest), Winter (rest)' },
          ]},
          { name: 'Nullity', emoji: '❌', content: [
            { attribute: 'Definition', value: 'Wrong timing voids action - Work against celestial law is null and has no legal force' },
            { attribute: 'Example', value: 'Beginning new ventures during waning moon works against natural flow and weakens results' },
            { attribute: 'Retrogrades', value: 'Mercury retrograde nullifies communication and travel magic—better for review than initiation' },
            { attribute: 'Emergency Exception', value: 'Necessity overrides timing—in true emergencies, work immediately regardless of cycles' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Timing as Amplification',
            content: 'In Solomonic magic, timing is not merely convenient but operative principle. Divine power flows through the universe in patterns and cycles: lunar phases, planetary hours, seasonal changes, astrological transits. When you work aligned with these cycles, power flows with you—work becomes efficient and effective. When you work against these cycles, you work against the current. The ancient axiom: "As above, so below"—celestial patterns reflect and govern earthly events. Timing is the art of recognizing when celestial patterns favor your work, then engaging at that propitious moment. Work at the right time is worth ten times work at the wrong time.',
          },
          {
            heading: 'Lunar Cycles & Phases',
            content: 'The Moon\'s orbit around Earth creates four phases governing all elemental and material work: New Moon (darkness, rest, intention setting, new beginnings, planning). This is when the Moon is invisible—the time to plant seeds and set intentions. Waxing Moon (light increasing, growth, building, accumulation, manifestation). This is when the Moon grows—the time for work designed to increase, attract, or build. Full Moon (maximum light, culmination, revelation, power, completion). This is when the Moon is fully visible—the most powerful time for all work, especially banishing and revealing truth. Waning Moon (light decreasing, banishing, release, completion, decrease). This is when the Moon shrinks—the time for work designed to remove, banish, reduce, or close. Timing your work to these phases dramatically increases effectiveness.',
          },
          {
            heading: 'Planetary Hours & Rulership',
            content: 'Each day is divided into 24 hours, each ruled by one of the seven classical planets in precise sequence. The hours are: Saturn (time, restriction, discipline), Jupiter (expansion, prosperity, wisdom), Mars (will, courage, action), Sun (consciousness, power, leadership), Venus (love, harmony, beauty), Mercury (communication, intelligence, travel), Moon (emotions, intuition, flow). A Saturn hour is ideal for work requiring patience or discipline. A Jupiter hour amplifies prosperity work. A Mars hour empowers action magic. A Venus hour supports love work. A Mercury hour supports communication. Knowing which hour you\'re working in—and planning work accordingly—dramatically increases results. Planetary hours can be calculated based on sunrise/sunset and your location.',
          },
          {
            heading: 'Day-Ruling Planets & Weekly Timing',
            content: 'Each day of the week is ruled by a planet: Sunday (Sun—power, leadership, success), Monday (Moon—emotions, intuition, home, family), Tuesday (Mars—courage, conflict, will), Wednesday (Mercury—communication, learning, travel), Thursday (Jupiter—prosperity, growth, wisdom), Friday (Venus—love, beauty, harmony), Saturday (Saturn—limitations, hard work, justice). Work initiated on its ruling day is amplified—prosperity work on Thursday, love work on Friday, communication work on Wednesday. If possible, schedule important work on the planetary day that rules its nature. However, if the other timing is correct (right lunar phase, right planetary hour), day-ruling is secondary.',
          },
          {
            heading: 'Seasonal Cycles & Sabbats',
            content: 'The year moves through four seasons, each with specific magical quality: Spring (Imbolc Feb 1, Beltane May 1 - new growth, birth, emergence). Summer (Litha Jun 21, Lughnasadh Aug 1 - power, fullness, manifestation). Autumn (Mabon Sept 21, Samhain Nov 1 - harvest, gratitude, death/transition). Winter (Yule Dec 21, Candlemas Jan 31 - rest, introspection, gestation). Major seasonal transitions (solstices and equinoxes) create "thin times" when the barrier between worlds weakens and magic flows more easily. Work initiated at seasonal turning points is extraordinarily powerful. Samhain (Nov 1) and Beltane (May 1) are especially potent for contact with non-physical realms.',
          },
          {
            heading: 'Astrological Transits & Retrogrades',
            content: 'Planets move through zodiacal signs and form aspects (angles) with each other. When a planet transits a certain sign, it activates that sign\'s qualities. Venus in Scorpio creates intense relationship dynamics. Mars in Leo creates bold, courageous action. Mercury retrograde (appearing to move backward from Earth\'s perspective) is traditionally considered inauspicious for communication and travel—better to review and revise than initiate. However, Mercury retrograde is excellent for internal work, deep study, and processing. Understanding transits (available through free astrology sites) allows you to avoid accidentally working against current planetary energies or to capitalize on favorable planetary configurations.',
          },
          {
            heading: 'Your Personal Timing & Cycles',
            content: 'Beyond celestial timing, your personal cycles matter: Your energy patterns (some people peak in morning, others in evening), your lunar return (the month of your birth each year is personally powerful), your spiritual sensitivity (some days you\'re more intuitive than others). Track your own patterns in a journal: when do you work well? When are you easily distracted? When do results manifest most quickly? Your personal rhythms reveal when you work optimally. Additionally, certain times are universally powerful: dawn and dusk (liminal times), storms and high winds (energetic intensity), first three days of a month, last three days of a month, certain numerologically significant dates.',
          },
          {
            heading: 'Integration: Multiple Timing Factors',
            content: 'The most auspicious work aligns multiple factors: Right lunar phase (waxing for building work, waning for banishing, full moon for power), right planetary hour (hour matching the work\'s nature), right day (day ruled by planet matching work\'s nature), right season (season\'s energy supporting work), no astrological delays (Mercury not retrograde for communication work, etc.), and your personal readiness and clarity. When all align, power flows like water downhill. When only one or two align, work still succeeds but requires more personal force. In emergencies, work immediately regardless of timing—necessity overrides auspiciousness. But for planned work, patience to find good timing multiplies results.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Download a lunar calendar showing all moon phases for the year—understand where you are in the lunar cycle',
          'Learn to calculate planetary hours for your timezone using online calculators or tables',
          'Track which planet rules each day of the week and begin noting the energy of each day',
          'Study the eight seasonal sabbats and mark them on your calendar',
          'Begin a timing journal: record when you work magic, what timing factors were present, and what results occurred',
          'Learn basic natal astrology to understand your birth chart and personal power times',
          'Identify your personal energy patterns by journaling when you feel most clear, focused, and powerful',
          'Start planning future work by checking lunar phase, planetary hours, and seasonal timing',
          'Research retrograde periods (especially Mercury retrograde) and plan around them for communication work',
          'Build your awareness of celestial patterns through observation over weeks and months',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Patience Multiplies Power', text: 'Waiting for right timing multiplies results exponentially. Work at the right time is worth ten times work at the wrong time.' },
          { title: 'Emergency Overrides Timing', text: 'In true emergencies or necessity, work immediately regardless of timing. Protect life first, perfect timing second.' },
          { title: 'Track Results', text: 'Keep detailed records: when worked, what timing factors, when results manifested. Patterns emerge revealing optimal timing for you.' },
          { title: 'Multiple Factors Compound', text: 'Right lunar phase + right hour + right day = dramatically amplified results. Alignment of factors is cumulative.' },
          { title: 'Intuition Trumps Rules', text: 'If your intuition says work now despite timing not being perfect, listen. Your inner knowing may perceive patterns beyond calculation.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Lunar calendar apps (various—many free options available)',
          'Planetary hours calculators (various online tools)',
          'Astrological transit calendars and ephemeris data',
          'Planetary Magic by Austin Coppock (on planetary correspondences)',
          'The Only Astrology Book You\'ll Ever Need by Stefanie Iris Weiss',
          'Hellenistic Astrology by Chris Brennan (on traditional timing)',
        ],
      },
    },
  },
  {
    name: 'Engagement',
    subName: 'Summoning',
    emoji: '📍',
    description: 'Summon and bind spirits through sacred names and seals',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Preparation', emoji: '🧘', content: [
            { attribute: 'Definition', value: 'Purification and readiness - Physical bathing, fasting, mental clarity, and spiritual alignment before summoning' },
            { attribute: 'Bathing', value: 'Ritual cleansing removes accumulated energy and creates clean vessel for divine authority' },
            { attribute: 'Fasting', value: 'Abstaining from food 3-24 hours before work sharpens sensitivity and demonstrates commitment' },
            { attribute: 'Meditation', value: 'Mental preparation through prayer and focus establishes clear intention and calm presence' },
          ]},
          { name: 'Invocation', emoji: '📣', content: [
            { attribute: 'Definition', value: 'Calling divine authority - Invoking protective powers and establishing your authority before engaging spirits' },
            { attribute: 'Protection', value: 'Call upon four Archangels and divine names to establish impenetrable protection' },
            { attribute: 'Authority', value: 'Invoke divine authority flowing from Source through you as operator' },
            { attribute: 'Order', value: 'Always invoke protection and authority before summoning any spirit' },
          ]},
          { name: 'Seals & Names', emoji: '✨', content: [
            { attribute: 'Definition', value: 'Spirit identification - Using true names and geometric seals to summon and identify the specific spirit' },
            { attribute: 'Seal Drawing', value: 'Draw the spirit\'s unique geometric seal with precision—this is the key of command' },
            { attribute: 'Name Calling', value: 'Speak the spirit\'s true name with authority—the name compels manifestation' },
            { attribute: 'Precision', value: 'Incorrect seals or names summon wrong spirits or produce no response' },
          ]},
          { name: 'Command', emoji: '⚡', content: [
            { attribute: 'Definition', value: 'Clear intention and authority - Stating your will with absolute clarity and divine authority' },
            { attribute: 'Specificity', value: 'Command exactly what you want—vague commands produce vague or chaotic results' },
            { attribute: 'Tone', value: 'Speak with calm, firm authority—neither timid nor aggressive, steady and clear' },
            { attribute: 'Binding', value: 'The spirit is bound by divine names, the seal, and the celestial hierarchy—obedience is absolute' },
          ]},
          { name: 'Verification', emoji: '✓', content: [
            { attribute: 'Definition', value: 'Confirming presence - Testing the spirit\'s obedience and confirming genuine manifestation' },
            { attribute: 'Test Commands', value: 'Issue small commands first: move objects, make sounds, confirm their name' },
            { attribute: 'Obedience Check', value: 'True bound spirits obey instantly—hesitation or refusal indicates problems' },
            { attribute: 'Deception Test', value: 'If spirit resists or behaves deceptively, banish immediately and restart procedure' },
          ]},
          { name: 'Dismissal', emoji: '🔚', content: [
            { attribute: 'Definition', value: 'Proper closure - Releasing the spirit and sealing the operation with gratitude and protection' },
            { attribute: 'Formula', value: 'Command spirit to return to their place: "I release you, [name], go in peace"' },
            { attribute: 'Seal Breaking', value: 'Destroy or cover the seal to break the binding completely' },
            { attribute: 'Circle Closure', value: 'Close protective circle with divine names, ensuring space returns to normal' },
            { attribute: 'Verification', value: 'Ensure the space feels clear and normal—no residual presence or energy' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'The Art of Engagement & Summoning',
            content: 'Engagement in Solomonic work means calling spirits into manifestation through precise ritual procedure. This is distinct from invocation (drawing in higher beings) or prayer (requesting divine assistance). Engagement is commanding lower spirits to appear and serve your specified purpose. The engagement process has specific steps: 1) Preparation and purification, 2) Creating the ritual space with protective geometry, 3) Invoking protective authority, 4) Drawing or displaying the spirit\'s seal, 5) Calling the spirit by name with divine authority, 6) Testing the spirit\'s presence and obedience, 7) Issuing commands, 8) Dismissal. Each step matters—skipping or rushing steps creates problems. Proper engagement is not violent or aggressive but authoritative and clear.',
          },
          {
            heading: 'Creating the Sacred Circle & Triangle',
            content: 'The ritual space for engagement is precisely constructed: The Magician\'s Circle (usually 9 feet diameter) contains divine names, planetary symbols, and protective barriers. The spirit is commanded into a Triangle of Manifestation (separate from the circle). The circle protects the operator and ensures spirits cannot harm them. The triangle contains the spirit and limits their manifestation to a specific point. Both are drawn with specific divine names and symbols: the Tetragrammaton (YHVH), the name Adonai, names of Archangels, and planetary symbols. Precision in drawing matters—careless geometry weakens the boundaries. Many practitioners use pre-printed or pre-painted cloths to ensure accuracy.',
          },
          {
            heading: 'The Spirit\'s Seal as Key of Authority',
            content: 'Each spirit has a unique Seal—a geometric symbol that serves as their sigil and key of authority. The Seal is: drawn or written during the ritual, displayed for the spirit to see, vibrated or activated by name and divine authority, the mechanism that summons the specific spirit. An incorrect or poorly drawn Seal won\'t work or will summon something other than intended. The Seal contains the spirit\'s essence in geometric form. When displayed with proper invocation, the spirit is compelled to respond. Seals can be found in grimoires like the Key of Solomon or Lesser Key (Goetia). Learning to draw them correctly is essential preparation.',
          },
          {
            heading: 'Calling & Binding With Divine Names',
            content: 'The spirit is summoned through their name combined with divine authority. The formula: "I call upon [spirit name] by the authority of [divine name/archangel name]. Appear before me in the triangle, visible and obedient, to [state your command]." The spirit is compelled not by your personal will but by the divine authority you invoke. The binding is absolute—spirits have no choice when summoned correctly. If a spirit resists, it indicates: wrong seal, wrong name, incorrect procedure, or you lack proper authority (insufficient preparation/purity). Never negotiate with a resistant spirit—banish and repeat correctly. Persistence in proper procedure always succeeds.',
          },
          {
            heading: 'Verification & Proof of Presence',
            content: 'Once a spirit appears (perceived through clairvoyance, physical signs in the triangle, temperature changes, or other manifestations), verify their identity and obedience through tested commands: Command them to move objects in the triangle, to make sounds, to write their name, to appear in a specific form. These test commands prove the spirit is present and bound. If they refuse test commands, you have either: summoned the wrong spirit, or the spirit is deceptive and resisting. Issue all commands with authority and clarity—there is no ambiguity in Solomonic work. A truly bound spirit obeys immediately; hesitation indicates problems requiring banishment and restart.',
          },
          {
            heading: 'The Statement of Work & Binding',
            content: 'Once the spirit is present and verified, state your work clearly and specifically: "You are bound to accomplish this work: [specific task]. You will perform this work completely and faithfully. This work must be completed by [specific time]. You will report to me when the work is complete." The spirit is bound through the combination of: your authority (flowing from Source through the celestial hierarchy), the seal (their geometric binding), the names (their essential nature), and the divine authority (which they cannot resist). The work must be specific, achievable, and clearly defined. Vague commands produce vague results or chaos.',
          },
          {
            heading: 'Dismissal & Release',
            content: 'Never leave a spirit summoned or bound longer than necessary. When the work is complete or when you wish to end the session: 1) Thank the spirit for their service, 2) Release them: "I release you, [spirit name], to return to your place. This binding is complete. Go in peace and return no more unless specifically summoned." 3) Destroy or cover the seal, 4) Break the triangle (if physically drawn), 5) Close the circle with divine names (same names used for opening), 6) Verify the space feels clear and normal. Improper dismissal leaves energetic rifts and can attract unwanted attention from other spirits. Sloppy closure is dangerous—spirits may linger, other entities may enter, or complications may develop.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the complete procedure for engagement from a reliable source (Key of Solomon, modern Solomonic texts)',
          'Learn to draw or acquire proper seals for specific spirits you wish to work with',
          'Practice drawing the protective circle and triangle in chalk or on paper—develop accuracy',
          'Study the divine names and practice invoking them with proper pronunciation',
          'Perform pre-ritual purification: physical bathing, fasting, mental preparation',
          'Begin with simple practice: draw the circle and triangle, invoke protection, spend time in the space',
          'Practice calling protective spirits (like Archangels) before attempting to summon lower spirits',
          'When ready, select a simple spirit for your first summoning—something clearly defined with specific function',
          'Record every detail of every summoning: preparation, spirit name, results, timing, and lessons learned',
          'Build experience with multiple practice sessions before attempting complex or powerful spirits',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Geometry is Non-Negotiable', text: 'The circle and triangle must be drawn correctly. Sloppy geometry weakens your protection and the binding. Spend time perfecting these.' },
          { title: 'Never Improvise Names', text: 'Always use the correct spirit name from reliable sources. Wrong names summon wrong spirits or nothing at all.' },
          { title: 'Protection Always First', text: 'Draw the circle completely before any summoning. Never stand unprotected when calling spirits. The circle is your absolute safety.' },
          { title: 'Clear & Specific Commands', text: 'Tell the spirit exactly what you want. "Make good things happen" fails. "Bring me three job opportunities within two months" works.' },
          { title: 'Never Leave Spirits Unbound', text: 'Always dismiss formally and completely. Abandoned summoning leaves energetic wounds and attracts complications.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Key of Solomon by S. L. MacGregor Mathers (complete version)',
          'The Lesser Key of Solomon (Goetia) with 72 spirits and their seals',
          'Three Books of Occult Philosophy by Agrippa (spirits and binding)',
          'Summoning Spirits by Christopher Penczak (modern interpretation)',
          'The Kybalion and Hermetic principles applied to spirit work',
        ],
      },
    },
  },
];

export function SolomonicScreen() {
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
    const witchUnlocked = isUnlocked('witchSolomonic') || isTest('witchSolomonic');
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
          <Text style={[styles.title, { color: textColor }]}>📐 Solomonic</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Authority-Based Hierarchical Magic
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
        witchType="Solomonic"
        lockKey="witchSolomonic"
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
