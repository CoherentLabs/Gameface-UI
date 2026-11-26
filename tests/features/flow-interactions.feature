Feature: Flow interactions
  Interaction cards and the Graph in Coherent Editor compile to calls of the Flow runtime: event helpers
  (input rows, held, screen shows / hides, game events), steps (go to screen, play sound) and the
  platform and style mode switches the canvas toolbar previews.

  Background:
    Given a screen with input actions confirm, interact, charge, drop, combo, modifier, dash, pick, fire and back
    And rows on them: a screen row, an element row with stopHere, a hold row, a released row, a combo row,
      a double-press row, a raw F1 row, a mouse row on one element and a trigger row with a threshold

  Scenario: Screen shows runs once after the screen mounts
    Then the screen's onScreenShow handler has run once

  Scenario: A screen input row runs on its action's key
    When nothing has focus and the player presses E
    Then the screen's "interact" row runs

  Scenario: An element row runs while its element has focus, and stopHere skips the screen's row
    When the scoped element has focus and the player presses E
    Then only the element's "interact" row runs

  Scenario: onAction on an element runs before the screen's row for the same action
    When a button with onAction confirm has focus and the player presses Enter
    Then the button's handler runs, then the screen's "confirm" row

  Scenario: A hold row runs once the key has been held for its time
    When the player holds H for longer than 1000 ms
    Then the hold progress runs while it is held and resets on release
    And the "charge" row runs once

  Scenario: Releasing a hold before its time runs nothing
    When the player holds H for 300 ms
    Then no row runs

  Scenario: A released row runs on key up
    When the player presses R
    Then the "drop" row runs only when R goes up

  Scenario: A combo beats the plain input
    When the player holds Q and presses C
    Then only the combo row runs
    When the player presses C alone
    Then the plain row runs

  Scenario: A double press beats the single press
    When the player presses D twice within 300 ms
    Then only the double-press row runs
    When the player presses D once
    Then the single row runs after the double-press window

  Scenario: Raw keys run their row
    When the player presses F1
    Then the raw-keys row runs

  Scenario: A mouse row runs on a click on its element only
    When the player clicks another element
    Then no row runs
    When the player clicks the row's element
    Then the "pick" row runs

  Scenario: Held runs once the mouse has been held on the element
    When the player holds the mouse on the element for longer than 1000 ms
    Then the hold progress runs, the Held handler runs, and the progress resets on release

  Scenario: A game event runs its row with the payload
    When the game sends "playerHit" with 25
    Then the row runs with damage 25

  Scenario: An analog trigger row runs only past its threshold
    Given a row on the left trigger with threshold 0.6
    When the player pulls the trigger to 0.55 and releases it
    Then no row runs
    When the player pulls the trigger to 0.8 and releases it
    Then the trigger row runs

  Scenario: Other pressed buttons don't count toward a trigger's threshold
    Given a row on the left trigger with threshold 0.6
    When the player holds A and pulls the trigger to 0.2, then releases both
    Then no row runs

  Scenario: Unbinding the keyboard from an action Navigation already has removes its key
    Given the project defines "back" with Esc, an action Navigation already has
    When the player unbinds the keyboard from "back"
    Then Esc no longer runs the screen's "back" row

  Scenario: Remapping an action moves its row to the player's key
    When the player remaps confirm to F2
    Then Enter no longer runs the "confirm" row and F2 does

  Scenario: The input hint shows the keyboard glyph on PC
    Given the platform is PC
    Then the confirm hint shows the Enter glyph from the PC set

  Scenario: Switching the platform re-binds actions to its buttons and switches the hint's glyphs
    When the platform is switched to Switch
    Then the confirm hint shows the right face button from the Switch set
    And pressing the right face button on a gamepad runs the "confirm" row

  Scenario: The game sets the platform
    When the game sends "platform" with playstation
    Then the confirm hint shows the PlayStation glyph

  Scenario: The game and the canvas toolbar set the style mode on <html>
    When the toolbar sets the style mode "colorblind"
    Then <html> has the class "colorblind"
    When the game sends "style-mode" with "high-contrast"
    Then <html> has "high-contrast" and no longer "colorblind"

  Scenario: Play sound asks the game to play it
    When a Play sound step runs with "buy"
    Then the game gets "play-sound" with "buy"

  Scenario: Go to screen runs the hide handlers, then tells the game
    When a Go to screen step runs with "Settings"
    Then the screen's onScreenHide handler runs
    And the game gets "navigate" with "Settings"

  Scenario: The runtime answers screen-closing with screen-closing-ready
    When the game sends "screen-closing"
    Then the UI answers "screen-closing-ready"
