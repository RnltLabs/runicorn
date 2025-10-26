# Performance Optimization Quick Reference

**For**: Runicorn Development Team
**Last Updated**: 2025-10-26

---

## Quick Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Performance Testing
```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Run Lighthouse
npm run build && npm run preview
# Then: Chrome DevTools → Lighthouse → Analyze

# Lighthouse CI (automated)
npx @lhci/cli@latest autorun

# Optimize images
node scripts/optimize-images.js
```

### Debugging
```bash
# Check bundle composition
npm run build -- --mode development

# Analyze chunk sizes
ls -lh dist/assets/*.js

# Check image sizes
ls -lh public/*.{png,webp,jpg}
```

---

## Bundle Size Guidelines

### Current State (After Optimization)
| Chunk | Size | Lazy? | Priority |
|-------|------|-------|----------|
| react-vendor | ~130 KB | No | High |
| map-vendor | ~230 KB | Yes | Low |
| ui-vendor | ~150 KB | No | Medium |
| monitoring-vendor | ~100 KB | No | Medium |
| index (app code) | ~100 KB | No | High |

**Total Initial Load**: ~280 KB (gzipped: ~90 KB)
**Total Lazy Load**: ~230 KB (map, loaded on demand)

### Budget Limits
- **Per Chunk**: <300 KB (warning at build)
- **Initial Load**: <500 KB total
- **Images**: <100 KB per image (WebP)

### What to Do When Warning Appears
```
(!) Some chunks are larger than 300 kB after minification.
```

**Action Steps**:
1. Run `npx vite-bundle-visualizer` to identify large dependencies
2. Check if library can be lazy loaded
3. Consider dynamic imports for heavy components
4. Look for duplicate dependencies (check if multiple versions installed)

---

## Core Web Vitals Targets

### Google's "Good" Thresholds

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| **LCP** (Largest Contentful Paint) | <2.5s | 2.5-4.0s | >4.0s |
| **INP** (Interaction to Next Paint) | <200ms | 200-500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |
| **FCP** (First Contentful Paint) | <1.8s | 1.8-3.0s | >3.0s |
| **TTFB** (Time to First Byte) | <800ms | 800-1800ms | >1800ms |

### How to Improve Each Metric

#### Improve LCP (Loading Performance)
- ✅ Optimize images (use WebP, compress)
- ✅ Lazy load below-fold content
- ✅ Preload critical resources
- ✅ Use CDN for static assets
- ✅ Minimize render-blocking resources

#### Improve INP (Responsiveness)
- ✅ Code split large bundles
- ✅ Use debouncing for frequent events
- ✅ Avoid long tasks (>50ms)
- ✅ Minimize JavaScript execution
- ✅ Use web workers for heavy computations

#### Improve CLS (Visual Stability)
- ✅ Always set width/height on images
- ✅ Reserve space for dynamic content
- ✅ Use `font-display: swap` for fonts
- ✅ Avoid inserting content above existing content
- ✅ Use CSS transforms instead of layout properties

---

## Image Optimization

### Formats by Use Case
| Use Case | Format | Quality | Max Size |
|----------|--------|---------|----------|
| Screenshots | WebP | 85% | 250 KB |
| Social Media (OG) | WebP | 90% | 100 KB |
| Logos/Icons | PNG | - | 20 KB |
| Photos | WebP | 80-85% | 150 KB |

### Optimization Workflow
```bash
# 1. Add image to public/
cp image.png public/

# 2. Run optimization script
node scripts/optimize-images.js

# 3. Use optimized image
# Before: /image.png
# After:  /image.webp
```

### Responsive Images Template
```html
<picture>
  <source srcset="/image-large.webp" media="(min-width: 1024px)" type="image/webp" />
  <source srcset="/image-medium.webp" media="(min-width: 640px)" type="image/webp" />
  <source srcset="/image-small.webp" type="image/webp" />
  <img src="/image-small.png" alt="Description" width="800" height="600" />
</picture>
```

---

## Code Splitting Patterns

### When to Lazy Load
- ✅ Routes (if using router)
- ✅ Modals/Dialogs (below-fold)
- ✅ Charts/Data visualizations
- ✅ Heavy libraries (>50 KB)
- ✅ Map components
- ❌ Critical UI components
- ❌ Above-fold content
- ❌ Small utilities (<10 KB)

### Lazy Loading Template
```typescript
import { lazy, Suspense } from 'react'

// Heavy component (>50 KB)
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Dynamic Import for Libraries
```typescript
// Before (eager load)
import * as d3 from 'd3'

// After (lazy load)
async function loadChart() {
  const d3 = await import('d3')
  // Use d3 here
}
```

---

## Font Loading Best Practices

### Current Setup (Self-Hosted)
```typescript
// src/main.tsx
import '@fontsource/figtree/300.css'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@fontsource/figtree/800.css'
```

### Font Loading Strategies
| Strategy | Use Case | FOUT | FOIT |
|----------|----------|------|------|
| `display: swap` | **Recommended** | Yes | No |
| `display: fallback` | Body text | Minimal | Minimal |
| `display: optional` | Non-critical | Yes | No |
| `display: block` | Critical branding | No | Yes (3s) |

**FOUT** = Flash of Unstyled Text (system font shows first)
**FOIT** = Flash of Invisible Text (text hidden while loading)

### Adding New Fonts
```bash
# 1. Install font
npm install @fontsource/new-font

