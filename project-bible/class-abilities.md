# Class and Ability Reference

**Version**: 0.1
**Last Updated**: 2026-03-04

This document contains the complete ability list for all 6 classes, including subclass abilities. Every ability has both a turn-based and real-time definition so the dual combat system works seamlessly.

---

## Class Summary Table

| Class | Role | Primary Stat | Armor | Weapons | HP/Level | Mana/Stamina |
|-------|------|-------------|-------|---------|----------|-------------|
| Warrior | Tank, Melee DPS | Might | Heavy (Plate, Chain) | Swords, Axes, Maces, Shields | 12 + Might mod | Stamina |
| Rogue | Melee DPS, Utility | Finesse | Light (Leather) | Daggers, Shortswords, Crossbows | 8 + Finesse mod | Stamina |
| Mage | Ranged DPS, Control | Mind | Cloth (Robes) | Staves, Wands | 6 + Mind mod | Mana |
| Cleric | Healer, Support | Mind + Presence | Medium (Chain, Scale) | Maces, Shields, Holy Symbols | 10 + Might mod | Mana |
| Ranger | Ranged DPS, Scout | Finesse + Mind | Medium (Leather, Scale) | Bows, Crossbows, Shortswords | 8 + Finesse mod | Mana/Stamina split |
| Bard | Support, Face | Presence | Light (Leather) | Rapiers, Instruments, Light Crossbows | 8 + Presence mod | Mana |

**Skill Proficiencies by Class**:
- Warrior: Athletics, Intimidation, Survival
- Rogue: Stealth, Perception, (choose 1: Athletics or Persuasion)
- Mage: Arcana, Perception, (choose 1: Medicine or Survival)
- Cleric: Medicine, Persuasion, Arcana
- Ranger: Survival, Stealth, Perception
- Bard: Persuasion, Perception, (choose 2: any)

---

## Warrior (Might)

**Role**: The front line. Warriors absorb damage, control enemy positioning, and deal consistent melee damage. They are the anchor of every party.

**Playstyle**: Stand in the middle of the fight, draw enemy attention, and protect squishier allies. In turn-based, position carefully to block chokepoints and use Taunt to control who enemies attack. In real-time, be aggressive with AoE abilities and use Shield Bash to interrupt dangerous enemies.

### Abilities

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Power Strike | Active | 10 Stamina | Action: Melee attack dealing 150% weapon damage to one target. | 6s cooldown. Heavy swing dealing 150% weapon damage. 0.5s wind-up animation. | 1 |
| 2 | Shield Bash | Active | 8 Stamina | Action: Melee attack dealing 75% weapon damage. Target is Stunned for 1 turn. Requires shield equipped. | 8s cooldown. Short-range bash dealing 75% damage. Target stunned for 2s. 0.3s wind-up. | 1 |
| 3 | Cleave | Active | 12 Stamina | Action: Melee attack hitting all enemies in a 180-degree arc (adjacent hexes in front). Deals 100% weapon damage to each. | 10s cooldown. Wide horizontal swing hitting all enemies in a 3m arc in front. 100% weapon damage. 0.6s wind-up. | 2 |
| 4 | Battle Cry | Active | 15 Stamina | Bonus Action: All party members gain +2 to attack rolls for 3 turns. | 20s cooldown. All party members within 15m gain +15% damage for 10s. Instant cast. | 3 |
| 5 | Second Wind | Active | 10 Stamina | Bonus Action: Heal self for 20% of max HP. Usable once per combat. | 30s cooldown. Heal self for 20% max HP over 3s. Cannot be interrupted. | 4 |
| 6 | Taunt | Active | 8 Stamina | Bonus Action: Choose one enemy. That enemy must target you with its next attack. Lasts 2 turns. | 12s cooldown. All enemies within 8m are forced to target you for 4s. Instant cast. | 5 |
| 7 | Whirlwind | Active | 20 Stamina | Action: Spin attack hitting ALL adjacent enemies (all 6 hexes around you). Deals 120% weapon damage to each. | 15s cooldown. 360-degree spin hitting all enemies within 3m. 120% weapon damage. 0.8s animation lock. | 7 |
| 8 | Iron Will | Passive | None | Passive: Immune to Stunned and Frightened conditions. | Same as turn-based. Always active. | 9 |

