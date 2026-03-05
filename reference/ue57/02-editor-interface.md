## Editor Interface

The Unreal Engine 5.7 Editor is a modular workspace made up of panels and windows that can be rearranged, docked, undocked, and saved as custom layouts. Below is every major panel and window.

### Viewport

The 3D Viewport is the primary window where you view and interact with your level. It displays the game world from various angles and supports real-time rendering preview.

- **How to open**: Visible by default in the center of the editor. If closed, go to `Window > Viewports > Viewport 1` (through Viewport 4)
- **Keyboard shortcut**: `Alt + 1` through `Alt + 4` for viewports 1 through 4
- **Features**:
  - Perspective and orthographic views (Top, Front, Side)
  - Multiple simultaneous viewports (up to four)
  - Real-time and non-real-time rendering toggle (`Ctrl + R`)
  - View mode switching (Lit, Unlit, Wireframe, etc.) via the View Mode dropdown in the viewport toolbar
  - Show Flags for toggling visibility of specific element categories
  - Camera speed slider (mouse scroll while holding right-click, or `Ctrl + 1` through `Ctrl + 8`)
  - Pilot Actors mode to lock the camera to an actor's perspective
  - Bookmark system for saving and recalling camera positions (`Ctrl + 0-9` to set, `0-9` to recall)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Tabletop zoom transition | Bookmark slot 1 = top-down tabletop view, slot 2 = 3D dungeon view | Quickly switch between the two camera perspectives while designing the zoom-in animation |
| DnD RPG | Pilot the player camera | Pilot the CameraActor attached to your PlayerCharacter Blueprint | Test the third-person follow cam without hitting Play, useful for dungeon layout checks |
| Wizard's Chess | Board overview camera | Bookmark a 45-degree angled view of the full chessboard | Snap back to the "game camera" after inspecting individual piece meshes up close |
| Wizard's Chess | Piece capture VFX check | Use multiple viewports: one Lit, one Unlit | See the magic shatter particles in full lighting while also checking base textures without light interference |
| DnD RPG | Dungeon level design | Camera speed preset Ctrl+2 (slow) for tight corridors, Ctrl+6 for large caverns | Navigate cramped dungeon hallways at low speed so you do not overshoot placement |

### Content Browser

The Content Browser is the primary file explorer for all project assets. It organizes Blueprints, static meshes, skeletal meshes, textures, materials, sounds, particles, and every other asset type.

- **How to open**: `Window > Content Browser > Content Browser 1` (through Content Browser 4)
- **Keyboard shortcut**: `Ctrl + Space` (toggles Content Browser focus)
- **Features**:
  - Dual-pane layout with folder tree (Sources panel) on the left and asset grid/list on the right
  - Multiple Content Browser tabs (up to four simultaneously)
  - Search bar with filter syntax
  - Asset type filters, metadata filters, and collection-based filtering
  - Favorites system for pinned folders
  - Virtual paths and path aliasing
  - Source control integration (status icons, check-out, check-in, history)
  - Asset migration between projects
  - Reference tracking and dependency analysis
  - Bulk rename, delete, move, and duplicate operations
  - Developer content folder toggle (shows or hides `/Game/Developers/`)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Organize by game system | Folder structure: `/Content/Characters/Warrior/`, `/Content/Abilities/`, `/Content/Dungeons/` | Keep the 6 character classes, GAS abilities, loot tables, and dungeon tiles cleanly separated |
| DnD RPG | Find all dice roll assets | Search filter: "dice" or type filter: Niagara System | Quickly locate dice roll VFX, dice mesh, and dice sound cues across the project |
| Wizard's Chess | Piece mesh variants | Folder: `/Content/ChessPieces/King/`, `/Content/ChessPieces/Pawn/` etc. | Each piece type has its own mesh, materials, animations, and shatter destruction assets |
| Wizard's Chess | Magic trail materials | Favorites pin: `/Content/VFX/MagicTrails/` | Pin the folder you edit most often so it is always one click away |
| DnD RPG | Reference tracking for GAS | Right-click a GameplayAbility asset and check references | See which character classes reference a specific ability like "Fireball" or "Backstab" before renaming it |

