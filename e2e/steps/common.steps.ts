import dotenv from "dotenv";
import { launch, MetaMaskWallet } from "@tenkeylabs/dappwright";
import { Given, When, setDefaultTimeout } from "@cucumber/cucumber";
import { Page, BrowserContext } from "@playwright/test";

dotenv.config({ path: ".env.local" });
setDefaultTimeout(30 * 1000);

let context: BrowserContext;
let metamask: MetaMaskWallet;
let page: Page;

Given("A user with metamask installed connected to {string} network", { timeout: 30000 }, async (network) => {
  console.log(`✅ Launching browser with MetaMask and connecting to ${network}...`);

  // Start MetaMask and Launch Browser
  const { wallet, browserContext } = await launch("chromium", {
    wallet: "metamask",
    version: "12.8.1",
    headless: false
  });

  metamask = wallet as MetaMaskWallet;
  context = browserContext;
  page = context.pages()[0];

  console.log("✅ MetaMask loaded successfully!");

  // Ensure the wallet seed is available
  if (!process.env.METAMASK_SEED) {
    throw new Error("❌ METAMASK_SEED is missing in .env.local");
  }

  // Import wallet
  await metamask.setup({
    seed: process.env.METAMASK_SEED
  });
  console.log("✅ Wallet imported successfully!");

  //  Ensure network switch happens properly
  const switched = await metamask.switchNetwork(network);
  console.log(`🟢 Successfully switched to ${network}`);
});

When("the user accesses the app page", async () => {
  console.log("✅ Opening app page...");

  if (!page) throw new Error("❌ Page is not initialized!");

  await page.goto(process.env.APP_URL || "https://localhost:3000");

  console.log("🟢 App page loaded successfully");
});

export { page, metamask, context };
