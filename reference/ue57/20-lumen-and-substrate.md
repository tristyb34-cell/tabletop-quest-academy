## Lumen and Substrate

### Lumen Global Illumination

Lumen is the default global illumination and reflections system in UE5, providing fully dynamic indirect lighting and reflections without baking.

#### Settings

Located in **Post Process Volume > Details > Global Illumination**:

- **Method**: Lumen (default), Screen Space, None.
- **Lumen GI Quality**: Controls trace quality. Range 1-4, default 1. Higher values increase ray count.
- **Lumen Scene Detail**: Controls the detail of the Lumen Scene representation. Higher values capture smaller objects.
- **Lumen Scene Lighting Quality**: Quality of lighting updates in the Lumen Scene.
- **Lumen Scene View Distance**: Max distance for Lumen Scene capture.
- **Final Gather Quality**: Controls the quality of the final gather pass. Range 1-4.
- **Final Gather Lighting Update Speed**: How quickly lighting updates propagate; lower values are more temporally stable.
- **Max Trace Distance**: Maximum ray trace distance for GI.

> **In your games:**
> - **DnD RPG**: Set Lumen GI Quality to 2 or 3 for dungeon interiors so that torch light bounces convincingly off stone corridors. Use a shorter Max Trace Distance indoors (around 5000) since dungeon rooms are enclosed, which saves performance. During the tabletop overview zoom, you can drop GI Quality to 1 because the camera is far away and indirect lighting subtlety is less visible.
> - **Wizard's Chess**: Keep Lumen GI Quality at 2 minimum. The board is a small, contained scene, so indirect light bounce from glowing chess pieces onto the board surface is critical for atmosphere. A low Final Gather Lighting Update Speed (around 1.0) keeps the lighting stable and avoids flickering as pieces move.

#### Quality and Performance

- Lumen quality scales from low (software tracing only, lower resolution) to high (hardware ray tracing, full resolution).
- Software Ray Tracing: Uses the Lumen Scene (a simplified scene representation with mesh SDFs and voxel lighting). No RT hardware required. Good quality at moderate cost.
- Hardware Ray Tracing: Uses actual RT cores for more accurate tracing. Enable via **Project Settings > Engine > Rendering > Hardware Ray Tracing > Support Hardware Ray Tracing**. Requires DXR-capable GPU.
- **Project Settings > Engine > Rendering > Global Illumination > Dynamic Global Illumination Method**: Set to Lumen.
- **Project Settings > Engine > Rendering > Lumen > Software Ray Tracing Mode**: Detail Tracing or Global Tracing.

> **In your games:**
> - **DnD RPG**: Start with Software Ray Tracing and Detail Tracing mode. Dungeons have lots of small geometry (pillars, archways, treasure piles) that benefit from detail tracing. Only move to Hardware RT if you need precise light interaction with complex spell effects and your target hardware supports it.
> - **Wizard's Chess**: Software RT is likely sufficient. The scene is geometrically simple (board, pieces, table). If you add a reflective marble board, Hardware RT gives more accurate reflections off the surface, but Software RT handles it well enough for most setups.

#### Lumen Scene

- Lumen maintains a simplified scene representation (Lumen Scene) used for tracing.
- Mesh Distance Fields: Auto-generated SDF representations of static meshes. Enable via **Project Settings > Engine > Rendering > Generate Mesh Distance Fields**.
- Global Distance Field: Combined SDF of the whole scene, used for long-range traces.
- Surface Cache: Stores direct and indirect lighting on Lumen Scene surfaces. Visualize with **Show > Lumen > Lumen Scene**.
- Cards: Simplified proxy geometry that captures lighting from multiple angles.

> **In your games:**
> - **DnD RPG**: Make sure "Generate Mesh Distance Fields" is enabled early. Every dungeon wall, pillar, and floor tile needs an SDF for Lumen to trace light around corners properly. Use **Show > Lumen > Lumen Scene** to check that your dungeon meshes have proper cards; thin walls or small props might need adjusted Lumen Scene Detail to show up in the surface cache.
> - **Wizard's Chess**: Chess pieces are small detailed meshes. Increase Lumen Scene Detail if piece shapes (especially knights and bishops with fine geometry) are not properly represented. The board itself is a large flat surface that works perfectly with the default card system.

#### Lumen Reflections

Located in **Post Process Volume > Details > Reflections**:

- **Method**: Lumen (default), Screen Space, None.
- **Reflection Quality**: Controls trace quality for reflections.
- **Ray Lighting Mode**: Hit Lighting for accurate single-bounce reflections, or Surface Cache for faster multi-bounce approximation.
- **Max Roughness To Trace**: Surfaces above this roughness skip reflection tracing (performance optimization). Default 0.4.
- **Screen Space Reflections** can supplement Lumen Reflections for near-field reflections with **Screen Percentage** setting.

> **In your games:**
> - **DnD RPG**: For wet dungeon floors or polished stone, increase Max Roughness To Trace to 0.5 or 0.6 so those slightly rough surfaces still get reflections. Use Surface Cache mode for most dungeon scenes (faster), but switch to Hit Lighting for boss rooms or cutscenes where you want torchlight reflecting accurately off treasure and armor.
> - **Wizard's Chess**: This is where your game shines. Set Reflection Quality to 3+ and Max Roughness To Trace to 0.6 or higher. A polished board surface with pieces reflecting in it is the signature visual. Use Hit Lighting mode; the scene is small enough that the cost is manageable, and the accuracy makes the board look stunning. Supplement with Screen Space Reflections for near-piece contact reflections.

### Substrate

Substrate is the new material authoring and rendering system, reaching Production-Ready status in UE 5.7. It replaces the legacy shading model system with a physically-based layered material framework.

#### Enabling Substrate

- **Substrate is enabled by default in UE 5.7 and later**. No manual activation is required.
- Legacy materials continue to work; the existing root node inputs still function. At runtime, all materials compile through the Substrate pipeline regardless.
- To use Substrate layering features, insert a Slab BSDF node and connect its output to the **Front Material** pin on the material root node.

> **In your games:**
> - **DnD RPG**: Since Substrate is on by default, you can start using layered materials immediately for dungeon surfaces. Your existing prototype materials will keep working, but plan to migrate key materials (stone walls, wooden doors, metal weapons) to Slab BSDF nodes to take advantage of physical layering.
> - **Wizard's Chess**: Same situation. Start with legacy materials for prototyping piece shapes, then upgrade to Substrate Slab nodes when you are ready to add the polished marble, metallic gold/silver, and glowing enchantment layers that make pieces look premium.

#### GBuffer Configuration

**Project Settings > Engine > Rendering > Substrate**:

- **Adaptive GBuffer** (recommended): Modern format where GBuffer data varies per pixel as a bitstream. Required for full Substrate features. Default for Shader Model 6.
- **Blendable GBuffer**: Legacy-compatible format for lower-end hardware and Shader Model 5. Supports basic Substrate but not all advanced layering features.

> **In your games:**
> - **DnD RPG**: Use Adaptive GBuffer. Your dungeon materials will stack multiple layers (stone base, moss overlay, wet sheen coat), and Adaptive GBuffer is required for full layering support. If you ever target older GPUs, you can fall back to Blendable, but you will lose some layering features.
> - **Wizard's Chess**: Adaptive GBuffer as well. The reflective board and metallic pieces benefit from the full Substrate pipeline.

#### Substrate BSDF Nodes

BSDF nodes define the material's surface properties, analogous to the legacy material output node:

- **Substrate Slab BSDF**: The primary and most versatile node. Represents a layer of material with:
  - **Diffuse Albedo**: Base color (set to black/0 for metals).
  - **F0 (Specular)**: Reflectance at normal incidence. Controls metallic color.
  - **F90**: Reflectance at grazing angles.
  - **Roughness**: Microsurface roughness.
  - **Normal**: Surface normal.
  - **Emissive Color**: Self-illumination.
  - **Fuzz**: Fuzz/sheen layer parameters for cloth-like materials.
  - **Glint**: Sparkle/glint parameters for materials like car paint flake.
  - **Mean Free Path (MFP)**: Subsurface scattering distance for the slab medium.
  - **Thickness**: Physical thickness of the slab, affecting transmittance.
  - **Anisotropy**: Anisotropic reflections.
  - **SSSP MFP**: Screen-space subsurface profile mean free path.
- **Substrate Simple BSDF**: Lightweight node for basic materials (fewer inputs, lower cost).
- **Substrate Single Layer Water BSDF**: Specialized for water surfaces.
- **Substrate Hair BSDF**: Specialized for hair strand rendering.
- **Substrate Eye BSDF**: Specialized for eye rendering.
- **Substrate UI BSDF**: For user interface materials.

