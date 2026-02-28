# Milestone 1: Foundation — Primitives & Feedback

## Goal

Deliver the core building blocks that every other component and every consumer app depends on. After this milestone, apps can build basic pages with cards, badges, alerts, dialogs, toasts, and popovers.

## Phases

### Phase 1: Display Primitives

Separator (shadcn port), Badge (shadcn port with default/secondary/destructive/outline variants), Card with sub-components CardHeader, CardContent, CardFooter, CardTitle, CardDescription (shadcn port), Skeleton (shadcn port, `animate-pulse` div), Spinner (custom, animated SVG in sm/md/lg sizes), Alert with AlertTitle and AlertDescription (shadcn port with default/destructive variants).

### Phase 2: Overlay Primitives

Dialog with DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose (shadcn port wrapping `@radix-ui/react-dialog`), Alert Dialog with matching sub-components (shadcn port wrapping `@radix-ui/react-alert-dialog`), Popover with PopoverTrigger and PopoverContent (shadcn port wrapping `@radix-ui/react-popover`), Sonner toast integration (shadcn port wrapping `sonner` library, theme-aware styling).

### Phase 3: Accessibility Primitives

Label (shadcn port wrapping `@radix-ui/react-label`), Visually Hidden (custom utility wrapping `@radix-ui/react-visually-hidden`), Collapsible with CollapsibleTrigger and CollapsibleContent (shadcn port wrapping `@radix-ui/react-collapsible`).

## Exit Criteria

1. All 13 components render correctly in Storybook with all variants documented
2. `pnpm test` passes with vitest-axe accessibility assertions for every component
3. `pnpm typecheck` passes with no errors
4. Dialog and Alert Dialog correctly trap focus and support ESC to close
5. Popover positions content relative to its trigger and closes on outside click
6. Sonner toast renders with theme-appropriate colors in both light and dark mode
7. All components are exported from `packages/ui/src/index.ts`
