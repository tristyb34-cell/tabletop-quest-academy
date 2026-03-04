# Module 8: Exercises - UI with UMG

## Exercise 1: HUD with HP and Mana Bars

**Objective:** Create a basic HUD that displays the player character's HP and Mana as progress bars with numeric labels.

**Steps:**

1. Create a Widget Blueprint: `WBP_HUD_HealthMana`. Set the root to a Canvas Panel.

2. In the top-left area (anchor: top-left), build the following layout using a Vertical Box:

   **HP Section:**
   - A Horizontal Box containing:
     - An Image widget (red heart icon or red square) as a visual indicator, size 24x24
     - A Text Block: "HP" (label)
     - A Spacer (width: 10)
     - A Text Block: "75 / 100" (bound to actual values)
   - Below the Horizontal Box, a Progress Bar:
     - Fill color: green when above 50%, yellow when 25-50%, red when below 25%
     - Height: 16 pixels, Width: 250 pixels

   **Mana Section (same structure):**
   - Blue indicator icon
   - Text Block: "MP"
   - Text Block: "40 / 60"
   - Progress Bar in blue tones

3. Create a character Blueprint `BP_PlayerChar` with two float variables: `CurrentHP`, `MaxHP`, `CurrentMana`, `MaxMana`. Add an Event Dispatcher: `OnHealthChanged` and `OnManaChanged`. Fire these dispatchers whenever the values change.

4. In the Widget Blueprint's **Event Construct**:
   - Get a reference to the player character
   - Bind to the `OnHealthChanged` dispatcher
   - When it fires, update the HP Progress Bar's Percent (CurrentHP / MaxHP) and the text label

5. For the color change, create a function `GetHealthColor` that returns:
   - Green (0.2, 0.8, 0.2) when above 50%
   - Yellow (0.9, 0.8, 0.1) when between 25% and 50%
   - Red (0.9, 0.1, 0.1) when below 25%
   Apply this as the Progress Bar's Fill Color.

6. In your Player Controller's **Event BeginPlay**, create the widget and add it to the viewport.

7. Test by creating a key binding (e.g., press H to lose 10 HP, press J to gain 10 HP). Verify the bar and text update reactively.

**Bonus Challenge:** Add an animation that pulses the HP bar when health drops below 25%. Create a UMG animation called `PulseLowHealth` that oscillates the bar's render opacity between 1.0 and 0.5, looping. Play it when health is critical; stop it when health recovers.

**What You Learn:** Widget creation, layout with Vertical and Horizontal Boxes, anchoring, event-driven updates, Progress Bar customization, and basic color logic.

---

## Exercise 2: Inventory Screen

**Objective:** Build a full-screen inventory grid with item slots, tooltips on hover, and the ability to select items.

**Steps:**

1. Create a data structure first. Make a **Struct** called `S_InventoryItem`:
   - `ItemName` (Name)
   - `Description` (Text)
   - `Icon` (Texture2D)
   - `StackCount` (Int)
   - `Rarity` (Enum: Common, Uncommon, Rare, Epic, Legendary)
   - `Weight` (Float)

2. Create a Widget Blueprint `WBP_InventorySlot` for a single inventory slot:
   - A Border widget as the root (this will show the rarity color as a border tint)
   - Inside: an Overlay containing:
     - An Image widget (the item icon), stretched to fill
     - A Text Block in the bottom-right corner (stack count, only visible if > 1)
   - Size: 64x64 pixels (use a Size Box as the outer wrapper)

3. Create a function in `WBP_InventorySlot` called `SetItem(S_InventoryItem)`:
   - Set the Image texture to the item's icon
   - Set the stack count text
   - Set the border tint based on rarity:
     - Common: grey
     - Uncommon: green
     - Rare: blue
     - Epic: purple
     - Legendary: gold
   - If the item is empty (no name), show a dark empty slot appearance

4. Create a Widget Blueprint `WBP_InventoryScreen`:
   - Full-screen overlay (anchor: stretch to fill)
   - Semi-transparent dark background
   - Centered panel (800x600) with a parchment-style background
   - Title: "Inventory" at the top
   - A **Uniform Grid Panel** with 6 columns
   - A Text Block at the bottom showing "Weight: 42.5 / 100.0"

5. In `WBP_InventoryScreen`'s **Event Construct**:
   - Loop through the player's inventory array (an array of `S_InventoryItem`)
   - For each item, create a `WBP_InventorySlot` widget and add it to the Grid Panel
   - Call `SetItem` on each slot

6. Add hover behavior to `WBP_InventorySlot`:
   - On **Mouse Enter**: Show a tooltip widget positioned near the cursor
   - The tooltip shows: Item Name, Description, Weight, Rarity
   - On **Mouse Leave**: Hide the tooltip

