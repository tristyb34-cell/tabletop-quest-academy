## Debugging (Comprehensive)

### General Debugging Settings

**Path: Tools > Options > Debugging > General**

| Setting | Description | Recommended for UE5 |
|---------|-------------|---------------------|
| Enable Just My Code | Skip external/library code when stepping | DISABLE for UE5 (you need to step into engine code) |
| Enable .natvis diagnostic messages | Help troubleshoot UE5 custom debug visualizers | True |
| Enable Source Link support | Download source from source-linked symbols | True |
| Require source files to exactly match the original version | Strict source matching | False (allows debugging after minor engine updates) |
| Show disassembly if source is not available | Fall back to assembly view | True |
| Enable address-level debugging | Show disassembly and registers | True for C++ |
| Step over properties and operators | Skip property getters/setters during Step Into | Personal preference |
| Use managed compatibility mode | Use legacy debugging engine | False |
| Use native compatibility mode | Use legacy native debugging engine | False (must be False for natvis to work) |

### C++ Debugging Settings

**Path: Tools > Options > Debugging > C++**

| Setting | Description | Recommended for UE5 |
|---------|-------------|---------------------|
| Enable Native Edit and Continue | Allow code edits during debugging | DISABLE (UE5 uses Live Coding instead) |

### Symbol Settings

**Path: Tools > Options > Debugging > Symbols**

| Setting | Description | Recommended for UE5 |
|---------|-------------|---------------------|
| Symbol file (.pdb) locations | Search paths for debug symbols | Add your project's Binaries/Win64/ folder |
| Load all modules, unless excluded | Load symbols for everything | Use "Load only specified modules" instead for performance |
| Load only specified modules | Only load symbols you specify | Add your game module DLLs (e.g., MyGame.dll, MyGameEditor.dll) |
| Microsoft Symbol Servers | Download symbols for Windows system DLLs | Enable when debugging OS-level issues |
| NuGet.org Symbol Server | Download symbols for NuGet packages | Enable for .NET components |
| Cache symbols in this directory | Local symbol cache path | Keep default or set to a fast SSD path |

### Breakpoint Types

#### Line Breakpoints
- Click the left gutter or press **F9** on any line
- Red circle appears in the gutter
- Execution pauses when this line is about to execute

#### Conditional Breakpoints
Right-click a breakpoint > **Conditions**:

| Condition Type | Description | Example |
|----------------|-------------|---------|
| Conditional Expression (Is true) | Break only when expression evaluates to true | `Health < 0` |
| Conditional Expression (When changed) | Break when expression value changes | `PlayerState` |
| Hit Count | Break after N hits | `== 100` (break on 100th hit), `>= 50`, `Multiple of 10` |
| Filter | Restrict to specific threads or processes | `ThreadName == "GameThread"` |

#### Tracepoints (Actions)
Right-click a breakpoint > **Actions**:
- Print a message to the Output window without stopping execution
- Use `{variable}` to include variable values in the message
- Check "Continue Execution" to make it a tracepoint instead of a breakpoint
- Example message: `Player health is {Health} at frame {FrameCount}`

#### Function Breakpoints
**Debug > New Breakpoint > Function Breakpoint** (Ctrl+K, B):
- Break when a named function is called
- Enter the fully qualified function name (e.g., `APlayerCharacter::TakeDamage`)
- Can include conditions

#### Data Breakpoints (C++ Only)
**Debug > New Breakpoint > Data Breakpoint**:
- Break when a specific memory address is written to
- Set in the Watch window: right-click a variable and select "Break When Value Changes"
- Maximum 4 hardware data breakpoints on most CPUs
- Extremely useful for finding who modifies a variable unexpectedly

#### Dependent Breakpoints
- Right-click a breakpoint > **Conditions > Only enable when the following breakpoint is hit**
- Creates a chain: breakpoint B only activates after breakpoint A has been hit
- Useful for debugging specific code paths

#### Temporary Breakpoints
- **Ctrl+F9**: Set a breakpoint that auto-deletes after being hit once
- Useful for "run to here and stop, but only once"

### Watch Windows

Four watch windows (Watch 1 through Watch 4) let you monitor expressions:

| Feature | Description |
|---------|-------------|
| Add expression | Type any valid C++ expression to watch |
| Modify value | Double-click the value column to change a variable's value at runtime |
| Pin to source | Pin a DataTip to follow a variable in the editor |
| Format specifiers | Append format specifiers to change display: `,x` for hex, `,d` for decimal, `,o` for octal, `,s` for string, `,su` for Unicode string, `,na` for no address, `,[N]` to show N array elements |
| Pseudovariables | `$err` (last error), `$handles` (handle count), `$vframe` (virtual frame pointer), `$tid` (thread ID), `$env` (environment), `$cmdline` (command line) |

### Autos and Locals Windows

- **Autos** (Ctrl+Alt+V, A): Shows variables used in the current and previous statements. Automatically populated.
- **Locals** (Ctrl+Alt+V, L): Shows all local variables in the current function scope.

Both support all Watch window features (modify values, format specifiers, pin to source).

### Call Stack Window (Ctrl+Alt+C)

