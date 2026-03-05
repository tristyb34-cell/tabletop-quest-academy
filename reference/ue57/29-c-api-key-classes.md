## C++ API Key Classes

### Actor Hierarchy

#### AActor

The base class for all objects placed in a level.

```cpp
UCLASS()
class AMyActor : public AActor
{
    GENERATED_BODY()
public:
    AMyActor();
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
};
```

Key functions: `BeginPlay()`, `Tick()`, `EndPlay()`, `GetActorLocation()`, `SetActorLocation()`, `GetActorRotation()`, `SetActorRotation()`, `Destroy()`, `SetLifeSpan()`, `GetWorld()`, `GetGameInstance()`, `HasAuthority()`, `SetOwner()`, `GetOwner()`, `SetReplicates()`, `GetComponentByClass()`, `GetComponents()`.

> **In your games:**
> - **DnD RPG**: AActor is the base for everything placed in a dungeon: torches, treasure chests, traps, loot drops, and environmental hazards. Use `SetLifeSpan()` for temporary actors like spell projectiles that should auto-destroy after a few seconds. Use `Destroy()` when an enemy dies and you want to remove the corpse after a delay.
> - **Wizard's Chess**: Each chess piece is an AActor (or a subclass). Use `GetActorLocation()` and `SetActorLocation()` to move pieces between squares. `Destroy()` removes captured pieces from the board.

#### APawn

Base class for controllable entities. Adds movement, input, and controller support.

```cpp
class APawn : public AActor
```

Key additions: `SetupPlayerInputComponent()`, `GetController()`, `GetMovementComponent()`, `AddMovementInput()`, `GetViewRotation()`, `PossessedBy()`, `UnPossessed()`, `IsLocallyControlled()`, `IsPlayerControlled()`.

> **In your games:**
> - **DnD RPG**: APawn could be used for the tabletop camera controller (a pawn with no visible mesh, just a camera that pans and zooms over the tabletop). The player "possesses" the camera pawn in tabletop mode, then possesses their character pawn when zooming into 3D mode.
> - **Wizard's Chess**: The player does not control a visible pawn. Instead, an invisible "cursor pawn" could handle input, or you skip APawn entirely and handle everything through the PlayerController. Either approach works for a mouse-driven board game.

#### ACharacter

Extends APawn with a `UCharacterMovementComponent`, capsule collision, and skeletal mesh.

```cpp
class ACharacter : public APawn
```

Key additions: `Jump()`, `StopJumping()`, `Crouch()`, `UnCrouch()`, `LaunchCharacter()`, `GetCharacterMovement()`, `GetCapsuleComponent()`, `GetMesh()`, `bIsCrouched`, `CanJump()`, `OnLanded()`, `OnMovementModeChanged()`.

> **In your games:**
> - **DnD RPG**: ACharacter is the base for your player hero and all humanoid enemies. Your C++ character base class extends ACharacter and adds GAS integration (AbilitySystemComponent, AttributeSet). The `UCharacterMovementComponent` handles walking through dungeons, jumping over gaps, and crouching under obstacles. Enemies also extend ACharacter so they get the same movement and collision capabilities.
>   ```cpp
>   UCLASS()
>   class ATQCharacterBase : public ACharacter
>   {
>       GENERATED_BODY()
>   public:
>       UPROPERTY(VisibleAnywhere) UAbilitySystemComponent* AbilitySystemComp;
>       UPROPERTY() UTQAttributeSet* Attributes;
>   };
>   ```
> - **Wizard's Chess**: Chess pieces do not need ACharacter since they do not walk, jump, or crouch. Use AActor with a UStaticMeshComponent instead. ACharacter adds overhead (movement component, capsule, skeletal mesh) that a chess piece does not need.

#### APlayerController

Represents the human player's interface to the game world.

```cpp
class APlayerController : public AController
```

