# Module 05: Making It Beautiful

## From Prototype to Stunning

You have a working combat system. Characters fight, dice roll, status effects tick, and the dual-mode switch works. But right now, everything probably looks like grey boxes and placeholder meshes in a flat-lit room. This module changes that.

Tabletop Quest lives in two visual worlds: the warm, candlelit tabletop covered in painted miniatures, and the lush fantasy environments those miniatures come alive in. The tavern where the party gathers. The dungeon with flickering torches and damp stone walls. The overworld with rolling hills and ancient ruins. Each needs to look stunning, and UE5.7 gives you the tools to make that happen without being a technical artist.

This module covers materials, Lumen lighting, Nanite meshes, Megascans assets, and post-processing. Everything applied directly to Tabletop Quest environments. By the end, you will have a beautiful tavern interior, a moody dungeon, and a vibrant overworld, all using techniques you can replicate for every location in the game.

---

## The Visual Pillars of Tabletop Quest

Before touching any tools, let's define what "beautiful" means for this specific game. Not every game should look the same, and Tabletop Quest has a distinct visual identity rooted in its tabletop origins.

### Pillar 1: Warmth and Craft

The tabletop view should feel like a cozy game night. Warm candlelight, wooden table textures, hand-painted miniatures, scattered dice, and dog-eared rulebooks. Think of a Vermeer painting: warm, intimate, rich in detail. The materials here are physical and tactile: wood grain, leather, brass, parchment, wax.

### Pillar 2: Fantasy Grandeur (When Zoomed In)

When the camera zooms into the game world, the miniatures become full-scale characters in a lush fantasy setting. The tavern has a roaring fire, ale-stained wood, and hanging lanterns. The dungeon has mossy stone, dripping water, and eerie magical glows. The overworld has sunlit meadows, ancient stonework, and dramatic skies. Think Skyrim meets Fable: detailed but slightly stylized, not photorealistic.

### Pillar 3: The Transition Magic

The zoom transition between tabletop and world is the signature visual moment. Materials need to work at both scales: the miniature version (painted, small, stylized) and the full-scale version (detailed, immersive, lit naturally). The transition itself uses material effects (dissolves, scale morphing, color shifts) that you will learn to build in this module.

---

## PBR Materials: The Physics of Looking Real

Unreal Engine uses Physically Based Rendering (PBR). Instead of painting fake highlights and shadows onto textures (the old way), you describe the physical properties of a surface and the renderer calculates how light interacts with it in real time.

Think of PBR like describing a material to a craftsman: "It is rough like sandpaper, not metallic at all, and its base colour is dark brown." From that description, the renderer knows exactly what the surface looks like under torchlight, under moonlight, under a Fireball's glow, under any lighting condition.

### The Four Core Channels

Every PBR material in UE5 is built from these four primary inputs:

**Base Colour (Albedo)**

The raw colour of the surface without any lighting information. A dungeon stone wall is grey-brown. A gold coin is yellow-orange. A wooden tavern table is warm brown. This texture must have no baked shadows or highlights. It is purely "what colour is this thing if you removed all lighting?"

For Tabletop Quest: Your tavern wood should be a rich, warm brown. Your dungeon stone should be a cool grey with slight green-brown tints (suggesting moss and age). Your overworld grass should be a vibrant green.

**Normal Map**

A texture that fakes surface detail by bending how light bounces off a flat polygon. Instead of modelling every scratch, crack, and bump with actual geometry (which would be impossibly expensive), you encode the surface direction at each pixel in a purple-blue texture.

Think of it as a cheat sheet for light. The renderer looks at the normal map and says "this pixel should behave as if the surface is tilted 30 degrees to the left," even though the actual polygon is flat. This creates the illusion of carved stone, rough wood grain, and detailed metalwork at virtually zero performance cost.

For Tabletop Quest: Normal maps are what make your dungeon walls look like actual carved stone instead of smooth grey surfaces. They make your tavern's wooden beams show grain and knots. They make your character's armor show rivets and dents.

**Roughness**

How smooth or rough the surface is, on a scale from 0.0 (mirror-smooth) to 1.0 (completely matte).

| Value | Look | Example in Tabletop Quest |
|-------|------|--------------------------|
| 0.0 | Perfect mirror reflection | Polished crystal ball, enchanted sword blade |
| 0.1-0.3 | Shiny, clear reflections | Wet stone, polished metal armor |
| 0.3-0.5 | Slightly glossy | Lacquered wood, new leather |
| 0.5-0.7 | Semi-rough | Aged wood, worn leather, dry stone |
| 0.7-0.9 | Matte | Cloth, dirt, unpolished rock |
| 1.0 | Completely matte | Chalk, dry sand, rough fabric |

For Tabletop Quest: The tavern table is around 0.4 (slightly glossy from use and spilled ale). Dungeon walls are 0.7-0.8 (rough, dry stone). A paladin's polished armor is 0.15. A goblin's rusty blade is 0.6.

**Metallic**

A binary value: the material is either metal (1.0) or non-metal (0.0). Very few real-world materials fall between these values (some edge cases with oxidation or layered coatings).

