# Module 08: User Interface

## Building the HUD for Tabletop Quest

A game without a UI is like a car without a dashboard. The engine might be powerful, but without a speedometer, fuel gauge, and warning lights, the driver has no idea what is happening. In a DnD-inspired RPG, the UI carries even more weight than usual. Players need to see HP bars, mana pools, initiative order, ability cooldowns, inventory grids, character stats, equipment slots, dialogue options, and combat overlays. That is a lot of information, and your job is to present it clearly without covering the beautiful 3D world underneath.

In this module, you will build the actual HUD for Tabletop Quest. Not a generic UI tutorial. You will create the health and mana bars that sit in the corner during exploration, the ability hotbar that lights up during combat, the inventory screen where players equip their loot, the dialogue system for talking to tavern keepers and quest givers, a minimap that shows the dungeon layout, and a pause menu. Every widget you build will be a real piece of the game.

UE5's UI framework is called **UMG (Unreal Motion Graphics)**. Think of it as Photoshop layers that are interactive and respond to game data. You drag and drop elements, arrange them in panels, bind their properties to game variables, and animate them.

---

## Part 1: Widget Blueprints

### What Is a Widget Blueprint?

A Widget Blueprint is a special type of Blueprint that defines a piece of UI. Think of it like a Figma frame where each element is interactive and can respond to game data. A Widget Blueprint can be as simple as a single text label or as complex as a full inventory screen with scrollable grids, drag-and-drop items, and tooltip popups.

### Creating a Widget Blueprint

1. Right-click in the Content Browser: **User Interface > Widget Blueprint**
2. Name it (e.g., `WBP_MainHUD`, `WBP_InventoryScreen`, `WBP_DialogueBox`)
3. Double-click to open the **UMG Designer**

The UMG Designer has two main views:
- **Designer tab**: Visual layout editor where you drag, position, and arrange widgets
- **Graph tab**: Blueprint graph where you write logic (event handling, data updates, animations)

### The Widget Hierarchy

Every Widget Blueprint has a hierarchy (visible in the Hierarchy panel on the left). The root is usually a panel widget, and everything else is nested inside it. This works like HTML: you have containers that hold other containers that hold content.

```
[Canvas Panel] (root)
  |-- [Horizontal Box] (top bar)
  |     |-- [Image] (portrait)
  |     |-- [Vertical Box]
  |           |-- [Progress Bar] (HP)
  |           |-- [Progress Bar] (Mana)
  |
  |-- [Horizontal Box] (ability hotbar, bottom center)
  |     |-- [Button] (Ability 1)
  |     |-- [Button] (Ability 2)
  |     |-- [Button] (Ability 3)
```

### Essential Widget Types

| Widget | What It Does | Tabletop Quest Use |
|--------|-------------|-------------------|
| **Canvas Panel** | Free-form container, position children anywhere | Root of HUD, allows absolute positioning |
| **Horizontal Box** | Arranges children left to right | Ability hotbar, initiative tracker |
| **Vertical Box** | Arranges children top to bottom | Stat lists, menu options |
| **Overlay** | Stacks children on top of each other | HP bar (background + fill + text) |
| **Size Box** | Forces a specific size on its child | Consistent icon sizes in inventory |
| **Progress Bar** | Fills from 0% to 100% | HP bar, mana bar, XP bar |
| **Image** | Displays a texture | Character portrait, ability icon, minimap |
| **Text Block** | Displays text | Character name, damage numbers, dialogue |
| **Button** | Clickable element | Menu buttons, ability slots, inventory items |
| **Scroll Box** | Scrollable container | Inventory grid, quest log |
| **Uniform Grid Panel** | Grid layout with equal-sized cells | Inventory grid, equipment slots |
| **Border** | Container with background styling | Tooltip background, panel frames |

### Anchors: Why Your UI Breaks on Different Screens

The most common beginner mistake with UMG is forgetting about anchors. An anchor defines where a widget is positioned relative to the screen. Without proper anchors, your UI that looks perfect at 1920x1080 will be completely wrong at 2560x1440 or 1280x720.

Anchor presets (the flower-petal icon in the Designer):

| Anchor | Use For |
|--------|---------|
| Top-Left | Menu button, minimap |
| Top-Center | Initiative tracker, zone name |
| Top-Right | Gold count, quest tracker |
| Center | Pause menu, confirmation dialogs |
| Bottom-Left | Chat log, combat log |
| Bottom-Center | Ability hotbar, dialogue options |
| Bottom-Right | System buttons (menu, map) |
| Full Stretch | Full-screen overlays, inventory background |

For Tabletop Quest's main HUD:
- HP/Mana bars: anchored **bottom-left**
- Ability hotbar: anchored **bottom-center**
- Minimap: anchored **top-right**
- Initiative tracker: anchored **top-center**
- Quest tracker: anchored **right** with vertical stretch

### Adding a Widget to the Screen

