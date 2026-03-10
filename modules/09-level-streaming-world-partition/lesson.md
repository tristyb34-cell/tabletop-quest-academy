# Module 09: The Open World

## Building the Tabletop Quest Overworld

Imagine trying to load an entire continent into your computer's memory at once: every town, every dungeon, every forest, every mountain, every NPC, every piece of furniture. Your system would choke before it rendered a single frame. This is the fundamental problem of open world games, and UE5 has a powerful solution for it: **World Partition**.

In this module, you will build the Tabletop Quest overworld. Not a theoretical landscape. The actual game world: a medieval fantasy region with towns, dungeons, wilderness areas, and the paths connecting them. You will learn how to make this world large enough to feel like an adventure but efficient enough to run at 60fps on a consumer PC that is also running a local LLM for the AI Dungeon Master.

The Tabletop Quest overworld is special because it exists at two scales simultaneously. The tabletop view looks down at the whole map as a miniature (think painted terrain tiles on a wooden table). The world view is the same space at full scale, with trees taller than the player and mountains on the horizon. World Partition and level streaming are what make both scales possible without loading screens.

---

## Part 1: The Old Way vs. The New Way

### Level Streaming (The Old Way)

Before World Partition, UE developers used **Level Streaming**. The concept is straightforward:

1. Create a **Persistent Level** (always loaded, contains the player and core systems)
2. Create **Sub-Levels** (chunks of the world: "Town_01", "Forest_Area", "Dungeon_Entrance")
3. Set up **Level Streaming Volumes** (invisible boxes in the world that trigger loading/unloading when the player enters/exits them)

When the player walks into a Level Streaming Volume for the forest, the engine loads the forest sub-level in the background. When they leave and enter the town volume, the forest unloads and the town loads. The player never sees a loading screen.

Level Streaming works, and many shipped games use it (including Fortnite before World Partition). But it has problems:

- **Manual management**: You decide where every sub-level boundary is. Move a tree across a boundary? It needs to be in the right sub-level.
- **Loading popping**: If the streaming volume is too close to visible geometry, the player sees objects pop into existence.
- **Collaboration pain**: Two developers cannot easily work on the same area because they might be editing the same sub-level.
- **Scale limits**: For a truly large world, you end up with hundreds of sub-levels, and managing them becomes a full-time job.

### World Partition (The New Way)

World Partition, introduced in UE5, automates most of what Level Streaming required you to do manually. Instead of defining sub-levels by hand, World Partition:

1. **Divides the world into a grid automatically** (you set the cell size)
2. **Assigns actors to grid cells** based on their position
3. **Streams cells in and out** based on the player's position and a configurable loading radius
4. **Handles LOD** through the HLOD system (distant objects become simplified meshes)
5. **Supports collaboration** because each cell can be checked out independently by a developer

Think of it like Google Maps. You do not load the entire planet at once. As you scroll, tiles load and unload around your viewport. World Partition does the same thing for your 3D world.

### Which One for Tabletop Quest?

Use **World Partition** for the overworld (outdoor terrain, towns, forests, mountains). Use **Level Streaming** for dungeons (contained interiors with clear entry/exit points).

Why the split? The overworld is open and continuous. There are no natural boundaries, so World Partition's automatic grid system handles it elegantly. Dungeons are discrete, bounded spaces with clear entrances. Level Streaming is simpler for these because you load the dungeon when the player enters and unload it when they leave.

---

## Part 2: Setting Up World Partition

### Enabling World Partition

When you create a new level in UE5, you can enable World Partition from the start:

1. **File > New Level > Open World** (this creates a World Partition level)
2. Or for an existing level: **Window > World Settings**, scroll to **World Partition** section, check **Enable World Partition**

Once enabled, you will see the **World Partition Editor** window (accessible via **Window > World Partition**). This shows a top-down grid view of your world with colored cells indicating which cells are loaded.

### Grid Setup

The grid cell size determines how the world is divided:

| Cell Size | Best For | Streaming Distance |
|-----------|----------|-------------------|
| 12800 (128m) | Dense areas with lots of actors | Short, 2-3 cells |
| 25600 (256m) | Medium density, good default | Medium, 3-4 cells |
| 51200 (512m) | Sparse open areas | Long, 2-3 cells |

For Tabletop Quest, **25600** (256 meters) is a good starting point. This means each grid cell covers a 256m x 256m area. A typical town might span 4-6 cells. A forest might span 20-30 cells.

To set the cell size:
1. Open World Settings
2. Under World Partition > Runtime Hash > Grid, set the **Cell Size** to 25600
3. Set the **Loading Range** to 51200 (two cells ahead of the player, giving the engine time to stream before the player arrives)

### Placing Actors in a World Partition Level

When you place actors (meshes, lights, blueprints) in a World Partition level, they are automatically assigned to the grid cell that contains their position. You do not need to think about it. Just place your trees, rocks, buildings, and NPCs where they belong, and World Partition handles the rest.

The World Partition Editor shows which cell each actor belongs to. If you select an actor, its cell highlights in the grid view.

### Data Layers

Data Layers let you categorize actors within the same grid cell and control their streaming independently. Think of them as tags that you can turn on and off.

For Tabletop Quest, useful Data Layers:

| Data Layer | Contains | When Loaded |
|------------|----------|-------------|
| `Landscape` | Terrain, large rocks, water | Always (within streaming range) |
| `Foliage` | Trees, grass, bushes | Always (within streaming range) |
| `Buildings` | Town structures, dungeon entrances | Always (within streaming range) |
| `Interiors` | Interior furniture, indoor lighting | Only when player is in the building |
| `NPCs` | Town NPCs, merchants, quest givers | When player is in the town |
| `Enemies` | Enemy spawners, patrol paths | When player is in the area |
| `TabletopMiniatures` | Miniature versions of buildings, terrain | Only when camera is in tabletop view |

Data Layers let you fine-tune what is loaded. A town's buildings are always visible from a distance, but the interior furniture and NPCs only load when the player is close enough to interact with them.

To create a Data Layer:
1. In the Outliner, click the **Data Layers** button
2. Create a new layer
3. Select actors and assign them to a layer

---

## Part 3: HLOD (Hierarchical Level of Detail)

### What Is HLOD?

When you look at a mountain range from 5 kilometers away, you do not need to see every individual rock and tree on those mountains. A simplified silhouette is enough. HLOD replaces distant objects with simplified proxy meshes, dramatically reducing draw calls and triangle count.

Without HLOD, your GPU tries to render every actor in every loaded cell at full detail. With HLOD, distant cells show a single merged mesh that looks correct from far away and swaps to the detailed version only when the player gets close.

### How HLOD Works in UE5

UE5's HLOD system:

1. **Generates proxy meshes** by merging all actors in a grid cell (or a cluster of cells) into a single simplified mesh
2. **Generates proxy materials** by baking textures from the original materials into atlas textures
3. **Swaps automatically**: When a cell is far from the player, the HLOD proxy is shown. When the player approaches, the proxy is hidden and the real actors stream in.

### Setting Up HLOD for Tabletop Quest

1. In World Settings, under **World Partition > HLOD**, enable HLOD
2. Set the HLOD layer:
   - **Cell Size**: Typically 2x or 4x the runtime grid cell size (so each HLOD cell covers a larger area)
   - **Loading Range**: Larger than the runtime loading range (so HLOD is visible beyond the detailed streaming range)
3. Build HLODs: **Build > Build HLODs** from the menu bar

After building, you will see simplified meshes in the World Partition Editor's HLOD view.

### HLOD for the Tabletop View

Here is where HLOD connects directly to Tabletop Quest's signature feature. The tabletop view is essentially the ultimate HLOD: the entire world seen from above as simplified miniatures. You can leverage the HLOD system to generate the "miniature" version of the world that appears on the tabletop.

The tabletop miniatures (tiny buildings, painted terrain) could be:

