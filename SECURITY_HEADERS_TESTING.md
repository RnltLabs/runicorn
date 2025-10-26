# Security Headers Testing Guide

**Project**: Runicorn (GPS Art Route Planner)  
**Date**: 2025-10-27  
**Related**: RNLT-36 - Security Headers Implementation

---

## Overview

This guide provides comprehensive testing instructions for verifying that all HTTP security headers are properly configured in the nginx server.

**Security Headers Implemented:**
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security (HSTS) - *commented out until HTTPS is configured*

---

## Prerequisites

**Before Testing:**
1. nginx.conf has been updated with security headers
2. nginx configuration has been tested: `nginx -t`
3. nginx has been reloaded: `nginx -s reload` or `systemctl restart nginx`
4. Application is accessible (locally or production)

---

## Test 1: Basic Header Verification (curl)

### Test All Headers at Once

```bash
# Test production (replace with your domain)
curl -I https://runicorn.io

# Test local Docker container
curl -I http://localhost:3002

# Expected Output (should include ALL of these):
HTTP/1.1 200 OK
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.rnltlabs.de https://errors.rnltlabs.de https://unpkg.com; ...
```

### Test Individual Headers

```bash
# X-Frame-Options (Clickjacking Protection)
curl -I https://runicorn.io | grep -i "x-frame-options"
# Expected: X-Frame-Options: DENY

# X-Content-Type-Options (MIME Sniffing Protection)
curl -I https://runicorn.io | grep -i "x-content-type-options"
# Expected: X-Content-Type-Options: nosniff

# X-XSS-Protection (XSS Filter)
curl -I https://runicorn.io | grep -i "x-xss-protection"
# Expected: X-XSS-Protection: 1; mode=block

# Referrer-Policy (Privacy)
curl -I https://runicorn.io | grep -i "referrer-policy"
# Expected: Referrer-Policy: strict-origin-when-cross-origin

# Permissions-Policy (Feature Control)
curl -I https://runicorn.io | grep -i "permissions-policy"
# Expected: Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()

# Content Security Policy (XSS Prevention)
curl -I https://runicorn.io | grep -i "content-security-policy"
# Expected: Content-Security-Policy: default-src 'self'; script-src ...

# Server Tokens (Information Disclosure Prevention)
curl -I https://runicorn.io | grep -i "server:"
# Expected: Server: nginx (NO version number like "nginx/1.25.3")
```

### Test Static Assets (verify headers persist)

```bash
# Test a static JS file
curl -I https://runicorn.io/assets/index-abc123.js | grep -E "x-frame-options|x-content-type-options|cache-control"

# Expected:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Cache-Control: public, immutable
```

---

## Test 2: Browser DevTools Verification

### Step-by-Step:

1. **Open Browser** (Chrome, Firefox, or Edge)
2. **Navigate** to https://runicorn.io
3. **Open DevTools** (F12 or Right-click → Inspect)
4. **Go to Network tab**
5. **Reload page** (Ctrl+R / Cmd+R)
6. **Click on first request** (should be document type, e.g., `runicorn.io`)
7. **Scroll to Response Headers section**

### Expected Headers:

```
Response Headers:
├── content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://analytics.rnltlabs.de https://errors.rnltlabs.de https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.tile.openstreetmap.org; connect-src 'self' https://runicorn-api-proxy.*.workers.dev https://analytics.rnltlabs.de https://errors.rnltlabs.de https://nominatim.openstreetmap.org; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;
├── x-frame-options: DENY
├── x-content-type-options: nosniff
├── x-xss-protection: 1; mode=block
├── referrer-policy: strict-origin-when-cross-origin
└── permissions-policy: camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()
```

---

## Test 3: CSP Violation Testing

### Test 3.1: Block Unauthorized Script

**Purpose**: Verify CSP blocks malicious scripts

1. Open https://runicorn.io
2. Open Browser Console (F12 → Console tab)
3. Paste and execute:

```javascript
const script = document.createElement('script')
script.src = 'https://evil.com/malicious.js'
document.head.appendChild(script)
```

4. **Expected Result**: CSP Error in console

