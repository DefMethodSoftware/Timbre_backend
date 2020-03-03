Feature: User authenticates using their existing credentials
  So that Timbre knows who I am
  As a User
  I'd like to be able to authenticate using my existing credentials

  Scenario: User logs in with valid credentials
  Given there is a user in the system with the email "user@user.com" and username "testuser"
  When I send a request to log in with 'user@user.com' and 'password'
  Then the platform should respond that the request was successful
  And the response should contain a valid authentication token
  And the response should contain my user ID
  And the response should confirm my email address

  Scenario: User logs in with invalid password
  Given there is a user in the system with the email "user@user.com" and username "testuser"
  When I send a request to log in with "user@user.com" and "notmypassword"
  Then the platform should respond that the request was bad
  And no email, username or authentication token should have been sent


  Scenario: User logs in with invalid email
  Given there is a user in the system with the email "user@user.com" and username "testuser"
  When I send a request to log in with "notmyuser@user.com" and "password"
  Then the platform should respond that the request was bad
  And no email, username or authentication token should have been sent
