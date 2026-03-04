# Module 04: The Gameplay Ability System (GAS)

## Why This Module Matters

If there is one system in Unreal Engine 5 that will make or break your tabletop RPG, it is GAS. Every spell your wizard casts, every sword swing from your fighter, every poison tick eating away at a dragon's health, every buff from the bard's inspiration song: all of it flows through the Gameplay Ability System.

GAS is like a universal translator between your game design spreadsheet and the actual code. You know those tabletop character sheets where you write down abilities, stats, and effects? GAS lets you define all of that as structured data, and then it handles the execution, networking, prediction, and cleanup for you. You design the rules; GAS enforces them.

Epic Games built GAS for Fortnite, and it has since powered dozens of shipped titles. It is production-proven, multiplayer-ready, and extensible enough to handle everything from a simple melee attack to a 47-step chain combo with branching conditions.

---

## The 5 Core Pieces of GAS

Think of GAS as a machine with five interlocking gears. Each gear has a specific job, and they all work together to produce the final result: a working ability system.

### 1. AbilitySystemComponent (ASC)

The AbilitySystemComponent is the brain. It is a UActorComponent that you attach to any actor that needs to use abilities, have attributes, or be affected by gameplay effects. Without an ASC, an actor is invisible to GAS.

Think of the ASC as a character's nervous system. It receives inputs ("cast Fireball"), processes them through the ability logic, applies the results (damage, buffs, cooldowns), and manages the character's current state.

```cpp
// In your character header file
UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Abilities")
UAbilitySystemComponent* AbilitySystemComponent;

// In your character constructor
AbilitySystemComponent = CreateDefaultSubobject<UAbilitySystemComponent>(TEXT("AbilitySystemComponent"));
```

Key responsibilities of the ASC:
- Grants and removes abilities from the character
- Activates abilities when requested
- Applies and manages active Gameplay Effects
- Owns the character's Attribute Set
- Tracks active Gameplay Tags
- Handles replication for multiplayer

**For our game:** Every player character, every enemy, every NPC that can participate in combat needs an ASC. Even destructible objects like barrels or doors might get one if you want spells to interact with them.

### 2. Gameplay Abilities (GA)

A Gameplay Ability is a single action that a character can perform. Casting a spell, swinging a sword, drinking a potion, dodging, blocking: each of these is a Gameplay Ability.

Think of a Gameplay Ability as a recipe card. It lists what you need (enough mana, a weapon equipped, not stunned), what happens when you follow the recipe (play animation, spawn projectile, apply damage), and how to clean up afterward (reset cooldown timer, return to idle state).

```cpp
UCLASS()
class UGA_MeleeAttack : public UGameplayAbility
{
    GENERATED_BODY()

public:
    UGA_MeleeAttack();

    // Can this ability activate right now?
    virtual bool CanActivateAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayTagContainer* SourceTags,
        const FGameplayTagContainer* TargetTags,
        FGameplayTagContainer* OptionalRelevantTags) const override;

    // The actual ability logic
    virtual void ActivateAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayAbilityActivationInfo ActivationInfo,
        const FGameplayEventData* TriggerEventData) override;

    // Cleanup when ability ends
    virtual void EndAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayAbilityActivationInfo ActivationInfo,
        bool bReplicateEndAbility, bool bWasCancelled) override;
};
```

### 3. Gameplay Effects (GE)

Gameplay Effects are the workhorses that actually change numbers. When an ability deals 15 fire damage, it does not directly subtract 15 from the target's health. Instead, it creates a Gameplay Effect that says "reduce Health by 15, tagged as Fire damage." The GE then applies that change through the proper channels, respecting resistances, immunities, and other modifiers along the way.

Think of Gameplay Effects as official forms. Instead of just scribbling "minus 15 HP" on someone's character sheet, you fill out a standardized damage form. The form goes through processing (armor reduction, elemental resistance, minimum damage floors) before the final number reaches the character sheet.

There are three duration types:

- **Instant:** Apply once and done. Direct damage, healing, consuming a resource. The effect fires, modifies the attribute, and disappears.
- **Duration:** Active for a set time. A 10-second strength buff, a 30-second poison, a 5-second stun. The effect applies, ticks if needed, and removes itself when the timer expires.
- **Infinite:** Stays forever until explicitly removed. Passive abilities, equipment bonuses, permanent stat changes from leveling up.

