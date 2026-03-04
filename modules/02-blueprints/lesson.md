# Module 02: Visual Scripting with Blueprints

## Introduction

Blueprints are Unreal Engine's visual scripting system. Instead of writing lines of code in a text editor, you connect nodes on a graph, like building a flowchart that actually runs. If you have ever used Scratch, node-based tools like Blender's shader editor, or even wired up a chain of effects pedals for a guitar, you already understand the core idea.

Think of Blueprints as connecting LEGO blocks of logic. Each block does one thing. You snap them together in a sequence, and the engine follows that sequence when the game runs.

Blueprints are not a "dumbed down" version of programming. They are a full scripting system capable of building entire games. Many shipped titles use Blueprints extensively. The visual format simply makes the logic easier to see and debug.

---

## The Event Graph

Every Blueprint has an Event Graph. This is the main canvas where you build your logic. It is a large, scrollable 2D space where you place nodes and connect them with wires.

Think of the Event Graph as a whiteboard. You can zoom in and out (scroll wheel), pan around (right-click + drag or middle mouse + drag), and organize your nodes into logical groups.

### Opening the Event Graph

1. Double-click any Blueprint asset in the Content Browser.
2. The Blueprint Editor opens. Click the "Event Graph" tab if it is not already selected.
3. You will see a grid with a few default event nodes (usually BeginPlay and Tick).

---

## Nodes and Pins

Nodes are the building blocks of Blueprints. Each node is a box on the graph that performs a specific action: printing text, adding numbers, spawning an actor, playing a sound, checking a condition, and thousands more.

### Anatomy of a Node

Every node has **pins** on its left and right sides. Pins are the connection points where wires attach.

- **Execution pins (white)**: These control the flow of logic. A white pin on the left means "this node runs when triggered." A white pin on the right means "after this node finishes, go here next." You connect white pins to white pins to create a chain of actions. Think of them as dominoes: one triggers the next.

- **Data pins (colored)**: These carry information. Each color represents a data type:
  - **Green** = Boolean (true/false)
  - **Cyan/light blue** = Integer (whole number)
  - **Light green** = Float (decimal number)
  - **Magenta/pink** = String (text)
  - **Gold/yellow** = Vector (X, Y, Z coordinates)
  - **Blue** = Object reference (a pointer to another actor or asset)

### Adding Nodes

Right-click anywhere on the Event Graph to open the context menu. Type the name of the action you want (e.g., "Print String," "Add," "Branch") and select it. The node appears on the graph.

### Connecting Nodes

Click and drag from one pin to another to create a wire. Execution pins connect to execution pins. Data pins connect to compatible data pins. If two pins are incompatible, the engine will not let you connect them (or it will add an automatic conversion node).

---

## Variables and Types

Variables store data that your Blueprint can read and change during gameplay. Think of a variable as a labeled jar: the label is the name, and the contents are the value.

### Creating Variables

1. In the Blueprint Editor, look at the "My Blueprint" panel on the left.
2. Click the "+" button next to "Variables."
3. Give it a name (e.g., `Health`, `PlayerName`, `IsAlive`).
4. Set its type: Boolean, Integer, Float, String, Vector, or a reference to another class.
5. Compile the Blueprint (click the "Compile" button in the toolbar).
6. Set a default value in the Details panel.

### Common Variable Types

| Type | What It Stores | Example |
|------|---------------|---------|
| Boolean | True or false | `IsAlive = true` |
| Integer | Whole numbers | `Score = 42` |
| Float | Decimal numbers | `Speed = 3.5` |
| String | Text | `PlayerName = "Hero"` |
| Vector | 3D coordinates (X, Y, Z) | `SpawnLocation = (0, 0, 100)` |
| Rotator | 3D rotation (Pitch, Yaw, Roll) | `FacingDirection = (0, 90, 0)` |

### Getting and Setting Variables

- **Get**: Drag a variable from the My Blueprint panel into the Event Graph (or hold Ctrl and drag). This creates a "Get" node that reads the current value.
- **Set**: Hold Alt and drag the variable into the graph. This creates a "Set" node that writes a new value.

---

## Functions and Events

### Functions

A function is a reusable group of nodes with a name. Instead of duplicating the same logic in five places, you put it in a function and call that function wherever you need it.

Think of a function like a recipe card. You write the recipe once, then just say "follow the pancake recipe" whenever you want pancakes, instead of writing out every step again.

