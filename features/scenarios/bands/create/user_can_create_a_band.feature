Feature: User can create a band
  So that I can advertise the available positions in my band
  As a User
  I would like to be able to create a band

  @version: v1.0
  Scenario: User creates a band
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    When I send a request to create the following band:
      | bandName | missingInstruments   | bio                |
      | My Band  | Guitar: 2, Vocals: 1 | We are a cool band |
    Then the platform should respond that the creation was successful
    And there should be a band associated with my account with the following information:
      | bandName | missingInstruments   | bio                | locationFriendly | location                        |
      | My Band  | Guitar: 2, Vocals: 1 | We are a cool band | London           | long: 55.509865, lat: -0.118092 |

  @version: v1.0
  Scenario: User creates a second band
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    And I have previously created the following band:
      | bandName | missingInstruments   | bio                |
      | My Band  | Guitar: 2, Vocals: 1 | We are a cool band |
    When I send a request to create the following band:
      | bandName | missingInstruments   | bio                |
      | My Band  | Guitar: 1, Vocals: 1 | We are a cool band |
    Then the platform should respond that the creation was successful
    And there should be two bands associated with my account

  @version: v1.0
  Scenario: User tries to create a band without completing their profile
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to create the following band:
      | bandName | missingInstruments   | bio                |
      | My Band  | Guitar: 1, Vocals: 1 | We are a cool band |
    Then the platform should respond that the request was bad
    And there should be no bands associated with my account

  @version: v1.0
  Scenario: Unauthenticated user cannot create a band
    Given I am not logged in
    When I send an unauthenticated request to create the following band:
      | bandName | missingInstruments  | bio                |
      | My Band  | Guitar: 2, Vocals 1 | We are a cool band |
    Then the platform should respond that I am not authorized
    And there should be no bands in the system

  @version: v1.0
  Scenario: User creates a band without a Band Name
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    When I send a request to create the following band:
      | bandName | missingInstruments   | bio                |
      |          | Guitar: 2, Vocals: 1 | We are a cool band |
    Then the platform should respond that the request was bad
    And there should be no bands associated with my account

  @version: v1.0
  Scenario: User creates a band without any missing instruments
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    When I send a request to create the following band:
      | bandName | missingInstruments   | bio                |
      | My Band  | none                 | We are a cool band |
    Then the platform should respond that the request was bad
    And there should be no bands associated with my account

  @version: v1.0
  Scenario: User creates a band without a bio
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    When I send a request to create the following band:
      | bandName | missingInstruments   | bio                |
      | My Band  | Guitar: 2, Vocals: 1 |                    |
    Then the platform should respond that the request was bad
    And there should be no bands associated with my account