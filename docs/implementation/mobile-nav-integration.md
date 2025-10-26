# Mobile Navigation Integration Guide

## Quick Start

### 1. Install Required Components

```bash
# Install shadcn/ui Sheet component
npx shadcn-ui@latest add sheet

# Install Button component (if not already installed)
npx shadcn-ui@latest add button
```

### 2. Component Files Created

```
src/components/navigation/
├── MobileNav.tsx       (Mobile drawer navigation)
└── DesktopNav.tsx      (Desktop horizontal navigation)
```

### 3. Integration Example

#### Option A: Simple Header Integration

Create or update your header component:

```typescript
// src/components/layout/Header.tsx
import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopNav } from "@/components/navigation/DesktopNav"

export function Header(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Mobile Nav + Logo */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <a href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Runicorn</span>
          </a>
        </div>

        {/* Center: Desktop Navigation */}
        <DesktopNav />

        {/* Right: Additional actions (theme toggle, etc.) */}
        <div className="flex items-center gap-4">
          {/* Add theme toggle or other actions here */}
        </div>
      </div>
    </header>
  )
}
```

#### Option B: Full Layout Integration

```typescript
// src/components/layout/RootLayout.tsx
import { Header } from "@/components/layout/Header"

export function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        {/* Footer content */}
      </footer>
    </div>
  )
}
```

#### Option C: Next.js App Router Integration

```typescript
// app/layout.tsx
import { MobileNav } from "@/components/navigation/MobileNav"
import { DesktopNav } from "@/components/navigation/DesktopNav"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileNav />
              <span className="text-xl font-bold">Runicorn</span>
            </div>
            <DesktopNav />
          </div>
        </header>

        <main className="container py-8">{children}</main>

        <footer className="border-t py-6">
          <div className="container text-center text-sm text-muted-foreground">
            Runicorn &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  )
}
```

### 4. Customize Navigation Links

Edit the links in both components:

```typescript
// src/components/navigation/MobileNav.tsx
const navigationLinks: NavigationLink[] = [
  {
    href: "#home",
    label: "Home",
    icon: Home,
    description: "Return to homepage",
  },
  {
    href: "#features",
    label: "Features",
    icon: Zap,
    description: "Explore our features",
  },
  // Add more links as needed
]
```

```typescript
// src/components/navigation/DesktopNav.tsx
const links = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  // Add more links as needed
]
```

### 5. Add Section IDs to Your Pages

Ensure your page sections have matching IDs:

```typescript
// app/page.tsx or your main page component
export default function HomePage(): React.JSX.Element {
  return (
    <>
      <section id="home" className="min-h-screen">
        {/* Home content */}
      </section>

      <section id="features" className="min-h-screen">
        {/* Features content */}
      </section>

      <section id="about" className="min-h-screen">
        {/* About content */}
      </section>
    </>
  )
}
```

## Customization Options

### Change Sheet Side

```typescript
// MobileNav.tsx - Change from left to right
<SheetContent
  side="right"  // Change from "left" to "right"
  className="w-[80%] sm:w-[350px]"
>
```

### Adjust Sheet Width

```typescript
// Narrower sheet
<SheetContent
  side="left"
  className="w-[70%] sm:w-[300px]"  // Reduced from 80%/350px
>

// Wider sheet
<SheetContent
  side="left"
  className="w-[90%] sm:w-[400px]"  // Increased from 80%/350px
>
```

### Change Icons

```typescript
import { Home, Star, Info, Lock } from "lucide-react"

const navigationLinks: NavigationLink[] = [
  { href: "#home", label: "Home", icon: Star, description: "..." },
  // Use any icon from lucide-react
]
```

### Add Active Link Highlighting

```typescript
"use client"

import { usePathname } from "next/navigation"

export function MobileNav(): React.JSX.Element {
  const pathname = usePathname()

  return (
    // ...
    <a
      href={link.href}
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-lg
        ${pathname === link.href ? 'bg-accent text-accent-foreground' : ''}
        hover:bg-accent hover:text-accent-foreground
        // ...
      `}
    >
      {/* ... */}
    </a>
  )
}
```

### Change Breakpoint

```typescript
// Show mobile nav up to large screens (lg instead of md)
<Button
  variant="ghost"
  size="icon"
  className="lg:hidden"  // Changed from md:hidden
>

// DesktopNav.tsx
<nav className="hidden lg:flex items-center space-x-6">
  {/* Changed from md:flex */}
</nav>
```

## Styling Customization

### Custom Colors

```typescript
// MobileNav.tsx - Customize hover colors
<a
  className="
    px-4 py-3 rounded-lg
    hover:bg-blue-100 dark:hover:bg-blue-900
    hover:text-blue-900 dark:hover:text-blue-100
    // ...
  "
