# Module 8: UI with UMG (Unreal Motion Graphics)

## Introduction

A game without a UI is like a car without a dashboard. You might have a powerful engine under the hood, but without a speedometer, fuel gauge, and warning lights, the driver has no idea what is happening. In a DnD-inspired RPG, the UI is even more important than usual: players need to see HP bars, mana pools, initiative order, ability cooldowns, inventory, character sheets, dialogue options, and combat overlays. This module teaches you how to build all of that using UE5's UMG system.

UMG (Unreal Motion Graphics) is UE5's built-in UI framework. It is a visual tool for creating widgets, which are the building blocks of any user interface. If you have used Photoshop, Figma, or any visual layout tool, UMG will feel familiar. You drag and drop elements, arrange them in panels, bind their properties to game data, and animate them.

---

## Widget Blueprints: The Foundation

### What Is a Widget Blueprint?

A Widget Blueprint is a special type of Blueprint that defines a piece of UI. Think of it like a Photoshop document where each layer is interactive and can respond to game data. A Widget Blueprint can be as simple as a single text label or as complex as a full inventory screen with scrollable grids, drag-and-drop items, and tooltip popups.

### Creating a Widget Blueprint

1. Right-click in the Content Browser: **User Interface > Widget Blueprint**
2. Name it (e.g., `WBP_MainHUD`, `WBP_InventoryScreen`, `WBP_DialogueBox`)
3. Double-click to open the **UMG Designer**

The UMG Designer has two main views:
- **Designer tab**: Visual layout editor where you drag, position, and arrange widgets
- **Graph tab**: Blueprint graph where you write logic (event handling, data updates, animations)

### The Widget Hierarchy

Every Widget Blueprint has a hierarchy (visible in the Hierarchy panel on the left). The root is usually a panel widget, and everything else is nested inside it. This works like HTML: you have containers that hold other containers that hold content.

---

## Common Widgets

UMG provides a library of pre-built widgets. Here are the ones you will use most:

### Text Block
Displays text. You can set the font, size, color, justification, and wrapping. Use it for labels, stat values, character names, and narration text.

### Image
Displays a texture or material. Use it for icons, portraits, backgrounds, borders, and decorative elements. You can tint it, set opacity, and use materials for animated effects.

### Progress Bar
A horizontal bar that fills based on a percentage (0.0 to 1.0). Perfect for HP bars, mana bars, XP bars, and cooldown indicators. You can customize the fill color, background color, and direction.

### Button
A clickable widget. It has built-in states: Normal, Hovered, Pressed, Disabled. Each state can have a different style. Buttons fire **On Clicked** and **On Hovered** events that you handle in the Graph tab.

### Scroll Box
A container that scrolls when its content exceeds the visible area. Essential for inventory lists, quest logs, spell lists, and any content that could be longer than the screen.

### Text Box (Editable Text)
An input field where the user can type text. Useful for chat, naming characters, or search/filter bars.

### Check Box
A toggleable checkbox. Good for settings (enable/disable sound, toggle grid overlay).

### Slider
A draggable slider for numeric ranges. Useful for volume controls, brightness settings, or any continuous value.

### Spacer
An invisible widget that creates gaps between other widgets. Sounds trivial but is essential for clean layouts.

### Border
A container that wraps a single child with a customizable background, border color, and padding.

---

## Layout and Anchoring

### The Canvas Panel

The Canvas Panel is the default root container. It lets you place widgets at absolute pixel positions, like placing stickers on a board. Each child has an **anchor** point that determines how it stays in place when the screen resizes.

**Anchors** are the most important layout concept in UMG. An anchor defines which part of the screen a widget is pinned to. Think of it like tacking a poster to a wall: you can tack it to the top-left corner, the center, or stretch it across the whole wall.

