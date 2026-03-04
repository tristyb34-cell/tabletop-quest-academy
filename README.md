# Tabletop Quest Academy

Your offline learning companion for building a DnD tabletop-to-3D world game in Unreal Engine 5.

## What Is This?

A structured knowledge base that takes you from zero UE5 experience to building a full RPG with dual combat, a tabletop zoom mechanic, and a local AI Dungeon Master. Each module teaches one core concept through lessons, hands-on exercises, and quizzes.

## How to Use

1. Work through modules in order (they build on each other)
2. Read the lesson first, then do the exercises
3. Take the quiz to check your understanding
4. Check off completed items in `progress.md`
5. Reference `cheatsheets/` anytime you need a quick lookup
6. The `project-bible/` folder contains the full game design doc, ability tables, enemy stats, and loot tables

## Module Map

| Module | Topic | Prepares You For |
|---|---|---|
| 01 | Unreal Basics | Everything (editor fluency) |
| 02 | Blueprints | Rapid prototyping |
| 03 | C++ in Unreal | Performance-critical systems |
| 04 | Gameplay Ability System | Phase 1: Combat prototype |
| 05 | Materials and Rendering | Phase 2: Tabletop transition |
| 06 | Cameras and Input | Phase 2: Camera systems |
| 07 | AI and Behavior Trees | Phase 4: Party AI |
| 08 | UI with UMG | Phase 3: RPG interface |
| 09 | Level Streaming / World Partition | Phase 2: World loading |
| 10 | Audio Systems | Phase 6: Polish |

## Project Bible

- `game-design-doc.md` - the full game design document (living doc, update as you go)
- `class-abilities.md` - all 6 classes, their abilities, subclasses
- `enemy-bestiary.md` - enemy types, stats, behaviors, loot
- `loot-tables.md` - items, rarity tiers, drop rates, equipment slots

## Cheatsheets

Quick reference cards you'll use constantly:
- `blueprint-nodes.md` - common Blueprint nodes
- `cpp-patterns.md` - UE5 C++ patterns and macros
- `gas-reference.md` - Gameplay Ability System reference
- `material-nodes.md` - Material editor nodes

## Timeline

At 8-10 hours/week, expect 2-3 months on these modules before starting Phase 1 of actual game development. That's not wasted time; it prevents architectural rewrites later.

## Tech Stack (All Free)

- Unreal Engine 5
- Blender (3D modeling)
- Mixamo (character animations)
- Quixel Megascans (textures, free with UE5)
- Ollama + Llama 3.1 / Mistral (local AI)
- Visual Studio Community (IDE)
- Git + GitHub (version control)
