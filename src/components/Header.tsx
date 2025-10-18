interface HeaderProps {
  onLogoClick?: () => void
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-end cursor-pointer" onClick={onLogoClick}>
            <img
              src="/r-logo.png"
              alt="R Logo"
              className="h-11 w-auto object-contain -mb-0.5"
            />
            <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground select-none leading-none -ml-1.5 mt-1">
              unicorn
            </h1>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm text-muted-foreground">
              Because normal routes are boring AF
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