7. Add open/close functionality:
   - Press I to toggle the inventory
   - When opened: Create widget, add to viewport, set Input Mode to Game and UI, show cursor
   - When closed: Remove widget from viewport, set Input Mode to Game Only, hide cursor

8. Test with 10-15 pre-made test items in the player's inventory array.

**Bonus Challenge:** Add item selection. Clicking a slot highlights it with a golden border. Clicking a second slot swaps the two items. This is the first step toward drag-and-drop.

**What You Learn:** Struct-based data, child widget creation (WBP_InventorySlot as a reusable component), grid layouts, tooltips, input mode switching, and runtime widget generation.

---

## Exercise 3: Dialogue UI with Branching Choices

**Objective:** Create a dialogue box that displays NPC text with a typewriter effect and presents branching response options.

**Steps:**

1. Create a data structure `S_DialogueNode`:
   - `SpeakerName` (Text)
   - `DialogueText` (Text)
   - `Responses` (Array of `S_DialogueResponse`)
   - `SpeakerPortrait` (Texture2D)

   Create `S_DialogueResponse`:
   - `ResponseText` (Text)
   - `NextNodeID` (Int, -1 means end dialogue)
   - `RequiredSkill` (Name, empty if no check needed)
   - `SkillDC` (Int, difficulty class for the check)

2. Create `WBP_DialogueBox`:
   - Anchor to the bottom of the screen, full width, 250 pixels tall
   - Layout:
     - Left side: Image widget for speaker portrait (150x150)
     - Right side: Vertical Box containing:
       - Text Block: Speaker name (bold, larger font)
       - Text Block: Dialogue text (the main content)
       - Vertical Box: Response buttons (generated dynamically)
   - Background: Dark semi-transparent panel or parchment texture

3. Implement the typewriter effect:
   - Store the full dialogue text in a variable
   - Create a timer that fires every 0.03 seconds
   - Each tick, add one more character to the displayed text
   - When all characters are shown, stop the timer and show the response buttons
   - Allow the player to click or press Space to skip the animation and show all text immediately

4. Generate response buttons dynamically:
   - When the typewriter finishes, loop through the `Responses` array
   - For each response, create a Button with a Text Block inside
   - If the response has a `RequiredSkill`, prepend it to the text: "[Persuasion DC 15] Try to negotiate"
   - Bind each button's OnClicked event to a function that loads the next dialogue node

5. Create a simple Dialogue Manager (Blueprint or Actor Component):
   - Holds an array of `S_DialogueNode` (a simple dialogue tree)
   - Has a function `StartDialogue(StartNodeID)` that opens the dialogue UI
   - Has a function `AdvanceDialogue(NodeID)` that loads the next node
   - When `NextNodeID` is -1, close the dialogue

6. Test with a short conversation:
   - Node 0: "Welcome, adventurer. What brings you to this tavern?"
     - Response A: "I seek information about the dungeon." (goes to Node 1)
     - Response B: "[Charisma DC 12] I heard you have a special quest." (goes to Node 2)
     - Response C: "Just passing through." (goes to Node 3, which ends)
   - Node 1: "The dungeon is dangerous. You will need supplies."
     - Response: "Thank you." (ends)
   - Node 2: "You are perceptive. Yes, I have a task only the bravest could handle."
     - Response: "Tell me more." (goes to Node 4)
     - Response: "Perhaps another time." (ends)

7. Set up input: when the player presses E near an NPC, start the dialogue. Switch input mode to UI Only. When dialogue ends, restore Game Only.

**Bonus Challenge:** Implement the skill check. When the player selects a response with a RequiredSkill, roll a d20 + the player's skill modifier. If it meets or exceeds the DC, proceed to the success node. If it fails, show a "failed check" response and go to a failure node instead.

**What You Learn:** Dynamic widget generation, timer-based text animation, data-driven UI, branching logic, input mode management during dialogue, and the pattern for skill checks in UI.

---

## Exercise 4: Character Sheet

**Objective:** Build a tabbed character sheet showing stats, skills, and equipment.

**Steps:**

1. Create a Struct `S_CharacterStats`:
   - `CharacterName` (Text)
   - `ClassName` (Text: Fighter, Wizard, Rogue, Cleric, etc.)
   - `Level` (Int)
   - `AbilityScores` (Map of Name to Int: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma)
   - `CurrentHP`, `MaxHP`, `CurrentMana`, `MaxMana` (Int)
   - `ArmorClass` (Int)
   - `Speed` (Int)
   - `Portrait` (Texture2D)

2. Create `WBP_CharacterSheet`:
   - Full-screen panel, centered, 900x700
   - **Header section**: Portrait (left), Name + Class + Level (right), HP/Mana bars
   - **Tab buttons row**: Three buttons: "Attributes", "Skills", "Equipment"
   - **Content area**: A Widget Switcher (or manually toggled panels) that shows the selected tab's content

