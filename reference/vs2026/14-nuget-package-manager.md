## NuGet Package Manager

### Accessing NuGet

| Method | Path |
|--------|------|
| GUI | Right-click project/solution > Manage NuGet Packages |
| Console | Tools > NuGet Package Manager > Package Manager Console |
| CLI | `dotnet add package <name>` or `nuget install <name>` |

### Package Manager UI

| Tab | Description |
|-----|-------------|
| Browse | Search and install new packages from configured sources |
| Installed | View and manage packages already in the project |
| Updates | See available updates for installed packages |
| Consolidate | Ensure all projects use the same package versions (solution-level only) |

### Package Sources

**Path: Tools > Options > NuGet Package Manager > Sources**

| Feature | Description |
|---------|-------------|
| Default source | nuget.org (https://api.nuget.org/v3/index.json) |
| Custom sources | Add private feeds (Azure Artifacts, GitHub Packages, MyGet, etc.) |
| Use separate sources for vulnerability audit (new) | Configure dedicated audit sources for security scanning |
| Package source priority | Order determines search preference |

### Package Manager Console Commands

```
Install-Package <PackageName>
Update-Package <PackageName>
Uninstall-Package <PackageName>
Get-Package                          # List installed packages
Get-Package -Updates                 # List available updates
Install-Package <Name> -Version X.Y  # Install specific version
```

### NuGet Audit (New in VS 2026)

VS 2026 can now audit packages for known vulnerabilities using configured audit sources. Vulnerable packages are flagged in the NuGet Package Manager UI.

### NuGet MCP Server (New in VS 2026)

A built-in MCP server for NuGet that integrates with Copilot Chat:
1. Open Copilot Chat
2. Click the tools icon in the bottom toolbar
3. Enable the "nuget" MCP server

Commands:
- "Fix my package vulnerabilities"
- "Update all my packages to the latest compatible versions"
- "Update the package [PackageName] to version [VersionNumber]"

---
