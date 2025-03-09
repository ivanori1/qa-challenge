Feature: Search ERC20 tokens

  Background:
    Given A user with metamask installed connected to "Sepolia" network
    When the user accesses the app page
    And the user accepts notifications

  @search_token_invalid
  Scenario: The user enter an invalid ERC20 token address   Given A user with metamask installed connected to "Sepolia" network
    And the user enters the address "0x9982f9A3bA28c" in the input address field
    Then the submit button is disabled

  @search_token_valid
  Scenario: The user can search for an existing ERC20 token and see his balance and deposit history for the selected token.
    And the user enters the address "0x9982f9A3bA28c34aD03737745d956EC0668ea440" in the input address field
    And the user clicks the Submit button
    Then the page shows the address balance for the selected token
    And the page shows the table of the deposit history for the selected token

  @click_token_link
  Scenario: The user clicks the example token link and he will be able to see his balance and deposit history.
    And the user clicks the example token link
    Then the page shows the address balance for the selected token
    And the page shows the table of the deposit history for the selected token
 