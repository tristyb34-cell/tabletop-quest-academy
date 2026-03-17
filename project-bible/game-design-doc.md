# Tabletop Quest: Game Design Document (Living Document)

**Version**: 0.3
**Last Updated**: 2026-03-17
**Engine**: Unreal Engine 5.7
**Genre**: DnD-Inspired 3D RPG with Tabletop Presentation
**Platform**: PC (Windows/Linux), Console stretch goal
**Players**: Singleplayer (multiplayer planned for later phases)
**Art Direction**: Semi-realistic to realistic, built primarily with Megascans, MetaHuman, marketplace assets, and UE5 Lumen/Nanite
**Development Approach**: Solo developer leveraging AI tools (Claude) for code/systems, marketplace for art, Mixamo for animations, MetaHuman for characters

---

## 1. High Concept

Tabletop Quest is a DnD-inspired 3D RPG where the player looks down at a literal tabletop covered in miniatures, terrain tiles, and hand-painted maps. When the player selects a location or triggers an encounter, the camera zooms seamlessly into the tabletop, and the miniatures come to life as fully realized 3D characters in a Skyrim/Fable-style explorable world. The game bridges the magic of physical tabletop gaming with the immersion of a modern action RPG.

A local LLM (Ollama) powers an AI Dungeon Master that narrates, improvises, generates quests, and reacts to player choices, all running on the player's own hardware with zero subscriptions or cloud dependencies.

---

## 2. The Three Pillars

These are the three features that define Tabletop Quest and set it apart from every other RPG on the market.

### Pillar 1: The Tabletop Zoom

The player begins every session looking down at a physical tabletop. Painted miniatures, hand-drawn maps, dice, rulebooks, and flickering candlelight fill the scene. This is not a menu or a loading screen. It is the actual game world rendered in miniature. When the player zooms in, the table does not disappear. The camera descends, the edges fade, terrain gains real depth, and miniatures morph into living characters. One world, two scales, zero loading screens.

### Pillar 2: Visceral Real-Time Combat

All combat is real-time. The player directly controls one party member with full action combat (light attacks, heavy attacks, dodge, abilities) while party AI handles the rest. Magic, swords, and environmental kills combine for a combat system that rewards positioning, timing, and creativity. A stagger system gives fights rhythm, and destructible environments make every arena a weapon.

### Pillar 3: Local AI Dungeon Master

An Ollama-powered LLM runs locally on the player's machine. In campaign mode, the AI DM adds flavor text, NPC personality, and dynamic narration to a hand-authored story. In freeplay mode, the AI DM drives everything: generating quests, populating encounters, creating NPC dialogue, and reacting to player choices. The LLM never modifies game state directly. It outputs structured JSON, and the game engine validates and executes. This keeps the game stable while letting the AI be creative.

---

## 3. Core Gameplay Loop

```
TABLETOP VIEW
    |
    v
Select location on tabletop map
    |
    v
ZOOM TRANSITION (2-3 seconds)
    |
    v
WORLD EXPLORATION (3rd person, open areas)
    |
    v
ENCOUNTER (combat, NPC, puzzle, event)
    |
    v
REAL-TIME COMBAT (magic, melee, environmental kills)
    |
    v
RESOLUTION (loot, XP, story progression)
    |
    v
LEVEL UP (if threshold reached)
    |
    v
RETURN TO TABLETOP (zoom out)
    |
    v
Move miniatures to next area, repeat
```

**Session Length Target**: A single loop (zoom in, encounter, zoom out) takes 10-20 minutes. A play session of 1-2 hours covers 3-6 loops. This mirrors the pacing of a real DnD session where the party moves between encounters on a physical map.

---

## 4. The Tabletop-to-World Transition

This is the signature moment of the game. It must feel magical every time.

### Technical Approach

There is ONE persistent world, NOT two separate levels. The tabletop map is a live render-to-texture of the actual game world viewed from a top-down orthographic camera. The miniatures on the table are simplified LOD representations of the real characters and enemies.

### Transition Sequence (2-3 seconds)

| Time | Camera | Visuals | Audio |
|------|--------|---------|-------|
| 0.0s | Begin descent from tabletop height | Full tabletop visible, miniatures static | Room ambience: fire crackle, clock tick, page rustle |
| 0.5s | Camera passes table edge height | Table edges begin to fade via material alpha | Room sounds fade, world sounds begin at 10% |
| 1.0s | Camera at mid-height | Terrain geometry gains depth (displacement maps activate), grass/foliage begins spawning | World ambient at 40%, room at 30% |
| 1.5s | Camera approaching character height | Miniatures morph to full characters via material crossfade (painted wood texture blends to skin/cloth/metal) | World at 70%, room at 10% |
| 2.0s | Camera reaches exploration position | Full world detail, LOD0 loaded, lighting transitions from warm lamplight to world lighting (time of day) | Full world soundscape, room silent |
| 2.5s | Camera settles behind player character | Transition complete, player has control | Music fades in based on biome |

### Key Technical Details

- **Material Crossfade**: Each character has two material sets (miniature and real). A single float parameter `TransitionAlpha` drives a lerp between them. At 0.0 the character looks like a painted wooden miniature. At 1.0 it looks like a living character.
- **Terrain Displacement**: The flat table surface uses a World Position Offset in the material that scales from 0 (flat) to 1 (full height map) during transition.
- **Foliage Spawn**: Grass, bushes, and small props use a distance-from-camera fade. As the camera descends, they pop in at a radius ahead of the camera.
- **Lighting**: Two light rigs exist simultaneously. The "room" rig (point lights for candles, warm directional for lamp) fades out while the "world" rig (directional sun, sky light, fog) fades in.
- **Render-to-Texture**: A secondary Scene Capture 2D component renders the world from a fixed top-down camera. This texture feeds the "map" material on the tabletop surface. It updates at a reduced framerate (10fps) to save performance.

### Zoom-Out (Return to Tabletop)

The same sequence plays in reverse. Characters freeze into miniature poses, terrain flattens, foliage despawns, lighting warms, audio crossfades back to the room.

---

## 5. Real-Time Combat System

### 5.1 Core Feel

The combat targets a feel between Fable (approachable action), God of War (environmental weight), and Dragon Age (party management). Positioning and timing matter, but the game is not punishingly difficult by default.

### 5.2 Controls

| Input | Action |
|-------|--------|
| WASD | Movement |
| Left Mouse | Light attack (fast, low damage, 3-hit combo chains) |
| Right Mouse | Heavy attack (slow, high damage, staggers enemies) |
| Spacebar | Dodge roll (i-frames, directional, 1s cooldown) |
| Q, E, R, F | Ability slots (4 active abilities equipped at a time) |
| 1-4 | Quick item slots (potions, throwables) |
| Tab | Switch which party member you directly control |
| Hold Alt | Tactical overlay (time slows to 25%, issue quick commands to party members) |
| Middle Mouse | Lock-on target |
| Shift | Sprint |
| C | Environmental interact (kick barrel, grab ledge, push object) |

### 5.3 Attack System

**Light attacks** chain into 3-hit combos with the final hit dealing bonus damage. Each class has unique combo animations:
- Warrior: wide swings, each hit cleaves slightly
- Rogue: fast jabs, final hit is a backstep slash
- Mage: staff strikes that release small arcane bursts
- Cleric: measured mace swings, final hit has a small holy pulse
- Ranger: quick bow shots or melee knife slashes
- Guided Spirit: fluid weapon strikes with spirit energy trailing each hit

**Heavy attacks** are slower, interruptible during wind-up, but stagger enemies and deal 200% damage. Some enemies can only be staggered by heavy attacks (armoured enemies, bosses). Hold the button to charge for more damage.

