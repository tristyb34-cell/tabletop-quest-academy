# Module 10: Sound and Music

## Sound Brings the World to Life

Close your eyes and imagine a dungeon. You probably did not picture the walls first. You heard the drip of water echoing off stone, the crackle of a distant fire, the low rumble of something moving in the dark. Sound creates atmosphere more powerfully than visuals. A beautifully rendered room with no audio feels lifeless. A dark screen with the right audio feels terrifying.

Think of sound as the invisible half of your game. Players rarely notice good sound design, because it feels natural. But they immediately notice when sound is missing or wrong. A sword that swings in silence feels weightless. A forest without birds and wind feels dead. A combat victory without a triumphant musical swell feels hollow.

In this module, you will add ambient soundscapes to your open world, combat sounds to your battles, and a dynamic music system that shifts based on the gameplay situation. By the end, your game will not just look like an RPG. It will sound like one.

---

## Sound Cues: Variations That Sound Natural

If you play the exact same footstep sound every time the character walks, it starts to sound like a broken record after about ten seconds. Real footsteps vary slightly with each step: different pressure, slightly different angle, tiny differences in the surface.

**Sound Cues** solve this. A Sound Cue is a container that holds multiple sound variations and plays them with controlled randomness. You load 5 different footstep recordings into a Sound Cue, and each time the game needs a footstep sound, it picks one at random. It can also vary the pitch slightly (a little higher or lower each time) and the volume (a little louder or softer).

Think of it like a deck of cards. Instead of flipping the same card every time, you shuffle and draw. The result sounds natural because it is never exactly the same twice.

Sound Cues are built in the editor using a visual node graph. You connect sound wave nodes (your audio files) to a Random node, add a Modulator node for pitch/volume variation, and connect it to the output. Claude will guide you through building these.

Common Sound Cues for Tabletop Quest:
- **Footsteps**: 4-5 variations per surface type (stone, wood, grass, water)
- **Sword swings**: 3-4 variations of a blade cutting through air
- **Shield blocks**: 3 variations of metal-on-metal impact
- **Spell casting**: Different whooshes and crackling sounds per spell element (fire, ice, lightning)

---

## Attenuation: Sound Gets Quieter with Distance

In the real world, sounds get softer the further you are from the source. A campfire crackles loudly when you stand next to it and fades to silence as you walk away. This is **attenuation**, and Unreal handles it automatically for any sound placed in the 3D world.

You configure two key values:
- **Inner Radius**: Within this distance, the sound plays at full volume. Stand right next to the campfire and hear it clearly.
- **Outer Radius (Falloff Distance)**: Beyond this distance, the sound is silent. Walk far enough away and the campfire disappears from your ears.

Between the inner and outer radius, the sound fades smoothly. The falloff curve controls how quickly it fades: a linear curve fades at a constant rate, while a logarithmic curve (which mimics real physics) fades quickly at first and then more gradually.

Think of attenuation like a torch's light. The light is bright near the flame, dims as you move away, and eventually the darkness takes over completely. Sound attenuation works the same way, just with your ears instead of your eyes.

Unreal also supports **spatialisation**: the ability to hear which direction a sound comes from. A river to your left sounds louder in your left ear. A monster growling behind you sounds like it is behind you. This uses the same 3D positioning system as the visual world. Any sound with attenuation enabled is automatically spatialised.

---

## Ambient Sound: Making the World Breathe

Ambient sounds are the background layer that makes environments feel real. They are not tied to specific actions (like attacking or opening a door). They just exist, always present, creating the mood.

### Environment Ambience
Each region of your open world has its own ambient character:
- **The Greenwood Forest**: Birdsong, rustling leaves, distant woodpecker tapping, occasional animal calls
- **The Stoneridge Mountains**: Howling wind, distant rockfall, eagles calling
- **The Blackmire Swamp**: Croaking frogs, buzzing insects, bubbling mud, eerie silence between sounds
- **The Starting Town**: Distant chatter, a blacksmith hammering, dogs barking, the creak of wooden signs in the wind
- **Dungeons**: Dripping water, echoing footsteps, distant rumbles, rats scurrying, the hum of magical energy

### Ambient Sound Actors
In Unreal, you place **Ambient Sound** actors in the world. Each one plays a sound (or Sound Cue) with attenuation settings. A dripping water sound placed in a dungeon corner will be heard when the player is nearby and fade out as they move away.

For area-wide ambience (like forest birdsong that covers the whole forest), you can use **Audio Volumes**: invisible boxes that play ambient sound when the player is inside them. Walk into the forest, and the forest sounds begin. Walk out, and they fade.

### Python Automation for Ambient Sound
Placing ambient sounds one by one across a 4km x 4km world would be insane. Claude can write a Python script that:
- Places dripping water sounds at random locations inside dungeon levels
- Creates ambient sound zones for each region of the open world
- Scatters campfire crackle sounds at every campfire prop in the world
- Adds wind sounds to mountain peaks and exposed ridges

