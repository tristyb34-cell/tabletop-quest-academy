# Essential Code Functions Cheatsheet

The functions and patterns you'll use constantly when building in UE5. Organized from "use this on day one" to "use this when building systems."

---

## Blueprint Functions (Visual Scripting)

These are the nodes you'll drag into the Blueprint graph most often.

### Printing and Debugging

| Function | What It Does | When You Use It |
|---|---|---|
| `Print String` | Shows text on screen during play | Debugging everything. "Did this code run? What value is this variable?" |
| `Draw Debug Line` | Draws a visible line in the world | Checking line traces, aim direction, AI sight lines |
| `Draw Debug Sphere` | Draws a sphere at a location | Visualizing positions, spawn points, ability ranges |

### Getting and Setting Data

| Function | What It Does | When You Use It |
|---|---|---|
| `Get Actor Location` | Returns the XYZ position of an actor | Every time you need to know where something is |
| `Set Actor Location` | Teleports an actor to a new position | Moving things, spawning at locations, teleport spells |
| `Get Actor Rotation` | Returns which direction an actor faces | Aiming, facing checks, camera alignment |
| `Get Player Character` | Returns a reference to the player | Accessing the player from any other Blueprint |
| `Get Player Controller` | Returns the player's controller | Input handling, camera control, UI management |
| `Get Game Mode` | Returns the current Game Mode | Accessing global game rules, combat state, turn manager |

### Math You'll Actually Use

| Function | What It Does | When You Use It |
|---|---|---|
| `Clamp` | Keeps a value between a min and max | Health can't go below 0 or above MaxHealth |
| `Lerp` (Linear Interpolate) | Blends between two values by a percentage | Smooth transitions, crossfades, moving something from A to B over time |
| `Random Integer in Range` | Returns a random int between min and max | Dice rolls, damage ranges, loot tables |
| `Random Float in Range` | Same but with decimals | Crit chance checks, spawn variance |
| `FInterp To` | Smoothly moves a value toward a target | Camera smoothing, health bar animation, smooth rotation |
| `Distance (Vector)` | Distance between two points | "Is the enemy close enough to attack?" Range checks |
| `Normalize` | Makes a vector length 1 (keeps direction) | Movement direction, aiming direction |
| `Dot Product` | How much two directions align (-1 to 1) | "Is the enemy in front of me or behind me?" Backstab detection |

### Flow Control

| Function | What It Does | When You Use It |
|---|---|---|
| `Branch` | If/else. True goes one way, false goes another | Every decision in your game |
| `Switch on Int/String/Enum` | Multiple branches based on a value | "Which class is this? Which state is combat in?" |
| `Sequence` | Runs multiple outputs in order | "Do A, then B, then C" from one trigger |
| `For Each Loop` | Runs code once per item in an array | "Apply damage to every enemy in this area" |
| `Do Once` | Only fires the first time, ignores repeats | Pickup items, one-time triggers, tutorial popups |
| `Gate` | Open/close to allow or block execution flow | "Only allow input during your turn" |
| `Delay` | Waits X seconds then continues | Timed events, ability cooldowns, animation pauses |
| `Set Timer by Function Name` | Calls a function after X seconds, optionally looping | Poison ticks, mana regen, periodic checks |

### Spawning and Destroying

| Function | What It Does | When You Use It |
|---|---|---|
| `Spawn Actor from Class` | Creates a new actor in the world | Spawning enemies, projectiles, loot drops, VFX |
| `Destroy Actor` | Removes an actor from the world | Killing enemies, picking up items, cleaning up projectiles |
| `Spawn Emitter at Location` | Creates a particle effect | Hit effects, spell visuals, death explosions |
| `Play Sound at Location` | Plays a sound in 3D space | Sword hits, footsteps, explosions, spell casts |

### Physics and Collision

| Function | What It Does | When You Use It |
|---|---|---|
| `Line Trace by Channel` | Fires an invisible ray and reports what it hits | Ranged attacks, "can I see the player?", ground detection |
| `Sphere Trace` | Same but with a sphere shape (wider) | Melee attack hit detection, AoE checks |
| `Add Force` | Pushes a physics object | Knockback, explosions, physics puzzles |
| `Add Impulse` | Instant push (one frame) | Getting hit, launching projectiles |

