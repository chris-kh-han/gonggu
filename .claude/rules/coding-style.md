# Coding Style

## Documentation & Latest Syntax (CRITICAL)

### ALWAYS Use Latest Syntax
- **MUST** use Context7 MCP to verify latest framework/library syntax
- Check official docs via Context7 before writing code
- Next.js 16, React 19, etc. - always use current version patterns

### Context7 MCP Required
Before writing any framework-specific code:
1. Use Context7 MCP to fetch latest documentation
2. Verify syntax matches current version
3. **If Context7 unavailable or fails → STOP and notify user immediately**

### Examples of Version-Specific Code
\`\`\`typescript
// Next.js 16: Use proxy.ts, NOT middleware.ts
// React 19: Use new hooks patterns
// Always verify with Context7 first
\`\`\`

### When Context7 is Unavailable
- **MUST** inform user: "Context7 MCP not available, cannot verify latest syntax"
- **DO NOT** proceed with potentially outdated patterns
- Ask user for guidance or documentation links

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate:

\`\`\`javascript
// WRONG: Mutation
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}

// CORRECT: Immutability
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
\`\`\`

## File Organization

MANY SMALL FILES > FEW LARGE FILES:
- High cohesion, low coupling
- 200-400 lines typical, 800 max
- Extract utilities from large components
- Organize by feature/domain, not by type

## Error Handling

ALWAYS handle errors comprehensively:

\`\`\`typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
\`\`\`

## Input Validation

ALWAYS validate user input:

\`\`\`typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
\`\`\`

> **Note:** If Zod is not installed, ask the user: "Zod is required for input validation. Run `pnpm add zod`?"

## Code Quality Checklist

Before marking work complete:
- [ ] Code is readable and well-named
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] No mutation (immutable patterns used)
- [ ] Latest syntax verified via Context7 MCP