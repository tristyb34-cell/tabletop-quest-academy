# Module 05: Materials, Rendering, and the Tabletop Transition Effect

## Why This Module Matters

Your game lives in two visual worlds. In one, players see painted miniatures standing on a physical tabletop with dice, character sheets, and a DM screen. In the other, those miniatures come alive as fully realised 3D characters in a rich fantasy environment. The bridge between these two worlds is built entirely with materials, rendering techniques, and clever camera tricks.

Think of materials as the skin of every object in your game. A wooden table, a steel sword, a glowing magical rune: they all use the same underlying material system, just configured differently. Mastering this system lets you control not just how things look, but how they transition between your tabletop aesthetic and your immersive 3D world.

---

## PBR Basics: The Physics of Looking Real

Unreal Engine uses Physically Based Rendering (PBR), which means materials describe how light actually interacts with surfaces in the real world. Instead of painting fake highlights and shadows onto textures (the old way), you describe the physical properties of the surface and let the renderer calculate the lighting in real time.

Think of PBR like describing a material to someone who has never seen it: "It is rough like sandpaper, it is not metallic at all, and its base colour is dark brown." From that description alone, a PBR renderer can show you exactly what that material looks like under any lighting condition.

### The Core PBR Channels

**Base Colour (Albedo)**
The raw colour of the surface without any lighting. A brick wall's base colour is reddish-brown. A gold coin's base colour is yellow-orange. This texture should have no baked shadows or highlights in it. It is purely "what colour is this thing?"

Think of it as painting an object in a perfectly flat, shadowless environment. No dark corners, no bright spots. Just the pure colour.

**Normal Map**
A texture that fakes surface detail by bending the way light bounces off a flat polygon. Instead of modelling every tiny scratch, crack, and bump with actual geometry (which would be impossibly expensive), you encode the surface direction at each pixel in a purple-blue texture.

Think of it as a cheat sheet for light. The renderer looks at the normal map and says, "Ah, this pixel should behave as if the surface is tilted 30 degrees to the left," even though the actual geometry is perfectly flat. This creates the illusion of depth and detail at virtually no performance cost.

**Roughness**
How smooth or rough the surface is, on a scale from 0 (mirror-smooth) to 1 (completely matte). A polished marble floor is near 0. A dusty chalk surface is near 1. Most real-world materials fall between 0.3 and 0.8.

Think of roughness as "how scattered is the reflected light?" A smooth surface reflects light in a tight beam (you see a clear reflection). A rough surface scatters light in all directions (you see a diffuse, blurry highlight).

**Metallic**
A binary-ish value: either the material is metal (1.0) or it is not (0.0). There are very few materials in the real world that sit between these values (some edge cases with oxidation or layered coatings). Steel, gold, copper, and aluminium are metallic. Wood, stone, plastic, skin, and fabric are non-metallic.

Why does this matter? Metals reflect light differently than non-metals. Metals tint their reflections with their base colour (gold reflects golden light). Non-metals reflect white light regardless of their colour.

---

## The Material Editor

Unreal's Material Editor is a visual node graph where you connect inputs, operations, and textures to define how a surface looks. Instead of writing shader code directly (though you can), you drag nodes, connect wires, and see the result in real time on a preview sphere.

### Key Concepts

**Material Expressions (Nodes)**
Each node performs an operation: sample a texture, multiply two values, blend between colours, calculate a fresnel effect, read a parameter. You chain these together to build complex materials.

**Material Inputs**
The final output pins on the main material node:
- Base Colour
- Metallic
- Roughness
- Normal
- Emissive Colour (for glowing surfaces)
- Opacity (for transparent materials)
- World Position Offset (for vertex animation)

**Blend Modes**
- **Opaque:** Solid surface, no transparency. Used for most objects. Most performant.
- **Masked:** Fully opaque or fully transparent per-pixel (cutout). Used for foliage, chain-link fences, hair cards.
- **Translucent:** Variable transparency. Used for glass, water, ghosts. More expensive to render.

### A Simple PBR Material Setup

```
[Texture Sample: T_Wood_BaseColor] --> Base Color
[Texture Sample: T_Wood_Normal]    --> Normal
[Texture Sample: T_Wood_Roughness] --> Roughness
[Constant: 0.0]                    --> Metallic
```

This gives you a wooden surface. Four connections. That is the foundation of every material in the engine.

---

## Material Instances: Skins You Can Swap

