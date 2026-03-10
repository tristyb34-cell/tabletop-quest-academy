# Module 02: Exercises

Seven hands-on exercises that build real interactive objects for Tabletop Quest. Each one teaches a different Blueprint pattern. Complete them in order, as later exercises build on skills from earlier ones.

---

## Exercise 1: Interactive Tavern Door (Swinging)

**What you are building**: A tavern door that swings open when the player approaches and swings closed when they leave. The classic RPG tavern entrance.

**Skills practiced**: Components, Timeline, Lerp (Rotator), Overlap Events

### Steps

1. Create a new Blueprint Actor called `BP_TavernDoor`.
2. Add a **Static Mesh** component for the door frame. Use a doorframe mesh or a hollow rectangular cube. Name it "DoorFrame."
3. Add a second **Static Mesh** as a child of DoorFrame. Name it "DoorPanel." This is the part that swings. Position its origin (pivot) at the hinge edge, not the centre. You do this by offsetting the mesh so that the component's local origin sits at one side.
4. Add a **Box Collision** component. Name it "TriggerZone." Scale it to extend about 250 units in front of and behind the door.
5. Create a **Timeline** called "SwingOpen":
   - Add a Float track called "Alpha."
   - Keyframe at 0.0s: value 0.0
   - Keyframe at 1.0s: value 1.0
   - Set interpolation to "Auto" on both keyframes for a smooth ease.
6. In the Event Graph:
   - **On Begin Overlap** (TriggerZone) connects to the Timeline's **Play from Start** input.
   - **On End Overlap** (TriggerZone) connects to the Timeline's **Reverse from End** input.
   - From the Timeline's **Update** pin, add a **Lerp (Rotator)** node.
     - **A** (closed): (Pitch: 0, Yaw: 0, Roll: 0)
     - **B** (open): (Pitch: 0, Yaw: 90, Roll: 0)
     - **Alpha**: Connect the Timeline's Alpha output.
   - From the Lerp output, add **Set Relative Rotation** targeting the DoorPanel component.
7. Compile, save, and drag the door into your tavern level.
8. Press Play and test: walk toward the door (it swings open), walk away (it swings closed).

### Success Criteria

- The door swings smoothly from closed to fully open (90 degrees).
- The door swings back closed when the player leaves the trigger zone.
- The animation feels smooth, not instant or jerky.
- Walking back and forth repeatedly does not break the door or cause visual glitches.

### Stretch Goals

- Add a **Sound Cue** component and play a wooden door creak sound when the Timeline starts playing. Use the Timeline's Play pin to trigger a **Play Sound at Location** node.
- Make the door swing the correct direction based on which side the player approaches from. Hint: use a **Dot Product** between the player's forward vector and the door's forward vector. If the dot product is negative, the player is on the other side, so swing the opposite way.

---

## Exercise 2: Lootable Dungeon Chest

**What you are building**: A treasure chest that shows "Press E to open" when the player is nearby, opens with a lid animation when interacted with, awards gold, and cannot be looted twice.

**Skills practiced**: Variables, Functions, Input Actions, Boolean state tracking, Timeline animation

### Steps

1. Create `BP_TreasureChest` (Blueprint Actor).
2. Add components:
   - **Static Mesh** "ChestBase" (a box-shaped mesh or cube for the chest body)
   - **Static Mesh** "ChestLid" as a child of ChestBase (a flat slab for the lid). Position it at the top edge of the chest base, with its pivot at the back edge (the hinge).
   - **Box Collision** "TriggerZone" extending about 200 units around the chest.
   - **Text Render** "InteractPrompt" positioned above the chest, text set to "Press E to Open", initially hidden (uncheck Visible in the Details Panel).
3. Create variables:
   - `GoldAmount` (Integer, default 25, **Instance Editable**)
   - `IsOpened` (Boolean, default false)
   - `IsPlayerNearby` (Boolean, default false)
4. Create a function called `OpenChest`:
   - Branch: check `IsOpened`. If true, return (do nothing).
   - Set `IsOpened` to true.
   - Hide the InteractPrompt (Set Visibility to false).
   - Play a Timeline "LidOpen" that rotates ChestLid from (0,0,0) to (Pitch: -110, Yaw: 0, Roll: 0) over 0.8 seconds.
   - After the Timeline finishes (use the Finished pin), print "You found [GoldAmount] gold!" using a **Format Text** node.
