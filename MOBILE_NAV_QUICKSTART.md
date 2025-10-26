# Mobile Navigation - Quick Start Guide

**Get mobile navigation working in 5 minutes**

Related: RNLT-36

---

## 1. Install shadcn/ui Components (30 seconds)

```bash
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add button
```

---

## 2. Component Files (Already Created)

Components are ready to use:

```
✅ /src/components/navigation/MobileNav.tsx
✅ /src/components/navigation/DesktopNav.tsx
```

---

## 3. Integrate in Your Header (2 minutes)

### Option A: Update Existing Header

```typescript
// src/components/layout/Header.tsx (or wherever your header is)
import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopNav } from "@/components/navigation/DesktopNav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Mobile nav + logo */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <a href="/" className="text-xl font-bold">
            Runicorn
          </a>
        </div>

        {/* Center: Desktop nav */}
        <DesktopNav />

        {/* Right: Theme toggle or other actions */}
        <div className="flex items-center">
          {/* Add theme toggle, user menu, etc. */}
        </div>
      </div>
    </header>
  )
}
```

### Option B: Next.js App Router Layout

```typescript
// app/layout.tsx
import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopNav } from "@/components/navigation/DesktopNav"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileNav />
              <span className="text-xl font-bold">Runicorn</span>
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

---

## 4. Add Section IDs to Your Pages (1 minute)

Make sure your page sections have IDs matching the navigation links:

```typescript
// app/page.tsx or your main page
export default function HomePage() {
  return (
    <>
      <section id="home" className="min-h-screen">
        {/* Your home content */}
      </section>

      <section id="features" className="min-h-screen">
        {/* Your features content */}
      </section>

      <section id="about" className="min-h-screen">
        {/* Your about content */}
      </section>
    </>
  )
}
```

---

## 5. Test on Mobile Viewport (1 minute)

1. Open your dev server: `npm run dev`
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Select iPhone or similar (< 768px width)
5. Click hamburger menu (☰)
6. Verify sheet opens and links work

---

## Done!

You now have:
✅ Mobile navigation (< 768px)
✅ Desktop navigation (>= 768px)
✅ Smooth scroll to sections
✅ WCAG 2.1 AA accessible
✅ Keyboard navigation
✅ Screen reader support

---

## Customize Navigation Links

Edit the links in both components:

**MobileNav.tsx** (line 18-41):
```typescript
const navigationLinks: NavigationLink[] = [
  {
    href: "#home",
    label: "Home",
    icon: Home,
    description: "Return to homepage",
  },
  // Add your links here
]
```

**DesktopNav.tsx** (line 2-7):
```typescript
const links = [
  { href: "#home", label: "Home" },
  // Add your links here
]
```

---

## Common Issues

### Issue: Sheet doesn't open
**Fix**: Verify shadcn components installed:
```bash
npx shadcn-ui@latest add sheet button
```

### Issue: Links don't scroll
**Fix**: Add `id` attributes to sections:
```html
<section id="features">...</section>
```

### Issue: Hamburger shows on desktop
**Fix**: Check Tailwind config has `md: '768px'` breakpoint

---

## Full Documentation

For detailed documentation, see:

- **Design Spec**: `/docs/design/mobile-navigation-spec.md`
- **Testing Guide**: `/docs/testing/mobile-nav-testing.md`
- **Integration Guide**: `/docs/implementation/mobile-nav-integration.md`
- **Summary**: `/docs/MOBILE_NAV_SUMMARY.md`

---

## Need Help?

1. Check component README: `/src/components/navigation/README.md`
2. Review testing checklist: `/docs/testing/mobile-nav-testing.md`
3. Open issue: RNLT-36

---

**Created**: 2025-10-27
**Status**: Ready to Use
**Time to Implement**: < 5 minutes
