import { defineConfig, devices } from '@playwright/test';

const NO_GL = ['--disable-gpu', '--disable-3d-apis', '--use-gl=disabled'];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 240_000,
    env: { NEXT_PUBLIC_E2E: '1' },
  },
  projects: [
    // Layout/behaviour specs run with WebGL off (the CSS fallback), so software-GL cost does not skew timings.
    { name: 'desktop', testIgnore: /scene/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: { args: NO_GL } } },
    { name: 'mobile', testIgnore: /scene/, use: { ...devices['Pixel 7'], launchOptions: { args: NO_GL } } },
    // The scene spec runs with WebGL on, one worker at a time.
    { name: 'webgl', testMatch: /scene\.spec/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'webgl-mobile', testMatch: /scene\.spec/, use: { ...devices['Pixel 7'] } },
    { name: 'nowebgl', testMatch: /scene-fallback/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: { args: NO_GL } } },
  ],
});
