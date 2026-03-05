## Viewport Controls

### Navigation Modes

#### WASD Flight Mode
Hold the **right mouse button** and use keyboard keys to fly through the viewport:

| Key | Action |
|-----|--------|
| `W` | Move forward |
| `S` | Move backward |
| `A` | Strafe left |
| `D` | Strafe right |
| `E` | Move up |
| `Q` | Move down |
| `C` | Zoom out (decrease FOV) |
| `Z` | Zoom in (increase FOV) |

Camera speed while flying:
- **Mouse scroll wheel** (while holding right-click): Adjust camera speed
- **Ctrl + 1** through **Ctrl + 8**: Set camera speed presets (1 = slowest, 8 = fastest)
- Camera speed slider available in the viewport toolbar (top-right)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Navigate tight dungeon corridors | Camera Speed: Ctrl+2 (slow) | Fly through narrow hallways and small rooms without overshooting walls |
| DnD RPG | Survey large caverns | Camera Speed: Ctrl+6 (fast) | Quickly traverse open dungeon areas like underground lakes or boss arenas |
| DnD RPG | Vertical dungeon shafts | Q/E for up/down movement | Navigate vertical shafts, staircases, and multi-floor dungeons efficiently |
| Wizard's Chess | Inspect piece details | Camera Speed: Ctrl+1 (slowest) | Carefully examine intricate chess piece models and their material details up close |
| Wizard's Chess | Overview of full board | Camera Speed: Ctrl+4 (medium) | Fly out to see the entire board layout when positioning pieces and decorations |

#### Orbit Mode
- **Alt + Left Mouse Button**: Orbit around the selected actor or the viewport pivot point
- **Alt + Right Mouse Button**: Dolly (zoom in/out toward pivot)
- **Alt + Middle Mouse Button**: Pan (track) the camera

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Orbit around a treasure chest | Alt+LMB with chest selected | Inspect a loot chest from all angles to check mesh alignment, particle attachment, and interaction prompts |
| DnD RPG | Dolly into dungeon doorway | Alt+RMB | Smoothly zoom toward a doorway to check the transition trigger volume placement |
| Wizard's Chess | Orbit around the board | Alt+LMB with board selected | Examine the chessboard from all angles to verify tile alignment, edge decorations, and material quality |
| Wizard's Chess | Inspect a piece from above | Alt+LMB with piece selected | Orbit around a single chess piece to check its crown detail, enchantment glow, and shadow casting |

#### Pan Mode
- **Middle Mouse Button + Drag**: Pan the viewport
- **Left + Right Mouse Buttons + Drag**: Pan the viewport (alternative)

#### Zoom
- **Mouse Scroll Wheel**: Zoom in and out (perspective) or change orthographic zoom level
- **Alt + Right Mouse Button + Drag**: Dolly zoom

#### Focus on Selection
- **F**: Frame the selected actor(s) in the viewport, centering the view and adjusting distance

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Jump to a specific enemy | Select BP_Goblin_03 in World Outliner, press F | Instantly focus on one goblin out of many in a crowded dungeon room |
| DnD RPG | Focus on a trap mechanism | Select BP_SpikeTrap, press F | Center the view on a spike trap to fine-tune its trigger volume and damage area |
| Wizard's Chess | Focus on a specific piece | Select BP_ChessPiece_Queen, press F | Snap directly to the Queen to adjust her enchantment glow or check her Niagara trail emitter |
| Wizard's Chess | Focus on the board center | Select the ChessBoard actor, press F | Return to the full board overview after editing a distant piece |

#### Teleport
- **Right-click on surface**: (In some configurations) Teleport the camera to a surface point

### Selection Tools

