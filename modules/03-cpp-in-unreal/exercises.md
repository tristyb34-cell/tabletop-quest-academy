# Module 03: Exercises - Claude's C++ Plugins

These exercises walk you through building real C++ plugins for Tabletop Quest. Each exercise produces something you will use in later modules. By the end, you will have a working dice system, stat calculator, and the foundation types for the combat system.

---

## Exercise 1: Convert Your Project to C++

**Goal**: Set up your Tabletop Quest project for C++ development.

### Steps

1. Open your Tabletop Quest project in UE5.7.
2. Go to **Tools > New C++ Class**.
3. Select **Actor** as the parent class.
4. Name it `TempSetupActor`.
5. Click **Create Class**.
6. UE5 generates the `Source/` folder and opens your IDE.
7. Verify the following files exist in your project directory:
   - `Source/TabletopQuest/TabletopQuest.Build.cs`
   - `Source/TabletopQuest/TabletopQuest.h`
   - `Source/TabletopQuest/TabletopQuest.cpp`
   - `TabletopQuest.uproject` (should now reference a "Modules" section)
8. Delete `TempSetupActor.h` and `TempSetupActor.cpp` (they were just scaffolding).
9. Compile from the editor to verify everything builds cleanly.
10. Enable the **Python Editor Script Plugin** in Edit > Plugins while you are here. You will need it later.

### Verification

- The Compile button shows a green checkmark.
- The Source folder exists in your project directory.
- The Python console is accessible from Window > Developer Tools > Output Log (switch to Python mode).

---

## Exercise 2: Create the TabletopDice Plugin

**Goal**: Build your first plugin and implement the dice rolling system.

### Steps

1. In UE5, go to **Edit > Plugins > + Add**.
2. Choose **Blank** template.
3. Name it `TabletopDice`. Set Description to "Dice rolling for Tabletop Quest."
4. Click **Create Plugin**.
5. Navigate to the generated plugin folder in your file explorer: `Plugins/TabletopDice/`.
6. Ask Claude to generate a `UDiceRollerSubsystem` class with this prompt:

> "Write a UE5 C++ UGameInstanceSubsystem called UDiceRollerSubsystem for a plugin named TabletopDice. Include:
> - A BlueprintType USTRUCT called FDiceRollResult with: Total (int32), IndividualRolls (TArray of int32), NumDice (int32), NumSides (int32), Modifier (int32)
> - BlueprintCallable functions: Roll(NumDice, NumSides, Modifier), RollWithAdvantage, RollWithDisadvantage, StatCheck(StatModifier, DC, OutResult), RollD4 through RollD20
> - BlueprintPure functions: GetLastRoll, GetRollHistory
> - History tracking capped at 100 entries
> Use the module API macro TABLETTOPDICE_API."

7. Place the `.h` file in `Source/TabletopDice/Public/`.
8. Place the `.cpp` file in `Source/TabletopDice/Private/`.
9. Compile.

### Verification

- Open any Blueprint, right-click, and search for "Roll D20". The node should appear under the "Dice" category.
- Create a quick test: On BeginPlay, call RollD20 and connect it to a Print String. Hit Play and verify a number between 1 and 20 prints to screen.
- Call Roll(3, 6, 2) and break the result struct. Verify you get a total between 5 and 20 (3d6+2 range).

---

## Exercise 3: Build the Foundation Types Plugin

**Goal**: Create shared enums and structs that every Tabletop Quest system will use.

### Steps

1. Create a new plugin called `TabletopCore`.
2. Ask Claude to generate a header file called `TabletopTypes.h` with these types:

**Enums:**
- `ECombatMode`: TurnBased, RealTime, Transitioning
- `EDamageType`: Physical, Fire, Ice, Lightning, Poison, Holy, Necrotic, Psychic
- `ECharacterClass`: Warrior, Rogue, Mage, Cleric, Ranger, Bard
- `EStatusEffect`: None, Stunned, Poisoned, Burning, Frozen, Frightened, Blessed, Hasted
- `EEquipmentSlot`: MainHand, OffHand, Head, Chest, Legs, Feet, Ring1, Ring2, Amulet

**Structs:**
- `FCharacterStats`: Might, Finesse, Mind, Presence (all int32, default 10), MaxHealth, CurrentHealth, MaxMana, CurrentMana (all float)
- `FDamagePacket`: Amount (float), DamageType (EDamageType), bIsCritical (bool), SourceActor (AActor*), SourceAbilityName (FString)

3. Place the file in `Source/TabletopCore/Public/`.
4. Update `TabletopCore.Build.cs` to include `"Core", "CoreUObject", "Engine"` as dependencies.
5. Compile.

### Verification

- Open any Blueprint. Create a variable and set its type. Search for "Character Stats" and "Damage Packet". Both should appear as valid variable types.
- Create an `ECombatMode` variable. You should see a dropdown with "Turn-Based", "Real-Time", and "Transitioning" options.
- Create an `ECharacterClass` variable. All six classes (Warrior, Rogue, Mage, Cleric, Ranger, Bard) should appear in the dropdown.

