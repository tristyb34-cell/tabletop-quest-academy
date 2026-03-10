# Module 05: Exercises - Making It Beautiful

These exercises transform your Tabletop Quest environments from grey boxes to stunning, atmospheric spaces. Each exercise builds on the previous, and by the end you will have a playable tavern, dungeon, and overworld with proper materials, lighting, and post-processing.

---

## Exercise 1: Set Up Megascans and Import Base Assets

**Goal**: Connect to the Fab marketplace and import the core assets for all three Tabletop Quest environments.

### Steps

1. In UE5.7, go to **Edit > Plugins** and enable the **Fab** plugin (if not already enabled). Restart the editor.
2. Open Fab from the toolbar or visit [fab.com](https://www.fab.com/) and sign in with your Epic account.
3. Search for and download the following Megascans assets:

**Tavern (at least 5 assets):**
- Wooden floor planks (aged, warm tone)
- Rough plaster or whitewash wall surface
- Stone fireplace material
- Wooden beam / timber material
- Leather surface material

**Dungeon (at least 5 assets):**
- Rough stone wall (grey, aged)
- Flagstone or cobblestone floor
- Wet stone variant
- Rusted metal surface
- Brick wall material

**Overworld (at least 3 assets):**
- Grass ground surface
- Dirt path material
- Rocky cliff / boulder material

4. Create an organized folder structure in your Content Browser:
   - `Content/Materials/Tavern/`
   - `Content/Materials/Dungeon/`
   - `Content/Materials/Overworld/`

5. Move downloaded assets into the appropriate folders.

### Verification

- All assets appear in the Content Browser under their correct folders.
- Each Megascans asset includes Base Colour, Normal, Roughness, and (optionally) Displacement textures.
- You can preview each material on a sphere in the Material Editor.

---

## Exercise 2: Build the Tavern Material Set

**Goal**: Create the complete material set for the Tabletop Quest tavern.

### Steps

1. Open the Megascans wood floor material and convert it to a parameterized parent material called `M_TavernWood`:
   - Replace hardcoded roughness with a **Scalar Parameter** called "Roughness" (default 0.5)
   - Add a **Vector Parameter** called "Tint" (default warm brown) multiplied into the base colour
   - Add a **Scalar Parameter** called "UV_Scale" (default 1.0) controlling texture coordinate tiling
   - Add a **Scalar Parameter** called "Normal_Intensity" (default 1.0) multiplying the normal map

2. Create Material Instances for each tavern wood surface:

| Instance Name | Roughness | UV Scale | Notes |
|--------------|-----------|----------|-------|
| MI_TavernTable | 0.4 | 2.0 | Slightly glossy from use |
| MI_TavernFloor | 0.6 | 1.0 | Worn, walked on |
| MI_TavernBar | 0.3 | 1.5 | Polished from constant wiping |
| MI_TavernBeams | 0.7 | 0.8 | Old, dry, exposed |
| MI_TavernChair | 0.55 | 1.2 | Medium wear |

3. Create a `M_TavernStone` parent material for the fireplace and foundation stones:
   - Use the stone Megascans asset as base
   - Add Roughness, Tint, UV_Scale, and Normal_Intensity parameters
   - Create instance `MI_Fireplace` (roughness 0.5, warm grey tint)

4. Create a `M_TavernPlaster` material for the walls:
   - Slightly rough (0.75), cream-white tint
   - Create instance `MI_PlasterWall`

5. Apply all materials to a simple tavern blockout (box meshes shaped like a room with a bar, tables, and a fireplace alcove).

### Verification

- Each Material Instance shows distinct properties when viewed on meshes.
- Changing a parameter in the parent material updates all instances.
- The tavern blockout has visually distinct surfaces: glossy bar, worn floor, rough beams, smooth plaster walls.
- Materials look correct under a simple point light (warm white).

---

## Exercise 3: Light the Tavern with Lumen

**Goal**: Create the warm, cozy lighting setup for the tavern using Lumen global illumination.

### Steps

1. Verify Lumen is enabled: **Project Settings > Rendering > Global Illumination > Lumen** and **Reflections > Lumen**.

2. Place the primary light sources:

**Fireplace:**
- Add a **Rect Light** inside the fireplace opening, aimed outward
- Colour: (R: 1.0, G: 0.6, B: 0.3)
- Intensity: 25-35
- Source Width/Height: Match the fireplace opening
- Create a simple flicker: In the light's Blueprint, animate intensity with a sine wave (frequency 3-5 Hz, amplitude 3-5)

**Hanging Lanterns (place 3-4):**
- **Point Lights** at lantern positions
- Colour: (R: 1.0, G: 0.7, B: 0.4)
- Intensity: 10-15 each
- Attenuation Radius: 500
- Add slightly randomized flicker (different frequency per lantern)

**Table Candles (2-3 on the gaming table):**
- Tiny **Point Lights**
- Colour: (R: 1.0, G: 0.8, B: 0.5)
- Intensity: 3-5
- Attenuation Radius: 150

3. Delete any existing Sky Light or Directional Light in the tavern level (indoor scene, no sun).

4. Add **Exponential Height Fog**:
   - Fog Density: 0.03
   - Inscattering Colour: Match the warm lantern tone
   - Enable **Volumetric Fog**: true
   - Volumetric Fog Scattering Distribution: 0.8

5. Walk around the tavern and observe Lumen GI:
   - Fireplace light should bounce off the floor and illuminate under-table areas
   - Lantern light should bounce off the ceiling creating a warm glow
   - Candle light should softly illuminate the tabletop area

### Verification

- The tavern feels warm and inviting without any fill lights.
- Shadows are soft and warm-tinted (not pitch black) due to Lumen's indirect bounces.
- Volumetric fog creates subtle light shafts near the fireplace.
- Moving a light source updates the scene in real time (drag a lantern and watch the GI update).
- Frame rate stays above 60 FPS in the tavern.

---

## Exercise 4: Build and Light the Dungeon

**Goal**: Create a moody, dangerous-feeling dungeon environment with contrasting light and shadow.

### Steps

1. Create dungeon materials:

**M_DungeonStone (parent material):**
- Base: Megascans stone wall asset
- Add parameters: Roughness (default 0.75), Tint, UV_Scale, Normal_Intensity
- Add a moss blend: Lerp between stone and a green-tinted version, driven by a "Moss_Amount" parameter (0.0 = no moss, 1.0 = fully mossy)

**Material Instances:**
| Instance | Roughness | Moss | Notes |
|----------|-----------|------|-------|
| MI_DungeonWall_Dry | 0.8 | 0.0 | Standard dry stone |
| MI_DungeonWall_Wet | 0.3 | 0.0 | Damp areas near water |
| MI_DungeonWall_Mossy | 0.7 | 0.6 | Upper sections with moss |
| MI_DungeonFloor | 0.65 | 0.1 | Flagstone with slight moss in cracks |

2. Build a dungeon blockout: a main corridor with 2-3 branching rooms, including a larger chamber for boss fights.

3. Light the dungeon:

**Wall Torches (every 15-20 meters along corridors):**
- **Point Lights** at torch positions
- Colour: (R: 1.0, G: 0.65, B: 0.3)
- Intensity: 12-18
- Attenuation Radius: 700
- Flicker animation (faster than tavern, suggesting drafts)

**Boss Room Accent:**
- Add a subtle coloured light (cool blue, intensity 4-6) in the boss chamber
- This signals "something magical and dangerous is here"

**No fill lights.** Let darkness exist between torch pools.

4. Add Exponential Height Fog:
   - Fog Density: 0.015 (thinner than tavern, just enough for atmosphere)
   - Colour: cool grey-blue
   - Volumetric Fog: enabled

### Verification

- The dungeon feels dark and oppressive.
- Torch-lit areas have warm pools of light with soft shadows.
- Areas between torches are genuinely dark (not pitch black due to Lumen bounces, but dark).
- The wet stone material visibly reflects torch light (lower roughness = visible specular highlights).
- The moss material is visible on upper portions of walls.
- The boss room has a distinctly different atmosphere from the corridors.
- Frame rate stays above 60 FPS.

---

## Exercise 5: Build and Light the Overworld

**Goal**: Create a sunlit overworld environment with terrain, sky, and time-of-day lighting.

### Steps

1. Create a new level called `L_Overworld`.

2. Add a **Landscape** (Modes panel > Landscape):
   - Size: 127x127 sections, 1 component
   - Create a Landscape Material with 3 layers: Grass, Dirt, Rock
   - Each layer uses its Megascans texture set
   - Paint the landscape: grass on flat areas, dirt on paths, rock on slopes

3. Set up the sky:
   - Add **Sky Atmosphere** component
   - Add **Directional Light** (the sun):
     - Enable "Atmosphere Sun Light" in its properties
     - Colour: slightly warm white
     - Rotation: Set to mid-morning (around 45 degrees elevation)
   - Add **Sky Light** with "Real Time Capture" enabled

4. Add atmosphere:
   - **Exponential Height Fog**: Density 0.005 (light haze), warm white colour
   - Volumetric Fog: enabled (creates god rays from the sun through trees)
   - Fog Falloff: 0.5 (fog thins at height, thick near ground)

5. Place some Megascans rocks with Nanite enabled:
   - Import 3-5 different rock meshes from Megascans
   - Verify Nanite is enabled on each (Static Mesh > Nanite Settings > Enable)
   - Scatter them across the landscape
   - Scale them to various sizes for visual variety

6. Experiment with time of day:
   - Rotate the Directional Light to different angles
   - Noon: Light nearly overhead, short shadows, bright
   - Sunset: Light at low angle, long dramatic shadows, warm orange
   - Night: Light below horizon, moonlight from the opposite direction (dim blue)

### Verification

- The landscape has smooth blending between grass, dirt, and rock layers.
- The sky looks realistic with proper atmospheric scattering (blue sky, warm horizon).
- Nanite rocks render smoothly at any distance without visible LOD pops.
- Lumen GI from the sun creates soft, bounced light on the shadow side of rocks and terrain.
- Volumetric fog creates visible god rays when the sun is at a low angle.
- The scene looks distinctly different at noon, sunset, and night.

---

## Exercise 6: Post-Processing for Each Environment

**Goal**: Create distinct visual moods for each Tabletop Quest environment using post-processing.

### Steps

1. **Tavern Post-Processing:**
   - Place a **Post Process Volume** (bounded to the tavern interior)
   - Bloom Intensity: 1.2 (warm glow from light sources)
   - Colour Grading > White Balance > Temperature: +15 (push warm)
   - Vignette Intensity: 0.5
   - Ambient Occlusion Intensity: 0.7
   - Save as a preset you can reference later

2. **Dungeon Post-Processing:**
   - Place a bounded Post Process Volume
   - Bloom Intensity: 0.6 (subdued, only torch glow blooms)
   - Colour Grading > White Balance > Temperature: -15 (push cool)
   - Colour Grading > Misc > Saturation: 0.85 (slightly desaturated, grim)
   - Vignette Intensity: 0.7 (heavier, claustrophobic)
   - Ambient Occlusion Intensity: 0.9 (deeper shadows in crevices)
   - Auto Exposure > Min/Max EV100: -2 to 4 (allow eyes to adjust to darkness)

3. **Overworld Post-Processing:**
   - Place an unbounded Post Process Volume
   - Bloom Intensity: 0.8
   - Colour Grading > Saturation: 1.15 (vibrant fantasy colours)
   - Temperature: 0 (neutral, let the sun dictate warmth)
   - Vignette Intensity: 0.3 (light, unobtrusive)
   - Auto Exposure > Min/Max EV100: 4 to 14 (outdoor brightness range)

4. Take screenshots of the same prop (a wooden barrel, for example) in all three environments. The barrel should look warm in the tavern, cold in the dungeon, and vibrant in the overworld, all from the same material but different post-processing.

### Verification

- Walking between environments (or viewing screenshots side by side) shows clearly distinct moods.
- The tavern feels warm, cozy, and intimate.
- The dungeon feels cold, dark, and foreboding.
- The overworld feels bright, colourful, and expansive.
- No environment feels "flat" or washed out.
- Post-processing does not introduce visual artifacts (no excessive bloom, no crushed blacks).

---

## Exercise 7: The Tabletop Zoom Material Transition

**Goal**: Build the material effect that morphs miniatures from painted to realistic during the tabletop zoom.

### Steps

1. Create a material called `M_TransitionCharacter`:
   - Add a **Scalar Parameter** called "TransitionAlpha" (default 0.0, range 0-1)
   - Add two **Texture Parameters**: "PaintedTexture" and "RealisticTexture"
   - Use a **Lerp** node: A = PaintedTexture, B = RealisticTexture, Alpha = TransitionAlpha
   - Connect the Lerp output to Base Colour
   - For Roughness: Lerp between 0.65 (painted matte) and a RealisticRoughness texture, same alpha
   - For Normal: Lerp between a flat normal (painted, less detail) and a detailed normal map

2. Create two Material Instances:
   - `MI_Warrior_Miniature`: TransitionAlpha = 0.0 (painted look)
   - `MI_Warrior_FullScale`: TransitionAlpha = 1.0 (realistic look)

3. Create a test Blueprint called `BP_ZoomTransitionTest`:
   - Place a character mesh in the level
   - Apply `M_TransitionCharacter` with a Dynamic Material Instance
   - On a key press (T key), animate TransitionAlpha from 0.0 to 1.0 over 2 seconds using a Timeline
   - Simultaneously scale the mesh from miniature size (0.05) to full size (1.0)
   - Add a camera animation that zooms from overhead to eye level

4. Test the transition:
   - Press T to trigger the zoom
   - Watch the miniature grow and its material morph from painted to realistic
   - Press T again to reverse (realistic back to painted, zoom out)

### Verification

- At TransitionAlpha = 0.0, the character looks like a painted tabletop miniature (matte, slightly desaturated).
- At TransitionAlpha = 1.0, the character looks realistic (proper roughness, detailed normal map, vivid colour).
- The transition is smooth with no popping or visible seam.
- The scale and camera animation sync with the material morph.
- The effect feels "magical" and satisfying (this is the signature moment of the game).

---

## Exercise 8: Performance Optimization Pass

**Goal**: Verify that all visual enhancements maintain acceptable frame rates across all environments.

### Steps

1. Enable the frame rate counter: console command `stat fps` (or `stat unit` for more detail).

2. Profile each environment:

| Environment | Target FPS | Maximum Draw Calls | Maximum Triangle Count |
|-------------|-----------|-------------------|----------------------|
| Tavern | 60+ | 2000 | 5M |
| Dungeon | 60+ | 2000 | 5M |
| Overworld | 60+ | 3000 | 10M (Nanite handles this) |

3. Use `stat scenerendering` to check:
   - Number of draw calls
   - Triangle count
   - Lumen cost breakdown

4. If any environment drops below 60 FPS:

   **Lumen optimizations:**
   - Reduce Final Gather Quality from 2.0 to 1.0
   - Reduce Lumen Scene Detail from 2.0 to 1.0
   - Reduce Max Trace Distance for indoor scenes (400 is enough for tavern/dungeon)

   **Material optimizations:**
   - Check material instruction count (Material Editor > Stats)
   - Simplify any material over 200 instructions
   - Reduce texture resolution for small/distant props (2K to 1K)

   **Geometry optimizations:**
   - Verify Nanite is enabled on all static environment meshes
   - Merge small static meshes into larger ones where possible
   - Remove hidden geometry (walls behind other walls)

5. Create a simple "Quality Settings" Blueprint that lets you toggle between:
   - Low: Lumen off (SSGI fallback), no volumetric fog, 1K textures
   - Medium: Lumen on, standard quality, 2K textures
   - High: Lumen on, high quality, 4K textures, volumetric fog

### Verification

- All three environments maintain 60+ FPS on your target hardware.
- Lumen GI is the largest cost (expected).
- Nanite geometry has minimal draw call impact.
- The quality settings Blueprint successfully toggles between presets.
- The low quality preset runs above 60 FPS even on modest hardware.
- Visual quality at medium/high is indistinguishable from the development settings for most players.
