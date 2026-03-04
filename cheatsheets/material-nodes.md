# Material Editor Nodes Quick Reference

Dense reference for UE5 Material Editor nodes, common setups, and practical patterns. Organized by category for fast lookup.

---

## PBR Output Pins

Every material has these main output pins. Understanding what they expect is critical.

| Output | Range | What It Controls |
|--------|-------|-----------------|
| **Base Color** | RGB 0-1 | Surface color. No lighting info, just the raw albedo. Keep values between 0.02 and 0.95 for physically accurate results. |
| **Metallic** | 0 or 1 | Binary in practice. 0 = non-metal (wood, skin, plastic). 1 = metal (steel, gold, chrome). Values in between look wrong. |
| **Roughness** | 0-1 | 0 = mirror-smooth (chrome). 1 = fully rough (chalk). Most real materials fall between 0.3 and 0.8. |
| **Normal** | RGB tangent-space | Adds surface detail without geometry. Plug in a normal map texture. |
| **Emissive Color** | RGB, can exceed 1 | Makes the surface glow. Values above 1 bloom with post-processing. Used for neon, lava, screens. |
| **Opacity** | 0-1 | Only active with Translucent or Masked blend mode. 0 = invisible, 1 = fully visible. |
| **Opacity Mask** | 0 or 1 | For Masked blend mode. Below threshold = invisible, above = visible. Used for foliage, fences, decals. |
| **Ambient Occlusion** | 0-1 | Darkens crevices. 1 = no occlusion, 0 = fully occluded. Usually driven by an AO texture. |
| **World Position Offset** | XYZ vector | Moves vertices in world space. Used for wind animation, procedural movement. |
| **Subsurface Color** | RGB | For Subsurface shading model. Color of light that passes through the material (skin, wax, leaves). |

---

## Texture Nodes

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Texture Sample** | Reads a pixel from a texture at given UV coordinates. The most-used node. | Apply a diffuse, normal, or roughness map. |
| **Texture Coordinate (TexCoord)** | Outputs UV coordinates. U/V tiling and offset parameters. | Scale a texture: set UTiling=2, VTiling=2 to tile twice. |
| **Panner** | Scrolls UV coordinates over time. Speed U/V inputs. | Scrolling water surface, moving clouds, conveyor belt texture. |
| **Rotator** | Rotates UV coordinates over time or by a fixed angle. | Spinning radar sweep, rotating hologram pattern. |
| **Texture Object** | References a texture without sampling it. Used as input to functions. | Pass a texture into a Material Function or custom node. |
| **Texture Sample Parameter2D** | Same as Texture Sample but exposed as a parameter. | Allow Blueprint to swap textures at runtime via Material Instance. |
| **World Aligned Texture** | Projects texture based on world position, not UVs. | Apply texture to terrain or objects without UV mapping. |

---

## Math Nodes

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Add** | A + B. Works on scalars and vectors. | Combine two textures additively (use carefully, can blow out values). |
| **Multiply** | A * B. The workhorse of material math. | Tint a texture by a color. Multiply albedo by a mask. Darken with values < 1. |
| **Lerp (LinearInterpolate)** | Blends A and B by Alpha (0=A, 1=B). Critical for crossfades. | Blend two textures using a mask. Transition between materials. |
| **Power** | Base^Exponent. Adjusts falloff curves. | Sharpen a Fresnel edge (Power of 4 = tighter rim). Control gradient sharpness. |
| **Clamp** | Constrains value between Min and Max. | Prevent negative values or values above 1 after math operations. |
| **Saturate** | Clamps to 0-1 range. Free on GPU (no instruction cost). | Preferred over Clamp(0,1) because it costs nothing. |
| **OneMinus** | 1 - X. Inverts a value. | Invert a mask (white becomes black, black becomes white). |
| **Abs** | Absolute value. Removes negatives. | Ensure a dot product result is always positive. |
| **Ceil** | Rounds up to nearest integer. | Posterize effect (stepped gradients). |
| **Floor** | Rounds down to nearest integer. | Create pixel-art style stepped UVs. |
| **Frac** | Fractional part (removes integer). | Create repeating sawtooth patterns. |
| **Fmod** | Floating-point modulo. | Wrap values, create repeating patterns with specific frequency. |
| **Divide** | A / B. | Normalize values, scale down. |
| **Min / Max** | Returns the smaller or larger value. | Constrain one side only (Max(x, 0) keeps positive). |
| **Dot Product** | Measures alignment of two vectors (-1 to 1). | Fresnel-like effects, directional masks, facing ratio. |
| **Normalize** | Scales vector to unit length. | Required after combining or modifying normal vectors. |
| **AppendVector** | Combines components. Append scalar to vector2 to make vector3. | Build an RGB color from separate R, G, B channels. |
| **ComponentMask** | Extracts specific channels (R, G, B, A checkboxes). | Pull the red channel from a packed texture. Separate RGB from Alpha. |
| **SmoothStep** | S-curve interpolation between min and max. | Softer transitions than a linear lerp. Gradient with smooth falloff. |
| **Step** | Returns 0 if value < threshold, 1 if >=. Hard cutoff. | Sharp mask edges, toon shading thresholds. |

