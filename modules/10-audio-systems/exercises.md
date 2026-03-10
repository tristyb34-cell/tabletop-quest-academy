# Module 10: Exercises - Sound and Music

## Exercise 1: Add Ambient Sounds to the Dungeon

**Goal:** Make your dungeon level feel alive with environmental audio: dripping water, wind, and distant rumbles.

**What you will do:**

1. First, get some sound files. Visit Freesound.org and download (or ask Claude to help you find):
   - A dripping water sound (looping, 5-10 seconds)
   - A wind/draft sound (looping)
   - A distant rumble or groan sound (looping, subtle)
   - A torch/fire crackling sound (looping)

   Import them into your UE5 project as Sound Wave assets (drag the .wav files into the Content Browser).

2. Ask Claude:
   > "Walk me through creating a Sound Cue for dripping water in UE5. I have 3 dripping water Sound Wave files. The Sound Cue should randomly pick one each time it plays, with slight pitch variation (0.9 to 1.1) and slight volume variation (0.8 to 1.0). It should loop."

3. Follow Claude's instructions to build the Sound Cue in the editor. You will connect wave players to a Random node, then to a Modulator, then to the Output.

4. Now place the sounds in the dungeon. Ask Claude:
   > "Write me a Python script for UE5 that places ambient sounds in my dungeon level. Place 4 dripping water Ambient Sound actors at different positions along the walls (use my DrippingWater Sound Cue). Each should have attenuation: inner radius 100, falloff distance 800. Place 2 wind sounds near doorways with inner radius 200, falloff distance 1200. Place 1 distant rumble at the centre of the dungeon with inner radius 500, falloff distance 2000."

5. Paste the script. The dungeon now has invisible sound emitters scattered through it.

6. Hit Play and walk through the dungeon. Listen for the spatial audio: dripping water should be louder near the walls, wind should be audible near doorways, and the distant rumble should be a subtle constant presence.

7. If you have torch props in the dungeon, ask Claude to write a script that places a fire crackling sound at every torch location with a short attenuation radius (inner 50, falloff 400).

**You know it is working when:**
- Walking through the dungeon, you hear different sounds in different areas
- Water dripping is louder near the walls and fades as you walk away
- Wind is noticeable near doorways
- A subtle rumble creates an underlying sense of unease
- The sounds play with slight variations each time (pitch/volume randomisation)
- The dungeon feels atmospheric and alive

---

## Exercise 2: Set Up Combat Sounds

**Goal:** Add audio feedback to combat actions: attacks, hits, misses, and death.

**What you will do:**

1. Download or find sound files for:
   - Sword swing (3 variations)
   - Impact/hit (3 variations)
   - Miss/whoosh (2 variations)
   - Death/collapse (2 variations)
   - Shield block (2 variations)

   Import them into your project.

2. Ask Claude:
   > "Help me create Sound Cues for combat. I need: (a) A SwordSwing Sound Cue with 3 variations, random selection, pitch variation 0.95-1.05. (b) A CombatHit Sound Cue with 3 variations, random selection, slight pitch variation. (c) A CombatMiss Sound Cue with 2 variations. (d) A CharacterDeath Sound Cue with 2 variations. (e) A ShieldBlock Sound Cue with 2 variations."

3. Build all five Sound Cues following Claude's guidance.

4. Now connect them to gameplay. Ask Claude:
   > "Show me how to play these Sound Cues from Blueprint events in my combat system. When a character attacks, play SwordSwing at the attacker's location. When the attack hits, play CombatHit at the target's location. When the attack misses, play CombatMiss at the attacker's location. When a character dies, play CharacterDeath at their location. When a character blocks, play ShieldBlock at their location."

5. Claude will show you the "Play Sound at Location" or "Spawn Sound 2D" Blueprint nodes and where to place them in your combat Blueprint logic.

6. Test by triggering combat. Each attack should produce a swing sound followed by either a hit or miss sound. Killing an enemy should play the death sound. Blocking should produce the shield clang.

7. Add a satisfying touch: ask Claude to add a brief camera shake when the CombatHit sound plays, connecting the visual and audio impact together (from Module 06).

**You know it is working when:**
- Every attack has a swing sound
- Hits sound heavy and impactful
- Misses sound distinctly different from hits (lighter, more "air")
- Death has a clear, final sound
- Shield blocks produce a satisfying metallic clang
- No combat action happens in silence
- Sounds vary slightly each time (never the exact same sound twice)

---

## Exercise 3: Create a Dynamic Music System

**Goal:** Build a music manager that crossfades between exploration and combat tracks.

**What you will do:**

1. Get music tracks. You need at least:
   - An exploration track (calm, looping, 2-3 minutes)
   - A combat track (intense, looping, 1-2 minutes)
   - A victory fanfare (short, 5-10 seconds, non-looping)

   Freesound.org, the Sonniss GDC bundle, or royalty-free music sites like Kevin MacLeod's incompetech.com are good sources for placeholder tracks.

2. Import the music into your project as Sound Wave assets.

3. Ask Claude:
   > "Create a MusicManager Blueprint actor for my game. It should have three Audio Components: ExplorationMusic, CombatMusic, and VictoryFanfare. On BeginPlay, it starts playing ExplorationMusic at full volume. CombatMusic plays simultaneously but at zero volume. When a 'CombatStarted' event fires, crossfade: fade ExplorationMusic from 1.0 to 0.0 over 2 seconds, and fade CombatMusic from 0.0 to 1.0 over 2 seconds. When 'CombatEnded' fires, fade CombatMusic to 0.0 over 1 second, play the VictoryFanfare once, then after it finishes, fade ExplorationMusic back to 1.0 over 2 seconds."

4. Follow Claude's instructions to create the MusicManager Blueprint with the Audio Components and crossfade logic (using Timelines to animate the volume).

5. Place the MusicManager in your level. Add a test trigger: a box volume that fires the "CombatStarted" event when the player enters and "CombatEnded" when they leave.

6. Test: walk around listening to the calm exploration music. Walk into the combat trigger zone and hear the music shift to intense combat. Walk out and hear the victory fanfare followed by the return of exploration music.

7. Polish: ask Claude to make the combat music start with a dramatic percussion hit at the moment of transition (not a gradual fade-in from nothing, but a punchy entrance). This sells the urgency of combat.

**You know it is working when:**
- Exploration music plays calmly during normal gameplay
- Entering combat triggers a smooth crossfade to combat music (no abrupt cut)
- Exiting combat plays the victory fanfare, then smoothly returns to exploration music
- The transitions feel natural and matched to the mood
- Music loops seamlessly (no audible gap when tracks restart)
- Walking in and out of the combat zone repeatedly does not break the system or stack sounds
