# Image Sizing Pattern Standards

## Overview

This project follows a consistent pattern for sizing images in scroll containers, grids, and constrained layouts: **"Parent Controls Everything"**

## Standard Pattern

The parent (or wrapper) element controls all sizing through `width` and `aspect-ratio`. The image element fills its parent using `width: 100%` and `height: 100%`.

### HTML Structure

```html
<div class="container">
  <figure class="image-wrapper">
    <picture>
      <source srcset="..." type="image/webp" />
      <source srcset="..." type="image/jpg" />
      <img src="..." alt="..." class="image" />
    </picture>
  </figure>
</div>
```

### CSS Pattern

```css
/* Parent/Wrapper controls sizing */
.container {
  width: 280px; /* Fixed or constrained width */
  aspect-ratio: 4 / 5; /* Parent controls height via aspect ratio */
}

/* Picture element fills parent */
.image-wrapper picture {
  display: block;
  width: 100%;
  height: 100%;
}

/* Image fills parent */
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

## Why This Pattern?

1. **Clear Ownership:** Parent controls layout, child renders content
2. **Meets Requirement:** "Parent should decide the size of the image, especially the height"
3. **Maintainable:** One place to change sizing (parent), not multiple places
4. **Predictable:** Same pattern works across scroll, grid, and flex containers
5. **Flexible:** Easy to create variants with different aspect ratios
6. **No Redundancy:** Aspect ratio declared once on parent, not duplicated on image

## Reference Implementations

### ✓ Grid.astro (lines 86-99)
Perfect example of parent control pattern in grid layout.

```css
.grid-item {
  width: 100%;
  aspect-ratio: 4 / 5; /* Parent controls size */
  overflow: hidden;
  border-radius: 8px;
  position: relative;
}

.grid-item > * {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### ✓ artist-card.css (lines 24-41, 100-121)
Used in page-level artist sections. Demonstrates parent control with flexbox.

```css
.artist-card {
  aspect-ratio: 4/5; /* Parent decides card aspect */
  width: 320px;
  display: flex;
  flex-direction: column;
}

.artist-image {
  position: absolute;
  width: 85%;
  aspect-ratio: 4/5; /* Image area within card */
}

.artist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### ✓ ContentScrollContainer.astro (lines 136-154)
Scroll container with proper parent control.

```css
.scroll-image-figure {
  margin: 0;
  width: 100%;
  aspect-ratio: 4 / 5; /* Parent controls height */
  position: relative;
}

.scroll-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

### ✓ EventScrollContainer.astro (lines 289-307)
Event cards with parent-controlled image sizing.

```css
.event-image {
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  aspect-ratio: 4/5; /* Parent controls image height */
}

.event-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

### ✓ ArtistScrollContainer.astro (lines 193-210)
Artist cards in scroll container.

```css
.artist-image {
  flex: 1;
  overflow: hidden;
  aspect-ratio: 4 / 5; /* Parent controls image height */
}

.artist-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

## Common Aspect Ratios

- **4:5 (portrait):** Standard for cards, portraits, scroll containers
- **16:9 (landscape):** Widescreen images, video thumbnails
- **1:1 (square):** Icons, avatars, social media
- **3:2 (photo):** Traditional photography aspect ratio

## Anti-Patterns (Avoid)

### ✗ Inline Styles with aspect-ratio on `<img>`

```html
<!-- DON'T DO THIS -->
<img src="..." style="aspect-ratio: 4/5; object-fit: cover;" />
```

**Why:** Child controls its own height, violates parent control principle, harder to override.

### ✗ Aspect-ratio on Both Wrapper AND Image

```css
/* DON'T DO THIS */
.wrapper {
  aspect-ratio: 4 / 5;
}

.image {
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 5; /* ← Redundant! */
  object-fit: cover;
}
```

**Why:** Redundant, harder to maintain, unclear which declaration "wins".

### ✗ Child Components Controlling Height in Constrained Containers

```css
/* DON'T DO THIS in scroll/grid containers */
.container {
  width: 280px;
  /* No height control */
}

.image {
  width: 100%;
  aspect-ratio: 4/5; /* ← Image decides own height */
}
```

**Why:** Breaks encapsulation, parent doesn't control layout, harder to create consistent designs.

## Migration Checklist

When updating components to follow this pattern:

1. **Remove inline styles** from `<img>` elements
2. **Move aspect-ratio** to parent/wrapper element
3. **Add picture element styling** if using `<picture>` tags
4. **Set image to fill parent:** `width: 100%; height: 100%; display: block;`
5. **Add object-fit: cover** to handle cropping
6. **Test across breakpoints** to ensure responsive behavior

## Exceptions

The only acceptable exception to this pattern is when images are **truly unconstrained** (e.g., article body content where natural image aspect ratio should be preserved).

In these cases, use:

```css
.article-content img {
  max-width: 100%;
  height: auto; /* Preserve aspect ratio */
  display: block;
}
```

## Questions?

If you're unsure which pattern to use:
- **Constrained layout** (scroll, grid, flex with fixed dimensions)? → Use parent control pattern
- **Unconstrained content** (article body, free-flowing text)? → Use natural aspect ratio

When in doubt, use the parent control pattern - it's more maintainable and consistent.
