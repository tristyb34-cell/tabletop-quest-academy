# Module 10: Quiz - Sound and Music

Test your understanding of audio systems in Unreal Engine. Try to answer each question before revealing the answer.

---

### Question 1

What is the difference between a Sound Wave, a Sound Cue, and a MetaSound in UE5?

<details>
<summary>Show Answer</summary>

A **Sound Wave** is a single imported audio file (WAV, OGG). It is the raw audio data. Think of it as a single recording.

A **Sound Cue** is a visual graph that combines, modifies, and sequences Sound Waves. It adds randomization (pick from 4 footstep variations), pitch modulation, layering (play bass rumble + metallic hit simultaneously), and attenuation. It works with pre-recorded audio.

A **MetaSound** is a node-based audio synthesis and processing system that can **generate audio from scratch** using oscillators, filters, and envelopes. It can also process existing Sound Waves. MetaSounds is used for procedural audio (wind that responds to a weather parameter, a heartbeat that speeds up with low HP) and interactive sound design.

Most game sounds use Sound Cues. MetaSounds is for advanced procedural needs.

</details>

---

### Question 2

Why should the Lose Sight Radius for audio attenuation (Falloff Distance) always be larger than the Inner Radius? What happens if they are the same?

<details>
<summary>Show Answer</summary>

This is actually about the **Inner Radius** and **Falloff Distance** in Sound Attenuation. The Inner Radius defines where the sound is at full volume. The Falloff Distance defines how far beyond the Inner Radius the sound takes to fade to silence.

If they were set so the total distance is very short (say, Inner 100, Falloff 50), the sound would cut off abruptly at 150 units. The player would hear nothing, take one step forward, and suddenly hear the sound at full volume. This feels unnatural and jarring.

A proper setup (Inner 200, Falloff 2000) means the sound fades gradually over 2000 units, creating a natural approach where you hear the waterfall getting louder as you walk toward it. The larger the falloff, the smoother the transition. Different sounds need different settings (a campfire fades quickly, thunder fades over a huge distance).

</details>

---

### Question 3

Describe how the footstep system uses Physical Materials to determine which sound to play. Walk through the steps from foot-down to sound playback.

<details>
<summary>Show Answer</summary>

1. The player character's walk animation has **Animation Notifies** at each foot-down frame.
2. When the notify fires, a custom Blueprint event runs.
3. The event performs a **Line Trace** downward from the foot bone (about 200 units down).
4. The Line Trace hits the ground and returns a hit result containing the **Physical Material** of the surface.
5. A **Switch on Physical Material** node checks the result: PM_Stone, PM_Dirt, PM_Wood, PM_Grass, etc.
6. Based on the match, the appropriate **Sound Cue** is selected (SCue_Footstep_Stone, SCue_Footstep_Dirt, etc.).
7. The Sound Cue uses a **Random** node to pick from 4 variations and a **Modulator** for slight pitch/volume variation.
8. **Play Sound at Location** plays the sound at the foot's world position with the footstep attenuation settings.

This gives surface-accurate, non-repetitive footsteps that change automatically as the player walks across different terrain.

</details>

---

### Question 4

What are Sound Classes and Sound Mixes, and how do they work together to control volume in Tabletop Quest?

<details>
<summary>Show Answer</summary>

**Sound Classes** are categories that group sounds by type: Music, SFX, Ambient, Voice, UI. Every Sound Cue or Sound Wave is assigned to one Sound Class. Sound Classes give the player volume control (the "Music Volume" slider in settings controls the Music Sound Class).

**Sound Mixes** adjust multiple Sound Classes simultaneously based on game state. For example, the "Dialogue Mix" reduces Music to 30% and SFX to 50% while keeping Voice at 100%, so the player can hear NPC dialogue clearly. The "Combat Mix" boosts Music and SFX for intensity.

They work together: the player sets base volumes via Sound Classes (settings menu), and the game applies Sound Mixes on top of those base volumes depending on context. A Sound Mix fades in smoothly (e.g., over 0.5 seconds) when triggered and fades out when no longer needed.

</details>

---

### Question 5

Explain the two approaches to adaptive music: horizontal re-sequencing and vertical layering. Which is simpler, and which gives smoother transitions?

<details>
<summary>Show Answer</summary>

**Horizontal re-sequencing** plays music segments in sequence and changes which segment comes next based on game state. Exploration uses calm segments. When combat starts, the system waits until the current segment ends and plays a transition bridge, then loops combat segments. Transitions happen at musical boundaries (end of a bar or phrase). This is **simpler to implement** (just manage which track plays next) but transitions are delayed until a segment boundary.

**Vertical layering** plays the same piece of music continuously but adds/removes instrument layers (drums, brass, choir) based on game state. The base strings never stop. Combat fades in percussion and brass. The transition is **smoother** because the music never actually changes, only the instrumentation does. But it requires all layers to be composed together, perfectly synchronized, which is more complex to produce.

For Tabletop Quest, horizontal re-sequencing is a good starting point. Vertical layering is an upgrade if you (or your composer) have the music production skills.

</details>

---

### Question 6

Describe the audio design for the tabletop-to-world zoom transition. What sounds fade in, what fades out, and what is the timeline?

<details>
<summary>Show Answer</summary>

**Timeline (2.5 seconds):**

