# idiovoidi - Developer Portfolio

A modern, dark-themed developer portfolio showcasing projects, skills, and digital artwork.

## Deep links (e.g. for job applications)

Add a section id as a hash to the site URL to open the page at that section:

```
https://<your-domain>/#commercial
```

The Commercial section is the one to share with employers. Other section ids:

| Section             | Link                  |
| ------------------- | --------------------- |
| Home                | `/#home`              |
| Projects            | `/#projects`          |
| Art                 | `/#art-gallery`       |
| NFTs                | `/#nft-gallery`       |
| Music               | `/#music`             |
| Videos              | `/#videos`            |
| 3D                  | `/#three-d`           |
| **Commercial**      | **`/#commercial`**    |
| Software Experience | `/#software-experience` |
| Contact             | `/#contact`           |

Notes:

- Sections load lazily and images shift the layout, so `useHashScroll`
  ([src/hooks/useHashScroll.ts](src/hooks/useHashScroll.ts)) keeps re-aligning to
  the target for up to 6 seconds while the page settles. It stops as soon as the
  visitor scrolls, touches, clicks or presses a key.
- The nav bar's smooth-scroll buttons don't update the address bar, so copying
  the URL after clicking a nav item won't give a deep link. Type the hash in
  yourself, as above.
- Ids come from [src/data/navigation.ts](src/data/navigation.ts). Renaming a
  section id there (or on the section itself) breaks existing shared links.

## Commercial section assets

- Photos live in `public/commercial/`; list new ones in
  [src/data/commercialManifests.ts](src/data/commercialManifests.ts).
- Grid thumbnails (`public/commercial/thumbs/`) are git-ignored and must be
  generated: `npm run thumbs:commercial` (needs ImageMagick on PATH).
