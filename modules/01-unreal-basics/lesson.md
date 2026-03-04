# Module 01: Getting Started with Unreal Engine 5

## Introduction

Unreal Engine 5 is one of the most powerful game engines in the world, and it is completely free to download and use. Whether you want to build a tabletop RPG experience, a sprawling open world, or a simple interactive scene, UE5 gives you the tools to make it happen. This lesson walks you through everything you need to get started, from installation to packaging your first build.

Think of Unreal Engine as a film studio. It gives you the cameras, the lights, the sets, and even the actors. Your job is to be the director.

---

## Installing Unreal Engine 5

### Step 1: Get the Epic Games Launcher

Before you can use Unreal Engine, you need the Epic Games Launcher. This is your gateway, like an app store specifically for Epic's tools and games.

1. Go to [unrealengine.com](https://www.unrealengine.com/) and click "Download."
2. Install the Epic Games Launcher on your system.
3. Create an Epic Games account if you do not already have one.

### Step 2: Install the Engine

1. Open the Epic Games Launcher and navigate to the "Unreal Engine" tab on the left sidebar.
2. Click "Library" at the top.
3. Click the "+" button next to "Engine Versions" to add a new engine installation.
4. Select the latest UE5 version (e.g., 5.4 or 5.5) and click "Install."
5. Choose your install directory. The engine is large, typically 50 to 100 GB, so make sure you have space.

### Step 3: Create Your First Project

1. Click "Launch" on your installed engine version.
2. The Unreal Project Browser will open. Select a template (start with "Blank" or "Third Person").
3. Choose your project settings: Blueprint or C++, target platform, quality preset.
4. Name your project and pick a save location.
5. Click "Create" and wait for the editor to open.

You now have a working Unreal Engine 5 project. Time to explore.

---

## The Editor Layout

When UE5 opens, you will see several panels. Each one has a specific job. Think of the editor like a cockpit: every screen and dial gives you different information about your game world.

### The Viewport

The viewport is your window into the game world. It is a live 3D view of your level, and it is where you will spend most of your time. You can orbit, pan, and zoom to look at your scene from any angle. When you hit "Play," the viewport becomes the game itself.

### The Outliner (World Outliner)

The outliner is like a backstage roster. It lists every single object (called an "Actor") that exists in your current level. If something is in your world, it shows up here. You can select actors by clicking their names, organize them into folders, and search for specific ones.

### The Details Panel

When you select an actor in the viewport or outliner, the details panel shows you everything about it: its position, rotation, scale, material, physics settings, and more. Think of this as the actor's "character sheet" in a tabletop RPG. Every stat, every property, every configuration lives here.

### The Content Browser

The content browser is your filing cabinet. It shows all the assets in your project: meshes, textures, materials, Blueprints, sounds, and anything else you have imported or created. You drag assets from the content browser into the viewport to place them in your world.

### The Toolbar

The toolbar runs along the top of the editor and contains essential buttons: Save, Play, Build Lighting, and more. The "Play" button (or press Alt+P) is what lets you test your game instantly.

### The Modes Panel

The modes panel gives you access to special placement and editing tools, such as the Landscape tool for terrain, the Foliage tool for scattering trees and grass, and the Geometry tool for simple shapes.

---

## Navigating the 3D Viewport

Moving around in the viewport is essential. If you cannot navigate, you cannot build. Here are the core controls:

### Mouse Navigation

- **Right-click + drag**: Look around (rotate the camera).
- **Right-click + WASD**: Fly through the scene like a first-person game. This is the most common way to move.
- **Middle mouse button + drag**: Pan the view (slide left/right, up/down).
- **Scroll wheel**: Zoom in and out.

### Speed Control

While holding right-click and using WASD, scroll the mouse wheel to adjust your movement speed. In large levels, you will want to move fast. In detailed areas, slow down.

### Focus on an Object

Select an actor and press **F** to focus the camera on it. This centers the viewport on that object and is incredibly useful when you lose track of something in a big scene.

### Orthographic Views

Press Alt + J/K/H to switch to top, front, and side orthographic views. These flat views are helpful for precise alignment, like looking at a blueprint drawing of your level.

---

## Placing and Transforming Actors

An actor is anything that exists in your level. A light is an actor. A static mesh (3D model) is an actor. A camera is an actor. Think of actors as props on a stage: they are the things that make up your scene.

### Placing Actors

There are several ways to add actors to your level:

1. **Drag from Content Browser**: Find a mesh or Blueprint in your content browser and drag it into the viewport.
2. **Place Actors Panel**: Use the "Place Actors" panel (accessed via the toolbar or Window menu) to add lights, cameras, volumes, and basic shapes.
3. **Right-click in Viewport**: Right-click in the viewport and select "Place Actor" for common types.

### The Transform Tools

Once an actor is in your level, you will want to move, rotate, and scale it. These three operations are called transforms.

- **W key (Translate/Move)**: Activates the move tool. Colored arrows appear on the actor: red for X, green for Y, blue for Z. Drag an arrow to move the actor along that axis.
- **E key (Rotate)**: Activates the rotation tool. Colored rings appear. Drag a ring to spin the actor around that axis.
- **R key (Scale)**: Activates the scale tool. Drag the handles to make the actor bigger or smaller. Drag the center cube to scale uniformly on all axes.

### Snapping

Press and hold Ctrl while transforming to snap to a grid. This is useful for aligning walls, floors, and other structured geometry. You can adjust the snap increment in the toolbar.

### Pivot Points

The pivot point is the origin around which an actor rotates and scales. By default, it is at the actor's center (or its defined origin). You can temporarily adjust it by holding Alt + middle mouse button.

---

## The Concept of Levels and Maps

A "level" in Unreal Engine is a single map file. It contains all the actors, lighting, and settings for one area of your game. Think of a level as one chapter in a book, or one room in a board game.

### Working with Levels

- You can have one level or hundreds. Large games use "level streaming" to load and unload levels dynamically as the player moves through the world.
- Each level is saved as a `.umap` file in your content browser.
- The "Persistent Level" is the base level that is always loaded. Sub-levels can be streamed in and out.

### World Partition (UE5 Feature)

UE5 introduced World Partition, which automatically divides your world into a grid and streams cells in and out based on the player's position. This is how massive open worlds work without loading screens.

### The Level Blueprint

Every level has its own Blueprint (visual script) for level-specific logic. This is where you might script a cutscene trigger, open a door when the player enters an area, or set up a gameplay sequence unique to that map.

---

## Basic Landscape Creation

Landscapes are how you create terrain: rolling hills, mountains, valleys, and flat plains. Think of the landscape tool as a digital sandbox where you sculpt the ground itself.

### Creating a Landscape

1. Go to the Modes panel and select "Landscape."
2. In the "Manage" tab, click "Create" to generate a new landscape.
3. Set the size (number of sections and quads per section). Start small, like 8x8 sections, for learning.
4. Click "Create" and a flat green plane will appear in your level.

### Sculpting

Switch to the "Sculpt" tab in the landscape tool. Here you can:

- **Sculpt**: Raise or lower terrain by painting on it with your mouse. Left-click raises, Shift + left-click lowers.
- **Smooth**: Blend sharp edges into gentle slopes.
- **Flatten**: Force terrain to a specific height.
- **Erosion/Noise**: Add natural-looking variation.

Adjust your brush size and strength to control how much terrain you affect with each stroke.

### Painting Materials

Switch to the "Paint" tab to apply different materials (grass, dirt, rock) to your landscape. You will need a landscape material with multiple layers set up. For beginners, use the starter content materials or download free landscape materials from the Unreal Marketplace.

---

## Lighting Basics

Lighting makes or breaks the look of your game. Even a simple scene looks stunning with good lighting, and even a beautiful scene looks flat without it.

### Directional Light

The directional light simulates the sun. It casts parallel rays across your entire level, as if the light source is infinitely far away (which the sun effectively is). Every outdoor scene needs one.

- Rotate the directional light to change the time of day. Pointing it straight down simulates noon. Angling it low simulates sunrise or sunset.
- Adjust the intensity and color to set the mood. Warm orange for golden hour, cool blue for overcast.

### Sky Light

The sky light captures the ambient light from your sky and applies it as soft, indirect illumination across your scene. Without it, shadows are pitch black. With it, everything gets a gentle fill light, just like how real-world objects in shadow are still visible because light bounces off the sky and surroundings.

### Sky Atmosphere and Volumetric Clouds

UE5 includes a Sky Atmosphere actor that simulates realistic atmospheric scattering (the reason the sky is blue and sunsets are orange). Pair it with Volumetric Clouds for photorealistic skies.

### Lumen (UE5 Global Illumination)

Lumen is UE5's real-time global illumination system. It simulates how light bounces off surfaces and illuminates other surfaces. A red wall will cast a subtle red glow on a nearby white floor. This happens automatically in UE5 with Lumen enabled, and it is one of the engine's biggest visual upgrades.

### Post Process Volume

A post process volume lets you tweak the final look of your scene: bloom, exposure, color grading, motion blur, depth of field, and more. Place one in your level and set it to "Infinite Extent (Unbound)" to affect the entire level, or leave it bounded to affect only a specific area.

---

## Packaging a Build

When you are ready to share your project or test it outside the editor, you "package" it into a standalone executable.

### Steps to Package

1. Go to **Platforms** in the top menu bar (or File > Package Project in older versions).
2. Select your target platform (Windows, Mac, Linux, etc.).
3. Choose a folder for the output.
4. Wait for the build process to complete. This can take a while, especially the first time, because the engine compiles shaders, cooks assets, and optimizes everything.

### Before You Package

- **Build Lighting**: If you are using baked lighting (not Lumen), build your lighting first via the toolbar.
- **Set Your Default Map**: In Project Settings > Maps & Modes, set the "Game Default Map" to your main level. Otherwise the packaged game might open to a blank screen.
- **Check Project Settings**: Make sure your project name, description, and icon are set under Project Settings > Project > Description.
- **Test with "Launch"**: Before doing a full package, use the "Launch" button for a quick standalone test. This is faster and helps catch issues early.

### Common Packaging Errors

- **Missing cooked content**: Make sure all referenced assets are saved and inside your project folder.
- **Shader compilation failures**: Usually caused by broken materials. Check the output log.
- **Blueprint compile errors**: Any Blueprint with errors will fail packaging. Fix all Blueprint warnings first.

---

## Summary

In this lesson you learned:

- How to install UE5 and create a project.
- The five main editor panels and what each one does.
- How to navigate the 3D viewport with mouse and keyboard.
- How to place actors and transform them with translate, rotate, and scale.
- What levels are and how they organize your game world.
- How to create and sculpt a landscape.
- The fundamentals of lighting: directional light, sky light, Lumen, and post processing.
- How to package your project into a standalone build.

You now have the foundation. Everything else in Unreal Engine builds on these basics. In the next module, you will learn Blueprints, the visual scripting system that brings your game to life.
