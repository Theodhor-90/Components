## Goal

Implement components for displaying user identity (avatars), inline contextual hints (tooltips, hover cards), and progress indicators — enabling consumer apps to show user profiles, helpful hover content, and loading/progress states.

## Deliverables

- **Avatar** — shadcn port wrapping `@radix-ui/react-avatar` with AvatarImage and AvatarFallback sub-components. AvatarImage renders the user's image; AvatarFallback displays initials when the image fails to load or is absent.
- **Avatar Group** — custom component that renders a row of overlapping Avatars using negative margin stacking (`-ml-3` on each avatar after the first). Stacks with **right-to-left z-index** — first avatar has highest z-index and appears on top, each subsequent avatar is tucked behind. Accepts a `max` prop to cap visible avatars and renders a `+N` indicator (styled as a circular badge matching avatar dimensions) for overflow.
- **Tooltip** — shadcn port wrapping `@radix-ui/react-tooltip` with TooltipTrigger, TooltipContent, and TooltipProvider sub-components. Configurable open delay via `delayDuration`. TooltipProvider is exported as part of the Tooltip file — it is a Radix context provider, not a standalone 5-file component.
- **Hover Card** — shadcn port wrapping `@radix-ui/react-hover-card` with HoverCardTrigger and HoverCardContent for rich preview content on hover/focus.
- **Progress** — shadcn port wrapping `@radix-ui/react-progress` with an animated indicator bar whose width reflects the `value` prop (0–100) using a CSS `transition` on the `transform` property.
- Full Vitest + vitest-axe test suites and Storybook CSF3 stories with autodocs for all 5 components.
- All components exported from `packages/ui/src/index.ts`.

## Technical Constraints

- All components follow the 5-file pattern (except TooltipProvider which is part of Tooltip's file).
- All Radix-based components support controlled and uncontrolled usage.
- Avatar image loading in test environment: `@radix-ui/react-avatar` uses browser image loading which behaves differently in jsdom. Tests may need to mock image `onload`/`onerror` events.
- Tooltip/HoverCard hover timing in tests: must correctly simulate `pointerEnter`/`pointerLeave` and advance timers to trigger delayed open/close behavior.
- Progress animation: use CSS `transition` on transform with a `transition-duration` that balances smoothness with responsiveness for high-frequency updates.
- React 19 ref-as-prop — no `forwardRef`. Named exports only. `import type` for type-only imports.
- Use OKLCH semantic tokens for all styling.

## Dependencies

- **Phase 1 (Tables & Pagination)** of this milestone must be complete.
- **Milestones 1–3** must be complete — provides Button, Popover (architectural reference for Tooltip/HoverCard positioning), Badge, Card, Input, and established component patterns.
- **New npm dependencies to install**: `@radix-ui/react-avatar`, `@radix-ui/react-tooltip`, `@radix-ui/react-hover-card`, `@radix-ui/react-progress`.
- Existing dependencies: `@radix-ui/react-slot`, `class-variance-authority`, `@components/utils`.
