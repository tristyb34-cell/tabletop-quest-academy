## World Building

### World Partition

World Partition is the default world management system in UE5, replacing the legacy World Composition. It divides the world into a grid of cells that stream in and out based on distance from streaming sources.

#### Enabling World Partition

- New maps created with **File > New Level > Open World** have World Partition enabled by default.
- To convert a legacy map: **Tools > Convert Level** or in **World Settings > World Partition > Enable Streaming**.
- World Partition settings live in **World Settings > World Partition**.

#### Grid Size

- **World Settings > World Partition > Runtime Settings > Grid Size**: Controls the cell size for streaming. Default is 12800 (128 meters).
- Smaller grids give finer streaming control but increase overhead. Larger grids reduce overhead but load more content per cell.
- Typical values range from 6400 (64m) for dense indoor environments to 25600 (256m) for open landscapes.

> **In your games:**
> - **DnD RPG**: Use a smaller grid size (6400 or 64m) since your dungeon rooms are dense indoor environments with lots of detail packed into compact spaces. Each dungeon room might fit within one or two grid cells. This gives fine-grained control so only the current room and adjacent rooms are loaded, keeping memory low. For outdoor overworld areas (if you add a hub town or world map), use a larger grid (12800 or 128m).
> - **Wizard's Chess**: World Partition is likely overkill for a single chess board scene. A standard level without World Partition is simpler. However, if you build multiple themed arenas (stone castle, enchanted forest, volcanic lair), you could use World Partition with a large grid (25600) to keep only the active arena loaded while the others stay unloaded.

#### Streaming

- Streaming is distance-based from streaming sources (typically the player camera).
- **Loading Range**: Per-actor override in **Details > World Partition > Runtime Grid** to control which grid the actor belongs to.
- Actors are assigned to grid cells automatically based on their world position.
- Streaming can be previewed with **World Partition > Streaming > Debug Draw** in the editor viewport.

> **In your games:**
> - **DnD RPG**: This is the core system for your dungeon crawling. As the player moves through connected dungeon rooms, World Partition streams in the next room and streams out rooms that are far behind. Place a streaming source on the player camera. When the party enters a corridor between rooms, the next room's cell loads in the background. Use the debug draw visualization during development to verify that rooms load before the player can see empty space. You can also add a secondary streaming source ahead of the player (in the direction they are moving) to pre-load rooms before arrival.
> - **Wizard's Chess**: If using World Partition for multiple arenas, the streaming source follows the camera. Only the current arena's cell is loaded. When the player selects a new arena from the menu, the old one streams out and the new one streams in.

#### Data Layers

- Data Layers allow you to group actors into logical layers that can be loaded and unloaded independently.
- Create via **Window > World Partition > Data Layers**.
- Actors are assigned to data layers in their **Details > World Partition > Data Layers** property.
- Data layers can be activated or deactivated at runtime through Blueprints or C++ using `UDataLayerManager`.
- Use cases: different game modes sharing the same world, day/night variants, multiplayer-specific actors.

> **In your games:**
> - **DnD RPG**: Use Data Layers to separate dungeon content by difficulty tier or quest state. For example, a "BossRoom_Active" layer contains the boss, minions, and traps, while a "BossRoom_Cleared" layer contains loot drops and opened doors. Activate the correct layer based on quest progress. You could also use Data Layers for the tabletop-to-3D zoom transition: one layer holds the tabletop miniature versions of everything, and another layer holds the full 3D environment. Toggle between them during the zoom.
> - **Wizard's Chess**: Use Data Layers for themed arena decoration. A "StoneCastle" layer and an "EnchantedForest" layer share the same board geometry but swap out surrounding environment props. Activate only the selected theme's layer.

#### HLOD (Hierarchical Level of Detail)