```
Refused to load the script 'https://evil.com/malicious.js' because it violates the following Content Security Policy directive: "script-src 'self' 'unsafe-inline' https://analytics.rnltlabs.de https://errors.rnltlabs.de https://unpkg.com".
```

### Test 3.2: Allow Authorized Script (Umami)

**Purpose**: Verify CSP allows Umami analytics

1. Open https://runicorn.io
2. Open Network tab in DevTools
3. Filter by "script.js"
4. **Expected Result**: Request to `https://analytics.rnltlabs.de/script.js` should succeed (Status 200)

### Test 3.3: Block Unauthorized Iframe

**Purpose**: Verify frame-ancestors prevents embedding

1. Create test HTML file:

```html
<!-- test-iframe.html -->
<!DOCTYPE html>
<html>
<body>
  <iframe src="https://runicorn.io"></iframe>
</body>
</html>
```

2. Open test-iframe.html in browser
3. Open Console (F12)
4. **Expected Result**: CSP Error

```
Refused to frame 'https://runicorn.io/' because it violates the following Content Security Policy directive: "frame-ancestors 'none'".
```

OR X-Frame-Options error:

```
Refused to display 'https://runicorn.io/' in a frame because it set 'X-Frame-Options' to 'DENY'.
```

---

## Test 4: Third-Party Security Scanners

### Test 4.1: SecurityHeaders.com

**URL**: https://securityheaders.com

1. Go to https://securityheaders.com
2. Enter: `https://runicorn.io`
3. Click "Scan"
4. **Expected Grade**: A or A+ (depending on HSTS)

**Current Expected Grade**: A (without HSTS)  
**After HTTPS + HSTS**: A+

**Grading Breakdown:**
- X-Frame-Options: DENY ✅
- X-Content-Type-Options: nosniff ✅
- X-XSS-Protection: 1; mode=block ✅
- Referrer-Policy: strict-origin-when-cross-origin ✅
- Permissions-Policy: (present) ✅
- Content-Security-Policy: (present) ✅
- Strict-Transport-Security: (missing until HTTPS) ⏳

### Test 4.2: Mozilla Observatory

**URL**: https://observatory.mozilla.org

1. Go to https://observatory.mozilla.org
2. Enter: `https://runicorn.io`
3. Click "Scan"
4. **Expected Score**: B+ to A- (without HSTS)

**After HSTS**: A to A+

### Test 4.3: OWASP ZAP Scan (Advanced)

**Tool**: OWASP ZAP (Zed Attack Proxy)

```bash
# Install OWASP ZAP (Docker)
docker pull zaproxy/zap-stable

# Run automated scan
docker run -t zaproxy/zap-stable zap-baseline.py -t https://runicorn.io

# Expected: No high/medium security issues related to missing headers
```

---

## Test 5: Functional Testing (Ensure Nothing Broke)

### Test 5.1: Map Loads Correctly

1. Open https://runicorn.io
2. **Expected**: OpenStreetMap tiles load (CSP allows `*.tile.openstreetmap.org`)
3. **Check Console**: No CSP errors related to map tiles

### Test 5.2: Search Works

1. Click search bar
2. Type "Berlin"
3. **Expected**: Geocoding search works (CSP allows `nominatim.openstreetmap.org`)
4. **Check Network Tab**: Request to `nominatim.openstreetmap.org` succeeds

### Test 5.3: Analytics Tracking

1. Open https://runicorn.io
2. Open Network tab
3. Filter by "analytics.rnltlabs.de"
4. **Expected**: `script.js` loads (CSP allows `analytics.rnltlabs.de`)
5. Perform action (e.g., draw route)
6. **Expected**: Tracking request to Umami succeeds

### Test 5.4: Error Tracking (GlitchTip)

1. Open Console (F12)
2. Trigger error (e.g., invalid GPX import)
3. **Expected**: Error sent to GlitchTip (CSP allows `errors.rnltlabs.de`)
4. **Verify**: Check GlitchTip dashboard for error

### Test 5.5: Google Fonts Load

