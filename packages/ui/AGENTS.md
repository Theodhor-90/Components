# AGENTS.md — @components/ui

## Package Purpose

Core UI component library. All components follow shadcn/ui conventions built on Radix UI
primitives with Tailwind CSS v4 styling and CVA variant management.

## Adding a New Component

1. Create a spec file first (see spec template in `src/components/AGENTS.md`)
2. Create the component directory: `src/components/{name}/`
3. Create all 5 files following the Button reference pattern
4. Export the component and its types from `src/index.ts`
5. Run `pnpm test` and `pnpm typecheck` to validate

## Key Dependencies

- `@radix-ui/react-slot` — Slot/asChild composition pattern
- `class-variance-authority` — Type-safe Tailwind variant management
- `@components/utils` — `cn()` helper (clsx + tailwind-merge)

## Theme Integration

Components use semantic CSS custom properties defined in `styles/globals.css`.
Use Tailwind utilities that map to these tokens:

```
bg-primary, text-primary-foreground    # Primary actions
bg-secondary, text-secondary-foreground # Secondary actions
bg-destructive, text-destructive-foreground # Danger/delete
bg-muted, text-muted-foreground        # Disabled/helper
bg-accent, text-accent-foreground      # Hover/highlights
border-border, border-input            # Borders
ring-ring                              # Focus rings
rounded-sm, rounded-md, rounded-lg     # Border radius (derived from --radius)
```

## Reference Implementation

The Button component (`src/components/button/`) is the canonical example.
Study all 5 files before creating any new component.
