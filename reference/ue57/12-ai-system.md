## AI System

Unreal Engine 5.7 provides a layered AI framework built around Behavior Trees, Blackboards, the Environment Query System (EQS), AI Controllers, AI Perception, Navigation, Smart Objects, and State Trees. Each layer can be used independently or combined for complex NPC behaviors.

---

### Behavior Trees

Behavior Trees are the primary decision-making structure for AI in UE5. A Behavior Tree asset is assigned to an AI Controller and evaluated every tick. The tree is composed of nodes organized into four categories: Composites, Decorators, Tasks, and Services.

**Creating a Behavior Tree:**
- Content Browser > Right-click > Artificial Intelligence > Behavior Tree
- Assign to an AI Controller via `RunBehaviorTree(BehaviorTreeAsset)` in C++ or the "Run Behavior Tree" node in Blueprints

**Execution Model:**
- Trees execute top-to-bottom, left-to-right
- A node returns one of three statuses: Succeeded, Failed, or In Progress
- Conditional aborts (observer aborts) allow branches to interrupt themselves or lower-priority branches

> **In your games:**
> - **DnD RPG**: Each of the 25 enemy types gets a Behavior Tree assigned to its AI Controller. Fodder enemies (Goblin Grunt, Skeleton Minion, Giant Rat) use simple trees. Standard enemies (Orc Warrior, Dark Acolyte, Bandit Captain) use moderately complex trees. Elite enemies (Lich, Dragon Wyrmling, Beholder) use deep, multi-branch trees with conditional aborts for dynamic re-evaluation during combat. Party companion AI (the Cleric, Ranger, etc. when not player-controlled) also run Behavior Trees that respond to party commands.
> - **Wizard's Chess**: The chess AI itself is algorithmic (minimax/alpha-beta), but Behavior Trees drive the "personality" of piece animations. Each piece type has a small tree: evaluate if it is my turn > play anticipation idle > receive move command > execute movement > check if capturing > play attack or settle animation.

---

#### Composite Nodes

Composites define the control flow of the tree. They have one or more children and determine which children execute and in what order.

##### Selector

- Executes children left to right
- Succeeds as soon as ANY child succeeds
- Fails only if ALL children fail
- Use case: "Try option A, if that fails try option B, then C"
- Observer Abort options: None, Self, Lower Priority, Both

##### Sequence

- Executes children left to right
- Fails as soon as ANY child fails
- Succeeds only if ALL children succeed
- Use case: "Do step 1, then step 2, then step 3; if any step fails, the whole sequence fails"
- Observer Abort options: None, Self, Lower Priority, Both

> **In your games:**
> - **DnD RPG (Selector example)**: A Goblin Grunt's top-level Selector tries: (1) Flee if HP < 20%, (2) Attack nearest player if in melee range, (3) Move to nearest player, (4) Idle patrol. The first successful branch wins. Use **Lower Priority observer abort** on the Flee branch so that if HP drops below 20% mid-attack, it immediately aborts the attack and flees.
> - **DnD RPG (Sequence example)**: The Dark Acolyte's "Cast Spell" branch is a Sequence: (1) Check mana > 30, (2) Select best spell target via EQS, (3) Rotate to face target, (4) Play cast animation, (5) Apply GAS Gameplay Effect. If any step fails (no mana, no valid target, interrupted), the whole sequence fails and the Selector falls through to the melee attack branch.
> - **Wizard's Chess**: A Selector on each piece: (1) Execute move command if one is queued, (2) Play reaction animation if another piece just captured nearby, (3) Play idle fidget. The Sequence for executing a move: (1) Stand up from idle, (2) Move to target square, (3) If capturing, play attack, (4) Settle into new idle position.

##### Simple Parallel

- Runs exactly two children simultaneously: one "main" task and one "background" subtree
- The main task must be a single Task node (left connection)
- The background tree can be a full subtree (right connection)
- Finish Mode:
  - **Immediate**: Finishes as soon as the main task finishes; background tree is aborted
  - **Delayed**: Waits for the background tree to finish even after the main task completes

> **In your games:**
> - **DnD RPG**: Use **Simple Parallel** for the Orc Warrior: main task is "Move To Player," background tree runs "Taunt/Roar animation every 3 seconds." The Orc advances while periodically snarling. For the Lich (Elite), main task is "Channel Dark Ritual" (a long cast), background tree checks "Is any player within interrupt range? If so, teleport away." Use **Immediate** finish mode so when the channel completes, the background awareness tree stops.
> - **Wizard's Chess**: Simple Parallel on the Knight: main task is "Execute L-shaped hop animation," background tree triggers particle trail effects at each landing point along the path. Use **Delayed** finish mode so the particle trails finish fading even after the Knight has landed.

---

#### Decorator Nodes

Decorators attach to Composite or Task nodes and add conditional logic, modify execution, or control flow. They act as "if" checks or execution modifiers.

##### Blackboard-Based Decorator

- Checks a Blackboard key against a condition
- **Key Query options**: Is Set, Is Not Set
- **Comparison operations** (for numeric/enum keys): Equal To, Not Equal To, Less Than, Less Than or Equal To, Greater Than, Greater Than or Equal To
- **String operations**: Equal To, Not Equal To, Contains, Not Contains
- **Observer Aborts**: None, Self, Lower Priority, Both
- **Notify Observer**: On Result Change, On Value Change
- Navigation path: Behavior Tree Editor > Drag from Composite/Task > Add Decorator > Blackboard

##### Cooldown

- Prevents the attached node from executing again for a specified duration (in seconds)
- **Properties**:
  - `Cool Down Time`: Float, duration in seconds
  - `Observer Aborts`: None, Self, Lower Priority, Both
- After the node executes, subsequent attempts return Failed until the cooldown expires

##### Does Path Exist

- Checks whether a valid navigation path exists between two points
- **Properties**:
  - `Blackboard Key A`: Starting location (typically self)
  - `Blackboard Key B`: Target location
  - `Path Query Type`: NavMesh Raycast 2D, Hierarchical Query, Regular Path Finding
  - `Filter Class`: Optional navigation filter
  - `Inverse Condition`: Flip the result

##### Force Success

- Forces the attached node to always return Success regardless of its actual result
- Useful for optional branches that should never cause a Sequence to fail
- No configurable properties

##### Is At Location

- Checks whether the AI pawn is at (or near) a specified location
- **Properties**:
  - `Blackboard Key`: The target location to check
  - `Acceptable Radius`: Distance threshold for "close enough"
  - `Geometric Distance Type`: 2D (ignore Z) or 3D
  - `Parametrized Acceptable Radius`: Use a Blackboard key for the radius
  - `Inverse Condition`: Flip the result

##### Keep in Cone

- Checks whether a target (observed Actor or location) remains inside a cone originating from the AI or another origin point
- **Properties**:
  - `Cone Half Angle`: Half-angle of the cone in degrees
  - `Cone Origin`: Blackboard key for the cone origin (typically Self)
  - `Observed`: Blackboard key for the observed target
  - `Observer Aborts`: None, Self, Lower Priority, Both

##### Loop

