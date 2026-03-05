## Menus (Every Top-Level Menu)

### File Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| New > Project | Ctrl+Shift+N | Create a new project from templates |
| New > File | Ctrl+N | Create a new standalone file |
| New > Repository | None | Clone or create a Git repository |
| Open > Project/Solution | Ctrl+Shift+O | Open an existing .sln or project file |
| Open > Folder | None | Open a folder without a solution (folder view mode) |
| Open > File | Ctrl+O | Open any file |
| Open > CMake | None | Open a CMakeLists.txt to work in CMake mode |
| Clone Repository | None | Clone a Git repository from URL |
| Start Window | None | Return to the start/welcome screen |
| Add > New Project | None | Add a new project to the current solution |
| Add > Existing Project | None | Add an existing project to the solution |
| Add > New Item | Ctrl+Shift+A | Add a new file to the current project |
| Add > Existing Item | Shift+Alt+A | Add an existing file to the current project |
| Close | Ctrl+F4 or Ctrl+W (new in VS 2026) | Close the current document tab |
| Close Solution | None | Close the entire solution |
| Save | Ctrl+S | Save the current file |
| Save As | Ctrl+Shift+S (file) | Save the current file with a new name |
| Save All | Ctrl+Shift+S | Save all open files |
| Page Setup | None | Configure print layout |
| Print | Ctrl+P | Print the current document |
| Recent Files | None | Submenu of recently opened files |
| Recent Projects and Solutions | None | Submenu of recently opened solutions |
| Exit | Alt+F4 | Close Visual Studio |

### Edit Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Undo | Ctrl+Z | Undo last action |
| Redo | Ctrl+Y | Redo last undone action |
| Cut | Ctrl+X | Cut selection to clipboard |
| Copy | Ctrl+C | Copy selection to clipboard |
| Paste | Ctrl+V | Paste from clipboard |
| Adaptive Paste | Shift+Alt+V | Paste with Copilot adaptation to context (new in VS 2026) |
| Delete | Del | Delete selection |
| Select All | Ctrl+A | Select all content in the current document |
| Find and Replace > Quick Find | Ctrl+F | Find in current document |
| Find and Replace > Quick Replace | Ctrl+H | Find and replace in current document |
| Find and Replace > Find in Files | Ctrl+Shift+F | Search across entire solution or folder |
| Find and Replace > Replace in Files | Ctrl+Shift+H | Find and replace across solution or folder |
| Go To > Go To Line | Ctrl+G | Jump to a specific line number |
| Go To > Go To All | Ctrl+T or Ctrl+P (new) | Search for files, types, members, and symbols |
| Go To > Go To File | Ctrl+1, F | Navigate to a file by name |
| Go To > Go To Type | Ctrl+1, T | Navigate to a type by name |
| Go To > Go To Member | Ctrl+1, M | Navigate to a member by name |
| Go To > Go To Symbol | Ctrl+1, S | Navigate to a symbol by name |
| Go To > Go To Line | Ctrl+G | Jump to a specific line |
| Go To > Go To Next Issue in File | Alt+PgDn | Navigate to next error/warning |
| Go To > Go To Previous Issue in File | Alt+PgUp | Navigate to previous error/warning |
| Advanced > Format Document | Ctrl+K, Ctrl+D | Auto-format the entire document |
| Advanced > Format Selection | Ctrl+K, Ctrl+F | Auto-format the selected text |
| Advanced > Make Uppercase | Ctrl+Shift+U | Convert selection to uppercase |
| Advanced > Make Lowercase | Ctrl+U | Convert selection to lowercase |
| Advanced > Comment Selection | Ctrl+K, Ctrl+C | Comment out the selected lines |
| Advanced > Uncomment Selection | Ctrl+K, Ctrl+U | Uncomment the selected lines |
| Advanced > Toggle Line Comment | Ctrl+/ (new in VS 2026) | Toggle line comments |
| Advanced > Increase Line Indent | Tab (with selection) | Indent selected lines |
| Advanced > Decrease Line Indent | Shift+Tab | Outdent selected lines |
| Advanced > Delete Horizontal White Space | Ctrl+K, Ctrl+\\ | Remove whitespace around cursor |
| Advanced > View White Space | Ctrl+R, Ctrl+W | Toggle visible whitespace characters |
| Advanced > Word Wrap | None | Toggle word wrap for current document |
| Advanced > Tabify Selected Lines | None | Convert spaces to tabs in selection |
| Advanced > Untabify Selected Lines | None | Convert tabs to spaces in selection |
| Bookmarks > Toggle Bookmark | Ctrl+K, Ctrl+K | Add or remove a bookmark on the current line |
| Bookmarks > Next Bookmark | Ctrl+K, Ctrl+N | Jump to next bookmark |
| Bookmarks > Previous Bookmark | Ctrl+K, Ctrl+P | Jump to previous bookmark |
| Bookmarks > Clear Bookmarks | Ctrl+K, Ctrl+L | Remove all bookmarks |
| Outlining > Toggle Outlining Expansion | Ctrl+M, Ctrl+M | Expand/collapse the current code block |
| Outlining > Toggle All Outlining | Ctrl+M, Ctrl+L | Expand/collapse all code blocks |
| Outlining > Collapse to Definitions | Ctrl+M, Ctrl+O | Collapse all bodies to show only signatures |
| Multi-Caret | Ctrl+Alt+Click | Place additional cursors for multi-cursor editing |
| Column Selection | Alt+Shift+Arrow | Rectangular / column selection |

