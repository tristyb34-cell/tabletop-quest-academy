## The IDE Layout

### Main Window Anatomy

The VS 2026 window is composed of these regions:

```
+----------------------------------------------------------+
|  Title Bar (solution name, branch, search)                |
+----------------------------------------------------------+
|  Menu Bar (File, Edit, View, Project, Build, Debug, etc.) |
+----------------------------------------------------------+
|  Toolbars (Standard, Debug, Build, Text Editor, etc.)     |
+----------------------------------------------------------+
|          |                              |                  |
|  Solution|     Editor / Document Well   |  Properties /    |
|  Explorer|     (tabbed code editors,    |  Other panels    |
|          |      designers, start page)  |                  |
|          |                              |                  |
+----------+------------------------------+------------------+
|  Output / Error List / Terminal / Find Results             |
+----------------------------------------------------------+
|  Status Bar (line/col, encoding, branch, IntelliSense)    |
+----------------------------------------------------------+
```

### Panels and Tool Windows (Complete List)

Every tool window can be accessed from the **View** menu or by its keyboard shortcut. Windows can be docked, floated, auto-hidden (tab on edge), or moved to a separate monitor.

#### Solution and Project Navigation

| Window | Menu Path | Shortcut | Description |
|--------|-----------|----------|-------------|
| Solution Explorer | View > Solution Explorer | Ctrl+Alt+L | Tree view of your solution, projects, files, and references. The primary navigation panel. |
| Class View | View > Class View | Ctrl+Shift+C | Hierarchical view of classes, structs, enums, and their members across the solution |
| Object Browser | View > Object Browser | Ctrl+Alt+J | Browse referenced assemblies, namespaces, and types with documentation |
| Code Definition Window | View > Code Definition Window | None | Shows the definition of the symbol under the cursor in a read-only pane |
| Call Hierarchy | View > Call Hierarchy | Ctrl+Alt+K | Tree showing all callers and callees of a function. Right-click a function and select "View Call Hierarchy" |
| Document Outline | View > Other Windows > Document Outline | None | Shows the structural outline of the current document (classes, methods, regions) |

#### Debugging Windows

| Window | Menu Path | Shortcut | Description |
|--------|-----------|----------|-------------|
| Breakpoints | Debug > Windows > Breakpoints | Ctrl+Alt+B | Lists all breakpoints with conditions, hit counts, and labels |
| Watch 1-4 | Debug > Windows > Watch > Watch 1 | Ctrl+Alt+W, 1 | Manually specified expressions to monitor during debugging |
| Autos | Debug > Windows > Autos | Ctrl+Alt+V, A | Variables used in the current and previous statement |
| Locals | Debug > Windows > Locals | Ctrl+Alt+V, L | All local variables in the current scope |
| Call Stack | Debug > Windows > Call Stack | Ctrl+Alt+C | Shows the chain of function calls that led to the current execution point |
| Threads | Debug > Windows > Threads | Ctrl+Alt+H | All threads in the debugged process with current location |
| Modules | Debug > Windows > Modules | Ctrl+Alt+U | Loaded DLLs and their symbol loading status |
| Processes | Debug > Windows > Processes | Ctrl+Alt+Z | All debugged processes (useful for multi-process debugging) |
| Memory 1-4 | Debug > Windows > Memory > Memory 1 | Ctrl+Alt+M, 1 | Raw memory viewer at a specified address |
| Disassembly | Debug > Windows > Disassembly | Ctrl+Alt+D | Assembly instruction view of the current code |
| Registers | Debug > Windows > Registers | Ctrl+Alt+G | CPU register values |
| Immediate Window | Debug > Windows > Immediate | Ctrl+Alt+I | Execute expressions and commands during debugging |
| Diagnostic Tools | Debug > Windows > Show Diagnostic Tools | Ctrl+Alt+F2 | CPU usage, memory usage, and events timeline during debugging |
| Exception Settings | Debug > Windows > Exception Settings | Ctrl+Alt+E | Configure which exceptions break into the debugger |
| Parallel Stacks | Debug > Windows > Parallel Stacks | Ctrl+Shift+D, S | Graphical view of call stacks across multiple threads |
| Parallel Watch | Debug > Windows > Parallel Watch > Parallel Watch 1 | Ctrl+Shift+D, 1 | Watch expressions across multiple threads simultaneously |
| GPU Threads | Debug > Windows > GPU Threads | None | GPU thread states for DirectCompute debugging |
| Tasks | Debug > Windows > Tasks | None | Task-based async debugging view |

