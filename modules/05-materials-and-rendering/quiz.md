# Module 05: Quiz - Materials and Rendering

Test your understanding of materials, PBR, and rendering techniques. Try to answer each question before checking the answer.

---

### Question 1
What are the four core PBR channels in Unreal Engine, and what does each one describe about a surface?

<details>
<summary>Answer</summary>

1. **Base Colour (Albedo):** The raw colour of the surface with no lighting information baked in. It represents what colour the surface is under perfectly neutral, flat lighting.

2. **Normal Map:** A texture that encodes surface direction per pixel, faking geometric detail (bumps, scratches, grooves) without adding actual polygons. The renderer uses it to calculate how light bounces off the surface at each point.

3. **Roughness:** A 0-to-1 value describing how smooth or rough the surface is. 0 is mirror-smooth (tight, clear reflections), and 1 is completely matte (scattered, diffuse highlights). Most real-world materials are between 0.3 and 0.8.

4. **Metallic:** A mostly binary value (0 or 1) that tells the renderer whether the surface is a metal or a non-metal. Metals tint their reflections with their base colour and have no diffuse component. Non-metals reflect white light and have a visible diffuse colour.
</details>

---

### Question 2
What is the difference between a Material, a Material Instance, and a Dynamic Material Instance? When would you use each?

<details>
<summary>Answer</summary>

A **Material** is the parent shader definition. It contains the full node graph that defines how the surface renders. Changing a Material requires recompilation, which can take seconds to minutes. Use it to define the base rendering logic (how textures combine, what effects apply, what channels are used).

A **Material Instance** is an asset that inherits from a parent Material but overrides specific parameter values without recompilation. Changes are instant. Use it for creating variations of the same material: different colour tints, different textures, different roughness values. Examples: oak wood vs birch wood, steel armour vs gold armour.

A **Dynamic Material Instance** (DMI) is created at runtime via C++ or Blueprints. It also overrides parameters from a parent Material, but it can be updated every frame during gameplay. Use it for real-time material changes: flashing a character red when hit, fading opacity during a stealth ability, animating the TransitionAlpha for the miniature-to-character crossfade. DMIs have a small performance cost per instance, so avoid creating thousands of them.
</details>

---

### Question 3
How does a Scene Capture 2D component work, and what are the key performance concerns when using one?

<details>
<summary>Answer</summary>

A Scene Capture 2D renders the scene from its viewpoint into a Render Target texture instead of the screen. It functions like a second camera that outputs to a texture asset. Any material can then sample this Render Target texture to display the captured view on a surface (like a tabletop map, a security camera monitor, or a magic mirror).

Performance concerns:
- **Cost:** Each Scene Capture essentially renders the scene an additional time. Two captures double the rendering workload (roughly).
- **Resolution:** Higher Render Target resolutions increase GPU memory and fill-rate cost. Use the minimum resolution that looks acceptable (often 1024x1024 or even 512x512).
- **Capture frequency:** Capturing every frame is expensive. Reduce to every 2-5 frames, or capture on demand (only when the scene changes).
- **Feature reduction:** Disable expensive features on the capture: shadows, post-processing, anti-aliasing, reflections. These are less noticeable on a small in-game surface.
- **Actor filtering:** Use ShowOnly or Hidden Actors lists to exclude irrelevant objects from the capture, reducing draw calls.
</details>

---

### Question 4
Explain how the miniature-to-character crossfade material works. What node setup drives the transition, and how is it controlled globally?

<details>
<summary>Answer</summary>

The crossfade material uses Lerp (Linear Interpolation) nodes to blend between two complete material setups: a painted miniature look and a realistic PBR look. Each PBR channel (Base Colour, Roughness, Metallic, Normal) has its own Lerp node with input A being the miniature version, input B being the realistic version, and the Alpha being a shared TransitionAlpha parameter.

At TransitionAlpha = 0, the output is 100% miniature (matte, painted, stylised). At TransitionAlpha = 1, the output is 100% realistic (detailed PBR). Values in between produce a smooth blend.

