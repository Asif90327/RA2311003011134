# Notification System Design

## Objective

The goal is to display the top 10 notifications based on their importance and time.

## Priority Logic

Notifications are ranked in the following order:

* Placement (highest)
* Event
* Result (lowest)

## Approach

1. Fetch notifications from the API.
2. Assign a priority value to each type.
3. Sort the notifications:

   * First by priority
   * Then by timestamp (latest first)
4. Select the first 10 notifications from the sorted list.

## Optimization (Stage 2)

Instead of sorting the entire list every time, a better approach is used:

* Maintain only the top 10 notifications using a Min Heap.
* When a new notification comes:

  * Add it to the heap
  * If size exceeds 10, remove the lowest priority item

## Complexity

* Sorting approach: O(n log n)
* Heap approach: O(n log k), where k = 10

## Conclusion

The system first uses sorting for simplicity.
Then it improves performance by using a heap to efficiently maintain the top notifications.
