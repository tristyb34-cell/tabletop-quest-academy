# UE5 C++ Patterns Quick Reference

Dense reference for the most common UE5 C++ patterns, macros, and conventions. Designed for quick lookup, not deep teaching.

---

## UPROPERTY Specifiers

Controls how a property behaves in the editor and in Blueprints.

```cpp
// Editor visibility
UPROPERTY(EditAnywhere)           // Editable in details panel on instances AND defaults
UPROPERTY(EditDefaultsOnly)       // Editable only in Blueprint defaults, not on instances
UPROPERTY(EditInstanceOnly)       // Editable only on placed instances, not in defaults
UPROPERTY(VisibleAnywhere)        // Shown but not editable (read-only in editor)
UPROPERTY(VisibleDefaultsOnly)    // Read-only, Blueprint defaults only

// Blueprint access
UPROPERTY(BlueprintReadWrite)     // Blueprint can get AND set
UPROPERTY(BlueprintReadOnly)      // Blueprint can get only

// Common combos
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Stats")
float Health = 100.f;

UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Components")
UStaticMeshComponent* MeshComp;

// Clamping (editor slider limits)
UPROPERTY(EditAnywhere, meta=(ClampMin="0.0", ClampMax="1.0", UIMin="0.0", UIMax="1.0"))
float Opacity = 1.f;

// Replication
UPROPERTY(Replicated)                          // Value syncs to clients
UPROPERTY(ReplicatedUsing=OnRep_Health)        // Syncs + calls OnRep function on change

// Other useful meta
UPROPERTY(EditAnywhere, meta=(MakeEditWidget))  // Shows 3D widget in viewport
UPROPERTY(EditAnywhere, meta=(AllowPrivateAccess="true"))  // Access private from Blueprint
UPROPERTY(Transient)               // Not saved to disk, reset each session
UPROPERTY(SaveGame)                // Included in save game serialization
UPROPERTY(Interp)                  // Can be driven by Sequencer/Timeline
```

**Category tip:** Always add `Category="SectionName"` to keep the details panel organized. Subcategories use pipe: `Category="Combat|Melee"`.

---

## UFUNCTION Specifiers

Controls how a function interacts with Blueprints, replication, and the engine.

```cpp
// Blueprint access
UFUNCTION(BlueprintCallable, Category="Combat")
void DealDamage(float Amount);    // Callable from Blueprint, has exec pin

UFUNCTION(BlueprintPure, Category="Stats")
float GetHealthPercent() const;   // No exec pin, pure getter

// Blueprint override points
UFUNCTION(BlueprintImplementableEvent)
void OnLevelUp();                 // No C++ body. Implemented entirely in Blueprint.

UFUNCTION(BlueprintNativeEvent)
void OnDeath();                   // C++ provides default (OnDeath_Implementation), Blueprint can override.
// Must also declare: void OnDeath_Implementation();

// Replication (multiplayer)
UFUNCTION(Server, Reliable)       // Called on client, runs on server
void ServerFireWeapon();

UFUNCTION(Client, Reliable)       // Called on server, runs on owning client
void ClientShowDamageNumber(float Damage);

UFUNCTION(NetMulticast, Unreliable)  // Called on server, runs on ALL clients
void MulticastPlayHitEffect();

// Reliable vs Unreliable:
// Reliable = guaranteed delivery, ordered. Use for gameplay-critical (damage, state changes).
// Unreliable = may be dropped. Use for cosmetic (effects, sounds).

// Other
UFUNCTION(CallInEditor)           // Button appears in details panel to call in-editor
void GenerateGrid();

UFUNCTION(Exec)                   // Console command
void DebugKillAll();
```

---

## UCLASS Specifiers