5. Wire events:
   - **On Begin Overlap**: Cast Other Actor to your character class. If successful, set `IsPlayerNearby` to true and set InteractPrompt visibility to true.
   - **On End Overlap**: Set `IsPlayerNearby` to false and set InteractPrompt visibility to false.
   - **Input Action** for E key (or IA_Interact if you have Enhanced Input set up): Check `IsPlayerNearby` with a Branch. If true, call `OpenChest`.
6. Compile, save, place three chests in your dungeon with different GoldAmount values (10, 50, 100).
7. Test: approach each chest, verify the prompt appears, press E, watch the lid animate, confirm gold message, walk away and return to verify you cannot loot again.

### Success Criteria

- "Press E to Open" text appears only when the player is within range.
- Pressing E opens the lid with a smooth animation.
- Gold amount is displayed on screen after opening.
- Attempting to open an already-opened chest does nothing.
- Each chest instance awards its own unique GoldAmount.

### Stretch Goals

- Add a **Point Light** component inside the chest that turns on when opened (golden glow illuminating the contents).
- Add a particle effect (sparkles or dust) that plays when the chest opens. Use a **Niagara System** component, set to auto-deactivate, and activate it in the OpenChest function.
- Create an **Event Dispatcher** called `OnChestOpened` that broadcasts when the chest is looted. In a future module, a quest system could listen for this event.

---

## Exercise 3: Pressure Plate Puzzle

**What you are building**: A stone pressure plate on the floor that controls a gate elsewhere in the room. Step on the plate, the gate rises. Step off, the gate lowers. This is a foundational puzzle mechanic for Tabletop Quest's dungeons.

**Skills practiced**: Blueprint Communication (direct reference), Actor references, Timeline, visual feedback

### Steps

1. Create `BP_PressurePlate` (Blueprint Actor).
2. Add components:
   - **Static Mesh** "PlateMesh" (a thin, flat cube, slightly raised from the floor). Give it a stone material.
   - **Box Collision** "TriggerZone" matching the plate area.
   - **Static Mesh** "GateMesh" (a large gate or portcullis shape). Position it where you want the gate to be (it can be far from the plate).
3. Create variables:
   - `IsActivated` (Boolean, default false)
   - `GateOpenHeight` (Float, default 300, Instance Editable): How far the gate rises.
   - `PlateDepressDepth` (Float, default 5): How far the plate sinks when stepped on.
4. Create a Timeline "GateRise":
   - Float track "Alpha": 0 at 0s, 1 at 1.5s. Auto interpolation.
5. Create a second Timeline "PlatePress" (optional but satisfying):
   - Float track "PressAlpha": 0 at 0s, 1 at 0.2s. This makes the plate sink quickly when stepped on.
6. Wire the Event Graph:
   - **On Begin Overlap**:
     - Play GateRise forward.
     - Play PlatePress forward.
     - Set `IsActivated` to true.
     - Print "Pressure plate activated!"
   - **On End Overlap**:
     - Reverse GateRise.
     - Reverse PlatePress.
     - Set `IsActivated` to false.
   - **GateRise Update**: Lerp the GateMesh's Z position from 0 to `GateOpenHeight`. Use **Set Relative Location** with X and Y staying at their default and only Z changing.
   - **PlatePress Update**: Lerp the PlateMesh's Z position from 0 to negative `PlateDepressDepth` (sinks down).
7. Place the pressure plate in a corridor with the gate blocking the path ahead.
8. Test: step on the plate, gate rises, step off, gate lowers.

### Success Criteria

- Stepping on the plate raises the gate smoothly.
- Stepping off lowers the gate smoothly.
- The plate itself sinks visually when pressed.
- The printed message confirms activation.
- Adjusting `GateOpenHeight` per instance works correctly.

### Stretch Goals

- Change the plate's material dynamically when activated. Create a **Material Instance Dynamic** on BeginPlay, store it in a variable, and change its colour parameter (e.g., from grey to green) when the plate is pressed.
- Add a sound effect: a stone grinding sound when the gate moves.
- Make the pressure plate work with any physics object, not just the player. Remove the cast check so that pushing a barrel onto the plate also activates it. This creates a "find the barrel to hold down the plate" puzzle.

---

## Exercise 4: Torch Lighting System

**What you are building**: A wall-mounted torch that the player can ignite or extinguish by pressing E. Lit torches flicker realistically. This creates atmosphere and can later tie into gameplay (dark rooms where you must light torches to see).

**Skills practiced**: Toggle logic, Tick-driven effects, Point Light manipulation, Boolean state

### Steps

