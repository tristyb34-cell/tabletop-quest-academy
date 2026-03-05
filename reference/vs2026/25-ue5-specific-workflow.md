## UE5-Specific Workflow

### Setting Up UE5 with VS 2026

#### Step 1: Install Required Workloads
In the Visual Studio Installer, select:
1. **Game development with C++** (primary)
2. **Desktop development with C++** (for full compiler/linker/SDK)

Add individual components:
- Windows SDK (latest)
- C++ profiling tools
- C++ AddressSanitizer

#### Step 2: Install the UE5 Extension
**Extensions > Manage Extensions** > search for "Visual Studio Tools for Unreal Engine" > Install

#### Step 3: Generate Project Files
- Right-click your `.uproject` file > **Generate Visual Studio project files**
- Or in UE5 Editor: **File > Refresh Visual Studio Project**
- Or command line: `UnrealBuildTool -projectfiles -project=<path>`

Note: When building UE5.7 engine from source with VS 2026, the GenerateProjectFiles.bat script may need the toolchain references updated from VS 2022 to VS 2026 in configuration files.

#### Step 4: Configure VS Tools for UE5
When you open a UE5 .sln in VS 2026, the configuration dialog appears automatically, or access it via:

**Project > Configure Tools for Unreal Engine**

| Setting | Description |
|---------|-------------|
| Solution Explorer view | Optimized for game development or engine development |
| Blueprint support | View Blueprint data and find Blueprint references in debugger |
| HLSL support | Syntax coloring, IntelliSense, and error detection for shaders |

### Solution Configurations

Select the configuration from the toolbar dropdown or **Build > Configuration Manager**:

| Configuration | When to Use |
|---------------|-------------|
| Development Editor | 90% of development time. Moderate optimization + debug info + editor |
| DebugGame Editor | When you need to step through code with full variable visibility |
| Development | Standalone game testing without editor |
| DebugGame | Debugging standalone game issues |
| Shipping | Final release builds only |
| Test | QA testing builds |

### Live Coding

UE5's replacement for Edit and Continue:

| Aspect | Details |
|--------|---------|
| Trigger | Ctrl+Alt+F11 in the UE5 Editor |
| Speed | Typically 5-15 seconds for incremental changes |
| Scope | .cpp file changes only. Header changes require full rebuild |
| How it works | Patches the running executable in memory |
| State preservation | Editor stays open, level/actors/state intact |
| Requirement | Disable Edit and Continue in VS (Tools > Options > Debugging > C++ > Enable Native Edit and Continue = False) |

### Debugging UE5

1. **Set build config to Development Editor or DebugGame Editor**
2. **Press F5** to launch UE5 Editor through the debugger, OR
3. **Ctrl+Alt+P** to attach to an already-running UnrealEditor.exe (faster for iteration)
4. **Load symbols only for your modules** (Tools > Options > Debugging > Symbols) to avoid loading symbols for thousands of engine DLLs

### Debugger Command-Line Args (New in VS 2026)

The debugger command-line arguments toolbar is now available to all C++ developers (no longer tied to the Game Development workload). Set launch arguments directly from the toolbar for .vcxproj, CMake, and UE5 projects.

### Common UE5 Issues and Fixes

#### IntelliSense Not Working
1. Close Visual Studio
2. Delete the `.vs` folder in your project directory
3. In UE5 Editor: File > Refresh Visual Studio Project
4. Reopen .sln, wait for IntelliSense to rebuild (several minutes for large projects)

#### Build Errors After Engine Update
1. Close VS and UE5 Editor
2. Delete `Binaries/` folder
3. Delete `Intermediate/` folder
4. Delete `.vs/` folder
5. Regenerate project files (right-click .uproject > Generate Visual Studio project files)
6. Open new .sln and rebuild

#### Debugger Can't Find Symbols
- Add your `Binaries/Win64/` folder to symbol search paths (Tools > Options > Debugging > Symbols)
- Build Development Editor or DebugGame Editor (Shipping strips symbols)
- Use Debug > Windows > Modules to see which modules have loaded symbols

#### Red Squiggles Everywhere But Code Compiles
These are IntelliSense parser errors, not compiler errors. Common with UE5 macros.

Solutions (in order):
1. Regenerate project files and wait for full reparse
2. Delete `.vs` folder and reopen
3. Use Visual Assist (better UE5 macro comprehension)
4. Nuclear option: Tools > Options > Text Editor > C/C++ > Advanced > Disable Squiggles = True

#### Live Coding Fails Silently
- Ensure Edit and Continue is DISABLED in VS
- Check the UE5 Editor output log for Live Coding errors
- Make sure you changed only .cpp files, not headers
- Try a full rebuild if Live Coding gets stuck

---
