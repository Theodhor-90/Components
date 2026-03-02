Good — no existing Sheet component. Now I have complete understanding. Here is the specification:

## 1. Deliverables

| #   | File                                                 | Purpose                                                                                                                             |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `packages/ui/src/components/sheet/sheet.types.ts`    | TypeScript types for all Sheet sub-components                                                                                       |
| 2   | `packages/ui/src/components/sheet/sheet.styles.ts`   | CVA `sheetContentVariants` with `side` variant + static style strings for overlay, header, footer, title, description, close button |
| 3   | `packages/ui/src/components/sheet/sheet.tsx`         | Sheet implementation: 10 sub-components built on `@radix-ui/react-dialog`                                                           |
| 4   | `packages/ui/src/components/sheet/sheet.test.tsx`    | Vitest + Testing Library + vitest-axe tests                                                                                         |
| 5   | `packages/ui/src/components/sheet/sheet.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`                                                                                    |
| 6   | `packages/ui/src/index.ts`                           | Add exports for all Sheet sub-components, types, and `sheetContentVariants`                                                         |

## 2. Dependencies

- **`@radix-ui/react-dialog`** — already installed at `^1.1.15` in `packages/ui/package.json`. Sheet reuses this package; no new installation required.
- **`tailwindcss-animate`** — already installed at `^1.0.7` and configured via `@plugin "tailwindcss-animate"` in `globals.css`. Provides `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`, `slide-in-from-right-full`, `slide-in-from-left-full`, `slide-in-from-top-full`, `slide-in-from-bottom-full` classes.
- **`class-variance-authority`** — already installed at `^0.7.1`.
- **`@components/utils`** — already installed; provides `cn()`.
- **Task t01 completed** — Radix Tabs, Accordion, Scroll Area packages installed; no impact on Sheet but confirms dependency state.
- **Dialog component from Milestone 1** — reference for close button inline SVG pattern.
- **Button component from Milestone 1** — used in stories for trigger buttons.

No new packages need to be installed.

## 3. Implementation Details

### 3.1 `sheet.types.ts`

**Purpose**: Define TypeScript types for all 10 Sheet sub-components.

**Exports** (all `type` exports):

- `SheetProps` — `React.ComponentProps<typeof DialogPrimitive.Root>`
- `SheetTriggerProps` — `React.ComponentProps<typeof DialogPrimitive.Trigger>`
- `SheetCloseProps` — `React.ComponentProps<typeof DialogPrimitive.Close>`
- `SheetPortalProps` — `React.ComponentProps<typeof DialogPrimitive.Portal>`
- `SheetOverlayProps` — `React.ComponentProps<typeof DialogPrimitive.Overlay>`
- `SheetContentProps` — `React.ComponentProps<typeof DialogPrimitive.Content> & VariantProps<typeof sheetContentVariants>`
- `SheetHeaderProps` — `React.ComponentProps<'div'>`
- `SheetFooterProps` — `React.ComponentProps<'div'>`
- `SheetTitleProps` — `React.ComponentProps<typeof DialogPrimitive.Title>`
- `SheetDescriptionProps` — `React.ComponentProps<typeof DialogPrimitive.Description>`

**Key detail**: `SheetContentProps` combines Radix's `DialogPrimitive.Content` props with `VariantProps<typeof sheetContentVariants>` to pick up the `side` variant prop. This requires importing `sheetContentVariants` from `./sheet.styles.js`.

```typescript
import type { VariantProps } from 'class-variance-authority';
import type * as DialogPrimitive from '@radix-ui/react-dialog';

import type { sheetContentVariants } from './sheet.styles.js';

export type SheetProps = React.ComponentProps<typeof DialogPrimitive.Root>;
export type SheetTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
export type SheetCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
export type SheetPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
export type SheetOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;
export type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetContentVariants>;
export type SheetHeaderProps = React.ComponentProps<'div'>;
export type SheetFooterProps = React.ComponentProps<'div'>;
export type SheetTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
export type SheetDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;
```

### 3.2 `sheet.styles.ts`

**Purpose**: CVA variant definition for `SheetContent` side positioning and animation, plus static style strings for all other sub-components.

**Exports**:

- `sheetOverlayStyles` — string: `'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'`
- `sheetContentVariants` — CVA with:
  - **Base classes**: `'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500'`
  - **Variants** — `side`:
    - `top`: `'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top'`
    - `bottom`: `'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'`
    - `left`: `'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm'`
    - `right`: `'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm'`
  - **defaultVariants**: `{ side: 'right' }`
