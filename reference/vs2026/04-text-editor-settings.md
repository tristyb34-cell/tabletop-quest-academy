## Text Editor Settings

All text editor settings are found under **Tools > Options > Text Editor**. In VS 2026, many settings have been reorganized into the new Fluent-aligned Settings UI, but the paths below still work (legacy links redirect).

### Text Editor > General

**Path: Tools > Options > Text Editor > General**

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Line numbers | Show line numbers in the left gutter | Enable |
| Word wrap | Visually wrap long lines | Disable for C++ |
| Track changes | Color margin showing modified lines (yellow = unsaved, green = saved) | Enable |
| Sticky Scroll | Pin scope headers (class names, function signatures) to the top of the editor while scrolling | Enable |
| Brace pair colorization | Color-code matching braces/brackets/parentheses by nesting depth | Enable |
| Show editing context in the editor | Display line/column, selection info, and encoding in the editor margin (new in VS 2026) | Enable |

### Text Editor > General > Display (New in VS 2026)

**Path: Tools > Options > Text Editor > General > Display**

| Setting | Description |
|---------|-------------|
| Show editing context in the editor | Enables the unified line/column display, selection information, and file encoding display in the bottom margin of the editor |

### Text Editor > Advanced (New/Moved in VS 2026)

**Path: Tools > Options > Text Editor > Advanced**

Several settings that were under C/C++ Advanced have moved here in VS 2026:

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Touchpad and mouse wheel scrolling sensitivity | Controls scroll speed | Default |
| Middle click to scroll | Press scroll wheel and move mouse to scroll | Personal preference |
| Compress blank lines | Syntactically compress blank lines by 25% for denser code view | Try it |
| Compress lines that do not have any alphanumeric characters | Lines with only braces/symbols compress by 25% (syntactic line compression) | Try it |
| Show Quick Actions icon inside the editor | Move the lightbulb icon inline with code instead of in the left margin, making the margin slimmer | Enable |

### Text Editor > All Languages > CodeLens

**Path: Tools > Options > Text Editor > All Languages > CodeLens**

| Setting | Description | Recommended for UE5 |
|---------|-------------|---------------------|
| Enable CodeLens | Shows inline annotations (references, changes, test status) above functions | Disable for UE5 (adds overhead on large codebases) |
| Show C/C++ references | Show how many places reference each function/class | Disable for UE5 performance |
| Show Git Author | Show who last modified each function | Optional |
| Show Test Status | Show pass/fail for functions with unit tests | Optional |

### Text Editor > Code Completions (New in VS 2026)

**Path: Tools > Options > Text Editor > Code Completions**

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Use colorized text for code completions | Syntax highlighting in autocomplete suggestions | Enable |
| Click to accept | Click a segment of completion suggestion to accept up to cursor | Enable |

### Text Editor > C/C++ > General

**Path: Tools > Options > Text Editor > C/C++ > General**

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Auto list members | Show autocomplete dropdown as you type | Enable |
| Parameter information | Show function parameter hints when typing "(" | Enable |
| Auto brace completion | Automatically insert closing brace/bracket/paren | Enable |
| Add semicolon for types (new in VS 2026) | Auto-insert semicolon after closing brace of type definitions (struct, class, enum) | Enable |
| Complete parentheses in raw string literals (new) | Auto-insert closing paren in raw string R"(...)" | Enable |
| Complete multiline comments (new) | Auto-insert closing */ for block comments | Enable |

### Text Editor > C/C++ > Advanced

**Path: Tools > Options > Text Editor > C/C++ > Advanced**

Note: In VS 2026, some options have moved to other locations. The legacy path still works via redirect links.

#### IntelliSense Settings

