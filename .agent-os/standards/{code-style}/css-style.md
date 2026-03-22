# CSS Style Guide

We always use the latest version of **Tailwind CSS** for all styling. Keep markup lean, compose utilities, and extract only truly repeatable recipes.

## Core Principles

- **Utilities-first**: Compose with Tailwind; add custom CSS only when utilities can't express it
- **Consistency > cleverness**: Prefer theme tokens over arbitrary values. If you repeat an arbitrary value, promote it into `theme.extend`
- **Accessible by default**: Visible focus states, adequate contrast, motion-sensitive transitions
- **Mobile-first**: Start at the smallest layout and scale up

### Multi-line CSS classes in markup

- We use a unique multi-line formatting style when writing Tailwind CSS classes in HTML markup and ERB tags, where the classes for each responsive size are written on their own dedicated line.
- The top-most line should be the smallest size (no responsive prefix). Each line below it should be the next responsive size up.
- Each line of CSS classes should be aligned vertically.
- focus and hover classes should be on their own additional dedicated lines.
- We implement one additional responsive breakpoint size called 'xs' which represents 400px.
- If there are any custom CSS classes being used, those should be included at the start of the first line.

## Tailwind Configuration

### Setup Conventions

- **Dark mode**: `class` strategy (toggle `.dark` at `<html>`)
- **Custom breakpoint**: `xs` at **400px**
- **Layering**: Shared component recipes in `@layer components`; project-wide micro-utilities in `@layer utilities`
- **Class sorting**: **Do not** auto-sort Tailwind classes; preserve our multiline order

```js
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    screens: { 
      xs: '400px', 
      sm: '640px', 
      md: '768px', 
      lg: '1024px', 
      xl: '1280px', 
      '2xl': '1536px' 
    },
    extend: {
      // add design tokens here (colors, spacing, radii, shadows, etc.)
    }
  }
}
```

## Multiline Classes in Markup

Use multiline class strings in HTML/JSX/ERB for readability and diff-friendliness.

### Formatting Rules

1. **Top line**: Unprefixed base styles (smallest size)
2. **State lines**: Each state variant (hover:, focus:, disabled:) on their own line
3. **Responsive lines**: In ascending order: `xs:` → `sm:` → `md:` → `lg:` → `xl:` → `2xl:`
4. **Dark variants**: `dark:` sits next to their related utility on the same line
5. **Custom classes**: If using any custom class, list it first on the first line
6. **Alignment**: Align subsequent lines vertically

### Recommended Per-Line Grouping (left → right)

`layout` → `spacing` → `typography` → `color` → `effects` → `transforms/animation`

### Example

```html
<div
  class="c-cta w-full rounded bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50
         hover:bg-gray-100 dark:hover:bg-gray-800 
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
         xs:p-6
         sm:p-8 sm:font-medium
         md:p-10 md:text-lg
         lg:p-12 lg:text-xl lg:font-semibold lg:w-3/5
         xl:p-14 xl:text-2xl
         2xl:p-16 2xl:text-3xl 2xl:font-bold 2xl:w-3/4"
>
  I'm a call-to-action!
</div>
```

## Variants & States

- **Focus states**: Prefer `focus-visible` over `focus` for keyboard-friendly rings
- **Dark mode**: Co-locate `dark:` with its light counterpart
- **Accessibility**: Use aria/data variants when meaningful (`aria-expanded:`, `data-[state=open]:`)

## shadcn/ui Components Integration

### When to Use shadcn/ui Components

Use shadcn/ui components for complex, interactive UI patterns that require:
- **Accessibility compliance**: Components with proper ARIA attributes and keyboard navigation
- **Complex state management**: Modals, dropdowns, date pickers, etc.
- **Consistent design system**: Pre-built components that follow design tokens
- **Time efficiency**: Avoid rebuilding common patterns from scratch

### Using the shadcn MCP Server

Leverage the **shadcn MCP server** to automatically add and configure components:

```bash
# Example: Adding a button component via MCP
# The MCP server will handle installation, configuration, and dependencies
```

### Integration Guidelines

1. **Preserve multiline formatting**: Apply our formatting rules to shadcn component props
2. **Extend with custom classes**: Add project-specific styling while maintaining component functionality
3. **Theme consistency**: Ensure shadcn theme tokens align with your Tailwind config

