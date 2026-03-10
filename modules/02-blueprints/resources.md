# Module 02: Resources

A curated collection of documentation, tutorials, and tools for learning UE5 Blueprints. Organised by category, with notes on why each resource is useful and when to use it.

---

## Official Unreal Engine Documentation

### Blueprint Visual Scripting Overview
- **URL**: https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine
- The official starting point for all things Blueprints. Covers the editor interface, node types, variables, functions, events, and communication. Dense but comprehensive. Bookmark this and return to it often as you learn new concepts.

### Blueprint Best Practices
- **URL**: https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-best-practices-in-unreal-engine
- Guidelines for keeping your Blueprints clean, performant, and maintainable. Covers naming conventions, graph organisation, when to use functions vs macros, and performance considerations. Read this after you have built a few Blueprints and start wondering "am I doing this right?"

### Blueprint Communication
- **URL**: https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-communication-usage-in-unreal-engine
- Deep dive into how Blueprints talk to each other: direct references, casting, interfaces, and event dispatchers. Directly relevant to everything in the second half of this module's lesson. If casting and interfaces feel confusing, read this page carefully.

### Timeline Node Documentation
- **URL**: https://dev.epicgames.com/documentation/en-us/unreal-engine/timelines-in-unreal-engine
- Everything about Timeline nodes: creating tracks, keyframes, looping, reversing, and the various output pins. Essential reference when building smooth animations for doors, chests, and environmental objects.

### Enhanced Input System
- **URL**: https://dev.epicgames.com/documentation/en-us/unreal-engine/enhanced-input-in-unreal-engine
- The modern input system used in UE5. Covers Input Actions, Input Mapping Contexts, and how to bind keys to gameplay events. You will need this for the "Press E to interact" pattern used throughout the exercises.

### Actor Components
- **URL**: https://dev.epicgames.com/documentation/en-us/unreal-engine/components-in-unreal-engine
- Reference for the component system. Explains Scene Components, Actor Components, and how to create custom components. Relevant to the BPC_Health and other modular components discussed in the lesson.

### Blueprint Debugging
- **URL**: https://dev.epicgames.com/documentation/en-us/unreal-engine/debugging-blueprints-in-unreal-engine
- How to use breakpoints, watch values, step through execution, and the visual debugger. When something goes wrong (and it will), this page shows you how to find the problem.

---

## YouTube Channels

### Ryan Laley
- **URL**: https://www.youtube.com/@RyanLaley
- In-depth Blueprint tutorials that explain the "why" behind every node, not just the "how." His beginner Blueprint series walks through variables, functions, events, and communication in a logical progression. One of the best teachers for Blueprint fundamentals. Start with his "Unreal Engine 5 Blueprint Tutorial" series.

### Matt Aspland
- **URL**: https://www.youtube.com/@MattAspland
- Short, focused videos (5-15 minutes each) that answer specific questions. Need to know how to do a line trace? There is a video. Need to set up Enhanced Input? There is a video. Treat this channel like a searchable cookbook. Over 500 UE5 tutorials covering specific topics.

### Gorka Games
- **URL**: https://www.youtube.com/@GorkaGames
- Beginner-friendly, project-based tutorials. Builds actual game mechanics step by step rather than teaching concepts in isolation. Good for seeing how multiple Blueprint concepts come together in a real game feature.

### Unreal Sensei
- **URL**: https://www.youtube.com/@UnrealSensei
- Primarily focused on environments and visual quality, but frequently includes Blueprint logic for interactive elements. Good for seeing Blueprints used in the context of a polished project rather than a grey-box prototype.

### Ali Elzoheiry
- **URL**: https://www.youtube.com/@AliElzoheiry
- Advanced Blueprint tutorials for combat systems, inventory, AI, and RPG mechanics. Once you have the basics down, this channel bridges the gap between beginner tutorials and production-quality game systems. Highly relevant to Tabletop Quest's combat and RPG features.

### Loot and XP (formerly Virtus Learning Hub)
- **URL**: https://www.youtube.com/@LootandXP
- Long-form tutorial series that build complete game systems from scratch. Has series on inventory systems, dialogue systems, and quest systems, all in Blueprints. Good for understanding how systems scale beyond simple prototypes.

---

## Specific Tutorial Searches

When searching YouTube or Google for specific topics from this module, use these search terms for the best results:

