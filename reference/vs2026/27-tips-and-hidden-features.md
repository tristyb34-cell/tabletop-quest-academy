## Tips and Hidden Features

### 1. Ctrl+Click Navigation
Hold Ctrl and click any symbol to Go To Definition (same as F12 but faster with mouse).

### 2. Fast Scrolling (New in VS 2026)
Hold **Alt** while using the scroll wheel to scroll 5x faster through long files.

**Path: Tools > Options > Text Editor > Advanced > Touchpad and mouse wheel scrolling sensitivity**

### 3. Middle-Click Scroll (New in VS 2026)
Press the scroll wheel and move the mouse to scroll in any direction, like in a web browser.

**Path: Tools > Options > Text Editor > Advanced > Middle click to scroll**

### 4. Syntactic Line Compression (New in VS 2026)
Lines with only braces or symbols compress by 25%, making code denser without losing readability.

**Path: Tools > Options > Text Editor > Advanced > Compress lines that do not have any alphanumeric characters**

### 5. Copy Line Without Selecting
Press Ctrl+C with no selection to copy the entire current line. Same with Ctrl+X to cut.

### 6. Multi-Cursor Editing
Hold Ctrl+Alt and click to place multiple cursors. Type to edit all positions simultaneously. Also works with Alt+Shift+Arrow keys for column selection.

### 7. Peek Definition Chain
Press Alt+F12 to peek, then press Alt+F12 again inside the peek window to chain peeks. Navigate through complex call chains without ever leaving your file.

### 8. Quick Launch Any Command
Press Ctrl+Shift+P (new in VS 2026) to search for any command, setting, or feature by name. Faster than navigating menus.

### 9. Sticky Scroll for Context
Enable Sticky Scroll (Tools > Options > Text Editor > General) to pin class and function headers to the top of the editor while scrolling through long functions.

### 10. Track Active Item
Enable "Track Active Item in Solution Explorer" (Tools > Options > Projects and Solutions > General) to auto-highlight the current file in Solution Explorer.

### 11. Format on Paste
Enable "Automatically format when I paste" (Tools > Options > Text Editor > C/C++ > Formatting > General) to auto-format pasted code.

### 12. Scrollbar Map Mode
Set the scrollbar to "Map mode" (Tools > Options > Text Editor > All Languages > Scroll Bars) for a minimap preview of the entire file in the scrollbar.

### 13. Navigate Between Issues
Alt+PgDn and Alt+PgUp jump between errors and warnings in the current file without opening the Error List.

### 14. Duplicate Line
Ctrl+D duplicates the current line. Much faster than copy-paste for duplicating code.

### 15. Preview Tab
Single-click a file in Solution Explorer to open it in a preview tab (blue tab). Double-click or edit to promote it to a permanent tab. Reduces tab clutter when browsing files.

### 16. Clipboard Ring
Ctrl+Shift+V cycles through your clipboard history (last 20 items). Paste from earlier copies without losing your current clipboard.

### 17. Comment Tokens
Use `// TODO:`, `// HACK:`, `// UNDONE:`, `// NOTE:` in comments. View them all in the Task List (View > Task List or Ctrl+\\, T).

### 18. Regex in Find
Click the `.*` button in Find (Ctrl+F or Ctrl+Shift+F) to enable regular expression search. Full .NET regex syntax supported.

### 19. File Exclusions in Search (New in VS 2026)
Exclude files from Find in Files using glob patterns.

**Path: Tools > Options > Environment > Search > Exclude files from search results**

### 20. Settings as JSON (New in VS 2026)
The new Settings UI stores settings in a JSON file, making every change visible and trackable. Useful for version-controlling IDE settings.

### 21. Solution Filters (.slnf)
Create solution filter files that load only a subset of projects. Right-click projects > Unload, then File > Save As Solution Filter. Dramatically speeds up load time for large solutions.

### 22. Parallel Watch for Threads
When debugging multi-threaded code, use Parallel Watch (Debug > Windows > Parallel Watch) to see the same expression evaluated across all threads simultaneously. Essential for diagnosing race conditions.

### 23. Data Breakpoints in Watch
Right-click any variable in the Watch window and select "Break When Value Changes" to set a data breakpoint. The debugger pauses whenever anything modifies that memory. Maximum of 4 hardware data breakpoints on x64.

### 24. Debug.ListCallStack in Immediate
In the Immediate Window, type `Debug.ListCallStack` to print the call stack as text, which you can copy and share.

### 25. Export/Import Breakpoints
Save your breakpoint set to XML via the Breakpoints window toolbar. Import them later or share with teammates.

### 26. Conditional Compilation Visualization
Lines inside `#if 0` or `#ifdef` blocks that evaluate to false are grayed out, showing which code is actually being compiled for the current configuration.

### 27. EditorConfig Override
Place an `.editorconfig` file in any subdirectory to override formatting rules for just that directory. Useful when different parts of a project have different conventions.

### 28. Run Custom Tools from Tools Menu
**Tools > External Tools > Add** lets you add any command-line tool to the Tools menu. Pass the current file, line number, or project path as arguments.

### 29. Build Timing
Set MSBuild verbosity to Diagnostic (Tools > Options > Projects and Solutions > Build and Run) to see per-file compilation timing. Helps identify slow-to-compile translation units.

### 30. Window Layout Per Monitor
Save different window layouts for single-monitor and multi-monitor setups. Switch with Ctrl+Alt+1-4.

---
