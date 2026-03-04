# Module 9: Quiz - Level Streaming and World Partition

Test your understanding of level streaming, World Partition, and related systems. Choose the best answer for each question.

---

**Question 1: Why is level streaming necessary in a large game world?**

A) It makes textures look better by loading higher-resolution versions
B) It prevents the game from loading the entire world at once, which would exceed memory limits and destroy frame rates
C) It adds multiplayer functionality by streaming data between players
D) It compresses level files for faster downloads

<details>
<summary>Answer</summary>
B) Loading an entire large world at once would consume too much memory and force the GPU to process far more geometry than necessary. Streaming loads only the parts of the world the player is near, keeping memory usage and rendering costs manageable.
</details>

---

**Question 2: What is the difference between a persistent level and a sub-level?**

A) A persistent level is always loaded and contains core elements; sub-levels load and unload independently and contain specific areas
B) A persistent level is temporary; sub-levels are permanent
C) There is no difference; they are interchangeable terms
D) A persistent level can only contain logic; sub-levels can only contain geometry

<details>
<summary>Answer</summary>
A) The persistent level is always in memory and holds things like the player, game logic, global lighting, and core managers. Sub-levels contain specific areas (rooms, zones, regions) and can be loaded and unloaded independently to manage memory.
</details>

---

**Question 3: What is the purpose of overlapping Level Streaming Volumes between two adjacent rooms?**

A) It creates a visual transition effect between rooms
B) It ensures the next room is already loaded by the time the player reaches the doorway, preventing visible loading gaps
C) It duplicates actors in the overlap zone for redundancy
D) It triggers a loading screen automatically

<details>
<summary>Answer</summary>
B) By overlapping the streaming volumes, the next room begins loading while the player is still in the current room. This gives the system time to load assets asynchronously so the transition is seamless, with no blank spaces or loading hitches.
</details>

---

**Question 4: What does World Partition do differently from manual sub-level streaming?**

A) World Partition requires C++ programming; sub-levels use Blueprints
B) World Partition automatically divides the world into a grid of cells and handles loading/unloading based on distance from the player, removing the need for manual sub-levels and streaming volumes
C) World Partition only works for indoor environments
D) World Partition loads the entire world at once but hides distant objects

<details>
<summary>Answer</summary>
B) World Partition automatically creates a grid over the world, assigns actors to cells, and loads/unloads cells based on the player's distance. You just place actors as normal and the system handles streaming. Manual sub-levels require you to define the chunks and configure the loading logic yourself.
</details>

---

**Question 5: What is One File Per Actor (OFPA) in World Partition?**

A) A rule that limits each actor to one material
B) A system where each actor in the world is saved to its own file, enabling better collaboration and version control
C) A naming convention for actor Blueprints
D) A rendering technique that processes one actor per frame

<details>
<summary>Answer</summary>
B) OFPA saves each actor as an individual file instead of bundling the entire level into one file. This means team members can edit different parts of the world without conflicting, version control diffs are small, and the editor only loads nearby actors, keeping it responsive even in massive worlds.
</details>

---

**Question 6: What is HLOD and why is it useful?**

A) HLOD is a multiplayer protocol for synchronizing levels between clients
B) HLOD stands for Hierarchical Level of Detail; it creates simplified proxy meshes for distant objects so they remain visible without being loaded at full detail
C) HLOD is a lighting system that adjusts brightness based on distance
D) HLOD is a compression format for texture files

<details>
<summary>Answer</summary>
B) HLOD generates simplified versions of groups of actors. When objects are far away, the simplified proxy is shown instead of the full-detail meshes. This lets players see distant mountains, buildings, and forests without the memory and rendering cost of loading them fully.
</details>

---

**Question 7: In the "Load Stream Level" Blueprint node, what does the "Should Block on Load" parameter control?**

A) Whether the level blocks AI navigation
B) Whether the game freezes (synchronous load) or continues running (asynchronous load) while the level loads
C) Whether the level blocks light from passing through it
D) Whether the level blocks other levels from loading

<details>
<summary>Answer</summary>
B) When set to true, the game freezes until loading is complete (synchronous, like a loading screen). When set to false, loading happens in the background while gameplay continues (asynchronous, seamless). For smooth streaming, always set this to false unless you are behind a loading screen.
</details>

---

**Question 8: How do Data Layers differ from regular sub-levels?**

A) Data Layers cannot contain actors; they only store data
B) Data Layers group actors that load together based on game state (quest progress, time of day) regardless of physical location, while sub-levels represent physical areas
C) Data Layers are only available in World Partition; sub-levels work everywhere
D) Data Layers replace sub-levels entirely in UE5

<details>
<summary>Answer</summary>
B) Data Layers let you group actors by state rather than by location. A "Night" layer might add torches and nocturnal NPCs across the entire world, while a "Quest_Active" layer might add destroyed buildings in one area and new NPCs in another. Sub-levels are about physical chunks; Data Layers are about logical groupings.
</details>

---

**Question 9: In the DnD tabletop game, how does fog of war connect to level streaming?**

A) Fog of war replaces level streaming entirely
B) Unexplored rooms are not loaded (invisible), explored rooms are loaded but dimmed, and the current room is fully visible, with a fog texture masking the tabletop camera's render based on exploration state
C) Fog of war is purely a visual shader effect with no connection to streaming
D) Fog of war prevents sub-levels from loading until the player explicitly reveals them

<details>
<summary>Answer</summary>
B) The streaming system controls what exists in the scene (loaded vs unloaded). The fog of war texture controls what the tabletop camera shows (black for unexplored, grey for explored-but-not-visible, white for currently visible). Together, they create the effect of a DnD map that reveals itself as the party explores.
</details>

---

**Question 10: You notice that when the player walks through a doorway, there is a visible 0.5-second gap where the next room's geometry is missing before it pops in. What is the most likely fix?**

A) Increase the game's frame rate
B) Pre-load the next room earlier by extending the streaming volume overlap or loading it when the player enters the current room, giving the system more time to finish loading before the player reaches the doorway
C) Reduce the texture resolution of the next room
D) Disable HLOD for that room

<details>
<summary>Answer</summary>
B) The pop-in happens because loading starts too late. The fix is to trigger loading earlier: extend the streaming volume so it reaches further into the current room, or use Blueprint logic to load adjacent rooms as soon as the player enters the current room. The more lead time the system has, the smoother the transition.
</details>
