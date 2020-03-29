Feature: User can request to join a band
  So that I can let a band owner know I would like to join their band
  As a user
  I would like to be able to request to join their band

  Background:
    Given there is a user in the system with the email "user@london.com" and username "EnglishBandOwner"
    And the user "user@london.com" has set their profile information to:
      | firstName    | lastName | bio              | instruments | location                                            |
      | Spitalfields | User     | I am a test user | drums: 5    | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And the user "user@london.com" has created the following band:
      | bandName    | missingInstruments | bio                |
      | London Band | guitar: 1          | We are a cool band |

  Scenario: User creates a membership request for a band
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName  | lastName | bio              | instruments | location                                            |
      | Shoreditch | User     | I am a test user | guitar: 5   | friendly: London, long: 51.5234057, lat: -0.0827868 |
    When I send a request to join "London Band"
    Then the platform should respond that the creation was successful
    And there should be a membership request in the system for me to join "London Band"

  Scenario: User requests to join a band that doesn't require their instrument
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName  | lastName | bio              | instruments | location                                            |
      | Shoreditch | User     | I am a test user | bass: 5     | friendly: London, long: 51.5234057, lat: -0.0827868 |
    When I send a request to join "London Band"
    Then the platform should respond that the request was bad
    And there should be no membership requests in the system

  Scenario: User requests to join a band outside their area
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio              | instruments | location                                          |
      | Paris     | User     | I am a test user | guitar: 5 | friendly: Paris, long: 48.8589507, lat: 2.2770201 |
    When I send a request to join "London Band"
    Then the platform should respond that the request was bad
    And there should be no membership requests in the system

  Scenario: User tries to join a non existant band
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName  | lastName | bio              | instruments | location                                            |
      | Shoreditch | User     | I am a test user | bass: 5     | friendly: London, long: 51.5234057, lat: -0.0827868 |
    When I send a request to join a non-existant Band
    Then the platform should respond that the request was bad
    And there should be no membership requests in the system

  Scenario: User with incomplete profile tries to join a band
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to join "London Band"
    Then the platform should respond that the request was bad
    And there should be no membership requests in the system

  Scenario: Unauthenticated user tries to join a band
    Given I am not logged in
    When I send an unauthenticated request to join "London Band"
    Then the platform should respond that I am not authorized