Common anchor presets:
- **Top-left**: Widget stays in the top-left corner (good for HP bars)
- **Top-center**: Widget stays centered at the top (good for boss names)
- **Top-right**: Widget stays in the top-right corner (good for minimap)
- **Bottom-center**: Widget stays centered at the bottom (good for ability bars)
- **Center**: Widget stays in the middle of the screen (good for crosshairs or dialogue)
- **Stretch**: Widget stretches to fill the available space (good for backgrounds)

Setting anchors correctly is critical. Without them, your UI breaks on different screen resolutions. A widget anchored to the top-left will always be in the top-left, whether the screen is 1080p or 4K.

### Vertical Box and Horizontal Box

These layout widgets automatically stack their children vertically or horizontally. Instead of manually positioning each element, you drop them into a box and they arrange themselves.

**Vertical Box**: Children stack top to bottom. Perfect for:
- Inventory lists
- Menu options
- Stat displays (Name, Class, Level, HP, Mana, etc.)

**Horizontal Box**: Children stack left to right. Perfect for:
- Ability bar (icons in a row)
- Initiative tracker (character portraits in a line)
- Stat pairs (label on the left, value on the right)

### Grid Panel

Arranges children in a grid layout. Specify the number of columns and the widgets fill in left-to-right, top-to-bottom. Great for inventory grids (4 columns of item slots) or spell books.

### Size Box

Wraps a child and forces it to a specific size. Useful when you want exact pixel dimensions for things like icon slots or portrait frames.

### Overlay

Stacks children on top of each other, all in the same position. Think of it as layers in Photoshop. Use it to put a health bar on top of a character portrait, or text on top of a background image.

### Wrap Box

Like a Horizontal Box, but when children exceed the width, they wrap to the next line. Useful for tag displays, buff/debuff icons, or any content with a variable number of items.

---

## Data Binding: Connecting UI to Game Data

### The Problem

Your HP bar needs to show the player's current health. But the widget does not inherently know anything about the player. You need to connect them.

### Property Binding

UMG supports binding widget properties directly to functions. In the Designer, next to any property (like a Text Block's "Text" field or a Progress Bar's "Percent" field), there is a "Bind" dropdown. Click it and select "Create Binding." This creates a function that runs every frame and returns the value to display.

Example: Binding an HP bar's Percent to the player's health:

```
Function: Get HP Percent
  Get Owning Player Pawn > Cast to BP_PlayerCharacter
  Get Current Health / Get Max Health
  Return (float between 0.0 and 1.0)
```

### The Performance Concern

Property bindings run every frame. For a few bindings this is fine, but if you have 50 widgets all bound to functions, the overhead adds up. For complex UIs, prefer an **event-driven** approach:

1. Define a **dispatcher** or **delegate** on the data source (e.g., an `OnHealthChanged` dispatcher on the character)
2. In the widget's **Event Construct** (runs once when the widget is created), bind to that dispatcher
3. When health changes, the dispatcher fires, and the widget updates only at that moment

This is much more efficient: the widget only updates when the data actually changes, not every single frame.

### Updating Widgets from Code

You can also update widgets manually from Blueprint or C++:

1. Mark widgets as **Variables** in the Designer (check the "Is Variable" checkbox in the Details panel)
2. In the Graph tab, access the widget by name and call its functions (Set Text, Set Percent, Set Visibility, etc.)
3. Call these from custom functions that you invoke when data changes

---

## HUD vs Full-Screen Menus

### HUD (Heads-Up Display)

The HUD is the always-visible overlay during gameplay. It shows real-time information without blocking the game view. For our DnD RPG, the HUD includes:

- **HP and Mana bars**: Top-left or bottom-left, showing current values
- **Initiative tracker**: Top of screen, showing turn order during combat
- **Active effects**: Small icons near the HP bar showing buffs, debuffs, and conditions
- **Minimap or tabletop overview**: Corner of the screen
- **DM narration text**: Bottom-center, a text box that shows narrative descriptions
- **Quick ability bar**: Bottom-center, showing available actions

To create a HUD:
1. Create a Widget Blueprint `WBP_MainHUD`
2. In your Player Controller, on **Event BeginPlay**, use **Create Widget** (class: `WBP_MainHUD`)
3. Call **Add to Viewport** on the created widget
4. Store a reference so you can update it later