1. **Custom-authored**: Hand-made miniature meshes that replace the real buildings at tabletop distance (highest quality, most work)
2. **HLOD-generated with a custom material**: Use the HLOD system to generate simplified meshes, then apply a "painted miniature" material that makes them look like they are on a tabletop (best balance of effort and quality)
3. **Render-to-texture**: Use a Scene Capture from above to render the world onto the tabletop map texture (simplest, used for the minimap already)

Option 2 is the most interesting for Tabletop Quest. The HLOD proxy of a town already looks like a miniature version of the town. Apply a material that adds a painted-wood texture, softens the colors, and adds a slight diorama feel, and you have your tabletop miniature automatically generated from the real world geometry.

---

## Part 4: Building the Tabletop Quest World

### World Layout

Tabletop Quest's overworld (based on the GDD) needs:

- **Towns**: Starting tavern area, merchant village, a larger city
- **Wilderness**: Forest paths, mountain trails, river crossings
- **Dungeon entrances**: Cave mouths, ruined towers, crypts
- **Points of interest**: Shrines, abandoned camps, mysterious ruins
- **Roads/paths**: Connecting towns and locations

The tabletop map shows all of these as miniatures on a table. When the player selects a location and zooms in, they see it at full scale.

### Landscape Setup

UE5's Landscape system creates large-scale terrain:

1. **Create Landscape**: In the Modes panel, select Landscape mode
2. Set dimensions: For Tabletop Quest, start with a **2017 x 2017** landscape (roughly 2km x 2km). This is large enough for 3-5 distinct areas but small enough to manage as a solo developer.
3. Set section size and components based on your streaming needs
4. **Material**: Create a landscape material with multiple layers (grass, dirt, stone, snow, sand). Use a **Landscape Layer Blend** node to paint different surface types.

### Landscape Layers for Tabletop Quest

| Layer | Texture | Where Used |
|-------|---------|-----------|
| Grass | Green grass, wildflowers | Plains, meadows, town outskirts |
| Forest Floor | Dark soil, leaves, roots | Forest areas |
| Dirt Path | Hard-packed brown dirt | Roads, trails |
| Stone | Gray rock, slight moss | Mountain areas, cliff faces |
| Dungeon Stone | Dark stone, cracks, moisture | Near dungeon entrances |
| Sand | Beach sand, dry riverbed | River banks, desert edges |
| Snow | White with blue tint | Mountain peaks (if you have them) |

Paint these using the Landscape Paint tool. The material blends between them automatically at the edges.

### Foliage

Trees, grass, and bushes bring the world to life:

1. **Foliage Mode**: In the Modes panel, select Foliage
2. Add foliage types: trees (multiple species), grass, bushes, rocks, flowers
3. Configure per-type settings:
   - **Density**: How many per square meter
   - **Scale range**: Random scale variation for natural look
   - **Cull Distance**: How far before the foliage disappears (critical for performance)
   - **LOD**: Foliage should have multiple LOD levels (detailed up close, billboard at distance)

For Tabletop Quest forests:
- Dense canopy trees with 3 LOD levels
- Understory bushes with 2 LODs
- Ground cover grass using the **Nanite** system (if your hardware supports it) or traditional LOD with aggressive cull distance (50-100 meters)

### Town Construction

Towns in Tabletop Quest are where players talk to NPCs, buy equipment, accept quests, and rest. Build them with modular pieces:

1. Create or import **modular building pieces**: walls, floors, roofs, doors, windows, stairs
2. Snap them together to build structures: tavern, blacksmith, general store, inn, temple
3. Add interior details: tables, chairs, barrels, weapons racks, shelves, candles
4. Use **Blueprints** for functional elements: doors that open, shop interfaces, quest boards

Place buildings on the landscape, adjust terrain around them (flatten under buildings, add paths between them), and populate with NPC actors.

### Dungeon Entrances

Dungeon entrances are where the overworld connects to dungeon levels (which use Level Streaming, not World Partition). Each entrance needs:

1. **A visual landmark**: A cave mouth, a ruined tower entrance, a trapdoor in a crypt
2. **A trigger volume**: When the player enters, it begins loading the dungeon sub-level
3. **A transition area**: A short corridor or staircase that exists in both the overworld and the dungeon level, providing a seamless visual transition while the dungeon loads behind it

---

## Part 5: Level Streaming for Dungeons

### Why Level Streaming for Dungeons?

Dungeons in Tabletop Quest are contained environments. They have a clear entrance, a layout of rooms and corridors, and an exit. Unlike the continuous overworld, dungeons have discrete boundaries.

Level Streaming is better for dungeons because:

1. **Clear load/unload triggers**: Player enters the dungeon, load it. Player leaves, unload it.
2. **Isolated design**: Each dungeon is its own sub-level. You can work on the Goblin Caves without affecting the overworld.
3. **Separate NavMesh**: Dungeons have their own navigation mesh (tighter corridors, different AI pathfinding).
4. **Different lighting**: Dungeons use interior lighting (torches, magical glow) vs. the overworld's sun and sky.

### Setting Up a Dungeon Sub-Level

1. **Create a Sub-Level**: In the Levels panel (Window > Levels), click the plus icon and choose **Create New Level**. Name it something like `Dungeon_GoblinCaves`.
2. **Build the dungeon** in this sub-level: corridors, rooms, traps, enemies, loot chests, boss arena
3. **Position it**: The dungeon sub-level exists in the same world space as the overworld. Position it underground (negative Z) below the entrance, or offset it far from the overworld geometry.
4. **Create the entrance transition**: A short cave corridor that exists in BOTH the overworld and the dungeon sub-level. This overlap is intentional; it creates a seamless visual transition.

### Streaming Setup

1. In the Persistent Level, place a **Level Streaming Volume** around the dungeon entrance area
2. Set the volume's **Streaming Level** to your dungeon sub-level
3. Set **Initially Loaded** to false (dungeon does not load until the player approaches)
4. Set **Initially Visible** to false

When the player enters the volume, the dungeon begins loading. By the time they walk through the entrance corridor, the dungeon is fully loaded and ready. When they leave, it unloads.

### Dungeon Streaming Optimization

For larger dungeons with multiple rooms, you can use sub-level streaming within the dungeon itself:

- The entrance corridor and first room: always loaded when in the dungeon
- Each wing or floor: a separate sub-level that loads when the player approaches
- Boss room: loads when the player is one room away (preloading to avoid hitches during the boss intro cinematic)

### Dungeon Data for Tabletop Quest

Each dungeon in Tabletop Quest should have metadata:

```
S_DungeonData:
  - DungeonID (Name)
  - DisplayName (String): "Goblin Caves"
  - SubLevelName (Name): "Dungeon_GoblinCaves"
  - Difficulty (Int): 1-10 scale
  - RecommendedLevel (Int): Minimum party level
  - EnemyTypes (Array of Name): ["GoblinScout", "GoblinArcher", "GoblinShaman"]
  - BossType (Name): "GoblinChieftain"
  - LootTable (Name): "LT_GoblinCaves"
  - IsCleared (Bool): Whether the party has completed it
  - EntranceLocation (Vector): World position of the entrance
```

This data drives the tabletop view (showing difficulty indicators on dungeon entrances), the AI Dungeon Master (generating appropriate encounters), and the quest system.

---

## Part 6: The Tabletop-to-World Transition (Streaming Perspective)

### The Streaming Challenge

Tabletop Quest's signature zoom transition (from tabletop miniatures to full-scale 3D world) has a major streaming challenge. When the player is looking at the tabletop, only the miniature representations need to be loaded. When they zoom into a specific area, the full-detail version of that area needs to be loaded quickly enough that the 2.5-second transition is seamless.

### Preloading Strategy

When the player highlights an area on the tabletop (before zooming in), begin preloading:

1. The player hovers over a location on the tabletop map
2. A timer starts (0.5 seconds). If the player is still hovering after 0.5s, begin preloading that area
3. "Preloading" means: force-load the World Partition cells for that area using the streaming API
4. By the time the player confirms the zoom (clicks or presses a button), the area should be partially or fully loaded
5. During the 2.5-second zoom transition, finish loading any remaining actors

