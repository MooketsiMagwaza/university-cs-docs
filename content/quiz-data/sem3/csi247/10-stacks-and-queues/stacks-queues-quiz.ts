export const quizData = [
  {
    "group": "Rules",
    "question": "Which removal rule defines a stack?",
    "options": [
      "Last in, first out",
      "First in, first out",
      "Smallest first",
      "Random first"
    ],
    "correctIndex": 0,
    "explanation": "The newest item is at the top and leaves first.",
    "optionFeedback": [
      "Correct. The newest item is at the top and leaves first.",
      "First in, first out is a queue.",
      "A stack does not order by size.",
      "Removal is never random."
    ]
  },
  {
    "group": "Rules",
    "question": "Which removal rule defines a basic queue?",
    "options": [
      "First in, first out",
      "Last in, first out",
      "Largest first",
      "Newest first"
    ],
    "correctIndex": 0,
    "explanation": "The earliest arrival is removed from the front.",
    "optionFeedback": [
      "Correct. The earliest arrival is removed from the front.",
      "Last in, first out is a stack.",
      "A basic queue does not order by size.",
      "The newest item is at the tail, not the front."
    ]
  },
  {
    "group": "Array stack",
    "question": "If top starts at -1, when is an array stack empty?",
    "options": [
      "top == -1",
      "top == 0",
      "top == capacity",
      "top == 1"
    ],
    "correctIndex": 0,
    "explanation": "No valid array index is currently occupied.",
    "optionFeedback": [
      "Correct. top is the index of the top element; -1 means none.",
      "top == 0 means there is one element, at index 0.",
      "top == capacity would be past the last index.",
      "top == 1 means two elements."
    ]
  },
  {
    "group": "Applications",
    "question": "Which structure naturally checks nested brackets?",
    "options": [
      "Stack",
      "FIFO queue",
      "Hash map only",
      "Binary search tree"
    ],
    "correctIndex": 0,
    "explanation": "The most recent unmatched opener must be checked first.",
    "optionFeedback": [
      "Correct. The most recent unmatched opener must be checked first.",
      "A queue would check the oldest opener first.",
      "A map has no order of arrival.",
      "A tree is not needed for this."
    ]
  },
  {
    "group": "Array stack",
    "question": "What is underflow?",
    "options": [
      "Removing from an empty structure",
      "Adding to available capacity",
      "A hash collision",
      "A sorted array"
    ],
    "correctIndex": 0,
    "explanation": "No element exists to return.",
    "optionFeedback": [
      "Correct. No element exists to return.",
      "Adding when there is room is normal.",
      "A collision belongs to a different structure.",
      "Sorting is unrelated."
    ]
  },
  {
    "group": "Rules",
    "question": "On an empty stack: push(14), push(39), push(26), pop(), push(28), push(17), pop(), pop(), push(87), pop(). In what order are the values popped?",
    "options": [
      "26, 17, 28, 87",
      "14, 39, 26, 28",
      "87, 17, 28, 26",
      "26, 28, 17, 87"
    ],
    "correctIndex": 0,
    "explanation": "Each pop takes the newest element at that moment: 26, then 17, then 28, then 87. Two elements (14 and 39) are left and 39 is popped next.",
    "optionFeedback": [
      "Correct.",
      "That is the order of the first pushes, which is not what pop returns.",
      "That reverses the whole list; only consecutive pops are in reverse order.",
      "After push(28) and push(17), the first pop returns 17, not 28."
    ]
  },
  {
    "group": "Rules",
    "question": "On an empty queue: enqueue(52), enqueue(96), enqueue(63), dequeue(), enqueue(28), enqueue(86), dequeue(), enqueue(69), dequeue(). What is in front and what is at the tail at the end?",
    "options": [
      "front 28, tail 69",
      "front 52, tail 69",
      "front 63, tail 86",
      "front 28, tail 86"
    ],
    "correctIndex": 0,
    "explanation": "The three dequeues remove 52, 96 and 63. The queue is then 28, 86, 69: three elements, with 28 in front and 69 at the tail.",
    "optionFeedback": [
      "Correct.",
      "52 was the first value dequeued.",
      "63 was dequeued by the third dequeue.",
      "69 was enqueued last, so it is the tail."
    ]
  },
  {
    "group": "Rules",
    "question": "The same operations are applied to a stack and a queue: add 5, 12, 7; remove; remove; add 3; remove. What is removed last from each?",
    "options": [
      "stack: 3, queue: 7",
      "stack: 7, queue: 3",
      "stack: 3, queue: 3",
      "stack: 12, queue: 12"
    ],
    "correctIndex": 0,
    "explanation": "The stack removes 7, 12 and then 3 (the newest each time); the queue removes 5, 12 and then 7 (the oldest each time).",
    "optionFeedback": [
      "Correct.",
      "That swaps the two rules.",
      "3 is the newest element, so only the stack removes it.",
      "12 is removed by the second removal in both structures."
    ]
  },
  {
    "group": "Array stack",
    "question": "What is the value of top when an array stack of capacity 5 is full?",
    "options": [
      "4",
      "5",
      "0",
      "-1"
    ],
    "correctIndex": 0,
    "explanation": "top is an index, so the stack is full when top is the last index, N - 1 = 4. top = 5 would be an overflow.",
    "optionFeedback": [
      "Correct.",
      "5 is past the last index: overflow.",
      "0 is one element.",
      "-1 is an empty stack."
    ]
  },
  {
    "group": "Array stack",
    "question": "A stack of capacity 5 is full. What does the lecture's push(90) do?",
    "options": [
      "It prints \"Stack Overflow! Can not insert...\" and returns false",
      "It throws ArrayIndexOutOfBoundsException",
      "It overwrites the top element",
      "It grows the array"
    ],
    "correctIndex": 0,
    "explanation": "push calls isFull() first, so nothing is stored and top does not change. Without the check, stack[++top] would use index 5.",
    "optionFeedback": [
      "Correct.",
      "The check prevents the exception; without the check it would happen.",
      "The top element is unchanged.",
      "The lecture's array has a fixed size."
    ]
  },
  {
    "group": "Array stack",
    "question": "pop() returns stack[top--]. After pop() on a stack holding 27, 38, 92 (top at 92), what happens to the slot that held 92?",
    "options": [
      "It still holds 92, but it is above top so it is no longer part of the stack",
      "It is set to null",
      "It is set to 0",
      "It is deleted and the array shrinks"
    ],
    "correctIndex": 0,
    "explanation": "pop only lowers top. Every method ignores the slots above top, and the next push overwrites the stale value.",
    "optionFeedback": [
      "Correct.",
      "The lecture's pop does not clear the slot.",
      "No value is written by pop.",
      "An array cannot shrink."
    ]
  },
  {
    "group": "Array stack",
    "question": "The stack 10, 20, 30, 20 (top at the right) is searched for 20 by the lecture's search, which starts at the top. What does it return?",
    "options": [
      "3",
      "1",
      "0",
      "-1"
    ],
    "correctIndex": 0,
    "explanation": "search starts at the top and returns the array index of the first match it meets, index 3. The 20 at index 1 is never reached.",
    "optionFeedback": [
      "Correct.",
      "Index 1 is the lower 20, which the search never reaches.",
      "Index 0 holds 10.",
      "-1 means not found, but 20 is present."
    ]
  },
  {
    "group": "Array stack",
    "question": "What does javac report for the lecture's search, where \"if ( key.equals(stack[i])\" has no closing bracket?",
    "options": [
      "error: ')' expected",
      "error: cannot find symbol",
      "error: missing return statement",
      "It compiles"
    ],
    "correctIndex": 0,
    "explanation": "The condition of the if is not closed. Closing it and putting ind = i; break; in braces repairs the loop.",
    "optionFeedback": [
      "Correct.",
      "The names exist; the bracket is missing.",
      "The method does return ind.",
      "Missing brackets are syntax errors."
    ]
  },
  {
    "group": "Linked structures",
    "question": "In the linked stack, push adds the new node:",
    "options": [
      "at the front of the list, then top moves to it",
      "at the end of the list",
      "in the middle",
      "by shifting every node"
    ],
    "correctIndex": 0,
    "explanation": "The new node points at the old top and becomes the top. This is adding a node in front of a linked list: no walking.",
    "optionFeedback": [
      "Correct.",
      "The end would need a walk, and the top is at the front.",
      "Nodes are never placed in the middle of a stack.",
      "Nothing is shifted in a linked structure."
    ]
  },
  {
    "group": "Linked structures",
    "question": "Why does a linked stack need no isFull() method?",
    "options": [
      "It has no fixed capacity: it grows and shrinks dynamically",
      "It can never be empty",
      "It uses an array",
      "Pushing is not allowed"
    ],
    "correctIndex": 0,
    "explanation": "Each push creates a node, so the only limit is memory. The cost is an extra node for each element.",
    "optionFeedback": [
      "Correct.",
      "A linked stack is empty when top is null.",
      "It uses nodes, not an array.",
      "Pushing is its main operation."
    ]
  },
  {
    "group": "Linked structures",
    "question": "What must the first enqueue on an empty linked queue do?",
    "options": [
      "Set both front and tail to the new node",
      "Set only tail",
      "Set only front",
      "Set neither and wait for the second enqueue"
    ],
    "correctIndex": 0,
    "explanation": "With one node, that node is the front and the tail. If only tail were set the queue would still look empty, and oldTail.next would fail on null.",
    "optionFeedback": [
      "Correct.",
      "front would stay null, so isEmpty() would stay true.",
      "tail would stay null, and the next enqueue would fail.",
      "The queue must be usable after one enqueue."
    ]
  },
  {
    "group": "Linked structures",
    "question": "Why does the lecture's dequeue set tail = null when the queue becomes empty?",
    "options": [
      "Otherwise tail would still refer to the removed node",
      "To free the array",
      "Because front is always null",
      "It does not need to"
    ],
    "correctIndex": 0,
    "explanation": "When the last node is removed, front becomes null. tail must agree, or getTail() would return data from an empty queue.",
    "optionFeedback": [
      "Correct.",
      "A linked queue has no array.",
      "front is null only when the queue is empty.",
      "It does need to, in the one-node case."
    ]
  },
  {
    "group": "Linked structures",
    "question": "What does javac report for the lecture's dequeue, where String data is declared inside the if block and return data; comes after the block?",
    "options": [
      "error: cannot find symbol (variable data)",
      "error: ')' expected",
      "error: incompatible types",
      "It compiles"
    ],
    "correctIndex": 0,
    "explanation": "A variable declared in a block exists only inside that block. Return inside the block and return null for the empty queue.",
    "optionFeedback": [
      "Correct.",
      "The brackets are balanced.",
      "The types are right; the name is out of scope.",
      "Scope errors are compile errors."
    ]
  },
  {
    "group": "Array queue",
    "question": "An array queue of capacity 6 is empty. After enqueue(\"26\"), enqueue(\"69\"), enqueue(\"48\"), dequeue() and dequeue(), what are front, tail and size()?",
    "options": [
      "front 2, tail 2, size 1",
      "front 0, tail 2, size 3",
      "front 1, tail 2, size 2",
      "front 2, tail 5, size 4"
    ],
    "correctIndex": 0,
    "explanation": "The enqueues give front 0, tail 2. Each dequeue moves front forwards, so front is 2. size() is tail - front + 1 = 1.",
    "optionFeedback": [
      "Correct.",
      "That is the state before the two dequeues.",
      "That is the state after only one dequeue.",
      "tail does not move on a dequeue."
    ]
  },
  {
    "group": "Array queue",
    "question": "In an array queue of capacity 4 holding A, B, C, D, A is dequeued and enqueue(\"E\") is called. What happens with the lecture's code?",
    "options": [
      "ArrayIndexOutOfBoundsException, because tail is already the last index",
      "E is stored in slot 0",
      "Full!! is printed",
      "E is stored and tail wraps to 0"
    ],
    "correctIndex": 0,
    "explanation": "isFull() compares the size (3) with the length (4), so it allows the enqueue. But tail++ makes tail 4, outside the array. Slot 0 is free but unreachable.",
    "optionFeedback": [
      "Correct.",
      "The lecture's queue is not circular; tail never wraps.",
      "isFull() is false because only 3 elements are held.",
      "Wrapping is what a circular queue does, not this design."
    ]
  },
  {
    "group": "Array queue",
    "question": "What is size() of an array queue with front = 3 and tail = 2?",
    "options": [
      "0",
      "1",
      "2",
      "-1"
    ],
    "correctIndex": 0,
    "explanation": "size() is tail - front + 1 = 0. front is one past tail, so the queue has been emptied.",
    "optionFeedback": [
      "Correct.",
      "That would be front = tail.",
      "The result is not 2.",
      "A size is never negative here."
    ]
  },
  {
    "group": "Java collections",
    "question": "Queue<String> q = new Queue<String>(); What is wrong?",
    "options": [
      "Queue is an interface, so it cannot be instantiated; use a class such as LinkedList",
      "Queue needs two type parameters",
      "Queue must be imported from java.io",
      "Nothing is wrong"
    ],
    "correctIndex": 0,
    "explanation": "Queue<E> is an interface in java.util that extends Collection<E>. Create an object of a class that implements it: LinkedList, PriorityQueue or ArrayDeque.",
    "optionFeedback": [
      "Correct.",
      "Queue takes one type parameter, E.",
      "It is in java.util.",
      "new on an interface does not compile."
    ]
  },
  {
    "group": "Java collections",
    "question": "What do remove() and peek() do on an empty java.util.Queue?",
    "options": [
      "remove() throws NoSuchElementException; peek() returns null",
      "Both return null",
      "Both throw an exception",
      "remove() returns null; peek() throws an exception"
    ],
    "correctIndex": 0,
    "explanation": "remove() must return the removed element, so it reports the error with an exception; peek() only looks at the front and returns null when there is none.",
    "optionFeedback": [
      "Correct.",
      "remove() does not return null on an empty queue.",
      "peek() does not throw.",
      "This reverses the two methods."
    ]
  },
  {
    "group": "Java collections",
    "question": "Integers 40, 10, 30, 20 are added to a PriorityQueue in that order and then removed one at a time. In what order do they come out?",
    "options": [
      "10, 20, 30, 40",
      "40, 10, 30, 20",
      "40, 30, 20, 10",
      "20, 30, 10, 40"
    ],
    "correctIndex": 0,
    "explanation": "The item with the lowest key is always at the front, whatever the order of the insertions.",
    "optionFeedback": [
      "Correct.",
      "That is first in, first out, which a priority queue is not.",
      "That is the highest first; the natural order puts the lowest first.",
      "This is not an order of anything."
    ]
  },
  {
    "group": "Applications",
    "question": "Which structure suits the Back button of a web browser, and which suits a printer queue?",
    "options": [
      "stack, queue",
      "queue, stack",
      "stack, stack",
      "queue, queue"
    ],
    "correctIndex": 0,
    "explanation": "The last page visited is the first one returned to (LIFO: a stack). Jobs are printed in the order they were sent (FIFO: a queue).",
    "optionFeedback": [
      "Correct.",
      "That swaps the two.",
      "A printer must serve jobs in arrival order.",
      "The Back button needs the newest page first."
    ]
  }
];
