## Editor Preferences (Edit > Editor Preferences)

Access the Editor Preferences window via `Edit > Editor Preferences`. These settings affect the editor behavior for the current user and are saved per-machine, not per-project.

### General

#### Appearance
Path: `Edit > Editor Preferences > General > Appearance`

- **Editor Theme**: Choose between Dark (default) and Light editor themes
- **Color Vision Deficiency**: Options for Deuteranope (green-weak), Protanope (red-weak), Tritanope (blue-weak) with severity slider from 0 to 10. Includes "Correct Deficiency" and "Show Deficiency" toggles
- **Apply to All Editor Windows**: When enabled, the theme applies uniformly
- **Asset Color Tint**: Adjust the color tint applied to asset thumbnails for identification
- **Use Small Toolbar Icons**: Reduce toolbar icon size for more screen space
- **Show Friendly Variable Names**: Display Blueprint variable names with spaces between camelCase words (e.g., "myVariable" displays as "My Variable")
- **Log Font Size**: Adjust the font size in the Output Log. Range: 6 to 24
- **Fonts**: Override the editor font family
- **Show Project Name in Title Bar**: When enabled, displays the project name in the window title bar
- **Show Editor FPS**: Display frames per second in the editor viewport
- **User Interface Scale**: Scale the entire editor UI. Range: 0.5 to 4.0 (default: 1.0)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Friendly Blueprint names | Show Friendly Variable Names: On | "mCurrentHealth" displays as "M Current Health" in the Details panel, making it easier to read GAS attribute variables |
| DnD RPG | Monitor editor performance | Show Editor FPS: On | Keep an eye on editor FPS when building large dungeon levels with many lights and particle systems |
| Wizard's Chess | Dark theme for long sessions | Editor Theme: Dark | Reduces eye strain during extended chess piece material and VFX editing sessions |
| Wizard's Chess | Bigger log text for debugging | Log Font Size: 14 | Read Niagara and Blueprint log messages more easily when debugging piece movement logic |

#### Input
Path: `Edit > Editor Preferences > General > Input`

- **Keyboard Shortcuts**: Full remappable keyboard shortcut list. Every editor command is listed categorically (Level Editor, Content Browser, Blueprint Editor, Material Editor, etc.). Click on any binding to change it. Supports chord shortcuts (two-key combinations)
- **Mouse Sensitivity**: Adjust viewport mouse sensitivity for orbit, pan, and zoom. Range: 0.1 to 10.0
- **Invert Middle Mouse Pan**: Toggle whether middle mouse button panning is inverted
- **Invert Orbit Direction**: Reverse the orbit direction when Alt + left-click dragging
- **Enable Gesture-Based Editing**: Enable trackpad gesture support on macOS
- **Flight Camera Control Type**: Choose between WASD (default), and other camera control schemes
- **Flight Camera Control Experiment**: Toggle experimental flight camera improvements

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Custom shortcut for ability testing | Keyboard Shortcuts: bind a key to "Play In Editor" | Rapidly test GAS abilities like Warrior's Shield Bash or Rogue's Backstab with a single keypress |
| DnD RPG | Orbit around dungeon props | Orbit Around Selection: On | Alt+click orbits around the selected treasure chest or altar rather than an arbitrary point in the void |
| Wizard's Chess | Slow mouse for precise piece placement | Mouse Sensitivity: 0.5 | Lower sensitivity helps when positioning chess pieces exactly on their tiles |
| Wizard's Chess | Invert orbit for comfort | Invert Orbit Direction: On (if preferred) | Match your personal navigation habit so camera orbiting around the board feels natural |

#### Loading & Saving
Path: `Edit > Editor Preferences > General > Loading & Saving`

