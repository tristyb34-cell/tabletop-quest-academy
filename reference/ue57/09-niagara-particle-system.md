## Niagara Particle System

Niagara is Unreal Engine's modular, data-driven VFX system that replaces the legacy Cascade particle system. It provides full programmatic control over particle behavior through a stack-based module architecture.

### Core Architecture

#### Systems vs Emitters
- **Niagara System**: The top-level asset placed in the world. Contains one or more Emitters.
- **Niagara Emitter**: Defines a single particle effect (fire, sparks, smoke, etc.). Emitters can be shared across multiple Systems.
- **Relationship**: A System orchestrates the timing, parameter sharing, and rendering of its child Emitters. Emitters within a System can communicate via System-level parameters and events.
- **Create**: Content Browser > right-click > Niagara System (choose from templates or empty). For emitters: right-click > Niagara Emitter.

#### Module Stack
Each Emitter contains a stack of stages, executed in order:

| Stage | Executes | Purpose |
|-------|----------|---------|
| **System Spawn** | Once, when System activates | Initialize System-level parameters |
| **System Update** | Every frame on the System | Update System-level logic |
| **Emitter Spawn** | Once, when Emitter activates | Initialize Emitter-level parameters |
| **Emitter Update** | Every frame on the Emitter | Emitter-level per-frame logic (spawn rates, bounds) |
| **Particle Spawn** | Once per new particle | Initialize each particle (position, velocity, color, size) |
| **Particle Update** | Every frame per particle | Per-particle simulation (gravity, drag, collision, color over life) |
| **Event Handler** | When events are received | Responds to particle events (death, collision, custom) |
| **Render** | Per frame | Configures how particles are drawn |

Each stage contains **modules**, which are individual logic units. Modules are Niagara Module Scripts (visual graphs or HLSL). Drag modules into stages from the module palette. Order within a stage matters; modules execute top to bottom.

#### Simulation Stages (Custom)
- Add custom simulation stages for multi-pass logic
- Useful for: neighbor searches, constraint solving, fluid simulation passes
- Configure iteration count and data source per stage
- Access via the "+" button in the Emitter stack

---

### Renderers

| Renderer | Description |
|----------|-------------|
| **Sprite Renderer** | Camera-facing quads. Most common. Supports sub-UV animation, alignment modes (Camera Facing, Velocity Aligned, Custom Alignment). Material cutout for tighter collision/sorting bounds. |
| **Mesh Renderer** | Renders instanced Static Meshes per particle. Good for debris, shrapnel, leaves. Supports per-instance material parameters and multiple meshes with weighted random selection. |
| **Ribbon Renderer** | Connects particles into continuous strips/trails. Uses particle age/spawn order for ordering. Configurable width, twist, facing mode. Ideal for trails, lightning, ribbons. |
| **Light Renderer** | Each particle emits a dynamic point light. Supports color, intensity, radius per particle. Use sparingly for performance. Shadow-casting for Niagara particle lights is now supported in UE 5.7 via MegaLights. |
| **Component Renderer** | Spawns full Unreal components (meshes, audio, decals) per particle. Expensive but powerful for complex per-particle effects. Pool size configurable. |
| **Geometry Cache Renderer** | Renders Alembic geometry cache per particle (for cached simulations). |

**UE 5.7 Note**: MegaLights has entered beta with support for Niagara particle lights, directional lights, translucency, and hair strands, providing more accurate shading and shadowing.

---

### Data Interfaces

Data Interfaces allow Niagara to read from and write to external data sources:

