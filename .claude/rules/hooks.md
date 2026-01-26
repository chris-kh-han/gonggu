# Hooks System

## Hook Types

- **PreToolUse**: Before tool execution (validation, parameter modification)
- **PostToolUse**: After tool execution (auto-format, checks)
- **Stop**: When session ends (final verification)

## Current Hooks (in ~/.claude/settings.json)

### PreToolUse
- **tmux reminder**: Suggests tmux for long-running commands (npm, pnpm, yarn, cargo, etc.)
- **git push review**: Opens Zed for review before push
- **doc blocker**: Warns about creation of .md/.txt files (reminder to ask user first)

### PostToolUse
- **PR creation**: Logs PR URL and GitHub Actions status
- **Prettier**: Auto-formats JS/TS files after edit
- **TypeScript check**: Runs tsc after editing .ts/.tsx files
- **console.log warning**: Warns about console.log in edited files

### Stop
- **console.log audit**: Checks all modified files for console.log before session ends

## Document File Creation Policy

Claude MUST follow this policy for `.md` and `.txt` files:

### Primary Protection (1st line of defense)
- **ALWAYS** use `AskUserQuestion` before creating ANY `.md` or `.txt` file
- No exceptions - even for README, docs, or explicitly mentioned files
- Clearly explain why the file is needed
- Only proceed if user explicitly approves

### Hook Behavior (2nd line of defense)
- PreToolUse hook shows warning but does NOT block
- Acts as safety net if `AskUserQuestion` was forgotten
- Allows file creation to proceed after warning

See `.claude/rules/doc-policy.md` for detailed guidelines.

## Home Directory File Modification Policy

**CRITICAL: NEVER modify files in `~/` without explicit user permission**

### Protected Files
- `~/.claude/settings.json` - Global Claude configuration
- `~/.bashrc`, `~/.zshrc`, `~/.profile` - Shell configurations
- `~/.gitconfig`, `~/.ssh/config` - Git and SSH settings
- Any file outside the project directory

### Required Process
1. **MUST** use `AskUserQuestion` before modifying ANY `~/` file
2. Explain what changes will be made and why
3. Wait for explicit approval
4. **NO EXCEPTIONS** - Even if user mentioned the file

### Why This Matters
- Home directory files affect the entire system, not just this project
- Changes persist across all projects and sessions
- User may have custom configurations that should not be overwritten
- Security and privacy implications

### Project vs Home Directory
- **Project files** (`.claude/rules/`, `README.md`, etc.) - Can be modified as part of normal work
- **Home directory files** (`~/.*`) - Require explicit permission every time

## Auto-Accept Permissions

Use with caution:
- Enable for trusted, well-defined plans
- Disable for exploratory work
- Never use dangerously-skip-permissions flag
- Configure `allowedTools` in `~/.claude.json` instead

## TodoWrite Best Practices

Use TodoWrite tool to:
- Track progress on multi-step tasks
- Verify understanding of instructions
- Enable real-time steering
- Show granular implementation steps

Todo list reveals:
- Out of order steps
- Missing items
- Extra unnecessary items
- Wrong granularity
- Misinterpreted requirements
