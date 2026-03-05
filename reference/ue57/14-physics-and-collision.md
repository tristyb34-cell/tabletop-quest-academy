## Physics and Collision

UE 5.7 uses the Chaos physics engine as its sole physics backend. Chaos handles rigid body dynamics, collision detection and response, constraints, ragdolls, destruction, and cloth simulation.

---

### Chaos Physics Engine Settings

**Project Settings > Physics:**

| Setting | Description |
|---------|-------------|
| `Physics Prediction` | Enable client-side physics prediction for networking |
| `Default Gravity Z` | World gravity (default: -980.0, approximately Earth gravity in cm/s^2) |
| `Default Terminal Velocity` | Maximum fall speed |
| `Max Physics Delta Time` | Maximum physics step time (prevents spiral of death) |
| `Max Substep Delta Time` | Maximum time per substep |
| `Max Substeps` | Maximum number of substeps per frame |
| `Enable Async Physics` | Run physics on a dedicated thread |
| `Async Fixed Time Step Override` | Fixed time step for async physics (0 = use frame delta) |
| `Friction Combine Mode` | Average, Min, Max, Multiply |
| `Restitution Combine Mode` | Average, Min, Max, Multiply |
| `Enable Enhanced Determinism` | Improve determinism at a performance cost |

**Console commands:**
- `p.MaxPhysicsDeltaTime [float]`: Override max physics delta time
- `p.FixPhysicsDeltaTime [float]`: Fix physics to a constant delta time (0 = variable)
- `p.Gravity [X Y Z]`: Override gravity
- `p.EnableAsyncScene [0/1]`: Toggle async physics
- `p.Chaos.Solver.Iterations [int]`: Number of solver iterations (higher = more stable, slower)
- `p.Chaos.Solver.CollisionIterations [int]`: Collision solver iterations
- `p.Chaos.Solver.JointIterations [int]`: Joint solver iterations
- `p.Chaos.Solver.PushOutIterations [int]`: Push-out iterations for penetration resolution

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Enhanced Determinism** is worth enabling for dice rolls. When the Warrior rolls a D20 for an attack check, the dice physics must produce the same result given the same initial conditions. Without determinism, micro-differences between frames could change the outcome. The performance cost is acceptable since dice physics only runs briefly.
> - **Max Substeps = 4** and **Max Substep Delta Time = 0.008** for accurate dice bouncing. Dice are small, fast-moving objects that can tunnel through the tabletop surface if substeps are too coarse. Higher substep counts keep the dice from falling through the table on low-framerate machines.
> - **Gravity Z = -980** (Earth normal) for the tabletop world. Dice and miniatures should feel real-world weight. If you want a slow-motion dice roll effect, temporarily override with `p.Gravity 0 0 -300` during the dramatic "natural 20" camera zoom, then restore to -980.
> - **Async Physics** enabled to keep dice simulation off the main thread. When multiple dice roll simultaneously (like 4d6 for a Wizard's Fireball damage), the physics workload spikes and async prevents frame drops.
>
> **Wizard's Chess:**
> - **Restitution Combine Mode = Max** so the bounciest object in a pair wins. Stone chess piece debris hitting a marble floor should bounce based on the marble's restitution, not average the two.
> - **Enable Enhanced Determinism** for debris scattering. When a Rook shatters a Pawn, you want the debris to fly consistently so you can design the visual to look great every time, not randomly.
> - **Max Substeps = 3** for piece debris physics. Small fragments flying at high speed need substeps to avoid tunneling through the board or other pieces.
> - **Gravity Z = -980** for realistic debris falling, but consider temporarily setting lighter gravity (-500) on specific debris fragments to make them hang in the air briefly for dramatic effect, like slow-motion shattering.

---

### Collision Channels

Collision channels define categories of objects. There are two types: Object Channels and Trace Channels.

#### Default Object Channels

| Channel | Enum | Description |
|---------|------|-------------|
| `WorldStatic` | `ECC_WorldStatic` | Static level geometry (floors, walls) |
| `WorldDynamic` | `ECC_WorldDynamic` | Movable objects (doors, platforms) |
| `Pawn` | `ECC_Pawn` | Characters, player pawns |
| `PhysicsBody` | `ECC_PhysicsBody` | Simulated physics objects |
| `Vehicle` | `ECC_Vehicle` | Vehicles |
| `Destructible` | `ECC_Destructible` | Destructible meshes |

#### Default Trace Channels

| Channel | Enum | Description |
|---------|------|-------------|
| `Visibility` | `ECC_Visibility` | General visibility traces (line of sight) |
| `Camera` | `ECC_Camera` | Camera collision traces (spring arm, etc.) |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **WorldStatic** for dungeon walls, floors, ceilings, the tabletop surface, and static dungeon props (barrels, bookshelves, pillars).
> - **WorldDynamic** for interactive dungeon elements: doors that open, treasure chests, levers, movable boulders.
> - **Pawn** for all characters: Warrior, Rogue, Cleric, Wizard, Ranger, Bard, plus all AI enemies (Goblins, Skeletons, Wraiths, Dragons).
> - **PhysicsBody** for dice, loose dungeon debris (knocked-over chairs, broken crates), and loot items that drop and bounce.
> - **Destructible** for breakable dungeon props: smashable crates, crumbling walls the Warrior can bash through, destructible enemy barriers.
> - **Visibility** for line-of-sight checks: can the Ranger see the Goblin? Can the Wizard target the Skeleton through the doorway?
> - **Camera** for the spring arm during both tabletop view (keeping camera above the table) and 3D dungeon view (preventing clipping through walls).
>
> **Wizard's Chess:**
> - **WorldStatic** for the chessboard, the room floor, walls, columns, and decorative architecture.
> - **WorldDynamic** for the chess pieces themselves (they move but are not physics-simulated during gameplay, just animated).
> - **PhysicsBody** for debris fragments after a piece capture. These are physics-simulated chunks that scatter and bounce.
> - **Destructible** for the chess pieces' shatter meshes. When captured, the piece switches from its intact WorldDynamic mesh to a Destructible mesh that breaks apart.
> - **Visibility** for determining which squares are highlighted during piece selection (trace from camera through mouse cursor to board).

#### Custom Channels

- Project Settings > Collision > New Object Channel / New Trace Channel
- Maximum of 18 custom channels (total of 32 channels including defaults)
- Each custom channel needs a name and a default response (Block, Overlap, Ignore)

**Accessing custom channels in C++:**
```cpp
// Custom channels are assigned ECC_GameTraceChannel1 through ECC_GameTraceChannel18
// Reference them via the enum or the configured name
ECollisionChannel MyCustomChannel = ECC_GameTraceChannel1;
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> Create these custom channels:
> - **Dice** (Object Channel): For dice specifically. Dice block WorldStatic (table, walls) and other Dice, but ignore Pawns and WorldDynamic so they roll freely across the tabletop without getting stuck on miniatures.
> - **SpellProjectile** (Object Channel): For Wizard Fireballs, Ranger arrows, Cleric holy bolts. These block Pawns (to hit enemies) and WorldStatic (to hit walls), but ignore other SpellProjectiles so two spells can pass through each other.
> - **AbilityTrace** (Trace Channel): For ability targeting. The Wizard's Fireball targeting reticle traces against this channel. Enemies respond with Block (valid targets), allies with Ignore (can't target friendlies), walls with Block (line of sight blockers).
> - **InteractTrace** (Trace Channel): For interactive object detection. Traces from the player to find doors, chests, levers, and loot. Only WorldDynamic objects with the "Interactable" tag respond.
>
> **Wizard's Chess:**
> Create these custom channels:
> - **ChessPiece** (Object Channel): All chess pieces use this channel. They block each other (pieces can't occupy the same square) and block WorldStatic (board edges).
> - **BoardSquare** (Trace Channel): For mouse-to-board traces that determine which square the player clicked. Only the board's square collision meshes respond to this channel.
> - **Debris** (Object Channel): For shattered piece fragments. Debris blocks WorldStatic (board, floor) but ignores ChessPiece (debris flies through intact pieces for visual clarity).

---

### Collision Responses

Each collision component defines how it responds to every channel.

| Response | Description |
|----------|-------------|
| `Block` | Both objects stop; generates Hit events |
| `Overlap` | Objects pass through each other; generates Overlap events if enabled |
| `Ignore` | No interaction at all; no events generated |

**Rules:**
- Both objects must Block each other for a Block to occur
- At least one object must have `Generate Overlap Events` enabled for Overlap events
- If either object Ignores the other's channel, no interaction occurs
- Block + Overlap = Overlap (the weaker response wins between the pair)

**Setting responses in C++:**
```cpp
UPrimitiveComponent* Comp = GetMesh();
Comp->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);
Comp->SetCollisionResponseToAllChannels(ECR_Block);
Comp->SetCollisionResponseToChannel(ECC_Visibility, ECR_Ignore);
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Spell area-of-effect zones** use Overlap responses: the Wizard's Fireball explosion spawns a sphere that overlaps Pawns (to detect which Goblins are inside the blast radius) but ignores WorldStatic (the fireball effect should not stop at a doorframe, it should pass through and hit enemies on the other side of the opening).
> - **Loot items** overlap Pawns: when the Rogue walks over a dropped gold pile, an Overlap event fires to trigger the pickup prompt. The loot does not physically block character movement.
> - **Dungeon doors** block everything by default, but when opened, switch to `Ignore` on the Pawn channel so characters can walk through. Use `SetCollisionResponseToChannel(ECC_Pawn, ECR_Ignore)` in the door's Open function.
> - **Dice** block WorldStatic (bounce off the table) and block other dice (they clatter off each other) but ignore Pawns (roll through miniature bases).
>
> **Wizard's Chess:**
> - **Chess pieces during movement** overlap each other (they slide past neighboring pieces during animation) but block WorldStatic (they cannot leave the board area).
> - **Captured piece debris** blocks WorldStatic (fragments bounce off the board and floor) but overlaps ChessPiece (debris passes through remaining pieces cleanly).
> - **Board highlight squares** use Overlap only: they detect the player's cursor trace for square selection without physically blocking anything.

