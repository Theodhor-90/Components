# Task: Tooltip Component

## Objective

Implement the Tooltip compound component with TooltipProvider, TooltipTrigger, and TooltipContent following the 5-file pattern. Tooltip wraps `@radix-ui/react-tooltip` with portal rendering, animation classes, and configurable delay.

## Files to Create

- `packages/ui/src/components/tooltip/tooltip.types.ts` — Props types for TooltipProvider (extends `React.ComponentProps<typeof TooltipPrimitive.Provider>`), Tooltip (extends `React.ComponentProps<typeof TooltipPrimitive.Root>`), TooltipTrigger (extends `React.ComponentProps<typeof TooltipPrimitive.Trigger>`), and TooltipContent (extends `React.ComponentProps<typeof TooltipPrimitive.Content>` with `{ asChild?: boolean }`).
- `packages/ui/src/components/tooltip/tooltip.styles.ts` — Static string constant `tooltipContentStyles` with `z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`.
- `packages/ui/src/components/tooltip/tooltip.tsx` — Implementation of TooltipProvider (re-export of `TooltipPrimitive.Provider`), Tooltip (re-export of `TooltipPrimitive.Root`), TooltipTrigger (re-export of `TooltipPrimitive.Trigger`), and TooltipContent as named exports. TooltipContent renders `TooltipPrimitive.Portal` > `TooltipPrimitive.Content` with `data-slot="tooltip-content"`, `sideOffset={4}` as default, and styles merged via `cn()`. Tooltip and TooltipTrigger are direct re-exports and do not need `data-slot`.
- `packages/ui/src/components/tooltip/tooltip.test.tsx` — Test suite covering: smoke render of Tooltip with trigger and content, tooltip content is hidden by default, tooltip appears on hover (using `userEvent.hover` + `waitFor` or `act` + fake timers), tooltip dismisses on pointer leave, TooltipContent applies `data-slot="tooltip-content"`, className merging on TooltipContent, `sideOffset` default value, and vitest-axe accessibility assertions. Note: tests must wrap components in `TooltipProvider` and may need `vi.useFakeTimers()` to control open delay.
- `packages/ui/src/components/tooltip/tooltip.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. All stories wrap in `TooltipProvider`. Stories: Default (tooltip on a button trigger), CustomDelay (tooltip with longer `delayDuration`), Positions (tooltips on top/right/bottom/left sides), RichContent (tooltip with formatted content), OnFocus (tooltip that opens on focus for keyboard users).

## Files to Modify

- `packages/ui/src/index.ts` — Export Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, and their types.

## Key Implementation Details

- TooltipProvider is a re-export of `TooltipPrimitive.Provider` and is part of the Tooltip file — it does **not** get its own 5-file pattern. It must wrap any tree using tooltips, providing shared delay configuration.
- TooltipContent renders inside a `TooltipPrimitive.Portal` with `sideOffset={4}` as a default prop.
- Animated fade-in/slide via Tailwind's `animate-in`/`animate-out` data-attribute classes matching the shadcn/ui pattern.
- No CVA variants — single visual style, styles exported as static string constants.

## Dependencies

- **New dependency**: `@radix-ui/react-tooltip` must be installed in `packages/ui/package.json`.
- **Existing dependencies**: `@radix-ui/react-slot`, `@components/utils` (cn helper).
- No dependency on Tasks 1, 2, 4, or 5 — can be implemented in parallel with them.
- Phase 1 of this milestone must be complete.

## Verification Criteria

1. Tooltip appears on hover and focus with a configurable delay via `delayDuration` on TooltipProvider or Tooltip root.
2. TooltipContent renders inside a portal with `sideOffset={4}` default and positions relative to its trigger.
3. Tooltip dismisses on pointer leave and Escape key (Radix handles Escape natively).
4. TooltipContent applies `data-slot="tooltip-content"`.
5. `pnpm typecheck` passes with zero TypeScript errors.
6. `pnpm test` passes for tooltip tests including vitest-axe accessibility assertions.
7. Storybook stories render correctly with `tags: ['autodocs']`.
8. All exports are present in `packages/ui/src/index.ts`.