```cpp
// Creating a damage effect in C++ (more commonly done in Blueprints/Data Assets)
UGameplayEffect* DamageEffect = NewObject<UGameplayEffect>(GetTransientPackage(), TEXT("DamageEffect"));
DamageEffect->DurationPolicy = EGameplayEffectDurationType::Instant;

// Add a modifier that subtracts from Health
FGameplayModifierInfo DamageModifier;
DamageModifier.Attribute = UMyAttributeSet::GetHealthAttribute();
DamageModifier.ModifierOp = EGameplayModOp::Additive;
DamageModifier.ModifierMagnitude = FScalableFloat(-15.0f);
DamageEffect->Modifiers.Add(DamageModifier);
```

### 4. Gameplay Tags

Gameplay Tags are hierarchical labels that describe states, categories, and conditions. They are the language that GAS components use to talk to each other.

Think of Gameplay Tags as a filing system. Instead of using scattered boolean variables like `bIsStunned`, `bIsOnFire`, `bCanCast`, you use a single organized tree of tags: `Character.State.Stunned`, `Character.Status.Burning`, `Ability.Type.Spell`. Any system can check for tags, and any system can add or remove them.

```
// Example tag hierarchy for our RPG
Character
    Character.State
        Character.State.Stunned
        Character.State.Prone
        Character.State.Grappled
        Character.State.Concentrating
    Character.Status
        Character.Status.Burning
        Character.Status.Poisoned
        Character.Status.Blessed

Ability
    Ability.Type
        Ability.Type.Spell
        Ability.Type.MeleeAttack
        Ability.Type.RangedAttack
        Ability.Type.Skill
    Ability.Cooldown
        Ability.Cooldown.Fireball
        Ability.Cooldown.HealingWord
        Ability.Cooldown.ShieldBash

Damage
    Damage.Type
        Damage.Type.Fire
        Damage.Type.Cold
        Damage.Type.Slashing
        Damage.Type.Bludgeoning
```

Why tags matter so much: they let you write generic, reusable logic. Instead of coding "if the target is a fire elemental, ignore fire damage," you tag fire elementals with `Character.Immunity.Fire` and tag fire damage effects with `Damage.Type.Fire`. The system handles the rest.

### 5. Attribute Sets

An Attribute Set is a collection of numerical stats that define a character. Health, Mana, Strength, Armor: these are all attributes. The Attribute Set is a UObject that lives on the ASC and provides the getter/setter framework, clamping, and replication for each attribute.

Think of the Attribute Set as the character sheet itself. It is the official, authoritative record of every number that matters.

```cpp
UCLASS()
class UTQAttributeSet : public UAttributeSet
{
    GENERATED_BODY()

public:
    // Vital attributes
    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Health)
    FGameplayAttributeData Health;
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, Health)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_MaxHealth)
    FGameplayAttributeData MaxHealth;
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, MaxHealth)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Mana)
    FGameplayAttributeData Mana;
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, Mana)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_MaxMana)
    FGameplayAttributeData MaxMana;
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, MaxMana)

    // Core stats (DnD-inspired)
    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Might)
    FGameplayAttributeData Might;       // Physical power, melee damage
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, Might)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Finesse)
    FGameplayAttributeData Finesse;     // Agility, ranged accuracy, dodge
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, Finesse)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Mind)
    FGameplayAttributeData Mind;        // Spell power, mana pool scaling
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, Mind)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Presence)
    FGameplayAttributeData Presence;    // Social skills, summoning, auras
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, Presence)

    // Meta attribute (used for damage calculation pipeline)
    UPROPERTY(BlueprintReadOnly)
    FGameplayAttributeData IncomingDamage;
    ATTRIBUTE_ACCESSORS(UTQAttributeSet, IncomingDamage)
};
```

The `ATTRIBUTE_ACCESSORS` macro generates helper functions: `GetHealthAttribute()`, `GetHealth()`, `SetHealth()`, `InitHealth()`. You will use these constantly.

