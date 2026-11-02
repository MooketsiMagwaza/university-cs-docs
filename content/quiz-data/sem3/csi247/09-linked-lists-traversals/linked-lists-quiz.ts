export const quizData = [
  {
    "group": "Nodes and traversal",
    "question": "How do you reach the third node in a singly linked list?",
    "options": [
      "Follow next references from head",
      "Calculate a contiguous memory offset",
      "Use binary search",
      "Hash the index"
    ],
    "correctIndex": 0,
    "explanation": "Linked nodes do not provide constant-time index calculation.",
    "optionFeedback": [
      "Correct. There is no index calculation: you follow the next references one at a time.",
      "Nodes are not stored next to each other, so there is no offset to calculate.",
      "Binary search needs direct access, which a linked list does not have.",
      "A linked list uses references, not a hash of the index."
    ]
  },
  {
    "group": "Nodes and traversal",
    "question": "What does an empty list's head normally contain?",
    "options": [
      "null",
      "0",
      "A tail node",
      "The list size"
    ],
    "correctIndex": 0,
    "explanation": "No first node exists.",
    "optionFeedback": [
      "Correct. head is null when there is no first node.",
      "head holds a reference, not a count or a value.",
      "There is no tail node in an empty list.",
      "The size is not stored in head."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "What must addFirst preserve before replacing head?",
    "options": [
      "A link to the old head",
      "Every node's address in an array",
      "A sorted hash",
      "The current index"
    ],
    "correctIndex": 0,
    "explanation": "The new node's next must refer to the former first node.",
    "optionFeedback": [
      "Correct. The new node's next must refer to the former first node.",
      "There is no array of node addresses.",
      "There is no hash in a singly linked list.",
      "A linked list has no stored index."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "Deleting a middle node means…",
    "options": [
      "The previous node bypasses it and links to its next",
      "Its data becomes zero only",
      "Every node shifts in memory",
      "Head always becomes null"
    ],
    "correctIndex": 0,
    "explanation": "Changing the previous link removes the target from the reachable chain.",
    "optionFeedback": [
      "Correct. Changing the previous node's link removes the target from the reachable chain.",
      "Setting the data to zero leaves the node in the list.",
      "Nodes are not stored contiguously, so nothing is shifted in memory.",
      "head changes only when the first node is removed."
    ]
  },
  {
    "group": "Cost",
    "question": "Singly linked get(index) is…",
    "options": [
      "O(N) in the worst case",
      "O(1) always",
      "O(log N)",
      "O(N²)"
    ],
    "correctIndex": 0,
    "explanation": "Traversal begins at head and follows links.",
    "optionFeedback": [
      "Correct. The traversal starts at head and follows links.",
      "O(1) would need direct access, which a linked list does not have.",
      "O(log N) needs a halving structure.",
      "One walk through the list is linear, not quadratic."
    ]
  },
  {
    "group": "Types of list",
    "question": "What extra link does a doubly linked node store?",
    "options": [
      "A previous reference",
      "A hash table",
      "An array index",
      "A queue size"
    ],
    "correctIndex": 0,
    "explanation": "Previous and next allow movement in both directions.",
    "optionFeedback": [
      "Correct. prev and next allow movement in both directions.",
      "A hash table is a different structure.",
      "Nodes are not stored in an array.",
      "A queue size is not a node field."
    ]
  },
  {
    "group": "Nodes and traversal",
    "question": "What is head in a linked list?",
    "options": [
      "The first node itself",
      "A reference to the first node, or null when the list is empty",
      "The last node",
      "The number of nodes"
    ],
    "correctIndex": 1,
    "explanation": "head is not a separate node: it is a reference to the first node. In an empty list it is null.",
    "optionFeedback": [
      "The node is an object on the heap; head only holds its address.",
      "Correct.",
      "The last node is the one whose next is null; there is no tail field in the lecture's class.",
      "The size is a different value."
    ]
  },
  {
    "group": "Nodes and traversal",
    "question": "The lecture's contains uses while (tmp.next != null). For the list 6, 3, 9, what does contains(9) return?",
    "code": "public boolean contains(int data) {\n    Node tmp = head;\n    while (tmp.next != null) {\n        if (tmp.data == data)\n            return true;\n        tmp = tmp.next;\n    }\n    return false;\n}",
    "options": [
      "true",
      "false",
      "It throws NullPointerException",
      "It does not compile"
    ],
    "correctIndex": 1,
    "explanation": "The loop stops when tmp is the last node, before that node's data is compared, so 9 is never found. The loop must be while (tmp != null).",
    "optionFeedback": [
      "9 is in the last node, which this loop never compares.",
      "Correct. The condition tmp.next != null is false on the last node.",
      "The list is not empty, so tmp is not null; the exception happens only for an empty list.",
      "The method compiles; the fault is in what it does."
    ]
  },
  {
    "group": "Nodes and traversal",
    "question": "What does size() return for an empty list that is traversed with while (cur != null)?",
    "options": [
      "-1",
      "0",
      "1",
      "It throws NullPointerException"
    ],
    "correctIndex": 1,
    "explanation": "cur starts as head, which is null, so the loop body never runs and the count stays 0.",
    "optionFeedback": [
      "A count never starts at -1.",
      "Correct.",
      "There is no node to count.",
      "The condition tests cur, so no null is dereferenced."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "How many pointer moves does addLast make for a list of 5 nodes when only head is kept?",
    "options": [
      "0",
      "1",
      "4",
      "5"
    ],
    "correctIndex": 2,
    "explanation": "currNode starts on the first node and moves until it is on the fifth: n - 1 = 4 moves. Then one assignment links the new node.",
    "optionFeedback": [
      "0 moves is addFront.",
      "Only a list of two nodes needs one move.",
      "Correct. n - 1.",
      "currNode is already on the first node, so one move fewer than n."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "Which two assignments add a node n at the front, in the right order?",
    "options": [
      "head = n; then n.next = head;",
      "n.next = head; then head = n;",
      "head.next = n; then head = n;",
      "n.next = null; then head = n;"
    ],
    "correctIndex": 1,
    "explanation": "The new node must point at the old first node before head moves. Done the other way round, n.next would point at n itself and the old list would be lost.",
    "optionFeedback": [
      "After head = n, the second line sets n.next to n: the old list is lost.",
      "Correct.",
      "head.next = n would change the old first node, not the new one.",
      "n.next = null leaves the new node without the old list."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "On the list 6, 3, 9, 7, removeFront() is called and then removeLast(). What is left?",
    "options": [
      "[3, 9]",
      "[6, 3, 9]",
      "[3, 9, 7]",
      "[9]"
    ],
    "correctIndex": 0,
    "explanation": "removeFront leaves 3, 9, 7; removeLast then removes the 7. The list is [3, 9].",
    "optionFeedback": [
      "Correct.",
      "That is the list after removeLast only.",
      "That is the list after removeFront only.",
      "Two nodes are removed, not three."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "add(5, 7) is called on a list of 3 nodes. What happens?",
    "options": [
      "7 is added at the end",
      "7 is added at the front",
      "An IndexOutOfBoundsException is thrown (Index: 5, Size: 3)",
      "Nothing happens and no message is shown"
    ],
    "correctIndex": 2,
    "explanation": "The position is beyond the end of the list, so the walk reaches null before the position. The library LinkedList also throws IndexOutOfBoundsException for an index that does not exist.",
    "optionFeedback": [
      "Only an index equal to the size adds at the end.",
      "Only index 0 adds at the front.",
      "Correct.",
      "A bad index is an error, not something to ignore."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "The lecture's removeLast is called on a list of one node (after its missing braces are added). What happens?",
    "code": "public void removeLast() {\n    if (!isEmpty()) {\n        Node cur = head;\n        while (cur.next.next != null) {\n            cur = cur.next;\n        }\n        cur.next = null;\n    }\n}",
    "options": [
      "The list becomes empty",
      "NullPointerException",
      "The node is not removed and nothing happens",
      "It does not compile"
    ],
    "correctIndex": 1,
    "explanation": "cur is the only node and cur.next is null, so cur.next.next throws NullPointerException. A list of one node must be handled first: head = null.",
    "optionFeedback": [
      "That is what a correct version does; this version fails first.",
      "Correct. cur.next.next dereferences null.",
      "The loop condition is evaluated before anything can be skipped.",
      "Once the braces are added it compiles."
    ]
  },
  {
    "group": "Adding and removing",
    "question": "What does javac say about the lecture's removeLast as printed, where if (!isEmpty()) is followed directly by Node cur = head; ?",
    "options": [
      "error: variable declaration not allowed here",
      "error: missing return statement",
      "error: cannot find symbol",
      "It compiles with a warning"
    ],
    "correctIndex": 0,
    "explanation": "A declaration cannot be the only statement of an if. Adding braces around the body fixes this error.",
    "optionFeedback": [
      "Correct.",
      "The method is void and has no missing return.",
      "Node and head exist; the fault is the position of the declaration.",
      "It is a compile error, not a warning."
    ]
  },
  {
    "group": "Cost",
    "question": "Which of these methods of the lecture's list is O(1)?",
    "options": [
      "addLast",
      "removeLast",
      "addFront",
      "size"
    ],
    "correctIndex": 2,
    "explanation": "addFront makes two assignments and follows no pointer. The other three walk the list.",
    "optionFeedback": [
      "addLast walks to the tail: n - 1 moves.",
      "removeLast walks to the second-last node: n - 2 moves.",
      "Correct.",
      "size counts every node."
    ]
  },
  {
    "group": "Cost",
    "question": "contains is called with a key that is not in a list of 5 nodes. How many next pointers are followed?",
    "options": [
      "0",
      "1",
      "4",
      "5"
    ],
    "correctIndex": 3,
    "explanation": "The loop follows a pointer after each of the 5 comparisons and ends when tmp becomes null: 5 moves. A key in the first node needs 0.",
    "optionFeedback": [
      "0 moves is the best case, a key in the first node.",
      "One move would stop after the second node.",
      "4 would be a key in the last node (found before the last move).",
      "Correct. The whole list is searched."
    ]
  },
  {
    "group": "Types of list",
    "question": "What is different about the last node of a circular linked list?",
    "options": [
      "Its data is 0",
      "Its link points to the first node instead of being null",
      "It has no link",
      "It has two links"
    ],
    "correctIndex": 1,
    "explanation": "In a circular list the last node links back to the first, so following next never reaches null.",
    "optionFeedback": [
      "The data is an ordinary value.",
      "Correct.",
      "Every node has a link; in a singly linked list the last one is null.",
      "Two links per node is a doubly linked list."
    ]
  },
  {
    "group": "Cost",
    "question": "After a = a.next in the code below, which node is garbage?",
    "code": "Node a = new Node(4);\na.next = new Node(8);\nNode b = a.next;\nb.next = new Node(2);\na = a.next;",
    "options": [
      "The node with data 8",
      "The node with data 4",
      "The node with data 2",
      "None of them"
    ],
    "correctIndex": 1,
    "explanation": "a no longer holds the address of the 4 node, and no next field does, so it is unreachable. a and b both hold the 8 node, and the 8 node points at the 2 node.",
    "optionFeedback": [
      "a and b still hold the 8 node.",
      "Correct.",
      "The 8 node's next still points at the 2 node.",
      "The first node lost its only reference."
    ]
  }
];
