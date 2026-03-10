# Module 04: Exercises - Combat System

These exercises build the Tabletop Quest combat system piece by piece. Complete them in order, as each one builds on the previous. By the end, you will have a playable dual-mode combat prototype.

---

## Exercise 1: Build the Combat Manager

**Goal**: Create the central combat management subsystem that orchestrates all combat flow.

### Steps

1. Open your TabletopCombat plugin (created in Module 03, Exercise 7). If you have not created it yet, create the plugin now.
2. Verify your Build.cs includes dependencies: `"Core", "CoreUObject", "Engine", "TabletopCore", "TabletopDice", "TabletopStats"`.
3. Ask Claude to generate the `UCombatManagerSubsystem` using the full prompt from the lesson (the large prompt in Part 1 that specifies FCombatantData, FStatusEffectInstance, all functions, and all delegates).
4. Paste the .h and .cpp files into Public/ and Private/.
5. Compile.
6. Create a test Blueprint Actor called `BP_CombatTest`. In BeginPlay:
   - Create 2 FCombatantData structs: a Warrior (HP 45, Might 16, Finesse 10, AC 18) and a Goblin (HP 8, Might 8, Finesse 14, AC 13)
   - Call StartCombat with both combatants
   - Print the turn order (who goes first based on initiative)
   - Call AdvanceTurn twice to cycle through both turns
   - Call EndCombat

### Verification

- StartCombat rolls initiative for both combatants (visible in the output log)
- GetTurnOrder returns them sorted by initiative
- OnTurnChanged fires with the correct combatant each time
- OnRoundChanged fires when the second turn wraps to a new round
- EndCombat resets all state

---

## Exercise 2: Implement the Ability Data Assets

**Goal**: Create a data-driven ability system where each ability is defined as an editor asset.

### Steps

1. Ask Claude to generate the `UAbilityDataAsset` class (from Part 2 of the lesson) along with any supporting enums it needs:
   - `EAbilityTarget`: Self, SingleEnemy, SingleAlly, AllEnemies, AllAllies, AreaOfEffect
   - `EAbilityScaling`: Might, Finesse, Mind, Presence

2. Compile the plugin.

3. In the Content Browser, create a folder: `Content/Data/Abilities/Warrior/`.

4. Create Data Assets for the first 4 Warrior abilities:

| Ability | Dice | Sides | Type | Multiplier | Cost | Action Type | Cooldown | Cast Time |
|---------|------|-------|------|-----------|------|-------------|----------|-----------|
| Power Strike | 1 | 10 | Physical | 1.5 | 10 Stamina | Action | 6s | 0.5s |
| Shield Bash | 1 | 6 | Physical | 0.75 | 8 Stamina | Action | 8s | 0.3s |
| Cleave | 1 | 8 | Physical | 1.0 | 12 Stamina | Action | 10s | 0.6s |
| Battle Cry | 0 | 0 | N/A | N/A | 15 Stamina | Bonus Action | 20s | 0.0s |

5. Create Data Assets for 2 Mage abilities:

| Ability | Dice | Sides | Type | Multiplier | Cost | Action Type | Cooldown | Cast Time |
|---------|------|-------|------|-----------|------|-------------|----------|-----------|
| Fireball | 8 | 6 | Fire | 1.0 | 30 Mana | Action | 15s | 1.0s |
| Frost Ray | 3 | 8 | Ice | 1.0 | 15 Mana | Action | 8s | 0.5s |

6. Set Shield Bash's `AppliedEffect` to Stunned with EffectDuration = 1.
7. Set Frost Ray's `AppliedEffect` to Frozen with EffectDuration = 1.

### Verification

- Each Data Asset opens in the editor and shows all properties organized by category.
- The dropdown menus for DamageType, TargetType, and ScalingStat display the correct enum values.
- You can modify values and save without compiling.
- Create a quick test: load an AbilityDataAsset in a Blueprint and print its AbilityName and StaminaCost to verify the data loads correctly.

---

## Exercise 3: Build the Ability Execution Pipeline

**Goal**: Create the Blueprint function that validates, costs, and resolves abilities.

### Steps

1. Create a new Blueprint Function Library called `BPL_CombatActions` (or add functions to your combat Blueprint).

2. Create a function called `ExecuteAbility` with inputs:
   - AbilityData (UAbilityDataAsset reference)
   - UserIndex (int32, index into the Combatants array)
   - TargetIndex (int32, target combatant index)

