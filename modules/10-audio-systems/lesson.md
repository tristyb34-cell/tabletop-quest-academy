# Module 10: Audio Systems in UE5

## Introduction

Close your eyes and imagine a dungeon. You probably did not picture the walls and torches first. You heard the drip of water echoing off stone, the crackle of a distant fire, the low rumble of something moving in the dark. Sound creates atmosphere more powerfully than visuals ever could. A beautifully rendered room with no audio feels lifeless. A dark screen with the right audio feels terrifying.

For our DnD tabletop-to-3D RPG, audio serves multiple critical roles. It bridges the tabletop and 3D perspectives with crossfading ambient sounds. It punctuates gameplay moments: the rattle of dice, the clash of a sword, the hum of a spell charging. It guides emotion through dynamic music that shifts between exploration and combat. This module covers every audio tool UE5 provides and how to use them for our game.

---

## Importing Audio Assets

### Supported Formats

UE5 supports these audio formats:
- **WAV**: Uncompressed, highest quality, largest file size. Best for short sound effects (footsteps, weapon impacts, UI clicks).
- **OGG**: Compressed, good quality, smaller files. Best for music and longer ambient tracks.

To import: drag audio files into the Content Browser, or use the Import button. UE5 will create a **Sound Wave** asset for each file.

### Sound Wave Settings

After importing, open the Sound Wave asset to configure:
- **Looping**: Check this for ambient sounds and music that should repeat
- **Volume**: Base volume multiplier (0.0 to 1.0)
- **Pitch**: Base pitch multiplier (1.0 = normal, 0.5 = octave lower, 2.0 = octave higher)
- **Compression**: Quality vs file size tradeoff. Higher quality = larger package size. For most game sounds, the default is fine.

### Organizing Audio Assets

Create a clear folder structure:
```
Content/
  Audio/
    Music/
      Combat/
      Exploration/
      Tavern/
    SFX/
      Weapons/
      Spells/
      Footsteps/
      UI/
      Dice/
    Ambient/
      Dungeon/
      Forest/
      Town/
    Voice/
      NPCs/
      Narration/
```

---

## Sound Cues: Audio Processing Chains

### What Is a Sound Cue?

A Sound Cue is a node-based audio asset that lets you process, combine, and manipulate sounds before they play. Think of it like a music production mixing board: you can take raw audio files and chain them through effects, randomizers, and modulators before sending the result to the speakers.

### Creating a Sound Cue

1. Right-click in Content Browser: **Sounds > Sound Cue**
2. Name it (e.g., `SC_SwordSwing`, `SC_FootstepStone`)
3. Double-click to open the Sound Cue Editor

### Key Nodes

**Wave Player**: The starting point. References a Sound Wave asset and outputs the raw audio.

**Random**: Takes multiple Wave Player inputs and picks one randomly each time the cue plays. Essential for variety. A sword swing that always sounds the same is noticeable and annoying. Connect 3-5 different swing sounds to a Random node and every swing sounds slightly different.

**Modulator**: Adjusts volume and pitch within a range. Add slight randomization (pitch 0.95 to 1.05, volume 0.9 to 1.0) to make repeated sounds feel less mechanical.

**Mixer**: Combines multiple audio streams into one. Use this to layer sounds: a sword hit might combine a metallic clang, a whoosh, and a subtle bass thud.

**Attenuation**: Applies distance-based falloff (though this is usually handled by the Attenuation Settings on the component, not inside the cue).

**Looping**: Sets the cue to loop. Useful for ambient sounds within a cue.

**Concatenator**: Plays sounds in sequence, one after another. Useful for multi-part sounds: a spell might have a charge-up sound, then a release sound, then an impact sound.

**Crossfade by Param**: Blends between two sounds based on a parameter. This is powerful for dynamic audio: blend between calm and intense versions of a music track based on a "danger level" parameter.

### Example: Footstep Sound Cue

```
Wave Player: Footstep_Stone_01 ---\
Wave Player: Footstep_Stone_02 -----> Random ---> Modulator (Pitch: 0.95-1.05) ---> Output
Wave Player: Footstep_Stone_03 ---/                (Volume: 0.85-1.0)
```

