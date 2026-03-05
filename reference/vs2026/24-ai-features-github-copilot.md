## AI Features (GitHub Copilot)

### Copilot Integration Overview

GitHub Copilot is deeply integrated into VS 2026 as a first-class feature.

### Inline Code Suggestions

As you type, Copilot suggests completions in gray/italic text:
- **Tab**: Accept the full suggestion
- **Ctrl+Right Arrow**: Accept word by word
- **Click**: Accept up to cursor position (new in VS 2026)
- **Esc**: Dismiss the suggestion
- **Alt+]** / **Alt+[**: Cycle through alternative suggestions

#### Settings

**Path: Tools > Options > GitHub > Copilot > Editor**

| Setting | Description |
|---------|-------------|
| Enable completions | Toggle inline suggestions on/off |
| Enable Adaptive Paste | Copilot adjusts pasted code to match context |

### Copilot Chat

A chat panel where you can ask Copilot questions about your code.

#### Slash Commands

| Command | Description |
|---------|-------------|
| /explain | Explain selected code |
| /fix | Suggest a fix for errors |
| /tests | Generate unit tests |
| /doc | Generate documentation comments |
| /optimize | Suggest performance optimizations |
| /generateInstructions | Generate repo-level custom instructions (new) |
| /savePrompt | Save reusable prompt from current thread (new) |

#### Context References

| Reference | Description |
|-----------|-------------|
| #file | Reference a specific file |
| #selection | Reference currently selected code |
| #solution | Reference the entire solution |
| #changes | Reference uncommitted Git changes (new in VS 2026) |
| #commit:hash | Reference a specific commit (new in VS 2026) |

#### Mention Commands (Agent-Style)

| Mention | Description |
|---------|-------------|
| @profiler | AI-powered performance analysis |
| @test | AI-assisted test generation |
| @BuildPerfCpp | C++ build performance analysis |
| @Modernize | C++ project modernization (update toolsets) |

### Context Menu Actions

Right-click selected code for Copilot actions:
- **Explain** : Explain what the code does
- **Optimize Selection** : Suggest performance improvements
- **Generate Comments** : Add documentation comments
- **Generate Tests** : Create unit tests for the selected code
- **Add to Chat** : Add selected code as context in Copilot Chat

### Adaptive Paste (New in VS 2026)

When you paste code, Copilot adapts it to match the current file context:
- Renames symbols to match local conventions
- Fixes type mismatches
- Adjusts formatting to match the file
- Can translate between languages (e.g., C++ to C#)

Trigger: Press **Tab** after pasting, or use **Shift+Alt+V**.

**Path: Tools > Options > GitHub > Copilot > Editor > Enable Adaptive Paste**

### Copilot Memories (New in VS 2026)

Teach Copilot your coding standards:
- Copilot detects preferences during chat and prompts you to save them
- **User level**: `%USERPROFILE%/copilot-instructions.md`
- **Repo level**: `/.github/copilot-instructions.md`

### "Did You Mean" Search (New in VS 2026)

Copilot-powered search suggestions in All-In-One Search (Ctrl+Shift+P):
- Corrects typos and fuzzy matches
- Works with public GitHub repositories

**Path: Tools > Options > GitHub > Copilot > Search > Enable 'Did You Mean' code search support**

### GitHub Cloud Agent (Preview, New in VS 2026)

Delegate repetitive tasks to an autonomous AI agent:
- UI cleanups, refactors, documentation updates, multi-file edits
- Agent drafts changes for your review
- Requires GitHub repository connection

**Enable: Copilot badge dropdown > Settings and Options > Coding Agent (Preview)**

### MCP (Model Context Protocol) Support (New in VS 2026)

| Feature | Description |
|---------|-------------|
| Enterprise MCP Governance | Allowlist policies for MCP servers |
| MCP Authentication Management | Unified credential management |
| MCP Server Instructions | View instructions shipped with servers |
| MCP Elicitations and Sampling | Support for user interactions from MCP servers |
| MCP Server Management UI | Configure and manage MCP servers |

---
