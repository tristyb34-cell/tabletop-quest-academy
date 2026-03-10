# Module 04: Building the Combat System

## Time to Fight

Everything you have built so far, the dice roller, the stat calculator, the initiative tracker, the foundation types, has been building toward this moment. Module 04 is where Tabletop Quest gets its combat system. Not a theoretical one. Not a diagram on a whiteboard. A real, playable, dual-mode combat system where the player can switch between turn-based and real-time combat mid-fight.

This is the second pillar of Tabletop Quest: the Dual Combat System. Turn-based mode uses initiative order, a grid, and action economy (move, action, bonus action) just like DnD 5e. Real-time mode gives the player direct control of one character while party AI handles the rest, with abilities mapped to cooldowns. The player can switch between modes at any time during a fight. A careful planner and an action gamer can both enjoy the same encounter.

By the end of this module, you will have built all of this in Blueprints, with Claude-generated C++ helpers handling the heavy math and data management underneath.

---

## The Architecture: How Combat Systems Work

Before building anything, you need a mental model of how combat systems are structured. Think of a combat system like a stage play with a very strict director.

### The Director: Combat Manager

The Combat Manager is the central coordinator. It knows who is in the fight, whose turn it is, what phase of combat you are in, and what rules apply. It does not know the details of any specific ability or character. It just manages flow.

Think of it like a DM at a tabletop game. The DM does not play any character. The DM says "it is your turn," "roll for initiative," "that enemy is dead, remove it from the board," and "combat is over." The Combat Manager does the same thing in code.

### The Actors: Combatants

Each combatant (player character, enemy, summon, destructible object) has a combat component that tracks its state: current HP, active status effects, action points remaining, position on the grid. The combatant does not decide when to act. The Combat Manager tells it.

### The Script: Abilities

Each ability (Power Strike, Fireball, Heal, Shield Bash) is a self-contained piece of logic. It knows its cost, its targeting rules, its effects, and its cooldown. When a combatant uses an ability, the ability executes its script and reports the results back to the Combat Manager.

### The Stage: Combat Arena

The combat arena is the physical space where the fight happens. In turn-based mode, it is a hex or square grid with cells that can be occupied, blocked, or affected by area effects. In real-time mode, it is a 3D space with collision and line of sight. The arena does not care about abilities or turn order. It just tracks positions and obstacles.

### How They Interact

```
Player Input (or AI Decision)
        |
        v
  Combat Manager
  "It is Warrior's turn. Warrior wants to use Power Strike on Goblin."
        |
        v
  Ability System
  "Power Strike costs 10 Stamina. Warrior has enough. Roll d20+Might vs Goblin AC."
        |
        v
  Dice Roller + Stat Calculator (C++ plugins from Module 03)
  "Rolled 17. Modifier +3. Total 20. Goblin AC 13. Hit."
        |
        v
  Ability System
  "Deal 1d10+3 Physical damage."
        |
        v
  Damage Resolution
  "10 Physical damage. Goblin has no resistances. 10 damage applied."
        |
        v
  Combat Manager
  "Goblin HP: 8 -> -2. Goblin is dead. Remove from initiative. Award 25 XP."
        |
        v
  Combat Manager
  "Advance turn. Next combatant: Rogue."
```

This flow is the same whether you are in turn-based or real-time mode. The difference is how input arrives (menu selection vs. button press) and how time passes (discrete turns vs. continuous with cooldowns).

---

## Part 1: The Turn-Based Foundation

We start with turn-based combat because it is more structured and easier to debug. Real-time mode will layer on top of it later.

### The Combat Manager Subsystem

The Combat Manager is the heart of the system. It orchestrates everything. Ask Claude to generate this as a `UGameInstanceSubsystem` in the TabletopCombat plugin you started in Module 03.

Here is the prompt:

