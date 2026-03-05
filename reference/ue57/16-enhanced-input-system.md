## Enhanced Input System

The Enhanced Input system replaces the legacy input system. It separates input definition (Input Actions) from binding (Input Mapping Contexts) and provides a modular pipeline of Modifiers and Triggers.

**Enabling:**
- Enabled by default in UE 5.7
- Plugin: Enhanced Input (under Input in the Plugins menu)
- Ensure `DefaultPlayerInputClass` and `DefaultInputComponentClass` are set in Project Settings > Input

---

### Input Actions

Input Actions define what inputs mean semantically (e.g., "Move", "Jump", "Look") rather than binding to specific keys.

**Creating an Input Action:**
- Content Browser > Right-click > Input > Input Action

#### Value Types

| Type | Description | Example |
|------|-------------|---------|
| `Bool` (Digital) | True/False | Jump, Fire, Interact |
| `Axis1D` (Float) | Single float value | Throttle, Zoom |
| `Axis2D` (Vector2D) | Two-axis float | Move (Forward/Right), Look (Yaw/Pitch) |
| `Axis3D` (Vector) | Three-axis float | 3D motion controllers |

> **In your games:**
> - **DnD RPG**: `IA_Move` (Axis2D) for WASD/stick character movement, `IA_Jump` (Bool) for jumping, `IA_Look` (Axis2D) for camera rotation, `IA_Interact` (Bool) for opening chests and doors, `IA_Attack` (Bool) for basic attacks, `IA_CastAbility` (Bool, one per hotbar slot) for GAS abilities, `IA_Zoom` (Axis1D) for the tabletop-to-3D zoom transition slider, `IA_SwitchCombatMode` (Bool) for toggling between turn-based and real-time combat, `IA_CyclePartyMember` (Bool) for swapping the active party character, `IA_RollDice` (Bool) for triggering manual dice rolls.
> - **Wizard's Chess**: `IA_SelectPiece` (Bool) for clicking a chess piece, `IA_ConfirmMove` (Bool) for confirming the target square, `IA_CameraOrbit` (Axis2D) for orbiting the camera around the board, `IA_CameraZoom` (Axis1D) for zooming in/out on the board, `IA_UndoMove` (Bool) for taking back the last move.

**Input Action Properties:**
- `Value Type`: The data type this action produces
- `Triggers`: Default triggers applied regardless of mapping context
- `Modifiers`: Default modifiers applied regardless of mapping context
- `Consume Input`: Whether this action consumes the input (prevents other actions from seeing it)
- `Accumulation Behavior`: How multiple mappings combine (take highest absolute value, cumulative, etc.)

---

### Input Mapping Contexts

Input Mapping Contexts bind physical inputs (keys, buttons, axes) to Input Actions. Multiple contexts can be active simultaneously with different priorities.

**Creating a Mapping Context:**
- Content Browser > Right-click > Input > Input Mapping Context

**Structure:**
- Each entry maps an Input Action to one or more key/button bindings
- Each binding can have its own Modifiers and Triggers
- Modifiers and Triggers are evaluated per-binding, then per-action (action-level modifiers/triggers apply after)

**Priority:**
- Higher priority contexts override lower ones
- Add/remove contexts at runtime to change control schemes

> **In your games:**
> - **DnD RPG**: Create separate mapping contexts for each game state. `IMC_Exploration` (WASD movement, camera, interact, inventory toggle), `IMC_TurnBasedCombat` (click-to-select tile, ability hotbar, end turn, cycle party member), `IMC_RealTimeCombat` (WASD dodge movement, attack, block, ability keys), `IMC_Menu` (UI navigation, confirm, back). When the player toggles combat mode mid-fight, swap `IMC_TurnBasedCombat` for `IMC_RealTimeCombat` at runtime. Give `IMC_Menu` the highest priority so the pause menu always captures input. During the tabletop zoom transition, briefly push `IMC_ZoomTransition` (zoom slider only) at priority 10 to lock out all other inputs.
> - **Wizard's Chess**: `IMC_BoardPlay` (piece selection, move confirmation, camera orbit/zoom) and `IMC_SpectateMenu` (move list navigation, timer controls, settings). When a promotion dialog appears, push `IMC_PieceSelection` at higher priority so only the promotion choice buttons respond.

**Adding contexts at runtime:**

Blueprint: `Add Mapping Context` / `Remove Mapping Context` on the Enhanced Input Local Player Subsystem

C++:
```cpp
if (APlayerController* PC = Cast<APlayerController>(GetController()))
{
    if (UEnhancedInputLocalPlayerSubsystem* Subsystem =
        ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PC->GetLocalPlayer()))
    {
        Subsystem->AddMappingContext(MyCombatMappingContext, 1); // Priority 1
        Subsystem->RemoveMappingContext(MyMenuMappingContext);
    }
}
```

---

### Input Modifiers

Modifiers transform raw input values before they reach Triggers. They process in order (output of one feeds into the next).