Key additions: `GetPawn()`, `SetPawn()`, `Possess()`, `UnPossess()`, `GetHUD()`, `GetPlayerCameraManager()`, `SetViewTarget()`, `ClientTravel()`, `GetLocalPlayer()`, `GetInputSubsystem()`, `SetInputMode()`, `bShowMouseCursor`, `ProjectWorldLocationToScreen()`, `DeprojectScreenPositionToWorld()`.

> **In your games:**
> - **DnD RPG**: Your PlayerController handles the dual-mode camera system. In tabletop mode, it possesses a camera pawn and uses `SetInputMode()` for mouse + keyboard. In 3D dungeon mode, it possesses the hero character. `Possess()` and `UnPossess()` handle the switch. `SetViewTarget()` with a blend creates a smooth camera transition between tabletop overview and character-level view.
> - **Wizard's Chess**: The PlayerController manages piece selection via `DeprojectScreenPositionToWorld()` (converts mouse click position to a world ray) to detect which square or piece was clicked. Set `bShowMouseCursor = true` and use `SetInputMode(FInputModeGameAndUI())` since chess is mouse-driven.

#### AGameModeBase

Server-only class controlling game rules, player spawning, and match state.

```cpp
class AGameModeBase : public AInfo
```

Key additions: `InitGame()`, `PreLogin()`, `PostLogin()`, `Logout()`, `HandleStartingNewPlayer()`, `SpawnDefaultPawnFor()`, `GetDefaultPawnClassForController()`, `RestartPlayer()`, `DefaultPawnClass`, `PlayerControllerClass`, `GameStateClass`, `PlayerStateClass`, `HUDClass`.

> **In your games:**
> - **DnD RPG**: Your custom GameMode (`ATQGameMode`) controls dungeon rules: which enemies spawn, turn order for turn-based combat, win/lose conditions, and what happens when the player dies. Override `SpawnDefaultPawnFor()` to spawn the player's chosen character class (warrior, mage, rogue) at the dungeon entrance. Set `DefaultPawnClass`, `PlayerControllerClass`, and `GameStateClass` to your custom subclasses.
> - **Wizard's Chess**: Your chess GameMode manages turn order (white/black), validates moves, detects check/checkmate/stalemate, and declares the winner. Override `InitGame()` to set up the initial board state. Since both players share one screen, you do not need `PreLogin`/`PostLogin` (those are for networked games).

#### AGameStateBase

Replicated game state accessible to all clients and the server.

```cpp
class AGameStateBase : public AInfo
```

Key additions: `PlayerArray` (list of `APlayerState*`), `GetServerWorldTimeSeconds()`, `HasMatchStarted()`, `HasMatchEnded()`, `HandleMatchIsWaitingToStart()`, `HandleMatchHasStarted()`.

> **In your games:**
> - **DnD RPG**: Your GameState tracks dungeon-wide information: current encounter state (exploring, in combat, in dialogue), which enemies are alive, active environmental effects (room is on fire, magical darkness), and the current turn in combat.
> - **Wizard's Chess**: GameState tracks whose turn it is (white/black), the board state (which pieces are on which squares), captured pieces list, move history, and whether the game is in check, checkmate, or stalemate.

#### APlayerState

Replicated state for each player (score, name, ping, etc.).

```cpp
class APlayerState : public AInfo
```

Key additions: `GetScore()`, `SetScore()`, `GetPlayerName()`, `SetPlayerName()`, `GetPawn()`, `GetPlayerController()`, `GetUniqueId()`, `bIsABot`, `bIsSpectator`, `CompressedPing`.

> **In your games:**
> - **DnD RPG**: PlayerState stores the hero's persistent match data: total XP earned this dungeon run, gold collected, and character name. Less critical for single-player, but useful if you add co-op later.
> - **Wizard's Chess**: PlayerState tracks each player's color (white/black), captured pieces, and remaining time if you add a chess clock.

### Component Hierarchy

#### UActorComponent

Base component class. No transform. Pure logic components.

