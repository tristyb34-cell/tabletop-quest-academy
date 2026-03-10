# Module 07: Quiz - Enemy AI

Test your understanding of AI systems in Unreal Engine. Try to answer each question before revealing the answer.

---

### Question 1
What is the difference between a Selector node and a Sequence node in a Behaviour Tree?

<details>
<summary>Answer</summary>

A Selector is an "or" node. It tries each child from left to right and succeeds as soon as any one child succeeds. It only fails if every child fails. Think of it as asking "can I do any of these things?"

A Sequence is an "and" node. It runs each child from left to right and requires all of them to succeed. If any child fails, the whole sequence stops and reports failure. Think of it as a checklist where every item must be ticked.

In practice, the root of most Behaviour Trees is a Selector (try fleeing, or attacking, or investigating, or patrolling). Each branch under it is usually a Sequence (to flee: check HP is low AND find escape point AND move to escape point).
</details>

---

### Question 2
What is a Blackboard, and why does the AI need one?

<details>
<summary>Answer</summary>

A Blackboard is a simple key-value data store attached to an AI character. It acts as the enemy's memory, holding things like the target actor, last known player position, current patrol point, and health value.

The AI needs a Blackboard because the Behaviour Tree itself has no memory. Each time it runs through its branches, it needs somewhere to look up information: "Do I have a target?" checks a Blackboard key. "Where was the player last seen?" reads a vector from the Blackboard. Without this shared data store, the perception system would have no way to communicate with the Behaviour Tree, and tasks within the tree would have no way to pass information to each other.
</details>

---

### Question 3
What is a Navigation Mesh, and what happens if an area of your level is not covered by one?

<details>
<summary>Answer</summary>

A Navigation Mesh (NavMesh) is an invisible surface generated over the walkable areas of your level. It tells the AI pathfinding system which surfaces are safe to walk on and how to calculate routes between two points.

If an area is not covered by a NavMesh, AI characters simply cannot pathfind to or through that area. A "Move To" task targeting a location outside the NavMesh will fail. This is why you need a NavMesh Bounds Volume large enough to cover your entire playable space. You can visualise the NavMesh by pressing P in the viewport; green areas are walkable, and gaps mean the AI has no path there.
</details>

---

### Question 4
How does the AI Perception system's sight sense work? What determines whether an enemy "sees" the player?

<details>
<summary>Answer</summary>

The sight sense projects an invisible cone of vision in front of the AI character, defined by an angle (how wide the cone is) and a range (how far it extends). For the enemy to "see" the player, three conditions must be met:

1. The player must be within the cone's angle (inside the field of view).
2. The player must be within the cone's range (close enough).
3. There must be a clear line of sight between the enemy and the player (no walls or obstacles blocking the view).

When all three conditions are met, the perception system fires an event to the AI Controller, which typically writes the detected actor and its position to the Blackboard. The Behaviour Tree then picks up this information and reacts on its next evaluation.
</details>

---

### Question 5
In the combat AI scoring system, why is it better to use weighted scores than a simple if/else chain?

<details>
<summary>Answer</summary>

A scoring system handles overlapping conditions gracefully. With if/else, you get rigid priority: "if HP is low, always heal; else if target is near, always attack." This means a low-HP goblin heals even when it would be smarter to attack a nearly-dead player and win the fight.

With scores, multiple factors contribute to each decision simultaneously. Attack might score 70 (target is weak and in range) while Heal scores 60 (HP is low but not critical). The goblin attacks, which is the smarter play. The scores let you tune nuanced behaviour by adjusting weights, and adding new options (special abilities, positioning, buffing allies) only requires adding new score calculations rather than restructuring a chain of conditionals.

It also makes the AI feel less predictable. Small changes in the situation lead to different decisions, which makes enemies feel more alive and less robotic.
</details>
