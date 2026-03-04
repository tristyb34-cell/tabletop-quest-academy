# Loot Tables and Item Reference

**Version**: 0.1
**Last Updated**: 2026-03-04

This document defines all items, equipment, consumables, drop tables, and the gold economy. Every item has clear stat values, class restrictions, and rarity so the loot system can be implemented directly from this reference.

---

## Equipment Slots

Every character has 9 equipment slots:

| Slot | Description | All Classes? |
|------|-------------|-------------|
| Weapon | Main hand weapon | Yes |
| Off-hand / Shield | Shield, secondary weapon, or focus item | Yes (varies by class) |
| Armor | Body armor (chest piece) | Yes |
| Helm | Head protection | Yes |
| Boots | Footwear | Yes |
| Ring 1 | First ring slot | Yes |
| Ring 2 | Second ring slot | Yes |
| Amulet | Neck slot | Yes |
| Cloak | Back slot | Yes |

---

## Rarity Tiers

| Rarity | Color | Base Drop Rate | Sell Value Multiplier | Properties |
|--------|-------|---------------|----------------------|------------|
| Common | White | 60% | 1x | No special properties. Base stats only. |
| Uncommon | Green | 25% | 3x | One special property (minor enchantment). |
| Rare | Blue | 10% | 10x | One or two special properties (significant enchantments). |
| Epic | Purple | 4% | 30x | Two special properties (powerful enchantments). Often named items. |
| Legendary | Gold | 1% | 100x | Two or three special properties (build-defining). Always named. Unique. |

**Note**: Drop rates are base rates before modifiers. Enemy tier, boss status, and luck modifiers adjust these.

---

## Weapons

### Melee Weapons

| # | Weapon | Damage | Speed | Class Restriction | Base Price | Notes |
|---|--------|--------|-------|-------------------|-----------|-------|
| 1 | Shortsword | 4-7 | Fast | Warrior, Rogue, Ranger | 15g | Reliable early-game option |
| 2 | Longsword | 6-10 | Medium | Warrior | 30g | The Warrior's bread and butter |
| 3 | Greatsword | 10-16 | Slow | Warrior | 50g | Two-handed, highest melee damage, no shield |
| 4 | Dagger | 3-5 | Very Fast | Rogue, Bard, Mage | 10g | Can be dual-wielded by Rogues |
| 5 | Battleaxe | 8-13 | Medium | Warrior | 40g | Can be one-handed (with shield) or two-handed (+2 damage) |
| 6 | Mace | 5-9 | Medium | Warrior, Cleric | 25g | +25% damage vs Skeletons and armored enemies |
| 7 | Flail | 7-11 | Medium | Warrior, Cleric | 35g | Ignores shield AC bonus on the target |
| 8 | Rapier | 5-8 | Fast | Rogue, Bard | 25g | Uses Finesse modifier for both attack and damage |
| 9 | Spear | 6-9 | Medium | Warrior, Ranger | 20g | 2-hex reach in turn-based, 4m range in real-time |

### Ranged Weapons

| # | Weapon | Damage | Speed | Class Restriction | Base Price | Notes |
|---|--------|--------|-------|-------------------|-----------|-------|
| 10 | Shortbow | 4-7 | Fast | Ranger, Rogue | 20g | Range 10 hexes / 15m |
| 11 | Longbow | 6-10 | Medium | Ranger | 40g | Range 15 hexes / 22m, two-handed |
| 12 | Crossbow | 7-11 | Slow | Ranger, Rogue | 35g | Range 12 hexes / 18m, higher damage but slower |
| 13 | Light Crossbow | 4-6 | Medium | Bard, Rogue | 20g | Range 8 hexes / 12m, one-handed |

### Magical Weapons

| # | Weapon | Damage | Speed | Class Restriction | Base Price | Notes |
|---|--------|--------|-------|-------------------|-----------|-------|
| 14 | Staff | 3-6 physical + 2-4 magical | Medium | Mage, Cleric | 30g | Adds Mind modifier to spell damage |
| 15 | Wand | 2-4 physical + 3-5 magical | Fast | Mage | 35g | +1 spell range (hex/3m), one-handed |