- HLOD generates simplified proxy meshes for distant viewing, replacing streamed-out actors.
- **Setup**: **World Partition > HLOD** section in World Settings.
- **HLOD Layers**: Assign actors to HLOD layers in **Details > World Partition > HLOD Layer**.
- **Build HLODs**: **Build > Build HLODs** from the main menu or via commandlet.
- HLOD types: Instancing (groups instances), Merged Mesh (combines geometry), Simplified Mesh (decimated), Approximate (billboard/imposter).
- **Custom HLODs** (new in 5.7): Inject custom HLOD representations for greater control over distant geometry.
- Console: `wp.Runtime.HLOD` namespace for HLOD runtime commands.

> **In your games:**
> - **DnD RPG**: HLOD is useful if your dungeon has long sightlines (e.g., a grand hall where the player can see distant rooms through archways). Use Merged Mesh HLODs for distant room geometry so it still looks solid but renders cheaply. For the tabletop overview camera (zoomed out view of the whole dungeon), HLOD proxies replace all the detailed room interiors with simplified shapes, keeping the frame rate stable while showing the full dungeon layout.
> - **Wizard's Chess**: HLOD is not needed for a single board scene. The entire board and pieces are close enough to the camera that full detail rendering is appropriate at all times.

#### Runtime Hash

- The Runtime Hash determines how actors are distributed into streaming cells.
- **World Settings > World Partition > Runtime Hash**: Choose between `RuntimeHashSetExternalStreamingObject` or custom hash implementations.
- The hash grid can be visualized with the minimap overlay.

#### Streaming Sources

- Streaming sources define the origin points from which distance-based streaming is calculated.
- The default streaming source is the player camera via `AWorldPartitionStreamingSource`.
- Add custom streaming sources by placing `WorldPartitionStreamingSource` actors or by implementing `IWorldPartitionStreamingSourceProvider`.
- Configure in **Details > Streaming > Streaming Source** properties: shapes (sphere, box), priority, and loading range overrides.

#### Minimap

- **Window > World Partition > World Partition Editor** opens the minimap view.
- Shows the grid layout, loaded/unloaded cells, actor placement, and streaming source radii.
- Cells are color-coded: loaded (green), unloaded (grey), loading (yellow).
- Right-click cells to manually load/unload for editing.

> **In your games:**
> - **DnD RPG**: Use the minimap editor view constantly during dungeon layout. It shows you which cells contain which rooms, how the streaming radii overlap, and whether any rooms have gaps in coverage. Color-coded cells (green = loaded, grey = unloaded) help you verify that the player never walks into an unloaded area. This is your primary debugging tool for the connected-rooms streaming system.
> - **Wizard's Chess**: Less relevant for a single-scene game. Use it only if managing multiple arenas to verify that arena cells do not overlap or conflict.

### Level Instances

#### Packed Level Instances

- Packed Level Instances are self-contained sub-levels that can be placed as single actors in a World Partition world.
- Create via **Window > Levels > Create Packed Level Instance** or by right-clicking selected actors and choosing **Level > Create Packed Level Instance**.
- They allow modular level design: build a room, building, or POI once and place it multiple times.
- Each instance shares the same source level but can have unique transforms.

#### Level Instance Actors

- `ALevelInstance` is the actor class representing an instanced sub-level.
- Properties in **Details > Level Instance**: Level Asset reference, World Partition streaming behavior, Filter settings.
- Level Instance actors participate in World Partition streaming like regular actors.
- Nested level instances are supported.

#### Editing Level Instances

- Double-click a Level Instance actor in the viewport or Outliner to enter edit mode.
- In edit mode, the parent level is dimmed and you edit the sub-level in isolation.
- Changes to the sub-level propagate to all instances of that level.
- **Commit** changes via the prompt in the toolbar, or **Discard** to revert.
- You can also break a level instance into individual actors with **Right-click > Level > Break Level Instance**.

