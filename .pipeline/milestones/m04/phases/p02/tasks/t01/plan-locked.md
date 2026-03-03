Now I have all the context needed. Let me produce the detailed implementation plan.

# Task Plan: Avatar Component (m04/p02/t01)

## 1. Deliverables

| #   | File                                                   | Action | Purpose                                                                                       |
| --- | ------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/avatar/avatar.types.ts`    | Create | Props types for Avatar, AvatarImage, and AvatarFallback                                       |
| 2   | `packages/ui/src/components/avatar/avatar.styles.ts`   | Create | CVA `avatarVariants` with size variant; static string constants for image and fallback styles |
| 3   | `packages/ui/src/components/avatar/avatar.tsx`         | Create | Implementation of Avatar, AvatarImage, and AvatarFallback compound component                  |
| 4   | `packages/ui/src/components/avatar/avatar.test.tsx`    | Create | Vitest + Testing Library + vitest-axe test suite                                              |
| 5   | `packages/ui/src/components/avatar/avatar.stories.tsx` | Create | Storybook CSF3 stories with `tags: ['autodocs']`                                              |
| 6   | `packages/ui/src/index.ts`                             | Modify | Add Avatar, AvatarImage, AvatarFallback, types, and `avatarVariants` exports                  |
| 7   | `packages/ui/package.json`                             | Modify | Add `@radix-ui/react-avatar` dependency                                                       |

## 2. Dependencies

### New Dependency to Install

- `@radix-ui/react-avatar` — Radix primitive for Avatar with image-loading fallback behavior. Install via: `pnpm --filter @components/ui add @radix-ui/react-avatar`

### Existing Dependencies Used

- `@radix-ui/react-slot` — already installed (used project-wide for `asChild`)
- `class-variance-authority` — already installed (CVA for size variants)
- `@components/utils` — already installed (`cn()` helper via `../../lib/utils.js`)

### Prior Work Prerequisites

- Milestones 1–3 complete (all foundational, form, and layout components exist)
- Phase 1 of Milestone 4 complete (Table and Pagination components exist, establishing the M4 compound component patterns)

## 3. Implementation Details

### 3.1 `avatar.types.ts`

**Purpose**: Define TypeScript prop types for all three sub-components.

**Exports**:

- `AvatarProps` — extends `React.ComponentProps<typeof AvatarPrimitive.Root>` intersected with `VariantProps<typeof avatarVariants>`. No `asChild` prop (Avatar root is a Radix container, not a leaf element).
- `AvatarImageProps` — extends `React.ComponentProps<typeof AvatarPrimitive.Image>`.
- `AvatarFallbackProps` — extends `React.ComponentProps<typeof AvatarPrimitive.Fallback>`.

**Key detail**: The import of `AvatarPrimitive` must use `import type * as AvatarPrimitive from '@radix-ui/react-avatar'` (type-only namespace import), matching the Popover pattern.

```typescript
import type * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { VariantProps } from 'class-variance-authority';

import type { avatarVariants } from './avatar.styles.js';

export type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>;

export type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>;

export type AvatarFallbackProps = React.ComponentProps<typeof AvatarPrimitive.Fallback>;
```

### 3.2 `avatar.styles.ts`

**Purpose**: CVA variant function for Avatar root sizing, plus static style strings for sub-components.

**Exports**:

- `avatarVariants` — CVA function with a `size` variant:
  - `sm`: `'h-8 w-8 text-xs'`
  - `md`: `'h-10 w-10 text-sm'` (default)
  - `lg`: `'h-12 w-12 text-base'`
  - Base classes: `'relative flex shrink-0 overflow-hidden rounded-full'`
- `avatarImageStyles` — static string: `'aspect-square h-full w-full'`
- `avatarFallbackStyles` — static string: `'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground'`

```typescript
import { cva } from 'class-variance-authority';

