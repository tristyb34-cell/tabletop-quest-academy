# Module 10: Exercises - Audio Systems

## Exercise 1: Import and Play Sounds

**Objective:** Import audio assets, create a Sound Cue with randomization and modulation, and trigger it from gameplay.

**Steps:**

1. Find or create 4 short sound effects for a sword swing (free sources: Freesound.org, Kenney.nl, or record your own by swishing something through the air). Export them as WAV files, each under 2 seconds.

2. Import all 4 files into your UE5 project under `Content/Audio/SFX/Weapons/`. Verify they appear as Sound Wave assets.

3. Create a Sound Cue: `SC_SwordSwing`.
   - Add 4 Wave Player nodes, each referencing one of your sound files
   - Connect all 4 to a **Random** node (this selects one randomly each time)
   - Connect the Random output to a **Modulator** node:
     - Pitch Min: 0.93, Pitch Max: 1.07
     - Volume Min: 0.85, Volume Max: 1.0
   - Connect the Modulator to the Output node

4. Preview the Sound Cue by clicking the Play button in the cue editor. Click it several times to hear the randomization and modulation working. Each play should sound slightly different.

5. Create an Attenuation Settings asset `ATT_WeaponSwing`:
   - Inner Radius: 100
   - Falloff Distance: 800
   - Attenuation Function: Logarithmic

6. Create a Blueprint actor `BP_TestWeapon`. Add a static mesh (a simple cube or cylinder to represent a sword). Add an Audio Component and set its Sound to `SC_SwordSwing` with the `ATT_WeaponSwing` attenuation.

7. Add an input binding: when the player presses the left mouse button, call **Play** on the Audio Component.

8. Place `BP_TestWeapon` in the level, possess it or attach it to the player, and test. Each click should play a slightly different sword swing sound. Walk away from the weapon (if testing from another character) to hear the attenuation in action.

**Bonus Challenge:** Create a second Sound Cue `SC_SwordImpact` with impact sounds. When the sword swing plays, do a line trace forward. If it hits something, play the impact cue at the hit location using **Play Sound at Location**. Use different impact sounds for different Physical Materials (metal surface vs wood surface).

**What You Learn:** Audio import workflow, Sound Cue creation with randomization and modulation, attenuation configuration, and triggering audio from gameplay input.

---

## Exercise 2: Ambient Sound with Attenuation

**Objective:** Create an ambient soundscape for a dungeon room using multiple positioned sound sources with appropriate attenuation.

**Steps:**

1. Gather or create the following ambient sounds (check Freesound.org):
   - Water dripping (looping, 5-10 seconds)
   - Torch fire crackling (looping, 8-15 seconds)
   - Distant rumble or wind (looping, 15-30 seconds)
   - Rat squeaking (one-shot, 1-2 seconds, 3 variations)

2. Import all sounds into `Content/Audio/Ambient/Dungeon/`.

3. Create Sound Cues:
   - `SC_WaterDrip`: Single wave player, set to loop
   - `SC_TorchCrackle`: Single wave player, set to loop, with slight pitch modulation (0.97 to 1.03) for natural variation
   - `SC_DistantRumble`: Single wave player, set to loop, low volume (0.4)
   - `SC_RatSqueak`: 3 wave players into a Random node, NOT looping (we will trigger this periodically)

4. Create Attenuation Settings:
   - `ATT_WaterDrip`: Inner 50, Falloff 400 (small, localized)
   - `ATT_TorchFire`: Inner 75, Falloff 600 (medium, each torch lights a small area)
   - `ATT_DistantRumble`: Inner 500, Falloff 3000 (large, fills the whole dungeon zone)
   - `ATT_RatSqueak`: Inner 30, Falloff 300 (tiny, very localized)

5. Build a simple dungeon room (or use your existing one). Place Ambient Sound actors:
   - 1 water drip sound near a wall crack (with a dripping water particle effect if you have one)
   - 2 torch crackle sounds, one at each torch sconce on the walls
   - 1 distant rumble sound at the center of the room (large attenuation fills the space)
   - 2 rat squeak sound actors in dark corners

6. For the rat squeaks, create a Blueprint that:
   - Uses a looping timer with a random interval (every 8 to 20 seconds)
   - Each tick, plays the rat squeak Sound Cue
   - This creates intermittent, unpredictable rat sounds

7. Add a **Reverb Volume** that covers the entire dungeon room:
   - Reverb Effect: Small stone room preset
   - Volume: 0.6
   - Fade Time: 0.5 seconds

8. Walk around the room and listen. The water drip should be loudest near the wall crack. The torches should be audible near their sconces. The rumble should be a constant low presence. The rat should surprise you occasionally.

