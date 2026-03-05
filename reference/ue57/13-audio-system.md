## Audio System

UE 5.7 provides two parallel audio authoring systems: the legacy Sound Cue system and the newer MetaSounds system. Both work with the same underlying audio engine and support spatialization, attenuation, and real-time effects.

---

### Sound Cues

Sound Cues are node-based audio graphs created in the Sound Cue Editor. They combine and modify Wave Player outputs using a visual node graph.

**Creating a Sound Cue:**
- Content Browser > Right-click > Sounds > Sound Cue
- Or right-click a Sound Wave asset > Create Cue

#### Sound Cue Nodes

##### Attenuation

- Overrides the Sound Cue's attenuation settings inline
- **Properties**: Volume, distance algorithm, attenuation shape, radius settings
- Useful for per-node attenuation within a complex cue

##### Concatenator

- Plays connected Sound Wave nodes in sequence (one after another)
- Each input plays after the previous one finishes
- Inputs are ordered top to bottom

##### Crossfade by Distance

- Fades between multiple inputs based on the listener's distance from the sound source
- **Properties per input**:
  - `Min Distance`: Distance at which this input is at full volume
  - `Max Distance`: Distance at which this input is silent
  - `Fade In Distance`: Range over which the input fades in
  - `Fade Out Distance`: Range over which the input fades out

##### Crossfade by Param

- Fades between multiple inputs based on a named parameter value
- **Properties**:
  - `Param Name`: Name of the parameter to read
  - Per input: `Min`, `Max` values for the parameter range

##### Delay

- Adds a time delay before passing audio through
- **Properties**:
  - `Delay Min`: Minimum delay in seconds
  - `Delay Max`: Maximum delay in seconds

##### Doppler

- Simulates the Doppler effect based on relative velocity between source and listener
- **Properties**:
  - `Doppler Intensity`: Multiplier for the effect strength

##### Enveloper

- Applies a volume and pitch envelope over time
- **Properties**:
  - `Volume Curve`: Custom curve for volume over the sound's duration
  - `Pitch Curve`: Custom curve for pitch over the sound's duration
  - `Loop`: Whether the envelope loops
  - `Duration`: Total envelope duration
  - `Loop Count`: Number of loops (0 = infinite when Loop is enabled)

##### Group Control

- Selects which input to play based on the number of simultaneous instances of this Sound Cue
- **Properties**:
  - `Group Sizes`: Array defining how many columns each group row has
  - Uses a table where rows = number of concurrent sounds, columns = variations

##### Looping

- Loops the connected sound indefinitely (or a set number of times)
- Wraps around the input node's output

##### Mixer

- Mixes multiple inputs together with individual volume control
- **Properties per input**:
  - `Input Volume`: Volume multiplier for each input (0.0 to 1.0+)

##### Modulator

- Applies random or oscillating modulation to volume and pitch
- **Properties**:
  - `Volume Min` / `Volume Max`: Random volume range
  - `Pitch Min` / `Pitch Max`: Random pitch range

##### Oscillator

- Modulates volume and pitch using a waveform (sine, square, triangle, sawtooth)
- **Properties**:
  - `Modulate Volume`: Enable volume oscillation
  - `Modulate Pitch`: Enable pitch oscillation
  - `Amplitude`, `Frequency`, `Offset`, `Center` for each
  - `Oscillation Type`: Sine, Square, Triangle, SawTooth

##### Random

- Randomly selects one of its inputs to play
- **Properties**:
  - `Weights`: Per-input probability weights
  - `Randomize Without Replacement`: Avoid repeating the same input consecutively
  - `Num Pre-selected Entries`: Pre-select entries to reduce repetition

##### Switch

- Selects an input based on an integer or boolean parameter
- **Properties**:
  - `Int Parameter Name`: Name of the integer parameter to read
  - Maps parameter values to specific inputs

##### Wave Player

- The fundamental node that plays a Sound Wave asset
- **Properties**:
  - `Sound Wave`: Reference to the audio file
  - `Looping`: Whether the wave loops
  - `Start Offset`: Time offset (in seconds) to start playback
  - `Pitch Multiplier`, `Volume Multiplier`
  - `bVirtualizeWhenSilent`: Keep playing when inaudible

##### Branch

- Routes audio based on a boolean parameter
- **Properties**:
  - `Bool Parameter Name`: The boolean parameter to check
  - Two outputs: True and False

##### Continuous Modulator

- Continuously modulates pitch and volume based on a named parameter
- Reads from a distribution curve mapped to parameter values

##### Distance Crossfade

