# Playwright One

A modern end-to-end testing project built with Playwright and TypeScript.

## 🚀 Features

- **Cross-browser testing** - Run tests on Chromium, Firefox, and WebKit
- **TypeScript support** - Full type safety and IntelliSense
- **Parallel execution** - Fast test execution with built-in parallelization
- **Auto-wait** - Reliable tests with automatic waiting for elements
- **Screenshots & Videos** - Visual debugging with automatic capture on failures

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd playwright_one
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run specific test file
```bash
npx playwright test tests/example.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📁 Project Structure

```
playwright_one/
├── tests/
│   └── example.spec.ts    # Example test file
├── package.json           # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── playwright.config.ts  # Playwright configuration (if exists)
└── README.md            # This file
```

## 📝 Writing Tests

Tests are located in the `tests/` directory. Here's a basic example:

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

## 🔧 Configuration

Playwright can be configured through `playwright.config.ts`. Common configurations include:

- Browser selection
- Test timeout settings
- Base URL configuration
- Screenshot and video settings
- Parallel execution settings

## 📊 Test Reports

After running tests, you can view the HTML report:

```bash
npx playwright show-report
```

## 🐛 Debugging

### Debug mode
```bash
npx playwright test --debug
```

### Trace viewer
```bash
npx playwright show-trace trace.zip
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.