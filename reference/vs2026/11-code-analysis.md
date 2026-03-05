## Code Analysis

### C++ Static Analysis

**Path: Project Properties > Code Analysis**

| Setting | Description |
|---------|-------------|
| Enable Code Analysis on Build | Run analysis automatically during builds |
| Rule Set | Choose which rules to enforce (Microsoft Native Recommended, C++ Core Guidelines, All Rules, or custom) |
| Additional Options | Compiler flags for analysis |
| Run Clang-Tidy | Enable clang-tidy analysis alongside MSVC |

#### C++ Core Guidelines Checks

The C++ Core Guidelines checker enforces rules from Bjarne Stroustrup and Herb Sutter's C++ Core Guidelines. Categories include:

| Category | Examples |
|----------|---------|
| Bounds | Avoid pointer arithmetic, use span instead |
| Type | Avoid C-style casts, use static_cast/reinterpret_cast |
| Lifetime | Avoid dangling pointers and references |
| Resource | Use RAII, avoid naked new/delete |
| Concurrency | Avoid data races, use proper synchronization |
| Const | Use const correctness |
| Enum | Properly scope enumerations |
| Performance | Avoid unnecessary copies, use move semantics |

#### Clang-Tidy Configuration (New in VS 2026)

**Path: Project Properties > Code Analysis > Clang-Tidy**

| Setting | Description |
|---------|-------------|
| Multi-processor allocation | Run clang-tidy in parallel across multiple cores |
| Custom command-line arguments | Pass additional flags to clang-tidy |
| Enable/Disable specific checks | Fine-grained control over which clang-tidy checks run |

### .editorconfig Support

Place a `.editorconfig` file in your project root to enforce coding style across the team:

```ini
root = true

[*.{cpp,h}]
indent_style = tab
indent_size = 4
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.cs]
dotnet_sort_system_directives_first = true
csharp_new_line_before_open_brace = all
csharp_style_var_for_built_in_types = false
```

### Code Cleanup

**Path: Analyze > Code Cleanup Configuration**

Create cleanup profiles that apply multiple fixers in one pass. Common fixers:
- Remove unnecessary imports/usings
- Sort imports/usings
- Remove unnecessary casts
- Apply file header preferences
- Format document
- Remove unused variables
- Apply object/collection initialization preferences

Run cleanup: **Ctrl+K, Ctrl+E** or **Analyze > Code Cleanup > Run Code Cleanup**

### Code Metrics

**Path: Analyze > Calculate Code Metrics**

| Metric | Description | Good Range |
|--------|-------------|------------|
| Maintainability Index | Overall maintainability score (0-100) | 20-100 (higher is better) |
| Cyclomatic Complexity | Number of independent code paths | 1-10 per method |
| Depth of Inheritance | How deep in the class hierarchy | 1-5 |
| Class Coupling | How many other classes this class depends on | Lower is better |
| Lines of Source Code | Source code lines excluding blank lines and comments | Shorter methods are better |
| Lines of Executable Code | Compiled IL/machine code instructions | Fewer is simpler |

---
