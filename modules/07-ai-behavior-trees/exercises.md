# Module 07: Exercises - Enemy AI

## Exercise 1: Set Up a NavMesh and Make an Enemy Patrol Between Points

**Goal:** Get an enemy character walking a patrol route around your level.

**What you will do:**

1. First, your level needs a Navigation Mesh so AI characters know where they can walk. Ask Claude:
   > "Write me a Python script for UE5 that places a NavMesh Bounds Volume in my level, centred at the origin, large enough to cover a 5000 x 5000 unit area. Also place 4 Target Point actors in a square pattern (at roughly 1000 units apart) to serve as patrol waypoints."

2. Paste the script into UE5's Python console. Press P in the viewport to visualise the NavMesh. You should see green areas on your floor surfaces. If nothing is green, make sure your floor meshes have collision enabled.

3. Now you need an enemy character. If you do not have one yet, use the default mannequin or any placeholder mesh. Ask Claude:
   > "Walk me through creating a Goblin AI setup in Blueprints. I need: (a) An AI Controller Blueprint with a Behaviour Tree reference. (b) A Blackboard with a 'PatrolPoint' key of type Vector. (c) A simple Behaviour Tree that loops through patrol points using a Sequence: get the next patrol point, move to it using MoveTo, then wait 3 seconds."

4. Follow Claude's step-by-step instructions to create these assets in the editor. Assign the AI Controller to your enemy character Blueprint.

5. Place the enemy in the level. Hit Play and watch it walk between the patrol points, pausing at each one.

6. Experiment: move the patrol point actors to different positions and replay. Add a fifth patrol point. Change the wait time to 1 second or 6 seconds and observe the difference in feel. A short wait makes the enemy seem alert. A long wait makes it seem lazy.

**You know it is working when:**
- The enemy walks smoothly from one patrol point to the next
- It pauses briefly at each point before moving on
- It loops through the patrol route endlessly
- The NavMesh (visible with P key) covers your walkable surfaces

---

## Exercise 2: Add Player Detection (Sight and Hearing)

**Goal:** Make the enemy notice the player and react.

**What you will do:**

1. Ask Claude:
   > "Help me add AI Perception to my goblin's AI Controller Blueprint. I want a sight sense with a 60-degree peripheral vision angle, 1500 unit range, and I want a hearing sense with an 800 unit range. When the goblin sees the player, it should write the player reference to a 'TargetActor' Blackboard key and the player's location to a 'LastKnownPosition' key."

2. Claude will guide you through adding the AI Perception component to your AI Controller and configuring the sight and hearing senses. Follow the steps.

3. Now update the Behaviour Tree. Ask Claude:
   > "Update my goblin's Behaviour Tree so it has two branches above the patrol branch: (a) An 'Attack' sequence that runs when TargetActor is set. It should use MoveTo to approach the target, then wait 1 second (placeholder for an attack). (b) An 'Investigate' sequence that runs when TargetActor is NOT set but LastKnownPosition IS set. It should move to LastKnownPosition, wait 3 seconds (looking around), then clear LastKnownPosition."

4. The tree should now look like: Attack (if I see you) > Investigate (if I heard something) > Patrol (default).

5. Hit Play. Walk toward the goblin. When you enter its sight cone, it should break from patrol and chase you. Run away and hide. The goblin should go to where it last saw you, wait, then return to patrolling.

6. Test hearing: ask Claude how to make the player character emit a noise event when jumping or attacking. Walk up behind the goblin (outside its sight cone) and make noise. It should turn and investigate.

**You know it is working when:**
- The goblin patrols normally when it cannot see or hear you
- Walking into its sight cone triggers the chase
- Running out of sight causes it to investigate your last known position
- After investigating and finding nothing, it returns to patrol
- Making noise near the goblin (even behind it) gets its attention

---

## Exercise 3: Combat AI That Chooses Between Attack, Defend, and Heal

**Goal:** Build a simple decision-making system for the enemy's turn in combat.

**What you will do:**

1. Ask Claude:
   > "Create a Blueprint function called 'ChooseCombatAction' for my goblin. It should use a scoring system: (a) Attack gets a base score of 50, plus 20 if a player character is within melee range. (b) Defend gets a base score of 10, plus 40 if the goblin's HP is below 50%, plus another 20 if HP is below 25%. (c) Heal gets a base score of 0, plus 60 if HP is below 30% AND the goblin has a healing potion. Return the action with the highest score."

2. Claude will provide the Blueprint node layout. Create the function in your goblin's character Blueprint.

3. Create a simple test setup: place the goblin in a level with a player character nearby. Add a way to damage the goblin (even just a debug key that reduces its HP variable by 20).

4. Call the ChooseCombatAction function and print the result to the screen. At full health with a player nearby, it should choose Attack. Damage it below 50% HP, and it should start choosing Defend. Damage it below 30% with a potion available, and it should choose Heal.

5. Expand the system. Ask Claude:
   > "Add a 'Special Ability' option to the combat AI. It should have a score of 0 normally, but 70 if there are 2 or more player characters within range (the goblin shaman casts an area curse when outnumbered)."

6. Test the expanded decision making by placing multiple player characters near the goblin and watching the decision change.

**You know it is working when:**
- A healthy goblin with targets nearby always chooses Attack
- A wounded goblin starts choosing Defend
- A critically wounded goblin with potions chooses Heal
- A goblin facing multiple enemies uses its special ability
- The decisions feel logical and create interesting combat moments
