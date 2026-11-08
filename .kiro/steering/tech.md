# Technology Stack

## Core Technologies

**Frontend Framework:**
- React 19 with TypeScript for type safety
- Vite 7 as build tool for fast HMR and optimized production builds

**Styling:**
- Tailwind CSS 4 for utility-first responsive design
- CSS Modules for component-specific styles where needed
- Custom CSS variables for theme consistency

**Animation & Interaction:**
- Framer Motion for declarative animations and scroll-triggered effects
- React Intersection Observer for viewport detection

**Form Handling:**
- React Hook Form for performant form validation
- EmailJS or Formspree for contact form submissions (no backend required)

**Icons & Assets:**
- React Icons or Lucide React for iconography
- Optimized WebP images with fallbacks

## Image Processing

**ImageMagick:**
- Used for batch image optimization and WebP conversion
- **Important:** Use ImageMagick-7.1.2-Q16 (NOT Q16-HDRI) to avoid color/quality issues
- Install via Chocolatey: `choco install imagemagick`
- Or download Q16 version from: https://imagemagick.org/script/download.php#windows
- PowerShell scripts in `scripts/` folder automate photo processing

## Deployment

**Hosting Options:**
- GitHub Pages (requires base path configuration)
- Netlify (automatic deployments from GitHub)
- Vercel (recommended - automatic deployments, HTTPS, edge caching)

**Version Control:**
- Public GitHub repository (idiovoidi/Portfolio)

## Common Commands

### Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server (usually http://localhost:5173)
```

### Building
```bash
npm run build           # Create production build in dist/ folder
npm run preview         # Preview production build locally
```

### Deployment
```bash
# Vercel
npm run build && vercel --prod

# Netlify
npm run build           # Then drag dist/ folder to Netlify

# GitHub Pages
npm run build           # Configure vite.config.ts with base path first
```

## Performance Targets

- Lighthouse performance score: 80+
- Initial page load: < 3 seconds on standard broadband
- First Contentful Paint: < 2 seconds
- Image sizes: Thumbnails < 200KB, full-size < 500KB
- All animations: < 1 second duration

## Browser Support

Target modern browsers (last 2 versions):
- Chrome/Edge (Chromium)
- Firefox
- Safari (desktop and iOS)
- iOS Safari
- Android Chrome

No IE11 support required.

## Key Dependencies

```json
{
  "react": "^19.x",
  "react-dom": "^19.x",
  "typescript": "^5.x",
  "vite": "^7.x",
  "tailwindcss": "^4.x",
  "framer-motion": "^12.x",
  "react-hook-form": "^7.x",
  "react-icons": "^5.x",
  "react-intersection-observer": "^9.x"
}
```

## Environment Variables

For contact form integration (EmailJS or Formspree):
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Store in `.env` file (excluded from Git via `.gitignore`).
