# Task: Avatar Group Component

## Objective

Implement the Avatar Group custom component following the 5-file pattern. Avatar Group is a pure layout component that renders a row of overlapping Avatars with negative margin stacking, right-to-left z-index ordering, and a configurable `max` prop with `+N` overflow indicator.

## Files to Create

- `packages/ui/src/components/avatar-group/avatar-group.types.ts` — Props type for AvatarGroup extending `React.ComponentProps<'div'>` with `{ max?: number }`. The `max` prop defaults to `undefined` (show all avatars). No `size` prop — the overflow indicator uses fixed `md` dimensions.
- `packages/ui/src/components/avatar-group/avatar-group.styles.ts` — Static string constants: `avatarGroupStyles` for the container (`flex items-center -space-x-3`), `avatarGroupOverflowStyles` for the +N indicator (`flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-background text-xs font-medium`). Overflow indicator dimensions are hardcoded to match Avatar's default `md` size (h-10 w-10).
- `packages/ui/src/components/avatar-group/avatar-group.tsx` — Implementation of AvatarGroup as a named export. The component wraps children in a `<div>` with `data-slot="avatar-group"`. Uses `React.Children.toArray` to count and slice children when `max` is provided. Each visible child is wrapped with a `<div>` applying `relative` positioning and descending `z-index` via inline `style={{ zIndex }}`. When children exceed `max`, a `+N` overflow indicator is appended with the lowest z-index.
- `packages/ui/src/components/avatar-group/avatar-group.test.tsx` — Test suite covering: smoke render with multiple avatars, renders all avatars when no `max` prop, limits visible avatars to `max` and shows +N overflow, overflow indicator displays correct count, z-index ordering (first child has highest z-index), `data-slot="avatar-group"` attribute, className merging, ref forwarding, and vitest-axe accessibility assertions.
- `packages/ui/src/components/avatar-group/avatar-group.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (3 avatars), MaxOverflow (6 avatars with max=3 showing +3), AllVisible (4 avatars with no max), SingleAvatar (edge case), ManyAvatars (10 avatars with max=5).

## Files to Modify

- `packages/ui/src/index.ts` — Export AvatarGroup, its type, and style constants.

## Key Implementation Details

- Custom component, no Radix dependency — pure layout `<div>` with flexbox.
- Right-to-left z-index stacking: first avatar has highest z-index (visually on top, leftmost). Each subsequent avatar is tucked behind using descending `z-index` values computed from `(total - index)`.
- Negative left margins (`-space-x-3`) create the overlapping effect.
- Overflow indicator uses fixed `md` dimensions (h-10 w-10), `bg-muted text-muted-foreground border-2 border-background`.
- No CVA variants — single visual treatment, styles exported as static string constants.

## Dependencies

- **Task 1 (Avatar)** must be complete — Avatar Group renders Avatar components, and its stories/tests depend on Avatar.
- **Existing dependencies**: `@components/utils` (cn helper).

## Verification Criteria

1. Avatar Group stacks avatars with negative left margins and right-to-left z-index ordering (first avatar on top, highest z-index).
2. Avatar Group respects the `max` prop, rendering only `max` avatars and appending a `+N` overflow indicator with the correct count.
3. Avatar Group renders all avatars when `max` is not provided.
4. Overflow indicator uses fixed `md` dimensions (h-10 w-10) — no `size` prop.
5. `data-slot="avatar-group"` attribute is present on the root element.
6. `pnpm typecheck` passes with zero TypeScript errors.
7. `pnpm test` passes for avatar-group tests including vitest-axe accessibility assertions.
8. Storybook stories render correctly with `tags: ['autodocs']`.
9. All exports are present in `packages/ui/src/index.ts`.
