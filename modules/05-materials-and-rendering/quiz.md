# Module 05: Quiz - Making It Beautiful

Test your understanding of materials, Lumen lighting, Nanite, and post-processing in Tabletop Quest. Try to answer each question before checking the answer key at the bottom.

---

### Question 1 (Multiple Choice)

In PBR materials, what does the Metallic channel control?

A) How shiny or reflective the surface appears
B) Whether the surface reflects light using its base colour (metal) or reflects white light (non-metal)
C) The physical hardness of the material for collision purposes
D) How much the surface absorbs incoming light

---

### Question 2 (Short Answer)

A dungeon stone wall should have a Roughness value of approximately 0.75. What would happen visually if you accidentally set Roughness to 0.1 instead?

---

### Question 3 (Multiple Choice)

Why does Lumen matter for the Tabletop Quest tavern scene?

A) Lumen makes textures load faster
B) Lumen simulates light bouncing off surfaces, so a single fireplace and a few lanterns naturally fill the room with warm, indirect light without needing dozens of fill lights
C) Lumen is required for PBR materials to work correctly
D) Lumen reduces the number of draw calls in the scene

---

### Question 4 (Short Answer)

You are building the dungeon. Between two torch-lit areas, the corridor is very dark. A tester says "I cannot see anything, add more lights." Explain why you should NOT add fill lights, and what alternative approach would be better.

---

### Question 5 (Multiple Choice)

What is the advantage of Material Instances over duplicating a material?

A) Material Instances render faster because they use fewer GPU threads
B) Material Instances let you create visual variations (different roughness, tint, scale) without creating a new shader, and changes to the parent material propagate to all instances
C) Material Instances support higher-resolution textures
D) Material Instances are required for Nanite-enabled meshes

---

### Question 6 (Short Answer)

For the tabletop zoom transition, you need the character to morph from a "painted miniature" look to a "realistic character" look. Describe the material technique you would use, including the specific node and the parameter that drives the transition.

---

### Question 7 (Multiple Choice)

Which types of meshes can use Nanite in UE5.7?

A) All mesh types including skeletal meshes, static meshes, and particle meshes
B) Only static meshes (not skeletal meshes, translucent meshes, or meshes with vertex animation)
C) Only meshes imported from Megascans
D) Only meshes with fewer than 1 million polygons

---

### Question 8 (Short Answer)

You have three environments in Tabletop Quest: the warm tavern, the cold dungeon, and the vibrant overworld. How do you make each feel visually distinct using post-processing? Name at least 3 settings you would change between environments.

---

### Question 9 (Multiple Choice)

What is Volumetric Fog and why is it useful in Tabletop Quest?

A) A special fog that only affects volumetric meshes like cubes and spheres
B) A fog system that creates visible light shafts, dust-in-air effects, and atmospheric haze that interacts with light sources
C) A fog that replaces the sky atmosphere for indoor scenes
D) A performance optimization that reduces the rendering cost of transparent materials

---

### Question 10 (Short Answer)

A Megascans stone wall material looks good in isolation, but when applied to your dungeon, it feels too clean and new. Describe three specific modifications you would make to the material to make it feel old, used, and dungeon-appropriate.

---

## Answer Key

### Answer 1: B

The Metallic channel determines how the surface reflects light. Metals (Metallic = 1.0) tint their reflections with their base colour. Gold reflects golden light, copper reflects warm orange. Non-metals (Metallic = 0.0) reflect white light regardless of their base colour. This is a fundamental physical property that PBR renderers need to produce correct-looking materials. Roughness, not Metallic, controls shininess.

### Answer 2

The stone wall would look like polished marble or glass. A Roughness of 0.1 means the surface is nearly mirror-smooth, so it would produce sharp, clear reflections of its surroundings. You would see reflected torchlight, the floor, and even the player character in the wall. Ancient dungeon stone should scatter light diffusely (rough surface, blurry/no reflections), not reflect it sharply. The effect would feel completely wrong for the environment.

### Answer 3: B

Lumen simulates global illumination (light bouncing between surfaces). In the tavern, a single fireplace sends light to the floor, which bounces warm tones under the tables, which bounce up to the ceiling. Lanterns hit the walls, which fill the room with soft ambient light. Without Lumen, you would need to manually place dozens of invisible fill lights to achieve the same effect, and they would not react naturally when you move or change the primary lights. Lumen makes the tavern feel naturally warm and cozy with just the physical light sources.

### Answer 4

Darkness is a feature, not a bug. The dungeon should feel dangerous, and contrast between lit and dark areas creates tension. Fill lights would flatten the scene and remove the atmosphere entirely.