---

### Collision Presets

Collision Presets are saved configurations of Object Type + Response settings. They provide quick setup without manually configuring each channel.

#### Built-in Presets

| Preset | Object Type | Description |
|--------|-------------|-------------|
| `Default` | WorldStatic | Blocks everything |
| `NoCollision` | WorldStatic | All channels set to Ignore; collision disabled |
| `BlockAll` | WorldStatic | Blocks all channels |
| `BlockAllDynamic` | WorldDynamic | Blocks all channels, object type is WorldDynamic |
| `OverlapAll` | WorldStatic | Overlaps all channels |
| `OverlapAllDynamic` | WorldDynamic | Overlaps all channels |
| `OverlapOnlyPawn` | WorldStatic | Overlaps Pawn, ignores everything else |
| `Pawn` | Pawn | Blocks WorldStatic/WorldDynamic, overlaps Pawns |
| `Spectator` | Pawn | Ignores everything (ghost mode) |
| `CharacterMesh` | Pawn | Used for character skeletal meshes; typically overlaps most channels |
| `PhysicsActor` | PhysicsBody | Blocks everything; simulates physics |
| `Destructible` | Destructible | Blocks everything; supports Chaos destruction |
| `InvisibleWall` | WorldStatic | Blocks Pawns and dynamic objects; invisible |
| `InvisibleWallDynamic` | WorldDynamic | Dynamic invisible wall |
| `Trigger` | WorldDynamic | Overlaps everything; no blocking; used for trigger volumes |
| `Ragdoll` | PhysicsBody | Used during ragdoll simulation |
| `Vehicle` | Vehicle | Blocks WorldStatic, WorldDynamic, Pawn; ignores Visibility |
| `UI` | WorldDynamic | Used for 3D UI elements |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Pawn** preset for all character capsule components: Warrior, Rogue, Cleric, Wizard, Ranger, Bard, and all AI enemies. They block walls and floors, overlap each other (no character-to-character physics pushing in turn-based mode).
> - **PhysicsActor** preset for dice. They block everything and simulate full physics.
> - **Trigger** preset for dungeon trap trigger zones (pressure plates, tripwires, magical wards). The Rogue can detect and disarm them; other classes walk through and trigger the trap.
> - **Destructible** preset for breakable dungeon props (crates, barrels, weak walls). The Warrior's Heavy Strike ability can smash through these.
> - **Ragdoll** preset applied to enemy skeletal meshes on death. When the Warrior kills a Goblin, switch from `Pawn` to `Ragdoll` preset so the body crumples naturally.
> - **InvisibleWall** preset for dungeon boundaries: invisible blockers at map edges that prevent characters from walking off the playable area.
> - **Spectator** preset for the AI DM's camera. The DM "flies" through the dungeon to preview areas, ignoring all collision.
>
> **Wizard's Chess:**
> - **BlockAllDynamic** for chess pieces during idle (they sit on their squares and block everything).
> - **NoCollision** on chess pieces during their move animation (they float/slide to the destination without colliding with other pieces).
> - **PhysicsActor** for debris fragments after a capture.
> - **Destructible** for the intact piece mesh just before it shatters.
> - **Trigger** for the board square highlight volumes that detect mouse hover.
> - **InvisibleWall** around the board perimeter so debris does not fly too far off the playing area.