**Bonus Challenge:** Create a second room with a different atmosphere (a large cavern). Use longer reverb, deeper rumble, and add a wind sound. Place an Audio Volume at the doorway between rooms that crossfades the reverb settings over 1 second as you walk through.

**What You Learn:** Placing ambient sounds in 3D space, configuring attenuation for different source types, reverb volumes, periodic random sound triggering, and building a convincing audio atmosphere.

---

## Exercise 3: Audio Crossfade Between Environments

**Objective:** Implement a smooth audio crossfade that transitions between the tabletop room ambience and the dungeon world ambience when the camera zooms in and out.

**Steps:**

1. Prepare two ambient sound sets:
   - **Tabletop ambience**: Quiet room tone, subtle paper shuffling, clock ticking, muffled distant sounds. Mix these into a single looping Sound Cue `SC_TabletopAmbience` or use separate actors.
   - **Dungeon ambience**: The ambient setup from Exercise 2, or a single combined dungeon atmosphere Sound Cue `SC_DungeonAmbience`.

2. Create a Blueprint actor `BP_AudioCrossfader`:
   - Two Audio Components: `TabletopAudio` and `DungeonAudio`
   - A float variable `BlendAlpha` (0.0 = tabletop, 1.0 = dungeon)
   - A function `SetBlend(Float Alpha)`:
     - `TabletopAudio` volume = 1.0 - Alpha
     - `DungeonAudio` volume = Alpha
   - Both audio components play on Begin Play (the one at 0 volume is inaudible)

3. Create a camera transition system (or simulate one):
   - A Timeline that lerps a float from 0.0 to 1.0 over 2 seconds
   - Each frame of the Timeline, call `SetBlend` on the AudioCrossfader
   - Trigger the Timeline with a key press (e.g., press T to zoom into the dungeon, press T again to zoom back)

4. Test: Press T. Over 2 seconds, the tabletop ambience should fade out while the dungeon ambience fades in. Press T again to reverse.

5. Enhance with Sound Mix integration:
   - Create two Sound Mixes: `Mix_Tabletop` and `Mix_Dungeon`
   - `Mix_Tabletop`: Boost UI sounds, reduce SFX, moderate music
   - `Mix_Dungeon`: Full SFX, full ambient, moderate music
   - During the transition, push the target mix and pop the previous one
   - Use the mix's **Fade In Time** (set to 2 seconds to match the camera transition)

6. Add a music transition:
   - Tabletop music: Calm, acoustic
   - Dungeon music: Mysterious, atmospheric
   - Crossfade them using the same BlendAlpha parameter
   - The music smoothly shifts alongside the ambience

**Bonus Challenge:** Add a "whoosh" transition sound effect that plays during the zoom. Time it to peak at the midpoint of the transition (BlendAlpha = 0.5). Use a Sound Cue with a volume envelope that rises and falls over 2 seconds.

**What You Learn:** Audio crossfading, Timeline-driven transitions, Sound Mix layering, coordinating multiple audio elements during a single game event, and the audio architecture for the tabletop-to-world transition.

---

## Exercise 4: Dynamic Music System

**Objective:** Build a music system that transitions between exploration, tension, and combat states using vertical layering.

**Steps:**

1. Prepare music layers. You need 4 audio tracks that are all the same length (e.g., 16 bars at 120 BPM), all in the same key, and all synchronized. Options:
   - Compose them yourself in a DAW (GarageBand, FL Studio, Ableton)
   - Find free layered game music packs online (search "free game music stems")
   - For testing, use 4 different simple loops from Freesound.org (they will not sound perfectly musical together, but the system will work)

   The 4 layers:
   - **Base**: Ambient pad or low drone (always playing)
   - **Melody**: A gentle melodic line (exploration)
   - **Percussion**: Rhythmic drums or pulse (tension/combat)
   - **Intensity**: Heavy instrumentation, brass, or strings (combat)

2. Import all 4 as looping Sound Waves in `Content/Audio/Music/`.

3. Create `BP_MusicManager`:
   - 4 Audio Components, one per layer, all set to play on Begin Play and loop
   - Start volumes: Base = 0.7, Melody = 0.5, Percussion = 0.0, Intensity = 0.0
   - An Enum variable `MusicState`: Exploration, Tension, Combat, Victory, Silence
   - Target volumes for each state:

   | Layer | Exploration | Tension | Combat | Victory | Silence |
   |-------|------------|---------|--------|---------|---------|
   | Base | 0.7 | 0.6 | 0.5 | 0.8 | 0.0 |
   | Melody | 0.5 | 0.2 | 0.0 | 0.7 | 0.0 |
   | Percussion | 0.0 | 0.4 | 0.8 | 0.3 | 0.0 |
   | Intensity | 0.0 | 0.1 | 0.7 | 0.0 | 0.0 |