| Data Interface | Description |
|----------------|-------------|
| **Skeletal Mesh** | Reads bone transforms, socket positions, skin weights, triangle data from a Skeletal Mesh. Use for spawning particles on character surfaces or attaching to bones. |
| **Static Mesh** | Reads vertex positions, normals, UVs, triangles from a Static Mesh. Spawn particles on mesh surfaces. |
| **Collision Query** | Performs line traces and sweep tests against the physics scene. Use for particle-world collision without CPU readback. |
| **Audio Spectrum / Audio Oscilloscope** | Reads audio frequency data for audio-reactive effects. |
| **Curve** | Samples a curve asset (float, vector, color) over a parameter. |
| **2D Grid Collection / 3D Grid Collection** | Reads/writes to 2D or 3D grids for fluid simulation, density fields, and voxel-based effects. |
| **Neighbor Grid 3D** | Spatial hash grid for particle-to-particle neighbor queries. Used for flocking, SPH fluid, and constraint systems. |
| **Render Target** | Reads from or writes to a Render Target 2D texture. Enables particle-driven texture effects and feedback loops. |
| **Array** | Reads/writes arrays of data passed from Blueprint or C++. |
| **Object Reader** | Reads Niagara particle data from another System. Enables inter-system communication. |
| **Landscape** | Samples landscape height and layer weights. |
| **Spline** | Reads positions along a spline component. |
| **Camera** | Reads camera position, rotation, FOV for view-dependent effects. |
| **Chaos Destruction** | Reads Chaos destruction events (break, collision) for spawning effects on destruction. |
| **Physics Field** | Reads from the global physics field system. |
| **Platform Set** | Conditional logic based on target platform. |
| **Export** | Exports particle data to Blueprint for CPU-side processing. |
| **Particle Attribute Reader** | Reads attributes from particles in the same or different emitter within the same system. |
| **UV Texture** | Samples texture data at UV coordinates. |

---

### Key Modules

#### Spawn Modules

Spawn modules live in the **Emitter Update** stage. They control how many particles are created and when. To add one: click the **+** button in the Emitter Update stage and search for the module name.

**Path to access**: Open Niagara System > select Emitter > Emitter Update stage (left panel) > click **+** > search "Spawn"

##### Spawn Rate

Continuously spawns particles at a steady rate over time. The most common spawn module.

| Parameter | Type | Description |
|-----------|------|-------------|
| **Spawn Rate** | float | Number of particles spawned per second. Set to 100 for a steady stream, 5000+ for a dense spray. Default: 20. |
| **Spawn Remainder** | float (auto) | Internal fractional accumulator. Niagara tracks partial particles between frames so the rate stays accurate regardless of frame rate. Do not modify manually. |
| **Spawn Group** | int | Assigns spawned particles to a group index. Used when multiple spawn modules feed the same emitter and you need to differentiate them in Particle Spawn. Default: 0. |

**How to use**: Drag the module into Emitter Update. Click it to see parameters in the Details panel (right side). Type a number directly, or click the dropdown arrow next to Spawn Rate to bind it to a curve, dynamic input, or user parameter.

**Dynamic control**: Click the dropdown arrow on Spawn Rate > select **Make New Expression** or **Float from Curve** to ramp spawn rate over the emitter's age (e.g., start slow, peak, then taper off). Or link to a **User Parameter** (float) exposed to Blueprint so gameplay code can control it at runtime.

**In your games**:

| Game | Effect | Spawn Rate | Notes |
|------|--------|------------|-------|
| DnD Tabletop | Torch flame on dungeon wall sconces | 30-60/sec | Continuous flickering fire. Use Float from Curve tied to emitter age so the flame "breathes" (dip to 20, spike to 80, repeat). Pair with a Light Renderer emitter at 1-2/sec for the glow. |
| DnD Tabletop | Healing aura around Cleric during Lay on Hands | 40-80/sec | Green/gold upward-drifting sprites. Link Spawn Rate to a User Parameter so the ability system (GAS) can ramp it up when the heal activates and back to 0 when it ends. |
| DnD Tabletop | Poison cloud from Rogue's Venom Strike | 100-200/sec | Dark green smoke sprites with Curl Noise. High rate makes the cloud feel thick and dangerous. Cap with Max Allocation Count of 500 so it stays performant. |
| DnD Tabletop | Ambient dust motes floating in dungeon rooms | 5-10/sec | Tiny white sprites with slow velocity and long lifetime (8-12 sec). Very low rate because particles live a long time and accumulate. Sells the atmosphere without costing anything. |
| DnD Tabletop | Buff/debuff indicator orbiting a character | 15-20/sec | Small glowing orbs that orbit via the Orbit update module. Color driven by the Gameplay Effect tag (blue for defense, red for damage boost). Spawn Rate stays constant while the effect is active. |
| Wizard's Chess | Magic aura idling on enchanted pieces | 10-20/sec | Subtle sparkle sprites drifting upward from the piece base. Low rate keeps it ambient. Different color per team (gold vs silver). |
| Wizard's Chess | Board square highlight when a piece is selected | 25-40/sec | Flat sprites constrained to the square surface using Shape Location (Box, flattened on Y). Rate high enough to fill the square but not overflow. |
| Wizard's Chess | Piece levitation idle effect (floating dust beneath) | 8-15/sec | Downward-facing sprites under the hovering piece. Very gentle. Makes it clear the piece is magically suspended. |

