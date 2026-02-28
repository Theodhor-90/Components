## Phase 2: Overlay Primitives

### Goal

Implement the four components that render floating or overlay content — dialogs, alert dialogs, popovers, and toast notifications. These depend on Radix UI primitives for focus management, portal rendering, and dismiss behavior, and represent the most complex components in Milestone 1.

### Deliverables

1. **Dialog** — shadcn port wrapping `@radix-ui/react-dialog`. Compound component with `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`. Includes focus trap, ESC to close, backdrop click to close, and portal rendering.
2. **Alert Dialog** — shadcn port wrapping `@radix-ui/react-alert-dialog`. Same sub-component structure as Dialog but with `AlertDialogAction` and `AlertDialogCancel` instead of generic close. Prevents backdrop dismiss for destructive confirmations.
3. **Popover** — shadcn port wrapping `@radix-ui/react-popover`. Compound component with `Popover`, `PopoverTrigger`, `PopoverContent`. Positions floating content relative to trigger with configurable `side` and `align` props. Closes on outside click and ESC.
4. **Sonner (Toast)** — shadcn port wrapping the `sonner` library. Theme-aware toast container (`Toaster` component) that reads semantic tokens for light/dark styling. Consumers call `toast()` function to trigger notifications.

Each component must follow the 5-file pattern: `{name}.tsx`, `{name}.styles.ts`, `{name}.types.ts`, `{name}.test.tsx`, `{name}.stories.tsx`. Each component must be added to `packages/ui/src/index.ts`.

### Technical Decisions & Constraints

- All components follow the Button reference implementation's 5-file pattern
- React 19 conventions: ref-as-prop (no forwardRef), named exports only
- Use `data-slot="{name}"` on root elements; compound components use per-sub-component data-slot values
- Styling via Tailwind v4 utility classes with OKLCH semantic tokens from `globals.css`
- CVA for variant management; `cn()` for className merging
- `asChild` + Radix `Slot` for polymorphic rendering on leaf components
- Dialog and Alert Dialog must correctly trap focus within the overlay and support ESC to close
- Popover must position content relative to its trigger element and close on outside click and ESC
- Sonner toast must render with theme-appropriate colors in both light and dark mode, matching semantic tokens
- New dependencies to install: `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-popover`, `sonner`
- Tests must include vitest-axe accessibility assertions
- Stories must use CSF3 format with `tags: ['autodocs']`

### Dependencies on Prior Phases

- **Phase 1 (Display Primitives)** — No direct component dependency, but Phase 1 establishes the working pattern and validates the 5-file structure. The overlay components are more complex (Radix wrappers, focus management, portals) and benefit from the simpler display components being completed first.
