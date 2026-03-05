## Themes and Customization

### Built-in Themes (VS 2026)

VS 2026 ships with a redesigned theme system. The classic Blue theme has been replaced with a family of tinted themes.

#### Base Themes
| Theme | Description |
|-------|-------------|
| Dark | Dark background, light text. Recommended for long sessions |
| Light | Light background, dark text. Traditional appearance |

#### Tinted Themes (11 New in VS 2026)
Subtle color accents applied onto Light or Dark backgrounds. These incorporate gentle hues that match your environment or mood. Specific tints include variations in blue, green, purple, red, orange, and more.

#### Extra Contrast Options
- Additional high-contrast options specifically for the editor
- Editor appearance can be set independently from the IDE theme
- Designed for accessibility and reduced eye strain

### Editor Appearance (New in VS 2026)

**Path: Tools > Options > Environment > General > Editor Appearance**

The editor theme can differ from the IDE chrome theme. This lets you have a dark IDE with a differently-tinted editor, for example.

### Font Settings

**Path: Tools > Options > Environment > Fonts and Colors**

| Property | Recommended Options |
|----------|-------------------|
| Font family | JetBrains Mono, Fira Code, Cascadia Code, Consolas |
| Size | 11-13pt depending on DPI |
| Ligatures | Fira Code and Cascadia Code support ligatures (!=, =>, <=, etc. render as single glyphs) |

Font settings persist across theme changes in VS 2026.

### Customizing Syntax Colors

In **Fonts and Colors**, you can customize the color of every syntax element:

| Display Item | What It Affects |
|-------------|----------------|
| Keyword | C++ keywords (int, class, if, return, etc.) |
| Comment | Comments (// and /* */) |
| String | String literals |
| Number | Numeric literals |
| Operator | Operators (+, -, *, /, etc.) |
| Preprocessor Keyword | #include, #define, #ifdef, etc. |
| Type | Type names (classes, structs, enums) |
| Function | Function and method names |
| Macro | Preprocessor macro names |
| Namespace | Namespace names |
| Parameter | Function parameters |
| Local Variable | Local variable names |
| Member Variable | Class member variables |
| Enum Member | Enumeration values |
| Code Completion (new) | How autocomplete suggestions appear |

### Toolbar Customization

**Tools > Customize > Toolbars**

- Add or remove buttons from any toolbar
- Create custom toolbars with your most-used commands
- Rearrange button order by dragging

---
