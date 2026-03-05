## UMG (Widget System)

Unreal Motion Graphics (UMG) is the UI framework for creating HUDs, menus, and in-world interfaces. Widgets are composed hierarchically in the Widget Blueprint Editor.

**Creating a Widget Blueprint:**
- Content Browser > Right-click > User Interface > Widget Blueprint

---

### Common Widgets

#### Button

- Clickable button widget
- **Events**: `On Clicked`, `On Pressed`, `On Released`, `On Hovered`, `On Unhovered`
- **Properties**: Style (Normal, Hovered, Pressed, Disabled), Color and Opacity, Is Enabled, Click Method (Down and Up, Mouse Down, Mouse Up, Precise Click), Touch Method, Press Method
- Child slot: Place one child widget (typically a Text Block) inside the button

#### Text Block

- Displays static or dynamic text
- **Properties**: Text, Font, Size, Color, Justification (Left, Center, Right), Auto Wrap Text, Wrap Text At, Line Height Percentage, Shadow Offset/Color, Outline Size/Color
- **Binding**: Bind the Text property to a function or variable for dynamic updates

#### Rich Text Block

- Displays text with inline styling using decorator tags
- Supports bold, italic, color, images, and custom decorators
- Uses a Data Table of `FRichTextStyleRow` for style definitions
- Markup: `<StyleName>styled text</>`
- **Properties**: Text, Text Style Set (Data Table), Decorator Classes

#### Image

- Displays a texture, material, or Slate Brush
- **Properties**: Brush (Image, Size, Tiling, Tint), Color and Opacity, On Mouse Button Down event
- Can use render targets for dynamic content

#### Border

- Single-child container with a background brush
- **Properties**: Background, Brush Color, Content Color and Opacity, Padding, Horizontal/Vertical Alignment
- Useful for frames, backgrounds, and tinted overlays

#### Check Box

- Toggle widget (checked/unchecked/undetermined)
- **Events**: `On Check State Changed`
- **Properties**: Checked State, Is Checked, Appearance (Checked/Unchecked/Undetermined images for each state), Click Method

#### Combo Box (String)

- Dropdown selector from a list of string options
- **Events**: `On Selection Changed`, `On Opening`
- **Properties**: Default Options (string array), Selected Option, Content Padding, Max List Height, Font, Style

#### Editable Text

- Single-line text input (no border/background)
- **Events**: `On Text Changed`, `On Text Committed`
- **Properties**: Text, Hint Text, Is Read Only, Is Password, Min Desired Width, Font

#### Editable Text Box (Text Box)

- Single-line text input with a border/background (styled)
- Same events and properties as Editable Text, plus appearance settings
- **Properties**: Is Multiline (available in Multi-Line Editable Text Box variant)

#### Progress Bar

- Horizontal or vertical fill bar
- **Properties**: Percent (0.0 to 1.0), Fill Color and Opacity, Fill Image, Background Image, Bar Fill Type (Left to Right, Right to Left, Fill from Center, Top to Bottom, Bottom to Top), Bar Fill Style

#### Slider

- Draggable slider for numeric input
- **Events**: `On Value Changed`, `On Mouse Capture Begin/End`
- **Properties**: Value (0.0 to 1.0), Min Value, Max Value, Step Size, Orientation (Horizontal/Vertical), Slider Bar Color, Slider Handle Color, Locked, Is Focusable

#### Spin Box

- Numeric input with drag and click-to-increment functionality
- **Properties**: Value, Min Value, Max Value, Min Slider Value, Max Slider Value, Delta, Slider Exponent, Min Desired Width
- **Events**: `On Value Changed`, `On Value Committed`

#### Throbber

- Animated loading indicator (bouncing dots)
- **Properties**: Number of Pieces, Is Animating, Image (per piece)

#### Circular Throbber

- Spinning circular loading indicator
- **Properties**: Number of Pieces, Period (rotation speed), Radius, Image, Is Animating

