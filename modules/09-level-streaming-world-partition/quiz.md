# Module 09: Quiz - The Open World

Test your understanding of World Partition, landscapes, and level streaming. Try to answer each question before revealing the answer.

---

### Question 1

What is the difference between World Partition and Level Streaming, and when would you use each one in Tabletop Quest?

<details>
<summary>Show Answer</summary>

**World Partition** automatically divides the world into a grid of cells based on a configurable cell size. It streams cells in and out based on the player's position and a loading range. You place actors anywhere and the system handles assignment and streaming. Best for **open, continuous spaces** like the Tabletop Quest overworld (terrain, towns, forests, mountains).

**Level Streaming** uses manually defined sub-levels that load and unload based on trigger volumes or Blueprint logic. You decide the boundaries and triggers. Best for **discrete, contained spaces** like dungeons, which have clear entrances and exits.

Use World Partition for the overworld. Use Level Streaming for dungeons and building interiors.

</details>

---

### Question 2

What are Data Layers in World Partition, and why are they useful for Tabletop Quest's two-scale design?

<details>
<summary>Show Answer</summary>

Data Layers let you categorize actors within the same grid cell and control their streaming independently. You can put buildings, foliage, NPCs, enemies, and tabletop miniatures on separate layers, then load/unload layers based on game state.

For Tabletop Quest, this is essential for the tabletop-to-world transition. In tabletop view, only the `TabletopMiniatures` and `Landscape` (HLOD) layers are loaded. During the zoom transition, `Foliage`, `Buildings`, `NPCs`, and `Enemies` layers load for the target area while `TabletopMiniatures` fades out. This means the game never has both the miniature and full-detail versions loaded simultaneously, saving memory and GPU cost.

</details>

---

### Question 3

Explain how HLOD connects to Tabletop Quest's tabletop view. How could you use HLOD proxies to create the miniature appearance?

<details>
<summary>Show Answer</summary>

HLOD generates simplified proxy meshes that represent distant geometry. These proxies are lower-poly versions of the full-detail actors in a cell. The tabletop view is essentially the maximum-distance LOD: the entire world seen from above as simplified shapes.

You can apply a custom "painted miniature" material to HLOD proxies that makes them look like tabletop game pieces: slightly desaturated colors, a painted-wood texture blend, soft edges, and a slight diorama feel. The HLOD system already generates the simplified geometry; you just need to swap the material to get the miniature aesthetic. This is more efficient than authoring miniature meshes by hand for every building and terrain feature.

</details>

---

### Question 4

A player hovers over a location on the tabletop map and clicks to zoom in. Describe the streaming strategy that ensures no pop-in during the 2.5-second transition.

<details>
<summary>Show Answer</summary>

1. **On hover (0.5s delay)**: Identify the World Partition cells covering the target area and begin preloading them. Start with the `Landscape` and `Buildings` layers (most visually important from above).
2. **On click (zoom starts)**: Begin loading `Foliage`, `NPCs`, and `Enemies` layers. The zoom animation takes 2.5 seconds, which is the streaming window.
3. **During zoom**: The camera descends, and the `TabletopMiniatures` layer fades out while real actors fade in. Foliage spawns progressively (using distance-from-camera fade) to mask any remaining loading.
4. **Fallback**: If the area is not fully loaded by zoom completion, slightly extend the transition duration (from 2.5s to 3-4s). The player perceives a dramatic camera move, not a loading delay.
5. **Post-zoom**: Unload `TabletopMiniatures` layer to free memory.

</details>

---

### Question 5

What is the PCG (Procedural Content Generation) framework, and how does it differ from the Foliage Tool?

<details>
<summary>Show Answer</summary>

The **PCG framework** uses rule-based graphs to generate content. You define rules like "place trees on grass, avoid roads, minimum 3m spacing, random scale 0.8-1.2" and the system generates thousands of placements automatically. It uses generators (surface sampler, grid sampler), filters (slope, distance, density), and spawners. PCG is deterministic (same seed = same result) and great for large areas.

The **Foliage Tool** is a paint brush. You select foliage types and paint them onto the landscape by clicking and dragging. It gives you direct artistic control over exactly where things go.

Use PCG for large wilderness areas (forests, plains, mountainsides) where consistent rules produce good results. Use the Foliage Tool for hand-crafted areas (town squares, dungeon approaches, scenic viewpoints) where artistic intent matters more than efficiency.

</details>

---

### Question 6

You are building a dungeon sub-level. Why would you position it underground (negative Z) rather than at the same height as the overworld?

<details>
<summary>Show Answer</summary>

