## Task: Tabs component

### Objective

Implement the Tabs component — a shadcn/ui port wrapping `@radix-ui/react-tabs` that provides a tabbed interface with styled tab list, triggers, and content panels supporting both controlled and uncontrolled modes.

### Deliverables

Create the 5-file component directory at `packages/ui/src/components/tabs/`:

1. **`tabs.types.ts`** — Types for Tabs, TabsList, TabsTrigger, TabsContent. `TabsProps` extends `React.ComponentProps<typeof TabsPrimitive.Root>`. `TabsTriggerProps` extends `React.ComponentProps<typeof TabsPrimitive.Trigger>`.

2. **`tabs.styles.ts`** — `tabsListStyles` (inline-flex with muted background, rounded, padding), `tabsTriggerStyles` (inline-flex items-center, rounded-md, transition, `data-[state=active]` styling with bg-background and shadow), `tabsContentStyles` (margin-top, focus-visible ring).

3. **`tabs.tsx`** — Sub-components:
   - Tabs (re-export of `TabsPrimitive.Root`)
   - TabsList (styled list container)
   - TabsTrigger (styled trigger with active state)
   - TabsContent (styled content panel)
   - Each sub-component has a `data-slot` attribute
   - Supports controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`) modes via Radix's built-in API

4. **`tabs.test.tsx`** — Tests: smoke render with default tab selected, switching tabs via click, keyboard navigation (arrow keys between triggers, Enter/Space to activate), controlled mode with `value`/`onValueChange`, uncontrolled mode with `defaultValue`, only active TabsContent is visible, custom className merging, data-slot attributes, vitest-axe accessibility check.

5. **`tabs.stories.tsx`** — CSF3 stories: Default (3 tabs with content), Controlled, ManyTabs (overflow behavior), WithDisabledTab, WithIcons (tabs with icon + label). Meta includes `tags: ['autodocs']`.

Add exports to `packages/ui/src/index.ts`.

### Key Constraints

- Uses existing semantic tokens: `bg-muted`, `text-muted-foreground`, `bg-background` for tab styling
- Use `cn()` for className merging
- Named exports only, no default exports
- React 19 ref-as-prop (no forwardRef)
- Follow the established 5-file component pattern (study Button component as canonical reference)

### Dependencies

- Task t01 (Radix dependencies installed — `@radix-ui/react-tabs`)

### Verification

1. All test cases in `tabs.test.tsx` pass
2. vitest-axe reports no accessibility violations
3. Storybook renders all 5 stories with autodocs
4. Controlled and uncontrolled modes work correctly
5. Keyboard navigation works (arrow keys, Enter/Space)
6. `pnpm typecheck` passes
7. All exports present in `packages/ui/src/index.ts`
