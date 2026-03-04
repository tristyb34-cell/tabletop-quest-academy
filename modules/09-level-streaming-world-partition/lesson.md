# Module 9: Level Streaming and World Partition

## Introduction

Imagine trying to load an entire city into your computer's memory at once: every building, every street, every interior, every NPC, every piece of furniture. Your system would choke. This is the fundamental problem that level streaming solves. Instead of loading everything, you load only what the player can see and interact with right now, and you quietly load and unload the rest in the background.

For our DnD tabletop-to-3D RPG, streaming is critical for two reasons. First, the 3D world (dungeons, towns, wilderness) can be massive, and we need to manage memory. Second, the tabletop view shows a miniature version of the active area, which means we need fine control over what is visible and what is hidden behind fog of war. This module covers the tools UE5 gives you for both.

---

## Why Streaming Matters

### The Memory Problem

Every actor in your level consumes memory: meshes, textures, materials, collision data, audio sources, AI controllers, particle systems. A single detailed room might use 200MB. A dungeon with 30 rooms could easily consume 6GB, which is more than many systems can spare for just the level geometry, not counting characters, UI, audio, and engine overhead.

### The Performance Problem

Even if you had unlimited memory, rendering everything at once would destroy your frame rate. The GPU has to process every visible triangle. If all 30 dungeon rooms are loaded, the renderer has to consider all of them, even the ones behind walls that the player cannot see. Occlusion culling helps, but it has limits.

### The Solution: Load Only What You Need

Streaming means keeping only the relevant parts of the world in memory. As the player moves through the world, new areas load in ahead of them and old areas unload behind them. Done well, the player never notices. It feels like one continuous, seamless world.

---

## Sub-Levels: The Building Blocks

### What Is a Sub-Level?

A sub-level is a separate level file that loads into a persistent (main) level. Think of it like chapters in a book: the book (persistent level) always exists, but individual chapters (sub-levels) can be opened and closed independently.

In practice:
- **Persistent Level**: Contains things that are always present (the player, core game logic, the sky, global lighting)
- **Sub-Levels**: Contain specific areas (Dungeon Room 1, Dungeon Room 2, Town Square, Tavern Interior)

### Creating Sub-Levels

1. Open your main level in the editor
2. Open the **Levels** window (Window > Levels)
3. Click **Levels > Create New** to create a new sub-level
4. Name it descriptively (e.g., `Dungeon_Room_01`, `Town_Market_District`)
5. Double-click a sub-level to make it the "current" level for editing
6. Any actors you place while a sub-level is current belong to that sub-level
7. You can toggle sub-level visibility in the editor with the eye icon

### Moving Actors Between Levels

To move existing actors to a sub-level:
1. Select the actors in the viewport
2. Right-click > **Level > Move Selection to Level**
3. Choose the target sub-level

### Sub-Level Best Practices

- Keep each sub-level focused on one area or one purpose
- Do not have actors in one sub-level reference actors in another (they might not be loaded)
- Put shared logic (game mode, player controller, core managers) in the persistent level
- Name sub-levels clearly so the Level list does not become a mess

---

## Level Streaming Volumes

### What Are They?

Level Streaming Volumes are invisible trigger boxes in the persistent level. When the player enters the volume, it triggers a sub-level to load. When the player leaves, the sub-level unloads. Think of them like automatic doors: you walk toward them and the next room opens up, you walk away and it closes behind you.

### Setting Up a Streaming Volume

1. Place a **Level Streaming Volume** in your persistent level (from the Place Actors panel or the Volumes category)
2. Scale and position it to cover the area where the sub-level should be loaded
3. Open the **Levels** window
4. Select the sub-level you want to control
5. In its details, set the **Streaming Method** to "Blueprint" (so you have control) or keep it as the default
6. Assign the Level Streaming Volume to the sub-level

### Overlap Strategy

For smooth transitions, overlap your streaming volumes. If Room A and Room B are adjacent, their streaming volumes should overlap in the hallway connecting them. This ensures Room B is already loaded by the time the player walks through the door. Without overlap, the player might see a blank space or a loading hitch.

### Loading and Unloading Timing

