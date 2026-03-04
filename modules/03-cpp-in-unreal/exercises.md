# Module 03: Exercises

## Exercise 1: Create a C++ Actor

**Goal**: Create your first C++ class in Unreal, compile it, and place it in a level.

### Steps

1. Open your UE5 project.
2. Go to Tools > New C++ Class.
3. Select "Actor" as the parent class.
4. Name it `MyFirstCppActor`.
5. Click "Create Class." Your IDE (Visual Studio, Rider, or Xcode) will open with the generated .h and .cpp files.
6. In the constructor (`AMyFirstCppActor::AMyFirstCppActor()`), add:
   ```cpp
   PrimaryActorTick.bCanEverTick = false;
   ```
7. In `BeginPlay()`, add a log message:
   ```cpp
   UE_LOG(LogTemp, Warning, TEXT("MyFirstCppActor has spawned!"));
   ```
8. Also add an on-screen debug message in `BeginPlay()`:
   ```cpp
   if (GEngine)
   {
       GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Cyan, TEXT("Hello from C++!"));
   }
   ```
9. Compile the project (from your IDE or the editor's Compile button).
10. In the editor, find `MyFirstCppActor` in the Content Browser (under C++ Classes) and drag it into the level.
11. Press Play and verify both the log message and on-screen message appear.

### Success Criteria

- The project compiles without errors.
- "MyFirstCppActor has spawned!" appears in the Output Log (yellow warning text).
- "Hello from C++!" appears on screen when you press Play.

### Bonus

- Add a `Tick` function that logs the actor's world location every second (use a timer or a frame counter to avoid logging every frame).

---

## Exercise 2: Expose Variables to Blueprints

**Goal**: Create C++ properties that are visible and editable in the Unreal Editor and in Blueprints.

### Steps

1. Open your `MyFirstCppActor.h` file.
2. Add the following properties to the class:
   ```cpp
   UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
   float Health = 100.0f;

   UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
   float MaxHealth = 100.0f;

   UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Info")
   FString ActorDisplayName = TEXT("Default Actor");

   UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "State")
   bool bIsAlive = true;
   ```
3. In `BeginPlay()`, log all the values:
   ```cpp
   UE_LOG(LogTemp, Warning, TEXT("Name: %s, Health: %f/%f, Alive: %s"),
       *ActorDisplayName, Health, MaxHealth, bIsAlive ? TEXT("Yes") : TEXT("No"));
   ```
4. Compile and place the actor in your level.
5. Select the actor in the level and look at the Details panel. You should see your properties organized under "Stats," "Info," and "State."
6. Change the `Health` value to 50 and the `ActorDisplayName` to "Test Actor" in the Details panel.
7. Press Play and verify the log shows your edited values.

### Success Criteria

- All four properties appear in the Details panel, organized by category.
- `Health` and `MaxHealth` are editable. `ActorDisplayName` is editable. `bIsAlive` is visible but not editable (VisibleAnywhere).
- The logged values match what you set in the Details panel.

### Bonus

- Add a `meta = (ClampMin = 0.0, ClampMax = 200.0)` specifier to `Health` and verify that the editor prevents values outside that range.
- Create a Blueprint subclass of your C++ actor and verify that the properties are accessible in the Blueprint's Event Graph.

---

## Exercise 3: Call C++ Functions from Blueprints

**Goal**: Write functions in C++ and call them from a Blueprint subclass.

### Steps

1. In your `MyFirstCppActor.h`, add these function declarations:
   ```cpp
   UFUNCTION(BlueprintCallable, Category = "Combat")
   void ApplyDamage(float DamageAmount);

   UFUNCTION(BlueprintCallable, Category = "Combat")
   void Heal(float HealAmount);

   UFUNCTION(BlueprintPure, Category = "Stats")
   float GetHealthPercent() const;

   UFUNCTION(BlueprintNativeEvent, Category = "Combat")
   void OnDeath();
   ```
2. In your `MyFirstCppActor.cpp`, implement them:
   ```cpp
   void AMyFirstCppActor::ApplyDamage(float DamageAmount)
   {
       Health = FMath::Clamp(Health - DamageAmount, 0.0f, MaxHealth);
       UE_LOG(LogTemp, Warning, TEXT("Damage taken! Health: %f"), Health);
       if (Health <= 0.0f && bIsAlive)
       {
           bIsAlive = false;
           OnDeath();
       }
   }

   void AMyFirstCppActor::Heal(float HealAmount)
   {
       Health = FMath::Clamp(Health + HealAmount, 0.0f, MaxHealth);
       UE_LOG(LogTemp, Warning, TEXT("Healed! Health: %f"), Health);
   }

   float AMyFirstCppActor::GetHealthPercent() const
   {
       if (MaxHealth <= 0.0f) return 0.0f;
       return Health / MaxHealth;
   }

   void AMyFirstCppActor::OnDeath_Implementation()
   {
       UE_LOG(LogTemp, Error, TEXT("%s has died!"), *ActorDisplayName);
   }
   ```
3. Compile the C++ code.
4. In the Content Browser, right-click your C++ class and select "Create Blueprint Class Based on MyFirstCppActor."
5. Name it `BP_TestActor`.
6. Open `BP_TestActor`. In the Event Graph:
   - On BeginPlay, call `ApplyDamage` with a value of 60.
   - Then call `ApplyDamage` again with a value of 50 (this should trigger death).
7. Override the `OnDeath` event in the Blueprint. Add a Print String that says "Blueprint death logic triggered!" and make sure to call "Parent: OnDeath" to keep the C++ implementation.
8. Place `BP_TestActor` in the level and press Play.

### Success Criteria

- The C++ damage and health logging works correctly.
- `GetHealthPercent` is available as a pure node (no execution pins) in the Blueprint graph.
- The `OnDeath` event fires both the C++ implementation (log message) and the Blueprint override (print string).
- Health never goes below 0 or above MaxHealth.

---

## Exercise 4: Create a Custom Actor Component

**Goal**: Build a reusable component in C++ that can be added to any actor.

### Steps

1. Create a new C++ class with parent `ActorComponent`. Name it `HealthComponent`.
2. In `HealthComponent.h`:
   ```cpp
   UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Health")
   float MaxHealth = 100.0f;

   UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Health")
   float CurrentHealth;

   UFUNCTION(BlueprintCallable, Category = "Health")
   void TakeDamage(float Amount);

   UFUNCTION(BlueprintCallable, Category = "Health")
   void Heal(float Amount);

   UFUNCTION(BlueprintPure, Category = "Health")
   bool IsAlive() const;

   UPROPERTY(BlueprintAssignable, Category = "Health")
   FOnHealthChanged OnHealthChanged;

   UPROPERTY(BlueprintAssignable, Category = "Health")
   FOnDeath OnDeath;
   ```
3. Declare the dynamic delegates above the class:
   ```cpp
   DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnHealthChanged, float, NewHealth, float, MaxHealth);
   DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnDeath);
   ```
4. Implement the functions in the .cpp file. `TakeDamage` should subtract damage, clamp to 0, broadcast `OnHealthChanged`, and broadcast `OnDeath` if health reaches 0. `Heal` should add health, clamp to max, and broadcast `OnHealthChanged`.
5. In `BeginPlay`, set `CurrentHealth = MaxHealth`.
6. Compile.
7. Create a Blueprint actor. In the Components panel, click "Add Component" and search for "HealthComponent."
8. In the Blueprint's Event Graph, drag the HealthComponent reference, get the `OnHealthChanged` event, and bind it to print the new health value.
9. Test by calling `TakeDamage` on BeginPlay.

### Success Criteria

- The HealthComponent can be added to any Blueprint actor via the Components panel.
- `TakeDamage` and `Heal` work correctly and broadcast events.
- The Blueprint can bind to `OnHealthChanged` and `OnDeath` delegates.
- MaxHealth is configurable per instance in the Details panel.

### Bonus

- Add a `DamageMultiplier` property to the component (default 1.0) that scales incoming damage. This simulates armor or vulnerability.
- Create two actors with the HealthComponent: one with MaxHealth = 100 and one with MaxHealth = 50. Apply the same damage to both and verify they behave differently.

---

## Exercise 5: Build a Damage System

**Goal**: Combine C++ actors, components, and Blueprint communication into a working damage system.

### Steps

1. Create a C++ class `ADamageZone` that inherits from AActor.
   - Add a Box Collision component in the constructor.
   - Add a UPROPERTY for `DamagePerSecond` (float, default 10.0).
   - Override `NotifyActorBeginOverlap` and `NotifyActorEndOverlap`.

2. When an actor enters the zone:
   - Try to find a `UHealthComponent` on the overlapping actor using `FindComponentByClass<UHealthComponent>()`.
   - If found, start a timer (FTimerHandle) that calls `TakeDamage` on the component every second.

3. When the actor leaves the zone:
   - Clear the timer.

4. Create a C++ class `AHealingFountain` that inherits from AActor.
   - Add a Sphere Collision component.
   - Add a UPROPERTY for `HealPerSecond` (float, default 20.0).
   - Same overlap logic, but call `Heal` instead.

5. Create a Blueprint character (or use the Third Person character) and add a `HealthComponent` to it.

6. Place a `DamageZone` and a `HealingFountain` in the level.

7. Bind the character's `HealthComponent.OnHealthChanged` to a UI widget or Print String so you can see health changing in real time.

8. Play the game: walk into the damage zone (health drops), walk out (stops), walk into the healing fountain (health recovers).

### Success Criteria

- Entering the damage zone gradually reduces health.
- Leaving the damage zone stops the damage.
- Entering the healing fountain gradually restores health.
- Health never exceeds MaxHealth or drops below 0.
- The OnDeath delegate fires when health reaches 0.

### Architecture Check

After completing this exercise, your system should have this structure:
- `UHealthComponent`: Pure data and logic component. Knows nothing about damage zones or fountains.
- `ADamageZone`: Finds HealthComponents on overlapping actors and deals damage. Knows nothing about what kind of actor it is damaging.
- `AHealingFountain`: Same pattern, but heals.
- The character: Has a HealthComponent and listens to its events for UI/gameplay responses.

This separation of concerns is the heart of good UE5 architecture. Each piece does one job and communicates through clean interfaces.
