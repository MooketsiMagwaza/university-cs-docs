export const quizData = [
  {
    "group": "Data structures",
    "question": "What does Program = Algorithm + Data Structure mean?",
    "options": [
      "An algorithm alone is not enough, because programs manipulate data that must be organised",
      "A program needs no algorithm if it has a data structure",
      "A data structure is another name for an algorithm",
      "Algorithms always choose the data structure automatically"
    ],
    "correctIndex": 0,
    "explanation": "The choice of data structure affects the program design and determines an algorithm's performance.",
    "optionFeedback": [
      "Correct.",
      "Both are needed.",
      "They are different things.",
      "The programmer chooses."
    ]
  },
  {
    "group": "Data structures",
    "question": "Which of these is a non-linear data structure?",
    "options": [
      "A tree",
      "An array",
      "A stack",
      "A queue"
    ],
    "correctIndex": 0,
    "explanation": "Trees, hash maps and graphs are non-linear; arrays, linked lists, stacks and queues are linear.",
    "optionFeedback": [
      "Correct.",
      "An array is linear.",
      "A stack is linear.",
      "A queue is linear."
    ]
  },
  {
    "group": "Data structures",
    "question": "Which pair is correct for static and dynamic structures?",
    "options": [
      "An array is static and a linked list is dynamic",
      "An array is dynamic and a linked list is static",
      "Both are static",
      "Both are dynamic"
    ],
    "correctIndex": 0,
    "explanation": "An array has a fixed size once created; a linked list grows and shrinks.",
    "optionFeedback": [
      "Correct.",
      "It is the other way round.",
      "A linked list grows and shrinks.",
      "An array cannot change size."
    ]
  },
  {
    "group": "Data structures",
    "question": "Which of these is NOT one of the common operations on a data structure listed in Lecture 1?",
    "options": [
      "Compile",
      "Merge",
      "Search",
      "Sort"
    ],
    "correctIndex": 0,
    "explanation": "The operations are create, add or insert, delete, modify, search, sort and merge.",
    "optionFeedback": [
      "Correct.",
      "Merge is on the list.",
      "Search is on the list.",
      "Sort is on the list."
    ]
  },
  {
    "group": "Data structures",
    "question": "Which structure does the lecture give for the Back button of a browser?",
    "options": [
      "A stack",
      "A queue",
      "A tree",
      "An array"
    ],
    "correctIndex": 0,
    "explanation": "The last page visited is the first one to go back to.",
    "optionFeedback": [
      "Correct.",
      "A queue is used for printing jobs.",
      "Trees are used for indexing.",
      "The Back button needs last-in, first-out order."
    ]
  },
  {
    "group": "Java basics",
    "question": "What does int b = a++; do when a is 5?",
    "options": [
      "b becomes 5 and a becomes 6",
      "b becomes 6 and a becomes 6",
      "b becomes 5 and a stays 5",
      "b becomes 6 and a stays 5"
    ],
    "correctIndex": 0,
    "explanation": "a++ gives the old value and then increments.",
    "optionFeedback": [
      "Correct.",
      "++a would give 6.",
      "a is incremented.",
      "a is incremented and b gets the old value."
    ]
  },
  {
    "group": "Java basics",
    "question": "What does String dept = \"Computer Science\"; dept.indexOf(\"scie\") return?",
    "options": [
      "-1: the text has a capital S, so the lower-case text is not found",
      "9",
      "10",
      "An exception"
    ],
    "correctIndex": 0,
    "explanation": "indexOf is case-sensitive and returns -1 when the text is not found.",
    "optionFeedback": [
      "Correct.",
      "9 is the index of \"Sci\".",
      "The text is not found.",
      "No exception is thrown."
    ]
  },
  {
    "group": "Java basics",
    "question": "What does dept.substring(9) + 7 give for \"Computer Science\"?",
    "options": [
      "Science7",
      "Science",
      "7",
      "Computer7"
    ],
    "correctIndex": 0,
    "explanation": "substring(9) is the text from index 9, and + 7 appends the digit.",
    "optionFeedback": [
      "Correct.",
      "The 7 is appended.",
      "The substring is included.",
      "Index 9 is the S of Science."
    ]
  },
  {
    "group": "Java basics",
    "question": "What does dept.charAt(dept.length()) do for \"Computer Science\"?",
    "options": [
      "Throws StringIndexOutOfBoundsException",
      "Returns the last character",
      "Returns a space",
      "Does not compile"
    ],
    "correctIndex": 0,
    "explanation": "The valid indexes are 0 to length() - 1; length() is one past the last character.",
    "optionFeedback": [
      "Correct.",
      "The last character is at length() - 1.",
      "No space is returned.",
      "It compiles and fails at run time."
    ]
  },
  {
    "group": "Java basics",
    "question": "What does javac report for int x; x++; ?",
    "options": [
      "error: variable x might not have been initialized",
      "error: cannot find symbol",
      "error: incompatible types",
      "Nothing: x is 0"
    ],
    "correctIndex": 0,
    "explanation": "A local variable has no default value; it must be initialised before use.",
    "optionFeedback": [
      "Correct.",
      "x is declared.",
      "The types are fine.",
      "Local variables do not default to 0."
    ]
  },
  {
    "group": "Java basics",
    "question": "What is the sum after for (int i = 1; i < 5; i++) sum += i; starting from sum = 0?",
    "options": [
      "10",
      "15",
      "5",
      "14"
    ],
    "correctIndex": 0,
    "explanation": "i takes 1, 2, 3, 4: one too few iterations for the numbers 1 to 5.",
    "optionFeedback": [
      "Correct.",
      "15 needs i <= 5.",
      "i takes four values.",
      "The values are 1 to 4."
    ]
  },
  {
    "group": "Java basics",
    "question": "What happens to an existing output file when a PrintWriter is opened on it?",
    "options": [
      "It is overwritten by default",
      "The new text is appended",
      "An exception is thrown",
      "A copy is made"
    ],
    "correctIndex": 0,
    "explanation": "An output file is created if it does not exist and overwritten if it does.",
    "optionFeedback": [
      "Correct.",
      "Appending needs a different constructor.",
      "No exception is thrown for an existing file.",
      "No copy is made."
    ]
  },
  {
    "group": "Java basics",
    "question": "Why may a file written with PrintWriter be empty when the program forgot close()?",
    "options": [
      "The text is still in a buffer and was never written to the file",
      "The file is deleted",
      "The text is written in reverse",
      "The file is opened for reading"
    ],
    "correctIndex": 0,
    "explanation": "close() writes the buffered text and releases the file.",
    "optionFeedback": [
      "Correct.",
      "Nothing deletes it.",
      "Order is not changed.",
      "It was opened for writing."
    ]
  },
  {
    "group": "Java basics",
    "question": "What does javac report for new FileReader(\"data.txt\") in a method with no throws clause and no try-catch?",
    "options": [
      "error: unreported exception FileNotFoundException; must be caught or declared to be thrown",
      "error: cannot find symbol",
      "Nothing: it compiles",
      "A run-time exception only"
    ],
    "correctIndex": 0,
    "explanation": "File exceptions are checked: handle them with throws or try-catch.",
    "optionFeedback": [
      "Correct.",
      "The class exists.",
      "The compiler enforces handling.",
      "It is a compile-time error."
    ]
  },
  {
    "group": "Methods",
    "question": "addTax(total, 7.5) modifies its parameter price. What is total afterwards when it was 10.0?",
    "options": [
      "10.0: the method changed a copy",
      "10.75",
      "0.75",
      "17.5"
    ],
    "correctIndex": 0,
    "explanation": "Parameters are copies of the values; return the new value and assign it to change the original.",
    "optionFeedback": [
      "Correct.",
      "That is the value of price inside the method.",
      "That is the tax returned.",
      "The rate is not added to the total."
    ]
  },
  {
    "group": "Methods",
    "question": "What does javac report for a method int sign(double x) that returns -1 for x < 0 and 1 for x > 0 and has nothing for x == 0?",
    "options": [
      "error: missing return statement",
      "error: cannot find symbol",
      "error: incompatible types",
      "Nothing: it returns 0"
    ],
    "correctIndex": 0,
    "explanation": "The compiler complains if any branch has no return.",
    "optionFeedback": [
      "Correct.",
      "All symbols exist.",
      "The types match.",
      "Nothing is returned by default."
    ]
  },
  {
    "group": "Methods",
    "question": "What does return; do in a void method?",
    "options": [
      "It terminates the method immediately",
      "It returns 0",
      "It causes a compile error",
      "It restarts the method"
    ],
    "correctIndex": 0,
    "explanation": "A void method needs no return, but return; ends it at once.",
    "optionFeedback": [
      "Correct.",
      "There is no value to return.",
      "It is allowed.",
      "It ends the method."
    ]
  },
  {
    "group": "Methods",
    "question": "What is a stub?",
    "options": [
      "An unfinished method that returns a dummy value",
      "A method with no parameters",
      "A method that cannot return",
      "A comment before a method"
    ],
    "correctIndex": 0,
    "explanation": "For example digitName(int) returning \"mumble\" while the real method is written.",
    "optionFeedback": [
      "Correct.",
      "A stub may have parameters.",
      "A stub returns a dummy value.",
      "It is code, not a comment."
    ]
  },
  {
    "group": "Methods",
    "question": "The lecture's readValueBetween starts with int input = 0. What does it do for the range 0 to 59?",
    "options": [
      "It returns 0 without asking, because 0 is already inside the range",
      "It asks until the user types a value from 0 to 59",
      "It does not compile",
      "It asks once"
    ],
    "correctIndex": 0,
    "explanation": "The loop condition is false at once. Start with low - 1.",
    "optionFeedback": [
      "Correct.",
      "The loop never runs.",
      "It compiles.",
      "It never asks."
    ]
  },
  {
    "group": "Methods",
    "question": "A variable is declared inside a for block and printed after the loop. What does javac report?",
    "options": [
      "error: cannot find symbol",
      "error: variable already defined",
      "Nothing: it prints the last value",
      "error: missing return statement"
    ],
    "correctIndex": 0,
    "explanation": "The variable stops existing at the closing brace of the block.",
    "optionFeedback": [
      "Correct.",
      "Nothing is declared twice.",
      "The variable is out of scope.",
      "No return is involved."
    ]
  },
  {
    "group": "Methods",
    "question": "A method has a parameter n and declares int n = i * i; inside a for block. What does javac report?",
    "options": [
      "error: variable n is already defined in method sumOfSquares(int)",
      "Nothing: the block has its own scope",
      "error: cannot find symbol",
      "error: incompatible types"
    ],
    "correctIndex": 0,
    "explanation": "Variables, including parameters, must have unique names within their scope.",
    "optionFeedback": [
      "Correct.",
      "The block is inside the method's scope.",
      "The name exists.",
      "The types match."
    ]
  },
  {
    "group": "Methods",
    "question": "A static field count = 3 and main declares int count = 50 later. What do count and ScopeTrace.count give after that line?",
    "options": [
      "50 and 3",
      "50 and 50",
      "3 and 3",
      "3 and 50"
    ],
    "correctIndex": 0,
    "explanation": "The local variable hides the global one from its declaration; the global is reached with the class name and is unchanged.",
    "optionFeedback": [
      "Correct.",
      "The global is a different variable.",
      "After the declaration the name means the local.",
      "The local is 50."
    ]
  },
  {
    "group": "Arrays",
    "question": "What does a new int[10] contain, and a new String[3]?",
    "options": [
      "Ten 0s, and three null references",
      "Ten nulls, and three empty strings",
      "Ten 0s, and three empty strings",
      "Unspecified values"
    ],
    "correctIndex": 0,
    "explanation": "Numeric arrays start with 0; arrays of objects start with null.",
    "optionFeedback": [
      "Correct.",
      "An int array has no null.",
      "A String array holds null, not \"\".",
      "Values are always defined."
    ]
  },
  {
    "group": "Arrays",
    "question": "What does javac report for numbers.length() when numbers is an int[]?",
    "options": [
      "error: cannot find symbol (symbol: method length())",
      "Nothing: it returns the length",
      "error: incompatible types",
      "A run-time exception"
    ],
    "correctIndex": 0,
    "explanation": "length is an attribute of an array; length() is a String method.",
    "optionFeedback": [
      "Correct.",
      "That is the String method.",
      "The symbol does not exist.",
      "It fails at compile time."
    ]
  },
  {
    "group": "Arrays",
    "question": "When is ArrayIndexOutOfBoundsException found for numbers[10] on new int[10]?",
    "options": [
      "At run time: the program compiles",
      "At compile time",
      "When the array is created",
      "Never"
    ],
    "correctIndex": 0,
    "explanation": "The valid indexes are 0 to 9; the error appears only when the statement runs.",
    "optionFeedback": [
      "Correct.",
      "The compiler does not check indexes.",
      "Creation is fine.",
      "It is thrown at run time."
    ]
  },
  {
    "group": "Arrays",
    "question": "What are the contents of numbers after: numbers[0] = 5; for i = 1 to 5: numbers[i] = i * i + 5; if (i > 2) numbers[i] = 2 * numbers[i] - numbers[i - 1]?",
    "options": [
      "5, 6, 9, 19, 23, 37",
      "5, 6, 9, 14, 21, 30",
      "5, 6, 9, 19, 21, 30",
      "5, 6, 9, 14, 23, 37"
    ],
    "correctIndex": 0,
    "explanation": "For i = 3: 14, then 28 - 9 = 19; i = 4: 21, then 42 - 19 = 23; i = 5: 30, then 60 - 23 = 37.",
    "optionFeedback": [
      "Correct.",
      "That ignores the adjustment.",
      "The adjustment is applied for every i > 2.",
      "The adjustment uses the new previous value."
    ]
  },
  {
    "group": "Arrays",
    "question": "The loop for (i = 0; i < numbers.length; i++) if (i % 2 == 1) numbers[i] = i + 1; runs on new int[14]. What is numbers[13]?",
    "options": [
      "14",
      "13",
      "0",
      "12"
    ],
    "correctIndex": 0,
    "explanation": "Index 13 is odd, so it receives 13 + 1.",
    "optionFeedback": [
      "Correct.",
      "The value is the index plus 1.",
      "Index 13 is odd.",
      "That is numbers[11]."
    ]
  },
  {
    "group": "Arrays",
    "question": "A method initArray(int[] numbers, int v) sets every element to v. What happens to the caller's array?",
    "options": [
      "It is changed, because the method received the address of the same array",
      "It is unchanged, because the method received a copy of the array",
      "It is unchanged unless the method returns it",
      "It becomes null"
    ],
    "correctIndex": 0,
    "explanation": "The parameter is a copy of the reference, so both names reach one array.",
    "optionFeedback": [
      "Correct.",
      "The reference is copied, not the array.",
      "No return is needed.",
      "Nothing sets it to null."
    ]
  },
  {
    "group": "Arrays",
    "question": "Inside a method, arr = new int[] {7, 7, 7}; is executed for a parameter arr. What happens to the caller's array?",
    "options": [
      "Nothing: only the parameter now points at a new array",
      "It becomes {7, 7, 7}",
      "It becomes null",
      "The program does not compile"
    ],
    "correctIndex": 0,
    "explanation": "Assigning to the parameter changes the copy of the address only.",
    "optionFeedback": [
      "Correct.",
      "The caller's variable still holds the old address.",
      "It is not set to null.",
      "It compiles."
    ]
  },
  {
    "group": "Arrays",
    "question": "What does indexOfMax return for {3, 1, -2, 6, 8}?",
    "options": [
      "4",
      "8",
      "3",
      "0"
    ],
    "correctIndex": 0,
    "explanation": "It returns the position of the largest element, not the value.",
    "optionFeedback": [
      "Correct.",
      "That is the value.",
      "That is the index of 6.",
      "That is the initial assumption."
    ]
  },
  {
    "group": "Arrays",
    "question": "Account[] accs = new Account[5]; accs[0] = new Account(190, 450.0); What does accs[0].equals(accs[3]) do when equals calls other.getNumber()?",
    "options": [
      "Throws NullPointerException: accs[3] was never assigned",
      "Returns false",
      "Returns true",
      "Does not compile"
    ],
    "correctIndex": 0,
    "explanation": "accs[3] is null, and a method cannot be called on null.",
    "optionFeedback": [
      "Correct.",
      "The call fails before a comparison.",
      "No comparison happens.",
      "It compiles."
    ]
  },
  {
    "group": "Arrays",
    "question": "Why does System.out.printf(\"%d\", accs[0].getBalance()) fail when the balance is a double?",
    "options": [
      "%d expects an integer: IllegalFormatConversionException",
      "%d prints only the first digit",
      "getBalance returns null",
      "printf cannot print a double"
    ],
    "correctIndex": 0,
    "explanation": "Use %.2f for a double.",
    "optionFeedback": [
      "Correct.",
      "The conversion fails instead.",
      "The value is a double.",
      "printf can print doubles with %f."
    ]
  },
  {
    "group": "Arrays",
    "question": "For int[][] grid = new int[3][4], what are grid.length and grid[0].length?",
    "options": [
      "3 and 4",
      "4 and 3",
      "12 and 12",
      "3 and 3"
    ],
    "correctIndex": 0,
    "explanation": "grid.length is the number of rows; grid[0].length is the number of columns.",
    "optionFeedback": [
      "Correct.",
      "Rows come first.",
      "That is the total number of cells.",
      "The rows have four cells."
    ]
  },
  {
    "group": "Labs 1 and 2",
    "question": "A lay-bye has a total of 3000 and 1500 paid. Is it sent to concern.txt (outstanding amount exceeds 50% of the total)?",
    "options": [
      "No: 1500 is exactly 50%, not more than 50%",
      "Yes: 1500 is half",
      "Yes: it is not fully paid",
      "No: it is paid in full"
    ],
    "correctIndex": 0,
    "explanation": "Exceeds means strictly more than half.",
    "optionFeedback": [
      "Correct.",
      "Exactly half does not exceed half.",
      "Being unpaid is not the test.",
      "It is not paid in full."
    ]
  },
  {
    "group": "Labs 1 and 2",
    "question": "Under the Lab 2 rules, what does preProcessing do with a record whose total is exactly 5000?",
    "options": [
      "Keeps it: 5000 does not exceed P5000",
      "Sends it to the output file",
      "Deletes it",
      "Returns an error"
    ],
    "correctIndex": 0,
    "explanation": "Only totals that are negative or exceed P5000 are erroneous.",
    "optionFeedback": [
      "Correct.",
      "The rule is strictly greater than 5000.",
      "Nothing deletes records.",
      "No error is raised."
    ]
  },
  {
    "group": "Labs 1 and 2",
    "question": "linearSearch on the array of valid items finds the ID at index 1. Which index does it return when the same item is at position 4 of the original file?",
    "options": [
      "1: it is a position in the array it was given",
      "4",
      "-1",
      "0"
    ],
    "correctIndex": 0,
    "explanation": "The index refers to the array passed to linearSearch.",
    "optionFeedback": [
      "Correct.",
      "The file order is not used.",
      "-1 means not found.",
      "The index is 1."
    ]
  },
  {
    "group": "Labs 1 and 2",
    "question": "javac reports four errors on a program that also has a missing return statement. Why is the missing return not among them?",
    "options": [
      "Flow errors are reported only after the name and type errors are fixed",
      "There is no such error in Java",
      "javac stops at the first error",
      "The missing return is optional"
    ],
    "correctIndex": 0,
    "explanation": "Fix the first round and compile again: new messages appear.",
    "optionFeedback": [
      "Correct.",
      "There is.",
      "It reports several.",
      "A non-void method must return."
    ]
  }
];