---

## Color Nodes

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Desaturation** | Removes color saturation by a fraction (0=color, 1=grayscale). | Desaturate a texture for a "drained" or stone look. |
| **ConstantBiasScale** | Applies (Input * Scale) + Bias. Common for normal map unpacking. | Convert 0-1 range to -1 to 1 range for custom normal maps. |
| **AppendVector** | Combines smaller vectors into larger ones. | Merge R and G into RG, or RGB and A into RGBA. |
| **ComponentMask** | Isolates specific channels. | Extract just the Red channel from an RGBA texture. |
| **BreakOutFloat2/3/4Components** | Separates a vector into individual floats. | Get X, Y, Z from a world position for per-axis math. |
| **Constant3Vector** | A constant RGB color value. | Set a flat base color (click to open color picker). |
| **VectorParameter** | Exposed RGB(A) color parameter. | Let Blueprint change material color at runtime. |
| **HueShift** | Rotates hue by an amount (0-1 = full rotation). | Color variety from a single texture. Team colors. |

---

## Parameters

Parameters turn constants into variables that can be changed per Material Instance or from Blueprint/C++.

| Node | Type | Use Case |
|------|------|----------|
| **ScalarParameter** | Float | Control roughness, opacity, blend amount, emission intensity. |
| **VectorParameter** | Float4 (RGBA) | Control colors, tint, UV offset packed into RGBA. |
| **Texture Parameter (Texture2D)** | Texture reference | Swap textures per instance (different skins from same material). |
| **StaticSwitchParameter** | Bool (compile-time) | Toggle features on/off per instance. Creates shader permutations, so use sparingly. |
| **StaticBool** | Bool (compile-time) | Same as StaticSwitch but used inside Material Functions. |

**Naming convention:** Use clear, descriptive names. Group with prefixes: `Base_Color`, `Base_Roughness`, `Detail_Normal`, `Emissive_Intensity`.

**Material Instances:** Right-click a material, "Create Material Instance". Override only the parameters you need. Much cheaper than duplicating the whole material. Instances share the compiled shader.

---

## Material Parameter Collections (MPC)

A shared data container that any material can read. Perfect for global parameters.

### Setup

1. **Create MPC:** Content Browser, right-click, Materials, Material Parameter Collection
2. **Add parameters:** Scalar or Vector, give them names (e.g., `TransitionAlpha`, `WindDirection`)
3. **Read in material:** Use `CollectionParameter` node, select the MPC and parameter name
4. **Set from Blueprint/C++:**

```cpp
// C++
UMaterialParameterCollection* MPC = LoadObject<UMaterialParameterCollection>(nullptr, TEXT("/Game/Materials/MPC_Global"));
UKismetMaterialLibrary::SetScalarParameterValue(GetWorld(), MPC, FName("TransitionAlpha"), 0.75f);
UKismetMaterialLibrary::SetVectorParameterValue(GetWorld(), MPC, FName("TintColor"), FLinearColor::Red);
```

In Blueprint: `Set Scalar Parameter Value` / `Set Vector Parameter Value` nodes, select the MPC asset.

**Key advantage:** Changes apply to ALL materials reading that MPC instantly. No need to find and update individual Material Instances.

---

## Utility Nodes

| Node | What It Does | Common Use Case |
|------|-------------|-----------------|
| **Time** | Returns game time in seconds (continuously increasing). | Drive Panner, Rotator, sine wave animations. |
| **Sine / Cosine** | Trig functions. With Time input, creates oscillation. | Pulsing glow, bobbing movement, wave patterns. |
| **If (StaticSwitch)** | Compile-time branch. A > B uses one path, otherwise the other. | Feature toggle (use normal map or flat). Creates permutations. |
| **DynamicBranch** | Runtime if/else without shader permutations. Slightly more expensive per-pixel. | Toggle at runtime without recompiling. |
| **SphereMask** | Returns 1 inside a sphere, 0 outside, with a soft falloff. Inputs: position, center, radius, hardness. | Localized effects: snow melting around a fire, paint splat. |
| **Distance** | Returns distance between two points. | Proximity-based effects. Fade objects near camera. |
| **WorldPosition** | Current pixel's world-space position. | Tri-planar mapping, world-space effects, distance calculations. |
| **ActorPosition** | World position of the actor using this material. | Effects relative to the object center (radial gradient from center). |
| **CameraPosition** | World position of the active camera. | Distance-to-camera for LOD blending, detail fade. |
| **ObjectRadius** | Bounding sphere radius of the object. | Scale effects relative to object size. |
| **PixelNormalWS** | World-space normal of the current pixel. | Snow on top of objects (dot with UpVector), directional weathering. |
| **VertexNormalWS** | World-space vertex normal (cheaper, lower quality than pixel). | Simpler directional effects when per-pixel accuracy is not needed. |
| **Fresnel** | Rim lighting based on view angle. Higher values at glancing angles. | Rim glow, edge highlight, force field effect. |
| **Noise** | Procedural noise (Perlin, Simplex, etc.). | Organic variation, procedural textures, terrain blending. |
| **CustomExpression** | Write raw HLSL code. | Anything not available as a node. Use sparingly for maintainability. |

