# Module 06: Camera Systems and Input Handling

## Why This Module Matters

Cameras are the eyes of your player. Every moment of your game is experienced through a camera, and the camera's position, angle, and movement tell the player what kind of moment they are in. A close third-person camera says "you are this character, this is personal." An elevated isometric view says "you are the strategist, think tactically." A fixed tabletop shot says "you are sitting at the table with your friends."

Your DnD RPG needs at least four distinct camera modes, and it needs to transition between them seamlessly. A clunky camera transition breaks immersion faster than any visual glitch or gameplay bug. When the camera flows naturally from the tabletop overview into the dungeon, and then shifts to an isometric tactical view when combat starts, the player never thinks about the camera at all. That is the goal: invisible, perfect framing.

Think of cameras like a film crew. The director (your CameraDirector class) calls the shots: "Cut to isometric," "Slowly dolly into third person," "Hold on this cinematic angle." Each camera operator (camera mode) knows exactly where to stand and how to frame the shot. The director coordinates them all.

---

## The Spring Arm Component

The Spring Arm is the workhorse of third-person cameras in Unreal. It is a component that maintains a fixed distance between the camera and its parent (usually the character), with built-in collision handling and smoothing.

Think of it as a selfie stick with a brain. It tries to keep the camera at the end of the stick, but if the stick would poke through a wall, it shortens automatically so the camera stays in valid space. When the wall is no longer in the way, the stick smoothly extends back to full length.

### Key Properties

**Target Arm Length**
The distance from the parent to the camera, in Unreal units. A typical third-person game uses 200-400 units. Shorter values feel intimate and action-oriented. Longer values show more of the environment.

**Socket Offset and Target Offset**
Socket Offset moves the camera at the end of the arm (shifts the camera itself). Target Offset moves the target point at the base of the arm (shifts what the camera orbits around). Use Target Offset to position the camera slightly above and to the right of the character, which is the standard over-the-shoulder view.

```cpp
SpringArmComponent->TargetArmLength = 300.0f;
SpringArmComponent->SocketOffset = FVector(0.0f, 50.0f, 0.0f);   // Camera offset right
SpringArmComponent->TargetOffset = FVector(0.0f, 0.0f, 60.0f);   // Look above character centre
```

**Camera Lag**
When enabled, the camera does not instantly follow the character. It smoothly catches up over time, creating a floaty, cinematic feel. Two settings control this:

- `bEnableCameraLag`: turns position lag on/off
- `CameraLagSpeed`: how fast the camera catches up (lower = more lag, higher = snappier)

```cpp
SpringArmComponent->bEnableCameraLag = true;
SpringArmComponent->CameraLagSpeed = 8.0f;
SpringArmComponent->bEnableCameraRotationLag = true;
SpringArmComponent->CameraRotationLagSpeed = 10.0f;
```

For exploration, moderate lag (speed 6-10) feels smooth and cinematic. For combat, reduce lag (speed 15+) or disable it entirely so the camera responds instantly to player input.

**Collision**
The Spring Arm automatically performs a sphere trace along its length. If anything blocks the line between the parent and the camera, the arm shortens to prevent clipping through geometry.

```cpp
SpringArmComponent->bDoCollisionTest = true;
SpringArmComponent->ProbeSize = 12.0f;     // Radius of the collision sphere
SpringArmComponent->ProbeChannel = ECC_Camera;
```

**Inheritance Control**
You can control which transforms the Spring Arm inherits from its parent:

- `bInheritPitch`, `bInheritYaw`, `bInheritRoll`: control rotation inheritance
- `bUsePawnControlRotation`: if true, the arm follows the controller's rotation (mouse/gamepad look). If false, it follows the pawn's rotation.

For a third-person camera where the player controls the view: `bUsePawnControlRotation = true`. For a fixed camera that always looks from the same angle regardless of character facing: set to false and manually control the rotation.

---

## Camera Actors vs Camera Components

Unreal offers two ways to place cameras:

### Camera Components
Attached directly to an actor (usually the player character via a Spring Arm). The camera moves with the actor. This is the standard approach for third-person and first-person cameras that follow the player.

```cpp
// On the character
UPROPERTY(VisibleAnywhere)
USpringArmComponent* SpringArm;

UPROPERTY(VisibleAnywhere)
UCameraComponent* FollowCamera;

// In constructor
SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
SpringArm->SetupAttachment(RootComponent);
FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
FollowCamera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);
```