### View Menu

Contains all tool window access (see the Panels section above for the complete list). Additional items:

| Item | Shortcut | Description |
|------|----------|-------------|
| Code | F7 | Switch to code view from designer |
| Designer | Shift+F7 | Switch to designer view |
| Full Screen | Shift+Alt+Enter | Toggle full-screen mode (hides everything except the editor) |
| Navigate Backward | Ctrl+- | Go to previous cursor location |
| Navigate Forward | Ctrl+Shift+- | Go to next cursor location |
| Other Windows | None | Submenu for less common windows (Find Results, Command Window, Web Browser, etc.) |

### Project Menu

| Item | Description |
|------|-------------|
| Add New Item | Add a file to the project using templates (Ctrl+Shift+A) |
| Add Existing Item | Add an existing file to the project (Shift+Alt+A) |
| Add Reference | Add assembly or project references |
| Add Connected Service | Connect to Azure, REST APIs, or other services |
| Manage NuGet Packages | Open NuGet package manager for the current project |
| Set as Startup Project | Designate which project launches on F5 |
| Project Dependencies | Configure build order dependencies between projects |
| Project Build Order | View and modify the order projects are built |
| Configure Tools for Unreal Engine | Open UE5 integration configuration dialog (appears for UE5 projects) |
| Retarget Solution | Update project toolsets (used for C++ modernization with Copilot) |
| Properties | Alt+Enter. Open the project properties pages |

### Build Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Build Solution | Ctrl+Shift+B | Build all projects in the solution |
| Rebuild Solution | None | Clean and build all projects |
| Clean Solution | None | Delete all build output files |
| Build <Project> | None | Build only the selected/startup project |
| Rebuild <Project> | None | Clean and build the selected project |
| Clean <Project> | None | Clean the selected project |
| Batch Build | None | Build multiple configurations at once (e.g., Debug x64 and Release x64) |
| Configuration Manager | None | Create, edit, and manage solution configurations and platforms |
| Cancel | None | Cancel a running build |
| Run Code Analysis on Solution | None | Run static analysis on all projects |
| Run Code Analysis on <Project> | None | Run static analysis on the selected project |

### Debug Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Start Debugging | F5 | Build and launch with debugger attached |
| Start Without Debugging | Ctrl+F5 | Build and launch without debugger |
| Attach to Process | Ctrl+Alt+P | Attach debugger to a running process |
| Detach All | None | Detach the debugger from all processes |
| Stop Debugging | Shift+F5 | Stop the debugger and terminate the process |
| Restart | Ctrl+Shift+F5 | Stop and restart debugging |
| Continue | F5 (when paused) | Resume execution after a breakpoint |
| Step Over | F10 | Execute the current line and move to the next |
| Step Into | F11 | Enter the function call on the current line |
| Step Out | Shift+F11 | Execute until the current function returns |
| Run to Cursor | Ctrl+F10 | Execute until the cursor position is reached |
| Set Next Statement | Ctrl+Shift+F10 | Move the instruction pointer to the cursor line |
| Show Next Statement | Alt+Num * | Navigate to the current execution point |
| Toggle Breakpoint | F9 | Add or remove a breakpoint on the current line |
| New Breakpoint > Function Breakpoint | Ctrl+K, B | Break when a named function is entered |
| New Breakpoint > Data Breakpoint | None | Break when a memory address changes value (C++ only) |
| Delete All Breakpoints | Ctrl+Shift+F9 | Remove all breakpoints in the solution |
| Enable All Breakpoints | None | Enable all disabled breakpoints |
| Disable All Breakpoints | None | Disable all breakpoints without removing them |
| Export Breakpoints | None | Save breakpoints to an XML file |
| Import Breakpoints | None | Load breakpoints from an XML file |
| Performance Profiler | Alt+F2 | Open the Performance Profiler launch page |
| Windows | None | Submenu for all debug windows (see Debugging section) |
| Options | None | Open Debug options in Settings |

