# Module 10: Exercises - Sound and Music

## Exercise 1: Build the Tavern Soundscape

**Goal:** Create a warm, immersive ambient soundscape for Tabletop Quest's starting tavern.

**What you are building:** The first thing the player hears when they launch the game. A cozy room with a crackling fire, murmuring crowd, and occasional clinking mugs.

**Steps:**

1. Find or create these audio files (Freesound.org is a good free source):
   - Fireplace crackle (looping, 10-30 seconds)
   - Crowd murmur (looping, low volume, 30-60 seconds)
   - Mug clinking (3-4 short variations)
   - Wooden floor creak (3-4 short variations)
2. Import them into UE5 as Sound Waves
3. Create Sound Classes: `SC_Ambient` and `SC_SFX`
4. Create Sound Cues:
   - `SCue_FireCrackle`: The fire sound wave, set to loop, assigned to SC_Ambient
   - `SCue_CrowdMurmur`: The crowd sound wave, set to loop, lower volume (0.3), assigned to SC_Ambient
   - `SCue_MugClink`: Random node selecting from 3-4 variations, Modulator (pitch 0.95-1.05), assigned to SC_SFX
5. Create a Sound Attenuation asset `SA_RoomAmbient`: Inner Radius 200, Falloff 800
6. In your tavern level (or a test room), place Ambient Sound actors:
   - Fire crackle at the fireplace location with `SA_RoomAmbient`
   - Crowd murmur at the center of the room (non-spatialized or very large radius)
7. Create a `BP_RandomSoundEmitter` Blueprint that plays a random mug clink every 8-15 seconds. Place it near the bar area.
8. Add an **Audio Volume** covering the tavern interior with a small-room reverb preset
9. Play and listen. Adjust volumes until the fire is prominent but not overwhelming, the crowd is a background layer, and the mugs are occasional accents.

**Success criteria:** Standing in the tavern, you hear a consistent fire crackle from the fireplace direction, a soft crowd murmur, and occasional mug clinks from the bar. The reverb makes it sound like an enclosed room.

---

## Exercise 2: Build Surface-Based Footsteps

**Goal:** Create a footstep system where the player's footsteps change based on the surface they walk on.

**What you are building:** The footstep system for Tabletop Quest. Stone in dungeons, dirt on paths, wood in the tavern, grass in meadows.

**Steps:**

1. Create Physical Materials: `PM_Stone`, `PM_Dirt`, `PM_Wood`, `PM_Grass`
2. Assign them to your level materials (dungeon floor material uses PM_Stone, landscape grass layer uses PM_Grass, tavern floor uses PM_Wood)
3. Find or create footstep audio files: 4 variations each for stone, dirt, wood, and grass (16 total)
4. Import and create Sound Cues for each surface:
   - `SCue_Footstep_Stone`: Random node with 4 stone variations + Modulator (pitch 0.95-1.05, volume 0.9-1.0)
   - Repeat for Dirt, Wood, Grass
5. Create a Sound Attenuation `SA_Footstep`: Inner Radius 50, Falloff 800
6. In the player character's walk/run Animation Montage or Sequence, add **Animation Notifies** at each foot-down frame
7. Create a custom Animation Notify Blueprint `AN_Footstep`:
   - On Notify: Line Trace downward from the foot bone (200 units)
   - Get the Physical Material from the hit result
   - Switch on Physical Material to select the correct Sound Cue
   - Play Sound at Location using the hit location
8. Test by walking across different surfaces. Listen for the change.

**Success criteria:** Footsteps sound different on each surface. Walking from the tavern (wood) to the road (dirt) to the forest (grass) to the dungeon (stone) produces four distinct footstep characters. Each step sounds slightly different due to randomization.

---

## Exercise 3: Create Combat Sound Effects

**Goal:** Build layered sound effects for sword combat.

**What you are building:** The audio for melee combat in Tabletop Quest. Swing, impact, block, and critical hit sounds.

**Steps:**

1. Find or create these audio files:
   - Sword swing whoosh (3 variations)
   - Metal impact / armor hit (3 variations)
   - Flesh impact (3 variations, for unarmored enemies)
   - Shield block clang (2 variations)
   - Critical hit accent (a bright metallic "ting" + bass boom)
2. Create Sound Cues:
   - `SCue_SwordSwing`: Random from 3 whooshes, Modulator (pitch 0.9-1.1)
   - `SCue_SwordImpact_Armor`: Random from 3 impacts, Modulator (pitch 0.95-1.05)
   - `SCue_SwordImpact_Flesh`: Random from 3 impacts
   - `SCue_ShieldBlock`: Random from 2 clangs, higher volume
   - `SCue_CriticalHit`: Layer the critical accent on top of a normal impact (use a Mixer node)
