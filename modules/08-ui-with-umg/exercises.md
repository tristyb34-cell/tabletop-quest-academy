# Module 08: Exercises - User Interface

## Exercise 1: Build HP and Mana Bars with Smooth Lerp

**Goal:** Create health and mana bars that update smoothly when values change.

**What you are building:** The core player status display for Tabletop Quest. The bars sit in the bottom-left corner and respond to actual game data with a smooth sliding animation instead of snapping.

**Steps:**

1. Create a Widget Blueprint `WBP_PlayerStatus` with a Canvas Panel root, anchored bottom-left
2. Add a Vertical Box containing two sections:
   - HP section: Image (character portrait, 64x64) + Overlay (background Image + Progress Bar + Text Block showing "HP / MaxHP")
   - Mana section: Same structure but blue fill color
3. Create variables on your Player Character: `CurrentHP` (Float, default 100), `MaxHP` (Float, default 100), `CurrentMana` (Float, default 60), `MaxMana` (Float, default 60)
4. Create Event Dispatchers on the Player Character: `OnHPChanged(NewHP, MaxHP)` and `OnManaChanged(NewMana, MaxMana)`
5. In the widget, bind to these dispatchers. On HP change:
   - Set `TargetHPPercent` to `NewHP / MaxHP`
   - Do NOT immediately update the Progress Bar
6. In the widget's Tick event, lerp `DisplayHPPercent` toward `TargetHPPercent` at rate `DeltaTime * 5.0`
7. Set the Progress Bar percent to `DisplayHPPercent` each tick
8. Add a damage flash: when `OnHPChanged` fires and HP decreased, briefly set the bar's color to bright red, then fade back to normal over 0.3 seconds
9. Create the widget in your Player Controller's BeginPlay and add it to the viewport
10. Create a test: press a key to apply 20 damage. Watch the bar slide down smoothly.

**Success criteria:** HP and Mana bars display correctly, update with a smooth sliding animation when values change, and flash red/blue on change. The text shows numeric values ("80 / 100").

---

## Exercise 2: Build the Ability Hotbar with Cooldowns

**Goal:** Create a 6-slot ability hotbar with working cooldown overlays.

**What you are building:** The combat interface for real-time mode. Each slot shows an ability icon, a key binding label, and a radial cooldown sweep when the ability is used.

**Steps:**

1. Create a widget `WBP_AbilitySlot` containing:
   - Size Box (64x64)
   - Overlay: Image (ability icon) + Image (cooldown overlay) + Text Block (key number, top-left) + Text Block (mana cost, bottom-right)
2. Create a UI Material `M_CooldownSweep`:
   - Material Domain: User Interface
   - Blend Mode: Translucent
   - Use an atan2-based radial sweep driven by a scalar parameter `CooldownPercent`
   - Output: semi-transparent dark overlay that fills clockwise from 0% to 100%
3. Create a widget `WBP_AbilityHotbar` with a Horizontal Box containing 6 `WBP_AbilitySlot` instances, anchored bottom-center
4. Create a struct `S_AbilityData`: AbilityName (Name), Icon (Texture2D), ManaCost (Int), CooldownDuration (Float)
5. On each slot, expose functions: `SetAbilityData(S_AbilityData)` and `StartCooldown(Duration)`
6. In `StartCooldown`, set `RemainingCooldown = Duration` and in Tick, decrement it. Update the material parameter to `RemainingCooldown / CooldownDuration`.
7. When cooldown reaches 0, hide the overlay and play a brief "ready" flash animation
8. Test: bind keys 1-6 to trigger abilities. Each press starts a cooldown on the corresponding slot.

**Success criteria:** Six ability slots display icons and key bindings. When an ability is used, a radial sweep darkens the slot and gradually clears as the cooldown expires. A flash indicates when the ability is ready again.

---

## Exercise 3: Build the Inventory Screen with Equipment Slots

**Goal:** Create a full inventory screen with 9 equipment slots and a bag grid.

**What you are building:** Tabletop Quest's inventory, where players manage their loot and equipment. This is a full-screen overlay that pauses the game when opened.

**Steps:**