### Uncommon+ Weapon Special Properties

When a weapon drops at Uncommon or higher rarity, it gains one or more of these properties:

| Property | Effect | Rarity Tier |
|----------|--------|-------------|
| Flaming | +3 fire damage per hit | Uncommon |
| Frost | +3 cold damage per hit, 10% chance to Slow | Uncommon |
| Venomous | +2 poison damage per hit, stacks up to 3 times | Uncommon |
| Keen | +5% critical hit chance | Uncommon |
| Vampiric | Heal for 10% of damage dealt | Rare |
| Thundering | On critical hit, 3-hex/6m AoE knockback | Rare |
| Vorpal | +15% critical hit chance, crits deal 300% instead of 250% | Epic |
| Soulbound | +5 damage, weapon cannot be unequipped until combat ends. Grows +1 damage per enemy killed (max +5, resets between combats). | Epic |
| Legendary Slayer | +10 damage vs bosses, glows when a boss is nearby | Legendary |

---

## Armor

### Body Armor

| # | Armor | AC Value | Type | Class Restriction | Movement Penalty | Base Price |
|---|-------|---------|------|-------------------|-----------------|-----------|
| 1 | Cloth Robes | 10 | Cloth | Mage | None | 15g |
| 2 | Leather Armor | 12 | Light | Rogue, Bard, Ranger | None | 30g |
| 3 | Studded Leather | 13 | Light | Rogue, Bard, Ranger | None | 45g |
| 4 | Scale Mail | 14 | Medium | Cleric, Ranger | -5ft movement | 50g |
| 5 | Chain Mail | 15 | Medium | Warrior, Cleric | -5ft movement | 65g |
| 6 | Half Plate | 16 | Heavy | Warrior, Cleric | -5ft movement | 100g |
| 7 | Plate Armor | 18 | Heavy | Warrior | -10ft movement | 150g |

### Helms

| # | Helm | AC Bonus | Class Restriction | Base Price | Special |
|---|------|---------|-------------------|-----------|---------|
| 1 | Cloth Hood | +0 | Mage, Bard | 8g | +1 Perception |
| 2 | Leather Cap | +1 | Rogue, Ranger, Bard | 15g | None |
| 3 | Iron Helm | +1 | Warrior, Cleric | 25g | Immune to critical hit bonus damage (crits deal normal damage instead) |
| 4 | Plate Helm | +2 | Warrior | 50g | Immune to critical hit bonus damage, -1 Perception |

### Boots

| # | Boots | AC Bonus | Class Restriction | Base Price | Special |
|---|-------|---------|-------------------|-----------|---------|
| 1 | Cloth Sandals | +0 | Mage | 8g | +5ft movement |
| 2 | Leather Boots | +0 | All | 12g | None |
| 3 | Reinforced Boots | +1 | Warrior, Cleric, Ranger | 25g | Immune to caltrops and ground traps |
| 4 | Steel Greaves | +1 | Warrior | 40g | +10% resistance to knockback/knockdown |

### Shields (Off-hand)

| # | Shield | AC Bonus | Class Restriction | Base Price | Special |
|---|--------|---------|-------------------|-----------|---------|
| 1 | Wooden Shield | +1 | Warrior, Cleric | 15g | Breaks after absorbing 30 damage (in a single combat) |
| 2 | Iron Shield | +2 | Warrior, Cleric | 35g | None |
| 3 | Tower Shield | +3 | Warrior | 60g | -5ft movement, provides half cover to adjacent allies |

### Uncommon+ Armor Special Properties

| Property | Effect | Rarity Tier |
|----------|--------|-------------|
| Fortified | +1 AC | Uncommon |
| Resistant (element) | -25% damage from one element (fire, cold, lightning, poison, necrotic) | Uncommon |
| Regenerating | Heal 1 HP per turn / 1 HP per 6s | Rare |
| Reflecting | 15% chance to reflect ranged attacks back at the attacker | Rare |
| Warding | Absorb the first 10 magical damage per combat | Epic |
| Invulnerable | Once per combat, negate a hit that would reduce you below 10% HP | Epic |
| Legendary Bulwark | +3 AC, -25% damage from all sources, immune to critical hits | Legendary |

