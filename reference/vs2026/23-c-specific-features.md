## C++ Specific Features

### MSVC Compiler (v14.50, Toolset v145)

VS 2026 ships with MSVC v14.50. The platform toolset is v145.

### C++ Language Standard

**Project Properties > Configuration Properties > General > C++ Language Standard**

| Standard | Setting Value | Notes |
|----------|--------------|-------|
| C++14 | /std:c++14 | Widely supported, older projects |
| C++17 | /std:c++17 | Good balance of modern features |
| C++20 | /std:c++20 | Default for new projects in VS 2026 |
| C++23 | /std:c++23 | Latest supported standard |
| C++ Latest | /std:c++latest | Bleeding edge, includes partial C++26 |

### C++20 Features (Now Default)

| Feature | Description |
|---------|-------------|
| Modules | `import std;` instead of `#include` headers. Faster compilation, better isolation |
| Concepts | `template<typename T> requires Sortable<T>` for constrained templates |
| Coroutines | `co_await`, `co_yield`, `co_return` for async and generator patterns |
| Ranges | `std::views::filter`, `std::views::transform` for composable algorithms |
| Three-Way Comparison | `<=>` spaceship operator for automatic comparison operators |
| Designated Initializers | `Point{.x = 1, .y = 2}` for named field initialization |
| `consteval` | Guaranteed compile-time evaluation |
| `constinit` | Guaranteed constant initialization |
| `std::format` | Type-safe string formatting: `std::format("x={}, y={}", x, y)` |
| `std::span` | Non-owning view of contiguous memory |
| `std::jthread` | Automatically-joining thread with stop token |
| Calendar/Timezone | `std::chrono` extensions for dates and timezones |

### C++23 Features

| Feature | Description |
|---------|-------------|
| `#warning` directive | Generate diagnostic messages without stopping compilation (new in VS 2026) |
| `auto(x)` decay-copy | Explicit decay-copy casting (new in VS 2026) |
| `std::expected` | Error handling without exceptions |
| `std::generator` | Coroutine-based generator |
| `std::print` / `std::println` | Direct printing to stdout |
| `std::flat_map` / `std::flat_set` | Sorted associative containers backed by contiguous storage |
| Deducing this | Explicit object parameters |
| `if consteval` | Compile-time branch for constant evaluation |
| `std::stacktrace` | Programmatic stack traces |
| Multidimensional subscript operator | `array[x, y, z]` syntax |
| `std::mdspan` | Multidimensional span |

### Performance Improvements (New in VS 2026)

The MSVC optimizer in VS 2026 delivers measurable improvements:
- Up to 6% faster execution on Unreal Engine RenderThread
- Up to 3% faster on GameThread
- Optimized random number generation
- Faster sorting algorithms
- Vectorized implementations across multiple standard library components

### AddressSanitizer

**Project Properties > Configuration Properties > C/C++ > General > Enable Address Sanitizer**

Catches at runtime:
- Buffer overflows (stack and heap)
- Use-after-free
- Use-after-scope
- Double-free
- Memory leaks (with leak sanitizer)

New in VS 2026: AddressSanitizer extended to ARM64 targets (preview).

### C++ Modules Support

```cpp
// my_module.ixx (module interface file)
export module my_module;

export int add(int a, int b) {
    return a + b;
}

// main.cpp
import my_module;

int main() {
    return add(1, 2);
}
```

VS 2026 has improved modules support, but UE5.7 does not currently use C++ modules. The engine still uses traditional header-based compilation.

### Preprocess to File

Right-click any .cpp file in Solution Explorer > **Preprocess to file**

Generates the fully preprocessed output, expanding all macros. Essential for debugging UE5 macros:
- GENERATED_BODY()
- UPROPERTY()
- UFUNCTION()
- UCLASS()
- USTRUCT()
- UENUM()
- DECLARE_DYNAMIC_MULTICAST_DELEGATE()

### C++ Code Editing Tools for Agent Mode (New in VS 2026)

**Path: Tools > Options > GitHub > Copilot > Enable C++ tools to be used by Copilot**

Enables Copilot to navigate your C++ codebase with full symbol awareness:
- Find all symbol references
- Access metadata (type info, declarations, scope)
- Map class inheritance hierarchies
- Follow function call chains

---
