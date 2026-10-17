export const quizData = [
  { question: "How do you reach the third node in a singly linked list?", options: ["Follow next references from head", "Calculate a contiguous memory offset", "Use binary search", "Hash the index"], correctIndex: 0, explanation: "Linked nodes do not provide constant-time index calculation." },
  { question: "What does an empty list's head normally contain?", options: ["null", "0", "A tail node", "The list size"], correctIndex: 0, explanation: "No first node exists." },
  { question: "What must addFirst preserve before replacing head?", options: ["A link to the old head", "Every node's address in an array", "A sorted hash", "The current index"], correctIndex: 0, explanation: "The new node's next must refer to the former first node." },
  { question: "Deleting a middle node means…", options: ["The previous node bypasses it and links to its next", "Its data becomes zero only", "Every node shifts in memory", "Head always becomes null"], correctIndex: 0, explanation: "Changing the previous link removes the target from the reachable chain." },
  { question: "Singly linked get(index) is…", options: ["O(N) in the worst case", "O(1) always", "O(log N)", "O(N²)"], correctIndex: 0, explanation: "Traversal begins at head and follows links." },
  { question: "What extra link does a doubly linked node store?", options: ["A previous reference", "A hash table", "An array index", "A queue size"], correctIndex: 0, explanation: "Previous and next allow movement in both directions." }
];
