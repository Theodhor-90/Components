# Milestone 1: Foundation — Primitives & Feedback

## Goal

Deliver the 13 core UI building blocks — display components, overlay dialogs, toast notifications, and accessibility primitives — that every subsequent milestone and every consumer application depends on. Upon completion, the five Portfolio applications (Task Manager, Chess, Orchestrator, Iteration Engine, Scheduler) can build basic pages with cards, badges, alerts, dialogs, toasts, and popovers using shared, accessible, theme-aware components.

## Scope

- **6 Display Primitives**: Separator, Badge, Card (with CardHeader, CardContent, CardFooter, CardTitle, CardDescription), Skeleton, Spinner, Alert (with AlertTitle, AlertDescription)
- **4 Overlay Primitives**: Dialog (with DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose), Alert Dialog (with matching sub-components), Popover (with PopoverTrigger, PopoverContent), Sonner toast integration
- **3 Accessibility Primitives**: Label, Visually Hidden, Collapsible (with CollapsibleTrigger, CollapsibleContent)
- Vitest + vitest-axe test suite for each component (`.test.tsx`)
- Storybook CSF3 stories with autodocs for each component (`.stories.tsx`)
- CVA variant definitions for each component (`.styles.ts`)
- TypeScript type definitions for each component (`.types.ts`)
- Public API exports from `packages/ui/src/index.ts`

## Phases

### Phase 1: Display Primitives

Implement the six non-interactive visual components that form the static building blocks of any page layout. These components have no Radix dependencies (except Separator) and no complex state management, making them the simplest starting point.

**Components:**

1. **Separator** — shadcn port wrapping `@radix-ui/react-separator`. Horizontal or vertical visual divider.
2. **Badge** — shadcn port. Inline status label with `default`, `secondary`, `destructive`, and `outline` variants via CVA.
3. **Card** — shadcn port. Compound component with `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription` sub-components. Each sub-component gets its own `data-slot` value.
4. **Skeleton** — shadcn port. `animate-pulse` div for placeholder loading shapes. Accepts className for custom dimensions.
5. **Spinner** — custom component. Animated SVG loading indicator with `sm`, `md`, `lg` size variants via CVA.
6. **Alert** — shadcn port. Compound component with `Alert`, `AlertTitle`, `AlertDescription`. Supports `default` and `destructive` variants.

**Deliverables per component:** 5 files following the Button reference pattern (`{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`), plus export entry in `index.ts`.

### Phase 2: Overlay Primitives

Implement the four components that render floating or overlay content. These depend on Radix UI primitives for focus management, portal rendering, and dismiss behavior, and represent the most complex components in this milestone.

**Components:**

1. **Dialog** — shadcn port wrapping `@radix-ui/react-dialog`. Compound component with `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`. Includes focus trap, ESC to close, backdrop click to close, and portal rendering.
2. **Alert Dialog** — shadcn port wrapping `@radix-ui/react-alert-dialog`. Same sub-component structure as Dialog but with `AlertDialogAction` and `AlertDialogCancel` instead of generic close. Prevents backdrop dismiss for destructive confirmations.
3. **Popover** — shadcn port wrapping `@radix-ui/react-popover`. Compound component with `Popover`, `PopoverTrigger`, `PopoverContent`. Positions floating content relative to trigger with configurable `side` and `align` props. Closes on outside click and ESC.
4. **Sonner (Toast)** — shadcn port wrapping the `sonner` library. Theme-aware toast container (`Toaster` component) that reads semantic tokens for light/dark styling. Consumers call `toast()` function to trigger notifications.

**New dependencies to install:** `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-popover`, `sonner`.

### Phase 3: Accessibility Primitives

Implement the three components that provide foundational accessibility infrastructure used by form controls and interactive patterns in later milestones.

**Components:**

1. **Label** — shadcn port wrapping `@radix-ui/react-label`. Accessible form label with `htmlFor` binding. Used extensively by Form, Input, Checkbox, Switch, and other form controls in Milestone 2.
2. **Visually Hidden** — custom utility wrapping `@radix-ui/react-visually-hidden`. Renders content that is invisible visually but available to screen readers. Used for icon-only buttons and drag handles.
3. **Collapsible** — shadcn port wrapping `@radix-ui/react-collapsible`. Compound component with `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`. Primitive expand/collapse toggle. Simpler than Accordion (Milestone 3) and used as a building block by the Sidebar component (Milestone 3).

**New dependencies to install:** `@radix-ui/react-label`, `@radix-ui/react-visually-hidden`, `@radix-ui/react-collapsible`.

## Exit Criteria

1. All 13 components (Separator, Badge, Card, Skeleton, Spinner, Alert, Dialog, Alert Dialog, Popover, Sonner, Label, Visually Hidden, Collapsible) are implemented following the 5-file pattern established by the Button reference.
2. All 13 components render correctly in Storybook with all variants, sizes, and states documented via CSF3 stories with `tags: ['autodocs']`.
3. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for every component.
4. `pnpm typecheck` passes with zero errors across the entire monorepo.
5. Dialog and Alert Dialog correctly trap focus within the overlay and support ESC to close.
6. Popover positions content relative to its trigger element and closes on outside click and ESC.
7. Sonner toast renders with theme-appropriate colors in both light and dark mode, matching semantic tokens from `globals.css`.
8. All 13 components and their associated types and CVA variant functions are exported from `packages/ui/src/index.ts`.

## Dependencies

### Pre-existing (already in place)

- **Monorepo scaffolding** — pnpm workspace, Turborepo build pipeline, shared tsconfig and eslint-config packages
- **Button reference component** — canonical 5-file implementation to use as a template
- **`@components/utils`** — `cn()` helper (clsx + tailwind-merge)
- **`@components/hooks`** — shared React hooks
- **`@components/tokens`** — OKLCH design tokens and semantic theme definitions
- **`globals.css`** — complete light/dark theme with all semantic CSS custom properties
- **Storybook 8.5** — configured in `apps/docs/` with accessibility addon and theme switching
- **Vitest + Testing Library + vitest-axe** — test infrastructure configured in `packages/ui/`

### To be installed (per-phase)

- **Phase 1**: `@radix-ui/react-separator` (for Separator)
- **Phase 2**: `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-popover`, `sonner`
- **Phase 3**: `@radix-ui/react-label`, `@radix-ui/react-visually-hidden`, `@radix-ui/react-collapsible`

### External references

- shadcn/ui source code and documentation for each ported component's API surface and behavior
