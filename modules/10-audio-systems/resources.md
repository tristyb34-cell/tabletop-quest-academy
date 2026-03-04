# Module 10: Resources - Audio Systems

## Official UE5 Documentation

- **Audio System Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-in-unreal-engine
- **Sound Cues**: https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-cue-editor-in-unreal-engine
- **Sound Attenuation**: https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine
- **Sound Classes and Mixes**: https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-classes-in-unreal-engine
- **MetaSounds**: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-in-unreal-engine
- **MetaSounds Reference Guide**: https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-reference-guide-in-unreal-engine
- **Ambient Sound Actor**: https://dev.epicgames.com/documentation/en-us/unreal-engine/ambient-sound-actor-in-unreal-engine
- **Audio Volumes and Reverb**: https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-volumes-in-unreal-engine
- **Sound Concurrency**: https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-concurrency-in-unreal-engine

## Video Tutorials

- **Unreal Engine Official, Audio Deep Dive**: Search "Unreal Engine MetaSounds tutorial" on YouTube. Epic's official content covers the new audio system in depth.
- **Cody Burt (UE Audio)**: Search "Cody Burt UE5 audio" on YouTube. Focused tutorials on game audio implementation in Unreal, including MetaSounds and dynamic music.
- **Ryan Laley, Audio Tutorials**: Search "Ryan Laley UE5 audio" on YouTube. Clear walkthroughs of Sound Cues, attenuation, and ambient sound setup.
- **Dan's Game Audio**: Search "UE5 dynamic music system tutorial" on YouTube for community tutorials on building state-based music systems with vertical layering.
- **Aaron McLeran (Epic Games)**: Search "Aaron McLeran MetaSounds GDC" for conference talks from Epic's audio team about the design philosophy and capabilities of MetaSounds.

## Free Sound Effect Resources

- **Freesound.org**: https://freesound.org/ - massive community library of free sound effects. Search for "sword," "dungeon ambient," "dice roll," "footsteps stone," etc. Check individual licenses (most are CC0 or CC-BY).
- **Kenney Game Assets**: https://kenney.nl/assets?q=audio - free game audio packs including UI sounds, impacts, and ambient effects. All CC0 (no attribution required).
- **OpenGameArt Audio**: https://opengameart.org/art-search-advanced?field_art_type_tid[]=13 - community-created game audio. Various licenses; check before commercial use.
- **Pixabay Sound Effects**: https://pixabay.com/sound-effects/ - free sound effects library. Good variety of ambient, impact, and UI sounds.
- **Mixkit**: https://mixkit.co/free-sound-effects/ - curated free sound effects, good quality. Includes categories for fantasy and RPG sounds.
- **ZapSplat**: https://www.zapsplat.com/ - large library with a free tier. Strong in ambient and foley sounds.

## Free Music Resources

- **Kevin MacLeod (Incompetech)**: https://incompetech.com/ - massive library of free music organized by genre and mood. Fantasy and medieval tracks available. CC-BY license.
- **Musopen**: https://musopen.org/ - royalty-free classical music recordings. Useful for orchestral ambient and dramatic stings.
- **FreePD**: https://freepd.com/ - public domain music, no attribution required. Variety of genres and moods.
- **Pixabay Music**: https://pixabay.com/music/ - free music tracks with RPG and fantasy options.

## Game Audio Design Theory

- **"A Game Audio Guide" by Richard Stevens and Dave Raybould**: Comprehensive book on game audio design covering interactive music, sound design, and implementation. Theory-focused with practical examples.
- **"Game Audio Implementation" by Richard Stevens and Dave Raybould**: The practical companion to the theory book. Covers implementation in various engines including Unreal.
- **Designing Sound blog**: https://designingsound.org/ - articles and interviews about sound design for games and film. Excellent for learning the "why" behind audio design decisions.
- **GDC Audio Track**: Search "GDC audio" on YouTube or the GDC Vault for conference talks from professional game audio designers. Topics include dynamic music, spatial audio, and emotional sound design.
- **Game Audio Podcast**: Search "Game Audio Podcast" for interviews with working game audio professionals sharing techniques and workflows.

## Tools and Software

- **Audacity**: https://www.audacityteam.org/ - free, open-source audio editor. Essential for trimming, normalizing, and converting sound files before importing into UE5.
- **FMOD/Wwise**: Professional middleware audio tools that integrate with UE5. Overkill for small projects but worth knowing about. Both have free indie licenses.
- **Reaper**: https://www.reaper.fm/ - affordable DAW (digital audio workstation) for recording and editing audio. $60 personal license.
- **sfxr/jsfxr**: https://sfxr.me/ - free browser-based tool for generating retro sound effects. Fun for prototyping UI sounds and simple effects.
- **Vital Synth**: https://vital.audio/ - free wavetable synthesizer. Useful for creating custom spell effects, UI tones, and sci-fi/fantasy ambient sounds.

## Advanced Topics

- **Quartz (Music Quantization)**: https://dev.epicgames.com/documentation/en-us/unreal-engine/quartz-subsystem-in-unreal-engine - UE5's system for beat-synchronized audio playback. Essential for dynamic music systems that need to transition on beat boundaries.
- **Spatialization Plugins**: https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-spatialization-in-unreal-engine - covers binaural audio and HRTF for immersive 3D sound positioning.
- **Audio Modulation Plugin**: Built into UE5, allows runtime control of audio parameters through a modulation system. Useful for connecting gameplay variables to audio in a clean, decoupled way.
- **Wwise Integration for UE5**: https://www.audiokinetic.com/en/wwise/integration/unreal-engine/ - if your project outgrows UE5's built-in audio, Wwise provides professional-grade middleware with a visual event editor.