> **In your games:**
> - **DnD RPG**: Use **Button** for ability hotbar slots (6 buttons across the bottom of the HUD), inventory item slots, quest log entries, and the "End Turn" button in turn-based combat. Use **Text Block** for health/mana/action point numbers, character names, damage popups, and dice roll results. Use **Rich Text Block** for the quest log text (bold quest names, colored item names like `<Legendary>Sword of Flames</>`). Use **Image** for character portraits in the party management panel, ability icons on the hotbar, minimap display, and item icons in the inventory grid. Use **Progress Bar** for health bars (red fill), mana bars (blue fill), XP progress, and ability cooldown overlays on hotbar icons. Use **Slider** in the settings menu for volume, camera sensitivity, and brightness. Use **Check Box** for toggling options like "Show Damage Numbers", "Auto-End Turn", and "Enable Minimap Rotation". Use **Combo Box** for difficulty selection and resolution settings. Use **Throbber** or **Circular Throbber** as a loading indicator when streaming new dungeon rooms via World Partition.
> - **Wizard's Chess**: Use **Button** for the "New Game", "Resign", and "Offer Draw" menu buttons, and for promotion piece selection (Queen, Rook, Bishop, Knight). Use **Text Block** for the move list entries, player names, and timer display. Use **Image** for piece icons in the captured pieces display and for board square highlights showing valid moves. Use **Progress Bar** for the chess timer as a visual countdown bar. Use **Check Box** for settings like "Show Legal Moves" and "Enable Move Sounds".

---

### Panel Widgets

Panel widgets contain and arrange child widgets.

#### Canvas Panel

- Free-form layout; children are positioned using anchors and offsets
- Each child has a `Canvas Panel Slot` with:
  - `Anchors`: Min/Max (0,0 to 1,1); determines relative positioning
  - `Offsets`: Pixel offsets from the anchor point
  - `Alignment`: Pivot point (0,0 = top-left, 0.5,0.5 = center)
  - `Size To Content`: Auto-size instead of using explicit dimensions
  - `ZOrder`: Drawing order
- The default root panel for Widget Blueprints

#### Horizontal Box

- Arranges children horizontally (left to right)
- Each child slot has:
  - `Size`: Auto (use content size) or Fill (expand to fill available space)
  - `Horizontal Alignment`: Left, Center, Right, Fill
  - `Vertical Alignment`: Top, Center, Bottom, Fill
  - `Padding`: Per-side padding

#### Vertical Box

- Arranges children vertically (top to bottom)
- Same slot properties as Horizontal Box

#### Grid Panel

- Arranges children in a configurable grid
- Each child specifies a `Row` and `Column` index
- **Properties**: Column Fill (per-column fill coefficients), Row Fill (per-row fill coefficients)

#### Uniform Grid Panel

- Arranges children in a grid where all cells are the same size
- **Properties**: Slot Padding, Min Desired Slot Width, Min Desired Slot Height
- Children fill left-to-right, top-to-bottom automatically

#### Overlay

- Stacks children on top of each other (all occupy the same space)
- Each child slot has Horizontal and Vertical Alignment, Padding
- Drawing order: first child is at the bottom, last child is on top
- Useful for layering backgrounds, content, and foreground elements

#### Scale Box

- Scales a single child to fit the panel's bounds
- **Properties**:
  - `Stretch`: None, Fill, Scale to Fit, Scale to Fill, User Specified
  - `Stretch Direction`: Both, Down Only, Up Only
  - `User Specified Scale`: Manual scale factor (when Stretch is User Specified)
  - `Ignore Inherited Scale`: Counteract parent scaling

#### Scroll Box

- Scrollable container for child widgets
- **Properties**:
  - `Orientation`: Horizontal or Vertical
  - `Scroll Bar Visibility`: Visible, Collapsed, Auto
  - `Scrollbar Thickness`
  - `Scrollbar Padding`
  - `Always Show Scrollbar`
  - `Allow Overscroll`
  - `Consume Mouse Wheel`: Always, When Scrolling, Never
  - `Navigation Destination`: End of List or Loop
- **Events**: `On User Scrolled`
- Functions: `ScrollToStart()`, `ScrollToEnd()`, `ScrollWidgetIntoView()`

