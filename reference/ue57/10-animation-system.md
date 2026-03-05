## Animation System

Unreal Engine 5.7 features significant animation workflow improvements including a refactored Animation Mode, Selection Sets, a unified Constraint window, and enhanced IK Retargeting with Spatially Aware Retargeting support.

### Animation Blueprints

#### Overview
- Animation Blueprints (ABPs) are specialized Blueprints that control Skeletal Mesh animation
- Contain two main graphs: **Event Graph** and **AnimGraph**
- **Create**: Content Browser > right-click > Animation > Animation Blueprint, then select a Skeleton
- Assigned to a Skeletal Mesh Component via the **Anim Class** property

#### Event Graph
- Standard Blueprint event graph for reading gameplay data
- Common events: **Event Blueprint Update Animation** (fires every frame, provides DeltaTimeX)
- Reads variables from the owning Pawn/Character (speed, direction, is jumping, etc.)
- Sets variables used by the AnimGraph for blending and state transitions
- **Thread Safety**: Mark functions/properties as **Thread Safe** to allow parallel evaluation. Access via Property Access nodes instead of direct variable gets.

#### AnimGraph
- Visual graph that defines the animation output pose
- Connects animation nodes in a flow from source animations to the **Output Pose**
- Key node types:
  - **Play Animation**: Directly plays a sequence
  - **Blend Spaces**: Blends animations based on parameters
  - **State Machines**: Manages states and transitions
  - **Layered Blend per Bone**: Blends different animations on different body parts
  - **Blend Poses by Bool / Int / Enum**: Conditional animation selection
  - **Cached Pose**: Stores a pose for reuse in the graph
  - **Slot**: Accepts Montage playback overlaid on the base pose
  - **Apply Additive / Mesh Space Ref Pose**: Additive animation layering
  - **Modify Bone / Transform Bone**: Direct bone manipulation
  - **Two Bone IK / FABRIK / CCDIK / Spline IK**: IK solvers in AnimGraph
  - **Look At**: Aims a bone at a target
  - **Copy Bone / Spring Controller / Trail Controller**: Procedural bone motion
  - **Rigid Body**: Physics-driven secondary motion (ponytails, capes)

> **In your games:**
> - **DnD RPG**: Use **Blend Spaces** for 8-directional locomotion on all 6 classes (Warrior, Rogue, Cleric, Wizard, Ranger, Bard). Use **State Machines** to manage Idle, Walk, Run, Combat, and Death states. Use **Layered Blend per Bone** so the Ranger can aim a bow (upper body) while running (lower body). **Slot** nodes accept attack Montages from GAS abilities like the Wizard's Fireball cast or the Rogue's Backstab. **Rigid Body** nodes drive the Cleric's dangling holy symbol and the Wizard's robe tails. **Look At** keeps the party AI companions' heads tracking the current speaker during dialogue.
> - **Wizard's Chess**: Use **Play Animation** for idle fidgets on chess pieces (Knight's horse pawing, Bishop swaying). **Modify Bone** or **Look At** lets pieces turn their heads to watch the action during another piece's move. **Rigid Body** drives the Wizard piece's flowing beard and the Queen's cape.

---

### State Machines

- **Create**: Right-click in AnimGraph > Add New State Machine
- Contains **States** (animation poses) and **Transitions** (rules for switching)
- Each State contains its own sub-graph outputting a pose
- **Entry Node**: Defines the initial state
- **Conduits**: Intermediate routing nodes for complex transition logic
- **Transitions**: Drawn as wires between states. Double-click to edit transition rules.
  - Transition rules are boolean expressions (e.g., Speed > 100, IsInAir == true)
  - **Blend Settings**: Duration, blend curve, blend mode (Standard, Inertialization)
  - **Inertialization**: Modern transition blending that requires no overlapping animation playback. Recommended over standard crossfade.
- **Automatic Rule Based on Sequence Player**: Transitions automatically when the current animation finishes
- **Notify-based Transitions**: Trigger based on Animation Notifies
- **Nested State Machines**: A state can contain another state machine for hierarchical organization

