## Plugins

### Built-in Plugins (Notable)

| Plugin | Description |
|--------|-------------|
| **Niagara** | VFX system (particle systems, simulations) |
| **Chaos** | Physics and destruction system |
| **Enhanced Input** | Modern input system with contexts, modifiers, triggers |
| **Common UI** | Cross-platform UI framework (gamepad, mouse, touch) |
| **PCG (Procedural Content Generation)** | Procedural world population (Production-Ready in 5.7) |
| **Online Subsystem** | Networking abstraction (sessions, identity, friends) |
| **Online Subsystem Steam** | Steam platform integration |
| **Online Subsystem EOS** | Epic Online Services integration |
| **Paper2D** | 2D game framework (sprites, tilemaps, flipbooks) |
| **Gameplay Abilities (GAS)** | Attribute, ability, and effect system for RPG-style gameplay |
| **Modeling Tools Editor Mode** | In-editor mesh modeling and UV editing |
| **Geometry Script** | Runtime geometry generation via Blueprints/C++ |
| **MetaHuman** | High-fidelity digital human framework |
| **Water** | Water body system (ocean, lake, river) |
| **Landmass** | Landscape editing utilities |
| **Movie Render Queue** | High-quality offline rendering |
| **Sequencer** | Cinematic sequence editor |
| **Datasmith** | CAD/BIM/DCC data import |
| **Live Link** | Real-time data streaming from external sources |
| **Pixel Streaming** | Stream rendered frames to web browsers |
| **OpenXR** | VR/AR headset support |
| **MediaFramework** | Video playback and media capture |
| **Bridge (Fab/Quixel)** | Asset library integration |
| **Control Rig** | Procedural rigging system |
| **IK Rig** | Inverse kinematics setup |
| **Mass Entity / Mass AI** | Large-scale entity simulation framework |
| **State Tree** | Hierarchical state machine for AI and game logic |
| **Smart Objects** | Environmental interaction points for AI |
| **PCG FastGeo Interop** | GPU PCG with FastGeometry components (new in 5.7) |

> **In your games:**
> - **DnD RPG** (enable all of these):
>   - **Gameplay Abilities (GAS)**: The backbone of your ability system. Handles attributes (health, mana, strength), abilities (fireball, heal, melee attack), and gameplay effects (damage, buffs, debuffs). This is non-negotiable for an RPG.
>   - **Enhanced Input**: Modern input handling with contexts. You will have different input contexts for exploration (WASD, camera), combat (ability hotkeys, target selection), inventory (mouse-driven UI), and tabletop view (zoom, pan).
>   - **Niagara**: All your VFX. Spell effects (fireball, lightning bolt, healing aura), environmental particles (torch flames, dungeon dust, fog), and the tabletop-to-3D transition effect.
>   - **PCG (Procedural Content Generation)**: Generate dungeon layouts, scatter props (barrels, crates, rubble), and populate rooms with decorations procedurally. Saves hours of manual placement across multiple dungeon levels.
>   - **State Tree**: Drive AI behavior for enemies. Goblins patrol, detect the player, attack, and retreat based on hierarchical states. Cleaner than raw behavior trees for complex enemy logic.
>   - **Smart Objects**: Define interaction points in dungeons. Enemies use cover points, chests are lootable, doors can be opened, and NPCs sit at tables. The AI queries Smart Objects to find valid interactions.
>   - **Mass Entity / Mass AI**: If you have large encounters (20+ enemies in a room), Mass AI handles them efficiently. Useful for the "miniatures come alive" tabletop view with many units.
>   - **Common UI**: Essential if you want your UI (inventory, ability bar, dialogue) to work with both mouse/keyboard and gamepad.
>   - **Control Rig / IK Rig**: Procedural foot placement on uneven dungeon floors, weapon aiming, and look-at behavior for characters.
> - **Wizard's Chess** (enable these):
>   - **Niagara**: Capture effects (explosion of magical particles when a piece is taken), ambient board effects (glowing squares, floating dust), and piece movement trails.
>   - **Enhanced Input**: Mouse click to select pieces, drag to move, right-click to deselect. Simpler input context than the RPG.
>   - **Sequencer**: Choreograph capture animations. When a queen takes a pawn, a short cinematic sequence plays showing the magical destruction.
> - **Both projects**: Disable plugins you do not use (Paper2D, OpenXR, Pixel Streaming, Datasmith, Water, Landmass) to reduce build times.