### Subclass: Champion (Level 5)

**Theme**: Raw offensive power. Critical hits come more often and hit harder.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Improved Critical | Passive | None | Critical hits trigger on 19 or 20 (instead of only 20). | Same. Crit chance increased from 5% to 10%. | 5 |
| 2 | Brutal Strike | Active | 18 Stamina | Action: Melee attack dealing 200% weapon damage. If this attack is a critical hit, deal 300% instead. | 12s cooldown. Heavy overhead strike. 200% damage (300% on crit). 0.7s wind-up. | 8 |
| 3 | Undying Rage | Active | 25 Stamina | Free Action (triggered): When reduced to 0 HP, instead drop to 1 HP and gain +50% damage for 2 turns. Once per long rest. | Auto-trigger: When HP hits 0, survive at 1 HP with +50% damage for 8s. 120s cooldown. | 12 |

### Subclass: Guardian (Level 5)

**Theme**: Unbreakable defender. Protect allies and absorb punishment.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Intercept | Active | 10 Stamina | Reaction: When an adjacent ally is attacked, you take the damage instead (reduced by 25%). | Auto-trigger: When an ally within 5m is attacked, you leap to intercept, taking 75% of the damage. 10s cooldown. | 5 |
| 2 | Fortress Stance | Active | 15 Stamina | Action: Enter a defensive stance. +4 AC, but movement reduced to 0 for 3 turns. Can still attack adjacent enemies. | 20s cooldown. Toggle ability. While active: +30% damage reduction, movement speed reduced by 70%. Toggle off to end. | 8 |
| 3 | Unbreakable | Passive | None | Passive: When below 25% HP, gain +2 AC and regenerate 5 HP per turn. | Same. Below 25% HP: +15% damage reduction and regenerate 3% max HP per second. | 12 |

---

## Rogue (Finesse)

**Role**: High single-target damage from advantageous positions. Excels at exploiting enemy weaknesses, scouting ahead, and disabling key targets.

**Playstyle**: In turn-based, use stealth and positioning to land Backstabs for massive damage. In real-time, dart around the battlefield, dodge attacks, and pick off priority targets. The Rogue is fragile but deadly when played with precision.

### Abilities

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Backstab | Active | 8 Stamina | Action: Melee attack from behind the target deals 200% weapon damage. If used from stealth, deals 250%. Must be behind the target (rear 3 hexes). | 4s cooldown. Melee attack deals 200% if behind target (250% from stealth). Position matters: must be within the rear 120-degree cone. | 1 |
| 2 | Evasion | Active | 10 Stamina | Reaction: When targeted by an attack, dodge it completely (guaranteed miss). Usable once per combat at level 1, twice at level 8. | 8s cooldown. Quick dodge roll with 0.4s of invincibility frames. Can be aimed with movement keys. | 1 |
| 3 | Poison Blade | Active | 12 Stamina | Bonus Action: Coat your weapon in poison. Next 3 attacks deal an additional 3 poison damage per turn for 3 turns (stacks). | 15s cooldown. Coat weapon for 12s. All attacks during this window apply a poison DoT (3 damage per second for 5s, stacks up to 3 times). | 2 |
| 4 | Shadow Step | Active | 15 Stamina | Bonus Action: Teleport to any hex within 6 hexes (30ft) that is behind an enemy. Arrive in stealth. | 12s cooldown. Blink to a position behind your target enemy (must be within 15m). Arrive with 2s of stealth. | 4 |
| 5 | Smoke Bomb | Active | 18 Stamina | Action: Throw a smoke bomb at a target hex. Creates a 2-hex radius cloud lasting 3 turns. All creatures inside are Blinded. You can see through your own smoke. | 20s cooldown. Throw to target location (up to 15m). Creates a 5m radius smoke cloud lasting 8s. Enemies inside are Blinded. You are unaffected. | 5 |
| 6 | Lockpick | Passive | None | Passive: Can attempt to open locked chests and doors. Skill check: 1d20 + Finesse mod + proficiency vs lock DC. | Same. Interact with locked objects to attempt pick. Success/fail based on invisible roll. Higher Finesse = more reliable. | 1 |
| 7 | Cheap Shot | Active | 10 Stamina | Action (from stealth only): Melee attack dealing 100% weapon damage. Target is Stunned for 1 turn. Breaks stealth. | 10s cooldown (only usable from stealth). Quick strike dealing 100% damage. Target stunned for 2.5s. | 6 |
| 8 | Deadly Precision | Passive | None | Passive: Critical hit damage increased from 200% to 250%. Critical hits also apply Bleeding (5 damage per turn for 2 turns). | Same. Crits deal 250% and apply Bleeding (5 damage per second for 4s). | 8 |

