# Module 7: Exercises - AI and Behavior Trees

## Exercise 1: Basic AI Controller and Behavior Tree

**Objective:** Create an AI character that stands idle, waits a few seconds, then plays a wave animation, and repeats.

**Steps:**

1. Create a new Blueprint class based on `Character`. Name it `BP_BasicAI`. Give it a skeletal mesh (use the UE5 Mannequin or any humanoid mesh you have).

2. Create a new AI Controller Blueprint: `BP_BasicAIController`. In the Class Defaults, leave everything at default for now.

3. Open `BP_BasicAI` and set the **AI Controller Class** to `BP_BasicAIController`.

4. Create a new Blackboard asset: `BB_BasicAI`. Add one key:
   - `IdleCount` (Int): Tracks how many times the AI has waved.

5. Create a new Behavior Tree asset: `BT_BasicAI`. Set its Blackboard to `BB_BasicAI`.

6. In `BP_BasicAIController`, on **Event BeginPlay**, add a **Run Behavior Tree** node and select `BT_BasicAI`.

7. Build the Behavior Tree:
   ```
   Root
     Sequence
       BTTask_Wait (3 seconds)
       BTTask_PlayAnimation (Wave montage)
       BTTask_Wait (2 seconds)
   ```
   Use the built-in Wait and Play Animation tasks. Loop the sequence using a **Loop** decorator on the Sequence node.

8. Place `BP_BasicAI` in your level and press Play. The AI should wait, wave, wait, and repeat.

**Bonus Challenge:** Create a custom task `BTTask_IncrementCounter` that reads `IdleCount` from the Blackboard, increments it by 1, and writes it back. Add a decorator that stops the loop after 5 waves using a Blackboard condition on `IdleCount`.

**What You Learn:** How AI Controllers, Behavior Trees, and Blackboards connect together. This is the foundation for everything that follows.

---

## Exercise 2: Patrol Behavior with Navigation

**Objective:** Create an AI that patrols between waypoints in a level.

**Steps:**

1. Create a new actor Blueprint `BP_PatrolPoint`. Give it a Billboard or Sphere component so you can see it in the editor. Place 4 of them around your level in a rough square pattern.

2. Open the Blackboard `BB_BasicAI` (or create a new one called `BB_Patrol`). Add these keys:
   - `PatrolTarget` (Vector): The location to walk toward
   - `PatrolIndex` (Int): Which waypoint the AI is heading to
   - `PatrolPoints` (leave this; we will handle the array in the controller)

3. In `BP_BasicAIController`, create an array variable `PatrolPoints` of type Actor Reference. Set it to **Instance Editable** so you can assign waypoints per AI instance.

4. Create a custom Behavior Tree task: `BTTask_GetNextPatrolPoint`.
   - Read `PatrolIndex` from the Blackboard
   - Get the actor at that index from the controller's `PatrolPoints` array
   - Write the actor's location to the `PatrolTarget` Blackboard key
   - Increment `PatrolIndex` (wrap around to 0 when it exceeds the array length)
   - Return Succeeded

5. Build the Behavior Tree:
   ```
   Root
     Sequence [Loop decorator]
       BTTask_GetNextPatrolPoint
       BTTask_MoveTo (PatrolTarget)
       BTTask_Wait (1-3 seconds, random)
   ```

6. Make sure your level has a **NavMesh Bounds Volume** that covers the patrol area. You should see the green NavMesh overlay when you press P in the editor.

7. Place the AI in the level, assign the 4 patrol point actors to its controller's array, and press Play. The AI should walk between points in order, pausing briefly at each one.

**Bonus Challenge:** Add a random element. Instead of visiting points in order, create a `BTTask_GetRandomPatrolPoint` that picks a random point from the array (but not the same point twice in a row).

**What You Learn:** NavMesh navigation, custom Behavior Tree tasks, reading and writing Blackboard data, and patrol loops.

---

## Exercise 3: Combat Behavior (Detect, Attack, Retreat)

**Objective:** Build an AI that patrols normally but switches to combat when it detects the player, attacks within range, and retreats when health is low.

**Steps:**

