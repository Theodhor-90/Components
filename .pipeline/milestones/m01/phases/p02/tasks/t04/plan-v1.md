I now have a thorough understanding of the codebase patterns, the task spec, and the existing sibling implementations. Let me produce the detailed implementation plan.

# Task 4: Sonner (Toast) — Implementation Plan

## 1. Deliverables

| #   | File                                                   | Action | Purpose                                                                             |
| --- | ------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------- |
| 1   | `packages/ui/package.json`                             | Modify | Add `sonner` to `dependencies`                                                      |
| 2   | `packages/ui/src/components/sonner/sonner.types.ts`    | Create | TypeScript prop types for the `Toaster` component                                   |
| 3   | `packages/ui/src/components/sonner/sonner.styles.ts`   | Create | Theme configuration object mapping OKLCH semantic tokens to Sonner's styling system |
| 4   | `packages/ui/src/components/sonner/sonner.tsx`         | Create | `Toaster` component wrapping Sonner's `<Toaster />` + re-export of `toast` function |
| 5   | `packages/ui/src/components/sonner/sonner.test.tsx`    | Create | Vitest + Testing Library + vitest-axe tests                                         |
| 6   | `packages/ui/src/components/sonner/sonner.stories.tsx` | Create | Storybook CSF3 stories with autodocs                                                |
| 7   | `packages/ui/src/index.ts`                             | Modify | Add exports for `Toaster`, `toast`, and `type ToasterProps`                         |

## 2. Dependencies

### Pre-existing (already in place)

- `@components/utils` — `cn()` helper (clsx + tailwind-merge), imported as `../../lib/utils.js`
- `globals.css` — complete light/dark theme with OKLCH semantic tokens (`--background`, `--foreground`, `--border`, `--muted-foreground`, `--primary`, `--primary-foreground`)
- `tailwindcss-animate` — installed and configured in `globals.css` via `@plugin "tailwindcss-animate"` (Task t00)
- Vitest + Testing Library + vitest-axe — test infrastructure configured in `packages/ui/`
- Storybook 8.5 — configured in `apps/docs/`

### To be installed

- **`sonner`** — Toast notification library. Install as a runtime dependency in `packages/ui/package.json`.

## 3. Implementation Details

### 3.1 `sonner.types.ts`

**Purpose**: Define TypeScript prop types for the `Toaster` component.

**Exports**:

- `ToasterProps` — extends Sonner's `ToasterProps` from the `sonner` package (imported via `import type` as `SonnerToasterProps`). No additional props needed beyond what Sonner provides, since `theme` is already part of Sonner's type. The type alias ensures our naming convention is consistent.

```ts
import type { Toaster as SonnerToaster } from 'sonner';

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;
```

### 3.2 `sonner.styles.ts`

**Purpose**: Export a theme configuration object that maps OKLCH CSS custom properties and Tailwind utility classes to Sonner's styling system.

**Exports**:

- `toasterThemeConfig` — a `const` object with the following shape:

```ts
export const toasterThemeConfig = {
  toastOptions: {
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
    classNames: {
      toast: 'group border-border',
      description: 'text-muted-foreground',
      actionButton: 'bg-primary text-primary-foreground',
      cancelButton: 'bg-muted text-muted-foreground',
    },
  },
} as const;
```

No CVA definition — Sonner manages its own variant system internally (success, error, info, warning).

### 3.3 `sonner.tsx`

**Purpose**: Implement the `Toaster` wrapper component and re-export `toast` from Sonner.

**Exports**:

- `Toaster` — Named function component
- `toast` — Re-export from `sonner`

**Type re-exports**:

- `ToasterProps` — Re-exported from `./sonner.types.js`

**Implementation details for `Toaster`**:

```ts
import { Toaster as SonnerToaster, toast } from 'sonner';

import { toasterThemeConfig } from './sonner.styles.js';
import type { ToasterProps } from './sonner.types.js';

export type { ToasterProps } from './sonner.types.js';

export { toast };

export function Toaster({ theme, ...props }: ToasterProps): React.JSX.Element {
  const resolvedTheme =
    theme ??
    (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light');

  return (
    <SonnerToaster
      data-slot="sonner"
      theme={resolvedTheme}
      {...toasterThemeConfig}
      {...props}
    />
  );
}
```

**Key logic**:

1. Theme auto-detection: at render time, checks `document.documentElement.classList.contains('dark')`. If the `.dark` class is present, uses `"dark"`, otherwise `"light"`.
2. SSR safety: guarded by `typeof document !== 'undefined'`, defaults to `"light"` on server.
3. Explicit `theme` prop overrides auto-detection when provided (checked via `theme ?? ...`).
4. `toasterThemeConfig` is spread before `...props` so consumers can override `toastOptions` if needed.
5. `data-slot="sonner"` is applied to the root element for testability and consistency.
6. `toast` is re-exported directly from `sonner` — it's the imperative function consumers use.