### Test Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Test Explorer | Ctrl+E, T | Open Test Explorer |
| Run All Tests | Ctrl+R, A | Run all discovered tests |
| Run Tests In Context | Ctrl+R, T | Run tests in the current scope (method, class, or file) |
| Repeat Last Run | Ctrl+R, L | Re-run the last test set |
| Debug All Tests | Ctrl+R, Ctrl+A | Run all tests with debugger attached |
| Debug Tests In Context | Ctrl+R, Ctrl+T | Debug tests in the current scope |
| Analyze Code Coverage for All Tests | None | Run code coverage analysis (new in Community/Professional in VS 2026) |
| Configure Run Settings | None | Choose or create a .runsettings file |
| Playlist | None | Create and manage test playlists |

### Analyze Menu

| Item | Description |
|------|-------------|
| Run Code Analysis > On Solution | Run static analysis on the entire solution |
| Run Code Analysis > On <Project> | Run static analysis on a specific project |
| Calculate Code Metrics | Calculate maintainability, complexity, and other metrics |
| Code Cleanup | Run configured code cleanup profile |
| Code Cleanup Configuration | Configure which fixers are applied during cleanup |

### Tools Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| Options | None | Open the Settings / Options dialog (see Settings sections below) |
| NuGet Package Manager > Manage NuGet Packages for Solution | None | Solution-level NuGet management |
| NuGet Package Manager > Package Manager Console | None | PowerShell-based NuGet command line |
| NuGet Package Manager > Package Manager Settings | None | Configure package sources and behavior |
| Connect to Database | None | Open Server Explorer database connection wizard |
| Code Snippets Manager | Ctrl+K, Ctrl+B | Browse and manage code snippet templates |
| External Tools | None | Configure external programs to launch from the Tools menu |
| Import and Export Settings | None | Save, load, or reset IDE settings |
| Customize | None | Customize menus, toolbars, and keyboard shortcuts |
| Command Line > Developer PowerShell | None | Open PowerShell with build tools in PATH |
| Command Line > Developer Command Prompt | None | Open cmd.exe with build tools in PATH |
| Get Tools and Features | None | Open Visual Studio Installer to modify workloads |

### Extensions Menu

| Item | Description |
|------|-------------|
| Manage Extensions | Browse, install, update, and uninstall extensions from the Visual Studio Marketplace |
| Extension Development > Start Experimental Instance | Launch a sandboxed VS instance for testing extensions |
| Extension Development > Reset Experimental Instance | Reset the experimental instance to clean state |

### Window Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| New Window | None | Open a second view of the current document |
| Split | None | Split the current editor horizontally |
| Float | None | Detach the current window to float freely |
| Dock | None | Dock a floating window back into the IDE |
| Auto Hide | None | Collapse the window to a tab on the edge |
| New Horizontal Tab Group | None | Split the document well horizontally |
| New Vertical Tab Group | None | Split the document well vertically |
| Close All Documents | None | Close all open document tabs |
| Reset Window Layout | None | Reset all windows to the default layout |
| Save Window Layout | None | Save the current window arrangement for later |
| Apply Window Layout | None | Apply a previously saved window layout |
| Manage Window Layouts | None | Rename or delete saved layouts |

### Help Menu

| Item | Shortcut | Description |
|------|----------|-------------|
| View Help | Ctrl+F1 | Open documentation |
| Send Feedback > Report a Problem | None | Submit a bug report to Microsoft |
| Send Feedback > Suggest a Feature | None | Submit a feature request |
| Check for Updates | None | Check for IDE and extension updates |
| About Microsoft Visual Studio | None | Version info, license, installed components |

---
