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

const CONTINUITY_PRACTICES = [
  {
    id: 1,
    name: 'Principles',
    emoji: '🧭',
    continuityEmoji: '👴',
    type: 'Continuity Foundations',
    element: 'Spirit',
    intent: 'Establish the foundational principles guiding ancestor work and lineage veneration',
    description: 'Continuity Foundations - Establish the foundational principles guiding ancestor work and lineage veneration',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🔄',
            name: 'Persistence',
            content: [
              { attribute: 'Definition', value: 'Continuity of lineage across time; ancestors remain present beyond death' },
              { attribute: 'Principle', value: 'Death does not sever the connection between living and dead; bonds persist eternally' },
              { attribute: 'Practice', value: 'Regular feeding, remembrance, and communication maintain and strengthen connection' },
              { attribute: 'Manifestation', value: 'Ancestors influence fortune, blessing, protection, and guidance in living descendants\' lives' },
            ]
          },
          {
            emoji: '👨‍👩‍👧‍👦',
            name: 'Kinship',
            content: [
              { attribute: 'Definition', value: 'Blood lineage and family obligation extending to deceased members' },
              { attribute: 'Recognition', value: 'Ancestors are family members, not abstract spirits; they retain their relationships to us' },
              { attribute: 'Mutual Obligation', value: 'Living owe ancestors honor and feeding; ancestors provide blessing and protection' },
              { attribute: 'Identity', value: 'You are extension of your lineage; honoring ancestors honors yourself' },
            ]
          },
          {
            emoji: '♻️',
            name: 'Recurrence',
            content: [
              { attribute: 'Definition', value: 'Cyclical patterns in family lines; traits, abilities, struggles repeat across generations' },
              { attribute: 'Pattern Recognition', value: 'Names, professions, talents, challenges appear in different generations' },
              { attribute: 'Healing Cycles', value: 'Addressing unhealed patterns in ancestral line benefits all generations—past, present, future' },
              { attribute: 'Blessing Cycles', value: 'Gifts and talents also recur; honoring them in ancestors activates them in descendants' },
            ]
          },
          {
            emoji: '🤝',
            name: 'Obligation',
            content: [
              { attribute: 'Definition', value: 'Sacred duty of living toward deceased lineage members' },
              { attribute: 'Core Obligation', value: 'Remember ancestors, feed them spiritually, maintain their memory, honor their legacy' },
              { attribute: 'Reciprocal Duty', value: 'Ancestors who are fed and honored return the obligation through blessing and protection' },
              { attribute: 'Generational Responsibility', value: 'Living generation serves ancestors while protecting future generations' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Persistence: The Unbreakable Bond',
            content: 'The central principle of ancestor work is persistence—the unchanging reality that death does not sever family bonds. Your ancestors are not gone; they remain part of your lineage, your family, your identity. They exist in a different form and location, but the relationship continues. This is not metaphorical or sentimental; it is core to ancestor practice. Just as your living family members influence you through genetics, behavior modeling, and love, your ancestors influence you through blessing, protection, guidance, and lineage force. Honoring this persistence through regular feeding and remembrance activates their protective presence in your life.'
          },
          {
            heading: 'Kinship: You Are Not Alone',
            content: 'You are not an isolated individual. You are the living expression of your entire ancestral line—a conduit through which your lineage continues. Your ancestors gave you life, shaped you genetically, passed to you their talents and struggles. In return, you owe them honor and remembrance. This kinship extends backward through time and forward to your future descendants. When you honor your ancestors, you honor yourself. When you heal patterns in your lineage, you create healing for generations forward. Kinship means recognizing that you belong to something larger than yourself—your family line, extending infinitely backward and forward through time.'
          },
          {
            heading: 'Recurrence: Patterns Across Generations',
            content: 'Within families, certain patterns recur. A great-great-grandmother named Mary appears again four generations later. A gift for music appears in one generation, skips the next, then emerges in grandchildren. Struggles with addiction, trauma, or mental illness repeat. Achievements and honors cluster in families. These are not coincidences. They reflect the nature of inheritance—both genetic and spiritual. The same soul-essence or energy pattern that manifested in one ancestor may manifest in descendants. By recognizing these patterns, you can honor the gifts and heal the wounds. This is why ancestor work is not just honoring the dead—it is actively transforming your family lineage.'
          },
          {
            heading: 'Obligation: The Sacred Exchange',
            content: 'Ancestor work is built on reciprocal obligation. The living owe the dead: memory, feeding, honor, and maintenance of their name and legacy. Ancestors owe the living: blessing, protection, guidance, and the gifts they have passed down through lineage. This is not punishment or burden—it is sacred exchange that benefits both. When you feed ancestors, they are satisfied and inclined toward supporting you. When you remember them, they remain present and active. When you neglect ancestors, they may become restless or dissatisfied. This is not vengeance but simple cause-and-effect: nourished ancestors are favorable ancestors. Obligation means taking your family seriously, honoring both the living and the dead.'
          },
          {
            heading: 'Integration: The Four Principles in Practice',
            content: 'These four principles work together to create meaningful ancestor work. Persistence reminds you that the bond continues forever. Kinship invites you into authentic relationship with family members, alive and dead. Recurrence helps you recognize patterns to honor and heal. Obligation calls you to regular, intentional practice—feeding, remembering, maintaining connection. Together, they establish ancestor work as serious spiritual practice grounded in real relationship, not abstract sentiment. This is why ancestors deserve the same attention and care you give living family members.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Gather basic family genealogy—parents, grandparents, great-grandparents\' names and dates',
          'Interview at least one elder about their memories of family members from earlier generations',
          'Identify which ancestors most call to you—those you feel curious or connected to',
          'Choose one specific ancestor to focus on initially rather than trying to honor the entire lineage',
          'Research that ancestor\'s life—birth place, death place, profession, family members, historical period',
          'Create a simple ancestor altar with photos, names written on paper, or meaningful objects',
          'Begin with a simple weekly or monthly feeding ritual—place food and water for ancestors',
          'Write or speak gratitude to ancestors, naming what you appreciate about their life and legacy',
          'Keep a journal recording patterns you notice in your family line and how ancestor work affects you'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Start With One Ancestor',
            text: 'Do not try to honor your entire lineage at once. Begin with one ancestor who calls to you—someone you feel drawn to or curious about. Deepen that relationship before expanding to others.'
          },
          {
            title: 'Feeding Is Not About Hunger',
            text: 'Ancestors do not hunger in the physical sense. Feeding is symbolic—it demonstrates respect, maintains connection, and creates a reciprocal flow of energy. The spiritual essence of food matters more than the quantity.'
          },
          {
            title: 'Remember Their Names',
            text: 'Names have power. Learning and speaking your ancestors\' names activates their presence and honors their individual identities. Write names down. Say them aloud. This is powerful ancestor work.'
          },
          {
            title: 'Work With Difficult Ancestors',
            text: 'Not all ancestors were good people. Some caused harm, trauma, or shame. These ancestors still deserve acknowledgment—but with appropriate boundaries. You can honor them while refusing to perpetuate their harmful patterns.'
          },
          {
            title: 'Lineage Healing Benefits Everyone',
            text: 'When you address trauma or patterns in your ancestral line, you heal not just yourself but generations before and after. This is the power of working with recurrence—your healing ripples through time.'
          },
          {
            title: 'Consistency Matters More Than Perfection',
            text: 'Regular, simple practice is more powerful than elaborate infrequent ritual. A weekly offering and moment of remembrance matters more than a grand annual ceremony.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Ancestry.com or FamilySearch.org—genealogical databases to trace your lineage',
          '"The Ancestors Within: A Practical Guide to Ancestral Work" by Christopher Penczak',
          '"Honoring the Ancestors: Explorations of Ancestral Devotion" by Linda Johnson',
          '"Women Who Run With the Wolves" by Clarissa Pinkola Estés—ancestral stories and patterns',
          'Local historical societies and libraries—family history records and community genealogy',
          '"Our Fathers" by Andrew Clark—personal meditation on ancestor relationships',
          'Genealogy forums and local genealogical societies for guidance on tracing your lineage',
          'DNA ancestry tests (23andMe, AncestryDNA) to understand geographic origins of your line',
          '"The Sacred Hoop" by Paula Gunn Allen—Indigenous perspectives on lineage and kinship',
          'Migration records and immigration documents from ancestry websites',
          'Personal journals and interviews with living family elders recording their ancestor memories'
        ]
      }
    }
  },
  {
    id: 2,
    name: 'Ontology',
    emoji: '🔮',
    continuityEmoji: '🌙',
    type: 'Continuity Foundations',
    element: 'Spirit',
    intent: 'Understand the different categories of ancestors and their distinct relationships to the living',
    description: 'Continuity Foundations - Understand the different categories of ancestors and their distinct relationships to the living',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🕊️',
            name: 'Recent Dead',
            content: [
              { attribute: 'Definition', value: 'Ancestors deceased within living memory; those still remembered by people who knew them' },
              { attribute: 'Timeline', value: 'Typically deceased within last 3-4 generations; within living human lifespan of memories' },
              { attribute: 'Connection', value: 'Strong emotional bonds remain; family stories and memories are vivid and detailed' },
              { attribute: 'Characteristics', value: 'Still oriented toward living world; interested in family affairs; relatively accessible to contact' },
              { attribute: 'Relationship', value: 'Closest and most accessible ancestors; feel most like extended family members' },
            ]
          },
          {
            emoji: '🏛️',
            name: 'Deep Dead',
            content: [
              { attribute: 'Definition', value: 'Ancient ancestors; those beyond living memory, foundational to lineage' },
              { attribute: 'Timeline', value: 'Deceased beyond living memory; ancestral founders; those from another era entirely' },
              { attribute: 'Connection', value: 'Known through genealogy and historical record rather than personal memory' },
              { attribute: 'Characteristics', value: 'Ancient, powerful, foundational; less interested in mundane family matters' },
              { attribute: 'Relationship', value: 'More archetypal; connected to lineage force itself rather than individual personality' },
              { attribute: 'Power', value: 'Carry deep wisdom, foundational support, ancestral power that roots entire lineage' },
            ]
          },
          {
            emoji: '🏠',
            name: 'Household Spirits',
            content: [
              { attribute: 'Definition', value: 'Ancestral presences specific to a particular home or dwelling place' },
              { attribute: 'Types', value: 'Ancestors who lived in a specific house; residents who died there; long-term inhabitants' },
              { attribute: 'Manifestation', value: 'More diffuse than individual ancestor spirits; presence associated with the building itself' },
              { attribute: 'Relationship', value: 'Less personal than individual ancestors; more like genius loci or house-spirit' },
              { attribute: 'Characteristics', value: 'Often protective of the home; interested in its maintenance and continuation' },
              { attribute: 'Care', value: 'Fed through offerings that honor the home; acknowledged through care for the space' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Recent Dead: The Near Ancestors',
            content: 'Recent ancestors are those still held in living memory. They are the grandparents you knew, the aunts and uncles you heard stories about, the great-grandparents your parents or grandparents still remember. These are the most accessible ancestors because they are not yet fully removed from the living world. They still take interest in family affairs, remember how things work, and feel connection to their descendants. When you need guidance on matters your grandparents would have understood, they can provide it. They are not yet fully transitioned into the ancestral realm; they hover between living and deep dead. Working with recent ancestors is like calling a family member—close, personal, responsive.'
          },
          {
            heading: 'Deep Dead: The Foundation of Lineage',
            content: 'Deep ancestors are those beyond living memory—the ancient founders of your lineage. You do not know them as people; you know them only through genealogy and historical records. These ancestors represent the deep foundation of your lineage. They carry the accumulated wisdom, power, and survival force that allowed your lineage to continue to this day. Working with deep ancestors feels different from recent ancestors. They are more archetypal, more concerned with lineage force itself than with individual family drama. They carry the power of what your lineage was meant to be. The further back you go, the more these ancestors become the living embodiment of your family\'s gifts and challenges.'
          },
          {
            heading: 'Household Spirits: The Ancestral Presence of Place',
            content: 'Not all ancestral presences are individual people. Some are the collective presence of all those who lived in a particular home. A house inhabited by many generations accumulates ancestral presence. The grandmother who died in the living room, the children who played in the bedrooms, the ancestor who built the house—all of these presences can become one household spirit or genius loci. These spirits are protective of the home and interested in its continuation. They are less interested in the living inhabitants\' personal affairs and more interested in whether the home is cared for and maintained. Household spirits are fed through offerings that honor the home itself—cleanliness, care, gifts left at the threshold.'
          },
          {
            heading: 'The Transition Between Categories',
            content: 'Ancestors move from recent dead to deep dead over generations. The grandparent you knew will eventually become the great-great-grandmother of a future descendant who never heard her name. At that point, she moves into the realm of deep ancestors—known only through genealogy, more archetypal than personal. Household spirits can merge with lineage ancestors over time. The distinction between categories is not permanent; it reflects the temporal relationship between living and dead. This is why feeding all categories is important—recent ancestors transition to deep ancestors, and your current living generation will eventually become ancestors to future generations.'
          },
          {
            heading: 'Integration: Working With All Three Categories',
            content: 'Complete ancestor practice honors all three categories. Recent ancestors provide guidance and maintain family connection. Deep ancestors provide foundational power and lineage force. Household spirits protect and maintain the sacred home space. Some ancestors may blur categories—a grandparent who lived in your family home becomes both recent dead and potential household spirit. Work with all three, allowing the specific nature of each relationship to inform your practice.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Identify one recently deceased ancestor—someone deceased within last 50 years you feel connected to',
          'Research that ancestor\'s life details—their profession, values, favorite foods, personality',
          'Create a small altar space dedicated to this recent ancestor with photo or name',
          'Research your genealogy as far back as you can trace with reasonable certainty',
          'Identify key ancestral figures from several generations back—the deep ancestors',
          'Create understanding of your family\'s ancestral origins and migrations',
          'Identify if you live in or have connection to an ancestral home with household spirit',
          'Begin offerings to recent ancestors (food, drink, incense)',
          'Begin offerings to deep ancestors (elemental offerings to earth, stones, roots)'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Recent Ancestors Feel Like Family',
            text: 'They are still oriented toward living world and family drama. Speak to them like you would speak to an elder. They respond to direct, personal conversation and remember family relationships.'
          },
          {
            title: 'Deep Ancestors Require Patience',
            text: 'They respond more slowly to petitions. They are less interested in immediate personal help and more focused on lineage wellbeing. Work with them for long-term blessings, not quick fixes.'
          },
          {
            title: 'Household Spirits Appreciate Care',
            text: 'These ancestral presences do not need elaborate rituals. They respond to cleanliness, maintenance of the home, offerings left at thresholds, and attention to the building\'s continuity.'
          },
          {
            title: 'Each Category Requires Different Engagement',
            text: 'Recent ancestors need personal communication. Deep ancestors need ritual and foundational work. Household spirits need home maintenance and care. Match your approach to the category.'
          },
          {
            title: 'Some Ancestors Bridge Categories',
            text: 'A beloved grandparent may be both a recent ancestor and a household spirit if they lived in your family home. Honor the fullness of their presence across all appropriate categories.'
          },
          {
            title: 'Work Backward and Forward',
            text: 'Connect with recent ancestors first—easier and more accessible. Then deepen work with deep ancestors as your practice matures. This creates a timeline of connection from near to deep past.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          '"Death and the Afterlife in Japanese Buddhism" by Richard Bowring—concepts of ancestral categories',
          'FamilySearch.org—genealogical records tracing deep ancestors',
          '"The Ghosts of Evolution" by Connie Barlow—understanding deep lineage',
          'Museum archives and historical societies documenting ancestral homes',
          '"Practical Work With the Dead" by Kenaz Filan—engaging different ancestor categories',
          'DNA ancestry services revealing ancestral origins and migrations',
          'House history research guides from historic preservation societies',
          'African diaspora research resources for tracing ancestors through slavery',
          '"Ancestral Voices" by Niel Price—archaeological perspectives on ancestor veneration',
          'Cemetery records and headstone inscriptions for recent ancestors',
          'Family oral history interviews and recorded elder memories documenting recent dead'
        ]
      }
    }
  },
  {
    id: 3,
    name: 'Engagement',
    emoji: '💭',
    continuityEmoji: '💬',
    type: 'Continuity Practice',
    element: 'Spirit & Air',
    intent: 'Master the primary ways to engage with ancestors: feeding, address, and consultation',
    description: 'Continuity Practice - Master the primary ways to engage with ancestors: feeding, address, and consultation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🍖',
            name: 'Feeding',
            content: [
              { attribute: 'Definition', value: 'Offering sustenance to ancestors—food, drink, incense, and energy' },
              { attribute: 'Purpose', value: 'Demonstrates respect, maintains reciprocal obligation, satisfies ancestors' },
              { attribute: 'Forms', value: 'Food, drink, incense, libations, or energetic offerings' },
              { attribute: 'Frequency', value: 'Regular—weekly, monthly, or seasonally; consistency matters more than quantity' },
              { attribute: 'Effect', value: 'Fed ancestors are pleased and inclined to support their living descendants' },
            ]
          },
          {
            emoji: '📣',
            name: 'Address',
            content: [
              { attribute: 'Definition', value: 'Speaking directly to ancestors by name, acknowledging their presence and person' },
              { attribute: 'Purpose', value: 'Activates relationship, honors individual identity, creates conversation' },
              { attribute: 'Methods', value: 'Aloud speaking, writing, singing, prayer, or ritual speech' },
              { attribute: 'Content', value: 'Gratitude, storytelling, acknowledgment of their legacy, expression of love' },
              { attribute: 'Effect', value: 'Ancestors feel seen and remembered; relationship deepens' },
            ]
          },
          {
            emoji: '❓',
            name: 'Consultation',
            content: [
              { attribute: 'Definition', value: 'Seeking guidance, wisdom, or blessing from ancestors through specific request' },
              { attribute: 'Purpose', value: 'Draws on ancestors\' knowledge and power to address living concerns' },
              { attribute: 'Methods', value: 'Petitions, oracular consultation, dream work, meditation, divination' },
              { attribute: 'Types', value: 'Practical advice, spiritual guidance, healing for inherited patterns, blessing for endeavors' },
              { attribute: 'Response', value: 'Ancestors may answer through signs, dreams, synchronicities, or direct knowing' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Feeding: Maintaining Reciprocity',
            content: 'The primary mode of engaging with ancestors is feeding. Ancestors, like the living, need sustenance. However, they consume spiritual rather than physical sustenance. When you offer food to ancestors, they do not eat the material food—they consume its spiritual essence. The physical food can later be eaten by the living, buried, or disposed of respectfully. What matters is the spiritual offering—the act of setting aside something precious and directing it toward the ancestors. Feeding demonstrates that you take your obligation seriously. It says: "You are important enough to me that I make regular offerings." Ancestors who are well-fed are well-disposed toward their descendants. They become allies and protectors. Neglected ancestors become restless or indifferent.'
          },
          {
            heading: 'Address: Speaking the Names of the Dead',
            content: 'Address means speaking directly to ancestors, using their names and acknowledging their presence as individuals. This is distinct from feeding, which is about sustenance, and consultation, which asks for something specific. Address is about relationship and recognition. It says: "I know you existed. I value you as a person. I want relationship with you beyond obligation." You can address ancestors by telling their stories, expressing gratitude, asking how they are (if you are sensitive to their response), or simply speaking about how their legacy continues through you. Address is the most human and relational mode of ancestor engagement. Through address, ancestors become not abstract obligations but beloved family members.'
          },
          {
            heading: 'Consultation: Seeking Ancestral Wisdom',
            content: 'Consultation is seeking specific help, guidance, or blessing from ancestors. This differs from feeding (which sustains) and address (which connects). In consultation, you bring a petition: advice on a decision, healing for a family pattern, blessing for an endeavor, guidance on a problem. Your ancestors possessed knowledge, wisdom, and power that their living descendants can access. A grandmother who was skilled at negotiation can offer guidance on conflicts. An ancestor who survived hardship can offer resilience and survival strategies. An ancestor who worked successfully in a particular field can offer professional guidance. Consultation honors ancestors as living sources of wisdom, not merely historical figures to remember.'
          },
          {
            heading: 'Integration: The Three Modes Together',
            content: 'Complete ancestor engagement involves all three modes. Feeding maintains the foundation of relationship and reciprocity. Address keeps individual ancestors vivid and honored. Consultation draws on their specific gifts and knowledge. You might begin with feeding (sustaining the relationship), move to address (specific ancestor becomes vivid through their story), then consultation (seeking their help with a problem). Over time, these modes become integrated—you feed ancestors regularly, address them spontaneously, and consult them as questions arise. This creates living relationship with ancestors, not abstract obligation.'
          },
          {
            heading: 'Frequency and Consistency',
            content: 'Ancestor engagement works best with consistent practice rather than intensity. A small weekly offering is more effective than an elaborate monthly ceremony. Brief daily acknowledgment of ancestors is more nourishing than weeks of neglect followed by intensive ritual. This reflects how relationship works—consistency demonstrates genuine care. Your ancestors are not impressed by rare grand gestures; they are pleased by regular, reliable attention. This consistency also trains you to remember ancestors as part of daily life, not separate religious activity. Over time, ancestor awareness becomes woven into ordinary consciousness.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Choose a regular time for feeding—weekly offering at same day and time builds consistency',
          'Select location for ancestor altar or place where you will leave offerings',
          'Decide what to offer—food, drink, or incense (match ancestor\'s tastes if known)',
          'Begin feeding practice with one recently deceased ancestor you feel close to',
          'Learn the names and basic stories of at least five ancestors across different generations',
          'Create brief spoken address for each ancestor you will honor—a few sentences acknowledging them',
          'Identify one current life situation where you would benefit from ancestral guidance',
          'Develop petition or consultation to bring to ancestors (written or memorized)',
          'Establish regular schedule: feeding weekly, address spontaneously, consultation as needed'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Start Simple With Feeding',
            text: 'Do not overthink offerings. Water, bread, and candle are sufficient. Your attention and intention matter more than the offering\'s elaborateness. Consistency matters more than perfection.'
          },
          {
            title: 'Address Requires No Special Knowledge',
            text: 'You do not need fancy language or ritual formality. Speak as you would to a beloved elder. Natural, honest speech is more powerful than elaborate ritual speech. Ancestors appreciate authenticity.'
          },
          {
            title: 'Consultation Works Best With Clear Petitions',
            text: 'Do not ask vague questions. Specify clearly what guidance you seek. Present your question to ancestors, then listen for their response through signs, dreams, or knowing.'
          },
          {
            title: 'Different Ancestors Prefer Different Engagement',
            text: 'Some ancestors respond quickly to consultation. Others prefer simple feeding without being bothered. Develop sensitivity to what each ancestor seems to want from relationship.'
          },
          {
            title: 'Feeding Often Works Better Than Consultation',
            text: 'If you are blocked or ancestors seem unavailable, often simple feeding will resolve it. Many ancestor problems stem from ancestors feeling neglected rather than unwilling to help.'
          },
          {
            title: 'All Three Modes Strengthen Each Other',
            text: 'Feeding without address becomes mechanical. Address without feeding becomes sentimental. Consultation without feeding can seem demanding. Practice all three for balanced ancestor relationship.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          '"Conversations With the Dead: Communicating With Spirit Guides and Ancestors" by Edain McCoy',
          '"The Serpent and the Well: Working With Ancestral Spirits" by K. Ombun',
          'Local historical societies offering ancestor information and family history resources',
          '"Honoring Our Ancestors" by Ava Parker Laporte—African diaspora ancestor practices',
          'Divination guides (tarot, runes, oracle) for ancestor consultation methods',
          '"Practical Work With the Dead" by Kenaz Filan—detailed engagement techniques',
          'Cemetery visits and ancestor grave-tending practices',
          'Genealogy podcasts discussing ancestor research and engagement',
          'Indigenous ancestor veneration practices from your region or heritage',
          'Published family histories and genealogies of your surname or family line',
          'Recipes and food history research to offer ancestors their favorite foods'
        ]
      }
    }
  },
  {
    id: 4,
    name: 'Conditions',
    emoji: '🔑',
    continuityEmoji: '✔️',
    type: 'Continuity Practice',
    element: 'Earth',
    intent: 'Establish the conditions and prerequisites that make ancestor work effective',
    description: 'Continuity Practice - Establish the conditions and prerequisites that make ancestor work effective',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '📋',
            name: 'Lineage Accuracy',
            content: [
              { attribute: 'Definition', value: 'Knowledge of actual family connections and truthful genealogy' },
              { attribute: 'Requirement', value: 'Knowing who your ancestors actually are, not who you wish they were' },
              { attribute: 'Importance', value: 'Accurate lineage allows proper feeding and address; mistakes confuse the work' },
              { attribute: 'Process', value: 'Research genealogy, gather family records, verify relationships where possible' },
              { attribute: 'Challenge', value: 'Some lineages are hidden (adoption, non-paternity, diaspora, rewritten history); work with what is true' },
            ]
          },
          {
            emoji: '🏡',
            name: 'Domestic Space',
            content: [
              { attribute: 'Definition', value: 'Physical space that is clean, cared for, and intentionally prepared for ancestor work' },
              { attribute: 'Requirement', value: 'A dedicated place—altar, shrine, or room—for ancestor practice' },
              { attribute: 'Importance', value: 'Ancestors need a place to gather and receive offerings; space reflects respect' },
              { attribute: 'Preparation', value: 'Cleanse space, dedicate it, keep it clean and organized' },
              { attribute: 'Challenge', value: 'Living space is not always under your control; create altar where possible' },
            ]
          },
          {
            emoji: '💭',
            name: 'Emotional Restraint',
            content: [
              { attribute: 'Definition', value: 'Ability to engage with ancestors without overwhelming emotion or unresolved trauma' },
              { attribute: 'Requirement', value: 'Emotional stability sufficient to approach ancestors with clarity, not crisis' },
              { attribute: 'Importance', value: 'Overwhelming emotion or trauma obscures clear connection; work requires presence' },
              { attribute: 'Practice', value: 'Grounding, emotional processing, and psychological work before intensive ancestor engagement' },
              { attribute: 'Reality', value: 'You do not need to be perfectly healed; you need sufficient grounding to listen clearly' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Lineage Accuracy: Knowing Your True Lineage',
            content: 'Ancestor work requires accurate knowledge of who your actual ancestors are. This seems obvious, but many people carry confusion or denial about their lineage. Maybe you do not know your biological father\'s identity. Maybe your family was adopted. Maybe you come from diaspora where family records were lost. Maybe your family history contains shameful secrets. Work with what is true. If you do not know biological lineage, work with family of choice, adoptive lineage, or ancestral lineage you claim intentionally. Accuracy does not require perfection—it requires honesty. When you know your true lineage and feed those actual ancestors, the work is powerful. When you feed imaginary ancestors or deny parts of your lineage, the work becomes weak or confused.'
          },
          {
            heading: 'Domestic Space: The Ancestor\'s Home',
            content: 'Ancestors need a place to gather and receive offerings. This does not require a large altar—a small corner, shelf, or table is sufficient. What matters is that you have designated space specifically for ancestors and that you maintain it clean and intentionally. An ancestor altar in a cluttered, disorganized space sends a message: "You are not important enough to me to maintain a clean space for you." By contrast, a small, well-tended altar communicates respect and consistency. The cleanliness and care you give to ancestor space directly reflects the relationship. Some traditions forbid eating near ancestor space, forbid negative energy or anger, or specify what can be placed on the altar. Develop your own practices that feel authentic to you, but honor the principle: ancestor space is sacred and deserves care.'
          },
          {
            heading: 'Emotional Restraint: Approaching With Clarity',
            content: 'Ancestor work requires emotional stability sufficient to listen clearly. If you are in acute crisis, severe grief, or overwhelming activation, you are not in the best state for ancestor engagement. Your emotions will dominate the experience, and you will not hear your ancestors clearly. This does not mean you must be perfectly healed—you will never reach perfect emotional health. But you need sufficient grounding that you can sit with ancestors and listen, not project your emotional needs onto them. If you approach ancestors while overwhelmed, two things happen: 1) You will not receive clear guidance because your emotion dominates, and 2) You may inadvertently call on ancestors to heal your wounds, which is not their job. The job of ancestors is to provide blessing and guidance, not therapeutic healing. You need to do your own psychological work first.'
          },
          {
            heading: 'Integration: The Three Conditions Working Together',
            content: 'Accurate lineage combined with clean space and emotional groundedness creates optimal conditions for ancestor work. You know who you are calling to (lineage accuracy), you have created a place they can gather (domestic space), and you are present enough to listen clearly (emotional restraint). Without accurate lineage, you feed the wrong ancestors or feed confused presences. Without domestic space, ancestors have nowhere to gather and the work remains abstract. Without emotional restraint, you cannot hear ancestors clearly and you project your needs onto them. These three conditions work together to create clean, effective ancestor practice.'
          },
          {
            heading: 'Working With Imperfect Conditions',
            content: 'Few people have perfect conditions. You may not fully know your lineage. You may live in a shared space where you cannot maintain an altar. You may be emotionally fragile. Begin where you are. Research lineage as you are able. Create the smallest possible altar—a photo, a candle, a stone. Ground yourself before approaching ancestors. Conditions do not need to be perfect to work with ancestors; they need to be authentic and intentional. As your practice deepens and your life stabilizes, conditions naturally improve.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Honestly assess what you know and do not know about your family lineage',
          'Research genealogy using available records—birth certificates, family documents, ancestry websites',
          'Interview living family members about ancestors and family history',
          'Acknowledge what is missing, unknown, or complicated in your lineage',
          'Find or create space in your home for ancestor altar, however small',
          'Clean and prepare chosen space with intention and care',
          'Set up altar with objects representing ancestors—photos, names, stones, candles',
          'Establish emotional baseline—notice your current emotional state and stability',
          'Practice grounding techniques (meditation, earth connection, grounding food) before approaching ancestors'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Lineage Accuracy Includes Complexity',
            text: 'Your lineage may include people you do not approve of, family members who caused harm, or relatives whose identities are mixed or unclear. Honor the complexity. Accuracy means including the difficult ancestors too.'
          },
          {
            title: 'Domestic Space Does Not Require Elaborate Altar',
            text: 'A photo on a shelf with a candle is sufficient. A name written on paper with a cup of water is sufficient. Space does not need to be beautiful or impressive—it needs to be clean and intentional.'
          },
          {
            title: 'Emotional Restraint Is Self-Care',
            text: 'Postponing ancestor work when you are overwhelmed is not avoiding the practice—it is honoring the practice enough to approach it with presence. Work with ancestors when you have emotional bandwidth.'
          },
          {
            title: 'Lineage Research Is Ongoing',
            text: 'You do not need to complete genealogy before beginning ancestor work. Start with what you know, feed those ancestors, and continue research over time. New information will emerge.'
          },
          {
            title: 'Some Missing Lineage Is Okay',
            text: 'You may never know parts of your lineage. You can still honor ancestors generally, or work with the specific ancestors you do know. Incomplete knowledge does not prevent effective practice.'
          },
          {
            title: 'Conditions Develop as Practice Deepens',
            text: 'You may begin with imperfect conditions, but as you practice consistently, the conditions naturally improve. Better altar space, clearer lineage knowledge, and greater emotional stability all develop over time.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Ancestry.com and FamilySearch.org—genealogical research platforms',
          'National Archives and Records Administration (NARA)—historical records access',
          'Ellis Island and Castle Garden databases—immigration records for ancestors',
          '"The Adoption Reunion Handbook" by Chris Dukes—non-traditional family lineage',
          'DNA ancestry tests (23andMe, AncestryDNA, MyHeritage) to verify lineage and find relatives',
          'Local libraries and historical societies—county records and family history resources',
          'Shrine design guides and books on creating home altars',
          '"The Body Keeps the Score" by Bessel van der Kolk—emotional regulation and processing',
          'Grounding techniques and somatic healing resources',
          'Books on intergenerational trauma and healing (including therapy resources)',
          'Indigenous and diaspora-specific genealogy resources for tracing lineage through colonization and displacement'
        ]
      }
    }
  },
  {
    id: 5,
    name: 'Geometry',
    emoji: '📐',
    continuityEmoji: '📍',
    type: 'Continuity Practice',
    element: 'Earth',
    intent: 'Understand and work with the sacred spaces where ancestor work occurs: hearth, grave, and altar',
    description: 'Continuity Practice - Understand and work with the sacred spaces where ancestor work occurs: hearth, grave, and altar',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🔥',
            name: 'Hearth-Center',
            content: [
              { attribute: 'Definition', value: 'The central fire or gathering place of home; where family gathers and bonds form' },
              { attribute: 'Symbol', value: 'In modern homes: kitchen, dining table, fireplace, or center gathering space' },
              { attribute: 'Ancient Practice', value: 'Ancestors gathered at household hearth; kept warm by fire; participated in family meals' },
              { attribute: 'Energy', value: 'Warm, alive, communal; place of everyday presence and participation' },
              { attribute: 'Modern Application', value: 'Altar in living space; regular family gathering; speaking ancestors\' names during meals' },
            ]
          },
          {
            emoji: '⛪',
            name: 'Grave-Edges',
            content: [
              { attribute: 'Definition', value: 'Boundaries where living meet dead; liminal space of cemetery or grave' },
              { attribute: 'Symbol', value: 'Physical grave, cemetery, place where body was buried or cremated' },
              { attribute: 'Ancient Practice', value: 'Graves marked with stones; offered food at grave sites; gathered to remember the dead' },
              { attribute: 'Energy', value: 'Liminal, transitional; direct connection between living and dead bodies' },
              { attribute: 'Modern Application', value: 'Cemetery visits; grave-tending; leaving offerings at burial sites' },
            ]
          },
          {
            emoji: '🕯️',
            name: 'Altars',
            content: [
              { attribute: 'Definition', value: 'Dedicated symbolic space within home for ancestor practice; bridge between worlds' },
              { attribute: 'Symbol', value: 'Table, shelf, corner dedicated to ancestors; holds offerings, photos, ancestral objects' },
              { attribute: 'Ancient Practice', value: 'Household shrines, ancestor niches, places marked with stones or sacred objects' },
              { attribute: 'Energy', value: 'Intentional, controlled, focused; space you create specifically for ancestor connection' },
              { attribute: 'Modern Application', value: 'Ancestor altar in bedroom, living room, or dedicated space; regular offerings and ritual' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Hearth-Center: The Living Space of Ancestors',
            content: 'The hearth is the center of family life. Historically, the hearth was the actual fireplace—the source of warmth, light, and cooking fire. Family members gathered around it. Food was prepared there. Ancestors were invited to the hearth and participated in family meals. The modern equivalent of the hearth includes the kitchen, dining table, fireplace if you have one, or the central gathering space of your home. This is where you bring ancestors into your everyday living. By placing an altar in living space rather than hidden away, by setting an extra place at the table for ancestors, by speaking their names during meals, you establish the hearth as a living space where ancestors participate with you. The hearth is warm, alive, and communal. Ancestors at the hearth are not abstract beings—they are family members present in your daily life.'
          },
          {
            heading: 'Grave-Edges: The Liminal Boundary',
            content: 'Graves are the places where bodies rest, the physical anchoring point of death. They are liminal—between living and dead, between world and underworld, between presence and absence. In many traditions, ancestors are fed and honored at graves. The cemetery is the place where you acknowledge that a person died, that a body rests there, that this location marks a boundary. Cemetery visits are powerful ancestor practice because you stand at the exact place where living and dead meet. You can touch the stone where their name is carved. You can pour offerings onto the earth above their body. You can feel their particular presence at that location. Grave-edges are not morbid—they are honest. They acknowledge death as a real transition and honor the place where it happened.'
          },
          {
            heading: 'Altars: The Intentional Bridge',
            content: 'Altars are spaces you create specifically for ancestor work—dedicated, controlled, intentional. Unlike the hearth (which is part of daily life) or graves (which are physically distant), altars are bridges that you construct in your own space. You choose what goes on the altar: photos, names, stones, candles, offerings. You decide when to use it: daily, weekly, during crisis, during celebration. Altars are under your control. You can create one, dissolve it, recreate it. They are flexible and responsive to your changing life. Yet they are also powerful because they are intentional. Every object on your altar carries meaning. Every action at your altar is deliberate. Altars in homes are where most modern ancestor work happens—they are accessible, controllable, and consistently available.'
          },
          {
            heading: 'The Three Spaces in Integration',
            content: 'Complete ancestor practice uses all three spaces. The hearth keeps ancestors alive in daily family life. Graves honor the physical body and the reality of death. Altars provide dedicated space for ritual and intentional work. Together, these three spaces create a complete sacred geometry of ancestor work: the living space where ancestors participate (hearth), the boundary space where they rest (grave), and the intentional bridge you build between (altar).'
          },
          {
            heading: 'Sacred Geometry and Spiritual Energy',
            content: 'These three spaces have different energetic qualities. Hearth energy is warm, alive, communal. Grave energy is cool, still, deep. Altar energy is focused, intentional, controlled. Working across all three spaces keeps your ancestor practice balanced—not too focused only on memory (which can become dwelling), not too focused only on ritual (which can become disconnected from real relationship), not too focused only on the grave (which can become morbid). The three spaces together create a container for living relationship with the dead.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Identify the hearth-center in your home: the main gathering space where family comes together',
          'Create ancestor altar in or near your hearth space (kitchen shelf, dining table corner, living room shelf)',
          'Begin setting extra place for ancestors during family meals or main meals',
          'Learn location of ancestors\' graves or burial sites (request records if needed)',
          'Plan cemetery visit for next available time (seasonal, birthday, anniversary)',
          'Gather information about grave locations: cemetery names, plot numbers, dates',
          'Obtain access information (cemetery hours, rules about offerings)',
          'Identify types of flowers, foods, and offerings appropriate for cemetery at your location',
          'Schedule regular pattern: hearth practice weekly/daily, altar practice regularly, grave visits seasonally'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Hearth Practice Happens Naturally',
            text: 'You do not need special ritual. Simply acknowledge ancestors as you cook, eat, and gather. Speak their names. Think of them as present. Over time, this becomes natural habit.'
          },
          {
            title: 'Cemetery Visits Create Real Connection',
            text: 'Standing at an ancestor\'s grave creates powerful connection that no altar can replicate. The grave is where their body actually rests. This directness is spiritually significant.'
          },
          {
            title: 'Altars Allow Control and Consistency',
            text: 'Unlike graves (which may be distant) or hearth (which is shared family space), your altar is yours to control. Use it for focused, intentional work.'
          },
          {
            title: 'Different Spaces Serve Different Purposes',
            text: 'Use hearth for family gathering and inclusion. Use graves for honoring rest and death. Use altars for petition and consultation. Each space has strengths.'
          },
          {
            title: 'Grave-Tending Is Honored Tradition',
            text: 'Many cultures practice cemetery visitation and grave-tending. This is not morbid—it is respectful. Your presence at the grave honors your ancestors\' memory.'
          },
          {
            title: 'All Three Spaces Strengthen Each Other',
            text: 'Hearth without altar becomes sentimental. Grave without altar becomes obligatory cemetery duty. Altar without hearth or grave becomes abstract. Practice all three for balanced work.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          '"Grave Matters: A Journey Through the Modern Funeral Industry to a Natural Place of Burial" by Mark Harris—understanding death and graves',
          'Find a Grave website (findagrave.com)—locating ancestor graves and cemetery information',
          'Your County Assessor or Records office—cemetery location and plot information',
          'Cemetery websites and records—specific plot locations and grave care rules',
          'Books on altar construction and home shrine design',
          '"Honoring Your Ancestors" by Kathie Carlson—multi-space ancestor practice',
          'Genealogy societies offering cemetery research and grave location services',
          'Cultural and religious traditions of your heritage regarding hearth, grave, and altar',
          'Photography guides for documenting ancestor graves and cemetery stones',
          'Flowers, herbs, and offering guides appropriate for cemetery and altar work',
          'Landscape architecture and sacred geometry books exploring meaning of space'
        ]
      }
    }
  },
  {
    id: 6,
    name: 'Consciousness',
    emoji: '🧠',
    continuityEmoji: '✨',
    type: 'Continuity Practice',
    element: 'Spirit',
    intent: 'Develop the inner states of mind and being needed for deep ancestor connection',
    description: 'Continuity Practice - Develop the inner states of mind and being needed for deep ancestor connection',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🕯️',
            name: 'Remembrance',
            content: [
              { attribute: 'Definition', value: 'Conscious, sustained awareness of ancestors; bringing them back into mind' },
              { attribute: 'Practice', value: 'Actively thinking of ancestors, recalling their stories, speaking their names' },
              { attribute: 'Effect', value: 'Presence strengthens through remembrance; ancestors become vivid through memory' },
              { attribute: 'Quality', value: 'Affectionate, present, intentional; unlike casual remembering' },
              { attribute: 'Power', value: 'Remembrance is the most fundamental ancestor practice; all other work flows from it' },
            ]
          },
          {
            emoji: '🌬️',
            name: 'Stillness',
            content: [
              { attribute: 'Definition', value: 'Quiet mind state receptive to ancestor presence; absence of excessive thought' },
              { attribute: 'Practice', value: 'Meditation, silence, sitting without agenda or demand' },
              { attribute: 'Effect', value: 'In stillness, ancestor presence becomes audible; messages and guidance emerge' },
              { attribute: 'Quality', value: 'Peaceful, open, receptive; mind not full of your own concerns' },
              { attribute: 'Power', value: 'Ancestors cannot be heard when you are full of noise and worry; stillness makes room for them' },
            ]
          },
          {
            emoji: '👁️',
            name: 'Recognition',
            content: [
              { attribute: 'Definition', value: 'Direct knowing of ancestor presence; the felt sense that they are real and with you' },
              { attribute: 'Practice', value: 'Paying attention to signs, synchronicities, dreams, and felt sense of presence' },
              { attribute: 'Effect', value: 'Repeated recognition builds certainty that ancestors are real and accessible' },
              { attribute: 'Quality', value: 'Knowing without proof; intuitive certainty; embodied awareness' },
              { attribute: 'Power', value: 'Recognition transforms ancestor work from belief into lived experience' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Remembrance: Making Ancestors Vivid',
            content: 'Remembrance is the foundational state for ancestor work. To remember means to make whole again, to restore to presence. When you remember ancestors, you call them back into your awareness, make their lives vivid, speak their names. Remembrance is not passive nostalgia—it is active, intentional practice. It involves details: the sound of their voice, the way they moved, what they cared about, their particular personality. Through remembrance, ancestors become real to you. They are not abstract concepts but beloved people whose lives matter. Remembrance is also a gift to ancestors. Being remembered keeps them present in the living world. Ancestors whose descendants remember them are satisfied; ancestors who are forgotten become restless. This is why telling stories, keeping names alive, and regularly thinking of ancestors is so important. Remembrance is the thread connecting living to dead.'
          },
          {
            heading: 'Stillness: The Receptive Mind State',
            content: 'Stillness is the inner quiet that makes ancestor communication possible. When your mind is full of your own concerns, worries, and chatter, there is no room for ancestor presence or guidance. But when you quiet your mind and become receptive, ancestor wisdom becomes audible. Stillness is not about achieving blank mind—that is difficult and unnecessary. Stillness is about releasing effort and agenda. It is allowing your internal noise to settle, like sediment in water. In stillness, subtle things become audible: the whisper of guidance, the knowing that arises without words, the sense of presence that does not require explanation. This is why meditation and sitting in nature are so valuable for ancestor work. They train the mind to become still enough to listen. Ancestors speak quietly. They do not shout. You must become very quiet to listen.'
          },
          {
            heading: 'Recognition: Knowing Your Ancestors Are Real',
            content: 'Recognition is the direct knowing that ancestors are real and present with you. It is the moment when you move from belief to lived experience. This recognition often comes through signs: you think of an ancestor and immediately see their favorite bird. You call out to an ancestor with a problem and receive unexpected help from a stranger. You have a vivid dream where an ancestor speaks directly to you. You sit at the altar and feel a presence so real you can almost touch it. These moments of recognition strengthen your certainty that ancestors are real. Over time, repeated recognition transforms your practice from "I believe my ancestors are present" to "I know my ancestors are present because I experience them." This knowing is the fruit of consistent practice. It cannot be forced. It develops gradually as you feed ancestors, speak to them, and remain open to their response.'
          },
          {
            heading: 'Integration: The Three States in Practice',
            content: 'These three consciousness states work together. Remembrance activates presence. Stillness makes room for it to be heard. Recognition confirms it is real. In daily ancestor practice, you move through all three: you remember your ancestor (bringing them to mind), you sit in stillness (quieting your own noise), and you recognize their presence (feeling or knowing they are with you). Over time, these states become less separate. You remember naturally. You move into stillness easily. Recognition becomes constant—a quiet certainty that ancestors are always present, always available, always participating in your life.'
          },
          {
            heading: 'Consciousness and Continuity',
            content: 'These states of consciousness are the inner work of continuity practice. While feeding, addressing, and building altars are outer practices, remembrance, stillness, and recognition are the inner consciousness that makes those outer practices meaningful. You could maintain a beautiful altar but if your consciousness is absent, the work remains mechanical. You could feed ancestors but if your mind is full of other things, the energy does not transfer. The outer and inner must work together. Develop both: feed ancestors with consistent material offerings, and cultivate the consciousness to perceive and honor their presence. This combination creates the deepest continuity with ancestors.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Begin with remembrance: spend 10 minutes daily thinking of ancestors, saying their names, recalling stories',
          'Practice meditation or sitting with simple focus: breath, sensation, or natural surroundings',
          'Start with short periods of stillness (5-10 minutes) before extending to longer practices',
          'Sit at your ancestor altar regularly, focusing on remembrance without agenda',
          'Keep journal of signs, dreams, or moments where you sense ancestor presence',
          'Notice moments of recognition when you feel ancestor presence clearly',
          'Spend time in natural places, cultivating stillness where ancestors are easily felt',
          'Combine outer practice (feeding, altar) with inner practice (remembrance, stillness, recognition)',
          'Over time, allow the three states to become integrated into daily awareness'
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Remembrance Is a Daily Practice',
            text: 'Do not wait for special occasions to remember ancestors. Bring them to mind regularly throughout your day. The more consistently you remember, the more vivid and present they become.'
          },
          {
            title: 'Stillness Does Not Require Meditation',
            text: 'If formal meditation does not work for you, find other ways to quiet your mind: sitting in nature, listening to music, walking slowly, or simple breathing. Stillness can look many ways.'
          },
          {
            title: 'Recognition Comes From Attention',
            text: 'You may miss ancestor signs if you are not paying attention. Keep your awareness open. Notice synchronicities, unexpected help, vivid dreams. These are often ancestors communicating.'
          },
          {
            title: 'These States Are Interdependent',
            text: 'You cannot have true recognition without some remembrance or stillness. Work on all three; they support each other. Weakness in one affects the others.'
          },
          {
            title: 'Ancestors Communicate Subtly',
            text: 'Do not expect dramatic visions or voices. Ancestor presence is often quiet and subtle. A sense of knowing, a warm feeling, a sudden clarity, an unexpected help—these are often ancestor presence.'
          },
          {
            title: 'Consciousness Develops Over Time',
            text: 'These states deepen with practice. Early practice may feel effortful. Over time, remembrance becomes natural, stillness comes easily, and recognition becomes constant. Patience and consistency build the states.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          '"The Ancestors Speak" by Linda Tinsley—developing ancestor communication consciousness',
          'Meditation guides and apps for developing stillness practice',
          '"The Nature of Silence" by Matthieu Ricard—scientific and spiritual understanding of quiet mind',
          'Books on dream work and dream communication with ancestors',
          '"Intuition: The Inside Track to Powerful Decision Making" by David G. Lieberman—developing intuitive recognition',
          'Nature writing (John Muir, Rachel Carson, Robin Wall Kimmerer) for accessing stillness in natural places',
          'Mantras and practices from Buddhist and Taoist traditions for cultivating stillness',
          'Books on synchronicity and meaningful coincidence (Jung, Joseph Campbell)',
          'Journaling guides for recording signs and ancestor communication',
          'Sensory awareness practices for recognizing subtle presence',
          'Contemplative prayer traditions teaching receptive listening and presence'
        ]
      }
    }
  }
];

export function ContinuityScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const { isUnlocked, isTest } = useLocks();
  const [showLockModal, setShowLockModal] = useState(false);
  const [isPracticeLocked, setIsPracticeLocked] = useState(true);

  const checkSubscriptionAndNavigate = async (practice: any) => {
    const hasSubscription = await PurchaseService.isSubscriptionActive();
    const practiceUnlocked = isUnlocked('practiceContinuity') || isTest('practiceContinuity');
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

  const handlePracticePress = useCallback((practice: any) => {
    checkSubscriptionAndNavigate(practice);
  }, [navigation, isUnlocked]);

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>🐉 Continuity</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>Ancestor work, lineage, and the persistence of family bonds across time</Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {CONTINUITY_PRACTICES.map((practice) => (
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
        practiceType="Continuity"
        lockKey="practiceContinuity"
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
