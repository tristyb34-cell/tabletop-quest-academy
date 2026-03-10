# Module 01: Exercises

These three exercises build on each other. Complete them in order.

---

## Exercise 1: Run the Room Script, Then Make It Bigger

**Goal**: Run your first Python script in UE5 and modify it to change the room dimensions.

### Steps

1. Open your TabletopQuest project in UE5.7.
2. Open the Python console (Window > Developer Tools > Output Log, switch dropdown to "Python").
3. Paste the room-creation script from the lesson and run it.
4. Fly around the room using right-click + WASD. Get a feel for the space.
5. Now modify the script. Change the floor scale from `(10, 10, 0.1)` to `(15, 15, 0.1)` and adjust the wall positions to match (move them from 500 to 750 units out). Re-run the script.
6. Delete the old, smaller room Actors from the World Outliner (select them, press Delete).
7. Fly through your new, larger room. Notice how the same light now feels dimmer because the space is bigger.

### Success Criteria

- A room exists in your level, built entirely from a Python script.
- You successfully modified the dimensions and re-ran the script.
- You can identify each Actor (floor, walls, light) in the World Outliner.

### Stretch Goal

Modify the script to create a second, smaller room connected to the first (like a hallway leading to a side chamber). You will need a fifth wall with a doorway gap, or simply two rooms sharing one wall.

---

## Exercise 2: Download and Import a Fantasy Asset Pack

**Goal**: Get free fantasy assets into your project from Fab.

### Steps

1. Open the Epic Games Launcher and navigate to **Fab** (or go to [fab.com](https://www.fab.com/)).
2. Search for a free fantasy or medieval asset pack. Recommended searches:
   - "Infinity Blade" (weapons, characters, effects)
   - "dungeon" or "medieval" (environment props)
   - "fantasy" with the price filter set to "Free"
3. Add the pack to your library and import it into your TabletopQuest project.
4. In the Content Browser, navigate to the imported folder. Browse through the available meshes by double-clicking them to preview.
5. Pick your three favourite assets (a weapon, a piece of furniture, and a decorative prop) and note their Content Browser paths (right-click > Copy Reference).

### Success Criteria

- At least one fantasy asset pack is imported into your project.
- You can find and preview assets in the Content Browser.
- You have the asset paths for three items ready for Exercise 3.

### Stretch Goal

Import a second asset pack from a different category. More variety means more creative options when building your dungeons later.

---

## Exercise 3: Populate Your Room with Python

**Goal**: Use the Python console to place five different objects in your room.

### Steps

1. Open the Python console in UE5.
2. Using the asset paths from Exercise 2, write (or ask Claude to write) a Python script that places 5 objects in your room. Vary their positions so the room feels furnished. For example:
   - A table in the centre
   - A weapon on the table
   - A torch or candelabra near one wall
   - A barrel in the corner
   - A decorative item by the door
3. Run the script. Check the viewport.
4. Some objects might be the wrong size or floating above the floor. Modify the script to adjust their scale and Z position (height) until they look right.
5. Select individual Actors in the World Outliner and check their properties in the Details Panel. Notice how each one has a Location, Rotation, and Scale.

### Success Criteria

- Five distinct objects are placed in the room, all via Python scripts.
- Objects are positioned at floor level (not floating) and scaled appropriately.
- The room looks like it could be the starting area of a dungeon, a study, a tavern back room, or whatever theme you chose.

### Stretch Goal

Add rotation to some objects so they are not all facing the same direction. A barrel turned at an angle, a chair pulled away from a table. Small rotations make a scene feel lived-in rather than grid-aligned.

---

## Reflection

After completing all three exercises, fly through your room in the viewport and think about these questions:

- How does the Python console compare to dragging objects around by hand? When would each approach be useful?
- What did the World Outliner and Details Panel teach you about how UE5 organises its world?
- If you wanted to create 50 rooms like this (say, a procedural dungeon), which approach would scale better: manual placement or Python scripting?
