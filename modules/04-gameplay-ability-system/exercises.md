# Module 04: Exercises - Gameplay Ability System

## Exercise 1: Setting Up GAS on Your Character

**Objective:** Get the Gameplay Ability System running on your player character with a full attribute set.

**Steps:**

1. Add the required modules to your project's `.Build.cs` file: `GameplayAbilities`, `GameplayTags`, `GameplayTasks`.

2. Create a new C++ class `UTQAttributeSet` that extends `UAttributeSet`. Add the following attributes, each with the `ATTRIBUTE_ACCESSORS` macro:
   - Health, MaxHealth
   - Mana, MaxMana
   - Might, Finesse, Mind, Presence
   - Armor
   - IncomingDamage (meta attribute)

3. Override `PreAttributeChange` to clamp Health between 0 and MaxHealth, and Mana between 0 and MaxMana.

4. Create or modify your character class to implement the `IAbilitySystemInterface` interface.

5. Add an `UAbilitySystemComponent` and your `UTQAttributeSet` as default subobjects in the character constructor.

6. Implement `GetAbilitySystemComponent()` to return your ASC.

7. Create a default Gameplay Effect (Blueprint or C++) that initialises your attributes:
   - Health: 100, MaxHealth: 100
   - Mana: 50, MaxMana: 50
   - Might: 12, Finesse: 10, Mind: 14, Presence: 8
   - Armor: 5

8. Apply the initialisation effect in `BeginPlay` or `PossessedBy`.

**Verification:**
- Print attribute values to the screen using `GEngine->AddOnScreenDebugMessage` or a UMG widget
- Confirm all attributes are set to their initial values when the game starts
- Change an attribute value at runtime via a test Gameplay Effect and confirm the change is reflected

**Stretch Goal:** Create a simple HUD widget that displays Health and Mana bars, bound to the attribute values on the ASC.

---

## Exercise 2: Create a Melee Attack Ability

**Objective:** Build your first Gameplay Ability: a basic melee attack with animation, hit detection, and damage application.

**Steps:**

1. Create a new C++ class `UGA_MeleeAttack` extending `UGameplayAbility`.

2. Set default tags in the constructor:
   - `AbilityTags`: `Ability.Type.MeleeAttack`
   - `BlockAbilitiesWithTag`: `Ability.Type.MeleeAttack` (prevents spamming)
   - `ActivationBlockedTags`: `Character.State.Stunned`, `Character.State.Dead`

3. Override `ActivateAbility`:
   - Use `UAbilityTask_PlayMontageAndWait` to play an attack animation montage
   - Bind the `OnCompleted` and `OnCancelled` delegates
   - In both callbacks, call `EndAbility`

4. Create a melee hit detection system. Choose one approach:
   - **Anim Notify approach:** Add an AnimNotify to your attack montage at the damage frame. In the notify, perform a sphere trace in front of the character, collect hit actors, and send a Gameplay Event with the hit data.
   - **Ability Task approach:** Create a custom AbilityTask that enables a hit detection collision volume on the weapon during the swing window.

5. Create an instant Gameplay Effect for the melee damage:
   - Target attribute: `IncomingDamage`
   - Magnitude: Use a custom MMC that reads the attacker's Might attribute
   - Formula: `BaseDamage (5) + Might * 0.8`
   - Asset tag: `Damage.Type.Slashing`

6. When a hit is detected, apply the damage effect to the hit actor's ASC.

**Verification:**
- Your character plays the attack animation when the ability activates
- A hit target receives damage (visible in attribute debug output)
- The ability cannot activate while stunned
- The ability cannot be activated twice simultaneously
- The ability properly ends after the montage completes or is interrupted

**Stretch Goal:** Add a Gameplay Cue (`GameplayCue.Ability.MeleeAttack.Impact`) that spawns a hit particle and plays an impact sound at the hit location.

---

## Exercise 3: Apply a Damage Effect with the Full Pipeline

**Objective:** Build the complete damage processing pipeline so that incoming damage flows through armor reduction, resistance checks, and death detection.

**Steps:**

1. Implement `PostGameplayEffectExecute` in your `UTQAttributeSet`:
   - Check if the modified attribute is `IncomingDamage`
   - Read the raw damage value
   - Reset `IncomingDamage` to 0 (it is a meta attribute, always reset after reading)
   - Calculate armor reduction: `FinalDamage = RawDamage - (Armor * 0.5)`, minimum 1 damage
   - Subtract `FinalDamage` from `Health`
   - Clamp `Health` to a minimum of 0

2. Add death detection:
   - If `Health` reaches 0, send a Gameplay Event with tag `Character.Event.Death`
   - Add the tag `Character.State.Dead` to the actor's ASC
   - Optionally: create a `UGA_Death` ability that triggers on the death event and plays a death animation

3. Create a test scenario:
   - Spawn an enemy with 50 Health and 10 Armor
   - Attack the enemy with your melee attack (which should deal `5 + Might * 0.8` damage)
   - Observe the damage reduction from armor
   - Keep attacking until the enemy reaches 0 Health

4. Add damage type awareness:
   - Check the Gameplay Effect's asset tags for `Damage.Type.*`
   - If the target has a matching immunity tag (e.g., `Character.Immunity.Fire`), reduce damage to 0
   - If the target has a resistance tag (e.g., `Character.Resistance.Slashing`), reduce damage by 50%

