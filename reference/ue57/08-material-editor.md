## Material Editor

The Material Editor is Unreal Engine's node-based visual shader authoring tool. In UE 5.7, the **Substrate** material framework has reached **production-ready** status, replacing the legacy fixed shading model system with a modular, physically accurate material authoring and rendering framework.

### Material Domains
| Domain | Description |
|--------|-------------|
| **Surface** | Standard 3D surface materials (default) |
| **Deferred Decal** | Projects onto surfaces; supports dbuffer decals for accurate normal/roughness blending |
| **Post Process** | Applied as a post-process effect via Post Process Volume or camera |
| **Light Function** | Masks or patterns applied to light sources (like a gobo) |
| **Volume** | Used with volumetric fog and cloud rendering |
| **User Interface** | Materials for UMG/Slate UI widgets |

**In your games:**

| Game | Domain | Use Case |
|------|--------|----------|
| DnD RPG | Surface | Every character, enemy, weapon, armour piece, terrain, dungeon wall, and tabletop prop uses Surface materials |
| DnD RPG | Deferred Decal | Blood splatter decals on the ground after combat, scorch marks from fireball impacts, magical rune circles projected onto the floor for spell areas |
| DnD RPG | Post Process | Damage vignette (red flash when hit), Poisoned screen tint (green overlay), Stunned blur effect, the warm-to-cool colour shift during the tabletop zoom transition |
| DnD RPG | Light Function | Candlelight flicker pattern on the tabletop scene's point lights, creating a gobo shadow for the window on the room wall |
| DnD RPG | Volume | Volumetric fog in dungeon corridors, misty forests, and the atmospheric haze during the tabletop-to-world transition |
| DnD RPG | User Interface | Stylised backgrounds for the HUD elements, parchment-texture ability bar, compass minimap border |
| Wizard's Chess | Surface | Marble and obsidian piece materials, the board surface, the environment around the board |
| Wizard's Chess | Deferred Decal | Projected glow patterns on squares that are valid move targets, a "last move" indicator decal on the previous square |
| Wizard's Chess | Post Process | Check warning effect (subtle red pulse), checkmate dramatic freeze with desaturation |
| Wizard's Chess | Light Function | Flickering torchlight patterns in a dungeon-themed chess environment |

### Blend Modes
| Mode | Description |
|------|-------------|
| **Opaque** | Fully solid, no transparency. Best performance. |
| **Masked** | Binary transparency via Opacity Mask and clip threshold |
| **Translucent** | Smooth transparency via Opacity. Higher cost. |
| **Additive** | Adds color to the background (glows, lasers, holograms) |
| **Modulate** | Multiplies with the background (darkening effects, shadows) |
| **Alpha Composite (Premultiplied Alpha)** | For pre-multiplied alpha textures |

**In your games:**

| Game | Blend Mode | Use Case |
|------|-----------|----------|
| DnD RPG | Opaque | All solid surfaces: character armour, weapons, dungeon walls, terrain, the tabletop itself. Best performance, use this for everything that is not transparent |
| DnD RPG | Masked | Foliage (leaves with alpha cutout), chain mail gaps, lattice windows in dungeons, the hex grid overlay (solid grid lines, transparent hexes) |
| DnD RPG | Translucent | Ghost enemies (semi-transparent), magical barriers, potion liquid, the fade-out effect on table edges during the zoom transition |
| DnD RPG | Additive | Spell glow effects (Cleric's divine light, Mage's arcane aura), torch flame halos, healing particle glows. Additive is perfect because it brightens without occluding the scene behind it |
| Wizard's Chess | Opaque | Chess pieces (marble, obsidian, crystal), the board itself, the environment |
| Wizard's Chess | Translucent | Ghostly highlight on valid move squares, the magic trail that follows moving pieces |
| Wizard's Chess | Additive | The enchanted glow on active pieces, the board's reactive light pulses during check, magical energy halos |
| Wizard's Chess | Masked | Decorative filigree on the board border, ornate piece bases with cut-out patterns |

### Shading Models (Legacy and Substrate)

#### Legacy Shading Models
| Model | Use Case |
|-------|----------|
| **Default Lit** | Standard PBR surfaces; Base Color, Metallic, Roughness, Normal |
| **Unlit** | No lighting; Emissive only. HUDs, backgrounds, stylized effects |
| **Subsurface** | Light scattering through thin materials (wax, leaves) |
| **Subsurface Profile** | Higher-quality SSS with a profile texture (skin rendering) |
| **Preintegrated Skin** | Optimized skin shading model |
| **Clear Coat** | Two-layer material: base surface with clear lacquer (car paint, wet surfaces) |
| **Clear Coat Bottom Normal** | Clear coat with independent normal for base layer |
| **Two Sided Foliage** | Subsurface-like; transmits light through backfaces (leaves, thin cloth) |
| **Hair** | Strand-based hair shading using Marschner model |
| **Cloth** | Fabric shading with fuzz layer and wrap lighting |
| **Eye** | Specialized cornea/iris refraction model |
| **Single Layer Water** | Water surface with depth-based absorption and refraction |
| **Thin Translucent** | Colored glass, thin plastic; colored translucency without volume |
| **From Material Expression** | Allows per-pixel shading model selection (advanced) |

