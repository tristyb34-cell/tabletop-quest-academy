# Debugging in Unreal Engine 5

Your survival guide for when things break. And they will break. Often.

---

## The Golden Rule

**Read the Output Log first.** Always. Before you Google, before you ask Claude, before you panic. The answer is usually right there.

Window > Developer Tools > Output Log (or the tab at the bottom of the editor).

---

## Tier 1: Quick Checks (90% of Problems)

These solve most issues and take seconds.

### Print String / UE_LOG

The fastest debugging tool in existence. "Is this code even running? What value is this variable?"

**Blueprint:**
- Drag off any pin > `Print String`
- Set the text to whatever you want to check
- Color-code them (red for errors, green for success) so you can tell them apart

**C++:**
```cpp
UE_LOG(LogTemp, Warning, TEXT("Health = %f, Damage = %f"), Health, Damage);
UE_LOG(LogTemp, Error, TEXT("Enemy pointer is NULL!"));

// On-screen version (visible during play)
GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow,
    FString::Printf(TEXT("State: %s"), *StateString));
```

### The Output Log

This is your black box flight recorder. It shows:
- Every `UE_LOG` and `Print String` call
- Crash callstacks
- Asset loading errors
- Blueprint compilation errors
- Network replication warnings

**Filter it:** Type in the search bar to filter. Use the dropdown to show only Warnings or Errors.

**Copy the error message.** When asking for help, copy the EXACT error text. Don't paraphrase it.

### Compile Errors (Blueprints)

If a Blueprint won't compile:
1. The node with the error has a red border
2. Hover over it to see the error message
3. Most common cause: a wire is disconnected or the wrong type
4. Right-click > "Refresh All Nodes" fixes stale references

### Compile Errors (C++)

Visual Studio's Error List panel shows all errors. Double-click an error to jump to the line.

Common ones:
- `undeclared identifier` = you forgot to include a header or misspelled a name
- `cannot convert` = wrong type, you probably need a Cast
- `unresolved external symbol` = you declared a function in .h but didn't implement it in .cpp, or missing a module in your .Build.cs

---

## Tier 2: Visual Debugging (Spatial Problems)

When the issue is about positions, distances, collisions, or AI behavior.

### Draw Debug Helpers

```cpp
// Draw a line (great for line traces, aim direction)
DrawDebugLine(GetWorld(), Start, End, FColor::Red, false, 5.0f, 0, 2.0f);

// Draw a sphere (positions, ranges, AoE radius)
DrawDebugSphere(GetWorld(), Location, Radius, 12, FColor::Green, false, 5.0f);

// Draw a box (collision bounds, trigger volumes)
DrawDebugBox(GetWorld(), Center, Extent, FColor::Blue, false, 5.0f);

// Draw a string in 3D space
DrawDebugString(GetWorld(), Location, TEXT("Spawn Point"), nullptr, FColor::White, 5.0f);
```

**Blueprint:** Search for "Draw Debug" in the node menu. Same functions, same parameters.

### Show Collision

In the viewport: Show > Collision. This reveals all collision shapes. Extremely useful when projectiles pass through walls or triggers don't fire.

### Show Navigation

In the viewport: Show > Navigation. This shows the NavMesh (green = walkable). If AI can't path somewhere, the NavMesh is probably missing there.

### Stat Commands