---

## Common Material Setups

### Basic PBR Material

```
TextureSample (Diffuse) --> Base Color
TextureSample (Normal)  --> Normal
TextureSample (ORM)     --> ComponentMask:
                            R --> Ambient Occlusion
                            G --> Roughness
                            B --> Metallic
```

ORM (Occlusion/Roughness/Metallic) is a common packed texture format. One texture, three channels, three material properties.

### Glass / Transparent Material

- Blend Mode: **Translucent**
- Lighting Mode: **Surface ForwardShading** (for accurate reflections)
- Base Color: slight tint (e.g., 0.9, 0.95, 1.0 for blue glass)
- Metallic: 0
- Roughness: 0 to 0.1 (smooth glass)
- Opacity: 0.1 to 0.3 (mostly see-through)
- Enable **Screen Space Reflections** in material settings for realism
- For frosted glass: increase Roughness to 0.3-0.5

### Emissive Glow

```
TextureSample (EmissiveMask) --> Multiply --> Emissive Color
ScalarParameter (Intensity)  --^
VectorParameter (GlowColor)  --^  (chain: Mask * Color * Intensity)
```

- Intensity values above 1 trigger bloom (if post-process bloom is enabled)
- Values of 5-20 give a strong glow. 50+ is blinding.
- Use a mask texture to control which parts glow.

### Distance Fade

```
CameraPosition -----> Distance ----> Divide (by FadeDistance) ----> Clamp(0,1) ----> Opacity
PixelWorldPosition -^
```

- Blend Mode: **Translucent** or **Masked**
- Objects fade out as the camera gets closer or farther.
- For Masked mode, feed into Opacity Mask and set the clip threshold.

### World-Aligned Texture (No UV Needed)

```
WorldPosition --> Divide (by TextureScale) --> TextureCoordinate input of TextureSample
```

- Use the built-in **WorldAlignedTexture** node for tri-planar projection (projects on XY, XZ, YZ planes and blends).
- Great for terrain, procedural objects, or anything without proper UVs.

---

## Game-Specific: Miniature-to-Realistic Crossfade

This is the core visual transition for tabletop pieces shifting between miniature paint style and realistic rendering.

### Setup

1. **Material Parameter Collection** (`MPC_GameTransition`):
   - `TransitionAlpha` (Scalar, 0 to 1). 0 = miniature. 1 = realistic.

2. **Material graph:**
```
TextureSample (MiniatureTexture)  --> Lerp (A) --> Base Color
TextureSample (RealisticTexture)  --> Lerp (B) --^
CollectionParameter (TransitionAlpha) --> Lerp (Alpha) --^

// Same pattern for roughness:
ScalarParameter (MiniatureRoughness, default 0.8)  --> Lerp (A) --> Roughness
ScalarParameter (RealisticRoughness, default 0.4)  --> Lerp (B) --^
CollectionParameter (TransitionAlpha) --> Lerp (Alpha) --^

// Same for normal intensity:
FlatNormal (0,0,1)           --> Lerp (A) --> Normal
TextureSample (NormalMap)     --> Lerp (B) --^
CollectionParameter (TransitionAlpha) --> Lerp (Alpha) --^
```

3. **Drive from Blueprint/C++:**
```cpp
// Smooth transition over time (e.g., in Tick or Timeline callback)
float Alpha = FMath::FInterpTo(CurrentAlpha, TargetAlpha, DeltaTime, TransitionSpeed);
UKismetMaterialLibrary::SetScalarParameterValue(GetWorld(), MPC_GameTransition, "TransitionAlpha", Alpha);
```

**Why MPC:** Every material instance in the scene reads the same `TransitionAlpha` value. One call updates all objects simultaneously. No need to iterate over actors and set individual parameters.

**Miniature look tips:**
- Higher roughness (0.7-0.9) for that painted-plastic feel
- Slightly exaggerated colors (multiply base color by 1.1-1.2)
- Reduced or no normal map (flat shading reads as miniature)
- Optional: subtle rim highlight (Fresnel * faint color) to mimic tabletop display lighting

