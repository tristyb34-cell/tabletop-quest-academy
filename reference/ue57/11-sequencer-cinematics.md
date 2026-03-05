## Sequencer (Cinematics)

Sequencer is Unreal Engine's multi-track, non-linear editing tool for creating in-game cinematics, film-quality renders, and dynamic gameplay sequences.

### Opening Sequencer
- **Path**: Window > Cinematics > Sequencer (or open from a Level Sequence actor in the level)
- **Create Level Sequence**: Cinematics dropdown in the main toolbar > Add Level Sequence
- **Shortcut**: Double-click a Level Sequence asset in the Content Browser

---

### Track Types

| Track | Description |
|-------|-------------|
| **Actor** | Binds an Actor to the Sequencer. All sub-tracks are organized under the Actor track. Add via **+ Track** button or drag Actor from Outliner. |
| **Transform** | Keyframes Location, Rotation, and Scale of an Actor or component. Created automatically when you key an Actor's transform. |
| **Camera** | Specialized Actor track for CineCamera or Camera Actors. Exposes focal length, aperture, focus distance, and sensor settings. |
| **Audio** | Plays a Sound Wave or Sound Cue. Supports volume, pitch curves, and start offset. Waveform visualization in the track. |
| **Event** | Fires Blueprint events or calls functions at specific times. Bind to events on the Level Blueprint, Director Blueprint, or any Actor. |
| **Fade** | Controls screen fade to/from a color (typically black). Keyframe a float from 0 (no fade) to 1 (fully faded). |
| **Level Visibility** | Toggles Level visibility on/off at specific times. Used for streaming level management in cinematics. |
| **Material Parameter** | Animates scalar and vector parameters on Material Instances. Select the material, then keyframe parameters by name. |
| **Particle** | Triggers Niagara or Legacy Cascade systems. Toggle active/inactive and trigger events at specific frames. |
| **Skeletal Animation** | Plays Animation Sequences and Montages on Skeletal Mesh Components. Supports blending, playback rate, start offset, and section looping. |
| **Subsequence** | Embeds another Level Sequence within the current one. Enables modular cinematic composition. Supports time scaling, looping, and offset. |
| **Media** | Plays media content (video files) via the Media Framework. Requires a Media Player and Media Texture. |
| **Camera Cuts** | Special track at the top level. Defines which camera is active at each point in time. One per Sequence. Required for multi-camera cinematics. |
| **Data Layer** | Controls Data Layer visibility/loading during the sequence. |
| **CVarTrack** | Animates console variable values over time (render settings, scalability). |
| **Boolean / Integer / Float / Byte / Enum / String / Color / Vector** | Property tracks for any exposed UPROPERTY on a bound Actor or Component. |

> **In your games:**
> - **DnD RPG**: Use **Camera Cuts** to switch between a wide shot of the tabletop and a close-up as miniatures come alive during the zoom transition. **Skeletal Animation** tracks play the party's dramatic entrance animation as they descend into a dungeon. **Audio** tracks layer ambient dungeon sounds, the Bard's theme music, and the AI DM's narration. **Event** tracks trigger Gameplay Cues at scripted moments (torches igniting, doors slamming). **Fade** tracks handle the transition to black between the tabletop view and the 3D dungeon. **Particle** tracks fire Niagara systems for magical portals opening, dust falling from the ceiling, and the Wizard's ambient staff glow. **Material Parameter** tracks animate the dungeon walls glowing as the party approaches a boss room. **Subsequence** tracks embed reusable cinematics (a standard "dice roll" sequence that plays on the tabletop before each encounter).
> - **Wizard's Chess**: **Camera Cuts** switch between the overhead board view and dramatic low-angle shots during captures. **Skeletal Animation** tracks drive the attack and death sequences. **Particle** tracks trigger magic trail effects as pieces slide across the board. **Audio** tracks play impact sounds, magical hums, and piece-specific themes. **Material Parameter** tracks animate the board squares glowing when a piece is selected or a square is threatened. **Float** property tracks animate the board's emissive intensity ramping up during check and checkmate. **Fade** handles the transition between the menu and the game board reveal.

---

### Keyframes and Curves

#### Setting Keyframes
- **S key**: Sets a keyframe at the current time on the selected track/property
- **Enter**: Confirms a keyframe value in the curve editor
- Right-click a track header > **Add Key** to add a keyframe at the playhead position
- **Auto-Key**: Toggle in the toolbar. When enabled, any property change in the viewport automatically creates a keyframe.
- **Auto-Key modes**: Key All, Key Animated (only keys already-animated properties)

