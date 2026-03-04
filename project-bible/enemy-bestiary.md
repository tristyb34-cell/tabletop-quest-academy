# Enemy Bestiary

**Version**: 0.1
**Last Updated**: 2026-03-04

This document contains all enemy types organized by tier, including stats, abilities, AI behavior patterns, and boss encounter designs. All values are starting points for balancing through playtesting.

---

## Enemy Summary Table

| # | Name | Tier | Type | Role | HP Range | Primary Attack |
|---|------|------|------|------|----------|---------------|
| 1 | Goblin | 1 | Humanoid | Melee Swarm | 12-18 | Rusty Dagger |
| 2 | Goblin Archer | 1 | Humanoid | Ranged | 8-14 | Shortbow |
| 3 | Skeleton | 1 | Undead | Melee | 15-20 | Bone Sword |
| 4 | Giant Rat | 1 | Beast | Fast Melee | 6-10 | Bite |
| 5 | Bandit | 1 | Humanoid | Melee | 18-25 | Shortsword |
| 6 | Wolf | 1 | Beast | Fast Melee | 14-18 | Bite |
| 7 | Zombie | 1 | Undead | Slow Tank | 25-35 | Slam |
| 8 | Kobold Trapper | 1 | Humanoid | Utility | 10-14 | Trap + Crossbow |
| 9 | Orc Warrior | 2 | Humanoid | Heavy Melee | 45-60 | Greataxe |
| 10 | Orc Shaman | 2 | Humanoid | Caster | 30-40 | Spirit Bolt |
| 11 | Ogre | 2 | Giant | Slow Bruiser | 70-90 | Club |
| 12 | Ghost | 2 | Undead | Magic DPS | 25-35 | Life Drain |
| 13 | Dark Mage | 2 | Humanoid | Ranged Caster | 28-38 | Shadow Bolt |
| 14 | Mimic | 2 | Monstrosity | Ambush | 40-55 | Bite + Tongue |
| 15 | Giant Spider | 2 | Beast | Control | 35-50 | Bite + Web |
| 16 | Troll | 2 | Giant | Regenerator | 65-85 | Claw |
| 17 | Dragon Wyrmling | 3 | Dragon | Flying DPS | 80-100 | Claw + Breath |
| 18 | Lich | 3 | Undead | Boss Caster | 90-120 | Necrotic Bolt |
| 19 | Death Knight | 3 | Undead | Armored Melee | 100-130 | Greatsword |
| 20 | Demon | 3 | Fiend | Mobile DPS | 85-110 | Flame Blade |
| 21 | Beholder | 3 | Aberration | Eye Rays | 75-100 | Eye Beams |
| 22 | Mind Flayer | 3 | Aberration | Psychic Control | 65-85 | Mind Blast |

---

## Tier 1: Levels 1-5

### 1. Goblin

**Type**: Humanoid
**HP**: 12-18
**Primary Stat**: Finesse 8
**Armor Class**: 10
**Movement**: 30ft (6 hexes)
**Attack**: Rusty Dagger, 3-5 damage, melee

**Special Abilities**:
- **Pack Ambush**: When 3 or more Goblins are adjacent to the same target, they all gain advantage on attacks. In real-time, this translates to +25% damage when swarming.
- **Nimble Escape**: After attacking, can use a Bonus Action to Disengage or Hide. In real-time, Goblins attempt to dodge away after attacking.

**Behavior Pattern**: SWARM. Goblins rush the nearest target in groups. They attempt to surround a single enemy. If reduced to below 25% HP, they Flee toward the nearest cover. They never fight alone willingly.

**Weakness**: Fire (+50% damage from fire)
**Resistance**: None
**XP Value**: 25
**Loot Table**: Tier 1 Common (see Loot Tables document)

---

### 2. Goblin Archer

**Type**: Humanoid
**HP**: 8-14
**Primary Stat**: Finesse 10
**Armor Class**: 9
**Movement**: 30ft (6 hexes)
**Attack**: Shortbow, 4-6 damage, range 12 hexes

**Special Abilities**:
- **High Ground Seeker**: If elevated terrain is available, the Goblin Archer will always move to it first. Gains +2 to attack rolls from elevated positions.
- **Scatter Shot**: Once per combat, can fire 3 arrows at 3 different targets (one arrow each). Each deals 3 damage.

**Behavior Pattern**: SNIPER. Stays at maximum range. Prioritizes elevated positions. Targets the lowest-AC party member. Flees if any melee character closes to within 2 hexes.

**Weakness**: Fire (+50% damage from fire)
**Resistance**: None
**XP Value**: 30
**Loot Table**: Tier 1 Common

---

### 3. Skeleton

**Type**: Undead
**HP**: 15-20
**Primary Stat**: Might 8, Finesse 10
**Armor Class**: 11 (rusty armor scraps)
**Movement**: 30ft (6 hexes)
**Attack**: Bone Sword, 4-7 damage, melee

**Special Abilities**:
- **Undead Fortitude**: When reduced to 0 HP, roll a d20. On 10 or higher, the Skeleton survives with 1 HP instead. Can only trigger once. In real-time, 50% chance to survive a killing blow at 1 HP (once).
- **Reassemble**: If not destroyed by radiant or bludgeoning damage, a slain Skeleton has a 25% chance to reassemble after 3 turns with 50% HP.

