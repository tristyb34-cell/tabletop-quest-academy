# Module 9: Exercises - Level Streaming and World Partition

## Exercise 1: Two Sub-Levels with Manual Streaming

**Objective:** Create a persistent level with two sub-levels that load and unload as the player moves between them.

**Steps:**

1. Create a new level called `L_StreamingTest`. This is your persistent level. Add:
   - A Player Start
   - A directional light and skybox
   - A flat floor plane large enough for two rooms
   - A NavMesh Bounds Volume covering the entire area

2. Open the **Levels** window (Window > Levels). Create two new sub-levels:
   - `SubLevel_RoomA`: Build a simple room with walls, a floor, some props (tables, barrels), and a point light. Place it on the left side of the persistent level's floor.
   - `SubLevel_RoomB`: Build a different room with its own props and lighting. Place it on the right side, connected to Room A by a short corridor.

3. Place two **Box Triggers** in the persistent level:
   - `Trigger_EnterRoomA`: Positioned inside Room A's entrance
   - `Trigger_EnterRoomB`: Positioned inside Room B's entrance

4. In the persistent level's Level Blueprint, handle the triggers:

   **Trigger_EnterRoomA On Begin Overlap:**
   - Load Stream Level: "SubLevel_RoomA" (Make Visible After Load: true)
   - Set a 3-second delay, then Unload Stream Level: "SubLevel_RoomB"

   **Trigger_EnterRoomB On Begin Overlap:**
   - Load Stream Level: "SubLevel_RoomB" (Make Visible After Load: true)
   - Set a 3-second delay, then Unload Stream Level: "SubLevel_RoomA"

5. Start with only the persistent level loaded (both sub-levels toggled off in the Levels panel for runtime). Place the player start in the corridor between rooms.

6. Press Play. Walk into Room A and verify it loads. Walk into Room B and verify Room A unloads after the delay.

**Bonus Challenge:** Add a third sub-level (Room C) connected to Room B. Implement a rule: only 2 sub-levels can be loaded at once. When loading Room C, if both Room A and Room B are loaded, unload the one the player is farthest from.

**What You Learn:** The fundamentals of sub-levels, Load/Unload Stream Level Blueprint nodes, trigger-based streaming, and the concept of delayed unloading to prevent loading hitches.

---

## Exercise 2: World Partition for an Open Area

**Objective:** Set up World Partition for an outdoor area and observe automatic cell-based streaming.

**Steps:**

1. Create a new level with **World Partition enabled** (check the option in the New Level dialog). Name it `L_WorldPartitionTest`.

2. Create a large landscape or flat terrain (at least 4km x 4km). This gives World Partition enough space to demonstrate grid-based streaming.

3. Populate the world with actors spread across the terrain:
   - Scatter 50-100 static meshes (trees, rocks, buildings) across the entire area
   - Place them in distinct clusters so you can visually tell which cell you are looking at
   - Add a few point lights in different areas

4. Open **World Settings > World Partition > Runtime Settings**:
   - Set the **Cell Size** to 256m (a reasonable default for testing)
   - Set the **Loading Range** to 512m (so roughly 2 cells in each direction load)

5. Add a player start near one edge of the world.

6. Press Play and walk (or fly) across the terrain. Observe:
   - Actors appearing as you approach (cells loading)
   - Actors disappearing behind you (cells unloading)
   - Open the console and type `stat levels` to see which cells are currently loaded

7. Experiment with different Cell Size and Loading Range values:
   - Halve the cell size to 128m. Notice more frequent loading/unloading.
   - Double the loading range to 1024m. Notice more cells staying loaded (higher memory, fewer pop-ins).

**Bonus Challenge:** Open the **World Partition** editor window (Window > World Partition). This shows the grid layout with colored cells. Double-click a cell to teleport to it in the editor. Use this view to understand how actors are distributed across cells.

**What You Learn:** World Partition setup, cell size and loading range tuning, observing automatic streaming behavior, and understanding the tradeoff between memory usage and visual pop-in.

---

## Exercise 3: Streaming Distances and HLOD

**Objective:** Configure HLOD so that distant parts of the world show simplified proxy meshes instead of disappearing entirely.

**Steps:**

1. Open your World Partition level from Exercise 2 (or create a new one).

2. Place several groups of detailed meshes in different areas:
   - Group A: 10 buildings with many details (windows, doors, balconies). Collectively about 50,000 triangles.
   - Group B: A dense forest of 30 trees with full leaf meshes. Collectively about 100,000 triangles.
   - Group C: A rocky outcrop made of 15 rock meshes. About 30,000 triangles total.

3. Open **World Settings > World Partition > HLOD**:
   - Set up an HLOD Layer
   - Choose the simplification method: **Mesh Merge + Simplify** (combines meshes and reduces triangles)
   - Set the target triangle percentage (e.g., 10% of original)

4. Build HLODs: In the Levels window or World Partition window, trigger the HLOD build. This generates simplified proxy meshes for each cell.

5. Configure ranges:
   - **Loading Range** (full detail): 512m
   - **HLOD Loading Range** (proxy meshes): 2048m
   - Actors beyond 2048m: not visible at all

6. Test by walking around. Observe:
   - Close range (within 512m): Full-detail meshes visible
   - Medium range (512m to 2048m): Simplified HLOD proxies visible (lower triangle count, merged textures)
   - Far range (beyond 2048m): Nothing visible

7. Use the console command `stat HLOD` to see HLOD statistics during play.

**Bonus Challenge:** Create a custom HLOD layer for the buildings group that uses a different simplification strategy (e.g., Mesh Approximation, which creates a simple box-like shape). Compare how it looks versus the default simplification at distance. The goal is to find the right balance between visual quality and performance savings.

