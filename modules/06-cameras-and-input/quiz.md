# Module 06: Quiz - Cameras and Input

Test your understanding of camera systems and the Enhanced Input System. Try to answer each question before checking the answer.

---

### Question 1
What is the Spring Arm component, and what problem does its collision system solve?

<details>
<summary>Answer</summary>

The Spring Arm component maintains a fixed distance between a parent actor (typically the character) and a camera, creating a "boom" or "arm" that the camera sits on the end of. Its collision system performs a sphere trace along the arm's length from the parent to the camera position. If the trace hits geometry (a wall, floor, or object), the arm shortens its effective length to keep the camera on the player's side of the obstruction.

This solves the camera-clipping-through-walls problem. Without collision, when a character backs up against a wall, the camera would pass through the wall and show the inside of the geometry or the space behind it. With the Spring Arm's collision, the camera automatically moves closer to the character, staying in valid space. When the character moves away from the wall, the arm smoothly extends back to its full target length.
</details>

---

### Question 2
What is the difference between `bUsePawnControlRotation` on a Spring Arm and `bUseControllerRotationYaw` on a Character? How do they work together for a standard third-person camera?

<details>
<summary>Answer</summary>

`bUsePawnControlRotation` on the Spring Arm determines whether the arm's rotation follows the Player Controller's control rotation (which is driven by mouse movement or right stick input). When true, moving the mouse rotates the Spring Arm (and thus the camera) around the character.

`bUseControllerRotationYaw` on the Character determines whether the character's body rotation matches the controller's yaw rotation. When true, the character always faces the same direction as the camera (standard shooter setup). When false, the character faces the direction of movement instead (standard third-person action game setup).

For a standard third-person camera: set `bUsePawnControlRotation = true` on the Spring Arm (camera follows mouse), and `bUseControllerRotationYaw = false` on the Character with `bOrientRotationToMovement = true` (character faces movement direction). This combination lets the player orbit the camera freely while the character naturally turns toward wherever they walk.
</details>

---

### Question 3
Explain `SetViewTargetWithBlend` and describe what each parameter controls.

<details>
<summary>Answer</summary>

`SetViewTargetWithBlend` is a function on the Player Controller that smoothly transitions the player's camera view from its current viewpoint to a new target actor's camera over a specified duration.

Parameters:
1. **NewViewTarget (AActor*):** The actor to transition the camera to. This actor must have a camera component, or the system uses the actor's location as the viewpoint.
2. **BlendTime (float):** How long the transition takes in seconds. A value of 0 causes an instant cut.
3. **BlendFunction (EViewTargetBlendFunction):** The interpolation curve shape. Options include Linear (constant speed), Cubic (smooth acceleration/deceleration), EaseIn (slow start), EaseOut (slow end), and EaseInOut (smooth both ends).
4. **BlendExp (float):** The exponent for exponential blend functions. Higher values create sharper acceleration curves. Only affects certain blend function types.
5. **bLockOutgoing (bool):** If true, the outgoing (current) camera position is locked in place during the blend rather than continuing to follow its target. Useful for preventing the starting viewpoint from drifting during the transition.
</details>

---

### Question 4
What is an Input Action in the Enhanced Input System, and what are the four value types it can have?

<details>
<summary>Answer</summary>

An Input Action is a data asset that represents a single abstract gameplay input, independent of any specific physical key or button. It defines what type of value the action produces and acts as the bridge between physical input (keys, buttons, sticks) and gameplay code (movement, jumping, abilities).

The four value types are:

1. **Bool:** A simple on/off value. Used for binary actions: jump, interact, open menu, fire weapon.

2. **Axis1D (float):** A single floating-point value, typically ranging from -1 to 1 or 0 to 1. Used for single-axis inputs: throttle, zoom, a trigger pull.

3. **Axis2D (FVector2D):** Two floating-point values representing two axes. Used for directional inputs: character movement (forward/right as X/Y), camera look (yaw/pitch as X/Y).

4. **Axis3D (FVector):** Three floating-point values representing three axes. Rarely used in standard gameplay. Primarily for VR controllers or other 3D input devices where all three spatial axes are meaningful.
</details>

---

### Question 5
What is an Input Mapping Context, and why would you use multiple mapping contexts in a game?

<details>
<summary>Answer</summary>