> **In your games:**
> - **DnD RPG**: Top-level states: Idle, Locomotion, Combat, Death, Interaction. Inside Combat, nest a sub-state machine with states for MeleeAttack, RangedAttack, CastSpell, Block, Dodge, and TakeDamage. The Warrior's combat sub-machine has a Shield Block state the Rogue lacks. Transition from Idle to Combat when the Blackboard key `bInCombat` becomes true. Use **Inertialization** for smooth blending between the Rogue's sprint and combat stance. **Automatic Rule Based on Sequence Player** triggers the transition out of attack animations once they finish.
> - **Wizard's Chess**: States: Idle, Moving, Attacking, Dying, Celebrating. Transition from Idle to Moving when the board controller signals this piece's turn. Transition from Moving to Attacking when the piece arrives at an occupied square. Use **Notify-based Transitions** so the attack animation fires a "CaptureComplete" notify that triggers the transition to Idle (or Celebrating for checkmate).

---

### Blend Spaces

#### 1D Blend Space
- Blends between animations along a single axis (e.g., Speed)
- **Create**: Content Browser > right-click > Animation > Blend Space 1D
- Place animation samples along the axis; the runtime value interpolates between them
- Example: Idle at 0, Walk at 200, Run at 600

#### 2D Blend Space
- Blends across two axes (e.g., Speed and Direction)
- **Create**: Content Browser > right-click > Animation > Blend Space
- Grid of animation samples plotted on X and Y axes
- Example: Speed (Y) vs Direction (X) for 8-directional locomotion
- **Sample Interpolation**: Delaunay triangulation determines blend weights
- **Axis Settings**: Configure min/max range, number of grid divisions, interpolation time
- **Target Weight Interpolation**: Smooths snapping between samples

> **In your games:**
> - **DnD RPG**: Create a **1D Blend Space** for each class's locomotion: Idle (0), Walk (150), Run (400). For the Ranger, create a **2D Blend Space** with Speed (Y) vs Strafe Direction (X) so they can circle enemies while aiming. Use a second 2D Blend Space for the Rogue's sneak movement: Speed vs Crouch Depth.
> - **Wizard's Chess**: Use a **1D Blend Space** on the Knight piece: Idle Prance (0), Trot (200), Gallop (500). The Pawn uses a simple Walk Blend Space so small vs large moves feel different in pace.

#### Aim Offsets
- Specialized Blend Spaces designed for additive aiming/looking
- **Create**: Content Browser > right-click > Animation > Aim Offset or Aim Offset 1D
- Uses additive animations (typically torso rotation by Yaw and Pitch)
- Applied on top of base locomotion animations
- Axes typically: Yaw (-90 to 90) and Pitch (-90 to 90)

> **In your games:**
> - **DnD RPG**: The Ranger uses an **Aim Offset** for bow aiming: Yaw for horizontal sweep, Pitch for aiming up at flying enemies or down at ground targets. The Wizard uses an Aim Offset for directing spell targeting with their staff hand while their legs stay in the locomotion Blend Space.
> - **Wizard's Chess**: Not heavily needed, but the Rook (tower) could use a simple 1D Aim Offset on Yaw to swivel its "face" toward the piece it is about to capture.

---

### Animation Sequences and Montages

#### Animation Sequences
- Individual animation clips imported from FBX or created in-engine
- Properties: frame rate, compression settings, additive type, root motion
- **Additive Settings**: No Additive, Local Space, Mesh Space
- **Root Motion**: Enable/disable per sequence. Configure root motion lock.
- **Curves**: Float curves embedded in the sequence for driving blend weights, material parameters, etc.
- **Sync Markers**: Named markers on specific frames for synchronizing animations in Blend Spaces. Ensures feet stay in phase across Walk/Run animations.
- **Rate Scale**: Playback speed multiplier

#### Animation Montages
- Composite animation assets for gameplay-driven playback (attacks, reloads, emotes)
- **Sections**: Named segments within the Montage that can be played, looped, or skipped
- **Slots**: Assigned to a Slot Group. Multiple slots allow different body parts (upper body slot, full body slot).
- **Blend In/Out**: Configurable blend times and curves
- **Montage Branching**: Jump between sections based on gameplay events (combo attacks)
- **Play from Blueprint**: `Play Anim Montage` on the Skeletal Mesh Component or `Montage Play` via the Anim Instance
- **Montage Events**: OnBlendOut, OnCompleted, OnInterrupted, OnNotifyBegin, OnNotifyEnd

