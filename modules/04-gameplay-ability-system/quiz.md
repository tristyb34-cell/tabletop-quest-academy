# Module 04: Quiz

Test your understanding of the turn-based combat system. Try to answer each question before checking the answer key at the bottom.

---

### Question 1 (Multiple Choice)

In the combat system you built, what determines who goes first in a fight?

A) Whoever has the most HP
B) An initiative roll (D20 + Dexterity modifier), with the highest total going first
C) The player always goes first
D) Characters act in the order they were placed in the level

---

### Question 2 (Short Answer)

Explain the two-step attack resolution process. What happens first, and what happens if the first step succeeds?

---

### Question 3 (Multiple Choice)

A hero with an Attack Modifier of +5 rolls a 12 on their D20. The goblin has an AC of 14. Does the attack hit?

A) Yes, because 12 is greater than 5
B) No, because 12 is less than 14
C) Yes, because 12 + 5 = 17, which exceeds the goblin's AC of 14
D) No, because the goblin's AC is too high for any roll to hit

---

### Question 4 (Short Answer)

Why does the combat grid use X and Y coordinates for each tile? How does this help with movement?

---

### Question 5 (Multiple Choice)

What does the Defend action do in the combat system?

A) It fully heals the character
B) It temporarily increases the character's AC by +2 until their next turn
C) It allows the character to attack twice
D) It ends the combat encounter

---

## Answer Key

**Question 1**: B) An initiative roll (D20 + Dexterity modifier), with the highest total going first. This is the standard DnD initiative system. It adds randomness to every encounter, so even a slow goblin might occasionally beat a fast hero to the punch.

**Question 2**: First, the attacker rolls a D20 and adds their Attack Modifier. This total is compared to the target's Armour Class (AC). If the total meets or exceeds the AC, the attack hits. If it hits, the attacker then rolls their weapon's damage die (e.g., D8 for a longsword) and adds their Strength modifier. That damage is subtracted from the target's HP. If the first roll misses, no damage happens.

**Question 3**: C) Yes, because 12 + 5 = 17, which exceeds the goblin's AC of 14. The total attack roll is always the D20 result plus the Attack Modifier. You compare the combined total to the target's AC, not the raw die roll.

**Question 4**: The grid uses X and Y coordinates so the game can calculate distances mathematically. To check if a character can move to a tile, you compare the distance between their current coordinates and the target tile against their movement range. For example, a character at (2, 3) trying to move to (5, 3) is moving 3 tiles, which is within a 5-tile movement range. Without coordinates, you would have no way to measure distances or validate legal moves.

**Question 5**: B) It temporarily increases the character's AC by +2 until their next turn. This makes the character harder to hit, creating a tactical choice: deal damage now, or protect yourself this round? The bonus resets when the character's next turn begins.