A Material Instance is a child of a parent material that lets you change parameter values without recompiling the shader. This is one of the most important performance and workflow concepts in Unreal materials.

Think of it this way: the parent material is a cookie cutter (the shape, the recipe, the baking instructions). A Material Instance is a batch of cookies made with that cutter but with different frosting colours. You do not need to redesign the cutter for each colour; you just swap the frosting.

### Why Material Instances Matter

Compiling a material in Unreal can take seconds to minutes. If you have 50 wooden objects with slightly different wood tones, you do not want 50 separate materials that each require compilation. Instead, you create one "Wood" parent material with exposed parameters (colour tint, roughness multiplier, texture), then create 50 Material Instances that set those parameters to different values. Instant changes, zero compilation.

```
Parent Material: M_Wood
    Parameters:
        - BaseColorTint (Vector/Color, default: white)
        - RoughnessMultiplier (Scalar, default: 1.0)
        - WoodTexture (Texture2D, default: T_Oak)

Material Instances:
    MI_Wood_Oak      -> WoodTexture = T_Oak, Tint = warm brown
    MI_Wood_Birch    -> WoodTexture = T_Birch, Tint = pale yellow
    MI_Wood_Ebony    -> WoodTexture = T_Ebony, Tint = near black
    MI_Wood_Painted  -> WoodTexture = T_Oak, Tint = bright red, Roughness = 0.3
```

### Dynamic Material Instances

You can also create Material Instances at runtime in C++ or Blueprints. This is how you change material properties during gameplay: fading a character in/out, flashing red when hit, transitioning between miniature and realistic materials.

```cpp
UMaterialInstanceDynamic* DynMaterial = UMaterialInstanceDynamic::Create(ParentMaterial, this);
MeshComponent->SetMaterial(0, DynMaterial);

// Later, during gameplay:
DynMaterial->SetScalarParameterValue("TransitionAlpha", 0.5f);
DynMaterial->SetVectorParameterValue("EmissiveColor", FLinearColor::Red);
```

---

## Material Parameter Collections: Global Variables for Materials

A Material Parameter Collection (MPC) is a shared data container that all materials in the scene can read from. Change a value in the MPC, and every material referencing it updates instantly.

Think of an MPC as a radio broadcast. You set the frequency (parameter) at the station (MPC), and every radio (material) tuned to that station hears the update simultaneously.

### Use Cases for Our Game

- **Time of day:** A single "SunAngle" parameter drives colour temperature shifts across all outdoor materials
- **Tabletop transition:** A "TransitionProgress" parameter (0.0 to 1.0) controls the global crossfade between tabletop and 3D world. Every material in the scene reads this value and adjusts accordingly.
- **Weather intensity:** Rain wetness, snow accumulation, fog density: all driven by MPC parameters that affect every material at once
- **Combat mode:** A "CombatActive" parameter that subtly shifts the colour palette or adds vignetting to all materials during encounters

```cpp
// Setting an MPC value from C++
UMaterialParameterCollection* MPC = LoadObject<UMaterialParameterCollection>(
    nullptr, TEXT("/Game/Materials/MPC_Global"));
UKismetMaterialLibrary::SetScalarParameterValue(
    GetWorld(), MPC, "TransitionProgress", 0.75f);
```

---

## Render-to-Texture with Scene Capture 2D

This is the technical foundation of your tabletop map. A Scene Capture 2D component is essentially a virtual camera that renders its view to a texture instead of the screen. You can then apply that texture to any surface, including the tabletop.

### How the Tabletop Map Works

1. **Build the 3D world** as normal: terrain, buildings, trees, rivers, all in a sublevel or a hidden area of the map
2. **Place a Scene Capture 2D** above the 3D world, pointing straight down (orthographic or perspective, depending on the style you want)
3. **Create a Render Target texture** (e.g., 2048x2048 resolution)
4. **Assign the Render Target** as the Scene Capture's texture target
5. **Create a material** that samples the Render Target as its base colour
6. **Apply that material** to the tabletop surface (a flat plane on the physical table)

Now, the tabletop surface shows a live, top-down view of the 3D world. Characters moving in the 3D world appear as moving dots on the tabletop map. The DM can look down at the table and see the entire dungeon layout rendered in real time.

```
[Scene Capture 2D]
    |
    v (renders to)
[Render Target Texture: RT_TabletopMap]
    |
    v (sampled by)
[Material: M_TabletopSurface]
    |
    v (applied to)
[Static Mesh: SM_TableSurface]
```

### Performance Considerations

