# Gameplay Ability System (GAS) Quick Reference

Dense reference for UE5's Gameplay Ability System. GAS is powerful but has a steep setup curve. This cheatsheet covers the essential pieces, the lifecycle, and the most common patterns.

---

## Setup Checklist

Before any GAS features work, you need these pieces in place:

1. **Add GAS module** to your `.Build.cs`:
```cpp
PublicDependencyModuleNames.AddRange(new string[] {
    "GameplayAbilities",
    "GameplayTags",
    "GameplayTasks"
});
```

2. **Create an AbilitySystemComponent (ASC)** and add it to your character:
```cpp
// In header
UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="GAS")
UAbilitySystemComponent* AbilitySystemComponent;

// In constructor
AbilitySystemComponent = CreateDefaultSubobject<UAbilitySystemComponent>(TEXT("AbilitySystemComp"));
```

3. **Implement IAbilitySystemInterface** on your character (or PlayerState):
```cpp
class AMyCharacter : public ACharacter, public IAbilitySystemInterface
{
    virtual UAbilitySystemComponent* GetAbilitySystemComponent() const override
    {
        return AbilitySystemComponent;
    }
};
```

4. **Create an AttributeSet** subclass for your stats (Health, Mana, etc.)

5. **Create GameplayAbility subclasses** for each ability

6. **Grant abilities** to the ASC (usually in BeginPlay or PossessedBy)

**Where to put the ASC:** For single-player, put it on the Character. For multiplayer, put it on PlayerState so it persists across respawns.

---

## AbilitySystemComponent (ASC)

The ASC is the central hub. It owns abilities, attributes, and effects.

```cpp
// Grant an ability (usually in PossessedBy or BeginPlay, server-side)
FGameplayAbilitySpec Spec(AbilityClass, Level, InputID, this);
AbilitySystemComponent->GiveAbility(Spec);

// Try to activate an ability by class
AbilitySystemComponent->TryActivateAbilityByClass(UGA_Fireball::StaticClass());

// Try to activate by tag
FGameplayTagContainer AbilityTags;
AbilityTags.AddTag(FGameplayTag::RequestGameplayTag(FName("Ability.Skill.Fireball")));
AbilitySystemComponent->TryActivateAbilitiesByTag(AbilityTags);

// Get all active abilities
TArray<FGameplayAbilitySpec> ActiveAbilities;
// Iterate: AbilitySystemComponent->GetActivatableAbilities()

// Apply a GameplayEffect
FGameplayEffectContextHandle Context = AbilitySystemComponent->MakeEffectContext();
Context.AddSourceObject(this);
FGameplayEffectSpecHandle Spec = AbilitySystemComponent->MakeOutgoingSpec(DamageEffectClass, Level, Context);
AbilitySystemComponent->ApplyGameplayEffectSpecToSelf(*Spec.Data.Get());

// Apply effect to a target
AbilitySystemComponent->ApplyGameplayEffectSpecToTarget(*Spec.Data.Get(), TargetASC);

// Listen for tag changes
AbilitySystemComponent->RegisterGameplayTagEvent(
    FGameplayTag::RequestGameplayTag(FName("State.Stunned")),
    EGameplayTagEventType::NewOrRemoved
).AddUObject(this, &AMyCharacter::OnStunnedTagChanged);
```

---

## AttributeSet

Holds the numeric stats (Health, Mana, Damage, etc.). The ASC owns one or more AttributeSets.

```cpp
// MyAttributeSet.h
#pragma once
#include "AttributeSet.h"
#include "AbilitySystemComponent.h"
#include "MyAttributeSet.generated.h"

// This macro generates GetHealthAttribute(), GetHealth(), SetHealth(), InitHealth()
#define ATTRIBUTE_ACCESSORS(ClassName, PropertyName) \
    GAMEPLAYATTRIBUTE_PROPERTY_GETTER(ClassName, PropertyName) \
    GAMEPLAYATTRIBUTE_VALUE_GETTER(PropertyName) \
    GAMEPLAYATTRIBUTE_VALUE_SETTER(PropertyName) \
    GAMEPLAYATTRIBUTE_VALUE_INITTER(PropertyName)

UCLASS()
class UMyAttributeSet : public UAttributeSet
{
    GENERATED_BODY()

public:
    UPROPERTY(BlueprintReadOnly, ReplicatedUsing=OnRep_Health, Category="Vital")
    FGameplayAttributeData Health;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, Health)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing=OnRep_MaxHealth, Category="Vital")
    FGameplayAttributeData MaxHealth;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, MaxHealth)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing=OnRep_Mana, Category="Vital")
    FGameplayAttributeData Mana;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, Mana)

    // Meta attribute: not replicated, used as a temporary container for damage calculations
    UPROPERTY(BlueprintReadOnly, Category="Damage")
    FGameplayAttributeData Damage;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, Damage)

    // Clamp values before they change
    virtual void PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue) override;

    // React after a GameplayEffect modifies an attribute
    virtual void PostGameplayEffectExecute(const FGameplayEffectModCallbackData& Data) override;

    // Replication
    UFUNCTION() void OnRep_Health(const FGameplayAttributeData& OldHealth);
    UFUNCTION() void OnRep_MaxHealth(const FGameplayAttributeData& OldMaxHealth);
    UFUNCTION() void OnRep_Mana(const FGameplayAttributeData& OldMana);

    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;
};
```

