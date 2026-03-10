# Module 07: Resources - Enemy AI

## Official UE5 Documentation

### AI System Overview
- **AI System Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/artificial-intelligence-in-unreal-engine
- **Behavior Trees**: https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---overview
- **Behavior Tree Quick Start**: https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-in-unreal-engine---quick-start-guide
- **Behavior Tree Node Reference**: https://dev.epicgames.com/documentation/en-us/unreal-engine/behavior-tree-node-reference-in-unreal-engine

### Blackboard
- **Blackboard**: https://dev.epicgames.com/documentation/en-us/unreal-engine/blackboard-in-unreal-engine

### AI Perception
- **AI Perception System**: https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine
- **Sight Config**: https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/AIModule/UAISenseConfig_Sight

### Environment Query System
- **EQS Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-in-unreal-engine
- **EQS Quick Start**: https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-quick-start-in-unreal-engine
- **EQS Node Reference**: https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-node-reference-in-unreal-engine

### Navigation
- **Navigation System**: https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-system-in-unreal-engine
- **NavMesh**: https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-mesh-in-unreal-engine
- **Nav Link Proxy**: https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-link-proxy-in-unreal-engine

### Debugging
- **Gameplay Debugger**: https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-debugger-in-unreal-engine
- **Visual Logger**: https://dev.epicgames.com/documentation/en-us/unreal-engine/visual-logger-in-unreal-engine

## Video Tutorials

### Behavior Trees
- **Ryan Laley - UE5 AI Behavior Tree Tutorial (Full Series)**: Excellent Blueprint-focused series. Covers patrol, perception, and combat in practical steps.
- **Unreal Engine - AI with Behavior Trees | Live Training**: Official Epic livestream walking through BT fundamentals.

### EQS
- **Ryan Laley - Environment Query System (EQS) Tutorial**: Practical EQS usage with flee queries and cover-finding.
- **Unreal Engine - EQS Deep Dive**: Official deep dive into generators, tests, and contexts.

### Boss AI
- **Tom Looman - Boss AI with Behavior Trees in UE5**: Multi-phase boss AI implementation. Very relevant to the Dragon Boss exercise.
- **Gorka Games - Creating RPG AI in UE5**: RPG-specific AI patterns including patrol, aggro, and territory.

## Community Resources

### Forums and Q&A
- **UE5 AI Forum**: https://forums.unrealengine.com/tags/c/development-discussion/ai/15
- **Reddit r/unrealengine**: Search for "behavior tree" or "AI perception" for common troubleshooting threads
- **Stack Overflow UE5 AI tag**: Useful for specific API questions

### Sample Projects
- **Content Examples Project**: Epic's official example project includes an AI section with working Behavior Trees, Perception, and EQS demos. Available in the Epic Games Launcher under Learning.
- **Action RPG Sample**: Epic's action RPG project includes enemy AI with patrol, combat, and aggro. Good reference for Tabletop Quest's enemy patterns.

## UE5 Python Scripting
- **Python Scripting Plugin**: https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python
- **Python API Reference**: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api-reference-for-unreal-engine

## Design References

### Game AI Books
- **"Artificial Intelligence for Games" by Ian Millington**: The standard textbook on game AI. Covers behavior trees, pathfinding, and decision-making in depth.
- **"Game AI Pro" series (volumes 1-3)**: Collection of practical articles by industry AI programmers. Many chapters on behavior trees and boss AI.

### Boss Design Analysis
- **Dark Souls boss design breakdowns**: Study how FromSoftware creates multi-phase boss encounters. The pattern of "Phase 1: learn the moveset, Phase 2: increased aggression, Phase 3: new mechanics" is a proven formula.
- **Divinity: Original Sin 2 enemy AI**: Turn-based RPG AI that evaluates positioning, targets, and ability usage. Relevant to Tabletop Quest's turn-based mode.
- **DnD Monster Manual**: The original source. Each monster has behavioral notes ("goblins flee when outnumbered", "skeletons follow orders mindlessly"). These translate directly to Behavior Tree priorities.

## Asset Packs (for prototyping)

- **Mixamo**: Free character animations. Essential for attack, idle, patrol, and death animations during AI prototyping: https://www.mixamo.com
- **Quaternius Free Models**: Low-poly fantasy creatures (goblins, skeletons, dragons) that work well for prototyping enemy visuals: https://quaternius.com