| Modifier | Description |
|----------|-------------|
| `Dead Zone` | Applies a dead zone to the input; values below the threshold become zero. Types: Axial (per-axis), Radial (magnitude-based). Properties: Lower Threshold, Upper Threshold, Type |
| `Scalar` | Multiplies the input by a vector (X, Y, Z). Use for sensitivity, inversion (multiply by -1), or scaling |
| `Negate` | Inverts the sign of the input on specified axes (X, Y, Z). Shorthand for Scalar with -1 |
| `Swizzle Input Axis Values` | Reorders axes (e.g., swap X and Y). Used when a 1D input needs to map to the Y axis of a 2D action |
| `FOV Scaling` | Scales input based on the current field of view. Ensures consistent look speed regardless of zoom level. Properties: FOV Scale |
| `Response Curve` | Applies a curve to the input value. Types: Exponential, Linear (with user curve override). Properties: Curve Exponent, Curve asset |
| `Smooth` | Smooths input over multiple frames to reduce jitter. Properties: Sample Count, Smooth Speed |
| `To World Space` | Converts 2D input to world-space direction relative to the camera. Used for movement relative to camera orientation |
| `Scalar By Delta Time` | Multiplies input by frame delta time. Used for frame-rate independent input (e.g., continuous rotation) |

> **In your games:**
> - **DnD RPG**: Use `Dead Zone` on gamepad sticks so small thumbstick drift does not move your character during turn-based combat. Apply `Scalar` with a negative Y value on the look axis if the player enables "Invert Y" in settings. Use `Swizzle Input Axis Values` when mapping the gamepad right trigger (1D) to the Y axis of a 2D zoom action. Add `FOV Scaling` to the look input so camera sensitivity stays consistent whether you are zoomed into a miniature or viewing the full tabletop. Use `To World Space` on the movement input so WASD always moves relative to the camera, not the character's facing direction. Use `Response Curve` with a slight exponential curve on the look input for smoother camera control during dungeon exploration.
> - **Wizard's Chess**: Apply `Scalar` on camera orbit input to set a slower default orbit speed (multiply by 0.5). Use `Smooth` on camera zoom to prevent jarring zoom jumps when scrolling the mouse wheel quickly. Apply `Dead Zone` on the gamepad stick for camera orbit so the board camera stays stable at rest.

**Custom Modifier (C++):**
```cpp
UCLASS()
class UInputModifierCustom : public UInputModifier
{
    GENERATED_BODY()
    virtual FInputActionValue ModifyRaw_Implementation(
        const UEnhancedPlayerInput* PlayerInput,
        FInputActionValue CurrentValue,
        float DeltaTime) override;
};
```

---

### Input Triggers

Triggers determine when an Input Action activates based on the (modified) input values.

| Trigger | Description |
|---------|-------------|
| `Down` | Fires every frame while the input is held above the actuation threshold |
| `Pressed` | Fires once when the input first exceeds the actuation threshold |
| `Released` | Fires once when the input drops below the actuation threshold |
| `Hold` | Fires after the input has been held for a specified duration. Properties: Hold Time Threshold, Is One Shot (fire once or continuously), Actuation Threshold |
| `Hold and Release` | Fires when the input is released after being held for the threshold duration. Does not fire if released too early |
| `Tap` | Fires when the input is pressed and released within a time window. Properties: Tap Release Time Threshold |
| `Pulse` | Fires repeatedly at a set interval while the input is held. Properties: Interval, Trigger Limit (0 = unlimited), Trigger on Start |
| `Combo` | Fires when a specific sequence of Input Actions is performed in order within a time window. Properties: Combo Actions (array), Cancel Actions, Time between steps |
| `Chorded Action` | Fires only when another specified Input Action is also active. Properties: Chorded Action (the "modifier key" action). Example: Shift+Click |

> **In your games:**
> - **DnD RPG**: Use `Pressed` for jumping, interacting with objects, and selecting abilities (one press, one action). Use `Hold` with a 0.5s threshold for heavy attacks or charged spells. Use `Hold and Release` for a "power shot" with the Ranger class, where the arrow only fires after holding the bow long enough. Use `Tap` for a quick dodge roll in real-time combat. Use `Pulse` for auto-repeat movement on the grid during turn-based mode (press and hold a direction key to advance one tile every 0.3s). Use `Combo` for a special finishing move sequence: Light Attack, Light Attack, Heavy Attack within 1.5 seconds. Use `Chorded Action` so holding the left trigger (block) while pressing the attack button performs a shield bash instead.
> - **Wizard's Chess**: Use `Pressed` for selecting a piece and confirming a move (single click actions). Use `Down` for continuous camera orbit while the middle mouse button is held. Use `Tap` on a piece to select it, but `Hold` (0.4s) on a piece to show its valid moves as a preview overlay without committing to selection.

**Trigger states:**
- `None`: Input is below actuation threshold
- `Ongoing`: Trigger conditions are being evaluated (e.g., hold timer counting)
- `Triggered`: Conditions met; action fires
- `Completed`: Trigger cycle finished

**Custom Trigger (C++):**
```cpp
UCLASS()
class UInputTriggerCustom : public UInputTrigger
{
    GENERATED_BODY()
    virtual ETriggerState UpdateState_Implementation(
        const UEnhancedPlayerInput* PlayerInput,
        FInputActionValue ModifiedValue,
        float DeltaTime) override;
};
```