> "Write a UCombatManagerSubsystem (UGameInstanceSubsystem) for Tabletop Quest. It manages turn-based and real-time combat. Properties and functions needed:
>
> **State:**
> - CurrentCombatMode (ECombatMode, starts TurnBased)
> - bIsInCombat (bool)
> - CurrentRound (int32)
> - CurrentTurnIndex (int32)
> - Combatants (TArray of FCombatantData, a new struct)
>
> **FCombatantData struct:**
> - DisplayName (FString)
> - CombatantActor (AActor*)
> - Initiative (int32)
> - MaxHP, CurrentHP (float)
> - MaxMana, CurrentMana (float)
> - MaxStamina, CurrentStamina (float)
> - ArmorClass (int32)
> - Stats (FCharacterStats from TabletopCore)
> - ActiveStatusEffects (TArray of FStatusEffectInstance, another new struct)
> - bIsPlayerControlled (bool)
> - bIsAlive (bool)
> - ActionPointsRemaining (int32, default 1)
> - BonusActionAvailable (bool, default true)
> - MovementRemaining (float, default 30.0 for 30 feet / 6 hexes)
>
> **FStatusEffectInstance struct:**
> - EffectType (EStatusEffect)
> - TurnsRemaining (int32)
> - SourceCombatantName (FString)
> - DamagePerTurn (float, for DoT effects like Burning/Poisoned)
>
> **Functions:**
> - StartCombat(TArray of FCombatantData): rolls initiative for all, sorts, sets round 1
> - EndCombat(): clears state, broadcasts OnCombatEnded
> - GetCurrentCombatant(): returns whose turn it is
> - AdvanceTurn(): moves to next alive combatant, handles round wrapping
> - GetTurnOrder(): returns sorted list of alive combatants
> - ApplyDamage(int32 TargetIndex, float Amount, EDamageType): reduces HP, checks death
> - ApplyHealing(int32 TargetIndex, float Amount): restores HP up to max
> - ApplyStatusEffect(int32 TargetIndex, FStatusEffectInstance Effect): adds to target
> - RemoveStatusEffect(int32 TargetIndex, EStatusEffect Type): removes from target
> - ProcessTurnStartEffects(): ticks DoTs, reduces durations, removes expired effects
> - SwitchCombatMode(ECombatMode NewMode): switches between turn-based and real-time
> - UseActionPoint(): decrements action points for current combatant
> - UseBonusAction(): marks bonus action as used
> - ResetTurnResources(): called at start of turn, restores action/bonus/movement
>
> **Delegates:**
> - OnCombatStarted()
> - OnCombatEnded()
> - OnTurnChanged(FCombatantData NewCombatant)
> - OnRoundChanged(int32 NewRound)
> - OnCombatModeChanged(ECombatMode OldMode, ECombatMode NewMode)
> - OnCombatantDied(FCombatantData DeadCombatant)
> - OnDamageDealt(FCombatantData Attacker, FCombatantData Defender, float Damage)
> - OnStatusEffectApplied(FCombatantData Target, FStatusEffectInstance Effect)
>
> All functions BlueprintCallable. All properties BlueprintReadOnly. All delegates BlueprintAssignable."

That is a large prompt, but Claude handles it well. The result is a complete combat manager with 300+ lines of C++, all macro'd up and ready for Blueprint wiring.

### Initiative and Turn Order

The initiative system determines who acts first each round. In DnD 5e, every combatant rolls a d20 and adds their Finesse modifier. The results are sorted from highest to lowest, and that is the turn order for the entire combat.

In your Combat Manager, the `StartCombat` function handles this:

```cpp
void UCombatManagerSubsystem::StartCombat(
    const TArray<FCombatantData>& InCombatants)
{
    Combatants = InCombatants;
    bIsInCombat = true;
    CurrentRound = 1;
    CurrentTurnIndex = 0;

    // Roll initiative for each combatant using the DiceRoller subsystem
    UDiceRollerSubsystem* DiceRoller = GetGameInstance()
        ->GetSubsystem<UDiceRollerSubsystem>();
    UStatCalculatorSubsystem* StatCalc = GetGameInstance()
        ->GetSubsystem<UStatCalculatorSubsystem>();

    for (FCombatantData& Combatant : Combatants)
    {
        int32 FinesseMod = StatCalc->GetAbilityModifier(
            Combatant.Stats.Finesse);
        FDiceRollResult InitRoll = DiceRoller->Roll(1, 20, FinesseMod);
        Combatant.Initiative = InitRoll.Total;
    }

    // Sort by initiative (highest first), break ties by Finesse
    Combatants.Sort([](const FCombatantData& A, const FCombatantData& B)
    {
        if (A.Initiative != B.Initiative)
            return A.Initiative > B.Initiative;
        return A.Stats.Finesse > B.Stats.Finesse;
    });

    ResetTurnResources();
    OnCombatStarted.Broadcast();
    OnTurnChanged.Broadcast(Combatants[0]);
}
```

See how it uses the DiceRoller and StatCalculator from Module 03? All those plugins now work together seamlessly.

### The Action Economy

In DnD 5e, each turn gives you three things:

- **Action** (1 per turn): Your main thing. Attack, cast a spell, use an item.
- **Bonus Action** (1 per turn): A quick secondary thing. Some abilities specifically cost a bonus action.
- **Movement** (30 feet / 6 hexes): How far you can move.

In the Combat Manager, these are tracked per combatant:

- `ActionPointsRemaining` (int32): Usually 1. Some abilities might grant extra actions.
- `BonusActionAvailable` (bool): Resets to true at the start of each turn.
- `MovementRemaining` (float): Resets to the combatant's movement speed.

The `ResetTurnResources` function restores all three at the start of each turn. The `UseActionPoint` and `UseBonusAction` functions consume them. Before an ability executes, it checks whether the combatant has the required resource. Power Strike costs an Action. Shield Bash costs an Action. Second Wind costs a Bonus Action. Battle Cry costs a Bonus Action.

This maps directly to the ability table in the project bible:

| Ability | Cost Type | Turn-Based Cost |
|---------|-----------|----------------|
| Power Strike | Action | 10 Stamina + Action Point |
| Shield Bash | Action | 8 Stamina + Action Point |
| Cleave | Action | 12 Stamina + Action Point |
| Battle Cry | Bonus Action | 15 Stamina + Bonus Action |
| Second Wind | Bonus Action | 10 Stamina + Bonus Action |
| Taunt | Bonus Action | 8 Stamina + Bonus Action |

---

## Part 2: The Ability System

The ability system handles individual combat actions. Each ability is a self-contained unit that knows its cost, targeting rules, and effects.

### Ability Data Assets

Rather than hardcoding abilities in Blueprints, use Data Assets. Ask Claude to generate an `UAbilityDataAsset`:

```cpp
UCLASS(BlueprintType)
class TABLETTOPCOMBAT_API UAbilityDataAsset : public UPrimaryDataAsset
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Identity")
    FString AbilityName;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Identity")
    FString Description;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Identity")
    UTexture2D* Icon;

    // Cost
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Cost")
    bool bCostsAction = true;  // false = Bonus Action

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Cost")
    float ManaCost = 0.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Cost")
    float StaminaCost = 0.0f;

    // Targeting
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Targeting")
    EAbilityTarget TargetType;  // Self, SingleEnemy, SingleAlly, AllEnemies,
                                // AllAllies, AreaOfEffect

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Targeting")
    float Range = 5.0f;  // In feet (1 hex = 5 feet)

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Targeting")
    float AreaRadius = 0.0f;  // For AoE abilities

    // Damage
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Damage")
    int32 DamageDiceCount = 1;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Damage")
    int32 DamageDiceSides = 6;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Damage")
    EDamageType DamageType = EDamageType::Physical;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Damage")
    float DamageMultiplier = 1.0f;  // Power Strike = 1.5x

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Damage")
    bool bUsesAttackRoll = true;  // Some abilities auto-hit

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Damage")
    EAbilityScaling ScalingStat;  // Might, Finesse, Mind, Presence

    // Healing
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Healing")
    int32 HealingDiceCount = 0;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Healing")
    int32 HealingDiceSides = 0;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Healing")
    float HealingMultiplier = 1.0f;

    // Status Effects
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Status")
    EStatusEffect AppliedEffect = EStatusEffect::None;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Status")
    int32 EffectDuration = 0;  // In turns

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Status")
    float EffectDamagePerTurn = 0.0f;  // For DoT effects

    // Cooldown (real-time mode)
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Real-Time")
    float CooldownSeconds = 6.0f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Real-Time")
    float CastTimeSeconds = 0.0f;  // Wind-up animation time

    // Animation
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Animation")
    UAnimMontage* CastMontage;
};
```

Now in the editor, you create one Data Asset per ability. Power Strike: 1d10 Physical at 1.5x, costs Action + 10 Stamina, scales with Might, 0.5s cast time, 6s cooldown. Fireball: 8d6 Fire, AoE 20ft radius, costs Action + 30 Mana, scales with Mind, 1.0s cast time, 15s cooldown.

Every ability in the class abilities document becomes a Data Asset. No code changes needed per ability.

### The Ability Execution Flow

When a combatant uses an ability, the flow goes through several validation and resolution steps. Build this as a Blueprint (not C++) because the logic is sequential and visual, making it easier to debug and tweak.

#### Step 1: Validate

Check that the combatant can use this ability right now:
- Do they have enough Action Points (or is it a Bonus Action)?
- Do they have enough Mana/Stamina?
- Are they afflicted with a status effect that prevents action (Stunned)?
- Is the target in range?
- Is the target valid (alive, correct team)?

