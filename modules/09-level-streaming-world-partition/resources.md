# Module 09: Resources - The Open World

## Official UE5 Documentation

### World Partition
- **World Partition Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-in-unreal-engine
- **World Partition Streaming**: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-streaming-in-unreal-engine
- **Data Layers**: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-data-layers-in-unreal-engine
- **HLOD**: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-hlod-in-unreal-engine

### Level Streaming
- **Level Streaming Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-in-unreal-engine
- **Level Streaming Volumes**: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-volumes-in-unreal-engine

### Landscape
- **Landscape Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-outdoor-terrain-in-unreal-engine
- **Landscape Materials**: https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-materials-in-unreal-engine
- **Landscape Editing**: https://dev.epicgames.com/documentation/en-us/unreal-engine/editing-landscapes-in-unreal-engine

### Foliage
- **Foliage Mode**: https://dev.epicgames.com/documentation/en-us/unreal-engine/foliage-mode-in-unreal-engine

### PCG (Procedural Content Generation)
- **PCG Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-overview
- **PCG Graph**: https://dev.epicgames.com/documentation/en-us/unreal-engine/pcg-graph-in-unreal-engine

### Rendering and Optimization
- **Nanite**: https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine
- **Lumen**: https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine
- **Virtual Shadow Maps**: https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-shadow-maps-in-unreal-engine
- **Performance Guidelines**: https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-guidelines-for-unreal-engine

### Profiling
- **Stat Commands Reference**: https://dev.epicgames.com/documentation/en-us/unreal-engine/stat-commands-in-unreal-engine
- **Unreal Insights**: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine

## Video Tutorials

### World Partition
- **Unreal Engine - World Partition | Inside Unreal**: Official deep dive into World Partition setup, cell configuration, and Data Layers.
- **BuildGamesWithJon - World Partition Tutorial**: Practical walkthrough from empty level to a working World Partition setup.

### Open World Design
- **GDC Talk - Creating Worlds: Open World Level Design**: General principles for open world level design. Distance, landmarks, and pacing.
- **Unreal Engine - Building Large Worlds in UE5**: Official presentation on open world techniques including streaming, HLOD, and PCG.

### Landscape
- **Unreal Sensei - UE5 Landscape Tutorial**: Complete landscape setup with multi-layer materials, sculpting, and foliage painting.
- **PrismaticaDev - Landscape Material Setup**: Detailed material graph for blending terrain layers.

### PCG
- **Unreal Engine - PCG Framework Deep Dive**: Official walkthrough of the PCG graph editor with forest generation examples.
- **Adrien Logut - PCG Forest Tutorial**: Practical PCG forest with exclusion zones, density variation, and undergrowth.

### Optimization
- **Tech Art Aid - UE5 Profiling Guide**: How to read stat commands, identify bottlenecks, and optimize frame time.
- **Unreal Engine - Nanite Deep Dive**: When to use Nanite, what it does well, and its current limitations.

## Design References

### Open World RPGs to Study
- **Skyrim**: Study the landmark-based navigation system. Towers, mountains, and ruins are always visible, guiding the player naturally.
- **Breath of the Wild**: Study the "see it, go there" design philosophy. Every point of interest is visible from a distance.
- **The Witcher 3**: Study the density of points of interest and how they are distributed across the map. Notice the mix of combat, discovery, and narrative encounters.
- **Divinity: Original Sin 2**: Study how a smaller world (compared to Skyrim) can still feel vast through density and verticality.

### Tabletop/Miniature Aesthetics
- **Demeo (VR)**: A VR tabletop RPG where the game world IS a miniature on a table. Directly relevant to Tabletop Quest's tabletop view.
- **Wartales**: Top-down RPG with a hand-painted map aesthetic. Good reference for how the tabletop map could look.
- **Inkle's Overland games**: Abstract but evocative map styles that communicate terrain type through color and shape.

## Free Asset Packs

### Landscape and Environment
- **Quixel Megascans** (free with UE5): Photorealistic rocks, trees, ground textures. Excellent for prototyping terrain: https://quixel.com/megascans
- **Kenney Nature Kit**: Free low-poly trees, rocks, and terrain pieces: https://kenney.nl
- **Open World Demo Collection**: Epic's free open world assets (available in the Marketplace Learning section)

### Modular Buildings
- **Medieval Market Pack**: Free or low-cost medieval building modules on the Marketplace
- **Quaternius Medieval Town**: Free low-poly medieval buildings: https://quaternius.com

## UE5 Python Scripting
- **Python Editor Script Plugin**: https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python
- Use Python to batch-place actors from JSON data files, automate Data Layer assignments, and configure streaming volumes programmatically