#### Curve Editor
- Toggle via the curve icon on each track or the global **Curves** button in the toolbar
- **Tangent Types**:
  - **Auto**: Smoothly interpolates through keyframes
  - **User**: Manually adjustable tangent handles
  - **Break**: Independent left/right tangent handles
  - **Linear**: Straight-line interpolation between keys
  - **Constant (Step)**: Holds value until the next keyframe (no interpolation)
  - **Weighted**: Tangents with adjustable length for Bezier control
- **Curve Operations**: Select keys and right-click for:
  - Set tangent type
  - Flatten tangent
  - Straighten tangent
  - Set key interpolation
  - Set key time/value numerically
  - Copy/paste keys
- **Keyboard Shortcuts in Curve Editor**:
  - **1**: Set Auto tangent
  - **2**: Set User tangent
  - **3**: Set Break tangent
  - **4**: Set Linear tangent
  - **5**: Set Constant tangent
  - **T**: Toggle weighted tangents
  - **Shift+click**: Add key at click position
  - **Ctrl+click**: Select additional keys

> **In your games:**
> - **DnD RPG**: Use **Auto tangents** for smooth camera pans through dungeon corridors. Use **Linear tangents** for the snappy zoom transition from tabletop to 3D (it should feel fast and intentional, not floaty). Use **Constant (Step)** tangents for switching light states on/off when a torch ignites. For the dice roll camera, use **Weighted tangents** to create a custom ease-in on the upward arc and a sharp ease-out as the camera snaps to the result.
> - **Wizard's Chess**: Use **Break tangents** on the capture camera swoop so you get a slow build-up then a fast snap to the impact frame. **Auto tangents** for the gentle floating idle camera. **Linear tangents** for the quick cut back to the overhead board view after a capture resolves.

---

### Camera System

#### Camera Cuts Track
- Located at the top of the Sequencer track list
- Defines which camera is active at any given time
- Add camera bindings and set cut points
- Transitions between cameras are instant cuts by default
- For blended transitions, overlap cameras and use a Blend track or manual Camera Actor blend

#### Cinematic Camera (CineCamera Actor)
- **Create**: Place in level via Place Actors panel > Cinematic > Cine Camera Actor
- **Properties**:
  - **Filmback**: Sensor size presets (Super 16mm, Super 35mm, 65mm IMAX, Custom)
  - **Focal Length**: Lens mm (wide angle 14mm to telephoto 200mm+)
  - **Aperture (f-stop)**: Controls depth of field (f/1.4 shallow, f/22 deep)
  - **Focus Settings**:
    - **Manual**: Set focus distance directly
    - **Tracking**: Tracks a specific Actor
    - **Disable**: No DOF
  - **Min/Max Focal Length**: Lens zoom range constraints
  - **Squeeze Factor**: Anamorphic lens simulation

#### Depth of Field Presets
- Configured per CineCamera or via Post Process Volume
- **Method**: Cinematic DOF (default in 5.x, physically based Bokeh)
- **Settings**: Focal Region (sharp zone width), Near/Far Transition distances
- **Bokeh Shape**: Blade Count, Aperture Blade settings for artistic control
- **Path Tracer**: Full physically accurate DOF when using Path Tracer rendering

#### Camera Rigs
| Rig | Description |
|-----|-------------|
| **Camera Rig Rail** | Moves camera along a spline path. Keyframe position along rail (0 to 1). Configure speed, lock orientation to rail. |
| **Camera Rig Crane** | Simulates a physical crane/jib. Arm length, arm pitch, arm yaw, mount pitch controls. |
| **Spring Arm** | Component-level; provides lazy follow and collision avoidance (commonly used for gameplay cameras) |
| **Manual Tracking** | Keyframe camera transform directly in Sequencer |

> **In your games:**
> - **DnD RPG**: Use **Camera Rig Rail** for the dramatic dungeon entrance: the camera glides along a spline down a staircase, revealing the dungeon below. Use **Camera Rig Crane** for boss reveals, sweeping up from the party's eye level to reveal the massive boss arena. **Spring Arm** drives the gameplay camera during exploration (lazy follow, collision avoidance around dungeon walls and pillars). The tabletop-to-3D zoom uses **Manual Tracking** with carefully keyframed positions: start from a bird's-eye tabletop view, swoop down and into the miniature world. Set **CineCamera focal length** to 14mm wide angle for the dungeon reveal, then rack to 85mm telephoto for dramatic character close-ups during dialogue. Use **Tracking focus** on the active speaker so depth of field follows the conversation naturally.
> - **Wizard's Chess**: Use **Camera Rig Crane** for the dramatic capture camera: start at board level, crane up and swoop down to the capture square. **Camera Rig Rail** along a circular spline around the board for the opening reveal shot. **Spring Arm** for the player's interactive camera during gameplay (orbit around the board with collision avoidance against the board edges). Set shallow **Depth of Field** (f/2.8) to blur background pieces and focus on the active move. Use **Tracking focus** locked to the moving piece so it stays sharp while the board blurs behind it.