### Camera Actors (ACameraActor)
Standalone actors placed in the world. They sit at a fixed position and rotation (or follow a spline/rail). Use these for cinematic shots, fixed-angle rooms, security camera views, or the tabletop overhead shot.

```cpp
// Placed in the level editor or spawned at runtime
ACameraActor* TabletopCamera; // Points straight down at the table
ACameraActor* CinematicCamera; // On a rail for dramatic reveals
```

### When to Use Which

| Camera Type | Use Case |
|---|---|
| Camera Component on character | Third-person follow, first-person, over-the-shoulder |
| Camera Actor in world | Fixed tabletop view, cinematic angles, room cameras |
| Camera Component on separate actor | Isometric follow (attached to an invisible pawn that follows the party) |

---

## The Player Camera Manager

Every Player Controller has a Player Camera Manager that handles the active camera view. It determines which camera the player sees through, manages transitions between cameras, and applies camera modifiers (screen shake, fade-ins).

You rarely interact with the Camera Manager directly for basic setups, but for a multi-camera game like ours, understanding it is important.

### SetViewTargetWithBlend

This is the function you will use most often. It smoothly transitions the player's view from one camera to another over a specified duration.

```cpp
// Transition from current camera to the isometric camera over 1.5 seconds
APlayerController* PC = GetWorld()->GetFirstPlayerController();
PC->SetViewTargetWithBlend(
    IsometricCameraActor,       // The new camera to switch to
    1.5f,                        // Blend time in seconds
    EViewTargetBlendFunction::VTBlend_EaseInOut,  // Blend curve
    0.0f,                        // Exponent (for cubic/exponential curves)
    false                        // Lock outgoing viewpoint during blend
);
```

The blend functions control the feel of the transition:
- **VTBlend_Linear:** Constant speed, looks mechanical
- **VTBlend_Cubic:** Smooth acceleration and deceleration, most natural for gameplay
- **VTBlend_EaseIn:** Slow start, fast finish. Good for dramatic reveals.
- **VTBlend_EaseOut:** Fast start, slow finish. Good for settling into a position.
- **VTBlend_EaseInOut:** Smooth both ends. The default choice for most transitions.

---

## Building Multiple Camera Modes

Your game needs several distinct camera modes. Here is how each one works.

### Mode 1: Third-Person Exploration

The standard over-the-shoulder camera for wandering dungeons and towns. The player controls rotation with the mouse or right stick.

```cpp
// Configuration
SpringArm->TargetArmLength = 300.0f;
SpringArm->TargetOffset = FVector(0.0f, 0.0f, 60.0f);
SpringArm->SocketOffset = FVector(0.0f, 50.0f, 0.0f);
SpringArm->bUsePawnControlRotation = true;
SpringArm->bEnableCameraLag = true;
SpringArm->CameraLagSpeed = 8.0f;
SpringArm->bDoCollisionTest = true;

// Character rotation
Character->bOrientRotationToMovement = true;  // Character faces movement direction
Character->bUseControllerRotationYaw = false;  // Character doesn't snap to camera
```

### Mode 2: Isometric Tactical

A fixed-angle, elevated camera looking down at the battlefield. Used during tactical combat when players need to see the whole encounter. The camera follows the active character but does not rotate with mouse input.

```cpp
// Isometric camera setup (on a separate actor or by reconfiguring the spring arm)
void ACameraDirector::SetIsometricMode()
{
    // Fixed rotation: 45 degrees yaw, -50 degrees pitch (looking down at an angle)
    SpringArm->bUsePawnControlRotation = false;
    SpringArm->SetWorldRotation(FRotator(-50.0f, 45.0f, 0.0f));
    SpringArm->TargetArmLength = 800.0f;
    SpringArm->bEnableCameraLag = true;
    SpringArm->CameraLagSpeed = 5.0f;
    SpringArm->bDoCollisionTest = false;  // No collision in isometric view

    // Disable character rotation from controller
    Character->bUseControllerRotationYaw = false;

    // Optionally switch to orthographic projection for a true isometric feel
    FollowCamera->SetProjectionMode(ECameraProjectionMode::Orthographic);
    FollowCamera->SetOrthoWidth(1500.0f);
}
```

### Mode 3: Fixed Tabletop

A camera positioned above the physical tabletop, looking straight down (or at a slight angle). This shows the miniatures on the table surface with the DM screen, dice, and character sheets visible around the edges.

