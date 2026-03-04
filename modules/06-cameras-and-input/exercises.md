# Module 06: Exercises - Cameras and Input

## Exercise 1: Third-Person Spring Arm Camera

**Objective:** Set up a fully functional third-person camera using a Spring Arm component with proper collision handling, camera lag, and over-the-shoulder framing.

**Steps:**

1. Open (or create) your player character Blueprint or C++ class.

2. Add a **Spring Arm Component** attached to the Root Component. Configure it:
   - Target Arm Length: 300
   - Target Offset: (0, 0, 60) to position the orbit point above the character's centre
   - Socket Offset: (0, 50, 0) to shift the camera to the right for an over-the-shoulder view
   - Use Pawn Control Rotation: true
   - Do Collision Test: true
   - Probe Size: 12
   - Probe Channel: Camera

3. Add a **Camera Component** attached to the Spring Arm's socket.

4. Enable camera lag:
   - Enable Camera Lag: true
   - Camera Lag Speed: 8
   - Enable Camera Rotation Lag: true
   - Camera Rotation Lag Speed: 10

5. Set up the character's rotation:
   - Orient Rotation to Movement: true
   - Use Controller Rotation Yaw: false (on the character, not the spring arm)

6. Test collision by walking your character near walls and into tight corridors. The camera should automatically move closer to prevent clipping through geometry.

7. Experiment with the settings:
   - Increase Target Arm Length to 600 and note the wider view
   - Set Camera Lag Speed to 2 and observe the heavy, cinematic drag
   - Set Camera Lag Speed to 20 and observe the snappy response
   - Toggle Do Collision Test off and walk into a wall to see the clipping problem

**Verification:**
- The camera orbits around the character smoothly with mouse movement
- The character walks in the direction of movement, not the camera direction
- The camera does not clip through walls (collision test working)
- Camera lag creates a smooth, cinematic follow effect
- The over-the-shoulder offset is visible (camera is slightly right and above centre)

**Stretch Goal:** Add a zoom feature. Bind the mouse scroll wheel to an Input Action that adjusts Target Arm Length between 150 (close-up) and 600 (wide view), using `FMath::FInterpTo` for smooth zooming.

---

## Exercise 2: Isometric Camera Setup

**Objective:** Create a fixed-angle isometric camera suitable for tactical combat, with edge scrolling and keyboard panning.

**Steps:**

1. Create a new Actor class called `AIsometricCameraActor` (or a Blueprint).

2. Add a Spring Arm and Camera Component to this actor.

3. Configure for isometric view:
   - Spring Arm rotation: Pitch = -50, Yaw = 45, Roll = 0 (classic isometric angle)
   - Target Arm Length: 1200
   - Use Pawn Control Rotation: false (fixed angle, no player camera rotation)
   - Do Collision Test: false (isometric cameras should not collide with geometry)
   - Enable Camera Lag: true, Camera Lag Speed: 5 (smooth panning)

4. Optional: Switch to orthographic projection for a true isometric feel.
   ```cpp
   CameraComponent->SetProjectionMode(ECameraProjectionMode::Orthographic);
   CameraComponent->SetOrthoWidth(2000.0f);
   ```