### Details Panel

The Details Panel displays all properties, components, and settings for the currently selected actor or asset. It is the primary interface for editing object properties.

- **How to open**: `Window > Details` or visible by default when an actor is selected
- **Keyboard shortcut**: `F4` (focuses the Details Panel for the selected actor)
- **Features**:
  - Categorized property groups (Transform, Rendering, Physics, Collision, Tags, etc.)
  - Search bar for filtering properties by name
  - Property locking (pin the current selection to keep it visible while selecting other objects)
  - Multi-object editing (select multiple actors and edit shared properties simultaneously)
  - Reset to default buttons on individual properties
  - Copy/paste property values
  - Advanced properties toggle (eye icon or "Show All Advanced" checkbox)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Tune GAS ability values | Select a GameplayAbility Blueprint, edit Damage, Cooldown, Range in Details | Tweak Warrior's "Shield Bash" stun duration or Wizard's "Fireball" radius without opening the Blueprint Editor |
| DnD RPG | Multi-edit dungeon torches | Select all BP_DungeonTorch actors, edit shared Light Intensity | Adjust lighting for 50 torches at once instead of one by one |
| Wizard's Chess | Adjust piece physics | Select a chess piece, expand Physics category | Set mass and damping so pieces feel heavy and magical when sliding across the board |
| Wizard's Chess | Lock shatter properties | Pin a captured piece's Details panel, then select another piece | Compare destruction settings between two pieces side by side |

### World Outliner

The World Outliner (previously called the World Outliner or Scene Outliner) lists every actor currently in the level in a hierarchical tree view.

- **How to open**: `Window > World Outliner`
- **Keyboard shortcut**: None by default; assignable via `Edit > Editor Preferences > General > Keyboard Shortcuts`
- **Features**:
  - Hierarchical tree view with parent-child relationships
  - Search and filter by name, type, or layer
  - Folder organization (create folders to group actors logically)
  - Column customization (visibility, mobility, type icons)
  - Drag-and-drop for reparenting actors
  - Multi-select for batch operations
  - Right-click context menu for common operations (rename, delete, duplicate, select all matching)
  - Actor visibility toggles (eye icon)
  - Actor lock toggles (lock icon to prevent accidental selection in viewport)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Organize dungeon actors | Create folders: "Lighting", "Enemies", "Loot", "Environment", "TriggerVolumes" | A single dungeon room can have 100+ actors; folders keep the outliner navigable |
| DnD RPG | Lock the tabletop mesh | Lock icon on the TabletopMesh actor | Prevent accidentally selecting/moving the entire tabletop when placing miniature pawns on top of it |
| Wizard's Chess | Hide board to edit underside VFX | Eye icon on the ChessBoard actor | Toggle the board invisible to access the magic glow emitters mounted underneath |
| Wizard's Chess | Filter by piece type | Search "Bishop" in World Outliner | Instantly find all Bishop actors when adjusting their movement animation triggers |
| DnD RPG | Parent enemies to spawn points | Drag BP_Goblin under BP_SpawnPoint_01 | Hierarchical parenting keeps enemy actors grouped with their spawn logic |

### Output Log

The Output Log displays all engine messages, warnings, errors, Blueprint print statements, and console command output.

- **How to open**: `Window > Output Log`
- **Keyboard shortcut**: `Alt + Shift + O`
- **Features**:
  - Color-coded messages (white for info, yellow for warnings, red for errors)
  - Category and verbosity filtering
  - Search bar for filtering by text
  - Console command input field at the bottom
  - Copy, clear, and export log contents
  - Click-to-navigate for Blueprint and C++ error references

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Debug GAS ability activation | Filter Output Log for "Ability" or "GAS" | Track when GameplayAbilities fire, fail, or get blocked by cooldowns during PIE testing |
| DnD RPG | AI behavior tree logging | Use Print String nodes in BT tasks, check Output Log | See why a Goblin enemy chose to flee instead of attack by reading the BT debug output |
| Wizard's Chess | Debug piece movement | Print the target square coordinates on each move | Verify the A* or grid-based pathfinding is sending pieces to the correct tile |
| Wizard's Chess | Catch Niagara warnings | Filter for "Niagara" in Output Log | Spot particle system errors in the magic trail or shatter VFX before they cause visual glitches |

