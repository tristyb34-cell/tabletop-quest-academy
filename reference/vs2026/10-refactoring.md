## Refactoring

Access refactoring tools via **Ctrl+.** (Quick Actions) or right-click > **Quick Actions and Refactorings**.

### Available Refactorings for C++

| Refactoring | Description |
|-------------|-------------|
| Rename | Rename a symbol and all its references across the solution (Ctrl+R, Ctrl+R or F2) |
| Extract Function | Select code and extract it into a new function |
| Extract to Header | Move an inline function definition to the header file |
| Move Definition Location | Move a function definition between header and source file |
| Create Declaration/Definition | Generate header declaration from implementation or vice versa |
| Change Signature | Add, remove, or reorder function parameters |
| Implement Pure Virtuals | Generate stub implementations for all pure virtual methods |
| Convert to Raw String Literal | Convert escaped strings to R"(...)" raw string format |
| Convert between string types | Convert between FString, std::string, and C-style strings |
| Add #include | Automatically add the missing header for an unresolved symbol |
| Sort #includes | Alphabetically sort include directives |
| Encapsulate Field | Generate getter/setter for a member variable |
| Inline Temporary Variable | Replace a temporary variable with its expression |

### Available Refactorings for C#

| Refactoring | Description |
|-------------|-------------|
| Rename | Rename symbol and all references |
| Extract Method | Extract selected code into a method |
| Extract Interface | Create an interface from a class's public members |
| Encapsulate Field | Convert a field to a property with getter/setter |
| Change Signature | Modify method parameters |
| Move Type to Matching File | Move a type to a file with the same name |
| Inline Method/Variable | Replace a method call or variable with its body/expression |
| Convert var to explicit type | Replace `var` with the actual type |
| Convert to interpolated string | Convert string.Format to $"..." |
| Convert to switch expression | Modernize switch statements to switch expressions |
| Introduce variable | Extract a sub-expression into a named variable |

---