| Setting | Description | Recommended for UE5 |
|---------|-------------|---------------------|
| Disable Squiggles | Suppress IntelliSense error underlines | False (keep squiggles on; set True only if UE5 macro false positives are unbearable) |
| IntelliSense Rescan Interval | How often IntelliSense re-scans changed files (ms) | 30000 (30 sec) if your machine can handle it; default is 60000 |
| Member List Filter Mode | How autocomplete filters results | Fuzzy |
| Disable Aggressive Member List Filtering | Whether to narrow autocomplete results aggressively | False |
| Max Cached Translation Units | Number of translation units kept in memory for faster IntelliSense | 8 (if 32GB+ RAM; default is 2) |
| Disable IntelliSense | Turn off all IntelliSense features | False |
| IntelliSense Error Limit | Maximum errors IntelliSense reports | 1000 (default) |
| Disable Database | Disable the IntelliSense database for symbol storage | False |
| Disable Inactive Code Analysis | Skip analysis of code in #if 0 or irrelevant #ifdef blocks | True (saves CPU) |
| Enable Single File IntelliSense | Provide IntelliSense for individual files before full solution parse completes | True |
| Enable Single File Preprocess | Allow right-click > Preprocess on .cpp files to see fully expanded macro output | True |

#### Browsing/Navigation Settings

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Disable External Dependencies Folders | Hide the "External Dependencies" virtual folder in Solution Explorer | True (reduces noise from thousands of engine headers) |

### Text Editor > C/C++ > Formatting

**Path: Tools > Options > Text Editor > C/C++ > Formatting**

#### General
| Setting | Recommended for UE5 |
|---------|---------------------|
| Automatically format when I paste | Enable |
| Automatically format block on } | Enable |
| Automatically format on semicolon | Enable |

#### Indentation
| Setting | Recommended for UE5 |
|---------|---------------------|
| Tab type | Tabs (UE5 coding standard) |
| Tab size | 4 |
| Indent size | 4 |
| Keep Tabs | Yes |

#### New Lines
| Setting | Recommended for UE5 |
|---------|---------------------|
| Place open brace on new line for functions | Yes (Allman style, matches UE5) |
| Place open brace on new line for control blocks | Yes |
| Place open brace on new line for types | Yes |
| Place open brace on new line for namespaces | Yes |
| Place open brace on new line for lambdas | No (UE5 lambdas use K&R style) |

#### Spacing
| Setting | Recommended for UE5 |
|---------|---------------------|
| Insert space within argument list parentheses | No. UE5 uses `Func(Arg1, Arg2)` not `Func( Arg1, Arg2 )` |
| Insert space after keywords in control flow | Yes. UE5 uses `if (cond)` not `if(cond)` |
| Insert space before opening brace of lambda | Yes |

### Text Editor > C/C++ > Code Style

**Path: Tools > Options > Text Editor > C/C++ > Code Style**

| Setting | Description | Recommended |
|---------|-------------|-------------|
| Prefer braces | When to add braces to single-line if/for/while | Always (prevents subtle bugs) |
| Generated code style | Controls how VS generates boilerplate code | Adjust to match UE5 conventions |
| Prefer prefix increment/decrement | Whether to suggest ++i or i++ | Personal preference |

### Text Editor > C/C++ > Naming

**Path: Tools > Options > Text Editor > C/C++ > Code Style > Naming**

Define naming conventions for variables, functions, classes, etc. You can enforce naming rules like:

- Classes start with uppercase
- Member variables have specific prefixes
- Constants use UPPER_SNAKE_CASE

For UE5, the Epic naming conventions use:
- `F` prefix for structs (FVector, FString)
- `U` prefix for UObject classes (UActorComponent)
- `A` prefix for AActor classes (ACharacter)
- `E` prefix for enums (ECollisionChannel)
- `I` prefix for interfaces (IInterface)
- `T` prefix for templates (TArray, TMap)
- `b` prefix for booleans (bIsAlive)

### Text Editor > Scroll Bars

**Path: Tools > Options > Text Editor > All Languages > Scroll Bars**

| Setting | Description |
|---------|-------------|
| Use bar mode for vertical scroll bar | Standard scrollbar behavior |
| Use map mode for vertical scroll bar | Shows a minimap preview of the file in the scrollbar |
| Preview tooltip | Shows code preview on scrollbar hover |
| Show marks | Show bookmarks, errors, and breakpoints in the scrollbar gutter |
| Source overview | Show colored marks for changes, errors, and search results |

---