### Full-Screen Menus

Full-screen menus pause or overlay the entire game view. They include:

- **Character sheet**: Stats, skills, equipment, biography
- **Inventory**: Grid of items with drag-and-drop
- **Spell/ability book**: List of learned abilities with descriptions
- **Pause menu**: Resume, Save, Load, Settings, Quit
- **Settings**: Audio, video, controls, accessibility

For full-screen menus, you typically:
1. Create the widget and add it to the viewport
2. Switch the **Input Mode** (more on this below)
3. Optionally show the mouse cursor
4. When closing, remove the widget and restore the input mode

---

## Widget Components: 3D UI in the World

### What Is a Widget Component?

A Widget Component lets you display a Widget Blueprint as a 3D element in the game world. Think of it as a TV screen floating in space that shows your UI. The most common use case is floating health bars above characters' heads.

### Setting Up a Widget Component

1. Open your character or NPC Blueprint
2. Add a **Widget Component** in the Components panel
3. Set the **Widget Class** to a Widget Blueprint (e.g., `WBP_FloatingHealthBar`)
4. Position the component above the character's head
5. Set **Draw Size** to control the widget's resolution (e.g., 200x50)
6. Set **Space** to "Screen" (always faces camera) or "World" (fixed orientation)

### Screen Space vs World Space

- **Screen Space**: The widget always faces the camera, like a billboard. This is what you want for health bars, name plates, and indicators. The player always sees the information head-on.
- **World Space**: The widget exists as a flat plane in 3D space. Use this for in-world screens, computer terminals, or signs that the player can walk around and view from different angles.

### For Our Game

Widget Components are essential for:
- **Floating health bars**: Above every character during combat
- **Damage numbers**: Pop up when damage is dealt (spawn, animate upward, fade out)
- **Status effect icons**: Show condition icons (poisoned, blessed, stunned) above characters
- **Grid tile indicators**: Show movement range, attack range, or area of effect highlights on the combat grid

---

## Input Modes

### The Three Modes

UE5 has three input modes that control how the player interacts with the game and UI:

**Game Only:**
- All input goes to the game (movement, camera, abilities)
- Mouse cursor is hidden
- Clicking does not interact with UI widgets
- Use this during normal gameplay and combat

**UI Only:**
- All input goes to the UI
- Mouse cursor is visible
- Game input is blocked (cannot move or look around)
- Use this for full-screen menus like inventory or character sheet

**Game and UI:**
- Input goes to both the game and the UI
- Mouse cursor can be visible or hidden
- Use this for HUD elements that need clicking (like ability bar buttons) while the game is still running

### Switching Input Modes

In your Player Controller:

```
-- To open a menu:
Set Input Mode UI Only (target: self, widget to focus: menu widget)
Set Show Mouse Cursor: true

-- To close a menu:
Set Input Mode Game Only (target: self)
Set Show Mouse Cursor: false

-- For clickable HUD:
Set Input Mode Game and UI (target: self)
```

A common bug is forgetting to restore the input mode when closing a menu. The player opens the inventory, closes it, and cannot move. Always pair "open" and "close" logic.

---

## Styling and Theming

### Font Management

Create a consistent look by using a small set of fonts:
- **Title font**: Large, decorative (something fantasy/medieval for our DnD game)
- **Body font**: Clean, readable at small sizes
- **Number font**: Monospaced or tabular so numbers do not jump around as values change

Import fonts as assets and reference them in your widgets. Create a **Data Table** or **Struct** that holds your font references, sizes, and colors for easy global changes.

### Color Palette

Define your color palette early:
- **Background**: Dark tones (parchment brown, deep blue, or dark grey)
- **Primary text**: Off-white or light parchment
- **Secondary text**: Muted gold or silver
- **HP bar**: Green to red gradient based on percentage
- **Mana bar**: Blue tones
- **Accent**: Gold for borders and highlights
- **Danger**: Red for warnings and low-health states