Positioning the dungeon underground prevents visual and collision conflicts with the overworld. If the dungeon were at the same Z height, its geometry would intersect with overworld terrain, trees, and buildings. Players might see dungeon walls clipping through the landscape. Lighting from the dungeon could bleed into the overworld. Physics objects could collide incorrectly.

By placing it at negative Z (underground), the dungeon is physically separated from the overworld. The only overlap is the entrance corridor, which exists in both levels and provides a seamless visual transition. The player walks through the corridor, and by the time they reach the dungeon geometry, the overworld is behind them (and can be unloaded).

</details>

---

### Question 7

What is Nanite, and why should you NOT enable it on skeletal meshes (characters and enemies)?

<details>
<summary>Show Answer</summary>

Nanite is UE5's virtual geometry system that renders extremely detailed meshes efficiently by only drawing the triangles actually visible at the current camera distance and angle. It eliminates the need for traditional LOD meshes and handles millions of triangles smoothly.

You cannot enable Nanite on skeletal meshes because Nanite only works with **static geometry**. Skeletal meshes deform every frame (bones move, vertices shift for animations), which is incompatible with Nanite's GPU-driven rendering pipeline. Characters, enemies, and any animated mesh must use traditional LOD systems with manual LOD meshes at different detail levels.

Enable Nanite on: landscape, buildings, rocks, props. Use traditional LOD on: characters, enemies, any animated object.

</details>

---

### Question 8

Tabletop Quest needs to run UE5 at 60fps while also running a local LLM (Ollama) for the AI Dungeon Master. How does this constraint affect your world building decisions?

<details>
<summary>Show Answer</summary>

The LLM consumes 2-4GB of RAM and significant CPU/GPU resources for inference. This means the game cannot use all available hardware resources. Practical implications:

1. **Lower rendering budget**: Target 8-10ms GPU time instead of the full 16ms, leaving headroom for LLM inference.
2. **Aggressive streaming**: Use smaller cell sizes and shorter loading ranges to minimize memory usage. Use Data Layers to avoid loading unnecessary actors.
3. **HLOD importance increases**: More of the world should be shown as HLOD proxies to reduce rendering cost.
4. **Foliage density limits**: Keep foliage reasonable. Dense forests with 50,000 grass instances are expensive.
5. **Baked lighting in dungeons**: Use Lumen in the overworld but baked lighting in dungeons to save GPU.
6. **AI LOD**: Enemies far from the player should run simplified Behavior Trees (Module 07).
7. **Async LLM calls**: The LLM should run on a separate thread so it does not block the game thread.

Every optimization decision should account for the LLM running alongside the game.

</details>

---

### Question 9

Why should you place something interesting every 100-200 meters in the overworld, and what types of points of interest create variety?

<details>
<summary>Show Answer</summary>

Players walking through empty terrain for more than 1-2 minutes get bored. Points of interest give them constant reasons to explore, deviate from the path, and stay engaged. They also serve as navigation aids (the player remembers landmarks).

Variety prevents fatigue. If every 200m is a combat encounter, it becomes tedious. Mix these types:

- **Combat encounters** (every 300-500m): Goblin patrol, wandering beast
- **Resource nodes** (every 100-200m): Herbs, minerals, wood for crafting
- **Lore discoveries** (every 200-300m): Stone tablets, abandoned journals, ruins telling the world's story
- **Environmental puzzles** (every 500-1000m): Locked doors, pressure plates, hidden paths
- **NPC encounters** (every 500m outside towns): Travelers, merchants, lost villagers
- **Vista/rest points** (every 400-600m): Cliff overlooks with scenic views, campfire spots

The mix should lean toward non-combat. Most steps should be "discovery" not "danger."

</details>

---

### Question 10

You notice that crossing a World Partition cell boundary causes a 200ms hitch (stutter). What are three potential causes and fixes?

<details>
<summary>Show Answer</summary>

**Cause 1: Too many actors in the loading cell.** If a cell has 500+ actors, loading them all at once causes a spike. **Fix**: Reduce actor count by merging static meshes, using instanced meshes, or splitting the cell into multiple Data Layers that load at staggered times.

**Cause 2: Large/complex assets in the cell.** A single building with 50,000 triangles and 10 unique materials takes longer to load than simplified geometry. **Fix**: Enable Nanite on static meshes (reduces CPU-side work), reduce material complexity, use shared materials across multiple meshes.

**Cause 3: Loading range is too short.** The player crosses the cell boundary before the adjacent cell has finished loading. **Fix**: Increase the Loading Range so cells load further ahead of the player. Also consider adding a HLOD layer that provides visual coverage at distances beyond the runtime loading range, hiding the streaming boundary.

Additional diagnostic step: run `stat streaming` to see exactly which cells are loading and how long each takes. Target under 2ms per cell load.

</details>
