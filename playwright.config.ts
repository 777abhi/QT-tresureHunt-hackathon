//playwright.config.ts
import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
  timeout: 12 * 10000, // 2 minutes
  //reporter:'html',
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        headless: false,
        video:'on',
        launchOptions: {
          //slowMo:2000
        },
      },
    },
  ],
};
export default config;