```cpp
UCLASS(Blueprintable)             // Can create Blueprint subclass of this C++ class
UCLASS(BlueprintType)             // Can be used as a variable type in Blueprint
UCLASS(Abstract)                  // Cannot be instantiated directly, must subclass
UCLASS(NotBlueprintable)          // Prevents Blueprint subclassing
UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))  // For components
UCLASS(MinimalAPI)                // Reduces header includes, speeds compile
UCLASS(Transient)                 // Instances not saved to disk
```

**Common combo:**
```cpp
UCLASS(Blueprintable, BlueprintType)
class MYGAME_API AMyActor : public AActor
```

---

## USTRUCT and UENUM

```cpp
// Struct (must be BlueprintType to use in Blueprint)
USTRUCT(BlueprintType)
struct FCharacterStats
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Strength = 10.f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float Agility = 10.f;
};

// Enum
UENUM(BlueprintType)
enum class EGamePhase : uint8
{
    Setup    UMETA(DisplayName="Setup Phase"),
    Playing  UMETA(DisplayName="Playing"),
    GameOver UMETA(DisplayName="Game Over")
};
```

---

## Naming Conventions

| Prefix | Meaning | Example |
|--------|---------|---------|
| **F** | Struct or plain data type | `FVector`, `FHitResult`, `FCharacterStats` |
| **U** | UObject-derived (non-actor, non-component) | `UGameInstance`, `UAttributeSet` |
| **A** | AActor-derived | `ACharacter`, `AMyProjectile` |
| **E** | Enum | `EGamePhase`, `ECollisionChannel` |
| **I** | Interface | `IInteractable`, `IDamageable` |
| **T** | Template | `TArray`, `TMap`, `TSharedPtr` |
| **b** | Boolean variable prefix | `bIsAlive`, `bCanJump` |

**Other conventions:**
- Class names match filename: `AMyActor` lives in `MyActor.h` / `MyActor.cpp`
- Module API macro: `MYGAME_API` between class keyword and class name
- Functions use PascalCase: `GetHealthPercent()`, not `get_health_percent()`

---

## Essential Macros

```cpp
GENERATED_BODY()                  // Required in every UCLASS/USTRUCT. Generates reflection code.

Super::BeginPlay();               // Call parent implementation. Always call in overrides.
Super::Tick(DeltaTime);

// Logging
UE_LOG(LogTemp, Display, TEXT("Value: %f"), MyFloat);
UE_LOG(LogTemp, Warning, TEXT("Something suspect happened"));
UE_LOG(LogTemp, Error, TEXT("Critical failure in %s"), *GetName());
// Format specifiers: %f (float), %d (int), %s (TCHAR* from *FString), %i (int)

// Assertions (development only, stripped in shipping builds)
check(Pointer != nullptr);        // Hard crash if false. Use for "this should never happen."
checkf(Index >= 0, TEXT("Index was %d"), Index);  // crash with message
ensure(Pointer != nullptr);       // Logs error + callstack but does NOT crash. Returns bool.
ensureMsgf(Value > 0, TEXT("Value was %f"), Value);  // ensure with formatted message
verify(SomeFunction());           // Like check but the expression still executes in shipping builds

// Screen debug messages (alternative to UE_LOG)
GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Red, TEXT("Debug text"));
// First param: Key (-1 = always add new line, specific int = overwrite that slot)
```

---

## Memory Patterns

### UObject-derived (managed by Garbage Collector)

```cpp
// UPROPERTY prevents GC from collecting the object
UPROPERTY()
UMyObject* MyObj;

// Creating UObjects
MyObj = NewObject<UMyObject>(this);  // this = Outer (owner for GC purposes)

// Creating components in constructor
MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MeshComp"));
// Only valid inside constructor. TEXT name must be unique per class.

// Spawning actors
FActorSpawnParameters Params;
AMyActor* Spawned = GetWorld()->SpawnActor<AMyActor>(MyActorClass, SpawnLocation, SpawnRotation, Params);
```

### Non-UObject (manual or smart pointer management)