- Causes the attached node to repeat a specified number of times (or infinitely)
- **Properties**:
  - `Num Loops`: Number of repetitions; set to -1 or 0 with `Infinite Loop` checked for infinite
  - `Infinite Loop`: Boolean
  - `Infinite Loop Timeout Time`: Failsafe timeout for infinite loops; -1 for no timeout
- The node re-executes its child each time it completes

##### Time Limit

- Aborts the attached node if it does not finish within the specified time
- **Properties**:
  - `Time Limit`: Float, seconds before aborting
- If the child does not return Succeeded or Failed within the time limit, it is forcibly aborted and returns Failed

> **In your games:**
> - **DnD RPG (Blackboard Decorator)**: On the Skeleton Minion's attack branch, a Blackboard decorator checks `TargetActor Is Set`. If the player moves out of range and TargetActor is cleared, **Observer Abort: Self** immediately cancels the attack. On the Dark Acolyte, check `Mana >= 30` (Greater Than or Equal To) before the spellcasting branch.
> - **DnD RPG (Cooldown)**: The Dragon Wyrmling's fire breath ability has a **Cooldown** of 8 seconds, preventing it from spamming the devastating area attack. The Bandit Captain's rally shout uses a 15-second cooldown.
> - **DnD RPG (Does Path Exist)**: Before the Goblin Grunt tries to flank, check if a path exists to the player's rear position. If the dungeon geometry blocks flanking, fall through to a direct charge.
> - **DnD RPG (Time Limit)**: The Beholder's death ray channel has a **Time Limit** of 5 seconds. If the target breaks line of sight during the channel, the Beholder does not stand there forever.
> - **DnD RPG (Loop)**: The Skeleton Minion's patrol uses a **Loop** decorator set to infinite, endlessly cycling between patrol waypoints until a player is detected and the branch aborts.
> - **Wizard's Chess (Cooldown)**: The "dramatic reaction" animation on nearby pieces has a 4-second cooldown so pieces do not flinch at every single move, only occasionally.

##### Conditional Loop

- Repeats the attached node as long as a Blackboard condition is true
- Combines the Loop decorator with a Blackboard condition check
- **Properties**:
  - `Key Query`: Is Set, Is Not Set
  - `Blackboard Key`: The key to check
- Loop ends when the condition becomes false

> **In your games:**
> - **DnD RPG**: The Cleric companion uses a **Conditional Loop** on its healing behavior: keep healing allies as long as `PartyMemberNeedsHealing Is Set`. Once all party members are above the health threshold and the key is cleared, the loop ends and the Cleric falls through to its attack or support branches.
> - **Wizard's Chess**: A **Conditional Loop** on the idle animation branch: keep playing idle fidgets as long as `HasMoveCommand Is Not Set`. The moment a move command arrives, the condition fails and the piece transitions to its movement branch.

---

#### Task Nodes

Tasks are leaf nodes that perform actions. They represent what the AI actually "does."

##### Move To

- Moves the AI pawn toward a target location or Actor using the navigation system
- **Properties**:
  - `Blackboard Key`: Target (Actor or Vector)
  - `Acceptable Radius`: Distance at which the task considers the move complete
  - `Filter Class`: Navigation query filter
  - `Allow Strafe`: Whether the AI can strafe while moving
  - `Reach Test Includes Agent Radius`: Include the agent's radius when checking if the goal is reached
  - `Reach Test Includes Goal Radius`: Include the goal's radius
  - `Allow Partial Path`: Succeed even if only a partial path is found
  - `Track Moving Goal`: Continuously update the path if the target moves
  - `Project Goal Location`: Project the target location onto the NavMesh
  - `Observe Blackboard Value`: Re-evaluate if the Blackboard key changes
- Returns In Progress while moving, Succeeded on arrival, Failed if no path

> **In your games:**
> - **DnD RPG**: Every enemy uses **Move To** extensively. The Goblin Grunt moves to the nearest player with `Acceptable Radius` of 150 (melee range). The Dark Acolyte moves to a casting position with `Acceptable Radius` of 800 (spell range). Enable **Track Moving Goal** so enemies chase a moving player. Enable **Allow Partial Path** for the Giant Rat so it can still advance even if the player is behind a partially blocked doorway. For the Ranger companion, set `Allow Strafe: true` so it circles the enemy while maintaining bow aim.
> - **Wizard's Chess**: Use **Move To** for pieces navigating to their target square. Set `Acceptable Radius` to a tight value (5 units) so pieces land precisely on the square center. Disable **Track Moving Goal** since the target square does not move.

##### Rotate to Face BBEntry

- Rotates the AI pawn to face a Blackboard key target (Actor or Vector)
- **Properties**:
  - `Blackboard Key`: The target to face
  - `Precision`: Angle tolerance in degrees
- Returns Succeeded once facing the target within the precision angle

> **In your games:**
> - **DnD RPG**: The Orc Warrior uses **Rotate to Face BBEntry** before its heavy overhead attack, since the swing has a narrow hitbox and must be aimed at the player. The Dark Acolyte rotates to face its spell target before casting. Set `Precision` to 5 degrees for ranged attacks (accuracy matters) and 15 degrees for melee (more forgiving).
> - **Wizard's Chess**: Before a piece plays its attack animation during capture, rotate it to face the defender piece. This ensures the Knight charges toward the target, not off to the side.

##### Run Behavior (Run Behavior Dynamic / Run Sub-Tree)

- Executes another Behavior Tree asset as a subtree
- **Properties**:
  - `Behavior Asset`: Reference to the sub-Behavior Tree
  - `Subtree Tag`: Gameplay Tag for dynamic subtree injection
- Useful for modular AI design; keeps behavior trees manageable
- The sub-tree shares the same Blackboard instance

> **In your games:**
> - **DnD RPG**: Create modular sub-trees for reusable behaviors: `BT_Patrol` (waypoint patrol loop), `BT_FleeToSafety` (run to nearest safe zone), `BT_HealSelf` (use potion or healing ability). The Goblin Grunt's main tree uses **Run Behavior** to call `BT_Patrol` during its idle state and `BT_FleeToSafety` when HP is low. The Bandit Captain shares `BT_FleeToSafety` but also has a unique `BT_RallyAllies` sub-tree. This modular approach means you build 25 enemy types without duplicating common logic.
> - **Wizard's Chess**: A shared `BT_PieceMovement` sub-tree handles the move-to-square logic for all piece types. Each piece's main tree calls it via **Run Behavior**, keeping movement code in one place.

##### Run EQS Query

- Executes an Environment Query System query and stores the result in the Blackboard
- **Properties**:
  - `Query Template`: The EQS Query asset to run
  - `Blackboard Key`: Where to store the result (typically a Vector or Actor)
  - `Run Mode`:
    - `Single Best Item`: Returns only the highest-scoring item
    - `Single Random Item from Top 5%/25%`: Random pick from top scorers
    - `All Matching`: Returns all items that pass the tests
  - `EQS Query Params`: Optional parameter overrides for the query

