Feature: The application works only with the Sepolia network

  Scenario: The user accesses the page with Metamask connected to Sepolia network
    Given A user with metamask installed connected to "Sepolia" network
    When the user accesses the app page
    And the user accepts notifications
    Then the page shows the account address
    And the page shows the input address field
    And the page doesn't show a network error message

  Scenario: The user accesses the page with Metamask connected to Mainnet network
    Given A user with metamask installed connected to "Ethereum Mainnet" network
    When the user accesses the app page
    And the user accepts notifications
    Then the page shows a network error message
    And the page shows the switch network button
    And the page doesn't show the input address field

  Scenario: The user accesses the page with Metamask connected to Mainnet network and uses the switch network button
    Given A user with metamask installed connected to "Ethereum Mainnet" network
    When the user accesses the app page
    And the user accepts notifications
    And the user clicks the switch network button
    And the user confirms the switch network
    Then the page shows the input address field
    And the page doesn't show a network error message
