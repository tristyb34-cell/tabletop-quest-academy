## Terminal and Command Window

### Integrated Terminal (Ctrl+`)

**View > Terminal**

| Feature | Description |
|---------|-------------|
| Multiple profiles | PowerShell, Command Prompt, Developer PowerShell, Developer Command Prompt, WSL, Git Bash |
| Multiple instances | Open several terminal tabs simultaneously |
| Split panes | Split a terminal tab into side-by-side views |
| Custom profiles | Add custom shell profiles in terminal settings |

### Developer Command Prompt

**Tools > Command Line > Developer Command Prompt**

Pre-configured with:
- MSVC compiler (cl.exe) in PATH
- Linker (link.exe) in PATH
- Windows SDK tools in PATH
- MSBuild in PATH
- Environment variables for include/lib paths

### Developer PowerShell

Same as Developer Command Prompt but using PowerShell. Preferred for modern scripting.

### Command Window (Ctrl+Alt+A)

Execute Visual Studio commands by name:

| Command | Description |
|---------|-------------|
| `Debug.Start` | Start debugging |
| `File.OpenFile <path>` | Open a file |
| `Edit.Find <text>` | Find text |
| `Tools.Shell <command>` | Run an external command |
| `>` prefix | Switch to Immediate Window mode |
| `?expression` | Evaluate an expression |

---
