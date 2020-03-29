Feature: User creates an account
  So that I can set up my Timbre profile
  As a User
  I would like to be able to create an account

  Scenario: User sends an account creation request
    When I send a request to create the following user:
      | email         | username | password |
      | user@user.com | testuser | password |
    Then the platform should respond that the creation was successful
    And the response should contain an authentication token
    And there should be a user in the system with the email "user@user.com" and username "testuser"
    And the response should contain a user ID


  Scenario: User tries to create a user with an email that is already taken
    Given there is a user in the system with the email "user@user.com" and username "testuser"
    When I send a request to create the following user:
      | email         | username    | password |
      | user@user.com | anotheruser | password |
    Then the platform should respond that the request was bad
    And no email, username or authentication token should have been sent

  Scenario: User tries to create a user with a username that is already taken
    Given there is a user in the system with the email "anotheruser@user.com" and username "testuser"
    When I send a request to create the following user:
      | email         | username    | password |
      | user@user.com | testuser    | password |
    Then the platform should respond that the request was bad
    And no email, username or authentication token should have been sent

  Scenario: User tries to create a with an invalid email
    When I send a request to create the following user:
      | email         | username    | password |
      | user1user.com | testuser    | password |
    Then the platform should respond that the request was bad
    And no email, username or authentication token should have been sent

  Scenario: User tries to create a with an invalid email
    When I send a request to create the following user:
      | email         | username    | password |
      | user@usercom | testuser    | password |
    Then the platform should respond that the request was bad
    And no email, username or authentication token should have been sent

  Scenario: User tries to create a user without an email
    When I send a request to create the following user:
      | username    | password |
      | anotheruser | password |
    Then the platform should respond that the request was bad
    And no email, username or authentication token should have been sent

  Scenario: User tries to create a user without username
    When I send a request to create the following user:
      | email         | password |
      | user@user.com | password |
    Then the platform should respond that the request was bad
    And no email, username or authentication token should have been sent

  Scenario: user tries to create a user without a password:
    When I send a request to create the following user:
      | email         | username    | 
      | user@user.com | anotheruser | 
    Then the platform should respond that the request was bad
    And no email, username or authentication token should have been sent