#### Step 2: Pay Costs

Deduct the resource costs:
- Consume the Action Point or Bonus Action
- Subtract Mana or Stamina

#### Step 3: Resolve the Attack (if applicable)

If `bUsesAttackRoll` is true:
- Roll d20 + attacker's scaling stat modifier
- Compare against target's Armor Class
- On natural 20: critical hit (double damage dice)
- On natural 1: automatic miss regardless of modifiers
- On miss: skip to Step 7 (no damage, no effects)

#### Step 4: Calculate Damage

If the ability deals damage:
- Roll damage dice (DamageDiceCount d DamageDiceSides)
- Multiply by DamageMultiplier (Power Strike = 1.5x)
- Add the ability modifier from the scaling stat
- If critical hit: double the dice (roll again and add)
- Pass through the StatCalculator's `CalculateDamage` for resistance/vulnerability

#### Step 5: Apply Damage or Healing

- Subtract damage from target's CurrentHP
- Or add healing to target's CurrentHP (capped at MaxHP)

#### Step 6: Apply Status Effects

If the ability applies a status effect:
- Create an FStatusEffectInstance
- Add it to the target's ActiveStatusEffects array
- Broadcast OnStatusEffectApplied

#### Step 7: Broadcast Results

Fire delegates so the UI and other systems can react:
- OnDamageDealt (for floating combat text)
- OnCombatantDied (if HP <= 0)
- Play the CastMontage animation

This entire flow is a Blueprint function called `ExecuteAbility(UAbilityDataAsset* Ability, int32 UserIndex, int32 TargetIndex)`. Building it in Blueprints means you can see every step visually, add breakpoints, and tweak values without recompilation.

---

## Part 3: Status Effects

Status effects are ongoing conditions that modify a combatant's capabilities or deal damage over time. In DnD terms, these are conditions like Stunned, Poisoned, Frightened, and buffs like Blessed and Hasted.

### How Status Effects Work

Each combatant has a `TArray<FStatusEffectInstance>` that tracks their active effects. At the start of each turn, the Combat Manager calls `ProcessTurnStartEffects()`:

1. Loop through all active effects on the current combatant
2. For each effect:
   - If it has DamagePerTurn > 0 (Burning, Poisoned): apply that damage
   - Decrement TurnsRemaining by 1
   - If TurnsRemaining reaches 0: remove the effect
3. Check for effects that prevent action (Stunned, Frozen):
   - If the combatant is Stunned, skip their turn entirely
   - If the combatant is Frozen, skip their turn and they take no damage from Frozen this turn

### Effect Definitions

| Effect | Prevents Action? | Damage/Turn | Special Rules |
|--------|-----------------|-------------|---------------|
| Stunned | Yes (skip turn) | 0 | Removed after 1 skipped turn |
| Poisoned | No | 2-8 (varies) | Attacks have disadvantage |
| Burning | No | 1d6 Fire/turn | Can spread to adjacent combatants |
| Frozen | Yes (skip turn) | 0 | Vulnerability to Physical while frozen |
| Frightened | No | 0 | Cannot move toward the source, attacks have disadvantage |
| Blessed | No | 0 | +1d4 to attack rolls and saving throws |
| Hasted | No | 0 | Extra Action Point per turn, double movement |

### Blueprint Implementation

Create a function called `ProcessStatusEffects(int32 CombatantIndex)` in your combat Blueprint:

```
For each StatusEffect in Combatant.ActiveStatusEffects:
    |
    If EffectType == Burning:
        Roll 1d6 --> ApplyDamage(CombatantIndex, Roll, Fire)
        Print "{Name} takes {damage} fire damage from Burning!"
    |
    If EffectType == Poisoned:
        Apply Disadvantage flag for this turn's attacks
        Roll DamagePerTurn --> ApplyDamage(CombatantIndex, Roll, Poison)
    |
    Decrement TurnsRemaining
    |
    If TurnsRemaining <= 0:
        RemoveStatusEffect(CombatantIndex, EffectType)
        Print "{Name} is no longer {EffectName}!"
```

### The Stunned/Frozen Skip

Before a combatant takes their turn, check:

```
If Combatant has Stunned or Frozen:
    Print "{Name} is {Stunned/Frozen} and cannot act!"
    ProcessStatusEffects(CombatantIndex)  // Still tick effects
    AdvanceTurn()  // Skip to next combatant
    Return  // Do not enter the action phase
```

