## Project File Structure

### Root Folder

```
MyProject/
    MyProject.uproject          # Project descriptor file (JSON)
    Content/                    # All content assets
    Config/                     # Configuration .ini files
    Source/                     # C++ source code
    Binaries/                   # Compiled binaries
    Intermediate/               # Build intermediates
    Saved/                      # Local saves, logs, autosaves
    Plugins/                    # Project-local plugins
    Build/                      # Platform build scripts
    DerivedDataCache/           # Local derived data cache
```

> **In your games:**
> - **DnD RPG** root structure:
>   ```
>   TabletopQuest/
>       TabletopQuest.uproject
>       Content/            # All game assets (see Content section below)
>       Config/             # Engine, game, input settings
>       Source/             # C++ classes: character base, GAS abilities, AI controllers, game mode, inventory
>       Plugins/            # Project-local plugins if needed
>       Saved/              # Logs, profiling traces, cooked content (not committed to Git)
>       Binaries/           # Compiled DLLs (not committed to Git)
>       Intermediate/       # Build intermediates (not committed to Git)
>   ```
> - **Wizard's Chess** root structure is identical, just smaller in content volume. Same folder conventions apply.

### Content Folder

- All `.uasset` and `.umap` files live here.
- Organized by content type: Blueprints, Materials, Meshes, Textures, Maps, Audio, Animations, UI, etc.
- `Content/` maps to `/Game/` in the asset path system.
- `Content/Developers/` is a per-user folder (excluded from cooking by default).

> **In your games:**
> - **DnD RPG**: With 10 modules of learning content, organize your Content folder by game system rather than asset type. This keeps related assets together:
>   ```
>   Content/
>       Characters/
>           Player/             # Player Blueprint, mesh, anims, materials
>           Enemies/
>               Goblin/         # Goblin BP, mesh, anims, AI behavior tree
>               Skeleton/       # Same structure per enemy type
>       Abilities/
>           Fireball/           # GAS ability, Niagara VFX, sound cues
>           HealingWord/
>       Dungeon/
>           Tiles/              # Modular dungeon pieces for PCG
>           Props/              # Barrels, crates, torches
>           Lighting/           # Light profiles, IES textures
>       Tabletop/
>           Board/              # Tabletop overview assets
>           Miniatures/         # Miniature versions of characters
>       UI/
>           HUD/                # Health bars, ability cooldowns
>           Menus/              # Main menu, pause, inventory screen
>       Maps/
>           MainMenu/
>           Dungeon_01/
>           Dungeon_02/
>       Audio/
>           Music/
>           SFX/
>       Core/                   # Game mode, game state, shared data assets
>   ```
> - **Wizard's Chess**: Simpler structure:
>   ```
>   Content/
>       Board/                  # Board mesh, materials, squares
>       Pieces/
>           King/               # Mesh, material, capture VFX
>           Queen/
>           Bishop/
>           Knight/
>           Rook/
>           Pawn/
>       VFX/                    # Shared Niagara systems for captures, moves
>       UI/                     # Turn indicator, move history, menus
>       Audio/                  # Piece movement sounds, capture sounds, music
>       Maps/
>           GameBoard/
>           MainMenu/
>       Core/                   # Game mode, game state, chess logic
>   ```

### Config Folder

All `.ini` configuration files. These use a layered override system:

#### DefaultEngine.ini

Engine-level settings: rendering, physics, audio, streaming, GC, networking, platform features.

```ini
[/Script/Engine.RendererSettings]
r.DefaultFeature.AutoExposure=True
r.GenerateMeshDistanceFields=True

[/Script/Engine.Engine]
GameEngine=/Script/Engine.GameEngine

[/Script/Engine.PhysicsSettings]
DefaultGravityZ=-980.000000
```

#### DefaultGame.ini

Game-level settings: project name, description, maps to cook, default maps.

```ini
[/Script/EngineSettings.GameMapsSettings]
EditorStartupMap=/Game/Maps/MainMenu
GameDefaultMap=/Game/Maps/MainMenu
TransitionMap=
GlobalDefaultGameMode=/Script/MyProject.MyGameMode

[/Script/UnrealEd.ProjectPackagingSettings]
BuildConfiguration=PPBC_Shipping
StagingDirectory=../Builds
```

