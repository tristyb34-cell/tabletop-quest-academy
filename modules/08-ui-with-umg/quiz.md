# Module 8: Quiz - UI with UMG

Test your understanding of Unreal Motion Graphics and UI design. Choose the best answer for each question.

---

**Question 1: What is a Widget Blueprint in UMG?**

A) A 3D mesh used for rendering text in the game world
B) A special Blueprint type for defining interactive UI elements, similar to a Photoshop document where each layer responds to game data
C) A shader that controls how UI elements are rendered on the GPU
D) A configuration file that stores UI layout settings as JSON

<details>
<summary>Answer</summary>
B) A Widget Blueprint is a visual Blueprint for UI elements. You build your interface by layering and arranging widgets in the Designer tab and writing interaction logic in the Graph tab. Each widget can bind to and respond to game data.
</details>

---

**Question 2: Why are anchors important for UI layout?**

A) They prevent widgets from being clickable
B) They control the animation speed of widgets
C) They determine how a widget stays positioned relative to the screen when the resolution changes, preventing broken layouts at different resolutions
D) They connect widgets to gameplay variables

<details>
<summary>Answer</summary>
C) Anchors pin widgets to specific parts of the screen (top-left, center, bottom, stretch, etc.). Without proper anchoring, widgets that look perfect at 1080p will be misplaced or cut off at 4K or ultrawide resolutions. Always set anchors for every widget.
</details>

---

**Question 3: What is the difference between a Canvas Panel and a Vertical Box?**

A) Canvas Panel arranges children automatically; Vertical Box requires manual positioning
B) Canvas Panel allows free absolute positioning of children; Vertical Box automatically stacks children top to bottom
C) Canvas Panel only works in 3D space; Vertical Box only works in 2D
D) There is no difference; they are aliases for the same widget

<details>
<summary>Answer</summary>
B) Canvas Panel lets you place children at exact pixel coordinates with anchor-based positioning. Vertical Box stacks children automatically from top to bottom, handling spacing and alignment for you. Canvas Panel gives more freedom; Vertical/Horizontal Boxes give more consistency.
</details>

---

**Question 4: What is the recommended approach for updating UI widgets when game data changes?**

A) Bind every widget property to a function that runs every frame
B) Use event-driven updates where gameplay dispatchers notify the UI only when data actually changes
C) Rebuild the entire UI from scratch every frame
D) Store all game data inside the widgets themselves

<details>
<summary>Answer</summary>
B) Event-driven updates are more efficient than per-frame bindings. The gameplay system fires a dispatcher (e.g., OnHealthChanged) and the widget updates only at that moment. Per-frame bindings work for simple cases but create unnecessary overhead when you have many widgets.
</details>

---

**Question 5: What is a Widget Component used for?**

A) Adding extra functionality to an existing Widget Blueprint
B) Displaying a Widget Blueprint as a 3D element in the game world, such as floating health bars above characters
C) Compressing widget assets for faster loading
D) Converting widget layouts to C++ code for performance

<details>
<summary>Answer</summary>
B) A Widget Component renders a Widget Blueprint in 3D space. Set to "Screen" space, it always faces the camera (like a billboard), which is perfect for floating health bars, name plates, and damage numbers above characters.
</details>

---

**Question 6: What are the three input modes in UE5, and when would you use "UI Only"?**

A) Mouse Mode, Keyboard Mode, Gamepad Mode; UI Only is for gamepad users
B) Game Only, UI Only, Game and UI; UI Only is used when a full-screen menu is open and you want all input to go to the UI while blocking game input
C) Edit Mode, Play Mode, Simulate Mode; UI Only is for the editor
D) 2D Mode, 3D Mode, VR Mode; UI Only is for 2D games

<details>
<summary>Answer</summary>
B) Game Only sends all input to the game (movement, camera). UI Only sends all input to the UI and blocks game input, which is what you want for full-screen menus like inventory or character sheets. Game and UI sends input to both, useful for clickable HUD elements during gameplay.
</details>

---

**Question 7: You close a full-screen menu but the player cannot move their character. What is the most likely cause?**

A) The character's movement component was disabled
B) The input mode was not switched back to Game Only when the menu was closed
C) The Behavior Tree is blocking input
D) The widget animation is still playing

<details>
<summary>Answer</summary>
B) This is one of the most common UI bugs. When you open a menu, you switch to UI Only input mode. When closing it, you must call "Set Input Mode Game Only" to restore control. Forgetting this leaves the player stuck in UI mode with no game input.
</details>

---

**Question 8: How do you create a typewriter text effect in UMG?**

A) Use a special "Typewriter Text" widget that is built into UE5
B) Apply a material with a dissolve shader to a Text Block
C) Store the full text in a variable, then use a timer to add one character at a time to the displayed text until all characters are shown
D) Record the text as audio and play it back with synchronized subtitles

<details>
<summary>Answer</summary>
C) There is no built-in typewriter widget. You implement it by storing the complete text, setting up a repeating timer (e.g., every 0.03 seconds), and progressively displaying more characters. Allow the player to skip the animation by pressing a key to show all text immediately.
</details>

---

**Question 9: What is the difference between setting a widget's visibility to "Hidden" versus "Collapsed"?**

A) Hidden removes the widget from memory; Collapsed keeps it in memory
B) Hidden makes the widget invisible but it still occupies layout space; Collapsed makes it invisible AND removes it from the layout so it takes up no space
C) Hidden is for images; Collapsed is for text
D) There is no functional difference between them

<details>
<summary>Answer</summary>
B) "Hidden" hides the widget visually but it still affects layout, meaning other widgets position themselves as if it is still there. "Collapsed" hides the widget AND removes it from the layout calculation. Use Collapsed for conditional UI sections (like hiding a tab panel), and Hidden when you want to reserve the space.
</details>

---

**Question 10: You are designing the initiative tracker for a DnD combat system. It shows character portraits in turn order, with the active character highlighted. What UMG layout approach works best?**

A) A Canvas Panel with each portrait manually positioned at absolute coordinates
B) A Horizontal Box that dynamically generates portrait widgets from a sorted array, with the active portrait receiving a different style (larger scale, golden border, full opacity)
C) A single Image widget that swaps between pre-rendered screenshots of the initiative order
D) A 3D Widget Component placed in the game world above the combat area

<details>
<summary>Answer</summary>
B) A Horizontal Box automatically arranges portraits left to right. Generating them from a sorted array means the order always matches the initiative rolls. Styling the active portrait differently (scale, border, opacity) provides clear visual feedback. This approach handles any number of combatants and updates dynamically when combatants are added, removed, or killed.
</details>
