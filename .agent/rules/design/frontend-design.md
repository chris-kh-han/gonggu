---
trigger: always_on
glob: "**/*.{tsx,css,ts}"
description: "Rules for frontend design, styling, and component usage in the Gonggu Finder project."
---

# UI/UX & Design System Guidelines

This project follows a strict design system based on **Next.js 16**, **Tailwind CSS 4**, and **shadcn/ui**. All frontend changes must adhere to these rules.

## 1. Tech Stack & Configuration

-   **Framework:** Next.js 16 (App Router)
-   **Styling:** Tailwind CSS 4 (using CSS variables and `@theme` in `app/globals.css`)
-   **Components:** shadcn/ui (`new-york` style)
-   **Icons:** `lucide-react`
-   **Fonts:** `Geist Sans` (sans-serif), `Geist Mono` (monospace)

## 2. Color System

We use **OKLCH** color references via CSS variables.

### Primary Colors
-   **Primary:** Violet (`violet-500` equivalent).
    -   Light: `oklch(0.606 0.25 292.717)`
    -   Dark: `oklch(0.922 0 0)` (White/Bright in dark mode)
-   **Background:**
    -   Page: `slate-50` (`oklch(0.984 0.003 247.858)`) - **Not pure white**
    -   Card/Surface: White (`oklch(1 0 0)`)
-   **Text:**
    -   Foreground: `slate-900` (`oklch(0.208 0.042 265.755)`)
    -   Muted: `slate-500` (`oklch(0.446 0.03 256.802)`)

### Usage Rules
-   **DO NOT** Use hardcoded hex values (e.g., `#FFFFFF`). Always use Tailwind semantic classes like `bg-background`, `bg-card`, `text-primary`.
-   **Buttons:** Primary actions should use the violet primary color.
-   **Cards:** Use `bg-card` with `shadow-sm`.

## 3. Component Design

### Components (shadcn/ui)
-   Use existing components in `@/components/ui`.
-   If a new component is needed, generate it using shadcn/ui patterns or asking the user to install it.
-   **Style:** `new-york` (Clean, refined borders).

### Shapes & Spacing
-   **Border Radius:**
    -   Cards/Containers: `rounded-xl` (`0.625rem` / `10px` base radius)
    -   Buttons/Inputs: `rounded-lg`
-   **Shadows:** Use `shadow-sm` for cards to create subtle depth against the `slate-50` background.
-   **Spacing:**
    -   Default gap: `gap-4`
    -   Container padding: `px-4 py-6`

## 4. Layout & Responsive Design

-   **Mobile First:** Always design for mobile primarily.
    -   Default layout: Single column (stack).
    -   `md`/`lg`: Multi-column / Grid.
-   **Container:** Use a centered container strictly for main content phases.
    ```tsx
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Content */}
    </div>
    ```

## 5. Animation (Micro-interactions)
-   Use `tw-animate-css` or simple tailwind transitions.
-   **Hover Effects:** Add subtle hover states to interactive elements (e.g., `hover:opacity-90` or `transition-transform hover:-translate-y-0.5`).
-   **Transitions:** `duration-200 ease-in-out` is the standard for UI elements.

## 6. Button
For premium actions, use the **Liquid Glass Button** style.
Refer to [Button Guidelines](Button.md) for implementation details.

## 7. Card
Cards must unconditionally use the **Liquid Glass** style.
Refer to [Button Guidelines](Button.md) for the style implementation details.

## 8. CSS & Tailwind v4
-   Do **not** create a `tailwind.config.ts` unless absolutely necessary. Use `@theme` in `app/globals.css`.
-   Use the `@apply` directive sparsely; prefer utility classes directly in JSX.

## 9. Example: Standard Card
```tsx
<div className="rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
  style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
  }}
>
  <h3 className="font-semibold text-lg">{title}</h3>
  <p className="text-muted-foreground text-sm">{description}</p>
</div>
```