#### Size Box

- Overrides the desired size of its child widget
- **Properties**:
  - `Width Override`, `Height Override`
  - `Min Desired Width/Height`
  - `Max Desired Width/Height`
  - `Min Aspect Ratio`, `Max Aspect Ratio`
- Useful for enforcing exact dimensions on flexible children

#### Widget Switcher

- Displays one child at a time; all others are hidden
- **Properties**: `Active Widget Index`
- Functions: `SetActiveWidgetIndex(int32)`, `SetActiveWidget(UWidget*)`
- Children are indexed 0 to N-1

#### Wrap Box

- Arranges children in a row, wrapping to the next row when the width is exceeded
- **Properties**:
  - `Inner Slot Padding`: Space between items
  - `Explicit Wrap Size`: Force wrap at a specific width (0 = use parent)
  - `Use All Remaining Space`: Stretch last item to fill the remaining line

#### Stack Box

- Arranges children in a stack with configurable axis
- Similar to Horizontal/Vertical Box but more flexible with the axis configuration

> **In your games:**
> - **DnD RPG**: Use **Canvas Panel** as the root for the main HUD, placing health/mana bars at top-left, minimap at top-right, ability hotbar at bottom-center, and action points at bottom-left using anchor presets. Use **Horizontal Box** for the ability hotbar (6 ability slots in a row) and for stat rows in the character sheet (icon + label + value). Use **Vertical Box** for the quest log (stacked quest entries), inventory sidebar (vertical list of categories), and the party member list in the party management panel. Use **Grid Panel** for the inventory grid (e.g., 8 columns x 6 rows of item slots). Use **Scroll Box** for the quest log content (scrollable when there are many quests), the inventory list, and long tooltip descriptions. Use **Widget Switcher** to swap between HUD states: index 0 = exploration HUD, index 1 = turn-based combat HUD, index 2 = real-time combat HUD. Use **Overlay** to layer a darkened background behind popup dialogs (like the level-up screen or loot window). Use **Wrap Box** for displaying collected items or buff icons that wrap to a new row when the bar is full. Use **Size Box** to enforce consistent 64x64 pixel dimensions on all ability and inventory icon slots. Use **Scale Box** for the minimap widget so it scales down uniformly.
> - **Wizard's Chess**: Use **Canvas Panel** as the root, anchoring the board view to center, move list to the right, and timers at the top. Use **Vertical Box** for the move list (stacked move entries, e.g., "1. e4 e5"). Use **Horizontal Box** for each move row (move number + white move + black move). Use **Scroll Box** for the move list when it exceeds the visible area. Use **Widget Switcher** to toggle between the main game view and a settings/options view. Use **Overlay** to layer piece selection highlights on top of the board UI.

---

### Anchors and Alignment

Anchors determine how a widget is positioned relative to its parent Canvas Panel.

**Preset anchor positions:**

| Preset | Anchor Min/Max | Description |
|--------|----------------|-------------|
| Top-Left | (0,0) - (0,0) | Fixed to top-left corner |
| Top-Center | (0.5,0) - (0.5,0) | Centered at the top |
| Top-Right | (1,0) - (1,0) | Fixed to top-right corner |
| Center-Left | (0,0.5) - (0,0.5) | Centered on the left |
| Center | (0.5,0.5) - (0.5,0.5) | Centered in the parent |
| Center-Right | (1,0.5) - (1,0.5) | Centered on the right |
| Bottom-Left | (0,1) - (0,1) | Fixed to bottom-left corner |
| Bottom-Center | (0.5,1) - (0.5,1) | Centered at the bottom |
| Bottom-Right | (1,1) - (1,1) | Fixed to bottom-right corner |
| Stretch Horizontal | (0,Y) - (1,Y) | Stretches full width at a vertical position |
| Stretch Vertical | (X,0) - (X,1) | Stretches full height at a horizontal position |
| Stretch Both | (0,0) - (1,1) | Fills the entire parent |

