# FIX #1: API Key Security (GraphHopper)

**Issue**: GraphHopper API key exposed in client-side JavaScript bundle  
**Severity**: CRITICAL ❌  
**OWASP**: A02:2021 - Cryptographic Failures  
**Priority**: HEUTE (Today)

---

## Problem

```typescript
// ❌ BAD: src/lib/graphhopper.ts
const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY

// Client bundle contains:
// "a65c854a-06df-44dd-94f5-e013c845436b"
// → Anyone can extract this!
```

**Impact:**
- Unlimited API abuse on your account
- Potential costs (GraphHopper charges per request above free tier)
- Rate limit exhaustion → DoS for legitimate users

---

## Solution Options

### OPTION 1: Cloudflare Workers Proxy (RECOMMENDED ⭐)

**Pros:**
- Free tier (100,000 requests/day)
- Zero server maintenance
- Global edge network (fast)
- Easy deployment

**Cons:**
- Requires Cloudflare account
- Slight learning curve

**Implementation:**

```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Create new worker project
mkdir runicorn-api-proxy
cd runicorn-api-proxy
npm init -y
npm install --save-dev wrangler
```

```typescript
// src/worker.ts
export interface Env {
  GRAPHHOPPER_API_KEY: string
}

interface RouteRequest {
  points: [number, number][]
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://runicorn.io',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const body: RouteRequest = await request.json()
      const { points } = body

      // Validate input
      if (!Array.isArray(points) || points.length < 2) {
        return new Response(
          JSON.stringify({ error: 'Invalid points array' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Limit number of points (prevent abuse)
      if (points.length > 100) {
        return new Response(
          JSON.stringify({ error: 'Too many points (max 100)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Build GraphHopper URL
      const pointsParam = points.map(p => `point=${p[0]},${p[1]}`).join('&')
      const url = `https://graphhopper.com/api/1/route?${pointsParam}&profile=foot&locale=de&points_encoded=false&key=${env.GRAPHHOPPER_API_KEY}`

      // Proxy request to GraphHopper
      const response = await fetch(url)
      const data = await response.json()

      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  },
}
```

```toml
# wrangler.toml
name = "runicorn-api-proxy"
main = "src/worker.ts"
compatibility_date = "2025-10-26"

[vars]
# Non-sensitive vars can go here

# Add secret via CLI (NOT in this file!)
# wrangler secret put GRAPHHOPPER_API_KEY
```

```bash
# 4. Add API key as secret
wrangler secret put GRAPHHOPPER_API_KEY
# Paste your NEW GraphHopper API key (generate new one!)

# 5. Deploy
wrangler deploy

# Output: https://runicorn-api-proxy.your-subdomain.workers.dev
```

**Frontend changes:**

```typescript
// src/lib/graphhopper.ts - UPDATED

// ❌ REMOVE:
// const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY
// const url = `https://graphhopper.com/api/1/route?${pointsParam}&profile=foot&key=${apiKey}`

// ✅ ADD:
const PROXY_URL = 'https://runicorn-api-proxy.your-subdomain.workers.dev'

export async function snapToRoad(
  points: [number, number][],
  onProgress?: (current: number, total: number) => void
): Promise<RouteResult> {
  // ... existing code ...

  for (let i = 0; i < simplifiedPoints.length - 1; i += batchSize - 1) {
    const batchEnd = Math.min(i + batchSize, simplifiedPoints.length)
    const batch = simplifiedPoints.slice(i, batchEnd)

    try {
      // ✅ NEW: Call Cloudflare Worker proxy
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: batch }),
      })

      if (!response.ok) {
        throw new Error(`Proxy error: ${response.status}`)
      }

      const data = await response.json()

      // ... existing route processing code ...
    } catch (error) {
      logger.error('graphhopper_proxy_error', error as Error)
      throw error
    }
  }

  // ... rest of function ...
}
```

**Environment cleanup:**

```bash
# .env - REMOVE GraphHopper API key
# ❌ DELETE THIS LINE:
# VITE_GRAPHHOPPER_API_KEY=...