### Important Note

Other plugins (TabletopDice, TabletopStats, TabletopCombat) will need to reference these types. Add `"TabletopCore"` to their `Build.cs` dependency lists:

```csharp
PublicDependencyModuleNames.AddRange(new string[]
{
    "Core", "CoreUObject", "Engine", "TabletopCore"
});
```

---

## Exercise 4: Build the Stat Calculator Plugin

**Goal**: Create the math engine behind all combat and progression in Tabletop Quest.

### Steps

1. Create a new plugin called `TabletopStats`.
2. Add `"TabletopCore"` to its Build.cs dependencies (it needs the shared types).
3. Ask Claude to generate a `UStatCalculatorSubsystem` with this prompt:

> "Write UStatCalculatorSubsystem (UGameInstanceSubsystem) for a DnD RPG. It needs to use EDamageType and FCharacterStats from a separate TabletopCore module. Functions:
> - GetAbilityModifier(int32 AbilityScore): returns (score-10)/2 rounded down
> - CalculateArmorClass(int32 BaseArmor, int32 FinesseModifier, int32 ShieldBonus): returns sum
> - DoesAttackHit(int32 AttackRoll, int32 AttackModifier, int32 TargetAC): returns bool
> - CalculateDamage(float BaseDamage, EDamageType, TArray of EDamageType Resistances, TArray of EDamageType Vulnerabilities, bool bCrit): returns FDamageCalcResult struct with RawDamage, FinalDamage, Multiplier, bResisted, bVulnerable, bCritical
> - GetXPThreshold(int32 Level): XP for levels 1-20 using DnD 5e progression table
> - GetLevelForXP(int32 TotalXP): reverse lookup
> Use TABLETOPSTATS_API. Include the FDamageCalcResult USTRUCT in the header."

4. Paste the files, compile, and test.

### Verification

Test each function in a Blueprint:

- `GetAbilityModifier(10)` should return 0
- `GetAbilityModifier(14)` should return 2
- `GetAbilityModifier(8)` should return -1
- `GetAbilityModifier(1)` should return -5
- `CalculateArmorClass(12, 2, 2)` should return 16
- `DoesAttackHit(15, 3, 17)` should return true (15+3 = 18 >= 17)
- `DoesAttackHit(10, 2, 17)` should return false (10+2 = 12 < 17)
- `CalculateDamage(10.0, Fire, [Fire], [], false)` should return FinalDamage = 5.0 (resisted)
- `CalculateDamage(10.0, Fire, [], [Fire], false)` should return FinalDamage = 20.0 (vulnerable)
- `CalculateDamage(10.0, Fire, [], [], true)` should return FinalDamage = 20.0 (critical)

---

## Exercise 5: Create Enemy Data Assets

**Goal**: Use the Data Asset pattern to define enemies from the Tabletop Quest bestiary.

### Steps

1. In the TabletopCore plugin, ask Claude to generate a `UEnemyDataAsset` class extending `UPrimaryDataAsset` with these properties:
   - EnemyName (FString)
   - EnemyClass (ECharacterClass)
   - BaseStats (FCharacterStats)
   - ChallengeRating (int32)
   - Resistances (TArray of EDamageType)
   - Vulnerabilities (TArray of EDamageType)
   - XPReward (int32)
   - Mesh (TSoftObjectPtr of USkeletalMesh)
   - DefaultAbilities (TArray of FString) for ability names

2. Compile the plugin.

3. In the Content Browser, create a folder: `Content/Data/Enemies/`.

4. Right-click in the folder, select **Miscellaneous > Data Asset**, and choose `EnemyDataAsset`.

5. Create Data Assets for at least 5 enemies:

| Enemy | HP | Might | Finesse | Mind | CR | Resistances | Vulnerabilities | XP |
|-------|-----|-------|---------|------|----|-------------|----------------|-----|
| Goblin | 8 | 8 | 14 | 8 | 1 | None | Fire | 25 |
| Skeleton Warrior | 13 | 12 | 10 | 6 | 2 | Physical | Holy | 50 |
| Shadow Wraith | 22 | 6 | 16 | 16 | 4 | Physical, Ice | Holy, Fire | 200 |
| Orc Berserker | 30 | 18 | 10 | 8 | 3 | None | None | 150 |
| Ancient Dragon | 200 | 22 | 14 | 20 | 15 | Fire, Lightning | Ice | 5000 |

### Verification

- Each Data Asset opens in the editor and shows all fields with correct categories.
- The Resistances and Vulnerabilities fields show dropdowns with the EDamageType enum values.
- Values are saved and persist when you close and reopen the editor.

---

## Exercise 6: Automate Data Asset Creation with Python