1. Open `BP_BasicAIController` (or create `BP_CombatAIController`). Add an **AI Perception Component**.
   - Add a **Sight Config** sense:
     - Sight Radius: 1500
     - Lose Sight Radius: 2000
     - Peripheral Vision Half Angle: 60
     - Detection by Affiliation: check Enemies

2. Update the Blackboard with these keys:
   - `TargetActor` (Object, base class: Actor)
   - `HasTarget` (Bool)
   - `HealthPercent` (Float, default 1.0)
   - `PatrolTarget` (Vector)

3. In the AI Controller, bind the **On Perception Updated** event:
   - When an actor is sensed (sight, successfully detected): set `TargetActor` and set `HasTarget` to true
   - When sight is lost: set `HasTarget` to false (optionally on a 5-second delay)

4. Create a Service `BTService_UpdateHealth`:
   - Every 0.5 seconds, read the Pawn's current health, divide by max health, write to `HealthPercent`

5. Create custom tasks:
   - `BTTask_BasicAttack`: Play an attack animation, apply damage to the target (use a simple "Apply Damage" call for now; we will integrate GAS later). Return Succeeded when the animation finishes.
   - `BTTask_FindRetreatPoint`: Pick a point 1000 units away from the target (opposite direction). Write it to a `RetreatLocation` Blackboard key.

6. Build the Behavior Tree:
   ```
   Root
     Selector
       [Decorator: BB "HasTarget" == true, Observer Aborts: Lower Priority]
       Sequence (COMBAT)
         [Service: BTService_UpdateHealth, interval 0.5s]
         Selector
           [Decorator: BB "HealthPercent" < 0.2, Observer Aborts: Self]
           Sequence (RETREAT)
             BTTask_FindRetreatPoint
             BTTask_MoveTo (RetreatLocation)

           [Decorator: Distance to TargetActor < 200]
           Sequence (ATTACK)
             BTTask_RotateToFace (TargetActor)
             BTTask_BasicAttack
             BTTask_Wait (1.0s cooldown)

           Sequence (CHASE)
             BTTask_MoveTo (TargetActor)

       Sequence (PATROL)
         BTTask_GetNextPatrolPoint
         BTTask_MoveTo (PatrolTarget)
         BTTask_Wait (2s)
   ```

7. Test: The AI should patrol, notice the player when they enter sight range, chase and attack, and flee when health drops below 20%.

**Bonus Challenge:** Add a "search" behavior. When the AI loses sight of the player, instead of immediately returning to patrol, have it move to the player's last known position and look around for 5 seconds before giving up.

**What You Learn:** AI Perception, reactive behavior switching with Observer Aborts, health-based decision branching, and layered combat logic.

---

## Exercise 4: Behavior Presets (Aggressive, Defensive, Support)

**Objective:** Create a single Behavior Tree that changes its behavior based on a preset value, allowing the player to switch an AI companion's fighting style.

**Steps:**

1. Create an Enum (or use a Name key) in the Blackboard called `BehaviorPreset` with values: Aggressive, Defensive, Support.

2. Design three sub-trees (or three major branches within one tree) that implement different styles:

   **Aggressive Branch (when `BehaviorPreset` == Aggressive):**
   - Always target the nearest enemy
   - Close distance quickly
   - Use the highest-damage ability available
   - Only retreat at 10% health

   **Defensive Branch (when `BehaviorPreset` == Defensive):**
   - Stay within 500 units of the player
   - Prioritize abilities with defensive tags (buffs, shields)
   - Only attack enemies that are targeting an ally
   - Retreat at 30% health

   **Support Branch (when `BehaviorPreset` == Support):**
   - Constantly monitor ally health (service that scans every 0.3s)
   - If any ally is below 50% health, move toward them and use a heal ability
   - If no one needs healing, apply buffs to allies
   - Only attack if no healing or buffing is needed
   - Stay at max range from enemies

3. Structure the tree:
   ```
   Root
     Selector
       [Decorator: BB "BehaviorPreset" == Aggressive]
       SubTree: BT_Aggressive

       [Decorator: BB "BehaviorPreset" == Defensive]
       SubTree: BT_Defensive

       [Decorator: BB "BehaviorPreset" == Support]
       SubTree: BT_Support
   ```

4. Create a simple UI widget with three buttons (Aggressive, Defensive, Support). When the player clicks a button, it sets the `BehaviorPreset` Blackboard key on the selected party member's AI Controller.

