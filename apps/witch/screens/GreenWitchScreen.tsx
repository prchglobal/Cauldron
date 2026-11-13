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
import { FORAGING_PLANTS } from '../data/plantForagingDatabase';
import { KITCHEN_MAGIC_RECIPES } from '../data/kitchenMagicDatabase';
import { HOME_BLESSING_SPELLS } from '../data/homeBlendingDatabase';
import { ANIMAL_GUIDES } from '../data/animalSymbolismDatabase';
import { FAE_SPIRITS } from '../data/faeSpiritDatabase';
import { EARTH_CRYSTALS } from '../data/earthCrystalsDatabase';

const GREEN_WITCH_PRACTICES = [
  {
    name: 'Plant Foraging',
    emoji: '🍄',
    description: 'Harvest wild plants for medicinal and magical use',
    hasPlantReference: true,
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        plants: FORAGING_PLANTS,
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Plant foraging is the ancient art of harvesting wild plants from nature for medicinal, culinary, and magical purposes. This practice connects you directly to the earth\'s bounty and teaches respect for natural cycles. Foraging is not just about gathering—it\'s about developing a relationship with the plants in your local ecosystem. By learning to identify and harvest plants responsibly, you become a steward of the land while gaining access to powerful botanical allies for your magical and wellness practices.',
          },
          {
            heading: 'Plant Identification Essentials',
            content: 'Proper identification is critical for safe foraging. Learn to observe: leaf arrangement (opposite, alternate, or whorled), leaf margins (smooth, serrated, or lobed), stem characteristics (hollow, solid, hairy, smooth), and overall plant shape. Use multiple identification sources and never rely on a single feature. When in doubt, don\'t harvest. Take photos of the entire plant, close-ups of leaves and flowers, and reference them against field guides.',
          },
          {
            heading: 'Sustainable Harvesting Practices',
            content: 'The Herbalist\'s Oath guides ethical foraging: take only what you need, leave enough for the plant to regenerate, never harvest endangered species, obtain landowner permission, and harvest in ways that minimize damage. The "rule of thirds" suggests taking only one-third of a plant population. Rotate your foraging locations to allow ecosystems to recover. Learn which parts are harvestable at which times: spring for young leaves and roots, summer for flowers, fall for seeds and bulbs.',
          },
          {
            heading: 'Magical Correspondences',
            content: 'Each plant carries magical properties aligned with its natural characteristics. Mint supports communication and clarity, dandelion aids in wishes and divination, clover brings luck and protection. Pay attention to the plant\'s growth pattern (spreading = expansion magic, reaching upward = growth), color (green = heart and healing, white = purification), and season. Moon phase timing amplifies effect: waxing moon for growth and manifestation magic, waning moon for banishing and releasing.',
          },
          {
            heading: 'Preservation & Storage',
            content: 'Drying preserves plant potency for months or years. Hang-dry leafy herbs in bundles in dark, well-ventilated spaces. Roots and bark require slower drying. Store in airtight glass containers away from heat, light, and moisture. Label everything with plant name, harvest date, and location. Create herbal blends by mixing dried herbs—match complementary flavors and magical properties. Infusions (steeping in hot water) and decoctions (simmering roots/bark) extract maximum medicinal properties.',
          },
          {
            heading: 'Common Foraging Plants & Uses',
            content: 'Mint (memory, clarity), Dandelion (wishes, divination), Clover (luck, protection), Plantain (healing, drawing), Yarrow (courage, war magic), Mugwort (dreams, intuition), Nettle (strength, protection), Rosemary (remembrance, purification), Sage (wisdom, cleansing), Chamomile (calm, sleep). Each has multiple uses in tea, medicine, ritual, and spellwork.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Get a reliable field guide specific to your region and climate zone',
          'Learn to identify 3-5 plants by their physical characteristics (leaf shape, color, stem texture)',
          'Visit the same locations throughout different seasons to understand plant cycles',
          'Always harvest during the appropriate season when plants are at peak potency',
          'Only take what you need and never take the entire plant—leave roots to regenerate',
          'Dry and store herbs in sealed containers away from light',
          'Create herbal blends and infusions for tea, medicine, and magical work',
          'Keep detailed notes on what you harvest, when, and the location',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Start Small', text: 'Begin with easily identifiable plants like mint, dandelion, and clover. Get expert verification before harvesting new species.' },
          { title: 'Sustainable Harvesting', text: 'Never take all of a plant—leave roots to regrow. Use the rule of thirds: only harvest one-third of a plant population.' },
          { title: 'Moonlight Timing', text: 'Harvest during waxing moon for growth magic, waning moon for banishing. Different plants peak at different times.' },
          { title: 'Verify & Document', text: 'Always cross-reference identification with 2-3 sources. Take photos and notes for future reference.' },
          { title: 'Legal Considerations', text: 'Never forage on private land without permission. Know protected and endangered plant species in your area.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Peterson Field Guide to Medicinal Plants and Herbs (your region)',
          'The Herbalist\'s Way by Ellen Evert Hopman',
          'Weeds: A Farm Girl\'s Lunch Pail by Becky Selengut',
          'Local herbalist groups and foraging classes',
          'Native plant societies in your region',
        ],
      },
    },
  },
  {
    name: 'Home Blessing',
    emoji: '🏡',
    description: 'Bless and protect your living space with intention',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        spells: HOME_BLESSING_SPELLS,
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Home blessing is a foundational green witch practice that transforms your dwelling into a sacred sanctuary. By infusing your living space with protective and harmonious energy, you create an environment that supports wellbeing, safety, and spiritual practice. A blessed home becomes a refuge from negativity and a power center for all your magic. The practice acknowledges that our homes are not just physical structures but energetic ecosystems that reflect and influence our inner state.',
          },
          {
            heading: 'The Four Elements in Home Blessing',
            content: 'Incorporate all four elements for complete blessing: Salt (earth) at thresholds creates a protective boundary and absorbs negative energy. Water (often blessed under the moon or mixed with salt) cleanses and purifies. Smoke (air) from sage, rosemary, or incense carries intentions upward and clears stagnant energy. Fire (candlelight, flames) transmutes energy and invokes divine presence. Using all four creates balance and comprehensive energetic cleansing.',
          },
          {
            heading: 'Room-by-Room Blessing Practice',
            content: 'Each room has unique energetic needs: Entryways need strong protective boundaries—salt, iron, or protective symbols. Living spaces benefit from warmth and community energy—orange, yellow candles, communal crystals. Bedrooms require calm and safe energy—lavender, moonstone, soft lighting. Bathrooms should support cleansing—salt baths, running water, clearing herbs. Kitchen needs prosperous, nourishing energy—cinnamon, basil, abundance crystals. Work areas require focus and clarity—clear quartz, citrine, lemon scent.',
          },
          {
            heading: 'Threshold Magic & Boundary Work',
            content: 'Thresholds (doorways, windows) are liminal spaces where protective magic is most powerful. Create protective boundaries by: placing blessed salt at the base of doors, hanging protective symbols or amulets above doorways, drawing invisible boundary lines with intention or salt, anointing door frames with blessing oil, installing protective plants like jade or aloe at windows. These boundaries acknowledge that your home is sacred space separate from the outside world.',
          },
          {
            heading: 'Protective Crystals & Stones',
            content: 'Place crystals strategically: Black tourmaline and obsidian at entry points absorb negative energy before it enters. Amethyst in bedrooms supports peaceful sleep and spiritual connection. Rose quartz in living areas promotes harmony and loving energy. Citrine in kitchen and workplace attracts abundance and positivity. Clear quartz anywhere amplifies protective intention. Arrange crystals in grids (points facing outward at boundaries, inward for energy containment) for enhanced effect.',
          },
          {
            heading: 'Maintenance & Seasonal Refresh',
            content: 'Home blessings require maintenance as protective energy dissipates over time. Monthly cleansing renews protective barriers—fresh salt at thresholds, herb burning, crystal recharging. Seasonal blessings align with sabbats and seasonal energy shifts: Spring (Imbolc) for renewal and fresh starts, Summer (Beltane) for protection and strength, Fall (Samhain) for boundaries and transitions, Winter (Yule) for peace and introspection. Create rituals that feel sacred and intentional.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Physically clean your home thoroughly—cleansing energy requires a clean physical foundation',
          'Gather blessing materials: salt, water, herbs (sage or rosemary), candles, and crystals',
          'Open windows and doors to allow energy flow before you begin',
          'Create a simple blessing oil by mixing protective herbs with a carrier oil',
          'Walk through each room with intention, speaking blessings and visualizing protective light',
          'Place salt at door thresholds and protective crystals (black tourmaline, obsidian) at entry points',
          'Light candles or burn herbs to complete the blessing',
          'Set the intention that your home is now blessed, protected, and filled with peace',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Physical Cleaning First', text: 'Energetic cleansing works best on a physically clean home. Clean, organize, and declutter before blessing.' },
          { title: 'Threshold Magic', text: 'Place salt or stones at doors to protect against negative energy entering your space.' },
          { title: 'Elemental Balance', text: 'Use salt (earth), water, smoke (air), and candlelight (fire) in blessings for complete energetic coverage.' },
          { title: 'Regular Maintenance', text: 'Refresh blessings monthly or after visitors, illness, or conflict to maintain strong protective barriers.' },
          { title: 'Personalization', text: 'Adapt blessings to your specific home and spiritual tradition—your intention matters most.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Book of Practical Spells by Leonora Huber',
          'Home Magic by Sarah Bartlett',
          'The House Witch by Delemhach',
          'Protective home blessing rituals from your specific spiritual tradition',
          'Local crystal or metaphysical shops for personalized recommendations',
        ],
      },
    },
  },
  {
    name: 'Kitchen Magic',
    emoji: '🫖',
    description: 'Infuse cooking and beverages with magical intention',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        recipes: KITCHEN_MAGIC_RECIPES,
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Kitchen magic is one of the most accessible and practical forms of witchcraft. It transforms the everyday act of cooking into sacred ceremony, infusing food and beverages with intention, energy, and magical properties. In kitchen magic, your stove becomes an altar, your recipes become spells, and every meal becomes a ritual. This practice honors the ancient understanding that food is medicine, that preparing meals for loved ones is an act of love magic, and that nourishment is inherently magical. Kitchen magic requires no special tools or complicated rituals—just intention and awareness.',
          },
          {
            heading: 'Ingredient Magical Correspondences',
            content: 'Every ingredient carries intrinsic magical properties: Protective herbs: basil (protection, clarity), rosemary (memory, purification), sage (wisdom, cleansing). Prosperity ingredients: cinnamon (attraction, wealth), honey (sweetness, attraction), ginger (boost, amplification). Heart healing: rose petals (love, compassion), chamomile (calm, peace), lavender (rest, healing). Courage: garlic (protection, courage), black pepper (strength, banishing), chili (passion, power). Root vegetables ground energy, leafy greens refresh, fruits add joy and sweetness. Choose ingredients consciously to align with your magical goals.',
          },
          {
            heading: 'Stirring & Directional Magic',
            content: 'Direction matters in kitchen magic. Clockwise (deosil) movement brings energy in, attracts, and manifests—use when stirring manifestation spells, prosperity blends, growth work. Counterclockwise (widdershins) movement banishes, releases, and removes—use when stirring away negativity, clearing blockages, or breaking unhelpful patterns. Pause between stirring and feel the energy shift. Some traditions add specific numbers: stir 3 times for manifestation, 9 times for transformation, 13 times for powerful magic. Alternating direction creates balance.',
          },
          {
            heading: 'Moon Phase Cooking',
            content: 'Time your cooking with lunar cycles for amplified magic: Waxing moon (new to full) is ideal for cooking attraction spells, prosperity dishes, healing remedies, growth-focused meals. Full moon is the most powerful time—all magic is amplified. Create strong teas, infusions, and prosperity meals under full moonlight. Waning moon (full to new) is perfect for cleansing teas, releasing meals, banishing dishes, and breaking negative patterns. New moon supports new beginnings and fresh starts—perfect for first meals in a new home.',
          },
          {
            heading: 'Herbal Tea & Beverage Magic',
            content: 'Beverages are concentrated magic. Infuse teas with intention by charging them under moonlight (moon water as base), adding specific herbs for properties, stirring with intention, and speaking blessings before drinking. Dream tea (chamomile, mugwort, lavender) before bed supports sleep and dream work. Courage tea (ginger, cinnamon, black pepper) before challenging days. Healing tea (chamomile, honey, rose petals) for emotional support. Clarity tea (rosemary, lemon, peppermint) for mental focus. Create blends aligned with your magical practice.',
          },
          {
            heading: 'Color Magic in Cooking',
            content: 'Color carries powerful magical associations. Red (tomatoes, peppers, beets) brings passion, energy, courage, love. Orange (carrots, sweet potato, oranges) attracts success, joy, creativity. Yellow (squash, lemon, banana) supports clarity, confidence, communication. Green (leafy greens, herbs, green vegetables) heals, protects, promotes growth. Blue (blueberries) brings peace, communication, truth. Purple (purple cabbage, grapes) enhances intuition, spirituality, transformation. Create visually intentional meals using color correspondences to amplify magical effect.',
          },
          {
            heading: 'Love & Healing Magic',
            content: 'Food shared is love shared. Cooking for others with pure intention is powerful love magic. Healing broths made with intention, medicinal herbs, and loving energy support recovery and wellness. Create comfort foods when someone is grieving—the warmth and care infuse healing energy. Prepare celebration meals with joyful intention for transitions and milestones. Bake bread or cookies with blessings woven into each step—these gifts carry your energy to recipients. The act of nourishing others magically is one of the most powerful spells.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Choose a specific intention for your meal before you begin cooking',
          'Select ingredients based on their magical properties and your intention',
          'Cleanse your cooking space with intention or a quick herb pass',
          'Stir ingredients clockwise while visualizing energy moving inward and manifestation occurring',
          'Speak your intention aloud or silently as you cook—infuse each step with purpose',
          'Use color correspondences: red ingredients for passion, green for healing, gold for prosperity',
          'Taste and bless your food before serving—acknowledge the magic you\'ve created',
          'Share meals with others as a form of love magic and community building',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Ingredient Intention', text: 'Choose ingredients by their magical properties aligned with your intention. Research before using new herbs.' },
          { title: 'Stirring Ritual', text: 'Stir clockwise to attract and manifest, counterclockwise to banish and release. Feel the energy shift as you stir.' },
          { title: 'Full Moon Power', text: 'Create special teas and dishes during full moons for amplified magical properties and stronger effects.' },
          { title: 'Color Correspondences', text: 'Use color magic: red for passion, green for healing, yellow for clarity, blue for peace, purple for intuition.' },
          { title: 'Food Safety First', text: 'Only use culinary and medicinal herbs. Research toxicity before consuming any herb, especially if pregnant or nursing.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Complete Book of Witchcraft by Scott Cunningham',
          'Kitchen Witchcraft by Rachel Greenlaw',
          'The Herbal Medicine-Maker\'s Handbook by James Green',
          'Magical herbalism guides specific to culinary herbs',
          'Moon phase calendars for timing your cooking',
        ],
      },
    },
  },
  {
    name: 'Animal Symbolism',
    emoji: '🦋',
    description: 'Connect with animal spirits as guides and teachers',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        animals: ANIMAL_GUIDES,
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Animal symbolism is a spiritual practice rooted in the understanding that animals carry wisdom, medicine, and messages. By observing animal behavior and learning their symbolic meanings, you access profound guidance for personal growth and magical work. Animal spirits serve as allies and guides, offering perspective, teaching lessons, and supporting your spiritual journey. This practice honors the interconnectedness of all living beings and acknowledges that every creature—from insects to large mammals, from birds to reptiles—carries sacred medicine and wisdom we can learn from.',
          },
          {
            heading: 'Animal Spirit vs. Animal Totem',
            content: 'Understand the distinction: An animal spirit is a temporary guide that appears when you need specific medicine or lessons. These guides come and go based on your current needs and life circumstances. An animal totem or power animal is a lifelong ally that works with you consistently, often appearing repeatedly throughout your life. Some traditions teach that you are born with certain totems that reflect your inner nature. You can work with multiple animal spirits simultaneously while typically having 1-3 core totems.',
          },
          {
            heading: 'Common Animal Guides & Their Medicine',
            content: 'Bird wisdom: Eagles (vision, freedom), owls (wisdom, truth), crows (mystery, messages). Mammal guides: Deer (gentleness, boundaries), wolf (loyalty, instinct), bear (strength, introspection). Insects: Butterfly (transformation), bee (community, sweetness), spider (creativity, fate). Reptiles: Snake (transformation, healing), lizard (illusion, adaptability). Water creatures: Dolphin (joy, communication), fish (emotions, flow). Each carries specific lessons—study their behaviors to understand their medicine.',
          },
          {
            heading: 'Working with Animal Archetypes',
            content: 'Learn broader categories of animal medicine: Predators teach power, focus, and decisive action. Prey animals teach awareness, boundaries, and vigilance. Scavengers teach resourcefulness and resilience. Flying creatures teach perspective and freedom. Water creatures teach emotional flow. Underground creatures teach hidden knowledge and grounding. Migratory animals teach cycles and timing. Nocturnal animals teach inner sight and shadow work. Understanding archetypes helps you access the specific medicine you need.',
          },
          {
            heading: 'Shamanic Animal Journeying',
            content: 'In shamanic practice, you can journey to meet your animal guides through guided meditation or drumming. In a trance state, ask to meet your power animal or receive a specific message. Pay attention to what animals appear—they often come in threes or fours, or one particularly vivid appearance. Ask the animal questions about your situation and listen for guidance. These journeys reveal animal allies and their teachings. Always approach with respect and gratitude, and integrate messages into your daily life.',
          },
          {
            heading: 'Ethical Animal Spirituality',
            content: 'Honor animals through observation and respect, never through extraction or harm. Modern animal spirituality rejects practices that harm animals or use body parts. Instead: observe animals in nature, create art or altars, work with photographs or figurines, meditate on their essence, study their behavior, support animal conservation efforts. Respectful practice honors the animal\'s spirit without requiring physical sacrifice. Build relationships with animals through genuine care and protection of their habitats.',
          },
          {
            heading: 'Dreams & Synchronicity',
            content: 'Animals often communicate through dreams and repeated encounters (synchronicity). An animal appearing multiple times in a short period signals urgent guidance. Pay attention to unexpected encounters, animals crossing your path, or appearing in media you consume. These are messages from your guides. Record dreams featuring animals upon waking—they often carry important wisdom. The more you notice and acknowledge animal signs, the more clearly they communicate with you.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Observe animals in your daily life without judgment—note their behaviors, habitats, and characteristics',
          'Research the symbolism of animals you encounter repeatedly—these are often guides seeking your attention',
          'Create a journal dedicated to animal encounters, noting what you saw, when, where, and how you felt',
          'Study animal oracle or tarot decks to deepen your understanding of animal meanings',
          'Meditate on an animal spirit you feel drawn to, asking what medicine or message it brings',
          'Create a small altar space with images, figurines, or representations of your animal allies',
          'Incorporate animal symbolism into your spellwork and rituals by calling on their strengths',
          'Develop ongoing relationships with your animal guides through regular meditation and journaling',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Bird Wisdom', text: 'Birds often represent messages, perspective, and freedom from higher realms. Pay attention to their songs and flight patterns.' },
          { title: 'Recurring Animals', text: 'When an animal appears repeatedly, it\'s actively trying to guide you. Research its symbolism and meditate on its message.' },
          { title: 'Respectful Connection', text: 'Honor animals through observation and protection, not through extraction of body parts. Support wildlife conservation.' },
          { title: 'Trust Your Feelings', text: 'The emotional response you have to an animal often indicates it\'s a genuine guide for your current situation.' },
          { title: 'Document Everything', text: 'Keep a detailed journal of animal encounters and dreams—patterns emerge over time.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'Medicine Cards by Jamie Sams & David Carson',
          'The Animal Alphabet by Chip Conley',
          'Animal Speak by Ted Andrews',
          'Soul Cards and other animal oracle decks',
          'Field guides to animals in your region',
        ],
      },
    },
  },
  {
    name: 'Fae Spirits',
    emoji: '🧚',
    description: 'Build relationships with fae spirits and beings',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        spirits: FAE_SPIRITS,
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'The fae are powerful, ancient spirits who exist in the liminal spaces between worlds—places of transition, transformation, and magic. Working with fae is both enchanting and demanding; the fae operate by different rules than humans and spirits. They are capricious, playful, sometimes dangerous, and fiercely independent. Building a relationship with fae requires respect, clear boundaries, understanding their culture and etiquette, and genuine reverence for their sovereignty. In return, the fae offer protection, prosperity, creative inspiration, and access to magical realms. This is an advanced practice that demands maturity, clear intention, and unwavering integrity.',
          },
          {
            heading: 'Understanding Fae Culture & Etiquette',
            content: 'The fae have their own complex social structures, honor codes, and rules. They value: Honesty and keeping your word absolutely, respect for their sovereignty and independence, reciprocal exchange (true trade, never charity), cleverness and wit, creative expression, protection of their realms. They dislike: lies or hidden agendas, disrespect to nature, breaking promises, being commanded or controlled, ingratitude disguised as gratitude. Learn their language nuances: "please" and "thank you" can sound dismissive; instead, express genuine reciprocity and respect.',
          },
          {
            heading: 'Liminal Spaces & Threshold Work',
            content: 'Fae are drawn to liminal (in-between) spaces where boundaries dissolve: Dawn and dusk (between night and day), seasonal transitions (Beltane on May 1, Samhain on November 1), threshold locations (forest edges, crossroads, beach where water meets land), transitions between rooms or buildings, the space between sleeping and waking. These thin places make fae contact easier and safer. Create your fae altar in a liminal location—a corner of your garden, a windowsill, a tree at the edge of property, or a natural crossroads. The threshold nature amplifies your work.',
          },
          {
            heading: 'Proper Offerings & Reciprocal Exchange',
            content: 'Fae do not accept charity—they require reciprocal exchange. Traditional offerings: Cream or milk (fae\'s favorite), honey or baked goods, fresh flowers or plants, shiny objects (coins, shells, glass), art or music created with care, acts of environmental protection. Leave offerings with clear verbal intention: "This is offered with respect and in hope of connection." Expect results to flow back—but in fae time and on fae terms. They might send synchronicities, inspiration, unexpected help, or prosperity. Never leave an offering expecting immediate return or you\'ll seem greedy.',
          },
          {
            heading: 'Protection & Boundaries',
            content: 'Fae work requires strong protection magic. Establish clear boundaries: "I welcome the good-hearted fae aligned with my highest good. Tricksters, deceivers, and harmful beings are not welcome in my space." Use protective herbs (sage, rosemary, rowan), stones (iron, black tourmaline, obsidian), or sigils. Some fae are genuinely helpful; others delight in mischief. Stronger boundaries prevent unwanted attention. Always seal your work: "This work is complete. I release all spirits and close this space." Never go into fae work tired, emotionally vulnerable, or lacking clear intention—you\'re at a disadvantage.',
          },
          {
            heading: 'Fae Gifts & Giftings',
            content: 'When fae give you something—whether tangible (objects) or intangible (luck, inspiration)—you\'re bound to reciprocate. The fae remember every debt. Accept gifts knowingly: "I accept this gift and understand I am entering reciprocal relationship with you." Be prepared to reciprocate appropriately: gifts given to fae through offerings, creative work shared with intention to honor them, protection of wild spaces in their name, or personal magical work aligned with their interests. Breaking a gift agreement has serious consequences in the fae realm.',
          },
          {
            heading: 'Communication & Relationships',
            content: 'Fae communication happens through dreams, synchronicity, intuition, and direct contact in meditative states. Keep a dream journal—fae often reach out in dreams. Pay attention to repeated symbols or encounters in nature. Meditate at threshold times and ask for contact. Approach relationship-building slowly and patiently. Some fae want decades of respectful interaction before trusting you fully. Avoid trying to bind or control fae—they\'re sovereign beings who choose their partnerships. The deepest fae relationships develop between humans who respect their nature and fae who choose to work with them.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn fae etiquette and rules before initiating contact—ignorance invites trickery',
          'Create a dedicated space for fae work: a small altar or outdoor shrine in a liminal location',
          'Begin with simple offerings: cream, honey, bread, flowers, or shiny objects left with clear intention',
          'Work during liminal times: dawn/dusk, seasonal transitions, or threshold days (May 1st, November 1st)',
          'Communicate respect through language: address them politely, never demand, always ask permission',
          'Protect yourself: establish clear boundaries, call protective spirits, create sacred space',
          'Keep agreements: if you make a bargain with fae, honor it completely—they remember forever',
          'Record your experiences carefully: fae relationships develop over time with consistent respectful engagement',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Proper Offerings', text: 'Leave cream, honey, bread, shiny objects, or flowers with clear intention. Fae require reciprocal exchange, not charity.' },
          { title: 'Never Command', text: 'The fae are sovereign beings. Always ask respectfully—commanding them invites trickery and harm.' },
          { title: 'Threshold Times', text: 'Work with fae at dawn, dusk, dawn, and seasonal transitions. These liminal times strengthen connection.' },
          { title: 'Strong Boundaries', text: 'Establish protective barriers before fae work. Clarify that only good-hearted, helpful fae are welcome.' },
          { title: 'Keep Your Word', text: 'Fae remember every promise. Breaking agreements has consequences that persist across lifetimes.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Faerie Code by Emily Carding',
          'Tír na nÓg: The Land of Youth by Léargas O\'Sullivan',
          'Faeries and other essay collections by various authors',
          'Traditional folklore about fae from your ancestral region',
          'Local naturalist and ecological groups for environmental protection work',
        ],
      },
    },
  },
  {
    name: 'Crystal Magic (earth-aligned)',
    emoji: '🌱',
    description: 'Use earth-aligned stones for grounding and stability',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        crystals: EARTH_CRYSTALS,
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Overview',
            content: 'Earth-aligned crystals are grounding, stabilizing, and protective. These stones carry the energetic frequency of the physical world, supporting stability, security, abundance, and manifestation. Earth crystals help you become rooted in your body and physical reality, making them essential for practical magic and grounded living. Unlike air or fire crystals that lift energy upward, earth stones anchor your energy downward, creating foundation and fortitude. They support material manifestation, financial abundance, home and family matters, and physical health. Earth magic is the most practical and tangible form of crystal work.',
          },
          {
            heading: 'Earth Crystal Properties & Correspondences',
            content: 'Green Aventurine: The prosperity stone—attracts abundance, money, opportunity, and new beginnings. Supports heart healing and emotional stability. Smoky Quartz: The grounding stone—anchors excess energy, protects against negativity, clears electromagnetic toxins, enhances stability. Black Tourmaline: The protective stone—creates energetic shield against negative influences, grounding force, removes harmful energy before it affects you. Hematite: The centering stone—brings you into present moment, enhances focus, protects against energy drains. Obsidian: The truth stone—reveals what needs to be seen, protects from self-deception, shields against harm.',
          },
          {
            heading: 'Crystal Cleansing & Charging Methods',
            content: 'Cleanse crystals before first use and regularly after: Running water (avoid delicate or salt-sensitive stones), salt water (for hardy stones), salt burial (most thorough), sound (singing bowl or bells), smoke (sage or palo santo), or moonlight (all stones). Charge stones by setting intention: Hold stone, visualize your intention flowing into it, speak the intention aloud, then place in moonlight overnight or in sunlight (brief exposure—excessive sun fades colors). Each charging method has specific energies: moonlight for gentle, intuitive work; sunlight for energetic, action-oriented work; sound for clearing and resonance.',
          },
          {
            heading: 'Crystal Grid Creation',
            content: 'Crystal grids amplify intention through geometric patterns. Create grids by: Choosing a center stone (your main intention), surrounding it with supporting stones in sacred geometric pattern (circles, spirals, mandalas), placing stones on paper with drawn intention symbol, or using natural elements. The most common pattern is the flower of life. Activate the grid by connecting stones energetically with your finger or wand, visualizing light flowing between them. Intention becomes exponentially stronger in geometric arrangements. Keep grids active for specific time periods (full moon cycle, 40 days, etc.) then dismantle with gratitude.',
          },
          {
            heading: 'Working with Earth Stones for Manifestation',
            content: 'Earth crystals are manifestation powerhouses because they work in the physical realm. Green aventurine specifically attracts material abundance—carry it, meditate with it, place it in wealth corners (far left corner of your home/workspace). Smoky quartz keeps you grounded while manifesting—prevents overwhelm and keeps goals realistic. Black tourmaline protects your manifestations—prevents others from draining your energy or undermining your work. Hematite strengthens willpower and follow-through—essential for turning visions into material reality. Use earth stones when you\'re ready to move from dreaming to doing.',
          },
          {
            heading: 'Home & Personal Placement',
            content: 'Crystal placement matters for sustained magic: Entryways and thresholds—black tourmaline or hematite for protection against negativity. Wealth corners (far left of any room)—green aventurine or citrine for abundance attraction. Bedroom—smoky quartz under pillow for grounded, restful sleep; hematite for centering. Kitchen—green aventurine or citrine for abundance in nourishment. Workspace—clear quartz or hematite for focus and clarity. Bathroom—smoky quartz for cleansing excess energy. Carrying stones—choose one that matches your current needs and rotate as your focus shifts.',
          },
          {
            heading: 'Advanced: Tumbled vs. Raw & Specimen Collecting',
            content: 'Tumbled stones (smooth and polished) are gentle and easy to carry; raw/natural stones are more energetically potent but sometimes fragile. Both work—choose based on your use. Building a crystal collection deepens earth magic practice: start with earth stones, add air stones for communication, fire stones for transformation, water stones for flow. Learn to feel stone energies in your body when you hold them. Some practitioners develop relationships with particular specimens that stay with them for decades. High-quality crystals (natural, ethically sourced) hold stronger energy than low-quality mass-produced specimens.',
          },
        ],
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Select earth-aligned crystals that call to you: green aventurine, smoky quartz, or black tourmaline are excellent starting stones',
          'Cleanse your new crystal with running water, salt, or moonlight to clear previous energy imprints',
          'Hold the stone and set a clear intention for its purpose—grounding, protection, prosperity, or stability',
          'Carry the stone in your pocket, purse, or wear as jewelry to maintain constant energetic connection',
          'Place stones at home: near entrances for protection, in wealth corners for prosperity, under your pillow for grounding sleep',
          'Create simple crystal grids by arranging stones in geometric patterns with clear intention',
          'Recharge crystals under moonlight monthly to maintain their energetic potency',
          'Build relationship with your stones over time—they become more powerful and attuned as you work with them',
        ],
      },
      tips: {
        title: 'Tips & Safety',
        items: [
          { title: 'Start Simple', text: 'Begin with one earth-aligned stone that calls to you. Develop relationship before building collections.' },
          { title: 'Regular Cleansing', text: 'Cleanse stones regularly (monthly under moonlight) to maintain their energetic clarity and potency.' },
          { title: 'Intention Setting', text: 'Always set clear intention when working with crystals. Vague intention produces vague results.' },
          { title: 'Skin Sensitivity', text: 'Avoid salt water directly on sensitive skin. Wear stone over clothing or use in pocket instead.' },
          { title: 'Ethical Sourcing', text: 'Support ethical mining practices. Avoid endangered minerals and support fair-trade crystal vendors.' },
        ],
      },
      resources: {
        title: 'Resources',
        items: [
          'The Crystal Bible by Judy Hall',
          'Love is in the Earth by Melody',
          'Crystal Healing & Spiritual Development by Wally and Jenny',
          'Ethical crystal retailers and collectors',
          'Local geology and mineral museums for deep learning',
        ],
      },
    },
  },
];

export function GreenWitchScreen() {
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
    const witchUnlocked = isUnlocked('witchG') || isTest('witchG');
    const isLocked = !hasSubscription && !witchUnlocked;
    setIsWitchLocked(isLocked);

    if (!isLocked) {
      // If unlocked and no subscription, 5% chance to show an ad
      // Legacy ad chance removed
      navigation.navigate('PracticeDetail', { practice, witchType: 'Green', witchColor: '#52c41a' });
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
          <Text style={[styles.title, { color: textColor }]}>🌿 Green Witch</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Plants, Nature, Earth
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {GREEN_WITCH_PRACTICES.map((practice) => (
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
        witchType="Green Witch"
        lockKey="witchG"
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
});