3. **Attributes Tab:**
   - Six rows, one per ability score
   - Each row: Ability Name | Score | Modifier (calculated as floor((score - 10) / 2))
   - Below the scores: Armor Class, Initiative (+Dex modifier), Speed
   - Use a Vertical Box with Horizontal Box rows for clean alignment

4. **Skills Tab:**
   - List of DnD skills (Acrobatics, Animal Handling, Arcana, Athletics, Deception, etc.)
   - Each row: Skill Name | Governing Ability | Modifier | Proficiency checkbox (filled or empty)
   - Use a Scroll Box since there are 18 skills
   - Proficient skills show a higher modifier (add proficiency bonus)

5. **Equipment Tab:**
   - Visual paper-doll layout: a silhouette with slot positions
   - Slots: Head, Chest, Hands, Legs, Feet, Ring 1, Ring 2, Amulet, Main Hand, Off Hand
   - Each slot is a `WBP_InventorySlot` (reuse from Exercise 2) positioned on the silhouette
   - Next to the paper doll: a list of equipped item details

6. Tab switching logic:
   - When "Attributes" button is clicked, show the Attributes panel, hide Skills and Equipment
   - Change the active tab button's style (brighter color or underline) to indicate which tab is selected

7. Populate the character sheet from a `S_CharacterStats` variable on the player character. Pass this data into the widget when it is created.

8. Open/close: Press C to toggle. Same input mode pattern as the inventory.

**Bonus Challenge:** Add a "Level Up" button that appears when the character has enough XP. Clicking it triggers a level-up flow: choose an ability score to increase by 1, or pick a new feat. This is stretch-goal UI work that exercises dynamic content generation.

**What You Learn:** Tab-based layouts, Widget Switcher or manual panel toggling, calculated derived values (ability modifiers), reusing widget components across screens, and complex layout composition.

---

## Exercise 5: Turn Order Initiative Bar

**Objective:** Create a horizontal initiative tracker that appears during combat, showing all combatants in turn order with the active character highlighted.

**Steps:**

1. Create `WBP_InitiativePortrait`:
   - A small widget representing one combatant
   - Size Box: 60x70
   - Layout (Vertical Box):
     - Image: Character portrait (48x48), with a colored border (green for allies, red for enemies)
     - Text Block: Character name (small font, truncated if too long)
   - Add a variable `bIsActive` (Bool) that controls highlighting

2. Create visual states for the portrait:
   - **Normal**: Standard size, slightly dimmed opacity (0.7)
   - **Active**: Full opacity (1.0), golden border, slightly larger scale (1.2x)
   - **Dead**: Greyed out, half opacity, strikethrough or skull icon overlay
   - **Status effects**: Small icons overlaid on the portrait corner (poisoned, blessed, etc.)

3. Create `WBP_InitiativeBar`:
   - Anchor: top-center, with some padding from the top edge
   - A Horizontal Box inside a Border (dark background panel)
   - Children are `WBP_InitiativePortrait` widgets generated at combat start

4. Create functions:
   - `InitializeBar(Array of CombatantData)`: Takes an array of structs containing name, portrait, team (ally/enemy), and initiative roll. Sorts by initiative (highest first). Creates portrait widgets and adds them to the Horizontal Box.
   - `SetActiveTurn(CombatantIndex)`: Sets the specified portrait to active state, resets all others to normal.
   - `MarkDead(CombatantIndex)`: Sets the portrait to the dead visual state.
   - `RemoveCombatant(CombatantIndex)`: Removes the portrait with a fade-out animation.

5. Create UMG animations:
   - `TurnTransition`: When the active turn changes, the old active portrait scales down and dims, the new active portrait scales up and brightens. Duration: 0.3 seconds.
   - `PortraitFadeOut`: For when a combatant is removed. Scale down to 0 and fade opacity to 0 over 0.5 seconds, then remove.
   - `NewRoundPulse`: A brief pulse effect on the entire bar when a new round begins (all portraits briefly glow).

6. Integration:
   - The Turn Manager (from Module 5 or wherever combat logic lives) holds a reference to the initiative bar
   - When combat starts, the Turn Manager calls `InitializeBar` with sorted combatant data
   - Each time a turn ends, the Turn Manager calls `SetActiveTurn` with the next combatant's index
   - When a combatant dies, call `MarkDead`
   - When combat ends, remove the bar from the viewport with a slide-up animation

7. Test with a mock combat scenario: 4 allies and 3 enemies. Simulate turns advancing by pressing N (next turn). Simulate a death by pressing K (kill the active combatant).

**Bonus Challenge:** Add a preview of upcoming actions. When hovering over a portrait in the initiative bar, show a small tooltip displaying: character name, HP, any queued action (if AI), and active status effects. This gives the player tactical information at a glance.

**What You Learn:** Dynamic widget generation based on game state, animated state transitions, integration between game systems (Turn Manager) and UI, sorted data display, and polished visual feedback that makes combat feel responsive.