3. In the sword attack Animation Montage:
   - Add a "Swing" notify at the start of the swing arc, playing `SCue_SwordSwing`
   - Add a "Hit" notify at the impact frame
4. In the Hit notify logic:
   - Check if the hit was blocked (play `SCue_ShieldBlock`)
   - Check if it was a critical (play `SCue_CriticalHit`)
   - Otherwise play `SCue_SwordImpact_Armor` or `_Flesh` based on target
5. Test by attacking enemies. Verify you hear the swing, then the impact, and that blocks and crits sound distinct.

**Success criteria:** A sword attack produces a swing sound followed by an impact. Blocking sounds different from hitting. Critical hits have an additional accent layer. Variation prevents repetition.

---

## Exercise 4: Build an Adaptive Music System

**Goal:** Create a music system that transitions between exploration and combat.

**What you are building:** The Music Manager for Tabletop Quest. Calm music during exploration, intense music during combat, smooth transitions between them.

**Steps:**

1. Find or create two music tracks:
   - Exploration theme (looping, calm, 60-90 seconds)
   - Combat theme (looping, intense, 60-90 seconds)
   - Optional: a 4-bar transition bridge between them
2. Import as Sound Waves, set both to Streaming (for memory efficiency)
3. Create a `BP_MusicManager` Blueprint Actor:
   - Add two Audio Components: `ExplorationMusic` and `CombatMusic`
   - Assign the respective Sound Waves
   - Set both to Auto Activate = false
4. Create a function `SetMusicState(NewState: Enum)`:
   - If NewState == Exploration: Fade in ExplorationMusic over 2 seconds, fade out CombatMusic over 2 seconds
   - If NewState == Combat: Fade in CombatMusic over 1 second, fade out ExplorationMusic over 1 second (faster transition into combat)
   - Use the **Fade In** and **Fade Out** nodes on Audio Components
5. Start the game with ExplorationMusic playing
6. Create a test trigger: when the player enters a box volume (simulating combat start), call `SetMusicState(Combat)`. When they leave, call `SetMusicState(Exploration)`.
7. Test and verify the crossfade is smooth and musically acceptable.

**Success criteria:** Exploration music plays during normal gameplay. Entering the combat trigger zone smoothly crossfades to combat music. Leaving the zone crossfades back. No audible clicks, pops, or jarring cuts.

---

## Exercise 5: Build the Tabletop-to-World Audio Transition

**Goal:** Create the audio crossfade for Tabletop Quest's signature zoom transition.

**What you are building:** The 2.5-second audio experience of descending from the tabletop into the game world.

**Steps:**

1. Create or find these audio elements:
   - Room ambient (fire crackle, clock tick): use the tavern fire from Exercise 1
   - World ambient (forest sounds): wind, birds, rustling
   - Descent sound effect: a low whoosh that sweeps from high to low pitch over 2 seconds
   - Landing thump: a soft bass hit at the 2.5-second mark
2. Create a `BP_TransitionAudioManager` Blueprint:
   - Audio Components: RoomAmbient, WorldAmbient, DescentSFX, LandingSFX
3. Create a **Timeline** node that runs from 0.0 to 1.0 over 2.5 seconds
4. Bind the Timeline output to:
   - RoomAmbient volume: `1.0 - TimelineValue`
   - WorldAmbient volume: `TimelineValue`
   - At TimelineValue 0.2: trigger the descent sound effect
   - At TimelineValue 1.0: trigger the landing thump
5. Also crossfade music: tabletop music fades out, world music fades in (connect to the Music Manager)
6. Create a function `PlayZoomIn()` that plays the Timeline forward
7. Create a function `PlayZoomOut()` that plays the Timeline in reverse
8. Test by triggering ZoomIn and ZoomOut with key presses. Close your eyes and listen. The transition should feel like descending into a world.

**Success criteria:** ZoomIn produces a smooth 2.5-second crossfade from room sounds to world sounds, with a descent whoosh and landing thump. ZoomOut reverses the process. The music transitions with the ambient sounds.

---

## Exercise 6: Add Audio Occlusion in a Dungeon

**Goal:** Make dungeon sounds behave realistically through walls.

**What you are building:** The audio occlusion system that lets players hear muffled enemies through dungeon walls.