5. Implement camera panning. The isometric camera actor should move its position based on input:
   - WASD or arrow keys to pan the camera across the battlefield
   - Edge scrolling: when the mouse cursor reaches the edge of the screen, pan in that direction

   ```cpp
   void AIsometricCameraActor::Tick(float DeltaTime)
   {
       Super::Tick(DeltaTime);

       // Keyboard panning
       FVector PanDirection = FVector::ZeroVector;
       if (bPanForward) PanDirection += GetActorForwardVector();
       if (bPanBackward) PanDirection -= GetActorForwardVector();
       if (bPanRight) PanDirection += GetActorRightVector();
       if (bPanLeft) PanDirection -= GetActorRightVector();

       PanDirection.Z = 0; // Keep camera on the horizontal plane
       SetActorLocation(GetActorLocation() + PanDirection * PanSpeed * DeltaTime);

       // Edge scrolling
       APlayerController* PC = GetWorld()->GetFirstPlayerController();
       float MouseX, MouseY;
       if (PC->GetMousePosition(MouseX, MouseY))
       {
           FVector2D ViewportSize;
           GEngine->GameViewport->GetViewportSize(ViewportSize);

           float EdgeThreshold = 50.0f;
           if (MouseX < EdgeThreshold) PanDirection -= GetActorRightVector();
           if (MouseX > ViewportSize.X - EdgeThreshold) PanDirection += GetActorRightVector();
           if (MouseY < EdgeThreshold) PanDirection += GetActorForwardVector();
           if (MouseY > ViewportSize.Y - EdgeThreshold) PanDirection -= GetActorForwardVector();
       }
   }
   ```

6. Add zoom: bind mouse scroll to adjust either the Ortho Width (orthographic mode) or Target Arm Length (perspective mode).

7. Add bounds: clamp the camera's position so it cannot pan outside the battlefield area.

**Verification:**
- The camera displays a fixed isometric angle (no player rotation)
- WASD pans the camera smoothly across the scene
- Edge scrolling works when the mouse reaches screen edges
- Zoom changes the field of view or ortho width
- The camera cannot pan outside the defined battlefield bounds
- Camera lag makes panning feel smooth rather than jerky

**Stretch Goal:** Add a "centre on character" feature. When the player presses a key (e.g., C), the camera smoothly pans to centre on the active character using `FMath::VInterpTo`.

---

## Exercise 3: Camera Transitions with SetViewTargetWithBlend

**Objective:** Implement smooth transitions between two or more camera viewpoints using `SetViewTargetWithBlend`, and understand the different blend curves.

**Steps:**

1. Place three Camera Actors in your level:
   - **Camera A:** A ground-level shot looking at a building
   - **Camera B:** A high, overhead shot looking down at the same area
   - **Camera C:** A dramatic low-angle shot looking up at a character

2. Create a test Blueprint or C++ class that listens for key presses:
   - Press 1: Blend to Camera A over 2 seconds with EaseInOut
   - Press 2: Blend to Camera B over 1.5 seconds with Linear
   - Press 3: Blend to Camera C over 3 seconds with EaseIn

3. Implement the transitions:
   ```cpp
   void ATransitionTestActor::BlendToCamera(ACameraActor* TargetCamera, float Duration,
       EViewTargetBlendFunction BlendFunc)
   {
       APlayerController* PC = GetWorld()->GetFirstPlayerController();
       if (PC && TargetCamera)
       {
           PC->SetViewTargetWithBlend(TargetCamera, Duration, BlendFunc);
       }
   }
   ```

4. Test each blend function and observe the differences:
   - **Linear:** Constant speed, looks robotic
   - **EaseIn:** Slow start, accelerating. Good for dramatic reveals.
   - **EaseOut:** Fast start, decelerating. Good for settling into a scene.
   - **EaseInOut:** Smooth both ends. The most natural-feeling transition.
   - **Cubic:** Similar to EaseInOut but with different acceleration curve.

5. Try rapid transitions: press 2 while already blending from 1 to see how the system handles interruptions (it cancels the current blend and starts the new one from wherever the camera currently is).

6. Add a "return to player" key that blends back to the character's follow camera:
   ```cpp
   PC->SetViewTargetWithBlend(PlayerCharacter, 1.0f, VTBlend_EaseInOut);
   ```

**Verification:**
- Each camera transition is smooth and uses the correct blend curve
- Different blend functions produce visibly different transition feels
- Interrupting a transition mid-blend starts the new transition from the current camera position (no snapping)
- Returning to the player camera restores normal third-person controls

**Stretch Goal:** Create a "camera tour" that automatically cycles through all three cameras with 5 seconds at each position, using a timer and a queue of camera targets.

---