> **In your games:**
> - **DnD RPG**: Anchor the health/mana bars to **Top-Left** so they stay pinned regardless of resolution. Anchor the minimap to **Top-Right**. Anchor the ability hotbar to **Bottom-Center** so it remains centered at the bottom of the screen. Anchor the action point display to **Bottom-Left**. Use **Stretch Horizontal** at the bottom for a full-width combat info bar during turn-based mode. Anchor the party portraits panel to **Center-Left** as a vertical strip. Use **Stretch Both** for full-screen overlays like the inventory screen, character sheet, and quest log. Anchor damage popup text to **Center** with dynamic offsets so numbers float above enemies.
> - **Wizard's Chess**: Anchor the board camera view to **Center**. Anchor the move list panel to **Center-Right** with **Stretch Vertical** so it fills the right side of the screen. Anchor player timers to **Top-Left** and **Top-Right** for white and black respectively. Anchor the "Captured Pieces" display to **Bottom-Left** and **Bottom-Right** for each player.

**Alignment:**
- The pivot point of the widget (0,0 = top-left, 1,1 = bottom-right)
- Affects how Position Offset is interpreted
- Example: Alignment (0.5, 0.5) with Anchor at Center places the widget's center at the screen center

**Slot Settings (Canvas Panel Slot):**
- `Position`: Offset from the anchor in pixels
- `Size`: Widget dimensions (when not stretching)
- `Anchors`: Min and Max anchor points
- `Alignment`: Pivot point
- `Auto Size`: Use the widget's desired size
- `ZOrder`: Draw order (higher = drawn on top)

---

### Widget Animations

UMG supports keyframe animations for widget properties.

**Creating animations:**
1. In the Widget Blueprint, click "+ Animation" in the Animations panel
2. Name the animation
3. Select a widget, add tracks for properties: Render Transform (Translation, Rotation, Scale, Shear), Render Opacity, Color and Opacity, Visibility, Padding, and more
4. Set keyframes on the timeline
5. Adjust curves per-keyframe (Linear, Cubic, Ease In/Out)

**Playing animations:**

Blueprint: `Play Animation`, `Play Animation Forward`, `Play Animation Reverse`, `Stop Animation`, `Pause Animation`, `Set Current Time`

**Animation properties:**
- `Play Mode`: Forward, Reverse, Ping Pong
- `Num Loops to Play`: 0 = play once, >0 = loop count
- `Playback Speed`: Speed multiplier
- **Events**: `On Animation Started`, `On Animation Finished`

C++:
```cpp
UWidgetAnimation* MyAnim; // Set via UPROPERTY binding
PlayAnimation(MyAnim, 0.f, 1, EUMGSequencePlayMode::Forward, 1.f);
```

> **In your games:**
> - **DnD RPG**: Animate the health bar flashing red when the player takes a large hit (scale pulse + color tint over 0.3s). Animate ability icons with a cooldown sweep (opacity wipe from bottom to top). Create a "Level Up" banner animation that slides in from the top, holds for 2 seconds, then fades out. Animate the dice roll result popping in with a scale bounce (0 to 1.2 to 1.0 over 0.4s). Use a fade-in animation on the turn-based combat HUD when entering combat. Animate the minimap pulse when a new objective appears. Use Ping Pong mode on a glow animation for the "End Turn" button to draw the player's attention.
> - **Wizard's Chess**: Animate the move list entry sliding in when a new move is made (translate from right + fade in). Animate the timer bar flashing when under 30 seconds remaining (color pulse between white and red). Animate the "Check!" warning text scaling up and fading in at screen center. Use a subtle breathing animation (scale 1.0 to 1.02, Ping Pong loop) on the selected piece's highlight border.

---

### Data Binding and Property Binding

**Property Binding:**
- In the Details panel of any widget, click the "Bind" dropdown next to a property
- Select "Create Binding" to create a function that returns the property's value
- The function runs every frame to update the widget
- Performance: bindings evaluate every tick; use sparingly for performance-critical UI

**Widget Bindings (Function Binding):**
```
// In the Widget Blueprint graph
// Create a function named "GetHealthText" returning FText
FText GetHealthText()
{
    return FText::AsNumber(Health);
}
// Bind the Text Block's Text property to GetHealthText
```

