Now I have all the context needed. Let me compose the revised specification addressing every feedback issue.

# Phase 2: Identity & Hints — Specification

## Goal

Implement the Avatar, Avatar Group, Tooltip, Hover Card, and Progress components — the five data-display primitives that enable consumer apps to show user identity with image-loading fallback, render inline contextual hints on hover/focus, display rich preview cards, and indicate loading or completion progress with animated fill bars.

## Design Decisions

### Avatar

1. **Radix Avatar primitive with standard fallback pattern.** Avatar wraps `@radix-ui/react-avatar` using `AvatarRoot`, `AvatarImage`, and `AvatarFallback` primitives. AvatarImage handles image loading natively via Radix's built-in load detection. AvatarFallback renders immediately when no `src` is provided, or after the image `onerror` fires. This matches the shadcn/ui API surface exactly.

2. **CVA variants for size.** Avatar uses a CVA variant function (`avatarVariants`) with a `size` variant (`sm`, `md`, `lg`) that controls `h-*`, `w-*`, and text size for fallback initials. Default size is `md` (40×40). This supports Avatar Group's need to render consistently-sized avatars without per-instance className overrides.

3. **AvatarFallback renders children directly.** Consumers pass initials (e.g., `"JD"`) or any ReactNode as children to AvatarFallback. The component applies `bg-muted text-muted-foreground` styling and centers content. It does not compute initials from a name — that is consumer responsibility.

4. **Single file for all sub-components.** Avatar, AvatarImage, and AvatarFallback are all exported from `avatar.tsx` as a compound component, matching the Card and Table patterns. Each sub-component gets its own `data-slot` value: `avatar`, `avatar-image`, `avatar-fallback`.

5. **No `asChild` on Avatar root.** The shadcn/ui Avatar does not support `asChild` on the root component — `AvatarPrimitive.Root` is a Radix container, not a leaf element. Avatar's props extend only `React.ComponentProps<typeof AvatarPrimitive.Root>` with `VariantProps<typeof avatarVariants>`. No `asChild` is added.

### Avatar Group

6. **Custom component, no Radix dependency.** Avatar Group is a pure layout component that renders a `<div>` with `display: flex` and applies negative left margins (`-space-x-3`) on children after the first. It takes an array of Avatar-compatible `ReactNode` children, not structured data. Consumers render their own Avatar components as children.

7. **Right-to-left z-index stacking.** The first avatar has the highest z-index and appears visually on top (leftmost). Each subsequent avatar is tucked behind the previous one using descending `z-index` values computed from `(total - index)`. This matches left-to-right reading order where the first item is most prominent.

8. **`max` prop with overflow indicator.** When the number of children exceeds `max`, Avatar Group renders only the first `max` avatars and appends a `+N` overflow indicator styled as a circle matching Avatar's default `md` dimensions (h-10 w-10). The overflow indicator uses `bg-muted text-muted-foreground border-2 border-background` to visually distinguish it from real avatars. The overflow indicator always uses fixed `md` dimensions — there is no `size` prop on Avatar Group.

9. **No CVA variants.** Avatar Group has a single visual treatment. Styles are exported as static string constants, following the Table/Card pattern.

### Tooltip

10. **Radix Tooltip primitive with provider pattern.** Tooltip wraps `@radix-ui/react-tooltip` with TooltipProvider, Tooltip (root), TooltipTrigger, and TooltipContent. TooltipProvider is a re-export of Radix's provider and is part of the Tooltip file — it does **not** get its own 5-file pattern. It must wrap any tree using tooltips, providing shared delay configuration.

11. **TooltipContent gets portal + styling.** TooltipContent wraps Radix's `TooltipContent` inside a `TooltipPortal`, applying `bg-popover text-popover-foreground` styling with `rounded-md border px-3 py-1.5 text-sm shadow-md`. It includes `sideOffset={4}` as a default prop. An animated fade-in/slide is applied via Tailwind's `animate-in`/`animate-out` data-attribute classes matching the shadcn/ui pattern.

12. **No CVA variants for TooltipContent.** Tooltip has a single visual style. Styles are static string constants.

### Hover Card

