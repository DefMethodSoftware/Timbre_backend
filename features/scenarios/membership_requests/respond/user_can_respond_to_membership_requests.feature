Feature: User can respond to their bands membership requests
  So that I can let a user know whether I'd like them in my band
  As a band owning user
  I'd like to be able to accept and decline membership requests for my bands

  Background:
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio                    | instruments | location                                            |
      | London    | User     | I am another test user | guitar: 5   | friendly: London, long: 51.5173436, lat: -0.0754695 |
    And I have previously created the following band:
      | bandName          | missingInstruments | bio                |
      | Spitalfields Band | guitar: 1          | We are a cool band |
    And there is a user in the system with the email "user@london.com" and username "EnglishBandOwner"
    And the user "user@london.com" has set their profile information to:
      | firstName    | lastName | bio              | instruments | location                                            |
      | Spitalfields | User     | I am a test user | drums: 5    | friendly: London, long: 51.5173436, lat: -0.0754695 |

  Scenario: User accepts a membership request
    Given the user "user@london.com" has requested to join the band "Spitalfields Band"
    When I send a request to accept "user@london.com"'s request to join the band "Spitalfields Band"
    Then the platform should respond that the request was successful
    And there should be an accepted membership request in the system for "user@london.com" to join "Spitalfields Band"

  Scenario: User declines a membership request
    Given the user "user@london.com" has requested to join the band "Spitalfields Band"
    When I send a request to decline "user@london.com"'s request to join the band "Spitalfields Band"
    Then the platform should respond that the request was successful
    And there should be a declined membership request in the system for "user@london.com" to join "Spitalfields Band"

  Scenario: User cannot accept other users membership requests
    Given there is a user in the system with the email "user2@london.com" and username "CockneyBandOwner"
    And the user "user2@london.com" has set their profile information to:
      | firstName   | lastName | bio              | instruments | location                                            |
      | Whitechapel | User     | I am a test user | bass: 5     | friendly: London, long: 51.5149513, lat: -0.0722477 |
    And the user "user2@london.com" has created the following band:
      | bandName | missingInstruments | bio                |
      | Oi Innit | drums: 1           | We are a cool band |
    And the user "user@london.com" has requested to join the band "Oi Innit"
    When I send a request to accept "user@london.com"'s request to join the band "Oi Innit"
    Then the platform should respond that I am not allowed to do this

  Scenario: User cannot decline other users membership requests
    Given there is a user in the system with the email "user2@london.com" and username "CockneyBandOwner"
    And the user "user2@london.com" has set their profile information to:
      | firstName   | lastName | bio              | instruments | location                                            |
      | Whitechapel | User     | I am a test user | bass: 5     | friendly: London, long: 51.5149513, lat: -0.0722477 |
    And the user "user2@london.com" has created the following band:
      | bandName | missingInstruments | bio                |
      | Oi Innit | drums: 1           | We are a cool band |
    And the user "user@london.com" has requested to join the band "Oi Innit"
    When I send a request to decline "user@london.com"'s request to join the band "Oi Innit"
    Then the platform should respond that I am not allowed to do this

  Scenario: User cannot accept a previously declined membership request
    Given the user "user@london.com" has requested to join the band "Spitalfields Band"
    And I have declined "user@london.com"'s request to join "Spitalfields Band"
    When I send a request to accept "user@london.com"'s request to join the band "Spitalfields Band"
    Then the platform should respond that the request was bad
    And there should be a declined membership request in the system for "user@london.com" to join "Spitalfields Band"

  Scenario: User cannot decline a previously accepted membership request
    Given the user "user@london.com" has requested to join the band "Spitalfields Band"
    And I have accepted "user@london.com"'s request to join "Spitalfields Band"
    When I send a request to decline "user@london.com"'s request to join the band "Spitalfields Band"
    Then the platform should respond that the request was bad
    And there should be an accepted membership request in the system for "user@london.com" to join "Spitalfields Band"

  Scenario: User cannot accept a non-existant request
    When I send a request to accept some rubbish membership request
    Then the platform should respond that the request was bad

  Scenario: Unauthenticated user cannot accept membership requests
    Given I am not logged in
    And the user "user@london.com" has requested to join the band "Spitalfields Band"
    When I send an unauthenticated request to accept "user@london.com"'s requests to join the band "Spitalfields Band"
    Then the platform should respond that I am not allowed to do this
