# CSS Architecture Documentation

## Overview

This project uses a modular CSS architecture optimized for maintainability and performance. CSS is organized into focused files with clear separation of concerns.

## File Structure

```
frontend/src/styles/
├── reset.css           # Browser consistency (CSS reset)
├── tokens.css          # Design tokens (variables)
├── base.css            # Typography, links, forms, accessibility
├── utilities.css       # Spacing, display, flexbox, grid utilities
├── components.css      # Buttons, badges, cards
├── layouts.css         # Container patterns, image handling
├── artist-card.css     # Shared artist card component
├── program.css         # Program page specific styles
├── event.css           # Event detail page styles
├── artists.css         # Artist overview page styles
└── global.css.backup   # Original file (pre-refactor backup)
```

## Load Order

CSS files are imported in Layout.astro in a specific order:

```javascript
import '../styles/reset.css';       // 1. Reset browser defaults
import '../styles/tokens.css';      // 2. CSS variables
import '../styles/base.css';        // 3. Base typography/links/forms
import '../styles/utilities.css';   // 4. Utility classes
import '../styles/components.css';  // 5. UI components
import '../styles/layouts.css';     // 6. Layout patterns
import '../styles/artist-card.css'; // 7. Shared components
```

Page-specific CSS (program.css, event.css, artists.css) is imported directly in those pages.

## Critical CSS Strategy

### Current Approach (Recommended)

The project uses **Astro's built-in CSS optimization** which:
- Bundles and minifies CSS at build time
- Removes unused CSS automatically
- Generates optimal output without manual intervention

**Inline Critical Styles** in Layout.astro `<style>` block:
- Page layout grid (sticky footer pattern)
- Skip navigation link
- Print styles
- User preference queries (reduced motion, high contrast)

This approach provides excellent performance without the complexity of manual critical CSS extraction.

### Why Not Async CSS Loading?

Manual async CSS loading was considered but **not implemented** after technical analysis. Here's the detailed reasoning:

#### Performance Reality Check

**Current CSS Size:**
- Per-page CSS bundles: 2-7 KB gzipped
- Largest bundle: 28.30 KB → 6.65 KB gzipped
- Total across all pages: ~25 KB (minified + gzipped)

**Expected Gains from Async Loading:**
- First Contentful Paint improvement: 50-100ms on 4G
- Largest Contentful Paint improvement: 50-150ms on 4G
- Total impact: ~5-10 Lighthouse points

**Why These Gains Are Modest:**
1. CSS is already tiny (below HTTP/2 initial congestion window of 14 KB)
2. Astro automatically splits CSS per-page (no massive global bundle)
3. Critical layout CSS already inlined in Layout.astro
4. Modern browsers aggressively preload stylesheets in `<head>`

#### High-Risk Factors

1. **FOUC with HTMX (HIGH SEVERITY)**
   - HTMX loads content dynamically after initial page load
   - If async CSS hasn't loaded, dynamic content appears unstyled
   - Affects program page filters, artist scrollbars, all dynamic interactions
   - Requires JavaScript coordination to block HTMX until CSS loads

2. **Cumulative Layout Shift Risk (MEDIUM-HIGH)**
   - Async-loaded CSS causes layout recalculation
   - Current CLS likely 0.0 (no shifts)
   - Async CSS could introduce 0.05-0.15 CLS (visible jank)
   - Harms user experience more than 80ms saved helps it

3. **Maintenance Burden (MEDIUM-HIGH)**
   - Critical CSS extraction must be re-evaluated with every CSS change
   - Two CSS files to maintain (critical + async)
   - Build complexity increases
   - Developer velocity decreases
   - Harder to debug styling issues

#### Why Current Approach is Optimal

1. **Astro Already Optimizes**
   - Bundles and minifies at build time
   - Tree-shakes unused CSS automatically
   - Per-page code splitting (not one massive bundle)
   - Critical path handled without manual intervention

2. **Critical CSS Already Inline**
   - Layout.astro has ~260 lines of critical inline CSS
   - Page layout grid (sticky footer pattern)
   - Skip navigation accessibility
   - Print styles and user preference queries
   - This is the 20% that gives 80% of the benefit

3. **Aligns with Project Philosophy**
   - PROJECT_GUIDE.md: "working code > elegant code"
   - Premature optimization is the root of all evil
   - Focus on features, not micro-optimizations

#### The Verdict