> **In your games:**
> - **DnD RPG**: Every GAS ability plays a Montage. The Warrior's "Cleave" is a full-body Montage with **Sections**: WindUp, Swing, Recovery. Use **Montage Branching** for the Rogue's combo: Slash1 > Slash2 > Backstab, where the player can branch at each section or let it auto-complete. The Bard's songs use looping Montage sections that repeat until the ability ends. The Cleric's healing spell uses **Blend In/Out** for smooth transitions from combat stance to cast pose and back. Use `OnCompleted` to tell GAS the ability finished, and `OnInterrupted` to handle stagger cancelling a cast.
> - **Wizard's Chess**: Each piece type has a unique attack Montage. The Knight rears up and charges (Sections: Rear, Charge, Trample). The Queen has an elaborate magic blast. The Pawn has a humble sword swing. Use **Slots** with an upper-body slot so pieces can play a "look around" idle animation while their attack Montage plays on the full body slot during capture sequences.

#### Animation Notifies
| Notify Type | Description |
|-------------|-------------|
| **Play Sound** | Triggers a sound effect at a specific frame (footsteps, impacts) |
| **Play Particle Effect** | Spawns a particle system at a bone/socket |
| **Play Niagara Effect** | Spawns a Niagara system |
| **Custom Notify (Blueprint)** | User-defined notify; override `Received_Notify` in the Animation Blueprint |
| **Custom Notify (C++)** | C++ AnimNotify class for complex logic |
| **Notify State** | Duration-based notify with Begin, Tick, and End events (trails, weapon collision windows) |
| **Montage Notify** | Fires only during Montage playback |
| **Anim Notify Queue** | Batched notify processing for thread-safe evaluation |

**UE 5.7**: The Niagara Examples Pack includes Animation Notify Blueprints demonstrating how to trigger VFX from animation events with options for Data Channel spawning or per-step system spawning.

> **In your games:**
> - **DnD RPG**: **Play Sound** notifies on the Warrior's sword swing for the whoosh at the apex. **Play Niagara Effect** on the Wizard's Fireball cast to spawn flame particles at the staff tip socket. **Notify State** on the Rogue's dagger attacks to enable weapon collision from frame 12 to frame 22 (the damage window). **Custom Notify (C++)** on the Cleric's heal to trigger the GAS Gameplay Effect at exactly the right frame. **Montage Notify** on the Bard's songs to pulse area-of-effect buffs on each beat of the animation.
> - **Wizard's Chess**: **Play Niagara Effect** on capture animations to spawn magic trails and shatter particles when a piece is destroyed. **Play Sound** for the dramatic stone-cracking impact. **Notify State** for the magic glow trail that follows the Knight's charge path from start to end of the movement arc. **Custom Notify (Blueprint)** to trigger camera shake at the moment of impact during captures.

---

### Skeletal Meshes, Skeletons, and Physics Assets

#### Skeletal Meshes
- Deformable meshes driven by a bone hierarchy
- Import from FBX with skeleton, skin weights, morph targets, and LODs
- **UE 5.7**: The Skeletal Editor now supports creating and editing morph shapes (blendshapes), bones, and skin weights directly in-engine

#### Skeletons
- Bone hierarchy asset shared by compatible Skeletal Meshes
- Multiple Skeletal Meshes can share the same Skeleton (character variants)
- **Skeleton Tree**: Edit bone hierarchy, add virtual bones and sockets
- **Virtual Bones**: Added in the Skeleton Editor between two existing bones for IK targets and attachment points (no export required)
- **Sockets**: Named attachment points on bones for weapons, accessories, effects