- (Alternative to Crossfade by Distance) Crossfades inputs based on listener distance
- Properties are distance ranges per input

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Random node** for sword swing variations: feed 4-5 different Warrior slash sound waves with `Randomize Without Replacement` enabled, so combat never sounds repetitive.
> - **Concatenator** for dice roll sequences: play the dice pickup sound, then the rattle, then the landing thud in order. This gives the tactile tabletop feel where you hear each phase of the roll.
> - **Switch node** for footsteps by surface: use an integer parameter `SurfaceType` (0 = stone dungeon floor, 1 = wooden tavern, 2 = dirt cave). The Switch routes to the correct footstep set.
> - **Crossfade by Distance** for the tabletop-to-3D zoom transition: when close to the tabletop, play the soft miniature clinking sounds. As the camera zooms into the 3D dungeon, crossfade into full-scale dungeon ambience.
> - **Modulator** on Wraith enemy sounds: randomize pitch between 0.8 and 1.2 so each Wraith encounter sounds slightly different and eerie.
> - **Looping** node for dungeon torch crackle: loop an ambient fire sound and attach it to every torch Actor in the dungeon.
> - **Delay** node for Wizard spell echoes: add a 0.3-0.5 second random delay before playing the spell impact reverb tail.
> - **Enveloper** for the Bard's song abilities: shape a volume swell that rises, sustains, then fades, matching the performance animation.
> - **Branch** node for combat mode: check `bIsRealTimeCombat` boolean. If true, play fast-paced impact sounds. If false (turn-based), play the slower, more deliberate strike sounds.
>
> **Wizard's Chess:**
> - **Random node** for piece capture shattering: 3-4 shatter sound variations per piece type so no two captures sound identical.
> - **Concatenator** for piece movement: play the stone scraping/sliding sound first, then the placement "thunk" when the piece arrives at its destination square.
> - **Crossfade by Param** for piece movement speed: parameter `MoveSpeed` crossfades between a slow grinding stone sound (heavy pieces like Rook) and a lighter swoosh (quick pieces like Bishop).
> - **Mixer** for the ambient board atmosphere: blend a low rumble, magical hum, and distant whispers at different volumes to create the enchanted chessboard ambience.
> - **Doppler** for pieces that fly across the board (Knight jumps, diagonal Bishop slides): adds a subtle pitch shift as the piece whooshes past the camera.

---

### MetaSounds

MetaSounds is UE5's next-generation procedural audio system. It provides a graph-based, fully programmable audio DSP pipeline with sample-accurate timing.

**Creating a MetaSound:**
- Content Browser > Right-click > Sounds > MetaSound Source
- Or Content Browser > Right-click > Sounds > MetaSound Patch (reusable sub-graph)

**Key advantages over Sound Cues:**
- Sample-accurate timing and control
- Audio-rate modulation (parameters can update at audio sample rate)
- True DSP programming: filters, synthesis, envelopes, math operations
- Better performance through compiled audio graphs
- Deterministic playback

#### Core Concepts

**Inputs and Outputs:**
- Every MetaSound has input and output pins defined on the graph
- `On Play`: Trigger input that starts the MetaSound
- `On Finished`: Trigger output that fires when playback ends
- `Audio Out Left / Right`: Final stereo audio output

**Data types:**
| Type | Description |
|------|-------------|
| `Trigger` | Event signal (no data, just timing) |
| `Float` | Single floating-point value |
| `Int32` | Integer value |
| `Bool` | Boolean value |
| `Audio` | Audio buffer (mono channel of samples) |
| `Time` | Time value in seconds |
| `String` | Text string |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Pass a `Float` input called `SpellIntensity` (0.0 to 1.0) into a Fireball MetaSound. At 0.2 it is a small flame puff; at 1.0 it is a roaring explosion. The MetaSound graph uses this float to control filter cutoff, reverb send, and volume internally.
> - Use `Trigger` inputs for dice roll events: `On Play` fires when the player initiates a roll, and a `Trigger Delay` node staggers the bounce sounds based on a `Float` input for roll force.
>
> **Wizard's Chess:**
> - Feed an `Int32` input for `PieceType` (0=Pawn, 1=Rook, 2=Knight, 3=Bishop, 4=Queen, 5=King) into a single capture MetaSound. The graph uses this integer to route to different shatter intensity layers, so a Pawn breaks lightly while a Queen explodes dramatically.

#### Node Categories

##### Triggers

| Node | Description |
|------|-------------|
| `Trigger On Play` | Fires when the MetaSound starts playing |
| `Trigger Repeat` | Fires a trigger at regular intervals |
| `Trigger Counter` | Counts incoming triggers and outputs on threshold |
| `Trigger Control` | Gates triggers based on a boolean |
| `Trigger Delay` | Delays a trigger by a specified time |
| `Trigger Route` | Routes triggers based on an index |
| `Trigger Any` | Fires when any of its inputs receive a trigger |
| `Trigger Sequence` | Fires outputs in sequence with each incoming trigger |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Trigger Repeat** for a Skeleton enemy's bone rattle: fire a rattle sound every 0.4 seconds while the Skeleton is idle, creating a rhythmic, unsettling clatter.
> - **Trigger Sequence** for the Cleric's healing chant: each trigger advances through a sequence of ascending choral tones (first note, second note, third note) to build a layered prayer effect.
> - **Trigger Counter** for combo attacks: count sword hits and on the 3rd strike, trigger a powerful finishing blow sound. Reset the counter when the combo ends.
> - **Trigger Control** gated by `bIsPlayerTurn`: only allow turn-based UI notification sounds to play during the player's turn, keeping the soundscape clean during enemy turns.
>
> **Wizard's Chess:**
> - **Trigger Delay** for cascading debris: when a piece shatters, fire the main break sound immediately, then delay secondary debris chunk impacts by 0.1, 0.2, and 0.3 seconds for a realistic cascade.
> - **Trigger Sequence** for the board's magical activation: each piece placed on the board triggers the next note in a mystical ascending scale.

##### Generators (Oscillators / Synthesis)

| Node | Description |
|------|-------------|
| `Sine` | Generates a sine wave |
| `Square` | Generates a square wave |
| `Saw` | Generates a sawtooth wave |
| `Triangle` | Generates a triangle wave |
| `LFO` | Low-frequency oscillator for modulation |
| `Noise` | White noise generator |
| `Pink Noise` | Pink noise generator |
| `ADSR Envelope` | Attack-Decay-Sustain-Release envelope generator |
| `Wave Player` | Plays a Sound Wave asset with sample-accurate control |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **LFO** modulating a low `Sine` for the Wraith's hovering hum: a slow LFO (0.5 Hz) wobbles the pitch of a deep sine tone, creating an otherworldly pulsing drone.
> - **ADSR Envelope** for the Wizard's spell charge: fast Attack when the player starts casting, Sustain while holding the input, then Release when the spell fires. Multiply this envelope against a layered Noise + Sine mix for a magical energy buildup.
> - **Noise** mixed with a **Wave Player** playing a fire crackle sample for the Dragon boss's breath weapon: the procedural noise adds chaos to the recorded fire sound, so every breath attack sounds unique.
>
> **Wizard's Chess:**
> - **Sine** oscillator for the board's ambient magical hum: a low 60 Hz sine with gentle LFO modulation gives the enchanted board a living, breathing feel.
> - **ADSR Envelope** on a **Wave Player** stone-scrape sample: short Attack as the piece lifts, Sustain while it slides, quick Release as it lands. This shapes the raw sample to match the piece animation exactly.