### Message Log

The Message Log is a separate panel from the Output Log, designed for structured messages from specific engine subsystems such as map check, asset validation, Blueprint compilation, and lighting builds.

- **How to open**: `Window > Message Log`
- **Keyboard shortcut**: None by default
- **Features**:
  - Tabbed categories (Map Check, Blueprint Log, PIE, Lighting Results, Asset Audit, etc.)
  - Clickable hyperlinks that navigate directly to the offending actor or asset
  - Filter by severity (info, warning, error)
  - Clear per-tab or clear all

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Map Check before packaging | Map Check tab | Catch missing references, bad lightmap UVs, or overlapping collision in dungeon levels before shipping |
| Wizard's Chess | Blueprint compile errors | Blueprint Log tab | Click directly on the error to jump to the broken node in BP_ChessPiece or BP_GameBoard |
| DnD RPG | Lighting build results | Lighting Results tab | After baking lights in a dungeon, check for "object needs lightmap UV" warnings on cave wall meshes |

### Modes Panel

The Modes Panel controls the current editor mode, determining which tools are available in the viewport toolbar. Each mode provides specialized tools for specific workflows.

- **How to open**: Visible by default in the left toolbar. Toggle via `Window > Modes`
- **Keyboard shortcuts**:
  - `Shift + 1`: Select Mode (default)
  - `Shift + 2`: Landscape Mode
  - `Shift + 3`: Foliage Mode
  - `Shift + 4`: Mesh Paint Mode
  - `Shift + 5`: Fracture Mode
  - `Shift + 6`: Brush Editing Mode
  - Additional modes (Animation, PCG, etc.) accessible from the mode dropdown
- **Available modes**:
  - **Select Mode**: Standard actor selection and manipulation
  - **Landscape Mode**: Create, sculpt, and paint landscape terrain
  - **Foliage Mode**: Paint foliage instances across surfaces
  - **Mesh Paint Mode**: Paint vertex colors or textures directly on meshes
  - **Fracture Mode**: Set up destructible geometry via Chaos Destruction
  - **Brush Editing Mode**: Edit BSP brush geometry
  - **Animation Mode** (refactored in 5.7): Animate characters and objects
  - **PCG Mode** (new in 5.7): Spline drawing, point painting, and volume tools for PCG Graphs

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Paint dungeon foliage | Foliage Mode (Shift+3) | Scatter mushrooms, moss, and cobwebs across dungeon floors and walls for atmosphere |
| DnD RPG | Fracture destructible walls | Fracture Mode (Shift+5) | Set up Chaos Destruction on dungeon walls that the Warrior can smash through |
| DnD RPG | PCG-generated forest | PCG Mode | Use a PCG Graph to procedurally scatter trees, rocks, and bushes in outdoor overworld areas |
| Wizard's Chess | Vertex paint board wear | Mesh Paint Mode (Shift+4) | Paint vertex colors onto the chessboard to add scuff marks, aged wood grain, and wear patterns |
| Wizard's Chess | Fracture chess pieces | Fracture Mode (Shift+5) | Pre-fracture piece meshes so they shatter into fragments on capture using Chaos Destruction |

### Place Actors Panel

The Place Actors panel provides drag-and-drop access to commonly used actor types, organized by category.

