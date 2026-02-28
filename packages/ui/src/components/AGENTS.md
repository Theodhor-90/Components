# AGENTS.md — Component Creation Guide

## Checklist for Every New Component

- [ ] Create directory: `{name}/`
- [ ] Create `{name}.types.ts` — Props extend `React.ComponentProps<'element'>` + CVA VariantProps
- [ ] Create `{name}.styles.ts` — CVA variants with defaultVariants
- [ ] Create `{name}.tsx` — Implementation with ref-as-prop, Slot/asChild, data-slot, cn()
- [ ] Create `{name}.test.tsx` — Smoke, variants, interactions, keyboard, a11y (vitest-axe)
- [ ] Create `{name}.stories.tsx` — CSF3 with `tags: ['autodocs']`, all variants as stories
- [ ] Export from `../../index.ts`

## Component Spec Template

Before writing any code, create a spec:

```markdown
# Component Spec: {Name}

## Purpose

{One-line description of what this component does}

## HTML Element

{The native element this wraps: button, input, div, etc.}

## Props

| Prop    | Type             | Default   | Description             |
| ------- | ---------------- | --------- | ----------------------- |
| variant | 'default' \| ... | 'default' | Visual style            |
| size    | 'default' \| ... | 'default' | Size preset             |
| asChild | boolean          | false     | Render as child element |

## Variants

{List all visual variants with descriptions}

## Sizes

{List all size presets with pixel/rem values}

## Accessibility

- Keyboard: {What keyboard interactions are supported}
- ARIA: {What ARIA attributes are needed}
- Focus: {Focus management behavior}

## Acceptance Criteria

- [ ] {Specific testable requirement}
- [ ] {Specific testable requirement}
```

## Patterns to Follow (see button/ for reference)

### Types file ({name}.types.ts)

```typescript
import type { VariantProps } from 'class-variance-authority';
import type { {name}Variants } from './{name}.styles.js';

export type {Name}Props = React.ComponentProps<'{element}'> &
  VariantProps<typeof {name}Variants> & {
    asChild?: boolean;
  };
```

### Styles file ({name}.styles.ts)

```typescript
import { cva } from 'class-variance-authority';

export const {name}Variants = cva('base-classes', {
  variants: { variant: { ... }, size: { ... } },
  defaultVariants: { variant: 'default', size: 'default' },
});
```

### Implementation ({name}.tsx)

```typescript
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils.js';
import { {name}Variants } from './{name}.styles.js';
import type { {Name}Props } from './{name}.types.js';

export type { {Name}Props } from './{name}.types.js';

export function {Name}({ className, variant, size, asChild = false, ref, ...props }: {Name}Props) {
  const Comp = asChild ? Slot : '{element}';
  return (
    <Comp data-slot="{name}" className={cn({name}Variants({ variant, size, className }))} ref={ref} {...props} />
  );
}
```

### Test file ({name}.test.tsx)

Every test file MUST include:

1. Smoke test (renders without crashing)
2. Variant rendering test
3. User interaction test (click/keyboard)
4. asChild composition test
5. Accessibility test (`expect(await axe(container)).toHaveNoViolations()`)

### Stories file ({name}.stories.tsx)

- Use CSF3 format with `Meta` and `StoryObj`
- Always include `tags: ['autodocs']` in meta
- One story per variant + one per size + disabled + asChild
