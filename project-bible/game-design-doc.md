# Tabletop Quest: Game Design Document (Living Document)

**Version**: 0.1
**Last Updated**: 2026-03-04
**Engine**: Unreal Engine 5.4+
**Genre**: DnD-Inspired 3D RPG with Tabletop Presentation
**Platform**: PC (Windows/Linux), Console stretch goal
**Players**: Singleplayer (multiplayer in later phases)

---

## 1. High Concept

Tabletop Quest is a DnD-inspired 3D RPG where the player looks down at a literal tabletop covered in miniatures, terrain tiles, and hand-painted maps. When the player selects a location or triggers an encounter, the camera zooms seamlessly into the tabletop, and the miniatures come to life as fully realized 3D characters in a Skyrim/Fable-style explorable world. The game bridges the magic of physical tabletop gaming with the immersion of a modern action RPG.

A local LLM (Ollama) powers an AI Dungeon Master that narrates, improvises, generates quests, and reacts to player choices, all running on the player's own hardware with zero subscriptions or cloud dependencies.

---

## 2. The Three Pillars

These are the three features that define Tabletop Quest and set it apart from every other RPG on the market.

### Pillar 1: The Tabletop Zoom

The player begins every session looking down at a physical tabletop. Painted miniatures, hand-drawn maps, dice, rulebooks, and flickering candlelight fill the scene. This is not a menu or a loading screen. It is the actual game world rendered in miniature. When the player zooms in, the table does not disappear. The camera descends, the edges fade, terrain gains real depth, and miniatures morph into living characters. One world, two scales, zero loading screens.

### Pillar 2: Dual Combat System

Players choose how they fight. Turn-based mode uses initiative order, a grid, and action economy (move, action, bonus action) just like DnD 5e. Real-time mode gives the player direct control of one character while party AI handles the rest, with abilities mapped to cooldowns translated directly from the turn-based rules. The player can switch between modes mid-fight. A careful planner and an action gamer can both enjoy the same encounter.

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
COMBAT (choose turn-based or real-time)
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

## 5. Combat System

### 5.1 Turn-Based Mode

Directly inspired by DnD 5e but simplified.

**Initiative**: At the start of combat, all combatants roll initiative (1d20 + Finesse modifier). Turn order is displayed as a horizontal bar at the top of the screen.

**Action Economy per Turn**:
- 1 Movement (up to movement speed in grid squares)
- 1 Action (attack, cast spell, use item, dash, dodge, help)
- 1 Bonus Action (if an ability grants one)
- 1 Reaction (triggered between turns: opportunity attacks, counterspell, etc.)

**Grid**: Combat takes place on a hex grid overlaid on the world terrain. Each hex = 5 feet. Characters and enemies occupy hexes. Line of sight and cover are calculated from hex centers.

**Attacks**: Roll 1d20 + stat modifier + proficiency vs target Armor Class. Meet or beat = hit. Damage roll based on weapon/ability.

**Conditions**: Stunned (skip turn), Poisoned (-2 to attacks), Blinded (disadvantage on attacks), Frightened (cannot move toward source), Prone (melee advantage, ranged disadvantage), Burning (damage over time), Frozen (half movement), Charmed (cannot attack source).

### 5.2 Real-Time Mode

The player controls one party member directly (WASD movement, mouse aim). The other party members are controlled by party AI with configurable behavior presets (aggressive, defensive, support, follow).

**Ability Mapping**: Every ability that exists in turn-based mode also exists in real-time, translated via this table:

| Turn-Based Concept | Real-Time Translation |
|--------------------|-----------------------|
| 1 Action | 6-second cooldown |
| 1 Bonus Action | 3-second cooldown |
| 1 Reaction | Auto-trigger when conditions met (configurable) |
| Movement 30ft | Base movement speed stat |
| Concentration | Channeled: must hold ability key, interrupted by damage |
| Advantage | +25% hit chance |
| Disadvantage | -25% hit chance |
| Opportunity Attack | Auto-swing when enemy leaves melee range |
| Turn Order | N/A, all simultaneous |