Scene Captures are expensive. Each one is essentially rendering the scene a second time. Mitigation strategies:

- **Reduce capture resolution:** 1024x1024 is often sufficient for a tabletop map
- **Lower capture framerate:** The tabletop does not need 60fps updates. Capture every 2-3 frames or even less
- **Use Show Only or Hidden Actors lists:** Only capture the relevant objects, not the entire scene
- **Disable features:** Turn off shadows, anti-aliasing, and post-processing on the Scene Capture for significant savings

```cpp
SceneCaptureComponent->CaptureSource = ESceneCaptureSource::SCS_FinalColorLDR;
SceneCaptureComponent->bCaptureEveryFrame = false;
SceneCaptureComponent->bCaptureOnMovement = false;
SceneCaptureComponent->CaptureScene(); // Manual capture when needed
```

---

## Nanite: Automatic LODs for Dense Meshes

Nanite is UE5's virtualised geometry system. It takes meshes with millions of polygons and automatically streams, clusters, and LODs them so the GPU only processes the triangles that actually contribute to pixels on screen.

Think of Nanite like a smart librarian. Instead of delivering the entire encyclopedia set to your desk (rendering all triangles), the librarian only brings the specific pages you are reading right now (the triangles visible on screen at the current zoom level). As you zoom in, the librarian swaps in higher-detail pages. Zoom out, and lower-detail pages replace them. You never notice the swaps.

### When to Use Nanite

- **Static meshes with high detail:** Architectural elements, terrain, props, environment assets
- **Dense environments:** Forests, cities, ruins with millions of polygons

### When NOT to Use Nanite

- **Skeletal meshes:** Nanite does not support animated meshes (as of UE 5.3+, limited support exists)
- **Translucent materials:** Nanite requires opaque or masked materials
- **World Position Offset:** Materials that move vertices are not compatible

### For Our Game

Nanite is perfect for the detailed tabletop environment (the table itself, books, dice, DM screen) and for the 3D world's static environment (dungeon walls, floor tiles, furniture, statues). Character meshes will use traditional LODs since they are skeletal meshes.

---

## Lumen: Real-Time Global Illumination

Lumen is UE5's dynamic global illumination and reflection system. It calculates how light bounces around the scene in real time, filling shadows with indirect light and creating accurate reflections without baking lightmaps.

Think of Lumen as upgrading from a single flashlight (direct light only) to a room full of mirrors and coloured walls (light bouncing everywhere, tinting surfaces with reflected colours). A red curtain casts a subtle red glow on the nearby wall. Light from a window fills the room with soft, natural illumination even in areas the sun does not directly reach.

### Why Lumen Matters for Our Game

- **The tabletop scene** needs warm, cosy lamp lighting with light bouncing off the wooden table, book pages, and character sheets
- **Dungeons** need dramatic lighting where a single torch illuminates a corridor and the light bounces off wet stone walls
- **Outdoor scenes** need natural, diffuse lighting with realistic sky illumination
- **The transition** between tabletop and 3D world involves a dramatic lighting shift that Lumen handles dynamically

### Lumen Settings Worth Knowing

- **Lumen Global Illumination:** Controls indirect lighting quality and distance
- **Lumen Reflections:** Controls reflection accuracy (screen-space vs ray-traced)
- **Final Gather Quality:** Higher values reduce noise in indirect lighting but cost more
- **Software Ray Tracing vs Hardware Ray Tracing:** Software works on all modern GPUs. Hardware requires RTX/RDNA2+ but is faster and higher quality.

---

## The Miniature-to-Character Crossfade

This is the signature visual effect of the game. When the camera zooms from the tabletop overview into the 3D world, the painted miniature figures crossfade into realistic, fully animated characters. Here is how to build it.

### The Approach: Lerp with TransitionAlpha

Create a material that blends between two complete material setups:

1. **Miniature look:** Stylised, painted appearance. Slightly desaturated, visible brush strokes, a matte finish with subtle specular on metallic parts. Think hand-painted Warhammer miniature.
2. **Realistic look:** Full PBR with detailed textures, proper roughness variation, subsurface scattering on skin, realistic metallic reflections.

A single scalar parameter, `TransitionAlpha`, controls the blend:
- `TransitionAlpha = 0.0`: Full miniature look
- `TransitionAlpha = 1.0`: Full realistic look
- Values in between: a smooth crossfade

