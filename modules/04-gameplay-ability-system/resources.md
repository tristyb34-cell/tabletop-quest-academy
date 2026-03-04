# Module 04: Resources - Gameplay Ability System

## Essential Reading

### Tranek's GAS Documentation (Community Wiki)
**https://github.com/tranek/GASDocumentation**
The single best resource for GAS. This community-maintained document covers every corner of the system with practical examples, architecture patterns, and explanations of internal behaviour. Read this cover to cover. It is effectively the unofficial manual that Epic never wrote. Pay special attention to the sections on Ability System Globals, prediction, and the recommended project setup patterns.

### Epic's Official GAS Documentation
**https://docs.unrealengine.com/5.0/en-US/gameplay-ability-system-for-unreal-engine/**
The official docs cover the basics: setting up the ASC, creating abilities and effects, and configuring tags. They are lighter on practical patterns and architecture advice compared to Tranek's guide, but they are the authoritative source for API reference and intended usage.

---

## Video Tutorials

### Reubs's GAS Tutorial Series (YouTube)
**https://www.youtube.com/@Reubs**
A thorough, project-based walkthrough of building an action RPG ability system from scratch. Reubs explains not just the "how" but the "why" behind each architectural decision. Covers attribute sets, abilities, effects, gameplay cues, and multiplayer replication. Highly recommended for visual learners who want to follow along step by step.

### Dan's GAS Course (The Game Dev Cave)
**https://www.thegamedev.guru/**
A structured course covering GAS from beginner to advanced. Includes sections on MMCs (Modifier Magnitude Calculations), Execution Calculations, and advanced stacking behaviour. Good for learners who prefer a course format over documentation.

### LeafBranchGames GAS Videos
**https://www.youtube.com/@LeafBranchGames**
Focused, practical GAS tutorials that tackle specific problems: how to set up cooldowns, how to build a buff/debuff system, how to create projectile abilities. Useful as targeted references when you are working on a specific feature.

---

## Sample Projects

### Action RPG Sample Project (Epic Games)
**https://docs.unrealengine.com/5.0/en-US/action-rpg-game-sample-project-unreal-engine/**
Epic's own sample project demonstrating GAS in a Diablo-style action RPG. Includes a full attribute set, multiple ability types (melee, ranged, area-of-effect), inventory integration, and AI enemies using the ability system. Study the code structure, especially how they organise their effect and ability class hierarchies.

### Lyra Starter Game
**https://docs.unrealengine.com/5.0/en-US/lyra-sample-game-in-unreal-engine/**
Epic's modern UE5 sample project. While it is a shooter, its GAS implementation demonstrates best practices for UE5, including the Enhanced Input System integration, modular ability activation, and Gameplay Cue management. The patterns here are directly applicable to any genre.

---

## Reference Documentation

### Gameplay Tags Documentation
**https://docs.unrealengine.com/5.0/en-US/using-gameplay-tags-in-unreal-engine/**
Deep dive into the tag system: how to define tags, query containers, use tag queries in abilities and effects, and manage tag hierarchies across your project.

### Gameplay Effects and Attributes
**https://docs.unrealengine.com/5.0/en-US/gameplay-attributes-and-gameplay-effects-for-the-gameplay-ability-system-in-unreal-engine/**
Official reference for attribute sets, effect modifiers, execution calculations, and the attribute aggregator system.

---

## Community Resources

### Unreal Source Discord - GAS Channel
The Unreal Source community Discord has a dedicated GAS channel where experienced developers answer questions. Useful for debugging specific issues or getting architecture advice.

### r/unrealengine (Reddit)
Search for "GAS" or "Gameplay Ability System" posts. Many developers share their project architectures and solutions to common problems. The subreddit has a wealth of archived discussions on GAS-specific topics.

---

## Recommended Study Order

1. Start with Tranek's GAS Documentation (read the overview and setup sections)
2. Follow along with Reubs's tutorial series to build a working prototype
3. Study the Action RPG sample project for production patterns
4. Reference Epic's official docs for specific API details
5. Revisit Tranek's documentation for advanced topics (prediction, replication, execution calculations)
6. Explore the Lyra project for modern UE5-specific patterns
