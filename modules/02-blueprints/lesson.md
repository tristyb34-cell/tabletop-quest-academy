# Module 02: Blueprints - Making Things Happen

## From Static to Interactive

In Module 01, you built a room and filled it with objects. It looks like a game, but it does not feel like one. Nothing moves. Nothing reacts. Walk up to a door and it just sits there, lifeless and unresponsive. That changes now.

Blueprints are Unreal Engine's visual scripting system. Instead of writing code in a text editor, you connect nodes on a canvas, like drawing a flowchart that actually runs. Think of it like connecting LEGO blocks of logic. Each block does one thing ("check if player is nearby," "play a sound," "move this door upward"), and you snap them together in a sequence. The engine follows that sequence when the game runs.

This is not a simplified toy. Blueprints are a full scripting system. Entire shipped games have been built with them, including complex RPGs. And for Tabletop Quest, Blueprints will handle all our gameplay logic: doors, chests, combat, inventory, the turn-based system, ability casting, NPC behaviour, and everything else that makes a tabletop RPG come alive in 3D.

If you have ever drawn a flowchart ("if this, then that"), you already understand the core idea. Blueprints just make those flowcharts executable.

### Why Not Just Write Code?

Good question. Unreal Engine also supports C++ (and we will use it later in Module 03). But Blueprints have distinct advantages, especially when you are learning:

- **Visual feedback**: You can see data flowing through wires in real time during play. When a node fires, it lights up. You can literally watch your logic run.
- **Fast iteration**: Change a value, compile in one second, test immediately. No waiting for C++ compilation.
- **Designer-friendly**: Level designers, artists, and hobbyists can build gameplay without touching a text editor.
- **Prototyping speed**: Build a mechanic in 10 minutes, test it, throw it away if it does not work. Perfect for figuring out what "fun" feels like.

The trade-off is performance. Blueprints are roughly 10x slower than equivalent C++ code. For most gameplay logic this does not matter at all. For heavy computation (like pathfinding for 200 enemies simultaneously), you would move that logic to C++. For Tabletop Quest, Blueprints will handle 90% of what we need.

### The Blueprint Editor: Your New Workshop

When you open a Blueprint (double-click any Blueprint asset in the Content Browser), you get a multi-panel editor. Here is what each section does:

- **Components Panel** (top left): Lists all the parts attached to this Blueprint. Meshes, collision shapes, lights, particles, audio sources. Think of this as the Actor's body parts.
- **My Blueprint Panel** (bottom left): Lists your variables, functions, macros, and event dispatchers. This is your toolbox.
- **Event Graph** (centre): The main canvas where you build logic by connecting nodes. This is where the magic happens.
- **Details Panel** (right): Shows properties for whatever you have selected. Click a variable and you will see its type, default value, and settings here.
- **Toolbar** (top): Compile, Save, Play, and Debug buttons.

Spend a minute just clicking around and getting comfortable. Open a Blueprint, resize panels, zoom the graph (scroll wheel), and pan around (right-click drag on the canvas). This editor will be your second home.

---

## The Two Graphs: Event Graph vs Construction Script

Every Blueprint Actor has two separate graphs. Understanding the difference between them is important, because they run at completely different times.

### Event Graph

The Event Graph runs during gameplay. When the player presses a key, when an enemy takes damage, when a timer expires, the Event Graph handles it. This is where 95% of your logic lives.

Think of the Event Graph as a stage play. The curtain rises (the game starts), and the actors follow their scripts in response to what happens on stage.

Everything we build in this module lives in the Event Graph.

### Construction Script

The Construction Script runs in the editor, before the game even starts. It fires every time you move, rotate, or change a property of the Blueprint in the level. Its purpose is to set up the Actor's appearance based on its settings.

Think of the Construction Script as the set designer. Before the play begins, the set designer arranges the furniture, paints the walls, and positions the lights. Once the curtain rises, the set designer steps back.

Here is a practical example for Tabletop Quest. Imagine a `BP_DungeonWall` that has an Integer variable called `WallLength`. In the Construction Script, you could spawn that many wall segments in a row. Change `WallLength` to 5 in the Details Panel, and you instantly see 5 wall pieces appear in the editor. No need to play the game to see the result.

Some common Construction Script uses:

- Spawning a row of fence posts based on a "count" variable
- Randomising which mesh variant an Actor uses (so every barrel looks slightly different)
- Adjusting a light's colour based on an exposed variable (so you can tweak it per instance in the level)
- Setting material parameters based on a "team colour" variable

**A critical rule**: Never put gameplay logic in the Construction Script. It does not have access to the player, other Actors, or game state. It only knows about itself and its own properties.

---

## Your First Blueprint: A Tavern Door That Opens

Let's build something immediately. Tabletop Quest begins in a tavern (the classic RPG starting point). Your first interactive object will be the tavern door.

### Step 1: Create the Blueprint

1. In the Content Browser, right-click in an empty area.
2. Select **Blueprint Class > Actor**.
3. Name it `BP_TavernDoor`.
4. Double-click to open the Blueprint Editor.

### Step 2: Add Components

The Components panel shows what this Actor is made of. Right now it only has a **DefaultSceneRoot** (an invisible anchor point). Let's add the parts.

1. Click **Add Component** and search for **Static Mesh**. Add it. Rename it to "DoorFrame" in the Components panel. Assign a door frame mesh, or use a scaled cube as a placeholder (scale it to look like a rectangular doorframe).

