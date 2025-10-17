import { UnicornLogo } from "@/components/ui/logo"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl p-2 shadow-sm">
              <UnicornLogo className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Runicorn
              </h1>
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm text-muted-foreground">
              Plan your perfect route
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