Why does this matter? Metals reflect light using their base colour. Gold reflects golden light. Copper reflects warm orange light. Non-metals (wood, stone, skin, cloth) reflect white light regardless of their colour. Getting this wrong makes materials look uncanny.

For Tabletop Quest: Swords, armor, coins, and metal fixtures are 1.0. Everything else (wood, stone, cloth, leather, skin, bone) is 0.0. A rusty sword might have a metallic mask texture where the rust patches are 0.0 and the exposed metal is 1.0.

---

## The Material Editor in Practice

Unreal's Material Editor is a visual node graph. You connect nodes together to define how a surface looks, and a preview sphere shows the result in real time. No shader code needed (though you can write HLSL if you want).

### Creating Your First Material: Tavern Wood

Let's build the material for the tavern's wooden surfaces: tables, chairs, bar counter, and floor planks.

1. Right-click in the Content Browser > **Material** > Name it `M_TavernWood`.
2. Double-click to open the Material Editor.
3. You see the material output node on the right with input pins: Base Color, Metallic, Roughness, Normal, etc.

**Adding Base Colour:**
- Right-click in the graph > search "Texture Sample" > place it
- In the Details panel, set the texture to a wood plank texture (from Megascans, more on this later)
- Connect the RGB output to the Base Color input

**Adding Normal Map:**
- Add another Texture Sample node
- Set it to your wood normal map texture
- Connect the RGB output to the Normal input
- In the Texture Sample's details, set the Sampler Type to "Normal" (important! Using the wrong sampler type produces incorrect results)

**Adding Roughness:**
- If you have a roughness texture: add a Texture Sample and connect to Roughness
- If not: right-click > "Constant" > set to 0.5 > connect to Roughness
- You can adjust this value to make the wood shinier (lower) or more matte (higher)

**Metallic:**
- Add a Constant node, set to 0.0 (wood is not metal)
- Connect to Metallic

You now have a basic PBR wood material. Apply it to a mesh and it looks like real wood under any lighting condition.

### Material Instances: Variations Without Duplication

You do not want to create a separate material for every wood surface. The tavern table, the bar counter, and the floor planks all use the same wood material with slightly different settings (different tint, different roughness, different texture scale).

**Material Instances** solve this. A Material Instance inherits from a parent material but lets you override specific parameters without creating a new shader.

In your `M_TavernWood` material:
1. Replace the Constant nodes with **Scalar Parameter** nodes (right-click > "Scalar Parameter")
2. Name them: "Roughness", "Tint_R", "Tint_G", "Tint_B", "UV_Scale"
3. Replace the Texture Sample's texture reference with a **Texture Parameter** (or use a Texture Object Parameter)

Now right-click `M_TavernWood` in the Content Browser > **Create Material Instance**. Name it `MI_TavernTable`. In the instance, you can override:
- Roughness: 0.4 (slightly glossy from ale and use)
- Tint: Warm brown
- UV Scale: 2.0 (larger grain pattern)

Create another instance `MI_TavernFloor`:
- Roughness: 0.6 (more worn, walked on)
- Tint: Darker brown (dirty)
- UV Scale: 1.0 (standard grain)

Create `MI_TavernBarCounter`:
- Roughness: 0.3 (polished from constant wiping)
- Tint: Rich amber
- UV Scale: 1.5

Three different looks from one material. Changes to the parent material (like adding a damage overlay layer) automatically propagate to all instances.

### Material Functions: Reusable Building Blocks

If you find yourself building the same node setup in multiple materials (like a wetness layer or a moss blend), wrap it in a **Material Function**. This is like a C++ function but for materials: define it once, call it from any material.

For Tabletop Quest, useful Material Functions include:
- **MF_Wetness**: Adds a wet sheen to any surface (reduces roughness, darkens base color). Used in the dungeon for damp walls and the overworld after rain.
- **MF_Moss**: Blends moss textures onto surfaces based on the surface normal (moss grows on top-facing surfaces). Used on dungeon walls and overworld ruins.
- **MF_Damage**: Overlays scratches, chips, and wear based on a mask. Used on armor, weapons, and dungeon stonework.

---

## Megascans: Photorealistic Assets for Free

Quixel Megascans is a library of thousands of photogrammetry-scanned materials and 3D assets. Stone walls, wood planks, ground surfaces, foliage, rocks, props. All with PBR textures (Base Color, Normal, Roughness, Displacement, AO) at up to 8K resolution.

The critical fact: **Megascans is free for Unreal Engine projects.** Epic Games acquired Quixel, and the entire library is available at no cost through the Fab marketplace (formerly Quixel Bridge).

### Accessing Megascans