2. Add another **Static Mesh** component. Rename it to "DoorPanel". This is the part that actually moves. Make it a child of DoorFrame by dragging it onto DoorFrame in the hierarchy. Assign a door mesh or use a thin, flat cube. Position it so it fills the doorframe.

3. Add a **Box Collision** component. Rename it to "TriggerZone". Scale it so it extends about 200-300 units in front of and behind the door. This is the invisible zone that detects the player. When someone steps into this box, the door knows they are there.

Your component hierarchy should look like this:

```
DefaultSceneRoot
  DoorFrame (Static Mesh)
    DoorPanel (Static Mesh)
  TriggerZone (Box Collision)
```

**Why is DoorPanel a child of DoorFrame?** Because when you place the Blueprint in the level and move the doorframe, the door panel moves with it. Parent-child relationships in the component hierarchy mean "when the parent moves, the child follows." But you can still move the child independently (like sliding the door open) without affecting the parent.

### Step 3: Set Up the Timeline

Before wiring up events, you need a Timeline. A Timeline is a special node that plays a curve over time, outputting values that change smoothly from one number to another. It is the secret to smooth animations in Blueprints.

1. Click the **Event Graph** tab to switch to your logic canvas.
2. Right-click on the canvas and search for **Add Timeline**. Create one and name it "DoorSlide."
3. Double-click the Timeline node to open it.
4. Click **Add Float Track** and name it "Alpha."
5. Right-click on the track area and add two keyframes:
   - Time: 0.0, Value: 0.0
   - Time: 1.5, Value: 1.0
6. This creates a curve that goes from 0 to 1 over 1.5 seconds. You can right-click each keyframe and set the interpolation to "Auto" for a smooth ease-in/ease-out feel.

The Timeline has several output pins:
- **Update**: Fires every frame while the Timeline is playing. This is where you read the current value and apply it.
- **Finished**: Fires once when the Timeline reaches the end.
- **Alpha**: Your float track's current value (0 to 1, smoothly interpolating).

### Step 4: Wire Up the Logic

Now connect everything:

1. In the Components panel, click on TriggerZone. In the Details panel, scroll to **Events** and click the green **+** next to **On Component Begin Overlap**. A red event node appears on your graph.

2. Draw a wire from the Begin Overlap execution pin to the Timeline's **Play from Start** input. (Use "Play from Start" rather than "Play" to ensure the door always opens from the beginning, even if it was mid-close.)

3. From the Timeline's **Update** pin, add a **Lerp (Vector)** node:
   - **A** (start position): The door's closed position. Get DoorPanel's relative location. For example: X: 0, Y: 0, Z: 0.
   - **B** (end position): The door's open position. For a sliding door, offset the Y or Z. For example: X: 0, Y: 0, Z: 300 (slides upward).
   - **Alpha**: Connect the Timeline's Alpha output.

4. From the Lerp output, add a **Set Relative Location** node targeting the DoorPanel component.

5. Now do the reverse. Click TriggerZone again, find **On Component End Overlap** in the Details panel, and click **+**. Connect this event to the Timeline's **Reverse from End** input.

The complete flow:

```
Player enters TriggerZone > Begin Overlap fires > Timeline plays forward > Lerp smoothly
moves door from closed to open position

Player exits TriggerZone > End Overlap fires > Timeline reverses > Lerp smoothly moves
door back to closed position
```

### Step 5: Test It

1. Click **Compile** in the toolbar (the checkmark icon). Fix any errors.
2. Click **Save**.
3. Drag `BP_TavernDoor` from the Content Browser into your tavern level.
4. Press **Play** (the green Play button in the main editor toolbar, or Alt+P).
5. Walk toward the door. It slides open. Walk away. It closes.

You just built your first interactive game object. This same pattern (trigger zone + Timeline + Lerp) will power gates, drawbridges, elevating platforms, and secret walls throughout Tabletop Quest.

### Making It a Swinging Door Instead

Sliding doors are simpler, but tavern doors should swing open. To convert this to a rotation-based door:

1. Move the DoorPanel's **pivot point** to one edge (the hinge side). You do this by adjusting the mesh's position so that the component's origin sits at the edge where the hinge would be.

2. In the Timeline setup, instead of Lerp (Vector) for position, use **Lerp (Rotator)**:
   - **A**: Rotation 0, 0, 0 (closed)
   - **B**: Rotation 0, 0, 90 (open, swung 90 degrees)

3. Use **Set Relative Rotation** instead of Set Relative Location.

The door now swings open like a real tavern door. Same pattern, different transform.

---

## Understanding Variables: Your Character Sheet in Code

In a tabletop RPG, every character has a character sheet full of stats: health, mana, strength, dexterity, armour class, gold. In Blueprints, these stats are **variables**. They are the foundation of every system you will build.

A variable is a named container that holds a value. Think of it as a labelled jar on a shelf. The label is the name ("Health"), and the contents are the value (100). You can peek inside the jar (Get the value), pour something new in (Set the value), or check the contents before making a decision (Branch based on the value).

### Variable Types

Every variable has a type that determines what kind of data it can hold. Using the wrong type is like trying to pour water into a jar meant for marbles. It does not fit. Here are the types you will use most:

**Integer (int)**: Whole numbers with no decimals. Perfect for things you count in whole units.
- Gold = 50
- Level = 3
- ArrowsRemaining = 12
- DungeonFloor = 2

**Float**: Decimal numbers. Use these for anything that needs precision or smooth transitions.
- Health = 87.5
- MovementSpeed = 600.0
- DamageMultiplier = 1.25
- CooldownTimer = 2.5

