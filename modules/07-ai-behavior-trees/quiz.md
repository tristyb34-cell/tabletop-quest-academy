# Module 07: Quiz - Enemy AI

Test your understanding of AI systems in Unreal Engine. Try to answer each question before revealing the answer.

---

### Question 1

In a Behavior Tree, what is the difference between a Selector and a Sequence node?

<details>
<summary>Show Answer</summary>

A **Selector** tries its children left to right and stops at the **first one that succeeds** (like a logical OR: "try this, or this, or this"). A **Sequence** runs its children left to right and stops at the **first one that fails** (like a logical AND: "do this, then this, then this, but stop if anything goes wrong"). In Tabletop Quest's enemy AI, the top-level node is typically a Selector (try fleeing, or fighting, or investigating, or patrolling) while each behavior is a Sequence of steps.

</details>

---

### Question 2

Why should you set the Lose Sight Radius larger than the Sight Radius on an AI Perception Sight Config?

<details>
<summary>Show Answer</summary>

If both radii are the same, an enemy at the edge of its sight range will rapidly alternate between detecting and losing the target every frame. This causes flickering behavior where the AI constantly switches between combat and idle states. Setting Lose Sight Radius larger (e.g., Sight 1500, Lose Sight 2000) creates a buffer zone. The enemy must detect the player at 1500 units, but won't lose track until 2000 units. This prevents the oscillation and creates smoother, more believable AI.

</details>

---

### Question 3

In the Goblin Scout's behavior design, why does the Alert Allies branch have higher priority than the Melee Attack branch within the Combat Selector?

<details>
<summary>Show Answer</summary>

Because the Goblin should run to alert nearby allies **before** it starts fighting. If melee was higher priority, the Goblin would immediately start attacking and never alert anyone. By placing Alert Allies first (leftmost in the Selector), the tree tries it first. The decorator `HasAlertedAllies == false` ensures this only happens once. After alerting, the decorator fails on subsequent ticks, and the tree falls through to the Melee Attack branch. This creates the realistic behavior of a scout raising the alarm before joining the fight.

</details>

---

### Question 4

What is a Blackboard in UE5's AI system, and why is it needed?

<details>
<summary>Show Answer</summary>

A Blackboard is a **key-value data store** that acts as the AI's working memory. It holds information like the current target (Actor reference), last known enemy position (Vector), whether the AI is in combat (Bool), and health percentage (Float). It is needed because Behavior Tree nodes are stateless on their own. A Move To task does not know where to move unless it reads a destination from the Blackboard. A combat decorator does not know whether to activate unless it checks a Blackboard value. The Blackboard is the shared data layer that connects perception, tasks, decorators, and services.

</details>

---

### Question 5

You have a Skeleton Warrior with a territory radius of 2000 units. The player lures it to 2100 units from its home location. What happens, and why?

<details>
<summary>Show Answer</summary>

The **Return to Post** branch activates. The custom decorator `IsTargetOutOfTerritory` checks whether the target is more than 2000 units from the Skeleton's `HomeLocation`. At 2100 units, this condition is true. Since Return to Post is the highest-priority branch (leftmost in the top-level Selector), it overrides the Combat branch. The Skeleton clears its `TargetActor`, sets `IsInCombat = false`, and uses Move To to walk back to its guard post. If the player follows it back into territory range, the Skeleton will re-detect the player through AI Perception and re-enter combat.

</details>

---

### Question 6

In the Dragon Boss fight, why are phase transitions handled in the Pawn Blueprint rather than in the Behavior Tree?

<details>
<summary>Show Answer</summary>

Phase transitions are triggered by **damage events** (HP crossing thresholds), which happen on the Pawn, not in the Behavior Tree. The Pawn's damage handler is the natural place to check HP thresholds and update the `CurrentPhase` Blackboard key. The Behavior Tree then reads `CurrentPhase` through decorators and automatically switches to the correct branch. This separation keeps the tree clean: it only cares about "what phase am I in?" not "should I change phases?" If you put phase transition logic in the tree, you would need to check HP thresholds in every branch, which duplicates logic and creates bugs.

</details>

---

### Question 7

What is the Environment Query System (EQS), and when would you use it instead of a simple "Move To target" task?

<details>
<summary>Show Answer</summary>

EQS is a system that **evaluates positions in the world** based on configurable criteria (distance, line of sight, pathfinding, dot products). You use it when the AI needs to find an **optimal position** rather than just moving directly to a target. Examples: a Goblin finding a flee point that is far from the player AND reachable AND behind cover; a Dragon finding a position at the right distance for a breath attack with clear line of sight; an Archer finding a spot with line of sight to the target but behind cover from other enemies. "Move To target" moves the AI directly to an actor. EQS finds the **best place to be** based on multiple weighted criteria.

</details>

---

### Question 8

A group of 5 Goblins are all chasing the player, but they stack on top of each other and clip through each other. What system should you enable, and how do you configure it?

<details>
<summary>Show Answer</summary>

Enable **RVO (Reciprocal Velocity Obstacles) Avoidance** on each enemy's Character Movement Component. Set `Use RVO Avoidance = true`. Configure the `Avoidance Weight` (0.5 for standard enemies). Set `Avoidance Group` so all Goblins are in the same group, and set `Groups to Avoid` to include their own group. This makes each Goblin aware of the others and adjust their path to avoid overlapping. You should also vary the `acceptable radius` on Move To tasks so not all Goblins are trying to reach the exact same point. One could aim for 100 units from the player, another for 150, creating a natural semi-circle formation.

</details>

---

### Question 9

What is a BT Service, and how does it differ from a BT Task?

<details>
<summary>Show Answer</summary>

A **BT Service** is a background node that **ticks at a regular interval** while its parent branch is active. It does not block execution; it runs alongside other tasks. A **BT Task** is a leaf node that **executes once** and returns Success or Failure when complete, blocking the tree at that point until it finishes. Services are used for continuous monitoring (checking health every 0.5 seconds, updating target selection, recalculating distance). Tasks are used for discrete actions (move to a point, play an animation, apply damage). In Tabletop Quest, a `BTService_CheckHealth` monitors HP continuously, while `BTTask_MeleeAttack` executes a single attack and completes.

</details>

---

### Question 10

You want to add a new enemy to Tabletop Quest: a Cave Spider that hides on the ceiling and drops onto players who walk beneath it. Describe the Behavior Tree structure you would create, including at least 3 branches.

<details>
<summary>Show Answer</summary>

A strong design would include:

1. **Flee Branch** (highest priority): Decorator `HealthPercent < 0.15`. The spider skitters away and tries to climb back to the ceiling.

2. **Ambush Branch**: Decorator `IsInCombat == false` AND `TargetActor IS SET` AND custom decorator `Is Target Below Me`. The spider drops from the ceiling onto the player, dealing fall damage and applying a "webbed" debuff (slow movement for 3 seconds). Sets `IsInCombat = true` and `HasAmbushed = true`.

3. **Combat Branch**: Decorator `IsInCombat == true`. Sub-branches:
   - **Web Spit** (ranged): Decorator Cooldown 6s, target distance > 400. Spits web projectile that slows the target.
   - **Melee Bite**: Move To target, bite attack with poison DOT.

4. **Hide Branch** (lowest priority): Decorator `IsInCombat == false`. The spider moves to a ceiling point (using EQS to find overhead positions near patrol routes) and waits. Uses a custom Perception setup: the spider detects targets below it using a downward-facing sight cone or a proximity trigger.

The key innovation is the ambush mechanic, which requires a custom perception setup (looking down rather than forward) and a unique attack that only triggers once (before combat starts).

</details>