1. Open the **Fab** plugin in UE5 (Edit > Plugins, search for "Fab", enable it)
2. Or visit [fab.com](https://www.fab.com/) in your browser
3. Search for what you need: "medieval stone wall", "wooden floor planks", "dungeon props"
4. Click "Add to Project" to download directly into your UE5 project
5. The assets arrive with all PBR textures and a pre-built material

### What to Get for Tabletop Quest

**Tavern:**
- Wooden floor planks (aged, warm-toned)
- Stone fireplace / chimney material
- Rough plaster wall material
- Wooden beam / timber material
- Leather texture (for chairs and seats)
- Metal texture (for tankards, lantern frames, hinges)

**Dungeon:**
- Rough stone wall (grey, mossy)
- Cobblestone / flagstone floor
- Wet stone variant (for areas near water)
- Brick material (for constructed dungeon sections)
- Rusted metal (for gates, chains, torch holders)

**Overworld:**
- Grass ground material
- Dirt path material
- Rocky cliff material
- Ancient stone (for ruins, pillars)
- Bark and wood (for trees)

**Tabletop:**
- Polished wood (for the gaming table)
- Felt/cloth (for the table surface)
- Paper/parchment (for maps and character sheets)
- Painted miniature material (for the miniatures on the table)

### Using Megascans Effectively

Do not just download and apply. Megascans assets are starting points. Customize them:

1. **Create Material Instances**: Override the default roughness, tint, and UV scale to match your scene's aesthetic
2. **Blend materials**: Use the Landscape Material Blend or runtime virtual texturing to blend between grass and dirt, stone and moss
3. **Match the art style**: Tabletop Quest is "slightly stylized fantasy," not photorealistic. Consider desaturating Megascans textures slightly or adding a subtle painterly filter

---

## Lumen: Real-Time Global Illumination

Lumen is UE5's real-time global illumination and reflection system. It replaces the old baked lighting workflow (Lightmass) with a fully dynamic system that reacts to changes in real time.

### What Lumen Does

Without global illumination, only surfaces directly hit by a light source are lit. Everything else is black. That is not how light works in reality. Light bounces. A torch illuminates a wall, and the wall reflects warm light onto the floor, which reflects dimmer light onto the ceiling. This bounced light fills the room with soft, indirect illumination.

Lumen simulates this light bouncing in real time. Place a torch in your dungeon and the entire corridor fills with warm, bounced light. Move the torch and the lighting updates instantly. No baking, no waiting, no lightmap UV errors.

### Why Lumen Matters for Tabletop Quest

Three reasons:

1. **The tabletop scene**: Candlelight bouncing off the wooden table, casting warm light on miniatures and dice. Without GI, the candles illuminate small circles and everything else is dark. With Lumen, the entire table glows warmly.

2. **The dungeon**: Torches in wall sconces casting flickering light that bounces off wet stone. Without GI, you need dozens of fill lights to avoid pitch-black shadows. With Lumen, two torches naturally light an entire corridor.

3. **Ability VFX during combat**: When the Mage casts Fireball, the fire should illuminate the surrounding area with warm orange light. With Lumen, the fireball's emissive material automatically contributes to the scene lighting. No extra light actors needed.

### Enabling Lumen

Lumen should be the default in UE5.7, but verify:

1. Go to **Project Settings > Engine > Rendering**
2. Under **Global Illumination**, set the method to **Lumen**
3. Under **Reflections**, set the method to **Lumen**
4. Under **Hardware Ray Tracing**, you can leave this OFF. Lumen's software tracing (the default) works well and supports more hardware. Enable hardware RT only if you have an RTX GPU and want maximum quality.

### Lumen Settings That Matter

**Lumen Scene Detail**: Controls how detailed the GI tracing is. Higher values capture smaller geometry. For Tabletop Quest, the default (1.0) works well. Increase to 2.0 if small props (dice, miniatures) are not receiving correct lighting.

**Final Gather Quality**: Controls the quality of the final bounce gather. Higher values reduce noise. Set to 1.0 for development, 2.0-4.0 for final quality screenshots and videos.

**Max Trace Distance**: How far light bounces are traced. For indoor scenes (tavern, dungeon), the default is fine. For the overworld with long sight lines, increase to 20000-40000.

**Sky Light**: Always have a Sky Light in outdoor scenes. It provides ambient illumination from the sky dome, which Lumen then uses for indirect bounces. Without a Sky Light, outdoor areas look flat.

### Practical Lumen Tips

**Avoid pure black materials.** A base colour of (0, 0, 0) absorbs all light and kills GI bounces. Even the darkest dungeon stone should be (0.02, 0.02, 0.02) so Lumen has something to bounce.

**Emissive materials work as lights.** A glowing magical rune, a torch flame, a Mage's enchanted staff: make them emissive in the material editor and Lumen treats them as light sources. No separate point light needed.

**Moving lights update in real time.** Carry a torch through the dungeon and Lumen updates the GI every frame. This is perfect for the adventuring party exploring dark corridors.

---

## Lighting the Tavern

Let's build the lighting setup for the Tabletop Quest tavern. This is where the party gathers between adventures, and it sets the emotional tone for the game.

### The Light Sources

**Fireplace (main source):**
- Use a **Rect Light** aimed outward from the fireplace opening
- Colour: warm orange (R: 1.0, G: 0.6, B: 0.3)
- Intensity: 20-40 (adjust until it feels right)
- Source Width/Height: Match the fireplace opening size
- Add slight intensity animation (sine wave, subtle) for fire flicker

**Hanging Lanterns (secondary sources):**
- Use **Point Lights** at each lantern position
- Colour: warm amber (R: 1.0, G: 0.7, B: 0.4)
- Intensity: 8-15 per lantern
- Attenuation Radius: 400-600 (each lantern lights a small area)
- Add random flicker (different frequency than the fireplace for visual variety)

**Window Light (ambient fill):**
- If the tavern has windows, use a **Directional Light** or **Rect Light** simulating daylight or moonlight
- Colour: cool blue for night (R: 0.5, G: 0.6, B: 0.9) or warm yellow for day (R: 1.0, G: 0.95, B: 0.8)
- Low intensity (3-8) since this is supplementary

**Candles on tables:**
- Tiny Point Lights, warm yellow, very low intensity (2-5)
- Attenuation Radius: 100-200 (just the table area)
- These are the lights that illuminate the tabletop gaming scene

### The Lumen Magic

With just these lights placed, Lumen handles the rest:
- Fireplace light bounces off the floor, illuminating under-table areas with warm fill
- Lantern light bounces off the low ceiling, creating a cozy glow
- Window light bounces off the opposite wall, providing subtle contrast
- Candle light on the tabletop makes dice and miniatures glow warmly

No fill lights needed. No ambient faking. Just real light sources and Lumen does the work.

### Atmosphere

Add a **Exponential Height Fog** component to simulate dusty air and light shafts:
- Fog Density: 0.02-0.05 (subtle haze, not pea soup)
- Fog Inscattering Colour: Match your dominant light colour (warm amber)
- Enable **Volumetric Fog**: This creates visible light shafts from the windows and fireplace
- Volumetric Fog Scattering Distribution: 0.8 (forward scattering, meaning light shafts point toward the camera)

The result: visible light shafts streaming through the tavern windows, dust motes drifting in the lantern light, and a warm haze that makes the entire scene feel lived-in.

---

## Lighting the Dungeon

The dungeon is the opposite of the tavern. Where the tavern is warm and inviting, the dungeon is cold, dark, and dangerous. The lighting must convey this.

### Light Sources

**Wall Torches (primary):**
- Point Lights at each torch sconce
- Colour: orange-yellow (R: 1.0, G: 0.65, B: 0.3)
- Intensity: 10-20
- Attenuation Radius: 600-800 (torches light the corridor section they are in)
- Flicker animation (faster and more erratic than tavern lanterns, suggesting drafts)

**Magical Ambient:**
- In areas with magical elements (rune-covered walls, enchanted doors), use subtle coloured lights
- Cool blue (R: 0.3, G: 0.5, B: 0.9) for arcane magic
- Sickly green (R: 0.4, G: 0.8, B: 0.2) for poison/necromancy
- These should be dim (intensity 3-6) and create pools of coloured light on the floor

**Darkness Between:**
- The key to a good dungeon is contrast. Between light sources, let the darkness exist.
- Do NOT add fill lights to brighten dark areas. The darkness is the point.
- Lumen's indirect bounces from the torches provide just enough visibility in the shadows

### The Fear Factor

Dungeon lighting should create tension:
- Long shadows stretching down corridors (use directional light or spot lights)
- Flickering torches that make shadows dance (could be an enemy moving, or just the flame)
- Sudden darkness when a torch goes out (an event during combat or exploration)
- The party's own light sources (a Mage's staff glow, a lantern held by the Warrior) moving with them

