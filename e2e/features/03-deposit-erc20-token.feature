Feature: Deposit ERC20 tokens

  Background:
    Given A user with metamask installed connected to "Sepolia" network
    When the user accesses the app page
    And the user accepts notifications

  @empty_balance_deposit
  Scenario: The user try to deposit a ERC20 token with an empty balance
    And the user enters the address "0x364325f2050d1858eda4ced9e65e0d92f0f283f3" in the input address field
    And the user clicks the Submit button
    Then the page shows the token balance "0"
    And the deposit input shows an error "The deposit is disabled because you don't have any token left in your account."
    But the deposit button is "not visible"

  @mint_token
  Scenario: The user mint example token using the web application
    And the user clicks the example token link
    And the user clicks the Get more tokens link
    And the user accepts the transaction
    Then the deposit button is "visible"

  @deposit_max_minted_token_negative
  Scenario: The user deposit example token
    And the user clicks the example token link
    And the deposit button is "visible"
    And the user enter the max amount of tokens in the amount field
    And the user clicks the deposit button
    And the user cancels the deposit
    Then the deposit input shows an error "Something went wrong: Returned error: MetaMask Tx Signature: User denied transaction signature."

  @deposit_max_minted_token_positive
  Scenario: The user deposit example token
    And the user clicks the example token link
    And the deposit button is "visible"
    And the user enter the max amount of tokens in the amount field
    And the user clicks the deposit button
    And the user accept sending cap request
    And the user approve the deposit
    And the user switches back to the dApp page
    Then the page shows the token balance "0"
