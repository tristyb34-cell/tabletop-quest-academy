# Module 05: Resources - Making It Beautiful

A curated collection of documentation, tutorials, and references for materials, lighting, rendering, and visual polish in Unreal Engine 5.

---

## Official Epic Games Documentation

### Materials in UE5
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-materials](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-materials)
- **Why it matters**: The comprehensive guide to UE5's material system. Covers the Material Editor, material expressions (nodes), material instances, material functions, and all the input channels (Base Color, Normal, Roughness, Metallic, Emissive, etc.). Your primary reference for anything material-related.

### Material Instances
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/instanced-materials-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/instanced-materials-in-unreal-engine)
- **Why it matters**: Explains how to create parameterized parent materials and generate instances for variations. Essential for the "one material, many looks" workflow used throughout Tabletop Quest.

### Lumen Global Illumination and Reflections
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine)
- **Why it matters**: The official Lumen reference. Covers how Lumen traces light, its performance characteristics, quality settings, and best practices. Critical for understanding why your tavern looks warm and your dungeon looks moody.

### Nanite Virtualized Geometry
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine)
- **Why it matters**: Everything about Nanite: how it works, what it supports (and does not support), how to enable it, and performance considerations. Key for understanding why environment meshes use Nanite but characters do not.

### Post Process Effects
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/post-process-effects-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/post-process-effects-in-unreal-engine)
- **Why it matters**: Reference for all post-processing settings: Bloom, Auto Exposure, Colour Grading, Vignette, Depth of Field, Motion Blur, Ambient Occlusion, and more. Covers both global and per-volume settings.

### Volumetric Fog
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/volumetric-fog-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/volumetric-fog-in-unreal-engine)
- **Why it matters**: How to set up and configure volumetric fog for light shafts, atmospheric haze, and dusty air effects. Used in all three Tabletop Quest environments.

### Sky Atmosphere
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/sky-atmosphere-component-in-unreal-engine)
- **Why it matters**: Configuring the atmospheric sky for the overworld. Covers Rayleigh scattering (blue sky), Mie scattering (hazy horizon), and sun disk appearance.

### Landscape Materials
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-materials-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-materials-in-unreal-engine)
- **Why it matters**: How to create multi-layer landscape materials (grass, dirt, rock, snow) that blend based on painting. Essential for the overworld terrain.

---

## Fab / Megascans