1. Create `BP_WallTorch` (Blueprint Actor).
2. Add components:
   - **Static Mesh** "TorchBody" (a torch mesh, or a cylinder with a cone on top as a placeholder).
   - **Point Light** "FlameLight" positioned at the torch tip. Colour: warm orange (R:255, G:150, B:50). Intensity: 5000. Attenuation Radius: 800.
   - **Niagara System** "FlameEffect" (optional, use a fire particle if available. Skip if not.).
   - **Box Collision** "InteractZone" sized for interaction range.
   - **Text Render** "InteractPrompt" above the torch, text "Press E", initially hidden.
3. Create variables:
   - `IsLit` (Boolean, default true, Instance Editable)
   - `BaseIntensity` (Float, default 5000)
   - `FlickerAmount` (Float, default 800): How much the light intensity varies.
   - `FlickerSpeed` (Float, default 5.0): How rapidly the light flickers.
   - `IsPlayerNearby` (Boolean, default false)
4. Create a function `ToggleFlame`:
   - If `IsLit` is true: set FlameLight and FlameEffect visibility to false, set `IsLit` to false, print "Torch extinguished."
   - If `IsLit` is false: set FlameLight and FlameEffect visibility to true, set `IsLit` to true, print "Torch lit."
5. **Event BeginPlay**: If `IsLit` is false on spawn, immediately hide FlameLight and FlameEffect. This handles torches that start unlit.
6. **Event Tick** (for flicker):
   - Branch: only run if `IsLit` is true.
   - Get Game Time in Seconds, multiply by `FlickerSpeed`, feed into a **Sin** node.
   - Multiply the sine result by `FlickerAmount`.
   - Add to `BaseIntensity`.
   - Set FlameLight intensity to the result.
7. **Overlap events**: Show/hide InteractPrompt, track `IsPlayerNearby`.
8. **Input Action** (E key): If `IsPlayerNearby`, call `ToggleFlame`.
9. Place 6-8 torches along your dungeon walls. Set some to start lit and some unlit.
10. Test: walk through the dungeon, see flickering torches, interact to toggle them.

### Success Criteria

- Lit torches flicker convincingly (light intensity varies smoothly).
- Pressing E toggles between lit and unlit states.
- Each torch operates independently.
- Torches set to start unlit in the editor actually start unlit in gameplay.
- The interact prompt appears only when the player is in range.

### Stretch Goals

- Add a **light-up animation**: instead of instantly turning on, use a short Timeline (0.3 seconds) to ramp the intensity from 0 to `BaseIntensity`. Makes it feel like the torch is "catching fire."
- Add a **smoke particle** that plays for 2 seconds after extinguishing (using a Timer and Niagara deactivation).
- Create an "Extinguish All" event that a water trap could trigger, turning off every torch in the room simultaneously using **Get All Actors of Class**.

---

## Exercise 5: NPC That Faces the Player

**What you are building**: A tavern NPC (the bartender or a quest giver) who smoothly rotates to face the player when they approach. When the player leaves, the NPC turns back to their default facing direction. This brings life to your tavern.

**Skills practiced**: Find Look at Rotation, RInterp To, Tick with conditional logic, Rotator math

### Steps

1. Create `BP_TavernNPC` (Blueprint Actor).
2. Add components:
   - **Skeletal Mesh** or **Static Mesh** "NPCMesh" (use the mannequin or any humanoid mesh. A cylinder works as a placeholder.).
   - **Box Collision** "AwarenessZone" with a large radius (500-800 units). This is how far the NPC "notices" the player.
   - **Text Render** "NameTag" floating above the NPC, text set to "Bartender" or "Quest Giver."
3. Create variables:
   - `IsPlayerNearby` (Boolean, default false)
   - `DefaultRotation` (Rotator): Store the NPC's starting rotation. Set this on BeginPlay using **Get Actor Rotation**.
   - `PlayerReference` (Actor object reference): Stored when the player enters the zone.
   - `TurnSpeed` (Float, default 3.0): How fast the NPC rotates to face the player.
4. **On Begin Overlap**:
   - Cast Other Actor to your character class.
   - If successful, set `IsPlayerNearby` to true and store the player reference in `PlayerReference`.
5. **On End Overlap**:
   - Set `IsPlayerNearby` to false.
   - Clear `PlayerReference` (set to None/null).
6. **Event Tick**:
   - **Branch** on `IsPlayerNearby`.
   - **If true**: Use **Find Look at Rotation** with the NPC's location as Start and the player's location as Target. Then use **RInterp To** (Rotator interpolation) to smoothly rotate from the NPC's current rotation toward the look-at rotation. The RInterp To node takes the current rotation, the target rotation, Delta Time, and `TurnSpeed`. Apply the result with **Set Actor Rotation**.
   - **If false**: Use the same **RInterp To** pattern but interpolate back toward `DefaultRotation`. The NPC smoothly turns back to their original facing.
