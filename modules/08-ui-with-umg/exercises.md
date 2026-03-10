# Module 08: Exercises - User Interface

## Exercise 1: Create HP and Mana Bars That Respond to Actual Game Values

**Goal:** Build a HUD with health and mana bars that update in real time when the player takes damage or spends mana.

**What you will do:**

1. Ask Claude:
   > "Walk me through creating a HUD Widget Blueprint in UE5 for my RPG. I need an HP bar (green progress bar) and a Mana bar (blue progress bar), both anchored to the bottom-left of the screen. Each bar should have a text label showing the current/max value (like '75 / 100'). The HP bar should change colour: green above 50%, yellow between 25-50%, red below 25%."

2. Claude will walk you through creating the Widget Blueprint in the UMG editor, placing the progress bars, setting anchors, and styling them. Follow each step.

3. Now connect the bars to actual data. Ask Claude:
   > "My player character has CurrentHP, MaxHP, CurrentMana, and MaxMana float variables. Create an event-driven setup where the HUD updates whenever these values change. When the character takes damage, the HP bar should animate smoothly to the new value rather than jumping instantly."

4. Claude will create a Blueprint event dispatcher or interface pattern. The character fires "OnHPChanged" whenever HP changes, and the HUD widget listens for it and animates the bar using a Timeline or interpolation.

5. Test it. Create a debug key (like pressing H) that reduces the player's HP by 20. Press it and watch the bar smoothly shrink. Press it enough times to see the colour change from green to yellow to red.

6. Do the same for mana. Create a debug key (M) that spends 15 mana. Watch the blue bar shrink.

7. Add a nice touch: ask Claude to add a "ghost bar" effect where a lighter-coloured bar trails behind the main bar when taking damage, then fades to match. This is the visual trick used in fighting games and Souls-like games to show how much damage was just dealt.

**You know it is working when:**
- Both bars display correct current/max values
- The HP bar colour changes based on health percentage
- Bars animate smoothly instead of jumping to new values
- The ghost bar effect shows recent damage visually
- The UI stays in the correct position regardless of window size (anchoring works)

---

## Exercise 2: Build a Simple Inventory Grid with Clickable Slots

**Goal:** Create an inventory panel with a grid of item slots that the player can click to inspect items.

**What you will do:**

1. Ask Claude:
   > "Help me create an inventory system in UE5 UMG. I need: (a) An InventorySlot Widget Blueprint that shows an item icon (Image widget) inside a Button, with a stack count Text widget in the corner. (b) An InventoryGrid Widget Blueprint that uses a Uniform Grid Panel with 6 columns and creates 24 InventorySlot widgets to fill it. (c) A way to open/close the inventory with the Tab key."

2. Follow Claude's instructions to create both Widget Blueprints. The InventoryGrid widget instantiates 24 InventorySlot widgets and adds them to the grid panel.

3. Now populate the grid with test items. Ask Claude:
   > "Create a simple item data structure (struct) with fields for ItemName (Text), ItemIcon (Texture2D), Description (Text), StackCount (Integer), and Rarity (enum: Common, Uncommon, Rare, Epic, Legendary). Create 5 test items: a Health Potion, a Mana Potion, a Rusty Sword, a Leather Helmet, and a Spell Scroll. Populate the first 5 inventory slots with these items."

4. Claude will create the data structure and populate the slots. You should see item icons in the first 5 slots and empty slots for the remaining 19.

5. Add click interaction. Ask Claude:
   > "When the player clicks an inventory slot that has an item, display a tooltip panel next to the slot showing the item's name, description, rarity (colour-coded), and a 'Use' button. Clicking an empty slot does nothing."

6. Test: open the inventory with Tab, click on the Health Potion, and verify the tooltip appears with the correct information. Click on an empty slot and verify nothing happens. Press Tab again to close the inventory.

7. Stretch goal: ask Claude to add rarity colour borders to the item slots (grey for Common, green for Uncommon, blue for Rare, purple for Epic, orange for Legendary).

**You know it is working when:**
- Tab opens and closes the inventory
- 24 slots are visible in a 6-column grid
- Items display their icons in the correct slots
- Clicking an item shows a tooltip with name, description, and rarity
- Clicking an empty slot does nothing
- The inventory pauses or overlays the game properly

---

## Exercise 3: Create a Turn-Order Display for Combat Initiative

**Goal:** Build a UI element that shows the initiative order during turn-based combat.

**What you will do:**

1. Ask Claude:
   > "Create a turn-order display Widget Blueprint for my turn-based RPG. It should be a horizontal row of character portrait frames anchored to the top-centre of the screen. Each frame shows a small character portrait (Image), the character's name (Text), and an HP bar underneath. The currently active character's frame should be larger and highlighted with a golden border. Upcoming characters have normal-sized frames. Characters who have already acted this round should be slightly faded."

2. Follow Claude's instructions to create the TurnOrderDisplay widget and a TurnOrderSlot widget (the individual portrait frame).

3. Now connect it to combat data. Ask Claude:
   > "I have an array of combat participants, each with a Name, Portrait texture, CurrentHP, MaxHP, and a boolean for IsPlayerControlled. Create a function called 'UpdateTurnOrder' that takes this array (sorted by initiative) and the index of the current actor. It should populate the turn order display: highlight the current actor's slot, show upcoming actors normally, and fade actors who already went."

4. Test with placeholder data. Create 5 combat participants: 3 player characters and 2 goblins. Call UpdateTurnOrder with different current actor indices and watch the display shift.

5. Add animation. Ask Claude:
   > "When the turn advances to the next character, animate the transition: the current character's frame should shrink back to normal size while the next character's frame grows and gets the golden highlight. Use a smooth animation over 0.3 seconds."

6. Add a combat-start animation: ask Claude to make the turn order display slide in from the top of the screen when combat begins, and slide out when combat ends.

**You know it is working when:**
- The turn order shows all combat participants in initiative order
- The current actor is clearly highlighted and larger than the others
- Actors who already went are visually faded
- Turn transitions animate smoothly
- Player characters and enemies are visually distinguishable (different border colours or icons)
- The display appears when combat starts and disappears when combat ends
