## Blueprint System

The Blueprint Visual Scripting system is Unreal Engine's node-based programming environment that allows designers and artists to create gameplay logic without writing C++ code. Blueprints compile to bytecode and can be nativized to C++ for shipping builds.

### Blueprint Editor Panels

#### Components Panel
- Located on the left side of the Blueprint Editor when editing Actor-based Blueprints
- Add components via the **Add** button at the top of the panel
- Drag components onto other components to create parent-child attachment hierarchies
- Each component exposes its own set of properties in the Details panel when selected
- Common components: Static Mesh, Skeletal Mesh, Camera, Point Light, Spot Light, Audio, Particle System (Niagara), Collision (Box, Sphere, Capsule), Arrow, Billboard, Widget, Spring Arm, Scene, Spline, Text Render
- The root component (DefaultSceneRoot or a chosen replacement) defines the Actor's transform
- **Right-click** a component to rename, delete, copy, or paste
- Components can be marked as **Instance Editable** to expose them per-instance in the Level Editor

**In your games:**

| Game | Component | Purpose |
|------|-----------|---------|
| DnD RPG | Skeletal Mesh | The character body for each of the 6 classes, plus a second Skeletal Mesh for the miniature-scale version used on the tabletop |
| DnD RPG | Capsule Collision | Root collision for each character and enemy, sized differently per race (Halflings smaller, Orcs larger) |
| DnD RPG | Niagara (Particle System) | Attached spell VFX: Mage's persistent arcane aura, Cleric's divine glow, Bard's floating music notes |
| DnD RPG | Audio | Footstep audio component on characters, ambient fire crackle on the tabletop candles |
| DnD RPG | Spring Arm + Camera | The five camera modes (Tabletop, Exploration, Turn-Based, Real-Time, Cinematic) on the CameraDirector actor |
| DnD RPG | Widget | Floating HP bar above enemies, damage number popups attached to characters |
| DnD RPG | Scene Capture 2D | The secondary camera that renders the world top-down for the tabletop map texture (updates at 10fps) |
| Wizard's Chess | Static Mesh | The chess board surface, decorative frame, and environment props |
| Wizard's Chess | Skeletal Mesh | Animated chess pieces (so they can play idle, move, and shatter animations) |
| Wizard's Chess | Point Light | Per-piece magical glow that intensifies during the piece's turn to move |
| Wizard's Chess | Niagara | Magic trail emitter attached to each piece, activated during movement |

#### My Blueprint Panel
- Located on the left side of the Blueprint Editor
- Organizes all user-defined elements within the Blueprint:
  - **Graphs**: Event Graph, Construction Script, additional custom graphs
  - **Functions**: User-defined functions with input/output pins
  - **Macros**: Reusable node graphs that inline at compile time (no latent actions)
  - **Variables**: Bool, Int, Float, String, Name, Text, Vector, Rotator, Transform, Object references, Enums, Structs, Arrays, Maps, Sets
  - **Event Dispatchers**: Delegate-based multicast events
  - **Local Variables**: Scoped to a single function (created inside function graphs)
- Drag any item from My Blueprint into the Event Graph to place a getter or setter
- **Categories**: Right-click variables or functions to assign categories for organization
- **Search bar** at the top filters all entries by name

**In your games:**

- **DnD RPG**: Your BP_Warrior Blueprint's My Blueprint panel will contain: Variables like `CurrentHP`, `MaxHP`, `Mana`, `MightStat`, `FinesseStat`, `MindStat`, `PresenceStat`, `EquippedWeapon`, `IsInMiniatureForm`. Functions like `CalculateDamage()`, `RollDice(NumDice, DiceSides)`, `ApplyCondition(ConditionType)`. Event Dispatchers like `OnHealthChanged` (so the UI HP bar updates), `OnAbilityUsed` (so the initiative bar tracks action economy), `OnDeath` (so the combat manager knows to remove the character from turn order). Organise these with Categories: "Stats", "Combat", "Equipment", "Conditions".
- **Wizard's Chess**: BP_ChessPiece will have Variables like `PieceType` (enum: King, Queen, etc.), `PieceColour`, `BoardPosition`, `IsAlive`. Functions like `MoveTo(TargetSquare)`, `CanMoveTo(TargetSquare)`, `Capture()`. Event Dispatchers like `OnCaptured` (triggers the destruction sequence), `OnMoveComplete` (signals the game manager to advance the turn).

### Construction Script
- **Purpose**: Runs in the Editor when the Actor is placed, moved, or any property changes
- **Location**: Accessible as a separate graph tab in the Blueprint Editor
- **Path**: Open Blueprint > select the **Construction Script** tab
- Use cases: procedural placement, dynamic mesh generation, material parameter setup, spline-based construction, component visibility toggling based on exposed parameters
- **Caution**: Avoid heavy computation or spawning Actors (can cause Editor lag). Do not use latent actions (Delay, timers) in the Construction Script.
- Runs every time a property marked **Expose on Spawn** or **Instance Editable** changes in the Level Editor
- The Construction Script does NOT run during gameplay; it only executes in the Editor and at Actor initialization

**In your games:**

- **DnD RPG**: Use the Construction Script on your hex grid tile Blueprint to procedurally set the tile's material based on an exposed "TerrainType" enum (grass, stone, water, lava). When you place a tile in the editor and change its type, the material updates instantly. Also use it on the tabletop miniature Blueprint: expose a "CharacterClass" enum, and the Construction Script swaps the miniature mesh and paint colour automatically, so you can place 20 miniatures on the table and configure each one from the Details panel.
- **Wizard's Chess**: Use the Construction Script on your board square Blueprint to alternate black/white materials based on the square's row and column (exposed as Instance Editable integers). Place 64 squares and they automatically colour themselves correctly. You could also use it to toggle piece visibility based on a "StartingPiece" dropdown.

### Event Graph
- The primary graph where gameplay logic lives
- Supports multiple Event Graph tabs (right-click in the graph background > **Add Event Graph**)
- Execution begins from event nodes (red title bar) and flows along white execution wires
- Multiple event entry points can exist in the same graph
- Supports latent actions: Delay, Timeline, Move Component To, AI Move To

**In your games:**

- **DnD RPG**: The Event Graph is where most of your gameplay lives. BP_CombatManager's Event Graph handles the turn-based loop: on BeginPlay, roll initiative for all combatants, sort the turn order, then use a Delay between turns for pacing. Separate Event Graph tabs help organise: one for "Turn Logic", one for "Mode Switching" (TAB key to swap between turn-based and real-time), one for "Zoom Transition" (the 2.5-second tabletop descent with Timeline nodes driving the camera blend, material crossfade alpha, and audio fade).
- **Wizard's Chess**: The BP_GameManager Event Graph orchestrates the match: on each turn, wait for player input (click piece, click destination), validate the move, trigger the piece's movement Timeline, check for captures, check for check/checkmate. Use a Delay after each move to let the magic trail animation finish before the next turn begins.

### Class Defaults
- **Path**: Blueprint Editor toolbar > **Class Defaults** button
- Shows all properties inherited from the parent class
- Configure default values for variables, replication settings, Actor lifecycle settings
- Set **Replicates**, **Net Load on Client**, **Net Dormancy**
- Configure **Tags** (Actor Tags, Component Tags)
- Set **Input** settings (Auto Receive Input, Input Priority)

**In your games:**

- **DnD RPG**: In Class Defaults, set the default values for your character stats (Might: 5, Finesse: 5, Mind: 5, Presence: 5 as base). Configure Tags like "PlayerCharacter" or "Enemy_Tier1" so you can use Get All Actors With Tag for targeting. Set Replicates to true if you are building with multiplayer-ready architecture from Phase 0 (server-authoritative pattern). Set Auto Receive Input on the player-controlled character Blueprint.
- **Wizard's Chess**: Configure default piece properties (PieceType, PieceColour) and set Tags like "WhitePiece" and "BlackPiece" for easy group queries. The board Actor should have Auto Receive Input to handle click detection on squares.