```cpp
class UActorComponent : public UObject
```

Key functions: `BeginPlay()`, `TickComponent()`, `EndPlay()`, `InitializeComponent()`, `UninitializeComponent()`, `Activate()`, `Deactivate()`, `IsActive()`, `SetIsReplicated()`, `GetOwner()`, `RegisterComponent()`, `UnregisterComponent()`.

> **In your games:**
> - **DnD RPG**: Use UActorComponent for pure logic components that do not need a position in the world. Examples: an `UInventoryComponent` (manages the player's item list), a `UTurnOrderComponent` (tracks initiative in combat), or a `UQuestTrackerComponent` (tracks active quests). These attach to actors but have no spatial representation.
> - **Wizard's Chess**: A `UChessMoveValidator` component could attach to the GameMode and handle all move legality checks (is this a valid knight move, would this put my king in check, etc.). Pure logic, no transform needed.

#### USceneComponent

Adds transform (location, rotation, scale) and attachment hierarchy.

```cpp
class USceneComponent : public UActorComponent
```

Key additions: `GetComponentLocation()`, `GetComponentRotation()`, `GetComponentScale()`, `SetWorldLocation()`, `SetRelativeLocation()`, `SetWorldRotation()`, `AttachToComponent()`, `DetachFromComponent()`, `GetAttachParent()`, `GetChildrenComponents()`, `SetVisibility()`, `SetHiddenInGame()`.

> **In your games:**
> - **DnD RPG**: Use `AttachToComponent()` when a character picks up a weapon (attach sword mesh to hand socket), when a spell effect follows the caster, or when a torch flame component attaches to a wall sconce. `SetVisibility()` toggles things like hidden traps that reveal themselves when triggered.
> - **Wizard's Chess**: `SetVisibility(false)` on a captured piece to hide it before playing the destruction VFX. Use `SetRelativeLocation()` to offset the piece mesh slightly above the board square for a floating effect.

#### UPrimitiveComponent

Adds rendering and collision. Base for all visible components.

```cpp
class UPrimitiveComponent : public USceneComponent
```

Key additions: `SetCollisionEnabled()`, `SetCollisionProfileName()`, `SetCollisionResponseToChannel()`, `OnComponentHit`, `OnComponentBeginOverlap`, `OnComponentEndOverlap`, `SetSimulatePhysics()`, `AddForce()`, `AddImpulse()`, `SetMaterial()`, `GetMaterial()`, `SetRenderCustomDepth()`.

> **In your games:**
> - **DnD RPG**: `OnComponentBeginOverlap` is how traps detect the player (an invisible trigger volume overlaps the character capsule). `SetSimulatePhysics()` makes loot scatter on the ground when a chest opens. `SetRenderCustomDepth()` enables outline effects on interactive objects (chests, doors, NPCs) using a custom depth post-process material. `OnComponentHit` detects when a projectile spell hits a wall or enemy.
> - **Wizard's Chess**: Use overlap events on board squares to detect when a piece is placed. `SetRenderCustomDepth()` highlights valid move squares when a piece is selected. `SetMaterial()` swaps a square's material to a glowing version during selection.

#### UStaticMeshComponent

Renders a static mesh.

```cpp
UPROPERTY(VisibleAnywhere)
UStaticMeshComponent* MeshComp;

MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
```

Key additions: `SetStaticMesh()`, `GetStaticMesh()`, `SetForcedLodModel()`.

> **In your games:**
> - **DnD RPG**: Static meshes are used for dungeon props (barrels, crates, tables, pillars), environmental set dressing, and loot pickups. PCG-generated rooms spawn many StaticMeshComponents. `SetForcedLodModel()` can force lower LODs on distant props to save GPU time in large dungeon rooms.
> - **Wizard's Chess**: Every chess piece is a UStaticMeshComponent (or USkeletalMeshComponent if animated). The board itself is also a static mesh. Use `SetStaticMesh()` if you want to swap a pawn mesh for a queen mesh during pawn promotion.

#### USkeletalMeshComponent

Renders a skeletal mesh with animation.

```cpp
UPROPERTY(VisibleAnywhere)
USkeletalMeshComponent* SkelMeshComp;
```

Key additions: `SetSkeletalMesh()`, `GetAnimInstance()`, `PlayAnimation()`, `SetAnimationMode()`, `GetBoneTransform()`, `GetSocketTransform()`, `SetAnimClass()`, `GetCurrentMontage()`.

> **In your games:**
> - **DnD RPG**: Every character (player and enemies) uses a SkeletalMeshComponent for animated movement, attacks, and spell casting. `GetAnimInstance()` gives you access to the animation Blueprint for triggering montages (sword swings, spell casts, death animations). `GetSocketTransform()` finds the "hand_r" socket to spawn a sword or staff at the correct position. `GetBoneTransform()` is useful for procedural effects like attaching a blood splatter to the hit bone.
> - **Wizard's Chess**: If you give chess pieces animated captures (e.g., a knight rearing up before striking), use SkeletalMeshComponents. Otherwise, stick with static meshes and animate movement via code (interpolating position). `PlayAnimation()` triggers a one-shot capture animation on the attacking piece.

### Core Classes

#### UWorld

Represents a loaded level/world. Contains all actors.

Key functions: `SpawnActor()`, `GetTimerManager()`, `GetFirstPlayerController()`, `GetAuthGameMode()`, `GetGameState()`, `GetGameInstance()`, `GetNavigationSystem()`, `GetNetMode()`, `ServerTravel()`, `LineTraceSingleByChannel()`, `SweepSingleByChannel()`, `OverlapMultiByChannel()`.

> **In your games:**
> - **DnD RPG**: `SpawnActor()` is how you spawn enemies, loot drops, spell projectiles, and traps at runtime. `LineTraceSingleByChannel()` detects what the player is looking at (for targeting spells or interacting with objects). `GetTimerManager()` sets up delayed events (trap activates 2 seconds after stepping on it, poison ticks every 3 seconds). `GetNavigationSystem()` is essential for AI pathfinding through dungeon corridors.
> - **Wizard's Chess**: `LineTraceSingleByChannel()` from the mouse cursor ray detects which board square or piece the player clicked. `SpawnActor()` spawns capture VFX at the target square. `GetTimerManager()` handles move animation timing (piece slides to new position over 0.5 seconds).

#### UGameInstance

Persistent across level loads. Lifetime matches the entire application session.

```cpp
class UGameInstance : public UObject
```

Key functions: `Init()`, `Shutdown()`, `StartGameInstance()`, `GetSubsystem<T>()`, `GetWorld()`, `GetLocalPlayers()`, `GetOnlineSubsystem()`. Use for persistent data (player profile, save data, session management).

> **In your games:**
> - **DnD RPG**: The GameInstance persists across level transitions, making it perfect for storing the player's chosen character class, inventory, and quest progress as they travel between the main menu, tabletop view, and dungeon levels. Without a GameInstance, that data would be lost every time you load a new map.
> - **Wizard's Chess**: Less critical since the game is one board on one level. But if you add features like match history, player preferences (board theme, piece style), or an ELO rating, the GameInstance holds that data across menu transitions.

#### USubsystem

Auto-instanced singletons tied to a specific outer object lifetime:

| Type | Outer | Lifetime | Access |
|------|-------|----------|--------|
| `UEngineSubsystem` | `GEngine` | Engine lifetime | `GEngine->GetEngineSubsystem<T>()` |
| `UEditorSubsystem` | `GEditor` | Editor session | `GEditor->GetEditorSubsystem<T>()` |
| `UGameInstanceSubsystem` | `UGameInstance` | Game instance | `GameInstance->GetSubsystem<T>()` |
| `UWorldSubsystem` | `UWorld` | World/level | `World->GetSubsystem<T>()` |
| `ULocalPlayerSubsystem` | `ULocalPlayer` | Local player | `LocalPlayer->GetSubsystem<T>()` |

Subsystems are created automatically. Override `ShouldCreateSubsystem()` to conditionally disable.

> **In your games:**
> - **DnD RPG**: Subsystems are great for singleton-style managers:
>   - `UGameInstanceSubsystem`: A save/load manager that persists across levels.
>   - `UWorldSubsystem`: A dungeon manager that tracks room states, enemy spawns, and loot tables for the current level.
>   - `ULocalPlayerSubsystem`: Per-player settings like control sensitivity, UI preferences.
> - **Wizard's Chess**: A `UGameInstanceSubsystem` could manage chess AI difficulty settings and match history. A `UWorldSubsystem` could manage the board state, valid moves cache, and check detection.

### Object System

#### UObject

Root of the UE object hierarchy. Provides reflection, serialization, garbage collection.

Key functions: `GetName()`, `GetFName()`, `GetClass()`, `GetOuter()`, `GetWorld()`, `IsA()`, `GetDefaultObject()`, `Rename()`, `MarkPendingKill()` (deprecated, use `MarkAsGarbage()`), `IsValid()`, `ConditionalBeginDestroy()`.

#### UStruct

Base for reflected struct types (`USTRUCT()`). Not the same as `UScriptStruct`.

```cpp
USTRUCT(BlueprintType)
struct FMyStruct
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Value;
};
```

#### UClass

Runtime type information for a `UObject`-derived class. Accessed via `GetClass()` or `StaticClass()`.

```cpp
UClass* MyClass = AMyActor::StaticClass();
bool bIsCharacter = SomeActor->IsA(ACharacter::StaticClass());
```

### Containers

#### TArray

Dynamic array, the most commonly used container.

```cpp
TArray<int32> Numbers;
Numbers.Add(5);
Numbers.AddUnique(5);     // Only adds if not present
Numbers.Remove(5);
Numbers.RemoveAt(0);
Numbers.Num();             // Count
Numbers.IsEmpty();
Numbers.Contains(5);
Numbers.Find(5);           // Returns index or INDEX_NONE
Numbers.Sort();
Numbers.FindByPredicate([](int32 N){ return N > 3; });

for (int32 Num : Numbers) { }
for (int32 i = 0; i < Numbers.Num(); i++) { }
```

#### TMap

Key-value associative container (hash map).

```cpp
TMap<FString, int32> ScoreMap;
ScoreMap.Add(TEXT("Player1"), 100);
ScoreMap.Remove(TEXT("Player1"));
int32* Found = ScoreMap.Find(TEXT("Player1")); // Returns pointer or nullptr
ScoreMap.Contains(TEXT("Player1"));
ScoreMap.Num();

for (auto& Pair : ScoreMap)
{
    FString Key = Pair.Key;
    int32 Value = Pair.Value;
}
```

#### TSet

Unique element set (hash set).

```cpp
TSet<FString> Tags;
Tags.Add(TEXT("Enemy"));
Tags.Remove(TEXT("Enemy"));
Tags.Contains(TEXT("Enemy"));
Tags.Num();
Tags.Intersect(OtherSet);
Tags.Union(OtherSet);
Tags.Difference(OtherSet);
```

#### FString, FName, FText

| Type | Use Case | Mutability | Localization |
|------|----------|------------|-------------|
| `FString` | General string manipulation | Mutable | No |
| `FName` | Identifiers, asset paths, keys | Immutable, case-insensitive, pooled | No |
| `FText` | User-facing display text | Immutable | Yes |

> **In your games:**
> - **DnD RPG**: Use `FName` for asset paths, ability tags ("Ability.Spell.Fireball"), and data table row names. Use `FText` for anything the player sees: damage numbers, quest descriptions, dialogue, item names. Use `FString` for internal string manipulation like building log messages or parsing save data.
> - **Wizard's Chess**: Use `FText` for move notation ("Nf3", "O-O", "Checkmate!"), player names, and UI labels. Use `FName` for piece type identifiers and board square names ("A1", "H8").

```cpp
FString Str = TEXT("Hello");
FName Name = FName(TEXT("MyName"));
FText Text = FText::FromString(TEXT("Display Text"));
FText Formatted = FText::Format(LOCTEXT("Greeting", "Hello {0}"), FText::AsNumber(42));

// Conversions
FString FromName = Name.ToString();
FName FromString = FName(*Str);
FString FromText = Text.ToString();
```

### Delegates

#### Single-Cast Delegate

```cpp
DECLARE_DELEGATE(FOnSimpleEvent);
DECLARE_DELEGATE_OneParam(FOnHealthChanged, float);
DECLARE_DELEGATE_RetVal(bool, FOnShouldProceed);

FOnHealthChanged OnHealthChanged;
OnHealthChanged.BindUObject(this, &AMyActor::HandleHealthChanged);
OnHealthChanged.ExecuteIfBound(50.f);
OnHealthChanged.Unbind();
```

#### Multicast Delegate

```cpp
DECLARE_MULTICAST_DELEGATE_OneParam(FOnDamageReceived, float);

FOnDamageReceived OnDamageReceived;
FDelegateHandle Handle = OnDamageReceived.AddUObject(this, &AMyActor::HandleDamage);
OnDamageReceived.Broadcast(25.f);
OnDamageReceived.Remove(Handle);
```

#### Dynamic Delegate (Blueprint-compatible)

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChanged, int32, NewScore);

