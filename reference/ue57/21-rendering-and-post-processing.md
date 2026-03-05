## Rendering and Post Processing

### Post Process Volume Settings

Post Process Volumes are placed in the level via **Place Actors > Volumes > Post Process Volume**. Settings are in the **Details** panel. Set **Infinite Extent (Unbound)** to apply globally, or use the volume bounds for localized effects. Priority and Blend Weight control multi-volume interactions.

> **In your games:**
> - **DnD RPG**: Use multiple Post Process Volumes. One global unbound volume for baseline settings, then localized volumes per dungeon biome: a cold blue-tinted volume for ice caves, a warm amber volume for fire dungeons, a sickly green volume for swamp areas. During the tabletop-to-dungeon zoom transition, blend between a clean "tabletop" volume and the atmospheric "dungeon" volume.
> - **Wizard's Chess**: One global unbound volume is usually enough since the entire scene shares the same mood. Add a second volume around the board for tighter control over reflections and DOF without affecting the background environment.

#### Bloom

- **Method**: Standard (default) or Convolution.
- **Intensity**: Overall bloom brightness multiplier. Default 0.675.
- **Threshold**: Minimum brightness to contribute to bloom. Default -1 (auto). Values above 0 set a hard threshold.
- **Size Scale**: Controls the spread of the bloom effect. Multiplier on default size.
- **Convolution**: Uses a convolution kernel (texture) for physically-based bloom shapes. Settings: Convolution Kernel (texture asset), Convolution Scale, Convolution Center (UV offset), Convolution Boost (min/max), Convolution Buffer Scale.
- **Standard Bloom** settings: 6 bloom layers, each with Size, Tint color. Bloom 1 through Bloom 6 control individual layers from small to large.

> **In your games:**
> - **DnD RPG**: Keep Bloom Intensity moderate (0.5-0.8). Too much bloom makes torchlit corridors look foggy rather than moody. Use a higher Threshold (0.5-1.0) so only truly bright sources bloom: torch flames, glowing runes, spell effects, enchanted weapon edges. This keeps the dark areas dark while bright magic pops.
> - **Wizard's Chess**: Bloom is key for the magical feel. Set Intensity to 0.8-1.0 and lower the Threshold so that piece glow effects and reflective board highlights bloom softly. Consider Convolution bloom with a custom kernel for cinematic starburst effects on bright specular highlights; it gives a more filmic look for screenshots and replays.

#### Depth of Field

- **Focal Distance**: Distance from camera to the focal plane (in world units).
- **Focal Region**: Size of the in-focus area around the focal distance.
- **Near Transition Region**: Size of the near blur transition (from sharp to blurry toward camera).
- **Far Transition Region**: Size of the far blur transition (from sharp to blurry away from camera).
- **Method**: Gaussian (faster, softer, good for gameplay) or Cinematic (physical bokeh, circle of confusion-based, better for film quality).
- **Cinematic DOF**: Aperture (F-stop), Diaphragm Blade Count, Min F-stop, Max Bokeh Size.
- **Gaussian DOF**: Near/Far Transition, Near/Far Blur Size.
- **Depth of Field Scale**: Global multiplier.

> **In your games:**
> - **DnD RPG**: Use Cinematic DOF sparingly. During gameplay, keep DOF subtle or off so players can see the dungeon clearly. Enable a stronger DOF for cutscenes, dialogue, and the zoom transition: focus on the miniature as it "comes alive" while blurring the tabletop background. A shallow Aperture (f/2.8) during the zoom gives a beautiful tilt-shift miniature effect.
> - **Wizard's Chess**: DOF is one of your strongest cinematic tools. Use Cinematic DOF with a low f-stop (f/2.0 to f/4.0) to focus on the active piece while blurring the rest of the board. During capture animations, rack focus from the attacking piece to the captured piece. Set Diaphragm Blade Count to 6 or 8 for pleasing hexagonal bokeh in the background highlights.

#### Exposure

