# Module 08: Resources - User Interface

## Official UE5 Documentation

### UMG Core
- **UMG UI Designer Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-ui-designer-for-unreal-engine
- **Widget Blueprint**: https://dev.epicgames.com/documentation/en-us/unreal-engine/widget-blueprints-in-unreal-engine
- **UMG Widget Types**: https://dev.epicgames.com/documentation/en-us/unreal-engine/widget-type-reference-for-unreal-engine

### Layout and Anchors
- **Anchors**: https://dev.epicgames.com/documentation/en-us/unreal-engine/umg-anchors-in-unreal-engine
- **Canvas Panel**: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-canvas-panel-in-unreal-engine
- **DPI Scaling**: https://dev.epicgames.com/documentation/en-us/unreal-engine/dpi-scaling-in-unreal-engine

### Interaction
- **Widget Interaction Component**: https://dev.epicgames.com/documentation/en-us/unreal-engine/widget-interaction-component-in-unreal-engine
- **Drag and Drop**: https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-drag-and-drop-ui-in-unreal-engine
- **UMG Events**: https://dev.epicgames.com/documentation/en-us/unreal-engine/events-in-umg-for-unreal-engine

### Animation
- **Widget Animations**: https://dev.epicgames.com/documentation/en-us/unreal-engine/animating-umg-widgets-in-unreal-engine

### Materials for UI
- **UI Material Domain**: https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-ui-materials-in-unreal-engine

### CommonUI Plugin
- **CommonUI Overview**: https://dev.epicgames.com/documentation/en-us/unreal-engine/common-ui-plugin-for-advanced-user-interfaces-in-unreal-engine
- **CommonUI Quickstart**: https://dev.epicgames.com/documentation/en-us/unreal-engine/common-ui-quickstart-guide-for-unreal-engine

## Video Tutorials

### UMG Fundamentals
- **Ryan Laley - UE5 UMG Tutorial Series**: Comprehensive series covering widget creation, anchors, data binding, and animations. Great starting point.
- **Unreal Engine - UMG Basics | Live Training**: Official Epic walkthrough of UMG core concepts.

### Inventory Systems
- **Ryan Laley - Inventory System in UE5**: Full inventory with equipment, drag-and-drop, and tooltips. Closely matches what Tabletop Quest needs.
- **Gorka Games - RPG Inventory Tutorial**: RPG-specific inventory with rarity colors, stat comparisons, and paper doll layout.

### Dialogue Systems
- **Mathew Wadstein - Dialogue System Tutorial**: Blueprint-based dialogue with branching, conditions, and typewriter effect.
- **Unreal Engine - Creating a Dialogue System**: Official approach using Data Tables and UMG.

### HUD Design
- **Ben UI - Game UI Database**: Not a tutorial but a massive collection of game UI screenshots sorted by element type (HP bars, inventories, minimaps). Excellent reference for design: https://www.gameuidatabase.com

### Cooldown Overlays
- **PrismaticaDev - Radial Cooldown Material**: Step-by-step material creation for the radial sweep cooldown effect. Directly applicable to the ability hotbar.

## UI Design References

### RPG UI Analysis
- **Divinity: Original Sin 2**: Excellent RPG UI with turn-based initiative tracker, inventory, and dialogue. Study how they handle information density.
- **Baldur's Gate 3**: Modern take on DnD UI. The action bar, initiative tracker, and dialogue system are highly relevant to Tabletop Quest.
- **Final Fantasy XIV**: MMO with a highly customizable HUD. Study how they handle ability hotbars, status effects, and party frames.
- **Skyrim**: Minimalist RPG HUD. Study the compass, quest markers, and how little UI is needed during exploration.

### Design Principles
- **Game UI Database**: https://www.gameuidatabase.com (screenshots of HUDs, inventories, and menus from hundreds of games)
- **Interface in Game**: https://interfaceingame.com (analysis articles about game UI design decisions)

## Tools and Assets

### Fonts
- **Google Fonts**: Free fonts including fantasy/medieval styles. "Cinzel" and "MedievalSharp" work well for RPG UIs: https://fonts.google.com
- **FontSquirrel**: Free commercial-use fonts: https://www.fontsquirrel.com

### Icons
- **Game-Icons.net**: Huge library of free game icons (swords, shields, potions, spells). SVG format, easy to import: https://game-icons.net
- **Kenney UI Pack**: Free UI element sprites (buttons, panels, frames) in a clean fantasy style: https://kenney.nl

### Color Palettes
- **Coolors**: Generate color palettes. Useful for rarity tiers and faction colors: https://coolors.co
- **Accessible Colors**: Check color contrast for accessibility: https://accessible-colors.com

## Accessibility Resources

- **WCAG Guidelines for Games**: https://www.w3.org/WAI/standards-guidelines/wcag/
- **Game Accessibility Guidelines**: http://gameaccessibilityguidelines.com
- **UE5 Colorblind Simulation**: Built into UE5, go to Project Settings > Engine > Accessibility for colorblind preview modes

## UE5 Python Scripting for UI
- **Python Editor Script Plugin**: https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python
- Use Python to batch-import icon textures, generate Data Tables from JSON, and automate asset organization for large item/ability databases
