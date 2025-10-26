# Mobile Navigation Visual Guide

## Component Overview

Visual reference for mobile navigation implementation (RNLT-36).

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER FLOW                               │
└─────────────────────────────────────────────────────────────┘

User on Mobile (<768px)
        │
        ▼
┌───────────────────┐
│   Page Loads      │
│   ┌──────────┐    │
│   │ [☰] Logo │    │  ← Hamburger visible
│   └──────────┘    │
│                   │
│   Page Content    │
└───────────────────┘
        │
        │ User taps [☰]
        ▼
┌───────────────────┐
│  Sheet Opens      │
│ ┌──────────┐      │
│ │ Runicorn │      │
│ │──────────│      │
│ │ 🏠 Home  │      │  ← Navigation links
│ │ ⚡Features│      │
│ │ 📖 About │      │
│ │ 🔒 Privacy│     │
│ └──────────┘      │
│    Backdrop       │
└───────────────────┘
        │
        │ User taps "Features"
        ▼
┌───────────────────┐
│  Sheet Closes     │
│                   │
│  Scrolls to       │
│  #features        │  ← Smooth scroll
│                   │
│  ┌─────────────┐  │
│  │  Features   │  │
│  │  Section    │  │
│  └─────────────┘  │
└───────────────────┘
```

## Component States

### 1. Closed State (Mobile)

```
┌────────────────────────────────────┐
│ ┌────────────────────────────────┐ │
│ │ [☰]  Runicorn            🌙    │ │ ← Header
│ └────────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │                              │ │
│  │     Main Content             │ │
│  │                              │ │
│  │                              │ │
│  │                              │ │
│  └──────────────────────────────┘ │
│                                    │
└────────────────────────────────────┘

Elements:
- [☰] = Hamburger menu button (44x44px)
- 🌙 = Theme toggle (optional)
- Main content fully visible
```

### 2. Open State (Mobile)

```
┌────────────────────────────────────┐
│ ┌─────────────┐ ░░░░░░░░░░░░░░░░░ │
│ │             │ ░               ░ │
│ │  Runicorn   │ ░     [X]    🌙 ░ │ ← Header
│ │             │ ░               ░ │
│ │─────────────│ ░░░░░░░░░░░░░░░░░ │
│ │             │ ░               ░ │
│ │             │ ░               ░ │
│ │ 🏠 Home     │ ░               ░ │
│ │             │ ░               ░ │
│ │ ⚡ Features │ ░   Backdrop    ░ │
│ │             │ ░   (dimmed)    ░ │
│ │ 📖 About    │ ░               ░ │
│ │             │ ░               ░ │
│ │ 🔒 Privacy  │ ░               ░ │
│ │             │ ░               ░ │
│ │             │ ░               ░ │
│ │             │ ░               ░ │
│ │─────────────│ ░               ░ │
│ │ © 2025      │ ░               ░ │
│ └─────────────┘ ░░░░░░░░░░░░░░░░░ │
└────────────────────────────────────┘
  └─ Sheet ─┘    └─── Overlay ────┘

Sheet: 80% width (max 350px)
Animation: Slide from left, 200ms
Backdrop: Semi-transparent (blocks interaction)
```

### 3. Desktop State (>= 768px)

```
┌────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────┐ │
│ │  Runicorn   [Home] [Features] [About] [Privacy] 🌙 │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │                                                  │ │
│  │              Main Content                        │ │
│  │                                                  │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘

Elements:
- Mobile nav: hidden (display: none)
- Desktop nav: horizontal menu
- No hamburger button
```

## Interaction States

### Hamburger Button States

#### Default
```
┌─────────┐
│         │
│   ☰     │  44x44px
│         │  Tap target
└─────────┘

Color: text-foreground
Background: transparent
```

#### Hover (Desktop/Trackpad)
```
┌─────────┐
│▒▒▒▒▒▒▒▒▒│
│▒▒▒ ☰ ▒▒▒│  Background: bg-accent
│▒▒▒▒▒▒▒▒▒│  Subtle highlight
└─────────┘
```

#### Focus (Keyboard)
```
┌─────────┐
│█████████│  2px focus ring
│███ ☰ ███│  ring-offset-2
│█████████│  High contrast
└─────────┘
```

#### Active (Pressed)
```
┌─────────┐
│░░░░░░░░░│  Slightly darker
│░░░ ☰ ░░░│  Scale: 0.95
│░░░░░░░░░│
└─────────┘
```

### Navigation Link States

#### Default
```
┌──────────────────────────────┐
│                              │
│  🏠  Home                    │  px-4 py-3
│                              │  rounded-lg
└──────────────────────────────┘

