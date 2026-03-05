## Performance and Memory Tools

### Performance Profiler (Alt+F2)

Launch from **Debug > Performance Profiler** or Alt+F2. Available tools:

| Tool | Description | Supported Projects |
|------|-------------|-------------------|
| CPU Usage | Sample-based CPU profiler showing per-function time breakdown | All |
| Memory Usage | Track heap allocations, object lifetimes, and memory leaks | All |
| GPU Usage | Analyze Direct3D 10/11/12 GPU and CPU frame timing | DirectX apps |
| .NET Object Allocation Tracking | Track every .NET object allocation and GC event | .NET |
| .NET Async | Analyze async/await patterns and task scheduling | .NET |
| .NET Counters | Monitor CLR performance counters | .NET |
| Events Viewer | View ETW events during profiling | All |
| File I/O | Monitor file read/write operations | All |
| Database | Track database query timing | ADO.NET, EF |
| Concurrency Visualizer | Thread scheduling and synchronization analysis | Native C++ |
| Instrumentation | Exact function timing with call counts | .NET, C++ |

### Diagnostic Tools During Debugging (Ctrl+Alt+F2)

Active during F5 debugging:
- **CPU Usage graph**: Real-time CPU utilization
- **Memory Usage**: Heap snapshots (take snapshots, compare snapshots, analyze growth)
- **Events timeline**: Breakpoints, output messages, exceptions, IntelliTrace events

### CPU Profiler Details

The CPU Usage tool shows:
- **Hot path**: The most expensive call chain
- **Function list**: All functions sorted by CPU time
- **Caller/Callee view**: Who called this function, and what it called
- **Call tree**: Full hierarchical call tree with inclusive/exclusive times
- **Source view**: Annotated source code showing per-line timing
- **Modules view**: CPU time grouped by DLL/module

### Memory Profiler Details

For C++ projects:
- Take heap snapshots at different points during execution
- Compare snapshots to find allocations that were not freed (potential leaks)
- View allocation call stacks to find where memory was allocated
- Filter by allocation size, type, or module

### GPU Usage Details

For DirectX applications:
- Frame timing (GPU time vs. CPU time per frame)
- Identify whether your game is CPU-bound or GPU-bound
- Per-draw-call timing
- GPU queue utilization

### Copilot Profiler Agent (New in VS 2026)

Use `@profiler` in Copilot Chat:
- AI analyzes CPU, memory, and allocation data
- Identifies bottlenecks and explains the root cause
- Suggests optimizations
- Generates BenchmarkDotNet benchmarks
- Validates improvements in a guided loop
- Can discover and run unit tests for measurement
- Supports C++ scenarios with a unit-test-first approach

---