### Fallback: Loading Screen as Zoom

If the area is not fully loaded when the zoom starts (maybe the player zoomed instantly without hovering), the zoom animation itself acts as a disguised loading screen. The camera descends, the tabletop edges fade, terrain gains depth, and foliage spawns. If loading takes longer than expected, you can slow the zoom slightly (stretch 2.5 seconds to 3.5 seconds). The player perceives a dramatic transition, not a loading delay.

### Data Layers for the Transition

This is where Data Layers shine. During the tabletop view:

- `TabletopMiniatures` layer: Loaded (shows the miniature versions)
- `Landscape` layer: Loaded but at HLOD level (simplified terrain visible from above)
- All other layers: Unloaded (no NPCs, no enemies, no interiors)

During the zoom transition:

1. Begin loading `Foliage`, `Buildings`, `NPCs`, `Enemies` layers for the target area
2. Cross-fade the `TabletopMiniatures` layer to invisible
3. Cross-fade the real actors to visible
4. By zoom completion, all relevant layers are loaded and the miniature layer is hidden

During world exploration:

- `TabletopMiniatures` layer: Unloaded (save memory)
- All gameplay layers: Loaded within streaming range

---

## Part 7: Procedural Placement

### Filling the World Efficiently

A 2km x 2km world with towns, forests, and dungeons has thousands of objects: trees, rocks, bushes, grass, flowers, ruins, camps, mushrooms. Placing each one by hand is possible but tedious. UE5 offers several tools for procedural placement.

### PCG (Procedural Content Generation) Framework

UE5's PCG framework lets you create rules that generate content. Instead of placing 500 trees by hand, you define rules:

- "Place oak trees on grass terrain, spaced 3-8 meters apart, avoiding roads and buildings"
- "Place rocks on slopes steeper than 30 degrees"
- "Place mushrooms in clusters of 3-5 near tree roots"

To use PCG:

1. Create a **PCG Graph** asset
2. Add **Surface Sampler** nodes (generate points on surfaces)
3. Add **Filter** nodes (exclude points near roads, buildings, water)
4. Add **Density** nodes (control how many points survive)
5. Add **Spawner** nodes (place meshes at surviving points)
6. Attach the PCG Graph to a **PCG Volume** actor in your level
7. The PCG system generates placements within the volume

### PCG Rules for Tabletop Quest

| Rule | Generator | Filters | Output |
|------|-----------|---------|--------|
| Forest trees | Surface sampler, density 0.1 | Exclude roads (path spline buffer), exclude buildings (radius 10m), slope < 30 degrees | Oak, pine, birch meshes (random selection) |
| Undergrowth | Surface sampler, density 0.4 | Only where trees exist (proximity filter), exclude paths | Bushes, ferns, small plants |
| Road-side rocks | Spline sampler along road splines | Distance from spline: 2-5 meters | Small to medium rocks |
| Dungeon entrance debris | Point sampler near entrance | Radius 15m from entrance location | Broken stones, bones, spider webs |
| Town market stalls | Grid sampler in market area | Aligned to grid, avoiding building footprints | Stall meshes, crate stacks |

### Foliage Tool vs. PCG

The Foliage Tool (paint mode) is great for hand-crafted areas where you want artistic control. PCG is great for filling large areas with consistent rules. Use both:

- **Foliage Tool**: The town square, the approach to a dungeon, areas where precise placement matters
- **PCG**: The vast forest between towns, the grassy plains, the rocky mountainside

### Randomized but Deterministic

PCG placements use a **seed** value. The same seed produces the same placement every time. This means:

- Your world looks the same every time the game loads (no random forests shifting around)
- You can tweak rules and regenerate to see the result
- Different regions can use different seeds for variety while remaining reproducible

---

## Part 8: Optimization for Tabletop Quest

### The Performance Challenge