Background: transparent
Text: foreground
```

#### Hover
```
┌──────────────────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒▒🏠  Home                  ▒▒│  bg-accent
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  text-accent-foreground
└──────────────────────────────┘
```

#### Focus
```
╔══════════════════════════════╗
║██████████████████████████████║  2px focus ring
║██ 🏠  Home                ██║  bg-accent
║██████████████████████████████║  Keyboard visible
╚══════════════════════════════╝
```

#### Active (Pressed)
```
┌──────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  Darker accent
│░░ 🏠  Home                ░░│  Brief state
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────┘
```

## Animation Sequences

### Opening Sequence

```
Frame 1 (0ms)                Frame 2 (100ms)              Frame 3 (200ms)
User taps hamburger          Sheet sliding in             Sheet fully open

┌───────────────┐            ┌───────────────┐            ┌───────────────┐
│ [☰] Logo      │            │ [☰┌────       │            │ [☰] ┌────────┐│
│               │            │   │Runi       │            │     │Runicorn││
│               │            │   │──── ░     │            │     │────────││
│  Content      │            │   │🏠 H ░░    │            │     │🏠 Home ││
│               │     →      │   │⚡ F ░░░   │     →      │     │⚡Features│
│               │            │   │    ░░░░   │            │     │📖 About ││
│               │            │   └──── ░░░░░ │            │     └────────┘│
└───────────────┘            └────────░░░░░░░┘            └──────░░░░░░░░░┘
                                 ↑                             ↑
                            translateX(-50%)              translateX(0)
                            opacity: 0.4                   opacity: 1
```

### Closing Sequence

```
Frame 1 (0ms)                Frame 2 (100ms)              Frame 3 (200ms)
User taps X or backdrop      Sheet sliding out            Sheet hidden

┌───────────────┐            ┌───────────────┐            ┌───────────────┐
│ [☰] ┌────────┐│            │ [☰┌────       │            │ [☰] Logo      │
│     │Runicorn││            │   │Runi       │            │               │
│     │────────││            │   │──── ░     │            │               │
│     │🏠 Home ││            │   │🏠 H ░░    │            │  Content      │
│     │⚡Features│     →      │   │⚡ F ░░░   │     →      │               │
│     │📖 About ││            │   │    ░░░░   │            │               │
│     └────────┘│            │   └──── ░░░░░ │            │               │
└──────░░░░░░░░░┘            └────────░░░░░░░┘            └───────────────┘
     ↑                            ↑                             ↑
translateX(0)                translateX(-50%)              translateX(-100%)
opacity: 1                   opacity: 0.4                  opacity: 0
```

## Responsive Breakpoints

### Mobile Small (375px - iPhone SE)

```
┌─────────────────────────┐
│ [☰] Runicorn         🌙 │ ← 375px width
└─────────────────────────┘

Sheet width: 300px (80%)
All features visible
Minimum tested viewport
```

### Mobile Medium (390px - iPhone 14)

```
┌───────────────────────────┐
│ [☰] Runicorn           🌙 │ ← 390px width
└───────────────────────────┘

Sheet width: 312px (80%)
Standard mobile experience
```

### Mobile Large (428px - iPhone 14 Pro Max)

```
┌─────────────────────────────────┐
│ [☰] Runicorn                 🌙 │ ← 428px width
└─────────────────────────────────┘

Sheet width: 342px (80%, max 350px)
Spacious mobile layout
```

### Tablet (768px - iPad)

```
┌──────────────────────────────────────────────┐
│ Runicorn  [Home] [Features] [About] [Privacy] 🌙 │
└──────────────────────────────────────────────┘
                    ↑
         Desktop nav appears
         Mobile nav hidden
         Breakpoint: 768px (md:)
```

### Desktop (1024px+)

```
┌──────────────────────────────────────────────────────────┐
│ Runicorn      [Home] [Features] [About] [Privacy]     🌙 │
└──────────────────────────────────────────────────────────┘
                          ↑
              Desktop nav fully visible
              Optimal spacing
```

## Color Scheme

### Light Mode

```
┌────────────────────────────────┐
│ Background: White              │
│ Text: Black (900)              │
│ Muted: Gray (600)              │
│ Border: Gray (200)             │
│ Accent: Blue (100)             │
│ Accent Text: Blue (900)        │
└────────────────────────────────┘

Contrast Ratios:
- Text: 21:1 (WCAG AAA)
- Muted: 4.5:1 (WCAG AA)
- Focus: 3:1 (WCAG AA)
```

### Dark Mode

```
┌────────────────────────────────┐
│ Background: Black (950)        │
│ Text: White                    │
│ Muted: Gray (400)              │
│ Border: Gray (800)             │
│ Accent: Blue (900)             │
│ Accent Text: Blue (100)        │
└────────────────────────────────┘

Contrast Ratios:
- Text: 21:1 (WCAG AAA)
- Muted: 4.5:1 (WCAG AA)
- Focus: 3:1 (WCAG AA)
```

## Touch Targets

### Minimum Sizes

```
Hamburger Button:
┌──────────┐
│          │
│    ☰     │  44px
│          │
└──────────┘
   44px

Navigation Link:
┌────────────────────────┐
│                        │
│  🏠  Home              │  48px (full width)
│                        │
└────────────────────────┘

Exceeds WCAG minimum (44x44px)
```

### Safe Zones

```
┌────────────────────────────┐
│ [Safe Zone]                │
│  ┌────────────────────┐    │
│  │   Tap Target       │    │  Minimum 8px margin
│  │   44x44px          │    │  between targets
│  └────────────────────┘    │
│ [Safe Zone]                │
└────────────────────────────┘
```

## Focus Indicators

### Visible Focus Ring

```
Default (No Focus):
┌──────────┐
│    ☰     │
└──────────┘

Focused (Keyboard):
  ╔══════════╗
  ║██████████║  2px solid ring
 ╔╝          ╚╗ ring-offset-2
 ║      ☰     ║ High contrast
 ╚╗          ╔╝
  ║██████████║
  ╚══════════╝

Color: ring-ring (theme-aware)
Offset: 2px (white space)
Width: 2px
```

## Accessibility Labels

### Screen Reader Announcements

```
1. Hamburger Button Focus:
   → "Open navigation menu, button"

2. Sheet Opens:
   → "Runicorn, dialog"
   → "Navigate to different sections"

3. Navigation Link Focus:
   → "Home, Return to homepage, link"
   → "Features, Explore our features, link"
   → "About, Learn about Runicorn, link"
   → "Privacy Policy, View our privacy policy, link"

4. Sheet Closes:
   → "Dialog closed"
   → Focus returns to hamburger button
```

## Layout Measurements

### Mobile Sheet Dimensions

```
┌─────────────────────────────┐
│ Sheet Header                │ ← 72px height
│ ┌─────────────────────────┐ │
│ │ Runicorn                │ │   32px (text-2xl)
│ │ Navigate...             │ │   16px (text-sm)
│ └─────────────────────────┘ │
│─────────────────────────────│ ← border-b
│                             │
│ Navigation Links            │
│ ┌─────────────────────────┐ │
│ │ 🏠  Home                │ │ ← 52px each
│ └─────────────────────────┘ │   (py-3 = 12px top/bottom)
│ ┌─────────────────────────┐ │   (text-base = 16px)
│ │ ⚡  Features            │ │   (icon = 20px)
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 📖  About               │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 🔒  Privacy Policy      │ │
│ └─────────────────────────┘ │
│                             │
│ ...                         │
│                             │
│─────────────────────────────│
│ Footer                      │ ← 64px from bottom
│ © 2025 Runicorn             │   (text-xs)
└─────────────────────────────┘

Width: 80% viewport (max 350px)
Height: 100vh (full screen)
Padding: 24px (left/right)
```

### Desktop Navigation Dimensions

```
┌────────────────────────────────────────────────┐
│ Runicorn    [Home] [Features] [About] [Privacy] │
│             └─────────────────────────────────┘ │
│                     ↑                           │
│              16px gap between items             │
│              text-sm (14px)                     │
│              py-1 px-2 (vertical/horizontal)    │
└────────────────────────────────────────────────┘

Height: 64px (h-16)
Item spacing: 24px (space-x-6)
Font size: 14px (text-sm)
```

## Z-Index Layers

```
Layer 5 (z-50): Header (sticky)
                │
Layer 4:        └── Sheet overlay
                    │
Layer 3:            └── Sheet content
                        │
Layer 2:                └── Page content (dimmed)
                            │
Layer 1:                    └── Background
```

## Edge Cases

### Very Small Screens (320px)

```
┌───────────────────┐
│ [☰] Runicorn   🌙 │ ← 320px width
└───────────────────┘

Sheet: 256px (80%)
Still functional
All content visible
Minimum support
```

### Landscape Orientation

```
┌─────────────────────────────────────────┐
│ [☰] Runicorn                         🌙 │
└─────────────────────────────────────────┘
       ↓
┌──────────┐─────────────────────────┐
│          │                         │
│ Sheet    │   Content (landscape)   │
│ (40%)    │   (visible behind)      │
│          │                         │
└──────────┘─────────────────────────┘

Reduced sheet width for landscape
More content visible
```

## Performance Metrics

### Target Metrics

```
First Contentful Paint:  < 1.0s
Time to Interactive:     < 2.0s
Sheet Open Animation:    200ms
Sheet Close Animation:   200ms
Frame Rate:              60fps
Bundle Size:             < 10KB
```

### Lighthouse Scores (Target)

```
Performance:     ████████████████████ 95+
Accessibility:   ████████████████████ 100
Best Practices:  ████████████████████ 95+
SEO:            ████████████████████ 95+
```

---

**Document Status**: Final
**Last Updated**: 2025-10-27
**Related**: RNLT-36
**For**: Developers, Designers, QA