**Event-Driven Updates (preferred for performance):**
- Use delegates or event dispatchers to push updates to widgets
- Call setter functions (e.g., `SetText()`, `SetPercent()`) only when values change

> **In your games:**
> - **DnD RPG**: Use event-driven updates (not per-frame bindings) for all combat HUD elements. Bind GAS attribute change delegates to push health, mana, and action point values to the HUD only when they change. For example, listen to `OnHealthChanged` from the Attribute Set and call `HealthBar->SetPercent(NewHealth / MaxHealth)`. For the ability hotbar, bind cooldown updates to GAS ability events so cooldown overlays refresh only when an ability's cooldown ticks. Use property bindings sparingly, only for continuously changing values like the minimap rotation angle.
> - **Wizard's Chess**: Use event-driven updates for the move list (add a new entry widget only when a move is made) and the timer (update the timer text every second via a game timer, not every frame). Bind the "valid moves" highlight to piece selection events so squares only refresh highlights when the player clicks a new piece.

---

### Widget Interaction Component

The Widget Interaction Component enables interacting with UMG widgets in 3D world space.

**Setup:**
1. Add a `Widget Component` to an Actor (set to World or Screen space)
2. Assign a Widget Blueprint to the Widget Component
3. Add a `Widget Interaction Component` to the player character (typically attached to the camera or a hand)
4. The interaction component simulates a pointer (like a mouse cursor) in 3D

**Properties:**

| Property | Description |
|----------|-------------|
| `Interaction Distance` | Maximum interaction range |
| `Interaction Source` | World (3D line trace), Mouse (screen cursor), CenterScreen |
| `Enable Hit Testing` | Whether the component performs traces |
| `Show Debug` | Draw debug line for the interaction ray |
| `Virtual User Index` | Simulated user for multi-user scenarios |
| `Pointer Index` | Finger/pointer index for touch simulation |

> **In your games:**
> - **DnD RPG**: Use the Widget Interaction Component for in-world UI elements. Attach a Widget Component (World Space) to shop NPCs displaying their wares, or to treasure chests showing a "Press E to Open" prompt. Place a Widget Component on dungeon doors showing locked/unlocked status. During tabletop view, display floating health bars above miniatures using World Space widgets. The player's camera-attached Widget Interaction Component lets them click these in-world widgets from a distance (set Interaction Distance to match the camera zoom range).
> - **Wizard's Chess**: This is less relevant since chess uses screen-space UI. However, you could place a World Space widget above each chess piece showing its type icon when hovered, using Interaction Source set to Mouse so the player's cursor acts as the pointer. Set Interaction Distance to cover the full board diagonal.

**Key Functions:**
- `PressPointerKey(EKeys::LeftMouseButton)`: Simulate a click
- `ReleasePointerKey(EKeys::LeftMouseButton)`: Release click
- `ScrollWheel(float ScrollDelta)`: Simulate scroll
- `PressKey(FKey Key)`: Simulate keyboard input to the focused widget
- `GetHitWidgetPath()`: Get the widget under the pointer

---

### Common UI Plugin

Common UI is Epic's framework for building multi-platform, input-method-aware UIs. It sits on top of UMG and adds navigation, activation, and input routing layers.

**Enabling:**
- Edit > Plugins > Common UI

**Key Classes:**

| Class | Description |
|-------|-------------|
| `UCommonActivatableWidget` | Base widget that tracks active/deactivated state. Receives input only when active. |
| `UCommonButtonBase` | Button with gamepad/keyboard focus support. Properties: Triggering Input Action, Selected/Selectable states, Is Toggle. |
| `UCommonTextBlock` | Rich text with automatic input icon substitution |
| `UCommonActionWidget` | Displays the key/button icon for an Input Action |
| `UCommonActivatableWidgetContainerBase` | Manages a stack of activatable widgets (push/pop navigation) |
| `UCommonActivatableWidgetStack` | Stack-based widget container (menu layers) |
| `UCommonActivatableWidgetQueue` | Queue-based widget container (sequential popups) |
| `UCommonAnimatedSwitcher` | Widget switcher with built-in transition animations |
| `UCommonVisibilitySwitcher` | Widget switcher based on visibility (no animation) |
| `UCommonTabListWidgetBase` | Tab navigation for switchers |