- `sheetCloseButtonStyles` — string: `'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'` (matches Dialog's close button pattern)
- `sheetHeaderStyles` — string: `'flex flex-col space-y-2 text-center sm:text-left'`
- `sheetFooterStyles` — string: `'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'`
- `sheetTitleStyles` — string: `'text-lg font-semibold text-foreground'`
- `sheetDescriptionStyles` — string: `'text-sm text-muted-foreground'`

```typescript
import { cva } from 'class-variance-authority';

export const sheetOverlayStyles =
  'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';

export const sheetContentVariants = cva(
  'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

export const sheetCloseButtonStyles =
  'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary';

export const sheetHeaderStyles = 'flex flex-col space-y-2 text-center sm:text-left';

export const sheetFooterStyles = 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2';

export const sheetTitleStyles = 'text-lg font-semibold text-foreground';

export const sheetDescriptionStyles = 'text-sm text-muted-foreground';
```

### 3.3 `sheet.tsx`

**Purpose**: The component implementation. 10 sub-components, all following the Dialog component pattern.

**Exports** (named):

- `Sheet` — `DialogPrimitive.Root` (direct re-export, no wrapper needed)
- `SheetTrigger` — wraps `DialogPrimitive.Trigger` with `data-slot="sheet-trigger"`
- `SheetClose` — wraps `DialogPrimitive.Close` with `data-slot="sheet-close"`
- `SheetPortal` — `DialogPrimitive.Portal` (direct re-export)
- `SheetOverlay` — wraps `DialogPrimitive.Overlay` with overlay styles and `data-slot="sheet-overlay"`
- `SheetContent` — wraps `DialogPrimitive.Content` inside `SheetPortal` + `SheetOverlay`, applies `sheetContentVariants({ side, className })`, renders embedded close button with inline X SVG, `data-slot="sheet-content"`. Accepts `side` prop (defaults to `"right"` via CVA defaultVariants), destructures it from props and passes the rest to `DialogPrimitive.Content`.
- `SheetHeader` — styled `<div>` with `data-slot="sheet-header"`
- `SheetFooter` — styled `<div>` with `data-slot="sheet-footer"`
- `SheetTitle` — wraps `DialogPrimitive.Title` with `data-slot="sheet-title"`
- `SheetDescription` — wraps `DialogPrimitive.Description` with `data-slot="sheet-description"`

Also re-exports all types from `sheet.types.js`.

**Key implementation for SheetContent**:

```typescript
export function SheetContent({
  side = 'right',
  className,
  children,
  ref,
  ...props
}: SheetContentProps): React.JSX.Element {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetContentVariants({ side, className }))}
        ref={ref}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={sheetCloseButtonStyles}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11.25 3.75 3.75 11.25" />
            <path d="M3.75 3.75l7.5 7.5" />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}
```

**Note**: The close button SVG is identical to Dialog's close button at `dialog.tsx:86-99` — a 15x15 viewBox X icon using two diagonal paths.

### 3.4 `sheet.test.tsx`

**Purpose**: Comprehensive tests covering rendering, interaction, accessibility, and conventions.

**Test helper**: A `TestSheet` component similar to the Dialog test's `TestDialog`:

```typescript
function TestSheet({
  open,
  onOpenChange,
  side,
  classNames,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  classNames?: { trigger?: string; content?: string; header?: string; footer?: string; title?: string; description?: string; close?: string };
}): React.JSX.Element {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger className={classNames?.trigger}>Open Sheet</SheetTrigger>
      <SheetContent side={side} className={classNames?.content}>
        <SheetHeader className={classNames?.header}>
          <SheetTitle className={classNames?.title}>Sheet Title</SheetTitle>
          <SheetDescription className={classNames?.description}>Sheet Description</SheetDescription>
        </SheetHeader>
        <div>Sheet body</div>
        <SheetFooter className={classNames?.footer}>
          <SheetClose className={classNames?.close}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

**Test cases** (following Dialog's test structure):

1. **`renders trigger button`** — checks trigger renders in DOM
2. **`opens on trigger click`** — clicks trigger, asserts dialog role appears with title visible
3. **`defaults to right side`** — opens sheet, checks content has `inset-y-0` and `right-0` classes (from the `right` variant)
4. **`renders from top side`** — passes `side="top"`, checks content has `inset-x-0` and `top-0` classes
5. **`renders from bottom side`** — passes `side="bottom"`, checks content has `inset-x-0` and `bottom-0` classes
6. **`renders from left side`** — passes `side="left"`, checks content has `inset-y-0` and `left-0` classes
7. **`closes on ESC`** — opens sheet, presses Escape, asserts dialog disappears (uses `waitFor`)
8. **`closes on overlay click`** — opens sheet, clicks `[data-slot="sheet-overlay"]`, asserts dialog disappears
9. **`close button (X) dismisses sheet`** — opens sheet, clicks Close sr-only button, asserts dialog disappears
10. **`renders SheetTitle and SheetDescription`** — opens sheet, asserts title and description text visible
11. **`traps focus within the sheet`** — opens sheet with `open`, tabs multiple times, asserts focus stays in dialog
12. **`controlled mode`** — renders with `open` prop, presses Escape, asserts `onOpenChange` called with `false`
13. **`data-slot on sheet-trigger`** — checks `[data-slot="sheet-trigger"]` exists
14. **`data-slot on sheet-content`** — opens, checks `[data-slot="sheet-content"]`
15. **`data-slot on sheet-overlay`** — opens, checks `[data-slot="sheet-overlay"]`
16. **`data-slot on sheet-header`** — opens, checks `[data-slot="sheet-header"]`
17. **`data-slot on sheet-footer`** — opens, checks `[data-slot="sheet-footer"]`
18. **`data-slot on sheet-title`** — opens, checks `[data-slot="sheet-title"]`
19. **`data-slot on sheet-description`** — opens, checks `[data-slot="sheet-description"]`
20. **`data-slot on sheet-close`** — opens, checks `[data-slot="sheet-close"]`
21. **`merges custom className`** — renders with classNames for each sub-component, asserts each has the custom class
22. **`has no accessibility violations`** — renders `<TestSheet open />`, runs `axe(container)`, asserts `toHaveNoViolations()`

### 3.5 `sheet.stories.tsx`

**Purpose**: Storybook CSF3 stories demonstrating all variants.

**Meta**:

```typescript
const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  tags: ['autodocs'],
};
```

**Stories**:

1. **`Default`** — Right side sheet (default). Trigger is `<Button>Open Sheet</Button>` using `asChild` on `SheetTrigger`. Content has header with title/description.
2. **`Left`** — `<SheetContent side="left">` with navigation-style content.
3. **`Top`** — `<SheetContent side="top">` with a notification banner.
4. **`Bottom`** — `<SheetContent side="bottom">` with action buttons.
5. **`WithForm`** — Sheet with a form inside (name/email fields), SheetFooter with Cancel (SheetClose+Button) and Save (Button). Similar pattern to Dialog's WithForm story.
6. **`WithLongContent`** — Sheet with `className="overflow-y-auto"` on content, renders 12 paragraphs to demonstrate scrolling within the sheet panel.

All stories import `Button` from `../button/button.js` for trigger rendering.

### 3.6 `packages/ui/src/index.ts` additions

Append the following export block after the existing Form exports:

```typescript
export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  type SheetProps,
  type SheetTriggerProps,
  type SheetPortalProps,
  type SheetOverlayProps,
  type SheetContentProps,
  type SheetHeaderProps,
  type SheetFooterProps,
  type SheetTitleProps,
  type SheetDescriptionProps,
  type SheetCloseProps,
} from './components/sheet/sheet.js';
export { sheetContentVariants } from './components/sheet/sheet.styles.js';
```

## 4. API Contracts

### SheetContent `side` prop

| Prop   | Type                                                          | Default   | Description                                           |
| ------ | ------------------------------------------------------------- | --------- | ----------------------------------------------------- |
| `side` | `"top" \| "right" \| "bottom" \| "left" \| null \| undefined` | `"right"` | The edge of the screen from which the sheet slides in |

The `side` prop is typed via `VariantProps<typeof sheetContentVariants>`, which makes each variant value optional and nullable (CVA convention). The `= 'right'` destructuring default aligns with CVA's `defaultVariants`.

### Full SheetContent props (inherited from DialogPrimitive.Content)

| Prop                   | Type                                                            | Default   | Description                              |
| ---------------------- | --------------------------------------------------------------- | --------- | ---------------------------------------- |
| `side`                 | `"top" \| "right" \| "bottom" \| "left"`                        | `"right"` | Slide-in edge                            |
| `className`            | `string`                                                        | —         | Additional CSS classes merged via `cn()` |
| `children`             | `React.ReactNode`                                               | —         | Sheet body content                       |
| `ref`                  | `React.Ref<HTMLDivElement>`                                     | —         | Forwarded ref (React 19 ref-as-prop)     |
| `onOpenAutoFocus`      | `(event: Event) => void`                                        | —         | Radix auto-focus callback                |
| `onCloseAutoFocus`     | `(event: Event) => void`                                        | —         | Radix close-focus callback               |
| `onEscapeKeyDown`      | `(event: KeyboardEvent) => void`                                | —         | Radix escape handler                     |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void`                      | —         | Radix outside-click handler              |
| `onInteractOutside`    | `(event: FocusOutsideEvent \| PointerDownOutsideEvent) => void` | —         | Radix interaction-outside handler        |