- **0.0-0.5s**: Room sounds at full volume (fire crackle, clock tick, page rustle). Tabletop music playing. Camera begins descending.
- **0.5-1.0s**: Room sounds begin fading. A "descent" whoosh sound effect starts (low, sweeping). First hints of world ambient at ~10%.
- **1.0-1.5s**: Room sounds at 30%, world ambient at 40%. Descent sound peaks. Tabletop music fading, world music beginning.
- **1.5-2.0s**: Room sounds at 10%, world at 70%. Music crossfade nearly complete.
- **2.0-2.5s**: Room sounds gone. Full world soundscape. World music at target volume. A soft "landing" bass thump marks arrival.

The reverse (zoom out) plays this in reverse, adding a soft "clink" sound as characters freeze into miniature poses.

A Timeline node drives the crossfade, with its 0-to-1 output controlling all volume levels simultaneously.

</details>

---

### Question 7

What is audio occlusion, and why is it important for dungeon gameplay in Tabletop Quest?

<details>
<summary>Show Answer</summary>

Audio occlusion makes walls and obstacles **muffle sounds** that are blocked from the listener. When enabled, UE5 performs a trace (raycast) between the listener and the sound source. If the trace hits a wall, the sound is filtered through a low-pass filter (removing high frequencies, making it sound muffled) and reduced in volume.

In Tabletop Quest's dungeons, this is important for **gameplay awareness**. Players can hear muffled enemy footsteps through walls, alerting them to danger in the next room without seeing anything. The muffling communicates "there is something nearby, but a wall is between us." This gives the player information to make tactical decisions: prepare for combat, use stealth, or choose a different route.

Without occlusion, dungeon sounds would play at full clarity regardless of walls, which is both unrealistic and removes a layer of spatial gameplay.

</details>

---

### Question 8

Why should combat sound effects use multiple layers (swing, impact, block, critical accent) rather than a single pre-mixed sound?

<details>
<summary>Show Answer</summary>

Multiple layers provide **modularity and variation**. A single pre-mixed "sword hit" sound plays the same way every time, regardless of context. With layers:

1. **Context sensitivity**: A hit against armor plays swing + armor impact. A hit against flesh plays swing + flesh impact. A blocked hit plays swing + block clang. A critical hit plays swing + impact + critical accent. One set of assets covers many situations.
2. **Variation**: Each layer has its own randomization (different swing whooshes, different impact variations). The combinations multiply: 3 swings x 3 impacts = 9 unique combinations, preventing repetition.
3. **Timing control**: The swing sound starts at the animation wind-up. The impact plays at the hit frame. This frame-accurate triggering makes combat feel responsive. A pre-mixed file would have a fixed delay between swing and impact that might not match the animation.
4. **Scalability**: Adding a new weapon type only requires new impact sounds. The swing layer can be shared or adjusted with pitch modulation.

</details>

---

### Question 9

What is Sound Concurrency, and how would you configure it for a combat scenario with 6 Goblins attacking the player simultaneously?

<details>
<summary>Show Answer</summary>

Sound Concurrency limits how many instances of a sound (or a group of sounds) can play simultaneously. Without it, 6 Goblins each playing sword swing, impact, footsteps, and voice sounds could produce 20+ overlapping audio instances, causing a muddy, overwhelming mix and consuming excessive CPU.

Configuration for 6-Goblin combat:
- **Footsteps Concurrency Group**: Max 4 concurrent. The player's footsteps are always heard (priority 1). Up to 3 enemy footsteps play. The engine stops the oldest/quietest when the limit is reached.
- **Combat SFX Concurrency Group**: Max 6 concurrent. Each attack impact counts as one instance. The 7th impact stops the quietest existing one.
- **Voice/Grunt Concurrency Group**: Max 3 concurrent. Only the 3 nearest enemies play vocal sounds.

This keeps the audio clean and focused. The player hears the most important sounds (their own footsteps, the nearest enemies) while distant enemies are culled. The mix stays clear even in chaotic combat.

</details>

---

### Question 10

You are designing the audio for a new area in Tabletop Quest: an underground mushroom forest with bioluminescent fungi and a gentle stream. Describe the ambient soundscape you would create (at least 5 sound elements) and the reverb characteristics.

<details>
<summary>Show Answer</summary>

**Ambient elements:**

1. **Gentle stream**: Looping water flow, spatialized to the stream location. Inner radius 100, falloff 1500. The primary orientation sound that guides the player.
2. **Fungal hum**: A low, continuous drone (could be MetaSounds-generated). Non-spatialized or very large radius. Unique to this area, giving it an otherworldly identity. Very low volume.
3. **Dripping water**: Random water drops from the ceiling, spatialized to various ceiling points. Timer 3-10 seconds between drops. Multiple pitch variations.
4. **Spore puff**: When the player walks near certain mushrooms, a soft "poof" sound plays (air release, slightly comical). Spatialized to each large mushroom. Triggered by proximity.
5. **Crystal chime**: Occasional, faint musical tones (bioluminescence "singing"). Very rare (every 20-40 seconds), random pitch, creates a sense of wonder. Spatialized to random locations in the cave.
6. **Insect/creature chirps**: Alien-sounding chirps from unseen creatures. Random timing, random pitch, spatialized. Makes the cave feel alive.

**Reverb:** Medium-large cave reverb. Longer decay than a dungeon corridor (the space is open), but with a softer high-frequency rolloff (the mushrooms absorb high frequencies, unlike hard stone). Wet/dry ratio around 40/60. The result should feel open and ethereal, not harsh and echoey.

</details>