##### Spawn Burst Instantaneous

Spawns a fixed number of particles in a single frame, then stops. Used for one-shot effects like explosions, muzzle flashes, and impact bursts.

| Parameter | Type | Description |
|-----------|------|-------------|
| **Spawn Count** | int | Number of particles to spawn in the burst. Set to 50 for a small puff, 500+ for a dense explosion. |
| **Spawn Time** | float | Delay in seconds before the burst fires. 0.0 means immediately on emitter activation. |
| **Spawn Probability** | float (0-1) | Chance the burst actually fires. 1.0 = always, 0.5 = 50% chance. Useful for randomized sub-effects. |
| **Spawn Group** | int | Group index for this burst. Default: 0. |

**How to use**: Add to Emitter Update. Set Spawn Count. For chained bursts (e.g., a firework with multiple stages), add multiple Spawn Burst Instantaneous modules with different Spawn Time values.

**Common setup**: Explosion = Spawn Burst Instantaneous (Spawn Count: 200, Spawn Time: 0) + a second one for secondary sparks (Spawn Count: 50, Spawn Time: 0.1).

**In your games**:

| Game | Effect | Spawn Count | Notes |
|------|--------|-------------|-------|
| DnD Tabletop | Fireball impact explosion | 300-500 | The big boom. Fire-colored sprites bursting outward from the impact point. Add a second burst (Count: 100, Time: 0.05) for smoke, and a third (Count: 50, Time: 0.1) for lingering embers. Three bursts, one system, layered timing. |
| DnD Tabletop | Dice roll impact (when dice hit the tabletop surface) | 20-40 | Small dust/spark burst where the die lands. Spawn Probability at 0.7 so not every bounce triggers particles, feels more natural. |
| DnD Tabletop | Critical hit flash | 150-250 | Gold/white burst radiating from the struck enemy. Big, dramatic, short-lived (lifetime 0.3 sec). This is pure juice, the player should feel the crit. |
| DnD Tabletop | Miniature "coming alive" transition (tabletop zoom) | 200-400 | Magical sparkle burst as the miniature transforms into the full 3D character. Two bursts: one at the miniature (Count: 200, Time: 0) and one at the full character spawn point (Count: 200, Time: 0.3) to connect the transition. |
| DnD Tabletop | Loot drop sparkle when an item appears | 50-80 | Gold sparkles bursting upward from the ground when loot spawns. Short, punchy, satisfying. |
| DnD Tabletop | Enemy death dissolve | 100-200 | Dark particles bursting outward as the enemy mesh fades. Mesh Renderer with small chunks for bosses (Count: 50, mesh debris pieces). |
| Wizard's Chess | Piece captured, destruction burst | 200-400 | The money shot. Stone/crystal fragments (Mesh Renderer, Count: 30-50) plus dust cloud (Sprite, Count: 150) plus sparks (Sprite, Count: 50, Time: 0.05). Three emitters, staggered timing. The captured piece should shatter dramatically. |
| Wizard's Chess | Piece summoned onto the board | 80-120 | Upward magical swirl as the piece materializes. Light blue/white. Spawn Time: 0 for the initial flash, then a Spawn Rate emitter handles the sustained materialization glow. |
| Wizard's Chess | Check notification burst | 60-100 | Red warning particles radiating from the threatened King. Aggressive, urgent. Pair with a screen shake for extra drama. |
| Wizard's Chess | Checkmate finale | 500-800 | Go big. Multi-stage: golden burst from winning piece (Time: 0), shockwave ring (Time: 0.1), upward celebration particles (Time: 0.3), defeated King crumble (Time: 0.5). This is the climax of the game, make it feel epic. |