---

### Node Categories

#### Flow Control
| Node | Description |
|------|-------------|
| **Branch** | If/else logic based on a boolean condition |
| **Sequence** | Executes multiple output pins in order (Then 0, Then 1, ...) |
| **Switch on Int** | Routes execution based on integer value |
| **Switch on String** | Routes execution based on string value |
| **Switch on Enum** | Routes execution based on enum value |
| **Switch on Name** | Routes execution based on FName value |
| **Do Once** | Executes only the first time triggered; reset pin available |
| **Do Once Multi Input** | Do Once with multiple input pins |
| **Do N** | Executes up to N times |
| **FlipFlop** | Alternates between A and B outputs each trigger |
| **For Loop** | Iterates from First Index to Last Index |
| **For Loop with Break** | For Loop with an additional Break input |
| **For Each Loop** | Iterates over an array |
| **For Each Loop with Break** | For Each Loop with a Break input |
| **While Loop** | Repeats while condition is true |
| **Gate** | Open/Close/Toggle to allow or block execution flow |
| **MultiGate** | Distributes execution across multiple outputs (sequential, random, or loop) |
| **Select** | Returns one of several values based on an index (not execution, data only) |
| **IsValid** (macro) | Checks if an object reference is valid; has "Is Valid" and "Is Not Valid" exec pins |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Branch | Check `IsPlayerTurn` to decide whether to show the action menu or run enemy AI |
| DnD RPG | Switch on Enum | Route ability execution based on `EAbilityType` (MeleeAttack, RangedAttack, Spell, Buff, Heal) |
| DnD RPG | For Each Loop | Iterate over all party members to apply a Bard's "Battle Cry" buff to each one |
| DnD RPG | FlipFlop | Toggle between turn-based and real-time combat mode on TAB press |
| DnD RPG | Sequence | On turn start: Then 0 = refresh action economy, Then 1 = update UI, Then 2 = check conditions (Poisoned, Stunned) |
| DnD RPG | Gate | Open the gate when it is a character's turn; close it when their actions are spent, blocking further input |
| DnD RPG | Do Once | The Orc's "Relentless" passive (survive a killing blow with 1 HP, once per combat) |
| DnD RPG | MultiGate | Random encounter selection: distribute to goblin ambush, orc patrol, or treasure chest |
| Wizard's Chess | Switch on Enum | Route movement validation based on `EPieceType` (King moves 1 square, Queen moves any distance, Knight jumps in L-shape) |
| Wizard's Chess | For Loop | Check all 8 directions from a piece's position to calculate valid moves for Rooks, Bishops, and Queens |
| Wizard's Chess | IsValid | Verify a target square reference exists before attempting a move (squares at board edges may return null) |
| Wizard's Chess | Do Once | Castling can only happen once per side per game |

#### Math
| Node | Description |
|------|-------------|
| **Add (+)** | Addition for int, float, vector, rotator |
| **Subtract (-)** | Subtraction |
| **Multiply (*)** | Multiplication |
| **Divide (/)** | Division |
| **Modulo (%)** | Remainder after division |
| **Power** | Raises a value to an exponent |
| **Sqrt** | Square root |
| **Abs** | Absolute value |
| **Clamp** | Constrains a value between min and max |
| **Min / Max** | Returns the smaller or larger of two values |
| **Lerp** | Linear interpolation between A and B by Alpha |
| **Map Range Clamped / Unclamped** | Remaps a value from one range to another |
| **Normalize to Range** | Maps a value to 0..1 within a given range |
| **Round / Ceil / Floor / Truncate** | Rounding operations |
| **Sin / Cos / Tan / Asin / Acos / Atan / Atan2** | Trigonometric functions |
| **Degrees to Radians / Radians to Degrees** | Angle conversion |
| **Dot Product** | Dot product of two vectors |
| **Cross Product** | Cross product of two vectors |
| **Normalize** | Normalizes a vector to unit length |
| **Vector Length** | Returns magnitude of a vector |
| **Distance** | Distance between two points |
| **Random Integer / Random Float / Random Unit Vector** | Random value generation |
| **Random Integer in Range / Random Float in Range** | Random within bounds |
| **Seed-based Random Stream** | Deterministic random via FRandomStream |
| **Nearly Equal** | Floating point comparison with tolerance |
| **FInterp To / FInterp Ease In Out** | Smooth interpolation helpers |
| **Rotate Vector** | Rotates a vector by a rotator |
| **Inverse Transform Location / Direction** | World-to-local and local-to-world |
| **Make Rotator / Break Rotator** | Construct/deconstruct rotator from roll, pitch, yaw |
| **Make Vector / Break Vector** | Construct/deconstruct vector from X, Y, Z |
| **Make Transform / Break Transform** | Construct/deconstruct location + rotation + scale |
| **Compose Rotators** | Combines two rotations |
| **Delta (Rotator)** | Shortest rotation difference |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Random Integer in Range | Rolling dice: `RandomIntegerInRange(1, 20)` for a d20 attack roll, `RandomIntegerInRange(1, 6)` for a d6 damage roll |
| DnD RPG | Clamp | Clamping HP between 0 and MaxHP after damage or healing |
| DnD RPG | Lerp | Smooth camera blend during the 2.5-second tabletop zoom transition, interpolating position and rotation |
| DnD RPG | Distance | Measuring hex distance between a Ranger and their target to determine if they are in bow range |
| DnD RPG | Map Range Clamped | Converting the TransitionAlpha (0..1) to terrain displacement height (0..full heightmap) during zoom |
| DnD RPG | Find Look At Rotation | Making enemy AI face the player character before attacking |
| DnD RPG | Seed-based Random Stream | Deterministic loot drops: same seed produces the same loot table results, useful for save/load consistency |
| DnD RPG | Dot Product | Checking if the Rogue is behind an enemy for Backstab bonus damage (dot product of enemy forward vector and direction to Rogue) |
| Wizard's Chess | Distance | Calculating if a move is valid based on piece movement rules (Knights move sqrt(5) distance) |
| Wizard's Chess | Lerp / FInterp To | Smoothly sliding a piece from its current square to the target square during movement animation |
| Wizard's Chess | Make Vector | Constructing target world positions from board grid coordinates (column * squareSize, row * squareSize, 0) |
| Wizard's Chess | Rotate Vector | Rotating the board view when swapping perspective between white and black player |

#### String
| Node | Description |
|------|-------------|
| **Append** | Concatenates two or more strings |
| **Len** | Returns string length |
| **Contains** | Checks if substring exists |
| **Find** | Returns index of first occurrence |
| **Left / Right / Mid** | Substring extraction |
| **Replace** | Replaces occurrences of a substring |
| **To Upper / To Lower** | Case conversion |
| **Trim / Trim Trailing** | Whitespace removal |
| **Parse Into Array** | Splits string by delimiter into array |
| **Join String Array** | Joins array elements with delimiter |
| **Starts With / Ends With** | Prefix/suffix check |
| **Is Empty** | Returns true if string has zero length |
| **Equals / Equal (Case Sensitive)** | String comparison |
| **Build String** (various types) | Converts int, float, vector, etc. to string |
| **Conv String to Int / Float / Name / Text** | Type conversion |
| **Format Text** | String formatting with named parameters |
| **Get Substring** | Extracts characters from a position |
| **Reverse** | Reverses the string |
| **Match** | Wildcard pattern matching |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Format Text | Building combat log entries: "Aldric hits Goblin Archer for {Damage} damage with {WeaponName}" |
| DnD RPG | Append | Concatenating the AI DM's narrative text with condition notifications: flavor text + " [Poisoned for 3 turns]" |
| DnD RPG | Conv String to Int | Parsing the AI DM's JSON response fields (enemy count, difficulty rating) from Ollama's HTTP response |
| DnD RPG | Build String | Converting dice roll results to display text: "d20 + 3 = 17 vs AC 15: HIT" |
| Wizard's Chess | Format Text | Move notation display: "{PieceName} to {Column}{Row}" (e.g., "Knight to E4") |
| Wizard's Chess | Append | Building the move history string shown in the game's side panel |