> **In your games:**
> - **DnD RPG**: All 6 classes share a single **Skeleton** with class-variant Skeletal Meshes (different armor, body builds). Add **Sockets** for: `WeaponSocket_R` (Warrior's sword, Rogue's dagger), `WeaponSocket_L` (Warrior's shield, Ranger's bow), `SpellOrigin` on the Wizard's staff tip, `BackMount` for sheathed weapons, and `HealFX` on the Cleric's hands. Use **Virtual Bones** between the hand and weapon for IK adjustment targets. The Bard's lute attaches to a `InstrumentSocket` on the left hand.
> - **Wizard's Chess**: Each piece type is a separate Skeletal Mesh, but Pawns could share a Skeleton since they are identical. Add a **Socket** called `CrownSocket` on the King and Queen heads for particle crown effects. The Knight needs a `LanceSocket` for its weapon attachment.

#### Physics Assets
- Define collision bodies and constraints for ragdoll and hit detection
- **Physics Asset Editor**: Per-bone collision shapes (Sphere, Capsule, Box, Convex, Tapered Capsule)
- **Constraints**: Angular and linear limits between bones
- **Profiles**: Named configurations (ragdoll, hit detection, etc.)
- **Simulation toggle**: Test ragdoll directly in the Physics Asset Editor

> **In your games:**
> - **DnD RPG**: Set up **Physics Assets** on all character classes for ragdoll death animations. When an enemy's killing blow lands, blend from the death animation into ragdoll using a Pose Snapshot. Create a separate "hit detection" profile with capsules on limbs for the Rogue's precision strike system (headshots, limb hits). The Warrior's cape and the Wizard's robe use **Rigid Body** simulation on tail bones with appropriate constraints.
> - **Wizard's Chess**: Physics Assets drive the dramatic death shattering. When a piece is captured, transition from the death animation to ragdoll, then trigger a fracture/dissolve effect. The Knight's horse needs separate body/leg constraints so it crumbles realistically. Lighter pieces (Pawns) should ragdoll with more force, heavier pieces (Rook) with less.

---

### IK Retargeter (Enhanced in UE 5.7)

#### IK Rig
- Defines IK goals and solvers on a Skeleton
- **Create**: Content Browser > right-click > Animation > IK Rig
- Add solvers: Full Body IK, Limb IK, CCDIK, FABRIK, Aim, Look At
- Define chains: Spine, Left Leg, Right Leg, Left Arm, Right Arm, Head, Tail, etc.
- Each chain maps a sequence of bones to an IK goal

#### IK Retargeter
- Transfers animation between different Skeletons using IK Rigs
- **Create**: Content Browser > right-click > Animation > IK Retargeter
- Assign Source IK Rig and Target IK Rig
- **Chain Mapping**: Map source chains to target chains (Left Arm to Left Arm, etc.)
- **UE 5.7 Improvements**:
  - **Crotch Height** definition for better hip offset calculation between differently proportioned characters
  - **Floor Constraints** on feet to prevent floating or ground penetration during retargeting
  - **Spatially Aware Retargeting** (Experimental): Reduces self-collision when retargeting between characters with significantly different body proportions (e.g., transferring human animation to a squat character)
  - **Squash and Stretch**: New ability to retarget squash-and-stretch animations accurately
  - General performance improvements to IK solving speed

> **In your games:**
> - **DnD RPG**: Set up IK Rigs for the humanoid skeleton shared across classes. Use the **IK Retargeter** to transfer Mixamo or marketplace animations onto your custom character skeletons. If the Warrior has a bulkier build than the Rogue, **Spatially Aware Retargeting** prevents the arms from clipping through the chest during shared animations like door-opening or item pickup. **Floor Constraints** keep all characters' feet planted correctly on the dungeon's uneven stone floors, stairs, and ramps. Use **Crotch Height** to handle the difference between the tall Ranger and the stockier Warrior.
> - **Wizard's Chess**: Retarget a shared "humanoid piece" animation set (idle sway, look around) across the King, Queen, Bishop, and Pawn, which all have roughly humanoid proportions but different heights. The Knight (horse-mounted) needs its own IK Rig since its skeleton differs significantly.

#### Animation Retargeting (Legacy)
- Older system for retargeting within the same Skeleton using bone translation modes:
  - **Skeleton**: Uses skeleton proportions
  - **Animation**: Uses source animation data
  - **Animation Scaled**: Scales to target proportions
