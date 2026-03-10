# Module 05: Resources

---

## Megascans and Free Assets

### Quixel Megascans (Built into UE5)
- **Access**: Window > Quixel Bridge (inside UE5)
- **URL**: [https://quixel.com/megascans](https://quixel.com/megascans)
- Thousands of photorealistic scanned surfaces, 3D assets, and decals. Free for Unreal Engine projects. Search for "stone," "wood," "dungeon," "medieval" for relevant assets.

### Fab Marketplace
- **URL**: [https://www.fab.com/](https://www.fab.com/)
- Browse free and paid assets. Filter by "Free" to find material packs, environment props, and particle effects suitable for a fantasy dungeon.

### Recommended Free Packs for Dungeons
- **Megascans Surfaces**: "Castle Stone Floor," "Medieval Brick Wall," "Old Wood Planks"
- **Megascans 3D**: "Medieval Props" (barrels, crates, candles)
- **Paragon Effects**: Free particle effects from Epic's Paragon project, including fire, magic, and environmental effects
- **Infinity Blade Assets**: Free fantasy environment pieces from Epic

---

## Materials and PBR

### Official UE5 Material Documentation
- **URL**: [https://docs.unrealengine.com/5.4/en-US/unreal-engine-materials/](https://docs.unrealengine.com/5.4/en-US/unreal-engine-materials/)
- Comprehensive reference for the material system. Dense but useful when you want to understand specific material features.

### Material Instances Guide
- **URL**: [https://docs.unrealengine.com/5.4/en-US/instanced-materials-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/instanced-materials-in-unreal-engine/)
- How to create and use Material Instances for efficient variations.

### PBR Explained Simply
- PBR (Physically Based Rendering) means materials respond to light the way real surfaces do. You only need to understand four properties:
  - **Base Colour**: The surface colour
  - **Roughness**: Smooth (0) to rough (1)
  - **Metallic**: Non-metal (0) or metal (1)
  - **Normal Map**: Surface detail without geometry

---

## Lighting

### Lumen Global Illumination
- **URL**: [https://docs.unrealengine.com/5.4/en-US/lumen-global-illumination-and-reflections-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/lumen-global-illumination-and-reflections-in-unreal-engine/)
- Official documentation on Lumen. For most cases, you just need to know it is on by default and handles light bouncing automatically.

### Nanite Virtualized Geometry
- **URL**: [https://docs.unrealengine.com/5.4/en-US/nanite-virtualized-geometry-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/nanite-virtualized-geometry-in-unreal-engine/)
- How Nanite handles millions of polygons efficiently. Enable it on environment meshes for maximum detail without performance cost.

---

## Post-Processing

### Post Process Effects Reference
- **URL**: [https://docs.unrealengine.com/5.4/en-US/post-process-effects-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/post-process-effects-in-unreal-engine/)
- Full list of every post-processing setting available in UE5. Useful as a reference when tweaking the look of your dungeon.

### Key Settings for Dungeon Atmosphere
- **Bloom**: Intensity 0.3-0.7 for torch glow
- **Exposure**: Min 0.5, Max 2.0 for controlled darkness
- **Colour Grading**: Warm highlights, cool shadows
- **Vignette**: 0.3-0.5 for subtle edge darkening
- **Ambient Occlusion**: Adds shadows in crevices and corners

---

## YouTube Tutorials

### Unreal Sensei: Lighting and Environment
- **URL**: [https://www.youtube.com/@UnrealSensei](https://www.youtube.com/@UnrealSensei)
- Specialises in making UE5 scenes look stunning. His lighting tutorials are particularly relevant for dungeon atmosphere.

### William Faucher: Cinematic UE5
- **URL**: [https://www.youtube.com/@WilliamFaucher](https://www.youtube.com/@WilliamFaucher)
- Cinematic-quality tutorials on lighting, post-processing, and materials. Great for understanding how professionals achieve specific moods and visual styles.

### UE5 "Make It Look Good Fast" (Search Term)
- Search YouTube for "UE5 make it look good fast" or "UE5 quick environment setup." Many creators have tutorials showing how to go from grey box to polished scene in under 30 minutes using Megascans and Lumen.

---

## Quick Reference: Dungeon Lighting Recipe

For a quick dungeon atmosphere setup, use these values as a starting point:

**Point Lights (Torches)**:
- Colour: R:255, G:180, B:80
- Intensity: 3000-5000
- Attenuation Radius: 600-1000

**Exponential Height Fog**:
- Fog Density: 0.01-0.03
- Volumetric Fog: Enabled
- Fog Colour: Desaturated blue-grey

**Post Process Volume (Unbound)**:
- Bloom Intensity: 0.5
- Exposure Min/Max: 0.5 / 2.0
- Vignette: 0.4
- Shadows Tint: Slight blue shift
