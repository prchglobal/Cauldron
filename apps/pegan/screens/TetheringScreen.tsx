import React, { useState, useCallback } from 'react';
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
import { PracticeLockOverlay } from '../components/PracticeLockOverlay';
import PurchaseService from '../PurchaseService';
import AppodealService from '../AppodealService';

const TETHERING_PRACTICES = [
  {
    id: 1,
    name: 'Principles',
    emoji: '🧭',
    continuityEmoji: '✨',
    type: 'Tethering Foundations',
    element: 'Earth',
    intent: 'Establish the foundational principles guiding place-based spiritual practice and relationship with land',
    description: 'Tethering Foundations - Establish the foundational principles guiding place-based spiritual practice and relationship with land',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '✨',
            name: 'Immanence',
            content: [
              { attribute: 'Definition', value: 'Divine presence embedded in material reality, not separate from it' },
              { attribute: 'Principle', value: 'The sacred is present everywhere in the physical world, not abstract or distant' },
              { attribute: 'Practice', value: 'Perceive divinity in soil, stones, water, and living beings as direct manifestations' },
              { attribute: 'Contrast', value: 'Rejects dualism that separates sacred from mundane; all is sacred' },
            ]
          },
          {
            emoji: '👥',
            name: 'Place-Persons',
            content: [
              { attribute: 'Definition', value: 'Spirits, intelligences, and consciousness specific to particular locations' },
              { attribute: 'Recognition', value: 'Every place has its own character, personality, and sentient presence' },
              { attribute: 'Relationship', value: 'These are beings to develop ongoing reciprocal relationships with' },
              { attribute: 'Manifestation', value: 'Can be sensed through landscape features, weather, animals, and intuition' },
            ]
          },
          {
            emoji: '⚡',
            name: 'Local Powers',
            content: [
              { attribute: 'Definition', value: 'Geographical and elemental forces that shape a location' },
              { attribute: 'Sources', value: 'Watershed energies, geological formations, weather patterns, seasonal changes' },
              { attribute: 'Characteristics', value: 'Ancient, powerful, impersonal yet responsive to respectful engagement' },
              { attribute: 'Influence', value: 'Shape human experience, plant growth, animal presence, and spiritual work' },
            ]
          },
          {
            emoji: '🪦',
            name: 'Embedded Dead',
            content: [
              { attribute: 'Definition', value: 'Ancestors, former inhabitants, and accumulated human presences in land' },
              { attribute: 'Layers', value: 'Indigenous peoples, colonizers, recent dead—all layered in the place' },
              { attribute: 'Responsibility', value: 'Acknowledging and honoring complex histories written into the soil' },
              { attribute: 'Engagement', value: 'Learning place history becomes spiritual responsibility, not mere knowledge' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Immanence: The Sacred in Matter',
            content: 'Immanence is the core principle of place-based spirituality. It rejects the idea that divinity exists "up there" or is separate from the material world. Instead, the sacred is present right here, embedded in rocks, soil, water, and living beings. When you touch soil, you touch divinity. When you drink water, you receive sacred presence. This principle transforms how you relate to the physical world—nothing is "merely material." Everything manifests divine presence in particular, localized ways.'
          },
          {
            heading: 'Place-Persons: The Consciousness of Places',
            content: 'Every location possesses its own consciousness or "place-person"—a spirit or intelligence specific to that location. A river has different character than a mountain. A valley feels distinct from a plateau. Ancient forests possess different presence than young woodlands. These place-persons are not metaphorical—they are actual intelligences that practitioners can sense, relate to, and develop reciprocal relationships with. Recognizing place-persons shifts your engagement from taking-from to relating-with.'
          },
          {
            heading: 'Local Powers: The Forces That Shape Places',
            content: 'Distinct from place-persons, local powers are the impersonal forces and energies that shape a location. Geological forces (volcanoes, earthquakes, erosion patterns) create landscape. Water flows in predictable patterns. Weather systems bring specific seasonal conditions. Soil composition determines what grows. These powers are ancient, vast, and operate whether or not humans acknowledge them. Respectful place-work means understanding and working with these powers, not against them.'
          },
          {
            heading: 'Embedded Dead: The Human Layer',
            content: 'Every land holds layers of human presence—Indigenous peoples, colonizers, enslaved peoples, settlers, recent immigrants. The land holds memories, trauma, resilience, and wisdom of all these presences. Ethical place-work requires acknowledging these complex, often painful histories. You cannot have clean relationship with a place without acknowledging the embedded dead. Learning place history becomes spiritual practice, not merely academic knowledge.'
          },
          {
            heading: 'The Integration: Principles in Practice',
            content: 'These four principles work together: Immanence teaches you to see the sacred in this particular place. Place-persons invite you into relationship with this location\'s specific intelligence. Local powers ground you in understanding what shapes this land. Embedded dead require you to hold the complexity of human presence. Together, they create a comprehensive approach to place-based spirituality that is ethical, relational, and embodied.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Learn the geological history of your place—how was this land formed?',
          'Research the Indigenous peoples whose territory this is—their names, practices, continuing presence',
          'Map the watershed of your location—where does water flow to and from?',
          'Identify the dominant plants, trees, and animals of your place',
          'Visit a local historical museum or library to learn recent human history',
          'Spend time in quiet observation of your place, noticing how it feels at different times',
          'Read books about bioregionalism and place-based spirituality',
          'Perform a land acknowledgment ritual on your land',
          'Begin journaling observations about your place\'s character and presence'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'History Is Not Separate From Spirituality',
            text: 'Learning place history is not academic work—it is spiritual practice. The embedded dead are present in the land. Their histories shape what lives there now.'
          },
          {
            title: 'Listen More Than You Speak',
            text: 'Place-based spirituality begins with receptivity. Approach your land as a student, not a teacher. Ask questions and listen for the land\'s responses.'
          },
          {
            title: 'Physical Presence Matters',
            text: 'These principles cannot be practiced from abstract knowledge alone. You must physically be on the land, touch the soil, drink the water, breathe the air.'
          },
          {
            title: 'Different Places Feel Different',
            text: 'Expect that a mountain place will teach you differently than a river valley or coastal place. Each place-person has unique character.'
          },
          {
            title: 'Go Slowly With Indigenous Knowledge',
            text: 'Learn from Indigenous peoples\' teachings about their own lands. Honor their knowledge without appropriating their practices.'
          },
          {
            title: 'Immanence Requires Your Attention',
            text: 'The sacred is present whether you perceive it or not—but your attention awakens deeper relationship with it. Practice deliberately perceiving divinity in matter.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'USGS Geological Survey: maps of local geology and geological history',
          'Native American Heritage Month resources and Indigenous Nation websites for your region',
          'US Geological Survey Watershed Finder for identifying your local watershed',
          '"Braiding Sweetgrass" by Robin Wall Kimmerer—foundational text on reciprocal relationship with land',
          '"The Original Instructions" by Winona LaDuke—Indigenous perspectives on place relationship',
          'Local naturalist societies and field guides for your region\'s plants and animals',
          'County historical societies and local libraries with place history archives',
          '"Becoming Native to This Place" by Wes Jackson—bioregional thinking',
          'Online mapping tools (Google Earth, Watershed Finder) to understand your land\'s geography',
          'Podcasts focused on Indigenous land relations and bioregional awareness',
          'Local nature centers and environmental organizations working in your region'
        ]
      }
    }
  },
  {
    id: 2,
    name: 'Ontology',
    emoji: '🔮',
    continuityEmoji: '🔮',
    type: 'Tethering Foundations',
    element: 'Spirit',
    intent: 'Develop comprehensive understanding of what exists in place-based practice and the types of beings that inhabit locations',
    description: 'Tethering Foundations - Develop comprehensive understanding of what exists in place-based practice and the types of beings that inhabit locations',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🌳',
            name: 'Land Spirits',
            content: [
              { attribute: 'Definition', value: 'Sentient beings native to and inseparable from a specific location' },
              { attribute: 'Examples', value: 'River spirits, mountain spirits, forest spirits, meadow spirits' },
              { attribute: 'Characteristics', value: 'Ancient, powerful, directly connected to the health of the place' },
              { attribute: 'Relationship', value: 'Desire respectful, reciprocal relationship; not to be commanded' },
            ]
          },
          {
            emoji: '👻',
            name: 'Ancestral Presences',
            content: [
              { attribute: 'Definition', value: 'Human spirits residing in or bound to particular locations' },
              { attribute: 'Sources', value: 'Former residents, those buried in the place, those who died there' },
              { attribute: 'Complexity', value: 'May include Indigenous peoples, colonizers, enslaved peoples—morally complex' },
              { attribute: 'Work', value: 'Honoring, listening to, sometimes helping transition those bound here' },
            ]
          },
          {
            emoji: '🦅',
            name: 'Animal Allies',
            content: [
              { attribute: 'Definition', value: 'Animals and animal spirits native to a place' },
              { attribute: 'Distinction', value: 'Not the individual animals themselves, but their collective intelligence' },
              { attribute: 'Role', value: 'Teach place-specific wisdom; guides for understanding place' },
              { attribute: 'Signs', value: 'Repeated animal encounters carry messages from animal allies' },
            ]
          },
          {
            emoji: '⚡',
            name: 'Elemental Forces',
            content: [
              { attribute: 'Definition', value: 'Personified forces of water, earth, fire, air in a specific place' },
              { attribute: 'Examples', value: 'Spring waters, mountain stone, seasonal winds, lightning' },
              { attribute: 'Character', value: 'Impersonal yet responsive; not human-like but intelligent' },
              { attribute: 'Access', value: 'Work with elements through their local manifestations' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Land Spirits: Consciousness Native to Place',
            content: 'Land spirits are sentient beings indigenous to and inseparable from specific locations. A river spirit IS the river—not a separate entity inhabiting the river, but the consciousness and intelligence that makes that particular river alive and aware. These spirits are ancient and powerful, having existed long before humans arrived. They shape the land through their presence and power. They are not forces to be commanded or controlled, but beings to be related with respectfully. A healthy relationship with land spirits requires offering, reciprocity, and listening.'
          },
          {
            heading: 'Ancestral Presences: The Human Layer',
            content: 'In addition to land spirits, places hold the presences of those who have lived, died, or been buried there. These ancestral presences are layered and complex. Some may be Indigenous peoples with deep continuity on the land. Others may be colonizers or enslaved peoples. Some are recent dead, others ancient. All of these presences shape the energetic and spiritual landscape. Ethical place-work acknowledges all these presences, not just the ones we find comfortable. Some ancestral work involves honoring; some involves helping spirits transition; some involves truth-telling about difficult histories.'
          },
          {
            heading: 'Animal Allies: Teachers Through Their Presence',
            content: 'Every place has characteristic animals. Rather than relating with individual animals, place-based work relates with animal species\' collective intelligence and wisdom. If deer frequently appear on your land, deer teaches you something specific about your place and your work. If ravens visit repeatedly, they bring messages. Animal allies are guides, showing you what qualities or wisdom your place embodies. Learning what animals are native to and thrive in your place teaches you what kind of place this is and how to live here well.'
          },
          {
            heading: 'Elemental Forces: Impersonal Intelligences',
            content: 'Water, earth, fire, and air manifest in every place, but always uniquely. The water of this particular river is different from all other rivers. The stone of this mountain is distinct. The seasonal winds carry different stories. Learning to sense and relate with the specific manifestations of elements in your place is central to place-based work. These forces are ancient and vast—your relationship with them is one of respect and reciprocity, not dominance.'
          },
          {
            heading: 'Integration: A Living Ontology',
            content: 'These four categories of beings—land spirits, ancestral presences, animal allies, and elemental forces—comprise the inhabited, sentient world of a place. They are not equal: land spirits are foundational and most powerful. But all deserve recognition and respectful relationship. A mature practitioner develops nuanced understanding of all four categories\' distinct presences, needs, and teachings. This creates a living, dynamic ontology where place is understood not as an object to be used, but as a community of beings to be related with.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Observe animals native to your place—spend time noting which species you see regularly',
          'Listen to water on your land—rivers, streams, springs, rain patterns',
          'Sit with stones or soil—what age and character do they have?',
          'Learn the seasonal wind patterns and what they carry',
          'Research the history of your place—who lived here before you?',
          'Visit specific locations repeatedly—how do they reveal their character over time?',
          'Keep a journal of spiritual presences you sense in different locations',
          'Practice receiving impressions without filtering through logic',
          'Make small offerings and observe the place\'s response'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Trust Your Sensing, Not Your Thoughts',
            text: 'Initial impressions from a place are often more accurate than over-thinking. What is your body telling you about a location? What feeling does it evoke?'
          },
          {
            title: 'Each Spirit is Unique',
            text: 'Do not assume one river spirit is like all river spirits. Each location\'s beings are distinct. Get to know these specific ones.'
          },
          {
            title: 'Animal Signs Are Messages',
            text: 'When you see the same animal repeatedly, pay attention. That animal ally is trying to communicate something specific.'
          },
          {
            title: 'Elemental Forces Are Powerful',
            text: 'Respect water, stone, wind, and fire in your place. They move at scales beyond human time. Work with them, not against them.'
          },
          {
            title: 'Complexity Is Sacred',
            text: 'Your place may hold histories you find uncomfortable. Honoring ancestral presences means honoring all of them, including those who caused harm.'
          },
          {
            title: 'Relationship Develops Slowly',
            text: 'You cannot force intimacy with place spirits. Build relationship through consistent presence, offering, and respectful attention over time.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Local field guides for plants, animals, and birds native to your region',
          'Native Nation websites and cultural centers for learning Indigenous teachings about your place',
          '"The Spell of the Sensuous" by David Abram—philosophy of sensory engagement with world',
          'USGS geological resources for understanding bedrock and soil composition',
          'Historical societies\' records and museums documenting your place\'s history',
          'Watershed councils and environmental organizations focused on local ecology',
          'Books on animal behavior and meanings (beyond zodiac—actual natural history)',
          'Local naturalists and birding groups who can teach you about native species',
          'Historical maps showing how your place has changed over time',
          'Documentaries and films about Indigenous peoples of your region',
          'Guided meditation or journey work resources for communicating with spirits'
        ]
      }
    }
  },
  {
    id: 3,
    name: 'Engagement',
    emoji: '💭',
    continuityEmoji: '💫',
    type: 'Tethering Practices',
    element: 'Water',
    intent: 'Learn the practical modes of engagement for building and maintaining reciprocal relationships with place spirits and local powers',
    description: 'Tethering Practices - Learn the practical modes of engagement for building and maintaining reciprocal relationships with place spirits and local powers',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '👂',
            name: 'Deep Listening',
            content: [
              { attribute: 'Definition', value: 'Receptive presence without agenda, open to what place wants to communicate' },
              { attribute: 'Practice', value: 'Sit quietly, quiet your thoughts, attune to subtle signals from the land' },
              { attribute: 'Signs', value: 'Temperature shifts, animal sounds, intuitive knowing, dreams, synchronicity' },
              { attribute: 'Goal', value: 'Move beyond human agenda into alignment with place\'s needs and wisdom' },
            ]
          },
          {
            emoji: '🙏',
            name: 'Offering & Reciprocity',
            content: [
              { attribute: 'Definition', value: 'Giving with genuine gratitude and respect, establishing mutual exchange' },
              { attribute: 'Foundation', value: 'Place spirits give constantly (water, air, soil, nourishment)—reciprocity balances this' },
              { attribute: 'Types', value: 'Water, cornmeal, flowers, tobacco, milk, honey, energy, time, service' },
              { attribute: 'Key', value: 'Offering should cost you something; empty gestures are insulting' },
            ]
          },
          {
            emoji: '🌱',
            name: 'Relationship Building',
            content: [
              { attribute: 'Definition', value: 'Gradual deepening through consistent presence, attention, and commitment' },
              { attribute: 'Timeline', value: 'Deep relationship develops over months and years, not weeks' },
              { attribute: 'Elements', value: 'Regular visits, learning place intimately, showing up in difficult times' },
              { attribute: 'Fruits', value: 'When deep, relationship offers protection, guidance, and tangible support' },
            ]
          },
          {
            emoji: '🔄',
            name: 'Collaborative Work',
            content: [
              { attribute: 'Definition', value: 'Joint projects serving both humans and place spirits\' wellbeing' },
              { attribute: 'Examples', value: 'Land restoration, habitat protection, removing invasive species, replanting natives' },
              { attribute: 'Magic', value: 'Physical action combined with energetic intention creates powerful transformation' },
              { attribute: 'Mutual Benefit', value: 'The place benefits; the spirit benefits; you benefit through connection' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Deep Listening: The Foundation of Relationship',
            content: 'All meaningful relationship begins with listening. Deep listening means quieting your own agenda and opening to what the other wants to communicate. In place-based work, deep listening means sitting with a place long enough for its presence to become clear. This requires patience. Your thoughts will interrupt. Your habitual patterns will emerge. But gradually, if you persist in quiet attention, the place reveals itself. You begin to sense its character, needs, and wisdom. Deep listening is not passive—it requires active intention and presence. But it is receptive rather than controlling.'
          },
          {
            heading: 'Offering and Reciprocity: The Economy of Place-Work',
            content: 'Place spirits give constantly. Water flows whether you acknowledge it or not. Plants grow. Air sustains you. Soil holds you. Humans receive these gifts continuously. Reciprocity means giving back. This is not payment—you cannot "pay" for a river—but it is acknowledgment of mutual exchange. Offerings should have real value: water you have gathered, cornmeal you have purchased, flowers you have grown, honey you have tended. Your time and attention also count. The key is that your offering costs you something. A genuine offering requires you to give something of value, not merely tokens.'
          },
          {
            heading: 'Relationship Building: The Long Arc',
            content: 'Deep relationship develops slowly. You cannot rush this. A single offering does not create relationship—repeated, consistent attention over months and years does. Like human relationships, place relationships require showing up regularly, learning what the other needs, being present during difficult times, and honoring the relationship\'s evolution. After months or years of consistent engagement, a threshold is crossed where the relationship deepens qualitatively. The place spirit begins to offer guidance and protection. You develop almost intuitive sense of what this place needs and wants. This depth is precious and should be protected through continued attention.'
          },
          {
            heading: 'Collaborative Work: Magic in Action',
            content: 'One of the most powerful forms of engagement is collaborative work on behalf of the place. Removing invasive species that harm the ecosystem. Replanting native plants. Cleaning pollution. Protecting habitat. This work is simultaneously practical and magical. Your hands do the physical labor. Your intention aligns this labor with the place spirit\'s wellbeing. The result is transformation that serves everyone—the place, the spirit, the land, and you. This kind of work deepens relationship faster than almost any other practice because you are literally serving the place\'s wellbeing.'
          },
          {
            heading: 'Integration: The Relationship Deepens',
            content: 'These four modes of engagement—listening, offering, relationship building, and collaborative work—are not separate. They work together. Your listening reveals what needs to be done. Your collaborative work expresses reciprocity. Your consistent relationship building creates the trust that allows deep listening. Over time, these modes integrate into a natural, flowing relationship where you move between them fluidly. The place becomes familiar, even beloved. You know its moods, its needs, its gifts. This is the goal of place-based practice.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Choose one specific location on your land to work with regularly',
          'Commit to visiting this location at least weekly',
          'Bring an offering each visit—water, cornmeal, flowers, or other meaningful gift',
          'Sit quietly for at least 20 minutes, practicing deep listening',
          'Notice and journal any impressions, feelings, or communications you receive',
          'Learn the history of this specific location',
          'Identify ways you could serve this location (habitat restoration, cleanup, native replanting)',
          'Begin one small collaborative project to benefit the place',
          'Develop a personal relationship with this place-spirit through consistent presence'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Consistency Matters More Than Intensity',
            text: 'Weekly visits for six months deepen relationship more than a day-long intensive. Show up regularly, even if briefly.'
          },
          {
            title: 'Listen Before Acting',
            text: 'Do not assume you know what the place needs. Listen first. Ask. Only act on what you hear.'
          },
          {
            title: 'Offerings Should Humble You Slightly',
            text: 'If your offering costs you nothing, it is not a true offering. Give something that requires effort or care.'
          },
          {
            title: 'Relationship Has Reciprocal Character',
            text: 'You give offerings, but you also receive—water, soil nutrients, air, and presence. Notice both sides of the exchange.'
          },
          {
            title: 'Physical Work Deepens Magic',
            text: 'Sitting and meditating are valuable, but getting your hands dirty—literally serving the place—deepens relationship fastest.'
          },
          {
            title: 'Trust Your Intuition',
            text: 'You may not understand why a place needs something, but if intuition says so, trust it. Place spirits communicate through feeling and instinct.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Local conservation organizations doing land restoration work you can join',
          '"Restoration and Reconciliation" by Robin Wall Kimmerer—restoring relationship through land work',
          'Books on native plant restoration for your specific bioregion',
          'Invasive species guides for your area—learn what to remove',
          'Online communities focused on place-based spirituality and land work',
          'Land trusts and habitat protection organizations in your region',
          'Permaculture and regenerative agriculture resources for working WITH land',
          'Books on listening practices and deep ecology philosophy',
          'Local Indigenous environmental organizations and their teachings',
          'Documentary films about land restoration and environmental healing',
          'Meditation and contemplative practice guides for developing listening capacity'
        ]
      }
    }
  },
  {
    id: 4,
    name: 'Conditions',
    emoji: '🔑',
    continuityEmoji: '🔐',
    type: 'Tethering Foundations',
    element: 'Earth',
    intent: 'Establish the necessary conditions and prerequisites that make authentic place-based spiritual work possible and ethical',
    description: 'Tethering Foundations - Establish the necessary conditions and prerequisites that make authentic place-based spiritual work possible and ethical',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '📚',
            name: 'Land Knowledge',
            content: [
              { attribute: 'Requirement', value: 'Deep familiarity with your place—its history, ecology, geology, current state' },
              { attribute: 'Includes', value: 'Geological formation, human history, Indigenous peoples, current ecosystem' },
              { attribute: 'Why', value: 'Cannot engage ethically with what you do not understand; knowledge prevents harm' },
              { attribute: 'Practice', value: 'Ongoing learning through research, observation, and relationship' },
            ]
          },
          {
            emoji: '🚪',
            name: 'Permission & Belonging',
            content: [
              { attribute: 'Definition', value: 'The right to be present and work on this land—legal and spiritual' },
              { attribute: 'Legal', value: 'You should own, lease, or have explicit permission from landowner' },
              { attribute: 'Spiritual', value: 'The land and its spirits should welcome your presence and work' },
              { attribute: 'Complexity', value: 'If on colonized land, relationship with Indigenous presence is necessary' },
            ]
          },
          {
            emoji: '🔄',
            name: 'Reciprocity & Service',
            content: [
              { attribute: 'Core Principle', value: 'You give as much as you receive; work benefits the place, not just you' },
              { attribute: 'In Practice', value: 'Offerings, land service, protection, restoration, ongoing relationship' },
              { attribute: 'Not Transaction', value: 'Cannot buy favor through offerings; must be genuine mutual care' },
              { attribute: 'Ongoing', value: 'Reciprocity is continuous practice, not a one-time thing' },
            ]
          },
          {
            emoji: '🕰️',
            name: 'Long-Term Commitment',
            content: [
              { attribute: 'Timeline', value: 'Meaningful place-work requires years, ideally decades' },
              { attribute: 'Why', value: 'Deep relationship and understanding develop slowly; land works on human timescale' },
              { attribute: 'Realistic', value: 'If you plan to move in a year, manage expectations accordingly' },
              { attribute: 'Benefit', value: 'Long-term commitment allows deep magic and full transformation' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Land Knowledge: Understanding Before Engagement',
            content: 'You cannot engage ethically with what you do not understand. Deep land knowledge prevents harm. If you do not know the geological history, you might drain a spring that is crucial for other species. If you do not know the human history, you might inadvertently repeat colonial harms. If you do not know which plants are native versus invasive, your "restoration" might make things worse. Land knowledge includes geology (how was this formed?), ecology (what species live here and how?), human history (who lived here? what happened?), and current conditions (what is the state of this place now?). This knowledge is the foundation for all ethical place-work.'
          },
          {
            heading: 'Permission and Belonging: Legal and Spiritual Rights',
            content: 'Before engaging in deep place-work, you need both legal and spiritual permission. Legally, you should own the land, lease it, or have explicit permission from the landowner. You cannot do place-work on land that is not yours without permission. Spiritually, the land itself should welcome your presence. You can sense this through listening. If permission is withheld—if you feel cautioned or unwelcome—honor that. Some lands are not meant for your work. Additionally, if you are working on colonized land (which most land in North America is), you have responsibility to acknowledge Indigenous peoples and their ongoing relationship with the land. This may mean supporting Indigenous land claims or organizing with Indigenous-led environmental movements.'
          },
          {
            heading: 'Reciprocity and Service: Mutual Relationship',
            content: 'The place gives you water, air, soil, nourishment, beauty, and presence. Reciprocity means giving back. This is not optional—it is the foundation of ethical practice. Reciprocity includes offerings (water, cornmeal, flowers), service (land restoration, removal of invasive species), protection (preventing harm), and time (showing up consistently). Reciprocity is not a transaction—you cannot "pay off" your debt through offerings. Rather, it is a stance: "I understand this place provides for me. I give back in recognition and gratitude." This stance, practiced consistently, transforms your relationship with the place.'
          },
          {
            heading: 'Long-Term Commitment: The Timescale of Place',
            content: 'Deep place-work requires time. Not weeks or months, but years and ideally decades. The first year, you are learning the place. In the second year, you begin understanding its moods and needs. By year five, you can sense shifts others miss. By year ten, you have deep knowledge and relationship. By year twenty, you understand cycles spanning human lifespans. The land works on a timescale that vastly exceeds human lifespan. Rocks form over millions of years. Trees live centuries. Water cycles persist for millennia. When you commit to a place for decades, you align yourself with the place\'s actual timescale. This is when deep magic becomes possible.'
          },
          {
            heading: 'Integration: The Prerequisites Create Foundation',
            content: 'These four conditions work together. Land knowledge informs what reciprocity means. Permission establishes the relationship\'s beginning. Long-term commitment allows that relationship to deepen. None of these conditions is optional. Attempting place-work without them risks harm—to yourself, to the place, and to the beings living there. When all four conditions are present, authentic transformation becomes possible.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Research your land\'s geological history using USGS resources',
          'Investigate Indigenous peoples who have/had relationship with your land',
          'Compile human history—who settled, what industries, what events occurred',
          'Study current ecology—native plants, animals, water, weather patterns',
          'Examine your legal right to be on and work on this land',
          'Perform a permission-seeking ritual on the land',
          'Journal the place spirits\' response over several weeks',
          'Only proceed with place-work if permission is clearly granted',
          'Create a written commitment to long-term engagement with this place'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Knowledge Is Humble',
            text: 'The more you learn, the more you realize how much you don\'t know. Stay humble. This is healthy.'
          },
          {
            title: 'Permission Can Be Withdrawn',
            text: 'Just because you had permission once doesn\'t mean forever. Refresh your understanding. Listen for changes.'
          },
          {
            title: 'Reciprocity Is Ongoing, Not Finished',
            text: 'You cannot complete reciprocity. It is a lifetime practice of giving back for what you receive.'
          },
          {
            title: 'Long-Term Does Not Mean Forever',
            text: 'You may eventually leave a place. When you do, honor the relationship by giving thanks and making transition offerings.'
          },
          {
            title: 'Conditions Apply to Communities Too',
            text: 'If working with others on shared land, these conditions apply to the group—shared knowledge, shared permission, shared commitment.'
          },
          {
            title: 'Conditions Prevent Harm',
            text: 'These may feel restrictive, but they protect you, the place, and others. Work within them.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'USGS Geological Survey maps and resources for geological history',
          'Native American Heritage organizations specific to your region',
          'County historical societies with archival records',
          'Local libraries with historical collections and maps',
          '"Whose Land Are We On?" resources—tools for learning Indigenous land claims',
          'Environmental history books about your specific region',
          'Native species field guides for your bioregion',
          'Local ecology courses or nature centers',
          'Books on reciprocity and responsibility in ecological relationships',
          'Oral histories and documentation from local Indigenous peoples',
          'Land trust and conservation organizations with long-term commitments'
        ]
      }
    }
  },
  {
    id: 5,
    name: 'Geometry',
    emoji: '📐',
    continuityEmoji: '🗺️',
    type: 'Tethering Practices',
    element: 'Earth',
    intent: 'Understand the physical and energetic geometry of places, recognizing and working with thresholds, centers, and boundaries',
    description: 'Tethering Practices - Understand the physical and energetic geometry of places, recognizing and working with thresholds, centers, and boundaries',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🚪',
            name: 'Thresholds',
            content: [
              { attribute: 'Definition', value: 'Liminal spaces where energies transition—between states, domains, or presences' },
              { attribute: 'Examples', value: 'Doorways, gates, stream crossings, forest edges, shorelines, ridgelines' },
              { attribute: 'Characteristics', value: 'High energy, vulnerable, where guardians often dwell, places of transformation' },
              { attribute: 'Work', value: 'Powerful places for blessing, protection, communication with spirits' },
            ]
          },
          {
            emoji: '◎',
            name: 'Centers',
            content: [
              { attribute: 'Definition', value: 'The vital heart or core point of a place—its energetic center' },
              { attribute: 'Location', value: 'Can be a single tree, spring, stone, or simply the deepest energy point' },
              { attribute: 'Power', value: 'Tremendously powerful; axis mundi connecting heaven, earth, underworld' },
              { attribute: 'Work', value: 'Primary location for ritual work, intention-setting, deepest communion' },
            ]
          },
          {
            emoji: '🛡️',
            name: 'Boundaries',
            content: [
              { attribute: 'Definition', value: 'Edges that define the limits of a place\'s domain—its territory' },
              { attribute: 'Markers', value: 'Natural features (ridgelines, water, forest edge) or created (fences, stones)' },
              { attribute: 'Function', value: 'Protect the place\'s energy, keep unwanted influences out, mark sacred territory' },
              { attribute: 'Work', value: 'Blessing boundaries, placing protective wards, honoring territorial spirits' },
            ]
          },
          {
            emoji: '🌐',
            name: 'Sacred Geometry',
            content: [
              { attribute: 'Definition', value: 'The proportions and patterns that organize space energetically' },
              { attribute: 'Examples', value: 'Spirals, circles, mandalas, grids—natural and intentional patterns' },
              { attribute: 'In Nature', value: 'River meanders, tree branch patterns, watershed shapes, animal trails' },
              { attribute: 'In Practice', value: 'Creating altars, walking labyrinth paths, casting circles respects natural patterns' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Thresholds: The Spaces Between',
            content: 'Thresholds are powerful places because they exist between. A doorway exists between outside and inside. A stream crossing exists between one bank and another. A forest edge exists between forest and meadow. In all these in-between spaces, transformation is possible. The normal rules of both domains are suspended. Energy flows in unusual patterns. Guardians often dwell at thresholds, watching who or what crosses. Thresholds are excellent places for blessing, protection work, communication with spirits, and transformation. When walking thresholds intentionally, you acknowledge the transition. You do not treat them as mere passages but as sacred spaces with their own presence and guardians.'
          },
          {
            heading: 'Centers: The Axis Mundi',
            content: 'Every place has an energetic center—its heart. This center might be a single ancient tree, a spring, a particular stone, or simply the point where energy concentrates most densely. The center is the axis mundi—the point that connects heaven, earth, and underworld. It is tremendously powerful. Ritual work performed at the center carries amplified power. Intention set at the center reaches farther. The center is also the most sacred point—where the place\'s deepest presence dwells. Finding your place\'s center requires sensitivity and often time. You may sense it; you may have a dream revealing it. Once you have found it, the center becomes your primary location for deep work, offering, and communion.'
          },
          {
            heading: 'Boundaries: Marking Territory',
            content: 'Places have boundaries—edges that mark where one place ends and another begins. These might be natural (a ridgeline marking the edge of a watershed, a forest edge, a shoreline) or created (a fence, a line of stones). Boundaries serve to protect a place\'s energy, keeping unwanted influences out and keeping the place\'s essence contained. Honoring boundaries includes respecting both your place\'s limits and other places\' territories. Creating clear boundaries around your place—through blessing, intention, or even physical markers—strengthens the place\'s protection. Some places\' boundaries are permeable and welcoming; others are more closed. Respecting these differences is key.'
          },
          {
            heading: 'Sacred Geometry: The Language of Space',
            content: 'All matter organizes according to geometric patterns. Rivers meander in spirals. Tree branches follow fractal patterns. Watersheds create natural mandalas. These patterns are not accidents—they reflect fundamental organizing principles. Working with geometry means aligning your ritual space with these natural patterns. A circular altar honors the circle that appears throughout nature. A spiraling labyrinth path respects the spiral that appears in shells, galaxies, and water vortexes. Understanding and working with sacred geometry connects you to the deep organizational principles of the universe. Your practice becomes elegant, efficient, and powerful.'
          },
          {
            heading: 'Integration: The Complete Picture',
            content: 'When you understand a place\'s geometry—its thresholds, center, boundaries, and sacred patterns—you understand that place at a deep level. You can place ritual work where it will be most effective. You know where to establish protections. You understand how energy moves through the space. This geometric knowledge, combined with relationship and understanding of the spirits present, allows for profound and elegant place-work.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Walk the perimeter of your place, sensing where boundaries feel strongest',
          'Identify water features and trace their paths through your place',
          'Look for the energetic center—explore until you find where energy concentrates',
          'Identify 2-3 thresholds on your land and visit them regularly',
          'Notice how different areas of your place feel different',
          'Look for patterns: spirals, circles, symmetries in the landscape',
          'Map your place\'s geometry on paper',
          'Observe animal trails—they follow lines of power',
          'Begin ritual work at your place\'s center'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Water Follows Geometry',
            text: 'Observe how water moves on your land. Water follows the deep geometry. Understanding water patterns teaches you about place geometry.'
          },
          {
            title: 'The Center Calls You',
            text: 'You will often find yourself repeatedly drawn to the same location. This is usually the center. Trust this draw.'
          },
          {
            title: 'Thresholds Have Guardians',
            text: 'Approach thresholds respectfully. Do not cross casually. Ask permission and make offerings.'
          },
          {
            title: 'Geometry Is Not Just Symbolic',
            text: 'Sacred geometry reflects actual energy patterns. Working with it is not decorative—it is functional magic.'
          },
          {
            title: 'Boundaries Protect and Welcome',
            text: 'Good boundaries are not walls. They define territory while still welcoming those who belong.'
          },
          {
            title: 'Walk the Geometry',
            text: 'Understanding through walking and moving in the space teaches more than thinking alone. Your body understands geometry differently than your mind.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'USGS topographic maps showing watershed patterns and geology',
          '"The Geometry of Living" by Celia Madsen—understanding space and place',
          'Books on sacred geometry and geometric symbolism',
          'Ancient site studies (Stonehenge, Newgrange, etc.)—how ancients used geometry',
          'Fractal geometry and pattern books—understanding nature\'s patterns',
          'Watershed maps for your region showing how water moves',
          'Labyrininth design and walking guides',
          'Compass and orienteering tools for determining directions and alignments',
          'Local geological surveys showing bedrock and soil patterns',
          'Books on Indigenous sacred geometry and place significance',
          'Aerial maps of your place revealing patterns not visible on the ground'
        ]
      }
    }
  },
  {
    id: 6,
    name: 'Consciousness',
    emoji: '🧠',
    continuityEmoji: '💎',
    type: 'Tethering Practices',
    element: 'Spirit',
    intent: 'Develop the states of consciousness and qualities of presence necessary for deep, effective place-based spiritual work',
    description: 'Tethering Practices - Develop the states of consciousness and qualities of presence necessary for deep, effective place-based spiritual work',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🎯',
            name: 'Presence',
            content: [
              { attribute: 'Definition', value: 'Full, undivided attention in the present moment—not thinking about past or future' },
              { attribute: 'In Practice', value: 'Phone silenced, mind quieted, body alert, senses open to what is' },
              { attribute: 'Why', value: 'Place spirits respond to genuine presence; distracted engagement is insulting' },
              { attribute: 'Development', value: 'Requires practice; mind habitually wanders; discipline helps' },
            ]
          },
          {
            emoji: '👂',
            name: 'Attunement',
            content: [
              { attribute: 'Definition', value: 'Tuning your consciousness to resonate with the place\'s frequency' },
              { attribute: 'Process', value: 'Letting go of your own concerns, synchronizing with place\'s rhythm' },
              { attribute: 'Result', value: 'Able to sense subtle shifts, receive communication, perceive hidden presences' },
              { attribute: 'Requires', value: 'Humility, openness, willingness to be changed by the place' },
            ]
          },
          {
            emoji: '👁️',
            name: 'Listening',
            content: [
              { attribute: 'Definition', value: 'Deep receptivity—hearing not just with ears but with entire being' },
              { attribute: 'Listens For', value: 'Words, images, feelings, synchronicities, animal signs, intuitive knowing' },
              { attribute: 'Quality', value: 'Non-judgmental, open, receiving whatever comes without editing' },
              { attribute: 'Key', value: 'Listening is not passive—active receptivity requiring intention and will' },
            ]
          },
          {
            emoji: '🌊',
            name: 'Flow',
            content: [
              { attribute: 'Definition', value: 'Moving with place\'s energy rather than imposing your agenda' },
              { attribute: 'In Practice', value: 'Responsive, flexible, adjusting based on what place reveals' },
              { attribute: 'Opposite', value: 'Fighting, controlling, forcing—these create resistance and failure' },
              { attribute: 'Mastery', value: 'Acting decisively while still flowing with natural currents' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Presence: The Foundation of All Work',
            content: 'Without presence, you are merely pretending to do place-work. Place spirits know the difference between genuine presence and performance. When you are fully present—undistracted, aware, attentive—the place responds. Spirits recognize authentic presence and respond with their own presence. Developing presence requires discipline. Your mind will wander; this is normal. Rather than getting frustrated, gently return attention again and again. Over time, presence becomes more natural. Presence is not a state you achieve once and maintain forever. It is a continuous return, a practice, an intention you renew moment by moment.'
          },
          {
            heading: 'Attunement: Synchronizing With Place',
            content: 'Attunement means tuning your consciousness to match the place\'s frequency. A mountain has different frequency than a river valley. An ancient forest has different frequency than a young meadow. When you attune, you let your own concerns fall away and synchronize with the place\'s rhythm. This requires surrender—you cannot attune while controlling or planning. Attunement is opening yourself to be shaped by the place. Once attuned, you can sense what might otherwise remain hidden. You perceive the place\'s needs, its character, its hidden presences. Attunement develops with practice and always requires fresh attention—you must attune each time you visit, not assume yesterday\'s attunement carries forward.'
          },
          {
            heading: 'Listening: Active Receptivity',
            content: 'Listening is not passivity. It is active receptivity—intentionally opening yourself to receive communication. When you listen, you offer full attention to what the other wants to express. In place-work, you listen with all your senses and beyond. You listen to words that come as intuitive knowing. You listen to the animals\' movements. You listen to weather patterns. You listen to the quality of silence. You listen to dreams that night brings. Listening is a discipline. Humans are habituated to speaking, planning, and doing. Listening requires willingness to be quiet, to wait, to receive without needing to respond immediately. The place spirits reward genuine listening with genuine communication.'
          },
          {
            heading: 'Flow: Working With, Not Against',
            content: 'One of the deepest learnings of place-based work is the difference between forcing and flowing. When you force—trying to make the place do what you want—you create resistance. The work becomes difficult, results are mediocre, and the relationship suffers. When you flow—moving with the place\'s actual energies and needs—everything becomes easier. Opportunities align. Communication clarifies. Magic becomes elegant and powerful. Flow is not passivity. You still act decisively and clearly. But you act in alignment with what the place actually is and needs, not what you wish it were. This requires constant listening and adjustment. But the reward is that your work becomes effective and the relationship deepens.'
          },
          {
            heading: 'Integration: States of Consciousness Support Deep Work',
            content: 'These four states—presence, attunement, listening, flow—are not separate. They work together and reinforce each other. Presence enables attunement. Attunement enables deep listening. Listening guides flow. Together, they create the consciousness necessary for profound place-based work. These are not states you achieve once. They are ongoing practices, refined over years of work. The deeper your practice, the more natural these states become. Eventually, they are not something you do—they become how you are when engaged with place.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Practice daily grounding meditation to strengthen presence',
          'Begin phone-silencing practice during place visits',
          'Sit quietly for 20 minutes with intention to listen',
          'Learn to notice the place\'s unique frequency or "signature"',
          'Practice synchronizing your breath with the place\'s breath',
          'Journal about the place\'s character after each visit',
          'Notice when you are fighting versus flowing with place energy',
          'Consciously let go of your agenda before entering the place',
          'Over months, develop these states as natural ways of being'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Presence Practice Is Hard at First',
            text: 'If your mind wanders constantly, this is normal. Keep returning attention. Presence strengthens like a muscle through use.'
          },
          {
            title: 'Attunement Requires Letting Go',
            text: 'You cannot attune while holding tightly to your plans. You must be willing to be changed by the place.'
          },
          {
            title: 'Listening Is Hard in Silence',
            text: 'Modern life is noisy. Silence can feel uncomfortable at first. Persist—your capacity to listen deepens through practice.'
          },
          {
            title: 'Flow Is Not Passivity',
            text: 'You still make decisions and take action. But you do so based on what the place reveals, not what you assume.'
          },
          {
            title: 'Your Body Knows Before Your Mind',
            text: 'If you feel uncertain, check your body. Physical sensations often carry truer information than thoughts.'
          },
          {
            title: 'These States Deepen Over Years',
            text: 'Do not expect mastery quickly. Deep place-work practitioners develop these states over decades. This is normal.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Meditation cushions and comfortable seating for extended sits',
          '"The Mindsight Institute" resources—developing attunement capacity',
          'Books on contemplative practice and deepening presence',
          '"Teaching the Wholeness of Life" by Toke Knudsen—consciousness and place',
          'Guided meditations for grounding and opening',
          'Books on active listening and receptive communication',
          'Mindfulness and meditation apps (use selectively to avoid phone distraction)',
          'Sound recordings of natural places—learning to hear place voices',
          'Books on flow states and optimal consciousness',
          'Indigenous contemplative practices specific to your region',
          'Teachers or mentors in place-based spirituality who can guide your consciousness development'
        ]
      }
    }
  }
];