When the party enters a new room, the room should be dark until they bring their lights in. Lumen handles this naturally: no precalculated lighting means dark rooms stay dark until a light source enters.

---

## Lighting the Overworld

The overworld has the most complex lighting because it involves sky, sun, weather, and time of day.

### The Sun (Directional Light)

- Place a **Directional Light** to simulate the sun
- Colour: slightly warm white (R: 1.0, G: 0.95, B: 0.9)
- Intensity: 3-8 lux (UE5 uses physical light units by default)
- Rotation: Controls time of day. Rotating the light changes where shadows fall.
- Enable **Atmosphere Sun Light**: This integrates the light with the sky atmosphere

### Sky and Atmosphere

- Add a **Sky Atmosphere** component for realistic sky rendering
- Add a **Sky Light** with **Real Time Capture** enabled so it updates as the time of day changes
- The sky colour, cloud brightness, and ambient light all shift as you rotate the sun

### Time of Day

For Tabletop Quest, time of day matters. The tabletop view might show a cozy evening session (warm sunset light through windows). When the player zooms into the game world, the time of day could match the narrative: a dawn raid on a goblin camp, a midday trek through meadows, a nighttime infiltration of a castle.

Build a simple time-of-day system:
1. Create a Blueprint Actor called `BP_TimeOfDay`
2. Store the sun rotation as a float (0 = midnight, 90 = sunrise, 180 = noon, 270 = sunset)
3. On Tick: rotate the Directional Light and update the Sky Light
4. Expose the time value to the quest system so narrative events can set the time

### Weather

UE5's Niagara particle system handles rain, snow, and fog. For the overworld:
- **Rain**: Niagara particle system with collision. Wet material variant activates (increased roughness reduction, slight darkening of base colour). Puddles form (planar reflections or SSR).
- **Fog**: Exponential Height Fog with high density. Reduces visibility, creates an eerie atmosphere for haunted areas.
- **Storm**: Combine rain with dramatic directional light changes (darker sky, brief lightning flashes).