3. Implement the full execution pipeline from the lesson:

   **Validation:**
   - Check ActionPointsRemaining > 0 (if ability costs Action) or BonusActionAvailable (if Bonus)
   - Check Mana >= ManaCost or Stamina >= StaminaCost
   - Check combatant is not Stunned
   - If any check fails: print why and return false

   **Pay Costs:**
   - Call UseActionPoint() or UseBonusAction()
   - Subtract ManaCost from CurrentMana or StaminaCost from CurrentStamina

   **Attack Roll (if bUsesAttackRoll):**
   - Get the DiceRoller subsystem
   - Roll 1d20 + GetAbilityModifier(scaling stat)
   - Get target's ArmorClass
   - Call DoesAttackHit
   - On natural 1: auto-miss
   - On natural 20: mark as critical hit

   **Damage Calculation:**
   - Roll DamageDiceCount d DamageDiceSides
   - Multiply by DamageMultiplier
   - Add ability modifier
   - If critical: double the dice portion
   - Call StatCalculator.CalculateDamage with target resistances/vulnerabilities

   **Apply Results:**
   - Call CombatManager.ApplyDamage
   - If ability has a status effect: call ApplyStatusEffect
   - Return true

4. Test with the Warrior vs. Goblin scenario from Exercise 1.

### Verification

- Power Strike against a Goblin (AC 13) hits most of the time (d20+3 needs 10+)
- Damage values are in the correct range (1d10 * 1.5 + 3 = 4-18 Physical)
- Shield Bash applies the Stunned effect when it hits
- Abilities that cost more Mana/Stamina than the combatant has are rejected
- A Stunned combatant cannot use abilities (validation fails)

---

## Exercise 4: Build the Status Effect System

**Goal**: Implement status effects that tick each turn and modify combat behavior.

### Steps

1. Create a Blueprint function called `ProcessTurnStartEffects` that takes a CombatantIndex.

2. For each active status effect on the combatant:
   - **Burning**: Roll 1d6, apply as Fire damage, print "{Name} burns for {N} damage!"
   - **Poisoned**: Apply DamagePerTurn as Poison damage, print "{Name} takes {N} poison damage!"
   - **Blessed**: Set a flag that gives +1d4 to attack rolls this turn
   - **Hasted**: Grant an extra Action Point this turn
   - Decrement TurnsRemaining
   - Remove effects with TurnsRemaining <= 0

3. Create a function called `CheckSkipTurn` that returns true if the combatant has Stunned or Frozen:
   - If true: print "{Name} is {effect} and cannot act!"
   - Process effects even on skipped turns (DoTs still tick)

4. Integrate both functions into your combat loop:
   - At the start of each turn: call ProcessTurnStartEffects, then CheckSkipTurn
   - If CheckSkipTurn returns true: skip the action phase, call AdvanceTurn

5. Test scenario:
   - Warrior uses Shield Bash on Goblin (applies Stunned for 1 turn)
   - On the Goblin's turn, it should be skipped
   - The Stunned effect should be removed at the end of the skipped turn
   - On the Goblin's next turn, it should act normally

### Verification

- Stunned combatants lose their turn
- Burning combatants take fire damage each turn
- Effects with duration 0 are removed
- DoTs still tick on stunned/frozen combatants
- Blessed combatants get the d4 bonus on attack rolls
- Hasted combatants get an extra Action Point

---

## Exercise 5: Build the Turn-Based UI

**Goal**: Create the visual interface for turn-based combat.

### Steps

1. Create a Widget Blueprint called `WBP_CombatHUD`.

2. **Turn Order Bar** (top of screen):
   - Horizontal Box with character portraits
   - Create a sub-widget `WBP_TurnPortrait` with:
     - Image (character portrait, 64x64)
     - Text (character name)
     - Progress Bar (HP, below portrait)
     - Border (highlight color for active combatant)
   - Bind to `OnTurnChanged` to update the highlight
   - Bind to `OnCombatantDied` to grey out dead portraits

3. **Action Menu** (center-left, shown on player turns):
   - Vertical Box with ability buttons
   - Each button shows: ability name, cost type, resource cost
   - Grey out abilities the player cannot afford
   - When clicked: enter targeting mode

4. **Combat Log** (bottom of screen):
   - Scrolling text box
   - Bind to OnDamageDealt, OnCombatantDied, OnTurnChanged, OnRoundChanged
   - Format each event as a readable combat narration line

5. **Target Indicator**:
   - When in targeting mode, highlight valid targets with a glow or outline
   - On click: execute the ability against the selected target
   - On right-click or Escape: cancel targeting

6. Add the HUD to your test level via the Player Controller or Game Mode.

### Verification

- Turn Order Bar updates correctly as turns advance
- Dead combatants appear greyed out
- Action Menu only shows on player-controlled turns
- Unaffordable abilities are greyed out but visible
- Targeting mode highlights only valid targets (within range, correct target type)
- Combat Log shows all events in readable format
- The entire HUD disappears when combat ends

---

## Exercise 6: Implement the Dual Combat Mode Switch

**Goal**: Build the mode-switching system that converts between turn-based and real-time mid-fight.

### Steps

1. Add a key binding (F key recommended) that calls `SwitchCombatMode` on the Combat Manager.

