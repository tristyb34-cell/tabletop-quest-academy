# Module 01: Exercises

## Exercise 1: Install UE5 and Create a Blank Project

**Goal**: Get Unreal Engine 5 installed and running on your machine.

### Steps

1. Download and install the Epic Games Launcher from [unrealengine.com](https://www.unrealengine.com/).
2. In the launcher, go to the Unreal Engine tab and install the latest UE5 version.
3. Once installed, click "Launch" and create a new project using the "Blank" template.
4. Name the project `MyFirstProject`.
5. Choose "Blueprint" as the project type and "Desktop" as the target platform.
6. Click "Create" and wait for the editor to open.

### Success Criteria

- The UE5 editor opens without errors.
- You can see the viewport, outliner, details panel, and content browser.
- The project appears in your Epic Games Launcher library.

### Bonus

- Create a second project using the "Third Person" template. Notice how it comes pre-loaded with a character, animations, and a test level. Explore the differences between the blank and third person templates.

---

## Exercise 2: Navigate the Viewport

**Goal**: Get comfortable moving around in the 3D viewport.

### Steps

1. Open the Third Person template project (or any project with objects in the scene).
2. Practice each navigation method for at least 2 minutes:
   - **Right-click + WASD**: Fly through the scene. Adjust speed with the scroll wheel.
   - **Middle mouse + drag**: Pan the view left, right, up, and down.
   - **Scroll wheel**: Zoom in and out.
   - **Right-click + drag (without WASD)**: Rotate the camera in place.
3. Select any object in the scene and press **F** to focus the camera on it.
4. Switch to orthographic views using Alt + J (top), Alt + K (front), and Alt + H (side).
5. Switch back to perspective view.

### Success Criteria

- You can reach any part of the scene using fly navigation.
- You can focus on a specific actor with the F key.
- You understand the difference between perspective and orthographic views.

### Reflection Questions

- When would an orthographic (top-down) view be more useful than perspective?
- How does adjusting the camera speed help when working on both large landscapes and small detailed objects?

---

## Exercise 3: Place and Transform Actors

**Goal**: Learn to add objects to your level and manipulate them with translate, rotate, and scale.

### Steps

1. Open a Blank project (or clear out your existing level).
2. Open the "Place Actors" panel (use the top menu: Window > Place Actors if it is not visible).
3. Place a **Cube** into the viewport by dragging it from the Basic Shapes section.
4. With the cube selected:
   - Press **W** and drag the colored arrows to move it along each axis (red = X, green = Y, blue = Z).
   - Press **E** and drag the rotation rings to rotate it 45 degrees on the Z axis.
   - Press **R** and scale it to be twice as tall on the Z axis (non-uniform scale).
5. Check the Details panel. Manually type in these exact values:
   - Location: X = 0, Y = 200, Z = 100
   - Rotation: X = 0, Y = 0, Z = 45
   - Scale: X = 1, Y = 1, Z = 2
6. Place a **Sphere** and a **Cylinder** into the scene.
7. Arrange all three shapes into a simple "snowman" figure: large sphere at the bottom, cylinder in the middle, small sphere on top.

### Success Criteria

- You can place basic shapes from the Place Actors panel.
- You can switch between translate (W), rotate (E), and scale (R) tools.
- You can type exact values into the Details panel for precise positioning.
- Your snowman figure is assembled with all three shapes stacked correctly.

### Bonus

- Enable grid snapping (Ctrl while moving) and rebuild the snowman with all pieces aligned to a 10-unit grid.

---

## Exercise 4: Create a Simple Landscape

**Goal**: Create terrain using the Landscape tool and sculpt basic features.

### Steps

1. Create a new Blank level (File > New Level > Empty Open World or Basic).
2. Switch to the Landscape mode in the Modes panel (or press Shift + 2).
3. In the "Manage" tab, leave the default settings and click "Create."
4. A flat green landscape will appear. Switch to the "Sculpt" tab.
5. Practice these sculpting operations:
   - **Sculpt tool**: Left-click to raise terrain. Create a small hill.
   - **Shift + left-click**: Lower terrain. Create a valley next to your hill.
   - **Smooth tool**: Select the smooth tool and paint over the edges of your hill to soften them.
   - **Flatten tool**: Select flatten and paint an area to create a flat plateau.
6. Adjust your brush size (larger brush for broad strokes, smaller for details).
7. Create a simple terrain layout: one hill, one valley, and one flat area.
8. Add a Directional Light and a Sky Atmosphere to your level so you can see the terrain properly.

### Success Criteria

- A landscape exists in your level.
- You have sculpted at least one hill, one valley, and one flat area.
- The terrain has smooth, natural-looking transitions (not blocky or harsh).
- Lighting is in place so the terrain is clearly visible.

### Reflection Questions

- How does brush size affect the look of your terrain?
- Why is the smooth tool important after sculpting?

---

## Exercise 5: Package a Build

**Goal**: Export your project as a standalone application that runs outside the editor.

### Steps

1. Open any project that has content in it (your snowman scene or landscape).
2. Go to Project Settings (Edit > Project Settings).
3. Under "Maps & Modes," set the "Game Default Map" to your current level.
4. Under "Project > Description," give your project a name.
5. Save all assets (Ctrl + Shift + S).
6. Go to Platforms > Windows > Package Project (or your platform of choice).
7. Choose an output folder on your desktop or a dedicated builds folder.
8. Wait for the packaging process to complete. Watch the output log for errors.
9. Once complete, navigate to the output folder and run the executable.

### Success Criteria

- The packaging process completes without errors.
- You can find and run the standalone .exe file.
- The game launches and shows your level.
- You can close the game with Alt + F4 or the escape key.

### Troubleshooting Tips

- If packaging fails, check the output log (Window > Output Log) for red error messages.
- Common fixes: save all assets, fix any Blueprint errors, make sure the default map is set.
- A "Launch" test (Play > Launch on Device) is faster than full packaging for quick checks.

### Bonus

- Package for a different platform configuration (Shipping vs Development). Notice the difference in file size and the absence of debug tools in the Shipping build.