13. **Radix Hover Card primitive for rich previews.** Hover Card wraps `@radix-ui/react-hover-card` with HoverCard (root), HoverCardTrigger, and HoverCardContent. HoverCardContent renders inside a portal with `bg-popover text-popover-foreground` styling, matching the Tooltip and Popover visual language.

14. **HoverCardContent includes animation classes.** Applies the same `animate-in`/`animate-out` data-attribute Tailwind classes as Popover and Tooltip for consistent enter/exit animations across all overlay components.

15. **No CVA variants.** Hover Card has a single visual style. Styles are static string constants.

### Progress

16. **Radix Progress primitive with CSS transition.** Progress wraps `@radix-ui/react-progress` using `ProgressRoot` and `ProgressIndicator`. The indicator's width is controlled via `translateX` transform driven by the `value` prop (0–100), matching the shadcn/ui implementation.

17. **CSS transition on transform.** The indicator uses `transition-all` for smooth animation when `value` changes. This balances visual smoothness with responsiveness. No JavaScript animation or requestAnimationFrame — pure CSS transition.

18. **No CVA variants.** Progress has a single visual treatment. The indicator uses `bg-primary` on a `bg-secondary` track. Styles are static string constants.

## Tasks

### Task 1: Avatar Component

Implement the Avatar compound component with AvatarImage and AvatarFallback sub-components following the 5-file pattern.

**Deliverables:**

- `packages/ui/src/components/avatar/avatar.types.ts` — Props types for Avatar, AvatarImage, and AvatarFallback. Avatar extends `React.ComponentProps<typeof AvatarPrimitive.Root>` with `VariantProps<typeof avatarVariants>` (no `asChild` — Avatar root is a Radix container, not a leaf element). AvatarImage extends `React.ComponentProps<typeof AvatarPrimitive.Image>`. AvatarFallback extends `React.ComponentProps<typeof AvatarPrimitive.Fallback>`.
- `packages/ui/src/components/avatar/avatar.styles.ts` — CVA variant function `avatarVariants` with a `size` variant: `sm` (h-8 w-8 text-xs), `md` (h-10 w-10 text-sm, default), `lg` (h-12 w-12 text-base). Static string constants for `avatarImageStyles` (`aspect-square h-full w-full`) and `avatarFallbackStyles` (`flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground`).
- `packages/ui/src/components/avatar/avatar.tsx` — Implementation of Avatar, AvatarImage, and AvatarFallback as named exports. Avatar renders `AvatarPrimitive.Root` with `data-slot="avatar"`, applying `avatarVariants` merged with `cn()`. The base classes include `relative flex shrink-0 overflow-hidden rounded-full`. AvatarImage renders `AvatarPrimitive.Image` with `data-slot="avatar-image"`. AvatarFallback renders `AvatarPrimitive.Fallback` with `data-slot="avatar-fallback"`.
- `packages/ui/src/components/avatar/avatar.test.tsx` — Test suite covering: smoke render with image, smoke render with fallback only (no src), fallback renders when image is absent, `data-slot` attributes on all sub-components, className merging on Avatar/AvatarImage/AvatarFallback, size variant applies correct classes (`sm`, `md`, `lg`), ref forwarding, and vitest-axe accessibility assertions. Note: image loading behavior in jsdom may require mocking or testing fallback state directly since jsdom does not fire image load/error events.
- `packages/ui/src/components/avatar/avatar.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (avatar with image), Fallback (avatar without image showing initials), Sizes (sm, md, lg side by side), WithBrokenImage (avatar with invalid src showing fallback), CustomFallback (avatar with icon as fallback instead of text).
- Export Avatar, AvatarImage, AvatarFallback, their types, and `avatarVariants` from `packages/ui/src/index.ts`.

### Task 2: Avatar Group Component

Implement the Avatar Group custom component following the 5-file pattern.

**Deliverables:**

- `packages/ui/src/components/avatar-group/avatar-group.types.ts` — Props type for AvatarGroup extending `React.ComponentProps<'div'>` with `{ max?: number }`. The `max` prop defaults to `undefined` (show all avatars). No `size` prop — the overflow indicator uses fixed `md` dimensions.
- `packages/ui/src/components/avatar-group/avatar-group.styles.ts` — Static string constants: `avatarGroupStyles` for the container (`flex items-center -space-x-3`), `avatarGroupOverflowStyles` for the +N indicator (`flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-background text-xs font-medium`). The overflow indicator dimensions are hardcoded to match Avatar's default `md` size (h-10 w-10).
- `packages/ui/src/components/avatar-group/avatar-group.tsx` — Implementation of AvatarGroup as a named export. The component wraps children in a `<div>` with `data-slot="avatar-group"`. It uses `React.Children.toArray` to count and slice children when `max` is provided. Each visible child is wrapped with a `<div>` applying `relative` positioning and descending `z-index` via inline `style={{ zIndex }}`. When children exceed `max`, a `+N` overflow indicator is appended with the lowest z-index.
- `packages/ui/src/components/avatar-group/avatar-group.test.tsx` — Test suite covering: smoke render with multiple avatars, renders all avatars when no `max` prop, limits visible avatars to `max` and shows +N overflow, overflow indicator displays correct count, z-index ordering (first child has highest z-index), `data-slot="avatar-group"` attribute, className merging, ref forwarding, and vitest-axe accessibility assertions.
- `packages/ui/src/components/avatar-group/avatar-group.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (3 avatars), MaxOverflow (6 avatars with max=3 showing +3), AllVisible (4 avatars with no max), SingleAvatar (edge case), ManyAvatars (10 avatars with max=5).
- Export AvatarGroup, its type, and style constants from `packages/ui/src/index.ts`.

