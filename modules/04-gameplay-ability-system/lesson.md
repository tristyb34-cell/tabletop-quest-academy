# Module 04: Building the Combat System

## Time to Fight

You have a dungeon room. You have doors, chests, and torches. You have dice and stat calculators. Now comes the part that makes it a game: combat.

In this module, you build a turn-based combat system from scratch. Not Unreal's complex Gameplay Ability System (GAS). Not a framework you need a PhD to configure. Just a clean, DnD-style combat system built with Blueprints and the C++ plugins from Module 03.

Think of it like setting up a tabletop encounter. You have a grid (the battle map), miniatures (the combatants), initiative order (who goes first), and actions (move, attack, defend). We are building exactly that, except the computer handles the dice rolls and rule enforcement.

---

## The Combat Grid (Your Battle Map)

In tabletop DnD, combat happens on a grid. Each square is usually 5 feet. Characters move a certain number of squares per turn. We are recreating this digitally.

A combat grid is just a flat surface divided into tiles. Think of a chess board. Each tile has a row and column coordinate (like A3, B7, or in our case, X and Y integers). Characters occupy tiles. Movement means changing which tile you are on.

### Setting Up the Grid with Python

Rather than placing tiles by hand (tedious), you use a Python script to generate the grid automatically. Here is the concept:

```python
import unreal

editor = unreal.EditorLevelLibrary
tile_size = 100  # 100 units per tile
grid_width = 10
grid_height = 10

for x in range(grid_width):
    for y in range(grid_height):
        pos = unreal.Vector(x * tile_size, y * tile_size, 0)
        tile = editor.spawn_actor_from_class(
            unreal.StaticMeshActor, pos
        )
        tile.set_actor_label(f"Tile_{x}_{y}")
        tile.static_mesh_component.set_static_mesh(
            unreal.load_asset("/Engine/BasicShapes/Plane")
        )
        tile.set_actor_scale3d(unreal.Vector(1, 1, 1))

        # Alternate colours for a checkerboard look
        # (Material assignment would go here)

print(f"Created {grid_width * grid_height} tile grid!")
```

Ask Claude to write the full version with alternating materials (dark and light stone tiles from your asset pack). Paste it into the Python console. A 10x10 battle grid appears in your level.

---

## Initiative: Who Goes First

In DnD, every combatant rolls initiative at the start of a fight. The highest roll goes first. This creates the turn order.

### How to Build It

1. Create a **Blueprint Actor** called `BP_CombatManager`. This is the brain of the combat system. It does not have a visible mesh; it just manages the logic.
2. Add an **Array** variable called `Combatants` (type: Actor Reference). This holds every character and enemy in the fight.
3. Create a function called `RollInitiative`:
   - For each Actor in the Combatants array, call `RollD20` (from your dice plugin) and add a modifier (like the character's Dexterity bonus).
   - Store each Actor alongside their initiative roll.
   - Sort from highest to lowest. The sorted list is the turn order.
4. Add an **Integer** variable called `CurrentTurnIndex` (starts at 0). This tracks whose turn it is.
5. Create a function called `NextTurn` that increments `CurrentTurnIndex` (wrapping back to 0 when it reaches the end of the array) and announces whose turn it is.

The result: at the start of combat, everyone rolls initiative. The combat manager cycles through the turn order, one by one.

---

## Actions: What You Can Do On Your Turn

In DnD, you typically get one action, one bonus action, and movement on your turn. Let's keep it simple for now with three core actions:

### Move
The character moves to a different tile on the grid. They have a movement range (say, 5 tiles). You click a tile within range, and the character walks there.

For now, implement movement as: on your turn, click a grid tile. If it is within range, teleport the character there (smooth movement animation can come later). Mark the moved-to tile as occupied.

### Attack
The character attacks an enemy within range. Here is where your C++ plugins shine:

1. **Hit check**: Roll D20 + attacker's attack modifier. If the total meets or exceeds the target's Armour Class (AC), the attack hits.
2. **Damage roll**: If it hits, roll the weapon's damage die (e.g., D8 for a longsword) + Strength modifier.
3. **Apply damage**: Subtract the damage from the target's HP.

This is pure DnD combat. And because the dice roller and stat calculator are Blueprint nodes, you just wire them together in the Event Graph.

### Defend
The character takes a defensive stance, gaining a temporary bonus to AC until their next turn. Simple to implement: add +2 to AC, store a Boolean `IsDefending`, and remove the bonus when their next turn starts.

---

## Building the 1v1 Encounter

Let's make this concrete. You are going to build a fight between the player and a goblin.

### Step 1: Create the Characters

Create `BP_CombatCharacter` (Blueprint Actor) with these variables:
- `CharacterName` (String): "Hero" or "Goblin"
- `HP` (Integer): 30 for the hero, 15 for the goblin
- `MaxHP` (Integer): Same as HP
- `AC` (Integer): 14 for the hero, 12 for the goblin
- `AttackModifier` (Integer): +5 for the hero, +3 for the goblin
- `DamageDie` (Integer): 8 for the hero (d8 longsword), 6 for the goblin (d6 scimitar)
- `Strength` (Integer): 16 for the hero, 12 for the goblin
- `MovementRange` (Integer): 5 tiles
- `IsDefending` (Boolean): false
- `GridX` and `GridY` (Integer): Current position on the grid

### Step 2: Wire Up the Attack

Create a function called `AttackTarget` in BP_CombatCharacter:

1. Call `RollD20`. Add the attacker's `AttackModifier`.
2. Compare the total to the target's `AC` (plus 2 if defending).
3. If hit: call `RollDie` with the attacker's `DamageDie`. Add Strength modifier (or use `CalculateAttackPower` from Module 03). Subtract from target's `HP`.
4. Print the result: "Hero attacks Goblin! Roll: 17 + 5 = 22 vs AC 12. HIT! 7 damage. Goblin HP: 8/15."
5. If miss: Print "Hero attacks Goblin! Roll: 4 + 5 = 9 vs AC 12. MISS!"

### Step 3: Wire Up the HP Bar

For now, use the **Print String** approach to display HP. In a later module, you will build proper UI. But printing "Hero HP: 25/30 | Goblin HP: 8/15" after each action is enough to make combat feel real.

### Step 4: Win/Lose Check

After each attack, check if the target's HP is 0 or below. If so:
- Print "Goblin is defeated! Victory!" (or "Hero has fallen! Game Over!")
- Stop the combat loop.

### Step 5: Put It All Together

1. Place the combat grid in your level (via Python script).
2. Place the hero and goblin on the grid.
3. Place `BP_CombatManager` in the level.
4. On BeginPlay, the combat manager rolls initiative and begins the turn cycle.
5. On the player's turn, they choose: Move, Attack, or Defend.
6. On the goblin's turn, the goblin automatically attacks (simple AI: always attack the nearest enemy).

Press Play. Combat begins. Dice roll. Damage is dealt. Someone wins.

---

## What You Built Today

- A combat grid generated with Python (like a digital battle map).
- An initiative system that determines turn order using D20 rolls.
- Three core actions: Move, Attack, Defend.
- DnD-style attack resolution: D20 + modifier vs AC, then damage roll.
- HP tracking with win/lose conditions.
- A working 1v1 encounter: Hero vs Goblin.

This is not a prototype. This is the foundation of Tabletop Quest's combat system. Every future combat feature (multiple enemies, character classes, special abilities, area-of-effect spells) builds on top of what you created here.

Next up: Module 05, where you make all of this look beautiful.
