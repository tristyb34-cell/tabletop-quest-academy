## Console Commands (Comprehensive)

### Rendering

| Command | Description |
|---------|-------------|
| `r.SetRes WxH` | Set viewport resolution |
| `r.ScreenPercentage` | Internal render resolution percentage |
| `r.VSync` | Enable/disable vertical sync |
| `r.AllowOcclusionQueries` | Toggle occlusion culling |
| `r.DefaultFeature.Bloom` | Toggle bloom (0/1) |
| `r.DefaultFeature.AmbientOcclusion` | Toggle AO (0/1) |
| `r.DefaultFeature.MotionBlur` | Toggle motion blur (0/1) |
| `r.DefaultFeature.LensFlare` | Toggle lens flares (0/1) |
| `r.DefaultFeature.AntiAliasing` | Default AA method (0=None, 2=TAA, 4=TSR) |
| `r.DepthOfFieldQuality` | DOF quality (0=off, 1-4) |
| `r.TonemapperGamma` | Override gamma value |
| `r.Tonemapper.Quality` | Tonemapper quality level |
| `r.Eye Adaptation.Quality` | Auto exposure quality |
| `r.Shadow.MaxResolution` | Maximum shadow map resolution |
| `r.Shadow.MaxCSMResolution` | Max cascaded shadow map resolution |
| `r.Shadow.CSM.MaxCascades` | Number of CSM cascades |
| `r.Shadow.DistanceScale` | Shadow distance multiplier |
| `r.ShadowQuality` | Shadow quality (0-5) |
| `r.LightMaxDrawDistanceScale` | Global light draw distance scale |
| `r.VolumetricFog` | Toggle volumetric fog (0/1) |
| `r.VolumetricFog.GridSizeZ` | Volumetric fog Z resolution |
| `r.Fog` | Toggle fog (0/1) |
| `r.SSR.Quality` | Screen space reflections quality |
| `r.RayTracing` | Master ray tracing toggle |
| `r.RayTracing.Reflections` | Toggle RT reflections |
| `r.RayTracing.GlobalIllumination` | Toggle RT GI |
| `r.RayTracing.Shadows` | Toggle RT shadows |
| `r.Lumen.DiffuseIndirect.Allow` | Enable Lumen diffuse GI |
| `r.Lumen.Reflections.Allow` | Enable Lumen reflections |
| `r.Lumen.TraceMeshSDFs` | Toggle mesh SDF tracing |
| `r.Lumen.HardwareRayTracing` | Enable Lumen hardware RT |
| `r.Lumen.ScreenProbeGather.DownsampleFactor` | Lumen probe downsample |
| `r.MegaLights` | Enable/disable MegaLights |
| `r.MegaLights.DownsampleCheckerboard` | Half-res MegaLights sampling |
| `r.MegaLights.DefaultShadowMethod` | Default shadow method for MegaLights |
| `r.MegaLights.HardwareRayTracing.ForceTwoSided` | Force two-sided for MegaLights RT |
| `r.TSR.Quality` | TSR quality level |
| `r.TSR.ShadingRejection.ExposureOffset` | TSR ghosting reduction |
| `r.VT.SpaceReleaseFrames` | Virtual texture space recycle interval (default 150) |
| `r.VirtualTextures` | Enable virtual textures |

> **In your games:**
> - **DnD RPG**: Key rendering commands for dungeon development:
>   - `r.VolumetricFog 1` and `r.Fog 1`: Essential. Toggle these to test dungeon atmosphere. Volumetric fog with torchlight shafts is a signature dungeon look.
>   - `r.Shadow.MaxResolution 2048` or `4096`: Increase for crisp torch shadows on dungeon walls during development. Drop back to 1024-2048 for shipping.
>   - `r.Lumen.DiffuseIndirect.Allow 0/1`: Quick toggle to see how much Lumen GI contributes to your dungeon lighting. Useful for diagnosing "why does this room look flat?"
>   - `r.Lumen.HardwareRayTracing 1`: Test hardware RT to compare quality vs software tracing in your dungeons.
>   - `r.ScreenPercentage 75`: Quick performance boost during development. Set back to 100 for final quality checks.
>   - `r.DefaultFeature.MotionBlur 0`: Disable during level design so you can move the camera freely without blur interfering.
> - **Wizard's Chess**: Key rendering commands:
>   - `r.SSR.Quality 80`: Crank up SSR for sharp board reflections during testing.
>   - `r.Lumen.Reflections.Allow 1`: Ensure Lumen reflections are active for the board.
>   - `r.DepthOfFieldQuality 4`: Max DOF quality for cinematic piece close-ups.
>   - `r.DefaultFeature.Bloom 1`: Keep bloom on for piece glow effects.
>   - `r.Shadow.MaxResolution 4096`: High-res shadows for clean piece silhouettes on the board.

