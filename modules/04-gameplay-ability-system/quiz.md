# Module 04: Quiz - Combat System

Test your understanding of the Tabletop Quest dual combat system. Try to answer each question before checking the answer key at the bottom.

---

### Question 1 (Multiple Choice)

In the Tabletop Quest combat architecture, what is the role of the Combat Manager?

A) It controls individual character animations and movement
B) It is the central coordinator that manages turn order, combat state, and delegates events to other systems
C) It calculates all damage and applies it directly to combatants
D) It handles the UI display and user input for combat

---

### Question 2 (Short Answer)

The Warrior uses Power Strike against a Skeleton Warrior. Power Strike deals 1d10 Physical damage at 1.5x multiplier. The Warrior's Might modifier is +3. The Skeleton Warrior is resistant to Physical damage. If the damage roll is 8, what is the final damage dealt? Show your work.

---

### Question 3 (Multiple Choice)

Why do we use Data Assets for abilities instead of hardcoding them in Blueprints or C++?

A) Data Assets are faster to execute at runtime
B) Data Assets allow you to define, modify, and balance abilities in the editor without recompiling code
C) Data Assets automatically generate UI elements for each ability
D) Data Assets are required by the Gameplay Ability System

---

### Question 4 (Short Answer)

When the player switches from turn-based to real-time mode, how are ability cooldowns handled? What about status effect durations?

---

### Question 5 (Multiple Choice)

A combatant has the Stunned status effect. At the start of their turn, what happens?

A) They take damage equal to the stun's DamagePerTurn, then act normally
B) Their turn is skipped entirely, status effects still tick, and TurnsRemaining decreases
C) They can only move but cannot use abilities
D) The stun is removed and they act normally this turn

---

### Question 6 (Short Answer)

The Mage casts Fireball (8d6 Fire damage) on a group that includes a Goblin (vulnerable to Fire) and a Skeleton Warrior (resistant to Physical, vulnerable to Holy). Assuming the Fireball deals 30 raw Fire damage, what is the final damage to each target?

---

### Question 7 (Multiple Choice)

In the action economy of turn-based combat, which of these is correct?

A) A combatant gets 2 Actions, 1 Bonus Action, and unlimited movement per turn
B) A combatant gets 1 Action, 1 Bonus Action, and 30 feet of movement per turn
C) A combatant gets unlimited Actions but limited Mana/Stamina per turn
D) A combatant gets 1 Action per round, shared across all party members

---

### Question 8 (Short Answer)

Explain why the Combat Manager uses delegates (like OnTurnChanged, OnCombatModeChanged, OnDamageDealt) instead of directly calling UI functions. What design benefit does this provide?

---

### Question 9 (Multiple Choice)

In real-time combat mode, what replaces the Action Point system from turn-based mode?

A) A stamina regeneration system where abilities cost more stamina
B) Cooldown timers where each ability has a seconds-based cooldown between uses
C) A combo system where abilities chain together automatically
D) A shared party resource pool that depletes as anyone uses abilities

---

### Question 10 (Short Answer)

Your party of 3 (Warrior, Rogue, Mage) defeats 2 Goblins (25 XP each), 1 Skeleton Warrior (50 XP), and 1 Goblin Shaman (75 XP). The Rogue died during the fight. How much XP does each surviving party member receive? Show the calculation.

---

## Answer Key

### Answer 1: B

The Combat Manager is the central coordinator. It tracks who is in combat, whose turn it is, what round it is, and what mode (turn-based or real-time) is active. It delegates to other systems: the Ability System handles individual ability execution, the Stat Calculator handles math, the UI handles display, and the Dice Roller handles randomness. The Combat Manager orchestrates the flow between all of these.

### Answer 2

Step by step:
1. Base roll: 8 (1d10)
2. Damage multiplier: 8 * 1.5 = 12
3. Ability modifier: 12 + 3 = 15
4. Raw damage: 15
5. Resistance check: Skeleton Warrior resists Physical, so halve: 15 / 2 = 7.5, round down to 7
6. **Final damage: 7**