### Enabling/Disabling Plugins

- **Edit > Plugins** opens the Plugin Browser.
- Search or browse by category.
- Toggle the **Enabled** checkbox.
- Some plugins require an editor restart to take effect.
- Plugin state is saved in `MyProject.uproject` under the `"Plugins"` array.
- Disable unnecessary plugins to reduce build times and binary size.

> **In your games:**
> - **DnD RPG**: After enabling GAS, Enhanced Input, Niagara, PCG, State Tree, Smart Objects, Common UI, Control Rig, and IK Rig, you have about 10 plugins active. Disable everything else you are not using. Check the Plugin Browser periodically as you progress through modules, and only enable new plugins when you actually need them.
> - **Wizard's Chess**: You only need Niagara, Enhanced Input, and Sequencer. Keep it lean. Fewer active plugins means faster compile times and smaller builds.
> - **Both**: After toggling plugins, the editor will prompt for a restart. Save your work first.

### Creating Plugins

#### Content-Only Plugins

1. **Edit > Plugins > Add > Content Only** (or use the Plugin wizard).
2. Creates a plugin folder under `Plugins/MyPlugin/` with a `.uplugin` descriptor and `Content/` folder.
3. No C++ code; just content assets that can be shared or distributed.

#### C++ Plugins

1. **Edit > Plugins > Add > Blank** (or other C++ template).
2. Creates `Plugins/MyPlugin/` with:
   - `MyPlugin.uplugin`: Plugin descriptor (JSON).
   - `Source/MyPlugin/`: Module source (`MyPlugin.h`, `MyPlugin.cpp`, `MyPlugin.Build.cs`).
   - `Content/`: Optional content folder.
   - `Resources/`: Icons and other resources.
3. The `.uplugin` file defines: `FriendlyName`, `Description`, `Category`, `Modules` (with `Type`: Runtime, Editor, Developer, Program, and `LoadingPhase`: Default, PreLoadingScreen, PostEngineInit, etc.).
4. Module types:
   - **Runtime**: Loaded in all configurations (game and editor).
   - **Editor**: Loaded only in editor.
   - **Developer**: Loaded in non-shipping builds.
   - **Program**: Standalone program module.

> **In your games:**
> - **DnD RPG**: You might create a custom plugin for your inventory system if you want to reuse it across projects or share it. Structure it as a **Runtime** module so it works in both editor and packaged builds. For example:
>   ```
>   Plugins/
>       TQInventory/
>           TQInventory.uplugin
>           Source/TQInventory/    # Inventory component, item data assets, UI widgets
>           Content/               # Default item icons, UI layouts
>   ```
>   If you build editor tools (e.g., a dungeon layout visualizer), make that an **Editor** module so it does not ship with the game.
> - **Wizard's Chess**: You probably do not need custom plugins. Keep all your code in the main project `Source/` folder. Creating a plugin adds complexity that is not worth it for a smaller project.

### Marketplace Plugins (Fab)

- Browse: [fab.com](https://fab.com) (formerly UE Marketplace).
- Install via the Epic Games Launcher or Fab plugin.
- Marketplace plugins are installed to `Engine/Plugins/Marketplace/` or can be copied to `Project/Plugins/`.
- Paid plugins require a valid license linked to your Epic account.
- Vault cache location configurable in Epic Games Launcher settings.

> **In your games:**
> - **DnD RPG**: Browse Fab for dungeon asset packs (modular dungeon tiles, medieval props, fantasy character meshes). Install them to `Project/Plugins/` rather than the engine plugins folder so they travel with your Git repo. Be mindful that marketplace assets can be large, so LFS tracking is important.
> - **Wizard's Chess**: Look for stylized chess piece meshes or magical VFX packs on Fab if you want a head start on visuals. A good particle pack can save days of Niagara work.
