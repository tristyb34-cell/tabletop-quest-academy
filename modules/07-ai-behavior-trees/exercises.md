# Module 07: Exercises - Enemy AI

## Exercise 1: Build the Goblin Scout Patrol System

**Goal:** Create a Goblin enemy that patrols between waypoints in a forest clearing.

**What you are building:** The most basic Goblin behavior. It walks a route, pauses at each point, then continues. This is the foundation for all Goblin AI in Tabletop Quest.

**Steps:**

1. Create a new level with a flat terrain and some tree meshes scattered around (your forest clearing)
2. Place a **NavMesh Bounds Volume** covering the entire area. Press P to verify the green NavMesh covers the walkable surface.
3. Create a Blueprint Actor called `BP_PatrolPath` with a Spline Component. Place it in the level and shape the spline into a loop with 4 points around the clearing.
4. Create a Character Blueprint called `BP_GoblinScout`. Use any humanoid mesh (the UE5 mannequin is fine for now).
5. Create a Blackboard `BB_EnemyBase` with keys: `PatrolPoint` (Vector), `HomeLocation` (Vector), `PatrolIndex` (Int)
6. Create an AI Controller `BP_EnemyAIController_Base` that initializes the Blackboard and runs a Behavior Tree on BeginPlay. Set `HomeLocation` to the Pawn's spawn position.
7. Create a custom BT Task `BTTask_GetNextPatrolPoint` that reads the patrol spline, gets the point at `PatrolIndex`, writes it to `PatrolPoint`, then increments `PatrolIndex` (wrapping back to 0 at the end).
8. Create a Behavior Tree `BT_GoblinScout` with a single Sequence: GetNextPatrolPoint > Move To (PatrolPoint) > Wait (random 2-5 seconds)
9. Set the `BP_GoblinScout` AI Controller Class to your controller, add a `PatrolPath` variable, and assign the spline actor in the level.
10. Play and verify the Goblin walks the patrol loop.

**Success criteria:** The Goblin continuously walks between 4 points, pausing at each one before moving to the next.

**Bonus:** Add a head-turn animation or random look-around during the Wait period.

---

## Exercise 2: Add AI Perception (Sight and Hearing)

**Goal:** Make the Goblin Scout detect the player using sight and hearing.

**What you are building:** The sensory system that turns a blindly patrolling Goblin into one that can spot you across the clearing or hear you breaking a crate behind a tree.

**Steps:**

1. On `BP_EnemyAIController_Base`, add an **AI Perception Component**
2. Add **AI Sight Config**: Sight Radius 1500, Lose Sight Radius 2000, Peripheral Vision Half Angle 45, Auto Success Range 200, Max Age 5.0
3. Add **AI Hearing Config**: Hearing Range 800
4. Set Dominant Sense to Sight
5. On your player character Blueprint, add an **AI Perception Stimuli Source Component**. Enable Auto Register for Sight. Enable Auto Register for Hearing.
6. Add Blackboard keys to `BB_EnemyBase`: `TargetActor` (Object), `TargetLocation` (Vector), `IsInCombat` (Bool), `AlertLevel` (Int)
7. In the AI Controller, bind to **On Target Perception Updated**:
   - If sight detects a hostile actor: Set `TargetActor`, `IsInCombat = true`, `AlertLevel = 3`
   - If hearing detects a noise: Set `TargetLocation` to stimulus location, `AlertLevel = 1`
   - If target is lost from sight: Set `TargetLocation` to last known position, clear `TargetActor`
8. Update the Behavior Tree to add an Investigate branch (priority above Patrol):
   - Decorator: `AlertLevel > 0`
   - Sequence: Move To (TargetLocation) > BTTask_LookAround > Set AlertLevel = 0
9. Play and walk toward the Goblin. It should spot you and move to investigate.

**Success criteria:** The Goblin detects the player via sight (when in front) and hearing (when making noise). It moves to investigate noise sources.

**Testing tip:** Use the Gameplay Debugger (apostrophe key) to see the perception cones and stimulus markers in real time.

---

## Exercise 3: Build the Combat and Flee Behavior

**Goal:** Make the Goblin fight the player and flee when health is low.

**What you are building:** The Goblin's full combat loop: chase, attack, take damage, and eventually run away when it is losing the fight.

**Steps:**

1. Add a Blackboard key: `ShouldFlee` (Bool), `HealthPercent` (Float)
2. Create a custom BT Task `BTTask_MeleeAttack`:
   - Check if target is within 150 units
   - Play an attack animation montage
   - On the animation notify, apply damage to the target using `Apply Damage`
   - Finish with Success
3. Create a BT Service `BTService_CheckHealth`:
   - Tick interval 0.5 seconds
   - Get the Pawn's current HP / max HP ratio
   - Write it to `HealthPercent`
   - If `HealthPercent < 0.25`, set `ShouldFlee = true`