| Shortcut | Tool |
|----------|------|
| `Left Click` | Select a single actor |
| `Ctrl + Left Click` | Add to or remove from selection |
| `Shift + Left Click` | Add to selection |
| `Ctrl + Alt + Left Click` | Box select (drag to create a selection rectangle) |
| `Ctrl + A` | Select all actors in the level |
| `Escape` | Deselect all |
| `H` | Hide selected actors |
| `Ctrl + H` | Unhide all actors |
| `Ctrl + Shift + H` | Show only selected (hide all others) |

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Select all torches in a room | Ctrl+Click to add each BP_DungeonTorch to the selection | Multi-select all torches to batch-edit their light intensity and flicker rate |
| DnD RPG | Hide environment to focus on enemies | Select all enemies, Ctrl+Shift+H | Isolate enemy actors to check their placement, patrol paths, and collision without dungeon geometry in the way |
| DnD RPG | Hide enemies to focus on level design | Select enemies, press H | Temporarily hide all enemy actors while sculpting dungeon architecture |
| Wizard's Chess | Select all pieces of one color | Ctrl+Click each white piece | Multi-select all white pieces to batch-edit a shared material parameter or starting position |
| Wizard's Chess | Hide VFX to see geometry | Select all Niagara actors, press H | Temporarily hide magic trails and glow effects to focus on board tile placement |

### Transform Tools

#### Mode Switching

| Shortcut | Tool |
|----------|------|
| `W` | Translate (Move) tool |
| `E` | Rotate tool |
| `R` | Scale tool |
| `Space` | Cycle through Translate, Rotate, Scale |

#### Transform Space

| Shortcut | Action |
|----------|--------|
| `Ctrl + ~` | Toggle between World and Local coordinate space |

#### Transform Options
- **World Space**: Transform along world axes (absolute)
- **Local Space**: Transform along the actor's local axes (relative to its orientation)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Move dungeon tiles | W for Translate | Position modular dungeon floor, wall, and doorway tiles to build rooms |
| DnD RPG | Rotate props to face doorways | E for Rotate, Local Space | Rotate a treasure chest along its own local axis so the lid faces the player's approach direction |
| DnD RPG | Scale a boss enemy | R for Scale | Make a boss goblin 1.5x larger than regular goblins for visual distinction |
| DnD RPG | World vs Local for angled corridors | Ctrl+~ to toggle | Use World space for grid-aligned rooms, switch to Local space for angled tunnel sections |
| Wizard's Chess | Position pieces on tiles | W for Translate, World Space | Place pieces exactly on their starting tiles using world-axis movement |
| Wizard's Chess | Rotate a piece to face forward | E for Rotate | Turn each chess piece so its "front" faces the opponent's side of the board |
| Wizard's Chess | Scale decorative runes | R for Scale | Resize rune decals on the board to fit different tile areas |

#### Snapping

| Shortcut | Action |
|----------|--------|
| `Ctrl + Drag` | Snap to grid while translating |
| Grid Snap Toggle | Click the grid icon in the viewport toolbar |
| `[` | Decrease grid snap size |
| `]` | Increase grid snap size |
| `Shift + [` | Decrease rotation snap increment |
| `Shift + ]` | Increase rotation snap increment |

**Translation snap values**: 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000 units

**Rotation snap values**: 5, 10, 15, 22.5, 30, 45, 60, 90, 120 degrees

**Scale snap values**: 0.025, 0.05, 0.1, 0.25, 0.5

**Surface snapping**: Enable via the viewport toolbar snapping dropdown. Actors snap to the surface beneath them when moved. Optional normal alignment rotates the actor to match the surface angle.

**Vertex snapping**: Hold `V` while translating to snap the actor's pivot to the nearest vertex on another mesh.

**Socket snapping**: Snap actors to sockets defined on skeletal or static meshes.

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Snap dungeon tiles together | Grid Snap: 100 units | Modular dungeon pieces (1m grid) snap perfectly edge-to-edge with no gaps |
| DnD RPG | Rotate doors at 90 degrees | Rotation Snap: 90 degrees | Doors always align to the cardinal directions in a grid-based dungeon layout |
| DnD RPG | Fine-place wall decorations | Grid Snap: 5 units, or disable snapping | Position torches, banners, and sconces on walls with precision |
| DnD RPG | Snap weapon to hand socket | Socket snapping on character skeleton | Attach a sword mesh to the "hand_r" socket on the Warrior's skeletal mesh |
| DnD RPG | Vertex snap props to floors | Hold V while translating | Snap a barrel's bottom vertex exactly to the dungeon floor surface |
| Wizard's Chess | Snap pieces to tile centers | Grid Snap: 100 units (tile size) | Every chess piece sits perfectly centered on its tile, no manual adjustment needed |
| Wizard's Chess | Surface snap rune decals | Surface snapping: On, Normal Alignment: On | Snap rune decals flat onto the board surface, automatically aligning to the board's normal |
| Wizard's Chess | Fine-adjust decorations | Grid Snap: 1 unit | Precisely nudge small decorative elements on the board edge and surrounding arena |

