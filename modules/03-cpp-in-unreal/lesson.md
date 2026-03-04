# Module 03: C++ in Unreal Engine 5

## Introduction

Blueprints can build entire games, but there comes a point where you need C++. Performance-critical code, complex algorithms, engine-level features, and systems like the Gameplay Ability System (GAS) all require or strongly benefit from C++.

Think of it this way: C++ is the engine under the hood, and Blueprints are the dashboard. A driver interacts with the dashboard (easy, intuitive, visual), but a mechanic works under the hood (powerful, precise, lower-level). The best Unreal developers use both. C++ builds the core systems and exposes clean interfaces. Blueprints wire those systems together and let designers tweak values without touching code.

This lesson covers the fundamentals of writing C++ in UE5, from the macro system and build pipeline to practical patterns for actors, components, and communication.

---

## Why C++ Matters

### Performance

Blueprint nodes are interpreted at runtime. C++ is compiled to native machine code. For logic that runs every frame (AI decision-making, physics calculations, large data processing), C++ can be 10x to 100x faster.

### Engine Access

Some engine features are only accessible from C++. The Gameplay Ability System (GAS), custom animation nodes, low-level networking, and engine module extensions all require C++.

### Code Organization

As projects grow, Blueprint graphs can become unmanageable. A function that takes 3 lines of C++ might fill an entire screen in Blueprints. C++ provides text-based version control (Git diffs work perfectly), easier refactoring, and better tooling.

### The Best of Both Worlds

The standard professional pattern is: build core systems in C++, expose them to Blueprints, and let designers and gameplay programmers use Blueprints to create content. You are not choosing one or the other; you are using both.

---

## The UE5 Build System

Before you write any code, you need to understand how Unreal compiles it.

### Unreal Build Tool (UBT)

UBT is the build system that compiles your C++ code. When you press "Compile" in the editor or build from your IDE, UBT handles everything: finding source files, resolving dependencies, managing platform-specific compilation, and linking against the engine.

### Unreal Header Tool (UHT)

UHT runs before the actual compilation. It scans your header files for Unreal-specific macros (UCLASS, UPROPERTY, UFUNCTION) and generates the reflection code that makes those features work. This is why those macros exist: they are markers that UHT reads to generate the glue between your C++ code and the engine's type system.

### Modules

Unreal projects are organized into modules. Your game project is a module. The engine itself is made up of hundreds of modules. Each module has a `.Build.cs` file that specifies its dependencies, public/private include paths, and compilation settings.

For most projects, you will work within your game's single module and not worry about creating new ones. But understanding that modules exist helps when you see `#include` errors or dependency issues.

### The .generated.h File

Every UCLASS header file must include a generated header file (e.g., `MyActor.generated.h`). This file is auto-created by UHT and contains the reflection code. You never edit it. You just include it, and it must be the **last** include in your header file.

---

## The Macro System: UCLASS, UPROPERTY, UFUNCTION

These macros are the bridge between your C++ code and the Unreal Engine reflection system. They tell the engine "this class/property/function exists and should be visible to the editor, Blueprints, serialization, and garbage collection."

### UCLASS()

Place this above every class that inherits from UObject (or any UObject-derived class like AActor, UActorComponent, etc.).

```cpp
UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()

public:
    AMyActor();
};
```

Key points:
- `GENERATED_BODY()` must appear inside the class body. It expands to the generated reflection code.
- `MYGAME_API` is the module's export macro. It makes the class visible to other modules.
- Common UCLASS specifiers: `Blueprintable` (can be subclassed in Blueprints), `BlueprintType` (can be used as a variable type in Blueprints), `Abstract` (cannot be instanced directly).

### UPROPERTY()

Place this above member variables to expose them to the engine.

```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
float Health = 100.0f;

UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "State")
bool bIsAlive = true;
```

Common specifiers:
- `EditAnywhere`: Editable in the Details panel on instances and defaults.
- `EditDefaultsOnly`: Editable only on the class defaults, not on instances.
- `EditInstanceOnly`: Editable only on placed instances in the level.
- `VisibleAnywhere`: Visible but not editable.
- `BlueprintReadWrite`: Can be read and written from Blueprints.
- `BlueprintReadOnly`: Can be read but not written from Blueprints.
- `Category = "Name"`: Organizes the property into a named section in the Details panel.
- `meta = (ClampMin = 0, ClampMax = 100)`: Adds constraints to numeric values.