##### Filters

| Node | Description |
|------|-------------|
| `One-Pole Low Pass` | Simple first-order low-pass filter |
| `One-Pole High Pass` | Simple first-order high-pass filter |
| `Biquad Filter` | Second-order filter (Low Pass, High Pass, Band Pass, Notch, All Pass, Peak, Low Shelf, High Shelf) |
| `State Variable Filter` | Multi-mode filter with simultaneous LP/HP/BP outputs |
| `Ladder Filter` | Classic Moog-style resonant low-pass filter |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Biquad Low Pass** on dungeon sounds when viewing the tabletop from above: apply a 400 Hz cutoff so the dungeon audio sounds muffled and distant, as if heard through the table surface. Remove the filter as the camera zooms into the 3D world.
> - **Ladder Filter** with high resonance on the Wizard's arcane spell sounds: sweep the cutoff frequency upward during the cast animation for a dramatic "powering up" effect.
> - **High Pass** on Goblin chatter: cut the low end so their voices sound small, thin, and appropriately annoying.
>
> **Wizard's Chess:**
> - **Low Pass filter** on ambient board sounds when the pause menu opens: duck the cutoff to 200 Hz so everything sounds underwater/muted, signaling the game is paused.
> - **Band Pass** on the stone debris sounds: isolate the mid-range crunch frequencies (800-2000 Hz) to make piece destruction sound crisp and impactful without muddying the low end.

##### Envelopes

| Node | Description |
|------|-------------|
| `ADSR Envelope` | Classic ADSR with trigger input |
| `Linear Envelope` | Linear ramp between two values |
| `Exponential Envelope` | Exponential curve between two values |
| `Envelope Follower` | Tracks the amplitude of an audio signal |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **ADSR Envelope** for the Ranger's arrow release: instant Attack on bowstring snap, no Sustain, moderate Decay and Release for the arrow's trailing whoosh.
> - **Exponential Envelope** for Cleric's divine smite: exponential ramp up over 1.5 seconds as holy light gathers, then sharp drop on impact. Exponential curves feel more dramatic than linear for magical energy.
> - **Envelope Follower** tracking the Bard's music playback: use the amplitude of the Bard's lute melody to drive particle intensity on nearby allies, so visual healing sparkles pulse in time with the actual audio.
>
> **Wizard's Chess:**
> - **Linear Envelope** for piece sliding volume: linearly ramp volume from 0 to 1 as the piece accelerates, then back to 0 as it decelerates. Simple and predictable, matching the smooth animation.

##### Mathematical Operations

| Node | Description |
|------|-------------|
| `Add (Audio)` | Mix two audio signals |
| `Multiply (Audio)` | Multiply audio (ring modulation, amplitude modulation) |
| `Subtract`, `Divide` | Arithmetic on audio or float |
| `Clamp` | Restrict value to a range |
| `Map Range` | Remap a value from one range to another |
| `Interpolate` | Linear interpolation between values |
| `Random Float` | Generate random float on trigger |
| `Mix` | Multi-input audio mixer with per-input gains |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Map Range** to convert dice roll value (1-20) into a pitch multiplier (0.8 to 1.5): higher rolls produce higher-pitched, more triumphant impact sounds. A natural 20 sounds bright and powerful; a 1 sounds dull and deflating.
> - **Random Float** on each Goblin spawn to set its voice pitch between 0.9 and 1.3, so a group of Goblins all sound slightly different without needing separate voice assets.
> - **Multiply (Audio)** to apply the Rogue's stealth modifier: multiply footstep audio by a `StealthFactor` float (0.1 when sneaking, 1.0 when running) so the Rogue's steps get near-silent.
>
> **Wizard's Chess:**
> - **Mix** node combining three layers for piece capture: stone cracking (low), shrapnel scatter (mid), and magical sparkle (high). Adjust per-input gains based on piece value so a captured Queen uses more sparkle and cracking.
> - **Clamp** the debris volume between 0.3 and 1.0 so even the smallest Pawn capture still makes a satisfying sound, while preventing King captures from blowing out the speakers.

##### Effects

