# Module 03: Resources

---

## Adding C++ to a Blueprint Project

### How to Add C++ Classes to a Blueprint Project
- In UE5: **Tools > New C++ Class**. Choose any parent class (or None) and click Create.
- This generates the `Source/` folder, `.Build.cs` file, and project build files.
- You only need to do this once. After that, you can add .h and .cpp files directly to the Source/ folder.

### Project Folder Structure
After adding C++, your project folder looks like this:
```
TabletopQuest/
  Content/          (assets, Blueprints, meshes, etc.)
  Source/
    TabletopQuest/  (your .h and .cpp files go here)
      TabletopQuest.Build.cs
      DiceLibrary.h
      DiceLibrary.cpp
  Binaries/         (compiled code, auto-generated)
  Intermediate/     (build cache, auto-generated)
```

---

## Compile Troubleshooting

### Common Errors and Fixes

**"Cannot open include file"**: The file name in the `#include` statement does not match the actual file name. Check capitalisation and spelling.

**"Unresolved external symbol"**: A function is declared in the .h file but not defined in the .cpp file, or the function signature does not match between the two files. Ask Claude to check both files.

**"TABLETOPQUEST_API: undeclared identifier"**: The module name (the all-caps part) does not match your project name. Check the `Source/TabletopQuest/TabletopQuest.Build.cs` file for the correct module name.

**Editor crashes on compile**: Close UE5. Delete the `Binaries/`, `Intermediate/`, and `Saved/` folders. Reopen the project. This forces a clean rebuild.

**"Hot Reload" warnings**: UE5's hot reload (compiling while the editor is open) can sometimes cause instability. If things get weird, close the editor, compile from your IDE (Visual Studio or Rider), then reopen UE5.

### Nuclear Option
If nothing works: delete Binaries/, Intermediate/, and Saved/, then right-click the .uproject file and select "Generate Visual Studio Project Files." Open in Visual Studio and build from there. Then open UE5.

---

## Blueprint Function Library Pattern

This is the pattern you will use most often for Claude's C++ plugins:

- **Blueprint Function Library**: A class with static functions that appear as nodes in any Blueprint. No need to spawn or reference an Actor.
- **Key macro**: `UFUNCTION(BlueprintCallable, Category = "YourCategory")` makes functions visible in Blueprints.
- **Static functions**: All functions in a Blueprint Function Library are static, meaning they do not belong to any specific Actor. You can call them from anywhere.

### Official Docs: Blueprint Function Libraries
- **URL**: [https://docs.unrealengine.com/5.4/en-US/blueprint-function-libraries-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/blueprint-function-libraries-in-unreal-engine/)

---

## IDE Setup (Optional, for Browsing Code)

You do not need an IDE to paste files and compile. But if you want to browse or edit C++ files with syntax highlighting:

### Visual Studio Community 2022 (Free, Windows)
- Download from [https://visualstudio.microsoft.com/](https://visualstudio.microsoft.com/)
- During install, select the "Game development with C++" workload.
- UE5 integrates with Visual Studio automatically.

### Rider (Paid, Cross-Platform)
- Download from [https://www.jetbrains.com/rider/](https://www.jetbrains.com/rider/)
- Excellent UE5 support with fast indexing and smart navigation.

### VS Code (Free, Cross-Platform)
- Works with the C/C++ extension for basic syntax highlighting.
- Not as deeply integrated with UE5 as Visual Studio or Rider, but fine for reading and pasting code.

---

## YouTube References

### Alex Forsythe: "The Unreal Engine Game Framework"
- **URL**: [https://www.youtube.com/@AlexForsythe](https://www.youtube.com/@AlexForsythe)
- Clear explanations of how C++ and Blueprints interact in UE5. Good for understanding the architecture without getting lost in code.

### Tom Looman: C++ and Blueprint Integration
- **URL**: [https://www.tomlooman.com/](https://www.tomlooman.com/)
- Written tutorials on creating C++ classes that work seamlessly with Blueprints. Practical and well-explained.