4. Add a Combat branch to the Behavior Tree (priority above Investigate):
   - Decorator: `IsInCombat == true`
   - Attach the `BTService_CheckHealth` Service to this branch
   - Sequence: Move To (TargetActor, acceptable radius 150) > BTTask_MeleeAttack > Wait 0.5s
5. Add a Flee branch (highest priority):
   - Decorator: `ShouldFlee == true`
   - For now, use a simple flee: Get Random Reachable Point in Radius (1000 units, away from target) > Move To > Wait 3s > Set ShouldFlee = false
6. Give the player a way to deal damage (a simple attack key that applies damage to the nearest enemy)
7. Give the Goblin 100 HP. Play, engage in combat, and hit the Goblin until it flees.

**Success criteria:** The Goblin chases and attacks the player. When its health drops below 25%, it runs away.

---

## Exercise 4: Build the Goblin Alert System

**Goal:** Create a camp of 3 Goblins where one spotting the player alerts the others.

**What you are building:** The social AI behavior that makes Goblin encounters feel dangerous. One scout spots you, runs to its friends, and suddenly you are fighting three enemies instead of one.

**Steps:**

1. Add a Blackboard key: `HasAlertedAllies` (Bool, default false)
2. Create a custom BT Task `BTTask_AlertNearbyEnemies`:
   - Get all actors within 500 units with tag "Enemy"
   - For each, get their AI Controller
   - Set their Blackboard `TargetActor` to the alerting Goblin's target
   - Set their `AlertLevel = 3`, `IsInCombat = true`
   - Finish with Success
3. In the Combat branch of `BT_GoblinScout`, add an Alert Allies sub-branch (higher priority than melee):
   - Decorator: `HasAlertedAllies == false`
   - Sequence: EQS find nearest ally > Move To ally > BTTask_AlertNearbyEnemies > Set `HasAlertedAllies = true`
4. Create a simple EQS Query `EQS_FindNearestAlly`: Generator = Actors of Class (your Goblin class), Test = Distance (closest wins)
5. Place 3 Goblins in the level: one on patrol, two idle near a campfire
6. Tag all Goblins with "Enemy"
7. Play, let the patrolling Goblin spot you, and watch it run to alert the others

**Success criteria:** When one Goblin spots you, it runs to the nearest ally before fighting. The alerted Goblins immediately turn hostile and join the fight.

---

## Exercise 5: Build the Skeleton Warrior with Territory

**Goal:** Create a Skeleton that guards a dungeon doorway and only chases players within its territory.

**What you are building:** The Skeleton's territory-based AI. It is relentless within its zone but will not chase you across the entire dungeon.

**Steps:**

1. Create a simple dungeon layout: a corridor with a doorway and a room on each side
2. Create a Character Blueprint `BP_SkeletonWarrior` with a different mesh or color from the Goblin
3. Create a Behavior Tree `BT_SkeletonWarrior` with these branches (in priority order):
   - **Return to Post**: Decorator `IsInCombat == true` AND custom decorator "target distance from HomeLocation > 2000". Tasks: Set IsInCombat = false, clear TargetActor, Move To HomeLocation.
   - **Combat**: Decorator `IsInCombat == true`. Tasks: Move To TargetActor > BTTask_MeleeAttack > Wait 0.8s
   - **Investigate**: Decorator `AlertLevel > 0`. Tasks: Turn toward TargetLocation, Move To, Wait, Reset AlertLevel.
   - **Guard**: Tasks: Idle animation, Wait 5 seconds.
4. Create a custom decorator `BTDecorator_IsTargetOutOfTerritory` that checks the distance between TargetActor and HomeLocation against a configurable radius.
5. Place the Skeleton at a doorway. Set its HomeLocation.
6. Play, lure the Skeleton past its territory boundary, and verify it stops chasing and returns.

**Success criteria:** The Skeleton aggressively chases you within 2000 units of its post but breaks off and walks home when you leave its territory.

**Bonus:** Add the Shield Block mechanic. Create a decorator that checks if the player is playing an attack montage, and have the Skeleton block with a 3-second cooldown.

---

## Exercise 6: Build an EQS Flee Query

**Goal:** Replace the simple flee behavior with an intelligent EQS-powered flee that finds cover.

**What you are building:** An EQS Query that makes the Goblin run to smart positions instead of random ones, preferring spots that break line of sight with the player.

**Steps:**