#### Nanite Console Commands

| Command | Description |
|---------|-------------|
| `r.Nanite` | Enable/disable Nanite |
| `r.Nanite.MaxPixelsPerEdge` | LOD detail threshold |
| `r.Nanite.Visualize.Mode` | Visualization (Triangles, Clusters, Overdraw, etc.) |
| `r.Nanite.Visualize.Overview` | Stats overlay |
| `r.Nanite.ShowStats` | Nanite rendering stats |
| `r.Nanite.Culling.MinLOD` | Min LOD for culling |
| `r.Nanite.PrimeHZB` | (Experimental) Prime HZB for camera cuts |
| `r.Nanite.Streaming.PoolSize` | Streaming VRAM pool (MB) |
| `r.Nanite.AllowMaskedMaterials` | Masked material support |
| `r.Nanite.ShadowRasterization` | Nanite shadow rasterization |

> **In your games:**
> - **DnD RPG**: Use Nanite for dense, high-poly dungeon architecture (stone walls with carved detail, statues, rubble piles). Key commands:
>   - `r.Nanite.Visualize.Mode Triangles`: See how many triangles Nanite is rendering in your dungeon. Great for finding overdraw issues in complex rooms.
>   - `r.Nanite.MaxPixelsPerEdge 1`: Default. Increase to 2 if you need more performance and can accept slightly lower LOD quality on distant geometry.
>   - `r.Nanite.ShowStats 1`: Monitor Nanite performance in real-time as you fly through dungeon levels.
>   - `r.Nanite.AllowMaskedMaterials 1`: Enable if you use alpha-masked materials (iron grates, chain fences, foliage in underground gardens).
> - **Wizard's Chess**: Nanite is useful for highly detailed chess pieces (especially ornate sets with fine sculpted detail). Key commands:
>   - `r.Nanite.MaxPixelsPerEdge 1`: Keep at default or lower (0.5) for maximum piece detail since you have few meshes on screen.
>   - `r.Nanite.ShowStats 1`: Confirm that Nanite is handling your piece geometry efficiently.
>   - `r.Nanite.ShadowRasterization 1`: Enable for precise piece shadow silhouettes on the board.

#### Scalability Commands

| Command | Description |
|---------|-------------|
| `sg.ViewDistanceQuality` | View distance scalability (0-4) |
| `sg.AntiAliasingQuality` | AA scalability (0-4) |
| `sg.PostProcessQuality` | Post process scalability (0-4) |
| `sg.ShadowQuality` | Shadow scalability (0-4) |
| `sg.GlobalIlluminationQuality` | GI scalability (0-4) |
| `sg.ReflectionQuality` | Reflection scalability (0-4) |
| `sg.TextureQuality` | Texture scalability (0-3) |
| `sg.EffectsQuality` | Effects scalability (0-4) |
| `sg.FoliageQuality` | Foliage scalability (0-4) |
| `sg.ShadingQuality` | Shading scalability (0-4) |
| `sg.ResolutionQuality` | Resolution scalability (percentage) |

> **In your games:**
> - **DnD RPG**: Use these to quickly test how your dungeon looks at different quality levels:
>   - `sg.GlobalIlluminationQuality 0` through `4`: See how Lumen quality scaling affects your dungeon mood. If the dungeon still looks acceptable at level 2, that is your minimum spec.
>   - `sg.ShadowQuality 0` through `4`: Test torch shadow quality at each level. Dungeons rely heavily on shadows for atmosphere.
>   - `sg.EffectsQuality 0` through `4`: Check how spell particle effects degrade. Make sure they are still readable at low settings.
> - **Wizard's Chess**: Quick quality sweeps:
>   - `sg.ReflectionQuality 0` through `4`: See how board reflections degrade. Find the minimum acceptable level.
>   - `sg.ShadowQuality 0` through `4`: Test piece shadow quality at each level.
>   - `sg.TextureQuality 0` through `3`: Check piece texture detail at each level. Ornate pieces need at least level 2.