**Behavior Pattern**: AGGRESSIVE. Walks directly toward the nearest enemy and attacks. No self-preservation, no tactics. Just relentless forward advance. Does not flee.

**Weakness**: Radiant (+50% damage), Bludgeoning (+25% damage, prevents Reassemble)
**Resistance**: Piercing (-25% damage from arrows and daggers), Poison (immune)
**XP Value**: 30
**Loot Table**: Tier 1 Common

---

### 4. Giant Rat

**Type**: Beast
**HP**: 6-10
**Primary Stat**: Finesse 12
**Armor Class**: 8
**Movement**: 40ft (8 hexes)
**Attack**: Bite, 2-4 damage, melee

**Special Abilities**:
- **Disease Carrier**: On hit, 20% chance to inflict Poisoned condition (lasts 3 turns). In real-time, 20% chance per hit to apply Poisoned for 6s.
- **Skitter**: Can move through spaces occupied by larger creatures. In real-time, rats clip through allied rats and can pass through the player's legs.

**Behavior Pattern**: SWARM. Giant Rats attack in large groups (4-8). They scatter when an AoE ability hits them, then regroup 1-2 turns later. They flee when fewer than 2 remain.

**Weakness**: Fire (+50% damage)
**Resistance**: None
**XP Value**: 10
**Loot Table**: Tier 1 Common (reduced: mostly junk items)

---

### 5. Bandit

**Type**: Humanoid
**HP**: 18-25
**Primary Stat**: Might 10, Finesse 10
**Armor Class**: 12 (leather armor)
**Movement**: 30ft (6 hexes)
**Attack**: Shortsword, 5-8 damage, melee

**Special Abilities**:
- **Dirty Fighting**: Once per combat, throw dirt/sand at a target's eyes. Target is Blinded for 1 turn. In real-time, 10s cooldown, 2s Blind.
- **Demand Surrender**: At the start of combat, the Bandit leader (if present) offers the party a chance to pay gold to avoid the fight. Costs (party level x 50) gold.

**Behavior Pattern**: TACTICAL. Bandits try to flank. One engages the front while others circle behind. They target characters carrying visible loot (priority: characters with the most gold-value equipment). If the fight turns bad (50% of bandits down), the leader orders retreat.

**Weakness**: None
**Resistance**: None
**XP Value**: 40
**Loot Table**: Tier 1 Common + Gold (10-30)

---

### 6. Wolf

**Type**: Beast
**HP**: 14-18
**Primary Stat**: Finesse 12, Might 10
**Armor Class**: 10
**Movement**: 40ft (8 hexes)
**Attack**: Bite, 5-8 damage, melee

**Special Abilities**:
- **Pack Tactics**: Advantage on attack rolls against a target if another Wolf is within 1 hex of the target. In real-time, +25% damage when another Wolf is within 3m of the target.
- **Pounce**: If the Wolf moves at least 4 hexes (20ft) in a straight line before attacking, the target must save or be knocked Prone. In real-time, the Wolf lunges from 8m+, knocking the target down for 1.5s.

**Behavior Pattern**: FLANKER. Wolves circle the party, attacking from multiple angles. They focus on isolated targets. The alpha (largest Wolf) engages first, and the others flank. Wolves flee when the alpha dies.

**Weakness**: Fire (+25% damage)
**Resistance**: Cold (-25% damage)
**XP Value**: 35
**Loot Table**: Tier 1 Common (pelts, fangs)

---

### 7. Zombie

**Type**: Undead
**HP**: 25-35
**Primary Stat**: Might 12
**Armor Class**: 8
**Movement**: 20ft (4 hexes)
**Attack**: Slam, 6-10 damage, melee

**Special Abilities**:
- **Undead Fortitude**: Same as Skeleton, but triggers on 8 or higher (more likely to survive).
- **Grasping Hands**: On hit, 30% chance to Grapple the target (target cannot move until they escape with an Athletics check). In real-time, 30% chance to Root the target for 2s on hit.
- **Mindless**: Immune to Charmed, Frightened, and psychic damage.

**Behavior Pattern**: AGGRESSIVE. Zombies are mindless. They walk toward the nearest living creature and attack. They never flee, never dodge, never use tactics. They are slow but relentless, often arriving in waves.

**Weakness**: Radiant (+50% damage), Fire (+25% damage)
**Resistance**: Poison (immune), Psychic (immune), Necrotic (-50% damage)
**XP Value**: 30
**Loot Table**: Tier 1 Common (mostly junk, occasionally a ring or amulet from their former life)

---

### 8. Kobold Trapper

**Type**: Humanoid
**HP**: 10-14
**Primary Stat**: Finesse 12, Mind 8
**Armor Class**: 10
**Movement**: 30ft (6 hexes)
**Attack**: Light Crossbow, 3-5 damage, range 10 hexes

**Special Abilities**:
- **Trap Layer**: At the start of combat, 1-3 traps are pre-placed in the encounter area (hidden, Perception check DC 12 to spot). Traps deal 8 damage and Root for 1 turn. In real-time, traps are visible as faint glimmers if the player has Perception 10+.
- **Cunning Retreat**: When hit, the Kobold can immediately move 2 hexes without provoking opportunity attacks. In real-time, hit Kobolds dash backward 4m.
- **Tinker's Bomb**: Once per combat, throw an alchemical bomb at a target hex within 6 hexes. 2-hex radius, 6 damage, and Burning for 2 turns.