**Boolean (bool)**: True or false. The simplest type, but arguably the most powerful. Every yes/no question in your game is a Boolean.
- IsAlive = true
- DoorIsOpen = false
- HasKey = true
- IsPlayerTurn = false
- TorchIsLit = true

**String**: Text. Used for names, messages, and display text.
- PlayerName = "Aldric the Bold"
- WeaponName = "Rusty Shortsword"
- QuestDescription = "Find the lost amulet in the Eastern Crypt"

**Vector**: Three numbers bundled together (X, Y, Z). Used for positions, directions, and scales in 3D space.
- SpawnPoint = (0, 0, 100)
- KnockbackDirection = (1, 0, 0)
- ChestLocation = (500, -200, 0)

**Rotator**: Three angles bundled together (Pitch, Yaw, Roll). Used for orientations.
- FacingDirection = (0, 90, 0)
- CameraAngle = (-30, 0, 0)

**Transform**: A Vector + a Rotator + a Vector (position + rotation + scale). The complete "where is this thing, how is it rotated, and how big is it" package.

### Creating Variables

1. In the Blueprint Editor, look at the **My Blueprint** panel on the left side.
2. Click the **+** button next to **Variables**.
3. Name it something descriptive. Use PascalCase (each word capitalised, no spaces): `PlayerHealth`, `GoldCount`, `IsChestOpen`.
4. In the Details Panel on the right, set the **Variable Type** dropdown to the appropriate type.
5. Click **Compile** (you must compile before you can set default values).
6. After compiling, enter the **Default Value** in the Details Panel.

### Getting and Setting Variables

There are two operations you can do with a variable:

**Get (read the value)**: Drag the variable from My Blueprint onto the Event Graph canvas while holding **Ctrl**. Or right-click on the canvas, search for the variable name, and select "Get [VariableName]." A Get node has no execution pins. It just outputs the current value. You can connect it to other nodes that need that data.

**Set (write a new value)**: Drag the variable while holding **Alt**. Or right-click, search, and select "Set [VariableName]." A Set node has execution pins (white arrows) because changing a value is an action that happens at a specific point in your logic flow.

Here is a concrete example. When a treasure chest gives the player 25 gold:

```
Get GoldCount (reads current value, say 50)
  > Add node: 50 + 25 = 75
    > Set GoldCount (writes 75 as the new value)
```

### Variable Scope and Exposure

By default, a variable is **private** to the Blueprint it lives in. Only that Blueprint's Event Graph can Get or Set it. But you can change this:

- **Instance Editable** (the eye icon next to the variable): Makes the variable editable in the Details Panel when you select an instance of this Blueprint in the level. Incredibly useful. Put three treasure chests in your dungeon and give each one a different `GoldAmount` (25, 50, 100) without creating three separate Blueprints.

- **Expose on Spawn**: Makes the variable settable when another Blueprint spawns this Actor at runtime.

Make `GoldAmount` Instance Editable on your chest Blueprint. Now every chest you place can have a unique reward. One chest gives 10 gold, another gives 100. Same Blueprint, different settings per instance. This is the power of variables combined with Instance Editable.

### Variable Categories

As your Blueprint grows, you will accumulate many variables. Organise them by typing a category name in the **Category** field in the Details Panel. For a player character, you might have:

- **Stats**: Health, MaxHealth, Mana, MaxMana, Strength, Dexterity
- **Inventory**: GoldCount, HasKey, PotionCount
- **State**: IsAlive, IsInCombat, IsPlayerTurn
- **Movement**: WalkSpeed, SprintSpeed, JumpHeight

This keeps your My Blueprint panel tidy, which matters more than you think once you have 30+ variables.

---

## Events: When Something Happens, Do Something

Events are the starting points of your logic. They fire when something specific occurs, and everything connected to them runs in response. Without events, your Blueprint is a collection of nodes sitting silently, waiting for someone to kick things off.

Think of events like alarm bells in a castle. The north bell rings when invaders approach from the north. The fire bell rings when the kitchen is ablaze. Each bell triggers a different response from the guards. Events work the same way: different triggers, different responses.

### Core Events

**Event BeginPlay**: Fires exactly once, the moment the Actor appears in the game world. Use it for setup and initialisation.

Example uses in Tabletop Quest:
- Setting the player's starting health and mana
- Playing an ambient sound loop on a fireplace
- Starting a slow rotation on a floating crystal
- Hiding a secret passage until a quest flag is set
- Registering the Actor with a game manager

Think of BeginPlay as the Actor stepping onto stage and getting into character before the audience (the player) sees them.

**Event Tick**: Fires every single frame. At 60 FPS, that is 60 times per second. At 120 FPS, 120 times per second. This is the most powerful and the most dangerous event.

Use Tick for:
- Smoothly rotating a floating object
- Checking distance between two Actors continuously
- Updating a compass or minimap indicator

Avoid Tick for:
- Anything that does not need to happen every frame
- Heavy calculations (pathfinding, AI decisions)
- Spawning Actors (you would flood your level)

**The golden rule**: If you can use a timer, overlap event, or input event instead of Tick, do it. Every Blueprint with a Tick event adds to the per-frame workload. Ten Blueprints ticking is fine. Five hundred is a problem.

**Tip**: If you need something to happen every 2 seconds (not every frame), use **Set Timer by Function Name** instead of Tick. It fires a function at a regular interval without the per-frame overhead.

**On Component Begin Overlap / End Overlap**: Fire when another Actor enters or exits a collision component. You have already used these for the tavern door.