An Input Mapping Context (IMC) is a data asset that groups a set of physical input bindings (key/button assignments) for specific Input Actions. It maps "press W" to "IA_Move, positive Y axis" or "press Space" to "IA_Jump." Multiple Input Actions can be bound within a single context.

You use multiple mapping contexts because different game states require different input behaviour. An exploration context maps WASD to character movement, Space to jump, and E to interact. A combat context maps WASD to camera panning, number keys to ability slots, and Enter to end turn. A UI/dialogue context maps arrow keys to menu navigation and Enter to confirm.

By adding and removing mapping contexts at runtime, you cleanly switch which inputs are active without modifying any gameplay code. The system handles the transitions: when you remove the exploration context and add the combat context, jump and interact stop working and ability slots start working. Contexts can also have priorities, so if two active contexts bind the same key, the higher-priority context takes precedence.
</details>

---

### Question 6
What is the difference between a Modifier and a Trigger in the Enhanced Input System?

<details>
<summary>Answer</summary>

**Modifiers** process the raw input value before it reaches the trigger evaluation and your gameplay code. They transform the number. Examples: Dead Zone (ignores values below a threshold to prevent controller drift), Negate (inverts the axis for invert-Y options), Scalar (multiplies the value for sensitivity adjustment), Swizzle (remaps which physical axis feeds which logical axis). Modifiers are about "what value does this input produce?"

**Triggers** determine when the action fires its event to gameplay code. They control the timing. Examples: Down (fires every frame while held), Pressed (fires once on the frame the input transitions from released to held), Released (fires once when let go), Hold (fires after the input has been held continuously for a specified duration), Tap (fires if pressed and released within a short time window). Triggers are about "when does this input count as activated?"

The processing order is: raw input, then modifiers (transform the value), then triggers (decide whether to fire). For example, a gamepad stick input might pass through a Dead Zone modifier (ignore small values), then a Scalar modifier (sensitivity), then a Down trigger (fire every frame while above the dead zone). A button input might pass through no modifiers but use a Hold trigger (must hold for 0.5 seconds before activating).
</details>

---

### Question 7
How would you implement context-sensitive input where the same key (E) opens a chest during exploration but interacts with the turn timeline during combat?

<details>
<summary>Answer</summary>

Create two separate Input Actions: `IA_InteractWorld` (for opening chests, talking to NPCs) and `IA_InteractCombatUI` (for interacting with the turn timeline).

In `IMC_Exploration`, bind the E key to `IA_InteractWorld`. In `IMC_Combat`, bind the E key to `IA_InteractCombatUI`.

In your character or controller, bind separate handler functions to each action:
```cpp
EIC->BindAction(IA_InteractWorld, ETriggerEvent::Started, this, &ATQCharacter::OpenChest);
EIC->BindAction(IA_InteractCombatUI, ETriggerEvent::Started, this, &ATQCharacter::InteractWithTimeline);
```

When the game switches from exploration to combat, the mapping context swap handles everything. The exploration context (with IA_InteractWorld) is removed and the combat context (with IA_InteractCombatUI) is added. Pressing E now triggers InteractWithTimeline instead of OpenChest. No if-statements checking game state are needed in the input handlers.

An alternative approach is to use a single IA_Interact action in both contexts, but have the handler function check the current game state to determine the behaviour. The multiple-action approach is cleaner because it keeps the logic separate and makes each handler simpler and more testable.
</details>

---

### Question 8
Describe how you would coordinate a camera transition from Tabletop mode to Third-Person mode, including the material crossfade from miniatures to realistic characters.

<details>
<summary>Answer</summary>

The transition involves three synchronised systems: camera, materials, and input.

1. **Initiate the transition:** The Camera Director receives a request to switch from Tabletop to ThirdPerson (triggered by a gameplay event or player action).

2. **Camera blend:** Call `SetViewTargetWithBlend` from the tabletop Camera Actor to the player character (which has the Spring Arm + Camera). Use EaseInOut blending over 2-3 seconds for a cinematic feel.

3. **Material crossfade:** Simultaneously start animating the "TransitionProgress" parameter in the Material Parameter Collection from 0.0 (miniature) to 1.0 (realistic) over the same 2-3 second duration. Use a Timeline, a Tick-based lerp, or a latent action to drive this animation. All character materials in the scene read this MPC value through Lerp nodes, blending from the painted miniature look to the full PBR look.

4. **Scale animation:** If miniatures are scaled down on the tabletop, animate the character actors' scale from miniature size to full size over the transition duration.

