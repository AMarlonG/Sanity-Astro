# Image Handling Documentation

This document explains how images are structured, fetched, optimized, and rendered in this Sanity + Astro project.

## Architecture Overview

```
┌─────────────────┐
│  Sanity CMS     │  Image storage + metadata (dimensions, blurHash, LQIP)
└────────┬────────┘
         │ GROQ queries
         ↓
┌─────────────────┐
│ sanityImage.ts  │  Utility functions for image optimization
└────────┬────────┘
         ↓
┌─────────────────┐
│  Components     │  Image.astro, ArtistScrollContainer, EventScrollContainer
└─────────────────┘
```

## Core Files

| File | Purpose |
|------|---------|
| `frontend/src/lib/sanityImage.ts` | Central image utility (URL generation, responsive sets, metadata) |
| `frontend/src/components/Image.astro` | Reusable image component with optimization features |
| `frontend/src/styles/global.css` | Global image styles (aspect ratios, dark mode, print) |

## 1. Fetching Images from Sanity

### Required GROQ Pattern

Always fetch complete image metadata for optimization:

```groq
"image": image{
  asset->{
    _id,
    url,
    metadata {
      dimensions {
        width,
        height,
        aspectRatio
      },
      lqip,      // Low-Quality Image Placeholder
      blurHash   // For blur-up effect
    }
  },
  hotspot,     // Smart cropping
  crop         // Manual crop
}
```

**Examples:**
- `frontend/src/components/ArtistScrollContainer.astro:22-46`
- `frontend/src/components/EventScrollContainer.astro:38-64`
- `frontend/src/pages/program/[slug].astro:41-49`

### Best Practice
Use the image fragment from `studio/lib/queries/fragments.ts` for consistency:

```typescript
import { imageFragment } from '../lib/queries/fragments';

const QUERY = `*[_type == "artist"]{
  _id,
  name,
  ${imageFragment}
}`;
```

## 2. Rendering Images

### Option A: Using the `<Image>` Component (Recommended)

For content blocks and page images:

```astro
---
import Image from '../components/Image.astro';
---

<Image
  image={event.image}
  alt={event.imageAlt || event.title}
  size="large"
  aspectRatio="16:9"
  priority={false}
/>
```

**Props:**
- `size`: 'small' | 'medium' | 'large' | 'full'
- `aspectRatio`: '4:5' | '1:1' | '16:9' | '9:16' | number
- `priority`: true for above-the-fold images
- `loading`: 'lazy' | 'eager'
- `quality`: Override IMAGE_QUALITY preset

**Reference:** `frontend/src/components/Image.astro:13-31`

### Option B: Using Utility Functions Directly

For scroll containers and custom layouts:

```astro
---
import { getResponsiveImageSet, getOptimizedImageUrl, IMAGE_QUALITY } from '../lib/sanityImage';

const aspectRatio = 4 / 5;
const responsiveImages = getResponsiveImageSet(
  imageData,
  [240, 300, 320],      // Widths for different screen sizes
  ['webp', 'jpg'],      // Format cascade
  aspectRatio,
  IMAGE_QUALITY.CARD
);

const fallbackUrl = getOptimizedImageUrl(imageData, 300, 375, IMAGE_QUALITY.CARD);
---

<picture>
  {responsiveImages
    .filter((format) => format.srcset.length > 0)
    .map((format) => (
    <source
      srcset={format.srcset}
      sizes="(max-width: 768px) 240px, 300px"
      type={`image/${format.format}`}
    />
  ))}
  <img
    src={fallbackUrl}
    alt={imageAlt}
    width="300"
    height="375"
    loading="lazy"
    decoding="async"
    style="aspect-ratio: 4/5; object-fit: cover;"
  />
</picture>
```

**Reference:**
- `frontend/src/components/ArtistScrollContainer.astro:70-106`
- `frontend/src/components/EventScrollContainer.astro:117-158`

## 3. Image Quality Presets

Use predefined quality constants from `sanityImage.ts`:

```typescript
export const IMAGE_QUALITY = {
  THUMBNAIL: 60,  // Small previews
  CARD: 75,       // Artist/event cards (default for scroll containers)
  HERO: 85,       // Hero images
  FULL: 90,       // Full-page images
  LQIP: 20        // Low-quality placeholders
};
```