> **In your games:**
> - **DnD RPG**: Level Instances are perfect for your modular dungeon design. Build each room type as a Packed Level Instance: a "Corridor" room, a "Treasure Room", a "Boss Arena", a "Trap Hallway", a "Prison Cell", etc. Then assemble full dungeons by placing instances of these rooms together, connecting them with doorway pieces. If you improve the "Treasure Room" layout, every dungeon that uses it updates automatically. This is the building-block approach to dungeon crawling. You can even randomize room placement at runtime for procedural dungeons by spawning Level Instance actors from a pool of room templates.
> - **Wizard's Chess**: Build the chess board and its border as one Packed Level Instance. Build each themed surrounding environment (castle walls, forest trees, volcanic rocks) as separate Level Instances. Swap the environment instance to change the arena theme while keeping the board the same.

### Landscape

#### Creation

- **Modes > Landscape (Shift+3)** opens the Landscape tool.
- **Manage > New Landscape**: Set section size (63x63, 127x127, 255x255), sections per component (1x1 or 2x2), number of components, and overall resolution.
- Recommended section size: 127x127 for most use cases.
- Scale: default 100 units per vertex in X/Y, 100 units per unit in Z.
- Import heightmaps: 16-bit PNG or RAW format. Resolution must match component layout.
- **Location and Scale** settings position and size the landscape in world space.

> **In your games:**
> - **DnD RPG**: If you add an outdoor overworld or a hub town area, use Landscape for the terrain. For dungeon interiors, Landscape is not appropriate since dungeons are built from modular room meshes and BSP/static mesh geometry. However, a small landscape works well for a forest clearing around a dungeon entrance, a mountain pass between locations, or a village where the party rests between quests. Use a smaller overall resolution since your outdoor areas are likely compact, not open world.
> - **Wizard's Chess**: Not applicable. Chess boards are flat mesh surfaces, not terrain. Skip Landscape entirely.

#### Sculpting Tools

All sculpting tools are accessed via **Modes > Landscape > Sculpt** tab.

- **Sculpt (Ctrl+1)**: Raises or lowers terrain based on brush stroke. Hold Shift to invert (lower). Brush settings: Strength, Radius, Falloff.
- **Smooth (Ctrl+2)**: Averages height values within the brush radius to smooth sharp edges. Strength controls the smoothing intensity. Filter Kernel Size adjusts the sampling area.
- **Flatten (Ctrl+3)**: Sets terrain to a target height. Click to sample the target height, then paint. Options: Flatten Mode (Both, Raise Only, Lower Only), Use Slope Flatten, Pick Value Per Apply.
- **Ramp (Ctrl+4)**: Creates a linear ramp between two points. Click to set start point, click again for end point, then apply. Width and falloff side controls available.
- **Erosion (Ctrl+5)**: Simulates thermal erosion, moving material from high slopes to lower areas. Settings: Erosion Threshold (minimum slope angle), Surface Thickness, Iterations, Noise Mode, Noise Scale.
- **Hydro Erosion (Ctrl+6)**: Simulates water-based erosion. Settings: Rain Amount, Sediment Cap, Iterations, Initial Rain Distribution, Rain Dist Scale, Detail Smooth, Erosion Detail.
- **Noise (Ctrl+7)**: Applies Perlin noise to the terrain. Settings: Noise Mode (Both, Raise, Lower), Noise Scale, noise strength independent of brush strength.
- **Retopologize (Ctrl+8)**: Redistributes landscape vertices to reduce T-junctions and improve triangle distribution on slopes. Does not change the visual shape significantly.
- **Mirror (Ctrl+9)**: Mirrors the landscape along a defined axis. Settings: Mirror Point, Mirror Operation (Minus to Plus, Plus to Minus), Smoothing Width.

> **In your games:**
> - **DnD RPG**: For outdoor hub areas, use **Sculpt** to create rolling hills around a village or a rocky cliff face near a dungeon entrance. Use **Smooth** to clean up harsh edges around paths. Use **Flatten** to create flat building plots for the tavern and blacksmith. Use **Noise** to add natural roughness to wilderness areas. Use **Erosion** on mountain slopes to make them look weathered. Use **Ramp** to create a smooth path from the village down to a river crossing. These tools shape the environment players explore between dungeon runs.
> - **Wizard's Chess**: Not applicable. No landscape terrain needed.

