## Project Settings (Edit > Project Settings)

Access via `Edit > Project Settings`. These settings are saved in the project's `Config/` directory and are shared across the team.

### Project

#### Description
Path: `Edit > Project Settings > Project > Description`

- **About**:
  - `Project Name`: Display name for the project
  - `Company Name`: Your studio or company name
  - `Company Distinguished Name`: Fully qualified company name for certificates
  - `Homepage`: Project or company URL
  - `Contact`: Contact email address
  - `Copyright Notice`: Copyright string displayed in About dialogs
  - `Licensing Info`: License terms for the project
  - `Privacy Policy`: Privacy policy URL
- **Display**:
  - `Project Displayed Title`: Title shown in the application window
  - `Project Debug Title Info`: Additional text shown in debug builds
  - `Project Version`: Version string (e.g., "1.0.0")
- **About**:
  - `Description`: A text description of the project
  - `Project ID`: Unique identifier for the project
- **Thumbnail**:
  - `Project Thumbnail`: Icon or image representing the project, displayed in the Epic Games Launcher

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Project identity | Project Name: "TabletopQuest", Version: "0.1.0" | Clearly identify the project in the launcher and window title during development |
| Wizard's Chess | Project identity | Project Name: "WizardsChess", Version: "0.1.0" | Separate project with its own name, thumbnail, and version tracking |
| Both | Copyright notice | Copyright Notice: your name and year | Embedded in packaged builds and About dialogs |

#### Maps & Modes
Path: `Edit > Project Settings > Project > Maps & Modes`

- **Default Maps**:
  - `Editor Startup Map`: Map loaded when opening the project in the editor
  - `Game Default Map`: Map loaded when starting the game
  - `Server Default Map`: Map loaded on dedicated servers
  - `Transition Map`: Map displayed during level transitions
- **Default Modes**:
  - `Default GameMode`: The default GameMode class for all maps
  - `Selected GameMode`: Currently selected GameMode class
  - `Default Pawn Class`: Default pawn spawned for players
  - `HUD Class`: Default HUD class
  - `Player Controller Class`: Default player controller class
  - `Game State Class`: Default game state class
  - `Player State Class`: Default player state class
  - `Spectator Class`: Default spectator pawn class
- **Game Instance**:
  - `Game Instance Class`: The class used as the game instance (persists across level loads)
- **Local Multiplayer**:
  - `Use Splitscreen`: Enable splitscreen for local multiplayer
  - `Two Player Splitscreen Layout`: Horizontal or Vertical
  - `Three Player Splitscreen Layout`: Layout arrangement for three players

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Startup map | Editor Startup Map: Tabletop_Main | Open directly to the tabletop scene when launching the editor |
| DnD RPG | Game default map | Game Default Map: Tabletop_Main | Players start at the tabletop overview when launching the game |
| DnD RPG | Default GameMode | Default GameMode: BP_TabletopGameMode | Handles the tabletop view, miniature selection, and zoom-to-dungeon transition |
| DnD RPG | Core class assignments | Default Pawn: BP_HeroPawn, Player Controller: BP_RPGPlayerController, HUD: BP_DungeonHUD | Wire up the turn-based RPG controller, the hero pawn with GAS component, and the combat HUD |
| DnD RPG | Game Instance for persistence | Game Instance Class: BP_RPGGameInstance | Persists party data, inventory, and quest progress across dungeon level loads |
| Wizard's Chess | Default GameMode | Default GameMode: BP_ChessGameMode | Manages turn logic, move validation, check/checkmate, and piece capture rules |
| Wizard's Chess | Chess pawn and controller | Default Pawn: BP_ChessPlayerPawn, Player Controller: BP_ChessPlayerController | The pawn is an invisible selector; the controller handles tile selection and piece commands |
| Wizard's Chess | Transition map | Transition Map: LoadingScreen | Show a magical loading animation when transitioning between the menu and the chess arena |

#### Movies
Path: `Edit > Project Settings > Project > Movies`

- **Startup Movies**:
  - `Movies`: Array of movie file paths played during startup loading
  - `Wait for Movies to Complete`: Pause loading until movies finish playing
  - `Movies Are Skippable`: Allow users to skip startup movies with input

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Studio splash screen | Movies: ["Movies/TabletopQuestIntro.mp4"], Skippable: On | Show a brief intro cinematic of miniatures coming alive, but let players skip it |
| Wizard's Chess | Enchanted intro | Movies: ["Movies/WizardsChessIntro.mp4"], Skippable: On | A short animation of the chess pieces assembling on the board, skippable for returning players |

#### Packaging
Path: `Edit > Project Settings > Project > Packaging`

- **Packaging**:
  - `Build Configuration`: Debug, Development, Test, or Shipping
  - `Build Target`: Specify the build target for packaging
  - `Staging Directory`: Where packaged builds are saved
  - `Full Rebuild`: Force a full rebuild when packaging
  - `Use Pak File`: Package content into .pak files (default: on)
  - `Use Io Store`: Use IoStore container files for faster loading
  - `Generate Chunks`: Split content into multiple chunk files for patching
  - `Generate No Chunks`: Force single-chunk packaging
  - `Build Http Chunk Install Data`: Generate chunk data for HTTP-based distribution
  - `Http Chunk Install Data Directory`: Directory for HTTP chunk data
  - `Http Chunk Install Data Version`: Version string for chunk data
  - `Max Chunk Size (MB)`: Maximum size of individual chunks
- **Content**:
  - `Cook Everything in the Project Content Directory`: Package all content, not just referenced content
  - `Cook Only Maps`: Only cook map assets
  - `Directories to Always Cook`: Array of directory paths that should always be included
  - `Directories to Never Cook`: Array of paths to exclude from cooking
  - `Additional Asset Directories to Cook`: Extra directories to include
  - `Localization to Package`: Which localizations to include
- **Advanced**:
  - `Use Zen Store`: Use Zen loader for faster streaming
  - `Compress Cooked Content`: Apply compression to cooked data
  - `Compression Format`: Oodle (default), Zlib, Gzip, or Custom
  - `Include Prerequisites Installer`: Bundle required redistributables (DirectX, Visual C++ Runtime)
  - `Apply Patch on Next Launch`: Auto-apply patch after download
  - `Include Debug Files in Shipping Builds`: Include PDBs and symbols
  - `Blueprint Nativization Method`: None, Inclusive, or Exclusive (convert Blueprints to C++ for performance)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Shipping build | Build Configuration: Shipping | Final release build strips debug code and optimizes for performance |
