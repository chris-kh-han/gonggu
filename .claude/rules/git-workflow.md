# Git Workflow

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

Note: Attribution disabled globally via ~/.claude/settings.json.

## Commit Guidelines

- Group commits by feature/domain (e.g., auth, badges, profile, rules)
- Do NOT bundle unrelated changes into a single commit
- Each commit should represent one logical change

## Pull Request Workflow

When creating PRs:
1. Analyze full commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

## PR Attribution

- Do NOT include "Generated with Claude Code" in PR descriptions
- Do NOT add any AI attribution or footer text
