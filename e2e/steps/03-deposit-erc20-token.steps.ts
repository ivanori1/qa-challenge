import { When, Then } from "@cucumber/cucumber";
import { expect, Page } from "@playwright/test";
import { page, metamask, context } from "../steps/common.steps";


Then("the page shows the token balance {string}", async (expectedBalance) => {
  console.log(`✅ Checking if token balance is "${expectedBalance}"...`);

  const balanceElement = page.locator('[data-test="TokenBalance__Div__balanceAmount"]');

  await balanceElement.waitFor({ state: "visible", timeout: 5000 });

  let actualBalance = await balanceElement.textContent();

  console.log(`🟢 Token balance found: "${actualBalance}"`);

  const balanceAsNumber = Number(actualBalance);
  if (balanceAsNumber < 1e-6) {
    actualBalance = "0"; // Round small dust values to zero
    console.log("🔄 Balance rounded to 0 due to dust value.");
  }


  expect(actualBalance?.trim()).toBe(expectedBalance);
});


Then("the deposit input shows an error {string}", async (message) => {
  console.log("✅ Checking for deposit error message...");

  const errorElement = page.locator('[data-test="DepositToken__Div__error"]');

  await errorElement.waitFor({ state: "visible", timeout: 5000 });

  const errorMessage = await errorElement.textContent();

  console.log(`🟢 Error message found: "${errorMessage}"`);

  expect(errorMessage).toContain(message);
});

// ✅ Step: Check if the deposit button is visible or not
Then("the deposit button is {string}", async (visibility) => {
  console.log(`✅ Checking if deposit button is "${visibility}"...`);

  const depositButton = page.locator(
    '[data-test="DepositToken__Button__deposit"]'
  );

  if (visibility === "visible") {
    await depositButton.waitFor({ state: "visible", timeout: 5000 });
    expect(await depositButton.isVisible()).toBe(true);
    console.log("🟢 Deposit button is visible.");
  } else if (visibility === "not visible") {
    expect(await depositButton.isVisible()).toBe(false);
    console.log("🟢 Deposit button is not visible.");
  } else {
    throw new Error(
      `❌ Invalid visibility option: ${visibility}. Use "visible" or "not visible".`
    );
  }
});

When("the user clicks the Get more tokens link", async () => {
  console.log("✅ Clicking on the 'Get more tokens' link...");

  const getMoreTokensLink = page.locator(
    '[data-test="TokenBalance__Div__getMoreExampleTokensAction"]'
  );

  await getMoreTokensLink.waitFor({ state: "visible", timeout: 5000 });
  await getMoreTokensLink.click();

  console.log("🟢 Get more tokens link clicked!");
});

Then("the user accepts the transaction", async () => {
  await metamask.confirmTransaction();

  console.log("🟢 Transaction confirmed in MetaMask!");
});

When(
  "the user enter the max amount of tokens in the amount field",
  async () => {
    console.log("✅ Fetching max token balance...");

    // Locate the balance amount element
    const balanceElement = page.locator(
      '[data-test="TokenBalance__Div__balanceAmount"]'
    );
    await balanceElement.waitFor({ state: "visible", timeout: 5000 });

    // Get the token balance text value
    const balance = await balanceElement.innerText();
    console.log(`🟢 Found token balance: ${balance}`);

    // Locate the deposit input field
    const depositInput = page.locator(
      '[data-test="DepositToken__Input__depositAmount"]'
    );
    await depositInput.waitFor({ state: "visible", timeout: 5000 });

    // Type the max balance into the input field
    await depositInput.fill(balance);

    console.log("🟢 Max token amount entered in the deposit field!");
  }
);

When("the user clicks the deposit button", async () => {
  // Locate the deposit button
  const depositButton = page.locator(
    '[data-test="DepositToken__Button__deposit"]'
  );
  await depositButton.waitFor({ state: "visible", timeout: 5000 });

  // Ensure the button is enabled before clicking
  const isDisabled = await depositButton.isDisabled();
  expect(isDisabled).toBe(false);

  // Click the button
  await depositButton.click();
  console.log("🟢 Deposit button clicked!");
});

