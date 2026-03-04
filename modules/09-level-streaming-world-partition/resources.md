# Module 9: Resources - Level Streaming and World Partition

## Official UE5 Documentation

- **Level Streaming Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-in-unreal-engine
- **Level Streaming How-To**: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-how-to-in-unreal-engine
- **World Partition**: https://dev.epicgames.com/documentation/en-us/unreal-engine/world-partition-in-unreal-engine
- **World Partition Setup Guide**: https://dev.epicgames.com/documentation/en-us/unreal-engine/converting-a-level-to-use-world-partition-in-unreal-engine
- **One File Per Actor (OFPA)**: https://dev.epicgames.com/documentation/en-us/unreal-engine/one-file-per-actor-in-unreal-engine
- **Data Layers**: https://dev.epicgames.com/documentation/en-us/unreal-engine/data-layers-in-unreal-engine
- **HLOD Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/hierarchical-level-of-detail-in-unreal-engine
- **Level Streaming Volumes**: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-streaming-volumes-in-unreal-engine

## Video Tutorials

- **Unreal Engine Official, World Partition Deep Dive**: Search "Unreal Engine World Partition" on YouTube. Epic's official talks explain the system architecture and best practices in detail.
- **Ryan Laley, Level Streaming Tutorial**: Search "Ryan Laley UE5 level streaming" on YouTube. Clear, step-by-step walkthrough of sub-levels and streaming volumes.
- **Gorka Games, Open World Streaming**: Search "Gorka Games UE5 World Partition" on YouTube. Practical setup guide for open-world projects.
- **Mathew Wadstein, WTF Is Level Streaming**: Search "Mathew Wadstein level streaming" on YouTube for a focused breakdown of the streaming system's Blueprint nodes and configuration options.
- **Unreal Fest Talks**: Search "Unreal Fest World Partition" for conference presentations from Epic engineers. These go deep into the technical implementation and real-world usage at scale.

## Community Resources

- **Unreal Engine Forums (Level Design)**: https://forums.unrealengine.com/ - search for "world partition" or "level streaming" for community discussions, troubleshooting, and project showcases
- **r/unrealengine**: https://www.reddit.com/r/unrealengine/ - frequent posts about streaming setup, World Partition issues, and HLOD configuration
- **UE5 Discord Communities**: Several active Discord servers (Unreal Slackers, Unreal Engine Community) have channels dedicated to level design and streaming architecture

## Related Topics

- **Navigation and Streaming**: https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-system-in-unreal-engine - NavMesh must be configured to work with streaming levels. Each sub-level can have its own NavMesh data that loads with it.
- **Render Targets**: https://dev.epicgames.com/documentation/en-us/unreal-engine/render-targets-in-unreal-engine - used for the fog of war system and tabletop camera capture
- **Performance Profiling**: https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-and-profiling-in-unreal-engine - use stat commands (stat levels, stat memory, stat streaming) to monitor streaming performance

## Case Studies and Examples

- **Fortnite's Open World**: Epic uses World Partition in Fortnite. Search "Fortnite World Partition GDC" for technical talks about their streaming architecture at massive scale.
- **The Matrix Awakens Demo**: Epic's tech demo for UE5 uses World Partition to stream a full city. Analyzing its level structure (available as a free download) teaches how professionals set up streaming for dense environments.
- **Lyra Starter Game**: Epic's official starter project includes examples of level management. Available on the Unreal Marketplace (free). Useful as a reference for how Epic structures their own projects.

## Fog of War Resources

- **Render Target Based Fog of War**: Search "UE5 fog of war render target" on YouTube for community tutorials that use the same technique described in this module: painting to a render target and using it as a material mask.
- **Real-Time Strategy Fog of War**: Search "UE5 RTS fog of war" for implementations from the real-time strategy game community, which frequently deal with exploration-based visibility.
- **Procedural Texture Painting**: https://dev.epicgames.com/documentation/en-us/unreal-engine/draw-material-to-render-target-in-unreal-engine - the Blueprint node used to paint onto render targets at runtime, essential for the fog of war texture updates.
