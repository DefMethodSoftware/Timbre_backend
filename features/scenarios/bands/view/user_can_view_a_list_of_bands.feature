Feature: User can see a list of bands near them
  So that I can see which bands I'd like to join
  As a user
  I would like to see a list of bands

  Background:
    Given there is a user in the system with the email "user@london.com" and username "EnglishBandOwner"
    And there is a user in the system with the email "user2@london.com" and username "CockneyBandOwner"
    And there is a user in the system with the email "user@france.com" and username "FrenchBandOwner"
    And the user "user@london.com" has set their profile information to:
      | firstName    | lastName | bio              | instruments | location                                            |
      | Spitalfields | User     | I am a test user | drums: 5    | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And the user "user2@london.com" has set their profile information to:
      | firstName   | lastName | bio              | instruments | location                                            |
      | Whitechapel | User     | I am a test user | bass: 5     | friendly: London, long: 51.5149513, lat: -0.0722477 |
    And the user "user@france.com" has set their profile information to:
      | firstName | lastName | bio              | instruments | location                                          |
      | Paris     | User     | I am a test user | bass: 5     | friendly: Paris, long: 48.8589507, lat: 2.2770201 |
    And the user "user@london.com" has created the following band:
      | bandName    | missingInstruments | bio                |
      | London Band | guitar: 1          | We are a cool band |
    And the user "user2@london.com" has created the following band:
      | bandName | missingInstruments | bio                |
      | Oi Innit | drums: 1           | We are a cool band |
    And the user "user@france.com" has created the following band:
      | bandName   | missingInstruments | bio                  |
      | Paris Band | guitar: 1          | We are tre cool band |

  Scenario: User sees a band in their area that needs their instrument
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName  | lastName | bio              | instruments | location                                            |
      | Shoreditch | User     | I am a test user | guitar: 5   | friendly: London, long: 51.5234057, lat: -0.0827868 |
    When I request to see bands in my area
    Then the platform should respond that the request was successful
    And I should see the band "London Band"
    And I should not see the band "Oi Innit"
    And I should not see the band "Paris Band"

  Scenario: User with incomplete profile does not see a list of bands
    Given I am logged in as a user
    And I have not set my profile information
    When I request to see bands in my area
    Then the platform should respond that the request was bad

  Scenario: Unauthenticated user does not see a list of bands
    Given I am not logged in
    When I send an unauthenticated request to see a list of bands
    Then the platform should respond that I am not allowed to do this