### Physics

| Command | Description |
|---------|-------------|
| `p.VisualizeWorldQueries` | Visualize physics queries |
| `p.Chaos.MinParallelTaskSize` | Min task size for parallel physics |
| `p.Chaos.Solver.Iterations` | Solver iteration count |
| `p.Chaos.Solver.PushOut.Iterations` | Push-out solver iterations |
| `p.Chaos.ImmPhysics.DebugDrawJoints` | Debug draw joint constraints |
| `p.ClothPhysics` | Enable/disable cloth simulation |
| `p.RagdollAggregateThreshold` | Ragdoll aggregation threshold |
| `p.EnableGravity` | Global gravity toggle |
| `p.GravityZ` | Gravity Z value (default -980) |
| `p.MaxPhysicsDeltaTime` | Max physics step delta time |
| `p.PhysicsSubStepping` | Enable sub-stepping |

> **In your games:**
> - **DnD RPG**: Key physics commands for dungeon gameplay:
>   - `p.VisualizeWorldQueries 1`: Debug line traces for sword swings, spell projectile collision, and interactable detection. Essential for debugging combat.
>   - `p.ClothPhysics 1`: Enable for capes, banners, and curtains in dungeon rooms. Toggle off to test performance impact.
>   - `p.RagdollAggregateThreshold`: Adjust if many enemies die at once and ragdoll performance drops (large battle rooms).
>   - `p.Chaos.Solver.Iterations`: Increase if physics objects (rolling boulders, collapsing pillars) behave jittery or pass through walls.
> - **Wizard's Chess**: Physics is less critical for a chess game, but:
>   - `p.VisualizeWorldQueries 1`: Debug piece selection ray casts (mouse click to board position).
>   - Physics could drive dramatic piece capture animations (a captured piece getting knocked off the board with realistic tumble). Increase `p.Chaos.Solver.Iterations` if pieces clip through the board during these animations.

### AI

| Command | Description |
|---------|-------------|
| `ai.debug.nav` | Toggle navigation mesh debug |
| `ai.debug.pathfollowing` | Debug path following |
| `ai.debug.BT` | Debug behavior tree |
| `ai.debug.EQS` | Debug Environment Query System |
| `showdebug AI` | Show AI debug info on HUD |
| `showdebug BehaviorTree` | Show BT execution on HUD |
| `showdebug EQS` | Show EQS debug on HUD |
| `ai.crowd.DebugDraw` | Toggle crowd simulation debug |
| `ai.sight.debug` | AI perception sight debug |

> **In your games:**
> - **DnD RPG**: AI is central to your game. Enemy behavior, pathfinding through dungeons, and the local AI DM all need debugging:
>   - `ai.debug.nav 1`: Visualize the nav mesh in your dungeons. Check for gaps in doorways, stairs, narrow corridors where enemies cannot pathfind. This is the first thing to check when enemies get stuck.
>   - `ai.debug.BT 1` and `showdebug BehaviorTree`: Watch enemy behavior trees execute in real-time. See which branch the skeleton is evaluating, why the goblin is fleeing instead of attacking, and where the dragon AI gets stuck.
>   - `ai.debug.EQS 1` and `showdebug EQS`: If enemies use EQS to find cover positions, flanking routes, or patrol points, visualize the query results to tune scoring.
>   - `ai.sight.debug 1`: Debug enemy perception. See their sight cones and check if they detect the player through walls (broken line-of-sight checks).
> - **Wizard's Chess**: AI commands are relevant if you build a chess engine opponent:
>   - `showdebug AI`: Display the AI's evaluation state on the HUD during development (current best move, search depth, evaluation score).
>   - Behavior Trees could drive the AI's "personality" (aggressive, defensive, positional), and `showdebug BehaviorTree` helps debug which strategy branch the AI is following.

### Stats