- **Auto Save**:
  - `Enable AutoSave`: Toggle automatic saving on or off (default: on)
  - `Save Maps`: Auto-save map files (default: on)
  - `Save Content Packages`: Auto-save content packages (default: on)
  - `Frequency in Minutes`: How often auto-save triggers. Range: 1 to 60 (default: 10)
  - `Warning in Seconds`: How many seconds of warning before auto-save executes. Range: 0 to 30 (default: 5)
  - `Maximum Number of Auto-Saves`: How many auto-save files to keep before overwriting oldest. Range: 1 to 100 (default: 10)
- **On Startup**:
  - `Load Last Project on Startup`: Automatically reopen the last project
  - `Restore Open Asset Editors on Restart`: Reopen previously open asset editors
- **Saving**:
  - `Force Compression on Save`: Compress packages when saving
  - `Auto Checkout on Save`: Automatically check out files from source control when saving
  - `Prompt for Checkout on Save`: Ask before checking out files
  - `Save All with Unsaved Dependencies`: When saving all, include unsaved assets that depend on changed assets
  - `Ask Before Adding New Files to Source Control`: Prompt when adding newly created files
- **Directories**:
  - `Auto-Save Directory`: Override the auto-save file directory
  - `Number of Recent Assets to Display`: How many recently opened assets appear in menus (default: 20)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Frequent auto-saves during level design | AutoSave Frequency: 5 minutes | Dungeon levels take hours to build; losing progress to a crash is painful, so save often |
| DnD RPG | Keep Blueprint editors open | Restore Open Asset Editors on Restart: On | Reopen GA_Fireball, BP_DungeonGameMode, and ABP_Warrior automatically after an editor restart |
| Wizard's Chess | Auto-save content packages | Save Content Packages: On | Ensure chess piece Blueprints and materials are auto-saved alongside the board map |
| Wizard's Chess | Source control checkout | Auto Checkout on Save: On | Automatically check out BP_ChessPiece files from Git when you start editing, no manual step needed |

#### Region & Language
Path: `Edit > Editor Preferences > General > Region & Language`

- **Internationalization**:
  - `Editor Language`: Choose the editor UI language (English, French, German, Spanish, Japanese, Korean, Chinese, etc.)
  - `Editor Locale`: Controls number, date, and time formatting
  - `Preview Game Language`: Set the language used during Play In Editor for localized content
  - `Use Localized Number Input`: When enabled, number fields accept localized number formats (e.g., comma as decimal separator)
  - `Use Localized Numeric Input`: Accept localized formats in numeric inputs

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Test localized UI text | Preview Game Language: French, German, etc. | Preview how ability names, quest text, and dice roll prompts look in other languages during PIE |
| Wizard's Chess | Preview localized piece names | Preview Game Language: as needed | Check that "Check", "Checkmate", and piece names display correctly in localized builds |

#### Performance
Path: `Edit > Editor Preferences > General > Performance`

- **Throttling**:
  - `Use Less CPU When in Background`: Reduce CPU usage when the editor window is not focused (default: on)
  - `Editor Performance Throttling`: Limit the editor frame rate when not in focus
  - `Target FPS When Active`: Frame rate target when editor is focused (default: uncapped)
  - `Target FPS When Inactive`: Frame rate target when editor is in background (default: 3 to 8 FPS)
- **Monitoring**:
  - `Show Frame Rate and Memory in Title Bar`: Display real-time FPS and memory usage
  - `Enable Shared DDC Performance Notifications`: Notify when shared Derived Data Cache is slow
- **Scalability**:
  - `Editor Scalability`: Apply engine scalability settings (Low, Medium, High, Epic, Cinematic) to the editor viewports
  - `Material Quality Level`: Override the material quality level for the editor

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Save CPU when referencing docs | Use Less CPU When in Background: On | The editor throttles while you are reading the GDD or looking up GAS documentation in a browser |
| DnD RPG | Full speed when active | Target FPS When Active: Uncapped | Keep the editor responsive when navigating complex dungeon levels with many lights |
| Wizard's Chess | Lower quality for faster iteration | Editor Scalability: Medium | Speed up viewport rendering while iterating on piece movement logic, switch to Epic for visual polish |
| Wizard's Chess | Monitor memory for VFX | Show Frame Rate and Memory in Title Bar: On | Track memory usage when multiple Niagara shatter effects are active simultaneously |