#### Array
| Node | Description |
|------|-------------|
| **Add / Add Unique** | Appends element to end (unique skips duplicates) |
| **Insert** | Inserts at specific index |
| **Remove** | Removes first matching element |
| **Remove Index** | Removes element at specific index |
| **Clear** | Empties the array |
| **Get** | Returns element at index |
| **Set** | Sets element at index |
| **Find** | Returns index of first matching element |
| **Contains** | Checks if element exists |
| **Length** | Returns number of elements |
| **Last Index** | Returns Length - 1 |
| **Is Valid Index** | Checks if index is in range |
| **Is Empty** | Returns true if no elements |
| **Sort** | Sorts the array (uses a custom predicate delegate) |
| **Reverse** | Reverses element order |
| **Shuffle** | Randomizes element order |
| **Resize** | Changes array size, truncating or padding |
| **Filter Array** | Filters by class for object arrays |
| **For Each Loop** | Iterates with index and element |
| **Make Array** | Creates an array literal from pins |
| **Array from Set / Array from Map Keys / Values** | Conversion nodes |
| **Random Array Item** | Returns a random element |
| **Swap** | Swaps two elements by index |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Sort | Sorting combatants by initiative roll (d20 + Finesse modifier) to build the turn order array |
| DnD RPG | Shuffle | Randomising loot table results before picking the top N items for a chest drop |
| DnD RPG | Filter Array | Filtering an array of all Actors in range to only those that implement the IDamageable interface |
| DnD RPG | For Each Loop | Iterating over the party members array to apply area-of-effect damage from a Mage's fireball |
| DnD RPG | Add Unique | Adding discovered locations to the `DiscoveredLocations` array without duplicates |
| DnD RPG | Remove | Removing a dead enemy from the active combatants array |
| DnD RPG | Random Array Item | Picking a random idle bark voice line for an NPC |
| Wizard's Chess | Find | Finding a piece in the active pieces array by its board position |
| Wizard's Chess | Remove | Removing a captured piece from the active pieces array |
| Wizard's Chess | For Each Loop | Iterating over all pieces of one colour to check if any valid moves exist (stalemate detection) |
| Wizard's Chess | Make Array | Creating the list of valid target squares for a selected piece's movement |

#### Map
| Node | Description |
|------|-------------|
| **Add** | Inserts key-value pair (overwrites if key exists) |
| **Remove** | Removes entry by key |
| **Find** | Returns value for a key with a found boolean |
| **Contains** | Checks if key exists |
| **Keys** | Returns array of all keys |
| **Values** | Returns array of all values |
| **Length** | Returns number of entries |
| **Clear** | Empties the map |
| **Is Empty** | Returns true if no entries |
| **Make Map** | Creates a map literal |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Add | Storing NPC relationships: `Map<FString, int32>` where key is NPC name ("elder_miriam"), value is reputation score (15) |
| DnD RPG | Find | Looking up a loot item's stats from an `ItemID -> FItemData` map |
| DnD RPG | Contains | Checking if a world flag exists in the `WorldFlags` map (e.g., "goblin_caves_cleared") before allowing quest progression |
| DnD RPG | Keys | Getting all NPC names the player has interacted with, for the AI DM's context window |
| Wizard's Chess | Add | Mapping board positions to piece references: `Map<FIntPoint, ABP_ChessPiece>` for quick lookup of what piece is on a given square |
| Wizard's Chess | Find | Checking if a target square is occupied before allowing a move |
| Wizard's Chess | Remove | Clearing a square's entry when a piece moves away |

#### Set
| Node | Description |
|------|-------------|
| **Add** | Adds an element |
| **Remove** | Removes an element |
| **Contains** | Checks membership |
| **Length** | Returns number of elements |
| **Clear** | Empties the set |
| **To Array** | Converts set to array |
| **Union** | Combines two sets |
| **Intersection** | Elements common to both sets |
| **Difference** | Elements in A but not B |
| **Is Empty** | Returns true if no elements |
| **Make Set** | Creates a set literal |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Union | Combining the set of hexes revealed by two different party members' Perception checks into one fog-of-war reveal set |
| DnD RPG | Contains | Checking if a skill proficiency exists in the character's proficiency set before adding the proficiency bonus to a skill check |
| DnD RPG | Intersection | Finding which active conditions on a target overlap with the ability's "cures" set (e.g., Cleric's Purify removes Poisoned and Blinded) |
| DnD RPG | Difference | Finding which buff conditions are new (not already active) before applying them, to avoid duplicate buff stacking |
| Wizard's Chess | Add / Contains | Tracking threatened squares: build a set of all squares attacked by one colour's pieces, then check if the opponent's King position is in that set (check detection) |

#### Transform
| Node | Description |
|------|-------------|
| **Make Transform** | Creates from location, rotation, scale |
| **Break Transform** | Decomposes into location, rotation, scale |
| **Get / Set World Transform** | Reads/writes component world transform |
| **Get / Set Relative Transform** | Reads/writes component local transform |
| **Set Actor Transform / Location / Rotation / Scale** | Actor-level transforms |
| **Add Actor World Offset / Rotation** | Incremental transforms |
| **Transform Location / Direction** | Converts between local and world space |
| **Inverse Transform** | Inverts a transform |
| **Compose Transforms** | Multiplies two transforms |
| **Interp To** (Transform) | Smooth transform interpolation |
| **Look At Rotation / Find Look At Rotation** | Calculates rotation to face a target |
| **Get Forward / Right / Up Vector** | Directional vectors from rotation |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Set Actor Transform | Teleporting a character to a hex grid position during turn-based movement |
| DnD RPG | Interp To (Transform) | Smoothly animating a character sliding between hexes rather than teleporting |
| DnD RPG | Look At Rotation | Making a Ranger face their target before firing an arrow |
| DnD RPG | Get Forward Vector | Determining the direction for a Warrior's Cleave ability (cone attack in the character's forward arc) |
| DnD RPG | Add Actor World Offset | Incrementally raising miniatures during the zoom transition as the table surface gains depth |
| DnD RPG | Inverse Transform Location | Converting a world-space click position to the hex grid's local coordinate system for tile selection |
| Wizard's Chess | Set Actor Location | Snapping a piece to the centre of a target square after movement |
| Wizard's Chess | Interp To | Smooth gliding animation as a piece moves from one square to another, with the magic trail following |
| Wizard's Chess | Get/Set Relative Transform | Positioning pieces relative to the board Actor so the entire board can be moved or rotated without breaking piece positions |