> **In your games:**
> - **DnD RPG**: The Dark Acolyte uses **Run EQS Query** with `Single Best Item` to find the optimal casting position: far enough from melee attackers, with line of sight to the most clustered group of players. The Goblin Grunt uses it with `Single Random Item from Top 25%` to pick a flanking position (adds variety so goblins do not all pick the same spot). The Lich uses `All Matching` to identify all valid teleport destinations in the arena, then picks one based on additional logic. Store results in Blackboard keys like `BestAttackPosition` or `FlankTarget`.
> - **Wizard's Chess**: Not heavily used since movement targets come from the chess algorithm, not spatial queries. However, you could use EQS for the "sideline" captured pieces to find a good resting position along the board edge.

##### Wait

- Pauses execution for a specified duration
- **Properties**:
  - `Wait Time`: Base duration in seconds
  - `Random Deviation`: Random +/- added to the wait time
- Returns In Progress during the wait, then Succeeded

##### Wait Blackboard Time

- Pauses execution for a duration specified by a Blackboard key
- **Properties**:
  - `Blackboard Key`: Float key that holds the wait duration
- Otherwise identical to the Wait task

> **In your games:**
> - **DnD RPG**: Use **Wait** with `Random Deviation` on the Goblin Grunt's patrol: wait 2-4 seconds at each waypoint before moving to the next (feels more natural than a fixed pause). The Skeleton Minion waits 1 second between attacks. Use **Wait Blackboard Time** for the AI DM's pacing: the DM system writes a `NarrativePauseTime` float to the Blackboard based on the drama of the moment (longer pause before a boss reveal, shorter for routine encounters).
> - **Wizard's Chess**: Use **Wait** with `Random Deviation` (0.5 to 1.5 seconds) before each piece begins moving, simulating the AI "thinking" about its move. Longer waits for more complex board states feel natural and build tension.

##### Custom Tasks (Blueprint)

Creating custom tasks in Blueprint:
1. Content Browser > Right-click > Blueprint Class > BTTask_BlueprintBase
2. Override `Receive Execute AI` for task logic
3. Call `Finish Execute` with Success or Failure when done
4. Override `Receive Abort AI` for cleanup when the task is aborted
5. Call `Finish Abort` when abort handling is complete

Creating custom tasks in C++:
```cpp
#include "BehaviorTree/BTTaskNode.h"

UCLASS()
class UBTTask_MyCustomTask : public UBTTaskNode
{
    GENERATED_BODY()
public:
    UBTTask_MyCustomTask();
    virtual EBTNodeResult::Type ExecuteTask(UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory) override;
    virtual EBTNodeResult::Type AbortTask(UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory) override;
    virtual void TickTask(UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory, float DeltaSeconds) override;
};
```

**Key methods:**
- `ExecuteTask()`: Called when the node starts; return `EBTNodeResult::Succeeded`, `Failed`, or `InProgress`
- `AbortTask()`: Called when the node is aborted by a decorator
- `TickTask()`: Called every frame while the node is In Progress (must set `bNotifyTick = true` in constructor)
- `OnTaskFinished()`: Cleanup after the task finishes

> **In your games:**
> - **DnD RPG**: Custom tasks you will need: `BTTask_UseAbility` (activates a GAS Gameplay Ability, waits for it to finish, returns result), `BTTask_RollDice` (triggers the tabletop dice roll system, reads the result, writes it to the Blackboard), `BTTask_SelectTarget` (evaluates threat tables and picks the best target), `BTTask_CallForHelp` (alerts nearby allies via a perception stimulus), `BTTask_FleeToNavPoint` (finds the nearest retreat point and moves there). The Lich uses `BTTask_Teleport` (custom C++ task that instantly repositions the Lich and plays VFX). Use `TickTask` on long-running abilities like the Beholder's sustained death ray beam.
> - **Wizard's Chess**: Custom tasks: `BTTask_ExecuteChessMove` (receives a move from the chess engine, animates the piece to its destination), `BTTask_PlayCaptureSequence` (triggers the Sequencer cinematic for the appropriate capture type), `BTTask_CelebratePiece` (plays a victory animation after a successful capture).

---

#### Services

Services attach to Composite nodes and execute at a defined interval while that branch is active. They are typically used to update Blackboard values or perform checks.

##### Default Focus

- Sets the AI Controller's focus to a Blackboard key Actor
- **Properties**:
  - `Blackboard Key`: Actor to focus on
  - `Focus Priority`: Priority level for the focus (default is Gameplay)
- The AI pawn will rotate to face the focused Actor while this service runs

##### Custom Services (Blueprint)

1. Content Browser > Right-click > Blueprint Class > BTService_BlueprintBase
2. Override `Receive Activation AI`: Called when the service starts
3. Override `Receive Tick AI`: Called at the service interval
4. Override `Receive Deactivation AI`: Called when leaving the branch
5. Set `Interval` and `Random Deviation` for tick frequency

> **In your games:**
> - **DnD RPG**: Create `BTService_UpdateThreatTarget` that runs every 0.5 seconds on the combat branch. It scans perceived enemies, calculates a threat score (distance, HP, damage output, aggro), and writes the highest-threat target to `TargetActor` on the Blackboard. Create `BTService_MonitorHealth` that checks the AI's own HP every tick and sets `bShouldFlee`, `bShouldHeal`, or `bIsEnraged` Blackboard booleans. The Orc Warrior's rage service sets `bIsEnraged = true` when HP drops below 40%, doubling its damage but disabling the flee branch. Use **Default Focus** service on the combat branch so enemies always face their target while fighting.
> - **Wizard's Chess**: A service `BTService_WatchBoard` runs on the idle branch and updates a `NearbyThreat` boolean whenever an enemy piece is one move away, triggering a nervous idle animation.

Custom Services in C++:
```cpp
#include "BehaviorTree/BTService.h"

UCLASS()
class UBTService_MyCustomService : public UBTService
{
    GENERATED_BODY()
public:
    UBTService_MyCustomService();
    virtual void TickNode(UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory, float DeltaSeconds) override;
    virtual void OnBecomeRelevant(UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory) override;
    virtual void OnCeaseRelevant(UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory) override;
};
```

---

### Blackboard

The Blackboard is a shared data store used by Behavior Trees, EQS, and AI Controllers. It holds key-value pairs that the AI reads and writes during execution.

**Creating a Blackboard:**
- Content Browser > Right-click > Artificial Intelligence > Blackboard

#### Key Types

| Key Type | Description | Common Use |
|----------|-------------|------------|
| `Bool` | True/False | Flags, states |
| `Int` | Integer | Counters, IDs |
| `Float` | Floating point | Distances, timers, health values |
| `String` | Text string | Names, states |
| `Name` | FName | Identifiers |
| `Vector` | FVector (X, Y, Z) | Locations, directions |
| `Rotator` | FRotator (Pitch, Yaw, Roll) | Orientations |
| `Enum` | Enumeration | State machines, categories |
| `Object` | UObject pointer | Actor references |
| `Class` | UClass pointer | Class references |