#### Experimental
Path: `Edit > Editor Preferences > General > Experimental`

This section contains toggles for experimental and early-access features. Settings vary by engine version. In 5.7, key experimental toggles include:

- **AI Assistant**: Enable or disable the in-editor AI Assistant panel
- **Nanite Foliage**: Enable Nanite Foliage rendering features
- **Procedural Vegetation Editor**: Enable the graph-based vegetation editor
- **SMAA Anti-Aliasing**: Enable Subpixel Morphological Anti-Aliasing
- **Spatially Aware Retargeting**: Enable improved animation retargeting
- **Morph Target Viewer**: Enable the morph target editing interface
- **Rig Mapper**: Enable MetaHuman Rig Mapper tool
- **Motion Design**: Enable Motion Design production tools
- **Blueprint**: Experimental Blueprint features such as new node types
- **Console**: Experimental console variable features
- **Cooking**: Experimental cooking pipeline features
- **Level Editor**: Experimental editor layout and interaction features
- **Networking**: Experimental Iris networking features
- **Physics**: Experimental Chaos features like Partial Sleeping
- **Rendering**: Experimental rendering paths and techniques
- **UI**: Experimental Slate and UMG widget features
- **World Partition**: Experimental partition and streaming features

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Chaos partial sleeping | Physics: Partial Sleeping: On | Large piles of loot items (coins, gems) in treasure rooms can use partial sleeping to save CPU |
| DnD RPG | Improved animation retargeting | Spatially Aware Retargeting: On | Retarget animations between the 6 character classes (Warrior, Rogue, Cleric, Wizard, Ranger, Bard) more accurately |
| DnD RPG | PCG for dungeon generation | Procedural Vegetation Editor: On | Use graph-based procedural placement for dungeon props like barrels, crates, and mushrooms |
| Wizard's Chess | Nanite for detailed pieces | Nanite Foliage: On | If the chess arena has decorative foliage around the board, Nanite handles high-poly plants efficiently |
| Wizard's Chess | Motion Design for cinematics | Motion Design: On | Use Motion Design tools for the dramatic camera sweeps during checkmate sequences |

#### Source Code
Path: `Edit > Editor Preferences > General > Source Code`

- **Source Code Editor**: Select the IDE for opening C++ source files:
  - Visual Studio 2022 / 2019
  - Visual Studio Code
  - Xcode (macOS)
  - Rider
  - CLion
  - Custom external editor (specify path)
- **Generate Visual Studio Project Files Automatically**: Regenerate project files when .uproject or .Build.cs files change
- **Accessor**: Path to the source code accessor binary

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | C++ GAS development | Source Code Editor: Visual Studio 2022 | GAS (Gameplay Ability System) is best written in C++; VS2022 is the recommended IDE for UE5.7 |
| Wizard's Chess | Quick C++ edits | Source Code Editor: Visual Studio 2022 or Rider | Click-to-navigate from Blueprint errors straight into your C++ chess logic code |
| Both | Auto-regenerate project files | Generate VS Project Files Automatically: On | When you add new C++ classes (e.g. a new GameplayEffect or ChessRule), project files update automatically |

#### Tutorials
Path: `Edit > Editor Preferences > General > Tutorials`

- **Disable All Tutorial Alerts**: Stop showing tutorial popup prompts
- **Clear Completed Tutorials**: Reset the completion state of all in-editor tutorials
- **Getting Started**: Link to the guided Getting Started tutorial project (refreshed in 5.7 with the new Home Panel)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| Both | Disable tutorial popups | Disable All Tutorial Alerts: On | Once you are past the learning phase, prevent tutorial prompts from interrupting your workflow |

### Level Editor

#### Play
Path: `Edit > Editor Preferences > Level Editor > Play`

