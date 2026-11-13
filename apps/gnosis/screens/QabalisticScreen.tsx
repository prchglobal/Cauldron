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
import { ASTRAL_FUNDAMENTALS, TRAVEL_TECHNIQUES } from '../data/astralTravelDatabase';
import { TRANCE_INDUCTION, TRANCE_APPLICATIONS } from '../data/tranceMagicDatabase';
import { SPACE_FUNDAMENTALS, SPACE_APPLICATIONS } from '../data/spaceMagicDatabase';
import { CONSTELLATIONS, CONSTELLATION_KNOWLEDGE, CONSTELLATION_PRACTICES } from '../data/constellationSymbolismDatabase';
import { SEASONAL_FOUNDATIONS, SEASONAL_PRACTICES } from '../data/seasonalRitesDatabase';

const COSMIC_PRACTICES = [
  {
    name: 'Ontology',
    isSpacer: true,
  },
  {
    name: 'Sephiroth',
    emoji: '🌳',
    description: 'Nodes - Navigate the spheres and ascend through divine emanation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'State', emoji: '🧠', content: [
            { attribute: 'Definition', value: 'Mode of consciousness - Each Sephirah represents a distinct state of awareness and cognitive processing' },
            { attribute: 'Kether', value: 'Pure unity consciousness beyond thought or separation—the experience of absolute being' },
            { attribute: 'Tiphareth', value: 'Integrated heart consciousness where personal will aligns with divine will in balanced harmony' },
            { attribute: 'Yesod', value: 'Dreamlike lunar consciousness where subconscious patterns and astral visions become accessible' },
            { attribute: 'Malkuth', value: 'Physical sensory consciousness grounded in material reality and embodied presence' },
          ]},
          { name: 'Capacity', emoji: '⚙️', content: [
            { attribute: 'Definition', value: 'Processing limits - The cognitive and energetic bandwidth available at each sphere determines what can be perceived and integrated' },
            { attribute: 'Lower Sephiroth', value: 'Greater detail and specificity but limited scope—can process complex physical/emotional data but miss transcendent patterns' },
            { attribute: 'Middle Sephiroth', value: 'Balanced processing between abstract principle and concrete detail—integrates head, heart, and body wisdom' },
            { attribute: 'Upper Sephiroth', value: 'Vast abstract understanding but less practical detail—perceives universal patterns but may lose individual specificity' },
            { attribute: 'Advancement', value: 'Spiritual ascension expands capacity—you gain bandwidth to perceive and integrate increasingly subtle and complex realities' },
          ]},
          { name: 'Perspective', emoji: '👁️', content: [
            { attribute: 'Definition', value: 'Worldview from position - Each Sephirah provides a unique lens through which reality is perceived and interpreted' },
            { attribute: 'Chesed Viewpoint', value: 'Sees abundance, expansion, mercy, and divine generosity—the universe as fundamentally loving and giving' },
            { attribute: 'Gevurah Viewpoint', value: 'Sees necessity of boundaries, discipline, and severity—the universe requiring structure and discrimination' },
            { attribute: 'Netzach Viewpoint', value: 'Sees through emotion, desire, and aesthetic beauty—reality as passionate, artistic, and feeling-centered' },
            { attribute: 'Hod Viewpoint', value: 'Sees through intellect, pattern, and communication—reality as logical structure and symbolic meaning' },
          ]},
          { name: 'Function', emoji: '⚡', content: [
            { attribute: 'Definition', value: 'Operational role - What this sphere does within the Tree\'s living system of consciousness' },
            { attribute: 'Kether', value: 'Source and crown—channels pure divine will from Ain Soph into manifestation; initiates all creation' },
            { attribute: 'Binah/Chokmah', value: 'Form and force—Binah receives and structures; Chokmah provides dynamic creative impulse' },
            { attribute: 'Tiphareth', value: 'Central mediator—harmonizes all opposing forces; integrates lower and upper consciousness' },
            { attribute: 'Yesod', value: 'Foundation and filter—processes all energies descending to Malkuth; shapes subconscious patterns' },
            { attribute: 'Malkuth', value: 'Receiver and grounding—manifests all higher principles into physical form; anchors spirit in matter' },
          ]},
          { name: 'Balance', emoji: '⚖️', content: [
            { attribute: 'Definition', value: 'Corrective force - Which opposing sphere provides necessary balance to prevent excess or distortion' },
            { attribute: 'Chesed ↔ Gevurah', value: 'Mercy balances severity; expansion balances contraction—prevents both weakness and cruelty' },
            { attribute: 'Netzach ↔ Hod', value: 'Emotion balances intellect; feeling balances thinking—prevents both irrationality and cold logic' },
            { attribute: 'Binah ↔ Chokmah', value: 'Form balances force; structure balances dynamism—prevents both rigidity and chaos' },
            { attribute: 'Integration', value: 'Spiritual maturity requires developing opposing Sephiroth equally—walking the middle pillar through balanced polarities' },
          ]},
          { name: 'Constraint', emoji: '🔗', content: [
            { attribute: 'Definition', value: 'Imposed limitation - The specific boundaries and restrictions inherent to each sphere\'s nature' },
            { attribute: 'Malkuth', value: 'Bound by physical laws, time, and material density—cannot directly perceive higher worlds without development' },
            { attribute: 'Lower Sephiroth', value: 'Limited to personal consciousness—cannot easily access transpersonal or cosmic awareness' },
            { attribute: 'Supernal Triad', value: 'Beyond normal human comprehension—requires ego death and mystical initiation to access safely' },
            { attribute: 'The Abyss', value: 'Ultimate constraint between personal and transpersonal—crossing requires total transformation of consciousness' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Tree of Life & The 10 Sephiroth', content: 'The Tree of Life is the fundamental map of creation in Qabalah—a diagram showing how the Infinite Divine (Ain Soph Aur) emanates through ten distinct states of consciousness into physical manifestation. Each of the Ten Sephiroth represents a complete sphere of existence: Kether (Crown, pure divine consciousness), Chokmah (Wisdom, dynamic creative force), Binah (Understanding, receptive form-giver), Chesed (Mercy, expansive love), Gevurah (Severity, discriminating power), Tiphareth (Beauty, integrated consciousness), Netzach (Victory, emotions and desire), Hod (Splendor, intellect and form), Yesod (Foundation, astral and subconscious), Malkuth (Kingdom, physical world). The Tree is not merely symbolic but represents actual states of consciousness you can experience through disciplined practice. Each Sephirah is an entire universe of meaning, correspondences, and transformative power.' },
          { heading: 'The Three Pillars & Dynamic Balance', content: 'The Tree is organized into three vertical pillars representing fundamental cosmic forces. The left Pillar of Severity (Binah-Gevurah-Hod) embodies contraction, form, limitation, and discrimination—the masculine yang principle that gives structure. The right Pillar of Mercy (Chokmah-Chesed-Netzach) embodies expansion, flow, love, and abundance—the feminine yin principle that gives life. The central Pillar of Equilibrium (Kether-Tiphareth-Yesod-Malkuth) harmonizes these opposites into balanced wholeness. Spiritual ascension requires balancing these forces within yourself: neither excessive severity (rigidity, judgment, harshness) nor excessive mercy (formlessness, weakness, dissolution) but integrated wisdom that knows when to expand and when to contract. The middle pillar is the path of balance—the way of Tiphareth, the Christ consciousness, where opposites unite in the heart center.' },
          { heading: 'The Four Worlds: Jacob\'s Ladder of Descent', content: 'Creation descends through four interpenetrating worlds, each progressively denser: Atziluth (Archetypal World) is pure divine radiance—the realm of God-Names and absolute principles where the Sephiroth exist as pure divine emanations. Briah (Creative World) is the realm of Archangels and creative forces where divine principles become universal patterns and laws. Yetzirah (Formative World) is the astral/emotional plane where thoughts take subtle form—the realm of angels, imagination, and symbolic reality. Assiah (Material World) is physical manifestation where spiritual forces crystallize into matter. Each Sephirah exists in all four worlds simultaneously—Malkuth in Atziluth is divine earth-consciousness; Malkuth in Assiah is physical matter. Understanding the Four Worlds reveals how a single divine impulse from Kether cascades down through progressively denser levels until it manifests as physical reality in Malkuth.' },
          { heading: 'The Lightning Flash: Path of Descent', content: 'The Lightning Flash (Shevira) describes the original emanation of divine light cascading from Kether through all ten Sephiroth in sequence: Kether → Chokmah → Binah → Chesed → Gevurah → Tiphareth → Netzach → Hod → Yesod → Malkuth. This represents how the Infinite becomes finite, how pure consciousness becomes matter. The Lightning Flash also represents the descent of the soul into incarnation—your consciousness descends this path at birth, taking on progressively denser vehicles until you inhabit a physical body in Malkuth. Understanding this descent is crucial because spiritual ascension reverses this path, returning consciousness to its divine source. The Lightning Flash is also the pattern of manifestation—when you wish to manifest something, you must bring it down this path from pure intention (Kether) through planning (Chokmah/Binah), devotion and discipline (Chesed/Gevurah), heart-centered action (Tiphareth), passion and intellect (Netzach/Hod), visualization (Yesod), and finally physical action (Malkuth).' },
          { heading: 'The Serpent Path: Ascension Through Return', content: 'While creation descends through the Lightning Flash, spiritual awakening ascends via the Serpent Path (Nachash)—winding back and forth between the pillars, integrating lessons at each level. You begin in Malkuth (physical awareness), ascend to Yesod (developing subconscious mastery and dream work), cross to Hod (refining intellect and magical technique), then to Netzach (opening heart and emotions), ascending to Tiphareth (achieving integrated self and Christ consciousness). The critical crossing into the Supernal Triad requires traversing Daath (Knowledge, the Abyss) where ego dies and transpersonal consciousness emerges. Beyond the Abyss lies Chesed (mercy and cosmic consciousness), Gevurah (power and discrimination), Binah (understanding and form of the Divine Feminine), Chokmah (wisdom and force of the Divine Masculine), and finally Kether (Crown and union with the Divine). This serpentine path of zigzagging ascension ensures you develop all qualities—mercy and severity, wisdom and understanding, emotion and intellect—before reaching union with the Divine.' },
          { heading: 'Working with Individual Sephiroth: Deep Immersion', content: 'Each Sephirah is worked through sustained contemplation and lived embodiment over weeks or months. To work a Sephirah: Study its correspondences (color, number, planetary association, god-name, archangel, body part, virtue, vice, symbols). Create an altar with that Sephirah\'s colors, symbols, and sacred images. Meditate daily on its divine name, vibrating it aloud or mentally. Invoke its archangel during meditation and request teaching and initiation. Observe how that Sephirah manifests in your daily life—Chesed shows as generosity and expansion, Gevurah as boundaries and discipline. Live its virtue consciously: if working Chesed, practice abundance and generosity; if Gevurah, practice discipline and clear boundaries. Journal insights, dreams, and synchronicities related to that Sephirah. After 28-40 days of focused work, the Sephirah becomes integrated into your consciousness permanently. This is not intellectual study but transformation—the Sephirah\'s qualities become part of who you are.' },
          { heading: 'The Abyss & Daath: Crossing the Great Divide', content: 'The Abyss is the chasm separating the Supernal Triad (Kether-Chokmah-Binah) from the lower seven Sephiroth. Crossing the Abyss is the great mystical initiation where personal ego dissolves and transpersonal consciousness emerges. Daath (Knowledge) is the phantom Sephirah hidden in the Abyss—representing fallen consciousness, the knowledge of separation, and the death of ego. When you approach the Abyss, everything you identified as "self" is tested and destroyed: your self-image, your achievements, your spiritual progress, all must be surrendered. Many spiritual seekers experience this as dark night of the soul—a terrifying void where all meaning dissolves. Those who cross successfully are reborn as Adepts—no longer identified with personal self but conscious as vessels of divine will. The Abyss cannot be crossed by effort or technique; it is crossed through grace and complete surrender. Attempting to force crossing before readiness creates severe psychological crisis.' },
          { heading: 'Planetary & Archangelic Correspondences', content: 'Each Sephirah resonates with specific planetary and archangelic intelligence: Kether—Primum Mobile, Metatron (Voice of God). Chokmah—Zodiac/Uranus, Raziel (Secrets of God). Binah—Saturn, Tzaphkiel (Contemplation of God). Chesed—Jupiter, Tzadkiel (Righteousness of God). Gevurah—Mars, Kamael (Severity of God). Tiphareth—Sun, Raphael (Healing of God). Netzach—Venus, Haniel (Grace of God). Hod—Mercury, Michael (Like unto God). Yesod—Moon, Gabriel (Strength of God). Malkuth—Earth, Sandalphon (Brother of God). Invoking an Archangel opens direct communion with that Sephirah\'s consciousness. Planetary work aligns you with cosmic timing and celestial influences flowing through each sphere. Understanding these correspondences transforms abstract philosophy into lived magical practice.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the complete Tree of Life diagram—understand the ten Sephiroth and their relationships',
          'Research one Sephirah that calls to you—learn its correspondences, color, divine name, archangel',
          'Create a simple altar or space with colors/symbols corresponding to that Sephirah',
          'Meditate on the Sephirah\'s color and symbol for 10 minutes daily for one week',
          'Learn and practice invoking the Sephirah\'s divine name or archangel',
          'Visualize ascending the Tree: imagine yourself climbing from Malkuth toward Kether',
          'Research the paths connecting Sephiroth—the 22 paths are the means of ascension',
          'Study how the four worlds distribute the Sephiroth across spiritual levels',
          'Practice the Middle Pillar exercise: visualize light descending from Kether through the central Sephiroth',
          'Keep a journal of insights and transformations as you work with the Tree',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Balanced Ascension is Essential', text: 'Don\'t skip Sephiroth or rush ascension. Work systematically, balancing left and right pillars. Imbalanced work creates psychological imbalance.' },
          { title: 'Respect the Abyss', text: 'Crossing from lower to higher Sephiroth is serious mystical work. Prepare through grounding, study, and proper initiation. Don\'t force crossing before you\'re ready.' },
          { title: 'Ground Thoroughly', text: 'Frequent Tree work can make you ungrounded. Eat grounding foods, spend time on Earth, work with Malkuth (physical world) regularly.' },
          { title: 'Work With a Tradition', text: 'There are multiple Qabalistic systems. Choose one and study it deeply rather than mixing systems randomly. Consistency amplifies results.' },
          { title: 'Integration Takes Time', text: 'Each Sephirah\'s lessons take months or years to integrate. Don\'t rush. Allow the transformation to occur naturally.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Tarot and the Archetypal Journey by Sallie Nichols',
          'The Golden Dawn: The Original Account of the Teachings & Rituals by Israel Regardie',
          'A Practical Guide to Qabalistic Symbolism by Gareth Knight',
          'The Kybalion—Hermetic principles underlying Qabala',
          'Tree of Life diagrams and correspondence tables',
        ],
      },
    },
  },
  {
    name: 'Paths',
    emoji: '🔗',
    description: 'Links - Walk the 22 paths of the Tree of Life for transformation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Transition', emoji: '🌉', content: [
            { attribute: 'Definition', value: 'Movement between states - The passage from one Sephirah\'s consciousness to another through the connecting Path' },
            { attribute: 'Experience', value: 'Each transition involves specific initiatic lessons and archetypal encounters unique to that Path' },
            { attribute: 'Challenge', value: 'Requires releasing attachments to the starting Sephirah while preparing for the destination sphere' },
            { attribute: 'Integration', value: 'Successful transition permanently expands consciousness to include both spheres\' qualities' },
          ]},
          { name: 'Correction', emoji: '🔄', content: [
            { attribute: 'Definition', value: 'Rebalancing mechanism - How this path restores equilibrium when extremes develop' },
            { attribute: 'Function', value: 'Paths connect opposing Sephiroth to prevent fixation in single-pole consciousness' },
            { attribute: 'Application', value: 'Walking correction paths dissolves rigid patterns and restores dynamic balance' },
            { attribute: 'Example', value: 'The Path between Netzach and Hod corrects emotional excess with intellectual clarity or mental rigidity with feeling' },
          ]},
          { name: 'Relation', emoji: '🔗', content: [
            { attribute: 'Definition', value: 'Inter-state connection - What relationship this path establishes between its endpoints' },
            { attribute: 'Horizontal Paths', value: 'Connect opposing pillars, teaching synthesis of severity and mercy in balanced consciousness' },
            { attribute: 'Vertical Paths', value: 'Connect higher and lower spheres, teaching how divine principle descends into manifestation' },
            { attribute: 'Diagonal Paths', value: 'Create complex relationships integrating multiple principles simultaneously' },
          ]},
          { name: 'Experience', emoji: '✨', content: [
            { attribute: 'Definition', value: 'Archetypal content - The symbolic and mythological journey of this path' },
            { attribute: 'Tarot Imagery', value: 'Each Path corresponds to a Major Arcana card revealing its archetypal teaching through symbol' },
            { attribute: 'Hebrew Letter', value: 'The Path\'s Hebrew letter carries primordial creative force and mythic significance' },
            { attribute: 'Landscape', value: 'Pathworking reveals symbolic terrain—mountains, rivers, temples, or abstract spaces teaching the Path\'s lesson' },
            { attribute: 'Encounters', value: 'Guardians, teachers, and archetypal figures appear offering initiation and wisdom' },
          ]},
          { name: 'Integration', emoji: '🧬', content: [
            { attribute: 'Definition', value: 'Synthesis of insight - How traversing this path unifies opposing principles' },
            { attribute: 'Embodiment', value: 'Path teachings must be lived in daily life to complete the initiation and stabilize new consciousness' },
            { attribute: 'Duration', value: 'Full integration typically requires 4-8 weeks of regular pathworking on the same Path' },
            { attribute: 'Completion', value: 'Integration is complete when the Path\'s qualities become natural and automatic in your being' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The 22 Paths: Sacred Roads Between Spheres', content: 'The Tree of Life is illuminated by 22 paths connecting the 10 Sephiroth—these are the sacred roads of consciousness, the means by which one ascends from Malkuth\'s earthly awareness to Kether\'s divine union. Unlike the Sephiroth which are destinations (states of being), the Paths are transitions—the actual journey, the initiatic passage, the transformation between states. Each path represents a specific teaching, an archetypal lesson encoded in symbol and experience. The 22 paths correspond to the 22 letters of the Hebrew alphabet and the 22 Major Arcana of the Tarot, creating a unified system of spiritual cartography. When you traverse a path through meditation or ritual, you undergo genuine initiation—your consciousness literally shifts from one sphere\'s perspective to another\'s. This is not symbolic; it is transformation. The Paths are how the Tree of Life becomes lived experience rather than intellectual diagram. Ancient Qabalists understood that studying the Sephiroth teaches structure, but walking the Paths creates actual spiritual evolution. Each path has specific color in the four worlds, planetary or zodiacal attribution, elemental correspondence, and geometric pattern—all precisely encoded to facilitate consciousness transformation. The 22 Paths are the skeleton key to Qabalistic practice: master them and you master the art of conscious spiritual ascension.' },
          { heading: 'Hebrew Letters as Living Forces of Creation', content: 'The 22 Hebrew letters are not mere alphabetic symbols but living intelligences—primordial forces through which the Divine created existence. Each letter is a channel of divine emanation carrying specific creative power. Aleph (the Ox) embodies primal breath and infinite potential—the first stirring of creation from void. Bet (the House) embodies structure and manifestation—the act of building form from formlessness. Each of the 22 letters corresponds to one of the 22 Paths, creating exact resonance between sound, symbol, and spiritual journey. When you vibrate a Hebrew letter (speak it aloud or mentally), you activate that letter\'s creative force within your consciousness and literally open the corresponding Path. This is practical magic, not theory: the sound-vibration of Aleph while meditating on the Fool\'s Path creates measurable shift in consciousness. Hebrew letter meditation is foundational practice—learn each letter\'s shape, sound, meaning, and numerical value (gematria). Contemplate how the letter\'s meaning reflects its Path\'s teaching. Mem (Water) on the path between Hod and Geburah teaches dissolution of rigid intellect through emotional wisdom. Nun (Fish) on the Death card\'s path teaches transformation through surrender and rebirth. The letters are not static—they are verbs, actions, processes. Speaking them invokes their transformative power into your life.' },
          { heading: 'The 22 Major Arcana: Archetypal Journey of Initiation', content: 'Each of the 22 Paths corresponds to one Major Arcana tarot card, creating perfect symmetry between Qabalistic and Tarot systems. The Fool (Aleph) walks the highest path between Chokmah and Kether—the journey into pure potential and divine madness. The Magician (Beth) connects Binah to Kether—mastery of will manifesting divine consciousness. The High Priestess (Gimel) bridges Tiphareth and Kether—the path of silent knowing and lunar wisdom. Each card represents specific initiatic experience you undergo when walking that path. Understanding tarot deepens Qabalistic work exponentially: the images provide visual entry point, the card meanings illuminate the path\'s teaching, the archetypal story guides your journey. Study each Major Arcana card deeply before walking its corresponding path. Notice: The Tower (path between Hod and Netzach) represents sudden destruction of false structures—intellectual rigidity shattered by emotional truth. Death (path between Netzach and Tiphareth) represents necessary endings that precede rebirth—emotional attachments released to access heart consciousness. The Star (path between Yesod and Tiphareth) represents hope and higher guidance—subconscious wisdom illuminating the heart\'s path. The sequence of Major Arcana from Fool to World encodes the entire journey of spiritual awakening. Begin with Fool (infinite potential), develop through challenges and teachings, conclude with World (integration and completion). This is your life\'s journey mapped on the Tree.' },
          { heading: 'Pathworking: Active Imagination as Spiritual Technology', content: 'Pathworking is controlled visionary journey—guided meditation where you consciously walk a specific Path, experiencing its landscape, symbols, and teachings directly. This is not passive visualization but active imagination: you enter trance state, project consciousness onto the Path, and encounter what exists there. The experience is real—as real as dreams but more lucid and directed. To pathwork effectively: Enter meditative state (theta brainwaves, 4-7 Hz). Visualize the starting Sephirah with all its colors, symbols, and qualities until it becomes vivid and tangible. See the Path extending before you—a road, bridge, tunnel, or landscape matching the Path\'s nature. Begin walking consciously. Notice everything: terrain changes, symbols that appear, beings you encounter, feelings that arise, sounds you hear, knowledge that emerges. The Path shows you exactly what you need—sometimes beautiful vision, sometimes challenging trial, always precisely calibrated to your current consciousness. Interact with what you meet: speak to guardians, ask questions of symbols, receive teachings from guides. The Path is alive and responsive. When you reach the destination Sephirah, spend time integrating its consciousness before returning. Return slowly through the same Path or descend the Tree systematically. Journal immediately—the experience fades quickly. Regular pathworking on the same Path (weekly for 4-8 weeks) creates deep integration and permanent consciousness shifts.' },
          { heading: 'The Three Pillars: Severity, Mercy, and Balance', content: 'The 22 Paths distribute across three vertical pillars, each teaching fundamental principles. The Left Pillar of Severity (Binah-Geburah-Hod) contains paths of contraction, discipline, discrimination, and form—these paths teach necessary limitation, boundaries, and structure. Walking severity paths develops discernment, willpower, and capacity to say no. These are difficult paths requiring surrender of ego and acceptance of limitation. The Right Pillar of Mercy (Chokmah-Chesed-Netzach) contains paths of expansion, love, abundance, and flow—these paths teach generosity, openness, trust, and grace. Walking mercy paths develops compassion, receptivity, and capacity to receive. These are healing paths but can enable spiritual bypassing if mercy becomes avoidance of necessary severity. The Central Pillar of Equilibrium (Kether-Tiphareth-Yesod-Malkuth) contains paths of integration and balance—these unite opposites in synthesis. The Middle Pillar is the primary ascension route because it integrates both severity and mercy at each level. Spiritual maturity requires walking paths on all three pillars: develop severity\'s discrimination without becoming rigid, develop mercy\'s compassion without becoming formless, unite both in equilibrium\'s wisdom. The zigzag serpent path ascending the Tree moves between pillars, ensuring integration of all three principles. This is why balanced ascension takes time—you must learn all three modes of being.' },
          { heading: 'The Central Pillar Path: Lightning Rod of Ascension', content: 'The Central Pillar is the lightning rod of direct ascension—the fastest but most intense path from Malkuth to Kether. This vertical alignment (Malkuth-Yesod-Tiphareth-Daath-Kether) represents consciousness ascending directly through the middle way, integrating all polarities at each level. The Middle Pillar Exercise is the primary practice for this path: Stand in meditation. Visualize brilliant white light descending from Kether (above head) into your crown. See golden light at Tiphareth (heart center). See purple-violet light at Yesod (genitals/lower belly). See earth-tone light at Malkuth (feet, connection to earth). Breathe light ascending and descending the pillar—up from earth through all centers to crown, down from crown through all centers to earth. Vibrate divine names at each center: Eheieh at Kether, YHVH Eloah va-Daath at Tiphareth, Shaddai El Chai at Yesod, Adonai ha-Aretz at Malkuth. This exercise aligns your entire being vertically, creating channel for divine light to descend and human consciousness to ascend. Practice daily—10-15 minutes minimum. Over time, the Middle Pillar becomes established: you embody the axis mundi, the world tree, the ladder between heaven and earth. This is the goal of all spiritual practice—becoming conscious bridge between divine and material realms. The Central Pillar is not mere visualization but actual energetic alignment of your subtle body along the Tree\'s central axis.' },
          { heading: 'Shadow Paths: Necessary Descents and Dark Initiations', content: 'Not all paths ascend toward light—some descend into shadow, and these are equally necessary for wholeness. Shadow paths reveal what you\'ve repressed, denied, or not yet integrated: your rage, shame, trauma, disowned power, forbidden desires. The path between Hod and Geburah (The Tower card) represents sudden collapse of false intellectual structures—everything you believed shatters, revealing raw truth beneath. This is terrifying but necessary. The path between Netzach and Hod (Death card) represents ending of emotional attachments and ego identifications—you die to who you thought you were. The paths crossing or approaching the Abyss (between personal consciousness and Supernal Triad) require ego death and dissolution of self-concept. Shadow work on the paths is advanced practice: you must have sufficient ego strength to temporarily dissolve ego without fragmenting. These paths cannot be walked through effort—they are walked through surrender. When life brings crisis, illness, loss, or breakdown, you are being initiated on a shadow path whether you recognize it or not. Conscious pathworking on shadow paths before crisis occurs prepares you: you meet the shadow intentionally rather than being ambushed. The teaching: darkness is not evil but unintegrated potential. Shadow contains gold—the power you\'ve denied yourself. Walking shadow paths consciously reclaims this power and integrates it into wholeness. The most powerful Qabalists are those who\'ve walked their shadow consciously and emerged whole.' },
          { heading: 'Path Guides and Angelic Intelligence', content: 'On each Path you encounter guides—beings, teachers, angels, archetypes, or symbolic figures who provide teaching and initiation. These are not hallucinations but genuine intelligences: aspects of your higher Self, angelic consciousness native to that Path, or archetypal forces manifesting in form your psyche can perceive. The Fool\'s Path may reveal a divine jester or cosmic wanderer encouraging trust in uncertainty. The Hierophant\'s Path may reveal a holy teacher or ancient mystic transmitting sacred doctrine. The Hanged Man\'s Path may reveal a suspended figure teaching surrender and seeing from new perspective. These guides are real in the same way dream figures are real—they emerge from consciousness but possess autonomy, wisdom, and agency within the inner planes. Interact with path guides as you would respected teachers: ask questions humbly, request teaching openly, observe their form and message carefully, thank them sincerely. Guides adapt teaching to your specific needs—two people walking the same path receive different teachings because each needs different lessons at different times. Over repeated pathworking, relationships with guides deepen. Some guides become permanent allies—you can call upon them in meditation or crisis for wisdom and support. The guides are not external entities but personified aspects of universal consciousness—when you meet them, you\'re meeting deeper parts of your own infinite self. This is the profound teaching: on the paths, you discover that what seemed "other" is actually "self"—all wisdom, all teaching, all power exists within you, waiting to be discovered through the journey.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the 22 Major Arcana cards and their correspondence to paths',
          'Research one path that calls to you—learn its Hebrew letter, Tarot card, and symbolism',
          'Ground and protect yourself thoroughly before pathworking',
          'Enter a meditative/trance state—this is essential for pathworking effectiveness',
          'Visualize the starting Sephirah with all its colors and symbols',
          'See the path stretching before you—visualize its landscape and symbols',
          'Walk the path consciously, observing what you encounter',
          'Meet any guides or intelligences on the path—interact respectfully',
          'Reach the destination Sephirah and integrate its consciousness',
          'Return to waking consciousness and journal the pathworking experience in detail',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Ascend Systematically', text: 'Don\'t jump randomly between paths. Follow a structured curriculum (Golden Dawn system, etc.) ascending systematically. Random pathworking creates confusion rather than integration.' },
          { title: 'Don\'t Rush The Central Pillar', text: 'The Central Pillar is the most powerful and most dangerous path. Don\'t ascend faster than your consciousness can integrate. Allow time between paths for integration.' },
          { title: 'Ground After Pathworking', text: 'Pathworking can be ungrounding. After each session, eat grounding food, spend time outside, wash hands with cold water. Reground completely before driving or other activities.' },
          { title: 'Honor The Guides', text: 'Path guides are real intelligences. Treat them with respect and gratitude. Don\'t dismiss them as imagination—your imagination is how consciousness communicates with you.' },
          { title: 'Journal Meticulously', text: 'Pathworking experiences contain subtle teachings that emerge over time. Detailed journaling reveals patterns and deepens understanding significantly.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Golden Dawn: The Original Account by Israel Regardie',
          'Tarot and Psychology by Sallie Nichols',
          'A Practical Guide to Qabalistic Symbolism by Gareth Knight',
          'Pathworking scripts and guided meditation recordings',
          'Books on Qabalistic initiation and the paths',
        ],
      },
    },
  },
  {
    name: 'Worlds',
    emoji: '🏗️',
    description: 'Layers - Traverse the four worlds of Qabalistic reality',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Atziluth', emoji: '✨', content: [
            { attribute: 'Definition', value: 'Archetypal principle - The world of pure divine emanation and primordial essence before any form' },
            { attribute: 'Quality', value: 'Blinding white radiance beyond comprehension—the realm of God-Names in absolute power' },
            { attribute: 'Access', value: 'Rarely touched directly by human consciousness; requires years of preparation and grace' },
            { attribute: 'Experience', value: 'Brief moments of overwhelming unity, dissolution of self, absolute knowing beyond concepts' },
          ]},
          { name: 'Briah', emoji: '🌟', content: [
            { attribute: 'Definition', value: 'Creative blueprint - The world of creative forces and universal archetypes where Archangels dwell' },
            { attribute: 'Quality', value: 'Pure archetypal patterns and cosmic principles—Platonic Forms and universal laws' },
            { attribute: 'Inhabitants', value: 'Archangels and cosmic intelligences personifying divine principles at archetypal level' },
            { attribute: 'Function', value: 'Bridge between divine unity and manifested multiplicity—where One becomes Many' },
          ]},
          { name: 'Yetzirah', emoji: '🌊', content: [
            { attribute: 'Definition', value: 'Formative pattern - The world of subtle forms, emotions, and astral substance where magic occurs' },
            { attribute: 'Quality', value: 'The astral plane of dreams, imagination, and thought-forms—realm of symbolic reality' },
            { attribute: 'Work', value: 'Most magical operations occur here through visualization, energy work, and intentional thought-forms' },
            { attribute: 'Inhabitants', value: 'Angels, thought-forms, dream entities, and subtle energies responsive to human consciousness' },
          ]},
          { name: 'Assiah', emoji: '🌍', content: [
            { attribute: 'Definition', value: 'Material enactment - The physical world where all principles manifest in matter and density' },
            { attribute: 'Quality', value: 'Slowest vibration, maximum stability—changes take time but persist once manifested' },
            { attribute: 'Importance', value: 'Not inferior but necessary—spiritual work must manifest in Assiah to complete the Great Work' },
            { attribute: 'Grounding', value: 'Physical disciplines and embodied practices anchor consciousness safely for higher world access' },
          ]},
          { name: 'Continuity', emoji: '🔄', content: [
            { attribute: 'Definition', value: 'Descent and ascent - The continuous flow between worlds, manifestation and return' },
            { attribute: 'Lightning Flash', value: 'Divine light descends through all worlds from Atziluth to Assiah, creating manifestation' },
            { attribute: 'Serpent Path', value: 'Consciousness ascends from Assiah through Yetzirah and Briah toward Atziluth in spiritual awakening' },
            { attribute: 'Integration', value: 'Spiritual maturity means becoming conscious bridge between worlds—present in all simultaneously' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Four Worlds: Jacob\'s Ladder of Creation', content: 'Qabalistic cosmology reveals that reality consists of four interpenetrating worlds, each a complete universe at different vibratory density. These are not separate locations but simultaneous dimensions—like frequencies on a radio dial, all present but requiring different tuning to perceive. Atziluth (World of Emanation) is pure divine radiance—the realm of God-Names where the Sephiroth exist as pure divine principles. Briah (World of Creation) is the realm of Archangels and universal archetypes—where divine principles become creative patterns and cosmic laws. Yetzirah (World of Formation) is the astral/emotional plane where thoughts crystallize into subtle forms—the realm of angels, imagination, and symbolic reality where magical work occurs. Assiah (World of Action) is physical manifestation—the material universe where spiritual forces achieve final density and become perceivable to physical senses. The profound teaching: every Sephirah exists in all four worlds simultaneously. Malkuth in Atziluth is divine earth-consciousness; Malkuth in Assiah is physical matter. Kether in Atziluth is the absolute Divine; Kether in Assiah is the highest principle manifesting in material form. This framework is called Jacob\'s Ladder because consciousness ascends and descends between worlds like angels on the Biblical ladder. Understanding the Four Worlds transforms your spiritual practice from abstract philosophy to practical navigation—you learn to consciously shift between worlds, perceive reality at multiple levels simultaneously, and understand how spirit descends into matter and matter ascends into spirit.' },
          { heading: 'Atziluth: The Archetypal World of Pure Divinity', content: 'Atziluth is the highest world—pure divine emanation before any form or separation emerges. This is the realm of the Divine Names in their absolute power: Eheieh Asher Eheieh (I AM THAT I AM), the Tetragrammaton YHVH in its primordial form, Elohim as pure creative God-consciousness. In Atziluth, the ten Sephiroth exist as pure divine principles—not yet manifested as archetypes or forms but as raw God-force radiating from Ain Soph Aur (the Infinite Light). Atziluth is described as the World of Fire—pure spiritual combustion, undifferentiated divine will, the blinding white radiance that must be stepped down through lower worlds to become perceivable. Human consciousness rarely touches Atziluth directly because its intensity would shatter unprepared awareness—mystics describe brief Atziluthic contact as overwhelming unity, dissolution of self, absolute knowing beyond concepts. Atziluth is colorless brilliant white light containing all colors. It is soundless primordial vibration containing all sounds. It is the divine YES—pure affirmation of being before any qualities emerge. Working with Atziluth is the highest magical practice: invoking the pure God-Names without stepping them down through other worlds, touching the source directly rather than its reflections. This is advanced work requiring years of preparation—proper grounding, stable ego structure that can temporarily dissolve without fragmenting, ethical purity, and genuine spiritual maturity. Atziluth is not a place you go but a frequency you become.' },
          { heading: 'Briah: The Creative World of Archetypal Principles', content: 'Briah is the world immediately below Atziluth—where divine unity differentiates into universal archetypes and cosmic principles. If Atziluth is pure divine fire, Briah is that fire reflecting in infinite mirrors, each reflection a complete archetype. The Archangels inhabit Briah: Metatron (Kether\'s Archangel, Voice of God), Raziel (Chokmah\'s Archangel, Herald of Deity), Tzaphkiel (Binah\'s Archangel, Contemplation of God), Tzadkiel (Chesed\'s Archangel, Righteousness of God), and so forth. These are not individual beings but cosmic intelligences—personified principles of universal law. In Briah, every archetype exists as pure pattern: the Mother archetype (not your mother but Motherhood itself), the Hero archetype, the Sage, the Lover. Briah is where Platonic Forms exist—the perfect Circle before any circle is drawn, perfect Beauty before any beautiful thing manifests. Your Higher Self—the part of you that is immortal and transpersonal—exists in Briah. Meditation that transcends emotion and visualization and enters pure knowing is touching Briah. When you suddenly "just know" something beyond logic or evidence, you\'ve contacted Briah. The creative process works through Briah: artists, mystics, and innovators who report receiving inspiration from "beyond" are accessing Briah\'s archetypal patterns and bringing them into lower worlds. Briah is described as the World of Water—fluid, reflective, containing all potential forms. Working with Briah means: invoking Archangels for teaching and guidance, contemplating archetypes to understand universal patterns, contacting your Higher Self through meditation beyond thought, and channeling creative inspiration from archetypal source.' },
          { heading: 'Yetzirah: The Formative World of Imagination and Emotion', content: 'Yetzirah is the world of formation—where archetypal patterns from Briah crystallize into specific images, emotions, and subtle forms. This is the astral plane, the realm of dreams, the level where magic is most readily performed. Yetzirah is populated by Angels (as distinct from Archangels)—countless lesser intelligences serving specific functions, responding to invocation, and mediating between higher and lower worlds. Every thought generates a form in Yetzirah. Every emotion creates ripples in Yetzirah\'s substance. Your imagination is your consciousness working directly in Yetzirah—when you visualize, you are perceiving and creating in Yetzirah simultaneously. Dreams occur in Yetzirah: the landscapes you explore while sleeping are real locations in Yetzirah, and beings you meet there are genuine inhabitants or thought-forms. Magical practice works primarily through Yetzirah: you create a thought-form (visualized symbol, charged sigil, invoked entity), energize it with will and emotion, and it exists in Yetzirah until sufficient energy accumulates to manifest downward into Assiah. Tarot cards, astrological symbols, god-forms, and ritual imagery all function as doorways into Yetzirah—when you meditate on the High Priestess card, you\'re contacting the High Priestess archetype existing in Yetzirah. Yetzirah is described as the World of Air—subtle, thought-like, invisible yet powerful. Developing Yetzirah consciousness means: remembering and working with dreams, developing visualization ability until images become vivid and autonomous, learning to perceive subtle energy and thought-forms, and understanding that Yetzirah is just as real as Assiah but operating at faster vibration.' },
          { heading: 'Assiah: The Material World of Physical Manifestation', content: 'Assiah is the physical world—the realm of matter, the densest level where spiritual forces achieve final crystallization. Everything perceivable through your five senses exists in Assiah: your body, the earth beneath your feet, the stars overhead, the physical universe. Assiah is the slowest-vibrating world—changes here take time and effort, but once manifested they have maximum stability and persistence. This is both limitation and gift: Assiah\'s density means physical change is difficult, but it also means your physical body can serve as anchor and foundation for spiritual work in higher worlds. Assiah is not "lower" in value but in vibration—it\'s not inferior but necessary. Without Assiah, higher worlds would remain abstract and unmanifested. The spiritual descends into matter to achieve completion. Your spiritual work in higher worlds must eventually manifest in Assiah through changed behavior, healed relationships, manifested goals, and embodied wisdom—otherwise the work remains incomplete. Assiah is described as the World of Earth—solid, stable, grounded, manifest. Material magic works in Assiah: herbs, crystals, physical rituals, body-based practices like yoga or dance, all directly influence Assiah. Physical disciplines (consistent practice, daily routine, ethical action) are Assiah work—they create stable foundation for consciousness to safely ascend into higher worlds. The teaching: honor Assiah completely, for without solid ground you cannot safely build upward. Spiritual bypassing—escaping into higher worlds to avoid physical responsibility—is the primary danger of world-work. The goal is not escaping Assiah but integrating higher consciousness into physical life, making the material sacred through embodiment of spiritual truth.' },
          { heading: 'The Lightning Flash of Descent: How Creation Emanates', content: 'The Lightning Flash (Shevira) describes how divine light descends from Atziluth through all four worlds, cascading from Sephirah to Sephirah until reaching physical manifestation in Malkuth of Assiah. The process: Divine will emerges in Kether of Atziluth (pure "Let there be"), descends through Atziluth\'s Sephiroth as pure divine principle, crosses into Briah where it becomes archetypal pattern and universal law, descends through Briah\'s Sephiroth as creative blueprint, crosses into Yetzirah where it crystallizes as image and emotion, descends through Yetzirah\'s Sephiroth as thought-form and astral substance, crosses into Assiah where it manifests as physical energy and matter, descends through Assiah\'s Sephiroth as material form becoming denser and more specific, finally anchoring in Malkuth of Assiah as concrete physical reality. This entire process occurs instantaneously yet contains all stages. Every physical thing you see has descended this way: the tree outside your window exists simultaneously as divine principle in Atziluth, archetypal Tree in Briah, imaginal tree in Yetzirah, and physical tree in Assiah. Understanding the Lightning Flash reveals how to manifest: begin with pure intention in Atziluth (clear divine will), create archetypal pattern in Briah (universal principle), form emotional/visual thought-form in Yetzirah (vivid visualization), take physical action in Assiah (material steps). Manifestation requires all four worlds working in harmony. When manifestation fails, you\'ve skipped a world: all Atziluth/Briah with no Yetzirah/Assiah creates ideas without embodiment; all Yetzirah/Assiah with no Atziluth/Briah creates empty action without meaning.' },
          { heading: 'The Serpent Path of Ascent: Consciousness Rising', content: 'While creation descends through the Lightning Flash, spiritual awakening ascends through the Serpent Path—conscious evolution moving from physical awareness upward through progressively subtler worlds. This ascent mirrors Kundalini rising in Eastern traditions: coiled serpent power awakens at the base and ascends through energy centers. In Qabalistic terms: you begin fully identified with Assiah—you are your body, physical reality is the only reality, consciousness is limited to sensory perception and rational thought. Through spiritual practice, consciousness awakens to Yetzirah: you discover dreams are real, imagination has power, emotions shape reality, subtle energy exists. You develop capacity for visualization, energy work, and magical practice. Consciousness then ascends to Briah: you transcend personal concerns and contact universal principles, archetypal wisdom, and transpersonal intelligence. You experience yourself as more than personal identity—you are an expression of universal patterns. Finally, consciousness touches Atziluth: momentary union with the Divine, dissolution of all separation, direct knowing beyond concepts. This is enlightenment, cosmic consciousness, mystical union. The ascent is not one-way—you rise to higher worlds in meditation and descend to Assiah in daily life. Spiritual maturity means developing stable consciousness across all worlds: remaining grounded in Assiah while accessing Yetzirah\'s imagination, drawing on Briah\'s wisdom, and touching Atziluth\'s divinity. The serpent path teaches: spiritual development is systematic ascent, integrating each level fully before advancing, and ultimately becoming a permanent bridge between worlds—conscious simultaneously in matter and spirit.' },
          { heading: 'Practical Work with the Four Worlds: Integration and Balance', content: 'Working effectively with the Four Worlds requires developing consciousness at each level and integrating them into unified awareness. Assiah practice: Develop body awareness through yoga, dance, martial arts. Honor physical reality through grounded routines, ethical action, and material responsibility. Notice how physical health affects spiritual work. Yetzirah practice: Develop imagination through visualization exercises. Work with dreams—keep dream journal, practice lucid dreaming, work with dream symbols. Learn energy work—feeling and directing subtle energy. Practice magical visualization, creating and energizing thought-forms. Briah practice: Develop contemplative meditation that transcends images. Invoke and commune with Archangels. Study universal principles and archetypal patterns. Connect with your Higher Self through meditation asking "What does my eternal self know that my personality doesn\'t?" Atziluth practice: Practice surrender meditation—letting go of all control and touching pure being. Vibrate God-Names with complete devotion. Cultivate moments of unity consciousness. Integration practice: Trace how a single divine impulse manifests through all four worlds—how your spiritual insight (Atziluth/Briah) becomes visualization (Yetzirah) becomes physical action (Assiah). Notice when you\'re stuck in one world (all physicality, all imagination, etc.) and consciously shift to others. The goal: become a clear channel for divine will to descend into matter while simultaneously raising material consciousness toward spirit. This is the Great Work—making the invisible visible, the spiritual material, heaven and earth united.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Research the four worlds and their correspondences to colors, elements, and Sephiroth',
          'Meditate on Assiah: focus on physical sensations—breath, body, earth beneath you',
          'Meditate on Yetzirah: use imagination—visualize colors, images, moving landscapes',
          'Meditate on Briah: transcend image—experience pure knowing, archetypal presence',
          'Meditate on Atziluth: surrender beyond form—touch divine being beyond comprehension',
          'Practice ascending the worlds: begin grounded in Assiah, ascend through Yetzirah to Briah',
          'Practice descending the worlds: start in Atziluth, descend to Briah, Yetzirah, Assiah',
          'Work with dreams as Yetzirah gateway: keep dream journal, become lucid in dreams',
          'Integrate practice: notice how Atziluth wisdom manifests through Assiah reality',
          'Observe how thoughts (Yetzirah) precede physical manifestation (Assiah)',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Don\'t Skip Steps', text: 'Work through worlds systematically. Trying to skip to Atziluth before mastering other worlds creates imbalance and disconnection.' },
          { title: 'Ground Between Worlds', text: 'After meditating in higher worlds, ground yourself. Eat, exercise, spend time in nature. Ungrounded consciousness causes spaciness and poor decision-making.' },
          { title: 'Honor Physical Reality', text: 'Higher worlds are important but Assiah is where you live. Don\'t use higher worlds as escape from physical responsibility.' },
          { title: 'Integration Over Escape', text: 'The goal is not to escape Assiah but to integrate higher consciousness into physical life. Manifest spiritual understanding in material reality.' },
          { title: 'Atziluth Work is Advanced', text: 'Atziluth is beyond human comprehension. Don\'t force contact with Atziluth. It will contact you when you\'re ready through grace, not effort.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Four Worlds of Kabbalah by Z\'ev ben Shimon Halevi',
          'The Tree of Life by Israel Regardie (Four Worlds section)',
          'Meditation on the four worlds',
          'Ascent and descent visualizations',
          'Books on Briah and Yetzirah consciousness',
        ],
      },
    },
  },
  {
    name: 'Engagement',
    isSpacer: true,
  },
  {
    name: 'Navigation',
    emoji: '🧭',
    description: 'Transcendence - Navigate by stellar wisdom and cosmic patterns',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Clarity', emoji: '🧠', content: [
            { attribute: 'Definition', value: 'Conceptual understanding - Intellectual grasp of the meditation object and its meaning before practice' },
            { attribute: 'Study', value: 'Research the Sephirah\'s correspondences, colors, divine names, and symbolic associations thoroughly' },
            { attribute: 'Purpose', value: 'Clear understanding creates proper container for consciousness to receive teaching' },
            { attribute: 'Balance', value: 'Clarity without receptivity becomes dry intellectualism; combine knowing with openness' },
          ]},
          { name: 'Imaging', emoji: '👁️', content: [
            { attribute: 'Definition', value: 'Structural visualization - The form and geometric patterns that structure the meditation experience' },
            { attribute: 'Color Work', value: 'Visualizing the Sephirah\'s color surrounds you in its frequency and attunes your subtle body' },
            { attribute: 'Symbols', value: 'Contemplating sacred geometry, Hebrew letters, or tarot imagery opens symbolic consciousness' },
            { attribute: 'Development', value: 'Visualization ability strengthens through practice—images become vivid, stable, and autonomous' },
          ]},
          { name: 'Focus', emoji: '⚡', content: [
            { attribute: 'Definition', value: 'Sustained attention - The capacity to hold awareness on a single point without wandering or distraction' },
            { attribute: 'Training', value: 'Focus develops through regular practice—even 10 minutes daily builds concentration power' },
            { attribute: 'Challenge', value: 'Mind naturally wanders; gently return attention without judgment each time distraction occurs' },
            { attribute: 'Result', value: 'Mastered focus allows consciousness to penetrate deeply into the object and receive its teaching' },
          ]},
          { name: 'Stability', emoji: '🪨', content: [
            { attribute: 'Definition', value: 'Mental anchoring - The grounding that prevents distraction and maintains meditation coherence' },
            { attribute: 'Breath', value: 'Regulated breathing provides anchor—deep, slow, rhythmic breath stabilizes consciousness' },
            { attribute: 'Posture', value: 'Proper alignment—spine straight, body relaxed—creates physical foundation for stable awareness' },
            { attribute: 'Consistency', value: 'Daily practice at the same time and place builds automatic stability and depth' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          { heading: 'The Nature of Qabalistic Meditation: Receptive Knowing', content: 'Qabalistic meditation differs fundamentally from many meditation traditions—it is neither emptying the mind (Zen) nor concentrating on breath (Vipassana) but receptive contemplation on sacred symbols and divine principles. The method is elegantly simple: you select a focus (a Sephirah, Hebrew letter, divine name, or Path), establish it clearly in consciousness, then become utterly receptive to what emerges. This is active passivity—you hold intention without effort, you focus without force. You create the conditions for spiritual contact and then wait with open awareness. The Sephiroth are living intelligences, not abstract concepts—when you meditate on Tiphareth, you are not thinking about beauty but opening yourself to Beauty Itself, the divine principle of harmony and integration. The Sephirah responds to your attention by revealing its nature through: direct knowing (suddenly understanding something you never studied), symbolic vision (images appearing in inner space), energetic sensation (feeling the Sephirah\'s quality in your body), or simple presence (peaceful awareness of connection). Unlike intellectual study which remains in the mind, Qabalistic meditation creates direct experiential relationship with divine principles—you stop learning about Chesed and begin experiencing Chesed, embodying its mercy and abundance. This is gnosis—direct spiritual knowing beyond concepts. The practice requires patience and consistency: genuine contact develops through repeated meditation over weeks and months, not in single dramatic sessions. Trust the subtle more than the spectacular.' },
          { heading: 'The Hebrew Alphabet: 22 Gates of Consciousness', content: 'The 22 Hebrew letters are the foundational alphabet of creation itself—primordial vibratory patterns through which the Divine speaks existence into being. Each letter is a complete universe of meaning, a gateway to specific consciousness, a living force that responds to contemplation and invocation. Learning the Hebrew letters transforms your Qabalistic practice from theoretical to operational—these are the keys that unlock the Tree of Life. Study each letter\'s form: Aleph (א) shaped like divine breath descending through human form, suggesting unity containing multiplicity. Mem (מ) shaped like enclosed water, suggesting hidden depths and flowing wisdom. Shin (ש) shaped like triple flame, suggesting the threefold fire of divine energy. Each form embodies the letter\'s meaning. Study each letter\'s meaning and attribution: Aleph is the Ox, primal power, breath, beginning, the Fool\'s infinite potential. Beth is the House, structure, manifestation, the Magician\'s will creating form. Study each letter\'s number and gematria: Aleph = 1, suggesting unity and origin. Mem = 40, suggesting completion and transformation. When you meditate on a Hebrew letter, you activate its creative force within your consciousness. The method: Visualize the letter\'s shape clearly. Vibrate its sound aloud or mentally. Contemplate its meaning and correspondences. Allow the letter to reveal its teaching—insights, images, feelings, or knowing that emerge. Hebrew letters are not static symbols but dynamic forces—they change you through contact. Regular work with the letters develops increasing sensitivity to subtle spiritual frequencies and direct access to the consciousness each letter represents.' },
          { heading: 'Color, Sound, and Symbol: The Languages of Correspondence', content: 'Qabalistic meditation employs multiple sensory correspondences simultaneously because consciousness responds to symbolic language more powerfully than abstract concept. Each Sephirah vibrates at specific frequencies perceivable as color, sound, geometric form, and elemental quality. Color work: Each Sephirah has colors in each of the Four Worlds (Atziluth, Briah, Yetzirah, Assiah). Kether is brilliant white in all worlds—pure undifferentiated light. Tiphareth is gold/yellow (solar radiance) or rose-pink (heart opening). Yesod is purple-violet (lunar mystery). Malkuth is earth tones—browns, olives, blacks (physical matter). Meditating on a Sephirah\'s color attunes your subtle body to its frequency: visualize yourself surrounded by the color, breathing it in, becoming it. Sound work: Each Sephirah has corresponding divine name and planetary tone. Tiphareth vibrates to the musical note D (solar note). Yesod to G# (lunar note). Chanting or toning these sounds while meditating creates resonance. Vibrating the divine names (Eheieh for Kether, YHVH Eloah ve-Daath for Tiphareth, Shaddai El Chai for Yesod) invokes the Sephirah\'s power directly. Symbol work: Each Sephirah has symbolic images—Kether is the point within the circle, ancient bearded king, or swastika (ancient symbol of primordial rotation). Chesed is the solid figure, the throne, the orb, the scepter. Meditating on these symbols allows your subconscious to process the Sephirah\'s meaning in archetypal language. Integration: Advanced practitioners weave all correspondences together—visualizing Tiphareth\'s golden light, toning the note D, vibrating YHVH Eloah ve-Daath, contemplating the six-pointed star, all while holding intention of opening to divine beauty and integration. This multi-sensory approach creates powerful resonance that accelerates consciousness transformation.' },
          { heading: 'Archangelic Invocation: Communion with Cosmic Intelligence', content: 'Each Sephirah is governed by an Archangel—a cosmic intelligence that embodies that sphere\'s consciousness at its highest expression. These are not external entities but aspects of divine consciousness differentiated into specific functions, personified so human consciousness can relate to and receive teaching from them. The Archangels are: Metatron (Kether—Voice of God, the highest angel said to have once been the prophet Enoch), Raziel (Chokmah—Herald of Deity, keeper of cosmic secrets), Tzaphkiel (Binah—Contemplation of God, silent knowing), Tzadkiel (Chesed—Righteousness of God, mercy and abundance), Kamael (Geburah—Severity of God, strength and discipline), Raphael (Tiphareth—Healing of God, integration and beauty), Haniel (Netzach—Grace of God, love and victory), Michael (Hod—Like unto God, intellect and glory), Gabriel (Yesod—Strength of God, revelation and foundation), Sandalphon (Malkuth—Brother of Metatron, prayer made manifest). Invoking an Archangel during meditation creates direct teaching relationship. The method: Enter meditative state on the Sephirah. Call the Archangel by name with reverence: "Holy Archangel [Name], I invoke your presence and request teaching on [subject]." Visualize the Archangel appearing—trust whatever form emerges. Ask your questions clearly. Listen/feel/receive the response—it may come as words, feelings, knowing, or symbolic vision. Thank the Archangel sincerely and allow the presence to depart before ending meditation. Regular invocation develops ongoing relationship—the Archangels become spiritual teachers and guides accessible through meditation. They provide personalized teaching calibrated to your exact needs and readiness. This is not channeling or mediumship but conscious spiritual communication with aspects of universal wisdom.' },
          { heading: 'The Middle Pillar Exercise: Core Qabalistic Practice', content: 'The Middle Pillar is the central daily practice of Western Qabalah—a meditation/visualization that aligns your subtle body with the Tree of Life\'s central axis and draws divine light through all levels of your being. This is the Qabalistic equivalent of Kundalini yoga or the Microcosmic Orbit—it activates and balances your energetic system while establishing your consciousness as bridge between heaven and earth. The practice: Stand comfortably or sit with spine straight. Close eyes and regulate breathing—deep, slow, rhythmic. Visualize brilliant white sphere of light above your head (Kether—Crown). Vibrate the divine name Eheieh (eh-HEH-yeh) while feeling the crown center activate. Visualize shaft of light descending through your head and neck to throat (Daath—Knowledge, the hidden Sephirah). Visualize golden-rose sphere of light at your heart center (Tiphareth—Beauty). Vibrate YHVH Eloah ve-Daath while feeling the heart expand with divine presence. Visualize light descending through your torso to genital/lower belly area (Yesod—Foundation). Visualize purple-violet sphere of light here. Vibrate Shaddai El Chai (shah-DAI el CHAI) while feeling the foundation center ground you. Visualize light descending through your legs to your feet and into earth (Malkuth—Kingdom). Visualize earth-tone sphere here. Vibrate Adonai ha-Aretz (ah-doh-NAI ha-AH-retz) while feeling complete grounding. Circulate energy: breathe light ascending from earth through all centers to crown, then descending from crown through all centers to earth. Continue for 5-20 minutes. This daily practice creates permanent energetic alignment—you become the Tree of Life embodied. Physical and psychological benefits are measurable: increased energy, emotional balance, mental clarity, spiritual connection, and integration of consciousness across all levels.' },
          { heading: 'Ascending Through the Four Worlds in Meditation', content: 'Advanced Qabalistic meditation involves ascending through all four worlds while focusing on a single Sephirah—experiencing how that divine principle manifests at progressively subtler frequencies. This practice reveals the unity behind apparent multiplicity and develops consciousness across all levels simultaneously. The method using Tiphareth as example: Assiah (Physical): Sit in meditation and contemplate Tiphareth manifesting physically—the sun in the sky, golden light, the physical heart, beauty in nature, harmony in your body. Feel Tiphareth in your chest as golden warmth. This is Tiphareth\'s densest expression. Yetzirah (Astral/Emotional): Shift awareness to Tiphareth as emotional quality—feel unconditional love, aesthetic beauty, perfect balance, the bliss of integration. Visualize golden light more subtly now, not physical but emotional/energetic. Notice how emotions are subtler than matter yet more powerful—fear can make you tremble, love can heal illness. Briah (Creative/Archetypal): Shift awareness to Tiphareth as archetypal principle—Beauty Itself, the Platonic Form of harmony, the universal law of integration. This is not feeling beauty but knowing Beauty—transpersonal understanding beyond emotion. Here Tiphareth is less image and more pure knowing, less feeling and more cosmic principle. Atziluth (Divine/Primordial): Shift awareness to Tiphareth as pure divine emanation—the primordial YES of divine beauty before creation, God saying "I create Beauty" before beauty existed. This is nearly imperceptible to human consciousness—a sense of presence, wholeness, blinding white light containing all gold, or simply profound silence. Rest here as long as possible. Descend slowly through worlds back to Assiah. This practice reveals: matter is crystallized emotion (Assiah/Yetzirah connection), emotion is incarnated archetype (Yetzirah/Briah), archetype is specialized divinity (Briah/Atziluth). All is One at different vibratory rates.' },
          { heading: 'Receptivity and the Paradox of Effortless Effort', content: 'The greatest obstacle in Qabalistic meditation is trying too hard—forcing visions, demanding experiences, striving for contact. The teaching is paradoxical: you must set clear intention but release attachment to outcome; you must focus attention but without tension; you must actively participate while remaining passively receptive. This is wei wu wei—doing through not-doing. The method: Set your intention clearly at the beginning—"I meditate on Gevurah to understand divine strength and discipline" or "I open myself to the teaching of the Path between Netzach and Hod." State it clearly, firmly, aloud or mentally. This is the active component. Then release all effort. Stop trying to make anything happen. Stop demanding visions or experiences. Simply rest in awareness, holding the intention lightly like you\'d hold a bird—firmly enough that it doesn\'t fly away, gently enough that you don\'t crush it. Become a clear vessel, an empty cup, a receptive listener. The Sephirah, Path, or Archangel will contact you in exactly the way you need—sometimes dramatic vision, more often subtle knowing, sometimes powerful energy, sometimes quiet peace. All genuine contact feels right—not manufactured but received. Trust what emerges naturally more than what you try to force. The deepest teachings often come through the quietest whispers. Many practitioners report: the moment they stop striving and surrender into receptivity, contact occurs. This mirrors the broader spiritual teaching: grace descends into the empty space created by surrender, not into the grasping hand of demand. Your ego cannot force spiritual contact, but your sincere desire creates conditions for the Divine to respond. The practice is showing up consistently with open heart and clear intention, then trusting whatever unfolds.' },
          { heading: 'Integration: From Meditation Cushion to Daily Life', content: 'Qabalistic meditation is not escape from life but preparation for transformed living—the insights, energies, and consciousness shifts experienced in meditation must be integrated into daily life or the work remains incomplete. Integration is how temporary states become permanent traits, how peak experiences become baseline consciousness. Post-meditation practices: Journal immediately after meditation—capture insights, symbols, feelings, and teachings before they fade. Over months, patterns emerge showing your spiritual development. Notice how the Sephirah manifests in daily life. If you\'ve been meditating on Chesed (mercy/abundance), watch for opportunities to practice generosity, notice where you encounter abundance, observe how mercy operates in your relationships. The Sephirah will reveal itself everywhere once you\'ve opened to it. Embody the teaching. If Gevurah teaches healthy boundaries, practice saying no to what doesn\'t serve you. If Tiphareth teaches balance, practice finding middle way between extremes. Consciousness work that doesn\'t change behavior remains abstract. Create physical anchors: wear the Sephirah\'s color, place its symbol where you\'ll see it, set phone reminders with its quality ("pause and breathe into Tiphareth\'s balance"). These cues bring meditative consciousness into ordinary moments. Develop daily rhythm: meditate at the same time daily (dawn is traditional for Qabalistic work, aligning with the rising sun). Consistency over weeks creates momentum—each meditation builds on previous ones, consciousness compounds, relationship with the Tree deepens. After 40 days of consistent practice with one Sephirah, that sphere becomes permanently integrated into your being. Its qualities become part of your character, its wisdom accessible whenever needed. This is the true goal: not collecting peak experiences but becoming the Tree of Life—embodying all ten Sephiroth in balanced, integrated consciousness, living as bridge between divine and human realms.' },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Choose one Sephirah to work with—traditionally begin with Malkuth (grounding) or Yesod (dreams)',
          'Research that Sephirah: its Hebrew name, color(s), corresponding Archangel, number, and tarot card',
          'Create a meditation space: light a candle in the Sephirah\'s color if possible',
          'Ground yourself: feet on earth, feel connection to physical reality',
          'Set intention: "I meditate on [Sephirah name]. I am open to its wisdom and teaching"',
          'Visualize the Sephirah\'s color surrounding you—let yourself be bathed in its light',
          'If moved, invoke the Archangel: speak the name with reverence and openness',
          'Sit in silence, receptive to whatever emerges—visions, feelings, knowings, or simply peace',
          'Allow meditation to unfold naturally for 20-30 minutes or until naturally complete',
          'Return to normal consciousness gradually, journal immediately upon finishing',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Consistency Over Depth', text: 'Regular meditation (daily or several times weekly) on the same Sephirah for weeks develops mastery more than rare deep sessions. Build relationship through consistency.' },
          { title: 'Receptivity is Key', text: 'Don\'t try to force visions or experiences. Simply set intention and remain open. The more you try to create experiences, the more you block genuine contact.' },
          { title: 'Ground After Meditation', text: 'After higher-world meditation, ground thoroughly: eat, move body, feel feet on earth. Grounding prevents becoming spacey or unintegrated.' },
          { title: 'Don\'t Rush Ascension', text: 'Work with lower Sephiroth (Malkuth, Yesod, Hod, Netzach) for weeks or months before attempting Tiphareth or higher. Foundation work is essential.' },
          { title: 'Trust Your Experience', text: 'Your experience is valid even if different from others\' experiences. Some see visions, some feel energy, some just know. All are legitimate contact.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Golden Dawn: The Original Account by Israel Regardie (meditation sections)',
          'A Practical Guide to Qabalistic Symbolism by Gareth Knight',
          'Tarot and the Archetypal Journey by Sallie Nichols (contemplation methods)',
          'Hebrew pronunciation guides and letter meanings',
          'Meditations on Sephiroth (recorded guidance)',
        ],
      },
    },
  },
  {
    name: 'Wayfinding',
    emoji: '🗺️',
    description: 'Pathwork - Journey through the 22 Paths of Consciousness on the Tree of Life',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Entry', emoji: '🚺', content: [
            { attribute: 'Definition', value: 'Controlled access - The gateway and preparation for beginning the path journey safely' },
            { attribute: 'Preparation', value: 'Ground yourself, enter trance state, invoke protection before stepping onto any Path' },
            { attribute: 'Letter Vibration', value: 'Chant the Path\'s Hebrew letter 3-11 times to activate and open the gateway' },
            { attribute: 'Intention', value: 'Set clear intention for the journey—what you seek to learn or experience on this Path' },
          ]},
          { name: 'Traversal', emoji: '🌉', content: [
            { attribute: 'Definition', value: 'Experiential movement - The active passage through the path\'s landscape and trials' },
            { attribute: 'Active Imagination', value: 'Pathworking is active exploration, not passive visualization—interact with what you encounter' },
            { attribute: 'Observation', value: 'Notice terrain, symbols, beings, emotions, and knowledge that emerge during the journey' },
            { attribute: 'Pacing', value: 'Allow the Path to reveal itself at natural pace—neither rushing nor forcing experiences' },
          ]},
          { name: 'Symbolism', emoji: '✨', content: [
            { attribute: 'Definition', value: 'Archetypal imagery - The mythic and symbolic content encountered on the path' },
            { attribute: 'Tarot Connection', value: 'Each Path corresponds to a Major Arcana card encoding its teaching in archetypal images' },
            { attribute: 'Hebrew Meaning', value: 'The Path\'s letter reveals mythological significance and primordial creative force' },
            { attribute: 'Personal Symbol', value: 'Symbols appear tailored to your consciousness—meaning is both universal and personal' },
          ]},
          { name: 'Insight', emoji: '💡', content: [
            { attribute: 'Definition', value: 'Knowledge gained - The wisdom and understanding revealed through the journey' },
            { attribute: 'Forms', value: 'Insights arrive as direct knowing, symbolic vision, emotional release, or energetic shift' },
            { attribute: 'Recording', value: 'Journal immediately after pathworking—subtle teachings fade quickly if not captured' },
            { attribute: 'Integration', value: 'True insight changes behavior and perception—not just intellectual understanding but lived wisdom' },
          ]},
          { name: 'Integration', emoji: '🧬', content: [
            { attribute: 'Definition', value: 'Application to life - How the path\'s lessons are woven into daily consciousness and behavior' },
            { attribute: 'Embodiment', value: 'Live the Path\'s teaching in daily life—if Death Path teaches release, practice letting go' },
            { attribute: 'Duration', value: 'Allow 1-2 weeks of integration before walking another Path—rushing prevents deep incorporation' },
            { attribute: 'Completion', value: 'Integration is complete when the Path\'s qualities become automatic aspects of your being' },
          ]},
          { name: 'Return', emoji: '🏠', content: [
            { attribute: 'Definition', value: 'Grounding - The conscious return to ordinary consciousness and embodiment' },
            { attribute: 'Descent', value: 'Return slowly through the same Path or systematically down the Tree to Malkuth' },
            { attribute: 'Physical Grounding', value: 'Eat, move body, splash cold water, touch earth—anchor fully before normal activities' },
            { attribute: 'Closure', value: 'Thank guides encountered, close the Path consciously, return to waking awareness completely' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Pathworking: Conscious Navigation of the Tree',
            content: 'Pathworking is the art of consciously traversing the 22 Paths of the Tree of Life through guided visualization, ritual trance, and intentional inner journey. Unlike passive meditation where you sit and receive, pathworking is active exploration—you deliberately project consciousness onto a specific Path and walk it as you would walk a physical road, experiencing its landscape, meeting its inhabitants, learning its lessons, and undergoing its transformation. This is practical mysticism: you are not studying the spiritual journey abstractly but actually taking it, step by conscious step. The technology is elegant: each Path connects two Sephiroth and represents the consciousness transition between them. The Path between Malkuth (physical earth consciousness) and Yesod (lunar dream consciousness) teaches how to access the subconscious and work with dreams. The Path between Yesod and Tiphareth teaches how to elevate personal desires into divine will, transforming ego-driven motivation into soul-guided purpose. Each Path is a complete initiatic curriculum—it contains teachings, trials, guardians, and transformations specifically designed to shift your consciousness from one Sephirah\'s state to the next. The 22 Paths encode the complete journey of spiritual awakening from Malkuth to Kether, from human to divine consciousness. Pathworking makes this journey conscious rather than unconscious. Instead of stumbling through life\'s initiations blindly, you meet them deliberately, integrate them consciously, and emerge transformed rather than traumatized. This is the profound gift: what life forces upon you unconsciously through crisis, pathworking offers consciously through practice.',
          },
          {
            heading: 'The 22 Tarot Trumps: Maps of Consciousness',
            content: 'Each of the 22 Paths corresponds precisely to one of the 22 Major Arcana tarot cards, creating perfect symmetry between Qabalistic and Tarot systems. This is not coincidental but reveals the tarot\'s original purpose: the Major Arcana are visual maps of the Tree\'s Paths, encoding the initiatic journey in archetypal images accessible to intuition and subconscious. The Fool (Path 11, Aleph) connects Chokmah and Kether—the leap into infinite divine potential, trusting the void, the holy madness of spiritual awakening. The Magician (Path 12, Beth) connects Kether to Binah—divine will taking form, consciousness wielding creative power, "As above, so below" made manifest. The High Priestess (Path 13, Gimel) connects Kether to Tiphareth—lunar wisdom, intuitive knowing, the descent of divine consciousness into the heart. Each card contains multiple layers of meaning: The Hierophant shows not just tradition and teaching but the necessary stage of receiving spiritual transmission from those who\'ve walked the path before you. The Tower shows not just destruction but necessary shattering of false structures that prevent growth. Death shows not ending but transformation—the ego-death required to access transpersonal consciousness. To pathwork effectively, study the corresponding tarot card deeply before walking the path: contemplate its imagery, feel into its emotional tone, research its symbolic meaning in multiple systems, meditate on how it operates in your life. The card is your guidebook—it shows you what to expect on the journey, what challenges you\'ll meet, what transformation awaits. Advanced practitioners report: after years of pathworking, seeing a tarot card triggers immediate consciousness shift to that Path\'s state—the cards become switches activating specific consciousness frequencies.',
          },
          {
            heading: 'Hebrew Letters: Activating the Paths Through Sound',
            content: 'Each Path vibrates with specific frequency corresponding to its Hebrew letter—these 22 sacred sounds are the vibratory keys that unlock the Paths. Aleph (א) vibrates as silent breath or "ah," the sound of beginning and infinite potential. Beth (ב) vibrates as "beh," the sound of building and manifestation. Gimel (ג) vibrates as "geh," the sound of bridging and connection. Learning to vibrate these letters correctly is essential pathworking practice because sound directly affects consciousness—specific frequencies activate corresponding regions of awareness. The method: Before pathworking, vibrate the Path\'s Hebrew letter 3, 7, or 11 times (sacred numbers) while visualizing the letter\'s shape and holding intention to open that Path. Feel the vibration in your body—each letter resonates in specific location. Aleph vibrates in the crown and breath. Mem vibrates in the belly as deep water-sound. Shin vibrates in the solar plexus as fire. Speak the letter with authority and intention: you are not asking permission but declaring your intention to walk this Path, activating it through conscious invocation. During pathworking, mentally chant the letter as you walk—this keeps you attuned to the Path\'s frequency and prevents consciousness from wandering. The Hebrew letters are not arbitrary symbols but actual forces—when you vibrate them, you are speaking in the language of creation itself, the language God used to emanate the universe. The letters respond to being spoken: they awaken, reveal themselves, grant access. Many practitioners report: after vibrating a letter during pathworking, the Path\'s imagery appears more vividly, the journey proceeds more smoothly, the teaching comes more clearly. The letters are allies—learn to work with them respectfully and they become powerful tools for consciousness navigation.',
          },
          {
            heading: 'Traversing the Four Worlds on Each Path',
            content: 'Advanced pathworking involves traversing not just the Path but all four worlds through which the Path extends—experiencing how the Path manifests at physical, emotional, mental, and divine levels simultaneously. Each Path exists in Atziluth (divine principle), Briah (archetypal pattern), Yetzirah (astral landscape), and Assiah (physical manifestation). The complete journey traverses all four. Example using the Fool\'s Path (Aleph, connecting Chokmah and Kether): Assiah—Begin with physical awareness: feel your body, notice breath, ground completely. The Fool in Assiah is physical trust—actually stepping into the unknown, making real-life leap of faith. Yetzirah—Shift to astral vision: see the Path as landscape—perhaps vast sky, endless horizon, cliff edge before infinite space. The Fool appears as archetype—young traveler with bindle and dog, stepping off cliff into void. Walk this landscape actively, noticing what you encounter. Feel the emotions: excitement, terror, liberation, trust. Briah—Shift to archetypal knowing: transcend images and access the Fool as principle—Infinite Potential, Divine Madness, the Sacred Leap. This is less vision and more knowing, less feeling and more understanding. The Fool here is universal law: consciousness must periodically abandon all structure and leap into formlessness to access new possibility. Atziluth—Shift to divine consciousness: the Fool as pure divine emanation, God\'s decision to create from nothing, the primordial YES before creation. This level is barely accessible—intense white light, overwhelming presence, or simply profound silence. Most practitioners touch this level only briefly. Descend back through worlds to Assiah and ground completely. This full-spectrum pathworking creates transformation at all levels: your body changes (cellular), your emotions shift (new capacities), your mind opens (new understanding), your spirit expands (divine contact). This is complete initiation.',
          },
          {
            heading: 'Path Sequences: The Serpent\'s Way of Ascension',
            content: 'While individual Paths teach specific lessons, walking Paths in sequence reveals the initiatic curriculum—the systematic ascent of consciousness from Malkuth to Kether. The traditional sequence is the Serpent Path: it zigzags between the Tree\'s pillars, ensuring balanced development by integrating severity and mercy at each level. The sequence from Malkuth: Path 32 (Tau/The World) from Malkuth to Yesod—developing dream consciousness and subconscious mastery. Path 30 (Resh/The Sun) from Yesod to Hod—developing intellectual illumination and mental clarity. Path 27 (Peh/The Tower) from Hod to Netzach—shattering rigid intellect through emotional truth, integrating head and heart. Path 24 (Nun/Death) from Netzach to Tiphareth—transforming personal emotions into universal love, ego-death initiating heart consciousness. This sequence continues ascending, each Path building on previous ones. Walking them in order creates systematic development: you don\'t skip stages, you integrate each fully before advancing. Alternative sequences serve different purposes: The Central Pillar (Malkuth-Yesod-Tiphareth-Kether) is direct vertical ascent for rapid awakening—powerful but intense, risking imbalance if pursued before sufficient grounding. The Left Pillar (Severity) develops discrimination, willpower, and boundaries. The Right Pillar (Mercy) develops compassion, receptivity, and trust. Advanced practitioners design custom sequences for specific work: healing trauma might emphasize Moon (High Priestess) and Sun paths, developing magical will might emphasize Magician and Emperor paths. The key teaching: Paths are not independent but interconnected—each Path\'s lesson depends on having integrated previous Paths. Attempting advanced Paths before mastering foundational ones creates confusion and potential psychological crisis. Work systematically, trust the traditional sequence, integrate thoroughly before advancing.',
          },
          {
            heading: 'Guardians, Teachers, and Encounters on the Paths',
            content: 'On the Paths you encounter beings: guardians who test your readiness, teachers who provide instruction, symbols that convey meaning, challenges that initiate you, and guides who assist your journey. These encounters are genuinely real—not hallucinations but contact with aspects of consciousness (yours and universal) that exist at the Path\'s frequency. The Fool\'s Path may reveal a cosmic jester figure who teaches you to laugh at your seriousness and trust the absurdity of existence. The High Priestess Path may reveal a veiled feminine presence who teaches through silence and symbol rather than words. The Tower Path may reveal sudden lightning strike and collapse of whatever you\'re clinging to—this is the Path\'s guardian testing whether you can surrender. How to work with Path encounters: Approach with respect—these intelligences are aspects of divine consciousness, deserving reverence. Speak clearly—ask questions directly: "What must I learn on this Path?" "What do I need to release to advance?" "What is this symbol teaching me?" Listen carefully—responses come through feeling, knowing, vision, or words arising in consciousness. Don\'t dismiss subtle messages. Interact authentically—the Paths respond to sincerity. Pretense or ego games create obstacles. Face challenges courageously—if a guardian blocks your way, understand this is the Path testing your readiness. What quality do you lack? What must you develop or release? Trust but verify—genuine Path contact feels numinous, meaningful, and transformative. If an encounter feels ego-inflating or flattering, question it. True teaching often challenges ego rather than feeding it. Record everything—after pathworking, document all encounters in detail. Patterns emerge over time revealing consistent teachings from specific guides. Some practitioners develop ongoing relationships with Path guardians who become spiritual allies accessible through invocation whenever that Path\'s wisdom is needed.',
          },
          {
            heading: 'Crossing the Abyss: Advanced Pathworking into Mystery',
            content: 'Certain Paths cross or approach the Abyss—the chasm separating the lower seven Sephiroth (personal consciousness) from the Supernal Triad (transpersonal/divine consciousness). These Paths are the most challenging and transformative: they require ego-death, surrender of identity, dissolution of everything you think you are. Path 14 (Daleth/The Empress) crosses from Binah to Chokmah through the Abyss\'s upper edge—requiring surrender into the divine feminine\'s formless creation. Path 13 (Gimel/High Priestess) descends from Kether to Tiphareth, carrying divine wisdom down into the heart—this is grace descending across the Abyss. The Abyss itself is guarded by Choronzon—the demon of dispersion, representing the ego\'s terror at its own dissolution. This is not literal demon but your own resistance to ego-death personified. Crossing the Abyss means: Releasing all identity—every concept of self, every achievement, every spiritual attainment must be surrendered. You cannot cross as "you." Accepting complete unknowing—all your knowledge becomes obstacle. The Abyss is crossed through surrender, not mastery. Trusting without evidence—crossing requires impossible faith. You step into void without guarantee of landing. Undergoing death and rebirth—consciousness dies to personal self and is reborn as vessel for transpersonal consciousness. You become "no one" so the Divine can act through you. Do not attempt Abyss Paths prematurely. These require: years of preliminary work integrating lower Sephiroth, stable psychological foundation that can temporarily dissolve without fragmenting, spiritual maturity and ethical purity, proper guidance from teacher who\'s crossed successfully. Forced crossing before readiness creates severe psychological crisis—ego fragmentation, depersonalization, psychosis. The Abyss opens naturally when you\'re ready, often during dark night of the soul. The teaching: the Abyss cannot be crossed through your effort—it is crossed through grace when you\'ve finally surrendered trying to cross it. This is the ultimate pathworking paradox.',
          },
          {
            heading: 'Integration: Bringing the Paths into Daily Life',
            content: 'Pathworking is not spiritual entertainment but consciousness transformation—the experiences, teachings, and initiations received on the Paths must be integrated into daily life or the work remains abstract. Integration is how temporary vision becomes permanent wisdom, how inner journey creates outer change. Post-pathworking integration practices: Journal extensively—document every detail immediately after pathworking while memory is fresh. Over weeks, re-read entries and notice patterns, recurring symbols, progressive deepening of contact with specific Paths. Identify the teaching—every Path reveals specific lesson. The Fool teaches trust in uncertainty; embody this by taking more risks. The Tower teaches releasing control; practice surrendering outcomes. Make the teaching conscious and actionable. Embody the lesson—change actual behavior based on Path wisdom. If the High Priestess teaches you to listen more than speak, practice this daily. If Death teaches letting go, release something you\'ve been clinging to. Consciousness work that doesn\'t change behavior is incomplete. Create reminders—place the Path\'s tarot card where you\'ll see it, wear its color, set phone reminders about its teaching. These cues bring pathworking consciousness into ordinary moments, bridging inner and outer worlds. Notice the Path manifesting—after pathworking the Wheel of Fortune, notice how change and cycles operate in your life. After the Lovers Path, notice how you make choices and commitments. The Paths reveal themselves everywhere once you\'ve opened to them. Allow integration time—don\'t immediately pathwork another Path. Spend 1-2 weeks integrating each Path before advancing. The Tree transforms you gradually through repeated practice, not dramatic one-time experiences. Walk the same Path multiple times—pathworking isn\'t one-and-done. Return to each Path quarterly or yearly. Deeper layers reveal themselves as your consciousness develops—what you couldn\'t perceive as beginner becomes clear as advanced practitioner. The goal: not collecting Path experiences but becoming the Tree of Life—embodying all 22 Paths as lived wisdom, navigating consciousness with mastery, and using the Paths as practical tools for spiritual development and magical work throughout your life.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the 22 paths of the Tree of Life and their corresponding Hebrew letters and tarot cards',
          'Choose the Fool\'s Path (Aleph, connecting Chokmah and Binah) as your beginning path',
          'Learn the path\'s color in Assiah (sky blue), correspondences, Hebrew letter, and tarot card (The Fool)',
          'In meditation, vibrate the Hebrew letter Aleph three times while visualizing its color',
          'Visualize yourself standing at the base of the path—Malkuth or Chokmah—and begin ascending',
          'Allow images, symbols, and experiences to arise naturally—do not force',
          'Ascend through the four worlds, noting what changes at each level',
          'Meet the guardian or experience the path\'s essence—receive its teaching',
          'Return slowly to normal consciousness and document your experience thoroughly',
          'Integrate: reflect on how the path\'s wisdom applies to your current life situations',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Start with Lower Paths', text: 'Begin with paths between lower Sephiroth (e.g., Yesoid to Hod/Netzach) before advancing to higher paths connecting Supernal Triad. Higher paths require more consciousness development.' },
          { title: 'Hebrew Letter Vibration is Key', text: 'Vibrating the Hebrew letter of the path opens its gateway more powerfully than visualization alone. Practice pronunciation and vibration.' },
          { title: 'No Forced Imagery', text: 'Allow experiences to arise naturally—do not force or demand specific visions. Your consciousness will show you exactly what you need.' },
          { title: 'Grounding is Essential', text: 'After pathworking, ground fully: eat, move your body, splash cold water on your face, do grounding affirmations. Do not drive or operate machinery immediately after.' },
          { title: 'Respect the Abyss Paths', text: 'Abyss work (paths connecting to Supernal Triad) is advanced work. Do not attempt until well-grounded in basic pathworking. These paths require psychological stability.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Golden Dawn: The Original Account of the Teachings & Rituals by Israel Regardie',
          '32 Paths of Wisdom study guides and correspondences',
          'Tarot and Hebrew Letter guides for each path',
          'The Qabalistic Journey: Pathworking Through the Four Worlds by Jason Augustus Newcomb',
          'Pathworking visualization scripts and recordings',
        ],
      },
    },
  },
  {
    name: 'Resonance',
    emoji: '〰️',
    description: 'Frequency - Resonate with the Divine Names and vibrate consciousness into manifestation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          { name: 'Names', emoji: '📿', content: [
            { attribute: 'Definition', value: 'Structural keys - Divine Names and sacred words as fundamental frequencies of creation' },
            { attribute: 'Hebrew Letters', value: 'The 22 letters are living forces—primordial vibratory patterns that created and sustain reality' },
            { attribute: 'Divine Names', value: 'God-Names (Eheieh, YHVH, Adonai, etc.) invoke specific aspects of divine consciousness' },
            { attribute: 'Power', value: 'Vibrating Names correctly activates their creative force and aligns your consciousness with divinity' },
          ]},
          { name: 'Resonance', emoji: '〰️', content: [
            { attribute: 'Definition', value: 'Tuning awareness - Aligning personal vibration with divine frequencies through sound' },
            { attribute: 'Sephirothic Scale', value: 'Each Sephirah vibrates at specific frequency—Kether highest, Malkuth densest' },
            { attribute: 'Practice', value: 'Chant Divine Names, feeling their vibration resonate through your entire being' },
            { attribute: 'Effect', value: 'Regular chanting permanently raises baseline frequency and expands consciousness capacity' },
          ]},
          { name: 'Stabilization', emoji: '⚖️', content: [
            { attribute: 'Definition', value: 'Balance maintenance - Sustaining frequency without scattering or excess' },
            { attribute: 'Grounding', value: 'After high-frequency work (Kether, Chokmah), return to Malkuth to ground and stabilize' },
            { attribute: 'Middle Pillar', value: 'Daily Middle Pillar exercise maintains balanced frequency across all Sephiroth' },
            { attribute: 'Integration', value: 'Don\'t remain in elevated states ungrounded—anchor higher consciousness in physical body' },
          ]},
          { name: 'Precision', emoji: '🎯', content: [
            { attribute: 'Definition', value: 'Accuracy requirement - Exact pronunciation and intention for effective vibration' },
            { attribute: 'Pronunciation', value: 'Learn correct Hebrew pronunciation from reliable sources—errors weaken power' },
            { attribute: 'Intention', value: 'Chant with clear awareness of what you\'re invoking—conscious knowledge amplifies effect' },
            { attribute: 'Reverence', value: 'Approach Divine Names with respect and devotion—never chant carelessly or for entertainment' },
          ]},
        ],
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'The Qabalistic Science of Vibration and Divine Sound',
            content: 'Qabalah teaches that vibration is the fundamental mechanism of creation itself—the Divine emanates reality through sound, frequency, and sacred utterance. "In the beginning was the Word" is literal truth: before matter, before form, before manifestation, there was primordial vibration—the Divine speaking existence into being. The Ain Soph Aur (Infinite Light) contracts into the first Sephirah Kether through divine utterance, then cascades through all ten Sephiroth, each emanating through specific vibratory frequency. Every Sephirah has its own harmonic—Kether vibrates at the highest frequency (pure spiritual luminosity), descending through progressively denser frequencies until Malkuth vibrates at physical matter\'s frequency. All of manifestation is consciousness vibrating at different rates: thought vibrates faster than emotion, emotion faster than matter. Working with vibration means consciously aligning your personal frequency with divine frequencies—learning to resonate with specific Sephiroth, activate Paths through Hebrew letter vibration, invoke divine power through sacred Names, and literally tune your consciousness like a musical instrument to the cosmic scale. This is practical theurgy: you are not passively worshipping distant divinity but actively participating in divine creation through conscious use of sacred sound. The teaching is profound: your voice, when properly trained and directed, becomes instrument of divine will—you speak and reality responds because you are speaking in the language God used to create the universe. This is why Hebrew (the sacred language) and the Divine Names (the sacred sounds) carry such power—they are not human inventions but the actual vibratory patterns through which consciousness manifests into form. Learning to vibrate these sounds correctly gives you access to the creative forces themselves.',
          },
          {
            heading: 'The Hebrew Alphabet: 22 Vibratory Frequencies of Creation',
            content: 'The 22 Hebrew letters are not arbitrary symbols but the fundamental vibratory frequencies through which the Divine creates and sustains reality. Each letter is a living force—a specific sound-pattern carrying creative power, divine intelligence, and transformative capacity. Aleph (א) is the primordial breath—the first exhalation of creation, the divine "Ahhhh" that begins manifestation. When you vibrate Aleph, you touch the frequency of infinite potential and new beginning. Beth (ב) is the first consonant—manifestation taking form, "Beh" creating boundary and structure. Gimel (ג) is the bridge—"Geh" connecting different levels, the act of giving and receiving. Each letter has shape (the written form encodes meaning), sound (vibrating it activates its power), number (gematria reveals mathematical/mystical relationships), and correspondence (each connects to specific Path, tarot card, and spiritual principle). To work with Hebrew letters as vibratory tools: Study each letter\'s meaning and attribution deeply. Learn correct pronunciation—Hebrew is phonetic; each letter has specific sound. Some are easy (Aleph = "ah", Beth = "beh"), others require practice (Chet is guttural "kh", Tzaddi is "ts"). Vibrate the letter slowly, feeling it resonate in your body—different letters vibrate in different body locations (Aleph in crown/breath, Mem in belly like water, Shin in solar plexus like fire). Use letters to activate Paths—before pathworking, vibrate that Path\'s letter to open the gateway. Use letters in magical work—inscribe letters in air while vibrating them, creating energetic sigils that hold power. The ultimate teaching: when you\'ve mastered all 22 letters, you possess the complete alphabet of creation—you can speak in the Divine\'s language and participate consciously in the ongoing creation of reality.',
          },
          {
            heading: 'The Divine Names: Supreme Invocations of Qabalistic Power',
            content: 'The Divine Names are the supreme vibratory formulas of Qabalah—sacred words of power that invoke specific aspects of God-consciousness and align you with divine attributes. These are not names in the ordinary sense (God has no name) but mantric formulas—sound-patterns that create specific resonance with divine emanation. The Tetragrammaton (YHVH / יהוה) is the supreme Name—the "Ineffable Name" traditionally never spoken aloud by ancient Hebrews because of its overwhelming power. The four letters encode complete creation: Yod (י) = divine spark, masculine creative force, Chokmah\'s wisdom. Heh (ה) = receptive vessel, feminine creative force, Binah\'s understanding. Vau (ו) = connecting channel, the Son, Tiphareth\'s beauty. Heh final (ה) = manifestation, the Daughter, Malkuth\'s kingdom. Vibrating YHVH (pronounced YOD-HEH-VAU-HEH slowly, or the substitute "Adonai") invokes the complete divine creative cycle. Other Divine Names rule specific Sephiroth: Eheieh Asher Eheieh (eh-HEH-yeh ah-SHER eh-HEH-yeh) = "I AM THAT I AM"—Kether\'s pure being, the highest divine consciousness. Chant for union with source. YHVH Elohim (Binah) = divine understanding and form-giving intelligence. Chant for wisdom and structure. El (Chesed) = divine mercy and loving expansion. Chant for abundance and grace. Elohim Gibor (Geburah) = divine strength and necessary severity. Chant for courage and boundaries. YHVH Eloah ve-Daath (Tiphareth) = divine beauty and integrated consciousness. Chant for heart-opening and balance. YHVH Tzabaoth (Netzach) = Lord of Hosts, divine victory and desire. Chant for passion and emotional power. Elohim Tzabaoth (Hod) = divine glory and intellectual clarity. Chant for mental power and communication. Shaddai El Chai (Yesod) = Almighty Living God, divine foundation and generative power. Chant for dream work and manifestation. Adonai ha-Aretz (Malkuth) = Lord of Earth, divine presence in matter. Chant for grounding and physical manifestation. To vibrate Divine Names effectively: Learn correct pronunciation from reliable sources. Vibrate slowly, powerfully, with reverence—these are not casual words. Feel each syllable resonating through your entire being. Vibrate Names in context: meditate on a Sephirah while vibrating its divine Name, creating powerful resonance. Use Names for invocation: call divine power into ritual space, into your consciousness, into situations requiring divine intervention.',
          },
          {
            heading: 'Raising Your Frequency Through the Sephirothic Scale',
            content: 'Each Sephirah exists at specific vibratory frequency—together they form a scale of consciousness from densest (Malkuth) to most refined (Kether). Spiritual development means systematically raising your personal vibration up this scale, learning to stabilize consciousness at progressively higher frequencies until you can access any Sephirah at will. Malkuth vibrates at physical frequency—this is baseline human consciousness, identified with body and material reality. Yesod vibrates at lunar/astral frequency—here you access dreams, subconscious, and subtle energy. Most people occasionally touch Yesod but can\'t stabilize there. Hod vibrates at mercurial/intellectual frequency—clear rational thought, communication, magical technique. Netzach vibrates at venusian/emotional frequency—love, beauty, desire, artistic inspiration. Tiphareth vibrates at solar/heart frequency—this is the crucial threshold. Reaching and stabilizing Tiphareth consciousness (integration, balance, beauty, contact with Higher Self) is the central goal of Qabalistic work. Most spiritual seekers spend years or lifetimes working to establish stable Tiphareth consciousness. The Supernal Triad (Chesed-Geburah-Binah-Chokmah-Kether) vibrates beyond personal consciousness—accessing these requires crossing the Abyss and surrendering ego-identity. How to raise your frequency: Practice the Middle Pillar exercise daily—this aligns your subtle body with the Tree\'s central axis and draws higher frequencies down into your being. Meditate on progressively higher Sephiroth—as you stabilize consciousness at each level, you can access the next. Vibrate the Divine Names of higher Sephiroth—sound directly shifts consciousness frequency. Visualize ascending the Tree—imagine yourself climbing from Malkuth toward Kether, feeling your vibration increase with each Sephirah. Live the virtues of higher Sephiroth—consciousness follows action. Embody Chesed\'s mercy and your frequency rises to Chesed\'s level. The teaching: frequency determines reality. When you vibrate at Malkuth frequency, you perceive and attract material concerns. When you vibrate at Tiphareth frequency, you perceive beauty, attract synchronicity, manifest from heart-aligned will. When you vibrate at Kether frequency, you dissolve into divine union. You cannot access what you cannot vibrate to—this is why spiritual development takes time. Your consciousness must be gradually trained to resonate at higher frequencies without destabilizing.',
          },
          {
            heading: 'The Technology of Chanting: Mechanics of Sacred Sound',
            content: 'Chanting Divine Names and Hebrew letters is the primary technology for vibratory work—using your voice to produce specific frequencies that create measurable effects in consciousness and reality. The human voice is uniquely powerful for magical work because it combines breath (spirit/prana), sound (vibration), intention (will), and embodiment (physical production)—making vocal magic more potent than purely mental work. How to chant effectively: Posture—Stand or sit with spine straight, allowing maximum breath flow and resonance. The voice should emerge from a grounded, aligned body. Breath—Take deep breath into belly before chanting. The power comes from sustained breath, not throat strain. Tone—Chant from deep in chest/belly, not nasally or throatily. Feel the vibration resonating through your entire body. Volume—Loud enough to feel the vibration clearly (if alone) or mentally/sub-vocally (if circumstances require silence). Mental chanting works but physical chanting is more powerful. Pace—Slow, sustained, allowing each syllable to fully resonate. Divine Names are not spoken quickly but vibrated powerfully: "YYYYOOOOODDD-HHHEEEEHHH-VVVAAAUUUU-HHHEEEEHHH." Repetition—Chant Names in sacred numbers: 3 times (trinity), 7 times (perfect number), 11 times (magical number), or multiples thereof. Consistency creates accumulating power. Intention—Hold clear awareness of what you\'re invoking while chanting. Chanting YHVH Eloah ve-Daath at Tiphareth, intend to open heart and access Higher Self. Feeling—Anchor the chant in feeling-state that matches the Sephirah or intention. Chant Chesed with feeling of abundance and love. Chant Geburah with feeling of strength and boundaries. Combination—Advanced practice combines chanting with visualization (seeing Sephirah\'s color), gesture (ritual movements), and breath (directing energy through body). The Middle Pillar exercise exemplifies this integrated practice. Physical effects of sustained chanting: altered consciousness (theta/alpha brainwave states), energy activation (feeling tingling, heat, or movement in body), emotional release (tears, laughter, or catharsis are common), and spiritual contact (sense of presence, knowing, or union). These are signs the practice is working—the vibrations are literally shifting your consciousness and energy.',
          },
          {
            heading: 'Frequency Matching: The Law of Resonance',
            content: 'The fundamental principle of vibratory magic is resonance: you attract and perceive reality matching your current frequency—like attracts like, same frequency resonates with same frequency. This is not metaphor but literal truth operating at quantum level: your consciousness vibrates at specific frequency, and you interact most strongly with reality vibrating at matching frequency. When vibrating at Malkuth\'s frequency, you perceive and attract material concerns: money problems, physical illness, practical obstacles. This is not judgment—Malkuth consciousness is necessary and valuable—but if stuck only in Malkuth, life feels heavy and limiting. When vibrating at Yesod\'s frequency, you perceive and attract: meaningful dreams, psychic impressions, emotional currents, subtle energy, and symbolic synchronicity. When vibrating at Tiphareth\'s frequency, you perceive and attract: beauty, harmony, meaningful coincidence, helpful people, heart-centered opportunities, and spiritual experiences. Life feels blessed. When vibrating at Supernal frequencies, you perceive reality as divine play, attract mystical experiences, and manifest through pure intention. The teaching: to change your life, change your frequency. You cannot manifest abundance from poverty consciousness (Malkuth frequency) no matter what techniques you use—you must raise to abundance frequency (Chesed) first, then manifestation becomes natural. You cannot heal deep wounds through intellectual understanding (Hod frequency) alone—you must access heart frequency (Tiphareth) where integration occurs. How to match frequency with desired reality: Identify what you want to manifest or experience. Determine which Sephirah embodies that quality (abundance = Chesed, clarity = Hod, love = Netzach, integration = Tiphareth). Meditate on that Sephirah, chant its Divine Name, visualize its color, contemplate its qualities until you feel yourself resonating at its frequency. From that frequency-state, take action or hold intention—now you\'re broadcasting matching signal that attracts matching reality. Maintain the frequency through consistent practice—one meditation creates temporary shift, daily practice creates permanent frequency elevation. This is how Qabalistic magic actually works: not forcing reality to change but raising your frequency until you naturally exist in the reality you desire.',
          },
          {
            heading: 'The Four Kabbalistic Worlds and Vibration Levels',
            content: 'Vibratory work becomes exponentially more sophisticated when understanding how the Four Worlds affect vibration—each Divine Name, Hebrew letter, and Sephirah exists at four distinct vibratory levels simultaneously. Atziluth (World of Emanation)—Here Names exist as pure divine frequency, undifferentiated light, primordial sound. Vibrating a Name in Atziluth means touching its divine source—this is the highest, most abstract level of practice. When you chant Eheieh in Atziluth, you\'re not invoking Kether but becoming the frequency "I AM" at its source. This level is barely accessible—brief flashes of union, overwhelming white light, dissolution of self. Briah (World of Creation)—Here Names exist as archetypal creative patterns, universal principles, angelic intelligence. Vibrating a Name in Briah means communing with its Archangelic intelligence and archetypal meaning. Chanting YHVH Eloah ve-Daath in Briah invokes Archangel Raphael\'s teaching presence and the archetype of divine healing/beauty. Yetzirah (World of Formation)—Here Names exist as astral forms, emotional resonances, visualizable energies. This is where most magical work occurs. Vibrating a Name in Yetzirah creates thought-forms, activates subtle energy, generates emotional states. Chanting Shaddai El Chai in Yetzirah activates lunar/sexual energy, stimulates dream consciousness, energizes foundation center. Assiah (World of Action)—Here Names exist as physical vibration, literal sound waves, embodied effects. Vibrating a Name in Assiah means producing actual sonic frequency that affects physical matter and body. Your vocal chords create mechanical vibration that resonates cells, organs, bones. The Middle Pillar exercise demonstrates working through all four worlds: visualize the Sephiroth (Yetzirah), feel their qualities (Yetzirah/Briah), vibrate Divine Names producing physical sound (Assiah), and briefly touch each Sephirah\'s divine source (Atziluth). Complete vibratory work engages all four worlds simultaneously—this creates transformation at every level of being. Practical application: When chanting for physical manifestation, emphasize Assiah (chant loudly, physically, feeling vibration in body) and Yetzirah (visualize desired result manifesting). When chanting for spiritual development, emphasize Briah (contemplate archetypal meaning, invoke Archangels) and Atziluth (surrender into divine frequency beyond form). The key: understanding which world you\'re working in determines technique and outcome.',
          },
          {
            heading: 'Practical Vibration: Integrated Daily Practice',
            content: 'Vibratory work reaches maximum effectiveness through integrated daily practice combining multiple elements—this transforms theory into embodied power. A complete daily vibratory practice includes: Morning Middle Pillar (15-20 minutes)—This is the foundation. Stand or sit comfortably. Regulate breathing—deep, slow, rhythmic. Visualize brilliant white sphere above head (Kether). Vibrate Eheieh three times powerfully, feeling crown activate. Visualize golden sphere at heart (Tiphareth). Vibrate YHVH Eloah ve-Daath three times, feeling heart expand. Visualize purple sphere at genitals/lower belly (Yesod). Vibrate Shaddai El Chai three times, feeling foundation anchor. Visualize earth-tone sphere at feet (Malkuth). Vibrate Adonai ha-Aretz three times, feeling complete grounding. Circulate energy—breathe light ascending and descending through all centers. Feel yourself as living Tree of Life. Pathworking with Hebrew letters (weekly)—Choose one Path to work for a month. Before pathworking that Path, vibrate its Hebrew letter 11 times, opening the gateway. This makes the subsequent journey more vivid and powerful. Divine Name chanting for specific purposes (as needed)—Need clarity? Chant Elohim Tzabaoth (Hod) 7 times. Need courage? Chant Elohim Gibor (Geburah) 7 times. Need love? Chant YHVH Tzabaoth (Netzach) 7 times. The Names are practical tools, not merely devotional—use them purposefully. Color-sound meditation (daily or weekly)—Choose one Sephirah. Visualize yourself bathed in its color. Vibrate its Divine Name while holding the color-visualization. Feel the frequency permeating your entire being. This systematically raises your baseline vibration over time. Sustained practice effects: After 40 days of daily Middle Pillar: energetic centers become permanently activated, consciousness stabilizes at higher baseline frequency, synchronicity increases dramatically, manifestation becomes easier and faster, emotional balance improves significantly, spiritual experiences become more frequent and accessible. After 6-12 months of consistent practice: you develop the ability to consciously shift frequency at will—moving from Malkuth to Tiphareth to Kether and back through intentional vibration, you become highly sensitive to subtle energy and consciousness frequencies in self and others, your voice becomes tangibly powerful—people respond to your words with unusual depth, you can invoke divine presence reliably through chanting. This is the goal: transforming vibration from intellectual concept into lived mastery—becoming a conscious instrument of divine creative power, speaking reality into being through sacred sound.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Study the correspondence between Sephiroth, divine Names, Hebrew letters, and planetary frequencies',
          'Learn the pronunciation of the four-letter Name: Tetragrammaton (YOD-HEH-VAU-HEH) and Adonai (ah-doh-NAI)',
          'Practice toning Tetragrammaton slowly over five breaths, feeling the vibration in your body',
          'Sit in stillness and chant Eheieh (eh-HEH-YEH) nine times, feeling connection to pure consciousness',
          'Visualize each Sephirah\'s color while chanting its associated divine Name (gold for Tiphareth, purple for Binah, etc.)',
          'Vibrate a Hebrew letter while walking its corresponding path—Aleph while ascending/descending the Fool\'s Path',
          'Create a simple altar with candles in Sephiroth colors and chant ascending/descending the Tree',
          'Combine color, sound, and movement: walk in a spiral while chanting and visualizing ascending to Kether',
          'Practice daily: choose one divine Name or letter and vibrate it consistently for one week',
          'Notice shifts in consciousness, awareness, and what manifests after consistent vibration work',
        ],
      },
      tips: {
        title: 'Tips for Practice',
        items: [
          { title: 'Never Force Vibration', text: 'Let the vibration emerge naturally from your body and consciousness. Forcing creates tension. Relaxed, resonant chanting is far more powerful than strained effort.' },
          { title: 'Ground After Ascending', text: 'After vibrating high Sephiroth (Chokmah, Binah, Kether), return to Malkuth/Adonai chanting and earth connection. Do not remain in high frequencies ungrounded.' },
          { title: 'Respect the Divine Names', text: 'These Names carry immense power. Approach with reverence and clear intention. Never chant divine Names casually or for entertainment. Sacred sound requires sacred attitude.' },
          { title: 'Start with Lower Sephiroth', text: 'Begin with Yesoid and Tiphareth frequencies before ascending to Supernal Triad. Build consciousness capacity gradually through consistent practice.' },
          { title: 'Documentation Matters', text: 'Journal how each vibration affects you—your energy, emotions, synchronicities, dreams. Track your frequency shift over weeks and months. This reveals the power of consistent practice.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Golden Dawn: The Original Account of the Teachings & Rituals by Israel Regardie',
          'The Kybalion: Hermetic Philosophy on vibration and frequency',
          'Sefer Yetzirah (Book of Formation) - Hebrew letter and vibratory correspondences',
          'The Power of the Divine Name by rabbi Isaac Luria and Qabalistic chanting guides',
          'Sacred sound recordings: divine Name vibrations and Sephiroth frequency meditation',
        ],
      },
    },
  },
];

export function QabalisticScreen() {
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
    const witchUnlocked = isUnlocked('witchQabalistic') || isTest('witchQabalistic');
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
          <Text style={[styles.title, { color: textColor }]}>✡️ Qabalistic</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Structural Navigation of Reality
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {COSMIC_PRACTICES.map((practice) => (
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
        witchType="Qabalistic"
        lockKey="witchQabalistic"
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
