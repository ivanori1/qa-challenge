# QA Automation for dApp Testing

## 📌 Project Overview
This project automates the testing of a dApp that interacts with **MetaMask** using **Dappwright** and **Cucumber.js**. The tests verify:
- Wallet connection and authentication
- Network switching (e.g., Sepolia, Mainnet)
- UI elements and error messages
- Transaction confirmations

---

## 🚀 Getting Started

### 📂 Prerequisites
Before running the tests, make sure you have:
- **Node.js** (`>=16.x` recommended)
- **npm** or **yarn**
- **Google Chrome** installed
- **MetaMask** extension (automatically installed by Dappwright)

### 📥 Installation
Clone the repository and install dependencies:

```sh
# Clone the repository
git clone https://github.com/your-company/repository.git
cd repository

# Install dependencies
npm install
```

### ⚙️ Environment Configuration
Create a `.env.local` file in the root directory:

```ini
METAMASK_SEED="your-mnemonic-seed-phrase"
APP_URL="http://localhost:3000"
```

Ensure your **MetaMask seed phrase** is correctly set for automated login.

---

### 🚢 Run with Docker Compose

1. Open a terminal at the root path of this project
2. Execute the following command:

   ```bash
   docker-compose up -d
   ```

## 🏃 Running the Tests

### Run all tests:
```sh
npm run test
```

### Run a specific test scenario:
```sh
npx cucumber-js --tags "@wallet"
```

### Run tests with debug logs:
```sh
DEBUG=cucumber:* npm run test
```

---

## 🧪 Test Results & Reports

### 📄 HTML & JSON Reports
Test reports are generated automatically and stored in:
```
e2e/test-results/
```
To view the HTML report, open:
```
e2e/test-results/cucumber-report.html
```

### 🎥 Video Demo
A full test execution video is available at:
[📹 Watch the test execution](TO_BE_ADDED)

---

## 🛠️ Features & Implementations

### ✅ Implemented Tests
- **MetaMask Setup:** Automatically installs and configures MetaMask.
- **Wallet Connection:** Ensures MetaMask connects to the dApp.
- **Network Switching:** Verifies switching between testnet and mainnet.
- **UI Validations:** Checks elements like account address, error messages.
- **Transaction Confirmations:** Automates approving transactions within MetaMask.

### 📌 Notable Workarounds
Since MetaMask does not always automatically show the connection request, we implemented a **UI-based workaround**:
1. **Check MetaMask API for a pending connection request**
2. **If not found, navigate manually through MetaMask's UI**
3. **Approve connection via UI steps**

This ensures that even if the API method fails, the connection process will proceed.

---

## 🔄 Updating the Tests
To modify existing tests or add new ones, follow this structure:

```
├── e2e/
│   ├── features/                # Cucumber feature files
│   ├── steps/                   # Step definitions
│   ├── test-results/            # Test reports (HTML, JSON)
│   ├── playwright.config.ts     # Page Object Model (POM)
│   ├── tsconfig.e2e.json        # TypeScript config for E2E tests
```

### 📜 Step Naming & File Structure
Each `.feature` file under `e2e/features/` should have a corresponding `.steps.ts` file under `e2e/steps/`. 
The naming convention should follow:
- If the feature file is named `01-app-access.feature`, its corresponding steps file should be `01-app-access.steps.ts`.
- Commonly used steps should be placed in `common.steps.ts`.
- Each step function should describe **one distinct action**.

Example:
```gherkin
Feature: Wallet Connection
  Scenario: User connects MetaMask to the dApp
    Given A user with MetaMask installed connected to "Sepolia" network
    When the user accesses the app page
    Then the page shows the account address
```

### 📌 Importance of `common.steps.ts`
The `common.steps.ts` file is used to:
- **Initialize** and **share** the browser, page, and MetaMask instance.
- Ensure all test steps **reuse the same session** instead of creating their own.
- Improve test performance by avoiding redundant launches of the browser.

#### ✅ Why Should Other Step Files Inherit From `common.steps.ts`?
Instead of creating their own instances of `page`, `MetaMaskWallet`, or `browser`, all step files should **import from `common.steps.ts`** to:
- Prevent **session duplication**.
- Keep **consistent browser state** across all tests.
- Avoid **unexpected issues** related to multiple browser contexts.

Example:
```ts
import { Given, When, Then } from "@cucumber/cucumber";
import { page, metamask, browser } from "../common.steps";

When("the user accesses the app page", async () => {
  await page.goto(process.env.APP_URL || "http://localhost:3000");
});
```

By following this structure, tests remain efficient, maintainable, and easier to debug.

---

## 📞 Support & Contributions
For any issues or enhancements, feel free to create a **GitHub Issue**. 🚀




# QA Libre Challenge

## Table of Contents

- [Requirements](#requirements)
  - [Test Suite Structure](#test-suite-structure)
  - [Expectations](#expectations)
- [Project Information](#project-information)
  - [Example ERC20 Token](#example-erc20-token)
- [Local Environment Setup](#local-environment-setup)
  - [Run with Docker Compose](#run-with-docker-compose)
  - [Run with Node.js](#run-with-nodejs)

## Requirements

Fork this repository and create a comprehensive suite of end-to-end (e2e) tests for a decentralized application (DApp) that interacts with a smart contract on the Sepolia Testnet. The DApp consists of a smart contract and a Next.js frontend application. You can access the DApp from [https://qa-challange.netlify.app](https://qa-challange.netlify.app).

### Test Suite Structure

Organize this project as you prefer. Inside the folder `e2e` you will find the the feature files, which following the Gherkin syntax for behavior-driven development (BDD). Use the following existing feature files as a basis for this challenge:

- `01-app-access.feature`
- `02-search-erc20-token.feature`
- `03-deposit-erc20-token.feature`

### Expectations

- Test the connection to the user's wallet (e.g., MetaMask)
- Verify that the ERC20 token address input field works correctly
- Test the display of the current token balance
- Test the token transfer process from the wallet to the smart contract
- Execute the e2e tests using a GitHub Actions workflow
- Document how to run tests
- Be proactive in providing feedback in an MD document about this exercise and share your thoughts on what other aspects should be taken care of to ensure a good level of quality for a web application
- [Bonus] Display test results in an easily shareable format

## Project Information

This is a Next.js project that uses the Web3 library to interact with the MetaMask wallet and perform actions by calling smart contract methods.

To use this application, you need to:

1. Install MetaMask on your browser ([Download MetaMask](https://metamask.io/download/))
2. Connect MetaMask to the Sepolia testnet

## Add Sepolia network to MetaMask

Network Name: Sepolia
RPC URL: https://sepolia.infura.io/v3/
Chain ID: 11155111
Currency Symbol: SepoliaETH
Block Explorer URL (Optional): https://sepolia.etherscan.io

Get free ETH from these faucets:

- https://sepoliafaucet.com (connect with Alchemy)
- https://faucets.chain.link/sepolia

### Example ERC20 Token

The application allows interaction with ERC20 tokens deployed on the Sepolia testnet. For testing purposes, you can use our example ERC20 token deployed at:

```text
0x9982f9A3bA28c34aD03737745d956EC0668ea440
```

By selecting this token, the application will allow you to mint 100 tokens at a time.

## Local Environment Setup

### Run with Docker Compose

1. Open a terminal at the root path of this project
2. Execute the following command:

   ```bash
   docker-compose up -d
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000) using your browser

### Run with Node.js

1. Open a terminal at the root path of this project
2. Execute the following commands:

   ```bash
   npm install
   npm run build && npm run start
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000) using your browser