#### Utilities
| Node | Description |
|------|-------------|
| **Print String** | Debug text to screen and/or log. Shortcut: type "print" in context menu |
| **Print Text** | Prints FText to screen |
| **Draw Debug Line / Sphere / Box / Point / Arrow / Cylinder / Capsule / Plane / String / Frustrum** | Visual debug helpers |
| **Delay** | Latent; waits specified seconds |
| **Retriggerable Delay** | Restarts timer on each trigger |
| **Set Timer by Event / Function Name** | Recurring or one-shot timers |
| **Clear Timer / Is Timer Active / Get Timer Elapsed / Remaining** | Timer management |
| **Spawn Actor from Class** | Creates a new Actor in the world |
| **Destroy Actor / Destroy Component** | Removes from world |
| **Get All Actors of Class / With Tag / With Interface** | World queries |
| **Get Player Controller / Character / Camera Manager / Pawn** | Player references |
| **Get Game Mode / Game State / Game Instance** | Framework references |
| **Is Valid** | Object null-check |
| **Cast To** | Downcasts an object reference |
| **Class Is Child Of** | Checks inheritance |
| **Does Implement Interface** | Checks for interface |
| **Get Display Name / Get Class** | Reflection |
| **Construct Object from Class** | Creates UObject (non-Actor) |
| **Create Dynamic Material Instance** | Runtime material creation |
| **Get / Set System Time** | System clock |
| **Get World Delta Seconds** | Frame delta time |
| **Get Time Seconds / Get Real Time Seconds** | Game time vs wall time |
| **Format String / Format Text** | String formatting |
| **Platform-specific branches** | (Switch on Platform) |
| **Execute Console Command** | Runs a console command string |
| **Quit Game** | Exits the application |
| **Open Level / Get Current Level Name** | Level management |
| **Load Stream Level / Unload Stream Level** | Level streaming |
| **Set Game Paused / Is Game Paused** | Pause control |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Spawn Actor from Class | Spawning enemies at encounter start based on the AI DM's JSON response (e.g., spawn 3 orc_warrior and 1 orc_shaman) |
| DnD RPG | Destroy Actor | Removing defeated enemies from the world after their death animation plays |
| DnD RPG | Get All Actors of Class | Finding all active combatants (ABP_BaseCharacter) to build the initiative order |
| DnD RPG | Get All Actors With Tag | Finding all Actors tagged "Tier1Enemy" to scale difficulty based on party level |
| DnD RPG | Cast To | Casting GetPlayerPawn() to BP_PlayerCharacter to access stats, abilities, and equipment |
| DnD RPG | Set Timer by Event | The real-time combat cooldown system: after using Power Strike, set a 6-second timer before it is available again |
| DnD RPG | Create Dynamic Material Instance | Creating runtime material instances for the TransitionAlpha parameter that drives the miniature-to-real crossfade |
| DnD RPG | Get Game Instance | Accessing persistent save data (party composition, gold, quest progress) that persists across level transitions |
| DnD RPG | Delay | Pacing the turn-based combat loop: 0.5s delay between turns for readability |
| DnD RPG | Print String | Debug output showing dice rolls: "d20 + 3 = 17 vs AC 15: HIT" during development |
| DnD RPG | Load Stream Level | Loading a dungeon sub-level when the player zooms into a specific tabletop location |
| Wizard's Chess | Spawn Actor from Class | Spawning all 32 pieces at game start based on their starting board positions |
| Wizard's Chess | Destroy Actor | Removing a captured piece after its shattering animation completes |
| Wizard's Chess | Set Game Paused | Pausing the game when the player opens the menu to resign or offer a draw |
| Wizard's Chess | Get World Delta Seconds | Timing the magic trail particle effect during piece movement so it scales with frame rate |
| Wizard's Chess | Draw Debug Line | Visualising valid move paths during development to verify movement rules |

#### AI
| Node | Description |
|------|-------------|
| **AI Move To** | Latent; moves AI Pawn to location or Actor via NavMesh |
| **Move to Location / Actor** | Non-latent movement request |
| **Get / Set Blackboard Value As...** | Reads/writes Behavior Tree Blackboard keys (Bool, Int, Float, String, Object, Vector, Rotator, Enum, Class, Name) |
| **Run Behavior Tree** | Starts a Behavior Tree on an AI Controller |
| **Stop Behavior Tree** | Halts the active Behavior Tree |
| **Use Blackboard** | Assigns a Blackboard Data Asset to the AI Controller |
| **Get AI Controller / Get Controlled Pawn** | Controller-Pawn references |
| **Set Focus / Clear Focus** | Sets the AI focus point or Actor |
| **Get Path / Find Path to Location/Actor** | Pathfinding queries (synchronous) |
| **Get Path Length / Cost** | Path metrics |
| **PawnSensing** | Built-in hearing/sight (legacy; Perception is preferred) |
| **AI Perception** | Sight, Hearing, Damage, Touch, Team, Prediction stimuli |
| **Get Currently Perceived Actors** | Returns Actors detected by AI Perception |
| **Register / Unregister as Source** | Registers Actor as stimulus source |
| **Send AI Message** | Sends a custom message to another AI |
| **EQS (Environment Query System)** | Run EQS Query node; returns scored results |
| **Receive Move Completed** | Event fires when AI Move To finishes |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | AI Move To | Moving a Goblin Archer to a flanking position during turn-based combat (pathfinds via NavMesh around obstacles) |
| DnD RPG | Run Behavior Tree | Starting BT_OrcWarrior on an Orc enemy at encounter start; the tree handles attack, chase, retreat decisions |
| DnD RPG | Get/Set Blackboard Value | Setting "TargetActor" on the enemy Blackboard to the lowest-HP party member (Utility AI scoring), reading "IsInMeleeRange" to decide between charge and ranged attack |
| DnD RPG | AI Perception (Sight, Hearing) | Enemies detecting the party: sight for visual range, hearing for the Bard's loud spells. Rogue's Stealth skill reduces their detection radius |
| DnD RPG | EQS Query | Finding the best hex to move to: score positions based on distance to target, cover availability, and line of sight. Used by the party AI presets (Aggressive scores offensive positions higher, Defensive scores cover higher) |
| DnD RPG | Get Currently Perceived Actors | Listing all enemies the AI is aware of, filtered by the party AI's priority rules (Support preset targets wounded allies first) |
| DnD RPG | Send AI Message | One enemy alerting nearby enemies when it spots the player, triggering them to enter combat even if they have not perceived the party directly |
| Wizard's Chess | AI Move To | Not used directly (pieces do not pathfind). Instead, the chess AI evaluates board state using a minimax algorithm in C++ and outputs a move, which Blueprints then animate |
| Wizard's Chess | Blackboard Values | If you wrap the chess AI in a Behavior Tree: store `BestMove`, `CurrentPhase` (opening, midgame, endgame), and `DifficultyDepth` (search depth for minimax) |

#### Animation
| Node | Description |
|------|-------------|
| **Play Animation** | Plays an AnimSequence on a Skeletal Mesh Component |
| **Play Anim Montage / Stop Anim Montage** | Montage playback control |
| **Get Current Montage / Get Montage Play Position** | Montage queries |
| **Set Montage Play Rate / Position** | Montage adjustment |
| **Get Anim Instance** | Returns the Animation Blueprint instance |
| **Get Skeletal Mesh Component** | Returns the mesh |
| **Set Skeletal Mesh** | Swaps the mesh at runtime |
| **Get Bone Transform / Socket Transform** | Queries bone or socket world transform |
| **Get / Set Morph Target** | Blendshape control |
| **Linked Anim Graph** | Links an additional Animation Blueprint |
| **Set Notify Delegate** | Binds to animation notifies from Blueprint |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Play Anim Montage | Playing the Warrior's Power Strike swing montage, the Cleric's heal cast montage, or the Mage's fireball throw montage |
| DnD RPG | Stop Anim Montage | Interrupting a spell cast when the caster takes damage (breaking Concentration in real-time mode) |
| DnD RPG | Set Skeletal Mesh | Swapping the miniature-scale mesh for the full-scale character mesh during the zoom transition |
| DnD RPG | Get Bone Transform | Getting the hand bone position to spawn a spell projectile from the Mage's staff tip (attached to a socket) |
| DnD RPG | Set Notify Delegate | Binding to a "SpawnProjectile" anim notify in the Ranger's bow shot montage, so the arrow spawns at the exact moment the bowstring releases |
| DnD RPG | Get/Set Morph Target | Facial expressions on characters during dialogue with AI DM-driven NPCs (smile, frown, surprised) |
| Wizard's Chess | Play Animation | Playing the piece's "move" animation (piece lifts, glides, and sets down) and "idle" animation (subtle hover or glow pulse) |
| Wizard's Chess | Play Anim Montage | Playing the dramatic "capture" montage where the attacking piece strikes and the defending piece shatters |
| Wizard's Chess | Get Bone Transform | Getting a specific bone on a Knight piece to attach the magic trail emitter at the horse's hooves |

