export function DesktopNav(): React.JSX.Element {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "/privacy", label: "Privacy" },
  ]

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <nav
      className="hidden md:flex items-center space-x-6"
      role="navigation"
      aria-label="Main navigation"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className="text-sm font-medium transition-colors
                     hover:text-foreground/80 text-foreground/60
                     focus:outline-none focus:text-foreground
                     focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-2 py-1"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
