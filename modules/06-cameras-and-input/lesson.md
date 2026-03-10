# Module 06: The Camera and Controls

## The Player's Eyes

Think of the camera as the player's eyes. Every single moment of your game is experienced through whatever the camera shows. A close third-person camera says "you are this character, this is personal." A high overhead camera says "you are the strategist, think tactically." And for Tabletop Quest, we need both of these perspectives, plus the signature trick: zooming from the tabletop view down into a miniature as it springs to life in 3D.

If you have ever watched a film, you know that camera angles change the mood entirely. A low angle makes someone look powerful. A high angle makes them look small. Games work the same way. The camera is not just a window into the world; it is a storytelling tool.

In this module, you will set up the two core camera perspectives for Tabletop Quest, wire up player controls using UE5's Enhanced Input system, and build the cinematic zoom transition that defines the game's identity.

---

## The Spring Arm: Your Invisible Selfie Stick

The most important camera tool in Unreal Engine is the **Spring Arm** component. Think of it as an invisible selfie stick attached to your character. The camera sits on the end of the stick, and the stick has a brain: if it would poke through a wall, it automatically shortens so the camera stays in a valid position. When the wall is gone, the stick smoothly extends back to full length.

Here are the key properties you will care about:

- **Target Arm Length**: How long the stick is. A value of 300 gives a standard third-person view. Bigger numbers pull the camera further away.
- **Camera Lag**: When turned on, the camera does not snap instantly to the character. It floats and catches up smoothly, like a drone following a jogger. This feels cinematic. A lag speed of 8 is a good starting point.
- **Socket Offset and Target Offset**: These let you nudge the camera position. Target Offset moves the point the camera orbits around (push it up and right for an over-the-shoulder view). Socket Offset moves the camera itself at the end of the arm.
- **Collision Test**: This is the brain of the selfie stick. Leave it on for third-person cameras, turn it off for overhead/isometric cameras where collision would cause problems.

You will not need to write code for any of this. Claude will give you a Python script that sets up the Spring Arm with the right values, and you will paste it into UE5's Python console.

---

## Camera Mode 1: The Third-Person View

This is the "alive" camera. When a miniature springs to life and becomes a full 3D character, the player sees the world from behind and slightly above their hero, like most action RPGs.

The setup uses a Spring Arm attached to the player character, with a Camera Component on the end. The character faces the direction they walk (not the direction the camera points), and the player rotates the camera freely with the mouse. Think of it like controlling a drone that follows your character around.

**What Claude will build for you:**
- A Blueprint with the Spring Arm and Camera already configured
- The character rotation settings so your hero faces their movement direction
- Camera lag for smooth, cinematic following

After Claude gives you the Blueprint setup, you will be able to run around your test level with a smooth third-person camera. This is the foundation that 90% of third-person games use.

---

## Camera Mode 2: The Top-Down Tabletop View

This is the "miniature" camera. It looks down at the game board from above, like you are sitting at a DnD table looking at the battle map. The camera sits high up, angled downward, and does not rotate with mouse input. Instead, you can pan it around with WASD or by moving the mouse to the screen edges.

The key difference from the third-person camera: the Spring Arm's **Use Pawn Control Rotation** is turned off. This means the mouse does not spin the camera. The camera stays at a fixed angle, giving that classic tabletop strategy feel.

You might also switch to **orthographic projection** for this view. Normal cameras use perspective (things look smaller when far away), but orthographic cameras show everything at the same scale regardless of distance. This makes a top-down view feel more like looking at a flat map, which is perfect for a tabletop game.

---

## The Signature Transition: Tabletop to 3D

This is the moment that defines Tabletop Quest. The player is looking down at miniatures on a table. They select a character. The camera begins to swoop downward, diving toward the miniature. As it gets closer, the miniature grows, gains detail, and transforms into a fully realised 3D character. The camera settles into the third-person view behind the now-alive hero.

In Unreal Engine, this transition uses a function called **SetViewTargetWithBlend**. It smoothly moves the player's view from one camera to another over a set duration. You choose the blending curve:

