## Performance Profiling

### Unreal Insights

Unreal Insights is UE5's primary profiling tool, replacing the older Session Frontend profiler.

#### Launching

- From Editor: **Tools > Unreal Insights** (or run `UnrealInsights.exe` standalone).
- Record a trace: `trace.start [channels]` in console, or use `-trace=[channels]` on the command line.
- Stop recording: `trace.stop`.
- Trace files saved to `Saved/Profiling/` as `.utrace` files.
- Connect live: `UnrealInsights.exe -Store` for live session viewing.

#### Trace Channels

| Channel | Data Captured |
|---------|--------------|
| `cpu` | CPU timing events |
| `gpu` | GPU timing events |
| `frame` | Frame boundaries |
| `bookmark` | Named bookmark events |
| `log` | Log output |
| `memory` | Memory allocations (LLM) |
| `asset` | Asset loading/metadata |
| `loadtime` | Asset load timing |
| `file` | File IO operations |
| `net` | Network replication |
| `task` | Task graph scheduling |
| `rendering` | Rendering events |

Example: `trace.start cpu,gpu,frame,memory,loadtime`

> **In your games:**
> - **DnD RPG**: Use `cpu,gpu,frame,memory,rendering` when profiling dungeon scenes. The `memory` channel helps track whether Niagara particle pools, AI controllers for multiple enemies, and PCG-generated props are eating too much RAM. Add `task` to investigate thread scheduling if the game hitches during AI decision-making turns.
> - **Wizard's Chess**: Focus on `cpu,gpu,frame,rendering` since the main concern is particle-heavy capture sequences. The `memory` channel is less critical here because the scene is a single board with a fixed number of pieces.

#### Views

- **Timing View**: Hierarchical flame chart of CPU/GPU timing. Drill into threads, functions, and scopes.
- **Memory View**: Track allocations by LLM tag, detect leaks, analyze peak usage.
- **Loading View**: Asset loading waterfall, dependency chains, load times.
- **Asset Metadata**: Browse cooked assets, sizes, dependencies.
- **Networking View**: Replication traffic, bandwidth per actor/property.

> **In your games:**
> - **DnD RPG**: The **Timing View** is your go-to for finding why a dungeon room stutters. Look for expensive ticks on AI behavior trees, GAS ability calculations, and Niagara particle updates. The **Memory View** helps you track down leaks when spawning and destroying many enemies across a session. The **Loading View** reveals slow asset loads during level streaming (e.g., transitioning from tabletop view to 3D dungeon).
> - **Wizard's Chess**: Use the **Timing View** to find GPU spikes during capture animations. If a queen captures a pawn and 5 particle systems fire at once, the flame chart shows exactly which Niagara system is the bottleneck. The **Memory View** is useful to confirm that destroyed piece actors are actually being garbage collected.

### Stat Commands

All stat commands toggle an on-screen overlay:

- `stat fps`: Framerate counter.
- `stat unit`: Frame time split (Game thread, Render thread, GPU, RHIT).
- `stat unitgraph`: Visual graph of frame times over time.
- `stat game`: Game thread breakdown.
- `stat gpu`: GPU pass timings (base pass, shadows, lighting, post process).
- `stat memory`: Process memory usage.
- `stat scenerendering`: Per-pass rendering stats.
- `stat initviews`: Frustum culling, occlusion culling stats.
- `stat particles`: Particle counts and timings.
- `stat anim`: Animation evaluation costs.
- `stat physics`: Physics simulation stats.
- `stat audio`: Audio channels, sources.
- `stat streaming`: Texture streaming pool usage.
- `stat net`: Network stats (ping, packet loss, bandwidth).
- `stat startfile` / `stat stopfile`: Record stats to file for Insights.
- `stat none`: Clear all stat overlays.

> **In your games:**
> - **DnD RPG**: Start with `stat unit` to see if you are Game thread bound (AI, GAS) or GPU bound (Niagara, Lumen lighting). Use `stat particles` when a room has torches, spell effects, and ambient dust all running simultaneously. Use `stat anim` to check animation costs when multiple enemies with complex anim blueprints are on screen. Use `stat game` to drill into which game thread systems (AI ticks, ability evaluations) are expensive.
> - **Wizard's Chess**: Use `stat gpu` during capture sequences to see exactly how much time particle effects add. Use `stat particles` to monitor the total active particle count when multiple captures happen in quick succession. Use `stat unit` to confirm you are hitting your target frame rate on the static board view.

### GPU Profiler

- Open with `ProfileGPU` console command or **Ctrl+Shift+,**.
- Shows a hierarchical tree of GPU passes with millisecond timings.
- Key passes to monitor: BasePass, ShadowDepths, Lighting, Translucency, PostProcessing, Nanite, Lumen, VirtualShadowMaps.
- Sort by cost to find the most expensive operations.
- Right-click entries to navigate to related settings.

> **In your games:**
> - **DnD RPG**: Watch for expensive **ShadowDepths** (many dynamic lights in a dungeon with torches), **Translucency** (spell effects, fog, magical barriers), and **Lumen** costs. If Lumen GI is too expensive for a dark dungeon with many light sources, consider baked lighting for static torches and Lumen only for dynamic spell effects.
> - **Wizard's Chess**: Focus on **BasePass** (32 chess pieces with materials), **Translucency** (magical particle effects during captures), and **PostProcessing** (any glow, bloom, or depth-of-field on the board). The GPU profiler quickly tells you if your capture VFX need LODs or reduced particle counts.