- **How to open**: `Window > Place Actors` or click the "Place Actors" button in the left toolbar
- **Keyboard shortcut**: None by default
- **Categories**:
  - **Basic**: Cube, Sphere, Cylinder, Cone, Plane, Comment
  - **Lights**: Point Light, Spot Light, Directional Light, Rect Light, Sky Light
  - **Shapes**: Geometric primitives
  - **Visual Effects**: Particle systems, Niagara emitters, fog, decals, post-process volumes
  - **Volumes**: Blocking Volume, Trigger Volume, Nav Mesh Bounds Volume, Post Process Volume, Audio Volume, Kill Z Volume, Pain Causing Volume, Physics Volume, Lightmass Importance Volume, and more
  - **All Classes**: Searchable list of every available actor class
  - **Recently Placed**: Quick access to actors you have placed recently

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Place dungeon lights | Lights category: Point Light, Spot Light | Drop point lights for torches and spot lights for magical glowing crystals throughout dungeons |
| DnD RPG | Set up trigger zones | Volumes: Trigger Volume | Place trigger volumes for encounter starts, trap activations, and room discovery events |
| DnD RPG | Post-process for dungeon mood | Visual Effects: Post Process Volume | Add a dark, desaturated post-process in underground areas and a warm, bright one on the tabletop |
| Wizard's Chess | Add fog under the board | Visual Effects: Exponential Height Fog | Create a mystical low-lying fog that swirls beneath the chessboard |
| Wizard's Chess | Nav Mesh for piece movement | Volumes: Nav Mesh Bounds Volume | Define the navigable area on the chessboard so pieces can pathfind between squares |

### Layers Panel

The Layers panel provides a layer-based organization system for actors in the level.

- **How to open**: `Window > Layers`
- **Keyboard shortcut**: None by default
- **Features**:
  - Create, rename, and delete layers
  - Assign actors to one or more layers
  - Toggle layer visibility in the viewport
  - Select all actors in a layer
  - Layer colors for visual identification

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Separate editing concerns | Layers: "Lighting", "Enemies", "Geometry", "Loot", "Traps" | Toggle enemy visibility off when working on lighting, or hide geometry when placing loot chests |
| Wizard's Chess | Isolate VFX layer | Layer: "MagicEffects" with a blue color | Hide all magic trail emitters and glow meshes to focus on board geometry without visual clutter |

### Levels Panel

The Levels panel manages sub-levels within the current persistent level. Used with World Composition and World Partition for streaming and level management.

- **How to open**: `Window > Levels`
- **Keyboard shortcut**: None by default
- **Features**:
  - Add, remove, and rearrange sub-levels
  - Toggle sub-level visibility and loading
  - Set streaming distances
  - Lock sub-levels to prevent editing
  - Change current level for new actor placement
  - Level Transform editing
  - Blueprint streaming volume assignment

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Stream dungeon floors | Sub-levels: "Dungeon_Floor1", "Dungeon_Floor2", "Dungeon_Floor3" | Each dungeon floor is a sub-level that streams in as the player descends, saving memory |
| DnD RPG | Separate tabletop from 3D world | Sub-levels: "TabletopScene", "DungeonScene" | Load the tabletop level and dungeon level independently for the zoom transition |
| Wizard's Chess | Separate board from arena | Sub-levels: "ChessBoard", "ArenaEnvironment" | Keep the board and surrounding room as separate sub-levels so you can swap arena themes |

### World Settings

World Settings contains level-specific configuration such as the GameMode override, Lightmass settings, navigation system settings, kill Z height, and world composition options.

- **How to open**: `Window > World Settings`
- **Keyboard shortcut**: None by default
- **Key settings**:
  - **GameMode Override**: Override the default GameMode for this level
  - **Kill Z**: The Z-coordinate below which actors are destroyed
  - **World Gravity**: Override gravity for this level
  - **Lightmass Settings**: Indirect lighting quality, environment color, bounces
  - **Navigation System**: Navigation data generation settings
  - **World Partition**: Enable and configure World Partition
  - **Streaming**: Level streaming method and settings
  - **Precomputed Visibility**: Volume-based occlusion settings
  - **Default Physics Volume**: Default physics properties for the level

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Set dungeon GameMode | GameMode Override: BP_DungeonGameMode | Each dungeon level uses a different GameMode that handles turn-based combat, encounter triggers, and loot drops |
| DnD RPG | Kill Z for falling | Kill Z: -5000 | Destroy actors that fall off the dungeon map (e.g. knocked-off-edge enemies) |
| DnD RPG | World Partition for overworld | Enable World Partition | The open overworld between dungeons uses World Partition to stream large terrain |
| Wizard's Chess | Reduced gravity for pieces | World Gravity: -490 (half normal) | Make captured pieces float slightly before shattering, giving a magical slow-motion feel |
| Wizard's Chess | GameMode for chess rules | GameMode Override: BP_ChessGameMode | The chess GameMode manages turns, move validation, check/checkmate detection, and piece capture |