Every footstep picks a random sound and applies slight pitch and volume variation. The player never hears the same footstep twice.

---

## Sound Attenuation: Distance-Based Fading

### The Concept

In real life, sounds get quieter as you move away from them. A campfire crackles loudly when you are next to it and fades to silence a hundred meters away. Sound Attenuation in UE5 replicates this behavior.

### Creating an Attenuation Settings Asset

1. Right-click in Content Browser: **Sounds > Sound Attenuation**
2. Name it (e.g., `ATT_SmallRoom`, `ATT_OutdoorAmbient`, `ATT_LargeExplosion`)

### Key Settings

**Inner Radius**: The distance from the sound source where audio plays at full volume. Within this radius, there is no falloff.

**Falloff Distance**: The distance over which the sound fades from full volume to silence. The total audible range is Inner Radius + Falloff Distance.

**Attenuation Function**: How the volume decreases over distance:
- **Linear**: Steady, even decrease. Simple and predictable.
- **Logarithmic**: Drops quickly at first, then slowly. More realistic for most natural sounds.
- **Inverse**: Drops sharply near the source, gentler at distance. Good for point sources like torches.
- **Natural Sound**: UE5's physically-based model. Most realistic but can be harder to tune.

**Spatialization**: Controls how the sound is positioned in 3D space:
- **Panning**: The sound moves between left and right speakers based on direction. This is the default and works well for most sounds.
- **Binaural**: More immersive 3D positioning using HRTF (Head-Related Transfer Function). Better with headphones. Enable for important directional sounds.

### Attenuation Presets for Our Game

| Preset | Inner Radius | Falloff | Use Case |
|--------|-------------|---------|----------|
| Tiny | 50 | 200 | UI clicks, dice rolls (when spatialized) |
| Small | 100 | 500 | Footsteps, weapon impacts, door creaks |
| Medium | 200 | 1500 | Campfire, fountain, NPC conversation |
| Large | 500 | 3000 | Combat music bleed, large creature roar |
| Huge | 1000 | 5000 | Thunder, dragon roar, explosion |

---

## Sound Classes and Sound Mix: Volume Categories

### Sound Classes

Sound Classes are categories that group sounds by type. Think of them like channels on a mixing board: you have one fader for Music, one for Sound Effects, one for Ambient, one for UI, and one for Voice. The player can adjust each independently in the settings menu.

Create Sound Classes:
- `SC_Music`: All music tracks
- `SC_SFX`: Combat sounds, footsteps, environmental interactions
- `SC_Ambient`: Background atmosphere (wind, rain, dungeon drips)
- `SC_UI`: Menu clicks, notification sounds, dice rolls
- `SC_Voice`: NPC dialogue, DM narration

Assign a Sound Class to each Sound Cue or Sound Wave in its properties.

### Sound Mix

A Sound Mix is a preset that adjusts the volume of multiple Sound Classes at once. Think of it like a "scene" button on a sound board that sets all the faders to predefined positions.

**Exploration Mix:**
- Music: 70%
- Ambient: 100%
- SFX: 80%
- Voice: 100%
- UI: 90%

**Combat Mix:**
- Music: 100%
- Ambient: 40% (ambience fades during intense combat)
- SFX: 100%
- Voice: 100%
- UI: 90%

**Dialogue Mix:**
- Music: 30% (music ducks during conversation)
- Ambient: 50%
- SFX: 40%
- Voice: 100%
- UI: 60%

**Cutscene Mix:**
- Music: 100%
- Ambient: 80%
- SFX: 80%
- Voice: 100%
- UI: 0% (no UI sounds during cutscenes)

### Applying Sound Mixes

Use the **Push Sound Mix Modifier** and **Pop Sound Mix Modifier** nodes:
- When combat starts: Push the Combat Mix
- When combat ends: Pop the Combat Mix (reverts to the previous mix)
- When dialogue begins: Push the Dialogue Mix
- Mixes stack, so popping returns to the previous state

---