1. Create an EQS Query `EQS_FindFleePoint`
2. **Generator**: Points on a Grid, half-size 1000, spacing 200, around the Querier
3. **Test 1 (Distance from Player)**: Score test, farther from TargetActor = higher score. Weight 1.0.
4. **Test 2 (Distance to Home)**: Score test, closer to HomeLocation = higher score. Weight 0.5.
5. **Test 3 (Pathfinding)**: Filter test, only reachable points pass.
6. **Test 4 (Trace to Player)**: Score test, points with no line of sight to TargetActor score higher (the Goblin prefers hiding behind obstacles). Weight 0.3.
7. In the Goblin's Flee branch, replace the random flee with: Run EQS Query (EQS_FindFleePoint, write to FleePoint) > Move To (FleePoint)
8. Place some obstacles (rocks, walls, trees) in the level
9. Play, reduce the Goblin's health, and observe where it flees to

**Success criteria:** The Goblin flees to a position that is far from the player, reachable, and ideally behind cover. Visualize the EQS query with the Gameplay Debugger to see scored points.

---

## Exercise 7: Build the Dragon Boss (Phase 1 Only)

**Goal:** Create a Dragon Boss with Phase 1 behavior: melee attacks and a breath attack.

**What you are building:** The first phase of the Dragon Boss fight. Slow, powerful, intimidating. This is the foundation for the full three-phase fight.

**Steps:**

1. Create a large arena room (a circular space with high walls)
2. Create `BP_DragonBoss` with a large mesh (scale up the mannequin 3x for now) and a large capsule collider
3. Create `BB_DragonBoss` inheriting from `BB_EnemyBase`. Add keys: `CurrentPhase` (Int, default 1), `BreathCooldown` (Bool, default false)
4. Create an EQS Query `EQS_DragonBreathPosition`: Ring generator (inner 800, outer 1200 around TargetActor), Trace test (must see target), Pathfinding test (reachable)
5. Create `BTTask_BreathAttack`:
   - Play a wind-up animation (1.5 seconds)
   - Spawn a cone-shaped damage volume in front of the Dragon
   - Apply fire damage to all actors in the cone
   - Destroy the damage volume after 2 seconds
   - Set `BreathCooldown = true`
6. Create `BTTask_ClawSwipe`: Play attack animation, apply damage at notify frame
7. Create `BT_DragonBoss` with Phase 1 only:
   - Breath Attack branch: Decorator `BreathCooldown == false`, Cooldown 10s. Run EQS, Move To position, BreathAttack, Wait 8s, Set BreathCooldown = false.
   - Melee branch: Move To target (radius 250), ClawSwipe, Wait 1.5s.
8. Place a trigger volume at the arena entrance that sets the Dragon's `IsInCombat` and `TargetActor`
9. Create a separate Nav Agent for the Dragon (radius 120, height 300) and rebuild NavMesh
10. Play, enter the arena, and fight the Dragon

**Success criteria:** The Dragon attacks with claws at close range and uses a breath attack when the player is at medium range. The breath has a visible wind-up that gives the player time to dodge.

---

## Exercise 8: Add Phase Transitions to the Dragon

**Goal:** Extend the Dragon Boss to support all three phases with transitions.

**What you are building:** The complete Dragon encounter with phase transitions, minion summoning, and aerial combat. This is the capstone exercise for the module.

**Steps:**

1. Add Blackboard keys: `HasSummonedMinions` (Bool), `IsFlying` (Bool), `DiveBombTarget` (Vector)
2. In the Dragon Pawn's damage handler:
   - Calculate health percentage
   - At 60% HP: Set `CurrentPhase = 2`, play roar animation, increase movement speed
   - At 30% HP: Set `CurrentPhase = 3`, trigger takeoff
3. Add Phase 2 branch to `BT_DragonBoss`:
   - Decorator: `CurrentPhase == 2`
   - Summon sub-branch: If `HasSummonedMinions == false`, play roar, spawn 2 Skeleton Warriors at predefined arena positions, set `HasSummonedMinions = true`
   - Breath sub-branch: Same as Phase 1 but with 4s cooldown instead of 10s (more aggressive)
   - Melee sub-branch: Alternate between ClawSwipe and a new TailSweep (360-degree area attack)
4. Add Phase 3 branch:
   - Decorator: `CurrentPhase == 3`
   - Create `BTTask_TakeOff`: Elevate the Dragon 500 units, play wing animation, set `IsFlying = true`
   - Create `BTTask_DiveBomb`: Move to high position above player, then lerp rapidly downward, apply large AoE damage at landing point
   - Circle sub-branch: The Dragon orbits the arena at altitude when not attacking
5. Add phase transition VFX: screen shake, particle burst, camera cut
6. Test the full fight: engage Dragon, deal damage through all three phases

**Success criteria:** The Dragon transitions from grounded melee (Phase 1) to enraged with minions (Phase 2) to aerial with dive bombs (Phase 3). Each transition feels impactful with visual and audio feedback.

**Stretch goal:** Add a death sequence. When the Dragon reaches 0 HP, it crashes from the sky (if airborne), plays a death animation, and spawns a treasure chest.