Begin Overlap gives you an **Other Actor** output pin, telling you exactly what entered the zone. This is critical. You do not want a falling pebble to open the tavern door. You want only the player to open it. Use the Other Actor pin with a Cast node (covered later in this module) to check "is this the player?"

**Input Events**: Fire when the player presses or releases a key or button.

In UE5, input is handled through **Enhanced Input** (the newer system) or the legacy Input system. For Tabletop Quest, we will use Enhanced Input because it is more flexible and is the standard going forward.

The basic setup:
1. Create an **Input Action** asset (right-click in Content Browser > Input > Input Action). Name it `IA_Interact`.
2. Create an **Input Mapping Context** asset. This maps physical keys to Input Actions. Map the E key to `IA_Interact`.
3. In your player character Blueprint, add the mapping context on BeginPlay.
4. Add an **Enhanced Input Action** event node for `IA_Interact`. Now pressing E fires this event.

We will wire this up properly in the exercises, but the concept is: physical key > Input Mapping Context > Input Action > Event in Blueprint.

### Custom Events

Beyond the built-in events, you can create your own. Right-click on the Event Graph and select **Add Custom Event**. Name it something descriptive like "OnChestOpened" or "OnPlayerDied."

Custom events are like creating your own alarm bell. You define when it rings by calling it from elsewhere in your logic. They are useful for:

- Breaking up complex logic into readable sections
- Creating events that other Blueprints can trigger
- Organising your Event Graph so it does not become spaghetti

---

## Functions: Reusable Chunks of Logic

A function is a group of logic nodes bundled together with a name. Instead of rebuilding the same logic five times across your game, you put it in a function and call it whenever you need it.

Think of a function like a recipe card in a cookbook. You write the recipe once ("How to Calculate Damage"), then just say "follow the damage recipe" every time you need it, instead of writing out every ingredient and step again.

### Creating a Function

1. In My Blueprint, click the **+** next to **Functions**.
2. Name it descriptively: `CalculateDamage`, `GiveGold`, `OpenChest`, `CheckIfDead`.
3. A new graph tab opens. This is the function's own canvas, separate from the Event Graph.
4. Build your logic here, starting from the purple **entry node** on the left.
5. Add **Inputs** (data flowing in) and **Outputs** (data flowing out) using the Details Panel while the function is selected.

### Inputs and Outputs

Functions become truly powerful when they accept inputs and return outputs.

Example: A `CalculateDamage` function for Tabletop Quest:

**Inputs:**
- `BaseDamage` (Float): The weapon's raw damage
- `AttackerStrength` (Integer): The attacker's strength stat
- `DefenderArmour` (Integer): The defender's armour value

**Outputs:**
- `FinalDamage` (Float): The calculated result
- `IsCritical` (Boolean): Whether this was a critical hit

Inside the function, you might multiply BaseDamage by a strength modifier, subtract armour, roll for a critical hit, and output the results. Every combat interaction in the game calls this one function. If you later decide to change how armour works, you change it in one place and every combat encounter is updated.

### Functions vs Events vs Macros

This can be confusing at first, so here is a clear breakdown:

**Events**: Starting points. They fire in response to something happening (player pressed E, actor overlapped a zone, game started). You do not "call" events; they fire automatically. (Custom events are the exception; you can call those.)

**Functions**: Reusable logic bundles. You call them explicitly. They run immediately and return when done. They can have return values. They execute on a single frame (no latent actions like Delay inside functions).

**Macros**: Similar to functions, but they get copied/inlined wherever you use them rather than being called. They can contain latent actions (like Delay). Think of macros as templates that get stamped into your graph wherever you place them.

For most cases, use functions. They are cleaner and easier to debug. Use macros only when you need latent nodes inside reusable logic.

### Pure Functions

If a function only calculates and returns a value without changing anything in the world (no Set nodes, no spawning, no playing sounds), check the **Pure** checkbox in its settings. Pure functions appear as compact green nodes without execution pins. They are evaluated whenever their output is needed.

Example: A `GetDamageModifier` function that takes a weapon type and returns a multiplier. It does not change anything; it just calculates. Make it Pure.

---

## Building a Treasure Chest

Let's put variables, events, and functions together into a real game object. You will build a treasure chest for Tabletop Quest's dungeons. It opens when the player interacts with it, gives them gold, and cannot be looted twice.

### Step 1: Create BP_TreasureChest

1. Right-click in Content Browser > **Blueprint Class > Actor**.
2. Name it `BP_TreasureChest`.
3. Open it and add these components:

```
DefaultSceneRoot
  ChestMesh (Static Mesh) - the chest body
  LidMesh (Static Mesh, child of ChestMesh) - the lid, separate so it can rotate open
  TriggerZone (Box Collision) - interaction area
  InteractPrompt (Text Render) - floating "Press E to open" text, initially hidden
  LootGlow (Point Light) - subtle golden glow, initially off
```

If you do not have a chest mesh, use a cube for the body and a thin flat cube for the lid. The important thing is separating the lid so it can animate independently.

### Step 2: Add Variables

Create these variables:

- `GoldAmount` (Integer, default 25): How much gold this chest awards. Mark it **Instance Editable** so you can set different amounts per chest in the level.
- `IsOpened` (Boolean, default false): Whether this chest has been looted.
- `IsPlayerInRange` (Boolean, default false): Whether the player is currently in the trigger zone.
- `LidOpenRotation` (Rotator, default Pitch: -110, Yaw: 0, Roll: 0): How far the lid opens.