**Dodge roll** has a 1-second cooldown and roughly 0.4 seconds of invincibility frames. Directional (dodge sideways or backward). Warrior and Cleric with shields can block instead of dodge by holding right mouse while not attacking.

### 5.4 Stagger and Poise System

Every enemy has a **poise bar** (invisible, expressed through behaviour). Light attacks chip at poise. Heavy attacks chunk it. When poise breaks, the enemy staggers for 1-2 seconds, open to free hits and environmental kills. Bosses have multiple poise bars that regenerate between staggers.

Combat rhythm: chip with lights, break with a heavy, punish during stagger, dodge when they recover.

### 5.5 Ability System

Each class has 8 abilities total, unlocked through leveling. The player equips 4 at a time (swappable outside combat). Abilities use mana or stamina, have cooldowns, and range from simple to complex.

**Ability design principles:**
- Every ability should feel impactful. No filler.
- Abilities should interact with the environment where possible (Fireball ignites oil, Frost Bolt freezes water surfaces, Lightning Chain bounces off metal objects).
- Abilities should combo with other party members' abilities (Warrior taunt pulls enemies together, Mage drops AOE on the cluster).

See the separate Class and Ability Reference document for full ability lists.

### 5.6 Environmental Combat

| Interaction | Trigger | Effect |
|-------------|---------|--------|
| Explosive barrels | Hit with fire ability or strike | AOE explosion, damages everything nearby |
| Oil puddles | Ignite with fire | Burns enemies standing in it, area denial |
| Water puddles | Hit with lightning | Electrocutes all enemies in the water |
| Cliffs/ledges | Stagger enemy near edge, then heavy attack | Knock them off for instant kill or massive fall damage |
| Chandeliers/stalactites | Hit the chain/support with ranged attack | Drops on enemies below |
| Frozen water | Hit with frost ability | Creates slippery surface, enemies slide and fall |
| Destructible walls | Heavy attack or Ogre race ability | Opens alternate paths, can crush enemies behind |
| Throwable objects | Interact near rocks, chairs, crates | Pick up and throw for moderate damage and stagger |

Environmental kills are a core part of combat, not a gimmick. Arena design should always include environmental opportunities.

### 5.7 Party System

The player controls one character directly. The other 2-3 party members are AI-controlled.

**Tab** swaps who you control. Camera snaps to the new character in 0.3 seconds. The previous character switches to AI control using their preset.

**AI Presets** (set outside combat):

| Preset | Behaviour |
|--------|----------|
| Aggressive | Focus highest-threat enemy, use offensive abilities on cooldown |
| Defensive | Stay near player, prioritize survival, use defensive abilities |
| Support | Heal/buff allies first, attack only when no one needs help |
| Follow | Stay close to player, attack only player's current target |

**Tactical Overlay** (hold Alt): Time slows to 25% speed. A quick-command wheel appears. Point at an enemy to tell a party member to focus it, point at a location to reposition them, or trigger a specific ability. Release Alt, time resumes.

### 5.8 Damage and Hit Detection

**No invisible dice rolls for basic attacks.** If your sword visually connects, it hits. Hit detection is physics-based: weapon collision meshes meet enemy hitboxes.

