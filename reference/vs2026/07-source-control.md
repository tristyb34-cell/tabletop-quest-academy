## Source Control

### Tools > Options > Source Control

**Path: Tools > Options > Source Control**

| Setting | Description |
|---------|-------------|
| Current source control plug-in | Git (default), Perforce, or others |

### Git Settings

**Path: Tools > Options > Source Control > Git Global Settings / Git Repository Settings**

| Setting | Description |
|---------|-------------|
| Default location | Where new repos are created |
| User name | Git user.name |
| Email address | Git user.email |
| Default merge tool | VS built-in, or external (KDiff3, Beyond Compare, etc.) |
| Default diff tool | VS built-in, or external |
| Prune remote branches during fetch | Auto-clean deleted remote branches |
| Rebase local branch when pulling | Rebase instead of merge on pull |
| Enable push --force-with-lease | Allow force push with safety check |
| Push tags to remote | Auto-push tags with commits |
| Open folder in Solution Explorer when opening a repository | Auto-open folder view |
| Automatically download Git LFS content | Pull LFS files automatically |
| Commit changes after merge by default | Auto-commit after merge |

### Git Features in VS 2026

#### Git Changes Window (Ctrl+0, Ctrl+G)
- Stage and unstage individual files or hunks
- Write commit messages with AI-generated suggestions (Copilot)
- Commit, push, pull, and sync
- View diffs inline
- Amend previous commit
- Stash changes with descriptive notes

#### Git Repository Window (Ctrl+0, Ctrl+R)
- Branch management: create, delete, rename, checkout
- View commit history with graph
- Compare branches
- Cherry-pick commits
- Merge and rebase operations
- View and manage remotes
- Tag management

#### New in VS 2026
- **AI-Generated Commit Messages**: Copilot generates messages matching team conventions and linking DevOps tickets
- **Smart Branch Cleanup**: Identifies merged and stale branches, suggests cleanup
- **Branch Health Indicators**: Visual cues showing branches behind main, with conflicts, or needing attention
- **Protected Branch Warnings**: Clear indicators when working on protected branches
- **Three-Way Merge Editor**: Improved conflict resolution with base, local, and remote views
- **Git Hooks GUI**: Manage pre-commit, pre-push, and other hooks from the IDE
- **Scalar Integration**: Built-in support for Microsoft's Scalar tool for massive repositories
- **Copilot Chat Integration**: Reference `#changes` and `#commit:` in Copilot Chat to ask about your changes
- **Copilot Code Review**: Pre-commit diff analysis for issues
- **Inline PR Comments**: Markdown-rendered threaded comments in diffs
- **In-IDE PR Creation**: Generate pull requests directly with auto-selected reviewers and AI-generated descriptions
- **Force Push Support**: Available for patchset-style workflows

### Blame and History
- **Right-click any line > Git > Blame** : See who last modified each line
- **Right-click any file > Git > View History** : Full commit history for that file
- **Timeline view** : Shows changes over time in the editor gutter

---
