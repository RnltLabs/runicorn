# Runicorn Performance Optimization Checklist

**Linear Issue**: RNLT-36
**Branch**: feature/comprehensive-site-audit
**Sprint**: Current (Week of 2025-10-26)

---

## P0 - Critical Priority (Sprint 1 - This Week)

### 1. Code Splitting for Leaflet ⏱️ 30 minutes

**Goal**: Reduce initial bundle from 876 KB to ~300 KB

- [ ] Create `src/components/MapView.tsx` to extract map logic
- [ ] Update `src/App.tsx` to lazy load MapView
- [ ] Add Suspense boundary with loading skeleton
- [ ] Test map functionality after lazy loading
- [ ] Verify bundle size reduction

**Files to modify**:
- `/Users/roman/Development/runicorn/src/App.tsx`
- `/Users/roman/Development/runicorn/src/components/MapView.tsx` (new)
- `/Users/roman/Development/runicorn/src/components/MapLoadingSkeleton.tsx` (new)

**Code example**:
```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'
import { MapLoadingSkeleton } from '@/components/MapLoadingSkeleton'

const MapView = lazy(() => import('@/components/MapView'))

function App() {
  const [showMap, setShowMap] = useState(false)

  return (
    <>
      <Header />
      <Hero onGetStarted={() => setShowMap(true)} />

      {showMap && (
        <Suspense fallback={<MapLoadingSkeleton />}>
          <MapView />
        </Suspense>
      )}
    </>
  )
}
```

**Testing**:
```bash
npm run build
# Check bundle sizes in output
# Initial bundle should be ~300 KB
# Map bundle should be ~576 KB (lazy loaded)
```

---

### 2. Bundle Leaflet CSS Locally ⏱️ 10 minutes

**Goal**: Eliminate render-blocking external CSS request

- [ ] Remove unpkg.com Leaflet CSS link from index.html
- [ ] Import `leaflet/dist/leaflet.css` in `src/main.tsx`
- [ ] Test map styling (ensure all CSS loads correctly)
- [ ] Verify no external CSS requests in Network tab

**Files to modify**:
- `/Users/roman/Development/runicorn/index.html` (remove line 54)
- `/Users/roman/Development/runicorn/src/main.tsx` (add import)

**Changes**:
```html
<!-- index.html - REMOVE THIS LINE -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""/>
```

```typescript
// src/main.tsx - ADD THIS LINE (after other imports)
import 'leaflet/dist/leaflet.css'
```

**Testing**:
```bash
npm run dev
# Open DevTools → Network
# Verify no requests to unpkg.com
# Verify map displays correctly with styling
```

---

### 3. Optimize Image Assets ⏱️ 15 minutes

**Goal**: Reduce image size from 2.5 MB to ~400 KB (-84%)

- [ ] Install sharp: `npm install --save-dev sharp`
- [ ] Run optimization script: `node scripts/optimize-images.js`
- [ ] Update image URLs in `index.html` (.png → .webp)
- [ ] Update JSON-LD structured data (screenshot URL)
- [ ] Test social media previews (Twitter, LinkedIn, Discord)
- [ ] Verify WebP images load correctly

**Files to modify**:
- `/Users/roman/Development/runicorn/index.html` (lines 29, 30, 75)
- `/Users/roman/Development/runicorn/package.json` (add sharp to devDependencies)

**Commands**:
```bash
# Install sharp
npm install --save-dev sharp

# Run optimization
node scripts/optimize-images.js

# Expected output:
# screenshot.png: 1759 KB → 250 KB (-85.8%)
# og-image.png: 372 KB → 70 KB (-81.2%)
# twitter-image.png: 372 KB → 70 KB (-81.2%)
```

**Changes in index.html**:
```html
<!-- Before -->
<meta property="og:image" content="https://runicorn.io/og-image.png" />
<meta name="twitter:image" content="https://runicorn.io/twitter-image.png" />
"screenshot": "https://runicorn.io/screenshot.png"

<!-- After -->
<meta property="og:image" content="https://runicorn.io/og-image.webp" />
<meta name="twitter:image" content="https://runicorn.io/twitter-image.webp" />
"screenshot": "https://runicorn.io/screenshot.webp"
```

**Testing**:
```bash
# Test WebP support
open https://runicorn.io/og-image.webp

# Test social previews
# Twitter: https://cards-dev.twitter.com/validator
# Facebook: https://developers.facebook.com/tools/debug/
# LinkedIn: https://www.linkedin.com/post-inspector/
```

---

### 4. Self-Host Google Fonts ⏱️ 20 minutes

**Goal**: Eliminate external font request, reduce LCP by 300-800ms

- [ ] Install @fontsource: `npm install @fontsource/figtree`
- [ ] Import font weights in `src/main.tsx`
- [ ] Update `src/index.css` font-family
- [ ] Remove Google Fonts links from `index.html`
- [ ] Test font rendering across browsers
- [ ] Verify no requests to fonts.googleapis.com