> **In your games:**
> - **DnD RPG**: Use Common UI as the foundation for all menus since the game supports gamepad, keyboard, and mouse. Use `UCommonActivatableWidgetStack` for the menu layer system: push the inventory screen on top of the HUD, then push a confirmation dialog on top of that. Each layer correctly blocks input to layers below. Use `UCommonButtonBase` for all interactive buttons so they automatically support gamepad focus highlighting. Use `UCommonActionWidget` to display the correct button prompt icon ("E" on keyboard, "A" on gamepad) for interaction prompts. Use `UCommonTabListWidgetBase` with `UCommonAnimatedSwitcher` for the character sheet tabs (Stats, Equipment, Abilities, Quests). Use `UCommonActivatableWidgetQueue` for sequential loot popups after clearing a dungeon room.
> - **Wizard's Chess**: Use `UCommonActivatableWidgetStack` for the menu system (game board at base, settings overlay pushed on top, "Are you sure you want to resign?" dialog pushed above that). Use `UCommonButtonBase` for all buttons to get gamepad support. Use `UCommonActionWidget` to show the correct "Confirm Move" button prompt based on input device.

**Widget Activation:**
- `ActivateWidget()`: Make this widget the active input consumer
- `DeactivateWidget()`: Remove from the active stack
- `GetDesiredFocusTarget()`: Override to specify which child gets focus when this widget activates

**Input Routing:**
- Common UI handles input routing based on the activation stack
- Only the topmost activated widget receives input
- `UCommonUIActionRouterBase` manages the input routing tree

---

### HUD Class

The HUD class (`AHUD`) is the player's screen overlay, accessed from the Player Controller.

**Creating a HUD:**
- Blueprint: Create a Blueprint class based on HUD
- Assign in your Game Mode: `HUD Class` property

**Adding widgets from the HUD:**
```cpp
void AMyHUD::BeginPlay()
{
    Super::BeginPlay();
    if (MainWidgetClass)
    {
        MainWidget = CreateWidget<UUserWidget>(GetOwningPlayerController(), MainWidgetClass);
        MainWidget->AddToViewport();
    }
}
```

**Creating and removing widgets:**

Blueprint:
- `Create Widget` node: Creates a widget instance from a class
- `Add to Viewport` / `Add to Player Screen`: Display the widget
- `Remove from Parent`: Remove and hide the widget

C++:
```cpp
// Create
UUserWidget* Widget = CreateWidget<UMyWidget>(PlayerController, WidgetClass);
Widget->AddToViewport(ZOrder); // ZOrder: higher = drawn on top

// Remove
Widget->RemoveFromParent();

// Remove all widgets
// There is no single "remove all" function; track your references and call RemoveFromParent on each
```

> **In your games:**
> - **DnD RPG**: Create the main HUD widget (`WBP_GameHUD`) in your custom HUD class's `BeginPlay`. This widget contains the health/mana bars, ability hotbar, minimap, and action points. Use ZOrder to layer: HUD at 0, popup dialogs at 10, tooltip overlays at 20. When entering the inventory screen, create `WBP_Inventory` and add it at ZOrder 5 (above HUD, below dialogs). Remove it from parent when the player closes inventory. For damage number popups, create lightweight text widgets, add them to the viewport, animate them floating upward, then call `RemoveFromParent` when the animation finishes.
> - **Wizard's Chess**: Create the board overlay HUD (`WBP_ChessHUD`) containing the move list, timers, and captured pieces display. Add the promotion selection widget on top (higher ZOrder) only when a pawn reaches the back rank, then remove it after the player chooses a piece.

---

### Focus and Navigation for Gamepad

UMG supports full gamepad/keyboard navigation through the focus system.

**Setting up navigation:**
1. On each interactive widget, configure the Navigation section in the Details panel:
   - `Up`, `Down`, `Left`, `Right`: Escape, Stop, Wrap, Explicit (specify target), Custom (bound function)
