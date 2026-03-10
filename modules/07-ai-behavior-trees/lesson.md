# Module 07: Enemy AI

## Building the Brains Behind Every Monster in Tabletop Quest

Your Tabletop Quest world has a camera that zooms from tabletop to 3D, a combat system that switches between turn-based and real-time, and a player character who can swing swords and cast spells. But right now, every enemy in the world just stands there like a painted miniature that forgot to come alive. Time to fix that.

In this module, you will build the AI systems that power every enemy in Tabletop Quest. Not hypothetical enemies. Real ones: a Goblin Scout that patrols the forest and calls for backup, a Skeleton Warrior that guards dungeon corridors and chases intruders, and a Dragon Boss with multiple combat phases. By the end, your enemies will see, hear, think, and fight.

UE5's AI framework is built around four core systems that work together:

1. **AI Controllers** decide which Pawn to control and which Behavior Tree to run
2. **Behavior Trees** define decision-making logic (what should this enemy do right now?)
3. **Blackboards** store the AI's memory (what does this enemy know?)
4. **AI Perception** gives enemies senses (what can this enemy see and hear?)

Plus a fifth system, the **Environment Query System (EQS)**, which lets enemies evaluate the world around them (where should I stand? where should I flee to?).

Think of it like building a puppet show. The AI Controller is the puppeteer's hands. The Behavior Tree is the script. The Blackboard is the puppeteer's notes scribbled in the margins. AI Perception is the puppeteer peeking through the curtain to see the audience. And EQS is the puppeteer's mental map of the stage.

Let's build some enemies.

---

## Part 1: AI Controllers

### What Is an AI Controller?

Every character in UE5 needs a Controller to make decisions. Player characters get a Player Controller (which reads your keyboard and mouse input). AI characters get an AI Controller (which reads Behavior Trees and Perception data instead).

An AI Controller is a class that:

- **Possesses** a Pawn (takes control of its movement, actions, and animations)
- **Runs** a Behavior Tree (the decision-making brain)
- **Manages** a Blackboard (the AI's working memory)
- **Listens** to Perception stimuli (sight, hearing, damage)

### Creating the Base Enemy AI Controller

For Tabletop Quest, you will create a base AI Controller that all enemies share, then customize behavior through different Behavior Trees.

1. In the Content Browser, right-click: **Blueprint Class > AIController**
2. Name it `BP_EnemyAIController_Base`
3. Open it and go to the Event Graph

In **Event BeginPlay**, you need to do two things:

- Call **Use Blackboard** and pass in a Blackboard Data Asset (you will create this next)
- Call **Run Behavior Tree** and pass in a Behavior Tree asset

The reason you call Use Blackboard first is that the Behavior Tree needs a Blackboard to read and write data. If you run the tree before initializing the Blackboard, the tree has no memory to work with.

### One Controller, Many Enemies

Here is a design decision that will save you hours: use a single AI Controller Blueprint for most standard enemies, and swap the Behavior Tree per enemy type. You can set the Behavior Tree as a variable on the enemy Pawn itself, then have the AI Controller read it during BeginPlay.

In your enemy Pawn Blueprint:
- Add a variable: `BehaviorTreeAsset` (type: Behavior Tree, Instance Editable)
- Set it per enemy: Goblin Scout uses `BT_GoblinScout`, Skeleton Warrior uses `BT_SkeletonWarrior`

In your AI Controller's BeginPlay:
- Get the Controlled Pawn
- Cast it to your base enemy class
- Read the `BehaviorTreeAsset` variable
- Pass it to Run Behavior Tree

This pattern means you create one AI Controller and dozens of enemy types, each with different behavior just by swapping the tree. Clean and scalable.

### AI Controller vs the Pawn

A common beginner mistake is putting AI logic directly into the enemy Pawn Blueprint. Don't do this. The Pawn is the body. The Controller is the brain. Keep them separate. If an enemy dies and respawns, you destroy the Pawn but the Controller pattern persists. If you want to temporarily "stun" an enemy, you can pause the Behavior Tree without touching the Pawn at all. Separation of concerns is not just good practice here; it is how UE5's AI system is designed to work.

---

## Part 2: Blackboards (AI Memory)

### What Is a Blackboard?

A Blackboard is a simple key-value store that acts as the AI's memory. Think of it like a chalkboard hanging on the wall that the AI can read from and write to. It stores things like:

- "Who is my current target?" (Object reference)
- "Where did I last see the player?" (Vector)
- "Am I in combat?" (Bool)
- "What is my home patrol point?" (Vector)
- "How much HP do I have left?" (Float)

Every Behavior Tree node can read from the Blackboard to make decisions and write to it to update the AI's state.

### Creating the Tabletop Quest Enemy Blackboard

Create a Blackboard Data Asset:

1. Right-click in Content Browser: **Artificial Intelligence > Blackboard**
2. Name it `BB_EnemyBase`

Add these keys (these are the ones every enemy in the game will use):

| Key Name | Type | Purpose |
|----------|------|---------|
| `TargetActor` | Object (Base Class: Actor) | The enemy the AI is currently targeting |
| `TargetLocation` | Vector | Last known position of the target |
| `HomeLocation` | Vector | Where this enemy spawns/patrols around |
| `PatrolPoint` | Vector | Current patrol destination |
| `IsInCombat` | Bool | Whether the AI is currently fighting |
| `HasLineOfSight` | Bool | Whether the AI can currently see its target |
| `HealthPercent` | Float | Current HP as a percentage (0.0 to 1.0) |
| `AlertLevel` | Enum or Int | 0 = Idle, 1 = Suspicious, 2 = Alert, 3 = Combat |
| `ShouldFlee` | Bool | Whether the AI should run away |

You can always add more keys later for specific enemy types. The Dragon Boss will need keys like `CurrentPhase` and `BreathCooldown`. But this base set covers the fundamentals.

### Setting Blackboard Values

Blackboard values can be set from multiple places:

- **Behavior Tree tasks** (the most common way)
- **AI Controller** (during initialization, e.g., setting HomeLocation to the spawn point)
- **AI Perception** (when detecting or losing sight of a target)
- **Gameplay events** (taking damage can update HealthPercent)

In the AI Controller's BeginPlay, after initializing the Blackboard, set the `HomeLocation` key to the Pawn's current location. This gives every enemy a "home" it can return to after chasing a player.

### Blackboard Decorators

Behavior Tree nodes can have **Blackboard Decorators** attached. These are conditions that check a Blackboard value before allowing a node to execute. For example:

- A "Chase Player" branch has a decorator: `TargetActor IS SET`
- A "Return Home" branch has a decorator: `IsInCombat == false`
- A "Flee" branch has a decorator: `ShouldFlee == true`

Decorators are the primary way Behavior Trees make decisions. They turn your tree from a flat sequence of actions into a branching decision system.

---

## Part 3: Behavior Trees

### What Is a Behavior Tree?

A Behavior Tree is a visual scripting system for AI decision-making. If Blueprints are "visual programming for game logic," then Behavior Trees are "visual programming for AI logic." They look similar (nodes connected by wires) but work very differently.

A Behavior Tree is a tree structure with three types of nodes:

1. **Composite Nodes** (control flow: decide which child to run)
   - **Selector**: Try children left to right, stop at the first one that succeeds (like an OR gate)
   - **Sequence**: Run children left to right, stop at the first one that fails (like an AND gate)
   - **Simple Parallel**: Run two children simultaneously

2. **Task Nodes** (leaf nodes: do something)
   - **Move To**: Navigate to a location
   - **Wait**: Pause for a duration
   - **Play Animation**: Play an animation montage
   - **Run EQS Query**: Ask the environment a question
   - **Custom Tasks**: Your own Blueprint tasks (attack, cast spell, call for help)

3. **Decorator Nodes** (conditions: should this branch run?)
   - **Blackboard**: Check a Blackboard value
   - **Cooldown**: Only allow execution every X seconds
   - **Is At Location**: Check if the AI is near a point
   - **Custom Decorators**: Your own conditions

### How Execution Works

A Behavior Tree runs continuously, starting from the Root node and flowing left to right, top to bottom. Every tick (every frame, or at a configurable interval), the tree evaluates from the root.

Here is the key concept: **the leftmost branch has the highest priority**. A Selector node tries its leftmost child first. If that child's decorators pass and the child succeeds, the Selector ignores all other children. If the first child fails, it tries the second, and so on.

This is how you create priority-based AI:

```
Root
  Selector
    [Priority 1] Flee (decorator: ShouldFlee == true)
    [Priority 2] Combat (decorator: IsInCombat == true)
    [Priority 3] Investigate (decorator: AlertLevel > 0)
    [Priority 4] Patrol (always available, lowest priority)
```

The AI will always try to flee first (if it should flee), then fight (if in combat), then investigate (if suspicious), and only patrol if nothing else is happening. This priority system is the backbone of every enemy AI in Tabletop Quest.

### Creating Your First Behavior Tree

1. Right-click in Content Browser: **Artificial Intelligence > Behavior Tree**
2. Name it `BT_GoblinScout`
3. Double-click to open the Behavior Tree Editor

The editor shows a Root node. Drag off of it to create a **Selector** node. This is your top-level priority selector. From this Selector, create four children (each a **Sequence** node):

1. **Flee Sequence** (leftmost, highest priority)
2. **Combat Sequence**
3. **Investigate Sequence**
4. **Patrol Sequence** (rightmost, lowest priority)

Each Sequence will contain the specific tasks for that behavior. We will fill these in as we build each enemy type.

### Custom Behavior Tree Tasks

UE5 comes with built-in tasks like Move To and Wait, but you will need custom tasks for Tabletop Quest. Custom tasks are Blueprint classes that inherit from `BTTask_BlueprintBase`.

To create one:

1. Right-click in Content Browser: **Blueprint Class > BTTask_BlueprintBase**
2. Name it descriptively: `BTTask_AttackTarget`, `BTTask_CallForBackup`, `BTTask_BreathAttack`

Inside the task, you override two events:

- **Receive Execute AI**: Called when the task starts. Do your logic here (play animation, deal damage, spawn projectile). Call **Finish Execute** with Success or Failure when done.
- **Receive Abort AI**: Called if the task is interrupted (higher priority branch activated). Clean up and call **Finish Abort**.

For an attack task:
1. Get the Controlled Pawn from the Owner Controller
2. Get the Target from the Blackboard
3. Check range (is the target close enough to hit?)
4. Play the attack animation montage
5. On animation notify (the "hit" frame), apply damage
6. Call Finish Execute with Success

### Services: Background Tasks on the Tree

There is a fourth node type that runs alongside other nodes: **Services**. A Service is a background task that ticks at a regular interval while its parent branch is active. Think of it like a background process.

Common uses:

- **Update Blackboard values**: A service that checks the AI's health every 0.5 seconds and sets `ShouldFlee = true` when health drops below 25%
- **Update target**: A service that re-evaluates which enemy to focus (the closest? the weakest? the one attacking an ally?)
- **Range check**: A service that sets `IsInMeleeRange` or `IsInSpellRange` based on distance to target

Services keep your tasks clean. Instead of every task checking "am I low on health?", a single service handles that check globally.

---

## Part 4: AI Perception

### Giving Enemies Senses

Right now, your enemies can think (Behavior Trees) and remember (Blackboards), but they are blind and deaf. AI Perception is the system that gives them senses.

AI Perception works through two components:

1. **AI Perception Component**: Added to the AI Controller. This is the "brain" that processes stimuli.
2. **AI Perception Stimuli Source Component**: Added to actors that can be perceived (the player character, other enemies, noise sources). This is what generates stimuli.

### Setting Up Sight

For Tabletop Quest, every enemy needs sight at minimum. Here is how to set it up:

1. Open your `BP_EnemyAIController_Base`
2. Add an **AI Perception Component**
3. In the Details panel, add a **Sense Config**: `AI Sight Config`
4. Configure the sight parameters:

| Parameter | Goblin Scout Value | Description |
|-----------|-------------------|-------------|
| Sight Radius | 1500 | How far the enemy can see (in UE units, roughly 15 meters) |
| Lose Sight Radius | 2000 | How far before the enemy loses track of a seen target (should be larger than Sight Radius to prevent flickering) |
| Peripheral Vision Half Angle | 60 | Field of view in degrees from the forward vector (60 = 120 degree cone) |
| Auto Success Range | 200 | Distance at which detection is instant (enemy is right next to you) |
| Max Age | 5.0 | How long a stimulus is remembered after losing sight |

5. Set the **Dominant Sense** to `AISense_Sight`

### Setting Up Hearing

Hearing lets enemies react to sounds even when they cannot see the source. This is critical for stealth gameplay and for enemies in dungeons hearing combat in adjacent rooms.

1. In the same AI Perception Component, add another Sense Config: `AI Hearing Config`
2. Set **Hearing Range** to 2000 (adjustable per enemy type)

To generate hearing stimuli, you use the **Report Noise Event** node in Blueprints. When the player attacks, opens a door, or breaks a crate, you fire a noise event at that location with a loudness value. Enemies within hearing range will receive the stimulus.

For Tabletop Quest, you will want to report noise events for:
- Player attacks (loudness 0.5)
- Ability use, especially spells with loud effects (loudness 0.7)
- Breaking objects like crates or doors (loudness 1.0)
- Player footsteps when running (loudness 0.3, not when walking)
- Other enemies dying (loudness 0.8, this is how nearby enemies "hear" combat)

### Damage Sensing

There is a third sense that is often overlooked: **Damage Sensing**. When an AI takes damage, it should immediately know something is attacking it, even if it cannot see or hear the attacker. This prevents the frustrating scenario where a Rogue backstabs a Skeleton and the Skeleton just stands there because the Rogue is behind its vision cone.

Add a Damage sense config to the AI Perception Component. In the enemy Pawn's `AnyDamage` or `PointDamage` event, call **Report Damage Event** to generate the stimulus.

### Handling Perception Events

When the AI Perception Component detects something, it fires an event on the AI Controller: **On Target Perception Updated**. This event gives you:

- The **Actor** that was perceived
- The **Stimulus** information (which sense, location, strength, whether it is new or lost)

In your AI Controller, bind to this event and update the Blackboard:

- If a hostile actor is **newly perceived by sight**: Set `TargetActor`, set `IsInCombat` to true, set `AlertLevel` to 3
- If the target is **lost from sight**: Set `HasLineOfSight` to false, set `TargetLocation` to the last known position
- If a **noise is heard** and no current target: Set `AlertLevel` to 1, set `TargetLocation` to the noise location (this triggers the Investigate branch)
- If **damage is sensed** and no current target: Set `TargetActor` to the damage instigator, set `IsInCombat` to true

### The Perception Pipeline for Tabletop Quest

Here is the full pipeline from stimulus to action:

```
Player swings sword (generates noise at location)
    |
    v
AI Hearing detects noise stimulus
    |
    v
On Target Perception Updated fires on AI Controller
    |
    v
AI Controller sets AlertLevel = 1 on Blackboard
    |
    v
Behavior Tree's Investigate branch decorator passes (AlertLevel > 0)
    |
    v
AI moves to noise location, looks around
    |
    v
AI Sight detects player at noise location
    |
    v
On Target Perception Updated fires again (sight stimulus)
    |
    v
AI Controller sets TargetActor, IsInCombat = true, AlertLevel = 3
    |
    v
Behavior Tree's Combat branch decorator passes (IsInCombat == true)
    |
    v
AI enters combat behavior (attack, chase, use abilities)
```

This pipeline gives you the classic stealth-game flow: noise attracts attention, investigation leads to sighting, sighting triggers combat. In Tabletop Quest, a Rogue player sneaking through a dungeon should feel the tension of this system. Walk slowly (no footstep noise) or run and risk alerting every Skeleton on the floor.

### Affiliation: Friend or Foe

AI Perception uses a **Team ID** system to determine who is friendly and who is hostile. Without this, enemies would perceive each other and try to fight their own allies.

On the AI Controller, override the **Get Team Attitude Towards** function:

- Same team = Friendly (ignore)
- Different team = Hostile (detect and potentially attack)
- Neutral = can see but won't attack unless provoked

For Tabletop Quest:
- Team 0: Player party
- Team 1: Goblin faction
- Team 2: Undead faction
- Team 3: Dragon/Boss faction

This lets you create scenarios where Goblins and Undead fight each other if they meet, which is exactly the kind of emergent gameplay that makes an open world RPG feel alive.

---

## Part 5: Building the Goblin Scout

Time to build a real enemy. The Goblin Scout is the most common enemy in Tabletop Quest's early game. It patrols forest paths, has decent sight but poor hearing, attacks with a rusty shortsword, and runs to alert nearby goblins when it spots the player.

### Goblin Scout Behavior Design

Before writing any Blueprint logic, design the behavior on paper. For every enemy in the game, answer these five questions:

1. **What does it do when idle?** Patrol between 2-4 waypoints near its spawn.
2. **What does it do when suspicious?** Walk toward the noise location, look around for 3 seconds.
3. **What does it do when it spots the player?** Run toward the nearest Goblin ally and "alert" them, then engage in combat.
4. **How does it fight?** Melee attacks. If the player is too far, chase. If health drops below 25%, flee.
5. **What does it do when fleeing?** Run away from the player toward its home location.

Write these five answers for every enemy before you open the editor. It takes five minutes and saves hours of confused iteration.

### The Goblin Scout Behavior Tree

```
BT_GoblinScout
  Selector (Priority)
    |
    |-- Sequence [FLEE]
    |     Decorator: Blackboard "ShouldFlee" == true
    |     Task: Calculate Flee Point (EQS)
    |     Task: Move To (flee point)
    |     Task: Wait 2s (catch breath)
    |     Task: Set Blackboard "ShouldFlee" = false
    |
    |-- Sequence [ALERT & COMBAT]
    |     Decorator: Blackboard "IsInCombat" == true
    |     Selector
    |       |-- Sequence [ALERT ALLIES]
    |       |     Decorator: Blackboard "HasAlertedAllies" == false
    |       |     Task: Find Nearest Ally (EQS)
    |       |     Task: Move To (ally location)
    |       |     Task: BTTask_AlertNearbyEnemies
    |       |     Task: Set Blackboard "HasAlertedAllies" = true
    |       |
    |       |-- Sequence [MELEE ATTACK]
    |             Task: Move To (TargetActor, acceptable radius: 150)
    |             Task: BTTask_MeleeAttack
    |             Task: Wait 0.5s (attack cooldown)
    |
    |-- Sequence [INVESTIGATE]
    |     Decorator: Blackboard "AlertLevel" > 0
    |     Task: Move To (TargetLocation)
    |     Task: BTTask_LookAround (rotate 180 degrees over 3 seconds)
    |     Task: Set Blackboard "AlertLevel" = 0
    |
    |-- Sequence [PATROL]
          Task: BTTask_GetNextPatrolPoint
          Task: Move To (PatrolPoint)
          Task: Wait (random 2-5 seconds)
```

Let's walk through what happens when a player enters the Goblin's patrol area:

1. The Goblin is in the Patrol branch, walking between waypoints
2. The player runs nearby, generating a footstep noise event
3. AI Perception catches the noise, the Controller sets `AlertLevel = 1`
4. The tree re-evaluates. The Investigate branch's decorator passes (AlertLevel > 0). Investigate has higher priority than Patrol, so it activates.
5. The Goblin walks to the noise location and looks around
6. While looking around, AI Sight detects the player. The Controller sets `IsInCombat = true`.
7. The tree re-evaluates. The Combat branch's decorator passes. Combat has higher priority than Investigate.
8. The Goblin has not alerted allies yet (`HasAlertedAllies == false`), so the Alert Allies sub-branch activates first
9. The Goblin sprints to the nearest ally, alerts them, then sets `HasAlertedAllies = true`
10. On the next evaluation, the Alert Allies decorator fails (already alerted), so the Melee Attack sub-branch activates
11. The Goblin chases and attacks the player
12. A Service on the Combat branch checks health every 0.5s. When health drops below 25%, it sets `ShouldFlee = true`
13. The Flee branch's decorator passes. Flee has the highest priority, overriding Combat.
14. The Goblin runs away

That is a complete, believable enemy behavior built from simple building blocks.

### Building the Alert System

The `BTTask_AlertNearbyEnemies` task is unique to the Goblin Scout. When executed, it:

1. Gets all actors within a radius (500 units) with the tag "Enemy"
2. For each found enemy, gets their AI Controller
3. Sets their Blackboard `TargetActor` to the Goblin Scout's current target
4. Sets their `AlertLevel` to 3
5. Sets their `IsInCombat` to true

This creates a chain reaction. One Goblin spots the player, runs to tell its friends, and suddenly the whole camp is on alert. This is the kind of emergent behavior that makes enemies feel alive.

You can also add a **shout animation** and a **sound cue** when alerting. The Goblin raises its arm, screams, and all nearby Goblins turn toward the player. Players learn that killing the scout quietly (before it shouts) is tactically better than charging in. The AI system creates stealth gameplay without you coding a single stealth mechanic.

### Building the Patrol System

The `BTTask_GetNextPatrolPoint` task needs patrol points to move between. There are two approaches:

**Approach 1: Spline Patrol Path**

Place a Spline actor in the level that defines the patrol route. The Goblin follows the spline. This gives you precise control over exactly where the Goblin walks.

1. Create a Blueprint Actor called `BP_PatrolPath` with a Spline Component
2. In the level, place a `BP_PatrolPath` and shape the spline along the desired patrol route
3. On the Goblin Pawn, add a variable `PatrolPath` (type: BP_PatrolPath, Instance Editable)
4. In the editor, assign the patrol path to the Goblin
5. The `BTTask_GetNextPatrolPoint` task reads the next point on the spline and writes it to the Blackboard
6. Track which spline point the Goblin is heading toward with an integer index on the Blackboard

**Approach 2: Random Points Near Home**

For less structured patrol behavior (wandering), use the navigation system to find random reachable points near the enemy's home location.

1. In the task, call **Get Random Reachable Point in Radius** with the `HomeLocation` and a radius (e.g., 800 units)
2. Write the result to the `PatrolPoint` Blackboard key

For Tabletop Quest, use Approach 1 for enemies that guard specific routes (dungeon corridors, camp perimeters) and Approach 2 for enemies that wander freely (forest creatures, idle town guards).

### Goblin Scout Perception Settings

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| Sight Radius | 1500 | Forest canopy limits long-range visibility |
| Lose Sight Radius | 2000 | Slight buffer so the Goblin does not instantly forget you |
| Peripheral Vision | 45 degrees | Goblins are focused forward, sneaking behind them is viable |
| Hearing Range | 800 | Poor hearing, relies more on sight |
| Auto Success Range | 200 | If you are right next to a Goblin, it sees you no matter what |

### Goblin Variants

Once the base Goblin Scout works, you can create variants just by adjusting the Behavior Tree and perception settings:

| Variant | Difference from Scout |
|---------|----------------------|
| **Goblin Archer** | Stays at range (800+ units from target), uses ranged attack task, flees if player gets too close |
| **Goblin Shaman** | Stays behind melee allies, heals Goblins below 50% HP, casts poison bolt every 8 seconds |
| **Goblin Brute** | No flee behavior at all, higher damage, slower movement, breaks through player formations |

Each variant shares the same AI Controller and base Blackboard. Only the Behavior Tree and a few perception settings change.

---

## Part 6: Building the Skeleton Warrior

The Skeleton Warrior is a dungeon enemy. Unlike the Goblin, which patrols outdoors and calls for help, the Skeleton stands guard at a fixed post and relentlessly chases any intruder that enters its territory. It does not flee, because skeletons have no sense of self-preservation. It does not call for allies, because skeletons are solitary sentinels.

### Skeleton Warrior Behavior Design

1. **Idle**: Stand at guard post (no patrol, just idle animation with occasional head turn)
2. **Suspicious**: Turn toward noise source, take one step forward, wait
3. **Combat**: Chase the player aggressively. If the player leaves the Skeleton's territory (a defined radius around the guard post), the Skeleton returns to its post.
4. **Special**: The Skeleton has a "Shield Block" ability it uses when the player is attacking. This makes it feel reactive.
5. **Flee**: Never. Skeletons fight until destroyed.

### The Skeleton Warrior Behavior Tree

```
BT_SkeletonWarrior
  Selector (Priority)
    |
    |-- Sequence [RETURN TO POST]
    |     Decorator: Blackboard "IsInCombat" == true
    |     Decorator: Custom "Is Target Out of Territory" (distance from HomeLocation > 2000)
    |     Task: Set Blackboard "IsInCombat" = false, "TargetActor" = None
    |     Task: Move To (HomeLocation)
    |     Task: BTTask_IdleAtPost
    |
    |-- Sequence [COMBAT]
    |     Decorator: Blackboard "IsInCombat" == true
    |     Selector
    |       |-- Sequence [SHIELD BLOCK]
    |       |     Decorator: Custom "Is Target Attacking"
    |       |     Decorator: Cooldown 3.0s
    |       |     Task: BTTask_ShieldBlock
    |       |
    |       |-- Sequence [HEAVY STRIKE]
    |       |     Decorator: Cooldown 6.0s
    |       |     Task: Move To (TargetActor, acceptable radius: 150)
    |       |     Task: BTTask_HeavyStrike
    |       |
    |       |-- Sequence [BASIC ATTACK]
    |             Task: Move To (TargetActor, acceptable radius: 150)
    |             Task: BTTask_MeleeAttack
    |             Task: Wait 0.8s (slower than Goblin, heavier weapon)
    |
    |-- Sequence [INVESTIGATE]
    |     Decorator: Blackboard "AlertLevel" > 0
    |     Task: BTTask_TurnToward (TargetLocation)
    |     Task: Move To (TargetLocation, acceptable radius: 100)
    |     Task: Wait 2.0s
    |     Task: Set Blackboard "AlertLevel" = 0
    |
    |-- Sequence [GUARD]
          Task: BTTask_IdleAtPost (idle animation, occasional head turn)
          Task: Wait (random 3-8 seconds)
```

Notice the differences from the Goblin Scout: no Flee branch, no Alert Allies branch, and a new Return to Post branch at the top. The Return to Post branch is the highest priority after combat conditions are checked. This means if the player lures the Skeleton far enough from its post, it abandons the chase and walks home. This creates the "territory leash" behavior common in dungeon games.

### Territory System

The "Return to Post" behavior is what makes the Skeleton feel like a guardian rather than a mindless chaser. Here is how to implement the territory check:

Create a custom decorator: `BTDecorator_IsTargetOutOfTerritory`

1. Override **Perform Condition Check AI**
2. Get the AI Controller's Controlled Pawn
3. Get `HomeLocation` from the Blackboard
4. Get `TargetActor` from the Blackboard
5. Calculate the distance between `TargetActor` and `HomeLocation`
6. If distance > territory radius (a variable, default 2000): return True (target has left territory)
7. Else: return False

This creates interesting tactical gameplay. Players can kite a Skeleton out of its territory, forcing it to give up the chase and walk back to its post. A Rogue could use this to bait the Skeleton away from a treasure chest, grab the loot, and sneak past.

### Shield Block Mechanic

The `BTTask_ShieldBlock` task does three things:

1. Plays a shield-raise animation
2. Applies a temporary damage reduction (reduce incoming damage by 75% for 1 second)
3. Plays a block VFX (sparks on shield)

The decorator `Is Target Attacking` checks whether the player character is currently playing an attack montage. This makes the Skeleton feel reactive rather than random. It blocks when you attack, not at random intervals.

The Cooldown decorator (3 seconds) prevents the Skeleton from blocking every single attack. The player learns the pattern: attack, get blocked, wait for cooldown, attack again during the window. This is emergent combat depth from simple AI rules.

### Skeleton Perception Settings

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| Sight Radius | 1200 | Dungeons are dark, shorter sight range |
| Lose Sight Radius | 1600 | Buffer zone |
| Peripheral Vision | 70 degrees | Wider FOV than Goblins, harder to sneak past |
| Hearing Range | 600 | Poor hearing (no ears), relies heavily on sight and damage sensing |
| Damage Sense | Enabled | Skeletons always know when they are hit |
| Auto Success Range | 300 | Slightly larger than Goblins due to dungeon proximity |

---

## Part 7: Environment Query System (EQS)

### What Is EQS?

The Environment Query System lets AI characters ask questions about the world around them. Instead of hardcoding "move to position X," you ask "find the best position that satisfies these criteria."

Examples of questions EQS can answer:

- "Where is the best place to flee to?" (far from the player, reachable, not a dead end)
- "Which ally is closest to me?" (for the Goblin Scout's alert behavior)
- "Where should I stand to breathe fire?" (far enough for the cone attack, clear line of sight)
- "Where is cover?" (behind obstacles, out of player's line of sight)

Think of EQS like a Google search for locations. You type in what you want (criteria), and EQS returns the best results (positions in the world).

### EQS Concepts

An EQS Query has three parts:

1. **Generator**: Creates a set of test points or actors
   - Points on a grid around the querier
   - Points on a ring (donut) at a specific distance
   - All actors of a class (find all Goblin allies)
   - Points along a pathfinding route
   - Points on a circle at specific angles

2. **Tests**: Score or filter each generated item
   - Distance test: Score based on distance to a context (closer = higher, or farther = higher)
   - Trace test: Can the AI see this point? Is the path clear?
   - Dot product test: Is this point in front of me or behind me?
   - Pathfinding test: Can the AI actually reach this point?
   - Custom tests: Any condition you can code

3. **Contexts**: Reference points for tests
   - The Querier (the AI running the query)
   - A Blackboard entry (e.g., the TargetActor)
   - A custom context (e.g., all allies within 1000 units)

### Building the Goblin Flee Query

The Goblin Scout needs to find a good place to run to when its health is low. "Good" means: far from the player, reachable by navigation, and roughly in the direction of the Goblin's home location.

Create an EQS Query: `EQS_FindFleePoint`

**Generator**: Points on a Grid
- Grid half-size: 1000
- Space between points: 200
- Generated around: The Querier (the Goblin)

**Test 1**: Distance to Player (TargetActor)
- Score: The farther from the player, the higher the score
- Filter: Minimum distance 500 (do not pick points too close)

**Test 2**: Distance to Home (HomeLocation from Blackboard)
- Score: The closer to home, the higher the score
- Weight: 0.5 (less important than fleeing from the player)

**Test 3**: Pathfinding
- Filter: Only include points the AI can actually navigate to
- This prevents the AI from trying to flee through walls or off cliffs

**Test 4**: Trace to Player
- Filter: Prefer points where the Goblin breaks line of sight (trace fails = obstacle between Goblin and player)
- Weight: 0.3

The EQS system scores every generated point, and the Goblin moves to the highest-scoring point. The result is a Goblin that intelligently runs away: heading toward home, breaking line of sight when possible, and always picking a reachable destination.

### Building the Dragon Positioning Query

For the Dragon Boss (which you will build next), EQS answers a different question: "Where should I stand to use my breath attack?"

Create an EQS Query: `EQS_DragonBreathPosition`

**Generator**: Points on a Ring
- Inner radius: 800
- Outer radius: 1200
- Generated around: The TargetActor (the player)

**Test 1**: Trace to Target
- Filter: Must have clear line of sight to the player (the breath attack needs a clear path)

**Test 2**: Dot Product (Querier forward direction vs. direction to generated point)
- Score: Prefer points roughly in front of the Dragon (so it does not need a 180-degree turn)

**Test 3**: Pathfinding
- Filter: Dragon must be able to walk there (no lava pools, no walls)

This query finds the ideal position for the Dragon to stand at a medium distance from the player, with a clear line of fire, without requiring a big turn. It makes the Dragon feel like it is tactically positioning itself rather than randomly walking around.

### Running EQS from a Behavior Tree

To use an EQS Query in a Behavior Tree:

1. Add a **Run EQS Query** task node
2. Set the Query Template to your EQS asset
3. Set the Blackboard Key to write the result to (e.g., `PatrolPoint` or a custom `FleePoint`)
4. The task succeeds if a valid point is found, fails if no points pass all filters
5. Follow it with a **Move To** task that reads the same Blackboard key

### EQS Debugging

Press the apostrophe key (`) during PIE to open the Gameplay Debugger, then select an AI character. The EQS tab shows all recent queries with colored dots:

- **Green dots**: High-scoring positions (good candidates)
- **Red dots**: Low-scoring or filtered-out positions
- **Blue dot**: The selected winner

This visualization is invaluable. If your Goblin is fleeing toward the player instead of away, the EQS debug view will show you exactly why (maybe the Distance test weight is inverted).

---

## Part 8: Building the Dragon Boss

The Dragon is Tabletop Quest's first boss encounter. It sits at the end of a dungeon, guarding a treasure hoard. Unlike regular enemies, the Dragon has **phases** that change its behavior as the fight progresses. Think of the Dragon as three enemies in one: a slow bruiser, an enraged fighter, and an aerial bomber.

### Dragon Boss Design

| Phase | HP Range | Behavior |
|-------|----------|----------|
| Phase 1: Grounded | 100% to 60% | Melee attacks (claw swipe, tail sweep), occasional breath attack. Slow, intimidating. |
| Phase 2: Enraged | 60% to 30% | Faster attacks, more frequent breath attacks, summons 2 Skeleton minions. Roar stagger. |
| Phase 3: Desperate | 30% to 0% | Takes flight (new movement pattern), dive bomb attacks, continuous breath sweeps. |

Each phase transition should feel like a mini-cutscene. The Dragon roars, the camera shakes, particles erupt, and the music shifts. This is where the cinematic camera system from Module 06 connects to AI.

### Dragon Blackboard

The Dragon needs additional Blackboard keys beyond the base enemy set:

| Key Name | Type | Purpose |
|----------|------|---------|
| `CurrentPhase` | Int | 1, 2, or 3 |
| `BreathCooldown` | Bool | Whether breath attack is on cooldown |
| `HasSummonedMinions` | Bool | Whether Phase 2 minions have been spawned |
| `IsFlying` | Bool | Whether the Dragon is airborne (Phase 3) |
| `DiveBombTarget` | Vector | Where the Dragon will dive to |
| `CircleAngle` | Float | Current angle in the aerial circle pattern |

Create `BB_DragonBoss` as a child Blackboard that inherits from `BB_EnemyBase` and adds these extra keys.

### Dragon Behavior Tree

```
BT_DragonBoss
  Selector (Priority)
    |
    |-- Sequence [PHASE 3: AERIAL]
    |     Decorator: Blackboard "CurrentPhase" == 3
    |     Selector
    |       |-- Sequence [DIVE BOMB]
    |       |     Decorator: Cooldown 8.0s
    |       |     Task: BTTask_TakeOff (if not already flying)
    |       |     Task: EQS_DragonDiveBombTarget (find impact point near player)
    |       |     Task: BTTask_DiveBomb (fly to height, then dive to target)
    |       |
    |       |-- Sequence [AERIAL BREATH SWEEP]
    |       |     Decorator: Cooldown 5.0s
    |       |     Task: BTTask_AerialBreathSweep (fly in arc, breathe fire along ground)
    |       |
    |       |-- Sequence [CIRCLE]
    |             Task: EQS_DragonCirclePoint (orbit above the arena)
    |             Task: BTTask_FlyTo (circle point)
    |
    |-- Sequence [PHASE 2: ENRAGED]
    |     Decorator: Blackboard "CurrentPhase" == 2
    |     Selector
    |       |-- Sequence [SUMMON MINIONS]
    |       |     Decorator: Blackboard "HasSummonedMinions" == false
    |       |     Task: BTTask_DragonRoar (animation + stagger nearby players)
    |       |     Task: BTTask_SummonMinions (spawn 2 Skeleton Warriors)
    |       |     Task: Set Blackboard "HasSummonedMinions" = true
    |       |
    |       |-- Sequence [BREATH ATTACK]
    |       |     Decorator: Blackboard "BreathCooldown" == false
    |       |     Decorator: Custom "Target in Breath Range" (distance 400 to 1200)
    |       |     Task: EQS_DragonBreathPosition (find position)
    |       |     Task: Move To (breath position)
    |       |     Task: BTTask_BreathAttack (cone damage)
    |       |     Task: Set Blackboard "BreathCooldown" = true
    |       |     Task: Wait 4.0s
    |       |     Task: Set Blackboard "BreathCooldown" = false
    |       |
    |       |-- Sequence [ENRAGED MELEE]
    |             Task: Move To (TargetActor, acceptable radius: 200)
    |             Task: Selector
    |               |-- BTTask_TailSweep (Decorator: Cooldown 3.0s)
    |               |-- BTTask_ClawSwipe
    |
    |-- Sequence [PHASE 1: GROUNDED]
          Decorator: Blackboard "CurrentPhase" == 1
          Selector
            |-- Sequence [BREATH ATTACK]
            |     Decorator: Blackboard "BreathCooldown" == false
            |     Decorator: Cooldown 10.0s (longer cooldown in Phase 1)
            |     Task: EQS_DragonBreathPosition
            |     Task: Move To (breath position)
            |     Task: BTTask_BreathAttack
            |     Task: Set Blackboard "BreathCooldown" = true
            |     Task: Wait 8.0s
            |     Task: Set Blackboard "BreathCooldown" = false
            |
            |-- Sequence [TAIL SWEEP]
            |     Decorator: Custom "Target Behind Me" (dot product check)
            |     Decorator: Cooldown 5.0s
            |     Task: BTTask_TailSweep
            |
            |-- Sequence [BASIC MELEE]
                  Task: Move To (TargetActor, acceptable radius: 250)
                  Task: Selector
                    |-- BTTask_ClawSwipe (Decorator: Cooldown 2.0s)
                    |-- BTTask_BasicBite
```

### Phase Transition Logic

Phase transitions happen when the Dragon's health crosses a threshold. You handle this in the Dragon's Pawn Blueprint, not in the Behavior Tree. The tree just reads the `CurrentPhase` value and reacts.

In the Dragon Pawn's damage handling:

1. Calculate `HealthPercent = CurrentHP / MaxHP`
2. Update the Blackboard `HealthPercent` key
3. Check thresholds:
   - If `HealthPercent <= 0.6` and `CurrentPhase == 1`: Set `CurrentPhase = 2`, play roar animation, increase movement speed by 30%, trigger screen shake
   - If `HealthPercent <= 0.3` and `CurrentPhase == 2`: Set `CurrentPhase = 3`, trigger takeoff sequence, change music track

The Behavior Tree automatically reacts because its decorators check `CurrentPhase`. When the phase changes, the tree's priority system naturally shifts to the correct branch on the next tick.

### Boss Arena Setup

The Dragon Boss fight happens in a specific arena. When the player enters:

1. A trigger volume activates the Dragon (sets `IsInCombat` and `TargetActor`)
2. Arena doors close (blocking retreat, classic boss room design)
3. A cinematic plays (Dragon wakes up, stretches wings, roars)
4. After the cinematic, combat begins with Phase 1

When the player defeats the Dragon:

1. Stop the Behavior Tree
2. Play death cinematic (Dragon crashes, treasure hoard is revealed)
3. Open arena doors
4. Spawn loot

This trigger-based activation means the Dragon does not need patrol or investigation behaviors. It goes straight from idle (sleeping) to Phase 1 combat.

### The Breath Attack in Detail

The breath attack is the Dragon's signature ability. Here is how to build it:

1. **Positioning**: EQS finds the ideal spot (800-1200 units from player, clear line of sight)
2. **Wind-up**: Dragon rears back, particles gather at mouth (1.5 second tell, so players can dodge)
3. **Execution**: Cone-shaped damage zone extends from the Dragon's mouth. Use a collision box that sweeps forward over 2 seconds.
4. **Damage**: Area-of-effect, deals fire damage per tick (every 0.3 seconds) to anyone in the cone. Burns the ground for 5 seconds (lingering damage zone).
5. **Recovery**: Dragon pauses for 1 second after breathing (punish window for the player)

The wind-up telegraph is critical for fair gameplay. Players need time to see the breath coming and dodge. Without the tell, the breath attack feels unfair. With it, dodging the breath and punishing during recovery feels skillful and rewarding.

---

## Part 9: Navigation and Pathfinding

### NavMesh Basics

All AI movement in UE5 relies on the Navigation Mesh (NavMesh). The NavMesh is an invisible layer painted over your level geometry that tells AI characters where they can and cannot walk. Without a NavMesh, the Move To task has no paths to follow.

To add a NavMesh:

1. Place a **NavMesh Bounds Volume** in your level
2. Scale it to cover the entire playable area
3. Press **P** to visualize the NavMesh (green = walkable, red/absent = blocked)

The NavMesh automatically updates when you move or add geometry. Doors, walls, ramps, and stairs are all factored in.

### NavMesh for Tabletop Quest

For your game, you need NavMesh in two contexts:

1. **Overworld exploration**: Large, open NavMesh covering terrain, towns, and paths
2. **Dungeon interiors**: Tight NavMesh covering corridors, rooms, and doorways

Key settings to configure:

| Setting | Value | Why |
|---------|-------|-----|
| Agent Radius | 40 | Standard humanoid (Goblins, Skeletons). Slightly smaller than character capsule so AI does not get stuck on corners. |
| Agent Height | 180 | Standing height |
| Cell Size | 10 | Finer detail for dungeon corridors (default 19 is too coarse for narrow passages) |
| Cell Height | 5 | Vertical precision for stairs and ramps |
| Max Slope | 45 | Prevent AI from walking up cliff faces |

For the Dragon Boss, you need a separate **Nav Agent** with a larger radius (120) and height (300). Add this in Project Settings > Navigation System > Supported Agents. The Dragon's NavMesh will exclude tight corridors, which is correct since the Dragon should not be pathfinding through hallways.

### Dynamic NavMesh Obstacles

Some objects in Tabletop Quest block pathfinding dynamically:

- Doors that open and close
- Destructible walls
- Player-placed barricades (if you add that mechanic)
- A boulder trap that rolls and blocks a corridor

Use **Nav Modifier Volumes** or the **Dynamic Obstacle** property on static meshes to handle these. When a door opens, its nav obstacle is removed, and the NavMesh updates to include the new path.

### Crowd Avoidance (RVO)

When multiple enemies chase the player simultaneously (e.g., a group of Goblins), they need to avoid bumping into each other. UE5 has an **RVO Avoidance** system built into the Character Movement Component:

1. On each enemy's Character Movement Component, enable **Use RVO Avoidance**
2. Set **Avoidance Weight** (0.5 for standard enemies, 1.0 for the Dragon so smaller enemies dodge around it)
3. Set **Avoidance Group** and **Groups to Avoid** (enemies avoid each other but not the player)

Without avoidance, a group of 5 Goblins trying to reach the player will stack on top of each other, fighting for the same position. With avoidance, they spread out and approach from slightly different angles. Much more natural and visually interesting.

### Nav Links for Special Movement

Some pathfinding scenarios need special handling:

- **Jumping across a gap**: Place a Nav Link Proxy between two platforms. AI will use the link to cross, playing a jump animation.
- **Dropping off a ledge**: One-way Nav Links let AI drop down but not climb back up.
- **Ladders**: Custom Nav Links with a climb animation.

For the Tabletop Quest dungeon, you will want jump links across broken bridges and drop links for ledges. These make dungeon traversal feel natural for AI characters while keeping the navigation system intact.

---

## Part 10: Python Automation for AI

### Why Automate AI Setup?

Building AI for Tabletop Quest involves a lot of repetitive setup. Each enemy type needs a Pawn Blueprint, an AI Controller assignment, a Blackboard (or extension of the base one), a Behavior Tree, Perception settings, EQS Queries, and custom tasks. For 20+ enemy types (the game design doc calls for this), that is hundreds of assets to configure.

UE5's Python API can automate the repetitive parts. And Claude can write these automation scripts for you.

### UE5 Python Scripting Setup

UE5 has a built-in Python editor accessible via **Window > Developer Tools > Output Log**, then switching the console dropdown from "Cmd" to "Python." You can also create Python scripts in your project's `/Content/Python/` folder and run them from the editor.

To enable Python scripting:

1. Go to **Edit > Plugins**
2. Enable **Python Editor Script Plugin** (under Scripting)
3. Restart the editor

### Batch-Creating Enemy Assets

Here is a Python script that creates the boilerplate folder structure for a new enemy type:

```python
import unreal
import os

def setup_enemy_type(enemy_name, sight_radius=1500, hearing_range=800, has_patrol=True):
    """
    Creates the folder structure and base assets for a new enemy type.
    """
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    base_path = f"/Game/Enemies/{enemy_name}"

    # Create folder structure
    unreal.EditorAssetLibrary.make_directory(base_path)
    unreal.EditorAssetLibrary.make_directory(f"{base_path}/AI")
    unreal.EditorAssetLibrary.make_directory(f"{base_path}/Animations")
    unreal.EditorAssetLibrary.make_directory(f"{base_path}/VFX")

    # Log the configuration for manual setup
    unreal.log(f"Created enemy structure for: {enemy_name}")
    unreal.log(f"  Sight Radius: {sight_radius}")
    unreal.log(f"  Hearing Range: {hearing_range}")
    unreal.log(f"  Has Patrol: {has_patrol}")
    unreal.log(f"  TODO: Create BT_{enemy_name} in {base_path}/AI/")
    unreal.log(f"  TODO: Create BP_{enemy_name} Pawn in {base_path}/")
    unreal.log(f"  TODO: Assign AI Controller and Behavior Tree")

# Create all Act 1 enemies in one batch
enemies = [
    {"name": "GoblinScout",    "sight": 1500, "hearing": 800,  "patrol": True},
    {"name": "GoblinArcher",   "sight": 2000, "hearing": 800,  "patrol": True},
    {"name": "GoblinShaman",   "sight": 1200, "hearing": 1000, "patrol": False},
    {"name": "GoblinBrute",    "sight": 1200, "hearing": 600,  "patrol": True},
    {"name": "SkeletonWarrior","sight": 1200, "hearing": 600,  "patrol": False},
    {"name": "SkeletonArcher", "sight": 2000, "hearing": 600,  "patrol": False},
    {"name": "DungeonRat",     "sight": 800,  "hearing": 1500, "patrol": True},
    {"name": "CaveBat",        "sight": 400,  "hearing": 2000, "patrol": True},
]

for enemy in enemies:
    setup_enemy_type(enemy["name"], enemy["sight"], enemy["hearing"], enemy["patrol"])

unreal.log(f"Batch created {len(enemies)} enemy type structures.")
```

### Generating Patrol Paths from Data

If you define patrol routes in a JSON file, a Python script can read that data and create placement markers:

```python
import unreal
import json

def create_patrol_data(json_path):
    """
    Reads patrol path data from a JSON file and logs placement instructions.
    Useful for level design pipeline.
    """
    with open(json_path, 'r') as f:
        data = json.load(f)

    for path_data in data["patrol_paths"]:
        name = path_data["name"]
        points = path_data["points"]
        unreal.log(f"Patrol path '{name}': {len(points)} points")
        for i, pt in enumerate(points):
            unreal.log(f"  Point {i}: ({pt[0]}, {pt[1]}, {pt[2]})")
```

The JSON data file:

```json
{
    "patrol_paths": [
        {
            "name": "ForestPath_Goblin01",
            "points": [
                [1200, 3400, 0],
                [1800, 3200, 0],
                [2200, 3600, 0],
                [1600, 3800, 0]
            ]
        },
        {
            "name": "DungeonCorridor_Skeleton01",
            "points": [
                [500, 100, -200],
                [500, 800, -200]
            ]
        }
    ]
}
```

### Claude as Your AI Design Assistant

Here is where the "Claude writes 80% of the code" philosophy really shines. When you need a new enemy type, describe the behavior in plain English:

> "I need a Goblin Shaman. It stays behind melee Goblins, heals them when they drop below 50% HP, casts a poison bolt at the player every 8 seconds. If any ally is within 500 units, it buffs their damage. If no allies are alive, it panics and runs."

Claude can generate:
- The Behavior Tree structure (which you recreate in the UE5 editor)
- The custom task pseudo-code (which you implement in Blueprints)
- The EQS queries (positioning logic for staying behind allies)
- The Blackboard keys needed
- The perception settings
- A Python script to batch-create the assets

You translate Claude's output into UE5 assets. This workflow lets you prototype enemy behavior 5x faster than designing from scratch.

---

## Part 11: Debugging AI

### The AI Debugging Tools

UE5 has excellent AI debugging tools. Open them during Play-In-Editor (PIE):

**Gameplay Debugger** (press apostrophe key during PIE):
- Shows the currently running Behavior Tree with active nodes highlighted
- Displays Blackboard values in real-time
- Shows the NavMesh under the selected AI
- Shows Perception stimuli (green = seen, yellow = heard)
- Shows EQS query results (colored dots showing scored positions)
- Cycle between AI characters with the number keys

**Visual Logger** (Window > Developer Tools > Visual Logger):
- Records AI behavior over time
- Replay any moment to see what the AI was thinking
- Essential for debugging "why did the Goblin do that?" moments
- Can record custom data from your AI tasks

### Common AI Bugs and Fixes

**Bug: Enemy stands still and does nothing**
- Check: Is the AI Controller assigned on the Pawn? (AI Controller Class in the Pawn's defaults)
- Check: Is Run Behavior Tree called in the Controller's BeginPlay?
- Check: Is there a NavMesh covering the enemy's location? (Press P to visualize)
- Check: Does the Behavior Tree have at least one branch with passing decorators?
- Check: Is the Blackboard initialized before the tree runs?

**Bug: Enemy jitters or vibrates in place**
- Check: Is the Move To acceptable radius too small? The enemy reaches the radius, the task succeeds, the tree restarts, and it tries to move again. Set acceptable radius to at least 50.
- Check: Are two Behavior Tree branches fighting for control? One says "move here," the other says "move there," and they alternate every tick.
- Check: Is RVO avoidance pushing the enemy away from its target continuously?

**Bug: Enemy does not detect the player**
- Check: Does the player character have an **AI Perception Stimuli Source** component?
- Check: Is Auto Register as Source enabled on that component?
- Check: Are the sight/hearing configs added to the AI Perception Component?
- Check: Is the affiliation system set up? (enemies might think the player is friendly)

**Bug: Enemy walks through walls**
- Check: Is there a NavMesh in this area? Press P to see.
- Check: Are the walls set as navigation obstacles?
- Check: Is the NavMesh Bounds Volume large enough to cover this area?

**Bug: EQS query returns no results**
- Check: Visualize the query in the Gameplay Debugger. If no dots appear, the generator is misconfigured.
- Check: Are your filter tests too strict? Temporarily remove filters one at a time to find which one eliminates all points.
- Check: Is the generator radius large enough to produce points within the NavMesh?

**Bug: Multiple enemies overlap when chasing the player**
- Check: Enable RVO Avoidance on all enemies
- Check: Set different avoidance groups for different enemy sizes
- Check: The acceptable radius on Move To should vary (not all enemies trying to reach the exact same point)

---

## Part 12: Performance and Scalability

### AI Performance Budget

AI is one of the most CPU-intensive systems in a game. For Tabletop Quest, keep these rules:

**Behavior Tree tick interval**: Do not tick every frame. Set the tick interval to 0.2-0.5 seconds for standard enemies. The player will not notice the difference between a Goblin that makes decisions 60 times per second vs. 5 times per second. Boss enemies can tick faster (0.1s) for more responsive behavior.

**EQS query frequency**: EQS queries are expensive. Use Cooldown decorators to prevent queries from running every tick. A flee query every 2 seconds is fine. A breath position query every 3 seconds is fine.

**Perception max age**: Short max age (3-5 seconds) means the AI forgets stimuli quickly, reducing memory usage.

**Stagger enemy activation**: If you have 20 enemies in an area, do not activate all their AI simultaneously. Use trigger volumes to activate enemies only when the player is nearby. Enemies far from the player should be dormant (no ticking Behavior Tree, no Perception processing).

**AI LOD (Level of Detail)**: Just like rendering LOD, you can create AI LOD. Enemies far from the player run a simplified Behavior Tree (just idle animation, no perception). When the player gets closer, swap to the full tree. This is especially important for the open world areas of Tabletop Quest.

### Tabletop Quest AI Budget

| Scenario | Active AI Count | Budget |
|----------|----------------|--------|
| Forest patrol encounter | 4-6 Goblins | 1-2ms per frame |
| Dungeon corridor | 2-3 Skeletons | 0.5-1ms per frame |
| Dragon Boss fight | 1 Dragon + 2 Skeleton minions | 1-2ms per frame |
| Town NPCs (no combat) | 10-15 idle NPCs | 0.5ms per frame (simplified trees) |

Total AI budget: aim for under 3ms per frame. That leaves plenty of headroom for rendering, physics, and the local LLM when you add the AI Dungeon Master in later phases.

---

## Part 13: Connecting AI to the Dual Combat System

### How AI Differs Between Turn-Based and Real-Time

Tabletop Quest's dual combat system means your AI needs to work in both modes. The same Goblin Scout needs to fight differently depending on whether the player is in turn-based or real-time combat.

**Turn-Based Mode**:
- AI takes a full turn: Move + Action + Bonus Action
- Decisions are deliberate (the tree evaluates once per turn, not continuously)
- Movement is on the hex grid
- Abilities use action economy

**Real-Time Mode**:
- AI acts continuously (the tree ticks at regular intervals)
- Movement is free-form (no grid)
- Abilities use cooldowns instead of action economy

### Implementation Approach

Create a Blackboard key: `CombatMode` (Enum: TurnBased, RealTime)

At the top level of each combat Behavior Tree, add a Selector that branches based on `CombatMode`:

```
Sequence [COMBAT]
  Decorator: Blackboard "IsInCombat" == true
  Selector
    |-- Sequence [TURN-BASED COMBAT]
    |     Decorator: Blackboard "CombatMode" == TurnBased
    |     Task: BTTask_TurnBasedTurn (move on grid + use ability)
    |
    |-- Sequence [REAL-TIME COMBAT]
          Decorator: Blackboard "CombatMode" == RealTime
          (... existing real-time combat behavior ...)
```

The `BTTask_TurnBasedTurn` task handles a complete turn:

1. Evaluate the best move position (using EQS on the hex grid)
2. Move to that hex
3. Evaluate the best action (attack, ability, or pass)
4. Execute the action
5. Signal turn complete

This way, the same enemy character seamlessly switches between combat modes, just like the player does.

---

## Summary

You now have the complete AI toolkit for Tabletop Quest:

| System | Purpose | Key Asset Type |
|--------|---------|---------------|
| AI Controller | Connects brain to body | Blueprint (AIController) |
| Blackboard | AI memory (key-value store) | Blackboard Data Asset |
| Behavior Tree | Decision-making logic | Behavior Tree Asset |
| AI Perception | Sight, hearing, damage sensing | Component on AI Controller |
| EQS | Spatial reasoning (where to go?) | Environment Query Asset |
| NavMesh | Pathfinding (how to get there?) | NavMesh Bounds Volume |
| Custom BT Tasks | Enemy-specific actions | Blueprint (BTTask_BlueprintBase) |
| Custom Decorators | Enemy-specific conditions | Blueprint (BTDecorator_BlueprintBase) |
| Services | Background monitoring | Blueprint (BTService_BlueprintBase) |

You built three distinct enemies:
- **Goblin Scout**: Patrol, alert allies, fight, flee. Social, cowardly, smart in groups.
- **Skeleton Warrior**: Guard post, chase within territory, shield block, never flee. Solitary, relentless, predictable.
- **Dragon Boss**: Three combat phases, breath attacks, minion summoning, aerial combat. Complex, cinematic, dangerous.

Every enemy in Tabletop Quest will be built from these same building blocks. The difference between a mindless rat and a tactical dragon is not the system. It is the complexity of the Behavior Tree and the cleverness of the EQS queries. Start simple, add complexity, then go big. That is how you build an army.