**Behavior Pattern**: DEFENSIVE. Kobold Trappers set up traps before combat and then stay at range, kiting enemies toward their traps. They work in teams: one baits the player, the other shoots from behind cover. They flee when alone.

**Weakness**: Fire (+25% damage)
**Resistance**: None
**XP Value**: 35
**Loot Table**: Tier 1 Common + Trapping materials (crafting components)

---

## Tier 2: Levels 5-10

### 9. Orc Warrior

**Type**: Humanoid
**HP**: 45-60
**Primary Stat**: Might 14
**Armor Class**: 14 (chain mail + shield)
**Movement**: 30ft (6 hexes)
**Attack**: Greataxe, 10-16 damage, melee

**Special Abilities**:
- **Savage Charge**: If the Orc moves 3+ hexes before attacking, the attack deals +5 bonus damage and pushes the target back 1 hex. In real-time, charge attack from 6m+, +5 damage, knockback 2m.
- **Bloodlust**: When the Orc reduces an enemy to 0 HP, it immediately gains a bonus melee attack against an adjacent target. In real-time, killing blow grants 3s of +50% attack speed.
- **War Cry**: Once per combat, all Orcs within 4 hexes gain +2 to damage for 3 turns.

**Behavior Pattern**: AGGRESSIVE. Charges the nearest target. Prefers to engage Warrior-type characters in direct combat. Uses War Cry when near allies. Does not retreat.

**Weakness**: None
**Resistance**: None
**XP Value**: 100
**Loot Table**: Tier 2 Common/Uncommon

---

### 10. Orc Shaman

**Type**: Humanoid
**HP**: 30-40
**Primary Stat**: Mind 12, Presence 10
**Armor Class**: 11
**Movement**: 25ft (5 hexes)
**Attack**: Spirit Bolt, 8-12 damage, range 8 hexes

**Special Abilities**:
- **Ancestral Healing**: Heals one Orc ally within 6 hexes for 15 HP. 3 turn cooldown. In real-time, 10s cooldown, heals for 15 HP.
- **Lightning Totem**: Places a totem on a hex. The totem has 15 HP and attacks the nearest enemy each turn for 5 lightning damage (range 4 hexes). In real-time, totem auto-attacks every 2s. Lasts 20s.
- **Spirit Ward**: Gives one Orc ally a shield that absorbs 10 damage. 4 turn cooldown.

**Behavior Pattern**: SUPPORT. Stays behind Orc Warriors. Prioritizes healing the most damaged Orc. Places totems at the start of combat. Targets casters with Spirit Bolt. Flees when all Warrior allies are dead.

**Weakness**: Fire (+25% damage)
**Resistance**: Lightning (-25% damage)
**XP Value**: 120
**Loot Table**: Tier 2 Common/Uncommon + Totem (crafting material)

---

### 11. Ogre

**Type**: Giant
**HP**: 70-90
**Primary Stat**: Might 18
**Armor Class**: 11 (thick hide)
**Movement**: 25ft (5 hexes)
**Attack**: Massive Club, 15-22 damage, melee (2-hex reach)

**Special Abilities**:
- **Ground Pound**: Slams club into the ground. All enemies within 2 hexes must save or be knocked Prone and take 10 damage. 3 turn cooldown. In real-time, 12s cooldown, 4m AoE, 10 damage + 2s knockdown.
- **Boulder Throw**: Picks up and throws a rock at a target within 8 hexes. 12-18 damage. 4 turn cooldown. In real-time, 15s cooldown, slow projectile (dodgeable), 15 damage.
- **Thick Skull**: Immune to Stunned condition.

**Behavior Pattern**: BRUISER. Walks toward the largest cluster of enemies and uses Ground Pound. Throws boulders if unable to reach melee range. Focuses on whoever dealt the most damage to it. Never flees.

**Weakness**: Fire (+25% damage)
**Resistance**: Bludgeoning (-25% damage)
**XP Value**: 150
**Loot Table**: Tier 2 Uncommon + Gold (30-80)

---

### 12. Ghost

**Type**: Undead
**HP**: 25-35
**Primary Stat**: Mind 14
**Armor Class**: 13 (incorporeal, hard to hit)
**Movement**: 30ft (6 hexes), can fly and pass through walls

**Special Abilities**:
- **Life Drain**: Melee touch attack. Deals 8-12 necrotic damage and heals the Ghost for the same amount. In real-time, 5s cooldown, lunges through an enemy, dealing damage and self-healing.
- **Incorporeal Movement**: Can move through walls and solid objects. Physical attacks (swords, arrows) deal half damage. Only magical and radiant damage deals full damage.
- **Horrifying Visage**: Once per combat, all enemies within 4 hexes must save or be Frightened for 2 turns. In real-time, 20s cooldown, AoE fear for 4s.

**Behavior Pattern**: AMBUSH. Ghosts hide inside walls, then emerge to attack with Life Drain on the squishiest target (lowest AC or HP). They retreat back through walls when below 30% HP, then re-emerge for another ambush.

**Weakness**: Radiant (+100% damage)
**Resistance**: Physical (-50% from non-magical weapons), Poison (immune), Necrotic (immune)
**XP Value**: 130
**Loot Table**: Tier 2 Uncommon (ectoplasmic drops, spirit essences)

---

### 13. Dark Mage

**Type**: Humanoid
**HP**: 28-38
**Primary Stat**: Mind 14
**Armor Class**: 11 (robes + magic ward)
**Movement**: 30ft (6 hexes)
**Attack**: Shadow Bolt, 10-14 damage, range 10 hexes

