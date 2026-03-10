# Module 05: Quiz

Test your understanding of materials, lighting, and rendering. Try to answer each question before checking the answer key at the bottom.

---

### Question 1 (Multiple Choice)

Which material property fakes surface detail (bumps, cracks, grooves) without adding actual geometry to the mesh?

A) Base Colour
B) Roughness
C) Metallic
D) Normal Map

---

### Question 2 (Short Answer)

What is the difference between a Material and a Material Instance? When would you use a Material Instance instead of creating a new Material?

---

### Question 3 (Multiple Choice)

What does Lumen do in UE5?

A) It measures the brightness of lights in the scene
B) It simulates realistic light bouncing, so light reflects off surfaces and illuminates nearby objects
C) It converts 2D textures into 3D models
D) It compresses textures to reduce file size

---

### Question 4 (Short Answer)

You want to create a moody dungeon atmosphere. Name three post-processing settings you would adjust and explain what each one does.

---

### Question 5 (Multiple Choice)

What does enabling Volumetric Fog do in combination with Point Lights?

A) It makes the fog disappear near light sources
B) It makes light beams visible as they pass through the fog
C) It changes the colour of the fog to match the light colour
D) It doubles the rendering performance

---

## Answer Key

**Question 1**: D) Normal Map. A normal map is a texture that tells the engine how to bend light at each pixel, creating the illusion of surface detail on a flat mesh. It is the difference between a smooth grey wall and one that looks like it has real stone blocks with mortar lines.

**Question 2**: A Material is the master shader that defines how a surface renders (the logic, nodes, and calculations). A Material Instance is a copy with adjustable parameters (colour tint, roughness value, normal intensity) that you can tweak without editing the master. Use a Material Instance when you want variations of the same look, like "mossy stone," "dry stone," and "cracked stone" all from one stone master material. This saves time and keeps your project organised.

**Question 3**: B) It simulates realistic light bouncing. With Lumen, a torch near an orange wall casts a warm orange glow on the nearby floor. Light does not just hit surfaces and stop; it bounces and colours the environment realistically. This happens in real time without baking lightmaps.

**Question 4**: Three useful post-processing settings for a dungeon:
- **Bloom** (Intensity ~0.5): Adds a soft glow around bright light sources like torches, making them feel warm and slightly ethereal.
- **Colour Grading / Shadows Tint** (shift toward blue): Tints the dark areas of the scene with a cool blue, creating contrast with the warm torch lights and making shadows feel cold and ominous.
- **Vignette** (Intensity ~0.4): Darkens the edges of the screen, drawing the player's eye toward the centre and creating a subtle sense of enclosure.

Other valid answers include Exposure (controlling overall brightness), Saturation (muting colours for a gritty feel), and Depth of Field (blurring distant objects).

**Question 5**: B) It makes light beams visible as they pass through the fog. Volumetric fog interacts with light sources to create visible rays, shafts, and pools of light. In a dungeon, this means torch light cuts through the haze in visible beams, which is one of the most atmospheric visual effects you can add.
