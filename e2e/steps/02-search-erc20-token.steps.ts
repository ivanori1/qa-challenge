import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { page } from "../steps/common.steps"; // Ensure common steps export `page`

When(
  "the user enters the address {string} in the input address field",
  async (address: string) => {
    await page.reload();
    console.log(`✅ Entering token address: ${address}`);
    const inputField = page.locator(
      "[data-test='InputAddress__Input__addressValue']"
    );

    await inputField.waitFor({ state: "visible" });
    await inputField.fill("");

    await inputField.fill(address);

    console.log("🟢 Token address entered");
  }
);
Then("the user clicks the Submit button", async()=> {

    const submitButton = page.locator(
        "[data-test='InputAddress__Button__submit']"
      );
      await submitButton.click();
  
      console.log("🟢 Token address submitted!");
})


Then("the page shows the address balance for the selected token", async () => {
  console.log("✅ Checking if token balance is displayed...");

  const balanceLocator = page.locator(
    "[data-test='TokenBalance__Div__balanceInfo']"
  );
  await balanceLocator.waitFor({ state: "visible" });

  const balanceText = await balanceLocator.innerText();
  expect(balanceText).not.toBe("");

  console.log(`🟢 Found balance: ${balanceText}`);
});

Then(
  "the page shows the table of the deposit history for the selected token",
  async () => {
    console.log("✅ Checking for deposit history table...");

    const historyTable = page.locator(
      "[data-test='DepositHistory__Table__history']"
    );
    await historyTable.waitFor({ state: "visible" });

    const rows = await historyTable.locator("tr").count();
    expect(rows).toBeGreaterThan(0);

    console.log(`🟢 Deposit history found with ${rows} entries.`);
  }
);

Then("the submit button is disabled", async () => {
  const submitButton = await page.locator(
    "[data-test='InputAddress__Button__submit']"
  );
  // Ensure the submit button exists
  await expect(submitButton).toBeVisible();

  // Verify the submit button is disabled
  await expect(submitButton).toBeDisabled();

  console.log("🟢 Submit button is correctly disabled.");
});

When("the user clicks the example token link", async () => {
    await page.reload();

    console.log("✅ Clicking on the example token link...");
    
    const tokenLink = page.locator('[data-test="InputAddress__Span__exampleTokenLink"]');
    await tokenLink.click();
  });