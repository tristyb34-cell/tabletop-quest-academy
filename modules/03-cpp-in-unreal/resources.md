# Module 03: Resources - Claude's C++ Plugins

A curated collection of documentation, tutorials, and references for working with C++ plugins in Unreal Engine 5.

---

## Official Epic Games Documentation

### UE5 Programming with C++
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine)
- **Why it matters**: The official C++ programming guide. Covers the class hierarchy, macros (UCLASS, UPROPERTY, UFUNCTION), and the build system. Bookmark this as your primary reference.

### Unreal Engine API Reference
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API)
- **Why it matters**: When Claude generates code that uses an engine class, look it up here to understand what it does. Search for any class name (like `UGameInstanceSubsystem` or `UPrimaryDataAsset`) to see its full API.

### Gameplay Framework Overview
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-framework-in-unreal-engine)
- **Why it matters**: Explains how GameMode, GameState, PlayerController, Pawn, and Character work together. Essential for understanding where your combat and ability systems fit in the engine's architecture.

### Plugins in UE5
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/plugins-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/plugins-in-unreal-engine)
- **Why it matters**: Official guide to creating, packaging, and distributing plugins. Covers the .uplugin descriptor format, module types, and loading phases.

### Programming Subsystems
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-subsystems-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-subsystems-in-unreal-engine)
- **Why it matters**: Explains all subsystem types (GameInstance, World, LocalPlayer, Engine, Editor). Covers when to use each type and how the engine manages their lifecycle. This is why we use UGameInstanceSubsystem for Tabletop Quest's core systems.

### UE5 Coding Standard
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine)
- **Why it matters**: When reviewing Claude's code, this standard explains the naming conventions. A prefix means Actor, U prefix means UObject, F prefix means struct or plain class, E prefix means enum, I prefix means interface. Understanding these prefixes helps you read Claude's code even without deep C++ knowledge.

### Scripting the Editor with Python
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python)
- **Why it matters**: The official guide to UE5's Python API. Covers the `unreal` module, asset manipulation, editor utilities, and automation. Essential for the Python automation workflow covered in this module.

---

## Community Tutorials

### Tom Looman's UE5 C++ Tutorials
- **URL**: [https://www.tomlooman.com/](https://www.tomlooman.com/)
- **Why it matters**: Tom Looman is one of the best UE5 C++ educators. His tutorials cover subsystems, gameplay framework patterns, and practical C++ architecture. His "Create Multiplayer Games with C++" course is particularly well-regarded.

### Ben UI's UE5 C++ Reference
- **URL**: [https://benui.ca/unreal/](https://benui.ca/unreal/)
- **Why it matters**: A well-organized reference for UPROPERTY specifiers, UFUNCTION specifiers, and common UE5 C++ patterns. Great for quickly looking up what a specific macro specifier does.

### The Unreal Engine Community Wiki
- **URL**: [https://unrealcommunity.wiki/](https://unrealcommunity.wiki/)
- **Why it matters**: Community-maintained wiki with practical how-to articles. Particularly useful for niche topics that the official docs do not cover in depth.

### Alex Forsythe's "The Unreal Engine Game Framework"
- **URL**: [https://www.youtube.com/watch?v=IaU2Hue-ApI](https://www.youtube.com/watch?v=IaU2Hue-ApI)
- **Why it matters**: An excellent video breakdown of how GameMode, GameState, PlayerController, and PlayerState work together. Useful for understanding where your combat manager subsystem fits in the bigger picture.

---

## UE5 Blueprint and C++ Interaction

### Exposing C++ to Blueprints (Official)
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/exposing-gameplay-elements-to-blueprints-visual-scripting-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/exposing-gameplay-elements-to-blueprints-visual-scripting-in-unreal-engine)
- **Why it matters**: Covers all the techniques for making C++ code accessible from Blueprints: BlueprintCallable functions, BlueprintReadWrite properties, BlueprintImplementableEvents, and delegates. This is the core pattern of the Claude workflow.

### Data Assets and Data-Driven Design
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/data-registries-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/data-registries-in-unreal-engine)
- **Why it matters**: Explains how to use Data Assets, Data Tables, and the Asset Manager for data-driven game design. Essential for managing the Tabletop Quest bestiary, loot tables, and ability definitions.

### Delegates and Events
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/delegates-and-lamba-functions-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/delegates-and-lamba-functions-in-unreal-engine)
- **Why it matters**: Detailed reference for all delegate types in UE5 (Dynamic, Multicast, Delegate). Covers declaration, binding, broadcasting, and Blueprint integration. You need this for the event-driven patterns used in combat mode switching.

---

## Build System and Compilation

### Unreal Build Tool Documentation
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-build-tool-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-build-tool-in-unreal-engine)
- **Why it matters**: When you get build errors, understanding the build system helps you diagnose the problem. Covers module dependencies, Build.cs configuration, and the compilation pipeline.

### Live Coding in UE5
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-in-unreal-engine)
- **Why it matters**: Guide to using Ctrl+Alt+F11 for iterating on C++ without restarting the editor. Explains its limitations (does not handle header changes well) and when to fall back to a full restart.

---

## Claude-Specific Resources

### Writing Effective Prompts for Code Generation
- **Tip**: Be specific about class names, base classes, function signatures, and UE5 macro specifiers. Include game-specific context (DnD formulas, Tabletop Quest rules) so Claude generates code that fits your game.

### Iterating on Generated Code
- **Tip**: When Claude's code does not compile, copy the full error message and paste it back to Claude. Include the line number and the surrounding code. Claude can usually fix compilation errors in one round.

### Reviewing Generated Code Checklist
Before pasting Claude's code:
1. Does every class have `GENERATED_BODY()`?
2. Does every Blueprint-facing function have `UFUNCTION(BlueprintCallable)`?
3. Does every Blueprint-facing property have `UPROPERTY()` with appropriate specifiers?
4. Does the `.h` file include all necessary headers?
5. Does the `Build.cs` list all required module dependencies?
6. Does the `_API` macro match the module name?

---

## Recommended Learning Path

1. Read the **Gameplay Framework Overview** to understand where your systems fit
2. Skim the **UE5 Coding Standard** to recognize naming conventions
3. Build the exercises in this module (dice roller, stat calculator, Data Assets)
4. Reference the **API docs** and **Ben UI's specifier guide** whenever you encounter unfamiliar macros
5. Watch Alex Forsythe's video for a deeper understanding of the game framework
6. Move on to Module 04 where you build the combat system using everything from this module