For global control, the TransitionAlpha reads from a Material Parameter Collection (MPC) rather than a per-instance parameter. The MPC acts as a shared variable that all materials in the scene can access. When the camera system updates the MPC's TransitionProgress value, every character material in the scene transitions simultaneously. This is driven by the camera's position: as it moves from the tabletop overview to the 3D world close-up, it maps that distance to a 0-1 range and writes it to the MPC.
</details>

---

### Question 5
What is Nanite, and what types of meshes can and cannot use it?

<details>
<summary>Answer</summary>

Nanite is UE5's virtualised geometry system that automatically handles Level of Detail (LOD) for high-polygon meshes. It breaks meshes into clusters of triangles and streams only the clusters that contribute to visible pixels at the current camera distance and angle. This means you can use meshes with millions of polygons without manually creating LOD levels, and the GPU only processes what matters.

**Can use Nanite:**
- Static meshes (non-animated geometry)
- Opaque materials
- Masked materials (alpha cutout)
- High-detail environment assets: architecture, terrain, props, rocks, furniture

**Cannot use Nanite (or have limited support):**
- Skeletal meshes (animated characters, creatures). Limited support was introduced in later UE5 versions but is not fully production-ready for all use cases.
- Translucent materials (glass, water, ghosts)
- Materials using World Position Offset (vertex animation like waving flags or procedural foliage movement)
- Very simple meshes where the overhead of Nanite clustering outweighs the benefit
</details>

---

### Question 6
What is Lumen, and how does it differ from traditional baked lightmaps?

<details>
<summary>Answer</summary>

Lumen is UE5's fully dynamic global illumination and reflection system. It calculates indirect lighting (light bouncing off surfaces) and reflections in real time, every frame. Light sources can be moved, colours can change, and objects can be added or removed, and the lighting updates automatically.

Traditional baked lightmaps pre-calculate indirect lighting offline and store the results in textures applied to static geometry. This produces high-quality results but is completely static: moving a light or an object requires re-baking, which can take minutes to hours for large scenes. Baked lighting also requires UV lightmap channels on every mesh and consumes significant texture memory.

Key differences:
- **Iteration speed:** Lumen gives instant feedback when adjusting lights. Baking requires waiting.
- **Dynamic scenes:** Lumen handles moving lights, destructible environments, and time-of-day cycles. Baked lightmaps cannot.
- **Performance cost:** Lumen has a real-time GPU cost. Baked lightmaps are essentially free at runtime (the cost is pre-paid during baking).
- **Quality:** Baked lightmaps can achieve higher precision for static scenes. Lumen may have subtle noise or artifacts in some lighting conditions.
- **Memory:** Baked lightmaps consume texture memory on disk and in GPU memory. Lumen uses GPU computation instead.
</details>

---

### Question 7
What is a Material Parameter Collection, and why is it more appropriate than individual material parameters for the tabletop transition effect?

<details>
<summary>Answer</summary>

A Material Parameter Collection (MPC) is a shared data asset that stores scalar and vector parameters accessible by any material in the scene. When you update an MPC parameter value, every material that references it sees the change immediately, in the same frame.

For the tabletop transition, an MPC is more appropriate than individual parameters because:

1. **Synchronisation:** All characters, props, and environmental materials need to transition at the same time. An MPC ensures they all read the same TransitionProgress value. With individual parameters, you would need to find and update every Dynamic Material Instance on every actor, risking desynchronisation.

2. **Simplicity:** One line of code updates the MPC. Without an MPC, you would need to iterate through every actor, get every mesh component, get every material, cast to a dynamic instance, and set the parameter. That is fragile and error-prone.

3. **Performance:** MPCs are updated once per frame on the GPU side. Updating dozens of individual Dynamic Material Instances has a small CPU overhead for each SetScalarParameterValue call.

4. **Decoupling:** The camera system (which drives the transition) does not need to know about materials or actors. It simply writes to the MPC. Materials read from the MPC. Neither system depends on the other.
</details>

---

### Question 8
Describe two strategies for improving the performance of a Scene Capture 2D used for a live tabletop map.

<details>
<summary>Answer</summary>

