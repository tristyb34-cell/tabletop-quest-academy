## Environment Settings

### Environment > General

**Path: Tools > Options > Environment > General**

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Color theme | Overall IDE color scheme | Dark (reduces eye strain for long sessions) |
| Editor appearance | Independent editor theme (new in VS 2026). Can differ from the IDE theme | Match your preference |
| Automatically adjust visual experience based on client performance | Reduce animations on slower hardware | True |
| Enable rich client visual experience | Full animations and visual effects | True on powerful machines |
| Use hardware graphics acceleration if available | Offload UI rendering to GPU | True |

### Environment > Visual Experience (New in VS 2026)

**Path: Tools > Options > Environment > Visual Experience**

| Setting | Description |
|---------|-------------|
| Use compact spacing in Solution Explorer | Toggle between default and compact spacing between tree items |
| Enable rich client visual experience | Full visual effects |
| Automatically adjust visual experience | Auto-reduce visual effects on slower hardware |

### Environment > Fonts and Colors

**Path: Tools > Options > Environment > Fonts and Colors**

Controls fonts and colors for every element in the IDE. Key settings:

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Font | Editor font family | JetBrains Mono, Fira Code, Cascadia Code, or Consolas |
| Size | Font size in points | 11-13 depending on monitor DPI |
| Display items | Individual syntax elements you can customize (keywords, comments, strings, operators, etc.) | Use a theme as base, adjust individual items as needed |

New in VS 2026: A dedicated "Code Completion" display item category lets you customize how autocomplete suggestions appear (opacity, italic, etc.).

### Environment > Keyboard

**Path: Tools > Options > Environment > Keyboard**

| Feature | Description |
|---------|-------------|
| Show commands containing | Search for any command by partial name |
| Apply keyboard mapping scheme | Choose a preset (General, C++, C#, VS Code-compatible) |
| Press shortcut keys | Record a new shortcut for a command |
| Use new shortcut in | Scope the shortcut to specific contexts (Global, Text Editor, Debug, etc.) |
| Remove | Remove a shortcut binding |

VS 2026 adds new default shortcuts aligned with VS Code:
- Ctrl+W closes the current tab (in addition to Ctrl+F4)
- Ctrl+P opens Code Search (in addition to Ctrl+T)
- Ctrl+Shift+P opens Feature Search (All-In-One Search)
- Ctrl+/ toggles line comments

### Environment > Tabs and Windows

**Path: Tools > Options > Environment > Tabs and Windows**

| Setting | Description |
|---------|-------------|
| Tab layout | Top, Left, Right, or Bottom tab placement |
| Insert new tabs to the right of existing tabs | Where new tabs appear |
| Show pinned tabs in a separate row | Pin frequently used files to their own tab row |
| Allow tab reordering | Drag tabs to rearrange |
| Show previews of pinned tabs | Preview tab content on hover |
| Preview tab | Single-click opens files in a preview tab; double-click opens permanently |
| Colorize document tabs by project | Each project gets its own tab color |

### Environment > Startup

**Path: Tools > Options > Environment > Startup**

| Option | Description |
|--------|-------------|
| On startup, open | Start Window, Empty environment, or last loaded solution |
| Show Start Window on startup | Show the start/welcome page |

For UE5 development, set to "Open last solution" to resume quickly.

### Environment > Documents

**Path: Tools > Options > Environment > Documents**

| Setting | Description |
|---------|-------------|
| Detect when file is changed outside the environment | Prompt or auto-reload files modified externally (e.g., by UnrealBuildTool) |
| Auto-load changes if saved | Automatically reload externally modified files without prompting |
| Allow editing of read-only files | Whether to warn when editing read-only files |

### Environment > AutoRecover

**Path: Tools > Options > Environment > AutoRecover**

| Setting | Default | Description |
|---------|---------|-------------|
| Save AutoRecover information every | 5 minutes | How often to auto-save backup copies |
| Keep AutoRecover information for | 7 days | How long to retain auto-save files |

### Environment > Preview Features

**Path: Tools > Options > Environment > Preview Features**

Toggle experimental features. Some notable VS 2026 preview features:

| Feature | Description |
|---------|-------------|
| View pull requests for a Git repository | Enable in-IDE pull request viewing |
| C++ Code Editing Tools for Agent Mode | Let Copilot navigate your C++ codebase with full symbol awareness |
| Build Performance for Windows (C++) | AI analysis of build bottlenecks |
| GitHub Cloud Agent | Delegate repetitive tasks to an AI coding agent |

### Environment > Accounts

**Path: Tools > Options > Environment > Accounts**

- Sign in with a Microsoft account to sync settings across machines
- Visual Studio subscribers are automatically licensed upon sign-in
- Product keys can be retrieved from my.visualstudio.com

### Environment > Search (New in VS 2026)

**Path: Tools > Options > Environment > Search**

| Setting | Description |
|---------|-------------|
| Exclude files from search results | Define glob patterns to exclude files from Find in Files and Quick Find |

### Environment > Security > Certificates (New in VS 2026)

**Path: Tools > Options > Environment > Security > Certificates**

| Setting | Description |
|---------|-------------|
| Perform Certificate Revocation Checks | VS alerts you about digital certificate problems during network calls |

### Environment > Proxy Settings (New in VS 2026)

**Path: Tools > Options > Environment > Proxy Settings**

Consolidated proxy configuration for teams behind enterprise firewalls or VPNs. Previously these settings were scattered across multiple locations.

### Environment > International

**Path: Tools > Options > Environment > International**

| Setting | Description |
|---------|-------------|
| Language | IDE display language (requires language pack) |

---
