# Module 09: Exercises - The Open World

## Exercise 1: Set Up a World Partition Level with Landscape

**Goal:** Create the foundation for Tabletop Quest's overworld.

**What you are building:** A World Partition level with a painted landscape, basic foliage, and working cell streaming.

**Steps:**

1. Create a new level: **File > New Level > Open World** (this enables World Partition by default)
2. Open **World Settings** and configure World Partition:
   - Cell Size: 25600 (256m)
   - Loading Range: 51200 (512m, two cells ahead)
3. Switch to **Landscape Mode** and create a landscape:
   - Size: 2017 x 2017 (approximately 2km x 2km)
   - Section size: 63x63, 4 quads per section
4. Create a **Landscape Material** with at least 3 layers:
   - Grass (green, for meadows)
   - Dirt Path (brown, for roads)
   - Stone (gray, for mountain areas)
   - Use a Landscape Layer Blend node to blend between them
5. Paint the landscape: create a central meadow, a road running through it, and rocky areas at the edges
6. Switch to **Foliage Mode** and add at least 2 tree types. Paint a forest area.
7. Open the **World Partition Editor** (Window > World Partition) and observe how actors are distributed across cells
8. Play in Editor and walk around. Open the console and type `stat streaming` to monitor cell loading/unloading as you move.

**Success criteria:** The landscape displays with painted terrain layers. Trees appear in the forest area. The World Partition Editor shows actors distributed across grid cells. Walking around triggers cell streaming visible in stat output.

---

## Exercise 2: Build a Town with Modular Pieces

**Goal:** Construct the Starting Tavern area using modular building pieces.

**What you are building:** Tabletop Quest's first town, where the player begins their adventure.

**Steps:**

1. Download or create modular building pieces (walls, floors, roofs, doors). The free "Medieval Dungeon" or "Medieval Town" packs on the Marketplace work well for prototyping.
2. In your World Partition level, flatten a section of terrain for the town footprint (use the Flatten tool in Landscape mode)
3. Build 3-4 structures by snapping modular pieces together:
   - A tavern (largest building, identifiable by a sign or unique roof)
   - A blacksmith (with an outdoor forge area)
   - 2 small houses
4. Add paths between buildings using the Dirt Path landscape layer
5. Place props: barrels, crates, benches, a well in the town square, torch sconces on buildings
6. Add 3 placeholder NPC characters (use the mannequin, position them inside buildings or near the market)
7. Create **Data Layers**: put buildings in "Buildings", props in "Props", NPCs in "NPCs"
8. Verify in the World Partition Editor that actors are assigned to the correct Data Layers

**Success criteria:** A small but recognizable town exists on the landscape. Buildings are constructed from modular pieces. Actors are organized into Data Layers.

---

## Exercise 3: Create a Dungeon Using Level Streaming

**Goal:** Build a simple dungeon that loads when the player approaches the entrance.

**What you are building:** The Goblin Caves entrance, Tabletop Quest's first dungeon.

**Steps:**

1. In your overworld level, place a cave entrance mesh at the edge of the forest area
2. Create a new sub-level: **Window > Levels > + > Create New Level**, name it `Dungeon_GoblinCaves`
3. Switch to the dungeon sub-level and build:
   - A short entrance corridor (10m long, matching the overworld cave opening)
   - A main room (15m x 15m, with pillars and torches)
   - A branching corridor leading to a second smaller room
4. Position the dungeon underground (negative Z axis), aligning the entrance corridor with the overworld cave mouth
5. Add a **Level Streaming Volume** around the cave entrance in the persistent level
6. Configure the volume to stream `Dungeon_GoblinCaves`
7. Set Initially Loaded and Initially Visible to false
8. Add interior lighting to the dungeon (point lights for torches)
9. Play and walk toward the cave. The dungeon should load before you reach the entrance. Walk inside and verify the transition is seamless.

**Success criteria:** The dungeon loads automatically when approaching the entrance. Walking into the cave transitions smoothly from overworld to dungeon. Walking back out unloads the dungeon.

---

## Exercise 4: Set Up HLOD for Distant Terrain

**Goal:** Configure HLOD so that distant areas show simplified geometry.

**What you are building:** The system that makes distant parts of the Tabletop Quest world visible without tanking performance.

**Steps:**

1. In World Settings, enable HLOD under the World Partition section
2. Configure the HLOD layer:
   - Cell Size: 51200 (2x the runtime cell size)
   - Loading Range: 102400 (visible at greater distances than detailed cells)
3. Build HLODs: **Build > Build HLODs** from the menu bar
4. After building, open the World Partition Editor and switch to the HLOD view. You should see simplified proxy meshes.
5. Play in Editor and walk to the edge of the detailed streaming range. Look at distant areas. HLOD proxies should represent buildings and terrain features.
6. Temporarily reduce the runtime Loading Range (to 12800) to exaggerate the HLOD effect. Walk away from the town and watch it simplify.
7. Restore the Loading Range to 51200.