**Special Abilities**:
- **Shadow Shield**: At combat start, the Dark Mage has a shield that absorbs 20 damage. Regenerates if not hit for 3 turns. In real-time, shield regenerates after 8s without taking damage.
- **Curse of Weakness**: Target one enemy within 8 hexes. That target deals 25% less damage for 3 turns. In real-time, 15s cooldown, debuff lasts 8s.
- **Blink**: When hit, 25% chance to teleport to a random hex within 4 hexes. In real-time, same chance, teleports 6-8m in a random direction.

**Behavior Pattern**: SNIPER. Stays at maximum range behind cover. Opens with Curse of Weakness on the party's highest DPS. Spams Shadow Bolt. Uses Blink to escape if caught. Prioritizes killing Clerics.

**Weakness**: Radiant (+25% damage)
**Resistance**: Necrotic (-50% damage)
**XP Value**: 140
**Loot Table**: Tier 2 Uncommon + Spell Scroll (random)

---

### 14. Mimic

**Type**: Monstrosity
**HP**: 40-55
**Primary Stat**: Might 14, Finesse 8
**Armor Class**: 13 (hard exterior)
**Movement**: 15ft (3 hexes)
**Attack**: Bite, 12-18 damage, melee; Tongue Lash, 6-8 damage, range 3 hexes

**Special Abilities**:
- **Disguise**: Before combat, the Mimic looks identical to a treasure chest. A Perception check (DC 14) reveals it. If a character attempts to open it without detecting it, the Mimic gets a free Surprise Round attack dealing double damage.
- **Adhesive Surface**: When a character attacks the Mimic with a melee weapon, 30% chance the weapon sticks to the Mimic. Stuck characters must spend an action to pull free. In real-time, 30% chance melee attacks cause a 2s Root on the attacker.
- **Devour**: If a target is grappled/stuck, the Mimic bites for 200% damage. In real-time, stuck targets take 200% bite damage.

**Behavior Pattern**: AMBUSH. Waits in disguise. After the surprise attack, it becomes a brawler, standing in place and biting/lashing anyone who comes close. Very slow movement. Does not pursue fleeing targets.

**Weakness**: Fire (+25% damage)
**Resistance**: Acid (immune), Poison (immune)
**XP Value**: 120
**Loot Table**: Tier 2 Uncommon/Rare (the "chest" actually contains loot, dropped on death)

---

### 15. Giant Spider

**Type**: Beast
**HP**: 35-50
**Primary Stat**: Finesse 14
**Armor Class**: 12
**Movement**: 35ft (7 hexes), can climb walls and ceilings

**Special Abilities**:
- **Web Shot**: Ranged attack (8 hexes). Target must save or be Restrained (cannot move or dodge) for 2 turns. The web can be destroyed (10 HP, vulnerable to fire). In real-time, 10s cooldown, fires web projectile, Restrained for 4s or until web is destroyed.
- **Venomous Bite**: Melee attack deals 8-12 damage. Target must save or take 4 poison damage per turn for 3 turns. In real-time, bite applies poison DoT (4 damage per 2s for 8s).
- **Wall Crawler**: Can move along walls and ceilings, gaining a height advantage (+2 to attacks from above). In real-time, spiders freely traverse vertical surfaces.

**Behavior Pattern**: CONTROL. Giant Spiders web the most dangerous target first (highest DPS), then focus bites on the Restrained victim. They attack from walls and ceilings when possible. They flee at 20% HP to their nest (if the encounter has one).

**Weakness**: Fire (+50% damage, also destroys webs instantly)
**Resistance**: Poison (-50% damage)
**XP Value**: 110
**Loot Table**: Tier 2 Common/Uncommon + Spider Silk (crafting material)

---

### 16. Troll

**Type**: Giant
**HP**: 65-85
**Primary Stat**: Might 16
**Armor Class**: 12 (thick rubbery skin)
**Movement**: 30ft (6 hexes)
**Attack**: Claw x2, 8-12 damage each, melee

**Special Abilities**:
- **Regeneration**: Regains 10 HP at the start of each of its turns. Fire or acid damage disables regeneration for 1 turn. In real-time, regenerates 3 HP per second. Fire or acid damage stops regeneration for 5s.
- **Reckless Frenzy**: When below 50% HP, attacks twice per turn (4 claw attacks instead of 2). In real-time, attack speed doubles below 50% HP.
- **Loathsome Limbs**: If a Troll takes 20+ damage in a single hit, a limb is severed. The severed limb fights independently (5 HP, 4 damage claw) for 3 turns. The Troll regrows the limb in 2 turns.

**Behavior Pattern**: AGGRESSIVE. Trolls charge the nearest enemy and claw relentlessly. They fight until destroyed. They never flee. They become more dangerous as they take damage due to Reckless Frenzy.

**Weakness**: Fire (+50% damage, stops regeneration), Acid (+50% damage, stops regeneration)
**Resistance**: Cold (-25% damage)
**XP Value**: 180
**Loot Table**: Tier 2 Uncommon + Troll Blood (alchemy ingredient)

---

## Tier 3: Levels 10-15

### 17. Dragon Wyrmling

**Type**: Dragon
**HP**: 80-100
**Primary Stat**: Might 16, Mind 12
**Armor Class**: 16 (scales)
**Movement**: 30ft ground (6 hexes), 60ft flying (12 hexes)

