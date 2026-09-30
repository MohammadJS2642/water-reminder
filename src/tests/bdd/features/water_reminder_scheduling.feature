Feature: Water Reminder Scheduling
  As a health-conscious user
  I want to specify how many glasses of water I need daily and my waking hours
  So that the app distributes notifications evenly across my day

  Scenario: Schedule 8 glasses between 08:00 and 22:00
    Given I want to drink 8 glasses of water daily
    And my waking hours are from "08:00" to "22:00"
    When I save my reminder schedule
    Then 8 reminder notifications should be scheduled
    And the reminders should occur at intervals of 120 minutes starting at "08:00" and ending at "22:00"

  Scenario: User disables water reminder notifications
    Given I have a daily target of 6 glasses between "09:00" and "19:00"
    When I disable notifications and save my schedule
    Then no reminder notifications should be active on my device

  Scenario: Prevent invalid time window where end time precedes start time
    Given my start time is "20:00"
    And my end time is "08:00"
    When I attempt to calculate or save the schedule
    Then the app should reject the schedule with a validation error