**Real-Time Feel**: The goal is Fable-like responsiveness. Light attacks are fast (0.3s), heavy abilities have wind-up animations (0.5-1.0s), dodge roll on spacebar with 1s cooldown and i-frames.

### 5.3 Switching Mid-Fight

The player presses TAB (default) to switch modes. The transition takes ~1 second:

- **Turn-Based to Real-Time**: Camera pulls back slightly, grid fades, initiative bar slides off screen, all characters unfreeze and begin acting simultaneously. Any unused actions on the current turn are lost.
- **Real-Time to Turn-Based**: All characters freeze, grid appears, initiative is re-rolled based on current positions, camera shifts to isometric. In-progress cooldowns convert to action availability (ability on cooldown = action already used this turn).

### 5.4 Party AI (Real-Time Mode)

Each party member has a behavior preset the player configures outside of combat:

| Preset | Description |
|--------|-------------|
| Aggressive | Focus highest-threat enemy, use offensive abilities on cooldown |
| Defensive | Stay near player, prioritize survival, use defensive abilities |
| Support | Heal/buff allies first, attack only when no one needs help |
| Follow | Stay close to player, attack only player's current target |
| Custom | Player sets priority rules: "If ally below 50% HP, heal. Else, attack nearest enemy." |

Party AI uses a simple Utility AI system: each possible action gets a score based on the current state, and the AI picks the highest-scoring action.

---

## 6. Simplified DnD System

### 6.1 Stats (4 instead of 6)

| Stat | DnD Equivalent | Governs |
|------|---------------|---------|
| Might | Strength + Constitution | Melee damage, HP, carrying capacity, physical saves |
| Finesse | Dexterity | Ranged damage, initiative, dodge, AC (light armor), traps |
| Mind | Intelligence + Wisdom | Spell damage, mana pool, perception, knowledge checks, spell saves |
| Presence | Charisma | Dialogue, party buffs, summon/companion strength, NPC pricing |

**Starting Stats**: 10 points to distribute (each stat starts at 5, range 3-15). Each point above 10 gives +1 modifier. Each point below 10 gives -1 modifier.

**Stat Growth**: +1 stat point every 3 levels (levels 3, 6, 9, 12, 15). Gear can also boost stats.

### 6.2 Races (5)

| Race | Stat Bonus | Passive Ability |
|------|-----------|-----------------|
| Human | +1 to any two stats | Adaptable: +10% XP gain |
| Elf | +2 Finesse | Darkvision: see in dim light, +2 perception at night |
| Dwarf | +2 Might | Stout: poison resistance, +1 AC when wearing heavy armor |
| Halfling | +1 Finesse, +1 Presence | Lucky: reroll natural 1s on attack rolls |
| Orc | +2 Might | Relentless: once per combat, survive a killing blow with 1 HP |

### 6.3 Classes (6)

See the separate Class and Ability Reference document for full details.

| Class | Role | Primary Stat | Armor | Weapons |
|-------|------|-------------|-------|---------|
| Warrior | Tank, Melee DPS | Might | Heavy | Swords, Axes, Maces, Shields |
| Rogue | Melee DPS, Utility | Finesse | Light | Daggers, Shortswords, Crossbows |
| Mage | Ranged DPS, Control | Mind | Cloth | Staves, Wands |
| Cleric | Healer, Support | Mind + Presence | Medium | Maces, Shields, Holy Symbols |
| Ranger | Ranged DPS, Scout | Finesse + Mind | Medium | Bows, Crossbows, Shortswords |
| Bard | Support, Face | Presence | Light | Rapiers, Instruments, Light Crossbows |

### 6.4 Skills (8)

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

### 6.5 Mana System

Instead of spell slots (too complex for a video game), all casters use mana.