5. **Input context switch:** At the start of the transition, switch from the tabletop input context to the exploration input context. Hide the cursor. Set input mode to game-only.

6. **Post-processing transition:** Blend from the warm, cosy tabletop post-processing profile to the appropriate world post-processing profile (dungeon, outdoor, etc.).

7. **Timing:** All animations (camera, material, scale, post-processing) should use the same duration and ideally the same easing curve so they feel unified. The player should perceive one cohesive transition, not four separate things happening at different speeds.

8. **Completion:** When the blend finishes, update the Camera Director's CurrentMode, enable full third-person controls, and clean up any transition state.
</details>

---

### Question 9
What are the benefits of using the Enhanced Input System over the legacy UE4 input system (direct axis/action mappings in Project Settings)?

<details>
<summary>Answer</summary>

The Enhanced Input System provides several advantages:

1. **Data-driven configuration:** Input Actions and Mapping Contexts are assets, not code-level settings. Designers can create and modify input bindings without touching C++ or Blueprints.

2. **Runtime context switching:** Mapping Contexts can be added and removed at runtime with simple API calls. The legacy system required manual enabling/disabling of individual bindings or using input filtering logic in code.

3. **Modifiers:** Built-in value processing (dead zones, sensitivity scaling, axis negation, smoothing) that would require custom code in the legacy system. These are configurable per-binding in the editor.

4. **Triggers:** Sophisticated activation conditions (hold, tap, press, release, chorded actions) without writing custom timing logic. The legacy system only supported pressed/released natively.

5. **Composited inputs:** Multiple physical inputs can feed a single action. WASD keys can be composited into a single Axis2D movement action, matching how a gamepad stick works. The legacy system required separate axis bindings for each key.

6. **Priority system:** Multiple active contexts can coexist with priority ordering, allowing layered input schemes (base controls plus mode-specific overrides).

7. **Type safety:** Input Actions have explicit value types (Bool, Axis1D, Axis2D, Axis3D), making it clear what data each action provides. The legacy system used loosely typed float values for everything.

8. **Multiplayer support:** Each local player can have independent mapping contexts, which is important for local multiplayer scenarios.
</details>

---

### Question 10
You need to build a camera system for a boss encounter where the camera starts in isometric tactical view, swoops to a cinematic close-up when the boss uses its ultimate ability, then returns to isometric after the ability resolves. How would you architect this?

<details>
<summary>Answer</summary>

1. **Pre-place a cinematic camera path:** In the level editor, create a Spline component that defines the camera's path for the cinematic swooping shot. Place a Camera Actor that will follow this spline. Position the spline so it starts near the isometric camera's position and ends at a dramatic close-up angle on the boss.

2. **Listen for the boss ability event:** When the boss activates its ultimate ability, it sends a Gameplay Event (via GAS) with a tag like `Boss.Ability.Ultimate.Started`. The Camera Director listens for this event.

3. **Phase 1, Swoop to cinematic:** The Camera Director calls `SetViewTargetWithBlend` from the isometric camera to the cinematic camera with EaseIn blending over 1 second. Simultaneously, start animating the cinematic camera along the spline using a Timeline. Disable player input for movement and abilities. Keep the combat UI visible but non-interactive to show the boss's action playing out.

4. **Phase 2, Hold the shot:** At the end of the spline, hold the cinematic angle for the duration of the boss's ability animation (2-3 seconds). Apply camera shake when the ultimate ability impacts. Optionally add slow motion (time dilation) for dramatic effect.

5. **Phase 3, Return to isometric:** When the ability resolves (the boss sends `Boss.Ability.Ultimate.Ended`), call `SetViewTargetWithBlend` from the cinematic camera back to the isometric camera with EaseOut blending over 1.5 seconds. Re-enable player input. Resume the turn order.

6. **Fallback handling:** If the boss dies during its ultimate (from a damage-over-time effect), cancel the cinematic sequence early. Blend back to isometric immediately with a shorter blend time. Make sure the input re-enable happens regardless of how the cinematic ends.

7. **Input management:** During the cinematic, switch to a minimal input context that only allows "Skip Cinematic" (press Escape/Start to cut back to isometric immediately). This respects players who do not want to watch the animation every time.

The architecture keeps the Camera Director as the coordinator: it receives gameplay events, manages the camera transitions, controls input contexts, and handles edge cases like early termination.
</details>