Better alternatives:
- Let Lumen's indirect bounces provide subtle visibility in dark areas (not pitch black, just dark)
- Give the player a light source (torch, Mage's staff glow) that moves with them, dynamically illuminating new areas as they explore
- Adjust the Post Process Volume's Auto Exposure settings to allow the camera to adapt to darkness (Min EV100 = -2), simulating the player's eyes adjusting
- Add occasional faint emissive details (glowing mushrooms, magical runes, distant torches) as navigation aids without brightening the space

### Answer 5: B

Material Instances inherit from a parent material and allow you to override specific parameters (roughness, tint, texture, UV scale) without creating a new shader program. This means:
1. No extra shader compilation cost (the GPU runs the same shader)
2. Changes to the parent material (like adding a damage overlay) automatically update all instances
3. You can create dozens of variations (dry stone, wet stone, mossy stone) from one parent

Duplicating a material creates a completely separate shader. Each copy compiles independently, changes do not propagate, and you end up maintaining many nearly-identical materials.

### Answer 6

Use a **Lerp** (Linear Interpolate) node in the Material Editor. The Lerp blends between two inputs based on an alpha value:

- **Input A**: The "painted miniature" textures (matte, slightly desaturated, simplified normal map)
- **Input B**: The "realistic character" textures (full PBR detail, vivid colour, detailed normal map)
- **Alpha**: A **Scalar Parameter** called "TransitionAlpha" (range 0.0 to 1.0)

Apply Lerp to Base Colour, Roughness, and Normal Map. The zoom Blueprint drives TransitionAlpha from 0.0 to 1.0 over 2-3 seconds using a Timeline. At 0.0, the character looks painted. At 1.0, fully realistic. Everything between is a smooth blend.

### Answer 7: B

Nanite (as of UE5.7) only supports static meshes. It does not work with:
- Skeletal meshes (animated characters, enemies)
- Meshes using translucent materials (glass, water, magic effects)
- Meshes using World Position Offset (foliage swaying in wind)

For Tabletop Quest, use Nanite on all environment geometry (walls, floors, rocks, furniture, props) and use traditional meshes with LODs for characters, foliage, and VFX.

### Answer 8

Three or more settings to vary between environments:

1. **Colour Temperature**: Tavern = warm (+15), Dungeon = cool (-15), Overworld = neutral (0)
2. **Bloom Intensity**: Tavern = 1.2 (warm glow), Dungeon = 0.6 (subdued), Overworld = 0.8 (standard)
3. **Vignette**: Tavern = 0.5, Dungeon = 0.7 (claustrophobic), Overworld = 0.3 (open)
4. **Saturation**: Tavern = 1.0 (normal), Dungeon = 0.85 (desaturated, grim), Overworld = 1.15 (vivid)
5. **Ambient Occlusion**: Tavern = 0.7, Dungeon = 0.9 (deeper crevice shadows), Overworld = 0.5

Each environment uses a bounded Post Process Volume with these settings. Walking between areas blends the post-processing smoothly, creating a clear shift in visual mood.

### Answer 9: B

Volumetric Fog simulates light scattering through particles suspended in air (dust, moisture, smoke). When combined with light sources, it creates visible light shafts (god rays), atmospheric haze, and the sense of a physical atmosphere in the scene.

For Tabletop Quest:
- **Tavern**: Dusty air catches the fireplace light, creating warm shafts. Feels lived-in and cozy.
- **Dungeon**: Thin mist catches torchlight, creating eerie light beams in corridors. Adds mystery.
- **Overworld**: Morning haze creates sun shafts through trees. Feels epic and atmospheric.

### Answer 10

Three modifications to make the stone wall feel old and dungeon-appropriate:

1. **Darken the base colour**: Multiply by 0.6-0.7. Old dungeon stone has absorbed centuries of soot, moisture, and grime. Megascans materials are often scanned from relatively clean samples.

2. **Add moss blending**: Use a Lerp with a world-aligned mask to blend a green-tinted version onto upward-facing surfaces. Moss grows where water collects, which is primarily on horizontal surfaces and the tops of ledges.

3. **Add wetness variation**: Create a "Wetness" parameter that reduces roughness (making surfaces shinier, simulating water film) and darkens the base colour slightly. Apply this selectively to lower portions of walls (water runs downward) using a height-based mask or vertex colour painting. Wet stone catches torchlight as specular highlights, adding visual interest.

Additional options: add cracks (normal map overlay), edge wear (roughness variation at UV seams), or subtle discolouration (colour noise at large scale so some stones are slightly warmer or cooler than their neighbours).
