Feature: User creates an account
  So that I can set up my Timbre profile
  As a User
  I would like to be able to create an account

  Scenario: User sends an account creation request
    When I send a request to create a new user with the following information:
      | email         | username | password |
      | user@user.com | testuser | password |
    Then the platform should respond that the user was created successfully
    And there should be a user in the system with the email "user@user.com" and username "testuser"

  @wip
  Scenario: User tries to create a user with an email that is already taken
    Given there is a user in the system with the email "user@user.com" and username "testuser"
    When I send a request to create a new user with the following information:
      | email         | username    | password |
      | user@user.com | anotheruser | password |
    Then the platform should respond that the email address is taken
    And no email, username or authentication token should have been sent

  @wip
  Scenario: User tries to create a user with a username that is already taken
    Given there is a user in the system with the email "anotheruser@user.com" and username "testuser"
    When I send a request to create a new user with the following information:
      | email         | username    | password |
      | user@user.com | testuser    | password |
    Then the platform should respond that the username is taken
    And no email, username or authentication token should have been sent

  @wip
  Scenario: User tries to create a user without an email
    When I send a request to create a new user with the following information:
      | username    | password |
      | anotheruser | password |
    Then the platform should respond that an email is required
    And no email, username or authentication token should have been sent

  @wip
  Scenario: User tries to create a user without username
    When I send a request to create a new user with the following information:
      | email         | password |
      | user@user.com | password |
    Then the platform should respond that a username is required
    And no email, username or authentication token should have been sent

  @wip
  Scenario: user tries to create a user without a password:
    When I send a request to create a new user with the following information:
      | email         | username    | 
      | user@user.com | anotheruser | 
    Then the platform should respond that a password is required
    And no email, username or authentication token should have been sent