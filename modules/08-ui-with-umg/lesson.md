# Module 08: User Interface

## Everything on Screen Besides the 3D World

A game without a UI is like a car without a dashboard. The engine might be powerful, but without a speedometer, fuel gauge, and warning lights, the driver has no idea what is happening. In a DnD-inspired RPG, the UI carries even more weight than usual. Players need to see HP bars, mana pools, action points, initiative order, inventory grids, character stats, equipment slots, dialogue options, and combat overlays. That is a lot of information, and your job is to present it clearly without covering the beautiful 3D world underneath.

Think of the UI as two layers. The **HUD** (Heads-Up Display) is the always-visible information overlaid on gameplay: health bars, minimap, turn indicator. The **menus** are full-screen or overlay panels the player opens deliberately: inventory, character sheet, pause menu, settings. Both are built with the same system in Unreal, but they serve different purposes and follow different design rules.

---

## UMG: Unreal Motion Graphics

Unreal's UI system is called **UMG** (Unreal Motion Graphics). The building block is the **Widget Blueprint**. Think of a Widget Blueprint as a Photoshop document for your UI: you drag in text, images, buttons, progress bars, and other elements, arrange them visually, and then wire up logic with Blueprint nodes.

Each Widget Blueprint creates a reusable UI piece. You might have:
- A "HealthBar" widget (a progress bar that fills based on HP)
- An "InventorySlot" widget (a single clickable square that shows an item icon)
- An "InventoryGrid" widget (a grid of InventorySlot widgets)
- A "HUD" widget (the master widget that contains HealthBar, MiniMap, TurnIndicator, and anything else always on screen)

The HUD widget gets added to the player's screen when the game starts. Menu widgets get added when opened and removed when closed.

---

## Building the HUD

The Tabletop Quest HUD needs these elements:

### HP Bar
A progress bar that shows the player character's current health. When the character takes damage, the bar shrinks. When healed, it grows. The bar should be colour-coded: green when healthy, yellow when below 50%, red when below 25%.

Think of it like the health bar in any RPG. It is the single most important piece of UI in the game. The player glances at it constantly.

### Mana Bar
Same concept as the HP bar, but for magical energy. Casting spells costs mana, and the bar shows how much is left. Colour it blue.

### Action Points
In turn-based combat, each character gets a set number of action points per turn. Display these as pips (small circles or diamonds) rather than a bar. When the player spends an action point, one pip goes dark. This is more intuitive than a number because the player can see at a glance how many actions they have left.

### Turn Indicator
During combat, the player needs to know whose turn it is and who goes next. This is the initiative order display, a row of character portraits along the top or side of the screen, ordered by initiative. The current character's portrait is highlighted or enlarged. Think of it like the turn order bar in games like Divinity: Original Sin.

### Minimap
A small circular or square map in the corner showing the player's position, nearby enemies (red dots), allies (green dots), and points of interest. The minimap is a simplified top-down view of the area around the player.

---

## How Widget Blueprints Connect to Game Data

A progress bar sitting on screen is useless unless it reflects actual game values. The connection works through **bindings**. You tell the progress bar "your fill percentage equals the character's CurrentHP divided by MaxHP." Every frame, UMG reads that value and updates the bar.

There are two ways to do this:

**Property Binding**: In the Widget Blueprint editor, you click the "Bind" dropdown next to a property (like "Percent" on a progress bar) and create a binding function. This function runs every frame and returns the value. Simple, but can be inefficient if you have many bindings.

**Event-Driven Updates**: Instead of checking every frame, you listen for events. When the character takes damage, the health system fires an event ("HP Changed"). The HUD widget catches that event and updates the bar. This is more efficient and is the approach Claude will use for Tabletop Quest.

Claude will wire up the bindings for you. You tell it what data the widget needs to display, and it creates the Blueprint connections.

---

## Building the Inventory Screen

The inventory is a grid of slots where the player stores collected items. Think of it like a backpack with compartments. Each slot can hold one item, and the player can click on slots to equip, use, or drop items.

### The Inventory Slot Widget
Each slot is its own small Widget Blueprint containing:
- An **Image** widget showing the item's icon (or empty if the slot is vacant)
- A **Button** wrapper so it is clickable
- A **Text** widget for the item count (if the item is stackable, like potions)

