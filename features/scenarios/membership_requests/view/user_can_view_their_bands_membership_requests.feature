Feature: User can see a list of membership requests for their bands
  So that I can see which users would like to join my bands
  As a user
  I would like to be able to request a list of membership requests

  Background:
    Given there is a user in the system with the email "user@london.com" and username "EnglishBandOwner"
    And the user "user@london.com" has set their profile information to:
      | firstName    | lastName | bio              | instruments | location                                            |
      | Spitalfields | User     | I am a test user | drums: 5    | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And there is a user in the system with the email "user2@london.com" and username "EnglishWannabe"
    And the user "user2@london.com" has set their profile information to:
      | firstName | lastName | bio              | instruments | location                                            |
      | Another   | User     | I am a third test user | drums: 5    | friendly: London, long: 51.5173436, lat: -0.0754695 |

  Scenario: User sees an empty list of membership requests
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio                    | instruments | location                                            |
      | London    | User     | I am another test user | guitar: 5   | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And I have previously created the following band:
      | bandName          | missingInstruments | bio                |
      | Spitalfields Band | guitar: 1          | We are a cool band |
    When I request to see a list of membership requests
    Then the platform should respond that the request was successful
    And I should see an empty list of membership requests

  Scenario: User sees a list of membership requests
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio                    | instruments | location                                            |
      | London    | User     | I am another test user | guitar: 5   | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And I have previously created the following band:
      | bandName          | missingInstruments | bio                |
      | Spitalfields Band | guitar: 1          | We are a cool band |
    And the user "user@london.com" has requested to join the band "Spitalfields Band"
    When I request to see a list of membership requests
    Then the platform should respond that the request was successful
    And I should see a request for "user@london.com" to join my band "Spitalfields Band"

  Scenario: User sees requests for all of their bands
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio                    | instruments | location                                            |
      | London    | User     | I am another test user | guitar: 5   | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And I have previously created the following band:
      | bandName          | missingInstruments | bio                |
      | Spitalfields Band | Guitar: 1          | We are a cool band |
    And I have previously created the following band:
      | bandName                | missingInstruments | bio                |
      | Other Spitalfields Band | Guitar: 1          | We are a cool band |
    And the user "user@london.com" has requested to join the band "Spitalfields Band"
    And the user "user2@london.com" has requested to join the band "Other Spitalfields Band"
    When I request to see a list of membership requests
    Then the platform should respond that the request was successful
    And I should see a request for "user@london.com" to join my band "Spitalfields Band"
    And I should see a request for "user2@london.com" to join my band "Other Spitalfields Band"

  Scenario: User doesn't see requests previously actioned
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio                    | instruments | location                                            |
      | London    | User     | I am another test user | guitar: 5   | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And I have previously created the following band:
      | bandName          | missingInstruments | bio                |
      | Spitalfields Band | guitar: 1          | We are a cool band |
    And the user "user@london.com" has requested to join the band "Spitalfields Band"
    And I have accepted "user@london.com"'s request to join "Spitalfields Band"
    And the user "user2@london.com" has requested to join the band "Spitalfields Band"
    And I have declined "user2@london.com"'s request to join "Spitalfields Band"
    When I request to see a list of membership requests
    Then the platform should respond that the request was successful
    And I should see an empty list of membership requests

  Scenario: User can't see other users membership requests
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio                    | instruments | location                                            |
      | London    | User     | I am another test user | guitar: 5 | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And I have previously created the following band:
      | bandName          | missingInstruments | bio                |
      | Spitalfields Band | guitar: 1    | We are a cool band |
    And the user "user@london.com" has created the following band:
      | bandName     | missingInstruments | bio                |
      | Cockney Band | drums: 1           | We are a cool band |
    And I have requested to join the band "Cockney Band"
    And the user "user@london.com" has requested to join the band "Spitalfields Band"
    When I request to see a list of membership requests
    Then the platform should respond that the request was successful
    And I should see a request for "user@london.com" to join my band "Spitalfields Band"
    And I should not see a request for me to join "Cockney Band"

  Scenario: User can't see membership requests if they have not created a band
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio                    | instruments | location                                            |
      | London    | User     | I am another test user | guitar: 5   | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And there are no bands associated with my account
    When I request to see a list of membership requests
    Then the platform should respond that the request was bad

  Scenario: Unauthenticated user can't see a list of membership requests
    Given I am not logged in
    When I send an unauthenticated request to see a list of membership requests
    Then the platform should respond that I am not allowed to do this