**What You Learn:** HLOD configuration, building proxy meshes, understanding the LOD distance pipeline (full detail > HLOD > culled), and the visual/performance tradeoff of different simplification methods.

---

## Exercise 4: Dungeon Rooms That Stream

**Objective:** Build a small dungeon with 4 rooms that stream in and out as the party moves through, managed by a DungeonManager Blueprint.

**Steps:**

1. Create a persistent level `L_DungeonTest` with:
   - A Player Start
   - Global lighting
   - A flat collision floor (the dungeon will float above it or you can skip the visible floor and let rooms provide their own)

2. Create 4 sub-levels:
   - `Dungeon_Entrance`: A starting room with a door leading north
   - `Dungeon_HallA`: A hallway with doors leading east and west
   - `Dungeon_TreasureRoom`: A room to the east with a chest
   - `Dungeon_BossRoom`: A room to the west with a boss arena

3. Create a Blueprint actor `BP_DungeonManager` and place it in the persistent level. Add these variables:
   - `RoomConnections` (Map of String to Array of Strings):
     - "Entrance" -> ["HallA"]
     - "HallA" -> ["Entrance", "TreasureRoom", "BossRoom"]
     - "TreasureRoom" -> ["HallA"]
     - "BossRoom" -> ["HallA"]
   - `CurrentRoom` (String)
   - `LoadedRooms` (Array of Strings)
   - `MaxLoadedRooms` (Int, set to 3)

4. Create a function `EnterRoom(RoomName)`:
   - Set `CurrentRoom` to `RoomName`
   - Get the connected rooms from `RoomConnections`
   - Load the current room and all connected rooms (if not already loaded)
   - Unload any loaded rooms that are not the current room or an adjacent room
   - Respect `MaxLoadedRooms`: if loading a new room would exceed the max, unload the oldest non-adjacent room first
   - Print the currently loaded rooms to screen for debugging

5. Place **Box Triggers** at each room's entrance in the persistent level. Each trigger calls `DungeonManager.EnterRoom("RoomName")` on overlap.

6. Add visual feedback: when a room finishes loading, briefly flash the screen border green. When a room unloads, flash it red. This helps you see the streaming in action during testing.

7. Test: Start in the Entrance. Walk to HallA (Entrance + HallA + TreasureRoom + BossRoom should attempt to load, capped at 3). Walk to TreasureRoom (HallA stays, Entrance might unload). Walk back and verify rooms reload correctly.

**Bonus Challenge:** Add a `RoomVisitHistory` array that tracks which rooms the player has visited. If a room has been visited before, load it 0.5 seconds faster (pre-load it when the player enters an adjacent room). If it has never been visited, add a 1-second fake "door opening" animation to mask the load time.

**What You Learn:** Managing multiple sub-levels with a central controller, connection-based streaming (only load what is adjacent), memory budgets with max loaded rooms, and practical dungeon streaming architecture.

---

## Exercise 5: Fog of War on the Tabletop

**Objective:** Create a fog of war system that shows explored rooms on the tabletop view while hiding unexplored areas.

**Steps:**

1. Set up the tabletop camera:
   - Create a **Scene Capture Component 2D** positioned above the dungeon, looking straight down
   - Set it to capture the dungeon area into a **Render Target** texture
   - Create a plane mesh (the "tabletop") in the persistent level and apply a material that displays the Render Target

2. Create a **Fog of War Render Target**:
   - Resolution: 256x256 (each pixel represents a small area of the dungeon)
   - Format: B8G8R8A8 (so you can use the alpha or a color channel for visibility)
   - Initialize it to all black (everything hidden)

3. Create a **Material** for the tabletop surface:
   - Input 1: Scene Capture Render Target (the actual dungeon view from above)
   - Input 2: Fog of War Render Target (the visibility mask)
   - Multiply them: where fog is black, the scene is hidden. Where fog is white, the scene is visible. Where fog is grey, the scene is dimmed.
   - Output to Emissive (so the tabletop glows with the scene image)

4. Create a Blueprint function `RevealArea(WorldPosition, Radius)`:
   - Convert the world position to UV coordinates on the Fog of War texture
   - Draw a white circle at those coordinates with the given radius
   - Use the **Draw Material to Render Target** or **Canvas** approach to paint onto the texture

5. Create a Blueprint function `DimArea(WorldPosition, Radius)`:
   - Same as RevealArea but paints grey instead of white
   - Call this when the player leaves a room (it has been explored but is no longer directly visible)

6. Integrate with the DungeonManager from Exercise 4:
   - When the player enters a room: call `RevealArea` for all tiles in that room
   - When the player leaves a room: call `DimArea` for that room's tiles
   - Rooms never visited stay black

7. Test from the tabletop view:
   - Start: The entire tabletop is black
   - Enter the Entrance: The entrance area lights up
   - Move to HallA: The Entrance dims to grey, HallA lights up
   - Move to TreasureRoom: HallA dims, TreasureRoom lights up
   - The tabletop now shows a grey explored map with a bright "you are here" area

**Bonus Challenge:** Add line-of-sight-based fog of war. Instead of revealing the entire room at once, reveal only the tiles the player can actually see (using raycasts from the player's position). Tiles behind pillars or around corners stay dark until the player moves to see them. This creates a more authentic DnD fog of war experience where even a room you are currently in might have hidden corners.

**What You Learn:** Render Targets as data textures, material-based masking, painting to textures at runtime, integrating streaming state with visual feedback, and the core fog of war technique that ties the tabletop view to the 3D world state.