2. Set an initial focus widget in your Widget Blueprint's `NativeConstruct`:
   ```cpp
   void UMyWidget::NativeConstruct()
   {
       Super::NativeConstruct();
       if (StartButton)
       {
           StartButton->SetKeyboardFocus();
       }
   }
   ```

**Navigation rules per direction:**

| Rule | Description |
|------|-------------|
| `Escape` | Default; uses the automatic navigation algorithm |
| `Stop` | Navigation stops (cannot move further in this direction) |
| `Wrap` | Wraps around to the opposite side |
| `Explicit` | Navigate to a specific named widget |
| `Custom` | Call a bound function to determine the next widget |
| `Custom Boundary` | Custom function for boundary behavior only |

> **In your games:**
> - **DnD RPG**: Set up full gamepad navigation on the ability hotbar: Left/Right navigates between the 6 ability slots, Up navigates to the party portraits, Down is set to `Stop` (nothing below the hotbar). Use `Wrap` on the hotbar so pressing Right on Ability 6 wraps to Ability 1. In the inventory grid, use `Escape` (automatic) for all four directions so the system finds the nearest item slot. For the character sheet tabs, set Left/Right to navigate between tabs and Down to enter the tab content. Use `Explicit` navigation to link the "End Turn" button directly to the first ability slot when pressing Left.
> - **Wizard's Chess**: Set up gamepad navigation on the 8x8 board grid: Up/Down/Left/Right moves between squares. Use `Stop` at board edges so the cursor does not leave the board. Set an explicit jump from the board to the "Resign" button when pressing a shoulder button. For the promotion dialog, use `Wrap` on the four piece options (Queen, Rook, Bishop, Knight) so navigation loops.

**Focus management:**
- `SetKeyboardFocus()`: Give focus to a widget
- `HasKeyboardFocus()`: Check if a widget has focus
- `SetUserFocus(PlayerController)`: Set focus for a specific player
- `bIsFocusable`: Property on widgets controlling whether they can receive focus

**Gamepad input mode:**
```cpp
// Switch to UI-only input
FInputModeUIOnly InputMode;
InputMode.SetWidgetToFocus(MyWidget->TakeWidget());
InputMode.SetLockMouseToViewportBehavior(EMouseLockMode::DoNotLock);
PlayerController->SetInputMode(InputMode);

// Switch to game and UI
FInputModeGameAndUI InputMode;
InputMode.SetWidgetToFocus(MyWidget->TakeWidget());
PlayerController->SetInputMode(InputMode);

// Switch back to game only
PlayerController->SetInputMode(FInputModeGameOnly());
```

**Show/hide mouse cursor:**
```cpp
PlayerController->bShowMouseCursor = true;  // Show
PlayerController->bShowMouseCursor = false; // Hide
```

> **In your games:**
> - **DnD RPG**: During exploration and real-time combat, use `FInputModeGameOnly` with the mouse cursor hidden so the player controls the camera freely. When opening the inventory, quest log, or character sheet, switch to `FInputModeGameAndUI` and show the cursor so the player can click UI elements while still seeing the game world behind the panel. For the pause menu and settings screen, use `FInputModeUIOnly` and show the cursor. During turn-based combat, use `FInputModeGameAndUI` since the player needs to click tiles on the grid and also interact with the ability hotbar. When the tabletop zoom transition plays, briefly set `FInputModeUIOnly` to prevent input during the cinematic.
> - **Wizard's Chess**: Use `FInputModeGameAndUI` as the default mode since the player needs both mouse clicks on the 3D board (game input for raycasts) and UI interaction (move list, buttons). Show the mouse cursor at all times. Switch to `FInputModeUIOnly` only for modal dialogs like promotion selection or the resign confirmation popup.

**Common UI focus management:**
- Override `GetDesiredFocusTarget()` on `UCommonActivatableWidget` subclasses
- The activation system automatically focuses the returned widget when the panel activates
- Supports focus restoration when returning to a previous widget in the stack
