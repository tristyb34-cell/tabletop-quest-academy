# Module 02: Quiz

Test your knowledge of Unreal Engine 5 Blueprints. Try to answer each question before checking the answer key at the bottom.

---

### Question 1 (Multiple Choice)

What color are execution pins in a Blueprint graph?

A) Green
B) Blue
C) White
D) Yellow

---

### Question 2 (Short Answer)

Explain the difference between BeginPlay and Tick. When should you use each one?

---

### Question 3 (Multiple Choice)

You want to create a door Blueprint that can be placed in multiple levels, with each instance opening at a different speed. What should you use?

A) A Level Blueprint with the door logic
B) A Blueprint class with an Instance Editable variable for speed
C) A separate Level Blueprint for each level
D) Hard-code the speed in a function

---

### Question 4 (Short Answer)

What is casting, and why is it necessary? Give an example of when you would use a Cast To node.

---

### Question 5 (Multiple Choice)

Which of these is NOT a valid method of Blueprint communication?

A) Direct reference
B) Blueprint Interface
C) Event Dispatcher
D) Blueprint Inheritance Wire

---

### Question 6 (Short Answer)

You have an array of enemy actors called `EnemyList`. You want to deal 10 damage to every enemy in the list. Which loop node would you use, and why?

---

### Question 7 (Multiple Choice)

A float variable pin in Blueprints is what color?

A) Red
B) Cyan (light blue)
C) Light green
D) Magenta (pink)

---

### Question 8 (Short Answer)

What is the difference between a Blueprint class and a Level Blueprint? Give one scenario where each is the better choice.

---

### Question 9 (Multiple Choice)

You want multiple different objects (doors, chests, levers) to all respond to the same "Interact" action, but each should behave differently. What is the best approach?

A) Use a Cast To node for each type
B) Use a Blueprint Interface with an `Interact` function
C) Put all the logic in the Level Blueprint
D) Use Tick to check for nearby interactive objects

---

### Question 10 (Short Answer)

Explain what an Event Dispatcher is and describe a real gameplay scenario where you would use one instead of a direct reference.

---

## Answer Key

**Question 1**: C) White. Execution pins are white. Data pins are colored based on their type (green for Boolean, light blue for Integer, light green for Float, etc.).

**Question 2**: BeginPlay fires once when the actor first appears in the world (at game start or when spawned). Use it for initialization: setting starting values, playing intro effects, registering with other systems. Tick fires every single frame (60 times per second at 60 FPS). Use it for continuous updates: smooth movement, real-time distance checks, ongoing animations. Tick is expensive, so prefer timers, events, or other triggers over Tick when possible.

**Question 3**: B) A Blueprint class with an Instance Editable variable for speed. Blueprint classes are reusable templates. Making the speed variable Instance Editable lets you change it per instance in the Details panel without modifying the Blueprint itself.

**Question 4**: Casting converts a generic reference (like an Actor) into a specific type (like BP_PlayerCharacter) so you can access that type's unique variables and functions. It is necessary because the engine does not know what specific type an actor is at runtime, only what it was declared as. Example: an overlap event returns "Other Actor" as a generic Actor reference. To access the player's health variable, you cast to your player character class. If the cast succeeds, you can read or modify health. If it fails (because the overlapping actor was not the player), you handle that gracefully.

**Question 5**: D) Blueprint Inheritance Wire. This is not a real concept. The three main communication methods are direct references, Blueprint Interfaces, and Event Dispatchers.

**Question 6**: Use a **For Each Loop** node. It automatically iterates through every element in an array, giving you access to each individual element on every iteration. You would connect the "Array Element" output to a "TakeDamage" function call. A For Each Loop is the right choice because you want to perform the same action on every item in a known collection.

**Question 7**: C) Light green. In Blueprints, Float pins are light green. Integer pins are cyan/light blue. Boolean pins are dark red/maroon. String pins are magenta/pink.

**Question 8**: A Blueprint class is a reusable template that can be instanced (placed) multiple times across any level. Use it for anything that needs multiple copies or could be reused: enemies, doors, pickups, projectiles. A Level Blueprint is unique to a specific level and cannot be instanced or reused in other levels. Use it for one-off scripted events tied to a specific map: a cutscene trigger in the intro level, activating a boss fight when the player enters a specific room. Rule of thumb: if it is reusable, make it a Blueprint class. If it is unique to one map, the Level Blueprint is acceptable.

**Question 9**: B) Use a Blueprint Interface with an `Interact` function. Each object implements the interface and defines its own behavior for the `Interact` function. The player does not need to know what type of object it is; it just calls `Interact` on whatever it is looking at. This is far more scalable than casting to every possible type.

**Question 10**: An Event Dispatcher is a broadcast mechanism. One Blueprint declares a dispatcher (like a radio station) and "calls" it when something happens. Other Blueprints "bind" to that dispatcher (like tuning into the station) and run their own logic when it fires. The broadcaster does not need to know who is listening. Scenario: a multiplayer health system where the player's health changes need to update the HUD, trigger camera effects, notify the AI director, and log analytics. Instead of the player character directly referencing all these systems (tight coupling), the player calls a `HealthChanged` dispatcher, and each system binds to it independently. Adding or removing listeners requires no changes to the player Blueprint.