#### Painting

- **Modes > Landscape > Paint** tab for texture painting.
- Paint landscape material layers using brush strokes.
- Layer blend modes: Weight-Blend (normalized, layers sum to 1.0), Alpha-Blend (priority-based, non-normalized).
- Brush settings same as sculpting: Radius, Falloff, Strength.
- Target layers listed in the Paint panel correspond to the layers defined in the Landscape Material.

> **In your games:**
> - **DnD RPG**: For outdoor areas, paint dirt paths between buildings, grass in open fields, rock on cliff faces, and mud near water. Use Weight-Blend so the layers blend smoothly at borders (no hard edges between grass and dirt on a footpath). This creates natural-looking terrain around your hub town or dungeon entrance areas.
> - **Wizard's Chess**: Not applicable.

#### Layers

- Landscape layers are defined in the Landscape Material using `LandscapeLayerBlend`, `LandscapeLayerCoords`, and `LandscapeLayerWeight` nodes.
- Each layer has: Layer Name, Preview Weight, Blend Type.
- Layer Info objects (Weight-Blended or Non-Weight-Blended) are created per layer and stored as assets.
- Layer Info assignment: click the **+** icon next to each layer in the Paint panel.

#### LOD (Level of Detail)

- Landscape LOD is automatic and distance-based.
- **Landscape Component > Details > LOD**: LOD Bias, LOD Falloff (Linear or Square Root).
- Forced LOD can be set per-component.
- LOD Group settings in **Project Settings > Engine > Rendering > Landscape**.
- `r.LandscapeLODBias` console command adjusts global LOD bias.
- `r.ForceLOD` can override landscape LOD for debugging.

#### Grass Type

- `ULandscapeGrassType` asset defines procedural grass spawning on landscape layers.
- Create: **Content Browser > Right-click > Miscellaneous > Landscape Grass Type**.
- Each grass type specifies: Static Mesh, Density (instances per 10 sq meters), Scaling (min/max), Random Rotation, Align to Surface, Use Landscape Lightmap, Cull Distance (start/end).
- Assign grass types to landscape material layers using the **Grass Output** node in the material graph.
- Grass is generated procedurally at runtime and does not persist as placed actors.

#### Landscape Materials

- Landscape materials use specialized nodes: `LandscapeLayerBlend`, `LandscapeLayerCoords`, `LandscapeLayerSample`, `LandscapeLayerSwitch`.
- `LandscapeLayerBlend` node: Add layers with names matching the paint layers. Blend Type: LB_WeightBlend or LB_AlphaBlend or LB_HeightBlend.
- Tessellation and displacement supported via World Position Offset.
- Material should output to Base Color, Normal, Roughness, Metallic as minimum.
- Performance: keep landscape material complexity reasonable; use Material Quality Level switches for scalability.

#### Edit Layers

- Edit Layers enable non-destructive, stackable landscape editing.
- **Enable**: Landscape actor **Details > Enable Edit Layers** checkbox.
- Create layers in **Modes > Landscape > Manage > Edit Layers** panel.
- Each edit layer acts as a separate height/weight modification that stacks on the base landscape.
- Layers can be reordered, toggled on/off, and have blend modes (Additive, Alpha Blend).
- Blueprint-driven edit layers allow runtime landscape modification with undo capability.

> **In your games:**
> - **DnD RPG**: Edit Layers are useful if you want non-destructive terrain editing in outdoor areas. For example, keep a base terrain layer, then add a "Destruction" edit layer that craters the ground after a boss fight in an outdoor arena. You can toggle the destruction layer on/off based on quest state. This also helps during development: keep your base terrain clean and experiment with modifications on separate layers.
> - **Wizard's Chess**: Not applicable.

### Foliage

#### Painting