| Feature | Description |
|---------|-------------|
| View source | Double-click a frame to navigate to that code |
| Show external code | Toggle to show or hide engine/library frames |
| Copy stack | Copy the entire call stack as text |
| Run to frame | Right-click > Run to Cursor on a specific frame |
| Switch frame | Click a frame to change context (Locals/Autos update) |
| Analyze Call Stack with Copilot (new) | One-click AI analysis of the call stack, explains why execution paused |
| Parameter values | Shows function arguments for each frame |

### Memory Windows (Ctrl+Alt+M, 1-4)

- View raw memory at any address
- Enter an address or expression in the Address field (e.g., `&MyVariable`, `0x7FFE1234`)
- Toggle display format: 1/2/4/8 byte integers, floats, hex, ASCII, Unicode
- Useful for examining raw buffer contents, network packets, or verifying memory layouts

### Disassembly Window (Ctrl+Alt+D)

- Shows assembly instructions for the current function
- Source lines are interleaved with assembly
- Set breakpoints on individual assembly instructions
- Step through one instruction at a time with Step Into (F11) when in disassembly

### Registers Window (Ctrl+Alt+G)

- Shows CPU register values (EAX, EBX, ECX, etc. or RAX, RBX, RCX for x64)
- Highlighting indicates values that changed since the last step
- Useful for low-level debugging and performance optimization

### Immediate Window (Ctrl+Alt+I)

- Execute C++ expressions during debugging
- Call functions: `MyObject->GetHealth()`
- Modify variables: `Health = 100`
- Evaluate complex expressions
- Execute debugger commands

### Diagnostic Tools Window (Ctrl+Alt+F2)

Appears during debugging and shows:
- **Events timeline**: Breakpoints, output messages, exceptions, and IntelliTrace events over time
- **CPU Usage**: Real-time CPU usage graph with per-function breakdown
- **Memory Usage**: Heap snapshots and memory allocation tracking

### Exception Settings (Ctrl+Alt+E)

Configure which exceptions break into the debugger:

| Category | Description |
|----------|-------------|
| C++ Exceptions | Standard C++ exceptions (std::exception, std::runtime_error, etc.) |
| Win32 Exceptions | Windows SEH exceptions (Access Violation, Stack Overflow, etc.) |
| Common Language Runtime Exceptions | .NET exceptions |
| GPU Memory Access Exceptions | GPU-specific exceptions |

For each exception you can set:
- **Break when thrown**: Always break, even if caught by a handler
- **User-unhandled**: Only break if no handler catches it

### Inline Debugging Values (New in VS 2026)

VS 2026 displays values directly in the editor:

| Feature | Description |
|---------|-------------|
| Inline if-statement values | Shows true/false next to condition evaluation |
| Inline variables and parameters | Shows parameter values and loop variables inline |
| Inline post-return values | Shows return values at the point of use |
| Analyze with Copilot | Hover over inline values and click "Analyze with Copilot" for AI explanation |

### Natvis Files (UE5 Custom Visualizers)

UE5 ships `.natvis` files in `Engine/Extras/VisualStudioDebugging/` that make Unreal types readable in watch windows. Without them, types like FString, TArray, TMap, and FVector show as raw memory.

These auto-load when you open a UE5 project. If they are not working, check:
- **Tools > Options > Debugging > General** > "Use native compatibility mode" = **False**
- The `.natvis` files are present in the engine directory

Types that natvis covers include: FString, FName, FText, TArray, TMap, TSet, TSharedPtr, TWeakObjectPtr, FVector, FRotator, FTransform, FQuat, FColor, FLinearColor, and many more.

### Attach to Process (Ctrl+Alt+P)

For UE5 development, you often want to attach to the already-running editor:

1. **Debug > Attach to Process** (Ctrl+Alt+P)
2. Filter the process list by typing "UnrealEditor"
3. Select **UnrealEditor.exe**
4. Ensure "Attach to" says **"Native code"**
5. Click **Attach**

This is faster than launching the editor through F5 every time.

### Smarter Breakpoint Troubleshooting (New in VS 2026)

Copilot automatically fixes unbound breakpoints by:
- Checking file and module loading
- Verifying symbols are loaded
- Detecting wrong debug engine selection
- Identifying Just My Code conflicts
- Finding managed optimization issues
- Detecting outdated binaries

### Exception Analysis with Repository Context (New in VS 2026)

Copilot cross-references GitHub/Azure DevOps repos when analyzing exceptions, looking at past bugs, issues, pull requests, and historical fixes for context-aware debugging insights.

### Edit and Continue vs. Live Coding

| Feature | Edit and Continue | UE5 Live Coding |
|---------|-------------------|-----------------|
| How it works | Recompiles modified functions and patches them in-place during debugging | Recompiles modified .cpp files and patches the running editor |
| Shortcut | Apply Code Changes button | Ctrl+Alt+F11 in UE5 Editor |
| Header changes | Limited support | Requires full rebuild |
| Recommended for UE5 | DISABLE (conflicts with Live Coding) | USE THIS |

### Hot Reload (.NET / Blazor)

For .NET projects (not UE5), Hot Reload applies code changes without restarting:
- Automatically triggered on save during debugging (Ctrl+S)
- Supports C# method body edits, Razor file edits, CSS changes
- "Rude edits" (changes that can't be hot-reloaded) now auto-restart the process in VS 2026
- Configure auto-restart in project file: `<HotReloadAutoRestart>true</HotReloadAutoRestart>`

---