> **In your games:**
> - **DnD RPG**: Your enemy Blackboard needs these keys: `TargetActor` (Object, the current attack target), `PatrolLocation` (Vector, next waypoint), `HomeLocation` (Vector, spawn point for leashing), `AlertLevel` (Float, 0.0 calm to 1.0 full alert), `bInCombat` (Bool), `bShouldFlee` (Bool), `HP` (Float), `AIState` (Enum: Patrol, Alert, Combat, Flee, Dead), `BestAbility` (Name, which GAS ability to use next), `FlankPosition` (Vector, from EQS), `ThreatDistance` (Float). The companion Blackboard adds: `PartyLeader` (Object), `FormationOffset` (Vector), `CurrentCommand` (Enum: Follow, Attack, Defend, Heal).
> - **Wizard's Chess**: Simpler Blackboard: `MoveCommand` (Vector, target square), `bHasMoveCommand` (Bool), `CaptureTarget` (Object, enemy piece to capture), `bIsMyTurn` (Bool), `PieceType` (Enum: King, Queen, Rook, Bishop, Knight, Pawn).

#### Parent Blackboards

- A Blackboard can inherit from a parent Blackboard
- Child Blackboards include all keys from the parent plus additional keys
- Useful for shared keys across multiple AI types

> **In your games:**
> - **DnD RPG**: Create a parent Blackboard `BB_EnemyBase` with shared keys: `TargetActor`, `HP`, `bInCombat`, `AlertLevel`, `HomeLocation`, `AIState`. Then create child Blackboards: `BB_FodderEnemy` adds nothing extra (Goblin Grunt, Giant Rat keep it simple). `BB_StandardEnemy` adds `BestAbility`, `FlankPosition`, `CooldownTimer`. `BB_EliteEnemy` adds `PhaseNumber`, `SummonCount`, `TeleportDestination`. This hierarchy means all 25 enemy types share the base keys, and decorators/services written against `BB_EnemyBase` work on any enemy.
> - **Wizard's Chess**: A parent `BB_ChessPiece` with `MoveCommand`, `bHasMoveCommand`, `bIsMyTurn`. No child Blackboards needed since all pieces use the same data.

#### Observers

Decorators can observe Blackboard key changes for conditional aborts:
- **On Value Change**: Triggers re-evaluation whenever the key value changes
- **On Result Change**: Triggers re-evaluation only when the decorator condition result changes

#### Setting and Getting Values

**Blueprint:**
- `Set Value as [Type]` node (e.g., Set Value as Vector, Set Value as Object)
- `Get Value as [Type]` node
- Requires a Blackboard Key Selector variable

**C++:**
```cpp
// Getting the Blackboard
UBlackboardComponent* BB = OwnerComp.GetBlackboardComponent();

// Setting values
BB->SetValueAsVector(FName("TargetLocation"), FVector(100.f, 200.f, 0.f));
BB->SetValueAsObject(FName("TargetActor"), SomeActor);
BB->SetValueAsFloat(FName("AlertLevel"), 0.75f);
BB->SetValueAsBool(FName("IsAlerted"), true);
BB->SetValueAsEnum(FName("AIState"), static_cast<uint8>(EAIState::Combat));

// Getting values
FVector Loc = BB->GetValueAsVector(FName("TargetLocation"));
UObject* Obj = BB->GetValueAsObject(FName("TargetActor"));
float Alert = BB->GetValueAsFloat(FName("AlertLevel"));

// Clearing a value
BB->ClearValue(FName("TargetActor"));
```

---

### Environment Query System (EQS)

EQS allows AI to query the environment for locations or Actors that match specific criteria. Queries generate a set of items, run tests against them, and return scored results.

**Enabling EQS:**
- Editor Preferences > General > Experimental > AI > Environment Querying System: Enabled
- (In UE 5.7, EQS is enabled by default)

**Creating a Query:**
- Content Browser > Right-click > Artificial Intelligence > Environment Query

#### Generators

Generators produce the initial set of items (locations or Actors) to test.

| Generator | Description |
|-----------|-------------|
| `Actors of Class` | Finds all Actors of a specified class within range |
| `On Circle` | Generates points in a circle around a context |
| `Simple Grid` | Generates a grid of points around a context |
| `Pathing Grid` | Generates a grid of points reachable via navigation |
| `Donut` | Generates points in a donut (ring) shape around a context |
| `Current Location` | Single point at the querier's current location |
| `Composite` | Combines results from multiple generators |
| `Perceived Actors` | Returns Actors currently perceived by the AI |

> **In your games:**
> - **DnD RPG**: Use **Simple Grid** to find cover positions in a dungeon room for the Dark Acolyte (generate grid, test for line-of-sight to player, score by distance). Use **On Circle** around the player for the Goblin Grunt's flanking positions (generate points in a ring, filter for NavMesh reachability, score by dot product to find positions behind the player). Use **Actors of Class** to find all healing potions on the ground when an enemy is low HP. Use **Pathing Grid** for the Lich to find teleport destinations reachable by navigation (avoids teleporting into walls). Use **Perceived Actors** to query all currently visible enemies for target selection.
> - **Wizard's Chess**: Use **Simple Grid** to generate positions along the board edge for captured pieces to line up aesthetically. Filter by distance from existing captured pieces to avoid overlap.

**Custom Generator (C++):**
```cpp
#include "EnvironmentQuery/EnvQueryGenerator.h"

UCLASS()
class UEnvQueryGenerator_MyCustom : public UEnvQueryGenerator
{
    GENERATED_BODY()
    virtual void GenerateItems(FEnvQueryInstance& QueryInstance) const override;
};
```

#### Tests

Tests score or filter the items produced by generators.

| Test | Description |
|------|-------------|
| `Distance` | Scores based on distance to a context |
| `Dot` | Scores based on dot product between directions |
| `Trace` | Line trace from item to context; filters items blocked by geometry |
| `Overlap` | Checks for overlapping Actors at item locations |
| `Pathfinding` | Scores based on navigation path length or cost |
| `Pathfinding Batch` | Batched version of Pathfinding for performance |
| `Project` | Projects items onto the NavMesh or geometry |
| `GameplayTags` | Filters or scores based on Gameplay Tags on Actors |

**Test Scoring:**
- Each test has a Scoring Equation: Linear, Square, Inverse Linear, Constant
- Tests can Filter (pass/fail) and/or Score (weighted value)
- Filter Type: Minimum, Maximum, Range
- Score Clamp: Min and Max bounds for scoring

**Test Purpose:**
- `Filter Only`: Items that fail are removed
- `Score Only`: Items are ranked but not removed
- `Filter and Score`: Items are both filtered and ranked

> **In your games:**
> - **DnD RPG**: For the Dark Acolyte's "find casting position" query: **Distance** test (Score Only, Inverse Linear) scores positions farther from melee enemies higher. **Trace** test (Filter Only) removes positions without line of sight to the target player. **Dot** test (Score Only) prefers positions where the Acolyte faces the player (not turned away). **Pathfinding** test (Filter and Score) filters unreachable positions and prefers shorter paths. For the Goblin Grunt flanking query: **Dot** test scores positions behind the player (dot product of player-forward vs player-to-position should be negative). **Distance** test with Range filter removes positions too far away.
> - **Wizard's Chess**: For captured piece lineup: **Distance** test (Score Only, Linear) prefers positions closer to the board edge center. **Overlap** test (Filter Only) removes positions already occupied by other captured pieces.

