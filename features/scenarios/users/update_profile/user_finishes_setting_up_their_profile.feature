Feature: User completes the profile setup form
  So that Timbre operates in accordance with my needs
  As a user
  I would like to be able to setup my profile


  @version: v1.0
  Scenario: User sets their profile information
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to set the following profile information:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    Then the platform should respond showing the information was updated
    And I should have the first name "Test"
    And I should have the last name "User"
    And I should have the bio "I am a test user"
    And I should play "guitar" at level 5
    And I should play "drums" at level 3
    And my friendly location should be "London"
    And my location coordinates should be "55.509865, -0.118092"


  @version: v1.0
  Scenario: User updates their profile information
    Given I am logged in as a user
    And I have previously set my profile information to:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    When I send a request to set the following profile information:
      | firstName | lastName | bio                    | instruments         | location                                          |
      | Another   | User     | I am still a test user | guitar: 3, drums: 2 | friendly: London, long: 55.509865, lat: -0.118092 |
    Then the platform should respond showing the information was updated
    And I should have the first name "Another"
    And I should have the last name "User"
    And I should have the bio "I am still a test user"
    And I should play "guitar" at level 3
    And I should play "drums" at level 2
    And my friendly location should be "London"

  @version: v1.0
  Scenario: User sets their profile information without a first name
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to set the following profile information:
      | firstName | lastName | bio              | instruments         | location                                          |
      |           | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    Then the platform should respond that the request was bad
    And my profile information should not be set

  @version: v1.0
  Scenario: User sets their profile information without a last name
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to set the following profile information:
      | firstName | lastName | bio              | instruments         | location                                          |
      | Test      |          | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    Then the platform should respond that the request was bad
    And my profile information should not be set

  @version: v1.0
  Scenario: User sets their profile information without a bio
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to set the following profile information:
      | firstName | lastName | bio | instruments         | location                                          |
      | Test      | User     |     | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    Then the platform should respond that the request was bad
    And my profile information should not be set

  @version: v1.0
  Scenario: User sets their profile information without any instruments
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to set the following profile information:
      | firstName | lastName | bio               | instruments | location                                          |
      | Test      | User     | I am a test user  | none        | friendly: London, long: 55.509865, lat: -0.118092 |
    Then the platform should respond that the request was bad
    And my profile information should not be set

  @version: v1.0
  Scenario: User sets their profile information without a location
    Given I am logged in as a user
    And I have not set my profile information
    When I send a request to set the following profile information:
      | firstName | lastName | bio               | instruments         | location |
      | Test      | User     | I am a test user  | guitar: 5, drums: 3 | none     |
    Then the platform should respond that the request was bad
    And my profile information should not be set

  @version: v1.0
  Scenario: User sends incorrect location information
    Given I am logged in as a user
    When I send a request to set the following profile information:
      | firstName | lastName | bio              | instruments         | location                              |
      | Test      | User     | I am a test user | guitar: 3, drums: 2 | friendly: London, long: 300, lat: 300 |
    Then the platform should respond that the request was bad
    And my profile information should not be set

  @version: v1.0
  Scenario: User sends incorrect Instrument information
    Given I am logged in as a user
    When I send a request to set the following profile information:
      | firstName | lastName | bio              | instruments | location                              |
      | Test      | User     | I am a test user | bed: yes    | friendly: London, long: 90, lat: 45 |
    Then the platform should respond that the request was bad
    And my profile information should not be set

  @version: v1.0
  Scenario: User tries to update the profile information of another user
    Given there is a user in the system with the email "user@london.com" and username "EnglishBandOwner"
    And I am logged in as a user
    When I send a request to set the following profile information for "user@london.com":
      | firstName | lastName | bio              | instruments         | location                              |
      | Test      | User     | I am a test user | guitar: 3, drums: 2 | friendly: London, long: 90, lat: 45 |
    Then the platform should respond that I am not allowed to do this

  @version: v1.0
  Scenario: User tries to update a non-existant user
    Given I am logged in as a user
    When I send a request to set the following profile information for a non-existant user:
      | firstName | lastName | bio              | instruments         | location                              |
      | Test      | User     | I am a test user | guitar: 3, drums: 2 | friendly: London, long: 90, lat: 45 |
    Then the platform should respond that I am not allowed to do this

  @version: v1.0
  Scenario: Unauthenticated user tries to submit profile information
    Given I am not logged in
    When I send an unauthenticated request to set the following profile information:
    | firstName | lastName | bio              | instruments         | location                                          |
    | Test      | User     | I am a test user | guitar: 5, drums: 3 | friendly: London, long: 55.509865, lat: -0.118092 |
    Then the platform should respond that I am not authorized