**Why a meta attribute like IncomingDamage?** Instead of directly modifying Health, damage flows through IncomingDamage first. In `PostGameplayEffectExecute`, you read IncomingDamage, apply armor, resistances, and shields, then subtract the final value from Health. This gives you a single interception point for all damage processing.

---

## Setting Up GAS on a Character

Getting GAS running requires a few steps. Here is the process from scratch.

### Step 1: Enable the Plugin

In your `.Build.cs` file, add the required modules:

```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "GameplayAbilities",
    "GameplayTags",
    "GameplayTasks"
});
```

### Step 2: Create Your Attribute Set

Define your attributes as shown above. Override two critical functions:

```cpp
void UTQAttributeSet::PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue)
{
    Super::PreAttributeChange(Attribute, NewValue);

    // Clamp health to max health
    if (Attribute == GetHealthAttribute())
    {
        NewValue = FMath::Clamp(NewValue, 0.0f, GetMaxHealth());
    }
    if (Attribute == GetManaAttribute())
    {
        NewValue = FMath::Clamp(NewValue, 0.0f, GetMaxMana());
    }
}

void UTQAttributeSet::PostGameplayEffectExecute(const FGameplayEffectModCallbackData& Data)
{
    Super::PostGameplayEffectExecute(Data);

    // Process incoming damage through the pipeline
    if (Data.EvaluatedData.Attribute == GetIncomingDamageAttribute())
    {
        float LocalDamage = GetIncomingDamage();
        SetIncomingDamage(0.0f); // Reset meta attribute

        if (LocalDamage > 0.0f)
        {
            float NewHealth = GetHealth() - LocalDamage;
            SetHealth(FMath::Max(NewHealth, 0.0f));

            if (GetHealth() <= 0.0f)
            {
                // Broadcast death event via Gameplay Event
                FGameplayEventData Payload;
                Payload.EventTag = FGameplayTag::RequestGameplayTag(FName("Character.Event.Death"));
                UAbilitySystemBlueprintLibrary::SendGameplayEventToActor(
                    GetOwningActor(), Payload.EventTag, Payload);
            }
        }
    }
}
```

`PreAttributeChange` is your guardrail: it clamps values before they commit. `PostGameplayEffectExecute` is your processing pipeline: it runs after an effect applies and lets you add custom logic like damage processing, death detection, and stat-dependent triggers.

### Step 3: Add ASC to Your Character

```cpp
// In character header
UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
UAbilitySystemComponent* AbilitySystemComponent;

UPROPERTY()
UTQAttributeSet* AttributeSet;

// Implement IAbilitySystemInterface
virtual UAbilitySystemComponent* GetAbilitySystemComponent() const override;

// In character constructor
AbilitySystemComponent = CreateDefaultSubobject<UAbilitySystemComponent>(TEXT("ASC"));
AttributeSet = CreateDefaultSubobject<UTQAttributeSet>(TEXT("AttributeSet"));
```

### Step 4: Initialize Default Abilities and Effects

```cpp
void ATQCharacterBase::InitializeAbilities()
{
    if (!AbilitySystemComponent) return;

    // Grant default abilities from a data-driven list
    for (TSubclassOf<UGameplayAbility>& AbilityClass : DefaultAbilities)
    {
        AbilitySystemComponent->GiveAbility(
            FGameplayAbilitySpec(AbilityClass, 1,
            static_cast<int32>(AbilityClass.GetDefaultObject()->AbilityInputID),
            this));
    }

    // Apply default effects (base stats, passive buffs)
    for (TSubclassOf<UGameplayEffect>& EffectClass : DefaultEffects)
    {
        FGameplayEffectContextHandle ContextHandle =
            AbilitySystemComponent->MakeEffectContext();
        ContextHandle.AddSourceObject(this);

        FGameplayEffectSpecHandle SpecHandle =
            AbilitySystemComponent->MakeOutgoingSpec(EffectClass, 1, ContextHandle);

        if (SpecHandle.IsValid())
        {
            AbilitySystemComponent->ApplyGameplayEffectSpecToSelf(*SpecHandle.Data.Get());
        }
    }
}
```

---

## Gameplay Ability Lifecycle

Every ability follows a predictable lifecycle. Understanding this flow is essential.

### Phase 1: CanActivateAbility

Before an ability fires, the system checks whether activation is legal. This function evaluates:

- **Cost:** Does the character have enough mana, stamina, or action points?
- **Cooldown:** Is the ability off cooldown?
- **Tags:** Does the character have blocking tags (like `Character.State.Stunned`) or missing required tags?
- **Custom conditions:** Any logic you add (line of sight, range checks, ammo count)

```cpp
bool UGA_Fireball::CanActivateAbility(...) const
{
    if (!Super::CanActivateAbility(...))
        return false;

    // Custom check: need a clear line of sight to target
    ATQCharacter* Caster = Cast<ATQCharacter>(ActorInfo->AvatarActor.Get());
    if (!Caster || !Caster->HasLineOfSightToTarget())
        return false;

    return true;
}
```

### Phase 2: ActivateAbility

This is where the action happens. You play animations, spawn projectiles, apply effects, and trigger gameplay cues. One critical rule: **always call EndAbility when you are done.** If you forget, the ability stays "active" forever, blocking future activations.

For abilities with animations or delays, use Ability Tasks. These are asynchronous building blocks that let you wait for montages to finish, listen for gameplay events, or wait for target confirmations without blocking the game thread.

```cpp
void UGA_MeleeAttack::ActivateAbility(...)
{
    // Play attack animation montage
    UAbilityTask_PlayMontageAndWait* MontageTask =
        UAbilityTask_PlayMontageAndWait::CreatePlayMontageAndWaitProxy(
            this, NAME_None, AttackMontage, 1.0f);

    MontageTask->OnCompleted.AddDynamic(this, &UGA_MeleeAttack::OnMontageCompleted);
    MontageTask->OnCancelled.AddDynamic(this, &UGA_MeleeAttack::OnMontageCancelled);
    MontageTask->ReadyForActivation();

    // The damage application happens in an Anim Notify during the montage
    // or via a Gameplay Event sent at the right animation frame
}

void UGA_MeleeAttack::OnMontageCompleted()
{
    EndAbility(CurrentSpecHandle, CurrentActorInfo, CurrentActivationInfo, true, false);
}
```

### Phase 3: EndAbility

Cleanup. Remove temporary tags, clear targeting data, notify other systems. The `bWasCancelled` parameter tells you whether the ability ended naturally or was interrupted (by a stun, death, or another ability).

```cpp
void UGA_MeleeAttack::EndAbility(...)
{
    if (bWasCancelled)
    {
        // Interrupted: maybe refund partial resources
    }

    Super::EndAbility(Handle, ActorInfo, ActivationInfo, bReplicateEndAbility, bWasCancelled);
}
```

---

## Gameplay Effects in Depth

### Instant Effects: Damage and Healing

```cpp
// This is typically set up as a Blueprint/Data Asset
// Instant damage effect targeting IncomingDamage meta attribute
// Modifier: Additive, Magnitude = ScalableFloat (can scale with level/curve)
// Tags: Damage.Type.Slashing
```

For our RPG, damage calculation might reference the attacker's Might attribute:

```
Damage = BaseDamage + (AttackerMight * 0.5) - (TargetArmor * 0.3)
```

GAS supports this through Modifier Magnitude Calculations (MMCs), which are custom classes that pull values from multiple attributes across source and target.

```cpp
float UMMC_MeleeDamage::CalculateBaseMagnitude_Implementation(const FGameplayEffectSpec& Spec) const
{
    const FGameplayTagContainer* SourceTags = Spec.CapturedSourceTags.GetAggregatedTags();
    const FGameplayTagContainer* TargetTags = Spec.CapturedTargetTags.GetAggregatedTags();

    FAggregatorEvaluateParameters EvalParams;
    EvalParams.SourceTags = SourceTags;
    EvalParams.TargetTags = TargetTags;

    float Might = 0.0f;
    GetCapturedAttributeMagnitude(MightDef, Spec, EvalParams, Might);

    float BaseDamage = 10.0f;
    return BaseDamage + (Might * 0.5f);
}
```

### Duration Effects: Buffs and Debuffs

A bard's Inspiration ability might grant +3 to all ability checks for 60 seconds:

```
Duration Policy: Has Duration
Duration Magnitude: 60 seconds
Modifier: Additive +3 to Might, Finesse, Mind, Presence
Tags Granted: Character.Status.Inspired
Period: None (constant buff, no ticking)
```

