## Content Browser

The Content Browser is the primary interface for managing all project assets. It provides tools for browsing, searching, creating, importing, and organizing content.

### Opening the Content Browser

- **Menu**: `Window > Content Browser > Content Browser 1` (through Content Browser 4)
- **Shortcut**: `Ctrl + Space` to toggle focus
- Up to four Content Browser instances can be open simultaneously, each showing different folders or applying different filters

### Interface Layout

- **Sources Panel** (left): Folder tree hierarchy showing all content directories. Toggle with the folder icon or `Ctrl + 1` in the Content Browser
- **Asset View** (right): Grid or list view of assets in the selected folder
- **Filter Bar** (top): Active filters, search bar, and view options
- **Path Bar** (top): Current folder path with breadcrumb navigation

### Filters

#### Type Filters
Click the **Filters** dropdown to toggle visibility of specific asset types:
- Animation (Animation Sequences, Montages, Blendspaces, Anim Blueprints)
- Audio (Sound Waves, Sound Cues, Sound Classes, Sound Mixes, MetaSounds)
- Blueprints (Blueprint Classes, Blueprint Interfaces, Widget Blueprints, Data-Only Blueprints)
- Materials (Materials, Material Instances, Material Functions, Material Parameter Collections, Substrate Materials)
- Meshes (Static Meshes, Skeletal Meshes, Nanite Meshes)
- Textures (Texture2D, TextureCube, Render Targets, Media Textures, Virtual Textures)
- Niagara (Niagara Systems, Emitters, Scripts, Parameter Collections)
- Physics (Physical Materials, Physics Assets, Chaos Destruction)
- Miscellaneous (Data Tables, Curves, Enumerations, Structures, String Tables)
- World (Levels, World Partition, Landscape, Foliage Types, PCG Graphs)
- User Interface (Widget Blueprints, Fonts, Slate Brushes)

**In your games:**

| Game | Filter | Why You Need It |
|------|--------|-----------------|
| DnD RPG | Animation | Finding montages for Warrior's Power Strike, Rogue's Backstab, and Cleric's healing cast animations across 50+ ability animations |
| DnD RPG | Blueprints | Locating your GAS ability Blueprints (GA_PowerStrike, GA_ShieldBash, GA_Cleave) and Widget Blueprints for the initiative bar and hex grid overlay |
| DnD RPG | Niagara | Filtering for spell VFX: Mage's fireball particles, Cleric's divine glow, Bard's musical note emitters |
| DnD RPG | Materials | Finding miniature-to-real material crossfade sets for each class (painted wood textures blending to skin, cloth, and metal) |
| DnD RPG | AI | Locating Behavior Trees for the 25 enemy types, Blackboard data for goblin archers, orc shamans, and boss encounter AI |
| DnD RPG | Audio | Finding MetaSounds for the tabletop ambience (fire crackle, clock tick, page rustle) vs world soundscapes per biome |
| Wizard's Chess | Materials | Filtering for enchanted piece materials (marble, obsidian, crystal) and the magic trail Niagara effects |
| Wizard's Chess | Physics | Finding Chaos Destruction collections for the dramatic piece-shattering captures |
| Wizard's Chess | Audio | Locating impact sounds, magical hum loops, and the board's reactive ambient audio cues |

#### Search Syntax
The search bar supports advanced syntax:
- Simple text: Searches asset names
- `Type:StaticMesh`: Filter by asset type
- `Name:Barrel`: Filter by name containing "Barrel"
- `Path:/Game/Environment`: Filter by path
- `Tag:TagName`: Filter by asset tags
- `Collection:CollectionName`: Filter by collection membership
- Multiple filters can be combined with spaces (AND logic)

**In your games:**

| Game | Search Query | What It Finds |
|------|-------------|---------------|
| DnD RPG | `Type:AnimMontage Name:Warrior` | All Warrior ability animation montages (Power Strike, Shield Bash, Cleave, Battle Cry) |
| DnD RPG | `Path:/Game/Characters/Enemies Tag:Tier2` | Mid-tier enemies like Orc Warriors, Dark Acolytes, and Corrupted Treants |
| DnD RPG | `Type:DataTable Name:Loot` | Loot tables for weapons, armour, accessories, and their drop rates across 3 tiers |
| DnD RPG | `Type:Material Name:Transition` | The dual material sets (miniature and real) used in the tabletop zoom crossfade |
| Wizard's Chess | `Type:NiagaraSystem Name:Trail` | Magic trail particle systems for piece movement across the board |
| Wizard's Chess | `Type:SoundWave Name:Capture` | Audio assets for dramatic piece shattering and capture events |

