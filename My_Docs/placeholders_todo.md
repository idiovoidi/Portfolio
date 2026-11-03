# Placeholders to fill in

## Site URL in index.html
Social crawlers (Discord, LinkedIn, Slack, X) need absolute URLs for the preview image. The deployed
domain isn't recorded anywhere in the repo, so these still contain `https://YOUR-DOMAIN.example`:

- `og:url`
- `og:image` (-> `/og-image.png`)
- `twitter:image` (-> `/og-image.png`)

Replace `https://YOUR-DOMAIN.example` with the real URL (e.g. the Vercel domain) in all three.
Then re-scrape the link (LinkedIn Post Inspector, Discord/Slack cache) to see the new preview.

## Decisions made (change if wrong)
- `[Your Name]` was replaced with the handle `idiovoidi` (used in README, nav and OG image). If you want
  your real name in the title/author meta, edit `index.html`.
- Favicon is a simple generated `public/favicon.svg` ("i" on the purple theme). Replace it with a real logo if you have one.
- `public/og-image.png` was rendered from `public/og-image.svg`. Re-render if you edit the SVG.
