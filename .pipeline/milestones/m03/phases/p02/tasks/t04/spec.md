# Task 4: Resizable component

## Objective

Implement the Resizable component as a shadcn port wrapping `react-resizable-panels`. This is a thin wrapper providing themed styling and an optional drag grip indicator over the library's `PanelGroup`, `Panel`, and `PanelResizeHandle` components.

## Deliverables

### Files to Create

| File                                                         | Purpose                                            |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `packages/ui/src/components/resizable/resizable.tsx`         | Implementation of 3 sub-components                 |
| `packages/ui/src/components/resizable/resizable.styles.ts`   | Static styles + CVA variant for handle orientation |
| `packages/ui/src/components/resizable/resizable.types.ts`    | Props types extending library types                |
| `packages/ui/src/components/resizable/resizable.test.tsx`    | Tests with vitest-axe accessibility assertions     |
| `packages/ui/src/components/resizable/resizable.stories.tsx` | Storybook CSF3 stories with `tags: ['autodocs']`   |

### Files to Modify

| File                       | Change                                           |
| -------------------------- | ------------------------------------------------ |
| `packages/ui/src/index.ts` | Add exports for Resizable (3 components + types) |

## Sub-components

1. **ResizablePanelGroup** — Wraps `PanelGroup` from `react-resizable-panels` with `data-slot="resizable-panel-group"` and themed border/styling. Accepts `direction` prop ("horizontal" | "vertical") passed through to the underlying `PanelGroup`.
2. **ResizablePanel** — Re-exports/wraps `Panel` from `react-resizable-panels` with `data-slot="resizable-panel"`.
3. **ResizableHandle** — Wraps `PanelResizeHandle` from `react-resizable-panels` with `data-slot="resizable-handle"`. Themed with `bg-border` token. Focus ring with `ring-ring`. Optional `withHandle` prop renders a six-dot grip indicator via inline SVG.

## Implementation Constraints

- Thin wrapper — the `react-resizable-panels` library handles all drag, keyboard, and persistence logic
- `ResizableHandleProps` extends the library's `PanelResizeHandleProps` with `withHandle?: boolean` and `className?`
- `ResizablePanelGroupProps` extends the library's `PanelGroupProps` with `className?`
- `ResizablePanelProps` is the library's `PanelProps`
- CVA variant on handle for orientation (horizontal/vertical grip icon positioning)
- Use `data-slot` on each sub-component root element
- Named exports only, no default exports
- Follow the 5-file pattern

## Tests Required

- Renders panel group with two panels and a handle
- Handle renders between panels
- `withHandle` renders the six-dot grip indicator
- Orientation classes applied for horizontal/vertical
- `data-slot` attributes present on all sub-components
- className merging works correctly
- vitest-axe accessibility pass

## Stories Required

- Horizontal (two panels side by side)
- Vertical (stacked panels)
- WithHandle (grip indicator visible)
- ThreePanels (three panels with two handles)
- NestedGroups (panel groups inside panels)

## Dependencies

- **Within this phase:** Depends on **t01** (`react-resizable-panels` must be installed first)
- No dependency on t02 or t03

## Verification

1. All 5 files exist in `packages/ui/src/components/resizable/`
2. ResizablePanelGroup renders with correct `direction` prop
3. ResizableHandle renders with themed `bg-border` styling
4. `withHandle` prop shows the six-dot grip indicator
5. Panels support drag-to-resize via `react-resizable-panels`
6. Panels support keyboard arrow key resizing
7. All stories render in Storybook with autodocs
8. `pnpm test` passes for resizable tests including vitest-axe
9. Exports present in `packages/ui/src/index.ts`
