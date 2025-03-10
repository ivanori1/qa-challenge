import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { context, page, metamask } from "./common.steps";

When("the user accepts notifications", async () => {
  console.log("✅ Checking for MetaMask connection request...");

  // Bring MetaMask tab to front
  const mmPopup = context
    .pages()
    .find((p) => p.url().includes("chrome-extension://"));
  if (!mmPopup) {
    throw new Error("❌ MetaMask extension tab not found!");
  }
  await mmPopup.bringToFront();
  console.log("✅ MetaMask tab is active!");

  // Click on Account options menu (three dots)
  const accountOptions = mmPopup.locator(
    "[data-testid='account-options-menu-button']"
  );
  await accountOptions.waitFor({ state: "visible", timeout: 5000 });
  await accountOptions.click();
  console.log("✅ Opened MetaMask menu.");

  // Click on "All Permissions"
  const allPermissions = mmPopup.locator(
    "[data-testid='global-menu-connected-sites']"
  );
  await allPermissions.waitFor({ state: "visible", timeout: 5000 });
  await allPermissions.click();
  console.log("✅ Navigated to permissions.");

  // Click "Got it" button (if exists)
  const gotItButton = mmPopup.locator(".multichain-product-tour-menu__button");
  if (await gotItButton.isVisible()) {
    await gotItButton.click();
    console.log("✅ Dismissed 'Got it' modal.");
  }

  // Click back arrow button
  const backButton = mmPopup.locator("[aria-label='Back']");
  await backButton.waitFor({ state: "visible", timeout: 5000 });
  await backButton.click();
  console.log("✅ Navigated back to connection prompt.");

  // Click the "Connect" button to approve localhost connection
  const connectPopup = mmPopup.locator("[data-testid='confirm-btn']");
  await connectPopup.waitFor({ state: "visible", timeout: 5000 });
  await connectPopup.click();
  console.log("🟢 Successfully connected MetaMask to localhost!");

  // Bring the dApp tab back to front
  const dAppPage = context.pages().find((p) => p.url().includes("localhost"));
  if (!dAppPage) {
    throw new Error("❌ dApp page (localhost) not found!");
  }
  await dAppPage.bringToFront();
  console.log("✅ dApp is now in focus!");
});

Then("the page shows the account address", async () => {
  console.log(
    "✅ Verifying that the page displays the correct connected account address..."
  );
  const expectedAddress = await page.evaluate(async () => {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  });

  console.log(`🟢 Expected MetaMask Address: ${expectedAddress}`);

  // Locate the displayed address on the dApp page
  const connectedAddressElement = page.locator(
    "[data-test='MetaMaskConnector__Div__connect']"
  );
  page.reload()

  // Wait for the element to be visible
  await connectedAddressElement.waitFor({ state: "visible", timeout: 5000 });

  // Extract and clean the displayed address
  const displayedAddressText = await connectedAddressElement.innerText();
  const displayedAddress = displayedAddressText
    .replace("Connected as: ", "")
    .trim();
  console.log(`🟢 Displayed Address on Page: ${displayedAddress}`);

  // Compare the expected MetaMask address with the displayed one
  expect(displayedAddress.toLowerCase()).toBe(expectedAddress.toLowerCase());

  console.log("✅ Address verification passed!");
});

Then("the page shows the input address field", async () => {
  console.log("✅ Verifying that the input address field is visible...");

  // Locate the input field
  const inputField = page.locator(
    "[data-test='InputAddress__Input__addressValue']"
  );

  // Wait for the element to be visible
  await inputField.waitFor({ state: "visible", timeout: 5000 });

  // Expect the input field to be present
  expect(await inputField.isVisible()).toBeTruthy();

  console.log("🟢 Input address field is visible!");
});

Then("the page doesn't show a network error message", async () => {
  console.log("✅ Checking that no network error message is displayed...");

  // Locate the network error message container
  const errorMessage = page.locator(
    "[data-test='MetaMaskConnector__Div__error']"
  );

  // Expect the error message NOT to be visible
  const isErrorVisible = await errorMessage
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  expect(isErrorVisible).toBeFalsy();

  console.log("🟢 No network error message detected!");
});
Then("the page shows a network error message", async () => {
  console.log("✅ Checking for network error message...");
  //  Ensure focus is on the first tab (localhost)
  const pages = await context.pages();
  const localhostPage = pages.find((p) => p.url().includes("localhost"));

  if (localhostPage) {
    console.log("🔄 Bringing localhost tab into focus...");
    await localhostPage.bringToFront();
    console.log("🟢 Localhost tab is now active.");
  }

  // Refresh the page to ensure network error message is visible
  console.log("🔄 Refreshing the page...");
  await page.reload();
  console.log("🟢 Page refreshed successfully");

  const errorMessage = await page
    .locator('[data-test="MetaMaskConnector__Div__error"]')
    .textContent();

  expect(errorMessage).not.toBeNull();
  expect(errorMessage).toContain(
    "It seems like your MetaMask plugin is not present or the network chain is not already configured"
  );
  console.log("🟢 Network error message is displayed!");
});

Then("the page shows the switch network button", async () => {
  console.log("✅ Checking for switch network button...");

  const switchNetworkButton = page.locator(
    "[data-test='MetaMaskConnector__Button__connect']"
  );

  await expect(switchNetworkButton).toBeVisible();
  await expect(switchNetworkButton).toHaveText("Connect Metamask to Sepolia");

  console.log("🟢 Switch network button is visible!");
});

Then("the page doesn't show the input address field", async () => {
  console.log("✅ Checking if the input address field is hidden...");

  const inputAddressField = await page.locator(
    '[data-test="InputAddress__Input__addressValue"]'
  );

  await expect(inputAddressField).not.toBeVisible();
  console.log("🟢 Input address field is not visible!");
});

When("the user clicks the switch network button", async () => {
  await page.reload();
  const switchNetworkButton = page.locator(
    "[data-test='MetaMaskConnector__Button__connect']"
  );
  await expect(switchNetworkButton).toBeVisible();

  await switchNetworkButton.click();
  console.log("🟢 Switch network button clicked successfully!");
});
When("the user confirms the switch network", async () => {
  console.log("✅ Confirming network switch in MetaMask...");
  const confirmButton = metamask.page.locator("button:has-text('Confirm')");
  await expect(confirmButton).toBeVisible();

  await confirmButton.click();
  console.log("🟢 Network switch confirmed in MetaMask!");

  // Verify that the dApp is now on Sepolia
  const networkError = page.locator(
    "[data-test='MetaMaskConnector__Div__error']"
  );
  await expect(networkError).not.toBeVisible();
});