### Frame Profiler

- **Session Frontend > Profiler** (legacy) or use Unreal Insights Timing View.
- Shows per-frame breakdown of CPU and GPU work.
- Thread view: GameThread, RenderThread, RHIThread, worker threads.
- Identify bottlenecks by comparing Game thread vs Render thread vs GPU.

> **In your games:**
> - **DnD RPG**: In a complex encounter with 8+ AI enemies running behavior trees, evaluating GAS abilities, and updating Niagara effects, the Game thread is likely your bottleneck. If the Render thread or GPU is the bottleneck instead, it points to too many draw calls from PCG-generated dungeon props or expensive Lumen calculations.
> - **Wizard's Chess**: The GPU is the likely bottleneck during flashy capture sequences. The Game thread should be cheap since chess logic is lightweight. If the Game thread spikes, check if your move validation or AI opponent is running expensive pathfinding on tick instead of on demand.

### Memory Profiling

- `memreport -full`: Generates a comprehensive memory report saved to `Saved/Profiling/MemReports/`.
- **LLM (Low Level Memory Tracker)**: Tags every allocation with a category.
  - Enable: `-llm` command line flag or `llm.trace` console command.
  - View in Unreal Insights Memory view.
  - Tags: Meshes, Textures, Audio, Animation, Physics, Nanite, Lumen, UI, etc.
- `obj list`: Lists all UObject instances with memory usage per class.
- `obj gc`: Forces garbage collection.
- `stat memory`: Quick overview of used/available memory.
- Texture streaming pool: `r.Streaming.PoolSize` controls max VRAM for streamed textures.

> **In your games:**
> - **DnD RPG**: Use `memreport -full` after long play sessions to check for memory leaks from spawned and destroyed enemies. Enable LLM to track Niagara allocations (spell VFX that spawn and despawn frequently), Mesh memory (PCG-generated dungeon props), and Animation data (enemy skeletal meshes). If memory climbs over time, LLM tags pinpoint the category.
> - **Wizard's Chess**: Use `obj list` to verify that captured (destroyed) piece actors are properly garbage collected. If you pool Niagara systems for capture effects rather than spawning new ones, LLM confirms the particle memory stays flat.

### Network Profiler

- **Network Profiler** tool: Captures replication traffic per actor, property, RPC.
- Enable: `-NetworkProfiler` command line flag.
- Saves `.nprof` files to `Saved/Profiling/`.
- Analyze with the standalone Network Profiler tool or Unreal Insights Networking view.
- `stat net`: Real-time network overlay showing ping, in/out bandwidth, packet loss.
- Key metrics: replication bandwidth per actor, RPC frequency, reliable buffer usage.

> **In your games:**
> - **DnD RPG**: If you add local multiplayer or a future online co-op mode, the network profiler helps track replication costs for ability activations, AI state, and inventory changes. For now, skip this section since both games are single-player.
> - **Wizard's Chess**: Not needed unless you add online multiplayer chess. Even then, the replication is minimal (just move data).

### Console Variable Tweaking for Performance

Common performance-oriented CVars:

| CVar | Effect |
|------|--------|
| `r.ScreenPercentage` | Reduce internal resolution (e.g., 75%) |
| `r.Nanite.MaxPixelsPerEdge` | Increase to reduce Nanite triangle count |
| `r.Shadow.MaxResolution` | Cap shadow map resolution |
| `r.Shadow.CSM.MaxCascades` | Reduce cascade count |
| `r.VolumetricFog` | Disable for cost savings |
| `r.Lumen.DiffuseIndirect.Allow 0` | Disable Lumen GI |
| `r.MegaLights 0` | Disable MegaLights |
| `sg.[Group]Quality` | Scalability presets |
| `r.TSR.Quality` | Lower TSR quality |
| `t.MaxFPS` | Cap frame rate |
| `gc.TimeBetweenPurgingPendingKillObjects` | GC interval |
| `gc.IncrementalBeginDestroyGranularity` | Reduced from 100 to 10 in 5.7 |

> **In your games:**
> - **DnD RPG**: Key CVars to experiment with:
>   - `r.Shadow.MaxResolution` and `r.Shadow.CSM.MaxCascades`: Dungeons have many torches and dynamic lights. Lowering shadow resolution or cascade count saves significant GPU time.
>   - `r.Lumen.DiffuseIndirect.Allow 0`: If Lumen is too expensive for a dense dungeon, disable it and use baked lighting.
>   - `t.MaxFPS 60`: Cap at 60 to keep frame times stable during complex encounters.
>   - `gc.TimeBetweenPurgingPendingKillObjects`: Tune this if you notice GC hitches after destroying many enemies at once.
> - **Wizard's Chess**: Key CVars:
>   - `r.ScreenPercentage 85`: If capture VFX cause frame drops, lowering internal resolution slightly buys GPU headroom without noticeable quality loss on a static board.
>   - `r.VolumetricFog 0`: If you have atmospheric fog on the board but it costs too much, disable it.
>   - `t.MaxFPS 60`: Cap the frame rate since chess does not benefit from high FPS.
