# Navigation Components

## Overview

Mobile-first, accessible navigation system for Runicorn using shadcn/ui components.

## Components

### MobileNav

Mobile drawer navigation using shadcn/ui Sheet component.

**Features:**
- Slides in from left
- Touch-friendly 44x44px targets
- Keyboard accessible (Tab, Enter, ESC)
- Screen reader compatible
- WCAG 2.1 AA compliant
- Smooth scroll to hash sections

**Visibility:**
- Mobile: Visible (< 768px)
- Desktop: Hidden (>= 768px)

**Usage:**
```typescript
import { MobileNav } from "@/components/navigation/MobileNav"

export function Header() {
  return (
    <header>
      <MobileNav />
    </header>
  )
}
```

### DesktopNav

Horizontal navigation menu for desktop viewports.

**Features:**
- Minimal, clean design
- Hover states
- Focus indicators
- Keyboard navigation

**Visibility:**
- Mobile: Hidden (< 768px)
- Desktop: Visible (>= 768px)

**Usage:**
```typescript
import { DesktopNav } from "@/components/navigation/DesktopNav"

export function Header() {
  return (
    <header>
      <DesktopNav />
    </header>
  )
}
```

## File Structure

```
src/components/navigation/
├── MobileNav.tsx       # Mobile drawer navigation
├── DesktopNav.tsx      # Desktop horizontal navigation
└── README.md           # This file
```

## Configuration

### Navigation Links

Both components share the same navigation structure. To update links, edit both files:

**MobileNav.tsx:**
```typescript
const navigationLinks: NavigationLink[] = [
  {
    href: "#home",
    label: "Home",
    icon: Home,
    description: "Return to homepage",
  },
  // Add more links here
]
```

**DesktopNav.tsx:**
```typescript
const links = [
  { href: "#home", label: "Home" },
  // Add more links here
]
```

### Icons (MobileNav only)

Icons are from `lucide-react`:

```typescript
import { Home, Zap, BookOpen, Shield } from "lucide-react"
```

Browse available icons: https://lucide.dev

## Accessibility

### WCAG 2.1 AA Compliance

- ✅ Semantic HTML (`<nav>`, `<a>`, `<button>`)
- ✅ ARIA labels (hamburger button, sheet dialog)
- ✅ Keyboard navigation (Tab, Enter, ESC)
- ✅ Focus management (visible indicators, focus trap)
- ✅ Color contrast (4.5:1 text, 3:1 interactive elements)
- ✅ Screen reader support (announcements, landmarks)
- ✅ Touch targets (minimum 44x44px)

### Keyboard Shortcuts

**Global:**
- `Tab`: Navigate to hamburger button
- `Shift+Tab`: Navigate backwards

**Sheet Open:**
- `Tab`: Cycle through links
- `Enter`: Activate link
- `ESC`: Close sheet

**Desktop Nav:**
- `Tab`: Move between links
- `Enter`: Activate link

## Responsive Behavior

### Breakpoints

```typescript
< 768px:  Mobile nav visible, desktop nav hidden
>= 768px: Desktop nav visible, mobile nav hidden
```

### Layout

**Mobile (< 768px):**
```
┌─────────────────────┐
│ [☰] Runicorn     🌙 │
└─────────────────────┘
```

**Desktop (>= 768px):**
```
┌─────────────────────────────────────────┐
│ Runicorn  [Home] [Features] [About]  🌙 │
└─────────────────────────────────────────┘
```

## Customization

### Change Sheet Width

```typescript
// MobileNav.tsx
<SheetContent
  side="left"
  className="w-[80%] sm:w-[350px]"  // Adjust these values
>
```

### Change Sheet Side

```typescript
// MobileNav.tsx
<SheetContent
  side="right"  // Options: left, right, top, bottom
  className="w-[80%] sm:w-[350px]"
>
```

### Change Breakpoint

```typescript
// MobileNav.tsx
<Button className="lg:hidden">  // Change from md:hidden

// DesktopNav.tsx
<nav className="hidden lg:flex">  // Change from md:flex
```

### Custom Hover Colors