- Configured per bone in the Skeleton asset

---

### Control Rig

- Procedural rigging framework for in-engine character rigging and animation
- **Create**: Content Browser > right-click > Animation > Control Rig
- Build rig logic using a node graph (Rig Graph)
- **Controls**: Gizmo-based manipulation handles for animators
- **Solvers**: Full Body IK, Two Bone IK, CCDIK, FABRIK, Aim, Spring, Distribute
- **Construction Event**: Runs once to set up hierarchy
- **Forward Solve**: Runs every frame during animation
- **Backward Solve**: Runs during authoring to solve from output to input
- Use in Sequencer for keyframe animation with custom controls
- **UE 5.7**: New **Dependency View** for visualizing and debugging rig dependencies between controls and bones

> **In your games:**
> - **DnD RPG**: Use **Control Rig** for procedural foot placement on dungeon terrain (IK feet to uneven stone floors). Build a hand IK rig so characters grip objects naturally: the Warrior grips different-sized weapons, the Cleric places hands on wounded allies during healing. Use Control Rig in **Sequencer** for hand-crafted cutscene animations, like the Bard's dramatic performance during story beats.
> - **Wizard's Chess**: Use Control Rig for the "enchanted movement" feel. Pieces can have a procedural hover/bounce as they slide across the board. The Queen's scepter hand tracks her target square as she moves, giving an intentional pointing gesture without needing a bespoke animation for every possible destination.

#### Full Body IK (FBIK)
- Whole-body IK solver for natural full-body posing
- Configure goals (effectors) for hands, feet, pelvis, head
- Stiffness, pull weight, and pin settings per bone
- **UE 5.7**: Approximately 20% speed increase via stretch limb solvers and FK rotation mode optimization
- Useful for: foot placement on uneven terrain, hand placement on surfaces, sitting/leaning

> **In your games:**
> - **DnD RPG**: FBIK handles foot placement for all characters navigating dungeon stairs, rubble, and sloped corridors. Set effectors on both feet, both hands, and the pelvis. When the Warrior leans against a wall in idle, FBIK adjusts the shoulder and hand to the wall surface. When companions sit at a tavern table, FBIK places hands on the table edge and adjusts posture to the chair height.
> - **Wizard's Chess**: FBIK keeps pieces grounded on the board even if the board has subtle curvature or tilt (e.g., a warped magical battlefield variant). The King piece could use FBIK to plant its scepter on the board surface during its idle animation.

---

### Linked Anim Graphs and Linked Anim Layers

#### Linked Anim Graphs
- **Link Anim Graph** node in the AnimGraph links an external Animation Blueprint
- The linked Blueprint runs as a sub-graph, receiving and outputting poses
- Allows modular animation: base locomotion in one ABP, upper body actions in another
- Set at runtime via `Link Anim Class In` node or `Set Linked Anim Graph Instance Class`

#### Linked Anim Layers
- **Linked Anim Layer** node delegates an entire animation layer to an external ABP
- Define a **Layer Interface** (Animation Layer Interface asset) with function signatures
- Multiple ABPs can implement the same interface with different logic
- Swap implementations at runtime for different character behaviors
- Example: Different weapon types swap upper body animation layers

> **In your games:**
> - **DnD RPG**: Define a **Layer Interface** called `UpperBodyCombatLayer` with functions for LightAttack, HeavyAttack, Block, and SpecialAbility. The Warrior's ABP implements it with sword-and-shield animations. The Rogue's ABP implements it with dual-dagger animations. The Ranger's ABP implements it with bow animations. All share the same base locomotion ABP. Swap layers at runtime when a character picks up a different weapon type. Use **Linked Anim Graphs** for the Wizard's spell-casting overlay: a separate ABP handles all spell animations on the upper body while the base ABP handles movement.
> - **Wizard's Chess**: Use **Linked Anim Layers** to swap between "peaceful idle" and "aggressive idle" layer sets based on the game state (early game vs endgame tension). The same piece skeleton uses different animation layers as the match intensifies.

