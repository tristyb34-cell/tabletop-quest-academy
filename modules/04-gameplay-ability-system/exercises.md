# Module 04: Exercises

Three exercises that build your combat system piece by piece. Complete them in order.

---

## Exercise 1: Set Up the Combat Grid

**Goal**: Generate a battle grid using a Python script and verify it works in the editor.

### Steps

1. Ask Claude to write a Python script that creates a 10x10 combat grid in your UE5 level. Specifications:
   - Each tile is 100x100 units (a scaled Plane mesh).
   - Tiles alternate between two materials for a checkerboard pattern (use basic materials or starter content materials if you do not have stone tile assets yet).
   - Each tile is labelled `Tile_X_Y` (e.g., `Tile_3_7`) in the World Outliner.
2. Open the Python console in UE5 (Output Log > switch to Python).
3. Paste and run the script.
4. Fly around the grid in the viewport. Verify it is a flat 10x10 surface with labelled tiles.
5. Place a character mesh (from your asset pack) on tile (0, 0) and another on tile (9, 9). These will be your hero and goblin positions.

### Success Criteria

- A 10x10 grid of flat tiles exists in your level.
- Tiles are labelled correctly in the World Outliner.
- Two character meshes are placed on opposite corners.
- You can see the grid clearly from a top-down viewport angle (Alt+J for the top view).

### Stretch Goal

Modify the script to accept grid size as a parameter. Generate a 12x8 grid (rectangular, like a dungeon corridor) and a 6x6 grid (a small room encounter).

---

## Exercise 2: Wire Up the Turn System

**Goal**: Build the combat manager Blueprint that rolls initiative and cycles through turns.

### Steps

1. Create `BP_CombatManager` (Blueprint Actor, no visible mesh).
2. Create `BP_CombatCharacter` (Blueprint Actor) with these variables:
   - `CharacterName` (String)
   - `HP` (Integer)
   - `AC` (Integer)
   - `AttackModifier` (Integer)
   - `DexterityModifier` (Integer, used for initiative)
3. In `BP_CombatManager`, add an array variable `Combatants` of type BP_CombatCharacter reference.
4. Create a function `RollAllInitiative`:
   - For Each loop through `Combatants`.
   - For each combatant, call `RollD20` + their `DexterityModifier`.
   - Print each result: "[Name] rolls initiative: [roll] + [mod] = [total]".
   - Sort the array by initiative total (highest first). You can use a simple bubble sort in Blueprint, or ask Claude for a C++ sort helper.
5. Create a function `NextTurn`:
   - Increment `CurrentTurnIndex`.
   - If it exceeds the array length, reset to 0.
   - Print "It is [Name]'s turn!".
6. Place two instances of `BP_CombatCharacter` in the level. Set one to "Hero" (Dex mod +3) and one to "Goblin" (Dex mod +1).
7. In the combat manager, populate the `Combatants` array with both characters (use Instance Editable references).
8. On BeginPlay, call `RollAllInitiative`, then call `NextTurn`.
9. Add a keyboard input (press Space) to call `NextTurn` each time, cycling through turns.

### Success Criteria

- On Play, initiative rolls are printed for both characters.
- The character with the higher initiative goes first.
- Pressing Space advances to the next turn, cycling between Hero and Goblin.
- The turn cycle wraps around correctly (Hero > Goblin > Hero > Goblin...).

### Stretch Goal

Add a third combatant (a second goblin or an ally NPC). Verify that initiative sorting and turn cycling works correctly with three characters.

---

## Exercise 3: Add a Second Enemy (1v2 Combat)

**Goal**: Extend the combat system to handle a 1v2 encounter with real attack resolution.

### Steps

1. First, add the attack function to `BP_CombatCharacter`:
   - Create `AttackTarget` (takes a target BP_CombatCharacter reference).
   - Roll D20 + `AttackModifier`. Compare to target's `AC`.
   - If hit: Roll D8 (or the attacker's damage die) + Strength modifier. Subtract from target HP. Print the full combat log.
   - If miss: Print miss message.
   - After damage, check if target HP <= 0. If so, print "[Name] is defeated!".
2. Add a second goblin to the level. Set it up as a `BP_CombatCharacter` with:
   - Name: "Goblin Scout"
   - HP: 10, AC: 11, AttackModifier: +2, DexterityModifier: +3
3. Add all three combatants to the combat manager's array.
4. On the player's turn, use keyboard inputs to choose an action:
   - Press **1** to attack Goblin 1.
   - Press **2** to attack Goblin 2.
   - Press **3** to defend.
5. On each goblin's turn, have them automatically attack the hero (simple AI).
6. After each round, print the HP status of all combatants.
7. The fight ends when either all goblins are defeated or the hero's HP hits 0.

### Success Criteria

- Three combatants participate in the fight with correct initiative order.
- The player can choose which goblin to attack.
- Goblins automatically attack the hero on their turns.
- Damage is calculated using dice rolls (D20 for hit, damage die for damage).
- The fight ends correctly when one side is eliminated.
- The combat log tells a clear story of what happened each turn.

### Stretch Goal

Add the Defend action: when the hero defends, their AC increases by 2 until their next turn. Make one of the goblins occasionally defend instead of always attacking (random 20% chance to defend).

---

## Reflection

After completing these exercises, you have a working turn-based combat system. Think about:

- How does the initiative system create tension and unpredictability?
- What would need to change to support 4v4 party combat?
- How would you add special abilities (a fireball that hits all enemies, a heal that restores HP)?
- Where in this system would character classes (Fighter, Wizard, Rogue) plug in?