### Task 3: Tooltip Component

Implement the Tooltip compound component with TooltipProvider, TooltipTrigger, and TooltipContent following the 5-file pattern.

**Deliverables:**

- `packages/ui/src/components/tooltip/tooltip.types.ts` — Props types for TooltipProvider (extends `React.ComponentProps<typeof TooltipPrimitive.Provider>`), Tooltip (extends `React.ComponentProps<typeof TooltipPrimitive.Root>`), TooltipTrigger (extends `React.ComponentProps<typeof TooltipPrimitive.Trigger>`), and TooltipContent (extends `React.ComponentProps<typeof TooltipPrimitive.Content>` with `{ asChild?: boolean }`).
- `packages/ui/src/components/tooltip/tooltip.styles.ts` — Static string constant `tooltipContentStyles` with `z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`.
- `packages/ui/src/components/tooltip/tooltip.tsx` — Implementation of TooltipProvider (re-export of `TooltipPrimitive.Provider`), Tooltip (re-export of `TooltipPrimitive.Root`), TooltipTrigger (re-export of `TooltipPrimitive.Trigger`), and TooltipContent as named exports. TooltipContent renders `TooltipPrimitive.Portal` > `TooltipPrimitive.Content` with `data-slot="tooltip-content"`, `sideOffset={4}` as default, and styles merged via `cn()`. Tooltip and TooltipTrigger are direct re-exports and do not need `data-slot`.
- `packages/ui/src/components/tooltip/tooltip.test.tsx` — Test suite covering: smoke render of Tooltip with trigger and content, tooltip content is hidden by default, tooltip appears on hover (using `userEvent.hover` + `waitFor` or `act` + fake timers), tooltip dismisses on pointer leave, TooltipContent applies `data-slot="tooltip-content"`, className merging on TooltipContent, `sideOffset` default value, and vitest-axe accessibility assertions. Note: tests must wrap components in `TooltipProvider` and may need `vi.useFakeTimers()` to control open delay.
- `packages/ui/src/components/tooltip/tooltip.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. All stories wrap in `TooltipProvider`. Stories: Default (tooltip on a button trigger), CustomDelay (tooltip with longer `delayDuration`), Positions (tooltips on top/right/bottom/left sides), RichContent (tooltip with formatted content), OnFocus (tooltip that opens on focus for keyboard users).
- Export Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, and their types from `packages/ui/src/index.ts`.

### Task 4: Hover Card Component

Implement the Hover Card compound component with HoverCardTrigger and HoverCardContent following the 5-file pattern.

**Deliverables:**

- `packages/ui/src/components/hover-card/hover-card.types.ts` — Props types for HoverCard (extends `React.ComponentProps<typeof HoverCardPrimitive.Root>`), HoverCardTrigger (extends `React.ComponentProps<typeof HoverCardPrimitive.Trigger>` with `{ asChild?: boolean }`), and HoverCardContent (extends `React.ComponentProps<typeof HoverCardPrimitive.Content>`).
- `packages/ui/src/components/hover-card/hover-card.styles.ts` — Static string constant `hoverCardContentStyles` with `z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`.
- `packages/ui/src/components/hover-card/hover-card.tsx` — Implementation of HoverCard (re-export of `HoverCardPrimitive.Root`), HoverCardTrigger (wrapper around `HoverCardPrimitive.Trigger` with `asChild` support and `data-slot="hover-card-trigger"`), and HoverCardContent as named exports. HoverCardContent renders `HoverCardPrimitive.Portal` > `HoverCardPrimitive.Content` with `data-slot="hover-card-content"`, `align="center"` and `sideOffset={4}` as defaults, and styles merged via `cn()`.
- `packages/ui/src/components/hover-card/hover-card.test.tsx` — Test suite covering: smoke render with trigger and content, hover card content is hidden by default, hover card appears on pointer enter (using `userEvent.hover` with `waitFor`/fake timers), hover card dismisses on pointer leave, HoverCardContent applies `data-slot="hover-card-content"`, className merging on HoverCardContent, `sideOffset` and `align` default values, rich content renders inside hover card, and vitest-axe accessibility assertions.
- `packages/ui/src/components/hover-card/hover-card.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (hover card with user profile preview content), WithAvatar (hover card showing Avatar + name + description), LinkTrigger (hover card on an `<a>` element using `asChild`), CustomAlign (hover card with `align="start"`).
- Export HoverCard, HoverCardTrigger, HoverCardContent, and their types from `packages/ui/src/index.ts`.