---

## Nanite: Infinite Geometry Detail

Nanite is UE5's virtualized geometry system. It lets you render meshes with millions of polygons at runtime without LODs, without draw call batching, without the usual performance concerns.

### What Nanite Does

Traditional game rendering requires Level of Detail (LOD) meshes: high-poly for close up, medium-poly for mid-range, low-poly for far away. Artists spend hours creating these LOD chains. Nanite eliminates this entirely. You import a 10-million-polygon rock, enable Nanite on it, and the engine streams exactly the polygons needed for each pixel on screen.

Think of it like streaming video. YouTube does not send you every pixel of a 4K video. It sends the pixels you actually see on your screen at your connection speed. Nanite does the same for geometry.

### Where Nanite Shines in Tabletop Quest

**The Overworld:** Open-world environments with rocks, cliffs, ruins, and terrain. Each rock can be millions of polygons for detailed close-up inspection, and Nanite automatically reduces detail at distance.

**Dungeon Props:** Detailed stone carvings, ornate pillars, treasure piles, and statues. Import high-poly assets from Megascans and Nanite handles the rest.

**The Tabletop:** The game table itself, with wood grain detail, carved legs, and surface wear, can be extremely high-poly for those close-up shots during the zoom transition.

### Where Nanite Does NOT Work

Nanite (as of UE5.7) does not support:
- **Skeletal meshes** (animated characters). Your Warrior, Mage, and Goblin characters still need traditional LODs.
- **Translucent materials** (glass, water, magic effects). These use the traditional rendering path.
- **World Position Offset** (vertex animation). Foliage swaying in the wind needs the traditional path.

For Tabletop Quest: Use Nanite for all static environment geometry (walls, floors, rocks, props, furniture). Use traditional meshes for characters, foliage, and VFX.

### Enabling Nanite

1. Import a mesh (or select an existing Static Mesh in the Content Browser)
2. In the mesh's Details panel, find **Nanite Settings**
3. Check **Enable Nanite Support**
4. The mesh will rebuild with Nanite data

For Megascans assets, Nanite is typically enabled by default when you download them through Fab.

---

## Post-Processing: The Final Polish

Post-processing effects are full-screen filters that run after the scene is rendered but before the image reaches your monitor. They are the difference between "looks like a game" and "looks like a movie."

### The Post Process Volume

Place a **Post Process Volume** in your level. In its Details panel, you control all post-processing effects. Set its Bounds to "Unbound" to affect the entire level, or keep it bounded to affect only specific areas (useful for transitioning from tavern warmth to dungeon coolness).

### Effects for Tabletop Quest

**Bloom:**
- Simulates light bleeding from bright sources. A torch glow, a magical spell, sunlight through a window.
- Intensity: 0.5-1.0 (subtle glow, not blinding)
- Threshold: 1.0 (only the brightest sources bloom)
- For the tabletop view: slightly higher bloom (1.5) to make candlelight feel warm and dreamy

**Auto Exposure (Eye Adaptation):**
- Simulates how your eyes adjust to brightness changes. Walk from a bright overworld into a dark dungeon, and the scene gradually brightens as your "eyes" adjust.
- Min/Max Brightness: Set to control the range. For dungeons, set Min EV100 to -2 and Max to 4. For overworld, Min 4 and Max 14.
- Speed: 1.0-2.0 (how fast adaptation happens)
- This is essential for the tabletop zoom. The tabletop scene is well-lit, the dungeon is dark. Auto exposure handles the transition smoothly.

**Vignette:**
- Darkens the screen edges, drawing the eye to the center.
- Intensity: 0.3-0.5 (subtle)
- For the tabletop view: slightly more vignette (0.6) to create a "looking through a viewfinder" feel

**Colour Grading:**
- Adjusts the overall colour balance of the scene.
- Use a **Lookup Table (LUT)** texture for cinematic colour grading
- Or adjust manually:
  - **Temperature**: Push warm (+10 to +20) for the tavern, cool (-10 to -20) for the dungeon
  - **Tint**: Slight green for forests, slight purple for magical areas
  - **Saturation**: 1.0-1.2 for vibrant fantasy, 0.8-0.9 for grim dungeon

**Ambient Occlusion:**
- Darkens crevices and contact points between objects. Makes geometry feel grounded and solid.
- Lumen provides its own AO, but the screen-space AO adds extra contact shadow detail
- Intensity: 0.5-0.8
- Radius: 10-30 (larger radius for softer shadows in bigger spaces)

**Depth of Field (Selective):**
- Not always on, but useful for specific moments:
  - Tabletop view: Shallow DoF focusing on the miniatures, table edges blurred
  - Ability activation: Brief DoF pulse during dramatic moments (the camera system from the GDD mentions camera angle changes on certain abilities)
  - Conversation/cutscene: Focus on the NPC speaking

**Motion Blur:**
- Slight motion blur (0.3-0.5) in real-time combat mode for a sense of speed
- Off or minimal in turn-based mode (clarity is more important)

### Per-Area Post-Processing

Use bounded Post Process Volumes to create distinct atmospheres:

- **Tavern Volume**: Warm temperature (+15), higher bloom (1.2), slight vignette (0.5)
- **Dungeon Volume**: Cool temperature (-15), lower bloom (0.5), higher contrast, heavier AO
- **Overworld Volume**: Neutral temperature, standard bloom, vivid saturation (1.15)
- **Boss Room Volume**: Dramatic: high contrast, desaturated edges, intense bloom from boss effects

When the player moves between areas, the post-processing blends smoothly. Walking from the tavern to the dungeon entrance gradually shifts from warm to cold.

---

## Building the Tabletop Scene Materials

The tabletop scene is the player's home base. Every session starts and ends here. It deserves special attention.

### The Table Surface

The gaming table is the most important material in the tabletop scene. It needs to feel like real wood you could reach out and touch.

1. Start with a high-quality wood Megascans material
2. Create a Material Instance and adjust:
   - Roughness: 0.35 (slightly polished from years of use)
   - Normal Intensity: 1.2 (enhance the grain visibility)
   - Add a subtle wear mask at the edges (lighter roughness where hands rest)

### The Miniatures

The miniatures on the tabletop need a "painted" look. They are not photorealistic models. They are hand-painted figurines.

Create a `M_PaintedMiniature` material:
1. Base Colour: Use the character's actual texture but desaturate slightly and add a subtle paint stroke overlay
2. Roughness: 0.6-0.7 (matte paint finish)
3. Metallic: 0.0 (even metallic parts are painted, not real metal)
4. Add a subtle clear coat effect (thin lacquer) with a Lerp between 0.6 roughness and 0.3 roughness, masked by a clear coat pattern

This material sells the "painted miniature" illusion. When the camera zooms in and the miniature transforms into a full-scale character, the material morphs from painted to realistic. That transition is a material effect you can build with a Lerp driven by a parameter that the zoom Blueprint controls.

### Dice, Papers, and Props

The tabletop props reinforce the cozy game night atmosphere:
- **Dice**: Smooth plastic with slight translucency (Subsurface Scattering). When backlit by candles, light should pass slightly through the dice edges.
- **Character Sheets**: Paper material with slight roughness variation (ink is smoother than the paper around it). Use a parchment Megascans texture.
- **Rulebooks**: Leather covers with embossed details (high-detail normal map). Aged, well-loved look.
- **Beverages**: Glass material with refraction for mugs and bottles. Liquid inside uses a translucent material with tinted absorption.

---

## Building Dungeon Materials

The dungeon is where most combat happens. Materials need to feel oppressive, ancient, and slightly dangerous.

### Stone Walls

Start with a Megascans stone wall material. Customize:
1. Darken the base colour (multiply by 0.7 to absorb more light)
2. Increase roughness slightly (0.75, rougher than normal)
3. Add the MF_Moss Material Function: blend moss onto surfaces that face upward
4. Add the MF_Wetness Material Function: make lower walls damp (reduced roughness, darker colour)
5. Add subtle colour variation using a large-scale noise texture (some stones slightly warmer or cooler than others)

### The Dungeon Floor

Flagstones with dirt between them:
1. Use two Megascans materials: flagstone and dirt
2. Blend using a mask based on vertex colour or a blend texture
3. The dirt collects in the gaps between flagstones
4. Add puddle reflections in low spots (roughness near 0.0 in puddle areas)

### Atmospheric Details

- **Cobwebs**: Translucent material with thin, wispy geometry
- **Dripping Water**: Animated material with vertex displacement (water drops running down walls)
- **Magical Runes**: Emissive material that pulses with a sine-wave animation
- **Torch Flame**: Niagara particle effect with emissive material that contributes to Lumen lighting

---

## Building Overworld Materials

The overworld needs to feel expansive and alive.

### Landscape Material

For terrain, use a **Landscape Material** with multiple layers that blend based on painting:
- **Grass**: Green base, high roughness (0.8), displacement for height variation
- **Dirt Path**: Brown base, medium roughness (0.5)
- **Rock**: Grey base, medium roughness (0.6), strong normal map
- **Snow**: White base, low roughness (0.3, slightly glossy ice)

Each layer uses a Megascans texture set. The blending is painted directly on the landscape in the editor using the Landscape Paint tool.

### Foliage

Trees, bushes, and grass use traditional meshes (not Nanite) with:
- Two-sided materials (foliage is visible from both sides)
- Subsurface Scattering: Light passing through leaves creates a warm green glow
- Wind animation: World Position Offset driven by a time-based sine wave
- Megascans provides high-quality foliage assets pre-configured for UE5

### Water

Rivers and lakes use a Water material:
- Translucent, with depth-based colour (shallow water is clear, deep water is dark blue-green)
- Surface normal animation (scrolling normal maps for ripples)
- Reflection: Lumen handles this through screen-space reflections
- Foam at edges where water meets shore (mask based on scene depth difference)

UE5 has a built-in Water system (Water plugin) that handles rivers, lakes, and oceans with automatic shoreline detection and foam.

---

## Python Automation for Materials

Claude can generate Python scripts to automate material setup and asset management:

### Batch-Applying Materials to Meshes