#### Build and Output

| Window | Menu Path | Shortcut | Description |
|--------|-----------|----------|-------------|
| Output | View > Output | Ctrl+Alt+O | Build output, debug output, and other tool messages |
| Error List | View > Error List | Ctrl+\\, E | Filterable list of errors, warnings, and messages from builds and analyzers |
| Task List | View > Task List | Ctrl+\\, T | Shows TODO, HACK, and other comment tokens found in code |
| Find Results 1/2 | View > Other Windows > Find Results | None | Results from Find in Files operations |
| Bookmark Window | View > Bookmark Window | Ctrl+K, Ctrl+W | Manage named bookmarks across files |

#### Terminal and Commands

| Window | Menu Path | Shortcut | Description |
|--------|-----------|----------|-------------|
| Terminal | View > Terminal | Ctrl+` | Integrated terminal (PowerShell, Command Prompt, Developer Command Prompt, or WSL) |
| Command Window | View > Other Windows > Command Window | Ctrl+Alt+A | Execute Visual Studio commands by name (e.g., `Debug.Start`, `File.OpenFile`) |
| Developer PowerShell | Tools > Command Line > Developer PowerShell | None | PowerShell with VS build tools in PATH |
| Developer Command Prompt | Tools > Command Line > Developer Command Prompt | None | cmd.exe with VS build tools in PATH |

#### Source Control

| Window | Menu Path | Shortcut | Description |
|--------|-----------|----------|-------------|
| Git Changes | View > Git Changes | Ctrl+0, Ctrl+G | Stage, unstage, commit, and push changes |
| Git Repository | View > Git Repository | Ctrl+0, Ctrl+R | Branch management, history, and remote operations |
| Team Explorer | View > Team Explorer | Ctrl+\\, Ctrl+M | Azure DevOps / TFS integration (legacy, being replaced by Git windows) |

#### Other Windows

| Window | Menu Path | Shortcut | Description |
|--------|-----------|----------|-------------|
| Properties | View > Properties Window | F4 | Properties of the selected item (file properties, project settings, designer properties) |
| Toolbox | View > Toolbox | Ctrl+Alt+X | UI controls for designers (WinForms, WPF, XAML) |
| Server Explorer | View > Server Explorer | Ctrl+Alt+S | Database connections, Azure services, and server resources |
| Notifications | View > Notifications | None | Updates, extension notifications, and IDE messages |
| Test Explorer | Test > Test Explorer | Ctrl+E, T | Discover, run, and manage unit tests |
| Performance Profiler | Debug > Performance Profiler | Alt+F2 | Launch profiling sessions (CPU, memory, GPU, etc.) |
| Code Metrics Results | Analyze > Calculate Code Metrics | None | Maintainability index, cyclomatic complexity, depth of inheritance, class coupling, lines of code |
| NuGet Package Manager | Tools > NuGet Package Manager > Manage NuGet Packages for Solution | None | Browse, install, update, and uninstall NuGet packages |

### Toolbars

Toolbars are horizontal strips of buttons below the menu bar. Right-click the toolbar area to show/hide specific toolbars.

| Toolbar | Purpose |
|---------|---------|
| Standard | New, Open, Save, Undo, Redo, Navigate Back/Forward, Find |
| Build | Build Solution, Rebuild, Clean, Cancel Build |
| Debug | Start, Stop, Restart, Step Over, Step Into, Step Out, breakpoint controls |
| Text Editor | Indent, Outdent, Comment, Uncomment, formatting buttons |
| Source Control | Commit, Push, Pull, Branch indicator |
| Solution Configurations | Debug/Release/Custom configuration dropdown |
| Solution Platforms | x64/x86/ARM64 platform dropdown |
| Debugger Command-Line Args (New in VS 2026) | Set command-line arguments for C++ projects directly from toolbar. Works for .vcxproj, CMake, and Unreal Engine projects |

### Status Bar

The bottom status bar displays (left to right):
- Ready / Build status / Error count
- Current branch name (clickable for branch operations)
- Line number and column (clickable to open Go To Line dialog)
- Character count / selection information (shows total characters and lines when text is selected)
- File encoding (clickable to save or reopen with different encoding). New in VS 2026.
- IntelliSense status indicator
- Insert/Overwrite mode
- Notification indicators

---
