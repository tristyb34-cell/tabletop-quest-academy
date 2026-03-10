# Module 01: Your First Game World

## Welcome, Adventurer

You are about to build a game. Not "learn some theory and maybe build something later." Right now. Today. By the end of this lesson, you will have a room in Unreal Engine 5 with walls, a floor, a light, and a fantasy character standing in it. This is the first room of your DnD-inspired RPG, Tabletop Quest.

Think of Unreal Engine as a massive film studio. It has cameras, lights, sets, props, and actors. Your job is to be the director. You point, you decide, you make creative calls. And for the technical heavy lifting? That is what Claude (your AI assistant) is for. Claude writes code. You paste it, test it, and steer the creative vision.

Let's get the studio set up.

---

## Step 1: Install Unreal Engine 5.7

Before you can build anything, you need the engine itself. This is a one-time setup that takes about an hour (mostly waiting for downloads).

1. Go to [unrealengine.com](https://www.unrealengine.com/) and click "Download."
2. Install the **Epic Games Launcher**. Think of this as the app store for everything Epic makes.
3. Create a free Epic Games account if you do not have one.
4. In the launcher, go to the **Unreal Engine** tab, then **Library**.
5. Click the **+** button next to "Engine Versions" and select **5.7**.
6. Click **Install**. The engine is around 50-100 GB, so make sure you have space and a decent internet connection. Go grab a coffee.

Once installed, click **Launch** on version 5.7.

---

## Step 2: Create the Tabletop Quest Project

The Project Browser opens. This is where every UE5 journey begins.

1. Select the **Third Person** template. This gives you a character you can walk around with immediately, which is far more fun than staring at an empty void.
2. Choose **Blueprint** as the project type (not C++).
3. Name it `TabletopQuest`.
4. Pick a save location you will remember.
5. Click **Create**.

The editor opens. Welcome to your game studio.

---

## Step 3: Learn the Viewport (Your Window Into the World)

The big 3D view in the centre of the screen is called the **viewport**. This is your window into the game world. Right now it shows the default Third Person level, a simple room with a mannequin.

Moving around the viewport works like flying a drone:

- **Right-click + WASD**: Fly through the scene. W = forward, S = back, A = left, D = right.
- **Right-click + mouse movement**: Look around while flying.
- **Scroll wheel** (while holding right-click): Speed up or slow down your flight.
- **Middle mouse + drag**: Pan the camera sideways or up/down.
- **F key** (with something selected): Snap the camera to focus on that object. Extremely useful when you lose something in a big scene.

Spend two minutes just flying around. Get comfortable. This is how you will navigate every level you ever build.

---

## Step 4: What Are Actors?

Everything you see in the viewport is an **Actor**. The floor? Actor. The light? Actor. The mannequin? Actor. That weird sphere in the corner? Also an actor.

Think of Actors like chess pieces on a board. Each one has a position, a role, and properties. Some are visible (like a treasure chest). Some are invisible (like a trigger zone that detects when a player walks through a doorway). But they are all Actors, and they all live in the **World Outliner**, the panel on the right that lists every Actor in your level like a backstage roster.

Click on any Actor name in the World Outliner. The **Details Panel** below it shows all of that Actor's properties: its position, rotation, scale, materials, and settings. This is the Actor's character sheet, just like in a tabletop RPG.

---

## Step 5: The Python Console (Your Secret Weapon)

Here is where things get interesting. Unreal Engine has a built-in Python console. This lets you run scripts that create, move, and modify Actors automatically, instead of dragging things around by hand.

Why does this matter? Because Claude can write Python scripts for you. You describe what you want. Claude writes the script. You paste it into the console. Things appear in your world. It is like having a construction crew that builds whatever you describe.

To open the Python console:

1. Go to **Edit > Editor Preferences**.
2. Search for "Python" and make sure the **Python Editor Script Plugin** is enabled. Restart the editor if prompted.
3. Go to **Window > Developer Tools > Output Log**.
4. At the bottom of the Output Log, change the dropdown from "Cmd" to **"Python"**.

Now you have a Python input field. Let's use it.

---

## Step 6: Your First Python Script (Build a Room)

Ask Claude to write a script that creates a simple room. Here is what a basic room-creation script looks like (you would get this from Claude, but here is a simplified example so you understand the concept):

```python
import unreal

# Get the editor subsystem for spawning actors
editor = unreal.EditorLevelLibrary

# Create a floor (scaled cube)
floor = editor.spawn_actor_from_class(unreal.StaticMeshActor, unreal.Vector(0, 0, 0))
floor.set_actor_label("Floor")
floor.static_mesh_component.set_static_mesh(
    unreal.load_asset("/Engine/BasicShapes/Cube")
)
floor.set_actor_scale3d(unreal.Vector(10, 10, 0.1))

# Create four walls
wall_positions = [
    (unreal.Vector(0, 500, 250), unreal.Vector(10, 0.1, 5)),
    (unreal.Vector(0, -500, 250), unreal.Vector(10, 0.1, 5)),
    (unreal.Vector(500, 0, 250), unreal.Vector(0.1, 10, 5)),
    (unreal.Vector(-500, 0, 250), unreal.Vector(0.1, 10, 5)),
]

for i, (pos, scale) in enumerate(wall_positions):
    wall = editor.spawn_actor_from_class(unreal.StaticMeshActor, pos)
    wall.set_actor_label(f"Wall_{i+1}")
    wall.static_mesh_component.set_static_mesh(
        unreal.load_asset("/Engine/BasicShapes/Cube")
    )
    wall.set_actor_scale3d(scale)

# Add a point light
light = editor.spawn_actor_from_class(unreal.PointLight, unreal.Vector(0, 0, 400))
light.set_actor_label("RoomLight")
light.point_light_component.set_intensity(5000)

print("Room created!")
```

Paste this into the Python console and press Enter. A room appears in your viewport. A floor, four walls, and a light. You just built your first game environment with code.

The shapes are plain white cubes right now. That is fine. We will make everything beautiful in Module 05. Right now, focus on the magic: you described a room, and it appeared.

---

## Step 7: Download a Fantasy Asset Pack from Fab

Your room needs some personality. Epic's **Fab** marketplace (formerly the Unreal Marketplace) has thousands of free asset packs.

1. In the Epic Games Launcher, go to the **Fab** tab (or visit [fab.com](https://www.fab.com/)).
2. Search for free fantasy assets. Good starter packs include:
   - "Infinity Blade" assets (free, high-quality fantasy props)
   - "Stylized Fantasy Provencal" or similar free environment packs
   - Any free medieval/dungeon asset pack that catches your eye
3. Click **Add to My Library**, then in UE5, go to your **Content Drawer** and click **Add > Add Fab Content** to import it into your project.

Browse through the assets. You now have swords, torches, barrels, stone walls, and all sorts of fantasy props ready to place.

---

## Step 8: Place a Character Model Using Python

Let's put a character in your room. Once you have imported a fantasy asset pack, you can use Python to place any mesh from it. Ask Claude to write a placement script, or try something like this:

```python
import unreal

editor = unreal.EditorLevelLibrary

# Replace the path below with the actual path to a mesh in your asset pack
# You can find it by right-clicking the asset in Content Browser > Copy Reference
character = editor.spawn_actor_from_class(
    unreal.StaticMeshActor,
    unreal.Vector(0, 0, 10)
)
character.set_actor_label("HeroCharacter")
character.static_mesh_component.set_static_mesh(
    unreal.load_asset("/Game/InfinityBladeWarriors/Meshes/SM_CharacterModel")
)

print("Character placed!")
```

The exact asset path depends on what you downloaded. Right-click any asset in the Content Browser and select **Copy Reference** to get its path.

You now have a room with a character standing in it. This is the seed of your game world.

---

## What You Built Today

- Installed UE5.7 and created the Tabletop Quest project
- Learned to navigate the viewport like a drone pilot
- Understood that everything in your world is an Actor (like chess pieces on a board)
- Used the Python console to create a room with code
- Downloaded fantasy assets from Fab
- Placed a character model in your first room

This is not a tutorial exercise. This is the beginning of your game. Every module from here forward adds to this project. The room you built today will become a dungeon. The character will become a playable hero. The light will become a flickering torch.

Next up: Blueprints, where you make things actually happen. Doors that open. Chests that give you gold. Fire that hurts.