### Sub-component data-slot values

| Component        | `data-slot` value     |
| ---------------- | --------------------- |
| SheetTrigger     | `"sheet-trigger"`     |
| SheetClose       | `"sheet-close"`       |
| SheetOverlay     | `"sheet-overlay"`     |
| SheetContent     | `"sheet-content"`     |
| SheetHeader      | `"sheet-header"`      |
| SheetFooter      | `"sheet-footer"`      |
| SheetTitle       | `"sheet-title"`       |
| SheetDescription | `"sheet-description"` |

## 5. Test Plan

### Test Setup

- **Runner**: Vitest (configured in repo)
- **Libraries**: `@testing-library/react`, `@testing-library/user-event`, `vitest-axe`
- **Imports**: `render`, `screen`, `waitFor` from Testing Library; `userEvent` from user-event; `axe` from vitest-axe; `describe`, `expect`, `it`, `vi` from vitest
- **Helper**: `TestSheet` wrapper component (see section 3.4)

### Test Specifications

| #     | Test Name                               | Category    | Assertion                                       |
| ----- | --------------------------------------- | ----------- | ----------------------------------------------- |
| 1     | renders trigger button                  | smoke       | Trigger button exists in DOM                    |
| 2     | opens on trigger click                  | interaction | Dialog role appears, title visible              |
| 3     | defaults to right side                  | variant     | Content element has `right-0` class             |
| 4     | renders from top side                   | variant     | Content element has `top-0` class               |
| 5     | renders from bottom side                | variant     | Content element has `bottom-0` class            |
| 6     | renders from left side                  | variant     | Content element has `left-0` class              |
| 7     | closes on ESC                           | interaction | Dialog role removed after Escape                |
| 8     | closes on overlay click                 | interaction | Dialog role removed after overlay click         |
| 9     | close button (X) dismisses sheet        | interaction | Dialog role removed after close button click    |
| 10    | renders SheetTitle and SheetDescription | rendering   | Title and description text visible              |
| 11    | traps focus within the sheet            | a11y        | Tab cycles within dialog, trigger never focused |
| 12    | controlled mode                         | controlled  | `onOpenChange` called with `false` on Escape    |
| 13–20 | data-slot attributes (8 tests)          | convention  | Each sub-component has correct `data-slot`      |
| 21    | merges custom className                 | convention  | Custom classes applied to all sub-components    |
| 22    | has no accessibility violations         | a11y        | `axe(container)` returns no violations          |