To display a Widget Blueprint during gameplay:

1. In your Player Controller or HUD Blueprint, on **Event BeginPlay**:
2. Call **Create Widget** and select your Widget Blueprint class (e.g., `WBP_MainHUD`)
3. Store the result in a variable (so you can update it later)
4. Call **Add to Viewport** on the created widget

For Tabletop Quest, you will create the main HUD widget once when the game starts and keep it on screen. Other widgets (inventory, pause menu, dialogue) are created and added/removed as needed.

---

## Part 2: Health and Mana Bars

### Designing the Tabletop Quest HP Bar

The HP bar is the single most important UI element in an RPG. The player needs to know their health status at a glance, without reading numbers, without thinking. Color, size, and position all communicate information.

For Tabletop Quest's HP bar design:

- **Position**: Bottom-left corner (standard RPG convention, players expect it here)
- **Shape**: Wide rectangle with rounded ends (tavern/fantasy aesthetic)
- **Color**: Red fill on dark background
- **Extras**: Character portrait to the left, name above, numeric HP value overlaid ("85 / 100")
- **Behavior**: Smooth lerp when HP changes (the bar slides down, not snaps), flash red when taking damage, pulse when critically low (below 25%)

### Building the HP Bar Widget

Create `WBP_HealthBar`:

1. Root: **Overlay** (so elements stack on top of each other)
2. Layer 1: **Image** (dark background with rounded rectangle texture)
3. Layer 2: **Progress Bar** (the actual fill)
   - Fill Color: Red (200, 50, 50)
   - Background Color: Transparent (the Image behind handles the background)
   - Percent: Bound to a variable
4. Layer 3: **Text Block** (numeric display: "85 / 100")
   - Centered in the overlay
   - Font: Your fantasy font, size 14
   - Color: White with slight shadow

### Binding HP Data

You need to connect the Progress Bar's percentage to actual game data. There are two approaches:

**Approach 1: Property Binding (Simple but costly)**

In the Progress Bar's Details panel, click the "Bind" dropdown next to Percent and create a binding function. This function runs every frame and returns the current HP percentage.

```
Function: GetHPPercent
  Get Owning Player Pawn > Cast to BP_PlayerCharacter > Get CurrentHP / MaxHP > Return
```

Property bindings run every frame, which is fine for one or two values but adds up if you bind 20 things.

**Approach 2: Event-Driven Updates (Recommended)**

Instead of polling every frame, push updates when HP changes:

1. On the Player Character, create an **Event Dispatcher**: `OnHPChanged` with parameters (CurrentHP, MaxHP)
2. When HP changes (damage taken, potion used, heal received), broadcast `OnHPChanged`
3. In the HUD widget, bind to the character's `OnHPChanged` dispatcher
4. In the handler, update the Progress Bar percentage and the text

This is more work to set up but far more efficient. The UI only updates when data actually changes.

### The Smooth HP Bar Lerp

When the player takes damage, the HP bar should slide down smoothly, not snap instantly. This is a small detail that makes the UI feel polished.

In the widget's Tick event (or an animation):

1. Store two values: `DisplayHP` (what the bar shows) and `ActualHP` (the real value)
2. When damage occurs, `ActualHP` updates immediately
3. Each frame, lerp `DisplayHP` toward `ActualHP`: `DisplayHP = Lerp(DisplayHP, ActualHP, DeltaTime * 5.0)`
4. Set the Progress Bar to `DisplayHP / MaxHP`

This creates a satisfying slide-down effect. You can even add a secondary "damage preview" bar (a lighter color behind the main bar that shows the recent damage) like many modern RPGs do.

### Mana Bar

The mana bar follows the same pattern as the HP bar but with these differences:

| Property | HP Bar | Mana Bar |
|----------|--------|----------|
| Color | Red (200, 50, 50) | Blue (50, 100, 200) |
| Position | Above mana bar | Below HP bar |
| Critical Pulse | Below 25% HP | Below 15% mana |
| Text | "85 / 100" | "40 / 60" |

For Warrior and Rogue classes, the mana bar becomes a "Stamina" bar (same mechanics, amber color). You can handle this by parameterizing the bar widget: pass in the color and label on creation.

### Enemy Health Bars (World Space)

Enemies in Tabletop Quest need health bars too, but these appear above the enemy's head in 3D space, not on the HUD.

1. Create `WBP_EnemyHealthBar`: A small Progress Bar with no text, just a red fill on a dark background
2. On each enemy Pawn, add a **Widget Component** (Components panel)
3. Set the Widget Component's **Widget Class** to `WBP_EnemyHealthBar`
4. Set **Space** to **World** (renders in 3D)
5. Position it above the enemy's head (adjust the Z offset)
6. Set **Draw At Desired Size** to true
7. Enable **Screen Space** rendering for better text clarity