- **Modes > Foliage (Shift+4)** opens the Foliage tool.
- Add foliage types by dragging Static Mesh assets into the foliage type list or clicking **+ Add Foliage Type**.
- Paint with left mouse button, erase with Shift+left mouse button.
- Brush settings: Brush Size, Paint Density, Erase Density, Filter (Landscape, BSP, Static Mesh, Translucent, Foliage).
- Per-type settings: Density, Radius, Scaling (min/max, uniform/free/lock XY), Ground Slope Angle (min/max), Height Range, Random Yaw, Random Pitch, Align to Normal (max angle), Z Offset.
- Collision: per-type collision presets and collision profile overrides.

> **In your games:**
> - **DnD RPG**: Paint foliage around outdoor areas: grass and wildflowers in fields, mushrooms in dark cave entrances, vines on dungeon walls (using the Static Mesh filter to paint on wall meshes). Set Ground Slope Angle limits so grass only appears on flat/gentle slopes, and moss/lichen appears on steep cliff faces. Use Random Yaw and scaling variation for natural-looking vegetation. Set short cull distances on small ground clutter so it does not render from far away. For the tabletop view (zoomed out), most foliage should cull away entirely.
> - **Wizard's Chess**: For themed arenas like an enchanted forest, paint trees and undergrowth around the board perimeter using the foliage tool. Keep density moderate since the focus should be on the board, not the environment. Use cull distances so distant foliage fades out cleanly.

#### Instanced Static Meshes

- Foliage uses `UInstancedStaticMeshComponent` (ISM) or `UHierarchicalInstancedStaticMeshComponent` (HISM) under the hood.
- HISM provides automatic LOD and culling for large instance counts.
- Instance count limits depend on GPU memory; typical scenes handle hundreds of thousands of instances.
- Per-instance custom data can be set for material variation.
- `InstancedStaticMeshComponent` settings: Instance Start Cull Distance, Instance End Cull Distance.

> **In your games:**
> - **DnD RPG**: Instanced Static Meshes power all your foliage rendering under the hood. For dungeon interiors, use HISM for repeated props like wall torches, floor tiles, scattered bones, and debris. Hundreds of identical torch meshes instanced together render much faster than individual static mesh actors. Set per-instance custom data to vary torch flame brightness or debris coloring.
> - **Wizard's Chess**: The 32 chess pieces can use ISM if you have multiple identical pieces (e.g., 8 white pawns = 8 instances of the same mesh). However, since individual pieces need to move independently during gameplay, regular Static Mesh Components per piece are simpler. ISM is better suited for decorative repeated elements like arena pillars or candles around the board.

#### Procedural Foliage

- **Procedural Foliage Spawner** actor generates foliage over a volume.
- Requires a `ProceduralFoliageSpawner` volume placed in the level and a `FoliageType_InstancedStaticMesh` asset.
- Configure simulation settings: Tile Size, Num Unique Tiles, Random Seed.
- Each foliage type defines: Collision Radius, Shade Radius, Seed Density, Spread Distance, Growth Steps, Can Grow in Shade, Spawns in Shade.
- Run simulation via **Details > Resimulate** button.
- Procedural foliage respects landscape layers if configured with Landscape Layers exclusion/inclusion.

> **In your games:**
> - **DnD RPG**: Use Procedural Foliage Spawner to fill outdoor areas quickly. Place a volume over a forest region and configure tree, bush, and grass types with appropriate seed density and shade settings. Trees with large Shade Radius will suppress undergrowth beneath their canopy automatically, creating realistic forest floors. This is much faster than hand-painting thousands of foliage instances for a forest around a dungeon entrance.
> - **Wizard's Chess**: For a forest-themed arena, place a Procedural Foliage Spawner volume in a ring around the board. Configure trees and bushes to fill the surrounding area while excluding the board zone itself using a bounds exclusion.

#### Nanite Foliage (New in 5.7, Experimental)

Nanite Foliage is a major new system that extends Nanite to vegetation rendering. It is marked as Experimental in UE 5.7.

