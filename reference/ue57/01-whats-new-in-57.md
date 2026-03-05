## What's New in 5.7

Unreal Engine 5.7 is a major release focused on production-ready world building, physically accurate materials, dense foliage rendering, and streamlined creative workflows. Below is every notable new or updated feature.

### Rendering and Materials

#### Substrate (Production-Ready) [UPDATED]
Substrate is Unreal Engine's modular material authoring and rendering framework, graduating from Beta to **Production-Ready** in 5.7. It replaces the legacy shading model with a system that supports true physically accurate layered and blended materials. Creators can combine multiple material behaviors (metal, clear coat, skin, cloth, subsurface scattering) in a single material. Effects such as realistic multi-layered car paint, oiled leather, blood and sweat on skin, and frost over glass are now straightforward to build. Substrate works across platforms from high-end PC down to mobile.

- Path: `Edit > Project Settings > Engine > Rendering > Substrate`
- Enable via: `r.Substrate` console variable
- Legacy materials continue to function but are considered deprecated going forward

#### MegaLights (Beta) [UPDATED]
MegaLights has moved from Experimental to **Beta**. It enables scenes with a far greater number of dynamic, shadow-casting lights, supporting realistic soft shadows from complex light sources such as area lights.

Key improvements in 5.7:
- Directional light support added
- Shadow-casting Niagara particles supported
- More accurate shading and shadowing on hair
- Improved noise reduction and out-of-the-box performance
- Checkerboard downsampling option (`r.MegaLights.DownsampleCheckerboard`) for half-resolution sampling
- Always vectorized shading samples, saving 0.1 to 0.2ms on current-gen consoles
- Duplicate ray merging to eliminate redundant traces
- Improved temporal accumulation using downsampled neighborhoods

Path: `Edit > Project Settings > Engine > Rendering > MegaLights`

#### Nanite Foliage (Experimental) [NEW]
Nanite Foliage is a new geometry rendering system designed for dense, foliage-heavy open-world environments. It maintains efficient performance on current-generation hardware.

Core technologies:
- **Nanite Voxels**: Automatically draw millions of tiny, overlapping elements (tree canopies, pine needles, ground clutter) as a solid mass at distance, at stable frame rates, with no cross-fades, pops, or manually authored LODs
- **Nanite Assemblies**: Reduce storage, memory, and rendering cost by sharing geometry across instances
- **Nanite Skinning**: Determines dynamic behaviors such as wind response without relying on World Position Offset (WPO)

Performance improvements:
- New culling optimization via `r.Nanite.Culling.MinLOD` improves speed and reduces memory for candidate clusters
- HZB priming system (`r.Nanite.PrimeHZB`) prevents performance spikes after camera cuts
- `NanitePixelProgrammableDistance` exposed to disable pixel rasterization beyond a specified distance

#### Nanite First Person Rendering (Production-Ready) [UPDATED]
Nanite support in First Person Rendering is now production-ready, enabling high-detail first-person weapon and hand models rendered through Nanite.

#### Lumen Improvements [UPDATED]
- Deprecated SWRT (Software Raytracing) detail tracing; development now unified on the 60Hz hardware raytracing (HWRT) path
- Half-resolution integration enabled on High scalability, saving approximately 0.5ms on consoles at 1080p
- More aggressive firefly filtering via `r.Lumen.ScreenProbeGather.MaxRayIntensity 10`
- GBuffer tile classification consolidated into a single pass

#### TSR (Temporal Super Resolution) [UPDATED]
- Thin geometry detection now available across all shading models, improving foliage rendering quality
- New experimental custom output nodes: "Motion Vector World Offset (Per-Pixel)" and "Temporal Responsiveness"

#### SMAA Anti-Aliasing (Experimental) [NEW]
Experimental Subpixel Morphological Anti-Aliasing (SMAA) option added as an alternative to TSR and FXAA.

#### Shader and Material Optimizations [UPDATED]
- Asset registry tagging helps identify material instances causing excessive shader permutations
- Disabling 128-bit base pass compilation saves approximately 50,000 shaders and 15 MiB: `r.128BitBPPSCompilation.Allow` (default: true)
- New debug artifact `ShaderTypeStats.csv` tracks permutation counts per shader type

### Procedural Content Generation

#### PCG Framework (Production-Ready) [UPDATED]
The Procedural Content Generation framework has graduated to **Production-Ready**. It enables users to quickly populate environments, introduce natural variety, and deliver game experiences at scale.