**Files to modify**:
- `/Users/roman/Development/runicorn/index.html` (remove lines 51-53)
- `/Users/roman/Development/runicorn/src/main.tsx` (add imports)
- `/Users/roman/Development/runicorn/src/index.css` (update font-family)
- `/Users/roman/Development/runicorn/package.json` (add dependency)

**Commands**:
```bash
npm install @fontsource/figtree
```

**Changes**:
```typescript
// src/main.tsx - ADD AFTER OTHER IMPORTS
import '@fontsource/figtree/300.css'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@fontsource/figtree/800.css'
```

```css
/* src/index.css - UPDATE body font-family */
body {
  font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

```html
<!-- index.html - REMOVE THESE LINES -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

**Testing**:
```bash
npm run dev
# Open DevTools → Network
# Verify no requests to fonts.googleapis.com or fonts.gstatic.com
# Verify font renders correctly
# Test font weights: 300, 400, 500, 600, 700, 800
```

---

### 5. Add Resource Hints ⏱️ 5 minutes

**Goal**: Optimize third-party domain connections

- [ ] Add dns-prefetch for analytics.rnltlabs.de
- [ ] Add dns-prefetch for errors.rnltlabs.de
- [ ] Add preconnect for critical domains
- [ ] Add preload for logo image
- [ ] Test with Network throttling

**Files to modify**:
- `/Users/roman/Development/runicorn/index.html` (add after charset)

**Changes**:
```html
<!-- index.html - ADD AFTER <meta charset="UTF-8" /> -->
<head>
  <meta charset="UTF-8" />

  <!-- Resource Hints for Performance -->
  <link rel="dns-prefetch" href="https://analytics.rnltlabs.de" />
  <link rel="dns-prefetch" href="https://errors.rnltlabs.de" />
  <link rel="preconnect" href="https://analytics.rnltlabs.de" />
  <link rel="preconnect" href="https://errors.rnltlabs.de" />

  <!-- Preload Critical Assets -->
  <link rel="preload" href="/r-logo.png" as="image" type="image/png" />

  <link rel="icon" type="image/png" href="/r-logo.png" />
  <!-- ... rest of head -->
</head>
```

**Testing**:
```bash
npm run dev
# Open DevTools → Network → Throttling: Fast 3G
# Verify DNS resolution happens early
# Verify logo loads quickly
```

---

### 6. Implement Performance Budget ⏱️ 15 minutes

**Goal**: Prevent future bundle size regressions

- [ ] Update `vite.config.ts` with manual chunks
- [ ] Set chunkSizeWarningLimit to 300 KB
- [ ] Add terser minification with console.log removal
- [ ] Build and verify chunk sizes
- [ ] Document bundle size expectations

**Files to modify**:
- `/Users/roman/Development/runicorn/vite.config.ts`

**Option 1**: Replace current config
```bash
# Backup current config
cp vite.config.ts vite.config.backup.ts

# Use optimized config
cp vite.config.optimized.ts vite.config.ts
```

**Option 2**: Manual updates (see vite.config.optimized.ts for full code)

**Testing**:
```bash
npm run build

# Expected output:
# dist/assets/react-vendor-*.js      ~130 KB
# dist/assets/map-vendor-*.js        ~230 KB (lazy loaded)
# dist/assets/ui-vendor-*.js         ~150 KB
# dist/assets/monitoring-vendor-*.js ~100 KB
# dist/assets/index-*.js             ~100 KB

# Total initial load: ~280 KB (vs 876 KB before)
```

---

## P1 - High Priority (Sprint 2 - Next Week)

### 7. Add Web Vitals Tracking ⏱️ 30 minutes

**Goal**: Monitor real user performance

- [ ] Install web-vitals: `npm install web-vitals`
- [ ] Import `initWebVitals()` in `src/main.tsx`
- [ ] Test Web Vitals tracking in Umami
- [ ] Document tracked metrics

**Commands**:
```bash
npm install web-vitals
```

**Changes**:
```typescript
// src/main.tsx - ADD IMPORT
import { initWebVitals } from '@/lib/vitals'

// AFTER createRoot()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Initialize Web Vitals tracking
initWebVitals()
```

**Testing**:
```bash
npm run build && npm run preview
# Open in browser
# Check Umami for 'web-vitals' events
# Verify metrics: LCP, FID, CLS, FCP, TTFB
```

---

### 8. Setup Lighthouse CI ⏱️ 1 hour

**Goal**: Automate performance testing in CI/CD

- [ ] Install Lighthouse CI: `npm install --save-dev @lhci/cli`
- [ ] Add package.json script: `"lighthouse": "lhci autorun"`
- [ ] Create GitHub Actions workflow (`.github/workflows/lighthouse.yml`)
- [ ] Test locally: `npm run lighthouse`
- [ ] Configure performance budgets in `lighthouserc.json`

**Commands**:
```bash
npm install --save-dev @lhci/cli
```

**Testing**:
```bash
npm run build
npm run preview &
sleep 5
npx @lhci/cli@latest autorun
```

---

### 9. Implement Service Worker (PWA) ⏱️ 2 hours

**Goal**: Enable offline support and faster repeat visits

