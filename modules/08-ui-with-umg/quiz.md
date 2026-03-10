# Module 08: Quiz - User Interface

Test your understanding of UMG and UI design in Unreal Engine. Try to answer each question before revealing the answer.

---

### Question 1

What is the purpose of Anchors in UMG, and what happens if you do not set them correctly?

<details>
<summary>Show Answer</summary>

Anchors define where a widget is positioned **relative to the screen boundaries**. They ensure the widget stays in the correct position regardless of screen resolution. If you anchor a health bar to the bottom-left, it stays in the bottom-left whether the game is running at 720p, 1080p, or 4K. Without correct anchors, widgets are positioned in absolute pixel coordinates. A widget that looks perfectly placed at 1920x1080 may overlap with other elements, go off-screen, or appear in the wrong position at different resolutions. Always set anchors as the first step when placing any widget.

</details>

---

### Question 2

Why is event-driven UI updating (using Event Dispatchers) recommended over property binding for Tabletop Quest's HP bar?

<details>
<summary>Show Answer</summary>

Property bindings run a function **every frame** to check the current value, even if the value has not changed. For a single HP bar this is negligible, but when you have 20+ bound properties (HP, mana, cooldowns, status effects, inventory counts), the per-frame cost adds up. Event-driven updates only fire **when the value actually changes**. The Player Character broadcasts `OnHPChanged` only when damage or healing occurs, and the widget updates only at that moment. For something like HP that changes a few times per minute, event-driven is dramatically more efficient than polling 60 times per second.

</details>

---

### Question 3

How does the smooth HP bar lerp work, and why does it feel better than an instant snap?

<details>
<summary>Show Answer</summary>

The lerp uses two values: `DisplayHP` (what the bar currently shows) and `ActualHP` (the real value). When damage occurs, `ActualHP` updates instantly, but `DisplayHP` catches up gradually using the formula `DisplayHP = Lerp(DisplayHP, ActualHP, DeltaTime * Speed)`. This creates a smooth sliding animation. It feels better because instant snaps are jarring and hard to read. If the player takes 30 damage, a snap changes the bar in a single frame (16ms at 60fps). The player might not even see it happen. A lerp over 0.3-0.5 seconds gives the player time to register the change, understand how much damage they took, and feel the impact. It also creates a satisfying visual flow.

</details>

---

### Question 4

Explain the difference between a Canvas Panel, a Horizontal Box, and an Overlay. When would you use each one?

<details>
<summary>Show Answer</summary>

**Canvas Panel**: A free-form container where children are positioned with absolute X/Y coordinates (plus anchors). Use it as the root of a HUD or any layout where elements need to be in specific screen positions (HP bar bottom-left, minimap top-right).

**Horizontal Box**: Arranges children left-to-right in a row, automatically handling spacing and sizing. Use it for lists of similar elements: the ability hotbar (6 slots in a row), the initiative tracker (portraits in a row), menu tabs.

**Overlay**: Stacks children on top of each other, centered by default. Use it for layered elements: an HP bar (background image + progress bar fill + text on top), a cooldown slot (icon + sweep overlay + key label).

</details>

---

### Question 5

You are building the inventory tooltip for Tabletop Quest. When the player hovers over a Longsword of Flame (+3 Might, +2 Fire Damage), and they currently have a Steel Longsword equipped (+2 Might), what should the tooltip display for the stat comparison?

<details>
<summary>Show Answer</summary>

The tooltip should show:

- **Longsword of Flame** (orange text, since it is likely Epic or Legendary rarity)
- One-Handed Sword
- +3 Might (**+1** in green, compared to the +2 on the current weapon)
- +2 Fire Damage (**+2** in green, since the current weapon has no fire damage)

The comparison section shows the net change: Might goes from +2 to +3, so the player gains +1 (green). Fire Damage goes from 0 to +2, so the player gains +2 (green). If any stat would decrease, that line would be red. This lets the player instantly see whether the new item is an upgrade without doing mental math.

</details>

---

### Question 6

How do you implement the typewriter effect for the dialogue system?

<details>
<summary>Show Answer</summary>

Store the full dialogue string in `FullText` and track the current position with `CharIndex` (starting at 0). Set a repeating Timer that fires every 0.03 seconds (adjustable for speed). Each time it fires, increment `CharIndex` by 1 and set the Text Block to the substring of `FullText` from character 0 to `CharIndex`. When `CharIndex` equals the length of `FullText`, stop the timer and show the "continue" prompt. If the player presses the advance key while the typewriter is running, instantly set `CharIndex` to the full length (skip to end). If they press it when the text is fully displayed, advance to the next dialogue node.