When("the user accept sending cap request", async () => {
  await metamask.confirmTransaction();
  console.log("🟢 Accept sending cap request confirmed!");
});

When("the user approve the deposit", async function () {
  console.log(
    "🟢 First confirmation completed, handling second confirmation..."
  );

  // Find the MetaMask tab
  const metamaskPage = context
    .pages()
    .find((p) => p.url().includes("chrome-extension"));

  if (!metamaskPage) {
    throw new Error("❌ MetaMask tab not found!");
  }

  console.log("✅ Switching to MetaMask tab...");
  await metamaskPage.bringToFront();

  // Click on the "Activity" tab
  console.log("✅ Clicking on Activity tab...");
  await metamaskPage.click("[data-testid='account-overview__activity-tab']");

  // Wait for the transaction list to appear
  console.log("✅ Waiting for pending transaction in Activity...");
  const transactionRow = metamaskPage.locator(
    "[class='mm-box transaction-list__transactions'] > div:first-child"
  );
  await transactionRow.waitFor({ state: "visible", timeout: 20000 });

  // Wait for "Deposit - Unapproved" to appear (filter to avoid "Approve ETT spending cap")
  const depositAction = metamaskPage
    .locator("[data-testid='activity-list-item-action']")
    .filter({ hasText: "Deposit" }); // Select only Deposit

  const statusLabel = metamaskPage
    .locator(".transaction-status-label--unapproved")
    .nth(0); // Ensure first occurrence

  const maxRetries = 15; // Max wait time: ~30 sec (15 retries x 2 sec)
  let retryCount = 0;
  let depositTransactionFound = false;

  while (retryCount < maxRetries) {
    console.log(
      `🔄 Waiting for 'Deposit - Unapproved' transaction... (Attempt ${
        retryCount + 1
      }/${maxRetries})`
    );

    const depositAction = await metamaskPage
      .locator("[data-testid='activity-list-item-action']")
      .filter({ hasText: "Deposit" })
      .isVisible();

    const statusLabel = await metamaskPage
      .locator(".transaction-status-label--unapproved")
      .nth(0)
      .isVisible();

    if (depositAction && statusLabel) {
      console.log("✅ Deposit transaction found!");
      depositTransactionFound = true;
      break; // Exit loop if the transaction is found
    }

    retryCount++;
    await metamaskPage.waitForTimeout(2000); // Wait 2 sec before retrying
  }

  // Fail if transaction not found within the maximum wait time
  if (!depositTransactionFound) {
    throw new Error(
      "❌ Timed out waiting for 'Deposit - Unapproved' transaction!"
    );
  }

  const actionText = await depositAction.innerText();
  const statusText = await statusLabel.innerText();

  if (actionText.trim() !== "Deposit" || statusText.trim() !== "Unapproved") {
    throw new Error(
      `❌ Expected 'Deposit' with 'Unapproved' status, but got '${actionText}' - '${statusText}'`
    );
  }
  console.log(
    "✅ Found unapproved deposit transaction, clicking to confirm..."
  );
  await transactionRow.click();

  // Wait for the confirm button and click it
  console.log("✅ Waiting for confirm button...");
  await metamaskPage.waitForSelector('[data-testid="confirm-footer-button"]', {
    timeout: 15000,
  });

  console.log("✅ Confirming second transaction...");
  await metamaskPage.click('[data-testid="confirm-footer-button"]');

  console.log("🟢 Request for Deposit successfully done!");
});

When("the user cancels the deposit", async function () {
  await metamask.reject();
  console.log("⚠️ Deposit canceled!");
});


When("the user switches back to the dApp page", async function () {
  console.log("✅ Switching back to the dApp page...");

  // Find the localhost (dApp) tab
  const dappPage: Page | undefined = context.pages().find((p) =>
    p.url().includes("localhost")
  );

  if (!dappPage) {
    throw new Error("❌ dApp tab not found!");
  }

  // Bring dApp tab to the front
  await dappPage.bringToFront();
  console.log("🟢 dApp page is now active!");

  // Wait 8 seconds for the transaction to be confirmed
  console.log("⏳ Waiting 12 seconds for transaction confirmation...");
  await dappPage.waitForTimeout(12000);

  console.log("✅ Ready to proceed with balance verification.");
});