### Subclass: Assassin (Level 5)

**Theme**: Maximum burst damage. Delete one target before they can react.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Death Mark | Active | 15 Stamina | Bonus Action: Mark a target. Your next attack against that target within 2 turns deals +100% bonus damage. | 18s cooldown. Mark a target for 6s. Next attack against them deals double damage. | 5 |
| 2 | Vanish | Active | 20 Stamina | Bonus Action: Instantly enter stealth, even in combat, even if enemies are looking at you. Usable once per combat. | 25s cooldown. Go invisible for 3s. Next attack from this stealth deals Backstab damage regardless of position. | 8 |
| 3 | Executioner | Passive | None | Passive: Attacks against enemies below 25% HP automatically critically hit. | Same. Attacks on targets below 25% HP are guaranteed crits. | 12 |

### Subclass: Trickster (Level 5)

**Theme**: Battlefield control and misdirection. Make enemies fight each other or stumble over themselves.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Misdirect | Active | 12 Stamina | Action: Target enemy makes an attack against an adjacent ally of your choice (the enemy's ally, not yours). | 14s cooldown. Target enemy attacks its nearest ally once. 10m range. 0.3s cast time. | 5 |
| 2 | Caltrops | Active | 10 Stamina | Bonus Action: Place caltrops in a 2-hex radius area. Enemies entering the area take 5 damage and have movement halved for 1 turn. Lasts 5 turns. | 16s cooldown. Throw caltrops in a 4m radius area (up to 12m). Enemies in the area take damage and are slowed 50% for 3s. Lasts 15s. | 8 |
| 3 | Mirror Image | Active | 20 Stamina | Bonus Action: Create 2 illusory copies of yourself. Each copy absorbs one attack before disappearing. Lasts until all copies are destroyed or 5 turns pass. | 30s cooldown. Create 2 copies that circle you. Each absorbs one hit. Lasts 12s or until destroyed. | 12 |

---

## Mage (Mind)

**Role**: Devastating ranged damage and battlefield control. High damage potential but fragile and mana-hungry.

**Playstyle**: Stay at maximum range, destroy groups of enemies with AoE spells, and control the battlefield with slows and interrupts. In turn-based, position carefully behind the Warrior and use the grid to line up AoE attacks. In real-time, kite enemies and manage mana carefully.

### Abilities

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Fireball | Active | 15 Mana | Action: Launch a ball of fire at a target hex within 12 hexes. Explodes in a 2-hex radius. All creatures in area take 8 + Mind mod fire damage. Save for half. | 8s cooldown. Aim and launch a projectile (medium speed). Explodes on impact in a 4m radius. 8 + Mind mod damage. 0.6s cast time. | 1 |
| 2 | Frost Bolt | Active | 8 Mana | Action: Ranged spell attack against one target within 10 hexes. Deals 6 + Mind mod cold damage. Target's movement is halved next turn. | 5s cooldown. Fast projectile dealing 6 + Mind mod damage. Target slowed 40% for 3s. 0.3s cast time. | 1 |
| 3 | Lightning Chain | Active | 12 Mana | Action: Lightning bolt hits one target within 8 hexes for 5 + Mind mod lightning damage, then bounces to up to 2 additional enemies within 2 hexes of the first. Each bounce deals 75% of the previous hit's damage. | 10s cooldown. Target one enemy within 12m. Lightning bounces to 2 nearby enemies (within 5m). Each bounce deals 75% of previous damage. 0.4s cast time. | 3 |
| 4 | Arcane Shield | Active | 10 Mana | Bonus Action: Create a shield around yourself that absorbs the next 15 + Mind mod damage. Lasts 5 turns or until depleted. | 15s cooldown. Absorb shield for 15 + Mind mod HP. Lasts 10s or until depleted. Instant cast. | 2 |
| 5 | Teleport | Active | 12 Mana | Bonus Action: Instantly move to any unoccupied hex within 6 hexes (30ft). Does not provoke opportunity attacks. | 10s cooldown. Instant blink up to 15m in the direction you are moving. 0.1s cast time. | 4 |
| 6 | Counterspell | Active | 10 Mana | Reaction: When an enemy within 12 hexes casts a spell, interrupt it. The spell fails and the enemy's action is wasted. | Auto-trigger (configurable): When an enemy within 15m begins a cast, automatically interrupt it. 12s cooldown. Can be set to manual trigger in settings. | 6 |
| 7 | Meteor | Active | 35 Mana | Action: Call down a meteor on a target hex within 15 hexes. 3-hex radius. Deals 20 + (Mind mod x 2) fire damage. All targets are knocked Prone. 1 turn casting time (cast on turn 1, lands on turn 2). | 30s cooldown. 1.5s channel (interruptible). Massive AoE at target location (6m radius). 20 + (Mind mod x 2) damage. Targets knocked down for 2s. | 10 |
| 8 | Mana Surge | Passive | None | Passive: Regenerate 3 mana per turn instead of 2. When you reduce an enemy to 0 HP with a spell, regain 5 mana. | Same. Regen 3 mana per 6s instead of 2. Kill with spell = instant 5 mana refund. | 7 |

### Subclass: Elementalist (Level 5)

**Theme**: Pure elemental destruction. More damage, bigger explosions.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Elemental Mastery | Passive | None | Passive: Fire, Cold, and Lightning damage increased by 25%. | Same. All elemental spell damage +25%. | 5 |
| 2 | Inferno | Active | 25 Mana | Action: Create a 3-hex radius zone of fire at target location. Lasts 3 turns. Enemies starting their turn in the zone take 6 fire damage. | 20s cooldown. Ground-targeted AoE (6m radius). Burns for 10s. Enemies in the zone take 6 fire damage per second. 0.5s cast time. | 8 |
| 3 | Storm Call | Active | 40 Mana | Action: Lightning strikes random enemies within a massive 5-hex radius, 8 hexes range. Each enemy is struck once for 12 + Mind mod damage. Concentration: lasts 3 turns, one strike per enemy per turn. | 45s cooldown. Channeled for 8s (interruptible). Lightning randomly strikes enemies within 10m radius every 0.5s. Each strike deals 12 + Mind mod damage. | 13 |

### Subclass: Archmage (Level 5)

**Theme**: Control and utility. Bend the battlefield to your will.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Spell Weaving | Passive | None | Passive: Concentration spells no longer end when you take damage (they still end if you are Stunned). | Same. Channeled abilities are not interrupted by damage, only by Stun. | 5 |
| 2 | Time Warp | Active | 20 Mana | Action: Target one ally within 10 hexes. That ally immediately takes an extra turn after yours. Usable once per combat. | 40s cooldown. Target one ally. Their cooldowns are instantly reset. 0.5s cast time. | 8 |
| 3 | Dimensional Rift | Active | 30 Mana | Action: Create a portal at your location and another at a target hex within 15 hexes. Any creature can step through to teleport. Lasts 5 turns. | 35s cooldown. Place two portal markers. Any ally or enemy that touches one teleports to the other. Lasts 15s. 0.8s cast time. | 13 |

---

## Cleric (Mind + Presence)

**Role**: The party's lifeline. Clerics keep everyone alive, provide powerful buffs, and can deal respectable radiant damage when healing is not needed.

**Playstyle**: In turn-based, position in the middle of the party to reach everyone with heals. Use Bless early and maintain it. Smite when the party is healthy. In real-time, set party AI to handle DPS while you focus on keeping HP bars full. Switch to Smite when things are under control.

### Abilities

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Heal | Active | 10 Mana | Action: Heal one ally within 6 hexes for 8 + Mind mod HP. | 6s cooldown. Target an ally within 12m. Heal for 8 + Mind mod. 0.4s cast time. | 1 |
| 2 | Holy Light | Active | 20 Mana | Action: Burst of light heals all allies within 3 hexes of a target point for 5 + Presence mod HP. | 15s cooldown. AoE heal centered on you (6m radius). All allies healed for 5 + Presence mod. 0.6s cast time. | 3 |
| 3 | Smite | Active | 12 Mana | Action: Ranged spell attack against one target within 8 hexes. Deals 7 + Mind mod radiant damage. Deals double damage to undead. | 5s cooldown. Beam of light hits one target within 12m. 7 + Mind mod radiant damage (double vs undead). 0.3s cast time. | 1 |
| 4 | Bless | Active | 15 Mana | Action: Choose up to 3 allies within 6 hexes. They gain +2 to attack rolls and saving throws for 5 turns. Concentration. | 18s cooldown. All allies within 10m gain +10% hit chance and +10% resistance to conditions for 15s. Channeled (moving cancels it unless Protector subclass). | 2 |
| 5 | Shield of Faith | Active | 12 Mana | Bonus Action: One ally within 6 hexes gains +2 AC for 5 turns. Concentration. | 14s cooldown. Target ally gains 20% damage reduction for 12s. Instant cast. | 4 |
| 6 | Turn Undead | Active | 15 Mana | Action: All undead within 4 hexes must save or be Frightened for 3 turns. Frightened undead must move away from you. | 20s cooldown. All undead within 8m are Frightened for 6s, forcing them to flee. 0.5s cast time. | 5 |
| 7 | Resurrect | Active | 40 Mana | Action: Revive a fallen ally within 3 hexes with 50% HP. 1 turn casting time (vulnerable while casting). Usable once per combat. | 45s cooldown. 3s channel (interruptible). Revive a fallen ally within 5m at 50% HP. Once per combat. | 8 |
| 8 | Divine Ward | Passive | None | Passive: When any ally within 4 hexes drops below 25% HP, they automatically receive a heal for 10 HP. Triggers once per ally per combat. | Same. Auto-trigger: when ally within 8m drops below 25% HP, instant 10 HP heal. Once per ally per combat. | 6 |

### Subclass: Lightbringer (Level 5)

**Theme**: Offensive healer. Smite harder and heal while doing damage.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Radiant Strikes | Passive | None | Passive: Your Smite now also heals the lowest-HP ally within 4 hexes for 50% of the damage dealt. | Same. Smite damage heals the lowest-HP ally within 8m for 50% of damage dealt. | 5 |
| 2 | Solar Flare | Active | 25 Mana | Action: Blast of radiant energy in a 3-hex cone. Deals 10 + Mind mod radiant damage. Blinds enemies for 1 turn. | 16s cooldown. Cone attack (8m range, 60-degree cone). 10 + Mind mod damage. Blinds for 3s. 0.5s cast time. | 8 |
| 3 | Divine Judgment | Active | 35 Mana | Action: Call down a pillar of light on one enemy within 10 hexes. Deals 25 + (Mind mod x 2) radiant damage. If the target dies, all allies are healed for 15 HP. | 40s cooldown. Single target nuke (15m range). 25 + (Mind mod x 2) damage. On kill: party heals 15 HP. 1.0s cast time. | 12 |

### Subclass: Protector (Level 5)

**Theme**: Unshakeable defense and shields. The party's fortress.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Sanctuary Aura | Passive | None | Passive: All allies within 3 hexes take 10% less damage from all sources. | Same. 6m radius aura, allies take 10% reduced damage. | 5 |
| 2 | Aegis of Light | Active | 20 Mana | Action: Place a shimmering barrier on a target hex row (3 hexes wide). Enemies cannot pass through it for 3 turns. Allies can pass freely. | 22s cooldown. Place a wall of light (6m wide) at target location within 10m. Blocks enemy movement for 8s. Allies unaffected. 0.6s cast time. | 8 |
| 3 | Martyr's Gift | Active | 30 Mana | Bonus Action: Transfer all negative conditions from all allies to yourself. You are immune to those conditions for 1 turn (they are simply removed). 1 use per combat. | 60s cooldown. Instant cast. All debuffs from all allies transfer to you, then are immediately cleansed. Once per combat. | 12 |

---

## Ranger (Finesse + Mind)

**Role**: Ranged damage dealer and scout. Excels at single-target damage from a distance, with utility in scouting, trapping, and a loyal animal companion.

**Playstyle**: In turn-based, stay at maximum range, use Hunter's Mark to boost damage, and let the wolf companion flank enemies. In real-time, kite enemies with Aimed Shot and Volley while the companion draws aggro. Use Snare Trap to control choke points.

### Abilities

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Aimed Shot | Active | 10 Stamina | Action: Ranged attack against one target within 15 hexes. Deals 175% weapon damage. Cannot be used if an enemy is adjacent (within 1 hex). | 7s cooldown. Charged shot (hold to charge 0.5-1.5s). Damage scales: 125% at 0.5s to 175% at full charge. Cannot fire while being melee'd (interrupted). | 1 |
| 2 | Volley | Active | 15 Mana | Action: Rain arrows on a 2-hex radius area within 12 hexes. All enemies in area take 80% weapon damage. | 12s cooldown. Ground-targeted AoE (4m radius, 18m range). 80% weapon damage to all enemies. 0.5s cast time. | 3 |
| 3 | Hunter's Mark | Active | 8 Mana | Bonus Action: Mark one enemy within 15 hexes. All your attacks against that target deal +1d6 bonus damage. Lasts until target dies or 10 turns. Concentration. | 10s cooldown. Mark one enemy (any range if visible). +30% damage to that target. Lasts 20s or until target dies. Instant cast. | 1 |
| 4 | Snare Trap | Active | 10 Stamina | Action: Place a trap on an adjacent hex. First enemy to step on it is Rooted (cannot move) for 2 turns and takes 5 damage. Trap is invisible. Lasts until triggered or 10 turns. | 14s cooldown. Place trap at your feet. First enemy within 2m triggers it: rooted for 4s, takes 5 damage. Trap lasts 30s. | 2 |
| 5 | Animal Companion | Active | 20 Mana | Action (summon): Summon a wolf (or hawk at level 8). Wolf: 30 HP, melee attack 5 damage, has Pack Tactics (advantage when adjacent to an ally). Hawk: 15 HP, flying, 3 damage ranged, can Scout (reveals 3-hex area). Companion persists until killed or dismissed. One companion at a time. | Same. Wolf: AI-controlled melee pet, 30 HP, attacks nearest enemy. Hawk: circles overhead, auto-attacks from range, reveals stealthed enemies in 10m. Persists until killed. 60s cooldown to resummon if killed. | 4 |
| 6 | Nature's Whisper | Active | 8 Mana | Bonus Action: Reveal all hidden enemies, traps, and secrets within 8 hexes for 3 turns. | 18s cooldown. Pulse reveals all hidden enemies, traps, and interactable objects within 15m for 8s. Instant cast. | 5 |
| 7 | Multishot | Active | 14 Stamina | Action: Fire 3 arrows at up to 3 different targets within 12 hexes. Each arrow deals 75% weapon damage. | 10s cooldown. Rapid fire 3 arrows at your current target (or split targets if multiple are highlighted). 75% weapon damage each. 0.4s total animation. | 6 |
| 8 | Keen Eye | Passive | None | Passive: +3 to Perception checks. Advantage on checks to spot traps and hidden enemies. Critical hit range on ranged attacks expanded to 19-20. | Same. +3 Perception. Auto-detect traps within 8m (icon appears). Ranged crit chance doubled (5% to 10%). | 9 |

### Subclass: Beastmaster (Level 5)

**Theme**: Your companion becomes a true partner in combat, not just a pet.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Empowered Companion | Passive | None | Passive: Companion gains +50% HP, +50% damage, and +2 AC. Companion levels up with you and gains your Finesse modifier to its attacks. | Same. Wolf: 45 HP, 7.5 damage. Hawk: 22 HP, 4.5 damage. Both gain your Finesse mod to attacks. | 5 |
| 2 | Pack Command | Active | 12 Mana | Bonus Action: Command your companion to perform a special attack. Wolf: Pounce (charge + knockdown). Hawk: Dive Bomb (high damage single strike + Blind for 1 turn). | 14s cooldown. Direct your companion to use its special attack on a target. Wolf: charge + 2s knockdown. Hawk: dive for 150% damage + 2s Blind. | 8 |
| 3 | Spirit Bond | Passive | None | Passive: While your companion is alive, you regenerate 3 HP per turn. If your companion dies, gain Enraged (+25% damage) for 3 turns. | Same. Companion alive: regen 3 HP per 6s. Companion killed: +25% damage for 10s. | 12 |

### Subclass: Sharpshooter (Level 5)

**Theme**: Extreme ranged damage. Headshots, penetration, and devastating single-target power.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Headshot | Active | 15 Stamina | Action: Ranged attack at disadvantage (harder to hit). If it hits, deals 300% weapon damage and Stuns for 1 turn. | 14s cooldown. Small reticle (harder to aim). Deals 300% damage and 2s Stun on hit. Miss penalty if target is moving. 0.8s charge required. | 5 |
| 2 | Piercing Arrow | Active | 12 Stamina | Action: Fire an arrow in a straight line through all enemies in its path (up to 15 hexes). Each enemy hit takes 100% weapon damage. | 12s cooldown. Arrow penetrates through all enemies in a line (20m range). 100% weapon damage to each. 0.3s cast. | 8 |
| 3 | Eagle Eye | Passive | None | Passive: Your ranged attack range is increased by 50%. Attacks at maximum range deal +25% damage instead of the normal range penalty. | Same. Ranged abilities gain 50% more range. Attacks beyond normal range deal +25% damage. | 12 |

---

## Bard (Presence)

**Role**: Force multiplier and party face. The Bard makes everyone else better through buffs, debuffs, healing, and crowd control. Outside combat, the Bard excels at dialogue and NPC interaction.

**Playstyle**: In turn-based, open with Inspire, maintain Song of Rest for sustained healing, and use Cutting Words to debuff dangerous enemies. Attack with Dissonant Whispers when you have spare actions. In real-time, toggle your song effects and focus on buffing/debuffing while letting the party handle most of the direct combat. Out of combat, the Bard unlocks unique dialogue options and better shop prices.

### Abilities

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Inspire | Active | 10 Mana | Bonus Action: Choose one ally within 8 hexes. That ally gains +1d4 to their next attack roll or saving throw. | 10s cooldown. Target ally gains +15% damage and +10% resistance for 8s. Instant cast. | 1 |
| 2 | Dissonant Whispers | Active | 12 Mana | Action: Target one enemy within 8 hexes. Deals 6 + Presence mod psychic damage. Target must save or be Frightened for 1 turn. | 7s cooldown. Target enemy within 12m. 6 + Presence mod damage. 30% chance to Fear for 3s (scales with Presence). 0.3s cast time. | 1 |
| 3 | Song of Rest | Active | 15 Mana | Action: Begin singing. All allies within 4 hexes regenerate 3 HP per turn. Concentration, lasts up to 5 turns. | 20s cooldown. Toggle aura (6m radius). Allies regenerate 3 HP per 3s while active. Drains 2 mana per 3s while active. Movement does not cancel it. | 3 |
| 4 | Cutting Words | Active | 8 Mana | Reaction: When an enemy within 8 hexes makes an attack roll, reduce it by 1d4. Can turn a hit into a miss. | Auto-trigger (configurable): When an enemy attacks an ally within 12m, reduce that attack's damage by 15%. 8s cooldown. | 2 |
| 5 | Charm Person | Active | 15 Mana | Action (combat): Target one humanoid enemy within 6 hexes. Target must save or be Charmed for 3 turns (cannot attack you, treats you as friendly). Out of combat: auto-succeed on one Persuasion check against a humanoid NPC. | 20s cooldown. Target one humanoid enemy within 10m. If successful (based on Presence vs target Mind), enemy stops attacking for 5s and wanders aimlessly. Out of combat: use on NPCs for bonus dialogue options. | 4 |
| 6 | Countercharm | Active | 10 Mana | Bonus Action: All allies within 4 hexes are cleansed of Charmed, Frightened, and Stunned conditions. | 16s cooldown. AoE cleanse (6m radius). Removes Charmed, Frightened, and Stunned from all allies. Instant cast. | 5 |
| 7 | Ballad of Heroes | Active | 30 Mana | Action: Perform for 1 turn (Concentration). At the start of your next turn, all allies within 6 hexes gain: +2 to all stats, +2 AC, and advantage on all rolls for 3 turns. The ultimate party buff. Usable once per combat. | 50s cooldown. 2s channel. All allies within 10m gain +15% to all stats, +15% damage reduction, and +15% damage for 12s. Once per combat. | 10 |
| 8 | Silver Tongue | Passive | None | Passive: +3 to Persuasion and Intimidation checks. Shop prices are 15% better (buy lower, sell higher). Unlock unique dialogue options with NPCs that other classes cannot access. | Same. Passive social bonuses always active. In dialogue, Bard-specific options appear marked with a lute icon. | 1 |

### Subclass: War Chanter (Level 5)

**Theme**: Aggressive support. Your songs empower allies to fight harder and faster.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Anthem of Fury | Active | 18 Mana | Action: All allies within 4 hexes gain +2 to damage rolls and an extra 5ft of movement for 3 turns. Concentration. | 22s cooldown. Aura (6m). Allies gain +20% damage and +15% movement speed for 10s. Toggle, drains 3 mana per 3s. | 5 |
| 2 | Discordant Slam | Active | 14 Mana | Action: Slam your instrument on the ground. All enemies within 2 hexes take 8 + Presence mod thunder damage and are pushed back 2 hexes. | 12s cooldown. AoE around you (4m radius). 8 + Presence mod damage, knocks enemies back 3m. 0.5s cast time. | 8 |
| 3 | Dirge of Doom | Active | 25 Mana | Action: Play a haunting melody. All enemies within 6 hexes have -2 to all stats and deal 25% less damage for 3 turns. Concentration. | 35s cooldown. Aura (10m). All enemies suffer -15% to all stats and -25% damage for 10s. Channeled. | 12 |

### Subclass: Loremaster (Level 5)

**Theme**: Knowledge and utility. Know everything, prepare for everything, and have a trick for every situation.

| # | Ability | Type | Cost | Turn-Based Effect | Real-Time Effect | Level |
|---|---------|------|------|-------------------|------------------|-------|
| 1 | Identify Weakness | Active | 8 Mana | Bonus Action: Analyze one enemy. Reveal its HP, weaknesses, resistances, and next intended action. Shared with the party. | 10s cooldown. Target one enemy. A tooltip displays its HP, weaknesses, and resistances for the rest of combat. Instant cast. | 5 |
| 2 | Arcane Chord | Active | 15 Mana | Action: Cast any one Mage spell of level 7 or below that you have seen cast this combat (copy it). Uses your Presence modifier instead of Mind. One use per combat. | 25s cooldown. Replicate the last ability used by any ally. Uses your stats. One use per combat. | 8 |
| 3 | Foresight | Passive | None | Passive: The party cannot be surprised (no surprise rounds against you). At the start of combat, you can see enemy initiative order before choosing your actions. | Same. Enemies cannot ambush your party. At combat start, a brief flash shows all enemy positions and types. | 12 |

---

## Ability Naming Conventions

For implementation in UE5, all abilities follow this naming pattern:

- **Internal ID**: `class_abilityname` (lowercase, underscore). Example: `warrior_power_strike`
- **Subclass ability ID**: `class_subclass_abilityname`. Example: `warrior_champion_brutal_strike`
- **Data Table Row Name**: Same as internal ID
- **Animation Montage**: `AM_ClassName_AbilityName`. Example: `AM_Warrior_PowerStrike`
- **Icon**: `T_Icon_ClassName_AbilityName`. Example: `T_Icon_Warrior_PowerStrike`

---

## Balance Notes

These are starting values. Everything will need tuning through playtesting.

- **Damage per second (DPS) target by role**: Pure DPS (Mage, Rogue, Ranger) should deal roughly 2x the DPS of support classes (Cleric, Bard) and 1.5x the DPS of the Warrior.
- **Healing per second (HPS)**: Cleric should be able to sustain-heal through Tier-appropriate damage on one ally. Bard's healing is supplementary, about 60% of Cleric output.
- **Mana economy**: Casters should be able to sustain basic rotations (spam their cheapest damage spell) indefinitely with mana regen. Full rotations (using all abilities on cooldown) should drain mana in about 45 seconds, requiring potion use or mana management.
- **Stamina economy**: Warrior and Rogue abilities cost less on average because they have no ranged options. They should rarely run out of stamina in normal play.