**Steps:**

1. Set up a simple dungeon: two rooms connected by a corridor with a closed door between them
2. Place an Ambient Sound in Room B (simulating an enemy or environmental sound)
3. Create a Sound Attenuation asset `SA_DungeonOccluded`:
   - Inner Radius: 100
   - Falloff Distance: 1500
   - Enable Occlusion: true
   - Occlusion Trace Channel: Visibility
   - Low Pass Filter Frequency when occluded: 1500 Hz
4. Assign this attenuation to the Room B ambient sound
5. Stand in Room A (with the wall between you and Room B). The sound should be muffled and lower.
6. Walk through the door into Room B. The sound should become clear and full.
7. Add Audio Volumes to each room with different reverb settings:
   - Room A: Small room reverb
   - Room B: Larger room reverb (if Room B is bigger)
   - Corridor: Narrow space reverb (short, tight)
8. Walk through the dungeon and notice how the reverb changes in each space.

**Success criteria:** Sounds in the adjacent room are audibly muffled through walls. Walking into the room makes them clear. Each room has distinct reverb characteristics. The player can estimate what is in the next room by listening.

---

## Exercise 7: Build a Dragon Roar with Layered Sound Design

**Goal:** Create a multi-layered Dragon roar sound effect for the boss encounter.

**What you are building:** The Dragon's signature roar, used during phase transitions in the boss fight from Module 07.

**Steps:**

1. Find or create these audio layers:
   - A deep, rumbling growl (bass layer, 2-3 seconds)
   - A mid-range animal roar (the main roar, 1.5-2 seconds)
   - A high-pitched screech (adds sharpness, 1 second, delayed 0.5s)
   - A reverb tail (long decay, gives the roar a sense of space)
2. Create a Sound Cue `SCue_DragonRoar`:
   - Use a **Mixer** node to combine all four layers
   - Offset the screech layer by 0.3 seconds using a **Delay** node
   - Add a **Modulator** to the main roar: pitch 0.9-1.05 (slight variation each time)
   - Set the volume so the bass layer is felt more than heard
3. Create a Sound Attenuation `SA_BossRoar`: Inner Radius 500, Falloff 5000 (this roar should be heard from far away)
4. In the Dragon Boss Blueprint, trigger the roar during phase transitions:
   - Phase 1 to 2: Play roar + screen shake (0.5 seconds, intensity 2.0)
   - Phase 2 to 3: Play roar at 120% volume + stronger screen shake (0.7 seconds, intensity 3.0) + bass boost
5. Test by triggering the roar in a level. It should feel powerful, deep, and slightly terrifying.

**Success criteria:** The Dragon roar has audible depth from the layered design. The bass layer adds a physical sensation. The screech adds menace. Screen shake accompanies the sound. Phase 2-to-3 transition roar is noticeably more intense than Phase 1-to-2.

---

## Exercise 8: Complete Audio Integration Test

**Goal:** Walk through a full gameplay sequence and verify all audio systems work together.

**What you are building:** A holistic test of every audio system, confirming they integrate cleanly.

**Steps:**

1. Start in the tavern. Verify:
   - Fire crackle from the fireplace direction
   - Crowd murmur as background
   - Occasional mug clinks
   - Tavern music playing
   - Footsteps on wood floor
   - Reverb appropriate for an indoor room

2. Trigger the tabletop zoom transition. Verify:
   - Room sounds fade out smoothly
   - Descent whoosh plays
   - World ambient fades in
   - Music crossfades from tavern/tabletop to exploration

3. Walk on the overworld path. Verify:
   - Exploration music playing
   - Forest ambient sounds (wind, birds)
   - Footsteps change from dirt (path) to grass (off-path)
   - Sound from a nearby campfire is spatialized (louder when close, directional)

4. Enter combat with a Goblin. Verify:
   - Music transitions to combat theme
   - Sword swing and impact sounds play on attacks
   - Enemy footsteps are audible
   - Hit feedback sounds play when the player takes damage

5. Enter the dungeon. Verify:
   - Ambient changes to dungeon soundscape (drips, distant rumbles)
   - Reverb changes to cave/stone room
   - Footsteps change to stone
   - Enemy sounds are occluded through walls (muffled)
   - Music changes to dungeon theme

6. Document any issues: missing sounds, volume imbalances, abrupt transitions, mismatched reverb.

**Success criteria:** All audio systems work together without conflicts. Transitions between areas and states are smooth. No sounds are missing or out of place. Volume levels are balanced across all areas and states.
