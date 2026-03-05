## Gameplay Ability System (GAS)

The Gameplay Ability System is a plugin framework for building ability-driven gameplay. It handles abilities, attributes, effects, tags, and prediction in a network-aware, data-driven manner.

**Enabling GAS:**
- Edit > Plugins > Gameplay Abilities (enabled by default in most templates)
- Module dependencies in Build.cs: `"GameplayAbilities"`, `"GameplayTags"`, `"GameplayTasks"`

> **In your games:**
>
> **DnD Tabletop RPG:**
> GAS is the backbone of your entire combat system. Every ability for all 6 classes (Warrior, Rogue, Cleric, Wizard, Ranger, Bard) is a Gameplay Ability. Every stat (Health, Mana, Strength, Dexterity, etc.) is a Gameplay Attribute. Every buff, debuff, damage-over-time, and healing effect is a Gameplay Effect. Every status (Burning, Frozen, Blessed, Poisoned) is a Gameplay Tag. This is the system your game revolves around.
>
> **Wizard's Chess:**
> GAS is lighter here but still useful. Each piece type can have a "capture ability" that triggers the shatter animation and applies effects to the board state. Alternatively, you could skip GAS entirely for Wizard's Chess and handle piece logic with simpler game code. But if you want piece power-ups or special abilities (enchanted pieces, magical board effects), GAS gives you a clean framework.

---

### Ability System Component

The `UAbilitySystemComponent` (ASC) is the central hub. It is typically placed on the Player State (for player-controlled characters) or on the Pawn/Character directly (for AI).

**Setup:**
```cpp
// In your Character or PlayerState header
UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
UAbilitySystemComponent* AbilitySystemComponent;

UPROPERTY()
UMyAttributeSet* Attributes;

// In constructor
AbilitySystemComponent = CreateDefaultSubobject<UAbilitySystemComponent>(TEXT("AbilitySystemComponent"));
Attributes = CreateDefaultSubobject<UMyAttributeSet>(TEXT("Attributes"));
```

**Initialization (if ASC lives on PlayerState):**
```cpp
void AMyCharacter::PossessedBy(AController* NewController)
{
    Super::PossessedBy(NewController);
    if (AMyPlayerState* PS = GetPlayerState<AMyPlayerState>())
    {
        AbilitySystemComponent = PS->GetAbilitySystemComponent();
        AbilitySystemComponent->InitAbilityActorInfo(PS, this);
    }
}
```