New in 5.7:
- **PCG Editor Mode**: Adds spline drawing, point painting, and volume tools that connect directly to PCG Graphs. Creators can adjust parameters in real time without coding
- **GPU Compute Improvements**: Performance optimizations and support for GPU parameter overrides
- **Polygon2D Data Type**: New data type and related operators for defining areas and splines
- **PCG FastGeometry**: GPU generation leverages FastGeometry components. Enable via `PCG FastGeo Interop` plugin and set `pcg.RuntimeGeneration.ISM.ComponentlessPrimitives=1`
- FastGeo PSO precaching moved from PostLoad (game thread) to asynchronous execution

#### Procedural Vegetation Editor (Experimental) [NEW]
A new graph-based tool for building vegetation assets inside Unreal Engine. Artists can create and customize high-quality vegetation using PCG node graphs, with the option to directly output Nanite skeletal assemblies.

Features:
- Modify tree shape using gravity, scale, and carve operators
- Export as static or skeletal meshes
- Supports procedural wind animation through the Nanite Foliage system
- First-wave Quixel "Megaplants" recipes available through Fab
- Designed for speed, scalability, and creative control

### Animation and Rigging

#### Refactored Animation Mode [UPDATED]
A streamlined Animation Mode that optimizes the use of screen real estate with improved layout and navigation.

#### Selection Sets [NEW]
Create Selection Sets to select multiple controls within a rig with a single click. This accelerates keyframing workflows for complex character rigs.

#### IK Retargeter Improvements [UPDATED]
- Better foot-to-ground contact
- Support for retargeting squash and stretch animations
- Crotch Height definition for better proportion mapping
- Floor Constraint options for extreme retargeting scenarios (e.g., transferring motion from a giant to a dwarf)

#### Spatially Aware Retargeting (Experimental) [NEW]
Reduces self-collision when transferring motion between differently proportioned characters, producing more physically plausible results.

#### Motion Matching with Choosers [UPDATED]
Motion Matching is now integrated into the Chooser framework. Users can specify conditions under which animation assets are selected based on game logic. A new Experimental Pose Search Column in Choosers brings Choosers and Motion Matching closer together.

Path: `Window > Animation > Chooser Editor`

#### Skeletal Editor Enhancements [UPDATED]
Create and edit morph shapes (blendshapes), bones, and skin weights directly within the Skeletal Editor. Transition seamlessly between sculpting blendshapes, placing bones, and painting weights on skeletal meshes.

#### Morph Target Viewer (Experimental) [NEW]
New interface displays all morph targets with weight sliders for real-time adjustment and preview.

#### Unified Constraint Window [NEW]
A single window for managing all animation constraints, replacing the previous scattered interface.

#### Dependency View [NEW]
Visualize complex Control Rig setups to understand node dependencies and data flow.

#### One-Way Physics Collisions [NEW]
Support for one-way physics collisions for more natural ragdoll behavior. Characters can interact with environmental geometry without the geometry being affected in return.

### AI and Developer Tools

#### AI Assistant (Experimental) [NEW]
A new in-editor AI assistant, accessible via a dedicated slide-out panel.

Features:
- Ask natural-language questions about Unreal Engine
- Generate C++ code snippets
- Follow step-by-step technical guidance
- Context-aware tooltip help: hover over any interface element and press `F1` to start a conversation about that specific topic
- Uses the same AI model as Epic's Developer Community documentation

Path: Open via the AI Assistant button in the main toolbar, or press `F1` while hovering over any UI element.

#### Home Panel (Refreshed) [UPDATED]
A centralized hub for tutorials, documentation, community resources, and a guided "Getting Started" sample project.

### Virtual Production

#### Composure (Reintroduced) [UPDATED]
A new and improved version of Composure, Unreal Engine's built-in real-time compositing tool.

Improvements:
- Handles both live video input and file-based image media plates
- Delivers real-time results for film or video shoots at 24 fps
- New shadow and reflection integration for seamless live-action and CG compositing
- Enhanced keyer for better chroma key results

#### Live Link Broadcast Component [NEW]
Enables Unreal Engine itself to act as a source of animation data across your network. Add Actors to your level and turn them into Live Link subjects, streaming Transform, Camera, and Animation roles directly from the Editor. Supports multi-machine virtual production and motion capture stage workflows, such as offloading retargeting to another Editor session and broadcasting results to your main scene.

#### Dynamic Constraint Component for Props [NEW]
Motion capture props automatically attach to hand positions with smooth interpolation for natural-looking results during live capture sessions.

#### Live Link Enhancements [UPDATED]
- Stream pausing support
- Viewport animation preview
- Live Link Face now supports broader camera compatibility, including external USB-C cameras on iPads and Android devices

