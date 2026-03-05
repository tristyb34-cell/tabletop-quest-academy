## Installation and Workloads

### Editions

| Edition | Cost | Use Case |
|---------|------|----------|
| Community | Free | Individuals, open source, academic, and small teams (up to 5 users in a non-enterprise org) |
| Professional | Paid subscription or standalone license (available from Microsoft Store since Dec 1, 2025) | Professional developers and small teams |
| Enterprise | Paid subscription | Large teams needing advanced testing, DevOps, and architecture tools |
| Build Tools | Free | CI/CD servers and build machines (no IDE, command-line only) |

### Installer Overview

The Visual Studio Installer is a standalone application that manages installations. You can run multiple VS editions side by side. The installer has three tabs:

- **Workloads**: Pre-configured bundles of tools for specific development scenarios
- **Individual Components**: Granular selection of specific SDKs, compilers, tools, and runtimes
- **Language Packs**: UI language translations

### Workloads (Complete List)

#### Desktop and Mobile

| Workload | ID | Description |
|----------|----|-------------|
| .NET desktop development | Microsoft.VisualStudio.Workload.ManagedDesktop | WPF, Windows Forms, and console apps using C#, VB, and F# with .NET and .NET Framework |
| Desktop development with C++ | Microsoft.VisualStudio.Workload.NativeDesktop | Windows desktop apps using MSVC, Clang, CMake, or MSBuild. Includes the C++ compiler, linker, Windows SDK |
| Universal Windows Platform development | Microsoft.VisualStudio.Workload.Universal | UWP apps using C#, VB, or C++/WinRT |
| Mobile development with .NET | Microsoft.VisualStudio.Workload.XamarinBuildTools | Cross-platform mobile apps for iOS and Android using .NET MAUI |
| .NET Multi-platform App UI development | Microsoft.VisualStudio.Workload.NetCrossPlat | .NET MAUI apps for Android, iOS, macOS, and Windows |

#### Web and Cloud

| Workload | ID | Description |
|----------|----|-------------|
| ASP.NET and web development | Microsoft.VisualStudio.Workload.NetWeb | Web apps using ASP.NET Core, HTML, JavaScript, and container tools including Docker |
| Azure development | Microsoft.VisualStudio.Workload.Azure | Azure SDKs, tools, and projects for cloud apps, AI agents, and Azure resources |
| Python development | Microsoft.VisualStudio.Workload.Python | Python editing, debugging, and interactive development including web frameworks |
| Node.js development | Microsoft.VisualStudio.Workload.Node | Node.js apps using JavaScript and TypeScript |

#### Game Development

| Workload | ID | Description |
|----------|----|-------------|
| Game development with C++ | Microsoft.VisualStudio.Workload.NativeGame | C++ game development with DirectX, Unreal Engine, or Cocos2d. Includes profiling tools and debugger command-line toolbar |
| Game development with Unity | Microsoft.VisualStudio.Workload.ManagedGame | 2D and 3D games with the Unity engine using C# |

#### Other

| Workload | ID | Description |
|----------|----|-------------|
| Data storage and processing | Microsoft.VisualStudio.Workload.Data | Data solutions with SQL Server, Azure Data Lake, or Hadoop |
| Data science and analytical applications | Microsoft.VisualStudio.Workload.DataScience | Data science using Python and F# |
| Visual Studio extension development | Microsoft.VisualStudio.Workload.VisualStudioExtension | Add-ons and extensions for Visual Studio including new commands, analyzers, and tool windows |
| Office/SharePoint development | Microsoft.VisualStudio.Workload.Office | Office and SharePoint add-ins using C#, VB, and JavaScript |
| Linux and embedded development with C++ | Microsoft.VisualStudio.Workload.NativeCrossPlat | C++ apps for Linux and embedded environments |

### Key Individual Components for Game Dev / UE5

These are components you may want to add beyond what the workloads install:

| Component | Why You Need It |
|-----------|----------------|
| Windows SDK (latest version) | Required for compiling Windows targets |
| C++ profiling tools | CPU and memory profiling for native code |
| C++ AddressSanitizer | Catches memory bugs (buffer overflows, use-after-free) at runtime |
| C++ ATL for latest v145 build tools | Required by some UE5 plugins and third-party libraries |
| C++ MFC for latest v145 build tools | Legacy UI framework, some UE5 tools depend on it |
| IntelliCode | AI-assisted code completions trained on open-source repos |
| .NET SDK | Needed if you write C# tools or editor extensions for UE5 |
| MSVC v14.30-v14.43 build tools | Older toolsets from VS 2022, available in VS 2026 installer for backward compatibility |
| CMake tools for Windows | If you use CMake for plugins or tools alongside your UE5 project |
| Clang compiler for Windows | Alternative compiler, useful for cross-platform consistency |
| AddressSanitizer for ARM64 (Preview) | ARM64 memory debugging support, new in VS 2026 |

### Installation Methods

#### GUI Installation
1. Download the Visual Studio Installer from visualstudio.microsoft.com
2. Run the installer, select your edition
3. Choose workloads and individual components
4. Click Install (or Modify if already installed)

#### Command-Line Installation
```
vs_community.exe --add Microsoft.VisualStudio.Workload.NativeGame --add Microsoft.VisualStudio.Workload.NativeDesktop --includeRecommended
```

Key command-line flags:
- `--add <workload-id>` : Add a workload
- `--remove <workload-id>` : Remove a workload
- `--includeRecommended` : Include recommended components for selected workloads
- `--includeOptional` : Include optional components
- `--passive` : No interaction required, shows progress
- `--quiet` : No UI at all
- `--wait` : Wait for install to complete before returning
- `--layout <path>` : Create an offline installation layout
- `--lang <locale>` : Set display language (e.g. en-US)

#### Offline Installation (Network Layout)
```
vs_community.exe --layout C:\VSLayout --add Microsoft.VisualStudio.Workload.NativeGame --lang en-US
```
A complete layout for Community edition requires approximately 40 GB. Each additional language locale adds about 0.5 GB.

#### Repair and Modify
- **Repair**: Visual Studio Installer > More > Repair. Fixes corrupted installations.
- **Modify**: Visual Studio Installer > Modify. Add or remove workloads and components.
- **Update**: Visual Studio Installer > Update. Applies the latest patches and feature updates.

### Decoupled Architecture (New in VS 2026)

VS 2026 separates the IDE from the build tools. You can update the IDE independently without changing your compiler toolchain. This means monthly IDE feature updates do not force you to update MSVC, .NET SDK, or other build tools. You choose when to update your toolchain.

---