**Granting Abilities:**
```cpp
if (HasAuthority() && AbilitySystemComponent)
{
    for (TSubclassOf<UGameplayAbility>& Ability : DefaultAbilities)
    {
        FGameplayAbilitySpec Spec(Ability, 1, INDEX_NONE, this);
        AbilitySystemComponent->GiveAbility(Spec);
    }
}
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Place the ASC on the **Character** directly (not PlayerState) for both player characters and AI enemies. Since this is a single-player or local co-op game with no server replication, the simpler per-character approach works perfectly.
> - Each character class grants different default abilities on spawn:
>   - **Warrior**: `GA_HeavyStrike`, `GA_ShieldBash`, `GA_Cleave`, `GA_BattleCry`
>   - **Rogue**: `GA_Backstab`, `GA_ShadowStep`, `GA_PoisonBlade`, `GA_Evasion`
>   - **Cleric**: `GA_HealingWord`, `GA_DivineSmite`, `GA_TurnUndead`, `GA_Bless`
>   - **Wizard**: `GA_Fireball`, `GA_IceStorm`, `GA_LightningBolt`, `GA_ArcaneShield`
>   - **Ranger**: `GA_PowerShot`, `GA_MultiShot`, `GA_HuntersMark`, `GA_NatureBond`
>   - **Bard**: `GA_InspiringSong`, `GA_DiscordantNote`, `GA_HealingMelody`, `GA_MockingWords`
> - AI enemies also get ASCs with their own ability sets:
>   - **Goblin**: `GA_GoblinSlash`, `GA_GoblinFlee`
>   - **Skeleton**: `GA_BoneStrike`, `GA_ReassembleR`
>   - **Wraith**: `GA_LifeDrain`, `GA_PhaseShift`
>   - **Dragon**: `GA_FireBreath`, `GA_TailSwipe`, `GA_WingBuffet`, `GA_FrightfulPresence`
>
> **Wizard's Chess:**
> - If using GAS, place an ASC on each chess piece Actor. Grant capture abilities per piece type: `GA_PawnCapture`, `GA_RookCapture`, `GA_KnightCapture`, etc. Each ability triggers the piece-specific shatter animation and VFX.

---

### Gameplay Abilities

A Gameplay Ability (`UGameplayAbility`) represents a single action or skill an Actor can perform.

#### Lifecycle

1. **CanActivateAbility**: Checks tags, cooldowns, costs
2. **ActivateAbility**: Main execution entry point
3. **CommitAbility**: Applies cost and cooldown
4. **EndAbility**: Cleans up; called manually or when tasks finish

> **In your games:**
>
> **DnD Tabletop RPG:**
> Here is how the lifecycle plays out for the Wizard's Fireball:
> 1. **CanActivateAbility**: Checks that the Wizard has enough Mana (cost check), that Fireball is not on cooldown (cooldown check), that the Wizard does not have the `State.Silenced` tag (activation blocked tag), and that the Wizard does have the `State.Alive` tag (activation required tag).
> 2. **ActivateAbility**: Spawns the targeting reticle (AbilityTask_WaitTargetData). The player selects a target location. Once confirmed, plays the cast animation montage (AbilityTask_PlayMontageAndWait). On the animation notify, spawns the fireball projectile.
> 3. **CommitAbility**: Deducts 30 Mana from the Wizard's Mana attribute. Applies a 6-second cooldown via a Gameplay Effect.
> 4. **EndAbility**: Called after the fireball projectile detonates (or after the montage finishes if the cast was interrupted). Cleans up the targeting reticle and any temporary effects.
>
> For the Rogue's Backstab:
> 1. **CanActivateAbility**: Checks Stamina cost, no cooldown active, requires `State.Stealthed` tag (can only backstab while stealthed).
> 2. **ActivateAbility**: Plays the backstab animation, applies a 3x damage multiplier Gameplay Effect to the target.
> 3. **CommitAbility**: Deducts Stamina, applies 4-second cooldown, removes the `State.Stealthed` tag (attacking breaks stealth).
> 4. **EndAbility**: Cleanup.

#### Key Properties

| Property | Description |
|----------|-------------|
| `Ability Tags` | Tags that describe this ability (e.g., `Ability.Fireball`) |
| `Cancel Abilities with Tag` | Abilities with these tags are cancelled when this activates |
| `Block Abilities with Tag` | Abilities with these tags cannot activate while this is active |
| `Activation Required Tags` | Tags the owner must have to activate |
| `Activation Blocked Tags` | Tags on the owner that prevent activation |
| `Source Required Tags` | Tags the source must have |
| `Source Blocked Tags` | Tags on the source that prevent activation |
| `Target Required Tags` | Tags the target must have |
| `Target Blocked Tags` | Tags on the target that prevent this |

> **In your games:**
>
> **DnD Tabletop RPG:**
> Tag configuration examples for key abilities:
> - **GA_Fireball**:
>   - `Ability Tags`: `Ability.Spell.Fireball`, `Ability.Spell.Offensive`
>   - `Cancel Abilities with Tag`: `Ability.Spell.Channeling` (casting Fireball cancels any channeled spell)
>   - `Activation Blocked Tags`: `State.Silenced`, `State.Frozen`, `State.Dead`
>   - `Activation Required Tags`: `State.Alive`
>   - `Target Blocked Tags`: `State.Immune.Fire` (cannot target fire-immune enemies, like the Dragon)
> - **GA_HealingWord** (Cleric):
>   - `Ability Tags`: `Ability.Spell.Healing`
>   - `Activation Blocked Tags`: `State.Silenced`, `State.Dead`
>   - `Target Required Tags`: `State.Alive` (cannot heal dead targets; use Revive for that)
>   - `Target Blocked Tags`: `State.Undead` (healing harms undead in DnD, handle separately)
> - **GA_Backstab** (Rogue):
>   - `Activation Required Tags`: `State.Stealthed` (must be in stealth)
>   - `Block Abilities with Tag`: `Ability.Movement` (cannot move during backstab animation)
> - **GA_BattleCry** (Warrior):
>   - `Cancel Abilities with Tag`: `Ability.Spell` (shouting cancels any casting, for enemies too)
>   - `Activation Blocked Tags`: `State.Silenced`
>
> **Wizard's Chess:**
> - **GA_PawnCapture**:
>   - `Ability Tags`: `Ability.Capture.Pawn`
>   - `Target Required Tags`: `State.EnemyPiece` (can only capture enemy pieces)
>   - `Activation Required Tags`: `State.ValidMove` (only activates if the move is legal)

#### Instancing Policy

| Policy | Description |
|--------|-------------|
| `Instanced Per Actor` | One instance per owning Actor; reused on each activation (most common) |
| `Instanced Per Execution` | New instance every activation; supports concurrent executions |
| `Non Instanced` | No instance created; uses the CDO; best performance, most restrictive |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Instanced Per Actor** for most abilities: `GA_Fireball`, `GA_HeavyStrike`, `GA_HealingWord`, `GA_Backstab`. Each character has one instance of each ability that gets reused. This is the standard approach and works for turn-based combat where abilities do not overlap.
> - **Instanced Per Execution** for the Ranger's `GA_MultiShot`: this fires 3 arrows simultaneously, and each arrow execution needs its own state (target, damage, travel time). Three concurrent instances run at once.
> - **Non Instanced** for simple passive triggers like `GA_CounterAttack` (Warrior passive that fires on being hit). It has no internal state, just checks conditions and applies a damage effect. Best performance for abilities that fire frequently.
>
> **Wizard's Chess:**
> - **Instanced Per Actor** for all capture abilities. Only one capture happens at a time, so reusing the instance is efficient and simple.

#### Net Execution Policy

| Policy | Description |
|--------|-------------|
| `Local Predicted` | Runs on client immediately, server confirms (standard for player abilities) |
| `Local Only` | Client only; never replicates |
| `Server Initiated` | Server only; replicates effects to clients |
| `Server Only` | Server only; does not replicate |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Since this is a single-player or local game, use **Local Only** for all player abilities. There is no server to predict against. If you add online co-op later, switch player abilities to **Local Predicted** and enemy AI abilities to **Server Initiated**.
> - For the AI DM's triggered events (trap activations, ambush spawns), use **Local Only** since the DM runs locally via Ollama.
>
> **Wizard's Chess:**
> - **Local Only** for single-player vs AI matches. If you add online multiplayer later, the moving player's abilities would be **Local Predicted** and the opponent's would be **Server Initiated**.

#### C++ Custom Ability

```cpp
UCLASS()
class UGA_Fireball : public UGameplayAbility
{
    GENERATED_BODY()
public:
    UGA_Fireball();

    virtual void ActivateAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayAbilityActivationInfo ActivationInfo,
        const FGameplayEventData* TriggerEventData) override;

    virtual void EndAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayAbilityActivationInfo ActivationInfo,
        bool bReplicateEndAbility, bool bWasCancelled) override;

    virtual bool CanActivateAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayTagContainer* SourceTags,
        const FGameplayTagContainer* TargetTags,
        FGameplayTagContainer* OptionalRelevantTags) const override;
};
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> Use this pattern for every class ability. Here is a sketch for the Warrior's Heavy Strike:
> ```cpp
> UCLASS()
> class UGA_HeavyStrike : public UGameplayAbility
> {
>     GENERATED_BODY()
> public:
>     // Damage effect applied on hit
>     UPROPERTY(EditDefaultsOnly)
>     TSubclassOf<UGameplayEffect> DamageEffect;
>
>     // The strike animation montage
>     UPROPERTY(EditDefaultsOnly)
>     UAnimMontage* StrikeMontage;
>
>     // Stamina cost
>     UPROPERTY(EditDefaultsOnly)
>     float StaminaCost = 15.f;
> };
> ```
> In `ActivateAbility`, play the montage with `AbilityTask_PlayMontageAndWait`, then on the animation notify event, do a capsule sweep in front of the Warrior to find enemies, and apply `DamageEffect` to each hit target. The same pattern applies to `GA_ShieldBash`, `GA_Cleave`, `GA_DivineSmite`, and all melee abilities.

---

### Gameplay Effects

Gameplay Effects (`UGameplayEffect`) modify Attributes and apply Gameplay Tags to targets.

#### Duration Policies

