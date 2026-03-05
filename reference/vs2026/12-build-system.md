## Build System

### MSBuild

MSBuild is the default build system for Visual Studio projects (.vcxproj, .csproj). UE5 generates .vcxproj files via UnrealBuildTool.

### Build Configurations

| Configuration | Optimization | Debug Info | Use Case |
|---------------|-------------|------------|----------|
| Debug | None (/Od) | Full (/Zi) | Maximum debugging capability |
| Release | Full (/O2) | None or minimal | Production builds |
| Custom | User-defined | User-defined | Project-specific needs |

#### UE5-Specific Configurations

| Configuration | Optimization | Debug Info | Use Case |
|---------------|-------------|------------|----------|
| DebugGame Editor | None | Full | Debugging gameplay code in the editor. Every variable visible. |
| Development Editor | Moderate | Partial | Day-to-day development (90% of your time). Good balance. |
| DebugGame | None | Full | Standalone game debugging (no editor) |
| Development | Moderate | Partial | Standalone game testing |
| Shipping | Full | None | Final packaged build for release |
| Test | Full with some debug | Minimal | QA testing builds |

### Configuration Manager

**Build > Configuration Manager**

| Feature | Description |
|---------|-------------|
| Active solution configuration | Which config to build (Debug, Release, etc.) |
| Active solution platform | Target platform (x64, ARM64, etc.) |
| Project configurations | Per-project build/deploy settings |
| Create new configuration | Based on existing or from scratch |

### Batch Build

**Build > Batch Build**

Build multiple configurations at once. Check boxes for each project/configuration/platform combination you want to build. Useful for building both Debug and Release, or both x64 and ARM64.

### Build Order and Dependencies

**Project > Project Dependencies** or **Project > Project Build Order**

- Define which projects depend on others
- Visual Studio builds dependencies first automatically
- Circular dependencies cause errors

### Pre/Post Build Events

**Project Properties > Build Events**

| Event | When It Runs |
|-------|-------------|
| Pre-Build Event | Before compilation starts |
| Pre-Link Event | After compilation, before linking |
| Post-Build Event | After successful build |

Each event is a command-line script. Use for:
- Copying files to output directories
- Running code generation tools
- Signing binaries
- Running unit tests
- Deploying to a test server

### NMake for UE5

UE5 projects use NMake-style builds instead of standard MSBuild compilation:

**Project Properties > NMake**

| Setting | Description |
|---------|-------------|
| Build Command Line | UnrealBuildTool command for building |
| Rebuild All Command Line | Full rebuild command |
| Clean Command Line | Clean command |
| Output | Path to the built binary |
| Preprocessor Definitions | Defines for IntelliSense (not for actual compilation) |
| Include Search Path | Include paths for IntelliSense |
| Forced Includes | Headers to force-include |

### Output Directories

**Project Properties > General**

| Setting | Description |
|---------|-------------|
| Output Directory | Where built binaries are placed |
| Intermediate Directory | Where object files and temporary files go |
| Target Name | Name of the output binary |
| Target Extension | .exe, .dll, .lib |

### Build Performance Agent (New in VS 2026)

Use `@BuildPerfCpp` in Copilot Chat to analyze C++ build performance:
- Identifies slow-to-compile translation units
- Suggests precompiled header optimizations
- Recommends build parallelism settings
- Identifies unnecessary includes

---