### Example: Formatted shadcn Component

```tsx
import { Button } from "@/components/ui/button"

<Button
  variant="default"
  size="lg"
  className="w-full rounded-lg bg-primary text-primary-foreground
             hover:bg-primary/90
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
             disabled:opacity-50 disabled:cursor-not-allowed
             xs:w-auto xs:px-8
             sm:px-12 sm:text-lg
             md:px-16 md:text-xl
             lg:px-20 lg:text-2xl"
>
  Get Started
</Button>
```

### Component Customization Strategy

```tsx
// Extend shadcn components with your styling system
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

interface CustomButtonProps extends ButtonProps {
  responsive?: boolean
}

const CustomButton = ({ className, responsive, ...props }: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        // Base shadcn styles remain intact
        responsive && [
          "w-full",
          "xs:w-auto xs:px-8",
          "sm:px-12 sm:text-lg", 
          "md:px-16 md:text-xl"
        ],
        className
      )}
      {...props}
    />
  )
}
```

## Component Extraction with @apply

Capture stable recipes (e.g., custom buttons) in `@layer components`. Keep highly variable layouts in markup.

```css
/* app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .c-btn-primary {
    @apply inline-flex items-center justify-center rounded px-4 py-2
           font-medium text-white bg-primary hover:bg-primary/90
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50;
  }
}
```

### shadcn MCP Server Best Practices

1. **Component Discovery**: Use MCP server to browse available components before building custom ones
2. **Automatic Setup**: Let MCP server handle component installation, dependencies, and configuration
3. **Theme Synchronization**: Ensure shadcn theme tokens are synced with your Tailwind config
4. **Version Management**: Use MCP server to keep components updated and maintain consistency

### Team Workflow Integration

```bash
# Typical workflow with shadcn MCP server
# 1. Check available components
# 2. Install via MCP server  
# 3. Apply team formatting conventions
# 4. Extend with project-specific styling
```

## Accessibility & Motion

- **Focus management**: Maintain visible focus; never remove outlines without a clear alternative
- **Motion sensitivity**: Respect `prefers-reduced-motion`; keep animations subtle/short and provide motion-safe paths
- **Contrast**: Choose theme tokens that meet AA contrast requirements

## Performance & Cleanliness

- **DOM structure**: Keep DOM shallow; avoid unnecessary wrappers
- **Arbitrary values**: Minimize arbitrary values; promote repeated ones into the theme
- **CSS output**: Safelist only what's required; keep the generated CSS lean

## When Custom CSS Is Appropriate

- Complex pseudo-elements (`::before`/`::after`) or keyframes
- Cross-component tokens/utilities (add to `theme.extend` or `@layer utilities`)

```css
@layer utilities {
  .u-safe-area {
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
             env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
}
```

## Common Patterns (Cheat Sheet)

### Layout Patterns

```html
<!-- Container -->
<div class="mx-auto w-full max-w-screen-lg px-4 
           sm:px-6 
           lg:px-8">
```

```html
<!-- Grid (cards) -->
<div class="grid grid-cols-1 gap-4 
           sm:grid-cols-2 
           lg:grid-cols-3">
```

### Component Patterns

```html
<!-- Card -->
<div class="rounded-lg border bg-white/70 p-4 shadow-sm 
           dark:border-white/10 dark:bg-black/20">
```

```html
<!-- Visually hidden -->
<span class="sr-only">Hidden text for screen readers</span>
```

### Button Patterns

```html
<!-- Primary Button -->
<button class="inline-flex items-center justify-center rounded px-4 py-2
               font-medium text-white bg-primary 
               hover:bg-primary/90
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
               disabled:opacity-50 disabled:cursor-not-allowed">
  Click me
</button>
```

## Responsive Breakpoints Reference

| Breakpoint | Min-width | Typical use |
|------------|-----------|-------------|
| `xs:`      | 400px     | Large mobile |
| `sm:`      | 640px     | Small tablet |
| `md:`      | 768px     | Tablet |
| `lg:`      | 1024px    | Laptop |
| `xl:`      | 1280px    | Desktop |
| `2xl:`     | 1536px    | Large desktop |

---