### MetaHuman

#### MetaHuman Creator Plugin [UPDATED]
- Now supports Linux and macOS alongside Windows
- Batch and automated processing of MetaHuman assets through Python or Blueprint APIs
- Improved mesh conforming workflows for better round-tripping with DCC tools

#### Rig Mapper Tool (Experimental) [NEW]
Transfers animation between MetaHumans and ARKit facial capture systems.

### Physics and Simulation

#### Chaos Physics [UPDATED]
- More parallel simulation stages for improved multi-core performance
- Experimental Partial Sleeping feature for large unstructured piles of objects
- Improved sphere and capsule narrow-phase queries
- New `p.Chaos.MinParallelTaskSize` cvar for low-core platform optimization
- Physics CVARs now configurable in Shipping builds

#### Chaos Cloth [UPDATED]
Optimized game thread and interactor tick performance for cloth simulation.

#### Chaos Hair [UPDATED]
Improvements to hair simulation stability and performance.

#### Chaos Fluids [UPDATED]
Updates to fluid simulation quality and behavior.

#### Chaos Visual Debugger [UPDATED]
- 30% faster loading for files larger than 2GB
- 75% reduction in first-frame processing time for large recordings

### World Building

#### Custom HLODs [NEW]
Inject custom HLOD (Hierarchical Level of Detail) representations for individual actors or groups. A new World Partition Custom HLOD actor class supports injection as-is into runtime partitions or as generation input only.

#### Landscape Optimization [UPDATED]
- Editor optimization skips material inspection when no weightmap allocations exist
- Optimized undo performance for landscape editing

### Networking (Iris) [UPDATED]
- Removed UReplicationBridge base class, reducing virtual call overhead
- Seamless travel support toggleable via `net.Iris.AlwaysCreateLevelFilteringGroupsForPersistentLevels`
- Polling optimized to only process dirty objects and properties
- Multithreaded polling via `bAllowParallelTasks=true`
- Buffer bloat network emulation profiles added for testing

### VFX and Niagara

#### Movie Render Graph [UPDATED]
- Enhanced file naming for rendered sequences
- EXR metadata support per render layer

#### Niagara [UPDATED]
- Shadow-casting particle support with MegaLights
- Removed UNiagaraEmitter from stateless emitters during cooking, saving approximately 4KB per emitter
- `RequiresCurrentFrameData` disable optimization for better scheduling of emitter ticks

### Audio [UPDATED]
- MetaSounds Operator Cache memory improvements
- New Seek Restart virtualization mode balancing performance and accuracy
- Vorbis decode-only option for memory-constrained targets

### Motion Design (Production-Ready) [UPDATED]
The Motion Design toolset has graduated to Production-Ready status for broadcast graphics and motion graphics workflows.

### UI and Slate [UPDATED]
- Fixed alpha comparison preventing invisible elements from rendering
- CommonUI improved widget caching consistency with runtime-added child options
- Complex text shaping optimized (Arabic language support improvements)
- New `Slate.UseSharedBreakIterator` CVar reduces CPU via ICU Break Iterator sharing
- Content Browser column sorting performance significantly improved for large search results

### Platform and Input [UPDATED]

#### Windows Mouse Handling
- Removed redundant API calls, saving up to 0.5ms per frame
- Raw mouse input processing moved to a separate FRunnable thread
- High-precision mouse support optimized; configurable via `WindowsApplication.UseWorkerThreadForRawInput`
- Game, Render, and RHI threads elevated from Normal to AboveNormal priority

#### Android
- `-FastIterate` flag enables libUnreal.so outside APK
- Early dependency loading accelerates startup

### Build and Compression [UPDATED]
- Oodle upgraded to 2.9.14 with Intel 13th/14th gen CPU crash workarounds
- ThinLTO enabled by default for Clang toolchains
- AVX10 instruction support added
- UnrealPak summary outputs now scale memory units for readability

### AI and Navigation [UPDATED]
- AsyncNavWalkingMode now uses navmesh normals; always retrieves highest ground z-location
- NavMesh tile building optimized for CompositeNavModifiers with large datasets
- `SlideAlongNavMesh` option enables movement along navigation meshes

### Virtual Textures [UPDATED]
- Spaces released after 150 frames of disuse via `r.VT.SpaceReleaseFrames`

### Garbage Collection [UPDATED]
- Improved timing accuracy with 10-object granularity (previously 100)
- Extended `gc.PerformGCWhileAsyncLoading` to activate only during low-memory conditions
- `-VerifyGC` now accounts for all verification CVARs

---