> **In your games:**
> - **DnD RPG**: Use Slab BSDF for everything important. Key material recipes:
>   - **Stone walls**: Diffuse Albedo for base color, high Roughness (0.7-0.9), normal map for surface detail.
>   - **Metal weapons/armor**: Diffuse Albedo = black, F0 = metal color (gold, silver, iron), low Roughness (0.1-0.3).
>   - **Enchanted items**: Add Emissive Color for the magical glow (blue, green, purple).
>   - **Candle wax**: Use MFP and Thickness for subsurface scattering so light passes through realistically.
>   - **Character skin**: SSSP MFP for screen-space subsurface scattering on faces.
>   - Use Simple BSDF for distant background props that do not need layering.
> - **Wizard's Chess**: Key material recipes:
>   - **Marble board**: Slab BSDF with MFP for subtle subsurface scattering (marble is slightly translucent), low Roughness (0.05-0.15) for polish.
>   - **Gold pieces**: Diffuse Albedo = black, F0 = warm gold color, very low Roughness (0.05-0.1).
>   - **Silver pieces**: Same as gold but with cool silver F0 color.
>   - **Glowing piece effects**: Emissive Color driven by a pulsing material parameter for selected/active pieces.
>   - **Glint** could work for crystal or jeweled piece variants if you add decorative sets.

#### Substrate Operators

Operators combine multiple BSDF slabs into complex layered materials:

- **Vertical Layer (Coat)**: Physically layers one slab on top of another. The top slab must be transmissive (controlled by MFP and thickness). Light passes through the top layer and interacts with the bottom layer. Used for clear coat, varnish, wet surfaces.
- **Horizontal Blend (Mix)**: Blends two slabs based on a mix ratio (0-1). Both slabs are evaluated and mixed per pixel. Similar to a lerp but both branches are fully evaluated. Used for blending different surface types across a surface.
- **Add**: Sums the lighting contribution of two slabs. WARNING: breaks energy conservation and can produce blown-out results. Use sparingly.
- **Coverage Weight**: Masks a slab's visibility with a scalar weight. Acts like an alpha mask controlling how much of the slab contributes. Used for detail layers like dirt, scratches, or decals.
- **Substrate Select**: Chooses one slab or another based on a condition (no blending). Only the selected slab is evaluated, saving performance. Used for material ID-based switching.

> **In your games:**
> - **DnD RPG**: These operators are your best friends for rich dungeon surfaces:
>   - **Vertical Layer**: Wet stone floors (water coat over stone base), varnished wooden tables, icy surfaces in frost dungeons. The top transmissive layer physically darkens the base and adds specular, just like real wetness.
>   - **Horizontal Blend**: Moss growing on stone walls (blend moss slab with stone slab using a mask texture). Rust spreading across iron gates. Snow accumulating on surfaces.
>   - **Coverage Weight**: Blood splatters, dirt accumulation, scratch marks on weapons. Use a mask texture to control where the detail layer appears.
>   - **Substrate Select**: One material for a dungeon tile set that switches between stone, wood, and metal based on a vertex color or texture channel. Saves material slots.
> - **Wizard's Chess**: Fewer layers needed, but still useful:
>   - **Vertical Layer**: Clear coat on the board for that deep gloss finish. Varnish layer on wooden piece variants.
>   - **Horizontal Blend**: Worn edges on pieces (blend polished surface with slightly rougher, scratched surface at edges using a curvature mask).
>   - **Coverage Weight**: Dust on unused pieces, fingerprint smudges on the board for realism.

#### Differences from Legacy

| Aspect | Legacy Shading | Substrate |
|--------|---------------|-----------|
| Material model | Flat, single-layer | Physically layered, stackable |
| Shading models | Enum-based (Default Lit, Subsurface, Clear Coat, etc.) | BSDF nodes represent any shading model |
| Layering | Material functions and lerps (not physically correct) | True physical layering with transmittance |
| Energy conservation | Approximated | Maintained through physical operators |
| Complexity | Fixed cost per shading model | Cost scales with layer count |
| Clear coat | Dedicated shading model | Vertical Layer operator with any slab on top |