export const avatarVariants = cva('relative flex shrink-0 overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const avatarImageStyles = 'aspect-square h-full w-full';

export const avatarFallbackStyles =
  'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground';
```

### 3.3 `avatar.tsx`

**Purpose**: Implementation of the three compound sub-components.

**Exports**: `Avatar`, `AvatarImage`, `AvatarFallback`, and re-exports of all three prop types.

**Key logic**:

- `Avatar` renders `AvatarPrimitive.Root` with `data-slot="avatar"`, applying `avatarVariants({ size, className })` via `cn()`. Destructures `size` and `className` from props, spreads the rest including `ref`.
- `AvatarImage` renders `AvatarPrimitive.Image` with `data-slot="avatar-image"`, merging `avatarImageStyles` with `className` via `cn()`.
- `AvatarFallback` renders `AvatarPrimitive.Fallback` with `data-slot="avatar-fallback"`, merging `avatarFallbackStyles` with `className` via `cn()`.

**Pattern reference**: Follows the Popover pattern for Radix wrapper components — `import * as AvatarPrimitive from '@radix-ui/react-avatar'` (runtime import, not type-only here). Sub-components are individual functions, not `const` re-exports of Radix primitives, since each applies styling and `data-slot`.

```typescript
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '../../lib/utils.js';
import { avatarFallbackStyles, avatarImageStyles, avatarVariants } from './avatar.styles.js';
import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './avatar.types.js';

export type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './avatar.types.js';

export function Avatar({
  className,
  size,
  ref,
  ...props
}: AvatarProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ref,
  ...props
}: AvatarImageProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(avatarImageStyles, className)}
      ref={ref}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ref,
  ...props
}: AvatarFallbackProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackStyles, className)}
      ref={ref}
      {...props}
    />
  );
}
```

### 3.4 `avatar.test.tsx`

**Purpose**: Comprehensive test suite following established patterns.

**Test setup**: Standard imports — `render`, `screen` from `@testing-library/react`, `axe` from `vitest-axe`, `describe`, `expect`, `it` from `vitest`, `createRef` from `react`.

**Important jsdom consideration**: `@radix-ui/react-avatar` uses browser `Image` to detect load/error events. In jsdom, images don't actually load, so `AvatarFallback` with `delayMs={undefined}` (the default, which means "wait for image status") may or may not render depending on Radix's internal behavior. The safest approach is:

- Test fallback rendering by omitting the `src` prop on `AvatarImage` entirely, or by not rendering `AvatarImage` at all — Radix shows fallback immediately when no image is present.
- Test image rendering structurally (verify the `<img>` element is in the DOM with correct `src`).
- Do NOT rely on image load/error events in jsdom.

**Tests**:

1. **Smoke render with fallback** — Render `<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>`, assert "JD" text is in the document.
2. **Smoke render with image** — Render `<Avatar><AvatarImage src="/photo.jpg" alt="User" /><AvatarFallback>JD</AvatarFallback></Avatar>`, assert the `<img>` element is present with correct `src` and `alt`.
3. **Fallback renders when no AvatarImage** — Render `<Avatar><AvatarFallback>AB</AvatarFallback></Avatar>`, assert "AB" is visible.
4. **data-slot on Avatar** — Assert `data-slot="avatar"` on the root element.
5. **data-slot on AvatarImage** — Assert `data-slot="avatar-image"` on the image element.
6. **data-slot on AvatarFallback** — Assert `data-slot="avatar-fallback"` on the fallback element.
7. **className merging on Avatar** — Render with `className="custom-class"`, assert root has both `custom-class` and base classes (`overflow-hidden`, `rounded-full`).
8. **className merging on AvatarImage** — Render with `className="custom-img"`, assert image has both `custom-img` and `aspect-square`.
9. **className merging on AvatarFallback** — Render with `className="custom-fb"`, assert fallback has both `custom-fb` and `bg-muted`.
10. **Size variant sm** — Render with `size="sm"`, assert root has `h-8` and `w-8`.
11. **Size variant md (default)** — Render without size prop, assert root has `h-10` and `w-10`.
12. **Size variant lg** — Render with `size="lg"`, assert root has `h-12` and `w-12`.
13. **Ref forwarding on Avatar** — Use `createRef<HTMLSpanElement>()`, assert `ref.current` is an instance of `HTMLSpanElement` (Radix Avatar.Root renders a `<span>`).
14. **Accessibility — no violations** — Render an Avatar with fallback, run `axe(container)`, assert `toHaveNoViolations()`. Use an `img` with `alt` or a fallback with `role="img"` + `aria-label` if needed to satisfy axe.

### 3.5 `avatar.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs.

**Meta config**:

```typescript
const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};
```

**Stories**:

1. **Default** — Avatar with an image `src` (use a placeholder like `https://github.com/shadcn.png`) and fallback "CN".
2. **Fallback** — Avatar without an image, showing initials "JD".
3. **Sizes** — Three avatars side-by-side at `sm`, `md`, `lg` using a render function.
4. **WithBrokenImage** — Avatar with `src="/invalid-image.jpg"` showing fallback "BK".
5. **CustomFallback** — Avatar with an inline SVG icon as the fallback child instead of text.

### 3.6 `packages/ui/src/index.ts` (Modification)

**Purpose**: Add public API exports for the Avatar component.

**Lines to add** (after the Pagination exports block, maintaining alphabetical-ish order by milestone/phase):

```typescript
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  type AvatarProps,
  type AvatarImageProps,
  type AvatarFallbackProps,
} from './components/avatar/avatar.js';
export { avatarVariants } from './components/avatar/avatar.styles.js';
```

### 3.7 `packages/ui/package.json` (Modification)

**Purpose**: Add `@radix-ui/react-avatar` to runtime dependencies.

**Change**: Add `"@radix-ui/react-avatar": "^1.1.6"` to the `dependencies` object (version aligned with existing Radix packages; use whatever pnpm resolves).

## 4. API Contracts

### Avatar Component API

```typescript
// Props
type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'sm' | 'md' | 'lg' | null; // default: 'md'
};

type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>;
// Includes: src, alt, onLoadingStatusChange, className, ref, etc.

type AvatarFallbackProps = React.ComponentProps<typeof AvatarPrimitive.Fallback>;
// Includes: delayMs, children (ReactNode), className, ref, etc.
```

### Usage Example

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui';

// With image
<Avatar size="lg">
  <AvatarImage src="/user-photo.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Fallback only