### Doors and Interactables
- "UE5 Blueprint door tutorial Timeline" - The exact sliding/swinging door pattern from the lesson.
- "UE5 Blueprint interaction system Enhanced Input" - Press-E-to-interact using the modern input system.
- "UE5 Blueprint Interface interaction" - The interface-based interaction pattern from Exercise 7.

### Variables and Logic
- "UE5 Blueprint variables beginners" - Thorough introduction to variable types and usage.
- "UE5 Blueprint Branch node tutorial" - Using Boolean conditions to make decisions.
- "UE5 Blueprint Cast To explained" - Understanding casting and when to use it.

### Timelines and Animation
- "UE5 Timeline tutorial Blueprint" - How to create and use Timeline nodes for smooth animation.
- "UE5 Lerp Blueprint tutorial" - Using linear interpolation for position, rotation, and colour.
- "UE5 Blueprint floating item bob rotation" - Creating the loot crystal hover effect.

### Communication and Architecture
- "UE5 Blueprint Interface tutorial" - Step-by-step interface creation and implementation.
- "UE5 Event Dispatcher tutorial" - Broadcasting events between Blueprints.
- "UE5 Actor Component Blueprint tutorial" - Creating reusable modular components.

### RPG-Specific Systems
- "UE5 Blueprint RPG health system" - Building health, damage, and death systems.
- "UE5 Blueprint inventory system beginner" - Foundational inventory mechanics.
- "UE5 Blueprint NPC interaction dialogue" - NPC systems relevant to Tabletop Quest's tavern characters.

---

## Community Resources

### Unreal Engine Forums (Blueprint Section)
- **URL**: https://forums.unrealengine.com/categories?tag=blueprint
- Active community forum where you can search for solutions and ask questions. Many common Blueprint problems have already been answered here with node screenshots.

### Unreal Slackers Discord
- **URL**: https://discord.gg/unreal-slackers
- Large, active Discord community for Unreal Engine developers. The #blueprints channel is a good place to ask questions and get quick help. Experienced developers often respond within minutes.

### r/unrealengine (Reddit)
- **URL**: https://www.reddit.com/r/unrealengine/
- Active subreddit with a mix of showcases, questions, and tutorials. Use the search function to find Blueprint-specific discussions. Good for seeing how others approach similar problems.

### Blueprint UE (Community Wiki/Examples)
- **URL**: https://blueprintue.com/
- A community site where people share Blueprint node graphs as copyable snippets. You can paste these directly into your UE5 editor. Search for "door," "interact," or "health" to find examples relevant to this module.

---

## Useful Reference: Blueprint Keyboard Shortcuts

Keep these handy while working in the Blueprint editor:

| Shortcut | Action |
|---|---|
| Right-click on canvas | Open node search menu |
| Ctrl + drag variable | Create a Get node |
| Alt + drag variable | Create a Set node |
| C (with nodes selected) | Create a Comment box |
| Q | Toggle wire alignment mode |
| Double-click wire | Create a Reroute node |
| F (with node selected) | Focus/zoom to selected |
| Ctrl + Shift + F | Search all Blueprints in the project |
| F5 (during debug) | Continue execution past breakpoint |
| F10 (during debug) | Step to next node |
| F9 (on a node) | Toggle breakpoint |
| Ctrl + S | Save current Blueprint |
| F7 | Compile current Blueprint |
| Home | Zoom to fit all nodes |

---

## Using Claude as a Blueprint Resource

Claude can supplement all of the above resources in specific ways:

- **"Describe the nodes I need for X"**: Tell Claude what you want to build ("a door that opens when the player presses E while nearby"), and Claude will list the exact nodes and connections step by step.
- **"Why is my Blueprint not working?"**: Describe your setup (components, variables, event wiring) and what is happening vs what you expected. Claude can spot logical errors, missing connections, and common mistakes.
- **"Explain this node"**: Ask about any specific Blueprint node and Claude will explain what it does, its inputs and outputs, and when you would use it.
- **"How should I structure this system?"**: For bigger features (combat, inventory, quest tracking), Claude can recommend Blueprint architecture: which classes, components, interfaces, and dispatchers to use.
- **"Convert this to a step-by-step"**: Paste a YouTube tutorial's description or a documentation page and ask Claude to break it down into numbered steps specific to your project.

The combination of visual YouTube tutorials, official documentation for reference, community help for troubleshooting, and Claude for personalised guidance gives you coverage from every angle. Use whichever resource fits the moment.
