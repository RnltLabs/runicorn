interface HeaderProps {
  onLogoClick?: () => void
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
            <div className="rounded-xl p-1 shadow-sm" style={{ backgroundColor: '#fa7315' }}>
              <img
                src="/unicorn-logo.png"
                alt="Runicorn Logo"
                className="h-11 w-11 object-contain translate-y-0.5"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Runicorn
              </h1>
            </div>
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