| Command | Description |
|---------|-------------|
| `stat fps` | Show frames per second |
| `stat unit` | Frame time breakdown (Game, Draw, GPU, RHIT) |
| `stat unitgraph` | Graphical frame time display |
| `stat game` | Game thread timing |
| `stat gpu` | GPU timing breakdown |
| `stat memory` | Memory usage overview |
| `stat scenerendering` | Scene rendering passes breakdown |
| `stat initviews` | Visibility and occlusion stats |
| `stat particles` | Particle system stats |
| `stat anim` | Animation stats |
| `stat physics` | Physics simulation stats |
| `stat ai` | AI system stats |
| `stat audio` | Audio system stats |
| `stat streaming` | Texture/mesh streaming stats |
| `stat streamingdetails` | Detailed streaming info |
| `stat startfile` | Begin stat capture to .ue4stats file |
| `stat stopfile` | End stat capture |
| `stat slow [-ms=X] [-maxdepth=Y]` | Show slow tick functions |
| `stat namedevents` | Show named events in profiler |
| `stat levels` | Level streaming stats |
| `stat net` | Networking stats |
| `stat slate` | UI/Slate stats |
| `stat threading` | Thread utilization |
| `stat rhi` | RHI (Rendering Hardware Interface) stats |

> **In your games:**
> - **DnD RPG**: Your go-to stats during dungeon development:
>   - `stat fps` + `stat unit`: Always running during playtesting. If frame time spikes, check whether Game (CPU logic), Draw (CPU rendering), or GPU is the bottleneck.
>   - `stat gpu`: Drill into GPU costs. Is it shadows? Lumen GI? Base pass (materials)? This tells you where to optimize.
>   - `stat scenerendering`: Break down the full render pipeline per dungeon room. Compare costs between rooms to find problem areas.
>   - `stat particles`: Watch spell effect particle costs. Fireballs with hundreds of emitters can spike the GPU.
>   - `stat ai`: Monitor AI tick cost when many enemies are active. If AI is eating the game thread, reduce tick frequency or simplify behavior trees.
>   - `stat physics`: Check physics cost during combat with many ragdolling enemies or destructible objects.
>   - `stat initviews`: Confirm that occlusion culling is working in your dungeons. Rooms behind walls should be culled.
> - **Wizard's Chess**: Key stats:
>   - `stat fps` + `stat gpu`: Monitor while pieces animate and effects play.
>   - `stat scenerendering`: The scene is simple, so use this to ensure you are not accidentally wasting GPU on invisible objects.
>   - `stat memory`: Track VRAM usage if you use high-resolution textures on pieces and the board.
>   - `stat net`: When testing online multiplayer, monitor bandwidth and replication stats. Chess should be extremely lightweight.

### Profiling

| Command | Description |
|---------|-------------|
| `stat startfile` | Start Unreal Insights capture to file |
| `stat stopfile` | Stop Insights capture |
| `trace.start` | Start trace (Unreal Insights channels) |
| `trace.stop` | Stop trace |
| `trace.enable [channels]` | Enable specific trace channels |
| `ProfileGPU` | Open GPU profiler (also Ctrl+Shift+,) |
| `stat none` | Disable all stat displays |
| `dumpticks` | Dump all tick functions and timings |
| `memreport -full` | Full memory report |
| `obj gc` | Force garbage collection |
| `obj list` | List all UObjects |

> **In your games:**
> - **DnD RPG**: Profiling workflow for dungeon optimization:
>   - `stat startfile` before entering a complex dungeon room, `stat stopfile` after. Open the capture in Unreal Insights to analyze frame-by-frame GPU and CPU costs.
>   - `ProfileGPU`: Immediate GPU breakdown. Use this to identify whether Lumen, shadows, base pass, or post-processing is the biggest cost in each room.
>   - `dumpticks`: Find expensive tick functions. If you have 50 torches ticking every frame for flicker effects, this shows the cost. Consider switching to timeline-based flicker in materials instead.
>   - `memreport -full`: Check memory after loading a full dungeon level. Watch for texture memory bloat from high-res dungeon textures.
> - **Wizard's Chess**: Profiling workflow:
>   - `ProfileGPU`: Identify rendering costs. For a small scene, the GPU profile should be clean. If something is unexpectedly expensive, this command finds it quickly.
>   - `memreport -full`: Check piece mesh and texture memory. If you use Nanite pieces with millions of triangles each, verify the memory footprint is reasonable for 32 pieces.

