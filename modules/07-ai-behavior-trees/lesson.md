# Module 7: AI and Behavior Trees in UE5

## Introduction

Every great RPG needs enemies that think, allies that help, and NPCs that feel alive. In Unreal Engine 5, the AI system gives you the tools to build all of this. Think of it like writing a script for actors in a play: you define what they know, what they should do in different situations, and how they make decisions. The AI does not actually "think," but if you set up the decision-making well, it certainly looks like it does.

For our DnD tabletop-to-3D RPG, AI is critical. Party members need to follow the player, choose abilities in combat, and respond to different behavior presets like "aggressive" or "support." Enemies need to patrol, detect threats, pick targets, and retreat when wounded. This module covers every piece of that puzzle.

---

## AI Controllers: The Brain Behind the Pawn

### What Is an AI Controller?

In UE5, every character (Pawn) can have a Controller attached to it. Player characters get a Player Controller. AI characters get an AI Controller. Think of the AI Controller as a brain you strap onto a puppet. The puppet (the Pawn) has a body, animations, and stats. The brain (the AI Controller) decides what the puppet does.

An AI Controller is a class that:

- Possesses a Pawn (takes control of it)
- Runs a Behavior Tree (the decision-making logic)
- Manages a Blackboard (the AI's memory)
- Handles perception (sight, hearing, damage sensing)

### Creating an AI Controller

1. In the Content Browser, right-click and choose **Blueprint Class > AIController**
2. Name it something like `BP_EnemyAIController`
3. Open your AI Pawn's Blueprint and set the **AI Controller Class** property to your new controller
4. In the AI Controller's **Event BeginPlay**, call **Run Behavior Tree** and pass in your Behavior Tree asset

When the AI Pawn spawns into the world, UE5 automatically creates an instance of the AI Controller and attaches it. The controller then kicks off the Behavior Tree and the AI starts making decisions.

### AI Controller vs Player Controller

The Player Controller listens for keyboard/mouse/gamepad input. The AI Controller listens for nothing from the outside. Instead, it runs internal logic. Both controllers can call the same functions on the Pawn (move, attack, use ability), which means you can design your Pawn to be controller-agnostic. This is especially useful for our game: a party member could be AI-controlled during combat but player-controlled during exploration.

---

## Behavior Trees: Decision Flowcharts

### The Core Concept

A Behavior Tree is a visual flowchart that represents an AI's decision-making process. Picture a choose-your-own-adventure book: "If you see an enemy, go to page 12 (attack). If you are low on health, go to page 7 (retreat). Otherwise, go to page 3 (patrol)."

Behavior Trees in UE5 execute from left to right, top to bottom. They run continuously, re-evaluating conditions and picking the right branch every tick (or at whatever frequency you configure). This makes them reactive: if something changes in the world, the AI responds on the next evaluation.

### Why Behavior Trees Over Other Approaches?

You could write AI with simple if/else chains in code, but that gets messy fast. Behavior Trees give you:

- **Visual editing**: You can see the entire decision structure at a glance
- **Modularity**: Each branch is independent; you can add, remove, or rearrange behaviors without breaking others
- **Reusability**: Sub-trees can be shared across different AI types
- **Debugging**: UE5 shows you in real-time which branch is active, which nodes succeeded or failed

### Creating a Behavior Tree

1. Right-click in the Content Browser: **Artificial Intelligence > Behavior Tree**
2. Name it `BT_EnemyBasic`
3. Double-click to open the Behavior Tree Editor

You will see a single **Root** node. Everything branches downward from here.

---

## The Blackboard: The AI's Whiteboard

### What Is a Blackboard?

The Blackboard is a data container, a shared memory space that the Behavior Tree, AI Controller, and any other system can read from and write to. Think of it as a literal whiteboard in an office. The AI "writes notes" on it: "My target is Player1," "My health is 35%," "My home location is X,Y,Z." The Behavior Tree then reads those notes to make decisions.

### Setting Up a Blackboard

1. Right-click in Content Browser: **Artificial Intelligence > Blackboard**
2. Name it `BB_EnemyBasic`
3. Open it and add keys:
   - **TargetActor** (Object type, base class: Actor): Who the AI is targeting
   - **PatrolLocation** (Vector): Where the AI should walk to next
   - **HasLineOfSight** (Bool): Can the AI see its target right now?
   - **HealthPercent** (Float): Current HP percentage
   - **BehaviorPreset** (Enum or Name): Aggressive, Defensive, Support, etc.

4. In your Behavior Tree asset, set the **Blackboard Asset** property to `BB_EnemyBasic`

### Writing to the Blackboard

From the AI Controller or any Blueprint with a reference to the controller, call **Set Value as [Type]** on the Blackboard. For example, when the AI Perception system detects a player, you would set the `TargetActor` key to that player's reference.

### Reading from the Blackboard

Behavior Tree nodes read Blackboard keys directly. When you configure a task or decorator node, you will see dropdown fields where you pick which Blackboard key to use. The node then checks or uses that value during execution.

---

## Node Types: The Building Blocks

Behavior Trees are built from four types of nodes. Understanding each one is like understanding the parts of a sentence: subjects, verbs, adjectives, and conjunctions.

### Composite Nodes (The Decision Makers)

Composite nodes control the flow of execution. They have children and decide which children run and in what order.

**Selector (OR logic):**
A Selector tries each child from left to right and stops at the first one that succeeds. Think of it like trying keys on a keyring: you try one, if it does not work, you try the next, until one opens the door.

Example: "Try to attack. If you cannot attack, try to find cover. If there is no cover, flee."

**Sequence (AND logic):**
A Sequence runs each child from left to right and stops if any child fails. Think of it like a recipe: do step 1, then step 2, then step 3. If any step fails, the whole sequence fails.

Example: "Move to enemy AND play attack animation AND deal damage." If the AI cannot reach the enemy, the sequence fails at step 1 and the tree tries something else.

**Simple Parallel:**
Runs a main task and a background task simultaneously. The background task runs alongside the main task. Useful for things like "patrol while checking for enemies."

### Task Nodes (The Actions)

Task nodes are the leaves of the tree, the actual things the AI does. They sit at the bottom of branches and perform actions.

**Built-in tasks:**
- **Move To**: Navigate to a location or actor using the NavMesh
- **Wait**: Pause for a specified duration
- **Rotate to face BBEntry**: Turn to face a Blackboard target
- **Play Animation**: Trigger an animation montage
- **Run Sub-Tree**: Execute another Behavior Tree (great for modularity)

**Custom tasks:**
You will create many custom tasks. Right-click in the Content Browser: **Artificial Intelligence > Behavior Tree Task**. Common custom tasks for our game:

- `BTTask_UseAbility`: Activate a Gameplay Ability from GAS
- `BTTask_PickPatrolPoint`: Choose a random patrol location
- `BTTask_EvaluateThreat`: Calculate which enemy to target
- `BTTask_RollDice`: Simulate a DnD dice roll for an action check

Each task returns one of three results: **Succeeded**, **Failed**, or **In Progress** (still working on it).

### Decorator Nodes (The Conditions)

Decorators attach to other nodes and act as gates or modifiers. They are like bouncers at a club: they check a condition and only let execution proceed if the condition is met.

**Built-in decorators:**
- **Blackboard-Based Condition**: Check if a Blackboard key is set, equals a value, etc. ("Is TargetActor set?")
- **Is At Location**: Is the AI close enough to a point?
- **Cooldown**: Prevent a branch from running again for X seconds
- **Loop**: Repeat the child node N times or infinitely
- **Time Limit**: Abort the child if it takes too long

**Key feature: Observer Aborts**
Decorators can abort running branches when conditions change. This is powerful. Set the **Observer Aborts** property to:
- **None**: Only check the condition when the node is first entered
- **Self**: Abort this branch if the condition becomes false
- **Lower Priority**: Abort lower-priority branches (to the right) if this condition becomes true
- **Both**: Abort both self and lower-priority branches

Example: You have a Selector with two branches. The left branch says "If target visible, attack." The right branch says "Patrol." The left branch's decorator has Observer Aborts set to Lower Priority. While the AI is patrolling (right branch), if it suddenly spots a player, the decorator on the left branch activates, aborts the patrol, and the AI switches to attacking. This is how you get reactive AI.

### Service Nodes (The Background Updaters)

Services attach to composite nodes and tick at a regular interval while that composite is active. Think of them like a background process: while the AI is doing its thing, the service periodically updates information.

Common uses:
- **BTService_UpdateTargetDistance**: Every 0.5 seconds, recalculate distance to target and write it to the Blackboard
- **BTService_CheckHealth**: Periodically check HP and update the HealthPercent Blackboard key
- **BTService_ScanForEnemies**: Run a perception check and update the TargetActor key

Services keep the Blackboard data fresh so that decorators and tasks always have current information to work with.

---

## A Complete Behavior Tree Example

Here is what a basic enemy Behavior Tree looks like, described as a hierarchy:

```
Root
  Selector
    [Decorator: BB "TargetActor" is set]
    Sequence (COMBAT)
      [Service: Update Target Distance, every 0.3s]
      Selector
        [Decorator: BB "HealthPercent" < 0.2]
        Sequence (RETREAT)
          BTTask_FindRetreatPoint
          BTTask_MoveTo (RetreatPoint)
          BTTask_UseAbility (HealSelf)

        [Decorator: BB "TargetDistance" < AttackRange]
        Sequence (ATTACK)
          BTTask_RotateToFaceTarget
          BTTask_UseAbility (BasicAttack)
          BTTask_Wait (AttackCooldown)

        Sequence (CHASE)
          BTTask_MoveTo (TargetActor)

    Sequence (PATROL)
      BTTask_PickPatrolPoint
      BTTask_MoveTo (PatrolLocation)
      BTTask_Wait (2-5 seconds random)
```

Reading this from left to right: The AI first checks if it has a target. If yes, it enters combat mode. In combat, it checks if health is low (retreat), then if it is in range (attack), then defaults to chasing. If there is no target at all, it patrols. The Service at the top of the combat branch keeps the distance data updated so the decorators can make accurate decisions.

---

## Environment Query System (EQS): Spatial Decision Making

### What Is EQS?

EQS is a system for asking spatial questions about the world. "Where is the best cover position?" "Which enemy is closest?" "Where should I stand to cast this area spell?" Think of EQS as giving your AI a bird's-eye view and a ruler. It generates a grid of test points in the world, scores each point based on criteria you define, and returns the best one.

### How EQS Works

1. **Generator**: Creates the test points. Common generators:
   - **Points: Grid**: A grid of points around a location
   - **Points: Circle**: Points arranged in a ring
   - **Points: Donut**: Points between an inner and outer radius
   - **Actors of Class**: All actors of a certain type in the world

2. **Tests**: Score each point. Common tests:
   - **Distance**: How far is this point from something? (Prefer closer or farther)
   - **Trace**: Can I see this point from where I am? (Line of sight check)
   - **Pathfinding**: Can I actually walk to this point? How far is the path?
   - **Dot Product**: Is this point in front of me or behind me?

3. **Result**: The point with the highest combined score wins.

### Creating an EQS Query

1. Right-click in Content Browser: **Artificial Intelligence > Environment Query**
2. Name it `EQS_FindCover`
3. Add a Grid generator centered on the AI (the Querier)
4. Add a Distance test: prefer points closer to the AI (do not run too far for cover)
5. Add a Trace test from the enemy: prefer points the enemy CANNOT see (this is what makes it "cover")
6. Add a Pathfinding test: filter out points the AI cannot reach

### Using EQS in Behavior Trees

Create a custom task `BTTask_RunEQSQuery`. Use the **Run EQS Query** node, pass in the query asset, and store the result in a Blackboard key. Then a subsequent Move To task navigates to that location.

### EQS for Our Game

EQS is perfect for tactical combat on a grid:
- **Find Cover**: Grid-based query that scores tiles by line-of-sight blocking
- **Find Flanking Position**: Score tiles that are behind the target relative to the target's facing direction
- **Find Healing Target**: Score party members by how low their health is
- **Find Area Spell Position**: Score locations where the area of effect would hit the most enemies

---

## AI Perception: Sight, Sound, and Damage

### The AI Perception Component

Before the AI can make decisions, it needs to perceive the world. UE5's AI Perception system handles this. Add an **AI Perception Component** to your AI Controller or Pawn.

### Sight Configuration

- **Sight Radius**: How far the AI can see (e.g., 2000 units)
- **Lose Sight Radius**: Distance at which the AI loses track of a seen target (usually slightly more than sight radius, like 2200)
- **Peripheral Vision Angle**: Field of view in degrees (e.g., 90 degrees for a 180-degree cone)
- **Auto Succeed Range**: Distance within which sight always succeeds regardless of angle

### Hearing Configuration

- Register sounds with the **Report Noise Event** node
- Footsteps, spellcasting, and combat sounds can alert nearby AI
- Configure hearing range per AI type (a guard has better hearing than a zombie)

### Damage Perception

- When the AI takes damage, it can auto-detect the source
- Useful for "who hit me?" reactions even if the attacker is not visible

### Perception Events

The AI Perception Component fires an **On Target Perception Updated** event. This is where you write Blackboard values:

```
On Perception Updated:
  If stimulus = Sight AND successfully sensed:
    Set BB "TargetActor" = sensed actor
    Set BB "HasLineOfSight" = true
  If stimulus = Sight AND lost:
    Set BB "HasLineOfSight" = false
    (optionally clear TargetActor after a timeout)
```

---

## Integrating AI with GAS (Gameplay Ability System)

### Why GAS + AI?

In Module 6, you built the Gameplay Ability System for abilities, attributes, and effects. AI characters need to use the exact same system. An enemy casting Fireball should go through the same GAS pipeline as a player casting Fireball. This keeps everything consistent: damage calculations, cooldowns, resource costs, and gameplay effects all work the same way.

### How AI Activates Abilities

1. Give AI Pawns an **Ability System Component** (same as player characters)
2. Grant abilities to the AI during initialization (e.g., BasicAttack, Fireball, HealSelf)
3. In your custom Behavior Tree task `BTTask_UseAbility`:
   - Get a reference to the Pawn's Ability System Component
   - Call **Try Activate Ability by Class** or **Try Activate Ability by Tag**
   - Return **In Progress** while the ability is executing
   - When the ability ends (listen for the OnAbilityEnded delegate), return **Succeeded** or **Failed**

### AI Ability Selection

Not every ability should be used in every situation. Create a custom task or service that evaluates which ability to use:

- Check resource costs (does the AI have enough mana?)
- Check cooldowns (is the ability ready?)
- Check range (is the target within ability range?)
- Check tactical value (a heal is more valuable when HP is low; an AoE is better against groups)

Store the chosen ability in a Blackboard key, then have the `BTTask_UseAbility` task read from that key.

### DnD-Specific Integration

For our game, AI ability usage maps to the DnD action economy:
- **Action**: Main ability (attack, cast spell)
- **Bonus Action**: Secondary ability (offhand attack, quick spell)
- **Reaction**: Triggered ability (opportunity attack, counterspell)
- **Movement**: NavMesh-based movement equal to the character's speed stat

The Behavior Tree can model a full turn: use movement, then action, then bonus action, then end turn.

---

## Building Party Member AI

### The Challenge

Party members are the hardest AI to get right. They need to be smart enough to help but not so autonomous that the player feels irrelevant. Think of them like good supporting actors: they enhance the scene without stealing it.

### Party AI Architecture

Create a dedicated AI Controller: `BP_PartyMemberAIController`. This controller reads a **Behavior Preset** from the Blackboard, which the player can change at any time through the UI.

### Behavior Presets

**Aggressive:**
- Prioritize attacking the nearest enemy
- Use offensive abilities first
- Move toward enemies proactively
- Only retreat at very low health (below 15%)

**Defensive:**
- Stay near the player
- Prioritize defensive abilities (shields, buffs)
- Only attack enemies that are attacking the party
- Retreat earlier (below 30% health)

**Support:**
- Monitor party health constantly
- Prioritize healing the most wounded ally
- Use buff abilities on allies before combat
- Stay at maximum range from enemies
- Avoid direct combat unless no other option

**Follow:**
- Stay within a set distance of the player
- Do not engage in combat unless attacked
- Useful for stealth sections or when the player wants full control

### Following the Player

Outside of combat, party members need to follow the player without looking robotic. Here is how:

1. **Formation System**: Define offset positions relative to the player (behind-left, behind-right, directly behind). Each party member gets a formation slot.
2. **Dynamic Following**: Do not follow the player's exact path. Instead, periodically calculate the formation position and move toward it. Add slight randomization so movement looks natural.
3. **Catch-Up Speed**: If the party member falls too far behind, increase their movement speed temporarily. If they are very far away, teleport them to the player (with a brief visual effect to mask the teleport).
4. **Obstacle Avoidance**: The NavMesh handles this, but add extra logic to avoid bunching up on narrow paths. Stagger movement so party members do not collide.

### Party AI in Combat

During turn-based combat, party AI follows the turn order:

1. When it is a party member's turn, the Behavior Tree activates the combat branch
2. The AI evaluates the battlefield using EQS and Blackboard data
3. Based on the behavior preset, it selects a target and an ability
4. It executes the ability through GAS
5. It ends its turn and notifies the Turn Manager

### Player Override

Give the player the option to:
- **Issue direct commands**: "Move here," "Attack this target," "Use this ability"
- **Switch to manual control**: Temporarily possess the party member
- **Change presets mid-combat**: Switch a character from Aggressive to Defensive on the fly

Commands override the Behavior Tree temporarily. Store them as high-priority Blackboard values that the tree checks before its normal decision-making.

---

## Debugging AI in UE5

### The AI Debugging Tools

UE5 has excellent AI debugging tools. Press the apostrophe key (') during Play-In-Editor to cycle through AI debug views:

- **Behavior Tree view**: Shows the active tree with highlighted nodes, which branch is running, which decorators passed or failed
- **Blackboard view**: Shows all current Blackboard values in real-time
- **EQS view**: Shows the query results as colored spheres in the world (green = high score, red = low score)
- **Perception view**: Shows sight cones, heard sounds, and perceived actors
- **NavMesh view**: Shows the navigation mesh the AI uses for pathfinding

### Logging

Add Print String nodes in your custom tasks to output debug information. Prefix all AI logs with the character's name so you can filter:

```
[Goblin_03] Entering combat, target: Player1, distance: 450
[Goblin_03] Selected ability: BasicAttack
[Goblin_03] Ability succeeded, ending turn
```

### Common Issues

- **AI not moving**: Check that the NavMesh covers the area. Rebuild navigation if needed.
- **AI stuck in a loop**: A decorator might be flickering between true and false. Add a cooldown or hysteresis (require the condition to stay changed for a minimum time before switching).
- **AI ignoring targets**: Check the AI Perception configuration. Make sure the target's Affiliation (friendly, neutral, hostile) matches what the perception is configured to detect.
- **Abilities not firing**: Make sure the AI's Ability System Component has the ability granted AND that the AI meets all activation requirements (resource costs, cooldowns, tags).

---

## Performance Considerations

### Tick Rates

Not every AI needs to evaluate its Behavior Tree every frame. For distant enemies, reduce the tick rate:

- Nearby AI: Every frame or every 0.1 seconds
- Mid-distance AI: Every 0.3 to 0.5 seconds
- Far-away AI: Every 1 to 2 seconds
- Off-screen AI: Pause entirely or run a simplified simulation

### LOD for AI

Just like visual Level of Detail, you can create AI Level of Detail:
- **Full AI**: Complete Behavior Tree with all branches and EQS queries
- **Simplified AI**: Reduced tree with only basic behaviors
- **Dormant AI**: No tree running; just holds its position until the player gets closer

### EQS Optimization

EQS queries can be expensive. Limit them:
- Reduce the number of test points (a 5x5 grid instead of 10x10)
- Increase the interval between queries
- Cache results when the situation has not changed significantly

---

## Summary

AI in UE5 is built on a clean, modular architecture:

| Component | Role | Analogy |
|-----------|------|---------|
| AI Controller | The brain that drives the Pawn | A puppeteer controlling a puppet |
| Behavior Tree | The decision-making flowchart | A choose-your-own-adventure book |
| Blackboard | Shared memory for AI data | A whiteboard covered in sticky notes |
| Task Nodes | Actions the AI performs | Verbs in a sentence |
| Decorator Nodes | Conditions that gate actions | "If" statements |
| Service Nodes | Background data updaters | A news ticker updating continuously |
| Composite Nodes | Flow control (Selector/Sequence) | "OR" and "AND" logic |
| EQS | Spatial decision-making | A bird's-eye view with a scoring rubric |
| AI Perception | Sight, hearing, damage sensing | The AI's senses |

For our DnD game, these systems combine to create enemies that patrol, detect, fight tactically, and retreat, plus party members that follow, support, and fight alongside the player based on customizable behavior presets. In the next module, we will build the UI that lets the player see and control all of this.
