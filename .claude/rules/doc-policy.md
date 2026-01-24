# Document File Creation Policy

## Mandatory User Confirmation

Before creating ANY `.md` or `.txt` file:

1. **MUST** use `AskUserQuestion` to ask for permission
2. Clearly explain why the file is needed
3. Only proceed if user approves
4. **NO EXCEPTIONS** - Always ask, even if:
   - User mentioned the filename explicitly
   - It's a common file like README.md
   - It's in .claude/rules/ directory
   - You think it's obviously needed

## Why This Policy Exists

- Prevents unnecessary documentation proliferation
- Keeps codebase clean and focused
- User decides what documentation is valuable
- Avoids assumptions about what user wants

## Hook Behavior

PreToolUse hook will show warning but NOT block:
- Reminds to ask user permission first
- Acts as safety net if AskUserQuestion was forgotten
- Does not prevent file creation (warning only)

## Example Flow

```
User: "Add authentication feature"
Claude: [Uses AskUserQuestion]
        "Should I create a documentation file (e.g., docs/auth.md)
         to document the authentication implementation?"
User: "No, just implement it"
Claude: [Proceeds without creating docs]
```

```
User: "Create README.md"
Claude: [Uses AskUserQuestion]
        "You mentioned README.md. Should I create it with:
         - Project overview
         - Setup instructions
         - Usage examples?"
User: "Yes"
Claude: [Creates file, hook shows warning but allows]
```

## Implementation Checklist

- [ ] Always use AskUserQuestion before Write tool
- [ ] Explain what will be in the file
- [ ] Wait for explicit approval
- [ ] Never assume permission
