"use client"

import { useState } from "react"
import { Menu, Home, Zap, BookOpen, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface NavigationLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

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
  {
    href: "#about",
    label: "About",
    icon: BookOpen,
    description: "Learn about Runicorn",
  },
  {
    href: "/privacy",
    label: "Privacy Policy",
    icon: Shield,
    description: "View our privacy policy",
  },
]

export function MobileNav(): React.JSX.Element {
  const [open, setOpen] = useState<boolean>(false)

  const handleLinkClick = (href: string): void => {
    setOpen(false)

    // Handle hash navigation (smooth scroll)
    if (href.startsWith("#")) {
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 300) // Wait for sheet to close
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[80%] sm:w-[350px]"
        aria-describedby="mobile-nav-description"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-left text-2xl font-bold">
            Runicorn
          </SheetTitle>
          <SheetDescription id="mobile-nav-description" className="text-left">
            Navigate to different sections
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col space-y-2 mt-6" role="navigation">
          {navigationLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("#")) {
                    e.preventDefault()
                  }
                  handleLinkClick(link.href)
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg
                           hover:bg-accent hover:text-accent-foreground
                           focus:bg-accent focus:text-accent-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                           transition-colors"
                aria-label={link.description}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="text-base font-medium">{link.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Runicorn &copy; {new Date().getFullYear()}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