---

## Accessories

### Rings

| # | Ring | Effect | Rarity | Base Price |
|---|------|--------|--------|-----------|
| 1 | Ring of Might | +2 Might | Uncommon | 50g |
| 2 | Ring of Finesse | +2 Finesse | Uncommon | 50g |
| 3 | Ring of Mind | +2 Mind | Uncommon | 50g |
| 4 | Ring of Presence | +2 Presence | Uncommon | 50g |
| 5 | Ring of Protection | +1 AC | Rare | 120g |
| 6 | Ring of Regeneration | Heal 2 HP per turn / 2 HP per 6s | Rare | 150g |
| 7 | Ring of Spell Storing | Store one spell. Cast it later without mana cost. Recharges on rest. | Epic | 300g |
| 8 | Ring of the Phoenix | Once per day, revive at 50% HP when killed. | Legendary | 800g |

### Amulets

| # | Amulet | Effect | Rarity | Base Price |
|---|--------|--------|--------|-----------|
| 1 | Amulet of Health | +15 max HP | Uncommon | 60g |
| 2 | Amulet of Mind | +15 max Mana | Uncommon | 60g |
| 3 | Amulet of Warding | +2 to all saving throws | Rare | 130g |
| 4 | Amulet of the Undying | When reduced to 0 HP, heal for 25% max HP instead (once per combat) | Epic | 350g |
| 5 | Amulet of the Archmage | +25% spell damage, +10 max mana | Legendary | 900g |

### Cloaks

| # | Cloak | Effect | Rarity | Base Price |
|---|-------|--------|--------|-----------|
| 1 | Cloak of Shadows | +2 Stealth, enemies have -10% chance to detect you | Uncommon | 55g |
| 2 | Cloak of Protection | +1 AC, +1 to all saving throws | Rare | 140g |
| 3 | Cloak of Displacement | 15% chance for attacks against you to miss outright | Epic | 320g |
| 4 | Cloak of the Wind | +10ft movement speed, immune to slow effects | Rare | 160g |
| 5 | Cloak of Invisibility | Activate to become invisible for 6s (turn-based: 1 turn). 1 use per combat. Attacking breaks invisibility. | Legendary | 1000g |

---

## Consumables

### Potions

| # | Item | Effect | Rarity | Buy Price | Sell Price |
|---|------|--------|--------|-----------|-----------|
| 1 | Small Health Potion | Restore 20 HP | Common | 10g | 3g |
| 2 | Medium Health Potion | Restore 40 HP | Common | 25g | 8g |
| 3 | Large Health Potion | Restore 80 HP | Uncommon | 50g | 15g |
| 4 | Small Mana Potion | Restore 15 Mana | Common | 12g | 4g |
| 5 | Medium Mana Potion | Restore 30 Mana | Common | 30g | 10g |
| 6 | Large Mana Potion | Restore 50 Mana | Uncommon | 55g | 17g |
| 7 | Antidote | Remove Poisoned condition | Common | 8g | 2g |
| 8 | Elixir of Might | +3 Might for 5 turns / 30s | Uncommon | 40g | 12g |
| 9 | Elixir of Finesse | +3 Finesse for 5 turns / 30s | Uncommon | 40g | 12g |
| 10 | Elixir of Mind | +3 Mind for 5 turns / 30s | Uncommon | 40g | 12g |
| 11 | Elixir of Presence | +3 Presence for 5 turns / 30s | Uncommon | 40g | 12g |

### Utility Items

| # | Item | Effect | Rarity | Buy Price | Sell Price |
|---|------|--------|--------|-----------|-----------|
| 12 | Scroll of Town Portal | Instantly return to the last visited safe zone. Cannot use in combat. | Uncommon | 35g | 10g |
| 13 | Resurrection Stone | Revive a fallen party member at 25% HP. Usable in combat (costs 1 Action). | Rare | 100g | 30g |
| 14 | Smoke Bomb | Create a 3m smoke cloud for 5s. Enemies inside are Blinded. | Common | 15g | 5g |
| 15 | Throwable Oil Flask | Throw at a target hex. Enemies in 1-hex radius are coated in oil. Fire damage against oiled targets is doubled for 2 turns. | Common | 12g | 4g |
| 16 | Trap Kit | Place a bear trap. First enemy to step on it takes 10 damage and is Rooted for 2 turns. | Uncommon | 25g | 8g |

