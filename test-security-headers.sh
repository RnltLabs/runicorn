#!/bin/bash
# ============================================
# Runicorn Security Headers Test Script
# ============================================
# Purpose: Automated testing of HTTP security headers
# Usage: ./test-security-headers.sh [URL]
# Example: ./test-security-headers.sh https://runicorn.io
# ============================================

# Configuration
URL="${1:-https://runicorn.io}"
FAILED=0
PASSED=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function to test header
test_header() {
  local name="$1"
  local pattern="$2"
  local required="$3"
  
  echo -n "Testing $name... "
  HEADER=$(curl -s -I "$URL" | grep -i "$pattern")
  
  if [ -z "$HEADER" ]; then
    if [ "$required" = "true" ]; then
      echo -e "${RED}❌ FAILED${NC}"
      FAILED=$((FAILED + 1))
    else
      echo -e "${YELLOW}⏳ SKIPPED (optional)${NC}"
    fi
  else
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
  fi
}

# Header
echo "============================================"
echo "Runicorn Security Headers Test"
echo "============================================"
echo "URL: $URL"
echo ""

# Test 1: X-Frame-Options
test_header "X-Frame-Options" "x-frame-options: DENY" true

# Test 2: X-Content-Type-Options
test_header "X-Content-Type-Options" "x-content-type-options: nosniff" true

# Test 3: X-XSS-Protection
test_header "X-XSS-Protection" "x-xss-protection: 1; mode=block" true

# Test 4: Referrer-Policy
test_header "Referrer-Policy" "referrer-policy: strict-origin-when-cross-origin" true

# Test 5: Permissions-Policy
test_header "Permissions-Policy" "permissions-policy:" true

# Test 6: Content-Security-Policy
test_header "Content-Security-Policy" "content-security-policy:" true

# Test 7: Server Tokens (should NOT contain version)
echo -n "Testing Server Tokens (version hidden)... "
HEADER=$(curl -s -I "$URL" | grep -i "server:" | grep -E "nginx/[0-9]")
if [ -z "$HEADER" ]; then
  echo -e "${GREEN}✅ PASSED${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}❌ FAILED (version exposed)${NC}"
  FAILED=$((FAILED + 1))
fi

# Test 8: HSTS (optional - only after HTTPS)
test_header "Strict-Transport-Security (HSTS)" "strict-transport-security:" false

# Summary
echo ""
echo "============================================"
echo "Test Summary"
echo "============================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All required tests passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Test manually in browser (see SECURITY_HEADERS_TESTING.md)"
  echo "2. Run SecurityHeaders.com scan: https://securityheaders.com/?q=$URL"
  echo "3. After HTTPS: Enable HSTS in nginx.conf"
  exit 0
else
  echo -e "${RED}❌ $FAILED test(s) failed!${NC}"
  echo ""
  echo "Troubleshooting:"
  echo "1. Verify nginx.conf is updated"
  echo "2. Reload nginx: nginx -s reload"
  echo "3. Check nginx logs: tail -f /var/log/nginx/error.log"
  echo "4. See SECURITY_HEADERS_TESTING.md for details"
  exit 1
fi
