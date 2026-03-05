## Nanite

### Supported Mesh Types

- Static Meshes (opaque and masked materials)
- Instanced Static Meshes (ISM and HISM)
- Foliage instances
- Geometry Collections (Chaos Destruction)
- Nanite Foliage (Experimental in 5.7, uses Voxels and Assemblies)
- Skeletal Meshes are NOT supported by Nanite (except via Nanite Skinning for foliage)

> **In your games:**
> - **DnD RPG**: Enable Nanite on all your dungeon static meshes: walls, floors, pillars, doors, treasure chests, statues, stone bridges, and environmental props. These are all opaque Static Meshes and perfect Nanite candidates. Foliage instances around outdoor areas also benefit. However, your character meshes (Warrior, Rogue, Cleric, Wizard, Ranger, Bard) are Skeletal Meshes with animations, so they cannot use Nanite. Same for animated enemy meshes and any NPCs. Geometry Collections work with Nanite, so destructible dungeon walls or smashable crates will keep their detail as they break apart.
> - **Wizard's Chess**: Enable Nanite on all 32 chess piece meshes since they are Static Meshes with high geometric detail (ornate carvings, fine details on knights and bishops). The board itself, the board border, and arena environment props (pillars, thrones, candelabras) are also excellent Nanite candidates. Since chess pieces do not use skeletal animation (they move via transform/lerp, not bone-based animation), Nanite works perfectly.

### Enabling Nanite

- **Per-Mesh**: Static Mesh Editor > **Details > Nanite > Enable Nanite Support** checkbox. Rebuild the mesh after enabling.
- **On Import**: In the FBX Import dialog, check **Nanite > Enable Nanite Support**.
- **Bulk Enable**: Select multiple meshes in Content Browser > Right-click > **Nanite > Enable**.
- **Project-Wide Default**: **Project Settings > Engine > Rendering > Nanite > Default Nanite Setting** (not recommended for all meshes).

> **In your games:**
> - **DnD RPG**: Enable Nanite per-mesh on import for all dungeon environment assets (walls, floors, pillars, doors, chests, decorations). Use Bulk Enable to quickly convert existing mesh libraries. Do not enable it project-wide since Skeletal Meshes (characters, enemies) are not supported and would cause issues.
> - **Wizard's Chess**: Enable Nanite on import for all chess piece FBX files. Use Bulk Enable on existing board and environment meshes. Since the project is mostly static meshes, you could use the project-wide default, but per-mesh control gives you more flexibility if you add any non-Nanite-compatible meshes later.

### Nanite Settings Per Mesh

In the Static Mesh Editor under **Nanite**:

- **Enable Nanite Support**: Toggle Nanite on this mesh.
- **Position Precision**: Auto or explicit value. Controls vertex position quantization (0 = highest precision).
- **Percent Triangles**: Target triangle percentage for the lowest LOD cluster (default 100%).
- **Trim Relative Error**: Threshold for discarding detail. Higher values allow more aggressive simplification. Default 0 means preserve all detail.
- **Fallback Triangle Percent**: Percentage of triangles in the fallback mesh (for platforms/features that cannot use Nanite).
- **Fallback Relative Error**: Error threshold for fallback mesh generation.
- **Max Edge Length Factor**: Controls maximum edge length in Nanite clusters.
- **Displacement**: Enable displacement mapping on Nanite meshes (Experimental).

> **In your games:**
> - **DnD RPG**: Leave Position Precision on Auto for most dungeon meshes. For very small detail props (coins, keys, potion bottles), you might increase precision so the fine geometry is preserved. Set Trim Relative Error to a small value (0.01-0.05) for hero props the player examines up close (quest items, boss room centerpieces) and a higher value (0.1-0.5) for background walls the player rarely inspects closely. This saves memory on distant/background geometry. Fallback Triangle Percent matters for shadows if you use traditional shadow maps, so keep it reasonable (25-50%) for large dungeon walls.
> - **Wizard's Chess**: Set Position Precision to Auto or high precision for chess pieces since the player zooms in close to examine them. Keep Trim Relative Error at 0 for pieces (preserve all carved detail on knights, bishops, rooks). The board tiles can use a moderate Trim Relative Error (0.1) since they are flat with minimal geometric detail. Set Fallback Triangle Percent to 50% for pieces in case any rendering path falls back to non-Nanite.

### Fallback Meshes

- Fallback meshes are auto-generated simplified versions used when Nanite is unavailable.
- Used for: shadow casting (if not using Nanite shadows), collision, platforms without Nanite support, WPO-dependent rendering.
- **Fallback Triangle Percent**: Controls fallback detail (default: variable based on mesh complexity).
- **Fallback Relative Error**: Alternative control using error metric rather than triangle count.
- Fallback meshes are stored within the Nanite mesh asset; no separate asset is needed.
- Override fallback by providing a custom Static Mesh LOD at a specific LOD index.