```python
import unreal

def apply_material_to_actors(material_path, actor_tag):
    """Apply a material to all actors in the level with a specific tag."""
    material = unreal.EditorAssetLibrary.load_asset(material_path)
    actors = unreal.EditorLevelLibrary.get_all_level_actors()

    count = 0
    for actor in actors:
        if actor.actor_has_tag(actor_tag):
            mesh_comp = actor.get_component_by_class(
                unreal.StaticMeshComponent)
            if mesh_comp:
                mesh_comp.set_material(0, material)
                count += 1

    unreal.log(f"Applied material to {count} actors with tag '{actor_tag}'")

# Usage: Tag all dungeon walls with "DungeonWall" in the editor
apply_material_to_actors(
    "/Game/Materials/Dungeon/MI_DungeonStone",
    "DungeonWall"
)
```

### Generating Material Instances from a Spreadsheet

```python
import unreal
import json

# Define variations as data
variations = [
    {"name": "MI_StoneWall_Dry", "roughness": 0.8, "tint": (0.3, 0.28, 0.25)},
    {"name": "MI_StoneWall_Wet", "roughness": 0.3, "tint": (0.2, 0.18, 0.16)},
    {"name": "MI_StoneWall_Mossy", "roughness": 0.7, "tint": (0.25, 0.3, 0.2)},
]

parent_material = unreal.EditorAssetLibrary.load_asset(
    "/Game/Materials/Dungeon/M_DungeonStone"
)

for v in variations:
    # Create Material Instance
    factory = unreal.MaterialInstanceConstantFactoryNew()
    factory.set_editor_property("InitialParent", parent_material)

    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    mi = asset_tools.create_asset(
        v["name"],
        "/Game/Materials/Dungeon/Instances/",
        unreal.MaterialInstanceConstant,
        factory
    )

    if mi:
        # Set scalar parameter
        unreal.MaterialEditingLibrary.set_material_instance_scalar_parameter_value(
            mi, "Roughness", v["roughness"]
        )
        unreal.log(f"Created: {v['name']} (roughness={v['roughness']})")
```

This is particularly useful when you have dozens of material variations for the dungeon (dry stone, wet stone, mossy stone, cracked stone, blood-stained stone, etc.).

---

## The Tabletop Zoom Transition: A Material Challenge

The signature visual moment of Tabletop Quest is the zoom from tabletop to game world. This transition relies heavily on material effects.

### The Concept

The camera is looking down at the tabletop. The player selects a location. The camera descends toward the miniatures. As it gets closer:
1. The table edges blur and fade (depth of field + fog)
2. The miniatures grow and their materials morph from "painted" to "realistic"
3. The 2D map painted on the table transforms into 3D terrain
4. Sound transitions from "quiet room" to "ambient game world"
5. The camera reaches ground level and the player is fully immersed

### The Material Morph

The miniature-to-character material transition uses a parameter-driven Lerp:

```
Material Parameter: TransitionAlpha (0.0 = miniature, 1.0 = full scale)

Base Colour = Lerp(PaintedTexture, RealisticTexture, TransitionAlpha)
Roughness = Lerp(0.65, RealisticRoughness, TransitionAlpha)
Normal Intensity = Lerp(0.5, 1.0, TransitionAlpha)
Detail Tiling = Lerp(1.0, 8.0, TransitionAlpha)  // More detail up close
```

As the zoom Blueprint drives `TransitionAlpha` from 0 to 1 over 2-3 seconds, the material smoothly morphs. The player sees a painted miniature gradually gain realistic skin texture, metallic armor reflections, and cloth wrinkles.

### Post-Processing During Transition

During the zoom, blend the post-processing:
- Start: Warm tabletop settings (high bloom, shallow DoF, warm colour grade)
- End: Game world settings (lower bloom, no DoF, location-appropriate colour grade)
- The blend follows the same TransitionAlpha parameter

This is one of the more technically complex effects in the game, but it is built entirely from systems you already know: material parameters, post-processing volumes, and Blueprint-driven animation.

---

## Emissive Materials and Combat VFX

Combat in Tabletop Quest is not just about numbers. It is about the visual spectacle. When the Mage casts Fireball, the room should light up orange. When the Cleric channels Holy energy, a golden glow should wash over the party. When a Goblin Shaman curses someone with Poison, sickly green particles should swirl around the target. All of this relies on emissive materials and their interaction with Lumen.

### Emissive Materials as Light Sources

In UE5 with Lumen, any material with an emissive component acts as a light source. You do not need to place a separate Point Light next to every glowing object. The material itself emits light that bounces around the scene.

For a magical rune carved into a dungeon wall:

```
Emissive Colour = RuneTexture * EmissiveColour * EmissiveIntensity
```

- `RuneTexture`: A greyscale mask where white = glowing, black = not glowing
- `EmissiveColour`: The colour of the glow (blue for arcane, green for poison, gold for holy)
- `EmissiveIntensity`: How bright the glow is (5-20 for subtle glow, 50-100 for intense)

The rune glows in the material, and Lumen picks it up as a light source. The blue arcane rune casts blue light on the floor in front of it. No extra lights needed.

