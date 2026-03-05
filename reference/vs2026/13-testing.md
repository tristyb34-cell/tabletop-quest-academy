## Testing

### Test Explorer (Ctrl+E, T)

The central hub for all testing in Visual Studio.

| Feature | Description |
|---------|-------------|
| Discover tests | Automatically finds tests from all supported frameworks |
| Group by | Project, class, namespace, outcome, duration, traits |
| Filter | Search by name, trait, or outcome |
| Run selected | Ctrl+R, T runs tests at current scope |
| Run all | Ctrl+R, A runs all tests |
| Debug tests | Ctrl+R, Ctrl+T debugs tests at current scope |
| Playlist | Create subsets of tests to run together |
| Real-time discovery | Tests update as you type (Live Unit Testing, Enterprise only) |

### Supported Test Frameworks

| Framework | Language | Notes |
|-----------|----------|-------|
| MSTest | C#, VB | Microsoft's built-in test framework |
| NUnit | C#, VB | Popular open-source .NET framework |
| xUnit | C#, VB | Modern .NET test framework |
| Google Test | C++ | Industry-standard C++ testing framework |
| CTest | C++ | CMake's testing interface |
| Boost.Test | C++ | Part of the Boost C++ libraries |
| Catch2 | C++ | Header-only C++ test framework |

### Code Coverage (New in VS 2026 Community/Professional)

Previously Enterprise-only, code coverage is now available in all editions.

**Test > Analyze Code Coverage for All Tests** or right-click in Test Explorer:

| Feature | Description |
|---------|-------------|
| Coverage Results window | Shows coverage percentage per assembly, class, and method |
| Editor highlighting | Colors tested lines in the editor |
| Export results | Save coverage data for CI/CD integration |

### Live Unit Testing (Enterprise Only)

**Test > Live Unit Testing > Start**

Continuously runs tests in the background as you type:
- Green check: line is covered by passing tests
- Red X: line is covered by failing tests
- Blue dash: line is not covered by any test

### AI-Assisted Test Generation (New in VS 2026)

Use `@Test` in Copilot Chat to generate unit tests:
- Supports C# with xUnit, NUnit, and MSTest
- Generates test stubs based on method signatures and behavior
- Suggests edge cases and boundary conditions
- Debugs and refines failing tests

---
