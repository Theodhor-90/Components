# Task: Hover Card Component

## Objective

Implement the Hover Card compound component with HoverCardTrigger and HoverCardContent following the 5-file pattern. Hover Card wraps `@radix-ui/react-hover-card` for rich preview content on hover/focus with portal rendering and animation classes.

## Files to Create

- `packages/ui/src/components/hover-card/hover-card.types.ts` — Props types for HoverCard (extends `React.ComponentProps<typeof HoverCardPrimitive.Root>`), HoverCardTrigger (extends `React.ComponentProps<typeof HoverCardPrimitive.Trigger>` with `{ asChild?: boolean }`), and HoverCardContent (extends `React.ComponentProps<typeof HoverCardPrimitive.Content>`).
- `packages/ui/src/components/hover-card/hover-card.styles.ts` — Static string constant `hoverCardContentStyles` with `z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`.
- `packages/ui/src/components/hover-card/hover-card.tsx` — Implementation of HoverCard (re-export of `HoverCardPrimitive.Root`), HoverCardTrigger (wrapper around `HoverCardPrimitive.Trigger` with `asChild` support and `data-slot="hover-card-trigger"`), and HoverCardContent as named exports. HoverCardContent renders `HoverCardPrimitive.Portal` > `HoverCardPrimitive.Content` with `data-slot="hover-card-content"`, `align="center"` and `sideOffset={4}` as defaults, and styles merged via `cn()`.
- `packages/ui/src/components/hover-card/hover-card.test.tsx` — Test suite covering: smoke render with trigger and content, hover card content is hidden by default, hover card appears on pointer enter (using `userEvent.hover` with `waitFor`/fake timers), hover card dismisses on pointer leave, HoverCardContent applies `data-slot="hover-card-content"`, className merging on HoverCardContent, `sideOffset` and `align` default values, rich content renders inside hover card, and vitest-axe accessibility assertions.
- `packages/ui/src/components/hover-card/hover-card.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (hover card with user profile preview content), WithAvatar (hover card showing Avatar + name + description), LinkTrigger (hover card on an `<a>` element using `asChild`), CustomAlign (hover card with `align="start"`).

## Files to Modify

- `packages/ui/src/index.ts` — Export HoverCard, HoverCardTrigger, HoverCardContent, and their types.

## Key Implementation Details

- HoverCardContent includes the same `animate-in`/`animate-out` data-attribute Tailwind classes as Popover and Tooltip for consistent enter/exit animations across all overlay components.
- HoverCardContent applies `align="center"` and `sideOffset={4}` as defaults with consumer override support.
- No CVA variants — single visual style, styles exported as static string constants.
- HoverCardTrigger supports `asChild` for rendering on custom elements (e.g., `<a>` tags).

## Dependencies

- **New dependency**: `@radix-ui/react-hover-card` must be installed in `packages/ui/package.json`.
- **Existing dependencies**: `@radix-ui/react-slot`, `@components/utils` (cn helper).
- No dependency on Tasks 1, 2, 3, or 5 — can be implemented in parallel with them.
- Phase 1 of this milestone must be complete.

## Verification Criteria

1. Hover Card opens on pointer enter with a delay, renders rich content inside a popover-style portal surface, and closes on pointer leave.
2. HoverCardContent applies `align="center"` and `sideOffset={4}` as defaults with consumer override support.
3. HoverCardContent applies `data-slot="hover-card-content"`.
4. HoverCardTrigger supports `asChild` for custom trigger elements.
5. `pnpm typecheck` passes with zero TypeScript errors.
6. `pnpm test` passes for hover-card tests including vitest-axe accessibility assertions.
7. Storybook stories render correctly with `tags: ['autodocs']`.
8. All exports are present in `packages/ui/src/index.ts`.
