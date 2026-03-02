# Task: Header Component

## Objective

Implement the Header component — a custom top bar layout element providing three slot areas (title, actions, user info) — following the project's 5-file component pattern.

## Deliverables

Create 5 new files under `packages/ui/src/components/header/`:

### 1. `header.tsx` — Component Implementation

- Render a `<header>` element with `data-slot="header"`
- Three flexbox regions:
  - **Left region** — renders `children` (typically a title or breadcrumb)
  - **Right region** — renders `actions` prop (`ReactNode`) for action buttons
  - **User info** — renders `userInfo` prop (`ReactNode`) for avatar/profile display
- When both `actions` and `userInfo` are provided, render a `Separator` component (from Milestone 1) with `orientation="vertical"` between them
- When only one of `actions` or `userInfo` is provided, do not render the Separator
- Support `asChild` via Radix `Slot` (`@radix-ui/react-slot`) for root element replacement
- Fixed height: `h-14` (3.5rem) with `px-4` horizontal padding
- Bottom border: `border-b border-border`
- Use `cn()` to merge className with CVA base styles

### 2. `header.styles.ts` — CVA Styles

- Define `headerVariants` using CVA with base styles: `flex items-center h-14 px-4 border-b border-border bg-background`
- No size or variant dimensions — single fixed height only
- Export `headerVariants`

### 3. `header.types.ts` — Type Definitions

- `HeaderProps` extending `React.ComponentProps<'header'>` with:
  - `actions?: React.ReactNode`
  - `userInfo?: React.ReactNode`
  - `asChild?: boolean`
- Use `import type` for type-only imports
- Include CVA `VariantProps<typeof headerVariants>` if applicable

### 4. `header.test.tsx` — Tests

- Smoke render test
- Slot rendering: verify `children`, `actions`, and `userInfo` all render correctly
- Separator logic: verify Separator renders when both `actions` and `userInfo` are provided
- Separator absence: verify Separator does NOT render when only one of `actions`/`userInfo` is provided
- `asChild` composition test
- `data-slot="header"` presence
- vitest-axe accessibility assertion
- Use `@testing-library/user-event` for any interaction tests

### 5. `header.stories.tsx` — Storybook Stories

- CSF3 format with `Meta` and `StoryObj` types
- Include `tags: ['autodocs']` in meta
- Stories: Default, WithActions, WithUserInfo, FullHeader (all slots populated showing separator), AsChild

## Dependencies

- **Milestone 1**: `Separator` component (used for vertical divider between actions and userInfo)
- **`@radix-ui/react-slot`**: Already installed; used for `asChild` support
- **`cn()` utility**: From `@components/utils`

## Implementation Constraints

- Follow the canonical Button component as the reference for the 5-file pattern
- React 19 ref-as-prop — do NOT use `forwardRef`
- Named exports only — no default exports
- Use `import type` for type-only imports
- All styling via Tailwind utility classes mapped to semantic CSS custom properties
- Use existing tokens only (`--background`, `--foreground`, `--border`) — no new tokens

## Verification Criteria

1. Header renders a `<header>` element with `data-slot="header"` and bottom border
2. Children appear in the left region, actions on the right, userInfo after a vertical Separator
3. Separator renders only when both `actions` and `userInfo` are provided
4. `asChild` replaces the root element correctly
5. All 5 files exist and follow the naming conventions
6. Tests pass with `pnpm test`
7. Stories render correctly in Storybook