- **Base Mana Pool**: 20 + (Mind modifier x 5)
- **Mana Regen**: 2 per turn (turn-based), 2 per 6 seconds (real-time)
- **Mana Potions**: Restore flat amounts (Small: 15, Medium: 30, Large: 50)
- **Ability Costs**: Range from 5 mana (basic spells) to 40 mana (ultimate abilities)
- **Non-Casters**: Warrior, Rogue use stamina (same pool, same math, different name). Some abilities cost stamina.

### 6.6 Leveling

- **Level Cap**: 15
- **XP Curve**: Each level requires (current level x 100) XP. Level 1 to 2 = 100 XP. Level 14 to 15 = 1400 XP. Total XP to max: 10,500.
- **Per Level**: +HP (based on class), +1 mana/stamina, new ability every 2 levels, stat point every 3 levels, subclass at level 5.
- **Party XP**: XP is shared equally among party members. No individual XP.

### 6.7 Equipment Slots

Weapon, Off-hand/Shield, Armor, Helm, Boots, Ring (x2), Amulet, Cloak. Total: 9 slots. See the Loot Tables document for item details.

---

## 7. AI Dungeon Master

### 7.1 Technology

- **Engine**: Ollama (local LLM runtime)
- **Model**: Mistral 7B (minimum), Llama 3 8B (recommended), or any GGUF-compatible model
- **Integration**: UE5 C++ plugin makes HTTP requests to Ollama's local API (localhost:11434)
- **Performance Target**: Response in under 3 seconds on a machine with 16GB RAM

### 7.2 Four AI Layers

| Layer | Input | Output | Frequency |
|-------|-------|--------|-----------|
| Narrative | Player actions, world state summary | Flavor text, scene descriptions, story beats | Every major action |
| NPC Dialogue | NPC profile, conversation history, player reputation | Dialogue lines, tone tags, emotion hints | When player talks to NPC |
| Encounters | Party level, location, time, quest state | Enemy composition, terrain modifiers, encounter type | When entering new area or triggered |
| Quests | Player history, world state, unfulfilled hooks | Quest name, objectives, rewards, NPC involvement | Periodically or when player seeks work |

### 7.3 Safety Architecture

The LLM NEVER modifies game state directly. Instead:

1. LLM receives a context prompt with current game state (JSON summary).
2. LLM outputs a structured JSON response.
3. The Game State Validator (C++ module) checks the JSON against game rules.
4. Valid changes are applied. Invalid changes are discarded and the LLM is re-prompted.

Example flow:
```
LLM Output:
{
  "type": "encounter",
  "enemies": ["orc_warrior", "orc_warrior", "orc_shaman"],
  "difficulty": "medium",
  "terrain_modifier": "rocky_ground",
  "narrative": "The orcs have set up camp near the river crossing. Their shaman chants over a fire."
}

Validator Checks:
- Are these valid enemy IDs? YES
- Is difficulty appropriate for party level? YES (party level 7, 3 enemies = medium)
- Is terrain modifier valid for this biome? YES
- Result: APPLY
```

### 7.4 Context Window Management

- **Sliding Window**: 4000 tokens maximum context per request.
- **Priority Stack** (what stays in context longest):
  1. System prompt with world rules and current game state (always present, ~800 tokens)
  2. Current quest objectives (~200 tokens)
  3. Recent player actions (last 5 actions, ~500 tokens)
  4. Recent NPC interactions (last 3, ~600 tokens)
  5. World state summary (condensed, ~400 tokens)
  6. Historical summary (AI-generated recap of older events, ~500 tokens)
- **Compression**: Every 20 interactions, older context is summarized by the LLM into a ~200 token recap that replaces the raw history.

### 7.5 Campaign Mode vs Freeplay Mode

| Feature | Campaign Mode | Freeplay Mode |
|---------|--------------|---------------|
| Main Story | Hand-authored, scripted | AI-generated |
| Side Quests | Hand-authored + AI embellished | Fully AI-generated |
| NPC Dialogue | AI-generated from author notes | Fully AI-generated |
| Encounters | Pre-designed, AI adds flavor | AI-generated within rules |
| Narration | AI-generated from author prompts | Fully AI-generated |
| World Events | Scripted triggers | AI-driven based on player actions |