### Fab Marketplace
- **URL**: [https://www.fab.com/](https://www.fab.com/)
- **Why it matters**: The official marketplace for UE5 assets, including the entire Megascans library. Free for Unreal Engine projects. Search for materials, 3D assets, environments, and VFX.

### Megascans Collections for Fantasy Environments
- **Tip**: Search Fab for these keywords to find assets relevant to Tabletop Quest:
  - "medieval stone" (dungeon walls)
  - "wooden planks" (tavern floors, furniture)
  - "moss rock" (dungeon and overworld)
  - "grass ground" (overworld terrain layers)
  - "medieval props" (tavern and dungeon decoration)
  - "castle ruins" (overworld exploration areas)

---

## Community Tutorials

### William Faucher's Lumen and Nanite Tutorials
- **URL**: Search YouTube for "William Faucher UE5 Lumen" and "William Faucher Nanite"
- **Why it matters**: High-quality, visual tutorials that show Lumen and Nanite in action. William Faucher creates stunning UE5 environments and explains his process clearly. Particularly good for understanding Lumen lighting setups.

### Ben Cloward's Material Tutorials
- **URL**: [https://www.youtube.com/@BenCloward](https://www.youtube.com/@BenCloward)
- **Why it matters**: Ben Cloward is a senior technical artist who creates in-depth material tutorials. His channel covers everything from basic PBR setup to advanced material effects like dissolve, damage overlays, and world-aligned blending. Extremely relevant for the material techniques in this module.

### PrismaticaDev's UE5 Environment Art
- **URL**: Search YouTube for "PrismaticaDev UE5 environment"
- **Why it matters**: Practical environment art tutorials covering landscape setup, material blending, foliage placement, and lighting. Good for the overworld environment workflow.

### Unreal Sensei: Lighting and Post-Processing
- **URL**: Search YouTube for "Unreal Sensei lighting tutorial UE5"
- **Why it matters**: Step-by-step lighting tutorials covering interior scenes (tavern), exterior scenes (overworld), and dramatic lighting (dungeon/boss rooms). Includes post-processing setup.

### Stylized Station
- **URL**: Search YouTube for "Stylized Station UE5"
- **Why it matters**: Tabletop Quest aims for "slightly stylized fantasy" rather than photorealism. Stylized Station tutorials show how to push materials and lighting toward a painterly/fantasy aesthetic while still using PBR.

---

## PBR Reference and Theory

### "PBR Guide" by Allegorithmic (Adobe Substance)
- **URL**: [https://substance3d.adobe.com/tutorials/courses/the-pbr-guide-part-1](https://substance3d.adobe.com/tutorials/courses/the-pbr-guide-part-1)
- **Why it matters**: The definitive guide to PBR theory. Explains base colour, metallic, roughness, and normal maps with clear diagrams and real-world examples. If you want to understand WHY PBR values are what they are (why wood is not metallic, why roughness ranges from 0 to 1), this is the resource.

### "Real-Time Rendering" Chapter on PBR
- **URL**: [https://www.realtimerendering.com/](https://www.realtimerendering.com/)
- **Why it matters**: The academic reference for physically based rendering. Dense but authoritative. Read this if you want to understand the math behind the material system (not required for Tabletop Quest, but satisfying for the curious).

---

## Colour and Lighting Theory

### "Colour and Light" by James Gurney
- **Why it matters**: A book by the creator of Dinotopia that explains how light and colour work in natural and artificial environments. Invaluable for understanding why warm light feels cozy (tavern) and cool light feels eerie (dungeon). Covers bounced light, colour temperature, and atmospheric perspective. Available as a physical book.

### "Lighting for Film and Digital Cinematography"
- **Why it matters**: Game lighting borrows heavily from film lighting techniques. Three-point lighting, motivated vs. unmotivated light, colour contrast, and practical lights are all applicable. Many YouTube channels cover film lighting principles that translate directly to UE5.

### Google Arts & Culture: Vermeer Lighting
- **URL**: [https://artsandculture.google.com/entity/johannes-vermeer](https://artsandculture.google.com/entity/johannes-vermeer)
- **Why it matters**: Vermeer's paintings are the visual inspiration for the Tabletop Quest tavern scene. Study how he used window light, candlelight, and bounced warm tones to create intimate, warm interiors. His lighting setups translate directly to UE5 light placement.

---

## Performance Profiling

### Unreal Insights
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)
- **Why it matters**: The primary performance profiling tool. When your beautiful scene drops below 60 FPS, Insights tells you exactly what is costing GPU time: Lumen traces, material shader complexity, draw calls, or geometry overdraw.

### Stat Commands for Quick Profiling
- `stat fps`: Frame rate counter
- `stat unit`: Frame time breakdown (Game thread, Render thread, GPU)
- `stat scenerendering`: Draw calls, triangle count, render passes
- `stat gpu`: GPU time per render pass
- `stat lumen`: Lumen-specific performance metrics

### GPU Visualizer
- **Console command**: `profilegpu`
- **Why it matters**: Shows a bar chart of GPU time per render pass. Quickly identifies whether Lumen, Shadow Maps, Base Pass, or Post-Processing is the bottleneck.

---

## Recommended Learning Path

1. Read the PBR Guide Part 1 to understand the material system fundamentals
2. Import Megascans assets and build the tavern material set (Exercises 1-2)
3. Watch William Faucher's Lumen tutorial before lighting the tavern (Exercise 3)
4. Light all three environments (Exercises 3-5)
5. Study Vermeer paintings for tavern lighting inspiration
6. Set up post-processing for mood differentiation (Exercise 6)
7. Build the zoom transition material (Exercise 7)
8. Profile and optimize (Exercise 8)
9. Move on to Module 06 for camera and input systems