**Reference:** `frontend/src/lib/sanityImage.ts:14-20`

## 4. Optimization Features

### Automatic Optimizations
✅ **Responsive Images**: Multiple sizes for different viewports
✅ **Format Cascade**: WebP → JPG fallback
✅ **Lazy Loading**: Images load only when near viewport
✅ **CLS Prevention**: Explicit width/height attributes
✅ **Blur-up Effect**: LQIP/BlurHash placeholders
✅ **Dark Mode**: Automatic brightness adjustment
✅ **Print Optimization**: Prevents page breaks through images

### Performance Best Practices

1. **Always provide width/height** to prevent Cumulative Layout Shift (CLS):
   ```astro
   <img width="300" height="375" ... />
   ```

2. **Use aspect-ratio** for responsive scaling:
   ```astro
   style="aspect-ratio: 4/5; object-fit: cover;"
   ```

3. **Set priority for above-the-fold images**:
   ```astro
   <Image priority={true} loading="eager" />
   ```

4. **Use appropriate quality presets**:
   - Cards: `IMAGE_QUALITY.CARD` (75)
   - Heroes: `IMAGE_QUALITY.HERO` (85)
   - Thumbnails: `IMAGE_QUALITY.THUMBNAIL` (60)

## 5. Common Patterns

### Artist Cards (4:5 Aspect Ratio)
```typescript
const aspectRatio = 4 / 5;
const responsiveImages = getResponsiveImageSet(
  artistImage,
  [240, 280, 320],
  ['webp', 'jpg'],
  aspectRatio,
  IMAGE_QUALITY.CARD
);
const fallbackUrl = getOptimizedImageUrl(artistImage, 280, 350, IMAGE_QUALITY.CARD);
```

### Event Cards (4:5 Aspect Ratio)
```typescript
const aspectRatio = 4 / 5;
const responsiveImages = getResponsiveImageSet(
  eventImage,
  [240, 300, 320],
  ['webp', 'jpg'],
  aspectRatio,
  IMAGE_QUALITY.CARD
);
const fallbackUrl = getOptimizedImageUrl(eventImage, 300, 375, IMAGE_QUALITY.CARD);
```

### Hero Images (16:9 Aspect Ratio)
```astro
<Image
  image={heroImage}
  alt={heroAlt}
  size="full"
  aspectRatio="16:9"
  priority={true}
  quality={IMAGE_QUALITY.HERO}
/>
```

## 6. Global CSS Utilities

Available utility classes from `global.css`:

```css
/* Aspect ratios */
.aspect-square    /* 1:1 */
.aspect-video     /* 16:9 */
.aspect-portrait  /* 4:5 */
.aspect-tall      /* 9:16 */

/* Object fit */
.object-cover
.object-contain
```

**Reference:** `frontend/src/styles/global.css:558-575`

## 7. Sanity Visual Editing Support

Images maintain Visual Editing compatibility through:

1. **GROQ queries include _id and _type**
2. **Components preserve data-sanity attributes**
3. **Image component accepts _key and _type props**

Example:
```astro
<Image
  image={block.image}
  _key={block._key}
  _type={block._type}
  ...
/>
```

## 8. Troubleshooting

### Issue: Images not loading
- ✓ Check GROQ query includes `asset->` reference
- ✓ Verify `metadata` block is fetched
- ✓ Ensure image exists in Sanity

### Issue: Layout shifts (CLS)
- ✓ Add explicit `width` and `height` attributes
- ✓ Use `aspect-ratio` CSS property
- ✓ Ensure correct aspect ratio calculation

### Issue: Slow loading
- ✓ Use appropriate quality preset (don't over-optimize)
- ✓ Enable lazy loading for below-fold images
- ✓ Check image sizes match actual display size

### Issue: Wrong aspect ratio
- ✓ Verify aspect ratio calculation: `width / height` (not `height / width`)
- ✓ Check that `style="aspect-ratio: X/Y"` matches dimensions

## 9. Migration Notes

**Deprecated:** `imageHelpers.ts`, `imageUtils.ts` (removed)
**Current:** `sanityImage.ts` (unified utility)

All image handling now uses the unified `sanityImage.ts` utility for consistency and maintainability.

---

**Last Updated:** 2025-11-06
**Maintained By:** Development Team
