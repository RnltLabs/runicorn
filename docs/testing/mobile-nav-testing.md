# Mobile Navigation Testing Guide (RNLT-36)

## Overview
Comprehensive testing checklist for mobile navigation implementation using shadcn/ui Sheet component.

## Pre-Testing Setup

### 1. Install Dependencies
```bash
# Ensure all dependencies are installed
npm install

# Install shadcn/ui components (if not already done)
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add button
```

### 2. Development Server
```bash
# Start dev server
npm run dev

# Open in browser
open http://localhost:3000
```

### 3. Testing Tools
- Chrome DevTools (Device Emulation)
- Firefox Responsive Design Mode
- Safari Web Inspector (iOS testing)
- axe DevTools (Accessibility)
- Lighthouse (Performance + A11y)

## Functional Testing

### Basic Functionality

#### Test 1: Hamburger Button Visibility
**Steps:**
1. Open site on mobile viewport (< 768px)
2. Look for hamburger menu icon (☰)

**Expected:**
- ✅ Hamburger button visible on mobile
- ✅ Button in header (top-left area)
- ✅ Icon clearly visible (6x6 size)

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 2: Sheet Opens
**Steps:**
1. Click/tap hamburger button
2. Observe sheet animation

**Expected:**
- ✅ Sheet slides in from left
- ✅ Animation smooth (200ms)
- ✅ Backdrop appears (semi-transparent)
- ✅ Page content dims behind sheet

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 3: Navigation Links Visible
**Steps:**
1. Open sheet
2. Check all links present

**Expected:**
- ✅ Home link visible
- ✅ Features link visible
- ✅ About link visible
- ✅ Privacy Policy link visible
- ✅ Icons next to each link
- ✅ Text legible (not truncated)

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 4: Link Navigation (Hash Links)
**Steps:**
1. Open sheet
2. Click "Features" link
3. Observe behavior

**Expected:**
- ✅ Sheet closes smoothly
- ✅ Page scrolls to #features section
- ✅ Scroll is smooth (not instant jump)
- ✅ Correct section in view

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 5: Link Navigation (Page Links)
**Steps:**
1. Open sheet
2. Click "Privacy Policy" link
3. Observe navigation

**Expected:**
- ✅ Sheet closes
- ✅ Browser navigates to /privacy
- ✅ No console errors

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 6: Close via X Button
**Steps:**
1. Open sheet
2. Click X (close) button
3. Observe closing

**Expected:**
- ✅ Sheet closes smoothly
- ✅ Backdrop fades out
- ✅ Returns to original state

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 7: Close via Backdrop Click
**Steps:**
1. Open sheet
2. Click on dimmed area (outside sheet)
3. Observe closing

**Expected:**
- ✅ Sheet closes
- ✅ Same animation as X button

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 8: Close via ESC Key
**Steps:**
1. Open sheet
2. Press ESC key
3. Observe closing

**Expected:**
- ✅ Sheet closes
- ✅ Focus returns to hamburger button

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

## Responsive Testing

### Breakpoint Testing

#### Test 9: Mobile (375px - iPhone SE)
**Steps:**
1. Set viewport to 375px width
2. Open site

**Expected:**
- ✅ Hamburger button visible
- ✅ Desktop nav hidden
- ✅ Sheet 80% width (300px)
- ✅ Content fits without horizontal scroll

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 10: Mobile (390px - iPhone 14)
**Steps:**
1. Set viewport to 390px width
2. Test sheet functionality

**Expected:**
- ✅ Sheet 80% width (312px)
- ✅ All links visible
- ✅ No layout issues

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 11: Tablet (768px - iPad)
**Steps:**
1. Set viewport to 768px width
2. Check navigation display

**Expected:**
- ✅ Mobile nav hidden (md:hidden)
- ✅ Desktop nav visible
- ✅ Hamburger button hidden

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 12: Desktop (1024px+)
**Steps:**
1. Set viewport to 1024px width
2. Verify desktop navigation

