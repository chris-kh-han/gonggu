# Formatter Setup

## When to Use

Apply this setup when:
- Starting a new project
- Project lacks consistent code formatting
- User requests prettier integration

## Installation Steps

### 1. Check if Prettier is Installed

```bash
# Check package.json for prettier
cat package.json | grep prettier
```

### 2. Install Prettier (if needed)

Detect package manager and install:

```bash
# If pnpm-lock.yaml exists
pnpm add -D prettier prettier-plugin-tailwindcss

# If package-lock.json exists
npm install -D prettier prettier-plugin-tailwindcss

# If yarn.lock exists
yarn add -D prettier prettier-plugin-tailwindcss
```

### 3. Create Configuration Files

**`.prettierrc`** (project root):

```json
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "useTabs": false,
  "tabWidth": 2,
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "css",
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "singleAttributePerLine": false,
  "printWidth": 80,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**`.prettierignore`** (project root):

```
/node_modules
/build
/dist
*.log
*.min.js
.env
```

### 4. Add NPM Scripts (Optional)

Add to `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Verification

After setup, verify:

```bash
# Format all files
pnpm format

# Check formatting without modifying
pnpm format:check
```

## Integration with Hooks

Prettier can be triggered automatically via PostToolUse hooks configured in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "postToolUse": {
      "Edit": {
        "js,jsx,ts,tsx": "prettier --write {file}"
      }
    }
  }
}
```

This auto-formats files after editing.

## Notes

- **Tailwind Plugin**: Orders Tailwind classes automatically
- **EditorConfig**: Consider adding `.editorconfig` for editor consistency
- **Pre-commit**: Use `husky` + `lint-staged` for pre-commit formatting (optional)
- **Conflicts**: If ESLint formatting rules exist, remove them (prettier handles formatting)