### Collections

Collections are custom groupings of assets that do not affect the actual folder structure.

- **Create**: Right-click in the Sources panel, select `New Collection`, and choose Local, Shared, or Private
  - **Local**: Visible only on your machine
  - **Shared**: Visible to all team members (stored in source control)
  - **Private**: Your personal collection but stored in source control
- **Add to Collection**: Drag assets into a collection, or right-click an asset and select `Manage Collections`
- **Smart Collections**: Dynamic collections based on filter criteria (e.g., all textures larger than 4096x4096)

**In your games:**

- **DnD RPG**: Create collections like "Warrior Class Assets" (all meshes, animations, materials, sounds for the Warrior), "Tabletop Scene" (table mesh, candle lights, room props, miniature materials), "Combat VFX" (all Niagara systems for abilities), and "Enemy Tier 1" / "Tier 2" / "Tier 3" to group enemies by difficulty. A Smart Collection for "all textures above 2048x2048" helps you find optimisation targets before the zoom transition, which is performance-critical.
- **Wizard's Chess**: Create collections for "White Pieces" and "Black Pieces" (meshes, materials, destruction collections), "Board Effects" (reactive glow materials, fog Niagara systems), and "Capture Sequences" (shattering animations, debris meshes, impact audio). A "Magic Trails" collection keeps all the enchanted movement VFX together.

### Asset Types

The Content Browser displays all asset types supported by the engine and enabled plugins, including but not limited to:

- **Geometry**: Static Mesh, Skeletal Mesh, Geometry Collection (Chaos Destruction), Nanite-enabled meshes
- **Materials**: Material, Material Instance Constant, Material Instance Dynamic, Material Function, Material Parameter Collection, Substrate materials
- **Textures**: Texture2D, TextureCube, TextureRenderTarget2D, Virtual Texture, Media Texture
- **Animation**: Animation Sequence, Animation Montage, Blendspace, Aim Offset, Animation Blueprint, Control Rig, IK Retargeter, IK Rig, Pose Asset
- **Audio**: Sound Wave, Sound Cue, Sound Class, Sound Mix, Sound Attenuation, Sound Concurrency, MetaSound Source, MetaSound Patch
- **Blueprints**: Blueprint Class, Blueprint Interface, Widget Blueprint, Data-Only Blueprint, Actor Blueprint, Component Blueprint
- **Niagara**: Niagara System, Niagara Emitter, Niagara Script, Niagara Module Script, Niagara Dynamic Input Script, Niagara Function Script, Niagara Parameter Collection
- **Physics**: Physical Material, Physics Asset, Chaos Destruction Collection
- **Data**: Data Table, Curve Table, Curve Float/Vector/Linear, String Table, Data Asset, Primary Data Asset
- **AI**: Behavior Tree, Blackboard Data, Environment Query
- **World**: Level, Level Sequence, Level Instance, PCG Graph, PCG Volume, Landscape Layer Info, Foliage Type
- **UI**: Widget Blueprint, Font, Font Face, Slate Widget Style, Slate Brush
- **Media**: Media Player, Media Source, File Media Source, Platform Media Source, Media Playlist, Media Texture

**In your games:**

| Game | Asset Type | Specific Assets You Will Create |
|------|-----------|-------------------------------|
| DnD RPG | Geometry | Skeletal Meshes for 6 class characters, 25 enemy types, and their miniature-scale LOD versions. Static Meshes for the tabletop, terrain tiles, dungeon props, loot items (swords, staves, shields) |
| DnD RPG | Animation | Animation Montages for 50+ abilities, Blendspaces for walk/run/strafe per class, Animation Blueprints for each character with IK Retargeters for sharing animations across races |
| DnD RPG | Materials | Dual material sets per character (painted miniature and living character), terrain displacement material for the zoom transition, hex grid overlay material for turn-based combat |
| DnD RPG | AI | Behavior Trees for each enemy archetype (melee rusher, ranged sniper, healer, boss phases), Blackboard Data for enemy state, EQS queries for finding cover and flanking positions |
| DnD RPG | Data | Data Tables for loot drop rates, enemy stat blocks, ability damage values, XP curves, shop inventories. Curve assets for the zoom transition timing |
| DnD RPG | Audio | MetaSound Sources for adaptive combat music, Sound Cues for dice rolls, ability impacts, and the tabletop room ambience (fire crackle, clock tick) |
| DnD RPG | Niagara | Systems for Mage spells (fireball, lightning bolt), Cleric divine light, Bard song notes, Ranger arrow trails, environmental weather per biome |
| DnD RPG | UI | Widget Blueprints for the HUD (HP/mana bars, initiative order bar, hex grid info panel, character creation screen, party management, equipment slots) |
| Wizard's Chess | Geometry | Skeletal Meshes for all 6 piece types (King, Queen, Bishop, Knight, Rook, Pawn) in two styles. Geometry Collections for Chaos Destruction shattering on capture |
| Wizard's Chess | Materials | Enchanted marble and obsidian materials with emissive veins, the board surface material that reacts to game state (check, checkmate glows) |
| Wizard's Chess | Niagara | Magic trail systems for piece movement, dust and debris for captures, ambient magical particles floating above the board |
| Wizard's Chess | Physics | Chaos Destruction collections for each piece type so they shatter into unique debris patterns when captured |

