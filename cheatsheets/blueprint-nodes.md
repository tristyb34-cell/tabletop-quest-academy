# Blueprint Nodes Quick Reference

Dense quick-reference for the most commonly used Blueprint nodes in UE5. For each node: what it does, and when you would reach for it.

---

## Flow Control

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Branch** | If/else. Takes a bool, fires True or False exec pin. | Check if player has enough gold before purchasing. |
| **Sequence** | Fires multiple exec outputs in order (Then 0, Then 1, ...). | Run setup logic step by step on BeginPlay. |
| **ForEachLoop** | Iterates over an array, fires body once per element. | Apply damage to every enemy in a target list. |
| **ForEachLoopWithBreak** | Same as ForEachLoop but can exit early. | Search array for first matching item, then stop. |
| **WhileLoop** | Repeats body while condition is true. | Spawn enemies until a counter reaches a limit. Use carefully; infinite loops freeze the editor. |
| **Gate** | Open/Close/Toggle to allow or block execution flow. | Enable input processing only when a menu is closed. |
| **DoOnce** | Fires once, then blocks. Reset pin re-enables it. | Play a cutscene the first time the player enters a room. |
| **DoN** | Fires N times, then blocks. | Allow the player to use an item 3 times per round. |
| **FlipFlop** | Alternates between A and B outputs each call. | Toggle a door open/closed with the same interact button. |
| **Select** | Picks a value from multiple options based on an index or enum. | Choose a color based on team enum. |
| **Switch on Int** | Routes execution to one of several pins based on an integer. | Different logic per game phase (0=setup, 1=play, 2=end). |
| **Switch on Enum** | Routes execution based on an enum value. | Handle different ability types with separate logic branches. |
| **Switch on String** | Routes execution based on a string match. | React to different item names. |
| **MultiGate** | Fires one of several outputs each call (sequential, random, or loop). | Cycle through dialogue lines. |

---

## Events

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Event BeginPlay** | Fires once when the actor spawns into the world. | Initialize variables, bind delegates, run setup logic. |
| **Event Tick** | Fires every frame. Delta Seconds output gives time since last frame. | Smooth movement, continuous checks. Avoid heavy logic here. |
| **Event ActorBeginOverlap** | Fires when another actor enters this actor's collision. | Trigger zone detection, pickup collection. |
| **Event ActorEndOverlap** | Fires when another actor leaves collision. | Remove buff when player exits an area. |
| **Event OnComponentHit** | Fires on physics collision (requires simulation or Hit Events enabled). | Projectile impact, bouncing objects. |
| **InputAction** | Fires when an Enhanced Input action triggers (Started, Triggered, Completed). | Jump, attack, interact. |
| **Custom Event** | User-defined event. Can have parameters. | Reusable logic entry point, called from other Blueprints via interfaces or references. |
| **Event Dispatcher** | Signature-defined event that other Blueprints can bind to. | Notify UI when health changes without tight coupling. |
| **Construction Script** | Runs in-editor and on spawn. Used for preview/setup, not gameplay. | Arrange mesh components based on exposed variables. |

---

## Variables and Data

### Get / Set

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Get (variable)** | Reads the current value. Drag variable to graph, or right-click. | Read player health to display on HUD. |
| **Set (variable)** | Writes a new value. Has exec pins (impure). | Update score after collecting a coin. |

### Struct Operations

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Make (StructName)** | Constructs a struct from individual values. | Make a transform from location, rotation, scale. |
| **Break (StructName)** | Splits a struct into individual pins. | Break a hit result to get impact point and normal. |

### Array Operations

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Add** | Appends an element to the end of the array. | Add an item to inventory. |
| **Add Unique** | Adds only if not already present. | Track visited rooms without duplicates. |
| **Remove** | Removes first instance of a value. | Drop an item from inventory. |
| **Remove Index** | Removes element at a specific index. | Delete a specific slot in a grid. |
| **Find** | Returns index of element (-1 if not found). | Check which slot an item is in. |
| **Contains** | Returns bool: is element in the array? | Check if player has a key before opening a door. |
| **Length** | Returns number of elements. | Check if inventory is full. |
| **Get (a copy)** | Returns element at index (copy, not reference). | Read the 3rd item in a list. |
| **Get (a ref)** | Returns a reference to element at index. | Modify an item in-place without removing it. |
| **ForEachLoop** | Iterates every element with index. | Apply a status effect to all party members. |
| **IsEmpty** | Returns true if array has zero elements. | Skip processing if no enemies remain. |
| **Sort** | Sorts array (needs a custom predicate for complex types). | Order leaderboard by score. |
| **Shuffle** | Randomizes order in place. | Shuffle a deck of cards. |
| **Filter** | Filters array by class type. | Get only enemy actors from a mixed array. |

