# shadcn/ui Component Installation Guide

This document tracks which shadcn/ui components are installed in the Runicorn project.

## Installation Commands

### Required Components for Mobile Navigation (RNLT-36)

```bash
# Install Sheet component (for mobile drawer navigation)
npx shadcn-ui@latest add sheet

# Install Button component (if not already installed)
npx shadcn-ui@latest add button
```

## Installed Components

### Navigation Components
- **Sheet**: Mobile drawer navigation (side: left)
  - Dependencies: Radix UI Portal, Dialog Primitive
  - Used in: `MobileNav.tsx`
  - Accessibility: Focus trap, ESC key support, ARIA labels

- **Button**: Interactive buttons with variants
  - Variants: default, ghost, outline, destructive, secondary, link
  - Sizes: default, sm, lg, icon
  - Used in: `MobileNav.tsx` (hamburger icon)

## Component Configuration

All shadcn/ui components are configured in:
- **Components directory**: `/src/components/ui/`
- **Tailwind config**: `tailwind.config.ts`
- **Global styles**: `src/app/globals.css`

## Theme Integration

Components use CSS variables for theming:
- Light mode: `--background`, `--foreground`, etc.
- Dark mode: `.dark` class variants
- Configured in: `globals.css`

## TypeScript Support

All components are fully typed:
- Strict mode enabled
- No `any` types
- Proper prop types and generics

## Accessibility Features

shadcn/ui components include:
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes

## Testing

Components can be tested with:
- React Testing Library
- Accessibility testing: axe-core
- Visual regression: Chromatic (if configured)

## Future Components

As the project grows, additional components may be needed:
- Dialog (modals)
- DropdownMenu (user menu)
- Toast (notifications)
- Form (form handling)
- Input, Textarea, Select (form fields)
- Card (content containers)

## Documentation

Official shadcn/ui docs: https://ui.shadcn.com

## Notes

- All components use Tailwind CSS utilities
- Components are copied into the project (not installed as npm package)
- Customization is done via className props
- No custom CSS files needed