**Core Technologies:**

- **Nanite Voxels**: A new automatic LOD system where distant trees transition into voxel representations. Only nearby trees receive full Nanite geometry, while distant foliage converts to lightweight voxel proxies. As camera distance increases, fewer and larger voxels are used. This eliminates LOD pop-in, cross-fades, and the need to author LODs manually.
- **Nanite Assemblies**: Modular instancing system where each tree is composed of reusable parts (branches, leaf clusters) instanced throughout the structure. A single tree may contain 20-40 million triangles, but assembly instancing keeps memory and rendering costs low by caching shared instances.
- **Nanite Skinning**: Replaces World Position Offset (WPO) for foliage animation. Uses skeletal mesh-driven animation optimized for trees with hundreds of bones, enabling realistic wind response without the limitations of WPO on Nanite meshes.

**Setup:**

1. Create a new Actor with an Instanced Skinned Mesh Component.
2. Attach the wind transform provider for wind animation.
3. Enable Nanite on foliage meshes via **Static Mesh Editor > Details > Nanite > Enable Nanite Support**.
4. Use Nanite-compatible foliage assets (assemblies with modular parts).

**Performance:**

- Eliminates the need for manual LOD authoring on foliage.
- Renders millions of overlapping elements (tree canopies, pine needles, ground clutter) at stable frame rates.
- Traditional Quixel Nanite trees achieved roughly 28 FPS in dense forests; Nanite Foliage with voxels and assemblies improves on this significantly.

**Limitations (Experimental):**

- Incomplete support for physics and collisions on Nanite foliage.
- Wind animation via Nanite Skinning is still being refined.
- Validate performance on target hardware before committing to production use.
- Does not replace all use cases for traditional instanced static mesh foliage.

> **In your games:**
> - **DnD RPG**: Nanite Foliage is exciting for outdoor areas with dense forests. If you build a forest region around the dungeon, Nanite Voxels handle distant tree LOD automatically without pop-in, which is especially noticeable during the tabletop zoom transition (going from zoomed-out overview to ground-level 3D). Nanite Assemblies keep memory low even with highly detailed trees. However, since this is Experimental in 5.7, test thoroughly and have a fallback plan using traditional HISM foliage if you hit stability issues.
> - **Wizard's Chess**: Not needed. Chess arenas do not have enough foliage density to justify Nanite Foliage. Standard instanced foliage works fine for decorative trees around a board.

### Water System

#### Water Body Types

The Water plugin provides three primary water body types, all found in **Place Actors > Water**:

- **Water Body Ocean** (`AWaterBodyOcean`): Infinite ocean plane that extends to the horizon. Configured with a spline that defines the coastline boundary. Supports wave simulation, foam, and caustics.
- **Water Body Lake** (`AWaterBodyLake`): Enclosed body of water defined by a closed spline. Supports custom depth, color, and wave settings per lake.
- **Water Body River** (`AWaterBodyRiver`): Spline-based flowing water with width and depth controls per spline point. Supports flow speed, direction, and current strength. Width and depth can vary along the spline.

Additional types: `WaterBodyCustom` for arbitrary shapes, `WaterBodyIsland` for exclusion zones within water bodies.

> **In your games:**
> - **DnD RPG**: Use **Water Body River** for underground streams running through dungeon corridors, or a moat around a castle dungeon entrance. Use **Water Body Lake** for a subterranean pool in a boss room (perhaps hiding a water-based enemy). For an outdoor hub, a river running through the village and a small lake near the tavern add life to the environment. Use **Water Body Custom** for irregular sewer water in dungeon drain areas. The water system also creates natural barriers that guide the player through the dungeon layout.
> - **Wizard's Chess**: For a water-themed arena, use **Water Body Lake** as the floor surrounding the board, making it look like the board floats on a magical lake. Use subtle wave settings so the water gently ripples without being distracting.

#### Waves