Tabletop Quest has a unique performance constraint: the player's PC is running UE5 (rendering, physics, AI, UI) AND a local LLM (Ollama, using 4-8GB of RAM and significant CPU/GPU for inference). The game needs to leave headroom for the AI Dungeon Master.

### Performance Budget

| System | Target Budget |
|--------|--------------|
| Rendering | 8-10ms per frame (60fps target) |
| AI (Behavior Trees, Perception) | 2-3ms per frame |
| Physics | 1-2ms per frame |
| Streaming (load/unload) | 1-2ms per frame |
| LLM headroom | 2-4GB RAM, async GPU inference |
| Total | 16ms per frame (60fps) |

### Optimization Techniques

**Nanite (Virtual Geometry)**

Nanite is UE5's system for rendering extremely detailed meshes efficiently. Instead of traditional LOD (where you create 3-4 versions of each mesh at different triangle counts), Nanite virtualizes geometry and renders only the triangles that are actually visible at the current camera distance and angle.

Enable Nanite on:
- Landscape terrain
- Building meshes
- Large rock formations
- Any static mesh with high triangle count

Do NOT use Nanite on:
- Skeletal meshes (characters, enemies: Nanite does not support skeletal meshes)
- Very small objects (the overhead is not worth it for a 100-triangle barrel)
- Test Nanite foliage on your target hardware before committing

**Lumen (Global Illumination)**

Lumen provides real-time global illumination and reflections. For Tabletop Quest:

- Use Lumen for the overworld (dynamic time of day, sun position changes, indirect lighting)
- Consider **baked lighting** for dungeons if Lumen is too expensive (dungeons have static lighting, so baked is fine and cheaper)

**Virtual Shadow Maps (VSM)**

VSMs replace traditional cascaded shadow maps with a system that produces consistent shadow quality at all distances. Enable VSM for the overworld. For dungeons, you may use fewer shadow-casting lights to save performance.

**Draw Call Reduction**

Every unique mesh-material combination in view is a draw call. Reduce draw calls by:
- Using **Instanced Static Meshes** for repeated objects (trees, rocks, grass)
- Using **Mesh Merge** for static objects in towns (merge all the wooden beams of a building into one mesh)
- Using **HLOD** for distant objects (already covered above)

**Occlusion Culling**

UE5 automatically skips rendering objects that are hidden behind other objects. For Tabletop Quest:
- Town buildings occlude their interiors (no cost to render inside until the player enters)
- Mountains occlude everything behind them
- Dungeon walls occlude adjacent rooms

You do not need to configure this manually in most cases, but you can add **Precomputed Visibility Volumes** in areas where automatic occlusion struggles (complex dungeon layouts with many overlapping corridors).

### Streaming Performance

World Partition streams cells asynchronously, but large cells with many actors can cause hitches when they load. To prevent this:

1. **Stagger loading**: Do not load all cells in a ring simultaneously. Load the one directly ahead of the player first.
2. **Reduce actor count per cell**: If a cell has 500 actors, consider splitting it or reducing density.
3. **Use Level Instances**: For repeated structures (a type of house that appears in multiple towns), use Level Instances. They share memory and load faster.
4. **Profile regularly**: Use `stat streaming` in the console to see streaming performance. If any cell takes more than 2ms to load, investigate.

---

## Part 9: World Composition for the Tabletop

### The Two-Scale World

Tabletop Quest's world exists at two scales. When building the overworld, think about both simultaneously:

**World Scale (1:1)**:
- A town square is 50m across
- A forest path is 3m wide
- A dungeon entrance is 5m wide
- An NPC is 1.8m tall
- Draw distance: 2-3km

**Tabletop Scale (miniatures)**:
- The same town square is 5cm across on the table
- The same forest is a cluster of tiny painted trees
- The same dungeon entrance is a little hole in a tiny hill
- An NPC is a painted figurine 2cm tall
- Viewed from 1m above the table

The HLOD system bridges these scales, but you may want to author some tabletop elements by hand for key locations (the starting tavern, major quest hubs) while using auto-generated proxies for wilderness areas.

### Fog of War on the Tabletop