Store colors in a Blueprint Function Library or Data Table so you change them in one place and every widget updates.

### Material-Based Styling

For fancy effects, use Materials as brush styles:
- Parchment texture backgrounds
- Animated borders with glowing runes
- Gradient fills that shift color based on parameters
- Dissolve effects for widgets that appear/disappear

---

## Animation with UMG Sequences

### Widget Animations

UMG has a built-in animation system. In the Designer, at the bottom of the screen, you will find the **Animations** panel. You can create named animations that keyframe widget properties over time.

### Creating an Animation

1. In the Animations panel, click the **+ Animation** button
2. Name it (e.g., `FadeIn`, `SlideFromLeft`, `PulseHealth`)
3. Select a widget in the hierarchy
4. Move the timeline playhead to a point in time
5. Modify a property (position, opacity, color, scale)
6. UMG creates a keyframe automatically
7. Repeat for more keyframes

### Playable Properties

You can animate almost any widget property:
- **Render Transform**: Position, scale, rotation, shear
- **Render Opacity**: Fade in/out
- **Color and Opacity**: For Image and Text widgets
- **Layout Offsets**: Move widgets within their anchor space

### Playing Animations

In the Graph tab, call **Play Animation** with the animation name. Control playback:
- **Play Forward**: Normal playback
- **Play Reverse**: Play backward (great for close animations that reverse the open animation)
- **Set Num Loops**: Repeat the animation (0 = play once, -1 = loop forever)
- **Set Playback Speed**: Speed up or slow down

### For Our Game

Animations bring the UI to life:
- **HUD fade-in** when the game starts
- **Ability bar slide-up** when combat begins
- **HP bar pulse red** when health is critically low
- **Damage numbers float up and fade out**
- **Initiative portraits slide** when the turn order changes
- **Dialogue box typewriter effect** (animate text appearing character by character)
- **Menu transitions**: Slide, fade, or scale menus in and out

---

## Building Game-Specific UI: The DnD RPG Screens

### 1. Main HUD

The HUD is always visible during gameplay. Layout:

```
[Top-left]     Party HP/Mana bars (stacked vertically, one per member)
[Top-center]   Initiative tracker (horizontal row of portraits, active turn highlighted)
[Top-right]    Minimap or tabletop camera view
[Bottom-left]  Active character info (name, class, conditions)
[Bottom-center] Ability bar (5-6 action buttons + end turn)
[Bottom-right]  DM log (scrollable text of recent narration/actions)
```

Each section is its own child Widget Blueprint, composed into the main HUD widget. This keeps each piece modular and testable.

### 2. Character Sheet

A full-screen menu showing:
- Character portrait and name
- Ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) with modifiers
- Derived stats (AC, Initiative, Speed, HP, Saving Throws)
- Skills list with proficiency markers
- Equipment slots (head, chest, hands, legs, feet, two rings, amulet, weapon, offhand)
- Class features and racial traits

Use a Tab widget or button row at the top to switch between sub-pages (Stats, Skills, Equipment, Features).

### 3. Inventory Screen

A grid-based inventory:
- Fixed number of slots (e.g., 6 columns, 5 rows for 30 slots)
- Each slot shows an item icon, stack count, and rarity border color
- Hover for tooltip (item name, description, stats, weight, value)
- Click to select; right-click for context menu (Use, Equip, Drop, Inspect)
- Drag-and-drop between slots and to equipment slots on the character sheet

### 4. Dialogue UI

A bottom-of-screen dialogue box:
- NPC portrait on the left
- NPC name above the text
- Dialogue text with typewriter animation (characters appear one by one)
- 2-4 response options as buttons below the text
- Responses can show skill check requirements (e.g., "[Persuasion DC 15] Try to negotiate")
- After choosing, the text updates and new options appear

### 5. Combat Grid Overlay