> **In your games:**
> - **DnD RPG**: Fallback meshes are generated automatically and serve as your safety net. They are used for collision (line traces for interaction detection on chests and doors), for shadow casting if you use non-Nanite shadow methods, and on platforms without Nanite support. Keep Fallback Triangle Percent at 25-50% for large environment pieces and 50-75% for interactive objects that need accurate collision shapes. If a dungeon wall's fallback looks too rough for shadow silhouettes, provide a custom LOD0 with cleaner geometry.
> - **Wizard's Chess**: Fallback meshes matter for collision detection on chess pieces (the player clicks pieces to select them, which uses line traces against collision geometry). Set a higher Fallback Triangle Percent (50-75%) for pieces so the collision shape closely matches the visual mesh. For board squares, the fallback can be simpler since they are flat planes.

### Nanite Foliage (New in 5.7)

See the Foliage section above for full details. Summary:

- **Status**: Experimental.
- **Nanite Voxels**: Automatic LOD for distant foliage, converting detailed geometry into voxel representations.
- **Nanite Assemblies**: Modular part instancing to minimize memory and rendering cost for complex foliage (20-40M triangles per tree).
- **Nanite Skinning**: Skeletal animation for wind, replacing WPO which has poor Nanite support.
- **Setup**: Instanced Skinned Mesh Component + Wind Transform Provider.
- **Performance**: Stable frame rates for millions of tiny, overlapping elements without LOD authoring, cross-fades, or pop-in.
- Incomplete physics/collision support. Validate on target hardware.

> **In your games:**
> - **DnD RPG**: Nanite Foliage applies to outdoor areas around dungeons. If you have a dense forest near a dungeon entrance, Nanite Voxels handle distant tree LOD during the tabletop zoom transition (trees in the background simplify automatically as the camera pulls back). Nanite Skinning provides wind animation on those trees without WPO. Since this is experimental, use it for visual polish in later development phases and keep traditional HISM foliage as a tested fallback.
> - **Wizard's Chess**: Not applicable. Chess arenas do not need Nanite-level foliage complexity. Standard foliage instancing is sufficient for any decorative vegetation.

### Performance

#### Triangle Budgets

- Nanite has no hard triangle budget; it streams clusters on demand.
- Practical limits depend on GPU VRAM and bandwidth. Scenes with billions of source triangles are typical.
- `r.Nanite.MaxPixelsPerEdge` (default 1.0) controls the detail threshold; higher values reduce triangle count.
- Nanite targets roughly 1 triangle per pixel at the finest detail level.

> **In your games:**
> - **DnD RPG**: Your dungeon rooms are filled with dense geometry: carved stone walls, ornate pillars, detailed floor tiles, treasure piles, weapon racks, and bookshelves. Nanite handles all of this without a triangle budget, streaming clusters on demand. When the player zooms in on a treasure chest, Nanite renders full detail. When zoomed out to the tabletop overview, distant rooms automatically reduce to fewer triangles. Use `r.Nanite.MaxPixelsPerEdge` at 1.0 for quality, or increase to 1.5 during performance optimization if the GPU struggles in the most detailed rooms.
> - **Wizard's Chess**: Chess pieces are the primary beneficiary. An ornate knight piece might have 500K+ source triangles with carved mane detail, armor engravings, and fine facial features. Nanite renders full detail when the camera zooms in to show a piece moving, then reduces triangles for pieces on the far side of the board. The entire board with all 32 detailed pieces can render at full quality without manually authored LODs. Use `r.Nanite.MaxPixelsPerEdge` at 1.0 for maximum piece detail.

#### Overdraw

- Nanite uses a visibility buffer (VisBuffer) that eliminates overdraw for opaque geometry.
- Each pixel is resolved to a single triangle before material shading, so overdraw cost is near zero for Nanite geometry.
- Overdraw problems arise only when mixing Nanite and non-Nanite geometry or with translucent materials.

> **In your games:**
> - **DnD RPG**: Overdraw is near zero for all your Nanite dungeon geometry, which is a huge win for performance. The main overdraw concern is mixing Nanite walls/floors with non-Nanite translucent elements like magical particle effects, glowing runes, and spell visuals. Keep translucent spell effects simple and use them sparingly in rooms with heavy geometry. Character meshes (Skeletal, non-Nanite) overlapping Nanite backgrounds also add overdraw, but this is minimal for a party of 4-6 characters.
> - **Wizard's Chess**: Near-zero overdraw for the board and pieces since everything is opaque Nanite geometry. The only translucent elements might be magical spell effects during piece captures (e.g., a destruction VFX) or selection highlights. These are brief and localized, so overdraw is not a concern.

#### Debug Views (Nanite Visualization Modes)

Access via **Viewport > Show > Nanite Visualization** or via console commands:

- **Triangles**: `r.Nanite.Visualize.Mode Triangles` - Shows triangle density as a heatmap.
- **Clusters**: `r.Nanite.Visualize.Mode Clusters` - Color-codes Nanite clusters.
- **Overdraw**: `r.Nanite.Visualize.Mode Overdraw` - Highlights overdraw (should be minimal for Nanite).
- **Materials**: `r.Nanite.Visualize.Mode MaterialComplexity` - Material evaluation cost.
- **Hierarchy**: Shows the cluster hierarchy tree.
- **Streaming**: Shows which data is streamed in vs out.