- **Play in Editor**:
  - `Game Gets Mouse Control`: Give the game focus on Play (default: on)
  - `Show Mouse Control Label`: Display mouse capture instruction overlay
  - `Mouse Control Label Position`: Position of the mouse capture label
  - `Auto Recompile Blueprints`: Recompile dirty Blueprints before playing
  - `Enable Game Sound`: Play game audio during PIE (default: on)
- **Game Viewport Settings**:
  - `New Viewport Resolution`: Resolution for standalone game window
  - `Fullscreen Mode`: Windowed, Fullscreen, or Windowed Fullscreen
  - `Use Desktop Resolution for New Viewport`: Match desktop resolution
  - `Center New Window`: Center the new window on the screen
- **Play in New Window**:
  - `New Window Position`: Where the PIE window appears
  - `New Window Size`: PIE window dimensions
  - `Always on Top`: Keep PIE window above editor
- **Multiplayer Options**:
  - `Number of Players`: Number of player instances (1 to 64)
  - `Net Mode`: Standalone, Listen Server, or Client
  - `Run Dedicated Server`: Launch a separate dedicated server process
  - `Auto Connect to Server`: Clients auto-connect on play
  - `Server Map Name Override`: Override the map loaded by the server
  - `Server Port`: Network port for the server instance
  - `Use Single Process`: Run all players in one process (faster) or separate processes (more accurate)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Test turn-based combat | Game Gets Mouse Control: On | Immediately interact with the turn-order UI and ability selection when PIE starts |
| DnD RPG | Test local co-op dungeon crawl | Number of Players: 2, Net Mode: Standalone | Test two players in the same dungeon to verify turn order, shared loot, and camera behavior |
| DnD RPG | Full-screen dungeon testing | Fullscreen Mode: Windowed Fullscreen | See the dungeon at full resolution with HUD, health bars, and dice roll overlays |
| Wizard's Chess | Test AI opponent | Number of Players: 1, Net Mode: Standalone | Play against the AI chess opponent without network overhead |
| Wizard's Chess | Audio during PIE | Enable Game Sound: On | Hear the piece slide sounds, capture shatter audio, and ambient magical hum while testing |

- **Play in Standalone**:
  - `Standalone Window Position`: Position of standalone game window
  - `Additional Launch Parameters`: Extra command-line arguments
  - `Disable Standalone Sound`: Mute audio in standalone mode

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Standalone dungeon test | Additional Launch Parameters: `-log` | Launch a standalone build with logging enabled to catch GAS replication or AI errors outside the editor |
| Wizard's Chess | Standalone chess match | Standalone Window Position: Centered | Test the full chess game loop (start, play, checkmate) in a standalone window that behaves like the final build |

#### Viewports
Path: `Edit > Editor Preferences > Level Editor > Viewports`

- **Controls**:
  - `Camera Speed`: Default camera movement speed in the viewport (1 to 8 scale, default: 4)
  - `Camera Speed Scalar`: Multiplier for the base camera speed
  - `Mouse Scroll Camera Speed`: How much the camera speed changes per scroll tick
  - `Invert Mouse Y Axis`: Invert vertical camera movement
  - `Use Absolute Translation`: Move objects in world space rather than local space
  - `Orbit Around Selection`: When enabled, Alt-click orbiting uses the selected actor as the pivot. When disabled, orbits around the viewport center
- **Look and Feel**:
  - `Field of View`: Viewport camera FOV in degrees (default: 90)
  - `Near Clip Plane`: Minimum draw distance. Range: 0.01 to 100 (default: 10)
  - `Enable Viewport Hover Feedback`: Highlight objects on mouse hover
  - `Highlight Objects Under Cursor`: Visual feedback for objects beneath the cursor
  - `Use Selection Outline`: Draw an outline around selected actors
  - `Selection Highlight Intensity`: Brightness of the selection highlight. Range: 0 to 1
  - `BSP Auto-Update`: Automatically rebuild BSP when brushes are modified
  - `Preview Selected Cameras`: Show a picture-in-picture preview when a camera actor is selected
  - `Background Viewport Drop Frame Rate`: Throttle background viewport updates
  - `Enable Viewport Statistics`: Display stat counters in the viewport
  - `Streaming Volume Previs`: Preview level streaming volumes