#### Contexts

Contexts define reference points for generators and tests.

| Context | Description |
|---------|-------------|
| `Querier` | The AI character running the query |
| `EnvQueryContext_Item` | The current item being tested |
| `EnvQueryContext_BlueprintBase` | Custom context defined in Blueprint |

**Custom Context (Blueprint):**
1. Content Browser > Right-click > Blueprint Class > EnvQueryContext_BlueprintBase
2. Override `Provide Single Location` or `Provide Single Actor`
3. Or override `Provide Locations Set` / `Provide Actors Set` for multiple contexts

> **In your games:**
> - **DnD RPG**: Create custom contexts: `EQC_PartyCenter` (returns the average position of all party members, useful for area-of-effect targeting), `EQC_LowestHPAlly` (returns the weakest ally, for the Cleric companion to prioritize healing), `EQC_BossArena` (returns the arena center point for positioning logic during boss fights). The Lich's "find teleport destination" query uses `EQC_BossArena` as the generation center and the `Querier` context for distance scoring.
> - **Wizard's Chess**: Create `EQC_BoardCenter` (returns the center of the chess board) and `EQC_CapturedPieceZone` (returns the center of the side area where captured pieces gather).

#### Query Manager

- EQS queries can be expensive; the Query Manager handles scheduling and throttling
- **Console commands**:
  - `ai.EQS.AllowTimeSlicing [0/1]`: Enable or disable time slicing
  - `ai.EQS.MaxAllowedTestingTime [float]`: Max time per frame for EQS in milliseconds

#### Debugging EQS

- In Play mode, select an AI pawn, press `'` (single quote) to open the AI Debug HUD
- Press Numpad 1 to cycle to EQS debug view
- Each item shows its score as a colored sphere (blue = low, green = high)
- Console command: `ai.EQS.EnableDebugView 1`
- The EQS Testing Pawn allows previewing queries in the editor without running the game

---

### AI Controllers

AI Controllers are the "brains" that possess AI-driven Pawns. They manage Behavior Trees, Blackboards, AI Perception, pathfinding requests, and focus.

**Key properties:**
- `Behavior Tree Asset`: The tree to run on possess
- `Blackboard Asset`: Auto-assigned from the Behavior Tree, or set manually
- `Default Navigator`: The pathfinding component to use (typically PathFollowingComponent)

**Creating an AI Controller:**
- Content Browser > Right-click > Blueprint Class > AIController

**Key Functions:**

```cpp
// Possessing a pawn
void OnPossess(APawn* InPawn);

// Running a behavior tree
bool RunBehaviorTree(UBehaviorTree* BTAsset);

// Setting focus
void SetFocus(AActor* NewFocus);
void SetFocalPoint(FVector FocalPoint);
void ClearFocus(EAIFocusPriority::Type InPriority);

// Movement
EPathFollowingRequestResult::Type MoveToActor(AActor* Goal, float AcceptanceRadius = -1.f);
EPathFollowingRequestResult::Type MoveToLocation(const FVector& Dest, float AcceptanceRadius = -1.f);
void StopMovement();

// Perception
UAIPerceptionComponent* GetPerceptionComponent();
```

**Spawning AI with a Controller:**
- In the Pawn's defaults, set `AI Controller Class` to your custom AI Controller
- Set `Auto Possess AI` to `Placed in World`, `Spawned`, or `Placed in World or Spawned`

> **In your games:**
> - **DnD RPG**: Create an AI Controller hierarchy: `AIC_EnemyBase` (shared logic: Blackboard setup, team assignment, perception config), `AIC_FodderEnemy` (simple BT, basic perception), `AIC_StandardEnemy` (moderate BT, full perception), `AIC_EliteEnemy` (complex BT, enhanced perception, boss phase logic). Create `AIC_Companion` for party AI with additional functions: `SetCommand(ECompanionCommand)`, `SetFormationOffset(FVector)`, `GetPartyLeader()`. All enemies set `Auto Possess AI: Placed in World or Spawned` so they activate whether hand-placed in the dungeon editor or spawned by the AI DM at runtime. Use `SetFocus` in combat so enemies always look at their target. Use `MoveToActor` with the tracked target for melee enemies and `MoveToLocation` with the EQS result for ranged positioning.
> - **Wizard's Chess**: A single `AIC_ChessPiece` controller handles all 32 pieces. It receives move commands from the chess engine, writes them to the Blackboard, and lets the Behavior Tree execute the animation sequence. Set `Auto Possess AI: Spawned` since pieces are spawned when the match initializes.

---

### AI Perception

The AI Perception system lets AI characters detect stimuli in the world through configurable senses. It is driven by the `UAIPerceptionComponent` on the AI Controller and `UAIPerceptionStimuliSourceComponent` on source Actors.

#### Setting Up AI Perception

1. Add `AI Perception Component` to your AI Controller (or Pawn)
2. In the component details, add Sense Configs
3. Bind `On Perception Updated` or `On Target Perception Updated` delegates

#### Sense Types

##### Sight (UAISense_Sight)

| Property | Description |
|----------|-------------|
| `Sight Radius` | Maximum detection distance |
| `Lose Sight Radius` | Distance at which a detected target is lost (should be > Sight Radius) |
| `Peripheral Vision Half Angle Degrees` | Half-angle of the vision cone (180 = full circle) |
| `Auto Success Range from Last Seen Location` | Distance within which detection is guaranteed after initial sight |
| `Point of View Backward Offset` | Offset the sight origin behind the AI |
| `Near Clipping Radius` | Minimum distance for detection |
| `Max Age` | How long a stimulus remains valid after losing sight |

> **In your games:**
> - **DnD RPG**: Fodder enemies (Goblin Grunt, Giant Rat) get a narrow `Peripheral Vision Half Angle` of 60 degrees and a short `Sight Radius` of 1500, making them easy to sneak past. Standard enemies (Orc Warrior, Bandit Captain) get 75 degrees and 2000 radius. Elite enemies (Lich, Beholder) get 90 degrees and 3000 radius, nearly impossible to avoid in an open room. The Beholder gets 180 degrees (full circle vision, it is a floating eye after all). Set `Max Age` to 5 seconds on Fodder enemies (they forget quickly) and 15 seconds on Elites (they hunt persistently). The Rogue class can reduce enemies' sight effectiveness via a stealth GAS ability that modifies the `Auto Success Range`.
> - **Wizard's Chess**: Not used for gameplay AI, but you could give pieces sight perception so they "notice" approaching enemy pieces and play nervous idle animations when an attacker enters their vision cone.

##### Hearing (UAISense_Hearing)

| Property | Description |
|----------|-------------|
| `Hearing Range` | Maximum distance at which sounds are detected |
| `Detection by Affiliation`: | Detect Enemies, Neutrals, Friendlies |