The enemy health bar should:
- Only appear when the enemy has taken damage (invisible at full HP)
- Face the camera at all times (billboard behavior, enabled on the Widget Component)
- Disappear 3 seconds after the enemy stops taking damage
- Be smaller for minor enemies, larger for bosses

---

## Part 3: Ability Hotbar

### Designing the Hotbar

The ability hotbar is where the player's combat abilities live during real-time combat. In Tabletop Quest, the player character can have up to 6 active abilities mapped to keys 1-6 (or a gamepad face buttons + triggers).

Design requirements:
- **Position**: Bottom-center of the screen
- **Layout**: Horizontal row of 6 slots
- **Each slot shows**: Ability icon, cooldown overlay (darkening sweep), key binding label (1-6), optional mana cost
- **Visual feedback**: Active ability glows, on-cooldown slots are grayed with a radial sweep, insufficient mana slots have a red tint

### Building the Hotbar

Create `WBP_AbilitySlot` (a single slot):

1. Root: **Size Box** (64x64 pixels, consistent sizing)
2. Inside: **Overlay**
   - Layer 1: **Image** (ability icon, bound to ability data)
   - Layer 2: **Image** (cooldown overlay, material with radial sweep)
   - Layer 3: **Text Block** (key label "1", positioned top-left corner)
   - Layer 4: **Text Block** (mana cost "15", positioned bottom-right corner)
3. Wrap in **Border** with a stylized frame (stone/metal fantasy border)

Create `WBP_AbilityHotbar` (the full bar):

1. Root: **Horizontal Box**
2. Add 6 instances of `WBP_AbilitySlot`
3. Set spacing between slots: 4 pixels

### The Cooldown Overlay

The cooldown visual is a radial sweep that fills clockwise. This is done with a **Material** applied to an Image widget.

1. Create a material `M_CooldownOverlay`
2. Set Material Domain to **User Interface**
3. Set Blend Mode to **Translucent**
4. Use a **radial gradient** node combined with a **step** function
5. Drive the sweep angle with a **scalar parameter** `CooldownPercent` (0.0 = ready, 1.0 = full cooldown)
6. Output: semi-transparent dark color where the sweep has not reached, fully transparent where it has

In the widget, when an ability goes on cooldown:
1. Set `CooldownPercent = 1.0`
2. Each tick, reduce it: `CooldownPercent = Max(0, CooldownPercent - DeltaTime / CooldownDuration)`
3. Update the material parameter

When `CooldownPercent` reaches 0, the ability is ready. You can add a flash or pulse when the cooldown completes to draw the player's attention.

### Connecting Abilities to Slots

The hotbar needs to know which abilities the player has equipped. In Tabletop Quest's design, the player selects abilities from their class list and assigns them to slots.

Create a data structure `S_AbilitySlotData`:

| Field | Type | Purpose |
|-------|------|---------|
| AbilityID | Name | Unique identifier for the ability |
| Icon | Texture2D | The ability's icon |
| ManaCost | Int | Mana/Stamina cost |
| CooldownDuration | Float | Cooldown in seconds |
| CurrentCooldown | Float | Remaining cooldown |
| KeyBinding | String | Display text ("1", "2", etc.) |

The Player Character holds an array of 6 `S_AbilitySlotData` entries. When an ability is used, the character updates the corresponding entry's `CurrentCooldown`. The hotbar widget reads this data and updates the display.

### Turn-Based Mode Hotbar

In turn-based mode, the hotbar changes:

- Cooldowns are replaced by **action economy indicators**: has the player used their Action this turn? Their Bonus Action?
- Abilities are grayed out if the player does not have the required action type remaining
- A "Move" indicator shows remaining movement distance
- An "End Turn" button appears at the end of the hotbar

You can handle this with a `CombatMode` variable on the widget. When the mode is turn-based, swap the cooldown overlay for an "action used" overlay, and show/hide the End Turn button.

---

## Part 4: Inventory Screen

### Designing the Inventory

Tabletop Quest's inventory system has two sections:

1. **Equipment slots** (9 total): Weapon, Off-hand/Shield, Armor, Helm, Boots, Ring x2, Amulet, Cloak
2. **Bag inventory**: A grid of items the player is carrying but not wearing

The inventory screen opens when the player presses I (or a gamepad button). It pauses the game (or slows time) and overlays a full-screen widget.

### Equipment Panel

Create `WBP_EquipmentPanel`:

The equipment layout should resemble the character's body (the classic RPG paper doll):

```
            [Helm]
  [Weapon]  [Armor]  [Off-hand]
  [Ring 1]  [Boots]  [Ring 2]
  [Amulet]          [Cloak]
```

