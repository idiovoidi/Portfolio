# Image Processing Scripts

## Quick Start

### Process Photography Images

```powershell
# Basic usage - process all images from a folder
.\scripts\optimize-photos.ps1 -SourceFolder "C:\Users\Mitchell\Desktop\All Images (Photography)\2015 - Canon EOS 600"

# Custom output folder
.\scripts\optimize-photos.ps1 -SourceFolder "C:\path\to\photos" -OutputFolder "public/photography"

# Adjust quality settings
.\scripts\optimize-photos.ps1 -SourceFolder "C:\path\to\photos" -ThumbQuality 85 -FullQuality 90
```

## Prerequisites

### Install ImageMagick (Required)

**IMPORTANT:** Use the Q16 version (NOT Q16-HDRI) to avoid color/quality issues with photos.

**Option 1: Direct Download (Recommended)**
1. Download **ImageMagick-7.x.x-Q16-x64-dll.exe** from: https://imagemagick.org/script/download.php#windows
2. Run installer (choose "Install legacy utilities" option)
3. Restart PowerShell

**Option 2: Chocolatey**
```powershell
choco install imagemagick
```
Note: Chocolatey may install HDRI version. If images look "deep fried", uninstall and use Option 1.

**Verify Installation:**
```powershell
magick --version
```

## Script Parameters

### optimize-photos.ps1

| Parameter       | Required | Default      | Description                               |
| --------------- | -------- | ------------ | ----------------------------------------- |
| `-SourceFolder` | Yes      | -            | Path to folder containing original photos |
| `-OutputFolder` | No       | `public/art` | Where to save optimized images            |
| `-ThumbSize`    | No       | `600`        | Thumbnail dimensions (square)             |
| `-FullSize`     | No       | `1920`       | Max dimension for full-size images        |
| `-ThumbQuality` | No       | `80`         | WebP quality for thumbnails (0-100)       |
| `-FullQuality`  | No       | `85`         | WebP quality for full-size (0-100)        |

## What the Script Does

1. **Finds all images** in source folder (JPG, JPEG, PNG)
2. **Creates thumbnails**: 600x600px square, center-cropped, ~80% quality
3. **Creates full-size**: Max 1920px (maintains aspect ratio), ~85% quality
4. **Converts to WebP**: Modern format for better compression
5. **Names files**: Converts to kebab-case (e.g., "My Photo 2015.jpg" → "my-photo-2015-thumb.webp")
6. **Reports file sizes**: Warns if exceeding recommended limits

## Output Structure

```
public/art/
├── photo-name-thumb.webp    (600x600px, <200KB)
├── photo-name-full.webp     (max 1920px, <500KB)
├── another-photo-thumb.webp
└── another-photo-full.webp
```

## Examples

### Process 2015 Canon Photos

```powershell
.\scripts\optimize-photos.ps1 -SourceFolder "C:\Users\Mitchell\Desktop\All Images (Photography)\2015 - Canon EOS 600"
```

### Process Multiple Folders

```powershell
# Process each folder separately
.\scripts\optimize-photos.ps1 -SourceFolder "C:\Photos\2015 - Canon EOS 600"
.\scripts\optimize-photos.ps1 -SourceFolder "C:\Photos\2016 - Travel"
.\scripts\optimize-photos.ps1 -SourceFolder "C:\Photos\2017 - Portraits"
```

### Higher Quality Settings

```powershell
# For portfolio hero images or featured work
.\scripts\optimize-photos.ps1 -SourceFolder "C:\Photos\Featured" -ThumbQuality 90 -FullQuality 95
```

## After Processing

1. **Review images** in `public/art/` folder
2. **Update data file** at `src/data/artworks.ts`:

```typescript
{
  id: 'photo-name',
  title: 'Photo Title',
  image: '/art/photo-name-thumb.webp',
  fullImage: '/art/photo-name-full.webp',
  medium: 'Photography',
  tools: ['Canon EOS 600D'],
  date: '2015-06',
  category: 'Photography'
}
```

3. **Test locally**: `npm run dev`
4. **Check performance**: Run Lighthouse audit in Chrome DevTools

## Troubleshooting

### "ImageMagick not found"

- Install ImageMagick (see Prerequisites above)
- Restart PowerShell after installation
- Verify with `magick --version`

### "Execution policy" error

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Images too large

- Reduce quality: `-ThumbQuality 70 -FullQuality 75`
- Reduce dimensions: `-ThumbSize 500 -FullSize 1600`

### Images too blurry

- Increase quality: `-ThumbQuality 90 -FullQuality 95`
- Check source image resolution

## File Size Guidelines

- **Thumbnails**: Target < 200KB (script warns if exceeded)
- **Full-size**: Target < 500KB (script warns if exceeded)
- **Total page**: Keep under 2MB for all images combined

## Performance Tips

- Process only images you'll actually use
- Delete unused images from `public/art/`
- Use lazy loading (already implemented in portfolio)
- Run Lighthouse audits regularly
