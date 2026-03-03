# Task: Avatar Component

## Objective

Implement the Avatar compound component with AvatarImage and AvatarFallback sub-components following the 5-file pattern. Avatar wraps `@radix-ui/react-avatar` using `AvatarRoot`, `AvatarImage`, and `AvatarFallback` primitives with CVA size variants.

## Files to Create

- `packages/ui/src/components/avatar/avatar.types.ts` — Props types for Avatar, AvatarImage, and AvatarFallback. Avatar extends `React.ComponentProps<typeof AvatarPrimitive.Root>` with `VariantProps<typeof avatarVariants>` (no `asChild` — Avatar root is a Radix container, not a leaf element). AvatarImage extends `React.ComponentProps<typeof AvatarPrimitive.Image>`. AvatarFallback extends `React.ComponentProps<typeof AvatarPrimitive.Fallback>`.
- `packages/ui/src/components/avatar/avatar.styles.ts` — CVA variant function `avatarVariants` with a `size` variant: `sm` (h-8 w-8 text-xs), `md` (h-10 w-10 text-sm, default), `lg` (h-12 w-12 text-base). Static string constants for `avatarImageStyles` (`aspect-square h-full w-full`) and `avatarFallbackStyles` (`flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground`).
- `packages/ui/src/components/avatar/avatar.tsx` — Implementation of Avatar, AvatarImage, and AvatarFallback as named exports. Avatar renders `AvatarPrimitive.Root` with `data-slot="avatar"`, applying `avatarVariants` merged with `cn()`. Base classes include `relative flex shrink-0 overflow-hidden rounded-full`. AvatarImage renders `AvatarPrimitive.Image` with `data-slot="avatar-image"`. AvatarFallback renders `AvatarPrimitive.Fallback` with `data-slot="avatar-fallback"`.
- `packages/ui/src/components/avatar/avatar.test.tsx` — Test suite covering: smoke render with image, smoke render with fallback only (no src), fallback renders when image is absent, `data-slot` attributes on all sub-components, className merging on Avatar/AvatarImage/AvatarFallback, size variant applies correct classes (`sm`, `md`, `lg`), ref forwarding, and vitest-axe accessibility assertions. Note: image loading behavior in jsdom may require mocking or testing fallback state directly since jsdom does not fire image load/error events.
- `packages/ui/src/components/avatar/avatar.stories.tsx` — Storybook CSF3 stories with `tags: ['autodocs']`. Stories: Default (avatar with image), Fallback (avatar without image showing initials), Sizes (sm, md, lg side by side), WithBrokenImage (avatar with invalid src showing fallback), CustomFallback (avatar with icon as fallback instead of text).

## Files to Modify

- `packages/ui/src/index.ts` — Export Avatar, AvatarImage, AvatarFallback, their types, and `avatarVariants`.

## Key Implementation Details

- AvatarFallback renders children directly — consumers pass initials (e.g., `"JD"`) or any ReactNode. The component applies `bg-muted text-muted-foreground` styling and centers content. It does not compute initials from a name.
- Single file for all sub-components: Avatar, AvatarImage, and AvatarFallback are all exported from `avatar.tsx` as a compound component (matching Card and Table patterns).
- Each sub-component gets its own `data-slot` value: `avatar`, `avatar-image`, `avatar-fallback`.
- No `asChild` on Avatar root — `AvatarPrimitive.Root` is a Radix container, not a leaf element.

## Dependencies

- **New dependency**: `@radix-ui/react-avatar` must be installed in `packages/ui/package.json`.
- **Existing dependencies**: `@radix-ui/react-slot`, `class-variance-authority`, `@components/utils` (cn helper).
- **Prior milestones**: Milestones 1-3 must be complete. Phase 1 of this milestone (Tables & Pagination) must be complete.
- No dependency on other tasks within this phase.

## Verification Criteria

1. Avatar displays AvatarImage when the image source is valid and falls back to AvatarFallback when the image is absent or fails to load.
2. Avatar supports `sm`, `md`, and `lg` size variants via `avatarVariants` CVA, with `md` as default.
3. All Avatar sub-components apply their respective `data-slot` attributes.
4. Avatar root does not support `asChild`.
5. `pnpm typecheck` passes with zero TypeScript errors.
6. `pnpm test` passes for avatar tests including vitest-axe accessibility assertions.
7. Storybook stories render correctly with `tags: ['autodocs']`.
8. All exports are present in `packages/ui/src/index.ts`.
