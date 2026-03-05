## CMake Support

### Opening CMake Projects

**File > Open > CMake** or **File > Open > Folder** (if the folder contains CMakeLists.txt)

VS 2026 includes CMake 4.1.1 and uses the "Visual Studio 18 2026" generator.

### CMakePresets.json

The primary way to configure CMake projects in VS 2026. The CMakeSettings.json editor has been deprecated in favor of CMakePresets.json.

```json
{
  "version": 6,
  "configurePresets": [
    {
      "name": "windows-x64-debug",
      "displayName": "Windows x64 Debug",
      "generator": "Visual Studio 18 2026",
      "architecture": "x64",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "windows-x64-debug",
      "configurePreset": "windows-x64-debug"
    }
  ]
}
```

### CMake Targets View

VS 2026 provides a "CMake Targets View" in Solution Explorer that organizes files by CMake targets instead of folder structure. Toggle between Folder View and Targets View in Solution Explorer.

### CMake Configuration Variables

| Variable | Description |
|----------|-------------|
| CMAKE_GENERATOR | "Visual Studio 18 2026" |
| CMAKE_GENERATOR_PLATFORM | Target architecture (x64, Win32, ARM64) |
| CMAKE_GENERATOR_TOOLSET | MSVC toolset version (v145 is default for VS 2026) |
| CMAKE_GENERATOR_INSTANCE | Path to specific VS installation (for side-by-side installs) |

### CMake Profiling (New in VS 2026)

CMake projects now fully support the Performance Profiler tools:
- CPU Usage
- Memory Usage
- Events Viewer
- File I/O

Previously these tools were only available for MSBuild-based projects.

---
