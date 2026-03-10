# Module 04: Resources - Combat System

A curated collection of documentation, tutorials, and references for building combat systems in Unreal Engine 5.

---

## Official Epic Games Documentation

### Gameplay Ability System (GAS) Overview
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-ability-system-for-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-ability-system-for-unreal-engine)
- **Why it matters**: While Tabletop Quest builds its own ability system with Data Assets rather than using Epic's full GAS framework, understanding GAS concepts (ability activation, gameplay effects, attribute sets) gives you context for how professional studios structure combat. If you later want to migrate to GAS, this is the starting point.

### Gameplay Tags
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-tags-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-tags-in-unreal-engine)
- **Why it matters**: Gameplay Tags are hierarchical labels (like "Status.Stunned", "Damage.Fire", "Ability.Warrior.PowerStrike") that can replace enums when you need more flexibility. As your combat system grows, consider migrating from enums to Gameplay Tags for damage types and status effects.

### Enhanced Input System
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine)
- **Why it matters**: The real-time combat mode needs responsive input handling. Enhanced Input lets you define Input Actions (like "UseAbility1", "SwitchCombatMode") and bind them to keys, gamepad buttons, or mouse clicks with modifiers and triggers.

### UMG (Unreal Motion Graphics) UI
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-ui-designer-for-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-ui-designer-for-unreal-engine)
- **Why it matters**: The turn order bar, action menu, ability hotbar, and combat log are all UMG widgets. This is the official guide to creating, styling, and animating UI elements in UE5.

### Data Assets and Data-Driven Design
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/data-registries-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/data-registries-in-unreal-engine)
- **Why it matters**: The ability system is entirely data-driven through Data Assets. This guide covers the Asset Manager, Primary Data Assets, and how to load and reference them at runtime.

### Animation Montages
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-montage-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-montage-in-unreal-engine)
- **Why it matters**: Combat abilities play animation montages (sword swings, spell casting, healing gestures). Montages allow you to play specific animations on demand, blend them with locomotion, and trigger gameplay events at specific frames (like the moment a sword connects).

---

## Combat System Design References

### DnD 5e System Reference Document (SRD)
- **URL**: [https://www.dndbeyond.com/sources/basic-rules](https://www.dndbeyond.com/sources/basic-rules)
- **Why it matters**: Tabletop Quest's combat is inspired by DnD 5e. The SRD covers the action economy (Action, Bonus Action, Movement, Reaction), the ability modifier formula ((score-10)/2), armor class, and all the conditions (Stunned, Frightened, Poisoned, etc.) that map to your status effects.

### GDC Talk: "The Combat Design of Baldur's Gate 3"
- **URL**: Search YouTube for "Baldur's Gate 3 combat GDC" (Larian Studios)
- **Why it matters**: Baldur's Gate 3 is the gold standard for DnD-to-video-game combat adaptation. Their GDC talk covers how they translated turn-based tabletop rules into a real-time-with-pause system, handled action economy in a video game context, and balanced encounters. Directly relevant to Tabletop Quest's design.

### Divinity: Original Sin 2 - Combat Analysis
- **URL**: Search YouTube for "Divinity Original Sin 2 combat design analysis"
- **Why it matters**: Another Larian game with excellent turn-based combat. Their AP (Action Point) system, environmental interactions, and height advantages are worth studying for Tabletop Quest encounter design.

### Pillars of Eternity - Dual Combat Mode
- **URL**: Search for "Pillars of Eternity real-time with pause vs turn-based"
- **Why it matters**: Pillars of Eternity 2: Deadfire shipped with both real-time-with-pause and turn-based modes. Studying how they handled the dual-mode conversion (cooldowns vs. per-round abilities, action speed vs. initiative) provides practical design lessons for Tabletop Quest's mode switching.

---

## Community Tutorials

### Tom Looman: Action RPG Combat in UE5
- **URL**: [https://www.tomlooman.com/](https://www.tomlooman.com/)
- **Why it matters**: Tom's action RPG series covers damage systems, ability execution, and combat UI in UE5 with C++ and Blueprints. His architecture patterns (using subsystems, delegates, and data assets) align well with the Tabletop Quest approach.

### Ryan Laley's UE5 Turn-Based Tutorial
- **URL**: Search YouTube for "Ryan Laley UE5 turn based combat"
- **Why it matters**: A step-by-step Blueprint tutorial for building turn-based combat in UE5. Covers initiative, turn cycling, action selection UI, and grid movement. Good for seeing the Blueprint implementation patterns in action.

### Unreal Sensei: RPG Combat System
- **URL**: Search YouTube for "Unreal Sensei RPG combat system UE5"
- **Why it matters**: Covers building an RPG combat system with health components, damage types, and ability systems. Good visual walkthrough of the Blueprint patterns used in real-time combat.

### GAS Documentation Project (Community)
- **URL**: [https://github.com/tranek/GASDocumentation](https://github.com/tranek/GASDocumentation)
- **Why it matters**: The most comprehensive community documentation for the Gameplay Ability System. Even though Tabletop Quest uses a custom ability system, the concepts (attribute sets, gameplay effects, ability activation policies) are educational and may inform future iterations.

---

## Balance and Design Tools

### Challenge Rating Calculator
- **URL**: [https://kastark.co.uk/rpgs/encounter-calculator-5th/](https://kastark.co.uk/rpgs/encounter-calculator-5th/)
- **Why it matters**: A DnD 5e encounter difficulty calculator. Enter party size, party level, and enemy CR values to determine if an encounter is Easy, Medium, Hard, or Deadly. Useful for calibrating Tabletop Quest encounters before running Python simulations.

### Anydice (Probability Calculator)
- **URL**: [https://anydice.com/](https://anydice.com/)
- **Why it matters**: A dice probability calculator. Enter any dice expression (like "2d6+3" or "highest 1 of 2d20") and see the probability distribution. Essential for understanding the math behind your damage formulas and hit chances.

### Game Balance Spreadsheet
- **Tip**: Create a Google Sheet with columns for: Enemy Name, HP, AC, Damage/Round, XP, and Expected Rounds to Kill. Calculate expected damage per round from your party against each enemy, and vice versa. This gives you a quick sanity check before running full simulations.

---

## UE5 Performance and Optimization

### Blueprint Nativization
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-nativization-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-nativization-in-unreal-engine)
- **Why it matters**: If your combat Blueprints become performance-critical (running complex logic every frame in real-time mode), Blueprint Nativization converts them to C++ at build time. This gives you the ease of Blueprint development with near-C++ performance in shipping builds.

### Profiling Tools
- **URL**: [https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-insights-in-unreal-engine)
- **Why it matters**: When real-time combat with 20+ combatants starts dropping frames, Unreal Insights helps you identify bottlenecks. Is it the ability resolution? Status effect ticking? AI decision-making? The profiler tells you exactly where the time is going.

---

## Recommended Learning Path

1. Build Exercises 1-4 (Combat Manager, Abilities, Execution Pipeline, Status Effects)
2. Study the DnD 5e SRD sections on combat and conditions
3. Watch the Baldur's Gate 3 GDC talk for design inspiration
4. Build Exercises 5-6 (UI, Mode Switching)
5. Use Anydice to verify your damage formulas produce the distributions you expect
6. Run the Python balance simulations (Exercise 8) for your first set of encounters
7. Move on to Module 05 to make the combat visually stunning
