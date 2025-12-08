# Design System Documentation

## CSS Custom Properties

All design tokens are defined as CSS custom properties in `variables.css`.

### Usage

```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
}
```

### Color System

- **Primary**: Purple theme color (`--color-primary`, `--color-primary-dark`, `--color-primary-light`, etc.)
- **Secondary**: Slate/gray colors (`--color-secondary`, `--color-secondary-dark`, `--color-secondary-light`)
- **Status**: Success, Error, Warning, Info colors with dark and light variants

### Background Colors

Dark theme defaults (light theme will override in Issue #20):
- `--bg-primary`: Main background
- `--bg-secondary`: Secondary background
- `--bg-tertiary`: Tertiary background
- `--bg-quaternary`: Quaternary background
- `--bg-overlay`: Overlay background (80% opacity)
- `--bg-overlay-light`: Light overlay (50% opacity)
- `--bg-card`: Card background
- `--bg-card-hover`: Card hover state
- `--bg-input`: Input background
- `--bg-input-focus`: Input focus state

### Text Colors

- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--text-tertiary`: Tertiary text color
- `--text-muted`: Muted text color
- `--text-inverse`: Inverse text color (for dark backgrounds)
- `--text-on-primary`: Text color on primary background

### Spacing

Use spacing scale: `--spacing-xs` through `--spacing-3xl`
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)
- `--spacing-3xl`: 4rem (64px)

### Typography

**Font sizes**: `--font-size-xs` through `--font-size-6xl`
- `--font-size-xs`: 0.75rem (12px)
- `--font-size-sm`: 0.875rem (14px)
- `--font-size-base`: 1rem (16px)
- `--font-size-lg`: 1.125rem (18px)
- `--font-size-xl`: 1.25rem (20px)
- `--font-size-2xl`: 1.5rem (24px)
- `--font-size-3xl`: 1.875rem (30px)
- `--font-size-4xl`: 2.25rem (36px)
- `--font-size-5xl`: 3rem (48px)
- `--font-size-6xl`: 3.75rem (60px)

**Font weights**: `--font-weight-light` through `--font-weight-bold`
- `--font-weight-light`: 300
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

**Line heights**: `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`, `--line-height-loose`

### Borders

**Border radius**: `--border-radius-none` through `--border-radius-full`
- `--border-radius-sm`: 0.375rem (6px)
- `--border-radius-md`: 0.5rem (8px)
- `--border-radius-lg`: 0.75rem (12px)
- `--border-radius-xl`: 1rem (16px)
- `--border-radius-2xl`: 1.5rem (24px)
- `--border-radius-full`: 9999px

**Border width**: `--border-width-thin`, `--border-width`, `--border-width-thick`

**Border colors**: `--border-color`, `--border-color-light`, `--border-color-dark`, `--border-color-focus`

### Shadows

Standard shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`

Primary-themed shadows: `--shadow-primary`, `--shadow-primary-lg`

### Transitions

- `--transition-fast`: 150ms ease-in-out
- `--transition-base`: 200ms ease-in-out
- `--transition-slow`: 300ms ease-in-out
- `--transition-slower`: 500ms ease-in-out

### Z-Index Scale

- `--z-base`: 0
- `--z-dropdown`: 1000
- `--z-sticky`: 1020
- `--z-fixed`: 1030
- `--z-modal-backdrop`: 1040
- `--z-modal`: 1050
- `--z-popover`: 1060
- `--z-tooltip`: 1070

### Opacity

- `--opacity-disabled`: 0.5
- `--opacity-hover`: 0.8
- `--opacity-pressed`: 0.6

## Naming Convention

- Use kebab-case: `--color-primary`
- Group by category: `--bg-*`, `--text-*`, `--spacing-*`
- Use semantic names: `--bg-primary` not `--bg-dark-blue`
- Add variants: `--color-primary-dark`, `--color-primary-light`

## Best Practices

- Use semantic names (not color names)
- Group related variables together
- Add comments for clarity
- Use consistent naming patterns
- Document usage examples
- Variables can be overridden per component if needed

## Notes

- These are dark theme defaults (light theme will override in Issue #20)
- All values should be in rem or px for consistency
- Test variables in browser DevTools
- Consider accessibility when choosing colors