### Map and Set

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Map: Add** | Adds key-value pair to a TMap. | Store player name to score mapping. |
| **Map: Find** | Returns value for a key, plus a bool for whether it was found. | Look up item stats by item ID. |
| **Map: Contains** | Checks if a key exists. | Check if a buff is already applied. |
| **Map: Keys / Values** | Returns all keys or values as an array. | Iterate all registered players. |
| **Set: Add** | Adds element to a TSet (unique collection). | Track unique tags on an actor. |

---

## Math

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Add / Subtract / Multiply / Divide** | Basic arithmetic. Works on float, int, vector. | Calculate damage after armor reduction. |
| **Clamp** | Constrains a value between min and max. | Keep health between 0 and MaxHealth. |
| **Lerp (Linear Interpolate)** | Blends between A and B by alpha (0 to 1). | Smooth camera transitions, color blending. |
| **FInterp To** | Framerate-independent smooth interpolation. Takes current, target, delta time, speed. | Smooth follow camera, easing movement. Better than raw Lerp for gameplay. |
| **RandomFloat / RandomInteger** | Random number in range. | Roll dice, random spawn variance. |
| **RandomFloatInRange** | Random float between min and max. | Random delay between 1.0 and 3.0 seconds. |
| **Min / Max** | Returns the smaller or larger of two values. | Ensure damage is at least 1. |
| **Abs** | Absolute value. | Get distance regardless of direction. |
| **Normalize** | Scales a vector to length 1. | Get direction without magnitude. |
| **VectorLength** | Returns the magnitude of a vector. | Check how far something is. |
| **DotProduct** | Measures how aligned two vectors are (-1 to 1). | Check if enemy is facing the player. |
| **CrossProduct** | Returns vector perpendicular to two input vectors. | Calculate surface orientation. |
| **MapRangeUnclamped / Clamped** | Remaps a value from one range to another. | Convert health (0-100) to UI bar width (0-500). |
| **Round / Ceil / Floor / Truncate** | Rounding operations. | Display clean integer values in UI. |
| **Modulo (%)** | Remainder after division. | Check if a number is even/odd, wrap index. |
| **Power** | Raises base to exponent. | Non-linear falloff curves. |
| **Sqrt** | Square root. | Manual distance calculations. |

---

## Transforms and Movement

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **GetActorLocation** | Returns current world position as FVector. | Check where the player is. |
| **SetActorLocation** | Teleports actor to a position. Optional sweep for collision. | Place token on a board tile. |
| **GetActorRotation** | Returns current rotation as FRotator. | Read which way a character faces. |
| **SetActorRotation** | Sets rotation instantly. | Snap character to face a direction. |
| **AddActorWorldOffset** | Moves actor by a delta in world space. Sweep optional. | Push an object forward by 10 units. |
| **AddActorLocalOffset** | Moves actor relative to its own forward/right/up. | Move a car forward in the direction it faces. |
| **AddActorWorldRotation** | Rotates actor by a delta in world space. | Spin a coin pickup. |
| **FindLookAtRotation** | Returns rotation from start location to target location. | Make a turret aim at the player. |
| **RInterp To** | Smoothly interpolates between two rotations. | Smooth turret tracking. |
| **GetActorForwardVector** | Returns the normalized forward direction. | Spawn projectile in front of character. |
| **GetActorTransform** | Returns full transform (location + rotation + scale). | Store and restore actor state. |
| **AttachActorToComponent** | Parents one actor to another's component. | Attach a weapon to a hand socket. |
| **DetachFromActor** | Removes parent attachment. | Drop a held object. |

---

## Components

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **GetComponentByClass** | Returns first component of a given class on the actor. | Get the HealthComponent from any actor. |
| **GetComponentsByClass** | Returns array of all components of a class. | Find all audio sources on an actor. |
| **AddComponent (by class)** | Dynamically adds a component at runtime. | Add a particle system when a buff activates. |
| **SetVisibility** | Shows or hides a component (and optionally children). | Hide a mesh when the player enters stealth. |
| **SetCollisionEnabled** | Toggles collision mode (No Collision, Query Only, Physics Only, All). | Disable collision on a collected pickup. |
| **SetSimulatePhysics** | Enables or disables physics simulation. | Ragdoll an enemy on death. |
| **SetMaterial** | Assigns a material to a mesh component at a slot index. | Swap to a highlighted material on hover. |
| **SetStaticMesh / SetSkeletalMesh** | Changes the mesh asset at runtime. | Swap miniature appearance when upgraded. |
| **SetWorldLocation / SetRelativeLocation** | Positions a component in world or local space. | Move a spotlight to follow the cursor. |

---

## Casting and Type Checking

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Cast To (ClassName)** | Attempts to treat a reference as a specific class. Outputs the typed reference on success, fires Failed pin otherwise. | Cast OtherActor from overlap to BP_Enemy to call TakeDamage. |
| **IsValid** | Checks if a reference is non-null and not pending kill. | Verify a target reference before using it. |
| **IsA** | Returns bool for whether an object is of a class (no cast overhead). | Check type without needing to access class-specific properties. |
| **ClassIsChildOf** | Checks class hierarchy. | Validate a spawned actor is the right subclass. |