**Special Abilities**:
- **Breath Weapon**: 6-hex cone of elemental damage (type depends on dragon color: Red = fire, Blue = lightning, White = cold, Green = poison, Black = acid). Deals 20-30 damage. Save for half. 4 turn recharge (roll d6 at start of each turn; recharges on 5 or 6). In real-time, 15s cooldown, 12m cone, 25 damage.
- **Wing Buffet**: When in melee, can use a Bonus Action to flap wings. All adjacent enemies must save or be pushed back 2 hexes and knocked Prone. In real-time, 8s cooldown, 4m AoE knockback + 1.5s knockdown.
- **Flyby**: Can fly over enemies without provoking opportunity attacks. In real-time, has a swoop attack pattern where it dives, attacks, and pulls away.

**Behavior Pattern**: HIT AND RUN. The Wyrmling alternates between flying passes (Breath Weapon + Flyby) and brief ground engagements. It lands to use melee attacks and Wing Buffet, then takes off again. Prioritizes clustered enemies for Breath Weapon.

**Weakness**: Varies by color (Red: Cold. Blue: Poison. White: Fire. Green: Lightning. Black: Fire.)
**Resistance**: Immune to its own element
**XP Value**: 300
**Loot Table**: Tier 3 Rare + Dragon Scales (crafting material, 2-4)

---

### 18. Lich

**Type**: Undead
**HP**: 90-120
**Primary Stat**: Mind 18
**Armor Class**: 15 (magic wards)
**Movement**: 25ft (5 hexes), can hover

**Special Abilities**:
- **Necrotic Bolt**: Ranged spell, 15-20 necrotic damage, range 12 hexes. In real-time, 4s cooldown, fast projectile.
- **Raise Dead**: As an action, raise 2-3 Skeletons from any corpses within 6 hexes. Raised Skeletons have 10 HP and last for 5 turns. In real-time, 20s cooldown, summons last 15s.
- **Paralyzing Touch**: Melee touch, 10 necrotic damage, target must save or be Paralyzed for 2 turns. In real-time, 12s cooldown, 3s Paralyze on hit.
- **Legendary Resistance (2/combat)**: When the Lich would fail a saving throw, it can choose to succeed instead. In real-time, the first 2 crowd-control effects that hit the Lich are ignored.

**Behavior Pattern**: CONTROLLER. The Lich stays at range, raises minions for protection, and bombards with Necrotic Bolts. Uses Paralyzing Touch on any melee attacker that reaches it. Focuses fire on the healer. Does not flee but will teleport if surrounded.

**Weakness**: Radiant (+50% damage)
**Resistance**: Necrotic (immune), Poison (immune), Cold (-50% damage), non-magical physical (-50% damage)
**XP Value**: 400
**Loot Table**: Tier 3 Rare/Epic + Phylactery Fragment (quest item)

---

### 19. Death Knight

**Type**: Undead
**HP**: 100-130
**Primary Stat**: Might 18, Presence 14
**Armor Class**: 18 (cursed plate armor)
**Movement**: 30ft (6 hexes)
**Attack**: Cursed Greatsword, 16-24 damage + 5 necrotic, melee

**Special Abilities**:
- **Hellfire Orb**: Throws a ball of unholy fire at a target hex within 10 hexes. 3-hex radius, 12 fire + 8 necrotic damage. 4 turn cooldown. In real-time, 14s cooldown, 6m radius, 20 total damage.
- **Command Undead**: All undead allies within 6 hexes gain +2 to attack and damage rolls. Passive aura. In real-time, undead within 10m deal +20% damage.
- **Dreadful Aspect**: Once per combat, all enemies within 6 hexes must save or be Frightened for 3 turns. In real-time, 8m AoE fear for 5s.

**Behavior Pattern**: LEADER. The Death Knight charges into melee but fights strategically. Uses Dreadful Aspect at the start to scatter the party, then focuses the healer with its greatsword. Throws Hellfire Orb at clustered ranged attackers. Always surrounded by undead minions benefiting from Command Undead.

**Weakness**: Radiant (+50% damage)
**Resistance**: Necrotic (immune), Poison (immune), non-magical physical (-25% damage)
**XP Value**: 450
**Loot Table**: Tier 3 Rare/Epic + Cursed armor piece

---

### 20. Demon

**Type**: Fiend
**HP**: 85-110
**Primary Stat**: Might 16, Mind 14
**Armor Class**: 15 (natural armor + magic)
**Movement**: 35ft (7 hexes)
**Attack**: Flame Blade, 14-20 fire damage, melee

**Special Abilities**:
- **Infernal Teleport**: As a Bonus Action, teleport to any hex within 8 hexes (40ft). Leaves a small fire at both the origin and destination hexes (5 fire damage to anyone who steps on it, lasts 2 turns). In real-time, 8s cooldown, teleport up to 15m, fire patches last 6s.
- **Hellfire Aura**: All enemies within 2 hexes take 3 fire damage at the start of the Demon's turn. In real-time, enemies within 4m take 2 fire damage per second.
- **Demonic Resilience**: Advantage on saving throws against magic. In real-time, 25% chance to resist any magical crowd-control effect.

**Behavior Pattern**: MOBILE DPS. The Demon teleports aggressively, appearing behind the party's back line (casters, healers) to deal massive melee damage. Uses Infernal Teleport to reposition every 2-3 turns. The fire trail makes it costly to chase. Fights to the death.