- **Water Body > Details > Wave**: Wave Source (Gerstner Waves), Wave Amplitude, Wave Length, Wave Speed, Steepness, Number of Waves.
- `AWaterBodyOcean` supports Gerstner wave summation with multiple wave layers.
- Wave parameters can be driven by a `WaterWaves` asset for reusable wave configurations.
- `WaterWavesBase` and `GerstnerWaterWaves` classes control wave computation.
- Waves affect buoyancy simulation automatically.

#### Underwater

- Underwater rendering activates automatically when the camera enters a water body.
- Post-process material handles fog, color absorption, and caustic projection.
- Configure: **Water Body > Details > Underwater > Underwater Post Process Material**.
- Absorption and scattering coefficients control the underwater color and visibility distance.
- Custom underwater post-process materials can be assigned per water body.

#### Buoyancy

- `UBuoyancyComponent` added to actors enables floating behavior.
- **Details > Buoyancy**: Pontoon configuration (location offsets, radius), Water Drag, Water Angular Drag, Buoyancy Coefficient.
- Multiple pontoons can be placed on a single actor for complex buoyancy behavior (boats, debris).
- Works with Chaos Physics system.
- `MaxBuoyantForce`, `BuoyancyDamp`, and `BuoyancyRampMinVelocity` fine-tune the simulation.

> **In your games:**
> - **DnD RPG**: Add a Buoyancy Component to barrel props and wooden crates in flooded dungeon rooms so they bob realistically on the water surface. If the party has a boat for crossing an underground lake, configure multiple pontoons (front-left, front-right, back-center) for stable boat physics. Debris floating in sewer water adds atmosphere. Buoyancy also affects gameplay: a wooden bridge that sinks under too much weight could be a puzzle element.
> - **Wizard's Chess**: If using the water-themed arena, add Buoyancy Components to fallen chess pieces so captured pieces splash into the water and float. This creates a dramatic visual when a piece is taken.

### PCG (Procedural Content Generation)

PCG reached Production-Ready status in UE 5.7, enabling procedural population of environments at massive scale.

#### PCG Graphs

- Create: **Content Browser > Right-click > PCG > PCG Graph**.
- Graphs execute as node-based data flow pipelines, left to right.
- Place a `PCGVolume` or `PCGComponent` actor in the level and assign the PCG Graph asset.
- Execution: manual (**Generate** button in Details panel), on load, or at runtime.
- Graphs can be nested via subgraphs for modularity and reuse.

#### Node Types

PCG nodes fall into several categories:

- **Input Nodes**: `GetActorData`, `GetLandscapeData`, `GetSplineData`, `GetVolumeData`, `SurfaceSampler`, `GetPointData`.
- **Generation Nodes**: `SurfaceSampler` (generates points on surfaces), `VolumeSampler` (fills a volume), `SplineSampler` (generates points along splines), `MeshSampler`.
- **Filter Nodes**: `DensityFilter`, `PointFilter`, `AttributeFilter`, `BoundsFilter`, `DistanceFilter`, `SelfPruning`.
- **Transform Nodes**: `TransformPoints`, `ProjectPoints`, `CopyPoints`, `NormalToDensity`.
- **Attribute Nodes**: `AttributeOperation`, `CreateAttribute`, `SetAttribute`, `CopyAttribute`, `MetadataBreakTransform`.
- **Spawner Nodes**: `StaticMeshSpawner`, `SpawnActor`, `GPUStaticMeshSpawner`.
- **Control Flow**: `Branch`, `Loop`, `Subgraph`, `ExecutionMode`.
- **Debug Nodes**: `DebugPrint`, `Breakpoint`.

#### Point Generation

- `SurfaceSampler` is the most common generation node. Settings: Points Per Square Meter, Point Extents, Looseness.
- `VolumeSampler` fills a 3D volume with points at a configurable density.
- `SplineSampler` generates points along a spline path with configurable spacing and distribution.
- Points carry attributes: position, rotation, scale, density, color, steepness, and custom user attributes.

