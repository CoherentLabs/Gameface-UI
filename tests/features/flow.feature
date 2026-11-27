Feature: Flow runtime
  Screens and components written by Coherent Editor call useFlow with their <Name>.flow.ts:
  states, navigation and overlays, plus the hooks the editor uses for Live states.

  Background:
    Given a screen whose flow has the state groups "Tabs" (Audio, Video) and "Save" (Has save, No save file)
    And "No save file" follows a condition

  Scenario: Focusable settings from the flow apply to the screen's elements
    Then elements marked focusable can take focus
    And an element marked not focusable cannot take focus

  Scenario: The screen focuses its first focus element when it shows
    Then the first focus element of the screen has focus

  Scenario: Elements stay focusable after a state change
    When "Tabs" is switched to "Video", back to "Audio" and to "Video" again
    Then the screen's focusable elements can still take focus after each change

  Scenario: A navigation area that a state mounts joins navigation
    Given the area "extras" exists only in the "Video" state
    When "Tabs" is switched to "Video"
    Then the arrow keys move focus between the elements of "extras"
    And moving focus inside the screen's own area never lands on an element of "extras"

  Scenario: An area with wrap off stops at its edges
    Given the area "list" has wrap off
    When focus is on the last element of "list" and the player presses right
    Then focus stays on that element

  Scenario: Switching to an area focuses its first focus element
    Given the area "list" has a first focus element that isn't its first element
    When the screen's code switches to "list"
    Then the first focus element of "list" has focus

  Scenario: Edge handlers set by the screen survive a state change
    Given the screen's code set an edge handler on the area "side"
    When "Tabs" is switched to "Video", which adds an element to "side"
    And focus is on the last element of "side" and the player presses right
    Then the screen's edge handler runs

  Scenario: Navigation keeps working after the root element is replaced
    Given a screen whose root element is replaced when its state changes
    When the state changes and the new root is mounted
    Then the arrow keys move focus between the new root's elements

  Scenario: A component's state change that shows a focusable element makes it reachable
    Given a component inside the screen whose state shows a focusable element
    When the component switches to that state
    Then the arrow keys can move focus to the new element

  Scenario: A component with its own areas keeps them focusable when a state mounts it
    Given a component with its own navigation area that only "Video" shows
    When "Tabs" is switched to "Video"
    And "Save" changes while "Video" is shown
    Then the arrow keys move focus between the elements of the component's area

  Scenario: State groups start in their initial states
    Then "Tabs" is "Audio"
    And "Save" is "Has save"

  Scenario: Switching a state puts its modifier class on the root
    When "Tabs" is switched to "Video"
    Then the root has the class "tabs--video"
    When "Tabs" is switched to "Audio"
    Then the root no longer has the class "tabs--video"

  Scenario: Elements that exist only in a state mount when it becomes active
    When "Tabs" is switched to "Video"
    Then the elements shown only in "Video" are mounted
    And the "Video" enter handler has run once

  Scenario: Data bindings fill on elements a state change mounts
    Given a data model value bound inside the "Video" state
    When "Tabs" is switched to "Video"
    Then the bound element shows the model value

  Scenario: A state that follows a condition can't be set directly
    When the code tries to switch "Save" to "No save file"
    Then "Save" stays "Has save"
    When the condition becomes true
    Then "Save" is "No save file" and the root has the class "save--no-save-file"
    When the condition becomes false
    Then "Save" is "Has save"

  Scenario: Code outside Solid finds a state group from an element
    When "Tabs" is switched to "Video" through stateOf on the root element
    Then "Tabs" is "Video"

  Scenario: An overlay opens on top and returns the value it closes with
    When the screen opens the overlay "Confirm"
    Then the overlay is mounted in a portal owned by the screen's root
    And the overlay's first focus element has focus
    When the overlay is closed with "yes"
    Then the screen receives "yes" and the overlay is removed

  Scenario: Focus returns to the opener when an overlay closes
    Given an element of the screen has focus
    When the screen opens the overlay "Confirm"
    And the overlay is closed with "yes"
    Then the element that had focus before has it again

  Scenario: Back closes an overlay opened with closeOnBack
    When the screen opens the overlay "Confirm" with closeOnBack
    And the player presses Back
    Then the overlay is removed and the screen receives no value

  Scenario: An overlay without its own flow doesn't take the screen's navigation settings
    Given the screen's first focus id also exists inside the overlay "Plain"
    When the screen opens "Plain"
    Then focus is on the overlay's first element, not on that id

  Scenario: The editor sets and reads a state through the dev hooks
    When the editor sets "Tabs" to "Video" through window.__gfFlows for the screen's file
    Then "Tabs" is "Video"
    And reading "Tabs" through window.__gfFlows returns "Video"

  Scenario: A state the editor forces wins until the next change
    When the editor forces "Save" to "No save file"
    Then "Save" is "No save file"
    When the condition changes
    Then "Save" follows the condition again

  Scenario: State changes are reported to the editor except the ones it forced
    Given the editor listens through window.__gfStateChanged
    When the screen switches "Tabs" to "Video"
    And the editor forces "Tabs" to "Audio"
    Then the editor was told only about the switch to "Video"

  Scenario: The editor opens and closes overlays through the dev hooks
    When the editor opens "Confirm" through window.__gfFlows
    Then the overlay is mounted
    When the editor closes it through window.__gfFlows
    Then the overlay is removed
