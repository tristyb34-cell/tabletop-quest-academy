## IntelliSense and Code Navigation

### IntelliSense Features

| Feature | Trigger | Description |
|---------|---------|-------------|
| Auto-complete | Type or Ctrl+Space | Suggests completions as you type. Now with syntax-highlighted suggestions in VS 2026 |
| Parameter Info | Type `(` after function name | Shows function signature with parameter types and names |
| Quick Info | Hover over a symbol | Shows type info, documentation, and declaration |
| Member List | Type `.`, `->`, or `::` | Shows members of the current object/class/namespace |
| Signature Help | Ctrl+Shift+Space | Re-shows parameter info for the current function call |

### Code Navigation

| Action | Shortcut | Description |
|--------|----------|-------------|
| Go To Definition | F12 | Jump to where the symbol is defined |
| Go To Declaration | Ctrl+F12 | Jump to the declaration (header file for C++) |
| Go To Implementation | Ctrl+F12 | Jump to the implementation of an interface/virtual method |
| Peek Definition | Alt+F12 | Show definition inline without leaving the current file |
| Find All References | Shift+F12 | Find every usage of the symbol in the solution |
| Go To All | Ctrl+T or Ctrl+P | Search for files, types, members, symbols all at once |
| Go To File | Ctrl+1, F | Navigate to a file by name |
| Go To Type | Ctrl+1, T | Navigate to a type by name |
| Go To Member | Ctrl+1, M | Navigate to a member by name |
| Go To Symbol | Ctrl+1, S | Navigate to a symbol |
| Go To Line | Ctrl+G | Jump to a line number |
| Navigate Backward | Ctrl+- | Return to previous cursor position |
| Navigate Forward | Ctrl+Shift+- | Go forward in cursor history |
| Go To Next Issue | Alt+PgDn | Jump to next error/warning in file |
| Go To Previous Issue | Alt+PgUp | Jump to previous error/warning in file |
| Bracket Matching | Ctrl+] | Jump to the matching brace/bracket/parenthesis |
| Go To Enclosing Block | None | Navigate to the enclosing scope |

### Peek Definition (Alt+F12)

Opens an inline window showing the definition without leaving your current file. You can:
- Edit code in the peek window
- Chain peeks (peek from within a peek)
- Pin peek windows to keep them open
- Navigate through multiple definitions if the symbol has several

### CodeLens

Inline annotations above functions/classes showing:
- Number of references
- Git author of last change
- Test pass/fail status
- Related code changes

Note: Consider disabling for UE5 projects (see Text Editor > CodeLens settings) as it adds significant overhead on large codebases.

### Code Maps

Visualize code relationships as an interactive graph. Shows call chains, dependencies, and inheritance hierarchies. Available through Architecture menu in Enterprise edition.

### C++ Attributes Syntax Highlighting (New in VS 2026)

C++ attributes like `[[nodiscard]]`, `[[deprecated]]`, `[[maybe_unused]]` now receive proper syntax highlighting in the editor.

### Class View Substring Search (New in VS 2026)

Class View now supports substring searches instead of just prefix matching. Searching for "Player" will find "APlayerCharacter", "UPlayerState", etc.

### The UE5 IntelliSense Problem

UE5 projects often span millions of lines of code. Default IntelliSense settings can cause slowdowns, high memory usage, or crashes. Common issues:

1. **False-positive red squiggles**: IntelliSense parser doesn't understand all UE5 macros (GENERATED_BODY, UPROPERTY, UFUNCTION, UCLASS, USTRUCT, UENUM). These are not compiler errors.
2. **Slow parsing**: Full solution parsing can take several minutes.
3. **High memory usage**: Each cached translation unit consumes significant RAM.

#### Solutions (in order of preference)
1. Tune IntelliSense settings (see Text Editor > C/C++ > Advanced section)
2. Regenerate project files from UE5 Editor (File > Refresh Visual Studio Project)
3. Delete the `.vs` folder to reset the IntelliSense database
4. Install Visual Assist extension (see Extensions section)

---