##### Spawn Per Unit

Spawns particles based on distance traveled by the emitter's owner (or a tracked position). Particles appear at even intervals along the movement path regardless of speed.

| Parameter | Type | Description |
|-----------|------|-------------|
| **Spawn Spacing** | float | Distance in Unreal units between each spawn. Lower = denser trail. 10 = very dense, 100 = sparse. |
| **Max Move Speed** | float | Safety cap. If the emitter teleports or moves faster than this, excess distance is ignored to prevent massive particle dumps. Default: 1000. |
| **Spawn Count Per Unit** | int | How many particles to spawn per spacing interval. Default: 1. Set to 3 for thicker trails. |
| **Movement Tolerance** | float | Minimum distance the emitter must move before any particles spawn. Prevents spawning while stationary. Default: 0. |

**How to use**: Attach the Niagara System to a moving actor (character feet, vehicle wheels, projectile). Particles automatically spawn as it moves. No movement = no particles.

**Typical uses**: Footstep dust, tire tracks, sword slash trails, blood drips while running, bullet tracer trails.

**In your games**:

| Game | Effect | Spawn Spacing | Notes |
|------|--------|---------------|-------|
| DnD Tabletop | Warrior sword slash trail | 5-10 units | Ribbon Renderer. Attach the Niagara System to a socket on the sword mesh tip. As the sword swings through the attack animation, particles spawn along the arc creating a smooth slash trail. Color matches the weapon enchantment (white for normal, blue for ice, orange for fire). The trail only appears during the swing because no movement = no particles. |
| DnD Tabletop | Rogue's dash/shadow step movement trail | 15-25 units | Dark smoke sprites trailing behind the character during the dash ability. Attach to the character root. Movement Tolerance set to 50 so it only activates during fast movement (the dash), not during normal walking. |
| DnD Tabletop | Magic missile projectile trail | 8-12 units | Glowing sprites trailing the projectile actor as it flies toward the target. Count Per Unit: 2-3 for a thicker trail. The projectile moves fast, so the spacing needs to be tight enough that there are no gaps. |
| DnD Tabletop | Bleeding effect (damage over time) | 30-50 units | Red droplet sprites trailing a poisoned/bleeding character as they move. Sparse spacing because you want occasional drips, not a firehose of blood. Stops when the DoT Gameplay Effect expires. |
| DnD Tabletop | Dice rolling across the tabletop | 10-15 units | Tiny dust puffs where the die contacts the surface as it tumbles. Attach to the die actor. Gives tactile weight to the roll. |
| Wizard's Chess | Piece sliding across the board (move trail) | 10-20 units | Magical trail left behind as a piece glides to its new square. Color per team. The trail fades quickly (lifetime 0.5-1 sec) so it draws a brief path showing where the piece came from. |
| Wizard's Chess | Knight's arc trail (L-shaped move) | 8-15 units | The Knight jumps/arcs over other pieces. Trail follows the arc path. Use Ribbon Renderer for a smooth, connected arc trail rather than individual sprites. Very satisfying when the Knight leaps. |
| Wizard's Chess | Bishop diagonal slide | 15-25 units | Subtle ground-level trail along the diagonal path. Sparser than the Knight because the Bishop's move is elegant, not dramatic. |

##### Spawn Per Frame