A poison effect might deal 2 damage every 3 seconds for 15 seconds:

```
Duration Policy: Has Duration
Duration Magnitude: 15 seconds
Period: 3 seconds
On Period Execute: Apply instant damage effect (2 damage, Damage.Type.Poison)
Tags Granted: Character.Status.Poisoned
```

### Infinite Effects: Passives and Equipment

A heavy armor set might permanently reduce movement speed and increase armor:

```
Duration Policy: Infinite
Modifier 1: Additive +20 to Armor
Modifier 2: Multiply 0.8 to MovementSpeed
Removal: Explicitly removed when armor is unequipped
```

### Stacking

GAS supports sophisticated stacking rules. A "Burning" effect might stack up to 3 times, increasing damage with each stack. Or it might refresh its duration on re-application without stacking damage. You configure this per-effect.

---

## Gameplay Tags for State Management

Tags are the glue that holds GAS together. Here are practical patterns for our RPG.

### Blocking Tags

An ability can declare tags that prevent its activation:

```
// Fireball ability
Activation Blocked Tags: Character.State.Stunned, Character.State.Silenced
Activation Required Tags: Character.State.Alive
```

This means: the character must be alive and must not be stunned or silenced to cast Fireball. You never write if-statements for this; you just configure the tags on the ability.

### Granting Tags During Activation

While an ability is active, it can add tags to the character:

```
// Shield Block ability
Activation Owned Tags: Character.State.Blocking
// While blocking is active, other systems can check for this tag
// Incoming attacks see "Character.State.Blocking" and reduce damage
```

### Cooldown Tags

GAS uses tags for cooldowns rather than simple timers. When Fireball goes on cooldown, it applies a Gameplay Effect that grants the tag `Ability.Cooldown.Fireball` for 6 seconds. The ability's `CanActivate` checks whether that tag is present. This means other abilities or effects can modify cooldowns by manipulating the tag or the cooldown effect's duration.

### Event Tags

You can send gameplay events via tags, which trigger abilities that are listening:

```cpp
// When a character takes damage, send an event
FGameplayEventData EventData;
EventData.EventTag = FGameplayTag::RequestGameplayTag("Character.Event.DamageTaken");
EventData.EventMagnitude = DamageAmount;
UAbilitySystemBlueprintLibrary::SendGameplayEventToActor(TargetActor, EventData.EventTag, EventData);

// A reactive ability (like "Thorns" or "Riposte") listens for this event
// and activates automatically when it fires
```

---

## Turn-Based vs Real-Time Combat with GAS

One of the most powerful aspects of GAS for our game is that the same ability definitions work in both modes. The abilities do not care whether they were triggered by a player clicking a button in a turn-based UI or by pressing a key in real-time combat.

### Turn-Based Mode

In turn-based mode, you add a layer on top of GAS:

1. **Turn Manager** controls whose turn it is and grants the tag `Character.State.ActiveTurn` to the current actor
2. Abilities check for `Character.State.ActiveTurn` as a required tag (or you gate activation through the UI)
3. Action points (an attribute) limit how many abilities a character can use per turn
4. After each ability resolves, the Turn Manager checks remaining action points
5. When action points hit zero (or the player ends their turn), the Turn Manager moves to the next character

```cpp
// Turn Manager pseudocode
void ATurnManager::StartTurn(ATQCharacter* Character)
{
    CurrentCharacter = Character;

    // Grant active turn tag
    FGameplayTagContainer TurnTag;
    TurnTag.AddTag(FGameplayTag::RequestGameplayTag("Character.State.ActiveTurn"));
    Character->GetAbilitySystemComponent()->AddLooseGameplayTags(TurnTag);

    // Reset action points via a Gameplay Effect
    ApplyActionPointRefresh(Character);

    // Notify UI
    OnTurnStarted.Broadcast(Character);
}
```

### Real-Time Mode

In real-time mode, abilities activate on input with cooldowns governing the pacing. The same Fireball ability works, but now the cooldown tag (`Ability.Cooldown.Fireball`) is doing the timing work that the turn system was doing before.