### Actor Communication

| Function | What It Does | When You Use It |
|---|---|---|
| `Cast To [Class]` | Checks if an actor is a specific type and gives you access to its stuff | "Is this actor an enemy? If so, get its health." |
| `Does Implement Interface` | Checks if an actor has a specific interface | Cleaner than casting. "Can this thing take damage?" |
| `Event Dispatchers` | One actor broadcasts, others listen | "Combat ended" notifies UI, music system, and AI all at once |

---

## C++ Functions (Performance-Critical Code)

The C++ equivalents and patterns you'll need from Module 03 onward.

### The Macros That Make UE5 Work

```cpp
// Expose a variable to the editor and Blueprints
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
float Health = 100.0f;

// Expose a function to Blueprints
UFUNCTION(BlueprintCallable, Category = "Combat")
void TakeDamage(float Amount);

// A function Blueprints can override
UFUNCTION(BlueprintImplementableEvent)
void OnDeath();

// A function with C++ default that Blueprints CAN override
UFUNCTION(BlueprintNativeEvent)
void OnHit();
```

### Getting References

```cpp
// Get the player character
ACharacter* Player = UGameplayStatics::GetPlayerCharacter(GetWorld(), 0);

// Get the game mode
AMyGameMode* GM = Cast<AMyGameMode>(UGameplayStatics::GetGameMode(GetWorld()));

// Get a component on this actor
UHealthComponent* HP = FindComponentByClass<UHealthComponent>();

// Get a component on another actor
UAbilitySystemComponent* ASC = OtherActor->FindComponentByClass<UAbilitySystemComponent>();

// Safe casting (returns nullptr if wrong type)
AEnemy* Enemy = Cast<AEnemy>(OtherActor);
if (Enemy)
{
    Enemy->TakeDamage(50.0f);
}
```

### Common Operations

```cpp
// Distance between two actors
float Dist = FVector::Distance(ActorA->GetActorLocation(), ActorB->GetActorLocation());

// Clamp health between 0 and max
Health = FMath::Clamp(Health - Damage, 0.0f, MaxHealth);

// Lerp (smooth blend)
float Alpha = 0.5f; // 0 = start, 1 = end
FVector Mid = FMath::Lerp(StartPos, EndPos, Alpha);

// Random number
int32 DiceRoll = FMath::RandRange(1, 20);
float CritRoll = FMath::FRandRange(0.0f, 1.0f);

// Spawn an actor
FActorSpawnParameters Params;
AProjectile* Proj = GetWorld()->SpawnActor<AProjectile>(ProjectileClass, SpawnLocation, SpawnRotation, Params);

// Destroy after delay
Projectile->SetLifeSpan(5.0f); // auto-destroys after 5 seconds

// Line trace
FHitResult Hit;
FVector Start = GetActorLocation();
FVector End = Start + GetActorForwardVector() * 1000.0f;
bool bHit = GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility);
if (bHit)
{
    AActor* HitActor = Hit.GetActor();
}
```

### Timers

```cpp
// Call a function after 2 seconds
FTimerHandle TimerHandle;
GetWorld()->GetTimerManager().SetTimer(TimerHandle, this, &AMyActor::DoSomething, 2.0f, false);

// Call a function every 1 second (looping)
GetWorld()->GetTimerManager().SetTimer(TimerHandle, this, &AMyActor::PoisonTick, 1.0f, true);

// Stop a timer
GetWorld()->GetTimerManager().ClearTimer(TimerHandle);
```

### Delegates (Event System)

```cpp
// Declare a delegate in the header
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, NewHealth);

// Expose it so Blueprints can listen
UPROPERTY(BlueprintAssignable)
FOnHealthChanged OnHealthChanged;

// Fire it when health changes
OnHealthChanged.Broadcast(Health);

// Listen from another C++ class
OtherActor->OnHealthChanged.AddDynamic(this, &AMyUI::HandleHealthChanged);
```

### Logging

```cpp
// Print to the output log (your best friend for debugging)
UE_LOG(LogTemp, Warning, TEXT("Health is now: %f"), Health);
UE_LOG(LogTemp, Error, TEXT("Enemy %s not found!"), *EnemyName);

// Print to screen (like Blueprint's Print String)
GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Red, TEXT("Something went wrong"));
```

