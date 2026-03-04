# Module 05: Exercises - Materials and Rendering

## Exercise 1: Create a Basic PBR Material

**Objective:** Build a material from scratch using the four core PBR channels, and understand how each channel affects the surface appearance.

**Steps:**

1. Open the Material Editor and create a new material called `M_Stone_Basic`.

2. Set the material's **Shading Model** to Default Lit and **Blend Mode** to Opaque.

3. Add a **Vector Parameter** node called "BaseColor" with a default value of medium grey (0.5, 0.5, 0.5). Connect it to the Base Color input.

4. Add a **Scalar Parameter** node called "Roughness" with a default value of 0.7. Connect it to the Roughness input.

5. Add a **Scalar Parameter** node called "Metallic" with a default value of 0.0. Connect it to the Metallic input.

6. For now, leave the Normal input disconnected (flat surface).

7. Apply the material to a sphere, cube, and plane in your scene.

8. Experiment by changing the parameter values in the material:
   - Set Roughness to 0.0 and observe the mirror-like reflection
   - Set Roughness to 1.0 and observe the completely matte surface
   - Set Metallic to 1.0 and observe how the reflection tints with the base colour
   - Change Base Color to a bright red and toggle Metallic between 0 and 1 to see the difference in reflection behaviour

**Verification:**
- The material compiles without errors
- Roughness visibly changes how light reflects off the surface
- Metallic changes how the base colour interacts with reflections
- The sphere, cube, and plane all use the same material but the lighting differences are visible across the different surface angles

**Stretch Goal:** Add an Emissive channel. Create a scalar parameter "EmissiveIntensity" and multiply it with a colour to make the object glow. This previews how magical effects and runes will work.

---

## Exercise 2: Create a Textured Material with a Normal Map

**Objective:** Use texture maps to create a realistic wood material, and understand how normal maps add surface detail without geometry.

**Steps:**

1. Download or create three textures for a wood surface:
   - `T_Wood_BaseColor` (the colour/grain of the wood)
   - `T_Wood_Normal` (surface bumps and grain direction)
   - `T_Wood_Roughness` (variation: glossy varnished areas vs matte bare wood)

2. Create a new material called `M_Wood_Textured`.

3. Add three **Texture Sample** nodes, one for each texture. Connect them to the Base Color, Normal, and Roughness inputs respectively.

4. For the Normal texture, make sure the **Sampler Type** on the Texture Sample node is set to "Normal" (not "Color"). This ensures the engine interprets the data correctly.

5. Add a **Texture Coordinate** node and connect it to all three Texture Sample UV inputs. Set the tiling to (2, 2) so the texture repeats twice across the surface.

6. Apply the material to a flat plane that represents a tabletop surface.

7. Add a point light near the surface and move it around. Observe how the normal map creates the illusion of depth in the wood grain, even though the geometry is perfectly flat.

8. Temporarily disconnect the Normal map input and observe the difference. The surface should look flat and unconvincing without it.

**Verification:**
- The wood grain is visible and repeats across the surface
- Moving a light across the surface reveals depth and texture from the normal map
- The roughness variation creates subtle differences in how different parts of the wood reflect light
- Disconnecting the normal map makes the surface look noticeably flat

**Stretch Goal:** Add a **Detail Normal Map** that layers fine wood fibre detail on top of the main normal map. Use a BlendAngleCorrectNormal node to combine them. Use a higher tiling value (8, 8) for the detail layer so the fine texture repeats more frequently.

---

## Exercise 3: Material Instance with Adjustable Parameters

**Objective:** Create a parent material with exposed parameters and generate multiple Material Instances for different surface variations, without recompiling the shader each time.

**Steps:**

1. Create a parent material called `M_Armour_Master`. This will be the base for all armour pieces in the game.

2. Expose the following parameters:
   - **BaseColorTint** (Vector Parameter, default: white): Multiplied with the base colour texture to tint the armour
   - **RoughnessScale** (Scalar Parameter, default: 0.5, range 0-1): Controls overall surface smoothness
   - **MetallicOverride** (Scalar Parameter, default: 1.0, range 0-1): Allows non-metallic armour variants (leather, bone)
   - **NormalIntensity** (Scalar Parameter, default: 1.0, range 0-2): Controls how pronounced the surface detail appears
   - **EmissiveColor** (Vector Parameter, default: black): For glowing enchantment effects
   - **EmissiveIntensity** (Scalar Parameter, default: 0.0, range 0-50): Controls glow brightness

3. For the Normal intensity, multiply the normal map by the NormalIntensity parameter using a FlattenNormal node or manual lerp between (0,0,1) and the sampled normal.

4. Create four Material Instances from this parent:
   - **MI_Armour_SteelPlate:** Silver tint, high metallic, low roughness (polished steel)
   - **MI_Armour_RustedIron:** Orange-brown tint, high metallic, high roughness (corroded iron)
   - **MI_Armour_Leather:** Brown tint, zero metallic, high roughness (leather armour)
   - **MI_Armour_Enchanted:** Blue tint, high metallic, low roughness, blue emissive glow

5. Apply each Material Instance to a copy of the same armour mesh. Place all four side by side in the scene.