| Node | Description |
|------|-------------|
| `Delay` | Audio delay line |
| `Reverb` | Algorithmic reverb |
| `Stereo Delay` | Stereo ping-pong delay |
| `Chorus` | Chorus modulation effect |
| `Compressor` | Dynamics compressor |
| `Limiter` | Hard/soft limiter |
| `Distortion` | Waveshaping distortion |
| `Bitcrusher` | Bit-depth and sample-rate reduction |
| `Flanger` | Flanging effect |
| `Phaser` | Phase-shifting effect |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Reverb** on all dungeon sounds: feed dungeon footsteps, sword clashes, and spell impacts through a reverb node with long decay to simulate stone corridors and cavernous rooms.
> - **Delay** for the Wizard's echo spell: a 0.3s delay with moderate feedback creates an arcane echo effect on incantation voice lines.
> - **Distortion** for the Dragon boss's roar: push the roar through waveshaping distortion to add a guttural, terrifying edge that shakes the subwoofer.
> - **Chorus** on the Bard's lute: subtle chorus modulation makes the single instrument sound richer, as if magically amplified.
> - **Compressor** on the combat SFX bus: keep sword clashes, spell explosions, and dice impacts within a consistent volume range so nothing is jarring during intense multi-enemy fights.
> - **Bitcrusher** for the AI DM's voice: reduce bit depth to give the local Ollama DM a slightly otherworldly, narrator-from-another-dimension quality.
>
> **Wizard's Chess:**
> - **Reverb** on all board sounds: the chess room should feel like a grand stone hall, so apply reverb with 2-3 second decay to piece slides and captures.
> - **Stereo Delay** on the magical activation chime when a match begins: ping-pong the chime left and right for a wide, enchanted feel.
> - **Limiter** on piece shatter sounds: hard limit to prevent clipping when multiple pieces are captured in rapid succession during an aggressive endgame.

##### Analysis

| Node | Description |
|------|-------------|
| `FFT` | Fast Fourier Transform for spectrum analysis |
| `Envelope Follower` | Amplitude tracking |
| `Pitch Tracker` | Pitch detection |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Envelope Follower** on the dungeon ambience to drive fog density: when ambient sounds swell (distant rumbles, dripping water), increase the particle fog in the dungeon corridor for a dynamic, audio-reactive atmosphere.
> - **FFT** on the Bard's performance to create a visual equalizer on the Bard's instrument, showing spectral bands as glowing runes during a song ability.
>
> **Wizard's Chess:**
> - **Envelope Follower** on the board ambience to pulse the board's magical glow: when the ambient hum peaks, the board's emissive material brightens slightly, making the board feel alive and responsive to its own sound.

#### MetaSound Patches

- Reusable sub-graphs that can be used as nodes in other MetaSounds
- Create: Content Browser > Sounds > MetaSound Patch
- Define custom inputs/outputs on the patch
- Insert into another MetaSound via the node palette

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Create a `MSP_DicePhysicsSound` patch with inputs for `RollForce` (float), `SurfaceType` (int), and `DiceCount` (int). Reuse this patch anywhere dice are rolled: ability checks, attack rolls, damage rolls. Each caller just provides different input values.
> - Create a `MSP_SpellCastLayer` patch with inputs for `Element` (int: 0=fire, 1=ice, 2=lightning, 3=holy) and `Intensity` (float). Reuse across all Wizard, Cleric, and Ranger ability MetaSounds. The patch internally routes to the correct elemental sound layer.
>
> **Wizard's Chess:**
> - Create a `MSP_PieceMovement` patch with inputs for `PieceWeight` (float, 0.0 for Pawn to 1.0 for King), `MoveDistance` (float), and `IsCapture` (bool). Every piece movement MetaSound reuses this patch, keeping the audio design consistent and easy to tweak globally.

---

### Sound Classes

Sound Classes organize sounds into categories with shared properties and mix behavior.

**Properties:**

| Property | Description |
|----------|-------------|
| `Volume` | Volume multiplier for all sounds in this class |
| `Pitch` | Pitch multiplier |
| `Low Pass Filter Frequency` | LPF cutoff for the class |
| `SFX Volume` | Specific SFX volume control |
| `Attenuation Distance Scale` | Scale factor for attenuation distances |
| `Is Music` | Flag for music-specific handling |
| `Is UI Sound` | Plays even when the game is paused |
| `Apply Ambient Volumes` | Whether Audio Volumes affect this class |
| `Always Play` | Bypass concurrency and virtualization (use sparingly) |
| `Child Classes` | Hierarchical: child classes inherit parent settings |

**Default hierarchy example:**
- Master (root)
  - Music
  - SFX
    - Ambience
    - Footsteps
    - Weapons
  - UI
  - Voice
    - Dialogue
    - VO