### UFUNCTION()

Place this above functions to expose them to the engine and/or Blueprints.

```cpp
UFUNCTION(BlueprintCallable, Category = "Combat")
void TakeDamage(float DamageAmount);

UFUNCTION(BlueprintPure, Category = "Stats")
float GetHealthPercent() const;

UFUNCTION(BlueprintNativeEvent, Category = "Combat")
void OnDeath();
```

Common specifiers:
- `BlueprintCallable`: Can be called from Blueprints (has an execution pin).
- `BlueprintPure`: Can be called from Blueprints but has no execution pin (like a math function, no side effects).
- `BlueprintNativeEvent`: Defined in C++ with a default implementation, but can be overridden in Blueprints.
- `BlueprintImplementableEvent`: Declared in C++ but implemented entirely in Blueprints.

---

## Header Files (.h) vs Implementation Files (.cpp)

C++ separates declarations from definitions. This is different from most modern languages and takes some getting used to.

### Header File (.h)

The header is the "contract." It declares what a class has and what it can do, without providing the full implementation.

```cpp
// MyActor.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyActor.generated.h"

UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()

public:
    AMyActor();

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
    float Health;

    UFUNCTION(BlueprintCallable, Category = "Combat")
    void TakeDamage(float Amount);

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
};
```

### Implementation File (.cpp)

The .cpp file provides the actual logic for everything declared in the header.

```cpp
// MyActor.cpp
#include "MyActor.h"

AMyActor::AMyActor()
{
    PrimaryActorTick.bCanEverTick = true;
    Health = 100.0f;
}

void AMyActor::BeginPlay()
{
    Super::BeginPlay();
    UE_LOG(LogTemp, Warning, TEXT("MyActor has spawned with %f health"), Health);
}

void AMyActor::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
}

void AMyActor::TakeDamage(float Amount)
{
    Health -= Amount;
    if (Health <= 0.0f)
    {
        Health = 0.0f;
        UE_LOG(LogTemp, Warning, TEXT("MyActor has died!"));
    }
}
```

Think of the .h file as a menu at a restaurant (it tells you what is available) and the .cpp file as the kitchen (it does the actual cooking).

---

## Creating C++ Classes

### From the Editor

1. Go to Tools > New C++ Class (or File > New C++ Class).
2. Choose a parent class (AActor, ACharacter, UActorComponent, APawn, etc.).
3. Name your class. Unreal automatically adds the correct prefix (A for actors, U for UObject-derived, F for structs).
4. Click "Create Class." The editor generates the .h and .cpp files and opens your IDE.

### From Your IDE

You can also create files manually, but you must:
- Follow the naming conventions (prefix rules).
- Include the `.generated.h` file.
- Add the class to the correct module folder.
- Use UCLASS() and GENERATED_BODY().

### Compiling

- **In the editor**: Click the "Compile" button in the toolbar (or press Ctrl + Alt + F11). This does a "hot reload" which compiles and injects the new code without restarting the editor. Hot reload can sometimes be unreliable for structural changes; restarting the editor is safer.
- **In your IDE**: Build the solution (F5 in Visual Studio, Cmd + B in Xcode, etc.). Then restart the editor.
- **Live Coding**: UE5 supports Live Coding (Ctrl + Alt + F11), which is a faster version of hot reload. It works well for small changes to function bodies.

---

## The Relationship Between C++ and Blueprints

This is one of the most important concepts in Unreal development. C++ and Blueprints are not competitors. They are partners.

### C++ as the Skeleton, Blueprints as the Skin

C++ defines the structure: base classes, core functions, performance-critical logic, data types. Blueprints flesh it out: specific values, visual effects, animation triggers, designer-tunable behavior.

### The Practical Pattern

1. Create a C++ base class (e.g., `AWeaponBase`).
2. Define properties in C++: damage, fire rate, ammo count (with UPROPERTY so they are visible in Blueprints).
3. Define core functions in C++: `Fire()`, `Reload()`, `CalculateDamage()` (with UFUNCTION so they are callable from Blueprints).
4. Create a Blueprint subclass of `AWeaponBase` (right-click the C++ class in Content Browser > Create Blueprint Class Based on This).
5. In the Blueprint, set specific values (damage = 25, fire rate = 0.5), add visual components (mesh, particles, sounds), and override events for weapon-specific behavior.