---

## Render-to-Texture: SceneCapture2D

Captures a scene view into a Render Target texture, which can be applied to any material.

### Setup Steps

1. **Create a Render Target:**
   - Content Browser, right-click, Materials and Textures, Render Target
   - Set resolution (e.g., 512x512 or 1024x1024)
   - Set format (RTF_RGBA8 for color, RTF_R16f for depth/single channel)

2. **Place a SceneCapture2D actor:**
   - Add to the level or spawn at runtime
   - In details, set Texture Target to your Render Target asset
   - Configure Capture Source: SceneColor (default), FinalColor (with post-processing), etc.
   - Set Capture Every Frame or trigger manually with `CaptureScene()`

3. **Use Render Target in a material:**
   - Add a Texture Sample node
   - Set the texture to your Render Target asset
   - Wire to Base Color (or Emissive for screens/monitors)

4. **Apply the material to a mesh:**
   - A plane for a security monitor, a curved surface for a crystal ball, etc.

### Blueprint Control

```cpp
// Manual capture (more performant than every-frame)
SceneCaptureComponent->CaptureScene();

// Change render target at runtime
SceneCaptureComponent->TextureTarget = NewRenderTarget;

// Adjust capture settings
SceneCaptureComponent->ShowOnlyActors.Add(TargetActor);  // Only capture specific actors
SceneCaptureComponent->bCaptureEveryFrame = false;         // Manual trigger only
SceneCaptureComponent->bCaptureOnMovement = false;
```

### Use Cases

- **Minimap:** Top-down SceneCapture2D renders to a UI material
- **Security cameras:** SceneCapture at camera location, display on in-world monitor mesh
- **Magic mirror / scrying pool:** Capture a distant scene, display on a reflective surface
- **Portrait rendering:** Capture a character in an isolated scene for inventory/UI display

### Performance Notes

- Each SceneCapture re-renders the scene (or part of it). This is expensive.
- Lower the resolution of the Render Target to save performance (256x256 is often enough for small displays).
- Use `bCaptureEveryFrame = false` and trigger `CaptureScene()` only when needed.
- Use Show Only / Hidden Actors lists to limit what gets rendered.
- For the tabletop game: capture the board from above for a minimap, update once per turn rather than every frame.

---

## Material Blend Modes Reference

| Mode | What It Does | When to Use |
|------|-------------|-------------|
| **Opaque** | Fully solid, no transparency. Default and most performant. | Most objects: walls, characters, props. |
| **Masked** | Binary: fully visible or fully invisible per pixel. Uses Opacity Mask. | Foliage, fences, decals with hard edges. |
| **Translucent** | Per-pixel transparency via Opacity. More expensive. | Glass, water, holograms, particles. |
| **Additive** | Adds color to what is behind it. No occlusion. | Glow effects, fire, energy beams. |
| **Modulate** | Multiplies with what is behind it. Darkens. | Shadow decals, dirt overlays. |

---

## Material Shading Models

| Model | What It Does | When to Use |
|-------|-------------|-------------|
| **Default Lit** | Standard PBR. Responds to all lights. | Almost everything. |
| **Unlit** | No lighting calculations. Only Emissive output. | UI elements, skyboxes, custom lighting in shader. |
| **Subsurface** | Light passes through the surface. | Skin, wax, leaves, thin cloth. |
| **Subsurface Profile** | More accurate subsurface scattering with a profile asset. | High-quality skin rendering. |
| **Clear Coat** | Two-layer: base surface + clear coat on top. | Car paint, lacquered wood, coated metal. |
| **Two Sided Foliage** | Backface gets subsurface-style lighting. | Leaves, thin fabric, flower petals. |
| **Eye** | Specialized for realistic eye rendering. | Character eyes (if going for realism). |

---

## Tips and Gotchas

- **Saturate is free.** Use it instead of Clamp(0,1) whenever possible.
- **Static switches create shader permutations.** Each combination compiles a separate shader. 10 switches = up to 1024 permutations. Use sparingly.
- **Material Instances are cheap.** Always use instances instead of duplicating the parent material. Hundreds of instances sharing one parent is normal.
- **Texture compression matters.** Use BC5 for normal maps, BC7 for color, BC4 for single-channel masks. Check texture settings if things look wrong.
- **Packed textures save samplers.** Pack Occlusion, Roughness, and Metallic into one texture's R, G, B channels. GPU texture samplers are limited (usually 16 per material).
- **Preview with correct lighting.** The material editor preview sphere is lit differently from your scene. Always verify materials in-level.
- **Named Reroute nodes** keep complex graphs readable. Right-click a wire, "Add Reroute Node", then name it.