#### Custom Presets

- Project Settings > Collision > Preset > New
- Define: Name, Collision Enabled state, Object Type, and per-channel responses
- Select on any component via Details panel > Collision > Collision Presets dropdown

> **In your games:**
>
> **DnD Tabletop RPG:**
> Create these custom presets:
> - **DicePhysics**: Object Type = PhysicsBody. Blocks WorldStatic, blocks PhysicsBody (other dice), overlaps Pawn (rolls through characters). This is your dedicated dice preset, applied to every D4, D6, D8, D10, D12, and D20 mesh.
> - **SpellProjectile**: Object Type = WorldDynamic. Blocks Pawn and WorldStatic (hits enemies and walls), ignores PhysicsBody and other WorldDynamic (passes through dice and doors). Overlaps custom AbilityTrace channel.
> - **LootPickup**: Object Type = WorldDynamic. Overlaps Pawn only (triggers pickup), ignores everything else. No physics simulation needed.
> - **TabletopMiniature**: Object Type = WorldDynamic. Blocks WorldStatic (sits on the table), overlaps Pawn (miniatures don't physically block each other on the tabletop).
>
> **Wizard's Chess:**
> - **ChessPieceIdle**: Object Type = WorldDynamic. Blocks WorldStatic, blocks custom ChessPiece channel, blocks Visibility trace (so mouse traces can hit pieces for selection).
> - **ChessPieceMoving**: Object Type = WorldDynamic. Blocks nothing, collision enabled for query only (still responds to board square traces but does not physically collide with anything during animation).
> - **CaptureDebris**: Object Type = PhysicsBody. Blocks WorldStatic (bounces off board/floor), ignores ChessPiece channel (passes through intact pieces), ignores Pawn.

---

### Physics Materials

Physics Materials define surface properties that affect how objects interact physically.

**Creating a Physics Material:**
- Content Browser > Right-click > Physics > Physical Material

**Properties:**

| Property | Description | Default |
|----------|-------------|---------|
| `Friction` | Coulomb friction coefficient (0.0 = ice, 1.0 = rubber) | 0.7 |
| `Static Friction` | Override for static friction (if different from dynamic) | 0.0 (uses Friction) |
| `Restitution` | Bounciness (0.0 = no bounce, 1.0 = perfect bounce) | 0.3 |
| `Density` | Mass density in kg/cm^3 (used to calculate mass from volume) | 1.0 |
| `Raise Mass to Power` | Exponent applied to mass calculation | 0.75 |
| `Override Friction Combine Mode` | Override the project-level combine mode | False |
| `Friction Combine Mode` | Average, Min, Max, Multiply | Average |
| `Override Restitution Combine Mode` | Override the project-level combine mode | False |
| `Restitution Combine Mode` | Average, Min, Max, Multiply | Average |
| `Surface Type` | Physical surface type for footsteps, impacts, etc. (SurfaceType1-62) | Default |

**Assigning:**
- On Static/Skeletal Mesh components: Details > Physics > Simple Collision Physical Material
- On Physics Assets: Per-body override
- On Materials: Physical Material property in the material asset

> **In your games:**
>
> **DnD Tabletop RPG:**
> Create a suite of physics materials for dice and dungeon surfaces:
> - **PM_WoodenTable**: `Friction = 0.6`, `Restitution = 0.2`, `Surface Type = SurfaceType1 (Wood)`. The tabletop surface where dice roll. Moderate friction so dice slow down naturally. Low bounce so they settle quickly.
> - **PM_MetalDice**: `Friction = 0.3`, `Restitution = 0.5`, `Density = 7.8` (steel density). Heavy, clicky dice that bounce with a satisfying ring. The higher restitution makes them bounce several times before settling.
> - **PM_StoneDungeon**: `Friction = 0.7`, `Restitution = 0.1`, `Surface Type = SurfaceType2 (Stone)`. Dungeon floors and walls. High friction (rough stone), very low bounce. Use the Surface Type to trigger stone footstep sounds when characters walk.
> - **PM_WoodFloor**: `Friction = 0.5`, `Restitution = 0.15`, `Surface Type = SurfaceType1 (Wood)`. Tavern floors and wooden platforms. Triggers wood footstep sounds.
> - **PM_CrystalDice**: `Friction = 0.2`, `Restitution = 0.7`, `Density = 2.5`. Premium crystal dice that slide farther and bounce higher. Fun visual and audio variety.
> - **PM_DirtCave**: `Friction = 0.9`, `Restitution = 0.0`, `Surface Type = SurfaceType3 (Dirt)`. Cave floors with soft dirt. Maximum friction, zero bounce. Dice would thud and stop immediately if rolled here.
>
> **Wizard's Chess:**
> - **PM_MarbleBoard**: `Friction = 0.4`, `Restitution = 0.3`, `Surface Type = SurfaceType4 (Marble)`. The polished chess board surface. Debris fragments slide a bit before stopping and produce satisfying marble-on-marble clinking sounds.
> - **PM_StonePiece**: `Friction = 0.5`, `Restitution = 0.2`, `Density = 2.4` (granite density). The chess pieces themselves. Dense and heavy for satisfying collisions.
> - **PM_StoneDebris**: `Friction = 0.6`, `Restitution = 0.4`. Debris fragments. Slightly bouncier than intact pieces so shattered chunks scatter convincingly.
> - **PM_RoomFloor**: `Friction = 0.7`, `Restitution = 0.1`. The floor around the board where debris can land. High friction stops fragments from sliding too far.

---

### Constraints (Physics Constraints)

Physics Constraints join two physics bodies together with configurable limits.

**Creating a Constraint:**
- Add a `Physics Constraint Component` to an Actor
- Or define constraints in a Physics Asset for skeletal meshes

#### Limit Types

Each axis (Linear X, Y, Z and Angular Swing1, Swing2, Twist) has three modes:

| Mode | Description |
|------|-------------|
| `Free` | No restriction on this axis |
| `Limited` | Movement is allowed within a defined range |
| `Locked` | No movement on this axis |

#### Linear Limits

| Property | Description |
|----------|-------------|
| `X Motion` / `Y Motion` / `Z Motion` | Free, Limited, or Locked |
| `Limit` | Maximum linear distance (when Limited) |
| `Restitution` | Bounciness at the limit |
| `Contact Distance` | Distance at which the limit starts to engage |
| `Soft Constraint` | Use a spring instead of a hard limit |
| `Stiffness` | Spring stiffness (soft constraint) |
| `Damping` | Spring damping (soft constraint) |

#### Angular Limits

| Property | Description |
|----------|-------------|
| `Swing 1 Motion` | Limit around the first swing axis |
| `Swing 2 Motion` | Limit around the second swing axis |
| `Twist Motion` | Limit around the twist axis |
| `Swing 1 Limit Angle` | Maximum swing angle in degrees |
| `Swing 2 Limit Angle` | Maximum swing angle in degrees |
| `Twist Limit Angle` | Maximum twist angle in degrees |

#### Motors

Motors apply forces to drive the constraint toward a target.

| Property | Description |
|----------|-------------|
| `Position Drive` | Drive toward a target position (linear) |
| `Velocity Drive` | Drive toward a target velocity (linear) |
| `Angular Position Drive` | Drive toward a target orientation |
| `Angular Velocity Drive` | Drive toward a target angular velocity |
| `Target Position` | Goal position for position drive |
| `Target Velocity` | Goal velocity |
| `Target Orientation` | Goal rotation |
| `Drive Spring` | Spring strength for the drive |
| `Drive Damping` | Damping for the drive |
| `Max Force` | Maximum force the motor can apply |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Dungeon door hinges**: Use a Physics Constraint between the door body and the door frame. Lock Linear X/Y/Z (door stays in place), set Twist to Free (door swings open), lock Swing 1 and Swing 2 (no tilting). Add an Angular Velocity Drive motor so the door swings shut slowly after being pushed open, like a heavy dungeon gate.
> - **Chain physics on hanging dungeon lamps**: Constrain each chain link to its neighbor with Limited Swing (15 degrees) and Locked Twist. When the Warrior runs past, the chains sway naturally. Use Soft Constraint with moderate Stiffness (500) and Damping (50) for smooth, weighted swinging.
> - **Treasure chest lid**: Constraint between the lid and the base. Lock all linear axes. Set Swing 1 to Limited (90 degrees max, so the lid opens to 90 degrees and stops). Apply a Position Drive motor to hold the lid open once the Rogue unlocks it.
> - **Dice cup constraint**: If the player shakes a dice cup before rolling, constrain the dice inside the cup volume with Limited linear motion. The dice rattle around inside (satisfying sound), then release the constraint to let them fly out onto the table.
>
> **Wizard's Chess:**
> - **Piece fragment tethering**: After a piece shatters, some fragments can be loosely tethered with soft constraints (high Stiffness, low Damping) to create a brief "held together by magic" moment before the constraint breaks and fragments scatter. This sells the magical destruction effect.
> - **Board piece slots**: Use a soft linear constraint to keep pieces centered on their squares during idle. `Stiffness = 10000`, `Damping = 500`. If the board gets bumped (ambient shake effect), pieces wobble slightly but snap back to center.

---

### Ragdoll Setup and Physics Assets

**Physics Assets** define the physics bodies and constraints for a Skeletal Mesh.

**Creating a Physics Asset:**
- Right-click a Skeletal Mesh > Create > Physics Asset
- Opens the Physics Asset Editor (PhAT)

**Physics Asset Editor (PhAT) workflow:**
1. **Bodies**: Each bone can have one or more physics bodies (shapes)
   - Shape types: Sphere, Sphyl (capsule), Box, Convex, Tapered Capsule
   - Adjust shape position, rotation, and size to fit the mesh
2. **Constraints**: Automatically generated between parent-child bone pairs
   - Configure angular limits, linear limits, and motors
3. **Simulation**: Test button in the toolbar to preview ragdoll behavior

**Activating ragdoll at runtime:**

Blueprint:
- `Set All Bodies Simulate Physics`: Enable physics on all bodies
- `Set All Bodies Below Physics Blend Weight`: Blend between animation and physics

C++:
```cpp
USkeletalMeshComponent* Mesh = GetMesh();

// Full ragdoll
Mesh->SetSimulatePhysics(true);
Mesh->SetCollisionProfileName(FName("Ragdoll"));

// Partial ragdoll (blend)
Mesh->SetAllBodiesBelowSimulatePhysics(FName("spine_03"), true, true);
Mesh->SetAllBodiesBelowPhysicsBlendWeight(FName("spine_03"), 1.0f);
```

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Enemy death ragdolls**: When a Goblin's health reaches zero, switch its skeletal mesh to full ragdoll. The Goblin crumples where it was hit. If the Warrior's Heavy Strike killed it, apply an impulse in the sword swing direction so the body flies backward convincingly.
> - **Partial ragdoll for stagger**: When a Skeleton takes a big hit but does not die, use partial ragdoll on `spine_03` and above. The upper body reacts to the impact (head snaps back, arms flail) while the legs stay planted in the walk animation. Blend weight of 0.6 gives a nice mix of physics reaction and animation stability.
> - **Dragon death**: For the Dragon boss, use full ragdoll on death but with very high mass bodies. The Dragon should collapse heavily, not bounce around like a toy. Set the wing bone constraints to Limited swing (wings fold down naturally, not splay unnaturally).
> - **Wraith special case**: Wraiths are ghostly, so instead of ragdoll on death, use a partial ragdoll on the cloth/robe bones while playing a dissolve animation. The robe crumples as the Wraith fades away.
> - **PhAT setup for humanoid enemies**: Use capsules for limbs, a box for the torso, and a sphere for the head. Set arm swing limits to 90 degrees and knee twist to 0 (knees don't twist in real life). Test by pressing Simulate and watching the ragdoll fall; adjust body sizes until it looks natural.
>
> **Wizard's Chess:**
> - If chess pieces are rigged with skeletal meshes (e.g., the Knight is an animated horse), use partial ragdoll when captured. The Knight rears up in its death animation, then the upper body goes ragdoll and crumbles while physics debris spawns around it.
> - For simpler piece designs (solid stone figures), skip ragdoll entirely and use Chaos Destruction for the shatter effect instead. Ragdoll is best reserved for characters with articulated joints.

---

### Trace Channels vs Object Channels

| Aspect | Object Channels | Trace Channels |
|--------|----------------|----------------|
| Purpose | Categorize objects for collision | Categorize line/shape traces |
| Used by | Collision components (static meshes, capsules) | Line traces, shape traces, sweeps |
| Example | WorldStatic, Pawn, Vehicle | Visibility, Camera |
| Response | Block, Overlap, Ignore | Block, Ignore (no Overlap for traces) |
| Configuration | Set on components | Passed as parameter to trace functions |

Both channel types appear in the same collision response matrix on components. An object can respond differently to object channels and trace channels.

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Object Channels** define what things ARE: Warrior is a Pawn, dice are PhysicsBody, dungeon walls are WorldStatic, spell projectiles are SpellProjectile (custom).
> - **Trace Channels** define what you are LOOKING FOR: AbilityTrace for targeting spells (only enemies respond), InteractTrace for finding interactive objects (only doors/chests/levers respond), Visibility for line-of-sight (walls block, allies ignore).
> - A dungeon door responds to both: it is a WorldDynamic object (Object Channel) that also blocks AbilityTrace (you cannot cast through closed doors) and blocks Visibility (you cannot see through them). But it responds to InteractTrace with Block (so the player can click it to open).
>
> **Wizard's Chess:**
> - **Object Channels**: Pieces are ChessPiece (custom), board is WorldStatic, debris is PhysicsBody.
> - **Trace Channels**: BoardSquare trace finds which square the cursor is over. The board surface blocks this trace; pieces ignore it (you want to find the square beneath the piece, not the piece itself). A separate Visibility trace is used for piece selection, where pieces block and the board ignores.

---

### Line Traces, Shape Traces, and Overlap Tests

#### Line Traces

```cpp
FHitResult Hit;
FVector Start = GetActorLocation();
FVector End = Start + GetActorForwardVector() * 5000.f;
FCollisionQueryParams Params;
Params.AddIgnoredActor(this);

// Single hit
bool bHit = GetWorld()->LineTraceSingleByChannel(Hit, Start, End, ECC_Visibility, Params);

// Multi hit (penetrating)
TArray<FHitResult> Hits;
GetWorld()->LineTraceMultiByChannel(Hits, Start, End, ECC_Visibility, Params);

// By object type
FCollisionObjectQueryParams ObjectParams;
ObjectParams.AddObjectTypesToQuery(ECC_Pawn);
GetWorld()->LineTraceSingleByObjectType(Hit, Start, End, ObjectParams, Params);
```

#### Shape Traces (Sweeps)

```cpp
FCollisionShape Shape;

// Sphere sweep
Shape = FCollisionShape::MakeSphere(50.f);
GetWorld()->SweepSingleByChannel(Hit, Start, End, FQuat::Identity, ECC_Visibility, Shape, Params);

// Box sweep
Shape = FCollisionShape::MakeBox(FVector(50.f, 50.f, 50.f));
GetWorld()->SweepSingleByChannel(Hit, Start, End, FQuat::Identity, ECC_Visibility, Shape, Params);

// Capsule sweep
Shape = FCollisionShape::MakeCapsule(34.f, 88.f);
GetWorld()->SweepSingleByChannel(Hit, Start, End, FQuat::Identity, ECC_Pawn, Shape, Params);
```

#### Overlap Tests

```cpp
TArray<FOverlapResult> Overlaps;
FCollisionShape SphereShape = FCollisionShape::MakeSphere(500.f);

// Overlap by channel
GetWorld()->OverlapMultiByChannel(Overlaps, Location, FQuat::Identity, ECC_Pawn, SphereShape, Params);

// Overlap by object type
GetWorld()->OverlapMultiByObjectType(Overlaps, Location, FQuat::Identity, ObjectParams, SphereShape, Params);
```

**Blueprint equivalents:**
- `Line Trace By Channel` / `Line Trace By Channel (Multi)`
- `Sphere Trace By Channel` / `Box Trace By Channel` / `Capsule Trace By Channel`
- `Sphere Overlap Actors` / `Box Overlap Actors`

**Debug drawing:**
- `DrawDebugLine`, `DrawDebugSphere`, `DrawDebugBox`
- Console: `p.VisualizeOverlaps 1`

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Line Trace for Ranger's arrow**: Trace from the Ranger's bow tip in the aim direction using the AbilityTrace channel. `LineTraceSingleByChannel` finds the first enemy hit. If it hits a wall first, the arrow stops there. `AddIgnoredActor(this)` prevents the Ranger from shooting themselves.
> - **Multi Line Trace for Lightning Bolt**: The Wizard's Lightning Bolt pierces through multiple enemies. Use `LineTraceMultiByChannel` against the Pawn channel. Every Goblin in the line takes damage. Process the `Hits` array to apply damage to each.
> - **Sphere Overlap for Fireball explosion**: At the impact point, do `OverlapMultiByChannel` with a 500cm sphere against ECC_Pawn. Every enemy inside the sphere radius takes damage. This is simpler and more performant than spawning a collision sphere Actor.
> - **Capsule Sweep for the Warrior's cleave attack**: Sweep a capsule in an arc in front of the Warrior to detect all enemies in the swing path. More accurate than a sphere overlap because it follows the sword's actual arc trajectory.
> - **Line Trace for dice landing**: After a die settles, trace downward from the die center to determine which face is pointing up. The trace hits the internal face mesh and returns the face number.
> - **Box Overlap for turn-based grid detection**: Use a box overlap at a grid cell position to check if any Pawn occupies that square.
>
> **Wizard's Chess:**
> - **Line Trace for piece selection**: Trace from the camera through the mouse cursor position using the Visibility channel. If the hit Actor is a chess piece belonging to the current player, select it. `LineTraceSingleByChannel` returns the first piece hit.
> - **Line Trace for square selection**: After selecting a piece, trace again using the custom BoardSquare channel. Pieces ignore this channel, so the trace passes through them and hits the board, returning which square the player is targeting.
> - **Sphere Overlap for capture detection**: When a piece moves to a new square, do a small sphere overlap (radius = half a square) at the destination to check if an enemy piece occupies that square. If so, trigger the capture animation.

---

### Physical Animation

Physical Animation blends physics simulation with animated motion on skeletal meshes.

**Physical Animation Component:**
- Add `Physical Animation Component` to an Actor
- Call `Apply Physical Animation Settings Below` to configure which bones blend physics

**Properties per bone:**

| Property | Description |
|----------|-------------|
| `Is Local Simulation` | Simulate in local space instead of world |
| `Orientation Strength` | How strongly animation drives orientation |
| `Angular Velocity Strength` | Damping for angular velocity |
| `Position Strength` | How strongly animation drives position |
| `Velocity Strength` | Damping for linear velocity |
| `Max Linear Force` | Maximum force applied to match animation |
| `Max Angular Force` | Maximum torque applied to match animation |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Warrior hit reactions**: Apply Physical Animation to the Warrior's upper body (spine_03 and above). Set `Orientation Strength = 0.7` and `Position Strength = 0.8` so the animation mostly drives the body, but a sword hit from a Goblin adds a physics impulse that makes the torso jerk realistically. The animation recovers naturally because the strength values pull the body back to the pose.
> - **Bard instrument sway**: Apply Physical Animation to the Bard's arms and lute. Low `Orientation Strength = 0.3` on the instrument bone lets it swing and bounce slightly with the Bard's movement, adding organic secondary motion to the lute during walking.
> - **Cleric's robes and cape**: Apply Physical Animation to cloth-like bones (if using bone-driven cloth). `Position Strength = 0.2` lets the robes follow gravity and momentum while the underlying animation guides the general shape.
> - **Dragon wing sway**: High `Orientation Strength = 0.9` on wing root bones (animation-driven for flight), dropping to `0.3` on wing tips. The tips flop and react to air resistance while the root stays controlled.
>
> **Wizard's Chess:**
> - **Knight piece wobble**: If the Knight is a horse figure with articulated legs, apply Physical Animation with `Orientation Strength = 0.95`. Mostly animation-driven, but a tiny physics influence makes the Knight's head bob slightly when it lands on a square, adding weight and life.

**Physics Simulation Settings (per component):**

| Setting | Description |
|---------|-------------|
| `Simulate Physics` | Enable physics simulation |
| `Mass in Kg` | Override mass (0 = auto from volume and density) |
| `Linear Damping` | Resistance to linear movement (0 = none) |
| `Angular Damping` | Resistance to rotation (0 = none) |
| `Enable Gravity` | Whether gravity affects this body |
| `Lock Position X/Y/Z` | Lock movement on specific axes |
| `Lock Rotation X/Y/Z` | Lock rotation on specific axes |
| `Max Angular Velocity` | Clamp angular velocity (degrees/second) |
| `Max Depenetration Velocity` | Maximum velocity for resolving overlaps |
| `CCD` | Continuous Collision Detection for fast-moving objects |
| `Start Awake` | Whether the body starts simulating or sleeps until disturbed |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Dice physics tuning**: `Mass in Kg = 0.03` (real D20 weight), `Linear Damping = 0.5` (dice slow down after bouncing), `Angular Damping = 0.3` (spin decays naturally). Enable **CCD** because dice are small and fast; without CCD they can tunnel through the thin tabletop surface mesh. `Max Angular Velocity = 3600` (10 full rotations per second max, preventing absurd spinning).
> - **Loot drops**: `Mass in Kg = 0.1` for gold coins, `Enable Gravity = true`, `Start Awake = true` (drops immediately when spawned from enemy corpse). `Linear Damping = 2.0` so coins settle quickly and don't roll forever.
> - **Dungeon boulder trap**: `Mass in Kg = 500`, `Linear Damping = 0.01` (barely slows down as it rolls toward the party), `Angular Damping = 0.05`. The boulder is terrifyingly heavy and unstoppable.
> - **Lock Position Z** on tabletop miniatures when in overhead view so they never fall through the table.
>
> **Wizard's Chess:**
> - **Piece debris fragments**: `Mass in Kg` ranges from 0.01 (small chips) to 0.5 (large chunks). `Linear Damping = 1.0` and `Angular Damping = 1.5` so fragments settle within 2-3 seconds. Enable **CCD** on the smallest fragments.
> - **Chess pieces during idle**: `Simulate Physics = false`, `Enable Gravity = false`. Pieces are animation/code-driven during gameplay. Only enable physics on the captured piece for its shatter moment.
> - `Start Awake = false` for debris that spawns at rest inside the piece mesh. They only wake and scatter when the destruction force is applied.

---

### Collision Profiles

Collision profiles are the same as collision presets (detailed in the Collision Presets section above). They combine:
1. Collision Enabled state: No Collision, Query Only, Physics Only, Query and Physics
2. Object Type assignment
3. Per-channel response settings

**Collision Enabled modes:**

| Mode | Description |
|------|-------------|
| `No Collision` | Completely disabled; no queries, no physics |
| `Query Only (No Physics Collision)` | Participates in traces and overlaps but not physics simulation |
| `Physics Only (No Query Collision)` | Participates in physics but not in traces or overlaps |
| `Collision Enabled (Query and Physics)` | Full collision; both queries and physics |

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Spell visual effects** (fire trails, ice shards, holy light beams): `No Collision`. These are purely cosmetic and should never interact with physics or traces.
> - **Ability targeting reticle**: `Query Only`. The targeting circle on the ground participates in traces (so it can detect enemies beneath it) but has no physics presence (characters walk through it).
> - **Invisible collision walls at dungeon edges**: `Physics Only`. They physically block characters but do not appear in visibility traces or ability targeting.
> - **Dice and combat objects**: `Collision Enabled (Query and Physics)`. Full collision for realistic bouncing and rolling, plus query support so you can trace against them (e.g., detecting which dice face is up).
>
> **Wizard's Chess:**
> - **Board highlight overlays** (green valid-move squares): `Query Only`. The player's cursor trace detects them, but they have no physical presence.
> - **Debris during flight**: `Physics Only`. Fragments interact with the board and floor physically but are not targetable by traces. This prevents debris from blocking piece selection traces.
> - **Intact pieces**: `Collision Enabled (Query and Physics)` so they can be clicked (query) and also block other pieces physically during edge cases.

### Complex vs Simple Collision

| Type | Description | Use Case |
|------|-------------|----------|
| `Simple` | Primitive shapes (box, sphere, capsule, convex hull) | Physics simulation, runtime collision |
| `Complex` | Full triangle mesh from the actual geometry | Precise traces, per-polygon hit detection |
| `Use Simple as Complex` | Use simple collision for everything | Performance optimization |
| `Use Complex as Simple` | Use triangle mesh for everything | High accuracy (expensive) |
| `Default` | Simple for physics, complex for traces | Standard configuration |

**Setting collision complexity:**
- On Static Mesh: Details > Collision > Collision Complexity
- Options: Project Default, Simple and Complex, Use Simple as Complex, Use Complex as Simple

**Generating simple collision in the Static Mesh Editor:**
- Collision menu > Add Box/Sphere/Capsule Simplified Collision
- Collision menu > Auto Convex Collision (configurable hull count and vertex limit)
- `DOP` options: 6DOP, 10DOP-X/Y/Z, 18DOP, 26DOP (discrete oriented polytopes)

> **In your games:**
>
> **DnD Tabletop RPG:**
> - **Dice meshes**: Use **Complex as Simple** for dice. The D20 has 20 flat faces and physics needs to interact with each face accurately for the die to land and settle on a specific number. A simplified convex hull would turn the D20 into a rough sphere and ruin the roll behavior. The performance cost is fine because you only have 1-6 dice simulating at a time.
> - **Dungeon walls and floors**: Use **Simple** collision. Auto-generate box collision for flat walls and floor tiles. There is no need for per-polygon accuracy on flat surfaces, and this keeps physics fast.
> - **Detailed dungeon props (statues, ornate pillars)**: Use **Default** (simple for physics, complex for traces). Physics interactions use a basic convex hull, but when the Ranger shoots an arrow, the trace uses the full mesh for precise hit detection (arrow sticks in the statue's arm, not hovering in the air next to a bounding box).
> - **Treasure chests**: Use **Auto Convex Collision** with 4-6 hulls to approximate the chest shape. Good enough for physics (dice bounce off it realistically) without the cost of per-triangle collision.
>
> **Wizard's Chess:**
> - **Chess pieces**: Use **Default** collision. Simple convex hull for physics (debris bouncing off pieces) and complex mesh for traces (so the player's click trace accurately detects which piece they clicked, even on intricate sculpted figures like the Queen's crown or Knight's head).
> - **The chessboard**: Use **Simple as Complex**. The board is flat, so a single box collision works perfectly for both physics (debris bouncing) and traces (square selection). No need for per-triangle accuracy on a flat surface.
> - **Debris fragments**: Use **Use Simple as Complex** with auto-generated convex hulls. Performance matters here because 20-50 debris fragments can be simulating at once. Convex hulls are close enough to the fragment shapes.

---