### Migration

Migrate assets between projects while preserving all references:

1. Right-click an asset (or selection of assets) in the Content Browser
2. Select `Asset Actions > Migrate`
3. The migration dialog shows the asset and ALL its dependencies (textures, materials, meshes, etc.)
4. Uncheck any dependencies you do not want to migrate
5. Select the destination project's `Content` folder
6. All selected assets and their folder structure are copied to the destination

**In your games:**

- **DnD RPG to Wizard's Chess**: If you build a great Chaos Destruction shattering system for enemies dying in the RPG, you can migrate those destruction meshes, materials, and Niagara effects into the Wizard's Chess project for piece captures. Similarly, your enchanted material glow effects from Wizard's Chess could migrate back for magical weapon effects in the RPG.
- **Prototype to Main Project**: During Phase 0 (foundation), you might prototype combat mechanics in a separate test project. Migration lets you bring your grey-box Warrior Blueprint, ability montages, and hex grid material into the main project without losing texture or material references.

### Referencing

#### Reference Viewer
- Right-click an asset and select `Reference Viewer` to see a visual graph of what references this asset and what this asset references
- **Alt + Shift + R**: Open the Reference Viewer for the selected asset
- Adjust search depth and breadth with controls in the Reference Viewer toolbar
- Filter by hard references, soft references, searchable names, management references, and editor-only references

**In your games:**

- **DnD RPG**: Use the Reference Viewer on a character Blueprint like BP_Warrior to see its entire dependency tree: skeletal mesh, animation blueprint, all ability montages, materials (both miniature and real versions), sound cues for abilities, and Niagara VFX. This is critical before the zoom transition, because you need to know which assets must be loaded at both tabletop and world scale. If BP_Warrior hard-references 200MB of high-res textures, those load even at tabletop scale, and that is a performance problem. Soft references let you defer loading until the player zooms in.
- **Wizard's Chess**: Check what references your Knight piece Blueprint. If it hard-references every Chaos Destruction collection for all piece types, you are loading shattering data for pieces that might never get captured. Use soft references for the destruction assets and load them only when a capture is imminent.

#### Show Referencers / Dependencies
- Right-click an asset, select `Show Referencers` to see a flat list of everything that references this asset
- Select `Show Dependencies` for a flat list of everything this asset depends on

### Asset Actions

Right-click any asset or selection of assets for the context menu:

- **Common**:
  - `Edit`: Open the asset in its editor
  - `Rename` (`F2`): Rename the asset (creates a redirector at the old location)
  - `Duplicate` (`Ctrl + D`): Create a copy in the same folder
  - `Delete` (`Delete`): Delete the asset (checks for references first)
  - `Save` (`Ctrl + S`): Save the asset
  - `Copy Reference`: Copy the asset reference path to clipboard
  - `Copy File Path`: Copy the disk file path
- **Asset Actions**:
  - `Create Blueprint Using This`: Create a Blueprint with this asset as a component
  - `Migrate`: Move assets to another project
  - `Export`: Export to standard file formats (FBX, OBJ, PNG, WAV, etc.)
  - `Reload`: Reload the asset from disk
  - `Replace References`: Replace all references to this asset with references to another
  - `Property Matrix`: Edit properties across multiple assets in a spreadsheet view
  - `Bulk Edit via Property Matrix`: Same as above for selections
- **Scripted Asset Actions**: Custom actions defined by project plugins or Python scripts

**In your games:**

- **DnD RPG**: Use "Create Blueprint Using This" on your Warrior skeletal mesh to quickly scaffold BP_Warrior with the mesh already attached. Use "Replace References" when you upgrade a placeholder sword mesh to the final Longsword of Flame model, so every Data Table, loot drop reference, and equipment slot that pointed to the old mesh now points to the new one. "Property Matrix" is perfect for batch-editing 25 enemy Data Table entries (adjusting HP, damage, XP reward values across all tiers at once).
- **Wizard's Chess**: "Export" your chess piece meshes to FBX for editing in Blender when you need to create the destruction fracture variants. "Copy Reference" on the board material to paste its asset path into a Blueprint that dynamically swaps board states (normal, check, checkmate).