#### DefaultInput.ini

Input mapping configuration: Enhanced Input action mappings, axis mappings, input settings.

```ini
[/Script/Engine.InputSettings]
DefaultPlayerInputClass=/Script/EnhancedInput.EnhancedPlayerInput
DefaultInputComponentClass=/Script/EnhancedInput.EnhancedInputComponent
```

#### DefaultEditor.ini

Editor preferences persisted per-project: asset import settings, editor feature flags.

#### Platform-Specific Configs

- `Config/Windows/WindowsEngine.ini`
- `Config/Android/AndroidEngine.ini`
- `Config/IOS/IOSEngine.ini`
- `Config/PS5/PS5Engine.ini`
- `Config/XSX/XSXEngine.ini`

These override `Default*.ini` settings for the specific platform.

> **In your games:**
> - **DnD RPG**: Your `DefaultGame.ini` should set the startup map to your main menu and define your custom game mode:
>   ```ini
>   [/Script/EngineSettings.GameMapsSettings]
>   EditorStartupMap=/Game/Maps/MainMenu/MainMenu
>   GameDefaultMap=/Game/Maps/MainMenu/MainMenu
>   GlobalDefaultGameMode=/Script/TabletopQuest.ATQGameMode
>   ```
>   Your `DefaultInput.ini` should reference Enhanced Input (for WASD movement, ability hotkeys, camera controls):
>   ```ini
>   [/Script/Engine.InputSettings]
>   DefaultPlayerInputClass=/Script/EnhancedInput.EnhancedPlayerInput
>   DefaultInputComponentClass=/Script/EnhancedInput.EnhancedInputComponent
>   ```
>   Your `DefaultEngine.ini` should enable features like mesh distance fields (for Lumen) and set gravity.
> - **Wizard's Chess**: Similar setup but the game mode is simpler (turn-based chess logic, no character movement). Enhanced Input handles mouse clicks for piece selection and board interaction.
> - **Both**: You only need `Config/Windows/` for platform overrides since you are targeting Windows only.

### Saved Folder

```
Saved/
    Autosaves/          # Periodic auto-saved maps and assets
    Backup/             # Backup copies of assets
    Config/             # Runtime config overrides (local machine)
    Crashes/            # Crash reports and minidumps
    Logs/               # Log files (MyProject.log, etc.)
    Screenshots/        # Captured screenshots (F9 or HighResShot)
    Cooked/             # Cooked content (per platform)
    StagedBuilds/       # Staged packaging output
    Profiling/          # Profiling data (traces, memory reports)
    Collections/        # Content Browser collections
```

### Other Folders

- **Intermediate/**: Build intermediates (compiled shaders, object files, generated headers). Safe to delete; will be regenerated.
- **Binaries/**: Compiled DLLs/executables. `Binaries/Win64/MyProjectEditor.dll`, `Binaries/Win64/MyProject.exe`.
- **Source/**: C++ source. `Source/MyProject/` contains `.cpp` and `.h` files, plus `MyProject.Build.cs` and `MyProject.Target.cs`.
- **Plugins/**: Project-local plugins. Each plugin has its own `Content/`, `Source/`, `Config/`, `Binaries/`, and `.uplugin` descriptor.

> **In your games:**
> - **DnD RPG**: Key folders to know:
>   - `Source/TabletopQuest/`: Your C++ classes live here. Character base class, GAS ability classes, AI controller, game mode, inventory component, and build files (`.Build.cs`, `.Target.cs`).
>   - `Saved/Profiling/`: Where Unreal Insights traces land when you profile dungeon performance.
>   - `Saved/Logs/`: Check `TabletopQuest.log` when something crashes or behaves unexpectedly.
>   - `Intermediate/`: Safe to delete if your build gets corrupted. The engine regenerates everything.
>   - `Plugins/`: If you create a custom plugin (e.g., a reusable inventory system), it lives here with its own `Source/` and `Content/` folders.
> - **Wizard's Chess**: Same principles. `Source/WizardsChess/` holds your chess logic C++ classes. The `Saved/` folder is your debugging companion for profiling capture VFX performance.