**In your games:**

| Game | Shading Model | Use Case |
|------|--------------|----------|
| DnD RPG | Default Lit | Most surfaces: armour, weapons, stone, wood, dirt. Standard PBR for anything that is not special-cased below |
| DnD RPG | Unlit | The painted miniature material (miniatures on the tabletop do not receive world lighting; they should look like painted figurines lit by the room's warm lamplight). Also used for HUD elements |
| DnD RPG | Subsurface | Candle wax on the tabletop, glowing mushrooms in caves, thin leather on Rogue's armour showing light bleeding through |
| DnD RPG | Subsurface Profile | Character skin rendering for close-up dialogue sequences with AI DM NPCs. The SSS profile gives realistic light scattering through ears, noses, and fingers |
| DnD RPG | Clear Coat | The Warrior's polished plate armour, wet cave surfaces, lacquered wooden tabletop surface |
| DnD RPG | Two Sided Foliage | Forest canopy leaves, dungeon moss, thin cloth banners that transmit light on both sides |
| DnD RPG | Hair | Character hair for all 5 races (especially important for Elves with long flowing hair) |
| DnD RPG | Cloth | Mage's robes, Cleric's vestments, Bard's cape, the tablecloth on the gaming tabletop |
| DnD RPG | Eye | Close-up character eyes during dialogue or character creation screen |
| DnD RPG | Single Layer Water | Rivers, lakes, and puddles in the exploration world |
| Wizard's Chess | Default Lit | Marble and obsidian piece surfaces, the board, the environment |
| Wizard's Chess | Clear Coat | Polished crystal chess pieces with a glossy lacquer finish |
| Wizard's Chess | Thin Translucent | Coloured glass chess pieces variant (a stained-glass aesthetic set) |
| Wizard's Chess | Cloth | A velvet mat under the chess board |

#### Substrate Material Model (Production-Ready in UE 5.7)
Substrate replaces fixed shading models with composable BSDF nodes. Enable via Project Settings > Rendering > Substrate > Enable Substrate.

**Substrate BSDF Nodes:**
| Node | Description |
|------|-------------|
| **Substrate Slab** | The primary/universal BSDF. Represents a single slab of matter with diffuse albedo, F0/F90 specular, roughness, normal, subsurface, emissive, second roughness, fuzz, and metallic properties. Multiple slabs can be layered. |
| **Substrate Simple Clear Coat** | Dedicated clear coat BSDF; simpler setup than layering two Slabs |
| **Substrate Single Scattering** | Volumetric single-scattering for participating media, fog-like effects |
| **Substrate Hair** | Specialized BSDF for strand hair rendering |
| **Substrate Eye** | Specialized BSDF for eye rendering with cornea refraction |
| **Substrate Light** | Emissive-only BSDF for unlit luminance |
| **Substrate Unlit** | Unlit surface material for UI or custom shading |

**Substrate Operator Nodes (Layering/Blending):**
| Node | Description |
|------|-------------|
| **Substrate Horizontal Mix** | Blends two BSDFs side by side based on a mask (like a lerp between materials) |
| **Substrate Vertical Layer** | Layers one BSDF on top of another with physically correct light transport between layers |
| **Substrate Add** | Combines the contributions of two BSDFs additively |
| **Substrate Weight** | Scales a BSDF's contribution by a weight factor |
| **Substrate Coverage Weight** | Controls coverage for partial transparency |
| **Substrate Transmittance to Mean Free Path** | Converts color transmittance to mean free path for subsurface scattering |

**Key Substrate Capabilities:**
- Combine metal, clear coat, skin, cloth, and other behaviors in a single material with physical accuracy
- Realistic multi-layered car paint, oiled leather, blood/sweat on skin
- Production-ready in 5.7 with over 280 free automotive Substrate materials available on Fab
- Works with both Lumen and Path Tracer rendering

**In your games:**

- **DnD RPG (Substrate)**: The tabletop-to-world zoom transition is a perfect Substrate use case. With Substrate Horizontal Mix, you can blend between the "painted miniature" BSDF (unlit, hand-painted wood texture) and the "living character" BSDF (full PBR skin, cloth, metal) using the `TransitionAlpha` parameter as the mask. One material, one parameter, physically correct blending. Without Substrate, you would need separate material swaps or complex Material Attribute blending. Substrate Vertical Layer is ideal for the Warrior's armour: a scratched metal base layer with a clear coat polish on top, or the Rogue's leather with an oiled sheen. For the tabletop itself, layer a wood grain base with a varnish clear coat using Substrate Simple Clear Coat.
- **Wizard's Chess (Substrate)**: Use Substrate Vertical Layer for the marble pieces: a subsurface marble base with a polished specular clear coat on top, creating realistic depth. For obsidian pieces, use a Substrate Slab with high metallic and low roughness. Substrate Horizontal Mix lets you blend between the normal piece material and a "selected" emissive material based on a selection mask, all in one shader.

**Substrate Operator examples for both games:**

| Operator | DnD RPG Example | Wizard's Chess Example |
|----------|----------------|----------------------|
| Horizontal Mix | Blending miniature and living character materials via TransitionAlpha | Blending normal and selected/highlighted piece states |
| Vertical Layer | Warrior's metal armour with clear coat polish, Rogue's oiled leather | Marble piece with polished surface layer |
| Add | Combining a base material with an emissive magical glow (Mage's staff) | Adding emissive energy veins to pieces during a power move |
| Weight | Scaling the emissive contribution based on mana charge level | Dimming the enchanted glow on captured pieces as they shatter |
| Transmittance to MFP | Subsurface scattering on character skin, glowing mushrooms | Light passing through translucent crystal chess pieces |

---

### Node Categories

#### Texture Sampling
| Node | Description |
|------|-------------|
| **Texture Sample** | Samples a Texture2D using UVs; outputs RGBA channels |
| **Texture Sample Parameter 2D** | Parameterized version; exposed to Material Instances |
| **Texture Object / Texture Object Parameter** | Passes texture as an object reference to functions |
| **Texture Coordinate** | Generates UV coordinates with tiling (UTiling, VTiling) |
| **Texture Sample Parameter Cube** | Samples cubemap textures |
| **Texture Sample Parameter Volume** | Samples 3D volume textures |
| **Texture Sample Parameter SubUV** | For flipbook/sprite sheet sampling |
| **Scene Texture** | Samples GBuffer data (SceneColor, SceneDepth, WorldNormal, BaseColor, Roughness, Metallic, etc.) |
| **Runtime Virtual Texture Sample** | Samples RVT for landscape blending |
| **Shared Wrap / Shared Clamp** | Reuses sampler states to reduce sampler count |
| **Automatic View Mip Bias** | Adjusts mip level based on virtual texturing or TSR |

**In your games:**

| Game | Node | Use Case |
|------|------|----------|
| DnD RPG | Texture Sample Parameter 2D | The core of the miniature-to-real crossfade: expose both the "painted wood" texture and the "real skin/cloth/metal" texture as parameters, then lerp between them using TransitionAlpha |
| DnD RPG | Scene Texture (SceneDepth) | Post-process depth-of-field effect during the tabletop view: the tabletop is in focus, distant room corners blur out |
| DnD RPG | Runtime Virtual Texture Sample | Landscape blending in the exploration world: grass-to-dirt-to-stone transitions on terrain without visible seams |
| DnD RPG | Texture Coordinate | Tiling dungeon wall textures: set UTiling and VTiling to repeat stone brick textures across large surfaces |
| DnD RPG | Texture Sample Parameter SubUV | Flipbook sprite sheets for 2D spell icons on the ability bar HUD material |
| Wizard's Chess | Texture Sample Parameter 2D | Exposing the marble/obsidian diffuse and normal textures as parameters so one master material serves all piece colour variants |
| Wizard's Chess | Texture Coordinate | Tiling the board square textures at exactly 1:1 per square (each square gets one full tile of the marble pattern) |

#### Math Nodes
| Node | Description |
|------|-------------|
| **Add** | Adds two values |
| **Subtract** | Subtracts B from A |
| **Multiply** | Multiplies two values. Fundamental for tinting, scaling, masking |
| **Divide** | Divides A by B |
| **Lerp (Linear Interpolate)** | Blends between A and B by Alpha. Most-used blending node |
| **Power** | Raises Base to Exponent. Used for contrast adjustment in masks |
| **SquareRoot** | Square root |
| **Abs** | Absolute value |
| **Ceil / Floor / Round / Truncate / Frac** | Rounding and fractional operations |
| **Clamp / Saturate** | Constrains values. Saturate clamps to 0..1 (free on GPU) |
| **Min / Max** | Returns smaller/larger value |
| **One Minus** | Returns 1 - x. Inverts masks |
| **Dot Product** | Dot product of two vectors |
| **Cross Product** | Cross product of two 3D vectors |
| **Normalize** | Normalizes a vector to unit length |
| **Append** | Combines scalars into a vector (e.g., two floats to float2) |
| **Component Mask** | Selects R, G, B, A channels from a vector |
| **Sin / Cos / Tan / Asin / Acos / Atan / Atan2** | Trigonometry for procedural effects |
| **Fmod** | Floating-point modulo |
| **If** | Conditional; A > B, A == B, A < B outputs |
| **Step** | Returns 0 or 1 based on threshold (hard edge) |
| **SmoothStep** | Hermite interpolation between two thresholds |
| **Linear Interpolate Using Texture Alpha** | Lerp shortcut using texture alpha |
| **Desaturation** | Converts color toward grayscale by a fraction |
| **Channel Mask Parameter** | Exposes channel selection to Material Instances |

**In your games:**

| Game | Node | Use Case |
|------|------|----------|
| DnD RPG | Lerp | The single most important node for the zoom transition: `Lerp(MiniatureTexture, RealTexture, TransitionAlpha)` blends between painted miniature and living character appearances |
| DnD RPG | Power | Sharpening or softening masks: adjusting the hex grid overlay edge sharpness, making condition effect masks (Poisoned green tint) fade more gradually |
| DnD RPG | Multiply | Tinting: multiply Base Color by a condition colour vector (green for Poisoned, blue for Frozen, red for Burning). Also multiply Emissive by intensity for magical glow control |
| DnD RPG | One Minus | Inverting the TransitionAlpha to drive effects that fade OUT during zoom (table edge opacity, room lighting contribution) while others fade IN |
| DnD RPG | SmoothStep | Smooth edge transitions on the hex grid overlay (avoiding harsh aliased edges between grid lines and transparent hexes) |
| DnD RPG | Desaturation | Desaturating a defeated enemy's material to grey as a death visual before ragdoll |
| DnD RPG | Clamp / Saturate | Keeping the TransitionAlpha between 0 and 1 (Saturate is free on GPU, so use it liberally) |
| Wizard's Chess | Lerp | Blending between the normal board square colour and the highlighted colour (green for valid moves, red for threats) |
| Wizard's Chess | Step | Hard edge on the check indicator glow: squares inside the threatened zone are fully bright, outside are fully dark, no gradient |
| Wizard's Chess | SmoothStep | Soft edge on the magic trail effect: the trail fades smoothly from bright at the piece to transparent at the tail |
| Wizard's Chess | If node | Conditional logic: if the square is threatened by the opponent, output red tint; if it is a valid move, output green tint; otherwise, output normal colour |

#### Vector Operations
| Node | Description |
|------|-------------|
| **Transform** | Converts vectors between spaces (Tangent, Local, World, View, Camera) |
| **Transform Position** | Converts positions between coordinate spaces |
| **Rotate About Axis** | Rotates a vector around an arbitrary axis |
| **Fresnel** | Calculates view-angle-dependent falloff (rim lighting) |
| **Camera Vector / Camera Position** | View direction and camera world position |
| **Reflection Vector** | Environment reflection direction |
| **Vertex Normal WS** | Per-vertex world-space normal |
| **Pixel Normal WS** | Per-pixel world-space normal (after normal map) |
| **Light Vector** | Direction to light source |
| **Constant 2Vector / 3Vector / 4Vector** | Vector constants |
| **Vector Parameter** | Exposed vector parameter (often used for color) |

**In your games:**

| Game | Node | Use Case |
|------|------|----------|
| DnD RPG | Fresnel | Rim lighting on characters during selection in turn-based mode (a glowing edge outline that makes the active character stand out). Also used for magical aura effects on enchanted weapons |
| DnD RPG | Camera Vector / Camera Position | Driving view-dependent effects: the tabletop map material looks different from directly above vs an angled view. Camera Position feeds the distance fade on foliage during the zoom transition |
| DnD RPG | Transform (Tangent to World) | Converting normal map data to world space for effects that need world-space normals (snow accumulation on upward-facing surfaces, rain wetness) |
| DnD RPG | Vertex Normal WS | World-aligned blending: snow or moss accumulates on upward-facing normals of dungeon ruins |
| Wizard's Chess | Fresnel | The enchanted glow on chess pieces: a rim light effect that intensifies at grazing angles, making pieces look magical when viewed from the side |
| Wizard's Chess | Reflection Vector | Reflective polished marble surfaces on the chess pieces, catching the environment lighting |
| Wizard's Chess | Camera Position | Distance-based detail: add fine surface detail (micro scratches, grain) only when the camera is close to a piece |

#### Constants
| Node | Description |
|------|-------------|
| **Constant** | Single float value |
| **Constant 2Vector / 3Vector / 4Vector** | Multi-component constants |
| **Scalar Parameter** | Float exposed to Material Instances |
| **Vector Parameter** | Color/vector exposed to Material Instances |
| **Static Bool Parameter** | Compile-time boolean; creates shader permutations |
| **Static Switch Parameter** | Selects between two inputs at compile time |
| **Static Component Mask Parameter** | Compile-time channel selection |
| **Time** | Game time in seconds; drives animation |
| **Sine Remap** | Remaps time to sine wave |
| **Panner** | Scrolls UV coordinates over time |
| **Rotator** | Rotates UVs around a center point over time |
| **PI** | The constant 3.14159... |

**In your games:**

| Game | Node | Use Case |
|------|------|----------|
| DnD RPG | Scalar Parameter (TransitionAlpha) | The master parameter exposed to Material Instances that drives the entire miniature-to-real crossfade (0.0 = painted wood, 1.0 = living character). Updated via Blueprint's Set Scalar Parameter Value every frame during the 2.5-second zoom |
| DnD RPG | Vector Parameter | Condition tint colour: set to green for Poisoned, orange for Burning, blue for Frozen, purple for Charmed. One parameter, one material, multiple visual states |
| DnD RPG | Static Bool Parameter | "IsMetallic" switch on armour materials: metal armour (plate, chain) uses metallic workflow, cloth armour (robes, leather) uses non-metallic. Compile-time branch avoids runtime cost |
| DnD RPG | Static Switch Parameter | "UseNormalMap" toggle: during development, quickly disable normal maps on all instances to test flat shading performance |
| DnD RPG | Time + Sine Remap | Pulsing emissive on magical items: a sword enchanted with flame glows brighter and dimmer in a sine wave. The Cleric's holy symbol pulses with divine light |
| DnD RPG | Panner | Scrolling energy texture on magical barriers and portal effects |
| Wizard's Chess | Scalar Parameter | "GlowIntensity" on piece materials: 0 for idle pieces, ramps up when a piece is selected or during check |
| Wizard's Chess | Vector Parameter | "PieceColour" lets one master material serve both white and black pieces by swapping the colour parameter |
| Wizard's Chess | Time | Driving the pulsing enchanted glow on the board and animated magic trail shimmer on moving pieces |
| Wizard's Chess | Panner | Scrolling rune textures on the board border, creating the illusion of magical inscriptions rotating around the frame |
| Wizard's Chess | Rotator | Slowly rotating a procedural pattern on the board centre (the "magic circle" that reacts to game state) |

#### Texture Coordinates
| Node | Description |
|------|-------------|
| **Texture Coordinate** | Generates UVs with tiling and offset |
| **Panner** | Scrolls UVs over time (speed U, speed V) |
| **Rotator** | Rotates UVs around center point |
| **World Aligned Texture** | Projects texture using world position (no UV dependency) |
| **Triplanar Projection** | Projects from X, Y, Z axes and blends; eliminates stretching on steep surfaces |
| **Parallax Occlusion Mapping** | Simulates depth in a flat surface using heightmap and ray marching |
| **Bump Offset** | Simple parallax effect (cheaper than POM) |
| **Flipbook** | Selects frames from a sprite sheet |

**In your games:**

| Game | Node | Use Case |
|------|------|----------|
| DnD RPG | World Aligned Texture | Dungeon walls and floors that were built from modular pieces: world-aligned projection means textures line up perfectly at seams without UV work |
| DnD RPG | Triplanar Projection | Rocky terrain and cliff faces where standard UV mapping would stretch badly on steep surfaces |
| DnD RPG | Parallax Occlusion Mapping | Adding depth to the tabletop map surface: the flat table "map" gains apparent depth (tiny hills, rivers) without actual geometry, selling the illusion before the full zoom transition |
| DnD RPG | Panner | Flowing water in rivers and streams, scrolling clouds on a sky dome, lava flow in volcanic dungeons |
| DnD RPG | Flipbook | Animated spell effect sprites on the HUD ability bar icons (a flickering flame icon for fireball, rotating shield icon for Shield Bash) |
| DnD RPG | Rotator | Spinning magical circle on the ground for area-of-effect spell targeting indicators |
| Wizard's Chess | Panner | Scrolling energy trails behind moving pieces, flowing magical rune patterns on the board border |
| Wizard's Chess | Parallax Occlusion Mapping | Adding depth to the board squares without extra geometry, so the marble tiles look like they have real depth and bevelled edges |

#### Custom Expressions
| Node | Description |
|------|-------------|
| **Custom** | Write raw HLSL code. Define inputs, output type, and shader code body |
| **Material Function Call** | Calls a reusable Material Function |
| **Feature Level Switch** | Different outputs per shader model (ES3.1, SM5, SM6) |
| **Quality Switch** | Different outputs per quality level (Low, Medium, High, Epic, Cinematic) |
| **Platform Switch** | Per-platform overrides |

**Custom node usage**: Right-click graph > Custom. Enter HLSL code in the Code field. Access inputs by their declared names. Supports #include directives for shared code files. Useful for complex math or sampling patterns not available as built-in nodes.

**In your games:**

- **DnD RPG**: Use the Custom HLSL node for the hex grid overlay shader. Calculating hex grid coordinates from world position requires specific math (converting Cartesian to axial hex coordinates) that is more readable as HLSL code than a massive node graph. Use Quality Switch to simplify the terrain displacement material on low-end hardware (skip POM, use flat normal maps instead). Use Feature Level Switch to provide fallback materials for lower shader models.
- **Wizard's Chess**: A Custom HLSL node can implement the board's "threatened squares" highlight pattern: pass in an array of threatened positions as a texture, and the shader samples it to determine per-pixel glow colour. Quality Switch can simplify the magic trail effect on lower settings (fewer particles, simpler glow).

#### World Position and Depth
| Node | Description |
|------|-------------|
| **Absolute World Position** | Pixel's world-space position |
| **Actor Position** | World-space origin of the owning Actor |
| **Object Position** | Same as Actor Position for most cases |
| **Object Radius** | Bounding sphere radius of the object |
| **Object Bounds** | Bounding box extents |
| **Camera Position** | World-space camera location |
| **Pixel Depth** | Distance from camera to pixel (in world units) |
| **Scene Depth** | Depth buffer value at screen UV (for post-process or translucent effects) |
| **Depth Fade** | Soft intersection; fades transparency near opaque surfaces |
| **Camera Depth Fade** | Fades based on distance from camera |
| **Distance to Nearest Surface** | Signed distance field query |
| **Distance Field Gradient** | Normal from distance field |
| **Pre-Skinned Local Position** | Mesh position before skeletal animation |
| **Vertex Interpolator** | Passes custom data from vertex to pixel shader (optimization) |

**In your games:**

| Game | Node | Use Case |
|------|------|----------|
| DnD RPG | Absolute World Position | The terrain displacement material: the flat tabletop surface uses world position to drive the heightmap displacement during the zoom transition, so terrain features appear at their correct world locations |
| DnD RPG | Actor Position | Centering effects on a character: a magical aura that radiates from the character's position, or a damage flash that uses distance from actor centre to fade |
| DnD RPG | Pixel Depth | Fog of war effect on the tabletop: hexes further from the camera (higher pixel depth) are more obscured by fog |
| DnD RPG | Depth Fade | Soft intersection where the hex grid overlay meets the terrain surface, avoiding the hard z-fighting line where two transparent surfaces overlap |
| DnD RPG | Camera Depth Fade | Fading out distant dungeon decorations to save pixel shader cost on objects the player cannot see clearly anyway |
| DnD RPG | Pre-Skinned Local Position | Vertex animation effects that need to reference the character's bind pose (e.g., a "stone skin" effect that freezes the mesh at its original pose) |
| DnD RPG | Distance to Nearest Surface | Ambient occlusion-like darkening in dungeon corners using the global distance field |
| Wizard's Chess | Absolute World Position | Board-reactive effects: the glow pattern emanates from the centre of the board outward using world position to calculate distance from centre |
| Wizard's Chess | Depth Fade | Soft intersection where the magic trail particles overlap with the board surface and piece bases |
| Wizard's Chess | Object Bounds | Scaling effects relative to piece size so that a Pawn's glow and a Queen's glow are proportionally similar |

#### Utility Nodes
| Node | Description |
|------|-------------|
| **Static Switch** | Compile-time branch; eliminates dead code |
| **Feature Level Switch** | Per-feature-level outputs |
| **Quality Switch** | Per-quality-level outputs |
| **Shader Stage Switch** | Different code for vertex vs pixel shader |
| **Named Reroute** | Labeled connection point for graph organization |
| **Reroute** | Visual wire routing (no logic) |
| **Comment** | Graph annotation block |
| **Break Material Attributes** | Splits a Material Attributes struct into individual pins |
| **Make Material Attributes** | Combines individual pins into a Material Attributes struct |
| **Set Material Attributes** | Overrides specific attributes in a Material Attributes struct |
| **Blend Material Attributes** | Lerps between two complete Material Attribute sets |
| **Material Layer Blend** | For Material Layering workflow |
| **Black Body** | Converts temperature (Kelvin) to color |
| **Noise** | Procedural noise (Perlin, Gradient, Simplex, Value, Voronoi, etc.) |
| **Vector Noise** | 3D vector-valued noise |
| **Distance** | Distance between two vectors |
| **Flatten Normal** | Reduces normal map intensity toward flat |
| **DDX / DDY** | Partial derivatives for edge detection and procedural effects |
| **AntiAliased Texture Mask** | Smooth alpha-tested masks |

**In your games:**

| Game | Node | Use Case |
|------|------|----------|
| DnD RPG | Noise (Perlin/Voronoi) | Procedural terrain variation: breaking up tiling on large surfaces (dungeon floors, cave walls). Voronoi noise creates cracked stone patterns. Perlin noise drives subtle colour variation on skin and fabric |
| DnD RPG | Blend Material Attributes | The tabletop zoom crossfade as a Material Attributes approach: lerp between the complete "miniature" attribute set and the "real character" attribute set using TransitionAlpha |
| DnD RPG | Black Body | Converting fire temperature to colour for the Warrior's Longsword of Flame: input a Kelvin value (1500 for deep red glow, 3000 for orange, 6000 for white hot) |
| DnD RPG | Flatten Normal | Reducing normal map intensity on distant objects during the tabletop view (normal details are invisible at that distance and just create noise) |
| DnD RPG | Named Reroute | Organising complex materials: label your TransitionAlpha, BaseColourMiniature, BaseColourReal, and ConditionTint connections so the graph is readable |
| DnD RPG | Comment | Grouping nodes into labelled blocks: "Miniature Layer", "Real Layer", "Transition Logic", "Condition Effects" |
| Wizard's Chess | Noise (Voronoi) | Marble vein patterns on chess pieces: Voronoi noise generates realistic marble veining procedurally, no texture needed |
| Wizard's Chess | Blend Material Attributes | Blending between "normal" and "captured" material states as a piece shatters (the material shifts toward emissive cracks before breaking apart) |
| Wizard's Chess | DDX/DDY | Edge detection on the board for a subtle hand-drawn outline post-process effect, giving the game a storybook aesthetic |

---

### Material Attributes

The main Material output node has these pins (availability depends on shading model and domain):

| Attribute | Description |
|-----------|-------------|
| **Base Color** | Surface albedo (0..1 per channel). No lighting information. |
| **Metallic** | 0 = dielectric, 1 = metal. Usually binary. |
| **Specular** | Non-metallic specular reflectance (default 0.5 = 4% reflectance). Rarely adjusted. |
| **Roughness** | 0 = mirror, 1 = fully rough. Controls highlight sharpness. |
| **Emissive Color** | HDR light emission. Values above 1 bloom. |
| **Normal** | Tangent-space normal from a normal map. |
| **Opacity** | For Translucent blend mode (0 = invisible, 1 = fully visible) |
| **Opacity Mask** | For Masked blend mode; clips below threshold |
| **World Position Offset** | Vertex displacement in world space (wind, waves, growth) |
| **Ambient Occlusion** | Baked AO multiplier |
| **Refraction** | Index of refraction for translucent surfaces |
| **Pixel Depth Offset** | Shifts depth buffer value per pixel |
| **Subsurface Color** | Color for SSS shading models |
| **Clear Coat / Clear Coat Roughness** | For Clear Coat shading model |
| **Custom Data 0 / Custom Data 1** | Two extra float channels for custom shading |
| **Shading Model** | Per-pixel shading model (with From Material Expression) |
| **Front Material (Substrate)** | The Substrate material output; replaces all above pins when Substrate is enabled |

**In your games:**

| Game | Attribute | Use Case |
|------|-----------|----------|
| DnD RPG | Base Color | Character skin, armour paint, weapon wood/metal colour. Lerped between miniature (painted wood tones) and real (natural skin/metal tones) during zoom |
| DnD RPG | Metallic | Binary: 0 for cloth/skin/leather, 1 for metal armour and weapons. The Warrior's plate armour is fully metallic, the Mage's robes are 0 |
| DnD RPG | Roughness | Polished sword blade = 0.1, rough stone dungeon wall = 0.8, worn leather = 0.5 |
| DnD RPG | Emissive Color | Magical weapon glows (Longsword of Flame emits warm orange), spell effects, glowing runes on dungeon doors, the Cleric's holy symbol |
| DnD RPG | Normal | Normal maps on every surface for detail: stone brick grout lines, armour dents, skin pores on close-up |
| DnD RPG | World Position Offset | The terrain displacement during the zoom: flat tabletop surface rises to full heightmap depth. Also wind sway on foliage |
| DnD RPG | Opacity | Table edge fade-out during zoom transition: the table borders become transparent as the camera descends |
| DnD RPG | Subsurface Color | Character skin scattering colour (warm pink/red), candle wax (warm yellow), glowing mushrooms (teal) |
| Wizard's Chess | Base Color | Marble (white/cream) and obsidian (dark grey/black) base colours for the two piece sets |
| Wizard's Chess | Metallic | 0 for marble and wood pieces, 1 for a "metal pieces" variant |
| Wizard's Chess | Emissive Color | The enchanted glow on active pieces, pulsing board squares during check, the magic trail behind moving pieces |
| Wizard's Chess | World Position Offset | Subtle hover animation on pieces (bob up and down via sine wave in WPO), making them feel enchanted and alive |
| Wizard's Chess | Opacity Mask | The filigree pattern on the board border (ornate cut-out design) |

### Two-Sided Materials
- Enable in Material Details > **Two Sided** checkbox
- **Two Sided Sign** node: Returns +1 for front face, -1 for back face. Use to flip normals on backfaces.
- Commonly used for foliage, cloth, paper, thin objects

**In your games:**

- **DnD RPG**: Two-sided materials are essential for: forest foliage (leaves transmit light from behind), cloth banners and capes on characters (the Bard's cape, the Cleric's vestments), thin dungeon props (paper scrolls, curtains, torn fabric), and the tabletop's map sheet (parchment that might curl at the edges). Use the Two Sided Sign node to flip normals on backfaces so lighting is correct from both sides.
- **Wizard's Chess**: Two-sided works for decorative elements like thin cloth draped over the chess table, or ornamental flags around a tournament-themed board.

### World Position Offset
- Vertex-level displacement applied in world space
- Used for: wind animation on foliage, ocean waves, procedural deformation, vertex animation textures (VAT)
- Runs in the vertex shader; no extra geometry generated
- Performance: cheap for simple effects; expensive with high vertex counts and complex math
- Does not update collision or physics bounds by default

**In your games:**

- **DnD RPG**: World Position Offset is the engine behind the tabletop zoom's terrain reveal. The flat table surface material has a heightmap texture sampled via Absolute World Position. A scalar parameter `TerrainDisplacementStrength` multiplies the heightmap value and displaces vertices upward along the normal. During the zoom, this parameter transitions from 0 (flat table) to 1 (full terrain depth) over 2.5 seconds. This creates the illusion that hills, valleys, and rivers "grow" out of the flat map. Also use WPO for: wind sway on grass and foliage (simple sine wave offset), ocean/river wave simulation, and the Mage's "Levitate" ability (floating the character mesh upward).
- **Wizard's Chess**: Use WPO for a subtle floating hover animation on enchanted pieces. A sine wave drives a small vertical offset (1-2 cm), making pieces look magically suspended above the board. The frequency and amplitude can vary by piece type (the Queen hovers more dramatically than Pawns). Also use WPO for a "board breathing" effect during tense moments (the board surface subtly undulates when a King is in check).

---

### Material Functions
- **Path**: Content Browser > right-click > Material > Material Function
- Reusable sub-graphs that can be called from any material
- Define **Function Input** and **Function Output** nodes inside
- Expose to the Material Editor's palette by enabling **Expose to Library** in the function details
- Functions can call other functions (nesting)
- Built-in library includes hundreds of functions: Blend modes, Noise, Landscape Layer blending, Fresnel variations, World-aligned textures, etc.
- **Path to built-in functions**: Engine > Content > Functions > Engine_MaterialFunctions02 (and 03, 04...)

**In your games:**

- **DnD RPG**: Create a `MF_HexGridOverlay` Material Function that takes World Position and Grid Scale as inputs, calculates hex coordinates, and outputs a grid line mask. Reuse this function in the terrain material, the combat arena material, and any future hex-based surface. Create `MF_TransitionBlend` that takes two Material Attributes (miniature and real), a TransitionAlpha, and outputs the blended result. Use this in every character material instead of rebuilding the blend logic each time. The built-in Fresnel function variations are useful for rim glow effects on selected characters.
- **Wizard's Chess**: Create `MF_SquareHighlight` that takes a board position, a highlight colour, and an intensity, and outputs the glow contribution for that square. Reuse it for valid move highlights, threatened square highlights, and last-move indicators. Create `MF_MarblePattern` using layered noise functions to generate procedural marble veining, then reuse it across all piece and board materials.

### Material Parameter Collections
- **Path**: Content Browser > right-click > Material > Material Parameter Collection
- A shared set of scalar and vector parameters accessible from any material
- Updated at runtime via Blueprint: **Set Scalar Parameter Value** / **Set Vector Parameter Value** on the MPC reference
- Use case: global wind direction, time of day tint, water level
- Limited to 1024 scalar and 1024 vector parameters per collection
- A material can reference up to two MPCs

**In your games:**

- **DnD RPG**: Create an MPC called `MPC_GlobalState` with: `TransitionAlpha` (scalar, 0-1, drives all zoom transition materials globally), `TimeOfDay` (scalar, 0-24, shifts world lighting colour temperature), `WindDirection` (vector, drives foliage sway direction), `WindStrength` (scalar, drives sway amplitude), `FogDensity` (scalar, per-biome fog). Update these from your CameraDirector Blueprint during the zoom and from the world state manager during gameplay. Every material that references this MPC responds instantly to a single Blueprint call, instead of updating dozens of material instances individually. This is how one `TransitionAlpha` change simultaneously affects the terrain displacement, character crossfade, foliage spawn fade, and table edge opacity.
- **Wizard's Chess**: Create `MPC_BoardState` with: `CheckIntensity` (scalar, 0 = normal, 1 = full check warning glow), `ActivePlayerColour` (vector, white or black tint for the board border glow), `GameTension` (scalar, drives subtle visual effects that intensify as the game progresses). One Blueprint call updates CheckIntensity, and every board square material responds.

### Material Instances
- **Create**: Right-click a material > Create Material Instance
- Override exposed parameters without recompiling the shader
- Significantly faster iteration than editing the parent material
- **Types**:
  - **Material Instance Constant (MIC)**: Editor-time; set values in the Details panel
  - **Material Instance Dynamic (MID)**: Runtime; created via Blueprint `Create Dynamic Material Instance`
- Instances inherit the parent's shader; only parameter values differ
- Instances can parent other instances (inheritance chain)
- **Static Switch Parameters**: Change compile-time branches per instance (requires recompilation of that instance)

**In your games:**

- **DnD RPG**: Create one master material `M_Character` with parameters for BaseColor texture, Normal texture, Roughness, Metallic, TransitionAlpha, ConditionTintColour, and a Static Switch "IsMetalArmour". Then create Material Instances for each class: `MI_Warrior` (plate metal texture, IsMetalArmour = true), `MI_Mage` (cloth texture, IsMetalArmour = false), `MI_Rogue` (leather texture), etc. Each instance shares the same shader but looks completely different. When you tweak the master material's lighting response, all 6 class materials update. Create similar instances for enemies: `MI_GoblinWarrior`, `MI_OrcShaman`, etc.
- **Wizard's Chess**: One master material `M_ChessPiece` with parameters for colour tint, roughness, emissive glow intensity, and a Static Switch "IsCrystal" (for a crystal piece variant). Create `MI_WhiteMarble`, `MI_BlackObsidian`, `MI_WhiteCrystal`, `MI_BlackCrystal`. Four instances, one shader, four distinct looks.

### Dynamic Material Instances
- Created at runtime via Blueprint: **Create Dynamic Material Instance** node
- Allows per-frame parameter updates (scalar, vector, texture)
- Each call creates a unique material copy; avoid calling every frame on many objects
- Common pattern: Create once in BeginPlay, store reference, update parameters in Tick
- Use `Set Scalar Parameter Value`, `Set Vector Parameter Value`, `Set Texture Parameter Value`

**In your games:**

- **DnD RPG**: On BeginPlay for each character, call `Create Dynamic Material Instance` and store the reference. During the zoom transition, update `TransitionAlpha` every frame via `Set Scalar Parameter Value` on each character's MID. When a character gets Poisoned, call `Set Vector Parameter Value("ConditionTint", Green)`. When the Warrior equips the Longsword of Flame, call `Set Scalar Parameter Value("EmissiveIntensity", 2.0)` on the sword's MID to make it glow. Important: create the MID once in BeginPlay, not every frame. Each call creates a unique material copy, so calling it repeatedly wastes memory.
- **Wizard's Chess**: Create MIDs for each piece on game start. When a piece is selected, update `Set Scalar Parameter Value("GlowIntensity", 1.0)` to make it light up. When deselected, set it back to 0. When a piece is about to be captured, ramp up `Set Scalar Parameter Value("CrackIntensity", 1.0)` over 0.5 seconds to show cracks forming before the Chaos Destruction triggers. Call `Set Vector Parameter Value("TrailColour", Blue)` on the magic trail material when a piece moves.

---