<Avatar size="sm">
  <AvatarFallback>AB</AvatarFallback>
</Avatar>

// Custom className
<Avatar className="border-2 border-primary">
  <AvatarImage src="/photo.jpg" alt="User" />
  <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
</Avatar>
```

### CVA Variants Export

```typescript
import { avatarVariants } from '@components/ui';

// Use in custom components that need avatar-consistent sizing
const classes = avatarVariants({ size: 'lg' });
// → 'relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 text-base'
```

## 5. Test Plan

### Test Environment

- **Runner**: Vitest with jsdom environment
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Setup**: `src/test-setup.ts` already configures jest-dom matchers, vitest-axe matchers, cleanup, and jsdom stubs (ResizeObserver, pointer capture)

### jsdom Limitation Strategy

Radix Avatar uses browser `Image` to detect load/error. jsdom doesn't fire these events. Strategy:

- Test fallback by rendering `<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>` (no AvatarImage) — Radix shows fallback immediately.
- Test image presence structurally via `document.querySelector('img')` or `getByRole('img')`.
- Do NOT test the load→fallback transition in jsdom; that's a Radix internal concern.

### Test Specifications

| #   | Test Name                                      | Category   | Assertion                                                      |
| --- | ---------------------------------------------- | ---------- | -------------------------------------------------------------- |
| 1   | renders fallback text                          | Smoke      | `screen.getByText('JD')` is in document                        |
| 2   | renders image element                          | Smoke      | `<img>` with `src="/photo.jpg"` and `alt="User"` exists in DOM |
| 3   | shows fallback when no AvatarImage present     | Behavior   | `screen.getByText('AB')` is visible                            |
| 4   | Avatar has data-slot="avatar"                  | Convention | Root element has `data-slot` attribute `"avatar"`              |
| 5   | AvatarImage has data-slot="avatar-image"       | Convention | Image element has `data-slot` attribute `"avatar-image"`       |
| 6   | AvatarFallback has data-slot="avatar-fallback" | Convention | Fallback element has `data-slot` attribute `"avatar-fallback"` |
| 7   | Avatar merges custom className                 | Styling    | Root has both `custom-class` and `overflow-hidden`             |
| 8   | AvatarImage merges custom className            | Styling    | Image has both `custom-img` and `aspect-square`                |
| 9   | AvatarFallback merges custom className         | Styling    | Fallback has both `custom-fb` and `bg-muted`                   |
| 10  | applies sm size classes                        | Variant    | Root has `h-8` and `w-8`                                       |
| 11  | applies default md size classes                | Variant    | Root has `h-10` and `w-10` (no size prop passed)               |
| 12  | applies lg size classes                        | Variant    | Root has `h-12` and `w-12`                                     |
| 13  | forwards ref to root element                   | Ref        | `ref.current` is `HTMLSpanElement` with `data-slot="avatar"`   |
| 14  | has no accessibility violations                | A11y       | `axe(container)` returns `toHaveNoViolations()`                |

## 6. Implementation Order

1. **Install dependency** — `pnpm --filter @components/ui add @radix-ui/react-avatar` — updates `package.json` and `pnpm-lock.yaml`.
2. **Create `avatar.styles.ts`** — Define `avatarVariants`, `avatarImageStyles`, `avatarFallbackStyles`. No dependencies on other new files.
3. **Create `avatar.types.ts`** — Define `AvatarProps`, `AvatarImageProps`, `AvatarFallbackProps`. Depends on `avatar.styles.ts` (imports `avatarVariants` type).
4. **Create `avatar.tsx`** — Implement `Avatar`, `AvatarImage`, `AvatarFallback`. Depends on both `.styles.ts` and `.types.ts`.
5. **Create `avatar.test.tsx`** — Write all 14 tests. Depends on `avatar.tsx`.
6. **Create `avatar.stories.tsx`** — Write all 5 stories. Depends on `avatar.tsx`.
7. **Modify `packages/ui/src/index.ts`** — Add exports for Avatar, AvatarImage, AvatarFallback, types, and `avatarVariants`.
8. **Verify** — Run `pnpm typecheck`, `pnpm test`, and confirm Storybook renders.

## 7. Verification Commands

```bash
# Install the new dependency
pnpm --filter @components/ui add @radix-ui/react-avatar

# Type-check the entire UI package (must pass with zero errors)
pnpm --filter @components/ui typecheck

# Run only Avatar tests
pnpm --filter @components/ui test -- --reporter=verbose src/components/avatar/avatar.test.tsx

# Run full test suite (must pass with zero failures)
pnpm --filter @components/ui test

# Build the package (must produce dist/ output without errors)
pnpm --filter @components/ui build

# Verify exports are accessible (quick smoke check)
node -e "import('@components/ui').then(m => { console.log('Avatar:', typeof m.Avatar); console.log('AvatarImage:', typeof m.AvatarImage); console.log('AvatarFallback:', typeof m.AvatarFallback); console.log('avatarVariants:', typeof m.avatarVariants); })"

# Launch Storybook to visually verify stories (manual check)
pnpm storybook
```

## 8. Design Deviations

None.
