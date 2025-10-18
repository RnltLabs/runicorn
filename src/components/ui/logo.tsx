/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

export function UnicornLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head outline */}
      <path
        d="M 25 85 C 25 85 20 80 20 70 L 20 50 C 20 45 21 40 23 36 C 25 32 28 28 32 25 C 36 22 40 20 45 20 C 48 20 51 21 54 22 L 58 25 C 60 27 62 30 63 33 C 65 36 66 40 66 44 L 66 50 C 66 55 65 60 63 65 C 61 70 58 75 54 78 C 50 82 45 85 40 87 L 35 88 L 30 87 L 25 85 Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Nose/Snout */}
      <path
        d="M 20 55 C 18 57 16 60 15 62 C 14 64 14 66 15 67 C 16 68 17 68 18 67"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Horn with stripes */}
      <path
        d="M 54 22 L 68 8 L 72 4"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 56 20 L 60 16 M 60 16 L 64 12 M 64 12 L 68 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Ears */}
      <path
        d="M 45 20 L 48 12 L 52 16"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 52 16 L 56 10 L 58 14"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Mane - flowing strands */}
      <path
        d="M 32 25 C 28 28 24 35 22 42"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 36 22 C 32 26 28 32 26 38"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 40 20 C 36 24 32 30 30 36"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eye */}
      <circle cx="42" cy="38" r="2.5" fill="white" />

      {/* Nostril */}
      <circle cx="20" cy="58" r="1.5" fill="white" />
    </svg>
  )
}
