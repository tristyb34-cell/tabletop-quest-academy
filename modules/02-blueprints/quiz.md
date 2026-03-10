# Module 02: Quiz

Ten questions testing your understanding of Blueprints. Try to answer each question before scrolling down to the answer key.

---

### Question 1 (Multiple Choice)

What is a Blueprint in Unreal Engine?

A) A 2D architectural drawing exported from the level editor
B) A visual scripting system where you connect nodes to create game logic
C) A type of 3D model file format used for static meshes
D) A pre-made game template downloaded from the Epic Games Marketplace

---

### Question 2 (Short Answer)

You have a treasure chest Blueprint with a variable called `GoldAmount`. You want each chest instance in the level to contain a different amount of gold (some have 10, some have 50, some have 100), without creating three separate Blueprint classes. How do you accomplish this?

---

### Question 3 (Multiple Choice)

You need to set the player's starting health to 100 when the game begins. This should happen exactly once. Which event should you use?

A) Event Tick
B) Event BeginPlay
C) On Component Begin Overlap
D) Construction Script

---

### Question 4 (Short Answer)

Explain the difference between the Event Graph and the Construction Script. When does each one run, and give one example of what you would use each for in Tabletop Quest.

---

### Question 5 (Multiple Choice)

What does a **Cast To** node do?

A) Creates a new instance of the specified class
B) Converts a 3D mesh into a 2D sprite
C) Checks if a generic Actor reference is a specific class, and if so, gives you access to that class's variables and functions
D) Sends a message to all Actors in the level

---

### Question 6 (Short Answer)

You built a pressure plate that opens a gate. Currently, the gate responds to anything entering the trigger zone, including falling debris and rolling barrels. You want ONLY the player character to activate the plate. What Blueprint technique would you add, and where would you put it?

---

### Question 7 (Multiple Choice)

Which of the following is a valid reason to use Event Tick?

A) Checking whether a door has been opened (one-time check)
B) Giving the player gold when they open a chest
C) Smoothly rotating a floating crystal every frame
D) Spawning 10 enemies at the start of a combat encounter

---

### Question 8 (Short Answer)

You are designing Tabletop Quest's interaction system. You want the player to be able to interact with treasure chests, wall torches, levers, NPCs, and shop counters, all using the same E key press. Each object type responds differently (chests give gold, torches toggle, NPCs speak, etc.). You have two options:

**Option A**: In the player character, add a Cast To node for every interactable type (Cast To BP_TreasureChest, Cast To BP_WallTorch, Cast To BP_Lever, etc.).

**Option B**: Create a Blueprint Interface called BPI_Interactable with an Interact function, and have each interactable implement it.

Which option is better for a growing game, and why? What is the main problem with the other option?

---

### Question 9 (Multiple Choice)

You create a Timeline with a Float track that goes from 0 to 1 over 2 seconds. You use this value as the Alpha input for a Lerp (Vector) node, where A is (0, 0, 0) and B is (0, 0, 300). What happens when the Timeline plays?

A) The output instantly jumps to (0, 0, 300)
B) The output smoothly interpolates from (0, 0, 0) to (0, 0, 300) over 2 seconds
C) The output stays at (0, 0, 0) because Timelines only affect rotations
D) The output oscillates between (0, 0, 0) and (0, 0, 300) repeatedly

---

### Question 10 (Short Answer)

You have a `BPC_Health` Actor Component with a `TakeDamage` function and an `OnDied` Event Dispatcher. Explain how a fire pit Blueprint would use this component to damage the player, and how a UI widget would use the Event Dispatcher to show a "Game Over" screen. Describe the flow for each.

---

## Answer Key

**Question 1**: **B) A visual scripting system where you connect nodes to create game logic.** Blueprints use a node-and-wire interface similar to a flowchart. Each node performs an action (get a variable, play a sound, move an object), and wires define the order of execution (white wires) and data flow (coloured wires).

---

**Question 2**: Mark the `GoldAmount` variable as **Instance Editable** (click the eye icon next to the variable in the My Blueprint panel, or check "Instance Editable" in the Details Panel). This exposes the variable in the level editor's Details Panel when you select a specific chest instance. You can then set 10, 50, or 100 on each individual chest without creating separate Blueprint classes. One Blueprint, many configurations.

---

