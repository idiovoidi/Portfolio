# Layout Components

This directory contains the main layout components for the portfolio.

## Components

### Header

The `Header` component provides a fixed navigation bar at the top of the page with scroll-based styling.

**Features:**
- Fixed positioning at the top of the viewport
- Transparent background when at the top of the page
- Solid background with backdrop blur when scrolled
- Smooth transition between states

**Usage:**
```tsx
import { Header } from "./components/layout";

function App() {
  return (
    <>
      <Header />
      {/* Your content */}
    </>
  );
}
```

### Navigation

The `Navigation` component handles both desktop and mobile navigation with smooth scrolling and active section highlighting.

**Features:**
- Desktop horizontal navigation menu
- Mobile hamburger menu with slide-in drawer
- Animated hamburger icon (transforms to X when open)
- Active section highlighting based on scroll position
- Smooth scroll to sections with offset for fixed header
- Prevents body scroll when mobile menu is open
- Keyboard accessible (ESC to close mobile menu)

**Navigation Links:**
The navigation links are defined in the component and can be customized:
```tsx
const navLinks: NavLink[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "contact", label: "Contact", href: "#contact" },
];
```

**Customization:**
To add or modify navigation links, update the `navLinks` array in `Navigation.tsx`. Make sure the corresponding section IDs exist in your page.

**Dependencies:**
- `framer-motion` - For animations and transitions
- `useScrollSpy` hook - Custom hook for tracking active section

## Hooks

### useScrollSpy

A custom hook that tracks which section is currently in view based on scroll position.

**Usage:**
```tsx
import { useScrollSpy } from "../../hooks";

const activeSection = useScrollSpy(["home", "projects", "skills", "contact"]);
```

**Parameters:**
- `sectionIds: string[]` - Array of section IDs to track
- `offset: number` - Offset from top of viewport (default: 150)

**Returns:**
- `string` - The ID of the currently active section

## Styling

The components use a combination of:
- Tailwind CSS utility classes
- CSS custom properties from `globals.css`
- Inline styles for dynamic values

**Key CSS Variables Used:**
- `--color-primary` - Primary brand color
- `--color-text-primary` - Primary text color
- `--color-text-secondary` - Secondary text color
- `--color-surface` - Surface background color
- `--color-border` - Border color
- `--font-heading` - Heading font family

## Accessibility

The navigation components follow accessibility best practices:
- Semantic HTML elements (`<nav>`, `<header>`)
- ARIA labels for icon-only buttons
- Keyboard navigation support
- Focus visible indicators
- Proper button roles and states
- ESC key to close mobile menu

## Responsive Behavior

**Desktop (≥768px):**
- Horizontal navigation menu
- Hover effects on links
- Active section indicator (animated underline)

**Mobile (<768px):**
- Hamburger menu button
- Slide-in drawer from the right
- Backdrop overlay
- Staggered animation for menu items
- Touch-friendly tap targets