Spawns a fixed number of particles every single frame. The actual particles-per-second depends on frame rate (60 fps with Spawn Count 2 = 120 particles/sec).

| Parameter | Type | Description |
|-----------|------|-------------|
| **Spawn Count** | int | Particles to create each frame. |
| **Spawn Group** | int | Group index. Default: 0. |

**How to use**: Generally prefer Spawn Rate over Spawn Per Frame for frame-rate-independent results. Spawn Per Frame is useful for GPU simulations or effects that need exactly N particles per frame for grid/fluid systems.

**Warning**: On high-refresh-rate monitors (144+ fps), this produces far more particles than on 30fps. Use Spawn Rate for consistent visual density.

**In your games**: Spawn Per Frame is rarely what you want for DnD or Wizard's Chess effects. The only real use case would be a GPU fluid simulation, like if you built a lava flow in a dungeon room using Niagara Fluids (Grid 3D Liquid). In that case, Spawn Per Frame feeds the fluid grid evenly. For everything else, stick with Spawn Rate.

##### Combining Spawn Modules

You can stack multiple spawn modules in the same Emitter Update stage. They all contribute particles independently.

**In your games (real combos you will build)**:

| Game | Effect | Modules Used | How It Works |
|------|--------|-------------|--------------|
| DnD Tabletop | Campfire in a dungeon rest area | Spawn Rate (30/sec) + Spawn Burst (Count: 80) | Burst creates the initial ignition puff when the fire is lit, then Spawn Rate sustains the ongoing flame. Two emitters in one system: fire sprites + smoke sprites, each with their own combo. |
| DnD Tabletop | Wizard casting Fireball (charge + release) | Spawn Rate (ramps 10 to 200/sec via curve) + Spawn Burst (Count: 400) | During the cast animation, Spawn Rate ramps up as the fireball charges in the Wizard's hand. On release (animation notify triggers the burst), Spawn Burst fires the explosion. One system, two phases. |
| DnD Tabletop | Warrior's Whirlwind Strike (spinning AoE attack) | Spawn Rate (100/sec) + Spawn Per Unit (Spacing: 8) | Spawn Rate creates a constant shower of sparks while the ability is active. Spawn Per Unit draws the weapon slash trail as the character spins. Both run simultaneously during the ability window. |
| DnD Tabletop | Treasure chest opening | Spawn Burst (Count: 150, Time: 0) + Spawn Burst (Count: 50, Time: 0.3) + Spawn Rate (20/sec) | First burst is the initial gold sparkle explosion when the lid opens. Second burst is a secondary shimmer. Spawn Rate sustains a gentle ongoing sparkle while the chest stays open. Three modules, one emitter. |
| Wizard's Chess | Piece capture (full sequence) | Spawn Burst (Count: 300, Time: 0) + Spawn Burst (Count: 100, Time: 0.15) + Spawn Rate (40/sec, duration 2 sec) | Emitter 1 (debris): Mesh Renderer chunks burst on impact. Emitter 2 (dust): Sprite cloud follows 0.15 sec later. Emitter 3 (settling dust): Low Spawn Rate for lingering particles as debris settles. Whole system auto-deactivates after 3 seconds. |
| Wizard's Chess | King in check (persistent warning) | Spawn Rate (30/sec) + Spawn Burst (Count: 80, looping) | Spawn Rate maintains a red glow around the King. Spawn Burst fires every 2 seconds (use Emitter loop settings) as a pulsing warning flash. The combination creates a heartbeat-like danger indicator. |

##### Controlling Spawn from Blueprint

To control spawn count/rate at runtime from gameplay code:

1. In the Niagara Emitter, click the Spawn Rate parameter dropdown > **Link to User Parameter** > create a new User Parameter (e.g., `User.SpawnRateMultiplier`, type: float, default: 1.0)
2. Set the Spawn Rate expression to multiply by this parameter
3. In Blueprint, use the **Set Niagara Variable (Float)** node on the Niagara Component:
   - Target: Niagara Component reference
   - Variable Name: `User.SpawnRateMultiplier`
   - Value: your desired float
