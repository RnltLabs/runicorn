# Security & Privacy Audit Report - Runicorn

**Date**: 2025-10-26  
**Audited By**: Claude Code Security & Privacy Auditor  
**Scope**: Full Runicorn application (Vite + React SPA)  
**Product**: Runicorn (GPS Art Route Planner)  
**Repository**: https://github.com/RnltLabs/runicorn  
**Branch**: feature/comprehensive-site-audit  
**Linear Issue**: RNLT-36

---

## Executive Summary

### Security (OWASP Top 10)
- **Critical Issues**: 3 ❌
- **High Issues**: 4 ⚠️
- **Medium Issues**: 3 ⚠️
- **Low Issues**: 2 ℹ️
- **OWASP Top 10 Compliance**: 6/10 passed (60%)

### Privacy (GDPR/DSGVO)
- **GDPR Compliance**: 1/10 requirements met (10%) ❌
- **Critical Privacy Issues**: 3
- **Special Category Data Compliance** (Art. 9): N/A (no health data)
- **Data Subject Rights Implementation**: 0/5 rights implemented ❌
- **AVV/DPA Status**: Not documented ❌

### Technology Stack
- **Frontend**: React 19.1.1 + TypeScript + Vite 7.1.7
- **Mapping**: Leaflet + OpenStreetMap
- **External APIs**: GraphHopper (routing), GlitchTip (error tracking)
- **Analytics**: Umami (self-hosted at analytics.rnltlabs.de)
- **Deployment**: Docker + nginx on Hetzner Germany

---

## CRITICAL ISSUES ❌ (Sofort zu beheben!)

### 1. API Key Exposed in Client-Side Bundle

**Severity**: CRITICAL  
**OWASP Category**: A02:2021 - Cryptographic Failures  
**Location**: `src/lib/graphhopper.ts:95`, `.env`

**Problem:**
```typescript
// ❌ BAD: API key exposed in client bundle
const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY
```

**Impact:**
- Anyone can extract API key from JavaScript bundle
- Unlimited API abuse on your account
- Potential costs and rate-limit exhaustion

**Fix:** See `docs/fixes/FIX_01_API_KEY_SECURITY.md`

---

### 2. Missing Security Headers

**Severity**: CRITICAL  
**OWASP Category**: A05:2021 - Security Misconfiguration  
**Location**: `nginx.conf`

**Problem:**
No HTTP security headers configured (no CSP, X-Frame-Options, etc.)

**Impact:**
- Clickjacking attacks possible
- XSS attacks not prevented
- MIME sniffing vulnerabilities

**Fix:** See `docs/fixes/FIX_02_SECURITY_HEADERS.md`

---

### 3. Missing HTTPS Enforcement

**Severity**: CRITICAL  
**OWASP Category**: A02:2021 - Cryptographic Failures  
**Location**: nginx.conf

**Problem:**
No HTTPS redirect configured

**Impact:**
- GPS data transmitted unencrypted
- Man-in-the-middle attacks possible
- Session hijacking risk

**Fix:** See `docs/fixes/FIX_03_HTTPS_ENFORCEMENT.md`

---

## HIGH ISSUES ⚠️

### 4. Dependency Vulnerability - Vite 7.1.7

**Severity**: HIGH  
**CVE**: GHSA-93m4-6634-74q7

**Fix:**
```bash
npm audit fix
```

---

### 5. Missing Privacy Policy (GDPR Art. 13-14)

**Severity**: HIGH (Legal Risk)  
**Impact**: Fines up to €10M or 2% of revenue

**Fix:** See `docs/fixes/FIX_05_PRIVACY_POLICY.md`

---

### 6. Cookie Consent Violations (ePrivacy)

**Severity**: HIGH (Legal Risk)  
**Problem**: Umami loads before consent given

**Fix:** See `docs/fixes/FIX_06_COOKIE_CONSENT.md`

---

### 7. Missing AVV/DPA Documentation (GDPR Art. 28)

**Severity**: HIGH (Legal Risk)  
**Problem**: No signed contracts with Hetzner/GraphHopper

**Fix:** See `docs/fixes/FIX_07_AVV_DPA.md`

---

## MEDIUM ISSUES ⚠️

### 8. No Input Validation on GPS Coordinates

**Severity**: MEDIUM  
**Fix:** See `docs/fixes/FIX_08_INPUT_VALIDATION.md`