### Debugging

| Command | Description |
|---------|-------------|
| `showdebug` | Toggle debug info on HUD |
| `showdebug COLLISION` | Show collision debug |
| `showdebug CAMERA` | Show camera debug |
| `showdebug ANIMATION` | Show animation debug |
| `showdebug PHYSICS` | Show physics debug |
| `showdebug NET` | Show network debug |
| `log [Category] [Verbosity]` | Set log category verbosity |
| `log list` | List all log categories |
| `obj list` | List all UObject instances |
| `obj list class=ClassName` | List instances of a class |
| `displayall ClassName PropertyName` | Display property for all instances |
| `ce EventName` | Fire a console event |
| `ke * EventName` | Fire a Kismet (Blueprint) event on all actors |
| `DisableAllScreenMessages` | Hide all screen debug messages |
| `EnableAllScreenMessages` | Show all screen debug messages |
| `ToggleDebugCamera` | Switch to free-fly debug camera |
| `show [FlagName]` | Toggle rendering show flags |
| `show Collision` | Toggle collision visualization |
| `show Bounds` | Toggle bounding box visualization |
| `show Navigation` | Toggle nav mesh visualization |

> **In your games:**
> - **DnD RPG**: Essential debugging commands for dungeon development:
>   - `show Collision`: Verify collision volumes on walls, doors, and interactive objects. Check that the player cannot walk through walls or clip into geometry.
>   - `show Navigation`: Visualize nav mesh coverage in every dungeon room. Look for disconnected islands (stairs, ramps, doorway thresholds often break navigation).
>   - `showdebug ANIMATION`: Debug character and enemy animation states. See blend weights, active montages, and state machine transitions. Critical for getting combat animations right.
>   - `showdebug CAMERA`: Debug the zoom transition camera. See what the camera system is doing as it moves from tabletop overview to dungeon view.
>   - `ToggleDebugCamera`: Fly through your dungeon freely to inspect lighting, check for visual artifacts, and review rooms from angles players cannot normally reach.
>   - `displayall AEnemyCharacter Health`: During combat testing, see all enemy health values on screen at once.
>   - `log LogAI Verbose`: Increase AI logging for detailed behavior tree debugging when enemies misbehave.
> - **Wizard's Chess**: Key debugging commands:
>   - `show Collision`: Verify piece selection collision. Each board square should have clean collision for mouse picking. Check that piece collision does not overlap adjacent squares.
>   - `showdebug CAMERA`: Debug the cinematic camera system that orbits the board and focuses on pieces.
>   - `showdebug NET`: When testing online play, see replication state, relevant actors, and connection status on the HUD.
>   - `ToggleDebugCamera`: Fly around the board to inspect piece materials, lighting, and reflections from all angles.
>   - `displayall AChessPiece PieceType`: Display all piece types to verify board setup is correct.

### Gameplay

| Command | Description |
|---------|-------------|
| `slomo X` | Set time dilation (1.0 = normal, 0.5 = half speed) |
| `pause` | Toggle game pause |
| `god` | Toggle god mode (invincibility) |
| `ghost` | Toggle noclip/fly through walls |
| `fly` | Toggle fly mode |
| `walk` | Return to walking mode |
| `teleport` | Teleport to crosshair location |
| `setres WxH` | Change resolution |
| `fov X` | Set field of view |
| `viewmode [mode]` | Change rendering view mode (lit, unlit, wireframe, etc.) |
| `open MapName` | Load a map |
| `travel MapName` | Server travel to map |
| `disconnect` | Disconnect from server |
| `reconnect` | Reconnect to last server |
| `exit` / `quit` | Close the application |