| Policy | Description |
|--------|-------------|
| `Instant` | Applied once and immediately; permanently changes the base value |
| `Has Duration` | Lasts a specified time; modifier is temporary |
| `Infinite` | Lasts until explicitly removed |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Instant**: `GE_FireballDamage` (deals 8d6 fire damage to Health, applied once on impact), `GE_HealingPotion` (restores 2d4+2 Health immediately), `GE_GoldPickup` (adds gold to the player's Gold attribute).
> - **Has Duration**: `GE_Bless` (Cleric buff, +1d4 to attack rolls for 60 seconds), `GE_PoisonBlade` (Rogue's poison deals 1d4 damage per tick for 12 seconds), `GE_BattleCryBuff` (Warrior, all allies gain +2 Strength for 30 seconds).
> - **Infinite**: `GE_HuntersMark` (Ranger marks a target, bonus damage until explicitly removed or target dies), `GE_CurseOfWeakness` (Wraith debuff that lowers Strength until the Cleric removes it with a Dispel ability), `GE_EquipmentStats` (stat bonuses from equipped gear, lasts until unequipped).
>
> **Wizard's Chess:**
> - **Instant**: `GE_CaptureDestroy` (instantly sets the captured piece's Health to 0, triggering the shatter sequence).
> - **Has Duration**: `GE_BoardEnchantment` (a magical board modifier that lasts for 5 turns, e.g., "all Pawns gain +1 movement range").
> - **Infinite**: `GE_PromotionBuff` (when a Pawn reaches the back rank and promotes to Queen, permanent stat upgrade).

#### Modifiers

Each effect can have multiple modifiers, each targeting a single Attribute.

**Modifier Operations:**

| Operation | Description |
|-----------|-------------|
| `Add` | Adds value to the Attribute |
| `Multiply` | Multiplies the Attribute value |
| `Divide` | Divides the Attribute value |
| `Override` | Sets the Attribute to the modifier value |

**Modifier Magnitude Calculation:**

| Type | Description |
|------|-------------|
| `Scalable Float` | A static float value, optionally scaled by a Curve Table row and level |
| `Attribute Based` | Based on another Attribute (e.g., damage = attack power * coefficient) |
| `Custom Calculation Class` | A `UGameplayModMagnitudeCalculation` subclass for complex formulas |
| `Set By Caller` | Value set at runtime via a Gameplay Tag or FName when applying the effect |

**Attribute Based Magnitude:**
```
FinalMagnitude = (Coefficient * (PreMultiplyAdditiveValue + AttributeValue)) + PostMultiplyAdditiveValue
```

**Set By Caller example:**
```cpp
FGameplayEffectSpecHandle SpecHandle = ASC->MakeOutgoingSpec(DamageEffectClass, Level, Context);
UAbilitySystemBlueprintLibrary::AssignTagSetByCallerMagnitude(SpecHandle, FGameplayTag::RequestGameplayTag("Data.Damage"), 50.f);
ASC->ApplyGameplayEffectSpecToSelf(*SpecHandle.Data.Get());
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Add** for damage and healing: `GE_FireballDamage` adds -30 to Health (negative Add = damage). `GE_HealingWord` adds +15 to Health.
> - **Multiply** for buffs: `GE_BattleCryBuff` multiplies the Warrior's and allies' Strength by 1.25 (25% bonus). `GE_HuntersMark` multiplies the Ranger's damage against the marked target by 1.5.
> - **Override** for status effects: `GE_Frozen` overrides the target's MoveSpeed to 0 (completely immobilized). `GE_Paralysis` overrides AttackSpeed to 0.
> - **Scalable Float** for level-scaled abilities: The Wizard's Fireball uses a Curve Table where level 1 deals 20 damage, level 5 deals 50 damage, level 10 deals 100 damage. One GE scales across all levels.
> - **Attribute Based** for the Rogue's Backstab: damage = `Dexterity * 2.5 + 10`. Set `Coefficient = 2.5`, backing attribute = Dexterity, `PostMultiplyAdditiveValue = 10`.
> - **Custom Calculation Class** for the DnD dice roll formula: create `UMMCalc_DiceRoll` that simulates rolling XdY+Z dice (e.g., 3d8+5 for the Warrior's Heavy Strike). The calculation class reads the ability level to determine dice count and die type.
> - **Set By Caller** for the dice-driven damage pipeline: after rolling physical dice on the tabletop and reading the result, pass the actual rolled value into the damage effect via `AssignTagSetByCallerMagnitude` with tag `Data.DiceResult`. This bridges the physical dice roll to the GAS damage system.
>
> **Wizard's Chess:**
> - **Override** for piece capture: `GE_CaptureDestroy` overrides Health to 0, which triggers the death/shatter logic in `PostGameplayEffectExecute`.
> - **Set By Caller** to pass the capturing piece's type into the effect, so the shatter magnitude scales with the attacker. A Queen capturing produces a bigger explosion than a Pawn capturing.

#### Stacking

| Property | Description |
|----------|-------------|
| `Stacking Type` | None, Aggregate by Source, Aggregate by Target |
| `Stack Limit Count` | Maximum number of stacks |
| `Stack Duration Refresh Policy` | Refresh on successful application, Never Refresh |
| `Stack Period Reset Policy` | Reset on successful application, Never Reset |
| `Stack Expiration Policy` | Clear Entire Stack, Remove Single Stack and Refresh Duration, Refresh Duration |
| `Overflow Effects` | Effects to apply when the stack overflows |
| `Deny Overflow Application` | Prevent overflow applications entirely |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **GE_PoisonBlade** (Rogue): `Aggregate by Source`, `Stack Limit = 3`. The Rogue can apply up to 3 poison stacks on an enemy. Each stack adds 1d4 poison damage per tick. `Stack Duration Refresh Policy = Refresh` so reapplying resets the timer. At 3 stacks, the poison is at maximum potency.
> - **GE_Burning** (from Fireball): `Aggregate by Target`, `Stack Limit = 5`. Multiple fire sources stack on the same target. `Stack Expiration Policy = Remove Single Stack and Refresh Duration` so stacks fall off one at a time, giving the burning a gradual fade.
> - **GE_BardInspiration**: `Aggregate by Source`, `Stack Limit = 1`, `Deny Overflow Application = true`. The Bard cannot stack Inspiration on the same target. Reapplying just refreshes the duration.
> - **GE_SkeletonReassemble**: `Aggregate by Target`, `Stack Limit = 3`. Each time the Skeleton "dies" it gains a reassemble stack. At 3 stacks, the `Overflow Effect` triggers `GE_PermanentDeath`, and the Skeleton stays down for good.
>
> **Wizard's Chess:**
> - If implementing board enchantments, use `Aggregate by Target` with `Stack Limit = 1` on the board Actor itself. Only one enchantment active at a time. Applying a new one clears the old one.

#### Application Requirements and Conditional Effects

- **Application Tag Requirements**: Tags the target must/must not have for the effect to apply
- **Ongoing Tag Requirements**: Tags the target must maintain or the effect is temporarily removed
- **Removal Tag Requirements**: Tags that, when added to the target, remove this effect
- **Conditional Gameplay Effects**: Additional effects applied if specific conditions are met after this effect applies

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **GE_Burning** Application Tag Requirements: target must NOT have `State.Immune.Fire` (Dragons and fire elementals are immune). Target must NOT have `State.Submerged` (standing in water prevents burning).
> - **GE_BattleCryBuff** Ongoing Tag Requirements: the Warrior must maintain `State.Alive`. If the Warrior dies, the buff is temporarily removed from all allies. If the Warrior is revived, it reapplies automatically.
> - **GE_Frozen** Removal Tag Requirements: `State.Burning`. If a frozen enemy gets hit by fire, the `State.Burning` tag removes the frozen effect. This creates an interactive element system.
> - **GE_DivineSmite** Conditional Effects: if the target has the `State.Undead` tag, apply an additional `GE_SmiteBonus` that deals 2x damage. The Cleric's smite automatically hits harder against Skeletons and Wraiths.
> - **GE_PoisonBlade** Application Requirements: target must NOT have `State.Immune.Poison`. Skeletons (bones, no blood) and constructs are immune to poison.
>
> **Wizard's Chess:**
> - Capture effects require the target to have `State.EnemyPiece` and NOT have `State.Protected` (if implementing rules like pinned pieces that cannot be captured).

---

### Gameplay Tags

Gameplay Tags are hierarchical labels (e.g., `State.Dead`, `Ability.Skill.Fireball`) used throughout GAS for identification, filtering, and communication.

**Tag hierarchy:**
- Tags are dot-separated: `Category.Subcategory.Specific`
- A tag like `Ability.Skill.Fireball` is a child of `Ability.Skill` and `Ability`
- Tags can be defined in `.ini` files, Data Tables, or the Gameplay Tags Manager

**Tag Containers:**
- `FGameplayTagContainer`: Holds multiple tags
- Operations:
  - `HasTag(Tag)`: Exact match
  - `HasTagExact(Tag)`: No parent matching
  - `HasAny(Container)`: True if any tag matches
  - `HasAll(Container)`: True if all tags are present
  - `HasAnyExact(Container)`: Exact match version
  - `AddTag()`, `RemoveTag()`, `AppendTags()`

**Tag Queries:**
- `FGameplayTagQuery`: Complex boolean logic (AND, OR, NOT) for tag matching
- Build queries in Blueprint with the Tag Query editor
- C++ construction:
```cpp
FGameplayTagQuery Query = FGameplayTagQuery::MakeQuery_MatchAnyTags(
    FGameplayTagContainer(FGameplayTag::RequestGameplayTag("State.Burning"))
);
```

**Tag Table Manager:**
- Project Settings > Gameplay Tags > Gameplay Tag Table List
- Or manage in the Gameplay Tags Editor window (Window > Gameplay Tags)
- Tags can be added at runtime via `UGameplayTagsManager::AddNativeGameplayTag()`

```cpp
// In a module startup
UGameplayTagsManager::Get().AddNativeGameplayTag(FName("Ability.Skill.Fireball"), TEXT("Fireball ability tag"));
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> Define your full tag hierarchy in the Gameplay Tags Manager:
> ```
> Ability
>   Ability.Melee
>     Ability.Melee.HeavyStrike
>     Ability.Melee.Cleave
>     Ability.Melee.ShieldBash
>     Ability.Melee.Backstab
>     Ability.Melee.BoneStrike
>   Ability.Spell
>     Ability.Spell.Offensive
>       Ability.Spell.Offensive.Fireball
>       Ability.Spell.Offensive.IceStorm
>       Ability.Spell.Offensive.LightningBolt
>     Ability.Spell.Healing
>       Ability.Spell.Healing.HealingWord
>       Ability.Spell.Healing.HealingMelody
>     Ability.Spell.Buff
>       Ability.Spell.Buff.Bless
>       Ability.Spell.Buff.InspiringSong
>       Ability.Spell.Buff.BattleCry
>     Ability.Spell.Channeling
>   Ability.Ranged
>     Ability.Ranged.PowerShot
>     Ability.Ranged.MultiShot
>   Ability.Movement
>     Ability.Movement.ShadowStep
>     Ability.Movement.Dodge
>
> State
>   State.Alive
>   State.Dead
>   State.Stealthed
>   State.Silenced
>   State.Frozen
>   State.Burning
>   State.Poisoned
>   State.Blessed
>   State.Cursed
>   State.Stunned
>   State.Immune
>     State.Immune.Fire
>     State.Immune.Poison
>     State.Immune.Magic
>   State.Undead
>
> Combat
>   Combat.TurnBased
>   Combat.RealTime
>   Combat.PlayerTurn
>   Combat.EnemyTurn
>
> Data
>   Data.Damage
>   Data.DiceResult
>   Data.HealAmount
>
> Class
>   Class.Warrior
>   Class.Rogue
>   Class.Cleric
>   Class.Wizard
>   Class.Ranger
>   Class.Bard
>
> Enemy
>   Enemy.Goblin
>   Enemy.Skeleton
>   Enemy.Wraith
>   Enemy.Dragon
> ```
>
> The hierarchy is powerful. Checking `HasTag("Ability.Spell")` on a character's active abilities returns true for Fireball, IceStorm, HealingWord, and all other spells. This lets you build broad rules like "Silenced blocks all Ability.Spell children" without listing every spell individually.
>
> **Wizard's Chess:**
> ```
> Piece
>   Piece.Pawn
>   Piece.Rook
>   Piece.Knight
>   Piece.Bishop
>   Piece.Queen
>   Piece.King
>
> State
>   State.EnemyPiece
>   State.FriendlyPiece
>   State.Selected
>   State.ValidMove
>   State.InCheck
>   State.Protected
>   State.Captured
>
> Ability
>   Ability.Capture
>     Ability.Capture.Pawn
>     Ability.Capture.Rook
>     Ability.Capture.Knight
>     Ability.Capture.Bishop
>     Ability.Capture.Queen
>     Ability.Capture.King
> ```

---

### Attribute Sets

Attribute Sets (`UAttributeSet`) define numeric properties (Health, Mana, Strength, etc.) that Gameplay Effects can modify.

**Defining Attributes:**
```cpp
UCLASS()
class UMyAttributeSet : public UAttributeSet
{
    GENERATED_BODY()
public:
    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Health)
    FGameplayAttributeData Health;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, Health)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_MaxHealth)
    FGameplayAttributeData MaxHealth;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, MaxHealth)

    UPROPERTY(BlueprintReadOnly, ReplicatedUsing = OnRep_Mana)
    FGameplayAttributeData Mana;
    ATTRIBUTE_ACCESSORS(UMyAttributeSet, Mana)

    // Replication
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

    UFUNCTION()
    void OnRep_Health(const FGameplayAttributeData& OldHealth);

    // Called before an attribute is changed
    virtual void PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue) override;

    // Called after a Gameplay Effect executes
    virtual void PostGameplayEffectExecute(const FGameplayEffectModCallbackData& Data) override;
};
```

**ATTRIBUTE_ACCESSORS macro** generates:
- `static FGameplayAttribute GetHealthAttribute()`
- `float GetHealth() const`
- `void SetHealth(float NewVal)`
- `void InitHealth(float NewVal)`

> **In your games:**
>
> **DnD Tabletop RPG:**
> Define your Attribute Sets to mirror DnD character sheets:
> ```cpp
> UCLASS()
> class UDnDAttributeSet : public UAttributeSet
> {
>     GENERATED_BODY()
> public:
>     // Vitals
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Health;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Health)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData MaxHealth;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, MaxHealth)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Mana;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Mana)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData MaxMana;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, MaxMana)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Stamina;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Stamina)
>
>     // Core Stats (DnD ability scores)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Strength;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Strength)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Dexterity;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Dexterity)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Constitution;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Constitution)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Intelligence;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Intelligence)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Wisdom;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Wisdom)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Charisma;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, Charisma)
>
>     // Combat
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData ArmorClass;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, ArmorClass)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData AttackPower;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, AttackPower)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData MoveSpeed;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, MoveSpeed)
>
>     // Meta (not displayed, used for calculations)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData IncomingDamage;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, IncomingDamage)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData IncomingHealing;
>     ATTRIBUTE_ACCESSORS(UDnDAttributeSet, IncomingHealing)
> };
> ```
> Each class starts with different base values:
> - **Warrior**: Strength 16, Constitution 14, Health 45, Stamina 100, Mana 0
> - **Rogue**: Dexterity 16, Charisma 12, Health 30, Stamina 120, Mana 0
> - **Cleric**: Wisdom 16, Constitution 14, Health 35, Mana 80
> - **Wizard**: Intelligence 16, Wisdom 12, Health 22, Mana 120
> - **Ranger**: Dexterity 14, Wisdom 14, Health 35, Stamina 80, Mana 40
> - **Bard**: Charisma 16, Dexterity 14, Health 28, Mana 90
>
> **Wizard's Chess:**
> If using GAS for pieces:
> ```cpp
> UCLASS()
> class UChessPieceAttributeSet : public UAttributeSet
> {
>     GENERATED_BODY()
> public:
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData Health;
>     ATTRIBUTE_ACCESSORS(UChessPieceAttributeSet, Health)
>     UPROPERTY(BlueprintReadOnly) FGameplayAttributeData PieceValue;
>     ATTRIBUTE_ACCESSORS(UChessPieceAttributeSet, PieceValue)
> };
> ```
> Piece values: Pawn=1, Knight=3, Bishop=3, Rook=5, Queen=9, King=99. The PieceValue attribute drives shatter VFX intensity.

**PreAttributeChange:**
- Called before any modification; use for clamping
- Modifies the new value before it is applied
- Only affects the "current" value, not the base value
```cpp
void UMyAttributeSet::PreAttributeChange(const FGameplayAttribute& Attribute, float& NewValue)
{
    Super::PreAttributeChange(Attribute, NewValue);
    if (Attribute == GetHealthAttribute())
    {
        NewValue = FMath::Clamp(NewValue, 0.f, GetMaxHealth());
    }
}
```

**PostGameplayEffectExecute:**
- Called after an instant Gameplay Effect modifies an attribute
- Good place for damage logic, death checks, clamping base values
```cpp
void UMyAttributeSet::PostGameplayEffectExecute(const FGameplayEffectModCallbackData& Data)
{
    Super::PostGameplayEffectExecute(Data);
    if (Data.EvaluatedData.Attribute == GetHealthAttribute())
    {
        SetHealth(FMath::Clamp(GetHealth(), 0.f, GetMaxHealth()));
        if (GetHealth() <= 0.f)
        {
            // Handle death
        }
    }
}
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> Your `PreAttributeChange` should clamp all vitals and stats:
> ```cpp
> void UDnDAttributeSet::PreAttributeChange(
>     const FGameplayAttribute& Attribute, float& NewValue)
> {
>     Super::PreAttributeChange(Attribute, NewValue);
>     if (Attribute == GetHealthAttribute())
>         NewValue = FMath::Clamp(NewValue, 0.f, GetMaxHealth());
>     else if (Attribute == GetManaAttribute())
>         NewValue = FMath::Clamp(NewValue, 0.f, GetMaxMana());
>     else if (Attribute == GetStaminaAttribute())
>         NewValue = FMath::Clamp(NewValue, 0.f, 100.f);
>     else if (Attribute == GetMoveSpeedAttribute())
>         NewValue = FMath::Max(NewValue, 0.f); // Cannot go negative
> }
> ```
>
> Your `PostGameplayEffectExecute` handles the damage pipeline and death:
> ```cpp
> void UDnDAttributeSet::PostGameplayEffectExecute(
>     const FGameplayEffectModCallbackData& Data)
> {
>     Super::PostGameplayEffectExecute(Data);
>
>     if (Data.EvaluatedData.Attribute == GetIncomingDamageAttribute())
>     {
>         float Damage = GetIncomingDamage();
>         SetIncomingDamage(0.f); // Reset meta attribute
>
>         // Apply armor reduction
>         float Reduction = GetArmorClass() * 0.5f;
>         float FinalDamage = FMath::Max(Damage - Reduction, 0.f);
>
>         SetHealth(FMath::Clamp(GetHealth() - FinalDamage, 0.f, GetMaxHealth()));
>
>         if (GetHealth() <= 0.f)
>         {
>             // Trigger death: ragdoll, XP reward, loot drop
>             // Add State.Dead tag, remove State.Alive
>         }
>     }
> }
> ```
> This is where you wire in the DnD armor class reduction formula. Damage comes in via the `IncomingDamage` meta attribute, gets reduced by ArmorClass, and the result is subtracted from Health.
>
> **Wizard's Chess:**
> In `PostGameplayEffectExecute`, when Health reaches 0, trigger the piece capture sequence: play the shatter animation, spawn debris, update the board state, and check for checkmate.

**Replication:**
- Attributes replicate through `DOREPLIFETIME_CONDITION_NOTIFY`
- Use `COND_None` for attributes all clients need, `COND_OwnerOnly` for private attributes

> **In your games:**
>
> **DnD Tabletop RPG:**
> - For single-player, replication is not critical. But set it up correctly now so online co-op is easier later. Use `COND_None` for Health and visible stats (all players should see each other's health bars). Use `COND_OwnerOnly` for Mana and Stamina if you want those private to the individual player.
>
> **Wizard's Chess:**
> - `COND_None` for piece Health (both players need to know when a piece is captured). For online play, this ensures both clients stay in sync.

---

### Gameplay Cues

Gameplay Cues are cosmetic effects (particles, sounds, camera shakes) triggered by Gameplay Effects or directly from abilities. They never affect gameplay logic.

#### Cue Types

| Type | Description |
|------|-------------|
| `GameplayCue.Burst` | One-shot effect (explosion, impact); plays once |
| `GameplayCue.Looped` | Ongoing effect (fire aura, buff sparkles); has start/end lifecycle |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Burst cues**:
>   - `GameplayCue.Ability.Fireball.Impact`: Explosion particles, fire sound, screen shake, scorch mark decal on the floor.
>   - `GameplayCue.Ability.HeavyStrike.Hit`: Spark particles at the impact point, metallic clang sound, brief camera shake.
>   - `GameplayCue.Ability.HealingWord.Heal`: Golden light burst on the target, angelic chime sound, floating "+" particles.
>   - `GameplayCue.Ability.Backstab.Crit`: Blood splatter particles, dagger impact sound, dramatic slow-motion camera pulse.
>   - `GameplayCue.Dice.NaturalTwenty`: Golden glow around the die, triumphant horn sound, confetti particles.
>   - `GameplayCue.Dice.CriticalFail`: Red glow, sad trombone sound, the die cracks slightly.
> - **Looped cues**:
>   - `GameplayCue.State.Burning`: Flames attached to the character mesh, crackling fire loop, smoke particles. Starts when `GE_Burning` applies, ends when it expires.
>   - `GameplayCue.State.Frozen`: Ice crystals on the mesh, frost breath particles, frozen shimmer sound loop.
>   - `GameplayCue.State.Blessed`: Soft golden aura, gentle choir loop, holy sparkles rising.
>   - `GameplayCue.State.Poisoned`: Green sickly glow, bubbling sound, dripping particles.
>   - `GameplayCue.State.Stealthed` (Rogue): Character mesh goes semi-transparent, shadow swirl particles, silence sound effect.
>
> **Wizard's Chess:**
> - **Burst**: `GameplayCue.Capture.Shatter` (explosion of stone fragments, magical burst particles, impact sound). `GameplayCue.Move.Land` (small dust puff, thud sound when a piece lands).
> - **Looped**: `GameplayCue.State.InCheck` (red glow on the King, pulsing warning sound, danger particles). Starts when check is detected, removed when check is resolved.

#### Cue Handler Functions

| Function | When Called |
|----------|------------|
| `OnActive` | When the cue is first activated |
| `WhileActive` | Called every frame while the cue is active (joins in progress) |
| `OnRemove` / `Removed` | When the cue is deactivated |
| `OnExecute` / `Executed` | For burst (instant) cues |

> **In your games:**
>
> **DnD Tabletop RPG:**
> For `GameplayCue.State.Burning`:
> - **OnActive**: Spawn fire particle system attached to the character's mesh. Start the fire crackle sound loop. Apply a red emissive boost to the character material.
> - **WhileActive**: Flicker the emissive intensity randomly each frame. Spawn occasional floating ember particles. This ensures a player joining mid-combat sees the burning effect immediately.
> - **OnRemove**: Stop the fire particles (with a fade-out, not instant pop). Stop the crackle sound. Fade the emissive boost back to normal. Optionally spawn a small steam/smoke puff as the fire goes out.
>
> For `GameplayCue.Ability.Fireball.Impact`:
> - **OnExecute**: Spawn the explosion particle system at the impact location. Play the explosion sound. Apply camera shake. Spawn a scorch mark decal on the floor. All in one shot, no lifecycle management needed.
>
> **Wizard's Chess:**
> For `GameplayCue.State.InCheck`:
> - **OnActive**: Start a red pulsing glow on the King piece. Play a warning bell sound.
> - **WhileActive**: Pulse the glow intensity with a sine wave. Keep the warning ambient drone playing.
> - **OnRemove**: Fade the glow to zero. Play a resolution chime. The King is safe again.

#### Cue Path Convention

- Gameplay Cue Notifies must be named starting with `GameplayCue.`
- Example: `GameplayCue.Ability.Fireball.Impact`
- The Cue Manager discovers cues by scanning specific directories
- **Cue paths**: Project Settings > Gameplay Cue Editor > Gameplay Cue Notify Paths (default: `/Game`)

#### Triggering Cues

From a Gameplay Effect:
- Add Gameplay Cue tags to the effect's `Gameplay Cues` array
- Cues fire automatically when the effect applies/removes

From code:
```cpp
// Execute (burst)
ASC->ExecuteGameplayCue(FGameplayTag::RequestGameplayTag("GameplayCue.Impact.Fire"));

// Add (looped)
ASC->AddGameplayCue(FGameplayTag::RequestGameplayTag("GameplayCue.Buff.Shield"));

// Remove (looped)
ASC->RemoveGameplayCue(FGameplayTag::RequestGameplayTag("GameplayCue.Buff.Shield"));
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> Most cues should be triggered from Gameplay Effects (not code) for clean separation:
> - `GE_FireballDamage` has `GameplayCue.Ability.Fireball.Impact` in its Gameplay Cues array. When the effect applies damage, the explosion cue fires automatically. You never need to manually call `ExecuteGameplayCue` for it.
> - `GE_Burning` (duration effect) has `GameplayCue.State.Burning`. When the DoT starts, the fire aura appears. When it expires, the fire aura is removed. Fully automatic.
> - Use code-triggered cues for non-effect events: `ExecuteGameplayCue("GameplayCue.Dice.NaturalTwenty")` fires directly from the dice result handler, since dice rolls are not Gameplay Effects.
>
> **Wizard's Chess:**
> - `GE_CaptureDestroy` triggers `GameplayCue.Capture.Shatter` via its Gameplay Cues array. The shatter effect fires automatically when the capture effect applies.
> - Code-trigger `ExecuteGameplayCue("GameplayCue.Move.Land")` at the end of the piece movement animation, since movement is not a Gameplay Effect.

#### Cue Manager

- `UGameplayCueManager` handles routing cue events to the correct Notify actors/objects
- Scans for `AGameplayCueNotify_Actor` and `UGameplayCueNotify_Static` assets
- Console: `GameplayCue.DisplayGameplayCues 1` to show active cues

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Use `AGameplayCueNotify_Actor` for looped cues (burning aura, frozen effect, stealthed visuals). These need to persist, attach to the character, and clean up on removal. The Actor-based notify gives you full control over spawning and destroying particles.
> - Use `UGameplayCueNotify_Static` for burst cues (fireball explosion, sword hit spark, dice roll celebration). These are fire-and-forget with no instance management needed. Static notifies are more performant for one-shots.
> - During development, use `GameplayCue.DisplayGameplayCues 1` to see which cues are active on each character. Useful for debugging when the Burning visual is not appearing (maybe the tag is wrong, or the cue path is not being scanned).
>
> **Wizard's Chess:**
> - `AGameplayCueNotify_Actor` for the InCheck King glow (looped, needs to persist and pulse).
> - `UGameplayCueNotify_Static` for all capture shatter effects (one-shot, fire-and-forget).

---

### Gameplay Tasks

Gameplay Tasks are asynchronous operations that run within the context of an ability. They support latent actions with delegates for completion, cancellation, and events.

#### Built-in Ability Tasks

##### AbilityTask_PlayMontageAndWait

- Plays an animation montage and waits for it to finish
- **Delegates**: `OnCompleted`, `OnBlendOut`, `OnInterrupted`, `OnCancelled`
```cpp
UAbilityTask_PlayMontageAndWait* Task = UAbilityTask_PlayMontageAndWait::CreatePlayMontageAndWaitProxy(
    this, NAME_None, MontageToPlay, PlayRate, StartSection, bStopWhenAbilityEnds);
Task->OnCompleted.AddDynamic(this, &UGA_MyAbility::OnMontageCompleted);
Task->OnInterrupted.AddDynamic(this, &UGA_MyAbility::OnMontageCancelled);
Task->ReadyForActivation();
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> Used in nearly every ability:
> - **GA_HeavyStrike**: Play `AM_Warrior_HeavyStrike` montage. On `OnCompleted`, deal damage to targets in the sweep zone. On `OnInterrupted` (Warrior got stunned mid-swing), cancel the damage and end the ability early.
> - **GA_Fireball**: Play `AM_Wizard_CastFireball` montage. At the animation notify point (hand thrust forward), spawn the fireball projectile. `OnCompleted` ends the ability cleanly. `OnCancelled` (Wizard got hit during cast) cancels the spell without spawning the projectile.
> - **GA_Backstab**: Play `AM_Rogue_Backstab` montage at `PlayRate = 1.5` (fast, snappy attack). Use `StartSection = "StrikeSection"` to skip the approach animation if the Rogue is already behind the target.
> - **GA_InspiringSong** (Bard): Play `AM_Bard_PlayLute` montage. The montage loops during the channeling section. `OnBlendOut` triggers when the Bard voluntarily ends the song, applying the final buff to all allies in range.

##### AbilityTask_WaitGameplayEvent

- Waits for a Gameplay Event (sent via `SendGameplayEventToActor`)
- **Properties**: Event Tag, Only Trigger Once, Only Match Exact
- **Delegate**: `EventReceived` with `FGameplayEventData` payload

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **GA_CounterAttack** (Warrior passive): Waits for `Event.Combat.TookDamage` event tag. When the Warrior is hit, the event fires, and the ability automatically performs a counter-strike against the attacker. The `FGameplayEventData` payload includes the attacker reference so the counter targets the right enemy.
> - **GA_Evasion** (Rogue): Waits for `Event.Combat.IncomingAttack`. When triggered, rolls a Dexterity check. If passed, the Rogue dodges the attack entirely.
> - **Dice result handling**: After the physical dice settles, send `Event.Dice.RollComplete` with the rolled value in the event payload. Any ability waiting on a dice result (attack rolls, saving throws) receives the result and continues execution.
> - **Dragon phase transition**: `GA_DragonPhaseTwo` waits for `Event.Boss.HalfHealth`. When the Dragon's Health drops below 50%, the event fires and the ability transitions the boss to its enraged state.

##### AbilityTask_WaitTargetData

- Waits for targeting data from a Target Actor
- Used with targeting systems for aiming, area selection, etc.
- **Delegate**: `ValidData`, `Cancelled`

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **GA_Fireball** targeting: Spawns a `TargetActor_GroundTrace` that projects a red circle on the dungeon floor. The player moves it with the mouse/controller. On click (ValidData), the targeting data includes the impact location and all enemies within the radius. On right-click (Cancelled), the Fireball ability is cancelled without spending Mana.
> - **GA_HealingWord** targeting: Uses `TargetActor_SingleLineTrace` aimed at allies. The Cleric points at a friendly character to select the heal target.
> - **GA_LightningBolt**: Uses `TargetActor_SingleLineTrace` for a straight line. All enemies along the line (multi-hit) are included in the target data.
>
> **Wizard's Chess:**
> - Piece movement targeting: A custom `TargetActor_ChessSquare` highlights valid destination squares. `ValidData` returns the selected square coordinates. `Cancelled` deselects the piece.

##### AbilityTask_WaitInputPress / WaitInputRelease

- Waits for the ability's bound input to be pressed or released
- Useful for charged abilities

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **GA_PowerShot** (Ranger): On activation, the Ranger starts drawing the bow (hold animation). `WaitInputRelease` fires when the player releases the button. The longer the hold, the more damage the arrow deals. Calculate hold duration and scale `GE_PowerShotDamage` accordingly. Maximum charge at 3 seconds.
> - **GA_ArcaneShield** (Wizard): Press to activate the shield. `WaitInputRelease` to drop it. While held, the shield absorbs damage but drains Mana per second. Releasing ends the ability and stops Mana drain.
> - **Real-time combat dice throw**: In real-time mode, the player holds the button to "charge" the dice throw. `WaitInputRelease` determines throw force based on hold duration.

##### AbilityTask_WaitDelay

- Simple timer; fires delegate after a specified duration

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **GA_PoisonBlade** (Rogue): After applying poison, `WaitDelay(3.0)` before the poison activates. This gives the target a 3-second grace period (and the player visual feedback that poison is "building up").
> - **GA_TurnUndead** (Cleric): Flash of holy light, then `WaitDelay(0.5)` before applying the fear effect. The delay lets the visual cue play before the Skeleton starts running.
> - **Turn timer in turn-based combat**: `WaitDelay(30.0)` for the player's turn. If the timer expires without action, automatically pass the turn.
>
> **Wizard's Chess:**
> - `WaitDelay(1.5)` between the piece movement animation completing and the shatter animation starting on the captured piece. This brief pause builds tension before the destruction.

##### AbilityTask_WaitAttributeChange

- Fires when a specific attribute changes

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **GA_LastStand** (Warrior passive): Waits for Health to drop below 25% of MaxHealth. When triggered, automatically activates a defensive stance that doubles ArmorClass for 10 seconds. One-time trigger per combat.
> - **GA_ManaOverflow** (Wizard passive): Waits for Mana to reach MaxMana. On trigger, grants a free spell cast (next spell costs 0 Mana).
> - **UI Health bar updates**: While not an ability per se, a UI controller can use `WaitAttributeChange` on Health to animate the health bar smoothly in response to any damage or healing, regardless of source.
> - **Dragon enrage**: An AI ability that waits for the Dragon's Health attribute to drop below 50%. Triggers the phase 2 transition automatically.

##### Custom Ability Tasks

```cpp
UCLASS()
class UAbilityTask_MyCustomTask : public UAbilityTask
{
    GENERATED_BODY()

    UPROPERTY(BlueprintAssignable)
    FMyTaskDelegate OnTaskCompleted;

    static UAbilityTask_MyCustomTask* CreateMyTask(UGameplayAbility* OwningAbility, float Duration);

    virtual void Activate() override;
    virtual void TickTask(float DeltaTime) override;
    virtual void OnDestroy(bool bInOwnerFinished) override;
};
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> Build these custom tasks:
> - **AbilityTask_WaitDiceResult**: Custom task that listens for the physical dice to settle (checking angular velocity each tick). When the die stops moving, reads the top face, and fires `OnDiceResult` with the rolled value. Used by every ability that requires a dice roll.
> - **AbilityTask_ChannelSpell**: Custom task for the Wizard and Bard channeled abilities. Ticks each frame, draining Mana over time. Fires `OnChannelComplete` when the channel finishes, or `OnChannelInterrupted` if the caster takes damage. `OnDestroy` cleans up the channeling VFX.
> - **AbilityTask_WaitCombatModeSwitch**: Listens for the player toggling between turn-based and real-time combat. Fires `OnSwitchedToRealTime` or `OnSwitchedToTurnBased`. Abilities can use this to adapt their behavior mid-execution.
> - **AbilityTask_SweepDetection**: Custom melee sweep task for the Warrior's Cleave. Ticks during the swing animation, performing capsule sweeps each frame along the sword's arc. Collects all unique hit Actors and fires `OnSweepHit` for each new target. Prevents double-hitting the same Goblin.
>
> **Wizard's Chess:**
> - **AbilityTask_WaitPieceArrival**: Custom task that ticks until the moving piece's Actor reaches its destination square (checking distance each frame). Fires `OnPieceArrived` when the piece is within 1 cm of the target location. Used by all piece movement abilities.

---

### Targeting

#### Target Actors

- `AGameplayAbilityTargetActor` subclasses provide targeting interfaces
- Built-in: `TargetActor_SingleLineTrace`, `TargetActor_GroundTrace`, `TargetActor_Radius`, `TargetActor_ActorPlacement`
- Target Actors are spawned by the ability, produce target data, then destroyed

#### Target Data

- `FGameplayAbilityTargetDataHandle`: Container for target data
- Contains hit results, target actors, locations
- Replicated from client to server for prediction

#### Confirmation

| Type | Description |
|------|-------------|
| `Instant` | Confirms immediately upon generation |
| `UserConfirmed` | Waits for player input to confirm (e.g., click to fire) |
| `Custom` | Game-specific confirmation logic |
| `CustomMulti` | Multiple confirmations before finalizing |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **TargetActor_GroundTrace** for all AoE abilities: Fireball (radius), IceStorm (radius), BattleCry (radius centered on self). The ground trace projects a targeting circle that the player can move before confirming.
> - **TargetActor_SingleLineTrace** for single-target abilities: PowerShot (Ranger), HealingWord (Cleric), HuntersMark (Ranger). Point at one target and confirm.
> - **TargetActor_Radius** for the Bard's InspiringSong: a radius around the Bard showing which allies are in range. Uses `Instant` confirmation because it is always centered on the Bard.
> - **UserConfirmed** for most offensive abilities: the player places the targeting reticle, then clicks to confirm. This gives tactical choice in both turn-based and real-time combat.
> - **Instant** for self-buffs: the Warrior's BattleCry, the Rogue's Evasion, the Wizard's ArcaneShield. No targeting needed; they just affect the caster. Target data is the caster's own location.
> - **Custom confirmation** for dice-gated abilities: in turn-based mode, the player selects a target (UserConfirmed first click), then the dice rolls. A custom confirmation handler waits for the dice result. If the roll meets the target's ArmorClass, the attack confirms. If it misses, the ability ends without dealing damage.
> - **CustomMulti** for the Ranger's MultiShot: the player selects 3 different targets one at a time. Each selection is a partial confirmation. After 3 selections, the ability fires all arrows simultaneously.
>
> **Wizard's Chess:**
> - Custom **TargetActor_ChessSquare**: Shows valid moves for the selected piece (highlighted green squares). `UserConfirmed` when the player clicks a valid square. `Cancelled` on right-click or clicking elsewhere. Target data contains the destination board coordinates.
> - **Instant** for AI-controlled opponent moves. The AI selects its move programmatically and confirms immediately.

---

### Prediction

GAS supports client-side prediction to reduce perceived latency.

**Prediction Keys:**
- Generated on the client when an ability activates
- Sent to the server with the activation request
- If the server confirms, the prediction stands; if rejected, it rolls back

**What can be predicted:**
- Ability activation
- Gameplay Effect application and removal
- Attribute modifications
- Montage playback
- Gameplay Cues (predicted cues show immediately, removed if server rejects)

**What cannot be predicted:**
- Gameplay Effect removal by the server
- Gameplay Effect periodic ticks

**Server Correction:**
- If the server rejects a predicted ability, the client removes all predicted effects
- Gameplay Cues predicted locally are cleaned up
- The ASC fires `OnClientActivateAbilityFailed` for handling rollback UI

> **In your games:**
>
> **DnD Tabletop RPG:**
> - For single-player, prediction is not relevant since there is no server/client split. Everything runs locally and there is nothing to predict or roll back.
> - If you add online co-op later, prediction becomes important for abilities that feel responsive. The Warrior's HeavyStrike should play the swing animation immediately on the local client (predicted), while the server validates whether the attack actually hits. If the server says the target dodged (failed ArmorClass check), the client rolls back the damage numbers but the animation already played. This feels better than waiting for a server round-trip before swinging.
> - **Gameplay Cues** are the big win for prediction in co-op. The Fireball explosion appears instantly on the casting player's screen (predicted cue), while the server confirms the damage. Other players see the explosion after a brief network delay. This makes combat feel snappy for the caster.
> - **Dice rolls are NOT predicted** because the result must be authoritative. In co-op, the server resolves the dice physics and sends the result to all clients. No player should see a "20" locally that the server corrects to a "3."
>
> **Wizard's Chess:**
> - For online multiplayer chess, piece movement could be predicted: the moving player sees their piece slide immediately, while the opponent sees it after the server validates the move. Capture effects are predicted on the moving player's side so the shatter feels instant.
> - Move validation is server-authoritative. The server checks legality (is this a valid move? Does it put your own King in check?). If rejected, the piece snaps back to its original square and the predicted capture effect is rolled back.

---