---

## 8. Camera Systems

### 8.1 Five Camera Modes

| Mode | Perspective | Controls | When Active |
|------|------------|----------|-------------|
| Tabletop | Top-down, slightly angled (60 degrees) | Pan (WASD/drag), zoom (scroll), rotate (Q/E) | Viewing the tabletop between adventures |
| Exploration | Third-person, behind character | WASD move, mouse look, scroll zoom | Exploring the world after zooming in |
| Turn-Based Combat | Isometric, elevated | Click to select units, WASD pan, scroll zoom | During turn-based combat |
| Real-Time Combat | Over-the-shoulder, tighter | WASD move, mouse aim, scroll zoom | During real-time combat |
| Cinematic | Scripted, varies | None (player watches) | Story moments, boss intros, transitions |

### 8.2 CameraDirector

A single `ACameraDirector` actor manages all transitions. It holds references to all five camera components and blends between them using `FViewTarget` interpolation. Transition durations:

- Tabletop to Exploration: 2.5 seconds (the signature zoom)
- Exploration to Turn-Based: 1.0 second
- Exploration to Real-Time: 0.5 seconds (quick, action-oriented)
- Turn-Based to Real-Time (mid-fight switch): 1.0 second
- Any to Cinematic: 0.5 seconds
- Cinematic back to previous: 0.5 seconds

---

## 9. Save System

### 9.1 Schema

```json
{
  "version": "1.0",
  "timestamp": "2026-03-04T14:30:00Z",
  "playtime_seconds": 7200,

  "party": {
    "members": [
      {
        "name": "Aldric",
        "class": "warrior",
        "subclass": "guardian",
        "race": "human",
        "level": 7,
        "xp": 2800,
        "stats": { "might": 14, "finesse": 8, "mind": 6, "presence": 10 },
        "hp": { "current": 85, "max": 95 },
        "mana": { "current": 20, "max": 25 },
        "abilities": ["power_strike", "shield_bash", "cleave", "battle_cry", "second_wind", "taunt"],
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
    "current_location": "riverdale_village",
    "discovered_locations": ["starting_tavern", "goblin_caves", "riverdale_village"],
    "fog_of_war": {
      "revealed_hexes": [{"q": 0, "r": 0}, {"q": 1, "r": 0}]
    },
    "time_of_day": "afternoon",
    "day_count": 14,
    "weather": "overcast"
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
    "history_summary": "The party cleared the goblin caves and saved the merchant. The village elder hinted at darkness in the northern ruins.",
    "recent_actions": [],
    "npc_relationships": {
      "elder_miriam": {"reputation": 15, "last_interaction": "day_12"},
      "blacksmith_gorak": {"reputation": 5, "last_interaction": "day_10"}
    },
    "generated_quests": [],
    "world_flags": {"goblin_caves_cleared": true, "merchant_saved": true}
  },

  "combat_state": null,

  "settings": {
    "default_combat_mode": "turn_based",
    "party_ai_presets": {
      "member_2": "support",
      "member_3": "aggressive"
    },
    "difficulty": "normal"
  }
}
```

### 9.2 Save Slots

- 3 manual save slots per campaign/freeplay session
- 1 autosave (triggers on: entering new area, completing quest objective, before combat)
- 1 quicksave (F5 save, F9 load)
- Save files stored as compressed JSON (gzip)

---

## 10. Known Blind Spots and Risks

These are the hard problems this project will face. Listing them now so they can be planned for.