**Expected:**
- ✅ Desktop nav visible
- ✅ Mobile nav completely hidden
- ✅ No sheet trigger visible

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 13: Orientation Change
**Steps:**
1. Start in portrait (375x667)
2. Open sheet
3. Rotate to landscape (667x375)

**Expected:**
- ✅ Sheet adapts to new orientation
- ✅ Content still accessible
- ✅ No layout breaks

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

## Accessibility Testing (WCAG 2.1 AA)

### Keyboard Navigation

#### Test 14: Tab Navigation
**Steps:**
1. Close sheet (if open)
2. Press Tab repeatedly
3. Observe focus progression

**Expected:**
- ✅ Focus reaches hamburger button
- ✅ Visible focus indicator (ring)
- ✅ Can continue tabbing to other elements

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 15: Enter Key Opens Sheet
**Steps:**
1. Tab to hamburger button
2. Press Enter
3. Observe sheet opening

**Expected:**
- ✅ Sheet opens on Enter key
- ✅ Focus moves to first link inside sheet

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 16: Tab Within Sheet
**Steps:**
1. Open sheet (keyboard)
2. Press Tab repeatedly
3. Observe focus movement

**Expected:**
- ✅ Focus cycles through all links
- ✅ Focus stays within sheet (focus trap)
- ✅ Cannot tab to background content
- ✅ Visible focus ring on each link

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 17: Enter Activates Link
**Steps:**
1. Open sheet
2. Tab to "Features" link
3. Press Enter

**Expected:**
- ✅ Link activates
- ✅ Sheet closes
- ✅ Page scrolls to section

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 18: ESC Closes Sheet
**Steps:**
1. Open sheet
2. Press ESC key

**Expected:**
- ✅ Sheet closes immediately
- ✅ Focus returns to hamburger button
- ✅ Focus ring visible on button

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

### Screen Reader Testing

#### Test 19: Hamburger Button Announcement
**Steps:**
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate to hamburger button
3. Listen to announcement

**Expected:**
- ✅ Announces: "Open navigation menu, button"
- ✅ Indicates it's interactive
- ✅ Clear purpose

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 20: Sheet Title Announcement
**Steps:**
1. Open sheet with screen reader active
2. Listen to announcement

**Expected:**
- ✅ Announces sheet title: "Runicorn"
- ✅ Announces description: "Navigate to different sections"
- ✅ Indicates dialog/modal opened

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 21: Navigation Links Announcement
**Steps:**
1. Tab through links with screen reader
2. Listen to each announcement

**Expected:**
- ✅ "Home, Return to homepage, link"
- ✅ "Features, Explore our features, link"
- ✅ "About, Learn about Runicorn, link"
- ✅ "Privacy Policy, View our privacy policy, link"

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 22: Icon Exclusion
**Steps:**
1. Navigate links with screen reader
2. Verify icons not announced

**Expected:**
- ✅ Icons have aria-hidden="true"
- ✅ Screen reader skips icons
- ✅ Only text is announced

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

### Focus Management

#### Test 23: Focus Trap Active
**Steps:**
1. Open sheet
2. Tab through all links
3. Continue tabbing

**Expected:**
- ✅ Focus cycles back to first link
- ✅ Cannot tab to background content
- ✅ Shift+Tab works in reverse

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 24: Focus Return on Close
**Steps:**
1. Tab to hamburger button
2. Press Enter to open
3. Press ESC to close
4. Observe focus

**Expected:**
- ✅ Focus returns to hamburger button
- ✅ Visible focus indicator
- ✅ Can continue tabbing from there

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

### Color Contrast

#### Test 25: Text Contrast (Light Mode)
**Steps:**
1. Set browser to light mode
2. Use contrast checker tool
3. Check all text elements

**Expected:**
- ✅ Sheet title: 4.5:1 minimum
- ✅ Link text: 4.5:1 minimum
- ✅ Description text: 4.5:1 minimum
- ✅ Footer text: 4.5:1 minimum