### Statistics Panel

The Statistics panel displays real-time performance data about the current scene.

- **How to open**: `Window > Statistics`
- **Keyboard shortcut**: None by default
- **Displays**:
  - Primitive counts (static meshes, skeletal meshes, particles)
  - Light counts by type
  - Triangle and vertex counts
  - Draw call counts
  - Texture memory usage
  - Actor counts by class

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Monitor dungeon draw calls | Check draw call and triangle counts | Dungeons with many torches, enemies, and loot can spike draw calls; catch it early |
| Wizard's Chess | Particle budget check | Check particle counts | 32 chess pieces each with magic trail Niagara emitters can add up fast; track the total |

### Reference Viewer

The Reference Viewer displays a visual graph of asset dependencies, showing what references what.

- **How to open**: Right-click any asset in the Content Browser and select `Reference Viewer`, or `Window > Developer Tools > Reference Viewer`
- **Keyboard shortcut**: `Alt + Shift + R` (with asset selected in Content Browser)
- **Features**:
  - Visual node graph with directional arrows showing reference flow
  - Depth controls for how many levels of references to display
  - Filter by hard references, soft references, management references
  - Search breadth and depth limits
  - Clickable nodes to navigate to referenced assets
  - Highlight paths between specific assets

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Check ability dependencies | Right-click GA_Fireball asset, open Reference Viewer | See every material, particle system, sound cue, and montage that Fireball depends on before refactoring |
| Wizard's Chess | Trace piece Blueprint refs | Reference Viewer on BP_ChessPiece_Queen | Verify the Queen references the correct mesh, shatter Niagara system, and movement animation |

### Size Map

The Size Map visualizes the disk size of assets and their dependencies as a treemap diagram.

- **How to open**: Right-click any asset or folder in the Content Browser and select `Size Map`, or `Window > Developer Tools > Size Map`
- **Keyboard shortcut**: None by default
- **Features**:
  - Treemap visualization where larger rectangles represent larger assets
  - Drill-down into folders and asset groups
  - Dependency size inclusion toggle (shows the total size including all referenced assets)
  - Memory vs. disk size modes
  - Color coding by asset type

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Find heaviest dungeon textures | Size Map on /Content/Dungeons/ folder | Identify which cave wall or floor textures are bloating package size and need compression |
| Wizard's Chess | Check total piece asset cost | Size Map on /Content/ChessPieces/ | See if a single piece type (e.g. Queen with complex shatter meshes) dominates the memory budget |

### Asset Audit

The Asset Audit window provides bulk analysis of assets for optimization, unused content detection, and content standards validation.

- **How to open**: `Window > Developer Tools > Asset Audit`
- **Keyboard shortcut**: None by default
- **Features**:
  - Column-based data view showing asset name, type, size, references, and custom audit columns
  - Filter by asset type, size range, and reference count
  - Export audit results
  - Identify unused assets (zero references)
  - Identify assets exceeding size thresholds

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Find unused prototype assets | Filter by zero references | Clean up leftover test meshes, old ability icons, and placeholder sounds from early prototyping |
| DnD RPG | Audit texture sizes | Filter by size > 4MB | Catch any character textures or dungeon tileset textures that were accidentally imported at 4K when 2K would suffice |
| Wizard's Chess | Identify orphaned VFX | Filter Niagara assets with zero references | Remove magic trail or glow particle systems that are no longer used by any chess piece |

---