## 6. Implementation Order

1. **`sheet.styles.ts`** — Create first because both types and implementation import from it. Define `sheetOverlayStyles`, `sheetContentVariants` (CVA), `sheetCloseButtonStyles`, `sheetHeaderStyles`, `sheetFooterStyles`, `sheetTitleStyles`, `sheetDescriptionStyles`.

2. **`sheet.types.ts`** — Create second; depends on `sheetContentVariants` import for `SheetContentProps`. Define all 10 type aliases.

3. **`sheet.tsx`** — Create third; imports from both styles and types. Implement all 10 sub-components. Re-export types.

4. **`packages/ui/src/index.ts`** — Add Sheet export block immediately after creating the component, so types resolve for the test/story files.

5. **`sheet.test.tsx`** — Create fourth; imports from `./sheet.js`. Implement all 22 test cases.

6. **`sheet.stories.tsx`** — Create fifth; imports from `./sheet.js` and `../button/button.js`. Implement all 6 stories.

7. **Verify** — Run `pnpm typecheck`, `pnpm test --filter=@components/ui`, confirm all pass.

## 7. Verification Commands

```bash
# Type checking (entire monorepo)
pnpm typecheck

# Run all tests in the ui package
pnpm --filter @components/ui test

# Run only Sheet tests
pnpm --filter @components/ui test -- sheet

# Build all packages (ensures no build errors)
pnpm build

# Verify exports are accessible (quick sanity check)
grep -c "sheet" packages/ui/src/index.ts

# Launch Storybook to visually verify (interactive)
pnpm storybook
```

## 8. Design Deviations

**Deviation 1: `side` prop default handling**

- **Parent spec states**: "`side` prop defaults to `"right"` matching shadcn/ui behavior"
- **Implementation approach**: The default is applied in two places — `sheetContentVariants` has `defaultVariants: { side: 'right' }` AND the `SheetContent` function destructures `side = 'right'`. This dual-default is necessary because CVA's `defaultVariants` only applies when `side` is `undefined`, but TypeScript's `VariantProps` types the prop as `"top" | "right" | "bottom" | "left" | null | undefined`. If a consumer passes `side={null}` (valid per the type), the destructuring default won't trigger, but CVA's defaultVariants will handle it. Conversely, if `side` is `undefined`, the destructuring default ensures the correct string is passed to CVA. This matches the shadcn/ui pattern and is not a true deviation — just a clarification of the implementation approach.

No other deviations needed. The task spec's prescribed approach is technically sound and fully implementable as specified.
