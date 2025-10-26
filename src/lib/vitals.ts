/**
 * Web Vitals Tracking
 * Measures Core Web Vitals and sends to Umami Analytics
 *
 * @see https://web.dev/vitals/
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB, type Metric } from 'web-vitals'

// Extend Window type for Umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void
    }
  }
}

/**
 * Send metric to Umami Analytics
 */
function sendToAnalytics(metric: Metric): void {
  // Round value for cleaner reporting
  const value = Math.round(
    metric.name === 'CLS' ? metric.value * 1000 : metric.value
  )

  // Determine rating (good, needs-improvement, poor)
  const rating = getRating(metric)

  console.log(`[Web Vitals] ${metric.name}:`, {
    value: metric.name === 'CLS' ? metric.value : `${value}ms`,
    rating,
    id: metric.id,
  })

  // Send to Umami if available
  if (window.umami) {
    window.umami.track('web-vitals', {
      metric: metric.name,
      value: value,
      rating: rating,
      navigationType: metric.navigationType,
    })
  }

  // Also send to Sentry for performance monitoring (optional)
  // if (window.Sentry) {
  //   window.Sentry.setMeasurement(metric.name, value, 'millisecond')
  // }
}

/**
 * Get rating based on Web Vitals thresholds
 */
function getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    FCP: [1800, 3000],  // First Contentful Paint
    LCP: [2500, 4000],  // Largest Contentful Paint
    FID: [100, 300],    // First Input Delay (deprecated, use INP)
    CLS: [0.1, 0.25],   // Cumulative Layout Shift
    TTFB: [800, 1800],  // Time to First Byte
  }

  const [good, poor] = thresholds[metric.name as keyof typeof thresholds] || [0, 0]
  const value = metric.value

  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Initialize Web Vitals tracking
 * Call this once in your app's main entry point
 */
export function initWebVitals(): void {
  // Only track in production
  if (import.meta.env.DEV) {
    console.log('[Web Vitals] Tracking disabled in development')
    return
  }

  try {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics) // Deprecated but still measured for compatibility
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)

    console.log('[Web Vitals] Tracking initialized')
  } catch (error) {
    console.error('[Web Vitals] Failed to initialize:', error)
  }
}

/**
 * Track custom performance metrics
 */
export function trackPerformance(metricName: string, value: number): void {
  if (window.umami) {
    window.umami.track('custom-metric', {
      metric: metricName,
      value: Math.round(value),
    })
  }
}