> **In your games:**
> - **DnD RPG**: Use **Triangles** view to verify that dungeon rooms are not wasting triangles on hidden geometry (e.g., wall backs that face outward and are never seen). Use **Clusters** view to understand how Nanite subdivides your dungeon meshes. Use **Overdraw** view in rooms with many translucent effects (magical barriers, fog) to identify performance bottlenecks. Use **Streaming** view to verify that distant dungeon rooms are properly streaming Nanite data in and out as the player moves. Use **Materials** view to find overly expensive materials on walls or floors that could be simplified.
> - **Wizard's Chess**: Use **Triangles** view to check that piece detail scales correctly with camera distance (full detail up close, reduced from far). Use **Clusters** view to verify how Nanite partitions the ornate piece geometry. Use **Materials** view to ensure piece materials (metallic gold, marble, obsidian) are not unnecessarily expensive.

### Limitations

Nanite cannot be used with:

- **Translucent materials**: Only opaque and masked shading models are supported.
- **Masked materials with World Position Offset (WPO)**: WPO breaks Nanite's cluster culling and LOD system (Nanite Skinning is the 5.7 alternative for foliage).
- **Skeletal meshes** (standard skeletal animation; Nanite Skinning for foliage is the exception).
- **Morph targets and vertex animation**.
- **Custom depth/stencil per-triangle**: Nanite operates at the cluster level.
- **Multi-pass rendering techniques** that require re-submitting geometry.
- **Some mobile platforms**: Nanite requires compute shader support (SM6 or equivalent).
- **Spline meshes** (limited/experimental support).
- **Landscape meshes**: Landscape has its own LOD system.

> **In your games:**
> - **DnD RPG**: Key limitations to remember: your character and enemy Skeletal Meshes cannot use Nanite (use traditional LODs for those). Translucent materials like magical shields, water surfaces, and ghostly enemies must use standard rendering. If you want glowing runes on dungeon walls, use emissive materials on opaque Nanite meshes rather than translucent overlays. WPO-based effects (like pulsing walls or moving vines) are incompatible with Nanite, so use Blueprints or material animation tricks that do not rely on WPO. Spline meshes for curved corridors have limited Nanite support, so use segmented static meshes instead.
> - **Wizard's Chess**: The main limitation is that if you want magical, glowing translucent chess pieces (glass-like), they cannot use Nanite. Use opaque or masked materials on pieces to keep Nanite active. For the "magical" look, use emissive opaque materials with bloom rather than translucency. If pieces use morph targets or vertex animation for movement effects, those are also incompatible. Move pieces via transform interpolation (position/rotation lerp) instead.

### Console Commands for Nanite

| Command | Description |
|---------|-------------|
| `r.Nanite` | Master enable/disable (0/1) |
| `r.Nanite.MaxPixelsPerEdge` | Detail threshold, default 1.0. Higher = fewer triangles |
| `r.Nanite.Visualize.Mode` | Set visualization mode (Triangles, Clusters, Overdraw, etc.) |
| `r.Nanite.Visualize.Overview` | Show Nanite stats overlay |
| `r.Nanite.ShowStats` | Display Nanite rendering statistics |
| `r.Nanite.Culling.MinLOD` | Minimum LOD for culling, reduces memory and improves cull speed by skipping child clusters |
| `r.Nanite.PrimeHZB` | (Experimental) Draw lower-resolution passes before VisBuffer to improve camera-cut performance |
| `r.Nanite.Streaming.PoolSize` | VRAM pool size for Nanite streaming data (MB) |
| `r.Nanite.Streaming.MaxPagesPerFrame` | Max pages streamed per frame |
| `r.Nanite.Filter` | Filter which meshes use Nanite |
| `r.Nanite.AllowMaskedMaterials` | Enable/disable masked material support (0/1) |
| `r.Nanite.ProxyRenderMode` | Control fallback rendering mode |
| `r.Nanite.ShadowRasterization` | Enable Nanite shadow rasterization |
| `r.Nanite.VSM.InvalidateOnLODDelta` | Invalidate Virtual Shadow Maps on LOD changes |

> **In your games:**
> - **DnD RPG**: Use `r.Nanite.ShowStats` during development to monitor Nanite performance in your most complex dungeon rooms (boss arenas with lots of props). Use `r.Nanite.MaxPixelsPerEdge 1.5` as a scalability option for lower-end GPUs in your settings menu. Set `r.Nanite.Streaming.PoolSize` large enough to handle your biggest dungeon rooms without streaming stalls (monitor with the Streaming visualization). Use `r.Nanite.ShadowRasterization 1` for accurate shadows from detailed dungeon architecture. Toggle `r.Nanite.Visualize.Mode Triangles` during optimization passes to find rooms where Nanite is rendering more triangles than necessary.
> - **Wizard's Chess**: Use `r.Nanite.ShowStats` to verify that the board scene stays within a comfortable triangle count. Use `r.Nanite.Visualize.Mode Triangles` to confirm pieces scale detail correctly when the camera zooms. Use `r.Nanite.ShadowRasterization 1` for crisp piece shadows on the board (important for the visual quality of a close-up chess game). The Streaming Pool can be smaller since the entire scene fits in one view.