---

### Level Sequences vs Master Sequences

#### Level Sequences
- Self-contained cinematic units
- Can be placed in a Level as a Level Sequence Actor
- **Trigger**: Auto Play on level load, or triggered via Blueprint (`Play` node on the Level Sequence Actor)
- **Playback Settings**: Loop, Ping Pong, play rate, start/end time
- Can reference specific Actors via **Possessable** (existing level Actor) or **Spawnable** (sequence-owned Actor)

#### Master Sequences
- **Path**: Cinematics dropdown > Create Master Sequence
- Contains multiple Level Sequences as shots on a single timeline
- Provides a top-level editorial view of a multi-shot cinematic
- Each shot is a Subsequence track referencing a Level Sequence
- Supports shot reordering, trimming, time scaling
- **Shot numbering**: Automatically names shots (Shot0010, Shot0020...) with configurable increment
- Useful for film-style production with separate shot files edited by different artists

> **In your games:**
> - **DnD RPG**: Use **Level Sequences** for each scripted moment: the dungeon entrance, boss introductions, story beats generated by the AI DM, and the tabletop zoom transition. Trigger them via Blueprint when the player enters a trigger volume or the AI DM initiates a narrative event. Use **Spawnable** actors for cinematic-only elements (dramatic lighting, fog, particle effects that only exist during the cutscene). Use a **Master Sequence** to organize the full campaign intro: Shot 1 (tabletop overview), Shot 2 (miniature close-ups), Shot 3 (zoom into the dungeon), Shot 4 (party formation). Each shot is a separate Level Sequence that can be iterated on independently.
> - **Wizard's Chess**: Each capture type gets its own **Level Sequence**: PawnCapture, KnightCapture, BishopCapture, etc. These are triggered at runtime when a capture occurs, with the attacking and defending piece bound as **Possessable** actors. A **Master Sequence** handles the full match intro: Shot 1 (board materializes), Shot 2 (pieces march to their starting positions), Shot 3 (camera settles to gameplay view). Use **Auto Play** on the intro sequence when the match level loads.

---

### Movie Render Queue

#### Overview
- High-quality offline rendering system for final pixel output
- **Path**: Window > Cinematics > Movie Render Queue
- Supports features not available in real-time: temporal subsampling, high sample counts, spatial oversampling, 16-bit HDR output

#### Settings and Configuration

**Output Settings:**
| Setting | Description |
|---------|-------------|
| **Output Directory** | File save location |
| **File Name Format** | Pattern with tokens: `{sequence_name}`, `{shot_name}`, `{frame_number}`, `{camera_name}` |
| **Output Resolution** | Custom resolution (independent of viewport) |
| **Frame Rate** | Output frame rate (24, 25, 30, 60, etc.) |
| **Frame Range** | Custom start/end frame override |
| **Handle Frames** | Extra frames at start/end for transitions |

**Output Formats:**
| Format | Notes |
|--------|-------|
| **EXR (OpenEXR)** | 16-bit or 32-bit HDR; industry standard for compositing |
| **PNG** | 8-bit with alpha; good for image sequences |
| **JPEG** | 8-bit compressed; smaller files, no alpha |
| **BMP** | Uncompressed 8-bit |
| **Apple ProRes** | Video codec (macOS); 422, 4444, 4444 XQ |
| **AVI** | Uncompressed video |
| **Custom** | Via plugins and extensions |

**Anti-Aliasing and Quality:**
| Setting | Description |
|---------|-------------|
| **Spatial Sample Count** | Supersampling (renders at higher resolution, downsamples). 1 = off, 4+ for high quality. |
| **Temporal Sample Count** | Accumulates multiple frames per output frame for motion blur quality. 1 = off, 8-32 for cinematic motion blur. |
| **Override Anti-Aliasing** | Force specific AA method for rendering |
| **Use Camera Cut for Warm Up** | Pre-rolls simulation before recording |
| **Engine Warm Up Count** | Frames to simulate before capture begins |

