import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }], // Always generate HTML report
    ['list'] // Console output
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot always - after each assertion */
    screenshot: 'on',
    
    /* Record video always with action highlights */
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 }
    },
    
    /* Enable action timeout for better visibility */
    actionTimeout: 10000,
    
    /* Slow down actions for better video visibility */
    launchOptions: {
      slowMo: 1000, // 1 second delay between actions
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          slowMo: 1000, // Slow down for better video visibility
          args: [
            '--disable-web-security', 
            '--disable-features=VizDisplayCompositor'
          ]
        }
      },
    },

    // POS Kiosk Mode Configuration
    {
      name: 'pos-kiosk',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 }, // Common POS resolution
        launchOptions: {
          args: [
            '--kiosk',
            '--start-fullscreen',
            '--disable-infobars',
            '--disable-session-crashed-bubble',
            '--disable-translate',
            '--no-first-run',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-popup-blocking',
            '--disable-prompt-on-repost'
          ],
          slowMo: 500 // Slower for POS interactions
        }
      },
    },

    // POS Local Development (for isolated systems)
    {
      name: 'pos-local',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
        baseURL: process.env.POS_LOCAL_URL || 'http://localhost:8080',
        launchOptions: {
          args: [
            '--kiosk',
            '--disable-web-security', // For local file access
            '--allow-file-access-from-files',
            '--disable-features=VizDisplayCompositor'
          ],
          slowMo: 500
        }
      },
    },

    // POS Mock/Simulation (for development)
    {
      name: 'pos-mock',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
        baseURL: 'http://localhost:3000', // Mock POS server
        launchOptions: {
          slowMo: 1000 // Slower for debugging
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          slowMo: 1000, // Slow down for better video visibility
        }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        launchOptions: {
          slowMo: 1000, // Slow down for better video visibility
        }
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
