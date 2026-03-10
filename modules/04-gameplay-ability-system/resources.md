# Module 04: Resources

---

## Turn-Based Combat Design

### D&D 5th Edition Basic Rules (Free PDF)
- **URL**: [https://dnd.wizards.com/what-is-dnd/basic-rules](https://dnd.wizards.com/what-is-dnd/basic-rules)
- The official free rules for DnD 5e. Chapter 9 (Combat) covers initiative, actions, movement, attack rolls, and damage. This is the ruleset Tabletop Quest is inspired by, so it is worth reading for design reference.

### Game Maker's Toolkit: "What Makes a Good Combat System?" (YouTube)
- **URL**: [https://www.youtube.com/@GameMakersToolkit](https://www.youtube.com/@GameMakersToolkit)
- Search for "turn based combat" on this channel. Excellent design analysis of what makes combat feel satisfying. Good for thinking about your own system's feel and flow.

### Extra Credits: "Turn-Based Combat" (YouTube)
- **URL**: [https://www.youtube.com/@ExtraCredits](https://www.youtube.com/@ExtraCredits)
- Short, approachable videos about game design principles. Their episodes on combat design, action economy, and enemy design are relevant to Tabletop Quest.

---

## Grid-Based Movement in UE5

### UE5 Grid Snapping and Tile Placement
- Use the built-in grid snapping (hold Ctrl while moving Actors) for manual tile alignment.
- For automated grid creation, the Python console approach from the lesson is the most efficient method. Ask Claude for scripts tailored to your grid size and tile assets.

### Pathfinding on a Grid
- For basic grid movement, you can calculate distance between tiles using Manhattan distance: `abs(x2 - x1) + abs(y2 - y1)`.
- For more advanced pathfinding (around obstacles), ask Claude to write an A* pathfinding plugin as a C++ Blueprint Function Library.

---

## Free Fantasy Character Models

### Mixamo (Free Character Animations)
- **URL**: [https://www.mixamo.com/](https://www.mixamo.com/)
- Free character animations that can be applied to any humanoid model. Download idle, attack, walk, and death animations for your hero and goblin. Export as FBX for UE5.

### Paragon Assets (Free on Fab)
- Epic's retired Paragon game assets are available for free. High-quality characters with animations, suitable as hero placeholders.

### Infinity Blade Assets (Free on Fab)
- Fantasy characters, enemies, and weapons. Perfect for DnD-style combatants.

### Quaternius (Free Low-Poly Models)
- **URL**: [https://quaternius.com/](https://quaternius.com/)
- Free low-poly fantasy characters, monsters, and props. The "Ultimate Animated Character" pack includes goblins, skeletons, and other RPG enemies.

---

## Blueprint Patterns Used in Combat

### Timer by Function Name
- Used for repeating actions (like damage-over-time effects).
- **Set Timer by Function Name**: Calls a function at a regular interval.
- **Clear Timer by Function Name**: Stops the timer.
- Useful for: poison ticks, regeneration, countdown timers.

### Arrays and Sorting
- The `Combatants` array holds all characters in the fight.
- Sorting by initiative can be done with a simple Blueprint loop, or ask Claude for a C++ sort helper.
- **For Each Loop** iterates through every combatant for turn cycling.

### Casting
- When the combat manager references a generic Actor, it may need to **Cast** to `BP_CombatCharacter` to access combat-specific variables like HP, AC, and AttackModifier.
- If the cast fails (the Actor is not a combat character), the "Cast Failed" pin fires, and you can handle it gracefully.

---

## Next Steps to Explore

Once the basic combat works, here are features to consider adding later:

- **Special abilities**: Fireball (area damage to all enemies), Heal (restore HP), Shield Bash (stun for one turn).
- **Character classes**: Fighter (high HP, strong attacks), Wizard (low HP, powerful spells), Rogue (sneak attack bonus on first hit).
- **Status effects**: Poisoned (take damage each turn), Stunned (skip your turn), Blessed (+2 to all rolls).
- **Loot drops**: When an enemy is defeated, roll on the loot table from Module 03's loot plugin.