This gives you the performance and organization of C++ with the flexibility and iteration speed of Blueprints.

### BlueprintNativeEvent

This is the key mechanism for C++/Blueprint cooperation:

```cpp
UFUNCTION(BlueprintNativeEvent, Category = "Combat")
void OnHit(AActor* HitActor);
```

In C++, you implement the default behavior in a function suffixed with `_Implementation`:

```cpp
void AWeaponBase::OnHit_Implementation(AActor* HitActor)
{
    // Default C++ behavior
    UE_LOG(LogTemp, Log, TEXT("Hit: %s"), *HitActor->GetName());
}
```

In a Blueprint subclass, you can override `OnHit` to add or replace behavior. If the Blueprint calls "Parent: OnHit," the C++ implementation runs too.

---

## Common Base Classes

Unreal has a class hierarchy. Knowing which class to inherit from saves you time and gives you built-in functionality.

### AActor

The base class for anything placed in a level. Has a transform (location, rotation, scale), can have components, supports Tick, replication, and damage. Use this for static objects, interactables, projectiles, and anything that is not a character.

### APawn

An actor that can be "possessed" by a controller (player or AI). Has basic movement input support. Use this for vehicles, drones, or simple controllable entities.

### ACharacter

Extends APawn with a CharacterMovementComponent for walking, jumping, crouching, swimming, and flying. Use this for humanoid characters, both player and AI.

### APlayerController

Manages input and the connection between the player and their pawn. Handles UI, camera management, and input mapping.

### UActorComponent

A component that adds behavior or data to an actor but has no transform (no position in the world). Use this for systems: health component, inventory component, stats component.

### USceneComponent

A component with a transform. It has a position, rotation, and scale in the world and can be attached to other components. Use this when you need a spatial component: a socket, an attach point, a movement path anchor.

---

## Memory Management and Garbage Collection

One of C++'s biggest challenges is memory management. Unreal solves this with a garbage collector, but you need to understand the rules.

### The Garbage Collector (GC)

Unreal has an automatic garbage collector for all UObject-derived types. If a UObject has no references pointing to it, the GC will eventually destroy it.

### UPROPERTY Prevents Garbage Collection

This is critical: if you store a pointer to a UObject in a raw C++ pointer (without UPROPERTY), the garbage collector does not know about it. The GC might destroy the object, and your pointer becomes a dangling pointer (pointing to freed memory). Crash.

```cpp
// DANGEROUS: GC does not know about this pointer
UMyComponent* MyComp;

// SAFE: UPROPERTY tells the GC to keep this object alive
UPROPERTY()
UMyComponent* MyComp;
```

**Rule**: Every UObject pointer stored as a class member should be a UPROPERTY. The only exception is temporary local variables within a single function scope.

### Creating and Destroying Objects

- **Actors**: Use `GetWorld()->SpawnActor<AMyActor>(...)` to spawn and `Destroy()` to remove.
- **Components**: Use `CreateDefaultSubobject<UMyComponent>(TEXT("Name"))` in the constructor.
- **UObjects**: Use `NewObject<UMyObject>(Outer)` to create.
- **Never use `new` and `delete`** for UObject-derived types. The engine manages their lifecycle.

---

## Delegates and Events

Delegates are type-safe function pointers. They let one object call a function on another object without knowing its exact type. Think of a delegate as a callback: "when something happens, call this function."

### Single-Cast Delegates

A delegate that points to one function.

```cpp
// Declare the delegate type
DECLARE_DELEGATE_OneParam(FOnHealthChanged, float);

// In your class
FOnHealthChanged OnHealthChanged;

// Binding (somewhere else)
MyActor->OnHealthChanged.BindUObject(this, &AMyListener::HandleHealthChanged);

// Firing
OnHealthChanged.ExecuteIfBound(NewHealth);
```

### Multi-Cast Delegates

A delegate that can have multiple listeners (like an event dispatcher in Blueprints).

```cpp
DECLARE_MULTICAST_DELEGATE_OneParam(FOnDeath, AActor*);

FOnDeath OnDeath;

// Binding
MyActor->OnDeath.AddUObject(this, &AGameMode::HandlePlayerDeath);
MyActor->OnDeath.AddUObject(this, &AHUD::HandlePlayerDeath);

// Firing (broadcasts to all listeners)
OnDeath.Broadcast(this);
```