---

### 9. Insufficient Error Logging

**Severity**: MEDIUM  
**Fix:** See `docs/fixes/FIX_09_SECURITY_LOGGING.md`

---

### 10. No Client-Side Rate Limiting

**Severity**: MEDIUM  
**Fix:** See `docs/fixes/FIX_10_RATE_LIMITING.md`

---

## LOW ISSUES ℹ️

### 11. Source Maps Enabled in Production

**Severity**: LOW  
**Fix:** See `docs/fixes/FIX_11_SOURCE_MAPS.md`

---

### 12. Leaflet CSS from CDN

**Severity**: LOW  
**Status**: ✅ Already has SRI - no fix needed!

---

## GDPR/DSGVO Compliance Summary

| Requirement | Status | Notes |
|-------------|--------|-------|
| Art. 6 - Legal Basis | ❌ FAIL | Not documented |
| Art. 13-14 - Privacy Policy | ❌ FAIL | Missing completely |
| ePrivacy - Cookie Consent | ❌ FAIL | Umami loads before consent |
| Art. 5(1)(c) - Data Minimization | ✅ PASS | GPS data client-side only |
| Art. 15-22 - Data Subject Rights | ❌ FAIL | Not implemented |
| Art. 25 - Privacy by Design | ⚠️ PARTIAL | IP anonymization unclear |
| Art. 9 - Special Categories | ✅ N/A | No health data |
| Art. 28 - AVV/DPA | ❌ FAIL | Not documented |
| Art. 32 - Security Measures | ⚠️ PARTIAL | HTTPS missing |
| Art. 33-34 - Breach Notification | ❌ FAIL | No plan documented |

**Overall GDPR Compliance**: 1/10 (10%) ❌

---

## Action Plan

### HEUTE (Today - Critical)
1. ✅ Rotate GraphHopper API key
2. ✅ Enable domain restrictions on new API key
3. ✅ Run `npm audit fix`

### DIESE WOCHE (This Week - High Priority)
4. ✅ Add security headers to nginx.conf
5. ✅ Enable HTTPS with Let's Encrypt
6. ✅ Create privacy policy (`/datenschutz`)
7. ✅ Fix cookie consent banner (conditional Umami loading)
8. ✅ Sign AVV with Hetzner
9. ✅ Implement data subject rights UI

### NÄCHSTE WOCHE (Next Week - Medium Priority)
10. ✅ Implement backend proxy for GraphHopper (Cloudflare Workers)
11. ✅ Add input validation for GPS coordinates
12. ✅ Enhanced security logging
13. ✅ Client-side rate limiting
14. ✅ Fix source maps (hidden or upload to GlitchTip)

---

## Positive Findings ✅ (Well Done!)

1. ✅ TypeScript strict mode enabled
2. ✅ Sentry/GlitchTip error tracking
3. ✅ Discord webhooks for alerts
4. ✅ Logger with sensitive data sanitization
5. ✅ React Error Boundary
6. ✅ SRI for Leaflet CSS
7. ✅ No `eval()` or `innerHTML` usage
8. ✅ GPS data client-side only (minimal server storage)
9. ✅ Umami self-hosted (GDPR-friendly)
10. ✅ Proper git workflow

---

## Testing Recommendations

### Security Testing
- [ ] OWASP ZAP scan before production
- [ ] Manual penetration testing
- [ ] CSP testing (browser console)
- [ ] SSL/TLS testing (ssllabs.com)

### Privacy Testing
- [ ] Cookie consent flow (Umami must not load without consent)
- [ ] Privacy policy completeness
- [ ] Data subject rights (export, deletion)

### Automated Testing
```bash
# Add to CI/CD
npm audit --audit-level=moderate
```

---

## Conclusion

Runicorn has **3 critical**, **4 high**, and **3 medium** security issues that must be addressed before production launch. 

**Priority Order:**
1. Fix API key exposure (CRITICAL)
2. Enable HTTPS + security headers (CRITICAL)
3. Create privacy policy + fix cookie consent (HIGH - Legal)
4. Sign AVV with Hetzner (HIGH - Legal)
5. Implement backend proxy + other medium issues

**Follow-up audit recommended** after critical/high issues are resolved.

---

**Report Generated**: 2025-10-26  
**Auditor**: Claude Code Security & Privacy Auditor  
**Contact**: Linear Issue RNLT-36