7. Place the NPC behind the tavern bar counter.
8. Test: walk toward the NPC, they turn to face you. Walk around them, they track you. Walk away, they turn back to their original position.

### Success Criteria

- The NPC smoothly rotates to face the player when they enter the awareness zone.
- The NPC tracks the player if they move around (continuous facing, not a one-time snap).
- When the player leaves, the NPC smoothly returns to their default rotation.
- The rotation is smooth, not instant or jerky.
- Other Actors entering the zone (physics objects, etc.) do not trigger the behaviour.

### Stretch Goals

- Lock the NPC's pitch rotation so they only rotate on the Yaw axis (horizontal). You do not want the NPC tilting forward to look at the player's feet. After the Find Look at Rotation, use a **Break Rotator** node, zero out Pitch and Roll, then **Make Rotator** with only the Yaw value.
- Add a greeting message: when the player first enters the zone, print "Welcome to the Sleeping Dragon Inn!" using a Print String. Use a Boolean `HasGreeted` to ensure it only prints once per visit (reset it on End Overlap).
- Add a subtle nod animation: when the player enters, play a Timeline that tilts the NPC's pitch forward by 5 degrees and back over 0.5 seconds.

---

## Exercise 6: Healing Fountain

**What you are building**: A glowing fountain in the tavern or dungeon entrance that heals the player over time while they stand in it. Classic RPG rest point.

**Skills practiced**: Timer by Function Name, Casting to access player variables, Clamping values, Niagara particles, continuous effects

### Steps

1. Create `BP_HealingFountain` (Blueprint Actor).
2. Add components:
   - **Static Mesh** "FountainMesh" (a fountain shape, or a cylinder with a wider base).
   - **Point Light** "HealGlow" positioned inside the fountain. Colour: soft blue-green (R:100, G:220, B:200). Intensity: 3000.
   - **Niagara System** "WaterEffect" (optional water or sparkle particles).
   - **Box Collision** "HealZone" covering the fountain area.
3. Create variables:
   - `HealAmountPerTick` (Float, default 5.0, Instance Editable): Health restored per interval.
   - `HealInterval` (Float, default 0.5, Instance Editable): Seconds between each heal tick.
   - `PlayerRef` (Actor object reference): Stored player reference.
   - `IsHealing` (Boolean, default false)
4. In your **player character Blueprint** (the Third Person Character or your custom character), make sure you have:
   - `Health` (Float, default 100)
   - `MaxHealth` (Float, default 100)
5. Create a function in BP_HealingFountain called `HealTick`:
   - Check if `PlayerRef` is valid (Is Valid node).
   - Cast `PlayerRef` to your player character class.
   - Get the player's `Health`, add `HealAmountPerTick`.
   - Clamp the result between 0 and the player's `MaxHealth` (use a **Clamp Float** node).
   - Set the player's `Health` to the clamped value.
   - Print the current health: "Health: [value]"
   - If Health equals MaxHealth, print "Fully healed!"
6. Wire events:
   - **On Begin Overlap**: Cast Other Actor to your character class. Store in `PlayerRef`. Start a timer using **Set Timer by Function Name** with function name "HealTick" and `HealInterval` as the time. Check the **Looping** checkbox. Store the timer handle in a variable.
   - **On End Overlap**: Clear the timer using **Clear and Invalidate Timer by Handle**. Clear `PlayerRef`. Set `IsHealing` to false. Print "Left the fountain."
7. Place the fountain in a safe area of your dungeon.
8. Before testing, damage your player somehow (the fire pit from Module 01, or manually set Health lower in BeginPlay). Then walk to the fountain and watch health tick upward.

### Success Criteria

- Standing in the fountain steadily increases health.
- Health never exceeds MaxHealth (clamping works).
- Leaving the fountain immediately stops the healing.
- The heal interval is adjustable per instance.
- No errors if a non-player Actor enters the zone.

### Stretch Goals

- Add a visual feedback loop: pulse the HealGlow light intensity in sync with each heal tick. On each HealTick call, play a quick Timeline that bumps the intensity from 3000 to 6000 and back over 0.3 seconds.
- Add floating "heal numbers" by spawning a Text Render at the player's location showing "+5" that fades upward and disappears (advanced: requires spawning an Actor and using a Timeline for the float-up and fade).
- Make the fountain run out. Add a `HealCharges` (Integer, default 20) variable. Decrement it on each HealTick. When it hits 0, stop healing, turn off the glow, and print "The fountain's magic is depleted."

---