```
// Material node graph (simplified)

[Texture: T_Miniature_BaseColor] --> A
[Texture: T_Realistic_BaseColor] --> B
[Parameter: TransitionAlpha]     --> Alpha
[Lerp(A, B, Alpha)]             --> Base Color

[Constant: 0.8]                 --> A (matte miniature)
[Texture: T_Realistic_Roughness] --> B
[Parameter: TransitionAlpha]      --> Alpha
[Lerp(A, B, Alpha)]              --> Roughness

[Constant: 0.0]                  --> A (non-metallic miniature)
[Texture: T_Realistic_Metallic]  --> B
[Parameter: TransitionAlpha]      --> Alpha
[Lerp(A, B, Alpha)]              --> Metallic
```

### Driving the Transition

The camera system (Module 06) drives the transition. As the camera moves from the tabletop overview position to the 3D world close-up position, it updates the `TransitionAlpha` parameter:

```cpp
void ACameraDirector::UpdateTransition(float CameraProgress)
{
    // CameraProgress: 0.0 = tabletop view, 1.0 = fully in 3D world
    float Alpha = FMath::SmoothStep(0.0f, 1.0f, CameraProgress);

    // Update via Material Parameter Collection (affects all characters at once)
    UKismetMaterialLibrary::SetScalarParameterValue(
        GetWorld(), GlobalMPC, "TransitionAlpha", Alpha);

    // Also update lighting, post-processing, audio crossfade, etc.
}
```

Using an MPC means every character in the scene transitions simultaneously. If you need individual characters to transition at different times (e.g., one by one as the camera passes over them), use Dynamic Material Instances on each character instead.

### Adding Polish

- **Scale transition:** Miniatures are small. Characters are human-sized. Animate the actor's scale alongside the material transition.
- **Animation transition:** Miniatures are static (or have a subtle idle wobble). Characters are fully animated. Blend the animation weight with TransitionAlpha.
- **Base removal:** Miniatures sit on circular bases. As TransitionAlpha increases, fade out the base mesh.
- **Particle dust:** Spawn a subtle particle effect (magical sparkles, dust motes) during the crossfade to mask any imperfections.

---

## Post-Processing for Mood Shifts

Post-processing volumes apply screen-wide effects that shift the mood of the entire scene. For our game, different contexts demand different atmospheres.

### Tabletop Scene
- Warm colour temperature (orange tint)
- Slight vignette (darker edges, drawing focus to the centre of the table)
- Low bloom (soft glow from candles and lamps)
- Depth of field focused on the table surface

### Dungeon Scene
- Cool colour temperature (blue-grey)
- High contrast
- Stronger bloom on light sources (torches, magical effects)
- Film grain for a gritty atmosphere

### Outdoor Scene
- Neutral colour temperature
- Auto-exposure for realistic brightness adaptation
- Atmospheric fog
- Chromatic aberration at the edges (subtle, cinematic feel)

### Combat Mode
- Slightly desaturated background
- Increased contrast on characters
- Subtle red tint on enemy highlights
- Depth of field focused on the active character

```cpp
// Blending between post-processing settings
void APostProcessManager::TransitionToMood(UPostProcessComponent* TargetPP, float Duration)
{
    // Use a timeline to lerp post-process blend weight
    // From: CurrentPP->BlendWeight = 1.0, TargetPP->BlendWeight = 0.0
    // To:   CurrentPP->BlendWeight = 0.0, TargetPP->BlendWeight = 1.0
}
```

Post-processing volumes can be bound to specific areas (dungeon entrance triggers the dungeon mood) or switched globally (combat mode activates regardless of location).

---

## Summary

| Concept | What It Does | Our Game Usage |
|---|---|---|
| PBR Materials | Physically accurate surface rendering | Every surface in the game |
| Material Instances | Parameter variants without recompilation | Different wood types, armour sets, weapon finishes |
| Material Parameter Collections | Global material variables | Transition progress, time of day, weather |
| Scene Capture 2D | Renders scene to a texture | Live tabletop map showing the 3D world |
| Nanite | Automatic geometry LODs | Detailed static environments |
| Lumen | Real-time global illumination | Dynamic lighting for all scenes |
| TransitionAlpha Crossfade | Blends miniature and realistic materials | The signature tabletop-to-3D effect |
| Post-Processing | Screen-wide mood effects | Atmosphere shifts between contexts |

Materials and rendering are where your game's visual identity lives. The tabletop-to-3D transition is not just a gimmick; it is the core promise of the experience. Getting this right means players feel the magic of watching their miniatures come to life every single time the camera pushes in.
