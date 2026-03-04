# Module 7: Quiz - AI and Behavior Trees

Test your understanding of UE5's AI systems. Choose the best answer for each question.

---

**Question 1: What is the role of an AI Controller in UE5?**

A) It renders the AI character's mesh and animations
B) It acts as the "brain" that possesses a Pawn and runs decision-making logic
C) It handles multiplayer networking for AI characters
D) It stores the AI's health and attribute data

<details>
<summary>Answer</summary>
B) The AI Controller possesses a Pawn and runs the Behavior Tree, managing all decision-making. Think of it as the puppeteer controlling the puppet.
</details>

---

**Question 2: In a Behavior Tree, what is the difference between a Selector and a Sequence?**

A) A Selector runs all children in parallel; a Sequence runs them one at a time
B) A Selector succeeds when ALL children succeed; a Sequence succeeds when ANY child succeeds
C) A Selector tries children left to right and stops at the first success; a Sequence runs children left to right and stops at the first failure
D) There is no difference; they are interchangeable

<details>
<summary>Answer</summary>
C) A Selector is like OR logic (try until one works). A Sequence is like AND logic (do all in order, stop if one fails). Selector stops at first success, Sequence stops at first failure.
</details>

---

**Question 3: What is the Blackboard in UE5's AI system?**

A) A visual debugging overlay for testing AI behavior
B) A shared data container where the AI stores and reads key-value pairs used for decision-making
C) A rendering surface for drawing AI debug information on screen
D) A special type of UI widget for AI configuration menus

<details>
<summary>Answer</summary>
B) The Blackboard is like a whiteboard where the AI writes notes. It stores data (target actor, health percentage, patrol location, etc.) that the Behavior Tree reads to make decisions.
</details>

---

**Question 4: What does the "Observer Aborts: Lower Priority" setting on a Decorator do?**

A) It prevents lower-priority nodes from ever running
B) It stops currently running lower-priority branches (to the right) when this decorator's condition becomes true
C) It forces the entire tree to restart from the root
D) It reduces the tick rate of lower-priority branches

<details>
<summary>Answer</summary>
B) When a higher-priority decorator's condition becomes true, it aborts any currently running lower-priority branch. This is how you make AI instantly react to new situations, for example, interrupting a patrol when an enemy is spotted.
</details>

---

**Question 5: What is the purpose of a Service node in a Behavior Tree?**

A) It handles networking and replication for AI data
B) It performs a one-time setup action when the tree starts
C) It runs at a regular interval while its parent composite is active, keeping data up to date
D) It connects the Behavior Tree to external APIs

<details>
<summary>Answer</summary>
C) Services are background updaters. They tick at a configurable interval (e.g., every 0.5 seconds) and update Blackboard values, keeping information fresh for decorators and tasks to use.
</details>

---

**Question 6: What does the Environment Query System (EQS) do?**

A) It queries a database of environment art assets
B) It generates and scores spatial test points in the world to help AI make location-based decisions
C) It manages weather and time-of-day systems
D) It optimizes environment rendering for performance

<details>
<summary>Answer</summary>
B) EQS generates a set of test points (grid, circle, etc.), scores each point based on criteria (distance, line of sight, pathfinding), and returns the best option. It answers questions like "Where is the best cover?" or "Where should I stand to cast this spell?"
</details>

---

**Question 7: How should an AI character activate a Gameplay Ability from GAS?**

A) Directly call the ability's Blueprint function from the Behavior Tree
B) Use Try Activate Ability on the AI Pawn's Ability System Component from a custom Behavior Tree task
C) Send a message to the Game Mode which activates the ability remotely
D) Abilities cannot be used by AI characters, only by player-controlled characters

<details>
<summary>Answer</summary>
B) AI characters should have their own Ability System Component with granted abilities. A custom BT task calls Try Activate Ability by Class or Tag, waits for the ability to finish, and returns success or failure. This keeps AI and player abilities flowing through the same system.
</details>

---

**Question 8: In a party member AI, what is the purpose of a formation system?**

A) It arranges party members in a visual grid for the player to select them
B) It defines offset positions relative to the player so party members follow in a natural-looking arrangement instead of stacking on top of each other
C) It creates combat formations that grant stat bonuses
D) It locks party members to fixed world positions

<details>
<summary>Answer</summary>
B) A formation system gives each party member an offset position relative to the player (behind-left, behind-right, etc.). This prevents them from bunching up and makes following look natural and intentional.
</details>

---

**Question 9: What is the AI Perception Component used for?**

A) Rendering visual effects around AI characters
B) Giving AI characters the ability to sense the world through sight, hearing, and damage detection
C) Managing the AI's emotional state and dialogue choices
D) Controlling the camera when the AI is selected

<details>
<summary>Answer</summary>
B) The AI Perception Component simulates senses. You configure sight (radius, angle, lose-sight distance), hearing (noise events), and damage detection. When something is perceived, it fires events that update the Blackboard, driving the Behavior Tree's decisions.
</details>

---

**Question 10: You have a party member AI with three behavior presets: Aggressive, Defensive, and Support. The player switches the preset from Aggressive to Support mid-combat. What happens in the Behavior Tree?**

A) Nothing changes until combat ends and a new Behavior Tree is loaded
B) The tree crashes because you cannot change Blackboard values during execution
C) On the next evaluation tick, the Selector checks the preset decorators, finds that "Support" now matches, and the AI switches to the Support branch
D) The AI immediately teleports to a support position

<details>
<summary>Answer</summary>
C) Behavior Trees are evaluated continuously. When the Blackboard value changes, the decorators detect the new value on the next tick. The Selector finds that the Aggressive decorator no longer matches and the Support decorator does, so it transitions to the Support branch. If Observer Aborts is configured, this switch happens immediately without waiting for the current task to finish.
</details>
