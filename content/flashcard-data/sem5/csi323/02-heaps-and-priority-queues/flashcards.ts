export const flashcardData = [
  { front: "Min-Heap Property", back: "Every parent node is less than or equal to its children. The root is always the minimum element." },
  { front: "Max-Heap Property", back: "Every parent node is greater than or equal to its children. The root is always the maximum element." },
  { front: "Heap Array Formulas (0-indexed)", back: "Left Child: 2i + 1. Right Child: 2i + 2. Parent: floor((i - 1) / 2)." },
  { front: "Heapify-Up (Insert)", back: "Place new element at the end. Compare with parent; if it violates heap property, swap and repeat. Time: O(log N)." },
  { front: "Heapify-Down (Extract)", back: "Replace root with last element. Compare with children; swap with the smallest/largest child if violated. Repeat. Time: O(log N)." },
  { front: "Build Heap Complexity", back: "O(N). By starting heapify-down from the last non-leaf node up to the root, the math converges to linear time, not O(N log N)." },
  { front: "Priority Queue", back: "An abstract data type where elements are dequeued based on priority rather than insertion order. Typically backed by a Binary Heap." },
  { front: "Top-K Elements Pattern", back: "Use a Min-Heap of size K. Iterate array: if heap < K, push. If element > heap.peek(), pop and push. Time: O(N log K)." }
];