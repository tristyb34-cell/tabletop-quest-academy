## Projects and Solutions Settings

### Projects and Solutions > General

**Path: Tools > Options > Projects and Solutions > General**

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Track Active Item in Solution Explorer | Auto-select the current file in Solution Explorer | Enable |
| Show advanced build configurations | Show Debug/Release/Custom config dropdowns | Enable |
| Always show Error List if build finishes with errors | Auto-open Error List on failed builds | Enable |
| Show output window when build starts | Auto-show the Output window during builds | Enable |
| Prompt for symbolic renaming when renaming files | Auto-rename classes when renaming their files | Enable |
| Show symbols under Solution Explorer files | Display class/method symbols under files in Solution Explorer | Disable for UE5 (too many symbols in large projects) |

### Projects and Solutions > Build and Run

**Path: Tools > Options > Projects and Solutions > Build and Run**

| Setting | Description | Recommended for UE5 |
|---------|-------------|---------------------|
| Maximum number of parallel project builds | Number of projects built simultaneously | Match your CPU core count (e.g., 16 for 16 cores) |
| Only build startup projects and dependencies on Run | Skip rebuilding unchanged projects when pressing F5 | True (prevents rebuilding engine modules) |
| On Run, when projects are out of date | Whether to build before running | Always build |
| On Run, when build or deployment errors occur | Whether to launch old build when current fails | Do not launch |
| MSBuild project build output verbosity | How much detail in build output | Minimal (increase to Diagnostic when troubleshooting) |

### Projects and Solutions > Locations

**Path: Tools > Options > Projects and Solutions > Locations**

| Setting | Description |
|---------|-------------|
| Projects location | Default folder for new projects |
| User project templates location | Where custom project templates are stored |
| User item templates location | Where custom item templates are stored |

---
