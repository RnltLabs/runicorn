export function UnicornLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Unicorn head outline as a route path */}
      <path
        d="M 50 85 C 50 85 45 80 40 70 C 35 60 32 50 32 40 C 32 35 33 30 35 26 L 38 20 L 42 16 L 45 14 C 48 12 50 12 52 12 C 54 12 56 13 58 15 L 62 18 L 65 22 L 68 28 C 70 32 71 36 71 40 C 71 42 70.5 44 70 46 L 68 52 L 65 58 L 60 70 C 55 80 50 85 50 85 Z M 45 14 L 40 8 L 38 4"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Ear */}
      <path
        d="M 58 15 L 62 10 L 64 14"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Eye */}
      <circle cx="55" cy="28" r="2.5" fill="white" />
    </svg>
  )
}