## MetaSounds: UE5's New Audio Engine

### What Is MetaSounds?

MetaSounds is UE5's node-based audio synthesis and processing system. While Sound Cues chain together pre-recorded audio files, MetaSounds can generate audio from scratch using oscillators, filters, and envelopes, just like a synthesizer. It can also process recorded audio with far more power than Sound Cues.

Think of Sound Cues as a DJ mixing pre-recorded tracks. MetaSounds is a full music production studio where you can create sounds from nothing, process them in any way imaginable, and respond to game parameters in real time.

### When to Use MetaSounds vs Sound Cues

- **Sound Cues**: Quick and simple. Good for basic randomization, mixing, and modulation of pre-recorded sounds. Most of your game audio will use Sound Cues.
- **MetaSounds**: Powerful and flexible. Use for procedural audio (wind that changes with speed, footsteps that respond to surface type and speed), complex music systems, and any sound that needs to react dynamically to many game parameters.

### MetaSounds Basics

1. Right-click in Content Browser: **Sounds > MetaSound Source**
2. Open it to see the MetaSounds graph editor
3. Key node categories:
   - **Generators**: Oscillators (sine, saw, square), noise generators
   - **Filters**: Low-pass, high-pass, band-pass (shape the tone)
   - **Envelopes**: ADSR (Attack, Decay, Sustain, Release) for shaping volume over time
   - **Wave Players**: Play imported Sound Wave assets (same as Sound Cues)
   - **Math**: Add, multiply, clamp, interpolate audio signals
   - **Triggers**: Start, stop, and gate audio playback

### MetaSounds for Our Game

Practical uses:
- **Dynamic footsteps**: A MetaSound that takes surface type (stone, wood, grass, water) and movement speed as inputs, selecting the right sample set and adjusting pitch/volume accordingly
- **Spell charge-up**: A synthesized rising tone that increases in pitch and volume as the spell charges, then cuts to a pre-recorded explosion sound on release
- **Heartbeat at low HP**: A synthesized heartbeat that speeds up as health decreases, creating tension without needing to record multiple heartbeat samples at different speeds

---

## Ambient Sound Actors

### Placing Ambient Sounds

UE5 provides **Ambient Sound** actors that you place in the world. Each one plays a sound at its location with attenuation.

1. From the Place Actors panel, drag an **Ambient Sound** into the level
2. Set its **Sound** property to a Sound Cue, Sound Wave, or MetaSound
3. Set its **Attenuation Settings** (or override inline)
4. Configure **Auto Activate**: if true, it starts playing when the level loads

### Common Ambient Sources for Our Game

- **Dungeon**: Dripping water (placed at specific drip points), torch crackle (at each torch), distant echoes (placed at hallway junctions), rat squeaks (random timing)
- **Tavern**: Fireplace crackle, crowd chatter (low-volume background), clinking mugs, creaking floorboards (triggered by NPC movement)
- **Forest**: Bird calls, wind through leaves, creek water, insect buzz, distant animal sounds
- **Town**: Market chatter, blacksmith hammering, horse hooves on cobblestone, bell tower chimes

### Audio Volumes

Audio Volumes are 3D regions that modify audio within them:

**Reverb Volumes**: Apply reverb effects inside a defined space. Place them inside caves, large halls, or any enclosed space to add appropriate echo and reflection.

- Small stone room: Short reverb, moderate wet/dry ratio
- Large cathedral: Long reverb, heavy wet signal
- Outdoor: Minimal reverb (or none)
- Cave: Medium reverb with high density, slight delay

**Sound Mix Volumes**: Automatically push a Sound Mix when the player enters. For example, entering a tavern automatically pushes the "Indoor Tavern" mix that boosts ambient and reduces outdoor sounds.

---

## Audio Crossfading: The Tabletop Transition

### The Challenge

Our game has two perspectives: the tabletop room (where the DM and players sit around a table) and the 3D world (the dungeon, forest, or town the characters are exploring). When transitioning between them, the audio needs to crossfade smoothly. You cannot have tavern ambience snapping instantly to dungeon drips. The transition should feel like zooming into the game world.