</details>

---

### Question 7

Why does the initiative tracker need to update dynamically during combat, and what events should it respond to?

<details>
<summary>Show Answer</summary>

The initiative tracker needs dynamic updates because combat state changes constantly. It should respond to:

1. **OnTurnStarted(CombatantID)**: Move the gold highlight to the active combatant's slot with a smooth animation.
2. **OnCombatantDied(CombatantID)**: Fade out and remove the dead combatant's slot, shift remaining slots to fill the gap.
3. **OnCombatantAdded(CombatantID, Initiative)**: Insert a new slot at the correct position (e.g., when the Dragon summons Skeleton minions mid-fight).
4. **OnStatusEffectChanged(CombatantID, Effect)**: Update or add/remove status effect icons on the affected slot.
5. **OnHPChanged(CombatantID, NewHP, MaxHP)**: Update the mini HP bar below each portrait.

Without these dynamic updates, the tracker would show stale data and confuse the player about whose turn it is.

</details>

---

### Question 8

What is a Widget Switcher, and how would you use it for the Settings screen in Tabletop Quest's pause menu?

<details>
<summary>Show Answer</summary>

A Widget Switcher is a container that holds multiple child widgets but only displays **one at a time**, controlled by an Active Index. It works like browser tabs. For the Settings screen, you create tab buttons (Video, Audio, Controls, Accessibility) across the top, and a Widget Switcher below containing four child widgets (one for each category). When the player clicks the "Audio" tab, you set the Widget Switcher's Active Index to 1 (or whichever index corresponds to the Audio panel). Only the Audio settings panel is visible; the others are hidden but still exist and retain their state. This is more efficient than creating and destroying panels on every tab switch.

</details>

---

### Question 9

How should floating damage numbers be positioned on screen, and what visual differences should there be between a normal hit, a critical hit, and a heal?

<details>
<summary>Show Answer</summary>

Damage numbers are positioned by projecting the damaged actor's world location to screen coordinates using **Project World Location to Widget Position**. Add a slight Y offset to place them above the character's head.

Visual differences:
- **Normal hit**: White text, standard size, floats upward 100 pixels over 1 second, fades from opacity 1.0 to 0.0
- **Critical hit**: Yellow or gold text, 1.5x larger size, bounces up then slightly down (elastic ease), lasts 1.5 seconds, optional "!" appended
- **Heal**: Green text, standard size, floats upward, same fade
- **Miss**: Gray "MISS" text, smaller than normal, quicker fade (0.7 seconds)
- **Status effect**: Purple text showing the effect name ("POISONED"), medium duration

Each type uses the same widget class (`WBP_DamageNumber`) but with different parameters for color, scale, duration, and animation curve.

</details>

---

### Question 10

You are designing the HUD Manager for Tabletop Quest. The player is in exploration mode (seeing HP, mana, minimap, quest tracker). They enter combat, which transitions to turn-based mode. Mid-fight, they switch to real-time mode. Then they open the pause menu. Describe what the HUD Manager does at each transition.

<details>
<summary>Show Answer</summary>

**Exploration to Turn-Based Combat:**
- Fade out: Minimap, Quest Tracker
- Keep visible: HP bar, Mana bar
- Fade in: Initiative Tracker (top-center), Action Economy Panel (bottom-center showing Move/Action/Bonus)
- Show: Hex grid overlay on the world

**Turn-Based to Real-Time Combat (mid-fight switch):**
- Fade out: Initiative Tracker, Action Economy Panel, Hex grid overlay
- Keep visible: HP bar, Mana bar
- Fade in: Ability Hotbar (bottom-center) with cooldown states

**Real-Time Combat to Pause Menu:**
- Keep all combat UI visible but dimmed (reduce opacity to 30%)
- Overlay: Dark full-screen background (60% black)
- Fade in: Pause Menu (centered)
- Call Set Game Paused (true)
- Call Set Input Mode UI Only
- Show mouse cursor

At each transition, the HUD Manager calls the appropriate show/hide functions with fade animations (0.3 seconds). It tracks the previous state so that closing the pause menu returns to the correct combat mode UI rather than defaulting to exploration.

</details>
