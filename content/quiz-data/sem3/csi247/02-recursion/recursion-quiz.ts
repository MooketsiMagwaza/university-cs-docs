export const quizData = [
  {
    group: "Base case and termination",
    question: "What must a correct recursive case do besides call the same method?",
    options: ["Move toward a reachable base case", "Allocate an array", "Use a loop", "Return void"],
    correctIndex: 0,
    explanation: "Termination requires a measure that gets closer to a base case.",
    optionFeedback: [
      "Correct. Without progress the calls never reach the base case.",
      "Recursion does not need an array; many recursive methods (factorial, power) use only integers.",
      "A loop is what recursion replaces. Having one does not make the calls stop.",
      "A recursive method can return any type. The return type has nothing to do with whether the calls terminate."
    ]
  },
  {
    group: "Base case and termination",
    question: "What happens when sumTo(0) is called?",
    code: "static int sumTo(int n) {\n    if (n == 1) {\n        return 1;\n    }\n    return n + sumTo(n - 1);\n}",
    options: ["It returns 0", "It returns 1", "It ends in a StackOverflowError", "It throws ArrayIndexOutOfBoundsException"],
    correctIndex: 2,
    explanation: "The argument goes 0, -1, -2 and so on and never equals 1, so the calls pile up until the stack is full. A base case n <= 1 would stop it.",
    optionFeedback: [
      "The method never returns a value for 0: there is no case that answers 0.",
      "1 is returned only when n equals 1. The argument starts at 0 and moves away from 1.",
      "Correct. The base case is one step too late for this input.",
      "There is no array in this method. The failure is the stack filling with calls."
    ]
  },
  {
    group: "Base case and termination",
    question: "What do f(5) and f(4) do?",
    code: "static int f(int n) {\n    if (n == 1) {\n        return 1;\n    }\n    return n + f(n - 2);\n}",
    options: ["Both return a value", "f(5) returns 9; f(4) ends in a StackOverflowError", "f(5) ends in a StackOverflowError; f(4) returns 6", "Both end in a StackOverflowError"],
    correctIndex: 1,
    explanation: "From 5 the arguments are 5, 3, 1 and meet the base case, giving 9. From 4 they are 4, 2, 0, -2 and step over 1. Writing n <= 1 catches both.",
    optionFeedback: [
      "Only the odd start meets the base case. The even start steps over 1.",
      "Correct. A base case written with == can be stepped over when the argument changes by 2.",
      "Reversed: the odd argument reaches 1 and the even one does not.",
      "f(5) does stop: 5, 3, 1."
    ]
  },
  {
    group: "Base case and termination",
    question: "A recursive power method returns 0 in its base case (y == 0) and otherwise returns x * power(x, y - 1). What does power(2, 3) return?",
    options: ["8", "0", "1", "It ends in a StackOverflowError"],
    correctIndex: 1,
    explanation: "The base case value is multiplied into every result, so the whole product is 0. The base case of a product must return 1, the identity for multiplication.",
    optionFeedback: [
      "8 is the correct power, but this method multiplies by 0 at the end of the chain.",
      "Correct. 2 * (2 * (2 * 0)) is 0.",
      "1 would be the answer for power(2, 0) with the right base case. Here the base case returns 0.",
      "The calls do terminate: y goes 3, 2, 1, 0 and meets the base case."
    ]
  },
  {
    group: "Base case and termination",
    question: "countDigits uses the base case if (n == 0) return 0; and otherwise returns 1 + countDigits(n / 10). What does countDigits(0) return?",
    options: ["0, which is wrong because the number 0 has one digit", "0, which is right", "1", "It ends in a StackOverflowError"],
    correctIndex: 0,
    explanation: "The base case answers 0 immediately. The number 0 is written with one digit, so the base case should be n < 10 returning 1.",
    optionFeedback: [
      "Correct. The base case treats 0 as having no digits.",
      "0 is returned, but it is the wrong answer: the number 0 is written with one digit.",
      "That would be the answer with the base case n < 10. This version returns 0 straight away.",
      "The call stops at once because n == 0 is the base case."
    ]
  },
  {
    group: "Tracing",
    question: "Each recursive Java call receives…",
    options: ["Its own stack frame with parameters and locals", "The caller's exact local-variable storage", "No return address", "A new class"],
    correctIndex: 0,
    explanation: "Calls are separate invocations even when they execute the same method body.",
    optionFeedback: [
      "Correct. That is why every call has its own n.",
      "If the calls shared storage, each call would overwrite the n of the call waiting below it.",
      "Every call needs a return address so that it can resume the caller.",
      "Calls create frames, not classes. The class is the same for every call."
    ]
  },
  {
    group: "Tracing",
    question: "In return n + sumTo(n - 1), when is n added?",
    options: ["When the child result returns during unwinding", "Before the child call starts", "Only at compilation", "Never"],
    correctIndex: 0,
    explanation: "The parent frame waits until its child supplies a value.",
    optionFeedback: [
      "Correct. The addition cannot happen until sumTo(n - 1) has returned.",
      "The right-hand operand is not known until the child call finishes.",
      "Java evaluates this at run time, not at compilation.",
      "The addition does happen, once the child returns."
    ]
  },
  {
    group: "Tracing",
    question: "What does g(13) print?",
    code: "static void g(int n) {\n    if (n == 0) {\n        return;\n    }\n    g(n / 2);\n    System.out.print(n % 2);\n}",
    options: ["1011", "1101", "13", "6310"],
    correctIndex: 1,
    explanation: "The print is after the recursive call, so the digits come out as the calls return: 1 (for 1), 1 (for 3), 0 (for 6), 1 (for 13). This is 13 in binary.",
    optionFeedback: [
      "That is the order if the print came before the recursive call (13 % 2 = 1, 6 % 2 = 0, 3 % 2 = 1, 1 % 2 = 1).",
      "Correct. Printing after the call prints the most significant digit first.",
      "The method prints remainders, not the argument.",
      "6, 3, 1, 0 are the arguments of the calls, not the printed digits."
    ]
  },
  {
    group: "Tracing",
    question: "What does m(3, 1) return?",
    code: "static int m(int a, int b) {\n    if (a == 0) {\n        return b;\n    }\n    return m(a - 1, b + 2);\n}",
    options: ["5", "6", "7", "9"],
    correctIndex: 2,
    explanation: "The calls are m(3, 1), m(2, 3), m(1, 5), m(0, 7). The base case returns b = 7. In general m(a, b) returns b + 2 * a.",
    optionFeedback: [
      "That adds 2 only twice. There are three calls before the base case.",
      "6 is 2 * a: it forgets the starting value b = 1 that the base case returns.",
      "Correct. 1 + 2 + 2 + 2.",
      "That would need b to increase by more than 2 per call. The step is exactly 2."
    ]
  },
  {
    group: "Tracing",
    question: "What does f(14) return?",
    code: "static int f(int n) {\n    if (n <= 0) {\n        return 0;\n    }\n    return n % 3 + f(n / 3);\n}",
    options: ["2", "4", "14", "5"],
    correctIndex: 1,
    explanation: "f(14) = 2 + f(4) = 2 + 1 + f(1) = 2 + 1 + 1 + f(0) = 4. It adds the digits of n in base 3 (14 is 112 in base 3).",
    optionFeedback: [
      "That is only the first remainder, 14 % 3. The method continues with f(4).",
      "Correct. The remainders 2, 1 and 1 are added.",
      "The method returns remainders, not the argument.",
      "The remainders are 2, 1, 1. Their sum is 4, not 5."
    ]
  },
  {
    group: "Tracing",
    question: "How many calls does isEven(3) make in total, counting the first, and what does it return?",
    code: "static boolean isEven(int n) {\n    if (n == 0) return true;\n    return isOdd(n - 1);\n}\nstatic boolean isOdd(int n) {\n    if (n == 0) return false;\n    return isEven(n - 1);\n}",
    options: ["4 calls; false", "3 calls; true", "4 calls; true", "2 calls; false"],
    correctIndex: 0,
    explanation: "isEven(3), isOdd(2), isEven(1), isOdd(0): four calls. isOdd(0) returns false and the value passes up unchanged. 3 is not even.",
    optionFeedback: [
      "Correct. The chain ends in isOdd(0), which returns false.",
      "There are four calls, not three, and 3 is not even so the answer is false.",
      "Four calls is right, but the answer is false: the base case reached is isOdd(0).",
      "Each call lowers n by one, so the chain has 4 calls (n = 3, 2, 1, 0)."
    ]
  },
  {
    group: "Tracing",
    question: "With base cases fib(0) = 0 and fib(1) = 1, how many calls in total does fib(5) make?",
    options: ["5", "8", "15", "25"],
    correctIndex: 2,
    explanation: "The calls per argument for fib(5) are 1, 1, 2, 3, 5, 3 for n = 5 down to 0, a total of 15. In general fib(n) makes 2 * fib(n + 1) - 1 calls.",
    optionFeedback: [
      "5 is the value of fib(5), not the number of calls.",
      "8 is the value of fib(6). The calls are far more than the value.",
      "Correct. The calls form a tree, and the same smaller values are called repeatedly.",
      "25 is the number of calls for fib(6)."
    ]
  },
  {
    group: "Tracing",
    question: "How many times is fib(2) called while fib(5) is evaluated?",
    options: ["1", "2", "3", "5"],
    correctIndex: 2,
    explanation: "fib(2) is called from fib(3) inside fib(4), from fib(4), and from fib(3) directly under fib(5): three times.",
    optionFeedback: [
      "Only one call would mean no repeated work, but the tree recomputes the same values.",
      "fib(3) is called twice, but fib(2) is called from both of those and from fib(4).",
      "Correct. The counts follow the Fibonacci numbers.",
      "5 is the number of times fib(1) is called, not fib(2)."
    ]
  },
  {
    group: "Writing methods",
    question: "In sumBack(int[] a, int n), n is the number of elements still to add. Which element does the first call add when n equals a.length?",
    options: ["a[n]", "a[n - 1]", "a[0]", "a[n + 1]"],
    correctIndex: 1,
    explanation: "n is a count, so the last of the n elements is a[n - 1]. a[n] would be past the end of the array.",
    optionFeedback: [
      "a[n] is one past the last element and throws ArrayIndexOutOfBoundsException when n equals a.length.",
      "Correct. With a count, the last element is at index n - 1.",
      "a[0] is the first element. This method takes elements from the back.",
      "a[n + 1] is even further past the end."
    ]
  },
  {
    group: "Writing methods",
    question: "What does wrong(\"abc\") return?",
    code: "static String wrong(String s) {\n    if (s.isEmpty()) {\n        return \"\";\n    }\n    return s.charAt(0) + s.charAt(0) + wrong(s.substring(1));\n}",
    options: ["aabbcc", "194196198", "abc", "It does not compile"],
    correctIndex: 1,
    explanation: "charAt(0) + charAt(0) adds two char values as numbers (97 + 97 = 194) before the string is involved. The result is the digits 194, 196 and 198 joined together. Starting with \"\" would concatenate instead.",
    optionFeedback: [
      "That is what the method was meant to return. The first + adds two chars as numbers.",
      "Correct. 97 + 97 = 194, 98 + 98 = 196, 99 + 99 = 198.",
      "The method does not return the string unchanged.",
      "It compiles: a number joined to a String with + is converted to text."
    ]
  },
  {
    group: "Writing methods",
    question: "A recursive binary search with lo = 3 and hi = 4 finds a[3] smaller than the key and calls search(a, key, mid, hi) instead of (mid + 1, hi). What happens?",
    options: ["It finds the key", "It returns -1", "It ends in a StackOverflowError", "It throws ArrayIndexOutOfBoundsException"],
    correctIndex: 2,
    explanation: "mid is 3, so the call repeats the same range (3, 4). The range never shrinks and the calls repeat until the stack is full. Both new ranges must exclude mid.",
    optionFeedback: [
      "The key is larger than a[mid], so the same position is examined again and again.",
      "-1 is returned only when lo becomes greater than hi. The range never shrinks.",
      "Correct. The same call repeats forever.",
      "The indexes stay within the array; the problem is the repeated call."
    ]
  },
  {
    group: "Writing methods",
    question: "Why does a recursive maximum of an int array use i == a.length - 1 as its base case, and what happens on an empty array?",
    options: [
      "A maximum of nothing does not exist; the empty array throws ArrayIndexOutOfBoundsException",
      "It is only a style choice; the empty array returns 0",
      "It saves one comparison; the empty array returns -1",
      "It is required for all array recursion; the empty array returns null"
    ],
    correctIndex: 0,
    explanation: "A sum has an identity value for nothing (0), so its base case can be i == a.length. A maximum has none, so the base case is the last element and the method has the precondition that the array is not empty.",
    optionFeedback: [
      "Correct. State the precondition in the answer.",
      "The method has no value to return for nothing, and a[0] throws on an empty array.",
      "No value is returned: a[0] is read before anything can be compared.",
      "Other array recursions (a sum, a count) use i == a.length. And an int method cannot return null."
    ]
  },
  {
    group: "Writing methods",
    question: "The choose-or-leave subsets method calls itself twice until the index reaches the length. How many calls does it make for an array of 3 elements?",
    options: ["8", "7", "15", "3"],
    correctIndex: 2,
    explanation: "There are 1 + 2 + 4 + 8 = 15 calls: one at depth 0, two at depth 1, four at depth 2, eight at depth 3. In general 2 to the (n + 1) minus 1.",
    optionFeedback: [
      "8 is the number of subsets, which is the number of calls that reach the end.",
      "7 is the number of calls for 2 elements.",
      "Correct. The calls at every depth are counted, not only the last.",
      "Each call makes two more, so the count is exponential, not 3."
    ]
  },
  {
    group: "Writing methods",
    question: "How many moves do 4 disks need in Towers of Hanoi?",
    options: ["8", "15", "16", "31"],
    correctIndex: 1,
    explanation: "moves(n) = 2 * moves(n - 1) + 1, which is 2 to the n minus 1. For 4 disks that is 15.",
    optionFeedback: [
      "8 is 2 cubed. The formula is 2 to the n minus 1, with n = 4.",
      "Correct. 1, 3, 7, 15.",
      "16 is 2 to the 4. One move less is needed.",
      "31 is the number of moves for 5 disks."
    ]
  },
  {
    group: "Cost and conversion",
    question: "Recursive linear search over N absent items uses what auxiliary stack space?",
    options: ["O(N)", "O(1)", "O(log N)", "O(N²)"],
    correctIndex: 0,
    explanation: "One active call exists for each searched position plus the base case.",
    optionFeedback: [
      "Correct. The calls are nested one inside the next.",
      "O(1) would need the calls to finish before the next starts, as in a loop.",
      "O(log N) is the depth of a halving recursion, not a one-by-one search.",
      "The stack grows by one frame per position, which is linear."
    ]
  },
  {
    group: "Cost and conversion",
    question: "Does Java guarantee tail-call optimisation?",
    options: ["No", "Yes for every static method", "Only for int", "Only inside arrays"],
    correctIndex: 0,
    explanation: "Do not assume tail recursion consumes constant stack space in Java.",
    optionFeedback: [
      "Correct. An accumulator version still uses one frame per call.",
      "Java does not turn static methods into loops.",
      "The parameter type makes no difference.",
      "Arrays make no difference."
    ]
  },
  {
    group: "Cost and conversion",
    question: "A recursive call changes n to n + 1 while the base case is n == 0 and n starts positive. What happens?",
    options: ["It moves away and can overflow the stack", "It terminates immediately", "It becomes iterative", "It returns null"],
    correctIndex: 0,
    explanation: "The changing input does not progress toward the base case.",
    optionFeedback: [
      "Correct. n grows and never reaches 0.",
      "The base case is true only when n is 0, so the call does not stop at once.",
      "Java never converts a recursion into a loop on its own.",
      "An int method cannot return null."
    ]
  },
  {
    group: "Cost and conversion",
    question: "A halving recursion adds 64 array elements. The first call is depth 1. What is the greatest depth?",
    options: ["7", "6", "64", "65"],
    correctIndex: 0,
    explanation: "The range is halved 6 times (64, 32, 16, 8, 4, 2, 1), so there are 7 levels including the first. The one-at-a-time version would reach depth 65.",
    optionFeedback: [
      "Correct. log2 64 = 6 halvings plus the first level.",
      "6 is the number of halvings; the first call is depth 1, so the greatest depth is one more.",
      "64 would be the depth if the range shrank by one each call.",
      "65 is the depth of the one-at-a-time version, which also makes a call for the empty range."
    ]
  },
  {
    group: "Cost and conversion",
    question: "Plain recursive fib(30) makes 2,692,537 calls. How many calls does a memoised version make?",
    options: ["30", "59", "1,346,269", "2,692,536"],
    correctIndex: 1,
    explanation: "Each value is computed once and later calls reuse it, so there are about two calls per value: 59 for fib(30). The recursive shape is unchanged.",
    optionFeedback: [
      "30 is the number of passes of the loop version. The memoised recursion also makes the cheap calls that read the table.",
      "Correct. About 2n - 1 calls instead of an exponential number.",
      "That is roughly half of the plain count and not what memoisation achieves.",
      "Memoisation removes almost all of the repeated calls."
    ]
  },
  {
    group: "Cost and conversion",
    question: "A loop runs while (n != 1) and changes the variables n and steps. In the recursive version of the loop, what are the base case and its return value?",
    options: ["n == 1; returns steps", "n != 1; returns n", "n == 0; returns steps", "n == 1; returns n"],
    correctIndex: 0,
    explanation: "The base case is the opposite of the loop condition, and it returns the variable that holds the answer. The updates to n and steps become the arguments of the recursive call.",
    optionFeedback: [
      "Correct. The loop stops when n == 1, and steps holds the answer.",
      "n != 1 is the loop condition, which becomes the recursive case, not the base case.",
      "The loop stops at 1, not at 0.",
      "The base case is right, but the answer is in steps, not n."
    ]
  },
];