Each slot is a **Button** with an **Image** child (showing the equipped item's icon, or an empty slot graphic). When the player clicks a slot, it opens a sub-menu of compatible items from the bag.

### Bag Grid

The bag inventory is a scrollable grid:

1. Create `WBP_InventoryGrid` with a **Uniform Grid Panel** inside a **Scroll Box**
2. Each grid cell is a `WBP_InventorySlot` (Button + Image + optional Stack Count text)
3. Total slots: 40 (8 columns x 5 rows), expandable with bag upgrades
4. Empty slots show a subtle outline/frame
5. Occupied slots show the item icon and stack count (if stackable)

### Item Tooltips

When the player hovers over an item (mouse) or highlights it (gamepad), a tooltip appears showing:

- Item name (color-coded by rarity: white/common, green/uncommon, blue/rare, purple/epic, orange/legendary)
- Item type (e.g., "Heavy Armor", "One-Handed Sword")
- Stats (e.g., "+3 Might", "15 Armor")
- Description (flavor text: "Forged in the fires of Mount Grondur, this blade hums with barely contained fury")
- Comparison (if an item of the same type is equipped, show stat differences in green/red)

Create `WBP_ItemTooltip`:

1. Root: **Border** with a dark, semi-transparent background and gold border
2. **Vertical Box** inside:
   - Text Block: Item name (bold, colored by rarity)
   - Text Block: Item type (gray, smaller)
   - Horizontal separator line
   - Vertical Box: Stat lines (one Text Block per stat)
   - Horizontal separator line
   - Text Block: Description (italic, smaller, wrapping enabled)

### Drag and Drop

UMG supports drag-and-drop natively. For the inventory:

1. On each `WBP_InventorySlot`, handle **On Mouse Button Down** to start a drag operation
2. Create a drag visual (the item icon following the cursor)
3. Equipment slots and bag slots both accept drops
4. When an item is dropped on an equipment slot, equip it (if compatible)
5. When an item is dropped on another bag slot, swap positions
6. When an item is dropped outside the inventory, prompt "Drop item?" confirmation

For gamepad support, replace drag-and-drop with a select-and-place system: press A to pick up an item, navigate to the destination, press A again to place it.

### Python Automation for Inventory UI

Here is where Claude and Python can save you time. If you have 50+ items in the game (the GDD calls for 9 equipment slots with multiple options per slot), you need icons, tooltips, and stat data for each one. A Python script can batch-import item icons and generate a Data Table:

```python
import unreal
import json

def import_item_data(json_path):
    """
    Reads item definitions from a JSON file and logs them
    for Data Table creation.
    """
    with open(json_path, 'r') as f:
        items = json.load(f)

    for item in items["items"]:
        name = item["name"]
        slot = item["slot"]
        rarity = item["rarity"]
        stats = item.get("stats", {})

        unreal.log(f"Item: {name} | Slot: {slot} | Rarity: {rarity}")
        for stat_name, stat_val in stats.items():
            unreal.log(f"  {stat_name}: +{stat_val}")
```

Use a Data Table (created from a Struct) to store all item data. The inventory widget reads from the Data Table to populate slots, tooltips, and comparisons.

---

## Part 5: Dialogue System

### How Dialogue Works in Tabletop Quest

Dialogue in Tabletop Quest comes from two sources:

1. **Scripted dialogue**: Hand-written conversations with NPCs (tavern keeper, blacksmith, quest givers)
2. **AI DM dialogue**: Generated by the local Ollama LLM during freeplay mode

Both sources feed into the same UI widget. The widget does not care where the text comes from; it just displays it.

### Dialogue Widget Design

The dialogue box appears at the bottom of the screen when the player talks to an NPC. It shows:

- **NPC portrait** (left side)
- **NPC name** (above the text)
- **Dialogue text** (typewriter effect, one character at a time)
- **Response options** (when the player has choices, 2-4 buttons appear below the text)
- **Continue indicator** (a small arrow or "press E" prompt when there is more to read)

### Building the Dialogue Widget

Create `WBP_DialogueBox`:

1. Root: **Canvas Panel**
2. **Border** anchored to bottom, covering the bottom 25% of the screen. Dark, semi-transparent background with a parchment texture.
3. Inside the Border, a **Horizontal Box**:
   - **Image**: NPC portrait (128x128), rounded frame
   - **Vertical Box**:
     - **Text Block**: NPC name (bold, gold color)
     - **Rich Text Block**: Dialogue text (supports bold, italic, color per word)
     - **Vertical Box** (response options container, dynamically populated)

### The Typewriter Effect

Text appearing one character at a time is a staple of RPG dialogue. Here is how to implement it:

1. Store the full dialogue string in a variable: `FullText`
2. Store the currently visible portion: `DisplayText`
3. Track the current character index: `CharIndex`
4. On a Timer (firing every 0.03 seconds, adjustable for speed):
   - Increment `CharIndex`
   - Set `DisplayText` to the substring of `FullText` from 0 to `CharIndex`
   - Update the Text Block
5. When `CharIndex` reaches the length of `FullText`, stop the timer and show the continue prompt
6. If the player presses the continue key during typing, instantly set `DisplayText = FullText` (skip to end)

Play a subtle "click" or "scribble" sound with each character for an extra layer of immersion (you will build this in Module 10).

### Response Options

When the player has dialogue choices, create buttons dynamically:

1. Create `WBP_DialogueOption`:
   - Button with Text Block inside
   - Hover effect: text color changes, slight scale-up
   - Numbered: "[1] I'll take the quest" "[2] Not interested" "[3] Tell me more about the dungeon"
2. In the dialogue widget, when responses are needed:
   - Clear the response container
   - For each response option, create a `WBP_DialogueOption` and add it to the container
   - Bind each button's OnClicked to send the selected response back to the dialogue system

### Dialogue Data Structure

Scripted dialogue uses a Data Table or a custom dialogue tree system:

```
S_DialogueNode:
  - NodeID (Name)
  - Speaker (Name)
  - Text (String)
  - Responses (Array of S_DialogueResponse)
  - NextNodeID (Name, for linear progression)
  - Conditions (Array of Name, e.g., "HasCompletedQuest_GoblinCaves")

S_DialogueResponse:
  - Text (String)
  - NextNodeID (Name)
  - Conditions (Array of Name)
  - Effects (Array of Name, e.g., "StartQuest_DragonSlayer", "AddGold_50")
```

This structure lets you create branching conversations with conditions (show certain options only if the player has completed a quest) and effects (accepting a quest, receiving gold, changing reputation).

### Connecting to the AI Dungeon Master

In freeplay mode, the Ollama LLM generates NPC dialogue dynamically. The flow is:

1. Player initiates conversation with an NPC
2. Game sends the NPC's profile and context to Ollama (via HTTP)
3. Ollama returns dialogue text and response options as JSON
4. The dialogue widget receives the JSON and displays it using the same typewriter effect and response buttons

The widget does not change. Only the data source changes. This is the beauty of separating data from presentation.

### Skill Checks in Dialogue

Some dialogue options require skill checks (Persuasion, Intimidation, etc.). These show the required skill and the player's modifier:

```
[1] "Hand over the key, or else." [Intimidation: 12, Your Modifier: +3]
[2] "Perhaps we can come to an arrangement?" [Persuasion: 10, Your Modifier: +5]
[3] "I'll just be going then."
```

Color-code the check difficulty:
- Green: Player's modifier makes success likely (>= 70% chance)
- Yellow: Moderate chance (40-69%)
- Red: Low chance (< 40%)

This gives players enough information to make meaningful choices without revealing the exact dice roll.

---

## Part 6: Initiative Tracker (Turn-Based Combat UI)

### What the Initiative Tracker Shows

In turn-based combat, Tabletop Quest displays the turn order as a horizontal bar at the top of the screen. Each combatant (player characters and enemies) gets a portrait in the bar, ordered by initiative roll.

### Building the Tracker

Create `WBP_InitiativeTracker`:

1. Root: **Canvas Panel**, anchored top-center
2. **Horizontal Box** with a dark, semi-transparent background
3. Each entry is a `WBP_InitiativeSlot`:
   - **Image**: Character/enemy portrait (48x48)
   - **Border**: Frame around the portrait. Gold for the current turn, white for allies, red for enemies
   - **Progress Bar** (tiny, below the portrait): Shows remaining HP as a visual indicator
   - **Image overlay**: Status effect icons (poisoned, stunned, etc.) stacked in a corner

### Highlighting the Active Turn

When it is a combatant's turn:

1. Scale up their slot slightly (1.2x)
2. Change the frame to gold
3. Add a subtle glow or pulse animation
4. Slide a selection arrow above the slot

When a turn ends, the highlight moves to the next slot with a smooth animation (the active indicator slides from one slot to the next).

### Dynamic Updates

The tracker needs to update when:

- A combatant dies (remove their slot, shift others)
- A combatant is added mid-fight (Dragon summons minions, add slots at the correct initiative position)
- Status effects change (update the status icon overlay)
- HP changes (update the mini HP bar)

Use Event Dispatchers from the combat system:
- `OnInitiativeOrderChanged`: Rebuild the tracker
- `OnTurnStarted(CombatantID)`: Move the highlight
- `OnCombatantDied(CombatantID)`: Remove a slot with a fade-out animation
- `OnStatusEffectChanged(CombatantID, Effect)`: Update the status icons

### Turn Actions Panel

Below the initiative tracker (or in the bottom-center area), show the current character's available actions during their turn:

```
[Move: 30ft remaining] [Action: Available] [Bonus: Available] [End Turn]
```

As the player uses their action economy, these indicators update:
- Move: Decrements as the character moves on the hex grid
- Action: Grays out after using an action (attack, spell)
- Bonus: Grays out after using a bonus action
- End Turn: Always available, passes to the next combatant

---

## Part 7: Minimap

### Minimap Design for Tabletop Quest

The minimap sits in the top-right corner and shows a top-down view of the area around the player. In a dungeon, it reveals rooms as the player explores them (fog of war). In the overworld, it shows the terrain, paths, and points of interest.

### Technical Implementation

There are two common approaches to minimaps in UE5:

**Approach 1: Scene Capture (Render-to-Texture)**

1. Create a **Scene Capture Component 2D** attached to the player (or a fixed position above the player)
2. Point it straight down (top-down view)
3. Set it to render to a **Render Target** texture
4. In the minimap widget, display the Render Target as an **Image**
5. Add a circular mask material to make it round
6. Reduce the Scene Capture's capture rate to save performance (5-10 FPS is fine for a minimap)

This gives you a real-time, accurate view of the world but is more expensive on GPU.

**Approach 2: Prebuilt Map Texture**

1. For each area, create a hand-drawn or auto-generated top-down map texture
2. In the minimap widget, display the texture as an Image
3. Calculate the player's position relative to the map bounds and position a "player dot" on the Image
4. Add enemy dots, NPC dots, and objective markers as additional Image widgets

This is cheaper but requires creating map textures for every area.

For Tabletop Quest, use **Approach 1 for the overworld** (dynamic terrain, changes with time of day and weather) and **Approach 2 for dungeons** (static layouts, fog of war is easier to implement as a texture mask).

### Fog of War

For dungeon minimaps, unrevealed areas should be hidden:

1. Create a texture the same resolution as the dungeon map
2. Initialize it to solid black (everything hidden)
3. As the player explores, "paint" white circles on the texture at the player's position
4. Use this texture as an alpha mask on the minimap. Black areas are hidden. White areas are visible.
5. Save the fog of war texture as part of the save game so exploration progress persists.

### Minimap Markers

Add icons for important locations:

| Marker | Icon | Color |
|--------|------|-------|
| Player | Arrow (shows facing direction) | White |
| Party members | Circles | Blue |
| Enemies (detected) | Diamonds | Red |
| Quest objectives | Exclamation mark | Yellow |
| Shops | Coin/bag icon | Gold |
| Dungeon entrance | Door icon | Brown |

Create `WBP_MinimapMarker` as a reusable widget. It takes an icon, color, and world position, then the minimap translates the world position to minimap coordinates and places the marker.

---

## Part 8: Pause Menu

### Pause Menu Design

When the player presses Escape (or Start on gamepad), the game pauses and shows a menu overlay:

```
          TABLETOP QUEST

       [Resume Game]
       [Inventory]
       [Character Sheet]
       [Quest Log]
       [Settings]
       [Save Game]
       [Load Game]
       [Quit to Menu]
```

### Building the Pause Menu

Create `WBP_PauseMenu`:

1. Root: **Canvas Panel** with full stretch
2. **Image**: Full-screen dark overlay (black, 60% opacity) to dim the game world
3. **Vertical Box** centered on screen:
   - **Text Block**: "TABLETOP QUEST" (large, fantasy font, gold color)
   - 8 **Button** widgets, each with a Text Block child
   - Consistent styling: dark background, gold border, hover effect (scale up, glow)

### Pausing the Game

When the pause menu opens:

1. Call **Set Game Paused** (true) to freeze gameplay
2. Call **Set Input Mode UI Only** to redirect input from the player character to the menu
3. Call **Set Show Mouse Cursor** (true)
4. Create and add `WBP_PauseMenu` to the viewport

When Resume is clicked (or Escape pressed again):

1. Remove `WBP_PauseMenu` from viewport
2. Call **Set Game Paused** (false)
3. Call **Set Input Mode Game Only**
4. Call **Set Show Mouse Cursor** (false, or true if your game always shows cursor)

### Settings Screen

The Settings button opens a sub-widget with tabs:

- **Video**: Resolution, quality presets, fullscreen/windowed, vsync, FPS cap
- **Audio**: Master volume, music volume, SFX volume, voice volume (sliders)
- **Controls**: Key bindings (rebindable), mouse sensitivity, gamepad toggle
- **Accessibility**: Subtitle size, colorblind mode, screen shake toggle

Each setting category is a separate widget placed inside a **Widget Switcher** (a container that shows one child at a time, like browser tabs).

Create tab buttons across the top. When a tab is clicked, set the Widget Switcher's active index to the corresponding settings panel.

### Save/Load Screens

The Save and Load buttons open a grid of save slots:

- 3 manual save slots
- 1 autosave slot (read-only, cannot be overwritten manually)
- 1 quicksave slot

Each slot shows:
- Screenshot thumbnail
- Character name and level
- Location name
- Play time
- Date/time stamp
- "Empty" for unused slots

### Gamepad Navigation

For gamepad support, UMG has a built-in **navigation system**:

1. Select a widget and look for the Navigation section in Details
2. Set Up/Down/Left/Right navigation to **Explicit** and pick the target widget
3. Or set it to **Automatic** and let UMG figure out the nearest widget in that direction

Make sure every interactive element in the pause menu is navigable with D-pad. Set a default focused widget (the first button) so the player does not have to hunt for where the cursor starts.

---

## Part 9: Damage Numbers and Combat Feedback

### Floating Damage Numbers

When an enemy takes damage, a number pops up above their head showing the damage dealt. This is a staple of RPGs and provides essential feedback.

Design:
- **Normal hit**: White text, floats upward, fades out over 1 second
- **Critical hit**: Yellow text, larger, bounces up then down, fades over 1.5 seconds
- **Heal**: Green text, floats upward
- **Miss**: Gray "MISS" text, smaller
- **Status effect applied**: Purple text with the effect name ("POISONED")

### Implementation

Create `WBP_DamageNumber`:

1. Root: **Canvas Panel**
2. **Text Block**: The damage number, large bold font with outline/shadow for readability against any background
3. Add a **Widget Animation**: Position moves upward (Y offset -100 over 1 second), Opacity fades from 1.0 to 0.0

To spawn a damage number:

1. In the damage-dealing code, after applying damage:
2. Create a `WBP_DamageNumber` widget
3. Set the text to the damage value
4. Set the color based on type (normal, crit, heal)
5. Calculate the screen position of the damaged actor's head using **Project World Location to Widget Position**
6. Position the widget at that screen location
7. Play the float-up animation
8. When the animation finishes, remove the widget from the viewport

### Screen Effects

For additional combat feedback:

- **Damage vignette**: When the player takes damage, flash a red vignette around the screen edges (a full-screen Image widget with a radial gradient, opacity pulsed from 0 to 0.3 and back to 0)
- **Low health overlay**: When below 25% HP, a persistent red vignette pulses slowly
- **Critical health heartbeat**: Below 10% HP, the vignette pulses faster and a heartbeat sound plays (you will add the sound in Module 10)

---

## Part 10: HUD Manager and Widget Switching

### The Problem: Multiple UI States

Tabletop Quest has many UI states:

- **Exploration**: Main HUD (HP, mana, minimap, quest tracker)
- **Turn-Based Combat**: Main HUD + initiative tracker + action economy panel + hex grid overlay
- **Real-Time Combat**: Main HUD + ability hotbar with cooldowns
- **Dialogue**: Dialogue box, dim background, no HUD elements except HP
- **Inventory**: Full-screen inventory, paused
- **Pause Menu**: Full-screen menu, paused
- **Tabletop View**: Different HUD entirely (overview of the map, no HP bar)

You need a system to manage which widgets are visible at any time.

### The HUD Manager

Create a **HUD Manager** as a component on the Player Controller (or as a UMG Widget itself that acts as a container).

The HUD Manager:
1. Creates all major widgets on BeginPlay and stores references
2. Exposes functions: `ShowExplorationHUD()`, `ShowCombatHUD()`, `ShowDialogue()`, `ShowInventory()`, etc.
3. Each function hides irrelevant widgets and shows relevant ones
4. Handles transitions (fade in/out, slide in/out)

```
Function: ShowTurnBasedCombatHUD()
  - Show: MainHUD (HP, Mana)
  - Show: InitiativeTracker
  - Show: ActionEconomyPanel
  - Hide: AbilityHotbar (cooldown version)
  - Hide: Minimap (combat uses a different camera angle)
  - Hide: QuestTracker
```

### Widget Animations

UMG has a built-in animation system (separate from character animations). In the Widget Blueprint editor:

1. Click **Animations** at the bottom
2. Create a new animation: `FadeIn`, `SlideIn`, `ScaleIn`
3. Add tracks for Render Opacity, Render Transform (position, scale), and Color
4. Keyframe the properties over time

Example fade-in:
- Time 0.0: Render Opacity = 0.0
- Time 0.3: Render Opacity = 1.0

Call `Play Animation` from Blueprint when showing a widget. This makes UI state changes feel smooth instead of jarring.

---

## Part 11: The Tabletop View UI

### A Different HUD for the Tabletop

When the player is viewing the tabletop (the top-down strategic view), the HUD changes completely. Instead of HP bars and ability hotbars, the player sees:

- **Location labels** hovering above areas on the tabletop map
- **Miniature info cards** when hovering over a party member miniature (name, class, level, HP)
- **A "Zoom In" prompt** when an area is selected
- **Quest markers** on the tabletop map showing objectives
- **Day/time indicator** (what time of day it is in the game world)

This requires a separate set of widgets that appear when the camera is in Tabletop mode and disappear when zooming into the world.

### Location Labels

Create `WBP_LocationLabel`:
1. **Text Block** with the location name
2. **Image** showing if the location is discovered, has enemies, or has a quest
3. Position using Widget Component in World Space, placed above each location on the tabletop

When the player hovers over a location:
- Expand the label to show more info (enemy count, loot available, quest status)
- Highlight the tabletop area (glow or outline on the miniature terrain)

---

## Part 12: Python Automation for UI

### Generating UI Data with Python

If you have 50+ items, 30+ abilities, and 20+ enemy types, manually setting up icons, descriptions, and stat displays is tedious. Python scripts can automate the data side:

```python
import unreal
import json

def generate_ability_data_table(json_path):
    """
    Reads ability definitions and prepares them for a UE5 Data Table.
    """
    with open(json_path, 'r') as f:
        abilities = json.load(f)

    for ability in abilities["abilities"]:
        name = ability["name"]
        icon_path = ability["icon_path"]
        mana_cost = ability["mana_cost"]
        cooldown = ability["cooldown"]
        desc = ability["description"]

        unreal.log(f"Ability: {name}")
        unreal.log(f"  Icon: {icon_path}")
        unreal.log(f"  Mana: {mana_cost}, CD: {cooldown}s")
        unreal.log(f"  Desc: {desc[:50]}...")
```

### Batch Icon Import

If you have ability icons as PNG files in a folder, Python can batch-import them:

```python
import unreal
import os

def batch_import_icons(source_folder, destination_path):
    """
    Imports all PNG files from a folder as textures into UE5.
    """
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()

    for filename in os.listdir(source_folder):
        if filename.endswith('.png'):
            source_file = os.path.join(source_folder, filename)
            asset_name = filename.replace('.png', '')

            task = unreal.AssetImportTask()
            task.set_editor_property("filename", source_file)
            task.set_editor_property("destination_path", destination_path)
            task.set_editor_property("destination_name", asset_name)
            task.set_editor_property("replace_existing", True)
            task.set_editor_property("automated", True)
            task.set_editor_property("save", True)

            asset_tools.import_asset_tasks([task])
            unreal.log(f"Imported: {asset_name}")
```

Ask Claude to generate the icon list, the ability descriptions, and the Data Table structures. You handle the visual layout in UMG; Claude handles the data.

---

## Part 13: Responsive Design and Accessibility

### Supporting Multiple Resolutions

Tabletop Quest should look good at common resolutions:

- 1920x1080 (1080p, the baseline)
- 2560x1440 (1440p)
- 3840x2160 (4K)
- 1280x720 (720p, lower-end PCs)
- Ultrawide (2560x1080, 3440x1440)

To handle this:

1. **Use anchors religiously**. Every widget should be anchored to the correct screen edge.
2. **Use DPI Scaling**. In Project Settings > User Interface > DPI Scaling, set a curve that maps resolution to scale factor. At 4K, UI elements should be larger so they are not tiny.
3. **Test at multiple resolutions**. In PIE, change the viewport resolution and verify nothing overlaps or goes off-screen.
4. **Use Horizontal/Vertical Boxes** instead of absolute positioning wherever possible. Boxes adapt to content size automatically.

### Accessibility Features

Good RPG UI is accessible:

- **Scalable font sizes**: Let the player increase UI text size by 25%, 50%, or 100%
- **Colorblind modes**: Deuteranopia (red-green), Protanopia, Tritanopia (blue-yellow). Use UE5's built-in colorblind simulation (Project Settings > Accessibility)
- **Screen reader support**: UE5 has experimental support for screen readers via the CommonUI plugin
- **Button size**: Interactive elements should be at least 44x44 pixels at 1080p (WCAG guideline for touch targets, also good for gamepad navigation)
- **Contrast**: Text should have a contrast ratio of at least 4.5:1 against its background. White text on a semi-transparent dark panel usually works.

---

## Summary

You have built (or have the blueprint for) every major UI element in Tabletop Quest:

| Widget | Purpose | Location on Screen |
|--------|---------|-------------------|
| `WBP_HealthBar` | Player HP with smooth lerp | Bottom-left |
| `WBP_ManaBar` | Player mana/stamina | Bottom-left (below HP) |
| `WBP_AbilityHotbar` | 6 ability slots with cooldowns | Bottom-center |
| `WBP_InventoryScreen` | Equipment + bag grid | Full screen (overlay) |
| `WBP_DialogueBox` | NPC conversations with typewriter text | Bottom 25% |
| `WBP_InitiativeTracker` | Turn order for turn-based combat | Top-center |
| `WBP_Minimap` | Top-down area map with markers | Top-right |
| `WBP_PauseMenu` | Pause, save, load, settings | Full screen (overlay) |
| `WBP_DamageNumber` | Floating combat numbers | World-to-screen projection |
| `WBP_EnemyHealthBar` | Enemy HP (world space) | Above enemy heads |
| `WBP_ItemTooltip` | Item details on hover | Following cursor |
| `WBP_LocationLabel` | Tabletop view area labels | World space on tabletop |

The key principles:
- **Anchor everything** for resolution independence
- **Event-driven updates** over frame-by-frame polling
- **Separate data from presentation** so the AI DM can use the same widgets as scripted content
- **Animate transitions** to make UI state changes feel polished
- **Use a HUD Manager** to coordinate which widgets are visible in each game state

In the next module, you will build the open world that all of this UI overlays.