```cpp
void ACameraDirector::SetTabletopMode()
{
    // Switch to a pre-placed Camera Actor above the table
    APlayerController* PC = GetWorld()->GetFirstPlayerController();

    // TabletopCamera is an ACameraActor placed in the level
    PC->SetViewTargetWithBlend(TabletopCamera, 2.0f, VTBlend_EaseInOut);

    // The tabletop camera has:
    // - Fixed position above the table centre
    // - Slight downward angle (pitch -75 to -90)
    // - No player control over rotation
    // - Depth of field focused on the table surface
}
```

### Mode 4: Cinematic Rail

For dramatic moments: entering a new area, a boss reveal, a story cutscene. The camera follows a predefined spline path.

```cpp
void ACameraDirector::PlayCinematicShot(USplineComponent* CameraPath, float Duration)
{
    // Spawn or reuse a camera actor
    CinematicCamera->SetActorLocation(CameraPath->GetLocationAtSplinePoint(0, ESplineCoordinateSpace::World));

    // Blend to the cinematic camera
    APlayerController* PC = GetWorld()->GetFirstPlayerController();
    PC->SetViewTargetWithBlend(CinematicCamera, 0.5f, VTBlend_EaseIn);

    // Animate along the spline using a timeline
    // Each tick: CinematicCamera->SetActorLocation(CameraPath->GetLocationAtTime(Progress));
    //            CinematicCamera->SetActorRotation(CameraPath->GetRotationAtTime(Progress));
}
```

### Mode 5: Close-Up Dialogue

When speaking to NPCs, the camera moves to a position showing both characters in a classic over-the-shoulder dialogue framing.

```cpp
void ACameraDirector::SetDialogueMode(AActor* Speaker, AActor* Listener)
{
    // Calculate a position behind the listener, looking at the speaker
    FVector ListenerToSpeaker = (Speaker->GetActorLocation() - Listener->GetActorLocation()).GetSafeNormal();
    FVector CameraPosition = Listener->GetActorLocation()
        - ListenerToSpeaker * 100.0f   // Behind the listener
        + FVector(0, 50, 30);           // Offset right and up

    FRotator CameraRotation = ListenerToSpeaker.Rotation();

    DialogueCamera->SetActorLocationAndRotation(CameraPosition, CameraRotation);

    APlayerController* PC = GetWorld()->GetFirstPlayerController();
    PC->SetViewTargetWithBlend(DialogueCamera, 0.8f, VTBlend_EaseInOut);
}
```

---

## The Camera Director

For a game with this many camera modes, you need a central manager class. The Camera Director is an actor (or actor component) that:

1. Tracks the current camera mode
2. Handles transitions between modes
3. Responds to gameplay events (combat started, dialogue opened, area entered)
4. Manages camera-specific settings (input mode, cursor visibility, UI state)

```cpp
UENUM(BlueprintType)
enum class ECameraMode : uint8
{
    ThirdPerson,
    Isometric,
    Tabletop,
    Cinematic,
    Dialogue
};

UCLASS()
class ACameraDirector : public AActor
{
    GENERATED_BODY()

public:
    void SetCameraMode(ECameraMode NewMode, float BlendTime = 1.0f);
    ECameraMode GetCurrentMode() const { return CurrentMode; }

private:
    ECameraMode CurrentMode;

    UPROPERTY()
    ACameraActor* TabletopCamera;

    UPROPERTY()
    ACameraActor* CinematicCamera;

    UPROPERTY()
    ACameraActor* DialogueCamera;

    void ConfigureThirdPerson();
    void ConfigureIsometric();
    void TransitionToTabletop(float BlendTime);
    void TransitionToCinematic(float BlendTime);
    void TransitionToDialogue(float BlendTime);

    // Called when the mode changes to update input, cursor, and UI
    void OnModeChanged(ECameraMode OldMode, ECameraMode NewMode);
};

void ACameraDirector::SetCameraMode(ECameraMode NewMode, float BlendTime)
{
    if (NewMode == CurrentMode) return;

    ECameraMode OldMode = CurrentMode;
    CurrentMode = NewMode;

    switch (NewMode)
    {
        case ECameraMode::ThirdPerson:
            ConfigureThirdPerson();
            break;
        case ECameraMode::Isometric:
            ConfigureIsometric();
            break;
        case ECameraMode::Tabletop:
            TransitionToTabletop(BlendTime);
            break;
        case ECameraMode::Cinematic:
            TransitionToCinematic(BlendTime);
            break;
        case ECameraMode::Dialogue:
            TransitionToDialogue(BlendTime);
            break;
    }

    OnModeChanged(OldMode, NewMode);
}
```

