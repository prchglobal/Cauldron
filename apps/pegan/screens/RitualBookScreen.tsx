import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { useBanner } from '../BannerContext';

type PracticeTab = 'Tethering' | 'Intercession' | 'Continuity' | 'Regeneration';

interface Recipe {
  emoji: string;
  name: string;
  type: string;
  element: string;
  intent: string;
  ingredients: string[];
  instructions: string[];
  benefits: string[];
}

const PRACTICE_TABS: { name: PracticeTab; emoji: string }[] = [
  { name: 'Tethering', emoji: '🦋' },
  { name: 'Intercession', emoji: '🐋' },
  { name: 'Continuity', emoji: '🐉' },
  { name: 'Regeneration', emoji: '🐍' },
];

// Consolidated recipes from all practice screens
const RECIPES_BY_PRACTICE: Record<PracticeTab, Recipe[]> = {
  Tethering: [
    {
      emoji: '🙏',
      name: 'Land Acknowledgment Ritual',
      type: 'Opening Practice',
      element: 'Earth',
      intent: 'Establish ethical relationship by naming and honoring place and its histories',
      ingredients: ['Knowledge of place\'s geological and human history', 'Standing on the land', 'Open heart and voice', 'Willingness to be changed by the knowledge'],
      instructions: ['Stand on the land where you work or live', 'Call to mind the geological formation of this place', 'Name the Indigenous peoples whose stewardship preceded colonization', 'Acknowledge the layers of human presence—former residents, the displaced, the forgotten', 'Speak aloud: "I acknowledge the spirits of this place, the ancestors held here, the powers that shape this land"', 'Listen for the land\'s response—changes in weather, animal sounds, felt sense', 'Make a small offering (water, cornmeal, flower)', 'Commit to learning this place\'s deeper history', 'Repeat at seasonal transitions or when moving to new land'],
      benefits: ['Shifts consciousness from extraction to reciprocity', 'Creates foundation for all subsequent place work', 'Honors those before you', 'Attunes sensitivity to place-specific energies']
    },
    {
      emoji: '🌏',
      name: 'Immanence Sensing Practice',
      type: 'Perception Practice',
      element: 'Earth & Spirit',
      intent: 'Develop ability to perceive divine presence in material reality',
      ingredients: ['A natural object (stone, leaf, soil)', 'Quiet space for meditation', 'Patience and openness', 'Journal for recording insights'],
      instructions: ['Select a natural object from your place: a stone, leaf, piece of soil, or twig', 'Hold it gently in your hand', 'Begin seeing the sacred in this small object', 'Trace its origins—where did the stone form? How old is it? What processes created it?', 'Feel the intelligence and presence within this object', 'Ask: What divinity manifests through this particular form?', 'Sit with this perception for 10-15 minutes', 'Journal what you perceive about the sacred embedded in this material', 'Return the object to where you found it with gratitude'],
      benefits: ['Shifts perception of what is sacred', 'Develops embodied spirituality', 'Creates intimacy with place through small objects', 'Deepens reverence for the physical world']
    },
    {
      emoji: '🌀',
      name: 'Place Spirit Mapping',
      type: 'Discernment Practice',
      element: 'Spirit',
      intent: 'Identify and map the specific spirits and intelligences present in your place',
      ingredients: ['Journal or large paper for mapping', 'Pen or pencil', 'Time spent on the land', 'Willingness to trust intuition', 'Optional: field guides to local plants and animals'],
      instructions: ['Create a map of your place (as detailed or simple as feels right)', 'Mark locations: rivers, mountains, forests, meadows, old trees, historic structures', 'For each location, spend quiet time sensing the presence there', 'Journal the character or feeling of each place: Is it peaceful? Intense? Playful? Serious?', 'Note which animals you frequently encounter in each area', 'Record any historical events associated with locations', 'Over weeks and months, add to your map as understanding deepens', 'Note patterns: Where do you feel most welcomed? Where do you feel caution?', 'Create a guide for yourself about relating with each distinct place-spirit', 'Share your map with others who know the place to compare perspectives'],
      benefits: ['Creates personalized guide for engaging with your place', 'Deepens intimacy with landscape', 'Reveals hidden presences and overlooked locations', 'Provides reference for future place-work']
    },
    {
      emoji: '🎭',
      name: 'Spirit Communication Exercise',
      type: 'Relational Practice',
      element: 'Spirit & Air',
      intent: 'Practice receiving communication from place spirits and learning their preferences',
      ingredients: ['A specific location and its spirit', 'Journal for recording impressions', 'Openness to subtle communication', 'Offerings (water, cornmeal, flowers)'],
      instructions: ['Select a specific place-spirit to work with (a river, tree, meadow, etc.)', 'Visit that location during a time you can sit for 20-30 minutes', 'Sit in receptive posture, facing the direction of the spirit', 'Introduce yourself: "I am [name]. I want to know you and build relationship"', 'Ask simple questions: "What do you need? How can I help? What should I know about you?"', 'Listen with all your senses—what images, words, feelings, or sensations arise?', 'Pay attention to: temperature, wind, animal activity, sounds, intuitive knowing', 'Record all impressions, even if they seem small or unclear', 'Make an offering while expressing gratitude for the communication', 'Return weekly to deepen the relationship and receive more teaching'],
      benefits: ['Develops direct relationship with place spirits', 'Attunes you to subtle forms of communication', 'Reveals what each spirit needs from humans', 'Creates basis for reciprocal exchange']
    },
    {
      emoji: '💧',
      name: 'Water Offering Ritual',
      type: 'Reciprocal Practice',
      element: 'Water',
      intent: 'Establish and maintain reciprocal relationship through simple, renewable offering',
      ingredients: ['Water from a source (spring, rain, well)', 'A vessel (cup, bowl, or directly from hands)', 'Gratitude and respect', 'Optional: intention for the offering'],
      instructions: ['Gather water (collected rain is traditional, but spring or stream water works)', 'Approach the place-spirit you wish to honor', 'Pause and offer gratitude for what this place provides', 'Pour the water directly on the earth or into the water feature', 'As you pour, speak: "I offer this water as thanks for your presence and gifts"', 'Sit briefly in acknowledgment of the exchange', 'Perform this daily or weekly—consistency matters more than grand gestures', 'Notice how the place responds to regular offering—shifts in presence, animal activity, your own state', 'Adjust your offering based on what the place accepts and appreciates'],
      benefits: ['Creates foundation of reciprocity', 'Water offering is renewable—no depletion', 'Daily practice attunes you to subtle shifts in place', 'Simple enough to maintain long-term']
    },
    {
      emoji: '🎧',
      name: 'Deep Listening Sit',
      type: 'Receptive Practice',
      element: 'Air & Spirit',
      intent: 'Develop capacity to hear what place spirits want to communicate',
      ingredients: ['A quiet location on your land', '30 minutes of uninterrupted time', 'Silenced phone and no distractions', 'Journal for recording', 'Willingness to sit with silence'],
      instructions: ['Find a comfortable spot where you can sit uninterrupted', 'Set intention: "I come to listen. What do you want me to know?"', 'Sit in silence, allowing your thoughts to settle', 'Notice what arises: images, words, feelings, memories, sensations', 'Do NOT edit or judge what comes—write down everything', 'Pay attention to: shifts in weather, animal sounds, physical sensations in your body', 'When your mind quiets completely, stay in that silence for as long as possible', 'End by thanking the place for the communication', 'Later, review your journal—patterns may emerge', 'Return weekly for deepening dialogue'],
      benefits: ['Quiets mental chatter that blocks communication', 'Develops trust in subtle impressions', 'Reveals what place spirits need from you', 'Creates space for genuine dialogue']
    },
    {
      emoji: '🔍',
      name: 'Land Knowledge Gathering',
      type: 'Research Practice',
      element: 'Earth',
      intent: 'Systematically learn your place\'s geological, ecological, and human history',
      ingredients: ['Library, museum, or online historical resources', 'USGS geological surveys and maps', 'Books on local ecology and native species', 'A journal or document for organizing findings', 'Time for research and field study'],
      instructions: ['Gather geological information: how was this land formed? What bedrock? What soil types?', 'Research Indigenous peoples who lived here: their names, practices, current status', 'Investigate human history: who settled here? What happened? What industries dominated?', 'Study current ecosystem: what plants, animals, water, weather patterns characterize this place?', 'Create a timeline from geological formation to today', 'Compile this into a personal "place bible"—your reference document', 'Regularly update and deepen as new information emerges', 'Share knowledge with others and learn from their discoveries', 'Use this knowledge to inform all place-based work'],
      benefits: ['Comprehensive understanding prevents ignorant choices', 'Knowledge reveals ethical responsibilities', 'Historical awareness honors complex layers', 'Ecological understanding shows how to serve the place']
    },
    {
      emoji: '🤝',
      name: 'Permission Seeking Ritual',
      type: 'Relational Practice',
      element: 'Spirit',
      intent: 'Respectfully request and receive permission from place spirits to work there',
      ingredients: ['Standing on the land in question', 'Genuine openness to being refused', 'Offering materials', 'Journal for recording response', 'Willingness to listen deeply'],
      instructions: ['If not already on land you own, secure legal access or permission from landowner', 'Stand on the land and acknowledge all its presences', 'Speak clearly: "I ask permission to be present here, to learn you, and to work on your behalf"', 'Explain your intentions: what kind of work you envision', 'Listen carefully for the response—this may come over days, not immediately', 'Watch for signs: Do you feel welcomed or cautioned? Do animals respond? What is your body telling you?', 'If permission is granted, commit to the conditions that emerge', 'If permission is withheld or unclear, honor that—find another place', 'Once permission is established, refresh this agreement seasonally'],
      benefits: ['Ensures you are working with, not against, the place', 'Prevents forcing yourself where not welcomed', 'Establishes respectful foundation for all future work', 'Deepens listening capacity']
    },
    {
      emoji: '🗺️',
      name: 'Sacred Geometry Mapping',
      type: 'Spatial Practice',
      element: 'Earth',
      intent: 'Map the geometry of your place—its thresholds, center, boundaries, and energetic patterns',
      ingredients: ['Large paper or digital mapping tool', 'Colored pencils or markers', 'Time spent exploring the land', 'Willingness to trace patterns', 'Compass (optional, for determining directions)'],
      instructions: ['Draw or map your place\'s outline—its boundaries', 'Mark water features: springs, streams, rivers, wetlands—they follow natural geometry', 'Identify the energetic center: where does energy feel most concentrated?', 'Mark thresholds: places where you feel transition between states', 'Note old trees, rocks, or structures—these often mark geometric points', 'Observe animal paths and trails—they follow lines of power', 'Draw the watershed pattern—how does water move through this place?', 'Mark cardinal directions and any astronomical alignments', 'Use different colors for different energetic qualities', 'Over time, geometric patterns will reveal themselves'],
      benefits: ['Makes invisible energetic patterns visible', 'Reveals where power concentrates', 'Guides placement of ritual work', 'Connects you to land\'s deep structure']
    },
    {
      emoji: '🚶',
      name: 'Threshold Walking Meditation',
      type: 'Movement Practice',
      element: 'Spirit',
      intent: 'Develop sensitivity to thresholds and practice conscious crossing',
      ingredients: ['A threshold on your land (doorway, stream crossing, forest edge)', 'Undisturbed time for the practice', 'Awareness and intention', 'Optional: small offering or blessing'],
      instructions: ['Identify a threshold you will work with regularly', 'Approach the threshold slowly, feeling the energetic shift', 'Pause before crossing and set clear intention: "I cross from [one state] into [another]"', 'Feel the threshold\'s energy—is it calm, charged, guarded?', 'Make an offering to the threshold guardian: water, cornmeal, or whispered gratitude', 'Cross slowly and deliberately, feeling the energetic transition', 'Pause after crossing and notice the changed quality of the place on the other side', 'Over weeks and months, this threshold becomes familiar—you develop relationship with it', 'Eventually, this threshold becomes a powerful point for ritual work'],
      benefits: ['Develops attunement to liminal spaces', 'Creates relationship with threshold guardians', 'Makes transitions in your life more conscious', 'Opens thresholds for protection and blessing work']
    },
    {
      emoji: '🧘',
      name: 'Grounding and Opening Meditation',
      type: 'Preparation Practice',
      element: 'Earth & Spirit',
      intent: 'Prepare consciousness for place-work through grounding and opening attention',
      ingredients: ['A quiet place on your land', '15-20 minutes of uninterrupted time', 'Comfortable posture (standing or sitting)', 'Willingness to be present'],
      instructions: ['Stand or sit comfortably on the land', 'Feel your feet or base firmly on the earth', 'Visualize roots growing from your feet deep into the earth—anchor yourself', 'Feel earth\'s stability supporting you', 'Breathe deeply, letting tension release with each exhale', 'Release thoughts about past and future—let them drift away', 'Open your senses: what do you hear? See? Feel? Smell?', 'Gradually expand your awareness to include the entire place', 'Feel yourself becoming transparent—no longer separate from the place', 'Rest in this open, grounded state for several minutes', 'From this state, begin your place-work or listening'],
      benefits: ['Shifts consciousness from thinking to sensing', 'Anchors you safely in the place', 'Opens channels for receiving communication', 'Prepares you for sensitive work']
    },
    {
      emoji: '💨',
      name: 'Receptive Breath Practice',
      type: 'Attunement Practice',
      element: 'Air & Spirit',
      intent: 'Use breath to attune consciousness to place\'s frequency',
      ingredients: ['The place you\'re working with', '10-15 minutes', 'Comfortable breathing rhythm', 'Willingness to synchronize with place'],
      instructions: ['Stand in your place and notice the natural wind and air movement', 'Begin breathing slowly and deeply', 'Notice the place\'s "breath"—how air moves, wind patterns, temperature shifts', 'Gradually synchronize your breathing with the place\'s breath', 'If place seems to have fast energy, breathe faster; if slow, breathe slower', 'Feel your breath as exchange with the place—you inhale what it exhales, you exhale what it receives', 'Continue until your breathing feels completely synchronized', 'From this synchronized state, sense what the place wants to communicate', 'End by offering gratitude for the synchronization'],
      benefits: ['Attuning consciousness to place frequency', 'Creates physiological resonance with place', 'Often spontaneous insights arise from synchronized state', 'Deepens sensitivity to subtle shifts']
    }
  ],
  Intercession: [
    { emoji: '🔥', name: 'Safe Container Opening', type: 'Preparation Practice', element: 'Fire & Spirit', intent: 'Create energetic container that allows safe entry into altered states', ingredients: ['Physical space where you will not be interrupted', 'Grounding materials (salt, stones, herbs)', 'Optional: witness or facilitator', 'Clear intention and consent', 'Understanding of your own nervous system'], instructions: ['Choose a time and place where you will be undisturbed for hours', 'Set clear boundaries: phones off, people aware you are unavailable', 'Create physical circle or boundary using salt, stones, or markers', 'Call protective presences—guides, ancestors, strong spirits you trust', 'State your intention clearly: "I open to [specific experience] in safety"', 'Identify your grounding technique before beginning—something physical to anchor you', 'If working with others, establish clear signals for "I need help" and "stop"', 'Light a candle or fire—element of containment and witness', 'Only then begin your practice'], benefits: ['Creates psychological safety for deep work', 'Signals to your nervous system that this is intentional sacred time', 'Gives spirits clear parameters for engagement', 'Prevents intrusive experiences and unwanted presences', 'Establishes your authority over your own consciousness'] },
    { emoji: '🫀', name: 'Embodiment Grounding Practice', type: 'Somatic Practice', element: 'Earth', intent: 'Return consciousness to body and ground dispersed energy after altered states', ingredients: ['Your physical body', 'Grounding substance (salt, earth, salt water)', 'Food—preferably sweet and hearty', 'Optional: witness or facilitator'], instructions: ['Begin in fetal position or lying flat on earth', 'Focus completely on physical sensations: temperature, texture, weight', 'Feel your bones, organs, blood—the solidity of meat and blood', 'If you have grounding substance, rub it on skin—salt, earth, water', 'Speak your name repeatedly until it becomes real in your mouth', 'Slowly unfold your body, feeling each joint and muscle working', 'Eat something substantial—real food with salt and sweetness', 'Move slowly: stretching, dancing, shaking until you feel anchored', 'Spend as long as needed returning to normal consciousness'], benefits: ['Prevents spiritual dissociation and floating', 'Integrates experiences into embodied memory', 'Restores sense of boundary between self and world', 'Establishes healthy separation between ecstatic and ordinary consciousness', 'Protects nervous system from dysregulation'] },
    { emoji: '🎭', name: 'Spirit Identification Practice', type: 'Discernment Practice', element: 'Air & Spirit', intent: 'Learn to recognize which forces are moving through your body', ingredients: ['Altered state (trance, frenzy, or open channeling)', 'Trusted witness if possible', 'Journal for recording', 'Grounding tools for returning to normal consciousness'], instructions: ['Enter altered state with clear intention to identify any presences', 'When awareness shifts or something moves through you, pause and notice', 'Silently ask: "Who are you? What is your name? What do you want?"', 'Notice the response: does it come as voice, feeling, knowing, image?', 'Ask: "What do you teach? What is your power? How do you help my community?"', 'Pay attention to consistency: Does this presence have a coherent purpose?', 'Ask: "Will you work visibly, with integrity, and for community benefit?"', 'Notice any evasion, grandiosity, or demand for secrecy—these signal inauthenticity', 'Return to normal consciousness and record all details'], benefits: ['Develops discernment between genuine spirits and psychological projection', 'Allows you to work with consistent, trustworthy presences', 'Prevents harm from deceptive or parasitic forces', 'Establishes clear relationship with spirits who work through you', 'Builds confidence in your mediation work'] },
    { emoji: '🗣️', name: 'Voice Recording and Review', type: 'Reflection Practice', element: 'Air', intent: 'Learn your spirit\'s unique voice by reviewing records of channeling', ingredients: ['Recording device (audio or video)', 'Safe space for candid recording', 'Trusted community member to witness and take notes', 'Journal for reflection'], instructions: ['With permission, record yourself channeling or in spirit trance', 'Afterward, listen to the recording with fresh ears', 'Notice: What is different from your normal speech? Accent? Vocabulary? Pace?', 'Over multiple sessions, listen for patterns in how this spirit communicates', 'Note what topics the spirit emphasizes; what does it consistently teach?', 'Ask your witness: What did they observe about the presence and its voice?', 'Keep recordings to establish baseline of authentic spiritual communication', 'Use recordings to distinguish this spirit from other presences', 'Over time, you will recognize the spirit\'s presence instantly'], benefits: ['Creates objective record of spiritual work', 'Helps you recognize genuine vs. false presences through consistent patterns', 'Builds confidence in your channel abilities', 'Provides teaching material for community and students', 'Documents spiritual development over time'] },
    { emoji: '🥁', name: 'Frenzy Induction Practice', type: 'Ecstatic Practice', element: 'Fire', intent: 'Use rhythmic movement and intensity to enter ecstatic altered consciousness', ingredients: ['Open space for unrestricted movement', 'Drum, music, or rhythm source', 'Comfortable clothing that allows movement', 'Community to hold space and witness', 'Grounding practice for returning'], instructions: ['Warm up gently; shake out the body, move freely', 'Begin with slow rhythm, gradually increasing intensity', 'Let your body move in whatever way feels right; do not choreograph', 'Allow sounds—cries, calls, breath—to emerge naturally', 'Continue until you feel consciousness shift; time becomes irrelevant', 'When peak intensity is reached, let rhythm gradually slow', 'Slow the movements; bring awareness back to present moment', 'When fully returned, ground immediately: salt, water, food', 'Journal experience while details are fresh'], benefits: ['Access to embodied wisdom and animal knowing', 'Release of tension held in nervous system', 'Direct experience of ecstatic consciousness', 'Permission to express what ordinary consciousness suppresses', 'Connection to shamanic power and presence'] },
    { emoji: '🎭', name: 'Possession Preparation and Recovery', type: 'Channeling Practice', element: 'Air & Spirit', intent: 'Prepare safely for possession and integrate afterward', ingredients: ['Strong container and protective boundary', 'Trusted witness who knows you well', 'Grounding herbs or salt', 'Comfortable clothing', 'Time for full integration afterward'], instructions: ['Before starting: review signals for stopping if needed', 'Create clear container: sacred space, protective circle', 'Explicitly invite the spirit you wish to work with', 'Invite it to use your voice and body for community benefit', 'Allow consciousness to step back; witness what arises', 'When spirit is complete, witness calls it back; you return gradually', 'Do NOT rush return to normal consciousness', 'Immediately ground: salt on skin, earth, food, water', 'Spend rest of day in quiet; integration continues for days'], benefits: ['Direct transmission of spirit teaching to community', 'Healing and blessing delivered through embodied presence', 'Liberation of human consciousness from thought-control', 'Establishment of strong working relationship with spirit', 'Community receives direct contact with helping forces'] },
    { emoji: '🛡️', name: 'Strong Container Casting', type: 'Protection Practice', element: 'Earth & Spirit', intent: 'Create psychically protected space that holds altered state work safely', ingredients: ['Salt, stones, or physical markers for circle boundary', 'Candles representing elements and directions', 'Strong intention and clear ceremony', 'Community to help maintain the boundary'], instructions: ['Choose location with space for uninterrupted work', 'Physically demarcate space: salt line, rope, marked circle', 'At each cardinal direction, place candle or marker; call on guardian of that direction', 'Specify exactly what will happen: "We open for [specific practice]. No uninvited presences may enter. We welcome [specific spirits if appropriate]."', 'Make the boundary real in the minds of all present; agreement of the group strengthens it', 'Throughout work, maintain awareness of the boundary; do not let attention drift', 'When work is complete, explicitly close the space: "This circle is open but not broken. We thank the guardians."', 'Break the physical circle: erase the salt line, snuff the candles', 'All participants should consciously shift out of sacred time back to ordinary time'], benefits: ['Prevents intrusive or parasitic spirits from entering the space', 'Creates psychological safety for deep work', 'Clarifies boundaries for all presences involved', 'Allows altered consciousness without vulnerability to attack', 'Protects both participants and the helping spirits'] },
    { emoji: '👥', name: 'Witness Preparation and Training', type: 'Community Practice', element: 'Earth', intent: 'Train community members to safely hold space and support practitioners', ingredients: ['Experienced facilitator or teacher', 'Time for witness training (hours to days)', 'Clear protocols and procedures', 'Practice with mock scenarios'], instructions: ['Explain the specific practice that will occur; what to expect', 'Teach signs of distress vs. normal altered states; when to intervene', 'Establish clear signals for "I need help" and "stop immediately"', 'Role-play emergency scenarios: what to do if someone panics, if unwanted spirit manifests, if body goes into shock', 'Practice grounding techniques they may need to use on practitioner', 'Assign specific roles: container-holder, physical safety, emotional support', 'Establish post-practice protocol: where people recover, what support is available', 'Emphasize that witnesses are not passive observers but active participants in the work', 'Have witnesses practice staying calm, focused, and present even in unusual circumstances'], benefits: ['Trained witnesses prevent trauma and injury', 'Practitioner can fully open because they trust the container', 'Witnesses become part of the healing and spiritual work', 'Community capacity grows through witness participation', 'Clear protocols prevent chaos in unusual situations'] },
    { emoji: '🌊', name: 'Body Geometry Awakening', type: 'Embodiment Practice', element: 'Fire', intent: 'Awaken awareness of energy channels, centers, and movement through the body', ingredients: ['Your body', 'Private space', 'Awareness and attention', 'Optional: background sound or silence'], instructions: ['Stand comfortably with feet grounded', 'Scan from the crown of your head down through your body, noticing where you feel energy concentration', 'Notice major centers: head, heart, belly, genitals, feet', 'Sense the channels connecting these centers: front, back, sides', 'Begin moving slowly, feeling how energy shifts as you move', 'Raise your arms—feel energy move up the sides', 'Bend forward—feel energy move down the front', 'Twist—feel energy spiraling around the spine', 'Over weeks of practice, the internal geometry becomes as real as physical structure'], benefits: ['Develops awareness of subtle energy and its movement', 'Teaches you to move with energy rather than muscle alone', 'Creates sensitivity to how different movements affect consciousness', 'Builds foundation for more advanced embodied practices', 'Establishes relationship with your own interior landscape'] },
    { emoji: '🔥', name: 'Space Preparation for Group Work', type: 'Environmental Practice', element: 'Earth', intent: 'Prepare physical space optimally for group altered state work', ingredients: ['Physical space that can be cleared and cleansed', 'Cleaning supplies and cleansing herbs', 'Comfort items: cushions, blankets, grounding materials', 'Protective and energizing items: candles, stones, etc.'], instructions: ['Clean the physical space thoroughly—dust, sweep, arrange furniture appropriately', 'Open windows; allow fresh air to move through', 'Cleanse energetically: burn cleansing herbs, ring bells, open windows to wind', 'Arrange space for the specific practice: circle area for frenzy, chair for possession channel, clear sight lines', 'Place grounding materials at cardinal points and center: salt, stones, herbs', 'Ensure everyone has a place to sit or lie down if needed', 'Check temperature, lighting, sound isolation', 'If repeated practice, allow space to develop its own power; cleanse but honor its growing presence'], benefits: ['Physical preparation supports psychological readiness', 'Clear space holds energy more effectively than cluttered space', 'Regular use of the same space strengthens its power and presence', 'Practical arrangement prevents accidents and supports comfort', 'Cleansing removes lingering energy from previous activities'] },
    { emoji: '🌀', name: 'Trance Induction Practice', type: 'Meditative Practice', element: 'Water & Spirit', intent: 'Develop ability to enter and move through deep trance consciousness', ingredients: ['Quiet space', 'Comfortable seating or lying position', 'Optional: soft music or white noise', 'Grounding materials nearby for return'], instructions: ['Begin in comfortable position; set intention: "I open to trance consciousness"', 'Focus on your breath: slow inhalations, longer exhalations', 'Release tension with each exhale; sink deeper with each inhale', 'When thoughts arise, notice them without engagement; let them drift away', 'Gradually awareness becomes spacious, diffuse, boundless', 'You may lose awareness of time or body; this is normal', 'When ready to return, do so slowly: first feel your breath, then your body', 'Slowly open eyes; remain still for several minutes before moving', 'Ground immediately: salt, water, food'], benefits: ['Develops facility with deep trance consciousness', 'Quiets mental chatter enough for spiritual work', 'Creates access for spirit communication', 'Builds capacity for sustained altered consciousness', 'Provides counterbalance to frenzy work'] },
    { emoji: '🧠', name: 'Integration Journaling Practice', type: 'Reflection Practice', element: 'Earth', intent: 'Help integrate altered state experiences into embodied understanding', ingredients: ['Journal', 'Pen', 'Quiet time', 'Willingness to write without editing', 'Community to discuss with afterward'], instructions: ['As soon as possible after altered state work, write without stopping', 'Write everything: sensations, images, emotions, insights, confusion, questions', 'Do not worry about making sense; capture the raw experience', 'Write for as long as impressions arise; let it flow', 'Over following weeks, re-read what you wrote; notice patterns', 'Share with trusted community member; ask what they noticed', 'Over time, deeper meaning emerges from what initially seemed chaotic', 'Return to journal entries months later; meaning continues to shift', 'Notice how embodied practices affect integration: dance, art, movement'], benefits: ['Preserves experience before it fades from memory', 'Helps make sense of confusing or overwhelming experiences', 'Creates bridge between altered and ordinary consciousness', 'Provides material for community discussion and collective learning', 'Over time, reveals patterns in your spiritual work and growth'] }
  ],
  Continuity: [
    { emoji: '🍚', name: 'Simple Ancestor Feeding Ritual', type: 'Honoring Practice', element: 'Spirit & Air', intent: 'Feed ancestors with food offerings, honoring their persistent presence', ingredients: ['Food or drink ancestors enjoyed in life (wine, bread, rice, favorite dishes)', 'Small dish or cup', 'Quiet space (altar or table)', 'A moment of genuine memory and gratitude'], instructions: ['Set aside food or drink—something ancestors loved or appreciated', 'Place offering on altar, shrine, or special table dedicated to ancestors', 'Call ancestors by name if you know them: "I honor you, [name]"', 'Speak why you are grateful for their life and legacy', 'Leave offering for at least one hour (overnight is traditional)', 'After time passes, pour libations outdoors or dispose respectfully', 'Eat remaining food yourself if appropriate—share the meal with ancestors', 'Repeat regularly—weekly, monthly, or on ancestor\'s birthday'], benefits: ['Strengthens bond between living and dead', 'Demonstrates respect and gratitude', 'Activates ancestral blessing in your own life', 'Creates tangible spiritual practice', 'Honors family lineage and kinship'] },
    { emoji: '📜', name: 'Lineage Documentation Practice', type: 'Knowledge Gathering', element: 'Air & Spirit', intent: 'Record family lineage to deepen understanding of ancestors and activate kinship bonds', ingredients: ['Genealogical records, family trees, or ancestry websites', 'Journal or documentation method', 'Stories from elders or family members', 'Open curiosity about your lineage'], instructions: ['Begin gathering family records—birth certificates, death records, marriage records', 'Use ancestry websites or library resources to extend knowledge back generations', 'Interview living family elders about ancestors—their names, professions, personalities', 'Document stories of hardship, achievement, survival, migration', 'Create visual family tree showing lineage back as far as you can trace', 'Note patterns: names that repeat, professions, talents, challenges across generations', 'Record details about specific ancestors who call to you', 'Update regularly as you learn more; ancestry work is ongoing'], benefits: ['Creates foundation for meaningful ancestor work', 'Reveals family patterns and gifts', 'Deepens sense of kinship and belonging', 'Identifies ancestors to specifically honor', 'Facilitates healing of intergenerational patterns'] },
    { emoji: '🌬️', name: 'Recent Dead Petition Ritual', type: 'Communication Practice', element: 'Air & Spirit', intent: 'Speak directly to recently deceased ancestors, seeking guidance or blessing', ingredients: ['Item belonging to or representing the ancestor (photo, letter, object they owned)', 'Candle (white, black, or their favorite color)', 'Incense or smoke (to carry message)', 'Clear petition or question for the ancestor'], instructions: ['Light candle at ancestor\'s altar or special place', 'Hold object representing the ancestor, feeling their presence', 'Speak directly to them by name: "I call to you, [name], my [relationship]"', 'Express your petition clearly: What guidance do you seek? What blessing do you need?', 'Light incense, watching smoke rise with your words', 'Sit in silence for 10-15 minutes, listening for response (images, feelings, knowing)', 'Close with gratitude: "I thank you for your presence and guidance"', 'Leave offering of food or drink for 24 hours', 'Watch for signs of ancestor\'s response in days following (dreams, synchronicities, unexpected help)'], benefits: ['Creates direct communication with recently deceased', 'Receives practical guidance from ancestors\' continued knowledge', 'Strengthens bond with specific ancestor', 'Often produces remarkable and quick results', 'Confirms reality of ancestor\'s continued presence'] },
    { emoji: '🗿', name: 'Deep Lineage Activation Ritual', type: 'Foundational Practice', element: 'Earth & Spirit', intent: 'Connect with the foundational power of deep ancestors and activate lineage force', ingredients: ['Family genealogy extending back as far as known', 'Stone or root object (representing deep time)', 'Earth or soil from significant place (birthplace, burial place, or homeland)', 'Grounding meditation space'], instructions: ['Sit holding stone or root, feeling its age and permanence', 'Close eyes and trace your lineage backward through time', 'Name ancestors as far back as you know them', 'Continue backward, naming ancestors you do not know individually but whose lineage flows through you', 'Feel the weight and power of all those who came before', 'Place hands on soil, feeling connection to ancestral lands', 'Speak: "I honor the deep ancestors who laid the foundation of my lineage"', 'Remain seated 15-20 minutes, feeling ancestral force as solid ground beneath you', 'Ground yourself by returning to present awareness and eating food'], benefits: ['Accesses deep ancestral power and protection', 'Strengthens sense of lineage continuity', 'Provides grounding in ancestral identity', 'Awakens archetypal ancestral support', 'Connects to lineage blessing across millennia'] },
    { emoji: '🥃', name: 'Seasonal Abundance Offering', type: 'Feeding Practice', element: 'Earth & Spirit', intent: 'Celebrate seasonal harvests with ancestors, sharing abundance and gratitude', ingredients: ['Seasonal food (harvest vegetables, fruits, grains, or prepared meal)', 'Wine, mead, cider, or beverage ancestors enjoyed', 'Flowers or herbs of the season', 'Candlelight (white or seasonal color)'], instructions: ['Prepare seasonal food from the current harvest season', 'Arrange on altar with fresh flowers and candles', 'Pour libation of wine or beverage as you name ancestors', 'Speak: "I honor you with the abundance of this season, as you once knew abundance"', 'Leave offering overnight or for several hours', 'Share meal with family, speaking about ancestors as you eat', 'Return any remaining food to earth outdoors or dispose respectfully', 'Repeat each seasonal transition (solstice, equinox, or harvest)'], benefits: ['Strengthens reciprocal exchange with ancestors', 'Aligns ancestral practice with seasonal cycles', 'Creates family bonding around ancestor honor', 'Ensures ancestors receive consistent nourishment', 'Celebrates continuity across seasons and years'] },
    { emoji: '📖', name: 'Ancestral Biography Storytelling', type: 'Address Practice', element: 'Air & Spirit', intent: 'Address ancestors by telling their stories, keeping their memory alive', ingredients: ['Stories of ancestors\' lives collected from family history', 'Photo or representation of ancestor', 'Quiet space and uninterrupted time', 'Optional: record the story or write it down'], instructions: ['Gather stories of an ancestor\'s life from family records or relatives', 'Light candle at ancestor\'s altar', 'Speak to the ancestor directly: "I remember you, [name]"', 'Tell their story aloud in your own words: where they lived, what they did, their struggles and achievements', 'Share what that ancestor\'s life meant to the family', 'Express gratitude for their resilience, work, or gifts', 'Close with: "I carry your memory forward in my own life"', 'Record the story or write it in journal for future generations'], benefits: ['Keeps ancestors\' memory vivid and alive', 'Honors their individual personhood and achievements', 'Creates emotional connection through storytelling', 'Preserves family history for future generations', 'Demonstrates respect through sustained attention'] },
    { emoji: '🧹', name: 'Ancestor Altar Preparation Ritual', type: 'Space Preparation', element: 'Earth & Water', intent: 'Create and consecrate a clean, dedicated space for ancestor work', ingredients: ['Small table, shelf, or dedicated space', 'Water, salt, or floor wash for cleansing', 'Cloth or altar cloth (preferably white, black, or natural linen)', 'Objects for altar—candle, photos, stones, objects representing ancestors', 'Intention to honor ancestors and create sacred space'], instructions: ['Choose location away from high traffic, if possible—a shelf, corner, or table', 'Clean physical space thoroughly—sweep, dust, wash surface with saltwater or soap', 'Cover with cloth to designate the space as sacred', 'Arrange objects on altar: candle at center, photos or names of ancestors, stones or meaningful objects', 'Light candle and speak intention: "This space is dedicated to honoring my ancestors"', 'Walk around altar slowly, feeling the space become marked and intentional', 'Leave offerings of food and water as first dedication', 'Maintain altar—keep it clean, refresh offerings regularly, tend it with care', 'Return regularly to this space, so ancestors learn where to find you'], benefits: ['Creates focal point for ancestor practice', 'Gives ancestors a place to gather and receive offerings', 'Marks space as sacred and intentional', 'Anchors ancestor relationship in physical reality', 'Provides visible reminder to practice consistently'] },
    { emoji: '🧘', name: 'Grounding and Emotional Settling Practice', type: 'Preparation Practice', element: 'Earth & Spirit', intent: 'Prepare yourself emotionally and physically for clear ancestor engagement', ingredients: ['Quiet space', 'Grounding food (nuts, bread, root vegetables)', 'Time for meditation or sitting', 'Connection to earth (bare feet on ground, soil in hands)'], instructions: ['Before ancestor work, check in with your emotional state', 'If overwhelmed, activated, or in crisis—postpone ancestor work for clearer time', 'Sit on earth or with feet bare on ground', 'Feel your connection to earth beneath your feet; imagine roots extending deep', 'Breathe slowly: in for four counts, hold for four, out for four', 'Speak: "I am grounded. I am present. I am clear."', 'Eat grounding food to anchor yourself in physical reality', 'Remain sitting for 10-15 minutes until you feel centered', 'Now engage with ancestors from place of groundedness rather than reactivity'], benefits: ['Prevents emotional overwhelm during ancestor work', 'Allows clear communication and listening', 'Protects you from getting destabilized by ancestral contact', 'Ensures you remain in control of the work', 'Creates safety for both you and ancestors'] },
    { emoji: '🍽️', name: 'Hearth Sharing Ritual', type: 'Gathering Practice', element: 'Fire & Spirit', intent: 'Include ancestors in family meals and gatherings, recognizing them as present participants', ingredients: ['Family meal or gathering', 'Extra place setting or plate for ancestors', 'Food prepared with awareness of ancestors', 'Moments of silence or spoken acknowledgment'], instructions: ['Before family meal, set an extra place or plate for ancestors', 'As family gathers, speak ancestors\' names: "We gather with our ancestors"', 'Place portion of food on ancestor\'s plate or leave space at table', 'Eat knowing ancestors participate with you in this meal', 'Share stories of ancestors or speak about their legacy as family eats', 'Thank ancestors for their presence and the sustenance they provided through generations', 'After meal, dispose of ancestor\'s portion respectfully (return to earth, compost, or burial)', 'Practice especially during holidays, birthdays, or seasonal celebrations'], benefits: ['Includes ancestors as active participants in family life', 'Creates tangible sense of their presence and continuity', 'Transforms everyday meals into ancestor practice', 'Strengthens family bonds across generations', 'Honors the work ancestors did to sustain lineage'] },
    { emoji: '🪦', name: 'Cemetery Tending and Blessing', type: 'Grave-Edge Practice', element: 'Earth & Water', intent: 'Visit and care for ancestor graves, maintaining physical connection to burial sites', ingredients: ['Knowledge of ancestor\'s burial location (or general cemetery)', 'Flowers, water, or maintenance tools', 'Optional: food, drink, or incense offering', 'Time for reflection and remembrance'], instructions: ['Visit ancestor\'s grave or cemetery where ancestors are buried', 'Locate the grave (ask cemetery for help if needed)', 'Clean grave area: remove weeds, debris, old offerings', 'Pour water over stone or site as blessing', 'Place fresh flowers or offerings', 'Stand and speak to ancestor: acknowledge them, thank them, update them on family', 'Pour libation if appropriate to your tradition', 'Sit quietly for 10-15 minutes, feeling the presence of ancestors in this place', 'Visit seasonally or for birthdays, holidays, and death anniversaries'], benefits: ['Maintains physical connection to ancestors\' resting places', 'Shows continued care and honor after death', 'Provides direct liminal space for communication', 'Honors the body and the place where ancestors rest', 'Recognizes grave site as sacred boundary between worlds'] },
    { emoji: '🪞', name: 'Mirror of Memory Meditation', type: 'Remembrance Practice', element: 'Air & Spirit', intent: 'Deepen remembrance through guided visualization of ancestor faces and forms', ingredients: ['Quiet space', 'Photo of ancestor (optional but helpful)', 'Time for 20-30 minute meditation', 'Willingness to visualize and remember'], instructions: ['Sit comfortably with ancestor\'s photo before you or held in mind', 'Close eyes and visualize ancestor\'s face as you remember it or as shown in photo', 'See their features clearly: eyes, mouth, expression, unique characteristics', 'Imagine looking into their eyes; feel their presence across the years', 'Remember a moment with this ancestor or a story you heard about them', 'Feel the affection or gratitude you have for their life', 'Sit with their image in mind for 10-15 minutes', 'Open eyes slowly, carrying their presence with you', 'Write or journal about the experience and what arose'], benefits: ['Makes ancestor presence vivid and particular', 'Strengthens emotional connection through visualization', 'Activates memory and intuitive knowing', 'Creates intimate familiarity with ancestor\'s presence', 'Deepens remembrance practice'] },
    { emoji: '🌲', name: 'Forest Stillness Sitting', type: 'Stillness Practice', element: 'Earth & Spirit', intent: 'Cultivate quiet mind receptivity in nature where ancestors\' presence is accessible', ingredients: ['Natural setting (forest, park, garden, wild place)', 'Time for 30-60 minute sitting', 'Comfortable clothing for weather', 'No devices or distractions'], instructions: ['Go to natural place—forest, park, or other wild space', 'Find comfortable sitting place near tree or in protected spot', 'Sit with back supported, feet on ground', 'Release any agenda or expectation; you are simply sitting', 'Notice sounds, smells, textures of nature around you', 'Let your mind grow quiet; do not force thought away, just allow it to settle', 'Feel the presence of life around you: earth, plants, animals, older presences', 'Remain sitting 30-60 minutes, allowing stillness to deepen', 'Notice if you sense ancestor presence, messages, or knowing', 'Return slowly to normal awareness, carrying stillness with you'], benefits: ['Develops capacity for true stillness and receptivity', 'Accesses ancestor presence in natural places where they lived', 'Quiets mind enough to hear subtle guidance', 'Grounds stillness in embodied experience rather than abstract meditation', 'Creates foundation for deeper ancestor communication'] }
  ],
  Regeneration: [
    { emoji: '🍂', name: 'Seasonal Transition Ritual', type: 'Honoring Practice', element: 'Spirit & Earth', intent: 'Mark and honor the turning of the wheel at seasonal thresholds', ingredients: ['Representation of the outgoing season (dried leaves, summer clothes, etc.)', 'Representation of the incoming season (seeds, winter items, etc.)', 'Fire source (candle or small fire)', 'Quiet outdoor or altar space', 'Words of release and welcome'], instructions: ['Gather items representing season that is ending', 'Hold them and speak gratitude: "I honor what [season] brought—the gifts and the teachings"', 'Safely burn or bury these items, releasing the season\'s energy', 'Pause in silence to feel the threshold—the moment between', 'Gather items representing incoming season', 'Speak welcome: "I invite [season]. I open myself to your gifts, your lessons, your gifts"', 'Plant seeds, dress in new colors, or display seasonal items', 'Sit with the turning; feel yourself turning with the wheel'], benefits: ['Aligns personal energy with natural seasonal cycles', 'Honors what has passed and creates space for what comes next', 'Strengthens connection to the wheel of the year', 'Creates intentional closure and opening', 'Integrates the threshold moment into consciousness'] },
    { emoji: '💀', name: 'Shadow Integration Meditation', type: 'Inner Work', element: 'Spirit & Water', intent: 'Meet and integrate shadow aspects for genuine transformation', ingredients: ['Safe, private space', 'Journal and pen', 'Willing heart to face difficult aspects', 'Support system (optional)'], instructions: ['Sit quietly and call to mind a quality you dislike in yourself (anger, selfishness, fear, shame)', 'Instead of rejecting it, ask: "When did I learn to fear this? What is this part protecting?"', 'Visualize this shadow aspect as a separate being; speak to it with compassion', 'Ask what it needs, what gift it carries, why it exists', 'Listen without judgment to the answer that emerges', 'Speak gratitude for its protection, even if misguided', 'Invite it to serve you differently: "Help me be stronger, not cruel. Help me be cautious, not paranoid"', 'Journal what you learned; commit to one way you will honor this shadow energy'], benefits: ['Reduces power of rejected aspects to control behavior', 'Transforms shame and self-rejection into integration', 'Releases energy locked in suppression and denial', 'Creates wholeness and authenticity', 'Deepens self-knowledge and compassion'] },
    { emoji: '🎪', name: 'Threshold Walking Visualization', type: 'Consciousness Practice', element: 'Spirit & Air', intent: 'Develop skill and safety navigating liminal spaces', ingredients: ['Quiet space', 'Comfortable seated or lying position', 'Ability to visualize or sense'], instructions: ['Settle yourself and imagine standing at a literal threshold—a doorway, gate, or bridge', 'One side represents your past: old self, old life, what is being released', 'Other side represents your future: new self, new possibilities, what is emerging', 'Notice colors, temperatures, textures, feelings of each side', 'Stand in the threshold itself—the space between. Feel the rawness of this in-between', 'Invite guides, ancestors, or allies to stand with you in the threshold', 'Feel yourself anchored in both the past and future, yet free in the liminal space', 'Take a step toward the future; feel yourself carried by both what you are leaving and what awaits', 'Return to waking and record what the threshold space feels like'], benefits: ['Reduces fear of transformation and change', 'Develops capacity to remain present in uncertainty', 'Creates conscious relationship with threshold states', 'Invites protective and guiding energies during transition', 'Integrates liminality as natural and safe place'] },
    { emoji: '🔥', name: 'Fire Cleansing Ritual', type: 'Releasing Practice', element: 'Fire', intent: 'Use fire to release, purify, and make space for new growth', ingredients: ['Fire source (fireplace, bonfire, candle, or fire-safe container)', 'Paper and pen', 'Items representing what must end (photos, letters, symbols)', 'Witnessing—self or community'], instructions: ['Identify what must end: a relationship, pattern, belief, role, fear', 'Write or speak these aloud; name them clearly', 'Create a symbolic representation (write on paper, gather meaningful objects)', 'State clearly: "This [thing] has served its purpose. I release it to fire. I am grateful and I let it go"', 'Safely burn the paper or symbolic representation', 'Watch as smoke carries it away; feel the release in your body', 'State what now becomes possible: "With this ending comes space for ___"', 'Allow yourself to feel grief, relief, excitement—all are valid'], benefits: ['Creates decisive completion of cycles', 'Uses elemental power to transform and transmute', 'Provides visible, visceral release experience', 'Clears energetic and psychological space', 'Honors both the ending and what it makes possible'] },
    { emoji: '📅', name: 'Personal Cycle Mapping', type: 'Tracking Practice', element: 'Earth & Air', intent: 'Map your personal cycles to understand your unique rhythm and timing', ingredients: ['Journal or tracking app', 'At least 3-4 months of data (ideally a year)', 'Willingness to observe without judgment', 'Colored pens or markers (optional)'], instructions: ['Establish a baseline by tracking for 4 weeks: energy levels (1-10), mood, sleep quality, creative output, libido, social availability', 'Mark significant events, stressors, hormonal changes, or astrological events', 'After 4+ months, look for patterns: Do you have high-energy weeks followed by rest weeks? Monthly patterns?', 'Note which external cycles correlate with internal shifts: lunar phase, season, work schedule, relationship dynamics', 'Create a visual map of your cycles on paper or digitally', 'Plan major projects, social commitments, and rest during appropriate cycle phases', 'Notice predictions: "In two weeks the new moon arrives; I\'ll plan that deep rest now"', 'Adjust your plans based on your cycles rather than fighting them'], benefits: ['Honors your unique rhythm instead of forcing external schedules', 'Increases effectiveness by working during peak energy times', 'Reduces burnout by planning rest during natural decline phases', 'Develops self-knowledge and body literacy', 'Aligns personal work with natural cycles'] },
    { emoji: '🎪', name: 'Threshold Identification and Preparation', type: 'Preparation Practice', element: 'Spirit & Air', intent: 'Consciously identify upcoming thresholds and prepare to navigate them safely', ingredients: ['Calendar or planning tool', 'Journal for reflection', 'Knowledge of personal, seasonal, and life thresholds approaching'], instructions: ['List major thresholds you see approaching: seasonal changes, life events, work transitions, relationship shifts', 'For each threshold, identify: What am I leaving? What am I moving toward? What fears arise? What support do I need?', 'Plan a pre-threshold ritual: closure work for what is ending (letter writing, symbolic burning, farewell gathering)', 'Plan a threshold ritual: something to mark the actual moment of passage (meditation at dawn, crossing a physical threshold)', 'Plan a post-threshold ritual: integration and anchoring work for what is new (journaling, celebration, grounding)', 'Identify allies: people, ancestors, spirits, guides to call upon during the threshold', 'Prepare practically: relationships to complete, tasks to finish, space to prepare', 'Approach threshold with consciousness and intention rather than drift'], benefits: ['Reduces disorientation during major life changes', 'Creates safety and support systems proactively', 'Transforms thresholds from crisis to conscious passage', 'Develops skill in navigating change', 'Honors the psychological and spiritual dimensions of transition'] },
    { emoji: '🌙', name: 'Lunar-Aligned Action Planning', type: 'Planning Practice', element: 'Air & Water', intent: 'Time your actions and projects to lunar phases for greater effectiveness', ingredients: ['Lunar calendar (readily available online)', 'List of goals and projects', 'Journal or planning tool'], instructions: ['Identify 2-3 projects or goals you want to pursue in coming months', 'For NEW projects or incoming goals: begin during the new moon or waxing moon (power is building)', 'For COMPLETION projects or outgoing goals: work during waning or full moon (power is moving outward)', 'For RELEASING patterns or completing cycles: work during waning moon or new moon (power is declining/renewing)', 'Schedule major life decisions for new or full moon (peak clarity)', 'Avoid major new initiatives at waning moon (energy declining)', 'Schedule rest and retreat time during new moon (introspective)', 'Review progress at full moon; release at waning moon'], benefits: ['Aligns personal effort with natural tidal flows', 'Increases effectiveness of intention and action', 'Prevents pushing hard against the tide', 'Creates natural rhythm of effort and rest', 'Deepens attunement to subtle energetic shifts'] },
    { emoji: '🔥', name: 'Cord Cutting Ritual', type: 'Releasing Practice', element: 'Fire & Air', intent: 'Sever energetic attachment to someone or something that is meant to be released', ingredients: ['Red or gold thread or cord', 'Sharp knife or scissors', 'Fire source (candle is sufficient)', 'Name or image of what you are releasing from'], instructions: ['Sit quietly and call to mind the person, pattern, or situation you are releasing from', 'Visualize a cord of energy running from your heart/center to them/it', 'Hold one end of the physical cord in each hand', 'Speak: "We are grateful for what we have shared. Our time together has come to its completion."', 'Acknowledge specific gifts: "I carry your [teaching/love/challenge] into my future"', 'Speak release: "I release you from my hope that you become different. I release myself from obligation to you."', 'Hold cord over flame; cut it cleanly with knife or scissors while stating: "This cord is severed. You are free. I am free."', 'Let both pieces fall into fire or bury them', 'Feel the energetic separation in your body; may take time to fully register'], benefits: ['Frees you from unhealthy attachment or obligation', 'Provides clear completion to relationships or patterns', 'Allows both parties to move forward without psychic entanglement', 'Reduces resentment and unresolved energy', 'Creates space for new relationships and patterns'] },
    { emoji: '🌱', name: 'New Beginning Blessing', type: 'Invocation', element: 'Spirit & Water', intent: 'Consecrate a new beginning and invite support from seen and unseen forces', ingredients: ['Water (salt water, rain water, or river water)', 'Representation of what is beginning (seed, stone, image, journal)', 'Incense or sage (optional)', 'Quiet space'], instructions: ['Gather the item(s) representing what is beginning', 'Anoint yourself with water: "I am renewed. I am ready. I welcome what is coming."', 'Anoint the symbolic item: "May [this new thing] grow strong and true"', 'Speak your intention clearly: "I am beginning [specific thing]. I welcome [desired qualities]. I move forward with [required inner qualities]"', 'Invite support: "I ask for the blessing and protection of [ancestors/guides/spirits/sacred forces]"', 'Listen for what wants to be acknowledged or offered', 'End with: "It is begun. So it is."', 'Take one concrete action toward the new beginning'], benefits: ['Marks psychological and energetic beginning', 'Invokes support from spiritual allies', 'Clarifies intention and readiness', 'Creates witnessing for the beginning', 'Increases commitment through ritual action'] },
    { emoji: '🌾', name: 'Gratitude Harvest Practice', type: 'Honoring Practice', element: 'Earth & Spirit', intent: 'Honor completed cycles and gather the wisdom and gifts they brought', ingredients: ['Journal', 'Quiet time for reflection', 'Something to symbolize gathering (basket, cloth, or collection)'], instructions: ['Reflect on a completed cycle: a relationship, job, project, chapter of life, or season', 'Identify specific gifts it brought: skills learned, people met, growth achieved, challenges overcome', 'Identify specific losses: what you will miss, what is gone, what is released', 'Gather these gifts consciously: "From this cycle I gather ___. I carry these forward."', 'Acknowledge the cost: "This cycle also cost me ___. That cost was real and I honor it."', 'Express gratitude to forces that supported it: "Thank you, [people/circumstances/universe] that made this possible"', 'Plant one seed from this cycle into your future: "The one thing I will carry forward and build on is ___"', 'Release the rest: "The rest I now lay down. It has served its purpose."', 'Physically gather something (shell, stone, leaves) to represent this cycle\'s energy carried forward'], benefits: ['Honors what has passed without clinging', 'Extracts maximum learning from each cycle', 'Reduces regret and resentment', 'Integrates growth consciously', 'Creates sense of accumulation and progress through life'] },
    { emoji: '🪦', name: 'Ancestor Blessing for Transformation', type: 'Honoring Practice', element: 'Spirit & Earth', intent: 'Invoke ancestral support and power during major life transformations', ingredients: ['Ancestor altar or sacred space', 'Photos or names of specific ancestors', 'Offering (food, drink, incense)', 'Clear understanding of the transformation you are navigating'], instructions: ['Approach your ancestor altar or create a sacred space', 'Call specific ancestors by name: "Grandmother [name], Grandfather [name], Aunts and Uncles of my line"', 'Offer food or incense: "I remember you. I honor your strength and wisdom."', 'Speak your transformation: "I am walking through [specific threshold]. I need help. I need courage. I need your wisdom."', 'Ask specific questions: "How did you navigate [similar transformation]? What strength in me comes from you?"', 'Listen for the answer that arises (through body, image, thought, or feeling)', 'Speak gratitude: "I carry your strength. I walk your path forward into new territory."', 'Commit to honoring their legacy: "I will [specific action] to honor you and our line"', 'Seal with: "With your blessing, I step forward. Blessed be."'], benefits: ['Accesses accumulated ancestral wisdom and strength', 'Creates sense of not being alone in struggle', 'Honors lineage and kinship across time', 'Transforms personal struggle into part of family story', 'Channels ancestral power into present moment'] },
    { emoji: '🛡️', name: 'Grounding and Protection Ritual', type: 'Preparation', element: 'Earth & Spirit', intent: 'Root yourself safely in body and earth before beginning regeneration work', ingredients: ['Earth (soil, stone, or salt)', 'Water', 'Your body and attention'], instructions: ['Stand barefoot on earth if possible (or hold soil/stone)', 'Place hands on ground or hold earth substance', 'Feel your connection to earth beneath your feet; imagine roots extending deep', 'Speak: "I am grounded in earth. I am safe in my body. I am rooted and protected."', 'Notice sensations: temperature, texture, solidity of ground', 'Gently bounce or shake your body; feel weight and presence', 'Wash your hands with water while speaking: "I am clear and protected. Only what serves my highest good may approach."', 'Touch your feet, thighs, belly, chest, heart: "I am present in my body. I am safe."', 'Pause and feel the shift; you should feel more present and embodied'], benefits: ['Prevents dissociation during intense work', 'Creates safety in nervous system', 'Anchors spiritual experiences in body', 'Reduces anxiety and overwhelm', 'Protects against intrusion from unwanted energies'] },
    { emoji: '💬', name: 'Identify Your Support Circle', type: 'Preparation', element: 'Air & Water', intent: 'Create clear support system for transformation work', ingredients: ['Journal and pen', 'Phone or ability to contact people', 'Willingness to be vulnerable and ask for support'], instructions: ['List people in your life: family, friends, mentors, therapists, spiritual guides', 'For each person, note: Can I trust them with deep emotional work? Do they judge shadow/darkness? Will they hold space without trying to fix?', 'Identify minimum one person for each: emotional support, spiritual perspective, practical help, witness to transformation', 'Contact each person: "I am beginning deep transformation work. I may need support from you. Can I reach out?" (Many will say yes)', 'Be specific about what you need: "I need someone to listen without judgment to my fears" or "I need someone to bring me food during my retreat"', 'Establish communication: "I will check in on Tuesday evenings" or "I will text if I am struggling"', 'Honor those who cannot hold this work; do not burden unwilling people', 'Plan for moments you need immediate support: crisis line numbers, emergency contacts'], benefits: ['Prevents isolation during difficult work', 'Normalizes transformation as shared human experience', 'Creates accountability and witness', 'Builds community and mutual support', 'Ensures safety and presence with trained supporters'] },
    { emoji: '📋', name: 'Personal Readiness Assessment', type: 'Preparation', element: 'Air & Spirit', intent: 'Honestly assess whether conditions are right for beginning major regeneration work', ingredients: ['Journal and pen', 'Honest reflection', 'Willingness to delay if conditions are not right'], instructions: ['Answer honestly: Are my basic needs met? (Housing, food, safety, sleep)', 'Am I currently in crisis or acute trauma response? (If yes, wait and stabilize first)', 'Do I have at least one supportive person I can tell about this work?', 'Can I commit to regular practice time for at least 3 months?', 'Am I willing to feel difficult emotions without escaping into distraction?', 'Do I have any active addictions or compulsive behaviors? (Address these first)', 'Can I access professional mental health support if needed?', 'Do I genuinely want this transformation, or am I being pressured by others?', 'If answers to above are mostly yes, you are ready. If significant nos, address them first.', 'Create action plan for addressing any barriers: "I will find a therapist by [date]" or "I will save three months expenses to allow time"'], benefits: ['Prevents forcing transformation before ready', 'Increases likelihood of success', 'Reduces risk of retraumatization or crisis', 'Develops self-awareness about your capacity', 'Creates realistic expectations'] },
    { emoji: '🕯️', name: 'Protective Circle Creation', type: 'Space Preparation', element: 'Earth & Spirit', intent: 'Create ritual boundary that holds transformative work safely', ingredients: ['Candles or other markers (salt, stones, cord)', 'Your body and intention', 'Optional: incense, herbs, water'], instructions: ['Define your physical space (corner, room, outdoor area)', 'Mark boundaries: place candles, stones, or salt at edges', 'Stand at boundary and speak: "This circle is sacred space. Within this boundary, I am safe. Within this boundary, I can face truth."', 'Invite your guides and protectors: "I call upon [ancestors/guides/sacred forces] to witness and protect this space"', 'Invoke specific protections: "Nothing harmful may enter this space. Only that which serves my highest good may approach."', 'Walk the boundary consciously; feel the shift from ordinary space to sacred space', 'At end of practice, thank your protectors and consciously close: "This circle is open but sacred space remains."', 'For extended work, leave circle in place; re-open each day with intention'], benefits: ['Creates psychological and energetic safety', 'Signals nervous system that this is sacred time', 'Invokes spiritual support and protection', 'Allows deeper work because boundaries are held', 'Prevents bleed-through between ordinary and sacred consciousness'] },
    { emoji: '🚶', name: 'Threshold Walking Pilgrimage', type: 'Journey Practice', element: 'Air & Earth', intent: 'Use physical walking and threshold crossing to embody and facilitate transformation', ingredients: ['Knowledge of a threshold space near you (bridge, shoreline, forest edge, doorway)', 'Time to walk (1-2 hours)', 'Intention clearly held', 'Possibly a companion or witness'], instructions: ['Prepare intention: What are you transitioning from? What are you transitioning to? What do you need to become?', 'On foot, travel to threshold space', 'Stand at boundary; acknowledge what you are leaving: "From here, I release ___. I honor ___."', 'Feel the threshold moment; take a breath in the liminal space', 'Consciously cross (walk across bridge, wade into water, step into forest)', 'Once across, acknowledge what you are entering: "To here, I welcome ___. I commit to ___."', 'Walk forward into new space; feel how it is different', 'Sit if possible; journal or meditate; allow the transformation to settle', 'Walk back (not the same way if possible); return to daily life carrying the shift'], benefits: ['Makes internal transformation concrete and physical', 'Engages body and nervous system, not just mind', 'Uses natural thresholds to amplify personal transformation', 'Creates powerful memory and embodied understanding', 'Activates feet and legs in service of growth'] },
    { emoji: '🎯', name: 'Spiral Descent and Return Meditation', type: 'Visualization', element: 'Spirit & Water', intent: 'Descend into underworld (psyche, shadow, deep self) and return transformed', ingredients: ['Quiet space', 'Comfortable seated or lying position', 'Ability to visualize or sense', 'Journal for recording'], instructions: ['Settle yourself and imagine standing at the opening of a spiral', 'The spiral descends into darkness, into the underworld', 'With intention held clearly, begin walking/spiraling downward', 'Notice what you encounter as you descend: images, sensations, beings, emotions', 'Continue downward until you reach the center—the heart of the spiral, the deepest point', 'At the center, meet what waits: shadow aspect, ancestor, guide, inner wisdom, grief', 'Ask your question or receive what is offered', 'Then begin the spiral ascent, carrying what you received', 'Spiral upward, returning to ordinary consciousness at the opening', 'Return fully to your body; feel yourself present in the room', 'Journal what you experienced; honor whatever you encountered'], benefits: ['Safely accesses unconscious and shadow material', 'Provides structure for underworld descent (shamanic journey)', 'Returns you safely to waking consciousness', 'Integrates shadow wisdom and underworld knowledge', 'Develops skill in navigating between conscious and unconscious realms'] },
    { emoji: '🕯️', name: 'Midnight Ritual Work', type: 'Deep Work Practice', element: 'Spirit & Fire', intent: 'Work at midnight when veil is thinnest and underworld forces are most accessible', ingredients: ['Willingness to stay awake or wake at midnight', 'Quiet, undisturbed time', 'Candles', 'Journal or voice recording', 'Grounding and protection'], instructions: ['Set phone alarm for midnight or arrange to be awake', 'Light candles and create sacred space', 'Center yourself with grounding and protection ritual', 'Bring your deep question or intention', 'Work in silence or with gentle sound: singing, drumming, or nothing', 'Dialogue with your shadow, your guides, or your deep self', 'Write or speak freely what emerges', 'Do not censor or analyze; simply allow', 'As midnight hour closes, close your ritual with gratitude', 'Record what occurred and what you understood', 'The next day, integrate while in ordinary consciousness'], benefits: ['Midnight work accesses states of consciousness not available in daytime', 'Supports shadow work and underworld journeying', 'Creates space separated from ordinary busyness', 'Honors ancient practice of night vigil', 'Often produces surprising insights and transformations'] },
    { emoji: '🍂', name: 'Seasonal Threshold Retreat', type: 'Extended Practice', element: 'Spirit & All Elements', intent: 'Plan extended time at seasonal threshold to do deep transformation work', ingredients: ['Time: 1-3 days (or longer if possible)', 'Sacred space prepared', 'Supplies gathered', 'Support people informed', 'Clear intention for the retreat'], instructions: ['Choose season threshold: Samhain (Oct 31), Imbolc (Feb 1), Beltane (May 1), Lughnasadh (Aug 1)', 'Or use solstice/equinox times when power is at peak', 'Create schedule: meditation/ritual times, journaling, walks, rest, nourishment', 'Go into retreat with single clear intention', 'Silence or minimal speech helps deepen work', 'Alternate between structured ritual time and open spaciousness', 'Expect emotions, images, and insights to emerge', 'Allow rest and sleep; underworld work happens in dreams too', 'Plan integration day when retreat ends; do not jump immediately back into normal life', 'Weeks later, journal about what shifted and how you are integrating'], benefits: ['Extended time allows deeper work than single ritual', 'Alignment with seasonal power amplifies transformation', 'Creating retreat signals importance to your own nervous system', 'Time away from ordinary life allows perspective shift', 'Often produces major breakthroughs and resets'] },
    { emoji: '🕯️', name: 'Grief Meditation Practice', type: 'Consciousness Practice', element: 'Water & Spirit', intent: 'Develop capacity to be present with grief without resistance', ingredients: ['Quiet space', 'Comfortable seated position', 'Something that evokes grief (photo, memory, journal)', 'Tissues or space for tears'], instructions: ['Sit comfortably and call to mind something you grieve: loss, person, life chapter, version of self', 'Notice the first impulse: to distract, to feel "better," to move on', 'Instead of following that impulse, sit with it', 'Locate grief in your body: chest, throat, belly, heart', 'Breathe toward that location; invite the feeling rather than resist it', 'If tears come, let them; crying releases grief and moves it', 'If numbness comes, notice numbness without judgment', 'Stay for 10-20 minutes; you do not need to solve or heal anything', 'Simply be present with what is', 'End with gentleness: "I honor this grief. I am strong enough to feel this."'], benefits: ['Develops nervous system capacity to hold difficult emotions', 'Moves grief through rather than keeping it stuck', 'Increases self-compassion', 'Reduces fear of big emotions', 'Creates space for genuine renewal after grief is felt'] },
    { emoji: '🔍', name: 'Witness Meditation', type: 'Consciousness Practice', element: 'Air & Spirit', intent: 'Develop witness consciousness that observes without identification', ingredients: ['Quiet space', 'Comfortable seated position', '20-30 minutes'], instructions: ['Sit and focus on your breath: notice the natural rhythm', 'Do not try to change breath; simply watch it', 'Thoughts will come; do not push them away', 'Instead, notice: "A thought is arising. I observe this thought." (Do not say "I think," but "A thought is happening")', 'Emotions will come; notice the same way: "An emotion is present. I observe this emotion."', 'Physical sensations: same observation: "My body is experiencing sensations."', 'After many repetitions, you begin to notice the difference between the observer and what is observed', 'Rest in that witnessing space: the awareness that sees all these things flowing', 'You are the sky; thoughts, emotions, sensations are clouds passing through', 'Practice until witnessing feels stable; return to activity from that witness place'], benefits: ['Creates psychological space between you and your thoughts', 'Reduces identification with difficult emotions', 'Develops equanimity (even-mindedness)', 'Allows conscious choice rather than automatic reaction', 'Foundation for shadow integration and transformation'] },
    { emoji: '🌙', name: 'Underworld Descent Journey', type: 'Deep Work', element: 'Spirit & Water', intent: 'Develop comfort and skill navigating the underworld consciousness', ingredients: ['Safe, quiet space', 'Ability to visualize or sense', 'Journal for recording', 'Grounding before and after'], instructions: ['Set clear intention: What are you descending to meet or understand?', 'Ground yourself firmly in your body', 'Visualize or sense beginning of underworld entrance (cave, hole, dark forest)', 'With intention and allies (guides, ancestors, allies you invoke), begin descent', 'Notice what you encounter: beings, emotions, places, images', 'Do not force; allow journey to unfold', 'Meet what appears with curiosity rather than fear', 'Have conversation, ask questions, receive what is offered', 'When work is complete, begin ascent', 'Bring back what you have learned or received', 'Return fully to ordinary consciousness; ground yourself', 'Record and integrate what you experienced'], benefits: ['Develops underworld literacy and comfort', 'Accesses shadow wisdom and hidden knowledge', 'Meets inner guides and sources of power', 'Resolves fear of darkness and unknown', 'Integrates shadow aspects through conscious meeting'] },
    { emoji: '🌱', name: 'New Beginning Affirmation Practice', type: 'Consciousness Practice', element: 'Fire & Spirit', intent: 'Cultivate renewal consciousness aligned with new possibility', ingredients: ['Quiet time each day', 'Words that resonate with your being', 'Written affirmations (optional)', 'Willingness to believe words\' truth'], instructions: ['Create affirmations specific to your renewal work: "I am free to become something new." "I welcome the unknown." "I trust my capacity to change."', 'Each morning, speak affirmations aloud while looking in mirror', 'Feel the words in your body; do not just say them emptily', 'Throughout day, return to affirmations when doubt or old patterns arise', 'Notice resistance: where you do not believe the words', 'Instead of forcing belief, remain curious: "What would it feel like if this were true?"', 'Evening reflection: Did I live from this affirmation today? Where did I default to old patterns? No judgment.', 'Consistency matters; daily practice over months shifts consciousness', 'Update affirmations as your capacity and understanding grow'], benefits: ['Rewires neural pathways toward new identity', 'Counters internalized limitation and shame messages', 'Builds capacity to imagine and become something new', 'Creates daily practice of alignment with renewal', 'Supports sustainable transformation beyond single rituals'] }
  ]
};

