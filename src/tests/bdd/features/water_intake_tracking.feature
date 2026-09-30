Feature: Daily Water Intake Tracking
  As a user tracking hydration
  I want to log each glass of water I drink
  So that I can see my progress and achieve my daily goal

  Scenario: Logging glasses updates consumption and progress
    Given my daily goal is 8 glasses of water
    And I have drunk 0 glasses today
    When I log drinking 1 glass of water at "08:30"
    Then my total consumed water today should be 1 glass
    And my daily hydration progress should be 13 percent

  Scenario: Reaching daily hydration goal
    Given my daily goal is 4 glasses of water
    When I drink 4 glasses throughout the day
    Then my daily goal should be marked as reached
    And my progress should be 100 percent