## Exercise 4: Enhanced Input System Setup

**Objective:** Set up the Enhanced Input System with Input Actions, Mapping Contexts, and proper bindings for both exploration and combat modes.

**Steps:**

1. Create the following Input Action assets in the editor (Content Browser, right-click, Input, Input Action):
   - `IA_Move` (Value Type: Axis2D)
   - `IA_Look` (Value Type: Axis2D)
   - `IA_Jump` (Value Type: Bool)
   - `IA_Interact` (Value Type: Bool)
   - `IA_AbilitySlot1` through `IA_AbilitySlot4` (Value Type: Bool)
   - `IA_EndTurn` (Value Type: Bool)
   - `IA_ToggleCameraMode` (Value Type: Bool)

2. Create two Input Mapping Context assets:
   - `IMC_Exploration`: Map IA_Move to WASD, IA_Look to Mouse XY, IA_Jump to Space, IA_Interact to E, IA_ToggleCameraMode to F5
   - `IMC_Combat`: Map IA_Move to WASD (for camera panning), IA_AbilitySlot1-4 to keys 1-4, IA_EndTurn to Enter, IA_ToggleCameraMode to F5

3. Add modifiers to the mappings:
   - IA_Look: add a Negate modifier on the Y axis for standard (non-inverted) camera control
   - IA_Move: add a Dead Zone modifier (0.1) for gamepad support
   - IA_Interact: add a Hold trigger (0.3 seconds) to prevent accidental interactions

4. In your Player Controller or Character, set up the input component:
   ```cpp
   void ATQCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
   {
       UEnhancedInputComponent* EIC = Cast<UEnhancedInputComponent>(PlayerInputComponent);

       EIC->BindAction(IA_Move, ETriggerEvent::Triggered, this, &ATQCharacter::HandleMove);
       EIC->BindAction(IA_Look, ETriggerEvent::Triggered, this, &ATQCharacter::HandleLook);
       EIC->BindAction(IA_Jump, ETriggerEvent::Started, this, &ATQCharacter::HandleJump);
       EIC->BindAction(IA_Interact, ETriggerEvent::Started, this, &ATQCharacter::HandleInteract);
       EIC->BindAction(IA_AbilitySlot1, ETriggerEvent::Started, this, &ATQCharacter::HandleAbility1);
   }
   ```

5. Implement context switching:
   - Create a function `SwitchToExplorationInput()` that removes IMC_Combat and adds IMC_Exploration
   - Create a function `SwitchToCombatInput()` that removes IMC_Exploration and adds IMC_Combat
   - Test by pressing a key to toggle between modes and verifying that the available inputs change

6. Add the default mapping context in `BeginPlay`:
   ```cpp
   UEnhancedInputLocalPlayerSubsystem* Subsystem =
       ULocalPlayer::GetSubsystem<UEnhancedInputLocalPlayerSubsystem>(
           Cast<APlayerController>(GetController())->GetLocalPlayer());
   Subsystem->AddMappingContext(IMC_Exploration, 0);
   ```

**Verification:**
- WASD moves the character in exploration mode
- Mouse controls the camera in exploration mode
- Pressing E (held for 0.3 seconds) triggers interaction
- Switching to combat mode disables jump/interact, enables ability slots 1-4 and end turn
- Number keys 1-4 trigger ability slot handlers in combat mode
- The dead zone prevents controller stick drift from causing unwanted movement

**Stretch Goal:** Add gamepad support. Create additional mappings in each IMC for gamepad inputs (left stick for move, right stick for look, face buttons for abilities). Both keyboard and gamepad should work simultaneously.

---

## Exercise 5: Camera Director with 3+ Modes

**Objective:** Build the full Camera Director system that manages transitions between third-person, isometric, and tabletop cameras, coordinating with input context switching and the material transition system.

**Steps:**