---

### Root Motion

#### Settings
- **Enable Root Motion**: Per-sequence toggle in the Animation Sequence asset
- **Root Motion Root Lock**: Prevents root bone from drifting (Lock XY, Lock Z, Ref Pose)
- **Force Root Lock**: In Animation Blueprint, forces the root to stay at the Actor position
- **Root Motion from Everything**: Uses root motion from all sources including Montages and Blend Spaces
- **Root Motion Mode** (in Character Movement Component):
  - **No Root Motion**: Ignores root motion
  - **Root Motion from Montages Only**: Only applies during Montage playback
  - **Root Motion from Everything**: Always applies

#### Root Motion and Networking
- Authority extracts root motion; simulated proxies receive replicated movement
- `Root Motion Translation` and `Root Motion Rotation` can be queried for custom handling
- Physics-based root motion: enable `bAllowPhysicsRotationDuringAnimRootMotion` for blended control

> **In your games:**
> - **DnD RPG**: Enable **Root Motion** on the Warrior's charge attack so the forward lunge distance is authored in the animation, not code. The Rogue's dodge roll uses root motion for precise distance control. Set **Root Motion from Montages Only** on the Character Movement Component so normal locomotion stays code-driven but GAS ability Montages (the Warrior's Cleave sweep, the Rogue's Backstab lunge) use animation-driven movement. Disable root motion on the Wizard's cast animations since they are stationary.
> - **Wizard's Chess**: Use **Root Motion from Everything** on chess pieces so their slide-across-the-board animation drives the actual movement. This ensures the Knight's L-shaped hop covers exactly the right distance. The Pawn's one-square shuffle and the Queen's long diagonal glide are all authored in animation, giving each piece a unique movement feel.

---

### Motion Matching and Pose Search (Updated in UE 5.7)

#### Pose Search
- Database-driven animation selection system
- **Pose Search Database**: Contains animation sequences with tagged features
- The system searches the database each frame for the best matching pose based on:
  - Current character pose (bone positions/velocities)
  - Desired trajectory (future movement path)
  - Gameplay tags and context
- Returns the optimal animation and blend time

#### Motion Matching
- Runtime animation technique that continuously selects the best animation frame from a large database
- Eliminates traditional State Machines for locomotion
- **Create**: Set up a Pose Search Database with locomotion animations, then use the **Motion Matching** node in the AnimGraph
- **UE 5.7**: Motion Matching is now integrated into **Choosers**, allowing users to specify conditions under which particular animation assets are valid based on game logic or other considerations. This is the first stage of Chooser integration development.
- **Choosers Integration**: Define per-asset validity conditions based on gameplay state, character properties, or custom logic

> **In your games:**
> - **DnD RPG**: Motion Matching is ideal for the party companion AI. Instead of hand-authoring a state machine with dozens of transitions, feed a large database of locomotion clips (walk, run, strafe, turn, stop) and let the system pick the best match each frame. Companions following the player through winding dungeon corridors will transition fluidly. Use **Choosers** to define conditions like "only use sneaking animations when the party is in stealth mode" or "only use combat stances when enemies are nearby." This lets you manage animation selection through gameplay tags rather than complex state machine wiring.
> - **Wizard's Chess**: Less critical here since piece movement is more scripted, but Motion Matching could drive crowd-reaction animations on captured pieces watching from the sideline, giving them natural, fidgety idle behavior without a complex state machine.

#### Configuration
- **Schema**: Defines which bones and trajectories to track
- **Channels**: Position, Velocity, Rotation for bones; Facing, Position for trajectory
- **Cost Modifiers**: Weight different features (pose accuracy vs trajectory accuracy)
- **Continuing Pose Cost Bias**: Discourages unnecessary animation switches
- **Database Normalization**: Automatic feature weighting

---

### Animation Curves
- Float curves embedded in Animation Sequences
- Driven by bone transforms, morph targets, or manually authored
- Accessed in the AnimGraph via **Get Curve Value** or **Modify Curve** nodes
- Use cases: material parameter driving, blend weight control, gameplay triggers, IK blend alpha
- **Metadata**: Mark curves as Material, Morph Target, or Attribute for automatic hookup
- Curves are interpolated per frame and can be overridden in Montages

