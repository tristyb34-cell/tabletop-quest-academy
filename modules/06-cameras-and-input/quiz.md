# Module 06: Quiz - The Camera and Controls

Test your understanding of camera systems and input handling. Try to answer each question before revealing the answer.

---

### Question 1
What is a Spring Arm component, and what problem does its collision system solve?

<details>
<summary>Answer</summary>

A Spring Arm is a component that maintains a set distance between a parent (usually the player character) and a camera. Think of it as an invisible selfie stick. The camera sits on the end of the stick, and the stick has built-in collision detection.

The collision system solves the camera-clipping-through-walls problem. Without it, when a character backs up against a wall, the camera would pass through the wall and show the inside of the geometry. With the Spring Arm's collision, the arm automatically shortens so the camera stays on the player's side of the wall. When the character moves away, the arm smoothly extends back to full length. The player never sees inside a wall.
</details>

---

### Question 2
What is the difference between an Input Action and an Input Mapping Context in UE5's Enhanced Input System?

<details>
<summary>Answer</summary>

An Input Action is an abstract gameplay verb like "Move," "Jump," or "Interact." It does not know or care which physical key triggers it. It only defines the type of value it produces (on/off, single axis, two axes).

An Input Mapping Context is the translation table that connects physical keys to Input Actions. It says "pressing W maps to the Move action in the positive Y direction" or "pressing Space maps to the Jump action." You can have multiple contexts (one for exploration, one for combat) and swap them at runtime so the same physical keys do different things depending on the game state.

In short: Input Actions define what the player can do. Mapping Contexts define which keys do it.
</details>

---

### Question 3
Why would you use multiple Input Mapping Contexts in a game like Tabletop Quest, instead of one context that handles everything?

<details>
<summary>Answer</summary>

Different game states need different controls. During exploration, WASD moves the character and the mouse rotates the camera. During turn-based combat, WASD pans the tactical camera and the mouse clicks on abilities and targets. During a menu, arrow keys navigate options and Enter confirms.

By swapping Mapping Contexts, you cleanly enable and disable the right inputs for each situation. You do not need if-statements in your code checking "am I in combat?" every time a key is pressed. You just remove the exploration context and add the combat context. The system handles the rest. This keeps your code simple, prevents accidental inputs (you cannot jump during combat if jump is not in the combat context), and makes it easy to add new game modes later.
</details>

---

### Question 4
What does SetViewTargetWithBlend do, and what does the blend curve (like EaseInOut) control?

<details>
<summary>Answer</summary>

SetViewTargetWithBlend smoothly transitions the player's camera view from its current position to a new camera target over a specified duration. Instead of an instant cut, the camera glides from one viewpoint to another.

The blend curve controls the speed profile of that transition. EaseInOut starts slow, speeds up in the middle, and slows down at the end, like a car pulling away from a stop sign and then gently braking at the next one. This feels the most natural for gameplay transitions. Linear moves at a constant speed the whole time, which feels robotic. EaseIn starts slow and finishes fast (good for dramatic reveals). EaseOut starts fast and finishes slow (good for settling into a scene).
</details>

---

### Question 5
In the tabletop-to-3D transition, three things happen at the same time: the camera blends downward, the character scales up, and the materials shift from painted to realistic. Why is it important that all three use the same duration and timing?

<details>
<summary>Answer</summary>

If they are not synchronised, the player perceives three separate things happening instead of one cohesive moment. If the camera arrives before the character finishes growing, there is an awkward pause where you are looking at a half-sized character. If the materials shift instantly while the camera is still moving, it breaks the illusion.

When all three animations share the same duration and easing curve, the brain reads it as a single transformation. The miniature becomes real. That is the magical moment that defines Tabletop Quest. Synchronisation is what makes it feel intentional and polished rather than glitchy and disjointed.
</details>