```typescript
// MobileNav.tsx
<a
  className="
    hover:bg-blue-100 dark:hover:bg-blue-900
    hover:text-blue-900 dark:hover:text-blue-100
  "
>
```

## Smooth Scroll

Hash links (#features, #about) trigger smooth scroll:

```typescript
element.scrollIntoView({ behavior: "smooth", block: "start" })
```

**Requirements:**
1. Target sections must have matching IDs:
   ```html
   <section id="features">...</section>
   ```

2. Browser support: All modern browsers (IE11+ with polyfill)

## TypeScript

Both components are fully typed:

```typescript
interface NavigationLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

function MobileNav(): React.JSX.Element
function DesktopNav(): React.JSX.Element
```

**Strict Mode:**
- No `any` types
- Explicit return types
- Proper event typing

## Performance

### Bundle Size

- MobileNav: ~8KB (gzipped: ~3KB)
- DesktopNav: ~2KB (gzipped: ~1KB)

### Optimization

- Icons tree-shaken (only imported icons included)
- Sheet content lazy-loaded (radix-ui portal)
- No runtime performance impact when closed

## Browser Support

### Tested

- ✅ Chrome 120+ (Android/Desktop)
- ✅ Safari 17+ (iOS/macOS)
- ✅ Firefox 120+ (Android/Desktop)
- ✅ Edge 120+ (Desktop)

### Known Issues

None

## Testing

See comprehensive testing guide: `/docs/testing/mobile-nav-testing.md`

**Quick Test:**
1. Resize browser to mobile width (< 768px)
2. Click hamburger menu
3. Verify sheet opens
4. Click "Features" link
5. Verify smooth scroll to section

## Dependencies

### Required

- `react` ^19.0.0
- `lucide-react` (icons)
- `@radix-ui/react-dialog` (Sheet primitive)
- `tailwindcss` (styling)

### shadcn/ui Components

- `Sheet` (mobile drawer)
- `Button` (hamburger icon)

**Installation:**
```bash
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add button
```

## Migration

### From Old Mobile Nav

Replace your existing mobile navigation:

```typescript
// Before
<MobileMenu />

// After
<MobileNav />
```

See full migration guide: `/docs/implementation/mobile-nav-integration.md`

## Troubleshooting

### Sheet doesn't open

1. Verify shadcn Sheet is installed
2. Check globals.css imports shadcn styles
3. Look for console errors

### Links don't scroll

1. Verify section IDs match href values
2. Check JavaScript is enabled
3. Test in different browser

### Focus not trapped

1. Update radix-ui dependencies
2. Verify Sheet component version
3. Check browser console

### Accessibility warnings

1. Ensure SheetTitle present
2. Verify aria-labels
3. Run axe DevTools audit

## Examples

### Basic Header

```typescript
import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopNav } from "@/components/navigation/DesktopNav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <span className="font-bold">Runicorn</span>
        </div>
        <DesktopNav />
      </div>
    </header>
  )
}
```

### With Theme Toggle

```typescript
import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopNav } from "@/components/navigation/DesktopNav"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileNav />
          <span className="font-bold">Runicorn</span>
        </div>
        <DesktopNav />
        <ThemeToggle />
      </div>
    </header>
  )
}
```

### Next.js App Router

```typescript
// app/layout.tsx
import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopNav } from "@/components/navigation/DesktopNav"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileNav />
              <span className="font-bold">Runicorn</span>
            </div>
            <DesktopNav />
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

## Related Documentation

- **Design Spec**: `/docs/design/mobile-navigation-spec.md`
- **Testing Guide**: `/docs/testing/mobile-nav-testing.md`
- **Integration Guide**: `/docs/implementation/mobile-nav-integration.md`
- **shadcn Setup**: `/docs/installation/shadcn-setup.md`

## Contributing

When modifying navigation:

1. Update both MobileNav and DesktopNav
2. Maintain accessibility standards
3. Test on mobile devices
4. Run Lighthouse audit
5. Update documentation

## Issue Tracking

Related: **RNLT-36** - Mobile navigation implementation

## License

Part of Runicorn project

---

**Last Updated**: 2025-10-27
**Version**: 1.0.0
**Status**: Production Ready
