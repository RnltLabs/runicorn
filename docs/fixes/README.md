# Security & Privacy Fixes - Runicorn

This directory contains detailed implementation guides for fixing security and privacy issues identified in the audit (see `SECURITY_AUDIT_REPORT.md`).

---

## Quick Start

**Priority Order** (fix in this order):

### TODAY ⚡ (Critical - 1-2 hours)
1. [FIX_01_API_KEY_SECURITY.md](./FIX_01_API_KEY_SECURITY.md) - Rotate GraphHopper API key + implement proxy
2. Run `npm audit fix` for Vite vulnerability

### THIS WEEK 📅 (High Priority - 4-6 hours)
3. [FIX_02_SECURITY_HEADERS.md](./FIX_02_SECURITY_HEADERS.md) - Add HTTP security headers to nginx
4. [FIX_03_HTTPS_ENFORCEMENT.md](./FIX_03_HTTPS_ENFORCEMENT.md) - Enable HTTPS with Let's Encrypt
5. [FIX_05_PRIVACY_POLICY.md](./FIX_05_PRIVACY_POLICY.md) - Create `/datenschutz` privacy policy
6. [FIX_06_COOKIE_CONSENT.md](./FIX_06_COOKIE_CONSENT.md) - Fix Umami loading (conditional on consent)
7. [FIX_07_AVV_DPA.md](./FIX_07_AVV_DPA.md) - Sign Hetzner AVV contract

### NEXT WEEK 🔧 (Medium Priority - 3-4 hours)
8. [FIX_08_INPUT_VALIDATION.md](./FIX_08_INPUT_VALIDATION.md) - Validate GPS coordinates
9. [FIX_09_SECURITY_LOGGING.md](./FIX_09_SECURITY_LOGGING.md) - Enhanced error logging
10. [FIX_10_RATE_LIMITING.md](./FIX_10_RATE_LIMITING.md) - Client-side rate limiting
11. [FIX_11_SOURCE_MAPS.md](./FIX_11_SOURCE_MAPS.md) - Hide source maps in production

---

## Fix Status Tracker

| # | Issue | Severity | Status | Assignee | Due Date |
|---|-------|----------|--------|----------|----------|
| 1 | API Key Exposed | 🔴 CRITICAL | ❌ TODO | Roman | 2025-10-26 |
| 2 | Security Headers | 🔴 CRITICAL | ❌ TODO | DevOps | 2025-10-29 |
| 3 | HTTPS Missing | 🔴 CRITICAL | ❌ TODO | DevOps | 2025-10-29 |
| 4 | Vite Vulnerability | 🟠 HIGH | ❌ TODO | Roman | 2025-10-26 |
| 5 | Privacy Policy | 🟠 HIGH | ❌ TODO | Legal/Roman | 2025-10-29 |
| 6 | Cookie Consent | 🟠 HIGH | ❌ TODO | Roman | 2025-10-29 |
| 7 | AVV/DPA | 🟠 HIGH | ❌ TODO | Legal/Roman | 2025-10-29 |
| 8 | Input Validation | 🟡 MEDIUM | ❌ TODO | Roman | 2025-11-05 |
| 9 | Security Logging | 🟡 MEDIUM | ❌ TODO | Roman | 2025-11-05 |
| 10 | Rate Limiting | 🟡 MEDIUM | ❌ TODO | Roman | 2025-11-05 |
| 11 | Source Maps | 🟢 LOW | ❌ TODO | Roman | 2025-11-05 |
| 12 | Leaflet SRI | 🟢 LOW | ✅ DONE | - | - |

---

## Testing Checklist

After implementing fixes, run these tests:

### Security Tests
- [ ] `npm audit` shows 0 vulnerabilities
- [ ] API key NOT in production bundle (`grep -r "a65c854a" dist/`)
- [ ] HTTPS redirect works (curl http://runicorn.io → 301 to https)
- [ ] Security headers present (`curl -I https://runicorn.io`)
- [ ] CSP blocks unauthorized scripts (browser console test)
- [ ] SSLLabs.com scan shows A+ rating

### Privacy Tests
- [ ] Cookie banner appears on first visit
- [ ] Umami does NOT load without consent
- [ ] Privacy policy accessible at `/datenschutz`
- [ ] Data subject rights UI works (delete local data button)
- [ ] Analytics opt-out works

### Functional Tests
- [ ] Route drawing still works
- [ ] GPX export still works
- [ ] Search still works
- [ ] Map tiles load correctly
- [ ] Error tracking (GlitchTip) still works

---

## Deployment Workflow

```bash
# 1. Fix issues locally (on feature branch)
git checkout feature/comprehensive-site-audit

# 2. Implement fixes (see individual FIX_*.md files)

# 3. Test locally
npm run dev
# Test all features manually

# 4. Build for production
npm run build

# 5. Verify no secrets in bundle
grep -r "graphhopper.*key\|a65c854a\|discord.*webhook" dist/
# Should return NOTHING

# 6. Deploy to staging first
git push origin feature/comprehensive-site-audit
# Trigger staging deployment (via GitHub Actions)

# 7. Test on staging
curl -I https://staging.runicorn.io
# Verify headers, HTTPS, etc.

# 8. Merge to main (production)
git checkout main
git merge feature/comprehensive-site-audit
git push origin main

# 9. Monitor production
# Check GlitchTip for errors
# Check Umami for traffic
```

---

## Questions?

**Contact:**
- Linear Issue: RNLT-36
- Email: hello@rnltlabs.de
- Audit Report: `/SECURITY_AUDIT_REPORT.md`

---

**Last Updated**: 2025-10-26  
**Audit Version**: 1.0  
**Next Audit**: After all HIGH issues are fixed