- **Load**: Triggered when the player enters the volume. Loading happens asynchronously in the background. There might be a brief delay before the level is fully visible.
- **Unload**: Triggered when the player exits the volume. Unloading frees memory.
- **Should Be Visible**: Even after loading, a sub-level is not visible until explicitly shown. You can load it in advance (pre-caching) and then make it visible instantly when needed.

### Blueprint-Controlled Streaming

For more control, use Blueprints instead of volumes:

```
Load Stream Level (by Name)
  Level Name: "Dungeon_Room_05"
  Make Visible After Load: true
  Should Block on Load: false (async, no hitch)
```

```
Unload Stream Level (by Name)
  Level Name: "Dungeon_Room_03"
```

This approach is useful for our game because the Turn Manager or DM system might want to load a room based on narrative triggers, not just player position.

---

## World Partition: Automatic Open-World Streaming

### What Is World Partition?

World Partition is UE5's system for handling large open worlds. Instead of manually creating sub-levels and placing streaming volumes, World Partition automatically divides your world into a grid of cells and handles loading and unloading based on the player's position. Think of it like a satellite map that loads tiles as you scroll: you only see the area you are looking at, but the whole map exists.

### When to Use World Partition vs Sub-Levels

- **World Partition**: Best for large, open outdoor environments (overworld map, wilderness, towns)
- **Sub-Levels**: Best for interior spaces and hand-crafted areas (dungeons, buildings, instanced encounters)
- **Both**: You can combine them. Use World Partition for the outdoor world and sub-levels for interiors that need manual control.

### Enabling World Partition

1. When creating a new level, check **Enable World Partition** in the New Level dialog
2. For existing levels, go to **World Settings > World Partition** and enable it (note: this is a significant change to an existing level, so back up first)

### How It Works

Once enabled, World Partition:
1. Divides the world into a grid (configurable cell size, e.g., 128m x 128m)
2. Each cell contains the actors within that grid square
3. A **loading range** defines how far from the player cells stay loaded (e.g., 3 cells in each direction)
4. As the player moves, cells ahead load and cells behind unload
5. All of this happens automatically; you just place actors in the world as normal

### Grid Configuration

Open **World Settings > World Partition > Runtime Settings** to configure:
- **Cell Size**: How large each grid cell is. Smaller cells = more granular loading but more overhead. Larger cells = fewer transitions but larger memory chunks. 128m to 256m is typical.
- **Loading Range**: How far ahead of the player cells load. Increase this if the player moves fast or if you see pop-in. Decrease it to save memory.

### One File Per Actor (OFPA)

World Partition uses a system called One File Per Actor. Instead of the entire level being one file, each actor is saved to its own file. This has major benefits:
- **Team collaboration**: Multiple people can edit different parts of the world without conflicts
- **Version control**: Changes to individual actors result in small diffs, not entire level file changes
- **Selective loading**: The editor only loads the actors you are working near, keeping the editor fast even in massive worlds

---

## Data Layers

### What Are Data Layers?

Data Layers let you group actors that should load together, independent of the grid cells. Think of them like layers in a graphics program: you can show or hide a layer, and everything on it appears or disappears together.

### Use Cases

- **Time of Day**: A "Night" data layer that loads nighttime NPCs, torches, and ambient sounds
- **Quest State**: A "Quest_DragonAttack" layer that loads destroyed buildings, fire effects, and dragon NPCs when the quest is active
- **Seasonal Events**: A "Winter" layer with snow effects and holiday decorations
- **For Our Game**: A "CombatOverlay" data layer that loads grid tiles, height indicators, and cover markers only when combat is active

### Setting Up Data Layers

1. In the **Data Layers** panel, create a new layer
2. Select actors and assign them to the layer
3. In Blueprints, use **Set Data Layer Runtime State** to load/unload the layer

---

## HLOD: Hierarchical Level of Detail

### The Problem of Distance

When objects are far away, rendering them at full detail is wasteful. A building 2 kilometers away does not need 50,000 triangles; a simplified version with 500 triangles looks identical at that distance.

### What Is HLOD?

HLOD (Hierarchical Level of Detail) automatically creates simplified versions of groups of actors. At close range, you see the individual actors at full detail. At medium range, you see a simplified proxy mesh. At long range, you see an even simpler proxy, or the actors are culled entirely.

