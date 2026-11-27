Feature: Spawner

  Scenario: Spawning from an effect does not re-run the effect when items hide
    Given a Spawner with a max of 5
    And an effect that spawns one item with a life when a signal changes
    When the signal changes once
    Then exactly one item is spawned

  Scenario: Show hooks registered after the template mounts run on the first show
    Given a template that registers a show hook from onMount
    When an item is spawned
    Then the show hook has run once

  Scenario: Saved item entries keep their data after their element is reused
    Given a Spawner with a pool of 1
    And an entry taken from items() for item A
    When A is removed and B is spawned
    Then the saved entry still reads A's data

  Scenario: Shrinking the pool frees idle elements
    Given a Spawner with a pool of 3 and three idle elements
    When the pool is set to 1
    Then one idle element is left

  Scenario: A pool of 0 does not reuse idle elements
    Given a Spawner with a pool of 3 and three idle elements
    When the pool is set to 0 and an item is spawned
    Then no idle element is left and the item has a new element

  Scenario: A cut-short CSS exit leaves no animation listeners behind
    Given a Spawner with a pool of 1, a 1 s exit animation and a hideTimeout of 100 ms
    When five items are spawned and removed one after another
    Then every animationend listener that was added has been removed

  # Reproduces only in a dev-server view in the Player, not on the built e2e page, so it is checked by hand
  @manual
  Scenario: An item hidden right after it shows is removed when its exit animation ends
    Given a template with a 400 ms show animation that a 300 ms exit animation replaces
    When an item is removed one frame after it is spawned
    Then the item is removed when its exit animation ends, not after hideTimeout
