# Module 06: Exercises - The Camera and Controls

## Exercise 1: Set Up a Spring Arm Camera Following a Character

**Goal:** Get a smooth third-person camera working behind your player character.

**What you will do:**

1. Open your player character Blueprint (or create one if you have not yet). Ask Claude:
   > "Write me a Python script for UE5 that adds a Spring Arm and Camera component to my player character Blueprint. Set the arm length to 350, enable camera lag at speed 8, add a Target Offset of (0, 0, 60) so the camera sits above the character's centre, and enable collision testing."

2. Paste the Python script Claude gives you into UE5's Python console (Window > Developer Tools > Output Log, then switch to Python).

3. Open the Blueprint to verify the components are there. You should see a Spring Arm attached to the root, and a Camera attached to the Spring Arm.

4. Hit Play and walk around. The camera should follow your character with a slight floaty delay (that is the camera lag working).

5. Walk your character against a wall and notice how the camera moves closer instead of clipping through the geometry. That is the Spring Arm's collision doing its job.

6. Experiment: ask Claude to modify the Python script with different values. Try an arm length of 150 (very close, action game feel) and 800 (very far, strategy game feel). Try camera lag speed at 2 (heavy, cinematic) versus 20 (snappy, responsive).

**You know it is working when:**
- The camera orbits smoothly around the character with mouse movement
- The character walks in the direction of movement, not the camera direction
- The camera never clips through walls
- There is a smooth, cinematic lag as the camera follows

---

## Exercise 2: Two Camera Modes with a Key Press Toggle

**Goal:** Create a top-down tabletop camera and a third-person camera, and switch between them by pressing a key.

**What you will do:**

1. Ask Claude:
   > "Write me a Python script for UE5 that places a Camera Actor in my level, positioned 2000 units above the origin, pointing straight down. This will be my tabletop overhead camera. Name it TabletopCamera."

2. Paste the script to create the overhead camera.

3. Now ask Claude for a Blueprint setup:
   > "Create a Blueprint for a CameraDirector actor that holds a reference to the TabletopCamera actor and the player character. When the player presses F5, it should toggle between the character's third-person camera and the TabletopCamera using SetViewTargetWithBlend with a 2-second EaseInOut blend."

4. Claude will walk you through creating the Blueprint and wiring the nodes. Follow the steps, placing the CameraDirector in your level and setting the references.

5. Hit Play. Press F5. Watch the camera smoothly sweep from behind your character up to the overhead view. Press F5 again and watch it sweep back down.

6. Try adjusting the blend time. Ask Claude to change it to 0.5 seconds (fast cut) and then 4 seconds (slow cinematic). Notice how the timing changes the feel completely.

7. Optional: ask Claude to set the overhead camera to orthographic projection, so the top-down view looks flat like a board game map instead of having perspective distortion.

**You know it is working when:**
- Pressing F5 smoothly transitions between two very different camera angles
- The transition never snaps or jumps
- Pressing F5 mid-transition does not break anything (it starts a new blend from wherever the camera currently is)
- The top-down view gives a clear overhead look at the game board

---

## Exercise 3: The Tabletop-to-3D Zoom Transition

**Goal:** Implement the signature Tabletop Quest moment: the camera zooms from the overhead tabletop view down into a miniature, which transforms into a full 3D character.

**What you will do:**

1. Make sure you have a character (or placeholder mannequin) placed in the level that represents a miniature on the tabletop. Scale it down to about 0.2 if you want it to look like a small figurine from the overhead view.

2. Ask Claude:
   > "Create a Blueprint event sequence for the tabletop-to-3D transition in my game. When the player clicks a miniature from the overhead camera, it should: (a) Blend the camera from the TabletopCamera down to the character's third-person Spring Arm camera over 3 seconds using EaseInOut. (b) At the same time, animate the character's scale from 0.2 to 1.0 over the same 3 seconds using a Timeline. (c) Optionally, blend a material parameter from 0 to 1 to shift from a painted miniature look to realistic textures."

3. Claude will provide the Blueprint node setup step by step. Follow along, creating the Timeline, the SetViewTargetWithBlend call, and the scale lerp.

4. Hit Play. You should start in the overhead tabletop view. Click on the miniature (or press a test key). Watch the camera dive downward while the miniature grows into a full-sized character.

5. Now do the reverse. Ask Claude to add the reverse transition: pressing a key from third-person mode triggers the camera to pull back up to the tabletop while the character shrinks back to miniature scale.

6. Polish: ask Claude to add a slight camera shake at the moment the character reaches full size, as if the transformation released a burst of energy.

**You know it is working when:**
- The camera swoops smoothly from overhead down to behind the character
- The character visibly grows from miniature to full size during the transition
- The reverse transition works just as smoothly (character shrinks, camera pulls back up)
- The camera shake adds a satisfying punctuation mark at the end of the transformation
- The whole thing feels like one cohesive cinematic moment, not three separate animations happening at once
