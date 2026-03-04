# Module 04: Quiz - Gameplay Ability System

Test your understanding of GAS. Try to answer each question before checking the answer.

---

### Question 1
What is the AbilitySystemComponent (ASC), and why must every actor that participates in the ability system have one?

<details>
<summary>Answer</summary>

The AbilitySystemComponent is a UActorComponent that serves as the central manager for all GAS functionality on an actor. It grants and tracks abilities, applies and manages Gameplay Effects, owns the Attribute Set, maintains the actor's Gameplay Tags, and handles replication for multiplayer. Without an ASC, an actor is completely invisible to the Gameplay Ability System. No abilities can be activated on it, no effects can be applied to it, and no attributes can be read from it. Think of it as plugging a device into the GAS network; without the plug (ASC), the device (actor) has no connection.
</details>

---

### Question 2
What are the three duration policies for Gameplay Effects, and when would you use each one in a tabletop RPG context?

<details>
<summary>Answer</summary>

1. **Instant:** Applies once and is immediately removed. Use for direct damage (a sword strike deals 15 slashing damage), healing (a potion restores 20 HP), or one-time resource consumption (spending gold, consuming a scroll).

2. **Duration:** Active for a specified time period, then automatically removes itself. Use for temporary buffs (a Haste spell increases Finesse by 4 for 60 seconds), debuffs (a Slow poison reduces movement speed for 30 seconds), or damage-over-time effects (burning for 3 damage every 2 seconds for 12 seconds).

3. **Infinite:** Persists forever until explicitly removed by game logic. Use for passive abilities (a racial bonus to darkvision), equipment stat bonuses (a magic sword grants +2 Might while equipped), or permanent level-up stat increases.
</details>

---

### Question 3
Explain the purpose of a "meta attribute" like IncomingDamage. Why not just subtract damage directly from Health?

<details>
<summary>Answer</summary>

A meta attribute acts as an interception point in the damage pipeline. Instead of modifying Health directly, damage flows into IncomingDamage first. In the `PostGameplayEffectExecute` function, you read IncomingDamage, apply all your processing (armor reduction, elemental resistance, damage shields, critical hit multipliers, minimum damage floors), and only then subtract the final calculated value from Health. This gives you a single, centralised location for all damage logic. Without a meta attribute, every damage source would need to independently calculate armor, resistances, and other modifiers, leading to duplicated logic and inconsistencies. The meta attribute also resets to 0 after each use, so it never accumulates.
</details>

---

### Question 4
How does GAS handle ability cooldowns, and why does it use Gameplay Tags instead of simple float timers?

<details>
<summary>Answer</summary>

GAS handles cooldowns through a combination of Gameplay Effects and Gameplay Tags. When an ability activates, it applies a cooldown Gameplay Effect with a set duration. This effect grants a specific tag (e.g., `Ability.Cooldown.Fireball`) to the character's ASC for the duration. The ability's `CanActivateAbility` check sees that the cooldown tag is present and blocks activation.

Using tags instead of timers provides several advantages:
- Other abilities or effects can modify cooldowns by manipulating the tag or the cooldown effect (e.g., a "Quicken" buff that removes all cooldown tags)
- Multiple abilities can share a cooldown by using the same tag
- The tag system integrates with the existing GAS query infrastructure, so you can check cooldowns the same way you check any other state
- Tags are replicated automatically in multiplayer
- UI systems can query for cooldown tags to display remaining time without special-case code
</details>

---

### Question 5
What is the difference between `PreAttributeChange` and `PostGameplayEffectExecute`? When would you use each one?

<details>
<summary>Answer</summary>

`PreAttributeChange` is called before an attribute value changes and receives a reference to the new value, allowing you to modify it (typically for clamping). It fires for ALL attribute changes, regardless of source. Use it for enforcing hard limits, like ensuring Health never exceeds MaxHealth or that stats never go negative. Important caveat: it does not have access to the Gameplay Effect that caused the change, so you cannot do context-dependent logic here.

`PostGameplayEffectExecute` is called after a Gameplay Effect has modified an attribute. It provides full context: who caused the effect, what tags were involved, and what the modification was. Use it for complex post-processing like the damage pipeline (reading IncomingDamage, applying armor/resistance, then modifying Health) or triggering side effects (death events, kill tracking, combo counters). It only fires for Instant effects and the periodic ticks of Duration effects, not for ongoing modifiers from Duration or Infinite effects. This distinction is critical to understand.
</details>

---

### Question 6
Describe how you would implement a "Silence" debuff that prevents spellcasting but still allows melee attacks and item use.

<details>
<summary>Answer</summary>

1. Create a Duration Gameplay Effect called `GE_Silence` with a set duration (e.g., 10 seconds).
2. The effect grants the tag `Character.State.Silenced` to the target for its duration.
3. On every spell ability (Fireball, Heal, Lightning Bolt, etc.), add `Character.State.Silenced` to the `ActivationBlockedTags` container.
4. On melee attacks and item-use abilities, do NOT add `Character.State.Silenced` to their blocked tags.

Now, when a character has the Silence debuff active, the `Character.State.Silenced` tag is present on their ASC. Any spell ability's `CanActivateAbility` check will see the blocking tag and return false. Melee attacks and items ignore that tag entirely, so they activate normally. When the duration expires, the tag is automatically removed and spellcasting resumes. No if-statements or boolean checks are needed anywhere in the ability code.
</details>

---

### Question 7
How do Gameplay Cues separate presentation (visual/audio effects) from game logic, and why is this separation important?

<details>
<summary>Answer</summary>

Gameplay Cues are a dedicated subsystem for triggering visual and audio effects in response to Gameplay Effect application, removal, and execution. They are identified by tags following the `GameplayCue.*` naming convention. When a Gameplay Effect with a cue tag applies, the engine automatically finds and executes the matching cue handler.

