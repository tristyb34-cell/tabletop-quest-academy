# Module 01: Quiz

Test your knowledge of Unreal Engine 5 basics. Try to answer each question before checking the answer key at the bottom.

---

### Question 1 (Multiple Choice)

Which editor panel shows a list of every actor currently in your level?

A) Content Browser
B) Details Panel
C) World Outliner
D) Modes Panel

---

### Question 2 (Multiple Choice)

What keyboard shortcut activates the Rotate tool in the viewport?

A) W
B) E
C) R
D) T

---

### Question 3 (Short Answer)

You are flying through the viewport using right-click + WASD, but you are moving too slowly to cross a large landscape. How do you increase your movement speed without releasing the mouse button?

---

### Question 4 (Multiple Choice)

What does the Content Browser contain?

A) A list of every actor placed in the current level
B) All assets in your project, such as meshes, textures, materials, and Blueprints
C) The properties and settings of the currently selected actor
D) Tools for sculpting terrain and placing foliage

---

### Question 5 (Short Answer)

Explain the difference between a Directional Light and a Sky Light. When would you use each one?

---

### Question 6 (Multiple Choice)

What does pressing the F key do when you have an actor selected in the viewport?

A) Deletes the selected actor
B) Focuses the camera on the selected actor
C) Toggles fullscreen mode
D) Freezes the actor in place

---

### Question 7 (Short Answer)

You packaged your project, but when you run the executable it opens to a black screen. What is the most likely cause, and how do you fix it?

---

### Question 8 (Multiple Choice)

In UE5, what is "Lumen"?

A) A tool for creating landscape terrain
B) The real-time global illumination and reflection system
C) A type of material shader
D) The Blueprint compilation system

---

### Question 9 (Short Answer)

What is the difference between a "level" and the "Content Browser"? In other words, why are they not the same thing?

---

### Question 10 (Multiple Choice)

Which of the following is NOT a standard sculpting operation in the Landscape tool?

A) Sculpt (raise/lower terrain)
B) Smooth
C) Flatten
D) Extrude

---

## Answer Key

**Question 1**: C) World Outliner. The outliner lists all actors in the current level. The Content Browser shows project assets, not placed actors.

**Question 2**: B) E. The three transform shortcuts are W (translate/move), E (rotate), and R (scale).

**Question 3**: Scroll the mouse wheel while holding right-click. This adjusts the camera movement speed without interrupting your fly-through navigation.

**Question 4**: B) All assets in your project. The Content Browser is your project's file manager for meshes, textures, Blueprints, and every other type of asset.

**Question 5**: A Directional Light simulates the sun. It casts parallel light rays across the entire level and is used for primary outdoor illumination. A Sky Light captures ambient light from the sky (and surroundings) and provides soft, indirect fill lighting so that shadowed areas are not completely black. You typically use both together in an outdoor scene: the directional light for the main sun, and the sky light for ambient fill.

**Question 6**: B) Focuses the camera on the selected actor. This centers the viewport on the object, which is very helpful for finding and inspecting specific actors.

**Question 7**: The most likely cause is that the "Game Default Map" is not set in Project Settings. Go to Edit > Project Settings > Maps & Modes and set the "Game Default Map" to your main level. Then re-package.

**Question 8**: B) The real-time global illumination and reflection system. Lumen simulates realistic light bouncing and reflections without needing to bake lightmaps.

**Question 9**: A level (also called a map) is a specific scene or world that contains placed actors, lighting, and gameplay logic. The Content Browser is a file manager that holds all the raw assets (meshes, textures, Blueprints, sounds) in your entire project. Assets in the Content Browser can be used across multiple levels. A level references assets from the Content Browser, but the Content Browser itself is not a level.

**Question 10**: D) Extrude. The Landscape tool includes Sculpt, Smooth, Flatten, Erosion, Noise, and other terrain operations, but "Extrude" is a 3D modeling term, not a landscape sculpting operation.