### Coupling Camera Mode with Game State

The Camera Director should listen to gameplay events and automatically switch modes:

```cpp
void ACameraDirector::OnCombatStarted()
{
    SetCameraMode(ECameraMode::Isometric, 1.5f);
}

void ACameraDirector::OnCombatEnded()
{
    SetCameraMode(ECameraMode::ThirdPerson, 2.0f);
}

void ACameraDirector::OnDialogueStarted(AActor* NPC)
{
    SetDialogueMode(PlayerCharacter, NPC);
    SetCameraMode(ECameraMode::Dialogue, 0.8f);
}

void ACameraDirector::OnReturnToTabletop()
{
    SetCameraMode(ECameraMode::Tabletop, 2.5f);
    // Also update the Material Parameter Collection for the miniature transition
    UKismetMaterialLibrary::SetScalarParameterValue(
        GetWorld(), GlobalMPC, "TransitionProgress", 0.0f);
}
```

---

## Enhanced Input System

UE5's Enhanced Input System replaces the legacy input system with a more flexible, data-driven approach. Instead of binding keys directly to functions, you define abstract Input Actions, group them into Input Mapping Contexts, and apply modifiers and triggers to customise the behaviour.

Think of it as a translation layer. The physical input (pressing "W" on the keyboard, pushing a gamepad stick forward) goes through a series of processing steps before it reaches your gameplay code as a clean, abstract action ("Move Forward at 0.7 intensity"). This separation means you can completely rebind controls, support multiple input devices, and change context-sensitive bindings without touching gameplay code.

### Input Actions (IA)

An Input Action represents a single abstract gameplay input. It has a value type:

- **Bool:** On/off. Jump, interact, open menu.
- **Axis1D (float):** Single-axis value. Throttle, zoom.
- **Axis2D (FVector2D):** Two axes. Movement (forward/right), camera look (yaw/pitch).
- **Axis3D (FVector):** Three axes. Rarely used in gameplay, more for VR.

```cpp
// Define Input Actions as assets (usually created in the editor)
UPROPERTY(EditAnywhere, Category = "Input")
UInputAction* IA_Move;        // Axis2D: character movement

UPROPERTY(EditAnywhere, Category = "Input")
UInputAction* IA_Look;        // Axis2D: camera rotation

UPROPERTY(EditAnywhere, Category = "Input")
UInputAction* IA_Jump;        // Bool: jump

UPROPERTY(EditAnywhere, Category = "Input")
UInputAction* IA_Interact;    // Bool: interact with objects

UPROPERTY(EditAnywhere, Category = "Input")
UInputAction* IA_AbilitySlot1; // Bool: activate ability in slot 1
```

### Input Mapping Contexts (IMC)

A Mapping Context is a collection of key/button bindings for a set of Input Actions. You can have multiple contexts and swap them at runtime based on the game state.

```
IMC_Exploration:
    IA_Move       -> WASD / Left Stick
    IA_Look       -> Mouse Delta / Right Stick
    IA_Jump       -> Space / Gamepad Face Bottom
    IA_Interact   -> E / Gamepad Face Left

IMC_Combat:
    IA_Move       -> WASD / Left Stick (disabled in turn-based)
    IA_AbilitySlot1 -> 1 / D-Pad Up
    IA_AbilitySlot2 -> 2 / D-Pad Right
    IA_AbilitySlot3 -> 3 / D-Pad Down
    IA_AbilitySlot4 -> 4 / D-Pad Left
    IA_EndTurn    -> Enter / Gamepad Face Right

IMC_UI:
    IA_Navigate   -> Arrow Keys / Left Stick
    IA_Confirm    -> Enter / Gamepad Face Bottom
    IA_Cancel     -> Escape / Gamepad Face Right
```

### Adding and Removing Contexts

```cpp
void ATQPlayerController::SetupInputContexts()
{
    UEnhancedInputLocalPlayerSubsystem* Subsystem =
        ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer());

    if (Subsystem)
    {
        // Start with exploration context
        Subsystem->AddMappingContext(IMC_Exploration, 0);
    }
}

void ATQPlayerController::SwitchToCombatInput()
{
    UEnhancedInputLocalPlayerSubsystem* Subsystem =
        ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(GetLocalPlayer());

    if (Subsystem)
    {
        Subsystem->RemoveMappingContext(IMC_Exploration);
        Subsystem->AddMappingContext(IMC_Combat, 0);
    }
}
```