**Dice rolls still apply for:**
- Ability effects (does the stun land? Roll vs target's resistance)
- Skill checks (lockpicking, persuasion, perception)
- Critical hits (base 5% chance, modified by gear and abilities)
- Status effect application (does the poison proc? Roll vs target's constitution)

The player never sees dice. They see damage numbers, status icons, and combat feedback (screen shake on crits, slow-mo on killing blows).

### 5.9 D&D Integration Philosophy

The game does NOT attempt to recreate full D&D freeform freedom. Instead, it uses structured game systems with an AI layer that adds flexibility:

- **Combat**: Players use defined abilities and attacks. Dice rolls happen under the hood for secondary effects. The AI DM narrates outcomes with flavour text.
- **Exploration**: Players get 3-5 contextual options at key moments, plus an "Attempt something else" option where the AI interprets a short text input and maps it to a skill check.
- **NPC Interaction**: AI-driven dialogue with gated knowledge. Outcomes are governed by skill checks and reputation scores, while the AI provides personality and variation.

### 5.10 Difficulty Settings

| Setting | Description |
|---------|------------|
| Story Mode | Enemies deal 50% damage, player deals 150%. For players here for narrative and AI DM. |
| Normal | Balanced as designed. |
| Hard | Enemies deal 125% damage, faster attacks, better AI patterns. |
| Ironman | Hard mode plus permadeath. |

---

## 6. Character System

### 6.1 Character Creation Flow (Option C: Hybrid)

The game uses pre-made characters with customisable builds.

**Step 1: Pick Your Hero** - Choose from 6 characters displayed as miniatures on the tabletop. Each has a fixed name, personality, backstory, and motivation. Personality drives the STORY.

**Step 2: Choose Race** - Pick from 5 races. Affects stats and passive abilities.

**Step 3: Choose Class** - Pick from that hero's available classes (2-3 options per hero). Affects combat role, abilities, and playstyle. The build drives the GAMEPLAY.

**Step 4: Distribute Stats** - Allocate starting stat points.

This separation means personality is about WHO the character is, not WHAT they do in combat. The AI DM knows each character's personality AND the player's chosen class, allowing it to dynamically adjust dialogue and narration.

### 6.2 The Six Heroes

Characters are recruited throughout the story, not all available at the start. The player's chosen character is the main protagonist. Other heroes join as party members when encountered.

Party size is 4 (1 player-controlled + 3 AI-controlled). With 6 heroes total, the player always leaves 2 behind, creating meaningful composition choices.

#### Edrin, "The Reluctant One"

**Personality**: Quiet, thoughtful, would rather be left alone but keeps getting dragged into things. Dry humour. Does not want to be a hero but has a moral compass that will not let him walk away. Speaks when it matters, stays quiet when it does not.

**Motivation**: He saw something he was not supposed to see. A detail about the Chancellor, a moment that did not add up. Now he cannot unsee it, and ignoring it is eating him alive.

**Flaw**: Avoids confrontation. Will delay hard decisions hoping the problem solves itself. The story forces him to stop running.

**Story Role**: The reluctant heart. The player's journey of "why should I care?" to "I have to act."

**Passive - Quiet Observer**: 15% chance to reveal lies or hidden motives in NPC dialogue. +1 Perception out of combat. Can see chests and loot containers through walls within 20 metres (faint glow visible only to the player).

**AI DM Note**: Edrin's dialogue should be understated. Short sentences. Occasional sarcasm. When he does speak up, it hits harder because it is rare.

**Available Classes**: Warrior, Ranger, Rogue

**Available from**: Game start (always selectable as main character).

#### Sable, "The Firestarter"

**Personality**: Loud, impulsive, passionate. Says what everyone is thinking but nobody has the guts to say. Gets into trouble constantly. Fiercely loyal once you earn it, but earning it takes work because she has been burned before. Laughs in dangerous situations.

**Motivation**: She is from the Farmlands. Her family lost their farm to the Chancellor's new land taxes. She is angry and looking for a fight, but underneath the anger is grief.

**Flaw**: Acts before thinking. Her mouth gets the party into as many problems as her skills get them out of. Struggles to trust.

**Story Role**: The spark. Pushes the pace, creates conflict and energy.

**Passive - Burning Fury**: Sable deals 5% more damage for each party member below 50% HP (including herself). Max 20% with a full party. If the bonus stays at 15% or higher for more than 10 seconds, she unlocks **Fury Eruption**: an AOE damage blast around her plus a small heal pulse to all party members. 30-45 second cooldown on Eruption.

**AI DM Note**: Sable interrupts, curses, and cracks jokes at bad times. If the player is being too cautious, she should push for action.

**Available Classes**: Warrior, Rogue

**Recruitment**: Found in a tavern brawl in Goldenreach, outnumbered but winning. The player can help or watch. Helping earns her respect.

#### Corwin, "The Mask"

**Personality**: Charming, polished, always performing. Grew up in Ashenmere's upper circles. Knows which fork to use at a royal dinner and which alley to disappear into after. Seems shallow at first, but there is a sharp mind behind the smile. Uses humour as armour.

**Motivation**: He was close to the Chancellor's inner circle. Close enough to see the cracks. He left, and now he is a target. He needs allies, but admitting he needs help is physically painful for him.

**Flaw**: Cannot be genuine. Hides behind charm and deflection. The player has to crack through his walls over time to get the real Corwin.

**Story Role**: The insider. Knows the political landscape, drip-feeds crucial info about the capital's power structure.

**Passive - The Charming Blade**: +25% damage with light weapons (daggers, rapiers, shortswords, light crossbows). Heavy armour slows him an additional 15% on top of normal penalties. Can taunt humanoid enemies into attacking recklessly (lowered defence for 5 seconds). The AI DM treats his allegiance as genuinely ambiguous throughout the story. Party members occasionally question his motives. NPCs who know his past may warn the player about him.

**AI DM Note**: Corwin's dialogue should be witty and evasive early on, becoming more honest as trust builds. Occasionally disappears without explanation, creating narrative tension.

**Available Classes**: Rogue, Ranger, Mage

**Recruitment**: Approaches the player in Ashenmere with a "business proposition." Clearly hiding the fact that he is desperate.

#### Thessa, "The Steady Hand"

**Personality**: Calm, practical, grounded. The person who keeps everyone fed, patched up, and pointed in the right direction while they are busy arguing. Does not seek the spotlight but is quietly the backbone of any group. Strong moral conviction but not preachy about it.

**Motivation**: She is a healer/herbalist from the edge of Thornveil. The forest's expansion is threatening her village. She does not want adventure; she wants to save her home. But saving her home means understanding what is causing the shift.

**Flaw**: Puts everyone else first to the point of self-destruction. Will not ask for help. Carries too much quietly.

**Story Role**: The anchor. Keeps the group human, the emotional core.

**Passive - Gentle Presence**: NPCs start at +5 trust instead of 0. Healer and herbalist NPCs share knowledge at one trust tier lower than normal. Wounded NPCs in the world can be helped for bonus reputation.

**AI DM Note**: Thessa asks the player how they are feeling after hard moments. She notices things others miss. Her dialogue is warm but not soft.

**Available Classes**: Cleric, Guided Spirit, Ranger

**Recruitment**: The player encounters her village under threat at the edge of Thornveil. She joins because she realizes she cannot fix this alone.

#### Grimjaw, "The Old Dog"

**Personality**: Grizzled, blunt, been through too much to care about manners. Respects actions, not words. Has a dark sense of humour and zero patience for drama. Surprisingly gentle with animals and children. Will not explain himself. You either keep up or get left behind.

**Motivation**: He is a former soldier who served under the previous leadership. He knows the realm is rotting because he has watched it happen before, in a different kingdom, years ago. He failed to stop it then. This is his second chance.

**Flaw**: Cynical. Expects the worst from people and situations. Can be cruel when he is disappointed. The player can either reinforce his cynicism or slowly rebuild his faith.

**Story Role**: The mirror. Reflects the cost of failure, challenges the player's idealism.

**Passive - Veteran's Instinct**: Soldiers and guards respect him; military NPCs share knowledge one trust tier early. After being in combat for 15+ seconds, Grimjaw enters Battle Focus: 10% damage reduction and 10% bonus damage (old muscle memory kicking in). First time he drops below 20% HP per combat, he gets a 3-second window of 50% damage reduction (refuses to go down easy).

**AI DM Note**: Grimjaw speaks in short, blunt sentences. No flowery language. If the player does something stupid, Grimjaw says so. If they do something brave, he gives a single nod or a grunt of approval.

**Available Classes**: Warrior, Ranger

**Recruitment**: Found in Ironpeak, drinking alone. He is not looking for a party. The player has to prove they are worth following.

#### Pip, "The Wildcard"

**Personality**: Curious, strange, sees the world differently from everyone else. Talks to things that are not there (or ARE they there?). Collects odd objects. Says bizarre things that turn out to be accidentally profound. Unpredictable but never malicious. The party does not fully understand Pip, and that is part of the charm.

**Motivation**: Pip is drawn to the Hearthstone's imbalance like a moth to flame. They can FEEL the Balance shifting in ways others cannot. They do not fully understand why, and figuring that out is part of their arc.

**Flaw**: Unreliable in conventional ways. Might wander off mid-conversation. Hard to pin down. The player has to accept Pip on Pip's terms.

**Story Role**: The mystery. Connected to the deeper magic, keeps things unpredictable. An outcast to the earthly world, but connected to something far larger than anything happening in Aethermoor. All the hardships of the journey are preparing Pip for a spiritual battle in the afterlife that Pip is not yet aware of.

**Passive - Strange Intuition**: Occasionally receives cryptic hints about nearby secrets or hidden paths (AI DM generated). Magical NPCs and creatures are curious rather than hostile. +2 Arcana. Magical traps and enchanted objects glow faintly within 15 metres.

**AI DM Note**: Pip's dialogue should be slightly off-kilter. Non-sequiturs that circle back to relevance. Occasionally foreshadow events.

**Available Classes**: Mage, Guided Spirit

**Recruitment**: Pip finds YOU. Shows up at the worst possible moment, says something cryptic, and somehow helps. Then just... stays.

### 6.3 Party Dynamics

| Character | Story Role | Dynamic |
|-----------|-----------|---------|
| Edrin | The reluctant heart | The player's journey from apathy to action |
| Sable | The spark | Pushes the pace, creates conflict and energy |
| Corwin | The insider | Knows the political landscape, drip-feeds crucial info |
| Thessa | The anchor | Keeps the group human, the emotional core |
| Grimjaw | The mirror | Reflects the cost of failure, challenges idealism |
| Pip | The mystery | Connected to deeper magic, keeps things unpredictable |

### 6.4 Class Assignment Per Hero

Each hero has 2-3 available classes that fit their personality. No hard caps on class duplication. If a player wants 3 Warriors and no healer, the game allows it but combat will be harder. A soft tooltip during recruitment suggests gaps in party composition.

| Character | Option 1 | Option 2 | Option 3 |
|-----------|----------|----------|----------|
| Edrin | Warrior | Ranger | Rogue |
| Sable | Warrior | Rogue | - |
| Corwin | Rogue | Ranger | Mage |
| Thessa | Cleric | Guided Spirit | Ranger |
| Grimjaw | Warrior | Ranger | - |
| Pip | Mage | Guided Spirit | - |

Every class appears at least twice across the roster, so no class is locked out regardless of party composition.

### 6.5 Stats (4 instead of 6)

| Stat | DnD Equivalent | Governs |
|------|---------------|---------|
| Might | Strength + Constitution | Melee damage, HP, carrying capacity, physical saves |
| Finesse | Dexterity | Ranged damage, initiative, dodge, AC (light armour), traps |
| Mind | Intelligence + Wisdom | Spell damage, mana pool, perception, knowledge checks, spell saves |
| Presence | Charisma | Dialogue, party buffs, summon/companion strength, NPC pricing |

**Starting Stats**: 10 points to distribute (each stat starts at 5, range 3-15). Each point above 10 gives +1 modifier. Each point below 10 gives -1 modifier.

**Stat Growth**: +1 stat point every 3 levels (levels 3, 6, 9, 12, 15). Gear can also boost stats.

### 6.6 Races (5)

Each race provides permanent physical/biological traits that affect combat and exploration.

| Race | Stat Bonus | Passive |
|------|-----------|---------|
| **Human** | +1 to any two stats | **Adaptable**: +10% XP gain. Flexible stat start. Humans learn faster and fit into any role. |
| **Elf** | +2 Finesse | **Darkvision**: See clearly in dim light and dark areas. +2 Perception at night or underground. Long rest restores 10% more HP/mana. Can detect magical auras within 10 metres. |
| **Dwarf** | +2 Might | **Stoneblood**: Poison resistance (half damage, half duration). +1 AC in heavy armour. Can appraise crafted items and ore (see hidden quality/value). 10% discount at blacksmiths. |
| **Goblin** | +2 Finesse | **Nimble**: +5ft movement speed. 10% passive dodge chance. Can fit through small passages other races cannot (alternate dungeon routes). Can climb certain surfaces without equipment. |
| **Ogre** | +2 Might | **Imposing**: +15 max HP at level 1, +2 bonus HP per level. Intimidation gains advantage. -5ft movement speed. Can smash through weak walls, break locked chests without keys, throw heavy objects further. |

### 6.7 Classes (6)

Each class defines combat role, abilities, and playstyle. See the separate Class and Ability Reference document for full ability lists.

| Class | Role | Primary Stat | Armour | Weapons | Combat Feel |
|-------|------|-------------|--------|---------|-------------|
| Warrior | Tank, Melee DPS | Might | Heavy | Swords, Axes, Maces, Shields | Heavy, impactful, planted. God of War with axe. |
| Rogue | Melee DPS, Utility | Finesse | Light | Daggers, Shortswords, Crossbows | Fast, darting, positional. Always circling behind. |
| Mage | Ranged DPS, Control | Mind | Cloth | Staves, Wands | Ranged, rhythmic, devastating. Chain spells and exploit environments. |
| Cleric | Healer, Support | Mind + Presence | Medium | Maces, Shields, Holy Symbols | Steady, dual-purpose. Mace-swinging healer. |
| Ranger | Ranged DPS, Scout | Finesse + Mind | Medium | Bows, Crossbows, Shortswords | Precise, mobile, pet-assisted. Horizon Zero Dawn ranged feel. |
| Guided Spirit | Adaptive Support/DPS | Mind + Presence | Light/Medium | Any one-handed + Spirit manifestation | Fluid, adaptive, state-switching. Spirit augments everything. |

### 6.8 Class Passives

| Class | Passive Name | Effect |
|-------|-------------|--------|
| **Warrior** | Frontline Presence | Enemies within 6m are 15% more likely to target you. 5% passive damage reduction. Below 30% HP, gain additional 10% damage reduction for 8 seconds (45s cooldown). |
| **Rogue** | Opportunist | Attacks from behind deal 20% bonus damage. Attacks on staggered enemies deal 15% bonus damage (stacks with behind bonus for 35%). Lockpicking and trap disarming without tools. Sprint is silent. |
| **Mage** | Arcane Reservoir | Spell kills restore 5 mana. Consecutive spells gain 5% bonus damage per cast (max 3 stacks, 15%). Environmental magic interactions deal 25% more damage. |
| **Cleric** | Divine Awareness | Sense undead within 15m (faint glow through walls). Healing on allies below 25% HP is 25% more effective. Auto-pulse emergency heal when any ally drops below 15% HP (8s cooldown per ally). 15% less damage from undead and dark magic. |
| **Ranger** | Pathfinder | Party moves 10% faster on world map. Cannot be ambushed (Ranger always detects incoming enemies). Animal companion gains +2 to all stats and levels with you. Ranged attacks beyond 12m deal 10% bonus damage. |
| **Guided Spirit** | Spiritual Tether | Spirit Energy regenerates 25% faster when allies are below 50% HP. Switching manifestation states triggers a burst (Guardian: small shield on nearest ally, Wrath: damages nearest enemy, Whisper: heals lowest HP ally). Immune to fear effects. |

### 6.9 Passive Stacking Rules

Every character has exactly three passives running at all times:

1. **Personality passive** (from hero pick) - Affects story, social, and one unique combat/exploration flavour
2. **Race passive** (from race pick) - Affects combat stats, exploration, and physical traits
3. **Class passive** (from class pick) - Affects combat role and playstyle

If two passives affect the same stat (e.g. both give Perception bonuses), they simply add together. No multiplication, no diminishing returns. No passive should make a player feel forced into a specific combo. Every race should feel viable with every class.

**Example**: Sable as a Goblin Rogue has:
- Burning Fury (more damage when party is hurt, Fury Eruption AOE)
- Nimble (+5ft speed, 10% dodge, small passages, climbing)
- Opportunist (backstab bonus, stagger bonus, silent sprint)

Three passives, zero overlap, all reinforcing the same aggressive playstyle.

### 6.10 The Guided Spirit Class

The Guided Spirit has a direct connection to a spiritual entity that acts alongside them. Unlike the Cleric's structured divine faith, the Guided Spirit's power is personal, mysterious, and adaptive.

#### Spirit Energy

The Guided Spirit uses a **Spirit Energy** bar instead of standard mana/stamina. It fills passively over time and fills faster when the player is in danger or when allies take damage. The spirit responds to need.

#### Three Manifestation States

The player switches between states on a 3-5 second cooldown. Each state changes the spirit's behaviour:

| State | Visual | Role | Abilities |
|-------|--------|------|----------|
| **Guardian** | Translucent shield figure near player | Defence and protection | Damage absorption aura, parry buff, emergency shield burst on ally about to die |
| **Wrath** | Spectral weapon orbiting player | Offence and disruption | Spirit strikes echo the player's damage, ranged spirit projectile, stagger burst on nearby enemies |
| **Whisper** | Faint glowing particles | Utility and healing | Passive party heal over time, reveal hidden enemies/traps, debuff cleanse on allies |

The player fights with their own weapons and attacks. The spirit AUGMENTS what they do. In Guardian state, tankier. In Wrath, more damage. In Whisper, party support.

#### Unique Manifestations Per Character

The Guided Spirit manifests differently depending on who channels it. Mechanics remain identical; visuals and narrative differ.

**Thessa's Spirit: The Grove Warden**

A nature spirit tied to Thornveil. Manifests as intertwining vines and leaves, soft green light, wind through branches.

| State | Visual |
|-------|--------|
| Guardian | Bark-like shields, roots anchor enemies |
| Wrath | Thorned vines lash out, spectral wolf or stag charges |
| Whisper | Pollen-like particles, flowers briefly bloom underfoot |

**Story hook**: As Thornveil expands, Thessa's spirit grows stronger but wilder. She struggles to control it. The power that makes her strong might be part of the Dimming.

**Pip's Spirit: The Echo**

Something ancient, undefined, and strange. Fractured light, geometric patterns, sounds that do not belong. It feels less like a natural spirit and more like a glitch in reality.

| State | Visual |
|-------|--------|
| Guardian | Shimmering distortions, attacks sometimes "skip" like a scratched record |
| Wrath | Cracks in the air fire beams of raw energy, afterimage echoes of Pip attack independently |
| Whisper | Soft humming, faint geometric shapes, time feels slightly different near Pip |

**Story hook**: Pip's spirit gets MORE stable as the Dimming progresses, the opposite of what should happen. The Echo may be connected to something that existed before the Balance was created.

#### Dual Guided Spirit Synergy: The Resonance

When both Pip and Thessa are in the party AND both are Guided Spirit class:

- Trust between them grows at 2x speed
- Spirit Energy regenerates 15% faster for both
- At max trust, each unlocks one unique ability only available when both are present:
  - **Thessa unlocks: Roots of the Echo** - Grove Warden channels through Pip's Echo, creating a massive AOE that heals allies and damages enemies simultaneously. Vines crackling with geometric light. 45 second cooldown.
  - **Pip unlocks: Veil of the Grove** - The Echo wraps the party in a nature-infused shield for 6 seconds. All party members are immune to status effects and regenerate HP. Fractured light takes on green tones and leaf patterns. 60 second cooldown.
- The AI DM generates unique banter. Thessa helps Pip understand their power in grounded terms. Pip shows Thessa the forest is connected to something much larger.

This creates a meaningful trade-off: two Guided Spirits in one party is powerful and unlocks exclusive content, but costs two of four party slots being the same class.

### 6.11 Skills (8)

| Skill | Governing Stat | Used For |
|-------|---------------|----------|
| Athletics | Might | Climbing, swimming, breaking objects, grappling |
| Stealth | Finesse | Sneaking, hiding, pickpocketing |
| Perception | Mind | Spotting traps, hidden enemies, secrets |
| Arcana | Mind | Identifying magic items, interacting with magical objects |
| Medicine | Mind | Stabilizing downed allies, identifying poisons |
| Persuasion | Presence | Convincing NPCs, better shop prices, quest dialogue |
| Intimidation | Presence | Frightening NPCs, forcing information, combat morale |
| Survival | Mind | Tracking, foraging, navigating, identifying creatures |

Skill checks: 1d20 + stat modifier + proficiency (if proficient). Each class grants proficiency in 3-4 skills.

### 6.12 Mana System

Instead of spell slots, all casters use mana. Guided Spirit uses Spirit Energy (same math, different name and thematic source).

- **Base Mana Pool**: 20 + (Mind modifier x 5)
- **Mana Regen**: 2 per 6 seconds
- **Mana Potions**: Restore flat amounts (Small: 15, Medium: 30, Large: 50)
- **Ability Costs**: Range from 5 mana (basic spells) to 40 mana (ultimate abilities)
- **Non-Casters**: Warrior, Rogue use stamina (same pool, same math, different name)

### 6.13 Leveling

- **Level Cap**: 15
- **XP Curve**: Each level requires (current level x 100) XP. Level 1 to 2 = 100 XP. Level 14 to 15 = 1400 XP. Total XP to max: 10,500.
- **Per Level**: +HP (based on class), +1 mana/stamina, new ability every 2 levels, stat point every 3 levels, subclass at level 5.
- **Party XP**: XP is shared equally among party members. No individual XP.

### 6.14 Equipment Slots

Weapon, Off-hand/Shield, Armour, Helm, Boots, Ring (x2), Amulet, Cloak. Total: 9 slots. See the Loot Tables document for item details.

---

## 7. World: The Realm of Aethermoor

### 7.1 The Central Conflict: The Dimming

The Realm of Aethermoor has always been governed by the Balance, a magical equilibrium between light and shadow maintained by the Hearthstone, an ancient artifact sitting in the capital city. Neither side is inherently good or evil. Shadow gives rest, mystery, and change. Light gives growth, clarity, and order. The Balance keeps both in check.

**The inciting event**: A new Chancellor, **Vaelen Thresh**, rose to power in the capital through legitimate election. Charismatic, intelligent, beloved. But he has been secretly siphoning the Hearthstone's energy to fuel his own power. He has not "turned evil" in his own mind. He genuinely believes centralized power is the only way to protect the realm from external threats. Classic villain who thinks he is the hero.

**The effect**: The Balance is tilting. Not broken, but leaning. Different regions feel it in different ways. The player's journey: figure out WHY things are changing, discover the Hearthstone is being drained, decide how to deal with Thresh (confront, expose, ally with, overthrow, or even join him), and restore or reshape the Balance.

The conflict is political and moral, not just "kill the bad guy." The AI DM can generate NPCs with genuine opinions on both sides. Some people like Thresh. Some think the old Balance was unfair. The player's choices actually matter.

### 7.2 Four Narrative Threads

The story weaves four threads together. Which threads the player sees most depends on which heroes they recruit.

| Thread | Focus | Driven By | Tone |
|--------|-------|----------|------|
| **The Political** | Thresh, the power grab, corruption of the Hearthstone | Corwin | Intrigue, deception, moral grey areas |
| **The Natural** | Thornveil expanding, Balance tilting, nature responding to the Dimming | Thessa | Creeping dread, environmental storytelling |
| **The Personal** | People losing farms, soldiers watching history repeat, ordinary people in extraordinary events | Sable, Grimjaw, Edrin | Human cost, emotional stakes |
| **The Cosmic** | Something older than the Balance, the Echo, Pip's true purpose | Pip | Mystery, lore, existential questions |

A player who focuses on Corwin gets a satisfying political thriller. A player who digs into Pip's mystery discovers the rabbit hole goes much deeper. Both are valid. The AI DM emphasises whichever threads the player pursues.

### 7.3 World Map Overview

```
                    SNOWVEIL SUMMIT
                         |
                      IRONPEAK
                    /    |
            HIGH PASS  FROSTHOLD
               /         |
              /       DEEP MINES
             /
    THORNVEIL ---- GOLDENREACH ---- ASHENMERE
    /    |    \        |    \          |    \
HOLLOW DEEPWOOD  OUTER   HEARTH-  ORCHARDS  MERCHANT
         |      EDGE    STEAD       |       ROW
    WITCHWATER    \       |      SCARECROW   |
       BOG      THESSA'S  MILL-   FIELDS   THE CROWN
                VILLAGE   BROOK      |        |
                                     |    UNDERBELLY
                                     |        |
                              SHATTERED     DOCKS
                                COAST
                               /    \
                          SALTMERE  WRECKS
                                      |
                                 CORAL CAVES
```

Fog of war covers most of the map at start. Early game: Goldenreach and edges of Ashenmere. Mid-game: Thornveil and Ironpeak. Late-game: The Hollow, Deep Mines, Snowveil Summit.

### 7.4 Biome: Ashenmere (The Capital City)

**Vibe**: Kings Landing meets Prague. Grand, layered, political. Beautiful from the top of the hill, grimy at the bottom.

| District | Feel | What's There |
|----------|------|-------------|
| **The Crown** | Wealthy, guarded, pristine marble | Chancellor's palace, noble estates, the Hearthstone vault, political intrigue |
| **Merchant Row** | Busy, colourful, loud | Shops, taverns, main market square, street performers, pickpockets |
| **The Underbelly** | Dark, cramped, dangerous | Black market, thieves' guild, informants, people the Crown wants forgotten |
| **Temple Ward** | Quiet, reverent, old stone | Temples to old gods, healers, scholars, a massive library with hidden sections |
| **The Docks** | Salty, rough, transient | Sailors, smugglers, travellers from distant lands with foreign knowledge, fishing boats |
| **The Walls** | Militaristic, disciplined | Barracks, training grounds, the gate guard, war veterans |

**Build Priority**: The Crown + Merchant Row first (story critical), then Underbelly + Docks (side quests), then Temple Ward + The Walls (later content).

**Technical Approach**: Modular building kits with PCG-driven placement along road splines. Different material sets per district (marble for The Crown, wood for Merchant Row, dark stone for Underbelly). Key locations hand-crafted, filler buildings procedurally placed.

### 7.5 Biome: Goldenreach (The Farmlands)

**Vibe**: The Shire meets rural Normandy. Rolling golden fields, stone fences, simple people with deep roots.

| Area | Feel | What's There |
|------|------|-------------|
| **Hearthstead** | Main farming village, warm and communal | Tavern, blacksmith, small market, village elder, Sable's family farm |
| **The Orchards** | Peaceful, fragrant, slightly eerie at night | Apple groves, a hermit who knows old magic, harvest festival grounds |
| **The Scarecrow Fields** | Unsettling, flat, exposed | Something is wrong with the crops here. Scarecrows that seem to move. A mini-dungeon underneath an old barn |
| **Millbrook** | Smaller hamlet by the river | Mill, fishing spot, a bridge troll (friendly or hostile depending on approach), river trade route |

### 7.6 Biome: Thornveil (The Dark Forest)

**Vibe**: The Forbidden Forest meets Mirkwood. Not evil, but deeply unwelcoming. The forest has its own rules.

| Area | Feel | What's There |
|------|------|-------------|
| **The Outer Edge** | Misty, quiet, watchful | Thessa's village, herbalist huts, the tree line where farmland ends and darkness begins |
| **The Deepwood** | Dark canopy, bioluminescent fungi, sounds you cannot identify | Creatures, lost travellers, ancient ruins overgrown with roots, a druid circle |
| **The Hollow** | Suffocating, wrong, the trees grow in spirals | The heart of the shadow expansion. Something ancient lives here. Late-game area. |
| **Witchwater Bog** | Swampy, fog, things beneath the surface | A witch who trades in secrets (not evil, just transactional), rare alchemy ingredients, will-o-wisps that lead you astray or to treasure depending on your luck stat |

### 7.7 Biome: Ironpeak (The Mountains)

**Vibe**: Winterfell meets Erebor. Cold, ancient, carved from stone. The dwarven strongholds are engineering marvels, but the deeper you go, the older and stranger things get.

| Area | Feel | What's There |
|------|------|-------------|
| **Frosthold** | Main dwarven settlement, warm inside cold stone | Forges, ale halls, miners, Grimjaw's drinking spot, a sealed gate everyone avoids |
| **The High Pass** | Exposed, windy, dangerous | Mountain trails, bandit camps, eagle nests, a hermit monastery with monks who trade training for favours |
| **The Deep Mines** | Claustrophobic, dripping, echoing | Abandoned mine shafts, rare ore, creatures that have not seen sunlight in centuries, the source of the tremors |
| **Snowveil Summit** | Beautiful, deadly, sacred | The peak above the clouds. An ancient shrine. Pilgrimage site. The view from the top shows the entire map. Late-game reward area. |

### 7.8 Biome: The Shattered Coast (Bonus Biome)

**Vibe**: The Iron Islands meets shipwreck coves. Not essential for launch, adds variety.

| Area | Feel | What's There |
|------|------|-------------|
| **Saltmere** | Crumbling port town, half underwater at high tide | Sailors, sea shanties, a lighthouse keeper who sees things in the fog, trade routes to places not on the map |
| **The Wrecks** | Beached ships, rusted metal, scavengers | Loot, traps, a ghost ship that appears at night, smuggler hideouts |
| **Coral Caves** | Underwater cave system accessible at low tide | Rare loot, sea creatures, an ancient shrine to a forgotten water deity |

### 7.9 NPC Mood and Event System

Every NPC has a base mood that can be shifted by world events. This is a tag system the AI DM uses to generate appropriate dialogue.

**Base Moods**: Friendly, Neutral, Anxious, Angry, Fearful, Grieving, Suspicious, Joyful, Distant

**Event-Driven Mood Shifts**: When story events occur (Chancellor decrees, harvest failures, mine collapses, military movements), NPCs in affected regions have their mood tags updated. The AI DM reads these tags when generating dialogue.

Example: After the Chancellor raises taxes, Goldenreach NPCs shift from Friendly to Anxious/Angry. Crown district NPCs shift to Fearful. Underbelly NPCs become more Suspicious.

### 7.10 Map Build Phases (Scope Management)

**Phase 1 (Must have for playable game):**
- Ashenmere: The Crown + Merchant Row + Underbelly
- Goldenreach: Hearthstead + one other area
- Thornveil: Outer Edge + Deepwood
- Ironpeak: Frosthold

**Phase 2 (Adds depth):**
- Remaining Ashenmere districts
- Remaining Goldenreach and Thornveil areas
- Ironpeak: High Pass + Deep Mines

**Phase 3 (Full vision):**
- Snowveil Summit
- The Hollow
- Shattered Coast

---

## 8. AI Systems

### 8.1 AI Dungeon Master

#### Technology

- **Engine**: Ollama (local LLM runtime)
- **Model**: Mistral 7B (minimum), Llama 3 8B (recommended), or any GGUF-compatible model
- **Integration**: UE5 C++ plugin makes HTTP requests to Ollama's local API (localhost:11434)
- **Performance Target**: Response in under 3 seconds on a machine with 16GB RAM

#### Four AI Layers

| Layer | Input | Output | Frequency |
|-------|-------|--------|-----------|
| Narrative | Player actions, world state summary | Flavour text, scene descriptions, story beats | Every major action |
| NPC Dialogue | NPC profile, conversation history, player reputation | Dialogue lines, tone tags, emotion hints | When player talks to NPC |
| Encounters | Party level, location, time, quest state | Enemy composition, terrain modifiers, encounter type | When entering new area or triggered |
| Quests | Player history, world state, unfulfilled hooks | Quest name, objectives, rewards, NPC involvement | Periodically or when player seeks work |

#### Safety Architecture

The LLM NEVER modifies game state directly. Instead:

1. LLM receives a context prompt with current game state (JSON summary).
2. LLM outputs a structured JSON response.
3. The Game State Validator (C++ module) checks the JSON against game rules.
4. Valid changes are applied. Invalid changes are discarded and the LLM is re-prompted.

#### Context Window Management

- **Sliding Window**: 4000 tokens maximum context per request.
- **Priority Stack** (what stays in context longest):
  1. System prompt with world rules and current game state (always present, ~800 tokens)
  2. Current quest objectives (~200 tokens)
  3. Recent player actions (last 5 actions, ~500 tokens)
  4. Recent NPC interactions (last 3, ~600 tokens)
  5. World state summary (condensed, ~400 tokens)
  6. Historical summary (AI-generated recap of older events, ~500 tokens)
- **Compression**: Every 20 interactions, older context is summarized by the LLM into a ~200 token recap that replaces the raw history.

#### Campaign Mode vs Freeplay Mode

| Feature | Campaign Mode | Freeplay Mode |
|---------|--------------|---------------|
| Main Story | Hand-authored, scripted | AI-generated |
| Side Quests | Hand-authored + AI embellished | Fully AI-generated |
| NPC Dialogue | AI-generated from author notes | Fully AI-generated |
| Encounters | Pre-designed, AI adds flavour | AI-generated within rules |
| Narration | AI-generated from author prompts | Fully AI-generated |
| World Events | Scripted triggers | AI-driven based on player actions |

### 8.2 NPC Knowledge System

Every NPC has a knowledge card that defines what they know and when they will share it. This creates a distributed quest intelligence network where talking to people is a core gameplay mechanic.

#### Knowledge Card Structure

```json
{
  "name": "Marta the Baker",
  "location": "Hearthstead, Goldenreach",
  "personality": "warm, gossipy, nervous around strangers",
  "mood": "friendly",
  "will_talk": true,
  "anger_triggers": ["threatening her", "insulting her bread"],
  "former_home": "Thornveil Outer Edge",
  "knowledge": [
    {
      "topic": "abandoned_mine_location",
      "detail": "There is an old mine past the north ridge.",
      "quest_hook": "mine_dungeon_01",
      "trust_required": 10,
      "level_required": 0
    },
    {
      "topic": "dragon_sighting",
      "detail": "I saw something flying over the mountains last week.",
      "quest_hook": "dragon_investigation",
      "trust_required": 25,
      "level_required": 8
    }
  ]
}
```

#### Trust and Reputation Per NPC

| Score | State | Behaviour |
|-------|-------|----------|
| -20 or below | Hostile | Will not talk, might call guards or attack |
| -10 to -1 | Annoyed | Short answers, will not share knowledge |
| 0 to 9 | Neutral | Basic conversation, surface-level info |
| 10 to 19 | Friendly | Shares common knowledge, gives minor tips |
| 20 to 29 | Trusted | Shares secrets, offers quest hooks |
| 30+ | Close ally | Shares everything, might offer rare items |

**Trust increases from**: Helping them, completing their quests, having high Presence, choosing kind dialogue options.

**Trust decreases from**: Threatening, stealing, failing their quests, choosing rude options, harming people they care about. Some NPCs have specific anger triggers that tank trust immediately.

#### Former Hometown Knowledge

Some NPCs know things about OTHER locations because they used to live there. Players who talk to everyone get rewarded with knowledge. Players who rush through miss hidden content.

#### Dialogue Implementation

Starts as text-only with AI-generated dialogue. Text-to-speech and typed player input are stretch goals for later phases. Voice acting (recorded with friends) covers scripted story beats, recruitment scenes, combat barks, and key narrative moments.

---

## 9. Camera Systems

### 9.1 Four Camera Modes

| Mode | Perspective | Controls | When Active |
|------|------------|----------|-------------|
| Tabletop | Top-down, slightly angled (60 degrees) | Pan (WASD/drag), zoom (scroll), rotate (Q/E) | Viewing the tabletop between adventures |
| Exploration | Third-person, behind character | WASD move, mouse look, scroll zoom | Exploring the world after zooming in |
| Combat | Over-the-shoulder, tighter than exploration | WASD move, mouse aim, scroll zoom, lock-on with middle mouse | During real-time combat |
| Cinematic | Scripted, varies | None (player watches) | Story moments, boss intros, transitions |

### 9.2 CameraDirector

A single `ACameraDirector` actor manages all transitions. It holds references to all four camera components and blends between them using `FViewTarget` interpolation. Transition durations:

- Tabletop to Exploration: 2.5 seconds (the signature zoom)
- Exploration to Combat: 0.5 seconds (quick, action-oriented)
- Any to Cinematic: 0.5 seconds
- Cinematic back to previous: 0.5 seconds

---

## 10. Save System

### 10.1 Schema

```json
{
  "version": "1.0",
  "timestamp": "2026-03-17T14:30:00Z",
  "playtime_seconds": 7200,

  "party": {
    "members": [
      {
        "name": "Edrin",
        "character_id": "edrin",
        "class": "warrior",
        "subclass": "guardian",
        "race": "human",
        "level": 7,
        "xp": 2800,
        "stats": { "might": 14, "finesse": 8, "mind": 6, "presence": 10 },
        "hp": { "current": 85, "max": 95 },
        "mana": { "current": 20, "max": 25 },
        "equipped_abilities": ["power_strike", "shield_bash", "cleave", "battle_cry"],
        "all_abilities": ["power_strike", "shield_bash", "cleave", "battle_cry", "second_wind", "taunt"],
        "equipment": {
          "weapon": "longsword_of_flame",
          "offhand": "tower_shield",
          "armor": "plate_armor",
          "helm": "iron_helm",
          "boots": "steel_greaves",
          "ring1": "ring_of_might",
          "ring2": null,
          "amulet": null,
          "cloak": "cloak_of_protection"
        },
        "inventory": ["health_potion_medium", "antidote"]
      }
    ],
    "gold": 1250,
    "shared_inventory": []
  },

  "world_state": {
    "current_location": "hearthstead",
    "discovered_locations": ["hearthstead", "goblin_warren", "ashenmere_merchant_row"],
    "fog_of_war": {
      "revealed_hexes": [{"q": 0, "r": 0}, {"q": 1, "r": 0}]
    },
    "time_of_day": "afternoon",
    "day_count": 14,
    "weather": "overcast",
    "event_flags": {
      "tax_increase_announced": true,
      "thornveil_expanding": true
    }
  },

  "quests": {
    "active": [
      {
        "id": "main_quest_act1",
        "name": "The Gathering Storm",
        "objectives": [
          {"id": "obj1", "description": "Speak to the village elder", "complete": true},
          {"id": "obj2", "description": "Investigate the ruins north of town", "complete": false}
        ]
      }
    ],
    "completed": ["tutorial_quest"],
    "failed": []
  },

  "ai_dm": {
    "mode": "campaign",
    "history_summary": "The party cleared the goblin warren and saved the merchant. The village elder hinted at darkness spreading from Thornveil.",
    "recent_actions": [],
    "npc_relationships": {
      "elder_miriam": {"reputation": 15, "last_interaction": "day_12"},
      "blacksmith_gorak": {"reputation": 5, "last_interaction": "day_10"},
      "marta_baker": {"reputation": 20, "last_interaction": "day_14"}
    },
    "generated_quests": [],
    "world_flags": {"goblin_warren_cleared": true, "merchant_saved": true}
  },

  "combat_state": null,

  "settings": {
    "party_ai_presets": {
      "member_2": "support",
      "member_3": "aggressive"
    },
    "difficulty": "normal"
  }
}
```

### 10.2 Save Slots

- 3 manual save slots per campaign/freeplay session
- 1 autosave (triggers on: entering new area, completing quest objective, before combat)
- 1 quicksave (F5 save, F9 load)
- Save files stored as compressed JSON (gzip)

---

## 11. Multiplayer (Future Scope)

Multiplayer is deferred to later phases but the architecture is designed to support it.

**Planned approach**:
- One player hosts (their world, their story progression)
- Other players import their characters from their own single-player saves
- The host's character remains the "main" protagonist for story purposes
- Guest players control their imported characters, earn XP, collect loot, and unlock achievements that carry back to their own saves
- Server-authoritative GameState manager (built from Phase 0) makes this transition possible without a rewrite

**Key decisions deferred**: Maximum player count, mid-session joining, how the AI DM handles multiple human players.

---

## 12. Voice Acting

**Approach**: Recorded with friends, covering key scripted content. AI-generated dialogue from the LLM remains text-only.

**What gets voiced:**
- Character recruitment scenes
- Key narrative story beats and cutscenes
- Combat barks ("I'm hit!", "Over here!", "Watch out!", ability callouts)
- Death/revival lines
- Major quest dialogue (turning points, revelations)

**What stays text-only:**
- General NPC conversation (AI-generated)
- Shop interactions
- Minor quest dialogue
- Environmental flavour text

**Equipment needed**: A decent microphone, a quiet room, and Audacity (free) for editing.

---

## 13. Known Blind Spots and Risks

| Blind Spot | Risk Level | Notes |
|-----------|-----------|-------|
| Animation count | High | 50+ unique ability animations across 6 classes. Mixamo and retargeting help, but unique abilities need custom work. |
| Pathfinding at two scales | Medium | Tabletop view and world view need separate navmeshes or a single navmesh that works at both. |
| Networking prep | High | Architecture must be server-authoritative from the start for future multiplayer. Adds complexity to Phase 0-1. |
| UE5 + LLM on consumer hardware | High | Running UE5 at 60fps AND a 7B LLM simultaneously. LLM inference must be async. |
| Party AI quality | High | With real-time only combat, party AI is always active. Making 3 AI companions feel smart is critical and requires extensive iteration. |
| Tabletop transition edge cases | Medium | Table edges, mid-animation interrupts, scale transitions. |
| City scale vs solo dev | Medium | Mitigated by PCG and modular marketplace kits. Key locations hand-crafted, filler procedural. |
| NPC knowledge consistency | Medium | AI must never accidentally reveal gated information. Robust validator testing required. |
| Guided Spirit visual effects | Medium | Two unique manifestation styles with three states each. VFX work is significant. Marketplace effects can help. |

---

## 14. Development Phase Plan

**Assumption**: Solo developer, ~5 hours per week average. Heavy reliance on AI tools (Claude) for code/systems, marketplace for art assets, MetaHuman for characters, Mixamo for animations.

**Total estimated timeline: 3-4 years.**

### Phase 0: Foundation and Learning (3-4 months)

**Goal**: Get comfortable with UE5, build the absolute minimum.

- Work through UE5 tutorial series (modules 1-3 of learning platform)
- Create a flat plane with one character that can move (WASD)
- Implement basic third-person camera
- Set up project structure (folders, naming conventions, source control)
- Create a simple GameState manager (server-authoritative pattern from day one)
- Set up MetaHuman for character prototypes

**Success Criteria**: A character walks around a flat world, and all movement goes through the GameState manager.

### Phase 1: Combat Prototype (5-7 months)

**Goal**: Real-time combat working in a grey-box environment.

- Implement light/heavy attack system with combo chains
- Implement dodge roll with i-frames
- Implement stagger/poise system
- Build 4 ability slots with cooldowns
- Implement 3 abilities for 1 class (Warrior: Power Strike, Shield Bash, Cleave)
- Add 2 enemy types (Goblin melee, Goblin Archer) with basic AI
- Implement environmental kill basics (explosive barrels, cliff knockback)
- Implement party AI (1 preset: Aggressive)
- Implement Tab to switch controlled character
- Grey-box arena for testing

**Success Criteria**: Player can fight goblins in real-time, dodge, use abilities, switch party members, and kick an enemy off a ledge. It feels playable.

### Phase 2: The Tabletop (4-5 months)

**Goal**: The signature feature works.

- Build the tabletop scene with marketplace assets (table, miniatures, lighting, props)
- Implement render-to-texture for the map
- Build the zoom transition (material crossfade, camera descent, audio crossfade)
- Implement tabletop camera controls (pan, zoom, rotate)
- Implement zoom-out (return to tabletop)
- Handle edge cases (table edges, mid-animation interrupts)

**Success Criteria**: Player looks at a tabletop, zooms into a world, fights something, and zooms back out. The transition feels magical.

### Phase 3: RPG Systems (6-8 months)

**Goal**: The game has depth.

- Implement all 4 stats, 5 races, 6 classes
- Implement all abilities for all classes (real-time only)
- Implement subclasses (unlocked at level 5)
- Implement Guided Spirit class with manifestation states
- Build the leveling system and XP curve
- Build the loot system (drops, equipment, inventory)
- Implement the 8 skills and skill checks
- Build the mana/stamina/Spirit Energy systems
- Create the character selection and build screen (pick hero, choose race, choose class, allocate stats)
- Implement party system (up to 4 members) with recruitment events
- Implement all 4 party AI presets
- Implement tactical overlay (hold Alt)

**Success Criteria**: A full party of 4 can be created, leveled, equipped, and played through combat encounters with all abilities working.

### Phase 4: AI Systems (4-6 months)

**Goal**: The AI DM and NPC knowledge system work in both modes.

- Integrate Ollama (HTTP calls from C++ to localhost)
- Build the 4 AI layers (narrative, NPC dialogue, encounters, quests)
- Build the JSON validator (game state safety)
- Implement context window management (4000 token sliding window)
- Build the NPC knowledge card system with trust/reputation gating
- Implement NPC mood system with event-driven shifts
- Build campaign mode (AI adds flavour to scripted content)
- Build freeplay mode (AI drives everything)
- Stress test: what happens when the LLM outputs garbage? Ensure graceful fallbacks.

**Success Criteria**: NPCs share different information based on trust level. The AI DM generates unique dialogue. Freeplay mode produces coherent quests and encounters.

### Phase 5: Content and World Building (8-10 months)

**Goal**: There is a game worth playing.

- Build Phase 1 map areas using marketplace assets and PCG
- Set up PCG rules for Ashenmere city generation
- Design and implement 20+ enemy types (see Bestiary)
- Design 3 boss encounters
- Write the campaign story (Act 1, covering The Dimming)
- Populate the world with NPCs, shops, quest givers (with knowledge cards)
- Build the fog-of-war system on the tabletop
- Implement the save system
- Create character recruitment events for all 6 heroes
- Implement Dual Guided Spirit synergy (The Resonance)

**Success Criteria**: A player can start a new game, pick a hero, build their character, recruit party members, play through Act 1 (3-5 hours of content), and save/load their progress.

### Phase 6: Polish (5-7 months)

**Goal**: It feels like a real game.

- Art pass: final material tuning, lighting per biome, Lumen/Nanite optimization
- Animation pass: unique animations for signature abilities, Mixamo for the rest
- Voice acting: record with friends, integrate into key scenes and combat barks
- Sound design: combat sounds, ambient per biome, music, UI
- UI/UX polish: menus, HUD, tooltips, tutorials
- Performance optimization: profiling, LOD tuning, LLM async verification
- Bug fixing and playtesting
- Difficulty balancing across all 4 settings

**Success Criteria**: A non-developer friend can pick up the game, understand how to play, and enjoy a full session without encountering a game-breaking bug.

---

## 15. Open Questions

These need answers before or during development. Tracked here so they are not forgotten.

1. **Party size**: Is 4 the right number? 3 is simpler for AI, 4 gives more composition variety. Decision needed by Phase 1.
2. **Death and revival**: Permadeath? Unconscious with death saves? Respawn at last rest? Decision needed by Phase 3.
3. **Multiplayer scope**: Each player controls one character? Can players join mid-session? How does the AI DM handle multiple human players? Defer to post-launch.
4. **Modding support**: Can players swap in their own LLM models? Custom classes? Custom enemies? Massive differentiator. Defer to post-launch.
5. **Monetization**: Free? Paid? Early Access? Not a priority now. Defer.
6. **Target hardware**: Minimum spec for running UE5 + Ollama simultaneously? Needs profiling in Phase 0.
7. **Class ability sets**: Full real-time ability lists for all 6 classes need to be designed. Current class-abilities.md has turn-based columns that need removal. Priority for Phase 3.
8. **Vaelen Thresh**: The antagonist needs full character development on par with the heroes. Motivations, personality, how the AI DM portrays him. Priority for Phase 5.
9. **Pip's cosmic thread**: What is the Echo? What existed before the Balance? What is the afterlife battle Pip is being prepared for? These answers shape the endgame. Priority for Phase 5.
10. **NPC voice**: Text-only at launch. When to add TTS? Is typed player input worth the complexity? Evaluate in Phase 4.
11. **Environmental kill expansion**: Current list is a starting point. Full environmental interaction system needs design. Priority for Phase 1.
12. **Corwin's allegiance resolution**: How does the player's trust with Corwin determine his story outcome? Multiple endings per character? Priority for Phase 5.

---

## 16. Asset Strategy

### Sources (Priority Order)

1. **Megascans (Fab)**: Materials, textures, rocks, foliage, surfaces. Free for UE5. Covers 90% of environment materials.
2. **Fab Monthly Freebies**: Claim every month. Accumulate over time.
3. **MetaHuman**: Character faces and bodies. Free tool from Epic.
4. **Mixamo**: Character animations. Free with Adobe account.
5. **Epic Sample Projects**: City Sample, Lyra, Valley of the Ancient. Reusable assets.
6. **Paid Marketplace Kits**: 2-3 key purchases for modular buildings and dungeon pieces. Budget: R1500-R3000 total.
7. **Fab Audio Packs**: Sound effects and ambient audio.

### Asset Tracking

Maintain a spreadsheet logging every asset used: source, license, date claimed/purchased. All Fab/Megascans/Mixamo assets are cleared for commercial use in UE5 with no attribution required.

### Legal Summary

| Source | Commercial Use | Attribution |
|--------|---------------|-------------|
| Fab (purchased or free) | Yes | No |
| Megascans | Yes (UE5 only) | No |
| MetaHuman | Yes (UE5 only) | No |
| Mixamo | Yes | No |
| Epic sample projects | Yes (UE5 only) | No |

---

*This is a living document. Update it as decisions are made and systems evolve.*