**Weakness**: Cold (+25% damage), Radiant (+25% damage)
**Resistance**: Fire (immune), Poison (immune), non-magical physical (-25% damage)
**XP Value**: 350
**Loot Table**: Tier 3 Rare + Demon Heart (crafting material)

---

### 21. Beholder

**Type**: Aberration
**HP**: 75-100
**Primary Stat**: Mind 18
**Armor Class**: 14 (natural armor)
**Movement**: Hover 20ft (4 hexes)

**Special Abilities**:
- **Anti-Magic Cone**: The Beholder's central eye projects a 6-hex cone. All magical effects in this cone are suppressed (spells fail, magic items become mundane, magical buffs are paused). The cone points in the direction the Beholder is facing. In real-time, a visible cone indicates the area. Rotate the Beholder by attacking from different sides.
- **Eye Rays (3/turn)**: Each turn, the Beholder fires 3 random eye rays at different targets within 12 hexes. Ray types (d6): 1 = Charm (Charmed 2 turns), 2 = Paralyze (Paralyzed 1 turn), 3 = Fear (Frightened 2 turns), 4 = Slow (half movement 3 turns), 5 = Damage (15 force damage), 6 = Disintegrate (25 damage, if this kills the target, they are destroyed and cannot be Resurrected). In real-time, fires 1 ray every 2s, random type, at the nearest visible target not in the anti-magic cone.
- **Paranoid**: Beholders are deeply paranoid. If Charmed, the effect lasts only 1 turn instead of the normal duration.

**Behavior Pattern**: CONTROLLER. The Beholder hovers at medium range and rotates its anti-magic cone to shut down the party's caster. Fires eye rays at different targets to spread crowd control. Focuses Disintegrate ray on the healer. Very difficult to approach due to the anti-magic cone and constant eye rays.

**Weakness**: Physical attacks from behind (no anti-magic cone)
**Resistance**: Magic (-25% damage when facing the caster due to anti-magic cone)
**XP Value**: 500
**Loot Table**: Tier 3 Epic + Beholder Eye (legendary crafting material)

---

### 22. Mind Flayer

**Type**: Aberration
**HP**: 65-85
**Primary Stat**: Mind 20
**Armor Class**: 13 (psionically reinforced skin)
**Movement**: 30ft (6 hexes)
**Attack**: Tentacle, 10-14 psychic damage, melee

**Special Abilities**:
- **Mind Blast**: 6-hex cone of psychic energy. All creatures in the cone take 15-20 psychic damage and must save or be Stunned for 1 turn. 4 turn recharge. In real-time, 14s cooldown, 10m cone, 18 damage + 3s Stun.
- **Extract Brain**: If a target is Stunned and adjacent, the Mind Flayer can attempt to extract their brain. Target takes 30 damage. If this kills them, they die instantly (cannot be Resurrected). In real-time, only usable on stunned targets within 2m, 3s channel, deals 30 damage.
- **Psychic Shield**: The Mind Flayer has a passive psychic barrier that absorbs 15 damage. Regenerates after 5 turns without taking damage. In real-time, regenerates after 12s without damage.

**Behavior Pattern**: PREDATOR. The Mind Flayer opens with Mind Blast to stun as many targets as possible, then moves in to Extract Brain on the most stunned/vulnerable target. Prioritizes isolated characters. Will attempt to separate the party with Mind Blast angles. Retreats if its Psychic Shield breaks and it is below 40% HP, using thralls or minions to cover its escape.

**Weakness**: Psychic (immune, but attacks that bypass psychic resistance deal normal damage)
**Resistance**: Psychic (immune), non-magical physical (-25% damage)
**XP Value**: 450
**Loot Table**: Tier 3 Rare/Epic + Mind Crystal (crafting material)

---

## Boss Encounters

Bosses are special encounters with multiple phases, unique mechanics, and guaranteed loot.

---

### Boss 1: Goblin King (Tier 1 Boss)

**Recommended Party Level**: 4-5
**Location**: Goblin Warren throne room

**HP**: Phase 1: 60 HP. Phase 2: 40 HP (80 HP if you count the adds).
**Primary Stat**: Might 12, Presence 10
**Armor Class**: 14 (crude crown + chain mail)
**Attack**: Notched Greatclub, 8-12 damage, melee

**Phase 1: The King and His Court**

The Goblin King sits on a pile of stolen goods. He is flanked by 4 Goblins and 2 Goblin Archers.

Abilities:
- **Royal Command**: Bonus Action. Orders all Goblin allies to focus-attack one target. That target takes +2 damage from each Goblin attack for 2 turns. In real-time, goblins focus the marked target for 8s, dealing +2 damage per hit.
- **Belly Slam**: The Goblin King leaps onto a target within 3 hexes. 10 damage + Prone. 3 turn cooldown. In real-time, 10s cooldown, short-range leap dealing 10 damage + 2s knockdown.
- **Cowardly Shriek**: When the Goblin King drops below 50% HP in Phase 1, he screams, summoning 2 additional Goblins from side tunnels.

**Transition**: When the Goblin King reaches 0 HP in Phase 1, he stumbles to his treasure pile and drinks a glowing potion.

**Phase 2: The Frenzied King**

The potion mutates him. He grows larger, his skin turns green-black, and his eyes glow.