```cpp
// Shared pointer (reference counted, non-UObject only)
TSharedPtr<FMyData> DataPtr = MakeShared<FMyData>();

// Weak pointer (does not prevent destruction)
TWeakObjectPtr<AActor> WeakRef = SomeActor;  // For UObjects
TWeakPtr<FMyData> WeakData = DataPtr;         // For non-UObjects

// Unique pointer
TUniquePtr<FMyData> Unique = MakeUnique<FMyData>();

// CRITICAL: Never use TSharedPtr/TWeakPtr on UObjects. Use TWeakObjectPtr instead.
// CRITICAL: Always mark UObject* members with UPROPERTY() or they WILL be garbage collected.
```

---

## Common Includes

```cpp
#include "CoreMinimal.h"          // Always first. FVector, FString, TArray, FMath, basic types.
#include "GameFramework/Actor.h"  // AActor base class
#include "GameFramework/Character.h"     // ACharacter (movement, capsule, mesh)
#include "GameFramework/PlayerController.h"
#include "GameFramework/GameModeBase.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SkeletalMeshComponent.h"
#include "Components/BoxComponent.h"
#include "Components/SphereComponent.h"
#include "Components/AudioComponent.h"
#include "Kismet/GameplayStatics.h"      // GetPlayerCharacter, SpawnSound, ApplyDamage, etc.
#include "Kismet/KismetMathLibrary.h"    // FindLookAtRotation, RandomFloat, etc.
#include "Engine/World.h"                // GetWorld(), SpawnActor, Timers
#include "TimerManager.h"                // FTimerHandle, SetTimer
#include "DrawDebugHelpers.h"            // DrawDebugLine, DrawDebugSphere
#include "Net/UnrealNetwork.h"           // DOREPLIFETIME (replication)
```

**Include order:** Generated header first (`MyClass.generated.h` must be last in the header), then CoreMinimal, then engine headers, then project headers.

---

## Delegate Patterns

```cpp
// === Dynamic Multicast (Blueprint-compatible) ===

// Declare (in header, outside class or inside)
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, NewHealth);

// Member variable
UPROPERTY(BlueprintAssignable, Category="Events")
FOnHealthChanged OnHealthChanged;

// Broadcast (fires all bound listeners)
OnHealthChanged.Broadcast(CurrentHealth);

// Bind in C++
OtherActor->OnHealthChanged.AddDynamic(this, &AMyHUD::HandleHealthChanged);

// Handler signature must match
UFUNCTION()
void HandleHealthChanged(float NewHealth);

// === Non-dynamic delegates (C++ only, faster) ===
DECLARE_DELEGATE(FSimpleDelegate);                    // No params
DECLARE_DELEGATE_OneParam(FOnScoreChanged, int32);    // One param
DECLARE_MULTICAST_DELEGATE_OneParam(FOnRoundEnd, int32); // Multiple listeners

// Bind
MyDelegate.BindUObject(this, &AMyClass::HandleIt);       // Single-cast
MyMulticast.AddUObject(this, &AMyClass::HandleIt);        // Multi-cast

// Fire
MyDelegate.ExecuteIfBound();
MyMulticast.Broadcast(42);
```

---

## Timer Pattern

```cpp
// In header
FTimerHandle MyTimerHandle;

// Set a timer (one-shot)
GetWorld()->GetTimerManager().SetTimer(
    MyTimerHandle,          // Handle (for clearing later)
    this,                   // Object
    &AMyActor::OnTimerFire, // Function to call
    2.0f,                   // Delay in seconds
    false                   // bLoop (false = one-shot, true = repeating)
);

// Set a repeating timer
GetWorld()->GetTimerManager().SetTimer(MyTimerHandle, this, &AMyActor::SpawnEnemy, 5.0f, true);

// Clear
GetWorld()->GetTimerManager().ClearTimer(MyTimerHandle);

// Lambda timer (convenient for short logic)
GetWorld()->GetTimerManager().SetTimer(MyTimerHandle, [this]()
{
    UE_LOG(LogTemp, Display, TEXT("Timer fired"));
}, 3.0f, false);

// Check if active
bool bActive = GetWorld()->GetTimerManager().IsTimerActive(MyTimerHandle);
```

