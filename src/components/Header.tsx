/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  onLogoClick?: () => void
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center">
              <img
                src={`${import.meta.env.BASE_URL}r-logo.png`}
                alt="Runicorn"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold tracking-tight -ml-1">
                unicorn
              </span>
            </div>
          </button>

          {/* Tagline & Imprint */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Separator orientation="vertical" className="h-6" />
              <p className="text-sm text-muted-foreground font-medium">
                GPS art made simple
              </p>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <a
              href="https://rnltlabs.de/imprint.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
              Imprint
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