**Cost:** 8-16 hours implementation + permanent maintenance burden
**Benefit:** 50-120ms improvement on slow connections
**Risk:** FOUC on every HTMX interaction + potential CLS increase
**ROI:** Poor

**This is textbook premature optimization.** The CSS is already optimized.

### Higher-Impact Optimization Opportunities

If performance becomes an issue, focus on these **instead** of CSS async loading:

#### 1. JavaScript Optimization (31x Larger Than CSS)
- **Visual Editing component:** 654 KB (209 KB gzipped)
- **Current issue:** Loaded on every page, even when not in preview mode
- **Fix:** Lazy-load only when `hasPreviewMode === true`
- **Expected impact:** 500ms-1s faster Time to Interactive
- **Effort:** 3-4 hours

#### 2. Image Optimization (10-50x Larger Than CSS)
- **Current state:** Images likely much larger than CSS
- **Fix:**
  - Use Astro's `<Picture>` component for responsive images
  - Implement AVIF/WebP with JPEG fallback
  - Lazy-load below-the-fold images
  - Add explicit width/height to prevent CLS
- **Expected impact:** 500ms-2s faster LCP
- **Effort:** 4-6 hours

#### 3. Font Loading Strategy
- **Fix:**
  - Preload critical fonts
  - Use `font-display: swap` or `optional`
  - Subset fonts to required characters
- **Expected impact:** 100ms faster FCP, reduced CLS
- **Effort:** 1-2 hours

#### 4. HTTP/2 Server Push (If Not Already Enabled)
- **Fix:** Configure server to push critical CSS with HTML
- **Expected impact:** 100-200ms faster FCP
- **Effort:** Infrastructure configuration
- **Benefit:** No FOUC risk, works with current architecture

#### 5. Monitoring Before Optimizing
- Set up Lighthouse CI
- Monitor Core Web Vitals in production
- Measure first, optimize what actually matters
- Don't optimize based on assumptions

### Performance Budget Guidance

**When to revisit CSS optimization:**
- Total CSS > 50 KB gzipped per page (currently: 2-7 KB)
- FCP > 2.5s on 3G (currently: likely < 1.5s)
- Lighthouse Performance < 80 (currently: likely 90+)
- Real user monitoring shows CSS blocking rendering

**Until then:** Focus on features and higher-impact optimizations (JS, images, fonts).

## Design Patterns

### CSS Custom Properties (Tokens)

All design tokens live in `tokens.css`:
- Colors: `--color-blue`, `--color-green`, etc.
- Spacing: `--space-1` through `--space-12`
- Typography: `--font-size-base`, `--line-height-normal`
- Transitions: `--transition-fast`, `--transition-base`

### Container Queries

Modern responsive design using container queries:
```css
.component {
  container-type: inline-size;
}

@container (max-width: 700px) {
  .component { /* responsive styles */ }
}
```

### Intrinsic CSS

Content-driven layouts without media queries:
```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
}
```

### Scrollbar Pattern

Consistent scrollbar styling defined in `utilities.css` (`.scrollbar-styled`):
- Thin scrollbar with custom colors
- Blue thumb, green hover
- Larger on touch devices
- **Note:** Kept inline in context due to container queries

### HTMX Compatibility

**Important:** CSS must be global (not scoped) because HTMX dynamically loads content that needs these styles. This is why we use file-based CSS instead of Astro's scoped styles.

## Browser Support

### Modern Features Used

| Feature | Support | Fallback Strategy |
|---------|---------|-------------------|
| Container Queries | 93%+ | Traditional media queries via `@supports not` |
| CSS Grid | 96%+ | No fallback needed |
| Logical Properties | 95%+ | Legacy properties provided |
| Custom Properties | 97%+ | No fallback needed |
| `clamp()` | 93%+ | No fallback needed (graceful degradation) |

### Target Browsers

- Chrome/Edge 105+ (container queries)
- Firefox 121+ (container queries)
- Safari 15.4+ (container queries)
- Modern mobile browsers (iOS 15.4+, Android Chrome 105+)

Older browsers get slightly less optimal layouts but remain fully functional.

### Browser Support Philosophy

**Progressive Enhancement Approach:**
1. **Core Experience (All Browsers)**
   - Semantic HTML structure
   - Readable typography
   - Functional navigation
   - Accessible content
   - Works without CSS

2. **Enhanced Experience (Modern Browsers)**
   - Container queries for responsive components
   - Intrinsic CSS layouts (clamp, min/max)
   - CSS custom properties for theming
   - Logical properties for i18n support
   - Advanced scrollbar styling

