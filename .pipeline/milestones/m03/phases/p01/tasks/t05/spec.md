## Task: Scroll Area component

### Objective

Implement the Scroll Area component — a shadcn/ui port wrapping `@radix-ui/react-scroll-area` that provides custom-styled scrollbars (vertical and horizontal) matching the application theme, replacing the browser's native scrollbar.

### Deliverables

Create the 5-file component directory at `packages/ui/src/components/scroll-area/`:

1. **`scroll-area.types.ts`** — Types for ScrollArea and ScrollBar. `ScrollAreaProps` extends `React.ComponentProps<typeof ScrollAreaPrimitive.Root>`. `ScrollBarProps` extends `React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>` with `orientation` defaulting to `"vertical"`.

2. **`scroll-area.styles.ts`** — `scrollAreaStyles` (relative, overflow-hidden), `scrollAreaViewportStyles` (h-full, w-full, rounded-inherit), `scrollBarStyles` (flex, touch-none, select-none, transition-colors, with orientation-specific sizing: vertical gets `h-full w-2.5 border-l border-l-transparent p-px`, horizontal gets `h-2.5 flex-col border-t border-t-transparent p-px`), `scrollBarThumbStyles` (relative, flex-1, rounded-full, bg-border).

3. **`scroll-area.tsx`** — Sub-components:
   - ScrollArea (wraps `ScrollAreaPrimitive.Root` + `ScrollAreaPrimitive.Viewport` + default vertical `ScrollBar` + `ScrollAreaPrimitive.Corner`)
   - ScrollBar (wraps `ScrollAreaPrimitive.Scrollbar` + `ScrollAreaPrimitive.Thumb` with orientation-aware styling)
   - Each sub-component has a `data-slot` attribute

4. **`scroll-area.test.tsx`** — Tests: smoke render, renders with overflowing content, vertical scrollbar visibility, horizontal scrollbar when `type="always"` and horizontal ScrollBar is added, custom className merging, data-slot attributes, vitest-axe accessibility check.

5. **`scroll-area.stories.tsx`** — CSF3 stories: Vertical (tall content list), Horizontal (wide content), BothDirections (both scrollbars), WithTags (horizontal tag list), CustomHeight (fixed height container). Meta includes `tags: ['autodocs']`.

Add exports to `packages/ui/src/index.ts`.

### Key Constraints

- Scrollbar thumb uses `bg-border` (matching theme border color) with `rounded-full` for pill shape
- Scrollbar track is transparent
- `orientation` prop on ScrollBar defaults to `"vertical"`
- Uses existing semantic tokens from `globals.css`
- Use `cn()` for className merging
- Named exports only, no default exports
- React 19 ref-as-prop (no forwardRef)

### Dependencies

- Task t01 (Radix dependencies installed — `@radix-ui/react-scroll-area`)

### Verification

1. All test cases in `scroll-area.test.tsx` pass
2. vitest-axe reports no accessibility violations
3. Storybook renders all 5 stories with autodocs
4. Vertical scrollbar appears for tall content
5. Horizontal scrollbar appears for wide content when configured
6. Scrollbar thumb uses theme-matched `bg-border` color
7. `pnpm typecheck` passes
8. All exports present in `packages/ui/src/index.ts`