| Blind Spot | Risk Level | Notes |
|-----------|-----------|-------|
| Animation count | High | Even with 6 classes and 8-10 abilities each, that is 50+ unique animations. Need a modular animation system, blend spaces, and reuse where possible. Consider Mixamo and retargeting. |
| Pathfinding at two scales | Medium | The tabletop view and world view need separate navmeshes, or a single navmesh that works at both scales. UE5 NavMesh with dynamic modifiers should handle this, but needs testing. |
| Dice rolls in real-time | Medium | Turn-based combat rolls dice naturally. Real-time combat hides the dice but still rolls them under the hood. Need to decide: show damage numbers? Show hit/miss? Show "critical" flash? |
| Networking prep | High | Even though multiplayer is Phase 5+, the architecture must be server-authoritative from the start. All game state changes go through a GameState manager, never directly from input. This adds complexity to Phase 0-1 but saves a rewrite later. |
| UE5 + LLM on consumer hardware | High | Running UE5 at 60fps AND a 7B parameter LLM simultaneously on a mid-range PC. Need to profile early. LLM inference should be async and not block the game thread. Consider offloading to a separate process. |
| Party AI in real-time | Medium | Making 3 AI companions feel smart (not suicidal, not passive) is a known hard problem. Start simple (Utility AI), iterate based on playtesting. |
| Tabletop transition edge cases | Medium | What happens if the player zooms in near the edge of the table? What if an enemy is mid-animation during zoom out? Need graceful handling for all edge cases. |

---

## 11. Difficulty Ratings

How hard each system is to implement, rated 1-10.

| System | Difficulty | Reasoning |
|--------|-----------|-----------|
| Dual Combat (turn-based + real-time + switching) | 9/10 | Two full combat systems that share rules but play completely differently, plus seamless switching. This is the hardest system in the game. |
| Tabletop-to-World Transition | 8/10 | Material crossfade, render-to-texture, camera animation, audio crossfade, and LOD management all in a seamless 2.5 second sequence. Technically complex but well-scoped. |
| AI DM Constraints / Validation | 7/10 | The LLM integration itself is straightforward (HTTP calls). The hard part is making the validator robust enough to catch bad outputs without being so strict it kills creativity. |
| Party AI (Real-Time) | 7/10 | Utility AI with configurable presets. Getting it to feel "smart" requires iteration and playtesting. The Custom preset (player-defined rules) adds UI complexity. |
| Camera Systems | 6/10 | Five cameras with transitions. UE5 has good camera tools, but the tabletop zoom is custom work. The others are standard implementations. |
| Save System | 6/10 | Comprehensive schema with many data types. The AI DM history and world state serialization are the tricky parts. The rest is standard save/load. |
| Animation Blending | 5/10 | Using UE5 Animation Blueprints, blend spaces, and montages. The challenge is volume (50+ abilities) not complexity. Mixamo can help. |
| Performance Optimization | 5/10 | LOD management, render-to-texture performance, LLM inference async handling. Known problems with known solutions, but requires ongoing attention. |

---

## 12. Development Phase Plan

**Assumption**: Solo developer, 8-10 hours per week. Total estimated timeline: 2 to 2.5 years.

### Phase 0: Foundation and Learning (Months 1-3)

**Goal**: Get comfortable with UE5 C++, build the absolute minimum.

- Complete UE5 C++ tutorial series
- Create a flat plane with one character that can move (WASD)
- Implement basic third-person camera
- Set up project structure (folders, naming conventions, source control)
- Create a simple GameState manager (server-authoritative pattern from day one)

**Success Criteria**: A character walks around a flat world, and all movement goes through the GameState manager.

### Phase 1: Core Combat Prototype (Months 4-7)

**Goal**: Both combat modes working in a grey-box environment.

- Implement turn-based combat: initiative, grid overlay, move/action/bonus action
- Implement 3 abilities for 1 class (Warrior: Power Strike, Shield Bash, Cleave)
- Implement real-time combat: direct control, cooldown system, basic dodge
- Implement combat mode switching (TAB key)
- Add 2 enemy types (Goblin melee, Goblin Archer) with basic AI
- Grey-box arena for testing