**Render Pass Configuration:**
| Pass | Description |
|------|-------------|
| **Final Color (HDR/Tone Curve)** | Standard beauty pass |
| **World Normal** | Normal buffer output |
| **Base Color** | Albedo pass |
| **Metallic / Roughness / Specular** | Material property passes |
| **Ambient Occlusion** | AO pass |
| **Scene Depth** | Z-depth for compositing |
| **Custom Stencil** | Per-object ID masks |
| **Object ID** | Unique color per object for compositing |

**Console Variable Presets:**
- Apply console variable overrides during rendering
- Common: disable screen-space effects, set r.ScreenPercentage, enable/disable ray tracing features
- Configure via the **Console Variables** section in the render settings

#### Path Tracer Integration
- Movie Render Queue can use the Path Tracer for ground-truth rendering
- Enable via console variable `r.PathTracing.MaxBounces` and `r.PathTracing.SamplesPerPixel`
- Provides physically accurate global illumination, reflections, refractions, caustics, and DOF
- Significantly slower than Lumen but produces reference-quality results

> **In your games:**
> - **DnD RPG**: Use **Movie Render Queue** for trailer creation: render the dungeon crawl intro at 4K with high temporal samples for cinematic motion blur on the Warrior's sword swings. Export as **EXR** sequences for compositing in DaVinci Resolve (add color grading, titles, the game logo). Use **render passes** (Scene Depth, Object ID) to create depth-of-field and masking in post. For in-game cinematics, you would not use MRQ at runtime, but it is invaluable for marketing materials and the Steam page trailer.
> - **Wizard's Chess**: Render a hero trailer: the camera circles the board in slow motion as pieces battle. Use **Path Tracer** for physically accurate reflections on polished marble pieces and caustics from the glowing magical board. Export individual **render passes** so you can composite the magic effects separately and control their intensity in post. Render at 60fps with high spatial samples for a buttery-smooth showcase video.

---

### Sequencer Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Spacebar** | Play/Pause |
| **Enter** | Play from start |
| **S** | Set keyframe on selected |
| **Backspace / Delete** | Delete selected keys |
| **Home** | Frame all (zoom to fit) |
| **Ctrl+G** | Go to specific frame/time |
| **[ / ]** | Set In/Out range points |
| **I / O** | Set section start/end to playhead |
| **Ctrl+Shift+,** | Move playhead to previous key |
| **Ctrl+Shift+.** | Move playhead to next key |
| **Ctrl+Z / Ctrl+Y** | Undo/Redo |
| **Ctrl+C / Ctrl+V** | Copy/Paste keys or tracks |
| **Ctrl+D** | Duplicate selected |
| **M** | Mute/unmute selected track |
| **L** | Lock/unlock selected track |
| **G** | Toggle snapping |
| **Ctrl+R** | Render Movie (opens Movie Render Queue) |
| **F** | Frame selected keys in curve editor |

---

### Sequencer Console Commands

| Command | Description |
|---------|-------------|
| `Sequencer.ShowKeyAreas 1` | Shows key area visualization |
| `Sequencer.AllowPossessionOfPIEViewports 1` | Allows camera possession in PIE |
| `t.MaxFPS 30` | Caps frame rate (useful for consistent playback) |
| `r.ScreenPercentage 200` | Supersampling for viewport quality |
| `ShowFlag.MotionBlur 1/0` | Toggle motion blur visualization |

---

*This reference covers Unreal Engine 5.7 features as of March 2026. For the most current documentation, consult the official Unreal Engine 5.7 documentation at dev.epicgames.com.*

**Sources consulted:**
- Unreal Engine 5.7 Official Announcement: https://www.unrealengine.com/en-US/news/unreal-engine-5-7-is-now-available
- Unreal Engine 5.7 Release Notes: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-7-release-notes
- Tom Looman UE 5.7 Performance Highlights: https://tomlooman.com/unreal-engine-5-7-performance-highlights/
- Niagara Examples Pack: https://www.unrealengine.com/en-US/news/discover-over-50-free-niagara-systems-ready-to-use-in-unreal-engine-5-7
- Substrate Overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-substrate-materials-in-unreal-engine
- IK Retargeting: https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine
- Motion Matching: https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-matching-in-unreal-engine
- CG Channel UE 5.7: https://www.cgchannel.com/2025/11/unreal-engine-5-7-five-key-features-for-cg-artists/
- Automotive Substrate Materials: https://www.unrealengine.com/en-US/news/get-over-280-production-ready-automotive-substrate-materials-for-ue-5-7-free-on-fab

---