---

## Async Patterns

```cpp
// === AsyncTask (run work on a background thread) ===
AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask, [this]()
{
    // Heavy computation here (NOT safe to touch UObjects or game state)

    // Return to game thread for UObject access
    AsyncTask(ENamedThreads::GameThread, [this]()
    {
        // Safe to update UObjects, UI, etc.
        UpdateResults();
    });
});

// === FRunnable (dedicated thread, more control) ===
class FMyWorker : public FRunnable
{
public:
    virtual bool Init() override { return true; }
    virtual uint32 Run() override
    {
        // Thread work here
        while (bRunning)
        {
            // Process data
        }
        return 0;
    }
    virtual void Stop() override { bRunning = false; }

private:
    bool bRunning = true;
};

// Start the thread
FMyWorker* Worker = new FMyWorker();
FRunnableThread* Thread = FRunnableThread::Create(Worker, TEXT("MyWorkerThread"));

// === ParallelFor (divide array work across threads) ===
ParallelFor(MyArray.Num(), [&](int32 Index)
{
    // Process MyArray[Index]
    // Must be thread-safe, no UObject access
});
```

---

## Common Boilerplate: Actor with Component

```cpp
// MyActor.h
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyActor.generated.h"

UCLASS(Blueprintable)
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()

public:
    AMyActor();

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Components")
    UStaticMeshComponent* MeshComp;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Stats")
    float Health = 100.f;

    UFUNCTION(BlueprintCallable, Category="Combat")
    void TakeDamage(float DamageAmount);

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
};

// MyActor.cpp
#include "MyActor.h"

AMyActor::AMyActor()
{
    PrimaryActorTick.bCanEverTick = true;

    MeshComp = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MeshComp"));
    RootComponent = MeshComp;
}

void AMyActor::BeginPlay()
{
    Super::BeginPlay();
}

void AMyActor::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
}

void AMyActor::TakeDamage(float DamageAmount)
{
    Health = FMath::Clamp(Health - DamageAmount, 0.f, 100.f);
    UE_LOG(LogTemp, Display, TEXT("%s health: %f"), *GetName(), Health);
}
```

---

## Collision and Overlap Setup

```cpp
// In constructor
BoxComp = CreateDefaultSubobject<UBoxComponent>(TEXT("BoxComp"));
BoxComp->SetCollisionProfileName(TEXT("Trigger"));
BoxComp->SetGenerateOverlapEvents(true);

// Bind overlap in BeginPlay
BoxComp->OnComponentBeginOverlap.AddDynamic(this, &AMyActor::OnOverlapBegin);
BoxComp->OnComponentEndOverlap.AddDynamic(this, &AMyActor::OnOverlapEnd);

// Handler signature (exact params matter)
UFUNCTION()
void OnOverlapBegin(UPrimitiveComponent* OverlappedComp, AActor* OtherActor,
    UPrimitiveComponent* OtherComp, int32 OtherBodyIndex,
    bool bFromSweep, const FHitResult& SweepResult);
```

---

## Replication Essentials

```cpp
// In header
UPROPERTY(ReplicatedUsing=OnRep_Health)
float Health;

UFUNCTION()
void OnRep_Health();  // Called on clients when Health changes

// In .cpp, override GetLifetimeReplicatedProps
void AMyActor::GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const
{
    Super::GetLifetimeReplicatedProps(OutLifetimeProps);
    DOREPLIFETIME(AMyActor, Health);
    // Or with conditions:
    DOREPLIFETIME_CONDITION(AMyActor, Health, COND_OwnerOnly);  // Only to owning client
}

// In constructor
bReplicates = true;  // Actor replicates at all
bAlwaysRelevant = true;  // Optional: always replicate regardless of distance
```