You describe the audio layout you want, and Claude generates the script that places hundreds of sound actors in seconds.

---

## Combat Sounds: Making Hits Feel Real

Combat without sound is like watching a fight scene on mute. Every action in combat needs audio feedback.

### Attack Sounds
- **Sword slash**: A sharp metallic whoosh as the blade swings
- **Mace slam**: A heavy, blunt impact
- **Bow release**: A taut string twang followed by an arrow whistle
- **Spell cast**: Element-specific: a fiery roar for fireball, a crystalline shatter for ice, a crackling buzz for lightning

### Impact Sounds
- **Hit**: A meaty thud when an attack connects. This is arguably the most important combat sound. A satisfying hit sound makes combat feel impactful.
- **Miss**: A lighter whoosh when an attack misses. The contrast with the hit sound makes successful attacks feel even better.
- **Block**: A metallic clang when a shield deflects an attack
- **Critical hit**: The normal hit sound plus an additional sharp, resonant tone that signals something special happened

### Character Sounds
- **Damage grunt**: A short vocal sound when a character takes damage. Different for each character.
- **Death sound**: A final cry or collapse sound when a character dies
- **Heal sound**: A warm, chiming tone when health is restored
- **Buff/debuff sounds**: Subtle tones when status effects are applied or removed

Each of these should be a Sound Cue with multiple variations, so combat never sounds repetitive.

---

## The Music System: Mood That Follows the Gameplay

The most sophisticated audio system in the game is dynamic music. Instead of one track that plays on loop, the music shifts to match what is happening.

### Music States
Tabletop Quest needs at least three music states:
- **Exploration**: Calm, melodic, with a hint of wonder. Think gentle strings, a soft flute, and light percussion. This plays while the player wanders the world.
- **Combat**: Intense, rhythmic, with driving percussion and urgent strings. This kicks in the moment combat starts.
- **Victory**: A triumphant fanfare that plays when the last enemy falls. Short and punchy, like the Final Fantasy victory jingle.

### Transitions
The key to dynamic music is smooth transitions. When combat starts, you do not want the exploration track to cut off abruptly and the combat track to blast in. Instead:
1. The exploration music fades out over 1-2 seconds
2. The combat music fades in over 1-2 seconds, starting slightly before the exploration music is fully gone
3. This crossfade creates a seamless mood shift

When combat ends:
1. The combat music fades out
2. A short victory fanfare plays
3. After the fanfare, the exploration music fades back in

### Implementation
In Unreal, you can manage music states with Audio Components on a dedicated Music Manager actor. Each state has its own audio component playing its track. Only one is audible at a time (the others are playing silently or paused). When the state changes, you crossfade the volumes.

Claude will build this as a Blueprint actor that listens for game events ("CombatStarted," "CombatEnded," "BossEncounterStarted") and manages the music transitions.

---

## MetaSounds: Dynamic and Procedural Audio

UE5 introduced **MetaSounds**, a new audio system that lets you build sound effects procedurally using a node graph. Instead of playing back pre-recorded audio files, MetaSounds generates sound in real time based on parameters.

Think of the difference between a photograph and a painting. A Sound Cue plays back a photograph of sound (a recording). MetaSounds paints the sound in real time, and you can change the brush strokes on the fly.

For Tabletop Quest, MetaSounds is useful for:
- **Magical effects**: A fireball sound that changes pitch and intensity based on the spell's power level
- **Environmental effects**: Wind that dynamically changes speed and character based on altitude and weather
- **Footsteps**: Procedurally blending between surface types as the character transitions from stone to grass

MetaSounds is an advanced topic, and you do not need it for the basics. Sound Cues cover most of your needs. But it is worth knowing that MetaSounds exists for when you want to push audio quality further.

---

## Free Sound Sources

You do not need to record your own sounds (unless you want to). Excellent free sound libraries exist:

- **Freesound.org**: A massive community library of Creative Commons sounds. Search for "sword clash," "dungeon ambience," or "fantasy music" and you will find thousands of options.
- **Sonniss GDC Audio Bundle**: Every year at GDC, Sonniss releases a free bundle of professional game audio. Dozens of gigabytes of royalty-free sounds. Past bundles include fantasy combat, environmental ambience, and creature vocals.
- **Unreal Marketplace**: Free monthly content sometimes includes sound packs. Check regularly.

Import sounds as .wav files (16-bit, 44.1kHz or 48kHz) for best compatibility with Unreal.

---

## What You Will Build This Module

By the end of this module, you will have:
- Ambient soundscapes for your dungeon (dripping water, wind, distant rumbles)
- Combat sound effects (attacks, impacts, misses, death sounds)
- Sound Cues with multiple variations so nothing sounds repetitive
- A dynamic music system that crossfades between exploration, combat, and victory tracks
- Ambient sound zones placed across your open world via Python scripts
- The moment when you walk into your dungeon and hear it come alive around you

Sound is the difference between a tech demo and an experience. This is the module that makes Tabletop Quest feel real.
