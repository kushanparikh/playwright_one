# POS System Deployment Guide for Isolated Environments

## Overview
This guide covers deploying Playwright tests on isolated POS systems like the Toshiba TCx 300 where network access is restricted.

## Deployment Options

### Option 1: Direct Installation on POS System (Recommended)

### Description:
Install Playwright directly on your Toshiba TCx 300:

#### Advantages:

✅ Full access to the actual kiosk application
✅ Real hardware testing (receipt printers, card readers, cash drawer)
✅ True touch screen interactions
✅ No network dependencies

#### Prerequisites
- Linux-based POS system (Toshiba TCx 300)
- Node.js installed on POS system
- USB drive or secure file transfer method

#### Steps
1. **Transfer test package to POS system:**
   ```bash
   # On development machine
   npm run package:pos
   
   # Transfer pos-test-package.tar.gz to POS system via USB/secure method
   ```

2. **Install on POS system:**
   ```bash
   # On POS Linux system
   tar -xzf pos-test-package.tar.gz
   cd playwright_one
   npm run install:pos
   ```

3. **Configure for local testing:**
   ```bash
   # Set environment variables
   export POS_LOCAL_URL="http://localhost:8080"  # Your POS app URL
   export NODE_ENV="pos-production"
   ```

4. **Run tests:**
   ```bash
   # Test local POS application
   npx playwright test --project=pos-local
   
   # Test with kiosk mode
   npx playwright test --project=pos-kiosk
   ```

### Option 2: Portable Test Runner

#### Description:
Create a standalone package that includes Node.js and Playwright:

Test locally + Deploy to POS:

1. Development Phase: Use pos-mock project for development
2. Integration Phase: Use pos-local project on actual POS hardware
3. Production Phase: Run pos-kiosk on live system

#### Advantages:

✅ Self-contained test environment
✅ No dependency installation required
✅ Works offline
✅ Easy to transfer to POS system

#### Create Standalone Package
```bash
# Bundle everything including Node.js (if needed)
npm run package:pos
tar -czf complete-pos-tests.tar.gz node_modules/ tests/ playwright.config.ts package.json
```

#### POS System Setup
```bash
# Extract and run without npm install
tar -xzf complete-pos-tests.tar.gz
./node_modules/.bin/playwright test --project=pos-local
```

### Option 3: File-Based Testing

#### Description:
For completely offline POS applications:

Create completely self-contained test package:

- Bundle Node.js, Playwright, and all dependencies
- Transfer entire package to POS system
- Run without any installation requirements

#### Advantages:

✅ No dependencies required
✅ Works offline
✅ Easy to transfer to POS system
✅ Self-contained environment

#### Key Benefits for Your Isolated Environment

✅ Full access to the actual kiosk application
✅ Real hardware testing (receipt printers, card readers, cash drawer)
✅ True touch screen interactions
✅ No network dependencies

```typescript
// tests/pos-offline.spec.ts
test('offline pos application', async ({ page }) => {
  // Test local HTML files
  await page.goto('file:///opt/pos-app/index.html');
  
  // Test local server
  await page.goto('http://127.0.0.1:8080');
  
  // Your POS tests here
});
```

## Configuration for Isolated Systems

### Environment Variables
```bash
# .env file for POS system
POS_LOCAL_URL=http://localhost:8080
POS_APP_PATH=/opt/pos-app
HEADLESS=false
SLOW_MO=1000
```

### Network-Free Configuration
```typescript
// playwright.config.ts additions
use: {
  // Disable external network calls
  offline: true,
  
  // Use local resources only
  baseURL: process.env.POS_LOCAL_URL || 'file:///opt/pos-app',
  
  // Extended timeouts for slower POS hardware
  actionTimeout: 30000,
  navigationTimeout: 60000,
}
```

## Hardware-Specific Considerations

### Toshiba TCx 300 Optimizations
```typescript
// Optimized for POS hardware
launchOptions: {
  args: [
    '--kiosk',
    '--disable-gpu', // For older hardware
    '--no-sandbox', // If running as root
    '--disable-dev-shm-usage', // Memory optimization
    '--memory-pressure-off', // Prevent memory issues
  ],
  slowMo: 1000, // Account for slower hardware
}
```

### Touch Screen Support
```typescript
test('touch interactions', async ({ page }) => {
  // Simulate touch events
  await page.touchscreen.tap(100, 100);
  
  // Multi-touch gestures
  await page.touchscreen.tap(200, 200);
});
```

## Security Considerations

### Running in Secure POS Environment
```bash
# Create dedicated test user
sudo useradd -m postest
sudo usermod -aG sudo postest

# Run tests as non-root when possible
su - postest
npx playwright test
```

### File Permissions
```bash
# Set appropriate permissions
chmod +x run-pos-tests.sh
chown postest:postest -R /opt/playwright-tests/
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   sudo chmod +x node_modules/.bin/playwright
   ```

2. **Display Issues**
   ```bash
   export DISPLAY=:0
   xhost +local:
   ```

3. **Memory Issues**
   ```bash
   # Increase swap if needed
   sudo fallocate -l 2G /swapfile
   sudo swapon /swapfile
   ```

### Debug Mode
```bash
# Run with debug output
DEBUG=pw:* npx playwright test --project=pos-local
```

## Testing Strategies

### 1. Smoke Tests
Quick validation that POS app loads and basic functions work.

### 2. Integration Tests
Test POS peripherals (receipt printer, card reader, cash drawer).

### 3. Regression Tests
Ensure updates don't break existing functionality.

### 4. Performance Tests
Validate response times on POS hardware.

## Maintenance

### Regular Updates
```bash
# Update test package monthly
npm run package:pos
# Transfer to POS system
```

### Log Management
```bash
# Rotate test logs
logrotate /etc/logrotate.d/playwright-pos
```

## Example Test Commands

```bash
# Full test suite
npx playwright test --project=pos-local

# Specific test file
npx playwright test tests/pos-kiosk.spec.ts --project=pos-local

# Headed mode for debugging
npx playwright test --headed --project=pos-local

# Generate report
npx playwright test && npx playwright show-report
```

## Support

For issues specific to isolated POS environments:
1. Check POS system logs: `/var/log/pos-app/`
2. Verify Chromium installation: `chromium --version`
3. Test network isolation: `ping google.com` (should fail)
4. Validate local app access: `curl http://localhost:8080`