- **Metering Mode**: Auto Exposure Histogram (default), Auto Exposure Basic, Manual.
- **Auto Exposure Histogram**: Low Percent, High Percent, Histogram Log Min/Max (EV range).
- **Exposure Compensation**: Manual EV offset applied on top of auto exposure.
- **EV100 (Manual Mode)**: Set exact exposure value. Bypasses auto exposure.
- **Min/Max Brightness**: Clamp range for auto exposure (EV units).
- **Speed Up/Speed Down**: How fast auto exposure adjusts to brighter/darker scenes (seconds).
- **Apply Physical Camera Exposure**: Use physical camera settings (ISO, Shutter Speed, Aperture) to derive exposure.
- **Calibration Constant**: Maps scene luminance to desired image brightness.

> **In your games:**
> - **DnD RPG**: Use Manual exposure or tightly clamped Auto Exposure (small Min/Max Brightness range). Dungeons swing between very dark corridors and bright spell effects; unconstrained auto exposure will constantly pump and distract the player. Set a fixed EV that keeps torchlit areas visible without washing out when a fireball goes off. Use Exposure Compensation per Post Process Volume to adjust between biomes (brighter for ice caves, darker for catacombs).
> - **Wizard's Chess**: Manual exposure recommended. The scene lighting is controlled and consistent, so let yourself set the exact EV you want for the best look. If you add dramatic lighting changes (a piece powers up and the scene brightens), use a slow Speed Up/Speed Down (2-3 seconds) for a cinematic adaptation.

#### Motion Blur

- **Amount**: Motion blur strength multiplier. Default 0.5. Range 0-1.
- **Max**: Maximum blur distance in screen percentage. Default 5.
- **Per Object Size**: Maximum blur for individual moving objects in screen percentage. Default 0.5.
- **Target FPS**: Target frame rate for motion blur calculation. Default 30.
- Motion blur is velocity-based (camera and per-object).

> **In your games:**
> - **DnD RPG**: Reduce or disable motion blur during gameplay (Amount 0.0-0.2). Dungeon crawling requires clear visibility. Enable stronger motion blur (0.4-0.6) during the tabletop-to-dungeon zoom transition for a dramatic whoosh effect. Per Object motion blur on swinging weapons and spell projectiles can look good at moderate values (0.3).
> - **Wizard's Chess**: Use Per Object motion blur on pieces during capture animations (a knight swinging its sword, a rook charging forward). Camera motion blur during dramatic angle changes adds cinematic flair. Keep Amount around 0.3-0.5 so movement feels weighty without losing clarity.

#### Lens Flares

- **Intensity**: Lens flare brightness. Default 1.0.
- **Tint**: Color tint for lens flares.
- **Bokeh Size**: Size of bokeh-shaped flare elements.
- **Threshold**: Minimum brightness to trigger lens flares.
- **Bokeh Shape**: Texture asset for custom bokeh shape.
- **Ghosts**: Lens flare ghost count and settings.