1. Open https://runicorn.io
2. Open Network tab
3. Filter by "fonts"
4. **Expected**:
   - Request to `fonts.googleapis.com` succeeds (CSP allows)
   - Request to `fonts.gstatic.com` succeeds (CSP allows)
5. **Visual Check**: Figtree font is applied (not fallback)

### Test 5.6: Leaflet Library

1. Open https://runicorn.io
2. Open Network tab
3. Filter by "unpkg.com"
4. **Expected**: Requests to `unpkg.com/leaflet` succeed (CSP allows)
5. **Visual Check**: Leaflet map controls render correctly

---

## Test 6: Automated Testing Script

Create a test script for CI/CD:

```bash
#!/bin/bash
# test-security-headers.sh

URL="https://runicorn.io"
FAILED=0

echo "Testing Security Headers on $URL"
echo "=================================="

# Test 1: X-Frame-Options
echo -n "Testing X-Frame-Options... "
HEADER=$(curl -s -I $URL | grep -i "x-frame-options: DENY")
if [ -z "$HEADER" ]; then
  echo "❌ FAILED"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED"
fi

# Test 2: X-Content-Type-Options
echo -n "Testing X-Content-Type-Options... "
HEADER=$(curl -s -I $URL | grep -i "x-content-type-options: nosniff")
if [ -z "$HEADER" ]; then
  echo "❌ FAILED"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED"
fi

# Test 3: X-XSS-Protection
echo -n "Testing X-XSS-Protection... "
HEADER=$(curl -s -I $URL | grep -i "x-xss-protection: 1; mode=block")
if [ -z "$HEADER" ]; then
  echo "❌ FAILED"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED"
fi

# Test 4: Referrer-Policy
echo -n "Testing Referrer-Policy... "
HEADER=$(curl -s -I $URL | grep -i "referrer-policy: strict-origin-when-cross-origin")
if [ -z "$HEADER" ]; then
  echo "❌ FAILED"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED"
fi

# Test 5: Permissions-Policy
echo -n "Testing Permissions-Policy... "
HEADER=$(curl -s -I $URL | grep -i "permissions-policy:")
if [ -z "$HEADER" ]; then
  echo "❌ FAILED"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED"
fi

# Test 6: Content-Security-Policy
echo -n "Testing Content-Security-Policy... "
HEADER=$(curl -s -I $URL | grep -i "content-security-policy:")
if [ -z "$HEADER" ]; then
  echo "❌ FAILED"
  FAILED=$((FAILED + 1))
else
  echo "✅ PASSED"
fi

# Test 7: Server Tokens (should NOT contain version)
echo -n "Testing Server Tokens... "
HEADER=$(curl -s -I $URL | grep -i "server:" | grep -E "nginx/[0-9]")
if [ -z "$HEADER" ]; then
  echo "✅ PASSED (version hidden)"
else
  echo "❌ FAILED (version exposed)"
  FAILED=$((FAILED + 1))
fi

# Test 8: HSTS (optional - only after HTTPS)
echo -n "Testing HSTS (optional)... "
HEADER=$(curl -s -I $URL | grep -i "strict-transport-security:")
if [ -z "$HEADER" ]; then
  echo "⏳ SKIPPED (not yet enabled)"
else
  echo "✅ PASSED"
fi

echo ""
echo "=================================="
if [ $FAILED -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ $FAILED test(s) failed!"
  exit 1
fi
```

**Usage:**

```bash
# Make executable
chmod +x test-security-headers.sh

# Run tests
./test-security-headers.sh

# Expected Output:
# Testing Security Headers on https://runicorn.io
# ==================================
# Testing X-Frame-Options... ✅ PASSED
# Testing X-Content-Type-Options... ✅ PASSED
# Testing X-XSS-Protection... ✅ PASSED
# Testing Referrer-Policy... ✅ PASSED
# Testing Permissions-Policy... ✅ PASSED
# Testing Content-Security-Policy... ✅ PASSED
# Testing Server Tokens... ✅ PASSED (version hidden)
# Testing HSTS (optional)... ⏳ SKIPPED (not yet enabled)
# ==================================
# ✅ All tests passed!
```

