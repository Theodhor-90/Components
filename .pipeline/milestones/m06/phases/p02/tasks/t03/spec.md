# Task 3: Connection Status

## Objective

Build a custom component displaying a colored status dot alongside a text label, with three states: connected (green), connecting (yellow with pulse animation), and disconnected (red). Uses CVA for status-based color variant mapping.

## Deliverables

5 files in `packages/ui/src/components/connection-status/`:

### 1. `connection-status.types.ts`
- `ConnectionStatusProps` extending `React.ComponentProps<'div'>` with `VariantProps<typeof connectionStatusVariants>`
- Required `status: 'connected' | 'connecting' | 'disconnected'`
- `children` is optional — if omitted, default label for the status is displayed ("Connected", "Connecting", "Disconnected")

### 2. `connection-status.styles.ts`
- `connectionStatusVariants` CVA definition:
  - `status` variant with no extra classes on the container (color is on the dot)
  - Base classes: `inline-flex items-center gap-2 text-sm`
- `connectionStatusDotVariants` CVA definition:
  - `status` variant mapping:
    - `connected`: `bg-green-500 dark:bg-green-400`
    - `connecting`: `bg-yellow-500 dark:bg-yellow-400 animate-pulse`
    - `disconnected`: `bg-red-500 dark:bg-red-400`
  - Base dot classes: `size-2 rounded-full shrink-0`

### 3. `connection-status.tsx`
- Root element: `<div data-slot="connection-status">` with CVA container variant applied
- Inside: `<span data-slot="connection-status-dot">` with dot CVA variant
- Followed by: `<span>` for text label
- If `children` provided: renders `children` as label
- If no `children`: renders default label string based on `status` ("Connected", "Connecting", "Disconnected")
- Includes `role="status"` and `aria-live="polite"` on root element for screen reader announcements
- Uses `cn()` to merge className with CVA variants

### 4. `connection-status.test.tsx`
- Tests:
  - Smoke render
  - `data-slot` attribute on root and dot elements
  - Ref forwarding
  - className merging
  - Renders correct default label for each status ("Connected", "Connecting", "Disconnected")
  - Renders custom label when `children` provided
  - Applies correct color class for each status (`bg-green-500`, `bg-yellow-500`, `bg-red-500`)
  - Applies `animate-pulse` class only for `connecting` status
  - Has `role="status"` and `aria-live="polite"`
  - Accessibility (vitest-axe)

### 5. `connection-status.stories.tsx`
- CSF3 format with `tags: ['autodocs']`
- Stories: Connected, Connecting, Disconnected, CustomLabel (`children="Online"`), AllStates (render function showing all three side by side)

## Dependencies
- No dependency on Task 1 or Task 2 in this phase
- Requires `class-variance-authority` for CVA variants (already installed)
- Requires `@components/utils` for `cn()` helper

## Key Constraints
- Uses fixed Tailwind color utilities (`bg-green-500`, etc.) rather than semantic tokens for dot colors (DD-5)
- Dark mode uses shade adjustments (`dark:bg-green-400`, etc.)
- `animate-pulse` Tailwind utility for connecting state (no custom CSS keyframes)
- Named exports only, no default exports
- React 19 ref-as-prop, no forwardRef
- Must include `role="status"` and `aria-live="polite"` for accessibility

## Verification Criteria
1. All 5 files exist in `packages/ui/src/components/connection-status/`
2. Component renders with `data-slot="connection-status"` and dot with `data-slot="connection-status-dot"`
3. Green dot for connected, yellow dot for connecting, red dot for disconnected
4. `animate-pulse` class applied only to connecting state dot
5. Default labels match status names; custom label renders when `children` provided
6. Root has `role="status"` and `aria-live="polite"`
7. All tests pass including vitest-axe accessibility assertions
8. Stories render correctly in Storybook with autodocs