When looking at the tabletop, unrevealed areas should be hidden. This connects to the minimap fog of war from Module 08 but at a larger scale.

Implementation:
1. Create a large plane above the tabletop that covers the entire map
2. Apply a material that uses a **render target texture** as its opacity mask
3. The texture starts fully opaque (black: everything hidden)
4. As the player explores areas in the world view, "paint" transparent circles on the render target at the corresponding tabletop positions
5. The fog clears permanently (exploration progress saves with the game)

This creates the classic board game experience: you can only see areas you have visited.

---

## Part 10: Python Automation for World Building

### Why Automate World Building?

Placing every tree, rock, and NPC by hand in a 2km x 2km world is possible but slow. Python scripts in UE5 can help with:

- Batch-placing actors from data files
- Generating and placing dungeon entrance markers
- Creating Data Tables for world locations
- Automating HLOD and streaming settings

### Batch Actor Placement

```python
import unreal
import json

def place_actors_from_data(json_path):
    """
    Reads location data from a JSON file and places actors in the level.
    """
    with open(json_path, 'r') as f:
        data = json.load(f)

    for poi in data["points_of_interest"]:
        name = poi["name"]
        location = unreal.Vector(poi["x"], poi["y"], poi["z"])
        poi_type = poi["type"]

        unreal.log(f"POI: {name} at ({poi['x']}, {poi['y']}, {poi['z']}) type: {poi_type}")
        # Spawn the appropriate actor class based on poi_type
```

### World Data JSON

Define your world layout in a JSON file that both the editor scripts and the game runtime can read:

```json
{
    "world_name": "Tabletop Quest - Act 1",
    "world_size": [200000, 200000],
    "points_of_interest": [
        {
            "name": "Starting Tavern",
            "type": "town",
            "x": 50000, "y": 50000, "z": 0,
            "difficulty": 0,
            "npcs": ["Tavern Keeper", "Blacksmith", "Quest Board"]
        },
        {
            "name": "Goblin Caves",
            "type": "dungeon_entrance",
            "x": 65000, "y": 45000, "z": 0,
            "difficulty": 3,
            "sub_level": "Dungeon_GoblinCaves",
            "boss": "Goblin Chieftain"
        },
        {
            "name": "Riverdale Village",
            "type": "town",
            "x": 80000, "y": 60000, "z": 0,
            "difficulty": 0,
            "npcs": ["Village Elder", "Herbalist", "Guard Captain"]
        },
        {
            "name": "Dragon's Lair",
            "type": "dungeon_entrance",
            "x": 120000, "y": 30000, "z": 500,
            "difficulty": 8,
            "sub_level": "Dungeon_DragonLair",
            "boss": "Ancient Dragon"
        }
    ],
    "paths": [
        {"from": "Starting Tavern", "to": "Goblin Caves", "type": "forest_path"},
        {"from": "Starting Tavern", "to": "Riverdale Village", "type": "road"},
        {"from": "Riverdale Village", "to": "Dragon's Lair", "type": "mountain_trail"}
    ]
}
```

Claude can help you generate this data file based on your game design, then you run a Python script to place markers, create splines for paths, and set up streaming volumes.

---

## Part 11: World Design Principles for RPGs

### Distance and Travel Time

In an open world RPG, travel time between locations matters. Too short and the world feels tiny. Too long and players get bored walking.

Guidelines for Tabletop Quest:

| Route | Distance | Walk Time | Feel |
|-------|----------|-----------|------|
| Tavern to nearest point of interest | 200-400m | 1-2 min | Quick, keep momentum |
| Town to dungeon entrance | 500-1000m | 3-5 min | Journey with encounters |
| Town to town | 1000-2000m | 5-10 min | Significant travel |
| Furthest points on the map | 2000-3000m | 10-15 min | Epic journey |

But remember: in Tabletop Quest, the player can also travel by selecting locations on the tabletop map and zooming in. Long-distance travel does not require walking the entire path. The walk times above are for when the player is exploring on foot within an area.

### Points of Interest Density