1. Create a struct `S_ItemData`: ItemName (String), Icon (Texture2D), Slot (Enum: Weapon, Offhand, Armor, Helm, Boots, Ring, Amulet, Cloak, None), Rarity (Enum: Common, Uncommon, Rare, Epic, Legendary), StatBonuses (Map of String to Int), Description (String)
2. Create a Data Table `DT_Items` using the struct. Add 10-15 test items.
3. Create `WBP_InventorySlot`: Button + Image child + optional stack count Text Block. When empty, show a ghost outline.
4. Create `WBP_EquipmentPanel`: Arrange 9 slots in a paper-doll layout (Helm top, Weapon left, Armor center, etc.)
5. Create `WBP_BagGrid`: Uniform Grid Panel (8 columns) inside a Scroll Box, populated with 40 `WBP_InventorySlot` widgets
6. Create `WBP_InventoryScreen`: Full-screen overlay with dark background. Left side: equipment panel. Right side: bag grid. Center: character model or portrait.
7. Implement equip/unequip: clicking an item in the bag grid and then clicking the matching equipment slot equips it. Clicking an equipped item unequips it back to the bag.
8. Toggle the inventory with the I key: create widget + add to viewport + pause game + show cursor. Press I again to close.

**Success criteria:** The inventory screen opens and closes with I. Equipment slots show equipped items. Bag grid shows carried items. Items can be moved between bag and equipment slots.

---

## Exercise 4: Build Item Tooltips

**Goal:** Add hover tooltips that show item details and stat comparisons.

**What you are building:** The information layer that helps players make equipment decisions. Hover over any item to see its name, stats, rarity, and how it compares to what is currently equipped.

**Steps:**

1. Create `WBP_ItemTooltip`: Border (dark background, gold outline) with a Vertical Box:
   - Text Block: Item name (bold, color based on rarity)
   - Text Block: Item type/slot ("Heavy Armor", "One-Handed Sword")
   - Separator image (thin horizontal line)
   - Vertical Box: Stat lines, one per stat ("+3 Might", "+2 Finesse")
   - Separator
   - Text Block: Description (italic, wrapping enabled)
   - Optional: comparison section ("Currently Equipped: Iron Helm, +1 Might" in red/green showing the difference)
2. On `WBP_InventorySlot`, handle **On Mouse Enter**: Show tooltip at cursor position. Handle **On Mouse Leave**: Hide tooltip.
3. Position the tooltip near the cursor but ensure it never goes off-screen (clamp to viewport bounds)
4. For stat comparison: look up the currently equipped item in the same slot, compare each stat, and show the difference with green (better) or red (worse) text
5. Color-code item names: White = Common, Green = Uncommon, Blue = Rare, Purple = Epic, Orange = Legendary

**Success criteria:** Hovering over any item in the inventory shows a detailed tooltip. The tooltip shows stat comparisons with the currently equipped item. Rarity is visually indicated by name color.

---

## Exercise 5: Build the Dialogue System

**Goal:** Create a dialogue box with typewriter text, NPC portrait, and branching responses.

**What you are building:** The conversation interface for talking to NPCs in Tabletop Quest's taverns, shops, and quest givers.

**Steps:**

1. Create a struct `S_DialogueNode`: Speaker (String), Portrait (Texture2D), Text (String), Responses (Array of `S_DialogueResponse`), NextNodeID (Name)
2. Create a struct `S_DialogueResponse`: Text (String), NextNodeID (Name)
3. Create a Data Table `DT_TavernKeeperDialogue` with 5-6 dialogue nodes forming a branching conversation
4. Create `WBP_DialogueBox`:
   - Anchored to bottom, covering bottom 25% of screen
   - Border with parchment-style background
   - Horizontal Box: NPC portrait Image (128x128) + Vertical Box (NPC name Text Block + dialogue Rich Text Block + response buttons container)
5. Implement the typewriter effect:
   - Store full text and a character index
   - Timer every 0.03 seconds increments the index and updates the visible text
   - Pressing E/Space during typing skips to full text
   - Pressing E/Space when full text is shown advances to the next node
6. When a dialogue node has responses, create `WBP_DialogueOption` buttons dynamically. Each button shows the response text and navigates to the specified NextNodeID when clicked.
7. Create a test NPC in the level. When the player presses E near the NPC, start the dialogue.

**Success criteria:** Walking up to an NPC and pressing E opens the dialogue box. Text appears letter by letter. Response options appear as clickable buttons. Choosing a response advances the conversation.

**Bonus:** Add a subtle "pen scratch" or "typewriter click" sound for each character (you can add the actual sound in Module 10, but set up the event now).

---

## Exercise 6: Build the Initiative Tracker for Turn-Based Combat

**Goal:** Create a horizontal turn order bar that highlights the active combatant.

**What you are building:** The turn-based combat UI element that shows players the initiative order.

**Steps:**