#### Audio
| Node | Description |
|------|-------------|
| **Play Sound 2D** | Plays a non-spatialized sound |
| **Play Sound at Location** | Plays spatialized sound at a world position |
| **Spawn Sound 2D / Spawn Sound at Location** | Returns an Audio Component for control |
| **Spawn Sound Attached** | Plays sound attached to a component |
| **Set Sound Mix / Push / Pop Sound Mix Modifier** | Sound mix control |
| **Set / Get Audio Volume** | Volume class control |
| **Activate / Deactivate Audio Component** | Component toggling |
| **Set Float / Bool / Int / String / Trigger Parameter** | MetaSound and SoundCue parameters |
| **Play Dialogue / Play Dialogue at Location** | Dialogue context playback |
| **Start / Stop Audio Analysis** | For audio visualization |
| **Get Magnitude for Frequencies** | Frequency analysis |
| **Set Submix Effect Chain** | Runtime audio processing |
| **Sound Attenuation** | Spatial falloff settings |
| **Sound Concurrency** | Limits simultaneous instances |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Play Sound 2D | UI sounds: dice rolling, menu clicks, level-up fanfare, turn notification chime |
| DnD RPG | Play Sound at Location | Sword clash at the point of impact, fireball explosion at the target hex, arrow hitting a wall |
| DnD RPG | Spawn Sound Attached | Attaching a fire-crackling loop to a Burning condition effect on a character, so the sound moves with them |
| DnD RPG | Sound Attenuation | Room ambience (candle crackle, clock tick) fades out as the camera zooms into the world; world sounds (wind, birds, combat) fade in. Attenuation controls this spatial falloff |
| DnD RPG | Sound Concurrency | Limiting simultaneous impact sounds so 6 enemies attacking at once does not create audio chaos |
| DnD RPG | Set Float Parameter (MetaSound) | Driving adaptive combat music intensity based on how many enemies remain and party HP percentage |
| Wizard's Chess | Play Sound at Location | The impact sound of a piece slamming down on its target square, spatialised to the board position |
| Wizard's Chess | Spawn Sound Attached | A magical hum loop attached to a piece while it is being moved, fading out when it lands |
| Wizard's Chess | Sound Concurrency | Limiting the number of simultaneous ambient magic whisper sounds to 3, so the board does not overwhelm the audio mix |

#### Collision
| Node | Description |
|------|-------------|
| **Line Trace by Channel / Profile / Object** | Raycast from start to end |
| **Sphere Trace / Box Trace / Capsule Trace** | Sweep traces |
| **Multi Line Trace / Multi Sphere Trace** | Returns all hits, not just first |
| **Component Overlap Actors / Components** | Overlap queries by shape |
| **Overlap Sphere / Box / Capsule at Location** | Static overlap tests |
| **Set Collision Enabled / Profile / Response** | Runtime collision changes |
| **On Component Begin/End Overlap** | Overlap events |
| **On Component Hit** | Impact events |
| **Get Overlapping Actors / Components** | Current overlap queries |
| **Ignore Actor When Moving** | Dynamic ignore lists |
| **Break Hit Result** | Decomposes FHitResult into Impact Point, Normal, Location, Bone Name, Physics Material, etc. |
| **Get Hit Result Under Cursor** | Mouse-based hit detection |
| **Convert World to Screen / Screen to World** | Coordinate conversion |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Line Trace by Channel | Clicking a hex tile in turn-based mode: trace from the camera through the mouse cursor to find which hex the player clicked |
| DnD RPG | Sphere Trace | Area-of-effect ability targeting: the Mage's Fireball uses a sphere trace at the target location to find all Actors within the blast radius |
| DnD RPG | On Component Begin Overlap | Detecting when a character enters a trap trigger zone on the dungeon floor |
| DnD RPG | Get Hit Result Under Cursor | Turn-based targeting: hovering over an enemy shows their HP bar and highlights the hex. The hit result tells you which Actor is under the mouse |
| DnD RPG | Multi Line Trace | Line-of-sight check for ranged attacks: trace from the Ranger to the target. If Multi Line Trace hits an obstacle before the target, the shot is blocked by cover |
| DnD RPG | Break Hit Result | Extracting the Bone Name from a melee hit to play location-specific impact effects (head hit = critical flash, body hit = standard) |
| DnD RPG | Set Collision Response | Making a character's collision ignore projectiles while they are in a dodge roll (i-frames in real-time combat) |
| Wizard's Chess | Line Trace by Channel | Clicking on a chess piece or square: trace from camera through cursor, identify the piece or square Actor |
| Wizard's Chess | On Component Begin Overlap | Detecting when a moving piece enters the target square's trigger box to initiate the capture sequence |
| Wizard's Chess | Convert Screen to World | Converting the player's mouse position to a world-space ray for piece selection on the 3D board |

#### Input
| Node | Description |
|------|-------------|
| **Input Action events** | Enhanced Input system actions (IA_Move, IA_Look, etc.) |
| **Get Action Value** | Returns current value of an Input Action |
| **Input Key / Axis / Touch / Gamepad events** | Legacy input (Keyboard, Mouse, Gamepad) |
| **Get Input Axis Value / Key Down** | Polling input state |
| **Enhanced Input: Add/Remove Mapping Context** | Dynamic input context management |
| **Get Mouse Position / Delta** | Cursor data |
| **Is Input Key Down** | Direct key state check |
| **Enable / Disable Input** | Per-Actor input toggling |
| **Set Input Mode Game Only / UI Only / Game and UI** | Focus control |
| **Get Motion Controller Data** | VR controller state |
| **Get Touch State** | Mobile touch data |
| **Set Show Mouse Cursor** | Cursor visibility |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Enhanced Input: Add/Remove Mapping Context | Swapping input contexts when switching between combat modes: IMC_TurnBased (click-to-move, ability hotbar) vs IMC_RealTime (WASD movement, mouse aim, dodge on spacebar) vs IMC_Tabletop (pan, zoom, rotate the tabletop view) |
| DnD RPG | Set Input Mode Game and UI | During turn-based combat, the player needs to click UI buttons (ability bar, end turn) AND interact with the game world (click hexes, select targets) |
| DnD RPG | Set Show Mouse Cursor | Show cursor in tabletop view and turn-based mode; hide it in real-time combat for third-person action feel |
| DnD RPG | Enable/Disable Input | Disabling input on a character during the Stunned condition |
| Wizard's Chess | Set Input Mode Game and UI | Always active, since the player clicks pieces (game world) and UI buttons (undo, resign, draw) |
| Wizard's Chess | Get Mouse Position | Tracking the cursor to highlight valid squares as the player hovers before committing a move |