### View Modes

Access via the **View Mode** dropdown in the top-left of the viewport toolbar, or use keyboard shortcuts:

| View Mode | Description |
|-----------|-------------|
| **Lit** | Full lighting, materials, and post-processing. The default view. |
| **Unlit** | Materials without any lighting calculations. Useful for checking texture work. |
| **Wireframe** | Mesh wireframes only, no surfaces or lighting. |
| **Detail Lighting** | Lighting only with a neutral gray material. Shows light contribution without material complexity. |
| **Lighting Only** | Shows only direct and indirect lighting on a white diffuse surface. |
| **Light Complexity** | Heat map showing how many lights affect each pixel. Green is cheap, red is expensive. |
| **Shader Complexity** | Heat map of pixel shader instruction counts. Green is simple, red is complex, white/pink is very expensive. |
| **Lightmap Density** | Heat map of lightmap texel density. Blue is low density, green is ideal, red is too dense. |
| **Stationary Light Overlap** | Shows overlap of stationary lights. Areas affected by more than 4 stationary lights turn red. |
| **Reflections** | Shows reflection captures and screen-space reflections in isolation. |
| **Buffer Visualization** | Sub-menu with options to view individual GBuffer channels: Base Color, Metallic, Roughness, Specular, World Normal, Ambient Occlusion, Custom Depth, Scene Depth, Subsurface Color, Opacity, Custom Stencil, and more. |
| **Nanite Visualization** | Visualize Nanite clusters, triangles, overdraw, and hierarchy depth. |
| **Lumen Visualization** | Visualize Lumen scene, probes, and ray-traced lighting. |
| **Virtual Shadow Map** | Visualize virtual shadow map pages and allocation. |
| **Path Tracing** | Full path-traced reference rendering (offline quality). |

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Check dungeon lighting | Detail Lighting mode | See pure light contribution on dungeon walls without material complexity, useful for balancing torch placement |
| DnD RPG | Optimize shader cost | Shader Complexity mode | Find expensive materials on dungeon props (glowing crystals, water surfaces) that need simplification |
| DnD RPG | Verify lightmap density | Lightmap Density mode | Ensure dungeon wall and floor lightmaps are not too dense (wasting memory) or too sparse (blotchy shadows) |
| DnD RPG | Check Nanite clusters | Nanite Visualization mode | Verify that high-poly dungeon cave meshes are being properly virtualized by Nanite |
| DnD RPG | Inspect GBuffer channels | Buffer Visualization: Base Color, Roughness, Metallic | Check that stone walls are rough, metal armor is metallic, and skin is the right base color |
| DnD RPG | Reference-quality screenshots | Path Tracing mode | Capture offline-quality screenshots of dungeon scenes for promotional materials |
| Wizard's Chess | Check texture work on pieces | Unlit mode | View chess piece materials without lighting to verify texture detail, UV mapping, and color accuracy |
| Wizard's Chess | Light overlap check | Stationary Light Overlap mode | Ensure the board does not have more than 4 overlapping stationary lights causing artifacts |
| Wizard's Chess | Reflection quality | Reflections mode | Isolate reflections on the polished marble board to check Lumen reflection accuracy |
| Wizard's Chess | Lumen probe placement | Lumen Visualization mode | Verify Lumen probe coverage under and around the chessboard for accurate indirect lighting |
| Wizard's Chess | Shadow map allocation | Virtual Shadow Map mode | Check that VSM pages are allocated efficiently for the many small chess piece shadows |

