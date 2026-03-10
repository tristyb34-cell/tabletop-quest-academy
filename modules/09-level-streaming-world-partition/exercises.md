# Module 09: Exercises - The Open World

## Exercise 1: Create a 4km x 4km Landscape with Varied Terrain

**Goal:** Build the ground your open world sits on, with hills, valleys, and a mountain area.

**What you will do:**

1. Ask Claude:
   > "Walk me through creating a new level in UE5 with World Partition enabled and a 4km x 4km Landscape. I want a reasonable resolution for performance. Also explain what settings I should use for the Landscape component count and section size."

2. Claude will guide you through the level creation wizard and the Landscape tool setup. Follow the steps to create your terrain.

3. Now sculpt the terrain. Ask Claude:
   > "Write me a Python script for UE5 that modifies the landscape heightmap to create: (a) A mountain range along the northern edge of the map. (b) Rolling hills in the centre. (c) A flat lowland area in the south-east for the swamp region. (d) A relatively flat area in the south-west for the starting town."

4. Paste the script and watch the terrain take shape. If the results need tweaking, describe what you want changed and Claude will adjust the script.

5. After the scripted terrain is in place, use the Landscape Sculpt tool by hand to refine. Smooth out any harsh edges. Add a few extra details: a cliff face here, a gentle slope there. The script does the heavy lifting; you do the artistic polish.

6. Paint the landscape materials. Ask Claude:
   > "Help me set up a Landscape Layer Blend material with 4 layers: grass, rock, dirt, and snow. Use Megascans materials if available, or simple placeholder colours. Then walk me through painting the layers onto the terrain: grass on the lowlands, rock on the mountains and cliffs, dirt on paths and the swamp area, snow on the mountain peaks."

7. Verify by flying around the level in the editor. You should see a varied landscape with distinct regions.

**You know it is working when:**
- The landscape spans a visibly large area (4km x 4km)
- Mountains are clearly visible along the north
- The terrain has natural-looking variation (not flat, not random)
- Different ground materials are visible in different regions
- You can fly around the editor viewport and see distinct areas: mountains, hills, plains, swamp

---

## Exercise 2: Scatter 1000 Trees and Rocks with a Python Script

**Goal:** Populate the landscape with foliage using automated placement.

**What you will do:**

1. First, you need tree and rock assets. Ask Claude:
   > "What free tree and rock assets are available in UE5's Starter Content or through Megascans/Quixel Bridge? Help me import a few tree meshes and rock meshes into my project."

2. Once you have at least one tree mesh and one rock mesh imported, ask Claude:
   > "Write me a Python script for UE5 that scatters foliage across my landscape. Place 600 trees in the centre-north area (the forest region, roughly between Y=0 to Y=2000 and X=-1500 to X=1500). Place 400 rocks scattered across the mountain area (northern edge). Each tree should have random scale between 0.8 and 1.3, and random Z-rotation. Each rock should have random scale between 0.5 and 2.0. Make sure everything is placed on the landscape surface, not floating in the air."

3. Paste the script. Within seconds, your forest should fill with trees and your mountains should be dotted with boulders.

4. Fly around and inspect the result. Some trees might be in odd spots (clipping through each other, floating above a cliff edge). That is normal with automated placement. You can delete outliers by hand or ask Claude to refine the script with additional rules (like "no trees on slopes steeper than 45 degrees").

5. Add variety. Ask Claude:
   > "Update the script to use 3 different tree meshes (mixed randomly) instead of one, so the forest does not look like a tree farm. Also add 200 bush meshes scattered under the trees for ground cover."

6. Run the updated script. The forest should now look much more natural with variety in tree species and undergrowth.

**You know it is working when:**
- The forest area is visibly dense with trees
- Mountains have rocks and boulders
- Trees and rocks are varied in size and rotation (not identical copies)
- Foliage sits on the landscape surface, not floating
- The placement looks organic, not grid-like

---

## Exercise 3: Build a Town and a Streaming Dungeon Entrance

**Goal:** Create a small town using Python-placed buildings, and a dungeon entrance that loads a separate level when the player approaches.

**What you will do:**

1. For the town, you need building meshes. Ask Claude:
   > "Help me find free medieval/fantasy building assets for UE5. I need at least a house mesh, a tavern mesh (or larger building), and a market stall mesh. Point me to the Marketplace free content or Megascans."

2. Once you have building assets, ask Claude:
   > "Write me a Python script for UE5 that places a small town in the south-west area of my map (around position X=-1500, Y=-1500). Place 6 houses in a rough circle, a larger tavern building in the centre, 3 market stalls along a road, and a few barrel/crate props scattered around. Rotate buildings to face toward the town centre."

3. Paste the script. A town should appear in your landscape. Fly around and adjust anything that looks off (a building sunk into a hill, a stall floating above the ground). Ask Claude to adjust positions if needed.

4. Now create the dungeon. Ask Claude:
   > "Walk me through creating a dungeon as a separate sub-level in UE5. I want a simple room (20m x 20m) with walls, a floor, and some torches. It should be a Level that I can stream into my main open world level."

5. Follow Claude's instructions to create the dungeon sub-level.

6. Now set up the streaming. Ask Claude:
   > "Help me set up Level Streaming for my dungeon. I need: (a) A door/cave entrance mesh placed in the open world at the edge of the mountain area. (b) A Level Streaming Volume near the entrance that loads the dungeon sub-level when the player gets close. (c) A way for the player to transition from the open world into the dungeon interior."

7. Test it: run the game, walk toward the dungeon entrance, and verify that the dungeon loads as you approach. Walk through the entrance and confirm you can enter the dungeon space. Walk away and verify it unloads.

**You know it is working when:**
- The town has multiple buildings arranged in a believable layout
- The dungeon entrance is visible in the open world
- Approaching the entrance loads the dungeon level (check the streaming debug display)
- Walking away unloads it
- The transition between open world and dungeon feels smooth
- World Partition is handling the open world cells automatically (areas far from the player are unloaded)