### Bulk Operations

Select multiple assets (Ctrl + Click, Shift + Click, or Ctrl + A) and apply operations:

- **Bulk Rename**: Right-click, select `Rename`. Use the Property Matrix for batch renames with find-and-replace
- **Bulk Delete**: Select all, press Delete. The editor shows a reference check dialog
- **Bulk Move**: Drag multiple assets to a new folder. Redirectors are created at old locations
- **Bulk Save**: `Ctrl + Shift + S` to save all, or right-click and `Save`
- **Bulk Export**: Right-click, `Asset Actions > Export`
- **Fix Up Redirectors**: Right-click a folder, `Fix Up Redirectors in Folder`. Updates all references and removes redirector assets

**In your games:**

- **DnD RPG**: With 6 classes, 25 enemy types, and 50+ abilities, you will rename assets frequently as naming conventions evolve (e.g., renaming "Fireball_Effect" to "NS_Mage_Fireball" to match a Niagara naming convention). Bulk Rename with find-and-replace through Property Matrix saves hours. Run "Fix Up Redirectors" regularly on your Characters and Abilities folders to keep the project clean.
- **Wizard's Chess**: Bulk Export all 12 piece meshes (6 types x 2 colours) to FBX for a batch fracture pass in Blender, then re-import. Bulk Move your prototype "Test" folder assets into proper "Pieces/White/" and "Pieces/Black/" directories once you settle on final art.

### Source Control Integration

When source control is configured (`Edit > Editor Preferences > Source Control`):

- **Status Icons**: Each asset shows an icon indicating its source control state:
  - Checkmark: Up to date
  - Red checkmark: Checked out by you
  - Red X: Checked out by someone else
  - Plus: Not yet added to source control
  - Question mark: Unknown state
- **Operations** (right-click menu):
  - `Check Out`: Lock the file for editing
  - `Check In`: Submit changes to the repository
  - `Mark for Add`: Add a new file to source control
  - `Revert`: Discard local changes and restore the repository version
  - `History`: View the revision history
  - `Diff Against Depot`: Compare local version against the repository version
  - `Refresh`: Update source control status
  - `Sync`: Get the latest version from the repository
- **Automatic Checkout**: Configurable to automatically check out files when you begin editing them (`Edit > Editor Preferences > Loading & Saving > Auto Checkout on Save`)

**In your games:**

- **Both games**: Your GitHub repo for the Tabletop Quest Academy project already uses Git. UE5 supports Git via plugins (or Git LFS for binary assets like meshes and textures). The status icons help you see which assets you have modified locally before committing. This is especially important for the DnD RPG where you will have hundreds of assets and need to track what changed between sessions. Enable "Auto Checkout on Save" so you do not accidentally edit a file without checking it out first.

### Asset Metadata

- **Asset Tags**: Add custom tags to assets for organization and filtering. Tags are searchable in the Content Browser
- **Asset Audit**: Access via `Window > Developer Tools > Asset Audit` to view metadata columns for all assets including size, type, references, and custom properties
- **Tooltip**: Hover over any asset to see a tooltip with the asset type, dimensions (for textures), vertex/triangle count (for meshes), duration (for audio and animation), and file path

**In your games:**

- **DnD RPG**: Tag your assets by game system for easy filtering. Examples: tag all tabletop-scale miniature meshes with "Miniature", all world-scale character meshes with "WorldScale", all Tier 1 enemies with "Tier1", all loot items with "Loot_Common" / "Loot_Rare" / "Loot_Legendary". Use Asset Audit to check mesh vertex counts, because miniature-scale characters should be low-poly (tabletop view shows many at once) while world-scale characters need full detail.
- **Wizard's Chess**: Tag pieces by type ("King", "Queen", "Pawn") and colour ("White", "Black"). Use the tooltip to verify texture dimensions on your board material. The board is always visible and close-up, so it needs high-res textures, while pieces at a distance can use smaller textures.

### Favorites

- **Add Favorite**: Right-click any folder in the Sources panel and select `Add to Favorites`
- **Favorites Section**: Appears at the top of the Sources panel for quick access to frequently used folders
- **Remove**: Right-click a favorite and select `Remove from Favorites`

**In your games:**