> **In your games:**
> - **DnD RPG**: Development and testing essentials:
>   - `slomo 0.2`: Slow motion for debugging combat animations and spell effects frame by frame. See exactly when sword swings connect, when particles spawn, and when damage applies.
>   - `slomo 3.0`: Speed up to quickly run through dungeon corridors during layout testing.
>   - `god`: Test dungeon encounters without dying. Focus on enemy behavior and level design without worrying about health.
>   - `ghost`: Fly through dungeon walls to inspect rooms, check lighting from impossible angles, and verify occluded areas look correct.
>   - `fov 90` to `fov 110`: Test different FOV values for the dungeon camera. Wider FOV shows more of the environment but can distort; narrower feels more claustrophobic (good for tight corridors).
>   - `viewmode wireframe`: Check mesh density, overlapping geometry, and polygon count in dungeon rooms.
>   - `viewmode unlit`: See albedo-only to check texture work without lighting influence.
>   - `open DungeonFloor3`: Quick-load specific dungeon levels during testing without going through menus.
> - **Wizard's Chess**: Development commands:
>   - `slomo 0.3`: Slow down capture animations to fine-tune timing and effects.
>   - `fov 40` to `fov 60`: Test tight FOV for cinematic close-ups on pieces. Lower FOV compresses perspective and makes pieces look more dramatic.
>   - `viewmode unlit`: Check piece textures and UV mapping without lighting.
>   - `viewmode wireframe`: Verify piece mesh density. Ensure Nanite pieces have appropriate polygon distribution.

### Network

| Command | Description |
|---------|-------------|
| `net.AllowPeerConnections` | Allow peer connections |
| `net.MaxRepArraySize` | Max replicated array size |
| `net.MaxRepArrayMemory` | Max replicated array memory |
| `net.UseAdaptiveNetUpdateFrequency` | Adaptive net update frequency |
| `net.DormancyEnable` | Enable/disable actor dormancy |
| `net.PktLoss` | Simulate packet loss (percentage) |
| `net.PktOrder` | Simulate packet reordering |
| `net.PktDup` | Simulate packet duplication |
| `net.PktLag` | Simulate packet latency (ms) |
| `net.PktLagVariance` | Variance in simulated latency |
| `stat net` | Network statistics overlay |
| `net.ListActors` | List all replicated actors |

> **In your games:**
> - **DnD RPG** (when testing co-op):
>   - `net.PktLag 100` + `net.PktLagVariance 50`: Simulate 100ms latency with 50ms variance to test how co-op combat feels with lag. Does spell timing still work? Do enemies rubber-band?
>   - `net.PktLoss 5`: Simulate 5% packet loss. Verify that reliable RPCs (damage, loot) still work and unreliable RPCs (particles, sounds) degrade gracefully.
>   - `net.UseAdaptiveNetUpdateFrequency 1`: Enable adaptive updates so idle actors (sleeping enemies, static props) use less bandwidth while active combat actors update frequently.
>   - `net.ListActors`: Check how many actors are replicating. In a large dungeon, you should see dormant actors absent from this list.
> - **Wizard's Chess** (when testing online multiplayer):
>   - `net.PktLag 200`: Simulate high latency. Chess is turn-based, so even 200ms lag should feel fine. Verify that move confirmations and board state updates are smooth.
>   - `net.PktLoss 10`: Aggressive packet loss test. Since moves use Reliable RPCs, they must always arrive. Test that the game never desyncs even with heavy loss.
>   - `stat net`: Monitor bandwidth during a full game. Chess replication should use trivial bandwidth (a few bytes per move). If it is higher, something is replicating unnecessarily.
>   - `net.ListActors`: Verify only essential actors replicate (board, pieces, game state). There should be roughly 35 actors, not hundreds.

### Audio

| Command | Description |
|---------|-------------|
| `au.SetAudioVolume X` | Set master audio volume |
| `au.Debug.SoundCues` | Debug sound cues |
| `au.Debug.Sounds` | Debug active sounds |
| `au.3dVisualize.Enabled` | 3D audio debug visualization |
| `au.DisableSound` | Mute all audio |
| `ShowSoundDebug` | Show sound debug info on HUD |
| `au.MaxChannels` | Set max audio channels |
| `au.ReverbVolume` | Set reverb volume |
| `au.VoipVolumeMultiplier` | VOIP volume multiplier |

