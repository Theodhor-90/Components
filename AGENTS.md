# AGENTS.md — Components Library

## Project Overview

Reusable React component library built on shadcn/ui patterns, Radix UI, and Tailwind CSS v4.
Monorepo managed with Turborepo + pnpm. Developed primarily by AI agents.

**Package scope**: `@components/*`

## Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages (tokens → utils → hooks → ui)
pnpm test             # Run Vitest across all packages
pnpm test:coverage    # Run tests with coverage report
pnpm lint             # ESLint across all packages
pnpm format           # Prettier format all files
pnpm typecheck        # TypeScript type checking
pnpm storybook        # Launch Storybook on port 6006
pnpm clean            # Remove all dist/ and node_modules/
```

## Project Structure

```
apps/
  docs/                    # Storybook documentation site
  playground/              # Vite dev app for integration testing
packages/
  ui/                      # Core component library (@components/ui)
    src/components/        # All UI components (one directory per component)
    src/lib/               # Internal utilities (cn helper)
    styles/globals.css     # Tailwind v4 theme + CSS custom properties
  tokens/                  # Design tokens (@components/tokens)
    tokens/primitive/      # Raw color/spacing/typography values (DTCG format)
    tokens/semantic/       # Light/dark theme mappings
  hooks/                   # Shared React hooks (@components/hooks)
  utils/                   # Shared utilities (@components/utils)
  tsconfig/                # Shared TypeScript configs
  eslint-config/           # Shared ESLint flat config
```

## Code Style

- **Files**: kebab-case (`button.tsx`, `use-media-query.ts`)
- **Components**: PascalCase (`export function Button`)
- **Types**: PascalCase with Props suffix (`ButtonProps`)
- **Imports**: Always use `import type` for type-only imports
- **Exports**: Explicit named exports — no default exports, no barrel files
- **Ref handling**: React 19 ref-as-prop — never use `forwardRef`
- **Composition**: Use Radix `Slot` + `asChild` prop pattern
- **Variants**: CVA in separate `.styles.ts` files
- **Types**: Separate `.types.ts` files per component
- **Tests**: Co-located `.test.tsx` files per component
- **Stories**: Co-located `.stories.tsx` files per component

## Component File Pattern

Every component must have exactly 5 files:

```
packages/ui/src/components/{name}/
  {name}.tsx           # Implementation
  {name}.styles.ts     # CVA variant definitions
  {name}.types.ts      # TypeScript types
  {name}.test.tsx      # Vitest + Testing Library + axe-core tests
  {name}.stories.tsx   # Storybook CSF3 stories with autodocs tag
```

See `packages/ui/src/components/button/` as the canonical reference.

## Boundaries

### Always do

- Use semantic HTML elements
- Include `data-slot` attribute on the root element of every component
- Extend `React.ComponentProps<'element'>` for props (includes ref in React 19)
- Test accessibility with vitest-axe in every component test
- Support both controlled and uncontrolled modes for stateful components

### Ask first

- Adding new dependencies to any package
- Changing the public API of existing components
- Modifying shared configuration (turbo.json, tsconfig, eslint-config)
- Creating new packages in the monorepo

### Never do

- Use `any` type — use `unknown` and narrow instead
- Use `forwardRef` — use React 19 ref-as-prop
- Use default exports
- Use barrel files (index.ts re-exports) within packages
- Use inline styles instead of Tailwind classes
- Skip accessibility testing
- Commit .env files or secrets