### The Inventory Grid Widget
The grid is a **Uniform Grid Panel** (or **Wrap Box**) that holds multiple InventorySlot widgets. You set the number of columns (say, 6) and populate it with slot widgets. As the player picks up items, the slots fill in.

### Drag and Drop
UMG supports drag-and-drop natively. The player clicks and holds an item slot, drags it to another slot (or to the equipment panel), and releases. Claude will wire up the drag-and-drop Blueprint events:
- **On Mouse Button Down**: Start the drag, create a visual copy of the item icon that follows the mouse
- **On Drop**: Move the item data from the old slot to the new slot, update both slot visuals

### Item Tooltips
When the player hovers over an item, a tooltip appears showing the item's name, description, stats, and rarity. This is a separate Widget Blueprint that gets positioned near the mouse cursor and populated with the hovered item's data.

---

## Building the Character Sheet

The character sheet is the DnD equivalent of a stats page. It shows:
- **Stats**: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma (the classic six)
- **Equipment slots**: Head, chest, legs, feet, main hand, off hand, two ring slots, amulet
- **Level and XP**: Current level, experience bar showing progress to next level
- **Abilities**: A list of learned abilities with icons and descriptions

Think of it as the paper character sheet you fill out in DnD, but interactive. The player can click on an equipment slot to swap gear, hover over a stat to see what it affects, and track their progression.

The equipment slots work similarly to inventory slots, but each one is restricted to a specific item type (you cannot equip a sword in the helmet slot). Claude will build the validation logic so the UI only accepts correct item types.

---

## Menus: Main Menu, Pause, and Settings

### Main Menu
The first thing the player sees when they launch the game. It has buttons for New Game, Continue, Settings, and Quit. The background could be an animated scene of the tabletop with miniatures, setting the mood before gameplay even starts.

### Pause Menu
Opened with Escape during gameplay. It overlays on top of the game world (which pauses in the background). Options: Resume, Settings, Save, Load, Quit to Main Menu.

### Settings Menu
Sliders and dropdowns for audio volume, graphics quality, resolution, and control rebinding. Each setting reads from and writes to a save file so preferences persist between sessions.

For all menus, Claude will create the Widget Blueprints with proper button styling, navigation (keyboard/gamepad support), and transition animations (fade in/out).

---

## Layout Tips for RPG UIs

A few design principles that will save you rework:

**Anchor everything.** UMG uses anchors to position widgets relative to the screen. An HP bar anchored to the bottom-left stays in the bottom-left regardless of screen resolution. Without anchors, your UI breaks on different monitor sizes.

**Use opacity wisely.** The HUD should be semi-transparent so it does not block the game world. A 70-80% opacity background on health bars lets the player see through them while still reading the values.

**Group related information.** HP, mana, and action points should be near each other (usually bottom-left or bottom-centre). The minimap goes in a corner. The turn order goes along the top. Do not scatter related information across the screen.

**Respect the fantasy theme.** Your UI frames, fonts, and colours should match the DnD tabletop aesthetic. Think parchment textures, ornate borders, and warm tones. Claude can help you find free fantasy UI asset packs from the Unreal Marketplace.

---

## Python Automation for UI

While Widget Blueprints are mostly visual (you drag and arrange elements in the editor), Python can help with repetitive setup tasks. Claude can write scripts that:
- Create multiple Widget Blueprint assets with consistent naming
- Set up common properties (anchors, sizes, colours) across a batch of widgets
- Generate placeholder data for testing the inventory and character sheet

The bulk of UI work, however, is visual layout and Blueprint event wiring, which you will do in the editor with Claude guiding each step.

---

## What You Will Build This Module

By the end of this module, you will have:
- A HUD with HP bar, mana bar, and action point pips
- An inventory screen with a clickable grid of item slots
- Item tooltips on hover
- A turn-order display for combat initiative
- A pause menu with Resume, Settings, and Quit options
- The satisfying feeling of seeing game data reflected in real-time UI elements

The UI is where the game starts to feel like a real product. Before this module, you had a tech demo. After it, you have something that looks and feels like an RPG.