The beauty: your Fireball ability class does not change. The animation, damage calculation, and visual effects are identical. Only the activation trigger differs.

---

## Gameplay Cues: Visual and Audio Feedback

Gameplay Cues are the presentation layer of GAS. When a Fireball hits, the damage is handled by a Gameplay Effect, but the explosion particles, the impact sound, and the screen shake are handled by a Gameplay Cue.

Cues are triggered by tags (surprise, surprise). When a Gameplay Effect with the tag `GameplayCue.Damage.Fire` applies, the engine looks for a matching Gameplay Cue Notify actor or static function and executes it.

```
// Cue tags follow a strict naming convention
GameplayCue.Ability.Fireball.Cast      // Fire particles at caster's hands
GameplayCue.Ability.Fireball.Impact    // Explosion at target location
GameplayCue.Status.Burning             // Looping fire particles on burning character
GameplayCue.Status.Healing             // Green glow while healing over time
```

There are two types:

- **GameplayCueNotify_Static:** Fire-and-forget. Play a sound, spawn a one-shot particle. No persistent state.
- **GameplayCueNotify_Actor:** Spawns an actor that persists. Looping effects like burning flames, shield auras, or buff indicators. Automatically destroyed when the associated Gameplay Effect ends.

```cpp
// In a Gameplay Cue Notify Actor (Blueprint is more common for these)
void AGameplayCueNotify_Burning::OnActive(AActor* Target, const FGameplayCueParameters& Parameters)
{
    // Attach fire particle system to target
    FireParticleComponent = UNiagaraFunctionLibrary::SpawnSystemAttached(
        FireEffect, Target->GetRootComponent(), NAME_None,
        FVector::ZeroVector, FRotator::ZeroRotator,
        EAttachLocation::KeepRelativeOffset, true);
}

void AGameplayCueNotify_Burning::OnRemove(AActor* Target, const FGameplayCueParameters& Parameters)
{
    // Clean up fire particles
    if (FireParticleComponent)
    {
        FireParticleComponent->DestroyComponent();
    }
}
```

---

## Putting It All Together: A Complete Ability Example

Let us walk through a Fireball ability from start to finish.

1. **Player presses the Fireball key** (or selects it in the turn-based UI)
2. **ASC calls CanActivateAbility** on GA_Fireball
   - Checks: enough Mana? Not on cooldown (`Ability.Cooldown.Fireball` tag absent)? Not stunned? Not silenced?
3. **ActivateAbility fires**
   - Commits the ability (deducts Mana cost via a cost Gameplay Effect)
   - Plays the casting animation montage via an Ability Task
   - At the right animation frame, spawns the projectile actor
4. **Projectile hits target**
   - Applies a Gameplay Effect to the target: IncomingDamage = BaseDamage + (Mind * ScalingFactor)
   - The effect carries the tag `Damage.Type.Fire`
   - A Gameplay Cue (`GameplayCue.Ability.Fireball.Impact`) triggers: explosion particles, impact sound, camera shake
5. **Target's PostGameplayEffectExecute processes the damage**
   - Reads IncomingDamage, checks fire resistance, applies armor
   - Subtracts final damage from Health
   - If Health <= 0, broadcasts death event
6. **Cooldown effect applies** on the caster
   - Grants `Ability.Cooldown.Fireball` tag for 6 seconds (or until the next turn in turn-based mode)
7. **EndAbility is called**
   - Cleans up the ability state

Every single piece of this flow is configurable through data. You can change damage numbers, cooldown durations, mana costs, required tags, and visual effects without touching C++ code. That is the power of GAS.

---

## Summary

| Concept | Role | Analogy |
|---|---|---|
| AbilitySystemComponent | The brain that manages everything | Character's nervous system |
| Gameplay Abilities | Individual actions characters perform | Recipe cards |
| Gameplay Effects | Modifications to attributes | Official processing forms |
| Gameplay Tags | Hierarchical state labels | Filing system |
| Attribute Sets | Numerical stats (Health, Might, etc.) | The character sheet |

GAS is a big system. You will not learn it in a day. But once you understand these five pieces and how they connect, you can build any ability your tabletop RPG needs. Start small (a basic melee attack), layer on complexity (add damage types, cooldowns, costs), and before long you will have a combat system that would make any DM proud.