> **In your games:**
> - **DnD RPG**: Audio is atmosphere. Key debugging commands:
>   - `au.3dVisualize.Enabled 1`: See spatial audio sources in the dungeon. Verify torches, dripping water, distant monster growls, and echoing footsteps are positioned correctly in 3D space.
>   - `au.Debug.Sounds 1`: See all active sounds with their volumes, distances, and attenuation. Useful for finding sounds that are too loud or inaudible.
>   - `au.ReverbVolume 1.2`: Increase reverb for cavernous dungeon rooms. Test different values per room type (tight corridors = less reverb, open caverns = more).
>   - `au.MaxChannels 64`: Increase max channels if your dungeon has many simultaneous sound sources and sounds are cutting out.
>   - `au.DisableSound 1`: Mute audio during visual-only debugging sessions so you can focus.
> - **Wizard's Chess**: Audio debugging:
>   - `au.3dVisualize.Enabled 1`: Verify piece movement sounds, capture sounds, and ambient music sources are positioned correctly.
>   - `au.Debug.Sounds 1`: Check that sound effects play at correct volumes relative to each other (piece placement click vs capture explosion).
>   - `au.VoipVolumeMultiplier`: Adjust if you add voice chat for online matches.

### Memory

| Command | Description |
|---------|-------------|
| `memreport` | Generate memory report |
| `memreport -full` | Detailed memory report with all allocations |
| `obj gc` | Force garbage collection |
| `obj list` | List all UObjects by class with counts and memory |
| `obj list class=StaticMesh` | List all StaticMesh objects |
| `obj refs name=ObjectName` | Show references to an object |
| `mem detailed` | Detailed memory allocator stats |
| `llm.trace` | Low Level Memory Tracker trace output |

> **In your games:**
> - **DnD RPG**: Memory management for large dungeons:
>   - `obj list class=StaticMesh`: Check how many static mesh assets are loaded. Large dungeons with unique props can balloon mesh memory. Reuse modular pieces to keep this count manageable.
>   - `obj list class=Texture2D`: Check texture memory. High-res dungeon textures (4K stone, wood, metal) add up fast. Use virtual textures and streaming to manage this.
>   - `memreport -full`: Run after loading a complete dungeon floor. Establish a memory budget and track it as you add content.
>   - `obj gc`: Force garbage collection after unloading a dungeon floor to reclaim memory before loading the next one.
>   - `llm.trace`: Low-level memory tracking for catching leaks. Run during extended play sessions to ensure memory does not grow unbounded.
> - **Wizard's Chess**: Memory should be tight for a small scene:
>   - `obj list class=StaticMesh`: You should see around 6-12 unique piece meshes (or fewer if using Nanite instances). If the count is higher, you have duplicate assets.
>   - `memreport`: Quick sanity check. The entire chess scene should use modest memory. If it is high, investigate textures and mesh complexity.

### Streaming and World Partition

| Command | Description |
|---------|-------------|
| `wp.Runtime.ToggleDrawRuntimeHash2D` | Toggle World Partition grid debug |
| `wp.Runtime.ToggleDrawRuntimeHash3D` | Toggle 3D grid debug |
| `wp.Runtime.HLOD` | HLOD debug namespace |
| `wp.Runtime.OverrideRuntimeSpatialHashLoadingRange` | Override loading range |
| `wp.Editor.DebugDraw` | Editor World Partition debug |
| `streaming.PoolSize` | Texture streaming pool size (MB) |
| `r.Streaming.PoolSize` | Same as above |
| `r.Streaming.MipBias` | Global mip bias for streaming |
| `r.Streaming.Boost` | Streaming boost factor |

> **In your games:**
> - **DnD RPG**: Streaming and World Partition are important if you build large, connected dungeons:
>   - `wp.Runtime.ToggleDrawRuntimeHash2D 1`: Visualize which World Partition cells are loaded as you walk through the dungeon. Verify that rooms ahead of the player are streaming in and rooms behind are unloading.
>   - `wp.Runtime.OverrideRuntimeSpatialHashLoadingRange`: Adjust the loading range so dungeon rooms load before the player sees the boundary. Too short and you get pop-in; too long and you waste memory on distant rooms.
>   - `r.Streaming.PoolSize 2048`: Increase texture streaming pool if you see blurry textures as you enter new dungeon areas. High-res dungeon textures need room to stream in.
>   - `r.Streaming.MipBias -1`: Force higher-quality texture mips during development to see how textures look at full quality.
>   - For a level-based dungeon structure (discrete floors loaded one at a time), you may not need World Partition at all. Standard level streaming works fine.
> - **Wizard's Chess**: World Partition and streaming are overkill for a single board scene. Default streaming settings are fine. Only increase `r.Streaming.PoolSize` if you use very high-resolution textures for the board and pieces and notice blurriness.