**Performance note on Cast To:** Each Cast To loads the target class into memory. Casting to large Blueprints (especially those with heavy assets) in frequently called code can cause memory bloat. Prefer interfaces for cross-Blueprint communication when possible.

---

## Blueprint Communication

### Interfaces

| Pattern | How It Works | When to Use |
|---------|-------------|-------------|
| **Blueprint Interface** | Define functions in an interface asset. Implement on any actor. Call via "Message" node without knowing the concrete class. | When multiple unrelated classes need the same function (e.g., Interactable interface on doors, chests, NPCs). |
| **Does Implement Interface** | Bool check before calling. | Optional: interface messages already fail silently on non-implementers. |

### Event Dispatchers

| Pattern | How It Works | When to Use |
|---------|-------------|-------------|
| **Create Dispatcher** | Declare on the broadcasting actor with a signature. | Define what event will be broadcast (e.g., OnHealthChanged with float param). |
| **Bind** | Another actor subscribes to the dispatcher. | UI widget binds to player's OnHealthChanged. |
| **Call / Broadcast** | Fires the dispatcher, notifying all bound listeners. | Player takes damage, broadcasts new health value. |
| **Unbind / Unbind All** | Removes subscriptions. | Cleanup when a listener is destroyed. |

### Direct Reference

| Pattern | How It Works | When to Use |
|---------|-------------|-------------|
| **Variable reference** | Store a typed reference to another actor. Set via expose-on-spawn, BeginPlay lookup, or Get All Actors of Class. | Simple cases where you know exactly which actor to talk to. Tight coupling, so use sparingly. |
| **Get All Actors Of Class** | Returns array of all actors of a class in the level. | Find the single GameMode or all enemies. Expensive; cache the result, do not call every frame. |
| **Get Player Character / Controller / Camera** | Convenience nodes for the local player. | Access player from any Blueprint quickly. |

---

## Timing and Delays

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Delay** | Pauses execution for N seconds, then continues. Latent node (cannot be in functions, only event graphs). | Wait 2 seconds after death before respawning. |
| **Retriggerable Delay** | Like Delay, but resets the timer if called again before it finishes. | Show a tooltip that disappears 3 seconds after the mouse stops moving. |
| **Set Timer by Event** | Calls a custom event after N seconds. Can loop. Returns a handle for clearing. | Spawn a wave of enemies every 30 seconds. |
| **Set Timer by Function Name** | Same but references a function by string name. | Legacy approach; prefer "by Event" for type safety. |
| **Clear Timer by Handle** | Stops a running timer. | Cancel enemy spawning when the round ends. |
| **Timeline** | Animates a float/vector/color over time using a curve. Has Play, Reverse, Stop pins. | Open a door over 1.5 seconds with an ease curve. Animate material parameters. Essential for juicy game feel. |
| **Set Timer by Event (Looping)** | Check the Looping box to repeat. | Periodic health regeneration tick. |

---

## Debug

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Print String** | Displays text on screen (and/or log). Color, duration configurable. | Quick variable inspection during play. |
| **Draw Debug Line** | Draws a line in 3D space for one frame or a duration. | Visualize a raycast or aim direction. |
| **Draw Debug Sphere** | Draws a wireframe sphere at a location. | Visualize detection radius. |
| **Draw Debug Box** | Draws a wireframe box. | Visualize a trigger volume. |
| **Draw Debug Point** | Draws a point in 3D. | Mark a specific position. |
| **Log (with category)** | UE_LOG equivalent in Blueprint via "Log" node or Print String with "Print to Log" enabled. | Persistent logging for post-session debugging. |

**Tip:** Print String is your best friend during development. Add it liberally, then search for "Print String" nodes to remove them before shipping.

---

## Miscellaneous High-Use Nodes

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **SpawnActor** | Creates a new actor in the world from a class. | Spawn a projectile, enemy, or pickup. |
| **DestroyActor** | Removes an actor from the world. | Clean up a projectile after impact. |
| **LineTraceByChannel** | Raycasts from start to end, returns hit info. | Aim detection, ground check, interact range. |
| **SphereTraceByChannel** | Thicker raycast (sphere sweep). | More forgiving aim detection. |
| **GetGameMode / GetGameState** | Access to the current game mode or state. | Check round timer, change game rules. |
| **GetPlayerController** | Returns the local player controller (index 0 for single player). | Access input, camera, HUD. |
| **CreateWidget** | Instantiates a UMG widget. | Spawn a damage number popup. |
| **AddToViewport / RemoveFromParent** | Shows or hides a widget. | Open/close a menu. |
| **PlaySound2D / PlaySoundAtLocation** | Plays audio. 2D is non-positional; AtLocation is 3D spatialized. | UI click sound (2D), explosion (AtLocation). |
| **SetInputMode** | Switches between Game Only, UI Only, or Game and UI. | Lock input to UI when menu opens. |
| **Apply Damage** | Sends damage through UE's built-in damage framework. Target must implement AnyDamage event. | Generic damage system without custom interfaces. |