**Strategy 1: Reduce capture frequency.** Instead of capturing every frame (60 captures per second), set `bCaptureEveryFrame` to false and manually trigger `CaptureScene()` on a timer at a lower rate, such as every 0.1 seconds (10fps) or even every 0.5 seconds (2fps). For a tabletop map showing a bird's eye view, the slight delay in updates is barely noticeable, but the GPU savings are substantial since you are rendering the scene from the capture camera 50-58 fewer times per second.

**Strategy 2: Use ShowOnly or Hidden Actors lists.** Instead of capturing the entire scene (including distant terrain, sky, particles, and debug visualisations), explicitly list only the actors that should appear on the tabletop map. This dramatically reduces draw calls, shadow calculations, and material evaluations for the capture pass. For a tabletop map, you typically only need the terrain/floor, walls, and character tokens, not the full scene with all its detail.

Other valid strategies include: reducing the Render Target resolution, disabling shadows and post-processing on the capture component, using a simpler rendering path (no reflections, no volumetric fog), and only capturing when the scene actually changes (event-driven rather than timer-driven).
</details>

---

### Question 9
How would you set up post-processing to create different visual moods for the tabletop scene (warm, cosy) versus a dungeon scene (cold, dramatic)?

<details>
<summary>Answer</summary>

Create two Post Process Volumes (or Post Process Components), each configured for its respective mood:

**Tabletop Post Process:**
- Colour grading: warm white balance (shift toward orange/yellow), slightly elevated shadows (not too dark)
- Bloom: low intensity, large size (soft glow from candles and lamps)
- Vignette: moderate intensity (darkened edges, focus drawn to the table centre)
- Depth of field: shallow, focused on the table surface (background slightly blurred)
- Ambient occlusion: subtle (soft shadows in corners of books and dice)

**Dungeon Post Process:**
- Colour grading: cool white balance (shift toward blue/grey), crushed shadows (deep blacks)
- Bloom: higher intensity on bright sources (torches create visible light halos)
- Contrast: elevated (dramatic light/dark separation)
- Film grain: subtle (adds grit and atmosphere)
- Auto exposure: lower maximum brightness (dungeons should feel dark overall)

For transitioning between them, use blend weights. Set one volume's weight to 1.0 and the other to 0.0, then animate the weights over a duration (e.g., 1-2 seconds) using a timeline or lerp. Alternatively, use Unreal's Post Process Volume blending with overlapping volumes and priority settings, so walking from one area to another naturally transitions the mood.
</details>

---

### Question 10
You want to create a magical rune on the floor that glows blue and pulses in intensity. What material setup would you use, and how would you animate the glow at runtime?

<details>
<summary>Answer</summary>

**Material setup (M_MagicRune):**
1. Base Colour: dark stone texture for the floor surface
2. Roughness: high (0.8) for the stone, lower (0.3) for the rune grooves
3. Metallic: 0 (stone is non-metallic)
4. Emissive Colour: sample a rune pattern texture (white rune on black background), multiply by a **Vector Parameter** "RuneColor" (default: blue) and a **Scalar Parameter** "EmissiveIntensity" (default: 5.0)
5. Normal: stone surface detail with the rune carved grooves

The key is the Emissive channel. Emissive surfaces emit light in the scene (especially with Lumen) and appear to glow on screen. The brightness is controlled by the EmissiveIntensity multiplier.

**Runtime animation:**
1. Create a Dynamic Material Instance from the parent material in BeginPlay
2. Use a Timeline component (in Blueprint) or a sine wave calculation (in C++) to oscillate EmissiveIntensity between a minimum (2.0) and maximum (10.0) value over time
3. Each tick or timeline update, call `DynMaterial->SetScalarParameterValue("EmissiveIntensity", NewValue)`

```cpp
// C++ pulse example
float Time = GetWorld()->GetTimeSeconds();
float PulseValue = FMath::Sin(Time * 2.0f) * 0.5f + 0.5f; // 0 to 1 oscillation
float Intensity = FMath::Lerp(2.0f, 10.0f, PulseValue);
DynMaterial->SetScalarParameterValue("EmissiveIntensity", Intensity);
```

With Lumen enabled, the pulsing emissive rune will actually cast pulsing blue light onto nearby surfaces, enhancing the magical effect significantly.
</details>