### Key Overrides

```cpp
// PreAttributeChange: clamp BEFORE the value is set
void UMyAttributeSet::PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue)
{
    Super::PreAttributeChange(Attribute, NewValue);

    if (Attribute == GetMaxHealthAttribute())
    {
        NewValue = FMath::Max(NewValue, 1.f);  // MaxHealth never below 1
    }
}

// PostGameplayEffectExecute: react AFTER an effect applies
void UMyAttributeSet::PostGameplayEffectExecute(const FGameplayEffectModCallbackData& Data)
{
    Super::PostGameplayEffectExecute(Data);

    if (Data.EvaluatedData.Attribute == GetDamageAttribute())
    {
        const float LocalDamage = GetDamage();
        SetDamage(0.f);  // Reset meta attribute

        if (LocalDamage > 0.f)
        {
            const float NewHealth = GetHealth() - LocalDamage;
            SetHealth(FMath::Clamp(NewHealth, 0.f, GetMaxHealth()));

            if (GetHealth() <= 0.f)
            {
                // Trigger death logic
            }
        }
    }
}
```

---

## GameplayAbility Lifecycle

Every ability follows this flow:

```
CanActivateAbility() --> ActivateAbility() --> CommitAbility() --> [Do Work] --> EndAbility()
       |                                            |
       | (fails: blocked by                         | (fails: not enough
       |  tags or cooldown)                         |  mana/cost, or on cooldown)
       v                                            v
   Not activated                               CancelAbility()
```

### Subclassing a GameplayAbility

```cpp
UCLASS()
class UGA_FireballAbility : public UGameplayAbility
{
    GENERATED_BODY()

public:
    UGA_FireballAbility();

    virtual void ActivateAbility(
        const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayAbilityActivationInfo ActivationInfo,
        const FGameplayEventData* TriggerEventData) override;

    virtual void CancelAbility(
        const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayAbilityActivationInfo ActivationInfo,
        bool bReplicateCancelAbility) override;

    virtual bool CanActivateAbility(
        const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayTagContainer* SourceTags,
        const FGameplayTagContainer* TargetTags,
        FGameplayTagContainer* OptionalRelevantTags) const override;
};

// In constructor: set tags
UGA_FireballAbility::UGA_FireballAbility()
{
    // This ability has these tags
    AbilityTags.AddTag(FGameplayTag::RequestGameplayTag(FName("Ability.Skill.Fireball")));

    // This ability is blocked if the owner has any of these tags
    BlockAbilitiesWithTag.AddTag(FGameplayTag::RequestGameplayTag(FName("State.Stunned")));

    // This ability is cancelled if these tags are added to the owner while active
    CancelAbilitiesWithTag.AddTag(FGameplayTag::RequestGameplayTag(FName("State.Dead")));

    // Instancing policy
    InstancingPolicy = EGameplayAbilityInstancingPolicy::InstancedPerActor;
}

void UGA_FireballAbility::ActivateAbility(...)
{
    if (!CommitAbility(Handle, ActorInfo, ActivationInfo))
    {
        EndAbility(Handle, ActorInfo, ActivationInfo, true, true);  // Cancelled
        return;
    }

    // Do the actual ability work: spawn projectile, play montage, apply effects
    // ...

    EndAbility(Handle, ActorInfo, ActivationInfo, true, false);  // Completed successfully
}
```

### Instancing Policies

| Policy | Meaning | When to Use |
|--------|---------|-------------|
| **NonInstanced** | One shared CDO. No state. | Simple abilities with no internal state. |
| **InstancedPerActor** | One instance per ASC. Reused. | Most common. Abilities that track state per character. |
| **InstancedPerExecution** | New instance each activation. | Abilities that can overlap (e.g., multiple projectiles in flight). |

---

## GameplayEffect Types

GameplayEffects (GE) are data assets that modify attributes. They do NOT contain logic; they are pure data.

| Type | Duration | Use Case |
|------|----------|----------|
| **Instant** | Applied and done in one frame. | Damage, healing, resource costs. |
| **Duration** | Lasts for a set time, then auto-removes. | Buffs (10s speed boost), debuffs (5s slow). |
| **Infinite** | Lasts until manually removed. | Passive abilities, equipment bonuses, auras. |
| **Periodic** | Ticks at an interval for a duration or infinitely. | Damage over time, heal over time, mana regen. |

