# Module 03: Quiz

Test your understanding of the C++ plugin workflow. These questions focus on the process, not C++ syntax.

---

### Question 1 (Multiple Choice)

When Claude gives you C++ code for a UE5 plugin, what two file types do you receive?

A) A .py file and a .json file
B) A .h file and a .cpp file
C) A .uasset file and a .umap file
D) A .blueprint file and a .config file

---

### Question 2 (Short Answer)

You hit Compile in UE5 and see red error messages in the Output Log. What is the most efficient way to fix the problem?

---

### Question 3 (Multiple Choice)

After you compile a C++ Blueprint Function Library, how do you use its functions?

A) You call them from the Python console
B) They appear as nodes in the Blueprint Event Graph that you can search for and wire up
C) You must write more C++ code to call them
D) They only work in the Level Blueprint

---

### Question 4 (Short Answer)

Why would you use a C++ plugin for a dice roller instead of building the same logic directly in Blueprints? (Hint: think about the type of tasks C++ handles well.)

---

### Question 5 (Multiple Choice)

What does the `UFUNCTION(BlueprintCallable)` tag in a C++ header file do?

A) It makes the function run automatically when the game starts
B) It tells UE5 to expose this function as a node in the Blueprint editor
C) It compiles the function into JavaScript
D) It restricts the function to only work in C++ code

---

## Answer Key

**Question 1**: B) A .h file and a .cpp file. C++ in Unreal always comes in pairs: the header (.h) declares what the code does (like a table of contents), and the source (.cpp) contains the actual logic.

**Question 2**: Copy the entire error message from the Output Log and paste it to Claude. Claude will identify the issue (typo, missing include, name mismatch) and provide corrected code. You paste the fix and compile again. Most issues are resolved in one or two rounds.

**Question 3**: B) They appear as nodes in the Blueprint Event Graph. Once compiled, functions marked as `BlueprintCallable` show up in the right-click search menu. You drag them onto the canvas and wire them up like any other Blueprint node.

**Question 4**: For a dice roller specifically, either approach works fine. But C++ plugins are better for performance-heavy calculations (running combat math for dozens of characters), code reuse across multiple projects, and accessing engine features that Blueprints cannot reach. The dice roller is a simple starting example; the real value comes when you build more complex systems like stat calculations, AI decision-making, or procedural generation.

**Question 5**: B) It tells UE5 to expose this function as a node in the Blueprint editor. Without this tag, the function would exist only in C++ code and would be invisible to Blueprints. The tag is what bridges the gap between C++ and the visual scripting system.