# Keep only:
VITE_DISCORD_WEBHOOK_ERRORS=...
VITE_DISCORD_WEBHOOK_CRITICAL=...
VITE_APP_VERSION=1.1.0
```

---

### OPTION 2: Vercel Edge Functions (Alternative)

```typescript
// api/route-snap.ts
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const { points } = await req.json()

  // Validate + call GraphHopper (same logic as Cloudflare Worker)
  const pointsParam = points.map(p => `point=${p[0]},${p[1]}`).join('&')
  const url = `https://graphhopper.com/api/1/route?${pointsParam}&key=${process.env.GRAPHHOPPER_API_KEY}`

  const response = await fetch(url)
  const data = await response.json()

  return NextResponse.json(data)
}
```

---

### OPTION 3: TEMPORARY FIX - Domain Restrictions

**⚠️ WARNING**: NOT 100% secure (Referer header can be spoofed)  
**Use only as TEMPORARY measure until backend proxy is ready**

```
1. Go to GraphHopper Dashboard
2. API Key Settings → Add Allowed Domains:
   - runicorn.io
   - staging.runicorn.io
3. Save

IMPORTANT: This is NOT foolproof! Implement backend proxy ASAP.
```

---

## Immediate Action Steps

### TODAY (within 1 hour):

1. **Generate NEW GraphHopper API key**
   ```
   GraphHopper Dashboard → API Keys → Create New Key
   Name: "Runicorn Production (Secure)"
   ```

2. **Revoke OLD API key**
   ```
   GraphHopper Dashboard → API Keys → Delete old key
   Reason: "Exposed in client bundle - rotating for security"
   ```

3. **Add domain restrictions to NEW key** (temporary)
   ```
   Allowed Domains: runicorn.io, staging.runicorn.io
   ```

4. **Update environment variables**
   ```bash
   # Production deployment: Update secrets
   # GitHub Actions: Update repository secret VITE_GRAPHHOPPER_API_KEY
   # Vercel/Netlify: Update environment variable
   ```

### THIS WEEK:

5. **Implement Cloudflare Workers proxy** (see OPTION 1 above)

6. **Remove API key from client bundle**
   ```bash
   # Remove from .env
   # Update src/lib/graphhopper.ts to use proxy
   ```

7. **Deploy + test**
   ```bash
   npm run build
   # Check dist/assets/*.js - should NOT contain API key!
   ```

---

## Verification

### Test 1: API key NOT in bundle

```bash
# After build:
grep -r "graphhopper.*key\|a65c854a" dist/
# Should return NOTHING

# Check bundle manually:
cat dist/assets/index-*.js | grep -i "graphhopper"
# Should NOT show API key
```

### Test 2: Proxy works

```bash
# Test Cloudflare Worker:
curl -X POST https://runicorn-api-proxy.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"points": [[49.0069, 8.4037], [49.0070, 8.4038]]}'

# Should return GraphHopper route response
```

### Test 3: CORS headers

```javascript
// Browser console on runicorn.io:
fetch('https://runicorn-api-proxy.your-subdomain.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ points: [[49, 8], [49.1, 8.1]] })
})
.then(r => r.json())
.then(console.log)
// Should work without CORS errors
```

---

## Rollback Plan

If proxy breaks production:

1. **Quick fix**: Enable old API key temporarily in GraphHopper dashboard
2. **Revert**: `git revert <commit>` to restore direct API calls
3. **Redeploy**: Push to production
4. **Debug**: Fix proxy issue in staging first

---

## Cost Analysis

**Before (Direct API calls):**
- API key exposed → unlimited abuse possible
- Risk: $$$$ in overages if key is abused

**After (Cloudflare Workers):**
- Free tier: 100,000 requests/day
- Beyond free tier: $0.50 per million requests
- Estimated cost: $0/month (well within free tier)

**ROI**: Infinite (prevents potentially thousands in abuse costs)

---

## Related Issues

- Issue #10: Client-side rate limiting (prevents legitimate user abuse)
- Issue #2: Security headers (prevent key extraction via XSS)

---

**Status**: ❌ NOT FIXED  
**Assigned**: Roman Reinelt  
**Due**: 2025-10-26 (TODAY)  
**Estimate**: 2 hours (including Cloudflare setup)