- **Snapping**:
  - `Enable Snapping`: Global toggle for grid snapping
  - `Translation Snap Values`: Configurable grid sizes (0.25, 0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000 units)
  - `Rotation Snap Values`: Rotation increments (5, 10, 15, 22.5, 30, 45, 60, 90, 120 degrees)
  - `Scale Snap Values`: Scale increments (0.025, 0.05, 0.1, 0.25, 0.5)
  - `Snap to Surface`: Snap objects to surfaces when dragging
  - `Surface Normal Alignment`: Align snapped objects to the surface normal
  - `Snap to Socket`: Snap objects to sockets on other actors
  - `Snap to Vertex`: Snap to mesh vertices using `V` key modifier

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Slow camera for tight corridors | Camera Speed: 2 (low) | Navigate narrow dungeon hallways without overshooting walls and geometry |
| DnD RPG | Snap dungeon tiles to grid | Translation Snap: 100 units | Modular dungeon tiles (floors, walls, doorways) snap perfectly edge-to-edge on a 1-meter grid |
| DnD RPG | Rotate props at 90 degrees | Rotation Snap: 90 degrees | Align dungeon doors, chests, and altars to the cardinal directions for a tidy grid-based layout |
| Wizard's Chess | Snap pieces to tile centers | Translation Snap: 100 units (matching tile size) | Position each chess piece exactly at the center of its board tile |
| Wizard's Chess | Vertex snap board decorations | V key + drag | Snap decorative rune meshes to exact vertices on the board surface |
| Wizard's Chess | Preview selected camera | Preview Selected Cameras: On | Select the "Game Camera" actor and see a PiP preview of the player's view while editing |
| DnD RPG | Orbit around selected prop | Orbit Around Selection: On | Alt+click orbits around the treasure chest or NPC you are currently editing |

### Content Editors

#### Blueprint Editor
Path: `Edit > Editor Preferences > Content Editors > Blueprint Editor`

- **Compiler**:
  - `Save on Compile`: Automatically save the Blueprint when compiling (default: on success only). Options: Never, On Success Only, Always
  - `Developer Mode`: Show advanced debugging options in the compiler
  - `Show Detailed Compile Results`: Display additional compilation metrics
- **Workflow**:
  - `Show Context Actions for Get/Set`: When dragging from a variable, show context-sensitive get/set options
  - `Favor Pure Cast Nodes`: Prefer pure (no execution pin) cast nodes
  - `Show Access Specifiers`: Display public, protected, and private indicators on functions and variables
  - `Include Blueprint Namespace`: Show namespaces in node titles
  - `Allow Explicit Impure Node Disabling`: Let users disable impure nodes without deleting them