### The Crossfade Approach

1. **Two ambient layers always running:**
   - Layer A: Tabletop room ambience (quiet room tone, paper shuffling, dice bag sounds)
   - Layer B: Game world ambience (dungeon drips, forest wind, town market)

2. **A blend parameter (0.0 to 1.0):**
   - 0.0 = fully tabletop (Layer A at 100%, Layer B at 0%)
   - 1.0 = fully game world (Layer A at 0%, Layer B at 100%)
   - Values between = a mix of both (during transition)

3. **During the camera transition:**
   - When the camera zooms from the tabletop into the 3D world, lerp the blend parameter from 0.0 to 1.0 over the duration of the transition (e.g., 2 seconds)
   - The tabletop ambience fades out while the game world ambience fades in
   - Reverse when zooming back to the tabletop

### Implementation

**Option 1: Sound Mix approach**
Create two Sound Mixes, one for tabletop and one for game world. Use timeline-driven mix transitions to blend between them.

**Option 2: Direct volume control**
Keep both ambient sounds playing. Use a Timeline node or Lerp to adjust their volumes based on the blend parameter.

**Option 3: MetaSounds crossfader**
Create a MetaSound with two input sources and a crossfade parameter. Route both ambient layers through it and control the parameter from gameplay code.

### Music Crossfade

The same principle applies to music:
- Tabletop has its own subtle background music (calm, atmospheric)
- The game world has context-dependent music (exploration, combat, town)
- During transition, crossfade between them
- You can even have a brief silence or a transitional sting (a short musical phrase) to punctuate the zoom

---

## Triggering Sounds from Gameplay Events

### The Event-Driven Approach

Most game sounds are triggered by events, not placed as persistent ambient sources. Here is how to trigger sounds from common gameplay events:

### Dice Rolls

When the player (or AI) rolls dice:
1. Play a dice rattle sound (randomized from 3-5 variations)
2. If the dice physically roll on the tabletop, trigger the sound from the dice actor's location
3. Add a brief delay, then play a result sound:
   - Natural 20: Triumphant chime or dramatic sting
   - Natural 1: Comedic failure sound or ominous tone
   - Normal result: Subtle click or tap

### Sword Hits and Weapon Impacts

From the weapon's Animation Montage or Notify:
1. **Swing**: Play a whoosh sound at the weapon's location (timed to the animation)
2. **Impact**: Play an impact sound at the hit location
   - Metal on metal: Clang with resonance
   - Metal on flesh: Thud with slight squelch
   - Blunt weapon: Heavy thump
3. Use the Random node in a Sound Cue for variety
4. Modulate pitch slightly based on weapon weight (heavier weapons = lower pitch)

### Spell Casting

Spells often have multiple audio phases:
1. **Begin cast**: A charging or gathering sound (looping, increasing intensity)
2. **Cast release**: The moment the spell fires (sharp, impactful)
3. **Travel**: If the spell is a projectile, a looping travel sound that moves with it
4. **Impact**: Explosion, healing chime, or buff application sound
5. **Lingering**: Area effects might have ongoing audio (fire burning, ice crackling)

### Footsteps

Trigger footsteps from Animation Notifies:
1. In the walk/run Animation Montage, add **Anim Notify** events at each foot-plant frame
2. The notify triggers a function that:
   - Does a line trace downward from the foot to detect the surface material (Physical Material)
   - Plays the appropriate footstep Sound Cue for that surface
3. Create Sound Cues for each surface: stone, wood, grass, water, carpet, metal, sand

### UI Sounds

Trigger from UI events:
- **Button hover**: Soft tick or subtle whoosh
- **Button click**: Satisfying click or tap
- **Menu open**: Swoosh or page turn
- **Menu close**: Reverse swoosh
- **Tab switch**: Quick tap
- **Error/invalid action**: Low buzz or denied sound
- **Ability cooldown ready**: Subtle chime notification

---

## Dynamic Music System

### The Concept