Think of it like a painting in an art gallery: from across the room, you see the overall shapes and colors. As you walk closer, the details become clear. HLOD is UE5's version of this.

### HLOD and World Partition

When World Partition is enabled, HLOD integrates directly:
1. The system generates HLOD proxy meshes for each grid cell
2. When a cell is outside the loading range but within the HLOD range, the proxy is shown instead of loading the full cell
3. This means you can see distant mountains, buildings, and terrain without loading them fully

### Configuring HLOD

In **World Settings > World Partition > HLOD**:
- **HLOD Layer**: Define the HLOD generation settings (simplification method, target triangle count)
- **Build HLODs**: Run the HLOD build process (this can take time for large worlds)
- **HLOD Loading Range**: Set how far HLOD proxies are visible (typically much farther than the full cell loading range)

---

## Streaming for the Tabletop Game

### The Dungeon Streaming Strategy

Our game has a unique requirement: the player views the action both from a first-person/third-person 3D perspective AND from an overhead tabletop perspective. This means streaming needs to serve both views.

**Dungeon rooms load as the party approaches:**
1. Each dungeon room is a sub-level
2. When the party is within 2 rooms of a new area, that area begins loading
3. When the party enters a room, it becomes fully visible
4. Rooms the party has left remain loaded (so the tabletop can show them) but can be unloaded if memory is tight

**The tabletop camera captures the loaded area:**
1. A Scene Capture Component (covered in Module 4) renders the dungeon from above
2. This render feeds into a material displayed on the tabletop surface
3. Only loaded and visible sub-levels appear in the capture
4. Unloaded rooms simply do not exist in the scene, so they naturally disappear from the tabletop view

### Fog of War Integration

Fog of war masks areas the party has not explored. Here is how it connects to streaming:

1. **Unexplored rooms**: Not loaded at all. The tabletop shows nothing (or a dark silhouette).
2. **Previously explored rooms**: Loaded but dimmed. A post-process material or overlay darkens them on the tabletop render. The party knows the layout but cannot see current enemy positions.
3. **Currently visible rooms**: Fully loaded and fully visible. The tabletop shows everything in real time.

### Implementation Approach

**Fog of War Texture:**
1. Create a render target texture the size of the dungeon grid (e.g., 64x64 pixels for a 64-tile dungeon)
2. Each pixel represents a tile. Black = unexplored, grey = explored but not visible, white = currently visible
3. Update the texture as the party moves: tiles within line of sight become white, tiles outside become grey
4. In the tabletop material, multiply the scene capture by the fog of war texture. Black pixels hide the scene completely; grey pixels darken it; white pixels show it fully.

**Loading Integration:**
1. Maintain a map of which rooms are loaded and their visibility state
2. When the party moves to a new room:
   - Load the new room's sub-level
   - Update the fog of war texture (new tiles become white)
   - Optionally unload distant rooms that are not needed
3. The tabletop camera continuously captures the scene, and the fog of war texture continuously masks it

---

## Streaming Best Practices

### Pre-Loading

Do not wait until the player is at the door to start loading the next room. Pre-load aggressively:
- If there are multiple exits from a room, load the rooms behind all of them
- Use narrative cues: when the DM says "You hear sounds from the north," start loading the northern room
- Load during dialogue or cutscenes, when the player is not moving

### Loading Screens vs Seamless Streaming

For most transitions, seamless streaming (no loading screen) is the goal. But for major transitions (entering a dungeon from the overworld, teleporting to a new region), a brief loading screen is acceptable and even expected.

Design your loading screens to be thematic: show the tabletop map zooming in, display a DnD-style flavor text, or show the DM's narration.

### Memory Budgets

Set a memory budget for loaded levels and stick to it:
- Track how much memory each sub-level uses (check the Memory Profiler in UE5)
- Set a maximum number of simultaneously loaded sub-levels
- When the budget is exceeded, unload the least-recently-visited sub-level
- Keep a priority system: the player's current room and adjacent rooms are highest priority

### Testing Streaming

- **Simulate distance**: Use the editor to teleport around and verify that levels load and unload correctly
- **Monitor memory**: Watch the memory stats (stat memory in console) as you move through the world
- **Check for hitches**: Frame time spikes during loading indicate that something is loading synchronously. Make sure all streaming is asynchronous.
- **Test from a fresh start**: Load-in-editor does not always match loading at runtime. Test with a packaged build.