**Actual Result:**
- [ ] Pass
- [ ] Fail (contrast ratio: _____________)

---

#### Test 26: Text Contrast (Dark Mode)
**Steps:**
1. Toggle to dark mode
2. Check contrast ratios
3. Verify readability

**Expected:**
- ✅ All text meets 4.5:1 ratio
- ✅ No glare or readability issues

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 27: Focus Ring Contrast
**Steps:**
1. Tab to any interactive element
2. Check focus ring visibility
3. Measure contrast against background

**Expected:**
- ✅ Focus ring clearly visible
- ✅ 3:1 contrast minimum
- ✅ Consistent across all elements

**Actual Result:**
- [ ] Pass
- [ ] Fail (contrast ratio: _____________)

---

### Touch Targets

#### Test 28: Hamburger Button Size
**Steps:**
1. Inspect hamburger button
2. Measure dimensions

**Expected:**
- ✅ Minimum 44x44px
- ✅ Easy to tap with thumb
- ✅ No accidental taps nearby

**Actual Result:**
- [ ] Pass (size: _____ x _____)
- [ ] Fail (size: _____ x _____)

---

#### Test 29: Navigation Link Size
**Steps:**
1. Open sheet
2. Measure each link tap area

**Expected:**
- ✅ Full-width tap area
- ✅ Sufficient vertical padding
- ✅ Minimum 44px height

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

## Browser Compatibility

### Mobile Browsers

#### Test 30: iOS Safari (iPhone)
**Steps:**
1. Open on real iPhone or simulator
2. Test all functionality

**Expected:**
- ✅ Sheet opens smoothly
- ✅ Animations render correctly
- ✅ Touch gestures work
- ✅ No layout issues

**Actual Result:**
- [ ] Pass (iOS version: _______)
- [ ] Fail (details: _____________)

---

#### Test 31: Chrome Android
**Steps:**
1. Open on Android device
2. Test all functionality

**Expected:**
- ✅ All features work
- ✅ No rendering issues
- ✅ Back button doesn't interfere

**Actual Result:**
- [ ] Pass (Android version: _______)
- [ ] Fail (details: _____________)

---

#### Test 32: Firefox Mobile
**Steps:**
1. Test on Firefox for Android/iOS
2. Verify functionality

**Expected:**
- ✅ Sheet works correctly
- ✅ No console errors
- ✅ Smooth performance

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

### Desktop Browsers

#### Test 33: Chrome Desktop
**Steps:**
1. Test on Chrome desktop
2. Resize to mobile viewport
3. Test sheet functionality

**Expected:**
- ✅ All features work
- ✅ DevTools show no errors

**Actual Result:**
- [ ] Pass (Chrome version: _______)
- [ ] Fail (details: _____________)

---

#### Test 34: Firefox Desktop
**Steps:**
1. Test on Firefox desktop
2. Use responsive design mode

**Expected:**
- ✅ Sheet renders correctly
- ✅ Animations smooth

**Actual Result:**
- [ ] Pass (Firefox version: _______)
- [ ] Fail (details: _____________)

---

#### Test 35: Safari Desktop
**Steps:**
1. Test on macOS Safari
2. Use responsive design mode

**Expected:**
- ✅ All features work
- ✅ No webkit-specific issues

**Actual Result:**
- [ ] Pass (Safari version: _______)
- [ ] Fail (details: _____________)

---

## Performance Testing

#### Test 36: Sheet Open Performance
**Steps:**
1. Open Chrome DevTools Performance tab
2. Record sheet opening
3. Check frame rate

**Expected:**
- ✅ 60fps animation
- ✅ No dropped frames
- ✅ < 200ms total duration

**Actual Result:**
- [ ] Pass (FPS: _____, duration: _____ms)
- [ ] Fail (details: _____________)

---