| DnD RPG | Pak file packaging | Use Pak File: On, Use Io Store: On | Bundle all dungeon assets, character meshes, and ability data into pak files for fast loading |
| DnD RPG | Compress for distribution | Compression Format: Oodle | Oodle provides the best compression-to-speed ratio for the many texture and mesh assets in dungeons |
| DnD RPG | Include redistributables | Include Prerequisites Installer: On | Ensure DirectX and Visual C++ Runtime are bundled so players do not hit missing DLL errors |
| Wizard's Chess | Development builds for testing | Build Configuration: Development | Keep debug logging and visual profiling available during chess AI testing |
| Wizard's Chess | Always cook VFX folder | Directories to Always Cook: ["/Game/VFX/"] | Ensure all magic trail and shatter particle systems are cooked even if not directly referenced by a map |
| Both | Blueprint nativization | Blueprint Nativization: Exclusive (key BPs only) | Convert performance-critical Blueprints like BP_CombatManager or BP_ChessAI to C++ at cook time |

#### Supported Platforms
Path: `Edit > Project Settings > Project > Supported Platforms`

Toggle which platforms the project supports:
- Windows
- Linux
- macOS
- Android
- iOS / iPadOS
- Console platforms (visible when their SDKs are installed)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| Both | Windows desktop focus | Windows: On, others as needed | Both games target Windows desktop as the primary platform during development |
| DnD RPG | Future console port | Enable console platforms later | Keep console toggles off until the core game is solid, then enable for porting |

#### Target Hardware
Path: `Edit > Project Settings > Project > Target Hardware`

- **Target Hardware**:
  - `Target Hardware Class`: Desktop or Mobile
  - `Optimization Strategy`: Optimize for Maximum Quality or Scalable 3D/2D
- **Default Settings**:
  - These selections auto-configure rendering and scalability presets

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| Both | Desktop target | Target Hardware Class: Desktop | Both games are PC desktop experiences with high-fidelity visuals |
| Both | Maximum quality | Optimization Strategy: Maximum Quality | Prioritize visual quality for Lumen lighting, Nanite geometry, and Niagara VFX |

#### Custom Redirects
Path: `Edit > Project Settings > Project > Custom Redirects`

- **Active Class Redirects**: Remap old class names to new class names after refactoring
- **Active Game Name Redirects**: Remap old game module names
- **Active Plugin Redirects**: Remap old plugin names
- **Active Struct Redirects**: Remap old struct names

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Rename character classes | Active Class Redirects: old "BP_Fighter" to new "BP_Warrior" | If you rename a character class during development, redirects prevent all references from breaking |
| Wizard's Chess | Rename piece Blueprints | Active Class Redirects: old "BP_ChessPawn" to "BP_ChessPiece_Pawn" | Redirect old names to a new naming convention without updating every level and reference manually |

### Engine

#### General Settings
Path: `Edit > Project Settings > Engine > General Settings`

- **Default Classes**:
  - `Game Singleton Class`: A single persistent instance class
  - `Asset Manager Class Name`: Override the asset manager class
  - `Global Default Server GameMode`: Default GameMode on dedicated servers
  - `Global Default Client GameMode`: Default GameMode on clients
- **Framerate**:
  - `Use Fixed Frame Rate`: Lock to a specific frame rate
  - `Fixed Frame Rate`: Target FPS when fixed frame rate is enabled (default: 30 or 60)
  - `Smooth Frame Rate`: Smooth frame rate within a range
  - `Smooth Frame Rate Range`: Min and max bounds for frame rate smoothing (default: 22 to 120)
  - `Custom Time Step`: Use a custom time step class
- **Unit System**:
  - `Unit Display`: Centimeters, Meters, or Kilometers for the editor

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Smooth frame rate | Smooth Frame Rate: On, Range: 30-120 | Prevent jarring frame drops during dungeon combat with many GAS effects and AI actors |
| DnD RPG | Turn-based does not need high FPS | Fixed Frame Rate: Off | Let the frame rate float freely; turn-based combat is not timing-sensitive |
| Wizard's Chess | Consistent animation timing | Smooth Frame Rate: On, Range: 30-60 | Keep piece movement animations smooth and consistent across different hardware |
| Both | Unit display | Unit Display: Centimeters | UE5's default; 1 unit = 1 cm, making it easy to reason about piece sizes and board dimensions |

#### AI System
Path: `Edit > Project Settings > Engine > AI System`

- **General**:
  - `Enable BTStacking`: Allow Behavior Tree stacking
  - `Accept Partial Paths`: Allow AI to use incomplete navigation paths
  - `Enable AI System`: Master toggle for the AI subsystem
  - `BehaviorTree Manager Class`: Override the BT manager
  - `Environment Query Manager Class`: Override the EQS manager
  - `Perception System Class`: Override the perception system class
  - `HotSpot Manager Class`: Override the hotspot manager
- **Navigation**:
  - `bAllowStrafing`: Allow AI characters to strafe
  - `Default Sense Implementation`: Default AI perception sense class
- **Perception**:
  - `Max Debug Actors`: Number of AI actors to display debug info for

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Enable AI system | Enable AI System: On | Enemy AI uses Behavior Trees for combat decisions (attack, flee, heal, use ability) |
| DnD RPG | Accept partial paths | Accept Partial Paths: On | Goblins and skeletons can start moving even if the full path through a dungeon is not yet computed |
| DnD RPG | Debug multiple enemies | Max Debug Actors: 10 | Visualize AI state for up to 10 dungeon enemies at once during encounter testing |
| Wizard's Chess | AI chess opponent | Enable AI System: On | The chess AI uses Behavior Trees or a custom EQS to evaluate board states and pick optimal moves |
| Wizard's Chess | BT stacking for AI phases | Enable BTStacking: On | Allow the chess AI to stack opening, midgame, and endgame behavior trees for phase-based strategy |

#### Animation
Path: `Edit > Project Settings > Engine > Animation`