### Show Flags

Access via the **Show** dropdown in the viewport toolbar. Show flags toggle the visibility of specific categories of scene elements:

**Common Show Flags**:

| Category | Flags |
|----------|-------|
| **General** | Anti-Aliasing, Atmosphere, BSP, Collision, Decals, Fog, Grid, Landscape, Navigation, Paper2D, Particles/Niagara, Skeletal Meshes, Static Meshes, Translucency, Volumes, Widget Components |
| **Lighting** | Lighting Features, Lightmap, Light Radius, Dynamic Shadows, Shadow Frustums, Ambient Occlusion, Contact Shadows, Screen Space Reflections, Volumetric Fog, Light Functions, Light Complexity, Stationary Light Overlap |
| **Post Processing** | Bloom, Depth of Field, Eye Adaptation, Grain, HMD Distortion, Lens Flare, Motion Blur, Screen Percentage, Screen Space Reflections, Temporal AA, Tonemapper, Vignette |
| **Developer** | Bounds, Camera Frustums, Camera Aspect Ratio Bars, Constraints, Debug AI, Game Stats, Mass Properties, Nav Mesh, Splines, Selection, Streaming Bounds, Test Image, Vector Fields |
| **Advanced** | Audio Radius, Bones, Editor Sprites, Foliage, Grass, Instanced Static Meshes, LOD Coloration, Material Bounds, Merged Meshes, Shadow Map, Skin Cache, Texture Streaming, Virtual Texture Spaces |

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Toggle particles for performance | Show Flags: Particles/Niagara Off | Temporarily disable all Niagara systems (torch fire, spell VFX, ambient dust) when editing geometry |
| DnD RPG | Visualize nav mesh | Show Flags: Developer > Nav Mesh On | See the green navigation mesh overlay to verify enemy pathfinding routes through the dungeon |
| DnD RPG | Debug AI perception | Show Flags: Developer > Debug AI On | Visualize AI sight cones and hearing radii for dungeon enemies during testing |
| DnD RPG | Check collision volumes | Show Flags: General > Collision On | See collision wireframes on dungeon walls, doors, and invisible blocking volumes |
| DnD RPG | Hide post-processing for clarity | Show Flags: Post Processing > all Off | Strip bloom, DOF, and vignette while editing to see raw geometry and lighting |
| DnD RPG | Visualize audio radii | Show Flags: Advanced > Audio Radius On | See the attenuation spheres around dungeon sound sources (torches crackling, water dripping) |
| DnD RPG | Check skeleton bones | Show Flags: Advanced > Bones On | Visualize character skeleton bones to debug animation issues on the Warrior or Rogue |
| Wizard's Chess | Toggle decals on/off | Show Flags: General > Decals Off | Hide rune decals on the board to inspect the base marble material underneath |
| Wizard's Chess | Check fog interaction | Show Flags: General > Fog On/Off | Toggle volumetric fog to see the board with and without the mystical atmosphere |
| Wizard's Chess | View shadow frustums | Show Flags: Lighting > Shadow Frustums On | Check that the overhead light's shadow frustum covers the entire board without waste |

### Real-Time Toggle

- **Ctrl + R**: Toggle real-time rendering in the viewport. When disabled, the viewport only refreshes when the view changes, saving GPU resources when not actively working
- Also accessible via the **Realtime** button in the viewport top-left area

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Save GPU when reading docs | Ctrl+R to disable real-time | Stop rendering the dungeon viewport while you are writing GAS code or reading documentation, saving significant GPU power |
| DnD RPG | Re-enable for VFX preview | Ctrl+R to enable real-time | Turn rendering back on to see Niagara fire effects, animated water, and flickering torches |
| Wizard's Chess | Pause rendering during logic work | Ctrl+R to disable | Stop real-time rendering while writing chess AI logic or move validation code |
| Wizard's Chess | Enable for animation preview | Ctrl+R to enable | Turn it back on to preview piece slide animations and magic trail effects in the viewport |

### Camera Speed