> **In your games:**
> - **DnD RPG**: Use **Animation Curves** to drive a "MagicGlow" material parameter on the Wizard's staff during spellcasting. The curve ramps from 0 to 1 as the cast builds up, then drops to 0 on release. Use a "DamageWindow" curve (0 or 1) on attack animations to enable/disable hit detection, providing finer control than a simple Notify State. A "FootIKAlpha" curve blends IK foot placement in and out during jumps and special moves.
> - **Wizard's Chess**: Drive a "PieceGlow" emissive curve during movement animations. As a piece lifts off the board, the glow ramps up; as it lands, it fades. Use a "BoardReaction" curve on capture animations to drive the board's magical ripple material effect in sync with the impact frame.

### Sync Markers
- Named markers placed on frames in Animation Sequences to synchronize multi-animation blending
- Ensure feet and other cyclical elements stay in phase across Walk, Run, Sprint
- **Create**: In the Animation Sequence timeline, right-click > Add Sync Marker
- Used by Blend Spaces and State Machine transitions for phase-matched blending
- Group name determines which animations sync together

> **In your games:**
> - **DnD RPG**: Place Sync Markers named "LeftFoot" and "RightFoot" on all Walk, Run, and Sprint animations for every class. This ensures that when the Warrior transitions from walk to run mid-stride, the feet stay in phase and you never get a "skating" artifact. The Bard's march animation and regular walk need Sync Markers so blending between them during performance mode looks natural.
> - **Wizard's Chess**: Place Sync Markers on the Pawn's idle sway variations so blending between them keeps the rocking motion consistent. Less critical for other pieces since their movements are more discrete, but helpful if you blend between multiple idle animations.

### Pose Snapshots
- Captures the current skeletal pose at runtime
- **Save Pose Snapshot**: Blueprint node that stores the current pose by name
- **Use Pose Snapshot**: AnimGraph node that outputs the stored pose
- Use cases: blending from a ragdoll state to animation, preserving a pose during gameplay events, death pose transitions

> **In your games:**
> - **DnD RPG**: When a character gets hit by a heavy attack and goes into partial ragdoll (stagger), use **Save Pose Snapshot** to capture the ragdoll pose, then blend from that snapshot back into the recovery animation. This avoids the jarring pop from ragdoll to animation. For death, snapshot the final pose so corpses stay in their death position without continuing to simulate physics. During the tabletop-to-3D zoom transition, snapshot the miniature's pose to blend smoothly into the 3D character's first frame.
> - **Wizard's Chess**: After a captured piece shatters and ragdolls, snapshot the final resting pose of the debris so it stays put on the board without ongoing physics cost. If you have a "piece reassembly" effect (resetting the board), blend from the snapshot back to the intact idle pose.

---

### Thread-Safe Animations

- By default, animation evaluation runs on the game thread
- Enable **Use Multi-Threaded Animation Update** in Skeletal Mesh Component settings
- Mark functions as **Thread Safe** in their details (Blueprint purity requirement)
- Use **Property Access** nodes instead of direct variable gets (thread-safe by design)
- **Thread Safe Update Animation**: Alternative to Event Blueprint Update Animation that runs on a worker thread
- Benefits: animation evaluation runs in parallel with game logic, reducing game thread cost
- Restrictions: cannot access non-thread-safe Blueprint functions, UObject properties require property access bindings

> **In your games:**
> - **DnD RPG**: With a 4-member party plus potentially 5+ enemies on screen during combat, thread-safe animation is a must. Enable **Use Multi-Threaded Animation Update** on all character skeletal meshes. Use **Property Access** nodes instead of direct variable gets in your Animation Blueprints. This keeps the game thread free for GAS ability processing, AI behavior tree evaluation, and dice roll calculations while all character animations evaluate in parallel.
> - **Wizard's Chess**: 32 pieces on the board, each with idle animations. Thread-safe animation keeps the cost low. Even though only one or two pieces move at a time, all 32 still evaluate their idle AnimGraphs every frame.

---