### Step 3: Create Functions

**Function: OpenChest**

This handles the full chest-opening sequence:

1. Check if `IsOpened` is false. If true, do nothing (already looted).
2. Set `IsOpened` to true.
3. Play a Timeline that rotates the LidMesh from closed (0, 0, 0) to `LidOpenRotation` over 0.8 seconds.
4. Turn on the LootGlow point light.
5. Print to screen: "You found [GoldAmount] gold!" using an **Append String** or **Format Text** node.
6. Hide the InteractPrompt text.

**Function: ShowPrompt / HidePrompt**

Simple functions that toggle the InteractPrompt's visibility. ShowPrompt sets it visible; HidePrompt hides it.

### Step 4: Wire Up Events

In the Event Graph:

1. **On Begin Overlap** (TriggerZone):
   - Cast the Other Actor to your player character class (to verify it is the player, not a random physics object).
   - If the cast succeeds, set `IsPlayerInRange` to true and call `ShowPrompt`.

2. **On End Overlap** (TriggerZone):
   - Set `IsPlayerInRange` to false and call `HidePrompt`.

3. **Input Action** (IA_Interact / E key):
   - Check if `IsPlayerInRange` is true.
   - If yes, call `OpenChest`.

This design requires the player to walk up to the chest AND press E. Much better than auto-looting on overlap, because it gives the player agency. In a tabletop RPG, you choose to open the chest. You do not accidentally stumble into treasure.

### Step 5: Test and Iterate

Compile, save, drag three chests into your dungeon. Set their GoldAmount to 10, 50, and 100 (remember, it is Instance Editable). Play the game and test:

- Does the prompt appear when you approach?
- Does pressing E open the chest?
- Does the lid animate smoothly?
- Can you loot the same chest twice? (You should not be able to.)
- Does each chest give the correct amount?

This pattern (trigger zone + state check + action + state update) is the foundation of nearly every interactive object in any game. Doors, levers, switches, NPCs, shop interfaces. They all follow this structure.

---

## Building a Torch Lighting System

Dungeons need atmosphere, and nothing says "dungeon" like flickering torches on stone walls. Let's build a torch that the player can light and extinguish, with visual feedback.

### Step 1: Create BP_DungeonTorch

Components:

```
DefaultSceneRoot
  TorchBody (Static Mesh) - the torch bracket/handle
  FlameLight (Point Light) - warm orange light (R:255, G:150, B:50), intensity 5000
  FlameParticle (Niagara System) - fire particle effect (optional, skip if you do not have one)
  TriggerZone (Box Collision) - interaction range
```

### Step 2: Variables

- `IsLit` (Boolean, default true): Current state.
- `LitIntensity` (Float, default 5000): How bright when lit.
- `FlickerSpeed` (Float, default 3.0): How fast the light flickers.

### Step 3: The Toggle Function

Create a function called `ToggleFlame`:

1. If `IsLit` is true:
   - Set FlameLight visibility to false
   - Set FlameParticle visibility to false (if you have one)
   - Set `IsLit` to false
   - Print "Torch extinguished"

2. If `IsLit` is false:
   - Set FlameLight visibility to true
   - Set FlameParticle visibility to true
   - Set `IsLit` to true
   - Print "Torch lit"

### Step 4: Adding Flicker

A static light does not look like fire. Real flames flicker. Use **Event Tick** (this is one of the rare valid uses) or a fast Timer to modulate the light intensity:

1. On Tick, get the current game time using **Get Game Time in Seconds**.
2. Feed it into a **Sin** node (sine wave) to get a value that oscillates between -1 and 1.
3. Multiply by a small range (say 500) and add it to `LitIntensity` (5000).
4. Set FlameLight's intensity to the result.

The light now pulses between 4500 and 5500 intensity, creating a convincing flicker. Multiply the game time by `FlickerSpeed` before the sine function to control how fast it flickers.

**Performance note**: Tick on a torch is fine if you have 10-20 torches. If you plan to have 200 torches in a massive dungeon, use a Timer with a slower interval (0.1 seconds) instead, or drive all torches from a single manager Blueprint.

### Step 5: Place and Test

Scatter torches along your dungeon walls. Some lit, some unlit (change the `IsLit` default per instance). The lit ones flicker. Walk up and toggle them. Your dungeon now has dynamic, interactive lighting.

---

## Blueprint Communication: Making Actors Talk to Each Other

So far, each Blueprint has been an island. The door does not know about the chest. The chest does not know about the player's gold total. But games need their pieces to communicate. The pressure plate needs to tell the door to open. The chest needs to tell the player "you got gold." The torch needs to tell the dungeon's ambient lighting system to update.

This is Blueprint Communication, and it is one of the most important concepts to understand well.

### Method 1: Direct References (Casting)

Casting is the most common way Blueprints talk to each other. It answers the question: "I have a reference to some Actor, but is it specifically the type I need?"

When the treasure chest's overlap event fires, the **Other Actor** pin gives you a generic Actor reference. You know something entered the zone, but you do not know what. It could be the player, a rolling barrel, or an arrow.

**Casting** checks: "Is this Actor actually a ThirdPersonCharacter?" If yes, you get access to all of ThirdPersonCharacter's variables and functions. If no, the cast fails and nothing happens.

The node is called **Cast To [ClassName]**. It has two execution outputs:
- **Success**: The cast worked. The object is the type you expected. A new output pin gives you a typed reference.
- **Fail**: The cast did not work. The object is something else.

Example flow in the treasure chest:

```
On Begin Overlap > Other Actor > Cast To ThirdPersonCharacter
  Success > Get player's Gold variable > Add GoldAmount > Set Gold
  Fail > (do nothing, it was not the player)
```

**When to use Casting**: When you know the specific class you are looking for and you have a reference to test (from an overlap, a hit result, a stored variable, etc.).

**The downside of Casting**: It creates a hard dependency. BP_TreasureChest now "knows about" ThirdPersonCharacter. If you rename or delete that character class, the chest breaks. For small projects this is fine. For larger projects, use interfaces instead.

### Method 2: Blueprint Interfaces

An Interface is a contract. It says "any Blueprint that implements this interface promises to respond to these messages." The sender does not need to know the receiver's class. It just sends the message, and any Actor that has signed the contract will respond.

Think of it like a restaurant intercom. The waiter does not need to know which specific chef is in the kitchen today. They just speak into the intercom ("one steak, medium rare"), and whoever is on kitchen duty that day responds.

**Creating an Interface:**

1. Right-click in Content Browser > **Blueprints > Blueprint Interface**.
2. Name it `BPI_Interactable`.
3. Open it and add a function called `Interact`. Add an input called `Interactor` (type: Actor) so the interactable knows who is interacting with it.

**Implementing the Interface:**

1. Open BP_TreasureChest.
2. In the toolbar, click **Class Settings**.
3. In the Details Panel, find **Interfaces** and click **Add**.
4. Select `BPI_Interactable`.
5. In My Blueprint, you will see the `Interact` function appear under Interfaces. Double-click it to open its graph and build the chest's response to interaction.

**Sending the Message:**

In your player character Blueprint, when the player presses E:
1. Do a line trace (raycast) forward to find what the player is looking at.
2. On the hit result, call **Interact (Message)** on the hit Actor.
3. If that Actor implements BPI_Interactable, it responds. If not, nothing happens. No cast needed. No crash.

Now every interactable object in Tabletop Quest (chests, doors, levers, NPCs, shop counters) implements the same interface. The player's interaction code does not change when you add new interactable types. It just sends the "Interact" message and trusts that the receiver knows what to do.

### Method 3: Event Dispatchers

Event Dispatchers are like radio broadcasts. An Actor "broadcasts" an event, and any Actor that has tuned into that broadcast receives it.

Example: When the player dies, the PlayerCharacter broadcasts "OnPlayerDied." The UI widget listens for this and shows a "Game Over" screen. The enemy AI listens and plays a victory animation. The music system listens and switches to a sad track. Each system responds independently without the player character needing to know about any of them.

**Creating an Event Dispatcher:**

1. In My Blueprint, click **+** next to **Event Dispatchers**.
2. Name it `OnChestOpened`.
3. Optionally add input parameters (like `GoldAmount`).

**Broadcasting:**

In your logic, drag the Event Dispatcher onto the graph and select **Call**. This fires the broadcast.

**Listening:**

In another Blueprint that has a reference to the chest, drag the dispatcher and select **Bind**. This creates a subscription. When the chest broadcasts, the bound event fires.

This is excellent for decoupled systems. The chest does not need to know about the UI, the sound system, or the quest tracker. It just broadcasts "I was opened" and trusts that whoever needs to know is listening.

### Which Communication Method Should You Use?

- **Casting**: When you know the exact class and have a direct reference. Simple, but creates tight coupling.
- **Interfaces**: When multiple different classes need to respond to the same message. Flexible, clean, recommended for interaction systems.
- **Event Dispatchers**: When one Actor needs to notify many others about something that happened. Great for UI updates, quest systems, and achievement triggers.

For Tabletop Quest, you will use all three. Casting for quick prototypes, interfaces for the interaction system, and dispatchers for combat events and quest progression.

---

## Timeline Nodes: Smooth Animations Without Importing Animations

You have already used a Timeline for the door. Let's go deeper, because Timelines are one of the most versatile tools in your Blueprint toolkit.

A Timeline is essentially a mini animation system built right into your Blueprint. It plays curves over time and outputs the interpolated values every frame. You can use these values to drive position, rotation, colour, opacity, or any other property.

### Float Tracks, Vector Tracks, and Colour Tracks

Timelines can have multiple tracks of different types:

- **Float Track**: Outputs a single number. Use it with Lerp to drive anything.
- **Vector Track**: Outputs X, Y, Z values directly. Useful for complex movement paths.
- **Colour Track**: Outputs a linear colour. Great for fading lights or changing material colours.

You can have multiple tracks on a single Timeline. For example, a treasure chest Timeline might have:
- A float track for the lid rotation (0 to 1 over 0.8 seconds)
- A colour track for the loot glow (black to gold over 1 second, starting at 0.5 seconds)
- A float track for a particle effect intensity

### Timeline Properties

- **Length**: Total duration in seconds.
- **Auto Play**: Start playing as soon as the Actor spawns. Good for ambient animations (floating crystals, rotating magic circles).
- **Loop**: Repeat endlessly. Combined with Auto Play, this creates perpetual motion.
- **Use Last Keyframe**: Whether to hold the final value or snap back. Usually you want this checked.

### Practical Example: Floating Loot Crystal

Tabletop Quest will have loot drops that hover and bob in the air, rotating slowly, glowing with a pulsing light. Classic RPG loot visual.