#### Test 37: Bundle Size
**Steps:**
1. Build production bundle
2. Check MobileNav component size

**Expected:**
- ✅ < 10KB total (gzipped: < 3KB)
- ✅ No unused dependencies

**Actual Result:**
- [ ] Pass (size: _____ KB)
- [ ] Fail (size: _____ KB)

---

#### Test 38: Lighthouse Score
**Steps:**
1. Run Lighthouse audit (mobile)
2. Check scores

**Expected:**
- ✅ Performance: 90+
- ✅ Accessibility: 100
- ✅ Best Practices: 90+

**Actual Result:**
- [ ] Pass (P: ___, A: ___, BP: ___)
- [ ] Fail (details: _____________)

---

## Edge Cases

#### Test 39: Missing Hash Section
**Steps:**
1. Add link to non-existent section (#missing)
2. Click link
3. Observe behavior

**Expected:**
- ✅ Sheet closes
- ✅ No error thrown
- ✅ No console warning (or graceful warning)
- ✅ Page state unchanged

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 40: Rapid Open/Close
**Steps:**
1. Quickly open and close sheet 5 times
2. Observe behavior

**Expected:**
- ✅ No animation glitches
- ✅ State remains consistent
- ✅ No memory leaks

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 41: JavaScript Disabled
**Steps:**
1. Disable JavaScript in browser
2. Refresh page
3. Check navigation

**Expected:**
- ✅ Links still visible (or fallback exists)
- ✅ Basic navigation still works
- ✅ Graceful degradation

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

#### Test 42: Very Small Viewport (320px)
**Steps:**
1. Set viewport to 320px (iPhone 5)
2. Open sheet
3. Check layout

**Expected:**
- ✅ Sheet 80% width (256px)
- ✅ Content fits without overflow
- ✅ Text not truncated
- ✅ Footer visible

**Actual Result:**
- [ ] Pass
- [ ] Fail (details: _____________)

---

## Automated Testing

### Unit Tests (Example)

```typescript
// MobileNav.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileNav } from './MobileNav'

describe('MobileNav', () => {
  it('renders hamburger button', () => {
    render(<MobileNav />)
    const button = screen.getByLabelText(/open navigation menu/i)
    expect(button).toBeInTheDocument()
  })

  it('opens sheet on click', () => {
    render(<MobileNav />)
    const button = screen.getByLabelText(/open navigation menu/i)
    fireEvent.click(button)

    const title = screen.getByText(/runicorn/i)
    expect(title).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<MobileNav />)
    const button = screen.getByLabelText(/open navigation menu/i)
    fireEvent.click(button)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('closes sheet when link is clicked', () => {
    render(<MobileNav />)
    const button = screen.getByLabelText(/open navigation menu/i)
    fireEvent.click(button)

    const homeLink = screen.getByText('Home')
    fireEvent.click(homeLink)

    // Sheet should close
    setTimeout(() => {
      expect(screen.queryByText('Navigate to different sections')).not.toBeInTheDocument()
    }, 500)
  })
})
```

### Accessibility Tests (Example)

```typescript
// MobileNav.a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MobileNav } from './MobileNav'

expect.extend(toHaveNoViolations)

describe('MobileNav Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MobileNav />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Test Summary

**Total Tests**: 42
**Required Pass Rate**: 100%

### Results
- [ ] Functional: ___/14 passed
- [ ] Responsive: ___/6 passed
- [ ] Accessibility: ___/15 passed
- [ ] Browser Compat: ___/6 passed
- [ ] Performance: ___/3 passed
- [ ] Edge Cases: ___/4 passed

**Overall Pass Rate**: ____%

## Sign-Off

**Tester Name**: _________________
**Date**: _________________
**Environment**: _________________
**Browser Versions**: _________________
**Device Models**: _________________

**Approved for Production**: [ ] Yes [ ] No

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**Last Updated**: 2025-10-27
**Related Issue**: RNLT-36
