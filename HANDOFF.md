# Tabletop Quest Academy: Handoff for Home PC

This file gives Claude (or you) full context on this project. Paste this into a new Claude session or read it yourself.

---

## What This Is

A learning platform for building a DnD-inspired 3D RPG in Unreal Engine 5.7. The game has three signature features:

1. **Tabletop Zoom**: You look down at a physical table with miniatures and a map. Zoom in and the miniatures come to life, the flat map becomes a full 3D world. One persistent world, not two levels. The map on the table is a live render-to-texture.

2. **Dual Combat**: Turn-based AND real-time action in the same game, switchable mid-fight. Turn-based uses a grid with initiative order. Real-time uses direct control with cooldowns. Same ability system (GAS) powers both.

3. **Local AI Dungeon Master**: Ollama runs a local LLM that acts as DM in freeplay mode. It outputs structured JSON that the game engine validates. No subscriptions, no servers.

## The Git Repo

**GitHub**: https://github.com/tristyb34-cell/tabletop-quest-academy
**Live site**: https://tristyb34-cell.github.io/tabletop-quest-academy/
**Local path**: `~/tabletop-quest-academy/`

Clone it on the home PC:
```bash
git clone https://github.com/tristyb34-cell/tabletop-quest-academy.git ~/tabletop-quest-academy
```

### Repo Structure

```
tabletop-quest-academy/
  index.html, style.css, app.js    -- Colorful web app (dark theme, mobile responsive)
  favicon.svg                       -- D20 gradient icon
  serve.sh                          -- Local server script (python3 http.server)
  SETUP.md                          -- Firebase setup guide (already done)
  .github/workflows/pages.yml       -- Auto-deploys to GitHub Pages on push

  modules/
    01-unreal-basics/               -- Editor, viewport, actors, landscapes
    02-blueprints/                  -- Visual scripting, events, variables
    03-cpp-in-unreal/               -- UPROPERTY, UFUNCTION, components, delegates
    04-gameplay-ability-system/     -- GAS: abilities, effects, tags, attributes
    05-materials-and-rendering/     -- PBR, material instances, render-to-texture
    06-cameras-and-input/           -- Spring arms, camera modes, Enhanced Input
    07-ai-behavior-trees/           -- AI controllers, blackboards, EQS, party AI
    08-ui-with-umg/                 -- Widget Blueprints, HUDs, menus
    09-level-streaming-world-partition/ -- Sub-levels, World Partition, fog of war
    10-audio-systems/               -- Sound Cues, MetaSounds, crossfades, music

  cheatsheets/
    blueprint-nodes.md              -- Common Blueprint nodes by category
    cpp-patterns.md                 -- UE5 C++ macros, patterns, naming
    gas-reference.md                -- GAS setup, abilities, effects, tags
    material-nodes.md               -- Material editor nodes
    essential-code.md               -- The functions you use every day (Blueprint + C++ + GAS)
    debugging.md                    -- Output Log, breakpoints, visual debug, console commands

  project-bible/
    game-design-doc.md              -- Full GDD with all systems, phases, timeline
    class-abilities.md              -- 6 classes, 8 abilities each, 12 subclasses
    enemy-bestiary.md               -- 22 enemies across 3 tiers, 3 multi-phase bosses
    loot-tables.md                  -- Weapons, armor, accessories, drop rates, gold economy
```

Each module has 4 files: `lesson.md`, `exercises.md`, `quiz.md`, `resources.md`.

### The Web App

- Dark theme with vibrant color coding per module (orange, blue, purple, red, pink, teal, green, amber, indigo, cyan)
- Mobile responsive (hamburger menu, stacked layout)
- Progress tracking with "Mark as Complete" buttons per section
- Cross-device sync via Firebase Firestore (already configured)
- Sync code is stored in localStorage, same code on any device shares progress
- `app.js` is an ES module that imports Firebase SDK from CDN

### Firebase

- **Project**: "TableTop Quest" on a personal Gmail (NOT work topclick account)
- **Database**: Firestore, europe-west1, default database
- **Config**: Already in `app.js` (apiKey, projectId, etc.)
- **Rules**: `/progress/{code}` allows read/write
- **Sync code**: Set once per device via the bottom banner. Uses the same code across devices.
- **How it works**: Each device reads/writes to one Firestore document. Merging is additive (if either device marks done, it stays done). Real-time listener via `onSnapshot`.

## The Game Design (Summary)

### Simplified DnD System
- **4 Stats**: Might (STR+CON), Finesse (DEX), Mind (INT+WIS), Presence (CHA)
- **6 Classes**: Warrior, Rogue, Mage, Cleric, Ranger, Bard (each gets 2 subclasses at level 5)
- **5 Races**: Human, Elf, Dwarf, Halfling, Orc
- **Mana** instead of spell slots. Level cap 15.
- **8 Skills**: Athletics, Stealth, Acrobatics, Arcana, Perception, Medicine, Persuasion, Intimidation

