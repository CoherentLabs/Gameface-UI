Feature: VirtualList

  Scenario: Changing one item of an unkeyed list updates only that row
    Given an unkeyed VirtualList showing 5 rows
    When one item of the list is replaced
    Then only that row's item is recomputed

  Scenario: Moving the page through the ref reports the new start index
    Given a VirtualList whose startIndex and pageSize are bound to signals that onStartIndexChange and onPageSizeChange write back to
    When the page is moved with nextPage
    Then the bound start index holds the new value
    And setting the binding back to its old value moves the list back

  Scenario: Growing the page size keeps the shown rows and adds rows after them
    Given a VirtualList showing items 2 to 4
    When the page size grows to 5
    Then items 2 to 6 are shown and the rows of items 2 to 4 are kept

  Scenario: Shrinking the page size removes rows from the end only
    Given a VirtualList showing items 2 to 4
    When the page size shrinks to 2
    Then items 2 and 3 are shown with their rows kept

  Scenario: Jumping to a page with no overlap replaces every row
    Given a VirtualList showing items 2 to 4
    When the start index is set to 7
    Then items 7 to 9 are shown, each in a new row

  Scenario: Moving the start index back by 1 keeps the rows still on the page
    Given a keyed and an unkeyed VirtualList showing items 2 to 4
    When the start index moves back to 1
    Then items 1 to 3 are shown, the rows of items 2 and 3 are kept and item 1 gets a new row

  Scenario: Inserting an item before the page shifts the shown items, and rows follow their items
    Given a keyed VirtualList showing items 2 to 4
    When an item is inserted at the start of the list
    Then items 1 to 3 are shown, items 2 and 3 keep their rows and item 1 gets a new row

  Scenario: Removing an item on the page brings in the next item
    Given a keyed VirtualList showing items 2 to 4
    When item 3 is removed from the list
    Then items 2, 4 and 5 are shown, items 2 and 4 keep their rows and item 5 gets a new row

  Scenario: Unkeyed: moving the start index by 1 keeps the rows whose index stays on the page
    Given an unkeyed VirtualList showing indexes 2 to 4
    When the start index moves to 3
    Then the rows at indexes 3 and 4 are kept and index 5 gets a new row

  Scenario: Shrinking the list below the start index renders no rows
    Given a VirtualList with start index 2
    When the list shrinks to 2 items
    Then no rows are rendered and the fallback is not shown
