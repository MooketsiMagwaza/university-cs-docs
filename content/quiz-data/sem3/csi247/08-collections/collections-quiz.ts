export const quizData = [
  {
    "group": "Arrays class",
    "question": "What does Arrays.sort do to an Integer array {73, 64, 59, 15} by default?",
    "options": [
      "Sorts it in ascending order, with no loop to write",
      "Sorts it in descending order",
      "Returns a new sorted array and leaves the original",
      "Sorts it only when the elements are int values"
    ],
    "correctIndex": 0,
    "explanation": "Arrays.sort sorts in place in ascending order by default; it works for primitives and for objects.",
    "optionFeedback": [
      "Correct.",
      "Descending needs a different ordering; the default is ascending.",
      "The array itself is sorted; nothing is returned.",
      "It works for both primitives and arrays of objects."
    ]
  },
  {
    "group": "Arrays class",
    "question": "What does Arrays.toString(words) print after Arrays.sort for String[] words = {\"pear\", \"Apple\", \"banana\", \"apple\"}?",
    "options": [
      "[Apple, apple, banana, pear]",
      "[apple, Apple, banana, pear]",
      "[Apple, banana, apple, pear]",
      "[banana, pear, Apple, apple]"
    ],
    "correctIndex": 0,
    "explanation": "Strings are ordered by the Unicode values of their characters, so uppercase A (65) comes before lowercase a (97).",
    "optionFeedback": [
      "Correct.",
      "Apple comes before apple because A has a smaller Unicode value than a.",
      "apple is before banana because a is before b.",
      "The default order is ascending, not insertion order."
    ]
  },
  {
    "group": "Arrays class",
    "question": "Arrays.binarySearch on {15, 27, 59, 64, 73, 82, 91} for 60 returns -4. What does that mean?",
    "options": [
      "60 is not in the array; it would be inserted at index 3",
      "60 is at index 4",
      "60 is at index -4",
      "The array is not sorted"
    ],
    "correctIndex": 0,
    "explanation": "A negative result is -(insertion point) - 1; the insertion point 3 gives -4.",
    "optionFeedback": [
      "Correct.",
      "A negative value means the element was not found.",
      "An array has no negative index.",
      "The array is sorted; that is required for binarySearch."
    ]
  },
  {
    "group": "Arrays class",
    "question": "What does System.out.println(arr) print for an Integer array arr?",
    "options": [
      "The type code and an address, such as [Ljava.lang.Integer;@...",
      "The elements in square brackets",
      "The number of elements",
      "Nothing, it does not compile"
    ],
    "correctIndex": 0,
    "explanation": "An array does not override toString in a useful way; use Arrays.toString(arr).",
    "optionFeedback": [
      "Correct.",
      "That is what Arrays.toString prints.",
      "That is arr.length.",
      "It compiles and prints an address."
    ]
  },
  {
    "group": "Arrays and lists",
    "question": "What happens when you call add on the list returned by Arrays.asList(arr)?",
    "options": [
      "UnsupportedOperationException: the list has a fixed size",
      "The element is added and the array grows",
      "ConcurrentModificationException",
      "IndexOutOfBoundsException"
    ],
    "correctIndex": 0,
    "explanation": "Arrays.asList returns a fixed-size view of the array.",
    "optionFeedback": [
      "Correct.",
      "An array cannot grow, and neither can its view.",
      "That exception is for changing a list during iteration.",
      "The index is not the problem; the list cannot change size."
    ]
  },
  {
    "group": "Arrays and lists",
    "question": "What error does javac report for the lecture line (Arrays.asList(marks)); on its own?",
    "options": [
      "error: not a statement",
      "error: cannot find symbol",
      "error: incompatible types",
      "error: unexpected type"
    ],
    "correctIndex": 0,
    "explanation": "An expression in parentheses is not a statement; pass it to the ArrayList constructor instead.",
    "optionFeedback": [
      "Correct.",
      "The symbols exist; the line is not a statement.",
      "No assignment happens on that line.",
      "No type argument is involved."
    ]
  },
  {
    "group": "Arrays and lists",
    "question": "Why must marks = myList.toArray(marks) assign the result back when the list has 5 elements and marks has 4 cells?",
    "options": [
      "The array is too small, so toArray allocates and returns a new array",
      "toArray always returns a new array",
      "The list is cleared by toArray",
      "The array would otherwise be sorted"
    ],
    "correctIndex": 0,
    "explanation": "With an array that is large enough, toArray fills it and returns the same one; otherwise it returns a new array.",
    "optionFeedback": [
      "Correct.",
      "With a large enough array it returns the same array.",
      "toArray does not change the list.",
      "toArray does not sort."
    ]
  },
  {
    "group": "Iteration",
    "question": "Which way of iterating does not state how to move from one element to the next?",
    "options": [
      "The for-each loop",
      "The standard for loop",
      "The while loop with a counter",
      "None of them"
    ],
    "correctIndex": 0,
    "explanation": "The for-each loop hides the move; it uses an Iterator privately.",
    "optionFeedback": [
      "Correct.",
      "The standard loop writes i++.",
      "The while loop updates the counter.",
      "The for-each loop does not state the move."
    ]
  },
  {
    "group": "Iteration",
    "question": "A list holds [51, 35, 12, 81, 54, 16]. After three calls to it.next() and then it.remove(), what is the list?",
    "options": [
      "[51, 35, 81, 54, 16]",
      "[35, 12, 81, 54, 16]",
      "[51, 35, 12, 54, 16]",
      "[81, 54, 16]"
    ],
    "correctIndex": 0,
    "explanation": "The three calls return 51, 35 and 12, and remove() removes the last element returned, 12.",
    "optionFeedback": [
      "Correct.",
      "That would remove 51, the first element.",
      "That would remove 81, the next element.",
      "remove() removes one element only."
    ]
  },
  {
    "group": "Iteration",
    "question": "What does it.remove() throw when it is called before any it.next()?",
    "options": [
      "IllegalStateException",
      "NoSuchElementException",
      "ConcurrentModificationException",
      "IndexOutOfBoundsException"
    ],
    "correctIndex": 0,
    "explanation": "There is no last element returned by next(), so there is nothing to remove.",
    "optionFeedback": [
      "Correct.",
      "That one is thrown by next() when there is no next element.",
      "That one is for a list changed behind the iterator.",
      "No index is used."
    ]
  },
  {
    "group": "Iteration",
    "question": "Why does removing 92 from [73, 92, 58, 60] inside a for-each loop fail?",
    "options": [
      "The loop uses an iterator privately and detects the change: ConcurrentModificationException",
      "for-each cannot be used with an ArrayList",
      "remove() is not allowed for Integer",
      "The list is sorted first"
    ],
    "correctIndex": 0,
    "explanation": "Change the list through the iterator instead: it.remove().",
    "optionFeedback": [
      "Correct.",
      "for-each works with every Iterable collection.",
      "remove works for any element type.",
      "Nothing is sorted."
    ]
  },
  {
    "group": "Iteration",
    "question": "What does the second call to it.next() return for a list [51, 35, 12, 81, 54, 16] when the iterator is new?",
    "options": [
      "35",
      "51",
      "12",
      "81"
    ],
    "correctIndex": 0,
    "explanation": "The first call returns 51 and the second 35. The lecture slide lists 81, 54 and 16, but its picture removes 12, the third element.",
    "optionFeedback": [
      "Correct.",
      "51 is returned by the first call.",
      "12 is returned by the third call.",
      "81 comes after the removed 12."
    ]
  },
  {
    "group": "List and ArrayList",
    "question": "A List<Integer> holds [84, 62]. What is it after marks.add(2, 73)?",
    "options": [
      "[84, 62, 73]: index 2 equals size(), so it is added at the end",
      "It throws IndexOutOfBoundsException",
      "[84, 73, 62]",
      "[73, 84, 62]"
    ],
    "correctIndex": 0,
    "explanation": "add(i, e) accepts indexes from 0 up to and including size(). The lecture slide marks this line as an error, but with two elements it runs.",
    "optionFeedback": [
      "Correct.",
      "The exception needs an index beyond size(), such as add(9, 1).",
      "Index 2 is after the second element.",
      "Index 2 is not the front."
    ]
  },
  {
    "group": "List and ArrayList",
    "question": "What does marks.remove(84) do for a List<Integer> that has 4 elements?",
    "options": [
      "Throws IndexOutOfBoundsException: 84 is an int, so it is an index",
      "Removes the element 84",
      "Removes the last element",
      "Does not compile"
    ],
    "correctIndex": 0,
    "explanation": "Use marks.remove(Integer.valueOf(84)) to remove the value.",
    "optionFeedback": [
      "Correct.",
      "That needs an Integer object, not an int.",
      "No such behaviour exists.",
      "It compiles: remove(int) exists."
    ]
  },
  {
    "group": "List and ArrayList",
    "question": "For [Kago, Lesego, Neo, Thato], what does names.set(2, \"Mpho\") return?",
    "options": [
      "Neo, the old element",
      "Mpho, the new element",
      "true",
      "Nothing: it is a void method"
    ],
    "correctIndex": 0,
    "explanation": "set replaces the element and returns the old one.",
    "optionFeedback": [
      "Correct.",
      "The new element is the argument.",
      "remove(Object) returns a boolean, set does not.",
      "set returns the old element."
    ]
  },
  {
    "group": "List and ArrayList",
    "question": "What is the size of new ArrayList<String>(20) before anything is added?",
    "options": [
      "0",
      "20",
      "1",
      "It does not compile"
    ],
    "correctIndex": 0,
    "explanation": "20 is the initial capacity, not the size.",
    "optionFeedback": [
      "Correct.",
      "That is the capacity.",
      "Nothing has been added.",
      "The constructor with a capacity exists."
    ]
  },
  {
    "group": "List and ArrayList",
    "question": "What does an array-based list do when it is full and a new element is added?",
    "options": [
      "Creates a new array twice as large, copies the elements, then inserts",
      "Throws an exception",
      "Overwrites the last element",
      "Shifts all elements left"
    ],
    "correctIndex": 0,
    "explanation": "A growth is O(n) but happens rarely.",
    "optionFeedback": [
      "Correct.",
      "An ArrayList grows by itself.",
      "No element is lost.",
      "Shifting is for insertion and removal, not growth."
    ]
  },
  {
    "group": "List and ArrayList",
    "question": "Which ArrayList operation is inefficient because it shifts a potentially large number of elements?",
    "options": [
      "add(0, e) at the front",
      "get(i)",
      "set(i, e)",
      "add(e) at the end"
    ],
    "correctIndex": 0,
    "explanation": "add(i, e) and remove(i) shift elements. get, set and add at the end need no shifting.",
    "optionFeedback": [
      "Correct.",
      "get reaches the element directly.",
      "set reaches the element directly.",
      "Adding at the end shifts nothing."
    ]
  },
  {
    "group": "List and ArrayList",
    "question": "In the DynamicArray example, add(0, 5) is applied to a list of 5 elements. How many elements are shifted?",
    "options": [
      "5",
      "4",
      "1",
      "0"
    ],
    "correctIndex": 0,
    "explanation": "Every element moves one place to the right to make room at index 0.",
    "optionFeedback": [
      "Correct.",
      "The element at index 4 also moves.",
      "Only one move would be needed at the end.",
      "Adding at the end shifts none; adding at the front shifts all."
    ]
  },
  {
    "group": "LinkedList",
    "question": "After add(\"Mango\"), add(\"Orange\"), add(\"Grapes\"), add(\"Guava\"), add(0, \"Lemon\"), set(1, \"Lime\"), removeFirst(), removeLast(), what is the LinkedList?",
    "options": [
      "[Lime, Orange, Grapes]",
      "[Mango, Orange, Grapes]",
      "[Lemon, Lime, Orange]",
      "[Lime, Orange, Grapes, Guava]"
    ],
    "correctIndex": 0,
    "explanation": "The set replaced Mango with Lime, removeFirst removed Lemon and removeLast removed Guava.",
    "optionFeedback": [
      "Correct.",
      "set(1, \"Lime\") replaced Mango.",
      "removeFirst removed Lemon.",
      "removeLast removed Guava."
    ]
  },
  {
    "group": "LinkedList",
    "question": "What does getFirst() throw on an empty LinkedList?",
    "options": [
      "NoSuchElementException",
      "IndexOutOfBoundsException",
      "NullPointerException",
      "It returns null"
    ],
    "correctIndex": 0,
    "explanation": "The end methods throw NoSuchElementException on an empty list; index methods throw IndexOutOfBoundsException.",
    "optionFeedback": [
      "Correct.",
      "That is for an index outside the list.",
      "No null is dereferenced.",
      "peek on a queue returns null, getFirst does not."
    ]
  },
  {
    "group": "LinkedList",
    "question": "Why is get(i) slower in a LinkedList than in an ArrayList?",
    "options": [
      "There is no direct access: it starts at the head and follows links",
      "A LinkedList has to be sorted first",
      "get(i) copies the list",
      "Nodes are stored in a hash table"
    ],
    "correctIndex": 0,
    "explanation": "An ArrayList reaches index i directly in its array.",
    "optionFeedback": [
      "Correct.",
      "No sorting is involved.",
      "get does not copy.",
      "Nodes are linked, not hashed."
    ]
  },
  {
    "group": "LinkedList",
    "question": "Why does Lab 8 add two courses before it adds a course at index 5?",
    "options": [
      "add(5, e) needs at least five elements; with three it throws IndexOutOfBoundsException",
      "Index 5 must be an empty slot",
      "The list must be sorted first",
      "A LinkedList has a capacity of 5"
    ],
    "correctIndex": 0,
    "explanation": "Valid indexes for add(i, e) are 0 to size(), so size() must be at least 5.",
    "optionFeedback": [
      "Correct.",
      "A LinkedList has no empty slots.",
      "Sorting is not required.",
      "A LinkedList has no capacity."
    ]
  },
  {
    "group": "Comparable and sorting",
    "question": "What does Collections.sort(list) need from the elements of the list?",
    "options": [
      "They must be Comparable",
      "They must be Strings",
      "They must implement Iterable",
      "They must be unique"
    ],
    "correctIndex": 0,
    "explanation": "Collections.sort uses compareTo, which Comparable provides.",
    "optionFeedback": [
      "Correct.",
      "Integer and Book objects can be sorted too.",
      "Iterable is for traversal.",
      "Duplicates are allowed."
    ]
  },
  {
    "group": "Comparable and sorting",
    "question": "What does \"apple\".compareTo(\"banana\") return?",
    "options": [
      "A negative number (-1)",
      "A positive number",
      "0",
      "true"
    ],
    "correctIndex": 0,
    "explanation": "a comes before b, so the first string is less. Test the sign, not the exact value.",
    "optionFeedback": [
      "Correct.",
      "A positive number means the first string comes later.",
      "0 means equal strings.",
      "compareTo returns an int."
    ]
  },
  {
    "group": "Comparable and sorting",
    "question": "Two LooseBook objects have the same year and different titles; compareTo compares only the year, equals compares title and year. What do compareTo == 0 and equals give?",
    "options": [
      "compareTo == 0 is true and equals is false: inconsistent",
      "both true",
      "both false",
      "compareTo == 0 is false and equals is true"
    ],
    "correctIndex": 0,
    "explanation": "The ordering must agree with equals; break ties in compareTo by the title.",
    "optionFeedback": [
      "Correct.",
      "The titles differ, so equals is false.",
      "The years match, so compareTo is 0.",
      "The years match, so compareTo is 0, and the titles differ, so equals is false."
    ]
  },
  {
    "group": "Comparable and sorting",
    "question": "What does javac report for Collections.sort(list) when list holds objects of a class that is not Comparable?",
    "options": [
      "error: no suitable method found for sort(List<Plain>)",
      "It compiles and throws ClassCastException",
      "error: cannot find symbol",
      "It compiles and sorts by address"
    ],
    "correctIndex": 0,
    "explanation": "Arrays.sort on an array of such objects compiles and throws ClassCastException at run time.",
    "optionFeedback": [
      "Correct.",
      "That is what Arrays.sort does, not Collections.sort.",
      "The method exists; the type bound fails.",
      "Objects are not sorted by address."
    ]
  },
  {
    "group": "Comparable and sorting",
    "question": "Books of years 2003, 2014 and 2000 are sorted with compareTo ordering by year. Which is printed first?",
    "options": [
      "Java is Fun 2000",
      "Java Programming 2003",
      "Learn Java 2014",
      "The first book added"
    ],
    "correctIndex": 0,
    "explanation": "Ascending order of year: 2000, 2003, 2014.",
    "optionFeedback": [
      "Correct.",
      "2003 is the middle year.",
      "2014 is the largest year.",
      "The order is decided by compareTo."
    ]
  },
  {
    "group": "Comparable and sorting",
    "question": "Members are ordered by age, then by name. Which list is the result for Thato 30, Kago 25, Neo 30, Amo 25?",
    "options": [
      "[Amo 25, Kago 25, Neo 30, Thato 30]",
      "[Kago 25, Amo 25, Thato 30, Neo 30]",
      "[Amo 25, Kago 25, Thato 30, Neo 30]",
      "[Neo 30, Thato 30, Amo 25, Kago 25]"
    ],
    "correctIndex": 0,
    "explanation": "Compare the ages first; use the names only when the ages are equal.",
    "optionFeedback": [
      "Correct.",
      "Within an age the names are alphabetical.",
      "Neo comes before Thato.",
      "The younger members come first."
    ]
  },
  {
    "group": "Lab 8",
    "question": "The Person list has six items. After remove(2), what does remove(8) do?",
    "options": [
      "Throws IndexOutOfBoundsException; the list is unchanged with 5 items",
      "Removes the last item",
      "Does nothing",
      "Removes index 8 modulo the size"
    ],
    "correctIndex": 0,
    "explanation": "The valid indexes are 0 to 4 after the first removal; Java does not clamp an index.",
    "optionFeedback": [
      "Correct.",
      "An index is never adjusted.",
      "The call fails with an exception.",
      "No arithmetic is applied to the index."
    ]
  },
  {
    "group": "Lab 8",
    "question": "The Person records are sorted with Collections.sort and compareTo on fullname. Which person is first?",
    "options": [
      "Amo Seretse",
      "Lesego Jones",
      "The first record in the file",
      "The person with the smallest id"
    ],
    "correctIndex": 0,
    "explanation": "The order is alphabetical by fullname: Amo, Kagiso, Lesego, Neo, Thomas.",
    "optionFeedback": [
      "Correct.",
      "Lesego is alphabetically after Amo and Kagiso.",
      "The file order is not the sort order.",
      "The id is not used by compareTo."
    ]
  }
];