3. **Fallback Strategy**
   - `@supports not` queries for container queries
   - Traditional media queries as fallback
   - Legacy physical properties alongside logical ones
   - Graceful degradation (not feature parity)

### Testing Browsers

**Priority Testing:**
- Latest Chrome (primary development browser)
- Latest Safari (iOS/macOS consistency)
- Latest Firefox (standards compliance)
- Safari iOS 15.4+ (container query baseline)

**Occasional Testing:**
- Edge (Chromium-based, usually same as Chrome)
- Firefox Android
- Chrome Android

**No Support:**
- Internet Explorer (end of life)
- Safari < 15.4 (lacks container queries)
- Chrome < 105 (lacks container queries)

Users on unsupported browsers will get functional but less polished layouts.

## Best Practices

### When to Create New CSS

1. **Use existing utilities first** - Check `utilities.css` for spacing, display, etc.
2. **Page-specific styles** - Create new file (e.g., `contact.css`)
3. **Shared components** - Add to `components.css` or create separate file
4. **Layout patterns** - Add to `layouts.css`

### Naming Conventions

- **BEM-style** for component classes: `.component-name`, `.component__element`, `.component--modifier`
- **Utility classes** - Single purpose: `.flex`, `.gap-4`, `.text-center`
- **Semantic names** - Describe purpose, not appearance: `.card` not `.box-with-border`

### Code Organization

```css
/* File header with purpose */

/* ============================================
   SECTION NAME
   ============================================

   Brief description of what this section does.
*/

.class-name {
  /* Properties in logical order:
     1. Position/layout
     2. Box model
     3. Typography
     4. Visual
     5. Misc
  */
}
```

### Accessibility

All CSS follows accessibility guidelines:
- Sufficient color contrast (WCAG AA minimum)
- Focus indicators on interactive elements
- Respects user preferences (prefers-reduced-motion, prefers-contrast)
- Skip navigation links
- Semantic HTML structure

## Refactor History

### Phase 1: Extract Shared Components
- Created `artist-card.css` from duplicated code
- Eliminated 330+ lines of duplication
- Improved maintainability

### Phase 2: Split Global CSS
- Split `global.css` (860 lines) into 4 focused files
- Improved organization and findability
- Clearer separation of concerns

### Phase 3: Document Scrollbar Pattern
- Created `.scrollbar-styled` utility pattern
- Documented usage across scroll containers
- Maintained inline styles for container query contexts

### Phase 4: Critical CSS Analysis & Documentation
- Analyzed current CSS performance (2-7 KB gzipped per page)
- Evaluated async CSS loading proposal with technical assessment
- **Decision:** Do NOT implement async loading (premature optimization)
- **Rationale:**
  - Expected gain: 50-120ms (minimal)
  - Risk: FOUC with HTMX + increased CLS
  - Cost: 8-16 hours + permanent maintenance burden
  - ROI: Poor
- Documented higher-impact optimization opportunities (JS, images, fonts)
- Current approach already optimal for this project's needs

## Performance Metrics

Current CSS performance is excellent:
- Total CSS size: ~25KB (minified + gzipped)
- First Contentful Paint: Fast
- No render-blocking issues
- Astro optimization handles bundling

No further optimization needed unless metrics indicate a problem.

## Maintenance

### Adding New Styles

1. Determine category (base, utility, component, layout, page-specific)
2. Add to appropriate file
3. Follow existing patterns and naming
4. Test across key pages
5. Update this documentation if architecture changes

### Modifying Existing Styles

1. Search for class name across all CSS files
2. Consider impact on other pages/components
3. Test changes visually
4. Watch for HTMX dynamic content compatibility

### Troubleshooting

**Issue:** Styles not applying to HTMX-loaded content
- **Solution:** Ensure styles are in global CSS files, not scoped

**Issue:** Container queries not working
- **Solution:** Check `@supports not (container-type: inline-size)` fallback

**Issue:** Layout shift on page load
- **Solution:** Check if critical styles are inline in Layout.astro

## Resources

- [Astro CSS Docs](https://docs.astro.build/en/guides/styling/)
- [Container Queries MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [Intrinsic CSS](https://every-layout.dev/)
- [HTMX Docs](https://htmx.org/)

---

**Last Updated:** 2025-01-06
**Maintainer:** Development Team