- **DnD RPG**: Favourite folders you visit constantly: `/Game/Characters/Player/` (the 6 classes), `/Game/Combat/Abilities/` (50+ ability Blueprints), `/Game/Tabletop/` (the tabletop scene, miniatures, transition materials), `/Game/Data/` (Data Tables for loot, enemies, XP). With this many folders, favourites save real time during development.
- **Wizard's Chess**: Favourite `/Game/Pieces/`, `/Game/Board/`, and `/Game/Effects/`. Fewer folders overall, but you will jump between piece meshes and their materials constantly while polishing the enchanted look.

### Virtual Paths

The Content Browser uses virtual paths for organizing content:

- `/Game/`: The project's Content directory
- `/Engine/`: Engine content (read-only unless modifying the engine)
- `/PluginName/`: Content from enabled plugins
- `/<ProjectName>/`: Alias for `/Game/`
- Path aliases can be configured in `DefaultEngine.ini` for custom virtual paths

**In your games:**

- **DnD RPG**: Your project content lives under `/Game/` (or `/TabletopQuest/`). If you use marketplace assets or Fab content (like Epic's free automotive Substrate materials for reference), they appear under their plugin paths. The built-in engine content at `/Engine/` has starter meshes (cubes, spheres) perfect for grey-boxing your combat arena in Phase 1.
- **Wizard's Chess**: Same structure. Keep your chess assets under `/Game/Chess/` and any downloaded piece models from Fab under their respective plugin paths.

### Developer Content

- **Developer Folder**: `/Game/Developers/<Username>/` is a per-user folder for experimental content
- **Toggle Visibility**: In the Content Browser view options (eye icon), check `Show Developers Content` to see developer folders
- **Use**: Store work-in-progress assets that should not be included in shipped builds
- Developer content is excluded from cooking by default

**In your games:**

- **DnD RPG**: Use your Developer folder for experimental prototypes, like testing the zoom transition with different camera curves, or trying out a new enemy AI behaviour before committing it to the main project. Since developer content is excluded from cooking, your test Blueprints and debug materials will not bloat the shipped build.
- **Wizard's Chess**: Prototype different shattering patterns for piece captures in your developer folder. Try multiple Chaos Destruction configurations without cluttering the main Pieces folder.

### Additional Features

- **View Modes**: Toggle between Grid view and List view using the icons in the bottom-right of the Content Browser
- **Thumbnail Size**: Use the slider in the bottom-right to adjust thumbnail sizes in Grid view
- **Thumbnail Edit Mode**: Orbit the asset thumbnail by holding Ctrl and dragging on it, to set a custom preview angle
- **Asset Preview**: Double-click an asset to open it in its respective editor. For meshes and materials, a 3D preview appears in the asset editor
- **Drag and Drop**: Drag assets directly from the Content Browser into the viewport to place them in the level
- **Recent and Frequent Assets**: The Content Browser tracks recently opened and frequently used assets for quick access
- **Create New Asset**: Right-click in empty space in the asset view, or use the green `+ Add` button in the top-left, to create new assets (Blueprints, Materials, Levels, Data Tables, etc.)
- **Import**: Click the `Import` button or drag files from your OS file browser into the Content Browser to import external assets (FBX, OBJ, PNG, WAV, CSV, etc.)

**In your games:**

- **DnD RPG**: Drag-and-drop your Mixamo character FBX files directly into the Content Browser to import retargetable animations for your 6 classes. Import CSV files as Data Tables for enemy stat blocks and loot tables. Use Thumbnail Edit Mode (Ctrl+drag) to set recognisable preview angles on your 25+ enemy meshes so you can tell a Goblin Archer from a Goblin Shaman at a glance in Grid view.
- **Wizard's Chess**: Import your Blender-modelled chess pieces as FBX files with drag-and-drop. Import WAV sound effects for piece movement (stone sliding) and capture (shattering impact). Drag pieces directly from the Content Browser into the viewport to position them on the board for level design.

---

*This reference is based on Unreal Engine 5.7 as released in late 2025. Settings and features may vary if hotfixes or point releases have been applied.*

*Sources: [Epic Games Official Release Notes](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-7-release-notes), [Epic Games Blog](https://www.unrealengine.com/en-US/news/unreal-engine-5-7-is-now-available), [Tom Looman Performance Highlights](https://tomlooman.com/unreal-engine-5-7-performance-highlights/), [CG Channel](https://www.cgchannel.com/2025/11/unreal-engine-5-7-five-key-features-for-cg-artists/), [WCCFTech](https://wccftech.com/unreal-engine-5-7-out-now-with-nanite-foliage-and-megalights-powered-stunning-dynamic-shadow-casting-lights/), [Vagon](https://vagon.io/blog/what-s-new-in-unreal-engine-5-7)*