This maps directly to the Warrior's Iron Will passive at level 9: "Immune to Stunned and Frightened conditions." When that passive is active, the stun check returns false and the Warrior always gets their turn.

---

## Part 4: The Damage Pipeline

Damage in Tabletop Quest flows through a multi-step pipeline. Understanding this pipeline is essential because it determines how powerful abilities feel, how resistances matter, and how the numbers in the bestiary translate to actual gameplay.

### The Pipeline

```
Base Roll (dice)
    |
    + Ability Modifier (stat-based)
    |
    x Damage Multiplier (ability-specific, e.g. Power Strike 1.5x)
    |
    x Critical Multiplier (2x if natural 20)
    |
    = Raw Damage
    |
    Check Resistances (halve if resistant to this damage type)
    |
    Check Vulnerabilities (double if vulnerable to this damage type)
    |
    - Flat Damage Reduction (from armor abilities, if you add them)
    |
    = Final Damage (minimum 0)
```

### Example: Mage Casts Fireball on a Shadow Wraith

1. **Base Roll**: 8d6 = 28
2. **Ability Modifier**: Mind is 18, modifier = (18-10)/2 = +4, so 28+4 = 32
3. **Damage Multiplier**: Fireball is 1.0x, so 32
4. **Critical**: Fireball does not use attack rolls, so no crit possible
5. **Raw Damage**: 32
6. **Resistances**: Shadow Wraith resists Physical and Ice, but not Fire
7. **Vulnerabilities**: Shadow Wraith is vulnerable to Fire! Double damage: 64
8. **Final Damage**: 64

The Shadow Wraith has 22 HP. It is obliterated. The Mage chose the right spell for the right enemy.

### Example: Warrior Power Strikes a Skeleton Warrior

1. **Base Roll**: 1d10 = 7
2. **Ability Modifier**: Might 16, modifier = +3, so 7+3 = 10
3. **Damage Multiplier**: Power Strike is 1.5x, so 15
4. **Critical**: Attack roll was 18 (not a nat 20), no crit
5. **Raw Damage**: 15
6. **Resistances**: Skeleton resists Physical! Halve: 7.5, round down to 7
7. **Vulnerabilities**: None applicable
8. **Final Damage**: 7

The Skeleton Warrior has 13 HP and takes 7 damage, dropping to 6 HP. The Warrior's physical damage is partially wasted against the Skeleton's resistance. The Cleric's Holy damage would have been far more effective.

This is the kind of tactical depth that makes DnD combat interesting, and it all emerges naturally from the damage pipeline interacting with the enemy data.

---

## Part 5: The Dual Combat Mode Switch

This is the signature feature of Tabletop Quest's combat. The player can switch between turn-based and real-time at any point during a fight. Let's build it.

### What Changes Between Modes

| Aspect | Turn-Based | Real-Time |
|--------|-----------|-----------|
| Time | Discrete turns, unlimited thinking time | Continuous, 1 second = 1 second |
| Input | Menu selection (select ability, select target) | Button presses (ability hotbar, mouse targeting) |
| Resources | Action Points + Bonus Action per turn | Cooldown timers per ability |
| Movement | Grid-based, 30ft per turn | Free 3D movement, no grid |
| Camera | Top-down tactical view | Third-person over-shoulder |
| AI | Evaluates all options, picks optimal | Reactive behavior trees |
| Turn Order | Initiative-based sequence | Everyone acts simultaneously |

### The Conversion Rules

When switching from turn-based to real-time:
- **Cooldowns**: Each ability's `CooldownSeconds` activates. If an ability was just used this turn, it starts on full cooldown.
- **Action Economy**: Disappears. Abilities are gated by cooldowns instead.
- **Resource Costs**: Stay the same (Mana/Stamina still deplete).
- **Status Effect Durations**: Convert from turns to seconds. 1 turn = the ability's `CooldownSeconds` (roughly 6 seconds for most abilities). So "Stunned for 2 turns" becomes "Stunned for 12 seconds."
- **Movement**: Switches from grid to free movement. Movement speed in feet/turn becomes movement speed in UE5 units/second.
- **Initiative**: Becomes irrelevant. Everyone acts simultaneously.

When switching from real-time to turn-based:
- **Cooldowns**: Convert to "turns until ready." If a 10s cooldown has 3s remaining, that is roughly 0.5 turns, so the ability is available next turn.
- **Status Durations**: Convert seconds back to turns using the same ratio.
- **Initiative**: Re-roll for all combatants (quick initiative reset).
- **Resources**: Do not reset. If you spent 30 Mana in real-time mode, you still have 30 less Mana.