#### Physics
| Node | Description |
|------|-------------|
| **Add Force / Add Impulse** | Continuous or instantaneous forces |
| **Add Torque / Add Angular Impulse** | Rotational forces |
| **Set Physics Linear / Angular Velocity** | Direct velocity control |
| **Get Physics Linear / Angular Velocity** | Velocity queries |
| **Set Simulate Physics** | Enables/disables physics simulation |
| **Set Mass Override** | Custom mass |
| **Set Linear / Angular Damping** | Drag/friction settings |
| **Set Gravity Enabled** | Per-component gravity toggle |
| **Set Constraint Mode** | Locks axes for 2D-style physics |
| **Set Collision Profile / Response** | Physics collision behavior |
| **Wake / Put Rigid Body to Sleep** | Sleep state control |
| **Get Mass** | Returns component mass |
| **Set Physics Material** | Runtime material swap |
| **Apply Radial Force / Damage** | Area-of-effect physics |
| **Get Closest Point on Collision** | Nearest surface query |
| **Physical Animation Component** | Blends animation with physics |
| **Set All Bodies Below Simulate Physics** | Ragdoll from a bone |

**UE 5.7 Chaos Physics Note**: Partial sleeping for large unstructured piles, improved sphere/capsule narrow-phase queries, and new parallelization thresholds via console variable `p.Chaos.MinParallelTaskSize`.

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Add Impulse | Knockback effect: the Warrior's Shield Bash applies an impulse to push an enemy back 2 hexes |
| DnD RPG | Apply Radial Force | The Mage's Fireball explosion pushes all physics objects (barrels, crates, debris) away from the blast centre |
| DnD RPG | Set All Bodies Below Simulate Physics | Ragdoll death: when an enemy's HP reaches 0, enable physics simulation from the pelvis bone down for a ragdoll collapse |
| DnD RPG | Set Simulate Physics | Props on the tabletop (dice, pencils, rulebooks) use physics so they rattle during combat vibrations |
| DnD RPG | Physical Animation Component | Blending between ragdoll and animation for the "knocked prone" condition, so characters stumble realistically before getting back up |
| Wizard's Chess | Add Impulse | When a piece is captured, apply a directional impulse to the Chaos Destruction fragments so they scatter dramatically away from the attacking piece |
| Wizard's Chess | Set Simulate Physics | Enabling physics on the destruction fragments of a captured piece so they tumble and settle on the board naturally |
| Wizard's Chess | Set Linear Damping | High damping on chess piece fragments so they settle quickly rather than bouncing endlessly across the board |
| Wizard's Chess | Apply Radial Force | A radial force at the point of capture scatters smaller debris and dust particles outward |

The UE 5.7 Chaos improvements (partial sleeping for piles, better sphere/capsule queries) directly benefit the Wizard's Chess capture system, where many small fragments pile up on the board after several captures.

#### Rendering
| Node | Description |
|------|-------------|
| **Set Material / Create Dynamic Material Instance** | Material assignment and instancing |
| **Set Scalar / Vector / Texture Parameter Value** | Dynamic material parameters |
| **Set Visibility / Hidden in Game** | Rendering toggle |
| **Set Render Custom Depth** | Enables custom depth for post-process effects |
| **Set Custom Depth Stencil Value** | Stencil value for masking |
| **Set Cast Shadow / Affect Dynamic Indirect Lighting** | Shadow/lighting control |
| **Get Rendering Bounds** | Returns bounding box |
| **Set LOD** | Forces a specific LOD level |
| **Set Translucency Sort Priority** | Render order for translucent objects |
| **Draw Material to Render Target** | Renders material to a texture |
| **Begin / End Draw Canvas to Render Target** | Canvas API for runtime texture drawing |
| **Export Render Target** | Saves render target to disk |
| **Create Render Target 2D** | Runtime render target creation |
| **Set Max Draw Distance / Max Distance Fade Range** | LOD and culling (newly exposed to Blueprint in UE 5.7) |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Create Dynamic Material Instance | Creating a runtime material for each character's TransitionAlpha parameter. On BeginPlay, create the MID once, store it, then update the alpha in Tick during the zoom transition |
| DnD RPG | Set Scalar Parameter Value | Driving the TransitionAlpha (0.0 = painted miniature, 1.0 = living character) during the 2.5-second zoom |
| DnD RPG | Set Vector Parameter Value | Changing a character's material tint when they are Poisoned (green) or Burning (orange) |
| DnD RPG | Set Render Custom Depth + Set Custom Depth Stencil Value | Outlining the currently selected character in turn-based mode with a post-process stencil effect (different colours per team) |
| DnD RPG | Set Visibility | Hiding world-scale foliage and terrain detail when viewing from the tabletop, showing them when zoomed in |
| DnD RPG | Draw Material to Render Target | The render-to-texture system that feeds the tabletop map: rendering the world from a top-down camera to a render target, then displaying that texture on the table surface |
| DnD RPG | Set Max Draw Distance (UE 5.7) | Setting small props (grass, pebbles) to disappear beyond 50 metres, saving performance during the tabletop view where everything is at a distance |
| Wizard's Chess | Set Scalar Parameter Value | Intensifying the emissive glow on the board squares when a King is in check |
| Wizard's Chess | Set Vector Parameter Value | Changing a square's highlight colour: green for valid moves, red for threatened squares, gold for the selected piece |
| Wizard's Chess | Set Visibility | Hiding the move indicator markers when it is not the player's turn |

#### UI (UMG/Slate)
| Node | Description |
|------|-------------|
| **Create Widget** | Instantiates a UMG Widget Blueprint |
| **Add to Viewport / Remove from Parent** | Widget display management |
| **Set Visibility (Widget)** | Show/hide without removing |
| **Set Text / Set Image / Set Percent** | Updates widget content |
| **Bind Widget** | Binds a variable to a named widget |
| **Get / Set Is Enabled** | Interactability toggling |
| **Play Animation (Widget)** | UMG animation playback |
| **Set Input Mode UI Only / Game and UI** | Focus for mouse input |
| **Set Keyboard Focus** | Moves focus to a specific widget |
| **Get Desired Size / Get Cached Geometry** | Layout queries |
| **Set Color and Opacity** | Tint control |
| **On Clicked / On Hovered / On Unhovered** | Button events |
| **Set Cursor / Show / Hide** | Cursor control |

**In your games:**

| Game | Node | Example Use |
|------|------|-------------|
| DnD RPG | Create Widget | Creating the HUD at game start: HP/mana bars, initiative order bar, ability hotbar, minimap, combat log |
| DnD RPG | Add to Viewport / Remove from Parent | Showing the character creation widget at new game start, removing it when the player confirms. Showing the level-up widget when XP threshold is reached |
| DnD RPG | Set Text | Updating the combat log with "Aldric hits Goblin for 12 damage" and the initiative bar with character names and turn order |
| DnD RPG | Set Percent | Driving the HP bar fill percentage (CurrentHP / MaxHP) and mana bar fill |
| DnD RPG | Play Animation (Widget) | Animating the damage number floating up and fading out, the initiative bar sliding when turns change, the XP bar filling up on quest completion |
| DnD RPG | Set Input Mode UI Only | When the inventory or character sheet is open, prevent game world interaction |
| DnD RPG | Bind Widget | Binding HP bar and stat text widgets by name so they update automatically when the underlying variable changes |
| Wizard's Chess | Create Widget | Creating the game UI: move history panel, captured pieces display, player name labels, timer (if timed mode) |
| Wizard's Chess | Set Text | Updating the move history with algebraic notation: "1. e4 e5 2. Nf3 Nc6" |
| Wizard's Chess | Play Animation (Widget) | Animating the "Check!" warning text pulsing on screen |
| Wizard's Chess | On Clicked | Handling the Resign, Draw Offer, and Undo buttons |

---

### Custom Events, Event Dispatchers, Interfaces, Macros, and Function Libraries

#### Custom Events
- Created by right-clicking the graph and selecting **Add Custom Event**, or via **My Blueprint > Functions > New Event**
- Custom Events appear as red nodes and serve as execution entry points
- Can have input parameters but no return values (use a function if you need a return)
- Called from other Blueprints via the owning Actor reference
- Supports **Replication**: Not Replicated, Multicast, Run on Server, Run on Owning Client
- Mark as **Reliable** or **Unreliable** for networked events
- Can be called from C++ via `ProcessEvent` or the generated function name

