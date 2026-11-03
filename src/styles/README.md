# Dark Void Aesthetic Implementation

## Changes Applied

### Color Palette

- **Backgrounds**: Pure black (#000000) with subtle variations (#0a0a0a, #111111)
- **Accents**: Deep purple (#8b5cf6), cyan (#06b6d4), magenta (#ec4899)
- **Text**: High contrast white (#f8fafc) with gray variations for hierarchy
- **Glows**: Purple, cyan, and magenta glow effects with rgba opacity

### Visual Effects

#### Cosmic Background

- Radial gradients with purple and cyan accents
- Subtle starfield effect using CSS pseudo-elements
- Animated particle system via CosmicBackground component

#### Component Styling

- **Buttons**: Dark backgrounds with glowing borders, hover increases glow intensity
- **Cards**: Semi-transparent dark backgrounds with glowing edges on hover
- **Inputs**: Dark backgrounds with purple glow on focus
- **Text**: Gradient effects using cosmic colors

#### Animations

- Smooth transitions (300-600ms)
- Glow pulse effects
- Floating animations for cosmic elements
- Shimmer effects
- Slow rotation for decorative elements

### Custom Scrollbar

- Dark track with purple thumb
- Matches void aesthetic

### Accessibility

- High contrast ratios maintained (WCAG AA)
- Custom selection styling with purple highlight
- Focus indicators with glow effects
- Respects prefers-reduced-motion

## Usage

### CSS Classes

- `.text-gradient` - Cosmic gradient text effect
- `.glass` - Dark glass-morphism effect
- `.glow-purple/cyan/magenta` - Glow effects
- `.bg-void-gradient` - Void gradient background
- `.bg-cosmic-gradient` - Cosmic radial gradient
- `.animate-float` - Floating animation
- `.animate-pulse-glow` - Pulsing glow effect
- `.animate-shimmer` - Shimmer effect
- `.animate-rotate-slow` - Slow rotation

### Components

- `<CosmicBackground />` - Animated particle background effect

## CSS Variables

All theme colors are available as CSS custom properties:
- `--color-background`, `--color-background-secondary`, `--color-background-tertiary`
- `--color-primary`, `--color-primary-dark`, `--color-primary-light`
- `--color-accent`, `--color-accent-dark`, etc.
- `--color-glow-purple`, `--color-glow-cyan`, `--color-glow-magenta`
