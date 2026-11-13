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

const INTERCESSION_PRACTICES = [
  {
    id: 1,
    name: 'Principles',
    emoji: '🧭',
    continuityEmoji: '🔥',
    type: 'Intercession Foundations',
    element: 'Fire',
    intent: 'Establish core principles of embodied spiritual experience, altered consciousness, and safe ecstatic practice',
    description: 'Intercession Foundations - Establish core principles of embodied spiritual experience, altered consciousness, and safe ecstatic practice',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '⚡',
            name: 'Disruption',
            content: [
              { attribute: 'Definition', value: 'Breaking habitual consciousness and entering altered states where transformation becomes possible' },
              { attribute: 'Method', value: 'Frenzy, ecstasy, trance, possession—all disrupt ordinary consciousness' },
              { attribute: 'Purpose', value: 'Disruption creates opening for spirits, visions, and direct knowing' },
              { attribute: 'Risk', value: 'Disruption without containment can be destabilizing; always have grounding practices' },
            ]
          },
          {
            emoji: '🫀',
            name: 'Embodiment',
            content: [
              { attribute: 'Definition', value: 'Consciousness moves from head into full body; spirit works through flesh' },
              { attribute: 'Experience', value: 'Not transcendence but immersion—diving deeper into sensation, feeling, animal knowing' },
              { attribute: 'Power', value: 'Body knows things mind cannot; trust trembling, sweating, heat, movement' },
              { attribute: 'Integration', value: 'Embodied spirituality requires caring for the physical vessel' },
            ]
          },
          {
            emoji: '⏳',
            name: 'Temporality',
            content: [
              { attribute: 'Definition', value: 'Altered states exist outside normal time; moments expand or compress' },
              { attribute: 'Experience', value: 'An hour of trance may feel like minutes; a moment may stretch infinitely' },
              { attribute: 'Navigation', value: 'Learn to track time differently; work with cyclical rather than linear time' },
              { attribute: 'Integration', value: 'Returning to normal time consciousness requires gentle transition' },
            ]
          },
          {
            emoji: '⚠️',
            name: 'Risk and Consent',
            content: [
              { attribute: 'Definition', value: 'Altered state work carries real risks; only practice with clear consent and preparation' },
              { attribute: 'Risks', value: 'Psychological destabilization, spiritual intrusion, integration difficulties, re-traumatization' },
              { attribute: 'Prerequisites', value: 'Mental health stability, community support, experienced guides, personal boundaries' },
              { attribute: 'Responsibility', value: 'Never pressure anyone into altered state work; respect individual pace and capacity' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Disruption: Breaking Ordinary Consciousness',
            content: 'Altered state work requires disruption—breaking through the habitual consciousness that usually runs your awareness. This disruption can take many forms: rhythmic dancing that exhausts the thinking mind, frenzy that overtakes control, trance that dissolves self-awareness, possession that replaces the self with spirit presence. Disruption is not violence against yourself; it is opening a door. But like any door opening, it requires care and clear intention about what you are inviting in. Without clear preparation, disruption can become destabilizing psychological experience rather than spiritual opening.'
          },
          {
            heading: 'Embodiment: The Sacred Body',
            content: 'Embodied spirituality is not about transcendence—escaping the body to reach spirit realms. Rather, it is diving deeper into the body to find spirit already present in flesh. When you practice ecstatic spirituality, you learn that divinity moves through trembling, through heat, through sexual energy, through tears and laughter. Your body is not a cage containing spirit; it is the very vehicle through which spirit moves. This requires radical acceptance of sensation—not trying to control or spiritualize it, but letting it teach you. The body knows things the mind cannot grasp. Trust sweat, heat, electricity, movement.'
          },
          {
            heading: 'Temporality: Time Becomes Liquid',
            content: 'In altered states, linear time dissolves. An hour can feel like minutes. A moment can expand into eternity. This is not hallucination; it is genuine alteration of consciousness. Your nervous system, when deeply relaxed or highly activated, processes time differently than your thinking mind. Learning to navigate this altered temporality is a skill. You develop sensitivity to when time is speeding, when it is stretching, when it is moving in circles. Returning to normal time consciousness requires gentle transition. The worst integration problems come from forcing yourself back to linear time too quickly.'
          },
          {
            heading: 'Risk and Consent: Not for Everyone, Not Always',
            content: 'Altered state work is powerful and carries real risks. It is not appropriate for everyone, and it is not something to approach casually. Some people with certain mental health conditions (psychosis, severe trauma, dissociative disorders) can be re-traumatized or destabilized by ecstatic practice. Even for those suited to it, altered state work requires careful preparation, community support, experienced guides, and clear personal boundaries. Never pressure anyone—including yourself—into this work. Honor individual capacity and pace. The spiritual tradition that respects safety is stronger and more authentic than the tradition that demands sacrifice.'
          },
          {
            heading: 'Integration: The Hardest Part',
            content: 'The most difficult part of altered state work is integration—bringing the insights, experiences, and changes back into ordinary life. Ecstatic experiences can be overwhelming, destabilizing, or profoundly transformative. Without proper integration support, people can become spiritually bypassing—using spiritual experience to avoid psychological work—or they can experience spiritual crisis. Integration requires time, community, embodiment practices, and sometimes professional support. The goal is not to stay in altered states but to bring their gifts into ordinary consciousness and embodied life.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Honestly assess your mental and emotional health; this work is not appropriate when unstable',
          'Find a teacher or experienced guide in embodied spirituality practice',
          'Develop a strong grounding practice before attempting deeper altered states',
          'Start with mild disruption: rhythmic movement, singing, dancing for 20-30 minutes',
          'Keep a journal of experiences, physical sensations, and integration challenges',
          'Build community with others doing this work; do not practice alone',
          'Learn to recognize early signs of integration difficulty and reach out for support',
          'Practice embodiment grounding after each session, even if you feel fine',
          'Gradually increase intensity only as you develop skill and community support',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Consent to Your Own Consciousness',
            text: 'You must fully agree to open altered states. If part of you is reluctant, wait. Consciousness cannot be forced. Work only when fully willing.'
          },
          {
            title: 'Protect Your Container',
            text: 'The quality of the container—physical space, psychic boundaries, witnessing community—directly determines the quality of experience. Do not rush the setup.'
          },
          {
            title: 'Physical Sensations Are Communication',
            text: 'Trembling, heat, coldness, nausea, sexual arousal—these are not problems to overcome. They are the language of altered consciousness. Listen and learn.'
          },
          {
            title: 'Do Not Spiritualize Everything',
            text: 'Not every altered state experience is profound spiritual teaching. Some is just your nervous system adjusting. Some is trauma rising. Sort this carefully with community support.'
          },
          {
            title: 'Integration Takes Time',
            text: 'Expect integration to take weeks or months, not hours. Embodied experiences integrate slowly. Be patient with yourself and your nervous system.'
          },
          {
            title: 'You Can Say No',
            text: 'If a spirit or experience does not feel right, you can refuse it. You have authority over your own consciousness. No guide, spirit, or teacher overrides your consent.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Books on somatic practices and embodied spirituality—Peter Levine\'s "Waking the Tiger"',
          'Teachers and guides trained in ecstatic dance, trance, and possession work',
          'Community circles focused on safe altered state exploration',
          'Mental health professionals trained in spiritual crisis and integration',
          'Books on nervous system regulation and trauma recovery',
          'Pagan and witchcraft communities with established safety protocols',
          'Workshops on setting sacred containers and creating safe space',
          'Resources on consent culture and bodily autonomy in spiritual practice',
          'Music and drumming for trance induction',
          'Articles on the integration challenges of intense spiritual experience',
          'Mentorship from experienced practitioners in your tradition',
        ]
      }
    }
  },
  {
    id: 2,
    name: 'Ontology',
    emoji: '🔮',
    continuityEmoji: '💫',
    type: 'Intercession Foundations',
    element: 'Air',
    intent: 'Understand the beings and forces that work through embodied mediation',
    description: 'Intercession Foundations - Understand the beings and forces that work through embodied mediation',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '⚡',
            name: 'Incoming Forces',
            content: [
              { attribute: 'Definition', value: 'Powers that arrive from beyond ordinary consciousness; gods, spirits, ancestors, currents' },
              { attribute: 'Characteristics', value: 'Seek embodied expression; require willing human vessels; carry intention and teaching' },
              { attribute: 'Communication', value: 'Can only express through human body and speech; cannot manifest without mediation' },
              { attribute: 'Work', value: 'Often arrive with specific purpose: healing, prophecy, transformation, community need' },
            ]
          },
          {
            emoji: '🗣️',
            name: 'Mediated Voices',
            content: [
              { attribute: 'Definition', value: 'The specific way a spirit speaks through a human channel; the spirit\'s unique voice' },
              { attribute: 'Expression', value: 'Different accent, vocabulary, body posture, emotional tone—spirit becomes recognizable through style' },
              { attribute: 'Authenticity', value: 'Genuine spirits have consistent voice and teaching; fakes shift and contradict' },
              { attribute: 'Relationship', value: 'Over time, channel develops relationship with spirit\'s unique presence and communication' },
            ]
          },
          {
            emoji: '🔀',
            name: 'Threshold Selves',
            content: [
              { attribute: 'Definition', value: 'Altered versions of your own consciousness; self-states that arise in trance' },
              { attribute: 'Distinction', value: 'Not separate from you but parts of you accessed in altered consciousness' },
              { attribute: 'Function', value: 'May perceive differently, speak differently, have different knowledge than waking self' },
              { attribute: 'Work', value: 'Can access buried memories, shadow knowledge, and shamanic awareness' },
            ]
          },
          {
            emoji: '👁️',
            name: 'Discernment: Distinguishing Spirits',
            content: [
              { attribute: 'Challenge', value: 'Not all voices in altered consciousness are genuine spirits or helpful forces' },
              { attribute: 'Testing', value: 'Ask spirits to identify themselves, show their purpose, demonstrate power' },
              { attribute: 'Red Flags', value: 'Spirits that demand secrecy, ask for harm, change their story, or claim exclusive authority are suspect' },
              { attribute: 'Community', value: 'Experienced witness and community help discern authentic spirits from psychological projection' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Incoming Forces: Powers That Seek Expression',
            content: 'Mediation work assumes that there are powers, spirits, gods, and currents seeking expression in the material world. These forces cannot manifest directly—they need embodied vehicles. They seek willing humans to work through. Some arrive with specific purpose: an ancestor wanting to teach, a god wanting to offer blessing, a healing spirit wanting to treat illness. The medium—the human channel—becomes the vessel for this expression. The quality of mediation depends on the medium\'s clarity, the spirit\'s integrity, and the container\'s safety. Not all incoming forces are beneficial. Some are confused, some are predatory. Learning discernment is essential.'
          },
          {
            heading: 'Mediated Voices: The Spirit\'s Signature',
            content: 'When a spirit works through you, it develops a recognizable voice. Not just the words it speaks but the way it moves your body, the accent that emerges, the emotional tone, the characteristic teachings. Over time, you learn your spirit guide\'s unique presence. You can recognize when it is present before it even speaks. This voice becomes as familiar as a friend\'s voice. Genuine spirits have consistent character—they teach the same values, they express the same concerns, they show up reliably. Fake presences—psychological projections or parasitic entities—cannot maintain consistency. They shift, contradict themselves, change their story. Learning to recognize your spirit\'s true voice is one of the deepest skills in mediation work.'
          },
          {
            heading: 'Threshold Selves: Meeting Your Own Altered Consciousness',
            content: 'Not all presences in altered states are external spirits. Some are threshold selves—altered versions of your own consciousness. In deep trance, you may contact younger versions of yourself, shadow aspects, or latent abilities. These are not separate from you but parts of you accessed differently. A threshold self might perceive things waking consciousness cannot—see into people\'s hearts, sense spiritual presences, know future outcomes. These are genuine abilities, genuinely accessed, but they arise from your own consciousness, not external spirits. Learning to distinguish between external spirit and internal threshold self takes practice. Both are valuable. Both teach. But they have different qualities.'
          },
          {
            heading: 'Discernment: The Hardest Skill',
            content: 'The most challenging and essential skill in mediation is discernment—knowing which forces are real, which are helpful, which can be trusted. Not everything that moves in altered consciousness is a high spirit. Some is your own psychological material. Some is parasitic or predatory entity. Some is confused or mischievous spirit. You develop discernment by testing spirits, by listening to experienced community, by watching for consistency, by checking whether the spirit\'s teaching creates healing or harm. Red flags include: spirits that demand secrecy, that ask you to harm others, that claim exclusive access to truth, that create dependence on the channel. True spirits empower people toward independence, integrity, and community strength.'
          },
          {
            heading: 'Integration: Relationship Rather Than Possession',
            content: 'In mature mediation work, the channel does not lose themselves in possession. Rather, they develop relationship with the incoming presence. The channel retains awareness, maintains boundaries, and remains in conversation with the spirit. This is not the same as the spirit taking over completely. A healthy mediation is collaborative: the spirit speaks through you, but you remain present, consenting, engaged. The goal is not for the spirit to replace you but to work with you, to enhance human consciousness, not obliterate it. This requires ongoing development and training—learning to hold both self and spirit simultaneously.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Identify which presences you naturally attract or sense most strongly',
          'Ask permission to develop mediation relationship with a specific spirit or force',
          'Start with brief channeling sessions—15-20 minutes—with trusted witness',
          'Record your channeling and review for patterns in voice and teaching',
          'Build relationship slowly; spirits worth working with move at your pace',
          'Test any new presence: ask its name, purpose, teaching, commitment to community',
          'Never trust a spirit that demands secrecy, exclusivity, or harmful action',
          'Develop embodied discernment by comparing impressions with trusted witnesses',
          'Remember you can refuse any presence; your consent is absolute',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Consistency Reveals Truth',
            text: 'A genuine spirit has consistent voice, teaching, and character. Inconsistency signals psychological projection or deceptive entity. Pay attention to patterns.'
          },
          {
            title: 'Community Witnesses Are Essential',
            text: 'You cannot fully discern your own channeling alone. Trusted witnesses see things you cannot. Their feedback is invaluable for quality control.'
          },
          {
            title: 'Spirits Have Integrity or They Don\'t',
            text: 'A genuine spirit will not demand secrecy, ask you to harm others, or claim exclusive truth. These are always red flags. Trust your instinct.'
          },
          {
            title: 'Your Body Remembers',
            text: 'Your body knows the difference between authentic spirit presence and psychological projection. Trust the felt sense—tingling, heat, electric feeling often indicate genuine contact.'
          },
          {
            title: 'Test Before Trust',
            text: 'Do not assume benevolence. Test new presences, ask them to prove their integrity, observe their teaching over time. Discernment requires healthy skepticism.'
          },
          {
            title: 'Relationship Deepens Slowly',
            text: 'Do not expect instant intimacy with spirits. Real relationship develops through repeated interaction, consistency, and proven trustworthiness over months and years.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Books on spirit possession and mediation in Pagan traditions',
          'Experienced mediums and channel teachers in your area',
          'Recording equipment for documenting and reviewing your work',
          'Community circles focused on channeling and spirit work',
          'Books on discernment and discernment protocols in spiritual practice',
          'Workshops on maintaining boundaries during possession and channeling',
          'Resources on recognizing predatory spirits and psychic parasites',
          'Comparative study of how different traditions approach mediation',
          'Journal practice guides for recording and reflecting on spirit work',
          'Articles on psychological projection vs. genuine spirit contact',
          'Mentors who have developed long-term relationships with specific spirits',
        ]
      }
    }
  },
  {
    id: 3,
    name: 'Engagement',
    emoji: '💭',
    continuityEmoji: '⚡',
    type: 'Intercession Practices',
    element: 'Fire',
    intent: 'Learn the three primary modes of entering and working through altered consciousness',
    description: 'Intercession Practices - Learn the three primary modes of entering and working through altered consciousness',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🎉',
            name: 'Frenzy',
            content: [
              { attribute: 'Definition', value: 'Ecstatic movement and activation; consciousness heightened through rhythmic intensity' },
              { attribute: 'Expression', value: 'Dancing, drumming, chanting—physical intensity overwhelms thinking mind' },
              { attribute: 'Consciousness', value: 'Fully aware but no longer in control; body moves with its own intelligence' },
              { attribute: 'Outcome', value: 'Ecstatic experience, physical release, access to instinctual knowing, shamanic power' },
            ]
          },
          {
            emoji: '👁️',
            name: 'Possession',
            content: [
              { attribute: 'Definition', value: 'Spirit movement takes over conscious awareness; the human steps back' },
              { attribute: 'Experience', value: 'You remain present but not in control; watching your body and voice used by spirit' },
              { attribute: 'Communication', value: 'Spirit speaks, moves, touches through your body; community receives teaching directly' },
              { attribute: 'Memory', value: 'You may not remember what happened; witness reports what spirit said and did' },
            ]
          },
          {
            emoji: '💎',
            name: 'Vision',
            content: [
              { attribute: 'Definition', value: 'Consciousness shifts to see other worlds, future, or spiritual reality' },
              { attribute: 'Experience', value: 'Eyes may be open or closed; awareness moves to other planes of existence' },
              { attribute: 'Communication', value: 'Vision-holder sees and speaks what they perceive; teaching comes from sight' },
              { attribute: 'Integration', value: 'Vision must be interpreted; symbols carry layered meaning requiring time to understand' },
            ]
          },
          {
            emoji: '⏳',
            name: 'Time and Awareness',
            content: [
              { attribute: 'Frenzy', value: 'Compressed time; hours feel like minutes; high awareness within intensity' },
              { attribute: 'Possession', value: 'Lost time; you may remember nothing; community holds record of what happened' },
              { attribute: 'Vision', value: 'Expanded time; vision time is slower; returning to normal time requires adjustment' },
              { attribute: 'Transition', value: 'Each mode requires different return protocol; do not rush transition' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Frenzy: Ecstasy Through Intensity',
            content: 'Frenzy is ecstatic consciousness accessed through rhythmic intensity. Your thinking mind becomes exhausted through movement, sound, and intensity—it steps back, and deeper consciousness emerges. In frenzy, you are fully present but not in control. You remain aware but your body moves with its own intelligence, your voice makes sounds you did not plan. This is not dissociation but heightened presence in the body. Frenzy gives access to shamanic power, to animal knowing, to what cultures call the ecstatic experience of divinity in the body. The consciousness of frenzy is fast, bright, electric. Most traditions have frenzy practices: ecstatic dance, spinning, drumming, chanting.'
          },
          {
            heading: 'Possession: Complete Handoff',
            content: 'Possession is different from frenzy. In possession, the embodied consciousness steps completely back and another presence moves fully forward. You remain present but as observer—watching what your body does, hearing what your voice says, but not directing it. This is the deepest form of channeling. The spirit has complete use of the body for the duration of the work. True possession is rare and requires significant preparation and protection. Most people\'s channels are partial—spirit moves through them but the human retains some awareness and control. Complete possession is reserved for experienced channels with strong communities and clear protocols.'
          },
          {
            heading: 'Vision: Consciousness Shifts Location',
            content: 'Vision work moves consciousness to see other worlds or spiritual reality. The visionary\'s eyes may be open or closed but their awareness moves to other planes. They see scenes, symbols, landscapes, future events, or spiritual beings. Vision can arise through trance, fasting, plant medicine, or spontaneous opening. The vision must be integrated afterward—the symbols and scenes interpreted, the meaning unpacked. Vision is often more subtle than frenzy or possession but equally powerful. Many healing and prophecy traditions rely on vision work as their primary mode.'
          },
          {
            heading: 'Integration: Different Modes, Different Needs',
            content: 'Each mode requires different integration. Frenzy leaves you exhausted but relatively present—you remember clearly, though you may feel physically depleted. Possession leaves you in altered consciousness—you may remember nothing, and your body may be deeply depleted. Vision leaves you in expanded consciousness—you need time to translate what you saw into words and meaning. Rushing any of these processes creates psychological and spiritual problems. Honor the different timescales. Frenzy integration: hours. Possession integration: days. Vision integration: weeks or months for full understanding.'
          },
          {
            heading: 'Choice and Flexibility',
            content: 'Different practices use different modes. Some traditions emphasize frenzy as primary path. Others use vision exclusively. Some work primarily with possession. Mature practitioners develop capacity in multiple modes—choosing the right tool for the work at hand. Sometimes ecstatic frenzy is what is needed. Sometimes the direct teaching of possessed channeling serves the community. Sometimes vision and prophecy guide the way forward. Flexibility—knowing which mode to enter and when—comes through years of practice and community learning.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Choose one mode that feels most natural and safe to you initially',
          'Practice in controlled settings with experienced guides and community',
          'Start with brief sessions: 20-30 minutes of frenzy, short possessions, simple visions',
          'Develop strong embodiment and grounding practice before advancing',
          'Keep detailed journal of experiences in each mode',
          'Gradually extend duration only as comfort and community support grow',
          'Learn integration practices specific to each mode',
          'Eventually explore other modes as capacity develops',
          'Never practice any mode alone; community witnessing is essential safety',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Frenzy Requires Physical Fitness',
            text: 'The body must be healthy enough for sustained intensity. Work with your physical capacity. Stop if you feel pain—that is different from ecstatic fatigue.'
          },
          {
            title: 'Possession Needs Clear Signals',
            text: 'If working with possession, establish clear signals for "stop" that do not require speaking. Your witness needs to know your signals perfectly.'
          },
          {
            title: 'Vision Time Is Strange Time',
            text: 'Vision can feel simultaneous—all moments happening at once. Allow yourself days or weeks to make sense of what you saw. Do not rush interpretation.'
          },
          {
            title: 'Your Body Has Limits',
            text: 'Respect physical exhaustion after frenzy. Honor the depletion that can follow possession. These are real physiological experiences, not weakness.'
          },
          {
            title: 'Community Holds What You Cannot',
            text: 'In possession, you cannot remember what happened. Community witnesses what you cannot see. Trust their report and reflection.'
          },
          {
            title: 'Transition Protocols Matter',
            text: 'The way you return from altered states is as important as the way you enter. Rushing return causes problems. Use full grounding practices every time.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Books on ecstatic dance and movement practices in Paganism',
          'Experienced facilitators trained in holding space for altered states',
          'Drumming circles and rhythm-based community practices',
          'Teachers trained in channeling and possession work',
          'Vision quest guides and oracular tradition teachers',
          'Books on integration challenges and best practices',
          'Community circles specifically for practitioners of ecstatic work',
          'Resources on nervous system recovery after intense practices',
          'Music and recordings designed for trance induction',
          'Comparative study of possession practices across cultures',
          'Mentorship from experienced channels and visionaries',
        ]
      }
    }
  },
  {
    id: 4,
    name: 'Conditions',
    emoji: '🔑',
    continuityEmoji: '🛡️',
    type: 'Intercession Foundations',
    element: 'Earth',
    intent: 'Establish necessary conditions and safeguards for secure altered state practice',
    description: 'Intercession Foundations - Establish necessary conditions and safeguards for secure altered state practice',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '💪',
            name: 'Physical Stress',
            content: [
              { attribute: 'Definition', value: 'Frenzy and possession require physical intensity; body must be adequately prepared' },
              { attribute: 'Preparation', value: 'Fitness, nutrition, sleep, hydration—body must be strong enough for the work' },
              { attribute: 'Limits', value: 'Age, health conditions, medications all affect capacity for intensity' },
              { attribute: 'Safety', value: 'Know your body\'s limits; never push beyond what is sustainable' },
            ]
          },
          {
            emoji: '🔐',
            name: 'Ritual Containment',
            content: [
              { attribute: 'Definition', value: 'Strong psychic boundaries that hold the space and protect from intrusion' },
              { attribute: 'Creation', value: 'Protective circle, calling of guardians, explicit intention, clear beginning and ending' },
              { attribute: 'Maintenance', value: 'The container must be actively maintained throughout the work' },
              { attribute: 'Closure', value: 'Clean closure of the space when work is complete' },
            ]
          },
          {
            emoji: '👥',
            name: 'Community Presence',
            content: [
              { attribute: 'Definition', value: 'Trusted people present who can witness, support, and intervene if needed' },
              { attribute: 'Training', value: 'Witnesses must understand the practice and know their role' },
              { attribute: 'Attention', value: 'Witnesses must remain alert and present; distraction creates danger' },
              { attribute: 'Support', value: 'Community provides emotional grounding and integration support afterward' },
            ]
          },
          {
            emoji: '⚠️',
            name: 'Informed Consent',
            content: [
              { attribute: 'Definition', value: 'Everyone involved must fully understand what will happen and agree to participate' },
              { attribute: 'Clarity', value: 'No surprises; full disclosure of risks and what will be asked of participants' },
              { attribute: 'Right to Refuse', value: 'Anyone can say no at any time without judgment or pressure' },
              { attribute: 'Ongoing', value: 'Consent is not one-time; it is renewed each session' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Physical Stress: Prepare the Body',
            content: 'Frenzy and possession are physically demanding. Your body must be fit enough for the work. This does not mean athletic; it means basic fitness and health. You need adequate nutrition, hydration, and sleep. Certain medications or health conditions can make intense practice unsafe. Know your body. If you have trauma, dissociative tendencies, or serious illness, work with experienced guides and medical professionals to determine if and how you can safely practice. The integrity of your physical vessel directly affects the quality of spiritual work. Respect your body\'s actual capacity rather than your spiritual ambitions.'
          },
          {
            heading: 'Ritual Containment: Boundaries That Hold',
            content: 'Altered consciousness is vulnerable. Your psychic boundaries are naturally open when you enter trance. A strong container—psychic boundary—protects from unwanted intrusion. The container must be created with intention, maintained throughout the work, and consciously closed when complete. Sloppy containment is one of the primary sources of spiritual harm in ecstatic practice. Parasitic entities, confused spirits, and negative forces can enter an unprotected space. A clear container tells the spirit world: these boundaries are protected, only helpful forces welcomed. Strong traditions invest significant time and skill in creating and maintaining containers.'
          },
          {
            heading: 'Community Presence: You Cannot Do This Alone',
            content: 'Altered state work absolutely requires community. You cannot safely practice alone. Witnesses serve multiple purposes: they hold the container, they watch for signs of distress, they intervene if needed, they document what happened, they help integration afterward. Witnesses must be trained and present. A distracted witness is worse than no witness. The quality of your community directly determines the safety of your practice. Invest in building and training a strong community of practitioners and witnesses. This is not optional; it is foundational.'
          },
          {
            heading: 'Informed Consent: Everyone Agrees',
            content: 'Everyone involved must fully understand what will happen and explicitly agree to participate. No surprises. No pressure. Full disclosure of risks. Right to refuse at any time. Consent is not one-time agreement—it is renewed each session. The practitioner consents to open. The witnesses consent to be present. The community consents to the work happening in their midst. Even spirits are asked permission. Consent culture is not abstract philosophy in ecstatic practice—it is the foundation of safety and integrity.'
          },
          {
            heading: 'Integration: The Aftercare',
            content: 'After altered state work, people need support. They are tired. They are emotionally vulnerable. They need grounding, food, rest, and community presence. Some people experience euphoria afterward; some experience crash. Some have difficulty remembering. Some have difficulty returning to normal consciousness. Community should anticipate these responses and be prepared with grounding practices, food, comfort. The hours and days after intense practice are as important as the practice itself. Do not abandon people after the ritual ends. Stay present for integration.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Honestly assess your physical health and fitness for this work',
          'Build strong community before attempting deep altered state practice',
          'Train your witnesses thoroughly; do not skip this step',
          'Practice setting and maintaining strong containers with simple exercises first',
          'Start with brief, less intense altered states before advancing',
          'Always have clear signals for stopping and clear protocols for emergencies',
          'Never work with anyone who is not informed and consenting',
          'Debrief after each session with your witness community',
          'Seek ongoing training and mentorship for multiple years',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Witness Training Is Not Optional',
            text: 'You cannot adequately prepare witnesses in conversation. They need hours of training, practice scenarios, and clear protocols. Invest this time.'
          },
          {
            title: 'Containers Must Be Actively Maintained',
            text: 'Do not cast a circle and forget about it. Throughout the practice, at least one person should consciously maintain awareness of the boundary.'
          },
          {
            title: 'Physical Preparation Is Spiritual Preparation',
            text: 'Eating well, sleeping well, moving your body—these are not distractions from spiritual work. They are the foundation. Do not neglect them.'
          },
          {
            title: 'Know When to Say No',
            text: 'If you are unwell, if you lack adequate witnesses, if you feel unsafe, do not practice. Skipping one session is better than forcing unsafe practice.'
          },
          {
            title: 'Community Holding Is Sacred Work',
            text: 'Witnessing others\' altered states is not boring duty. It is sacred work. Appreciate your witnesses and support their development.'
          },
          {
            title: 'Consent Is Continuous',
            text: 'Even if you consented last week, you must re-consent this week. People\'s capacity changes. Honor that and adjust accordingly.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Teachers who specialize in containment and boundary work',
          'Training programs for witnesses and facilitators',
          'Books on consent culture and informed consent in spiritual practice',
          'Emergency protocols and safety procedures documentation',
          'Health assessments for determining readiness for intense practice',
          'Community-building resources for ecstatic practice traditions',
          'Integration support guides and protocols',
          'Resources on recognizing signs of spiritual harm and trauma',
          'Workshops on witness training and facilitation',
          'Mentorship programs combining multiple practitioners for mutual support',
          'Professional networks of experienced facilitators you can consult with',
        ]
      }
    }
  },
  {
    id: 5,
    name: 'Geometry',
    emoji: '📐',
    continuityEmoji: '⚡',
    type: 'Intercession Practices',
    element: 'Fire',
    intent: 'Understand how space, geometry, and physical environment support altered state practice',
    description: 'Intercession Practices - Understand how space, geometry, and physical environment support altered state practice',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '👁️',
            name: 'Absent Geometry',
            content: [
              { attribute: 'Definition', value: 'In embodied work, physical geometry becomes less important than bodily geography' },
              { attribute: 'Focus', value: 'Energy moves through the body rather than through predetermined space' },
              { attribute: 'Implication', value: 'Can work anywhere if the body is properly prepared and contained' },
              { attribute: 'Difference', value: 'Unlike place-work where location matters, embodied work emphasizes interior landscape' },
            ]
          },
          {
            emoji: '💫',
            name: 'Dynamic Space',
            content: [
              { attribute: 'Definition', value: 'The space of embodied work shifts as the practitioner moves' },
              { attribute: 'Character', value: 'Space is alive, responsive, changing; energy flows with the body\'s movement' },
              { attribute: 'Consciousness', value: 'The space expands during intensity and contracts during calm' },
              { attribute: 'Work', value: 'Follow the space rather than imposing structure on it' },
            ]
          },
          {
            emoji: '🌐',
            name: 'Crowded Centers',
            content: [
              { attribute: 'Definition', value: 'Strong presences gather where embodied work happens; space becomes dense with beings' },
              { attribute: 'Experience', value: 'Feel the presence of spirits, guides, witnesses, ancestors all in one space' },
              { attribute: 'Intensity', value: 'Crowded centers become portals; the veil thins; access becomes easier' },
              { attribute: 'Risk', value: 'Thickness can overwhelm; protective boundaries become more essential in crowded space' },
            ]
          },
          {
            emoji: '🔐',
            name: 'Protected Environment',
            content: [
              { attribute: 'Definition', value: 'Physical space that supports safety and reduces distractions' },
              { attribute: 'Characteristics', value: 'Private, sound-dampened, temperature-controlled, free from interruption' },
              { attribute: 'Preparation', value: 'Clean space, remove clutter, arrange for comfort and safety' },
              { attribute: 'Respect', value: 'Space that is used repeatedly develops its own power and presence' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Absent Geometry: Interior Space',
            content: 'In place-based work, the geometry of the land matters enormously. In embodied work, the geometry that matters is the interior landscape of the body. External space becomes secondary. This is fundamentally different from place-work. You can enter deep altered consciousness in a modern apartment, in a hotel room, in any space—if your internal geometry is awakened and active. The maps that matter are the maps of your own nervous system, your energy centers, your internal channels. This is liberation in one sense—you do not need access to special places. But it also means you must develop sophisticated inner technology.'
          },
          {
            heading: 'Dynamic Space: Space as Alive and Responsive',
            content: 'In embodied work, space itself becomes dynamic and alive. As you move, the space around you shifts. As energy intensifies, space expands. As you calm, space contracts. The space is not static—it is responding to your consciousness and presence. This is very different from place-work where you read a landscape that has its own character. In embodied work, you create the space through your presence and movement. The quality of space depends on the quality of your consciousness, the clarity of your body, the integrity of your presence.'
          },
          {
            heading: 'Crowded Centers: Density of Presence',
            content: 'When embodied work happens repeatedly in the same location, the space becomes crowded with presences. Spirits gather where energy is strong. Ancestors come. Guides are present. Witnesses leave traces of their presence. Over time, the space becomes dense with being. This is power—the veil thins, access becomes easier. But it is also intensity that requires skilled navigation. Too much presence can overwhelm. Clear boundaries become even more important in crowded space. Some traditions specifically use this: they build power gradually in a location, making it a thin place where work becomes easier.'
          },
          {
            heading: 'Protected Environment: Physical Supports',
            content: 'While external space matters less in embodied work than in place-work, the physical environment still affects comfort, safety, and depth of experience. A space that is private, warm, comfortable, and secure supports deeper opening than a space where you are worried about interruption. A clean space supports focus better than a cluttered space. Repeated use of the same space allows it to accumulate power. Invest in creating a regular practice space that is clean, safe, private, and dedicated to this work. The space will begin to hold and amplify your work.'
          },
          {
            heading: 'Interior Landscape: The Real Geometry',
            content: 'The true geometry in embodied work is the map of your own consciousness—your energy centers, your trauma patterns, your capacity for pleasure and pain, your channels of communication with spirit. Learning this interior landscape is the lifetime work. You become intimate with your own nervous system, your capacity for opening and closing, your genuine limits and your capacity for transformation. This internal geography is as important as any place-based geography. In fact, it is more important because it is where all the real work happens.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Scan your body regularly, learning to feel energy centers and channels',
          'Develop awareness of how different movements affect your consciousness',
          'Practice in the same location repeatedly; let it develop its own presence',
          'Keep the practice space physically clean and energetically clear',
          'Notice how space responds to your presence and emotional state',
          'Experiment with how physical arrangement affects the quality of work',
          'Over time, develop relationship with the presences that gather in your practice space',
          'Learn to sense the difference between crowded, thin space and dense, heavy space',
          'Trust your interior landscape more than external geography',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Physical Space Matters, But Less',
            text: 'External geometry matters less in embodied work than in place-work. But do not use this as excuse to neglect space. Clean, safe, dedicated space still supports your work.'
          },
          {
            title: 'Repeated Practice Builds Power',
            text: 'If you use the same space regularly for embodied work, it will gradually accumulate power. The veil thins. Work becomes easier. Honor this growth.'
          },
          {
            title: 'Your Body Is the Landscape',
            text: 'The most important geography is the map of your own consciousness. Invest in learning your interior landscape as deeply as place-workers learn their place.'
          },
          {
            title: 'Movement Creates Space',
            text: 'Do not think of yourself as moving through static space. Understand that you are creating space through your movement and presence.'
          },
          {
            title: 'Crowded Space Needs Clear Boundaries',
            text: 'As your practice space accumulates presence, maintain strong boundaries even more carefully. Density of beings requires skilled management.'
          },
          {
            title: 'Trust Felt Sense Over Rules',
            text: 'Rules about geometry matter less in embodied work. Trust your body\'s felt sense of what space needs. It will guide you.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Books on energy anatomy and the chakra system',
          'Anatomical guides to understanding your nervous system',
          'Practices for awakening interior energy channels',
          'Feng Shui and space arrangement for spiritual work',
          'Resources on energy accumulation in practice spaces',
          'Teachers trained in somatic and embodied spirituality',
          'Books on how repeated practice creates power in places',
          'Resources on protecting yourself in crowded or thin spaces',
          'Guides to understanding your own somatic patterns',
          'Communities dedicated to understanding interior landscapes',
          'Mentorship in developing sophisticated inner technology',
        ]
      }
    }
  },
  {
    id: 6,
    name: 'Consciousness',
    emoji: '🧠',
    continuityEmoji: '💫',
    type: 'Intercession Practices',
    element: 'Spirit',
    intent: 'Understand and develop facility with the major consciousness states in embodied work',
    description: 'Intercession Practices - Understand and develop facility with the major consciousness states in embodied work',
    tabs: {
      referenceGuide: {
        title: 'Reference Guide',
        categories: [
          {
            emoji: '🌀',
            name: 'Trance',
            content: [
              { attribute: 'Definition', value: 'Deep state of consciousness where thinking mind quiets completely' },
              { attribute: 'Experience', value: 'Time disappears; you may be aware or unaware; movement slows or stops' },
              { attribute: 'Access', value: 'Achieved through meditation, rhythmic monotony, focused intention' },
              { attribute: 'Work', value: 'Spirits move more easily through trance than through active consciousness' },
            ]
          },
          {
            emoji: '⚡',
            name: 'Frenzy',
            content: [
              { attribute: 'Definition', value: 'Peak activation of consciousness through intensity and movement' },
              { attribute: 'Experience', value: 'Thinking mind overwhelmed; body moves with own power; ecstatic activation' },
              { attribute: 'Access', value: 'Achieved through rhythmic intensity: drumming, dancing, chanting' },
              { attribute: 'Work', value: 'Frenzy opens channels and accelerates energy; good for fast work' },
            ]
          },
          {
            emoji: '🔄',
            name: 'Aftershock',
            content: [
              { attribute: 'Definition', value: 'The consciousness state immediately after deep altered work' },
              { attribute: 'Experience', value: 'Body may shake, cry, or move involuntarily; consciousness is processing' },
              { attribute: 'Duration', value: 'Can last minutes, hours, or days depending on intensity of work' },
              { attribute: 'Support', value: 'Gentle movement, grounding, presence of witnesses helps integration' },
            ]
          },
          {
            emoji: '🌱',
            name: 'Integration',
            content: [
              { attribute: 'Definition', value: 'Bringing experience and insight from altered states into ordinary consciousness' },
              { attribute: 'Process', value: 'Gradual over time; not completed in one session' },
              { attribute: 'Work', value: 'Requires journaling, community discussion, embodied practice, patience' },
              { attribute: 'Completion', value: 'Full integration may take weeks or months; integration is never truly complete' },
            ]
          }
        ]
      },
      knowledgeBase: {
        title: 'Knowledge Base',
        sections: [
          {
            heading: 'Trance: The Deep Quiet',
            content: 'Trance is deep meditation-like consciousness where the thinking mind quiets completely. Time may disappear entirely. You may be aware of little besides the quality of consciousness itself. Trance is accessed through repetitive focus, meditation, rhythmic monotony. Deep trance is a state where spirits move easily, prophecy flows, and contact with other worlds becomes natural. Some traditions work primarily through trance. Trance consciousness is calm, open, receptive. It is the opposite of frenzy. Many traditions combine both: frenzy to open, then trance to listen. The ability to access deep trance is foundational to embodied work.'
          },
          {
            heading: 'Frenzy: The Electric Peak',
            content: 'Frenzy is the opposite of trance. It is peak activation through rhythmic intensity. The thinking mind becomes overwhelmed by physical intensity—movement, sound, sensation. In frenzy, you are fully present in the body but consciousness expands beyond normal boundaries. Frenzy is shamanic consciousness, ecstatic consciousness, possession consciousness. It is the consciousness of ecstatic dance, of trance drumming, of sexual ecstasy. Frenzy opens channels rapidly. Spirits move through frenzy more actively. Many traditions use frenzy as the primary mode. Some practitioners move between frenzy and trance throughout a session—intensity alternating with deep quiet.'
          },
          {
            heading: 'Aftershock: The Body Processes',
            content: 'After intense frenzy or deep possession, the body may shake, cry, move involuntarily. This is aftershock—the nervous system processing the intensity and returning to baseline. Aftershock is not dangerous; it is necessary. Do not suppress it. Instead, support it gently through movement, grounding, presence. Aftershock can last minutes or days depending on how deep the work went. This is part of integration. The body is integrating spiritual experience at the nervous system level. Witness and support this process without trying to rush it.'
          },
          {
            heading: 'Integration: The Slow Work',
            content: 'Full integration of altered state experiences takes much longer than the experiences themselves. A one-hour trance may take weeks to fully integrate. The insights you receive during altered states are often not understood immediately. They reveal themselves gradually over days and weeks. Integration requires journaling, reflection, embodied practice, and community discussion. It requires patience. The depth of integration depends on the depth of the practice. Do not rush. Honor the slow work of bringing spiritual experience into embodied life.'
          },
          {
            heading: 'Cycling: The Natural Pattern',
            content: 'Mature embodied practice cycles naturally: opening in trance, intensifying in frenzy, processing in aftershock, integrating slowly over weeks. New people often get stuck in frenzy, unable to quiet down into trance. With practice, you learn to move between states fluidly. Some sessions are primarily trance, others primarily frenzy. Over time, you develop capacity in both. The cycling of states becomes as natural as the cycle of breath—inhale and exhale, intensity and quiet, opening and closing. This cycling is the rhythm of embodied work.'
          }
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Practice meditation regularly to build capacity for trance states',
          'Explore frenzy through ecstatic dance or rhythmic movement',
          'After each practice, journal detailed impressions immediately',
          'Share experiences with community; listen to their observations',
          'Notice which state feels more natural to you initially',
          'Gradually develop facility in whichever state is initially foreign to you',
          'Experiment with cycling: quiet trance, building frenzy, returning to trance',
          'Expect aftershock; welcome it as part of the process',
          'Remember that integration is the real work; do not neglect it',
        ]
      },
      tips: {
        title: 'Tips for Practicing',
        items: [
          {
            title: 'Trance and Frenzy Are Equally Valuable',
            text: 'Do not privilege one over the other. Both are necessary. Some work requires deep quiet; some requires intensity. Learn both.'
          },
          {
            title: 'Aftershock Is Not Weakness',
            text: 'Shaking, crying, or involuntary movement after intense work shows your body is processing deeply. This is health, not pathology. Support it.'
          },
          {
            title: 'Write Before You Think',
            text: 'Journal immediately after altered work, before your thinking mind interprets. Raw experience is more valuable than analyzed experience.'
          },
          {
            title: 'Integration Takes Weeks, Not Hours',
            text: 'Do not expect to understand what happened in your trance session by evening. Full understanding comes slowly. Be patient.'
          },
          {
            title: 'Community Reflection Deepens Understanding',
            text: 'What you cannot see in your experience, community can see. Their reflection helps you understand what happened and what it means.'
          },
          {
            title: 'Embodied Practices Support Integration',
            text: 'Journaling is important, but dancing, painting, singing, and moving your body also integrate experience. Use multiple methods.'
          }
        ]
      },
      resources: {
        title: 'Resources',
        items: [
          'Books on meditation and trance induction techniques',
          'Teachers trained in moving between trance and frenzy',
          'Journaling guides and reflection practices',
          'Community circles focused on integration and discussion',
          'Resources on nervous system recovery after intense practice',
          'Art supplies and creative expression guides for integration',
          'Movement and dance practices for embodied integration',
          'Books on understanding your own consciousness patterns',
          'Teachers experienced in working with aftershock and processing',
          'Long-term mentorship for developing facility with multiple states',
          'Comparative study of consciousness states across traditions',
        ]
      }
    }
  }
];

export function IntercesssionScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const { isUnlocked, isTest } = useLocks();
  const [showLockModal, setShowLockModal] = useState(false);
  const [isPracticeLocked, setIsPracticeLocked] = useState(true);

  const checkSubscriptionAndNavigate = async (practice: any) => {
    const hasSubscription = await PurchaseService.isSubscriptionActive();
    const practiceUnlocked = isUnlocked('practiceIntercession') || isTest('practiceIntercession');
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
          <Text style={[styles.title, { color: textColor }]}>🐋 Intercession</Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>Embodied spirituality, altered consciousness, and safe ecstatic practice</Text>
        </View>

        <View style={[styles.content, { paddingBottom: bannerTop ? 60 : 0 }]}>
          <View style={styles.practiceStack}>
            {INTERCESSION_PRACTICES.map((practice) => (
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
        practiceType="Intercession"
        lockKey="practiceIntercession"
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