### Implementing the Switch

The `SwitchCombatMode` function in the Combat Manager handles the conversion:

```cpp
void UCombatManagerSubsystem::SwitchCombatMode(ECombatMode NewMode)
{
    if (NewMode == CurrentCombatMode) return;
    if (NewMode == ECombatMode::Transitioning) return;

    ECombatMode OldMode = CurrentCombatMode;
    CurrentCombatMode = ECombatMode::Transitioning;

    if (OldMode == ECombatMode::TurnBased && NewMode == ECombatMode::RealTime)
    {
        ConvertTurnBasedToRealTime();
    }
    else if (OldMode == ECombatMode::RealTime && NewMode == ECombatMode::TurnBased)
    {
        ConvertRealTimeToTurnBased();
    }

    CurrentCombatMode = NewMode;
    OnCombatModeChanged.Broadcast(OldMode, NewMode);
}
```

The `Transitioning` state is important. It tells the UI and camera system "do not accept input right now, we are between modes." The camera needs a moment to animate from top-down to third-person (or vice versa), and the UI needs to swap layouts. The transition takes 1-2 seconds, then the new mode activates.

### What Blueprints Do When the Mode Switches

Remember the delegates from Module 03? This is where they pay off. When `OnCombatModeChanged` broadcasts, every subscribing Blueprint reacts:

**The UI Blueprint:**
- Hides the turn-based action menu (or hides the real-time ability hotbar)
- Shows the appropriate UI for the new mode
- Updates resource displays

**The Camera Blueprint:**
- Animates from tactical overhead to third-person over-shoulder (or vice versa)
- Changes camera movement behavior (free orbit vs. character follow)

**The Grid Blueprint:**
- Shows or hides the hex grid overlay
- Shows or hides movement range indicators

**The Enemy AI Blueprint:**
- Switches between "evaluate all options and pick optimal" (turn-based) and "run behavior tree" (real-time)

**The Ability Bar Blueprint:**
- Switches between "click to select, then click target" and "press 1-8 to activate, mouse to aim"

None of these Blueprints know about each other. They all just listen for the delegate and handle their own domain. This is the power of event-driven architecture.

---

## Part 6: Building the Turn-Based UI

The turn-based UI needs to communicate a lot of information clearly:

### The Turn Order Bar

A horizontal bar at the top of the screen showing character portraits in initiative order. The current combatant's portrait is highlighted and larger. Dead combatants are greyed out and crossed.

Build this as a Widget Blueprint:
1. Use a Horizontal Box for the portrait lineup
2. Each portrait is a custom Widget (BP_TurnOrderPortrait) with:
   - Character portrait image
   - Name text
   - HP bar (small, below the portrait)
   - Status effect icons (tiny icons below the HP bar)
   - Highlight border (visible only for the active combatant)

3. When `OnTurnChanged` fires, update the highlight
4. When `OnCombatantDied` fires, grey out that portrait

### The Action Menu

When it is a player character's turn, show the action menu:

```
+---------------------------+
|  POWER STRIKE    (Action) |
|  SHIELD BASH     (Action) |
|  CLEAVE          (Action) |
|  BATTLE CRY      (Bonus)  |
|  SECOND WIND     (Bonus)  |
|  MOVE            (Move)   |
|  END TURN                 |
+---------------------------+
```

Each entry shows:
- Ability name
- Cost type (Action/Bonus Action)
- Resource cost (10 Stamina, 30 Mana)
- Whether it is currently usable (greyed out if not enough resources or wrong action type)

When the player selects an ability, enter targeting mode:
1. Highlight valid targets (based on range and TargetType)
2. Player clicks a target
3. Execute the ability
4. Update resources and UI
5. If the combatant still has actions remaining, show the menu again
6. If not, show only "End Turn" (or auto-end if they have used everything)

### The Combat Log

A scrolling text panel at the bottom of the screen that narrates the combat:

```
Round 1
  Rogue rolls 18 for initiative.
  Warrior rolls 12 for initiative.
  Goblin rolls 15 for initiative.

  Rogue's turn.
  Rogue uses Sneak Attack on Goblin. Rolls 19+5 = 24 vs AC 13. Hit!
  Deals 2d6+5 Physical damage = 14. Goblin takes 14 damage.
  Goblin has 0 HP. Goblin is defeated!
  +25 XP earned.

  Combat ended. Victory!
```