> **In your games:**
>
> **DnD Tabletop RPG:**
> Your Sound Class hierarchy should look like this:
> - Master
>   - Music (dungeon tracks, tavern themes, boss battle music; set `Is Music = true`)
>   - SFX
>     - Ambience (dungeon drips, wind, torch crackle)
>     - Combat (sword swings, shield blocks, spell impacts)
>     - Dice (all dice roll, bounce, and landing sounds; set `Always Play = true` so you never miss a roll)
>     - Tabletop (miniature movement, paper rustling, pencil scratching)
>   - UI (menu clicks, turn notifications, ability cooldown pings; set `Is UI Sound = true` so they play even when paused)
>   - Voice
>     - DM_Narration (the AI DM's voice lines)
>     - CharacterVO (Warrior battle cries, Rogue quips, Cleric prayers)
>
> **Wizard's Chess:**
> - Master
>   - Music (match theme, victory fanfare, tension building tracks)
>   - SFX
>     - PieceMovement (sliding, flying, landing sounds)
>     - PieceCapture (shatter, crumble, magical burst)
>     - BoardAmbience (magical hum, crackling energy)
>   - UI (move confirmation, check warning, checkmate announcement; `Is UI Sound = true`)

---

### Sound Mixes

Sound Mixes modify Sound Class properties dynamically (e.g., ducking music when dialogue plays).

**Creating a Sound Mix:**
- Content Browser > Right-click > Sounds > Sound Mix

**Properties:**
- `Sound Class Effects`: Array of entries, each containing:
  - `Sound Class`: The class to modify
  - `Volume Adjuster`: Multiplier applied to the class volume
  - `Pitch Adjuster`: Multiplier applied to the class pitch
  - `Fade In Time`: Seconds to fade in the adjustment
  - `Fade Out Time`: Seconds to fade out when the mix is deactivated
  - `Apply to Children`: Propagate to child Sound Classes

**Activating a Sound Mix:**

Blueprint: `Push Sound Mix Modifier` / `Pop Sound Mix Modifier`

```cpp
// C++
UGameplayStatics::PushSoundMixModifier(WorldContext, MySoundMix);
UGameplayStatics::PopSoundMixModifier(WorldContext, MySoundMix);
// Clear all
UGameplayStatics::ClearSoundMixModifiers(WorldContext);
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **DM Narration Mix**: When the AI DM speaks, push a Sound Mix that ducks Music to 0.3 volume and Combat SFX to 0.5 volume with a 0.5s fade-in. Pop it when narration ends. This ensures the DM's voice cuts through clearly.
> - **Boss Encounter Mix**: Push a mix that boosts Music to 1.2 (louder, more dramatic) and reduces Ambience to 0.2 when a Dragon or boss fight triggers. The music takes center stage.
> - **Tabletop View Mix**: When the camera is zoomed out to the tabletop view, push a mix that lowers all 3D dungeon SFX (Combat, Ambience) to 0.1 and boosts Tabletop sounds (miniature clicks, dice) to 1.0. Pop it when zooming back into the dungeon.
>
> **Wizard's Chess:**
> - **Capture Mix**: On piece capture, push a mix that ducks Music and BoardAmbience to 0.3 for 0.5 seconds so the shatter sound plays prominently. Use a short `Fade Out Time` (0.8s) so the ambience returns quickly.
> - **Check/Checkmate Mix**: Push a dramatic mix that boosts Music to 1.3, ducks PieceMovement to 0.2, and lets the announcement sound dominate. `Apply to Children = true` to catch all SFX subcategories.

---

### Sound Concurrency

Sound Concurrency controls how many instances of a sound (or group of sounds) can play simultaneously.

**Properties:**

| Property | Description |
|----------|-------------|
| `Max Count` | Maximum simultaneous voices |
| `Resolution Rule` | What to do when max is exceeded: Stop Oldest, Stop Farthest, Stop Lowest Priority, Stop Quietest, Stop Lowest Priority then Oldest |
| `Volume Scale Mode` | How volume scales with concurrency: Default, Distance, Priority |
| `Max Volume Scale` | Maximum volume scale when concurrency is active |
| `Limit to Owner` | Whether the limit applies per-owner or globally |
| `Retrigger` | Whether stopped sounds can immediately retrigger |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Goblin voice concurrency**: Set `Max Count = 4` with `Resolution Rule = Stop Farthest`. In a room with 10 Goblins, only the 4 closest are audible, preventing a cacophony. The farthest Goblin sounds drop off naturally.
> - **Sword clash concurrency**: `Max Count = 6`, `Resolution Rule = Stop Quietest`. During a multi-enemy melee with the Warrior, the 6 loudest impacts play. Quieter glancing blows get culled first.
> - **Dice bounce concurrency**: `Max Count = 8` per owner, `Limit to Owner = true`, `Retrigger = true`. Each die can bounce up to 8 times before oldest bounces are culled. Since it is per-owner, multiple dice rolling simultaneously each get their own 8-voice budget.
>
> **Wizard's Chess:**
> - **Debris concurrency**: `Max Count = 10`, `Resolution Rule = Stop Oldest`. When a piece shatters into many fragments, cap the debris chunk sounds at 10 simultaneous voices. Oldest debris sounds fade as new chunks land.
> - **Piece slide concurrency**: `Max Count = 2` globally. Only 2 pieces can slide at once (one moving, one captured piece flying off). This prevents audio overload during complex animations.

---

### Attenuation

Sound Attenuation controls how audio falls off with distance between the source and listener.

#### Distance Algorithms

| Algorithm | Description |
|-----------|-------------|
| `Linear` | Linear falloff from inner radius to falloff distance |
| `Logarithmic` | Logarithmic falloff (more natural, louder near source) |
| `Natural Sound` | Based on the inverse square law; most realistic |
| `Log Reverse` | Inverse of logarithmic (quiet near, louder far) |
| `Custom` | User-defined curve via a Float Curve asset |
| `None` | No distance attenuation |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Natural Sound** for dungeon footsteps, dripping water, and torch crackle. The inverse square law feels realistic in stone corridors where sound bounces off walls and falls off naturally.
> - **Logarithmic** for combat impacts (sword hits, spell explosions). These need to be loud up close and drop quickly, so nearby fights feel impactful while distant battles stay subtle.
> - **Custom curve** for the tabletop-to-3D transition sounds: design a curve that keeps tabletop miniature sounds audible at the overhead view distance but drops them sharply once the camera zooms below table level.
> - **None** for the AI DM narration. The DM voice is non-diegetic (not coming from a location in the world), so it should play at consistent volume regardless of camera position.
>
> **Wizard's Chess:**
> - **Natural Sound** for piece movement slides and captures. The camera is relatively close to the board, so realistic falloff works well.
> - **None** for the board's ambient magical hum. This is atmospheric and should be consistent volume everywhere.
> - **Custom curve** for debris: design a curve with a sharp initial drop so flying fragments get quiet fast, preventing distant debris from cluttering the mix.

#### Attenuation Shapes

| Shape | Description | Properties |
|-------|-------------|------------|
| `Sphere` | Spherical falloff from a point | Inner Radius, Falloff Distance |
| `Capsule` | Capsule-shaped falloff (cylinder + hemispheres) | Inner Radius, Capsule Half Height, Falloff Distance |
| `Box` | Box-shaped falloff | Extents (X, Y, Z), Falloff Distance |
| `Cone` | Conical falloff with directional bias | Inner Angle, Outer Angle, Falloff Distance, Falloff Angle |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Sphere** for point-source sounds: a torch on the wall, a Goblin campfire, a magical rune glowing on the floor. Simple and effective for localized dungeon sounds.
> - **Box** for room-sized ambience: define a box matching the dungeon room's dimensions, so the entire room interior has full-volume ambient sound that fades as you exit.
> - **Capsule** for long dungeon corridors: a capsule shape stretched along the hallway lets the dripping echo or wind sound fill the corridor's length naturally.
> - **Cone** for the Dragon's roar: the roar is loudest in front of the Dragon's mouth (inner cone) and quieter behind its head. Players flanking the Dragon hear a muffled version.
>
> **Wizard's Chess:**
> - **Box** for the entire chessboard ambient hum: match the box to the board's dimensions so the magical ambience fills the playing area evenly.
> - **Sphere** for individual piece sounds: each piece's movement and capture audio emanates from its position on the board as a simple spherical source.

#### Spatialization

| Property | Description |
|----------|-------------|
| `Spatialize` | Enable 3D positioning |
| `Spatialization Algorithm` | Panning (default) or Binaural (HRTF) |
| `3D Stereo Spread` | Spread angle for stereo sources |
| `Spatialization Plugin Settings` | Custom settings for third-party spatialization plugins (e.g., Steam Audio, Resonance Audio) |
| `Occlusion` | Enable/disable geometry occlusion |
| `Occlusion Trace Channel` | Collision channel for occlusion traces |
| `Low Pass Filter Frequency at Max` | LPF applied at maximum attenuation distance |
| `High Pass Filter Frequency at Max` | HPF applied at maximum attenuation distance |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Enable **Binaural (HRTF)** spatialization for headphone players. When a Skeleton rattles behind the player or a Wraith whispers from the left, HRTF makes it feel like the sound is truly positioned in 3D space around the listener's head.
> - Enable **Occlusion** for dungeon sounds and set the trace channel to `Visibility`. Sounds behind dungeon walls (a Goblin patrol in the next room) will be muffled by the stone geometry. This rewards the Rogue's scouting, because you can hear enemies before seeing them but only faintly through walls.
> - Set **Low Pass Filter Frequency at Max** to 800 Hz for distant combat sounds, so faraway sword clashes sound muted and bassy, like hearing a fight several rooms away.
>
> **Wizard's Chess:**
> - Use **Panning** (default) spatialization for all board sounds. The camera orbits the board at a fixed distance, so standard panning gives good left-right positional audio as pieces move across the board.
> - **Occlusion** is less useful here since the board is open, but if you add environmental set dressing (pillars, archways around the chess room), enable it so the room's architecture subtly affects how board sounds reach the camera.

#### Attenuation Settings Asset

- Content Browser > Right-click > Sounds > Sound Attenuation
- Reusable across multiple Sound Cues, MetaSounds, and Audio Components
- Can be overridden per-component or per-cue

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Create reusable attenuation presets: `ATT_DungeonSmall` (inner 200, falloff 1500) for torches and drips, `ATT_DungeonLarge` (inner 500, falloff 4000) for room ambience, `ATT_Combat` (inner 100, falloff 2000) for weapon impacts. Apply these consistently across all dungeon levels for uniform audio feel.
>
> **Wizard's Chess:**
> - Create `ATT_ChessBoard` (inner 50, falloff 800) for all on-board piece sounds, and `ATT_ChessRoom` (inner 200, falloff 2000) for room ambience. Reuse across every piece type and capture effect.

---

### Audio Volumes

Audio Volumes are level-placed volumes that modify audio behavior for listeners or sources inside them.

**Properties:**

| Property | Description |
|----------|-------------|
| `Priority` | Higher priority volumes override lower ones when overlapping |
| `Apply Reverb` | Enable reverb for this volume |
| `Reverb Effect` | The Reverb Effect asset to apply |
| `Volume` | Reverb send amount (0.0 to 1.0) |
| `Fade Time` | Seconds to crossfade when entering/leaving |
| `Enabled` | Toggle the volume on/off |
| `Apply Interior Settings` | Enable interior filtering |
| `Interior Settings`:
  - `Interior Volume` | Volume multiplier for sounds inside when listener is inside |
  - `Interior Time` | Fade time for interior transition |
  - `Exterior Volume` | Volume for sounds inside when listener is outside |
  - `Exterior Time` | Fade time for exterior transition |
  - `Interior LPF` | Low-pass filter applied to sounds inside |
  - `Exterior LPF` | Low-pass filter for sounds heard from outside |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - Place an **Audio Volume** in each dungeon room. Small stone rooms get a tight reverb (short decay, high density). Large caverns get a cavernous reverb (long decay, low density). The 1-second `Fade Time` crossfades smoothly as the player walks between rooms.
> - Use **Interior Settings** for dungeon rooms: sounds inside a room (Goblin patrol, treasure chest opening) play at full volume when the player is inside, but are filtered with `Exterior LPF = 1200 Hz` and `Exterior Volume = 0.3` when the player is in an adjacent corridor. This gives the player audio cues about nearby rooms without full clarity.
> - Place a **high-priority Audio Volume** over the tabletop area with a dry, neutral reverb. When the camera zooms out to the tabletop view, this volume overrides all dungeon reverbs so the tabletop sounds clean and intimate.
>
> **Wizard's Chess:**
> - Place one Audio Volume covering the chess room with a grand hall reverb: `Decay Time = 2.5s`, `Density = 0.8`, `Diffusion = 0.9`. Every piece slide, capture, and announcement gets that regal, echoing hall treatment.
> - Set `Fade Time = 0.5s` so if the camera ever pulls outside the room (e.g., a dramatic zoom-out on checkmate), the reverb fades out gracefully.

---

### Reverb Effects

**Creating a Reverb Effect:**
- Content Browser > Right-click > Sounds > Reverb Effect

**Properties:**

| Property | Description |
|----------|-------------|
| `Density` | Echo density (0.0 to 1.0) |
| `Diffusion` | Echo diffusion / scattering (0.0 to 1.0) |
| `Gain` | Overall reverb gain |
| `Gain HF` | High-frequency gain |
| `Decay Time` | Reverb tail length in seconds |
| `Decay HF Ratio` | High-frequency decay ratio relative to overall decay |
| `Reflections Gain` | Early reflections level |
| `Reflections Delay` | Delay before early reflections (seconds) |
| `Late Gain` | Late reverberation level |
| `Late Delay` | Delay before late reverberation (seconds) |
| `Air Absorption HF` | High-frequency absorption simulating air |
| `Room Rolloff Factor` | Distance-based reverb rolloff |

> **In your games:**
>
> **DnD Tabletop RPG:**
> Create a library of reverb presets for different dungeon environments:
> - **REV_StoneCorridor**: `Density = 0.6`, `Decay Time = 1.5s`, `Reflections Gain = 0.8`, `Reflections Delay = 0.01`. Tight early reflections off narrow stone walls.
> - **REV_LargeCavern**: `Density = 0.3`, `Decay Time = 4.0s`, `Reflections Delay = 0.05`, `Late Gain = 0.7`. Big echoey space where Dragon roars rumble for seconds.
> - **REV_Tavern**: `Density = 0.9`, `Decay Time = 0.8s`, `Diffusion = 0.9`, `Gain HF = 0.6`. Warm, diffuse, short reverb for a cozy wooden interior.
> - **REV_CryptTomb**: `Density = 0.4`, `Decay Time = 3.0s`, `Gain HF = 0.3`, `Air Absorption HF = 0.5`. Dark, damp, with high frequencies absorbed by cold stone. Where you fight Skeletons and Wraiths.
>
> **Wizard's Chess:**
> - **REV_GrandHall**: `Density = 0.7`, `Decay Time = 2.5s`, `Diffusion = 0.85`, `Reflections Gain = 0.6`, `Late Gain = 0.8`. A majestic reverb for the chess chamber. Piece captures echo through the hall, and the magical hum gains depth.
> - Set `Decay HF Ratio = 0.6` so high frequencies die faster than lows, giving stone debris impacts a deep, weighty tail.

---

### Ambient Sounds and Audio Components

**Ambient Sound Actor:**
- Place in the level: Place Actors panel > All Classes > Ambient Sound
- Assign a Sound Cue, MetaSound, or Sound Wave
- Properties include attenuation, spatialization, auto-activate, and volume/pitch modifiers

**Audio Component:**
- Add to any Actor as a component
- `UAudioComponent` in C++
- Key functions:
  - `Play()`, `Stop()`, `FadeIn()`, `FadeOut()`
  - `SetSound()`: Change the sound asset at runtime
  - `SetFloatParameter()`, `SetBoolParameter()`, `SetIntParameter()`: Set parameters for MetaSounds or Sound Cue parameter nodes
  - `SetVolumeMultiplier()`, `SetPitchMultiplier()`
  - `OnAudioFinished`: Delegate fired when playback ends

```cpp
UAudioComponent* AudioComp = NewObject<UAudioComponent>(this);
AudioComp->SetSound(MySoundCue);
AudioComp->SetWorldLocation(GetActorLocation());
AudioComp->SetFloatParameter(FName("Intensity"), 0.8f);
AudioComp->Play();
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Ambient Sound Actors** placed throughout dungeons: torches on walls (looping fire crackle with sphere attenuation), dripping water in cave sections, wind howling through open grates, chains rattling in prison cells. Auto-activate on level load for instant atmosphere.
> - **Audio Components** on character Actors: each class (Warrior, Rogue, Cleric, Wizard, Ranger, Bard) has an Audio Component for footsteps. Use `SetFloatParameter("StealthFactor", RogueStealthLevel)` to dynamically reduce footstep volume when the Rogue is sneaking.
> - **Audio Component** on the dice Actor: call `SetSound()` to swap between different dice sound sets (metal dice, wooden dice, crystal dice) based on player preference. Use `SetFloatParameter("RollForce", ForceValue)` to scale bounce intensity.
> - **FadeIn/FadeOut** for combat music: when enemies are detected, `FadeIn(2.0f)` the battle music Audio Component. When all enemies are defeated, `FadeOut(3.0f)` back to dungeon ambience.
>
> **Wizard's Chess:**
> - **Ambient Sound Actor** at the center of the board for the magical hum: looping MetaSound with box attenuation matching the board dimensions.
> - **Audio Component** on each chess piece Actor: use `SetSound()` to assign piece-specific movement sounds (heavy stone grind for Rook, lighter slide for Bishop). Call `Play()` when the piece starts moving and bind `OnAudioFinished` to trigger the landing sound.
> - **SetPitchMultiplier()** based on piece type: Pawns at pitch 1.2 (small, light), King at 0.7 (deep, heavy). This adds variety without needing entirely separate sound assets for each piece.

---

### Quartz (Music Timing System)

Quartz provides sample-accurate music timing and synchronization. It handles beat/bar quantization, tempo management, and Blueprint-accessible timing events.

**Core concepts:**
- **Quartz Clock**: A tempo source that drives quantization
- **Quantization Boundary**: Beat divisions where events can be scheduled (1/1, 1/2, 1/4, 1/8, 1/16, etc.)
- **Quartz Subsystem**: Global manager for all clocks

**Setting up a Quartz Clock:**

Blueprint:
1. `Get Quartz Subsystem` > `Create New Clock`
2. Set `Clock Settings`:
   - `Time Signature`: Numerator and Denominator (e.g., 4/4, 3/4, 6/8)
   - `Beats Per Minute`: Tempo
3. `Subscribe to Quantization Event` to receive callbacks on specific beat divisions

C++:
```cpp
UQuartzSubsystem* QuartzSubsystem = GetWorld()->GetSubsystem<UQuartzSubsystem>();

FQuartzClockSettings ClockSettings;
ClockSettings.TimeSignature.NumBeats = 4;
ClockSettings.TimeSignature.BeatType = EQuartzTimeSignatureQuantization::QuarterNote;

FName ClockName = FName("MusicClock");
QuartzSubsystem->CreateNewClock(this, ClockName, ClockSettings);

// Set tempo
FQuartzQuantizationBoundary Boundary;
Boundary.Quantization = EQuartzCommandQuantization::Bar;

UQuartzClockHandle* Clock = QuartzSubsystem->GetHandleForClock(this, ClockName);
Clock->SetBeatsPerMinute(this, Boundary, FOnQuartzCommandEvent(), 120.f);
```

**Scheduling audio to the beat:**
```cpp
// Play sound quantized to the next bar
UAudioComponent* AC = UGameplayStatics::SpawnSound2D(this, MySoundWave);
FQuartzQuantizationBoundary BarBoundary;
BarBoundary.Quantization = EQuartzCommandQuantization::Bar;
AC->PlayQuantized(this, Clock, BarBoundary, FOnQuartzCommandEvent());
```

**Quantization events in Blueprint:**
- `Subscribe to Quantization Event`: Choose Bar, Beat, Half Beat, Quarter Beat, etc.
- Delegates: `On Quantization Event`, `On Clock Started`, `On Clock Paused`

**Clock control:**
- `Start Clock`, `Stop Clock`, `Pause Clock`, `Resume Clock`
- `Reset Transport`: Reset the clock to beat 0, bar 0
- `Set Beats Per Minute`: Change tempo (quantized to a boundary)
- `Set Time Signature`: Change time signature

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Bard ability system**: Create a Quartz Clock at 100 BPM in 4/4 time for the Bard's "Inspiring Song" ability. Subscribe to Beat events to pulse a healing particle effect on each beat. Schedule the lute melody, drum, and vocal layers using `PlayQuantized` to the Bar boundary so they always start in sync, even if activated at different moments during gameplay.
> - **Turn-based combat rhythm**: Set up a clock at 60 BPM. On each Beat event, play a subtle tick sound and pulse the active character's highlight ring. This gives turn-based combat a rhythmic pulse that feels intentional, not static.
> - **Boss phase transitions**: When the Dragon enters phase 2 (below 50% health), use `Set Beats Per Minute` to increase the combat music from 90 BPM to 130 BPM, quantized to the Bar boundary so the tempo shift happens cleanly at the start of the next measure.
>
> **Wizard's Chess:**
> - **Match tension clock**: Start at 80 BPM during the opening. As pieces are captured and the match intensifies, increase BPM to 110. Subscribe to Beat events to pulse the board's ambient glow and trigger subtle ticking sounds, creating a sense of mounting pressure like a real chess clock.
> - **Checkmate sequence**: On checkmate, `Pause Clock` to freeze the rhythmic tension, play a dramatic silence for 1 second, then fire the fanfare. The sudden absence of rhythm makes the announcement hit harder.

---

### Audio Analysis and Spectrum Analysis

**Audio Analysis:**
- `Get Magnitude for Frequencies`: Returns amplitude at specific frequencies
- `Get Normalized Magnitude for Frequencies`: Returns normalized (0-1) amplitude
- Available on Audio Components and through Blueprint audio functions

**Spectrum Analysis:**
- Enable on an Audio Component: `bEnableSpectralAnalysis = true`
- Configure frequency bands via `SpectralAnalysisSettings`
- Bind to `OnAudioSpectralAnalysis` delegate for per-frame spectrum data
- FFT sizes: 256, 512, 1024, 2048, 4096 (larger = more frequency resolution, more latency)

**Blueprint nodes:**
- `Start Analyzing Output` / `Stop Analyzing Output`
- `Get Magnitude for Frequencies` returns an array of amplitude values
- `Get Phase for Frequencies` returns phase data

**Console commands:**
- `au.Debug.SoundWaves 1`: Show active sound wave debug info
- `au.Debug.Sounds 1`: Show all active sounds
- `au.Debug.AudioMixer.EnableDetailedStats 1`: Show audio mixer statistics

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Audio-reactive Bard visuals**: Enable spectral analysis on the Bard's music Audio Component. Sample low (bass), mid, and high frequency bands. Use the bass magnitude to scale a ground pulse particle, mids to drive light flicker intensity, and highs to sparkle rune particles. The Bard's performance becomes a visual light show that reacts to the actual music playing.
> - **Debug during development**: Use `au.Debug.Sounds 1` to verify that dungeon ambient sounds are properly culled at distance and that concurrency settings are working. If you hear audio popping in a room full of Goblins, check `au.Debug.AudioMixer.EnableDetailedStats 1` for voice count spikes.
>
> **Wizard's Chess:**
> - **Board glow tied to music**: Enable spectral analysis on the ambient board MetaSound. Pull the bass magnitude (50-200 Hz) and use it to modulate the board's emissive material intensity. The board breathes with the music.
> - **Capture flash**: On piece capture, sample the explosion sound's peak amplitude and use it to drive a post-process bloom intensity spike, creating a visual flash that scales with how loud the destruction actually is.

---