1. Create `BP_LootCrystal`.
2. Add a Static Mesh (a gem or crystal shape), a Point Light, and a Niagara particle effect.
3. Create a Timeline called "FloatBob":
   - Float track "BobHeight": Keyframes at 0s: 0, 0.5s: 30, 1s: 0. Set to **Loop**.
   - Float track "GlowPulse": Keyframes at 0s: 3000, 1s: 6000, 2s: 3000. Set to **Loop**.
4. Set the Timeline to **Auto Play** and **Loop**.
5. On the Update pin:
   - Use BobHeight to offset the mesh's Z position (add it to the base position).
   - Use GlowPulse to set the Point Light intensity.
6. On Tick (or a separate looping Timeline), rotate the mesh slowly: get current rotation, add (0, 0, 1) * DeltaTime * RotationSpeed, set rotation.

Drop this into your dungeon and it hovers, bobs, glows, and rotates. All from Blueprints. No imported animation needed.

---

## Actor Components: Modular Building Blocks

As your game grows, you will notice patterns. Many objects need an "interaction zone." Many objects need a "health" system. Many objects need to "take damage." Instead of rebuilding these systems in every Blueprint, you can create **Actor Components** (reusable modules you attach to any Actor).

Think of Actor Components like gear in a tabletop RPG. A shield is not part of the character; it is an item they equip. Similarly, a HealthComponent is not part of BP_Enemy; it is a module you attach. The same HealthComponent can be attached to enemies, destructible barrels, and the player character.

### Creating an Actor Component

1. Right-click in Content Browser > **Blueprint Class > Actor Component**.
2. Name it `BPC_Health` (BPC prefix for Blueprint Component, a common convention).
3. Open it and add variables:
   - `MaxHealth` (Float, default 100)
   - `CurrentHealth` (Float, default 100)
4. Add functions:
   - `TakeDamage` (Input: DamageAmount Float; decreases CurrentHealth, checks for death)
   - `Heal` (Input: HealAmount Float; increases CurrentHealth, clamped to MaxHealth)
   - `IsDead` (Pure function, returns Boolean: is CurrentHealth <= 0?)
5. Add an Event Dispatcher: `OnHealthChanged` (passes CurrentHealth and MaxHealth)
6. Add an Event Dispatcher: `OnDied`

### Using the Component

In any Blueprint that needs health (player, enemy, destructible barrel):

1. Open the Blueprint.
2. Click **Add Component** and search for `BPC_Health`.
3. Done. That Actor now has health.

To deal damage to something:
1. Get a reference to the target Actor.
2. Get its `BPC_Health` component using **Get Component by Class**.
3. Call `TakeDamage` on the component.

The beauty: your damage-dealing logic does not need to know if the target is a player, an enemy, or a barrel. It just asks "do you have a health component?" and calls TakeDamage. Polymorphism without writing a single line of C++.

For Tabletop Quest, you might create these components:
- `BPC_Health`: Health and damage system
- `BPC_Inventory`: Gold, items, equipment
- `BPC_Stats`: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma
- `BPC_Interactable`: Interaction prompt and trigger zone logic

---

## Blueprint Debugging: When Things Go Wrong

Things will go wrong. A door will not open. A chest will give gold infinitely. A torch will crash the game. Debugging is the skill of finding out why.

### Print String: The Quick and Dirty Method

The simplest debugging tool. Add a **Print String** node anywhere in your logic to display a message on screen when that point in the logic is reached.

Want to know if your overlap event is firing? Print "Overlap fired!" right after the event node. Want to see a variable's value? Connect the variable to the Print String's input (it auto-converts most types to text).

Print Strings are visible only during Play-in-Editor. They do not appear in packaged builds.

### Blueprint Debugger

The more powerful approach. While the game is running:

1. In the Blueprint Editor, click the **Debug Filter** dropdown in the toolbar.
2. Select the specific instance of the Blueprint you want to watch (e.g., "BP_TavernDoor_1" in the level).
3. Press Play.
4. Watch the Event Graph. Active execution wires glow **blue**. You can see data flowing in real time.
5. Hover over any wire to see the current value being passed.

This is like watching your flowchart execute in slow motion. If a wire never glows, that branch of logic is never reached. If a value is not what you expect, you have found your bug.

### Breakpoints

Right-click any node and select **Add Breakpoint** (a red circle appears). When execution reaches that node during Play, the game pauses and the editor zooms to that node. You can then:

- Step through nodes one at a time (F10)
- Continue execution (F5)
- Inspect variable values in the debug panel

This is identical to breakpoint debugging in traditional programming, just visual.

### Common Beginner Bugs

**"My overlap event never fires"**
- Check that the collision component has **Generate Overlap Events** checked (in its Details Panel).
- Check that the other Actor also generates overlap events. The player character's capsule should have this enabled by default.
- Check that the collision preset is correct. "OverlapAll" or "OverlapAllDynamic" is usually what you want.

**"My variable resets every time"**
- You are probably Setting the variable in BeginPlay or somewhere that runs repeatedly. Check that you are not accidentally resetting it.
- Make sure you are modifying the right instance. If you Get a variable from one chest but Set it on another, you will be confused.

**"Cast always fails"**
- The Actor entering the zone is not the type you are casting to. Print the Actor's class name to verify.
- You might be casting to a parent class when you need the child, or vice versa.

**"Timeline does nothing"**
- Make sure you added keyframes to the track. An empty track outputs nothing.
- Make sure the Timeline's Play input is actually connected and firing.
- Check that the Timeline length is correct and the keyframes are within that length.

---

## Organising Your Blueprints: Staying Sane

