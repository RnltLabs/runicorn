# Security Headers Quick Reference

**RNLT-36 Implementation - Runicorn Security Headers**

---

## Files

| File | Purpose | Status |
|------|---------|--------|
| `nginx.conf` | Production config with 7 security headers | ✅ Updated |
| `SECURITY_HEADERS_README.md` | Implementation summary | ✅ Created |
| `SECURITY_HEADERS_TESTING.md` | Comprehensive testing guide | ✅ Created |
| `SECURITY_HEADERS_IMPLEMENTATION.md` | Detailed implementation docs | ✅ Created |
| `test-security-headers.sh` | Automated test script | ✅ Created |

---

## Quick Commands

### Test Headers (Production)
```bash
./test-security-headers.sh https://runicorn.io
```

### Test Headers (Local)
```bash
./test-security-headers.sh http://localhost:3002
```

### Manual curl Test
```bash
curl -I https://runicorn.io | grep -E "x-frame-options|x-content-type-options|content-security-policy|referrer-policy|permissions-policy"
```

### Deploy (Docker)
```bash
docker build -t runicorn:latest .
docker run -d -p 3002:3002 runicorn:latest
./test-security-headers.sh http://localhost:3002
```

### Deploy (nginx)
```bash
scp nginx.conf server:/tmp/
ssh server "sudo mv /tmp/nginx.conf /etc/nginx/conf.d/default.conf && sudo nginx -t && sudo nginx -s reload"
```

### Rollback (nginx)
```bash
ssh server "sudo cp /etc/nginx/conf.d/default.conf.backup /etc/nginx/conf.d/default.conf && sudo nginx -s reload"
```

---

## Security Headers Checklist

After deployment, verify these headers are present:

- [ ] **X-Frame-Options**: DENY
- [ ] **X-Content-Type-Options**: nosniff
- [ ] **X-XSS-Protection**: 1; mode=block
- [ ] **Referrer-Policy**: strict-origin-when-cross-origin
- [ ] **Permissions-Policy**: camera=(), microphone=(), geolocation=(self), ...
- [ ] **Content-Security-Policy**: default-src 'self'; script-src ...
- [ ] **Server**: nginx (NO version number)
- [ ] **HSTS** (after HTTPS): max-age=31536000; includeSubDomains; preload

---

## CSP Whitelisted Resources

### Scripts (script-src)
- runicorn.io (self)
- analytics.rnltlabs.de (Umami)
- errors.rnltlabs.de (GlitchTip)
- unpkg.com (Leaflet)

### Styles (style-src)
- runicorn.io (self)
- fonts.googleapis.com (Google Fonts CSS)
- unpkg.com (Leaflet CSS)

### Fonts (font-src)
- runicorn.io (self)
- fonts.gstatic.com (Google Fonts files)

### Images (img-src)
- runicorn.io (self)
- data: (base64 images)
- *.tile.openstreetmap.org (map tiles)

### Connections (connect-src)
- runicorn.io (self)
- runicorn-api-proxy.*.workers.dev (GraphHopper proxy)
- analytics.rnltlabs.de (Umami tracking)
- errors.rnltlabs.de (GlitchTip errors)
- nominatim.openstreetmap.org (geocoding)

---

## Troubleshooting

### Headers not appearing
```bash
# Check nginx config
nginx -T | grep "add_header"

# Reload nginx
nginx -s reload

# Check error log
tail -f /var/log/nginx/error.log
```

### CSP blocks legitimate resource
1. Check browser console for CSP violation
2. Add domain to appropriate CSP directive in nginx.conf
3. Reload nginx: `nginx -s reload`

### Site broken after deployment
```bash
# Immediate rollback
ssh server "sudo cp /etc/nginx/conf.d/default.conf.backup /etc/nginx/conf.d/default.conf && sudo nginx -s reload"
```

---

## Security Scanners

### SecurityHeaders.com
```
https://securityheaders.com/?q=https://runicorn.io
Expected Grade: A (A+ with HSTS)
```

### Mozilla Observatory
```
https://observatory.mozilla.org/analyze/runicorn.io
Expected Score: B+ to A-
```

---

## Success Criteria

- [x] All 7 headers implemented
- [ ] Test script passes (7/7 tests)
- [ ] No CSP violations (normal usage)
- [ ] Map loads correctly
- [ ] Search works
- [ ] Analytics works
- [ ] Error tracking works
- [ ] SecurityHeaders.com: A grade

---

**Quick Links**:
- Implementation: `SECURITY_HEADERS_IMPLEMENTATION.md`
- Testing Guide: `SECURITY_HEADERS_TESTING.md`
- Summary: `SECURITY_HEADERS_README.md`