5. Test: During gameplay, switch presets and observe the AI change behavior in real time. The Selector will naturally pick the correct branch on the next evaluation.

**Bonus Challenge:** Add a "Balanced" preset that blends behaviors: attack when enemies are close, support when allies need healing, and stay at medium range otherwise. This requires more nuanced condition checking within a single branch.

**What You Learn:** How to use Blackboard values to switch between behavior modes, sub-tree modularity, and connecting UI inputs to AI decision-making.

---

## Exercise 5: Party AI (Follow, Assist, and Fight Together)

**Objective:** Build a party member AI that follows the player during exploration, takes position in formation, and fights intelligently during combat based on a turn-based system.

**Steps:**

1. **Formation System:**
   - Create a component `BP_FormationComponent` that attaches to the player character
   - Define 3 formation slots as offset vectors (e.g., [-150, -100, 0], [-150, 100, 0], [-300, 0, 0] for a triangle behind the player)
   - Each party member AI gets assigned a slot index
   - Create a function `GetFormationWorldPosition(SlotIndex)` that transforms the local offset by the player's position and rotation

2. **Following Behavior:**
   - Create a service `BTService_UpdateFormationTarget` that calculates the formation position every 0.5 seconds and writes it to a `FormationTarget` (Vector) Blackboard key
   - Create the follow branch:
     ```
     Sequence (FOLLOW)
       [Service: BTService_UpdateFormationTarget]
       [Decorator: Distance to FormationTarget > 200]
       BTTask_MoveTo (FormationTarget)
     ```
   - The decorator prevents the AI from constantly micro-adjusting when it is close enough

3. **Catch-Up Logic:**
   - In the service, also calculate the distance to the player
   - If distance > 2000 units, set a `NeedsTeleport` Boolean on the Blackboard
   - Create a task `BTTask_TeleportToPlayer` that moves the AI directly to a formation position with a particle effect
   - Add a high-priority branch:
     ```
     [Decorator: BB "NeedsTeleport" == true]
     BTTask_TeleportToPlayer
     ```

4. **Combat Integration:**
   - Add a `IsInCombat` Boolean to the Blackboard. The Turn Manager sets this when combat begins.
   - Add a `IsMyTurn` Boolean. The Turn Manager sets this when it is this AI's turn.
   - Combat branch (higher priority than follow):
     ```
     [Decorator: BB "IsInCombat" == true, Observer Aborts: Lower Priority]
     Selector (COMBAT)
       [Decorator: BB "IsMyTurn" == true]
       Sequence (TAKE TURN)
         BTTask_EvaluateBattlefield
         BTTask_SelectAbility (based on preset)
         BTTask_MoveTo (tactical position from EQS)
         BTTask_UseAbility
         BTTask_EndTurn

       Sequence (WAIT FOR TURN)
         BTTask_PlayIdleCombatAnimation
     ```

5. **Player Commands:**
   - Add a `PlayerCommand` (Name) Blackboard key and a `CommandTarget` (Object) key
   - Create a highest-priority branch:
     ```
     [Decorator: BB "PlayerCommand" is set, Observer Aborts: Both]
     Sequence (EXECUTE COMMAND)
       BTTask_ExecutePlayerCommand
       BTTask_ClearCommand
     ```
   - `BTTask_ExecutePlayerCommand` reads the command name and target, then performs the action (MoveTo, AttackTarget, UseAbilityOn, etc.)

6. Put it all together:
   ```
   Root
     Selector
       EXECUTE COMMAND branch (highest priority)
       COMBAT branch (when in combat)
       TELEPORT branch (when too far)
       FOLLOW branch (default exploration)
       IDLE branch (stand in formation)
   ```

7. Test with a simple scenario: Walk around with the AI following in formation. Enter a combat zone that sets `IsInCombat`. Watch the AI take turns. Issue a direct command. Leave combat and watch the AI resume following.

**Bonus Challenge:** Add an EQS query for the combat movement step. The query should find a tile that is within ability range of the chosen target AND not adjacent to any enemy (safety). Use scoring to balance range and safety.

**What You Learn:** Formation-based following, state-based behavior switching (exploration vs combat), turn-based AI integration, player command overrides, and combining all AI systems into a cohesive party member.