The separation matters for several reasons:
- **Networking:** In multiplayer, game logic runs on the server, but visual effects need to play on clients. Gameplay Cues handle this automatically, running on all relevant clients without the server needing to manage particle systems or sounds.
- **Modularity:** You can change every visual effect for an ability without touching the ability's logic code. Swap fire particles for ice particles by editing the cue, not the ability.
- **Performance:** Cues can be optimised independently (LOD for particles, distance-based culling for sounds) without affecting gameplay code.
- **Reuse:** Multiple abilities can share the same cue. Five different fire spells can all trigger `GameplayCue.Damage.Fire` for their impact effect.

There are two cue types: `GameplayCueNotify_Static` for one-shot effects (hit sparks, impact sounds) and `GameplayCueNotify_Actor` for persistent effects (burning aura, shield glow) that need to be cleaned up when the associated effect ends.
</details>

---

### Question 8
In our turn-based RPG, how would you use GAS to implement an action point system where each character gets 3 action points per turn, melee attacks cost 1 point, and spells cost 2 points?

<details>
<summary>Answer</summary>

1. Add `ActionPoints` and `MaxActionPoints` attributes to the Attribute Set. Set `MaxActionPoints` to 3.

2. Create a Gameplay Effect `GE_RefreshActionPoints` (Instant) that sets ActionPoints to MaxActionPoints. The Turn Manager applies this at the start of each turn.

3. On each ability class, add a UPROPERTY `int32 ActionPointCost`. Set it to 1 for melee attacks and 2 for spells.

4. Create a cost Gameplay Effect for each ability (or a parameterised shared one) that subtracts the action point cost from the ActionPoints attribute. Assign this as the ability's Cost GE.

5. Override `CanActivateAbility` on your base ability class to check whether the character's current ActionPoints >= the ability's ActionPointCost.

6. The Turn Manager grants `Character.State.ActiveTurn` at the start of each character's turn. All combat abilities require this tag for activation.

7. After each ability ends, the Turn Manager checks the character's remaining ActionPoints. If 0 or less, it automatically advances to the next turn.

8. An "End Turn" ability with 0 cost lets players voluntarily forfeit remaining action points.

The GAS cost system handles the deduction automatically. The tag system handles turn gating. No special combat code is needed inside the abilities themselves.
</details>

---

### Question 9
What are Modifier Magnitude Calculations (MMCs), and how would you use one to calculate spell damage based on the caster's Mind attribute?

<details>
<summary>Answer</summary>

A Modifier Magnitude Calculation (MMC) is a custom C++ class (extending `UGameplayModCalcMagnitude`) that computes the magnitude of a Gameplay Effect modifier at runtime. Instead of using a fixed number or a simple curve table, you write a `CalculateBaseMagnitude` function that can pull attribute values from both the source (caster) and target, read tags, and perform arbitrary math.

For a spell damage MMC:

1. Create `UMMC_SpellDamage` extending `UGameplayModCalcMagnitude`.
2. In the constructor, define a `FGameplayEffectAttributeCaptureDefinition` that captures the source's Mind attribute.
3. In `CalculateBaseMagnitude_Implementation`:
   - Read the captured Mind value using `GetCapturedAttributeMagnitude`
   - Apply your formula: `Damage = BaseSpellDamage + (Mind * 1.2)`
   - Return the result

4. On the Gameplay Effect, set the modifier's magnitude calculation type to "Custom Calculation Class" and point it to your MMC.

Now every time the effect applies, it dynamically calculates damage based on the caster's current Mind stat. If the caster gets a Mind buff, their spell damage automatically increases on the next cast. The MMC captures the attribute at the time of effect creation (or application, depending on snapshot settings), making it robust against mid-calculation attribute changes.
</details>

---

### Question 10
How would you design a "Concentration" mechanic (inspired by DnD) using GAS, where a character can only maintain one concentration spell at a time, and taking damage forces a check that might break concentration?

<details>
<summary>Answer</summary>

1. **Tag setup:** Create `Character.State.Concentrating` and a subtag for each concentration spell (e.g., `Character.State.Concentrating.Bless`, `Character.State.Concentrating.Shield`).

2. **Ability configuration:** On every concentration ability, set `ActivationOwnedTags` to include `Character.State.Concentrating`. Set `CancelAbilitiesWithTag` to include `Character.State.Concentrating`. This means: when you start concentrating on a new spell, any existing concentration ability is automatically cancelled.

3. **Persistent effect:** Concentration abilities do not end when the animation finishes. Instead, they remain "active" and maintain a duration-based or infinite Gameplay Effect on the target(s). When the ability is cancelled or ends, the effect is removed.

4. **Damage interruption:** Create a passive ability `UGA_ConcentrationCheck` that listens for the Gameplay Event `Character.Event.DamageTaken`. When triggered:
   - Check if the character has the `Character.State.Concentrating` tag
   - If yes, perform the concentration check: generate a random value, compare against a threshold (e.g., DC = max(10, DamageTaken / 2))
   - If the check fails, find the active ability with `Character.State.Concentrating` in its tags and cancel it via `ASC->CancelAbilities(&ConcentrationTagContainer)`
   - If the check passes, concentration holds

5. **UI feedback:** Query the ASC for the `Character.State.Concentrating` tag and display an indicator. When concentration breaks, trigger a Gameplay Cue for a visual/audio effect (shattering glass sound, fading aura).

This design uses tags for mutual exclusion (only one concentration spell at a time), event-driven abilities for the interruption check, and standard GAS cancellation for ending the maintained effect. No custom manager class is needed.
</details>