> **In your games:**
> - **DnD RPG**: In legacy, you would need separate materials for "stone", "wet stone", and "mossy wet stone", each with different shading models or complex material function hacks. With Substrate, one material can physically stack all three layers (stone base, moss blend, water coat) and the lighting stays energy-conserving. This is huge for dungeons where surfaces change character from room to room.
> - **Wizard's Chess**: Previously, making a clear-coated marble board required using the Clear Coat shading model, which locked you out of other features. With Substrate, you can layer a gloss coat on marble that also has subsurface scattering, all in one material. No compromises.

#### Performance Implications

- Simple materials (one Slab, no operators) perform similarly to legacy Default Lit.
- Layered materials cost more, proportional to the number of layers and operators.
- Adaptive GBuffer adds a small overhead per pixel vs the fixed legacy GBuffer.
- Blendable GBuffer mode has lower overhead but fewer features.
- Profile with `stat GPU` and `ProfileGPU` to measure material cost.

> **In your games:**
> - **DnD RPG**: Budget your layers carefully. Hero props (weapons, treasure chests, boss room surfaces) can afford 2-3 layers. Background corridor walls should stick to 1-2 layers max. During the tabletop overview, the camera is far enough that simpler materials suffice. Use `ProfileGPU` regularly to check material cost, especially in rooms with many different surface types.
> - **Wizard's Chess**: The scene is small (board + 32 pieces + environment), so you can afford richer materials. 2-3 layers per piece material and a 2-layer board material should be well within budget. Profile to confirm, but material cost should not be your bottleneck here.

#### Substrate Settings in Project Settings

**Edit > Project Settings > Engine > Rendering > Substrate**:

- **Substrate GBuffer Format**: Adaptive or Blendable.
- **Substrate Byte Per Pixel Budget**: Memory budget per pixel for the Substrate GBuffer.
- **Substrate Closure Count**: Max number of closure evaluations per pixel.
- Various debug and override settings.

> **In your games:**
> - **DnD RPG**: Leave the default Byte Per Pixel Budget unless you run into GBuffer memory issues. If you have very complex layered materials (3+ layers on many surfaces visible at once), you may need to increase the Closure Count. Monitor this with `stat GPU`.
> - **Wizard's Chess**: Defaults should work fine. The scene complexity is low enough that you will not hit GBuffer memory limits.

### MegaLights (New in 5.7, Beta)

MegaLights is a new direct lighting pipeline that enables orders of magnitude more dynamic, shadow-casting lights in a scene.

#### What MegaLights Are

MegaLights provides a ray-traced direct lighting path that efficiently evaluates many area lights with soft shadows. Instead of rendering each light with a full shadow map, MegaLights uses stochastic ray tracing to sample light contributions, amortizing shadow cost across many lights.

#### What MegaLights Replace

MegaLights replaces the traditional per-light shadow map approach for scenes with many dynamic lights. It works alongside Virtual Shadow Maps (VSM). In MegaLights mode, individual lights can still opt into VSM or ray-traced shadows on a per-light basis.

> **In your games:**
> - **DnD RPG**: This is potentially game-changing for dungeons. Think about a room with 20 torches on the walls, candles on tables, a glowing magical artifact, and spell effects from the player. Traditional shadow maps would choke on that many shadow-casting lights. MegaLights amortizes the cost so all of them can cast soft shadows simultaneously.
> - **Wizard's Chess**: Less critical here since you likely have only a handful of lights (key light, fill, rim, maybe some piece glow lights). Traditional shadow maps are fine for 3-5 lights. MegaLights becomes useful if you add many candle-lit or chandelier environments around the board.

#### Enabling MegaLights

1. **Project Settings**: **Edit > Project Settings > Engine > Rendering > Direct Lighting > MegaLights** checkbox.
2. **Post Process Volume**: In the Details panel, search for "MegaLights" and enable it. This allows per-volume control.
3. MegaLights requires ray tracing platform support. Enable **Support Hardware Ray Tracing** in Project Settings if targeting HW ray tracing.

> **In your games:**
> - **DnD RPG**: Enable MegaLights globally in Project Settings, then use Post Process Volume control to disable it in simpler scenes (like the tabletop overview) where you only have a few lights and traditional shadows are cheaper.
> - **Wizard's Chess**: Only enable MegaLights if you build elaborate environments with many light sources. For a clean, minimal setup, skip it and save the RT overhead.

#### Supported Light Types

- Point Lights
- Spot Lights
- Rect Lights (area lights)
- Directional Lights (added in 5.7)
- Niagara Particle Lights (shadow casting support added in 5.7)