The combat log pulls from the delegates: `OnDamageDealt`, `OnCombatantDied`, `OnTurnChanged`, `OnRoundChanged`. Each delegate handler formats a text entry and adds it to the log widget.

---

## Part 7: Real-Time Mode

Real-time mode transforms the same combat system into an action RPG experience. The underlying data is identical (same stats, same abilities, same resistances), but the input and timing change completely.

### The Real-Time Ability Bar

Instead of a menu, abilities sit on a hotbar (keys 1-8). Each slot shows:
- Ability icon
- Cooldown overlay (a clock-wipe animation showing time remaining)
- Resource cost
- Key binding

When the player presses a key:
1. Check if the ability is off cooldown
2. Check if the combatant has enough Mana/Stamina
3. Start the cast animation (CastTimeSeconds)
4. During wind-up, the player can move but cannot use other abilities
5. At the end of the wind-up, resolve the ability (same pipeline as turn-based)
6. Start the cooldown timer

### Cooldown Timers

In real-time mode, replace the action point system with cooldown timers:

```cpp
USTRUCT(BlueprintType)
struct FAbilityCooldownState
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly)
    UAbilityDataAsset* Ability;

    UPROPERTY(BlueprintReadOnly)
    float CooldownRemaining = 0.0f;

    UPROPERTY(BlueprintReadOnly)
    bool bIsOnCooldown = false;
};
```

Each frame (in the Tick function), decrement `CooldownRemaining` by `DeltaTime`. When it reaches 0, the ability is ready again.

### Party AI in Real-Time Mode

In turn-based mode, you control every character. In real-time mode, you control one character and the AI controls the rest. The AI needs simple rules:

**Warrior AI (Tank):**
- If an enemy is attacking a squishy ally, use Taunt
- If surrounded, use Whirlwind or Cleave
- Otherwise, attack the nearest enemy with Power Strike
- Use Second Wind when below 40% HP

**Cleric AI (Healer):**
- If any ally is below 50% HP, heal them
- If no one needs healing, attack the nearest enemy
- Keep Bless active on the party when possible

**Rogue AI (DPS):**
- Target the enemy with the lowest HP (finish them off)
- If behind an enemy, use Sneak Attack (bonus damage)
- Avoid staying adjacent to multiple enemies (squishy)

These AI patterns are perfect for Blueprint behavior trees (covered in depth in Module 07). For now, a simple priority list in Blueprints works well enough to test real-time combat.

---

## Part 8: XP, Leveling, and Combat Rewards

When combat ends in victory, the party earns XP equal to the sum of all defeated enemies' XP rewards. The XP is divided equally among surviving party members.

### XP Distribution

```
Total XP = Sum of all defeated enemy XPReward values
Per Character XP = Total XP / Number of surviving party members (round down)
```

If the party of 4 defeats a group worth 200 XP total:
- All 4 survive: 50 XP each
- Only 3 survive: 66 XP each
- Solo: 200 XP

### Level Up Check