export function RitualBookScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const { bannerTop } = useBanner();
  const [selectedTab, setSelectedTab] = useState<PracticeTab>('Tethering');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const containerBg = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const cardBg = isDarkMode ? '#2a2a2a' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#aaa' : '#666';
  const accentColor = isDarkMode ? '#22c55e' : '#1e40af';

  const currentRecipes = RECIPES_BY_PRACTICE[selectedTab];

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
      <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardBg, paddingTop: 16 }]}>
          <Text style={[styles.title, { color: textColor }]}>📖 Ritual Book</Text>
        </View>

        {/* Content */}
        <View style={[styles.content, { paddingHorizontal: 16 + Math.max(insets.left, insets.right), paddingBottom: bannerTop ? 60 : 0 }]}>
          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {PRACTICE_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tab,
                  {
                    backgroundColor: selectedTab === tab.name ? accentColor : cardBg,
                    borderBottomWidth: selectedTab === tab.name ? 3 : 1,
                    borderBottomColor: selectedTab === tab.name ? accentColor : mutedColor,
                  },
                ]}
                onPress={() => setSelectedTab(tab.name)}
              >
                <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: selectedTab === tab.name ? '#fff' : textColor },
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tab Content */}
          {currentRecipes.length === 0 ? (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Text style={[styles.tabTitle, { color: textColor }]}>
                {selectedTab} Recipes
              </Text>
              <Text style={[styles.description, { color: textColor, marginTop: 12 }]}>
                Your personal collection of {selectedTab.toLowerCase()} rituals, spells, and spiritual practices.
              </Text>
              <Text style={[styles.comingSoon, { color: mutedColor, marginTop: 16 }]}>
                Coming soon...
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.recipesList}>
              {currentRecipes.map((recipe, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.recipeItem, { backgroundColor: cardBg }]}
                  onPress={() => handleRecipePress(recipe)}
                >
                  <Text style={styles.recipeEmoji}>{recipe.emoji}</Text>
                  <View style={styles.recipeInfo}>
                    <Text style={[styles.recipeName, { color: textColor }]}>{recipe.name}</Text>
                    <Text style={[styles.recipeType, { color: mutedColor }]}>{recipe.type}</Text>
                    <Text style={[styles.recipeIntent, { color: mutedColor, marginTop: 4 }]} numberOfLines={2}>
                      {recipe.intent}
                    </Text>
                  </View>
                  <Text style={[styles.chevron, { color: accentColor }]}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
      <Modal
        visible={showRecipeModal}
        animationType="slide"
        onRequestClose={() => setShowRecipeModal(false)}
      >
        <View style={[styles.screenContainer, { backgroundColor: containerBg }]}>
          <View style={[styles.header, { backgroundColor: cardBg, paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowRecipeModal(false)}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: textColor }]}>{selectedRecipe?.emoji} {selectedRecipe?.name}</Text>
          </View>

          <ScrollView style={[styles.container, { backgroundColor: containerBg }]}>
            <View style={[styles.content, { paddingHorizontal: 16 + Math.max(insets.left, insets.right), paddingBottom: bannerTop ? 60 : 20 }]}>
              {selectedRecipe && (
                <View style={[styles.card, { backgroundColor: cardBg }]}>
                  <View style={styles.recipeHeader}>
                    <Text style={[styles.recipeHeaderText, { color: textColor }]}>
                      <Text style={{ fontWeight: '600' }}>Type:</Text> {selectedRecipe.type}
                    </Text>
                    <Text style={[styles.recipeHeaderText, { color: textColor }]}>
                      <Text style={{ fontWeight: '600' }}>Element:</Text> {selectedRecipe.element}
                    </Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Intent</Text>
                    <Text style={[styles.sectionText, { color: textColor }]}>{selectedRecipe.intent}</Text>
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Ingredients</Text>
                    {selectedRecipe.ingredients.map((ingredient, idx) => (
                      <Text key={idx} style={[styles.listItem, { color: textColor }]}>
                        • {ingredient}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Instructions</Text>
                    {selectedRecipe.instructions.map((instruction, idx) => (
                      <Text key={idx} style={[styles.listItem, { color: textColor }]}>
                        {idx + 1}. {instruction}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Benefits</Text>
                    {selectedRecipe.benefits.map((benefit, idx) => (
                      <Text key={idx} style={[styles.listItem, { color: textColor }]}>
                        ✓ {benefit}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 16,
    zIndex: 10,
  },
  backButtonText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  tabsContainer: {
    marginBottom: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  comingSoon: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  recipesList: {
    gap: 12,
  },
  recipeItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeEmoji: {
    fontSize: 28,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recipeType: {
    fontSize: 12,
    fontWeight: '500',
  },
  recipeIntent: {
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
  },
  recipeHeader: {
    gap: 8,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  recipeHeaderText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 23,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
});