As Tabletop Quest grows, your project will accumulate dozens, then hundreds of Blueprints. Organisation is not glamorous, but it will save you hours of searching later.

### Folder Structure

In the Content Browser, create a clear folder hierarchy:

```
Content/
  TabletopQuest/
    Blueprints/
      Characters/
        BP_PlayerCharacter
        BP_EnemyBase
      Environment/
        BP_TavernDoor
        BP_DungeonDoor
        BP_PressurePlate
      Items/
        BP_TreasureChest
        BP_LootCrystal
        BP_HealthPotion
      Systems/
        BP_CombatManager
        BP_TurnTracker
      Components/
        BPC_Health
        BPC_Inventory
        BPC_Stats
    Interfaces/
      BPI_Interactable
      BPI_Damageable
```

### Naming Conventions

Use prefixes consistently:
- `BP_` for Blueprint Actors
- `BPC_` for Blueprint Components
- `BPI_` for Blueprint Interfaces
- `IA_` for Input Actions
- `IMC_` for Input Mapping Contexts
- `E_` for Enumerations
- `S_` for Structures

### Comment Boxes

In the Event Graph, select a group of nodes, press **C**, and type a description. This creates a coloured comment box around those nodes. Use different colours for different purposes (green for setup, red for damage, blue for movement).

Your future self, looking at a 200-node Event Graph three months from now, will thank your present self for those comment boxes.

### Reroute Nodes

When wires get tangled and cross over each other, double-click on a wire to create a **Reroute** node. These are invisible pass-throughs that let you route wires around obstacles. They change nothing about the logic; they just make the graph cleaner.

---

## Asking Claude for Blueprint Help

Here is something powerful: you can describe a Blueprint system to Claude and ask for help designing it. Claude cannot directly create Blueprints inside Unreal Engine, but it can:

- **Design node layouts**: "I need a Blueprint that does X. What nodes do I need and how do I connect them?" Claude can give you a step-by-step node-by-node walkthrough.
- **Debug logic**: "My pressure plate is not working. Here is what I have set up..." Claude can spot logical errors in your description.
- **Explain nodes**: "What does the 'Get All Actors of Class' node do?" Claude can explain any Blueprint node in plain language.
- **Suggest architecture**: "I want enemies that patrol, chase the player, and attack. How should I structure the Blueprints?" Claude can recommend component structures, interface designs, and communication patterns.
- **Generate C++ backing**: In later modules, Claude will write C++ functions that expose as Blueprint nodes, giving you custom gameplay nodes tailored to Tabletop Quest.

When asking Claude about Blueprints, be specific. Instead of "help me make combat," try "I need a function that takes an attacker's Strength stat and a defender's Armour stat and returns the final damage as a float. The formula should be BaseDamage * (1 + Strength/20) - Armour. How do I build this in Blueprints?"

The more specific your question, the more precise and useful Claude's answer will be.

---

## Putting It All Together: How Blueprints Build Tabletop Quest

Everything in this module connects directly to the game you are building. Here is how these concepts map to major game systems:

**Dungeon Environment**
- Doors, traps, pressure plates, and secret passages use overlap events, Timelines, and variables.
- Torches and environmental lighting use Tick-driven flicker and toggle functions.
- Destructible objects use the health component.

**Loot and Inventory**
- Treasure chests use interaction (interface), state tracking (IsOpened boolean), and player communication (casting or interface to give gold).
- Loot crystals use Timeline-driven floating and auto-play.
- The inventory itself will be a component with arrays of item references.

**Combat System**
- Turn tracking uses variables (IsPlayerTurn, CurrentTurnIndex) and event dispatchers (OnTurnChanged).
- Abilities are functions (CalculateDamage, ApplyHeal, CastFireball).
- Damage and healing route through the health component.
- The dual combat system (turn-based and real-time) will use a state variable to switch between modes.

**NPC Behaviour**
- Quest givers use the interactable interface.
- Dialogue triggers use overlap events and custom events.
- AI patrol routes use Timeline-driven movement between waypoints.

**Camera System**
- Dynamic camera angles during ability casting will use Timeline-driven camera movement.
- The tabletop zoom effect (pulling back to show miniatures on a table) is a Timeline that interpolates camera position and field of view.

You are not learning abstract concepts. You are building the actual vocabulary and tools your game needs. Every node you place, every variable you create, every function you write is a brick in Tabletop Quest's foundation.

---

## What You Built in This Module

- A tavern door that opens and closes smoothly using overlap events and Timelines.
- A treasure chest with gold, loot-once logic, interaction prompts, and a reusable function.
- A torch lighting system with flicker effects and toggle functionality.
- An understanding of the two graphs (Event Graph and Construction Script) and when to use each.
- Fluency with variables and types: Integer, Float, Boolean, String, Vector, Rotator, Transform.
- Comfort with events (BeginPlay, Tick, Overlap, Input) and knowing which to use when.
- Functions as reusable logic bundles with inputs and outputs.
- Three Blueprint communication methods: Casting, Interfaces, and Event Dispatchers.
- Timeline mastery for smooth, code-free animations.
- Actor Components as modular, reusable systems.
- Debugging strategies: Print String, Blueprint Debugger, and Breakpoints.
- Project organisation: folders, naming conventions, and comment boxes.

You now have the vocabulary to describe any Blueprint: "When this event fires, get this variable, run this function, set this result, broadcast this dispatcher."

Next up: Module 03, where Claude starts writing C++ code that becomes Blueprint nodes. Things like dice rollers, stat calculators, and data tables that plug directly into the visual scripting system you just learned.
