import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';
import { useLocks } from '../LocksContext';
import { PracticeLockOverlay } from '../components/PracticeLockOverlay';
import PurchaseService from '../PurchaseService';
import AppodealService from '../AppodealService';

const REGENERATION_PRACTICES = [
  {
    id: 1,
    name: 'Principles',
    emoji: '🧭',
    continuityEmoji: '♻️',
    type: 'Regeneration Foundations',
    element: 'Spirit',
    intent: 'Establish foundational principles of cyclical renewal, endings, and rebirth',
    description: 'Regeneration Foundations - Establish foundational principles of cyclical renewal, endings, and rebirth',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🔄',
            name: 'Cyclical Nature of Existence',
            content: [
              { attribute: 'Definition', value: 'All things move in cycles; death and rebirth are eternal patterns' },
              { attribute: 'Principle', value: 'Nothing ends forever; every ending contains the seed of new beginning' },
              { attribute: 'Practice', value: 'Recognize and honor the turning wheel; work with rather than against natural cycles' },
              { attribute: 'Manifestation', value: 'Seasons, moons, life stages, personal cycles all embody regenerative principle' },
            ]
          },
          {
            emoji: '🪦',
            name: 'Necessary Endings',
            content: [
              { attribute: 'Definition', value: 'Death, completion, and dissolution as essential parts of the life cycle' },
              { attribute: 'Recognition', value: 'Endings are not failures; they are prerequisites for renewal' },
              { attribute: 'Spiritual Value', value: 'Facing death and endings transforms consciousness and initiates rebirth' },
              { attribute: 'Transformation', value: 'Honoring what is ending allows what is new to emerge fully' },
            ]
          },
          {
            emoji: '🌅',
            name: 'Renewal and Becoming',
            content: [
              { attribute: 'Definition', value: 'Rebirth, restoration, and the emergence of new forms from dissolution' },
              { attribute: 'Promise', value: 'What dies returns in new form; nothing is truly lost, only transformed' },
              { attribute: 'Active Process', value: 'Regeneration requires intention, work, and alignment with seasonal and personal cycles' },
              { attribute: 'Integration', value: 'Integrating shadow self, past traumas, and old patterns fuels genuine renewal' },
            ]
          },
          {
            emoji: '⚡',
            name: 'Liminal Thresholds',
            content: [
              { attribute: 'Definition', value: 'In-between spaces where old forms dissolve and new ones have not yet solidified' },
              { attribute: 'Power', value: 'Thresholds contain raw transformative power; greatest magic happens at boundaries' },
              { attribute: 'Vulnerability', value: 'Liminal space is also dangerous; requires protection and clear intention' },
              { attribute: 'Navigation', value: 'Threshold work is the art of moving between worlds with grace and safety' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        content: 'The foundational principle underlying all regeneration work is that nothing ever truly ends—everything transforms. Death feeds life. Winter contains the seeds of spring. Personal dissolution paves the way for authentic rebirth. This is not metaphorical; it is the foundational structure of existence. When we work with regeneration, we align ourselves with this fundamental pattern and become co-creators with the turning wheel.\n\nThe path of regeneration requires us to release the fantasy of permanent achievement and instead embrace what we might call "dynamic stability"—a way of being that moves with cycles rather than trying to freeze moments we like and avoid those we don\'t. A practitioner of regeneration becomes comfortable with change, loss, and transformation, and learns to welcome the unknown that each threshold carries.\n\nCritically, regeneration work involves integrating shadow—the aspects of ourselves we\'ve rejected, denied, or suppressed. Until we make peace with our own darkness, our own destructive impulses, our own mortality, we cannot authentically step into renewal. The shadow integration that regeneration requires is not comfortable, but it is liberating.'
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Observe your own personal cycles over several months—energy, mood, creative output, relationships',
          'Identify one ending you are currently experiencing or resisting (job, relationship, belief, identity)',
          'Learn the eight festivals of the wheel of the year and observe the cycles they mark',
          'Practice one shadow integration meditation to develop comfort with this work',
          'Perform a small threshold walking meditation to cultivate skill in liminal space',
          'Notice when you resist endings or cling to what is passing; practice release',
          'Identify one belief or pattern that is ready to end; plan a ritual to mark its completion',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          { title: 'Work with the seasons', text: 'Schedule major releasing and renewal work to align with seasonal thresholds and lunar cycles' },
          { title: 'Grieve fully', text: 'Allow yourself to feel loss completely; suppressed grief blocks genuine renewal' },
          { title: 'Create clear endings', text: 'Rituals mark transitions; they tell your nervous system and spirit that something has genuinely ended' },
          { title: 'Invoke witnesses', text: 'Thresholds are safer and more powerful when moved through with community or invited allies' },
          { title: 'Watch for resistance', text: 'Where you most resist endings, the deepest growth waits; approach with courage and self-compassion' },
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Writings on cyclical time and seasonal spirituality',
          'Shadow work guides and integration practices',
          'Wheels of the year and festival traditions',
          'Personal cycle tracking and observation tools',
          'Ritual frameworks for marking transitions',
        ]
      }
    }
  },
  {
    id: 2,
    name: 'Ontology',
    emoji: '🔮',
    continuityEmoji: '⭕',
    type: 'Regeneration Foundations',
    element: 'Spirit',
    intent: 'Understand the types of cycles, thresholds, and forces that drive transformation',
    description: 'Regeneration Foundations - Understand the types of cycles, thresholds, and forces that drive transformation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🌍',
            name: 'Seasonal Cycles',
            content: [
              { attribute: 'Definition', value: 'The eight-fold wheel: four solar festivals (solstices/equinoxes) and four cross-quarter days' },
              { attribute: 'Spring (Imbolc/Ostara)', value: 'Emergence, seeds germinating, return of light, awakening of will and vision' },
              { attribute: 'Summer (Beltane/Litha)', value: 'Peak power, growth, sexuality, passion, creativity at full expression' },
              { attribute: 'Autumn (Lughnasadh/Mabon)', value: 'Harvest, gratitude, early decline, gathering and storing power for winter' },
              { attribute: 'Winter (Samhain/Yule)', value: 'Death, darkness, introspection, communion with ancestors and the deep self' },
            ]
          },
          {
            emoji: '🌙',
            name: 'Lunar Cycles',
            content: [
              { attribute: 'Full Moon', value: 'Culmination, revelation, peak power; time of manifestation and completion' },
              { attribute: 'Waning Moon', value: 'Release, banishing, letting go; power moves outward and away' },
              { attribute: 'New Moon', value: 'Darkness, renewal, new intentions; time of planting seeds and new beginning' },
              { attribute: 'Waxing Moon', value: 'Growth, building, incoming power; time of development and increase' },
              { attribute: 'Lunar Nodes', value: 'Karmic themes in your life; north node shows growth direction, south node shows old patterns' },
            ]
          },
          {
            emoji: '👤',
            name: 'Personal Life Cycles',
            content: [
              { attribute: 'Definition', value: 'Cycles of personal growth: childhood, adolescence, adulthood, elderhood; each has unique gifts and losses' },
              { attribute: 'Menstrual/Fertility Cycles', value: 'Monthly cycles mirror seasons; menarche, fertility, peri-menopause, menopause mark major thresholds' },
              { attribute: 'Seven-Year Cycles', value: 'Many traditions recognize major personal transformations occurring every seven years' },
              { attribute: 'Generational Cycles', value: 'Family patterns repeat; recognizing multigenerational cycles allows breaking harmful patterns' },
            ]
          },
          {
            emoji: '⚡',
            name: 'Liminal Thresholds',
            content: [
              { attribute: 'Dusk/Dawn', value: 'Literal thresholds between day and night; times of shifted consciousness and spirit visibility' },
              { attribute: 'Transitional Spaces', value: 'Doorways, bridges, edges of forest, shorelines—all are places of power and danger' },
              { attribute: 'Life Transitions', value: 'Birth, coming of age, marriage, elderhood, death—all require threshold passage and initiation' },
              { attribute: 'Psychological Thresholds', value: 'Moments of ego death, spiritual awakening, or major perspective shift; often feel disorienting' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        content: 'To work effectively with regeneration, we must understand the different cycles and thresholds operating in existence. The seasonal year, the lunar month, and our personal cycles all move at different frequencies, but they all operate according to the same fundamental pattern: emergence, peak, decline, death, and rebirth.\n\nThe eight festivals of the wheel of the year represent the full turn: from Samhain (October 31, death point) through Imbolc (February 1, first stirring), Ostara (spring equinox, balance with light increasing), Beltane (May 1, fire and sexuality), Litha (summer solstice, peak power), Lughnasadh (August 1, first harvest), Mabon (autumn equinox, balance with darkness increasing), and back to Samhain. Walking this wheel consciously each year trains your consciousness in the reality of regeneration.\n\nPersonal cycles—whether menstrual, seven-year, life-stage, or generational—represent the same pattern operating at different scales. When you learn to read your own cycles and work with them rather than against them, you access tremendous power and reduce suffering.\n\nThresholds are the dangerous and powerful places where transformation actually happens. Learning to navigate them consciously, with support and intention, is essential regeneration work.'
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Memorize the eight festivals and their dates; notice what they bring each year',
          'Begin lunar cycle awareness: each night, know the moon phase and what it means',
          'Start tracking one personal cycle (energy, mood, creativity, sexuality) for at least a month',
          'Identify one major threshold you are currently approaching or in',
          'Plan one action or project to begin at the next new moon',
          'Learn what sign your natal moon is in; read about your moon sign (emotional nature)',
          'Create a one-year vision of what you want to create/complete/release aligned to the seasonal wheel',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          { title: 'Track consistently', text: 'Personal cycle awareness requires at least several months of observation to see patterns' },
          { title: 'Multiple calendars', text: 'Use lunar, seasonal, and personal calendars together; they inform each other' },
          { title: 'Expect variation', text: 'Cycles are not rigid; stress, hormones, and external events shift normal patterns' },
          { title: 'Plan flexibly', text: 'Align intention to cycles, but remain adaptable when life circumstances require different timing' },
          { title: 'Teach others', text: 'Sharing cycle knowledge with family and community multiplies its power and benefit' },
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Lunar calendars and ephemerides',
          'Wheels of the year and festival traditions',
          'Personal cycle tracking tools and apps',
          'Astrology resources (birth chart, moon sign, lunar nodes)',
          'Historical and cross-cultural cycle traditions',
        ]
      }
    }
  },
  {
    id: 3,
    name: 'Engagement',
    emoji: '💭',
    continuityEmoji: '🪦',
    type: 'Regeneration Practice',
    element: 'Spirit & Fire',
    intent: 'Learn the primary modes of engaging with cycles, endings, and transformation',
    description: 'Regeneration Practice - Learn the primary modes of engaging with cycles, endings, and transformation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🎪',
            name: 'Witness and Grieve',
            content: [
              { attribute: 'Definition', value: 'The foundational mode: conscious presence with what is ending, including all emotions' },
              { attribute: 'Practice', value: 'Show up fully for endings; allow grief, rage, and loss without suppression or distraction' },
              { attribute: 'Power', value: 'Fully felt loss clears the field; suppressed grief festers and blocks renewal' },
              { attribute: 'Ritual', value: 'Create witness ceremonies: funeral rites for relationships, jobs, identities, or selves that are dying' },
            ]
          },
          {
            emoji: '🔥',
            name: 'Release and Burn',
            type: 'Clearing',
            content: [
              { attribute: 'Definition', value: 'Using fire and decisive action to transform what is ending into power and ash' },
              { attribute: 'Practice', value: 'Burn letters, journals, photos; speak things aloud and let them go; sever cords consciously' },
              { attribute: 'Power', value: 'Fire transforms; it does not preserve or diminish, but changes form entirely' },
              { attribute: 'Completion', value: 'Burning creates psychological closure and tells the nervous system: this is genuinely over' },
            ]
          },
          {
            emoji: '🌱',
            name: 'Plant and Seed',
            content: [
              { attribute: 'Definition', value: 'Beginning work: setting intention, envisioning what will grow, planting seeds of new becoming' },
              { attribute: 'Timing', value: 'Begin new work only after clearing space through release and grief' },
              { attribute: 'Clarity', value: 'Know what you are calling in; vague intention produces vague results' },
              { attribute: 'Ritual', value: 'Literal and metaphorical planting: seeds in soil, words written and buried, imagery and prayer' },
            ]
          },
          {
            emoji: '💪',
            name: 'Tend and Build',
            content: [
              { attribute: 'Definition', value: 'Active work of cultivation: feeding growth, removing obstacles, offering regular attention' },
              { attribute: 'Practice', value: 'Not all magic is dramatic; most growth requires consistent, unglamorous work' },
              { attribute: 'Attention', value: 'What we tend grows; what we neglect withers—this is true for gardens and for inner work' },
              { attribute: 'Community', value: 'Tending benefits from shared labor; some cycles require community support to see through' },
            ]
          },
          {
            emoji: '🎉',
            name: 'Harvest and Celebrate',
            content: [
              { attribute: 'Definition', value: 'Gathering the fruits of cycles completed; celebrating both success and the lessons of failure' },
              { attribute: 'Gratitude', value: 'Harvest rituals acknowledge the forces that brought the crop to fruition (sun, rain, soil, seed)' },
              { attribute: 'Humility', value: 'Harvest teaches that much is beyond our control; we participate but do not command' },
              { attribute: 'Completion', value: 'Proper harvest closes one cycle and prepares for the next' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        content: 'The primary modes of regeneration work are: witnessing and grieving what ends, releasing what is complete, planting seeds of new beginning, tending what grows, and harvesting what matures. These modes are not sequential in a rigid way; real life is messier. You might simultaneously tend one project, grieve a loss, plant seeds, and harvest a previous cycle. But understanding these as distinct modes helps you bring consciousness to whatever you are doing and do it more effectively.\n\nThe most difficult and necessary mode is witnessing and grieving. Modern culture trains us to "move on" quickly, to fill emptiness immediately, to avoid pain. But this prevents genuine closure and renewal. Real regeneration requires sitting with loss, feeling it fully, and only then moving forward. This is not indulgent; it is essential psychological and spiritual work.\n\nRelease is also undervalued. We spend enormous energy holding onto things: relationships we\'ve outgrown, beliefs that no longer serve, identities we\'ve assumed. Learning to release consciously, decisively, and with honor reduces the psychic burden we carry and frees energy for new growth.\n\nThe other modes—seeding, tending, and harvesting—are more intuitive but require consistent practice and attention. Many people can plant seeds (set intentions) but cannot tend the mundane daily work, or cannot recognize when harvest time has come.'
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Identify one thing in your life that is ready to end; practice witnessing and grieving it',
          'Plan and execute a release ritual: cord cutting, burning, or spoken completion',
          'Identify one new intention or beginning; plant it ceremonially during a new moon',
          'Choose one project or goal already underway; increase your daily tending',
          'Identify one cycle recently completed; harvest its lessons and gifts',
          'Begin naming the mode you are in: "I am grieving now. I am seeding now. I am tending now."',
          'Notice which modes feel easiest and which feel most difficult; practice the difficult ones',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          { title: 'Each phase matters', text: 'Skipping grief to get to seeding creates shallow growth; all phases have purpose' },
          { title: 'Holding grief', text: 'Grief is not enemy; it proves something mattered. Sit with it rather than escape it' },
          { title: 'Real tending', text: 'Tending is not magical thinking; it is consistent, unglamorous work—show up daily' },
          { title: 'Know ripeness', text: 'Harvest comes when fruit is ripe; too early and it is unripe, too late and it rots' },
          { title: 'Community practice', text: 'Grief and transformation are easier held in community; seek or create witness and support' },
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Grief work frameworks and resources',
          'Ritual forms for release and completion',
          'Journaling prompts for harvest and integration',
          'Support groups and communities for major transitions',
          'Mentors and guides in transformation work',
        ]
      }
    }
  },
  {
    id: 4,
    name: 'Conditions',
    emoji: '🔑',
    continuityEmoji: '⚖️',
    type: 'Regeneration Practice',
    element: 'Earth',
    intent: 'Establish the psychological, spiritual, and practical conditions required for safe and effective transformation work',
    description: 'Regeneration Practice - Establish the psychological, spiritual, and practical conditions required for safe and effective transformation work',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🏠',
            name: 'Emotional Safety and Support',
            content: [
              { attribute: 'Requirement', value: 'Transformation work requires nervous system stability; cannot do deep work in crisis' },
              { attribute: 'Support System', value: 'Identify at least one person who can witness and support difficult emotional work' },
              { attribute: 'Therapeutic Support', value: 'Consider working with therapist for shadow integration and grief processing' },
              { attribute: 'Grounding', value: 'Before beginning threshold work, establish basic stability: safe housing, food security, rest' },
            ]
          },
          {
            emoji: '🕰️',
            name: 'Time and Space',
            content: [
              { attribute: 'Sacred Space', value: 'Create physical location dedicated to practice: altar, corner, whole room' },
              { attribute: 'Uninterrupted Time', value: 'Schedule regular practice time when you will not be interrupted; consistency matters' },
              { attribute: 'Seasonal Pacing', value: 'Regeneration work goes deeper during certain seasons (autumn/winter especially); honor these rhythms' },
              { attribute: 'Retreat', value: 'Plan extended time (day, weekend, or week) for major threshold work; cannot rush transformation' },
            ]
          },
          {
            emoji: '🧠',
            name: 'Psychological Readiness',
            content: [
              { attribute: 'Self-Awareness', value: 'Know your triggers, wounds, and defense mechanisms before diving into shadow work' },
              { attribute: 'Willingness', value: 'You cannot be forced into genuine transformation; authentic work requires your choosing it' },
              { attribute: 'Humility', value: 'Recognize what you do not know; remain open to surprise and guide from forces larger than yourself' },
              { attribute: 'Discernment', value: 'Distinguish between ego resistance (which may need gentle persistence) and genuine danger signals' },
            ]
          },
          {
            emoji: '🌙',
            name: 'Spiritual Preparation',
            content: [
              { attribute: 'Invocation', value: 'Before beginning threshold work, consciously invoke guides, ancestors, and protective forces' },
              { attribute: 'Grounding', value: 'Root yourself to earth and body; dissociation and spiritual bypassing are dangers' },
              { attribute: 'Containment', value: 'Create clear ritual boundaries; open circles with intention, close them with completion' },
              { attribute: 'Integration', value: 'Allow time between major rituals for integration; do not do deep work in rapid succession' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        content: 'Regeneration work is powerful and transformative, but it is not appropriate or safe for everyone at every time. The conditions matter enormously. If you attempt major threshold work while your basic needs are unmet, while you are in acute crisis, or while you lack emotional support, you risk retraumatization rather than healing.\n\nEstablish the foundation first: basic safety and stability, reliable support system, access to professional help if needed, and honest assessment of your readiness. This seems unglamorous compared to dramatic transformation, but the unglamorous foundation work is what allows genuine, lasting transformation.\n\nEmotional safety requires both internal and external support. You need to know your own triggers and have strategies for staying grounded. You also need people—at least one person—who can hold space with you during difficult emotion. And if you have experienced significant trauma, working with a trained therapist during regeneration work is not weakness; it is wisdom.\n\nTime and space matter. Regeneration work requires uninterrupted time and a dedicated space. You cannot transform on a rushed schedule in a chaotic environment. Create conditions that honor the depth of the work.'
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Conduct honest readiness assessment; address any significant barriers',
          'Identify and contact at least one person who can support your work',
          'Create a dedicated practice space, even if small',
          'Establish regular practice time (same day/time each week)',
          'Learn and practice grounding and protection ritual',
          'Create protective circle for your practice space',
          'Plan your first threshold work once foundation is solid',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          { title: 'Foundation first', text: 'Do not skip the unglamorous safety work; it is as important as the powerful transformation work' },
          { title: 'Know your limits', text: 'Understand your window of tolerance; stay within it while building capacity' },
          { title: 'Professional support', text: 'Working with therapist or counselor is not sign of weakness; it is sign of wisdom' },
          { title: 'Gradual escalation', text: 'Begin with smaller threshold work; build capacity before attempting major transformations' },
          { title: 'Listen to resistance', text: 'Sometimes resistance is fear that needs courage; sometimes it is wisdom saying "not yet"' },
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Mental health professionals (therapists, counselors, spiritual directors)',
          'Support groups and communities',
          'Grounding and safety techniques',
          'Crisis resources and hotlines',
          'Guides on trauma-informed approaches to spiritual work',
        ]
      }
    }
  },
  {
    id: 5,
    name: 'Geometry',
    emoji: '📐',
    continuityEmoji: '🌅',
    type: 'Regeneration Practice',
    element: 'Earth & Air',
    intent: 'Learn to recognize and work with the sacred geometries and spaces where transformation happens',
    description: 'Regeneration Practice - Learn to recognize and work with the sacred geometries and spaces where transformation happens',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🌉',
            name: 'Liminal Spaces',
            content: [
              { attribute: 'Doorways and Thresholds', value: 'Literally at the boundary between two rooms; symbolically between past and future' },
              { attribute: 'Bridges', value: 'Crossing from one bank to another; one state to another; requires commitment to cross' },
              { attribute: 'Shorelines', value: 'Where land meets water; meeting of solid earth and fluid emotion; powerful transformation zones' },
              { attribute: 'Forest Edges', value: 'Where cultivation ends and wilderness begins; between known and unknown' },
              { attribute: 'Paths and Roads', value: 'Literal or metaphorical journeys; walking increases transformation power' },
            ]
          },
          {
            emoji: '🕐',
            name: 'Liminal Times',
            content: [
              { attribute: 'Dawn and Dusk', value: 'The moments between night and day; consciousness shifts; veil is thin' },
              { attribute: 'Midnight', value: 'Deepest darkness; time when soul journey and underworld work is most powerful' },
              { attribute: 'New Moon and Full Moon', value: 'Peak times of transformation; darkness and light at their extremes' },
              { attribute: 'Seasonal Thresholds', value: 'Samhain, Imbolc, Beltane, Lughnasadh mark the turning points most powerful for transition work' },
              { attribute: 'Midnight Hour of Year', value: 'From sunset Dec 31 to dawn Jan 1; the hinge of the year; supremely powerful time for new beginning' },
            ]
          },
          {
            emoji: '🌀',
            name: 'Spiral and Circular Geometry',
            content: [
              { attribute: 'The Spiral', value: 'Symbol of transformation: same path walked again and again, but at deeper level each time' },
              { attribute: 'Circle', value: 'No beginning, no end; continuous return; represents eternal cycle and wholeness' },
              { attribute: 'Labyrinth', value: 'Path that winds but leads to center; metaphor for descent into underworld and return transformed' },
              { attribute: 'Eight-Fold Wheel', value: 'Eight festivals representing complete turn; each return different from before' },
            ]
          },
          {
            emoji: '👁️',
            name: 'Heart-Center and Sacred Center',
            content: [
              { attribute: 'Heart Space', value: 'Literal and metaphorical center; place of feeling and truth; transformation happens when heart is fully present' },
              { attribute: 'Altar', value: 'Dedicated sacred center in your home; focus of power and intention' },
              { attribute: 'Ancestor Center', value: 'Place where you honor those who came before; connecting to center ground transformation in continuity' },
              { attribute: 'Earth\'s Center', value: 'Imaginatively connecting to molten heart of earth; accessing primal power and stability' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        content: 'Sacred geometry is not abstract; it is the actual structure through which transformation happens. Certain spaces—thresholds, liminal zones—contain more transformative power than others. Certain times—dawn, midnight, seasonal turning points—are more charged with possibility.\n\nThe most obvious example is the doorway or threshold. Physically, it is the boundary between two rooms. Spiritually, it is the boundary between past and future, between who you were and who you are becoming. Crossing a threshold consciously activates the transformation that threshold work enables.\n\nLiminal times—dawn and dusk, midnight, new moon and full moon, seasonal turning points—are moments when the veil between worlds is thin. Consciousness shifts; access to deeper knowledge and guides is easier. The very air feels different. Timing major transformation work to coincide with these natural power peaks makes the work more effective.\n\nThe spiral is perhaps the most powerful symbol and geometry of transformation. Unlike the circle (which returns to the same point), the spiral moves forward while circling. Each return to the same pattern happens at a different level. This perfectly describes genuine transformation: you face the same fears or patterns again, but at greater depth, with more wisdom, in the service of greater becoming.\n\nBringing your transformation work into alignment with these sacred geometries and times—walking thresholds, working at midnight, doing deep work at seasonal turning points, visualizing spirals—multiplies the effectiveness of your practice.'
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Identify threshold spaces near you: bridges, shorelines, forest edges, doorways',
          'Plan a threshold walking practice; feel the difference between before crossing and after',
          'Learn the eight festivals of the wheel of the year',
          'Plan one piece of work timed to next seasonal threshold',
          'Try a spiral descent meditation to practice underworld work safely',
          'If safe and feasible, stay awake for a midnight working; notice the shift in consciousness',
          'Mark liminal times (dusk, dawn, new moon, full moon) on your calendar for deeper practice',
          'Create an altar or dedicated sacred center in your home',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          { title: 'Physical matters', text: 'Move your body; walk thresholds, not just imagine them; embodied practice is more powerful' },
          { title: 'Timing multiplies power', text: 'Same ritual at ordinary time and at seasonal threshold have very different power; use timing' },
          { title: 'Prepare the space', text: 'Sacred geometry works best in prepared space; clean, arrange, and honor the space before working' },
          { title: 'Trust the spiral', text: 'You may revisit same patterns multiple times; each spiral level brings new understanding' },
          { title: 'Invocation matters', text: 'Clearly calling guides and witnesses into sacred space magnifies the work\'s power' },
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Maps and knowledge of threshold spaces near you',
          'Lunar calendar and seasonal dates',
          'Spiral meditation and underworld journey guides',
          'Labyrinth walking resources',
          'Sacred space creation and altar building guides',
        ]
      }
    }
  },
  {
    id: 6,
    name: 'Consciousness',
    emoji: '🧠',
    continuityEmoji: '💫',
    type: 'Regeneration Practice',
    element: 'Spirit',
    intent: 'Develop and cultivate the specific consciousness states required for transformation work',
    description: 'Regeneration Practice - Develop and cultivate the specific consciousness states required for transformation work',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🪦',
            name: 'Grief Consciousness',
            content: [
              { attribute: 'Definition', value: 'Conscious, open-hearted presence with loss; allowing feeling without resistance or distraction' },
              { attribute: 'Development', value: 'Sit with loss; feel it in your body; cry if tears come; do not escape into distraction' },
              { attribute: 'Fruit', value: 'Genuine grief clears the field; suppressed grief festers and blocks renewal' },
              { attribute: 'Skill', value: 'Learn difference between healthy grieving (temporary, moving toward acceptance) and depression (fixed, hopeless)' },
            ]
          },
          {
            emoji: '🔮',
            name: 'Witness Consciousness',
            content: [
              { attribute: 'Definition', value: 'Observing your own thoughts, emotions, patterns without judgment or identification' },
              { attribute: 'Development', value: 'Practice meditation; notice thoughts as clouds passing; feel emotions in body without believing them' },
              { attribute: 'Power', value: 'What you can observe, you are not trapped in; witness consciousness creates freedom' },
              { attribute: 'Practice', value: '"I notice I am afraid" instead of "I am afraid"; the small distance of observation creates agency' },
            ]
          },
          {
            emoji: '🌙',
            name: 'Underworld Consciousness',
            content: [
              { attribute: 'Definition', value: 'Consciousness that sees in darkness; comfortable with shadow, mystery, and what is hidden' },
              { attribute: 'Navigation', value: 'Moving through underworld requires accepting that you cannot see everything; trust other senses' },
              { attribute: 'Descent', value: 'Going down into psyche or unconscious; meeting what lives in darkness with courage and curiosity' },
              { attribute: 'Return', value: 'Coming back transformed; underworld work always involves return and integration into upper world' },
            ]
          },
          {
            emoji: '🌅',
            name: 'Renewal Consciousness',
            content: [
              { attribute: 'Definition', value: 'Open, receptive consciousness aligned with incoming possibility; willingness to become new' },
              { attribute: 'Openness', value: 'Releasing old identity; allowing yourself to be remade; vulnerable to becoming something unexpected' },
              { attribute: 'Hope and Vision', value: 'Not naive optimism, but grounded trust that renewal is possible and you can participate in it' },
              { attribute: 'Commitment', value: 'Renewal requires consistent action; not magic only, but daily tending and patient growth' },
            ]
          },
          {
            emoji: '⚖️',
            name: 'Holding Paradox',
            content: [
              { attribute: 'Definition', value: 'Consciousness that can hold two opposite truths simultaneously without needing to resolve contradiction' },
              { attribute: 'Example', value: '"I am grief and I am hope." "I am the old self dying and the new self being born." "I am lost and found."' },
              { attribute: 'Development', value: 'Move from either/or thinking (one thing or the other) to both/and thinking (one and the other together)' },
              { attribute: 'Power', value: 'Paradox consciousness allows genuine transformation; transformation requires holding old and new together before one dissolves' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        content: 'Transformation requires not just ritual action, but shifts in consciousness. The specific consciousness states you need to develop are: grief consciousness (ability to be present with loss), witness consciousness (ability to observe without identification), underworld consciousness (comfort navigating shadow and mystery), renewal consciousness (openness to becoming new), and paradox consciousness (ability to hold seeming opposites together).\n\nGrief consciousness is fundamental. Many people avoid grief work because it is uncomfortable. But suppressed grief does not disappear; it manifests as depression, numbness, or automatic behavior. Real grief is temporary and moving; when fully felt, it clears and allows renewal. Developing capacity to sit with loss without rushing through it is essential transformation skill.\n\nWitness consciousness is the observer within you that can watch your thoughts, emotions, and patterns without being controlled by them. This is foundation for all change: what you can observe, you can modify. If you are completely identified with your emotions or thoughts, you cannot change them.\n\nUnderworld consciousness means developing comfort moving in darkness—literal or metaphorical. Shadow work, grief work, and accessing unconscious material require this skill. The underworld is not evil or dangerous; it is the source of the deepest wisdom and power. But navigating it requires different consciousness than navigating the ordinary world.\n\nRenewal consciousness is the openness and hope that allows you to imagine yourself as different, to become something new. This is not naive; it is grounded in real work and real commitment. But without vision of what is possible, your transformation will be limited.\n\nFinally, paradox consciousness allows you to hold the ultimate paradox of transformation: you are both dying and being born, both ending and beginning, both grieving and hopeful. This is not confusion; it is the truth of transformation itself.'
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Establish a daily meditation practice; even 10 minutes develops witness consciousness',
          'Practice grief meditation at least weekly; allow emotions to move through you',
          'Read and speak affirmations aligned with renewal work',
          'Try one underworld journey to develop comfort with shadow work',
          'Notice your natural consciousness state; in which state are you strongest? Where is your edge?',
          'Spend time in nature observing cycles (dying leaves, new growth, water flowing) to embody transformation consciousness',
          'Journal about what renewal consciousness feels like in your body',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          { title: 'Consistency builds', text: 'Brief daily practice develops consciousness better than occasional intense work' },
          { title: 'Witness is not cold', text: 'Witness consciousness is compassionate; you are observing with love, not judgment' },
          { title: 'Grief moves', text: 'If grief feels stuck, that is resistance, not grief; stay with it without judgment' },
          { title: 'Trust your pace', text: 'Some transformations take months or years; trust that the process unfolds at the right pace' },
          { title: 'Embody the states', text: 'Do not just think about these consciousness states; feel them in your body; sensation grounds transformation' },
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Meditation guides and apps for developing witness consciousness',
          'Affirmation collections and journaling prompts',
          'Underworld journey guides and visualization resources',
          'Grief work resources and ceremonies',
          'Teachers of contemplative consciousness practices',
        ]
      }
    }
  },
];

export function RegenerationScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const { isUnlocked, isTest } = useLocks();
  const [showLockModal, setShowLockModal] = useState(false);
  const [isPracticeLocked, setIsPracticeLocked] = useState(true);

  const checkSubscriptionAndNavigate = async (practice: any) => {
    const hasSubscription = await PurchaseService.isSubscriptionActive();
    const practiceUnlocked = isUnlocked('practiceRegeneration') || isTest('practiceRegeneration');
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
          <Text style={[styles.title, { color: textColor }]}>🐍 Regeneration</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>Renewal through shadow integration, endings, and rebirth rituals</Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {REGENERATION_PRACTICES.map((practice) => (
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
        practiceType="Regeneration"
        lockKey="practiceRegeneration"
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