### Combat
- Turn-based: grid, initiative, move + action + bonus action
- Real-time: direct control, cooldowns (1 Action = 6s CD, Bonus Action = 3s CD)
- Switchable mid-fight. GAS powers both modes.
- Dice rolls under the hood in real-time. Natural 20 = slowdown + flash. Natural 1 = stumble.

### AI Dungeon Master
- Ollama with Llama 3.1 8B or Mistral 7B
- 4 layers: narrative text, NPC dialogue, encounter generation, quest generation
- LLM never modifies game state directly. Outputs JSON, engine validates.
- 4000 token sliding window context
- Campaign mode: LLM adds flavor only. Freeplay: LLM drives everything.

### Camera Systems (5 modes)
1. Tabletop (fixed overhead with orbit)
2. Exploration (third-person spring arm)
3. Turn-based combat (isometric, rotatable)
4. Real-time combat (locked behind character)
5. Cinematic (rail-based for dialogue/reveals)

## Development Phases

| Phase | What | Duration |
|---|---|---|
| 0 (CURRENT) | Learning UE5 via this repo | 2-3 months |
| 1 | Core combat prototype (one room, Warrior, turn-based, dice) | 4-6 months |
| 2 | Tabletop environment + zoom transition | 3-4 months |
| 3 | RPG systems (all classes, leveling, inventory, quests) | 3-4 months |
| 4 | Real-time combat + party AI + mode switching | 4-5 months |
| 5 | AI Dungeon Master (Ollama integration) | 2-3 months |
| 6 | Polish, content, tutorial, local co-op | 3-4 months |

Total: ~2-2.5 years at 8-10 hours/week. Each phase produces something playable.

## Home PC Setup

Needed before starting exercises:
- [x] Unreal Engine 5.7 (already installed)
- [ ] Visual Studio Community 2022 with "Game development with C++" workload
- [ ] Blender (free, for later phases)
- [ ] Clone this repo: `git clone https://github.com/tristyb34-cell/tabletop-quest-academy.git`

## Learning Flow

- **Phone (while out)**: Read lessons, take quizzes, mark complete
- **Home PC**: Do exercises with UE5 open
- Modules 01-02 are theory-heavy (phone-friendly)
- Module 03+ requires UE5 on screen
- Progress syncs automatically between devices

## Important Notes for Claude on Home PC

- **Engine version is 5.7**. Search for 5.7-specific solutions. Older UE5 answers may have outdated APIs.
- **No em dashes** in any output. Ever. Use commas, periods, semicolons, colons, or "and" instead.
- The web app's JS is `app.js` (ES module). Push changes to main and GitHub Pages auto-deploys in ~1 minute.
- The full GDD is in `project-bible/game-design-doc.md`. That is the source of truth for game design decisions.
- This is a learning project. Tristan is beginner-to-intermediate. Explain the "why" not just the "what". Use analogies.

## Memory Update for Home PC Claude

On the home PC, tell Claude to add this to its memory (or paste it into CLAUDE.md):

```
## Tabletop Quest Academy (Game Dev Learning Project)
- **Repo**: ~/tabletop-quest-academy/ and https://github.com/tristyb34-cell/tabletop-quest-academy
- **Live site**: https://tristyb34-cell.github.io/tabletop-quest-academy/
- **Engine**: Unreal Engine 5.7. Always search for 5.7-specific solutions, not older versions.
- **Firebase**: Project "TableTop Quest" on personal Gmail (not work account). Firestore syncs progress across devices via a sync code.
- **What it is**: 10-module learning platform for building a DnD tabletop-to-3D RPG. Includes cheatsheets, project bible (GDD, classes, enemies, loot), and a colorful web app with cross-device progress sync.
- **Game concept**: Tabletop zoom (miniatures come alive), dual combat (turn-based + real-time switchable mid-fight), local AI DM (Ollama). See project-bible/game-design-doc.md for full GDD.
- **Phase plan**: Phase 0 (learning) > Phase 1 (combat prototype) > Phase 2 (tabletop transition) > Phase 3 (RPG systems) > Phase 4 (real-time combat) > Phase 5 (AI DM) > Phase 6 (polish). Currently in Phase 0.
- **Home PC needs**: UE5.7 (installed), Visual Studio Community 2022 with "Game development with C++" workload, Blender
- **No em dashes** in any output. Ever.
- **Tristan is beginner-to-intermediate with UE5.** Explain the "why" not just the "what". Use analogies.
```

Just say: "Read ~/tabletop-quest-academy/HANDOFF.md and save the memory block from it to your memory."

---

## Tool Chain (All Free)

| Need | Tool |
|---|---|
| Engine | Unreal Engine 5.7 |
| 3D Modeling | Blender |
| Animations | Mixamo (free with Adobe account) |
| Textures | Quixel Megascans (free with UE5) |
| AI/LLM | Ollama + Llama 3.1 / Mistral |
| Sound FX | Freesound.org |
| Music | Kevin MacLeod / Musopen |
| Version Control | Git + GitHub |
| 2D Art/UI | GIMP / Krita |
| IDE | Visual Studio Community 2022 |