**Verification:**
- Raw damage is correctly reduced by armor
- Minimum 1 damage always applies (no negative damage from high armor)
- Death event fires when health reaches 0
- Damage type immunities and resistances work correctly
- Health never drops below 0

**Stretch Goal:** Add a damage numbers widget that floats above the target showing the final damage dealt, colour-coded by damage type (red for fire, blue for cold, white for physical).

---

## Exercise 4: Create a Buff with Duration

**Objective:** Build a "Battle Cry" ability that grants a temporary buff to nearby allies, demonstrating duration-based Gameplay Effects and area-of-effect targeting.

**Steps:**

1. Create a new ability: `UGA_BattleCry`
   - Cost: 15 Mana (create a cost Gameplay Effect)
   - Cooldown: 30 seconds (create a cooldown Gameplay Effect with tag `Ability.Cooldown.BattleCry`)
   - Required tags: `Character.State.Alive`
   - Blocked tags: `Character.State.Stunned`, `Character.State.Silenced`

2. Create the buff Gameplay Effect: `GE_BattleCryBuff`
   - Duration: 10 seconds
   - Modifiers:
     - Might: +5 (Additive)
     - Armor: +3 (Additive)
   - Tags granted to target: `Character.Status.Inspired`
   - Stacking: Does not stack with itself (re-application refreshes duration)

3. In `ActivateAbility`:
   - Play a battle cry animation montage
   - At the right moment, perform a sphere overlap to find all allied actors within a 500-unit radius
   - Apply `GE_BattleCryBuff` to each allied actor's ASC (including the caster)
   - Trigger a Gameplay Cue (`GameplayCue.Ability.BattleCry`) for a shout sound and visual pulse

4. Create the Gameplay Cue:
   - On the caster: play a radial shockwave particle effect and a battle cry sound
   - On each buffed ally: attach a golden glow effect that persists for the buff duration (use `GameplayCueNotify_Actor`)

5. Verify the buff expires correctly:
   - After 10 seconds, Might and Armor should return to their original values
   - The `Character.Status.Inspired` tag should be removed
   - The golden glow Gameplay Cue Actor should be destroyed

**Verification:**
- Mana is deducted when the ability activates
- The ability goes on cooldown and cannot be reactivated for 30 seconds
- All allies within range receive the buff
- Attribute values increase by the correct amounts during the buff
- Attributes return to normal after the buff expires
- Re-casting while the buff is active refreshes the duration rather than stacking
- The ability fails gracefully if the character lacks sufficient Mana

**Stretch Goal:** Add a UI indicator showing active buffs on each character, with a countdown timer showing remaining duration.

---

## Exercise 5: Build a Basic Turn-Based Combat Loop

**Objective:** Create a turn-based combat manager that works with GAS to control ability activation, action economy, and turn flow.

**Steps:**

1. Create an `ATurnManager` actor class with the following properties:
   - `TArray<ATQCharacterBase*> TurnOrder`: sorted list of combatants
   - `int32 CurrentTurnIndex`: which character is active
   - `bool bCombatActive`: whether combat is in progress

2. Add an `ActionPoints` attribute to your Attribute Set:
   - MaxActionPoints: 3 per turn
   - Each ability has an action point cost (melee attack = 1, spell = 2, item = 1)

3. Implement the turn flow:
   ```
   StartCombat()
       -> Sort TurnOrder by Finesse (initiative)
       -> StartNextTurn()

   StartNextTurn()
       -> Grant "Character.State.ActiveTurn" tag to current character
       -> Reset ActionPoints to MaxActionPoints via Gameplay Effect
       -> Enable ability activation for this character
       -> If AI-controlled, trigger AI decision-making
       -> Broadcast OnTurnStarted delegate

   OnAbilityUsed()  // Called after any ability ends
       -> Deduct action point cost
       -> If ActionPoints <= 0, call EndCurrentTurn()
       -> Otherwise, wait for next ability activation

   EndCurrentTurn()
       -> Remove "Character.State.ActiveTurn" tag
       -> Process end-of-turn effects (poison ticks, regeneration)
       -> Advance CurrentTurnIndex (wrap around)
       -> Check for combat end conditions (all enemies dead, all players dead)
       -> If combat continues, StartNextTurn()
   ```

4. Modify your abilities to respect the turn system:
   - Add an action point cost to each ability (store as a UPROPERTY on the ability class)
   - In `CanActivateAbility`, verify that the character has `Character.State.ActiveTurn` and enough ActionPoints
   - After `EndAbility`, notify the Turn Manager

5. Create an "End Turn" ability:
   - Costs 0 action points
   - Simply calls `EndCurrentTurn()` on the Turn Manager
   - Allows players to voluntarily end their turn early

6. Set up a test combat:
   - 2 player characters and 2 enemy characters
   - Player characters use abilities via input
   - Enemy characters use abilities via a simple priority list (attack the lowest-health player)
   - Combat ends when all enemies or all players reach 0 Health

**Verification:**
- Characters take turns in initiative order (highest Finesse goes first)
- Each character gets 3 action points per turn
- Abilities correctly deduct action points
- Characters cannot use abilities outside their turn
- End-of-turn effects (poison, regeneration) process correctly
- Combat ends when one side is eliminated
- The turn indicator visually highlights the active character

**Stretch Goal:** Add a turn timeline UI that shows the upcoming turn order, similar to Final Fantasy X's CTB system. Characters with higher Finesse should appear more frequently in the timeline.
