# TextEffect Component Usage Examples

The `TextEffect` component provides reusable text effects for the portfolio.

## Available Effects

- `glitch` - Chaotic RGB split and position shift effect
- `flicker` - Random opacity flicker like a dying neon sign
- `glow` - Static purple glow effect
- `pulse` - Pulsing glow animation
- `none` - No effect (default)

## Usage Examples

### Glitch Effect (for headings)

```tsx
import { TextEffect } from "../ui";

<TextEffect effect="glitch" as="h1" className="text-5xl font-bold">
  GLITCH TEXT
</TextEffect>;
```

### Flicker Effect (for emphasis)

```tsx
<p>
  This word will{" "}
  <TextEffect effect="flicker" className="font-bold text-purple-400">
    flicker
  </TextEffect>
</p>;
```

### Glow Effect (for highlights)

```tsx
<TextEffect effect="glow" className="text-cyan-400">
  Glowing text
</TextEffect>;
```

### Pulse Effect (for attention)

```tsx
<TextEffect effect="pulse" as="span" className="text-pink-400">
  Pulsing text
</TextEffect>;
```

### Custom Styling

```tsx
<TextEffect
  effect="flicker"
  className="font-bold text-2xl"
  style={{ color: "var(--color-accent)" }}
>
  Custom styled text
</TextEffect>;
```

## Props

- `effect`: TextEffectType - The effect to apply ('glitch' | 'flicker' | 'glow' | 'pulse' | 'none')
- `as`: HTML element - The element to render as ('span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p')
- `className`: string - Additional CSS classes
- `style`: React.CSSProperties - Inline styles
- `children`: React.ReactNode - Content to render

## Notes

- The glitch effect works best with uppercase text
- Flicker effect is subtle and works well for single words
- All effects use the purple void color scheme by default
- Effects can be combined with Tailwind classes for additional styling
