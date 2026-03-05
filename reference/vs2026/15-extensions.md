## Extensions

### Extension Manager

**Extensions > Manage Extensions**

| Feature | Description |
|---------|-------------|
| Search | Find extensions by name or keyword |
| Categories | Browse by category (Code Analysis, Productivity, Testing, etc.) |
| Updates | Check for extension updates |
| Installed | Manage currently installed extensions |
| Roaming | Extensions that sync across machines |
| Per-User vs. Per-Machine | Install scope options |

VS 2026 is compatible with all 4,000+ extensions from VS 2022 without modification.

### Essential Extensions for C++ / Game Development

| Extension | Author | Description | Cost |
|-----------|--------|-------------|------|
| Visual Studio Tools for Unreal Engine | Microsoft | UE5 integration: Blueprint debugging, debug visualizers, UE5 toolbar, HLSL support | Free |
| Visual Assist | Whole Tomato | Faster IntelliSense, native UE5 macro understanding, better navigation and refactoring | $129 |
| ReSharper C++ | JetBrains | Advanced code analysis, refactoring, navigation, and code generation for C++ | $149/year |
| VS Color Output | Mike Ward | Colorizes the Output window (errors in red, warnings in yellow, etc.) | Free |
| Productivity Power Tools | Microsoft | Scrollbar highlights, match margin, alignment guides, double-click maximize | Free |
| CodeMaid | Steve Cadwallader | Code cleanup, organize, and simplify. Removes whitespace, sorts members | Free |
| IntelliCode | Microsoft | AI-assisted completions trained on open-source repositories | Free |
| Viasfora | Tomas Restrepo | Rainbow braces, keyword highlighting, and text decorations | Free |
| ClangFormat | LLVM | Format C++ code using clang-format rules | Free |
| Trailing Whitespace Visualizer | Mads Kristensen | Highlights trailing whitespace so you can remove it | Free |
| File Icons | Mads Kristensen | Better file icons in Solution Explorer for more file types | Free |
| Editor Guidelines | Paul Harrington | Vertical lines at specific columns (80, 120) in the editor | Free |

### Visual Assist Deep Dive

Visual Assist is the most popular extension for UE5 C++ development. Key features:

| Feature | Description |
|---------|-------------|
| VA IntelliSense | Faster and more accurate than built-in IntelliSense for large C++ projects |
| UE5 Macro Support | Native understanding of UPROPERTY, UFUNCTION, UCLASS, USTRUCT, UENUM |
| VA Navigation | Open File in Solution (Shift+Alt+O), Go To Related (Shift+Alt+G) |
| VA Refactoring | Rename, Extract Method, Change Signature, Move Implementation |
| VA Snippets | Code snippets for common patterns |
| VA Hashtags | Tag code with #hashtags in comments for easy navigation |
| VA Symbol Database | Separate, faster symbol database that replaces the built-in one |

If you use Visual Assist, you can disable built-in IntelliSense: **Tools > Options > Text Editor > C/C++ > Advanced > Disable IntelliSense = True**

---