### Task 5: Progress Component

Implement the Progress component following the 5-file pattern.

**Deliverables:**

- `packages/ui/src/components/progress/progress.types.ts` — Props type for Progress extending `React.ComponentProps<typeof ProgressPrimitive.Root>`. The `value` prop is inherited from Radix and accepts a number 0–100. No additional custom props.
- `packages/ui/src/components/progress/progress.styles.ts` — Static string constants: `progressStyles` for the track (`relative h-4 w-full overflow-hidden rounded-full bg-secondary`) and `progressIndicatorStyles` for the fill bar (`h-full w-full flex-1 bg-primary transition-all`).
- `packages/ui/src/components/progress/progress.tsx` — Implementation of Progress as a named export. Renders `ProgressPrimitive.Root` with `data-slot="progress"` and track styles. Inside, renders `ProgressPrimitive.Indicator` with `data-slot="progress-indicator"` and indicator styles. The indicator's position is controlled via inline `style={{ transform: \`translateX(-${100 - (value || 0)}%)\` }}`, matching the shadcn/ui implementation.
- `packages/ui/src/components/progress/progress.test.tsx` — Test suite covering: smoke render with default value, renders indicator at correct position for value=0 (fully left/hidden), value=50 (half width), value=100 (full width), `data-slot` attributes on root and indicator, className merging, ref forwarding, `aria-valuenow` reflects value, `aria-valuemin` and `aria-valuemax` are set (Radix handles this), undefined value renders as 0%, and vitest-axe accessibility assertions.
- `packages/ui/src/components/progress/progress.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (progress at 60%), Empty (progress at 0%), Complete (progress at 100%), Animated (interactive story with a button that increments value to demonstrate transition), CustomColor (progress with overridden indicator color via className).
- Export Progress, its type, and style constants from `packages/ui/src/index.ts`.

### Task 6: Integration Verification

Verify all five components work correctly and all quality gates pass.

**Deliverables:**

- Install new Radix dependencies: `@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-hover-card`, `@radix-ui/react-progress`.
- Run `pnpm typecheck` — must pass with zero TypeScript errors.
- Run `pnpm test` — all Avatar, Avatar Group, Tooltip, Hover Card, and Progress tests must pass, including vitest-axe accessibility checks.
- Run `pnpm build` (if applicable) — the `@components/ui` package builds successfully with all new components included.
- Verify Storybook renders all five components correctly with all stories visible and interactive.
- Verify `packages/ui/src/index.ts` exports all new components, types, and style functions.

## Exit Criteria

1. Avatar displays AvatarImage when the image source is valid and falls back to AvatarFallback (consumer-provided initials or icon) when the image is absent or fails to load
2. Avatar supports `sm`, `md`, and `lg` size variants via `avatarVariants` CVA, with `md` as default
3. All Avatar sub-components apply their respective `data-slot` attributes (`avatar`, `avatar-image`, `avatar-fallback`)
4. Avatar root does not support `asChild` — it is a Radix container, not a leaf element
5. Avatar Group stacks avatars with negative left margins and right-to-left z-index ordering (first avatar on top, highest z-index)
6. Avatar Group respects the `max` prop, rendering only `max` avatars and appending a `+N` overflow indicator with the correct count when children exceed `max`
7. Avatar Group renders all avatars when `max` is not provided
8. Avatar Group's overflow indicator uses fixed `md` dimensions (h-10 w-10) — no `size` prop
9. Tooltip appears on hover and focus with a configurable delay via `delayDuration` on TooltipProvider or Tooltip root
10. TooltipContent renders inside a portal with `sideOffset={4}` default and positions relative to its trigger
11. Tooltip dismisses on pointer leave and Escape key (Radix handles Escape natively)
12. Hover Card opens on pointer enter with a delay, renders rich content inside a popover-style portal surface, and closes on pointer leave
13. HoverCardContent applies `align="center"` and `sideOffset={4}` as defaults with consumer override support
14. Progress bar renders an indicator whose position is controlled by `translateX` transform based on the `value` prop (0–100) with a smooth CSS transition
15. Progress renders `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes (provided by Radix) for screen reader accessibility
16. `pnpm typecheck` passes with zero TypeScript errors
17. `pnpm test` passes with zero failures, including vitest-axe accessibility assertions for all five components
18. All Storybook stories render correctly with `tags: ['autodocs']` generating documentation
19. All components and their types are exported from `packages/ui/src/index.ts`

