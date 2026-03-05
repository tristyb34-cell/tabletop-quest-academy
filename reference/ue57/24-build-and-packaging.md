## Build and Packaging

### Cooking Content

Cooking converts content from editor format to the optimized runtime format for the target platform.

- **Cook on the fly**: Editor cooks content as needed during Play-In-Editor.
- **Full cook**: **File > Cook Content for [Platform]** or via command line.
- Cooked content goes to `Saved/Cooked/[Platform]/`.
- **Cook Settings** in **Project Settings > Packaging**: Directories to Cook, Directories to Never Cook, Cook Only Maps, Cook Everything in Project Content Directory.
- **Iterative Cooking**: Only re-cooks changed assets. Enabled by default. Dramatically reduces subsequent cook times.

### Packaging Settings

**Edit > Project Settings > Packaging**:

- **Build Configuration**: DebugGame, Development, Test, Shipping.
- **Staging Directory**: Output folder for packaged builds.
- **Full Rebuild**: Force complete rebuild (vs incremental).
- **For Distribution**: Enables code signing and distribution-ready optimizations.
- **Include Debug Files**: Include debug symbols in package.
- **Use Pak File**: Pack content into .pak files (recommended).
- **Use Io Store**: Optimized IO container format.
- **Generate Chunks**: Split content into download chunks.
- **Http Chunk Install Data Directory**: For chunked downloads.
- **Compress Content**: Enable compression for .pak files.
- **Encryption**: Encrypt .pak files (requires encryption key in Project Settings > Crypto).

### Build Configurations

| Configuration | Use Case | Optimizations | Debug Info | Console | Shipping Checks |
|---------------|----------|---------------|------------|---------|-----------------|
| **DebugGame** | Active debugging | Minimal | Full | Yes | No |
| **Development** | Day-to-day testing | Moderate | Moderate | Yes | No |
| **Test** | QA/testing | Full | Minimal | Yes | Some |
| **Shipping** | Final release | Full | None | No | Yes |

- **Shipping** disables console commands, stat commands, screen messages, and development-only features.
- **Development** is the default for Play-In-Editor.

> **In your games:**
> - **DnD RPG**: Use **Development** during module work for debugging AI behavior trees and GAS ability interactions. Switch to **Test** for QA playtesting of full dungeon runs. Use **Shipping** only for final Windows builds you share with friends.
> - **Wizard's Chess**: Since this is a smaller project, you can jump to **Shipping** sooner. Use **Development** while iterating on piece capture animations and particle sequences, then **Shipping** for the polished build.

### Target Platforms