1. In the My Blueprint panel, click "+" next to "Functions."
2. Name it (e.g., `TakeDamage`, `ResetLevel`, `CalculateScore`).
3. A new graph opens. Build your logic here.
4. Add input and output parameters in the Details panel to pass data in and get results out.
5. Call the function from the Event Graph by dragging it in or searching for it.

### Events

Events are like functions, but they are triggered by the engine or other systems rather than being called directly. They are the starting points of your logic chains.

---

## BeginPlay and Tick

These are the two most fundamental events in any Blueprint.

### BeginPlay

**When it fires**: Once, when the actor first appears in the world (at the start of the game, or when spawned).

**Use it for**: Initialization. Setting starting values, playing an intro animation, registering with a game manager, hiding UI elements until needed.

Think of BeginPlay as the actor walking onto the stage and getting into position before the curtain rises.

### Tick

**When it fires**: Every single frame. If your game runs at 60 FPS, Tick fires 60 times per second.

**Use it for**: Continuous checks and updates. Moving an object smoothly, checking if the player is within range, updating a timer display.

**Warning**: Tick is expensive. Running heavy logic on Tick can tank your frame rate. Use it sparingly. Prefer timers or event-driven logic when possible. Think of Tick as asking "are we there yet?" every fraction of a second. It works, but there are usually better ways.

---

## Blueprint Classes vs Level Blueprints

### Blueprint Classes

A Blueprint class is a reusable template for an actor. You create it once and can place as many copies (instances) in your level as you want. Each instance can have different property values but shares the same logic.

Examples: a door Blueprint, an enemy Blueprint, a pickup item Blueprint, a projectile Blueprint.

Think of a Blueprint class like a cookie cutter. The cutter defines the shape. Each cookie is an instance.

### Level Blueprints

The Level Blueprint is a special Blueprint that belongs to a specific level. It cannot be reused or instanced. It is ideal for one-off scripted events tied to that particular map.

Examples: triggering a cutscene when the player enters an area, opening the exit door after all enemies are defeated, starting background music when the level loads.

**Rule of thumb**: If the logic is specific to one level and will never be reused, put it in the Level Blueprint. If it could be reused across multiple levels or needs multiple instances, create a Blueprint class.

---

## Creating Interactive Objects: Triggers and Overlaps

One of the most common Blueprint patterns is making something happen when the player enters an area. This uses collision events.

### Box Trigger / Trigger Volume

A trigger is an invisible area in your level. When an actor enters or leaves it, events fire.

### Setting Up an Overlap Event

1. Create a new Blueprint class (Actor).
2. Add a **Box Collision** component.
3. In the Event Graph, right-click the Box Collision in the Components panel and select "Add Event > On Component Begin Overlap."
4. This creates an event node that fires whenever another actor enters the box.
5. From the overlap event, you can check what actor entered, play a sound, open a door, deal damage, or anything else.

### Example: Automatic Door

1. Create an Actor Blueprint with a Static Mesh (the door) and a Box Collision (the trigger zone).
2. On Begin Overlap: use a Timeline or Lerp to smoothly move the door upward (or rotate it open).
3. On End Overlap: reverse the Timeline to close the door.

This pattern, trigger zone + overlap event + response, is the foundation of most interactive game objects.

---

## Arrays and Loops

### Arrays

An array is a list of values stored in a single variable. Instead of creating `Weapon1`, `Weapon2`, `Weapon3`, you create one array called `Weapons` that holds all of them.

Think of an array as a numbered list. Item 0 is the first entry, item 1 is the second, and so on (arrays start counting at zero).

### Common Array Operations

- **Add**: Put a new item at the end of the list.
- **Remove**: Take an item out of the list.
- **Get (by index)**: Retrieve the item at a specific position.
- **Length**: How many items are in the array.
- **Contains**: Check if a specific item is in the array.
- **Find**: Get the index of a specific item.

### Loops

Loops let you repeat an action for each item in an array (or a set number of times).

- **For Each Loop**: Runs once for every item in an array. Perfect for "do this to every enemy" or "check every item in the inventory."
- **For Loop**: Runs a set number of times (e.g., from 0 to 9, ten iterations).
- **While Loop**: Runs as long as a condition is true. Be careful with these; if the condition never becomes false, you get an infinite loop that freezes the editor.

---

## Casting

