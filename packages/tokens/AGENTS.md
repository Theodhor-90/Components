# AGENTS.md — @components/tokens

## Package Purpose

Design tokens in W3C DTCG format. Built with Style Dictionary v4 into CSS custom properties.

## Token Structure

```
tokens/
  primitive/     # Raw values — no semantic meaning
    colors.json  # OKLCH color values
    spacing.json # rem-based spacing scale
    typography.json # Font families, sizes, weights
    radius.json  # Border radius values
  semantic/      # Theme mappings — reference primitives
    light.json   # Light theme token assignments
    dark.json    # Dark theme token assignments
```

## DTCG Format Rules

Every token must have `$value` and `$type`:

```json
{
  "color": {
    "$type": "color",
    "blue": {
      "500": { "$value": "oklch(0.588 0.158 241.966)" }
    }
  }
}
```

- Use `$value` (not `value`) for token values
- Use `$type` (not `type`) at the group or token level
- Use `{group.token}` syntax for aliases/references
- Colors must use OKLCH color space
- Spacing must use rem units
- Font sizes must use rem units

## Adding New Tokens

1. Add primitive values to `tokens/primitive/{category}.json`
2. Reference them in `tokens/semantic/light.json` and `tokens/semantic/dark.json`
3. Run `pnpm --filter @components/tokens build` to rebuild CSS output
4. Update `packages/ui/styles/globals.css` if new semantic tokens were added

## Never

- Use hex or HSL color values — always OKLCH
- Use px for spacing or font sizes — always rem
- Skip the dark theme when adding semantic tokens