---

## Drop Tables by Enemy Tier

### Tier 1 Enemies (Levels 1-5)

**Base drops per kill**: 1-2 items

| Roll (d100) | Result |
|-------------|--------|
| 01-40 | Nothing (gold only) |
| 41-70 | 1 Common item |
| 71-85 | 1 Common item + 1 consumable |
| 86-95 | 1 Uncommon item |
| 96-100 | 1 Uncommon item + 1 consumable |

**Gold per kill**: 3-12 gold

**Common Item Pool (Tier 1)**:
- Shortsword, Dagger, Shortbow, Light Crossbow
- Cloth Robes, Leather Armor, Leather Cap, Leather Boots, Cloth Sandals
- Wooden Shield
- Small Health Potion, Small Mana Potion, Antidote
- Junk items (Rusty Key, Cracked Gem, Torn Map): sell for 1-3g

**Uncommon Item Pool (Tier 1)**:
- Any Common weapon with one Uncommon property (Flaming, Frost, Venomous, Keen)
- Ring of Might/Finesse/Mind/Presence
- Cloak of Shadows
- Amulet of Health/Mind
- Elixirs

---

### Tier 2 Enemies (Levels 5-10)

**Base drops per kill**: 1-3 items

| Roll (d100) | Result |
|-------------|--------|
| 01-25 | Nothing (gold only) |
| 26-50 | 1 Common item + 1 consumable |
| 51-70 | 1 Uncommon item |
| 71-85 | 1 Uncommon item + 1 consumable |
| 86-95 | 1 Rare item |
| 96-100 | 1 Rare item + 1 Uncommon item |

**Gold per kill**: 10-35 gold

**Uncommon Item Pool (Tier 2)**:
- Longsword, Battleaxe, Rapier, Mace, Longbow, Crossbow, Staff, Wand (all with one Uncommon property)
- Studded Leather, Scale Mail, Chain Mail, Iron Helm, Reinforced Boots
- Iron Shield
- All Uncommon accessories
- Medium Health/Mana Potions

**Rare Item Pool (Tier 2)**:
- Any weapon with one Rare property (Vampiric, Thundering)
- Half Plate, Plate Helm
- Ring of Protection, Ring of Regeneration
- Amulet of Warding
- Cloak of Protection, Cloak of the Wind
- Large Health/Mana Potions, Resurrection Stone

---

### Tier 3 Enemies (Levels 10-15)

**Base drops per kill**: 2-4 items

| Roll (d100) | Result |
|-------------|--------|
| 01-15 | 1 Uncommon item (gold only) |
| 16-35 | 1 Uncommon item + 1 Rare consumable |
| 36-55 | 1 Rare item |
| 56-75 | 1 Rare item + 1 consumable |
| 76-90 | 1 Rare item + 1 Uncommon item |
| 91-96 | 1 Epic item |
| 97-100 | 1 Epic item + 1 Rare item |

**Gold per kill**: 25-80 gold

**Rare Item Pool (Tier 3)**:
- Greatsword, Flail, Spear with Rare properties
- Plate Armor, Steel Greaves, Tower Shield with Rare properties
- All Rare accessories
- Resurrection Stone, Scroll of Town Portal

**Epic Item Pool (Tier 3)**:
- Any weapon with one Epic property (Vorpal, Soulbound)
- Any armor with one Epic property (Warding, Invulnerable)
- Ring of Spell Storing
- Amulet of the Undying
- Cloak of Displacement

---

### Boss Drop Tables

#### Tier 1 Boss (Goblin King)

| Slot | Guaranteed Loot |
|------|----------------|
| 1 | Crown of the Goblin King (Uncommon helm: +1 Presence, +1 Intimidation) |
| 2 | 100-150 gold |
| 3 | 1 random Uncommon weapon |

| Roll (d100) | Bonus Loot |
|-------------|-----------|
| 01-70 | 1 additional Uncommon item |
| 71-90 | 1 Rare item |
| 91-100 | 1 Rare item + 1 Uncommon accessory |