### 3.4 `sonner.test.tsx`

**Purpose**: Validate smoke rendering, toast triggering, theme application, data-slot, toast variants, and accessibility.

**Test setup**: Uses the standard test infrastructure (`@testing-library/react`, `@testing-library/user-event`, `vitest-axe`).

**Test helper**: A `TestToaster` component that renders `<Toaster />` plus a button that calls `toast()` when clicked.

**Tests**:

| #   | Test Name                            | Description                                                                                      |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1   | renders Toaster without crashing     | Smoke render of `<Toaster />` — verify it mounts without errors                                  |
| 2   | toast appears when toast() is called | Click a button that calls `toast("Hello")`, verify the text "Hello" appears in the DOM           |
| 3   | success toast renders                | Call `toast.success("Success!")`, verify the text appears                                        |
| 4   | error toast renders                  | Call `toast.error("Error!")`, verify the text appears                                            |
| 5   | data-slot on toaster container       | Verify `document.querySelector('[data-slot="sonner"]')` is present after rendering `<Toaster />` |
| 6   | toast with description renders       | Call `toast("Title", { description: "Description text" })`, verify both appear                   |
| 7   | has no accessibility violations      | Run `axe(container)` on the rendered `<Toaster />` and verify no violations                      |

**Important testing considerations**:

- Sonner uses portals and delayed rendering internally. Tests must use `waitFor` or `findByText` to account for async toast rendering.
- The `toast()` function is imperative — call it in a button's `onClick` handler then simulate the click with `userEvent`.
- For the axe test, render `<Toaster />` and run axe on the container (the toaster itself, before any toasts are shown, to avoid async timing issues with toast content).

### 3.5 `sonner.stories.tsx`

**Purpose**: Storybook CSF3 stories with autodocs covering all Sonner use cases.

**Meta**:

```ts
const meta: Meta<typeof Toaster> = {
  title: 'Components/Sonner',
  component: Toaster,
  tags: ['autodocs'],
};
```

**Stories**:

| #   | Story Name        | Description                                                                                                                                                |
| --- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `Default`         | Renders `<Toaster />` + a `<Button>` that calls `toast("Event has been created")` on click                                                                 |
| 2   | `Success`         | Button calls `toast.success("Profile updated successfully")`                                                                                               |
| 3   | `Error`           | Button calls `toast.error("Something went wrong")`                                                                                                         |
| 4   | `WithDescription` | Button calls `toast("Event created", { description: "Monday, January 3rd at 6:00pm" })`                                                                    |
| 5   | `WithAction`      | Button calls `toast("File deleted", { action: { label: "Undo", onClick: () => {} } })`                                                                     |
| 6   | `Promise`         | Button calls `toast.promise(asyncFn, { loading: "Loading...", success: "Done!", error: "Failed" })` where `asyncFn` is a `setTimeout` wrapped in a Promise |

Each story renders both `<Toaster />` and a trigger `<Button>` (imported from `../button/button.js`). The `Toaster` is included within each story's `render` function.

### 3.6 `index.ts` modification

Add the following export block after the existing Popover exports:

```ts
export { Toaster, toast, type ToasterProps } from './components/sonner/sonner.js';
```

### 3.7 `package.json` modification

Add `sonner` to the `dependencies` object:

```json
"sonner": "^2.0.0"
```

Note: Use the latest stable v2 version. The exact version will be determined by `pnpm add sonner` at install time.

## 4. API Contracts

### `Toaster` component