### Ability VFX Materials

Each damage type in Tabletop Quest has a distinct visual language:

| Damage Type | Colour | Material Effect |
|------------|--------|----------------|
| Physical | White/grey | Slash/impact distortion, no glow |
| Fire | Orange-red | Intense emissive, flickering particles |
| Ice | Cyan-white | Frost crystals, subtle emissive, frosted roughness |
| Lightning | Purple-white | Bright flashing emissive, branching bolt meshes |
| Poison | Sickly green | Swirling particles, subtle emissive |
| Holy | Warm gold | Radiant emissive, soft bloom, upward particles |
| Necrotic | Dark purple | Wisps of dark energy, inverse emissive (absorbs light) |
| Psychic | Pink-violet | Distortion effect, screen-space ripple |

When a Fireball explodes, the emissive material on the fire particles lights up the surrounding area with warm orange. The Lumen response is immediate. Dungeon walls catch the firelight. Enemy faces are illuminated for a split second. Then the light fades as the fire dissipates.

This kind of dynamic, ability-driven lighting is what makes combat feel impactful. It is not just numbers subtracting from a health bar. It is a visual event that transforms the environment for a moment.

### Status Effect Visuals

Status effects need persistent visual indicators so the player knows which combatants are affected:

- **Burning**: Subtle fire particles clinging to the character. Emissive material at low intensity (continuous warm glow).
- **Frozen**: A frost overlay material applied on top of the character's base material. Increases roughness (frosted surface) and adds a subtle blue emissive at the edges.
- **Poisoned**: Green tint on the character's skin material. Occasional green particle wisps.
- **Stunned**: Stars or dizzy-swirl particles above the head (classic but effective).
- **Blessed**: Golden particle motes floating around the character. Subtle upward golden glow.

These effects persist throughout the status duration and disappear when the effect ends. In Blueprints, bind to the `OnStatusEffectApplied` and `OnStatusEffectRemoved` delegates to spawn and destroy the VFX.

### Dynamic Material Instances for VFX

When you need to modify a material at runtime (like the frost overlay spreading across a character when they get Frozen), use **Dynamic Material Instances**:

```
// In Blueprint pseudocode
OnStatusEffectApplied (Frozen):
    Create Dynamic Material Instance from MI_FrostOverlay
    Set parameter "FrostAmount" to 0.0
    Apply to character mesh overlay slot
    Animate "FrostAmount" from 0.0 to 1.0 over 0.5 seconds

OnStatusEffectRemoved (Frozen):
    Animate "FrostAmount" from 1.0 to 0.0 over 0.3 seconds
    Remove overlay material
```

The frost creeps across the character's surface in half a second, and recedes when the effect ends. The material parameter drives the visual, and the Blueprint controls the timing.

---

## Performance Considerations

Beautiful graphics only matter if the game runs smoothly. Here are the key performance considerations for Tabletop Quest's visuals.

### Lumen Performance

Lumen's cost scales with scene complexity. For Tabletop Quest:
- **Tavern and dungeon (indoor)**: Low cost, Lumen excels in enclosed spaces
- **Overworld (outdoor)**: Higher cost due to long trace distances
- **Target**: 60 FPS on a mid-range GPU (RTX 3060 / RX 6700 XT equivalent)
- **Fallback**: If Lumen is too expensive, switch to Screen Space Global Illumination (SSGI) as a quality option

### Nanite Performance

Nanite has very low overhead for static geometry. The main cost is memory for the Nanite data. For Tabletop Quest:
- Budget 2-4 GB of VRAM for Nanite geometry data
- Use Nanite for environment meshes (thousands of them, no problem)
- Keep characters on traditional meshes (Nanite does not support skeletal meshes anyway)

### Material Complexity

Each material instruction costs GPU time. For Tabletop Quest:
- Keep base materials under 200 instructions (check in the Material Editor stats)
- Use Material Instances for variations (zero extra cost)
- The most complex materials should be for hero assets (the tabletop, the party characters, boss enemies)
- Background props can use simpler materials

### Texture Memory

High-resolution textures eat VRAM:
- 4K textures for hero surfaces (tavern table, character armor, boss enemies)
- 2K textures for primary environment surfaces (walls, floors)
- 1K textures for distant/small props
- Use Virtual Textures to stream textures on demand

---

## Summary: What You Built

- **PBR materials** for three environments: tavern (warm wood, leather, metal), dungeon (rough stone, moss, wetness), and overworld (grass, dirt, rock, water)
- **Material Instances** for efficient variations without duplicating shaders
- **Megascans integration** for photorealistic base assets customized to your art style
- **Lumen lighting** for all three environments: cozy tavern, moody dungeon, expansive overworld
- **Post-processing** per-area: warm tavern, cold dungeon, vibrant overworld, dramatic boss rooms
- **Nanite meshes** for detailed environment geometry with zero LOD management
- **The tabletop zoom transition** material morph from painted miniature to realistic character
- **Python automation** for batch material application and variation generation

Your game world now has a visual identity. The combat from Module 04 plays out in environments that feel real and atmospheric. In Module 06, you will build the camera and input systems that let the player experience these environments from the best possible angles.