1. Create the `ACameraDirector` class with:
   - An enum `ECameraMode` with at least: ThirdPerson, Isometric, Tabletop
   - A `CurrentMode` property tracking the active mode
   - References to the necessary camera actors/components
   - A `SetCameraMode(ECameraMode NewMode, float BlendTime)` function

2. Set up the three camera modes:

   **Third-Person:** Uses the character's Spring Arm + Camera. Configure as per Exercise 1.

   **Isometric:** Uses a separate camera actor (from Exercise 2) or reconfigures the spring arm. Fixed angle, panning controls.

   **Tabletop:** Uses a Camera Actor placed above the tabletop scene, pointing down. Fixed position.

3. Implement `SetCameraMode`:
   ```cpp
   void ACameraDirector::SetCameraMode(ECameraMode NewMode, float BlendTime)
   {
       if (NewMode == CurrentMode) return;
       ECameraMode OldMode = CurrentMode;
       CurrentMode = NewMode;

       APlayerController* PC = GetWorld()->GetFirstPlayerController();

       switch (NewMode)
       {
           case ECameraMode::ThirdPerson:
               PC->SetViewTargetWithBlend(PlayerCharacter, BlendTime, VTBlend_EaseInOut);
               SwitchToExplorationInput();
               PC->SetShowMouseCursor(false);
               break;

           case ECameraMode::Isometric:
               PC->SetViewTargetWithBlend(IsometricCameraActor, BlendTime, VTBlend_EaseInOut);
               SwitchToCombatInput();
               PC->SetShowMouseCursor(true);
               break;

           case ECameraMode::Tabletop:
               PC->SetViewTargetWithBlend(TabletopCameraActor, BlendTime, VTBlend_EaseInOut);
               SwitchToExplorationInput();
               PC->SetShowMouseCursor(false);
               break;
       }

       OnCameraModeChanged(OldMode, NewMode);
   }
   ```

4. Connect the camera mode to the material transition system (from Module 05):
   - When transitioning TO Tabletop mode, animate the MPC "TransitionProgress" from 1.0 to 0.0 (characters become miniatures)
   - When transitioning FROM Tabletop mode to ThirdPerson, animate from 0.0 to 1.0 (miniatures become characters)
   - Use a Timeline or lerp in Tick to drive the animation over the same duration as the camera blend

5. Add gameplay event hooks:
   - Bind to a "CombatStarted" delegate: switch to Isometric mode
   - Bind to a "CombatEnded" delegate: switch to ThirdPerson mode
   - Bind to a "ReturnToTable" delegate: switch to Tabletop mode
   - Bind the F5 key to cycle through modes manually (for debugging)

6. Handle the input mode changes in `OnCameraModeChanged`:
   - ThirdPerson: Game-only input, cursor hidden, exploration mapping context
   - Isometric: Game-and-UI input, cursor visible, combat mapping context
   - Tabletop: Game-only input, cursor hidden, exploration mapping context

7. Test the full flow:
   - Start in Tabletop mode (miniatures on table)
   - Press F5 or trigger a game event to switch to ThirdPerson (miniatures transform into characters, camera swoops in)
   - Trigger combat to switch to Isometric (camera pulls up to tactical view, input changes to combat mode)
   - End combat to return to ThirdPerson
   - Trigger return-to-table to go back to Tabletop (characters shrink back to miniatures)

**Verification:**
- All three camera modes are visually distinct and properly configured
- Transitions between modes are smooth with no camera snapping
- Input contexts switch correctly with each mode (exploration keys in ThirdPerson, combat keys in Isometric)
- The mouse cursor appears/disappears appropriately per mode
- The material transition (miniature to character) coordinates with the camera transition timing
- Rapid mode switching (pressing F5 multiple times) does not break the system
- The Camera Director correctly manages its internal state through all transitions

**Stretch Goal:** Add a fourth mode: Dialogue. When triggered, the camera smoothly moves to frame two characters in an over-the-shoulder shot. Calculate the camera position dynamically based on the positions of the speaker and listener. Disable all gameplay input and show the cursor for dialogue option selection.
