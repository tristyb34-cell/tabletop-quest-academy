# Module 03: Exercises

Three exercises that follow the "ask Claude, paste, compile, use" workflow. Each one gives you a new tool for Tabletop Quest.

---

## Exercise 1: Add the Dice Roller and Roll Dice in a Blueprint

**Goal**: Install the dice roller C++ plugin and use it in a Blueprint to display dice rolls on screen.

### Steps

1. If you have not already, convert your project to support C++ (Tools > New C++ Class > None > Create). This only needs to happen once.
2. Ask Claude (or use the code from the lesson) to generate the `DiceLibrary.h` and `DiceLibrary.cpp` files.
3. Place both files in your project's `Source/TabletopQuest/` folder.
4. In UE5, click **Compile** and confirm it succeeds.
5. Create a new Blueprint Actor called `BP_DiceTest`.
6. In the Event Graph, add a **BeginPlay** event.
7. From BeginPlay, add a **Roll D20** node (search for it; it should appear under the "Dice" category).
8. Connect the D20 result to a **Print String** node. Format the output as: "D20 Roll: [result]".
9. Add a second chain: Roll D6, print "D6 Roll: [result]".
10. Place `BP_DiceTest` in your level, press Play, and confirm both rolls print to screen.

### Success Criteria

- The project compiles without errors.
- Both dice roll results appear on screen when you press Play.
- The results are random (play multiple times and confirm they change).

### Stretch Goal

Create a "Roll All Dice" sequence that rolls d4, d6, d8, d10, d12, and d20 in order, printing each result. This simulates a classic DnD dice check.

---

## Exercise 2: Add the Stat Calculator and Display Attack Power

**Goal**: Install the stat calculator plugin and use it to display a character's attack power on screen.

### Steps

1. Ask Claude to generate `StatLibrary.h` and `StatLibrary.cpp` with a `CalculateAttackPower` function (takes Strength, WeaponDamage, and Level as integers, returns total attack power).
2. Paste both files into `Source/TabletopQuest/` and compile.
3. Create a new Blueprint Actor called `BP_StatDisplay`.
4. Add three **Integer** variables: `Strength` (default 14), `WeaponDamage` (default 8), `Level` (default 3).
5. On BeginPlay, call `CalculateAttackPower` with these variables as inputs.
6. Print the result: "Attack Power: [result]".
7. Also call a `RollD20` to simulate an attack roll. Print: "Attack Roll: [result]".
8. Print the total: "Total Damage: [attack power + attack roll]".
9. Place `BP_StatDisplay` in your level and test it.

### Success Criteria

- The stat calculator compiles and appears as a Blueprint node.
- Attack power is calculated correctly based on the formula.
- The attack roll adds randomness to the total damage.
- Changing the variable defaults (e.g., Strength to 18) changes the output.

### Stretch Goal

Add a `CalculateDefence` function to the stat library (takes Constitution and ArmourRating). Create a second Actor representing a goblin with its own stats. Print both the player's attack and the goblin's defence, then print whether the attack hits ("Hit!" if attack > defence, "Miss!" if not).

---

## Exercise 3: Ask Claude for a Custom Loot Plugin

**Goal**: Commission a custom C++ plugin from Claude and install it yourself. This tests the full workflow end-to-end.

### Steps

1. Ask Claude to write a Blueprint Function Library called `ULootLibrary` with a function called `GenerateRandomLoot` that returns a random loot item. The function should:
   - Pick a random item type (Weapon, Armour, Potion, Gold, Scroll)
   - Pick a random rarity (Common, Uncommon, Rare, Epic, Legendary) with weighted probabilities (Common most likely, Legendary least likely)
   - Return the item type and rarity as strings (or as a struct with both values)
2. Paste the files into Source/ and compile. If compilation fails, share the error with Claude and get a fix.
3. Create `BP_LootChest` (a Blueprint Actor with a mesh and a collision box).
4. On Begin Overlap, call `GenerateRandomLoot`.
5. Print the result: "You found a [Rarity] [ItemType]!" (e.g., "You found a Rare Weapon!").
6. Place three loot chests in your dungeon and test them.

### Success Criteria

- You successfully described a feature to Claude in plain English.
- Claude provided working .h and .cpp files.
- The code compiled (possibly after one round of error fixing).
- Loot chests produce random items with varying rarities.
- Legendary items appear less frequently than Common items.

### Stretch Goal

Ask Claude to extend the loot library with a `GenerateLootName` function that combines a prefix and a base name (e.g., "Flaming Sword," "Enchanted Shield," "Ancient Scroll"). Wire it into the loot chest so each item has a unique name.

---

## Reflection

After completing these exercises, consider:

- How does the "ask Claude, paste, compile, use" workflow compare to writing code yourself? What are the trade-offs?
- When would you choose to build something in Blueprints versus asking Claude for a C++ plugin?
- If a compile fails, what is the most efficient way to debug it? (Hint: copy the exact error message.)