Type these in the console (press backtick ` during play):

| Command | Shows |
|---|---|
| `stat fps` | Frames per second |
| `stat unit` | Frame time breakdown (game, render, GPU) |
| `stat memory` | Memory usage |
| `stat collision` | Collision query counts |
| `stat ai` | AI performance |
| `stat game` | Gameplay thread timing |

---

## Tier 3: Blueprint Debugger (Logic Problems)

When you need to step through execution like a "normal" debugger.

### Breakpoints

1. Click on a Blueprint node's top-left corner. A red circle appears (breakpoint).
2. Play the game. Execution pauses when it hits that node.
3. You can now see every variable's current value by hovering over wires.
4. Use the toolbar: Continue, Step Over, Step Into, Step Out.

### Watch Values

While paused at a breakpoint:
- Hover over any wire to see its current value
- The "Blueprint Debugger" tab shows the call stack
- You can see which object triggered the code

### Selecting the Debug Target

Top of the Blueprint editor, there's a debug dropdown. If you have multiple instances of the same Blueprint (e.g., 5 enemies), select which one to debug.

---

## Tier 4: C++ Debugger (Visual Studio)

For C++ code, Visual Studio's debugger is powerful.

### Attaching

1. In UE5 editor, press Play
2. In Visual Studio: Debug > Attach to Process > find `UnrealEditor.exe`
3. Or: just press F5 in Visual Studio to launch the editor with debugging attached (slower startup but catches everything)

### Breakpoints

- Click in the left margin of any .cpp line to set a breakpoint
- When hit, execution pauses
- Hover over variables to see values
- Use the Watch window to track specific variables
- Use the Locals window to see everything in scope
- Call Stack window shows how you got here

### Conditional Breakpoints

Right-click a breakpoint > Conditions. Example: `Health < 0` only breaks when health goes negative. Saves you from breaking on every single hit.

### Common C++ Crash Patterns

| Crash | Likely Cause | Fix |
|---|---|---|
| Access violation at 0x000000 | Null pointer. You're calling a function on something that doesn't exist. | Add a null check: `if (Ptr) { Ptr->DoThing(); }` |
| Pure virtual function call | Calling a function on an object that's being destroyed | Check `IsValid(Actor)` or `!IsPendingKill()` |
| Stack overflow | Infinite recursion. Function A calls B calls A | Check your logic for loops |
| Assertion failed | A `check()` or `ensure()` failed | Read the assertion message, it tells you what went wrong |

---

## Tier 5: Specific Systems

### GAS Debugging

GAS has its own debugging tools because it's complex:

```
showdebug abilitysystem
```

Type this in the console during play. Shows on-screen:
- Active abilities
- Active gameplay effects (buffs, debuffs)
- All gameplay tags on the character
- Attribute values

Also useful: `AbilitySystemComponent->PrintDebug()` in C++.

### AI Debugging

```
showdebug ai
```

Shows the current Behavior Tree execution, Blackboard values, and active task for the selected AI.

Also:
- In the editor, open the Behavior Tree and press Play. It live-highlights which nodes are executing.
- The Blackboard values update in real time.
- Red nodes = failed, green = succeeded, yellow = running.

### Physics Debugging

```
show collision
p.VisualizeWorldQueries 1
```

The second command shows all physics queries (line traces, overlaps) visually. Essential when attacks aren't connecting.

### Networking (Prep for Multiplayer)

```
net.ListenPort
net.AllowEncryption
stat net
```

But for now, just make sure all game logic runs through the GameMode. If you do that, multiplayer conversion is manageable later.

---

## The Debugging Process (When You're Stuck)

Follow this every time. Don't skip steps.

1. **Read the error.** Actually read it. The full message, not just the first line.
2. **Reproduce it.** Can you make it happen again? What exact steps trigger it?
3. **Isolate it.** Comment out code until the error stops. The last thing you commented out is the problem.
4. **Print everything.** Add Print Strings before and after the suspicious code. Which ones fire? Which don't?
5. **Check your assumptions.** That pointer you think is valid? Print it. That value you think is 100? Print it. The function you think is being called? Print inside it.
6. **Check the obvious.** Did you compile? Did you save the Blueprint? Is the right version of the Blueprint in the level? Did you hit Play and not just Simulate?

### When Asking Claude for Help

Give me:
1. The **exact** error message (copy paste from Output Log)
2. What you **expected** to happen
3. What **actually** happened
4. The relevant code (screenshot the Blueprint graph or paste the C++)
5. What you already tried

The more specific you are, the faster we solve it.

---

## Console Commands Quick Reference

Press backtick (`) during play to open the console.

| Command | What It Does |
|---|---|
| `stat fps` | Show FPS |
| `stat unit` | Frame time breakdown |
| `stat memory` | Memory usage |
| `showdebug abilitysystem` | GAS debug overlay |
| `showdebug ai` | AI debug overlay |
| `show collision` | Show collision shapes |
| `show navigation` | Show NavMesh |
| `slomo 0.5` | Half-speed gameplay (great for watching combat) |
| `slomo 1` | Normal speed |
| `pause` | Pause the game |
| `ce [EventName]` | Trigger a custom event |
| `log LogTemp Verbose` | Set log verbosity |
| `obj list class=AEnemy` | List all instances of a class |
| `displayall AEnemy Health` | Show Health variable on all enemies |

---

## Crash Recovery

UE5 crashes. It just does. Protect yourself:

1. **Auto-save:** Edit > Editor Preferences > Loading & Saving > Auto Save interval (set to 5 minutes)
2. **Source control:** Commit often. "It works" is a great time to commit.
3. **Crash logs:** `[Project]/Saved/Logs/` has the full log from the last session. The crash callstack is at the bottom.
4. **Backup maps:** Before big changes, File > Save Current Level As > give it a name like `Dungeon_v2`. If you break it, the old version is right there.