**Verification:**
- All four variants look distinctly different despite using the same parent material
- Changing a parameter on a Material Instance updates instantly, no compilation needed
- The enchanted variant glows with the emissive colour
- Adjusting NormalIntensity visibly changes the depth of surface detail

**Stretch Goal:** Create a Dynamic Material Instance in Blueprint or C++. Attach it to an armour piece and animate the EmissiveIntensity using a sine wave timeline, creating a pulsing magical glow effect.

---

## Exercise 4: The Miniature-to-Character Crossfade Material

**Objective:** Build the signature transition material that blends between a painted miniature look and a realistic PBR character appearance, driven by a single TransitionAlpha parameter.

**Steps:**

1. Create a new material called `M_Character_Transition`. Set it up for character use (used with skeletal meshes).

2. Create two texture sets:
   - **Miniature set:** A base colour texture with a hand-painted, slightly desaturated look. A flat roughness (constant 0.8 for a matte paint finish). Zero metallic.
   - **Realistic set:** A detailed base colour texture with skin tones and fabric detail. A roughness map with variation. A metallic map for armour pieces.

3. Add a **Scalar Parameter** called "TransitionAlpha" (default: 0.0, range 0-1).

4. Use **Lerp** nodes to blend between the two sets:
   - Base Color: Lerp(Miniature_BaseColor, Realistic_BaseColor, TransitionAlpha)
   - Roughness: Lerp(0.8, Realistic_Roughness, TransitionAlpha)
   - Metallic: Lerp(0.0, Realistic_Metallic, TransitionAlpha)
   - Normal: Lerp(FlatNormal, Realistic_Normal, TransitionAlpha)

5. Add a painterly effect to the miniature side:
   - Use a noise texture multiplied with the miniature base colour to simulate visible brush strokes
   - Blend this effect out as TransitionAlpha increases: `BrushStrokes * (1 - TransitionAlpha)`

6. Create a **Material Parameter Collection** called `MPC_Global` with a scalar parameter "TransitionProgress".

7. In the material, replace the local TransitionAlpha parameter with a read from the MPC. This way, all characters transition simultaneously when you update the MPC value.

8. Create a test Blueprint that smoothly animates the MPC TransitionProgress from 0 to 1 over 3 seconds when you press a key.

**Verification:**
- At TransitionAlpha 0: the character looks like a painted miniature (matte, stylised, visible brush texture)
- At TransitionAlpha 1: the character looks like a realistic PBR character
- At TransitionAlpha 0.5: you see a convincing mid-transition blend
- Pressing the test key smoothly transitions all characters in the scene simultaneously
- The transition is visually smooth with no obvious popping or jarring switches

**Stretch Goal:** Add a dissolve edge effect during the transition. Use a noise texture to create a glowing, magical edge that sweeps across the character as the transition progresses. The edge should emit coloured light (gold or blue) to sell the "coming to life" feeling.

---

## Exercise 5: Render-to-Texture for the Tabletop Map

**Objective:** Set up a Scene Capture 2D that renders a top-down view of your 3D game world to a texture, then display that texture on the tabletop surface as a live miniature map.

**Steps:**

1. Create a simple 3D world scene in a sublevel or a separate area of your map:
   - A basic terrain or floor
   - A few walls or buildings
   - At least one moving actor (a character walking a path using a spline or simple movement logic)

2. Create a **Render Target** texture asset:
   - Resolution: 1024x1024 (can increase later)
   - Format: RTF_RGBA8
   - Name: `RT_TabletopMap`

3. Place a **Scene Capture Component 2D** in the scene:
   - Position it above the 3D world, pointing straight down (rotation: pitch = -90)
   - Set the capture source to "Final Color (LDR)"
   - Assign `RT_TabletopMap` as the Texture Target
   - Set the projection type to Orthographic for a clean, flat map look
   - Adjust the ortho width to frame your entire play area

4. Create a material `M_TabletopMap`:
   - Sample `RT_TabletopMap` as a Texture Sample (use the Render Target directly)
   - Connect to Base Color
   - Optionally add a slight roughness (0.3) so the map surface has a slight parchment/paper feel
   - Add a vignette effect around the edges using a radial gradient to make it feel like a physical map

5. Create a flat plane mesh representing the tabletop surface and apply `M_TabletopMap` to it.

6. Configure the Scene Capture for performance:
   - Set `bCaptureEveryFrame` to false
   - Create a timer that calls `CaptureScene()` every 0.1 seconds (10fps update rate)
   - Add a ShowOnly list and add only the relevant actors (terrain, buildings, characters), excluding UI elements and debug objects

7. Test the setup:
   - Move the character in the 3D world and observe the miniature moving on the tabletop map
   - Place or remove objects in the 3D world and see them appear/disappear on the map

**Verification:**
- The tabletop surface shows a live, top-down view of the 3D world
- Moving actors in the 3D world are visible as moving elements on the tabletop
- The map updates smoothly at the configured frame rate
- The render target resolution is sufficient to see meaningful detail
- Performance impact is manageable (check the frame time with and without the Scene Capture)

**Stretch Goal:** Add a "fog of war" effect. Create a second Render Target that acts as a visibility mask. Paint explored areas white and unexplored areas black. Multiply this mask with the map texture in the tabletop material so unexplored areas appear dark or hidden. Update the visibility mask as the player character moves through the world.