4. In C++: `NiagaraComponent->SetVariableFloat(FName("User.SpawnRateMultiplier"), 2.0f);`

This lets you dynamically increase/decrease particle spawn from abilities, damage events, or UI sliders.

**In your games (real Blueprint control scenarios)**:

- **DnD Tabletop, Healing Aura intensity**: The Cleric's heal scales with level. GAS Gameplay Effect calculates heal power, then calls `SetNiagaraVariable(Float)` with `User.SpawnRateMultiplier` set to `HealPower / BaseHealPower`. Level 1 Cleric gets a gentle 30/sec glow, Level 10 Cleric gets an intense 200/sec cascade. Same Niagara System, different feel.
- **DnD Tabletop, Torch flickering based on wind**: If you have a wind system affecting the dungeon, pass the wind intensity as a User Parameter. The torch flame Spawn Rate multiplies by it: calm room = steady flame, windy corridor = wild flickering (higher spawn rate + more Curl Noise force).
- **DnD Tabletop, Rage mode**: When the Barbarian activates Rage, the ability Blueprint sets `User.RageActive` to 1.0, which drives a red particle aura's Spawn Rate from 0 to 100/sec. When Rage ends, set it back to 0. Clean on/off control from GAS.
- **Wizard's Chess, piece power level**: Higher-value pieces (Queen, Rook) get more intense auras. Pass the piece's point value as a User Parameter. Pawn = subtle 10/sec glow, Queen = dramatic 60/sec swirl. One Niagara System shared across all pieces, differentiated by a single parameter.
- **Wizard's Chess, tension escalation**: As the game approaches checkmate (fewer pieces remaining), increase the ambient board particle rate. Blueprint counts remaining pieces, maps it to a 0-1 range, sets the board emitter's Spawn Rate multiplier. The board gets more charged and dramatic as the endgame approaches.

##### Max Particle Count (Hard Limit)

Not a spawn module, but directly controls maximum alive particles. Found in **Emitter Properties** (click the emitter name at the top of the stack).

**Path**: Niagara Editor > select Emitter > Emitter Properties (top of stack) > **Max Allocation Count**

| Parameter | Description |
|-----------|-------------|
| **Max Allocation Count** | Hard cap on total alive particles for this emitter. Once reached, new spawns are silently dropped until existing particles die. Set based on visual needs and performance budget. |

This is your safety valve. Even if Spawn Rate is set to 50,000/sec, Max Allocation Count prevents runaway particle counts.

**In your games (budget guide)**:

| Game | Effect Type | Suggested Max Allocation | Why |
|------|------------|------------------------|-----|
| DnD Tabletop | Single torch flame | 150-200 | Small, localized. But a dungeon room might have 6-8 torches, so keeping each one lean matters. 8 torches x 200 = 1,600 particles total, very manageable. |
| DnD Tabletop | Fireball explosion | 500-800 | Big burst but short-lived (particles die within 1-2 sec). The count is high but transient. Set it and forget it, it cleans up fast. |
| DnD Tabletop | Ambient dungeon dust | 100-150 | Long-lived particles (8-12 sec) at low spawn rate. They accumulate slowly to the cap and hover there. Low budget, high atmosphere. |
| DnD Tabletop | Poison cloud (AoE DoT zone) | 400-600 | Needs to look thick and threatening for the full ability duration. Higher cap because the cloud persists for several seconds. |
| DnD Tabletop | Full combat scene (all effects combined) | Budget: 3,000-5,000 total | Across all active systems in a combat encounter. Profile with `stat niagara` to monitor. If you hit frame drops, lower individual Max Allocation Counts on the least important effects first (ambient dust, idle auras). |
| Wizard's Chess | Per-piece idle aura | 50-80 | 16 pieces per side, 32 total. At 80 each that is 2,560 max. Keep individual piece auras lean. |
| Wizard's Chess | Piece capture explosion | 400-600 | Only one capture happens at a time, so you can afford a higher budget for the moment of drama. |
| Wizard's Chess | Board ambient particles | 200-300 | Covers the whole board surface. Gentle, persistent, low cost. |
| Wizard's Chess | Full board (all effects) | Budget: 4,000-6,000 total | 32 piece auras + board ambient + occasional capture explosions. The captures are transient so the steady-state cost is mainly the idle auras + board ambient. |