>
```

### Custom Animation Duration

```typescript
// In your globals.css or component styles
[data-state="open"] [data-sheet-content] {
  animation-duration: 300ms; /* Default is 200ms */
}
```

### Custom Sheet Styling

```typescript
<SheetContent
  side="left"
  className="
    w-[80%] sm:w-[350px]
    bg-gradient-to-b from-background to-accent
    border-r-2 border-primary
  "
>
```

## Troubleshooting

### Issue: Sheet doesn't open

**Solution:**
1. Check that shadcn/ui Sheet component is installed
2. Verify globals.css imports shadcn styles
3. Check console for errors

### Issue: Links don't navigate

**Solution:**
1. Verify section IDs match href values (e.g., `href="#features"` needs `id="features"`)
2. Check that smooth scroll is supported in browser
3. Ensure JavaScript is enabled

### Issue: Mobile nav shows on desktop

**Solution:**
1. Verify Tailwind breakpoints in config
2. Check className: `md:hidden` is present
3. Clear browser cache

### Issue: Focus trap not working

**Solution:**
1. Verify radix-ui dependencies are installed
2. Check that Sheet component is latest version
3. Test in different browser

### Issue: Accessibility warnings

**Solution:**
1. Ensure SheetTitle and SheetDescription are present
2. Verify aria-label on hamburger button
3. Check that aria-hidden="true" is on icons

## Testing Checklist

Before deploying:

- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Test keyboard navigation
- [ ] Test screen reader (VoiceOver/NVDA)
- [ ] Test smooth scroll to sections
- [ ] Test ESC key closes sheet
- [ ] Verify WCAG 2.1 AA compliance
- [ ] Check color contrast ratios
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Run Lighthouse audit
- [ ] Verify no console errors

## Performance Tips

### Lazy Load Icons

```typescript
// Instead of importing all icons
import dynamic from 'next/dynamic'

const Home = dynamic(() => import('lucide-react').then(mod => mod.Home))
const Zap = dynamic(() => import('lucide-react').then(mod => mod.Zap))
```

### Reduce Bundle Size

```typescript
// Import only needed icons
import { Menu, Home, Zap, BookOpen, Shield } from "lucide-react"
// Don't import entire lucide-react library
```

### Optimize Animations

```typescript
// Use CSS transforms (GPU-accelerated)
// Avoid animating properties like width, height, margin
```

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Check bundle size
npm run build -- --analyze
```

### Environment Variables

No environment variables required for basic navigation.

### CDN/Edge Deployment

Works with all Next.js deployment targets:
- Vercel
- Netlify
- AWS Amplify
- Self-hosted

## Migration from Existing Navigation

### Step 1: Install Components

```bash
npx shadcn-ui@latest add sheet button
```

### Step 2: Replace Old Mobile Nav

```typescript
// Before (example)
<div className="mobile-menu">
  <button onClick={() => setOpen(!open)}>Menu</button>
  {open && (
    <div className="menu-items">
      <a href="#home">Home</a>
      <a href="#features">Features</a>
    </div>
  )}
</div>

// After
<MobileNav />
```

### Step 3: Update Styling

Remove old mobile nav styles from CSS files.

### Step 4: Test Thoroughly

Use testing checklist above.

## Advanced Features (Future)

### Nested Navigation

```typescript
// Example structure for nested menus
const navigationLinks = [
  {
    label: "Products",
    icon: Package,
    children: [
      { href: "/products/software", label: "Software" },
      { href: "/products/hardware", label: "Hardware" },
    ]
  }
]
```

### Search Integration

```typescript
// Add search bar to sheet header
<SheetHeader>
  <SheetTitle>Runicorn</SheetTitle>
  <Input
    type="search"
    placeholder="Search..."
    className="mt-2"
  />
</SheetHeader>
```

### User Menu

```typescript
// Add user profile section
<div className="absolute bottom-20 left-6 right-6 border-t pt-4">
  <div className="flex items-center gap-3">
    <Avatar />
    <div>
      <p className="font-medium">John Doe</p>
      <p className="text-xs text-muted-foreground">john@example.com</p>
    </div>
  </div>
</div>
```

## Support

For issues or questions:
- Check documentation: /docs/design/mobile-navigation-spec.md
- Review testing guide: /docs/testing/mobile-nav-testing.md
- Open GitHub issue: RNLT-36

---

**Last Updated**: 2025-10-27
**Version**: 1.0.0
**Related**: RNLT-36