UPROPERTY(BlueprintAssignable)
FOnScoreChanged OnScoreChanged;

// Broadcast
OnScoreChanged.Broadcast(100);
```

Dynamic delegates use `FName`-based binding and are slower than native delegates but required for Blueprint exposure.

> **In your games:**
> - **DnD RPG**: Delegates are the event system backbone:
>   - `FOnHealthChanged` (single-cast): The health bar widget binds to this to update when the player takes damage.
>   - `FOnAbilityActivated` (multicast): Multiple systems respond when an ability fires (VFX spawner, sound manager, cooldown tracker).
>   - `FOnEnemyDefeated` (dynamic multicast): Blueprint-assignable so designers can hook up loot drops, XP rewards, and quest progress in Blueprints without touching C++.
> - **Wizard's Chess**: `FOnPieceMoved` (multicast) notifies the board UI, move history, and check detector when any piece moves. `FOnGameOver` (dynamic multicast) triggers the endgame UI and celebration VFX.

### Smart Pointers

UE5 provides its own smart pointer library (not `std::shared_ptr`):

#### TSharedPtr

Reference-counted shared ownership pointer for non-UObject types.

```cpp
TSharedPtr<FMyData> DataPtr = MakeShared<FMyData>();
TSharedPtr<FMyData> Copy = DataPtr;  // Ref count = 2
DataPtr.Reset();                      // Ref count = 1
bool bValid = Copy.IsValid();
FMyData& Ref = *Copy;
```

#### TSharedRef

Non-nullable shared reference. Cannot be default-constructed or null.

```cpp
TSharedRef<FMyData> DataRef = MakeShared<FMyData>();
// TSharedRef<FMyData> Bad; // Compile error: must be initialized
TSharedPtr<FMyData> Ptr = DataRef; // Implicit conversion to TSharedPtr
```

#### TWeakPtr

Non-owning weak reference. Does not prevent destruction.

```cpp
TWeakPtr<FMyData> WeakPtr = DataPtr;
TSharedPtr<FMyData> Pinned = WeakPtr.Pin();
if (Pinned.IsValid())
{
    // Safe to use
}
```

#### TUniquePtr

Sole ownership, non-copyable.

```cpp
TUniquePtr<FMyData> Unique = MakeUnique<FMyData>();
TUniquePtr<FMyData> Moved = MoveTemp(Unique); // Transfer ownership
// Unique is now null
```

**Important**: Smart pointers are for non-UObject types only. UObjects use the garbage collector.

> **In your games:**
> - **DnD RPG**: Use `TSharedPtr` for non-UObject data structures like pathfinding graphs, AI decision trees (raw data, not UE assets), or parsed JSON save data. For example, your local AI DM (Ollama integration) might return responses as a `TSharedPtr<FDMResponse>` that gets passed between systems.
> - **Wizard's Chess**: Use `TUniquePtr` for the chess engine's internal board representation (a pure C++ struct, not a UObject). The move generator could return `TArray<TSharedPtr<FChessMove>>` for evaluated move options. Remember: chess piece actors in the world are UObjects, so use `UPROPERTY()` for those, not smart pointers.

### Garbage Collection

UE5 uses a mark-and-sweep garbage collector for all `UObject`-derived types.

#### UPROPERTY for GC Roots

Any `UPROPERTY()` reference to a UObject keeps that object alive:

```cpp
UPROPERTY()
UMyComponent* MyComp;  // Prevents GC of MyComp

