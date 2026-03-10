# Module 05: Exercises

Three exercises that transform your dungeon from prototype to polished. Complete them in order.

---

## Exercise 1: Apply Megascans Materials to Your Dungeon

**Goal**: Replace all placeholder materials in the Module 01 dungeon room with realistic Megascans surfaces.

### Steps

1. Open the **Quixel Bridge** plugin in UE5 (Window > Quixel Bridge, or find it in the toolbar).
2. Search for and download these surfaces (or similar ones that match your dungeon vision):
   - A stone floor material (search "stone floor," "castle floor," or "cobblestone")
   - A stone wall material (search "dungeon wall," "stone brick," or "rough stone")
   - A wooden material for any doors or furniture (search "old wood" or "dark wood planks")
3. Add each downloaded asset to your project.
4. In your dungeon level, select the floor Actor. In the Details Panel, find the Material slot and assign the stone floor material.
5. Repeat for all four walls (stone wall material) and any furniture (wood material).
6. If you have the treasure chest and door from Module 02, apply appropriate materials to those as well.
7. Fly through the room and compare the before (grey cubes) to the after (textured surfaces).

### Success Criteria

- Every visible surface in the room has a realistic material applied (no more default grey).
- The floor material is different from the wall material.
- The room looks like it could be part of a fantasy dungeon.
- You can identify each material in the Content Browser.

### Stretch Goal

Create a **Material Instance** from one of the wall materials. Adjust its parameters (make it darker, rougher, or add a green tint for moss). Apply the instance to one wall so it looks different from the others, as if that section of the dungeon is older or damper.

---

## Exercise 2: Set Up Lumen Lighting with Torches

**Goal**: Light the dungeon with warm, atmospheric Point Lights that create shadows and mood.

### Steps

1. Delete or disable any Directional Light in the level (you want the dungeon to feel underground, not sunlit).
2. Add a **Point Light** near the first wall. Set these properties:
   - **Intensity**: 3000
   - **Light Colour**: Warm orange (R: 255, G: 180, B: 80)
   - **Attenuation Radius**: 800
3. Duplicate this light (Ctrl+D) and place copies at 3-4 other locations around the room: near the door, above the treasure chest, in a dark corner.
4. Vary the intensity slightly between lights (2500 for one, 3500 for another) so the lighting feels natural rather than uniform.
5. Add one light with a different colour, a cool blue-white (R: 150, G: 180, B: 255) with low intensity (1500), to simulate a magical glow from a crystal or enchanted object.
6. Verify Lumen is active: go to **Project Settings > Rendering > Global Illumination** and confirm "Lumen" is selected (it should be by default).
7. Fly through the room. Notice how light bounces off the stone walls, creating subtle colour in the shadows. This is Lumen at work.

### Success Criteria

- The dungeon is lit entirely by Point Lights (no sunlight).
- Areas near lights are warm and visible. Areas between lights are dark and shadowy.
- At least one light has a contrasting cool colour for visual variety.
- Light bounces are visible on nearby surfaces (orange glow on the floor from a wall torch).

### Stretch Goal

Attach a Point Light to one of the torch Blueprints from Module 02 (the toggle torch). When the torch is "lit," the light is on. When toggled off, the light turns off and that section of the dungeon goes dark. Walk through the room toggling torches and watch the lighting change dynamically.

---

## Exercise 3: Add Post-Processing and Fog for Atmosphere

**Goal**: Add post-processing effects and fog to create a moody dungeon atmosphere.

### Steps

1. Add a **Post Process Volume** to the level. In the Details Panel, check **Infinite Extent (Unbound)**.
2. Configure these settings:
   - **Bloom > Intensity**: 0.5 (soft glow around light sources)
   - **Exposure > Min Brightness / Max Brightness**: Set to 0.5 and 2.0 to keep the dungeon dark
   - **Colour Grading > Global > Saturation**: Reduce slightly (0.85) for a muted, gritty feel
   - **Colour Grading > Shadows > Tint**: Shift toward blue for cool shadows
   - **Vignette > Intensity**: 0.4 for subtle edge darkening
3. Add an **Exponential Height Fog** actor:
   - **Fog Density**: 0.02 (subtle, not a pea soup fog)
   - **Fog Inscattering Colour**: Desaturated blue-grey
   - Enable **Volumetric Fog**
4. Press Play and walk through the dungeon. Light beams from your Point Lights should now be visible cutting through the fog.
5. Take a screenshot. Compare it to what the room looked like in Module 01.
6. Experiment: try different post-processing settings. Make the room look cold and eerie (blue tint, high fog). Make it look warm and inviting (orange tint, low fog, high bloom). Find the mood that fits your game.

### Success Criteria

- Post-processing is applied globally (the entire level looks different from default).
- Bloom creates soft halos around torch lights.
- Fog is visible but not overwhelming.
- Volumetric light beams are visible from at least one light source.
- The overall mood feels like a dungeon, not a clean showroom.

### Stretch Goal

Ask Claude for a Python script that sets up the entire atmosphere (fog, post-process volume, and 4-6 Point Lights at predefined positions) in one paste. Test it in a new, empty room to see how quickly you can go from "empty grey box" to "atmospheric dungeon."

---

## Reflection

After completing all three exercises, fly through your dungeon slowly and appreciate the transformation:

- Module 01: Grey cubes in flat light.
- Module 05: Textured stone walls, warm torchlight bouncing off surfaces, volumetric fog, and cinematic colour grading.

The geometry barely changed. The materials, lighting, and post-processing did all the work. That is the power of rendering in a modern engine. You did not model a single prop or paint a single texture. You curated, placed, and tuned. And the result looks like a real game.
