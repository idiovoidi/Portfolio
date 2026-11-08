# Project Structure

## Folder Organization

```
portfolio/
├── public/                    # Static assets served as-is
│   ├── projects/             # Project screenshots and thumbnails
│   ├── art/                  # Art portfolio pieces (thumbnails and full-size)
│   └── favicon.ico
├── src/
│   ├── components/           # React components
│   │   ├── layout/          # Layout components (Header, Footer, Navigation)
│   │   ├── sections/        # Page sections (Hero, Projects, Skills, Contact)
│   │   └── ui/              # Reusable UI components (Button, Card, Badge)
│   ├── data/                # Content data files (TypeScript)
│   │   ├── projects.ts      # Project portfolio data
│   │   ├── artworks.ts      # Art gallery data
│   │   ├── skills.ts        # Skills and tech stack
│   │   └── personal.ts      # Personal info and social links
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions and helpers
│   ├── styles/              # Global styles and CSS
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Conventions

- Section and UI components use named exports. Content arrays live in `src/data/`, including music, videos, and 3D works.
- Scroll motion uses `useInView` from `src/hooks` and the variants in `src/utils/animations.ts`.
- Navigation and footer share `navLinks` from `src/data/navigation.ts`.
- Content sections use the `Section` wrapper so `.section`, `.container-custom`, `.section-heading`, and `.section-subheading` stay consistent.
- Heavy sections (art, NFTs, music, videos, 3D) load with `lazySection`. Music and video iframes mount only when the section is near the viewport.

## Component Architecture

### Layout Components (`src/components/layout/`)
- **Header.tsx**: Fixed navigation with scroll effects
- **Navigation.tsx**: Desktop nav + mobile hamburger menu
- **Footer.tsx**: Social links, copyright, quick links

### Section Components (`src/components/sections/`)
- **Hero.tsx**: Landing section with name, title, CTA buttons
- **Projects.tsx**: Project grid with filtering
- **ArtGallery.tsx**: Art portfolio with lightbox (optional separate section)
- **Skills.tsx**: Categorized tech stack display
- **Contact.tsx**: Contact form + contact info

### UI Components (`src/components/ui/`)
- **Button.tsx**: Reusable button with variants (primary, secondary, outline)
- **ProjectCard.tsx**: Individual project display with hover effects
- **ArtPieceCard.tsx**: Art piece display with click-to-expand
- **EmbeddedDemo.tsx**: Iframe wrapper for games/interactive demos
- **Lightbox.tsx**: Modal for full-size art viewing
- **SkillBadge.tsx**: Individual skill display with icon
- **SocialLinks.tsx**: Social media icon links

## Data Management

All content is stored in TypeScript files under `src/data/` for easy updates:

### Adding New Projects
Edit `src/data/projects.ts` and add a new object to the array:
```typescript
{
  id: 'unique-id',
  title: 'Project Name',
  description: 'Brief description',
  image: '/projects/project-thumb.webp',
  technologies: ['React', 'TypeScript'],
  liveUrl: 'https://demo.com',
  githubUrl: 'https://github.com/user/repo',
  embedUrl: 'https://game-url.com',  // Optional for embedded demos
  category: 'development' | 'game' | 'art' | 'design',
  featured: true  // Optional
}
```

### Adding New Artworks
Edit `src/data/artworks.ts`:
```typescript
{
  id: 'unique-id',
  title: 'Artwork Title',
  image: '/art/artwork-thumb.webp',
  fullImage: '/art/artwork-full.webp',
  medium: 'Digital Art',
  tools: ['Photoshop', 'Blender'],
  date: '2025-01',
  category: 'Character Design'
}
```

### Image Naming Convention
- Use descriptive kebab-case: `tower-defense-gameplay.webp`
- Thumbnails: `project-name-thumb.webp`
- Full size: `project-name-full.webp`
- Store in appropriate public folder (`/projects/` or `/art/`)

## Single-Page Application

The portfolio is built as a single-page application (SPA) with smooth scrolling between sections. All sections are rendered in `App.tsx` and navigation uses anchor links with smooth scroll behavior.

## Styling Approach

- **Mobile-first**: Start with mobile layout (320px+), progressively enhance
- **Utility-first**: Use Tailwind CSS classes for most styling
- **Component-specific**: Use CSS Modules only when needed for complex styles
- **Theme system**: CSS custom properties for colors, spacing, typography
- **Dark mode support**: Optional theme switcher using CSS variables

## Responsive Breakpoints

- Mobile: < 768px (single column, hamburger menu)
- Tablet: 768px - 1024px (two-column grid)
- Desktop: 1024px+ (three-column grid, full navigation)
- Max content width: 1280px (centered container)

## File Naming Conventions

- Components: PascalCase (e.g., `ProjectCard.tsx`)
- Utilities: camelCase (e.g., `animations.ts`)
- Data files: camelCase (e.g., `projects.ts`)
- Styles: kebab-case (e.g., `globals.css`)
- Images: kebab-case (e.g., `hero-background.webp`)

## Git Workflow

- Commit regularly with clear, descriptive messages
- Use conventional commit format: `feat:`, `fix:`, `style:`, `docs:`
- Keep commits atomic (one logical change per commit)
- Push to the public GitHub repository (idiovoidi/Portfolio)
