# Module 02: Exercises

## Exercise 1: Print a Message on BeginPlay

**Goal**: Create your first Blueprint and verify it works by printing a message when the game starts.

### Steps

1. In the Content Browser, right-click and select Blueprint Class > Actor.
2. Name it `BP_HelloWorld`.
3. Double-click to open the Blueprint Editor.
4. In the Event Graph, you should see a red "Event BeginPlay" node.
5. Drag a wire from the BeginPlay execution pin (white arrow on the right).
6. Search for "Print String" and add that node.
7. In the Print String node, change the text to `Hello, Unreal World!`.
8. Compile and Save the Blueprint.
9. Drag `BP_HelloWorld` from the Content Browser into your level.
10. Press Play (Alt + P). Look at the top-left corner of the viewport for the printed text.

### Success Criteria

- "Hello, Unreal World!" appears on screen when you press Play.
- The message only appears once (because BeginPlay fires once).

### Bonus

- Add a second Print String node chained after the first one that prints `BeginPlay complete.`
- Create a Float variable called `StartTime`, set it using the "Get Game Time in Seconds" node on BeginPlay, and print that value as part of your message.

---

## Exercise 2: Automatic Door with Trigger

**Goal**: Build a door that opens when the player walks near it and closes when the player walks away.

### Steps

1. Create a new Actor Blueprint called `BP_AutoDoor`.
2. In the Components panel, add:
   - A **Static Mesh** component (use a cube, scaled to look like a door: X=0.1, Y=1, Z=2).
   - A **Box Collision** component (scale it larger than the door to act as the trigger zone).
3. In the Event Graph:
   - Add an "On Component Begin Overlap" event for the Box Collision.
   - Add an "On Component End Overlap" event for the Box Collision.
4. For the Begin Overlap event:
   - Use a **Cast To** node to verify the overlapping actor is your player character class (e.g., Cast to ThirdPersonCharacter or your character class).
   - If the cast succeeds, add a **Timeline** node that interpolates a float from 0 to 1 over 0.5 seconds.
   - Use the Timeline's output to **Lerp** the door's Z location from its closed position to an open position (e.g., 200 units higher).
   - Connect the Lerp result to a **Set Relative Location** node on the door mesh.
5. For the End Overlap event:
   - Play the Timeline in reverse to close the door.
6. Place `BP_AutoDoor` in your level, adjust the trigger size, and test it.

### Success Criteria

- The door slides open smoothly when you walk into the trigger area.
- The door slides closed smoothly when you leave the trigger area.
- Walking through the trigger quickly and returning does not break the animation.

### Hints

- In the Timeline editor, create a float track with two keyframes: (Time=0, Value=0) and (Time=0.5, Value=1).
- Use "Play from Start" for opening and "Reverse from End" for closing.

---

## Exercise 3: Health System

**Goal**: Create a player health system with variables, functions, and UI feedback.

### Steps

1. Open your player character Blueprint (or create a new Actor Blueprint called `BP_HealthTest`).
2. Create three variables:
   - `MaxHealth` (Float, default 100.0)
   - `CurrentHealth` (Float, default 100.0)
   - `IsAlive` (Boolean, default True)
3. Create a function called `TakeDamage_Custom` with one input: `DamageAmount` (Float).
   - Inside the function: subtract `DamageAmount` from `CurrentHealth`.
   - Clamp the result between 0 and `MaxHealth` using a **Clamp** node.
   - Set `CurrentHealth` to the clamped value.
   - Use a **Branch** node: if `CurrentHealth` <= 0, set `IsAlive` to False and call a **Print String** saying `Player has died!`
   - Otherwise, print the current health value.
4. Create a function called `Heal` with one input: `HealAmount` (Float).
   - Add `HealAmount` to `CurrentHealth`, clamp to MaxHealth, and set it.
   - Print the new health value.
5. On BeginPlay, call `TakeDamage_Custom` with a value of 30 to test it. Then call it again with 80 to trigger death.

### Success Criteria

- After taking 30 damage, the printed health shows 70.
- After taking another 80 damage, health shows 0 and "Player has died!" prints.
- Health never goes below 0 or above MaxHealth.

### Bonus

- Add a `Respawn` function that resets `CurrentHealth` to `MaxHealth` and sets `IsAlive` back to True.
- Create a damage zone Blueprint (a trigger volume) that calls your health system's `TakeDamage_Custom` when the player overlaps it.

---

## Exercise 4: Simple Patrol AI

**Goal**: Create an actor that patrols between waypoints using an array and a timer.

### Steps

1. Create a new Actor Blueprint called `BP_PatrolGuard`.
2. Add a Static Mesh component (a cube or cone to represent the guard).
3. Create the following variables:
   - `PatrolPoints` (Array of Vectors)
   - `CurrentPatrolIndex` (Integer, default 0)
   - `PatrolSpeed` (Float, default 200.0)
4. On BeginPlay:
   - Populate the `PatrolPoints` array with 3-4 world locations using "Add" nodes (or make the array Instance Editable and set values in the level).
5. On Tick:
   - Get the current target point from the array using `CurrentPatrolIndex`.
   - Calculate the direction from the guard's current location to the target point.
   - Move the guard toward the target using "Add Actor World Offset" (direction * speed * delta time).
   - Check the distance to the target. If it is less than 50 units, increment `CurrentPatrolIndex`.
   - If `CurrentPatrolIndex` exceeds the array length, reset it to 0 (this creates a loop).
6. Place the Blueprint in the level and set the patrol point values.

### Success Criteria

- The guard moves between the patrol points in order.
- When it reaches the last point, it loops back to the first.
- Movement is smooth and frame-rate independent (because you multiply by Delta Time).

### Bonus

- Replace the Tick-based movement with a **Timeline** and Lerp for smoother interpolation.
- Add a "pause" at each waypoint using a **Delay** node (you will need to restructure the logic since Delay does not work on Tick).
- Make the guard rotate to face the direction of movement using "Find Look at Rotation."

---

## Exercise 5: Item Pickup with Inventory

**Goal**: Create collectible items that add themselves to a simple inventory system when the player touches them.

### Steps

1. Create a **Blueprint Interface** called `BPI_Collectable`.
   - Add one function: `Collect` with an input parameter `Collector` of type Actor.

2. Create an Actor Blueprint called `BP_PickupItem`.
   - Add a Static Mesh (sphere for a health potion, cube for ammo, etc.).
   - Add a Sphere Collision component as a trigger.
   - Implement the `BPI_Collectable` interface.
   - In the `Collect` event: play a sound, destroy the actor.
   - Create a variable `ItemName` (String) and `ItemValue` (Integer). Make both Instance Editable.

3. In your Player Character Blueprint:
   - Create a variable `Inventory` (Array of Strings).
   - On overlap with any actor, check if that actor implements `BPI_Collectable` using "Does Implement Interface."
   - If it does, call the `Collect` function via the interface and add the item's name to the `Inventory` array.
   - Print the full inventory array to screen.

4. Place several `BP_PickupItem` instances in the level with different names: "Health Potion," "Iron Sword," "Gold Coin."

### Success Criteria

- Walking over an item adds its name to the inventory array.
- The item disappears after collection.
- The printed inventory correctly shows all collected items.
- Items that do not implement the interface are ignored (no errors).

### Bonus

- Add a "Drop Item" function that removes the last item from the inventory and spawns a new pickup at the player's location.
- Create different item subclasses (BP_HealthPotion, BP_Weapon) that inherit from BP_PickupItem and override the `Collect` event with unique behavior (heal the player, equip a weapon).