### Setting up in C++ (more commonly done in Blueprints)

```cpp
// Most GameplayEffects are created as Blueprint assets in the editor.
// In C++, you typically just reference and apply them:

UPROPERTY(EditDefaultsOnly, Category="Effects")
TSubclassOf<UGameplayEffect> DamageEffectClass;

// Then apply:
FGameplayEffectContextHandle Context = ASC->MakeEffectContext();
FGameplayEffectSpecHandle Spec = ASC->MakeOutgoingSpec(DamageEffectClass, 1, Context);
Spec.Data->SetSetByCallerMagnitude(FGameplayTag::RequestGameplayTag(FName("Data.Damage")), 50.f);
ASC->ApplyGameplayEffectSpecToTarget(*Spec.Data.Get(), TargetASC);
```

### Modifiers

| Operation | What It Does | Example |
|-----------|-------------|---------|
| **Add** | Adds value to attribute. | +20 Health |
| **Multiply** | Multiplies current value. | 1.5x movement speed |
| **Divide** | Divides current value. | 0.5 (halves the stat) |
| **Override** | Replaces the value entirely. | Set Health to 100 |
| **Attribute-based** | Modifier magnitude comes from another attribute. | Damage scales with Strength attribute |

**SetByCaller:** Instead of hardcoding magnitude in the GE, pass it at runtime:
```cpp
Spec.Data->SetSetByCallerMagnitude(DamageTag, CalculatedDamage);
```

---

## GameplayTags

Hierarchical labels used throughout GAS for identification, filtering, and logic.

### Structure
```
Ability.Skill.Fireball
Ability.Skill.IceBlast
State.Stunned
State.Dead
State.Invulnerable
Cooldown.Ability.Fireball
Data.Damage
Item.Weapon.Sword
```

### Tag Queries

```cpp
// Single tag check
bool bHas = TagContainer.HasTag(FGameplayTag::RequestGameplayTag(FName("State.Stunned")));

// Has ANY of these tags (OR logic)
bool bHasAny = TagContainer.HasAny(RequiredTags);

// Has ALL of these tags (AND logic)
bool bHasAll = TagContainer.HasAll(RequiredTags);

// Exact match (no hierarchy)
bool bExact = TagContainer.HasTagExact(SomeTag);

// With hierarchy: "State.Stunned" MATCHES query for "State" (parent matches)
// Without hierarchy (HasTagExact): "State.Stunned" does NOT match "State"
```

### Tag-based Ability Blocking

Set these in the GameplayAbility constructor or in Blueprint defaults:

| Property | What It Does |
|----------|-------------|
| **AbilityTags** | Tags that identify THIS ability. |
| **CancelAbilitiesWithTag** | If this ability activates, cancel any active ability that has these tags. |
| **BlockAbilitiesWithTag** | While this ability is active, prevent activation of abilities with these tags. |
| **ActivationOwnedTags** | Tags added to the owner while this ability is active. Removed when it ends. |
| **ActivationRequiredTags** | Owner must have ALL these tags for this ability to activate. |
| **ActivationBlockedTags** | Owner must have NONE of these tags for this ability to activate. |

---

## Gameplay Cues

Visual/audio feedback tied to GameplayEffects or triggered manually. Tag must start with `GameplayCue.`

| Type | When It Fires | Use Case |
|------|--------------|----------|
| **Executed** | One-shot, fires once. | Hit impact VFX, damage number popup. |
| **Added** | When a GE with this cue is applied. | Start looping fire particles on a burning enemy. |
| **Removed** | When that GE is removed. | Stop the fire particles. |
| **WhileActive** | Continuously while the GE is active. | Ongoing glow or sound. |

### Triggering Cues

```cpp
// From a GameplayEffect: set the Gameplay Cue tag in the GE asset, it fires automatically.

// Manually from C++:
FGameplayCueParameters Params;
Params.Location = ImpactLocation;
ASC->ExecuteGameplayCue(FGameplayTag::RequestGameplayTag(FName("GameplayCue.Impact.Fire")), Params);

// Add/Remove (for looping cues)
ASC->AddGameplayCue(CueTag, Params);
ASC->RemoveGameplayCue(CueTag);
```

### Gameplay Cue Notify Classes

- **GameplayCueNotify_Static**: Stateless, one-shot effects. Cheaper. Good for impacts.
- **GameplayCueNotify_Actor**: Stateful, spawns an actor. Good for persistent/looping effects (fire aura, shield bubble).

**Naming convention:** The Gameplay Cue Notify asset name must match the tag path: `GC_Impact_Fire` for tag `GameplayCue.Impact.Fire`.