**Goal**: Use a Python script to batch-create enemy Data Assets instead of doing it manually.

### Steps

1. Ask Claude to write a Python script that creates enemy Data Assets from a dictionary. The script should:
   - Use the `unreal` Python module
   - Create Data Assets in `/Game/Data/Enemies/`
   - Set all properties from the data dictionary
   - Log each created asset

2. Open the Python console in UE5 (Window > Developer Tools > Output Log, switch to Python).

3. Paste the script and run it.

4. Define at least 10 more enemies from the bestiary:
   - Goblin Archer, Goblin Shaman, Kobold, Dire Wolf, Giant Spider
   - Mimic, Bandit Captain, Lich, Fire Elemental, Frost Giant

5. Run the script and verify all Data Assets appear in the Content Browser.

### Verification

- All 10+ Data Assets exist in `/Game/Data/Enemies/`.
- Each has the correct values when opened.
- The Python console shows success logs for each creation.

### Bonus Challenge

Modify the script to read enemy data from a CSV file, so you can edit the bestiary in a spreadsheet and regenerate all Data Assets with one command.

---

## Exercise 7: Build an Initiative Tracker

**Goal**: Create a subsystem that manages turn order for combat encounters.

### Steps

1. Add a new class to the `TabletopCombat` plugin (create the plugin if it does not exist yet).
2. Add `"TabletopDice"` and `"TabletopCore"` to its Build.cs dependencies.
3. Ask Claude to generate a `UInitiativeTrackerSubsystem` with:

**Structs:**
- `FCombatant`: Name (FString), InitiativeRoll (int32), FinesseModifier (int32), TotalInitiative (int32), bIsPlayerControlled (bool), CombatantActor (AActor*)

**Functions:**
- `StartNewEncounter()`: Clears tracker, resets round to 1
- `AddCombatant(FString Name, int32 FinesseModifier, bool bIsPlayer, AActor* Actor)`: Rolls d20 + Finesse for initiative, adds to list
- `GetTurnOrder()`: Returns sorted array (highest initiative first, ties broken by Finesse modifier)
- `AdvanceTurn()`: Moves to next combatant, returns the current FCombatant
- `GetCurrentCombatant()`: Returns who is active right now
- `GetCurrentRound()`: Returns the current round number
- `RemoveCombatant(FString Name)`: Removes someone who died or fled
- `IsEncounterActive()`: Are there still combatants?

**Delegates:**
- `FOnNewRoundStarted(int32 RoundNumber)`: Fires when the turn tracker wraps around
- `FOnTurnChanged(FCombatant NewActive)`: Fires when the active combatant changes

4. Paste, compile, test.

### Verification

Create a test Blueprint that:
1. Starts a new encounter
2. Adds "Warrior" (Finesse +2), "Rogue" (Finesse +5), "Mage" (Finesse +0), "Goblin" (Finesse +3)
3. Gets the turn order and prints each combatant's name and total initiative
4. Calls AdvanceTurn 8 times (two full rounds) and prints the active combatant each time
5. Binds to OnNewRoundStarted and prints "Round {N} begins!"

Verify that:
- Turn order is sorted by initiative (highest first)
- After all combatants have acted, the round advances
- The delegate fires at the start of each new round

---

## Exercise 8: Integration Test - A Mock Combat Round

**Goal**: Wire all plugins together in a single Blueprint to simulate one round of Tabletop Quest combat.

### Steps

1. Create a new Blueprint Actor called `BP_MockCombatTest`.
2. In BeginPlay, simulate this scenario:

**Setup:**
- A Warrior (Might 16, Finesse 10, HP 45, AC 18) fights a Goblin (Might 8, Finesse 14, HP 8, AC 13)
- Start a new encounter and add both combatants

**Round 1:**
- Get the turn order
- For the first combatant's turn:
  - Roll d20 + GetAbilityModifier(attacker's Might) for the attack
  - Check DoesAttackHit against the defender's AC
  - If hit: Roll 1d10 + GetAbilityModifier(Might) for damage
  - Apply CalculateDamage with the defender's resistances/vulnerabilities
  - Print: "{Attacker} attacks {Defender}! Roll: {roll}. {Hit/Miss}! Damage: {damage}"
  - Subtract damage from defender's HP
- Advance turn and repeat for the second combatant
- Print final HP for both combatants

3. Drop the actor in a test level and hit Play.

### Verification

- The combat log prints make sense (rolls are in valid ranges, damage is calculated correctly)
- Goblin takes Physical damage normally (no resistances to Physical)
- If you change the Goblin's vulnerabilities to include Physical, the damage should double
- The initiative system correctly determines who goes first
- HP values update correctly after each attack

### Bonus Challenge

Add the Warrior's Shield Bash ability: if the attack hits, the Goblin gets the Stunned status effect for 1 turn. On the Goblin's next turn, check if it is Stunned and skip its action if so. This previews the combat system you will build in full in Module 04.