- [ ] Install vite-plugin-pwa: `npm install --save-dev vite-plugin-pwa workbox-window`
- [ ] Update `vite.config.ts` with PWA plugin
- [ ] Configure workbox for OSM tile caching
- [ ] Test offline functionality
- [ ] Update manifest.json

**Testing**:
```bash
npm run build && npm run preview
# Open DevTools → Application → Service Workers
# Verify service worker registered
# Go offline and test map tile caching
```

---

### 10. Image Lazy Loading ⏱️ 30 minutes

**Goal**: Defer below-fold images

- [ ] Audit all `<img>` tags in components
- [ ] Add `loading="lazy"` to non-critical images
- [ ] Add `decoding="async"` for better rendering
- [ ] Add width/height to prevent CLS
- [ ] Test lazy loading behavior

**Example**:
```typescript
<img
  src="/unicorn-example.png"
  alt="GPS Art Example"
  loading="lazy"
  decoding="async"
  width={500}
  height={300}
/>
```

---

### 11. Accessibility Audit ⏱️ 1 hour

**Goal**: Ensure WCAG 2.1 AA compliance

- [ ] Install axe DevTools extension
- [ ] Run accessibility audit
- [ ] Fix identified issues:
  - [ ] Add aria-labels to icon-only buttons
  - [ ] Add skip-to-content link
  - [ ] Verify keyboard navigation
  - [ ] Test with screen reader
- [ ] Document accessibility features

**Testing**:
```bash
npm install --save-dev @axe-core/playwright

# Run automated tests
npx playwright test tests/accessibility.test.ts
```

---

## Testing & Validation

### Before Deployment Checklist

- [ ] All tests passing: `npm test` (if tests exist)
- [ ] TypeScript compiles: `npm run build`
- [ ] Lighthouse score > 90: `npm run lighthouse`
- [ ] Visual regression test (manual)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing (iOS, Android)
- [ ] Social media preview testing
- [ ] Error tracking working (GlitchTip)
- [ ] Analytics tracking working (Umami)

### Performance Metrics Targets

| Metric | Before | Target | Actual |
|--------|--------|--------|--------|
| Bundle Size | 876 KB | <300 KB | ___ KB |
| LCP | 3.5-4.5s | <2.5s | ___ s |
| INP | 250-350ms | <200ms | ___ ms |
| CLS | 0.05-0.10 | <0.1 | ___ |
| Lighthouse Score | ~60 | >90 | ___ |

### Post-Deployment Monitoring

- [ ] Monitor error rates in GlitchTip (first 24 hours)
- [ ] Check Web Vitals in Umami (first week)
- [ ] Monitor bundle size in future builds
- [ ] Track user feedback/issues
- [ ] Document lessons learned

---

## Rollback Plan

If issues occur after deployment:

1. **Immediate Rollback**:
   ```bash
   git revert HEAD
   git push origin feature/comprehensive-site-audit
   ```

2. **Partial Rollback** (if specific optimization causes issues):
   - Code splitting: Remove lazy loading, use eager imports
   - Fonts: Re-add Google Fonts links temporarily
   - Images: Serve both WebP and PNG, use `<picture>` with fallback

3. **Monitoring**:
   - Watch GlitchTip for error spikes
   - Check Umami for bounce rate changes
   - Monitor social media preview failures

---

## Success Criteria

### Sprint 1 Complete When:
- ✅ Bundle size reduced by >60%
- ✅ LCP improved by >40%
- ✅ All images optimized to WebP
- ✅ Fonts self-hosted
- ✅ Performance budget configured
- ✅ No functionality regressions

### Sprint 2 Complete When:
- ✅ Web Vitals tracked in production
- ✅ Lighthouse CI running on PRs
- ✅ Service worker enabled
- ✅ Accessibility audit passed
- ✅ All metrics in "Good" range

---

## Notes & Decisions

**Date**: 2025-10-26

### Key Decisions:
1. **Code Splitting Strategy**: Lazy load entire map component vs. individual libraries
   - **Decision**: Lazy load entire MapView component
   - **Rationale**: Simpler implementation, map is below-fold content

2. **Image Format**: WebP vs. AVIF
   - **Decision**: WebP
   - **Rationale**: Better browser support (98%), good enough compression

3. **Font Strategy**: Self-host vs. Google Fonts
   - **Decision**: Self-host with @fontsource
   - **Rationale**: Eliminates external request, better control, minimal bundle impact

4. **Bundle Splitting**: Aggressive vs. Conservative
   - **Decision**: Conservative (4 vendor chunks)
   - **Rationale**: Balance between HTTP/2 benefits and overhead

### Risks & Mitigations:
- **Risk**: Code splitting breaks map functionality
  - **Mitigation**: Thorough testing, keep MapView self-contained

- **Risk**: WebP not supported in old browsers
  - **Mitigation**: Modern browsers support (98%+), acceptable tradeoff

- **Risk**: Self-hosted fonts increase bundle size
  - **Mitigation**: Only ~50 KB for all weights, faster than external request

---

**Last Updated**: 2025-10-26
**Maintained By**: Roman Reinelt / RNLT Labs