**Reporting noise in Blueprint:** Use `Report Noise Event` or `Make Noise`
**In C++:**
```cpp
UAISense_Hearing::ReportNoiseEvent(GetWorld(), NoiseLocation, Loudness, NoiseInstigator, MaxRange, Tag);
```

> **In your games:**
> - **DnD RPG**: The Rogue's footsteps are quiet (low Loudness), the Warrior's heavy armor is loud (high Loudness). Combat generates noise that alerts nearby patrols. The Wizard's Fireball explosion reports a loud noise event that draws enemies from adjacent rooms. The Bard can intentionally use `Report Noise Event` with a music tag to lure enemies to a specific location as a tactical distraction. Goblins have `Hearing Range` of 1200 (alert but not far-reaching). The Skeleton Minion has `Hearing Range` of 800 (its rotting ears are not great). Elite enemies like the Dragon Wyrmling have `Hearing Range` of 2500.
> - **Wizard's Chess**: Not used for gameplay, but could be used atmospherically: pieces "hear" the impact of a nearby capture and flinch in response.

##### Damage (UAISense_Damage)

- Triggers when damage is reported via `UAISense_Damage::ReportDamageEvent`
- Blueprint: `Report Damage Event` node
- Properties: `Max Age`

```cpp
UAISense_Damage::ReportDamageEvent(GetWorld(), DamagedActor, Instigator, DamageAmount, EventLocation, HitLocation);
```

> **In your games:**
> - **DnD RPG**: When a GAS damage Gameplay Effect applies, also call `ReportDamageEvent` so the target's AI responds immediately. This is how sleeping enemies wake up when hit. The Skeleton Minion takes damage, the damage sense fires, and the AI transitions from Patrol to Combat even if the attacker is outside sight/hearing range. The Bandit Captain uses damage sense to trigger its "call for reinforcements" behavior, alerting allies that combat has started even around corners where sight and hearing fail.
> - **Wizard's Chess**: Not directly needed since pieces do not take damage in the traditional sense. Captures are scripted events, not damage-based.

##### Touch (UAISense_Touch)

- Detects physical contact (collision) with other Actors
- Triggers when collision events occur between the AI and stimulus sources
- Properties: `Max Age`

##### Team (UAISense_Team)

- Detects Actors on the same team
- Uses the `IGenericTeamAgentInterface` to determine team affiliation
- Properties: `Max Age`

#### Stimuli Source Component

- Add `AI Perception Stimuli Source Component` to any Actor you want AI to detect
- Register specific senses the Actor can stimulate (Sight, Hearing, etc.)
- `Auto Register as Source`: Automatically register on BeginPlay
- `Register as Source for Senses`: Array of sense classes this Actor stimulates

#### Affiliation

Implement `IGenericTeamAgentInterface` on your AI Controller:
```cpp
class AMyAIController : public AAIController, public IGenericTeamAgentInterface
{
    FGenericTeamId TeamId;
    virtual FGenericTeamId GetGenericTeamId() const override { return TeamId; }
    virtual ETeamAttitude::Type GetTeamAttitudeTowards(const AActor& Other) const override;
};
```

**Team attitudes:** `Friendly`, `Neutral`, `Hostile`

> **In your games:**
> - **DnD RPG**: Set up teams: Team 0 = Player Party (player character + companions), Team 1 = Dungeon Enemies, Team 2 = Neutral NPCs (merchants, quest givers), Team 3 = Wildlife (Giant Rats, neutral until provoked). Implement `GetTeamAttitudeTowards`: Team 0 vs Team 1 = Hostile, Team 0 vs Team 2 = Neutral, Team 1 vs Team 1 = Friendly (enemies do not attack each other). Wildlife (Team 3) returns Neutral toward everyone until a damage sense event flips them to Hostile against the attacker's team. The AI DM can dynamically change team affiliations for story events (an NPC betrays the party, switching from Team 2 to Team 1).
> - **Wizard's Chess**: Team 0 = White pieces, Team 1 = Black pieces. White sees Black as Hostile and vice versa. Same-team pieces are Friendly. Used primarily for the perception-based "nervous idle" system so pieces only react to approaching enemy pieces.

---

### Navigation

The navigation system provides pathfinding, obstacle avoidance, and navmesh generation for AI movement.

#### NavMesh (Navigation Mesh)

The NavMesh is a simplified geometry representation of the walkable surface. It is generated at build time (or at runtime with dynamic features) and used for pathfinding queries.

**Setting up NavMesh:**
1. Place a `Nav Mesh Bounds Volume` in the level
2. Scale it to cover the navigable area
3. Build navigation: Build menu > Build Paths, or it builds automatically
4. Visualize: Press `P` in the viewport to toggle NavMesh display

**Key settings** (Project Settings > Navigation Mesh):

| Setting | Description | Default |
|---------|-------------|---------|
| `Agent Radius` | Radius of the navigating agent | 35 |
| `Agent Height` | Height of the navigating agent | 144 |
| `Agent Max Slope` | Maximum walkable slope in degrees | 44 |
| `Agent Max Step Height` | Maximum step the agent can climb | 35 |
| `Cell Size` | Resolution of the NavMesh grid | 19 |
| `Cell Height` | Vertical resolution | 10 |
| `Min Region Area` | Minimum area for a navmesh region | 0 |
| `Tile Size UU` | Size of each tile (0 = single tile) | 0 |
| `Runtime Generation` | Static, Dynamic, Dynamic Modifiers Only | Static |

> **In your games:**
> - **DnD RPG**: Set `Agent Radius` to 35 for humanoid enemies and companions. For larger enemies like the Dragon Wyrmling, you need a separate NavMesh with a larger agent radius (or use multiple Nav Agents in UE 5.7). Set `Agent Max Step Height` to 35 for stairs in dungeon corridors. Use `Runtime Generation: Dynamic` since the AI DM can spawn new obstacles, open/close doors, and collapse passages during play. Set `Cell Size` to 10 for tighter dungeon corridors where precision matters. Place **Nav Mesh Bounds Volumes** around each dungeon room and connecting hallways. For the tabletop view, no NavMesh is needed since miniatures are just display objects.
> - **Wizard's Chess**: A simple flat NavMesh covers the 8x8 board surface. `Agent Radius` set small (15) since pieces move in precise grid patterns. `Runtime Generation: Static` since the board never changes shape. `Agent Max Slope: 0` because the board is flat.

**Console commands:**
- `show Navigation`: Toggle NavMesh visualization
- `ai.nav.DisplayNavigationLinks 1`: Show nav links
- `RecastNavMesh-Default.DrawOffset [float]`: Adjust NavMesh draw height

#### Nav Modifiers

Nav Modifier Volumes change navigation properties in a region without blocking it entirely.

**Nav Modifier Volume:**
- Place in the level, scale to desired area
- Properties:
  - `Area Class`: The navigation area class to apply (e.g., NavArea_Obstacle, NavArea_Null, custom)
  - Overrides the default area for pathfinding cost calculations

**Built-in Area Classes:**
| Area Class | Description |
|------------|-------------|
| `NavArea_Default` | Standard walkable area (cost 1.0) |
| `NavArea_Obstacle` | High-cost area that agents avoid (cost 1000000) |
| `NavArea_Null` | Non-navigable area; treated as a hole in the NavMesh |
| `NavArea_LowHeight` | Area with reduced clearance |

