## Task: Sheet component

### Objective

Implement the Sheet component — a shadcn/ui port using `@radix-ui/react-dialog` that displays content sliding in from a screen edge (top, right, bottom, left), with overlay backdrop, focus trapping, and ESC-to-close behavior.

### Deliverables

Create the 5-file component directory at `packages/ui/src/components/sheet/`:

1. **`sheet.types.ts`** — Types for Sheet, SheetTrigger, SheetClose, SheetContent (with `side` prop typed as `"top" | "right" | "bottom" | "left"`), SheetHeader, SheetFooter, SheetTitle, SheetDescription. `SheetContentProps` extends `React.ComponentProps<typeof DialogPrimitive.Content>` combined with `VariantProps<typeof sheetContentVariants>`.

2. **`sheet.styles.ts`** — `sheetOverlayStyles` (fixed inset-0, semi-transparent backdrop with fade animation), `sheetContentVariants` CVA with `side` variant encoding edge positioning and slide animation per side, plus static style strings for `sheetHeaderStyles`, `sheetFooterStyles`, `sheetTitleStyles`, `sheetDescriptionStyles`.

3. **`sheet.tsx`** — Sub-components:
   - Sheet (re-export of `DialogPrimitive.Root`)
   - SheetTrigger (re-export of `DialogPrimitive.Trigger`)
   - SheetClose (re-export of `DialogPrimitive.Close`)
   - SheetPortal (re-export of `DialogPrimitive.Portal`)
   - SheetOverlay (styled overlay with fade animation)
   - SheetContent (wraps Portal + Overlay + Primitive.Content with side variant styling and embedded close button using an inline X SVG — identical to the Dialog component's close button pattern at `packages/ui/src/components/dialog/dialog.tsx`)
   - SheetHeader, SheetFooter (layout containers)
   - SheetTitle (wraps `DialogPrimitive.Title`)
   - SheetDescription (wraps `DialogPrimitive.Description`)
   - Every sub-component has a `data-slot` attribute

4. **`sheet.test.tsx`** — Tests: smoke render, rendering from each side (top/right/bottom/left), overlay presence, close on ESC, close on overlay click, SheetTitle and SheetDescription rendering, focus trapping within SheetContent, custom className merging, data-slot attributes, vitest-axe accessibility check.

5. **`sheet.stories.tsx`** — CSF3 stories: Default (right side), Left, Top, Bottom, WithForm (form inside sheet), WithLongContent (scrollable sheet content). Meta includes `tags: ['autodocs']`.

Add exports to `packages/ui/src/index.ts` for all sub-components, their types, and `sheetContentVariants`.

### Key Constraints

- Sheet reuses `@radix-ui/react-dialog` (already installed) — do NOT use a separate sheet-specific Radix package
- `side` prop defaults to `"right"` matching shadcn/ui behavior
- Animation uses `data-[state=open]` / `data-[state=closed]` selectors with `tailwindcss-animate` classes (`slide-in-from-right`, `slide-in-from-left`, etc.)
- Icons use inline SVGs — no icon library (match Dialog component's close button pattern)
- Use `cn()` from `@components/utils` for className merging
- Named exports only, no default exports
- Follow React 19 ref-as-prop convention (no forwardRef)

### Dependencies

- Task t01 (Radix dependencies installed)
- Dialog component from Milestone 1 (reference for close button pattern)

### Verification

1. All test cases in `sheet.test.tsx` pass
2. vitest-axe reports no accessibility violations
3. Storybook renders all 6 stories with autodocs
4. Sheet slides in from each edge correctly
5. `pnpm typecheck` passes
6. All exports present in `packages/ui/src/index.ts`