---

### Player Mappable Keys

Player Mappable Keys allow end users to rebind input at runtime.

**Setup:**
1. On an Input Action, enable `Is Player Mappable`
2. Set a `Player Mappable Key Settings` struct with:
   - `Name`: Display name for the action
   - `Category`: Grouping category (e.g., "Movement", "Combat")
3. Use `UEnhancedInputUserSettings` to enumerate and modify bindings

> **In your games:**
> - **DnD RPG**: Mark all gameplay actions as player-mappable. Group them into categories: "Movement" (Move, Jump, Dodge), "Combat" (Attack, Block, Cast Ability 1-6, Switch Combat Mode, Roll Dice), "UI" (Open Inventory, Quest Log, Minimap Toggle, Party Management), and "Camera" (Look, Zoom). This lets players rebind everything from the settings menu, which is critical since the game supports gamepad, keyboard, and mouse simultaneously.
> - **Wizard's Chess**: Mark camera and board interaction actions as mappable under "Board Controls" (Select Piece, Confirm Move, Undo) and "Camera" (Orbit, Zoom). Keep the category list small since the game has fewer actions.

**Querying mappable actions:**
```cpp
UEnhancedInputLocalPlayerSubsystem* Subsystem = ...;
TArray<FEnhancedActionKeyMapping> Mappings;
Subsystem->GetAllPlayerMappableActionKeyMappings(Mappings);
```

---

### Input in Blueprints and C++

**Blueprint binding:**
1. In your Character or Pawn Blueprint, add `EnhancedInputAction` events from the Input category
2. Select the Input Action asset for each event
3. Wire up logic from the `Action Value` pin

**C++ binding:**
```cpp
void AMyCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    if (UEnhancedInputComponent* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent))
    {
        // Bind to Triggered event
        EIC->BindAction(MoveAction, ETriggerEvent::Triggered, this, &AMyCharacter::OnMove);
        EIC->BindAction(JumpAction, ETriggerEvent::Started, this, &AMyCharacter::OnJumpStarted);
        EIC->BindAction(JumpAction, ETriggerEvent::Completed, this, &AMyCharacter::OnJumpCompleted);
        EIC->BindAction(LookAction, ETriggerEvent::Triggered, this, &AMyCharacter::OnLook);
    }
}

void AMyCharacter::OnMove(const FInputActionValue& Value)
{
    FVector2D MoveVector = Value.Get<FVector2D>();
    AddMovementInput(GetActorForwardVector(), MoveVector.Y);
    AddMovementInput(GetActorRightVector(), MoveVector.X);
}
```

**Trigger event types for binding:**

| Event | Description |
|-------|-------------|
| `Started` | Fires once when the trigger state first becomes Triggered |
| `Ongoing` | Fires every frame while the trigger is in the Ongoing state |
| `Triggered` | Fires every frame while the trigger is in the Triggered state |
| `Completed` | Fires once when the trigger transitions from Triggered to None |
| `Canceled` | Fires once when the trigger is interrupted before completion |

> **In your games:**
> - **DnD RPG**: Bind `IA_Move` to `Triggered` so the character moves continuously while the stick/key is held. Bind `IA_Jump` to `Started` so a single press begins the jump. Bind `IA_CastAbility` to `Started` to fire the GAS ability once on key press. Bind `IA_Block` to `Started` (raise shield), `Triggered` (maintain block stance each frame for stamina drain), and `Completed` (lower shield). Use `Canceled` on `IA_ChargedSpell` to cancel a spell if the player releases the key before the charge completes.
> - **Wizard's Chess**: Bind `IA_SelectPiece` to `Started` for a single-click selection. Bind `IA_CameraOrbit` to `Triggered` for continuous orbit while held. Bind `IA_CameraZoom` to `Triggered` for smooth scroll zoom input each frame.

---

### Rebinding at Runtime

```cpp
// Get the subsystem
UEnhancedInputLocalPlayerSubsystem* Subsystem =
    ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(PC->GetLocalPlayer());

// Create a new key mapping
FEnhancedActionKeyMapping NewMapping;
NewMapping.Action = MyMoveAction;
NewMapping.Key = EKeys::W;

// Apply player-specific mapping override
Subsystem->AddPlayerMappedKeyInSlot(FName("MoveForward"), NewMapping);

// Save to config
UEnhancedInputUserSettings* Settings = Subsystem->GetUserSettings();
Settings->SaveSettings();

// Request rebuild of the input mapping
Subsystem->RequestRebuildControlMappings();
```

> **In your games:**
> - **DnD RPG**: Provide a full key rebinding screen in the settings menu. Let players remap ability hotbar slots (Ability 1-6), movement keys, interaction, and camera controls. Save bindings to a config file so they persist between sessions. This is especially important because the game supports three input devices (gamepad, keyboard, mouse) and players will have strong preferences.
> - **Wizard's Chess**: Allow rebinding of camera orbit (default: middle mouse), zoom (default: scroll wheel), and undo move (default: Ctrl+Z). Keep the rebinding UI simple since there are fewer actions.

---