**In your games:**

- **DnD RPG**: Custom Events like `OnTurnStart`, `OnTurnEnd`, `OnAbilityActivated`, `OnCombatModeSwitch` serve as entry points in your combat manager. The `OnTurnStart` event takes a parameter for the active combatant reference. For multiplayer-ready architecture, mark `OnAbilityActivated` as "Run on Server" so the server validates the ability use before applying damage (server-authoritative pattern from Phase 0).
- **Wizard's Chess**: Custom Events like `OnPieceSelected`, `OnMoveConfirmed`, `OnCaptureTriggered`, `OnCheckDetected`, `OnCheckmateDetected`. `OnMoveConfirmed` takes parameters for the piece reference and target square position.

#### Event Dispatchers
- Created in the **My Blueprint** panel under **Event Dispatchers**
- Implements the Observer pattern (multicast delegate)
- **Bind Event to Dispatcher**: Subscribes a custom event to the dispatcher
- **Unbind Event / Unbind All Events from Dispatcher**: Removes subscriptions
- **Call Dispatcher**: Fires the event, triggering all bound listeners
- Dispatchers can have parameters (define via the Details panel when the dispatcher is selected)
- Common pattern: Child Actor fires a dispatcher, parent listens. This avoids hard coupling.
- Dispatchers appear as orange nodes in the graph

**In your games:**

- **DnD RPG**: `OnHealthChanged` dispatcher on every character, so the UI HP bar widget binds to it and updates automatically. `OnDeath` dispatcher on enemies so the combat manager removes them from the turn order, the loot system drops items, and the XP system awards experience, all without the enemy Blueprint needing to know about any of those systems. `OnZoomTransitionComplete` on the CameraDirector so the game knows when to enable player input after the tabletop zoom finishes.
- **Wizard's Chess**: `OnPieceCaptured` dispatcher so the capture counter UI, the debris VFX system, and the sound manager all react independently. `OnTurnChanged` dispatcher so the board highlighting, the player label, and the timer all update without hard-coding those connections.

#### Blueprint Interfaces
- **Create**: Content Browser > right-click > Blueprints > Blueprint Interface
- Define function signatures (name, inputs, outputs) without implementation
- **Implement**: Open a Blueprint > Class Settings > Interfaces > Add, then select the interface
- Functions appear in My Blueprint under "Interfaces" section; double-click to implement
- **Calling**: Use the **Message** node (envelope icon) to call interface functions on any Actor; it safely does nothing if the Actor does not implement the interface
- Supports return values, which allows the caller to query data from the target without casting
- Works across C++ and Blueprint boundaries

**In your games:**

- **DnD RPG**: Create a `BPI_Damageable` interface with `TakeDamage(Amount, DamageType, Attacker)` and `GetCurrentHP() -> int`. Both player characters and enemies implement it. The Mage's Fireball does not need to cast to specific enemy types; it calls `TakeDamage` via the interface Message node on every Actor in the blast radius. If a destructible barrel also implements `BPI_Damageable`, the fireball damages it too, with zero extra code. Create `BPI_Interactable` with `Interact(Instigator)` for doors, chests, NPCs, and levers, so the player's interact key works on anything without knowing what type of object it is.
- **Wizard's Chess**: Create `BPI_Selectable` with `OnSelected()`, `OnDeselected()`, and `GetValidMoves() -> Array<FIntPoint>`. Both pieces and squares implement it, so the click handler does not care whether the player clicked a piece or an empty square. Use `GetValidMoves()` return value to highlight valid destination squares.

#### Macros
- **Create**: My Blueprint panel > Macros > New Macro
- Macros are inlined at compile time (no function call overhead)
- Can have multiple exec input/output pins (unlike functions, which have one entry and one return)
- Cannot contain latent nodes (Delay, Timeline, AI Move To)
- Cannot be called from other Blueprints (local to the defining Blueprint or Macro Library)
- **Macro Libraries**: Blueprint Macro Library assets can be shared across multiple Blueprints. Add via Class Settings > Macro Libraries.
- Use macros for flow-control patterns (custom branching logic, multi-output routing)

**In your games:**

- **DnD RPG**: Create a "RollDiceAndCheck" macro that takes NumDice, DiceSides, Modifier, and TargetDC as inputs. It rolls the dice, adds the modifier, compares against the DC, and has two exec output pins: "Success" and "Failure". This macro gets used everywhere: attack rolls, skill checks, saving throws. Since macros inline at compile time, there is zero function call overhead for something that runs potentially dozens of times per combat turn.
- **Wizard's Chess**: Create an "IsSquareValid" macro that checks if a board coordinate is within bounds (0-7 for both row and column) and has two output pins: "Valid" and "Invalid". Used in every movement validation function.

#### Blueprint Function Libraries
- **Create**: Content Browser > right-click > Blueprints > Blueprint Function Library
- Contains static functions callable from any Blueprint
- Functions appear in the context menu of all Blueprints
- Ideal for utility functions (math helpers, string formatters, validation logic)
- Can be exposed to all Blueprints or restricted by class via the **Access Specifier**
- C++ equivalent: `UBlueprintFunctionLibrary`

**In your games:**

- **DnD RPG**: Create a `BFL_DiceRoller` function library with static functions: `RollD20()`, `RollDice(NumDice, Sides)`, `RollWithAdvantage()`, `RollWithDisadvantage()`. These appear in every Blueprint's context menu, so any ability, skill check, or encounter can roll dice without duplicating the logic. Also create `BFL_CombatUtils` with `CalculateHitChance(AttackerStats, DefenderAC)`, `ApplyDamageModifiers(BaseDamage, DamageType, TargetResistances)`, and `IsInRange(Source, Target, RangeInHexes)`.
- **Wizard's Chess**: Create `BFL_ChessUtils` with `BoardToWorldPosition(Row, Col)`, `WorldToBoardPosition(WorldLocation)`, `IsValidSquare(Row, Col)`, and `GetSquareColour(Row, Col)`. Every piece Blueprint and the board manager can use these without importing or casting.

---

### Blueprint Communication Patterns

#### Casting
- **Cast To [ClassName]**: Converts a generic object reference to a specific class
- Returns the cast object on success; the "Cast Failed" exec pin fires on failure
- **Performance note**: Casting loads the target class into memory if not already loaded. Avoid casting to heavy Blueprints from frequently-executed code paths; use interfaces instead.
- **Pure Cast**: A data-only cast (no exec pins) available for certain types; returns null on failure
- Common pattern: Cast `GetPlayerPawn()` to your custom Character class to access game-specific variables

**In your games:**

- **DnD RPG**: Cast `GetPlayerPawn()` to `BP_PlayerCharacter` to access Might, Finesse, Mind, Presence stats and the equipped weapon. Cast a generic Actor reference to `BP_EnemyBase` to read its Behavior Tree, HP, and loot table. Be careful: casting to heavy Blueprints like `BP_Warrior` (which references 20+ ability montages, VFX, and sounds) from every enemy's AI tick is expensive. Use interfaces instead for damage dealing, and reserve casting for one-time operations like the initial combat setup.
- **Wizard's Chess**: Cast a clicked Actor to `BP_ChessPiece` to access PieceType, PieceColour, and valid move logic. Since there are only 32 pieces maximum and casting happens on clicks (not every frame), performance is not a concern here.

#### Interfaces
- Preferred for decoupled communication
- Does not create a hard reference (no asset loading)
- Call via **Message** nodes; safe to call on Actors that may or may not implement the interface
- Supports return values for two-way queries
- Works with **Get All Actors with Interface** for broadcast patterns

