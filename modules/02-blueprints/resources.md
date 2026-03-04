# Module 02: Resources

A curated collection of tutorials, documentation, and learning materials for Unreal Engine 5 Blueprints.

---

## Official Epic Games Resources

### Blueprint Visual Scripting Documentation
- **URL**: [https://docs.unrealengine.com/5.4/en-US/blueprints-visual-scripting-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/blueprints-visual-scripting-in-unreal-engine/)
- **Description**: The complete official reference for the Blueprint system. Covers every node type, variable options, communication methods, and advanced features. Use this as your go-to reference when you need to look up how a specific node or feature works.

### Blueprint Best Practices
- **URL**: [https://docs.unrealengine.com/5.4/en-US/blueprint-best-practices-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/blueprint-best-practices-in-unreal-engine/)
- **Description**: Epic's official guidelines on how to write clean, performant Blueprints. Covers naming conventions, performance tips, and organizational patterns. Read this early to build good habits.

### Introduction to Blueprints (Epic Learning Portal)
- **URL**: [https://dev.epicgames.com/community/learning/courses/pE2/introduction-to-blueprints](https://dev.epicgames.com/community/learning/courses/pE2/introduction-to-blueprints)
- **Description**: A free, structured course from Epic that walks you through Blueprint fundamentals step by step. Includes video lessons and hands-on projects.

### Blueprint Communication Guide
- **URL**: [https://docs.unrealengine.com/5.4/en-US/blueprint-communication-in-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/blueprint-communication-in-unreal-engine/)
- **Description**: Detailed documentation on all methods of Blueprint communication: direct references, interfaces, event dispatchers, and casting. Essential reading for building systems with multiple interacting actors.

---

## YouTube Tutorials

### Ryan Laley: Blueprint Tutorial Series
- **URL**: [https://www.youtube.com/@RyanLaley](https://www.youtube.com/@RyanLaley)
- **Key playlists**: "UE5 Blueprint Tutorial" series, "Unreal Engine 5 for Beginners"
- **Description**: Ryan is one of the best Blueprint educators on YouTube. His tutorials are thorough, well-structured, and explain the "why" behind each approach. Start with his beginner series and progress to his intermediate and advanced playlists.

### Unreal Sensei: Blueprints for Beginners
- **URL**: [https://www.youtube.com/@UnrealSensei](https://www.youtube.com/@UnrealSensei)
- **Description**: Short, focused tutorials that get you building quickly. Great for visual learners who want to see results fast. His game creation series uses Blueprints extensively.

### Matt Aspland: Blueprint How-To Videos
- **URL**: [https://www.youtube.com/@MattAspland](https://www.youtube.com/@MattAspland)
- **Description**: Hundreds of short tutorials covering specific Blueprint tasks. Perfect for "how do I make X in Blueprints" questions. Topics range from health systems and inventories to AI and UI.

### Ali Elzoheiry: UE5 Blueprint Deep Dives
- **URL**: [https://www.youtube.com/@AliElzoheiry](https://www.youtube.com/@AliElzoheiry)
- **Description**: More advanced Blueprint content that bridges the gap between beginner and intermediate. Good coverage of Blueprint Interfaces, component architecture, and design patterns.

---

## Courses and Structured Learning

### Unreal Engine 5 C++ and Blueprint (Udemy, various instructors)
- **Description**: Several highly-rated courses on Udemy cover Blueprints as part of larger game development courses. Look for courses by Stephen Ulibarri, Tom Looman, or the GameDev.tv team. These provide structured project-based learning from start to finish.

### Epic Games Learning Portal
- **URL**: [https://dev.epicgames.com/community/learning](https://dev.epicgames.com/community/learning)
- **Description**: Epic's own learning hub with free courses, tutorials, and documentation organized by topic and skill level. Filter by "Blueprints" to find all relevant content.

---

## Reference and Cheat Sheets

### Blueprint Node Reference
- **URL**: [https://docs.unrealengine.com/5.4/en-US/blueprint-node-reference-for-unreal-engine/](https://docs.unrealengine.com/5.4/en-US/blueprint-node-reference-for-unreal-engine/)
- **Description**: A searchable reference of every available Blueprint node. When you see a node in a tutorial and want to understand exactly what it does, look it up here.

### Common Blueprint Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Right-click on graph | Open node search menu |
| Ctrl + drag variable | Create a Get node |
| Alt + drag variable | Create a Set node |
| C | Add a Comment box around selected nodes |
| Q | Align selected nodes left |
| 1, 2, 3 | Quick-add common nodes when dragging from a pin |
| Ctrl + Shift + F | Search all Blueprints in the project |
| F7 | Compile the Blueprint |
| F9 | Toggle breakpoint on selected node |

---

## Tips for Learning Blueprints

1. **Build before you study.** Tutorials are useful, but you learn fastest by trying to build something, getting stuck, and then looking up the solution.

2. **Comment your graphs.** Press C to create comment boxes around groups of nodes. Label them clearly. Your future self will thank you.

3. **Keep your graphs clean.** Use Reroute nodes (double-click a wire) to keep wires tidy. Align nodes with Q. A messy graph is a buggy graph.

4. **Use Print String liberally.** When debugging, add Print String nodes at key points to verify values and confirm that execution reaches certain nodes.

5. **Start simple, then iterate.** Build the simplest version that works, test it, then add complexity one piece at a time. Trying to build a complete system all at once leads to tangled, hard-to-debug graphs.