- **EaseInOut**: Smooth start and smooth finish. This is the default choice for most transitions and the one you will use for the tabletop zoom.
- **Linear**: Constant speed. Looks mechanical, not cinematic.
- **EaseIn**: Slow start, fast finish. Good for dramatic reveals.
- **EaseOut**: Fast start, slow finish. Good for settling into a scene.

For the tabletop-to-3D transition, you will blend from the overhead Camera Actor to the character's Spring Arm camera over about 2 to 3 seconds using EaseInOut. During that same time window, you can animate the miniature's scale from small to full size and blend the materials from a painted look to realistic textures (building on what you learned in Module 05).

Claude will provide a Blueprint that coordinates the camera blend, scale animation, and material transition all at once, so they feel like one seamless moment.

---

## The Enhanced Input System: How the Player Talks to the Game

Now let us talk about controls. UE5 uses something called the **Enhanced Input System**, and it is much more flexible than the old way of doing things. Think of it as a translation layer between the physical world (your keyboard and mouse) and the game world (moving, jumping, attacking).

There are three pieces to understand:

### Input Actions
An Input Action is an abstract idea like "Move" or "Jump" or "Interact." It does not care which key is pressed. It just says "the player wants to move" and carries a value (which direction, how far). Think of Input Actions as verbs: Move, Look, Jump, Attack, Open Inventory.

Input Actions have value types:
- **Bool**: On or off. Jump, interact, pause.
- **Axis2D**: Two directions at once. Movement (forward/back and left/right), camera look (up/down and left/right).

### Input Mapping Contexts
A Mapping Context connects physical keys to Input Actions. It says "W key maps to the Move action, positive Y direction." You can have multiple contexts and swap them based on the game state.

For Tabletop Quest, you need at least two:
- **Exploration Context**: WASD moves the character, mouse rotates the camera, E interacts, Space jumps.
- **Combat Context**: WASD pans the tactical camera, mouse clicks select targets and abilities, number keys pick ability slots, Enter ends the turn.

When combat starts, you remove the exploration context and add the combat context. The player's keys now do different things, and you did not have to write a single if-statement to check which mode you are in. The system handles it.

### Modifiers and Triggers
Modifiers transform the input value before your game sees it. A **Dead Zone** modifier ignores tiny stick movements on a gamepad (prevents drift). A **Negate** modifier inverts an axis (for players who prefer inverted camera Y-axis).

Triggers decide when the action fires. **Pressed** fires once when a key goes down. **Hold** fires only after the key has been held for a set duration (great for preventing accidental interactions).

---

## Wiring It All Together

Here is how the camera and controls connect in Tabletop Quest:

1. **Tabletop mode**: Top-down camera is active. Exploration input context is loaded. WASD pans the overhead view. Clicking a miniature selects it.
2. **Player triggers the zoom**: The camera blends down to the selected miniature. The miniature transforms into a 3D character. The input context stays the same during the transition.
3. **Third-person mode**: The Spring Arm camera is now active. The input context provides character movement, camera rotation, and interaction.
4. **Combat starts**: The camera pulls up to the isometric tactical view. The input context swaps to combat controls. Mouse cursor appears for clicking abilities and targets.
5. **Combat ends**: Camera returns to third-person. Input context swaps back to exploration.

The Camera Director, which is a Blueprint actor that manages all of this, listens to game events ("combat started," "combat ended," "return to tabletop") and coordinates the camera transitions and input swaps. Claude will build this for you as a central manager Blueprint.

---

## What You Will Build This Module

By the end of this module, you will have:
- A third-person Spring Arm camera following your character with smooth lag and collision
- A top-down tabletop camera looking down at the game board
- A smooth camera transition between the two views
- WASD movement and mouse camera rotation for third-person mode
- The foundation for swapping input contexts when the game mode changes

This is one of those modules where the result is immediately satisfying. The moment that camera swoops down from the tabletop into the 3D world, the game starts to feel real. Let us build it.