- Windows, macOS, Linux
- iOS, Android
- PlayStation 5, Xbox Series X|S, Nintendo Switch
- Platform-specific settings: **Project Settings > Platforms > [Platform Name]**
- Each platform has its own cooking, rendering, input, and performance settings.
- **Config/[Platform]/** folders contain platform-specific .ini overrides (e.g., `Config/Windows/WindowsEngine.ini`).

> **In your games:**
> - **DnD RPG**: Target **Windows** only (your dev PC). Under **Project Settings > Packaging**, add all 10 module maps to "Directories to Cook" so test levels from earlier modules do not bloat the final package.
> - **Wizard's Chess**: Also Windows only. Since the game is a single board with no sprawling level content, cooking is fast. Keep it simple with default cook settings.

> **In your games:**
> - **DnD RPG**: Enable **Use Pak File** and **Compress Content** to keep the build size manageable. With Niagara VFX, GAS data assets, PCG graphs, and 10 modules of content, an uncompressed build would be large. Enable **Use Io Store** for faster load times in dungeon transitions. Leave **Encryption** off unless you plan to distribute publicly.
> - **Wizard's Chess**: Enable **Use Pak File** but compression is less critical since the asset count is small (one board, 32 pieces, particle effects). Skip **Generate Chunks** since there is no DLC or downloadable content to worry about.

### Command-Line Builds

#### RunUAT (Unreal Automation Tool)

```bash
# Full build, cook, and package
RunUAT.bat BuildCookRun -project="Path/To/Project.uproject" -platform=Win64 -clientconfig=Shipping -build -cook -stage -package -archive -archivedirectory="Output/Path"

# Cook only
RunUAT.bat BuildCookRun -project="Path/To/Project.uproject" -platform=Win64 -cook -skipbuild

# Build only
RunUAT.bat BuildCookRun -project="Path/To/Project.uproject" -platform=Win64 -build -skipcook
```

#### Key RunUAT Flags

| Flag | Description |
|------|-------------|
| `-project=` | Path to .uproject file |
| `-platform=` | Target platform (Win64, Mac, Linux, Android, IOS, PS5, XSX, Switch) |
| `-clientconfig=` | Build configuration (DebugGame, Development, Test, Shipping) |
| `-build` | Compile source code |
| `-cook` | Cook content |
| `-stage` | Stage files to output |
| `-package` | Package the build |
| `-archive` | Archive to a directory |
| `-archivedirectory=` | Output directory for archive |
| `-clean` | Clean before building |
| `-iterate` | Iterative cook (only changed assets) |
| `-compressed` | Compress pak files |
| `-distribution` | Distribution build |
| `-CreateReleaseVersion=` | Create a release version for patching |
| `-BasedOnReleaseVersion=` | Generate a patch based on a release |
| `-nodebuginfo` | Omit debug symbols |
| `-prereqs` | Include prerequisites installer |
| `-utf8output` | UTF-8 console output |
| `-unattended` | No user prompts |

> **In your games:**
> - **DnD RPG**: A typical command-line build for playtesting a dungeon level:
>   ```bash
>   RunUAT.bat BuildCookRun -project="TabletopQuest.uproject" -platform=Win64 -clientconfig=Development -build -cook -stage -pak -iterate -compressed
>   ```
>   Use `-iterate` to avoid re-cooking all 10 modules of assets every time. Add `-archive -archivedirectory="C:/Builds/DnDRPG"` when you want a shareable folder.
> - **Wizard's Chess**: A simpler build since the project is smaller:
>   ```bash
>   RunUAT.bat BuildCookRun -project="WizardsChess.uproject" -platform=Win64 -clientconfig=Shipping -build -cook -stage -pak -archive -archivedirectory="C:/Builds/WizardsChess"
>   ```
>   Full cooks are fast here, so `-iterate` is optional.

#### BuildCookRun Shorthand

```bash
# Windows Shipping build with all steps
RunUAT.bat BuildCookRun -project="MyProject.uproject" -noP4 -platform=Win64 -clientconfig=Shipping -cook -build -stage -pak -archive -archivedirectory="C:/Builds"
```

### Automation Tool and Build Graph

- **BuildGraph**: XML-based build pipeline definition. Supports nodes, dependencies, conditions.
- Location: `Engine/Build/Graph/` contains default build graphs.
- Custom build graphs define multi-step build/cook/package/test pipelines for CI/CD.
- Run BuildGraph scripts: `RunUAT.bat BuildGraph -Script="Path/To/Script.xml" -Target="TargetName"`.
- Supports parallel execution, conditional steps, and platform-specific logic.

> **In your games:**
> - **DnD RPG**: If you eventually set up a CI/CD pipeline (e.g., Jenkins on your home PC), BuildGraph can automate nightly builds that cook, package, and run automated tests for combat encounters. Overkill for now, but good to know it exists.
> - **Wizard's Chess**: Not needed for a small project. Stick with manual RunUAT commands or the editor's Package Project button.

### Iterative Cooking

- Enabled by default for editor and command-line cooks.
- Tracks asset dependencies; only re-cooks assets that changed or whose dependencies changed.
- **Force clean cook**: Delete `Saved/Cooked/` folder or use `-clean` flag with RunUAT.
- Iterative cooking drastically reduces turnaround for large projects (minutes vs hours).
- DDC (Derived Data Cache) caches intermediate results. Shared DDC on a network drive accelerates team workflows.

> **In your games:**
> - **DnD RPG**: Iterative cooking is your best friend here. With 10 modules of content (meshes, textures, Niagara systems, PCG graphs, audio), a full cook could take a long time. After the first full cook, subsequent iterations only re-cook what changed. If a cook ever seems stale or broken, delete `Saved/Cooked/` and start fresh.
> - **Wizard's Chess**: Even a full cook is quick for this project, but iterative cooking still saves time when tweaking particle effects for piece captures.