Abilities:
- **Frenzied Swings**: Attacks twice per turn. Each attack deals 10-15 damage. In real-time, attack speed increases 50%, damage increases 25%.
- **Poison Spit**: Ranged attack (6 hexes). Target takes 6 poison damage and is Poisoned for 3 turns. 3 turn cooldown. In real-time, 8s cooldown, cone-shaped spit, Poisoned for 6s.
- **Enrage (passive)**: Every 2 turns, the Goblin King's damage increases by +2 (stacking). The fight becomes a DPS race.

**Special Mechanic**: During Phase 2, treasure piles around the room can be knocked over (AoE attack or push an enemy into them). A knocked-over pile stuns the Goblin King for 1 turn and removes one stack of Enrage.

**XP Value**: 300 (total encounter)
**Guaranteed Loot**: Crown of the Goblin King (Uncommon helm: +1 Presence, +1 Intimidation), 100-150 gold, 1 random Uncommon weapon.

---

### Boss 2: Orc Warlord (Tier 2 Boss)

**Recommended Party Level**: 8-10
**Location**: Orc Stronghold war camp

**HP**: Phase 1: 120 HP. Phase 2: 80 HP. Phase 3: 50 HP.
**Primary Stat**: Might 18, Presence 14
**Armor Class**: 17 (war plate + shield)
**Attack**: War Cleaver (one-handed axe), 14-20 damage, melee; Shield Bash, 8 damage + Stun

**Phase 1: The Warband**

The Warlord fights alongside 2 Orc Warriors and 1 Orc Shaman.

Abilities:
- **Warlord's Roar**: All Orc allies gain +3 damage and cannot be Frightened for 3 turns. 5 turn cooldown. In real-time, 15s cooldown, aura buff lasts 10s.
- **Cleaving Strike**: Melee attack hitting the primary target and one adjacent enemy. Primary takes full damage, secondary takes 50%. In real-time, 6s cooldown, 180-degree swing.
- **Shield Wall**: Bonus Action. Raise shield for +3 AC until the start of next turn. In real-time, hold block to gain +3 AC, cannot attack while blocking.

**Transition**: At 0 HP, the Orc Shaman sacrifices itself to empower the Warlord. The Warlord absorbs the shaman's spirit, gaining magical abilities.

**Phase 2: Spirit-Touched Warlord**

The Warlord's eyes glow with spirit energy. He drops his shield and dual-wields.

Abilities:
- **Spirit Axe**: Throws a spectral axe at a target within 8 hexes. 12 damage + returns to hand. 2 turn cooldown. In real-time, 6s cooldown, boomerang projectile.
- **Totemic Slam**: Smashes the ground, creating 2 spirit totems that each pulse 4 damage per turn to the nearest enemy (range 4 hexes). Totems have 20 HP. 5 turn cooldown. In real-time, totems attack every 3s, last 15s.
- **Blood Fury**: Passive. The Warlord heals for 25% of all melee damage he deals.

**Transition**: At 0 HP in Phase 2, the Warlord enters a final desperate state.

**Phase 3: Last Stand**

The Warlord is bleeding and staggering but refuses to fall. His attacks become wild and devastating.

Abilities:
- **Berserk Fury**: Attacks 3 times per turn. Each attack deals 12-16 damage but he takes +25% damage from all sources (defense abandoned). In real-time, triple attack speed, +25% damage taken.
- **Death Grip**: If a melee target is adjacent, 25% chance per attack to grab them. Grabbed targets take 20 damage and are thrown 3 hexes. In real-time, grapple + throw for 20 damage, 4m toss distance.
- **Undying Will**: The first time the Warlord reaches 0 HP in Phase 3, he survives with 1 HP and is immune to damage for 1 turn (he roars defiantly). This only triggers once.

**Special Mechanic**: War drums in the corners of the arena buff the Warlord (+2 damage per active drum). Destroying the drums (15 HP each, 2 drums) weakens him. The Orc Shaman in Phase 1 tries to protect the drums.

**XP Value**: 800 (total encounter)
**Guaranteed Loot**: Warlord's War Cleaver (Rare weapon: 16-22 damage, +3 Might, on-kill heal 10 HP), Orc War Plate (Rare armor: 16 AC, +2 Might, -5ft movement), 200-400 gold, 1 random Rare accessory.

---

### Boss 3: Ancient Dragon (Tier 3 Boss)

**Recommended Party Level**: 13-15
**Location**: Volcanic mountain peak / Dragon's lair

**HP**: Phase 1: 200 HP. Phase 2: 150 HP. Phase 3: 100 HP.
**Primary Stat**: Might 22, Mind 18
**Armor Class**: 20 (ancient scales)
**Attack**: Claw x2, 18-25 damage each, melee; Bite, 22-30 damage, melee; Tail Sweep, 15 damage + knockback, rear cone

**Phase 1: Aerial Assault**

The Dragon starts in flight and refuses to land. The party must fight from the ground while the Dragon strafes from above.

Abilities:
- **Inferno Breath**: 8-hex cone of fire. 30-40 fire damage. Save for half. Recharge 5-6 on d6. In real-time, 18s cooldown, 16m cone, 35 damage. Leaves burning ground for 5s.
- **Diving Claw**: The Dragon dives at a target, dealing 20 damage + Prone, then returns to the air. 3 turn cooldown. In real-time, 10s cooldown, telegraphed dive (shadow on ground shows landing zone, 1.5s warning).
- **Wing Gust**: Flaps wings to create a gust in a 4-hex wide line. All creatures in the area are pushed back 3 hexes. 4 turn cooldown.

