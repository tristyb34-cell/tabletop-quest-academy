# Module 01: Quiz

Test your understanding of what you learned in this module. Try to answer each question before checking the answer key at the bottom.

---

### Question 1 (Multiple Choice)

In Unreal Engine, what is an "Actor"?

A) A 3D character model with animations
B) Any object that exists in a level, whether visible or invisible
C) A type of Blueprint script
D) A special lighting component

---

### Question 2 (Short Answer)

You are flying through the viewport using right-click + WASD, but you are moving too slowly. How do you speed up without releasing the mouse?

---

### Question 3 (Multiple Choice)

What does the Python console in UE5 allow you to do?

A) Write gameplay code that runs during the game
B) Automate editor tasks like creating and placing Actors
C) Compile C++ source files
D) Connect to online multiplayer servers

---

### Question 4 (Short Answer)

You want to place a mesh from a downloaded asset pack using Python. How do you find the correct asset path to use in your script?

---

### Question 5 (Multiple Choice)

Which panel in the editor shows the position, rotation, scale, and other properties of a selected Actor?

A) World Outliner
B) Content Browser
C) Details Panel
D) Output Log

---

## Answer Key

**Question 1**: B) Any object that exists in a level, whether visible or invisible. Actors include meshes, lights, cameras, trigger volumes, and more. Think of them as chess pieces on a board: every piece is an Actor regardless of its role.

**Question 2**: Scroll the mouse wheel while holding right-click. This adjusts the camera flight speed without interrupting your navigation.

**Question 3**: B) Automate editor tasks like creating and placing Actors. The Python console runs scripts in the editor environment, letting you spawn Actors, modify properties, and automate repetitive tasks. It does not run during gameplay.

**Question 4**: Right-click the asset in the Content Browser and select "Copy Reference." This copies the full path (like `/Game/AssetPack/Meshes/SM_Table`) that you can paste directly into your Python script.

**Question 5**: C) Details Panel. When you select any Actor, the Details Panel shows all of its properties. The World Outliner lists Actors by name, and the Content Browser shows project assets, but the Details Panel is where you inspect and edit an individual Actor's settings.
