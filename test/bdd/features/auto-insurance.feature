# Docs: https://cucumber.io/docs/guides/10-minute-tutorial/
# NestJs example: https://github.com/DavidMoura07/nest-cucumber

Feature: What is my ideal auto insurance plan?
  I, as a customer, whant to know what is my ideal auto insurance plan
  based on my personal information

  Scenario: I'm ineligible for an auto insurance plan
    Given I don't hava a car
    When I ask for my auto insurance plan
    Then I should be told "ineligible"

  Scenario: My ideal plan is economic because of I'm under 30 years old
    Given I'm under 30 years old
    When I ask for my auto insurance plan
    Then I should be told "economic"