**Transition**: When the Dragon reaches 0 HP in Phase 1 (while flying), it crashes to the ground, destroying part of the arena. The crash creates new terrain: rubble for cover, lava fissures that deal 10 fire damage per turn to anyone standing on them.

**Phase 2: Grounded Fury**

The Dragon is grounded, one wing broken. It fights with full melee ferocity.

Abilities:
- **Inferno Breath**: Same as Phase 1, but now ground-level. Harder to dodge due to proximity.
- **Triple Attack**: Claw + Claw + Bite in one turn. Total potential damage: 60-80. In real-time, 3-hit combo over 2s.
- **Tail Sweep**: Hits all enemies in a 3-hex cone behind the Dragon. 15 damage + pushed back 2 hexes. In real-time, 10s cooldown, rear 120-degree cone, 5m range, knockback 3m.
- **Lava Eruption**: Slams a foot on the ground, causing 3 random lava geysers to erupt under party members. Each geyser is a 1-hex AoE, 15 fire damage. 4 turn cooldown. In real-time, 12s cooldown, orange circles appear under targets 1.5s before eruption.

**Transition**: At 0 HP in Phase 2, the Dragon's scales crack and glow with internal fire. It rises one last time, dragging its broken wing.

**Phase 3: Death Throes**

The Dragon is dying but determined to take the party with it. The entire arena begins to collapse.

Abilities:
- **Desperate Breath**: Breath weapon now fires in a 360-degree circle (all directions). 25 fire damage, no save. 3 turn cooldown. In real-time, 10s cooldown, arena-wide pulse, crouch behind rubble to reduce damage by 75%.
- **Earthquake**: The arena shakes. Each turn, 1-2 hexes collapse into lava (permanent). The fighting space shrinks over time. In real-time, a hex collapses every 5s.
- **Dragon's Wrath (passive)**: The Dragon's damage increases by +5 every 2 turns. The phase is a timer.
- **Final Roar**: When the Dragon reaches 0 HP in Phase 3, it explodes in fire. All creatures within 5 hexes take 20 fire damage (save for half). The party has 1 turn (announced by a warning) to move away. In real-time, 3s countdown with visible and audio warnings. Get behind cover or get 10m+ away.

**Special Mechanic**: During Phase 1, ballista mounted on the arena edges can be used (interaction, 1 action to load and fire). Each ballista bolt deals 25 damage and forces the Dragon to land for 1 turn. There are 3 bolts total. Smart use of ballistas makes Phase 1 much faster.

**XP Value**: 2000 (total encounter)
**Guaranteed Loot**: Dragonscale Armor (Epic armor: 18 AC, fire immunity, +3 Might), Dragonslayer's Blade (Epic weapon: 20-28 damage, +5 damage vs dragons, Fire Cleave ability), Dragon Hoard (800-1200 gold), 2 random Rare accessories, 1 random Epic ring or amulet, Dragonheart Gem (Legendary crafting material, used to craft one Legendary item of the player's choice at a master smith).

---

## AI Behavior Glossary

These behavior tags are used by the enemy AI system to determine combat actions.

| Behavior | Description |
|----------|-------------|
| AGGRESSIVE | Charges nearest enemy, no self-preservation, attacks on cooldown |
| DEFENSIVE | Holds position, uses defensive abilities, waits for enemies to approach |
| FLANKER | Circles to the side or rear, avoids the front-line tank, targets squishies |
| SNIPER | Stays at maximum range, uses cover, prioritizes low-AC targets |
| SWARM | Groups up with allies, surrounds single targets, flees when isolated |
| SUPPORT | Heals/buffs allies, stays behind front line, targets enemy healer with attacks |
| AMBUSH | Hides until opportunity, strikes with surprise, retreats after initial burst |
| BRUISER | Wades into the largest enemy cluster, uses AoE, focuses whoever hurt it most |
| CONTROLLER | Stays at medium range, uses crowd control, focuses the most dangerous enemy |
| HIT AND RUN | Engages briefly, deals damage, disengages, repeats |
| LEADER | Buffs allies, uses tactical abilities, focuses the enemy healer or caster |
| MOBILE DPS | Teleports/dashes constantly, attacks from unexpected angles, hard to pin down |
| PREDATOR | Isolates targets, uses CC to separate the party, goes for kills on stunned enemies |

---

## Encounter Composition Guidelines

When the AI DM generates encounters, it should follow these composition rules:

**Easy**: 2-3 enemies of the current tier, same type. Example: 3 Goblins.
**Medium**: 4-5 enemies of the current tier, mixed types. Example: 2 Orc Warriors + 1 Orc Shaman.
**Hard**: 5-7 enemies or 1 tier-up enemy + lower tier support. Example: 1 Troll + 3 Goblins.
**Deadly**: Boss encounter or 2 tier-up enemies. Example: 1 Dragon Wyrmling + 2 Orc Warriors.

**Party Level to Tier Mapping**:
- Levels 1-4: Tier 1 encounters (Easy/Medium)
- Level 5: Tier 1 Boss (Goblin King)
- Levels 5-9: Tier 2 encounters (Easy/Medium)
- Level 10: Tier 2 Boss (Orc Warlord)
- Levels 10-14: Tier 3 encounters (Easy/Medium)
- Level 15: Tier 3 Boss (Ancient Dragon)