---

## Test 7: Performance Impact (Optional)

### Verify Headers Don't Slow Down Response

```bash
# Test response time before (baseline)
time curl -I https://runicorn.io

# Expected: ~100-300ms (should be same as before headers were added)
# Headers add negligible overhead (~1-2ms)
```

---

## Common Issues & Troubleshooting

### Issue 1: Headers Not Appearing

**Symptoms**: `curl -I` shows no security headers

**Possible Causes:**
1. nginx configuration not reloaded
2. Wrong nginx config file location
3. Reverse proxy stripping headers

**Solution:**

```bash
# Check nginx config location
nginx -V 2>&1 | grep "conf-path"

# Reload nginx
nginx -s reload

# Check nginx error log
tail -f /var/log/nginx/error.log

# Verify config is loaded
nginx -T | grep "add_header"
```

### Issue 2: CSP Blocks Legitimate Resources

**Symptoms**: Console shows CSP violation for Umami, Google Fonts, etc.

**Possible Causes:**
1. CSP policy too strict
2. External domain not whitelisted

**Solution:**

```bash
# Check which resource is blocked (browser console)
# Example: "Refused to load ... https://example.com/script.js"

# Add domain to CSP in nginx.conf
# For scripts: add to script-src
# For styles: add to style-src
# For images: add to img-src
# For API calls: add to connect-src

# Reload nginx
nginx -s reload
```

### Issue 3: Site Embedded in Iframe Still Works

**Symptoms**: X-Frame-Options: DENY not working

**Possible Causes:**
1. Browser ignores X-Frame-Options (old browser)
2. Same-origin embedding (allowed)

**Solution:**

```bash
# Verify CSP includes frame-ancestors
curl -I https://runicorn.io | grep -i "frame-ancestors"

# Expected: frame-ancestors 'none' (in CSP header)
```

### Issue 4: HSTS Enabled Too Early

**Symptoms**: Site inaccessible over HTTP after HSTS enabled

**Cause**: HSTS forces HTTPS, but HTTPS not configured yet

**Solution:**

```bash
# Comment out HSTS in nginx.conf
# add_header Strict-Transport-Security "..." always;  # COMMENTED

# Reload nginx
nginx -s reload

# Only uncomment AFTER HTTPS is working!
```

---

## Security Headers Checklist

Before deploying to production, verify:

- [ ] All headers present in `curl -I` output
- [ ] No CSP violations in browser console (normal usage)
- [ ] Map tiles load correctly (OpenStreetMap)
- [ ] Search works (Nominatim geocoding)
- [ ] Analytics tracking works (Umami)
- [ ] Error tracking works (GlitchTip)
- [ ] Google Fonts load correctly
- [ ] Leaflet library loads from unpkg.com
- [ ] SecurityHeaders.com scan shows A or A+
- [ ] Mozilla Observatory scan shows B+ or better
- [ ] No 404 errors for legitimate resources
- [ ] Automated test script passes

---

## Next Steps (After HTTPS)

Once HTTPS is properly configured:

1. **Enable HSTS**:
   ```nginx
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
   ```

2. **Test HSTS**:
   ```bash
   curl -I https://runicorn.io | grep -i "strict-transport-security"
   ```

3. **Submit to HSTS Preload List** (optional):
   - Go to https://hstspreload.org
   - Enter: runicorn.io
   - Follow instructions

4. **Update CSP**: Remove `upgrade-insecure-requests` if all resources are HTTPS

5. **Remove 'unsafe-inline'** (advanced):
   - Implement nonce-based CSP
   - Requires Vite build changes

---

## Resources

- **OWASP Secure Headers Project**: https://owasp.org/www-project-secure-headers/
- **MDN Security Headers**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security
- **CSP Evaluator**: https://csp-evaluator.withgoogle.com/
- **SecurityHeaders.com**: https://securityheaders.com
- **Mozilla Observatory**: https://observatory.mozilla.org

---

**Last Updated**: 2025-10-27  
**Maintained By**: Roman Reinelt (RNLT Labs)