# 2. Import in main.tsx
import '@fontsource/new-font/400.css'

# 3. Use in CSS
font-family: 'New Font', sans-serif;
```

---

## Resource Hints Cheatsheet

### Types of Resource Hints
```html
<!-- DNS resolution only -->
<link rel="dns-prefetch" href="https://example.com" />

<!-- DNS + TCP + TLS handshake -->
<link rel="preconnect" href="https://example.com" />

<!-- Download resource now -->
<link rel="preload" href="/critical.css" as="style" />

<!-- Download resource when idle -->
<link rel="prefetch" href="/next-page.js" as="script" />

<!-- Render page in background -->
<link rel="prerender" href="/next-page.html" />
```

### When to Use Each
| Hint | Use Case | Example |
|------|----------|---------|
| `dns-prefetch` | Third-party domains | Analytics, CDN |
| `preconnect` | Critical third-party | API servers |
| `preload` | Critical resources | Above-fold images, fonts |
| `prefetch` | Next page resources | Route prefetching |
| `prerender` | High-confidence next page | Login → Dashboard |

---

## Performance Monitoring

### Umami Analytics Events
```typescript
// Track custom events
window.umami?.track('button_click', { button: 'sign_up' })

// Track Web Vitals (automatic)
// Events: 'web-vitals' with metric data
```

### GlitchTip Error Tracking
```typescript
import * as Sentry from '@sentry/react'

// Manual error tracking
try {
  riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'route-planning' },
    extra: { userId: user.id },
  })
}
```

### Lighthouse Scoring
| Category | Weight | Key Audits |
|----------|--------|------------|
| Performance | 100% | LCP, TBT, CLS, FCP, SI |
| Accessibility | 100% | Color contrast, ARIA, alt text |
| Best Practices | 100% | HTTPS, console errors, deprecated APIs |
| SEO | 100% | Meta tags, crawlability, mobile-friendly |

---

## Common Issues & Solutions

### Issue: Bundle Too Large
**Symptoms**: Vite warning, slow initial load

**Solutions**:
1. Check for duplicate dependencies: `npm ls <package>`
2. Use bundle analyzer: `npx vite-bundle-visualizer`
3. Lazy load heavy components
4. Review and remove unused dependencies

---

### Issue: Slow LCP
**Symptoms**: Lighthouse LCP > 2.5s

**Solutions**:
1. Optimize largest image (use WebP, compress)
2. Preload critical resources
3. Remove render-blocking scripts
4. Use CDN for static assets
5. Enable text compression (gzip/brotli)

---

### Issue: High CLS
**Symptoms**: Layout shifts during load

**Solutions**:
1. Set width/height on all images
2. Reserve space for dynamic content
3. Use `font-display: swap`
4. Avoid injecting content above fold
5. Use aspect-ratio CSS property

---

### Issue: Poor INP
**Symptoms**: Slow button clicks, laggy interactions

**Solutions**:
1. Reduce JavaScript bundle size
2. Debounce frequent event handlers
3. Use `requestIdleCallback` for non-critical work
4. Move heavy computations to web workers
5. Optimize React re-renders (useMemo, useCallback)

---

## Testing Checklist

### Before Every PR
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] Bundle size within limits (<300 KB per chunk)
- [ ] Images optimized to WebP
- [ ] No console.log in production code

### Before Production Deployment
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals in "Good" range
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing
- [ ] Social media preview testing
- [ ] Error tracking working (GlitchTip)
- [ ] Analytics tracking working (Umami)

### After Deployment
- [ ] Monitor error rates (first 24 hours)
- [ ] Check Web Vitals (first week)
- [ ] Verify social media previews
- [ ] Test on real devices (mobile)

---

## Useful Tools

### Browser DevTools
- **Network Tab**: Check waterfall, bundle sizes, compression
- **Performance Tab**: Record user interactions, analyze flame chart
- **Lighthouse**: Run performance audits
- **Coverage**: Find unused CSS/JS

### Online Tools
- **WebPageTest**: https://www.webpagetest.org/
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/

### npm Packages
```bash
# Bundle analysis
npx vite-bundle-visualizer

# Performance testing
npx @lhci/cli@latest autorun

# Image optimization
npm install --save-dev sharp

# Accessibility testing
npx @axe-core/cli https://runicorn.io
```

---

## Questions & Support

**Performance Issues**: Check PERFORMANCE_SEO_AUDIT.md for detailed analysis

**Implementation Help**: See OPTIMIZATION_CHECKLIST.md for step-by-step guide

**Contact**: Roman Reinelt (hello@rnltlabs.de)

**Resources**:
- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance](https://react.dev/learn/render-and-commit)
