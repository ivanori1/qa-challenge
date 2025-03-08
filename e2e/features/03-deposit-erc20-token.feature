#Feature: Deposit ERC20 tokens

 # Scenario: The user try to deposit a ERC20 token with an empty balance
  #  Given A user with metamask installed connected to sepolia network
   # When the user accesses the app page
   # And the user enters the address 0xCD85B9a767eF2277E264A4B9A14a2deACAB82FfB in the input address field
   # And the user clicks the Submit button
   # Then the page shows the token balance 0
   # And the deposit input shows an error
   # And the deposit button is not visible

#  Scenario: The user mint example token using the web application
 ##  When the user accesses the app page
   # And the user clicks the example token link
   # And the user clicks the Get more tokens link
   # And the user accepts the transaction
   # Then the deposit button is visible

 # Scenario: The user deposit example token
  #  Given A user with metamask installed connected to sepolia network
   # When the user accesses the app page
   # And the user clicks the example token link
   # And the deposit button is visible
   # And the user enter the max amount of tokens in the amount field
   # And the user clicks the deposit button
   # And the user approve the deposit
   #Then the page shows the token balance 0