**Success Criteria**: Player can fight goblins in both modes and switch between them mid-fight. It feels playable, not polished.

### Phase 2: The Tabletop (Months 8-11)

**Goal**: The signature feature works.

- Build the tabletop scene (table, miniatures, lighting, props)
- Implement render-to-texture for the map
- Build the zoom transition (material crossfade, camera descent, audio crossfade)
- Implement tabletop camera controls (pan, zoom, rotate)
- Implement zoom-out (return to tabletop)
- Handle edge cases (table edges, mid-animation interrupts)

**Success Criteria**: Player looks at a tabletop, zooms into a world, fights something, and zooms back out. The transition feels magical.

### Phase 3: RPG Systems (Months 12-16)

**Goal**: The game has depth.

- Implement all 4 stats, 5 races, 6 classes
- Implement all abilities for all classes (50+ abilities)
- Implement subclasses (unlocked at level 5)
- Build the leveling system and XP curve
- Build the loot system (drops, equipment, inventory)
- Implement the 8 skills and skill checks
- Build the mana/stamina system
- Create the character creation screen
- Implement party system (up to 4 members)

**Success Criteria**: A full party of 4 can be created, leveled, equipped, and played through combat encounters with all abilities working.

### Phase 4: AI Dungeon Master (Months 17-20)

**Goal**: The AI DM works in both modes.

- Integrate Ollama (HTTP calls from C++ to localhost)
- Build the 4 AI layers (narrative, NPC dialogue, encounters, quests)
- Build the JSON validator (game state safety)
- Implement context window management (4000 token sliding window)
- Build campaign mode (AI adds flavor to scripted content)
- Build freeplay mode (AI drives everything)
- Stress test: what happens when the LLM outputs garbage? Ensure graceful fallbacks.

**Success Criteria**: In freeplay mode, the AI DM generates a quest, populates enemies, and narrates the encounter. In campaign mode, the AI enriches a scripted scene with unique dialogue.

### Phase 5: Content and World Building (Months 21-24)

**Goal**: There is a game worth playing.

- Build 3-5 distinct biomes/areas on the tabletop map
- Design and implement 20+ enemy types (see Bestiary)
- Design 3 boss encounters with phases
- Write the campaign story (Act 1 at minimum)
- Populate the world with NPCs, shops, quest givers
- Build the fog-of-war system on the tabletop
- Implement the save system

**Success Criteria**: A player can start a new game, create a party, play through Act 1 of the campaign (3-5 hours of content), and save/load their progress.

### Phase 6: Polish and Optimization (Months 25-28)

**Goal**: It feels like a real game.

- Art pass: replace grey-box with real assets
- Animation pass: unique animations for all abilities
- Sound design: combat sounds, ambient, music, UI
- UI/UX polish: menus, HUD, tooltips, tutorials
- Performance optimization: profiling, LOD tuning, LLM async verification
- Bug fixing and playtesting
- Difficulty balancing

**Success Criteria**: A non-developer friend can pick up the game, understand how to play, and enjoy a full session without encountering a game-breaking bug.

---

## 13. Open Questions

These need answers before or during development. Tracked here so they are not forgotten.

1. **Party size**: Is 4 the right number? 3 is simpler for AI, 4 feels more DnD. Decision needed by Phase 1.
2. **Death and revival**: Permadeath? Unconscious with death saves? Respawn at last rest? Decision needed by Phase 3.
3. **Multiplayer scope**: Each player controls one character? Can players join mid-session? How does the AI DM handle multiple human players? Defer to Phase 5+.
4. **Modding support**: Can players swap in their own LLM models? Custom classes? Custom enemies? This could be a massive differentiator. Defer to post-launch.
5. **Monetization**: Free? Paid? Early Access? Not a priority now, but the decision affects scope. Defer.
6. **Target hardware**: What is the minimum spec for running UE5 + Ollama simultaneously? Needs profiling in Phase 0.

---

*This is a living document. Update it as decisions are made and systems evolve.*