---

## GAS Functions (Combat System)

The Gameplay Ability System calls you'll use constantly for both combat modes.

### Setting Up Abilities

```cpp
// Give an ability to a character
AbilitySystemComponent->GiveAbility(FGameplayAbilitySpec(FireballClass, 1, INPUT_Ability1, this));

// Try to activate an ability
AbilitySystemComponent->TryActivateAbilityByClass(FireballClass);

// Cancel an ability
AbilitySystemComponent->CancelAbilityHandle(AbilityHandle);
```

### Applying Effects (Damage, Buffs, Debuffs)

```cpp
// Create and apply a gameplay effect
FGameplayEffectContextHandle Context = ASC->MakeEffectContext();
FGameplayEffectSpecHandle Spec = ASC->MakeOutgoingSpec(DamageEffectClass, 1, Context);

// Set the damage value dynamically
Spec.Data->SetSetByCallerMagnitude(FGameplayTag::RequestGameplayTag("Data.Damage"), 50.0f);

// Apply it to the target
ASC->ApplyGameplayEffectSpecToTarget(*Spec.Data.Get(), TargetASC);
```

### Reading Attributes

```cpp
// Get current health
float CurrentHealth = ASC->GetNumericAttribute(UMyAttributeSet::GetHealthAttribute());

// Check if an attribute exists
bool bHas = ASC->HasAttributeSetForAttribute(UMyAttributeSet::GetManaAttribute());
```

### Tag Checks

```cpp
// Check if a character has a tag
FGameplayTag StunnedTag = FGameplayTag::RequestGameplayTag("State.Stunned");
bool bIsStunned = ASC->HasMatchingGameplayTag(StunnedTag);

// Check if any tags from a container match
FGameplayTagContainer DebuffTags;
DebuffTags.AddTag(FGameplayTag::RequestGameplayTag("State.Poisoned"));
DebuffTags.AddTag(FGameplayTag::RequestGameplayTag("State.Burning"));
bool bHasAnyDebuff = ASC->HasAnyMatchingGameplayTags(DebuffTags);
```

### Inside a GameplayAbility

```cpp
void UGA_Fireball::ActivateAbility(...)
{
    // Commit cost and cooldown (mana spend + cooldown start)
    if (!CommitAbility(Handle, ActorInfo, ActivationInfo))
    {
        EndAbility(Handle, ActorInfo, ActivationInfo, true, true);
        return;
    }

    // Do the ability logic here (spawn projectile, play animation, etc.)

    // End the ability when done
    EndAbility(Handle, ActorInfo, ActivationInfo, true, false);
}
```

---

## Pattern Recognition Guide

Think of these as "if you want X, use Y."

| I Want To... | Use This |
|---|---|
| Move something smoothly over time | `Lerp` or `FInterp To` with `Tick` or a `Timeline` |
| Check if something is in range | `Distance` between two locations, compare to a threshold |
| Detect what I'm looking at | `Line Trace` from camera or character forward |
| Hit everything in an area | `Sphere Trace` or `Sphere Overlap Actors` |
| Wait before doing something | `Delay` node or `SetTimer` in C++ |
| Do something repeatedly | `Set Timer` with looping, or `Tick` with a condition |
| React to health/mana changing | `Delegate` / `Event Dispatcher` from the attribute set |
| Switch between combat modes | `Enum` for combat state + `Switch` node, managed by Game Mode |
| Make AI decide what to do | `Behavior Tree` with `Blackboard` data |
| Transition cameras smoothly | `SetViewTargetWithBlend` on the Player Controller |
| Roll dice | `Random Integer in Range(1, 20)` + modifiers |
| Check if enemy is behind me | `Dot Product` of my forward vector and direction to enemy (negative = behind) |
| Apply damage/buffs/debuffs | `GameplayEffect` through `GAS` |
| Check if character is stunned/burning/etc | `GameplayTag` query on the `AbilitySystemComponent` |
| Store items/enemies/abilities as data | `Data Tables` + `Structs` |
| Make UI respond to game state | Bind widget properties to attributes, or use event dispatchers |