4. Create a function `TransitionTo(NewState)`:
   - Look up the target volumes for the new state
   - For each layer, use a **Timeline** or **FInterp** to smoothly transition from the current volume to the target volume over 2 seconds
   - Set `MusicState` to the new state

5. Create test triggers in the level:
   - A blue zone: entering it calls `TransitionTo(Exploration)`
   - A yellow zone: entering it calls `TransitionTo(Tension)`
   - A red zone: entering it calls `TransitionTo(Combat)`
   - Press V for `TransitionTo(Victory)`
   - Press M for `TransitionTo(Silence)`

6. Walk between zones and listen. The music should smoothly blend between states. Drums should creep in during tension, then fully kick in during combat. Melody should fade during combat and return during exploration.

7. Fine-tune: Adjust the transition duration, target volumes, and layer balance until the transitions feel natural and musical.

**Bonus Challenge:** Add beat-synchronized transitions. Instead of starting the fade immediately, wait until the current bar ends (you can track bar position by counting time since the music started, given the known BPM). This prevents transitions from starting at awkward musical moments.

**What You Learn:** Vertical layering for dynamic music, state-based audio management, smooth volume transitions with interpolation, and the architecture of a game music system that responds to gameplay.

---

## Exercise 5: UI Sounds for Dice, Menus, and Abilities

**Objective:** Add a comprehensive set of UI and feedback sounds to the game's interface elements.

**Steps:**

1. Gather or create these sound effects:
   - **Dice**: 3 dice shake/rattle sounds, 3 dice landing sounds, 1 critical success fanfare, 1 critical failure "womp" sound
   - **Menu**: 1 menu open swoosh, 1 menu close swoosh, 1 button hover tick, 1 button click, 1 error/denied buzz
   - **Ability**: 1 ability selected chime, 1 ability activated "whoosh," 1 cooldown ready ping
   - **Turn**: 1 "your turn" notification, 1 "turn ended" subtle sound

2. Import all sounds into `Content/Audio/SFX/UI/` and `Content/Audio/SFX/Dice/`.

3. Create Sound Cues:
   - `SC_DiceShake`: 3 variations into Random node
   - `SC_DiceLand`: 3 variations into Random with slight pitch modulation
   - `SC_CritSuccess`: Single wave, no randomization (this should be consistent and recognizable)
   - `SC_CritFail`: Single wave
   - `SC_MenuOpen`, `SC_MenuClose`: Single waves
   - `SC_ButtonHover`, `SC_ButtonClick`: Single waves with slight pitch modulation
   - `SC_AbilitySelect`, `SC_AbilityActivate`, `SC_CooldownReady`: Single waves

4. Assign all UI Sound Cues to the `SC_UI` Sound Class so the player can control UI volume independently.

5. Create a Blueprint Function Library `BPL_UIAudio` with static functions:
   - `PlayDiceRoll()`: Plays shake sound, waits 0.5s, plays land sound
   - `PlayDiceResult(bIsCrit20, bIsCrit1)`: Plays the appropriate fanfare or failure
   - `PlayMenuOpen()`, `PlayMenuClose()`
   - `PlayButtonHover()`, `PlayButtonClick()`
   - `PlayAbilitySelect()`, `PlayAbilityActivate()`, `PlayCooldownReady()`
   - `PlayTurnNotification()`

   All functions use **Play Sound 2D** (no spatialization; UI sounds play at full volume from the "center" of the audio space).

6. Hook up the sounds to the UI:
   - In `WBP_MainHUD` ability buttons: bind `OnHovered` to `PlayButtonHover()`, bind `OnClicked` to `PlayAbilitySelect()`
   - In your inventory/menu widgets: call `PlayMenuOpen()` when the widget is added to viewport, `PlayMenuClose()` when removed
   - In the dice roll system: call `PlayDiceRoll()` when a roll is initiated, then `PlayDiceResult()` when the result is calculated
   - In the Turn Manager: call `PlayTurnNotification()` when it becomes the player's turn

7. Test every interaction:
   - Open inventory: hear the swoosh
   - Hover over buttons: hear the tick
   - Click an ability: hear the select chime
   - Roll dice: hear the shake, then the land, then (if critical) the fanfare
   - End your turn and wait for it to come back: hear the turn notification

**Bonus Challenge:** Add a dice roll sound that is spatialized. When the dice physically roll on the tabletop (in the tabletop view), play the dice sound from the tabletop's 3D position using **Play Sound at Location** instead of Play Sound 2D. Apply the `ATT_Tiny` attenuation. This makes the dice sound feel like it is coming from the table. When in the 3D world view, switch to 2D playback since the tabletop is not visible.

**What You Learn:** UI audio design principles, 2D vs 3D sound playback, Sound Class categorization, Blueprint Function Libraries for audio utilities, connecting audio triggers to UI events, and the polish that comes from comprehensive sound feedback.