During combat, a grid overlay appears on the 3D world:
- Tiles highlight in different colors:
  - Blue: Valid movement range
  - Red: Attack range
  - Yellow: Area of effect preview
  - Green: Allied positions
  - Grey: Blocked/impassable tiles
- Hovering a tile shows a tooltip with distance, cover status, and any terrain effect
- This overlay is a combination of decals/meshes in the world and UI elements on the HUD

### 6. Turn Order (Initiative) Bar

A horizontal bar at the top of the screen during combat:
- Each character is represented by a small portrait in a frame
- Arranged left to right in initiative order
- The active character's frame is enlarged and highlighted
- When a character's turn ends, their portrait slides left and the next one grows
- Dead characters are greyed out; removed from initiative characters disappear with an animation

---

## Communicating Between Widgets and Game Logic

### The Widget Interface Pattern

For clean communication between gameplay code and UI:

1. Create a **Blueprint Interface**: `BPI_UIUpdate`
2. Add functions like `UpdateHealth(CurrentHP, MaxHP)`, `UpdateMana(Current, Max)`, `SetTurnActive(bIsActive)`, `ShowDamageNumber(Amount, Position)`
3. Your HUD widget implements this interface
4. Gameplay code calls the interface functions on the HUD reference
5. The HUD updates its child widgets accordingly

This keeps your gameplay code from knowing the details of the UI layout. It just says "health changed" and the UI handles the rest.

### Event Dispatchers

For widgets communicating outward (telling the game something happened):

1. Widget defines an Event Dispatcher: `OnAbilityButtonClicked(AbilityIndex)`
2. The Player Controller binds to this dispatcher when it creates the HUD
3. When the player clicks an ability button, the widget fires the dispatcher
4. The Player Controller receives the event and activates the corresponding ability

### The Subsystem Approach

For complex UIs, create a **UI Manager** as a Game Instance Subsystem:
- Holds references to all active widgets
- Provides functions like `ShowInventory()`, `HideInventory()`, `ToggleCharacterSheet()`
- Manages the stack of open menus (so pressing Escape closes the topmost one)
- Handles input mode switching automatically when menus open/close

---

## Performance Tips

### Widget Invalidation

UMG has a built-in invalidation system. When a widget's property changes, it marks itself as "dirty" and re-renders. If you are updating widgets every frame (through bindings), every widget is dirty every frame. Prefer event-driven updates.

### Widget Pooling

If you have many similar widgets (like inventory slot icons or damage numbers), create a pool of pre-made widgets instead of creating and destroying them constantly. Hide unused widgets instead of removing them.

### Collapse vs Hidden

When hiding a widget:
- **Hidden**: The widget is invisible but still takes up space in the layout and still processes some logic
- **Collapsed**: The widget is invisible AND takes up no space. Use this for conditional UI sections.
- **Self Hit Test Invisible / Hit Test Invisible**: Widget is visible but does not block mouse input. Useful for overlay effects.

### Tick Management

Disable **Tick** on widgets that do not need per-frame updates. Most widgets only need to update when data changes, not every frame.

---

## Summary

UMG gives you everything you need to build a rich RPG interface:

| Widget | Use Case |
|--------|----------|
| Text Block | Labels, stat values, narration text |
| Image | Icons, portraits, backgrounds |
| Progress Bar | HP, mana, XP, cooldowns |
| Button | Actions, menu items, ability slots |
| Scroll Box | Inventory lists, quest logs, DM narration |
| Canvas Panel | Free-position layout (main HUD) |
| Vertical/Horizontal Box | Stacked layouts (menus, stat lists) |
| Widget Component | 3D in-world UI (floating health bars) |

Key principles:
- **Anchor everything** so it works at any resolution
- **Use event-driven updates** over per-frame bindings where possible
- **Keep widgets modular**: one Widget Blueprint per UI element, composed into larger screens
- **Animate transitions** to make the UI feel polished and alive
- **Switch input modes** correctly when opening and closing menus

In the next module, we will tackle level streaming and world partition, which controls how the game world loads around the player, and how the tabletop camera captures what is currently visible.