## Exercise 7: Blueprint Interface Interaction System

**What you are building**: A universal interaction system using a Blueprint Interface. Instead of each object handling its own input detection, the player character sends an "Interact" message to whatever it is looking at. Any object that implements the Interactable interface responds. This is the system that will power all of Tabletop Quest's interactions going forward.

**Skills practiced**: Blueprint Interfaces, Line Traces, refactoring existing Blueprints to use a shared system

### Steps

1. Create a **Blueprint Interface**: Right-click in Content Browser > Blueprints > Blueprint Interface. Name it `BPI_Interactable`.
2. Open it and add a function called `Interact`.
   - Add an input: `Interactor` (type: Actor). This tells the interactable who is interacting.
   - Add an output: `InteractionSuccessful` (type: Boolean). This tells the player whether the interaction worked.
3. Add a second function to the interface called `GetInteractionPrompt`.
   - Add an output: `PromptText` (type: String). Each interactable returns its own prompt text ("Press E to Open", "Press E to Light", etc.).
4. Open `BP_TreasureChest` (from Exercise 2).
   - Go to Class Settings > Interfaces > Add `BPI_Interactable`.
   - In My Blueprint, you will see `Interact` and `GetInteractionPrompt` under Interfaces.
   - Implement `Interact`: move your chest-opening logic here (check IsOpened, open chest, give gold). Set `InteractionSuccessful` to true if the chest was opened, false if already looted.
   - Implement `GetInteractionPrompt`: if `IsOpened` is false, return "Press E to Open". If true, return "Already looted."
   - Remove the old E key input handling from the chest. The player character will handle input now.
5. Do the same for `BP_WallTorch` (from Exercise 4). Implement `Interact` to call ToggleFlame. `GetInteractionPrompt` returns "Press E to Light" or "Press E to Extinguish" based on `IsLit`.
6. In your **player character Blueprint**, add the interaction sender:
   - On the E key input event (or IA_Interact):
     - Perform a **Line Trace by Channel** from the camera location in the camera's forward direction, length 300 units.
     - If the trace hits something, check: **Does Implement Interface** (BPI_Interactable) on the hit Actor.
     - If yes, call **Interact (Message)** on the hit Actor, passing Self as the Interactor.
     - Read the `InteractionSuccessful` return value and print the result.
   - On **Event Tick** (or a 0.1s Timer for performance):
     - Perform the same Line Trace.
     - If the trace hits an interactable, call **GetInteractionPrompt** and display the result on a UI widget or Print String.
     - If no interactable is in range, clear the prompt display.
7. Test with both the chest and the torch in your dungeon. The player's E key now interacts with any object that implements the interface, with no additional code needed per object.

### Success Criteria

- Pressing E while looking at the chest opens it.
- Pressing E while looking at the torch toggles it.
- The correct prompt text appears for each object.
- Pressing E while looking at nothing (or a non-interactable wall) does nothing, with no errors.
- Adding a new interactable object (e.g., a lever) only requires implementing the interface on that object. No changes to the player character.

### Stretch Goals

- Add an interaction highlight: when the line trace hits an interactable, enable a custom depth stencil or change the mesh's material to a highlighted version. Remove the highlight when the trace moves away.
- Make the interaction distance configurable with a `InteractRange` variable on the player character.
- Create a `BP_DungeonLever` that implements the interface. When interacted with, it toggles a Boolean and broadcasts an Event Dispatcher. A separate door Blueprint listens for the dispatcher and opens/closes. The lever itself does not know about the door; they communicate through the dispatcher.

---

## Reflection

After completing these seven exercises, you have built a complete set of interactive systems for Tabletop Quest:

- **Movement-based triggers** (door, pressure plate): The world reacts to where the player is.
- **Deliberate interaction** (chest, torch): The player chooses when and what to interact with.
- **Environmental hazards and healing** (fountain): The world affects the player's state over time.
- **Living NPCs** (bartender): Characters in the world acknowledge the player's presence.
- **Universal interaction system** (interface): A scalable architecture that grows with the game.

Think about how these pieces combine. A pressure plate that deactivates a fire pit. A torch puzzle where you must light all torches in a room to reveal a hidden chest. An NPC who gives you a quest, which unlocks a new door. A fountain that only works after you solve a puzzle.

These seven building blocks, combined creatively, can produce dozens of unique dungeon rooms and encounters. And they all live in Blueprints, ready to be tested, tweaked, and expanded.

If you get stuck on any exercise, describe your setup to Claude and ask for help. Be specific about which step is not working, what you expected to happen, and what actually happened. Claude can walk you through the node connections step by step.