After awarding XP, check each character against the XP threshold table (from the StatCalculator's `GetXPThreshold` function). If their total XP meets or exceeds the next level's threshold, they level up.

On level up:
- Increase MaxHP by their class's HP/Level value
- Potentially increase a stat (every 4 levels in DnD)
- Unlock new abilities at specific levels (check the class abilities document)

### Loot

After combat, roll on the loot table for each defeated enemy. The loot tables in the project bible define drop chances per enemy type. This ties into the inventory system (a future module), but the combat system needs to generate the loot list.

---

## Part 9: Putting It All Together

Here is the complete combat flow from encounter start to resolution:

```
1. ENCOUNTER START
   - Player enters combat trigger zone (or initiates combat)
   - Camera zooms to combat view
   - Combat Manager.StartCombat() with all combatants
   - Initiative rolled, turn order established
   - UI shows turn order bar, action menu, combat log

2. TURN LOOP (Turn-Based Mode)
   For each combatant in initiative order:
     a. ProcessTurnStartEffects() - tick DoTs, check stuns
     b. If stunned/frozen: skip turn, advance
     c. ResetTurnResources() - restore AP, bonus action, movement
     d. If player-controlled: show action menu, wait for input
     e. If AI-controlled: run AI decision logic
     f. Execute chosen ability (validate > pay costs > resolve > apply)
     g. Update UI (HP bars, status effects, combat log)
     h. Check for death (OnCombatantDied)
     i. Check for combat end (all enemies dead, or all players dead)
     j. AdvanceTurn()

3. MODE SWITCH (if player presses the switch button)
   - SwitchCombatMode(RealTime)
   - Convert all timers and durations
   - UI swaps to ability hotbar
   - Camera transitions to third-person
   - All combatants act simultaneously via AI/player input

4. REAL-TIME LOOP
   Every frame:
     a. Tick all cooldowns (DeltaTime)
     b. Tick all status effect durations
     c. Process player input (ability activations, movement)
     d. Process party AI decisions
     e. Process enemy AI decisions
     f. Resolve any ability that finishes its cast time
     g. Update UI (cooldowns, HP bars, combat log)
     h. Check for death
     i. Check for combat end

5. COMBAT END
   - OnCombatEnded broadcasts
   - Calculate and award XP
   - Check for level ups
   - Generate loot
   - UI shows victory/defeat screen
   - Return to exploration (or tabletop view)
```

### A Complete Test Scenario

Set up this test fight to validate your entire system:

**Party:**
- Warrior: Might 16, Finesse 10, Mind 8, Presence 12, HP 45, AC 18, Stamina 40
- Rogue: Might 10, Finesse 18, Mind 12, Presence 14, HP 28, AC 15, Stamina 35
- Mage: Might 8, Finesse 12, Mind 18, Presence 10, HP 22, AC 11, Mana 60

**Enemies:**
- 3 Goblins: Each has Might 8, Finesse 14, Mind 8, HP 8, AC 13, Vulnerable to Fire

**Expected flow:**
1. Initiative rolls place Rogue first (high Finesse), Goblins mixed in, Warrior and Mage somewhere in the order
2. Rogue sneak attacks Goblin 1 for heavy damage, likely kills it in one hit
3. Goblins attack various party members
4. Warrior uses Cleave to hit multiple Goblins if adjacent
5. Mage casts a fire spell for bonus damage due to Goblin vulnerability
6. Combat should end in 1-2 rounds
7. Total XP: 75 (25 per Goblin), split 3 ways = 25 XP each

If you can play through this scenario and the numbers match the rules, your combat system works.

---

## Python Automation for Combat Testing

Claude can generate Python scripts that run automated combat simulations:

```python
import random

def simulate_combat(party, enemies, num_simulations=1000):
    """Run N simulated combats and report win rate, average rounds, etc."""
    wins = 0
    total_rounds = 0

    for _ in range(num_simulations):
        # Deep copy combatants
        p = [dict(c) for c in party]
        e = [dict(c) for c in enemies]

        rounds = 0
        while any(c['hp'] > 0 for c in p) and any(c['hp'] > 0 for c in e):
            rounds += 1
            # Simplified: each combatant attacks a random living enemy
            for combatant in p + e:
                if combatant['hp'] <= 0:
                    continue
                targets = e if combatant in p else p
                alive = [t for t in targets if t['hp'] > 0]
                if not alive:
                    break
                target = random.choice(alive)
                roll = random.randint(1, 20) + combatant.get('atk_mod', 0)
                if roll >= target.get('ac', 10):
                    dmg = random.randint(1, combatant.get('dmg_die', 6))
                    dmg += combatant.get('dmg_mod', 0)
                    target['hp'] -= max(0, dmg)

        if any(c['hp'] > 0 for c in p):
            wins += 1
        total_rounds += rounds

    print(f"Win rate: {wins/num_simulations*100:.1f}%")
    print(f"Avg rounds: {total_rounds/num_simulations:.1f}")
```

This helps you balance encounters before building them in the editor. If the party wins 95% of 1000 simulated fights against 3 Goblins, the encounter is too easy. If they win 30%, it is too hard. Target 60-80% for standard encounters.

---

## Summary: What You Built

- **Combat Manager Subsystem**: Central coordinator for all combat flow
- **Ability System**: Data-driven abilities via Data Assets, with a full validation and resolution pipeline
- **Status Effect System**: DoTs, stuns, buffs, and debuffs that tick each turn
- **Damage Pipeline**: Multi-step damage calculation with resistances, vulnerabilities, and critical hits
- **Dual Combat Mode**: Turn-based and real-time with mid-fight switching and proper conversion rules
- **Turn-Based UI**: Turn order bar, action menu, targeting system, combat log
- **Real-Time UI**: Ability hotbar with cooldown overlays
- **Party AI**: Simple priority-based AI for non-controlled party members
- **XP and Rewards**: Post-combat XP distribution and level-up checks

Your combat system uses every plugin from Module 03 (dice, stats, core types) and adds a complete gameplay layer on top. In Module 05, you will make this combat look stunning with materials, Lumen lighting, and Nanite meshes.
