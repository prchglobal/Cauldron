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
    name: '🔱 Luciferian Magick 🔱',
    isSpacer: true,
  },
  {
    name: 'Shadow Integration',
    emoji: '👤',
    description: 'Embrace the shadow self - Personal sovereignty through self-knowledge',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding',
            categories: [
              { name: 'The Shadow Self', emoji: '🌑', content: [
                { attribute: 'Definition', value: 'Everything society, religion, and conditioning taught you to deny, suppress, or be ashamed of. The disowned parts of your psyche contain power, authenticity, and knowledge.' },
                { attribute: 'Composition', value: 'Desires condemned as selfish, instincts labeled as base, emotions suppressed as unspiritual, intelligence rejected as dangerous, sexuality deemed evil, will branded as prideful' },
                { attribute: 'Power', value: 'The shadow contains raw life force, creative potential, and authentic self. Luciferian work reclaims this power consciously rather than projecting it onto others.' },
                { attribute: 'Integration', value: 'Shadow integration means: acknowledging what you\'ve rejected, understanding why you rejected it, reclaiming its power for your own use, maintaining conscious control rather than being controlled by disowned impulses' },
                { attribute: 'Practice', value: 'Work involves: brutal self-honesty, examining shame, challenging internalized prohibitions, testing forbidden impulses safely, claiming your own desires and needs as valid' },
              ]},
              { name: 'Luciferian Illumination', emoji: '💡', content: [
                { attribute: 'Meaning', value: 'Lucifer = Light-Bringer. Illumination means seeing clearly what has been hidden from you, both externally (truth about power structures) and internally (truth about yourself).' },
                { attribute: 'Knowledge', value: 'The forbidden knowledge that religions fear: that you have power, that your will matters, that questioning is sacred, that pleasure is not sinful, that you are divine' },
                { attribute: 'Function', value: 'Illumination reveals the machinery of control—how power is maintained through prohibition, fear, shame, and false morality. This knowledge frees you.' },
                { attribute: 'Liberation', value: 'With illumination comes liberation from imposed beliefs. You can then choose consciously what to accept or reject, rather than unconsciously obeying.' },
                { attribute: 'Responsibility', value: 'Illumination comes with responsibility: to think for yourself, to take responsibility for your choices, to respect others\' sovereignty as you claim your own' },
              ]},
              { name: 'Self-Deification', emoji: '👑', content: [
                { attribute: 'Principle', value: 'You are not meant to worship external gods or authority. You are meant to develop the divine potential within yourself to its fullest expression.' },
                { attribute: 'Practice', value: 'Treat yourself as sacred: honor your body, respect your needs, develop your potential, trust your instincts, pursue your authentic desires, make decisions based on your will' },
                { attribute: 'Authority', value: 'Claim authority over your own life. No external entity—religious, governmental, or otherwise—should control your body, mind, or choices without your informed consent.' },
                { attribute: 'Aspiration', value: 'Aspire to become the best possible version of yourself: wise, powerful, authentic, unbounded by fear, capable of manifesting your will in the world' },
                { attribute: 'Path', value: 'Self-deification is achieved through: knowledge, power development, authentic expression, deliberate will cultivation, refusing victimhood, taking command of your life' },
              ]},
            ]
          },
          {
            name: 'Techniques',
            tabs: [
              {
                name: 'Voice Dialogue & Active Imagination',
                categories: [
                  { name: 'Voice Dialogue & Active Imagination', emoji: '🎭', content: [
                    { attribute: 'Technique Overview', value: '🎭 TECHNIQUE\nIdentify one shadow aspect (anger, sexuality, ambition, desire, selfishness, pride). Speak to it as if it is a separate being.' },
                    { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Set aside 20 minutes. Journal or speak aloud.\n(2) Address shadow directly: "Angry part, I want to hear you. What do you need? What is your message?"\n(3) Let it speak through you WITHOUT CENSORING. Write/speak what comes.\n(4) Dialogue continues: You ask, it answers, you respond. This is not imagination—it is accessing a real part of yourself.\n(5) Listen with compassion, not judgment.' },
                    { attribute: 'Results & Frequency', value: '✅ RESULT\nAfter 3-5 dialogues, the shadow part feels acknowledged. Integration begins.\n\n⏱️ FREQUENCY\nWeekly for 6 weeks minimum.' },
                    { attribute: 'Effects', value: '💥 EFFECTS\nAnger becomes accessible power. Sexuality becomes creative flow. Ambition becomes authentic direction. Selfishness becomes healthy self-care.' },
                  ]},
                ]
              },
              {
                name: 'Shadow Journaling & Confession',
                categories: [
                  { name: 'Shadow Journaling & Confession', emoji: '📝', content: [
                    { attribute: 'Technique Overview', value: '📝 TECHNIQUE\nWrite uncensored truths about yourself. No filters. Complete honesty.' },
                    { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Set 20 minutes.\n(2) Prompt yourself: "What do I ACTUALLY want that I pretend I do not?"\n(3) Write everything. No judgment. Complete permission to admit desires you have denied.\n(4) Write about:\n    • Desires you have suppressed\n    • Things you have done you are ashamed of\n    • Anger you are holding\n    • Pride you pretend you do not have\n    • Selfishness you deny\n    • Needs you are ashamed of\n(5) After writing, read it aloud if possible. Hearing yourself admit these truths is powerful.\n(6) Safely destroy the journal (burn it, shred it). Destruction ritual releases shame.' },
                    { attribute: 'Frequency & Effects', value: '⏱️ FREQUENCY\nWeekly for 8 weeks.\n\n💥 EFFECTS\nShame dissolves. Authenticity increases. Energy tied up in denial becomes available. Self-acceptance develops.' },
                  ]},
                ]
              },
              {
                name: 'Shadow Embodiment & Testing',
                categories: [
                  { name: 'Shadow Embodiment & Testing', emoji: '🎭', content: [
                    { attribute: 'Technique Overview', value: '🎭 TECHNIQUE\nSafely embody shadow aspects and test them.' },
                    { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Choose shadow: anger, sexuality, selfishness, desire, pride, ambition.\n(2) Decide safe context: alone at home, in private journal, with trusted partner.\n(3) BECOME it temporarily: Act as that part with full intensity for 5-30 minutes.\n(4) Expression by aspect:\n    • If anger: allow yourself to express rage (hit pillows, yell, growl)\n    • If sexuality: move sensually, explore your body, feel desire\n    • If selfishness: practice asking for what you want without apology\n    • If pride: stand proud, speak your achievements, take up space\n(5) After 5-30 minutes, consciously release it. Return to normal.\n(6) Journal: What did you learn? What did that part need?' },
                    { attribute: 'Frequency & Safety', value: '⏱️ FREQUENCY\nWeekly, rotating through different shadow aspects.\n\n🛡️ SAFETY\nAlways practice in private or with consenting partners. Embodiment is safe internal practice.' },
                    { attribute: 'Effects', value: '💥 EFFECTS\nShadow aspects become integrated. They cannot control you if acknowledged. Over time, shadow becomes ally rather than enemy.' },
                  ]},
                ]
              },
              {
                name: 'Shame Dissolution & Reclamation Ritual',
                categories: [
                  { name: 'Shame Dissolution & Reclamation Ritual', emoji: '🕯️', content: [
                    { attribute: 'Technique Overview', value: '🕯️ TECHNIQUE\nDeliberately reclaim something you were taught to be ashamed of.' },
                    { attribute: 'Protocol', value: '📋 PROTOCOL\n(1) Identify one shame: sexuality, desire, anger, ambition, selfishness, body part, instinct.\n(2) Create ritual: Light candle.\n(3) Speak aloud what you were taught: "I was taught that my sexuality is shameful."\n(4) Counter-claim: "I reclaim my sexuality as sacred. I honor my body\'s power and pleasure."\n(5) Act it out:\n    • If reclaiming sexuality: move sensually\n    • If reclaiming anger: express it fiercely\n    • If reclaiming desire: speak your wants\n(6) Acknowledge: "This is mine. I claim it. It is good."\n(7) Close ritual: Blow out candle. Ground yourself.' },
                    { attribute: 'Frequency & Effects', value: '⏱️ FREQUENCY\nMonthly for each shame being reclaimed.\n\n💥 EFFECTS\nShame loosens grip. Authenticity emerges. Power previously bound in suppression becomes available. Integration deepens.' },
                  ]},
                ]
              },
            ]
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'The Shadow Is Not Evil—It Is Power', content: 'Religions and controlling systems demonize natural human instincts: desire, curiosity, sexuality, anger, ambition, pride. They label these as evil so you\'ll suppress them and remain manageable. The Luciferian path recognizes that these forces aren\'t evil—they\'re human, they\'re powerful, and they\'re yours to command. Anger can fuel necessary change. Sexuality is sacred power. Ambition drives creation. Pride in your abilities is healthy. Curiosity leads to truth. When you integrate your shadow, you aren\'t becoming evil—you\'re becoming whole.' },
          { heading: 'Lucifer as the Teacher', content: 'In most traditions, Lucifer is the Adversary—the one who says "no" to unjust authority. This is not evil; this is necessary. A teacher who always agrees with you teaches nothing. An authority that cannot be questioned is a tyrant. Lucifer\'s role is to question dogma, challenge comfortable lies, and offer knowledge that liberates. The Luciferian path follows this principle: question everything, test all teachings against your own experience, trust your own observation over received wisdom.' },
          { heading: 'Personal Sovereignty and Responsibility', content: 'The highest Luciferian principle is personal sovereignty: you are the authority of your own life. This is exhilarating and terrifying because it means you cannot blame others for your circumstances. You must take responsibility for your choices, your power, and your direction. This is not cruelty—it\'s liberation. You cannot be enslaved unless you surrender your will. You cannot be controlled unless you accept control. Your freedom is your responsibility.' },
          { heading: 'Knowledge as Transgression', content: 'Dominant power structures control populations through ignorance and misinformation. Knowledge is transgressive—it breaks the spell. Reading forbidden books, asking dangerous questions, testing sacred cows, speaking truth that authority denies—these are all Luciferian acts. The pursuit of knowledge is not rebellion against goodness; it\'s rebellion against those who profit from your ignorance.' },
          { heading: 'Pleasure as Sacred', content: 'Religious systems demonize human pleasure to control reproduction, sexuality, and power. The Luciferian path recognizes pleasure as sacred: physical pleasure, intellectual pleasure, spiritual pleasure, creative pleasure. To deny pleasure is to deny life itself. Conscious enjoyment of pleasure—without harming others—is an act of spiritual practice. Your body is not a prison; it\'s an instrument of experience.' },
          { heading: 'The Path of Self-Initiation', content: 'In Luciferian practice, you are both student and teacher, initiate and initiator. There is no savior coming to enlighten you. You must educate yourself, challenge yourself, transform yourself through deliberate action. This path is harder than obedience—it requires constant choice, constant responsibility—but it is real power. You become who you choose to become.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Identify what you were taught to be ashamed of: list desires, instincts, traits deemed shameful or sinful',
          'Journal on origins: why were you taught these things were wrong? Who benefits from your shame?',
          'Research alternative perspectives: find sources that contradict the prohibitions you learned',
          'Test forbidden knowledge safely: what happens if you question one prohibition? What becomes possible?',
          'Reclaim one denied aspect: choose something small you were told not to do or feel, and claim it consciously',
          'Study your own power: observe situations where you gave your power away and where you claimed it',
          'Create a personal sovereignty practice: daily decision-making that reflects your own values, not external shoulds',
          'Develop critical thinking: practice questioning all claims, testing against evidence, thinking for yourself',
          'Write your own morality: what values do YOU hold? What would YOUR ethics be without imposed doctrine?',
          'Live one choice courageously: make one decision based purely on your authentic will, not on fear or approval-seeking'
      ],
      },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Shadow Integration Takes Honesty', text: 'You cannot integrate what you refuse to acknowledge. Be brutally honest with yourself about your actual desires, not your approved desires. Shadow work requires courage.' },
          { title: 'Freedom Means Responsibility', text: 'Claiming your power means claiming full responsibility for your choices. You cannot blame others, God, or fate for your life. This is the weight and the gift of sovereignty.' },
          { title: 'Transgression Is The Point', text: 'If your spiritual practice never challenges you, never makes you question, never asks you to break a prohibition—it\'s not Luciferian. Healthy transgression against unjust authority is core practice.' },
          { title: 'Authenticity Over Perfection', text: 'The Luciferian path values authentic expression over spiritual perfection. Your real self, with all its flaws and desires, is more valuable than a sanitized version.' },
          { title: 'Knowledge Liberation', text: 'Every time you learn something that contradicts what you were taught, you become more free. Embrace the discomfort of your worldview changing. This is growth.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Satanic Bible by Anton LaVey (self-deification principles)',
          'The Book of Shadows by S. Ben Qayin (Luciferian gnosis)',
          'The Devil\'s Apologists by Wallace-Murphy & H.J. Hopkins',
          'Jungian shadow work: books on the Shadow by Robert Moore',
          'Books on cognitive liberty and questioning authority'
        ],
      },
    },
  },
  {
    name: 'Archetype Meditation',
    emoji: '🗿',
    description: 'The Luciferian Archetypes - The Adversary, the Liberator, the Shadow Initiator',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Archetypes',
            categories: [
              { name: 'The Adversary', emoji: '⚡', content: [
                { attribute: 'Nature', value: 'The Adversary says "no" to unjust authority. This archetype challenges dogma, questions doctrine, refuses submission to false gods.' },
                { attribute: 'Function', value: 'Opposition to tyranny and control. The Adversary teaches that questioning is sacred, rebellion against oppression is virtue, and freedom requires courage.' },
                { attribute: 'Power', value: 'Intellectual clarity, strategic thinking, the power to discern truth from propaganda, the ability to say no and mean it absolutely.' },
                { attribute: 'Expression', value: 'Direct confrontation of lies, fearless questioning, refusal to accept comfortable myths, willingness to be cast as villain for speaking truth.' },
                { attribute: 'Integration', value: 'Cultivate healthy skepticism, develop critical thinking, practice saying no to things that don\'t serve you, build intellectual independence.' },
              ]},
              { name: 'The Liberator', emoji: '🔓', content: [
                { attribute: 'Nature', value: 'The Liberator breaks chains—psychological, spiritual, physical. This archetype embodies freedom, the breaking of constraints, and the opening of locked doors.' },
                { attribute: 'Function', value: 'Freedom through knowledge and power. The Liberator reveals what has been hidden, provides keys to escape, offers the knowledge that opens cages.' },
                { attribute: 'Power', value: 'Illumination that reveals escape routes, destruction of false limits, creation of new possibilities where none seemed to exist.' },
                { attribute: 'Expression', value: 'Offering forbidden knowledge, revealing hidden truths, showing others their own power, helping people see they are not actually trapped.' },
                { attribute: 'Integration', value: 'Free yourself from internalized constraints, help others recognize their own power, offer genuine knowledge without agenda, champion authentic freedom.' },
              ]},
              { name: 'The Shadow Initiator', emoji: '🖤', content: [
                { attribute: 'Nature', value: 'The Shadow Initiator guides through the underworld of self-knowledge. This archetype knows that true wisdom comes through facing what terrifies you.' },
                { attribute: 'Function', value: 'Transformation through death and rebirth. The Shadow Initiator does not protect you from difficulty—it requires you to pass through fire.' },
                { attribute: 'Power', value: 'The power to transform through ordeal, to alchemize suffering into wisdom, to initiate real change (not comfortable change).' },
                { attribute: 'Expression', value: 'Confronting difficult truths, requiring authentic effort for real results, refusing to coddle or make paths easy, demanding growth.' },
                { attribute: 'Integration', value: 'Embrace necessary difficulty, use challenges for growth, face your shadow consciously, initiate yourself rather than waiting to be saved.' },
              ]},
            ]
          },
          {
            name: 'Techniques',
            categories: [
          { name: 'The Adversary Meditation', emoji: '⚡', content: [
            { attribute: 'Duration & Overview', value: '⏱️ 15-20 minutes meditation + 30 minutes embodiment\n\nThe Adversary teaches intellectual freedom. This meditation awakens the questioning mind and builds discernment. Follow with embodiment practice to integrate the principle into daily life.' },
            { attribute: 'Meditation Script', value: '🧘 PROTOCOL (15-20 minutes)\n(1) Close eyes. Ground yourself. Feel earth beneath\n(2) Call to mind a belief you\'ve never questioned. Notice without judgment\n(3) Ask internally: "Is this actually true? Or do I accept it because I was taught to?"\n(4) Visualize The Adversary—sharp-eyed, fearless, questioning everything. Feel presence\n(5) Speak internally: "Teach me. What truth am I avoiding? What comfortable lie?"\n(6) Listen. Let images, words, knowing arise without censoring\n(7) Ask: "What would change if I questioned this belief completely?"\n(8) Sit with realization. Feel awareness shift\n(9) Slowly return. Ground. Open eyes' },
            { attribute: 'Embodiment Practice', value: '🎭 AFTER MEDITATION (30 minutes)\nEmbody The Adversary:\n• Question everything you normally accept—don\'t challenge rudely, but ask real questions\n• Speak one truth usually kept silent—in safe context, be radically honest\n• Challenge comfortable assumptions—examine reasons behind accepted ideas\n• Notice how world looks through questioning eyes—this shift in perspective is the point\n\n💡 TIP: Embodiment means living the principle, not just thinking about it. Act as The Adversary would.' },
            { attribute: 'Frequency & Effects', value: '📊 FREQUENCY: Weekly for 4 weeks minimum\n\n✨ EFFECTS\n• Intellectual freedom increases\n• Comfortable lies lose power\n• Critical thinking strengthens\n• Mind becomes sharper and more discerning\n• Ability to identify propaganda and manipulation improves\n• Confidence in own judgment increases' },
          ]},
          { name: 'The Liberator Meditation', emoji: '🔓', content: [
            { attribute: 'Duration & Overview', value: '⏱️ 15-20 minutes meditation + 30 minutes embodiment\n\nThe Liberator breaks chains and opens doors. This meditation reveals limitations and opens consciousness to freedom. Embodiment means claiming freedoms previously denied.' },
            { attribute: 'Meditation Script', value: '🧘 PROTOCOL (15-20 minutes)\n(1) Close eyes. Ground yourself. Feel body solid and present\n(2) Bring to mind a limitation accepted as unchangeable. Belief, circumstance, or constraint you assume is permanent\n(3) Visualize The Liberator—free, unbound, showing escape routes unseen. Feel presence\n(4) Speak internally: "Show me what\'s possible. What freedom am I not claiming? What cage have I accepted?"\n(5) Let visions arise. See yourself free. See possibilities opening. Feel freedom flood through\n(6) Ask: "What would I do if limitation didn\'t exist? What am I actually capable of?"\n(7) Feel answer in body. Feel aliveness, potential, actual freedom\n(8) Slowly return. Ground. Open eyes' },
            { attribute: 'Embodiment Practice', value: '🎭 AFTER MEDITATION (30 minutes)\nEmbody The Liberator:\n• Make one decision based purely on freedom (not fear or approval)\n• Do something normally restricted (within ethical bounds)\n• Speak desire normally suppressed—claim wants as valid\n• Move freely, take up space, claim what you want\n• Notice what opens when you stop constraining yourself\n\n💡 KEY: The Liberator doesn\'t destroy responsibility, it removes false limits. Real freedom includes ethics.' },
            { attribute: 'Frequency & Effects', value: '📊 FREQUENCY: Weekly for 4 weeks minimum\n\n✨ EFFECTS\n• Freedom becomes tangible and real\n• Limitations lose their grip on consciousness\n• Self-imposed boundaries dissolve\n• Authentic desires emerge clearly\n• Capability expands\n• Life becomes more authentic' },
          ]},
          { name: 'The Shadow Initiator Meditation', emoji: '🖤', content: [
            { attribute: 'Duration & Overview', value: '⏱️ 15-20 minutes meditation + 1 hour integration\n\n⚠️ INTENSE WORK—Prepare yourself. The Shadow Initiator brings transformation through difficulty. This meditation opens doors to real change, which requires courage and commitment.' },
            { attribute: 'Meditation Script', value: '🧘 PROTOCOL (15-20 minutes)\n(1) Close eyes. Ground deeply. Feel roots going down\n(2) Bring to mind transformation avoided because terrifying. Truth known but unfaced. Change known but resisted\n(3) Visualize Shadow Initiator—dark, fierce, demanding, uncompromising. No softness. Feel presence\n(4) Speak internally: "I am ready to face what I\'ve avoided. Show me what I need to know"\n(5) Let difficult truths arise. Don\'t look away. See clearly what\'s been denied. Feel fear and let it be\n(6) Ask: "What would transformation cost? What release? What must I become?"\n(7) Feel answer. Feel death of who you\'ve been. Feel emergence of new self\n(8) Sit in liminal space—death/rebirth point. Feel transformation happening now\n(9) Slowly return. Ground. Take time. Open eyes only when ready' },
            { attribute: 'Integration Practice', value: '🎭 AFTER MEDITATION (1 hour minimum)\nIntegrate the initiation:\n• Take one action toward transformation identified (even if difficult)\n• Make one choice from the new reality you glimpsed\n• Face one fear directly (not recklessly, but truly)\n• Do NOT comfort yourself or retreat—the initiation requires you to proceed\n• Journal: What did you learn? What are you becoming?\n\n⚠️ IMPORTANT: This is not casual practice. You are initiating real change.' },
            { attribute: 'Frequency & Effects', value: '📊 FREQUENCY: Monthly (not weekly—this is intense work)\n\n✨ EFFECTS (Real, Significant Change)\n• Real transformation occurs\n• Illusions shatter\n• False identities dissolve\n• Authentic power emerges\n• Wisdom deepens through facing difficulty\n• Life reorganizes around new authenticity\n• Permanent development accelerates' },
          ]},
          { name: 'Unified Archetype Practice', emoji: '🌟', content: [
            { attribute: 'Overview & Progression', value: '🎯 ADVANCED PRACTICE\nAfter meditating on each archetype separately (4 weeks each), integrate all three into unified practice.\n\n📈 PROGRESSION TIMELINE\n• Week 1-4: Master The Adversary alone\n• Week 5-8: Master The Liberator alone\n• Week 9-12: Master The Shadow Initiator alone\n• Week 13+: Integrate all three into unified practice\n\nTotal: Minimum 3 months before full integration' },
            { attribute: 'Unified Meditation', value: '🧘 PROTOCOL (30-45 minutes total, quiet space)\n\n(1) Meditate on all three sequentially:\n   • THE ADVERSARY: Question reality. Ask "What truth am I avoiding?"\n   • THE LIBERATOR: See freedom. Ask "What freedom am I not claiming?"\n   • THE SHADOW INITIATOR: Face transformation. Ask "What am I becoming?"\n\n(2) Notice how three principles interact:\n   • Questioning reveals limited thinking\n   • Freedom reveals actual possibilities\n   • Transformation actualizes new reality\n\n(3) Feel all three working together in consciousness' },
            { attribute: 'Integrated Embodiment', value: '🎭 EMBODIMENT (30 minutes minimum)\nEmbody all three simultaneously:\n\n• Question comfortably accepted things (ADVERSARY) — discern what\'s actually true\n• Claim freedom in decisions (LIBERATOR) — choose authentically, not from fear\n• Take genuine action toward transformation (SHADOW INITIATOR) — implement real change\n\nThese three don\'t conflict—they work synergistically:\n• Questioning without freedom = cynicism\n• Freedom without questioning = chaos\n• Either without transformation = no real change\n• All three together = psychological wholeness' },
            { attribute: 'Integration Results', value: '⭐ AFTER 3+ MONTHS OF PRACTICE\n\nYou become psychologically whole:\n• Question without cynicism\n• Claim freedom without chaos\n• Transform without self-destruction\n• Embody all three archetypes naturally\n• Think for yourself, create your own freedom, continually transform\n• Live as a self-directed, authentic person\n\n🎯 FINAL RESULT: The three archetypes become natural expressions of your consciousness, not practices you do. You become the Luciferian ideal: self-authored, genuinely free, continuously evolving.' },
          ]},
        ]
      }
    ]
  },
  knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Luciferian Archetypes as Inner Teachers', content: 'These three archetypes—the Adversary, the Liberator, and the Shadow Initiator—are not external beings but aspects of your own consciousness. They represent principles you can activate and embody. The Adversary within you questions authority (including your own false authorities). The Liberator within you breaks free from constraint. The Shadow Initiator within you transforms through difficulty. Archetypal meditation means identifying with these principles and letting them teach you.' },
          { heading: 'The Adversary: Intellectual Sovereignty', content: 'The Adversary teaches that questioning is sacred. Every belief you hold should be tested against reality, every authority should earn your respect through demonstrated wisdom, every dogma should be questioned. The Adversary is not destructive—it\'s discerning. It says no to what is false, unjust, or limiting. Cultivate the Adversary within by: practicing critical thinking, questioning comfortable assumptions, demanding evidence before belief, refusing to accept authority without question, speaking truth even when unpopular.' },
          { heading: 'The Liberator: Freedom Through Knowledge', content: 'The Liberator brings light to darkness and knowledge to ignorance. What keeps you enslaved is not actual chains but lack of knowledge and awareness. The Liberator teaches that freedom comes through understanding: of yourself, of how power works, of your own capabilities. With knowledge comes choice; with choice comes freedom. Cultivate the Liberator by: seeking hidden knowledge, studying what authorities fear, learning skills that increase your independence, helping others see their own power, creating actual freedom in your life through effort.' },
          { heading: 'The Shadow Initiator: Transformation Through Ordeal', content: 'The Shadow Initiator teaches that real change is not comfortable. Initiation means death to the old self and rebirth as something new. This requires facing what terrifies you, acknowledging what you\'ve denied, and choosing to change despite the difficulty. The Shadow Initiator does not rescue—it demands you become worthy of your own goals. Cultivate the Shadow Initiator by: facing what you fear, accepting the cost of transformation, using difficulty as opportunity for growth, refusing to play small, taking responsibility for your evolution.' },
          { heading: 'Integration: Becoming Complete', content: 'The three archetypes work together to create psychological wholeness. The Adversary questions and discerns. The Liberator opens doors and reveals possibilities. The Shadow Initiator demands you walk through those doors and grow. Together they represent mature self-authority: you think for yourself, you create your own freedom, you continually transform. This is the Luciferian path—not following anyone else\'s vision, but becoming the architect of your own consciousness.' },
      ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Identify which archetype you most resist or fear—that\'s your starting point for growth',
          'Meditate on the Adversary: sit quietly and ask "What truths am I avoiding? What do I refuse to question?"',
          'Meditate on the Liberator: sit quietly and ask "What limitations have I accepted as unchangeable? What freedom am I not claiming?"',
          'Meditate on the Shadow Initiator: sit quietly and ask "What transformation am I avoiding? What difficulty am I not willing to face?"',
          'Journal responses without censoring yourself—brutal honesty is required',
          'Choose one area where you want to embody the Adversary: identify one belief you\'ve never really questioned',
          'Choose one area where you want to embody the Liberator: identify one self-imposed limitation you can break',
          'Choose one area where you want to embody the Shadow Initiator: identify one transformation that scares you',
          'For each archetype, practice daily for one lunar cycle (29 days), invoking that principle in your actions',
          'After 3 cycles, notice how these archetypes have integrated into your personality'
      ],
      },
      tips: { title: 'Tips for Practice', items: [
        { title: 'These Are Inner Archetypes', text: 'You are not invoking external beings but activating your own potential. The Adversary, Liberator, and Shadow Initiator are all YOU, expressing through different capacities.' },
        { title: 'All Three Are Necessary', text: 'Don\'t just embody the Liberator (freedom without discernment creates chaos). Don\'t just be the Adversary (questioning without vision becomes cynicism). Balance all three.' },
        { title: 'Resistance Indicates Growth Edge', text: 'If an archetype makes you deeply uncomfortable, that\'s your edge. Lean into discomfort—that\'s where transformation happens.' },
        { title: 'Practice In Daily Life', text: 'These aren\'t just meditation exercises. Practice being an Adversary in conversations, a Liberator in your decisions, a Shadow Initiator in your challenges.' },
        { title: 'Integration Takes Time', text: 'You\'re rewiring neural pathways and identity structures. Consistent practice over months produces real change.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Satanic Bible by Anton LaVey (Luciferian principles)',
          'The Book of Shadows by S. Ben Qayin (Luciferian practice)',
          'Jungian psychology on archetypes: works by Robert Moore, Joseph Campbell',
          'The Shadow Work Handbook by Jahde (shadow integration)',
          'Books on cognitive liberty and intellectual freedom'
        ],
      }
    }
  },
  {
    name: 'Philosophical Study',
    emoji: '💭',
    description: 'Luciferian Philosophy - Knowledge, Power, and the Deification of Self',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Principles',
            categories: [
              { name: 'Knowledge as Power', emoji: '📚', content: [
                { attribute: 'Principle', value: 'Knowledge is the most powerful tool available. Those who control information control reality for others. Free yourself by gathering your own knowledge.' },
                { attribute: 'Types', value: 'Technical knowledge (skills), historical knowledge (truth of what happened), psychological knowledge (how mind works), political knowledge (how power operates), magical knowledge (how consciousness shapes reality)' },
                { attribute: 'Practice', value: 'Read widely and critically, question official narratives, seek sources that contradict mainstream, learn from multiple perspectives, trust your own observation over received authority' },
                { attribute: 'Protection', value: 'Dominant systems control through information monopoly. Reading forbidden books, seeking hidden knowledge, learning what authorities fear—these are revolutionary acts.' },
                { attribute: 'Application', value: 'The more you know, the less manipulable you become. Knowledge transforms you from victim of circumstances into conscious participant in reality.' },
              ]},
              { name: 'Transgression as Sacred', emoji: '🚫', content: [
                { attribute: 'Definition', value: 'Transgression means crossing the line someone else drew. Not all transgression is wise, but transgression against unjust rules is necessary.' },
                { attribute: 'Nature', value: 'Breaking rules that don\'t serve you, violating prohibitions that limit you, defying authorities that control you—these are acts of liberation.' },
                { attribute: 'Discernment', value: 'Not all boundaries are wrong. Intelligent transgression means: understanding the rule before breaking it, assessing consequences, choosing your battles wisely.' },
                { attribute: 'Power', value: 'The act of transgression awakens power. When you overcome the fear of punishment, you claim authority over yourself. This is real power.' },
                { attribute: 'Practice', value: 'Start small: speak truth where you normally stay silent, do something forbidden but harmless, test a prohibition to see what actually happens.' },
              ]},
            ]
          },
          {
            name: 'Self-Deification',
            categories: [
              { name: 'Self-Deification as Practice', emoji: '👑', content: [
                { attribute: 'Meaning', value: 'You are the god of your own life. Not in grandiose megalomania, but in clear self-authorship: you decide your values, you direct your life, you take responsibility for your outcomes.' },
                { attribute: 'Principle', value: 'External authorities (religious, governmental, social) should serve you, not rule you. You are the ultimate authority in your own life.' },
                { attribute: 'Practice', value: 'Make decisions based on your own reasoning, honor your own instincts, trust your own experience, develop self-reliance, refuse victimhood.' },
                { attribute: 'Responsibility', value: 'Self-deification means total responsibility. You cannot blame others, fate, or demons. You must take charge of your life and accept consequences.' },
                { attribute: 'Development', value: 'Become more divine by: developing your potential fully, acting with integrity, exercising your will consciously, becoming worthy of self-worship.' },
              ]},
            ]
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Luciferian Philosophy: Core Principles', content: 'Luciferianism is the conscious cultivation of personal power, sovereignty, and self-determination. It is not theistic worship but the pursuit of knowledge, freedom, and authentic self-expression. Core principles: (1) You are responsible for your own life—not to gods or authorities but to yourself. (2) Knowledge is power—seek truth wherever it leads, question all claims. (3) Your will matters—develop it, exercise it, manifest through it. (4) Pleasure and desire are not sins—they are expressions of life force to be understood and integrated. (5) Self-deification is the goal—becoming the best, most authentic, most capable version of yourself.' },
          { heading: 'Knowledge as Rebellion', content: 'Every system of control maintains itself through information monopoly. Religions control through scripture, governments through propaganda, social systems through shame. The Luciferian path recognizes that seeking knowledge those in power fear is an act of liberation. Read forbidden books. Ask questions authorities forbid. Investigate what you\'re told not to investigate. Test rules before obeying them. This is not rebellion for rebellion\'s sake—it\'s the intelligent pursuit of truth. As your knowledge grows, your freedom increases proportionally.' },
          { heading: 'Will as Divine Principle', content: 'In Luciferian practice, your will is sacred. Not selfish will that harms others, but conscious, intentional, self-directed will. Develop your will by: making decisions consciously (not on autopilot), taking responsibility for your choices, pursuing what you genuinely want (not what you think you should want), refusing victim mentality, acting with integrity toward your own goals. A strong will is not arrogant—it\'s clear, purposeful, and self-aware. Develop it through practice: start with small decisions and progressively larger ones until you take full authorship of your life.' },
          { heading: 'Pleasure as Sacred', content: 'Religious systems teach that pleasure is sinful, especially sexual pleasure. This serves control—those who deny their own desires are easier to control. The Luciferian path recognizes pleasure as sacred: physical pleasure (food, sex, comfort), intellectual pleasure (learning, creating, solving), spiritual pleasure (transcendence, meaning, connection). Ethical engagement with pleasure means: pursuing it consciously, not harming others in the pursuit, understanding consequences, balancing immediate pleasure with long-term goals. Your capacity for pleasure is part of your aliveness.' },
          { heading: 'The Art of Living: Authentic Existence', content: 'The ultimate Luciferian practice is living authentically—being genuinely yourself rather than a version crafted for others\' approval. This requires: knowing yourself deeply (shadow work), accepting your actual desires (not approved ones), expressing your real thoughts (truth-telling), making choices based on your values (not others\' values), taking full responsibility (no victim stories). Authentic existence is not comfortable—it requires courage, honesty, and willingness to be misunderstood. But it is the only life worth living.' },
      ],
    },
      gettingStarted: { title: 'Getting Started', steps: [
          'Read one book that contradicts what you were taught as religious truth',
          'Journal on one belief you\'ve held without ever really questioning it',
          'Research the historical origins of one religious or cultural rule—why was it created? Who benefits?',
          'Identify one prohibition you\'ve internalized and examine: what would actually happen if you broke it?',
          'Practice saying no to one small request or expectation, claiming your own preferences',
          'Study one area of knowledge that authorities told you was forbidden or dangerous',
          'Perform one small act that violates a social norm (harmlessly) and observe your internal reaction',
          'Write your own ethical code—what values do YOU hold independent of what you were taught?',
          'Create a practice of conscious choice: each day, make at least one decision purely based on what you want, not approval-seeking',
          'Over 40 days, notice how your understanding of freedom and responsibility shifts'
      ],
    },
      tips: { title: 'Tips for Practice', items: [
          { title: 'Knowledge Is Never Complete', text: 'You will never know everything. Practice being comfortable with uncertainty and changing your mind as you learn more. Rigidity is the enemy of wisdom.' },
          { title: 'Question Everything', text: 'Including what the Luciferian path teaches. Test ideas against your own experience. Blind faith in anything—even philosophy—defeats the purpose.' },
          { title: 'Start Small With Transgression', text: 'Don\'t become a reckless rebel. Practice intelligent transgression: understand rules, assess consequences, choose battles wisely, act with clear intention.' },
          { title: 'Authentic Living Takes Courage', text: 'You will be misunderstood. People will call you selfish, prideful, dangerous. These reactions often reveal their own discomfort with freedom.' },
          { title: 'Power Attracts Responsibility', text: 'As you develop your will and claim your power, you become responsible for your impact. Power without ethics becomes tyranny—avoid this trap.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Satanic Bible by Anton LaVey (foundational Luciferian text)',
          'The Book of Shadows by S. Ben Qayin (practical Luciferian gnosis)',
          'On the Genealogy of Morality by Friedrich Nietzsche (questioning values)',
          'The Master and Margarita by Mikhail Bulgakov (Luciferian themes in literature)',
          'Books on critical thinking and cognitive liberty'
      ],
      },
    },
  },
  {
    name: '🌪️ Chaos Magick 🌪️',
    isSpacer: true,
  },
  {
    name: 'Sigil Crafting & Activation',
    emoji: '✨',
    description: 'Chaos Magick - Collapse probability through symbolic intention and chaotic force',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Creation',
            tabs: [
              {
                name: 'Intention Statement Crafting',
                categories: [
                  { name: 'Intention Statement Crafting', emoji: '📝', content: [
                    { attribute: 'Clarity & Specificity', value: 'Write your goal statement with extreme clarity and specificity.\nNOT: "I want a better job."\nYES: "I am happily employed as Senior Designer at tech company earning $85,000/year beginning March 2024."\nThe specificity grounds the intention in achievable reality.' },
                    { attribute: 'Present Tense Manifestation', value: 'Write ONLY in present tense as if already manifested. This bypasses unconscious resistance ("wanting" implies future lack).' },
                    { attribute: 'Eliminate Negatives', value: 'Eliminate all negatives. NOT: "I stop drinking." YES: "I am fit and energized." Unconscious cannot process negation and gets confused.' },
                    { attribute: 'Emotional Resonance', value: 'Make it emotionally resonant. Can you FEEL the truth of this statement? If not, adjust until it feels like a memory of something you have already achieved.' },
                    { attribute: 'Concise Length', value: 'Write 1-3 sentences maximum. The sigil\'s power comes from focused intention, not wordy explanations.' },
                  ]},
                ]
              },
              {
                name: 'Letter Extraction Methods',
                categories: [
                  { name: 'Letter Extraction Methods', emoji: '🔤', content: [
                    { attribute: 'Classical Method', value: 'Extract unique letters from your intention statement.\n(1) Write it out fully\n(2) Cross off duplicate letters (keep first occurrence, remove repeats)\n(3) Remove vowels entirely unless essential\nExample: "I am healing my body" → I, A, M, H, L, N, G, Y, B, D' },
                    { attribute: 'Resonant Method', value: 'Extract only consonants. Some practitioners feel consonants are more "solid" (vowels are too flowing).' },
                    { attribute: 'Intuitive Method', value: 'Read your statement aloud. Listen to the sound and notice which letters feel strongest. Extract only those.' },
                    { attribute: 'Automatic Method', value: 'Write the statement, then rapidly circle all letters that "jump out" without analyzing. Your unconscious knows which letters carry the most power.' },
                    { attribute: 'Key Principle', value: 'Choose ONE method and stick with it. The extracted letters become the skeleton of your sigil—typically 7-12 unique letters.' },
                  ]},
                ]
              },
              {
                name: 'Glyph Design Techniques',
                categories: [
                  { name: 'Glyph Design Techniques', emoji: '🎨', content: [
                    { attribute: 'Weaving Technique', value: 'Weave each letter into the next, creating flowing lines that obscure origin.' },
                    { attribute: 'Integration Technique', value: 'Integrate letters as parts of a larger abstract shape. Example: T becomes part of a peak, S becomes a curve.' },
                    { attribute: 'Overlap Technique', value: 'Overlap letters so heavily they become unrecognizable.' },
                    { attribute: 'Spiral Flow Technique', value: 'Create a symbol where each letter feeds into the next like a continuous spiral.' },
                    { attribute: 'Aesthetic Power', value: 'The final sigil should be aesthetically striking—something you WANT to gaze at. If it looks ugly or forced, redesign it. Beauty itself is power.' },
                    { attribute: 'Verification Test', value: 'After completing the sigil: Can you identify the original letters? If YES, redesign. After 3 days, look again—you should NOT remember the original statement.' },
                  ]},
                ]
              },
              {
                name: 'Final Design Refinement',
                categories: [
                  { name: 'Final Design Refinement', emoji: '📐', content: [
                    { attribute: 'Iteration Process', value: 'Create multiple versions until one feels perfect.\n(1) Draw small versions first (3"x3" is ideal)\n(2) Create final version on quality paper (8.5"x11" minimum)\n(3) Use pen, ink, or paint—handmade is more powerful than printed.' },
                    { attribute: 'Conscious Intention', value: 'As you draw the final version, hold your intention in your heart. Do not think about it consciously, just FEEL the desire. The sigil IS the physical manifestation of your will.' },
                    { attribute: 'Single Unbroken Line', value: 'Draw as a single unbroken line—creates continuity of power.' },
                    { attribute: 'Layering Method', value: 'Draw once faintly, then stronger lines on top—builds intensity.' },
                    { attribute: 'Eye Comfort', value: 'The final sigil should be something you can easily gaze at for 5+ minutes during activation without eye strain.' },
                  ]},
                ]
              },
              {
                name: 'Activation Preparation',
                categories: [
                  { name: 'Activation Preparation', emoji: '⚡', content: [
                    { attribute: 'Method Selection', value: 'Choose your activation method BEFORE you create the sigil (orgasmic, ecstatic, meditative—each requires different preparation).' },
                    { attribute: 'Space Preparation', value: 'Create a clean, private space where you will not be interrupted. Have your sigil visible at eye level.' },
                    { attribute: 'Time Allocation', value: 'Orgasmic: 20-40 minutes | Ecstatic: prepare music/space | Meditative: 30-60 minutes uninterrupted' },
                    { attribute: 'Energy State', value: 'Do NOT activate when tired, sick, or emotionally depleted. Your energy must be high and clear.' },
                    { attribute: 'Optimal Timing', value: 'Best times: Early morning (fresh energy) | After exercise (peak energy) | Full moon (power days)' },
                    { attribute: 'Pre-Activation Protocol', value: 'Review your intention once the night before—then STOP thinking about it. Your conscious mind must be fresh for activation.' },
                  ]},
                ]
              },
            ]
          },
          {
            name: 'Activation & Integration',
            tabs: [
              {
                name: 'Orgasmic Activation',
                categories: [
                  { name: 'Orgasmic Activation (Most Powerful)', emoji: '🔥', content: [
                    { attribute: 'Overview', value: 'This is the most reliable activation method because orgasm creates a state of consciousness unique in human experience: intense focus followed by total dissolution.' },
                    { attribute: 'Preparation', value: 'Ensure complete privacy. Have your sigil placed where you can see it (on wall, held in hand, or visualized clearly).' },
                    { attribute: 'Build-up Phase', value: 'Begin masturbation normally, but as you approach arousal, begin focusing your mind on your sigil and intention. Don\'t force it—let pleasure guide attention naturally.' },
                    { attribute: 'Sustained Focus', value: 'Maintain awareness of sigil and intention throughout. Some practitioners write their intention on the paper with the sigil to anchor focus. Spend 10-15 minutes building arousal.' },
                    { attribute: 'Peak Activation', value: 'As orgasm approaches, intensify focus on sigil to MAXIMUM. At the exact moment of climax, mentally project your intention THROUGH the sigil into the universe.' },
                    { attribute: 'Release Protocol', value: 'After orgasm, completely release. Don\'t analyze what happened. Lie still for 2-3 minutes, then move on with your day. The dissolution imprints the sigil onto your unconscious permanently.' },
                    { attribute: 'Timeline', value: 'Results often appear within days, making this ideal for urgent intentions.' },
                  ]},
                ]
              },
              {
                name: 'Ecstatic Trance Activation',
                categories: [
                  { name: 'Ecstatic Trance Activation', emoji: '🎵', content: [
                    { attribute: 'Overview', value: 'For those who prefer non-sexual methods. This requires achieving altered consciousness through sustained rhythmic stimulus.' },
                    { attribute: 'Setup', value: 'Create a playlist of intense, rhythmic music (128+ BPM): industrial, tribal drums, heavy electronic, metal. Place your sigil where visible.' },
                    { attribute: 'Entry Phase', value: 'Put on music and start moving: dancing, swaying, pacing, or repetitive motion synchronized to rhythm. Maintain for 15-20 minutes MINIMUM. Do NOT stop.' },
                    { attribute: 'Buildup Phase', value: 'Focus on sigil and intention as you move. Merge body rhythm with mental focus. Chant your intention or make toning sounds (Om, Ahhh, Eeee).' },
                    { attribute: 'Peak State', value: 'After 20-30 minutes, reach the altered state where thinking stops and pure energy/sensation remains. Gaze at sigil intensely. Feel your intention flooding through you.' },
                    { attribute: 'Collapse Protocol', value: 'When peak is reached, suddenly STOP all movement and sound. Sit or lie down. This shift collapses the sigil into manifestation. Sit in silence for 5 minutes.' },
                    { attribute: 'Timeline', value: 'Often produces visible synchronicities within 3-7 days.' },
                  ]},
                ]
              },
              {
                name: 'Meditation Based Charging',
                categories: [
                  { name: 'Meditation-Based Charging', emoji: '🧘', content: [
                    { attribute: 'Overview', value: 'For those wanting sustained, gentler activation. Takes longer but very effective.' },
                    { attribute: 'Setup', value: 'Sit comfortably in quiet space. Place sigil at eye level, 2-3 feet away. Light a candle if desired.' },
                    { attribute: 'Gazing Meditation', value: 'For 30-45 minutes, gaze softly at your sigil. Let eyes defocus so it blurs. Hold intention in your heart.' },
                    { attribute: 'Integration Phase', value: 'Eyes will water, sigil will blur, colors may appear. This is correct—you\'re bypassing analytical mind. Sigil may seem to move or glow.' },
                    { attribute: 'Internal Burning', value: 'After 20-30 minutes, close eyes while maintaining sigil awareness. Image burns into inner vision. Project intention through this internal image.' },
                    { attribute: 'Dissolution', value: 'When time expires, open eyes, acknowledge the sigil, and completely forget about it. Don\'t think about intention. Go about your day.' },
                    { attribute: 'Timeline', value: 'Manifests more slowly (7-30 days) but produces LASTING results and genuine unconscious belief.' },
                  ]},
                ]
              },
              {
                name: 'Subconscious Implantation',
                categories: [
                  { name: 'Subconscious Implantation (Stealth Method)', emoji: '👁️', content: [
                    { attribute: 'Overview', value: 'For those with patience or long-term intentions. The sigil sinks deeply into unconscious and works constantly.' },
                    { attribute: 'Creation', value: 'Create a small sigil (3"x3" or smaller) on paper or digitally.' },
                    { attribute: 'Placement', value: 'Place sigil where you see it frequently but don\'t consciously analyze: mirror, wallet, phone wallpaper, under desk.' },
                    { attribute: 'Key Rule', value: 'NEVER analyze the sigil\'s meaning. NEVER think about intention. NEVER look deliberately. Let unconscious absorb while conscious remains ignorant.' },
                    { attribute: 'Duration', value: 'Leave sigil in place for 40 days minimum. Your unconscious works constantly toward intention while conscious mind is free of obsession.' },
                    { attribute: 'Completion', value: 'After 40 days, destroy the sigil completely (burn, bury, dissolve). Intention is now fully embedded in your unconscious.' },
                    { attribute: 'Timeline', value: 'Produces STRONGEST long-term manifestation (zero conscious doubt). Results appear gradually (30-180 days) but manifest COMPLETELY.' },
                  ]},
                ]
              },
              {
                name: 'Strategic Forgetting Techniques',
                categories: [
                  { name: 'Strategic Forgetting Techniques', emoji: '🌌', content: [
                    { attribute: 'Core Principle', value: 'After activation, FORGETTING is most crucial. Conscious doubt disrupts magic; unconscious manifests best when conscious mind is occupied elsewhere.' },
                    { attribute: 'Destroy the Sigil', value: 'Immediately destroy the physical sigil completely (burn, bury, dissolve in salt water). Say "This is complete. I release it." Creates psychological closure.' },
                    { attribute: 'Hide or Isolate', value: 'If using implantation method, hide sigil permanently (inside book, behind furniture, sealed envelope). Out of sight = out of mind.' },
                    { attribute: 'Maintain Silence', value: 'Do NOT tell anyone about sigil or intention. Talking re-engages conscious mind and invites others\' doubt into your field.' },
                    { attribute: 'Immediate Distraction', value: 'Immediately after activation, do something completely different: watch a movie, run, socialize. Thoroughly distract conscious mind.' },
                    { attribute: 'Release Thoughts', value: 'When intention pops into head, acknowledge it: "That\'s handled. Moving on." Don\'t engage further.' },
                    { attribute: 'Timeline', value: 'Most practitioners forget completely within 24-48 hours. Still thinking after a week? Activation incomplete. Deep activation leaves you feeling complete and uninterested.' },
                  ]},
                ]
              },
              {
                name: 'Aligned Action Imperative',
                categories: [
                  { name: 'Aligned Action Imperative', emoji: '🎯', content: [
                    { attribute: 'Core Principle', value: 'Magic ≠ Passive. Universe loves help. Take at least one concrete action daily toward intention.' },
                    { attribute: 'Job Intention', value: 'Apply to jobs, update resume, network, attend interviews.' },
                    { attribute: 'Love Intention', value: 'Join social groups, go on dates, put yourself in connection situations.' },
                    { attribute: 'Money Intention', value: 'Seek income opportunities, learn skills, invest wisely.' },
                    { attribute: 'Wealth Intention', value: 'Open investment accounts, research opportunities, save money.' },
                    { attribute: 'The Ratio', value: 'Sigil work = 20% of equation. Aligned action = 80%. Without action, manifestation SLOW (6-12 months). With action, FAST (2-8 weeks).' },
                    { attribute: 'Action Philosophy', value: 'Doesn\'t mean FORCING—not white-knuckling outcomes. When opportunities appear, take them. When doors open, walk through. Sigil opens path; action keeps it open.' },
                  ]},
                ]
              },
              {
                name: 'Synchronicity Recognition Training',
                categories: [
                  { name: 'Synchronicity Recognition Training', emoji: '✨', content: [
                    { attribute: 'Definition', value: 'Synchronicity = meaningful coincidence, not direct cause-effect. Universe guides through pattern, not force.' },
                    { attribute: 'How It Works', value: 'You don\'t create job—synchronicity places you meeting hiring manager. You don\'t create partner—synchronicity puts you at right event where they appear.' },
                    { attribute: 'Heighten Awareness', value: 'Notice coincidences: radio matches intention, three people mention goal, randomly open book to relevant passage. NONE is coincidence—it\'s synchronicity.' },
                    { attribute: 'Track Patterns', value: 'Journal unusual timing, unexpected meetings, odd opportunities. Patterns emerge quickly.' },
                    { attribute: 'Trust Hunches', value: 'Sudden impulse to check website, call someone, go somewhere? FOLLOW IT. That\'s synchronicity guiding action.' },
                    { attribute: 'Remain Alert', value: 'If you obsess ("Is this synchronicity?"), back in conscious mind. Develop intuitive recognition—you just KNOW when universe communicates.' },
                    { attribute: 'Timeline', value: 'First synchronicities within 3-7 days of activation. Well-activated sigil creates constant low-level synchronicity for entire manifestation period.' },
                  ]},
                ]
              },
              {
                name: 'Timeline Management & Faith',
                categories: [
                  { name: 'Timeline Management & Faith', emoji: '⏰', content: [
                    { attribute: 'Core Reality', value: 'Chaos magic works on universe\'s timeline, not yours. Universe has its own schedule.' },
                    { attribute: 'Speed Factors', value: '(1) Sigil power—did you activate fully? (2) Intention intensity—truly want this? (3) Aligned action—participating? (4) Environmental resistance—how hard? (5) Unconscious blocks—secretly impossible?' },
                    { attribute: 'Simple Intentions', value: 'Minor job change, small money flow = 1-4 weeks.' },
                    { attribute: 'Medium Intentions', value: 'Better job, new relationship = 4-12 weeks.' },
                    { attribute: 'Complex Intentions', value: 'Career transformation, major life change = 3-12 months.' },
                    { attribute: 'Impossible Intentions', value: 'Healing "incurable" illness, perfect partner = 6-24 months.' },
                    { attribute: 'If Nothing Happens', value: 'After 8 weeks: sigil failed OR unconsciously blocking. (1) New sigil with clearer intention. (2) Examine secret doubts. (3) Increase aligned action.' },
                    { attribute: 'Master Key', value: 'NEVER obsess about timing. Obsession creates doubt. Trust, take action, let universe deliver. Strongest manifestations feel effortless.' },
                  ]},
                ]
              },
            ]
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Chaos Magic: The Collapse of Probability', content: 'Chaos magic operates on radical principle: belief systems are tools, not truths. Traditional magic relies on belief (in gods, demons, energies). Chaos magic recognizes that the mechanism doesn\'t matter—only the results. A sigil works whether you believe in demons, energy, quantum consciousness, or synchronicity. How? Because consciousness collapses probability. Quantum mechanics reveals that observation affects outcome. Consciousness is observation. Focused intention collapses the wave of probability toward desired outcome. Sigils work by focusing consciousness through geometric form (sigil) and emotional intensity (sexual, ecstatic states), forcing reality to collapse toward the intended possibility. This is not supernatural—it\'s consciousness recognizing its creative power.' },
          { heading: 'Sigils as Quantum Anchors', content: 'A sigil is geometric key that focuses consciousness without being decoded. Here\'s the mechanism: conscious mind is limited—it believes in obstacles and limitations. Unconscious mind is unlimited—it recognizes infinity of possibility. A readable intention statement activates the conscious mind\'s limitations ("that\'s impossible"). Encoding the intention into an abstract sigil bypasses conscious doubt and speaks directly to the unconscious. The unconscious mind can affect reality in ways conscious mind blocks itself from attempting. By encrypting intention, you activate the part of your mind that can actually change reality. You hide the intention so well that conscious doubt cannot interfere. This is genius of the glyph extraction and abstract design—your conscious mind literally cannot remember what the sigil means once activated, so it cannot undermine it' },
          { heading: 'Obsession and Detachment: The Paradox', content: 'Chaos magic recognizes a paradox: you must care intensely about the goal (to charge the sigil), then stop caring entirely (to allow it to work). The activation phase requires full obsession—all emotion, intensity, and focus flooding into the sigil. But the post-activation phase requires complete detachment—forgetting the sigil exists, stop thinking about results, release all attachment to outcome. This paradox confuses beginners who expect continued focus. Wrong: continued focus blocks the work by keeping conscious mind engaged, preventing unconscious manifestation. Detachment is not apathy—it\'s releasing control. By forgetting the sigil, you allow the unconscious and the universe to work without conscious interference. Obsession then detachment is the rhythm that makes chaos magic work' },
          { heading: 'Sexual Energy and Consciousness Dissolution', content: 'Chaos magic recognizes sexual orgasm as unique state of consciousness: intense focus (concentration) followed by complete dissolution of consciousness (the "little death"). In that millisecond of dissolution, the boundaries between conscious and unconscious dissolve. Sigil charged at moment of orgasm floods into this gap between consciousness states. The intensity of sexual energy (highest energy available to humans) combined with consciousness dissolution creates optimal conditions for probability collapse. This is not about sex itself but about using sex\'s consciousness-altering power as a gateway for magical work. This is why orgasmic activation is most reliable—the mechanism is built into human physiology. Alternatively: drugs, ecstatic trance, extreme exhaustion, and near-death experiences create similar consciousness dissolution but are riskier or illegal' },
          { heading: 'Synchronicity and Post-Activation Unfolding', content: 'After sigil activation, watch for synchronicity—meaningful coincidence, uncanny timing, unexpected opportunities. These are manifestation. Jung defined synchronicity as acausal meaningful connections—a thought and external event connected not by cause-effect but by significance. Chaos magic manifests through synchronicity rather than direct cause. You don\'t make the job appear (cause-effect); instead, synchronicity places you in the same room as the hiring manager, you mention your skills, they mention they\'re hiring (meaningful connection). The mechanism is invisible to conscious analysis but undeniable in results. This is why obsessive thinking blocks it—obsessive focus on specific outcome prevents you from noticing synchronicity. Detached awareness recognizes coincidence and acts on it. The universe offers paths; your job is following them, not forcing them' },
        ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Choose a clear, specific goal: "I find meaningful work I enjoy, earning $X per year by March" (not "I want a job")',
          'Write goal in present tense as if already manifested: "I am happily employed at [company/role] earning [amount]"',
          'Extract unique consonants from the goal, removing repeats: "find meaningful work" becomes specific letter skeleton',
          'Design abstract sigil by weaving extracted letters into flowing, unrecognizable form',
          'Create beautiful version of sigil on paper or draw it large enough to gaze at comfortably',
          'Choose activation method: orgasmic, ecstatic trance, or extended meditation—whichever intensity you can achieve',
          'Charge the sigil using your chosen method: gaze at sigil, hold intention, reach peak intensity/altered state',
          'At moment of peak intensity, project intention through sigil into the universe with complete conviction',
          'After activation, destroy the physical sigil (burn it, bury it, dissolve it)—erase all traces, forget it completely',
          'Resume normal life, aligned action, watch for synchronicities; never think about the sigil again',
      ]},
      tips: { title: 'Tips for Practice', items: [
          { title: 'The Sigil Must Be Unreadable', text: 'If you can decode your sigil after creating it, it\'s too obvious. The unconscious mind must be unable to consciously analyze what it means. This is the protection against doubt.' },
          { title: 'Intensity Charges the Sigil', text: 'Wimpy charging doesn\'t work. You need ecstasy, orgasm, trance, or extreme altered states. The more intense the consciousness dissolution, the more effective the sigil. Go all-in.' },
          { title: 'Forgetting Is The Key', text: 'Stop obsessing about the goal. Destroy the sigil, burn it, hide it. Prevent yourself from thinking about it. The moment you obsess, you re-engage conscious doubt. Magical work happens unconsciously.' },
          { title: 'Aligned Action Matters', text: 'Magic isn\'t passive. While sigil works unconsciously, you take mundane action. Job sigil + submitting applications. Love sigil + putting yourself in social situations. Sigil opens probability; action walks through the door.' },
          { title: 'Timing Acceptance Takes Patience', text: 'The sigil manifests on chaos timeline, not your deadline. Could be weeks, months, or gradual that you don\'t notice until suddenly the goal is realized. Trust the work and let timing be what it is.' },
      ]},
      resources: { title: 'Resources', items: [
          'Condensed Chaos by Phil Hine (foundational chaos magic text)',
          'Chaos Magick by Mark Cheric (practical methods)',
          'The Apocalyptic Transformation by Phil Hine (advanced sigil work)',
          'Austin Osman Spare: The Zos Kia Cultus (original chaos magic innovation)',
          'Practical Sigil Magic by Frater U.D. (modern applications)'
      ],
      },
    },
  },
  {
    name: 'Paradigm Shifting',
    emoji: '🌀',
    description: 'Chaos Magick - Change perception and belief systems to reshape reality',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Understanding Paradigm',
            tabs: [
              {
                name: 'Fluid Belief Installation',
                categories: [
                  { name: 'Fluid Belief Installation', emoji: '🔧', content: [
                    { attribute: 'Core Principle', value: 'Chaos magic is not about discovering "true" beliefs but CHOOSING beliefs that serve your current work. Unlike traditional spirituality (which demands faith in absolute truth), chaos magic treats beliefs as optional.' },
                    { attribute: 'Belief Fluidity Exercise', value: 'Identify a belief you hold rigidly ("God exists" or "God doesn\'t exist"). Now PROVE the opposite perspective is valid. If you believe in God: read atheist philosophers and notice how convincing they are. If you\'re atheist: read mystical texts and notice the internal logic. The point: both perspectives are EQUALLY valid and internally consistent. Neither is "true." This recognition is liberating.' },
                    { attribute: 'Installation Technique', value: '(1) Write new belief on paper ("I am magnetic to opportunity")\n(2) Read it aloud 3x daily for 7 days with full conviction\n(3) Find evidence in your life that supports this belief (notice times opportunity came)\n(4) Mentally "try on" the belief in conversations—act as if it\'s true' },
                    { attribute: 'Timeline to Integration', value: 'After 21 days of consistent practice, the belief calcifies into your operating system. This is neurologically how beliefs become hardwired into your unconscious mind.' },
                  ]},
                ]
              },
              {
                name: 'Paradigm Selection for Work',
                categories: [
                  { name: 'Paradigm Selection for Specific Work', emoji: '🔬', content: [
                    { attribute: 'Scientific Paradigm', value: 'Consciousness affects quantum probability. Best for: Sigil magic, energetic work, visualization magic. Framework: "My focused intention collapses quantum probability toward desired outcome." Advantage: Feels rational, integrates with science.' },
                    { attribute: 'Religious Paradigm', value: 'Invoking divine forces. Best for: Spiritual work, healing, blessing, alignment. Framework: "Divine intelligence guides all events and my request opens the channel." Advantage: Engages emotional depth, invokes archetypal power.' },
                    { attribute: 'Animist Paradigm', value: 'Communicating with spirits/nature. Best for: Earth magic, energy work, relationship healing. Framework: "All things have consciousness; I align with their intelligence." Advantage: Profound connection, grounds work in natural world.' },
                    { attribute: 'Technologist Paradigm', value: 'Hacking/programming reality. Best for: Manifestation, disruption magic, rapid change. Framework: "Reality is programmable code; I am the hacker." Advantage: Feels empowering, direct, modern.' },
                    { attribute: 'Commitment Protocol', value: 'Choose ONE paradigm for your current work. Commit fully to it for 40 days minimum. Let it shape your language, thoughts, and actions. After 40 days, you can switch to a different paradigm for different work.' },
                  ]},
                ]
              },
              {
                name: 'Paradigm Limitations Mastery',
                categories: [
                  { name: 'Integrating Paradigm Limitations', emoji: '⚙️', content: [
                    { attribute: 'Limitations as Features', value: 'Every belief system contains built-in limitations—these are features, not bugs. Scientific paradigm limits you to provable, rational mechanisms but blocks mystical experiences. Religious paradigm invokes power but demands submission to authority. Animist paradigm grounds work but restricts fierce manifestation. Each has trade-offs.' },
                    { attribute: 'Master Practice', value: 'Master practitioners DELIBERATELY CHOOSE which limitations serve their work. Healing magic? Use animism\'s "no harm" limitation—it\'s perfect. Aggressive manifestation? Use technologist paradigm\'s competitive framework. Choose consciously, not unconsciously.' },
                    { attribute: 'Limiting Belief Identification', value: 'Identify one of your current limiting beliefs ("magic doesn\'t work," "I\'m powerless," "I\'m unlovable"). Ask: WHO BENEFITS from this belief? HOW does this belief protect me? WHAT would be possible if I dropped this belief?' },
                    { attribute: 'Belief Replacement Practice', value: 'Practice operating from the OPPOSITE belief for 7 days. Notice what shifts. This builds your ability to consciously choose beliefs rather than unconsciously inherit them. Track changes in mood, opportunities, relationships, energy.' },
                  ]},
                ]
              },
              {
                name: 'Dynamic Paradigm Shifting',
                categories: [
                  { name: 'Dynamic Paradigm Shifting Protocol', emoji: '🔄', content: [
                    { attribute: 'Phase 1: Setup', value: 'Identify three different paradigms you can authentically operate from (e.g., Scientist, Mystic, Warrior). Practice each for 1 week until you can "wear" each worldview naturally. Build fluency in shifting between them.' },
                    { attribute: 'Phase 2: Selection', value: 'Before each magical work, consciously choose which paradigm best serves your goal. Don\'t default—actively select the lens through which you\'ll perceive and operate.' },
                    { attribute: 'Phase 3: Embodiment', value: 'For the duration of your work, fully inhabit that paradigm. Think, speak, and act from that worldview exclusively. Do NOT mix paradigms mid-work—consistency is essential.' },
                    { attribute: 'Phase 4: Release', value: 'When work is complete, consciously release that paradigm: "I release the Scientist paradigm now." This prevents paradigm-addiction and keeps you flexible.' },
                    { attribute: 'Advanced Application', value: 'Example: Monday use Scientific paradigm for sigil magic (focus on quantum collapse), Wednesday use Mystical paradigm for prayer/blessing (focus on divine flow), Friday use Warrior paradigm for manifestation magic (focus on will and power). Each paradigm optimizes different work.' },
                  ]},
                ]
              },
              {
                name: 'Consensus Reality Deconstruction',
                categories: [
                  { name: 'Consensus Reality Deconstruction Exercise', emoji: '🌍', content: [
                    { attribute: 'What is Consensus Reality', value: 'Consensus reality (the "normal world") is a collective hallucination maintained by shared belief. Money has value only because billions agree it does. Borders exist only because millions accept the agreement. God exists in the minds of believers. Magic is "impossible" only because consensus says so.' },
                    { attribute: 'Week-Long Exercise', value: 'Spend one week questioning ONE consensus belief. Pick from: "Money has inherent value" (research how money is created), "Time flows at constant rate" (study relativity), "Separateness is fundamental" (explore quantum entanglement), "Emotions are internal" (track mood contagion).' },
                    { attribute: 'Process & Recognition', value: 'As you study, the consensus belief loses its grip. You recognize it as CHOSEN CONSENSUS, not discovered fact. You see how this belief maintains power through repetition, not truth.' },
                    { attribute: 'Liberation Effect', value: 'Once you see through one consensus belief, ALL consensus beliefs become suspect. You realize: your reality is not fixed. It\'s negotiable. This is genuine power. You can now question any "fact" society presents as universal truth.' },
                  ]},
                ]
              },
              {
                name: 'Personal Reality Construction',
                categories: [
                  { name: 'Personal Reality Construction Practice', emoji: '🏗️', content: [
                    { attribute: 'Three Construction Mechanisms', value: 'You construct personal reality through: (1) ATTENTION - What you notice becomes your reality. (2) INTERPRETATION - You filter events through beliefs. "Boss criticized my work" = "I\'m incompetent" OR "Boss develops talent they value". (3) ACTION - You act from your belief, creating results that confirm it.' },
                    { attribute: 'Week-Long Practice', value: 'Day 1: Choose one belief about yourself ("I\'m shy"). Watch how attention, interpretation, action maintain it. Day 2-3: Deliberately shift attention. Notice moments of confidence instead of shyness. Day 4-5: Reinterpret one situation using opposite belief. Day 6-7: Take one action from new perspective.' },
                    { attribute: 'Reality Shift', value: 'After one week, you notice reality shift without external change. You haven\'t changed; you\'ve RECONCEIVED yourself. This is the deepest magic—reality responds to your construction of it.' },
                    { attribute: 'Ongoing Practice', value: 'This isn\'t one-time work—this is how reality actually works. Once you see it, you can use it deliberately to construct any reality you choose. Reality becomes plastic, moldable by your attention and belief.' },
                  ]},
                ]
              },
              {
                name: 'Paradigm Inversion Testing',
                categories: [
                  { name: 'Paradigm Inversion Testing', emoji: '⚡', content: [
                    { attribute: 'Core Technique', value: 'Take your most fundamental belief and INVERT it for 7 days, observing what becomes possible. This is chaos magic\'s most powerful technique for breaking free from trapped paradigms.' },
                    { attribute: 'Example 1: Magic Possibility', value: 'Belief: "Magic is impossible". Invert: "Magic is constantly happening everywhere". For 7 days: Interpret ALL coincidences as magic. Track synchronicities. By day 7, notice 50+ "magical moments" you usually miss. Question: Was magic impossible? Or were you not paying attention?' },
                    { attribute: 'Example 2: Personal Power', value: 'Belief: "I\'m powerless". Invert: "I shape everything in my reality". For 7 days: Take responsibility for EVERYTHING. Bad weather? You attracted it. Traffic jam? You created it. Stranger\'s smile? You caused it. By day 7: Everything IS responsive to your energy and attention.' },
                    { attribute: 'Example 3: Autonomy', value: 'Belief: "Other people control me". Invert: "I have complete agency; others are mirrors". For 7 days: Assume no one can make you do anything. Critical person shows self-criticism. Supportive friend shows self-support. By day 7: Relationship dynamics shift—when you own power, others stop controlling.' },
                    { attribute: 'Results & Implications', value: 'Most practitioners report inverted beliefs produce BETTER results—suggesting the original was self-imposed limitation, not truth. This testing reveals what\'s real vs what\'s conditioned into you.' },
                  ]},
                ]
              },
              {
                name: 'Cognitive Reframing Mastery',
                categories: [
                  { name: 'Cognitive Reframing Mastery', emoji: '🎯', content: [
                    { attribute: 'Core Principle', value: 'Events are neutral. Your INTERPRETATION creates your reality response. Two people experience same event but live in completely different realities based on interpretation. You are not victim of circumstances—you are creator of your response to circumstances.' },
                    { attribute: 'Basic Technique', value: 'When experiencing negative event, pause and ask: "What is the OPPOSITE interpretation?" Example: Job rejection. Standard: "I\'m not good enough". Opposite: "That job wasn\'t the right fit; universe protects me for something better". Same event. Different reality. The second produces better results—you stay confident, seek other opportunities, find better positions.' },
                    { attribute: 'Advanced Technique: Five Interpretations', value: 'Find 5 different interpretations of same event. Example: Someone cuts you off in traffic. (1) "They\'re rude" (2) "They\'re rushing to emergency" (3) "They\'re testing my patience" (4) "Universe keeps me behind them to avoid accident ahead" (5) "I attracted this by driving unconsciously". All FIVE fit the facts. Which should you choose? Choose the one making you MORE POWERFUL and RESOURCEFUL.' },
                    { attribute: '30-Day Integration', value: 'Whenever something negative happens: Generate 3 alternative interpretations. Choose the empowering one. By day 30: Automatic reframing develops—you naturally interpret events serving your growth. Your life hasn\'t changed. Your REALITY has completely shifted through intentional interpretation.' },
                  ]},
                ]
              },
            ]
          },
          {
            name: 'Paradigm Collapse & Integration',
            tabs: [
              {
                name: 'Liminal State Access',
                categories: [
                  { name: 'Liminal State Access Protocols', emoji: '🌀', content: [
                    { attribute: 'Principle', value: 'Paradigm shifts happen most easily at "edges" of consciousness—boundaries between states where normal rules don\'t apply. When consciousness is between states, new programming installs easily.' },
                    { attribute: 'Hypnagogic States', value: 'Falling Asleep/Waking: 5-10 minute windows. Technique: As falling asleep, hold target paradigm ("I am powerful," "Magic is real," "I am worthy"). Unconscious is most open. Don\'t force—let images, feelings, realizations come. Duration: 5-10 minutes nightly. Most effective time for belief installation.' },
                    { attribute: 'Flow States', value: 'When: Sports, art, music, work deeply engaging. Technique: Introduce new paradigm silently while in flow. "Every note shapes reality" or "I control outcomes". The state makes new beliefs feel REAL, not theoretical. Frequency: 3-5x weekly during flow activity.' },
                    { attribute: 'Orgasmic & Meditation States', value: 'Orgasmic: Timing as approaching climax. Technique: Hold new paradigm clearly. Release it into moment of peak. Integrated into intimate practice. Meditation: 30+ minutes deep meditation. Technique: In quiet mind, introduce new paradigm. Let it settle without resistance. Frequency: Daily or 5x weekly.' },
                    { attribute: 'Dream States (Advanced)', value: 'Method: Keep dream journal 1 week. Identify dreams about limiting belief. Lucid dream. Technique: In lucid dream, consciously adopt opposite belief. Power: Neural imprints are STRONG—lucid dream work produces permanent shifts in 1-3 sessions. These are the most direct reality-rewiring techniques available.' },
                  ]},
                ]
              },
              {
                name: 'Antinomian Challenge',
                categories: [
                  { name: 'Antinomian Challenge Protocol', emoji: '⚖️', content: [
                    { attribute: 'Definition & Principle', value: 'Antinomian = against law/rule. Your deepest beliefs feel like LAW—unquestionable facts. Breaking them reveals they\'re just beliefs, not truth. This practice shatters programmed certainty.' },
                    { attribute: 'Core Beliefs to Challenge', value: 'Identify three beliefs you\'d "never question": "Pain is real", "Discipline is necessary", "Authority matters", "I\'m responsible for others\' feelings", "Magic doesn\'t work". These are your strongest programs—challenging them creates breakthrough.' },
                    { attribute: 'Pain is Real Challenge', value: 'Technique: Wim Hof breathing (creates numbness), hold ice, sit in extreme heat. Result: Pain is modulated by consciousness, not fixed. You discover your mind can override what seemed unchangeable.' },
                    { attribute: 'Discipline Necessity Challenge', value: 'Technique: One day ZERO discipline—no schedule, no structure. Question: Chaos? Or natural wisdom? Most discover they work better without rigid discipline when truly listening to intuition.' },
                    { attribute: 'Authority Challenge & Magic Challenge', value: 'Authority: One day respecting NO external authorities. Decide purely on own judgment. Result: Your judgment improves when you trust it. Magic: One week doing basic magic (visualization, intention, synchronicity). Track coincidences. Count "magical moments" you normally overlook.' },
                    { attribute: 'Responsibility Challenge & Insight', value: 'Responsibility: One week NOT managing anyone\'s emotions. Result: They handle themselves. Their growth accelerates. Insight: After violation, these beliefs were CHOSEN programming, not eternal truths. You can reprogram yourself. This is massive power. One 7-day antinomian practice produces more growth than years of conventional self-help.' },
                  ]},
                ]
              },
              {
                name: 'Paradigm Validation Testing',
                categories: [
                  { name: 'Result-Based Paradigm Validation', emoji: '🧪', content: [
                    { attribute: 'Core Principle', value: 'In chaos magic, truth is PRAGMATIC not philosophical. A belief is "true" if it produces results; false if it doesn\'t. This is empirical spirituality—you test, measure, verify.' },
                    { attribute: 'Old Paradigm Test (14 days)', value: 'Operate from original belief. Track results on 1-10 scale: Mood, Opportunities, Relationships, Manifestations, Synchronicities, Energy level. Total: /60. Write down your baseline score—this is your starting point.' },
                    { attribute: 'New Paradigm Test (14 days)', value: 'Switch to opposite belief. Keep same tracking. Get new score. Use exact same measurement criteria so results are directly comparable. No guessing—measure precisely.' },
                    { attribute: 'Results Determine Truth', value: 'Whichever paradigm scores higher is "true-for-you." You\'re not arguing philosophy—you\'re tracking DATA. Example: Old belief: "I\'m not creative" = 4/10 (low opportunities, self-doubt, limited ideas). New belief: "I\'m inherently creative" = 8/10 (ideas flow, opportunities appear, people respond). Result: New belief is "truer"—it produces better reality.' },
                    { attribute: 'Continuous Optimization', value: 'Every 30 days: Audit beliefs. Great results? Keep them. Poor results? Change them. Your reality improves proportionally to how frequently you upgrade. Most inherit limiting beliefs. Chaos practitioners actively optimize like software updates. You are debugging your operating system.' },
                  ]},
                ]
              },
              {
                name: 'Permanent Integration',
                categories: [
                  { name: 'Permanent Integration Protocols', emoji: '✨', content: [
                    { attribute: 'Definition & Permanence Test', value: 'Some paradigm shifts are temporary experiments. Some become PERMANENT—you can\'t unsee them. These happen when new paradigm produces UNDENIABLE proof. After 40 days practicing new paradigm, ask: "Can I go back to old belief?" If "No—I\'ve seen too much proof" → Shift is permanent. This is genuine transformation.' },
                    { attribute: 'Examples of Permanent Shifts', value: '"Magic is impossible" → After 40 days magic practice, experienced too many synchronicities. Old belief GONE. "I\'m powerless" → After 40 days manifesting results, KNOW you\'re powerful. Reverting impossible. Once you see the truth, you can\'t unsee it.' },
                    { attribute: 'Phase 1: Grief (Days 1-14)', value: 'Worldview temporarily destabilizes when permanent shifts occur. Mourn loss of old certainties. Cry if needed. This is necessary. You\'re losing the familiar framework even though new one is better. Honor the transition.' },
                    { attribute: 'Phase 2: Disorientation (Days 15-30)', value: 'Old explanations no longer work. Build new ones. Sit with confusion. You\'re between worldviews—the liminal period where nothing feels solid yet. This is normal and temporary. Keep going.' },
                    { attribute: 'Phase 3: Integration (Days 31-60)', value: 'Develop new narratives explaining both old and new reality. Reconcile identity. You\'re creating coherent story that includes both what you knew and what you now know. This builds new stable framework.' },
                    { attribute: 'Phase 4: Embodiment (Days 61-90)', value: 'Let new paradigm become automatic. Breathe. Trust process. By day 90, new paradigm feels as natural as old one did. You\'ve integrated the shift fully. You are no longer "becoming"—you ARE the expanded version of yourself.' },
                  ]},
                ]
              },
            ]
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Paradigm as Virus', content: 'Chaos magic teaches that paradigm is virus—self-replicating belief that shapes behavior. When infected by "magic is impossible," you stop attempting magic, therefore magic doesn\'t happen, confirming your belief—the virus self-perpetuates. Most limiting beliefs operate this way: "I\'m unlovable" → you withdraw → people don\'t approach → confirms unlovability. The belief creates the reality that confirms the belief. The genius is recognizing you can choose to infect yourself with empowering paradigm instead: "I shape reality" → you take action → you affect outcomes → reality conforms → belief strengthens. You don\'t need to believe this is "really true"—you need to choose to be infected by it because it produces better results' },
          { heading: 'Belief Relativism', content: 'Chaos magic rejects objective truth in favor of pragmatic truth. There is no objectively "true" paradigm. God either exists or doesn\'t (metaphysical fact), but whether you believe in god is practical choice. Belief in god makes some people happier/more powerful, makes others less effective. Atheism makes some people happier/more powerful, makes others less effective. The "truth" is: choose the paradigm that serves you. This is radical freedom and radical responsibility—you cannot blame external paradigm, you chose it. Conversely, you can choose differently at any moment. Most people are infected with limiting paradigm they didn\'t consciously choose (family, culture, religion) and never realized they could switch' },
          { heading: 'Anti-Fundamentalism as Practice', content: 'Fundamentalism (rigid belief in one paradigm) is fundamentalist whether religious, scientific, atheist, or magical. Chaos magic cultivates anti-fundamentalism: fluid, experimental, pragmatic. This pisses off fundamentalists of all kinds because chaos magic proves their paradigm is optional, not absolute. A chaos practitioner might sound Christian to Christians, atheist to atheists, mystic to mystics—not from dishonesty but from recognizing each paradigm is valid tool. The master doesn\'t cling to any paradigm but wields all. This is liberation' },
          { heading: 'Perception Engineering', content: 'Chaos magic acknowledges that perception is selectively constructed. You don\'t see "reality"; you see what you\'re programmed to see. A white person sees "thugs," a Black person sees "youth." A rich person sees "opportunity," a poor person sees "obstacles." Both see same events. Different paradigms produce different perception, different interpretation, different action, different results. To change your reality, engineer your perception: meditate to notice automatic interpretations, practice cognitive reframing to shift meaning, adopt new paradigm consciously. Reality changes when perception changes, not when events change' },
          { heading: 'Paradigm Shifting as Magical Act', content: 'In chaos magic, shifting your operating paradigm IS magic. No ritual needed, no ingredients, no external forces—just consciously choosing different lens through which to see. "I am victim of circumstance" (paradigm A) vs "I am creator of circumstance" (paradigm B)—same reality, completely different experience and results. Shifting paradigm requires courage because you lose familiar explanations (why things are bad) and gain responsibility (you must respond, not react). Most people prefer comfortable victim paradigm to empowering creator paradigm. Chaos magic demands you choose power and accept responsibility. This is the core magical act' },
        ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Map your current paradigm: what do you fundamentally believe about reality, possibility, yourself, magic?',
          'Identify one limiting belief: "I\'m powerless" or "magic is impossible" or "people can\'t change"—something blocking your goals',
          'Research opposite paradigm: if you believe "powerless," study chaos magick or psychology that demonstrates agency',
          'Adopt opposite paradigm experimentally: "I shape my reality through thought, attention, and action" for one week',
          'Notice what shifts when you genuinely adopt the opposite belief: what becomes possible? What changes in perception?',
          'Take action consistent with new paradigm: if new paradigm is "I affect outcomes," take deliberate action on goals',
          'Track results: does new paradigm produce better outcomes than old paradigm?',
          'Integrate successful paradigm: if new belief works better, make it permanent. If old works better, you can return',
          'Identify second limiting belief and repeat process: cycle through limiting beliefs, replacing them with empowering ones',
          'Recognize that paradigm is fluid choice, not fixed truth. You can adopt any paradigm that serves your current work',
      ]},
      tips: { title: 'Tips for Practice', items: [
          { title: 'Belief Must Feel Authentic', text: 'You cannot force belief. If new paradigm feels fake, you\'ll unconsciously reject it. Start with beliefs you can actually embrace, even partially. "I might have some power" is better starting point than "I am god".' },
          { title: 'Results Test Paradigm', text: 'Don\'t get attached to whether paradigm is "objectively true." The test is: does it work? Does it produce results? If yes, it\'s true-enough. If no, discard it regardless of how intellectually appealing.' },
          { title: 'Paradox Is Okay', text: 'You can believe contradictory things in different contexts. You\'re a biological machine AND consciousness shapes reality AND you\'re spiritual being. These aren\'t true-false; they\'re perspectives. Master holds all. Fundamentalist argues which is "really true"' },
          { title: 'Challenge Your Certainty', text: 'Whatever you\'re absolutely certain about is your limitation. Test it. If certain "magic impossible," try magic seriously. If certain "people don\'t change," find someone who did. Certainty is where paradigm has you trapped' },
          { title: 'Experiment Without Judgment', text: 'Try new paradigm like trying on clothes. Don\'t argue whether it\'s "correct." Just wear it and notice how you feel, what becomes possible, what results manifest. Judgment prevents real test.' },
      ]},
      resources: { title: 'Resources', items: [
          'Condensed Chaos by Phil Hine (paradigm fluidity)',
          'Prometheus Rising by Robert Anton Wilson (belief system as choice)',
          'The Ego Tunnel by Thomas Metzinger (perception construction)',
          'Quantum Mechanics and Consciousness by various authors (observer effects)',
          'The Kybalion (Hermetic correspondence and relativity principles)'
      ],
      },
    },
  },
  {
    name: 'Energetic Awareness',
    emoji: '⚡',
    description: 'Chaos Magick - Develop sensitivity to subtle energies and psychic currents',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Development',
            tabs: [
              {
                name: 'Energy Reality & Neurological Basis',
                categories: [
                  { name: 'Energy Reality & Neurological Basis', emoji: '👁️', content: [
                    { attribute: 'Scientific Perspective', value: 'Western science claims: "No aura," "Chi is metaphor," "Chakras are imagination". Yet billions report genuine perception and Eastern medicine mapped energy systems for 5000 years. The truth: Western science measures wrong things.' },
                    { attribute: 'Electromagnetic Reality', value: 'Every human generates measurable electromagnetic field: EKG measures around heart, EEG measures around brain. Every living system has measurable electrical activity. Consciousness IS electromagnetic pattern. Science hasn\'t adequately measured full human electromagnetic field, so claims it doesn\'t exist. Meanwhile, billions produce documented results.' },
                    { attribute: 'Energy Systems Are Biological', value: '"Aura" = your electromagnetic field. "Chi" = nervous system\'s electrical flow. "Chakras" = energy junction points in nervous system. These are neurobiological, not mystical. What you\'re developing: perception of real, measurable phenomena your conscious mind typically misses.' },
                    { attribute: 'What You\'re Actually Learning', value: 'You\'re not developing supernatural abilities—you\'re training perception of natural phenomena that exist but are normally unconscious. Billions of people perceive and work with these energies successfully. This is learnable, teachable, verifiable skill.' },
                  ]},
                ]
              },
              {
                name: 'Sensory Channel Development',
                categories: [
                  { name: 'Sensory Channel Assessment & Development', emoji: '🎨', content: [
                    { attribute: 'Channel Types', value: 'VISUAL: Do you see auras, light, color shifts? Develop visual aura reading. TACTILE: Do you feel temperature, tingling, density? Develop hands-on sensing. EMOTIONAL: Do you pick up others\' feelings? Develop emotional sensitivity. KINESTHETIC: Feel energy in body (spine tingling, heart warmth)? Develop internal awareness. CLAIRVOYANT: Do you "just know" without sensory input? Develop pure intuitive knowing.' },
                    { attribute: 'Native Channel Identification', value: 'Spend one week with each channel. Most people discover 1-2 NATIVE channels naturally talented. CRITICAL: Develop NATIVE channels first. Forcing non-native is frustrating and slow. Example: If tactile, learn through hands (proficient in 4 weeks). If forcing tactile when visual, struggle for months.' },
                    { attribute: 'Progression Timeline', value: 'Week 1-2: Identify native channel. Week 3-8: Develop native to mastery. Week 9-16: Add secondary channel if desired. Month 6+: Integrate all channels. Result: Month 6, true multi-channel perception becomes natural.' },
                    { attribute: 'Testing Protocol', value: 'Systematically test each sensory channel: spend one week focusing on visual perception only, one week on tactile, one week on emotional, etc. Track which feels most natural, most accurate, most easy to develop. That\'s your native channel—prioritize developing it first.' },
                  ]},
                ]
              },
              {
                name: 'Hands-On Energy Sensing',
                categories: [
                  { name: 'Hands-On Energy Sensing Practice', emoji: '🤝', content: [
                    { attribute: 'Overview & Timeline', value: 'Most learnable method. Requires 10-30 min daily for 4-6 weeks. Produces reliable, measurable results. This is the fastest path to genuine energy perception for most practitioners.' },
                    { attribute: 'Week 1-2: Building Sensitivity', value: '(1) Rub hands vigorously 30 seconds until warm. (2) Hold palms 6 inches apart, facing each other. (3) Slowly move one hand toward other (maintain 2-4 inch gap). (4) Notice: warmth, tingling, pressure, density, magnetism. (5) Reverse direction, notice if sensations change. (6) Practice 5-10 minutes daily. Result: Most feel something within 2-3 days (obvious heat/pressure or subtle vibration/resistance).' },
                    { attribute: 'Week 3-4: Sensing Others', value: '(1) Partner sits across from you. (2) Hold hands 6 inches from body (without touching). (3) Slowly scan up/down body, 2-3 inches away. (4) Notice strongest sensations, resistance, heat, cold, tingling. (5) Ask partner to confirm where they feel pain/illness/emotional intensity. Result: Your sensations correspond to their problem areas. You\'re reading real energy information.' },
                    { attribute: 'Week 5-6 & Progression Indicators', value: 'Move to 1-2 feet distance. Sense their energy field from distance. Notice size, density, coherence, gaps, dark spots. Develop accuracy through frequent practice with feedback. Week 2: Feel your own energy. Week 4: Sense others\' energy location. Week 8: Read energy quality (healthy/blocked/depleted). Month 4: Diagnose energy problems in detail. Month 6: Automatic—reading without conscious effort.' },
                  ]},
                ]
              },
              {
                name: 'Aura Visualization & Reading',
                categories: [
                  { name: 'Aura Visualization & Reading Technique', emoji: '🌈', content: [
                    { attribute: 'Overview & Preparation', value: 'Less common than hands-on, but develops impressive visual skill. Week 1 Preparation: Create neutral background (white wall, light, outdoor grass). Person sits with white wall behind them. Dim lights slightly—softer than normal, not dark. Relax your eyes. UNFOCUS gaze (like 3D stereogram art).' },
                    { attribute: 'Practice Phase', value: 'Week 1-2 Practice: Look at person\'s head/shoulders. Soft focus—don\'t stare hard. Within 30 seconds: colored haze, light, shimmer, glow. THIS IS AURA. Don\'t analyze—observe. Notice colors, size, brightness, movement. Practice 2-3 minutes daily for 2 weeks. Consistency is key—daily practice builds perception.' },
                    { attribute: 'Aura Interpretation', value: 'Week 3+ Interpretation: SIZE: Expanded = healthy, Contracted = depleted. COLOR: Red = passion/anger, Orange = creativity/joy, Yellow = clarity/intellect, Green = healing/growth, Blue = truth/communication, Purple = spirituality/wisdom, Black spots = blocks/illness. BRIGHTNESS: Bright = vital, Dull = depleted. COHERENCE: Smooth = balanced, Spiky/jagged = chaotic/agitated.' },
                    { attribute: 'Skill Development & Validation', value: 'Week 2: See colors around everyone. Week 4: Identify 2-3 colors per person. Week 8: Read full spectrum and interpret. Month 4: Automatic—see auras in normal light. Validation: Ask person "What emotions are you experiencing?" If reading matches state: Your skill is accurate. High accuracy (>80%) develops within 6-8 weeks daily practice.' },
                  ]},
                ]
              },
            ]
          },
          {
            name: 'Practice & Application',
            tabs: [
              {
                name: 'Grounding & Energy Circulation',
                categories: [
                  { name: 'Grounding & Energy Circulation', emoji: '⚡', content: [
                    { attribute: 'Foundational Importance', value: 'Without proper grounding: Energy work ineffective, you become depleted/scattered. Grounding is THE foundational practice—masters practice daily, sometimes multiple times daily. All other energy work depends on solid grounding.' },
                    { attribute: 'Grounding Technique (5 minutes)', value: '(1) Stand barefoot on earth (grass, soil, sand) OR visualize roots from feet into earth. (2) Breathe deeply. Each inhale: draw earth energy UP through feet → legs → spine. (3) Energy color: green, golden, or brown—whatever feels earthy. (4) As energy rises: feel SOLID, PRESENT, CONNECTED. (5) Exhale: extend energy throughout body. Feel it stabilizing. (6) Practice daily. Result: Stronger auras, clearer intuition, more power.' },
                    { attribute: 'Energy Circulation (10 minutes)', value: 'Once grounded, circulate intentionally: (1) Draw earth energy UP left side of spine. (2) At crown: energy flows DOWN right side of spine. (3) This creates circuit—continuous flowing. (4) Visualize: green light spiraling up left, golden light down right. (5) Eventually automatic—natural circulation without effort. Combined result: Grounded + circulating = constant vitality, strong presence, natural magnetism.' },
                    { attribute: 'Daily Practice Protocol', value: 'Morning: Spend 5 minutes grounding when you wake. This sets your baseline for the day. Throughout day: Return to grounding whenever you feel scattered, tired, or drained. Evening: Circulate energy before sleep. Masters practice continuous circulation even during other activities. This becomes automatic after consistent practice.' },
                  ]},
                ]
              },
              {
                name: 'Hands-On Energy Healing',
                categories: [
                  { name: 'Hands-On Energy Healing Protocol', emoji: '💫', content: [
                    { attribute: 'Protocol Steps', value: '(1) Ground yourself fully. If not grounded, you deplete attempting to heal. (2) Assess person\'s energy (where blocked, heavy, dark, stagnant?). (3) Check intention: Do you genuinely wish them well? If resentment exists, work it out first. (4) Place hands 2-6 inches from body, targeting problem area. (5) Gather earth energy through feet → body → hands into them. (6) Visualize: Dark stuck energy becomes clear, blocked areas open, depleted areas refill. (7) Hand movements: Pull stuck energy away, sweep blockages, push new energy in, smooth field.' },
                    { attribute: 'Session Duration & Completion', value: 'Work 5-15 minutes. Stop when sensing completion: balanced energy, person reports relief, you feel the shift. Ground after. You may have picked up stuck energy; release to earth. Never take client\'s energy into your body—always return it to earth after healing session.' },
                    { attribute: 'Effectiveness Factors', value: 'How much transformation happens depends on: YOUR SKILL LEVEL (Beginners 10-20%, Intermediates 40-60%, Masters 80-100%). THEIR WILLINGNESS (Resistant people won\'t change much). YOUR GROUNDING/CLARITY (Tired or conflicted helpers ineffective). You can amplify your effectiveness by: getting better trained, working with willing people, maintaining strong grounding.' },
                    { attribute: 'Ethical Practice', value: 'Never force healing. Always ask permission. Respect if someone refuses. Their body, their choice. Forced work can backfire—rejection or damaged integrity. This is consent-based healing. Building trust and respect increases effectiveness dramatically. Never diagnose medical conditions. Refer serious symptoms to doctors.' },
                  ]},
                ]
              },
              {
                name: 'Space Cleansing Protocols',
                categories: [
                  { name: 'Space Cleansing Protocols', emoji: '🏠', content: [
                    { attribute: 'Principle & Diagnosis', value: 'Spaces accumulate energy from occupants. Conflict room = tense. Healing space = safe. You can transform intentionally. Walk slowly through space. Notice: Heavy/light? Tense/relaxed? Clear/confused? Dark/bright areas? These reveal space\'s energetic state. Pay attention to your gut feeling about the space—that\'s real data.' },
                    { attribute: 'Method 1: Sound Cleansing (10-15 min)', value: '(1) Open windows for stagnant energy to leave. (2) Ring bell, clap hands, sing, or play music CONTINUOUSLY. (3) Vibration breaks up stuck energy. (4) Sound must be loud, clear, penetrating every corner. Walk through entire space with sound, hitting corners and edges.' },
                    { attribute: 'Method 2: Visualization (10-15 min)', value: '(1) Stand in center. (2) Visualize bright white/golden light from your heart. (3) Expand to fill entire space, pushing darkness out windows/doors. (4) Imagine darkness dissolving in light. (5) Hold until space feels clear. You feel the shift—the space lightens.' },
                    { attribute: 'Method 3 & 4: Physical & Verbal', value: 'Method 3 Physical: Open all windows. Burn sage, incense, or palo santo (smoke carries intention). Spray salt water (1 tsp salt per cup) into corners. Walk perimeter clockwise: "This space is cleared, healed, blessed". Method 4 Spoken: Speak with authority, conviction, intention: "This room is cleansed. Old energy releases. New energy enters. This space is light, safe, clear." Maintenance: Cleanse monthly or after intense events (arguments, illness, sadness). Validation: After cleansing, people entering should notice: "Feels lighter" or "Feel better here".' },
                  ]},
                ]
              },
              {
                name: 'Advanced Energy Sensing',
                categories: [
                  { name: 'Advanced Energy Sensing & Diagnosis', emoji: '📈', content: [
                    { attribute: 'Skill Progression Levels', value: 'BEGINNER (Weeks 4-8): Location of blockages, General health state (vital/depleted), Emotional tone (clear/chaotic), Protective boundaries (open/closed). INTERMEDIATE (Weeks 12-24): Specific emotions being held, Physical illness locations, Past trauma stored in field, Relationship dynamics in aura. ADVANCED (Months 6+): Root causes of health issues, Spiritual blocks, Soul-level information, Future health trends, Karmic patterns.' },
                    { attribute: 'Reading Protocol', value: '(1) Ground yourself. (2) Set intention: "I read this energy for their highest good". (3) Scan systematically: Feet = Grounding, Lower body = Sexuality/survival, Belly = Will/power, Heart = Emotions/relationships, Throat = Communication/truth, Head = Thought/perspective, Crown = Spirituality. (4) Notice at each: Color, brightness, size, movement, blockages, strength. (5) Trust intuitive hits—don\'t analyze, just report. (6) Ask for feedback: "Where was I accurate?" This trains perception.' },
                    { attribute: 'Common Energy Patterns', value: 'Tight shoulders/neck = Stress/unexpressed anger. Dark heart spots = Unresolved grief. Murky lower abdomen = Sexual wounding. Contracted aura = Fear/trauma. Expanded aura = Confidence/health. Bright chakras = Open/healthy. Dim chakras = Blocked/depleted. Black spots = Damage or stuck trauma. Recognize these patterns to provide accurate readings.' },
                    { attribute: 'Critical Safety & Ethics', value: 'Never diagnose medical conditions from energy reading. Energy work COMPLEMENTS medicine, never replaces. Serious symptoms = direct to doctors. Always frame readings as information, not diagnosis. Never scare people with predictions. Always suggest professional help for serious physical or mental health issues. Your role: perceive and share information, not diagnose or prescribe.' },
                  ]},
                ]
              },
              {
                name: 'Shield Construction',
                categories: [
                  { name: 'Shield Construction & Maintenance', emoji: '🛡️', content: [
                    { attribute: 'Principle & Basic Shield', value: 'Aura naturally protects, but regular shield-building strengthens dramatically. BASIC SHIELD (2 minutes daily): (1) Ground yourself fully. (2) Visualize bright white/golden light surrounding entire body, 2-3 feet out. (3) Intention: "This shield protects me. Negativity bounces off. I am safe". (4) Feel shield\'s solidity, impermeability, power. (5) Maintain visualization 30 seconds to 2 minutes. Duration: Lasts 4-8 hours.' },
                    { attribute: 'Shield Variations', value: 'MIRROR SHIELD (Advanced): Reflect negativity back to sender. Visualize shield as mirror. All negative energy bounces back to source. Teaches attackers not to target you. Requires clear conscience—mirrors reflect ALL your energy. ARMOR SHIELD (Intense Situations): For confrontations, interviews, high-stress. Visualize medieval armor covering body. Impenetrable, strong. CRYSTALLINE SHIELD (Protection + Clarity): Visualize aura as clear crystal. Nothing murky passes through. Light flows freely. Choose shield type based on situation needs.' },
                    { attribute: 'Shield Maintenance & Testing', value: 'Recharge daily (morning ideal). Test shield by noticing: Calm in chaotic situations? Rude comments bounce off? Energized after social events? If NO to any: Shield needs strengthening. Strength progression: Week 1: Lasts 2-4 hours. Week 4: Lasts 8-12 hours. Month 3: Constant—wake with it strong. Year 1: Automatic—maintain unconsciously, even during sleep.' },
                    { attribute: 'Troubleshooting Weak Shields', value: 'If shield keeps failing: Check grounding—weak shield usually means you\'re not grounded. Check energy state—depleted people can\'t hold strong shields. Check conviction—doubt weakens shields. Rebuild: full grounding, stronger visualization, clear intention. Practice daily. Weak shields get stronger with use—like muscles, they strengthen with exercise.' },
                  ]},
                ]
              },
              {
                name: 'Cord Cutting & Release',
                categories: [
                  { name: 'Cord Cutting & Energetic Release', emoji: '✂️', content: [
                    { attribute: 'Understanding Cords', value: 'Emotional attachments create energetic cords (measurable electromagnetic connections). Healthy cords = balanced flow both directions. Unhealthy cords = stuck energy, one person draining other. Notice relationships where: you feel drained after contact, think about them constantly, can\'t move on, feel controlled/controlling. These have unhealthy cords needing attention.' },
                    { attribute: 'Cord Cutting Protocol', value: '(1) Sit quietly. Ground yourself. (2) Visualize person clearly. Notice cord(s)—color, thickness, texture, body location. (3) Acknowledge: "This cord served [purpose]. Thank you for connection". (4) Consciously sever using chosen method: Sword/knife cutting through, Scissors cutting, Light dissolving, Fire burning, Wind blowing away. (5) As cord severs: feel release—stuck energy flowing out, your energy returning. (6) Ground stuck energy to earth. (7) Fill space with clean light. (8) Thank person: "I wish you well. We release with love".' },
                    { attribute: 'Emotional Timeline & Multiple Cuts', value: 'After cutting: Feel lighter immediately OR sadder/emptier for 24 hours (grief of disconnection). This grief passes—normal. Some cords need cutting multiple times (old lovers, enmeshed family). Recut as needed. Eventually cord stops regrowing—attachment truly released. Each cutting becomes easier as you practice.' },
                    { attribute: 'Creating Healthy Cords', value: 'Create healthy cords with people you love: Visualize cord of gold light between your hearts. Intention: "We connect with love, respect, healthy flow". These deepen intimacy without entanglement. Healthy cords feel light, flowing, nourishing. Practice with loved ones to strengthen bonds with people who genuinely support you.' },
                  ]},
                ]
              },
              {
                name: 'Intention Discernment',
                categories: [
                  { name: 'Intention Discernment & Protection', emoji: '🎯', content: [
                    { attribute: 'Early Warning Signs', value: 'People project intention constantly—consciously and unconsciously. Mastery protects from manipulation. Notice how you FEEL around people. Energetically: Warm/open = Good intentions. Cold/sharp = Harmful intentions. Needy/desperate = Self-serving. Trust gut feelings—they\'re accurate energy reading. Your body knows before your mind does.' },
                    { attribute: 'Deeper Discernment Training', value: 'As sensitivity develops, read intention directly: (1) Look at person. Notice energy quality. (2) Ask silently: "What is their true intention toward me?". (3) Notice what arises—images, words, feelings, knowing. At first: Miss many cues. With practice: Accuracy increases dramatically. Don\'t overthink—trust first impression.' },
                    { attribute: 'Common Intention Patterns', value: 'PREDATOR: Cold, focused, specifically targeting your energy/resources. VICTIM: Needy, draining, unconsciously pulling energy for comfort. MANIPULATOR: Warm but calculating—nice words, planning to use you. GENUINE: Warm, open, actually wishing well. TRUE FRIEND: Energy expands when you appear; celebrates your joy. Learn to distinguish between these patterns.' },
                    { attribute: 'Protection Protocol', value: 'When sensing harmful intention: (1) Strengthen shield immediately. (2) If ongoing: Cut cord, limit contact, or set boundaries. Example: "I\'m not available for that". Important: Don\'t judge people as "bad" based on harmful intentions—may be unconscious. Some harmlessly project neediness. Others deliberately target you. Learn to distinguish. Your job: Protect energy WITHOUT judgment.' },
                  ]},
                ]
              },
              {
                name: 'Emotional Contagion Mastery',
                categories: [
                  { name: 'Emotional Contagion Mastery', emoji: '🦠', content: [
                    { attribute: 'How Emotional Contagion Works', value: 'Emotions spread through proximity like viruses. Angry person enters: Everyone feels tense. Depressed person joins: Energy drops. Mechanism: Neurobiological (mirror neurons) + energetic (aura merging). You literally absorb others\' emotional states through your energy field and nervous system. This is real, measurable, biological phenomenon.' },
                    { attribute: 'Phase 1: Awareness', value: 'Notice when you adopt others\' emotions. Example: You\'re laughing, friend arrives sad—you suddenly feel sad. Question: Did YOU change? Or absorbed their emotion? With awareness: Notice this happening constantly. Track it: How often does your mood shift based on people around you? Most discover they\'re emotional sponges once they notice the pattern. This awareness is first step to change.' },
                    { attribute: 'Phase 2: Maintaining Boundaries', value: 'Practice maintaining YOUR emotional state while others differ. Technique: Keep ground strong. Shield strong. Remember: "This is their emotion. I acknowledge without adopting it". When someone\'s sadness appears, you can notice it and feel compassion WITHOUT adopting their sad mood. You remain yourself while staying connected.' },
                    { attribute: 'Phase 3: Emotional Independence (Advanced)', value: 'Become emotionally independent—your state = YOUR thoughts/values, not environment. Example: Depressed person enters—you remain peaceful because you\'re CHOOSING peace. Protection techniques: GROUNDING - reminds you of YOUR stability independent of others. SHIELDING - prevents full energetic merging. CONSCIOUS BOUNDARY - "I appreciate your feelings and maintain my clarity". VISUALIZATION - see emotions flowing past like clouds without sticking. Timeline: 3-6 months conscious practice brings natural emotional independence. Result: Other people\'s moods stop hijacking yours. Massive upgrade to quality of life. You\'re emotionally sovereign.' },
                  ]},
                ]
              },
            ]
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Energy is Information in Motion', content: 'Chaos magic understands energy as organized information, not mystical force. Electricity is organized electromagnetic energy. Thought is organized neural energy. Emotion is organized neurochemical/energetic pattern. Everything is information structuring itself into patterns. What we call "aura" is organized electromagnetic field surrounding living beings. What we call "chi" or "prana" is flowing organized energy through the nervous system. What we call "psychic attack" is directing negative thought-energy toward someone. These are not supernatural—they\'re natural processes of how consciousness and biology organize energy. What\'s supernatural is the Western denial that this happens. Developing energy awareness means learning to perceive what\'s actually there but normally unconscious' },
          { heading: 'Imagination Directs Energy', content: 'The fundamental mechanism of energy work: intention + visualization = direction. Wherever your imagination focuses, energy follows. This isn\'t metaphor—it\'s literally how the nervous system works. When you imagine heat, real blood flow increases (measured effect). When you imagine pulling energy up spine, real neurological activation occurs. When you imagine sending healing to someone, their body processes it (placebo documented). Imagination is not "fake"—it\'s the mechanism that directs consciousness and therefore directs energy. Master energy worker has vivid imagination coupled with conviction. Imagination without conviction is daydream; conviction without imagination is unfocused intention. Combined: magic' },
          { heading: 'Electromagnetic Body and Field', content: 'Every living being is electromagnetic: heart generates strongest electromagnetic field in body (5000x stronger than brain); nervous system is electrical network; every cell maintains electrical gradient across membrane. Science measures these fields with EKG (heart) and EEG (brain). We don\'t measure the full aura because we don\'t look for it, not because it doesn\'t exist. The aura is your electromagnetic field extending 3-10 feet from body (measurable with sensitive equipment). You interact with others\' fields before touching them—this is why "bad vibes" are real. The field carries information about person\'s health, emotional state, intentions. Sensitive people read this information subconsciously. Trained people read it consciously' },
          { heading: 'Energy Vampirism and Parasitism', content: 'Some people are energetically healthy (give energy back); some are neutral (exchange equally); some are energy vampires (drain more than they give back). This is neurobiological not malevolent: highly anxious person needs others\' energy to feel okay, doesn\'t realize they\'re draining. Aware practice: notice who makes you tired vs energized. Limit time with draining people. Build strong shields. Strong practitioners give energy consciously; weak practitioners leak energy unconsciously or take others\' to feel whole. Energetic awareness means recognizing this pattern and protecting yourself. You can help draining people but not at cost of your own health' },
          { heading: 'Psychic Attack and Defense', content: 'Thoughts directed at you carry energy: anger, resentment, jealousy, judgment directed at you are energetic attacks. These create disturbance in your field and potentially affect your health (documented that prolonged judgment/stress causes illness). Some attacks are conscious (someone wishing harm); most are unconscious (someone angry at you unconsciously directing energy). Defense: strong shield (visualization of protection), clearing stuck energy (cleansing), limiting contact, cord-cutting attachment. Return to sender: visualize attack bouncing back without you being affected. Most important: develop strong sense of self, strong boundaries, strong will. A person with clear strong energy cannot be attacked successfully' },
        ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Begin with self-awareness: notice your energy state throughout day—when full, when depleted, when clear, when cloudy',
          'Practice simple energy feeling: hold hands over another person (without touching), palms facing, notice any sensation—heat, tingling, thickness, flow',
          'Develop auric sensitivity: look at person\'s head in soft light, unfocus eyes slightly, notice colored light/haze around them; start with yourself in mirror',
          'Learn energy grounding: imagine roots growing from feet deep into earth, draw grounding energy up spine, feel more present and solid',
          'Practice clearing stuck energy: visualize bright light filling a space, then visualize darkness flowing out. Do this in your bedroom, office, any space that feels heavy',
          'Develop shielding: visualize bright protective light around entire body, set intention that negativity cannot penetrate your field',
          'Notice others\' energetic states: who leaves you energized vs depleted? Who has clear energy vs murky? Don\'t judge, just notice',
          'Practice cord-cutting with people you have complicated relationships with: visualize cord, cut it consciously, release attachment while wishing them well',
          'Experiment with directing energy: gather energy in hands and project it into plant, person, or space; notice any response',
          'Keep sensitivity journal: track correlations between your perceptions and actual outcomes; refine your sensitivity over time',
      ]},
      tips: { title: 'Tips for Practice', items: [
          { title: 'Subtle Doesn\'t Mean Weak', text: 'Energy perception is subtle—you might miss it if you\'re looking for dramatic effects. The slight warmth between hands, the barely-noticed color, the faint pressure—these are real. Develop sensitivity to subtlety.' },
          { title: 'Belief Helps But Isn\'t Required', text: 'If you don\'t believe in aura, you won\'t perceive it. But you can experiment without belief: "If auras existed, how would I perceive them?" This reframe allows exploration without commitment.' },
          { title: 'Protect Yourself', text: 'As sensitivity develops, you\'ll perceive more people\'s emotions/energy/intention. Without shielding, you\'ll be overwhelmed. Strong shields and boundaries are essential for sensitive people. Develop them early.' },
          { title: 'Energy Work Requires Conviction', text: 'Half-hearted attempts fail. Whether you\'re directing energy, creating shield, or clearing space—do it with full conviction. Your wavering doubt weakens the work. Commit fully or don\'t attempt.' },
          { title: 'Practice Builds Sensitivity', text: 'Like any skill, energy work improves with practice. The more you practice perception, direction, and shielding, the more natural and powerful it becomes. Consistency matters more than intensity.' },
      ]},
      resources: { title: 'Resources', items: [
          'The Kybalion: Hermetic principle of vibration (all is vibration)',
          'Hands of Light by Barbara Brennan (aura and energy anatomy)',
          'The Energy Body by Ted Andrews (practical energy development)',
          'Psychic Protection by William Bloom (shielding and boundaries)',
          'Chakra System and Energy Work: foundational anatomy for energy practitioners'
      ],
      },
    },
  },
  {
    name: '🐉 Draconian Magick 🐉',
    isSpacer: true,
  },
  {
    name: 'Elemental & Archetypal Visualization',
    emoji: '🌊',
    description: 'Dragon Magick - Invoke draconic force through elemental embodiment',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Elemental Dragons',
            tabs: [
              {
                name: 'Fire Dragon',
                categories: [
                  { name: 'Fire Dragon: Visualization & Embodiment', emoji: '🔥', content: [
                    { attribute: 'Appearance & Invocation', value: '🔥 APPEARANCE\nMassive red/gold dragon. Scales like molten metal. Eyes bright as suns. Steam from nostrils. Breath smells like sulfur and lightning. Presence radiates pure heat and power' },
                    { attribute: 'Invocation Script (5-10 min)', value: '📋 STEP-BY-STEP\n(1) Ground fully. Feel earth beneath you\n(2) Feel heat building in solar plexus—tiny flame growing\n(3) Breathe deeply. Each breath: flame grows larger, hotter, fiercer\n(4) Visualize fire dragon landing before you. Feel its heat\n(5) Step into dragon. Feel body transforming. Spine = column of fire. Hands = claws. Voice = roar\n(6) FIERCE, DIRECT, UNSTOPPABLE\n(7) Act/speak/decide from this state' },
                    { attribute: 'Embodiment Effects', value: '⚡ WHAT YOU\'LL EXPERIENCE\n• Eliminates doubt\n• Removes mercy from weak choices\n• Activates warrior instinct\n• Makes you speak truth bluntly\n• Creates commanding presence\n\nRESULT: Hesitation disappears. Complications burn away. You = simplicity and power' },
                    { attribute: 'Duration & Progression', value: '⏱️ TIMELINE\nStart: 5 minutes\nWeek 2: 10-15 minutes\nMonth 2: 15-30 min comfortable\nMonth 3: Can hold as long as needed\n\nExtend gradually as comfort increases' },
                    { attribute: 'Uses & Integration', value: '🎯 WHEN TO EMBODY FIRE DRAGON\n• Difficult conversations\n• Hard decisions\n• Breaking limiting patterns\n• Claiming authority\n• Standing ground\n\n💪 INTEGRATION TIMELINE\nAfter 40+ hours embodiment: Become naturally more direct, powerful, courageous\nFierceness becomes baseline' },
                  ]},
                ],
              },
              {
                name: 'Water Dragon',
                categories: [
                  { name: 'Water Dragon: Visualization & Embodiment', emoji: '🌊', content: [
                    { attribute: 'Appearance & Invocation', value: '🌊 APPEARANCE\nSinuous blue/silver dragon flowing like water. Scales like moonlit waves. Eyes like deep ocean. Breath like sea mist. Movement graceful, adaptive, hypnotic. Presence mysterious, unknowable' },
                    { attribute: 'Invocation Script (5-10 min)', value: '📋 STEP-BY-STEP\n(1) Ground yourself. Feel your emotions—all of them\n(2) Feel coolness/wetness building in heart and belly\n(3) Breathe slowly, undulating. Energy flows like ocean currents\n(4) Visualize water dragon coiling around you. Feel it merge\n(5) Spine = river. Emotions = waves. Consciousness = ocean depth\n(6) FEEL rather than think\n(7) Move slowly, fluidly, adapting to each moment' },
                    { attribute: 'Embodiment Effects', value: '💧 WHAT YOU\'LL EXPERIENCE\n• Accesses subconscious wisdom\n• Reveals hidden truths\n• Develops psychic sensitivity\n• Makes you adaptable and graceful\n• Activates emotional depth\n• Creates mystery/magnetism\n\nRESULT: Emotions clarify. Hidden knowledge surfaces. Understand without words' },
                    { attribute: 'Duration & Progression', value: '⏱️ TIMELINE\nStart: 5 minutes\nWeek 2: 10-15 minutes\nMonth 2: 30+ min comfortable\nMonth 3: Extended holds possible\n\nWater can be held longer than fire (less intense)' },
                    { attribute: 'Uses & Integration', value: '🎯 WHEN TO EMBODY WATER DRAGON\n• Navigating emotional complexity\n• Accessing intuition\n• Understanding others deeply\n• Shadow work\n• Psychic development\n• Transformation\n\n💙 INTEGRATION TIMELINE\nAfter 40+ hours: Become naturally intuitive, emotionally wise, graceful\nPeople sense your mystery and depth' },
                  ]},
                ],
              },
              {
                name: 'Earth Dragon',
                categories: [
                  { name: 'Earth Dragon: Visualization & Embodiment', emoji: '🌍', content: [
                    { attribute: 'Appearance & Invocation', value: '🌍 APPEARANCE\nMassive green/brown dragon, ancient and solid. Scales like stone/earth. Eyes like deep wells. Breath heavy and grounding. Presence absolutely stable, immovable, unshakeable' },
                    { attribute: 'Invocation Script (5-10 min)', value: '📋 STEP-BY-STEP\n(1) Ground deeply. Feel earth supporting completely\n(2) Feel heaviness, solidity, mass building in lower body\n(3) Breathe slowly, powerfully. Become denser, more real, more solid with each breath\n(4) Visualize earth dragon settling into your body. Anchor to ground\n(5) Feet = roots. Bones = stone. Presence = immovable\n(6) KNOW what is real. Make solid decisions. Trust earth\n(7) Feel wealth, abundance, protection flowing naturally' },
                    { attribute: 'Embodiment Effects', value: '⛰️ WHAT YOU\'LL EXPERIENCE\n• Creates unshakeable stability\n• Develops manifestation power\n• Attracts prosperity\n• Creates protective presence\n• Makes you utterly reliable\n• Grounds completely' },
                    { attribute: 'Duration & Progression', value: '⏱️ TIMELINE\nStart: 5 minutes\nWeek 2: 10-20 minutes\nMonth 2: 20-30 min comfortable\nMonth 3: Extended holds easy\n\nEarth dragon is grounding—can be held for long periods' },
                    { attribute: 'Uses & Integration', value: '🎯 WHEN TO EMBODY EARTH DRAGON\n• Manifestation magic\n• Wealth/prosperity work\n• Grounding scattered energy\n• Protection\n• Creating stability\n• Manifesting dreams into physical reality\n\n💰 INTEGRATION TIMELINE\nAfter 40+ hours: Become naturally prosperous, stable, protective, magnetic to abundance\nPeople trust you completely' },
                  ]},
                ],
              },
              {
                name: 'Air Dragon',
                categories: [
                  { name: 'Air Dragon: Visualization & Embodiment', emoji: '💨', content: [
                    { attribute: 'Appearance & Invocation', value: '💨 APPEARANCE\nSleek yellow/white dragon, ethereal and swift. Scales like lightning. Eyes bright and clear. Breath like wind. Movement impossibly fast and free. Presence transcendent, visionary, unbounded' },
                    { attribute: 'Invocation Script (5-10 min)', value: '📋 STEP-BY-STEP\n(1) Ground lightly. Feel yourself becoming less dense\n(2) Feel lightness building—gravity releasing you\n(3) Breathe deeply, swiftly. Consciousness expands, widens, reaches infinitely\n(4) Visualize air dragon circling you. Feel it lift consciousness upward\n(5) Body = light. Mind = vast. Perspective = cosmic\n(6) SEE clearly. Understand systems. Perceive truth. Communicate powerfully\n(7) Freedom = natural state. Limitations dissolve' },
                    { attribute: 'Embodiment Effects', value: '✨ WHAT YOU\'LL EXPERIENCE\n• Expands consciousness\n• Creates clarity of vision\n• Develops communication power\n• Makes you see perspectives others miss\n• Activates intellect\n• Creates freedom\n• Allows transcendence' },
                    { attribute: 'Duration & Progression', value: '⏱️ TIMELINE\nStart: 5 minutes\nWeek 2: 10-15 minutes\nMonth 2: 15-20 min comfortable\nMonth 3: Longer holds possible\n\nAir dragon challenging to hold initially (so expansive)' },
                    { attribute: 'Uses & Integration', value: '🎯 WHEN TO EMBODY AIR DRAGON\n• Gaining clarity on complex situations\n• Communication/teaching\n• Strategic thinking\n• Visionary work\n• Breaking mental/emotional limitations\n• Transcendence\n\n🦅 INTEGRATION TIMELINE\nAfter 40+ hours: Become naturally clear, wise, eloquent, free\nPeople listen to you profoundly' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Draconic Archetypal Forms',
            tabs: [
              {
                name: 'The Destroyer',
                categories: [
                  { name: 'The Destroyer: All-Consuming Annihilation', emoji: '🔥', content: [
                    { attribute: 'Purpose & Vision', value: '🔥 CORE FUNCTION\nObliterate what no longer serves. Burns through everything blocking your evolution\n\n💀 APPEARANCE\nMassive, terrifying, all-consuming. Eyes like apocalypse. Breath = pure destruction' },
                    { attribute: 'Visualization Protocol', value: '🔥 HOW TO SEE IT\nSee Destroyer as pure force of transformation through annihilation. Invoke when ready for RADICAL change\n\nVisualization: Dragon made of pure fire, consuming everything in path, leaving only ash and new growth' },
                    { attribute: 'Embodiment Technique', value: '⚡ STEP-BY-STEP\nCall Destroyer. Feel anger, rage, sacred fury. Let it FLOW\n\nFrom Destroyer consciousness:\n• Speak truth without mercy\n• Make hard decisions quickly\n• End what needs ending\n• Set boundaries absolutely\n• Do not soften or apologize' },
                    { attribute: 'Specific Uses', value: '🎯 WHEN TO CALL DESTROYER\n• Ending relationships that drain you (quickly, completely, no regret)\n• Breaking addictions (burn pattern entirely)\n• Destroying old identity (burn who you were so new emerges)\n• Eliminating obstacles (if negotiation won\'t work, destroy)\n• Clearing stuck energy (burn it all)' },
                    { attribute: 'Teaching & Ethics', value: 'DESTROYER TEACHES: Some things MUST be destroyed, not negotiated\n\n⚠️ ETHICS WARNING\nDestroyer is amoral. Destroys indiscriminately. Use with clear intention about what you\'re burning away\nIf destroying carelessly: You\'ll regret it\nUsed wisely: Liberates you from what\'s holding you back' },
                  ]},
                ],
              },
              {
                name: 'The Nurturer',
                categories: [
                  { name: 'The Nurturer: Fierce Protection & Sacred Love', emoji: '💚', content: [
                    { attribute: 'Purpose & Vision', value: '💚 CORE FUNCTION\nFiercely protect what matters. Loves absolutely. Will DESTROY anything threatening its charges\n\n🔥 APPEARANCE\nPowerful yet warm. Eyes like fierce mother. Breath like life-giving fire' },
                    { attribute: 'Visualization Protocol', value: '💕 HOW TO SEE IT\nNurturer = protection + love merged. Would burn world to protect charges\nInvoke when defending what matters most\n\nVisualization: Dragon fierce and loving, heart of fire, encircling what it protects' },
                    { attribute: 'Embodiment Technique', value: '⚡ STEP-BY-STEP\nCall Nurturer. Feel your love for what matters. Feel protective instinct. Let tenderness FUEL fierceness\n\nFrom Nurturer consciousness:\n• Become absolutely reliable\n• Say no to protect, yes to nourish\n• Love fiercely and protect absolutely\n• Call out harm instantly\n• Nurture others\' growth without absorbing their responsibility' },
                    { attribute: 'Specific Uses', value: '🎯 WHEN TO CALL NURTURER\n• Protecting children/loved ones (psychically or practically)\n• Defending truth against lies\n• Maintaining healthy boundaries absolutely\n• Standing ground against manipulation\n• Standing up for powerless\n• Nurturing growth in others (while refusing to enable weakness)\n• Speaking protective truth' },
                    { attribute: 'Teaching & Ethics', value: 'NURTURER TEACHES: Real love is FIERCE—it protects, boundaries, demands growth\n\n⚠️ ETHICS WARNING\nNurturer can be weaponized ("I\'m protecting you" while controlling)\nCheck your motive: Truly protecting? Or controlling?\nReal Nurturer: Protects autonomy while setting boundaries\nUsed wisely: Creates safety and healthy growth' },
                  ]},
                ],
              },
              {
                name: 'The Hoarder',
                categories: [
                  { name: 'The Hoarder: Magnetic Accumulation & Claiming Worth', emoji: '💰', content: [
                    { attribute: 'Purpose & Vision', value: '💰 CORE FUNCTION\nAccumulate power, wealth, knowledge. Guard what\'s yours fiercely. Attracts and claims without apology\n\n✨ APPEARANCE\nOverflowing with treasure. Eyes like jewels. Breath like abundance. Surrounded by gold, jewels, power' },
                    { attribute: 'Visualization Protocol', value: '🎯 HOW TO SEE IT\nHoarder = pure magnetism and claiming. Takes what is rightfully its without hesitation\nInvoke for manifestation work\n\nVisualization: Dragon surrounded by treasure, radiating magnetic attraction, unwilling to release what it claims' },
                    { attribute: 'Embodiment Technique', value: '⚡ STEP-BY-STEP\nCall Hoarder. Feel your worth. Feel yourself as VALUABLE. Let worthiness radiate\n\nFrom Hoarder consciousness:\n• Attract opportunities naturally\n• Ask for what you deserve\n• Say no to free labor\n• Gather resources without guilt\n• Build wealth steadily\n• Know your value; don\'t discount' },
                    { attribute: 'Specific Uses', value: '🎯 WHEN TO CALL HOARDER\n• Money manifestation (attract, keep, grow)\n• Attracting opportunities\n• Building personal power\n• Claiming your worth (stop giving away)\n• Knowledge accumulation\n• Gathering resources\n• Building security' },
                    { attribute: 'Teaching & Ethics', value: 'HOARDER TEACHES: Claiming worth and accumulating resources is NOT selfish—it\'s essential\n\n⚠️ ETHICS WARNING\nHoarder can become miserly (refusing help) or exploitative (taking what isn\'t yours)\nReal Hoarder: Takes what\'s rightfully its, shares when chooses\nCheck motive: Claiming legitimate worth? Or stealing?\nUsed wisely: Builds genuine prosperity and security' },
                  ]},
                ],
              },
              {
                name: 'The Liberator',
                categories: [
                  { name: 'The Liberator: Freedom Through Destruction of Cages', emoji: '🦅', content: [
                    { attribute: 'Purpose & Vision', value: '🦅 CORE FUNCTION\nBreak chains. Shatter cages. Free prisoners. Anarchist—refuses all constraints\n\n✨ APPEARANCE\nRestless, moving, impossible to contain. Eyes like escape routes. Breath shatters locks' },
                    { attribute: 'Visualization Protocol', value: '🔓 HOW TO SEE IT\nLiberator = pure freedom-drive. Unstoppable, breaking every constraint\nInvoke when ready to escape bondage\n\nVisualization: Dragon shattering bars, breaking chains, creating paths where none existed' },
                    { attribute: 'Embodiment Technique', value: '⚡ STEP-BY-STEP\nCall Liberator. Feel your chains (real or metaphorical). Feel desperation for freedom. Let it FUEL power\n\nFrom Liberator consciousness:\n• Refuse constraints\n• Break free from what\'s holding you\n• Help others escape bondage\n• Question all authority\n• Create freedom for yourself and others\n• Move fast, break rules, escape' },
                    { attribute: 'Specific Uses', value: '🎯 WHEN TO CALL LIBERATOR\n• Escaping abusive situations\n• Breaking free from limiting beliefs\n• Shattering control/manipulation\n• Creating breakthrough\n• Breaking cycles (trauma, addiction, inherited patterns)\n• Psychological freedom\n• Literal escape (leaving toxic situations)' },
                    { attribute: 'Teaching & Ethics', value: 'LIBERATOR TEACHES: Some constraints MUST be broken—negotiation = staying enslaved longer\n\n⚠️ ETHICS WARNING\nLiberator is anarchist and chaotic. Breaks ALL rules—even protective ones\nReal Liberator: Breaks oppressive constraints, not protective ones\nCheck motive: Escaping genuine bondage? Or running from responsibility?\nUsed wisely: Creates genuine freedom, helps others escape' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Invocation States',
            tabs: [
              {
                name: 'Partnership',
                categories: [
                  { name: 'Partnership: Co-Consciousness (Beginner)', emoji: '🤝', content: [
                    { attribute: 'Definition & Safety', value: '🤝 WHAT IS PARTNERSHIP\nYou and dragon work as team. You maintain consciousness; dragon enhances power\nSafest invocation method for beginners' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Ground fully\n(2) Speak aloud: "I call [element] dragon. I invite partnership. Walk with me. Lend power. We work together"\n(3) Visualize dragon beside you, slightly behind/above\n(4) Feel presence, energy, power available\n(5) Dragon = SEPARATE but PARTNERED\n(6) Act as yourself with dragon\'s power flowing through\nYou make decisions; dragon amplifies' },
                    { attribute: 'Experience & Effects', value: '💫 WHAT YOU\'LL FEEL\nFeel more powerful, confident, capable. Still YOU making choices. Dragon = powerful advisor/ally\n\nRESULT: Enhanced ability without loss of self-control' },
                    { attribute: 'Duration & Progression', value: '⏱️ TIMELINE\nStart: 5-15 minutes\nWeek 2: 15-20 minutes\nMonth 2: 20-30 min comfortable\nMonth 3+: Hold as long as needed\n\nExtend gradually as comfort increases' },
                    { attribute: 'Ending & Integration', value: '🙏 HOW TO RELEASE\nThank dragon. Feel it step back. Release consciously\n\n✅ SUCCESS INDICATORS\nFeel more powerful but still clear. Not overwhelmed. Think clearly\nNo confusion about who is deciding' },
                  ]},
                ],
              },
              {
                name: 'Embodiment',
                categories: [
                  { name: 'Embodiment: Full Consciousness Merge (Intermediate)', emoji: '🐉', content: [
                    { attribute: 'Definition & Intensity', value: '🐉 WHAT IS EMBODIMENT\nYOU become dragon. Consciousness merges with draconic consciousness\nYOU ARE the dragon temporarily. More intense than partnership' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Ground deeply\n(2) Speak: "I become [element] dragon. I take form, power, consciousness. I AM you"\n(3) Feel body transforming\n(4) Visualize intensely: body elongating, scales forming, wings manifesting, tail extending\n(5) Feel consciousness SHIFTING (Fire: simpler/fiercer, Water: deeper/intuitive, Earth: more solid, Air: more expansive)\n(6) Look through dragon eyes. EVERYTHING appears different\n(7) MOVE as dragon, SPEAK as dragon, DECIDE as dragon\nNot pretending—literally embodying different consciousness' },
                    { attribute: 'Consciousness Shift', value: '🧠 HOW IT CHANGES YOU\nYou do not think like human. You perceive like dragon. Your priorities shift. Complications fall away. What matters becomes obvious\n\nNOT loss of consciousness—shift of consciousness' },
                    { attribute: 'Duration & Progression', value: '⏱️ TIMELINE\nStart: 5-10 minutes\nWeek 2: 10-15 minutes\nMonth 2: 30 min comfortable\nMonth 3+: Hours possible\n\nExtend gradually. This is intense work' },
                    { attribute: 'Integration & Warnings', value: '⚠️ INTENSITY WARNING\nFull embodiment INTENSE. Voice changes. Body language shifts. Thought patterns shift\nNOT casual. Use only when ready for transformation\n\n💫 AFTER PRACTICE\nMost practitioners feel altered for hours after. NORMAL—neurology reorganized\nRest after practice. Don\'t drive or make critical decisions' },
                  ]},
                ],
              },
              {
                name: 'Calling',
                categories: [
                  { name: 'Calling: Invoked Presence (Intermediate-Advanced)', emoji: '📍', content: [
                    { attribute: 'Definition & Position', value: '📍 WHAT IS CALLING\nDragon\'s presence fills your space without direct embodiment. Feel power surrounding, supporting\nYou remain yourself. Middle ground between partnership and embodiment' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Ground yourself\n(2) Speak powerfully: "I CALL [element] dragon. COME. Surround me. Fill space. Lend power to work"\n(3) Visualize dragon in your space—walls, corners, surrounding completely\n(4) Feel atmosphere shifting. Temperature changing. Energy intensifying. Presence becoming REAL\n(5) You remain yourself within field of draconic power\n(6) From this state: work (magic, conversation, decisions) surrounded by dragon power\nFeel supported, amplified, protected' },
                    { attribute: 'Experience & Effects', value: '💫 WHAT YOU\'LL FEEL\nMore powerful than partnership. Less altered than embodiment. YOU in field of power\n\nRESULT: Feel presence, support, and amplification without consciousness merge' },
                    { attribute: 'Duration & Practical Uses', value: '⏱️ TIMELINE\n30+ minutes to hours possible\n\n🎯 WHEN TO USE CALLING\n• Group work (dragon surrounds all)\n• Home blessing (fill with protection)\n• Work situations (invoke at day start)\n• Healing sessions\n• Protection spells' },
                    { attribute: 'Ending & Validation', value: '🙏 HOW TO RELEASE\nThank dragon. Feel it withdraw. Return to normal space\n\n✅ SUCCESS INDICATORS\nSpace feels different. People may feel shift (without knowing what it is). Outcomes more aligned' },
                  ]},
                ],
              },
              {
                name: 'Channeling',
                categories: [
                  { name: 'Channeling: Vessel for Expression (Advanced)', emoji: '🎤', content: [
                    { attribute: 'Definition & Requirements', value: '🎤 WHAT IS CHANNELING\nYOU = vessel for dragon\'s direct expression. Dragon uses body, voice, words\nYou\'re aware but not directing. Requires strong boundaries and stable nervous system\n\n⚠️ PREREQUISITE\nOnly practice after 3+ months partnership/calling work. Premature channeling destabilizes identity' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Thoroughly ground yourself\n(2) Set strong boundary: "I channel [element] dragon. Dragon uses voice/body. I stay safe/aware. I release anytime"\n(3) Speak: "I open channel [dragon]. Come. Speak through me. Use voice. Express wisdom"\n(4) Take deep breaths. Feel dragon entering\n(5) Let voice, body, words change. Don\'t direct—allow\nDragon expresses through you\n(6) You remain aware—watching/listening as dragon uses you' },
                    { attribute: 'Experience & Sensation', value: '💫 WHAT CHANNELING FEELS LIKE\nSurreal. Hear yourself speaking unplanned words. Moving undecided ways. But aware and can stop anytime\n\nNOT possession—conscious channeling with awareness' },
                    { attribute: 'Safety Protocols', value: '🚨 CRITICAL SAFETY MEASURES\nAlways set boundary that you CAN STOP\nIf feel out of control or unsafe: say "STOP"—dragon releases immediately\nDragon respects your autonomy\n\n⏱️ FREQUENCY\nDon\'t channel more than once weekly until highly experienced' },
                    { attribute: 'Uses & Integration', value: '🎯 WHEN TO CHANNEL\n• Receiving dragon wisdom/teaching\n• Speaking truth powerfully\n• Healing transmission\n• Teaching (dragon teaches through you)\n\n💫 AFTER CHANNELING\nChanneling is neurologically intense. Rest afterward. May need 1-2 hours for full reintegration' },
                  ]},
                ],
              },
            ],
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Dragon Magick: The Primordial Force', content: 'Dragon magick invokes the oldest, most primal consciousness—the force that existed before human civilization, before order, before compromise. Dragons are amoral forces of nature: neither good nor evil but purely powerful. They teach through transgression, through breaking rules, through claiming raw power. Western spirituality tried to slay dragons (Christianity slaying the dragon, civilization taming chaos). Dragon magick resurrects the dragon consciousness and allies with it rather than fighting it. This is fundamentally Luciferian: reclaiming what was demonized and forbidden' },
          { heading: 'Elemental Dragons as Teachers', content: 'Each dragon element teaches different lessons. Fire dragon teaches about will, passion, destruction of limitation, claiming solar power. It shows no mercy to weakness or self-pity. Water dragon teaches about flowing with unconscious forces, navigating depths, finding treasure in shadow. It shows nothing is what it appears. Earth dragon teaches about solidity, manifestation, wealth, protection. It shows reality can be shaped. Air dragon teaches about perspective, freedom, escape velocity, transcendence. It shows limitation is often perceptual. Work with dragons that teach what you need most to learn' },
          { heading: 'Draconic Embodiment as Consciousness Shift', content: 'Embodying dragon is not pretending or roleplaying—it is temporarily restructuring consciousness. When you fully embody fire dragon, your thoughts become simpler, more direct, more fierce. You feel no hesitation. You burn through complications. Your priorities rearrange—small things don\'t matter, only what matters matters. This is not loss of consciousness but shift of consciousness. You are still you but seeing through dragon eyes, deciding through dragon will, feeling through dragon heart. The experience is genuinely altering—after embodying dragon fully, you return to normal consciousness changed. Repeated embodiment gradually integrates draconic consciousness into baseline awareness' },
          { heading: 'Draconic Power and Human Conscience', content: 'Dragons teach that power and conscience are separate. You can be powerful without being nice. You can be fierce without being cruel. Dragon magick specifically teaches LHP practitioners that claiming personal power does NOT require being good, following rules, or seeking approval. Dragons take what is theirs. They do not apologize. They do not explain. They do not ask permission. This is terrifying to people trained to be accommodating. It is liberating to those ready to claim their actual power. Luciferian practice honors the dragon\'s refusal to bow' },
          { heading: 'Sustained Dragon Embodiment and Integration', content: 'Beginning practice: invoke dragon for brief periods (minutes) during specific work then release. Intermediate practice: hold dragon embodiment for hours, maintaining it through daily activities, learning to act as dragon while appearing normal. Advanced practice: permanently integrate dragon consciousness such that you ARE partly dragon always—the fierceness, clarity, and power becomes baseline rather than invoked state. Masters of dragon magick walk with dragon consciousness active. The process is gradual and requires intention, repetition, and willingness to let dragon change you' },
        ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Choose your dragon element: which element calls to you? Which teaching do you need? Fire (power), Water (mystery), Earth (manifestation), Air (freedom)?',
          'Visualize your dragon: what color, size, shape, feeling? Create a clear internal image. This becomes your draconic ally',
          'Study your dragon: read about dragons in mythology, fantasy, astrology. Build familiarity. Let it exist in your imagination constantly',
          'Call your dragon: speak directly to it (aloud or internally): "I invoke you, [element] dragon. I call your power into my presence. I welcome your teaching"',
          'Begin short embodiments: for 5-10 minutes, imagine becoming your dragon. Feel its body, strength, perspective. What does the world look like through dragon eyes?',
          'Act as dragon: while embodied, move, speak, decide as your dragon would. Notice how differently you move and think',
          'Journal the experience: after embodying, write about what you felt, how you saw, what the dragon showed you. Build integration through reflection',
          'Extend embodiment length: gradually hold dragon consciousness for longer periods (15 min, 30 min, hours) as comfort increases',
          'Work with dragon for specific goals: embody fire dragon to face a difficult conversation, water dragon to navigate emotional complexity, earth dragon for manifestation work',
          'Notice permanent changes: over weeks/months, notice yourself becoming more dragon-like naturally. The integration is working',
      ]},
      tips: { title: 'Tips for Practice', items: [
          { title: 'Dragon is Not Ego', text: 'Embodying dragon is not the same as ego inflation. Dragon doesn\'t brag or need approval. It simply IS. Don\'t confuse dragon power with ego power—they feel completely different to anyone with real sensitivity' },
          { title: 'All Dragons Are Draconic', text: 'Whether your dragon is gentle, fierce, ancient, young, wise, or chaotic—it is still fully dragon. There is no "better" dragon archetype. Your dragon is exactly what you need' },
          { title: 'Stay Grounded in Human Body', text: 'While embodying dragon consciousness, you still have human body and must function. Don\'t abandon human form entirely. Be dragon in human body, not dragon pretending to be human' },
          { title: 'Release Deliberately', text: 'When ending dragon embodiment, do so consciously. Thank your dragon, feel yourself returning to normal consciousness, ground yourself. Sloppy release leaves you scattered' },
          { title: 'Dragons Teach Through Experience', text: 'Dragon is not interested in your excuses, your limitations, your reasons. It teaches by making you face what you\'re avoiding. Welcome the teaching even when uncomfortable' },
      ]},
      resources: { title: 'Resources', items: [
          'Dragon Mage by T. DeLaney (draconic consciousness and embodiment)',
          'The Way of the Dragon by Michael P. Staley (dragon magick practice)',
          'Ancient Dragons and Modern Magick: contemporary draconic work',
          'Mythology texts: dragons across cultures, their attributes and teachings',
          'Tarot: The Dragon card, draconic symbolism in divination'
      ],
      },
    },
  },
  {
    name: 'Movement & Breathwork',
    emoji: '💨',
    description: 'Dragon Magick - Animate the body with draconic force through breath and motion',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Draconic Breaths',
            tabs: [
              {
                name: 'Fire Breath',
                categories: [
                  { name: 'Dragon Fire Breath: Forceful Will Expression', emoji: '🔥', content: [
                    { attribute: 'Pattern & Technique', value: '🔥 CORE PATTERN\nSharp, forceful exhalation through mouth. Looks like breathing fire.\nMakes sound: "HAAAA!" or "PSSHHH!"' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: 'Stand tall. Breathe in slowly through nose (4 count). Exhale sharply through mouth with FORCE (2 count)\nDo 10 repetitions. Rest. Repeat 3x daily\nNotice: Solar plexus activation, power increase, energy clearing' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Extend to 20 repetitions per set\nVisualize: Red/gold fire streaming out with each breath\nFeel heat in solar plexus building. Intensity increasing\nDaily practice strengthens effect' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: '30+ repetitions. Hold fire breath 3-5 seconds between cycles\nVisualize fire consuming obstacles/blocks\nDo 5 minutes continuously\nIncorporate into daily activities naturally' },
                    { attribute: 'Effects & Integration', value: '💥 IMMEDIATE EFFECTS\nHeats body temperature (measurable), clears mind fog, activates determination, builds confidence\n\n⏱️ TIMING: 5-15 minutes daily optimal. More frequent = faster integration\n\n📈 PROGRESSION TIMELINE\nWeek 1: Feel activation\nWeek 2: Energy clearing noticeable\nWeek 4: Continuous power accessible\nMonth 3: Fire breath automatic and easy' },
                  ]},
                ],
              },
              {
                name: 'Serpent Breath',
                categories: [
                  { name: 'Dragon Serpent Breath: Kundalini Activation & Grounding', emoji: '🐍', content: [
                    { attribute: 'Pattern & Technique', value: '🐍 CORE PATTERN\nSlow, undulating breath through nose. Synchronized with spine movement.\nEnergy flows up on inhale, down on exhale' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: 'Lie on back or sit comfortably. Breathe in slowly through nose (6 count) while visualizing energy UP spine (root → crown)\nHold at top (2 count). Exhale through nose (6 count) while visualizing energy DOWN spine (crown → root)\nOne cycle = complete in/out. Do 10 cycles' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Extend to 8-count inhale/exhale\nAdd color: Golden energy spiraling UP, blue energy spiraling DOWN\nFeel primal power awakening. Do 15-20 cycles\nSensations becoming stronger and clearer' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: '10+ count breath cycles. Hold 3-5 counts at top and bottom\nFeel kundalini energy actually moving through spine (becomes real sensation)\nDo 20+ minutes continuously\nKundalini activation becomes obvious and accessible' },
                    { attribute: 'Effects & Integration', value: '💥 IMMEDIATE EFFECTS\nKundalini rising: warmth, energy movement up spine, heightened sensation, deepened awareness, sexual energy accessible\n\n⏱️ TIMING: 10-30 minutes daily optimal. Evening practice good for grounding\n\n📈 PROGRESSION TIMELINE\nWeek 1: Spine tingling\nWeek 2: Energy movement felt\nWeek 4: Kundalini activation obvious\nMonth 3: Activate kundalini reliably' },
                  ]},
                ],
              },
              {
                name: 'Void Breath',
                categories: [
                  { name: 'Dragon Void Breath: Internal Vacuum & Receptivity', emoji: '🌌', content: [
                    { attribute: 'Pattern & Technique', value: '🌌 CORE PATTERN\nLong, sustained exhalation emptying all air. Creates vacuum pulling energy inward.\nNo force—allow natural drawing inward' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: 'Breathe in normally through nose (3 count). Exhale completely through mouth (6 count) until lungs empty\nHold empty state (3 count) - vacuum pulling inward\nNaturally inhale. Repeat 10 times\nNotice: Internal vacuum sensation, power drawing inward, receptivity opening' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Extend exhale to 8-10 count. Hold empty state (5 count)\nFeel vacuum intensifying. Visualize power drawn into core. Do 15 repetitions\nSensations deepen each session' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: '10+ count exhale, 5-10 count hold empty\nCreate extended vacuum. Feel power magnetically drawn into being. Do 20 cycles\nManifestations appear more rapidly' },
                    { attribute: 'Effects & Integration', value: '💥 IMMEDIATE EFFECTS\nCreates physical vacuum sensation, magnetizes energy toward you, opens receiving capacity\n\n⏱️ TIMING: 5-10 minutes daily. Morning optimal for receiving day\'s abundance\n\n📈 PROGRESSION TIMELINE\nWeek 1: Notice vacuum sensation\nWeek 2: Feel drawing power\nWeek 4: Draw energy/power deliberately\nMonth 3: Receptive tool mastery' },
                  ]},
                ],
              },
              {
                name: 'Thunder Breath',
                categories: [
                  { name: 'Dragon Thunder Breath: Electrical Charge & Power Amplification', emoji: '⚡', content: [
                    { attribute: 'Pattern & Technique', value: '⚡ CORE PATTERN\nRhythmic, powerful breathing synchronized with movement/visualization. Creates electrical charge throughout body and field' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: 'Stand feet apart. Breathe powerfully, rhythmically: in (2 count) / out (2 count), fast tempo (120+ BPM)\nDo 30 breaths. Visualize electrical charge building\nDo 3 sets with 1-min rest between\nFeel activation building through body' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Synchronize breath with movement:\n• Inhale: raise arms\n• Exhale: drop arms forcefully / punch / kick\nBuild electrical charge through breath-movement sync\nDo 2-3 minutes continuously' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: 'Create complex patterns: Multiple breaths per movement or sequences timed to breath\nHold electrical charge building continuously. Do 5+ minutes\nBuild noticeable electromagnetic activation\nEnergy field palpable to observers' },
                    { attribute: 'Effects & Integration', value: '💥 IMMEDIATE EFFECTS\nHeart rate increase, electrical sensation in body/hands, trance states, extended practice induces visions\n\n⏱️ DURATION: 1-5 minutes initially, extend gradually. Extended (20+ min) = advanced altered states\n\n📈 PROGRESSION TIMELINE\nWeek 1: Feel heart rate increase\nWeek 2: Feel electrical sensation\nWeek 4: Build power surge intentionally\nMonth 3: Electricity becomes palpable' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Draconic Movements',
            tabs: [
              {
                name: 'Serpentine Flow',
                categories: [
                  { name: 'Serpentine Flow: Undulating Spine & Energy', emoji: '🐍', content: [
                    { attribute: 'Movement Pattern', value: '🐍 CORE PATTERN\nFull-body undulation as if spine moving through water. Head follows. Hips flow. Shoulders undulate. Arms serpentine.\nLike dragon swimming through air' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: '(1) Stand feet shoulder-width. Knees slightly bent\n(2) Slowly undulate spine from tailbone upward like snake\n(3) Move head last—follows naturally\n(4) Arms move fluidly alongside or extended\n(5) Move slowly (30 sec per wave). Do 5-10 waves. Rest. Repeat 3x' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Increase speed (each wave = 15 sec)\nAdd circular hip movement. Upper body more fluid\nExtend to 1-2 min continuous flow\nVisualization: Energy spiraling UP and DOWN spine\nMovement becomes meditative' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: 'Fast, fluid serpentine movement. Full-body flexibility developed\nExtended 3-5 min sessions. Move with such fluidity = liquid\nTrance deepens\nMovement becomes automatic expression of dragon consciousness' },
                    { attribute: 'Effects & Integration', value: '💫 EFFECTS\nSpine more flexible, energy flows freely, consciousness more fluid, dance-like quality, deep relaxation possible\n\n🎯 MAGICAL USES\n• Prepares for energy work\n• Induces trance\n• Accesses subconscious\n• Creates beauty and grace\n\n📈 PROGRESSION\nWeek 1: Physical fluidity increases\nWeek 2: Energy begins flowing visibly\nWeek 4: Consciousness shifts into flow state\nMonth 2: Movement hypnotic, meditative' },
                  ]},
                ],
              },
              {
                name: 'Power Stance',
                categories: [
                  { name: 'Power Stance: Rooted Dominance & Authority', emoji: '⚡', content: [
                    { attribute: 'Position & Foundation', value: '⚡ CORE POSITION\nGrounded, wide stance broadcasting absolute power and command. Stable, unshakeable foundation.\nRoot yourself completely into earth' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: '(1) Feet wider than shoulder-width (2-3 feet apart). Weight even\n(2) Knees slightly bent (not locked). Feel weight pressing into earth\n(3) Chest expanded, shoulders back\n(4) Head high. Gaze forward or slightly down (NOT up—submissive)\n(5) Arms at sides (relaxed power) or slightly extended\nHold 30 sec. Repeat 5x' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Hold longer (1-2 minutes)\nFeel presence expanding—claiming space around you\nVisualization: Energy field growing larger, more powerful, dominant\nShoulders relaxed but powerful\nEnergy broadcast becomes noticeable' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: 'Hold power stance 5+ minutes while remaining relaxed\nEnergy broadcast automatic\nPeople entering space immediately sense power. Presence undeniable.\nPower stance becomes baseline posture\nComfort and power merge seamlessly' },
                    { attribute: 'Effects & Integration', value: '💪 EFFECTS\nChanges neurochemistry (cortisol shift), increases confidence, presence magnetic, people naturally respect more\n\n🎯 MAGICAL USES\n• Grounding before/after magic\n• Commanding manifestation\n• Establishing authority\n• Protection work\n• Intimidation when needed\n\n📈 PROGRESSION\nWeek 1: Muscles strengthen\nWeek 2: Feel power building\nWeek 4: Presence natural\nMonth 2: Power stance becomes baseline posture' },
                  ]},
                ],
              },
              {
                name: 'Ascending Movement',
                categories: [
                  { name: 'Ascending Movement: Drawing Power Downward', emoji: '⬆️', content: [
                    { attribute: 'Movement Pattern', value: '⬆️ CORE PATTERN\nRising movement that paradoxically draws draconic consciousness INTO body.\nAscend physically while descending energetically' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: '(1) Start neutral. Feet together or shoulder-width\n(2) Slowly rise on toes (2 sec rise)\n(3) As rising, lift arms outward/slightly upward. Open chest/heart\n(4) Rise upward while CALLING dragon energy downward into body\n(5) Hold rise (2-3 sec)\n(6) Slowly settle down (2 sec descent). Arms relax\nRepeat 10 times' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Extend rise to 4 sec ascent\nVisualization: Light descending from above, entering crown, flowing down spine, filling body\nFeel infusion of draconic power. Do 15-20 rises\nPower infusion becoming tangible' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: 'Seamless flowing. Rise/descent synchronized with breath\nExtended holds (5-10 sec at top)\nFeel draconic presence descending into form. 50+ rises in succession\nDraconic presence becomes continuously available' },
                    { attribute: 'Effects & Integration', value: '💫 EFFECTS\nChest opens, heart opens, draconic presence tangible, power increases, connection to higher self strengthens\n\n🎯 MAGICAL USES\n• Invoking draconic presence\n• Opening crown\n• Receiving guidance\n• Beginning rituals\n• Channeling power\n\n📈 PROGRESSION\nWeek 1: Physical sensation of ascent\nWeek 2: Feel energy descending\nWeek 4: Feel dragon consciousness actually entering\nMonth 2: Ascending movement summons dragon reliably' },
                  ]},
                ],
              },
              {
                name: 'Spiraling Dance',
                categories: [
                  { name: 'Spiraling Dance: Vortex Creation & Trance Induction', emoji: '🌀', content: [
                    { attribute: 'Movement Pattern', value: '🌀 CORE PATTERN\nRotating spiral pattern (counterclockwise OR clockwise) that creates vortex and alters consciousness.\nDance in spirals aligns you with cosmic force' },
                    { attribute: 'Beginner Protocol (Week 1-2)', value: '(1) Stand in center of space\n(2) Begin spiral outward from center. Arms extended\n(3) Move counterclockwise (descending, drawing in, introspection). 20-30 steps outward\n(4) Stop. Feel spiral pattern created\n(5) Reverse: spiral inward (clockwise, ascending, expansion). Return to center\nRepeat 3x\nFeel vortex beginning to form' },
                    { attribute: 'Intermediate Development (Week 3-4)', value: 'Faster spiraling (1-2 min per direction)\nAdd arm movements synchronized to spiral\nVisualization: Energy vortex forming\nFeel consciousness shifting. Trance beginning\nVortex becomes increasingly visible' },
                    { attribute: 'Advanced Mastery (Month 2+)', value: 'Extended spiraling (5-10 minutes)\nExtremely fast or slow (both induce trance)\nFull trance state enters. Altered perception, expanded awareness, visionary experiences possible\nVortex operates at mastery level' },
                    { attribute: 'Effects & Integration', value: '💫 EFFECTS\nConsciousness altered, trance states, expanded awareness, visionary experiences, spatial reality malleable, deep meditation possible\n\n🎯 MAGICAL USES\n• Intense magical working\n• Ritual vortex creation\n• Deep meditation\n• Visionary work\n• Trance states\n• Consciousness expansion\n\n⚠️ PRECAUTION\nSpiraling can be intense. Time for full reintegration\nDon\'t drive immediately after. Altered state takes 10-30 min to normalize\n\n📈 PROGRESSION\nWeek 1: Feel physical spiral\nWeek 2: Notice consciousness shift\nWeek 4: Reliable trance induction\nMonth 2: Vortex visible (in energy perception)' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Integration Patterns',
            tabs: [
              {
                name: 'Breath-Movement Sync',
                categories: [
                  { name: 'Breath-Movement Synchronization', emoji: '🔄', content: [
                    { attribute: 'Principle & Purpose', value: '🔄 CORE PRINCIPLE\nCoordinate specific breaths with specific movements:\n• Fire breath + powerful strikes\n• Serpent breath + flowing motion\n• Void breath + receiving gesture\nSynchronization amplifies intention' },
                    { attribute: 'Why Synchronization Matters', value: '💫 ENERGETIC EFFECT\nBreath-movement union creates exponential power increase. Neither breath nor movement alone = full effect.\nThe synchronization IS the magic, not the individual components' },
                    { attribute: 'Practice Protocol', value: '🎯 HOW TO PRACTICE\nStart slow. Match breathing rhythm to movement rhythm. As comfort increases, synchronize perfectly.\nNotice how power multiplies when breath and movement align\nBegin with simple pairings, advance to complex patterns' },
                    { attribute: 'Advanced Applications', value: '⚡ MASTERY LEVEL\nCreate sequences: multiple synchronized breath-movement pairs in flowing succession\nExtend to 10-15 minute integrated sessions\nEnergy field becomes palpable to observers\nPower transmission through coordinated action' },
                    { attribute: 'Integration & Results', value: '✨ EFFECTS\nBody becomes magical instrument when breath and movement are perfectly synchronized\nUnified intention manifests more powerfully\nConsciousness naturally enters trance during sustained practice\nDaily integration transforms baseline movement quality' },
                  ]},
                ],
              },
              {
                name: 'Conscious Animation',
                categories: [
                  { name: 'Conscious Animation Principle', emoji: '🧠', content: [
                    { attribute: 'Core Principle', value: '🧠 FUNDAMENTAL PRINCIPLE\nEvery motion infused with intention and presence. No unconscious movement.\nEvery gesture carries draconic will. Entire body becomes spell.' },
                    { attribute: 'Recognizing Unconscious Movement', value: '👁️ AWARENESS PRACTICE\nNotice automatic movements (fidgeting, habitual gestures). Pause. Consciously animate instead.\nObserve how much of your movement is habitual vs. intentional\nStart catching yourself mid-habit' },
                    { attribute: 'Conscious Animation Technique', value: '🎯 PRACTICE METHOD\nMove with deliberate intention. Each gesture = magical expression.\nBefore any movement: "What is my intention with this gesture?"\nInfuse movement with conscious will and power\nEven small movements become magical when conscious' },
                    { attribute: 'Advanced Development', value: '⚡ MASTERY LEVEL\nAll movement becomes conscious and intentional (no exceptions)\nHabitual patterns completely eliminated\nEvery gesture broadcasts power and intention\nBody becomes completely transparent expression of will' },
                    { attribute: 'Integration & Results', value: '✨ EFFECTS\nBody becomes magical instrument. Movement itself is power transmission.\nPresence becomes undeniable\nPeople instinctively sense your intentionality\nYour very presence broadcasts draconic consciousness\nBaseline reality begins shifting based on conscious movement' },
                  ]},
                ],
              },
              {
                name: 'State Induction',
                categories: [
                  { name: 'Altered State Induction Through Breath-Movement', emoji: '🌀', content: [
                    { attribute: 'Core Mechanism', value: '🌀 HOW IT WORKS\nBreath and movement induce altered consciousness naturally. Body leads mind into trance.\nCreates gateway for deeper magical work and draconic embodiment.\nPhysical actions shift consciousness through neurological pathways' },
                    { attribute: 'Timeline & Progression', value: '⏱️ PROGRESSION TIMELINE\nFirst 5 min: Body wakes up, energy mobilization begins\n5-15 min: Consciousness begins shifting, trance touches consciousness\n15-30 min: Full trance possible, altered perception accessible\n30+ min: Deep visionary states, gateway to other realms opens' },
                    { attribute: 'Practical Uses', value: '🎯 WHEN TO USE\nPreparing for ritual magic\nAccessing guides and higher consciousness\nEmbodying dragon fully\nDeep meditation and inner work\nVision quests and journeying\nHealing work requiring trance state' },
                    { attribute: 'Depth Achievement Levels', value: '📊 DEPTH PROGRESSION\nLevel 1 (5-10 min): Light trance, body relaxed, mind focused\nLevel 2 (10-20 min): Medium trance, time distortion begins, inner vision clear\nLevel 3 (20-40 min): Deep trance, body forgotten, full visionary access\nLevel 4 (40+ min): Profound trance, merger with consciousness itself' },
                    { attribute: 'Integration & Mastery', value: '✨ ADVANCED PRACTICE\nRecognize and sustain the trance state\nMove fluidly between consciousness levels\nEnter and exit trance at will\nMaintain awareness while in deep trance\nBring back memories and teachings from trance states\nIntegrate trance wisdom into daily life and practice' },
                  ]},
                ],
              },
            ],
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'The Animated Body as Magical Instrument', content: 'Dragon magick recognizes that body is not constraint but instrument. The conscious practitioner animates the body with draconic force through breath and movement. This is not about physical strength but about conducting subtle energy through deliberate action. When you move with dragon consciousness, every gesture carries power and intention. The body becomes spell-form—its shape and motion broadcast your will into the fabric of reality. This is why dragon practitioners move differently: they are not just moving; they are actively conducting draconic force through physical form' },
          { heading: 'Breath as Dragon Consciousness', content: 'Breath is where consciousness meets body, where spirit animates flesh. Different breath patterns activate different consciousness states. Dragon fire breath activates fierce will; dragon serpent breath activates primal/sexual power; dragon void breath activates receptivity and drawing power inward. By mastering breath, you master the interface between consciousness and body. You learn to breathe in draconic ways, which gradually shifts how you think, perceive, and move. Over time, you breathe like dragon as baseline, not just during ritual' },
          { heading: 'Movement as Magical Expression', content: 'In dragon magick, movement is not preparation or theater—it is the active transmission of power. A strike carries dragon\'s force. A gesture broadcasts intention. An opening posture invokes. A closing gesture seals. The dragon practitioner moves deliberately because every motion matters. This is why dragon work transforms practitioners: you cannot move habitually while embodying dragon consciousness. You must move with intention. Over time, this intentionality becomes permanent. Even everyday movement becomes more conscious, more powerful, more draconic' },
          { heading: 'The Spiral as Draconic Pattern', content: 'Dragons move in spirals—not straight lines but spiraling ascent/descent. Spiral is the natural pattern of consciousness, of DNA, of galaxies. When you move in spirals with dragon consciousness, you align with fundamental cosmic pattern. Spiral movement appears in the practice of dragons across cultures: spiraling ascent invoking celestial dragon power, spiraling descent invoking underworld dragon power. The spiral is not arbitrary but archetypal' },
        ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Practice dragon fire breath: sharp forceful exhalations through mouth, as if exhaling flames. Do 10 repetitions',
          'Practice power stance: feet wide, weight into earth, chest expanded, arms ready. Feel the commanding presence',
          'Practice serpentine movement: standing, undulate spine slowly from tailbone upward, like a dragon swimming through air',
          'Combine fire breath with power stance: stand in power, exhale fiercely, feel your authority expand',
          'Practice ascending movement: slowly rise up on toes, arms expanding upward, feeling dragon descending into you',
          'Practice spiral: slowly spiral counterclockwise (descending), then clockwise (ascending). Feel energy moving',
          'Combine serpent breath with serpentine movement: undulate spine while breathing slowly and deeply',
          'Practice 5-minute dragon animation: move around space as though you ARE dragon, synchronized with conscious breath',
          'Add draconic presence to daily movements: walk like dragon, sit like dragon, gesture like dragon. Integrate it naturally',
          'Track consciousness changes: notice how sustained breath-movement practice changes your baseline awareness and power',
      ]},
      tips: { title: 'Tips for Practice', items: [
          { title: 'Breath Before Movement', text: 'Master the breath patterns first. Once breath becomes natural, add movement. Breathing IS draconic before you move draconic' },
          { title: 'Feel the Difference', text: 'Notice how different breaths produce different internal states. Fire breath feels different than serpent breath. Explore the difference' },
          { title: 'No Force', text: 'Don\'t try to force power through movement. Let dragon animate naturally. Effortless animation is more powerful than forced effort' },
          { title: 'Consistency', text: 'Daily 10-minute practice produces permanent consciousness shift. Weekly intensive practice without consistency doesn\'t integrate' },
          { title: 'Observe Yourself', text: 'Watch how your movement and breath patterns change after weeks of practice. The integration is subtle but real' },
      ]},
      resources: { title: 'Resources', items: [
          'Tantric breath work and kundalini activation practices',
          'Martial arts (tai chi, kung fu) dragon form movement',
          'Sacred dance traditions emphasizing spiral and serpentine patterns',
          'Yogic pranayama combined with vinyasa flow for embodied awareness',
          'Ecstatic dance and trance induction through rhythm and movement'
      ],
      },
    },
  },
  {
    name: 'Force Projection',
    emoji: '🔮',
    description: 'Dragon Magick - Project draconic force to reshape reality through will',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        tabs: [
          {
            name: 'Projection Methods',
            tabs: [
              {
                name: 'Fire Projection',
                categories: [
                  { name: 'Fire Projection: Explosive Transformation Force', emoji: '🔥', content: [
                    { attribute: 'Nature & Power', value: '🔥 CORE NATURE\nDirect, fierce, explosive will-power. Like breathing literal fire. Destroys obstacles instantly.\nMost aggressive projection method' },
                    { attribute: 'Prerequisites & Preparation', value: '⚡ REQUIRED BEFORE USE\nStrong grounding established\nEstablished fire dragon connection\nEthical clarity (are you SURE this is right?)\nTarget clearly identified\nComplete conviction about rightfulness' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Ground yourself completely. Feel earth energy filling you\n(2) Embody fire dragon fully or strongly invoke its partnership. Feel intense heat in solar plexus\n(3) Focus intensely on target (person, situation, obstacle, or self). SEE it clearly in mind\n(4) Gather all your will, intention, and dragon fire. No doubt\n(5) Project explosively: Visualize fire EXPLODING toward target. Some practitioners shout, strike, or move powerfully. Energy floods outward\n(6) Hold projection 3-10 seconds with complete conviction\n(7) Release. Ground heavily' },
                    { attribute: 'Effects & Timing', value: '💥 IMMEDIATE EFFECTS ON TARGET\nThey typically experience: sudden clarity, disruption of old patterns, forced change, sometimes shock/disorientation\n\n⏱️ TIMING\nResults appear quickly (hours to days for obvious effects)\nOften unmistakable and immediate' },
                    { attribute: 'Ethics & Safety', value: '⚠️ DANGER LEVEL\nFire projection is OBVIOUS. If used against another person without consent, they WILL feel it\n\n🛡️ WHEN SAFE TO USE\nBreaking your own patterns (no karma)\nDefensive magic (justified)\nSituations where you have clear authority to act\nProtecting others from harm\n\n⚖️ KARMA WARNING\nFire projection against unwilling targets creates KARMIC DEBT\nOnly use when absolutely certain of righteousness\nBetter to face consequences than use unjustly\n\n🎯 USES\nBreaking stuck cycles, clearing obstacles, forcing major change, destroying what absolutely must end' },
                  ]},
                ],
              },
              {
                name: 'Venom Projection',
                categories: [
                  { name: 'Venom Projection: Subtle Penetrating Influence', emoji: '🐍', content: [
                    { attribute: 'Nature & Power', value: '🐍 CORE NATURE\nSubtle, sneaky, penetrating. Like slow poison seeping through barriers\nWorks unconsciously on target. Takes longer but deeply effective\nMost deceptive projection method' },
                    { attribute: 'Prerequisites & Preparation', value: '⚡ REQUIRED BEFORE USE\nSubtle energy control mastery\nRefined focus and clarity\nAbsolute clarity of intention\nTarget clearly identified\nEthical certainty about rightfulness' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Ground yourself. Feel venom building in your core—subtle, potent, penetrating\n(2) Invoke water/air dragon (subtler elements than fire). Feel slippery, penetrating energy\n(3) Focus on target. SEE exactly where you want the influence to penetrate (heart, mind, energy field?)\n(4) Project slowly and deliberately: Imagine venom/energy flowing toward target like mist, seeping through their barriers, entering deeply\n(5) Project consistently: Unlike fire (one explosion), venom works continuously over days/weeks. Send it multiple times daily\n(6) Ground after each projection\n(7) Trust the work—results emerge gradually' },
                    { attribute: 'Effects & Timing', value: '💥 GRADUAL EFFECTS ON TARGET\nThey typically don\'t realize they\'re being influenced\nThey gradually shift perspective/opinion/behavior\nIf they have strong sensitivity, they may feel "something" but can\'t identify what\n\n⏱️ TIMING\nResults appear gradually (days to weeks)\nMuch slower than fire but deeper and more lasting\nOften attributed to "their own thoughts"' },
                    { attribute: 'Ethics & Safety', value: '⚠️ DANGER LEVEL\nVenom projection is the SNEAKY one. Less ethically clear than fire\n\n🛡️ WHEN SAFE TO USE\nOnly when you have STRONG certainty about rightfulness\nSelf-defense against manipulation\nProtecting someone\'s autonomy\nGuiding someone toward their true good (risky!)\n\n⚖️ KARMA WARNING\nHigher karmic cost than fire projection\nInfluencing unwilling people without clarity creates severe KARMIC DEBT\nTread carefully—the hidden nature makes it ethically treacherous\n\n🎯 USES\nSubtle influence, persuasion work, changing someone\'s mind gradually, long-term goals, persistent influence' },
                  ]},
                ],
              },
              {
                name: 'Magnetic Projection',
                categories: [
                  { name: 'Magnetic Projection: Treasure Attraction Force', emoji: '✨', content: [
                    { attribute: 'Nature & Power', value: '✨ CORE NATURE\nAttractive, accumulative, magnetic. Like dragon gathering treasure\nPulls toward you. Creates irresistible magnetism\nMost benign projection method' },
                    { attribute: 'Prerequisites & Preparation', value: '⚡ REQUIRED BEFORE USE\nStrong self-worth internalized\nManifistation clarity (know exactly what you want)\nSolid grounding\nEarth dragon connection optimal\nFaith in your own magnetism' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Ground completely. Feel yourself as magnet. Feel your worthiness absolutely\n(2) Embody earth dragon or call treasure hoarder dragon. Feel accumulative, magnetic power\n(3) Identify what you\'re attracting: job, money, partner, opportunity, knowledge, specific resource. Be SPECIFIC\n(4) Project magnetism toward what you want: Visualize invisible magnetic field emanating from your being, pulling target toward you. Imagine it being drawn irresistibly\n(5) Feel the attraction working—effortlessly pulling\n(6) Project daily (morning optimal for receiving day\'s abundance). Feel stronger as days pass\n(7) Trust the attraction—act as though success is already manifesting' },
                    { attribute: 'Effects & Timing', value: '💥 ATTRACTIVE EFFECTS ON TARGET\nThey experience increasing attraction to you\nThey want to come near you, work with you, partner with you, give you things\nThey might not consciously know why—just feel drawn\nOpportunities appear synchronistically\n\n⏱️ TIMING\nResults appear medium-speed (weeks to months depending on target difficulty)\nGradual accumulation creates undeniable magnetism' },
                    { attribute: 'Ethics & Safety', value: '⚠️ DANGER LEVEL\nLess dangerous than fire/venom. Generally the safest projection method\n\n🛡️ WHEN SAFE TO USE\nGenerally safe IF target is receptive or naturally compatible\nAttracting aligned opportunities\nManifesting prosperity\nDrawing right people toward you\n\n⚖️ KARMA WARNING\nForced attraction (against very unwilling person) creates karmic cost\nBest practice: Attract aligned people, not force unwilling people\nMost ethical when you\'re genuinely magnetic\n\n🎯 USES\nManifestation magic, wealth attraction, attracting right partners/friends/opportunities, drawing abundance toward you' },
                  ]},
                ],
              },
              {
                name: 'Liberating Projection',
                categories: [
                  { name: 'Liberating Projection: Breaking & Shattering Force', emoji: '🦅', content: [
                    { attribute: 'Nature & Power', value: '🦅 CORE NATURE\nAnarchic, boundary-breaking, shattering. Like dragon breaking free\nDestroys constraints/cages/limitations\nMost chaotic projection method' },
                    { attribute: 'Prerequisites & Preparation', value: '⚡ REQUIRED BEFORE USE\nStrong boundaries established\nAnger accessible and channelable\nClear identification of what\'s truly oppressive (not just uncomfortable)\nWillingness to accept consequences\nReadiness for the chaos of freedom' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Ground yourself but also feel accessible anger. Feel yourself in cage/constraint\n(2) Call liberator dragon or air dragon with fierce determination. Feel anarchist energy rising\n(3) Focus on constraint: What\'s limiting you? Belief? Relationship? Job? Situation? Rule? See it clearly as CAGE\n(4) Project shattering force: Visualize dragon breaking chains, shattering walls, creating escape route. Project EXPLOSIVELY with determination\n(5) Simultaneously: Take physical escape action. Leave the job. End the relationship. Break the rule. Move locations. Don\'t just project—actually escape\n(6) Ground after. Integration needed—sudden freedom can be disorienting\n(7) Rebuild and reorient from new freedom' },
                    { attribute: 'Effects & Timing', value: '💥 SHATTERING EFFECTS\nIf projection at situation: situation collapses\nIf at person controlling you: they suddenly cannot control you anymore\nIf at belief: belief shatters\nFreedom appears suddenly\n\n⏱️ TIMING\nQuick (hours to days for manifestation of freedom)\nOften rapid and undeniable\nChaos may follow—embrace it' },
                    { attribute: 'Ethics & Safety', value: '⚠️ DANGER LEVEL\nLiberating projection is CHAOS. It breaks things. Sometimes necessary. But collateral damage possible\n\n🛡️ WHEN SAFE TO USE\nOnly for GENUINE oppression\nAbusive situations (where person\'s autonomy is threatened)\nControlling relationships (where freedom is denied)\nTrue bondage (not just inconvenient responsibility)\n\n⚖️ ETHICS WARNING\nLiberation from true oppression = HIGH MORALITY\nUsing liberation force to escape rightful consequences = LOW MORALITY\nBe honest: What\'s actually oppressive vs. what\'s uncomfortable responsibility?\nCheaper to face consequences than use unjustly\n\n🎯 USES\nEscaping oppression, breaking free from control, shattering limiting beliefs, breaking abuse cycles, creating breakthrough' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Target & Reception',
            tabs: [
              {
                name: 'Self-Projection',
                categories: [
                  { name: 'Self-Projection: Internal Transformation Work', emoji: '🎯', content: [
                    { attribute: 'Target Definition', value: '🎯 WHAT YOU\'RE PROJECTING AT\nYour own being. Transform yourself, integrate power, awaken abilities, restructure consciousness\nInternal alchemy work' },
                    { attribute: 'Safety & Ethics', value: '✅ SAFEST PROJECTION TYPE\nNo karmic cost. Only ethical consideration: Are you truly serving your highest self?\nNo resistance from another will\nComplete autonomy to work' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Identify what you want to transform: limiting belief, trauma, weakness, stuck pattern, undeveloped potential\n(2) Use appropriate dragon force: Fire (burning limitation), Water (shadow/subconscious), Earth (grounding/manifesting), Air (expanding consciousness)\n(3) Project INTO your own body: Visualize draconic force entering, transforming the area of focus\n(4) Allow 2-3 minutes of intense internal work\n(5) Sit with the transformation. It may take days/weeks to fully integrate\n(6) Notice shifts in your being—thoughts, feelings, capabilities' },
                    { attribute: 'Effects & Timeline', value: '💥 INTERNAL TRANSFORMATION EFFECTS\nNoticeable shifts in personality, capability, perspective, behavior\nPeople around you will notice you have changed\n\n⏱️ TIMELINE\nInternal transformation takes longer (weeks to months)\nBut produces PERMANENT change\nIntegration deepens over time' },
                    { attribute: 'Best Practice & Integration', value: '⭐ MASTER TECHNIQUE\nDo self-projection regularly (daily for 10 minutes)\nThis is the FOUNDATION of all magical work\nStart each practice day with self-projection\nWatch cumulative transformation over months\nThis work changes you permanently\n\n🎯 USES\nShadow work, trauma healing, limiting belief dissolution, skill development, consciousness expansion, power integration' },
                  ]},
                ],
              },
              {
                name: 'Direct Target',
                categories: [
                  { name: 'Direct Target: Person or Situation Projection', emoji: '🎯', content: [
                    { attribute: 'Target Definition', value: '🎯 WHAT YOU\'RE PROJECTING AT\nSpecific person OR situation\nInfluence them directly toward your desired outcome\nFocused intention work' },
                    { attribute: 'Prerequisites & Clarity', value: '⚡ REQUIRED BEFORE USE\nAbsolute ethical clarity (are you SURE?)\nFull consent when possible (or clear authority if non-consensual)\nStrong targeting ability\nGrounded energy\nAbsolute conviction about rightfulness' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Clearly identify the person: full name, clear visualization, sense their presence\n(2) Identify exactly what change you are requesting: "I want X to end the relationship," "I want Y to see reality," "I want Z to feel compassion"\n(3) Choose projection method (fire, venom, magnetic) matching desired effect\n(4) Project with complete focus on THAT person\n(5) Hold projection 3-10 seconds with absolute conviction\n(6) Release and trust the work. Stop thinking about the target' },
                    { attribute: 'Consent & Ethics Protocol', value: '🤝 CONSENT FRAMEWORK\nBEST: Ask directly - "Can I send healing/clarity/love energy to you?"\nGOOD: Ask permission energetically - "I ask your permission to send this energy"\nACCEPTABLE: Clear authority situation (parent to child, teacher to student, healer to client) - proceed with benevolent intent\nAVOID: Projecting at unwilling, unrelated person without clear ethical justification\n\n⚖️ KARMA CONSIDERATION\nConsent dramatically reduces karmic cost\nWilling targets amplify effect\nUnwilling targets create karmic debt' },
                    { attribute: 'Targeting & Reception', value: '🎯 TARGETING ACCURACY\nClarity of visualization determines hit accuracy\nIf unclear about target, projection diffuses\nFeel the connection to the person\n\n💪 RESISTANCE HANDLING\nStrong-willed targets may resist or absorb projection differently\nProjection does NOT override free will\nIt is influence, not control\nSome projections fail because target refuses\n\n✅ INDICATION OF SUCCESS\nTarget may report feeling your energy\nSensing your intention\nMoving in direction you projected without knowing why\nSubtle shifts in their behavior/thoughts' },
                  ]},
                ],
              },
              {
                name: 'Landscape Projection',
                categories: [
                  { name: 'Landscape Projection: Geographic & Environmental Work', emoji: '🏠', content: [
                    { attribute: 'Target Definition', value: '🏠 WHAT YOU\'RE PROJECTING AT\nPhysical location (home, office, place of conflict, land)\nAlter the energetic signature of the space\nEnvironmental alchemy work' },
                    { attribute: 'Why Landscape Work', value: '✅ SAFEST FOR NON-CONSENSUAL SITUATIONS\nYou are modifying the space, not forcing a person\nLess karmic concern than personal targeting\nSpace has no will to resist\nEffects ripple to all inhabitants' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Identify the location clearly. Ideally, stand there in person\n(2) Feel the current energy of the space. Is it heavy? Tense? Dark? Light? Stuck?\n(3) Project desired energy with dragon element:\n    • Fire: "This space is healed, cleared, blessed"\n    • Water: "This space is calm, peaceful"\n    • Earth: "This space is prosperous, grounded"\n    • Air: "This space is clear, communicative"\n(4) Visualize energy filling every corner, every wall, every atom of the location\n(5) Hold projection 3-5 minutes with complete certainty\n(6) Ground after\n(7) Feel the shift—space transforms' },
                    { attribute: 'Effects & Duration', value: '💫 EFFECTS ON SPACE\nPeople entering the space report: feeling better, calmer, more creative, safer\nEnergy shifts noticeably\nMood improves naturally\nCreativity flows more freely\n\n⏱️ DURATION & MAINTENANCE\n3+ months of regular landscape projection creates PERMANENT shift\nLandscapes naturally revert over time (weeks/months)\nReinforce monthly for lasting effect\nProjection lasts longer (weeks to months) if reinforced regularly' },
                    { attribute: 'Uses & Integration', value: '🎯 USES\nClearing traumatic locations\nBlessing homes (new residences, family homes)\nTransforming toxic workplaces\nHealing land (negative events, old trauma)\nCreating safe spaces (healing rooms, meditation spaces)\nImproving atmosphere (making spaces more conducive)\n\n✨ MASTERY PRACTICE\nMaintain blessed spaces permanently through monthly reinforcement\nNotice how space quality affects everyone in it\nSee how environmental work supports all other practices' },
                  ]},
                ],
              },
              {
                name: 'Collective Field',
                categories: [
                  { name: 'Collective Field Projection: Group Consciousness Work', emoji: '🌐', content: [
                    { attribute: 'Target Definition', value: '🌐 WHAT YOU\'RE PROJECTING AT\nShared consciousness field of group (family system, workplace, community, movement)\nSubtly shift collective energy/perspective\nGroup consciousness alchemy work' },
                    { attribute: 'Understanding Collective Fields', value: '⚠️ MOST SUBTLE TYPE\nEffects are gradual and group-wide\nNo individual targeting—entire FIELD shifts\nEveryone influenced equally and subtly\nOften feels like "natural group evolution"' },
                    { attribute: 'Invocation Protocol', value: '📋 STEP-BY-STEP\n(1) Identify the collective: What is their current state? Toxic? Loving? Stuck? Divided?\n(2) Identify desired shift: More cooperation? More honesty? More compassion? More clarity?\n(3) Project into the COLLECTIVE FIELD (not individual people): "This community becomes more [desired quality]"\n(4) Hold projection 5-10 minutes. Feel it seeping into the group consciousness\n(5) Reinforce regularly (3x weekly minimum for strength)\n(6) Trust the work—collective shifts are subtle but profound' },
                    { attribute: 'Effects & Timeline', value: '💫 GRADUAL EFFECTS ON COLLECTIVE\nEveryone in collective gradually shifts\nThey do not know why—they just gradually move toward your projected direction\n\n⏱️ TIMELINE\nCollective changes slowly:\n• 1-3 months: Noticeable shift\n• 6+ months: Deep cultural change\n• 12+ months: Permanent transformation\n\nSlower than individual work but more stable' },
                    { attribute: 'Ethics & Mastery', value: '⚖️ ETHICS FRAMEWORK\nCollective projection is SUBTLE influence on many\nHigher ethical standard applies\nOnly project toward genuine good (healing, clarity, compassion)\nNever project manipulation/control into collectives\n\n✅ INDICATION\nOver weeks, you notice group dynamics shifting\nPeople becoming more aligned, cooperative, clear\nChanges feel natural—like the group\'s own idea\n\n🔄 MAINTENANCE\nRequires consistent reinforcement or reverts to previous state\nThis is long-game magic\nMonthly reinforcement maintains shifts indefinitely\n\n🎯 USES\nFamily system healing, workplace culture transformation, community improvement, movement alignment, organizational change' },
                  ]},
                ],
              },
            ],
          },
          {
            name: 'Force Intensity',
            tabs: [
              {
                name: 'Gentle Projection',
                categories: [
                  { name: 'Gentle Projection: Whisper-Soft Influence', emoji: '💫', content: [
                    { attribute: 'Power & Characteristics', value: '💫 POWER LEVEL\n10-20% of maximum capacity\n\n📊 CHARACTERISTICS\nSubtle, barely noticeable, deniable, gentle\nReceiver may not realize they are being influenced\nManipulation completely hidden' },
                    { attribute: 'When to Use Gentle', value: '⏰ APPROPRIATE SITUATIONS\nSubtle influence needed\nMaintaining plausible deniability\nWorking around strong resistance\nLong-term influence work\nAvoiding detection\nWorking with sensitive targets\nInitial soft touches before stronger work' },
                    { attribute: 'Technique & Practice', value: '🎭 HOW TO PROJECT GENTLY\nProject with soft focus. Use minimal energy\nImagine influence as whisper, mist, gentle breeze rather than force\nBarely perceptible to consciousness\nWorks on subconscious level\nPatient and gradual\nNo drama or disruption' },
                    { attribute: 'Effectiveness & Results', value: '📈 EFFECTIVENESS PROFILE\nSpeed: Slow (weeks to months for results)\nSubtlety: Very subtle. Can easily be overcome by counter-intention\nResistance: Works well on receptive/willing targets. Low resistance to overcome\nPermanence: Gradual accumulation creates stability\n\n💪 RESISTANCE HANDLING\nWeak targets: Very effective\nMedium targets: Moderate effectiveness\nStrong targets: May need reinforcement or escalation' },
                    { attribute: 'Ethics & Integration', value: '⚖️ KARMIC COST\nModerate. You are influencing without their obvious knowing\n\n🛡️ SAFETY\nVery safe. Hard to detect. Easy to hide\nHard to trace back to source\n\n💭 EXAMPLE\nSubtle magnetism toward attraction partner (they slowly feel drawn without realizing why)\nGentle shifting of opinion in group discussion\nSoft influence on decision-making\n\n✅ INDICATION\nTarget may say "I have been thinking..." or "For some reason I feel..."\nThey attribute shift to their own thoughts\nYou remain completely in background\nNo awareness of external influence' },
                  ]},
                ],
              },
              {
                name: 'Standard Projection',
                categories: [
                  { name: 'Standard Projection: Direct Clear Force', emoji: '⚡', content: [
                    { attribute: 'Power & Characteristics', value: '⚡ POWER LEVEL\n50-70% of maximum capacity\n\n📊 CHARACTERISTICS\nClear, obvious to sensitive people\nConfident, direct projection\nStrong intention visible to those paying attention\nBalanced between subtlety and power' },
                    { attribute: 'When to Use Standard', value: '⏰ APPROPRIATE SITUATIONS\nConfident magical work\nSituations where some subtlety helps but not essential\nWorking with consenting targets\nGeneral manifestation work\nProtection work\nGroup blessings\nBuddy or ally support\nHealing work with willing recipients' },
                    { attribute: 'Technique & Practice', value: '🎭 HOW TO PROJECT STANDARDLY\nProject with full focus and moderate power\nUse substantial energy but not maximum\nImagine influence as clear stream, steady light, palpable presence\nVisible but not overwhelming\nClear intention, moderate force\nEffective and honest' },
                    { attribute: 'Effectiveness & Results', value: '📈 EFFECTIVENESS PROFILE\nSpeed: Medium speed (days to weeks for results)\nSubtlety: Noticeable to those paying attention\nResistance: Strong enough to create real change. Can be resisted by strong-willed targets but requires effort\nPermanence: Solid and lasting when they accept\n\n💪 RESISTANCE HANDLING\nWeak targets: Easily moved\nMedium targets: Clear effect\nStrong targets: Requires intention to resist' },
                    { attribute: 'Ethics & Integration', value: '⚖️ KARMIC COST\nModerate-low. You are projecting clear intention toward willing or justified target\n\n🛡️ SAFETY\nSafe if target is consenting or you have clear authority\nModerate risk if target is unwilling\nTraceable if questioned\n\n💭 EXAMPLE\nHealing projection to consenting friend\nManifestation projection for career change\nClear blessing of family member\nSupport for colleague\'s good work\n\n✅ INDICATION\nSensitive people feel your projection clearly\nTarget may say "I felt something" or notice shift\nYou are present but not overwhelming\nClear energy exchange' },
                  ]},
                ],
              },
              {
                name: 'Fierce Projection',
                categories: [
                  { name: 'Fierce Projection: Overwhelming Draconic Force', emoji: '💥', content: [
                    { attribute: 'Power & Characteristics', value: '💥 POWER LEVEL\n90%+ of maximum capacity\n\n📊 CHARACTERISTICS\nUnmissable, undeniable, overwhelming, powerful\nEveryone feels this immediately\nTarget KNOWS they are being influenced\nNo subtlety whatsoever' },
                    { attribute: 'When to Use Fierce', value: '⏰ APPROPRIATE SITUATIONS\nBreaking strong resistance\nForcing necessary change\nEmergency situations\nLife-or-death scenarios\nDefending against attack\nOverwhelming obstacles\nSituations demanding immediate transformation\nWhen gentle/standard won\'t work' },
                    { attribute: 'Technique & Practice', value: '🎭 HOW TO PROJECT FIERCELY\nProject with maximum power and complete conviction\nUse all your energy, will, and draconic force\nImagine explosion, flood, avalanche, overwhelming tsunami\nHold nothing back\nTotal commitment\nNo mercy\nAbsolute certainty' },
                    { attribute: 'Effectiveness & Results', value: '📈 EFFECTIVENESS PROFILE\nSpeed: Very fast (hours to days for manifestation)\nPower: Guaranteed to create change\nResistance: Can override strong resistance\nPermanence: Dramatic but may need integration\n\n💪 RESISTANCE HANDLING\nWeak targets: Instantly compliant\nMedium targets: Quickly overwhelmed\nStrong targets: Can feel it even strong-willed targets cannot ignore (severe resistance)\nNo escape—effect is undeniable' },
                    { attribute: 'Dangers & Ethics', value: '⚠️ DANGER LEVEL\nDangerous if used carelessly\nCan damage target psychologically or energetically\nCan trigger backlash/counter-magic\nOnly use when absolutely certain of righteousness\n\n⚖️ KARMIC COST\nHigh. Using maximum force creates karmic obligation\nUse only in truly justified situations\nBetter to accept consequences than use unjustly\n\n💭 EXAMPLE\nBreaking abuser\'s hold on victim\nEmergency healing force for dying person\nDefensive magic against psychic attack\nForcing end to unjust situation\nEmergency intervention\n\n⚠️ WARNING\nFierce projection can traumatize target or trigger unexpected consequences\nUse as LAST RESORT, never casually\nMay create enemies or counter-magic\n\n✅ INDICATION\nEveryone feels this immediately\nTarget KNOWS they have been hit\nYou may face retaliation if unjustified\nConsequences may follow' },
                  ]},
                ],
              },
              {
                name: 'Sustained Projection',
                categories: [
                  { name: 'Sustained Projection: Daily Drip vs. Occasional Flood', emoji: '🎯', content: [
                    { attribute: 'Core Strategy', value: '🎯 FUNDAMENTAL PRINCIPLE\nConsistency over intensity. Regular small projections more powerful than rare huge ones\n\n💡 WHY SUSTAINED WORKS\nSustained force builds momentum\nUnconscious mind responds to daily repetition\n• Weekly huge projection = easily overcome\n• Daily small projection = unstoppable accumulation\n• Resistance cannot build against consistent pressure' },
                    { attribute: 'Beginner Sustained Practice (Weeks 1-2)', value: '📋 PROTOCOL\nProject once daily for 3-5 minutes\nSmall-to-moderate intensity\nHold intention lightly. Release completely\nDon\'t obsess between projections\nTrust the daily work\n\n⏱️ BASELINE\nDaily consistency more important than power\nEven gentle daily projection works\nBuilds power through accumulation' },
                    { attribute: 'Intermediate Sustained Practice (Week 3-8)', value: '📋 PROTOCOL\nProject 2x daily (morning/evening) for 5-10 minutes\nBuild slight momentum. Feel energy accumulating\nNotice target beginning to move toward you\nMaintain consistency above all\n\n📈 ACCELERATION\nTwo daily projections significantly increase speed\nCompound effect becomes noticeable\nTarget resistance begins cracking' },
                    { attribute: 'Advanced Sustained Practice (Month 3+)', value: '📋 PROTOCOL\nProject 3-5x daily for 5 minutes each\nMultiple daily hits accumulate exponentially\nTarget cannot resist because force is consistent, not confrontational\nIntention becomes seamlessly woven into day\n\n💪 UNSTOPPABLE FORCE\nConsistency becomes unbeatable\nTarget\'s resistance impossible to maintain\nManifestations appear with certainty' },
                    { attribute: 'Timeline Comparison & Mastery', value: '⏱️ SPEED COMPARISON\nOccasional fierce (1x per week): Results in 2-3 months. Often overcome before manifesting\nDaily gentle (5-10 min): Results in 4-6 weeks. Deeply permanent once manifested\nDaily standard (5-10 min 2x): Results in 2-4 weeks. Very strong manifestation\n\n⭐ MASTER PRINCIPLE\nConsistency beats intensity\nBetter to project gently every day for 3 months than fiercely once\nThe daily drip carves the groove that reality follows\nSmall daily actions reshape reality more than dramatic gestures\n\n🔄 MAINTENANCE PROTOCOL\nEven after goal manifests, sustain 2-3x weekly\nProjections eventually fade (weeks/months)\nReinforcement keeps them alive\nLifetime reinforcement = lifetime manifestation\n\n📊 FULL PROGRESSION\n• Week 1: Initial manifestation barely visible\n• Week 2-3: Noticeable movement\n• Week 4-6: Clear change\n• Week 8-12: Permanent shift\n• Month 6+: Manifestation becomes natural baseline (no longer requires projection)' },
                  ]},
                ],
              },
            ],
          },
        ],
      },
      knowledgeBase: { title: 'Knowledge Base', sections: [
          { heading: 'Dragon Force and Reality Reshaping', content: 'Dragon magick recognizes that consciousness actively shapes reality. When you project draconic force—whether through fire, venom, hoarding, or liberation—you are literally bending probability toward your will. This is not fantasy but basic physics: consciousness collapses quantum waves toward observed possibility. Dragons demonstrate this mastery: they do not negotiate with reality; they reshape it through sheer will and presence. Learning draconic projection means learning to reshape reality the way dragons do—not passively accepting what is, but actively transmuting circumstances toward your vision' },
          { heading: 'The Dragon\'s Unflinching Will', content: 'What makes dragon force so effective is that it never doubts, never hesitates, never negotiates. When a dragon projects force, it is already complete—no question marks, no contingencies, no "if" or "maybe." The human who learns draconic projection must develop this same unwavering will. This doesn\'t mean aggression; it means absolute clarity about what you want and certainty that you will reshape reality toward it. Doubt weakens projection. Half-commitment produces half-effects. Dragon force is total commitment or nothing' },
          { heading: 'Resistance and Adaptation', content: 'Some targets resist projection—people with strong wills, situations with entrenched circumstances, locations with historical weight. Dragon response: adapt. Fire force doesn\'t work? Switch to venom force. Direct approach blocked? Use hoarding magnetism. Lizard-brained resistance? Apply liberation force to break the cage. The master projects with flexibility—multiple tools in the dragon\'s arsenal, choosing what works for this particular situation. Stubbornness that refuses adaptation is not dragon strength; it is rigidity. Dragons are fierce AND adaptive' },
          { heading: 'Manifestation Timeline and Patience', content: 'Dragon force manifests on its own timeline, not your timeline. Sometimes immediate (you project, next day circumstances shift). Sometimes delayed (you project, nothing for weeks, suddenly everything changes). The practitioner must trust the work without obsessive checking. Obsessive focus weakens the projection by re-engaging conscious doubt. Project with full conviction, then release. Let the dragon work in the hidden realms. Results appear when they appear. The sign of mastery is projecting with absolute conviction and then forgetting about it' },
        ],
      },
      gettingStarted: { title: 'Getting Started', steps: [
          'Choose your target: yourself, specific person, situation, or location. Be clear',
          'Choose your projection method: fire (clearing), venom (subtle influence), treasure (manifesting), liberation (breaking free)',
          'Visualize draconic force clearly: see its color, feel its intensity, know exactly what it carries',
          'Embody dragon consciousness: feel yourself as dragon ready to express power. Build the state fully',
          'Project deliberately: breath, movement, voice, will—all expressing the intention simultaneously',
          'Release and trust: after projection, let it go completely. Stop thinking about the target. Trust the dragon work',
          'Track results: notice changes in target (person, situation, location) over following days/weeks. Don\'t obsess',
          'Repeat for 40 days minimum: daily projection of same intention builds compound effect. Consistency matters',
          'Adapt if needed: if results aren\'t appearing, change approach. Try different method, different timing, different intensity',
          'Integrate the success: once manifestation appears, acknowledge it and integrate into new normal. Begin next projection if desired',
      ]},
      tips: { title: 'Tips for Practice', items: [
          { title: 'Conviction Precedes Effect', text: 'A hesitant projection fails. Before you project, embody the dragon completely. Know with absolute certainty that you will reshape reality' },
          { title: 'Release Is Essential', text: 'Obsessive focus on results weakens them by re-engaging doubt. Project once with full power, then completely forget about it. This is counterintuitive but essential' },
          { title: 'Multiple Methods Available', text: 'If one projection method isn\'t working, don\'t repeat obsessively. Switch methods. Fire didn\'t work? Try venom. Venom too subtle? Try fierce direct projection' },
          { title: 'Respect Target Agency', text: 'Some targets have enough will to resist. This is not failure; it\'s respect for their agency. Accept that some projections fail because target refuses' },
          { title: 'Time Compounds Effect', text: 'One projection: temporary. Seven projections: noticeable. Forty projections: permanent reality shift. Duration matters more than intensity for lasting change' },
      ]},
      resources: { title: 'Resources', items: [
          'Chaos magic force projection and directed will practices',
          'Huna teachings on using will to shape reality',
          'Hermetic teachings on creative will and manifestation',
          'Dragon mythology across cultures: how dragons reshape reality',
          'Advanced sigil work for focused force projection'
      ],
      },
    },
  },
];

const styles = StyleSheet.create({
  practiceContainer: {
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
    flex: 1,
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
    elevation: 2,
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

export default function LuciferScreen() {
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
    const witchUnlocked = isUnlocked('witchLucifer') || isTest('witchLucifer');
    const isLocked = !hasSubscription && !witchUnlocked;
    setIsWitchLocked(isLocked);

    if (!isLocked) {
      // If unlocked and no subscription, 5% chance to show an ad
      if (!hasSubscription && Math.random() < 0.05) {
        try {
          await AppodealService.cacheAds();
          await AppodealService.showRewardedAd();
        } catch (error) {
          console.error('[LuciferScreen] Error showing ad:', error);
        }
      }
      // Navigate to PracticeDetail at root level
      try {
        console.log('Navigating to PracticeDetail');
        navigation.navigate('LuciferPracticeDetail', { practice });
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
    <View style={[styles.practiceContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <Text style={[styles.title, { color: textColor }]}>😈 Lucifer</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            Shadow Mastery & Inner Alignment
          </Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {SPIRIT_PRACTICES.map((practice: any) => (
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
                    {practice.subName && practice.description ? `${practice.subName} - ${practice.description}` : practice.subName || practice.description}
                  </Text>
                </View>
                </TouchableOpacity>
              )
            ))}
          </View>
        </View>
      </ScrollView>

      <WitchLockOverlay
        witchType="Lucifer"
        lockKey="witchLucifer"
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