**Success criteria:** HLOD proxies are generated and visible at distances beyond the detailed streaming range. The transition from detailed to HLOD is smooth.

---

## Exercise 5: Procedural Forest with PCG

**Goal:** Use the PCG framework to fill a large forest area procedurally.

**What you are building:** The forest between the Starting Tavern and the Goblin Caves.

**Steps:**

1. Create a **PCG Graph** asset in the Content Browser
2. Build this pipeline in the PCG Graph editor:
   - **Surface Sampler**: Generate points on the landscape within the volume
   - **Density Filter**: Set to 0.15 (one tree attempt per ~7 square meters)
   - **Slope Filter**: Exclude points on slopes steeper than 30 degrees
   - **Distance Filter**: Exclude points within 10m of any actor tagged "Building" and within 3m of any spline tagged "Road"
   - **Static Mesh Spawner**: Randomly select from 3 tree meshes with scale variation 0.8-1.2
3. Add a second branch for undergrowth:
   - Higher density (0.4), only spawn near existing trees (within 8m), bush and fern meshes
4. Place a **PCG Volume** covering the forest area
5. Assign your PCG Graph and generate
6. Tag your road spline as "Road" and town buildings as "Building" so exclusion filters work
7. Regenerate and verify trees do not spawn on the road or inside buildings

**Success criteria:** A natural-looking forest fills the PCG Volume. Trees avoid roads and buildings. Undergrowth clusters near tree bases.

---

## Exercise 6: Implement Preloading for the Tabletop Zoom

**Goal:** Preload World Partition cells when hovering over a location on a simulated tabletop view.

**What you are building:** The streaming preparation for Tabletop Quest's signature zoom transition.

**Steps:**

1. Create a simple top-down camera view (position a camera 2000 units above the world, pointing straight down)
2. Add a key binding to switch between "tabletop view" (top-down camera) and "world view" (normal third-person)
3. In tabletop view, implement a hover system: the mouse cursor traces against the landscape. Show the location name in a UI widget when hovering over a known area.
4. When the player hovers for 0.5 seconds:
   - Identify which World Partition cells cover that area
   - Begin loading those cells
   - Show a subtle loading indicator on the UI
5. When the player clicks to "zoom in":
   - Animate the camera from top-down to third-person position
   - The destination area should be loaded by the time the camera arrives
6. Test: hover over the town area, click to zoom in, verify no pop-in during the transition.

**Success criteria:** Hovering begins preloading. Clicking triggers a camera transition. The destination is fully loaded by arrival. No visible streaming hitches.

---

## Exercise 7: Build a Complete Path Between Two Locations

**Goal:** Create a traversable path from the Starting Tavern to the Goblin Caves with points of interest.

**What you are building:** The first journey in Tabletop Quest.

**Steps:**

1. Create a **Spline Actor** tracing a path from the town to the dungeon entrance, following terrain contours
2. Along the spline, paint the Dirt Path landscape layer to create a visible road
3. Place points of interest every 150-200m along the path:
   - A small camp with a campfire and a lore note
   - A fork in the road with a signpost
   - A clearing with 2 placeholder enemy actors
   - A stream crossing with stepping stones
   - The Goblin Caves entrance
4. Use PCG or hand-placement to line the path with trees and rocks
5. Add resource nodes near the path (herb meshes, ore deposits)
6. Walk the path from start to end. Time it (should be 3-5 minutes).
7. Check that streaming works smoothly the entire way

**Success criteria:** A clear path connects the town to the dungeon. At least 4 points of interest along the route. 3-5 minute walk time. Seamless streaming throughout.

---

## Exercise 8: Performance Profiling and Optimization Pass

**Goal:** Profile your world and fix performance issues.

**What you are building:** A performance baseline for the Tabletop Quest overworld.

**Steps:**

1. Play in Editor and walk through the entire world
2. At each location (town, forest, path, dungeon), run:
   - `stat fps`
   - `stat unit`
   - `stat streaming`
   - `stat scenerendering`
3. Document results in a table:

   | Location | FPS | Game ms | Draw ms | GPU ms | Draw Calls | Triangles |
   |----------|-----|---------|---------|--------|------------|-----------|
   | Town | ? | ? | ? | ? | ? | ? |
   | Forest | ? | ? | ? | ? | ? | ? |
   | Open Path | ? | ? | ? | ? | ? | ? |
   | Dungeon | ? | ? | ? | ? | ? | ? |

4. Identify the worst-performing location
5. Apply optimizations:
   - High draw calls: merge static meshes, enable Nanite, reduce unique materials
   - High triangles: reduce foliage density, add LODs, increase cull distances
   - Slow streaming: reduce actors per cell, check for oversized meshes
   - High GPU time: reduce shadow-casting lights, simplify materials
6. Re-profile and document improvement

**Success criteria:** All locations run at 60fps or above. No streaming hitches exceed 2ms. Before and after performance numbers are documented.