---

## Prediction (Multiplayer)

GAS supports client-side prediction for responsiveness. The client predicts the ability activation and effect application locally, then the server confirms or rolls back.

**What gets predicted:**
- Ability activation
- GameplayEffect application (instant and duration)
- Montage playback
- Gameplay Cue execution

**What does NOT get predicted:**
- Attribute changes from periodic effects
- GameplayEffect removal

**Key concept:** When the client predicts and the server confirms, the client's prediction is kept. If the server rejects, the client rolls back the predicted changes. This is handled automatically by the ASC when abilities have the correct settings.

```cpp
// In ability constructor
NetExecutionPolicy = EGameplayAbilityNetExecutionPolicy::LocalPredicted;
// LocalPredicted = client predicts, server authoritative
// LocalOnly = client only, no server involvement
// ServerInitiated = server only, no client prediction
// ServerOnly = runs on server, no client-side anything
```

---

## Common Patterns

### Damage Pipeline

The standard flow for dealing damage in GAS:

1. **Ability calculates raw damage** (base damage, scaling, random variance)
2. **Create a GameplayEffect Spec** with SetByCaller magnitude for the damage value
3. **Apply the GE to the target's ASC**, which modifies the `Damage` meta attribute
4. **PostGameplayEffectExecute** on the target's AttributeSet reads `Damage`, subtracts from `Health`, clamps, and resets `Damage` to 0
5. **If Health <= 0**, trigger death (apply a "State.Dead" tag, broadcast an event)

```cpp
// In the ability:
float FinalDamage = BaseDamage * DamageMultiplier;

FGameplayEffectSpecHandle DamageSpec = MakeOutgoingGameplayEffectSpec(DamageEffectClass, GetAbilityLevel());
DamageSpec.Data->SetSetByCallerMagnitude(
    FGameplayTag::RequestGameplayTag(FName("Data.Damage")),
    FinalDamage
);

ApplyGameplayEffectSpecToTarget(CurrentSpecHandle, CurrentActorInfo, CurrentActivationInfo,
    DamageSpec, TargetData);
```

### Cooldowns

Cooldowns are simply Duration GameplayEffects with a Gameplay Tag:

1. Create a GE with Duration type, set the duration (e.g., 5 seconds)
2. Give it a tag like `Cooldown.Ability.Fireball`
3. On the ability, set `CooldownGameplayEffectClass` to this GE
4. The ASC automatically checks for cooldown tags before allowing activation

```cpp
// In ability class
CooldownGameplayEffectClass = UCooldown_Fireball::StaticClass();

// The engine handles the rest. CommitAbility() applies the cooldown GE.
```

### Costs (Mana, Stamina, etc.)

Costs are Instant GameplayEffects that subtract from an attribute:

1. Create an Instant GE that modifies Mana by -30 (Add, magnitude -30)
2. Set it as the ability's `CostGameplayEffectClass`
3. `CommitAbility()` checks if the character has enough, then applies the cost

```cpp
CostGameplayEffectClass = UCost_Fireball::StaticClass();
// CommitAbility() = CommitCost() + CommitCooldown()
// If cost check fails, CommitAbility returns false
```

### Passive Abilities

1. Create an ability that applies an Infinite GE on activation and never calls EndAbility
2. Grant and immediately activate it on BeginPlay
3. The Infinite GE stays until the ability is removed

### Stacking Effects

Configure in the GameplayEffect asset:

| Property | Options |
|----------|---------|
| **Stacking Type** | None, AggregateBySource, AggregateByTarget |
| **Stack Limit** | Max number of stacks |
| **Duration Refresh Policy** | RefreshOnSuccessfulApplication, NeverRefresh |
| **Period Reset Policy** | ResetOnSuccessfulApplication, NeverReset |
| **Overflow Effects** | GE to apply when stack limit is reached |

Example: A poison DoT that stacks up to 5 times, refreshing duration on each new application.

---

## Quick Setup: Minimal GAS Character

For a character that can receive damage and have abilities:

1. `Build.cs`: Add the three GAS modules
2. Character class: Add ASC, implement IAbilitySystemInterface, create AttributeSet in constructor
3. AttributeSet: Define Health, MaxHealth, Damage with ATTRIBUTE_ACCESSORS
4. AttributeSet: Override PostGameplayEffectExecute to handle Damage -> Health
5. Create a Blueprint GameplayEffect for damage (Instant, modifies Damage attribute, SetByCaller)
6. Create a Blueprint GameplayAbility subclass for your first ability
7. Grant the ability in PossessedBy or BeginPlay
8. Activate via input binding or tag

That is the minimal loop. Everything else (cues, prediction, stacking, cooldowns) builds on top of this foundation.