export function TetheringScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const { isUnlocked, isTest } = useLocks();
  const [showLockModal, setShowLockModal] = useState(false);
  const [isPracticeLocked, setIsPracticeLocked] = useState(true);

  const checkSubscriptionAndNavigate = async (practice: any) => {
    const hasSubscription = await PurchaseService.isSubscriptionActive();
    const practiceUnlocked = isUnlocked('practiceTethering') || isTest('practiceTethering');
    const isLocked = !hasSubscription && !practiceUnlocked;
    setIsPracticeLocked(isLocked);

    if (!isLocked) {
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
  const borderColor = isDarkMode ? '#404040' : '#e0e0e0';

  const handlePracticePress = useCallback((practice: any) => {
    checkSubscriptionAndNavigate(practice);
  }, [navigation, isUnlocked]);

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>🦋 Tethering</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>Grounding, stewardship, and place-based ritual</Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {TETHERING_PRACTICES.map((practice) => (
              <TouchableOpacity
                key={practice.name}
                style={[styles.practiceItem, { backgroundColor: cardBg }]}
                onPress={() => handlePracticePress(practice)}
              >
                <Text style={styles.practiceEmoji}>{practice.emoji}</Text>
                <View style={styles.practiceInfo}>
                  <Text style={[styles.practiceName, { color: textColor }]}>{practice.name}</Text>
                  <Text style={[styles.practiceLabel, { color: mutedColor }]}>{practice.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <PracticeLockOverlay
        practiceType="Tethering"
        lockKey="practiceTethering"
        isLocked={showLockModal && isPracticeLocked}
        onUnlock={() => setShowLockModal(false)}
        onSubscribe={() => setShowLockModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 24, borderBottomWidth: 1 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: '500' },
  content: { flex: 1, padding: 16 },
  practiceStack: { gap: 12 },
  practiceItem: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, borderRadius: 12, alignItems: 'center', gap: 12 },
  practiceEmoji: { fontSize: 32 },
  practiceInfo: { flex: 1 },
  practiceName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  practiceLabel: { fontSize: 14, fontWeight: '400' },
});