2. Implement the conversion logic:

   **Turn-Based to Real-Time:**
   - For each combatant's abilities: if used this turn, set cooldown to CooldownSeconds. If not, set cooldown to 0.
   - For each status effect: convert TurnsRemaining to seconds (TurnsRemaining * 6.0)
   - Disable the initiative turn order
   - Enable ability cooldown ticking (per frame)
   - Change camera to third-person

   **Real-Time to Turn-Based:**
   - For each ability: convert CooldownRemaining to turns (CooldownRemaining / 6.0, round up)
   - For each status effect: convert seconds back to turns (SecondsRemaining / 6.0, round up)
   - Re-roll initiative for all combatants
   - Restore action economy (1 Action, 1 Bonus Action, full movement)
   - Change camera to tactical top-down

3. Bind to `OnCombatModeChanged` in the UI to swap between:
   - Turn-Based: Action Menu + Turn Order Bar
   - Real-Time: Ability Hotbar + Cooldown Indicators

4. Test by starting combat in turn-based mode, playing a few turns, pressing F to switch to real-time, fighting for 10-15 seconds, then pressing F to switch back.

### Verification

- Cooldowns convert correctly (an ability just used on full cooldown in real-time becomes unavailable for 1 turn when switching to turn-based)
- Status effect durations convert correctly in both directions
- The UI swaps completely between modes
- No data is lost during the switch (HP, Mana, Stamina persist)
- The switch feels smooth (1-2 second transition with camera movement)

---

## Exercise 7: Build a Complete Test Encounter

**Goal**: Set up and play through a full combat encounter that tests every system.

### Steps

1. Create a test level called `L_CombatArena`.

2. Place 3 player characters:
   - Warrior: Might 16, Finesse 10, Mind 8, Presence 12, HP 45, AC 18, Stamina 40
   - Rogue: Might 10, Finesse 18, Mind 12, Presence 14, HP 28, AC 15, Stamina 35
   - Mage: Might 8, Finesse 12, Mind 18, Presence 10, HP 22, AC 11, Mana 60

3. Place 4 enemies:
   - 2 Goblins: HP 8, AC 13, Finesse 14, Vulnerable to Fire
   - 1 Skeleton Warrior: HP 13, AC 15, Might 12, Resistant to Physical, Vulnerable to Holy
   - 1 Goblin Shaman: HP 10, AC 12, Mind 14, can cast Burning (1d6/turn for 3 turns)

4. Play through the encounter in turn-based mode:
   - Rogue should go first (highest Finesse modifier for initiative)
   - Mage should use Fireball on Goblins for double damage (vulnerability)
   - Warrior should use Cleave against adjacent enemies
   - Goblin Shaman applies Burning to a party member
   - Track HP changes, status effects, turn order

5. Mid-fight, switch to real-time mode:
   - Control the Warrior directly
   - Watch the Rogue and Mage AI act on their own
   - Use abilities with cooldowns
   - Switch back to turn-based after 15 seconds

6. Finish the encounter and verify:
   - XP is awarded correctly (sum of all enemy XP / surviving party members)
   - All status effects are cleared after combat ends
   - Combat Manager reports bIsInCombat = false

### Verification

- Initiative order makes sense (high Finesse characters go first)
- Fireball deals double damage to Goblins (Fire vulnerability)
- Physical attacks deal half damage to Skeleton Warrior (resistance)
- Burning ticks for 1d6 fire damage each turn on the affected character
- Mode switching preserves all combat state
- Real-time cooldowns function correctly
- Post-combat XP is divided correctly

---

## Exercise 8: Combat Balance Testing with Python

**Goal**: Use Python simulation to verify your encounter balance before building more encounters.

### Steps

1. Ask Claude to write a Python combat simulator that:
   - Takes party stats and enemy stats as input
   - Simulates N combats using the same formulas (d20 + mod vs AC, damage dice, resistances)
   - Tracks: win rate, average rounds, average HP remaining, most common cause of loss

2. Run simulations for these encounters:

| Encounter | Party Level | Enemies | Target Win Rate |
|-----------|-------------|---------|----------------|
| Goblin Ambush | 1 | 4 Goblins | 85-95% |
| Skeleton Patrol | 2 | 2 Skeleton Warriors | 70-85% |
| Shaman's Lair | 3 | 2 Goblins + 1 Shaman + 1 Orc | 60-75% |
| Dragon's Den | 5 | 1 Ancient Dragon | 40-60% (boss fight) |

3. Adjust enemy stats until each encounter falls within its target win rate.

4. Document the final balanced stats and save them as Data Assets in the editor.

### Verification

- Each simulation runs 1000+ iterations
- Win rates fall within target ranges
- Average rounds feel right (2-4 for easy, 5-8 for hard, 10+ for boss)
- The Dragon fight is winnable but challenging (should feel like a real boss encounter)
- Balanced stats are saved as Data Assets and work correctly in the actual combat system

### Bonus Challenge

Add mode-switching to the simulator: simulate fights where the player switches from turn-based to real-time at round 3. Compare win rates against pure turn-based and pure real-time to see if mode switching is advantageous (it should be roughly neutral, giving the player choice without a power advantage).