Static music (one track on loop) gets boring. Dynamic music responds to what is happening in the game. During exploration, the music is calm and atmospheric. When enemies appear, it builds tension. During combat, it becomes intense and driving. When the player wins, it swells triumphantly. All of this happens through seamless transitions, not hard cuts.

### Architecture: Horizontal Re-Sequencing

The most common approach for game music is **horizontal re-sequencing**. You compose music in segments (intro, loop A, loop B, transition, combat intro, combat loop, combat outro, victory sting) and the system plays the right segment based on game state.

```
State: Exploration
  Playing: Exploration_LoopA
  Transition trigger: Enemy detected

State: Tension
  Playing: Tension_Loop
  Transition trigger: Combat started

State: Combat
  Playing: Combat_Intro -> Combat_LoopA (repeating)
  Transition trigger: All enemies defeated

State: Victory
  Playing: Victory_Sting -> Exploration_LoopA
```

### Architecture: Vertical Layering

Another approach is **vertical layering**. You have multiple instrument tracks playing simultaneously, and you fade layers in and out based on game state.

- **Base layer**: Ambient pad (always playing)
- **Melody layer**: Gentle melody (fades in during exploration)
- **Percussion layer**: Rhythmic drums (fades in during tension)
- **Intensity layer**: Heavy instrumentation (fades in during combat)
- **Choir layer**: Epic vocals (fades in during boss fights)

All layers are synchronized (they play at the same tempo and bar position). Fading a layer in or out is seamless because the musical timing is always aligned.

### Implementation in UE5

**Using a Music Manager Blueprint:**

1. Create an actor `BP_MusicManager` placed in the persistent level
2. It holds references to all music segments as Audio Components
3. It has a `MusicState` enum (Exploration, Tension, Combat, Victory, Silence)
4. When the state changes, it:
   - Fades out the current segment over 1-2 seconds
   - Waits for a musically appropriate transition point (beat boundary)
   - Fades in the new segment
5. For vertical layering, all layers play from the start but most are at volume 0. The state change fades specific layers to volume 1.

**Using MetaSounds:**

MetaSounds can handle the entire music system in a single asset:
- Multiple wave players for different tracks
- Envelope followers for volume control
- Parameters for game state input
- Internal timing for beat-synchronized transitions

### Music for Our Game

| Game State | Music Style | Layers Active |
|-----------|-------------|--------------|
| Tabletop (pre-game) | Calm tavern, acoustic | Base + Melody |
| Exploration | Mysterious, ambient | Base + Melody + Light Percussion |
| Tension (enemy nearby) | Unsettling, building | Base + Percussion + Strings |
| Combat | Intense, rhythmic | Base + Percussion + Strings + Brass |
| Boss fight | Epic, dramatic | All layers including Choir |
| Victory | Triumphant, brief | Victory Sting, then back to Exploration |
| Defeat | Somber, brief | Defeat Sting, then silence |
| Town/safe area | Warm, folk | Different Base + Melody set |

---

## Reverb Volumes: Indoor/Outdoor Transitions

### Why Reverb Matters

Sound behaves differently indoors and outdoors. In a small stone room, every sound bounces off the walls and creates echo. Outdoors, sound dissipates into open air with little reflection. Getting this right makes spaces feel real.

### Setting Up Reverb Volumes

1. Place a **Audio Volume** in your level (from the Volumes category in Place Actors)
2. Size it to match the room or area
3. In the volume's properties, find **Reverb Settings**:
   - **Reverb Effect**: Choose a preset or create a custom one
   - **Volume**: How strong the reverb is (0.0 to 1.0)
   - **Fade Time**: How quickly the reverb transitions when entering/leaving

### Reverb Presets for Our Game

**Small Stone Room (dungeon cells, closets):**
- Short decay (0.5-1.0 seconds)
- Medium density
- Subtle effect, just enough to feel enclosed

**Large Hall (throne rooms, cathedrals, boss arenas):**
- Long decay (2.0-4.0 seconds)
- High density
- Prominent effect, sounds echo and linger

**Cave:**
- Medium decay (1.5-2.5 seconds)
- High density with pre-delay
- Sounds feel hollow and distant