1. Create `WBP_InitiativeSlot`: Portrait Image (48x48) + colored border (gold for active, white for ally, red for enemy) + tiny Progress Bar below (HP indicator)
2. Create `WBP_InitiativeTracker`: Horizontal Box anchored top-center, semi-transparent background
3. Create a mock combat scenario with 4 combatants: 2 player characters, 2 enemies. Store them in an array sorted by initiative.
4. Populate the tracker: for each combatant, create a slot widget, set the portrait and border color, add to the Horizontal Box
5. Implement turn highlighting:
   - The active combatant's slot scales to 1.2x and gets a gold border
   - Use a Widget Animation for a smooth scale-up effect
   - When a turn ends, animate the current slot back to normal and animate the next slot up
6. Handle combatant death: when an enemy dies, animate their slot fading out and remove it from the tracker, shifting remaining slots to fill the gap
7. Test by cycling through turns with a button press. Verify the highlight moves correctly and death removal works.

**Success criteria:** The initiative bar shows all combatants in order. The active combatant is visually highlighted. Advancing turns moves the highlight smoothly. Killing an enemy removes them from the bar with a fade animation.

---

## Exercise 7: Build a Minimap with Player Marker

**Goal:** Create a minimap in the top-right corner showing the player's position and nearby points of interest.

**What you are building:** The exploration minimap for Tabletop Quest's overworld and dungeon areas.

**Steps:**

1. Create `WBP_Minimap` anchored to the top-right corner
2. For the prototype, use a **Scene Capture 2D** approach:
   - Attach a Scene Capture Component 2D to the player character, pointing straight down
   - Set the capture resolution to 256x256 (low res is fine for a minimap)
   - Create a Render Target texture and assign it to the Scene Capture
   - Set Capture Every Frame to false, set Capture Rate to every 5 frames (performance optimization)
3. In the widget, display the Render Target as an Image inside a circular mask
4. Create the circular mask: a material with a radial gradient that outputs to Opacity. Black edges (transparent) and white center (opaque).
5. Add a player direction indicator: a small arrow Image in the center of the minimap that rotates with the player's yaw
6. Add a compass ring around the minimap edge showing N/S/E/W
7. Optional: Add enemy markers. For each enemy within 50 meters, calculate their screen position relative to the player and place a red dot on the minimap at the corresponding position.

**Success criteria:** The minimap shows a top-down view of the area around the player. The player's direction is indicated by a rotating arrow. The view updates as the player moves. Enemy dots appear for nearby enemies.

---

## Exercise 8: Build the Full HUD Manager

**Goal:** Create a HUD Manager that switches between Exploration, Combat, Dialogue, and Pause UI states.

**What you are building:** The system that coordinates all the widgets you have built, showing and hiding the right elements for each game state.

**Steps:**

1. Create an Actor Component `AC_HUDManager` and add it to your Player Controller
2. In the HUD Manager's BeginPlay, create all widgets:
   - `WBP_PlayerStatus` (HP/Mana)
   - `WBP_AbilityHotbar`
   - `WBP_InitiativeTracker`
   - `WBP_Minimap`
   - `WBP_DialogueBox`
   - `WBP_PauseMenu`
   - Add all to viewport but set visibility as needed
3. Create an Enum `E_UIState`: Exploration, TurnBasedCombat, RealTimeCombat, Dialogue, Paused, TabletopView
4. Create functions for each state:
   - `ShowExplorationUI()`: Show HP, Mana, Minimap. Hide Initiative, Hotbar, Dialogue.
   - `ShowTurnBasedCombatUI()`: Show HP, Mana, Initiative. Hide Minimap, Hotbar.
   - `ShowRealTimeCombatUI()`: Show HP, Mana, Hotbar. Hide Initiative, Minimap.
   - `ShowDialogueUI()`: Show Dialogue, HP, Mana. Hide everything else.
   - `ShowPauseUI()`: Show Pause Menu above everything, pause game.
5. Add smooth transitions: when hiding a widget, play a fade-out animation (0.3 seconds). When showing, play a fade-in.
6. Bind game events to state changes:
   - Combat starts > ShowTurnBasedCombatUI or ShowRealTimeCombatUI
   - Combat ends > ShowExplorationUI
   - NPC interaction > ShowDialogueUI
   - Escape key > ShowPauseUI
7. Test by triggering different game states and verifying the correct widgets appear and disappear smoothly.

**Success criteria:** The HUD seamlessly transitions between exploration, combat, dialogue, and pause states. Widgets fade in and out smoothly. No overlapping or conflicting UI elements appear in any state.