#### Event Dispatchers
- Best for one-to-many notification patterns
- The broadcaster does not need to know about listeners
- Listeners bind to the dispatcher and receive callbacks
- Common use: UI widgets binding to game state changes, pickups notifying score systems

**In your games:** These three patterns (Casting, Interfaces, Event Dispatchers) are the foundation of your game architecture. Here is how they fit together in the DnD RPG:

| Communication Need | Best Pattern | Why |
|-------------------|-------------|-----|
| Player clicks an enemy to see its stats | Interface (`BPI_Inspectable`) | The click handler does not need to know the specific enemy class |
| Warrior's Power Strike deals damage | Interface (`BPI_Damageable.TakeDamage`) | Works on enemies, destructible props, and any future damageable object |
| Enemy dies and loot drops | Event Dispatcher (`OnDeath`) | The loot system, XP system, combat manager, and UI all listen independently |
| UI HP bar updates when player takes damage | Event Dispatcher (`OnHealthChanged`) | The character does not need a reference to the UI widget |
| Accessing the Mage's specific spell list | Casting to `BP_Mage` | Only the Mage has spell-specific data, and this is a one-time operation |
| AI DM receives game state | Game Instance | The AI DM module reads persistent state that survives level transitions |

For Wizard's Chess, the pattern is simpler: Interface for piece selection, Event Dispatchers for game state changes (capture, check, checkmate), and Direct References for the board squares (fixed 64-square layout that never changes).

#### Direct Reference
- Store a reference to a specific Actor via a variable (set in the Level Editor or at runtime)
- Tightest coupling; use sparingly
- Useful for level-specific references (a specific door triggered by a specific switch)

**In your games:**

- **DnD RPG**: Direct references work for the tabletop scene where specific miniatures are always present (the player's party miniatures on the table). The CameraDirector holds direct references to all five camera components because they are always present and never change. Avoid direct references for enemies (they are spawned dynamically) or loot items (spawned on drop).
- **Wizard's Chess**: The GameManager can hold direct references to all 64 board squares since they are placed in the editor and never change. Pieces should NOT be direct references because they get destroyed on capture.

#### Game Instance Communication
- Use the Game Instance (persistent across levels) to store global state
- Access via **Get Game Instance** > **Cast To** your custom Game Instance class
- Good for: save data, player progression, settings that persist between levels

**In your games:**

- **DnD RPG**: Your Game Instance (GI_TabletopQuest) stores everything from the save schema: party composition, gold, quest progress, world flags (goblin_caves_cleared), AI DM history summary, NPC reputation map, discovered locations, and the player's preferred combat mode. When the player zooms into a new area (which may load a stream level), the Game Instance persists all this data. The save/load system serialises the Game Instance to JSON.
- **Wizard's Chess**: The Game Instance stores match history, player preferences (piece style, board theme, AI difficulty depth), and win/loss records. It persists if you implement a menu system that loads different board levels.

---

### Blueprint Debugging

#### Breakpoints
- **Set Breakpoint**: Right-click any executable node > **Add Breakpoint**, or select a node and press **F9**
- Breakpoint nodes display a red circle
- **Disable Breakpoint**: Right-click > **Disable Breakpoint** (shows hollow red circle)
- **Remove All Breakpoints**: Debug menu > **Delete All Breakpoints**
- When a breakpoint is hit during PIE (Play In Editor), execution pauses and highlights the current node in red
- Step controls appear in the toolbar:
  - **Resume** (F5): Continue execution
  - **Step Into**: Steps into a called function/macro
  - **Step Over**: Executes the current node and moves to the next
  - **Step Out**: Completes the current function and returns to the caller
  - **Stop**: Ends the PIE session

#### Watch Values
- Hover over any data pin while paused at a breakpoint to see its current value in a tooltip
- Right-click a data pin > **Watch This Value** to add it to the Blueprint Debugger watch list
- **Blueprint Debugger tab**: Window > Developer Tools > Blueprint Debugger
- Shows all watched variables and their current values
- The Debugger tab also shows the **Call Stack** when paused

#### Additional Debug Tools
- **Print String** / **Print Text**: Quick debug output to screen (configurable color, duration)
- **Draw Debug** nodes: Visualize lines, spheres, boxes in the game world
- **Visual Logger**: Window > Developer Tools > Visual Logger. Records spatial debug data on a timeline.
- **Execution trace**: When debugging, wires animate to show flow direction in the recently-executed path
- **Blueprint Profiler**: Window > Developer Tools > Blueprint Profiler. Measures execution time per node.
- Console command `stat blueprints` shows Blueprint execution cost per frame

**In your games:**

- **DnD RPG**: Set breakpoints on the initiative sorting logic to step through and verify that combatants are ordered correctly by d20 + Finesse modifier. Watch the `TransitionAlpha` variable during the zoom transition to confirm it interpolates from 0.0 to 1.0 over 2.5 seconds. Use Draw Debug Sphere on each hex grid tile to visualise the movement range for the currently selected character. The Blueprint Profiler is essential for finding performance bottlenecks in the Utility AI scoring loop (which runs every frame for each party AI companion in real-time mode). Use Print String to display dice roll results during development: "d20(14) + Might(3) = 17 vs AC 15: HIT for 8 damage".
- **Wizard's Chess**: Set breakpoints on the check detection logic to verify that the threatened squares set is calculated correctly. Use Draw Debug Line to visualise all valid moves for a selected piece. Watch the minimax evaluation score to debug the AI's move selection.

---

### Blueprint Compilation and Nativization

#### Compilation
- **Compile button**: Top-left of Blueprint Editor toolbar (shortcut: **F7**)
- Compilation converts the visual graph into VM bytecode
- **Status indicators**:
  - Green checkmark: Successfully compiled, up to date
  - Yellow question mark: Needs recompilation
  - Red X: Compilation error
- **Compiler Results**: Errors and warnings appear in the Compiler Results panel at the bottom
- Double-click an error to navigate to the offending node
- **Full Recompile**: File > Recompile Blueprints (recompiles all Blueprints in the project)
- **Live Coding**: Compile C++ changes without restarting the editor (Ctrl+Alt+F11). Blueprint recompilation happens separately.
- Console command `obj list class=Blueprint` to inspect loaded Blueprints

#### Nativization (C++ Code Generation)
- Converts Blueprint bytecode to C++ source for shipping builds
- Eliminates VM overhead for performance-critical Blueprints
- **Enable**: Project Settings > Packaging > Blueprint Nativization Method
  - **Disabled**: No nativization
  - **Inclusive**: Only nativize explicitly selected Blueprints
  - **Exclusive**: Nativize all Blueprints except excluded ones
- Select specific Blueprints for nativization in their Class Settings > Nativize checkbox
- Nativized code is generated during the cooking/packaging step
- **Limitations**: Not all Blueprint features nativize cleanly. Test thoroughly after enabling. Some dynamic features (runtime Blueprint construction, certain reflection-based operations) may not nativize.
- **Note**: As of UE 5.x, Epic recommends using C++ directly for performance-critical code rather than relying on nativization. The feature remains available but is not the primary optimization strategy.

**In your games:**

- **DnD RPG**: Your combat system, ability execution (GAS), and AI DM integration will be C++ from the start (Phase 0 establishes C++ patterns). Blueprints handle visual scripting for level design, UI, and prototyping. You likely will not need nativization because performance-critical systems (combat loop, pathfinding, AI scoring) should already be in C++. Use Blueprints for the zoom transition Timeline, camera blending, and UI logic where visual scripting is faster to iterate.
- **Wizard's Chess**: The minimax AI should be C++ (recursive tree search is not suited to Blueprint graphs). Piece movement animations, board highlighting, and UI can stay in Blueprints. Again, nativization is unnecessary if the hot path (AI search) is already C++.

---