**Question 3**: **B) Event BeginPlay.** This event fires exactly once when the Actor first appears in the game world. Event Tick fires every frame (far too often). Overlap events depend on player movement. Construction Script runs in the editor, not during gameplay.

---

**Question 4**: The **Event Graph** runs during gameplay. It responds to runtime events like player input, overlap triggers, and timers. Example: opening a dungeon door when the player walks near it.

The **Construction Script** runs in the editor whenever the Actor is moved, rotated, or has a property changed. It sets up the Actor's visual appearance before the game even starts. Example: a `BP_DungeonWall` that spawns a configurable number of wall segments based on a `WallLength` variable, letting you preview the wall layout in the editor without pressing Play.

The key distinction: Construction Script is for editor-time setup and previewing. Event Graph is for runtime gameplay logic.

---

**Question 5**: **C) Checks if a generic Actor reference is a specific class, and if so, gives you access to that class's variables and functions.** When an overlap event gives you an "Other Actor" reference, it could be anything. Casting checks "is this Actor actually a ThirdPersonCharacter?" If yes (success path), you get a typed reference with access to that class's Health, Gold, and other specific variables. If no (fail path), the Actor is something else and you handle it differently (or do nothing).

---

**Question 6**: Add a **Cast To** node targeting your player character class, placed immediately after the On Begin Overlap event. Connect the "Other Actor" output from the overlap event into the Cast To node's input. Only continue to the gate-opening logic on the **Success** (valid cast) path. On the **Fail** path, do nothing. Now when debris or barrels enter the zone, the cast fails and the gate stays shut. Only the player character passes the cast check.

---

**Question 7**: **C) Smoothly rotating a floating crystal every frame.** Tick is appropriate for continuous, per-frame visual updates like rotation, bobbing, and light flicker. Options A and B are one-time events (use overlap or input events). Option D is a one-time spawn (use BeginPlay or a custom event). The rule: if it does not need to happen every single frame, do not put it on Tick.

---

**Question 8**: **Option B (Blueprint Interface) is better for a growing game.**

With Option A (multiple casts), every time you add a new interactable type, you must modify the player character Blueprint to add another Cast To node. If you have 20 interactable types, that is 20 cast checks running in sequence. The player character becomes tightly coupled to every interactable class, creating a maintenance burden that grows with every new object type.

With Option B (interface), the player character simply sends the "Interact" message to whatever it is looking at. If the target implements BPI_Interactable, it responds. If not, nothing happens. Adding a new interactable type (say, a cauldron) means implementing the interface on that one new Blueprint. The player character code never changes. This is the Open/Closed Principle in action: open for extension (new interactable types), closed for modification (player character stays the same).

The main problem with Option A is **scalability and coupling**. It creates a growing chain of dependencies that becomes increasingly fragile and hard to manage.

---

**Question 9**: **B) The output smoothly interpolates from (0, 0, 0) to (0, 0, 300) over 2 seconds.** The Timeline outputs a float that goes from 0 to 1 over 2 seconds. Lerp takes a start value (A), an end value (B), and an alpha (0 to 1). At alpha 0, the output equals A. At alpha 1, the output equals B. As the Timeline plays, the alpha smoothly increases, and the Lerp output smoothly moves from A to B. If connected to a Set Relative Location node on a mesh, the mesh rises 300 units upward over 2 seconds.

---

**Question 10**:

**Fire pit damaging the player:**
1. The fire pit's On Begin Overlap event fires when the player enters the zone.
2. Cast the Other Actor to the player character class to verify it is the player.
3. On the player character, use **Get Component by Class** to find the `BPC_Health` component.
4. Start a looping timer (Set Timer by Function Name) that calls a `DealDamage` function every 0.5 seconds.
5. In `DealDamage`, call the BPC_Health component's `TakeDamage` function with a damage amount (e.g., 10).
6. On End Overlap, clear the timer so damage stops.

**UI showing "Game Over":**
1. The UI widget gets a reference to the player character (using Get Player Character or similar).
2. It gets the player's BPC_Health component.
3. It calls **Bind Event to OnDied** on the component, binding a custom event in the UI widget.
4. When BPC_Health's TakeDamage reduces health to 0, the component calls its OnDied dispatcher.
5. The UI widget's bound event fires, displaying the "Game Over" screen.

The beauty of this design: the fire pit does not know about the UI, and the UI does not know about the fire pit. They both communicate through the health component. You could add 10 different damage sources and 5 different UI reactions without any of them needing to know about each other.
