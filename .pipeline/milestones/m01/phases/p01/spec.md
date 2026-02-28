## Phase 1: Display Primitives

### Goal

Implement the six non-interactive visual components that form the static building blocks of any page layout. These components have no Radix dependencies (except Separator) and no complex state management, making them the simplest starting point for the milestone.

### Deliverables

1. **Separator** — shadcn port wrapping `@radix-ui/react-separator`. Horizontal or vertical visual divider.
2. **Badge** — shadcn port. Inline status label with `default`, `secondary`, `destructive`, and `outline` variants via CVA.
3. **Card** — shadcn port. Compound component with `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription` sub-components. Each sub-component gets its own `data-slot` value.
4. **Skeleton** — shadcn port. `animate-pulse` div for placeholder loading shapes. Accepts className for custom dimensions.
5. **Spinner** — custom component. Animated SVG loading indicator with `sm`, `md`, `lg` size variants via CVA.
6. **Alert** — shadcn port. Compound component with `Alert`, `AlertTitle`, `AlertDescription`. Supports `default` and `destructive` variants.

Each component must follow the 5-file pattern established by the Button reference: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`. Each component must be added to `packages/ui/src/index.ts`.

### Technical Decisions & Constraints

- All components follow the Button reference implementation's 5-file pattern
- React 19 conventions: ref-as-prop (no forwardRef), named exports only
- Use `data-slot="{name}"` on root elements; compound components use per-sub-component data-slot values
- Styling via Tailwind v4 utility classes with OKLCH semantic tokens from `globals.css`
- CVA (class-variance-authority) for variant management with `defaultVariants`
- `cn()` helper from `@components/utils` for className merging
- `asChild` + Radix `Slot` for polymorphic rendering on leaf components
- Tests must include vitest-axe accessibility assertions
- Stories must use CSF3 format with `tags: ['autodocs']`, one story per variant/size
- Separator wraps `@radix-ui/react-separator` (install required: `@radix-ui/react-separator`)
- Spinner is a custom component (no shadcn equivalent) — design API to be consistent with the library

### Dependencies on Prior Phases

None — this is the first phase of Milestone 1. It depends only on pre-existing monorepo scaffolding, the Button reference component, `@components/utils` (`cn()` helper), `@components/tokens`, `globals.css`, Storybook 8.5 configuration, and the Vitest + Testing Library + vitest-axe test infrastructure.