The Warrior's physical attacks are partially wasted against skeletons. A better choice would be the Cleric's Holy damage (which the Skeleton is vulnerable to) or the Mage's Fire damage (which is not resisted).

### Answer 3: B

Data Assets let you define ability stats (damage dice, cost, cooldown, damage type, status effects) in the editor as editable asset files. You can tweak a Fireball from 8d6 to 6d8 damage, change its mana cost from 30 to 25, or adjust its cooldown from 15s to 12s, all without recompiling any code. This makes balance iteration fast and accessible.

### Answer 4

**Cooldowns**: Each ability's `CooldownSeconds` value activates. If an ability was used this turn, it starts on full cooldown. If it was not used, its cooldown starts at 0 (immediately available).

**Status effect durations**: Convert from turns to seconds using the formula: seconds = turns * 6.0 (since one turn roughly equals 6 seconds of real-time gameplay). So "Stunned for 2 turns" becomes "Stunned for 12 seconds."

When switching back to turn-based, the conversions reverse: remaining cooldown seconds divide by 6 (round up) to get turns remaining.

### Answer 5: B

The combatant's turn is skipped entirely. They cannot take any actions, use abilities, or move. Status effects still tick during the skipped turn (DoTs still deal damage, durations still count down). The Stunned effect's TurnsRemaining decreases by 1. If it reaches 0, the stun is removed and the combatant will act normally on their next turn.

### Answer 6

**Goblin**: The Goblin is vulnerable to Fire. Raw 30 Fire damage doubled = **60 damage**. (The Goblin has 8 HP and is very dead.)

**Skeleton Warrior**: The Skeleton resists Physical but Fireball deals Fire damage, not Physical. The Skeleton is vulnerable to Holy, not Fire. Since the Skeleton has no resistance to Fire and no vulnerability to Fire, it takes the full raw damage = **30 damage**. (The Skeleton has 13 HP and is also dead.)

The key insight: resistances and vulnerabilities are type-specific. The Skeleton's Physical resistance does not help against Fire.

### Answer 7: B

Each turn in DnD 5e (and Tabletop Quest's turn-based mode) gives the combatant: 1 Action (for main abilities like Power Strike, Fireball), 1 Bonus Action (for quick abilities like Battle Cry, Second Wind), and 30 feet of movement (equivalent to 6 hexes on the grid). The Hasted status effect can grant an extra Action Point.

### Answer 8

Delegates decouple the Combat Manager from all other systems. The Combat Manager does not know (or care) that a UI exists, or what camera angle is active, or whether a sound effect should play. It just broadcasts "this event happened" and any number of listeners can react independently.

This provides three key benefits:
1. **Modularity**: The UI, camera, audio, and AI systems can be built, tested, and modified independently.
2. **Extensibility**: Adding a new reaction (like screen shake on critical hits) just means subscribing a new Blueprint to the existing delegate. No changes to the Combat Manager needed.
3. **Mode switching**: When switching between turn-based and real-time, different UI Blueprints subscribe to the same delegates but display information differently. The Combat Manager does not need separate code paths for each mode's UI.

### Answer 9: B

In real-time mode, the Action Point / Bonus Action system is replaced by per-ability cooldown timers. Each ability has a `CooldownSeconds` value (e.g., Power Strike = 6s, Fireball = 15s). After using an ability, it goes on cooldown and cannot be used again until the timer reaches 0. Mana and Stamina costs still apply. This gives real-time combat a rhythm: use your abilities, wait for cooldowns, use them again.

### Answer 10

Total enemy XP:
- 2 Goblins: 2 * 25 = 50 XP
- 1 Skeleton Warrior: 50 XP
- 1 Goblin Shaman: 75 XP
- **Total: 175 XP**

Surviving party members: Warrior and Mage (Rogue died).

XP per surviving member: 175 / 2 = **87 XP each** (round down to 87).

The Rogue receives 0 XP (dead characters do not earn XP in this system, though you could house-rule this differently). This creates an interesting tactical incentive: keeping everyone alive means less XP per person, but losing a party member means that character falls behind in progression.
