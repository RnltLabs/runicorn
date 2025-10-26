# Security & Privacy Implementation Checklist

Quick reference for implementing audit fixes. For detailed guides, see `docs/fixes/`.

---

## HEUTE (TODAY) - Critical ⚡

### [ ] 1. Rotate GraphHopper API Key (15 min)

```bash
# 1. GraphHopper Dashboard → Create new API key
# 2. Enable domain restrictions: runicorn.io, staging.runicorn.io
# 3. Delete old key: a65c854a-06df-44dd-94f5-e013c845436b
# 4. Update GitHub Secrets: VITE_GRAPHHOPPER_API_KEY
```

**Verification:**
- [ ] Old key deleted from GraphHopper
- [ ] New key has domain restrictions
- [ ] Deployment still works

---

### [ ] 2. Fix Vite Vulnerability (5 min)

```bash
npm audit fix
npm audit --audit-level=moderate
# Should show 0 vulnerabilities
```

**Verification:**
- [ ] `npm audit` shows 0 moderate+ vulnerabilities

---

## DIESE WOCHE (THIS WEEK) - High Priority 📅

### [ ] 3. Implement Cloudflare Workers Proxy (2 hours)

See: `docs/fixes/FIX_01_API_KEY_SECURITY.md`

```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Create worker (follow guide)
# 3. Deploy worker
# 4. Update src/lib/graphhopper.ts to use proxy
# 5. Remove VITE_GRAPHHOPPER_API_KEY from .env
```

**Verification:**
- [ ] API key NOT in `dist/assets/*.js` after build
- [ ] Route drawing works with proxy
- [ ] GraphHopper errors logged correctly

---

### [ ] 4. Add Security Headers (30 min)

See: `docs/fixes/FIX_02_SECURITY_HEADERS.md`

```bash
# Update nginx.conf with CSP + security headers
# Test: nginx -t
# Reload: nginx -s reload
```

**Verification:**
- [ ] `curl -I https://runicorn.io` shows all headers
- [ ] SecurityHeaders.com scan: Grade A+
- [ ] CSP blocks unauthorized scripts

---

### [ ] 5. Enable HTTPS (1 hour)

```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d runicorn.io -d www.runicorn.io

# Auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

**Verification:**
- [ ] http://runicorn.io redirects to https://
- [ ] SSL certificate valid (browser shows padlock)
- [ ] SSLLabs.com scan: Grade A+

---

### [ ] 6. Create Privacy Policy (2 hours)

See: `docs/fixes/FIX_05_PRIVACY_POLICY.md`

```bash
# Create public/datenschutz.html
# Or implement React Router + /datenschutz route
```

**Verification:**
- [ ] https://runicorn.io/datenschutz accessible
- [ ] Contains all required GDPR info
- [ ] Linked from footer and cookie banner

---

### [ ] 7. Fix Cookie Consent Banner (1 hour)

See: `docs/fixes/FIX_06_COOKIE_CONSENT.md`

**Changes needed:**
1. Remove Umami from `index.html`
2. Create `src/components/Analytics.tsx` (conditional loading)
3. Update banner text (remove "no tracking" claim)
4. Add privacy policy link

**Verification:**
- [ ] Umami does NOT load before consent
- [ ] "Accept all" loads Umami
- [ ] "Necessary only" does NOT load Umami
- [ ] Banner text is accurate

---

### [ ] 8. Sign Hetzner AVV (30 min)

See: `docs/fixes/FIX_07_AVV_DPA.md`

```bash
# 1. Download: https://www.hetzner.com/legal/avv
# 2. Fill out, sign, send to Hetzner
# 3. Store signed copy in safe location
```

**Verification:**
- [ ] Signed AVV sent to Hetzner
- [ ] Copy stored securely
- [ ] Mentioned in privacy policy

---

## NÄCHSTE WOCHE (NEXT WEEK) - Medium Priority 🔧

### [ ] 9. Input Validation (1 hour)

```typescript
// Create src/lib/validation.ts with Zod schemas
// Add validation to graphhopper.ts and gpx.ts
```

**Verification:**
- [ ] Invalid coordinates rejected
- [ ] GPX export escapes XML properly

---

### [ ] 10. Enhanced Security Logging (1 hour)

```typescript
// Add logging to:
// - Rate limit violations
// - Anomalous GPS coordinates
// - Export failures
```

**Verification:**
- [ ] GlitchTip receives security events
- [ ] Discord alerts for critical issues

---

### [ ] 11. Client-Side Rate Limiting (1 hour)

```typescript
// Create src/lib/rateLimit.ts
// Add to graphhopper.ts
```

**Verification:**
- [ ] Max 10 routes per minute enforced
- [ ] User-friendly error message

---

### [ ] 12. Hide Source Maps (30 min)

```typescript
// vite.config.ts: sourcemap: 'hidden'
```

**Verification:**
- [ ] Source maps NOT in browser DevTools
- [ ] GlitchTip still shows stack traces

---

## Final Verification

### Security Scan

```bash
# 1. npm audit
npm audit --audit-level=moderate
# Expected: 0 vulnerabilities

# 2. Check bundle for secrets
grep -r "graphhopper.*key\|discord.*webhook\|a65c854a" dist/
# Expected: No results

# 3. HTTPS
curl -I http://runicorn.io | grep -i "location.*https"
# Expected: 301 redirect

# 4. Security headers
curl -I https://runicorn.io | grep -E "X-Frame|Content-Security|X-Content-Type"
# Expected: All headers present

# 5. SSL scan
# Go to: https://www.ssllabs.com/ssltest/analyze.html?d=runicorn.io
# Expected: Grade A+
```

### Privacy Compliance

- [ ] Privacy policy accessible and complete
- [ ] Cookie banner works correctly
- [ ] Umami loads only with consent
- [ ] AVV with Hetzner signed
- [ ] Data subject rights UI implemented

### Functional Testing

- [ ] Route drawing works
- [ ] GPX export works
- [ ] Search works
- [ ] Map tiles load
- [ ] Error tracking works
- [ ] Analytics works (with consent)

---

## Deployment

```bash
# 1. Commit fixes
git add .
git commit -m "Security audit fixes (RNLT-36)"

# 2. Push to staging
git push origin feature/comprehensive-site-audit

# 3. Test on staging
# ... manual testing ...

# 4. Merge to main
git checkout main
git merge feature/comprehensive-site-audit
git push origin main

# 5. Monitor production
# Check GlitchTip, Umami, error logs
```

---

## Post-Deployment

### Week 1
- [ ] Monitor GlitchTip for errors
- [ ] Check Umami for traffic drop (due to consent)
- [ ] Verify no complaints about broken features

### Week 2
- [ ] Review security logs
- [ ] Check for CSP violations
- [ ] Verify rate limiting works

### Month 1
- [ ] Schedule follow-up security audit
- [ ] Review GDPR compliance
- [ ] Update privacy policy if needed

---

**Last Updated**: 2025-10-26  
**Status**: 0/12 fixes completed  
**Next Review**: After all critical fixes implemented
