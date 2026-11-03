# UI Components

This directory contains reusable UI components for the developer portfolio.

## Components

### Button

A versatile button component with multiple variants and states.

**Features:**
- Variants: `primary`, `secondary`, `outline`
- Sizes: `small`, `medium`, `large`
- Loading state with spinner animation
- Hover and active states
- Accessible with ARIA labels
- Minimum touch target size (44px for medium)

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>

<Button variant="outline" loading={isLoading}>
  Submit
</Button>
```

### SocialLinks

Displays social media links with icons and hover animations.

**Features:**
- Supports: GitHub, LinkedIn, Twitter, Email, Instagram, Spotify, Tumblr
- Hover animations (scale and color change)
- Opens in new tab with security attributes
- Customizable icon size
- Accessible with ARIA labels

**Usage:**
```tsx
import { SocialLinks } from "@/components/ui";

const links = [
  { platform: "github", url: "https://github.com/username" },
  { platform: "linkedin", url: "https://linkedin.com/in/username" },
  { platform: "email", url: "contact@example.com" },
];

<SocialLinks links={links} iconSize={24} />;
```

### Lightbox

Modal component for displaying full-size images in an overlay.

**Features:**
- Modal overlay with backdrop
- Responsive image sizing
- Close button and ESC key handler
- Click-outside-to-close functionality
- Prevents body scroll when open
- Smooth fade-in animation
- Optional title display

**Usage:**
```tsx
import { Lightbox } from "@/components/ui";

const [isOpen, setIsOpen] = useState(false);

<Lightbox
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  imageSrc="/path/to/image.jpg"
  imageAlt="Artwork description"
  title="Artwork Title"
/>;
```

### EmbeddedDemo

Component for displaying embedded content (games, demos) in an iframe.

**Features:**
- Responsive iframe wrapper with aspect ratio control
- Fullscreen toggle button
- Loading state indicator
- Error handling for failed loads
- ESC key to close
- Prevents body scroll when open
- Supports multiple aspect ratios: `16:9`, `4:3`, `1:1`

**Usage:**
```tsx
import { EmbeddedDemo } from "@/components/ui";

const [isOpen, setIsOpen] = useState(false);

<EmbeddedDemo
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  embedUrl="https://example.com/game"
  title="Tower Defense Game"
  aspectRatio="16:9"
/>;
```

## Accessibility

All components follow accessibility best practices:
- Semantic HTML elements
- ARIA labels for icon-only buttons
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- Minimum touch target sizes (44x44px)

## Styling

Components use Tailwind CSS utility classes and custom CSS variables defined in `src/styles/globals.css`. They support the theme system and will adapt to light/dark mode when implemented.

## Testing

A demo component (`ComponentDemo.tsx`) is available to test all UI components in isolation. This can be temporarily imported into `App.tsx` for development and testing purposes.