> **In your games:**
> - **DnD RPG**: Lens flares can break immersion in a dungeon setting. Keep Intensity very low (0.1-0.3) or disable entirely during gameplay. A subtle flare when looking directly at a powerful magical light source (a portal, a dragon's breath) can work if kept tasteful.
> - **Wizard's Chess**: Subtle lens flares on bright specular highlights (reflections off gold pieces, the board edge catching light) add a cinematic quality. Use a custom Bokeh Shape texture for a magical hexagonal or star-shaped flare. Keep Threshold high so only the brightest spots trigger them.

#### Image Effects

- **Vignette Intensity**: Darkening at screen edges. Range 0-1. Default 0.4.
- **Grain Intensity**: Film grain amount. Default 0.
- **Grain Jitter**: Film grain temporal variation. Default 0.

> **In your games:**
> - **DnD RPG**: Vignette is excellent for dungeon atmosphere. Increase to 0.5-0.6 for a "looking through the darkness" feel. Vary it per biome: heavier vignette in cramped catacombs, lighter in open caverns. Light film grain (0.05-0.1) adds a gritty, old-world texture that suits a fantasy setting without being distracting.
> - **Wizard's Chess**: Moderate vignette (0.3-0.5) draws the eye toward the center of the board. Keep grain at 0 for a clean, polished look unless you are going for a vintage "wizard's study" aesthetic, in which case light grain (0.05) works.

#### Color Grading

**White Balance:**
- **Temperature**: Color temperature shift (warm/cool). Default 6500K.
- **Tint**: Green-magenta shift. Default 0.

**Global:**
- **Saturation**: Per-channel (RGBW) saturation. Default (1,1,1,1).
- **Contrast**: Per-channel contrast. Default (1,1,1,1).
- **Gamma**: Per-channel gamma. Default (1,1,1,1).
- **Gain**: Per-channel gain (brightness multiplier). Default (1,1,1,1).
- **Offset**: Per-channel offset (additive). Default (0,0,0,0).

**Shadows (values below midpoint):**
- Saturation, Contrast, Gamma, Gain, Offset (same structure as Global).
- **Shadows Max**: Upper bound of the shadow range.

**Midtones:**
- Saturation, Contrast, Gamma, Gain, Offset.

**Highlights (values above midpoint):**
- Saturation, Contrast, Gamma, Gain, Offset.
- **Highlights Min**: Lower bound of the highlight range.
- **Highlights Max**: Upper bound of the highlight range.

**LUT (Look-Up Table):**
- **Color Grading LUT**: Texture asset (256x16 or 32x32x32 3D LUT).
- **LUT Intensity**: Blend between neutral and LUT color grade. Default 1.0.

> **In your games:**
> - **DnD RPG**: Color grading per dungeon biome is one of the most impactful visual tricks:
>   - **Fire dungeon**: Warm Temperature (5000K), push Shadows toward deep red, Highlights toward orange-yellow.
>   - **Ice cave**: Cool Temperature (8000K), desaturate slightly, push Shadows toward blue.
>   - **Undead catacombs**: Desaturated globally (Saturation 0.7), green-tinted Shadows, low Gamma for a dark, oppressive feel.
>   - **Forest/nature**: High Saturation (1.2), warm Temperature (5500K), push Midtones slightly green.
>   - Consider creating LUTs in Photoshop or DaVinci Resolve for each biome. A LUT gives consistent, art-directed looks that are faster to swap than tweaking individual channels.
> - **Wizard's Chess**: A unified, rich color grade suits the game. Warm Temperature (5500K) for golden, candlelit ambiance. Slightly crushed Shadows (increase Shadows Contrast to 1.1) for dramatic darks. Push Highlights toward warm gold for a luxurious feel. A single LUT can define your entire game's look.

#### Tone Mapping

- **Tone Mapper Type**: Default ACES-like tone mapper.
- **Slope**: Adjusts the steepness of the toe and shoulder. Default 0.88.
- **Toe**: Controls the dark region curve. Default 0.55.
- **Shoulder**: Controls the bright region rolloff. Default 0.26.
- **Black Clip**: Threshold below which values are clipped to black. Default 0.0.
- **White Clip**: Threshold above which values are clipped to white. Default 0.04.

> **In your games:**
> - **DnD RPG**: The default ACES tone mapper works well for fantasy. Increase Toe slightly (0.6) to lift shadow detail in dungeons so players can still navigate. Reduce Shoulder (0.2) for a softer highlight rolloff, which keeps torch flames from becoming harsh white blobs.
> - **Wizard's Chess**: Keep the defaults mostly intact. If highlights on the metallic pieces feel too harsh, lower the Shoulder to 0.2 for a smoother rolloff. Slightly increase Black Clip (0.01-0.02) if you want true deep blacks in the darkest areas for contrast.

#### Screen Space Reflections

- **Intensity**: SSR strength. Default 100.
- **Quality**: SSR trace quality (0-100). Default 50.
- **Max Roughness**: Maximum roughness for SSR. Default 0.6.
- **Override** to use SSR alongside Lumen Reflections for near-field augmentation.

> **In your games:**
> - **DnD RPG**: Use SSR as a supplement to Lumen Reflections for near-field contact reflections on wet dungeon floors. Keep Quality at 50-70 and let Lumen handle the main reflection work. SSR catches the close-up reflections that Lumen's lower-resolution tracing might miss.
> - **Wizard's Chess**: Enable SSR alongside Lumen Reflections. The board surface benefits from SSR's sharp near-field reflections of pieces sitting directly on it. Set Quality to 70-80 for crisp contact reflections. Increase Max Roughness to 0.7 if your board has a semi-matte finish.

#### Screen Space Global Illumination

- **Intensity**: SSGI strength.
- **Quality**: Trace quality.
- Typically replaced by Lumen GI in UE5 projects. Available as a lighter alternative.

> **In your games:**
> - **DnD RPG**: Skip SSGI; use Lumen GI instead. Lumen provides much better results for enclosed dungeon environments where indirect light bounce is critical to the mood.
> - **Wizard's Chess**: Same recommendation. Lumen GI handles the scene well. SSGI is only worth considering if you need to target hardware that cannot run Lumen, which is unlikely for this project.

#### Ambient Occlusion

- **Intensity**: AO darkening strength. Default 0.5. Range 0-1.
- **Radius**: World-space radius of the AO effect. Default 200.
- **Method**: SSAO (Screen Space Ambient Occlusion) or GTAO (Ground Truth Ambient Occlusion, more accurate).
- **GTAO settings**: Thickness Blend, Spatial Filter, Temporal Filter.
- **Power**: Exponent applied to AO. Default 2.0.
- **Bias**: Offset to reduce self-occlusion artifacts. Default 3.0.
- **Quality**: Number of samples. Default 50.
- **Mip Blend**: Blend between mip levels for multi-scale AO.

> **In your games:**
> - **DnD RPG**: Use GTAO for more accurate occlusion in dungeon corners and crevices. Increase Intensity to 0.6-0.7 for stronger contact shadows where walls meet floors, where objects sit on surfaces, and in tight corridor intersections. Set Radius appropriate to your dungeon scale (100-300 depending on how large your rooms are). This adds a lot of depth to stone architecture.
> - **Wizard's Chess**: GTAO with moderate Intensity (0.5). The board-to-piece contact darkening is important for grounding pieces visually. Reduce Radius to match the scene scale (50-150) so the AO effect is tight and accurate around piece bases.

#### Vignette

- **Vignette Intensity**: Edge darkening amount. Default 0.4.
- Applied as a radial gradient from screen center. No additional parameters; intensity only.

> **In your games:**
> - **DnD RPG**: Covered in Image Effects above. Use 0.5-0.6 for atmospheric dungeon feel. Consider dynamically increasing vignette when the player is low on health for a visual danger cue.
> - **Wizard's Chess**: Use 0.3-0.4 to gently frame the board. During tense moments (check, checkmate), briefly increasing vignette adds drama.

#### Film Grain

- **Intensity**: Amount of grain. Default 0.
- **Jitter**: Temporal grain variation. Default 0.
- **Texture**: Custom grain texture asset (optional).
- **Response Curve**: How grain scales with luminance (shadows get more grain).

> **In your games:**
> - **DnD RPG**: Light grain (Intensity 0.05-0.1) with Jitter at 0.5 adds a filmic quality to dungeon scenes. Adjust the Response Curve so grain appears mostly in shadows, keeping lit areas clean. This subtly sells the "ancient, mysterious" atmosphere.
> - **Wizard's Chess**: Keep grain at 0 for a polished, clean aesthetic. Only add grain if you are going for a period-film look.

#### Local Exposure

- **Enabled**: Toggle local exposure (local tone mapping).
- **Highlight Contrast Scale**: Adjusts contrast in bright areas.
- **Shadow Contrast Scale**: Adjusts contrast in dark areas.
- **Detail Strength**: Amount of local detail enhancement.
- **Bilateral Grid**: Grid resolution and blur sigma for local exposure computation.
- Helps maintain detail in scenes with extreme brightness ranges.

> **In your games:**
> - **DnD RPG**: Enable Local Exposure. Dungeons have extreme brightness ranges: pitch-dark corners next to blazing torches. Local Exposure keeps detail visible in both the shadows and the bright flames without flattening the overall contrast. Increase Shadow Contrast Scale (1.1-1.3) to preserve detail in dark areas while keeping the overall mood dark.
> - **Wizard's Chess**: Less critical since your lighting is more controlled. Enable it at subtle settings if you have bright specular highlights on pieces coexisting with dark board shadows.

#### Chromatic Aberration

- **Intensity**: Chromatic aberration amount. Default 0.
- **Start Offset**: Distance from center where aberration begins. Default 0.
- Applied as RGB channel separation increasing toward screen edges.

> **In your games:**
> - **DnD RPG**: Use very sparingly (Intensity 0.1-0.2) as a status effect: poison, drunkenness, magical disorientation. Do not leave it on permanently; it can feel distracting during normal gameplay.
> - **Wizard's Chess**: A tiny amount (0.05-0.1) adds a subtle lens-like quality for cinematic captures and replays. Keep it at 0 during normal gameplay.

#### Ray Tracing Settings

In Post Process Volume when hardware ray tracing is enabled:

- **Ray Tracing GI**: Enable/disable, samples per pixel, bounces, max roughness.
- **Ray Tracing Reflections**: Enable/disable, max bounces, samples per pixel, max roughness.
- **Ray Tracing Translucency**: Enable/disable, max refraction rays.
- **Ray Tracing AO**: Enable/disable, samples per pixel, radius.
- **Path Tracing**: Enable, max bounces, samples per pixel (for offline/reference rendering).

> **In your games:**
> - **DnD RPG**: If targeting RT hardware, enable RT Reflections for water puddles and polished surfaces. RT Translucency makes potion bottles and magical barriers look physically correct. Use Path Tracing for high-quality screenshots and promotional material (it is too slow for real-time but produces stunning reference images of your dungeons).
> - **Wizard's Chess**: RT Reflections are the biggest win: accurate reflections of pieces in the board surface. RT AO gives precise contact shadows at piece bases. Path Tracing is perfect for generating beautiful marketing screenshots of the board setup.

### Anti-Aliasing

#### TSR (Temporal Super Resolution)

- Default AA method in UE5. Found in **Project Settings > Engine > Rendering > Default Settings > Anti-Aliasing Method** or per-camera settings.
- Renders at a lower internal resolution and reconstructs to output resolution.
- **Screen Percentage**: Controls internal render resolution. Default 100%. Lower values (50-75%) improve performance with TSR upscaling.
- `r.TSR.Quality` adjusts TSR quality/performance tradeoff.
- `r.TSR.ThinGeometryDetection.Coverage.ShadingRange=2` (5.7): Expanded thin geometry detection to all shading models.
- `r.TSR.ShadingRejection.ExposureOffset` (5.7): Restored exposure offset for ghosting reduction.
- TSR provides the best visual quality of all AA methods but costs more than TAA.

> **In your games:**
> - **DnD RPG**: Use TSR at 75% Screen Percentage for a good performance/quality balance during gameplay. Dungeon meshes have lots of thin geometry (iron bars, chain links, weapon edges) that benefits from the 5.7 thin geometry detection improvements. If you notice ghosting on fast-moving spell effects, tweak `r.TSR.ShadingRejection.ExposureOffset`.
> - **Wizard's Chess**: TSR at 100% Screen Percentage (native resolution with temporal stability). The chess pieces have fine detail (crowns, crosses, horse manes) that benefit from TSR's reconstruction. Ghosting should be minimal since camera movement is typically slow and controlled.

#### TAA (Temporal Anti-Aliasing)

- Legacy temporal AA. **Project Settings > Engine > Rendering > Anti-Aliasing Method > TAA**.
- Resolves at native resolution with temporal reprojection.
- `r.TemporalAA.Samples` controls sample count.
- Susceptible to ghosting on fast-moving objects.

> **In your games:**
> - **DnD RPG**: TAA is a fallback if TSR is too expensive. The ghosting on fast weapon swings and spell particles can be noticeable, so prefer TSR if your hardware budget allows it.
> - **Wizard's Chess**: Avoid TAA in favor of TSR. When pieces slide across the board, TAA ghosting creates visible trails that look wrong on a clean, reflective surface.

#### FXAA (Fast Approximate Anti-Aliasing)

- Post-process edge smoothing. Cheapest option.
- `r.FXAA.Quality` controls quality (0-5).
- No temporal component; no ghosting but lower quality edge smoothing.

> **In your games:**
> - **DnD RPG**: Only use FXAA as a last resort for very low-end hardware targets. It blurs fine dungeon detail and does not handle thin geometry (bars, chains, filigree) well.
> - **Wizard's Chess**: Not recommended. The fine detail on chess pieces would look blurry, and the reflective board surface benefits from temporal methods.

#### MSAA (Multi-Sample Anti-Aliasing)

- Only available with Forward Rendering.
- **Project Settings > Engine > Rendering > Forward Shading > Forward Shading** must be enabled.
- MSAA Count: 2x, 4x, 8x.
- Best for VR or simple forward-rendered scenes.
- Not compatible with Deferred Rendering pipeline (the default).

> **In your games:**
> - **DnD RPG**: Not applicable unless you pivot to a VR dungeon crawler. Stick with Deferred Rendering and TSR.
> - **Wizard's Chess**: Same. MSAA would require Forward Rendering, which loses you Lumen, Substrate features, and many post-process effects. Not worth the tradeoff.

### Scalability Groups

Scalability presets are found in **Editor > Settings > Engine Scalability Settings** or via the viewport **Settings > Engine Scalability** button.

| Group | Low | Medium | High | Epic | Cinematic |
|-------|-----|--------|------|------|-----------|
| View Distance | 0 | 1 | 2 | 3 | 3 |
| Anti-Aliasing | 0 | 1 | 2 | 3 | 4 |
| Post Processing | 0 | 1 | 2 | 3 | 4 |
| Shadows | 0 | 1 | 2 | 3 | 4 |
| Global Illumination | 0 | 1 | 2 | 3 | 4 |
| Reflections | 0 | 1 | 2 | 3 | 4 |
| Textures | 0 | 1 | 2 | 3 | 3 |
| Effects | 0 | 1 | 2 | 3 | 4 |
| Foliage | 0 | 1 | 2 | 3 | 4 |
| Shading | 0 | 1 | 2 | 3 | 4 |

Console commands: `sg.ViewDistanceQuality`, `sg.AntiAliasingQuality`, `sg.PostProcessQuality`, `sg.ShadowQuality`, `sg.GlobalIlluminationQuality`, `sg.ReflectionQuality`, `sg.TextureQuality`, `sg.EffectsQuality`, `sg.FoliageQuality`, `sg.ShadingQuality`.

Each value maps to a set of console variable overrides defined in `Engine/Config/BaseScalability.ini`.

> **In your games:**
> - **DnD RPG**: Target "High" as your baseline and let players scale down. The most impactful groups for dungeons:
>   - **Global Illumination** and **Reflections**: These control Lumen quality. Dropping from Epic to High is a big performance win with acceptable quality loss. Below Medium, Lumen may fall back to lower quality and the dungeon mood suffers.
>   - **Shadows**: Critical for dungeon atmosphere. Keep at High minimum for clean torch shadows.
>   - **View Distance**: Less important for indoor dungeons (short view distances anyway) but matters for outdoor areas and the tabletop overview.
>   - **Foliage**: Only relevant if you have outdoor forest sections or underground mushroom caves.
> - **Wizard's Chess**: Target "Epic" as the baseline since the scene is small. The key groups:
>   - **Reflections**: Must stay High or above for the board reflections.
>   - **Shadows**: High or above for clean piece shadows on the board.
>   - **Textures**: Keep at High for crisp piece detail.
>   - **View Distance** and **Foliage**: Irrelevant for a board game scene; leave at defaults.
