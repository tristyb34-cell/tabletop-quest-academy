# Module 06: Resources - The Camera and Controls

## Camera System Tutorials

### UE5 Third-Person Camera Setup (Official)
**https://docs.unrealengine.com/5.0/en-US/quick-start-guide-to-the-third-person-template-in-unreal-engine/**
The official third-person template walkthrough. Covers Spring Arm setup, Camera Component configuration, and basic character movement. This is the best starting point for understanding how third-person cameras work in Unreal.

### Spring Arm Component Reference
**https://docs.unrealengine.com/5.0/en-US/API/Runtime/Engine/GameFramework/USpringArmComponent/**
Full reference for all Spring Arm properties: arm length, collision probe, camera lag settings, offsets, and rotation inheritance. Bookmark this for when you need to look up specific property names.

### Ryan Laley's Camera Tutorials (YouTube)
**https://www.youtube.com/@RyanLaley**
Practical, hands-on tutorials covering camera setups in UE5. His videos on multiple camera modes and camera blending are directly relevant to building the tabletop-to-3D transition. Very beginner-friendly explanations.

### Player Camera Manager Reference
**https://docs.unrealengine.com/5.0/en-US/API/Runtime/Engine/Camera/APlayerCameraManager/**
Documentation for SetViewTargetWithBlend, camera modifiers, and the view target system. This is the engine system that manages which camera the player sees through and how transitions between cameras work.

---

## Enhanced Input System

### Official Enhanced Input Documentation
**https://docs.unrealengine.com/5.0/en-US/enhanced-input-in-unreal-engine/**
The primary reference for Input Actions, Mapping Contexts, Modifiers, and Triggers. Start here for understanding how the system works and how to set it up. Includes examples for both Blueprint and C++.

### Lyra Sample Project
**https://docs.unrealengine.com/5.0/en-US/lyra-sample-game-in-unreal-engine/**
Epic's official sample game demonstrates a production-quality Enhanced Input setup with multiple mapping contexts, gamepad support, and context-sensitive input switching. Download it and study the input configuration for best practices.

### Enhanced Input Migration Guide
**https://docs.unrealengine.com/5.0/en-US/enhanced-input-migration-guide-in-unreal-engine/**
Many older tutorials use the legacy input system. This guide explains how to translate old-style input bindings to the Enhanced Input System, which is useful when following tutorials that have not been updated yet.

---

## Camera Techniques

### Camera Shake Documentation
**https://docs.unrealengine.com/5.0/en-US/camera-shakes-in-unreal-engine/**
Reference for adding impact feedback through camera shake. Covers oscillation-based shakes and Perlin noise patterns. Useful for adding that satisfying punch when the miniature-to-character transformation completes.

### Sequencer for Cinematics
**https://docs.unrealengine.com/5.0/en-US/cinematics-and-movie-making-in-unreal-engine/**
Unreal's dedicated tool for crafting cinematic sequences. While the tabletop transition uses runtime Blueprints, Sequencer is the right tool for pre-authored cutscenes like boss introductions or story moments.

---

## Community

### Unreal Engine YouTube Channel
**https://www.youtube.com/@UnrealEngine**
Search for "Enhanced Input" and "Camera System" for official tutorial videos. The Inside Unreal livestream series covers both topics with live demonstrations.

### r/unrealengine (Reddit)
**https://www.reddit.com/r/unrealengine/**
Search for "camera mode switching," "enhanced input context," and "top-down camera" for community discussions and architecture patterns from developers who have built multi-camera systems.