- **Optimization**:
  - `Warn About Blueprint Usage`: Show warnings when animation Blueprints are used inefficiently
  - `Forward Quats Animation Blending`: Use quaternion-based forward kinematic blending (more accurate)
  - `Default Enable GPU Skinning`: Enable GPU-accelerated skinning (default: on)
  - `Multiple Bones Per Chunk Limit`: Maximum bones per render chunk
  - `Strip Animation Data on Dedicated Server`: Remove animation data in server builds
  - `Tick Animation on Skeletal Mesh Init`: Start ticking animations immediately on initialization
- **Compression**:
  - `Default Bone Compression Settings`: Default compression codec
  - `Default Curve Compression Settings`: Default curve compression codec
  - `Raise Maximum Compression Error`: Maximum acceptable error threshold
- **Sequencer**:
  - `Enable Performance Logging`: Log animation performance metrics

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | GPU skinning for characters | Default Enable GPU Skinning: On | The 6 character classes each have skeletal meshes with attack, idle, and cast animations; GPU skinning keeps it fast |
| DnD RPG | Animation retargeting | Forward Quats Animation Blending: On | Share attack and movement animations between Warrior, Rogue, and Ranger with accurate quaternion blending |
| DnD RPG | Strip anims on server | Strip Animation Data on Dedicated Server: On | If running a dedicated server for multiplayer dungeon crawling, save memory by removing animation data |
| Wizard's Chess | Simple piece animations | Default Enable GPU Skinning: On | Chess pieces have slide, capture, and shatter animations that benefit from GPU acceleration |

#### Audio
Path: `Edit > Project Settings > Engine > Audio`

- **Quality**:
  - `Default Sound Class`: Default sound class for new sounds
  - `Default Sound Concurrency`: Default concurrency settings
  - `Default Base Sound Mix`: Default sound mix applied at startup
  - `Default Sound Submix`: Default submix for routing
  - `Voice Sound Class`: Sound class used for voice chat
- **Settings**:
  - `Max Channels`: Maximum number of simultaneously playing audio channels (default: 32)
  - `Common Sound Data Path`: Path to shared sound data
  - `Default Audio Compression Settings`: Default compression for audio
  - `Enable Legacy Reverb`: Use legacy reverb system
  - `Sound Distance Model`: Linear, Logarithmic, or Custom
  - `Global Min Pitch`: Minimum pitch multiplier
  - `Global Max Pitch`: Maximum pitch multiplier
- **Virtual**:
  - `Disable Audio Bus Send Virtualization`: Toggle for bus send behavior when virtualized
  - `Enable Audio Bus Submix`: Toggle audio bus submix routing
- **Platform**:
  - `Audio Device Module Name`: Platform-specific audio device module

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Max audio channels for combat | Max Channels: 64 | During a dungeon fight with 6 party members and 10 enemies, many ability sounds fire simultaneously |
| DnD RPG | Sound distance model | Sound Distance Model: Logarithmic | Sounds from distant dungeon rooms fade naturally, creating spatial awareness |
| DnD RPG | Default sound classes | Default Sound Class: SC_SFX, Voice Sound Class: SC_Dialogue | Separate SFX (sword swings, spells) from dialogue (NPC speech, AI DM narration) for independent volume control |
| Wizard's Chess | Concurrency for piece sounds | Default Sound Concurrency: limit to 8 | Prevent audio chaos when multiple pieces slide and shatter in rapid succession |
| Wizard's Chess | Ambient magical hum | Default Base Sound Mix: SM_ChessAmbient | Apply a base sound mix that always plays the mystical background ambience |

#### Collision
Path: `Edit > Project Settings > Engine > Collision`

- **Object Channels**: Define custom object channels (up to 18 custom channels in addition to the default WorldStatic, WorldDynamic, Pawn, PhysicsBody, Vehicle, Destructible)
- **Trace Channels**: Define custom trace channels for line traces and sweeps
- **Preset Profiles**: Collision presets that define default response to each channel. Built-in presets include:
  - NoCollision, BlockAll, OverlapAll, BlockAllDynamic, OverlapAllDynamic, IgnoreOnlyPawn, OverlapOnlyPawn, Pawn, Spectator, CharacterMesh, PhysicsActor, Destructible, InvisibleWall, InvisibleWallDynamic, Trigger, Ragdoll, Vehicle, UI