### Dynamic Multi-Cast Delegates (Blueprint-compatible)

If you want Blueprints to bind to your delegate, use the dynamic version:

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChanged, int32, NewScore);

UPROPERTY(BlueprintAssignable, Category = "Events")
FOnScoreChanged OnScoreChanged;
```

In Blueprints, this appears as an Event Dispatcher that Blueprints can bind to using "Assign" nodes.

---

## Unreal Containers: TArray, TMap, TSet

Unreal provides its own container types that integrate with the garbage collector, serialization, and Blueprint system. Do not use `std::vector`, `std::map`, or `std::set` in Unreal code.

### TArray

A dynamic array (resizable list). The most commonly used container.

```cpp
UPROPERTY(EditAnywhere, BlueprintReadWrite)
TArray<FString> Inventory;

// Usage
Inventory.Add(TEXT("Sword"));
Inventory.Add(TEXT("Shield"));
int32 Count = Inventory.Num();
FString FirstItem = Inventory[0];
Inventory.Remove(TEXT("Sword"));
bool HasShield = Inventory.Contains(TEXT("Shield"));
```

### TMap

A key-value dictionary. Like a real-world dictionary: look up a word (key) to get its definition (value).

```cpp
UPROPERTY()
TMap<FString, int32> ItemCounts;

// Usage
ItemCounts.Add(TEXT("Gold"), 100);
ItemCounts.Add(TEXT("Arrows"), 30);
int32* GoldPtr = ItemCounts.Find(TEXT("Gold"));
if (GoldPtr)
{
    int32 GoldAmount = *GoldPtr;
}
```

### TSet

An unordered collection of unique values. No duplicates allowed.

```cpp
UPROPERTY()
TSet<FString> UnlockedAchievements;

// Usage
UnlockedAchievements.Add(TEXT("FirstBlood"));
UnlockedAchievements.Add(TEXT("FirstBlood")); // Ignored, already exists
bool HasAchievement = UnlockedAchievements.Contains(TEXT("FirstBlood"));
```

### When to Use Each

| Container | Use When... |
|-----------|------------|
| TArray | You need an ordered list, index-based access, or iteration |
| TMap | You need to look up values by a key (name, ID, enum) |
| TSet | You need a collection of unique items and fast existence checks |

---

## Logging and Debugging

### UE_LOG

The primary logging macro. Messages appear in the Output Log panel in the editor.

```cpp
UE_LOG(LogTemp, Display, TEXT("This is a normal message"));
UE_LOG(LogTemp, Warning, TEXT("Health is low: %f"), Health);
UE_LOG(LogTemp, Error, TEXT("Failed to find actor: %s"), *ActorName);
```

Log verbosity levels: Display (white), Warning (yellow), Error (red).

### On-Screen Debug Messages

```cpp
if (GEngine)
{
    GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Red, TEXT("Damage taken!"));
}
```

### Debug Drawing

```cpp
DrawDebugLine(GetWorld(), Start, End, FColor::Green, false, 5.0f);
DrawDebugSphere(GetWorld(), Location, 50.0f, 12, FColor::Blue, false, 5.0f);
```

These draw shapes in the viewport during gameplay, which is invaluable for debugging spatial logic (line traces, AI sight cones, trigger ranges).

---

## Summary

In this lesson you learned:

- Why C++ matters: performance, engine access, and code organization.
- The UE5 build system: UBT compiles, UHT generates reflection code, modules organize dependencies.
- The macro system: UCLASS, UPROPERTY, and UFUNCTION expose your code to the engine and Blueprints.
- Header/implementation separation: .h declares, .cpp defines.
- The C++/Blueprint relationship: C++ as the skeleton, Blueprints as the skin.
- Common base classes: AActor, ACharacter, UActorComponent, and when to use each.
- Memory management: UPROPERTY keeps UObject pointers safe from garbage collection.
- Delegates: single-cast, multi-cast, and dynamic (Blueprint-compatible) callbacks.
- Unreal containers: TArray (lists), TMap (dictionaries), TSet (unique collections).
- Logging and debugging tools.

With C++ and Blueprints together, you have the complete toolkit for building anything in Unreal Engine 5.