## Dependencies

### Prior Milestones

- **Milestone 1 (Foundation)** — complete. Provides the 5-file component pattern, `asChild` via `@radix-ui/react-slot`, and foundational primitives.
- **Milestone 2 (Form Controls)** — complete. Provides controlled/uncontrolled state patterns and Input (architectural reference).
- **Milestone 3 (Layout & Navigation)** — complete. Provides all preceding components in the master plan.

### Within This Milestone

- **Phase 1 (Tables & Pagination)** — must be complete. Provides Table and Pagination components and establishes the Milestone 4 component patterns (static string styles for non-variant components, compound component exports).

### Within This Phase

- Task 1 (Avatar) must be complete before Task 2 (Avatar Group), as Avatar Group renders Avatar components and its stories/tests depend on Avatar.
- Tasks 3 (Tooltip), 4 (Hover Card), and 5 (Progress) have no inter-dependencies and can be implemented in parallel.
- Tasks 3, 4, and 5 have no dependency on Tasks 1 or 2 — they can begin as soon as Phase 1 is complete.
- Task 6 (Integration Verification) depends on Tasks 1–5 being complete.

### Infrastructure

- Monorepo build pipeline (`pnpm`, Turborepo, `tsc --build`) operational
- Storybook 8.5 running with Tailwind v4 and `@theme inline` mapping
- Vitest + Testing Library + vitest-axe test infrastructure operational
- `packages/ui/styles/globals.css` with all OKLCH semantic tokens defined

### New Dependencies to Install

- `@radix-ui/react-avatar` — Avatar component primitive
- `@radix-ui/react-tooltip` — Tooltip component primitive
- `@radix-ui/react-hover-card` — Hover Card component primitive
- `@radix-ui/react-progress` — Progress component primitive

### Existing Dependencies Used