- **Custom Profiles**: Create, name, and configure custom collision profiles

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Custom object channels | Add: "Projectile", "Interactable", "TrapZone" | Fireball projectiles need their own channel so they hit enemies but pass through friendly characters |
| DnD RPG | Custom trace channels | Add: "AbilityTrace", "InteractionTrace" | Line traces for ability targeting (Wizard's ray spells) and interaction prompts (loot chests, doors) |
| DnD RPG | Collision presets | Create: "HeroCharacter" (blocks WorldStatic, overlaps TrapZone), "EnemyProjectile" (blocks Pawn, ignores other projectiles) | Fine-grained control over what hits what during combat |
| Wizard's Chess | Piece collision channel | Add: "ChessPiece" | Chess pieces collide with the board and other pieces but ignore environmental decorations |
| Wizard's Chess | Tile selection trace | Add trace channel: "TileSelect" | Player clicks are line-traced against the "TileSelect" channel to detect which board tile was clicked |
| Wizard's Chess | Shatter fragments | Preset: "ShatterFragment" (overlaps WorldDynamic, ignores Pawn) | Destruction fragments pass through pieces and the board after a capture, preventing physics pile-ups |

#### Console
Path: `Edit > Project Settings > Engine > Console`

- **Console Settings**:
  - `Console Key`: Key to open the in-game console (default: Tilde `~`)
  - `Auto-Complete Enabled`: Show auto-complete suggestions in the console
  - `User Console History Size`: Number of console commands to remember

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| Both | Debug console access | Console Key: Tilde (~) | Use the in-game console to run debug commands like "showdebug abilitysystem" or "stat fps" during testing |
| Both | Auto-complete for CVars | Auto-Complete Enabled: On | Quickly find console variables related to Chaos physics, Niagara, or rendering without memorizing exact names |

#### Garbage Collection
Path: `Edit > Project Settings > Engine > Garbage Collection`

- **General**:
  - `Create GC Clusters`: Group related objects to speed up garbage collection
  - `Merge GC Clusters`: Allow cluster merging for efficiency
  - `Actor Cluster Merging Enabled`: Enable cluster merging for actors specifically
  - `Blueprint Cluster Merging Enabled`: Enable cluster merging for Blueprint objects
  - `Use Incremental Reachability Analysis`: Spread reachability analysis across multiple frames
  - `Max Object Count Not Considered By GC`: Number of objects below which GC is not triggered
  - `Size of Permanent Object Pool`: Memory pool for objects that never need garbage collection (in bytes)
  - `Time Between Purging Pending Kill Objects`: Seconds between GC passes (default: 60)
  - `Flush Streaming on GC`: Flush async loading before GC
  - `Allow Parallel GC`: Enable multi-threaded garbage collection
  - `Num Retries Before Force Flush`: Number of GC attempts before forcing a full flush
  - `Minimum GC Object Count`: Minimum number of unreachable objects before GC triggers

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | GC between dungeon floors | Time Between Purging: 30 seconds | More frequent GC helps clean up destroyed enemy actors and spent ability effects between encounters |
| DnD RPG | Cluster GC for abilities | Create GC Clusters: On, Blueprint Cluster Merging: On | Group GAS ability objects (GameplayEffects, ability instances) into clusters for faster collection |
| Wizard's Chess | Clean up shatter fragments | Time Between Purging: 60 seconds (default) | After a piece capture, the shatter fragments are destroyed; GC reclaims their memory on the next pass |
| Wizard's Chess | Incremental analysis | Use Incremental Reachability Analysis: On | Spread GC work across frames to avoid a visible hitch during a chess match |

#### Input
Path: `Edit > Project Settings > Engine > Input`

- **Bindings**:
  - `Action Mappings`: Map input keys/buttons to named actions (pressed/released events). Array of mappings, each with a name and array of key bindings with optional Shift, Ctrl, Alt, Cmd modifiers
  - `Axis Mappings`: Map input axes to named float values. Each mapping has a name and array of axis keys with a scale multiplier
- **Enhanced Input** (default in 5.7):
  - `Default Input Mapping Context`: Default Input Mapping Context applied at startup
  - `Default Player Mappable Input Config`: Player-remappable input configuration
- **Default Properties**:
  - `Default Touch Interface`: Touch interface setup for mobile
  - `Default Input Component Class`: Class used for input components
  - `Default Player Input Class`: Override the player input class
- **Settings**:
  - `Always Show Touch Interface`: Force the touch interface on all platforms
  - `Enable Gesture Recognition`: Enable touch gestures (pinch, swipe, rotate)
  - `Enable Motion Controls`: Support accelerometer and gyroscope input
  - `bCaptureMouseOnLaunch`: Capture mouse on game start
  - `Default Viewport Mouse Capture Mode`: Options: Capture Permanently, Capture During Mouse Down, Capture During Right Mouse Down, No Capture
  - `Default Viewport Mouse Lock Mode`: Options: Do Not Lock, Lock on Capture, Lock Always, Lock in Fullscreen
  - `FOV Scaling`: Scale sensitivity based on field of view

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Enhanced Input for abilities | Default Input Mapping Context: IMC_DungeonCombat | Map keys to GAS ability activation: 1-6 for ability slots, LMB for basic attack, RMB for block |
| DnD RPG | Action mappings for movement | IMC_DungeonCombat: WASD movement, Shift to sprint, Space to jump, Tab for inventory | Standard RPG controls mapped through Enhanced Input for easy remapping |
| DnD RPG | Turn-based mode switching | Separate IMC_Tabletop and IMC_DungeonCombat contexts | Switch input mappings when zooming from the tabletop view into the 3D dungeon |
| DnD RPG | Mouse capture during combat | Default Viewport Mouse Capture Mode: Capture During Right Mouse Down | Right-click to look around the dungeon; release to interact with the turn-based UI |
| Wizard's Chess | Click-to-select input | IMC_Chess: LMB for tile select, RMB for camera orbit, Scroll for zoom | Simple click-based input for selecting pieces and destination tiles |
| Wizard's Chess | No mouse lock | Default Viewport Mouse Lock Mode: Do Not Lock | The cursor must remain free to click on board tiles and UI buttons |

#### Navigation Mesh
Path: `Edit > Project Settings > Engine > Navigation Mesh`

- **Generation**:
  - `Cell Size`: Horizontal resolution of the navmesh (default: 19)
  - `Cell Height`: Vertical resolution (default: 10)
  - `Agent Radius`: Radius of the navigating agent
  - `Agent Height`: Height of the navigating agent
  - `Agent Max Slope`: Maximum walkable slope in degrees (default: 44)
  - `Agent Max Step Height`: Maximum step height the agent can climb
  - `Min Region Area`: Minimum area for a navigation region to be included
  - `Merge Region Size`: Regions smaller than this merge with neighbors
  - `Max Simplification Error`: How much the navmesh edge can deviate from the source geometry
  - `Tile Size UU`: Size of each navmesh tile in Unreal Units
- **Display**:
  - `Draw Offset`: Vertical offset for navmesh debug visualization
  - `Fixed Tile Pool Size`: Use a fixed-size tile pool for predictable memory
  - `Tile Pool Size`: Number of tiles in the pool
- **Runtime**:
  - `Runtime Generation`: Options: Static, Dynamic, Dynamic Modifiers Only
  - `Max Simultaneous Tile Generation Jobs`: Number of concurrent tile builds
- **Query**:
  - `Default Query Extent`: Default search extent for navmesh queries
  - `Path Following Component Class`: Override the path following component

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Dungeon navmesh | Agent Radius: 40, Agent Height: 180, Agent Max Slope: 44 | Size the nav agent to match the hero characters so they path correctly through dungeon corridors |
| DnD RPG | Dynamic navmesh for doors | Runtime Generation: Dynamic | Doors, destructible walls, and movable obstacles change the walkable area at runtime |
| DnD RPG | Step height for stairs | Agent Max Step Height: 35 | Characters can climb dungeon staircases without getting stuck on each step |
| Wizard's Chess | Small navmesh for board | Agent Radius: 15, Agent Height: 50 | Chess pieces are smaller than characters; the nav agent must match piece proportions |
| Wizard's Chess | Static navmesh | Runtime Generation: Static | The chessboard never changes shape, so a pre-built navmesh is sufficient and cheaper |
| Wizard's Chess | Tight tile size | Tile Size UU: 100 (matching tile width) | Each navmesh tile aligns with one chess tile for precise per-square pathfinding |

#### Navigation System
Path: `Edit > Project Settings > Engine > Navigation System`

- **Agents**:
  - `Supported Agents`: Array of agent configurations (each with name, radius, height, color, and preferred navmesh)
  - `Auto Create Navigation Data`: Generate navmesh automatically when a Navigation Invoker is present
- **General**:
  - `Navigation System Class`: Override the navigation system implementation
  - `Allow Client Side Navigation`: Enable client-side navigation in multiplayer
  - `Should Discard Unreachable Nav Data`: Remove navigation data for unreachable areas
  - `Active Navigation Data Object`: Which navigation data set is active
  - `Data Gathering Mode`: Instant or Lazy
  - `Dirty Areas Update Frequency`: How often dirty navigation areas are rebuilt (in seconds)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Multiple agent sizes | Supported Agents: "Hero" (radius 40, height 180), "SmallEnemy" (radius 25, height 100) | Goblins and rats use a smaller nav agent than the hero characters, fitting through tighter gaps |
| DnD RPG | Auto-create navmesh | Auto Create Navigation Data: On | Automatically generate navmesh when placing Nav Mesh Bounds Volumes in dungeon levels |
| Wizard's Chess | Single agent type | Supported Agents: "ChessPiece" (radius 15, height 50) | All chess pieces share the same navigation agent since they all move on the same board grid |

#### Network
Path: `Edit > Project Settings > Engine > Network`

- **Replication**:
  - `Max Rep Array Size`: Maximum replicated TArray size (default: 2048)
  - `Max Rep Array Memory`: Maximum replicated TArray memory in bytes
  - `Replicated Subobject Interface`: Toggle for replicated subobject management
- **Online**:
  - `Online Subsystem`: Choose online platform (Null, Steam, EOS, etc.)
  - `Default Online Subsystem`: Default for all sessions
  - `Default Platform Service`: Platform-specific online service
- **Settings**:
  - `Net Driver Definitions`: Define custom net drivers per connection type
  - `Network Emulation Profiles`: Built-in profiles for simulating network conditions (Average, Bad, Buffer Bloat). Buffer bloat profiles added in 5.7
  - `Packet Loss Percentage`: Simulated packet loss (0 to 100)
  - `Incoming Latency`: Simulated incoming latency in ms
  - `Outgoing Latency`: Simulated outgoing latency in ms

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Future multiplayer co-op | Online Subsystem: Steam or EOS | If adding online co-op dungeon crawling, use Steam or Epic Online Services for matchmaking |
| DnD RPG | Test bad network conditions | Network Emulation: Bad profile (200ms latency, 5% packet loss) | Simulate poor connections to stress-test turn-based combat replication |
| Wizard's Chess | Online chess matches | Online Subsystem: Steam or Null (for local testing) | Support online chess matches between two players |
| Wizard's Chess | Latency testing | Incoming Latency: 100ms, Outgoing Latency: 100ms | Test that piece movement animations still look smooth with realistic network delay |

#### Physics
Path: `Edit > Project Settings > Engine > Physics`

- **Simulation**:
  - `Physics Engine`: Chaos (default and only option in 5.7)
  - `Enable Async Physics`: Run physics on a separate thread
  - `Fixed Timestep`: Physics update rate (default: 0.01667, i.e., 60 Hz)
  - `Max Substeps`: Maximum physics substeps per frame
  - `Max Substep Delta Time`: Maximum delta time per substep
  - `Max Physics Delta Time`: Maximum allowed delta time for physics
  - `Enable Solver Warm Starting`: Improve solver stability across frames
  - `Solver Iteration Count`: Number of constraint solver iterations (default: 8)
  - `Solver Push Out Iteration Count`: Iterations for depenetration (default: 3)
- **Chaos-Specific** (5.7):
  - `Min Parallel Task Size`: CVar `p.Chaos.MinParallelTaskSize` for low-core platform optimization
  - `Partial Sleeping (Experimental)`: Enable experimental partial sleeping for large unstructured piles
- **Gravity**:
  - `Default Gravity Z`: Default gravity in the Z direction (default: -980)
  - `Global Default Gravity Z`: Override gravity globally
- **Physical Materials**:
  - `Default Phys Material`: Default physical material for objects without one assigned
  - `Physical Surface Types`: Define custom surface types for physical interactions (up to 62 custom types)
- **Collision**:
  - `Ragdoll Aggregate Threshold`: Number of bodies before aggregation
  - `Enable CCD (Continuous Collision Detection)`: Prevent tunneling for fast-moving objects
  - `Default Shape Complexity`: Collision shape complexity for generated collision
- **Async**:
  - `Enable Enhanced Determinism`: Enable deterministic simulation for replay and networking
  - `Initial Average Frame Rate`: Used to initialize fixed timestep calculations

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Chaos physics for destruction | Physics Engine: Chaos | Destructible dungeon walls, breakable crates, and loot explosions all use Chaos Destruction |
| DnD RPG | CCD for projectiles | Enable CCD: On | Fast-moving projectiles like arrows (Ranger) and magic bolts (Wizard) must not tunnel through thin walls |
| DnD RPG | Custom surface types | Physical Surface Types: "Stone", "Wood", "Metal", "Flesh" | Different footstep sounds and impact VFX when walking on stone dungeon floors vs wooden bridges |
| DnD RPG | Gravity default | Default Gravity Z: -980 | Standard Earth gravity for realistic character movement and falling |
| Wizard's Chess | Shatter physics | Physics Engine: Chaos, Enable Async Physics: On | Captured pieces shatter into fragments that scatter across the board using Chaos Destruction |
| Wizard's Chess | Reduced solver iterations | Solver Iteration Count: 4 | Chess piece fragments do not need high-fidelity stacking; fewer iterations save CPU |
| Wizard's Chess | Surface types for board | Physical Surface Types: "Marble", "Crystal" | Different impact sounds when pieces land on marble tiles vs crystal-enchanted squares |
| Wizard's Chess | Enhanced determinism | Enable Enhanced Determinism: On | Ensure shatter physics look identical in replays and across networked clients |

#### Rendering
Path: `Edit > Project Settings > Engine > Rendering`

- **Default Settings**:
  - `Forward Shading`: Use forward rendering instead of deferred
  - `Vertex Fogging for Opaque`: Apply atmospheric fog per-vertex for opaque objects
  - `Early Z-Pass`: Options: Auto, Opaque Only, Opaque and Masked, None
- **Nanite**:
  - `Allow Nanite`: Master toggle for Nanite geometry
  - `Allow Nanite for Foliage (Experimental)`: Enable Nanite Foliage
  - `Nanite Proxy Triangle Percent`: Fallback proxy mesh triangle percentage
- **Substrate**:
  - `Enable Substrate`: Master toggle for Substrate material framework
  - `Substrate Backward Compatibility`: Maintain support for legacy material expressions
- **MegaLights**:
  - `Enable MegaLights`: Master toggle for MegaLights (Beta)
- **Lumen**:
  - `Dynamic Global Illumination Method`: Options: None, Lumen, Screen Space
  - `Reflection Method`: Options: None, Lumen, Screen Space
  - `Software Ray Tracing Mode`: Deprecated in 5.7 (SWRT detail tracing removed)
  - `Hardware Ray Tracing`: Enable HWRT for Lumen (recommended path in 5.7)
  - `Lumen Scene Lighting Quality`: Quality preset for scene lighting
- **Anti-Aliasing**:
  - `Anti-Aliasing Method`: Options: None, FXAA, TAA, TSR, MSAA (Forward only), SMAA (Experimental in 5.7)
  - `MSAA Sample Count`: 1, 2, 4, or 8 (Forward rendering only)
- **Global Illumination**:
  - `Dynamic Global Illumination Method`: None, Lumen, or Screen Space
- **Shadows**:
  - `Shadow Map Method`: Shadow Maps or Virtual Shadow Maps
  - `Virtual Shadow Map Enable`: Use Virtual Shadow Maps (default with Nanite)
- **Post Processing**:
  - `Bloom`: Enable bloom post-process
  - `Ambient Occlusion`: Enable ambient occlusion
  - `Auto Exposure`: Enable auto exposure. Options: Histogram, Basic, Manual
  - `Motion Blur`: Enable motion blur
  - `Lens Flare`: Enable lens flare
  - `Screen Space Reflections`: Enable SSR
- **Mobile**:
  - `Mobile HDR`: Enable HDR on mobile platforms
  - `Mobile MSAA`: MSAA sample count on mobile
  - `Use Full Precision in Materials`: Force full float precision on mobile
- **VR / XR**:
  - `Instanced Stereo Rendering`: Render both eyes in a single pass
  - `Mobile Multi-View`: Multi-view rendering for mobile VR
  - `Round Robin Occlusion Queries`: Alternate occlusion queries between eyes
- **Textures**:
  - `Texture Streaming`: Enable runtime texture streaming
  - `Virtual Textures`: Enable Virtual Texture support
  - `Virtual Texture Tile Size`: Size of virtual texture tiles
- **Culling**:
  - `Occlusion Culling`: Enable hardware occlusion queries
  - `Min Screen Radius for Lights`: Minimum screen size before lights are culled
  - `Min Screen Radius for Early Z Pass`: Minimum screen size for early Z
- **Misc**:
  - `Support Atmospheric Fog`: Enable atmospheric fog system
  - `Support Sky Atmosphere`: Enable the Sky Atmosphere component
  - `Support Volumetric Fog`: Enable volumetric fog
  - `Support Mesh Distance Fields`: Generate distance fields for meshes (required for Lumen SWRT)
  - `Support Hardware Ray Tracing`: Enable hardware ray tracing support
  - `Custom Depth-Stencil Pass`: Enable custom depth/stencil for post-processing effects

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Lumen for dungeon lighting | Dynamic GI Method: Lumen, Reflection Method: Lumen | Torchlight bounces realistically off stone walls, creating atmospheric dungeon lighting without baking |
| DnD RPG | Hardware ray tracing | Hardware Ray Tracing: On | Use HWRT for accurate reflections on polished dungeon floors and metallic armor |
| DnD RPG | Nanite for dungeon geometry | Allow Nanite: On | High-poly cave walls and detailed stone carvings render efficiently with Nanite virtualized geometry |
| DnD RPG | Virtual Shadow Maps | Virtual Shadow Map Enable: On | Sharp, detailed shadows from dozens of torches and magical light sources in a dungeon room |
| DnD RPG | Custom depth for outlines | Custom Depth-Stencil Pass: On | Render selection outlines on interactable objects (loot chests, doors, NPCs) using custom depth |
| DnD RPG | Motion blur for combat | Motion Blur: On | Add cinematic motion blur to fast combat animations like sword swings and dodge rolls |
| DnD RPG | Post-process bloom for magic | Bloom: On | Magical abilities (Fireball, Healing Word) glow with bloom for a satisfying visual punch |
| Wizard's Chess | Lumen reflections on board | Reflection Method: Lumen | The polished marble chessboard reflects piece silhouettes and overhead lighting beautifully |
| Wizard's Chess | Anti-aliasing | Anti-Aliasing Method: TSR | Temporal Super Resolution keeps chess piece edges clean, especially on thin details like crowns and crosses |
| Wizard's Chess | Volumetric fog | Support Volumetric Fog: On | Mystical fog swirls around the board, reacting to piece captures and check events |
| Wizard's Chess | No motion blur | Motion Blur: Off | Chess is a slow, deliberate game; motion blur would smear the piece movement animations unnecessarily |
| Wizard's Chess | Custom stencil for highlights | Custom Depth-Stencil Pass: On | Highlight valid move tiles with a glowing outline using custom stencil values |

#### Streaming
Path: `Edit > Project Settings > Engine > Streaming`

- **Level Streaming**:
  - `Level Streaming`: Enable level streaming
  - `Async Loading Time Limit`: Maximum time per frame for async loading (ms)
  - `Use Background Level Streaming`: Load levels on background threads
  - `Priority Async Loading Time Limit`: Time limit for priority loads
  - `Level Streaming Actions Timeout`: Timeout for streaming actions
  - `Level Streaming Component Stall`: Time before a streaming component stalls
  - `Flush Level Streaming on GC`: Flush streaming state before garbage collection
  - `Use Level Color for Streaming Volumes`: Color-code streaming volumes by level

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Stream dungeon floors | Level Streaming: On, Use Background Level Streaming: On | Load Dungeon_Floor2 in the background while the player is still on Floor 1, preventing load screen hitches |
| DnD RPG | Async loading for encounters | Async Loading Time Limit: 5ms | Limit per-frame loading time so enemy spawns and ability assets stream in without frame drops |
| Wizard's Chess | Minimal streaming needed | Level Streaming: On (for arena swaps) | Stream different arena environments (library, throne room, garden) around the chess board |

#### Tutorials
Path: `Edit > Project Settings > Engine > Tutorials`

- Links to in-editor and online tutorials
- Toggle tutorial prompts per-feature

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| Both | Disable tutorial prompts | Toggle all off | Once you know the engine, tutorial prompts just slow down your workflow |

#### User Interface
Path: `Edit > Project Settings > Engine > User Interface`

- **Fonts**:
  - `Default Font`: Default font family for UMG
  - `Default Font Size`: Default text size
- **Rendering**:
  - `Render Focus Rule`: When to show widget focus indicators. Options: Always, Non-Pointer, Navigation Only, Never
  - `Software Cursor Widgets`: Custom cursor widgets for different cursor types
  - `Default Cursor`: Override the default cursor
  - `Application Scale`: Global UI scaling factor
  - `Custom Safe Zone`: Platform safe zone percentages
- **DPI Scaling**:
  - `DPI Scaling Rule`: How DPI scaling is applied. Options: Shortest Side, Longest Side, Horizontal, Vertical
  - `DPI Curve`: Float curve mapping resolution to scale factor
  - `Force DPI Scale to 1.0 in PIE`: Override scaling in Play In Editor

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | DPI scaling for HUD | DPI Scaling Rule: Shortest Side | The combat HUD (health bars, ability icons, turn order) scales correctly on different monitor resolutions |
| DnD RPG | Render focus for keyboard nav | Render Focus Rule: Navigation Only | Show focus indicators only when navigating the inventory or ability menus with a gamepad |
| DnD RPG | Custom cursor | Default Cursor: a custom gauntlet or pointer widget | Replace the default arrow with a thematic RPG cursor |
| Wizard's Chess | DPI scaling for move UI | DPI Scaling Rule: Shortest Side | The move history panel and piece selection UI scale properly across resolutions |
| Wizard's Chess | Application scale | Application Scale: 1.0 | Keep UI elements at standard size since the chess game has a clean, minimal interface |

### Game

#### Asset Manager
Path: `Edit > Project Settings > Game > Asset Manager`

- **Primary Asset Types**:
  - Array of primary asset type definitions, each with:
    - `Primary Asset Type`: Name identifier
    - `Asset Base Class`: Base class for this type
    - `Directories`: Directories to scan for assets of this type
    - `Rules`: Cooking and chunking rules (which chunk, priority, apply recursively)
    - `Cook Rule`: Always Cook, Dev Cook Only, Never Cook, Production Cook
    - `Label Rules`: Labeling and chunking behavior
- **Settings**:
  - `Should Manager Determine Type and Name`: Let the asset manager auto-detect types
  - `Should Guess Type and Name in Editor`: Guess type/name for unregistered assets
  - `Should Acquire Missing Chunks on Load`: Download missing chunks on demand

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Primary asset types | Define: "DungeonLevel" (base class: World), "CharacterClass" (base class: BP_HeroBase), "GameplayAbility" | The Asset Manager knows how to find and load dungeon levels, character classes, and abilities by type |
| DnD RPG | Chunking for DLC | Cook Rule: separate chunks per dungeon pack | Future dungeon DLC packs can be distributed as individual chunks |
| Wizard's Chess | Primary asset types | Define: "ChessSet" (base class: BP_ChessSetBase) | Different chess set themes (medieval, crystal, undead) can be managed as primary asset types |

#### Gameplay Tags
Path: `Edit > Project Settings > Game > Gameplay Tags`

- **Gameplay Tags**:
  - `Gameplay Tag Table List`: Array of DataTable assets containing gameplay tag definitions
  - `Gameplay Tag INI List`: Array of .ini files containing tag definitions
  - `Fast Replication`: Use an indexed array for faster tag replication
  - `Invalid Tag Characters`: Characters not allowed in tag names
  - `Clear Invalid Tags`: Remove invalid tags on load
  - `Warn on Invalid Tags`: Log warnings for invalid tags
  - `Allow Editor Tags`: Allow tags that exist only in the editor
  - `Import Tags from Config`: Import tags from DefaultGameplayTags.ini
  - `Net Index First Bit Segment`: Network serialization configuration

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | GAS gameplay tags | Tags: "Ability.Offensive.Fireball", "Ability.Defensive.ShieldBash", "Status.Stunned", "Status.Poisoned", "Class.Warrior", "Class.Rogue" | GAS relies heavily on Gameplay Tags for ability activation, blocking, and status effects |
| DnD RPG | Combat state tags | Tags: "Combat.TurnActive", "Combat.Waiting", "Combat.Victory", "Combat.Defeat" | Track combat states with tags so Behavior Trees and GAS can query them |
| DnD RPG | Loot rarity tags | Tags: "Loot.Common", "Loot.Rare", "Loot.Epic", "Loot.Legendary" | Tag loot items by rarity for filtering, UI display, and drop rate calculations |
| DnD RPG | Fast replication | Fast Replication: On | Gameplay Tags replicate frequently in multiplayer; indexed arrays make this cheaper |
| Wizard's Chess | Game state tags | Tags: "Game.InProgress", "Game.Check", "Game.Checkmate", "Game.Stalemate", "Piece.Selected", "Piece.Captured" | Track game state and piece status with tags for clean event-driven logic |
| Wizard's Chess | Piece type tags | Tags: "Piece.King", "Piece.Queen", "Piece.Bishop", "Piece.Knight", "Piece.Rook", "Piece.Pawn" | Identify piece types for move validation and special rules (castling, en passant, promotion) |

#### Online
Path: `Edit > Project Settings > Game > Online`

- **Online Subsystem Settings**: Configured per platform. Defines session, matchmaking, leaderboard, and achievement backend settings for the selected online subsystem

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Co-op matchmaking | Online Subsystem: Steam, session settings for 1-4 players | Find and join dungeon crawl parties through Steam matchmaking |
| Wizard's Chess | Ranked chess matches | Online Subsystem: Steam, leaderboard integration | Track win/loss records and ELO ratings through Steam leaderboards |

### Platforms

#### Windows
Path: `Edit > Project Settings > Platforms > Windows`

- **Targeted RHIs**: Select rendering APIs to support:
  - DirectX 12 (default)
  - DirectX 11
  - Vulkan
- **D3D12 Target Shader Formats**: SM5, SM6
- **Build**:
  - `Minimum OS Version`: Minimum Windows version requirement
  - `Use Manifested PhysX`: PhysX manifest (legacy, Chaos is default)
- **Audio**:
  - `Audio Device`: Select audio backend (XAudio2, Windows Sonic)

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| Both | DirectX 12 rendering | Targeted RHIs: DirectX 12, Shader Format: SM6 | DX12 is required for Lumen hardware ray tracing and Nanite, both used heavily in these games |
| Both | Windows Sonic for spatial audio | Audio Device: Windows Sonic | 3D spatial audio makes dungeon sounds directional and chess piece movements positionally accurate |

#### Linux
Path: `Edit > Project Settings > Platforms > Linux`

- **Targeted RHIs**: Vulkan (default)
- **Build**:
  - `Target Architecture`: x86_64 or ARM64
  - `Enable Vulkan Validation Layers`: For debugging

#### Mac
Path: `Edit > Project Settings > Platforms > Mac`

- **Targeted RHIs**: Metal (default)
- **Build**:
  - `Target Architecture`: x86_64 or ARM64 (Apple Silicon)
  - `Bundle Identifier`: Application bundle ID
  - `Minimum macOS Version`: Minimum supported macOS version

#### Android
Path: `Edit > Project Settings > Platforms > Android`

- **APK Packaging**:
  - `Minimum SDK Version`: Minimum Android API level (default: 28)
  - `Target SDK Version`: Target API level (default: 34)
  - `Package Name`: Application package identifier (e.g., com.company.project)
  - `Store Version`: Integer version code
  - `Store Version Offset`: Offset for multi-APK version codes
  - `Application Display Name`: App name on device
  - `Orientation`: Portrait, Landscape, Sensor, or Full Sensor
  - `Enable Full Screen Immersive Mode`: Hide navigation and status bars
  - `Enable Improved Virtual Keyboard`: Use the improved on-screen keyboard
- **Build**:
  - `Support arm64`: Enable 64-bit ARM (required, default: on)
  - `Support x86_64`: Enable x86_64 for emulators and ChromeOS
  - `Build for Distribution`: Produce a signed release build
  - `Enable Gradle Instead of Ant`: Use Gradle build system (default)
- **Graphics**:
  - `Support Vulkan`: Enable Vulkan rendering
  - `Support OpenGL ES3.2`: Enable GLES 3.2 fallback
- **Audio**:
  - `Audio Device`: Oboe or OpenSL
- **Google Play Services**:
  - `Enable Google Play Support`: Integrate Google Play services
  - `Games App ID`: Google Play Games app identifier
  - `Ad Mob Ad Unit ID`: AdMob integration
- **Distribution Signing**:
  - `Key Store`: Path to the signing keystore
  - `Key Alias`: Key alias within the keystore
  - `Key Store Password`: Password for the keystore
  - `Key Password`: Password for the specific key
- **Fast Iterate (5.7)**:
  - `-FastIterate` flag for placing libUnreal.so outside APK during development
  - Early dependency loading for faster startup

#### iOS
Path: `Edit > Project Settings > Platforms > iOS`

- **Build**:
  - `Bundle Identifier`: Application bundle ID
  - `Bundle Display Name`: App name on device
  - `Bundle Name`: Short bundle name
  - `Bundle Version`: Version string
  - `Minimum iOS Version`: Minimum supported iOS version
  - `Targeted Device Family`: iPhone, iPad, or Universal
  - `Support Metal`: Enable Metal rendering (required)
  - `Max Metal Shader Standard`: Maximum Metal shader version
- **Online**:
  - `Enable Remote Notifications`: Support push notifications
  - `Enable Cloud Kit Support`: iCloud integration
- **Signing**:
  - `Automatic Signing`: Use Xcode automatic signing
  - `IOS Team ID`: Developer team identifier
  - `Provisioning Profile`: Manual provisioning profile selection

### Plugins

Path: `Edit > Project Settings > Plugins`

Each enabled plugin may add its own settings page under this category. Common plugin settings include:

- **Niagara**: VFX system settings, default emitter and system assets
- **Online Subsystem (Steam, EOS)**: Platform-specific authentication and session configuration
- **Enhanced Input**: Input mapping context defaults and debugging options
- **Paper2D**: 2D game settings
- **Live Link**: Source presets and connection defaults
- **MetaHuman**: MetaHuman Creator plugin configuration
- **PCG**: Procedural Content Generation plugin settings and graph defaults
- **Chaos**: Physics destruction, cloth, and hair settings
- **Composure**: Compositing layer configuration

**In your games:**

| Game | Use Case | Setting/Value | Why |
|------|----------|---------------|-----|
| DnD RPG | Niagara for ability VFX | Niagara plugin: configure default emitter templates | Set up reusable Niagara templates for fire, ice, lightning, and healing spell effects |
| DnD RPG | Enhanced Input plugin | Enhanced Input: default IMC and debugging | Configure the input system that handles all RPG controls, ability hotkeys, and menu navigation |
| DnD RPG | Chaos for destructibles | Chaos plugin: destruction and cloth settings | Configure Chaos Destruction for breakable dungeon props and cloth simulation for character capes |
| DnD RPG | PCG for procedural dungeons | PCG plugin: graph defaults | Set up PCG defaults for procedurally placed dungeon decorations and environmental props |
| Wizard's Chess | Niagara for magic effects | Niagara plugin: configure default systems | Default Niagara templates for magic trails, board glow effects, and piece shatter particles |
| Wizard's Chess | Chaos for shatter physics | Chaos plugin: destruction settings | Fine-tune how chess pieces fracture and scatter when captured |

---