- **Visual**:
  - `Draw Midpoint Arrow on Wires`: Display directional arrows on connection wires
  - `Hide Unconnected Pins`: Automatically collapse pins with no connections
  - `Spline Tangent Mode`: Change wire curve behavior. Options: Standard, Manhattan
  - `Node Comment Bubble**: Toggle comment bubble visibility

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Save on successful compile | Save on Compile: On Success Only | Automatically save GA_Fireball or BP_DungeonGameMode after a clean compile, but not if there are errors |
| DnD RPG | Show directional wires | Draw Midpoint Arrow on Wires: On | In complex GAS ability Blueprints with many branches, arrows show execution flow direction clearly |
| DnD RPG | Comment bubbles for ability logic | Node Comment Bubble: On | Add visible comments like "Calculate Crit Damage" or "Apply Stun Effect" above Blueprint node clusters |
| Wizard's Chess | Hide unused pins | Hide Unconnected Pins: On | Keep the BP_ChessPiece movement logic clean by collapsing unused pins on Function nodes |
| Wizard's Chess | Access specifiers visible | Show Access Specifiers: On | See which functions in BP_ChessGameMode are public (callable from pieces) vs private (internal logic) |

#### Asset Editor
Path: `Edit > Editor Preferences > Content Editors > Asset Editor`

- **General**:
  - `Open Asset Editors in New Windows`: Open each asset editor in a separate window (default: on) vs. tabbed within the main editor
  - `Max Tabs in Shared Group`: Maximum number of asset editor tabs before new ones replace the oldest

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Separate windows for ability editing | Open Asset Editors in New Windows: On | Have GA_Fireball, GA_ShieldBash, and the dungeon map each in their own window for side-by-side work |
| Wizard's Chess | Tabbed editing for pieces | Open Asset Editors in New Windows: Off | Keep all chess piece Blueprints as tabs in one window to switch between them quickly |

### Source Control

Path: `Edit > Editor Preferences > Source Control`

- **Provider**:
  - `Provider`: Select source control provider. Options: None, Perforce, Git, Subversion, Plastic SCM
  - `Accept Non-Trusted Server Certificate`: For HTTPS connections
- **Perforce Settings** (when Perforce selected):
  - `Server`: P4PORT (server address and port)
  - `User Name`: P4USER
  - `Workspace`: P4CLIENT
  - `Host`: P4HOST override
- **Git Settings** (when Git selected):
  - `Use Git LFS`: Enable Git Large File Storage integration
  - `Binary File Extensions`: File extensions treated as binary (default includes .uasset, .umap)
- **General**:
  - `Enable Source Control`: Master toggle
  - `Automatically Check Out on Edit`: Check out files when you begin editing
  - `Prompt for Check Out on Edit`: Ask before checking out
  - `Add New Files to Source Control`: Automatically add newly created files
  - `Use Global Settings`: Apply these settings globally or per-project

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Git with LFS | Provider: Git, Use Git LFS: On | Track .uasset and .umap files with Git LFS to avoid bloating the repository with large binary assets |
| DnD RPG | Auto-add new assets | Add New Files to Source Control: On | When you create a new GA_HealingWord ability or dungeon tileset, it is automatically tracked by Git |
| Wizard's Chess | Same Git setup | Provider: Git, Use Git LFS: On | Chess piece meshes, textures, and Niagara systems are large binaries that belong in LFS |
| Both | Auto-checkout on edit | Automatically Check Out on Edit: On | Start editing a Blueprint and it is checked out automatically, no manual step |

### Derived Data Cache

Path: `Edit > Editor Preferences > Derived Data Cache`

- **Local**:
  - `Local DDC Path`: Path to the local DDC directory. Default: `%LOCALAPPDATA%/UnrealEngine/DerivedDataCache` (Windows) or `~/Library/Caches/UnrealEngine/DerivedDataCache` (macOS)
  - `Max Cache Size (MB)`: Maximum disk space for local DDC. Default: 50000
- **Shared (Network)**:
  - `Shared DDC Path`: Network path for a shared team DDC
  - `Enable Shared DDC`: Toggle shared cache usage
  - `Read from Shared DDC`: Allow reading from shared cache
  - `Write to Shared DDC`: Allow writing to shared cache
- **Cloud / S3 / Horde**:
  - `Enable Cloud DDC`: Use HTTP-based DDC backend (Horde Storage, S3, etc.)
  - `URL`: Endpoint URL for cloud DDC
  - `Namespace`: DDC namespace identifier
- **General**:
  - `Can Use Pak File DDC`: Use pak files as DDC source
  - `Verify DDC Integrity`: Validate DDC entries on read

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Large local DDC for dungeon assets | Max Cache Size: 50000 MB | Dungeon levels with many unique textures, meshes, and Niagara systems generate large DDC data; keep the cache big to avoid re-deriving |
| Wizard's Chess | Verify DDC integrity | Verify DDC Integrity: On | Prevent corrupted cached data from causing visual glitches on chess piece materials or board textures |
| Both | Local DDC path | Use default path | Keep the DDC on a fast SSD for quick shader compilation and texture processing |

---