- `@radix-ui/react-slot` — for `asChild` support on leaf components
- `class-variance-authority` — CVA variants for Avatar
- `@components/utils` — `cn()` helper for className merging

## Artifacts

| Artifact                                                           | Action | Description                                                                                                                    |
| ------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `packages/ui/src/components/avatar/avatar.types.ts`                | Create | Props types for Avatar, AvatarImage, and AvatarFallback                                                                        |
| `packages/ui/src/components/avatar/avatar.styles.ts`               | Create | CVA `avatarVariants` with size variant, static styles for image and fallback                                                   |
| `packages/ui/src/components/avatar/avatar.tsx`                     | Create | Implementation of Avatar, AvatarImage, and AvatarFallback                                                                      |
| `packages/ui/src/components/avatar/avatar.test.tsx`                | Create | Vitest + vitest-axe test suite                                                                                                 |
| `packages/ui/src/components/avatar/avatar.stories.tsx`             | Create | Storybook CSF3 stories with autodocs                                                                                           |
| `packages/ui/src/components/avatar-group/avatar-group.types.ts`    | Create | Props type for AvatarGroup with `max` prop (no `size` prop)                                                                    |
| `packages/ui/src/components/avatar-group/avatar-group.styles.ts`   | Create | Static string constants for container and overflow indicator (fixed `md` dimensions)                                           |
| `packages/ui/src/components/avatar-group/avatar-group.tsx`         | Create | Implementation with z-index stacking and overflow                                                                              |
| `packages/ui/src/components/avatar-group/avatar-group.test.tsx`    | Create | Vitest + vitest-axe test suite                                                                                                 |
| `packages/ui/src/components/avatar-group/avatar-group.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                                                           |
| `packages/ui/src/components/tooltip/tooltip.types.ts`              | Create | Props types for TooltipProvider, Tooltip, TooltipTrigger, TooltipContent                                                       |
| `packages/ui/src/components/tooltip/tooltip.styles.ts`             | Create | Static string constant for TooltipContent                                                                                      |
| `packages/ui/src/components/tooltip/tooltip.tsx`                   | Create | Implementation with portal, re-exports, and styled content                                                                     |
| `packages/ui/src/components/tooltip/tooltip.test.tsx`              | Create | Vitest + vitest-axe test suite with fake timers                                                                                |
| `packages/ui/src/components/tooltip/tooltip.stories.tsx`           | Create | Storybook CSF3 stories with autodocs                                                                                           |
| `packages/ui/src/components/hover-card/hover-card.types.ts`        | Create | Props types for HoverCard, HoverCardTrigger, HoverCardContent                                                                  |
| `packages/ui/src/components/hover-card/hover-card.styles.ts`       | Create | Static string constant for HoverCardContent                                                                                    |
| `packages/ui/src/components/hover-card/hover-card.tsx`             | Create | Implementation with portal, asChild trigger, and styled content                                                                |
| `packages/ui/src/components/hover-card/hover-card.test.tsx`        | Create | Vitest + vitest-axe test suite with fake timers                                                                                |
| `packages/ui/src/components/hover-card/hover-card.stories.tsx`     | Create | Storybook CSF3 stories with autodocs                                                                                           |
| `packages/ui/src/components/progress/progress.types.ts`            | Create | Props type for Progress with inherited `value` prop                                                                            |
| `packages/ui/src/components/progress/progress.styles.ts`           | Create | Static string constants for track and indicator                                                                                |
| `packages/ui/src/components/progress/progress.tsx`                 | Create | Implementation with translateX transform animation                                                                             |
| `packages/ui/src/components/progress/progress.test.tsx`            | Create | Vitest + vitest-axe test suite                                                                                                 |
| `packages/ui/src/components/progress/progress.stories.tsx`         | Create | Storybook CSF3 stories with autodocs                                                                                           |
| `packages/ui/src/index.ts`                                         | Modify | Add exports for all Avatar, Avatar Group, Tooltip, Hover Card, and Progress components and types                               |
| `packages/ui/package.json`                                         | Modify | Add `@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-hover-card`, `@radix-ui/react-progress` dependencies |