### Binding Actions to Functions

```cpp
void ATQCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    UEnhancedInputComponent* EnhancedInput = Cast<UEnhancedInputComponent>(PlayerInputComponent);
    if (!EnhancedInput) return;

    // Movement: fires every frame while keys are held
    EnhancedInput->BindAction(IA_Move, ETriggerEvent::Triggered, this, &ATQCharacter::OnMove);

    // Look: fires every frame while mouse moves or stick is tilted
    EnhancedInput->BindAction(IA_Look, ETriggerEvent::Triggered, this, &ATQCharacter::OnLook);

    // Jump: fires once when pressed
    EnhancedInput->BindAction(IA_Jump, ETriggerEvent::Started, this, &ATQCharacter::OnJump);

    // Interact: fires once when pressed
    EnhancedInput->BindAction(IA_Interact, ETriggerEvent::Started, this, &ATQCharacter::OnInteract);
}

void ATQCharacter::OnMove(const FInputActionValue& Value)
{
    FVector2D MoveInput = Value.Get<FVector2D>();

    // Convert 2D input to world direction relative to camera
    FRotator CameraRotation = GetControlRotation();
    CameraRotation.Pitch = 0.0f;
    CameraRotation.Roll = 0.0f;

    FVector ForwardDirection = FRotationMatrix(CameraRotation).GetUnitAxis(EAxis::X);
    FVector RightDirection = FRotationMatrix(CameraRotation).GetUnitAxis(EAxis::Y);

    AddMovementInput(ForwardDirection, MoveInput.Y);
    AddMovementInput(RightDirection, MoveInput.X);
}

void ATQCharacter::OnLook(const FInputActionValue& Value)
{
    FVector2D LookInput = Value.Get<FVector2D>();
    AddControllerYawInput(LookInput.X);
    AddControllerPitchInput(LookInput.Y);
}
```

### Modifiers and Triggers

**Modifiers** process the input value before it reaches your code:
- **Dead Zone:** Ignores small stick movements (prevents drift)
- **Scalar:** Multiplies the input value (sensitivity adjustment)
- **Negate:** Inverts the axis (invert Y-axis for look)
- **Swizzle Input Axis Values:** Remaps axes (swap X and Y)

**Triggers** determine when the action fires:
- **Down:** Fires every frame while the input is held
- **Pressed:** Fires once when the input transitions from released to held
- **Released:** Fires once when the input transitions from held to released
- **Hold:** Fires after the input has been held for a specified duration
- **Tap:** Fires if the input is pressed and released within a time window

```
// Example: Hold to interact (prevent accidental activation)
IA_Interact mapping:
    Key: E
    Trigger: Hold (threshold: 0.5 seconds)
    // Player must hold E for half a second before the interaction triggers
```

---

## Binding Abilities to Input

For the combat system, abilities need to activate from input. There are two approaches.

### Approach 1: Direct Input Binding

Map each ability slot to an Input Action, and in the handler, tell the ASC to activate the ability in that slot.

```cpp
void ATQCharacter::OnAbilitySlot1(const FInputActionValue& Value)
{
    if (AbilitySystemComponent)
    {
        // Activate the ability bound to slot 1
        AbilitySystemComponent->TryActivateAbilityByClass(AbilitySlot1Class);
    }
}
```

### Approach 2: GAS Input Binding (AbilityInputID)

GAS has a built-in system for binding abilities to input IDs. When granting an ability, you assign it an input ID. The ASC automatically handles activation on press and cancellation on release.

```cpp
UENUM(BlueprintType)
enum class ETQAbilityInputID : uint8
{
    None,
    Confirm,
    Cancel,
    AbilitySlot1,
    AbilitySlot2,
    AbilitySlot3,
    AbilitySlot4,
    AbilitySlot5
};

// When granting the ability
AbilitySystemComponent->GiveAbility(
    FGameplayAbilitySpec(FireballAbilityClass, 1,
    static_cast<int32>(ETQAbilityInputID::AbilitySlot1), this));
```

For a turn-based game, Approach 1 (direct binding) is often simpler, since abilities activate from UI clicks rather than key presses during the player's turn.

---

## Context-Sensitive Input

Different game states need different input handling. The Enhanced Input System makes this elegant through Mapping Context swapping.