Place something interesting every 100-200 meters: a shrine, a hidden chest, a camp, a vista point, a mini-encounter, a herb gathering spot, a lore stone. The player should never walk for more than 1-2 minutes without seeing something worth investigating.

This does not mean every 100 meters has a combat encounter. Variety is key:

| Type | Frequency | Example |
|------|-----------|---------|
| Combat encounter | Every 300-500m | Goblin patrol, wandering beast |
| Resource node | Every 100-200m | Herb, mineral, wood |
| Lore discovery | Every 200-300m | Stone tablet, abandoned journal, ruins |
| Environmental puzzle | Every 500-1000m | Locked door, pressure plate, hidden path |
| NPC encounter | Every 500m (outside towns) | Traveler, merchant, lost villager |
| Vista/rest point | Every 400-600m | Cliff overlook, campfire spot |

### Guiding the Player

Open world games need to guide players without holding their hand:

- **Paths**: Visible dirt/stone paths lead to important locations. Players naturally follow paths.
- **Landmarks**: Tall, visible structures (towers, mountains, giant trees) serve as orientation points.
- **Lighting**: Points of interest glow subtly at night (campfire, magical light, lit windows). Players are drawn to light.
- **Verticality**: Place interesting things at high points. Players instinctively climb to see what is up there.
- **Sound**: A waterfall, a distant battle, music from a tavern. Sound draws players in a direction (you will build this in Module 10).

---

## Part 12: Testing the Open World

### Common World Issues

**Streaming pop-in**: Objects appear suddenly as the player approaches. Fix by increasing the loading range or using HLOD to show proxies before the real actors load.

**Z-fighting**: Two surfaces at the exact same height flicker. Common where landscape meets building foundations. Fix by raising the building slightly or using a decal to blend the transition.

**NavMesh gaps**: AI cannot pathfind across World Partition cell boundaries if the NavMesh is not configured to span cells. Enable **Runtime Generation** for NavMesh (Project Settings > Navigation Mesh > Runtime Generation = Dynamic).

**Performance cliffs**: The game runs at 60fps in most areas but drops to 30fps in one specific location. Usually caused by one cell having too many actors, too many draw calls, or a poorly optimized material. Use **stat unit**, **stat gpu**, and **stat streaming** to identify the bottleneck.

### Profiling Commands

| Console Command | What It Shows |
|----------------|--------------|
| `stat fps` | Current framerate |
| `stat unit` | Frame time breakdown (game, draw, GPU, RHIT) |
| `stat streaming` | Level streaming status and load times |
| `stat gpu` | GPU time per render pass |
| `stat scenerendering` | Draw calls, triangles, meshes |
| `stat foliage` | Foliage instance counts and cull stats |
| `stat memory` | Overall memory usage |

---

## Summary

Building the Tabletop Quest overworld involves three interlocking systems:

| System | Purpose | Tabletop Quest Use |
|--------|---------|-------------------|
| **World Partition** | Automatic grid-based streaming | Overworld terrain, towns, forests |
| **Level Streaming** | Manual sub-level loading | Dungeons, interiors |
| **HLOD** | Simplified distant geometry | World-to-miniature transition, distant terrain |
| **Data Layers** | Categorized actor streaming | Separate foliage from NPCs from miniatures |
| **PCG** | Procedural content placement | Forest filling, rock scattering, ground cover |
| **Landscape** | Large-scale terrain | The ground itself, painted with multiple surface types |
| **Nanite** | Efficient detailed rendering | Building meshes, terrain, large rocks |
| **Lumen** | Real-time global illumination | Overworld lighting, time of day |

The key insight is that Tabletop Quest's two-scale design (tabletop miniatures and full-scale world) maps naturally to UE5's streaming and LOD systems. The tabletop view is essentially a maximum-distance LOD. The zoom transition is a streaming operation dressed in a cinematic camera move. The technology and the game design reinforce each other.

In the next module, you will add the layer that makes all of this come alive: sound. Ambient forests, combat music, dungeon echoes, and the warm crackle of the tavern fireplace.