#### Initialize Particle Modules
| Module | Description |
|--------|-------------|
| **Initialize Particle** | Sets initial lifetime, mass, color, sprite size, sprite rotation, mesh scale, velocity, position. Configurable ranges for randomization. |
| **Shape Location** | Initializes position within a shape: Sphere, Box, Cylinder, Torus, Cone, Ring, Disc, Mesh Surface, Skeletal Mesh Surface, Spline |
| **Set Specific Parameters** | Individually sets any particle attribute |

#### Particle Update Modules
| Module | Description |
|--------|-------------|
| **Particle State** | Manages particle lifetime; kills particles when age exceeds lifetime. Optionally loops or executes once. |
| **Gravity Force** | Applies constant downward (or custom direction) acceleration |
| **Drag** | Applies velocity damping based on a drag coefficient |
| **Curl Noise Force** | Procedural turbulence using curl noise; great for smoke, magical effects |
| **Vortex Force** | Spins particles around an axis |
| **Point Force** | Attracts or repels particles from a point |
| **Point Attractor** | Attracts particles to a point with configurable falloff |
| **Wind Force** | Applies directional wind |
| **Collision** | Detects and responds to world collision (using Scene Depth, Distance Fields, or Collision Query DI). Configurable bounce, friction, kill on contact. |
| **Scale Color** | Multiplies color over lifetime using a curve |
| **Scale Size** | Multiplies size over lifetime using a curve |
| **Scale Sprite Size** | Sprite-specific size scaling |
| **Scale Mesh Size** | Mesh-specific size scaling |
| **Color** | Sets or overrides particle color |
| **Solve Forces and Velocity** | Integrates accumulated forces into velocity and position. Must be present for forces to work. |
| **Sprite Rotation Rate** | Spins sprites over time |
| **Align Sprite to Velocity** | Orients sprites along movement direction |
| **Sub UV Animation** | Advances flipbook frames over lifetime |
| **Camera Offset** | Pushes particles toward/away from camera to reduce sorting artifacts |
| **Acceleration Force** | Constant acceleration in a direction |
| **Orbit** | Particles orbit around a center point |
| **Mesh Rotation Force** | Applies torque to mesh particles |
| **Kill Particles in Volume** | Removes particles that enter/exit a defined volume |
| **Limit Force** | Caps maximum force applied to particles |
| **Spring Force** | Elastic spring behavior toward a target |

---

### Events and Event Handlers

#### Generating Events
- Modules can generate events using **Generate Event** modules in the Particle Update or Emitter Update stages
- Built-in event types:
  - **Death Event**: Fires when a particle dies (passes location, velocity, etc.)
  - **Collision Event**: Fires when a particle collides (passes hit position, normal, velocity)
  - **Location Event**: Broadcasts particle positions
  - **Custom Events**: User-defined payload

#### Handling Events
- Add an **Event Handler** stage to the receiving Emitter
- Configure which event to listen to (by name and source Emitter)
- Execution modes:
  - **Spawn**: Spawn new particles in response to events
  - **GPU Event Script**: For GPU emitters

#### Niagara Data Channels (5.4+)
- System for decoupled inter-system communication
- Allows Niagara systems to publish and subscribe to data channels
- The Niagara Examples Pack for UE 5.7 includes examples of Data Channel spawning

---

### GPU vs CPU Simulation

#### CPU Simulation (Sim Target: CPUSim)
- Executes on the CPU main thread or async
- Full access to all Data Interfaces including Collision Query, Blueprint export, and complex logic
- Better for small particle counts with complex per-particle logic
- Supports events natively
- Required for: Blueprint data export, complex collision, custom simulation stages with CPU-only data interfaces