- **Mouse Scroll** (while holding right-click): Dynamically adjust flight speed
- **Ctrl + 1** through **Ctrl + 8**: Camera speed presets
- **Viewport toolbar slider**: Drag to set exact camera speed (1 to 8 scale, with a scalar multiplier)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Slow for detail work | Ctrl+1 or Ctrl+2 | Place small props like potions, keys, and coins with precision in tight dungeon corners |
| DnD RPG | Fast for large areas | Ctrl+7 or Ctrl+8 | Quickly fly across the overworld map or between distant dungeon entrances |
| Wizard's Chess | Medium for board overview | Ctrl+3 or Ctrl+4 | Comfortable speed for orbiting and panning around the chessboard during layout work |

### Camera Bookmarks

- **Ctrl + 0** through **Ctrl + 9**: Save the current viewport camera position and rotation to a bookmark slot
- **0** through **9**: Recall a saved camera bookmark
- **Shift + 0** through **Shift + 9**: Clear a bookmark (in some configurations)

Bookmarks persist for the current editor session. They can also be managed via `Window > Viewports > Bookmarks`.

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Save key dungeon views | Ctrl+1: Dungeon entrance, Ctrl+2: Boss room, Ctrl+3: Treasure chamber, Ctrl+4: Tabletop overview | Instantly jump between important areas of the dungeon during level design |
| DnD RPG | Recall the tabletop view | Press 4 to recall the tabletop camera bookmark | Return to the top-down tabletop perspective after editing inside the 3D dungeon |
| Wizard's Chess | Save board angles | Ctrl+1: Player's view, Ctrl+2: Opponent's view, Ctrl+3: Top-down, Ctrl+4: Dramatic low-angle | Quickly switch between camera angles used in the game to check composition and framing |
| Wizard's Chess | Recall the "capture cam" | Press 3 for top-down after inspecting a piece close up | Jump back to the overhead view that matches the spectator camera during captures |

### Pilot Actors

Lock the viewport camera to a specific actor (typically a Camera Actor or Character):

1. Select the actor in the viewport or World Outliner
2. Right-click and choose **Pilot** (or press `Ctrl + Shift + P` with the actor selected)
3. The viewport now follows the actor's transform in real time
4. To stop piloting: click the **Eject** button in the viewport toolbar, or press `Ctrl + Shift + P` again

While piloting, WASD and mouse controls move the actor itself, making it useful for placing cameras precisely.

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Position the game camera | Pilot the CameraActor for third-person follow cam | Use WASD to fly the camera into the exact position behind the hero character, then eject to lock it |
| DnD RPG | Test the tabletop camera | Pilot the TabletopCamera actor | See exactly what the player sees in the top-down tabletop view, adjusting height and angle in real time |
| DnD RPG | Preview the AI DM camera | Pilot the DM_Camera actor | Check the camera angle used during AI DM narration sequences |
| Wizard's Chess | Set up the game camera | Pilot BP_GameCamera | Fly into the exact player camera position (angled overhead view of the board) and fine-tune it |
| Wizard's Chess | Capture camera angle | Pilot BP_CaptureCamera | Position the dramatic close-up camera used during piece capture animations |

### Selection Locking

Prevent accidental deselection or re-selection while working:

- **Lock icon** in the Details Panel: Pins the current selection so clicking elsewhere does not change which actor's properties are displayed
- **Lock icon** in the World Outliner: Prevents an actor from being selected in the viewport (useful for background geometry you do not want to accidentally click)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Lock the dungeon floor | Lock icon on DungeonFloor mesh in World Outliner | Prevent accidentally selecting the floor when clicking on enemies, loot, or traps placed on top of it |
| DnD RPG | Pin enemy properties | Lock icon in Details Panel on a selected goblin | Keep the goblin's properties visible while clicking around the dungeon to compare placement |
| Wizard's Chess | Lock the board mesh | Lock icon on ChessBoard in World Outliner | Prevent accidental selection of the board when clicking on pieces sitting on it |
| Wizard's Chess | Pin piece properties for comparison | Lock Details Panel on one piece, select another in viewport | Compare the material settings or physics properties of two different piece types side by side |

---