### Exploration Mode
- WASD moves the character
- Mouse controls the camera
- E interacts with objects
- Tab opens inventory
- Cursor is hidden and locked to the centre

### Turn-Based Combat Mode
- Mouse cursor is visible and free-moving
- Clicking on abilities in the UI activates them
- Clicking on the map selects targets
- WASD might scroll the isometric camera
- Number keys select ability slots
- Enter ends the turn

### Dialogue Mode
- Mouse cursor is visible
- Clicking on dialogue options advances the conversation
- Most gameplay input is disabled
- Escape skips or exits dialogue

```cpp
void ACameraDirector::OnModeChanged(ECameraMode OldMode, ECameraMode NewMode)
{
    APlayerController* PC = GetWorld()->GetFirstPlayerController();
    UEnhancedInputLocalPlayerSubsystem* InputSubsystem =
        ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PC->GetLocalPlayer());

    // Remove all current contexts
    InputSubsystem->ClearAllMappings();

    switch (NewMode)
    {
        case ECameraMode::ThirdPerson:
            InputSubsystem->AddMappingContext(IMC_Exploration, 0);
            PC->SetShowMouseCursor(false);
            PC->SetInputMode(FInputModeGameOnly());
            break;

        case ECameraMode::Isometric:
            InputSubsystem->AddMappingContext(IMC_Combat, 0);
            PC->SetShowMouseCursor(true);
            PC->SetInputMode(FInputModeGameAndUI());
            break;

        case ECameraMode::Dialogue:
            InputSubsystem->AddMappingContext(IMC_UI, 0);
            PC->SetShowMouseCursor(true);
            PC->SetInputMode(FInputModeUIOnly());
            break;

        case ECameraMode::Tabletop:
            InputSubsystem->AddMappingContext(IMC_Exploration, 0);
            PC->SetShowMouseCursor(false);
            PC->SetInputMode(FInputModeGameOnly());
            break;

        case ECameraMode::Cinematic:
            // Disable most input during cinematics
            PC->SetShowMouseCursor(false);
            PC->SetInputMode(FInputModeGameOnly());
            break;
    }
}
```

---

## Camera Shake and Effects

Camera shakes add impact to abilities, explosions, and dramatic moments. UE5 uses the `UCameraShakeBase` system.

```cpp
// Define a camera shake class
UCLASS()
class UCameraShake_HeavyImpact : public UMatineeCameraShake
{
    GENERATED_BODY()

public:
    UCameraShake_HeavyImpact()
    {
        OscillationDuration = 0.5f;
        OscillationBlendInTime = 0.05f;
        OscillationBlendOutTime = 0.3f;

        RotOscillation.Pitch.Amplitude = 3.0f;
        RotOscillation.Pitch.Frequency = 15.0f;
        RotOscillation.Yaw.Amplitude = 2.0f;
        RotOscillation.Yaw.Frequency = 12.0f;

        LocOscillation.Z.Amplitude = 5.0f;
        LocOscillation.Z.Frequency = 20.0f;
    }
};

// Trigger the shake from a Gameplay Cue or ability
APlayerController* PC = GetWorld()->GetFirstPlayerController();
PC->PlayerCameraManager->StartCameraShake(UCameraShake_HeavyImpact::StaticClass(), 1.0f);
```

Use camera shakes sparingly. A subtle shake on a critical hit or a big spell impact adds punch. Constant shaking is nauseating.

---

## Summary

| Concept | Role | Our Game Usage |
|---|---|---|
| Spring Arm | Camera positioning with collision | Third-person exploration camera |
| Camera Actors | Fixed-position cameras in the world | Tabletop, cinematic, dialogue cameras |
| Player Camera Manager | Manages active camera and transitions | SetViewTargetWithBlend for mode switching |
| Camera Director | Custom manager for multiple camera modes | Central coordinator for 5 camera modes |
| Enhanced Input Actions | Abstract input definitions | Movement, abilities, interaction |
| Mapping Contexts | Grouped key bindings, swappable at runtime | Exploration vs combat vs UI input |
| Modifiers/Triggers | Input processing (dead zones, holds, taps) | Hold-to-interact, sensitivity settings |
| Camera Shake | Impact feedback | Combat hits, explosions, dramatic moments |

The camera system and input handling are deeply interconnected. When the camera mode changes, the input context changes with it. When the input context changes, the available player actions change. This tight coupling between what the player sees (camera) and what the player can do (input) is what makes each game mode feel distinct and purposeful.