---

#### Tier 2 Boss (Orc Warlord)

| Slot | Guaranteed Loot |
|------|----------------|
| 1 | Warlord's War Cleaver (Rare weapon: 16-22 damage, +3 Might, on-kill heal 10 HP) |
| 2 | Orc War Plate (Rare armor: 16 AC, +2 Might, -5ft movement) |
| 3 | 200-400 gold |
| 4 | 1 random Rare accessory |

| Roll (d100) | Bonus Loot |
|-------------|-----------|
| 01-50 | 1 additional Rare item |
| 51-80 | 1 Epic item |
| 81-95 | 1 Epic item + 1 Rare accessory |
| 96-100 | 1 Epic item + 1 Epic accessory |

---

#### Tier 3 Boss (Ancient Dragon)

| Slot | Guaranteed Loot |
|------|----------------|
| 1 | Dragonscale Armor (Epic body armor: 18 AC, fire immunity, +3 Might) |
| 2 | Dragonslayer's Blade (Epic weapon: 20-28 damage, +5 damage vs dragons, Fire Cleave ability) |
| 3 | 800-1200 gold |
| 4 | 2 random Rare accessories |
| 5 | 1 random Epic ring or amulet |
| 6 | Dragonheart Gem (Legendary crafting material) |

| Roll (d100) | Bonus Loot |
|-------------|-----------|
| 01-40 | 1 additional Epic item |
| 41-70 | 2 Epic items |
| 71-90 | 1 Legendary item |
| 91-100 | 1 Legendary item + 1 Epic item |

---

## Gold Economy

### Enemy Gold Drops

| Source | Gold Range |
|--------|-----------|
| Tier 1 trash mob | 3-12g |
| Tier 1 elite (Bandit, Kobold) | 8-20g |
| Tier 1 boss | 100-150g |
| Tier 2 trash mob | 10-35g |
| Tier 2 elite (Troll, Dark Mage) | 25-50g |
| Tier 2 boss | 200-400g |
| Tier 3 trash mob | 25-80g |
| Tier 3 elite (Death Knight, Beholder) | 50-120g |
| Tier 3 boss | 800-1200g |

### Chests and Environmental Loot

| Source | Gold | Items |
|--------|------|-------|
| Small chest (Tier 1 area) | 5-15g | 0-1 Common |
| Medium chest (Tier 2 area) | 20-50g | 1 Uncommon |
| Large chest (Tier 3 area) | 50-150g | 1 Rare |
| Hidden cache (any tier) | Double gold for that tier | +1 rarity tier on item |
| Quest reward (minor) | 25-75g | 0-1 Uncommon |
| Quest reward (major) | 100-300g | 1 Rare |
| Quest reward (epic) | 300-600g | 1 Epic or choice of 2 Rares |

### Shop Prices

**Buy prices** are listed on each item above. **Sell prices** follow this formula:

| Rarity | Sell Price |
|--------|-----------|
| Common | 30% of buy price |
| Uncommon | 33% of buy price |
| Rare | 35% of buy price |
| Epic | 40% of buy price |
| Legendary | 50% of buy price |

**Bard bonus**: Characters with a Bard in the active party get +15% sell prices and -15% buy prices (Silver Tongue passive).

### Gold Sinks (Where Players Spend Gold)

| Sink | Cost Range | Purpose |
|------|-----------|---------|
| Health/Mana Potions | 10-55g each | Ongoing combat sustain |
| Equipment upgrades | 15-150g+ | Incremental power increases |
| Inn rest (full heal + save point) | 5-20g (scales with level) | Healing between encounters |
| Crafting materials | 20-100g | Combine with dropped materials to make items |
| Enchanting (add property to weapon) | 50-500g + materials | Customize existing gear |
| Resurrection (NPC service) | 100-300g (scales with level) | Alternative to Resurrection Stone |
| Mount (cosmetic speed boost on tabletop) | 200g | Quality of life |
| Lockpicks (for non-Rogues) | 5g each, break on failure | Access locked content without a Rogue |

### Economy Balance Targets

These are rough targets for how the economy should feel at each stage of the game:

| Level Range | Expected Gold Income (per session) | Key Purchases |
|------------|-----------------------------------|---------------|
| 1-3 | 50-100g | First weapon upgrade, potions, leather armor |
| 4-5 | 100-200g | Uncommon weapon, medium potions, Tier 1 boss loot equip |
| 6-8 | 200-400g | Rare weapon or armor, enchanting first item, stockpile potions |
| 9-10 | 400-700g | Full Rare gear set, Tier 2 boss loot equip |
| 11-13 | 700-1200g | Epic weapon or armor, advanced enchanting, stat elixirs |
| 14-15 | 1200-2000g | Full Epic gear set, Legendary craft from Dragonheart Gem |

**Target feel**: Players should always be able to afford potions and basic supplies. Gear upgrades should require saving for 2-3 sessions. Legendary items should feel like a major investment.

---

## Crafting System (Simplified)

Crafting is optional but rewarding. Materials drop from enemies and the world. A blacksmith NPC (found in towns) combines materials + gold into items.

### Crafting Materials

| Material | Source | Used For |
|----------|--------|----------|
| Iron Ore | Mining nodes (Tier 1-2 areas) | Common/Uncommon weapons and armor |
| Steel Ingot | Tier 2 enemies, mining | Rare weapons and armor |
| Dragon Scales | Dragon Wyrmling, Ancient Dragon | Epic armor |
| Spider Silk | Giant Spider | Uncommon/Rare light armor, bowstrings |
| Troll Blood | Troll | Regeneration enchantments |
| Demon Heart | Demon | Fire enchantments |
| Mind Crystal | Mind Flayer | Psychic enchantments |
| Beholder Eye | Beholder | Anti-magic enchantments |
| Dragonheart Gem | Ancient Dragon (boss) | One Legendary item of player's choice |
| Ectoplasm | Ghost | Necrotic resistance enchantments |
| Totem Fragments | Orc Shaman | Summoning enchantments |

### Crafting Recipes (Examples)

| Recipe | Materials | Gold Cost | Result |
|--------|-----------|-----------|--------|
| Flaming Longsword | Longsword + Demon Heart + 50g | 50g | Uncommon Longsword with Flaming property |
| Regenerating Chain Mail | Chain Mail + Troll Blood x2 + 100g | 100g | Rare Chain Mail with Regenerating property |
| Spider Silk Armor | Spider Silk x5 + Leather Armor + 75g | 75g | Rare light armor: 14 AC, no movement penalty, +2 Stealth |
| Dragonscale Shield | Tower Shield + Dragon Scales x3 + 200g | 200g | Epic shield: +3 AC, fire immunity |
| Legendary Weapon | Any Epic weapon + Dragonheart Gem + 500g | 500g | Legendary version of that weapon (adds Legendary Slayer property) |

---

## Item Naming Convention

For implementation in UE5, all items follow this naming pattern:

- **Internal ID**: `item_category_name` (lowercase, underscore). Example: `item_weapon_longsword`
- **Enchanted variant**: `item_weapon_longsword_flaming`
- **Named items**: `item_weapon_warlords_war_cleaver`
- **Data Table Row Name**: Same as internal ID
- **Icon**: `T_Icon_Item_Category_Name`. Example: `T_Icon_Item_Weapon_Longsword`
- **Mesh**: `SM_Item_Category_Name`. Example: `SM_Item_Weapon_Longsword`

---

## Loot Generation Algorithm

When an enemy dies, the game runs this sequence:

1. **Determine gold drop**: Roll within the enemy's tier gold range. Apply modifiers (party Bard bonus, difficulty setting).
2. **Roll d100 on the enemy's tier drop table** to determine item count and rarity.
3. **For each item**: Roll on the appropriate rarity pool for that tier. Select a random item from the pool.
4. **For Uncommon+ items**: Roll on the special properties table to determine enchantment.
5. **Boss override**: Bosses skip the d100 roll and drop their guaranteed loot plus a bonus roll.
6. **Duplicate protection**: If the same named item would drop twice in one session, reroll the second one.
7. **Display**: Items drop on the ground as glowing orbs (color = rarity). Player walks over to pick up, or a loot window appears in turn-based mode.
