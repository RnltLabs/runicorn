/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { useState, useEffect } from 'react'
import { loadUmamiAnalytics } from '@/lib/analytics'

const CONSENT_KEY = 'runicorn-cookie-consent'

interface CookieConsent {
  necessary: boolean
  analytics: boolean
  timestamp: number
}

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      // Show banner after short delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const saveConsent = (analytics: boolean) => {
    const consent: CookieConsent = {
      necessary: true,
      analytics,
      timestamp: Date.now()
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    setShowBanner(false)

    // Load analytics if user accepted
    if (analytics) {
      loadUmamiAnalytics()
    }
  }

  const acceptAll = () => {
    saveConsent(true)
  }

  const acceptNecessary = () => {
    saveConsent(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10001] bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom-5">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 text-sm">
            <p className="font-semibold mb-2">🍪 We use cookies</p>
            <p className="text-muted-foreground">
              This website uses technically necessary cookies and optional analytics cookies (Umami, privacy-friendly, no personal data).
              You can choose to accept all or only necessary cookies.
              {' '}
              <a
                href="#/datenschutz"
                className="text-primary hover:underline"
              >
                Learn more
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Necessary only
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
