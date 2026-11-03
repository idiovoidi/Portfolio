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
- `public/og-image.png` is a 1200x630 screenshot of the landing page (void + particles, nav and buttons hidden).
  Retake it if the hero changes. `public/og-image.svg` is the old design and is no longer referenced.