> **In your games:**
> - **DnD RPG**: Point Lights for torches and lanterns, Spot Lights for focused beams (sunlight through a crack, a spotlight on a treasure), Rect Lights for large glowing runes or portal effects. Niagara Particle Lights with shadow casting is exciting: fire spell particles that actually cast flickering shadows on dungeon walls.
> - **Wizard's Chess**: Point Lights above the board for ambient illumination, Spot Lights for dramatic piece highlighting (when a piece is selected or about to strike), Rect Lights for soft window light in the background environment.

#### Per-Light Settings

Each light actor, when MegaLights is enabled globally, exposes:

- **Shadow Method**: Default (uses MegaLights), Ray Tracing, Virtual Shadow Map. Allows opting individual lights out of MegaLights.
- **Disable MegaLights**: Per-light toggle to exclude a specific light from the MegaLights pipeline.

> **In your games:**
> - **DnD RPG**: Your main directional sunlight or moonlight might work better with Virtual Shadow Maps (more stable, less noise for large-scale shadows). Keep MegaLights for the many small dynamic torches and spell effects where the amortized cost pays off. This per-light control lets you mix and match.
> - **Wizard's Chess**: If using MegaLights, keep your key light on VSM for clean, stable shadows of the pieces. Use MegaLights for ambient candle/decorative lights in the background.

#### Performance

- MegaLights amortizes shadow cost, making hundreds or thousands of dynamic shadow-casting lights feasible.
- **Downsampling**: `r.MegaLights.DownsampleCheckerboard` allows half-resolution sampling as a middle ground between quarter and full resolution.
- **Ray Merging**: Identical rays are merged to avoid duplicated trace overhead.
- **VSM Integration**: MegaLights-driven Virtual Shadow Mapping only marks selected pages, reducing VSM overhead.
- **Vectorized Shading**: Always vectorizes samples, saving 0.1-0.2ms on current-gen consoles.
- Better out-of-the-box performance and reduced manual optimization needs compared to traditional per-light shadow approaches.

> **In your games:**
> - **DnD RPG**: Use `r.MegaLights.DownsampleCheckerboard` during gameplay for better performance, and switch to full resolution for cutscenes or screenshots. Monitor the noise level; temporal denoising should clean it up, but if you see noticeable grain in dark dungeon corners, increase quality or reduce the number of low-importance shadow-casting lights.
> - **Wizard's Chess**: If you enable MegaLights, full resolution sampling is fine since the scene is small.

#### Limitations

- Requires ray tracing-capable hardware for best results.
- Stochastic sampling introduces noise (temporal denoising mitigates this; 5.7 improves noise reduction).
- Not all materials interact perfectly with MegaLights (translucent and hair support improved in 5.7 but may still have artifacts).
- Higher base cost than unshadowed lights; the benefit shows when many shadowed lights are needed.
- Per-light shadow map approach may still be cheaper for scenes with very few dynamic lights.

> **In your games:**
> - **DnD RPG**: Watch for noise in dark scenes. Dungeons are naturally dark, so stochastic noise can be more visible. Test thoroughly in your darkest rooms. Translucent materials (potion bottles, ghostly enemies, magical barriers) may have artifacts with MegaLights, so test those specifically and consider opting those lights out if needed.
> - **Wizard's Chess**: If you use translucent materials for glowing piece effects or a glass board variant, test them with MegaLights on and off to check for artifacts.

#### Console Commands

| Command | Description |
|---------|-------------|
| `r.MegaLights` | Master enable/disable (0/1) |
| `r.MegaLights.DownsampleCheckerboard` | Half-resolution checkerboard sampling |
| `r.MegaLights.DefaultShadowMethod` | Default shadow method for MegaLights |
| `r.MegaLights.HardwareRayTracing.ForceTwoSided` | Force two-sided tracing (performance acceleration) |

> **In your games:**
> - **DnD RPG**: Bind `r.MegaLights 0` and `r.MegaLights 1` to debug keys during development. Toggle it on and off to compare visual quality and performance in each dungeon room. Use `r.MegaLights.DownsampleCheckerboard 1` as a quick performance boost when testing on lower-end hardware.
> - **Wizard's Chess**: Use these commands for A/B comparison during development. Toggle MegaLights to decide if the visual improvement justifies the cost for your specific board setup.