#### GPU Simulation (Sim Target: GPUCompute)
- Executes on the GPU via compute shaders
- Handles millions of particles efficiently
- Limited Data Interface support (no Blueprint export, no direct Collision Query with physics scene)
- Collision uses Scene Depth or Distance Field methods
- No CPU readback (unless using GPU Readback, which adds latency)
- Required for: Neighbor Grid 3D, Grid Collections, Niagara Fluids

#### When to Use Which
| Scenario | Recommendation |
|----------|---------------|
| Large particle counts (>10,000) | GPU |
| Fluid simulation, neighbor interactions | GPU |
| Complex per-particle Blueprint logic | CPU |
| Small counts with physics collision | CPU |
| Simple visual effects (sparks, dust) | GPU for volume, CPU for simplicity |
| Exporting data to gameplay systems | CPU |
| Grid-based simulations | GPU |

---

### Performance and Optimization

#### Scalability Settings
- **Effect Type**: Assign to emitters/systems to define budget categories
- Effect Types define: max particle count per system, max distance, cull distance, significance priority
- Scalability settings per platform: Low, Medium, High, Epic, Cinematic
- **Lightweight Emitters** (stateless emitters): Reduced functionality in exchange for higher performance. Used in the Niagara Examples Pack for UE 5.7 where appropriate.

#### Optimization Tips
- Use **Fixed Bounds** instead of dynamic bounds calculation (Emitter Properties > Fixed Bounds)
- Enable **Local Space** simulation when possible (avoids large-world coordinate precision issues)
- Reduce **Max Particle Count** to enforce hard limits
- Use **Cull Distance** to disable systems beyond a range
- Use **LOD** distances to simplify or disable emitters at distance
- Pool Niagara Components via **Component Pool** settings on the Niagara Component
- Prefer GPU simulation for high particle counts
- Use **Sprite Cutout** on Sprite Renderer to reduce overdraw
- Limit **Light Renderer** usage; each particle light costs a draw
- Profile with `stat niagara` and `stat niagaraGPU` console commands

#### Console Commands
| Command | Description |
|---------|-------------|
| `stat niagara` | Shows Niagara CPU performance statistics |
| `stat niagaraGPU` | Shows Niagara GPU performance statistics |
| `fx.Niagara.QualityLevel` | Sets quality level (0-4) |
| `fx.Niagara.MaxSystemCount` | Caps maximum active systems |
| `fx.Niagara.Debug.Enabled 1` | Enables Niagara debug HUD |
| `fx.Niagara.Debug.DrawBounds 1` | Visualizes emitter bounds |

---

### Niagara Fluids

- GPU-based fluid simulation framework built on the Niagara grid system
- **Types**: 2D Fluid, 3D Gas/Smoke, 3D Liquid (SPH-based)
- Uses Grid2D and Grid3D Data Interfaces for pressure solve, advection, and density transport
- Create via Niagara System templates: **Grid 2D Gas**, **Grid 3D Gas**, **Grid 3D Liquid**
- Requires GPU simulation (GPUCompute)
- **Key parameters**: Grid Resolution, Pressure Iterations, Vorticity Confinement, Temperature Buoyancy, Dissipation Rate
- Performance is directly tied to grid resolution; halving resolution in each dimension reduces cost by 8x for 3D
- Integrates with world collision via Distance Field sampling
- Can drive particles (advect sprites/meshes through the fluid velocity field)
- Interoperable with PCG framework planned for future versions

---

### Niagara Examples Pack (New in UE 5.7)
- Over 50 free Niagara systems available on Fab
- Includes: explosions, bullet impacts, trails, sparks, fire, smoke, mist cards, player/weapon buffs and debuffs, footstep effects (animation notify-based), pings and markers, lightning, hit dissolves
- Each system has assigned Effect Types with scalability settings
- Demonstrates both Data Channel spawning and per-step system spawning patterns
- Uses Lightweight Emitters where appropriate for performance

---