> **In your games:**
> - **DnD RPG**: Create `NavArea_Trap` with a high cost (500) for areas with visible traps. Enemies will avoid them, but a desperate fleeing Goblin might still path through if no alternative exists. Use `NavArea_Null` on bottomless pits and lava pools so AI never walks into them. Create `NavArea_Water` with moderate cost (3.0) for flooded dungeon sections. Most enemies prefer dry paths, but aquatic enemies like water elementals could use a custom query filter that inverts the cost. Use **Nav Modifier Volumes** around campfire areas as `NavArea_Obstacle` during combat so enemies do not walk through fire (unless they are fire-immune).
> - **Wizard's Chess**: Use `NavArea_Null` on the squares outside the 8x8 board so pieces cannot path off the board edge. No other custom areas needed since the board is uniform.

**Custom Area Class:**
```cpp
UCLASS()
class UNavArea_Water : public UNavArea
{
    GENERATED_BODY()
public:
    UNavArea_Water();
    // Set DefaultCost and FixedAreaEnteringCost in constructor
};
```

#### Nav Links

Nav Links allow AI to traverse gaps, jump points, or teleporters that the NavMesh cannot represent.

**Nav Link Proxy:**
- Place in the level between two NavMesh regions
- Properties:
  - `Point Links`: Array of point-to-point links (simple, one-way or bi-directional)
  - `Smart Link Is Relevant`: Enable smart link behavior (custom movement, e.g., jumping)
  - `Direction`: Left to Right, Right to Left, Both Ways

**Smart Nav Links:**
- Override `ReceiveSmartLinkReached` in Blueprint
- Implement custom movement logic (jump, teleport, climb)

> **In your games:**
> - **DnD RPG**: Create **Smart Nav Links** for: dungeon ledges (enemies jump down to ambush the party), ladders (climb up/down with a climb animation), bridges with gaps (jumping across), and the Lich's teleport pads (instant teleportation between two linked circles in the boss arena). The Goblin Grunt uses a jump Nav Link to leap off elevated platforms. Override `ReceiveSmartLinkReached` to play the appropriate Montage (jump, climb, teleport VFX) and use root motion to move the character through the link. Set `Direction: Both Ways` for ladders and `Left to Right` only for one-way drops.
> - **Wizard's Chess**: The Knight's L-shaped movement does not follow standard NavMesh pathing. Use a **Smart Nav Link** that connects the Knight's current square to its valid destination squares with a custom hop animation, bypassing standard pathfinding entirely.

#### NavMesh Bounds Volume

- Defines the region where NavMesh is generated
- Only geometry within these bounds is considered for navigation
- Multiple volumes can exist in a level; they are additive
- Resize by scaling the volume actor

#### Dynamic Obstacles

- Any Actor with a collision component can act as a dynamic obstacle
- Set `Can Ever Affect Navigation` on the component to `true`
- The NavMesh will update dynamically around the obstacle (requires Runtime Generation set to Dynamic)
- `Navigation Invokers`: Only generate NavMesh around specific Actors to save memory
  - Enable via Project Settings > Navigation System > Allow Dynamic Nav Invokers
  - Add `Navigation Invoker Component` to the Actor

> **In your games:**
> - **DnD RPG**: Use **Dynamic Obstacles** for doors (opened/closed state changes NavMesh), movable crates the player can push to block corridors, and destructible walls that open new paths when the Warrior smashes through them. Set `Can Ever Affect Navigation: true` on all interactive dungeon props. For large dungeons with many rooms, enable **Navigation Invokers** so NavMesh only generates around the party and active enemies, saving memory in unexplored areas. The AI DM's dynamically spawned obstacles (cave-ins, magical barriers) need the dynamic NavMesh to update in real time.
> - **Wizard's Chess**: Pieces themselves are dynamic obstacles. When a piece occupies a square, other pieces path around it (even though chess movement is grid-based, this prevents pieces from clipping through each other during simultaneous animations).

---

### Crowd Manager

The Crowd Manager provides local avoidance and crowd simulation for multiple AI agents.

**Enabling Crowd Manager:**
- Project Settings > Navigation System > Crowd Manager Class: `UCrowdManager`
- Or set on the Navigation System Component

**Crowd Agent properties** (on the Character Movement Component):

| Property | Description |
|----------|-------------|
| `Use RVO Avoidance` | Enable Reciprocal Velocity Obstacle avoidance |
| `Avoidance Consideration Radius` | Radius for considering other agents |
| `Avoidance Weight` | Priority weight (higher = other agents avoid you more) |
| `Avoidance UID` | Unique ID for the avoidance system |
| `Avoidance Group` | Bitmask of groups this agent belongs to |
| `Groups to Avoid` | Bitmask of groups this agent avoids |
| `Groups to Ignore` | Bitmask of groups this agent ignores |

**Detour Crowd:**
- Based on the Detour library from Recast Navigation
- Handles pathfinding and local steering simultaneously
- Agents share a crowd simulation that resolves conflicts
- Enable per-agent: `UCrowdFollowingComponent` instead of `UPathFollowingComponent`

```cpp
// In your AI Controller constructor
AMyAIController::AMyAIController(const FObjectInitializer& ObjectInitializer)
    : Super(ObjectInitializer.SetDefaultSubobjectClass<UCrowdFollowingComponent>(TEXT("PathFollowingComponent")))
{
}
```

> **In your games:**
> - **DnD RPG**: Enable **RVO Avoidance** on all humanoid enemies and companions so they do not stack on top of each other during combat. Give the Warrior companion a high `Avoidance Weight` so smaller enemies move around it rather than pushing through. Set up **Avoidance Groups**: Group 1 for enemies, Group 2 for companions. Enemies avoid other enemies and companions avoid other companions, but enemies and companions do not avoid each other (they are fighting, after all). Use **Detour Crowd** via `UCrowdFollowingComponent` for the Goblin Grunt swarm encounters where 6-8 goblins rush the party simultaneously. Without crowd management, they would all try to path to the exact same point and pile up.
> - **Wizard's Chess**: Enable basic RVO avoidance so pieces moving simultaneously (rare, but possible during animations) do not clip through each other. Low priority since most moves are sequential.

---

### Smart Objects

Smart Objects provide a data-driven way to define interactive locations in the world that AI (or players) can discover and use. They decouple the interaction definition from the Actor.

**Key concepts:**
- **Smart Object Definition**: A data asset describing available "slots" and behaviors
- **Smart Object Component**: Placed on an Actor to register it with the Smart Object Subsystem
- **Slots**: Individual interaction points; each slot has a Behavior Definition and optional tags
- **Claims**: AI must claim a slot before using it; claimed slots are unavailable to others