#### Filtering

- `DensityFilter`: Removes points below or above a density threshold. Lower Bound, Upper Bound, Invert.
- `PointFilter`: Filters based on any point attribute using comparison operators.
- `BoundsFilter`: Keeps or removes points inside/outside a specified volume or bounds.
- `SelfPruning`: Removes overlapping points based on extents, keeping the higher-priority point.
- Custom filter logic can be built by combining attribute operations with branch nodes.

#### Projection

- `ProjectPoints` projects points onto surfaces (landscape, meshes) below or above.
- Settings: Project Direction (typically -Z), Max Distance, Projection Target (landscape, world geometry, specific actors).
- Surface normal data is captured during projection for alignment.

#### Spawning

- `StaticMeshSpawner`: Spawns static mesh instances at point locations. Supports mesh entries with weight-based random selection.
- `GPUStaticMeshSpawner` (new in 5.7): Spawns directly in the GPU scene, leveraging FastGeometry components for better performance. Enable via PCG FastGeo Interop plugin.
- `SpawnActor`: Spawns full actor instances (heavier, for interactive objects).
- Each spawner respects point transform (position, rotation, scale) and can apply additional randomization.

#### Density

- Density is a float attribute (0.0 to 1.0) on each point.
- Points with density 0 are automatically removed.
- `NormalToDensity` converts surface normal data to density (useful for slope-based filtering).
- `DensityFilter` removes points outside a density range.
- Density can be set via textures, noise functions, attribute operations, or landscape layer weights.

#### Subgraphs

- Subgraphs encapsulate reusable graph logic into a single node.
- Create by selecting nodes and choosing **Collapse to Subgraph**, or by creating a PCG Graph asset and referencing it as a subgraph node.
- Subgraphs define Input and Output pins for data flow.
- Loop subgraphs iterate over collections, executing the inner graph per element.
- Subgraphs support parameterization via exposed attributes and overrides.

#### PCG Settings and 5.7 Improvements

- **PCG Editor Mode** (new in 5.7): Dedicated editor mode for PCG authoring, accessible via the Modes toolbar.
- **Procedural Vegetation Editor (PVE)** (new in 5.7): Specialized tool for procedural foliage placement within the PCG framework.
- **GPU PCG Performance**: Now leverages FastGeometry components, eliminating partition actors. Enable via the **PCG FastGeo Interop** plugin and set `pcg.RuntimeGeneration.ISM.ComponentlessPrimitives=1`.
- PCG Runtime Generation Modes: EditTime, OnLoad, Runtime (configurable per PCG Component).
- Debug visualization: **Show > PCG** in viewport, or per-graph debug nodes.

> **In your games:**
> - **DnD RPG**: PCG is a powerful tool for procedural dungeon generation. Create a PCG Graph that takes a spline path (the dungeon corridor layout) as input, samples points along it, and spawns wall segments, floor tiles, torches, and scattered props. Use `DensityFilter` to thin out decorations in narrow corridors and increase density in large rooms. Use `SelfPruning` to prevent overlapping props. Use `PointFilter` based on surface normal to place wall-mounted objects only on vertical surfaces. Build subgraphs for reusable patterns: a "TreasureRoom" subgraph that populates a room with chests, gold piles, and traps; a "CombatArena" subgraph that places cover objects and enemy spawn points. This lets the AI DM generate unique dungeon layouts each playthrough. Use `StaticMeshSpawner` with weighted random mesh entries so the spawner picks from a variety of torch, pillar, and debris meshes.
> - **Wizard's Chess**: Use PCG to procedurally decorate arena environments. A PCG Graph on the "Enchanted Forest" arena could scatter fallen leaves, mushrooms, and rocks around the board using `SurfaceSampler` on the ground plane. Use `BoundsFilter` to exclude the board area so no props spawn on the playing surface. Use `DensityFilter` to create denser vegetation near the edges and sparser near the board. This means you can create varied arena decorations without hand-placing every prop.
