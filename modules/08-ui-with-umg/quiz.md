# Module 08: Quiz - User Interface

Test your understanding of UMG and UI design in Unreal Engine. Try to answer each question before revealing the answer.

---

### Question 1
What is a Widget Blueprint, and how does it differ from a regular Blueprint?

<details>
<summary>Answer</summary>

A Widget Blueprint is a specialised Blueprint designed for creating 2D user interface elements. It has a visual designer where you drag and drop UI components (text, images, buttons, progress bars, panels) and arrange them on a canvas. It also has a Graph tab for Blueprint logic, just like regular Blueprints.

The key difference is that a Widget Blueprint represents a piece of UI that gets drawn on top of the 3D game world, not an actor that exists within it. You create an instance of a Widget Blueprint and add it to the player's viewport (screen). Regular Blueprints represent actors or objects in the 3D world. A Widget Blueprint handles things like button clicks, text display, and layout, while a regular Blueprint handles things like movement, collision, and gameplay logic.
</details>

---

### Question 2
What are anchors in UMG, and why are they important?

<details>
<summary>Answer</summary>

Anchors define where a widget is positioned relative to its parent container. An anchor of (0, 0) means the widget is positioned relative to the top-left corner. An anchor of (1, 1) means it is relative to the bottom-right. An anchor of (0.5, 0.5) means it is centred.

Anchors are important because they make your UI work across different screen resolutions and aspect ratios. If you anchor an HP bar to the bottom-left, it stays in the bottom-left whether the player is on a 1920x1080 monitor or a 2560x1440 ultrawide. Without proper anchoring, moving to a different resolution can push UI elements off-screen or stack them on top of each other. Anchoring is the foundation of responsive UI layout.
</details>

---

### Question 3
What is the difference between property binding and event-driven updates for connecting UI to game data?

<details>
<summary>Answer</summary>

Property binding evaluates a function every single frame to get the current value. You bind a progress bar's "Percent" property to a function that returns CurrentHP / MaxHP, and UMG calls that function every frame to update the display. This is simple to set up but can be inefficient when you have many bindings, because the work happens every frame regardless of whether the value changed.

Event-driven updates only fire when the data actually changes. The game system dispatches an event (like "OnHPChanged") when HP is modified, and the UI widget listens for that event and updates itself only at that moment. This is more efficient because work only happens when needed, and it also allows you to trigger animations (like a smooth bar transition) at the exact moment of change rather than constantly checking.

For a few simple bindings, either approach works. For a complex RPG UI with dozens of values, event-driven updates are the better choice.
</details>

---

### Question 4
Why would you build the inventory slot as its own separate Widget Blueprint instead of just placing all the elements directly in the inventory grid?

<details>
<summary>Answer</summary>

Creating the inventory slot as a separate Widget Blueprint gives you reusability and maintainability. If you have 24 slots in the grid, you do not want to manually duplicate 24 copies of the same icon, button, and text layout. Instead, you create one InventorySlot widget and instantiate it 24 times.

If you later need to change the slot's appearance (add a rarity border, change the font size, add a durability indicator), you change it in one place and all 24 slots update. If the elements were placed directly in the grid, you would need to make the same change 24 times.

It also keeps the logic clean. Each slot widget handles its own click events, hover tooltips, and visual updates. The grid widget just manages the layout and passes item data to each slot. This separation of concerns makes the code easier to understand, test, and modify.
</details>

---

### Question 5
In the turn-order display, why is it better to highlight the active character with a visual change (size, border, colour) rather than just showing their name in text?

<details>
<summary>Answer</summary>

Visual changes communicate instantly. The player can glance at the turn order display and identify the active character in a fraction of a second based on the larger frame and golden highlight. Reading text requires more cognitive effort and takes longer, especially during a fast-paced combat encounter where attention is split between the turn order, the battlefield, and the ability bar.

Visual hierarchy, where the most important element is the most visually prominent, is a core principle of UI design. The active character is the most important piece of information in the turn order, so it should be the most visually distinct. Size difference, colour contrast, and animation (like a subtle pulse or glow) all contribute to making the active character immediately obvious without requiring the player to read anything. This reduces cognitive load and lets the player focus on tactical decisions instead of parsing the UI.
</details>