---

## Level Streaming Blueprints in Detail

### Load Stream Level

```
Load Stream Level (by Name or by Soft Object Reference)
  Level Name: "Dungeon_Room_05"
  Make Visible After Load: true/false
  Should Block on Load: false (set to true only for loading screens)
  Latent Action: fires "Completed" when done
```

- **Make Visible After Load**: If true, the level appears as soon as it loads. If false, it loads into memory but stays hidden until you explicitly call **Set Level Visibility**.
- **Should Block on Load**: If true, the game freezes until loading is complete (synchronous). Use this only behind loading screens. For seamless streaming, always set this to false.

### Unload Stream Level

```
Unload Stream Level (by Name)
  Level Name: "Dungeon_Room_03"
  Latent Action: fires "Completed" when done
```

### Get Streaming Level

```
Get Streaming Level (by Name)
  Returns the ULevelStreaming object
  Check: Is Level Loaded, Is Level Visible
  Call: Set Should Be Loaded, Set Should Be Visible
```

This is useful for querying the current state of a sub-level before making decisions.

---

## Practical Example: Dungeon with 5 Rooms

Here is a complete setup for a small dungeon:

### Level Structure
```
PersistentLevel (always loaded)
  - Player Start
  - Directional Light (global)
  - Sky and atmosphere
  - DungeonManager (Blueprint actor)
  - NavMesh Bounds Volume (covers entire dungeon area)

Dungeon_Entrance (sub-level)
  - Entrance geometry, torches, door

Dungeon_Room_01 (sub-level)
  - Room geometry, props, 2 enemy spawners

Dungeon_Room_02 (sub-level)
  - Room geometry, treasure chest, trap trigger

Dungeon_Room_03 (sub-level)
  - Room geometry, NPC (quest giver), ambient audio

Dungeon_Boss_Room (sub-level)
  - Boss room geometry, boss spawner, loot altar
```

### DungeonManager Blueprint Logic

```
Variables:
  CurrentRoom (Name)
  LoadedRooms (Array of Names)
  RoomConnections (Map of Name to Array of Names)
    - "Entrance" -> ["Room_01"]
    - "Room_01" -> ["Entrance", "Room_02", "Room_03"]
    - "Room_02" -> ["Room_01"]
    - "Room_03" -> ["Room_01", "Boss_Room"]
    - "Boss_Room" -> ["Room_03"]

Function: OnPlayerEnterRoom(RoomName)
  Set CurrentRoom = RoomName

  // Load adjacent rooms
  For each connected room in RoomConnections[RoomName]:
    If not already in LoadedRooms:
      Load Stream Level (connected room name)
      Add to LoadedRooms

  // Unload distant rooms (more than 2 connections away)
  For each room in LoadedRooms:
    If room is not CurrentRoom AND room is not adjacent to CurrentRoom:
      Unload Stream Level (room name)
      Remove from LoadedRooms

  // Update fog of war
  Update Fog Of War Texture (reveal tiles in RoomName)
```

### Trigger Volumes

Place Box Triggers at each room entrance. When the player overlaps:
```
On Begin Overlap:
  DungeonManager -> OnPlayerEnterRoom("Room_02")
```

---

## Summary

Level streaming is about managing what exists in the game at any given moment:

| System | What It Does | Best For |
|--------|-------------|----------|
| Sub-Levels | Manually defined chunks of a level that load independently | Dungeons, interiors, hand-crafted areas |
| Streaming Volumes | Trigger boxes that load/unload sub-levels based on player position | Simple proximity-based streaming |
| Blueprint Streaming | Code-driven load/unload calls | Custom logic, narrative triggers, dungeon managers |
| World Partition | Automatic grid-based streaming for open worlds | Large outdoor environments |
| Data Layers | Grouped actors that load together by state | Quest states, time of day, combat overlays |
| HLOD | Simplified proxy meshes for distant objects | Maintaining distant visibility without full detail |

For our DnD RPG, the approach combines sub-levels for dungeon rooms with Blueprint-controlled streaming for narrative-driven loading, plus a fog of war system that uses the streaming state to control what the tabletop camera reveals. The result is a world that feels vast but never overwhelms the system.