Casting is how you tell the engine "I know this generic Actor is actually a specific type, let me access its specific features."

Here is the analogy: imagine you receive a package labeled "Animal." You cannot ask it to bark, because not all animals bark. But if you "cast" it to "Dog," you can now access all the dog-specific behaviors.

### How Casting Works

1. You have a reference to an actor (e.g., from an overlap event, the "Other Actor" pin).
2. You use a **Cast To** node and specify the target class (e.g., Cast to BP_PlayerCharacter).
3. If the cast succeeds (the actor really is that class), you get access to all its variables and functions.
4. If the cast fails, the "Cast Failed" execution pin fires, and you can handle the failure gracefully.

### When to Use Casting

- An overlap event tells you "something entered the trigger." Casting lets you check if it was the player specifically.
- A damage event gives you the actor that caused damage. Casting lets you access the attacker's specific properties (weapon type, damage multiplier).

### When to Avoid Casting

Casting creates a hard dependency between Blueprints. If Blueprint A casts to Blueprint B, then A depends on B, and the engine must load B whenever A is loaded. For small projects this is fine. For large projects, consider using interfaces instead (covered below).

---

## Blueprint Communication

One of the biggest challenges in Blueprints is getting different actors to talk to each other. There are three main approaches, each suited to different situations.

### Method 1: Direct Reference

The simplest method. One Blueprint holds a variable that is a reference to another specific Blueprint instance.

**How**: Create a variable of type "Actor" (or a specific Blueprint class), make it "Instance Editable" (the eye icon), and in the level, select the instance and assign the reference in the Details panel.

**Good for**: Two specific actors that always need to talk to each other. A lever that opens a specific door. A button that activates a specific light.

**Bad for**: Generic or reusable systems. If you move the door to a different level, you have to re-assign the reference.

### Method 2: Blueprint Interfaces

An interface is a contract that says "any Blueprint that implements this interface promises to have these functions." It does not contain logic itself, just function signatures.

**Analogy**: Think of a wall outlet. Any device with the right plug can connect to it. The outlet does not care if it is a lamp, a phone charger, or a blender. The interface (the plug shape) is what makes them compatible.

**How**:
1. Create a Blueprint Interface asset (right-click in Content Browser > Blueprints > Blueprint Interface).
2. Define functions in the interface (e.g., `Interact`, `TakeDamage`, `Activate`).
3. In any Blueprint that should respond, go to Class Settings > Implemented Interfaces and add your interface.
4. Implement the interface functions in that Blueprint's Event Graph.
5. To call the interface, use "Send Message" or the interface function node on any actor, without needing to know its specific class.

**Good for**: Reusable interaction systems. A generic "Interact" interface that doors, chests, levers, and NPCs all implement differently.

### Method 3: Event Dispatchers

An event dispatcher is a broadcast system. One Blueprint says "something happened!" and any other Blueprint that is listening gets notified.

**Analogy**: Think of a radio station. The station broadcasts a signal. Anyone tuned to that frequency hears it. The station does not need to know who is listening.

**How**:
1. In the broadcasting Blueprint, create an Event Dispatcher (My Blueprint panel > Event Dispatchers > "+").
2. Call the dispatcher when the event occurs (e.g., "PlayerDied," "DoorOpened," "ScoreChanged").
3. In the listening Blueprint, get a reference to the broadcaster and "Bind" to the dispatcher.
4. When the dispatcher fires, the bound event runs in the listener.

**Good for**: One-to-many communication. A player death event that triggers UI updates, enemy celebrations, and a respawn timer simultaneously. Score changes that update multiple UI elements.

---

## Summary

In this lesson you learned:

- Blueprints are visual scripts, flowcharts of logic built by connecting nodes.
- The Event Graph is where you build your logic.
- Nodes have execution pins (white, control flow) and data pins (colored, carry values).
- Variables store data. Functions group reusable logic. Events are triggered by the engine.
- BeginPlay fires once at start. Tick fires every frame (use sparingly).
- Blueprint classes are reusable templates. Level Blueprints are map-specific.
- Triggers and overlaps make interactive objects.
- Arrays store lists of values. Loops iterate over them.
- Casting converts a generic reference to a specific type.
- Communication between Blueprints uses direct references, interfaces, or event dispatchers.

With these tools, you can build almost any game mechanic. In the next module, you will learn C++ in Unreal Engine, which gives you even more power and performance.