**Input props** (extends Sonner's `ToasterProps`):

| Prop       | Type                                                                                              | Default                           | Description                               |
| ---------- | ------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------- |
| `theme`    | `"light" \| "dark" \| "system"`                                                                   | Auto-detected                     | Overrides auto-detection when provided    |
| `position` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "top-center" \| "bottom-center"` | `"bottom-right"` (Sonner default) | Toast position                            |
| `duration` | `number`                                                                                          | `4000` (Sonner default)           | Auto-dismiss duration in ms               |
| `...rest`  | Sonner `ToasterProps`                                                                             | —                                 | All other Sonner props are passed through |

**Output**: Renders a `<section>` (Sonner's root) with `data-slot="sonner"`.

### `toast` function (re-exported from Sonner)

```ts
toast('Message'); // Basic toast
toast('Title', { description }); // Toast with description
toast.success('Message'); // Success variant
toast.error('Message'); // Error variant
toast.info('Message'); // Info variant
toast.warning('Message'); // Warning variant
toast.promise(promise, config); // Promise-based toast
toast.dismiss(id); // Dismiss specific toast
```

### `ToasterProps` type

Alias for `React.ComponentProps<typeof SonnerToaster>` from the `sonner` package.

## 5. Test Plan

### Test Setup

- **Test file**: `packages/ui/src/components/sonner/sonner.test.tsx`
- **Framework**: Vitest + jsdom + Testing Library + vitest-axe
- **Imports**: `render`, `screen`, `waitFor` from `@testing-library/react`; `userEvent` from `@testing-library/user-event`; `axe` from `vitest-axe`; `describe`, `expect`, `it` from `vitest`
- **Test helper**: `TestToaster` — renders `<Toaster />` and a `<button>` that triggers `toast()` on click

### Per-test specification

#### Test 1: `renders Toaster without crashing`

```ts
render(<Toaster />);
expect(document.querySelector('[data-slot="sonner"]')).toBeInTheDocument();
```

#### Test 2: `toast appears when toast() is called`

```ts
const user = userEvent.setup();
render(<TestToaster />);
await user.click(screen.getByRole('button', { name: 'Show Toast' }));
await waitFor(() => {
  expect(screen.getByText('Test toast')).toBeInTheDocument();
});
```

#### Test 3: `success toast renders`

Render a component with a button that calls `toast.success("Success!")`. Click it and verify the text appears via `waitFor`.

#### Test 4: `error toast renders`

Render a component with a button that calls `toast.error("Error!")`. Click it and verify the text appears via `waitFor`.

#### Test 5: `data-slot on toaster container`

```ts
render(<Toaster />);
expect(document.querySelector('[data-slot="sonner"]')).toBeInTheDocument();
```

#### Test 6: `toast with description renders`

Render a component with a button that calls `toast("Title", { description: "Desc" })`. Click it and verify both "Title" and "Desc" appear.

#### Test 7: `has no accessibility violations`

```ts
const { container } = render(<Toaster />);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

## 6. Implementation Order

1. **Install `sonner`** — Run `pnpm add sonner --filter @components/ui` to add the dependency to `packages/ui/package.json`.

2. **Create `sonner.types.ts`** — Define `ToasterProps` type extending Sonner's `ToasterProps`. This file has no internal dependencies and is needed by both `sonner.tsx` and `sonner.test.tsx`.

3. **Create `sonner.styles.ts`** — Define `toasterThemeConfig` with `toastOptions.style` and `toastOptions.classNames`. This file has no internal dependencies and is needed by `sonner.tsx`.

4. **Create `sonner.tsx`** — Implement the `Toaster` component and re-export `toast`. Depends on `sonner.types.ts` and `sonner.styles.ts`.

5. **Create `sonner.test.tsx`** — Write all 7 tests. Depends on `sonner.tsx` being complete.

6. **Create `sonner.stories.tsx`** — Write all 6 stories. Depends on `sonner.tsx` and `../button/button.js`.

7. **Modify `packages/ui/src/index.ts`** — Add export for `Toaster`, `toast`, and `type ToasterProps`.

8. **Run verification commands** — Execute tests, typecheck, and lint.

## 7. Verification Commands

```bash
# Install the dependency
pnpm add sonner --filter @components/ui

# Run Sonner-specific tests
pnpm --filter @components/ui test -- src/components/sonner/sonner.test.tsx

# Run full test suite to ensure no regressions
pnpm --filter @components/ui test

# TypeScript type checking
pnpm --filter @components/ui typecheck

# ESLint
pnpm --filter @components/ui lint

# Build to verify module resolution
pnpm --filter @components/ui build
```

## 8. Design Deviations

### Deviation 1: `ToasterProps` type derivation

**Parent spec requires**: `ToasterProps` extending Sonner's `ToasterProps` type using `extends`.

**Why this is problematic**: Sonner's `Toaster` component props are accessed via `React.ComponentProps<typeof SonnerToaster>`, which is the idiomatic React 19 pattern used consistently across all sibling tasks (Dialog, Alert Dialog, Popover). Using `extends` on an interface would be inconsistent and may not correctly capture the full Sonner prop type depending on how Sonner exports its types.

**Alternative chosen**: Define `ToasterProps` as `React.ComponentProps<typeof SonnerToaster>` (a type alias), matching the pattern used in `dialog.types.ts`, `popover.types.ts`, and `alert-dialog.types.ts`. If Sonner exports a named `ToasterProps` type directly, we will use whichever approach compiles cleanly — the key constraint is that the resulting type must be a complete superset of Sonner's props.

### Deviation 2: `data-slot` placement on Sonner's root

**Parent spec requires**: `data-slot="sonner"` on the Toaster.

**Why this may need adjustment**: Sonner's `<Toaster />` renders a `<section>` element internally. The `data-slot` attribute is passed as a prop and Sonner may or may not spread unknown props onto its root element. If Sonner does not forward `data-slot` to the DOM, the attribute will be silently dropped.

**Alternative chosen**: Pass `data-slot="sonner"` as a prop to `<SonnerToaster />`. During implementation, if Sonner does not forward it, wrap the `<SonnerToaster />` in a minimal `<div data-slot="sonner">` container. The test `document.querySelector('[data-slot="sonner"]')` will verify which approach works. This is a minor DOM structure adjustment that does not affect the component's API or behavior.