**Outdoor:**
- Very short or no reverb
- Minimal density
- Sounds feel open and direct

**Tavern:**
- Short decay (0.3-0.8 seconds)
- Medium density
- Warm character, sounds feel cozy and contained

### Transition Between Reverb Zones

When the player walks from a dungeon corridor into a large hall, the reverb should transition smoothly. The **Fade Time** property controls this. Set it to 0.5 to 1.0 seconds for a natural shift. If it is instant (0 seconds), the reverb change is jarring and noticeable.

For doorways between very different spaces (indoor to outdoor), consider placing a narrow intermediate reverb volume in the doorway that blends the two environments.

---

## Practical Audio Setup Checklist

### For Every Level:

1. **Ambient foundation**: Place ambient sound actors for the base atmosphere (at least 3-5 per area)
2. **Reverb volumes**: Place audio volumes with reverb settings for every enclosed space
3. **Sound mix volumes**: Configure indoor/outdoor mix transitions
4. **Music trigger**: Set up the Music Manager to know what state this area represents
5. **Interactive sounds**: Ensure doors, chests, levers, and traps have associated audio

### For Every Character:

1. **Footstep system**: Animation Notifies linked to surface-aware footstep sounds
2. **Combat sounds**: Attack swings, impacts, blocks, and pain reactions
3. **Ability sounds**: Each ability has cast, travel, and impact audio
4. **Voice lines** (if applicable): Bark system for combat, exploration, and idle chatter
5. **Attenuation**: All character sounds use appropriate attenuation so distant characters are quiet

### For Every UI Screen:

1. **Open/close sounds**: Transition audio when screens appear and disappear
2. **Navigation sounds**: Hover and click sounds for buttons
3. **Feedback sounds**: Success, failure, and notification audio
4. **Dice sounds**: For any DnD check, roll, or random event

---

## Performance Considerations

### Voice Limits

Sound hardware has limits on how many sounds can play simultaneously (called "voices"). Typical limits are 32 to 128 voices. If you exceed this, the engine must decide which sounds to drop.

Configure **Sound Concurrency** settings to manage this:
- High priority sounds (music, nearby combat) always play
- Low priority sounds (distant ambient, footsteps) can be dropped
- Set maximum instances per sound (e.g., no more than 3 footstep sounds simultaneously)

### Streaming vs In-Memory

Short sounds (under 5 seconds) should be loaded entirely into memory for instant playback. Long sounds (music tracks, ambient loops) should be streamed from disk to save memory. Configure this in the Sound Wave's properties under **Loading Behavior**.

### Occlusion

Sound occlusion simulates sounds being blocked by walls and objects. If an enemy is behind a wall, their footsteps should sound muffled. UE5 supports audio occlusion, but it is expensive. Use it selectively:
- Enable for important gameplay sounds (enemy footsteps, NPC dialogue)
- Disable for ambient background sounds
- Disable for music (music is non-diegetic; it does not exist in the game world)

---

## Summary

Audio in UE5 is a layered system:

| System | Purpose | Analogy |
|--------|---------|---------|
| Sound Waves | Raw audio files | Ingredients |
| Sound Cues | Node-based audio processing | A recipe |
| MetaSounds | Advanced synthesis and processing | A full kitchen with custom tools |
| Attenuation | Distance-based volume falloff | How sound fades as you walk away |
| Sound Classes | Volume categories (Music, SFX, etc.) | Channels on a mixing board |
| Sound Mixes | Preset volume configurations | Scene presets on a mixing board |
| Ambient Sounds | Placed audio sources in the world | Speakers placed around a room |
| Reverb Volumes | Simulated room acoustics | The shape and material of a room |
| Dynamic Music | Music that responds to game state | A band that reads the room |

For our DnD game, audio ties everything together: the tabletop ambience grounds the framing device, the crossfade pulls players into the adventure, the dynamic music tracks the emotional arc of exploration and combat, and the detailed sound effects (dice, swords, spells, footsteps) make every action feel tangible. Get the audio right and the game will feel twice as immersive.
