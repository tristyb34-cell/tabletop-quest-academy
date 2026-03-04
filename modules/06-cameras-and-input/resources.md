# Module 06: Resources - Cameras and Input

## Enhanced Input System

### Official Enhanced Input Documentation
**https://docs.unrealengine.com/5.0/en-US/enhanced-input-in-unreal-engine/**
The primary reference for the Enhanced Input System. Covers Input Actions, Mapping Contexts, Modifiers, Triggers, and the runtime API for adding/removing contexts. Start here for understanding the system architecture and API reference.

### Enhanced Input Migration Guide
**https://docs.unrealengine.com/5.0/en-US/enhanced-input-migration-guide-in-unreal-engine/**
If you encounter legacy input tutorials or code samples, this guide explains how to translate old-style input bindings to the Enhanced Input System. Useful for understanding how the two systems differ and why the new system is preferred.

### Lyra Input Setup (Sample Project)
**https://docs.unrealengine.com/5.0/en-US/lyra-sample-game-in-unreal-engine/**
Epic's Lyra sample project demonstrates a production-quality Enhanced Input setup with multiple mapping contexts, gamepad support, and context-sensitive input switching. Study the input configuration files and the player controller setup for best practices.

---

## Camera Tutorials

### UE5 Third-Person Camera Setup (Official Documentation)
**https://docs.unrealengine.com/5.0/en-US/quick-start-guide-to-the-third-person-template-in-unreal-engine/**
The official third-person template walkthrough. Covers Spring Arm setup, Camera Component configuration, and basic character movement. A good starting point if you are setting up a third-person camera for the first time.

### Spring Arm Component Reference
**https://docs.unrealengine.com/5.0/en-US/API/Runtime/Engine/GameFramework/USpringArmComponent/**
API reference for all Spring Arm properties: arm length, collision, lag, offset, and inheritance settings. Use this when you need to look up specific property names or default values.

### Player Camera Manager Reference
**https://docs.unrealengine.com/5.0/en-US/API/Runtime/Engine/Camera/APlayerCameraManager/**
API reference for the camera management system. Documents `SetViewTargetWithBlend`, camera modifiers, and the view target system. Essential for understanding how Unreal manages which camera the player sees through.

---

## Video Tutorials

### Unreal Engine YouTube Channel
**https://www.youtube.com/@UnrealEngine**
Search for "Enhanced Input" and "Camera System" for official tutorial videos. The Inside Unreal livestream series has covered both topics with hands-on demonstrations and Q&A with Epic engineers.

### Ryan Laley's UE5 Tutorials (YouTube)
**https://www.youtube.com/@RyanLaley**
Practical, project-based tutorials covering camera setups, input handling, and character controllers in UE5. His videos on multiple camera modes and camera blending are directly relevant to building a multi-mode camera system.

### Ali Elzoheiry's Camera Tutorials (YouTube)
**https://www.youtube.com/@AliElzoheiry**
Focused tutorials on advanced camera techniques in UE5, including spline-based camera rails, cinematic camera sequences, and dynamic camera switching. Good for the cinematic rail and dialogue camera implementations.

---

## Input Documentation

### Input Overview Documentation
**https://docs.unrealengine.com/5.0/en-US/input-overview-in-unreal-engine/**
High-level overview of how input flows from hardware through the engine to gameplay code. Covers the input stack, input modes (game-only, UI-only, game-and-UI), and focus management.

### Gamepad and Touch Input
**https://docs.unrealengine.com/5.0/en-US/input-devices-in-unreal-engine/**
Reference for supporting multiple input devices. Covers gamepad button mappings, touch input, and device detection. Useful when adding controller support alongside keyboard and mouse.

---

## Camera Techniques

### Camera Shake Documentation
**https://docs.unrealengine.com/5.0/en-US/camera-shakes-in-unreal-engine/**
Reference for the camera shake system. Covers oscillation-based shakes, pattern-based shakes (using Perlin noise), and how to trigger shakes from gameplay code. Includes guidance on creating impactful but non-nauseating shake effects.

### Sequencer for Cinematics
**https://docs.unrealengine.com/5.0/en-US/cinematics-and-movie-making-in-unreal-engine/**
While our cinematic camera uses runtime spline following, Sequencer is Unreal's dedicated tool for pre-authored cinematic sequences. Understanding Sequencer helps with cutscenes, boss introductions, and story moments that require precise camera choreography with synchronised animations, audio, and effects.

---

## Advanced Topics

### Camera Collision and Occlusion
**https://docs.unrealengine.com/5.0/en-US/collision-in-unreal-engine/**
Deep dive into collision channels and traces. Understanding collision is essential for configuring the Spring Arm's probe channel, setting up camera-blocking volumes, and handling edge cases where the default collision behaviour is not sufficient (e.g., transparent walls that should not block the camera).

### Orthographic Projection for Isometric Games
Search the Unreal forums and community wikis for "orthographic camera UE5" for discussions on setting up true isometric views. Topics include ortho width calculation, maintaining consistent world-space scale, and handling click-to-world projection in orthographic mode (which differs from perspective projection).

---

## Community Resources

### Unreal Source Discord
The Unreal Source community Discord has channels dedicated to camera systems and input handling. Experienced developers discuss architecture patterns, share solutions, and troubleshoot specific issues.

### r/unrealengine (Reddit)
Search for "camera mode switching," "enhanced input context," and "isometric camera" for community discussions. Many developers share their multi-camera architectures and lessons learned from shipping games with complex camera systems.

---

## Recommended Study Order

1. Start with the official Enhanced Input documentation to understand the conceptual model
2. Study the Lyra sample project's input setup for production patterns
3. Follow the third-person template guide for basic Spring Arm and Camera setup
4. Watch Ryan Laley's camera tutorials for multi-mode camera implementation
5. Read the Player Camera Manager reference for SetViewTargetWithBlend details
6. Study camera shake documentation for combat impact effects
7. Explore Sequencer documentation for cinematic sequences
8. Review collision documentation for advanced camera collision configuration