**Creating a Smart Object:**
1. Create a Smart Object Definition asset: Content Browser > Right-click > Artificial Intelligence > Smart Object Definition
2. Add slots, each with:
   - `Activity Tags`: Gameplay Tags describing the activity
   - `Behavior Definition`: Reference to behavior (often a State Tree or Behavior Tree)
   - `User Tag Filter`: Tags the user must have to use this slot
   - `Selection Conditions`: Additional filtering logic
   - `Transform`: Offset for the slot relative to the owning Actor
3. Add a Smart Object Component to an Actor and assign the definition

**Claiming and Using Slots:**

```cpp
// Find and claim a slot
USmartObjectSubsystem* SOSubsystem = USmartObjectSubsystem::GetCurrent(GetWorld());
FSmartObjectRequestFilter Filter;
Filter.ActivityRequirements.RequireTags.AddTag(FGameplayTag::RequestGameplayTag("Activity.Sit"));

TArray<FSmartObjectRequestResult> Results;
SOSubsystem->FindSmartObjects(Filter, Results);

if (Results.Num() > 0)
{
    FSmartObjectClaimHandle ClaimHandle = SOSubsystem->Claim(Results[0]);
    // Use the claimed slot
    SOSubsystem->Use(ClaimHandle, UserActor);
    // When done
    SOSubsystem->Release(ClaimHandle);
}
```

**Blueprint workflow:**
- `Find Smart Objects` node with filter
- `Claim Smart Object` to reserve a slot
- `Use Smart Object` to activate the behavior
- `Release Smart Object` when finished

> **In your games:**
> - **DnD RPG**: Smart Objects make dungeon environments interactive. Create Smart Object Definitions for: `SO_Campfire` (enemies sit and warm hands, 2 slots), `SO_GuardPost` (enemy stands watch at a specific point, 1 slot, uses `Activity.Guard` tag), `SO_TreasureChest` (enemy checks chest contents, 1 slot), `SO_AlchemyTable` (Dark Acolyte brews potions, 1 slot with `UserTagFilter: CanUseAlchemy`), `SO_PatrolWaypoint` (generic stop-and-look-around point, 4 slots for group patrols). The claiming system prevents two Goblins from sitting in the same campfire seat. When combat starts, enemies release their Smart Object slots and transition to combat behavior. Companions use Smart Objects during rest periods: the Bard sits at a tavern bench, the Cleric prays at an altar.
> - **Wizard's Chess**: Each board square is a Smart Object with 1 slot. When a piece claims a square, no other piece can occupy it. The captured piece's slot is released when it is removed from the board. This gives you a clean, data-driven occupancy system.

**Integration with State Trees:**
- Smart Object slots can reference State Tree assets as behavior definitions
- When an AI uses a slot, the State Tree evaluates and drives the interaction

---

### State Trees

State Trees are a hierarchical state machine system introduced in UE 5.x. They combine the strengths of behavior trees (hierarchical evaluation, selectors) with state machines (explicit states and transitions). State Trees are the recommended AI framework for new projects in UE 5.7, especially when used with Mass Entity (large-scale AI) and Smart Objects.

**Key concepts:**
- **States**: Named blocks containing Tasks, transitions, and child states
- **Tasks**: Executable logic within a state (similar to BT Tasks)
- **Transitions**: Rules for moving between states based on conditions or events
- **Evaluators**: Run while the tree is active and provide data (similar to BT Services)
- **Conditions**: Transition guards that check data or world state
- **Linked Assets**: Sub-trees that can be referenced and reused
- **Schema**: Defines which node types are valid in a given State Tree (e.g., AI-only, component-based)

**Creating a State Tree:**
- Content Browser > Right-click > Artificial Intelligence > State Tree

**State Tree Schemas:**
| Schema | Use Case |
|--------|----------|
| `StateTreeAIComponentSchema` | For AI Controllers with Behavior Tree-like functionality |
| `StateTreeComponentSchema` | For any Actor component (non-AI) |

**State Properties:**
- `Selection Behavior`:
  - `None`: Execute tasks directly
  - `Try Select Children in Order`: Evaluate children top-to-bottom (like BT Selector)
  - `Try Follow Transitions`: Only transitions move to new states
- `Enter Conditions`: Conditions that must pass to enter the state
- `Tasks`: One or more tasks to execute within the state
- `Transitions`: Rules for exiting the state

**Built-in State Tree Tasks:**

| Task | Description |
|------|-------------|
| `STTask_MoveTo` | Navigate the AI to a target location |
| `STTask_Wait` | Wait for a specified duration |
| `STTask_RunBehaviorTree` | Run a legacy Behavior Tree |
| `STTask_PlayAnimation` | Play an animation montage |
| `STTask_SetValue` | Set a property binding value |
| `STTask_FindSmartObject` | Query the Smart Object subsystem |
| `STTask_UseSmartObject` | Claim and use a Smart Object slot |

> **In your games:**
> - **DnD RPG**: If you choose State Trees over Behavior Trees for certain AI, use them for companion AI where states are clearer: Follow (move behind party leader), Combat (select and attack target), Heal (find injured ally, cast heal), Guard (hold position, attack approaching enemies), Interact (use Smart Object). State Trees pair well with the companion command system since each player command maps to a state. `STTask_MoveTo` handles following and positioning. `STTask_PlayAnimation` triggers combat Montages. `STTask_FindSmartObject` with `Activity.Heal` finds wounded allies for the Cleric. The type-safe property binding avoids the Blackboard key typos that plague complex Behavior Trees.
> - **Wizard's Chess**: State Trees are a clean fit for piece AI. States: WaitForTurn > ReceiveCommand > ExecuteMove > (optional) ExecuteCapture > SettleIntoIdle. Transitions fire when the chess engine sends move data. `STTask_MoveTo` navigates to the target square. `STTask_PlayAnimation` handles attack and idle sequences. Use `STTask_UseSmartObject` to claim the destination square.

**Data Binding:**
- State Trees use property binding instead of Blackboards
- Properties can bind directly to Actor components, EQS results, or other task outputs
- Binding is type-safe and avoids the Blackboard key lookup overhead

**Running a State Tree on an AI:**
```cpp
// Add StateTreeAIComponent to your AI Controller or Pawn
UPROPERTY(VisibleAnywhere)
UStateTreeAIComponent* StateTreeComponent;

// In constructor
StateTreeComponent = CreateDefaultSubobject<UStateTreeAIComponent>(TEXT("StateTree"));
StateTreeComponent->SetStateTree(MyStateTreeAsset);
```

> **In your games:**
> - **DnD RPG**: Consider a hybrid approach. Use **Behavior Trees** for enemies (25 types with deeply branching combat logic, conditional aborts, and EQS queries suit BTs well). Use **State Trees** for companions (clear command-based states, simpler transition logic, and the property binding system reduces bugs when the player switches commands rapidly). Use State Trees for NPC interactions driven by **Smart Objects** (sit, talk, trade, quest-give). This way you get the best of both systems without forcing one paradigm on every AI type.
> - **Wizard's Chess**: **State Trees** are the recommended choice here. The piece lifecycle is inherently state-based (idle, moving, attacking, dying), transitions are clean and predictable, and the Smart Object integration for board squares fits naturally. No need for Behavior Trees since there is no complex branching decision-making at the piece level; the chess engine handles strategy.

---