UPROPERTY()
TArray<AActor*> TrackedActors;  // Prevents GC of all actors in the array
```

#### Preventing Garbage Collection

If you cannot use `UPROPERTY()` (e.g., raw pointer in non-UCLASS code):

1. **AddToRoot()**: `MyObject->AddToRoot();` prevents GC until `RemoveFromRoot()`.
2. **FGCObjectScopeGuard**: RAII guard that prevents GC for the scope duration.
3. **UObjectBaseUtility::AddReferencedObjects()**: Override to report custom references to the GC.
4. **FGCReferenceTokenStream**: Low-level reference tracking.

#### GC Best Practices

- Always use `UPROPERTY()` for UObject pointers in UCLASS/USTRUCT types.
- Never store raw UObject pointers in non-reflected containers (use `TWeakObjectPtr` for non-owning references).
- Use `TWeakObjectPtr<AActor>` when you need to observe an actor without preventing its destruction.
- Use `IsValid(Obj)` or `Obj && !Obj->IsPendingKillPending()` to check validity.
- `UPROPERTY()` in a USTRUCT that is itself a UPROPERTY will be traced transitively.
- Circular references between UObjects are handled by the GC (unlike reference-counted smart pointers).

> **In your games:**
> - **DnD RPG**: GC best practices matter here because you are constantly spawning and destroying actors (enemies, spells, loot):
>   - Always use `UPROPERTY()` for your `AbilitySystemComponent`, `AttributeSet`, inventory items, and tracked enemy references.
>   - Use `TWeakObjectPtr<AActor>` when an ability needs to reference a target that might die before the ability resolves (e.g., a delayed fireball targeting an enemy that gets killed by another player).
>   - Use `TSoftObjectPtr` for loadable references to assets like dungeon tile meshes or spell VFX that should load on demand rather than bloating memory upfront.
> - **Wizard's Chess**: Use `UPROPERTY()` arrays to track pieces: `TArray<AChessPiece*> WhitePieces` and `TArray<AChessPiece*> BlackPieces` in your GameState. When a piece is captured and destroyed, the GC cleans it up after you remove it from the array. Use `TWeakObjectPtr` if the AI evaluator caches references to pieces that might get captured mid-evaluation.

```cpp
// Safe weak reference
TWeakObjectPtr<AActor> WeakActor = SomeActor;
if (WeakActor.IsValid())
{
    WeakActor->DoSomething();
}

// Soft reference (for assets, loads on demand)
UPROPERTY(EditAnywhere)
TSoftObjectPtr<UStaticMesh> MeshToLoad;

if (!MeshToLoad.IsNull())
{
    UStaticMesh* Loaded = MeshToLoad.LoadSynchronous();
}
```
